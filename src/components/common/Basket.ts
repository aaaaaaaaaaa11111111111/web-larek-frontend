import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IBasketView {
    list: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    basketList: HTMLElement;
    basketTotal: HTMLElement;
    button: HTMLElement;
    
    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.basketTotal = ensureElement<HTMLElement>('.basket__price', this.container);
        this.button = this.container.querySelector('.basket__button');

        if (this.button) {
            this.button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }

        this.list = [];
    }

    set list(items: HTMLElement[]) {
        if (items.length) {
            this.basketList.replaceChildren(...items);
            this.button.removeAttribute('disabled');
        } else {
            this.basketList.replaceChildren(createElement<HTMLElement>('p', {textContent: 'Корзина пуста'}));
            this.button.setAttribute('disabled', 'disabled');
        }
    }

    set total(total: number) {
        this.setText(this.basketTotal, `${total} синапсов`);
    }
}