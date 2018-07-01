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

// let dbPromise = idb.open('currency_db', 2, upgradeDb =>{
//   switch(upgradeDb.oldVersion){
//       case 0:
//       case 1: 
//       console.log('Creating the forex object store');
//       let forexDb = upgradeDb.createObjectStore('forex');

//   }
// });

// const add_to_store=(st)=>{
//   dbPromise.then(db =>{
//       let tx = db.transaction(st, 'readwrite');
//       let store = tx.objectStore(st);

//       store.put({
//           id: Object.key(message),
//           rate: Object.value(message)
//       });
//   }).then(()=> console.log('currency pair and rate added'));
// }

// const get_from_store =(st)=>{
//   dbPromise.then(db =>{
//       let tx = db.transaction(st, 'readonly');
//           let store = tx.objectStore(st);
//           return store.get(item);
//       }).then(()=>{
//           console.log("We returned the rate for ", item);
//       })
// }
