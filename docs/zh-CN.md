way.js中文文档（Github官方文档翻译）
======

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gwendall/way.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

先附英文原文地址：https://github.com/gwendall/way.js

简单的、轻量级的、持久的、不依赖任何框架。双向数据绑定的JS库.  
用少量的代码编写. 并且不依赖任何框架.  

官方演示：[Demo](https://gwendall.github.io/way)  
在线编辑，实时演示：[Codepen](http://codepen.io/anon/pen/rihBs) , [jsFiddle](http://jsfiddle.net/gwendall/s5zzc84m/)  

支持我们一下: [Gittip](https://www.gittip.com/gwendall)  
在Twitter上关注我们: [@way_js](https://twitter.com/way_js)  

## 快速开始 ##

用一些特定标签，声明 `HTML` 元素

```html

  <form way-data="myFormData" way-persistent="true">
  	<input type="text" name="name">
  	<input type="text" name="age">
  	<input type="text" name="gender">
  </form>

  Name: <span way-data="myFormData.name"></span>

```
Boom. 现在表单中的每次改变都将会被存储到内存中，被绑定的 `span` 标签的内容会立即改变。并且被绑定的数据将会持久化保存，这就是说你的页面被重新加载的时候这些数据会自动填充到对应HTML元素上

说了这么多, [看下在线演示](https://gwendall.github.io/way).


## 安装 ##

**[首先]** 在你的页面中引入way.js库.

```html
<script src="way.min.js"></script>
```

**[然后]** 就没有然后了. 你可以放心去干了

## 选项  ##
你可以通过**数据属性**或者**JavaScripe**的方式去控制选项。
**数据属性**：在名字前面添加 `way-` ，例如在你需要绑定的html元素上这样使用
```html
<pre way-data="__all__" way-persistent="true" way-json="true"></pre>
```

选项名 | 类型 | 默认值 | 描述
----|------|------ | ----
data | string | null&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | 你可以定义`.`分隔的路径，如`Class.StudentList`的方式作为`way-data`的值。它的值能够是数组和json对象。 当用在一个表单`form`中时，将会创建一个JSON变量，该变量包含所有带有`name`属性的输入，并存储在指定的内存中。通过`__all__`访问所有way.js存储的数据.
default | string | null | 在一个元素没有绑定数据时候，设置的默认数据
persistent | boolean | true | 是否允许在绑定的数据每次变化的时候，将数据存到本地存储中
readonly | boolean | false | 数据只读.
writeonly | Boolean | false | 数据只写.
json | boolean | false | 返回标准格式的json数据到DOM元素中，作为元素的`element.textContent`
html | boolean | false | 声明定义了`way-data`属性的元素是否应该被解析为HTML
pick | array | null | 选择表单`form`中的哪些输入框是与存储数据同步的，用逗号分隔。默认情况下，所有表单中的输入都是同步的。（只能在表单中使用）
omit | array | null | 选择表单`form`中的哪些输入框是与存储数据异步的，用逗号分隔。默认情况下，所有表单中的输入都不是异步的。（只能在表单中使用）

一些例子:

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
## 作用域 ##

你可以在你的DOM元素数据中设置使用域，这里解释下**域**
```js
{
  "school"：{
    "class1":{
      ...
    }
    "class2":{
      ...
    }
  }
}
```
这里的`school.class1`和`school.class2`各为一个域

**[way-scope] 属性**  
通过在元素中使用这个属性，它的所有子孙元素都只能用它`way-data`指定的数据域下的数据，使用域可以嵌套

```javascript
way.set("someScope", { with: { something: "hello" }})
```

```html
<div way-scope="someScope">
  <div way-scope="with">
    <div way-data="something"></div> <!-- 将渲染 "hello" -->
  </div>
</div>
```

**[way-scope-break] 属性**  
打破使用域规则的束缚. 设置为true后，子孙元素将不受使用域规则束缚，可跨域使用数据

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

**scope() 方法**  
param：无
return：[String]  指定元素使用的数据所在的域

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

## 循环 ##

循环渲染出数据中的值，如下循环出some.list中的数据

注意:
- 重复块会自动设置子元素的数据使用域。（注意第三段代码，第2、5、8行）
- 每一次循环，`$$key` 对应的是当前被循环元素的键。（注意第三段代码，第3、6、9行。行首）

像这样:  
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

将被渲染为:  
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

## 转换 ##

对你绑定的元素的显示数据进行转换。

**[way-transform] 属性**  
通过在元素上设置`way-transform`属性，值为如下转换名称（也可通过registerTransform添加更多的转化方式），在一个元素上添加多个转换时，使用竖线 `|` 隔开
万一两个规则发生了冲突，使用最后的那个转换规则
一些预构建的转换 **[PR welcome for more!]**

名称 | 描述 | 解释
----|------|----
uppercase | 将字符串全部设置为大写 | "hello" 变为 "HELLO"
lowercase | 将字符串全部设置为小写 | "HELLO" 变为 "hello"
reverse | 前后反转字符串 | "hello" 变为 "olleh"


```javascript
way.set("someData", "hello")
```

```html
<div way-data="someData" way-transform="uppercase|reverse"></div>
<!-- 渲染出 "OLLEH" -->
```

**registerTransform(name, transform) 方法**  
添加一个新的转换规则
name：[String] 转换规则名称
transform：[function] 处理函数，参数为原始待处理数据，返回值为处理后的数据

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
==============================================================================这里被官方注视了
## 过滤 ## [经过实验: 待错误修复]
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

**registerFilter(name, filter) 方法**  
添加一个新的过滤器.同bugs to fix
=====================================================================这里被官方注释
-->

## elements 助手 ##

当你点击时，可以进行一些简单的任务

Attribute&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description
---- | ------
way-action-remove | 移除指定数据
way-action-push | 如果对象为数组, 就向数组后添加一个null；如果不是数组，就会删除原来值，新值为有一个空对象的数组`[null]`

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

## Classes 助手 ##

**只对图片有用**

way.js使用一些classes，可以更容易的检测数据的 load/error/success 的状态

类名 | 描述
---- | ------
way-loading | 图片加载过程中有效
way-error | 通过url没有获取到图片时有效
way-success | 图片加载成功时有效.

```javascript
way.set("image.url", "somethingThatsNotAnImageURL");
```  
```html
<img way-data="image.url">
<!-- Gets a class ".way-error" attributed -->
```

## 方法 ##

一般**数据属性选项**都可以完成所有的事，但是有必要的话，你也可以用**函数**去管理你的数据和页面元素

注意:
- [element] 是指一个DOM元素的CSS选择器
- [options] 时可选择的. 默认情况下, **数据属性选项**都在html标签上. 但是你可以通过这些参数覆盖他们.

### DOM 方法

**way.dom(element).toStorage(options)**  
存储指定元素的值到内存中
```javascript
way.dom("#someForm").toStorage()
```

**way.dom(element).fromStorage(options)**  
Sets the element's value from the stored one.
从内存中设置指定元素的值，如果没有设置`way-data` ，将会设置为__false__
```javascript
way.dom("#someForm").fromStorage()
```

**way.dom(element).toJSON(options)**  
返回一个JSON格式的input的解析数据 (特别容易得到form的内容).

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
设置任何自定义数据到指定的元素作展示值
```javascript
way.dom("#someForm").fromJSON({name:"John Doe"})
```

**way.dom(element).getValue()**  
得到指定元素的`way-data`的值，标准的JSON格式
```javascript
way.dom("#someForm").getValue()
```

**way.dom(element).setValue(value, options)**  
设置任何自定义数据到指定的元素作展示值
```javascript
way.dom("#someForm").setValue({name:"John Doe"})
```

**way.dom(element).setDefault(force)**  
设置指定元素值为默认值。通常情况下, 只是设置了DOM元素的值为默认值，并没有在内存中改变它。如果需要，你可以通过设置参数`force` 强制改变元素在内存中的值。如果元素没有默认值，即为本来的值
```javascript
way.dom("#someForm").setDefault()
```

**way.setDefaults(force)**  
设置所有绑定的元素的值为默认值
```javascript
way.setDefaults()
```

**way.dom(element).getOptions()**  
获得指定元素的`way-`属性列表
```html
  <div id="someForm" way-json="true" way-data="fileTrees.name" way-default="{'a':1}"></div>
```
```javascript
way.dom("#someForm").getOptions()
>> {
	data:"fileTrees.name",
	default:"{'a':1}",
	html:false,
	json:true,
	persistent:false,
	readonly:false,
	writeonly:false
}
```

### Data 方法

**way.get(selector)**  
通过`.`路径获得对应的值
```javascript
way.get("some.path");
>> "bonjour"
```

**way.set(selector, value, options)**  
设置数据到内存中
```javascript
way.set("some.path", "bonjour!");
```

**way.remove(selector, options)**  
从内存中移除数据
```javascript
way.remove("some.path");
way.get("some.path");
>> undefined
```

**way.clear(options)**  
清空所有数据
```javascript
way.clear();
way.get();
>> {}
```

### localStorage 方法

**way.backup()**  
保存所有way.js的数据到缓存中
```javascript
way.backup();
```

**way.restore()**  
恢复保存在本地存储数据。一般在`$(document).ready`调用。默认情况下（可以通过[全局选项]进行更改）
```javascript
way.restore();
```

### Binding 方法

**way.registerBindings()**  
触发DOM扫描，发现并保存有`way-data`的html元素，这些元素将被绑定一些数据
```javascript
way.registerBindings()
```

**way.updateBindings(selector)**  
使用指定的数据设置所有绑定了数据的DOM元素的值为。如果省略了，所有的(不包括 write-only 和 omitted）DOM元素都将被刷新。
```javascript
way.updateBindings("formData.name")
```

### Repeat 方法

**way.registerRepeats()**  
触发DOM扫描，发现并保存有`way-repeat`的html元素，这些元素将被绑定一些数据
```javascript
way.registerRepeats()
```

**way.updateRepeats(selector)**  
触发一次刷新，使用他们各自的数据刷新重复元素的值
Triggers a refresh of the repeat elements with their respective data.
```javascript
way.updateRepeats("somethingToBeLooped")
```

### Watcher 方法

**way.watch(selector, callback[value])**  
监听数据中给定的值得变化
```javascript
way.watch("some.data", function(value) {
	console.log("Data has been updated to value: " + value);
});
```

**way.watchAll(callback[selector, value])**  
监听way.js所有数据的变化
```javascript
way.watchAll(function(selector, value) {
	console.log("The data " + selector + " has been changed.", value);
});
```

## 全局选项 ##

**way.options.persistent** (Boolean)  
设置在`document.ready`时，是否从localStorage 中恢复数据（默认true）
```javascript
way.options.persistent = true
```

**way.options.timeoutInput** (Number)  
绑定元素上的键按下后，将它们的值存储到数据存储中超时的毫秒数 (默认50毫秒).
```javascript
way.options.timeoutInput = 50
```

**way.options.timeoutDOM** (Number)  
在每个DOM改变后，扫描绑定的元素列表用时，超时的毫秒数  (默认500毫秒).
```javascript
way.options.timeoutDOM = 500
```

## 翻译 ##
- [伍云江](http://wuyunjiang.cn)
