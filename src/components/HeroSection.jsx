import { motion } from 'framer-motion';
import { WeatherIcon } from './WeatherIcon';

export function HeroSection({ current, unit }) {
  if (!current) return null;

  const temp = Math.round(current.main.temp);
  const condition = current.weather[0].main;
  const city = current.name;
  const description = current.weather[0].description;
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center pt-32 pb-16 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-medium tracking-tight mb-4 drop-shadow-md">
        {city}
      </motion.h1>
      <motion.div variants={itemVariants} className="flex flex-col items-center">
        <WeatherIcon condition={condition} className="w-24 h-24 sm:w-32 sm:h-32 my-2" />
        <p className="text-xl sm:text-2xl font-light tracking-wide capitalize text-white/80 drop-shadow-sm">{description}</p>
      </motion.div>
      <motion.div variants={itemVariants} className="relative mt-2">
        <span className="text-[120px] sm:text-[160px] leading-none font-thin tracking-tighter drop-shadow-lg tabular-nums">
          {temp}
        </span>
        <span className="absolute top-6 sm:top-10 -right-8 sm:-right-12 text-3xl sm:text-5xl font-light text-white/60">
          {unitSymbol}
        </span>
      </motion.div>
    </motion.div>
  );
}
