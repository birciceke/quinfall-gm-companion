import React, { useRef, useEffect } from 'react';

const MatrixEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Audio is now handled by the parent App component.
    // This component is purely for the visual effect.

    // --- Canvas setup ---
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    let columns: number;
    let rainDrops: number[];

    const initialize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        columns = Math.floor(window.innerWidth / fontSize);
        rainDrops = [];
        for (let i = 0; i < columns; i++) {
            // Start drops at random heights for a more natural look
            rainDrops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
        }
    };

    const draw = () => {
      // Semi-transparent black background for the fading trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        // Reset drop to the top if it goes off-screen
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
      
      const time = Date.now();
      // Blink every 50ms for a much faster flashing effect
      if (Math.floor(time / 50) % 2 === 0) {
        const text = "BUGENZY PRESENTS BUGFALL :)";
        // Responsive font size that scales with window width, with a minimum size
        const responsiveFontSize = Math.max(24, canvas.width / 25);
        ctx.font = `bold ${responsiveFontSize}px monospace`;
        ctx.fillStyle = '#FFFFFF'; // White text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add a glow effect to the text
        ctx.shadowColor = '#FFFFFF'; // White glow
        ctx.shadowBlur = 15;

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        // Reset shadow so it doesn't affect the rain drops
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };
    
    initialize();
    draw();

    window.addEventListener('resize', initialize);

    // --- Cleanup function ---
    return () => {
      // Clean up canvas resources
      window.removeEventListener('resize', initialize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-[9999] bg-black" />;
};

export default MatrixEffect;