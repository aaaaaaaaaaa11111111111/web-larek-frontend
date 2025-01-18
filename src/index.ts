import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState } from './components/AppState';
import { IProduct, TCategory } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { Success } from './components/common/Success';
import { CardPage } from './components/Card';

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

// .then((products: IProduct[]) => {
// 	console.log('poluchili ot api:', products);

// 	appState.addProducts(products);

// 	console.log('get produtbI for pokushat:', appState.getProducts());

// 	if(products.length > 0) {
// 		const first = products[0];

// 		appState.setPreview(first);
// 		console.log('posmaret:', appState.preview);

// 		console.log('toje smaret po nomery:', appState.getCardById('6a834fb8-350a-440c-ab55-d0e9b959b6e3'))

// 		appState.addToBasket(first.id);
// 		console.log('smotrim che pokupaem:', appState.getBasket());

// 		console.log('skoka nabral:', appState.getBasketCounter());
// 		console.log('skoka stoit:', appState.getTotalBasket());
		
// 		console.log('chekaem korzinu id:', appState.getIdProductsBasket());
// 		// appState.deleteFromBasket(first.id);
// 		// console.log('ny i ceni y vas:', appState.getBasket());

// 		console.log('chet vzyali?:', appState.hasProductInBasket('6a834fb8-350a-440c-ab55-d0e9b959b6e3'));

// 		console.log('oshibochka', appState.getFormErrors())
// 	}
// })