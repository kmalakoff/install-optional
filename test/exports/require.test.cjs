const assert = require('assert');
const { install, installSync, removeSync } = require('install-optional');

describe('exports .cjs', () => {
  it('defaults', () => {
    assert.equal(typeof install, 'function');
    assert.equal(typeof installSync, 'function');
    assert.equal(typeof removeSync, 'function');
  });
});
