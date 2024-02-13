/* navigation.js*/
// function getUrlVars() {
//     var vars = {};
//     var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
//         vars[key] = value;
//     });
//     return vars;
// }
//
// var ref = getUrlVars()["ref"]
// console.log(ref)
const closeTooltip = tooltip => {
    $('[data-toggle="tooltip"]').tooltip('hide')
}

$(document).ready(function(){
  function a(){var a=$(this).scrollTop();Math.abs(n-a)<=t||(a>n&&a>o?$("#sticky-header").removeClass("nav-down").addClass("nav-up"):a+$(window).height()<$(document).height()&&$("#sticky-header").removeClass("nav-up").addClass("nav-down"),n=a)}var e,n=0,t=5,o=$("#sticky-header").outerHeight();$(window).scroll(function(a){e=!0}),setInterval(function(){e&&(a(),e=!1)},250)

  if ( $('[data-toggle="tooltip"]').length ) {
      $('[data-toggle="tooltip"]').tooltip()
      $('[data-toggle="tooltip"]').on('click', function (e) {
        $('[data-toggle="tooltip"]').tooltip('hide')
        $(this).tooltip('show')
      })
  }

  
//   $('[data-toggle="tooltip"]').tooltip({
//         container: 'body'
//     });
  // $.ajax({
  //   url: "/admin/metafields.json",
  //   crossDomain: true,
  //   type: "GET",
  //   dataType: 'jsonp',
  //   cors: true ,
  //   contentType:'application/json',
  //   headers: {
  //       'Access-Control-Allow-Origin': '*',
  //   },
  //   success:function(json){
  //      // do stuff with json (in this case an array)
  //      console.log('success', json)
  //   },
  //   error:function(jqXHR, textStatus, ex){
  //      console.log(textStatus + "," + ex + "," + jqXHR.responseText);
  //   }
  // }).done( function(json) {
  //   console.log(json)
  // })
  // $.get('/templates/customer-metafields.liquid', function(data) {
  //     console.log(data);
  // });
});

/*slabtext*/
!function (e) { e.fn.slabText = function (t) { return e("body").addClass("slabtexted"), this.each(function () { t && e.extend(a, t); var n = e(this), i = this, a = e.extend({}, e.fn.slabText.defaults, t), r = e("span.slabtext", n).length, s = r ? [] : String(e.trim(n.text())).replace(/\s{2,}/g, " ").split(" "), o = null, l = null, h = null, d = e(window).width(), p = n.find("a:first").attr("href") || n.attr("href"), f = p ? n.find("a:first").attr("title") : ""; if (!(!r && a.minCharsPerLine && s.join(" ").length < a.minCharsPerLine)) { var c = function () { var e = jQuery('<div style="display:none;font-size:1em;margin:0;padding:0;height:auto;line-height:1;border:0;">&nbsp;</div>').appendTo(n), t = e.height(); return e.remove(), t }, m = function () { var t, h = n.width(); if (0 != h) { if (n.removeClass("slabtextdone slabtextinactive"), a.viewportBreakpoint && a.viewportBreakpoint > d || a.headerBreakpoint && a.headerBreakpoint > h) return void n.addClass("slabtextinactive"); if (t = c(), r || !a.forceNewCharCount && t == o) o = t; else { o = t; var m, w, g, u, x = Math.min(60, Math.floor(h / (o * a.fontRatio))), v = 0, b = [], C = "", T = "", z = ""; if (0 != x && x != l) { for (l = x; v < s.length;) { for (T = ""; T.length < l && (C = T, T += s[v] + " ", !(++v >= s.length));); a.minCharsPerLine && (w = s.slice(v).join(" "), w.length < a.minCharsPerLine && (T += w, C = T, v = s.length + 2)), g = l - C.length, u = T.length - l, u > g && C.length >= (a.minCharsPerLine || 2) ? (z = C, v--) : z = T, m = e.trim(z).length, z = e("<div/>").text(z).html(), a.wrapAmpersand && (z = z.replace(/&amp;/g, '<span class="amp">&amp;</span>')), z = e.trim(z), b.push('<span class="slabtext slabtext-linesize-' + Math.floor(m / 10) + " slabtext-linelength-" + m + '">' + z + "</span>") } n.html(b.join(" ")), p && n.wrapInner('<a href="' + p + '" ' + (f ? 'title="' + f + '" ' : "") + "/>") } } e("span.slabtext", n).each(function () { var t, n, i, r = e(this), s = r.text(), l = s.split(" ").length > 1; a.postTweak && r.css({ "word-spacing": 0, "letter-spacing": 7 }), n = h / r.width(), i = parseFloat(this.style.fontSize) || o, r.css("font-size", Math.min((i * n).toFixed(a.precision), a.maxFontSize) + "px"), t = a.postTweak ? h - r.width() : !1, t && r.css((l ? "word" : "letter") + "-spacing", (t / (l ? s.split(" ").length - 1 : s.length)).toFixed(a.precision) + "px") }), n.addClass("slabtextdone"), "function" == typeof a.onRender && a.onRender.call(i) } }; m(), a.noResizeEvent || e(window).resize(function () { e(window).width() != d && (d = e(window).width(), clearTimeout(h), h = setTimeout(m, a.resizeThrottleTime)) }) } }) }, e.fn.slabText.defaults = { fontRatio: .78, forceNewCharCount: !0, wrapAmpersand: !0, headerBreakpoint: null, viewportBreakpoint: null, noResizeEvent: !1, resizeThrottleTime: 100, maxFontSize: 999, postTweak: !0, precision: 3, minCharsPerLine: 0, onRender: !0 } }(jQuery);

/*lazysizes*/

!function () { !function () { "use strict"; function t(t) { var e = getComputedStyle(t, null) || {}, i = e.fontFamily || "", r = i.match(n) || "", a = r && i.match(s) || ""; return a && (a = a[1]), { fit: r && r[1] || "", position: c[a] || a || "center" } } function e(t, e) { var i, r = lazySizes.cfg, a = t.cloneNode(!1), n = a.style, s = function () { var e = t.currentSrc || t.src; e && (n.backgroundImage = "url(" + (l.test(e) ? JSON.stringify(e) : e) + ")", i || (i = !0, lazySizes.rC(a, r.loadingClass), lazySizes.aC(a, r.loadedClass))) }; t._lazysizesParentFit = e.fit, t.addEventListener("load", function () { lazySizes.rAF(s) }, !0), a.addEventListener("load", function () { var t = a.currentSrc || a.src; t && t != o && (a.src = o, a.srcset = "") }), lazySizes.rAF(function () { var i = t, l = t.parentNode; "PICTURE" == l.nodeName.toUpperCase() && (i = l, l = l.parentNode), lazySizes.rC(a, r.loadedClass), lazySizes.rC(a, r.lazyClass), lazySizes.aC(a, r.loadingClass), lazySizes.aC(a, r.objectFitClass || "lazysizes-display-clone"), a.getAttribute(r.srcsetAttr) && a.setAttribute(r.srcsetAttr, ""), a.getAttribute(r.srcAttr) && a.setAttribute(r.srcAttr, ""), a.src = o, a.srcset = "", n.backgroundRepeat = "no-repeat", n.backgroundPosition = e.position, n.backgroundSize = e.fit, i.style.display = "none", t.setAttribute("data-parent-fit", e.fit), t.setAttribute("data-parent-container", "prev"), l.insertBefore(a, i), t._lazysizesParentFit && delete t._lazysizesParentFit, t.complete && s() }) } var i = document.createElement("a").style, r = "objectFit" in i, a = r && "objectPosition" in i, n = /object-fit["']*\s*:\s*["']*(contain|cover)/, s = /object-position["']*\s*:\s*["']*(.+?)(?=($|,|'|"|;))/, o = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", l = /\(|\)|'/, c = { center: "center", "50% 50%": "center" }; r && a || addEventListener("lazyunveilread", function (i) { var a = i.target, n = t(a); !n.fit || r && "center" == n.position || e(a, n) }, !0) }(), function (t, e) { "use strict"; if (t.addEventListener) { var i = /\s+(\d+)(w|h)\s+(\d+)(w|h)/, r = /parent-fit["']*\s*:\s*["']*(contain|cover|width)/, a = /parent-container["']*\s*:\s*["']*(.+?)(?=(\s|$|,|'|"|;))/, n = /^picture$/i, s = function (t) { return getComputedStyle(t, null) || {} }, o = { getParent: function (e, i) { var r = e, a = e.parentNode; return i && "prev" != i || !a || !n.test(a.nodeName || "") || (a = a.parentNode), "self" != i && (r = "prev" == i ? e.previousElementSibling : i && (a.closest || t.jQuery) ? (a.closest ? a.closest(i) : jQuery(a).closest(i)[0]) || a : a), r }, getFit: function (t) { var e, i, n = s(t), l = n.content || n.fontFamily, c = { fit: t._lazysizesParentFit || t.getAttribute("data-parent-fit") }; return !c.fit && l && (e = l.match(r)) && (c.fit = e[1]), c.fit ? (i = t._lazysizesParentContainer || t.getAttribute("data-parent-container"), !i && l && (e = l.match(a)) && (i = e[1]), c.parent = o.getParent(t, i)) : c.fit = n.objectFit, c }, getImageRatio: function (e) { var r, a, s, o, l = e.parentNode, c = l && n.test(l.nodeName || "") ? l.querySelectorAll("source, img") : [e]; for (r = 0; r < c.length; r++)if (e = c[r], a = e.getAttribute(lazySizesConfig.srcsetAttr) || e.getAttribute("srcset") || e.getAttribute("data-pfsrcset") || e.getAttribute("data-risrcset") || "", s = e.getAttribute("media"), s = lazySizesConfig.customMedia[e.getAttribute("data-media") || s] || s, a && (!s || (t.matchMedia && matchMedia(s) || {}).matches)) { o = parseFloat(e.getAttribute("data-aspectratio")), !o && a.match(i) && (o = "w" == RegExp.$2 ? RegExp.$1 / RegExp.$3 : RegExp.$3 / RegExp.$1); break } return o }, calculateSize: function (t, e) { var i, r, a, n, s = this.getFit(t), o = s.fit, l = s.parent; return "width" == o || ("contain" == o || "cover" == o) && (a = this.getImageRatio(t)) ? (l ? e = l.clientWidth : l = t, n = e, "width" == o ? n = e : (r = l.clientHeight) > 40 && (i = e / r) && ("cover" == o && i < a || "contain" == o && i > a) && (n = e * (a / i)), n) : e } }, l = function () { t.lazySizes && (lazySizes.parentFit || (lazySizes.parentFit = o), t.removeEventListener("lazyunveilread", l, !0)) }; t.addEventListener("lazyunveilread", l, !0), e.addEventListener("lazybeforesizes", function (t) { if (!t.defaultPrevented) { var e = t.target; t.detail.width = o.calculateSize(e, t.detail.width) } }), setTimeout(l) } }(window, document), function (t, e, i) { "use strict"; function r(e, i) { var r, a, n, s, o = t.getComputedStyle(e); a = e.parentNode, s = { isPicture: !(!a || !f.test(a.nodeName || "")) }, n = function (t, i) { var r = e.getAttribute("data-" + t); if (!r) { var a = o.getPropertyValue("--ls-" + t); a && (r = a.trim()) } if (r) { if ("true" == r) r = !0; else if ("false" == r) r = !1; else if (d.test(r)) r = parseFloat(r); else if ("function" == typeof c[t]) r = c[t](e, r); else if (y.test(r)) try { r = JSON.parse(r) } catch (t) { } s[t] = r } else t in c && "function" != typeof c[t] ? s[t] = c[t] : i && "function" == typeof c[t] && (s[t] = c[t](e, r)) }; for (r in c) n(r); return i.replace(p, function (t, e) { e in s || n(e, !0) }), s } function a(t, e) { var i = [], r = function (t, i) { return u[typeof e[i]] ? e[i] : t }; return i.srcset = [], e.absUrl && (v.setAttribute("href", t), t = v.href), t = ((e.prefix || "") + t + (e.postfix || "")).replace(p, r), e.widths.forEach(function (r) { var a = e.widthmap[r] || r, n = { u: t.replace(z, a).replace(g, e.ratio ? Math.round(r * e.ratio) : ""), w: r }; i.push(n), i.srcset.push(n.c = n.u + " " + r + "w") }), i } function n(t, i, r) { var n = 0, s = 0, o = r; if (t) { if ("container" === i.ratio) { for (n = o.scrollWidth, s = o.scrollHeight; !(n && s || o === e);)o = o.parentNode, n = o.scrollWidth, s = o.scrollHeight; n && s && (i.ratio = s / n) } t = a(t, i), t.isPicture = i.isPicture, A && "IMG" == r.nodeName.toUpperCase() ? r.removeAttribute(l.srcsetAttr) : r.setAttribute(l.srcsetAttr, t.srcset.join(", ")), Object.defineProperty(r, "_lazyrias", { value: t, writable: !0 }) } } function s(t, e) { var i = r(t, e); return c.modifyOptions.call(t, { target: t, details: i, detail: i }), lazySizes.fire(t, "lazyriasmodifyoptions", i), i } function o(t) { return t.getAttribute(t.getAttribute("data-srcattr") || c.srcAttr) || t.getAttribute(l.srcsetAttr) || t.getAttribute(l.srcAttr) || t.getAttribute("data-pfsrcset") || "" } if (e.addEventListener) { var l, c, u = { string: 1, number: 1 }, d = /^\-*\+*\d+\.*\d*$/, f = /^picture$/i, z = /\s*\{\s*width\s*\}\s*/i, g = /\s*\{\s*height\s*\}\s*/i, p = /\s*\{\s*([a-z0-9]+)\s*\}\s*/gi, y = /^\[.*\]|\{.*\}$/, m = /^(?:auto|\d+(px)?)$/, v = e.createElement("a"), b = e.createElement("img"), A = "srcset" in b && !("sizes" in b), h = !!t.HTMLPictureElement && !A; !function () { var e, i = function () { }, r = { prefix: "", postfix: "", srcAttr: "data-src", absUrl: !1, modifyOptions: i, widthmap: {}, ratio: !1 }; l = t.lazySizes && lazySizes.cfg || t.lazySizesConfig, l || (l = {}, t.lazySizesConfig = l), l.supportsType || (l.supportsType = function (t) { return !t }), l.rias || (l.rias = {}), "widths" in (c = l.rias) || (c.widths = [], function (t) { for (var e, i = 0; !e || e < 3e3;)i += 5, i > 30 && (i += 1), e = 36 * i, t.push(e) }(c.widths)); for (e in r) e in c || (c[e] = r[e]) }(), addEventListener("lazybeforesizes", function (t) { var e, i, r, a, u, d, f, g, p, y, v, b, A; if (e = t.target, t.detail.dataAttr && !t.defaultPrevented && !c.disabled && (p = e.getAttribute(l.sizesAttr) || e.getAttribute("sizes")) && m.test(p)) { if (i = o(e), r = s(e, i), v = z.test(r.prefix) || z.test(r.postfix), r.isPicture && (a = e.parentNode)) for (u = a.getElementsByTagName("source"), d = 0, f = u.length; d < f; d++)(v || z.test(g = o(u[d]))) && (n(g, r, u[d]), b = !0); v || z.test(i) ? (n(i, r, e), b = !0) : b && (A = [], A.srcset = [], A.isPicture = !0, Object.defineProperty(e, "_lazyrias", { value: A, writable: !0 })), b && (h ? e.removeAttribute(l.srcAttr) : "auto" != p && (y = { width: parseInt(p, 10) }, E({ target: e, detail: y }))) } }, !0); var E = function () { var i = function (t, e) { return t.w - e.w }, r = function (t) { var e, i, r = t.length, a = t[r - 1], n = 0; for (n; n < r; n++)if (a = t[n], a.d = a.w / t.w, a.d >= t.d) { !a.cached && (e = t[n - 1]) && e.d > t.d - .13 * Math.pow(t.d, 2.2) && (i = Math.pow(e.d - .6, 1.6), e.cached && (e.d += .15 * i), e.d + (a.d - t.d) * i > t.d && (a = e)); break } return a }, a = function (t, e) { var i; return !t._lazyrias && lazySizes.pWS && (i = lazySizes.pWS(t.getAttribute(l.srcsetAttr || ""))).length && (Object.defineProperty(t, "_lazyrias", { value: i, writable: !0 }), e && t.parentNode && (i.isPicture = "PICTURE" == t.parentNode.nodeName.toUpperCase())), t._lazyrias }, n = function (e) { var i = t.devicePixelRatio || 1, r = lazySizes.getX && lazySizes.getX(e); return Math.min(r || i, 2.4, i) }, s = function (e, s) { var o, l, c, u, d, f; if (d = e._lazyrias, d.isPicture && t.matchMedia) for (l = 0, o = e.parentNode.getElementsByTagName("source"), c = o.length; l < c; l++)if (a(o[l]) && !o[l].getAttribute("type") && (!(u = o[l].getAttribute("media")) || (matchMedia(u) || {}).matches)) { d = o[l]._lazyrias; break } return (!d.w || d.w < s) && (d.w = s, d.d = n(e), f = r(d.sort(i))), f }, o = function (i) { var r, n = i.target; if (!A && (t.respimage || t.picturefill || lazySizesConfig.pf)) return void e.removeEventListener("lazybeforesizes", o); ("_lazyrias" in n || i.detail.dataAttr && a(n, !0)) && (r = s(n, i.detail.width)) && r.u && n._lazyrias.cur != r.u && (n._lazyrias.cur = r.u, r.cached = !0, lazySizes.rAF(function () { n.setAttribute(l.srcAttr, r.u), n.setAttribute("src", r.u) })) }; return h ? o = function () { } : addEventListener("lazybeforesizes", o), o }() } }(window, document), function () { "use strict"; if (window.addEventListener) { var t = /\s+/g, e = /\s*\|\s+|\s+\|\s*/g, i = /^(.+?)(?:\s+\[\s*(.+?)\s*\])?$/, r = /\(|\)|'/, a = { contain: 1, cover: 1 }, n = function (t) { var e = lazySizes.gW(t, t.parentNode); return (!t._lazysizesWidth || e > t._lazysizesWidth) && (t._lazysizesWidth = e), t._lazysizesWidth }, s = function (t) { var e; return e = (getComputedStyle(t) || { getPropertyValue: function () { } }).getPropertyValue("background-size"), !a[e] && a[t.style.backgroundSize] && (e = t.style.backgroundSize), e }, o = function (r, a, n) { var s = document.createElement("picture"), o = a.getAttribute(lazySizesConfig.sizesAttr), l = a.getAttribute("data-ratio"), c = a.getAttribute("data-optimumx"); a._lazybgset && a._lazybgset.parentNode == a && a.removeChild(a._lazybgset), Object.defineProperty(n, "_lazybgset", { value: a, writable: !0 }), Object.defineProperty(a, "_lazybgset", { value: s, writable: !0 }), r = r.replace(t, " ").split(e), s.style.display = "none", n.className = lazySizesConfig.lazyClass, 1 != r.length || o || (o = "auto"), r.forEach(function (t) { var e = document.createElement("source"); o && "auto" != o && e.setAttribute("sizes", o), t.match(i) && (e.setAttribute(lazySizesConfig.srcsetAttr, RegExp.$1), RegExp.$2 && e.setAttribute("media", lazySizesConfig.customMedia[RegExp.$2] || RegExp.$2)), s.appendChild(e) }), o && (n.setAttribute(lazySizesConfig.sizesAttr, o), a.removeAttribute(lazySizesConfig.sizesAttr), a.removeAttribute("sizes")), c && n.setAttribute("data-optimumx", c), l && n.setAttribute("data-ratio", l), s.appendChild(n), a.appendChild(s) }, l = function (t) { if (t.target._lazybgset) { var e = t.target, i = e._lazybgset, a = e.currentSrc || e.src; a && (i.style.backgroundImage = "url(" + (r.test(a) ? JSON.stringify(a) : a) + ")"), e._lazybgsetLoading && (lazySizes.fire(i, "_lazyloaded", {}, !1, !0), delete e._lazybgsetLoading) } }; addEventListener("lazybeforeunveil", function (t) { var e, i, r; !t.defaultPrevented && (e = t.target.getAttribute("data-bgset")) && (r = t.target, i = document.createElement("img"), i.alt = "", i._lazybgsetLoading = !0, t.detail.firesLoad = !0, o(e, r, i), setTimeout(function () { lazySizes.loader.unveil(i), lazySizes.rAF(function () { lazySizes.fire(i, "_lazyloaded", {}, !0, !0), i.complete && l({ target: i }) }) })) }), document.addEventListener("load", l, !0), window.addEventListener("lazybeforesizes", function (t) { if (t.target._lazybgset && t.detail.dataAttr) { var e = t.target._lazybgset, i = s(e); a[i] && (t.target._lazysizesParentFit = i, lazySizes.rAF(function () { t.target.setAttribute("data-parent-fit", i), t.target._lazysizesParentFit && delete t.target._lazysizesParentFit })) } }, !0), document.documentElement.addEventListener("lazybeforesizes", function (t) { !t.defaultPrevented && t.target._lazybgset && (t.detail.width = n(t.target._lazybgset)) }) } }(); !function (t, e) { e = { exports: {} }, t(e, e.exports), e.exports }(function (t) { !function (e, i) { var r = function (t, e) { "use strict"; if (e.getElementsByClassName) { var i, r = e.documentElement, a = t.Date, n = t.HTMLPictureElement, s = t.addEventListener, o = t.setTimeout, l = t.requestAnimationFrame || o, c = t.requestIdleCallback, u = /^picture$/i, d = ["load", "error", "lazyincluded", "_lazyloaded"], f = {}, z = Array.prototype.forEach, g = function (t, e) { return f[e] || (f[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), f[e].test(t.getAttribute("class") || "") && f[e] }, p = function (t, e) { g(t, e) || t.setAttribute("class", (t.getAttribute("class") || "").trim() + " " + e) }, y = function (t, e) { var i; (i = g(t, e)) && t.setAttribute("class", (t.getAttribute("class") || "").replace(i, " ")) }, m = function (t, e, i) { var r = i ? "addEventListener" : "removeEventListener"; i && m(t, e), d.forEach(function (i) { t[r](i, e) }) }, v = function (t, i, r, a, n) { var s = e.createEvent("CustomEvent"); return s.initCustomEvent(i, !a, !n, r || {}), t.dispatchEvent(s), s }, b = function (e, r) { var a; !n && (a = t.picturefill || i.pf) ? a({ reevaluate: !0, elements: [e] }) : r && r.src && (e.src = r.src) }, A = function (t, e) { return (getComputedStyle(t, null) || {})[e] }, h = function (t, e, r) { for (r = r || t.offsetWidth; r < i.minSize && e && !t._lazysizesWidth;)r = e.offsetWidth, e = e.parentNode; return r }, E = function () { var t, i, r = [], a = [], n = r, s = function () { var e = n; for (n = r.length ? a : r, t = !0, i = !1; e.length;)e.shift()(); t = !1 }, c = function (r, a) { t && !a ? r.apply(this, arguments) : (n.push(r), i || (i = !0, (e.hidden ? o : l)(s))) }; return c._lsFlush = s, c }(), C = function (t, e) { return e ? function () { E(t) } : function () { var e = this, i = arguments; E(function () { t.apply(e, i) }) } }, S = function (t) { var e, i = 0, r = 666, n = function () { e = !1, i = a.now(), t() }, s = c ? function () { c(n, { timeout: r }), 666 !== r && (r = 666) } : C(function () { o(n) }, !0); return function (t) { var n; (t = !0 === t) && (r = 44), e || (e = !0, n = 125 - (a.now() - i), n < 0 && (n = 0), t || n < 9 && c ? s() : o(s, n)) } }, w = function (t) { var e, i, r = function () { e = null, t() }, n = function () { var t = a.now() - i; t < 99 ? o(n, 99 - t) : (c || r)(r) }; return function () { i = a.now(), e || (e = o(n, 99)) } }, _ = function () { var n, l, c, d, f, h, _, P, x, L, M, F, R, $, T, W = /^img$/i, B = /^iframe$/i, I = "onscroll" in t && !/glebot/.test(navigator.userAgent), O = 0, k = 0, j = -1, U = function (t) { k--, t && t.target && m(t.target, U), (!t || k < 0 || !t.target) && (k = 0) }, H = function (t, i) { var a, n = t, s = "hidden" == A(e.body, "visibility") || "hidden" != A(t, "visibility"); for (x -= i, F += i, L -= i, M += i; s && (n = n.offsetParent) && n != e.body && n != r;)(s = (A(n, "opacity") || 1) > 0) && "visible" != A(n, "overflow") && (a = n.getBoundingClientRect(), s = M > a.left && L < a.right && F > a.top - 1 && x < a.bottom + 1); return s }, D = function () { var t, a, s, o, u, d, z, g, p; if ((f = i.loadMode) && k < 8 && (t = n.length)) { a = 0, j++, null == $ && ("expand" in i || (i.expand = r.clientHeight > 500 && r.clientWidth > 500 ? 500 : 370), R = i.expand, $ = R * i.expFactor), O < $ && k < 1 && j > 2 && f > 2 && !e.hidden ? (O = $, j = 0) : O = f > 1 && j > 1 && k < 6 ? R : 0; for (; a < t; a++)if (n[a] && !n[a]._lazyRace) if (I) if ((g = n[a].getAttribute("data-expand")) && (d = 1 * g) || (d = O), p !== d && (_ = innerWidth + d * T, P = innerHeight + d, z = -1 * d, p = d), s = n[a].getBoundingClientRect(), (F = s.bottom) >= z && (x = s.top) <= P && (M = s.right) >= z * T && (L = s.left) <= _ && (F || M || L || x) && (c && k < 3 && !g && (f < 3 || j < 4) || H(n[a], d))) { if (Y(n[a]), u = !0, k > 9) break } else !u && c && !o && k < 4 && j < 4 && f > 2 && (l[0] || i.preloadAfterLoad) && (l[0] || !g && (F || M || L || x || "auto" != n[a].getAttribute(i.sizesAttr))) && (o = l[0] || n[a]); else Y(n[a]); o && !u && Y(o) } }, q = S(D), X = function (t) { p(t.target, i.loadedClass), y(t.target, i.loadingClass), m(t.target, Q) }, J = C(X), Q = function (t) { J({ target: t.target }) }, V = function (t, e) { try { t.contentWindow.location.replace(e) } catch (i) { t.src = e } }, G = function (t) { var e, r, a = t.getAttribute(i.srcsetAttr); (e = i.customMedia[t.getAttribute("data-media") || t.getAttribute("media")]) && t.setAttribute("media", e), a && t.setAttribute("srcset", a), e && (r = t.parentNode, r.insertBefore(t.cloneNode(), t), r.removeChild(t)) }, K = C(function (t, e, r, a, n) { var s, l, c, f, g, A; (g = v(t, "lazybeforeunveil", e)).defaultPrevented || (a && (r ? p(t, i.autosizesClass) : t.setAttribute("sizes", a)), l = t.getAttribute(i.srcsetAttr), s = t.getAttribute(i.srcAttr), n && (c = t.parentNode, f = c && u.test(c.nodeName || "")), A = e.firesLoad || "src" in t && (l || s || f), g = { target: t }, A && (m(t, U, !0), clearTimeout(d), d = o(U, 2500), p(t, i.loadingClass), m(t, Q, !0)), f && z.call(c.getElementsByTagName("source"), G), l ? t.setAttribute("srcset", l) : s && !f && (B.test(t.nodeName) ? V(t, s) : t.src = s), (l || f) && b(t, { src: s })), t._lazyRace && delete t._lazyRace, y(t, i.lazyClass), E(function () { (!A || t.complete && t.naturalWidth > 1) && (A ? U(g) : k--, X(g)) }, !0) }), Y = function (t) { var e, r = W.test(t.nodeName), a = r && (t.getAttribute(i.sizesAttr) || t.getAttribute("sizes")), n = "auto" == a; (!n && c || !r || !t.src && !t.srcset || t.complete || g(t, i.errorClass)) && (e = v(t, "lazyunveilread").detail, n && N.updateElem(t, !0, t.offsetWidth), t._lazyRace = !0, k++, K(t, e, n, a, r)) }, Z = function () { if (!c) { if (a.now() - h < 999) return void o(Z, 999); var t = w(function () { i.loadMode = 3, q() }); c = !0, i.loadMode = 3, q(), s("scroll", function () { 3 == i.loadMode && (i.loadMode = 2), t() }, !0) } }; return { _: function () { h = a.now(), n = e.getElementsByClassName(i.lazyClass), l = e.getElementsByClassName(i.lazyClass + " " + i.preloadClass), T = i.hFac, s("scroll", q, !0), s("resize", q, !0), t.MutationObserver ? new MutationObserver(q).observe(r, { childList: !0, subtree: !0, attributes: !0 }) : (r.addEventListener("DOMNodeInserted", q, !0), r.addEventListener("DOMAttrModified", q, !0), setInterval(q, 999)), s("hashchange", q, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (t) { e.addEventListener(t, q, !0) }), /d$|^c/.test(e.readyState) ? Z() : (s("load", Z), e.addEventListener("DOMContentLoaded", q), o(Z, 2e4)), n.length ? (D(), E._lsFlush()) : q() }, checkElems: q, unveil: Y } }(), N = function () { var t, r = C(function (t, e, i, r) { var a, n, s; if (t._lazysizesWidth = r, r += "px", t.setAttribute("sizes", r), u.test(e.nodeName || "")) for (a = e.getElementsByTagName("source"), n = 0, s = a.length; n < s; n++)a[n].setAttribute("sizes", r); i.detail.dataAttr || b(t, i.detail) }), a = function (t, e, i) { var a, n = t.parentNode; n && (i = h(t, n, i), a = v(t, "lazybeforesizes", { width: i, dataAttr: !!e }), a.defaultPrevented || (i = a.detail.width) && i !== t._lazysizesWidth && r(t, n, a, i)) }, n = function () { var e, i = t.length; if (i) for (e = 0; e < i; e++)a(t[e]) }, o = w(n); return { _: function () { t = e.getElementsByClassName(i.autosizesClass), s("resize", o) }, checkElems: o, updateElem: a } }(), P = function () { P.i || (P.i = !0, N._(), _._()) }; return function () { var e, r = { lazyClass: "lazyload", loadedClass: "lazyloaded", loadingClass: "lazyloading", preloadClass: "lazypreload", errorClass: "lazyerror", autosizesClass: "lazyautosizes", srcAttr: "data-src", srcsetAttr: "data-srcset", sizesAttr: "data-sizes", minSize: 40, customMedia: {}, init: !0, expFactor: 1.5, hFac: .8, loadMode: 2 }; i = t.lazySizesConfig || t.lazysizesConfig || {}; for (e in r) e in i || (i[e] = r[e]); t.lazySizesConfig = i, o(function () { i.init && P() }) }(), { cfg: i, autoSizer: N, loader: _, init: P, uP: b, aC: p, rC: y, hC: g, fire: v, gW: h, rAF: E } } }(e, e.document); e.lazySizes = r, "object" == typeof t && t.exports && (t.exports = r) }(window) }); !function (t, e, i) { "use strict"; var r, a = t.lazySizes && lazySizes.cfg || t.lazySizesConfig, n = e.createElement("img"), s = "sizes" in n && "srcset" in n, o = /\s+\d+h/g, l = function () { var t = /\s+(\d+)(w|h)\s+(\d+)(w|h)/, i = Array.prototype.forEach; return function (r) { var a = e.createElement("img"), n = function (e) { var i, r = e.getAttribute(lazySizesConfig.srcsetAttr); r && (r.match(t) && (i = "w" == RegExp.$2 ? RegExp.$1 / RegExp.$3 : RegExp.$3 / RegExp.$1) && e.setAttribute("data-aspectratio", i), e.setAttribute(lazySizesConfig.srcsetAttr, r.replace(o, ""))) }, s = function (t) { var e = t.target.parentNode; e && "PICTURE" == e.nodeName && i.call(e.getElementsByTagName("source"), n), n(t.target) }, l = function () { a.currentSrc && e.removeEventListener("lazybeforeunveil", s) }; r[1] && (e.addEventListener("lazybeforeunveil", s), a.onload = l, a.onerror = l, a.srcset = "data:,a 1w 1h", a.complete && l()) } }(); if (a || (a = {}, t.lazySizesConfig = a), a.supportsType || (a.supportsType = function (t) { return !t }), !t.picturefill && !a.pf) { if (t.HTMLPictureElement && s) return e.msElementsFromPoint && l(navigator.userAgent.match(/Edge\/(\d+)/)), void (a.pf = function () { }); a.pf = function (e) { var i, a; if (!t.picturefill) for (i = 0, a = e.elements.length; i < a; i++)r(e.elements[i]) }, r = function () { var i = function (t, e) { return t.w - e.w }, n = /^\s*\d+\.*\d*px\s*$/, l = function (t) { var e, i, r = t.length, a = t[r - 1], n = 0; for (n; n < r; n++)if (a = t[n], a.d = a.w / t.w, a.d >= t.d) { !a.cached && (e = t[n - 1]) && e.d > t.d - .13 * Math.pow(t.d, 2.2) && (i = Math.pow(e.d - .6, 1.6), e.cached && (e.d += .15 * i), e.d + (a.d - t.d) * i > t.d && (a = e)); break } return a }, c = function () { var t, e = /(([^,\s].[^\s]+)\s+(\d+)w)/g, i = /\s/, r = function (e, i, r, a) { t.push({ c: i, u: r, w: 1 * a }) }; return function (a) { return t = [], a = a.trim(), a.replace(o, "").replace(e, r), t.length || !a || i.test(a) || t.push({ c: a, u: a, w: 99 }), t } }(), u = function () { u.init || (u.init = !0, addEventListener("resize", function () { var t, i = e.getElementsByClassName("lazymatchmedia"), a = function () { var t, e; for (t = 0, e = i.length; t < e; t++)r(i[t]) }; return function () { clearTimeout(t), t = setTimeout(a, 66) } }())) }, d = function (e, i) { var r, n = e.getAttribute("srcset") || e.getAttribute(a.srcsetAttr); !n && i && (n = e._lazypolyfill ? e._lazypolyfill._set : e.getAttribute(a.srcAttr) || e.getAttribute("src")), e._lazypolyfill && e._lazypolyfill._set == n || (r = c(n || ""), i && e.parentNode && (r.isPicture = "PICTURE" == e.parentNode.nodeName.toUpperCase(), r.isPicture && t.matchMedia && (lazySizes.aC(e, "lazymatchmedia"), u())), r._set = n, Object.defineProperty(e, "_lazypolyfill", { value: r, writable: !0 })) }, f = function (e) { var i = t.devicePixelRatio || 1, r = lazySizes.getX && lazySizes.getX(e); return Math.min(r || i, 2.5, i) }, z = function (e) { return t.matchMedia ? (z = function (t) { return !t || (matchMedia(t) || {}).matches })(e) : !e }, g = function (t) { var e, r, s, o, c, u, g; if (o = t, d(o, !0), c = o._lazypolyfill, c.isPicture) for (r = 0, e = t.parentNode.getElementsByTagName("source"), s = e.length; r < s; r++)if (a.supportsType(e[r].getAttribute("type"), t) && z(e[r].getAttribute("media"))) { o = e[r], d(o), c = o._lazypolyfill; break } return c.length > 1 ? (g = o.getAttribute("sizes") || "", g = n.test(g) && parseInt(g, 10) || lazySizes.gW(t, t.parentNode), c.d = f(t), !c.src || !c.w || c.w < g ? (c.w = g, u = l(c.sort(i)), c.src = u) : u = c.src) : u = c[0], u }, p = function (t) { if (!s || !t.parentNode || "PICTURE" == t.parentNode.nodeName.toUpperCase()) { var e = g(t); e && e.u && t._lazypolyfill.cur != e.u && (t._lazypolyfill.cur = e.u, e.cached = !0, t.setAttribute(a.srcAttr, e.u), t.setAttribute("src", e.u)) } }; return p.parse = c, p }(), a.loadedClass && a.loadingClass && function () { var t = [];['img[sizes$="px"][srcset].', "picture > img:not([srcset])."].forEach(function (e) { t.push(e + a.loadedClass), t.push(e + a.loadingClass) }), a.pf({ elements: e.querySelectorAll(t.join(", ")) }) }() } }(window, document), function (t) { "use strict"; var e, i = t.createElement("img"); !("srcset" in i) || "sizes" in i || window.HTMLPictureElement || (e = /^picture$/i, t.addEventListener("lazybeforeunveil", function (i) { var r, a, n, s, o, l, c; !i.defaultPrevented && !lazySizesConfig.noIOSFix && (r = i.target) && (n = r.getAttribute(lazySizesConfig.srcsetAttr)) && (a = r.parentNode) && ((o = e.test(a.nodeName || "")) || (s = r.getAttribute("sizes") || r.getAttribute(lazySizesConfig.sizesAttr))) && (l = o ? a : t.createElement("picture"), r._lazyImgSrc || Object.defineProperty(r, "_lazyImgSrc", { value: t.createElement("source"), writable: !0 }), c = r._lazyImgSrc, s && c.setAttribute("sizes", s), c.setAttribute(lazySizesConfig.srcsetAttr, n), r.setAttribute("data-pfsrcset", n), r.removeAttribute(lazySizesConfig.srcsetAttr), o || (a.insertBefore(l, r), l.appendChild(r)), l.insertBefore(c, r)) })) }(document) }();


$(document).ready(function () {
    if ($('[data-fancybox]').length) {
        $("[data-fancybox]").fancybox({
            'afterShow': function () {
                $('.fancybox-container').attr('tabindex', 1);
                $('.fancybox-container iframe.fancybox-iframe').focus();
            }
        });
    }
});

function ajaxAddToCart(variantId, productId, properties = null) {
    const postData = {
        quantity: 1,
        id: variantId
    }
    if (properties) {
        // postData.properties = typeof properties === 'string' ? JSON.parse(properties) : properties
        postData.properties = properties
    }

    return fetch('/cart/add.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            if (json.status && json.status !== 200) {
                var error = new Error(json.description);
                error.isFromServer = true;
                throw error;
            }
            window.ajaxCart.load()
            // triggerKlaviyoViewedProduct (product)
            var mobileSelector = document.querySelector('.supports-touch')
            var cartSlide = document.querySelector('.js-drawer-open-right')
            cartSlide.click()
            if (mobileSelector) {
                cartSlide.click()
            }
            
            if ($(`#product-${productId} [data-reserve-quick-add]`).length) {
                $(`#product-${productId} [data-reserve-quick-add]`).addClass('pointer-events-none').html(`
                    ${ properties['_replacement-item'] ? 'Replacement added' : 'Added to Bag' }
                    <svg class="ml-2" xmlns="http://www.w3.org/2000/svg" width="18" height="13" fill="none">
                        <path stroke="#000" stroke-width="2" d="m1 5.75 5.5 5.5L17 .75"/>
                    </svg>
                `)
                if ( properties['_replacement-item'] ) {
                    $(`#product-${productId} [data-reserve-quick-add]`).addClass('opacity-25').attr('disabled', true)
                }
                if ( !properties || ( properties && !properties['_replacement-item'] ) ) {
                    setTimeout(function() {
                        $(`#product-${productId} [data-reserve-quick-add]`).removeClass('pointer-events-none').html('Add to Bag')
                    }, 5000)
                }
            }
            return json
        })
        .catch(function (error) {
            alert('Error occured while adding item to cart.')
            // console.log(error)
            // ShopifyAPI.onError(obj, status)
        })
}

function handleClickQuickAdd(el, productId, properties = null) {

    if (!$(`#ajax-swatches-${productId}`).length) {
        const variantId = $(el).data('variant-id')

        ajaxAddToCart(variantId, productId, properties)
        return
    }

    openDialog(`ajax-swatch-wrapper-${productId}`, el, $(`#ajax-swatches-${productId} .swatch-element:first-of-type input`))

    $(`#product-${productId} .grid-image-wrapper .swatch`).addClass('active')
    $(el).css({ 'opacity': 0, 'pointer-events': 'none' })

    $(`#product-${productId}`).off('mouseleave').on('mouseleave', function () {
        $(`#product-${productId} .grid-image-wrapper .swatch`).removeClass('active')
        $(el).css({ 'opacity': 1, 'pointer-events': 'all' })
        if ($('.dialog-backdrop.active').length) {
            closeDialog(document.getElementById(`ajax-swatches-${productId}`))
        }
    })

    if ($(`#product-${productId} [data-close-quick-add]`).length) {
        $(`#product-${productId} [data-close-quick-add]`).off('click').on('click', function () {
            $(`#product-${productId} .grid-image-wrapper .swatch`).removeClass('active')
            $(el).css({ 'opacity': 1, 'pointer-events': 'all' })
            if ($('.dialog-backdrop.active').length) {
                closeDialog(document.getElementById(`ajax-swatches-${productId}`))
            }
        })
    }

    const selectedOption = $(`#product-${productId} .swatch-element-single:checked`).val()
    $(`#ajax-swatches-${productId} .swatch-element input[disabled]`).attr('disabled', false)

    $(`#productSelect-${productId} option`).each(function (i, option) {
        const optionsArr = $(option).text().trim().split(' - ')
        const soldOut = optionsArr[1] === 'Sold Out'
        const options = optionsArr[0].split(' / ')
        // console.log('sold out', optionsArr[1], soldOut)
        $(`#ajax-swatches-${productId} .swatch-element`).each(function (e, swatchEl) {
            const optionPos = $(swatchEl).find('input').data('position')
            const currentOption = $(swatchEl).find('input').val()
            const selectedOptions = selectedOption ? [selectedOption, currentOption] : [currentOption]
            if (JSON.stringify(selectedOptions) === JSON.stringify(options)) {
                if (soldOut) {
                    $(swatchEl).find('input').attr('disabled', true)
                }
                $(swatchEl).find('input').attr('data-variant-id', $(option).val())
            }
        })
        // console.log($(option).text())
    })

    $(`#ajax-swatches-${productId} input`).off('change').on('change', function (r, radio) {
        const variantId = $(this).data('variant-id')
        let optionsArr = []
        if ($(`#product-${productId} .swatch-element-single`).length) {
            optionsArr.push($(`#product-${productId} .swatch-element-single:checked`).val())
            optionsArr.push($(this).val())
        }
        if ($(this).attr('data-reserve-size-select') && window.innerWidth < 1200) {
            if ($(`#product-${productId} .addToCart`).length) {
                $(`#product-${productId} .addToCart`).attr('data-variant-id', variantId)
            }
            return
        }
        ajaxAddToCart(variantId, productId, null)
    })

    if ($(`#product-${productId} [data-reserve-color-select]`).length) {
        $(`#product-${productId} [data-reserve-color-select]`).off('change').on('change', function (r, radio) {
            if (!$(this).is(':checked')) return
            const selectedOption = $(this).val()
            $(`#productSelect-${productId} option`).each(function (i, option) {
                const optionsArr = $(option).text().trim().split(' - ')
                const soldOut = optionsArr[1] === 'Sold Out'
                const options = optionsArr[0].split(' / ')
                $(`#ajax-swatches-${productId} .swatch-element`).each(function (e, swatchEl) {
                    const currentOption = $(swatchEl).find('input').val()
                    const selectedOptions = selectedOption ? [selectedOption, currentOption] : [currentOption]
                    if (JSON.stringify(selectedOptions) === JSON.stringify(options)) {
                        if (soldOut) {
                            $(swatchEl).find('input').attr('disabled', true)
                        }
                        $(swatchEl).find('input').attr('data-variant-id', $(option).val())
                    }
                })
            })
        })
    }

    if ($('.ajax-add-to-cart').length) {
        $('.ajax-add-to-cart').on('click', function () {
            const variantId = $(this).data('variant-id') === -1
                ? $(this).data('product-id')
                : $(this).data('variant-id')
            const properties = $(this).data('properties')
            ajaxAddToCart(variantId, productId, properties)
            $(`#product-${productId} .grid-image-wrapper .swatch`).removeClass('active')
            $(el).css({ 'opacity': 1, 'pointer-events': 'all' })
            if ($('.dialog-backdrop.active').length) {
                closeDialog(document.getElementById(`ajax-swatches-${productId}`))
            }
        })
    }
}

function handleColorSwatchChange(el) {
    const bodyClass = $('body').attr('class')
    const imageSrc = $(el).data('img-src')
    const imageHoverSrc = $(el).data('img-src-hover')
    const productId = $(el).data('product-id')
    
    $(`#product-${productId} .grid__image picture.default-image img`).css('opacity', '1');
    $(`#product-${productId} .grid__image picture.default-image`).css('background-image', ``);
    $(`#product-${productId} .selected`).removeClass('selected');

    if (imageSrc) {
        $(`#product-${productId} .grid__image picture.default-image source`).attr('data-srcset', imageSrc);
        $(`#product-${productId} .grid__image picture.default-image source`).attr('srcset', imageSrc);
        $(`#product-${productId} .grid__image picture.default-image img`).attr('data-src', imageSrc);
        $(`#product-${productId} .grid__image picture.default-image img`).attr('src', imageSrc);
    }

    if (imageHoverSrc) {
        $(`#product-${productId} .grid__image picture.hover-image source`).attr('data-srcset', imageHoverSrc);
        $(`#product-${productId} .grid__image picture.hover-image source`).attr('srcset', imageHoverSrc);
        $(`#product-${productId} .grid__image picture.hover-image img`).attr('data-src', imageHoverSrc);
        $(`#product-${productId} .grid__image picture.hover-image img`).attr('src', imageHoverSrc);
    }

    if (imageSrc) {
        $(`#product-${productId} .grid__image picture.default-image input.default-image`).val(imageSrc);
    }
    if (imageHoverSrc) {
        $(`#product-${productId} .grid__image picture input.default-hover-image`).val(imageHoverSrc);
    }
    var $quickAddBtn = $(`#product-${productId} .quick-add`)
    if ($(el).data('soldout')) {
        $quickAddBtn.html('Sold out').css({ 'opacity': .4, 'pointer-events': 'none' })
    } else {
        $quickAddBtn.html($quickAddBtn.attr('data-reserve-quick-add') ? 'Add to Bag' : 'Quick add').css({ 'opacity': 1, 'pointer-events': 'all' })
    }
    $(el).addClass('selected');
    $(`[id="${$(el).attr('id')}"]`).addClass('selected');
    let href = $(`#product-${productId} .grid__image`).attr('href');
    let productLink = updateQueryStringParameter(href, 'variant', $(el).data('variant-id'));
    $(`#product-${productId} .grid__image`).attr('href', `${productLink}`);
    $(`#product-${productId} h6 a`).attr('href', `${productLink}`);

    if ($(`#product-${productId} .quick-add`).length) {
        $(`#product-${productId} .quick-add`).data('variant-id', $(el).data('variant-id'))
    }

    if ($(`#product-${productId} .addToCart`).length) {
        $(`#product-${productId} .addToCart`).attr('data-variant-id', $(el).data('variant-id'))
    }

    if ($(`#product-${productId} .reserve-color-meta`).length) {
        $(`#product-${productId} .reserve-color-meta`).text(el.value)
    }
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

$(document).ready(function () {
    $(window).scroll(function (event) {
        if ($(window).scrollTop() > 0 && $(window).scrollTop() >= $('.announcement-bar').height()) {
            $('#shopify-section-header').addClass('sticked-header');
            $('#shopify-section-header').css('top', `${$('.announcement-bar').height()}px`);
        } else if ($(window).scrollTop() < 5) {
            $('#shopify-section-header').removeClass('sticked-header');
            $('#shopify-section-header').css('top', ``);
        }
    })
});

$(function () {
    $(document).ready(function () {
        if ($('#collection-container').length) {
            $('#collection-container').infiniteScroll({
                path: '.next a',
                history: true,
                domParseResponse: false,
            });
            $('#collection-container').on('load.infiniteScroll', function (event, body) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(body, 'text/html');
                const elements = doc.querySelectorAll('.grid__item.large--one-third');
                const navWrapper = doc.querySelector('.pagination');
                $('.pagination').html(navWrapper.innerHTML);
                elements.forEach(it => {
                    $(it).appendTo('#collection-container');
                });
            });
        }
    })
})

function openSubMenu(index) {
    $('#menu-overlay-content').addClass('open-submenu');
    $('.sub-nav').removeClass('active');
    $(`#sub-nav-${index}`).addClass('active');
}

function hideSubMenu(e, index) {
    $('#menu-overlay-content').removeClass('open-submenu');
    $(`#sub-nav-${index}`).removeClass('active');
}

if ($('#home-hero__carousel').length) {
    var options = {
        slidesToShow: 1,
        slidesToScroll: 1,
        focusOnSelect: true,
        adaptiveHeight: true,
        dots: true,
        autoplay: $('#home-hero__carousel').data('autoplay'),
        autoplaySpeed: $('#home-hero__carousel').data('speed'),
        prevArrow: '.hero-arrow-prev',
        nextArrow: '.hero-arrow-next',
        fade: $('#home-hero__carousel').data('fade'),
        swipe: false,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    arrows: false
                }
            },
        ]
    };

    const $heroCarousel = $('#home-hero__carousel').slick(options);
}

// if (zE) {
//     zE(function () {
//         // zE.hide();
//         $('#get-support-button').removeClass('hidden')
//     });
//     $('#get-support-button').on('click', function () {
//         if ( $('#webWidget').is(':visible') ) {
//             zE.hide();
//         } else {
//             zE.show();
//             zE.activate({hideOnClose: false});
//         }
//     })
// }

if ($('.products-grid-block').length) {
    $('.products-grid-block').each(function () {
        var options = {
            slidesToShow: 4,
            slidesToScroll: 4,
            focusOnSelect: false,
            dots: true,
            autoplay: false,
            infinite: false,
            prevArrow: $('.products-grid-arrow-prev', this),
            nextArrow: $('.products-grid-arrow-next', this),
            swipe: false,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.4,
                        slidesToScroll: 2,
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1.2,
                        slidesToScroll: 1,
                    }
                },
            ]
        };
        const $productsGrid = this;
        $('.products-grid', this).on('setPosition', () => {
            const imageHeight = $('.grid-image-wrapper', $productsGrid).height()
            $('.slider-arrow', $productsGrid).css('top', (imageHeight/2) + 6 + 'px')
        }).slick(options);
    })

}

if ($('.gd_product_list').length) {
    $('.gd_product_list').each(function () {
        var options = {
            slidesToShow: 4,
            slidesToScroll: 4,
            focusOnSelect: false,
            dots: false,
            autoplay: false,
            infinite: true,
            prevArrow: $('.products-grid-arrow-prev', this),
            nextArrow: $('.products-grid-arrow-next', this),
            swipe: false,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        centerMode: true,
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        centerMode: true,
                    }
                },
            ]
        };
        const $productsGrid = this;
        $('.gd_product_list__grid', $productsGrid).on('setPosition', () => {
            const imageHeight = $('.gd_card__img_wrapper img', $productsGrid).height()
            $('.slider-arrow', $productsGrid).css('top', (imageHeight/2) + 6 + 'px')
        }).slick(options);
    })

}
