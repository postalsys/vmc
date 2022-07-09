'use strict';

function formatCertError(cert, message, code) {
    let error = new Error(message);
    error.details = {
        subject: cert.subject,
        fingerprint: cert.fingerprint,
        fingerprint235: cert.fingerprint256,
        validFrom: cert.validFrom,
        validTo: cert.validTo
    };
    error.code = code;
    return error;
}

function assertCertTime(now, cert) {
    const validFrom = new Date(cert.validFrom);
    const validTo = new Date(cert.validTo);
    if (now < validFrom || now > validTo) {
        throw formatCertError(cert, 'The certificate has expired or is not yet valid', 'CERTIFICATE_VERIFICATION_ERROR');
    }
}

function assertCaCert(cert) {
    if (!cert.ca) {
        throw formatCertError(cert, 'Signing certificate is not a certificate authority', 'CERTIFICATE_VERIFICATION_ERROR');
    }
}

function validatedChain(certs, rootStore, now) {
    if (!certs || !certs.length) {
        return false;
    }

    now = now || new Date();

    assertCertTime(now, certs[0].cert);

    for (let i = 1; i < certs.length; i++) {
        if (!certs[i - 1].cert.checkIssued(certs[i].cert)) {
            return false;
        }
        assertCertTime(now, certs[i].cert);
    }

    let chainRoot = certs[certs.length - 1];

    for (let rootCert of rootStore.rootCerts) {
        if (rootCert.fingerprint512 === chainRoot.cert.fingerprint512) {
            assertCaCert(rootCert);
            return certs;
        }

        if (chainRoot.cert.checkIssued(rootCert)) {
            assertCertTime(now, rootCert);
            assertCaCert(rootCert);
            certs.push(rootCert);
            return certs;
        }
    }

    throw formatCertError(certs[0].cert, 'Self signed certificate in certificate chain', 'SELF_SIGNED_CERT_IN_CHAIN');
}

module.exports = { validatedChain };
