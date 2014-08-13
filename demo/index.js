$(document).ready(function() {
	
	$(document).on("click", ".clearWay", function() {
		way.remove();
	});
	
	way.watchAll(function(selector, value) {
		console.log("Something changed.", {
			selector: selector,
			value: value
		});
	});

});
