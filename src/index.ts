import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState } from './components/AppState';

const events = new EventEmitter();
const api = new LarekApi(API_URL, CDN_URL);
const appData = new AppState({}, events);

api
	.getProductsList()
	.then(appData.addProducts.bind(appData))
	.catch((error) => {
		console.log('nasral oshibok', error);
	});


