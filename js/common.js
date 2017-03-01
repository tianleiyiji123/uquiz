/**
 * Created by Lwang on 2017/2/26.
 */
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

import $ from "jquery";
/**
 * 去除px并转换为数值
 * @param str
 */
function pxRemove(str) {
    return Number(str.substring(0, str.length - 2))
}

/**
 * 绑定事件
 * @param el
 * @param type
 * @param fn
 */
function bindEv(el, type, fn) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, {
            capture: false,
            passive: false,
            once: false
        });
    } else {
        el["on" + type] = fn;
    }
}

/**
 * 解绑事件
 * @param el
 * @param type
 * @param fn
 */
function unBindEv(el, type, fn) {
    if (el.removeEventListener) {
        el.removeEventListener(type, fn, false);
    } else {
        el["on" + type] = fn;
    }
}

//  获取对象上的类名
function _typeOf(obj) {
    return Object.prototype.toString.call(obj).toLowerCase();
}

console.log(_typeOf(null));
//获取位置信息
function getPosInfo(ev) {
    var _touches = ev.touches;
    if (!_touches || _touches.length == 0) {
        return;
    }
    return {
        pageX: ev.touches[0].pageX,
        pageY: ev.touches[0].pageY,
        clientX: ev.touches[0].clientX || 0,
        clientY: ev.touches[0].clientY || 0
    }
}
(function () {

    function TouchMove(selector) {
        return new TouchMove.fn.init(selector);
    }

    TouchMove.fn = TouchMove.prototype = {
        constructor: TouchMove,

        init: function (selector) {
            this.startPos = {};
            this.movePos = {};
            this.endPos = {};
            this.el = selector instanceof HTMLElement ? selector : _typeOf(selector) == "string" ? document.querySelector(selector) : null;
            if (_typeOf(this.el) === "null") {
                throw new Error("method Toucher.config must pass in an anguments which is an instance of Object, but passed in");
            }
            bindEv(this.el, "touchstart", this._start.bind(this));
            bindEv(this.el, "touchmove", this._move.bind(this));
            bindEv(this.el, "touchend", this._end.bind(this));
        },
        _start: function (ev, fn) {
            if (!ev.touches || ev.touches.length == 0) {
                return;
            }
            var self = this;
            self.startPos = getPosInfo(ev);
            _typeOf(fn) === "function" && fn.call(true,self.startPos);
            ev.stopPropagation();

        },
        _move: function (ev,fn) {
            if (!ev.touches || ev.touches.length == 0) {
                return;
            }
            var self = this;
            self.movePos = getPosInfo(ev);
            _typeOf(fn) === "function" && fn.call(true,self.startPos);
            ev.stopPropagation();
        },
        _end: function (ev,fn) {
            if (!ev.touches || ev.touches.length == 0) {
                return;
            }
            var self = this;
            self.endPos = getPosInfo(ev);
            _typeOf(fn) === "function" && fn.call(true,self.endPos);
            ev.stopPropagation();
        }
    };

    TouchMove.fn.init.prototype = TouchMove.fn;
    window.TouchMove = window.T = TouchMove;

})();



$(function () {
    document.getElementById("J-wrap").addEventListener('touchstart', touchStart);
    document.getElementById("J-wrap").addEventListener('touchmove', touchMove);
    document.getElementById("J-wrap").addEventListener('touchend', touchEnd);
    var x = 0, y = 0, isMove = false, n = 0, no = 1,
        defaultX = pxRemove($("#J-wrap").css("left")),
        defaultY = pxRemove($("#J-wrap").css("top"));
    //touchstart
    function touchStart(e) {
        isMove = true;
        x = e.touches[0].pageX;

        y = e.touches[0].pageY;

        var _top = pxRemove($("#J-wrap").css("top"));
        $("#J-wrap").css({
            "top": (_top),
            "marginTop": 0
        });
        // console.log(x)
        // console.log(y)
    }

    //touchmove
    function touchMove(e) {
        $("#J-wrap").css({
            "marginTop": 0,
            "top": e.touches[0].pageY
        });
        if (Math.abs(e.touches[0].pageX - x) < (Math.abs(e.touches[0].pageY - y))) {
            isMove = true;
            n = e.touches[0].pageY - y;
            e.preventDefault();
        } else {
            isMove = false;
            n = 0;
        }
    }

    //touchend
    function touchEnd(e) {
        console.log(defaultY + n)


        if (n <= -10) {
            isMove = false;


            if (no < 7) {
                $('#J-ul').animate({left: "-" + (no * 16) + "rem"}, 400);
                no += 1;
            }
            n = 0;
        }
        if (n >= 10) {
            isMove = false;
            if (no > 1) {
                $('#J-ul').animate({left: "-" + ((no - 2) * 16) + "rem"}, 400);
                no -= 1;
            } else if (no == 1) {
                $('#J-ul').animate({left: "-" + ((no - 1) * 16) + "rem"}, 400);
            }
            n = 0;
        }
    }
});