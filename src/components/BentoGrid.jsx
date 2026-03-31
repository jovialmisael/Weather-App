import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Droplets, Wind, Sun, Thermometer, Eye, Sunset } from 'lucide-react';
import { cn } from '../lib/utils';

function BentoCard({ title, icon: Icon, value, description, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col justify-between p-5 sm:p-6 overflow-hidden transition-colors duration-300",
        "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl cursor-default",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none hover:bg-white/15",
        className
      )}
    >
      <div className="flex items-center gap-2 text-white/60 mb-2 uppercase tracking-widest text-xs font-semibold">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>
      <div>
        <div className="text-3xl sm:text-4xl font-light text-white mb-1 tabular-nums drop-shadow-sm">{value}</div>
        {description && <div className="text-sm font-light text-white/50">{description}</div>}
      </div>
    </motion.div>
  );
}

export function BentoGrid({ current, unit }) {
  if (!current) return null;

  const humidity = current.main.humidity;
  const windSpeed = unit === 'metric' ? Math.round(current.wind.speed * 3.6) : Math.round(current.wind.speed); // ms to km/h or mph
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';
  const feelsLike = Math.round(current.main.feels_like);
  const visibility = (current.visibility / 1000).toFixed(1);
  const visibilityUnit = unit === 'metric' ? 'km' : 'mi';
  
  const sunrise = new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // UV index is not in standard current weather response of OpenWeatherMap Free API. 
  // We will mock it or show pressure instead. Let's show Pressure for literal correctness.
  const pressure = current.main.pressure;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 pb-24"
    >
      <motion.div variants={itemVariants} className="col-span-1">
        <BentoCard 
          title="Feels Like" 
          icon={Thermometer} 
          value={`${feelsLike}°`} 
          description="Similar to actual temperature." 
          className="h-full"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="col-span-1">
        <BentoCard 
          title="Wind" 
          icon={Wind} 
          value={`${windSpeed} ${windUnit}`} 
          description={`Direction: ${current.wind.deg}°`} 
          className="h-full"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
        <BentoCard 
          title="Humidity" 
          icon={Droplets} 
          value={`${humidity}%`} 
          description="The dew point is feeling muggy right now." 
          className="h-full"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="col-span-1">
        <BentoCard 
          title="Visibility" 
          icon={Eye} 
          value={`${visibility} ${visibilityUnit}`} 
          description="Perfectly clear view." 
          className="h-full"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="col-span-1">
        <BentoCard 
          title="Pressure" 
          icon={Sun} 
          value={`${pressure} hPa`} 
          description="Atmospheric pressure." 
          className="h-full"
        />
      </motion.div>

      <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
        <BentoCard 
          title="Sunrise / Sunset" 
          icon={Sunset} 
          value={sunrise} 
          description={`Sunset is at ${sunset}`} 
          className="h-full"
        />
      </motion.div>
    </motion.div>
  );
}
