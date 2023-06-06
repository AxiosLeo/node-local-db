'use strict';

const path = require('path');
const QueryTable = require('./query');
const { _listDirOrFile } = require('./lib');

class LocalDB {
  constructor(root) {
    this.root = path.resolve(root);
  }

  table(table_name) {
    return new QueryTable(this.root, table_name);
  }

  async tables(prefix = '') {
    const dirpath = path.join(this.root, prefix);
    const rows = await _listDirOrFile(dirpath, 'dir');
    return rows;
  }
}

module.exports = LocalDB;
