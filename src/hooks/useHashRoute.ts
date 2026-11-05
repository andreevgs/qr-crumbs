import { useState, useEffect, useCallback } from 'react';

export type AppRoute =
  | { type: 'create' }
  | { type: 'viewer'; payload: string };

function parseHash(hash: string): AppRoute {
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;

  if (cleanHash.startsWith('/v/')) {
    const payload = cleanHash.slice(3); // after '/v/'
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
