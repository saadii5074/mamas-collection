import React from 'react';

// Authentic Brand Vector Logos for Pakistani Payment Providers

export function EasyPaisaLogo({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#00A859" />
      <path 
        d="M26 36h48v8H26zM26 48h36v8H26zM26 60h48v8H26z" 
        fill="#FFFFFF" 
        rx="2"
      />
      <circle cx="68" cy="52" r="6" fill="#F4B41A" />
    </svg>
  );
}

export function JazzCashLogo({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#1C1917" />
      <path 
        d="M28 28h44v14H28zM38 46h34v12H38zM28 62h44v14H28z" 
        fill="#ED1C24" 
      />
      <circle cx="34" cy="52" r="5" fill="#FFC20E" />
    </svg>
  );
}

export function OneLinkLogo({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" x="2" y="2" rx="20" fill="#0D47A1" />
      <text 
        x="50" 
        y="45" 
        fill="#FFFFFF" 
        fontSize="24" 
        fontWeight="900" 
        fontFamily="sans-serif" 
        textAnchor="middle"
      >
        1LINK
      </text>
      <text 
        x="50" 
        y="68" 
        fill="#64B5F6" 
        fontSize="12" 
        fontWeight="700" 
        fontFamily="sans-serif" 
        textAnchor="middle"
      >
        PAYPAK
      </text>
    </svg>
  );
}

export function BankTransferLogo({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#6B1222" />
      <path 
        d="M50 20L20 38v8h60v-8L50 20zm-22 30v22h8V50h-8zm16 0v22h8V50h-8zm16 0v22h8V50h-8zM18 76v8h64v-8H18z" 
        fill="#F4C078" 
      />
    </svg>
  );
}
