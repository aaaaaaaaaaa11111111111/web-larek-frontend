import { createElement, ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { IEvents } from "./base/events";

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    _total: HTMLElement;
    basketList: HTMLElement;
    button: HTMLElement;
    
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list');
        this._total = ensureElement<HTMLElement>('.basket__price');
        this.button = this.container.querySelector('.basket__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
            this.button.removeAttribute('disabled');
        } else {
            this.basketList.replaceChildren(createElement<HTMLElement>('p', {textContent: 'Корзина пуста'}));
            this.button.setAttribute('disabled', 'disabled');
        }
    }

    set total(total: number) {
        this.setText(this._total, `${total} синапсов`);
    }
}