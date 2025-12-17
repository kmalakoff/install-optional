import Module from 'module';
import path from 'path';
import url from 'url';

var _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
var __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

var major = +process.versions.node.split('.')[0];

// Worker path for calling this same file via function-exec-sync on old Node
var workerPath = path.join(__dirname, '..', '..', 'cjs', 'lib', 'matchesLibc.js');

var functionExec: ((options: object, workerPath: string, ...args: unknown[]) => unknown) | null = null;
var detectLibc: { familySync: () => string | null } | null = null;

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
  // Only relevant for Linux
  if (process.platform !== 'linux') return true;

  // Modern Node: run detect-libc directly
  if (major >= 4) {
    if (!detectLibc) detectLibc = _require('detect-libc');

    // Extract libc suffix from package name
    var match = packageName.match(/-(gnu|gnueabihf|musl)$/);
    if (!match) return true; // No libc suffix, allow it

    var pkgLibc = match[1];
    var systemLibc = detectLibc.familySync(); // 'glibc' or 'musl' or null

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

  // Old Node (0.x): call this same file via function-exec-sync in newer Node
  if (!functionExec) functionExec = _require('function-exec-sync');
  return functionExec({ callbacks: true }, workerPath, packageName) as boolean;
}
