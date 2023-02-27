'use strict';

const { _exists, _write, _remove, _is_dir, _read_json } = require('@axiosleo/cli-tool/src/helper/fs');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);

/**
 * 
 * @param {*} dir 
 * @param {*} find dir|file
 * @param {*} ext 
 */
const listDirOrFile = async (dir, find = 'dir') => {
  if (!await _is_dir(dir)) {
    throw new Error('Only support dir path');
  }
  const tmp = await readdir(dir);
  let files = [];
  await Promise.all(tmp.map(async (filename) => {
    if (find === 'file') {
      const fileext = path.extname(filename);
      if (!fileext.endsWith('.json')) {
        return;
      }
      files.push(filename);
    } else if (find === 'dir' && await _is_dir(path.join(dir, filename))) {
      if (filename[0] === '.') {
        return;
      }
      files.push(filename);
    }
  }));
  return files;
};

const _filepath = (config) => {
  const { root, datapath, uniq } = config;
  return path.join(root, datapath, `${uniq}.json`);
};

class QueryTable {
  constructor(root, datapath) {
    this.root = root;
    this.datapath = datapath;
  }

  async count() {
    const dirpath = path.join(this.root, this.datapath);
    const rows = await listDirOrFile(dirpath, 'file', '.json');
    return rows.length;
  }

  async find(uniq) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    if (await _exists(filepath)) {
      return await _read_json(filepath);
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

  async insert(uniq, data) {
    const filepath = _filepath({ root: this.root, datapath: this.datapath, uniq });
    if (await _exists(filepath)) {
      throw new Error('duplicate key');
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
    let rows = await listDirOrFile(dirpath, 'file', '.json');
    if (limit !== -1) {
      rows = rows.slice(offset, offset + limit);
    } else if (offset !== 0) {
      rows = rows.slice(offset);
    }
    return rows.map(r => r.substring(0, r.length - 5));
  }
}

class LocalDB {
  constructor(root) {
    this.root = path.resolve(root);
  }

  table(table_name) {
    return new QueryTable(this.root, table_name);
  }

  async tables(prefix = '') {
    const dirpath = path.join(this.root, prefix);
    const rows = await listDirOrFile(dirpath, 'dir');
    return rows;
  }
}

module.exports = {
  QueryTable,
  LocalDB
};
