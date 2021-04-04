var path = require('path');

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
// var express = require("express");
// var urlService = require("./node_modules/ghost/core/frontend/services/url");
// var parentApp = express();

// // Run a single Ghost process
// ghost()
//   .then(function(ghostServer) {
//     // for making subdir work
//     parentApp.use(urlService.utils.getSubdir(), ghostServer.rootApp);
//     ghostServer.start(parentApp);
//   })
//   .catch(error => {
//     console.error(`Ghost server error: ${error.message} ${error.stack}`);
//     process.exit(1);
//   });