import Module from 'module';
import { bindSync } from 'node-version-call-local';
import path from 'path';
import url from 'url';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerPath = path.join(__dirname, '..', '..', 'cjs', 'lib', 'matchesLibc.js');

let detectLibc: { familySync: () => string | null } | null = null;

function run(packageName: string): boolean {
  if (!detectLibc) detectLibc = _require('detect-libc');

  // Extract libc suffix from package name
  const match = packageName.match(/-(gnu|gnueabihf|musl)$/);
  if (!match) return true; // No libc suffix, allow it

  const pkgLibc = match[1];
  const systemLibc = detectLibc.familySync(); // 'glibc' or 'musl' or null

  // If we can't detect system libc, allow the package (be permissive)
  if (!systemLibc) return true;

  // Check if package libc matches system libc
  if (pkgLibc === 'gnu' || pkgLibc === 'gnueabihf') {
    return systemLibc === 'glibc';
  }
  if (pkgLibc === 'musl') {
    return systemLibc === 'musl';
  }

  return true;
}

// spawnOptions: false - no node/npm spawn (library call only)
const worker = major >= 4 ? run : bindSync('>=4', workerPath, { spawnOptions: false });

/**
 * Check if a package name's libc suffix matches the system's libc.
 * Only relevant for Linux - returns true for all other platforms.
 *
 * On modern Node (>= 4), uses detect-libc directly.
 * On old Node (0.x), calls this same file via function-exec-sync.
 *
 * @example
 * matchesLibc('@swc/core-linux-x64-gnu')   // true on glibc systems
 * matchesLibc('@swc/core-linux-x64-musl')  // true on musl systems
 * matchesLibc('@swc/core-darwin-arm64')    // true (no libc suffix)
 */
export default function matchesLibc(packageName: string): boolean {
  // Only relevant for Linux - check early to avoid unnecessary work
  if (process.platform !== 'linux') return true;
  return worker(packageName) as boolean;
}
