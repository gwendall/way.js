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
			data = self.dom(element).toJSON(options),
			scope = self.dom(element).scope(),
			selector = scope ? scope + '.' + options.data : options.data;

		if (options.readonly) return false;
		self.set(selector, data, options);

	}

	WAY.prototype.toJSON = function(options, element) {

		var self = this,
			element = element || self._element,
			data = self.dom(element).getValue(),
			options = options || self.dom(element).getOptions();

		if (_.isArray(options.pick)) data = selectNested(data, options.pick, true);
		if (_.isArray(options.omit)) data = selectNested(data, options.omit, false);

		return data;

	}

	//////////////////////////////
	// DOM METHODS: JSON -> DOM //
	//////////////////////////////

	WAY.prototype.fromStorage = function(options, element) {

		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions();

		if (options.writeonly) return false;

		var scope = self.dom(element).scope(),
				selector = scope ? scope + '.' + options.data : options.data,
				data = self.get(selector);

		self.dom(element).fromJSON(data, options);

	}

	WAY.prototype.fromJSON = function(data, options, element) {

		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions();

		if (options.writeonly) return false;

		if (_.isObject(data)) {
			if (_.isArray(options.pick)) data = selectNested(data, options.pick, true);
			if (_.isArray(options.omit)) data = selectNested(data, options.omit, false);
			var currentData = _.isObject(self.dom(element).toJSON()) ? self.dom(element).toJSON() : {};
			data = _.extend(currentData, data);
		}

		if (options.json) {
			data = _json.isStringified(data) ? data : _json.prettyprint(data);
		}

		self.dom(element).setValue(data, options);

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
			'SELECT': function() {
				return $(element).val();
			},
			'INPUT': function() {
				var type = $(element).get(0).type;
				if (_.contains(["text", "password"], type)) {
					return $(element).val();
				}
				if (_.contains(["checkbox", "radio"], type)) {
					return $(element).prop("checked") ? $(element).val() : null;
				}

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
			'SELECT': function(a) {
				if (a == $(element).val()) $(element).prop("selected", true);
				else $(element).removeAttr("selected");
			},
			'INPUT': function(a) {
				if (!_.isString(a)) a = JSON.stringify(a);
				var type = $(element).get(0).type;
				if (_.contains(["text", "password"], type)) $(element).val(a || '');
				if (_.contains(["checkbox", "radio"], type)) {
					if (a == $(element).val()) $(element).prop("checked", true);
					else $(element).removeAttr("checked");
				}
			},
			'TEXTAREA': function(a) {
				if (!_.isString(a)) a = JSON.stringify(a);
				$(element).val(a || '');
			},
			'PRE': function(a) {
				if (options.html) $(element).html(a);
				else $(element).text(a);
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

			if (options.html) $(element).html(a);
			else $(element).text(a);

		}

		var elementType = $(element).get(0).tagName;
		var setter = setters[elementType] || defaultSetter;
		setter(data);

	}

	WAY.prototype.setDefault = function(force, options, element) {

		var self = this,
			element = element || self._element,
			force = force || false,
			options = options ? _.extend(self.dom(element).getOptions(), options) : self.dom(element).getOptions();

		// Should we just set the default value in the DOM, or also in the datastore?
		if (!options.default) return false;
		if (force) {
			self.set(options.data, options.default, options);
		} else {
			self.dom(element).setValue(options.default, options);
		}

	}

	WAY.prototype.setDefaults = function() {

		var self = this,
			dataSelector = "[" + tagPrefix + "-default]";

		$(dataSelector).each(function() {
			var options = self.dom(this).getOptions(),
					selector = options.data || null,
					data = selector ? self.get(selector) : null;
			if (!data) self.dom(this).setDefault();
		});

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

		$(selector).each(function() {
			var element = this,
				options = self.dom(element).getOptions();
			self._bindings[options.data] = self._bindings[options.data] || [];
			if (!containsDomElement(self._bindings[options.data], element)) {
				self._bindings[options.data].push($(element));
			}

		});

	}

	WAY.prototype.updateBindings = function(selector) {

		var self = this;
			self._bindings = self._bindings || {};

		// Set bindings for the data selector
		var bindings = pickAndMergeParentArrays(self._bindings, selector);
		bindings.forEach(function(element) {
			var focused = (($(element).get(0).tagName == "FORM") && ($(element).get(0) == $(':focus').parents("form").get(0))) ? true : false;
			if (!focused) self.dom(element).fromStorage();
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

		$(selector).each(function() {
			var element = this,
				options = self.dom(element).getOptions();
			self._repeats[options.repeat] = self._repeats[options.repeat] || [];

			var wrapperAttr = tagPrefix + '-repeat-wrapper="' + self._repeatsCount + '"';
			if (!$(element).parent("[" + wrapperAttr + "]").length) {

				self._repeats[options.repeat].push({
					id: self._repeatsCount,
					element: $(element).clone().removeAttr(tagPrefix + "-repeat"),
					selector: options.repeat
				});

				var wrapper = document.createElement('div');
				$(wrapper).attr(tagPrefix + "-repeat-wrapper", self._repeatsCount);
				$(wrapper).attr(tagPrefix + "-scope", options.repeat);
				$(element).replaceWith(wrapper);
				self.updateRepeats(options.repeat);

				self._repeatsCount++;

			}

		});

	}

	WAY.prototype.updateRepeats = function(selector) {

		var self = this;
			self._repeats = self._repeats || {};

		var repeats = pickAndMergeParentArrays(self._repeats, selector);
		repeats.forEach(function(repeat) {

			var wrapper = "[" + tagPrefix + "-repeat-wrapper='" + repeat.id + "']",
				data = self.get(repeat.selector),
				items = [];

			if (data && (data.length == $(wrapper + " > *").length)) return;

			$(wrapper).empty();
			for (var key in data) {
				repeat.element.attr(tagPrefix + "-scope", key);
//			var _this = repeat.selector + '.' + key,
				var html = repeat.element.get(0).outerHTML;
//			html = html.replace(/\$\$this/gi, _this);
				html = html.replace(/\$\$key/gi, key);
				items.push(html);
			}
			$(wrapper).html(items);
			self.registerBindings();
			self.updateBindings();

		});

	}

	////////////////////////
	// DOM METHODS: FORMS //
	////////////////////////

	WAY.prototype.updateForms = function() {

		// If we just parse the forms with form2js and set the data with way.set(),
		// we have to reset the entire data for this element. It can cause the bug
		// reported here: https://github.com/gwendall/way.js/issues/10
		// Solution:
		// 1. watch new forms with a [way-data] attribute
		// 2. remove this attribute
		// 3. attach the appropriate attribure to its inputs
		// -> so that each input is set separately to way.js' datastore

		var self = this;
		var selector = "form[" + tagPrefix + "-data]";

		$(selector).each(function() {

			var form = this,
					options = self.dom(form).getOptions(),
					formDataSelector = options.data;
			$(form).removeAttr(tagPrefix + "-data");

			// Reverse needed to set the right index for "[]" names
			var inputsSelector = $(form).find("[name]").get().reverse();
			$(inputsSelector).each(function() {

				var input = this,
						name = $(input).attr("name");

				if (endsWith(name, "[]")) {
					var array = name.split("[]")[0],
							arraySelector = "[name^='" + array + "']",
							arrayIndex = $(form).find(arraySelector).length;
					name = array + '.' + arrayIndex;
				}
				var selector = formDataSelector + '.' + name;
				options.data = selector;
				self.dom(input).setOptions(options);
				$(input).removeAttr("name");

			});

		});

	}

	/////////////////////////////////////////////
	// DOM METHODS: GET - SET ALL DEPENDENCIES //
	/////////////////////////////////////////////

	WAY.prototype.registerDependencies = function() {

		this.registerBindings();
		this.registerRepeats();

	}

	WAY.prototype.updateDependencies = function() {

		this.updateBindings();
		this.updateRepeats();
		this.updateForms();

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
				$(element).attr(attr, value);
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
				html: "boolean",
				persistent: "boolean"
			};

			var parsers = {
				array: function(value) {
					return value.split(',');
				},
				boolean: function(value) {
					if (value == "true") return true;
					if (value == "false") return false;
					return true;
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

	//////////////////////////
	// DOM METHODS: SCOPING //
	//////////////////////////

	WAY.prototype.scope = function(options, element) {

		var self = this,
			element = element || self._element,
			scopeAttr = tagPrefix + '-scope',
			scopeBreakAttr = tagPrefix + '-scope-break',
			scopes = [],
			scope = '';

		$(element).parents('['+scopeBreakAttr+'], ['+scopeAttr+']').each(function() {
			if ($(this).attr(scopeBreakAttr)) return false;
			scopes.unshift($(this).attr(scopeAttr));
		});
		if ($(element).attr(scopeAttr)) scopes.push($(element).attr(scopeAttr));
		if ($(element).attr(scopeBreakAttr)) scopes = [];

		scope = scopes.join('.');

		return scope;

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

		if (!selector) return false;
		if (selector.split(".")[0] === "this") {
			console.log('Sorry, "this" is a reserved word in way.js');
			return false;
		}

		var self = this;
		options = options || {};

		if (selector) {

			if (!_.isString(selector)) return false;
			self.data = self.data || {};
			self.data = selector ? _json.set(self.data, selector, value) : {};

			self.updateDependencies(selector);
			self.emitChange(selector, value);
			if (options.persistent) self.backup(selector);
		}

	}

	WAY.prototype.push = function(selector, value, options) {

		if (!selector) return false;

		var self = this;
		options = options || {};

		if (selector) {
			self.data = selector ? _json.push(self.data, selector, value, true) : {};
		}

		self.updateDependencies(selector);
		self.emitChange(selector, null);
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

		self.updateDependencies(selector);
		self.emitChange(selector, null);
		if (options.persistent) self.backup(selector);

	}

	WAY.prototype.clear = function() {

		this.remove(null, { persistent: true });

	}

	//////////////////////////
	// LOCALSTORAGE METHODS //
	//////////////////////////

	WAY.prototype.backup = function() {

		var self = this;
		if (!self.options.persistent) return;
		try {
			var data = self.data || {};
			localStorage.setItem(tagPrefix, JSON.stringify(data));
		} catch(e) {
			console.log("Your browser does not support localStorage.");
		}

	}

	WAY.prototype.restore = function() {

		var self = this;
		if (!self.options.persistent) return;
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

	var startsWith = function(str, starts) {

		if (starts === '') return true;
		if (str == null || starts == null) return false;
		str = String(str); starts = String(starts);
		return str.length >= starts.length && str.slice(0, starts.length) === starts;

	}

	var endsWith = function(str, ends) {

		if (ends === '') return true;
		if (str == null || ends == null) return false;
		str = String(str); ends = String(ends);
		return str.length >= ends.length && str.slice(str.length - ends.length, str.length) === ends;

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

	var cleanEmptyKeys = function(object) {

		return _.pick(object, _.compact(_.keys(object)));

	}

	var filterStartingWith = function(object, string, type) { // true: pick - false: omit

		var keys = _.keys(object);
		keys.forEach(function(key) {
			if (type) {
				if (!startsWith(key, string)) delete object[key];
			} else {
				if (startsWith(key, string)) delete object[key];
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
			// Set bindings for the specified selector (bindings with keys starting with, to include nested bindings)
			for (var key in object) {
				if (startsWith(key, selector)) keys = _.union(keys, object[key]);
			}
		} else {
			// Set bindings for all selectors
			for (var key in object) {
				keys = _.union(keys, object[key]);
			}
		}
		return keys;

	}

	var isPrintableKey = function(e) {

		var keycode = e.keyCode;
		if (!keycode) return true;

		var valid =
			(keycode == 8)					 || // delete
			(keycode > 47 && keycode < 58)   || // number keys
			keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
			(keycode > 64 && keycode < 91)   || // letter keys
			(keycode > 95 && keycode < 112)  || // numpad keys
			(keycode > 185 && keycode < 193) || // ;=,-./` (in order)
			(keycode > 218 && keycode < 223);   // [\]' (in order)

		return valid;

	}

	///////////////////////////////////
	// INITIATE AND WATCH DOM EVENTS //
	///////////////////////////////////

	way = new WAY();

	var timeoutDOM = null;
	$(document).ready(function() {

		way.restore();
		way.setDefaults();
		way.registerDependencies();

		// We need to register dynamically added bindings so we do it by watching DOM changes
		// We use a timeout since "DOMSubtreeModified" gets triggered on every change in the DOM (even input value changes)
		// so we can limit the number of scans when a user is typing something
		$("body").bind("DOMSubtreeModified", function() {

			if (timeoutDOM) clearTimeout(timeoutDOM);
			timeoutDOM = setTimeout(function() {
				way.registerDependencies();
			}, way.options.timeoutDOM);

		});

	});

	var timeoutInput = null;
	/*
	$(document).on("input keyup change", "form[" + tagPrefix + "-data] :input", function(e) {

		if (!isPrintableKey(e)) return;
		if (timeoutInput) clearTimeout(timeoutInput);
		timeoutInput = setTimeout(function() {
			var element = $(e.target).parents("form");
			way.dom(element).toStorage();
		}, way.options.timeoutInput);

	});
	*/

	$(document).on("input change", ":input[" + tagPrefix + "-data]", function(e) {

		// if (!isPrintableKey(e)) return;
		if (timeoutInput) clearTimeout(timeoutInput);
		timeoutInput = setTimeout(function() {
			var element = $(e.target);
			way.dom(element).toStorage();
		}, way.options.timeout);

	});

	$(document).on("click", "[" + tagPrefix + "-clear]", function(e) {

		e.preventDefault();
		var options = way.dom(this).getOptions();
		way.remove(options.data, options);

	});

	$(document).on("click", "[" + tagPrefix + "-action-push]", function(e) {

		e.preventDefault();
		var options = way.dom(this).getOptions();
		if (!options || !options["action-push"]) return;
		var split = options["action-push"].split(":"),
			selector = split[0] || null,
			value = split[1] || null;
		way.push(selector, value, options);

	});

	$(document).on("click", "[" + tagPrefix + "-action-remove]", function(e) {

		e.preventDefault();
		var options = way.dom(this).getOptions();
		if (!options || !options["action-remove"]) return;
		way.remove(options["action-remove"], options);

	});

}).call(this);
