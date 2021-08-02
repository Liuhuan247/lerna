'use strict';

const semver = require('semver');
const colors = require('colors/safe')
const log = require('@lh-fe/log');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const path = require('path');

const pkg = require('../package.json');
const constant = require('./const');

let args, config;

module.exports = core;

async function core() {
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
        // 检查环境变量
        checkEnv();

        await checkGlobalUpdate();

    } catch (e) {
        log.error(e.message);
    }
}

async function checkGlobalUpdate() {
   // 1. 获取当前版本号
    const currentVersion = pkg.version;
    const pkgName = pkg.name;
   // 2. 调用npm api获取所有版本号
    const {getNpmSemverVersions} = require('@lh-fe/get-npm-info');
    const lastVersion = await getNpmSemverVersions(currentVersion, pkgName);
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn(colors.yellow(`请手动更新${pkgName}, 当前版本为${currentVersion}，最新版本为${lastVersion}, 更新命令为npm install -g ${pkgName}`))
    }
}


function checkEnv() {
    const dotEnv =require('dotenv');
    const paths = path.resolve(userHome, '.env')
    if (pathExists(paths)) {

        config = dotEnv.config({
            path: paths
        });
    }
    createDefaultCliConfig();
    log.verbose('环境变量', process.env.CLI_HOME_PATH);
}

function createDefaultCliConfig() {
    const cliConfig = {
        home: userHome
    }
    if (process.env.CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    }
    process.env.CLI_HOME_PATH = cliConfig.cliHome;
    return cliConfig;
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
    console.log(process.env.LOG_LEVEL);
    log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) throw new Error(colors.red('当前登录用户主目录不存在！'))
}

function checkRoot() {
    // sudo root类型检查，如果是root默认会降级成普通用户去处理
    const rootCheck = require('root-check');
    rootCheck()
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
