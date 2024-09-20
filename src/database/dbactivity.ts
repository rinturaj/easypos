import { db } from './db';

export class LoginApi {
	static async login(email: string, password: string) {
		let user = await db.userAccount.where({ email: email, password: password }).first();
		console.log(user);

		if (!!user) {
			return true;
		}

		return false;
	}
}

export class PriceApi {
	static async add(petrol: number, deisel: number) {
		let result = await db.price.put({
			id: 1,
			diesel: deisel,
			petrol: petrol,
			updatedOn: new Date()
		});
		return result;
	}
}
