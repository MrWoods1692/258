import { useEffect, useRef, useCallback } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  speed: number;
  size: number;
  color: string;
  type: "star" | "particle";
  rotation: number;
  rotationSpeed: number;
}

const STAR_COLORS = ["#fbbf24", "#f59e0b", "#fef3c7", "#ffd700", "#ff6b6b", "#48dbfb", "#ff9ff3"];
const PARTICLE_COLORS = ["#fbbf24", "#f59e0b", "#ff6b6b", "#48dbfb", "#54a0ff", "#ff9ff3", "#feca57", "#ffd93d"];

export const ClickEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  const createStar = useCallback((x: number, y: number, count: number) => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 60 + Math.random() * 80;
      const size = 6 + Math.random() * 10;
      const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
      const id = idRef.current++;

      const el = document.createElement("div");
      el.className = "click-star";
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `;

      // Star shape using clip-path
      el.style.clipPath =
        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
      el.style.background = color;
      el.style.opacity = "1";
      el.style.transition = `all ${0.5 + Math.random() * 0.4}s ease-out`;
      el.style.boxShadow = `0 0 ${4 + Math.random() * 4}px ${color}`;

      container.appendChild(el);

      // Animate
      requestAnimationFrame(() => {
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        const rotation = (Math.random() - 0.5) * 720;
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${rotation}deg) scale(0.2)`;
        el.style.opacity = "0";
      });

      setTimeout(() => {
        el.remove();
      }, 1000);
    }
  }, []);

  const createParticles = useCallback((x: number, y: number, count: number) => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 100;
      const size = 3 + Math.random() * 5;
      const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      const id = idRef.current++;

      const el = document.createElement("div");
      el.className = "click-particle";
      el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        background: ${color};
        transform: translate(-50%, -50%);
        transition: all ${0.4 + Math.random() * 0.6}s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 0 ${2 + Math.random() * 3}px ${color};
      `;

      container.appendChild(el);

      requestAnimationFrame(() => {
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        el.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
        el.style.opacity = "0";
      });

      setTimeout(() => {
        el.remove();
      }, 1200);
    }
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isButton =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('[tabindex]');

      // Stars on every click
      createStar(e.clientX, e.clientY, 5 + Math.floor(Math.random() * 4));

      // Extra particles on buttons
      if (isButton) {
        createParticles(e.clientX, e.clientY, 8 + Math.floor(Math.random() * 8));
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [createStar, createParticles]);

  return <div ref={containerRef} />;
};
