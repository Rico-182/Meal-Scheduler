// backend/routes/auth.routes.js
import express from 'express';
import axios from 'axios';
import User from '../models/user.model.js'
import {requireGoogleLogin} from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/google', (req, res) => {
  const redirect_uri = 'http://localhost:5001/api/auth/google/callback';
  const client_id = process.env.GOOGLE_CLIENT_ID;
  const scope = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&access_type=offline&prompt=consent`;

  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code;
  const redirect_uri = 'http://localhost:5001/api/auth/google/callback';
  try {
        
    const { data } = await axios.post('https://oauth2.googleapis.com/token', null, {
        params: {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri,
        grant_type: 'authorization_code',
        },
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    // This gives a cookie to the browser. 
    const {access_token, refresh_token, expires_in} = data;

    // Gets relevant user data.
    const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
        Authorization: `Bearer ${access_token}`,
        },
    });

    // Create a new User if not yet exists 
    const user = await User.findOneAndUpdate(
        { googleId: userInfo.sub },
        {
        googleId: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        accessToken: access_token,
        },
        { upsert: true, new: true }
    );
    // if change this, change logout as well!!
    res.cookie('access_token', access_token, {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        maxAge: expires_in * 1000, // in ms
        sameSite: 'Lax',
    });

    res.redirect(`http://localhost:5173/dashboard`);

  } catch (error) {
    console.log(error);
  }
});

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: false,     // must match how it was set
      sameSite: 'Lax',   // must match how it was set
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

router.post('/logout', logout);

router.get('/check', requireGoogleLogin, checkAuth);

export default router;
