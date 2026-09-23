import React from 'react';

export default function Logo({ size = 'medium', variant = 'default', showTagline = true, className = '' }) {
  // Size presets optimized for tight UI spaces and responsiveness
  const sizes = {
    small: { boxSize: 32, titleFont: '0.9rem', subFont: '0.55rem', locationFont: '0.525rem', gap: '8px' },
    medium: { boxSize: 38, titleFont: '1.075rem', subFont: '0.625rem', locationFont: '0.6rem', gap: '10px' },
    large: { boxSize: 48, titleFont: '1.35rem', subFont: '0.75rem', locationFont: '0.7rem', gap: '12px' }
  };

  const currentSize = sizes[size] || sizes.medium;

  // Determine text color based on variant
  let mainTextColor = 'var(--text-main, #0f172a)';
  let subTextColor = 'var(--text-muted, #64748b)';
  if (variant === 'light') {
    mainTextColor = '#ffffff';
    subTextColor = '#cbd5e1';
  } else if (variant === 'dark') {
    mainTextColor = '#0f172a';
    subTextColor = '#475569';
  }

  return (
    <div 
      className={`brand-logo-container ${className}`} 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: currentSize.gap,
        userSelect: 'none',
        maxWidth: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Yellow Logo Icon Box */}
      <div 
        style={{
          width: `${currentSize.boxSize}px`,
          height: `${currentSize.boxSize}px`,
          backgroundColor: '#f59e0b',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          boxShadow: '0 3px 8px rgba(245, 158, 11, 0.3)',
          flexShrink: 0
        }}
      >
        {/* PD Monogram SVG */}
        <svg 
          viewBox="0 0 100 70" 
          width="82%" 
          height="58%" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* P Letter */}
          <path 
            d="M 20,10 L 45,10 C 60,10 60,35 45,35 L 32,35 L 32,60 L 20,60 Z M 32,21 L 43,21 C 49,21 49,24 43,24 L 32,24 Z" 
            fill="#1c1917" 
            stroke="#1c1917"
            strokeWidth="3"
          />
          {/* D Letter */}
          <path 
            d="M 50,10 L 68,10 C 85,10 85,60 68,60 L 50,60 Z M 62,21 L 67,21 C 74,21 74,49 67,49 L 62,49 Z" 
            fill="#1c1917" 
            stroke="#1c1917"
            strokeWidth="3"
          />
        </svg>
        <span 
          style={{ 
            fontSize: `${Math.max(7, currentSize.boxSize * 0.17)}px`, 
            fontWeight: 900, 
            color: '#1c1917', 
            letterSpacing: '0.05em',
            lineHeight: 1,
            marginTop: '-1px',
            fontFamily: "'Outfit', sans-serif"
          }}
        >
          PP DOORS
        </span>
      </div>

      {/* Brand Text Block */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, overflow: 'hidden' }}>
        <div 
          style={{ 
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", 
            fontWeight: 800, 
            fontSize: currentSize.titleFont, 
            lineHeight: 1.1,
            letterSpacing: '0.01em',
            color: mainTextColor,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          PUTHENPURAYIL DOORS
        </div>

        {showTagline && (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '6px',
              marginTop: '1px',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            <span 
              style={{ 
                fontSize: currentSize.subFont, 
                fontWeight: 600, 
                color: subTextColor,
                letterSpacing: '0.03em' 
              }}
            >
              CRM & WORKFLOW
            </span>
            <span 
              style={{ 
                fontSize: currentSize.locationFont, 
                fontWeight: 800, 
                color: '#f59e0b', 
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              • NELLAMKANDY
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
