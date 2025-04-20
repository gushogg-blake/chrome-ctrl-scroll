document.addEventListener("wheel", function(e) {
	const Y_MULTIPLIER = 5;
	const X_MULTIPLIER = 5;
	const BEHAVIOUR = "instant"; // use "smooth" to enable animation
	
	if (e.ctrlKey) {
		e.preventDefault();
		
		window.scrollBy(e.deltaX * X_MULTIPLIER, e.deltaY * Y_MULTIPLIER, {
			behavior: BEHAVIOUR,
		});
	}
}, {
	passive: false, // allows preventDefault
});
