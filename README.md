# Calendar Time Slots

This TypeScript project helps manage and calculate available time slots in a calendar. It provides functionalities to identify available meeting times based on users' booked times within a day. The project is structured around key TypeScript interfaces and functions designed for handling time calculations efficiently.

## Features

- **Time Block Management**: Define time blocks with start and end times using the `TimeBlock` interface.
- **User Bookings**: Manage user-specific booked time slots using the `User` interface.
- **Availability Calculation**: Dynamically calculate available time slots for meetings given a list of users and their booked times.

## Usage

The following TypeScript code snippets illustrate how to use the functions in this project:

### Defining Time Blocks and Users

```typescript
interface TimeBlock {
    start: Date;
    end: Date;
};

interface User {
    id: number;
    bookedTimes: TimeBlock[];
};
