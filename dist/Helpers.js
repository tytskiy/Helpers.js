/*
 * Helpers.js - collection of function for mvt-cmpaign developmen
 * Author tytskiy https://github.com/tytskiy
 * Licenced under Public domain in 2014.
 */
(function (prefix, undefined) {
    'use strict';

    var global = window;
    var core = window.mmcore;
    var Helpers;

    Helpers = function (prefix) {
        this.prefix = prefix;
        if (!prefix) {
            throw 'Please set Test prefix';
        }
        this.props = {};
    };

    Helpers.prototype.version = '0.1.1';

    Helpers.prototype.makeDispatcher = function () {
        var dispatcher;

        dispatcher = this.$({});
        dispatcher.subscribe = function () {
            if (dispatcher.on) {
                return dispatcher.on.apply(dispatcher, arguments);
            } else {
                return dispatcher.bind.apply(dispatcher, arguments);
            }
        };
        dispatcher.unsubscribe = function () {
            if (dispatcher.off) {
                return dispatcher.off.apply(dispatcher, arguments);
            } else {
                return dispatcher.unbind.apply(dispatcher, arguments);
            }
        };
        dispatcher.publish = function () {
            return dispatcher.trigger.apply(dispatcher, arguments);
        };
        this.dispatcher = dispatcher;
    };

    Helpers.prototype.setCssNamespace = function () {
        var prefix;

        prefix = this.prefix.toLowerCase();
        this.$('body').addClass('mm-' + prefix);
    };

    Helpers.prototype.detectFirefox = function () {
        var browser;

        browser = navigator.userAgent;
        if (browser && browser.toLowerCase().indexOf('firefox') > -1) {
            return true;
        } else {
            return false;
        }
    };

    Helpers.prototype.fixFirefoxHistory = function () {
        var hash,
            isFirefox;

        isFirefox = this.isFirefox === false ?
            false :
            this.isFirefox = this.detectFirefox();
        if (this.isFirefox) {
            hash = location.hash;
            hash = hash.length ? '' + hash + '-mm' : 'mm';
            location.hash = hash;
        }
    };

    Helpers.prototype.redirect = function (url) {
        if (url) {
            this.fixFirefoxHistory();
            if (location.assign) {
                location.assign(url);
            } else {
                /* jshint ignore:start */
                location = url;
                /* jshint ignore:end */
            }
        }
    };

    Helpers.prototype.delegate = function (selector) {
        var that;

        that = this;
        return function (name, handler) {
            if (!selector || !name || !handler) {
                throw '' + that.prefix + ' delegate: invalid arguments';
            }
            if (that.$.fn.on) {
                that.$(document).on(name, selector, handler);
                return true;
            } else if (that.$.fn.live) {
                that.$(selector).live(name, handler);
                return true;
            }
            return false;
        };
    };

    Helpers.prototype.undelegate = function (selector) {
        var that;

        that = this;
        return function (name, handler) {
            if (!name) {
                throw '' + that.prefix + ' undelegate: invalid arguments';
            }
            if (that.$.fn.off) {
                that.$(document).off(name, selector, handler);
                return true;
            } else if (that.$.fn.die) {
                that.$(selector).die(name, handler);
                return true;
            }
            return false;
        };
    };

    Helpers.prototype.smartbind = function (selector) {
        var that,
            $obj;

        that = this;
        $obj = this.$(selector);
        if ($obj.length) {
            return function (event, func, threshold, execAsap) {
                if (func) {
                    $obj.bind(event, that.debounce(func, threshold, execAsap));
                } else {
                    $obj.trigger(event);
                }
                return true;
            };
        }
        return false;
    };

    Helpers.prototype.injectStyle = function (styleString) {
        var style;

        style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = styleString;
        } else {
            style.appendChild(document.createTextNode(styleString));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
        return style;
    };

    Helpers.prototype.trackAsyncAction = function (data) {
        core._async = true;
        core.SetPageID('events');
        core.SetAction(data.name, data.val || 1, data.attr || '');
        this.request(data.then || function () {}, data.time || null);
    };

    Helpers.prototype.stripScripts = function (html) {
        return html.replace(/<script.*?>(.|\n)*?<\/script>/gim, '');
    };

    Helpers.prototype.wait = function (data) {
        var that,
            check,
            context,
            fail,
            freq,
            isResetFunction,
            reset,
            resetAllTimers,
            success,
            timers,
            waitInner;

        that = this;
        timers = {};
        resetAllTimers = function () {
            clearTimeout(timers.timer);
            clearTimeout(timers.resetTimer);
        };
        check = data.check || null;
        freq = data.frequency || data.freq || 0;
        reset = data.reset || null;
        context = data.context || global || window.top;
        if (typeof data.success === 'function') {
            success = function () {
                resetAllTimers();
                data.success.call(that);
                if (typeof data.always === 'function') {
                    data.always.call(that);
                }
            };
        } else {
            success = function () {
                resetAllTimers();
                if (typeof data.always === 'function') {
                    data.always.call(that);
                }
            };
        }
        if (typeof data.fail === 'function') {
            fail = function () {
                resetAllTimers();
                data.fail.call(that);
                if (typeof data.always === 'function') {
                    data.always.call(that);
                }
            };
        } else {
            fail = function () {
                resetAllTimers();
                if (typeof data.always === 'function') {
                    data.always.call(that);
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
                check = function () {
                    return context.document.getElementById(data.id);
                };
            } else if (data.selector) {
                check = function () {
                    return context.document.querySelector(data.selector);
                };
            } else {
                throw 'wait(): no condition specified';
            }
        }
        if (check.call(that)) {
            success();
        } else if (isResetFunction && reset.call(that)) {
            fail();
        } else {
            waitInner = function (data) {
                timers.timer = setTimeout(function () {
                    if (check.call(that)) {
                        success();
                    } else {
                        if (isResetFunction && reset.call(that)) {
                            fail();
                        } else {
                            waitInner(data);
                        }
                    }
                }, freq);
            };
            if (reset && !isResetFunction) {
                timers.resetTimer = setTimeout(function () {
                    return fail();
                }, reset);
            }
            waitInner(data);
        }
    };

    Helpers.prototype.debounce = function (func, threshold, execAsap) {
        var timeout;

        timeout = null;
        return function () {
            var args, delayed, obj;
            args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
            delayed = function () {
                func.apply(obj, args);
            };
            obj = this;
            if (timeout) {
                clearTimeout(timeout);
            } else if (execAsap) {
                func.apply(obj, args);
                return;
            }
            timeout = setTimeout(delayed, threshold || 200);
        };
    };

    Helpers.prototype.replaceImg = function (newUrl, originImg, callback) {
        var src = newUrl,
            newImg = originImg.cloneNode(false);

        newImg.src = src;
        originImg.parentNode.replaceChild(newImg, originImg);
        if (callback && typeof callback === 'function') {
            callback(newImg);
        }
    };

    Helpers.prototype.request = function(cb, time) {
        var done;

        done = false;
        if (cb && typeof cb === 'function') {
            core.CGRequest(function() {
                done = true;
                cb();
            });
            setTimeout(function() {
                if (!done) {
                    cb();
                }
            }, time || 6000);
        }
    };

    // adopt https://github.com/henrikjoreteg/milliseconds
    Helpers.prototype.ms = (function () {
        var calc;

        calc = function (m) {
            return function(n) { return Math.round(n * m); };
        };
        return {
            seconds: calc(1e3),
            minutes: calc(6e4),
            hours: calc(36e5),
            days: calc(864e5),
            weeks: calc(6048e5),
            months: calc(26298e5),
            years: calc(315576e5)
        };
    })();

    Helpers.prototype.extend = function () {
        return Helpers.extend.apply(arguments);
    };

    Helpers.extend = function (child, parent) {
        var own,
            Ctor;

        own = {}.hasOwnProperty;
        for (var key in parent) {
            if (own.call(parent, key)) {
                child[key] = parent[key];
            }
        }
        Ctor = function () {
            this.constructor = child;
        };
        Ctor.prototype = parent.prototype;
        child.prototype = new Ctor();
        child.__super__ = parent.prototype;
        return child;
    };
    /* Helpers end */

    // export
    core[prefix] = Helpers;
})('T0');