import { router } from 'expo-router';
import { useUser } from 'expo-superwall';
import { StyleSheet, Text, View } from 'react-native';
import { usePostHog } from 'posthog-react-native';

import { config } from '../../src/config';
import { colors, PrimaryButton, Screen, styles } from '../../src/ui';

function SubscriptionStatus() {
  const { subscriptionStatus } = useUser();
  return <Text style={local.status}>Superwall status: {subscriptionStatus.status}</Text>;
}

export default function Main() {
  const posthog = usePostHog();

  function openSettings() {
    posthog.capture('settings_opened');
    router.push('/main/settings');
  }

  return (
    <Screen>
      <View style={local.content}>
        <Text style={local.eyebrow}>YOUR MAIN APP</Text>
        <Text style={styles.title}>Your app starts here.</Text>
        <Text style={styles.body}>Replace this screen with the main experience for your idea. Onboarding, paywall, analytics, and release tooling are ready to customize.</Text>
        {config.superwallKey ? <SubscriptionStatus /> : <Text style={local.status}>Superwall demo mode: add a key to .env</Text>}
      </View>
      <PrimaryButton title="Settings" onPress={openSettings} />
    </Screen>
  );
}

const local = StyleSheet.create({
  content: { flex: 1, justifyContent: 'center', gap: 20 },
  eyebrow: { color: colors.accent, fontWeight: '700', letterSpacing: 2, fontSize: 12 },
  status: { color: colors.muted, fontSize: 14, marginTop: 12 }
});
