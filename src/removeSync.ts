import { safeRmSync } from 'fs-remove-compat';
import path from 'path';
import { existsSync } from './compat.ts';
import find from './lib/find.ts';

import type { InstallOptions } from './types.ts';

export default function removeSync(moduleIdentifier: string, match: string, options: InstallOptions = {}) {
  find(moduleIdentifier, match, options).forEach((found) => {
    const { name, nodeModules } = found;
    const nestedPath = path.join(nodeModules, name);
    if (existsSync(nestedPath)) {
      console.log(`Removing: ${name}`);
      safeRmSync(nestedPath);
    }
  });
}
