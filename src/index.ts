import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState } from './components/AppState';
import { IContactInfo, IOrderResponse, IProduct, TCategory } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success, ISuccess } from './components/common/Success';
import { CardBasket, CardPage, CardPreview } from './components/Card';

const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);
const appState = new AppState({}, events);

const successTemp = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemp = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemp = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemp = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemp = ensureElement<HTMLTemplateElement>('#basket');
const orderTemp = ensureElement<HTMLTemplateElement>('#order');
const contactsTemp = ensureElement<HTMLTemplateElement>('#contacts');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemp), events);
const order = new Order(cloneTemplate<HTMLFormElement>(orderTemp), events);
const contacts = new Contacts(cloneTemplate<HTMLFormElement>(contactsTemp), events);
const success = new Success(cloneTemplate(successTemp), { onClick: () => {
		modal.close();
	}
});

api
	.getProductsList()
	.then(appState.addProducts.bind(appState))
	.catch((error) => {
		console.error('Ошибка при получении продуктов:', error);
	});

    events.on('items:changed', () => {
		page.gallery = appState.getProducts().map((item) => {
			const card = new CardPage(cloneTemplate(cardCatalogTemp), {
				onClick: () => events.emit('item:selected', item)
			});
			return card.render({
				id: item.id,
				image: api.cdn + item.image,
				title: item.title,
				category: item.category as TCategory,
				price: item.price
			});
		});
	});

	events.on('item:selected', (item: IProduct) => {
		appState.setPreview(item);
	});

	events.on('preview:changed', (item: IProduct) => {
		const productInBasket = appState.hasProductInBasket(item.id)
		const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemp), {
			onClick: () => {
				if(productInBasket) {
					events.emit('basket:delete', item);
				} else {
					events.emit('item:moved', item);
				}
				modal.close();
		}
	});

	modal.render({
		content: cardPreview.render({
			id: item.id,
			description: item.description,
			image: api.cdn + item.image,
			title: item.title,
			category: item.category as TCategory,
			price: item.price,
			button: productInBasket ? 'Удалить из корзины' : 'В корзину',
		})
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
})

events.on('item:moved', (item: IProduct) => {
	appState.addToBasket(item.id);
});

events.on('basket:changed', () => {
	page.counter = appState.getBasketCounter();
	basket.total = appState.getTotalBasket();
	basket.list = appState.getBasket().map((item, index) => {
		const cardBasket = new CardBasket(cloneTemplate(cardBasketTemp), {
			onClick: () => events.emit('basket:delete', item)
		});

		return cardBasket.render({
			index: index + 1,
			title: item.title,
			price: item.price
		});
	});
});

events.on('basket:opened', () => {
	modal.render({
		content: basket.render({})
	});
});

events.on('basket:delete', (item: IProduct) => {
	appState.deleteFromBasket(item.id);
});

events.on('order:opened', () => {
	appState.reset();
	const userInfo = appState.getUserData();
	modal.render({
		content: order.render({
			valid: false,
			errors: [],
			address: userInfo.address,
			payment: userInfo.payment
		})
	});
});

events.on('input:error', (errors: Partial<IContactInfo>) => {
	const { payment, address, email, phone } = errors;
	order.valid = !payment && !address;
	contacts.valid = !email && !phone;
	order.errors = Object.values({ payment, address })
	    .filter((i) => !!i)
		.join('; ');
	contacts.errors = Object.values({ email, phone })
	    .filter((i) => !!i)
		.join('; ');
    order.payment = appState.getPaymentField();
});

events.on('input:change', (data: { field: keyof IContactInfo; value: string }) => {
	appState.fillContactInfo(data.field, data.value);
});

events.on('order:submit', () => {
	contacts.clear();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: []
		})
	});
});

events.on('contacts:submit', () => {
	const orderData = appState.getUserData();
	const products = appState.getIdProductsBasket();
	const payload: IOrderResponse = {
		payment: orderData.payment,
		address: orderData.address,
		email: orderData.email,
		phone: orderData.phone,
		total: appState.getTotalBasket(),
		items: products
	};
	
	api
	    .postOrder(payload)
		.then((result) => {
			events.emit('order:success', result);
		})
		.catch((error) => {
			console.error('Ошибка отправки заказа:', error);
		});
});

events.on('order:success', (result: ISuccess) => {
	modal.render({
		content: success.render ({
			total: result.total
		})
	});
	appState.clearBasket();
});