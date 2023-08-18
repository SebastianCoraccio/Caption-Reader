const {spawn} = require('child_process');
const {uploadToS3, downloadFromS3, uploadDataToS3} = require('./s3');

function execCommand(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    stdin: 'inherit',
    shell: true,
  });
  return new Promise(resolve => {
    child.on('close', resolve);
  });
}

function downloadYoutubeData({youtubeId, title}) {
  return execCommand('yt-dlp', [
    '--write-thumbnail',
    '--convert-thumbnails jpg',
    "-f 'best[height<=480]'",
    '--write-sub',
    '--sub-lang ja',
    `-o '${title}.%(ext)s'`,
    youtubeId,
  ]);
}

function processVttFile(videoId) {
  return execCommand('arch', [
    '-x86_64',
    'python3',
    'content-generation/process-vtt.py',
    videoId,
  ]);
}

async function processYouTubeVideo({directory, youtubeId, title}) {
  let fileManifest = [];
  try {
    fileManifest = await downloadFromS3({file: `${directory}/.manifest.json`});
  } catch (err) {
    if (err.code !== 'NoSuchKey') {
      throw err;
    }
  }

  console.log(`Starting download of ${title}`);
  await downloadYoutubeData({youtubeId, title});

  console.log('Processing vtt...');
  await processVttFile(title);
  console.log('Processing vtt complete.');

  await uploadToS3({
    file: `${title}.json`,
    key: `${directory}${title}.json`,
  });

  await uploadToS3({
    file: `${title}.mp4`,
    key: `${directory}${title}.mp4`,
  });
  await uploadToS3({
    file: `${title}.jpg`,
    key: `${directory}${title}.jpg`,
  });

  if (fileManifest.find(f => f.title === title)) {
    console.log(`${title} already exists, manifest will not be updated`);
    return;
  }

  fileManifest.push({
    title: title,
    type: 'video',
  });
  await uploadDataToS3({
    key: `${directory}.manifest.json`,
    data: fileManifest,
  });
}

module.exports = {processYouTubeVideo};
