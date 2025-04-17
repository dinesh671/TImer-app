import { useState, useEffect } from 'react';
import './App.css';
import Timer from './Components/Timer';
import TimerAdd from './Components/TimerAdd';
import { saveTimers, loadTimers } from './utils/storage';
import {
  MdExpandMore,
  MdExpandLess,
  MdPlayArrow,
  MdPause,
  MdRefresh,
  MdHistory,
  MdLightMode,
  MdDarkMode,
} from 'react-icons/md';

function App() {
  const [timers, setTimers] = useState([]);
  const [completedTimers, setCompletedTimers] = useState([]);
  const [showAddTimer, setShowAddTimer] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedHistory, setExpandedHistory] = useState({});
  const [runningTimers, setRunningTimers] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  useEffect(() => {
    const savedTimers = loadTimers();
    setTimers(savedTimers);

    // Initialize all categories as expanded
    const categories = [...new Set(savedTimers.map((timer) => timer.category))];
    const initialExpandedState = {};
    categories.forEach((category) => {
      initialExpandedState[category] = true;
    });
    setExpandedCategories(initialExpandedState);
  }, []);

  useEffect(() => {
    // Update theme class on document
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleSaveTimer = (newTimer) => {
    const updatedTimers = [...timers, newTimer];
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
    setShowAddTimer(false);

    // Ensure the new category is expanded
    if (!expandedCategories[newTimer.category]) {
      setExpandedCategories({
        ...expandedCategories,
        [newTimer.category]: true,
      });
    }
  };

  const handleDeleteTimer = (timerId) => {
    const updatedTimers = timers.filter((timer) => timer.id !== timerId);
    setTimers(updatedTimers);
    saveTimers(updatedTimers);
  };

  const handleTimerComplete = (completedTimer) => {
    // Add completion timestamp
    const timerWithCompletion = {
      ...completedTimer,
      completedAt: new Date().toISOString(),
    };

    // Remove from active timers and add to completed timers
    setTimers((prev) => prev.filter((timer) => timer.id !== completedTimer.id));
    setCompletedTimers((prev) => [...prev, timerWithCompletion]);
    saveTimers(timers.filter((timer) => timer.id !== completedTimer.id));
  };

  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };

  const toggleHistory = (category) => {
    setExpandedHistory({
      ...expandedHistory,
      [category]: !expandedHistory[category],
    });
  };

  // Group timers by category
  const groupedTimers = timers.reduce((groups, timer) => {
    const category = timer.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(timer);
    return groups;
  }, {});

  // Group completed timers by category
  const groupedCompletedTimers = completedTimers.reduce((groups, timer) => {
    const category = timer.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(timer);
    return groups;
  }, {});

  // Get all unique categories
  const categories = [
    ...new Set([
      ...Object.keys(groupedTimers),
      ...Object.keys(groupedCompletedTimers),
    ]),
  ];

  // Category control functions
  const startAllTimersInCategory = (category) => {
    const categoryTimers = groupedTimers[category];
    const updatedRunningTimers = { ...runningTimers };

    categoryTimers.forEach((timer) => {
      updatedRunningTimers[timer.id] = true;
    });

    setRunningTimers(updatedRunningTimers);
  };

  const pauseAllTimersInCategory = (category) => {
    const categoryTimers = groupedTimers[category];
    const updatedRunningTimers = { ...runningTimers };

    categoryTimers.forEach((timer) => {
      updatedRunningTimers[timer.id] = false;
    });

    setRunningTimers(updatedRunningTimers);
  };

  const resetAllTimersInCategory = (category) => {
    const categoryTimers = groupedTimers[category];
    const updatedRunningTimers = { ...runningTimers };

    categoryTimers.forEach((timer) => {
      updatedRunningTimers[timer.id] = false;
    });

    setRunningTimers(updatedRunningTimers);

    const updatedTimers = timers.map((timer) => {
      if (categoryTimers.some((catTimer) => catTimer.id === timer.id)) {
        return { ...timer, reset: true };
      }
      return timer;
    });

    setTimers(updatedTimers);

    setTimeout(() => {
      setTimers(
        timers.map((timer) => {
          if (categoryTimers.some((catTimer) => catTimer.id === timer.id)) {
            const newTimer = { ...timer };
            delete newTimer.reset;
            return newTimer;
          }
          return timer;
        })
      );
    }, 100);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'
      } p-4 rounded-xl transition-colors duration-200`}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 gap-4">
          <div className="mb-6 md:mb-0">
            <h1
              className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}
            >
              My Timers
            </h1>
            <p
              className={`mt-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Manage your timers efficiently
            </p>
          </div>
          <div className="flex gap-4 self-start md:self-auto">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-lg font-semibold focus:outline-none transition-all duration-200 transform hover:scale-105 ${
                isDarkMode
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
              title={
                isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
              }
            >
              {isDarkMode ? (
                <MdLightMode className="h-6 w-6" />
              ) : (
                <MdDarkMode className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => setShowAddTimer(!showAddTimer)}
              className={`${
                isDarkMode
                  ? 'text-white border-white hover:bg-white hover:text-gray-900'
                  : 'text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white'
              } border px-6 py-3 rounded-lg font-semibold focus:outline-none transition-all duration-200 transform hover:scale-105`}
            >
              {showAddTimer ? 'Cancel' : '+ Create Timer'}
            </button>
          </div>
        </div>

        {showAddTimer && (
          <div className="mb-8">
            <TimerAdd
              onSave={handleSaveTimer}
              existingTimers={timers}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {timers.length === 0 && completedTimers.length === 0 ? (
          <div className="text-center py-12">
            <div
              className={`${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              } mb-4`}
            >
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3
              className={`text-xl font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-2`}
            >
              No timers yet
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
              Create your first timer to get started
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category) => (
              <div
                key={category}
                className={`${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                } rounded-xl shadow-md overflow-hidden transition-colors duration-200`}
              >
                <div
                  className={`flex justify-between items-center p-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <button
                    onClick={() => toggleCategory(category)}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                    }`}
                  >
                    <h2
                      className={`text-xl font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {category}
                    </h2>
                    <span
                      className={`ml-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    >
                      {expandedCategories[category] ? (
                        <MdExpandLess className="h-6 w-6" />
                      ) : (
                        <MdExpandMore className="h-6 w-6" />
                      )}
                    </span>
                  </button>

                  {groupedTimers[category]?.length > 0 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startAllTimersInCategory(category)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none"
                        title="Start all timers in this category"
                      >
                        <MdPlayArrow className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => pauseAllTimersInCategory(category)}
                        className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 focus:outline-none"
                        title="Pause all timers in this category"
                      >
                        <MdPause className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => resetAllTimersInCategory(category)}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 focus:outline-none"
                        title="Reset all timers in this category"
                      >
                        <MdRefresh className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                {expandedCategories[category] && (
                  <>
                    {groupedTimers[category]?.length > 0 && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupedTimers[category].map((timer) => (
                          <Timer
                            key={timer.id}
                            timer={timer}
                            onDelete={() => handleDeleteTimer(timer.id)}
                            onComplete={handleTimerComplete}
                            onRunningChange={(isRunning) => {
                              setRunningTimers({
                                ...runningTimers,
                                [timer.id]: isRunning,
                              });
                            }}
                            isDarkMode={isDarkMode}
                          />
                        ))}
                      </div>
                    )}

                    {groupedCompletedTimers[category]?.length > 0 && (
                      <div
                        className={`border-t ${
                          isDarkMode ? 'border-gray-700' : 'border-gray-200'
                        }`}
                      >
                        <button
                          onClick={() => toggleHistory(category)}
                          className={`w-full flex items-center justify-between p-4 transition-colors duration-200 ${
                            isDarkMode
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <MdHistory
                              className={`h-5 w-5 mr-2 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}
                            />
                            <span
                              className={`font-medium ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                              }`}
                            >
                              History ({groupedCompletedTimers[category].length}
                              )
                            </span>
                          </div>
                          <span
                            className={
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }
                          >
                            {expandedHistory[category] ? (
                              <MdExpandLess className="h-5 w-5" />
                            ) : (
                              <MdExpandMore className="h-5 w-5" />
                            )}
                          </span>
                        </button>

                        {expandedHistory[category] && (
                          <div
                            className={`p-4 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            }`}
                          >
                            <div className="space-y-4">
                              {groupedCompletedTimers[category].map((timer) => (
                                <div
                                  key={timer.id}
                                  className={`${
                                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                                  } p-4 rounded-lg shadow-sm`}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3
                                        className={`text-lg font-medium ${
                                          isDarkMode
                                            ? 'text-white'
                                            : 'text-gray-800'
                                        }`}
                                      >
                                        {timer.name}
                                      </h3>
                                      <p
                                        className={
                                          isDarkMode
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                        }
                                      >
                                        Duration:{' '}
                                        {Math.floor(timer.duration / 60)}m{' '}
                                        {timer.duration % 60}s
                                      </p>
                                    </div>
                                    <span
                                      className={
                                        isDarkMode
                                          ? 'text-gray-400'
                                          : 'text-gray-500'
                                      }
                                    >
                                      {formatDate(timer.completedAt)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
