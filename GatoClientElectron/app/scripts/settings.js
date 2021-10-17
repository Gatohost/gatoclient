const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');
const DiscordRpc = require("discord-rpc");
const os = require('os');
const { app, ipcMain, BrowserWindow, screen } = electron;

document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById('saveValues').addEventListener('click', function (e) { // Save values
        e.preventDefault();
        var _inputs = document.getElementsByTagName('input');
        var _preferences = {};
        for (var i = 0; i < _inputs.length; i++) {
            if (_inputs[i].type == 'checkbox') {
                _preferences[_inputs[i].name] = _inputs[i].checked;
            }
            else {
                _preferences[_inputs[i].name] = _inputs[i].value;
            }
        };
        ipcRenderer.send('savedSettings', _preferences);
    })
})

const { ipcRenderer } = require('electron');
ipcRenderer.on('settingsSettings', (event, preferences) => {
    let filePath = preferences;
    let userPrefs = JSON.parse(fs.readFileSync(filePath));

    for (let pref in userPrefs) {
        if (document.querySelector(`input[name="${pref}"]`).type == 'checkbox') {
            document.querySelector(`input[name="${pref}"]`).checked = userPrefs[pref];
        }
        else {
            document.querySelector(`input[name="${pref}"]`).value = userPrefs[pref];
        }
    }
});

