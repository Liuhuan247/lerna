'use strict';

const axios = require('axios');
const semver = require('semver');
const urlJoin = require('url-join');

module.exports = {getNpmInfo, getNpmVersions, getNpmSemverVersions};

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

async function getNpmVersions(pkgName, registry) {
    const data = await getNpmInfo(pkgName, registry);
    if (data) {
        return Object.keys(data.versions)
    }
    return []
}


function getSemverVersions(baseVersion, versions) {
    return versions.filter(version => semver.satisfies(version, `^${baseVersion}`)).sort((a, b) => semver.gt(b, a));
}

async function getNpmSemverVersions(baseVersions, pkgName, registry) {
    const versions = await getNpmVersions(pkgName, registry);
    const newVersions = getSemverVersions(baseVersions, versions);
    if (newVersions && newVersions.length > 0) {
        return newVersions[0];
    }
    return null;
}
