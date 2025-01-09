import assert from 'assert';
import { install, installSync, removeSync } from 'install-optional';

describe('exports .mjs', () => {
  it('defaults', () => {
    assert.equal(typeof install, 'function');
    assert.equal(typeof installSync, 'function');
    assert.equal(typeof removeSync, 'function');
  });
});
