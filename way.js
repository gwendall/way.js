/*
	Cheers!
*/

way = {};

(function(){
	
	var tagPrefix = "way";
	
	//////////////////////////////
	// EVENT EMITTER DEFINITION //
	//////////////////////////////

	var EventEmitter = function () {};

	EventEmitter.prototype.constructor = EventEmitter;

	EventEmitter.prototype.watch = function(selector, handler) {
	
		if (!this._watchers) this._watchers = {};		
		this._watchers[selector] = this._watchers[selector] || [];
		this._watchers[selector].push(handler);

	}

	EventEmitter.prototype.findDependantWatchers = function(selector) {
		
		// Go up to look for parent watchers... (ex: if "some.nested.value" is the selector, it should also trigger for "some")
		
		var result = [];
		var watchers = _.keys(this._watchers);
		for (var i in watchers) {
			var watcher = watchers[i];
			if (startsWith(selector, watcher)) result.push(watcher);
		}
		return result;
		
	}
		
	EventEmitter.prototype.emitChange = function(selector /* , arguments */) {

		if (!this._watchers) this._watchers = {};
		
		var self = this;		
		var deps = self.findDependantWatchers(selector);
		
		for (var i in deps) {
			var item = deps[i];
			if (this._watchers[item]) {
				this._watchers[item].forEach(function(handler) {
					handler.apply(self, [self.get(item)]);
				});				
			}
		}

	}
	
	////////////////////
	// WAY DEFINITION //
	////////////////////

	var WAY = function () {
		this.data = {};
		this.options = {};
	};

	// Inherit from EventEmitter
	WAY.prototype = Object.create(EventEmitter.prototype);
	WAY.constructor = WAY;
	
	/////////////////
	// DOM -> JSON //
	/////////////////
	
	WAY.prototype.toStorage = function(element, options) {
	
		var self = this,
			options = options || self.getBindOptions(element),
			timeout = Number(options.timeout) || 0,
			data = self.toJSON(element, options);

		if (options.readonly) return false;
		_.throttle(function() {
			self.set(options.data, data);
		}, timeout)();

	}

	WAY.prototype.toJSON = function(element, options) {

		var self = this,
			data = self.getValueDOM(element),
			options = options || self.getBindOptions(element);

		if (_.isArray(options.pick)) data = _.pick(data, options.pick);
		if (_.isArray(options.omit)) data = _.omit(data, options.omit);

		return data;

	}

	/////////////////
	// JSON -> DOM //
	/////////////////
	
	WAY.prototype.fromJSON = function(element, data, options) {
				
		var self = this,
			options = options || self.getBindOptions(element),
			currentData = self.toJSON(element);

		if (currentData == data) return false;
		if (options.writeonly) return false;
		
		// If a nested value changes a parent
		if (_.isObject(data) && !_.isObject(currentData)) data = '';
		
		if (_.isObject(data)) {
			if (_.isArray(options.pick)) data = _.pick(data, options.pick);
			if (_.isArray(options.omit)) data = _.omit(data, options.omit);
			data = _.extend(currentData, data);		
		}

		self.setValueDOM(element, data);

	}
	
	WAY.prototype.fromStorage = function(element, options) {
		
		// element
		var self = this,
			options = options || self.getBindOptions(element);
		
		if (options.writeonly) return false;
		
		var data = self.get(options.data);
		self.fromJSON(element, data, options);

	}

	////////////////////////////
	// HTML GETTERS / SETTERS //
	////////////////////////////
	
	WAY.prototype.getValueDOM = function(element) {

		var getters = {
			'FORM': function() {
				return form2js($(element).get(0));
			},
			'INPUT': function() {
				return $(element).val();
			},
			'TEXTAREA': function() {
				return $(element).val();
			}
		}
		var defaultGetter = function(a) {
			$(element).html();
		}
		var elementType = $(element).get(0).tagName;
		var getter = getters[elementType] || defaultGetter;
		return getter();

	}

	WAY.prototype.setValueDOM = function(element, data) {

		var self = this;
		var setters = {
			'FORM': function(a) {
				js2form($(element).get(0), a);
			},
			'INPUT': function(a) {
				$(element).val(a || '');
			},
			'TEXTAREA': function(a) {
				$(element).val(a || '');
			},
			'IMG': function(a) {

				var isValidImageUrl = function(url, cb) {
					$("<img>", {
						src: url,
						error: function() { cb(false); },
						load: function() { cb(true); }
					});
				}

				isValidImageUrl(a, function(response) {
					if (!response) {
						var options = self.getBindOptions(element) || {};
						a = options.img || null;
					}
					if (a) $(element).attr('src', a);
				});

			}
		}
		var defaultSetter = function(a) {
			$(element).html(a);
		}
		var elementType = $(element).get(0).tagName;
		var setter = setters[elementType] || defaultSetter;
		return setter(data);

	}

	/////////////////////
	// OPTIONS PARSING //
	/////////////////////
	
	WAY.prototype.getBindOptions = function(element) {
		
		var self = this;
		var defaultOptions = {
				readonly: false,
				writeonly: false
			};
		return _.extend(defaultOptions, self.getAttrs(element, tagPrefix));

	}

	WAY.prototype.getAttrs = function(element, prefix) {
		
		var parseAttrValue = function(key, value) {

			var attrTypes = {
				pick: "array",
				omit: "array",
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
			var defaultParser = function() { return value; };
			var valueType = attrTypes[key] || null;
			var parser = parsers[valueType] || defaultParser;

			return parser(value);

		}

		var attributes = {};
		if ($(element).length) {
			$.each($(element).get(0).attributes, function(index, attr) {
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

	WAY.prototype.set = function(selector, value) {

		var self = this;
		self.data = deepJSON(self.data, selector, value);	
		self.digestBindings(selector);
		
		// SHOULD WE FIND FOR NESTED WATCHERS HERE?
		self.emitChange(selector, value);
		
	}

	WAY.prototype.get = function(selector) {
		
		return deepJSON(this.data, selector);

	}

	WAY.prototype.getChildSelector = function(selector) {
		return selector ? "[" + tagPrefix + "-data^='" + selector.split('.')[0] + "']" : "[" + tagPrefix + "-data]";
	}

	WAY.prototype.digestBindings = function(selector) {
		
		var self = this;
		var childSelector = self.getChildSelector(selector);
		$(childSelector).each(function() {
			// Make sure the currently focused input is not getting refreshed
			var focused = (($(this).get(0).tagName == "FORM") && ($(this).get(0) == $(':focus').parents("form").get(0))) ? true : false;
			if (!focused) self.fromStorage(this);
		});

	}

	//////////
	// MISC //
	//////////

	var startsWith = function(str, starts) {
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
	
	////////////////
	// DOM EVENTS //
	////////////////
	
	$(document).on("keyup change", "form[" + tagPrefix + "-data] :input", function(e) {

		var element = $(e.target).parents("form");
		way.toStorage(element);

	});

	$(document).on("keyup change", ":input[" + tagPrefix + "-data]", function(e) {

		var element = $(e.target);
		way.toStorage(element);

	});
	
	////////////////////////////
	// GO YOUR WAY LITTLE GUY //
	////////////////////////////

	way = new WAY();
		
})();