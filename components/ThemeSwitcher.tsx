"use client"

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeSwitcher = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const isNightTime = () => {
            const now = new Date();
            const hours = now.getHours();
            // Consider sunset at 6 PM (18:00)
            return hours >= 18 || hours < 6;
        };
        // Get initial theme from localStorage or default to 'dark'
        const savedTheme = isNightTime() ? 'dark' : 'cupcake';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Set up observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme');
                    setTheme(newTheme || savedTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'cupcake' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <div className="tooltip tooltip-left fixed top-4 right-4 z-50" data-tip={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg bg-base-200 hover:bg-base-300 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'
                    }`}
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </button>
        </div>
    );
};

export default ThemeSwitcher;