way.js
======

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gwendall/way.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Simple, lightweight, persistent, framework-agnostic two-way databinding Javascript library.  
With no to little JS code to write. And no dependencies.  

[Demo](https://gwendall.github.io/way)  
[Codepen](http://codepen.io/anon/pen/rihBs)  
[jsFiddle](http://jsfiddle.net/gwendall/s5zzc84m/)  

Buy us coffee: [Gittip](https://www.gittip.com/gwendall)  
Follow us on Twitter: [@way_js](https://twitter.com/way_js)  

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

Boom. Now every change in the form will be stored in-memory. The bound span's html will be changed on the fly. And the bound data will be persistent, meaning your HTML will be populated with your data on page reloads.

Enough talk, [see it in action](https://gwendall.github.io/way).


## Installation ##

**[Step 1]** Include the library to your page.

```html
<script src="way.min.js"></script>
```

**[Step 2]** There is no step 2. You are good to go.

## Options ##

Options can be passed via data attributes or JavaScript. For data attributes, append the option name to way-, as in way-data="".
Set these options to the elements that have to be bound.

Name | Type | Default | Description
----|------|---- | ----
data | string | null | Allows to define the dot separated path where the data will be stored. Can include arrays. When used on a form, a json variable made of all the included inputs with a [name] attribute will be created and stored in the specified storage. Pass the "\_\_all\_\_" path to access all way.js' data.
default | string | null | A link to a default data to set on an element, in case there is no bound value.
persistent | boolean | true | Allows to store the data to localStorage everytime the bound data changes.
readonly | boolean | false | Prevents the element changes from resetting the bound value.
writeonly | Boolean | false | Prevents the element from getting changed when the bound value changes.
json | boolean | false | Returns pretty-printed json data to its DOM element.
html | boolean | false | Declares whether the data attributed to an element should be parsed as HTML or not.
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
<pre way-data="some.json" way-json="true"></pre>
```

<!--
- prettyprint (?)
-->
## Scopes ##

You can set scopes to your DOM elements' data.

**[way-scope] attribute**  
Passing this attribute to an element will point all its children's "way-data" attributes to this scope. Scopes can be nested.

```javascript
way.set("someScope", { with: { something: "hello" }})
```

```html
<div way-scope="someScope">
  <div way-scope="with">
    <div way-data="something"></div> <!-- Will render "hello" -->
  </div>
</div>
```

**[way-scope-break] attribute**  
Breaks a scope chain. All the child elements of this one will have no scope set.

```javascript
way.set("someScope", { with: { something: "hello" }})
```

```html
<div way-scope="someScope">
  <div way-scope-break="true">
    <div way-data="someScope.with.something"></div> <!-- Will render "hello" -->
  </div>
</div>
```

**scope() method**  
Returns the scope of a given DOM element

```html
<div way-scope="someScope">
  <div way-scope="with">
    <div way-data="something" id="someDIV"></div>
  </div>
</div>
```

```javascript
way.dom("#someDIV").scope()  
>> "someScope.with"
```

## Repeats ##

Duplicates a DOM element for each of the values it can loop through in a way.js' passed data.  
Notes:
- Repeat blocks automatically set the appropriate scope to their child elements.
- On each loop, "$$key" corresponds to the key of the current element looped.

Having this:  
```javascript
way.set("some.list", [
	{name:"Pierre"},
	{name:"Paul"},
	{name:"Jacques"}
]);
```

```html
<div way-repeat="some.list">
	$$key - <span way-data="name"></span>
</div>
```

Will render that:  
```html
<div way-scope="some.list">
  <div way-scope="0">
    0 - <span way-data="name">Pierre</span>
  </div>
  <div way-scope="1">
    1 - <span way-data="name">Paul</span>
  </div>
  <div way-scope="2">
    2 - <span way-data="name">Jacques</span>
  </div>
</div>
```

## Transforms ##

Transforms the displayed data bound to your DOM elements.

**[way-transform] attribute**  
Pass transform functions by name. Add multiple transforms by separating them with the "|" symbol.  
In case of conflicts between transforms, the last mentionned transform wins.  
Some pre-build transforms **[PR welcome for more!]**

Name | Description | Example
----|------|----
uppercase | Sets a string to uppercase | "hello" becomes "HELLO"
lowercase | Sets a string to lowercase | "HELLO" becomes "hello"
reverse | Reverses a string | "hello" becomes "olleh"


```javascript
way.set("someData", "hello")
```

```html
<div way-data="someData" way-transform="uppercase"></div>
<!-- Renders "HELLO" -->
```

**registerTransform(name, transform) method**  
Adds a new transform.

```javascript
way.set("someData", "hello");
way.registerTransform("lolify", function(data) {
  return data + " lol";
});
```

```html
<div way-data="someData" way-transform="lolify|uppercase"></div>
<!-- Renders "HELLO LOL" -->
```

<!--
## Filters ## [experimental: bugs to fix]

Filters the displayed data within your "way-repeat" blocks.

**[way-filter] attribute**  
Pass filter functions by name. Add multiple filters by separating them with the "|" symbol.  
In case of conflicts between filters, the last mentionned filter wins.  
Some pre-build filters **[PR welcome for more!] **

Name | Description
----|------
noDuplicates | Only displays HTML for unique DOM elements


```javascript
way.set("someArray", [
  { color: "red" },
  { color: "red" },
  { color: "blue" },
  { color: "green" }
  { color: "green" }
])
```

```html
<div way-repeat="someArray" way-filter="noDuplicates">  
  <div way-data="color"></div>
</div>  
```

// Will render something like

```html
<div way-scope="someArray">
  <div way-scope="0" way-data="color">red</div>
  <div way-scope="2" way-data="color">blue</div>
  <div way-scope="3" way-data="color">green</div>
</div>
```

**registerFilter(name, filter) method**  
Adds a new filter.

-->

## Helper elements ##

Allows to perform simple tasks on your way.js' data with a click.

Attribute | Description
---- | ------
way-action-remove | Removes a way data
way-action-push | if provided with an array, pushes an null value to it

Example:

```javascript
way.set("some.list", ["I", "am", "list"]);
```

```html
<div id="clickToRemove" way-action-remove="some.list.2"></div>
<div id="clickToPush" way-action-push="some.list"></div>
```

```javascript
$("#clickToRemove").click();
$("#clickToPush").click();
way.get("some.list");
>> ["I", "am", null]
```

## Helper classes ##

**For images only**
way.js adds classes to your DOM elements to easily detect load / error / success statuses with the data they get passed.  

Class | Description
---- | ------
way-loading | When an image is getting downloaded to a DOM element
way-error | When no image is returned from the URL provided
way-success | When... Well, you got it.

```javascript
way.set("image.url", "somethingThatsNotAnImageURL");
```  
```html
<img way-data="image.url">
<!-- Gets a class ".way-error" attributed -->
```

## Methods ##

Everything should be done for you from the HTML tags. But if necessary, you can also use helper functions to interact with your stored data and DOM elements.

Notes:
- [element] refers to the CSS selector of a DOM element.
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
Sets the default value of an element. By default, only the DOM element gets its value set to the default value. Its bound value in the datastore in unchanged. Pass a [force] parameter if you need to force setting in-memory value of this data to the element's default value.
```javascript
way.dom("#someForm").setDefault()
```

**way.setDefaults(force)**  
Sets all the default values of bound DOM elements.
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
Triggers a scan of the DOM to find and save the elements with the [way-data] attribute, that will be bound with some data.
```javascript
way.registerBindings()
```

**way.updateBindings(selector)**  
Sets the value of all the DOM elements binded to a data selector with their values in way.js' datastore. If omitted, all (excluding write-only's and omitted) DOM elements with a "way-data=" attribute will be refreshed.
```javascript
way.updateBindings("formData.name")
```

### Repeat methods

**way.registerRepeats()**  
Triggers a scan of the DOM to find and save the elements with the [way-repeat] attribute, that will be bound with some data.
```javascript
way.registerRepeats()
```

**way.updateRepeats(selector)**  
Triggers a refresh of the repeat elements with their respective data.
```javascript
way.updateRepeats("somethingToBeLooped")
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
Watches all changes in way.js' datastore.
```javascript
way.watchAll(function(selector, value) {
	console.log("The data " + selector + " has been changed.", value);
});
```

## Global options ##

**way.options.persistent** (Boolean)  
Sets whether or not data will be restored from localStorage on document.ready (true by default).
```javascript
way.options.persistent = true
```

**way.options.timeoutInput** (Number)  
Number of milliseconds of the timeout between keypresses on bound elements to store their values to the datastore (50 by default).
```javascript
way.options.timeoutInput = 50
```

**way.options.timeoutDOM** (Number)  
Number of milliseconds of the timeout between scans of the DOM to list bound elements on each DOM change (500 by default).
```javascript
way.options.timeoutDOM = 500
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

## Licence ##

The MIT License

Copyright (c) 2014 Gwendall Esnault gwendall.esnault@gmail.com

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
