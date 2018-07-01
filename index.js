let dbPromise = idb.open('currency-db', 1, function (db) {
	if (!db.objectStoreNames.contains('currencies')) {
		db.createObjectStore('currencies', { keyPath: 'id' });
	}
});

function writeData(st, data) {
  return dbPromise
    .then(function (db) {
      const tx = db.transaction(st, 'readwrite');
      const store = tx.objectStore('currencies');
      store.put(data);
      return tx.complete;
    });
}

function readAllData(st) {
  return dbPromise
    .then(function (db) {
      let tx = db.transaction(st, 'readonly');
      let store = tx.objectStore(st);
      return store.getAll();
    }) 
}

