import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useOnboarding } from '../onboarding-state';
import { colors } from '../ui';

export default function Index() {
  const { ready, complete } = useOnboarding();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}><ActivityIndicator color={colors.accent} /></View>;
  }

  return <Redirect href={complete ? '/main' : '/onboarding'} />;
}
