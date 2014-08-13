way.js
======

Simple, lightweight, persistent, framework-agnostic two-way databinding (with very little javascript)
Two-way databinding is useful, but you may not want to use a whole framework to enjoy it.

## Quick start ##

Declare an HTML element with some tags.

```html

  <form way-data="myFormData" way-persistent="true">
  	<input type="text" name="name">
  	<input type="text" name="age">
  	<input type="text" name="gender">
  </form>

  Name: <span way-data="myFormData.name"></span>

```

Boom. Now every change in the form will be stored in-memory. The binded span's html will be changed on the fly. And the form data will be persistent, meaning it will be populated with your typed data on page reloads.

Enough talk, [see it in action](https://gwendall.github.io/way).


## Installation ##

Include the script with its dependencies

```html
<script src="/vendor/jquery.js"></script>
<script src="/vendor/underscore.js"></script>
<script src="/vendor/underscore.json.js"></script>
<script src="/vendor/form2js.js"></script>
<script src="/vendor/js2form.js"></script>
<script src="/way.min.js"></script>
```

## Options ##

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to way-, as in way-data="".
Set these options to the elements that have to be binded.

Name | Type | Default | Desription
----|------|---- | ----
data | string | null | Allows to define the dot separated path where the data will be stored. Can include arrays. When used on a form, a json variable made of all the included inputs with a [name] attribute will be created and stored in the specified storage.
default | string | null | A link to a default data to set on an element, in case there is no binded value.
persistent | boolean | true | Allows to store the data to localStorage everytime the binded data changes.
readonly | boolean | false | Prevents the element changes from resetting the binded value.
writeonly | Boolean | false | Prevents the element from getting changed when the binded value changes.
json | boolean | false | Returns pretty-printed json data to its DOM element.
pick | array | null | A comma separated list of values to pick (in forms only) to sync with the storage. By default, all form inputs are synced.
omit | array | null | A comma separated list of values (in forms only) to not sync with the storage. By default, no form input is omitted.

Examples:

```html
<form way-data="some.form" way-pick="some,properties,that,can.be.nested">
```


```html
<form way-data="some.form" way-omit="dont,want.those">
```


```html
<img way-data="some.image" way-default="http://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png">
```

```html
<pre way-data="some.image" way-json="true"></pre>
```

<!--
- prettyprint (?)
-->

## Functions ##

Everything should be done for you from the HTML tags. But if necessary, you can also use helper functions to interact with your stored data and DOM elements. 


Notes: 
- [element] refers to the jQuery selector of a DOM element
- [options] is optional. By default, options are read from the HTML tags of the elements. But you can overwrite them, by passing this parameter.

**way.dom([element]).toStorage([options])**

Stores the element's value to the in-store memory.

**way.dom([element]).fromStorage([options])**

Sets the element's value from the stored one.

**way.dom([element]).toJSON([options])**

Returns a JSON with the parsed data of the input (particularly handy for forms).

```javascript
way.toJSON("#someForm");

>> {
		its: "values",
		serialized: {
			in: "a json"
		}
	}
```

**way.dom([element]).fromJSON([data], [options])**

Sets the element's value from any data (in json).

**way.dom([element]).getOptions()**

Returns an object with the "way-" options passed to the element.

**way.dom([element]).getOptions()**

Returns an object with the "way-" options passed to the element.

**way.dom([element]).setDefault([force])**

Sets the default value of an element. Pass a [force] parameter to force setting the default value in-memory.

**way.set([selector], [data])**

Saves the data in memory under the specified pathname.

```javascript
way.set("some.path", "bonjour!");
way.get("some.path");
>> "bonjour"
```

**way.get([selector])**

Returns the value of the data stored under a given pathname.

**way.digestBindings([selector])**

Updates the bindings for the given selector. If omitted, all (excluding write-only's and omitted) DOM elements with a "way-data=" attribute will be refreshed with values from the in-store memory.

```html
<input type="text" way-data="some.property">
```
**way.watch([selector], [callback])**

Watches changes of a given value.

```javascript
way.watch("some.data", function(value) {
	console.log("Data has been updated to value: " + value);
});
```
**way.restore([selector])**

Restores the data saved in localStorage. If [selector] is omitted, all data in localStorage will be restored in-memory. Called on $(document).ready by default.

```javascript
way.restore("some.data");
```
**way.setDefaults()**

Sets all the default values of elements

## Notes ##

xxx

## To do ##

- localStorage (localForage?) integration
- document a bit more the code
- test
- enjoy

## Integrations ##

* [Meteor] To be coming

## Contribute ##

* Fork & pull request.
* If you planning add some feature please create issue before.

Otherwise changes will be rejected.

## Credits ##

[form2js' author](https://github.com/maxatwork/form2js)

## Licence ##

The MIT License

Copyright (c) 2011 Gwendall Esnault gwendall.esnault@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
