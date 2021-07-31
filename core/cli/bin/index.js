#!/usr/bin/env node

const importLocal = require('import-local');

// console.log(importLocal(__filename))

if (importLocal(__filename)) {
    require('npmlog').info('cli', '正在使用脚手架本地版本');
} else {
    require('../lib/core')(process.argv.slice(2));
}
