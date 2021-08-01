'use strict';

const semver = require('semver');
const colors = require('colors/safe')
const log = require('@lh-fe/log');

const pkg = require('../package.json');
const constant = require('./const');

module.exports = core;

function core() {
    try {
        // 检查cli版本号
        checkPackageVersion();
        // 检查node版本号
        checkNodeVersion()
    //    检查root账户
        checkRoot();

    } catch (e) {
        log.error(e.message);
    }
}

function checkRoot() {
    // sudo root类型检查，如果是root默认会降级成普通用户去处理
    const rootCheck = require('root-check');
    rootCheck()
    console.log(process.geteuid())
}

function checkNodeVersion() {
    // 获取当前node版本号
    const currentNodeVersion = process.version
    // 获取最低支持的版本号
    const lowestNodeVersion = constant.LOWEST_NODE_VERSION;
    if (!semver.gte(currentNodeVersion, lowestNodeVersion)) {
        throw new Error(colors.red(`脚手架需要安装${lowestNodeVersion}以上的版本`))
    }
}

function checkPackageVersion() {
    log.notice('cli', pkg.version);
}
