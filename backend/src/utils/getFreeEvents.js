import { parseISO, formatISO, isBefore, isAfter, addDays, startOfDay } from 'date-fns';
import { DateTime } from 'luxon';

const invertBusyBlocks = (mealStart, mealEnd, events) => {
    const MIN_SLOT_MS = 30 * 60 * 1000; // 30 minutes
    let freeSlots = [];

    let curr = new Date(mealStart.getTime());

    for (const e of events) {
        if (curr >= mealEnd) {
            break;
        }
        
        let eStartTime = new Date(e.start.dateTime);
        let eEndTime = new Date(e.end.dateTime);
        if (eEndTime <= mealStart || eStartTime >= mealEnd) {
            continue; // the event does not intersect with the meal at all. 
        }

        // previously, there was a bug where eEnd would go back to the earliest date.

        let eStart = new Date(Math.max(eStartTime.getTime(), mealStart.getTime()));
        let eEnd = new Date(Math.min(eEndTime.getTime(), mealEnd.getTime()));

        // if two events overlap
        if (curr > eStart) {
            curr = eEnd; 
            continue;
        }
        // curr to e Start;
        let duration = eStart - curr;
        if (duration >= MIN_SLOT_MS) {
            freeSlots.push([curr, eStart]);
        }
        curr = eEnd;
    }
    if (curr < mealEnd) {
        const duration = mealEnd - curr;
        if (duration >= MIN_SLOT_MS) {
          freeSlots.push([curr, mealEnd]);
        }
    }
    return freeSlots;
}
  
const intersectBlocks = (blocksA, blocksB, minTime_mins) => {
    const results = [];
    const minTime_ms = minTime_mins * 60 * 1000
    for (const [aStart, aEnd] of blocksA) {
        for (const [bStart, bEnd] of blocksB) {
            if ((aStart <= bEnd && aStart >= bStart) || (bStart <= aEnd && bStart >= aStart)) {
                const start = new Date(Math.max(aStart.getTime(), bStart.getTime()));
                const end = new Date(Math.min(aEnd.getTime(), bEnd.getTime()));
                
                if (end - start >= minTime_ms) {
                  results.push([start, end]);
                }
            }
        }
    }
    return results
}


export const getFreeMealSlots = (eventsA, eventsB, dateRange, minTime) => {
    const MEAL_WINDOWS = {
        Breakfast: { start: '07:30', end: '10:00' },
        Lunch:     { start: '11:30', end: '14:00' },
        Dinner:    { start: '17:30', end: '19:30' },
    };
    // parse dateRange
    let days = 7;
    if (dateRange === "next_week") {
    } else if (dateRange === "next_3_days") {
        days = 3;
    } else if (dateRange === "next_2_weeks") {
        days = 14;
    }

    const today = DateTime.now().setZone('America/New_York').startOf('day');
    const now = DateTime.now().setZone('America/New_York');
    const temp = []
    for (let d_offset = 0; d_offset < days; d_offset++) {
        let base = today.plus({ days: d_offset });

        for (const [meal_name, {start, end}] of Object.entries(MEAL_WINDOWS)) {
            
            // convert start, end dates into date object. 
            const [startHour, startMin] = start.split(':').map(Number);
            const [endHour, endMin] = end.split(':').map(Number);

            const mealStart = base.set({ hour: startHour, minute: startMin });
            const mealEnd = base.set({ hour: endHour, minute: endMin });

            const freeA = invertBusyBlocks(mealStart.toJSDate(), mealEnd.toJSDate(), eventsA);
            const freeB = invertBusyBlocks(mealStart.toJSDate(), mealEnd.toJSDate(), eventsB);

            const intersections = intersectBlocks(freeA, freeB, minTime); 
            for (const [start, end] of intersections) {
                if (start.toDateString() !== end.toDateString()) {
                    continue;
                }
                // max and min to make sure it all fits into the Dhall Slots
                const mStart = new Date(Math.max(start, mealStart.toJSDate()));
                const mEnd = new Date(Math.min(end, mealEnd.toJSDate()));
                if (mEnd < now.toJSDate()) {
                    continue;
                }
                temp.push({
                    meal_name, start: mStart, end: mEnd
                })
            }
        }
    }
    return temp;
}

export const getSpecificMealSlots = (eventsA, eventsB, date, minTime) => {
    const MEAL_WINDOWS = {
        Breakfast: { start: '07:30', end: '10:00' },
        Lunch:     { start: '11:30', end: '14:00' },
        Dinner:    { start: '17:30', end: '19:30' },
    };
    const today = DateTime.fromISO(date, {zone: 'America/New_York'});
    const now = DateTime.now().setZone('America/New_York');
    const temp = []

    for (const [meal_name, {start, end}] of Object.entries(MEAL_WINDOWS)) {
        
        // convert start, end dates into date object. 
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);

        const mealStart = today.set({ hour: startHour, minute: startMin });
        const mealEnd = today.set({ hour: endHour, minute: endMin });

        const freeA = invertBusyBlocks(mealStart.toJSDate(), mealEnd.toJSDate(), eventsA);
        const freeB = invertBusyBlocks(mealStart.toJSDate(), mealEnd.toJSDate(), eventsB);

        const intersections = intersectBlocks(freeA, freeB, minTime); 
        for (const [start, end] of intersections) {
            if (start.toDateString() !== end.toDateString()) {
                continue;
            }
            // max and min to make sure it all fits into the Dhall Slots
            const mStart = new Date(Math.max(start, mealStart.toJSDate()));
            const mEnd = new Date(Math.min(end, mealEnd.toJSDate()));
            if (mEnd < now.toJSDate()) {
                continue;
            }
            temp.push({
                meal_name, start: mStart, end: mEnd
            })
        }
    }
    return temp;
}