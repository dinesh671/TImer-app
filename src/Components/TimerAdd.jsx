import React, { useState } from 'react';

function TimerAdd({ onSave, existingTimers, isDarkMode }) {
  const [timerData, setTimerData] = useState({
    name: '',
    minutes: '',
    seconds: '',
    category: 'Workout',
    customCategory: '',
  });

  const [categories, setCategories] = useState([
    'Workout',
    'Study',
    'Break',
    'Other',
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'minutes' || name === 'seconds') {
      // Ensure only numbers between 0-59 are entered
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 0 && numValue <= 59)) {
        setTimerData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === 'category' && value === 'Other') {
      // When selecting "Other", clear any previous custom category
      setTimerData((prev) => ({
        ...prev,
        category: value,
        customCategory: '',
      }));
    } else if (name === 'customCategory') {
      setTimerData((prev) => ({
        ...prev,
        customCategory: value,
      }));
    } else {
      setTimerData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isDuplicateName = (name, category) => {
    return existingTimers.some(
      (timer) =>
        timer.name.toLowerCase() === name.toLowerCase() &&
        timer.category === category
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, minutes, seconds, category, customCategory } = timerData;
    const finalCategory =
      category === 'Other' ? customCategory.trim() : category;

    // Validate all required fields
    if (!name.trim()) {
      alert('Please enter a timer name');
      return;
    }

    if (!minutes && !seconds) {
      alert('Please enter a duration');
      return;
    }

    if (category === 'Other' && !customCategory.trim()) {
      alert('Please enter a custom category name');
      return;
    }

    // Check for duplicate timer name in the same category
    if (isDuplicateName(name.trim(), finalCategory)) {
      alert(
        `A timer with the name "${name.trim()}" already exists in the ${finalCategory} category`
      );
      return;
    }

    // Calculate total duration in seconds
    const totalSeconds =
      (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

    if (totalSeconds === 0) {
      alert('Duration must be greater than 0');
      return;
    }

    // Create new timer object
    const newTimer = {
      id: Date.now(),
      name: name.trim(),
      duration: totalSeconds,
      category: finalCategory,
    };

    // If this is a new category, add it to the categories list
    if (category === 'Other' && !categories.includes(customCategory.trim())) {
      setCategories((prev) => [...prev, customCategory.trim()]);
    }

    // Save timer and reset form
    onSave(newTimer);
    setTimerData({
      name: '',
      minutes: '',
      seconds: '',
      category: 'Workout',
      customCategory: '',
    });
  };

  return (
    <div
      className={`max-w-md mx-auto p-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-xl shadow-lg border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-100'
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}
      >
        Create New Timer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className={`block text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}
          >
            Timer Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={timerData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            } focus:outline-none`}
            placeholder="e.g., Workout Timer"
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}
          >
            Duration
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  id="minutes"
                  name="minutes"
                  value={timerData.minutes}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  className={`w-full px-4 py-2 rounded-lg border text-center ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none`}
                  placeholder="00"
                />
                <div
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  min
                </div>
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`}
            >
              :
            </div>
            <div className="flex-1">
              <div className="relative">
                <input
                  type="number"
                  id="seconds"
                  name="seconds"
                  value={timerData.seconds}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  className={`w-full px-4 py-2 rounded-lg border text-center ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none`}
                  placeholder="00"
                />
                <div
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  sec
                </div>
              </div>
            </div>
          </div>
          <p
            className={`text-xs mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Enter time in minutes and seconds
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className={`block text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-1`}
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={timerData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-800'
            } focus:outline-none`}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {timerData.category === 'Other' && (
          <div className="animate-fadeIn">
            <label
              htmlFor="customCategory"
              className={`block text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-1`}
            >
              Custom Category Name
            </label>
            <input
              type="text"
              id="customCategory"
              name="customCategory"
              value={timerData.customCategory}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              } focus:outline-none`}
              placeholder="Enter custom category name"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none transition-all duration-200 transform hover:scale-[1.02]"
        >
          Create Timer
        </button>
      </form>
    </div>
  );
}

export default TimerAdd;
