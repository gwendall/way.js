//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?void(this._wrapped=n):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.6.0";var A=j.each=j.forEach=function(n,t,e){if(null==n)return n;if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return;return n};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var O="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(O);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(O);return r},j.find=j.detect=function(n,t,r){var e;return k(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var k=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:k(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,j.property(t))},j.where=function(n,t){return j.filter(n,j.matches(t))},j.findWhere=function(n,t){return j.find(n,j.matches(t))},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);var e=-1/0,u=-1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;o>u&&(e=n,u=o)}),e},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);var e=1/0,u=1/0;return A(n,function(n,i,a){var o=t?t.call(r,n,i,a):n;u>o&&(e=n,u=o)}),e},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return null==t||r?(n.length!==+n.length&&(n=j.values(n)),n[j.random(n.length-1)]):j.shuffle(n).slice(0,Math.max(0,t))};var E=function(n){return null==n?j.identity:j.isFunction(n)?n:j.property(n)};j.sortBy=function(n,t,r){return t=E(t),j.pluck(j.map(n,function(n,e,u){return{value:n,index:e,criteria:t.call(r,n,e,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=E(r),A(t,function(i,a){var o=r.call(e,i,a,t);n(u,o,i)}),u}};j.groupBy=F(function(n,t,r){j.has(n,t)?n[t].push(r):n[t]=[r]}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=E(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:0>t?[]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.partition=function(n,t){var r=[],e=[];return A(n,function(n){(t(n)?r:e).push(n)}),[r,e]},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.contains(t,n)})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){for(var r=0,e=t.slice(),u=0,i=e.length;i>u;u++)e[u]===j&&(e[u]=arguments[r++]);for(;r<arguments.length;)e.push(arguments[r++]);return n.apply(this,e)}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:j.now(),a=null,i=n.apply(e,u),e=u=null};return function(){var l=j.now();o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u),e=u=null):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o,c=function(){var l=j.now()-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u),i=u=null))};return function(){i=this,u=arguments,a=j.now();var l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u),i=u=null),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return j.partial(t,n)},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=function(n){if(!j.isObject(n))return[];if(w)return w(n);var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o)&&"constructor"in n&&"constructor"in t)return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.constant=function(n){return function(){return n}},j.property=function(n){return function(t){return t[n]}},j.matches=function(n){return function(t){if(t===n)return!0;for(var r in n)if(n[r]!==t[r])return!1;return!0}},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},j.now=Date.now||function(){return(new Date).getTime()};var T={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};T.unescape=j.invert(T.escape);var I={escape:new RegExp("["+j.keys(T.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(T.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(I[n],function(t){return T[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}}),"function"==typeof define&&define.amd&&define("underscore",[],function(){return j})}).call(this);
//# sourceMappingURL=underscore-min.map
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

!function(root) {

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
		if (!_.contains(this._watchersAll, handler)) { this._watchersAll.push(handler); }

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
		var watchers = _.keys(this._watchers);
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
			if (this._watchers[item]) {
				this._watchers[item].forEach(function(handler) {
					handler.apply(self, [self.get(item)]);
				});
			}
		});

		// Send data down to the global watchers
		if (!self._watchersAll || !_.isArray(self._watchersAll)) { return; }
		self._watchersAll.forEach(function(watcher) {
			if (_.isFunction(watcher)) { watcher.apply(self, [selector, self.get(selector)]); }
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

		if (_.isArray(options.pick)) { data = selectNested(data, options.pick, true); }
		if (_.isArray(options.omit)) { data = selectNested(data, options.omit, false); }

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

		if (_.isObject(data)) {
			if (_.isArray(options.pick)) { data = selectNested(data, options.pick, true); }
			if (_.isArray(options.omit)) { data = selectNested(data, options.omit, false); }
			var currentData = _.isObject(self.dom(element).toJSON()) ? self.dom(element).toJSON() : {};
			data = _.extend(currentData, data);
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
				if (_.contains(["text", "password"], type)) {
					return w.dom(element).val();
				}
				if (_.contains(["checkbox", "radio"], type)) {
					return w.dom(element).prop("checked") ? w.dom(element).val() : null;
				}

			},
			"TEXTAREA": function() {
				return w.dom(element).val();
			}
		}
		var defaultGetter = function(a) {
			w.dom(element).html();
		}

		var elementType = w.dom(element).get(0).tagName;
		var getter = getters[elementType] || defaultGetter;
		return getter();

	}

	WAY.prototype.setValue = function(data, options, element) {

		var self = this,
			element = element || self._element,
			options = options || self.dom(element).getOptions();

		var setters = {

			"SELECT": function(a) {
				w.dom(element).val(a);
			},
			"INPUT": function(a) {
				if (!_.isString(a)) { a = JSON.stringify(a); }
				var type = w.dom(element).get(0).type;
				if (_.contains(["text", "password"], type)) {
					w.dom(element).val(a || "");
				}
				if (_.contains(["checkbox", "radio"], type)) {
					if (a === w.dom(element).val()) {
						w.dom(element).prop("checked", true);
					} else {
						w.dom(element).prop("checked", false);
					}
				}
			},
			"TEXTAREA": function(a) {
				if (!_.isString(a)) { a = JSON.stringify(a); }
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
			options = options ? _.extend(self.dom(element).getOptions(), options) : self.dom(element).getOptions();

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
			if (!_.contains(self._bindings[selector], w.dom(element).get(0))) {
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
					element: w.dom(element).clone(true).removeAttr(tagPrefix + "-repeat").get(0),
					selector: options.repeat
				});

				var wrapper = document.createElement("div");
				w.dom(wrapper).attr(tagPrefix + "-repeat-wrapper", self._repeatsCount);
				w.dom(wrapper).attr(tagPrefix + "-scope", options.repeat);
				w.dom(element).replaceWith(wrapper);
				self.updateRepeats(options.repeat);

				self._repeatsCount++;

			}

		}

	}

	WAY.prototype.updateRepeats = function(selector) {

		var self = this;
			self._repeats = self._repeats || {};

		var repeats = pickAndMergeParentArrays(self._repeats, selector);

		repeats.forEach(function(repeat) {

			var wrapper = "[" + tagPrefix + "-repeat-wrapper=\"" + repeat.id + "\"]",
					data = self.get(repeat.selector),
					items = [];

			w.dom(wrapper).empty();
			for (var key in data) {
				w.dom(repeat.element).attr(tagPrefix + "-scope", key);
				var html = w.dom(repeat.element).get(0).outerHTML;
				html = html.replace(/\$\$key/gi, key);
				items.push(html);
			}

			w.dom(wrapper).html(items);
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
		var attrs = w.dom(element).get(0).attributes;
		for (var i in attrs) {
			var attr = attrs[i];
			var include = (prefix && startsWith(attr.name, prefix + "-")) ? true : false;
			if (include) {
				var name = (prefix) ? attr.name.slice(prefix.length + 1, attr.name.length) : attr.name;
				var value = parseAttrValue(name, attr.value);
				attributes[name] = value;
			}
		}

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

		scope = scopes.join(".");

		return scope;

	}

	//////////////////
	// DATA METHODS //
	//////////////////

	WAY.prototype.get = function(selector) {

		var self = this;
		if (selector !== undefined && !_.isString(selector)) { return false; }
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

			if (!_.isString(selector)) { return false; }
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

		return _.pick(object, _.compact(_.keys(object)));

	}

	var filterStartingWith = function(object, string, type) { // true: pick - false: omit

		var keys = _.keys(object);
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
					keys = object[key] ? _.union(keys, object[key]) : keys;
			}

			// (bindings with keys starting with, to include nested bindings)
			for (var key in object) {
				if (startsWith(key, selector)) { keys = _.union(keys, object[key]); }
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
		return str ? str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : str;
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
			if (_.isString(selector)) {
				elements = [].slice.call(document.querySelectorAll(selector));
			} else {
				if (_.isObject(selector) && selector.attributes) { elements = [selector]; }
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

			if (_.isString(selector)) {
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
				return _.isNumber(index) ? element : elements;
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
			if (_.isUndefined(value)) {
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
					matches = selector && o.matches ? o.matches(selector) : true,
					isDocument = (o.doctype !== undefined) ? true : false;
			if (matches && !isDocument) { parents.push(o); }
			parent = o.parentNode;
		}
		self._elements = parents;
		return self;
	}

	wQuery.prototype.parent = function(selector) {
		var self = this,
				element = self.get(0),
				parent = element.parentNode,
				matches = selector ? parent.matches(selector) : true;
		return matches ? parent : {};
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
		var doc = document;
		document.onreadystatechange = function() {
			if (document.readyState === "complete") { callback(); }
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

	root.way = way;

}(this);
