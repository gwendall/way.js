way.js
======

## Quick start ##

Declare an HTML element with some tags.

```html

  <form way-data="myFormData">
  	<input type="text" name="name">
  	<input type="text" name="age">
  	<input type="text" name="gender">
  </form>

  Name: <span way-data="myFormData.name"></span>

```

Boom. Now every change in the form will be stored in-memory. The binded span's html will be change on the fly. Enough talk, see it in action.


## Installation ##

Include the script with its dependencies

```html
<script src="/vendor/jquery.js"></script>
<script src="/vendor/underscore.js"></script>
<script src="/vendor/form2js.js"></script>
<script src="/vendor/js2form.js"></script>
<script src="/way.min.js"></script>
```

## Options ##

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to way-, as in way-data="".
Set these options to the elements that have to be binded.

**data** (String)

Allows to define the dot separated path where the data will be stored. Can include arrays.

```html
<input type="text" way-data="some.property">
```

When used on a form, a json variable made of all the included inputs with a [name] attribute will be created and stored in the specified storage.

**readonly** (Boolean)

Prevents the element changes from resetting the binded value.

```html
<input type="text" way-data="some.property" way-readonly="true">
```

**writeonly** (Boolean)

Prevents the element from getting changed when the binded value changes.

```html
<input type="text" way-data="some.property" way-writeonly="false">
```

**pick** (String)

A comma separated list of values to pick (in forms only) to sync with the storage. By default, all form inputs are synced.

```html
<form way-data="some.form" way-pick="some,properties,that,can.be.nested">
```

**omit** (String)

A comma separated list of values (in forms only) to not sync with the storage. By default, no form input is omitted.

```html
<form way-data="some.form" way-omit="dont,want.those">
```

**img** (String)

A link to a default image to set on an <img> element, in case the binded value can't load an image.

```html
<img way-data="some.image" way-img="http://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png">
```
<!--
- prettyprint (?)
-->

## Functions ##

Everything should be done for you from the HTML tags. But if necessary, you can also use helper functions to interact with your stored data and DOM elements. 

Note: By default, options are read from the HTML tags of the elements. If you need to overwrite them, pass an "options" parameter. It is of course optional.


**$(element).toStorage(options)**

Stores the element's value to the in-store memory.

**$(element).fromStorage(options)**

Sets the element's value from the stored one.

**$(element).toJSON(options)**

Returns a JSON with the parsed data of the input (particularly handy for forms).

```javascript
$("#someForm").toJSON();

>> {
		its: "values",
		serialized: {
			in: "a json"
		}
	}
```

**$(element).fromJSON(json, options)**

Sets the element's value from any json.

**$(element).getBindOptions()**

Returns an object with the "way-" options passed to the element.

**$.setStored(selector, data)**

Saves the data in memory under the specified pathname.

```javascript
$.setStored("some.path", "bonjour!");
$.getStored("some.path");
>> "bonjour"
```

**$.getStored(selector)**

Returns the value of the data stored under a given pathname.

**$.digestBindings(selector)**

Updates the bindings with the given selector. If omitted, all DOM elements with a "way-data=" attribute will be refreshed with values from the in-store memory.

```html
<input type="text" way-data="some.property">
```

## Notes ##

xxx

## To do ##

- localStorage (localForage?) integration
- test
- enjoy

## Integrations ##

* [Meteor](https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js) *Uncompressed with Comments 18kb*

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
