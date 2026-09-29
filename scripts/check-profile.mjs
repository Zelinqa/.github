import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const profile = readFileSync('profile/README.md', 'utf8');
assert.doesNotMatch(profile, /\bNBQ\b|nbq-sdk|nbq-mcp/i);
assert.doesNotMatch(profile, /localhost|127\.0\.0\.1|pip(?:_| )install/i);
assert.match(profile, /<strong>Try Zelinqa for free<\/strong>/);
assert.match(profile, /Request an invitation/);
assert.match(profile, /create an API key in Studio/);
assert.match(
  profile,
  /<a href="https:\/\/zelinqa\.ai\/en\/pricing"><strong>Get free Developer access →<\/strong><\/a>/,
);
assert.match(profile, /alt="uv add zelinqa"/);
assert.match(profile, /https:\/\/img\.shields\.io\/badge\/uv_add_zelinqa-/);

for (const [, asset] of profile.matchAll(/(?:src|srcset)="(\.\/assets\/[^\"]+)"/g)) {
  assert.ok(existsSync(`profile/${asset}`), `Missing local asset: ${asset}`);
}

for (const link of [
  'https://pypi.org/project/zelinqa/',
  'https://www.npmjs.com/package/@zelinqa/sdk',
  'https://pypi.org/project/zelinqa-mcp/',
  'https://github.com/Zelinqa/zelinqa-sdk',
  'https://github.com/Zelinqa/zelinqa-mcp',
  'https://docs.zelinqa.ai',
  'https://zelinqa.ai/en/pricing',
]) {
  assert.ok(profile.includes(link), `Missing product link: ${link}`);
}

const svgs = [
  'profile/assets/zelinqa-logo.svg',
  'profile/assets/zelinqa-logo-light.svg',
  'profile/assets/zelinqa-product-map.svg',
  'profile/assets/spacer.svg',
];
const parsed = spawnSync('python3', [
  '-c',
  'import sys,xml.etree.ElementTree as ET; [ET.parse(path) for path in sys.argv[1:]]',
  ...svgs,
], { encoding: 'utf8' });
assert.equal(parsed.status, 0, parsed.stderr);

const avatar = readFileSync('profile/assets/zelinqa-github-avatar-zeta.png');
assert.ok(avatar.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
assert.ok(avatar.readUInt32BE(16) > 0 && avatar.readUInt32BE(20) > 0);

console.log('ok — profile references, Developer access, uv command, product links, SVGs and avatar');
