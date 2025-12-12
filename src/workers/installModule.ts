import installModule from 'install-module-linked';
import Module from 'module';
import { spawnOptions } from 'node-version-utils';
import path from 'path';
import url from 'url';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE || '');
const major = +process.versions.node.split('.')[0];

type WorkerCallback = (err: Error | null, result?: unknown) => void;

// Worker MUST always load from dist/cjs/ for old Node compatibility
const workerPath = path.join(__dirname, '..', '..', 'cjs', 'workers', 'installModule.js');

let execPath: string | null = null;
let functionExec = null; // break dependencies
export default function worker(installString: string, nodeModules: string, callback: WorkerCallback): void {
  if (major > 10) {
    installModule(installString, nodeModules, callback);
    return;
  }

  if (!execPath) {
    const satisfiesSemverSync = _require('node-exec-path').satisfiesSemverSync;
    execPath = satisfiesSemverSync('>10'); // must be more than node 10
    if (!execPath) {
      callback(new Error('install-module-linked a version of node >10 to use npm install'));
      return;
    }
  }

  try {
    if (!functionExec) functionExec = _require('function-exec-sync');
    const installPath = isWindows ? path.join(execPath, '..') : path.join(execPath, '..', '..');
    const options = spawnOptions(installPath, { execPath, callbacks: true } as Parameters<typeof spawnOptions>[1]);
    const res = functionExec(options, workerPath, installString, nodeModules);
    callback(null, res);
  } catch (err) {
    callback(err as Error);
  }
}
