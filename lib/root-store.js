'use strict';

const { X509Certificate } = require('crypto');
const rootCertPems = require('../data/root-store.json');

function parseRootCert(pem) {
    try {
        return new X509Certificate(pem);
    } catch (err) {
        console.error('Failed to parse root cert');
        console.error(err);
        console.error(pem);
        return null;
    }
}

class RootStore {
    static create(config = {}) {
        return new RootStore(config);
    }

    constructor(config) {
        this.config = config;
        this.rootCerts = rootCertPems.map(parseRootCert).filter(Boolean);
    }

    addCert(pem) {
        const cert = new X509Certificate(pem);
        const isDuplicate = this.rootCerts.some(rootCert => rootCert.fingerprint256 === cert.fingerprint256);

        if (isDuplicate) {
            return false;
        }

        this.rootCerts.push(cert);
        return true;
    }
}

module.exports = { RootStore };
