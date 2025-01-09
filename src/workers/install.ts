import fs from 'fs';
import path from 'path';
import installModule from 'install-module-linked';
import Queue from 'queue-cb';
import find from '../lib/find';

import type { InstallCallback, InstallOptions } from '../types';

export default function install(moduleIdentifier: string, match: string, _options: InstallOptions, callback: InstallCallback) {
  const queue = new Queue();
  find(moduleIdentifier, match).forEach((found) => {
    queue.defer((cb) => {
      const { name, version, nodeModules } = found;
      const modulePath = path.join(nodeModules, name);

      fs.stat(modulePath, (err) => {
        if (!err) return cb();
        const installString = version ? `${name}@${version}` : name;
        console.log(`Installing: ${name}`);
        installModule(installString, nodeModules, cb);
      });
    });
  });
  queue.await(callback);
}
