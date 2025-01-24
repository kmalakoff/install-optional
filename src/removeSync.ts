import fs from 'fs';
import path from 'path';
import rimraf2 from 'rimraf2';
import find from './lib/find';

const existsSync = (test) => {
  try {
    (fs.accessSync || fs.statSync)(test);
    return true;
  } catch (_) {
    return false;
  }
};

import type { InstallOptions } from './types';

export default function removeSync(moduleIdentifier: string, match: string, options: InstallOptions = {}) {
  find(moduleIdentifier, match, options).map((found) => {
    const { name, nodeModules } = found;
    const nestedPath = path.join(nodeModules, name);
    if (existsSync(nestedPath)) {
      console.log(`Removing: ${name}`);
      rimraf2.sync(nestedPath, { disableGlob: true });
    }
  });
}
