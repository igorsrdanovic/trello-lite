import { useEffect } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  action: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shiftKey ? e.shiftKey : !e.shiftKey;
        const metaMatch = shortcut.metaKey ? e.metaKey : !e.metaKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && metaMatch && keyMatch) {
          if (shortcut.preventDefault) {
            e.preventDefault();
          }
          shortcut.action(e);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
