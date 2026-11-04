import React, { createContext, useContext } from 'react';
import useDarkMode from '../hooks/useDarkMode';

// 1. إنشاء الـ Context
const ThemeContext = createContext();

// 2. الـ Provider اللي يغلف التطبيق
export function ThemeProvider({ children }) {
    const [theme, toggleTheme] = useDarkMode();

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. Hook مخصص باش تستعمل الثيم في أي مكان بسهولة
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}