import React from 'react';

export const useRunGame = (callback: () => any, condition: any) => {
  const SPEED = 10;
  const requestRef = React.useRef(0);
  const previousTimeRef = React.useRef(0);

  const animate = React.useCallback(
    (time: any) => {
      requestRef.current = requestAnimationFrame(animate);

      const secondsSinceLastRender =
        (time - previousTimeRef.current) / 1000;

      if (secondsSinceLastRender < 1 / SPEED) return;

      callback();
      previousTimeRef.current = time;
    },
    [callback]
  );

  React.useEffect(() => {
    if (condition) return;
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate, condition]);
};
