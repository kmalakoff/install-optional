import assert from 'assert';

// @ts-ignore
import { install, installSync, removeSync } from 'install-optional';

describe('exports .ts', () => {
  it('defaults', () => {
    assert.equal(typeof install, 'function');
    assert.equal(typeof installSync, 'function');
    assert.equal(typeof removeSync, 'function');
  });
});
