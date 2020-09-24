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
	    document.querySelector(".photo-of-day").setAttribute("src", selected)
    }
).catch(function(err) {
	console.log('Fetch Error :-S', err);
});
