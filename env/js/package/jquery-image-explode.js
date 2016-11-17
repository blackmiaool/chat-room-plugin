"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function ($) {
    "use strict";

    var wrapperName = "explode-wrapper";
    $.fn.explodeRestore = function () {
        this.each(function () {
            //explode separately
            var $dom = $(this);
            var wrapper = $dom.prop(wrapperName);
            if (wrapper) {
                wrapper.replaceWith($dom);
                $dom.prop(wrapperName, null);
            }
        });
    };
    $.fn.explode = function (opt) {
        if (!opt || (typeof opt === "undefined" ? "undefined" : _typeof(opt)) !== "object") {
            opt = {};
        }

        var _opt = opt,
            _opt$minWidth = _opt.minWidth,
            minWidth = _opt$minWidth === undefined ? 3 : _opt$minWidth,
            _opt$omitLastLine = _opt.omitLastLine,
            omitLastLine = _opt$omitLastLine === undefined ? false : _opt$omitLastLine,
            _opt$radius = _opt.radius,
            radius = _opt$radius === undefined ? 80 : _opt$radius,
            _opt$minRadius = _opt.minRadius,
            minRadius = _opt$minRadius === undefined ? 0 : _opt$minRadius,
            _opt$release = _opt.release,
            release = _opt$release === undefined ? true : _opt$release,
            _opt$fadeTime = _opt.fadeTime,
            fadeTime = _opt$fadeTime === undefined ? 300 : _opt$fadeTime,
            _opt$recycle = _opt.recycle,
            recycle = _opt$recycle === undefined ? true : _opt$recycle,
            _opt$recycleDelay = _opt.recycleDelay,
            recycleDelay = _opt$recycleDelay === undefined ? 500 : _opt$recycleDelay,
            _opt$fill = _opt.fill,
            fill = _opt$fill === undefined ? true : _opt$fill,
            _opt$explodeTime = _opt.explodeTime,
            explodeTime = _opt$explodeTime === undefined ? 300 : _opt$explodeTime,
            _opt$maxAngle = _opt.maxAngle,
            maxAngle = _opt$maxAngle === undefined ? 360 : _opt$maxAngle,
            _opt$gravity = _opt.gravity,
            gravity = _opt$gravity === undefined ? 0 : _opt$gravity,
            _opt$round = _opt.round,
            round = _opt$round === undefined ? false : _opt$round,
            _opt$groundDistance = _opt.groundDistance,
            groundDistance = _opt$groundDistance === undefined ? 400 : _opt$groundDistance,
            _opt$ignoreCompelete = _opt.ignoreCompelete,
            ignoreCompelete = _opt$ignoreCompelete === undefined ? false : _opt$ignoreCompelete;
        var _opt2 = opt,
            maxWidth = _opt2.maxWidth;


        var $target = this;
        var $targetImage = void 0;
        var args = arguments;
        if ($target.length > 1) {
            //explode separately
            $target.each(function () {
                var $dom = $(this);
                $dom.explode.apply($dom, args);
            });
            return;
        } else if (!$target.length) {
            return;
        }

        if ($target.prop("tagName") === "IMG") {
            if (!$target.prop("complete")) {

                $target.on("load", function () {
                    $target.explode.apply($target, args);
                });
                return;
            }
            $targetImage = $target;
        } else if ($target.css("backgroundImage") !== "none") {

            var src = $target.css("backgroundImage").match(/url\(\"([\S\s]*)\"\)/)[1];
            $targetImage = $("<img/>", {
                src: src
            });
            if (!opt.ignoreCompelete) {
                $targetImage.on("load", function () {
                    opt.ignoreCompelete = true;
                    $target.explode.apply($target, [opt]);
                });
                return;
            }
        }

        var w = $target.width();
        var h = $target.height();
        var minorDimension = Math.min(w, h);
        var radiusData = getRadiusData();

        var ctxWidth = Math.max(w, radius * 2);
        var ctxHeight = Math.max(h, radius * 2, groundDistance * 2);
        if (!maxWidth) {
            maxWidth = minorDimension / 4;
        }
        var $wrapper = $("<div></div>", {
            "class": wrapperName
        });
        var syncStyles = ["width", "height", "margin-top", "margin-right", "margin-bottom", "margin-left", "position", "top", "right", "bottom", "left", "float", "display"];
        syncStyles.forEach(function (v) {
            $wrapper.css(v, $target.css(v));
        });
        //        $wrapper.css("background-color", "black");
        if ($wrapper.css("position") === "static") {
            $wrapper.css("position", "relative");
        }

        var startRatio = 0.3;

        //generate rags' body
        var rags = generateRags();
        getRagsFinalState();

        var $canvas = $("<canvas></canvas>");

        //standard canvas, to draw the ideal target
        var $canvas0 = $("<canvas></canvas>");
        $canvas0.css({
            width: w,
            height: h
        });
        $canvas0.attr({
            width: w,
            height: h
        });

        $canvas.css({
            position: "absolute",
            left: (w - ctxWidth) / 2,
            right: (w - ctxWidth) / 2,
            top: (h - ctxHeight) / 2,
            bottom: (h - ctxHeight) / 2,
            margin: "auto",
            width: ctxWidth,
            height: ctxHeight
        });
        $canvas.attr({
            width: ctxWidth,
            height: ctxHeight
        });

        $wrapper.append($canvas);

        var ctx = $canvas[0].getContext("2d");
        var ctx0 = $canvas0[0].getContext("2d");

        var _$targetImage$ = $targetImage[0],
            naturalWidth = _$targetImage$.naturalWidth,
            naturalHeight = _$targetImage$.naturalHeight;

        if ($target.prop("tagName") === "IMG") {
            ctx0.drawImage($targetImage[0], 0, 0, naturalWidth, naturalHeight, 0, 0, w, h);
        } else if ($target.css("backgroundImage") !== "none") {
            var i;
            var j;

            (function () {
                var warn = function warn(key) {
                    console.warn("Unsupported " + key + " style:" + config[key]);
                };

                var dx = 0,
                    dy = 0,
                    dWidth = naturalWidth,
                    dHeight = naturalHeight;
                var config = {
                    'background-repeat': $target.css("background-repeat"),
                    "background-size": $target.css("background-size"),
                    'background-position-x': $target.css("background-position-x"),
                    'background-position-y': $target.css("background-position-y")
                };

                var ratioW = w / naturalWidth;
                var ratioH = h / naturalHeight;

                if (config["background-size"] === "cover") {
                    var ratio = Math.max(ratioW, ratioH);

                    dWidth = naturalWidth * ratio;
                    dHeight = naturalHeight * ratio;
                } else if (config["background-size"] === "contain") {
                    var _ratio = Math.min(ratioW, ratioH);

                    dWidth = naturalWidth * _ratio;
                    dHeight = naturalHeight * _ratio;
                } else {
                    warn("background-size");
                }
                dx = parseInt(config['background-position-x']) / 100 * (w - dWidth);
                dy = parseInt(config['background-position-y']) / 100 * (h - dHeight);

                if (config["background-repeat"] === "repeat") {
                    for (i = 0 - Math.ceil(dx / dWidth); i < w / dWidth + Math.ceil(-dx / dWidth); i++) {
                        for (j = 0 - Math.ceil(dy / dHeight); j < h / dHeight + Math.ceil(-dy / dHeight); j++) {
                            ctx0.drawImage($targetImage[0], 0, 0, naturalWidth, naturalHeight, dx + i * dWidth, dy + j * dHeight, dWidth, dHeight);
                        }
                    }
                } else if (config["background-repeat"] === 'no-repeat') {
                    ctx0.drawImage($targetImage[0], 0, 0, naturalWidth, naturalHeight, dx, dy, dWidth, dHeight);
                } else {
                    warn("background-repeat");
                }
            })();
        } else if ($target.css("backgroundColor") !== "rgba(0, 0, 0, 0)") {
            ctx0.fillStyle = $target.css("backgroundColor");
            ctx0.fillRect(0, 0, w, h);
        } else {
            console.warn("There's nothing to explode.");
        }

        var scaleX = 1;
        var scaleY = 1;
        rags.forEach(function (rag) {
            var left = rag.left,
                top = rag.top,
                ragWidth = rag.width,
                ragHeight = rag.height;


            rag.naturalParams = [left, top, ragWidth, ragHeight];
        });

        $target.after($wrapper);
        $target.prop(wrapperName, $wrapper);
        $target.detach();

        var biasVy = 0;
        explode(function () {
            if (release) {
                doRelease();
            } else if (recycle) {
                doRecycle();
            }
        });

        function doRelease(cb) {
            var startTime = Date.now();
            var leftCnt = rags.length;

            rags.forEach(function (rag) {
                rag.time1 = 1000 / (rag.ratio * (maxWidth + 1 - rag.width) / maxWidth + 0.1);
                rag.time2 = rag.time1 + fadeTime;
            });
            draw();

            function draw() {
                var time = Date.now();
                var duration = time - startTime;

                ctx.clearRect(0, 0, ctxWidth, ctxHeight);

                rags.forEach(function (rag) {
                    ctx.save();
                    var ragWidth = rag.width,
                        ragHeight = rag.height;


                    ctx.translate(rag.biasx, rag.biasy);

                    ctx.rotate(rag.lastAngle || rag.finalAngleRad);

                    if (round) {
                        ctx.beginPath();
                        ctx.arc(0, 0, ragWidth / 2, 0, Math.PI * 2, false);
                        ctx.closePath();
                        ctx.clip();
                    }
                    var alpha = void 0;
                    if (duration < rag.time1) {
                        alpha = 1;
                    } else if (duration > rag.time2) {
                        alpha = 0;
                    } else {
                        alpha = 1 - (duration - rag.time1) / fadeTime;
                    }
                    if (alpha === 0 && !rag.released) {
                        rag.released = true;
                        leftCnt--;
                    }
                    ctx.globalAlpha = alpha;
                    ctx.drawImage($canvas0[0], rag.left, rag.top, rag.width, rag.height, -ragWidth / 2, -ragHeight / 2, ragWidth, ragHeight);
                    ctx.restore();
                });
                if (!leftCnt) {
                    cb && cb();
                } else {
                    window.requestAnimationFrame(draw);
                }
            }
        }

        function doRecycle() {
            setTimeout(function () {
                explode(function () {
                    $target.explodeRestore();
                }, true);
            }, recycleDelay);
        }

        function explode(cb, reverse) {
            var startTime = Date.now();
            var lastTime = startTime;
            var leftCnt = rags.length;

            if (!reverse) {
                rags.forEach(function (rag) {
                    rag.vx = rag.translateX / explodeTime * 1000;
                    rag.vy = rag.translateY / explodeTime * 1000;

                    rag.biasx = rag.translateX0;
                    rag.biasy = rag.translateY0;
                    rag.transYMax = ctxHeight / 2 + groundDistance - rag.height / 2;
                });
            }

            draw();

            function draw() {
                var time = Date.now();
                var ratio = void 0;
                var angleRatio = void 0;
                ratio = (time - lastTime) / 1000;
                angleRatio = (time - startTime) / explodeTime;
                if (reverse) {
                    angleRatio = 1 - angleRatio;
                }
                if (gravity) {
                    biasVy += gravity * ratio * 300;
                } else {
                    if (angleRatio > 1 || angleRatio < 0) {
                        cb && cb();
                        return;
                    }
                    ratio *= Math.cos(angleRatio * Math.PI / 2) * Math.PI / 2;
                }
                if (reverse) {
                    ratio = -ratio;
                }
                lastTime = time;
                ctx.clearRect(0, 0, ctxWidth, ctxHeight);
                rags.forEach(function (rag) {
                    ctx.save();
                    var ragWidth = rag.width,
                        ragHeight = rag.height;


                    if (!rag.land) {
                        rag.biasx += rag.vx * ratio;
                        rag.biasy += (rag.vy + biasVy) * ratio;

                        if (gravity) {
                            if (rag.biasy > rag.transYMax) {
                                leftCnt--;
                                rag.land = true;
                                rag.lastAngle = rag.finalAngleRad * angleRatio;
                                rag.biasy = rag.transYMax;
                            }
                        }
                    }

                    ctx.translate(rag.biasx, rag.biasy);

                    if (rag.lastAngle) {
                        ctx.rotate(rag.lastAngle);
                    } else {
                        ctx.rotate(rag.finalAngleRad * angleRatio);
                    }

                    if (round) {
                        ctx.beginPath();
                        ctx.arc(0, 0, ragWidth / 2, 0, Math.PI * 2, false);
                        ctx.closePath();
                        ctx.clip();
                    }

                    ctx.drawImage($canvas0[0], rag.left, rag.top, rag.width, rag.height, -ragWidth / 2, -ragHeight / 2, ragWidth, ragHeight);
                    ctx.restore();
                });
                if (gravity && !leftCnt) {
                    cb();
                } else {
                    window.requestAnimationFrame(draw);
                }
            }
        }

        function random(min, max) {
            return parseInt(Math.random() * (max + 1 - min), 10) + min;
        }

        //generate final position and angle of rags
        function getRagsFinalState() {
            rags.forEach(function (v, i) {
                var finalAngle = (Math.random() * maxAngle * 2 - maxAngle) / ((Math.random() + 2) * v.width) * 10;

                //coordinate based on center point
                var x = v.left + v.width / 2 - w / 2;
                var y = v.top + v.width / 2 - h / 2;

                if (x === 0) {
                    x = i % 2 ? -1 : 1;
                }
                if (y === 0) {
                    y = i % 4 < 2 ? -1 : 1;
                }

                var distance = Math.sqrt(x * x + y * y);

                var ratio = ((1 - startRatio) * (1 - (v.width - minWidth) / (maxWidth - minWidth)) + startRatio) * Math.random();
                ratio = 1 - (1 - ratio) * (1 - minRadius / radius);

                var finalDistance = (radius - distance) * ratio + distance;
                var distanceSquare = distance * distance;

                var attach = {
                    finalDistance: finalDistance,
                    ratio: ratio,
                    x: x,
                    y: y,
                    distance: distance,
                    translateX: (finalDistance - distance) * Math.sqrt((distanceSquare - y * y) / distanceSquare) * (x > 0 ? 1 : -1),
                    translateY: (finalDistance - distance) * Math.sqrt((distanceSquare - x * x) / distanceSquare) * (y > 0 ? 1 : -1),
                    translateX0: (ctxWidth - w) / 2 + v.left + v.width / 2,
                    translateY0: (ctxHeight - h) / 2 + v.top + v.height / 2,
                    finalAngle: finalAngle,
                    finalAngleRad: finalAngle * (Math.PI / 180)
                };

                for (var _i in attach) {
                    v[_i] = attach[_i];
                }
            });
        }
        //generate inital position and dimension of rags
        //rewrite it to fit for you demand
        function generateRags() {
            var rowCnt = void 0;
            var base = [[0, 1], [1, 1], [1, 0], [0, 0]];
            if (omitLastLine) {
                rowCnt = Math.floor(h / maxWidth);
            } else {
                rowCnt = Math.ceil(h / maxWidth);
            }

            var rags = [];

            var noRadius = radiusData.every(function (v) {
                return v === 0;
            });

            for (var row = 0; row < rowCnt; row++) {
                generateRow(row);
            }

            function isInner(x, y) {
                if (x < radiusData[0] && y > h - radiusData[0] || x > w - radiusData[1] && y > h - radiusData[1] || x > w - radiusData[2] && y < radiusData[2] || x < radiusData[3] && y < radiusData[3]) {
                    return false;
                }
                return true;
            }

            function distanceLessThan(x1, y1, x2, y2, d) {
                return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) < d * d;
            }

            function tryPushRag(_ref) {
                var left = _ref.left,
                    top = _ref.top,
                    width = _ref.width,
                    height = _ref.height;

                var x = left + width / 2;
                var y = h - top - height / 2;

                if (noRadius || isInner(x, y) || radiusData.some(function (v, i) {
                    return distanceLessThan(x, y, base[i][0] * w + 2 * (0.5 - base[i][0]) * v, base[i][1] * h + 2 * (0.5 - base[i][1]) * v, v);
                })) {
                    rags.push({
                        left: left,
                        top: top,
                        width: width,
                        height: height
                    });
                }
            }

            function generateRow(row) {
                var rowSum = 0;
                var topBase = row * maxWidth;

                function generate(width) {
                    var left = rowSum;
                    rowSum += width;
                    tryPushRag({
                        left: left,
                        top: topBase,
                        width: width,
                        height: width
                    });
                    if (fill) {
                        for (var _i2 = 1; _i2 < parseInt(maxWidth / width); _i2++) {
                            tryPushRag({
                                left: left,
                                top: topBase + _i2 * width,
                                width: width,
                                height: width
                            });
                        }
                    }
                }
                var width = void 0;
                do {
                    if (width) {
                        generate(width);
                    }
                    width = random(minWidth, maxWidth);
                } while (w > rowSum + width);
                if (w - rowSum >= minWidth) {
                    generate(w - rowSum);
                }
            }
            rags.sort(function (rag1, rag2) {

                return Math.random() > 0.5 ? 1 : -1;
            });

            return rags;
        }
        //get an array of 4 corners of radius        
        function getRadiusData() {
            var ret = ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"];
            var width = $target.width();
            ret = ret.map(function (key) {
                var radius = $target.css(key);
                if (radius.match(/px$/)) {
                    return radius.match(/^\d+/)[0] * 1;
                } else if (radius.match(/%$/)) {
                    return radius.match(/^\d+/)[0] / 100 * width;
                }
                return radius;
            });
            ret = ret.map(function (radius) {
                if (radius > width / 2) {
                    radius = width / 2;
                }
                return radius;
            });
            return ret;
        }
    };
})(window.jQuery);