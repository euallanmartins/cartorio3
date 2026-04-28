import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/theme';
import { LinkingConfiguration } from './src/navigation/LinkingConfiguration';
import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { OfflineBanner } from './src/components/OfflineBanner';
import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = '';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    debug: false,
  });
}

function App() {
  return (
    <AppErrorBoundary>
      <AppProvider>
        <SafeAreaProvider>
          <NavigationContainer linking={LinkingConfiguration}>
            <StatusBar style="light" backgroundColor={colors.background.primary} />
            <OfflineBanner />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </AppProvider>
    </AppErrorBoundary>
  );
}

export default Sentry.wrap(App);
