import { DateFormatter } from '@internationalized/date';
import { toNumber } from '../lib/utils';

export interface UserAccount {
	id: string;
	name: string;
	email: string;
	password: string;
}

export const df = new DateFormatter('en-US', {
	dateStyle: 'long'
});
export type Unit = 'gram' | 'meter' | 'kilograms' | 'pieces' | 'liter';

export const parseUnit = (value: string): Unit => {
	const validUnits: Unit[] = ['gram', 'meter', 'kilograms', 'pieces', 'liter'];
	return validUnits.includes(value as Unit) ? (value as Unit) : 'gram';
};
export interface ProductDetails {
	product: Product;
	stock: ProductStock;
	margin: ProductMargin;
}

export interface Product {
	id?: string;
	name: string;
	code: string;
	unit: Unit;
	createdOn: Date;
	updatedOn: Date;
}

export interface ProductStock extends Product {
	purchaseRate: number;
	quantity: number;
	purchasedOn: Date;
	remainingQty: number;
}

export interface StockOverview extends Product {
	averagePrice: number;
	currentQuantity: number;
	totalValue: number;
	productId: string;
}

export class StockOverviewClass implements StockOverview {
	averagePrice: number = 0;
	currentQuantity: number = 0;
	totalValue: number = 0;
	productId: string = '';
	id?: string | undefined = undefined;
	name: string = '';
	code: string = '';
	unit: Unit = 'gram';
	createdOn: Date = new Date();
	updatedOn: Date = new Date();

	constructor({
		id = undefined,
		name = '',
		code = '',
		unit = 'gram',
		createdOn = new Date(),
		updatedOn = new Date(),
		averagePrice = 0,
		currentQuantity = 0,
		totalValue = 0,
		productId = ''
	}: {
		id?: string;
		name?: string;
		code?: string;
		unit?: Unit;
		createdOn?: Date;
		updatedOn?: Date;
		averagePrice?: number;
		currentQuantity?: number;
		totalValue?: number;
		productId?: string;
	} = {}) {
		this.id = id;
		this.name = name;
		this.code = code;
		this.unit = unit;
		this.createdOn = createdOn;
		this.updatedOn = updatedOn;
		this.averagePrice = averagePrice;
		this.currentQuantity = currentQuantity;
		this.totalValue = totalValue;
		this.productId = productId;
	}
}

export interface ProductMargin {
	id?: string;
	stockOverview: string;
	margin: number;
	marginType: 'Percent' | 'Price';
	stock: StockOverview | undefined;
}
