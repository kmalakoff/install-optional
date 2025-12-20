export { default as installSync } from './installSync.ts';
export { default as matchesLibc } from './lib/matchesLibc.ts';
export { default as removeSync } from './removeSync.ts';
export type * from './types.ts';

import type { InstallCallback, InstallOptions } from './types.ts';
import { default as worker } from './workers/install.ts';
export function install(installString: string, match: string, callback: InstallCallback): void;
export function install(installString: string, match: string, options: InstallOptions, callback: InstallCallback): void;
export function install(installString: string, match: string, options?: InstallOptions): Promise<void>;
export function install(installString: string, match: string, options?: InstallOptions | InstallCallback, callback?: InstallCallback): void | Promise<void> {
  callback = typeof options === 'function' ? options : callback;
  options = typeof options === 'function' ? {} : ((options || {}) as InstallOptions);

  if (typeof callback === 'function') return worker(installString, match, options, callback);
  return new Promise((resolve, reject) => worker(installString, match, options, (err) => (err ? reject(err) : resolve())));
}
