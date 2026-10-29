@import "tailwindcss";

:root {
  color-scheme: dark;
  --shell-panel: rgba(17, 17, 18, 0.75);
  --shell-border: rgba(255, 255, 255, 0.08);
  --glow: rgba(59, 130, 246, 0.38);
}

@layer base {
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    width: 100%;
    height: 100%;
    background: #000;
  }

  body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    user-select: none;
    -webkit-user-select: none;
    background:
      radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 30%),
      radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.18), transparent 35%),
      #000;
  }

  /* Thin Windows 10 scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(140, 140, 140, 0.4);
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 100, 100, 0.7);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.42);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(96, 165, 250, 0);
  }
}

.animate-slideUp {
  animation: slideUp 0.18s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

.animate-slideLeft {
  animation: slideLeft 0.18s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

.animate-fadeIn {
  animation: fadeIn 0.15s ease-out forwards;
}

.glass-panel {
  background: rgba(15, 15, 17, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 15px 40px rgba(2, 6, 23, 0.45);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.quick-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.55rem 0.6rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.9);
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.quick-action-btn:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(96, 165, 250, 0.42);
}

.start-menu-hero {
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.42), rgba(14, 165, 233, 0.14)),
    rgba(17, 17, 18, 0.72);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 12px 32px rgba(2, 6, 23, 0.32);
}

.start-menu-hero::after {
  content: "";
  position: absolute;
  inset: auto -10% -30% 35%;
  height: 180px;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.35), transparent 60%);
  pointer-events: none;
}

.status-pill {
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(15, 23, 42, 0.45);
  color: rgba(255, 255, 255, 0.85);
}

.app-tile-glow {
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.desktop-dock {
  animation: pulseGlow 2.8s ease-in-out infinite;
}

