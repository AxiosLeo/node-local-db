'use strict';

const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const { _listDirOrFile } = require('../src/lib');

describe('lib methods test case', () => {
  it('_listDirOrFile: input file path not dir path', async () => {
    try {
      await _listDirOrFile(path.join(__dirname, '../index.js'));
      // not to be here
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).to.be.equal('Only support dir path');
    }
  });

  it('_listDirOrFile: find files', async () => {
    let rows = await _listDirOrFile(path.join(__dirname, '../'));
    expect(rows.includes('src')).to.be.true;

    rows = await _listDirOrFile(path.join(__dirname, '../'), 'file');
    expect(rows.includes('index.js')).to.be.false;
  });
});
