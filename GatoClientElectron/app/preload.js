const { app, ipcMain, BrowserWindow, screen, shell, ipcRenderer } = require("electron");
const DiscordRpc = require("discord-rpc");
const path = require("path");
const url = require("url");
const fs = require("fs");
const os = require("os");

window.OffCliV = "gato";
document.addEventListener("keydown", (event) => { if (event.code == "Escape") document.exitPointerLock() }); // allows for exiting the game
document.addEventListener("DOMContentLoaded", (event) => {
    const menuItem = document.createElement("div"); // ...
    const menuContainer = document.getElementById("menuItemContainer");
    
    menuItem
      .setAttribute("id", "gatoMenuItem")
      .setAttribute("class", "menuItem")
      .innerHTML = '<img class="material-icons-outlined menBtnIcn" src="https://cdn.discordapp.com/attachments/661004708852269080/899301043672842250/settingIcon.png" onmouseenter="playTick()">';
    menuContainer.appendChild(menuItem);

    // Add Menu Click Event
    ipcRenderer.send("preloadNeedSettings");
    menuItem.addEventListener("click", (event) => { ipcRenderer.send("openSettings"); });
    if (document.contains(document.getElementById("revjet_container"))) document.getElementById("revjet_container").remove();

    // Changelogs
    const oldIcon = document.getElementById("updateAdIcon");
    const updateHolder = document.getElementById("updateAd");
    const newIcon = document.createElement("img");
    const updateDetailText = document.getElementById("updateAdVersion");
    const HelpTextHoldersArray = document.querySelectorAll("#helpTxtHol");
    const updateDetailHolder = HelpTextHoldersArray[5];
    const newDetailText = document.createElement("div");
    
    oldIcon.remove();
    newIcon
      .setAttribute("id", "helpPIcon")
      .setAttribute("src", "https://cdn.discordapp.com/attachments/661004708852269080/899301043672842250/settingIcon.png");
    updateHolder.insertBefore(newIcon, updateHolder.children[0]); console.log(HelpTextHoldersArray); updateDetailText.remove();
    
    newDetailText
      .setAttribute("id", "helpGuidOpn");
      .innerHTML = "Gatoclient Updates";
    updateDetailHolder.appendChild(newDetailText);

    // Changelogs Click Event
    const updateAdHolder = document.getElementById("updateAd");
    updateAdHolder
      .removeAttribute("onclick")
      .addEventListener("click", (event) => {
        ipcRenderer.send("openChangelog");
    });
});

// Fix settings importing
window.prompt = () => { 
    var tempHTML = '<div class="setHed">Import Settings</div>';
    
    tempHTML += '<div class="settName" id="importSettings_div" style="display:block">Settings String<input type="url" placeholder="Paste Settings String Here" name="url" class="inputGrey2" id="settingString"></div>';
    tempHTML += '<a class="+" id="importBtn">Import</a>';
    
    menuWindow.innerHTML = tempHTML;
    importBtn.addEventListener("click", () => { parseSettings(settingString.value) });

    function parseSettings(string) {
        if (string && string != "") {
            try {
                var json = JSON.parse(string);
                for (var setting in json) {
                    setSetting(setting, json[setting]);
                    showWindow(1);
                }
            } catch (err) {
                console.error(err);
                alert("Error importing settings.");
            }
        }
    }
};

// When Settings are recieved run scripts
ipcRenderer.on("preloadSettings", (event, preferences) => {
    const runScripts = () => { scripts.forEach(script => { (script)() }) };
    const runRPCScript = () => { rpcscript.forEach(script => { (script)() }); };
    
    let filePath = preferences;
    let userPrefs = JSON.parse(fs.readFileSync(filePath));
    let scripts = [ /* Scripts */ 
        () => {
            // Sky color script: Thank you Janrex
            if (userPrefs['skyColor'] == true) {
                Reflect.defineProperty(Object.prototype, "skyCol", {
                    value: userPrefs['skyColorValue'],
                });
            }
        }]; runScripts();

    // Special Discord RPC script
    if (userPrefs["discordrpc"] == true) {
        let rpcscript = [(require("./scripts/discord-rpc"))];
        runRPCScript();
    }
});
