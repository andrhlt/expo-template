import { Stack } from 'expo-router';
import { SuperwallProvider } from 'expo-superwall';
import { PostHogProvider } from 'posthog-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { config } from '../src/config';
import { OnboardingProvider } from '../src/onboarding-state';

export default function RootLayout() {
  const navigation = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="main" />
    </Stack>
  );

  return (
    <SafeAreaProvider>
      <PostHogProvider
        apiKey={config.posthogKey || 'unconfigured'}
        autocapture={false}
        options={{ host: config.posthogHost, disabled: !config.posthogKey }}
      >
        <OnboardingProvider>
          {config.superwallKey ? (
            <SuperwallProvider apiKeys={{ ios: config.superwallKey }}>
              {navigation}
            </SuperwallProvider>
          ) : navigation}
        </OnboardingProvider>
      </PostHogProvider>
    </SafeAreaProvider>
  );
}
