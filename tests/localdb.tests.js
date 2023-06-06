/* eslint-disable no-undefined */
'use strict';

const path = require('path');
const { LocalDB } = require('..');
const { _remove } = require('@axiosleo/cli-tool/src/helper/fs');
const chai = require('chai');
const expect = chai.expect;

describe('tests case', function () {
  before(async () => {
    await _remove(path.join(__dirname, '../runtime/test'), true);
  });

  it('CURD', async () => {
    const db = new LocalDB(path.join(__dirname, '../runtime/test'));
    let res = await db.table('test-items').upsert('uniq-id-1', { a: 'a' });
    expect(res).to.be.true;

    try {
      res = await db.table('test-items').insert('uniq-id-1', { a: 'a' });
      // not to be here
      expect(false).to.be.true;
    } catch (err) {
      expect(err.message).to.be.equal('uniqid exists');
    }

    res = await db.table('test-items').select();
    expect(res).to.be.deep.equal([{ '_id': 'uniq-id-1', 'a': 'a' }]);

    res = await db.table('test-items').upsert('uniq-id-1', { a: 'a' });
    expect(res).to.be.true;

    res = await db.table('test-items').update('uniq-id-1', { a: 'a', b: 'b' });
    expect(res).to.be.true;

    res = await db.table('test-items').find('uniq-id-1');
    expect(res).to.be.deep.equal({ _id: 'uniq-id-1', a: 'a', b: 'b' });

    res = await db.table('test-items').delete('uniq-id-1');
    expect(res).to.be.true;

    res = await db.table('test-items').delete('uniq-id-1');
    expect(res).to.be.false;

    res = await db.table('test-items').update('uniq-id-1', { a: 'a', b: 'b' });
    expect(res).to.be.false;

    res = await db.table('test-items').find('uniq-id-1');
    expect(res).to.be.undefined;

    res = await db.table('test-items').exist('uniq-id-1');
    expect(res).to.be.false;
  });

  it('get tables', async () => {
    const db = new LocalDB(path.join(__dirname, '../runtime/test'));
    let res = await db.tables();
    expect(res).to.be.deep.equal(['test-items']);
  });

  it('count rows', async () => {
    const db = new LocalDB(path.join(__dirname, '../runtime/test2'));
    await db.table('test-items').upsertMany([
      { _id: 'uniq-id-1', a: 'a' },
      { _id: 'uniq-id-2', a: 'a' },
      { _id: 'uniq-id-3', a: 'a' },
      { failed: 'failed because without _id' }
    ]);
    let res = await db.table('test-items').count();
    expect(res).to.be.equal(3);

    res = await db.table('test-items').select(1, 1);
    expect(res.length).to.be.equal(1);
    expect(res[0]._id).to.be.equal('uniq-id-2');
  });
});
