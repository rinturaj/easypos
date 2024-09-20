const { app, BrowserWindow, contextBridge, ipcMain, ipcRenderer } = require('electron');
const path = require('node:path'); // Change this line
const { FSDB } = require('file-system-db');

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1366,
		height: 768,
		alwaysOnTop: false,
		autoHideMenuBar: false,
		frame: true,
		fullscreen: false,
		webPreferences: {
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, 'preload.cjs') // Use a preload script
		}
	});

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null;
		app.quit();
	});

	// mainWindow.loadURL('https://rinturaj.github.io/petromax/');
	mainWindow.loadURL('http://localhost:5173/');
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// sync the indexDb with file system

// IPC listener
ipcMain.on('sync-database', (event, arg) => {
	// console.log(arg); // Log the argument received from Svelte
	try {
		const desktopPath = app.getPath('documents');
		arg.forEach((change) => {
			const db = new FSDB(`${desktopPath}/petromax/${change.table}.json`, false);
			switch (change.type) {
				case 1: // CREATED
					db.set(`${change.table}-${change.key}`, change.obj);
					break;
				case 2: // UPDATED
					db.set(`${change.table}-${change.key}`, change.mods);
					break;
				case 3: // DELETED
					db.delete(`${change.table}-${change.key}`);
					break;
			}
		});
	} catch (error) {
		console.error('Error occurred:', error);
	}

	event.reply('sync-database-response', {
		status: 'Synced ✅',
		time: new Date()
	});
});
