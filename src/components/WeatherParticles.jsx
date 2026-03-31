import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WeatherParticles = memo(({ condition }) => {
  if (!condition) return null;
  const cond = condition.toLowerCase();
  
  const isRain = cond.includes('rain') || cond.includes('drizzle');
  const isSnow = cond.includes('snow');
  
  if (!isRain && !isSnow) return null;

  const count = isRain ? 70 : 40;
  
  // Use a predictable seed based on condition so it doesn't flicker/regenerate randomly every render,
  // but we can just memorize it once, or let React rerender it when condition type changes.
  const particles = Array.from({ length: count }).map((_, i) => {
    // We use a math constant so it's pseudo-random but stable between re-renders if needed, 
    // actually inside memo it's fine to just generate once per remount.
    const left = `${Math.random() * 100}%`;
    const animationDuration = isRain ? `${0.5 + Math.random() * 0.4}s` : `${2.5 + Math.random() * 3.5}s`;
    const animationDelay = `-${Math.random() * 3}s`;
    
    // Rain is a thin line, Snow is a circle
    let style = {
      left,
      animationDuration,
      animationDelay,
    };
    
    let className = "absolute top-[-10%] ";
    
    if (isRain) {
        className += "bg-gradient-to-b from-transparent to-blue-200/50 w-[1px] md:w-[2px]";
        style.height = `${15 + Math.random() * 20}vh`;
        style.animationName = "fall-rain";
    } else {
        className += "bg-white/80 rounded-full blur-[1px]";
        const size = `${3 + Math.random() * 5}px`;
        style.width = size;
        style.height = size;
        style.animationName = "fall-snow";
    }

    return { id: i, style, className };
  });

  return (
    <AnimatePresence>
      <motion.div 
        key={cond}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        {particles.map(p => (
          <div
            key={p.id}
            className={p.className}
            style={{ ...p.style, animationIterationCount: 'infinite', animationTimingFunction: 'linear' }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
});
