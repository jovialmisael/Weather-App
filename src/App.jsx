import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from './hooks/useWeather';
import { SearchBar } from './components/SearchBar';
import { HeroSection } from './components/HeroSection';
import { BentoGrid } from './components/BentoGrid';
import { ForecastStrip } from './components/ForecastStrip';
import { WeatherParticles } from './components/WeatherParticles';
import './index.css';

function getBackgroundGradient(condition, dt, sunrise, sunset) {
  const cond = condition ? condition.toLowerCase() : 'clear';
  
  // Basic day/night check if sys info is provided
  let isNight = false;
  if (dt && sunrise && sunset) {
      isNight = dt < sunrise || dt > sunset;
  }
  
  if (isNight) {
      if (cond.includes('clear')) return 'linear-gradient(135deg, #0f172a, #1e1b4b)'; // Deep night
      if (cond.includes('cloud')) return 'linear-gradient(135deg, #1e293b, #334155)'; // Night cloud
  }

  if (cond.includes('clear')) {
    return 'linear-gradient(135deg, #38bdf8, #2563eb)'; // Bright blue sky
  } else if (cond.includes('cloud')) {
    return 'linear-gradient(135deg, #64748b, #94a3b8)'; // Overcast neutral
  } else if (cond.includes('rain') || cond.includes('drizzle')) {
    return 'linear-gradient(135deg, #334155, #475569)'; // Darker stormy slate
  } else if (cond.includes('storm') || cond.includes('thunder')) {
    return 'linear-gradient(135deg, #1e1b4b, #312e81)'; // Violet/charcoal
  } else if (cond.includes('snow')) {
    return 'linear-gradient(135deg, #cbd5e1, #e2e8f0)'; // Light icy grey
  }
  
  return 'linear-gradient(135deg, #8b5cf6, #3b82f6)'; 
}

function App() {
  const { data, loading, error, fetchByCity, fetchByLocation, unit, setUnit } = useWeather();
  
  const bgGradient = useMemo(() => {
    return getBackgroundGradient(
        data?.current?.weather[0]?.main, 
        data?.current?.dt, 
        data?.current?.sys?.sunrise, 
        data?.current?.sys?.sunset
    );
  }, [data]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-white/30 font-sans">
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{ background: bgGradient }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
      />
      
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      
      {data && !error && <WeatherParticles condition={data.current.weather[0].main} />}

      <div className="relative z-10 min-h-screen pb-36">
        <SearchBar onSearch={fetchByCity} onLocation={fetchByLocation} loading={loading} />
        
        {/* Top Right Unit Toggle */}
        <div className="absolute top-8 right-4 sm:right-8 z-50">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setUnit(unit === 'metric' ? 'imperial' : 'metric')}
            className="flex items-center justify-between w-14 h-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-1 relative focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors hover:bg-white/15"
          >
            <motion.div
              layout
              className="absolute w-6 h-6 bg-white rounded-full shadow-md z-10"
              initial={false}
              animate={{ x: unit === 'metric' ? 0 : 24 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
            <span className="text-[10px] font-bold w-6 text-center z-0 left-1 absolute text-white/70">°C</span>
            <span className="text-[10px] font-bold w-6 text-center z-0 right-1 absolute text-white/70">°F</span>
          </motion.button>
        </div>

        <main className="min-h-[85vh] flex flex-col justify-center max-w-7xl mx-auto">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mx-auto mt-24 mb-8 max-w-md p-4 bg-red-500/20 backdrop-blur-xl border border-red-500/50 rounded-2xl text-center text-red-100 shadow-xl"
            >
              {error}
            </motion.div>
          )}

          {data && !error && (
            <AnimatePresence mode="wait">
              <motion.div
                key={data.current.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 w-full flex flex-col items-center"
              >
                <HeroSection current={data.current} unit={unit} />
                <div className="w-full relative z-20">
                    <BentoGrid current={data.current} unit={unit} />
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {!data && !error && !loading && (
             <div className="flex-1 flex items-center justify-center pt-32 text-white/50 font-light text-lg tracking-wide">
                Waiting for the weather...
             </div>
          )}
        </main>
      </div>
      
      {data && !error && <ForecastStrip forecast={data.forecast} unit={unit} />}

      <AnimatePresence>
         {loading && (
           <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] pointer-events-none bg-black/5 backdrop-blur-[2px] flex items-center justify-center transition-all"
           >
              <motion.div className="flex gap-2">
                 {[0, 1, 2].map((i) => (
                    <motion.div 
                       key={i}
                       className="w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                       animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                       transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                    />
                 ))}
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}

export default App;
