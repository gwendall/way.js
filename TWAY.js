

    var EventManage = function () {

        this._onClick = {};

        this._onDoubleClick = {};

    }

    EventManage.prototype.constructor = EventManage;

    EventEmitter.prototype.Invoke = function (handler) {

        this._double = this._onDoubleClick || [];

        this._click = this._onClick || [];

        if (!handler) { this._onClick = {}; }
    }