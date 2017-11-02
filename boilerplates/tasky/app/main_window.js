const {BrowserWindow} = require('electron');

// NOTE: background throttling doesn't run js in bg when user
// moves away from it

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      height: 500,
      width: 300,
      resizable: false,
      frame: false,
      show: false,
      webPreferences: { backgroundThrottling: false }
    });
    this.on('blur', () => this.hide());
    this.loadURL(url);
  }
}



module.exports = MainWindow;