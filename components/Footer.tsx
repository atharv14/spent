"use client"

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Get initial theme and set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme');
          setTheme(newTheme || 'dark');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // Get initial theme
    setTheme(document.documentElement.getAttribute('data-theme') || 'dark');

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full pt-2 pb-1 mt-8 border-t border-base-300 font-sans bg-base-200">
      <div className="container mx-auto text-center text-sm">
        <p className={`flex items-center justify-center gap-1 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
          Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by{' '}
          <span> Sarah, Atharv & Connor</span>
        </p>
        <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>
          © 2025 <span className="text-lg">$pent</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;