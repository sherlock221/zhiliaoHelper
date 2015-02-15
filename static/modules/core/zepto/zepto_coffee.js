define(function(a, b, c) {
    var d = a("$");
    (function(a, b) {
        function c(a) {
            return a.replace(/([a-z])([A-Z])/, "$1-$2").toLowerCase()
        }
        function d(a) {
            return e ? e + a : a.toLowerCase()
        }
        var e, f, g, h, i, j, k, l, m, n, o = "", p = {Webkit: "webkit",Moz: "",O: "o"}, q = window.document, r = q.createElement("div"), s = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i, t = {};
        a.each(p, function(a, c) {
            return r.style[a + "TransitionProperty"] !== b ? (o = "-" + a.toLowerCase() + "-", e = c, !1) : void 0
        }), f = o + "transform", t[g = o + "transition-property"] = t[h = o + "transition-duration"] = t[j = o + "transition-delay"] = t[i = o + "transition-timing-function"] = t[k = o + "animation-name"] = t[l = o + "animation-duration"] = t[n = o + "animation-delay"] = t[m = o + "animation-timing-function"] = "", a.fx = {off: e === b && r.style.transitionProperty === b,speeds: {_default: 400,fast: 200,slow: 600},cssPrefix: o,transitionEnd: d("TransitionEnd"),animationEnd: d("AnimationEnd")}, a.fn.animate = function(c, d, e, f, g) {
            return a.isFunction(d) && (f = d, e = b, d = b), a.isFunction(e) && (f = e, e = b), a.isPlainObject(d) && (e = d.easing, f = d.complete, g = d.delay, d = d.duration), d && (d = ("number" == typeof d ? d : a.fx.speeds[d] || a.fx.speeds._default) / 1e3), g && (g = parseFloat(g) / 1e3), this.anim(c, d, e, f, g)
        }, a.fn.anim = function(d, e, o, p, q) {
            var r, u, v, w = {}, x = "", y = this, z = a.fx.transitionEnd, A = !1;
            if (e === b && (e = a.fx.speeds._default / 1e3), q === b && (q = 0), a.fx.off && (e = 0), "string" == typeof d)
                w[k] = d, w[l] = e + "s", w[n] = q + "s", w[m] = o || "linear", z = a.fx.animationEnd;
            else {
                u = [];
                for (r in d)
                    s.test(r) ? x += r + "(" + d[r] + ") " : (w[r] = d[r], u.push(c(r)));
                x && (w[f] = x, u.push(f)), e > 0 && "object" == typeof d && (w[g] = u.join(", "), w[h] = e + "s", w[j] = q + "s", w[i] = o || "linear")
            }
            return v = function(b) {
                if ("undefined" != typeof b) {
                    if (b.target !== b.currentTarget)
                        return;
                    a(b.target).unbind(z, v)
                } else
                    a(this).unbind(z, v);
                A = !0, a(this).css(t), p && p.call(this)
            }, e > 0 && (this.bind(z, v), setTimeout(function() {
                A || v.call(y)
            }, 1e3 * e + 25)), this.size() && this.get(0).clientLeft, this.css(w), 0 >= e && setTimeout(function() {
                y.each(function() {
                    v.call(this)
                })
            }, 0), this
        }, r = null
    }(d));
    (function(a) {
        a.fn.coffee = function(b) {
            function c() {
                var b = f(8, m.steamMaxSize), c = e(1, m.steamsFontFamily), d = "#" + e(6, "0123456789ABCDEF"), h = f(0, 44), i = f(-90, 89), j = g(.4, 1), l = a.fx.cssPrefix + "transform";
                l = l + ":rotate(" + i + "deg) scale(" + j + ");";
                var p = a('<span class="coffee-steam">' + e(1, m.steams) + "</span>"),q = f(0, n - m.steamWidth - b);
                q > h && (q = f(0, h)), p.css({position: "absolute",left: h,top: m.steamHeight,"font-size:": b + "px",color: d,"font-family": c,display: "block",opacity: 1}).attr("style", p.attr("style") + l).appendTo(o).animate({top: f(m.steamHeight / 2, 0),left: q,opacity: 0}, f(m.steamFlyTime / 2, 1.2 * m.steamFlyTime), k, function() {
                    p.remove(), p = null
                })
            }
            function d() {
                var a = f(-10, 10);
                a += parseInt(o.css("left")), a >= 54 ? a = 54 : 34 >= a && (a = 34), o.animate({left: a}, f(1e3, 3e3), k)
            }
            function e(a, b) {
                a = a || 1;
                var c = "", d = b.length - 1, e = 0;
                for (i = 0; a > i; i++)
                    e = f(0, d - 1), c += b.slice(e, e + 1);
                return c
            }
            function f(a, b) {
                var c = b - a, d = a + Math.round(Math.random() * c);
                return parseInt(d)
            }
            function g(a, b) {
                var c = b - a, d = a + Math.random() * c;
                return parseFloat(d)
            }
            var h = null, j = null,
                k = "cubic-bezier(.09,.64,.16,.94)",
                l = a(this),
                m = a.extend({},
                    a.fn.coffee.defaults, b),
                n = m.steamWidth, o = a('<div class="coffee-steam-box"></div>').css({height: m.steamHeight,width: m.steamWidth,left: 60,top: -50,position: "absolute",overflow: "hidden","z-index": 0}).appendTo(l);
            return a.fn.coffee.stop = function() {
                clearInterval(h), clearInterval(j)
            }, a.fn.coffee.start = function() {
                h = setInterval(function() {
                    c()
                }, f(m.steamInterval / 2, 2 * m.steamInterval)), j = setInterval(function() {
                    d()
                }, f(100, 1e3) + f(1e3, 3e3))
            }, l
        }, a.fn.coffee.defaults = {steams: ["jQuery", "HTML5", "HTML6", "CSS2", "CSS3", "JS", "$.fn()", "char", "short", "if", "float", "else", "type", "case", "function", "travel", "return", "array()", "empty()", "eval", "C++", "JAVA", "PHP", "JSP", ".NET", "while", "this", "$.find();", "float", "$.ajax()", "addClass", "width", "height", "Click", "each", "animate", "cookie", "bug", "Design", "Julying", "$(this)", "i++", "Chrome", "Firefox", "Firebug", "IE6", "Guitar", "Music", "攻城师", "旅行", "王子墨", "啤酒"],steamsFontFamily: ["Verdana", "Geneva", "Comic Sans MS", "MS Serif", "Lucida Sans Unicode", "Times New Roman", "Trebuchet MS", "Arial", "Courier New", "Georgia"],steamFlyTime: 5e3,steamInterval: 500,steamMaxSize: 30,steamHeight: 200,steamWidth: 300}, a.fn.coffee.version = "2.0.0"
    }(d));
});