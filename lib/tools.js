/* eslint no-control-regex: 0 */
'use strict';

const { X509Certificate } = require('crypto');

function parsePemBundle(bundle) {
    bundle = (bundle || '').toString().split(/\r?\n/).join('\x00');
    let matches = bundle.match(/[-]{3,}BEGIN [^-]+[-]{3,}.*?[-]{3,}END [^-]+[-]{3,}/g);
    if (matches) {
        matches = Array.from(matches).map(cert => cert.replace(/\x00/g, '\n') + '\n');
    }
    return matches;
}

function getCerts(bundle) {
    let certs = parsePemBundle(bundle);
    if (!certs) {
        return false;
    }

    return certs.map(pem => ({
        pem,
        cert: new X509Certificate(pem)
    }));
}

function getDateString(date) {
    if (!date) {
        return null;
    }
    if (typeof date === 'string') {
        return date;
    }
    if (date && typeof date.toISOString === 'function') {
        return date.toISOString();
    }
    if (date && typeof date.toString === 'function') {
        return date.toString();
    }
    return null;
}

module.exports = { parsePemBundle, getCerts, getDateString };
