const {app, ipcMain} = require('electron');
const path = require('path');
const TimerTray = require('./app/timer_tray');
const MainWindow = require('./app/main_window');

let mainWindow;
let tray;

app.on('ready', () => {
  app.dock.hide();
  mainWindow = new MainWindow(`file://${__dirname}/src/index.html`);
  
  const iconName = process.platform === 'win32' ? 'windows-template.png' : 'iconTemplate.png';
  const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
  tray = new TimerTray(iconPath, mainWindow);
});

ipcMain.on('update-timer', (event, timeLeft) => {
  if (timeLeft) {
    tray.setTitle(timeLeft);
    tray.setHighlightMode('selection');    
  } else {
    tray.setTitle('Finished!');
    tray.setHighlightMode('always');
  }
})

