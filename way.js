/*
	Cheers!
*/

window.way = {};

(function(){
	
	'use strict';

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

	//////////////////////////
	// DOM METHODS CHAINING //
	//////////////////////////
	
	WAY.prototype.dom = function(element) {
		this._element = $(element);
		return this;
	};
	
	//////////////////////////////
	// DOM METHODS: DOM -> JSON //
	//////////////////////////////
	
	WAY.prototype.toStorage = function(options, element) {
		
		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions(),
			timeout = Number(options.timeout) || 0,
			data = self.dom(element).toJSON(options);

		if (options.readonly) return false;
		_.throttle(function() {
			self.set(options.data, data, options);
		}, timeout)();
		
	}
	
	WAY.prototype.toJSON = function(options, element) {

		var self = this,
			element = element || self._element,
			data = self.dom(element).getValue(),
			options = options || self.dom(element).getOptions();

		if (_.isArray(options.pick)) data = _.pick(data, options.pick);
		if (_.isArray(options.omit)) data = _.omit(data, options.omit);

		return data;

	}

	//////////////////////////////
	// DOM METHODS: JSON -> DOM //
	//////////////////////////////
	
	WAY.prototype.fromJSON = function(data, options, element) {
				
		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions(),
			currentData = self.dom(element).toJSON();

		if (currentData == data) return false;
		if (options.writeonly) return false;
		
		if (_.isObject(data) && _.isObject(currentData)) {
			if (_.isArray(options.pick)) data = _.pick(data, options.pick);
			if (_.isArray(options.omit)) data = _.omit(data, options.omit);
			data = _.extend(currentData, data);		
		}

		if (options.json) {
			data = isJSON(data) ? data : JSON.stringify(data, undefined, 2);
		}
		
		self.dom(element).setValue(data, options);

	}
	
	WAY.prototype.fromStorage = function(options, element) {
		
		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions();
		
		if (options.writeonly) return false;
		
		var data = self.get(options.data);
		self.dom(element).fromJSON(data, options);

	}

	/////////////////////////////////////////
	// DOM METHODS: HTML GETTERS / SETTERS //
	/////////////////////////////////////////
	
	WAY.prototype.getValue = function(element) {

		var self = this,
			element = element || self._element;

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

	WAY.prototype.setValue = function(data, options, element) {
		
		var self = this,
			element = element || self._element;
		
		var setters = {
			'FORM': function(a) {
				js2form($(element).get(0), a);
			},
			'INPUT': function(a) {
				if (!_.isString(a)) a = JSON.stringify(a);
				$(element).val(a || '');
			},
			'TEXTAREA': function(a) {
				if (!_.isString(a)) a = JSON.stringify(a);
				$(element).val(a || '');
			},
			'PRE': function(a) {
				$(element).html(a);				
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
					if (response) {
						$(element).removeClass("way-error").addClass("way-success");
					} else {
						if (a) {
							$(element).addClass("way-error");
						} else {
							$(element).removeClass("way-error").removeClass("way-success");
						}
						var options = self.dom(element).getOptions() || {};
						a = options.default || "";
					}
					// if (a) $(element).attr('src', a); // Preserve the previous image or not?
					$(element).attr('src', a);
				});
				/*
				if (a) {
				} else {
					var options = self.dom(element).getOptions() || {};
					a = options.img || "";
					$(element).removeClass("way-error");
					if (a) $(element).attr('src', a);
				}
				*/
			}
		}
		var defaultSetter = function(a) {
			$(element).html(a);
		}
		var elementType = $(element).get(0).tagName;
		var setter = setters[elementType] || defaultSetter;
		setter(data);

	}

	//////////////////////////////////
	// DOM METHODS: OPTIONS PARSING //
	//////////////////////////////////
		
	WAY.prototype.getOptions = function(element) {

		var self = this,
			element = element || self._element,
			defaultOptions = {
				readonly: false,
				writeonly: false,
				persistent: false
			};
		return _.extend(defaultOptions, self.dom(element).getAttrs(tagPrefix));

	}

	WAY.prototype.getAttrs = function(prefix, element) {

		var self = this,
			element = element || self._element;
		
		var parseAttrValue = function(key, value) {

			var attrTypes = {
				pick: "array",
				omit: "array",
				readonly: "boolean",
				writeonly: "boolean",
				json: "boolean",
				persistent: "boolean"
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
	
	WAY.prototype.setDefault = function(force, options, element) {

		var self = this,
			element = element || self._element,
			options = options ? _.extend(self.dom(element).getOptions(), options) : self.dom(element).getOptions();
			
		// Should we just set the default value in the DOM, or also in the datastore?
		if (options.default && (force == true)) self.set(options.data, options.default, options);
		if (options.default && (force != true)) self.dom(element).setValue(options.default, options);

	}
	
	///////////////////////
	// REACTIVE BINDINGS //
	///////////////////////
		
	WAY.prototype.set = function(selector, value, options) {
		
		console.log('Setting!', {
			selector: selector,
			value: value,
			options: options
		});
		
		var self = this;
		options = options || {};
		
		self.settr(self, selector, value);

		self.emitChange(selector, value);
		self.digestBindings(selector);
		if (options.persistent) self.backup(selector);
		
	}
	
	WAY.prototype.settr = function(self, selector, value) {
		
		// Separate settr so that we can easily adapt to other data stores.
		if (selector && !_.isString(selector)) return false;
		self.data = self.data || {};
		self.data = selector ? deepJSON(self.data, selector, value) : {};

	}
	
	WAY.prototype.get = function(selector) {
		
		var self = this;
		if (selector != undefined && !_.isString(selector)) return false;
		if (!self.data) return {};
		return selector ? deepJSON(self.data, selector) : self.data;

	}

	WAY.prototype.remove = function(selector, options) {
		
		var self = this;

		if (selector) {
			self.data = deepJSON(self.data, selector, null, true);
		} else {
			self.data = {};
		}
		
		self.emitChange(selector, null);
		self.digestBindings(selector);
		self.backup(selector);
		
	}

	WAY.prototype.buildSelector = function(selector, type) {
		if (selector) return "[" + tagPrefix + "-" + type + "^='" + selector.split('.')[0] + "']";
		if (!selector) return "[" + tagPrefix + "-" + type + "]";
	}
	
	WAY.prototype.digestBindings = function(selector) {
		
		var self = this;
		
		var dataSelector = self.buildSelector(selector, "data");
		$(dataSelector).each(function() {
			// Make sure the currently focused input is not getting refreshed
			var focused = (($(this).get(0).tagName == "FORM") && ($(this).get(0) == $(':focus').parents("form").get(0))) ? true : false;
			if (!focused) self.dom(this).fromStorage();
		});
		
		// Selectors for all data (mainly for debug)
		var allSelector = "[" + tagPrefix + "-data='']";
		$(allSelector).each(function() {
			self.dom(this).fromJSON(self.data);
		});
		
	}
	
	WAY.prototype.setDefaults = function() {
		
		var self = this,
			dataSelector = self.buildSelector(null, "default");
		
		$(dataSelector).each(function() {
			var options = self.dom(this).getOptions();
			self.dom(this).setValue(options.default);
		});
		
	}

	//////////////////////////
	// LOCAL STORAGE BACKUP //
	//////////////////////////
	
	WAY.prototype.backup = function(selector) {
		
		var self = this;
		try { 
			var data = self.data || {};
			localStorage.setItem(tagPrefix, JSON.stringify(data));
		} catch(e) {
			console.log('Your browser does not support localStorage.');			
		}
		
	}

	WAY.prototype.restore = function(selector) {
		
		var self = this;
		try {
			var data = localStorage.getItem(tagPrefix);
			try { 
				data = JSON.parse(data); 
				for (var key in data) {
					self.set(key, data[key]);					
				}
			} catch(e) {}
		} catch(e) {
			console.log('Your browser does not support localStorage.');	
		}
		
	}
	
	$(document).ready(function() {
		way.setDefaults();
		way.restore();
	});
	
	//////////
	// MISC //
	//////////

	var startsWith = function(str, starts) {
		
		if (starts === '') return true;
		if (str == null || starts == null) return false;
		str = String(str); starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;

	}
	
	var isJSON = function(string) {
		
		var test = false;
		try {
			test = /^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
		} catch (e) {}
		return test;
		
	}

	var deepJSON = function (obj, key, value, remove) {

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
			
			if (remove) {
				delete obj[keys[i]];
			} else {
				obj[keys[i]] = value;				
			}

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
		way.dom(element).toStorage();

	});

	$(document).on("keyup change", ":input[" + tagPrefix + "-data]", function(e) {

		var element = $(e.target);
		way.dom(element).toStorage();

	});
	
	////////////////////////////
	// GO YOUR WAY LITTLE GUY //
	////////////////////////////

	way = new WAY();
		
}).call(this);