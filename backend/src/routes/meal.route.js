// backend/routes/meal.routes.js
import express from 'express';
import axios from 'axios';
import mealRequest from '../models/mealrequest.model.js';
import { getFreeMealSlots, getSpecificMealSlots } from '../utils/getFreeEvents.js';
import User from '../models/user.model.js';
import {requireGoogleLogin} from '../middleware/auth.middleware.js';
import createMealEvent from '../utils/createGCalEvent.js';

const router = express.Router();

router.get('/events', async (req, res) => {
    const accessToken = req.cookies.access_token;
  if (!accessToken) return res.status(401).json({ error: 'Not logged in' });

  try {
    const calendarResponse = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            timeMin: new Date().toISOString(),
            timeMax: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
          },
        }
      );
    const allCalData = calendarResponse.data;
    const events = allCalData.items;
    for (let e of events) {
        console.log(e.start);
        console.log(e.end);
    }
    return res.status(200).json(events);
  } catch (error) {
    console.log("Error: ", error.message);
    return res.status(403).json({error});
  }
});

router.post('/meal-request', requireGoogleLogin, async (req, res) => {
    const { dateRange, preferredDHalls, specificDate, minTime } = req.body;
    if (!dateRange || !['next_3_days', 'next_week', 'next_2_weeks'].includes(dateRange)) {
        return res.status(400).json({ error: 'Invalid or missing dateRange' });
    }

    try {
        const mealReq = new mealRequest({
          initiatorGoogleId: req.user.googleId, // From auth middleware
          initiatorName: req.user.name, 
          initiatorEmail: req.user.email,
          dateRange,
          preferredDiningHalls: preferredDHalls || [],
          specificDate,
          minTime,
        });
    
        await mealReq.save();
    
        res.status(201).json({
          message: 'Meal request created successfully',
          shareableLink: `/schedule/${mealReq._id}`
        });
      } catch (err) {
        console.error('Error creating meal request:', err);
        res.status(500).json({ error: 'Failed to create meal request' });
      }
});

router.get('/request-verify/:id', requireGoogleLogin, async (req, res) => {
    const {id} = req.params;
    try {
        const mealReq = await mealRequest.findById(id);
        if (!mealReq) return res.status(404).json({message: "Couldn't get meal request!"});
        return res.status(200).json({mealRequest: mealReq});
    } catch (error) {
        return res.status(404).json({error});
    }
})

router.post('/match/:id', requireGoogleLogin, async (req, res) => {
    const { id } = req.params;
    try {
        const mealReq = await mealRequest.findById(id);
        if (!mealReq) return res.status(404).json({message: "Could not find the given meal Request"});

        // if (mealReq.status !== 'pending') {
        //     return res.status(400).json({ error: 'This request has already been matched or confirmed' });
        // }

        const userA_googleId = mealReq.initiatorGoogleId;
        const userA = await User.findOne({googleId: userA_googleId});
        const userA_accessToken = userA.accessToken;

        if (!userA_accessToken) {
            return res.status(404).json({message: "Could not find the needed access token"});
        }

        const userB_accessToken = req.cookies.access_token;

        try {
            let calendarResponse = await axios.get(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                  headers: {
                    Authorization: `Bearer ${userA_accessToken}`,
                  },
                  params: {
                    timeMin: new Date().toISOString(),
                    timeMax: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                  },
                }
              );
            let allCalData = calendarResponse.data;
            const userA_events = allCalData.items;

            calendarResponse = await axios.get(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                  headers: {
                    Authorization: `Bearer ${userB_accessToken}`,
                  },
                  params: {
                    timeMin: new Date().toISOString(),
                    timeMax: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    singleEvents: true,
                    orderBy: 'startTime',
                  },
                }
              );
            allCalData = calendarResponse.data;
            const userB_events = allCalData.items;
            let slots;
            if (!mealReq.specificDate) {
              slots = getFreeMealSlots(userA_events, userB_events, mealReq.dateRange, mealReq.minTime);
            } else {
              slots = getSpecificMealSlots(userA_events, userB_events, mealReq.specificDate, mealReq.minTime);
            }
            
            // update database request, send the results to user B. 
            await mealRequest.findByIdAndUpdate(id, {
                matchedSlots: slots, 
                // status
                inviteeGoogleId: req.user.googleId,
                inviteeName: req.user.name,
                inviteeEmail: req.user.email,
            })
            return res.status(200).json({ matchedSlots: slots });
        }
        catch (error) {
            console.log(error.message);
            return res.status(500).json({error});
        }
    } catch (error) {
        return res.status(500).json({error});
    } 
});

router.post('/create-invite/:id', requireGoogleLogin, async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedSlot } = req.body;
    const mealData = await mealRequest.findById(id);
    mealData.selectedSlot = selectedSlot;
    await mealData.save();
    const result = await createMealEvent(req.accessToken, id);
    return res.status(200).json({message: "Successfully created GCal Event!"});
  } catch (error) {
    console.log(error.message);
  }
})




export default router;