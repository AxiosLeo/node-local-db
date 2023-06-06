# node-local-db

[![NPM version](https://img.shields.io/npm/v/@axiosleo/localdb.svg?style=flat-square)](https://npmjs.org/package/@axiosleo/localdb)
[![npm download](https://img.shields.io/npm/dm/@axiosleo/localdb.svg?style=flat-square)](https://npmjs.org/package/@axiosleo/localdb)
[![License](https://img.shields.io/github/license/AxiosLeo/node-local-db?color=%234bc524)](LICENSE)

Data storage driver using Node.js and JSON files.

# Install

```bash
npm i @axiosleo/localdb
```

# Usage

```javascript
const { LocalDB } = require("@axiosleo/localdb");

const db = new LocalDB("<some-db-dir>");
```

## License

This project is open-sourced software licensed under the [MIT](LICENSE).
