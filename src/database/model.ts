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
}

export interface ProductMargin {
	id: string;
	productId: string;
	createdOn: Date;
	updatedOn: Date;
	margin: number;
	marginType: 'Percent' | 'Price';
}
