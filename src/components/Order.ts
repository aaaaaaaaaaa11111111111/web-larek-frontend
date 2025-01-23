import { IContactInfo } from "../types";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";

export class Order extends Form<IContactInfo> {
    protected cashButton: HTMLButtonElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.cashButton = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('.button_alt[name=card]', container);

        this.cashButton.addEventListener('click', ()=> {
            this.onInputChange('payment', 'cash');
        });
        this.cardButton.addEventListener('click', ()=> {
            this.onInputChange('payment', 'card');
        });
    }

    set payment(value: string) {
        this.cashButton.classList.toggle('.button_alt-active', value === 'cash');
        this.cardButton.classList.toggle('.button_alt-active', value === 'card');
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}