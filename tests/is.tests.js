/* eslint-disable no-undefined */
'use strict';

const path = require('path');
const { LocalDB } = require('..');

// const expect = require('chai').expect;

describe('CURD test case', function () {
  it('create', async () => {
    const db = new LocalDB(path.join(__dirname, '../runtime/test'));
    await db.table('test-items').upsert('uniq-id', { a: 'a' });
  });
});
