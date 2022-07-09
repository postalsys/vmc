/* eslint no-unused-expressions:0 */
'use strict';

const fs = require('fs');
const chai = require('chai');
const expect = chai.expect;
const Path = require('path');

const { vmc } = require('../lib/vmc');

chai.config.includeStack = true;

// Use fixed time for validation checks
const CUR_DATE_FIXED = '2022-07-09T08:30:14.715Z';

const fixtures = {
    cnn: fs.readFileSync(Path.join(__dirname, 'fixtures', 'cnn.pem')),
    postal: fs.readFileSync(Path.join(__dirname, 'fixtures', 'postal_vmc.pem')),
    catchall: fs.readFileSync(Path.join(__dirname, 'fixtures', 'catchall.delivery.pem'))
};

describe('Logo Validation Tests', () => {
    it('Should validate logo', async () => {
        let logo = await vmc(fixtures.cnn, { now: new Date(CUR_DATE_FIXED) });
        expect(logo).to.exist;
        expect(logo.hashValue).to.equal('ea8c81da633c66a16262134a78576cdf067638e9');
        expect(logo.certificate.subjectAltName).to.deep.equal(['cnn.com']);

        expect(logo.certificate.subject.trademarkRegistration).to.equal('5817930');
        expect(logo.certificate.fingerprint).to.equal('17:B3:94:97:E6:6B:C8:6B:33:B8:0A:D2:F0:79:6B:08:A2:A6:84:BD');
    });
});
