var path = require('path');

const copy = require('./bin/copy-pluginsV2');
const config = require('./bin/create-config');

var envValues = require('./bin/common/env-values');
console.log(envValues);

const pathConfig = path.join(__dirname, 'config.production.json');
console.log('path config', pathConfig)

const fs = require('fs')
fs.readFile(pathConfig, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

const ghost = require("ghost");
