import Dexie, { type EntityTable } from 'dexie';
import type { Product, ProductMargin, ProductStock, UserAccount } from './model';
import { browser } from '$app/environment';
import 'dexie-observable';
import dexieCloud from 'dexie-cloud-addon';

const db = new Dexie('easypos', { addons: [dexieCloud] }) as Dexie & {
	userAccount: EntityTable<UserAccount, 'id'>;
	product: EntityTable<Product, 'id'>;
	productMargin: EntityTable<ProductMargin, 'id'>;
	productStock: EntityTable<ProductStock, 'id'>;
};

// Schema declaration:
db.version(1).stores({
	userAccount: '@id, email, name, password,[email+password]',
	product: '@id, createdOn, name',
	productMargin: '@id, createdOn, name',
	productStock: '@id, createdOn, name,purchasedOn'
});

db.cloud.configure({
	databaseUrl: 'https://zm8024r62.dexie.cloud',
	requireAuth: true // optional
});

// db.on('changes', function (changes) {
// 	// if ((window as any).electron) (window as any).electron.syncDatabase(changes);
// });

export const persist = async () => {
	if (browser) {
		console.log('setting persistence...');
		return (await navigator.storage) && navigator.storage.persist && navigator.storage.persist();
	}
	return {};
};

export const isStoragePersisted = async () => {
	if (browser) {
		console.log('checking persistence...');
		return (
			(await navigator.storage) && navigator.storage.persisted && navigator.storage.persisted()
		);
	}
	return {};
};
export { db };
