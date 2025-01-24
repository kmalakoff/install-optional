import fs from 'fs';
import path from 'path';
import resolve from 'resolve';

import type { Found, InstallOptions } from '../types';

export default function find(moduleIdentifier: string, match: string, options: InstallOptions = {}): Found[] {
  const packagePath = resolve.sync(`${moduleIdentifier}/package.json`, options.cwd ? { basedir: options.cwd } : {});
  const nodeModules = moduleIdentifier[0] === '@' ? path.join(packagePath, '..', '..', '..') : path.join(packagePath, '..', '..');
  const optionalDependencies = JSON.parse(fs.readFileSync(packagePath, 'utf8')).optionalDependencies || {};
  const results = [];
  for (const name in optionalDependencies) {
    if (name.indexOf(match) < 0) continue;
    results.push({
      name,
      version: optionalDependencies[name],
      nodeModules,
    });
  }
  return results;
}
