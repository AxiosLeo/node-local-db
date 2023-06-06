'use strict';

const { _is_dir } = require('@axiosleo/cli-tool/src/helper/fs');
const path = require('path');
const fs = require('fs');
const promisify = require('util').promisify;
const readdir = promisify(fs.readdir);

/**
 * @param {string} dir 
 * @param {string} find dir|file
 * @param {number} offset
 * @param {number} limit
 */
const _listDirOrFile = async (dir, find = 'dir', offset = 0, limit = -1) => {
  if (!await _is_dir(dir)) {
    throw new Error('Only support dir path');
  }
  let tmp = await readdir(dir);
  let files = [];
  let step = 0;
  let count = 0;
  await Promise.all(tmp.map(async (filename) => {
    if (step < offset) {
      step++;
      return;
    }
    step++;
    if (limit !== -1 && count >= limit) {
      return;
    }
    count++;
    if (find === 'file') {
      const fileext = path.extname(filename);
      if (!fileext.endsWith('.json')) {
        return;
      }
      files.push(filename.substring(0, filename.length - 5));
    } else if (find === 'dir' && await _is_dir(path.join(dir, filename))) {
      if (filename[0] === '.') {
        return;
      }
      files.push(filename);
    }
  }));
  tmp = null;
  return files;
};

const _filepath = (config) => {
  const { root, datapath, uniq } = config;
  return path.join(root, datapath, `${uniq}.json`);
};

module.exports = {
  _filepath,
  _listDirOrFile
};
