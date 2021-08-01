'use strict';

const pkg = require('../package.json');
const log = require('@lh-fe/log');

module.exports = core;

function core() {
    // 检查cli版本号
    checkPackageVersion();
}

function checkPackageVersion() {
    log.notice('cli', pkg.version);
}
