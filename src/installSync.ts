import { sync as installModuleSync } from 'install-module-linked-compat';
import path from 'path';
import { existsSync } from './compat.ts';
import find from './lib/find.ts';

import type { InstallOptions } from './types.ts';

export default function installSync(moduleIdentifier: string, match: string, options: InstallOptions = {}) {
  find(moduleIdentifier, match, options).forEach((found) => {
    const { name, version, nodeModules } = found;
    const modulePath = path.join(nodeModules, name);
    if (existsSync(modulePath)) return;
    console.log(`Installing: ${name}`);
    const installString = version ? `${name}@${version}` : name;
    try {
      installModuleSync(installString, nodeModules);
    } catch (err) {
      // Log and continue - don't crash on platform-incompatible packages
      console.log(`Skipping ${name}: ${(err as Error).message}`);
    }
  });
}
