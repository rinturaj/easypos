import { db } from '../database/db';
import { importStatus } from './component.store';

export class DataImport {
	static async import(file: File) {
		console.log(file);

		const json = await DataImport.readFile(file);
		console.log(json);

		const keys = Object.keys(json);
		console.log(keys);
		let progress = 0;

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			let value = json[key];
			console.log(value);

			const keysplit = key.split('-');
			const id = Number(keysplit.pop());
			const table = keysplit.pop();
			value = { ...value, id };
			console.log(value, keysplit, table, id);

			progress = ((i + 1) * 100) / keys.length;
			console.log(progress);

			importStatus.set(progress);
			switch (table) {
				case 'staff':
					db.staff.put(value);
					break;
				case 'nosil':
					db.nosil.put(value);
					break;
				case 'price':
					db.price.put(value);
					break;
				case 'stock':
					db.stock.put(value);
					break;
				case 'expenses':
					db.expenses.put(value);
					break;
				case 'credit':
					db.credit.put(value);
					break;
				case 'sales':
					db.sales.put(value);
					break;
			}
		}
		return 100; // Return 100% when all keys are processed
	}

	static readFile(file: File): Promise<any> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e: any) => resolve(JSON.parse(e.target.result));
			reader.onerror = reject;
			reader.readAsText(file);
		});
	}
}
