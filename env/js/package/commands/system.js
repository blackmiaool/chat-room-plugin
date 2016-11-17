'use strict';

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = _2.default.$;

var name = 'system';
var showBase = false;
var render = function render(content, isNew) {
    var $dom = $('<p style="position:relative;height:32px;"></p>');
    var $wrapper = $('<div></div>');
    var info = _2.default.getPluginMessageInfo({
        content: content,
        from: ""
    });
    if (info) {

        $dom.append('<span style="display: inline-block;vertical-align: top;">\u7CFB\u7EDF\u6D88\u606F:</span>');
        var $sub = _2.default.getMessage(info.name, info.content, isNew);
        if (info.name === "boom") {
            $sub.css({
                'margin-top': '-13px'
            });
        } else if (info.name === "shit") {
            $sub.css({
                'margin-top': '-14px'
            });
        }
        $dom.append($sub);
    } else {
        $dom.text('\u7CFB\u7EDF\u6D88\u606F:' + content);
    }
    $wrapper.append($dom);

    $wrapper.css({
        margin: '10px 0',
        textAlign: 'center'

    });
    $dom.css({
        display: 'inline-block',
        color: 'white',
        backgroundColor: '#999',
        borderRadius: '50px',
        padding: '5px 20px 6px'
    });

    return $wrapper;
};
_2.default.registerMessage({
    name: name,
    showBase: showBase,
    render: render
});