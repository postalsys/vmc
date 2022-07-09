'use strict';

const { RootStore } = require('./root-store');
const { getCerts } = require('./tools');
const { validatedChain } = require('./validated-chain');
const { parseVMC } = require('./parse-vmc');
const { certInfo } = require('./cert-info');

const defaultRootStore = RootStore.create();

const vmc = async (pem, options) => {
    options = options || {};

    let rootStore = options.rootStore || defaultRootStore;
    let now = options.now;

    const vmcCerts = getCerts(pem);

    const chain = validatedChain(vmcCerts, rootStore, now);

    const logo = await parseVMC(chain[0].cert.raw);
    logo.certificate = certInfo(chain[0].cert);

    logo.hashValue = logo.hashValue && logo.hashValue.toString('hex');
    logo.logoFile = logo.logoFile && logo.logoFile.toString('base64');

    return logo;
};

module.exports = { vmc, RootStore };
