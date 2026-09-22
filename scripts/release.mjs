import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const buildDir = path.join(root, 'build');
const manifestPath = path.join(buildDir, 'latest.json');
const action = process.argv[2];

function run(command, args, cwd = root) {
  execFileSync(command, args, { cwd, stdio: 'inherit', env: process.env });
}

function requireCommand(command) {
  try {
    execFileSync('which', [command], { stdio: 'ignore' });
  } catch {
    throw new Error(`Missing ${command}. Install it before running this command.`);
  }
}

function currentBuild() {
  if (!existsSync(manifestPath)) {
    throw new Error('No archive found. Run bun run ios:archive first.');
  }
  return JSON.parse(readFileSync(manifestPath, 'utf8'));
}

function saveBuild(build) {
  mkdirSync(buildDir, { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(build, null, 2)}\n`);
}

function findWorkspace() {
  const iosDir = path.join(root, 'ios');
  const workspaces = readdirSync(iosDir).filter((name) => name.endsWith('.xcworkspace') && name !== 'Pods.xcworkspace');
  if (workspaces.length !== 1) throw new Error(`Expected one app workspace in ios/, found ${workspaces.length}.`);
  return { iosDir, workspace: workspaces[0], scheme: workspaces[0].replace(/\.xcworkspace$/, '') };
}

function archive() {
  requireCommand('xcodebuild');
  const teamId = process.env.APPLE_TEAM_ID?.trim();
  if (!teamId) throw new Error('Set APPLE_TEAM_ID in .env before archiving for App Store Connect.');
  run('bunx', ['expo', 'prebuild', '--platform', 'ios']);
  const { iosDir, workspace, scheme } = findWorkspace();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const archivePath = path.join(buildDir, `${scheme}-${stamp}.xcarchive`);
  mkdirSync(buildDir, { recursive: true });
  run('xcodebuild', [
    '-allowProvisioningUpdates',
    '-workspace', workspace,
    '-scheme', scheme,
    '-configuration', 'Release',
    '-destination', 'generic/platform=iOS',
    '-archivePath', archivePath,
    'archive',
    `DEVELOPMENT_TEAM=${teamId}`,
    'CODE_SIGN_STYLE=Automatic'
  ], iosDir);
  saveBuild({ archivePath, scheme });
  console.log(`Archive ready: ${archivePath}`);
}

function exportIpa() {
  requireCommand('xcodebuild');
  const build = currentBuild();
  if (!existsSync(build.archivePath)) throw new Error(`Archive not found: ${build.archivePath}`);
  const exportPath = path.join(buildDir, 'exports', path.basename(build.archivePath, '.xcarchive'));
  const optionsPath = path.join(buildDir, 'ExportOptions.plist');
  const options = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "https://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>method</key><string>app-store-connect</string><key>destination</key><string>export</string><key>signingStyle</key><string>automatic</string></dict></plist>\n`;
  writeFileSync(optionsPath, options);
  run('xcodebuild', [
    '-allowProvisioningUpdates',
    '-exportArchive',
    '-archivePath', build.archivePath,
    '-exportPath', exportPath,
    '-exportOptionsPlist', optionsPath
  ]);
  const ipas = readdirSync(exportPath).filter((name) => name.endsWith('.ipa'));
  if (ipas.length !== 1) throw new Error(`Expected one IPA in ${exportPath}, found ${ipas.length}.`);
  build.ipaPath = path.join(exportPath, ipas[0]);
  saveBuild(build);
  console.log(`IPA ready: ${build.ipaPath}`);
}

function upload() {
  requireCommand('asc');
  const appId = process.env.ASC_APP_ID?.trim();
  if (!appId || !/^\d+$/.test(appId)) {
    throw new Error('Set ASC_APP_ID to your numeric App Store Connect app ID in .env.');
  }
  const build = currentBuild();
  if (!build.ipaPath || !existsSync(build.ipaPath)) {
    throw new Error('No IPA found. Run bun run ios:export first.');
  }
  run('asc', ['builds', 'upload', '--app', appId, '--ipa', build.ipaPath]);
  console.log('Upload complete. Check processing in App Store Connect.');
}

try {
  if (action === 'archive') archive();
  else if (action === 'export') exportIpa();
  else if (action === 'upload') upload();
  else if (action === 'release') {
    archive();
    exportIpa();
    upload();
  } else {
    throw new Error('Usage: bun scripts/release.mjs <archive|export|upload|release>');
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
