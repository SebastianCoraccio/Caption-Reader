const fs = require('fs');
const {processVtt} = require('./process-vtt');
const {exec} = require('child_process');
const {uploadToS3} = require('./upload-to-s3');

function readFileData(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'base64');
    return Buffer.from(data, 'base64').toString('utf-8');
  } catch {
    return '[]';
  }
}

function downloadYoutubeData(fileMeta, bucket) {
  return new Promise((resolve, reject) =>
    exec(
      `youtube-dl ${fileMeta.youtubeId} --write-thumbnail -f 'best[height<=480]' --write-sub --sub-lang ja -o '${bucket}/${fileMeta.title}.%(ext)s' --user-agent curl/7.54.0`,
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

async function processFiles(bucket) {
  const files = JSON.parse(readFileData(`./${bucket}/.files.json`));
  const manifest = JSON.parse(readFileData(`./${bucket}/.manifest.json`));

  for (const [index, file] of files.entries()) {
    if (manifest.findIndex(m => m.title === file.title) !== -1) {
      console.log('Skipping', file.title);
      continue;
    }
    const prefix = `(${index}/${files.length})`;
    console.log(`${prefix} Starting download of ${file.title}`);
    await downloadYoutubeData(file, bucket);
    const vtt = readFileData(`${bucket}/${file.title}.ja.vtt`);

    const fileCaptionData = {
      captions: processVtt(vtt, file.furigana, file.noFurigana),
    };
    fs.writeFileSync(
      `${bucket}/${file.title}.json`,
      JSON.stringify(fileCaptionData, null, 2),
      'utf8',
      function (err) {
        if (err) {
          return console.log(err);
        }
      },
    );
    await uploadToS3({file: `${bucket}/${file.title}.json`, bucket});
    await uploadToS3({file: `${bucket}/${file.title}.mp4`, bucket});
    await uploadToS3({file: `${bucket}/${file.title}.jpg`, bucket});

    manifest.push({
      title: file.title,
      type: 'video',
    });

    fs.writeFileSync(
      `${bucket}/.manifest.json`,
      JSON.stringify(manifest, null, 2),
      'utf8',
      function (err) {
        if (err) {
          return console.log(err);
        }
      },
    );
    await uploadToS3({file: `${bucket}/.manifest.json`, bucket});
    console.log(`${prefix} ${file.title} completed`);
  }
}

const bucket = process.argv[2];
if (!bucket) {
  console.error('Usage: node process-files.js [bucket name]');
  return;
}
processFiles(bucket);
