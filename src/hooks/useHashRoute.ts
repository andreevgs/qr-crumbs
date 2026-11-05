import { useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | { type: 'create' }
  | { type: 'viewer'; payload: string };

function parseHash(hash: string): AppRoute {
  // Strip leading '#' if present
  let clean = hash.startsWith('#') ? hash.slice(1) : hash;
  if (clean.startsWith('/')) {
    clean = clean.slice(1);
  }

  if (clean.startsWith('v/')) {
    let payload = clean.slice(2);
    const queryIdx = payload.indexOf('?');
    if (queryIdx !== -1) {
      payload = payload.slice(0, queryIdx);
    }
    if (payload.endsWith('/')) {
      payload = payload.slice(0, -1);
    }
    if (payload.length > 0) {
      return { type: 'viewer', payload };
    }
  }

  // Default to creator route
  return { type: 'create' };
}

export function useHashRoute() {
  const [route, setRoute] = useState<AppRoute>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = useCallback((path: string) => {
    const targetHash = path.startsWith('#') ? path : `#${path}`;
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setRoute(parseHash(targetHash));
    }
  }, []);

  return { route, navigate };
}
