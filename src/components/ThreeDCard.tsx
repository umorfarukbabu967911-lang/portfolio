import React, { useState, useRef } from "react";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  key?: string | number;
}

export default function ThreeDCard({ children, className = "", id }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Get mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize coordinates to be between -0.5 and 0.5
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = (y / rect.height) - 0.5;

    // Calculate rotation angles (max 15 degrees)
    const maxRotation = 12;
    setRotateY(normalizedX * maxRotation);
    setRotateX(-normalizedY * maxRotation); // inverted for natural tilt
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      id={id}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transform-style-3d transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: isHovered
          ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      }}
    >
      {/* 3D Reflex / Shine Overlay */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl z-20 opacity-30 transition-opacity duration-300 bg-gradient-to-tr from-transparent via-white/10 to-white/5"
          style={{
            transform: "translateZ(10px)",
          }}
        />
      )}
      <div
        className="h-full w-full transform-style-3d"
        style={{
          transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
          transition: "transform 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
