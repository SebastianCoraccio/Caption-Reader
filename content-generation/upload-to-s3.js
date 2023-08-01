const fs = require('fs');
const AWS = require('aws-sdk');
const config = require('../config');

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
});

// TODO when I update how files are stored I need to make the use of
// 'bucket' more consistent and understandable
function uploadToS3({file, bucket}) {
  return new Promise((resolve, reject) => {
    console.log(`Uploading ${config.S3_BUCKET}/${bucket}/${file}`);
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

module.exports = {
  uploadToS3,
};
