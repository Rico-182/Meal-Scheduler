// backend/middleware/auth.middleware.js
import axios from "axios";
export const requireGoogleLogin = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
      return res.status(401).json({ message: 'Not authenticated. Please log in with Google.' });
    }
    try {
        // Verify access token and get user info
        const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        req.accessToken = accessToken;
        req.user = {
          googleId: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
        };
        next(); // pass control to the actual route
      } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Invalid access token' });
      }
};
  