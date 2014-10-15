(function (root, factory) {

	if (typeof define === "function" && define.amd) {
		define(factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		root.way = factory();
	}

}(this, function () {

	"use strict";

	var way, w, tagPrefix = "way";

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
		if (!_w.contains(this._watchersAll, handler)) { this._watchersAll.push(handler); }

	}

	EventEmitter.prototype.watch = function(selector, handler) {

		if (!this._watchers) { this._watchers = {}; }
		this._watchers[selector] = this._watchers[selector] || [];
		this._watchers[selector].push(handler);

	}

	EventEmitter.prototype.findWatcherDeps = function(selector) {

		// Go up to look for parent watchers
		// ex: if "some.nested.value" is the selector, it should also trigger for "some"

		var result = [];
		var watchers = _w.keys(this._watchers);
		watchers.forEach(function(watcher) {
			if (startsWith(selector, watcher)) { result.push(watcher); }
		});
		return result;

	}

	EventEmitter.prototype.emitChange = function(selector /* , arguments */) {

		if (!this._watchers) { this._watchers = {}; }

		var self = this;

		// Send data down to the local watchers
		var deps = self.findWatcherDeps(selector);
		deps.forEach(function(item) {
			if (self._watchers[item]) {
				self._watchers[item].forEach(function(handler) {
					handler.apply(self, [self.get(item)]);
				});
			}
		});

		// Send data down to the global watchers
		if (!self._watchersAll || !_w.isArray(self._watchersAll)) { return; }
		self._watchersAll.forEach(function(watcher) {
			if (_w.isFunction(watcher)) { watcher.apply(self, [selector, self.get(selector)]); }
		});

	}

	////////////////////
	// WAY DEFINITION //
	////////////////////

	var WAY = function () {

		this.data = {};
		this._bindings = {};
		this.options = {
			persistent: true,
			timeoutInput: 50,
			timeoutDOM: 500
		};

	};

	// Inherit from EventEmitter
	WAY.prototype = Object.create(EventEmitter.prototype);
	WAY.constructor = WAY;

	//////////////////////////
	// DOM METHODS CHAINING //
	//////////////////////////

	WAY.prototype.dom = function(element) {

		this._element = w.dom(element).get(0);
		return this;

	};

	//////////////////////////////
	// DOM METHODS: DOM -> JSON //
	//////////////////////////////

	WAY.prototype.toStorage = function(options, element) {

		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions(),
			data = self.dom(element).toJSON(options),
			scope = self.dom(element).scope(),
			selector = scope ? scope + "." + options.data : options.data;

		if (options.readonly) { return false; }
		self.set(selector, data, options);

	}

	WAY.prototype.toJSON = function(options, element) {

		var self = this,
			element = element || self._element,
			data = self.dom(element).getValue(),
			options = options || self.dom(element).getOptions();

		if (_w.isArray(options.pick)) { data = selectNested(data, options.pick, true); }
		if (_w.isArray(options.omit)) { data = selectNested(data, options.omit, false); }

		return data;

	}

	//////////////////////////////
	// DOM METHODS: JSON -> DOM //
	//////////////////////////////

	WAY.prototype.fromStorage = function(options, element) {

		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions();

		if (options.writeonly) { return false; }

		var scope = self.dom(element).scope(),
				selector = scope ? scope + "." + options.data : options.data,
				data = self.get(selector);

		self.dom(element).fromJSON(data, options);

	}

	WAY.prototype.fromJSON = function(data, options, element) {

		var self = this,
				element = element || self._element,
				options = options || self.dom(element).getOptions();

		if (options.writeonly) { return false; }

		if (_w.isObject(data)) {
			if (_w.isArray(options.pick)) { data = selectNested(data, options.pick, true); }
			if (_w.isArray(options.omit)) { data = selectNested(data, options.omit, false); }
			var currentData = _w.isObject(self.dom(element).toJSON()) ? self.dom(element).toJSON() : {};
			data = _w.extend(currentData, data);
		}

		if (options.json) { data = _json.isStringified(data) ? data : _json.prettyprint(data); }

		self.dom(element).setValue(data, options);

	}

	/////////////////////////////////
	// DOM METHODS: GET - SET HTML //
	/////////////////////////////////

	WAY.prototype.getValue = function(element) {

		var self = this,
			element = element || self._element;

		var getters = {
			"SELECT": function() {
				return w.dom(element).val();
			},
			"INPUT": function() {
				var type = w.dom(element).type();
				if (_w.contains(["text", "password"], type)) {
					return w.dom(element).val();
				}
				if (_w.contains(["checkbox", "radio"], type)) {
					return w.dom(element).prop("checked") ? w.dom(element).val() : null;
				}

			},
			"TEXTAREA": function() {
				return w.dom(element).val();
			}
		}
		var defaultGetter = function(a) {
			return w.dom(element).html();
		}

		var elementType = w.dom(element).get(0).tagName;
		var getter = getters[elementType] || defaultGetter;
		return getter();

	}

	WAY.prototype._transforms = {
		uppercase: function(data) {
			return _w.isString(data) ? data.toUpperCase() : data;
		},
		lowercase: function(data) {
			return _w.isString(data) ? data.toLowerCase() : data;
		},
		reverse: function(data) {
			return data && data.split && _w.isFunction(data.split) ? data.split("").reverse().join("") : data;
		}
	};

	WAY.prototype.registerTransform = function(name, transform) {
		var self = this;
		if (_w.isFunction(transform)) { self._transforms[name] = transform; }
	}

	WAY.prototype.setValue = function(data, options, element) {

		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions();

		options.transform = options.transform || [];
		options.transform.forEach(function(transformName) {
			var transform = self._transforms[transformName] || function(data) { return data };
			data = transform(data);
		});

		var setters = {

			"SELECT": function(a) {
				w.dom(element).val(a);
			},
			"INPUT": function(a) {
				if (!_w.isString(a)) { a = JSON.stringify(a); }
				var type = w.dom(element).get(0).type;
				if (_w.contains(["text", "password"], type)) {
					w.dom(element).val(a || "");
				}
				if (_w.contains(["checkbox", "radio"], type)) {
					if (a === w.dom(element).val()) {
						w.dom(element).prop("checked", true);
					} else {
						w.dom(element).prop("checked", false);
					}
				}
			},
			"TEXTAREA": function(a) {
				if (!_w.isString(a)) { a = JSON.stringify(a); }
				w.dom(element).val(a || "");
			},
			"PRE": function(a) {
				if (options.html) {
					w.dom(element).html(a);
				} else {
					w.dom(element).text(a);
				}
			},
			"IMG": function(a) {

				if (!a) {
					a = options.default || "";
					w.dom(element).attr("src", a);
					return false;
				}

				var isValidImageUrl = function(url, cb) {
					w.dom(element).addClass("way-loading");
					w.dom("img", {
						src: url,
						onerror: function() { cb(false); },
						onload: function() { cb(true); }
					});
				}

				isValidImageUrl(a, function(response) {
					w.dom(element).removeClass("way-loading");
					if (response) {
						w.dom(element).removeClass("way-error").addClass("way-success");
					} else {
						if (a) {
							w.dom(element).addClass("way-error");
						} else {
							w.dom(element).removeClass("way-error").removeClass("way-success");
						}
						a = options.default || "";
					}
					w.dom(element).attr("src", a);
				});

			}

		}
		var defaultSetter = function(a) {

			if (options.html) {
				w.dom(element).html(a);
			} else {
				w.dom(element).text(a);
			}

		}

		var elementType = w.dom(element).get(0).tagName;
		var setter = setters[elementType] || defaultSetter;
		setter(data);

	}

	WAY.prototype.setDefault = function(force, options, element) {

		var self = this,
			element = element || self._element,
			force = force || false,
			options = options ? _w.extend(self.dom(element).getOptions(), options) : self.dom(element).getOptions();

		// Should we just set the default value in the DOM, or also in the datastore?
		if (!options.default) { return false; }
		if (force) {
			self.set(options.data, options.default, options);
		} else {
			self.dom(element).setValue(options.default, options);
		}

	}

	WAY.prototype.setDefaults = function() {

		var self = this,
			dataSelector = "[" + tagPrefix + "-default]";

		var elements = w.dom(dataSelector).get();
		for (var i in elements) {
			var element = elements[i],
					options = self.dom(element).getOptions(),
					selector = options.data || null,
					data = selector ? self.get(selector) : null;
			if (!data) { self.dom(element).setDefault(); }
		}

	}

	/////////////////////////////////////
	// DOM METHODS: GET - SET BINDINGS //
	/////////////////////////////////////

	// Scans the DOM to look for new bindings
	WAY.prototype.registerBindings = function() {

		// Dealing with bindings removed from the DOM by just resetting all the bindings all the time.
		// Isn't there a better way?
		// One idea would be to add a "way-bound" class to bound elements
		// self._bindings = {};

		var self = this;
		var selector = "[" + tagPrefix + "-data]";
		self._bindings = {};

		var elements = w.dom(selector).get();
		for (var i in elements) {
			var element = elements[i],
					options = self.dom(element).getOptions(),
					scope = self.dom(element).scope(),
					selector = scope ? scope + "." + options.data : options.data;

			self._bindings[selector] = self._bindings[selector] || [];
			if (!_w.contains(self._bindings[selector], w.dom(element).get(0))) {
				self._bindings[selector].push(w.dom(element).get(0));
			}

		}

	}

	WAY.prototype.updateBindings = function(selector) {

		var self = this;
				self._bindings = self._bindings || {};

		// Set bindings for the data selector
		var bindings = pickAndMergeParentArrays(self._bindings, selector);
		bindings.forEach(function(element) {
			var focused = (w.dom(element).get(0) === w.dom(":focus").get(0)) ? true : false;
			if (!focused) { self.dom(element).fromStorage(); }
		});

		// Set bindings for the global selector
		if (self._bindings["__all__"]) {
			self._bindings["__all__"].forEach(function(element) {
				self.dom(element).fromJSON(self.data);
			});
		}

	}

	////////////////////////////////////
	// DOM METHODS: GET - SET REPEATS //
	////////////////////////////////////

	WAY.prototype.registerRepeats = function() {

		// Register repeats
		var self = this;
		var selector = "[" + tagPrefix + "-repeat]";
		self._repeats = self._repeats || {};
		self._repeatsCount = self._repeatsCount || 0;

		var elements = w.dom(selector).get();
		for (var i in elements) {
			var element = elements[i],
					options = self.dom(element).getOptions();

			self._repeats[options.repeat] = self._repeats[options.repeat] || [];

			var wrapperAttr = tagPrefix + "-repeat-wrapper=\"" + self._repeatsCount + "\"",
					parent = w.dom(element).parent("[" + wrapperAttr + "]");
			if (!parent.length) {

				self._repeats[options.repeat].push({
					id: self._repeatsCount,
					element: w.dom(element).clone(true).removeAttr(tagPrefix + "-repeat").removeAttr(tagPrefix + "-filter").get(0),
					selector: options.repeat,
					filter: options.filter
				});

				var wrapper = document.createElement("div");
				w.dom(wrapper).attr(tagPrefix + "-repeat-wrapper", self._repeatsCount);
				w.dom(wrapper).attr(tagPrefix + "-scope", options.repeat);
				if (options.filter) { w.dom(wrapper).attr(tagPrefix + "-filter", options.filter); }

				w.dom(element).replaceWith(wrapper);
				self.updateRepeats(options.repeat);

				self._repeatsCount++;

			}

		}

	}

	/*
	WAY.prototype._filters = {
		noFalsy: function(item ) {
			if (!item) {
				return false;
			} else {
				return true;
			}
		}
	};

	WAY.prototype.registerFilter = function(name, filter) {
		var self = this;
		if (_w.isFunction(filter)) { self._filters[name] = filter; }
	}
	*/

	WAY.prototype.updateRepeats = function(selector) {

		var self = this;
			self._repeats = self._repeats || {};

		var repeats = pickAndMergeParentArrays(self._repeats, selector);

		repeats.forEach(function(repeat) {

			var wrapper = "[" + tagPrefix + "-repeat-wrapper=\"" + repeat.id + "\"]",
					data = self.get(repeat.selector),
					items = [];

			repeat.filter = repeat.filter || [];
			w.dom(wrapper).empty();

			for (var key in data) {

				/*
				var item = data[key],
						test = true;
				for (var i in repeat.filter) {
					var filterName = repeat.filter[i];
					var filter = self._filters[filterName] || function(data) { return data };
					test = filter(item);
					if (!test) { break; }
				}
				if (!test) { continue; }
				*/

				w.dom(repeat.element).attr(tagPrefix + "-scope", key);
				var html = w.dom(repeat.element).get(0).outerHTML;
				html = html.replace(/\$\$key/gi, key);
				items.push(html);

			}

			w.dom(wrapper).html(items.join(""));
			self.registerBindings();
			self.updateBindings();

		});

	}

	////////////////////////
	// DOM METHODS: FORMS //
	////////////////////////

	WAY.prototype.updateForms = function() {

		// If we just parse the forms with form2js (see commits before 08/19/2014) and set the data with way.set(),
		// we reset the entire data for this pathkey in the datastore. It causes the bug
		// reported here: https://github.com/gwendall/way.js/issues/10
		// Solution:
		// 1. watch new forms with a [way-data] attribute
		// 2. remove this attribute
		// 3. attach the appropriate attributes to its child inputs
		// -> so that each input is set separately to way.js' datastore

		var self = this;
		var selector = "form[" + tagPrefix + "-data]";

		var elements = w.dom(selector).get();
		for (var i in elements) {

			var form = elements[i],
					options = self.dom(form).getOptions(),
					formDataSelector = options.data;
			w.dom(form).removeAttr(tagPrefix + "-data");

			// Reverse needed to set the right index for "[]" names
			var inputs = w.dom(form).find("[name]").reverse().get();
			for (var i in inputs) {

				var input = inputs[i],
						name = w.dom(input).attr("name");

				if (endsWith(name, "[]")) {
					var array = name.split("[]")[0],
							arraySelector = "[name^='" + array + "']",
							arrayIndex = w.dom(form).find(arraySelector).get().length;
					name = array + "." + arrayIndex;
				}
				var selector = formDataSelector + "." + name;
				options.data = selector;
				self.dom(input).setOptions(options);
				w.dom(input).removeAttr("name");

			}

		}

	}

	/////////////////////////////////////////////
	// DOM METHODS: GET - SET ALL DEPENDENCIES //
	/////////////////////////////////////////////

	WAY.prototype.registerDependencies = function() {

		this.registerBindings();
		this.registerRepeats();

	}

	WAY.prototype.updateDependencies = function(selector) {

		this.updateBindings(selector);
		this.updateRepeats(selector);
		this.updateForms(selector);

	}

	//////////////////////////////////
	// DOM METHODS: OPTIONS PARSING //
	//////////////////////////////////

	WAY.prototype.setOptions = function(options, element) {

			var self = this,
					element = self._element || element;

			for (var k in options) {
				var attr = tagPrefix + "-" + k,
						value = options[k];
				w.dom(element).attr(attr, value);
			}

	}

	WAY.prototype.getOptions = function(element) {

		var self = this,
			element = element || self._element,
			defaultOptions = {
				data: null,
				html: false,
				readonly: false,
				writeonly: false,
				persistent: false
			};
		return _w.extend(defaultOptions, self.dom(element).getAttrs(tagPrefix));

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
				html: "boolean",
				persistent: "boolean"
			};

			var parsers = {
				array: function(value) {
					return value.split(",");
				},
				boolean: function(value) {
					if (value === "true") { return true; }
					if (value === "false") { return false; }
					return true;
				}
			};
			var defaultParser = function() { return value; };
			var valueType = attrTypes[key] || null;
			var parser = parsers[valueType] || defaultParser;

			return parser(value);

		}

		var attributes = {};
		var attrs = [].slice.call(w.dom(element).get(0).attributes);
		attrs.forEach(function(attr) {
			var include = (prefix && startsWith(attr.name, prefix + "-")) ? true : false;
			if (include) {
				var name = (prefix) ? attr.name.slice(prefix.length + 1, attr.name.length) : attr.name;
				var value = parseAttrValue(name, attr.value);
				if (_w.contains(["transform", "filter"], name)) { value = value.split("|"); }
				attributes[name] = value;
			}
		});

		return attributes;

	}

	//////////////////////////
	// DOM METHODS: SCOPING //
	//////////////////////////

	WAY.prototype.scope = function(options, element) {

		var self = this,
				element = element || self._element,
				scopeAttr = tagPrefix + "-scope",
				scopeBreakAttr = tagPrefix + "-scope-break",
				scopes = [],
				scope = "";

		var parentsSelector = "[" + scopeBreakAttr + "], [" + scopeAttr + "]";
		var elements = w.dom(element).parents(parentsSelector).get();
		for (var i in elements) {
			var el = elements[i];
			if (w.dom(el).attr(scopeBreakAttr)) { break; }
			var attr = w.dom(el).attr(scopeAttr);
			scopes.unshift(attr);
		}
		if (w.dom(element).attr(scopeAttr)) { scopes.push(w.dom(element).attr(scopeAttr)); }
		if (w.dom(element).attr(scopeBreakAttr)) { scopes = []; }

		scope = _w.compact(scopes).join(".");

		return scope;

	}

	//////////////////
	// DATA METHODS //
	//////////////////

	WAY.prototype.get = function(selector) {

		var self = this;
		if (selector !== undefined && !_w.isString(selector)) { return false; }
		if (!self.data) { return {}; }
		return selector ? _json.get(self.data, selector) : self.data;

	}

	WAY.prototype.set = function(selector, value, options) {

		if (!selector) { return false; }
		if (selector.split(".")[0] === "this") {
			console.log("Sorry, \"this\" is a reserved word in way.js");
			return false;
		}

		var self = this;
		options = options || {};

		if (selector) {

			if (!_w.isString(selector)) { return false; }
			self.data = self.data || {};
			self.data = selector ? _json.set(self.data, selector, value) : {};

			self.updateDependencies(selector);
			self.emitChange(selector, value);
			if (options.persistent) { self.backup(selector); }
		}

	}

	WAY.prototype.push = function(selector, value, options) {

		if (!selector) { return false; }

		var self = this;
		options = options || {};

		if (selector) {
			self.data = selector ? _json.push(self.data, selector, value, true) : {};
		}

		self.updateDependencies(selector);
		self.emitChange(selector, null);
		if (options.persistent) { self.backup(selector); }

	}

	WAY.prototype.remove = function(selector, options) {

		var self = this;
		options = options || {};

		if (selector) {
			self.data = _json.remove(self.data, selector);
		} else {
			self.data = {};
		}

		self.updateDependencies(selector);
		self.emitChange(selector, null);
		if (options.persistent) { self.backup(selector); }

	}

	WAY.prototype.clear = function() {

		this.remove(null, { persistent: true });

	}

	//////////////////////////
	// LOCALSTORAGE METHODS //
	//////////////////////////

	WAY.prototype.backup = function() {

		var self = this;
		if (!self.options.persistent) { return; }
		try {
			var data = self.data || {};
			localStorage.setItem(tagPrefix, JSON.stringify(data));
		} catch(e) {
			console.log("Your browser does not support localStorage.");
		}

	}

	WAY.prototype.restore = function() {

		var self = this;
		if (!self.options.persistent) { return; }
		try {
			var data = localStorage.getItem(tagPrefix);
			try {
				data = JSON.parse(data);
				for (var key in data) {
					self.set(key, data[key]);
				}
			} catch(e) {}
		} catch(e) {
			console.log("Your browser does not support localStorage.");
		}

	}

	//////////
	// MISC //
	//////////

	var matchesSelector = function(el, selector) {
		var matchers = ["matches", "matchesSelector", "webkitMatchesSelector", "mozMatchesSelector", "msMatchesSelector", "oMatchesSelector"],
				fn = null;
		for (var i in matchers) {
			fn = matchers[i];
			if (_w.isFunction(el[fn])) {
				return el[fn](selector);
			}
		}
		return false;
	}

	var startsWith = function(str, starts) {

		if (starts === "") { return true; }
		if (str === null || starts === null) { return false; }
		str = String(str); starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;

	}

	var endsWith = function(str, ends) {

		if (ends === "") { return true; }
		if (str === null || ends === null) { return false; }
		str = String(str); ends = String(ends);
		return str.length >= ends.length && str.slice(str.length - ends.length, str.length) === ends;

	}

	var cleanEmptyKeys = function(object) {

		return _w.pick(object, _w.compact(_w.keys(object)));

	}

	var filterStartingWith = function(object, string, type) { // true: pick - false: omit

		var keys = _w.keys(object);
		keys.forEach(function(key) {
			if (type) {
				if (!startsWith(key, string)) { delete object[key]; }
			} else {
				if (startsWith(key, string)) { delete object[key]; }
			}
		});
		return object;

	}

	var selectNested = function(data, keys, type) { // true: pick - false: omit

		// Flatten / unflatten to allow for nested picks / omits (doesn't work with regular pick)
		// ex:  data = {something:{nested:"value"}}
		//		keys = ['something.nested']

		var flat = _json.flatten(data);
		for (var i in keys) flat = filterStartingWith(flat, keys[i], type);
		var unflat = _json.unflatten(flat);
		// Unflatten returns an object with an empty property if it is given an empty object
		return cleanEmptyKeys(unflat);

	}

	var pickAndMergeParentArrays = function(object, selector) {

		// Example:
		// object = { a: [1,2,3], a.b: [4,5,6], c: [7,8,9] }
		// fn(object, "a.b")
		// > [1,2,3,4,5,6]

		var keys = [];
		if (selector) {

			// Set bindings for the specified selector

			// (bindings that are repeat items)
			var split = selector.split("."),
					lastKey = split[split.length - 1],
					isArrayItem = !isNaN(lastKey);

			if (isArrayItem) {
					split.pop();
					var key = split.join(".");
					keys = object[key] ? _w.union(keys, object[key]) : keys;
			}

			// (bindings with keys starting with, to include nested bindings)
			for (var key in object) {
				if (startsWith(key, selector)) { keys = _w.union(keys, object[key]); }
			}

		} else {

			// Set bindings for all selectors
			for (var key in object) {
				keys = _w.union(keys, object[key]);
			}

		}
		return keys;

	}

	var isPrintableKey = function(e) {

		var keycode = e.keyCode;
		if (!keycode) { return true; }

		var valid =
			(keycode === 8)					 || // delete
			(keycode > 47 && keycode < 58)   || // number keys
			keycode === 32 || keycode === 13   || // spacebar & return key(s) (if you want to allow carriage returns)
			(keycode > 64 && keycode < 91)   || // letter keys
			(keycode > 95 && keycode < 112)  || // numpad keys
			(keycode > 185 && keycode < 193) || // ;=,-./` (in order)
			(keycode > 218 && keycode < 223);   // [\]' (in order)

		return valid;

	}

	var escapeHTML = function(str) {
		return str && _w.isString(str) ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : str;
	}

	///////////////////////////////////////////////////
	// _w (strip of the required underscore methods) //
	///////////////////////////////////////////////////

	var _w = {};

	var ArrayProto = Array.prototype,
			ObjProto = Object.prototype,
			FuncProto = Function.prototype;

	var nativeIsArray = Array.isArray,
			nativeKeys = Object.keys,
			nativeBind = FuncProto.bind;

	var
		push             = ArrayProto.push,
		slice            = ArrayProto.slice,
		concat           = ArrayProto.concat,
		toString         = ObjProto.toString,
		hasOwnProperty   = ObjProto.hasOwnProperty;

	var flatten = function(input, shallow, strict, output) {
		if (shallow && _w.every(input, _w.isArray)) {
			return concat.apply(output, input);
		}
		for (var i = 0, length = input.length; i < length; i++) {
			var value = input[i];
			if (!_w.isArray(value) && !_w.isArguments(value)) {
				if (!strict) output.push(value);
			} else if (shallow) {
				push.apply(output, value);
			} else {
				flatten(value, shallow, strict, output);
			}
		}
		return output;
	};

	var createCallback = function(func, context, argCount) {
		if (context === void 0) return func;
		switch (argCount == null ? 3 : argCount) {
			case 1: return function(value) {
				return func.call(context, value);
			};
			case 2: return function(value, other) {
				return func.call(context, value, other);
			};
			case 3: return function(value, index, collection) {
				return func.call(context, value, index, collection);
			};
			case 4: return function(accumulator, value, index, collection) {
				return func.call(context, accumulator, value, index, collection);
			};
		}
		return function() {
			return func.apply(context, arguments);
		};
	};

	_w.compact = function(array) {
		return _w.filter(array, _w.identity);
	};

	_w.filter = function(obj, predicate, context) {
		var results = [];
		if (obj == null) return results;
		predicate = _w.iteratee(predicate, context);
		_w.each(obj, function(value, index, list) {
			if (predicate(value, index, list)) results.push(value);
		});
		return results;
	};

	_w.identity = function(value) {
		return value;
	};

	_w.every = function(obj, predicate, context) {
		if (obj == null) return true;
		predicate = _w.iteratee(predicate, context);
		var keys = obj.length !== +obj.length && _w.keys(obj),
				length = (keys || obj).length,
				index, currentKey;
		for (index = 0; index < length; index++) {
			currentKey = keys ? keys[index] : index;
			if (!predicate(obj[currentKey], currentKey, obj)) return false;
		}
		return true;
	};

	_w.union = function() {
		return _w.uniq(flatten(arguments, true, true, []));
	};

	_w.uniq = function(array, isSorted, iteratee, context) {
		if (array == null) return [];
		if (!_w.isBoolean(isSorted)) {
			context = iteratee;
			iteratee = isSorted;
			isSorted = false;
		}
		if (iteratee != null) iteratee = _w.iteratee(iteratee, context);
		var result = [];
		var seen = [];
		for (var i = 0, length = array.length; i < length; i++) {
			var value = array[i];
			if (isSorted) {
				if (!i || seen !== value) result.push(value);
				seen = value;
			} else if (iteratee) {
				var computed = iteratee(value, i, array);
				if (_w.indexOf(seen, computed) < 0) {
					seen.push(computed);
					result.push(value);
				}
			} else if (_w.indexOf(result, value) < 0) {
				result.push(value);
			}
		}
		return result;
	};

	_w.pick = function(obj, iteratee, context) {
		var result = {}, key;
		if (obj == null) return result;
		if (_w.isFunction(iteratee)) {
			iteratee = createCallback(iteratee, context);
			for (key in obj) {
				var value = obj[key];
				if (iteratee(value, key, obj)) result[key] = value;
			}
		} else {
			var keys = concat.apply([], slice.call(arguments, 1));
			obj = new Object(obj);
			for (var i = 0, length = keys.length; i < length; i++) {
				key = keys[i];
				if (key in obj) result[key] = obj[key];
			}
		}
		return result;
	};

	_w.has = function(obj, key) {
		return obj != null && hasOwnProperty.call(obj, key);
	};

	_w.keys = function(obj) {
		if (!_w.isObject(obj)) return [];
		if (nativeKeys) return nativeKeys(obj);
		var keys = [];
		for (var key in obj) if (_w.has(obj, key)) keys.push(key);
		return keys;
	};

	_w.contains = function(obj, target) {
		if (obj == null) return false;
		if (obj.length !== +obj.length) obj = _w.values(obj);
		return _w.indexOf(obj, target) >= 0;
	};

	_w.sortedIndex = function(array, obj, iteratee, context) {
		iteratee = _w.iteratee(iteratee, context, 1);
		var value = iteratee(obj);
		var low = 0, high = array.length;
		while (low < high) {
			var mid = low + high >>> 1;
			if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
		}
		return low;
	};

	_w.property = function(key) {
		return function(obj) {
			return obj[key];
		};
	};

	_w.iteratee = function(value, context, argCount) {
		if (value == null) return _w.identity;
		if (_w.isFunction(value)) return createCallback(value, context, argCount);
		if (_w.isObject(value)) return _w.matches(value);
		return _w.property(value);
	};

	_w.pairs = function(obj) {
		var keys = _w.keys(obj);
		var length = keys.length;
		var pairs = Array(length);
		for (var i = 0; i < length; i++) {
			pairs[i] = [keys[i], obj[keys[i]]];
		}
		return pairs;
	};

	_w.matches = function(attrs) {
		var pairs = _w.pairs(attrs), length = pairs.length;
		return function(obj) {
			if (obj == null) return !length;
			obj = new Object(obj);
			for (var i = 0; i < length; i++) {
				var pair = pairs[i], key = pair[0];
				if (pair[1] !== obj[key] || !(key in obj)) return false;
			}
			return true;
		};
	};

	_w.indexOf = function(array, item, isSorted) {
		if (array == null) return -1;
		var i = 0, length = array.length;
		if (isSorted) {
			if (typeof isSorted == 'number') {
				i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
			} else {
				i = _w.sortedIndex(array, item);
				return array[i] === item ? i : -1;
			}
		}
		for (; i < length; i++) if (array[i] === item) return i;
		return -1;
	};

	_w.values = function(obj) {
		var keys = _w.keys(obj);
		var length = keys.length;
		var values = Array(length);
		for (var i = 0; i < length; i++) {
			values[i] = obj[keys[i]];
		}
		return values;
	};

	_w.extend = function(obj) {
		if (!_w.isObject(obj)) return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	};

	_w.isArray = function(obj) {
		return toString.call(obj) === '[object Array]';
	};

	_w.isBoolean = function(obj) {
		return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	};

	_w.isUndefined = function(obj) {
		return obj === void 0;
	};

	_w.isObject = function(obj) {
		var type = typeof obj;
		return type === 'function' || type === 'object' && !!obj;
	};

	_w.each = function(obj, iteratee, context) {
		if (obj == null) return obj;
		iteratee = createCallback(iteratee, context);
		var i, length = obj.length;
		if (length === +length) {
			for (i = 0; i < length; i++) {
				iteratee(obj[i], i, obj);
			}
		} else {
			var keys = _w.keys(obj);
			for (i = 0, length = keys.length; i < length; i++) {
				iteratee(obj[keys[i]], keys[i], obj);
			}
		}
		return obj;
	};

	_w.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
		_w['is' + name] = function(obj) {
			return toString.call(obj) === '[object ' + name + ']';
		};
	});

	///////////////////////////////////////////////////////////
	// _json (strip of the required underscore.json methods) //
	///////////////////////////////////////////////////////////

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
				obj = obj[key] = _w.isObject(obj[key]) ? obj[key] : {};
			}

			if (remove) {
				if (_w.isArray(obj)) {
					obj.splice(keys[i], 1);
				} else {
					delete obj[keys[i]];
				}
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

	var _json = {}

	_json.VERSION = '0.1.0';
	_json.debug = true;

	_json.exit = function(source, reason, data, value) {

		if (!_json.debug) return;

		var messages = {};
		messages.noJSON = "Not a JSON";
		messages.noString = "Not a String";
		messages.noArray = "Not an Array";
		messages.missing = "Missing argument";

		var error = { source: source, data: data, value: value };
		error.message = messages[reason] ? messages[reason] : "No particular reason";
		console.log("Error", error);
		return;

	}

	_json.is = function(json) {

		return (toString.call(json) == "[object Object]");

	}

	_json.isStringified = function(string) {

		var test = false;
		try {
			test = /^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').
			replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
			replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
		} catch (e) {}
		return test;

	}

	_json.get = function(json, selector) {

		if (json == undefined) return _json.exit("get", "missing", "json", json);
		if (selector == undefined) return _json.exit("get", "missing", "selector", selector);
		if (!_w.isString(selector)) return _json.exit("get", "noString", "selector", selector);
		return deepJSON(json, selector);

	};

	_json.set = function(json, selector, value) {

		if (json == undefined) return _json.exit("set", "missing", "json", json);
		if (selector == undefined) return _json.exit("set", "missing", "selector", selector);
		if (!_w.isString(selector)) return _json.exit("set", "noString", "selector", selector);
		return value ? deepJSON(json, selector, value) : _json.remove(json, selector);
		// return deepJSON(json, selector, value); // Now removes the property if the value is empty. Maybe should keep it instead?

	};

	_json.remove = function(json, selector) {

		if (json == undefined) return _json.exit("remove", "missing", "json", json);
		if (selector == undefined) return _json.exit("remove", "missing", "selector", selector);
		if (!_w.isString(selector)) return _json.exit("remove", "noString", "selector", selector);
		return deepJSON(json, selector, null, true);

	}

	_json.push = function(json, selector, value, force) {

		if (json == undefined) return _json.exit("push", "missing", "json", json);
		if (selector == undefined) return _json.exit("push", "missing", "selector", selector);
		var array = _json.get(json, selector);
		if (!_w.isArray(array)) {
			if (force) {
				array = [];
			} else {
				return _json.exit("push", "noArray", "array", array);
			}
		}
		array.push(value);
		return _json.set(json, selector, array);

	}

	_json.unshift = function(json, selector, value) {

		if (json == undefined) return _json.exit("unshift", "missing", "json", json);
		if (selector == undefined) return _json.exit("unshift", "missing", "selector", selector);
		if (value == undefined) return _json.exit("unshift", "missing", "value", value);
		var array = _json.get(json, selector);
		if (!_w.isArray(array)) return _json.exit("unshift", "noArray", "array", array);
		array.unshift(value);
		return _json.set(json, selector, array);

	}

	_json.flatten = function(json) {

		if (json.constructor.name != "Object") return _json.exit("flatten", "noJSON", "json", json);

		var result = {};
		function recurse (cur, prop) {
			if (Object(cur) !== cur) {
				result[prop] = cur;
			} else if (Array.isArray(cur)) {
				for (var i = 0, l = cur.length; i < l; i++) {
					recurse(cur[i], prop ? prop + "." + i : "" + i);
					if (l == 0) result[prop] = [];
				}
			} else {
				var isEmpty = true;
				for (var p in cur) {
					isEmpty = false;
					recurse(cur[p], prop ? prop + "." + p : p);
				}
				if (isEmpty) result[prop] = {};
			}
		}
		recurse(json, "");
		return result;

	}

	_json.unflatten = function(data) {

		if (Object(data) !== data || Array.isArray(data))
			return data;
		var result = {}, cur, prop, idx, last, temp;
		for (var p in data) {
			cur = result, prop = "", last = 0;
			do {
				idx = p.indexOf(".", last);
				temp = p.substring(last, idx !== -1 ? idx : undefined);
				cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
				prop = temp;
				last = idx + 1;
			} while(idx >= 0);
			cur[prop] = data[p];
		}
		return result[""];

	}

	_json.prettyprint = function(json) {

		return JSON.stringify(json, undefined, 2);

	}

	//////////////////////////////////////////
	// wQuery (mini replacement for jQuery) //
	//////////////////////////////////////////

	var wQuery = function () {};
	wQuery.constructor = wQuery;

	wQuery.prototype.dom = function(selector, createOptions) {

		var self = this,
				elements = [];

		if (createOptions) {
			var element = document.createElement(selector);
			for (var k in createOptions) {
				element[k] = createOptions[k];
			}
		} else {
			if (_w.isString(selector)) {
				elements = [].slice.call(document.querySelectorAll(selector));
			} else {
				if (_w.isObject(selector) && selector.attributes) { elements = [selector]; }
			}
			self._elements = elements;
			self.length = elements.length;
			return self;
		}

	}

	wQuery.prototype.on = function(events, fn) {

		var self = this,
				elements = self._elements;
		events = events.split(" ");
		for (var i = 0, lenEl = elements.length; i < lenEl; i++) {
			var element = elements[i];
			for (var j = 0, lenEv = events.length; j < lenEv; j++) {
				if (element.addEventListener) { element.addEventListener(events[j], fn, false); }
			}
		}

	}

	wQuery.prototype.find = function(selector) {

			var self = this,
					element = self.get(0),
					elements = [];

			if (_w.isString(selector)) {
				elements = [].slice.call(element.querySelectorAll(selector));
			}
			self._elements = elements;
			return self;

	}

	wQuery.prototype.get = function(index, chain) {

			var self = this,
					elements = self._elements || [],
					element = elements[index] || {};

			if (chain) {
				self._element = element;
				return self;
			} else {
				return _w.isNumber(index) ? element : elements;
			}

	}

	wQuery.prototype.reverse = function() {
		this._elements = this._elements.reverse();
		return this;
	}

	wQuery.prototype.val = function(value) {
		return this.prop("value", value);
	}

	wQuery.prototype.type = function(value) {
		return this.prop("type", value);
	}

	wQuery.prototype.html = function(value) {
		return this.prop("innerHTML", value);
	}

	wQuery.prototype.text = function(value) {
		return this.prop("innerHTML", escapeHTML(value));
	}

	wQuery.prototype.prop = function(prop, value) {

		var self = this,
				elements = self._elements;

		for (var i in elements) {
			if (_w.isUndefined(value)) {
				return elements[i][prop];
			} else {
				elements[i][prop] = value;
			}
		}

	}

	wQuery.prototype.attr = function(attr, value) {

		var self = this,
				elements = self._elements;
		for (var i in elements) {
			if (value === undefined) {
				return elements[i].getAttribute(attr);
			} else {
				elements[i].setAttribute(attr, value);
			}
		}
		return self;

	}

	wQuery.prototype.removeAttr = function(attr) {
		var self = this;
		for (var i in self._elements) self._elements[i].removeAttribute(attr);
		return self;
	}

	wQuery.prototype.addClass = function(c) {
		var self = this;
		for (var i in self._elements) self._elements[i].classList.add(c);
		return self;
	}

	wQuery.prototype.removeClass = function(c) {
		var self = this;
		for (var i in self._elements) self._elements[i].classList.remove(c);
		return self;
	}

	wQuery.prototype.parents = function(selector) {
		var self = this,
				element = self.get(0),
				parent = element.parentNode,
				parents = [];

		while (parent !== null) {
			var o = parent,
					matches = matchesSelector(o, selector),
					isNotDomRoot = (o.doctype === undefined) ? true : false;
			if (!selector) { matches = true; }
			if (matches && isNotDomRoot) { parents.push(o); }
			parent = o.parentNode;
		}
		self._elements = parents;
		return self;
	}

	wQuery.prototype.parent = function(selector) {
		var self = this,
				element = self.get(0),
				o = element.parentNode,
				matches = matchesSelector(o, selector);
		if (!selector) { matches = true; }
		return matches ? o : {};
	}

	wQuery.prototype.clone = function(chain) {
		var self = this,
				element = self.get(0),
				clone = element.cloneNode(true);
		self._elements = [clone];
		return chain ? self : clone;
	}

	wQuery.prototype.empty = function(chain) {
		var self = this,
				element = self.get(0);
		if (!element || !element.hasChildNodes) { return chain ? self : element; }

		while (element.hasChildNodes()) {
			element.removeChild(element.lastChild);
		}
		return chain ? self : element;
	}

	wQuery.prototype.replaceWith = function(newDOM) {
		var self = this,
				oldDOM = self.get(0),
				parent = oldDOM.parentNode;
		parent.replaceChild(newDOM, oldDOM);
	}

	wQuery.prototype.ready = function(callback) {

		if (document && _w.isFunction(document.addEventListener)) {
			document.addEventListener("DOMContentLoaded", callback, false);
		} else if (window && _w.isFunction(window.addEventListener)) {
			window.addEventListener("load", callback, false);
		} else {
			document.onreadystatechange = function() {
				if (document.readyState === "complete") { callback(); }
			}
		}

	}

	//////////////////////
	// WATCH DOM EVENTS //
	//////////////////////

	way = new WAY();

	var timeoutInput = null;
	var eventInputChange = function(e) {
		if (timeoutInput) { clearTimeout(timeoutInput); }
		timeoutInput = setTimeout(function() {
			var element = w.dom(e.target).get(0);
			way.dom(element).toStorage();
		}, way.options.timeout);
	}

	var eventClear = function(e) {
		e.preventDefault();
		var options = way.dom(this).getOptions();
		way.remove(options.data, options);
	}

	var eventPush = function(e) {
		e.preventDefault();
		var options = way.dom(this).getOptions();
		if (!options || !options["action-push"]) { return false; }
		var split = options["action-push"].split(":"),
				selector = split[0] || null,
				value = split[1] || null;
		way.push(selector, value, options);
	}

	var eventRemove = function(e) {
		e.preventDefault();
		var options = way.dom(this).getOptions();
		if (!options || !options["action-remove"]) { return false; }
		way.remove(options["action-remove"], options);
	}

	var timeoutDOM = null;
	var eventDOMChange = function() {

		// We need to register dynamically added bindings so we do it by watching DOM changes
		// We use a timeout since "DOMSubtreeModified" gets triggered on every change in the DOM (even input value changes)
		// so we can limit the number of scans when a user is typing something
		if (timeoutDOM) { clearTimeout(timeoutDOM); }
		timeoutDOM = setTimeout(function() {
			way.registerDependencies();
			setEventListeners();
		}, way.options.timeoutDOM);

	}

	//////////////
	// INITIATE //
	//////////////

	w = new wQuery();
	way.w = w;

	var setEventListeners = function() {

			w.dom("body").on("DOMSubtreeModified", eventDOMChange);
			w.dom("[" + tagPrefix + "-data]").on("input change", eventInputChange);
			w.dom("[" + tagPrefix + "-clear]").on("click", eventClear);
			w.dom("[" + tagPrefix + "-action-remove]").on("click", eventRemove);
			w.dom("[" + tagPrefix + "-action-push]").on("click", eventPush);

	}

	var eventInit = function() {

		setEventListeners();
		way.restore();
		way.setDefaults();
		way.registerDependencies();
		way.updateDependencies();

	}

	w.ready(eventInit);

	return way;

}));
