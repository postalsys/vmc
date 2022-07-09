'use strict';

const fs = require('fs');
const pem = fs.readFileSync(__dirname + '/../test/fixtures/cnn.pem');
const { vmc } = require('..');

vmc(pem).then(logo => console.log(logo));
