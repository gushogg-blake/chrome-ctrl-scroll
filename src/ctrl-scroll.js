document.addEventListener("wheel", function(e) {
	if (e.ctrlKey) {
		e.preventDefault();
		
		window.scrollBy(e.deltaX * 5, e.deltaY * 5, {
			behavior: "instant",
		});
	}
}, {
	passive: false, // allows preventDefault
});
