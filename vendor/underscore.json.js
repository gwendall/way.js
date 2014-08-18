//	Underscore.json
//	(c) 2010 Gwendall Esnault <gwendall.esnault@gmail.com>
//	Underscore.json is freely distributable under the terms of the MIT license.
//	Documentation: https://github.com/gwendall/underscore.json
//	Bits of code taken from:
//	- https://gist.github.com/furf/3208381
//  - http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
//	Version '0.1.0'

!function(root, String) {

	'use strict';

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
				if (_.isArray(obj)) {
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
		console.log('Error', error);
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
		if (!_.isString(selector)) return _json.exit("get", "noString", "selector", selector);
		return deepJSON(json, selector);

	};

	_json.set = function(json, selector, value) {

		if (json == undefined) return _json.exit("set", "missing", "json", json);
		if (selector == undefined) return _json.exit("set", "missing", "selector", selector);
		if (!_.isString(selector)) return _json.exit("set", "noString", "selector", selector);
		return value ? deepJSON(json, selector, value) : _json.remove(json, selector);
		// return deepJSON(json, selector, value); // Now removes the property if the value is empty. Maybe should keep it instead?

	};

	_json.remove = function(json, selector) {

		if (json == undefined) return _json.exit("remove", "missing", "json", json);
		if (selector == undefined) return _json.exit("remove", "missing", "selector", selector);
		if (!_.isString(selector)) return _json.exit("remove", "noString", "selector", selector);
		return deepJSON(json, selector, null, true);

	}

	_json.push = function(json, selector, value, force) {

		if (json == undefined) return _json.exit("push", "missing", "json", json);
		if (selector == undefined) return _json.exit("push", "missing", "selector", selector);
		var array = _json.get(json, selector);
		if (!_.isArray(array)) {
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
		if (!_.isArray(array)) return _json.exit("unshift", "noArray", "array", array);
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

	// Integrate with Underscore.js if defined
	// or create our own underscore object.
	root._ = root._ || {};
	root._.json = _json;
	root._json = _json;

}(this, String);
