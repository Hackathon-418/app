import { app, BrowserWindow, Menu } from "electron";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
    global.__static = require("path")
        .join(__dirname, "/static")
        .replace(/\\/g, "\\\\");
}

const winURL =
    process.env.NODE_ENV === "development"
        ? `http://localhost:9080`
        : `file://${__dirname}/index.html`;

let mainWindow;
function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        useContentSize: true,
        titleBarStyle: "hidden",
        frame: true,
        transparent: true,
        vibrancy: "dark",
        show: false,
    });
    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    // メニューバーを非表示に
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(winURL);

    // タイトル設定
    mainWindow.setTitle('ChatHub');

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

let subWindow;
function createSubWindow() {
    /**
     * Initial window options
     */
    subWindow = new BrowserWindow({
        width: 500,
        height: 360,
        useContentSize: true,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        vibrancy: "dark",
        focusable: false,
        resizable: false,
        show: false
        // hasShadow: false,
    });

    subWindow.loadURL(winURL + "#/hint");

    subWindow.on("closed", () => {
        mainWindow = null;
    });

    // subWindow.setIgnoreMouseEvents(true)
}

app.on("ready", createWindow);
app.on("ready", createSubWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
    if (subWindow === null) {
        subWindow();
    }
});

// メインプロセスでやりとりするipcMain
const { ipcMain } = require("electron");

ipcMain.on("candidateList", (event, list) => {
    subWindow.webContents.send("candidateList", list);
});

ipcMain.on("inputBlock", (event, block) => {
    mainWindow.webContents.send("inputBlock", block);
});

ipcMain.on("setSubWindowBounds", (event, r) => {
    const a = mainWindow.getPosition()
    subWindow.setPosition(Math.ceil(r.x + a[0] - 7), Math.ceil(r.y + a[1] + 26));
});

ipcMain.on("setSubWindowSize", (event, r) => {
    subWindow.setSize(Math.ceil(r.width), Math.ceil(r.height));
});

ipcMain.on("onfocus", event => {
    subWindow.showInactive()
});

ipcMain.on("onblur", event => {
    subWindow.hide()
});
