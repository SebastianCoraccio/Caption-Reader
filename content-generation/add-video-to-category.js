const fs = require('fs');
const {processVtt} = require('./process-vtt');
const {exec} = require('child_process');
const {uploadToS3, downloadFromS3} = require('./s3');

function readFileData(fileName) {
  try {
    const data = fs.readFileSync(fileName, 'base64');
    return Buffer.from(data, 'base64').toString('utf-8');
  } catch {
    return '[]';
  }
}

function downloadYoutubeData(fileMeta, directory) {
  return new Promise((resolve, reject) =>
    exec(
      `youtube-dl ${fileMeta.youtubeId} --write-thumbnail -f 'best[height<=480]' --write-sub --sub-lang ja -o '${directory}/${fileMeta.title}.%(ext)s' --user-agent curl/7.54.0`,
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

async function processFiles(directory) {
  const files = JSON.parse(readFileData(`./${directory}/.files.json`));
  const manifest = await downloadFromS3({file: `${directory}/.manifest.json`});
  console.log(manifest);
  throw new Error();
  for (const [index, file] of files.entries()) {
    if (manifest.findIndex(m => m.title === file.title) !== -1) {
      console.log('Skipping', file.title);
      continue;
    }
    const prefix = `(${index}/${files.length})`;
    console.log(`${prefix} Starting download of ${file.title}`);
    await downloadYoutubeData(file, directory);
    const vtt = readFileData(`${directory}/${file.title}.ja.vtt`);

    const fileCaptionData = {
      captions: processVtt(vtt, file.furigana, file.noFurigana),
    };
    fs.writeFileSync(
      `${directory}/${file.title}.json`,
      JSON.stringify(fileCaptionData, null, 2),
      'utf8',
      function (err) {
        if (err) {
          return console.log(err);
        }
      },
    );
    await uploadToS3({
      file: `${directory}/${file.title}.json`,
    });
    await uploadToS3({
      file: `${directory}/${file.title}.mp4`,
    });
    await uploadToS3({
      file: `${directory}/${file.title}.jpg`,
    });

    manifest.push({
      title: file.title,
      type: 'video',
    });

    fs.writeFileSync(
      `${directory}/.manifest.json`,
      JSON.stringify(manifest, null, 2),
      'utf8',
      function (err) {
        if (err) {
          return console.log(err);
        }
      },
    );
    await uploadToS3({file: `${directory}/.manifest.json`});
    console.log(`${prefix} ${file.title} completed`);
  }
}
