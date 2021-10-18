const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');
const DiscordRpc = require("discord-rpc");
const os = require('os');
const { app, ipcMain, BrowserWindow, screen } = electron;

// Create Swapper folder if not existing
var swapperFolder = path.join(app.getPath("documents"), "GatoclientResourceSwapper/CSS");

if (!fs.existsSync(swapperFolder)) {
    fs.mkdirSync(swapperFolder, { recursive: true });
};

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

// Settings Menu
ipcMain.on('openSettings', (event) => {
    console.log('Settings menu opened...');
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

    // Fix Object Destroyed Error
    prefWindow.on('close', function () {
        prefWindow = null;
    })

    // Add Shortcuts
    prefWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control && input.key.toLowerCase() === 'i') {
            prefWindow.webContents.openDevTools();
            event.preventDefault();
        }
    })

    prefWindow.webContents.on('did-finish-load', (event) => {
        prefWindow.webContents.send('settingsSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"));
    })
});

// Save settings
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
    if (fs.existsSync(path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json")) == false) {
        fs.writeFileSync(path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"), '{ "fpsUncap": false, "discordrpc": true, "skyColor": false, "skyColorValue": "#FF0000" }', { flag: 'wx' }, function (err) {
            if (err) throw err;
            console.log("It's saved!");
        });
    }
    let filePath = path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json");
    let userPrefs = JSON.parse(fs.readFileSync(filePath));
    // app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");
    if (userPrefs['fpsUncap'] == true) {
        app.commandLine.appendSwitch('disable-frame-rate-limit');
        app.commandLine.appendSwitch("disable-gpu-vsync");
    }

    //app.commandLine.appendSwitch("disable-accelerated-2d-canvas", "true");
    //app.commandLine.appendSwitch("in-process-gpu")

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
        icon: __dirname + 'src/cat.ico' // sets window icon
    }));
    mainWindow.center();
    mainWindow.removeMenu();

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
        if (input.control && input.key.toLowerCase() === 'i') {
            mainWindow.webContents.openDevTools();
            event.preventDefault();
        }
        if (input.key === "F5") {
            mainWindow.loadURL(url.format({
                pathname: 'https://krunker.io',
                icon: 'src/icon.ico' // sets window icon
            }));
            event.preventDefault();
        }
    })
});

app.on('window-close-all', () => {
    app.quit();
});

rpc.login({ clientId }).catch(console.error);