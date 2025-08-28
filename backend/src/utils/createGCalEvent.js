import axios from "axios";
import mealrequestModel from "../models/mealrequest.model.js";

const createMealEvent = async (accessToken, id) => {
  const mealData = await mealrequestModel.findById(id);
    try {
        const response = await axios.post(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
              summary: `Meal: ${mealData.initiatorName} x ${mealData.inviteeName} via yMeals`,
              location: mealData.diningHall,
              description: 'Scheduled through yMeals!',
              start: {
                dateTime: mealData.selectedSlot.startTime, // ISO string
                timeZone: 'America/New_York',
              },
              end: {
                dateTime: mealData.selectedSlot.endTime, // ISO string
                timeZone: 'America/New_York',
              },
              attendees: [
                { email: mealData.initiatorEmail },
                { email: mealData.inviteeEmail },
              ],
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              params: {
                sendUpdates: 'all', // optional: emails invite
              },
            }
          );   
      if (response) return response.data;
         
    } catch (error) {
        console.log('Error: ', error.message);
    }
    
  };

export default createMealEvent;
  