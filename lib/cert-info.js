'use strict';

const { getDateString } = require('./tools');

const oids = {
    '1.3.6.1.4.1.53087.1.5': 'legalEntityIdentifier',
    '1.3.6.1.4.1.53087.1.3': 'trademarkCountryOrRegionName',
    '1.3.6.1.4.1.53087.1.2': 'trademarkOfficeName',
    '1.3.6.1.4.1.53087.1.4': 'trademarkRegistration',
    '1.3.6.1.4.1.53087.1.6': 'wordMark',
    CN: 'commonName',
    O: 'organizationName',
    OU: 'organizationalUnitName',
    L: 'localityName',
    ST: 'stateOrProvinceName',
    S: 'stateOrProvinceName',
    C: 'countryName',
    jurisdictionC: 'jurisdictionCountryName',
    jurisdictionST: 'jurisdictionStateOrProvinceName',
    jurisdictionL: 'jurisdictionLocalityName'
};

function parseSubject(subject) {
    return Object.fromEntries(
        (subject || '')
            .split(/\r?\n/)
            .map(line => {
                let separatorPos = line.indexOf('=');
                if (separatorPos < 0) {
                    return false;
                }
                let key = line.substring(0, separatorPos);
                key = oids[key] || key;
                let value = line.substring(separatorPos + 1);

                value = value.replace(/\\,/g, ',');
                if (value.charAt(0) === '"') {
                    try {
                        value = JSON.parse(value);
                    } catch (err) {
                        // ignore
                    }
                }
                return [key, value];
            })
            .filter(entry => entry)
    );
}

function certInfo(cert) {
    let subject = parseSubject(cert.subject);

    let subjectAltName = (cert.subjectAltName || '')
        .split(/^DNS:|,\s*DNS:/g)
        .map(subject => subject.trim())
        .filter(subject => subject);

    return {
        subjectAltName,
        subject,
        fingerprint: cert.fingerprint,
        serialNumber: cert.serialNumber,
        validFrom: getDateString(cert.validFrom),
        validTo: getDateString(cert.validTo),
        issuer: parseSubject(cert.issuer)
    };
}

module.exports = { certInfo };
