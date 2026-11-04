import { useState, useEffect } from 'react';

function useDarkMode() {
    const [theme, setTheme] = useState(() => {
        // نتحققوا من localStorage أولاً، إذا ماكاش نشوفو إعدادات نظام المستخدم
        const stored = localStorage.getItem('theme');
        if (stored === 'dark' || stored === 'light') return stored;
        
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    return [theme, toggleTheme];
}

export default useDarkMode;