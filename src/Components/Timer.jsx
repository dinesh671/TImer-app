import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { MdPlayArrow, MdPause, MdRefresh } from 'react-icons/md';

function Timer({
  timer,
  onDelete,
  onComplete,
  isRunning: externalIsRunning,
  onRunningChange,
  isDarkMode,
}) {
  const [timeLeft, setTimeLeft] = useState(timer.duration * 1000); // Convert to milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalDuration = timer.duration * 1000; // Store total duration in milliseconds

  // Handle external control
  useEffect(() => {
    if (externalIsRunning !== undefined && externalIsRunning !== isRunning) {
      setIsRunning(externalIsRunning);
    }
  }, [externalIsRunning]);

  // Handle timer reset from category control
  useEffect(() => {
    if (timer.reset) {
      setTimeLeft(timer.duration * 1000);
      setIsRunning(false);
      setIsCompleted(false);
    }
  }, [timer]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 10) {
            // Timer completed
            setIsRunning(false);
            setIsCompleted(true);
            onRunningChange?.(false);
            onComplete?.(timer);
            return 0;
          }
          return prev - 10;
        });
      }, 10);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onRunningChange, onComplete, timer]);

  const toggleTimer = () => {
    const newIsRunning = !isRunning;
    setIsRunning(newIsRunning);
    onRunningChange?.(newIsRunning);
    if (isCompleted) {
      setIsCompleted(false);
    }
  };

  const resetTimer = () => {
    setTimeLeft(totalDuration);
    setIsRunning(false);
    setIsCompleted(false);
    onRunningChange?.(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this timer?')) {
      onDelete(timer.id);
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10); // Get centiseconds (10ms precision)

    return {
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: ms.toString().padStart(2, '0'),
    };
  };

  const getCategoryColor = (category) => {
    const colors = {
      Workout: isDarkMode
        ? 'bg-blue-900 text-blue-200'
        : 'bg-blue-100 text-blue-800',
      Study: isDarkMode
        ? 'bg-green-900 text-green-200'
        : 'bg-green-100 text-green-800',
      Break: isDarkMode
        ? 'bg-yellow-900 text-yellow-200'
        : 'bg-yellow-100 text-yellow-800',
      Other: isDarkMode
        ? 'bg-purple-900 text-purple-200'
        : 'bg-purple-100 text-purple-800',
    };
    return (
      colors[category] ||
      (isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800')
    );
  };

  const getStatusColor = () => {
    if (isCompleted)
      return isDarkMode
        ? 'bg-gray-700 text-gray-200'
        : 'bg-gray-100 text-gray-800';
    if (isRunning)
      return isDarkMode
        ? 'bg-green-900 text-green-200'
        : 'bg-green-100 text-green-800';
    return isDarkMode
      ? 'bg-yellow-900 text-yellow-200'
      : 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isRunning) return 'Running';
    return 'Paused';
  };

  const getProgressBarColor = () => {
    if (isCompleted) return isDarkMode ? 'bg-gray-600' : 'bg-gray-400';
    if (isRunning) return isDarkMode ? 'bg-green-600' : 'bg-green-500';
    return isDarkMode ? 'bg-yellow-600' : 'bg-yellow-500';
  };

  const calculateProgress = () => {
    return (timeLeft / totalDuration) * 100;
  };

  const time = formatTime(timeLeft);
  const progress = calculateProgress();
  const progressBarColor = getProgressBarColor();

  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
      } p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 text-left">
          <h3
            className={`text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            {timer.name}
          </h3>
          <div className="flex space-x-2">
            <span
              className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${getCategoryColor(
                timer.category
              )}`}
            >
              {timer.category}
            </span>
            <span
              className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className={`${
            isDarkMode
              ? 'text-gray-600 hover:text-red-400'
              : 'text-gray-300 hover:text-red-500'
          } transition-colors duration-200 focus:outline-none p-1 rounded-full ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          title="Delete Timer"
        >
          <FaTrash className="h-5 w-5" />
        </button>
      </div>

      <div className="text-center mb-8">
        <div
          className={`text-5xl flex justify-center items-center ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          <span>{time.minutes}</span>
          <span
            className={`mx-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
          >
            :
          </span>
          <span>{time.seconds}</span>
          <span
            className={`mx-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
          >
            .
          </span>
          <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>
            {time.milliseconds}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div
          className={`flex justify-between text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          } mb-1`}
        >
          <span>{Math.round(progress)}%</span>
          <span>
            {formatTime(totalDuration).minutes}:
            {formatTime(totalDuration).seconds}
          </span>
        </div>
        <div
          className={`w-full ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded-full h-2.5`}
        >
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${progressBarColor}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={toggleTimer}
          className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none flex items-center gap-2 ${
            isRunning
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? (
            <MdPause className="h-5 w-5" />
          ) : (
            <MdPlayArrow className="h-5 w-5" />
          )}
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-500 hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 focus:outline-none flex items-center gap-2"
        >
          <MdRefresh className="h-5 w-5" />
          Reset
        </button>
      </div>
    </div>
  );
}

export default Timer;
