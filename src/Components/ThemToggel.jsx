import { useTheme } from '../Context/ThemeContext.jsx';
import { Moon, Sun } from 'lucide-react';

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();
  const isDark = darkMode;

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
      className="relative flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--card-border)] bg-card/30 hover:bg-card/80 transition-all duration-300 overflow-hidden group shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-card/50"
    >
      {/* Sun Icon (Visible in Light Mode) */}
      <Sun
        size={20}
        strokeWidth={2}
        className={`absolute transition-all duration-500 ease-in-out text-amber-500
                    ${isDark ? 'translate-y-10 opacity-0 rotate-90' : 'translate-y-0 opacity-100 rotate-0 group-hover:rotate-12'}`}
      />

      {/* Moon Icon (Visible in Dark Mode) */}
      <Moon
        size={20}
        strokeWidth={2}
        className={`absolute transition-all duration-500 ease-in-out text-indigo-400
                    ${isDark ? 'translate-y-0 opacity-100 rotate-0 group-hover:-rotate-12' : '-translate-y-10 opacity-0 -rotate-90'}`}
      />
    </button>
  );
}

export default ThemeToggle;
