import Module from 'module';
import path from 'path';
import url from 'url';

var _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
var __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

// Worker MUST always load from dist/cjs/ for old Node compatibility
var workerPath = path.join(__dirname, '..', '..', 'cjs', 'lib', 'matchesLibcWorker.js');

var functionExec: ((options: object, workerPath: string, ...args: unknown[]) => unknown) | null = null;

/**
 * Check if a package name's libc suffix matches the system's libc.
 * Only relevant for Linux - returns true for all other platforms.
 *
 * Uses function-exec-sync to run in a newer Node process that supports
 * detect-libc (which uses modern JS syntax).
 *
 * @example
 * matchesLibc('@swc/core-linux-x64-gnu')   // true on glibc systems
 * matchesLibc('@swc/core-linux-x64-musl')  // true on musl systems
 * matchesLibc('@swc/core-darwin-arm64')    // true (no libc suffix)
 */
export default function matchesLibc(packageName: string): boolean {
  // Only relevant for Linux - skip worker entirely on other platforms
  if (process.platform !== 'linux') return true;

  if (!functionExec) functionExec = _require('function-exec-sync');
  return functionExec({ callbacks: true }, workerPath, packageName) as boolean;
}
