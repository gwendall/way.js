way.js
======

Simple, lightweight (1.25KB) two-way databinding

Options:

- data
- readonly
- writeonly
- omit
- skip
- reactive
- prettyprint (?)

Functions

- toStorage
- toJSON

- fromJSON
- fromStorage
- getValue
- setValue
- getBindOptions
- getAttrs

- setBinding
- getBinding
- digestBindings




# Underscore.string [![Build Status](https://secure.travis-ci.org/epeli/underscore.string.png?branch=master)](http://travis-ci.org/epeli/underscore.string) #



Some explanation...

[d]: http://www.diveintojavascript.com/core-javascript-reference/the-string-object


As name states this an extension for [Underscore.js][u] (and [Lo-Dash](http://lodash.com/)), but it can be used
independently from **_s**-global variable. But with Underscore.js you can
use Object-Oriented style and chaining:

[u]: http://underscorejs.org/

```javascript
_("   epeli  ").chain().trim().capitalize().value()
=> "Epeli"
```

## Use cases ##

* [Meteor](https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js) *Uncompressed with Comments 18kb*

## Installation ##

Include the script with its dependencies

  * [Development version](https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js) *Uncompressed with Comments 18kb*
  * [Production version](https://github.com/epeli/underscore.string/raw/master/dist/underscore.string.min.js) *Minified 7kb*

## Quick start ##

* [Meteor](https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js) *Uncompressed with Comments 18kb*

## Options ##

Set these options as "way-" HTML attributes on the elements that have to be binded. Or as parameters of the functions below.

**reactive** _.numberFormat(number, [ decimals=0, decimalSeparator='.', orderSeparator=','])

```javascript
	xxx
```

## Functions ##


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