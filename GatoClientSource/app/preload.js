const fs = require('fs');
const { ipcRenderer } = require('electron');
require('v8-compile-cache');
// Preload things

// get rid of client unsupported message
window.OffCliV = true;

var elements = {};

const settingsMenuHTML = '<link rel="stylesheet" href="https://creepycats.github.io/api/gatoclient/settings.css"><div class="backgroundSettings"><div class="titleHolder"> <img src="https://cdn.discordapp.com/attachments/901905234861883432/907024700880879686/0.png" class="titleImage" width="140" height="140"> <h3 class="title">Gatoclient Settings</h3> </div> <div class="container"> <div id="content"> <form id="gatoclientsettings" action=""> <div> <h2>Client Settings</h2> <p> <span>Uncap FPS</span> <label for="fpsUncap"></label> <span> <input type="checkbox" class="switch_1" name="fpsUncap" value="true" id="fpsUncap"> </span> </p> <p> <span>ANGLE Backend</span> <label for="angle-backend"></label> <span class="select-dropdown"> <select name="angle-backend" id="angle-backend" class="gatoSettingsDropdown"> <option value="default">Default</option> <option value="gl">OpenGL</option> <option value="d3d11">D3D11</option> <option value="d3d9">D3D9</option> <option value="d3d11on12">D3D11 on 12</option> <option value="vulkan">Vulkan</option> </select> </span> </p> <p>ReCaptcha Error Fix - F7</p><p>Remove stupid ranked stream - F8</p><p> <span>Remove Chromium Features (Unstable)</span> <label for="removeUselessFeatures"></label> <span> <input type="checkbox" class="switch_1" name="removeUselessFeatures" value="false" id="removeUselessFeatures"> </span> </p> <p> <span>In Process GPU</span> <label for="inProcessGPU"></label> <span> <input type="checkbox" class="switch_1" name="inProcessGPU" value="false" id="inProcessGPU"> </span> </p> <p> <span>Disable Accelerated 2D Canvas</span> <label for="disableAccelerated2D"></label> <span> <input type="checkbox" class="switch_1" name="disableAccelerated2D" value="false" id="disableAccelerated2D"> </span> </p> <p> <span>Fullscreen Automatically</span> <label for="fullscreen"></label> <span> <input type="checkbox" class="switch_1" name="fullscreen" value="false" id="fullscreen"> </span> </p> <p> <span>Discord RPC</span> <label for="discordrpc"></label> <span> <input type="checkbox" class="switch_1" name="discordrpc" value="false" id="discordrpc"> </span> </p> <p> <span>Disable User Badges</span> <label for="disableUserBadges"></label> <span> <input type="checkbox" class="switch_1" name="disableUserBadges" value="false" id="disableUserBadges"> </span> </p> <p> <span>Disable Emotes / Commands</span> <label for="disableEmotes"></label> <span> <input type="checkbox" class="switch_1" name="disableEmotes" value="false" id="disableEmotes"> </span> </p> <p> <span>Disable Settings Button</span> <label for="disableGatoButton"></label> <span> <input type="checkbox" class="switch_1" name="disableGatoButton" value="false" id="disableGatoButton"> </span> </p> </div> <div> <h2>CSS/Swap Settings</h2> <p> <span>Resource Swapper</span> <label for="resourceSwapper"></label> <span> <input type="checkbox" class="switch_1" name="resourceSwapper" value="false" id="resourceSwapper"> </span> </p> <p> <span>Resource Swapper Folder: Documents/GatoclientResourceSwapper</span> </p> <p> <span>Disable Gatoclient Logo</span> <label for="disableLogoCSS"></label> <span> <input type="checkbox" class="switch_1" name="disableLogoCSS" value="false" id="disableLogoCSS"> </span> </p> <p> <span>Disable Menu Timer</span> <label for="disableMenuTimer"></label> <span> <input type="checkbox" class="switch_1" name="disableMenuTimer" value="false" id="disableMenuTimer"> </span> </p> </div> <div> <h2>Modules</h2>  <p> <span>Custom Billboards</span> <label for="advancedBillboard"></label> <span> <input type="checkbox" class="switch_1" name="advancedBillboard" value="true" id="advancedBillboard"> </span> </p> <p>To use this, open the Billboard Editor with the button below, generate your billboard, and copy the output into the field below (REQUIRES RESOURCE SWAPPER)</p> <p> <span>Billboard Data</span> <label for="advancedBillboardData"></label> <span> <input type="text" class="form__input" placeholder="data:image/png" name="advancedBillboardData" value=""> </span> </p> <p> <button id="openBillboardEditor" class="button style" type="button">Open the Billboard Editor</button> </p><p>_________________________________________________________________</p> <p> <span>F4 - Auto Matchmaker</span> <label for="autoFFA"></label> <span> <input type="checkbox" class="switch_1" name="autoFFA" value="false" id="autoFFA"> </span> </p> <p> <span>Auto Matchmaker Gamemode</span> <label for="matchmakerGamemode"></label> <span class="select-dropdown"> <select name="matchmakerGamemode" id="matchmakerGamemode" class="gatoSettingsDropdown"> <option value="0">FFA</option> <option value="1">TDM</option> <option value="2">Point</option> <option value="3">CTF</option> <option value="19">KC</option> <option value="27">Kranked</option> <option value="10">Gun Game</option> <option value="21">Sharp Shooter</option> </select> </span> </p> <p> <span>Matchmaker Minimum Players</span> <label for="matchmakerMinPlayer"></label> <span class="select-dropdown"> <select name="matchmakerMinPlayer" id="matchmakerMinPlayer" class="gatoSettingsDropdown"> <option value="0">0</option> <option value="1">1</option> <option value="2">2</option> <option value="3">3</option> <option value="4">4</option> <option value="5">5</option> <option value="6">6</option> <option value="7">7</option> <option value="8">8</option> </select> </span> </p> </div> </form> </div> </div> </div>';
// const miscHeader = '<div style="display:inline-block;text-align:right;float:right;"> <div class="settingsBtn" style="width:auto;background-color:#994cd1" onclick="openOneTrust()">Manage Ads</div> <div class="settingsBtn" onclick="resetSettings()">Reset</div> <div class="settingsBtn" onclick="exportSettings()">Export</div> <div class="settingsBtn" onclick="importSettingsPopup()">Import</div> <select id="settingsPreset" onchange="selectSettingPre(this.value)" class="inputGrey2" style="margin-left:0px;font-size:14px" wtx-context="938DBE0F-09D6-4782-82C6-517CD9AB7DA3"> <option value="0">Default</option> <option value="1">Pro</option> <option value="3">Performance</option> <option value="2" selected="">Custom</option> </select> </div> <div style="display:inline-block;width:220px;"> <input id="settSearch" type="text" placeholder="Search" oninput="windows[0].searchList()" wtx-context="4E0956D1-656E-473C-8C15-5D82472C40F3"> </div>';
const settingsHeader = '<div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1);window.windows[0].changeTab(0)">General</div> <div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1);window.windows[0].changeTab(1)">Controls</div> <div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1);window.windows[0].changeTab(2)">Display</div> <div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1);window.windows[0].changeTab(3)">Render</div> <div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1);window.windows[0].changeTab(4)">Game</div> <div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1);window.windows[0].changeTab(5)">Sound</div> <div class="settingTab " onmouseenter="playTick()" onclick="SOUND.play(&quot;select_0&quot;,0.1)">Gato</div>'


// Lets us exit the game lmao
document.addEventListener("keydown", (event) => {
    if (event.code == "Escape") {
        document.exitPointerLock();
    }
})

// Settings Stuff
document.addEventListener("DOMContentLoaded", (event) => {
    ipcRenderer.send('preloadNeedSettings');
    
    // Changelogs
    const oldIcon = document.getElementById("updateAdIcon");
    const updateHolder = document.getElementById("updateAd");
    oldIcon.remove();
    const newIcon = document.createElement("img");
    newIcon.setAttribute("id", "helpPIcon");
    newIcon.setAttribute("src", "https://cdn.discordapp.com/attachments/661004708852269080/899301043672842250/settingIcon.png");
    updateHolder.insertBefore(newIcon, updateHolder.children[0]);
    const updateDetailText = document.getElementById("updateAdVersion");
    const HelpTextHoldersArray = document.querySelectorAll("#helpTxtHol");
    console.log(HelpTextHoldersArray);
    const updateDetailHolder = HelpTextHoldersArray[5];
    updateDetailText.remove();
    const newDetailText = document.createElement("div");
    newDetailText.setAttribute("id", "helpGuidOpn");
    newDetailText.innerHTML = "Gatoclient Updates";
    updateDetailHolder.appendChild(newDetailText);
    updateHolder.setAttribute("style", "display:block!important")

    // Changelogs Click Event
    const updateAdHolder = document.getElementById("updateAd");
    updateAdHolder.setAttribute("onclick", "showWindow(1)");
    updateAdHolder.addEventListener("click", (event) => {
        OpenChangelog();
    });

    // Swap
    ipcRenderer.send("swapFiles");

    // Removes end ads. I still left other ads in the game to not infringe on TOS
    document.querySelectorAll("#endAMerger").forEach((element) => { element.innerHTML = ''; } );

    const titleUpdate = setInterval(function () {
        if (!document.title.includes('Gatoclient')) {
            document.title = 'Gatoclient | ' + document.title;
        }
    }, 100);

    // Side Menu Settings Thing
    const settingsSideMenu = document.querySelectorAll('.menuItem')[6];
    settingsSideMenu.setAttribute("onclick", "showWindow(1);SOUND.play(`select_0`,0.15);window.windows[0].changeTab(0)");
    settingsSideMenu.addEventListener("click", (event) => {
        UpdateSettingsTabs(0);
    });
})

function OpenChangelog() {
    document.getElementById('menuWindow').setAttribute("style", "padding-top: 20px !important; overflow-y: auto; width: 1200px;");
    document.getElementById('menuWindow').innerHTML = `<link rel="stylesheet" href="https://creepycats.github.io/api/gatoclient/settings.css"> <div class="backgroundSettings"> <div class="titleHolder"> <img src="https://cdn.discordapp.com/attachments/901905234861883432/907024700880879686/0.png" class="titleImage" width="140" height="140"> <h3 class="title">Gatoclient Changelog</h3> </div> <div class="container"> <div id="content"> <form action=""> <div> <h2>General</h2> <p>CSS is now loaded via the Mod folder (THERE YOU GO LUKE)</p> <p>Disabled Sky color and old billboards cause Developers</p> <p>F8 Key now deletes the stupid ranked stream</p> <p>Tell me whether you want twitch integration or a keyboard overlay first</p> </div> <div> <h2>Fixes</h2> <p>Fixed CSS Loading Issues</p> <p>Fixed Stuck on Initializing...</p> </div> <div> <h2>Notice</h2> <p>Twitch integration soonTM</p> <p>Keyboard overlay integration soonTM</p> </div> </form> </div> </div> </div>`;
}

function UpdateSettingsTabs(activeTab) {
    // Settings Menu

    document.getElementById('settingsTabLayout').innerHTML = settingsHeader;
    ipcRenderer.send('settingsNeedSettings');

    const settingsTab = document.getElementById('settingsTabLayout').children[6];
    document.getElementById('menuWindow').setAttribute("style", "overflow-y: auto; width: 1200px;");

    settingsTab.addEventListener("click", (event) => {
        document.getElementById('settHolder').innerHTML = settingsMenuHTML;

        var form = document.getElementById("gatoclientsettings");

        form.addEventListener("change", function () {
            // Save Preferences/Settings
            var _inputs = document.getElementsByTagName('input');
            var _dropdowns = document.getElementsByTagName('select');
            var _preferences = {};
            for (var i = 0; i < _inputs.length; i++) {
                if (_inputs[i].className == 'switch_1' || _inputs[i].className == 'form__input' || _inputs[i].className == 'color' || _inputs[i].className == 'form__input color') {
                    if (_inputs[i].type == 'checkbox') {
                        _preferences[_inputs[i].name] = _inputs[i].checked;
                    }
                    else {
                        _preferences[_inputs[i].name] = _inputs[i].value;
                    }
                }
            };
            for (var i = 0; i < _dropdowns.length; i++) {
                if (_dropdowns[i].className == 'gatoSettingsDropdown') {
                    _preferences[_dropdowns[i].name] = _dropdowns[i].value;
                }
            };
            // Send data to be stored
            ipcRenderer.send('savedSettings', _preferences);
        });

        UpdateSettingsTabs(6);
    });

    const settingTabArray = document.getElementById('settingsTabLayout').children;
    for (let i = 0; i < settingTabArray.length; i++) {
        if (settingTabArray[i] != settingsTab) {
            settingTabArray[i].addEventListener("click", (event) => {
                UpdateSettingsTabs(i);
            });
        }
        if (i == activeTab) {
            settingTabArray[i].setAttribute('class', 'settingTab tabANew');
        }
    }

    document.getElementById('openBillboardEditor').addEventListener("click", (event) => {
        ipcRenderer.send('openBillboardEditor');
    });
}

ipcRenderer.on('settingsSettings', (event, preferences) => {
    // I do a sneaky and use the event to store the file path
    let filePath = preferences;
    let userPrefs = JSON.parse(fs.readFileSync(filePath));

    // Load the settings into the form
    for (let pref in userPrefs) {
        if (!!document.querySelector(`select[name="${pref}"]`)) {
            document.querySelector(`select[name="${pref}"]`).value = userPrefs[pref];
        }
        else {
            if (document.querySelector(`input[name="${pref}"]`).type == 'checkbox') {
                document.querySelector(`input[name="${pref}"]`).checked = userPrefs[pref];
            }
            else {
                document.querySelector(`input[name="${pref}"]`).value = userPrefs[pref];
            }
        }
    }
});

ipcRenderer.on('recaptchaFix', () => {
    ipcRenderer.send('logMainConsole', 'Fixing Recaptcha');
    // Recaptcha fix
    const lookforerror = document.querySelectorAll("div");
    for (var i = 0; i < lookforerror.length; i++) {
        if (lookforerror[i].innerHTML == 'Could not connect to the reCAPTCHA service. Please check your internet connection and reload to get a reCAPTCHA challenge.' || lookforerror[i].innerHTML == "Impossible d'établir une connexion avec le service reCAPTCHA. Veuillez vérifier votre connexion Internet, puis actualiser la page pour afficher une image reCAPTCHA.") {
            lookforerror[i].remove();
        }
    }
});

ipcRenderer.on('streamFix', () => {
    ipcRenderer.send('logMainConsole', 'Fixing Stream');
    // Recaptcha fix
    const lookforerror = document.querySelectorAll("#streamContainer");
    lookforerror.remove();
});

// When Settings are recieved run scripts
ipcRenderer.on('preloadSettings', (event, preferences, version, filedir) => {
    let filePath = preferences;
    let userPrefs = JSON.parse(fs.readFileSync(filePath));
    // Scripts
    
    // Sky color script: Thank you Janrex
    //if (userPrefs['skyColor'] == true) {
    //    Reflect.defineProperty(Object.prototype, "skyCol", {
    //        value: userPrefs['skyColorValue'],
    //    });
    //}

    // Billboard Script
    //if (userPrefs['billboard'] == true) {
    //    //let BBScript = (require("./scripts/customBB"));
    //    //BBScript();
    //    Object.defineProperty(Object.prototype, "billboard", {
    //        get() {
    //            return { txt: userPrefs['billboardText'], txtCol: userPrefs['bbTextColor'], bgCol: userPrefs['bbBackgroundColor'] }
    //        },
    //        set(v) {
    //        }
    //    });
    //}

    // Image Sky
    //if (userPrefs['imageSky'] == true) {
    //    Object.defineProperty(Object.prototype, 'lastEnvId', {
    //        get() {
    //            return -1;
    //        },
    //        set(v) {
    //        }
    //    });
    //    const s = setInterval(function () { window.changeEnvironment(-2, { sky: 6716054, skyDome: !0, skyDomeCol0: '#4A4A4A', skyDomeCol1: '#464646', skyDomeCol2: '#D3D3D3', skyDomeTex: !0, skyDomeTexA: 0 }); }, 1000);
    //}

    // Special Discord RPC script
    if (userPrefs['discordrpc'] == true) {
        const rpcScript = (require("./scripts/discord-rpc"));
        rpcScript();
    }

    // Lobby Switch
    if (userPrefs['autoFFA'] == true) {
        const lobbyScript = (require("./scripts/lobby-switch"));
        lobbyScript();
    }

    // Change Versions
    if (userPrefs['disableLogoCSS'] != true) {
        const versionText = document.getElementById('seasonLabel');
        versionText.innerHTML = '<span style="color:#ffb82d">V</span> ' + version;
    }

    // Settings button
    if (userPrefs['disableGatoButton'] != true) {
        // Settings Menu Thing
        const menuItem = document.createElement("div");
        menuItem.setAttribute("id", "gatoMenuItem");
        menuItem.setAttribute("class", "menuItem");
        menuItem.setAttribute("onclick", "showWindow(1)");
        menuItem.innerHTML = '<img class="material-icons-outlined menBtnIcn" src="https://cdn.discordapp.com/attachments/661004708852269080/899301043672842250/settingIcon.png" onmouseenter="playTick()">';
        const menuContainer = document.getElementById("menuItemContainer");
        menuContainer.appendChild(menuItem);

        // Add Menu Click Event
        menuItem.addEventListener("click", (event) => {
            document.getElementById('settHolder').innerHTML = settingsMenuHTML;

            ipcRenderer.send('settingsNeedSettings');

            var form = document.getElementById("gatoclientsettings");

            form.addEventListener("change", function () {
                // Save Preferences/Settings
                var _inputs = document.getElementsByTagName('input');
                var _dropdowns = document.getElementsByTagName('select');
                var _preferences = {};
                for (var i = 0; i < _inputs.length; i++) {
                    if (_inputs[i].className == 'switch_1' || _inputs[i].className == 'form__input' || _inputs[i].className == 'color' || _inputs[i].className == 'form__input color') {
                        if (_inputs[i].type == 'checkbox') {
                            _preferences[_inputs[i].name] = _inputs[i].checked;
                        }
                        else {
                            _preferences[_inputs[i].name] = _inputs[i].value;
                        }
                    }
                };
                for (var i = 0; i < _dropdowns.length; i++) {
                    if (_dropdowns[i].className == 'gatoSettingsDropdown') {
                        _preferences[_dropdowns[i].name] = _dropdowns[i].value;
                    }
                };
                // Send data to be stored
                ipcRenderer.send('savedSettings', _preferences);
            });

            UpdateSettingsTabs(6);
        });
    }
});

// CSS
ipcRenderer.on('injectCSS', (event, css) => {
    let s = document.createElement("style");
    s.setAttribute("class", "gatoclientCSS");
    s.setAttribute("id", "gatoclientCSS");
    s.innerHTML = css;
    document.getElementsByTagName("body")[0].appendChild(s);
});

// Badges
var elements = null;
ipcRenderer.on('badges', (event) => {
    const fetch = require('node-fetch');
    let settings = { method: "Get" };
    let url = "https://creepycats.github.io/api/gatoclient/badges.json";
    fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            const t = setInterval(function () { usernameIcons(json); }, 100);
        });
});

function usernameIcons(data) {
    const userData = data;
    // Hopefully this doesnt cause lag now
    // Dev Clan Color: #40C4FF
    elements = document.querySelectorAll(".leaderName, .leaderNameM, .newLeaderName, .newLeaderNameM, .newLeaderNameF, .menuClassPlayerName, .floatR, .endTableN");
    for (var i = 0; i < elements.length; i++) {
        // Menu Things
        if (!elements[i].firstElementChild) {
            for (let obj in userData) {
                if (userData[obj] instanceof Object) {
                    badgeTest(elements[i], userData[obj], 1);
                }
            }
        }
        // Match End Table
        if (elements[i].getAttribute("class") == "endTableN") {
            for (let obj in userData) {
                if (userData[obj] instanceof Object) {
                    badgeTest(elements[i], userData[obj], 2);
                }
            }
        }
        // Leaderboard
        if (elements[i].getAttribute("class") == "leaderName" || elements[i].getAttribute("class") == "leaderNameM" || elements[i].getAttribute("class") == "leaderNameF") {
            for (let obj in userData) {
                if (userData[obj] instanceof Object) {
                    badgeTest(elements[i], userData[obj], 3);
                }
            }          
        }
        // New Leaderboard
        if (elements[i].getAttribute("class") == "newLeaderName" || elements[i].getAttribute("class") == "newLeaderNameM" || elements[i].getAttribute("class") == "newLeaderNameF") {
            for (let obj in userData) {
                if (userData[obj] instanceof Object) {
                    badgeTest(elements[i], userData[obj], 3);
                }
            }
        }
    }
}

function badgeTest(element, user, type) {
    var accountName = user['accountName'];
    var badgeName = user['badge'];
    var clanName = user['clan'];
    if (user['hasPremiumName'] == true) {
        var premiumName = user['premiumName'];
        // Premium On
        if (type == 1) {
            if (element.innerHTML == accountName || element.innerHTML == premiumName) {
                element.setAttribute('id', badgeName);
            }
        }
        else if (type == 2) {
            if (element.getAttribute("href") == './social.html?p=profile&q=' + accountName) {
                element.setAttribute('id', badgeName);
            }
        }
        else if (type == 3) {
            if (element.innerHTML == accountName + '<span style="color:#fff"> ' + clanName + '</span>' || element.innerHTML == premiumName + '<span style="color:#fff"> ' + clanName + '</span>' || element.innerHTML == accountName + '<span style="color:#40C4FF"> ' + clanName + '</span>' || element.innerHTML == premiumName + '<span style="color:#40C4FF"> ' + clanName + '</span>') {
                element.setAttribute('id', badgeName);
            }
        }
    }
    else {
        // Premium Off
        if (type == 1) {
            if (element.innerHTML == accountName) {
                element.setAttribute('id', badgeName);
            }
        }
        else if (type == 2) {
            if (element.getAttribute("href") == './social.html?p=profile&q=' + accountName) {
                element.setAttribute('id', badgeName);
            }
        }
        else if (type == 3) {
            if (element.innerHTML == accountName + '<span style="color:#fff"> ' + clanName + '</span>' || element.innerHTML == accountName + '<span style="color:#40C4FF"> ' + clanName + '</span>') {
                element.setAttribute('id', badgeName);
            }
        }
    }
}

// Emotes
ipcRenderer.on('emotes', (event) => {
    const e = setInterval(Emotes, 100);
});

function Emotes() {
    // Find Latest
        //var x = document.querySelectorAll('.chatMsg')[i];
    var x = document.getElementById('chatList').lastChild.childNodes[0].lastChild;
        // x.setAttribute('id', x.innerHTML);

        // Emotes
        if (x.innerHTML == '‎bruhcat‎') {
            x.innerHTML = '&lrm;<img src="https://cdn.discordapp.com/emojis/859521142092333079.png?size=96" width="32" height="32">&lrm;';
        }
        if (x.innerHTML == '‎sheesh‎') {
            x.innerHTML = '&lrm;<img src="https://cdn.discordapp.com/emojis/776184047557804062.png?size=96" width="32" height="32">&lrm;';
        }
        if (x.innerHTML == '‎kek‎') {
            x.innerHTML = '&lrm;<img src="https://cdn.discordapp.com/emojis/793731121052909598.png?size=96" width="32" height="32">&lrm;';
        }
        if (x.innerHTML == '‎krunktwerk‎') {
            x.innerHTML = '&lrm;<img src="https://cdn.discordapp.com/emojis/861985132563267595.gif?size=96" width="32" height="32">&lrm;';
        }
        if (x.innerHTML == '‎xd‎') {
            x.innerHTML = '&lrm;<img src="https://cdn.discordapp.com/attachments/789269252779671603/903795195030691840/666140879488024587.png" width="32" height="32">&lrm;';
        }
        if (x.innerHTML == '‎smiledog‎') {
            x.innerHTML = '&lrm;<img src="https://cdn.discordapp.com/emojis/837689670023381062.png?size=96" width="32" height="32">&lrm;';
        }

        // Commands
        if (x.innerHTML == '‎/clear‎' && x.getAttribute('id') != 'command') {
            // Set as command
            x.setAttribute('id', 'command');
            // Clear chat
            document.getElementById('chatList').innerHTML = '';
            // Chat Message
            const chatHolder = document.getElementById("chatList");
            const message = document.createElement("div");
            message.setAttribute("class", "chatItem");
            message.innerHTML = '<span class="chatMsg" style="color:#30ffea">&lrm;Cleared Chat&lrm;</span>';
            chatHolder.appendChild(message);
        }
        if (x.innerHTML == '‎/help‎' && x.getAttribute('id') != 'command') {
            // Set as command
            x.setAttribute('id','command');
            // Chat Message
            // Help
            const chatHolder = document.getElementById("chatList");
            const message = document.createElement("div");
            message.setAttribute("id", "chatMsg_cmd");
            message.setAttribute("data-tab", "-1");
            message.innerHTML = '<div class="chatItem"><span class="chatMsg" style="color:#30ffea; text-decoration:underline;">&lrm;===Help===&lrm;</span></div>';
            chatHolder.appendChild(message);
            // /clear - Clears Chat
            const message2 = document.createElement("div");
            message2.setAttribute("id", "chatMsg_cmd");
            message2.setAttribute("data-tab", "-1");
            message2.innerHTML = '<div class="chatItem"><span class="chatMsg" style="color:#30ffea">&lrm;/clear - Clears Chat&lrm;</span></div>';
            chatHolder.appendChild(message2);
        }

}