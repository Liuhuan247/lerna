'use strict';

const semver = require('semver');
const colors = require('colors/safe')
const log = require('@lh-fe/log');
const userHome = require('user-home');
const pathExists = require('path-exists');

const pkg = require('../package.json');
const constant = require('./const');

let args;

module.exports = core;

function core() {
    try {
        // 检查cli版本号
        checkPackageVersion();
        // 检查node版本号
        checkNodeVersion()
        // 检查root账户
        checkRoot();
        // 检查用户主目录
        checkUserHome();

        // 检查入参，是否是debug模式等
        checkInputArgs()
        log.verbose('debug', 'test debug log');

    } catch (e) {
        log.error(e.message);
    }
}

function checkInputArgs() {
    const minimist = require('minimist');
    args = minimist(process.argv.slice(2));
    checkArgs()
}

function checkArgs() {
    if (args.debug) {
        process.env.LOG_LEVEL = "verbose";
    } else {
        process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) throw new Error(colors.red('当前登录用户主目录不存在！'))
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
