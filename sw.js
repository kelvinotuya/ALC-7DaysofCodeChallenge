importScripts('/js/idb.js');

const CACHE_STATIC_NAME = 'static-cache-v4';
const CACHE_DYNAMIC_NAME = 'dynamic-v5';

const dbPromise = idb.open('currency-db', 1, function (db) {
	if (!idb.objectStoreNames.contains('currencies')) {
		db.creatObjectStore('currencies', { keyPath: 'id' });
	}
});
self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Installed');

	e.waitUntil(
		caches.open(CACHE_STATIC_NAME).then(function(cache) {
			console.log("[ServiceWorker] Precaching App Shell");
			return cache.addAll([
				'/',
				'/index.html',
				'/js/script.js',
				'/css/style.css',
				'/js/idb.js',
				'/js/index.js',
				'/js/promise.js',
				'/js/fetch.js',
				'https://fonts.googleapis.com/css?family=Roboto:400,700'
			]);
		})
	)
})


self.addEventListener('activate', function (e) {
	console.log("[ServiceWorker] Activated", e);

	e.waitUntil(
	
		caches.keys().then(function (keyList) {
			return Promise.all(keyList.map(function (key) {

				if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
					console.log("[ServiceWorker] Removing old cache. ", key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

// function isInArray(string, array) {
// 	for (let i = 0; i < array.length; i++) {
// 		if (array[i] === string) {
// 			return true;
// 		}
// 	}
// 	return false;
// }

self.addEventListener('fetch', function (e) {
	// console.log("[ServiceWorker] Fetching", e.request.url);
	const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
	if (e.request.url.indexOf(url) > -1) {
		e.respondWith(fetch(e.request)
			.then(function (res) {
				const clonedRes = res.clone();
				clonedRes.json()
					.then(function (data) {
						for (let key in data) {
							dbPromise
								.then(function (db) {
									const tx = db.transaction('currencies', 'readwrite');
									const currencies = tx.objectStore('currencies');
									store.put(data[key]);
									return tx.complete;
								});
						}
					});
				return res;
			})
		);
	// }
	// else if (isInArray(et.request.url, CACHE_STATIC_NAME)) {
	// 	e.respondWith(
	// 		caches.match(e.request)
	// 	);
	} else {
		e.respondWith(
			caches.match(e.request).then(function (response) {
				if (response) {
					return response;
				} else {
					return fetch(e.request)
						.then(function (res) {
							caches.open(CACHE_DYNAMIC_NAME)
								.then(function (cache) {
									cache.put(e.request.url, res.clone());
									return res;
								});
						})
						.catch(function (err) {
							
						});
				}
			})
		);

	}
});