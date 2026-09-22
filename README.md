# Expo Template

A small iOS app starter for the Consumer App Kit. It includes three editable onboarding screens, a progress bar, a Superwall paywall placement, a main app area, purchase restoration, PostHog analytics, and a local Xcode release path. It contains no AppStu packages or CLI.

## Start

You need a Mac with Xcode, Bun, and an Apple Developer account.

```bash
bun install
cp .env.example .env
bun run ios
```

Run `bun run start` after the first native build. This project uses native modules, so use its development build on an iPhone or simulator rather than Expo Go. The example onboarding works without service keys. At the final step, it explains what Superwall needs and lets you enter the main app.

## Make it yours

1. Change `name`, `slug`, `scheme`, and `ios.bundleIdentifier` in `app.config.js`. The example bundle ID cannot be used for your App Store app.
2. Replace the example content in `app/onboarding/index.tsx`, `app/main/index.tsx`, and `app/main/settings.tsx`.
3. Create a Superwall iOS app and a campaign for the `onboarding_complete` placement. Put its public iOS API key in `.env` as `EXPO_PUBLIC_SUPERWALL_IOS_API_KEY`.
4. Create a PostHog project and put its project API key and region host in `.env`. Analytics is disabled until a key is present.
5. Rebuild the native app after changing native configuration or dependencies: `bun run ios`.

The onboarding completion flag only controls which route opens on launch. It is **not** a subscription entitlement. The demo main app is available after the paywall is dismissed, skipped, or fails; gate any paid feature using Superwall's subscription status when you add it.

## Upload directly to App Store Connect

This path runs locally on your Mac. It does not use EAS.

1. Create your app record in App Store Connect, with the same bundle ID as `app.config.js`.
2. Set `APPLE_TEAM_ID` in `.env` to your 10-character Apple Developer team ID. Sign in to that team in Xcode so automatic signing can create or locate the required credentials.
3. Install the [App Store Connect CLI](https://github.com/rorkai/App-Store-Connect-CLI): `brew install asc`.
4. Create an App Store Connect API key and follow the CLI's `asc auth login` instructions. Keep the `.p8` key outside this repository. Run `asc auth status --validate` to check it.
5. Set `ASC_APP_ID` in `.env` to your numeric App Store Connect app ID.
6. Increase `ios.buildNumber` in `app.config.js` for each new upload. Change the app version when appropriate.

Then run:

```bash
bun run ios:release
```

The command generates the native iOS project, archives it with Xcode, exports an IPA, and calls `asc builds upload`. To retry only the upload, run `bun run ios:upload`. Intermediate files are kept under the ignored `build/` directory. After Apple processes the upload, choose the build in App Store Connect and submit the listing for App Review there.

For individual steps, use `bun run ios:archive`, `bun run ios:export`, and `bun run ios:upload`.

## Before submitting

Replace the template copy and design, add a real app icon and App Store screenshots, and fill in privacy, support, and subscription details required for your app. Test a purchase and restoration on a device using Apple's sandbox or TestFlight. The template gives you working integration points; each app still needs its own product and store setup.
