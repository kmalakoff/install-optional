import fs from 'fs';
import { sync as installModuleSync } from 'install-module-linked';
import path from 'path';
import find from './lib/find.ts';

const existsSync = (test) => {
  try {
    (fs.accessSync || fs.statSync)(test);
    return true;
  } catch (_) {
    return false;
  }
};

import type { InstallOptions } from './types.ts';

export default function installSync(moduleIdentifier: string, match: string, options: InstallOptions = {}) {
  find(moduleIdentifier, match, options).forEach((found) => {
    const { name, version, nodeModules } = found;
    const modulePath = path.join(nodeModules, name);
    if (existsSync(modulePath)) return;
    console.log(`Installing: ${name}`);
    const installString = version ? `${name}@${version}` : name;
    installModuleSync(installString, nodeModules);
  });
}
