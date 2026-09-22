import { Redirect, router } from 'expo-router';
import { usePlacement } from 'expo-superwall';
import { useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { usePostHog } from 'posthog-react-native';

import { config } from '../../config';
import { useOnboarding } from '../../onboarding-state';
import { colors, PrimaryButton, Screen, styles } from '../../ui';

const steps = [
  { title: 'A starting point for your idea.', body: 'Replace these screens with the story your app needs to tell. Keep each step focused on one idea.' },
  { title: 'Show the result.', body: 'Explain the outcome someone gets from using your app. Images, examples, and proof can go here.' },
  { title: 'Invite them in.', body: 'When they continue, this template opens your Superwall onboarding paywall, then takes them to the main app.' }
];

function OnboardingScreens({ presentPaywall }: { presentPaywall: (finish: () => void) => void }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { ready, complete, finish } = useOnboarding();
  const posthog = usePostHog();

  if (!ready) return null;
  if (complete) return <Redirect href="/main" />;

  function goToMain() {
    void finish().then(() => router.replace('/main'));
  }

  function next() {
    if (step < steps.length - 1) {
      posthog.capture('onboarding_step_completed', { step: step + 1 });
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    posthog.capture('onboarding_completed');
    presentPaywall(goToMain);
  }

  return (
    <Screen>
      <View style={local.progress} accessibilityLabel={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((item, index) => <View key={item.title} style={[local.segment, index <= step && local.segmentActive]} />)}
      </View>
      <View style={local.content}>
        <Text style={local.eyebrow}>YOUR APP · {step + 1} OF {steps.length}</Text>
        <Text style={styles.title}>{steps[step].title}</Text>
        <Text style={styles.body}>{steps[step].body}</Text>
      </View>
      <PrimaryButton title={submitting ? 'Opening paywall…' : 'Continue'} disabled={submitting} onPress={next} />
    </Screen>
  );
}

function ConfiguredOnboarding() {
  const completed = useRef(false);
  const finishRef = useRef<(() => void) | null>(null);
  const { registerPlacement } = usePlacement({
    onDismiss: () => complete(),
    onSkip: () => complete(),
    onError: () => complete()
  });

  function complete() {
    if (completed.current) return;
    completed.current = true;
    finishRef.current?.();
  }

  function presentPaywall(finish: () => void) {
    finishRef.current = finish;
    void registerPlacement({
      placement: config.paywallPlacement,
      feature: complete
    }).catch(complete);
  }

  return <OnboardingScreens presentPaywall={presentPaywall} />;
}

export default function Onboarding() {
  if (config.superwallKey) return <ConfiguredOnboarding />;

  return <OnboardingScreens presentPaywall={(finish) => {
    Alert.alert('Superwall is not configured', 'Add your iOS API key to .env and create the onboarding_complete placement in Superwall.', [
      { text: 'Continue to app', onPress: finish }
    ]);
  }} />;
}

const local = StyleSheet.create({
  progress: { flexDirection: 'row', gap: 7, marginTop: 16 },
  segment: { height: 5, flex: 1, borderRadius: 5, backgroundColor: colors.pale },
  segmentActive: { backgroundColor: colors.accent },
  content: { flex: 1, justifyContent: 'center', gap: 20 },
  eyebrow: { color: colors.accent, fontWeight: '700', letterSpacing: 2, fontSize: 12 }
});
