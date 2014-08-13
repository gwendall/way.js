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

	var EventEmitter = function () {

		this._watchers = {};
		this._watchersAll = {};

	};

	EventEmitter.prototype.constructor = EventEmitter;
		
	EventEmitter.prototype.watchAll = function(handler) {
		
		this._watchersAll = this._watchersAll || [];
		if (!_.contains(this._watchersAll, handler)) this._watchersAll.push(handler);
		
	}
	
	EventEmitter.prototype.watch = function(selector, handler) {
	
		if (!this._watchers) this._watchers = {};		
		this._watchers[selector] = this._watchers[selector] || [];
		this._watchers[selector].push(handler);

	}
	
	EventEmitter.prototype.findWatcherDeps = function(selector) {
		
		// Go up to look for parent watchers
		// ex: if "some.nested.value" is the selector, it should also trigger for "some"
		
		var result = [];
		var watchers = _.keys(this._watchers);
		watchers.forEach(function(watcher) {
			if (startsWith(selector, watcher)) result.push(watcher);			
		});
		return result;
		
	}
		
	EventEmitter.prototype.emitChange = function(selector /* , arguments */) {

		if (!this._watchers) this._watchers = {};
		
		var self = this;
		
		// Send data down to the local watchers
		var deps = self.findWatcherDeps(selector);		
		deps.forEach(function(item) {
			if (this._watchers[item]) {
				this._watchers[item].forEach(function(handler) {
					handler.apply(self, [self.get(item)]);
				});				
			}
		});
		
		// Send data down to the global watchers
		if (!self._watchersAll || !_.isArray(self._watchersAll)) return;
		self._watchersAll.forEach(function(watcher) {
			if (_.isFunction(watcher)) watcher.apply(self, [selector, self.get(selector)]);			
		});
		
	}
	
	////////////////////
	// WAY DEFINITION //
	////////////////////

	var WAY = function () {

		this.data = {};
		this._bindings = {};
		this.options = {
			timeoutInput: 50,
			timeoutDOM: 100
		};

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
			data = self.dom(element).toJSON(options);

		if (options.readonly) return false;
		self.set(options.data, data, options);
		
	}
	
	WAY.prototype.toJSON = function(options, element) {

		var self = this,
			element = element || self._element,
			data = self.dom(element).getValue(),
			options = options || self.dom(element).getOptions();
			
		// #TODO: Flatten / unflatten to allow for nested picks/omits
		// ex: omit: ['some.nested.value']
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
			data = _json.isStringified(data) ? data : _json.prettyprint(data);
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

	/////////////////////////////////
	// DOM METHODS: GET - SET HTML //
	/////////////////////////////////
	
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
			element = element || self._element,
			options = options || self.dom(element).getOptions();
		
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
				
				if (!a) {
					a = options.default || "";
					$(element).attr('src', a);
					return false;
				}
				
				var isValidImageUrl = function(url, cb) {
					$(element).addClass("way-loading");
					$("<img>", {
						src: url,
						error: function() { cb(false); },
						load: function() { cb(true); }
					});
				}
				
				isValidImageUrl(a, function(response) {
					$(element).removeClass("way-loading");
					if (response) {
						$(element).removeClass("way-error").addClass("way-success");
					} else {
						if (a) {
							$(element).addClass("way-error");
						} else {
							$(element).removeClass("way-error").removeClass("way-success");
						}
						a = options.default || "";
					}
					// if (a) $(element).attr('src', a); // Preserve the previous image or not?
					$(element).attr('src', a);
				});

			}
		}
		var defaultSetter = function(a) {
			$(element).html(a);
		}
		var elementType = $(element).get(0).tagName;
		var setter = setters[elementType] || defaultSetter;
		setter(data);
		if (options.href) {
			console.log("Setting href.", options);
			$(element).attr("href", self.get(options.href)); // options.href
		}
	}
	
	WAY.prototype.setDefault = function(force, options, element) {

		var self = this,
			element = element || self._element,
			force = force || false,
			options = options ? _.extend(self.dom(element).getOptions(), options) : self.dom(element).getOptions();
			
		// Should we just set the default value in the DOM, or also in the datastore?
		if (!options.default) return false;
		if (!force) return self.dom(element).setValue(options.default, options);
		if (force) return self.set(options.data, options.default, options);

	}
	
	WAY.prototype.setDefaults = function() {

		var self = this,
			dataSelector = "[" + tagPrefix + "-default]";
		
		$(dataSelector).each(function() {
			self.dom(this).setDefault();
		});

	}
	
	/////////////////////////////////////
	// DOM METHODS: GET - SET BINDINGS //
	/////////////////////////////////////
	
	// Scans the DOM to look for new bindings
	WAY.prototype.registerBindings = function() {
		
		var self = this,
			selector = "[" + tagPrefix + "-data]";
		
		self._bindings = self._bindings || {};
		
		// #TODO: deal with bindings removed from the DOM
		$(selector).each(function() {
			var element = this,
				options = self.dom(element).getOptions();
			if (!options.data) return;
			self._bindings[options.data] = self._bindings[options.data] || [];
			if (!containsDomElement(self._bindings[options.data], element)) self._bindings[options.data].push($(element));
		});
				
	}

	WAY.prototype.updateBindings = function(selector) {
		
		var self = this;
			self._bindings = self._bindings || {};
			
		var bindings = [];
		if (selector) {
			// Set bindings for the specified selector (bindings with keys starting with, to include nested bindings)
			for (var key in self._bindings) {
				if (startsWith(key, selector)) bindings = _.union(bindings, self._bindings[key]);
			}
		} else {
			// Set bindings for all selectors
			for (var key in self._bindings) {
				bindings = _.union(bindings, self._bindings[key]);			
			}			
		}
		
		bindings.forEach(function(element) {
			var focused = (($(element).get(0).tagName == "FORM") && ($(element).get(0) == $(':focus').parents("form").get(0))) ? true : false;
			if (!focused) self.dom(element).fromStorage();			
		});
		
		// Set bindings for the global selector
		self._bindings["__all__"].forEach(function(element) {
			self.dom(element).fromJSON(self.data);
		});			
		
	}
	
	//////////////////////////////////
	// DOM METHODS: OPTIONS PARSING //
	//////////////////////////////////
		
	WAY.prototype.getOptions = function(element) {

		var self = this,
			element = element || self._element,
			defaultOptions = {
				data: null,
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
	
	//////////////////
	// DATA METHODS //
	//////////////////
	
	WAY.prototype.get = function(selector) {
		
		var self = this;
		if (selector != undefined && !_.isString(selector)) return false;
		if (!self.data) return {};
		return selector ? _json.get(self.data, selector) : self.data;

	}
	
	WAY.prototype.set = function(selector, value, options) {
		
		var self = this;
		options = options || {};
		
		if (selector && !_.isString(selector)) return false;
		self.data = self.data || {};
		self.data = selector ? _json.set(self.data, selector, value) : {};
		
		self.updateBindings(selector);
		self.emitChange(selector, value);
		if (options.persistent) self.backup(selector);
		
	}
	
	WAY.prototype.remove = function(selector, options) {
		
		var self = this;
		options = options || {};

		if (selector) {
			self.data = _json.remove(self.data, selector);
		} else {
			self.data = {};
		}
		
		self.updateBindings(selector);
		self.emitChange(selector, null);
		if (options.persistent) self.backup(selector);
		
	}

	WAY.prototype.clear = function() {
		
		this.remove(null, { persistent: true });
		
	}

	//////////////////////////
	// LOCALSTORAGE METHODS //
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
		
	//////////
	// MISC //
	//////////

	var startsWith = function(str, starts) {
		
		if (starts === '') return true;
		if (str == null || starts == null) return false;
		str = String(str); starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;

	}

	var containsDomElement = function(list, element) {
		
		var contains = false;
		list.every(function(item) {
			if ($(item).get(0) === $(element).get(0)) {
				contains = true;
				return false;
			} else {
				return true;				
			}
		});
		return contains;

	}
	
	///////////////////////////////////
	// INITIATE AND WATCH DOM EVENTS //
	///////////////////////////////////

	way = new WAY();

	var timeoutDOM = null;
	$(document).ready(function() {

		way.registerBindings();
		way.setDefaults();
		way.restore();

		// We need to register dynamically added bindings so we do it by watching DOM changes
		// We use a timeout since "DOMSubtreeModified" gets triggered on every change in the DOM (even input value changes)
		// so we can limit the number of scans when a user is typing something
		$("body").bind("DOMSubtreeModified", function() {
			if (timeoutDOM) clearTimeout(timeoutDOM);
			timeoutDOM = setTimeout(function() {
				way.registerBindings();
			}, way.options.timeoutDOM);
		});
		
	});

	var timeoutInput = null;
	$(document).on("keyup change", "form[" + tagPrefix + "-data] :input", function(e) {

		if (timeoutInput) clearTimeout(timeoutInput);
		timeoutInput = setTimeout(function() {
			var element = $(e.target).parents("form");
			way.dom(element).toStorage();
		}, way.options.timeoutInput);

	});

	$(document).on("keyup change", ":input[" + tagPrefix + "-data]", function(e) {

		if (timeoutInput) clearTimeout(timeoutInput);
		timeoutInput = setTimeout(function() {
			var element = $(e.target);
			way.dom(element).toStorage();
		}, way.options.timeout);

	});

	$(document).on("click", "[" + tagPrefix + "-clear]", function(e) {

		var options = way.dom(this).getOptions();
		way.remove(options.data, options);

	});

}).call(this);