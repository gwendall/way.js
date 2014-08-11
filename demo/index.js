$(document).ready(function() {
	
	way.watch("htmlData.value", function(value) {
		_.delay(function() {
			_.throttle(function() {
				if (!way.get("inputChanged")) {
					way.set("inputChanged", true);
					$('.alert-change').fadeIn(300, function() {});
					_.delay(function() {
						way.set("inputChanged", false);
						$('.alert-change').fadeOut(300, function() {});
					}, 2000);		
				}			
			}, 1000)();
		}, 1000);
	});

	way.watch("some.data", function(value) {
		console.log('Some changed!', value);
	});

});
