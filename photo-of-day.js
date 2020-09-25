chrome.storage.sync.get('date', function(result) {
	// Checks if date is unset, or the previous day, in which case will
	// pull the image source from nat geo
	var date = new Date().toISOString().slice(0, 10)
	if (result['date'] != date) {
		chrome.storage.sync.set({ 'date' : date }, function() {})

		fetch('https://www.nationalgeographic.com/photography/photo-of-the-day/')
			.then(
				function(response) {
					if (response.status !== 200) {
						console.log('Looks like there was a problem. Status Code: ' +
							response.status);
						return Promise.reject("Failed to scrape photo");
					}

					return response.text()
				}
			).then(
				function(text) {
					var doc = new DOMParser().parseFromString(text, "text/html")
					var selected = doc.querySelector("meta[property='og:image']").getAttribute("content")
					document.querySelector(".photo-of-day").setAttribute("src", selected);
					chrome.storage.sync.set({ 'img-src' : selected }, function() {});

				}
			).catch(function(err) {
				console.log('Fetch Error :-S', err);
			});
	}

	chrome.storage.sync.get('img-src', function(result) {
		document.querySelector(".photo-of-day").setAttribute("src", result['img-src']);
	});
});
