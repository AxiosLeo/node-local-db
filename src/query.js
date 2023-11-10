'use strict';

const {
  _write,
  _exists,
  _remove,
  _read_json
} = require('@axiosleo/cli-tool/src/helper/fs');
const { _foreach } = require('@axiosleo/cli-tool/src/helper/cmd');
const path = require('path');

const { _listDirOrFile, _filepath } = require('./lib');

class QueryTable {
  constructor(root, datapath) {
    this.root = root;
    this.datapath = datapath;
  }

  async count() {
    const dirpath = path.join(this.root, this.datapath);
    try {
      const rows = await _listDirOrFile(dirpath, 'file');
      return rows.length;
    } catch (err) {
      return 0;
    }
  }

  async find(uniq) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    if (await _exists(filepath)) {
      const row = await _read_json(filepath);
      row._id = uniq;
      return row;
    }
    return undefined;
  }

  async exist(uniq) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    return await _exists(filepath);
  }

  async upsert(uniq, data) {
    if (await this.exist(uniq)) {
      return await this.update(uniq, data);
    }
    return await this.insert(uniq, data);
  }

  async upsertMany(rows, auto_roll_back = false) {
    let failed = [];
    let result = [];
    try {
      await _foreach(rows, async (row) => {
        let flag = false;
        if (row._id) {
          flag = await this.upsert(row._id, row);
        }
        if (flag === false) {
          if (auto_roll_back) {
            throw new Error('upsertMany failed');
          } else {
            failed.push(row);
          }
        } else {
          result.push(row);
        }
      });
    } catch (err) {
      // roll back
      if (auto_roll_back) {
        await _foreach(result, async (row) => {
          await this.delete(row._id);
        });
      }
    }

    return failed;
  }

  async insert(uniq, data) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    if (await _exists(filepath)) {
      throw new Error('uniqid exists');
    }
    await _write(filepath, JSON.stringify(data, null, 2));
    return true;
  }

  async update(uniq, data) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    if (!await _exists(filepath)) {
      return false;
    }
    await _write(filepath, JSON.stringify(data, null, 2));
    return true;
  }

  async delete(uniq) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    if (!await _exists(filepath)) {
      return false;
    }
    await _remove(filepath);
    return true;
  }

  async select(offset = 0, limit = -1) {
    const dirpath = path.join(this.root, this.datapath);
    const uniqids = await _listDirOrFile(dirpath, 'file', offset, limit);
    const rows = [];
    await _foreach(uniqids, async (uniqid) => {
      const row = await this.find(uniqid);
      if (row) {
        row._id = uniqid;
        rows.push(row);
      }
    });
    return rows;
  }
}

module.exports = QueryTable;
