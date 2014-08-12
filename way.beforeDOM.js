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
	
	/////////////////
	// DOM -> JSON //
	/////////////////
	
	/*
	WAY.prototype.toStorage = function(element, options) {
		
		var self = this,
			options = options || self.getOptions(element),
			timeout = Number(options.timeout) || 0,
			data = self.toJSON(element, options);

		if (options.readonly) return false;
		_.throttle(function() {
			self.set(options.data, data, options);
		}, timeout)();
		
	}
	*/

	WAY.prototype.toStorage = function(options, element) {
		
		var self = this,
			element = element || self._element,
			options = options || self.getOptions(element),
			timeout = Number(options.timeout) || 0,
			data = self.toJSON(element, options);

		if (options.readonly) return false;
		_.throttle(function() {
			self.set(options.data, data, options);
		}, timeout)();
		
	}
	
	WAY.prototype.toJSON = function(element, options) {

		var self = this,
			data = self.getValueDOM(element),
			options = options || self.getOptions(element);

		if (_.isArray(options.pick)) data = _.pick(data, options.pick);
		if (_.isArray(options.omit)) data = _.omit(data, options.omit);

		return data;

	}

	/////////////////
	// JSON -> DOM //
	/////////////////
	
	WAY.prototype.fromJSON = function(element, data, options) {
				
		var self = this,
			options = options || self.getOptions(element),
			currentData = self.toJSON(element);

		if (currentData == data) return false;
		if (options.writeonly) return false;
		
		if (_.isObject(data) && _.isObject(currentData)) {
			if (_.isArray(options.pick)) data = _.pick(data, options.pick);
			if (_.isArray(options.omit)) data = _.omit(data, options.omit);
			data = _.extend(currentData, data);		
		}
		
		if (options.json) data = JSON.stringify(data, undefined, 2);
		
		self.setValueDOM(element, data, options);

	}
	
	WAY.prototype.fromStorage = function(element, options) {
		
		var self = this,
			options = options || self.getOptions(element);
		
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

	WAY.prototype.setValueDOM = function(element, data, options) {

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
						var options = self.getOptions(element) || {};
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
		setter(data);

	}
		
	/////////////////////
	// OPTIONS PARSING //
	/////////////////////
	
	WAY.prototype.getOptions = function(element) {
		
		var self = this;
		var defaultOptions = {
				readonly: false,
				writeonly: false,
				persistent: false
			};
		return _.extend(defaultOptions, self.getAttrs(element, tagPrefix));

	}

	WAY.prototype.getAttrs = function(element, prefix) {
		
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
	
	///////////////////////
	// REACTIVE BINDINGS //
	///////////////////////
		
	WAY.prototype.set = function(selector, value, options) {
		
		var self = this;
		options = options || {};
		self.settr(self, selector, value);
		self.emitChange(selector, value);
		self.digestBindings(selector);
		if (options.persistent) self.backup(selector);
		
	}
	
	WAY.prototype.settr = function(self, selector, value) {
		
		// Separate settr so that we can easily adapt to other data stores.
		if (!selector || !_.isString(selector)) return false;
		self.data = self.data || {};
		self.data = deepJSON(self.data, selector, value);

	}
	
	WAY.prototype.get = function(selector) {
		
		var self = this;
		if (selector != undefined && !_.isString(selector)) return false;
		if (!self.data) return {};
		return selector ? deepJSON(self.data, selector) : self.data;

	}

	WAY.prototype.remove = function(selector) {
		
		var self = this;
		if (!selector) self.data = {};

	//	self.emitChange(selector, null);
	//	self.digestBindings();
	//	self.backup(selector);

		console.log('Removing way.', selector, self);
		
	}

	WAY.prototype.buildSelector = function(selector, type) {
		if (selector) return "[" + tagPrefix + "-" + type + "^='" + selector.split('.')[0] + "']";
		if (!selector) return "[" + tagPrefix + "-" + type + "]";
	}
	
	WAY.prototype.digestBindings = function(selector) {
		
		var self = this;
		
		// Digest data
		var dataSelector = self.buildSelector(selector, "data");
		$(dataSelector).each(function() {
			// Make sure the currently focused input is not getting refreshed
			var focused = (($(this).get(0).tagName == "FORM") && ($(this).get(0) == $(':focus').parents("form").get(0))) ? true : false;
			if (!focused) self.fromStorage(this);
		});

	}

	//////////////////////////
	// LOCAL STORAGE BACKUP //
	//////////////////////////
	
	WAY.prototype.backup = function(selector) {

		var self = this,
			key = selector.split('.')[0],
			value = self.get(key);
		try { 
			localStorage.setItem(key, JSON.stringify(value));
		} catch(e) {
			console.log('Your browser does not support localStorage.');			
		}

	}

	WAY.prototype.restore = function(selector) {
		
		var self = this;
		if (selector) {
			try {
				var value = localStorage.getItem(selector);
				try { 
					value = JSON.parse(value); 
					self.set(selector, value);
				} catch(e) {}
			} catch(e) {
				console.log('Your browser does not support localStorage.');	
			}
		} else {
			try {
				for (var key in localStorage) {
					var value = localStorage.getItem(key);
					try {
						value = JSON.parse(value); 
						self.set(key, value);
					} catch(e) {}
				}
			} catch(e) {
				console.log('Your browser does not support localStorage.');
			}
		}
		
	}
	
	$(document).ready(function() {
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
//		way.toStorage(element);
		way.dom(element).toStorage();

	});

	$(document).on("keyup change", ":input[" + tagPrefix + "-data]", function(e) {

		var element = $(e.target);
//		way.toStorage(element);
		way.dom(element).toStorage();

	});

	/////////////////
	// DOM METHODS //
	/////////////////
	
	WAY.prototype.dom = function(element) {
		this._element = $(element);
		return this;
	};
	
	////////////////////////////
	// GO YOUR WAY LITTLE GUY //
	////////////////////////////

	way = new WAY();
		
}).call(this);