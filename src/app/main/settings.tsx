import { router } from 'expo-router';
import { useSuperwall } from 'expo-superwall';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { config } from '../../config';
import { useOnboarding } from '../../onboarding-state';
import { colors, PrimaryButton, Screen, styles } from '../../ui';

function RestoreButton() {
  const restorePurchases = useSuperwall((state) => state.restorePurchases);

  async function restore() {
    try {
      await restorePurchases();
      Alert.alert('Restore finished', 'Check your subscription status on the main screen.');
    } catch {
      Alert.alert('Restore failed', 'Please try again later.');
    }
  }

  return <PrimaryButton title="Restore purchases" onPress={() => void restore()} />;
}

export default function Settings() {
  const { reset } = useOnboarding();

  async function restart() {
    await reset();
    router.replace('/onboarding');
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()} accessibilityRole="button"><Text style={local.back}>‹ Back</Text></Pressable>
      <View style={local.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.body}>This is a starter settings screen. Add your app’s account, support, and legal links here before submission.</Text>
      </View>
      <View style={local.actions}>
        {config.superwallKey ? <RestoreButton /> : <Text style={local.note}>Add a Superwall key to enable purchase restoration.</Text>}
        <Pressable accessibilityRole="button" onPress={() => void restart()}><Text style={local.restart}>Replay onboarding</Text></Pressable>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  back: { color: colors.accent, fontSize: 18, paddingVertical: 8 },
  content: { flex: 1, gap: 20, justifyContent: 'center' },
  actions: { gap: 24, alignItems: 'center' },
  note: { color: colors.muted, textAlign: 'center' },
  restart: { color: colors.accent, fontWeight: '600', fontSize: 16, padding: 10 }
});
