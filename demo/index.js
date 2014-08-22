way.w.ready(function() {

	way.watchAll(function(selector, value) {
		console.log("Something changed.", {
			selector: selector,
			value: value
		});
	});

});
