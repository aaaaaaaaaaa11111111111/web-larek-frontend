import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState } from './components/AppState';
import { IProduct } from './types';

const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);
const appState = new AppState({}, events);


api.getProductsList()
.then((products: IProduct[]) => {
	console.log('poluchili ot api:', products);

	appState.addProducts(products);

	console.log('get produtbI for pokushat:', appState.getProducts());

	if(products.length > 0) {
		const first = products[0];

		appState.setPreview(first);
		console.log('posmaret:', appState.preview);

		console.log('toje smaret po nomery:', appState.getCardById('6a834fb8-350a-440c-ab55-d0e9b959b6e3'))

		appState.addToBasket(first.id);
		console.log('smotrim che pokupaem:', appState.getBasket());

		console.log('skoka nabral:', appState.getBasketCounter());
		console.log('skoka stoit:', appState.getTotalBasket());
		
		console.log('chekaem korzinu id:', appState.getIdProductsBasket());
		// appState.deleteFromBasket(first.id);
		// console.log('ny i ceni y vas:', appState.getBasket());

		console.log('chet vzyali?:', appState.hasProductInBasket('6a834fb8-350a-440c-ab55-d0e9b959b6e3'));

		console.log('oshibochka', appState.getFormErrors())
	}
})
.catch((error) => {
	console.error('Ошибка при получении продуктов:', error);
});