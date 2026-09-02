import fs from 'fs';
import path from 'path';
import { sync as installModuleSync } from 'install-module-linked';
import find from './lib/find.js';

const existsSync = (test) => {
  try {
    (fs.accessSync || fs.statSync)(test);
    return true;
  } catch (_) {
    return false;
  }
};

import type { InstallOptions } from './types.js';

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
