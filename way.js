/*
	Cheers!
*/

/////////////////
// DOM -> JSON //
/////////////////

var tagPrefix = "way";

$(document).on("keyup change", "form[" + tagPrefix + "-data] :input", function(e) {
	
	var element = $(e.target).parents("form");
	$(element).toStorage();

});

$(document).on("keyup change", ":input[" + tagPrefix + "-data]", function(e) {

	var element = $(e.target);
	$(element).toStorage();

});

$.fn.toStorage = function(options) {
	
	var self = this,
		options = options || $(self).getBindOptions(),
		timeout = Number(options.timeout) || 0,
		data = $(self).toJSON(options);
	
	if (options.readonly) return false;
	_.throttle(function() {
		$.setStored(options.data, data);
	}, timeout)();
	
}

$.fn.toJSON = function(options) {
	
	var self = this,
		data = $(self).getValueDOM(),
		options = options || $(self).getBindOptions();
	
	if (_.isArray(options.pick)) data = _.pick(data, options.pick);
	if (_.isArray(options.omit)) data = _.omit(data, options.omit);
	
	return data;
	
}

/////////////////
// JSON -> DOM //
/////////////////

$.fn.fromJSON = function(data, options) {
	
	var self = this,
		options = options || $(self).getBindOptions(),		
		currentData = $(self).toJSON();
	
	if (currentData == data) return false;
	if (options.writeonly) return false;
	
	if (_.isObject(data)) {
		if (_.isArray(options.pick)) data = _.pick(data, options.pick);
		if (_.isArray(options.omit)) data = _.omit(data, options.omit);
		data = _.extend(currentData, data);		
	}
	$(self).setValueDOM(data);

}

$.fn.fromStorage = function(options) {
	
	var self = this,
		options = options || $(self).getBindOptions();

	if (options.writeonly) return false;
	var data = $.getStored(options.data);
		$(self).fromJSON(data, options);

}

////////////////////////////
// HTML GETTERS / SETTERS //
////////////////////////////

$.fn.getValueDOM = function() {
	
	var self = this;	
	var getters = {
		'FORM': function() {
			return form2js($(self).get(0));
		},
		'INPUT': function() {
			return $(self).val();
		},
		'TEXTAREA': function() {
			return $(self).val();
		}
	}
	var defaultGetter = function(a) {
		$(self).html();
	}
	var elementType = $(self).get(0).tagName;
	var getter = getters[elementType] || defaultGetter;
	return getter();
	
}

$.fn.setValueDOM = function(data) {
	
	var self = this;
	var setters = {
		'FORM': function(a) {
			js2form($(self).get(0), a);
		},
		'INPUT': function(a) {
			$(self).val(a || '');
		},
		'TEXTAREA': function(a) {
			$(self).val(a || '');
		},
		'IMG': function(a) {
			
			var isValidImageUrl = function(url, cb) {
				$("<img>", {
					src: url,
					error: function() { cb(false); },
					load: function() { cb(true); }
				});
			}
			
			try {
				isValidImageUrl(a, function(response) {
					if (!response) {
						var options = $(self).getBindOptions() || {};
						a = options.img || null;
					}
					if (a) $(self).attr('src', a);
				});
			} catch(e) {
				console.log('Could not load the image.');
			}
			
		}
	}
	var defaultSetter = function(a) {
		$(self).html(a);
	}
	var elementType = $(self).get(0).tagName;
	var setter = setters[elementType] || defaultSetter;
	return setter(data);
	
}

/////////////////////
// OPTIONS PARSING //
/////////////////////

$.fn.getBindOptions = function() {
	var defaultOptions = {
//			reactive: true,
			readonly: false,
			writeonly: false
		};
	return _.extend(defaultOptions, $(this).getAttrs(tagPrefix));
}

$.fn.getAttrs = function(prefix) {
		
	var parseAttrValue = function(key, value) {
		
		var attrTypes = {
			pick: "array",
			omit: "array",
//			reactive: "boolean",
			readonly: "boolean",
			writeonly: "boolean"
		};
		
		var parsers = {
			array: function(value) {
				return value.split(',');
			},
			boolean: function(value) {
				if (value == "true") return true;
				if (value == "false") return false;
				return false;				
			}
		};

		var valueType = attrTypes[key] || null;
		var parser = parsers[valueType] || function() { return value };

		return parser(value);

	}
	
	var attributes = {};
	if (this.length) {
		$.each(this[0].attributes, function(index, attr) {
			var include = (prefix && startsWith(attr.name, prefix + '-')) ? true : false;
			if (include) {
				var name = (prefix) ? attr.name.slice(prefix.length + 1, attr.name.length) : attr.name;
				var value = parseAttrValue(name, attr.value);
				attributes[name] = value;				
			}
		}); 
	}
    return attributes;

}

///////////////////////
// REACTIVE BINDINGS //
///////////////////////

_WAY = {
	data: {},
	options: {}
};

$.setStored = function(selector, value) {
	
	_WAY.data = deepJSON(_WAY.data, selector, value);	
	$.digestBindings(selector);
		
}

$.getStored = function(selector) {
	
	return deepJSON(_WAY.data, selector);

}

$.digestBindings = function(selector) {
	
	var domSelector = selector ? "[" + tagPrefix + "-data^='" + selector.split('.')[0] + "']" : "[" + tagPrefix + "-data]";
	$(domSelector).each(function() {
		var options = $(this).getBindOptions();
		var focused = (($(this).get(0).tagName == "FORM") && ($(this).get(0) == $(':focus').parents("form").get(0))) ? true : false;
		if (!focused) $(this).fromStorage(options);
	});
	
}

//////////
// MISC //
//////////

var startsWith = function(str, starts){
	if (starts === '') return true;
	if (str == null || starts == null) return false;
	str = String(str); starts = String(starts);
	return str.length >= starts.length && str.slice(0, starts.length) === starts;
}

var deepJSON = function (obj, key, value) {
	
	var keys = key.replace(/\[(["']?)([^\1]+?)\1?\]/g, '.$2').replace(/^\./, '').split('.'),
			root,
			i = 0,
			n = keys.length;

	// Set deep value
	if (arguments.length > 2) {

		root = obj;
		n--;

		while (i < n) {
			key = keys[i++];
			obj = obj[key] = _.isObject(obj[key]) ? obj[key] : {};
		}

		obj[keys[i]] = value;

		value = root;

	// Get deep value
	} else {
		while ((obj = obj[keys[i++]]) != null && i < n) {};
		value = i < n ? void 0 : obj;
	}

	return value;

}