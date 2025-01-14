"use client"

import React, {useEffect,  useState } from 'react';
import { Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SearchComponent = () => {

  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [theme, setTheme] = useState('dark');
  
  //Money fix
  const [moneyArray, setmoneyArray] = useState([]);

  useEffect(() => {
    //moneyfixattempt
    const theMoneyArray = [...Array(100)].map(() => ({
      left: `${Math.random() * 150}vw`,
      animationDelay: `${Math.random() * 4}s`,
    }));
    setmoneyArray(theMoneyArray);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${window.location.origin}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ budget: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate items');
      }

      const data = await response.json();
      setItems(data.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden h-screen w-full">
      <div className="absolute inset-0 overflow-hidden z-0">
      {moneyArray.map((style, i) => (
        <span
          key={i}
          className="absolute text-3xl animate-money-rain"
          style={{
            top: "-50px",
            left: style.left,
            animationDelay: style.animationDelay,
          }}
          >💵</span>
        ))}
      </div>

    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-bold text-green-700 font-mono">$pent</h1>
        <h3 className={`text-xl font-semibold font-mono ${theme === 'dark' ? 'text-green-400' : 'text-green-500'}`}>
          No Money, No Problem
        </h3>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="relative font-mono">
            <span className="absolute left-3 top-2">$</span>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's your Budget?"
              className="w-full pl-8 px-4 py-2 rounded-lg border bg-base-100 text-base-content placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary"
              min="0"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-base-200 text-base-content"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="w-full text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border hover:shadow-lg transition-shadow overflow-hidden"
              >
                <h3 className="text-wrap font-semibold text-lg font-mono text-green-600">{item.name}</h3>
                <p className="text-balance text-green-600 font-mono">${item.price}</p>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-indigo-600 px-4 py-3 text-center text-sm font-semibold inline-block text-white 
                    cursor-pointer uppercase transition duration-200 ease-in-out rounded-md hover:bg-indigo-700 
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 active:scale-95"
                >
                  Buy Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};


export default SearchComponent;
