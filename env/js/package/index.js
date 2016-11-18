'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _exports = {
    init: init
};

var messageList = {};

function extend(to, from) {
    for (var i in from) {
        to[i] = from[i];
    }
}

function init(api) {
    var jQuery = require('jquery');

    extend(_exports, api);
    _exports.$ = jQuery;
    window.jQuery = jQuery;
    window.$ = jQuery;
    require('jquery.easing');
    require("jquery-image-explode");
    require("./commands/boom.js");
    require("./commands/system.js");
    require("./commands/shit.js");
    require("./commands/capture.js");
}

function getMessage(name, content, isNew) {
    if (!content.get && (typeof content === 'undefined' ? 'undefined' : _typeof(content)) === "object") {
        content.get = function (key) {
            return this[key];
        };
    }
    return messageList[name].render(content, isNew);
}

function registerMessage(_ref) {
    var name = _ref.name,
        showBase = _ref.showBase,
        process = _ref.process,
        render = _ref.render;

    messageList[name] = {
        name: name,
        showBase: showBase,
        process: process,
        render: render

    };
}
extend(_exports, {
    getMessage: getMessage,
    registerMessage: registerMessage,
    messageList: messageList
});
if (module) {
    module.exports = _exports;
}
exports.default = _exports;