const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const DiscordRpc = require("discord-rpc");
const { app, ipcMain, BrowserWindow, protocol, dialog } = electron;
const { autoUpdater } = require('electron-updater');
require('v8-compile-cache');

var hasExited = false;
var hasJoined = false;

// Main Process

// Credits:
// Gato/creepycats - Gatoclient
// Mixaz - IDKR source code (Used once or twice)
// ando - Billboards, modding, etc
// Giant - JANREX client (very nice source code, helped me make some stuff)

// A note to Sakurasou and Sorte
// Yes Im back. Make fun of me. Kbye ly <3

// Before starting:
// Create Swapper folders if not existing
var swapperFolder = path.join(app.getPath("documents"), "GatoclientResourceSwapper/Mod/css");
var assetSwapperDir = path.join(app.getPath("documents"), "GatoclientResourceSwapper/Mod");
var billboardFolder = path.join(app.getPath("documents"), "GatoclientResourceSwapper/Mod/textures/pubs");

if (!fs.existsSync(swapperFolder)) {
    fs.mkdirSync(swapperFolder, { recursive: true });
};
if (!fs.existsSync(assetSwapperDir)) {
    fs.mkdirSync(assetSwapperDir, { recursive: true });
};
if (!fs.existsSync(billboardFolder)) {
    fs.mkdirSync(billboardFolder, { recursive: true });
};

// Before we can read the settings, we need to make sure they exist, if they don't, then we create a template
if (!fs.existsSync(path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"))) {
    fs.writeFileSync(path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"), '{ "fpsUncap": true, "fullscreen": false, "discordrpc": true, "disableUserBadges": false, "disableEmotes": false,"disableLogoCSS": false, "disableMenuTimer": false, "skyColor": false, "skyColorValue": "#FF0000", "billboard":true, "billboardText":"🐱Gatoclient", "bbTextColor":"#6699FF", "bbBackgroundColor":"#3366CC", "autoFFA":"false" }', { flag: 'wx' }, function (err) {
        if (err) throw err;
        console.log("It's saved!");
    });
}

// Read settings to apply them to the command line arguments
let filePath = path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json");
let userPrefs = JSON.parse(fs.readFileSync(filePath));

// Fullscreen Handler
var mainWindowIsFullscreen = false;

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

// Logging thing
ipcMain.on('logMainConsole', (event, data) => {
    console.log(data);
});

// Save settings when sent to main process
let inputs;
ipcMain.on('savedSettings', (event, preferences) => {
    inputs = preferences;
    console.log(inputs);
    console.log('Saved settings to json...');
    var settingsPath = path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json");
    fs.writeFileSync(settingsPath, JSON.stringify(inputs));

    //new Notification({ title: 'Saved!', body: 'Successfully saved settings!' }).show();
});
ipcMain.on('preloadNeedSettings', (event) => {
    mainWindow.webContents.send('preloadSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"), app.getVersion(), __dirname);
});
ipcMain.on('settingsNeedSettings', (event) => {
    mainWindow.webContents.send('settingsSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"));
});
ipcMain.on('splashNeedInfo', (event) => {
    splashWindow.webContents.send('splashInfo', app.getVersion());
});
ipcMain.on('bbNeedSettings', (event) => {
    console.log('Billboards Loaded');
    mainWindow.webContents.send('bbSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"));
});
ipcMain.on('ffaNeedSettings', (event) => {
    console.log('AutoMatchmaker Loaded');
    mainWindow.webContents.send('ffaSettings', path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json"));
});

// Long thing of command lines to disable anything unrequired
if (userPrefs['removeUselessFeatures'] == true) {
    app.commandLine.appendSwitch("force_high_performance_gpu");
    app.commandLine.appendSwitch("force-high-performance-gpu");
    app.commandLine.appendSwitch("disable-breakpad");
    app.commandLine.appendSwitch("disable-component-update");
    app.commandLine.appendSwitch("disable-print-preview");
    app.commandLine.appendSwitch("disable-metrics");
    app.commandLine.appendSwitch("disable-metrics-repo");
    app.commandLine.appendSwitch("enable-javascript-harmony");
    app.commandLine.appendSwitch("enable-future-v8-vm-features");
    app.commandLine.appendSwitch("enable-webgl2-compute-context");
    app.commandLine.appendSwitch("disable-hang-monitor");
    app.commandLine.appendSwitch("no-referrers");
    app.commandLine.appendSwitch("renderer-process-limit", 100);
    app.commandLine.appendSwitch("max-active-webgl-contexts", 100);
    app.commandLine.appendSwitch("enable-quic");
    app.commandLine.appendSwitch("high-dpi-support", 1);
    app.commandLine.appendSwitch("ignore-gpu-blacklist");
    app.commandLine.appendSwitch("disable-2d-canvas-clip-aa");
    app.commandLine.appendSwitch("disable-bundled-ppapi-flash");
    app.commandLine.appendSwitch("disable-logging");
    app.commandLine.appendSwitch("disable-web-security");
    app.commandLine.appendSwitch("webrtc-max-cpu-consumption-percentage=100");
    console.log('Removed Useless Features');
}
if (userPrefs['fpsUncap'] == true) {
    app.commandLine.appendSwitch('disable-frame-rate-limit');
    app.commandLine.appendSwitch("disable-gpu-vsync");
    console.log('Removed FPS Cap');
}
if (userPrefs['angle-backend'] != 'default') {
    app.commandLine.appendSwitch("use-angle", userPrefs['angle-backend']);
    console.log('Using Angle: ' + userPrefs['angle-backend']);
}
if (userPrefs['inProcessGPU'] == true) {
    app.commandLine.appendSwitch("in-process-gpu");
    console.log('In Process GPU is active');
}
if (userPrefs['disableAccelerated2D'] == true) {
    app.commandLine.appendSwitch("disable-accelerated-2d-canvas", "true");
    console.log('Disabled Accelerated 2D canvas');
}

// Workaround for Electron 8.x
if (userPrefs['resourceSwapper'] == true) {
    protocol.registerSchemesAsPrivileged([{
        scheme: "gato-swap",
        privileges: {
            secure: true,
            corsEnabled: true
        }
    }]);
}

app.allowRendererProcessReuse = true;
//Listen for app to get ready
app.on('ready', function () {
    let filePath = path.join(app.getPath("documents"), "GatoclientResourceSwapper/settings.json");
    let userPrefs = JSON.parse(fs.readFileSync(filePath));

    if (userPrefs['resourceSwapper'] == true) {
        protocol.registerFileProtocol("gato-swap", (request, callback) => callback(decodeURI(request.url.replace(/^gato-swap:/, ""))));
    }

    app.setAppUserModelId(process.execPath);
    // Make Splash Screen
    splashWindow = new BrowserWindow({
        autoHideMenuBar: true,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'splash/splashPreload.js'),
            nodeIntegration: true
        }
    });
    splashWindow.setAlwaysOnTop(true, 'pop-up-menu');
    splashWindow.setAlwaysOnTop(false);
    splashWindow.setBackgroundColor('#000000');
    splashWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'splash/splash.html'),
        icon: __dirname + 'src/cat.ico' // Doesn't work anymore just ignore it
    }));
    splashWindow.setSize(512, 256);
    splashWindow.center();
    splashWindow.removeMenu();

    // Check for updates
    splashWindow.once('ready-to-show', () => {
        autoUpdate();
    });
    async function autoUpdate() {
        return new Promise((resolve, reject) => {
            autoUpdater.checkForUpdatesAndNotify();
            // Splash screen no update
            autoUpdater.on('update-not-available', () => {
                setTimeout(launchGame, 5000);
                splashWindow.webContents.send('latest');
                resolve();
            });
            // Splash screen update shits
            autoUpdater.on('update-available', () => {
                splashWindow.webContents.send('newVersion');
                let options = {};
                options.type = "question";
                options.buttons = ["&Yes", "&No", "&Cancel"];
                options.defaultId = 2;
                options.defaultid = 2;
                options.message = "Update found! Would you like to install it?";
                var promptAnswer = dialog.showMessageBoxSync(options);

                if (promptAnswer === 0) {
                    console.log('Redirecting to update page');
                    electron.shell.openExternal('https://github.com/Gatohost/gatoclient/releases');
                    app.exit(0);
                }
                if (promptAnswer === 1) {
                    console.log('Launching Game');
                    launchGame();
                    splashWindow.webContents.send('havefun');
                    resolve();
                }
                if (promptAnswer === 2) {
                    console.log('Closing');
                    app.exit(0);
                }
            });
        });
    }
    // Splash Screen Shit
    function launchGame() {
        mainWindow.setBackgroundColor('#000000');
        mainWindow.setSize(1600, 900);
        mainWindow.center();
        mainWindow.removeMenu();
        if (userPrefs['fullscreen'] == true) {
            mainWindow.setFullScreen(true);
            mainWindowIsFullscreen = true;
        }

        mainWindow.loadURL('https://krunker.io');

        mainWindow.once('ready-to-show', () => {
            splashWindow.destroy();
            mainWindow.show();
        });

        // Update webhook
        //const { Webhook } = require('discord-webhook-node');
        //const hook = new Webhook("Fuck sakurasou");
        //hook.setUsername('Gatoclient');
        //hook.send("join");

        hasJoined = true;
    }

    //Make the window
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Rich Presence
    ipcMain.handle("rpc-activity",
        async (_, activity) => { await setActivity(activity); });

    // CSS
    var cssToLoad = '';
    var mainCSS = '/* Gatoclient Loading Screen */ #initLoader{ background-image: url(https://media.discordapp.net/attachments/661004708852269080/867827020884213780/Screenshot_2021-07-22_131147.png?width=932&height=467)!important; background-size:cover; } #loadInfoRHolder{ background-color:#0000003b; padding: 10px 10px; } #loadInfoLHolder{ background-color:#0000003b; padding: 10px 10px; } #loadTipsHolder{ background-color:#0000003b; padding: 10px 10px; } #loadInfoLHolder::after{ position:fixed; background-color:#0000003b; padding: 10px 10px; content: "Gatoclient by creepycatsttv"; width:370px; bottom: -0.8%; left: 50%; transform: translate(-50%, -50%); } #aHider{ display:none!important; } /* Gatoclient Branding */ #mapInfo::before { visibility: visible; z-index:100; content: "Gatoclient | "; width:600px; bottom: 75px; font-size:20px; display: } /* Flashing Updates Box */ #updateAd{ box-shadow:unset; animation-name:freeKRPulse; animation-duration:2s; animation-iteration-count:infinite } #gatoMenuItem > img.menBtnIcn { -webkit-user-select: none; -webkit-user-drag: none; -webkit-app-region: no-drag; } /* Gatoclient Badges */ #gatoDeveloper::before{ background-image: url(https://cdn.discordapp.com/attachments/901905234861883432/901905274946846790/gatobadge.png); background-size: 75% 100%; background-repeat: no-repeat; content: "eee";font-size: 31;color: rgba(0, 0, 0, 0); } #gatoQT::before{ background-image: url(https://cdn.discordapp.com/emojis/903049364304461834.png?size=96); background-size: 75% 100%; background-repeat: no-repeat; content: "eee";font-size: 31;color: rgba(0, 0, 0, 0); } #gatoCC::before{ background-image: url(https://cdn.discordapp.com/attachments/901905234861883432/901905273302683678/ccbadge.png); background-size: 75% 100%; background-repeat: no-repeat; content: "eee";font-size: 31;color: rgba(0, 0, 0, 0); } #gatoKDev::before{ background-image: url(https://cdn.discordapp.com/attachments/901905234861883432/901905273839583283/devbadge.png); background-size: 75% 100%; background-repeat: no-repeat; content: "eee";font-size: 31;color: rgba(0, 0, 0, 0); } #gatoWinner::before{ background-image: url(https://cdn.discordapp.com/attachments/901905234861883432/901905270349889618/winnerbadge.png); background-size: 75% 100%; background-repeat: no-repeat; content: "eee";font-size: 31;color: rgba(0, 0, 0, 0); } #gatoRanked::before{ background-image: url(https://cdn.discordapp.com/emojis/902679654073241630.png?size=96); background-size: 75% 100%; background-repeat: no-repeat; content: "eee";font-size: 31;color: rgba(0, 0, 0, 0); }';
    var menuTimerCSS = '/* Menu Timer */ #uiBase.onMenu #spectateUI { display: block !important; } #uiBase.onMenu #spectateUI > :not(#spectateHUD) { display: none !important; } #uiBase.onMenu #spectateHUD > :not(.spectateInfo, #specGMessage) { display: none !important; } #uiBase.onMenu #specTimer { font-size: 28px; text-align: center; position: fixed; transform: translateX(-50%); left: 50%; top: 20px; width: 221px; height: 89px; padding: 20px; margin:0; border-radius: 0; background-color: transparent; will-change: unset; text-shadow: 2px 2px 3px rgba(30, 30, 30, .5); } #uiBase.onMenu #spectateHUD { transform:translate(-50%,-50%); position:fixed; top:55%; z-index:999}';
    var logoCSS = '/* Gatoclient Logo */ #mainLogo{ content: url(https://cdn.discordapp.com/attachments/661004708852269080/859574411770200064/logo_1.png); }'

    // Main CSS
    cssToLoad += mainCSS;
    console.log('Added Loading Screen + Branding CSS');

    // Logo CSS
    if (userPrefs['disableLogoCSS'] != true) {
        cssToLoad += logoCSS;
        console.log('Added Logo CSS');
    }

    // Menu Timer CSS
    if (userPrefs['disableMenuTimer'] != true) {
        cssToLoad += menuTimerCSS;
        console.log('Added Menu Timer CSS');
    }
    // CSS swap
    mainWindow.webContents.on('dom-ready', function () {
        console.log('Attempting to load CSS...');
        mainWindow.webContents.send('injectCSS', cssToLoad);

        if (userPrefs['disableUserBadges'] != true) {
            mainWindow.webContents.send('badges');
        }
        if (userPrefs['disableEmotes'] != true) {
            mainWindow.webContents.send('emotes');
        }
    });

    // Add Shortcuts
    mainWindow.webContents.on('before-input-event', (event, input) => {
        // Developer Console
        if (input.control && input.key.toLowerCase() === 'i') {
            mainWindow.webContents.openDevTools();
            event.preventDefault();
        }

        // F5 to Reload Lobby
        if (input.key === "F5") {
            mainWindow.reload();
            event.preventDefault();
        }

        // F6 to Find New Lobby
        if (input.key === "F6") {
            mainWindow.loadURL('https://krunker.io');
            event.preventDefault();
        }

        // F11 to Fullscreen
        if (input.key === "F11") {
            mainWindow.setFullScreen(!mainWindowIsFullscreen);
            mainWindowIsFullscreen = !mainWindowIsFullscreen;
            event.preventDefault();
        }

        // F7 to fix Recaptcha
        if (input.key === "F7") {
            mainWindow.webContents.send('recaptchaFix');
            event.preventDefault();
        }
        // F8 to delete twitch
        if (input.key === "F8") {
            mainWindow.webContents.send('streamFix');
            event.preventDefault();
        }
    })

    // Custom Billboard
    if (userPrefs['advancedBillboard'] == true) {
        var bburl = userPrefs['advancedBillboardData'];

        const Axios = require('axios');
        const https = require('https');

        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        async function downloadImage(url, filepath) {
            const response = await Axios({
                url,
                method: 'GET',
                responseType: 'stream',
                httpsAgent: agent
            });
            return new Promise((resolve, reject) => {
                response.data.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            });
        }

        for (var i = 0; i < 13; i++) {
            downloadImage(bburl, path.join(app.getPath("documents"), `GatoclientResourceSwapper/Mod/textures/pubs/b_${i}.png`));
        }
    }
    else {
        for (var i = 0; i < 13; i++) {
            if (fs.existsSync(path.join(app.getPath("documents"), `GatoclientResourceSwapper/Mod/textures/pubs/b_${i}.png`))) {
                fs.unlinkSync(path.join(app.getPath("documents"), `GatoclientResourceSwapper/Mod/textures/pubs/b_${i}.png`), function (err) {
                    console.log(err);
                });
                console.log("Deleted " + path.join(app.getPath("documents"), `GatoclientResourceSwapper/Mod/textures/pubs/b_${i}.png`));
            }
        }
    }

    // Resource Swapper
    if (userPrefs['resourceSwapper'] == true) {
        let Swapper = require("./scripts/swapper");

        let swapper = new Swapper(
            mainWindow,
			/** @type {string} */("normal"),
			/** @type {string} */(path.join(app.getPath("documents"), "GatoclientResourceSwapper/Mod"))
        );
        swapper.init();
    }

    // Handle opening social/editor page
    mainWindow.webContents.on("new-window", (event, url) => {
        // I hope this fixes the bug with the shitty Amazon Ad
        event.preventDefault();
        if (url.includes('https://krunker.io/')) {
            if (url.includes('https://krunker.io/social.html')) {
                console.log('Opening Social Page');
                openSocialPage(url);
            }
            if (url.includes('https://krunker.io/?game=')) {
                console.log('Changing Krunker Tab');
                mainWindow.loadURL(url);
            }
            if (url.includes('https://krunker.io/editor.html')) {
                console.log('Changing Krunker Tab');
                mainWindow.loadURL(url);
            }
        }
        if (url.includes('https://twitch.tv/')) {
            console.log('Opening Twitch');
            mainWindow.loadURL(url);
        }
        console.log(url);
    });

    //Make Social window
    socialWindow = new BrowserWindow({
        autoHideMenuBar: true
    });

    const isSocialWindowOpened = () => !socialWindow.isDestroyed();

    function openSocialPage(urlToOpen) {
        if (isSocialWindowOpened() != true) {
            //Make Social window
            socialWindow = new BrowserWindow({
                autoHideMenuBar: true,
                webPreferences: {
                    preload: path.join(__dirname, '/social/socialPreload.js')
                }
            });
            socialWindow.hide();
            socialWindow.setBackgroundColor('#000000');
        }
        socialWindow.setBackgroundColor('#000000');
        socialWindow.show();
        socialWindow.setSize(1600, 900);
        socialWindow.loadURL(urlToOpen);
        socialWindow.center();
        socialWindow.removeMenu();
        // Handle Social Page Switching
        socialWindow.webContents.on("new-window", (event, url) => {
            event.preventDefault();
            urlToOpen = url;
            if (url.includes('https://krunker.io/social.html')) {
                socialWindow.loadURL(urlToOpen);
            }
        });
    }

    ipcMain.on('openBillboardEditor', (event) => {
        console.log('Billboard Editor Loaded');
        openSocialPage('https://creepycats.github.io/pages/gatoclient/billboard/index.html');
    });

    // Handle Social Page Switching
    socialWindow.webContents.on("new-window", (event, url) => {
        event.preventDefault();
        urlToOpen = url;
        if (url.includes('https://krunker.io/social.html')) {
            socialWindow.loadURL(urlToOpen);
        }
    });

    mainWindow.on('close', function () {
        if (hasExited == false) {
            hasExited = true;

            // Update webhook
            if (hasJoined == true) {
                // Update webhook
                //const { Webhook } = require('discord-webhook-node');
                //const hook = new Webhook("Fuck sakurasou");
                //hook.setUsername('Gatoclient');
                //hook.send("exit");
            }

            setTimeout(() => app.quit(), 100);
        }

        if (isSocialWindowOpened() == true) {
            socialWindow.destroy();
        }
    });

    socialWindow.destroy();
});

// RPC stuff
rpc.login({ clientId }).catch(console.error);