# Timer Application

A modern, feature-rich timer application built with React and Tailwind CSS. This application allows users to create, manage, and track multiple timers with different categories.

## Features

- 🕒 Create multiple timers with custom names and durations
- 📱 Responsive design that works on all devices
- 🌓 Dark mode support
- 🏷️ Category-based organization
- ⚡ Real-time countdown with millisecond precision
- 💾 Local storage persistence
- 🎯 Category-level controls (start/pause/reset all timers in a category)
- 📊 Visual progress tracking
- 🗑️ Timer deletion with confirmation
- 📝 Custom category support

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Creating a Timer

1. Click the "Create Timer" button
2. Enter a name for your timer
3. Set the duration in minutes and seconds
4. Select a category (Workout, Study, Break, or Other)
5. If selecting "Other", enter a custom category name
6. Click "Create Timer" to save

### Managing Timers

- **Start/Pause**: Click the play/pause button on any timer
- **Reset**: Click the reset button to restart the timer
- **Delete**: Click the trash icon to remove a timer
- **Category Controls**: Use the category-level buttons to control all timers in a category

### Dark Mode

Toggle between light and dark mode using the theme button in the top right corner.

## Technologies Used

- React
- Tailwind CSS
- React Icons
- Local Storage API

## Project Structure

```
src/
├── Components/
│   ├── Timer.jsx       # Individual timer component
│   └── TimerAdd.jsx    # Timer creation form
├── utils/
│   └── storage.js      # Local storage utilities
├── App.jsx             # Main application component
└── main.jsx           # Application entry point
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
