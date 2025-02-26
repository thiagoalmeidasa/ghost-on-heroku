#!/usr/bin/env node
// Ghost Configuration for Heroku

var fs = require('fs');
var path = require('path');
var url = require('url');

var envValues = require('./common/env-values');
var appRoot = path.join(__dirname, '..');

console.log('starting create-config.js', appRoot)

function createConfig() {
  var fileStorage, storage;

  if (!!process.env.S3_ACCESS_KEY_ID) {
    fileStorage = true
    storage = {
      active: 's3',
      's3': {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
        bucket: process.env.S3_BUCKET_NAME,
        region: process.env.S3_BUCKET_REGION,
        assetHost: process.env.S3_ASSET_HOST_URL
      }
    }
  } else if (!!process.env.WEBDAV_SERVER_URL) {
    fileStorage = true
    storage = {
      'active': 'webdav',
      // no need to set configs; they're set directly from
      // the environment variables.
    }
  } else if (!!process.env.BUCKETEER_AWS_ACCESS_KEY_ID) {
    fileStorage = true
    storage = {
      active: 's3',
      's3': {
        accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
        bucket: process.env.BUCKETEER_BUCKET_NAME,
        region: process.env.S3_BUCKET_REGION,
        assetHost: process.env.S3_ASSET_HOST_URL
      }
    }
  } else if (!!process.env.CLOUDINARY_URL) {
    fileStorage = true
    storage = {
      active: 'ghost-storage-cloudinary',
      'ghost-storage-cloudinary': {
        useDatedFolder: false,
        upload: {
          use_filename: true,
          unique_filename: false,
          overwrite: false,
          folder: "ghost-blog-images",
          tags: ["blog"]
        },
        fetch: {
          quality: "auto",
          secure: true,
          cdn_subdomain: true
        }
      }
    }
  } else {
    fileStorage = false
    storage = {}
  }

  config = {
    url: process.env.APP_PUBLIC_URL,
    logging: {
      level: "info",
      transports: ["stdout"]
    },
    mail: {},
    fileStorage: fileStorage,
    storage: storage,
    database: {
      client: 'mysql',
      connection: getMysqlConfig(envValues.mysqlDatabaseUrl),
      pool: { min: 0, max: 10 },
      debug: false
    },
    server: {
      host: '0.0.0.0',
      port: process.env.PORT
    },
    paths: {
      contentPath: path.join(appRoot, '/content/')
    }
  };
  return Object.assign({}, config, getEmailConfig());
  //return config;
}

function getEmailConfig() {
  if (process.env.SENDGRID_LOGIN) {
    return {
      mail: {
        transport: 'SMTP',
        options: {
          service: 'SendGrid',
          auth: {
            user: process.env.SENDGRID_LOGIN,
            pass: process.env.SENDGRID_PASSWORD
          }
        }
      }
    }
  }
  else if (process.env.MAILGUN_SMTP_LOGIN) {
    return {
      transport: 'SMTP',
      options: {
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_SMTP_LOGIN,
          pass: process.env.MAILGUN_SMTP_PASSWORD
        }
      }
    }
  }
  return {
    transport: 'SMTP',
    options: {
      service: '',
      auth: {
        user: '',
        pass: ''
      }
    }
  }
}

function getMysqlConfig(connectionUrl) {
  if (connectionUrl == null) {
    return {};
  }

  var dbConfig = url.parse(connectionUrl);
  if (dbConfig == null) {
    return {};
  }

  var dbAuth = dbConfig.auth ? dbConfig.auth.split(':') : [];
  var dbUser = dbAuth[0];
  var dbPassword = dbAuth[1];

  if (dbConfig.pathname == null) {
    var dbName = 'ghost';
  } else {
    var dbName = dbConfig.pathname.split('/')[1];
  }

  var dbConnection = {
    host: dbConfig.hostname,
    port: dbConfig.port || '3306',
    user: dbUser,
    password: dbPassword,
    database: dbName
  };
  return dbConnection;
}

var configContents = JSON.stringify(createConfig(), null, 2);

console.log('content of config', configContents)
console.log('path of config', path.join(appRoot, 'config.production.json'))

fs.writeFileSync(path.join(appRoot, 'config.production.json'), configContents);

//return configContents;