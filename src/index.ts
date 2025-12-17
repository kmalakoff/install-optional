export { default as installSync } from './installSync.ts';
export { default as matchesLibc } from './lib/matchesLibc.ts';
export { default as removeSync } from './removeSync.ts';
export type * from './types.ts';

import type { InstallCallback, InstallOptions } from './types.ts';
import { default as worker } from './workers/install.ts';
export function install(installString: string, match: string, options?: InstallOptions | InstallCallback, callback?: InstallCallback): undefined | Promise<string> {
  if (typeof options === 'function') {
    callback = options as InstallCallback;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return worker(installString, match, options, callback) as undefined;
  return new Promise((resolve, reject) => worker(installString, match, options, (err) => (err ? reject(err) : resolve(undefined))));
}
