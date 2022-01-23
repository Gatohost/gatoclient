const { ipcRenderer } = require('electron');
require('v8-compile-cache');

// CSS
ipcRenderer.on('injectCSS', (event, css) => {
    let s = document.createElement("style");
    s.setAttribute("class", "gatoclientCSS");
    s.setAttribute("id", "gatoclientCSS");
    s.innerHTML = css;
    document.getElementsByTagName("body")[0].appendChild(s);
});