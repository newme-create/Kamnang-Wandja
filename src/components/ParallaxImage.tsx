import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  offset?: number; // percentage shift, e.g. 15 for -15% to 15%
  scale?: [number, number]; // [startScale, endScale]
  priority?: boolean;
  direction?: 'diagonal' | 'vertical' | 'horizontal';
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  offset = 12,
  scale = [1.14, 1.14],
  direction = 'diagonal',
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 25,
    restDelta: 0.001,
  });

  // Motion transforms based on requested direction
  // Diagonal mode: translates from bottom-left (-x, +y) to top-right (+x, -y) as user scrolls
  const x = useTransform(
    smoothProgress,
    [0, 1],
    direction === 'diagonal' ? [`-${offset}%`, `${offset}%`] : direction === 'horizontal' ? [`-${offset}%`, `${offset}%`] : ['0%', '0%']
  );
  const y = useTransform(
    smoothProgress,
    [0, 1],
    direction === 'diagonal' ? [`${offset}%`, `-${offset}%`] : direction === 'vertical' ? [`-${offset}%`, `${offset}%`] : ['0%', '0%']
  );
  const currentScale = useTransform(smoothProgress, [0, 0.5, 1], [scale[0], 1.05, scale[1]]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <motion.img
        style={{
          x,
          y,
          scale: currentScale,
        }}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover will-change-transform ${className}`}
        loading="lazy"
      />
    </div>
  );
};
