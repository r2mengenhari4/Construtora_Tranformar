import React from 'react';

interface LogoProps {
  variant?: 'badge' | 'horizontal' | 'mark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: 'dark' | 'light';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  theme = 'dark'
}) => {
  const getBadgeDimensions = () => {
    switch (size) {
      case 'sm': return 40;
      case 'md': return 56;
      case 'lg': return 84;
      case 'xl': return 120;
      default: return 56;
    }
  };

  const badgeSize = getBadgeDimensions();

  // The iconic emblem of Construtora Transformar from the brand reference:
  // Circular navy base with double gold rings, architectural diamond silhouette,
  // stylized modern towers + residential gable roof with window.
  const CircularEmblem = (
    <svg
      width={badgeSize}
      height={badgeSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-md"
      aria-label="Logo Construtora Transformar"
    >
      <defs>
        {/* Navy gradient background */}
        <radialGradient id="navyGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#132342" />
          <stop offset="60%" stopColor="#0B1528" />
          <stop offset="100%" stopColor="#070E1B" />
        </radialGradient>

        {/* Gold gradient for frames and architectural lines */}
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9E8C7" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#C5A869" />
          <stop offset="100%" stopColor="#A88746" />
        </linearGradient>

        {/* Dark gold subtle gradient */}
        <linearGradient id="goldSubtle" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8C6F34" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>

      {/* Outer base circular background */}
      <circle cx="100" cy="100" r="96" fill="url(#navyGrad)" />

      {/* Double Gold Concentric Border Rings */}
      <circle cx="100" cy="100" r="95" stroke="url(#goldGrad)" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="88" stroke="url(#goldGrad)" strokeWidth="1" strokeOpacity="0.85" />

      {/* Central Architectural Diamond Emblem */}
      <g transform="translate(100, 68)">
        {/* Diamond frame rotated 45 deg */}
        <rect
          x="-34"
          y="-34"
          width="68"
          height="68"
          rx="3"
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth="3.2"
          transform="rotate(45)"
        />

        {/* Inner architectural building towers */}
        {/* Left tower */}
        <path
          d="M -16 6 L -16 -12 L -6 -20 L -6 6 Z"
          fill="url(#goldGrad)"
          opacity="0.9"
        />
        {/* Center tall tower */}
        <path
          d="M -5 6 L -5 -32 L 6 -40 L 6 6 Z"
          fill="url(#goldGrad)"
        />
        {/* Right tower */}
        <path
          d="M 7 6 L 7 -22 L 17 -14 L 17 6 Z"
          fill="url(#goldGrad)"
          opacity="0.85"
        />

        {/* House gable roof silhouette intersecting the diamond */}
        <path
          d="M -26 8 L 0 -12 L 26 8 L 22 10 L 0 -7 L -22 10 Z"
          fill="url(#goldGrad)"
        />

        {/* 4-pane Window in the house gable */}
        <rect x="-6" y="1" width="5" height="5" rx="0.5" fill="url(#goldGrad)" />
        <rect x="1" y="1" width="5" height="5" rx="0.5" fill="url(#goldGrad)" />
        <rect x="-6" y="8" width="5" height="5" rx="0.5" fill="url(#goldGrad)" />
        <rect x="1" y="8" width="5" height="5" rx="0.5" fill="url(#goldGrad)" />
      </g>

      {/* Typography inside circular seal */}
      {/* "CONSTRUTORA" */}
      <text
        x="100"
        y="126"
        textAnchor="middle"
        fill="url(#goldGrad)"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="3"
      >
        CONSTRUTORA
      </text>

      {/* "TRANSFORMAR" */}
      <text
        x="100"
        y="143"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="'Outfit', system-ui, sans-serif"
        fontSize="14.5"
        fontWeight="800"
        letterSpacing="1.2"
      >
        TRANSFORMAR
      </text>

      {/* Thin ornamental gold divider line */}
      <line x1="38" y1="151" x2="162" y2="151" stroke="url(#goldGrad)" strokeWidth="0.8" strokeOpacity="0.75" />
      <polygon points="100,150 102,151 100,152 98,151" fill="url(#goldGrad)" />

      {/* "MARICÁ E REGIÃO OCEÂNICA" */}
      <text
        x="100"
        y="161"
        textAnchor="middle"
        fill="#D4AF37"
        fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
        fontSize="6.2"
        fontWeight="600"
        letterSpacing="1.8"
      >
        MARICÁ E REGIÃO OCEÂNICA
      </text>
    </svg>
  );

  if (variant === 'badge' || variant === 'mark-only') {
    return (
      <div id="brand-badge-logo" className={`inline-flex items-center justify-center ${className}`}>
        {CircularEmblem}
      </div>
    );
  }

  // Horizontal variant (Emblem + Typographic Lockup)
  return (
    <div id="brand-horizontal-logo" className={`inline-flex items-center gap-3.5 group select-none ${className}`}>
      <div className="transition-transform duration-300 group-hover:scale-105">
        {CircularEmblem}
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-[10px] tracking-[0.28em] uppercase font-semibold text-amber-500/90 leading-tight">
          Construtora
        </span>
        <span
          className={`text-xl sm:text-2xl font-display font-extrabold tracking-tight leading-tight ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}
        >
          TRANSFORMAR
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="h-[1px] w-3 bg-amber-400/50"></span>
          <span className="text-[9px] tracking-[0.18em] uppercase text-amber-600/90 font-medium whitespace-nowrap">
            Maricá e Região Oceânica
          </span>
        </div>
      </div>
    </div>
  );
};
