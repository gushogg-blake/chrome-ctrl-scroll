const Y_MULTIPLIER = 5;
const X_MULTIPLIER = 5;
const BEHAVIOUR = "instant"; // use "smooth" to enable animation

document.addEventListener("wheel", function(e) {
	if (!e.ctrlKey) {
		return;
	}
	
	e.preventDefault();
	
	/*
	deltaX might not be set right with Ctrl+Shift, as that wouldn't
	usually be a horizontal scroll
	*/
	
	let {deltaX, deltaY} = e;
	
	if (e.shiftKey) {
		deltaX = deltaY;
		deltaY = 0;
	} else {
		deltaX = 0;
	}
	
	/*
	find nearest scrollable element, or try to scroll the window
	*/
	
	const el = findScrollElement(e.target, deltaX, deltaY);
	
	(el || window).scrollBy(deltaX * X_MULTIPLIER, deltaY * Y_MULTIPLIER, {
		behavior: BEHAVIOUR,
	});
}, {
	passive: false, // allows preventDefault
});

/*
list ancestors, including the node itself, smallest first
*/

function getLineage(el) {
	let lineage = [el];
	let node = el.parentElement;
	
	while (node) {
		lineage.push(node);
		
		node = node.parentElement;
	}
	
	return lineage;
}

/*
scrollWidth/height vs clientWidth/height can sometimes make
an element look scrollable even if it's not, so we check the
computed style as well
*/

function isStyledScrollable(el, dir) {
	const values = ["auto", "scroll"];
	const {overflowX, overflowY} = getComputedStyle(el);
	const x = values.includes(overflowX);
	const y = values.includes(overflowY);
	
	return {
		left: x,
		right: x,
		up: y,
		down: y,
	}[dir];
}

/*
is the element scrollable in the given direction, i.e. has scroll-
bars AND there's space to scroll
*/

function canScroll(el, dir) {
	return isStyledScrollable(el, dir) && {
		left: el.scrollLeft > 0,
		right: el.scrollLeft < el.scrollWidth - el.clientWidth,
		up: el.scrollTop > 0,
		down: el.scrollTop < el.scrollHeight - el.clientHeight,
	}[dir];
}

function getDir(deltaX, deltaY) {
	if (deltaX < 0) {
		return "left";
	} else if (deltaX > 0) {
		return "right";
	} else if (deltaY < 0) {
		return "up";
	} else if (deltaY > 0) {
		return "down";
	}
}

/*
wheel events are triggered on the element the mouse is over,
so we need to find its nearest scrollable ancestor
*/

function findScrollElement(target, deltaX, deltaY) {
	for (let node of getLineage(target)) {
		if (canScroll(node, getDir(deltaX, deltaY))) {
			return node;
		}
	}
	
	return null;
}
