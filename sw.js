let cacheName = 'currency-calc-v1';
let cacheFiles = [
	'./',
	'./index.html',
	'./js/idb.js',
	'./js/script.js',
	'./js/index-db.js',
	'./css/style.css',
	'https://fonts.googleapis.com/css?family=Roboto:400,700',
	'./js/script.js'
]


self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Installed');

	e.waitUntil(
		caches.open(cacheName).then(function(cache) {
			console.log("[ServiceWorker] Caching cacheFiles");
			return cache.addAll(cacheFiles);
		})
	)
})


self.addEventListener('activate', function (e) {
	console.log("[ServiceWorker] Activated")

	e.waitUntil(
		//createDB()
		caches.keys().then(function (cacheNames) {
			return Promise.all(cacheNames.map(function (thisCacheName) {

				if (thisCacheName !== cacheName) {

					console.log("[ServiceWorker] Removing Cache Files from ", thiscacheName);
					return caches.delete(thiscacheName);
				}
			}));
		})
	);
});

self.addEventListener('fetch', function (e) {
	console.log("[ServiceWorker] Fetching", e.request.url);
	
	e.respondWith(
		//To respond with an entry from the cache if there is one, else fetch from the network.
		caches.match(e.request).then(function (response) {
			if (response) return response;
			return fetch(e.request);
		})
	);
	const requestUrl = new URL(e.request.url);

	if (requestUrl.origin === location.origin) {
		if (requestUrl.pathname === './') {
			e.respondWith(cashes.match('./skeleton'));
			return;
		}
	}
}); 
