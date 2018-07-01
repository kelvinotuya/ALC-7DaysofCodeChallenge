importScripts('./idb.js');
importScripts('./index.js');

const CACHE_STATIC_NAME = 'static-cache-v4';
const CACHE_DYNAMIC_NAME = 'dynamic-v5';


self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Installed');

	e.waitUntil(
		caches.open(CACHE_STATIC_NAME).then(function(cache) {
			console.log("[ServiceWorker] Precaching App Shell");
			return cache.addAll([
				'/',
				'./index.html',
				'./script.js',
				'./style.css',
				'./idb.js',
				'./index.js',
				'./promise.js',
				'./fetch.js',
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


self.addEventListener('fetch', function (e) {
	//console.log("[ServiceWorker] Fetching", e.request.url);
	const url = 'https://free.currencyconverterapi.com/api/v5/convert?q=${keys}';
	if (e.request.url.indexOf(url) > -1) {
		e.respondWith(fetch(e.request)
			.then(function (res) {
				const clonedRes = res.clone();
				clonedRes.json()
					.then(function (data) {
						for (let key in data) {
							writeData('currencies', data[key]);
						
						}
					});
				return res;
			})
		);

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

// self.addEventListener('fetch', event => {
// 	event.respondWith(
// 			caches.open(staticCacheName
