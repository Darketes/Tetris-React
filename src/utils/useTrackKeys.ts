import { useEffect, useState } from 'react';

export const useTrackKeys = () => {
  const [down, setDown] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowDown: false,
    keyZ: false,
  });
  function track(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();

      setDown(down => ({
        ...down,
        ArrowLeft: e.type === 'keydown',
      }));
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();

      setDown(down => ({
        ...down,
        ArrowRight: e.type === 'keydown',
      }));
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();

      setDown(down => ({
        ...down,
        ArrowDown: e.type === 'keydown',
      }));
    }
    if (e.key === 'z' || e.key === 'Z') {
      e.preventDefault();

      setDown(down => ({
        ...down,
        keyZ: e.type === 'keydown',
      }));
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', track);
    window.addEventListener('keyup', track);
    return () => {
      window.removeEventListener('keydown', track);
      window.removeEventListener('keyup', track);
    };
  }, []);
  return down;
};
