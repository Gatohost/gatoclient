const {ipcRenderer} = require('electron')

module.exports = () => {
  const runRpc = () => {
    const dat = (() => {
      try {
        return window.getGameActivity()
      } catch (excp) {
        console.error(excp)
        return {}
      }
    })()
    ipcRenderer.invoke("rpc-activity", dat)
  };
  runRpc();
  setInterval(() => {runRpc()}, 15e3)
}
