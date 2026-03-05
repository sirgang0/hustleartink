import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => (
  <svg 
    viewBox="0 0 500 400" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Clean 'HI!' Monogram - Centered and focused */}
    <g transform="translate(-45, 0)">
      {/* Stylized 'H' */}
      <path 
        d="M150 100V300M150 200H250M250 100V300" 
        stroke="#00c2cb" 
        strokeWidth="45" 
        strokeLinecap="round" 
        className="drop-shadow-[0_0_15px_rgba(0,194,203,0.5)]"
      />
      
      {/* Stylized 'I' */}
      <path 
        d="M330 100V300M290 100H370M290 300H370" 
        stroke="#ff9d00" 
        strokeWidth="45" 
        strokeLinecap="round"
        className="drop-shadow-[0_0_15px_rgba(255,157,0,0.3)]"
      />
      
      {/* Dynamic Exclamation Mark (!) */}
      <g transform="rotate(8, 435, 200)">
        <path 
          d="M435 110L435 230" 
          stroke="#00c2cb" 
          strokeWidth="35" 
          strokeLinecap="round" 
        />
        <circle cx="435" cy="290" r="20" fill="#00c2cb" />
      </g>
    </g>
  </svg>
);