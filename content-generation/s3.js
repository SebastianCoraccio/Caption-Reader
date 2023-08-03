const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('../config');
const zlib = require('zlib');
const Readable = require('stream').Readable;

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

function uploadToS3({file}) {
  return new Promise((resolve, reject) => {
    console.log(`Uploading ${config.S3_BUCKET}/${file}`);
    const fileData = fs.readFileSync(file);
    s3.upload({
      Bucket: config.S3_BUCKET,
      Body: fileData,
      Key: file,
    })
      .promise()
      .then(result => {
        console.log(`Completed upload of ${file}`);
        resolve(result);
      })
      .catch(reject);
  });
}

function uploadDataToS3({key, data}) {
  return new Promise((resolve, reject) => {
    console.log(`Uploading data to ${config.S3_BUCKET}/${key}`);
    const body = new Readable();

    body.push(JSON.stringify(data));
    body.push(null);
    body.pipe(zlib.createGzip());

    s3.upload({
      Bucket: config.S3_BUCKET,
      Body: body,
      Key: key,
    })
      .promise()
      .then(result => {
        console.log(`Completed upload of ${key}`);
        resolve(result);
      })
      .catch(reject);
  });
}

function downloadFromS3({file}) {
  return new Promise((resolve, reject) => {
    s3.getObject({
      Bucket: config.S3_BUCKET,
      Key: file,
    })
      .promise()
      .then(result => {
        const jsonResult = JSON.parse(
          Buffer.from(result.Body, 'base64').toString('utf-8'),
        );
        resolve(jsonResult);
      })
      .catch(reject);
  });
}

module.exports = {
  uploadToS3,
  downloadFromS3,
  uploadDataToS3,
};
