// Worker that runs in a newer Node process via function-exec-sync
// Uses detect-libc which requires modern JS syntax

import detectLibc from 'detect-libc';

/**
 * Check if a package name's libc suffix matches the system's libc.
 * Only relevant for Linux - returns true for all other platforms.
 *
 * Package name patterns:
 *   @swc/core-linux-x64-gnu     → requires glibc
 *   @swc/core-linux-x64-musl    → requires musl
 *   @swc/core-linux-arm-gnueabihf → requires glibc (ARM hard float)
 */
export default function matchesLibc(packageName: string): boolean {
  // Only relevant for Linux
  if (process.platform !== 'linux') return true;

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
