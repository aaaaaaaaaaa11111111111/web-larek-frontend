import { IProduct, TCategory } from '../types';
import { categoryList } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
		this._button = container.querySelector('.card__button');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set button(value: string) {
		if(this._button) {
			this._button.textContent = value;
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	set price(value: string) {
		if(value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
		if(this._button) {
			this._button.disabled = !value;	
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
}

export class CardPage extends Card {
	_image: HTMLImageElement;
	_category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: TCategory) {
		this.setText(this._category, value);
		this.toggleClass(this._category, categoryList[value], true);
	}
}

export class CardPreview extends CardPage {
    _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        this._description = ensureElement<HTMLElement>('.card__text', container);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }
}

export class CardBasket extends Card {
    private _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container, actions);

        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}
