'use strict';

const axios = require('axios');
const semver = require('semver');
const urlJoin = require('url-join');

module.exports = {getNpmInfo};

function getNpmInfo(pkgName, registry) {
    if (!pkgName) return null;
    const registryUrl = registry || getDefaultRegistry()
    const npmInfo = urlJoin(registryUrl, pkgName);

    return axios.get(npmInfo).then(res => {
        if (res.status === 200) {
            return res.data
        }
        return null
    }).catch(err => {
        return Promise.reject(err);
    })
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? "https://registry.npm.org" : "https://registry.npm.taobao.org"
}
