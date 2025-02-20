import {
  computed,
  defineComponent,
  getCurrentInstance,
  h,
  inject,
  isRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  toRefs,
  unref,
  watch,
  watchEffect
} from "./chunk-XSWAMETM.js";
import {
  init,
  throttle
} from "./chunk-MMCSCXIX.js";
import "./chunk-ZS7NZCD4.js";

// node_modules/vue-echarts/node_modules/vue-demi/lib/index.mjs
var Vue2 = void 0;

// node_modules/resize-detector/esm/index.js
var raf = null;
function requestAnimationFrame(callback) {
  if (!raf) {
    raf = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback2) {
      return setTimeout(callback2, 16);
    }).bind(window);
  }
  return raf(callback);
}
var caf = null;
function cancelAnimationFrame(id) {
  if (!caf) {
    caf = (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(id2) {
      clearTimeout(id2);
    }).bind(window);
  }
  caf(id);
}
function createStyles(styleText) {
  var style2 = document.createElement("style");
  if (style2.styleSheet) {
    style2.styleSheet.cssText = styleText;
  } else {
    style2.appendChild(document.createTextNode(styleText));
  }
  (document.querySelector("head") || document.body).appendChild(style2);
  return style2;
}
function createElement(tagName, props) {
  if (props === void 0)
    props = {};
  var elem = document.createElement(tagName);
  Object.keys(props).forEach(function(key) {
    elem[key] = props[key];
  });
  return elem;
}
function getComputedStyle(elem, prop, pseudo) {
  var computedStyle = window.getComputedStyle(elem, pseudo || null) || {
    display: "none"
  };
  return computedStyle[prop];
}
function getRenderInfo(elem) {
  if (!document.documentElement.contains(elem)) {
    return {
      detached: true,
      rendered: false
    };
  }
  var current = elem;
  while (current !== document) {
    if (getComputedStyle(current, "display") === "none") {
      return {
        detached: false,
        rendered: false
      };
    }
    current = current.parentNode;
  }
  return {
    detached: false,
    rendered: true
  };
}
var css_248z = '.resize-triggers{visibility:hidden;opacity:0;pointer-events:none}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}';
var total = 0;
var style = null;
function addListener(elem, callback) {
  if (!elem.__resize_mutation_handler__) {
    elem.__resize_mutation_handler__ = handleMutation.bind(elem);
  }
  var listeners = elem.__resize_listeners__;
  if (!listeners) {
    elem.__resize_listeners__ = [];
    if (window.ResizeObserver) {
      var offsetWidth = elem.offsetWidth;
      var offsetHeight = elem.offsetHeight;
      var ro = new ResizeObserver(function() {
        if (!elem.__resize_observer_triggered__) {
          elem.__resize_observer_triggered__ = true;
          if (elem.offsetWidth === offsetWidth && elem.offsetHeight === offsetHeight) {
            return;
          }
        }
        runCallbacks(elem);
      });
      var ref = getRenderInfo(elem);
      var detached = ref.detached;
      var rendered = ref.rendered;
      elem.__resize_observer_triggered__ = detached === false && rendered === false;
      elem.__resize_observer__ = ro;
      ro.observe(elem);
    } else if (elem.attachEvent && elem.addEventListener) {
      elem.__resize_legacy_resize_handler__ = function handleLegacyResize() {
        runCallbacks(elem);
      };
      elem.attachEvent("onresize", elem.__resize_legacy_resize_handler__);
      document.addEventListener("DOMSubtreeModified", elem.__resize_mutation_handler__);
    } else {
      if (!total) {
        style = createStyles(css_248z);
      }
      initTriggers(elem);
      elem.__resize_rendered__ = getRenderInfo(elem).rendered;
      if (window.MutationObserver) {
        var mo = new MutationObserver(elem.__resize_mutation_handler__);
        mo.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
        elem.__resize_mutation_observer__ = mo;
      }
    }
  }
  elem.__resize_listeners__.push(callback);
  total++;
}
function removeListener(elem, callback) {
  var listeners = elem.__resize_listeners__;
  if (!listeners) {
    return;
  }
  if (callback) {
    listeners.splice(listeners.indexOf(callback), 1);
  }
  if (!listeners.length || !callback) {
    if (elem.detachEvent && elem.removeEventListener) {
      elem.detachEvent("onresize", elem.__resize_legacy_resize_handler__);
      document.removeEventListener("DOMSubtreeModified", elem.__resize_mutation_handler__);
      return;
    }
    if (elem.__resize_observer__) {
      elem.__resize_observer__.unobserve(elem);
      elem.__resize_observer__.disconnect();
      elem.__resize_observer__ = null;
    } else {
      if (elem.__resize_mutation_observer__) {
        elem.__resize_mutation_observer__.disconnect();
        elem.__resize_mutation_observer__ = null;
      }
      elem.removeEventListener("scroll", handleScroll);
      elem.removeChild(elem.__resize_triggers__.triggers);
      elem.__resize_triggers__ = null;
    }
    elem.__resize_listeners__ = null;
  }
  if (!--total && style) {
    style.parentNode.removeChild(style);
  }
}
function getUpdatedSize(elem) {
  var ref = elem.__resize_last__;
  var width = ref.width;
  var height = ref.height;
  var offsetWidth = elem.offsetWidth;
  var offsetHeight = elem.offsetHeight;
  if (offsetWidth !== width || offsetHeight !== height) {
    return {
      width: offsetWidth,
      height: offsetHeight
    };
  }
  return null;
}
function handleMutation() {
  var ref = getRenderInfo(this);
  var rendered = ref.rendered;
  var detached = ref.detached;
  if (rendered !== this.__resize_rendered__) {
    if (!detached && this.__resize_triggers__) {
      resetTriggers(this);
      this.addEventListener("scroll", handleScroll, true);
    }
    this.__resize_rendered__ = rendered;
    runCallbacks(this);
  }
}
function handleScroll() {
  var this$1 = this;
  resetTriggers(this);
  if (this.__resize_raf__) {
    cancelAnimationFrame(this.__resize_raf__);
  }
  this.__resize_raf__ = requestAnimationFrame(function() {
    var updated = getUpdatedSize(this$1);
    if (updated) {
      this$1.__resize_last__ = updated;
      runCallbacks(this$1);
    }
  });
}
function runCallbacks(elem) {
  if (!elem || !elem.__resize_listeners__) {
    return;
  }
  elem.__resize_listeners__.forEach(function(callback) {
    callback.call(elem, elem);
  });
}
function initTriggers(elem) {
  var position = getComputedStyle(elem, "position");
  if (!position || position === "static") {
    elem.style.position = "relative";
  }
  elem.__resize_old_position__ = position;
  elem.__resize_last__ = {};
  var triggers = createElement("div", {
    className: "resize-triggers"
  });
  var expand = createElement("div", {
    className: "resize-expand-trigger"
  });
  var expandChild = createElement("div");
  var contract = createElement("div", {
    className: "resize-contract-trigger"
  });
  expand.appendChild(expandChild);
  triggers.appendChild(expand);
  triggers.appendChild(contract);
  elem.appendChild(triggers);
  elem.__resize_triggers__ = {
    triggers,
    expand,
    expandChild,
    contract
  };
  resetTriggers(elem);
  elem.addEventListener("scroll", handleScroll, true);
  elem.__resize_last__ = {
    width: elem.offsetWidth,
    height: elem.offsetHeight
  };
}
function resetTriggers(elem) {
  var ref = elem.__resize_triggers__;
  var expand = ref.expand;
  var expandChild = ref.expandChild;
  var contract = ref.contract;
  var csw = contract.scrollWidth;
  var csh = contract.scrollHeight;
  var eow = expand.offsetWidth;
  var eoh = expand.offsetHeight;
  var esw = expand.scrollWidth;
  var esh = expand.scrollHeight;
  contract.scrollLeft = csw;
  contract.scrollTop = csh;
  expandChild.style.width = eow + 1 + "px";
  expandChild.style.height = eoh + 1 + "px";
  expand.scrollLeft = esw;
  expand.scrollTop = esh;
}

// node_modules/vue-echarts/dist/index.esm.min.js
var b = function() {
  return b = Object.assign || function(e) {
    for (var t, n = 1, r = arguments.length; n < r; n++)
      for (var i in t = arguments[n])
        Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i]);
    return e;
  }, b.apply(this, arguments);
};
var y = ["getWidth", "getHeight", "getDom", "getOption", "resize", "dispatchAction", "convertToPixel", "convertFromPixel", "containPixel", "getDataURL", "getConnectedDataURL", "appendData", "clear", "isDisposed", "dispose"];
function E(e) {
  return t = /* @__PURE__ */ Object.create(null), y.forEach(function(n) {
    t[n] = /* @__PURE__ */ function(t2) {
      return function() {
        for (var n2 = [], r = 0; r < arguments.length; r++)
          n2[r] = arguments[r];
        if (!e.value)
          throw new Error("ECharts is not initialized yet.");
        return e.value[t2].apply(e.value, n2);
      };
    }(n);
  }), t;
  var t;
}
var _ = { autoresize: [Boolean, Object] };
var x = /^on[^a-z]/;
var j = function(e) {
  return x.test(e);
};
function w(e, r) {
  var i = isRef(e) ? unref(e) : e;
  return i && "object" == typeof i && "value" in i ? i.value || r : i || r;
}
var A = "ecLoadingOptions";
var L = { loading: Boolean, loadingOptions: Object };
var z = null;
var C = "x-vue-echarts";
var T = [];
var S = [];
!function(e, t) {
  if (e && "undefined" != typeof document) {
    var n, r = true === t.prepend ? "prepend" : "append", i = true === t.singleTag, o = "string" == typeof t.container ? document.querySelector(t.container) : document.getElementsByTagName("head")[0];
    if (i) {
      var a = T.indexOf(o);
      -1 === a && (a = T.push(o) - 1, S[a] = {}), n = S[a] && S[a][r] ? S[a][r] : S[a][r] = u();
    } else
      n = u();
    65279 === e.charCodeAt(0) && (e = e.substring(1)), n.styleSheet ? n.styleSheet.cssText += e : n.appendChild(document.createTextNode(e));
  }
  function u() {
    var e2 = document.createElement("style");
    if (e2.setAttribute("type", "text/css"), t.attributes)
      for (var n2 = Object.keys(t.attributes), i2 = 0; i2 < n2.length; i2++)
        e2.setAttribute(n2[i2], t.attributes[n2[i2]]);
    var a2 = "prepend" === r ? "afterbegin" : "beforeend";
    return o.insertAdjacentElement(a2, e2), e2;
  }
}("x-vue-echarts{display:flex;flex-direction:column;width:100%;height:100%;min-width:0}\n.vue-echarts-inner{flex-grow:1;min-width:0;width:auto!important;height:auto!important}\n", {});
var U = function() {
  if (null != z)
    return z;
  if ("undefined" == typeof HTMLElement || "undefined" == typeof customElements)
    return z = false;
  try {
    new Function("tag", "class EChartsElement extends HTMLElement {\n  __dispose = null;\n\n  disconnectedCallback() {\n    if (this.__dispose) {\n      this.__dispose();\n      this.__dispose = null;\n    }\n  }\n}\n\nif (customElements.get(tag) == null) {\n  customElements.define(tag, EChartsElement);\n}\n")(C);
  } catch (e) {
    return z = false;
  }
  return z = true;
}();
Vue2 && Vue2.config.ignoredElements.push(C);
var D = "ecTheme";
var k = "ecInitOptions";
var B = "ecUpdateOptions";
var P = /(^&?~?!?)native:/;
var H = defineComponent({ name: "echarts", props: b(b({ option: Object, theme: { type: [Object, String] }, initOptions: Object, updateOptions: Object, group: String, manualUpdate: Boolean }, _), L), emits: {}, inheritAttrs: false, setup: function(t, n) {
  var a = n.attrs, u = shallowRef(), v = shallowRef(), y2 = shallowRef(), _2 = shallowRef(), x2 = inject(D, null), L2 = inject(k, null), z2 = inject(B, null), C2 = toRefs(t), T2 = C2.autoresize, S2 = C2.manualUpdate, H2 = C2.loading, M = C2.loadingOptions, R = computed(function() {
    return _2.value || t.option || null;
  }), F = computed(function() {
    return t.theme || w(x2, {});
  }), N = computed(function() {
    return t.initOptions || w(L2, {});
  }), $ = computed(function() {
    return t.updateOptions || w(z2, {});
  }), q = computed(function() {
    return function(e) {
      var t2 = {};
      for (var n2 in e)
        j(n2) || (t2[n2] = e[n2]);
      return t2;
    }(a);
  }), I = {}, W = getCurrentInstance().proxy.$listeners, Z = {};
  function G(e) {
    if (v.value) {
      var n2 = y2.value = init(v.value, F.value, N.value);
      t.group && (n2.group = t.group), Object.keys(Z).forEach(function(e2) {
        var t2 = Z[e2];
        if (t2) {
          var r2 = e2.toLowerCase();
          "~" === r2.charAt(0) && (r2 = r2.substring(1), t2.__once__ = true);
          var i = n2;
          if (0 === r2.indexOf("zr:") && (i = n2.getZr(), r2 = r2.substring(3)), t2.__once__) {
            delete t2.__once__;
            var o = t2;
            t2 = function() {
              for (var e3 = [], n3 = 0; n3 < arguments.length; n3++)
                e3[n3] = arguments[n3];
              o.apply(void 0, e3), i.off(r2, t2);
            };
          }
          i.on(r2, t2);
        }
      }), T2.value ? nextTick(function() {
        n2 && !n2.isDisposed() && n2.resize(), r();
      }) : r();
    }
    function r() {
      var t2 = e || R.value;
      t2 && n2.setOption(t2, $.value);
    }
  }
  function J() {
    y2.value && (y2.value.dispose(), y2.value = void 0);
  }
  W ? Object.keys(W).forEach(function(e) {
    P.test(e) ? I[e.replace(P, "$1")] = W[e] : Z[e] = W[e];
  }) : Object.keys(a).filter(function(e) {
    return j(e);
  }).forEach(function(e) {
    var t2 = e.charAt(2).toLowerCase() + e.slice(3);
    if (0 !== t2.indexOf("native:"))
      "Once" === t2.substring(t2.length - 4) && (t2 = "~".concat(t2.substring(0, t2.length - 4))), Z[t2] = a[e];
    else {
      var n2 = "on".concat(t2.charAt(7).toUpperCase()).concat(t2.slice(8));
      I[n2] = a[e];
    }
  });
  var K = null;
  watch(S2, function(n2) {
    "function" == typeof K && (K(), K = null), n2 || (K = watch(function() {
      return t.option;
    }, function(e, t2) {
      e && (y2.value ? y2.value.setOption(e, b({ notMerge: e !== t2 }, $.value)) : G());
    }, { deep: true }));
  }, { immediate: true }), watch([F, N], function() {
    J(), G();
  }, { deep: true }), watchEffect(function() {
    t.group && y2.value && (y2.value.group = t.group);
  });
  var Q = E(y2);
  return function(e, t2, n2) {
    var a2 = inject(A, {}), u2 = computed(function() {
      return b(b({}, w(a2, {})), null == n2 ? void 0 : n2.value);
    });
    watchEffect(function() {
      var n3 = e.value;
      n3 && (t2.value ? n3.showLoading(u2.value) : n3.hideLoading());
    });
  }(y2, H2, M), function(t2, n2, r) {
    var i = null;
    watch([r, t2, n2], function(e, t3, n3) {
      var r2 = e[0], o = e[1], a2 = e[2];
      if (r2 && o && a2) {
        var u2 = true === a2 ? {} : a2, s = u2.throttle, c = void 0 === s ? 100 : s, l = u2.onResize, f = function() {
          o.resize(), null == l || l();
        };
        i = c ? throttle(f, c) : f, addListener(r2, i);
      }
      n3(function() {
        r2 && i && removeListener(r2, i);
      });
    });
  }(y2, T2, v), onMounted(function() {
    G();
  }), onBeforeUnmount(function() {
    U && u.value ? u.value.__dispose = J : J();
  }), b({ chart: y2, root: u, inner: v, setOption: function(e, n2) {
    t.manualUpdate && (_2.value = e), y2.value ? y2.value.setOption(e, n2 || {}) : G(e);
  }, nonEventAttrs: q, nativeListeners: I }, Q);
}, render: function() {
  var e = Vue2 ? { attrs: this.nonEventAttrs, on: this.nativeListeners } : b(b({}, this.nonEventAttrs), this.nativeListeners);
  return e.ref = "root", e.class = e.class ? ["echarts"].concat(e.class) : "echarts", h(C, e, [h("div", { ref: "inner", class: "vue-echarts-inner" })]);
} });
export {
  k as INIT_OPTIONS_KEY,
  A as LOADING_OPTIONS_KEY,
  D as THEME_KEY,
  B as UPDATE_OPTIONS_KEY,
  H as default
};
//# sourceMappingURL=vue-echarts.js.map
