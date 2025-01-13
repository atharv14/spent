"use client"

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SearchComponent = () => {
  const [input, setInput] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-5xl font-bold text-green-700 font-mono">$pent</h1>
        <h3 className="text-xl font-semibold text-green-500 font-mono">No Money, No Problem</h3>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="relative font-mono text-gray-600">
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What's your budget?"
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
              min="0"
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100"
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
                <h3 className="text-balance font-semibold text-lg font-mono text-green-700">{item.name}</h3>
                <p className="text-balance text-green-600 font-mono">${item.price}</p>
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-balance text-blue-500 hover:underline font-mono"
                >
                  Buy Now
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
