import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

const STORAGE_KEY = 'onboarding-complete';

type OnboardingState = {
  ready: boolean;
  complete: boolean;
  finish: () => Promise<void>;
  reset: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (mounted) setComplete(value === 'true');
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function finish() {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setComplete(true);
  }

  async function reset() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setComplete(false);
  }

  return (
    <OnboardingContext.Provider value={{ ready, complete, finish, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const state = useContext(OnboardingContext);
  if (!state) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return state;
}
