import fs from 'fs';
import path from 'path';
import resolve from 'resolve';

import type { Found } from '../types';

export default function find(moduleIdentifier: string, match: string): Found[] {
  const packagePath = resolve.sync(`${moduleIdentifier}/package.json`);
  const nodeModules = moduleIdentifier[0] === '@' ? path.join(packagePath, '..', '..', '..') : path.join(packagePath, '..', '..');
  const optionalDependencies = JSON.parse(fs.readFileSync(packagePath, 'utf8')).optionalDependencies || {};
  return Object.keys(optionalDependencies)
    .filter((name) => name.indexOf(match) >= 0)
    .map((name) => ({
      name,
      version: optionalDependencies[name],
      nodeModules,
    }));
}
