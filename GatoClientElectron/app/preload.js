const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');
const DiscordRpc = require("discord-rpc");
const os = require('os');
const { app, ipcMain, BrowserWindow, screen } = electron;

// Preload things

// get rid of client unsupported message
window.OffCliV = "gato";

// Lets us exit the game lmao
document.addEventListener("keydown", (event) => {
    if (event.code == "Escape") {
        document.exitPointerLock();
    }
})

// Settings Stuff
document.addEventListener("DOMContentLoaded", (event) => {
    // Settings Menu Thing
    const menuItem = document.createElement("div");
    menuItem.setAttribute("id", "gatoMenuItem");
    menuItem.setAttribute("class", "menuItem");
    menuItem.innerHTML = '<img class="material-icons-outlined menBtnIcn" src="https://cdn.discordapp.com/attachments/661004708852269080/899301043672842250/settingIcon.png" onmouseenter="playTick()">';
    const menuContainer = document.getElementById("menuItemContainer");
    menuContainer.appendChild(menuItem);

    // Add Menu Click Event
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('preloadNeedSettings');
    menuItem.addEventListener("click", (event) => { ipcRenderer.send('openSettings'); });
})

// Fix settings importing
window.prompt = () => { 
    var tempHTML = '<div class="setHed">Import Settings</div>';
    tempHTML +=
        '<div class="settName" id="importSettings_div" style="display:block">Settings String<input type="url" placeholder="Paste Settings String Here" name="url" class="inputGrey2" id="settingString"></div>';
    tempHTML += '<a class="+" id="importBtn">Import</a>';
    menuWindow.innerHTML = tempHTML;
    importBtn.addEventListener('click',
        () => { parseSettings(settingString.value); });

    function parseSettings(string) {
        if (string && string != '') {
            try {
                var json = JSON.parse(string);
                for (var setting in json) {
                    setSetting(setting, json[setting]);
                    showWindow(1);
                }
            } catch (err) {
                console.error(err);
                alert('Error importing settings.');
            }
        }
    }
};

// When Settings are recieved run scripts
const { ipcRenderer } = require('electron');
ipcRenderer.on('preloadSettings', (event, preferences) => {
    let filePath = preferences;
    let userPrefs = JSON.parse(fs.readFileSync(filePath));
    // Scripts
    let scripts =
        [
            () => {
                // Sky color script: Thank you Janrex
                if (userPrefs['skyColor'] == true) {
                    Reflect.defineProperty(Object.prototype, "skyCol", {
                        value: userPrefs['skyColorValue'],
                    });
                }
            }
        ]
    const runScripts = () => { scripts.forEach(script => { (script)() }); };
    runScripts();

    // Special Discord RPC script
    if (userPrefs['discordrpc'] == true) {
        let rpcscript =
            [
                (require("./scripts/discord-rpc"))
            ]
        const runRPCScript = () => { rpcscript.forEach(script => { (script)() }); };
        runRPCScript();
    }
});
