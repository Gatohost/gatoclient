const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');
const DiscordRpc = require("discord-rpc");
const os = require('os');
const { app, ipcMain, BrowserWindow, screen } = electron;

// Settings Window Script

// When Settings Window Loads
document.addEventListener("DOMContentLoaded", (event) => {
    // Add Click Event for Save Button
    document.getElementById('saveValues').addEventListener('click', function (e) { 
        // Prevent any event that may happen normally
        e.preventDefault();

        // Save Preferences/Settings
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
        // Send data to be stored
        ipcRenderer.send('savedSettings', _preferences);
    })
})

// When Settings window loads, settings are sent here to be loaded into the window
const { ipcRenderer } = require('electron');
ipcRenderer.on('settingsSettings', (event, preferences) => {
    // I do a sneaky and use the event to store the file path
    let filePath = preferences;
    let userPrefs = JSON.parse(fs.readFileSync(filePath));

    // Load the settings into the form
    for (let pref in userPrefs) {
        if (document.querySelector(`input[name="${pref}"]`).type == 'checkbox') {
            document.querySelector(`input[name="${pref}"]`).checked = userPrefs[pref];
        }
        else {
            document.querySelector(`input[name="${pref}"]`).value = userPrefs[pref];
        }
    }
});

