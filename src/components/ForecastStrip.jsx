import { motion } from 'framer-motion';
import { WeatherIcon } from './WeatherIcon';

export function ForecastStrip({ forecast, unit }) {
  if (!forecast || forecast.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, delayChildren: 0.6, type: 'spring' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } }
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/10 backdrop-blur-3xl border-t border-white/10 p-4 pb-6 sm:pb-4"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.5 }}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto hide-scrollbar snap-x max-w-5xl mx-auto pl-4 pr-4 touch-pan-x"
      >
        {forecast.map((day, idx) => {
          const dateStr = new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = idx === 0;
          return (
            <motion.div 
              key={day.dt}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-none snap-start flex flex-col items-center justify-between p-4 min-w-[100px] h-32 rounded-[2rem] border transition-colors ${isToday ? 'bg-white/20 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-white/5 border-white/10 hover:bg-white/15'}`}
            >
              <span className="text-xs font-medium text-white/80 uppercase tracking-widest">{isToday ? 'Today' : dateStr}</span>
              <WeatherIcon condition={day.condition} className="w-10 h-10 my-1 drop-shadow-md" />
              <div className="flex gap-2 text-sm tabular-nums">
                <span className="font-semibold">{Math.round(day.temp_max)}°</span>
                <span className="font-light text-white/50">{Math.round(day.temp_min)}°</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
