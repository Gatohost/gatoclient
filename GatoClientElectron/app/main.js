const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');
const DiscordRpc = require("discord-rpc");
const os = require('os');
const { app, ipcMain, BrowserWindow, screen } = electron;
const { autoUpdater } = require('electron-updater');

// Main Process

// Before starting:
// Create Swapper folder if not existing
var swapperFolder = path.join(app.getPath("documents"), "GatoclientResourceSwapper/CSS");

if (!fs.existsSync(swapperFolder)) {
    fs.mkdirSync(swapperFolder, { recursive: true });
};

// Give App Version to window
ipcMain.on('app_version', (event) => {
    event.sender.send('app_version', { version: app.getVersion() });
});

// Rich Presence
const clientId = "859516621416169522";
const rpc = new DiscordRpc.Client({ transport: 'ipc' });

const setActivity =
    async (gameInfo) => {
        console.log(gameInfo)
        try {
            rpc.setActivity({
                details: gameInfo.mode ? gameInfo.mode : "Playing Krunker",
                state: gameInfo.map ? gameInfo.map : "doing the thing!",
                endTimestamp: Date.now() + gameInfo.time * 1000,
                largeImageText: "GatoClient",
                largeImageKey: "logo"
            })
        } catch {
        }
    }

// When Menu item clicked, Open Settings Menu
ipcMain.on('openSettings', (event) => {
    // Settings Menu Initialized
    let prefWindow = new BrowserWindow({
        width: 500,
        height: 400,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'scripts/settings.js')
        }
    });
    prefWindow.loadURL(path.join(__dirname, 'settings/settings.html'));
    prefWindow.show();
    prefWindow.center();
    prefWindow.removeMenu();
    var settingsPath = path.join(__dirname, 'data/settings.json')
    prefWindow.webContents.send('restoreOld', );

    // Close on main close
    mainWindow.on('close', function () {
        if(prefWindow != null)
            prefWindow.close();
    })

    // Fix Object Destroyed Error with Closing
    prefWindow.on('close', function () {
        prefWindow = null;
    })

    // Send settings data to settings script when window loaded
    prefWindow.webContents.on('did-finish-load', (event) => {
        prefWindow.webContents.send('settingsSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"));
    })
});

// Save settings when sent to main process
let inputs;
ipcMain.on('savedSettings', (event, preferences) => {
    inputs = preferences;
    console.log(inputs);
    console.log('Saved settings to json...');
    var settingsPath = path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json");
    fs.writeFileSync(settingsPath, JSON.stringify(inputs));
});
ipcMain.on('preloadNeedSettings', (event) => {
    mainWindow.webContents.send('preloadSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"));
});

//Listen for app to get ready
app.on('ready', function () {
    // Before we can read the settings, we need to make sure they exist, if they don't, then we create a template
    if (fs.existsSync(path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json")) == false) {
        fs.writeFileSync(path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"), '{ "fpsUncap": false, "discordrpc": true, "skyColor": false, "skyColorValue": "#FF0000" }', { flag: 'wx' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }

    // Read settings to apply them to the command line arguments
    let filePath = path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json");
    let userPrefs = JSON.parse(fs.readFileSync(filePath));
    if (userPrefs['fpsUncap'] == true) {
        app.commandLine.appendSwitch('disable-frame-rate-limit');
        app.commandLine.appendSwitch("disable-gpu-vsync");
    }
    // Heres some unused command line switches that I am too lazy to implement right now
    // app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
    // app.commandLine.appendSwitch("disable-accelerated-2d-canvas", "true");
    // app.commandLine.appendSwitch("in-process-gpu");

    //Make the window
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    mainWindow.setSize(1600, 900);
    mainWindow.loadURL(url.format({
        pathname: 'https://krunker.io',
        icon: __dirname + 'src/cat.ico' // Doesn't work anymore just ignore it
    }));
    mainWindow.center();
    mainWindow.removeMenu();
    var mainWindowIsFullscreen = false;

    // Check for updates
    mainWindow.once('ready-to-show', () => {
        autoUpdater.checkForUpdatesAndNotify();
    });

    // Rich Presence
    ipcMain.handle("rpc-activity",
        async (_, activity) => { await setActivity(activity); });

    // CSS swap
    mainWindow.webContents.on('dom-ready', function () {
        console.log('Attempting to load CSS...');
        fs.readFile(__dirname + '/packagedCSS/main_custom.css', "utf-8", function (error, data) {
            if (!error) {
                var formatedData = data.replace(/\s{2,10}/g, ' ').trim();
                mainWindow.webContents.insertCSS(formatedData);
                console.log('Added Packaged CSS');
            };
        });
        fs.readFile(swapperFolder + '/main_custom.css', "utf-8", function (error, data) {
            if (!error) {
                var formatedData = data.replace(/\s{2,10}/g, ' ').trim();
                mainWindow.webContents.insertCSS(formatedData);
                console.log('Added User CSS');
            };
        });
        console.log('Loaded!');
    })

    // Add Shortcuts
    mainWindow.webContents.on('before-input-event', (event, input) => {
        // Developer Console
        if (input.control && input.key.toLowerCase() === 'i') {
            mainWindow.webContents.openDevTools();
            event.preventDefault();
        }

        // F5 to Reload
        if (input.key === "F5") {
            mainWindow.loadURL(url.format({
                pathname: 'https://krunker.io',
                icon: 'src/icon.ico' // Doesn't work anymore just ignore it
            }));
            event.preventDefault();
        }

        // F11 to Fullscreen
        if (input.key === "F11") {
            if (mainWindowIsFullscreen == false) {
                mainWindow.setFullScreen(true);
                mainWindowIsFullscreen = true;
            }
            else {
                mainWindow.setFullScreen(false);
                mainWindowIsFullscreen = false;
            }
            event.preventDefault();
        }
    })
});

// Handle Updating
autoUpdater.on('update-available', () => {
    // mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

// Just to make sure the Client Closes fully
app.on('window-close-all', () => {
    app.quit();
});

// RPC stuff
rpc.login({ clientId }).catch(console.error);