// 导入app、BrowserWindow模块
// app 控制应用程序的事件生命周期。事件调用app.on('eventName', callback)，方法调用app.functionName(arg)
// BrowserWindow 创建和控制浏览器窗口。new BrowserWindow([options]) 事件和方法调用同app
// Electron参考文档 https://www.electronjs.org/docs
const { app, BrowserWindow, nativeImage } = require('electron');
const child_process = require('child_process');
const { profile } = require('console');
const path = require('path');
const exec = child_process.exec;
let openExec;
// const url = require('url');
// const path = require('path');

function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 800, // 窗口宽度
    height: 600, // 窗口高度
    title: "Electron", // 窗口标题,如果由loadURL()加载的HTML文件中含有标签<title>，该属性可忽略
    icon: nativeImage.createFromPath('src/public/favicon.ico'), // "string" || nativeImage.createFromPath('src/image/icons/256x256.ico')从位于 path 的文件创建新的 NativeImage 实例
    webPreferences: { // 网页功能设置
      nodeIntegration: true, // 是否启用node集成 渲染进程的内容有访问node的能力
      webviewTag: true, // 是否使用<webview>标签 在一个独立的 frame 和进程里显示外部 web 内容
      webSecurity: false, // 禁用同源策略
      nodeIntegrationInSubFrames: true, // 是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
      profile: path.join(__dirname, 'preload.js')
    }
  });

  //屏蔽electron默认顶部菜单
  // mainWindow.setMenu(null);



  //监听键盘f12事件
  mainWindow.on('keydown', (event) => {
    debugger
    if (event.key === 'F12') {
      //如果打开了控制台，则关闭控制台
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow.webContents.openDevTools();
      }
    }
  });

  // 加载应用 --打包react应用后，__dirname为当前文件路径
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, './build/index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));

  //创建子进程运行server.js
  openExec = exec('node ./server.js', (error, stdout, stderr) => {
    if (error) {
      console.log(error.stack);
      console.log('Error code: ' + error.code);
      return;
    }
    console.log('使用exec方法输出: ' + stdout);
    console.log(`stderr: ${stderr}`);
    console.log(process.pid)
  })


  // 加载应用 --开发阶段  需要运行 npm run start
  mainWindow.loadURL('http://localhost:3000/');

  // 解决应用启动白屏问题
  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // 当窗口关闭时发出。在你收到这个事件后，你应该删除对窗口的引用，并避免再使用它。
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    // 判断openExec是否存在，存在就杀掉node进程
    if (!openExec) {
      // console.log('openExec is null')
    } else {
      exec('taskkill /f /t /im node.exe', function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          console.log('Error code: ' + error.code);
          return;
        }
        console.log('使用exec方法输出: ' + stdout);
        console.log(`stderr: ${stderr}`);
      });
    }
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});