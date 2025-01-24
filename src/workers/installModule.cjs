const path = require('path');
const installModule = require('install-module-linked');
const { spawnOptions } = require('node-version-utils');

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const major = +process.versions.node.split('.')[0];

let execPath = null;
module.exports = function worker(installString, nodeModules, callback) {
  if (major > 10) return installModule(installString, nodeModules, callback);

  if (!execPath) {
    const satisfiesSemverSync = require('node-exec-path').satisfiesSemverSync;
    execPath = satisfiesSemverSync('>10'); // must be more than node 0.12
    if (!execPath) return callback(new Error('install-module-linked a version of node >10 to use npm install'));
  }

  try {
    const installPath = isWindows ? path.join(execPath, '..') : path.join(execPath, '..', '..');
    const options = spawnOptions(installPath, { execPath, callbacks: true });
    const res = require('function-exec-sync')(options, __filename, installString, nodeModules);
    callback(null, res);
  } catch (err) {
    callback(err);
  }
};
