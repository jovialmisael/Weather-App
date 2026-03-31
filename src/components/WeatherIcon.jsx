import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export function WeatherIcon({ condition, className = "w-16 h-16" }) {
  const cond = condition?.toLowerCase() || 'clear';
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 150 });
  
  const parallaxX = useTransform(smoothX, [-0.5, 0.5], [-15, 15]);
  const parallaxY = useTransform(smoothY, [-0.5, 0.5], [-15, 15]);

  let IconContent = null;

  if (cond.includes('clear')) {
    IconContent = (
      <motion.svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">
        <motion.circle cx="50" cy="50" r="22" fill="#FBBF24"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50px 50px' }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
             <line key={i} x1="50" y1="12" x2="50" y2="2" stroke="#FBBF24" strokeWidth="6" strokeLinecap="round" transform={`rotate(${angle} 50 50)`} />
          ))}
        </motion.g>
      </motion.svg>
    );
  } else if (cond.includes('cloud')) {
    IconContent = (
      <motion.svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
        <motion.path d="M25 60 A15 15 0 0 1 25 30 A25 25 0 0 1 70 35 A15 15 0 0 1 70 65 Z" fill="#E5E7EB"
           animate={{ y: [-4, 4, -4] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    );
  } else if (cond.includes('rain') || cond.includes('drizzle')) {
      IconContent = (
      <motion.svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(156,163,175,0.4)]">
        <motion.path d="M25 55 A15 15 0 0 1 25 25 A25 25 0 0 1 70 30 A15 15 0 0 1 70 60 Z" fill="#9CA3AF"
           animate={{ y: [-2, 2, -2] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[35, 50, 65].map((x, i) => (
             <motion.line key={i} x1={x} y1="65" x2={x-5} y2="80" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round"
                 animate={{ y: [0, 15], opacity: [1, 0] }}
                 transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'linear' }}
             />
        ))}
      </motion.svg>
    );
  } else if (cond.includes('storm') || cond.includes('thunder')) {
      IconContent = (
      <motion.svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(75,85,99,0.5)]">
        <motion.path d="M25 55 A15 15 0 0 1 25 25 A25 25 0 0 1 70 30 A15 15 0 0 1 70 60 Z" fill="#4B5563"
           animate={{ y: [-2, 2, -2] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path d="M55 50 L40 70 L50 70 L45 90 L65 65 L55 65 Z" fill="#FBBF24"
             animate={{ opacity: [0, 1, 0, 1, 0] }}
             transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 1] }}
        />
      </motion.svg>
    );
  } else if (cond.includes('snow')) {
      IconContent = (
      <motion.svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(209,213,219,0.5)]">
        <motion.path d="M25 55 A15 15 0 0 1 25 25 A25 25 0 0 1 70 30 A15 15 0 0 1 70 60 Z" fill="#D1D5DB"
           animate={{ y: [-2, 2, -2] }}
           transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[35, 50, 65].map((x, i) => (
             <motion.circle key={i} cx={x} cy="70" r="3" fill="#FFFFFF"
                 animate={{ y: [0, 15], x: [0, i%2===0?-5:5, 0], opacity: [1, 0] }}
                 transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: 'linear' }}
             />
        ))}
      </motion.svg>
    );
  } else {
     IconContent = (
      <motion.svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        <motion.circle cx="50" cy="50" r="22" fill="#9CA3AF"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.svg>
    );
  }

  return (
    <motion.div
        className={className}
        style={{ x: parallaxX, y: parallaxY }}
    >
        <motion.div
            className="w-full h-full"
            animate={{ y: [-6, 0, -6] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {IconContent}
        </motion.div>
    </motion.div>
  );
}
