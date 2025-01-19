import { IContactInfo, IProduct, TFormErrors } from "../types";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";

export class AppState extends Model<IProduct> {
    items: IProduct[] = [];
    preview: string;
    basket: IProduct[] = [];
    userData: IContactInfo = {};
    formErrors: TFormErrors = {};

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

    getUserData(): IContactInfo {
        return this.userData;
    }

    setPreview(card: IProduct) {
        this.preview = card.id;
        this.events.emit('preview:changed', card);
    }

    getCardById(id: string): IProduct {
        return this.items.find((item)=> item.id === id);
    }

    getBasket(): IProduct[] {
        return this.basket;
    }

    getIdProductsBasket() {
        return this.basket.map((item) => item.id);
    }

    addToBasket(id: string): void {
        this.basket.push(this.getCardById(id));
        this.events.emit('basket:changed', this.basket);
    }

    deleteFromBasket(id: string): void {
        this.basket = this.basket.filter((item) => item.id !== id);
        this.events.emit('basket:changed', this.basket);
    }

    hasProductInBasket(id: string): boolean {
        return this.basket.some((item) => item.id === id);
    }

    clearBasket(): void {
        this.basket = [];
        this.events.emit('basket:changed', this.basket);
    }

    getTotalBasket(): number {
        return this.basket.reduce((acc, item) => acc + item.price, 0);
    }

    getBasketCounter(): number {
        return this.basket.length;
    }

    getFormErrors() {
        return this.formErrors;
    }

    getPaymentField() {
        return this.userData.payment;
    }

    fillContactInfo(field: keyof IContactInfo, value: string): void {
        this.userData[field] = value;
        if (this.validateContact()) {
            this.events.emit('purchase:ready', this.userData)
        }
    }

    validateContact(): boolean {
        const  errors: typeof this.formErrors = {};
        if (!this.userData.payment) {
            errors.payment = 'Укажите способ оплаты';
        }
        if (!this.userData.address) {
            errors.address = 'Укажите адрес';
        }
        if (!this.userData.email) {
            errors.email = 'Укажите адрес электронной почты';
        }
        if (!this.userData.phone) {
            errors.address = 'Укажите номер телефона';
        }
        this.formErrors = errors;
        this.events.emit('input:error', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    reset() {
        this.userData = {
            payment: '',
            address: '',
            email: '',
            phone: ''
        };
        this.formErrors = {}
        this.events.emit('input:error', this.formErrors);
    }
}