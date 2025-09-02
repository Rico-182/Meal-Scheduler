## Project Description ##
This project is a full‑stack web application that helps two people quickly coordinate a meal by finding mutual free times which also overlap with dining hall hours. 
It automatically creating a Google Calendar invite. The project includes:
* Backend: a Node.js/Express server using MongoDB (via Mongoose) to store meal requests and user details. The server authenticates users through Google OAuth and interacts with the Google Calendar API to read busy events and schedule new meetings.
* Frontend: a React application built with Vite and Tailwind CSS. It provides a friendly UI for creating meal requests, sharing an invitation link and selecting a matching time.

The goal is to remove the manual back‑and‑forth that typically accompanies planning meals with someone in college. 


## User Workflow ##
Sign in with Google. When you visit the site, click “Sign in with Google”. The app redirects to Google OAuth and then back to /dashboard once authenticated. The user's Google profile and access token are stored securely in MongoDB.
1. Create a meal request. On the dashboard, fill out the meal scheduling form:
* Timeframe vs. Specific Date. Choose whether you want to meet within the next 3 days, the next week or two weeks, or pick an exact date using the calendar widget
* Minimum duration. Select how long you’d like to meet (15–60 minutes).
2. Share the link. A success modal shows the generated link, e.g. /schedule/<requestId>. Copy it and send it to your friend.
3. Invitee opens the link. When the other person follows the link, they log in with Google and arrive at the Schedule Page. The available slots appear as cards displaying the meal type (Breakfast, Lunch or Dinner) and start/end times. Once a slot is selected, both participants receive an email from Google Calendar and the event shows up in their calendars!

## 🧠 How the Scheduling Algorithm Works ##
The algorithm was created by combining Google Calendar data with simple but effective time‑slot computations.
1. Creating a request – When the initiator submits the form, the server stores their preferences—date range or specific date, minimum meeting length, and preferred dining halls—along with their Google ID, name, and email. The request is saved in a document on MongoDB and a shareable link is returned.
2. Retrieving events – When the invitee opens the link, the server fetches calendar events for both users over the next few days (timeMin = now; timeMax = now + 3 days) and orders them by start time. The list of events (with start and end timestamps) represents the periods during which each person is busy (has something scheduled on GCal).
3. Finding free intervals – For each meal window—Breakfast (07:30–10:00), Lunch (11:30–14:00), and Dinner (17:30–19:30)—the algorithm calculates free time by eliminating busy periods. The *invertBusyBlocks* function essentially takes the ordered list of busy events and flips it around: it identifies all busy blocks and constructs free blocks representing everything except the busy blocks. This yields potential free intervals during the current meal window.
4. Intersecting schedules – Once free blocks are computed for both users, the *intersectBlocks* function compares each free interval of user A with each free interval of user B. If the overlap between their free slots meets or exceeds the chosen minimum duration, a candidate slot is produced.
5. Enumerating days – For date‑range requests, the getFreeMealSlots function loops over the chosen range (e.g., 3 days, 1 week, or 2 weeks). For each day and each meal window, it converts the start and end times into proper date objects, calls *invertBusyBlocks* for both users, and then calls intersectBlocks to find mutual availability. Only slots that fall entirely within the selected meal window and are not in the past are kept. For specific‑date requests, the *getSpecificMealSlots* function performs the same logic but on a single date.
6. Returning matched slots – The resulting list of slots (each with a meal name and start/end time) is saved to the meal request and returned to the frontend. If no slots are available, the UI displays a “No mutual meal slots found” message.
