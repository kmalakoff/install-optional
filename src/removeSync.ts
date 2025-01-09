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

export default function removeSync(moduleIdentifier, match) {
  find(moduleIdentifier, match).map((found) => {
    const { name, nodeModules } = found;
    const nestedPath = path.join(nodeModules, name);
    if (existsSync(nestedPath)) {
      console.log(`Removing: ${name}`);
      rimraf2.sync(nestedPath, { disableGlob: true });
    }
  });
}
