var bs = {}; // namespace

HTMLElement.prototype.onEvent = function (eventType, callBack, useCapture) {
    this.addEventListener(eventType, callBack, useCapture);
    if (!this.myListeners) {
        this.myListeners = [];
    };
    this.myListeners.push({ eType: eventType, callBack: callBack });
    return this;
};


HTMLElement.prototype.removeListeners = function (evt) {
    if (this.myListeners) {
        for (var i = 0; i < this.myListeners.length; i++) {
            if (evt === undefined) {
                this.removeEventListener(this.myListeners[i].eType, this.myListeners[i].callBack);
            } else {
                this.removeEventListener(evt, this.myListeners[i].callBack);
            }
        };
        delete this.myListeners;
    };
};
!function (bs) {
    bs._select = function(sel) {
        var _self = this;
        if (sel instanceof HTMLElement) {
            this.element = sel;
        } else {
            this.element = document.querySelector(sel);
        }

        // return the html if no argument passed or set html
        this.html = function(s) {
            if (s === undefined) { return this.element.innerHTML; }
            this.element.innerHTML = s;
            return this;
        };

        // get the selected element
        this.get = function() { return this.element; };

        // append and prepend helper method
        function helper_appendPrepend(el, is_append) {
            if (typeof el === "string") {
                var parser = new DOMParser();
                var doc = parser.parseFromString(el, "text/html");
                el = doc.getElementsByTagName('body')[0].childNodes;
            } else {
                el = [el];
            }


            for (var i = 0; i < el.length; i++) {
                var tmp = el[i].cloneNode(true);
                if (is_append) {
                    _self.element.appendChild(tmp);
                } else {
                    _self.element.insertBefore(tmp, _self.element.firstChild);
                }
            }

            return _self;
        }


        // append to selected element
        this.append = function(el) {
            return helper_appendPrepend(el, true);
        };

        // prepend to selected element
        this.prepend = function(el) {
            return helper_appendPrepend(el, false);
        };


        // bind one or more events to selected element
        this.on = function() {
            var callback = arguments[arguments.length - 1];
            for (var i = 0; i < arguments.length - 1; i++) {
                this.element.onEvent(arguments[i], callback, false);
            }
            return this;
        };

        // bind an event to selected element
        this.bind = function(evt, callback) {
            this.element.onEvent(evt, callback, false);
            return this;
        };

        // addclass to selected element
        this.addClass = function(cls) {
            if (!this.element.classList.contains(cls) && cls !== undefined) {
                this.element.classList.add(cls);
            }
            return this;
        };

        // addclass to selected element
        this.removeClass = function(cls) {
            if (this.element.classList.contains(cls) && cls !== undefined) {
                this.element.classList.remove(cls);
            }
            return this;
        };

        // toggle class to selected element
        this.toggleClass = function(cls) {
            if (cls !== undefined) {
                if (this.element.classList.contains(cls)) {
                    this.element.classList.remove(cls);
                } else {
                    this.element.classList.add(cls);
                }
            }
            return this;
        };

        // select all siblings and pass it to selectAll method
        this.siblings = function() {
            var elem = this.element.parentNode.firstChild;
            var sibs = [];
            while (elem = elem.nextSibling) {
                if (elem.nodeType === 3) continue; // text node
                if (elem !== this.element) sibs.push(elem);
            }
            return bs.selectAll(sibs);
        };

        // return all children as selectAll object
        this.children = function() {
            return bs.selectAll(this.element.children);
        };

        // return height of selected element
        this.height = function() {
            return this.element.clientHeight;
        };

        // return width of selected element
        this.width = function() {
            return this.element.clientWidth;
        };

        // trigger an event that added to the element
        this.trigger = function(evt) {
            var event = new Event(evt);
            this.element.dispatchEvent(event);
            return this;
        };

        // remove and event to selected element
        this.unbind = function(evt) {
            this.element.removeListeners(evt);
            return this;
        };

        // set or get value
        this.val = function(s) {
            if (s === undefined) { return this.element.value; }
            this.element.value = s;
            return this;
        };

        // get selected element coords
        this.offset = function() {
            var coords = {};
            coords.left = this.element.offsetLeft;
            coords.top = this.element.offsetTop;
            return coords;
        };

        // remove selected element
        this.remove = function(sel) {
            if (sel !== undefined) {
                var doc = document.createElement("div");
                doc.appendChild(this.element.cloneNode(true));
                var el = doc.querySelector(sel);
                if (el !== null) {
                    this.element.parentElement.removeChild(this.element);
                }
            } else {
                this.element.parentElement.removeChild(this.element);
            }
            return this;
        };

        // set or get attribute
        this.attr = function(key, val) {
            if (val === undefined) { return this.element.getAttribute(key); };
            this.element.setAttribute(key, val);
            return this;
        };

        // remove an attribute from selected element
        this.removeAttr = function(key) {
            this.element.removeAttribute(key);
            return this;
        };

        // add css to selected element
        this.css = function(styles) {
            var keys = Object.keys(styles);
            for (var i = 0; i < keys.length; i++) {
                this.element.style[keys[i]] = styles[keys[i]];
            }
            return this;
        };

        // replace with given content
        this.replaceWith = function(content) {
            if (content instanceof HTMLElement || content instanceof Node) {
                this.element.parentElement.replaceChild(content, this.element);
            } else {
                var parser = new DOMParser();
                var doc = parser.parseFromString(content, "text/html");
                content = doc.getElementsByTagName('body')[0].firstChild;
                this.element.parentElement.replaceChild(content, this.element);
            }
            this.element = content;
            return this;
        };

        // check if the element has given class
        this.hasClass = function(cls) {
            return this.element.contains(cls);
        };
    };

    bs.select = function(el) {
        return new bs._select(el);
    };
}(bs);
!function (bs) {
    bs._selectAll = function(sel) {
        this.elements = [];


        if (sel instanceof Array || sel instanceof HTMLCollection || sel instanceof NodeList) {
            this.elements = sel;
        } else {
            this.elements = document.querySelectorAll(sel);
        }

        // set html to all selected elements or get html of first elment
        this.html = function(s) {
            if (s === undefined) {
                return this.elements[0].innerHTML;
            } else {
                for (var i = 0; i < this.elements.length; i++) {
                    this.elements[i].innerHTML = s;
                }
            }
            return this;
        };

        // get element by given index
        this.get = function(i) {
            if (i === undefined) { i = 0; }
            return this.elements[i];
        };

        // loop through each element
        this.each = function(callback) {
            for (var i = 0; i < this.elements.length; i++) {
                callback(bs.select(this.elements[i]));
            }
            return this;
        };

        // bind an event to selected elements
        this.bind = function(evt, callback) {
            this.each(function(el) {
                el.bind(evt, callback);
            });
            return this;
        };

        // bind multiple events to selected elements
        this.on = function() {
            var _self = this;
            var callback = arguments[arguments.length - 1];
            for (var i = 0; i < _self.elements.length; i++) {
                for (var j = 0; j < arguments.length; j++) {
                    _self.elements[i].onEvent(arguments[j], callback, false);
                }
            }
            return this;
        };

        // append element(s) to selected elements
        this.append = function(el) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).append(el);
            }
            return this;
        };

        // prepend element(s) to selected elements
        this.prepend = function(el) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).prepend(el);
            }
            return this;
        };

        // addclass to selected element
        this.addClass = function(cls) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).addClass(cls);
            }
            return this;
        };

        // addclass to selected element
        this.removeClass = function(cls) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).removeClass(cls);
            }
            return this;
        };

        // toggle class to selected element
        this.toggleClass = function(cls) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).toggleClass(cls);
            }
            return this;
        };

        // return number of element in the elements
        this.size = function() {
            return this.elements.length;
        };

        // trigger an event that attached to selected elements
        this.trigger = function(evt) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).trigger(evt);
            }
            return this;
        };

        // remove event to selected elements
        this.unbind = function(evt) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).unbind(evt);
            }
            return this;
        };

        // set value to all elements or get value of first element
        this.val = function(s) {
            if (s === undefined) {
                for (var i = 0; i < this.elements.length; i++) {
                    bs.select(this.elements[i]).val(s);
                }
            } else {
                return this.elements[0].value;
            }
            return this;
        };

        // remove matched elements
        this.remove = function(sel) {
            if (sel !== undefined) {
                for (var i = 0; i < this.elements.length; i++) {
                    var doc = document.createElement("div");
                    doc.appendChild(this.elements[i].cloneNode(true));
                    var el = doc.querySelector(sel);
                    if (el !== null) {
                        this.elements[i].parentElement.removeChild(this.elements[i]);
                    }
                }
            } else {
                for (var i = 0; i < this.elements.length; i++) {
                    this.elements[i].parentElement.removeChild(this.elements[i]);
                }
            }
            return this;
        };

        // set attribute to all selected element or get attribute from first element
        this.attr = function(key, val) {
            if (val === undefined) { return this.elements[0].getAttribute(key); }
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute(key, val);
            }
        };

        // remove an attribute from selected elements
        this.removeAttr = function(key) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i].removeAttribute(key);
            }
            return this;
        };

        // find elements from selected elements
        this.find = function(sel) {
            var tmp = new Array();
            if (sel !== undefined) {
                for (var i = 0; i < this.elements.length; i++) {
                    var doc = document.createElement("div");
                    doc.appendChild(this.elements[i].cloneNode(true));
                    var el = doc.querySelector(sel);
                    if (el !== null) {
                        tmp.push(this.elements[i])
                    }
                }
                this.elements = tmp;
            }
            return this;
        };

        // add css to selected elements
        this.css = function(styles) {
            for (var i = 0; i < this.elements.length; i++) {
                bs.select(this.elements[i]).css(styles);
            }
            return this;
        };

        // replace selected elements with given content
        this.replaceWith = function(content) {
            var tmp = [];
            for (var i = 0; i < this.elements.length; i++) {
                var el = bs.select(this.elements[i]);
                el.replaceWith(content);
                tmp.push(el.element);
            }
            this.elements = tmp;
            return this;
        };

        // add more elements to selcted elements with selctor
        this.add = function(sel) {
            var els = document.querySelectorAll(sel);
            var tmp = [];
            for (var j = 0; j < els.length; j++) {
                for (var i = 0; i < this.elements.length; i++) {
                    if (els[j] !== this.elements[i]) {
                        tmp.push(els[j]);
                    }
                }
            }
            for (var j = 0; j < tmp.length; j++) {
                this.elements.push(tmp[j]);
            }
            console.log(this.elements);
            return this;
        };
    };

    bs.selectAll = function(sel) {
        return new bs._selectAll(sel);
    };
}(bs);
//# sourceMappingURL=base.js.map

/*! Hammer.JS - v2.0.8 - 2016-04-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.8",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha,"function"==typeof define&&define.amd?define(function(){return ha}):"undefined"!=typeof module&&module.exports?module.exports=ha:a[c]=ha}(window,document,"Hammer");
var chai = {}; // namespace

!function (bs, chai) {
    /* core */

    /* initialize method */
    chai.init = function () {
        chai.stack = [];
        chai.stack.push(bs.select(".chai.activity[data-startup='true']").get());
        bs.selectAll(".chai.activity").each(function (activity) {
            activity.children().find(".chai.action.bar").each(function (el) {
                // paddingTop: el.height() + "px",
                bs.select(activity.get().querySelector(".chai.body")).css({
                    height: window.innerHeight + "px"
                })
            });
            if (activity.attr("data-startup") !== "true") {
                activity.css({
                    opacity: "0",
                    top: "10%",
                    visibility: "hidden",
                    position: "absolute",
                    zIndex: "-999"
                });
            }
        });
        // bs.selectAll(".chai.button:not(.disabled):not(.ignore)").bind("click", chai.addRippleEffect);
        // bs.selectAll(".chai.list").addClass("flat").bind("click", chai.addRippleEffect);

        chai.accordion.init();
        chai.dropdown.init();
    };

    window.addEventListener("load", chai.init, false);

    /* activity */
    chai.startActivity = function (activity) {
        bs.selectAll(".chai.activity").each(function (activity) {
            activity.css({
                opacity: "0",
                top: "10%",
                visibility: "hidden",
                position: "absolute",
                zIndex: "-999"
            }).addClass("notrans");
        });
        bs.select(activity).removeClass("notrans").css({
            opacity: "1",
            top: "0",
            visibility: "visible",
            position: "absolute",
            zIndex: "1"
        });
        chai.stack.push(activity);
    };
    chai.finishActivity = function () {
        var obj = {};
        console.log(chai.stack);
        obj.onFirstActivity = function (callback) {
            if (chai.stack.length === 1) {
                callback();
            }
            return obj;
        };

        if (chai.stack.length !== 1) {
            chai.startActivity(chai.stack[chai.stack.length - 2]);
            chai.stack.pop();
            chai.stack.pop();
            console.log(chai.stack);
        }

        return obj
    };
}(bs, chai);
!function (bs, chai) {
    chai.accordion = {};
    chai.accordion.init = function () {
        bs.selectAll(".chai.accordion").each(function (el) {
            el.children().each(function (el) {
                bs.select(el.children().get()).bind("click", function () {
                    el.siblings().removeClass("visible");
                    el.toggleClass("visible");
                });
            });
        });
    };
}(bs, chai);
!function (bs, chai) {
    function addTouchGestures (el) {
        el = bs.select(el);
        var obj = {};
        obj.overlay = el.children().find(".overlay").get();
        el = el.get();

        var hammer = new Hammer(el);
        obj.width = 280;
        obj.stage = obj.width;

        hammer.on("panstart", function() {
            obj.overlay.style.visibility = "visible";
        });
        hammer.on("panstart panmove", function(e) {
            obj.overlay.style.opacity = ((el.offsetLeft + obj.width) / obj.width) * 0.5 + "";

            if (e.deltaX <= obj.width) {
                if (obj.stage === 0) {
                    if (e.deltaX <= 0) {
                        el.style.left = e.deltaX - obj.stage + "px";
                    }
                } else {
                    el.style.left = e.deltaX - obj.stage + "px";
                }
            } else {
                el.style.left = "0";
            }
        });

        hammer.on("panend", function(e) {
            console.log(el.offsetLeft);
            if (e.deltaX >= 0) {
                if (e.deltaX < obj.width / 2) {
                    if (obj.stage !== 0) {
                        obj.stage = obj.width;
                        el.style.left = "-" + obj.stage + "px";
                        obj.overlay.style.opacity = 0;
                        obj.overlay.style.visibility = "hidden";
                    }
                } else {
                    el.style.left = "0";
                    obj.stage = 0;
                    obj.overlay.style.opacity = 0.5;
                    obj.overlay.style.visibility = "visible";
                }
            } else {
                if (e.deltaX < -Math.abs(obj.width / 2)) {
                    obj.stage = obj.width;
                    el.style.left = "-" + obj.stage + "px";
                    obj.overlay.style.opacity = 0;
                    obj.overlay.style.visibility = "hidden";
                } else {
                    el.style.left = "0";
                    obj.stage = 0;
                    obj.overlay.style.opacity = 0.5;
                    obj.overlay.style.visibility = "visible";
                }
            }

        });
        bs.select(obj.overlay).bind("click", function () {
            obj.stage = obj.width;
            el.style.left = "-" + obj.stage + "px";
            obj.overlay.style.opacity = 0;
            obj.overlay.style.visibility = "hidden";
        });
        return obj;
    }

    // navigation drawer
    chai.navigationDrawer = function (drawer) {
        var obj = {};
        var hammer;
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");

        obj.create = function () {
            drawer.appendChild(overlay);
            hammer = addTouchGestures (drawer);
            obj.close();
            return obj;
        };
        obj.open = function () {
            drawer.style.left = "0";
            hammer.stage = 0;
            hammer.overlay.style.opacity = 0.5;
            hammer.overlay.style.visibility = "visible";
            return obj;
        };
        obj.close = function () {
            hammer.stage = hammer.width;
            drawer.style.left = "-" + hammer.stage + "px";
            hammer.overlay.style.opacity = 0;
            hammer.overlay.style.visibility = "hidden";
            return obj;
        };
        return obj;
    };

    // options menu
    chai.optionsMenu = function (el) {
        bs.select(el).unbind("click");
        var obj = {};
        var menu = document.createElement("div");
        var overlay = document.createElement("div");
        bs.select(overlay).css({
            position: "fixed",
            top: "0",
            left: "0",
            height: "100%",
            width: "100%",
            zIndex: 9,
            visibility: "hidden"
        });
        var height = 0;
        var width = 0;
        var is_open = false;
        bs.select(menu).attr("class", "chai options menu").css({
            visibility: "hidden"
        });
        obj.addOption = function (s, callback) {
            var option = document.createElement("div");
            option = bs.select(option).attr("class", "option").html(s).bind("click", callback);
            menu.appendChild(option.get());
            return obj;
        };
        obj.create = function () {
            el.appendChild(menu);
            height = menu.clientHeight;
            width = menu.clientWidth;
            el.appendChild(overlay);
            obj.close();
            return obj;
        };
        obj.open = function () {
            bs.select(menu).css({
                height: height + "px",
                width: width + "px",
                opacity: "1",
                visibility: "visible"
            });
            is_open = true;
            bs.select(overlay).css({
                visibility: "visible"
            });
            return obj;
        };
        obj.close = function () {
            bs.select(menu).css({
                height: "0",
                width: width - 10 + "px",
                opacity: "0",
                visibility: "hidden",
                transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
            });
            bs.select(overlay).css({
                visibility: "hidden"
            });
            is_open = false;
            return obj;
        };

        bs.select(el).bind("click", function () {
            if (!is_open) {
                obj.open();
            } else {
                obj.close();
            }
        });
        return obj;
    };
}(bs, chai);

!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.ripple").each(function (el) {
            el = el.get();
            el.addEventListener('click',function(ev)
            {
                var offset = this.getBoundingClientRect();
                var style  = window.getComputedStyle(this);

                var div = document.createElement('div');
                div.classList.add('effect-ripple');
                div.style.height        = style.height;
                div.style.width         = style.height;
                // noinspection JSAnnotator
                div.style.top           = (ev.clientY - offset.top)  - (parseInt(div.style.height) / 2) + "px";
                div.style.left          = (ev.clientX - offset.left) -  (parseInt(div.style.width) / 2) + "px";
                div.style.background    = style.color;

                this.appendChild(div);

                window.setTimeout(function()
                {
                    div.outerHTML = "";
                    delete div;
                },1480);
            });
        });
    }, false);
    chai.disableButton = function (btn) {
        bs.select(btn).unbind().addClass("disabled");
    };
}(bs, chai);
!function (bs, chai) {
    chai.createAlert = function (title, msg) {
        var obj = {};
        var wind = document.createElement("div");
        var overlay = document.createElement("div");
        var btn = document.createElement("button");

        bs.select(btn).css({
            margin: "8px 8px 8px 0",
            float: "right",
            fontSize: "14px",
            minWidth: "0"
        });

        btn.setAttribute("class", "chai button flat primary");
        btn.innerHTML = "Ok";

        obj.okBtn = btn;

        overlay.setAttribute("class", "overlay");
        bs.select(wind).css({
            position: "fixed",
            zIndex: "999",
            top: "40%",
            opacity: "0",
            left: "50%",
            visibility: "hidden",
            transform: "translate(-50%, -50%)",
            paddingTop: "22px",
            width: "270px",
            maxWidth: "95%",
            backgroundColor: "#FFF",
            borderRadius: "2px",
            transition: "all .2s ease-in-out",
            boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 45px, rgba(0, 0, 0, 0.22) 0px 10px 18px"
        });
        var title_element = document.createElement("div");
        bs.select(title_element).css({
            paddingLeft: "24px",
            paddingRight: "24px",
            fontSize: "20px",
            fontWeight: "500"
        });
        title_element.innerHTML = title;
        var msg_element = document.createElement("div");
        bs.select(msg_element).css({
            fontSize: "16px",
            paddingLeft: "24px",
            paddingRight: "24px",
            marginTop: "24px",
            marginBottom: "10px",
            color: "#555",
            maxHeight: "200px",
            overflow: "auto"
        });

        msg_element.innerHTML = msg;
        document.body.appendChild(overlay);
        wind.appendChild(title_element);
        wind.appendChild(msg_element);
        wind.appendChild(btn);

        obj.wind = wind;

        document.body.appendChild(wind);
        bs.select(overlay).css({
            opacity: "0",
            visibility: "hidden"
        });

        obj.show = function () {
            bs.select(wind).css({
                opacity: "1",
                visibility: "visible",
                top: "50%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "1",
                visibility: "visible",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        obj.hide = function () {
            bs.select(wind).css({
                opacity: "0",
                visibility: "hidden",
                top: "40%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "0",
                visibility: "hidden",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        btn.addEventListener("click", obj.hide, false);
        return obj;
    };

    chai.createConfirm = function (title, msg) {
        var wind = chai.createAlert(title, msg);
        var cancel = document.createElement("button");
        bs.select(cancel).css({
            margin: "8px 8px 8px 0",
            float: "right",
            fontSize: "14px",
            minWidth: "0"
        });
        cancel.innerHTML = "cancel";
        cancel.setAttribute("class", "chai button flat");
        wind.wind.appendChild(cancel);

        wind.onSuccess = function (callback) {
            wind.okBtn.addEventListener("click", callback, false);
        };
        wind.onFail = function (callback) {
            cancel.addEventListener("click", function () {
                wind.hide();
                callback();
            }, false);
        };

        return wind;
    };

    chai.createDialog = function (el) {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);
        console.log(overlay);
        bs.select(el).css({
            opacity: "0",
            visibility: "hidden",
            top: "40%"
        });

        var obj = {};
        obj.show = function () {
            bs.select(el).css({
                opacity: "1",
                visibility: "visible",
                top: "50%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "1",
                visibility: "visible",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        obj.hide = function () {
            bs.select(el).css({
                opacity: "0",
                visibility: "hidden",
                top: "40%",
                transition: "all .2s ease-in-out"
            });
            bs.select(overlay).css({
                opacity: "0",
                visibility: "hidden",
                transition: "all .2s ease-in-out"
            });
            return obj;
        };
        obj.onOverlayClick = function (callback) {
            overlay.addEventListener("click", callback, false);
        };

        return obj;
    }
}(bs, chai);
!function (bs, chai) {
    chai.dropdown = {};
    chai.dropdown.init = function () {
        bs.selectAll(".chai.dropdown:not(.disabled)").each(function (el) {
            var overlay = document.createElement("div");
            overlay.setAttribute("class", "overlay");
            overlay.style.visibility = "hidden";
            el.append(overlay);
            el.bind("click", function () {
                if (this.classList.contains("visible")) {
                    bs.select(this).children().get(bs.select(this).children().size() - 1).style.visibility = "hidden";
                    bs.select(this).removeClass("visible");
                } else {
                    bs.select(this).addClass("visible");
                    bs.select(this).children().get(bs.select(this).children().size() - 1).style.visibility = "visible";
                }
            });
        });
    };
}(bs, chai);

!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.spinner:not(.legacy)").html('<div class="circle circle-1">\n' +
            '                <div class="circle-inner"></div>\n' +
            '            </div>\n' +
            '            <div class="circle circle-2">\n' +
            '                <div class="circle-inner"></div>\n' +
            '            </div>');
    }, false);

    chai.createSpinnerLegacy = function (el) {
        var overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");
        document.body.appendChild(overlay);
        var obj = {};

        obj.show = function () {
            bs.select(overlay).css({
                visibility: "visible",
                opacity: "1"
            });
            bs.select(el).css({
                visibility: "visible",
                opacity: "1",
                top: "50%"
            });
            return obj;
        };
        obj.hide = function () {
            bs.select(overlay).css({
                visibility: "hidden",
                opacity: "0"
            });
            bs.select(el).css({
                visibility: "hidden",
                opacity: "0",
                top: "60%"
            });
            return obj;
        };
        overlay.addEventListener("click", function () {
            obj.hide();
        }, false);
        return obj;
    }
}(bs, chai);
!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.range").each(function (el) {
            el.on("input", function () {
                var min = this.min;
                var max = this.max;
                var val = this.value;

                this.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
                if (parseFloat(val) === 0.0) {
                    bs.select(this).addClass("zero");
                } else {
                    bs.select(this).removeClass("zero");
                }
            });
        });
    }, false);
}(bs, chai);
!function (bs, chai) {
    window.addEventListener("load", function () {
        bs.selectAll(".chai.select").each(function (el) {
            el.children().find("input[type='text']").attr("disabled", "disabled");
            bs.select(el.children().find("ul").get()).children().bind("click", function () {
                console.log(this.getAttribute("data-value"));
                el.children().find("input[type='hidden']").get().value = this.getAttribute("data-value");
                el.children().find(".label").html(this.innerHTML);
            });
            bs.select(el.children().find("ul").get()).children().each(function (_el) {
                el.children().find("input[type='hidden']").get().value = bs.select(el.children().find("ul").get()).children().get(0).getAttribute("data-value");
                el.children().find(".label").html(bs.select(el.children().find("ul").get()).children().get(0).innerHTML);
                if (_el.attr("data-default") === "true") {
                    el.children().find("input[type='hidden']").get().value = _el.attr("data-value");
                    el.children().find(".label").html(_el.html());
                }
            });
        });
    }, false);
}(bs, chai);
!function (bs, chai) {
    chai.createSnackBar = function (s, interval) {
        if (interval === undefined) { interval = 2000; }
        var div = document.createElement("div");
        div.setAttribute("class", "chai snackbar");
        div.innerHTML = s;
        var obj = {};

        obj.show = function () {
            bs.select(div).removeClass("hidden");
            bs.select(div).addClass("visible");

            setTimeout(function () {
                obj.hide();
            }, interval);
        };

        obj.hide = function () {
            bs.select(div).removeClass("visible");
            bs.select(div).addClass("hidden");
        };

        document.body.appendChild(div);
        return obj;
    };
}(bs, chai);
//# sourceMappingURL=chai.js.map
