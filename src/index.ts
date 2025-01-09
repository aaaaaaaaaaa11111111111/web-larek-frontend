import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);

api
	.getProductsList()
	.then((products) => {
		console.log('products list:', products);
	})
	.catch((error) => {
		console.log('nasral oshibok', error);
	});
