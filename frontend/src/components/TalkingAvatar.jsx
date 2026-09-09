import React, { useEffect, useRef, useState } from 'react';

/**
 * TalkingAvatar Component
 * Renders a photorealistic interviewer portrait with dynamic Lip-Sync mouth movement,
 * jaw morphing, eye blinking, and breathing animations when speech synthesis is active.
 */
export default function TalkingAvatar({ 
  image, 
  name, 
  isSpeaking = false, 
  className = "w-full h-full object-cover",
  activeAgentId = 'vikram'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const baseImgRef = useRef(null);

  // Load and cache the avatar image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;
    img.onload = () => {
      baseImgRef.current = img;
      setImgLoaded(true);
    };
  }, [image]);

  // Canvas Lip-Sync Mouth Morphing & Eye Blink Loop
  useEffect(() => {
    if (!imgLoaded || !canvasRef.current || !baseImgRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let startTime = performance.now();
    let blinkTimer = 0;
    let isBlinking = false;
    let blinkProgress = 0;

    const renderFrame = (now) => {
      const elapsed = (now - startTime) / 1000;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Handle periodic natural eye blinking
      blinkTimer += 0.016;
      if (blinkTimer > 3.8 + Math.random() * 1.5) {
        isBlinking = true;
        blinkTimer = 0;
        blinkProgress = 0;
      }

      if (isBlinking) {
        blinkProgress += 0.12;
        if (blinkProgress >= 1) {
          isBlinking = false;
          blinkProgress = 0;
        }
      }

      // Mouth Morphing & Visemes when Speaking
      if (isSpeaking) {
        // Speech rhythm curves (combining harmonics for viseme variation)
        const mouthOpen = Math.abs(Math.sin(elapsed * 9) * 0.5 + Math.sin(elapsed * 17) * 0.3 + Math.cos(elapsed * 23) * 0.2);
        const mouthWidth = 1 + Math.sin(elapsed * 12) * 0.08;

        // Position coordinates for interviewer mouth region (scaled relative to canvas)
        const mouthX = w * 0.5;
        const mouthY = h * 0.58; 
        const mouthR = w * 0.11 * mouthWidth;
        const openHeight = mouthR * 0.7 * mouthOpen;

        if (openHeight > 2) {
          // Draw subtle dark inner mouth cavity
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(mouthX, mouthY + openHeight * 0.2, mouthR * 0.7, openHeight * 0.65, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(20, 8, 12, 0.85)";
          ctx.fill();

          // Upper & Lower Lip Contour Highlights
          ctx.beginPath();
          ctx.ellipse(mouthX, mouthY - openHeight * 0.3, mouthR * 0.75, openHeight * 0.25, 0, Math.PI, Math.PI * 2);
          ctx.fillStyle = "rgba(180, 100, 110, 0.4)";
          ctx.fill();

          ctx.beginPath();
          ctx.ellipse(mouthX, mouthY + openHeight * 0.7, mouthR * 0.72, openHeight * 0.3, 0, 0, Math.PI);
          ctx.fillStyle = "rgba(160, 80, 95, 0.35)";
          ctx.fill();
          ctx.restore();
        }
      }

      // Subtle Eye Blink Eyelid Overlay
      if (isBlinking) {
        const eyeY = h * 0.38;
        const eyeW = w * 0.13;
        const eyeH = Math.sin(blinkProgress * Math.PI) * 12;

        ctx.save();
        ctx.fillStyle = "rgba(30, 35, 45, 0.75)";
        // Left Eye Eyelid
        ctx.beginPath();
        ctx.ellipse(w * 0.38, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right Eye Eyelid
        ctx.beginPath();
        ctx.ellipse(w * 0.62, eyeY, eyeW, eyeH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(renderFrame);
    };

    animFrameRef.current = requestAnimationFrame(renderFrame);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [imgLoaded, isSpeaking]);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      {/* Base Image with Lip-Sync CSS Animation */}
      <img
        src={image}
        alt={name}
        className={`${className} transition-transform duration-500 ${
          isSpeaking 
            ? 'avatar-speaking scale-[1.03] filter brightness-105 contrast-[1.03]' 
            : 'avatar-breathe scale-100 filter brightness-95'
        }`}
      />

      {/* Dynamic Canvas Mouth Morph & Blink Overlay */}
      <canvas
        ref={canvasRef}
        width={400}
        height={450}
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90"
      />

      {/* Acoustic Speaking Ring Glow */}
      {isSpeaking && (
        <div className="absolute inset-0 pointer-events-none ring-2 ring-brand-500/50 shadow-inner rounded-2xl animate-pulse" />
      )}
    </div>
  );
}
