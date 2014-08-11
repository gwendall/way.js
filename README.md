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

Set these options as "way-" HTML attributes on the elements that have to be binded. Or as parameters of the functions below.

**data** (String)

```html
	<input type="text" way-data="some.property">
```

**readonly** (String)

Prevents the element changes from resetting the binded value.

```html
	<input type="text" way-readonly="true">
```

**writeonly** (String)

Prevents the element from getting refreshed when the binded value changes.

```html
	<input type="text" way-writeonly="false">
```

**pick** (String)

A comma separated list of values to pick (in forms only).

```html
	<input type="text" way-pick="some,properties,that,can.be.nested">
```

**omit** (String)

A comma separated list of values to omit (in forms only).

```html
	<input type="text" way-omit="dont,want.those">
```

**imagefallback** (String)

A link to a default image to set on an <img> element if the binded value can't load an image

```html
	<input type="text" way-imagefallback="http://upload.wikimedia.org/wikipedia/en/a/a6/Bender_Rodriguez.png">
```

- prettyprint (?)

## Functions ##


**toStorage** (String)

```html
	<input type="text" way-data="some.property">
```

**fromStorage** (String)

```html
	<input type="text" way-data="some.property">
```

**toJSON** (String)

```html
	<input type="text" way-data="some.property">
```

**fromJSON** (String)

```html
	<input type="text" way-data="some.property">
```

**getValue** (String)

```html
	<input type="text" way-data="some.property">
```

**setValue** (String)

```html
	<input type="text" way-data="some.property">
```

**getBindOptions** (String)

```html
	<input type="text" way-data="some.property">
```

**getAttrs** (String)

```html
	<input type="text" way-data="some.property">
```

**getBinding** (String)

```html
	<input type="text" way-data="some.property">
```

**setBinding** (String)

```html
	<input type="text" way-data="some.property">
```

**digestBindings** (String)

```html
	<input type="text" way-data="some.property">
```

## Integrations ##

* [Meteor](https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js) *Uncompressed with Comments 18kb*

## Contribute ##

* Fork & pull request.
* If you planning add some feature please create issue before.

Otherwise changes will be rejected.

## Contributors list ##
[Can be found here](https://github.com/epeli/underscore.string/graphs/contributors).


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
