import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ style }: { style?: React.CSSProperties }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('klasspay_theme');
      return saved ? saved === 'dark' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('klasspay_theme', theme);
    } catch {
      // Ignore private browsing / sandboxed storage exceptions
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div style={style}>
      <button
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isDark ? 'flex-end' : 'flex-start',
          width: '56px',
          height: '30px',
          backgroundColor: isDark ? '#1e1b4b' : '#e2e8f0',
          border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(148, 163, 184, 0.4)'}`,
          borderRadius: '9999px',
          padding: '3px',
          cursor: 'pointer',
          outline: 'none',
          position: 'relative',
          boxShadow: isDark 
            ? '0 0 15px rgba(139, 92, 246, 0.3)' 
            : '0 2px 8px rgba(0, 0, 0, 0.15)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#8b5cf6' : '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          }}
        >
          {isDark ? (
            <Moon size={13} style={{ fill: '#ffffff' }} />
          ) : (
            <Sun size={13} />
          )}
        </motion.div>
      </button>
    </div>
  );
}
