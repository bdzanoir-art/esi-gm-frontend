import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../Context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button type="button" className="page-theme-btn" onClick={toggleTheme}>
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
