import Dexie, { type EntityTable } from 'dexie';
import type {
	CreditModel,
	Expenses,
	Nosil,
	Oil,
	OliSalesModel,
	Price,
	SaleModel,
	Staff,
	Stock,
	UserAccount
} from './model';
import { browser } from '$app/environment';
import 'dexie-observable';

const db = new Dexie('petromax') as Dexie & {
	userAccount: EntityTable<UserAccount, 'id'>;
	price: EntityTable<Price, 'id'>;
	staff: EntityTable<Staff, 'id'>;
	nosil: EntityTable<Nosil, 'id'>;
	stock: EntityTable<Stock, 'id'>;
	expenses: EntityTable<Expenses, 'id'>;
	credit: EntityTable<CreditModel, 'id'>;
	sales: EntityTable<SaleModel, 'id'>;
	oilsales: EntityTable<OliSalesModel, 'id'>;
	oil: EntityTable<Oil, 'id'>;
};

// Schema declaration:
db.version(1).stores({
	userAccount: '++id, email, name, password,[email+password]',
	staff: '++id, name, status',
	price: '++id, petrol,deisel',
	nosil: '++id, type, name,[type+name]',
	stock: '++id, stockDate, type,[stockDate+type]',
	sales: '++id, salesDate, employeeName,[salesDate+employeeName]',
	oilsales: '++id, salesDate, employeeName,[salesDate+employeeName]',
	expenses: '++id, title, createdOn',
	credit: '++id, vehicle, phoneNumber,[vehicle+type],createdOn',
	oil: '++id, name,size, unitPrice,createdOn'
});

db.transaction('rw', db.price, function (price) {
	console.log('wrote');
});

db.on('changes', function (changes) {
	if ((window as any).electron) (window as any).electron.syncDatabase(changes);
});

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
