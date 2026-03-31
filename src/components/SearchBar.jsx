import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Navigation } from 'lucide-react';
import { cn } from '../lib/utils';

export function SearchBar({ onSearch, onLocation, loading }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim());
      }
    }, 600);
    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <motion.div 
      className="absolute top-8 left-0 right-0 z-50 flex justify-center px-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.div 
        className={cn(
          "relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden transition-all duration-500",
          isFocused ? "w-full max-w-lg bg-white/15 ring-2 ring-white/30" : "w-full max-w-xs sm:max-w-sm hover:bg-white/15 hover:border-white/30"
        )}
        layout
      >
        <Search className="w-5 h-5 text-white/50 ml-4 pointer-events-none" />
        <input 
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for a city..."
          className="flex-1 bg-transparent text-white placeholder:text-white/50 px-3 py-3 outline-none w-full tabular-nums"
        />
        <button
          onClick={onLocation}
          className="p-3 mr-1 text-white/70 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-full flex items-center justify-center shrink-0"
          title="Current Location"
        >
          {loading ? (
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <Navigation className="w-5 h-5" />
            </motion.div>
          ) : (
            <Navigation className="w-5 h-5" />
          )}
        </button>
      </motion.div>
    </motion.div>
  );
}
