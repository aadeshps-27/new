import React, { useEffect } from 'react';

export default function ScreenshotProtection() {
  useEffect(() => {
    // 1. Block Context Menu (Right Click)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 2. Block Keyboard Shortcuts (PrintScreen, Save, Print, Inspect, Snip Tool combinations)
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key (sometimes reported as 'PrintScreen' or 'Snapshot')
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault();
      }

      // Windows Snipping Tool (Win + Shift + S / Shift + Win + S)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
      }

      // MacOS Screenshot Utility (Cmd + Shift + 3 / 4 / 5)
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault();
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

    // Bind event listeners
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('dragstart', handleDragStart);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <>
      {/* 1. Global Print Protection CSS */}
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
      `}</style>
    </>
  );
}

