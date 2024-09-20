const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
	syncDatabase: (data) => ipcRenderer.send('sync-database', data),
	onSyncDatabaseResponse: (callback) =>
		ipcRenderer.on('sync-database-response', (event, response) => callback(response))
});
