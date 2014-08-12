$(document).ready(function() {
	
	var source   = $("#entry-template").html();
	var template = Handlebars.compile(source);
	
	var defaultData = { name: "e", nationality: [ "french", "american" ] };	
	way.set("defaultData", defaultData, { persistent: true });
	
	$(document).on("click", ".resetSessionToDefault", function() {
		way.set("formData", defaultData, { persistent: true });		
	});
	
	/*
	way.set("inputChanged", false);
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
	*/
	
	way.watch("formData", function(value) {
		console.log('Form changed!', value);
	});

});
