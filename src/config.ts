export const config = {
  superwallKey: process.env.EXPO_PUBLIC_SUPERWALL_IOS_API_KEY?.trim() ?? '',
  posthogKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY?.trim() ?? '',
  posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
  paywallPlacement: 'onboarding_complete'
};
