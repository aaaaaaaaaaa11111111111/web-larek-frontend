export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IProductData {
  total: number;
	items: IProduct[];
}

export interface IContactInfo {
  payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrderResponse extends IContactInfo {
  total: number;
  items: string;
}

export interface IOrderData {
	items: HTMLElement[];
	total: number;
}