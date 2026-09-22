import type { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const colors = {
  background: '#F7F6F2',
  ink: '#1D2520',
  muted: '#637168',
  accent: '#316A4D',
  pale: '#E2ECE4'
};

export function Screen({ children }: PropsWithChildren) {
  return <SafeAreaView style={styles.screen}><View style={styles.inner}>{children}</View></SafeAreaView>;
}

export function PrimaryButton({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabled]}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  inner: { flex: 1, padding: 24 },
  title: { fontSize: 34, fontWeight: '700', color: colors.ink, lineHeight: 40 },
  body: { fontSize: 18, lineHeight: 27, color: colors.muted },
  button: { backgroundColor: colors.accent, borderRadius: 16, minHeight: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  buttonText: { color: 'white', fontSize: 17, fontWeight: '600' },
  disabled: { opacity: 0.5 }
});
