way.js
======

Simple, lightweight, persistent, framework-agnostic two-way databinding Javascript library (with no to little JS code to write).

[Demo](https://gwendall.github.io/way)  
[Codepen](http://codepen.io/anon/pen/fkEqw)  
[jsFiddle](http://jsfiddle.net/gwendall/pazk0903/)  

## Quick start ##

Declare an HTML element with some tags.ba

```html

  <form way-data="myFormData" way-persistent="true">
  	<input type="text" name="name">
  	<input type="text" name="age">
  	<input type="text" name="gender">
  </form>

  Name: <span way-data="myFormData.name"></span>

```

Boom. Now every change in the form will be stored in-memory. The binded span's html will be changed on the fly. And the binded data will be persistent, meaning your HTML will be populated with your data on page reloads.

Enough talk, [see it in action](https://gwendall.github.io/way).


## Installation ##

Step 1: Include the bundled library to your page.

```html
<script src="/way.bundle.min.js"></script>
```

Step 2: There is no step 2. You are good to go.


Note: The bundled version contains the required dependencies (listed below). Feel free to include them separately.

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

Some examples:

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

## Methods ##

Everything should be done for you from the HTML tags. But if necessary, you can also use helper functions to interact with your stored data and DOM elements. 


Notes: 
- [element] refers to the jQuery selector of a DOM element
- [options] is optional. By default, options are read from the HTML tags of the elements. But you can overwrite them, by passing this parameter.

### DOM methods

**way.dom(element).toStorage(options)**  
Stores the element's value to the in-store memory.
```javascript
way.dom("#someForm").toStorage()
```

**way.dom(element).fromStorage(options)**  
Sets the element's value from the stored one.
```javascript
way.dom("#someForm").fromStorage()
```

**way.dom(element).toJSON(options)**  
Returns a JSON with the parsed data of the input (particularly handy for forms).
```javascript
way.dom("#someForm").toJSON()

>> {
		its: "values",
		serialized: {
			in: "a json"
		}
	}
```

**way.dom(element).fromJSON(data, options)**  
Sets the element's value from any data (in json).
```javascript
way.dom("#someForm").fromJSON({name:"John Doe"})
```

**way.dom(element).getValue()**  
Returns a structured JSON containing the value of the DOM element.
```javascript
way.dom("#someForm").getValue()
```

**way.dom(element).setValue(value, options)**  
Sets the element's value from any data (in json).
```javascript
way.dom("#someForm").setValue({name:"John Doe"})
```

**way.dom(element).setDefault(force)**  
Sets the default value of an element. By default, only the DOM element gets its value set to the default value. Its binded value in the datastore in unchanged. Pass a [force] parameter if you need to force setting in-memory value of this data to the element's default value.
```javascript
way.dom("#someForm").setDefault()
```

**way.setDefaults(force)**  
Sets all the default values of binded DOM elements.
```javascript
way.setDefaults()
```

**way.dom(element).getOptions()**  
Returns the list of the ["way-"] options attributed to a DOM element.
```javascript
way.dom("#someForm").getOptions()
```

### Data methods

**way.get(selector)**  
Returns the value of the data stored under a given pathname.
```javascript
way.get("some.path");
>> "bonjour"
```

**way.set(selector, value, options)**  
Saves the data in memory under the specified pathname.
```javascript
way.set("some.path", "bonjour!");
```

**way.remove(selector, options)**  
Removes the data stored under a given pathname.
```javascript
way.remove("some.path");
way.get("some.path");
>> undefined
```

**way.clear(options)**  
Clears all the data
```javascript
way.clear();
way.get();
>> {}
```

### localStorage methods

**way.backup()**  
Stores the data saved in way.js' datastore to localStorage.
```javascript
way.backup();
```

**way.restore()**  
Restores the data saved in localStorage. Called on $(document).ready by default (can be changed with [global options](way.js#global-options)).
```javascript
way.restore();
```

### Binding methods

**way.registerBindings()**  
Triggers a scan of the DOM to find and save the elements with the [way-data] attribute, that will be binded with some data. 
```javascript
way.registerBindings()
```

**way.updateBindings(selector)**  
Updates the bindings for the given selector. If omitted, all (excluding write-only's and omitted) DOM elements with a "way-data=" attribute will be refreshed with values from the in-store memory.
```javascript
way.updateBindings("formData.name")
```

### Watcher methods

**way.watch(selector, callback[value])**  
Watches changes of a given value.
```javascript
way.watch("some.data", function(value) {
	console.log("Data has been updated to value: " + value);
});
```

**way.watchAll(callback[selector, value])**  
Watches changes of a given value.
```javascript
way.watchAll(function(selector, value) {
	console.log("The data " + selector + "has been changed.", value);
});
```

## Global options ##

**way.options.persistent** (Boolean)  
Sets whether or not data will be saved to / restored from localStorage (true by default).
```javascript
way.options.persistent = true
```

**way.options.timeoutInput** (Number)  
Number of milliseconds of the timeout between keypresses on binded elements to store their values to the datastore (50 by default).
```javascript
way.options.persistent = 50
```

**way.options.timeoutDOM** (Number)  
Number of milliseconds of the timeout between scans of the DOM to list binded elements on each DOM change (500 by default).
```javascript
way.options.persistent = 500
```

## To do ##

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
