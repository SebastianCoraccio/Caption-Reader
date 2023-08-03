const fs = require('fs');
const {processVtt} = require('./process-vtt');
const {exec} = require('child_process');
const {uploadToS3, downloadFromS3, uploadDataToS3} = require('./s3');

function readFileData(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'base64');
    return Buffer.from(data, 'base64').toString('utf-8');
  } catch {
    return '[]';
  }
}

function downloadYoutubeData({youtubeId, title}) {
  return new Promise((resolve, reject) =>
    exec(
      `yt-dlp ${youtubeId} --write-thumbnail --convert-thumbnails jpg -f 'best[height<=480]' --write-sub --sub-lang ja -o '${title}.%(ext)s'`,
      (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          reject(stderr);
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        resolve(stdout);
      },
    ),
  );
}

async function processYouTubeVideo({directory, youtubeId, title}) {
  let fileManifest = [];
  try {
    await downloadFromS3({file: `${directory}/.manifest.json`});
  } catch (err) {
    if (err.code !== 'NoSuchKey') {
      throw err;
    }
  }

  console.log(`Starting download of ${title}`);
  await downloadYoutubeData({youtubeId, title});
  const vtt = readFileData(`${title}.ja.vtt`);
  const fileCaptionData = {
    captions: processVtt(vtt),
  };

  fs.writeFileSync(
    `${title}.json`,
    JSON.stringify(fileCaptionData, null, 2),
    'utf8',
    function (err) {
      if (err) {
        return console.log(err);
      }
    },
  );
  await uploadToS3({
    file: `${title}.json`,
    key: `${directory}/${title}.json`,
  });
  await uploadToS3({
    file: `${title}.mp4`,
    key: `${directory}/${title}.mp4`,
  });
  await uploadToS3({
    file: `${title}.jpg`,
    key: `${directory}/${title}.jpg`,
  });

  fileManifest.push({
    title: title,
    type: 'video',
  });

  // update manifest
  await uploadDataToS3({
    key: `${directory}/.manifest.json`,
    data: fileManifest,
  });

  //cleanup
}

module.exports = {processYouTubeVideo};
