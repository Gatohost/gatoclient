const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { shell } = require('electron');
const DiscordRpc = require("discord-rpc");
const os = require('os');
const { app, ipcMain, BrowserWindow, screen } = electron;

// Splash stuff
document.addEventListener("DOMContentLoaded", (event) => {
    // Request Info
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('splashNeedInfo');
})

// When Version Info Recieved
const { ipcRenderer } = require('electron');
ipcRenderer.on('splashInfo', (event, preferences) => {
    document.getElementById('version').textContent = "V" + preferences;
    document.getElementById('details').textContent = "Checking for updates...";
});
ipcRenderer.on('newVersion', (event) => {
    document.getElementById('details').textContent = "Update Found!";
});
ipcRenderer.on('latest', (event) => {
    document.getElementById('details').textContent = "Latest Version :D";
});
ipcRenderer.on('havefun', (event) => {
    document.getElementById('details').textContent = "Have Fun :D";
});