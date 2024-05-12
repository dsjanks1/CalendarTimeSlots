//  Time block which has a start and end time
interface TimeBlock  {
    start: Date;
    end: Date;
};

// user can have many booked timeslots
interface User {
    id: number;
    bookedTimes: TimeBlock[];
};

// Get minutes since midnight from a Date object
const minutesSinceMidnight = (date: Date): number => {
    return date.getHours() * 60 + date.getMinutes();
};

// Date object from minutes since midnight
// This helps convert minutes back into a Date object for output formatting.
const dateFromMinutes = (minutes: number, referenceDate: Date): Date => {
    const date = new Date(referenceDate);
    date.setHours(0, 0, 0, 0); // Reset to midnight
    date.setMinutes(minutes);
    return date;
};

// Get available meeting times based on users list of users current booked times in a day for a specific length of time
const getAvailableTimes = (users: User[], meetingLength: number, referenceDate: Date): string[] => {
    let allBookedTimes: TimeBlock[] = [];

    // Consolidate all booked times from all users
    users.forEach(user => {
        allBookedTimes = allBookedTimes.concat(user.bookedTimes);
    });

    // Sort all time blocks by start time
    allBookedTimes.sort((a, b) => minutesSinceMidnight(a.start) - minutesSinceMidnight(b.start));

    // Merge overlapping booked times
    let consolidatedTimes: TimeBlock[] = [];
    allBookedTimes.forEach(block => {
        // Checks if no blocks have been found yet and if the current block starts after the 
        // last block in consolidatedTimes ends. 
        // If true, it means there is a gap between the two blocks, so they do not overlap.
        if (consolidatedTimes.length === 0 || minutesSinceMidnight(consolidatedTimes[consolidatedTimes.length - 1].end) < minutesSinceMidnight(block.start)) {
            consolidatedTimes.push({...block});
        } else {
            consolidatedTimes[consolidatedTimes.length - 1].end = new Date(Math.max(consolidatedTimes[consolidatedTimes.length - 1].end.getTime(), block.end.getTime()));
        }
    });
    // console.log('consolidatedTimes---',consolidatedTimes)

    // Calculate available times
    let availableTimes: string[] = [];
    let previousEnd = minutesSinceMidnight(new Date(referenceDate.setHours(0, 0, 0, 0)));
    
    // Calculate the free time slots between merged, consolidated booked times

    // Below ensures that these time slots are at least as long as the required meeting length, 
    // converting them into user-friendly time strings that can be directly utilized or displayed. 
    consolidatedTimes.forEach(block => {
        const currentStart = minutesSinceMidnight(block.start);
        // console.log(currentStart,'--', previousEnd)
        if (currentStart - previousEnd >= meetingLength) {
            availableTimes.push(`${dateFromMinutes(previousEnd, referenceDate).toLocaleTimeString()} - ${dateFromMinutes(currentStart, referenceDate).toLocaleTimeString()}`);
        }
        previousEnd = minutesSinceMidnight(block.end);
    });

    

    // Check for time after the last booking till midnight
    const endOfDay = minutesSinceMidnight(new Date(referenceDate.setHours(23, 59, 59, 999)));
    if (endOfDay - previousEnd >= meetingLength) {
        availableTimes.push(`${dateFromMinutes(previousEnd, referenceDate).toLocaleTimeString()} - Midnight`);
    }

    return availableTimes;
};

// Example usage
const today = new Date();
const users: User[] = [
    { id: 1, bookedTimes: [{ start: new Date(today.setHours(9, 0)), end: new Date(today.setHours(10, 30)) }, 
        { start: new Date(today.setHours(12, 0)), end: new Date(today.setHours(13, 0)) }] },
    { id: 2, bookedTimes: [{ start: new Date(today.setHours(11, 0)), end: new Date(today.setHours(11, 30)) }] }
];
console.log(getAvailableTimes(users, 30, new Date()));  // Example call
