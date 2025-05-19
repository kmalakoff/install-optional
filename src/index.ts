export type * from './types.js';
export { default as installSync } from './installSync.js';
export { default as removeSync } from './removeSync.js';

import type { InstallCallback, InstallOptions } from './types.js';
import { default as worker } from './workers/install.js';
export function install(installString: string, match: string, options?: InstallOptions | InstallCallback, callback?: InstallCallback): undefined | Promise<string> {
  if (typeof options === 'function') {
    callback = options as InstallCallback;
    options = {};
  }
  options = options || {};

  if (typeof callback === 'function') return worker(installString, match, options, callback) as undefined;
  return new Promise((resolve, reject) => worker(installString, match, options, (err) => (err ? reject(err) : resolve(undefined))));
}
