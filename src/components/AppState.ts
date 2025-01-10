import { IContactInfo, IProduct, FormErrors } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class AppState extends Model<IProduct> {
    items: IProduct[] = [];
    preview: string;
    basket: IProduct[] = [];
    userData: IContactInfo = {};
    formErrors: FormErrors = {};

    constructor(data: Partial<IProduct>, events: IEvents) {
        super(data, events);
        this.userData = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
    }

    addProducts(cards: IProduct[]) {
        this.items = cards;
        this.events.emit('items:changed');
    }

    getProducts(): IProduct[] {
        return this.items;
    }
}