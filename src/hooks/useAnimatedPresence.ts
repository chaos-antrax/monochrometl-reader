'use client';
import { useEffect, useRef, useState } from 'react';

export default function useAnimatedPresence<T>(value: T | null, duration = 260) {
  const [rendered, setRendered] = useState<T | null>(value);
  const [state, setState] = useState<'open' | 'closed'>(value === null ? 'closed' : 'open');
  const timeout = useRef(0);
  const firstFrame = useRef(0);
  const secondFrame = useRef(0);
  useEffect(() => {
    window.clearTimeout(timeout.current);
    cancelAnimationFrame(firstFrame.current);
    cancelAnimationFrame(secondFrame.current);
    if (value !== null) {
      setState('closed');
      setRendered(value);
      firstFrame.current = requestAnimationFrame(() => {
        secondFrame.current = requestAnimationFrame(() => setState('open'));
      });
      return () => {
        cancelAnimationFrame(firstFrame.current);
        cancelAnimationFrame(secondFrame.current);
      };
    }
    setState('closed');
    timeout.current = window.setTimeout(() => setRendered(null), duration);
    return () => window.clearTimeout(timeout.current);
  }, [value, duration]);
  return { value: rendered, mounted: rendered !== null, state };
}
