import pkg from './package.json' with { type: 'json' };

export default {
  expo: {
    name: 'Expo Template',
    slug: 'expo-template',
    scheme: 'expo-template',
    version: pkg.version,
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    platforms: ['ios'],
    ios: {
      bundleIdentifier: 'com.example.expotemplate',
      buildNumber: '1',
      appleTeamId: process.env.APPLE_TEAM_ID || undefined,
      config: { usesNonExemptEncryption: false }
    },
    plugins: ['expo-router'],
    experiments: { typedRoutes: true }
  }
};
