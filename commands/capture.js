import api from '../';

const $ = api.$;




const name = 'capture';
const showBase = true;
const thingWidth = 40;

function process(message) {
    const match = message.content.trim().match(/^([a-zA-Z0-9_-]+)\s*\(([\s\S]*)\)\s*;?\s*$/);
    return {
        from: message.from.username,
        content: match[2],
    };
}

function render(info, isNew) {
    const $thing = $thingTpl.clone();

    if (!isNew) {
        return $thing;
    }

    let argStr = info.get('content');
    const from = info.get('from');

    argStr = argStr.replace(/&quot;/g, '"');

    let userName;
    let radius;
    if (argStr === '，') {
        userName = '，';
    } else {
        argStr = argStr.split('，').join(',');
        const args = argStr.split(/(?=[^\\]),/);
        userName = args[0];
        radius = args[1];
    }
    if (!radius) {
        radius = 1;
    }
    if (radius > 50) {
        radius = 50;
    }

    setTimeout(() => {
        const $source = api.findUserMessage(from);

        let $target = api.findUserMessage(userName);
        let $targetAvatar;

        if (!$target && !$source) {
            $thing.css('opacity', '1');
            return;
        }

        if ($source) {
            if (!$target) {
                console.warn(`目标${userName}不存在, 即将自爆`);
                $target = $source;
                $targetAvatar = $source.avatar;
            } else {
                $targetAvatar = $target.avatar;
            }
        } else {
            $targetAvatar = $target.avatar;
            if (!$targetAvatar.length) {
                $thing.css('opacity', '1');
                return;
            }
        }

        if (!$targetAvatar.length) {
            console.warn(`目标${userName}头像不存在, 即将自爆`);
            $target = $source;
            $targetAvatar = $source.avatar;
        }

        const {
            direction
        } = $target

        const pos1 = $targetAvatar.offset();
        const pos2 = $thing.offset();
        pos2.left -= ($targetAvatar.width() - thingWidth) / 2;
        pos2.top -= ($targetAvatar.height() - thingWidth) / 2;

        if ($source) {
            if ($source.direction === 'left') {
                $thing.css('left', '-20px')
                    .css('bottom', '-20px')
                    .css('transform', 'translate(50%,-50%)');
            } else {
                $thing.css('left', '20px')
                    .css('bottom', '-20px')
                    .css('transform', 'translate(-50%,-50%)');
            }
        } else {

        }


        const G = 0.0007;
        const time = 1000;

        //      x=vt+at2; v=(x-at2)/t 贴心小公式 helpful-little-format
        const v = (pos1.top - pos2.top - G * time * time) / time;

        const avatarWidth = $targetAvatar.width();

        const bounceDistance = avatarWidth / 2 + thingWidth / 2;
        const floatHeight = bounceDistance * 1.5;

        let step1Rotate;
        const bounceRate = 1 / 8;
        const shakeDeg = 15;
        const $redState = $(`<div style="opacity:0;height:10px;width:10px;position:absolute;left:0;right:0;top:0;bottom:0;margin:auto;border-radius:5px;background-color:rgba(200,30,70,0.7);"></div>`);
        if($thing.parent().css("position")==="static"){
            $thing.parent().css("position","relative");
        }
        const $shadow = $(`<div style="    height: 60px;
                                width: 60px;
                                position: absolute;
                                top: -100px;
                                left: -100px;
                                right: -100px;
                                bottom: -100px;
                                overflow: hidden;
                                transform: translate(0px,41px) rotate(45deg);
                                margin: auto;">
                                        <div style="position: absolute;
                                            left: -60px;
                                            box-shadow: 8px 12px 80px rgba(200,30,70,0.7);
                                            top: -60px;
                                            width: 60px;
                                            height: 60px;">
                                        </div>
                                    </div>`);
        const animate = $thing.css('opacity', '0')
            .css('position', 'relative')
            .animate({
                opacity: '1',
            }, {
                duration: 500,
                easing: 'easeOutBack',
                done: function () {
                    $(this).css('left', '')
                        .css('bottom', '')
                        .css('transform', '');
                },
            })
            .delay(200)
            .animate({
                borderSpacing: 1000,
            }, {
                duration: 1000,
                easing: 'linear',
                step: function (now, fx) {
                    const left = (pos1.left - pos2.left) * now / 1000;
                    const top = v * now + G * now * now;
                    $thing.css({
                        transform: `rotate(${now / 1000 * 1080}deg)`,
                        top,
                        left,
                    });
                    const distance = Math.sqrt(Math.pow(pos1.left - pos2.left - left, 2) + Math.pow(pos1.top - pos2.top - top, 2));
                    if (distance < bounceDistance) {
                        animate.stop();
                        step1Rotate = parseInt($thing.css("transform").match(/\d+/));
                        $thing.css("border-spacing", 0);
                    }


                },

            }).animate({
                left: pos1.left - pos2.left,
                top: pos1.top - pos2.top - floatHeight,
                borderSpacing: 1000,
            }, {
                duration: 150,
                easing: 'linear',
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${(1080-step1Rotate)*now/1000+step1Rotate}deg)`);
                    }



                },
                done: function () {
                    $(this).append($redState).append($shadow);                    
                    $redState.animate({
                        opacity: 1
                    }, {
                        duration: 1000,
                    });

                    $thing.css("border-spacing", 0);

                },
            })
            .animate({
                borderSpacing: 1000,
            }, {
                duration: 100000,
                easing: 'linear',
                start: function () {
                    const radius = $targetAvatar.width() * 1.3 / 2;
                    $targetAvatar.explode({
                        minWidth: 3,
                        maxWidth: 6,
                        radius,
                        minRadius: 0,
                        release: false,
                        fadeTime: 300,
                        recycle: false,
                        recycleDelay: 500,
                        explodeTime: 231,
                        round: false,
                        minAngle: 0,
                        maxAngle: 120,
                        gravity: -1,
                        groundDistance: floatHeight,
                        land: false,
                        checkOutBound: function (rag) {
                            //
                            if (rag.biasy < radius - (rag.biasx + rag.width / 2) || rag.biasy < (rag.biasx + rag.width / 2) - radius) {
                                return true;
                            }
                            return false;
                        },
                        finish: function () {
                            animate.stop();

                        }
                    })
                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .delay(300)
            .animate({
                left: pos1.left - pos2.left,
                top: pos1.top - pos2.top,
                borderSpacing: 1000,
            }, {
                duration: Math.sqrt(2 * floatHeight * G) * 1000,
                easing: "easeInQuad",
                start: function () {
                    $shadow.remove();
                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .animate({
                left: pos1.left - pos2.left,
                top: pos1.top - pos2.top - floatHeight * bounceRate,
                borderSpacing: 1000,
            }, {
                duration: Math.sqrt(2 * floatHeight * bounceRate / G),
                easing: "easeOutQuad",
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .animate({
                left: pos1.left - pos2.left,
                top: pos1.top - pos2.top,
                borderSpacing: 1000,
            }, {
                duration: Math.sqrt(2 * floatHeight * bounceRate / G),
                easing: "easeInQuad",
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .delay(500)
            .animate({
                left: pos1.left - pos2.left - shakeDeg / 360 * Math.PI * thingWidth,
                borderSpacing: 1000,
            }, {
                duration: 300,
                easing: "easeInQuad",
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${-shakeDeg*now/1000}deg)`);
                    }

                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .animate({
                left: pos1.left - pos2.left,
                borderSpacing: 1000,
            }, {
                duration: 300,
                easing: "easeOutBack",
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${-shakeDeg*(1000-now)/1000}deg)`);
                    }

                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .delay(500)
            .animate({
                left: pos1.left - pos2.left + shakeDeg / 360 * Math.PI * thingWidth,
                borderSpacing: 1000,
            }, {
                duration: 300,
                easing: "easeInQuad",
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${shakeDeg*now/1000}deg)`);
                    }

                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .animate({
                left: pos1.left - pos2.left,
                borderSpacing: 1000,
            }, {
                duration: 300,
                easing: "easeOutBack",
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${shakeDeg*(1000-now)/1000}deg)`);
                    }

                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .delay(500)
            .animate({
                left: pos1.left - pos2.left - shakeDeg / 360 * Math.PI * thingWidth,
                borderSpacing: 1000,
            }, {
                duration: 300,
                easing: "easeInQuad",
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${-shakeDeg*now/1000}deg)`);
                    }

                },
                done: function () {
                    $thing.css("border-spacing", 0);
                }
            })
            .animate({
                left: pos1.left - pos2.left,
                borderSpacing: 1000,
            }, {
                duration: 300,
                easing: "easeOutBack",
                step: function (now, fx) {
                    if (fx.prop === 'borderSpacing') {
                        $thing.css('transform', `rotate(${-shakeDeg*(1000-now)/1000}deg)`);
                    }

                },
                done: function () {
                    $thing.css("border-spacing", 0);
                    $redState.animate({
                        opacity: 0
                    }, {
                        duration: 1000,
                    });
                }
            })

    }, 200);
    $thing.css('opacity', '0');
    return $thing;
}
api.registerMessage({
    name,
    showBase,
    process,
    render,
});


const $thingTpl = $(`<div class="plugin-thing"><img style="width:${thingWidth}px;display:block;"  src="data:image/png;base64,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"></div>`);