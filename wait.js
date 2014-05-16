(function (global, undefined) {
	'use strict';
	var wait;
	wait = function(data) {
        var check, context, fail, freq, isResetFunction, reset, resetAllTimers, success, timers, waitInner;
        timers = {};
        resetAllTimers = function() {
            clearTimeout(timers.timer);
            clearTimeout(timers.resetTimer);
        };
        check = data.check || null;
        freq = data.frequency || data.freq || 0;
        reset = data.reset || null;
        context = data.context || global || window.top;
        if (typeof data.success === 'function') {
            success = function() {
                resetAllTimers();
                data.success();
                if (data.always === "function") {
                    data.always();
                }
            };
        } else {
            success = function() {
                resetAllTimers();
                if (data.always === "function") {
                    data.always();
                }
            };
        }
        if (typeof data.fail === 'function') {
            fail = function() {
                resetAllTimers();
                data.fail();
                if (data.always === "function") {
                    data.always();
                }
            };
        } else {
            fail = function() {
                resetAllTimers();
                if (data.always === "function") {
                    data.always();
                }
            };
        }
        isResetFunction = typeof reset === 'function' ? true : false;
        if (!isResetFunction) {
            reset = parseInt(reset, 10);
            reset = reset > -1 ? reset : null;
        }
        if (!check) {
            if (data.id) {
                check = function() {
                    return context.document.getElementById(data.id);
                };
            } else if (data.selector) {
                check = function() {
                    return context.document.querySelector(data.selector);
                };
            } else {
                throw 'wait(): no condition specified';
            }
        }
        if (check()) {
            success();
        } else if (isResetFunction && reset()) {
            fail();
        } else {
            waitInner = function(data) {
                timers.timer = setTimeout(function() {
                    if (check()) {
                        success();
                    } else {
                        if (isResetFunction && reset()) {
                            fail();
                        } else {
                            waitInner(data);
                        }
                    }
                }, freq);
            };
            if (reset && !isResetFunction) {
                timers.resetTimer = setTimeout(function() {
                    return fail();
                }, reset);
            }
            waitInner(data);
        }
    };
})(window);