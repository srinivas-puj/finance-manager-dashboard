import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label="Toggle dark/light theme"
      title="Toggle theme"
    >
      {isDark ? 'Light Theme' : 'Dark Theme'}
    </button>
  );
};

export default ThemeToggle;

