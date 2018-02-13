'use strict';
//require('./serverAutoServicio/server');

const {app, dialog, shell, Menu, BrowserWindow} = require('electron')

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function () {

  const {width, height} = require('electron').screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
          width: width,
          height: height,
          minWidth: 800,
          frame: false
  });

  mainWindow.setMenu(null);

  mainWindow.loadURL('file://'+__dirname+'/views/login.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.toggleDevTools()
});