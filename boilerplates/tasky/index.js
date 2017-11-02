const {app, BrowserWindow, Tray} = require('electron');
const { exec } = require('child_process');
const path = require('path');

let mainWindow;
let tray;


app.on('ready', () => {
  mainWindow = new BrowserWindow({
    height: 500,
    width: 300,
    resizable: false,
    frame: false,
    show: false
  });
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

  const iconName = process.platform === 'win32' ? 'windows-template.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
  tray = new Tray(iconPath);
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide(); 
    } else {
      mainWindow.show(); 
    }
  })
});

