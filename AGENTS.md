# Expo Template Guide for Coding Agents

This is an iOS-only Expo Router starter. Keep it simple enough for a first-time app builder to understand.

- Onboarding lives in `app/onboarding/index.tsx`. The three example steps and progress bar should remain runnable while app-specific content is added.
- The main app lives in `app/main/`. Onboarding completion is persisted in `src/onboarding-state.tsx`; it is navigation state, not proof of an active subscription.
- Superwall is configured in `app/_layout.tsx` when `EXPO_PUBLIC_SUPERWALL_IOS_API_KEY` is present. The onboarding placement is `onboarding_complete`. A missing key runs the explanatory demo path.
- PostHog is configured in `app/_layout.tsx` and disabled until a project API key is supplied.
- Keep the iOS release path local: `scripts/release.mjs` runs Expo prebuild, Xcode archive/export, and `asc builds upload`. Do not add EAS or private AppStu dependencies.
- Do not commit API keys, `.p8` files, `.env`, generated `ios/`, `build/`, or `node_modules/`.
- Validate source changes with `bun run typecheck` and `bunx expo export --platform ios`. Re-run `bun run prebuild` after native configuration or dependency changes.
