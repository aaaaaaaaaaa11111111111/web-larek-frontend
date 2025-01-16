import { Api, ApiListResponse } from './base/api';
import { IProduct, IOrderResponse } from '../types/index';

export class LarekApi extends Api {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		
		this.cdn = cdn;
	}

	getProductsList() {
		return this.get('/product').then((data: ApiListResponse<IProduct>) => {
			return data.items.map((item) => ({ ...item }));
		});
	}

	postOrder(order: IOrderResponse) {
		return this.post('/order', order).then((data: IOrderResponse) => data);
	}
}
