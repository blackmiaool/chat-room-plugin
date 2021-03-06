'use strict';

var _ = require('../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = _2.default.$;

var $bombTpl = $('<img style="width:40px;" class="plugin-bomb"  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAABNVBMVEUAAAAiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiK1FxXUJBoiIiKnGxgiIiIiIiLXJRoiIiKrHBmuFBIiIiKQLCaQLCbYJRuxFRMiIiK2FxSQLCYiIiK7GRUiIiIiIiKGHhuCLSjCHBciIiKyFROuExLcJxyjHBnEHRfTJBoiIiKQLCaQLCbSIxoiIiIiIiKQLCZ6KiXfKR2QLCbJHxjeKB25GRXMIRk4PEM5PUhFSE06QE0iIiI9QERLTlGQLCZBREgmJigzNjzPOjotLjHoWFitExLlU1PyamnWRkYwMzntZGOdMy3sYWDqXl3VUU+6Qz9wNTOWLyncJxzNIRneT0/DSkfBREF1MzF7Mi/EMC/DHRe8GhVSPT+xPjtcOjunNjLVJBrgYmBkKie+KCdUKCWiHRmE5EKhAAAAOHRSTlMAupnUwrGihGFL/YRuMS8oIhgV7su4k5N+em5GQ0AhDwn9797Yy8TDwKSMcWRgVTwm7t3PzbGwcweVBRAAAAJkSURBVEjH7dXXctpQEIDhIzrExhiXuAZ3O+7pMlmxagGESQCDIRSX1Pd/hKw0Y+WgIxC5zNi/uNQ3uxLSiD31WDpfPTo+ZxM1e3oYjcxLsXgyxxbfoN3CaqCaiUvwt1eI1dtO/QpxMYBFgTJ1xU43f2H1e7lsGVYbcX9paX2kC9lKybt1sVYul68Nw+gV7Xan/a8tSkzNczWwTfDSMH6S+r0/V5zzky/CoNG0AvUA77B6SZWMXqrXxoXsbnFnw9epDnOo6tTF+mfKXtaq4nR2rrjidbl513HyBrH2hSqRrOMRW0nteGGM9lQLXKpTA69qn+wsq0N/yUYq5bnKBICi5IdSnL7a0ukWjxl7P1gahvOg27DAHYorrZLdPdLjszI4GHJTtKgw0ZVYJ3eNSHd0fbA1BCM00H8i1UCsdqx7XKATs/1+hnNnNFCc6HbTRWozy6itPv/gxcFUKJV3qsJ119j8AWeMets68W5KeQbK7kGZsMyog9YHDgLITpxUZU86SIx62XrGvUygyR6pKrI32GbUcx6uEXyQqssEqDnwGweTDnQtr3gIzqoCFPKHe80TYVUxcdVMs5nhXsVJoA5hOvVdc49xAQTDCkTte/M6w0MJ9EBowhQTWgbzIigN0iJMAwQ5HSLMJwkqAdCEuB9MgDbeyQCzzH+kGXCFIebbGoA8xlUgzEYUomU/jkoHSLJRRUdLGbhFhXIRV4rzYmM/xBKA7uNMwQnFADTZO04DetaCSoSJOlPzzu+iQkxKswk6JAqaWdF1vWKSgog7LnBqFNy2Y0n2L6UT8VAotHw6w576P/oD9Mc3kWf8L78AAAAASUVORK5CYII=">');

var name = 'boom';
var showBase = true;

function process(message) {
    var match = message.content.trim().match(/^([a-zA-Z0-9_-]+)\s*\(([\s\S]*)\)\s*;?\s*$/);
    return {
        from: message.from.username,
        content: match[2]
    };
}

function render(info, isNew) {
    var $bomb = $bombTpl.clone();

    if (!isNew) {
        return $bomb;
    }

    var argStr = info.get('content');
    var from = info.get('from');

    argStr = argStr.replace(/&quot;/g, '"');

    var userName = void 0;
    var radius = void 0;
    if (argStr === '，') {
        userName = '，';
    } else {
        argStr = argStr.split('，').join(',');
        var args = argStr.split(/(?=[^\\]),/);
        userName = args[0];
        radius = args[1];
    }
    if (!radius) {
        radius = 1;
    }
    if (radius > 50) {
        radius = 50;
    }

    setTimeout(function () {
        var $source = _2.default.findUserMessage(from);

        var $target = _2.default.findUserMessage(userName);
        var $targetAvatar = void 0;

        if (!$target && !$source) {
            $bomb.css('opacity', '1');
            return;
        }

        if ($source) {
            if (!$target) {
                console.warn('\u76EE\u6807' + userName + '\u4E0D\u5B58\u5728, \u5373\u5C06\u81EA\u7206');
                $target = $source;
                $targetAvatar = $source.avatar;
            } else {
                $targetAvatar = $target.avatar;
            }
        } else {
            $targetAvatar = $target.avatar;
            if (!$targetAvatar.length) {
                $bomb.css('opacity', '1');
                return;
            }
        }

        if (!$targetAvatar.length) {
            console.warn('\u76EE\u6807' + userName + '\u5934\u50CF\u4E0D\u5B58\u5728, \u5373\u5C06\u81EA\u7206');
            $target = $source;
            $targetAvatar = $source.avatar;
        }

        //        $source.find('.text').replaceWith($bomb);
        var pos1 = $targetAvatar.offset();
        var pos2 = $bomb.offset();

        if ($source) {
            if ($source.direction === 'left') {
                $bomb.css('left', '-20px').css('bottom', '-20px').css('transform', 'translate(50%,-50%)');
            } else {
                $bomb.css('left', '20px').css('bottom', '-20px').css('transform', 'translate(-50%,-50%)');
            }
        } else {}

        var G = 0.0007;
        var time = 1000;

        //      x=vt+at2; v=(x-at2)/t 贴心小公式 helpful-little-format
        var v = (pos1.top - pos2.top - G * time * time) / time;
        $bomb.css('opacity', '0').css('position', 'relative').animate({
            opacity: '1'
        }, {
            duration: 500,
            easing: 'easeOutBack',
            done: function done() {
                $(this).css('left', '').css('bottom', '').css('transform', '');
            }
        }).delay(200).animate({
            left: pos1.left - pos2.left,
            borderSpacing: 1000
        }, {
            duration: 1000,
            easing: 'linear',
            step: function step(now, fx) {
                if (fx.prop === 'borderSpacing') {
                    $bomb.css({
                        transform: 'rotate(' + now / 1000 * 1080 + 'deg)',
                        top: v * now + G * now * now
                    });
                }
            },
            done: function done() {
                $(this).css('transform', '').css('borderSpacing', '1000').css('left', pos1.left - pos2.left - 20).css('top', pos1.top - pos2.top + 20).css('transform', 'translate(50%,-50%)');
            }
        }).animate({
            opacity: '0',
            borderSpacing: '1500'
        }, {
            duration: 100,
            easing: 'linear',
            step: function step(now, fx) {
                if (fx.prop === 'borderSpacing') {
                    $bomb.css('transform', 'translate(50%,-50%) scale(' + now / 1000 + ')');
                }
            },
            start: function start() {
                $targetAvatar.explode({
                    minWidth: 4,
                    maxWidth: 8,
                    radius: 25,
                    minRadius: 3,
                    release: false,
                    fadeTime: 300,
                    recycle: false,
                    recycleDelay: 500,
                    explodeTime: 331,
                    round: false,
                    minAngle: 0,
                    maxAngle: 360,
                    gravity: 2.5,
                    groundDistance: 30
                });
            },
            done: function done() {}
        });
    }, 200);
    $bomb.css('opacity', '0');
    return $bomb;
}
_2.default.registerMessage({
    name: name,
    showBase: showBase,
    process: process,
    render: render
});