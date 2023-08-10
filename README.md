# Caption Reader

This React Native project features a video player and an auto scrolling caption viewer that also display their English translations. This project was created to advance both my learning Japanese and my technical knowledge. This README serves to introduce and showcase the apps' functionality. This work is private and is not something I plan to release or develop for anyone else to contribute to or utilize.

<p align="center">
  <img alt="An animated image showing the video player and list of video captions beneath" src="media/cover_photo.png?raw=true"/>
</p>
<hr/>

**Attribution**

The videos and caption data shown in the images and gifs are from [Comprehensible Japanese](https://cijapanese.com). I highly recommend them if you are just starting to learn Japanese and are looking for easy to understand listening practice.

<hr/>
<br/>

## App Features

### Video Player

The video player itself is built on top of [react-native-video](https://github.com/react-native-video/react-native-video). I added my own play/pause, restart video, and progress bar under the player instead of using the built in controls provided.

To accompany the video player, there is an auto-scrolling caption feed. It may feel familiar if you have used the lyric viewer in Apple Music or Spotify's music players. While the video plays the current caption scrolls into the users' view. One tap on a caption enables the user to go back or forward to play the video from where that caption belongs.

<p align="center">
  <img alt="A animated image showing the video player and list of video captions beneath" src="media/player.gif?raw=true" height="440"  width="215"/>
</p>

### Translations

By pressing and holding a caption, the English translation can be shown. Requests are made directly to the [DeepL Translation API](https://www.deepl.com/docs-api/translate-text/). Currently, translating from Japanese to English is only supported. By adding language data to the caption file and a global language setting (or using the device's language) this could be extended to support content in any language.

<p align="center">
  <img alt="A animated image showcasing an inline translation from Japanese to English" src="media/translation.gif?raw=true" height="440"  width="215"/>
</p>

### Tablet Layout

When running the app on an iPad or an M series Mac, a different layout is used instead of a vertical single screen. All screens you'd navigate through on a phone are shown at once.

<p align="center">
  <img alt="A three column horizontal tablet layout. It displays a home screen with recent videos, a video list, and the video player with captions underneath" src="media/tablet_layout.jpeg?raw=true" height="512"  width="683"/>
</p>

### Theming

Having a dark and light mode is a quality of life feature I appreciate in apps. At first I experimented with React Navigation's built-in theme support but didn't see a way to support animating between colors. I kept their method of defining themes as a grouping of background, card, text, and border colors. I moved animated values for those colors into a React Context so that any component in the app can access the correct colors.

<p align="center">
  <img alt="A animated image that shows the settings modal opening and switching between dark and light app themes" src="media/theme.gif?raw=true" height="640"  width="295"/>
</p>

<hr/>
<br/>

## Technical Details

This section will outline some of the details on how I prepare videos for storage and how the application retrieves the data about which videos are available.
<br/>

### Data Storage / Backend

All the video and caption data is stored in S3 (another reason I won't be releasing the app). The app itself does not store a hardcoded list of available content. It requests a top-level manifest file (from `https://[s3 bucket]/manifest.json`) and receives a list of available directories in the bucket. The identifiers found in the manifest file are then made more human readable and shown on the apps home screen dynamically. Below is an example of `manifest.json`

```json
[
  {"title": "complete-beginner/", "type": "folder"},
  {"title": "beginner/", "type": "folder"},
  {"title": "intermediate/", "type": "folder"}
]
```

When navigating to one of those folders in the app a manifest file is requests from that directories root (i.e. `https://[s3 bucket]/beginner/manifest.json`). This manifest lists all the videos

```json
[
  {
    "title": "a-day-at-ohori-park",
    "type": "video"
  },
  {
    "title": "patreon-intro",
    "type": "video"
  },
  ...
  ...
]
```

The video file, caption data, and thumbnail are all stored in this directory with the same base file name with different extensions (`.mp4`, `.json`, `.png`).

<br/><br/>

### Video download and processing

**Prerequisites:**

1. `yt-dlp` is used to download videos and captions from YouTube. `youtube-dl` worked for me at one point, but stopped after a few months. `yt-dlp` is a fork that does the same thing.
   `pip3 install yt-dlp`

2. `ffmpeg` is used to convert the thumbails downloaded by `yt-dlp` from `.webp` to `.jpg`. It can be downloaded on the [FFmpeg site](https://ffmpeg.org)

<hr/><br/>

**Note**: I'm in the middle of changing some of the scripts in `/content-generation` to be used for generic YouTube downloading. It was previously tied to some automation and web scraping of the Comprehensible Japanese website. I did not wish to have that code public, so I'm making a CLI to add single YouTube videos at a time to the project's video storage S3 bucket.

To add videos, run the CLI script using `node content-generation/content-manager`. It presents some options to edit the `manifest` files and videos stored in S3. (Only adding videos is currently implemented)

The general flow of downloading videos is

1. The CLI requests which category the video is part of. If none exist or a new category is needed that is completed in this step. This step creates or modifies existing manifest files in S3
2. The CLI requests the video title and its YouTube ID
3. Using `youtube-dl` the video, japanese captions, and thumbnail are downloaded
4. The caption file is parsed and converted into a JSON file for use by the app. Furigana will be added to the JSON file in this step in the future.
5. All files are uploaded to S3 and the manifest file of the selected category is updated

Check out the files if you want a complete run-through of how this actually works.

<hr/>
<br/>

## Future improvements

- There should be a way to hide the captions like there is for the furigana. Always having the captions could easily become a crutch.
- Automatic furigana addition to caption files using a sentence -tokenization and dictionary-lookup step
- There are some rerendering issues with the captions. It is really only noticible when switching themes on the player screen.
- Keyboard support. Like tablet support, it's not super useful all the time. I'm more interested in learning how to implement it in the context of a mobile app.
