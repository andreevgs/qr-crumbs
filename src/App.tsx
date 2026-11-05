import React from 'react';
import { useHashRoute } from './hooks/useHashRoute';
import { CreatorView } from './views/CreatorView';
import { ViewerView } from './views/ViewerView';

export const App: React.FC = () => {
  const { route, navigate } = useHashRoute();

  if (route.type === 'viewer') {
    return <ViewerView payload={route.payload} onNavigate={navigate} />;
  }

  return <CreatorView />;
};
