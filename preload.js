window._ipcRenderer = require('electron').ipcRenderer;
window._remote = require('electron').remote;
window._platform = process.platform;
window.addEventListener('keydown', e => {
  console.log('来自preload的监听', e)
  const { altKey, ctrlKey, metaKey, keyCode } = e;
  if (altKey && ctrlKey && metaKey && keyCode === 68) {
    const currentWindow = require('electron').remote.getCurrentWindow();
    currentWindow && currentWindow.toggleDevTools();
    e.preventDefault();
  }
}, false);