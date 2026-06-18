import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ScreenshotProtection() {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Block Keyboard Shortcuts (PrintScreen, Save, Print, Inspect)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key (sometimes reported as 'PrintScreen' or 'Snapshot')
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2000);
      }

      // Windows Snipping Tool (Win + Shift + S / Shift + Win + S)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2000);
      }

      // MacOS Screenshot Utility (Cmd + Shift + 4 / 3 / 5)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault();
        setIsBlurred(true);
        setTimeout(() => setIsBlurred(false), 2000);
      }

      // Save page (Cmd+S or Ctrl+S)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }

      // Print page (Cmd+P or Ctrl+P)
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
      }

      // View Source (Cmd+Opt+U or Ctrl+U)
      if (((e.ctrlKey || e.metaKey) && e.key === 'u') || 
          ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'u')) {
        e.preventDefault();
      }

      // Common Developer Tools shortcuts (F12, Cmd+Opt+I, Ctrl+Shift+I)
      if (e.key === 'F12' || 
          ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') ||
          ((e.ctrlKey || e.metaKey) && e.altKey && e.key === 'i')) {
        e.preventDefault();
      }
    };

    // 3. Block Dragging of Images / Media Assets
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 4. Handle Window Blur / Defocus & Tab Visibility Changes
    // Blurs the screen when the page is defocused (e.g. taking snip screenshot)
    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        // Smooth transition back
        setTimeout(() => {
          if (!document.hidden && document.hasFocus()) {
            setIsBlurred(false);
          }
        }, 120);
      }
    };

    // Bind event listeners
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial check
    if (!document.hasFocus() || document.hidden) {
      setIsBlurred(true);
    }

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      {/* 1. Global Print Protection & User Select CSS */}
      <style>{`
        @media print {
          body, html, main, #root {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }
        }
        body {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>

      {/* 2. Elegant, silent, frosted glass blur overlay when defocused */}
      <AnimatePresence>
        {isBlurred && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[99999] backdrop-blur-2xl bg-zinc-950/40 flex flex-col items-center justify-center select-none"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05 }}
              className="flex flex-col items-center gap-3 text-zinc-100 dark:text-zinc-200"
            >
              <svg className="w-8 h-8 opacity-60 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-mono text-[8px] tracking-[0.3em] uppercase opacity-40">
                Secure Mode Active
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

