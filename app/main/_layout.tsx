import { Redirect, Stack } from 'expo-router';

import { useOnboarding } from '../../src/onboarding-state';

export default function MainLayout() {
  const { ready, complete } = useOnboarding();
  if (!ready) return null;
  if (!complete) return <Redirect href="/onboarding" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
