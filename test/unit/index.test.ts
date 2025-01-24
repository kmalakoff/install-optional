import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import { install as npmInstall } from 'install-module-linked';
import mkdirp from 'mkdirp-classic';
import Pinkie from 'pinkie-promise';
import rimraf2 from 'rimraf2';

// @ts-ignore
import { install, installSync, removeSync } from 'install-optional';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const TMP_DIR = path.join(__dirname, '..', '..', '.tmp');
const cwd = process.cwd();

function installModule(name, dest, callback) {
  mkdirp.sync(dest);
  fs.writeFileSync(path.join(dest, 'package.json'), '{}', 'utf8');
  npmInstall(name, dest, callback);
}

describe('install-optional', () => {
  // beforeEach(rimraf2.bind(null, TMP_DIR, { disableGlob: true }));
  afterEach(() => process.chdir(cwd));
  // after(rimraf2.bind(null, TMP_DIR, { disableGlob: true }));

  describe('install sync', () => {
    it('installs rollup for this platform', (done) => {
      installModule('rollup', TMP_DIR, () => {
        process.chdir(TMP_DIR);
        const modulePath = path.join(TMP_DIR, 'node_modules', 'rollup');
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length > 0);
        removeSync('rollup', `${process.platform}-`, { cwd: TMP_DIR });
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length === 0);
        installSync('rollup', `${process.platform}-`, { cwd: TMP_DIR });
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length > 0);
        done();
      });
    });
  });

  describe('install callback', () => {
    it('installs rollup for this platform', (done) => {
      installModule('rollup', TMP_DIR, () => {
        process.chdir(TMP_DIR);
        const modulePath = path.join(TMP_DIR, 'node_modules', 'rollup');
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length > 0);
        removeSync('rollup', `${process.platform}-`, { cwd: TMP_DIR });
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length === 0);
        install('rollup', `${process.platform}-`, { cwd: TMP_DIR }, (err) => {
          if (err) return done(err.message);
          assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length > 0);
          done();
        });
      });
    });
  });

  describe('install promise', () => {
    (() => {
      // patch and restore promise
      // @ts-ignore
      let rootPromise: Promise;
      before(() => {
        rootPromise = global.Promise;
        // @ts-ignore
        global.Promise = Pinkie;
      });
      after(() => {
        global.Promise = rootPromise;
      });
    })();

    it('installs rollup for this platform', (done) => {
      installModule('rollup', TMP_DIR, async () => {
        process.chdir(TMP_DIR);
        const modulePath = path.join(TMP_DIR, 'node_modules', 'rollup');
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length > 0);
        removeSync('rollup', `${process.platform}-`, { cwd: TMP_DIR });
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length === 0);
        await install('rollup', `${process.platform}-`, { cwd: TMP_DIR });
        assert.ok(fs.readdirSync(path.join(modulePath, '..', '@rollup')).length > 0);
        done();
      });
    });
  });
});
