const {app, BrowserWindow, ipcMain, shell} = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const _ = require('lodash');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: { backgroundThrottling: false }
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on('videos:added', (evt, videos) => {
  const promises = videos.map( video => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(video.path, (err, { format}) => {
        if (err) return reject(err);
        resolve(Object.assign({}, video, { duration: format.duration, format: 'avi' }));
      })
    })
  })

  Promise.all(promises)
    .then(res => mainWindow.webContents.send('meta:complete', res))
    .catch(err => console.log(err));
});

ipcMain.on('conversion:start', (evt, videosObj) => {
  Object.values(videosObj).forEach(video => {
    const vidPath = video.path;
    const outputPath = vidPath.replace(path.extname(vidPath), '.'+video.format);
    console.log(outputPath);
    ffmpeg(vidPath)
      .output(outputPath)
      .on('progress', ({ timemark }) =>
        mainWindow.webContents.send('conversion:progress', {video, timemark}))
      .on('end', () => 
        mainWindow.webContents.send('conversion:end', { video, outputPath}))
      .run()
  })
})

ipcMain.on('folder:open', (evt, outputPath) => {
  shell.showItemInFolder(outputPath);
})