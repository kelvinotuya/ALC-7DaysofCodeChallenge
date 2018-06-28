//onload event handler
function ready(fn) {
		if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

//fetch currencies in the handler
ready(() => {
		fetch('https://free.currencyconverterapi.com/api/v5/currencies')
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response.json();
			})
			.then(data => {
				if (data.results) {
					const currencies = data.results;
					let list = "<option value='' selected>--Please choose an option--</option>";
					Object.keys(currencies).forEach(key => {
						list += `<option value='${key}' >${currencies[key]['currencyName']} (${currencies[key]['currencySymbol']})</option>`;
					});
					document.getElementById('currencyFrom').innerHTML = list;
					document.getElementById('currencyTo').innerHTML = list;
				} else {
					throw Error("No result found");
				}
			})
			.catch(err => {
				document.getElementById('currencyTo').innerHTML = '<option value="">Empty</option>';
				document.getElementById('currencyFrom').innerHTML = '<option value="">Empty</option>';
			});