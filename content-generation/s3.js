const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('../config');

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
};
