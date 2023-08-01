import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {ErrorBoundary} from './src/lib/error-boundary';
import {Navigation} from './navigation';
import {ThemeContextProvider} from './src/services/theme-context';

export function App() {
  return (
    <ThemeContextProvider>
      <NavigationContainer>
        <ErrorBoundary>
          <Navigation />
        </ErrorBoundary>
      </NavigationContainer>
    </ThemeContextProvider>
  );
}
