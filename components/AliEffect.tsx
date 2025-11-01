import React, { useState, useEffect, useRef } from 'react';

const ALI_IMAGE_URL = 'https://storage.cloud.google.com/qfitempictures/ali.png';
const NUM_ALIS = 20;
const IMAGE_SIZE = 150; // width and height of the image in pixels

interface AliState {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
}

const createInitialState = (): AliState[] => {
  return Array.from({ length: NUM_ALIS }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4; // pixels per frame
    return {
      id: i,
      x: Math.random() * (window.innerWidth - IMAGE_SIZE),
      y: Math.random() * (window.innerHeight - IMAGE_SIZE),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10, // degrees per frame
    };
  });
};

const AliEffect: React.FC = () => {
  const [alis, setAlis] = useState<AliState[]>(createInitialState);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setAlis(prevAlis => 
        prevAlis.map(ali => {
          let { x, y, vx, vy, rot, vrot } = ali;

          // Move
          x += vx;
          y += vy;
          rot += vrot;

          // Bounce off walls
          if (x <= 0 || x >= window.innerWidth - IMAGE_SIZE) {
            vx = -vx * (0.9 + Math.random() * 0.2); // Add some randomness to bounce
            // also clamp position to prevent getting stuck
            x = Math.max(0, Math.min(x, window.innerWidth - IMAGE_SIZE));
          }
          if (y <= 0 || y >= window.innerHeight - IMAGE_SIZE) {
            vy = -vy * (0.9 + Math.random() * 0.2);
            y = Math.max(0, Math.min(y, window.innerHeight - IMAGE_SIZE));
          }

          return { ...ali, x, y, vx, vy, rot };
        })
      );
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-[9998] pointer-events-none overflow-hidden">
      {alis.map(ali => (
        <img
          key={ali.id}
          src={ALI_IMAGE_URL}
          alt="An easter egg image"
          className="absolute"
          style={{
            width: `${IMAGE_SIZE}px`,
            height: `${IMAGE_SIZE}px`,
            left: 0,
            top: 0,
            transform: `translate(${ali.x}px, ${ali.y}px) rotate(${ali.rot}deg)`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};

export default AliEffect;