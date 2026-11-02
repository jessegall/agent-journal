/* @code-commandments-generated */
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
import { openBlock as l, createElementBlock as d, renderSlot as we, createElementVNode as p, normalizeClass as Q, Fragment as X, renderList as re, normalizeStyle as be, defineComponent as zo, Comment as Go, h as ps, cloneVNode as Ko, createBlock as G, withCtx as z, unref as U, createVNode as H, toDisplayString as w, createCommentVNode as j, inject as Le, computed as O, resolveDynamicComponent as lt, Transition as Rt, watch as ke, ref as q, shallowRef as mn, TransitionGroup as ya, mergeProps as ot, reactive as ms, createTextVNode as he, onMounted as De, onUnmounted as Ae, nextTick as Lt, useId as wa, Teleport as ka, withModifiers as _e, isRef as Bs, onBeforeUnmount as yt, resolveDirective as Yo, withDirectives as rt, useModel as zn, useAttrs as ba, getCurrentInstance as Jo, mergeModels as Gn, getCurrentScope as $a, onScopeDispose as xa, provide as Zo, onErrorCaptured as Xo, toHandlers as Qo, createSlots as er, vShow as tr, withKeys as tn, vModelText as Kn, defineAsyncComponent as nr } from "vue";
========
import { openBlock as l, createElementBlock as d, renderSlot as ye, createElementVNode as p, normalizeClass as ee, Fragment as Q, renderList as oe, normalizeStyle as $e, defineComponent as Go, Comment as Ko, h as ms, cloneVNode as Yo, createBlock as K, withCtx as U, unref as G, createVNode as F, toDisplayString as w, createCommentVNode as L, inject as Ae, computed as C, resolveDynamicComponent as lt, Transition as Rt, watch as ke, ref as j, shallowRef as pn, TransitionGroup as Jo, mergeProps as ot, reactive as gs, createTextVNode as ue, onMounted as De, onUnmounted as Ce, nextTick as Lt, useId as ka, Teleport as ba, withModifiers as Me, isRef as Is, onBeforeUnmount as yt, resolveDirective as Zo, withDirectives as rt, useModel as Vn, useAttrs as $a, getCurrentInstance as Xo, mergeModels as zn, getCurrentScope as xa, onScopeDispose as _a, provide as Qo, onErrorCaptured as er, toHandlers as tr, createSlots as nr, vShow as sr, useSlots as ar, withKeys as Ct, vModelText as Gn, defineAsyncComponent as or } from "vue";
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, sr = { class: "skeleton-line" }, ar = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", sr, [
      we(t.$slots, "default", {}, void 0, !0),
========
}, rr = { class: "skeleton-line" }, ir = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (l(), d("span", rr, [
      ye(t.$slots, "default", {}, void 0, !0),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      p("span", {
        class: Q(["bars", { faded: e.filled }])
      }, [
        (l(!0), d(Q, null, oe(e.bars, (s) => (l(), d("span", {
          key: s.width,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          class: Q(["bar", { still: e.still }]),
          style: be({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
========
          class: ee(["bar", { still: e.still }]),
          style: $e({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        }, null, 6))), 128))
      ], 2)
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Qe = /* @__PURE__ */ J(ar, [["__scopeId", "data-v-0ebb6933"]]), gs = zo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Go);
      return s.length !== 1 ? ps(X, { key: n }, s) : s[0].key == null ? Ko(s[0], { key: n }) : s[0];
    };
  }
}), or = ["aria-label"], rr = ["aria-label"], ir = ["aria-label"], lr = ["aria-label"], cr = ["aria-label"], ur = ["aria-label"], dr = ["aria-label"], hr = {
========
}, Qe = /* @__PURE__ */ J(ir, [["__scopeId", "data-v-0ebb6933"]]), vs = Go({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Ko);
      return s.length !== 1 ? ms(Q, { key: n }, s) : s[0].key == null ? Yo(s[0], { key: n }) : s[0];
    };
  }
}), lr = ["aria-label"], cr = ["aria-label"], ur = ["aria-label"], dr = ["aria-label"], hr = ["aria-label"], fr = ["aria-label"], pr = ["aria-label"], mr = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Skeleton",
  props: { shape: { type: String, default: "rows" }, count: { type: Number, default: 4 }, label: { type: String, default: "Loading" } },
  setup(e) {
    const t = [
      { id: "shape-1", width: 46, height: 38, mine: !1 },
      { id: "shape-2", width: 30, height: 22, mine: !0 },
      { id: "shape-3", width: 58, height: 64, mine: !1 },
      { id: "shape-4", width: 40, height: 30, mine: !1 },
      { id: "shape-5", width: 34, height: 22, mine: !0 },
      { id: "shape-6", width: 62, height: 86, mine: !1 },
      { id: "shape-7", width: 26, height: 22, mine: !1 },
      { id: "shape-8", width: 50, height: 44, mine: !0 },
      { id: "shape-9", width: 38, height: 30, mine: !1 },
      { id: "shape-10", width: 56, height: 58, mine: !1 },
      { id: "shape-11", width: 30, height: 22, mine: !0 },
      { id: "shape-12", width: 44, height: 38, mine: !1 },
      { id: "shape-13", width: 60, height: 72, mine: !1 },
      { id: "shape-14", width: 36, height: 30, mine: !0 }
    ], n = [
      { id: "kind", bars: [{ width: "64px", height: 8 }] },
      { id: "title", bars: [{ width: "70%", height: 12 }] },
      { id: "line", bars: [{ width: "45%", height: 9 }] }
    ], s = [
      { width: "46%", height: 12 },
      { width: "52px", height: 9 }
    ], a = [
      { id: "first", bars: [{ width: "88%", height: 9 }] },
      { id: "second", bars: [{ width: "64%", height: 9 }] },
      { id: "third", bars: [{ width: "76%", height: 9 }] }
    ], o = [
      { width: "58%", height: 11 },
      { width: "32%", height: 9 }
    ], r = ["94%", "88%", "91%", "62%"].map((c) => ({ width: c, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (c, u) => (l(), G(gs, { value: e.shape }, {
      messages: z(() => [
========
    return (c, u) => (l(), K(vs, { value: e.shape }, {
      messages: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(), d(Q, null, oe(t, (f) => p("div", {
            key: f.id,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            class: Q(["skeleton-message", { mine: f.mine }]),
            style: be({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, or)
      ]),
      older: z(() => [
========
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6)), 64))
        ], 8, lr)
      ]),
      older: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, oe(t.slice(0, 3), (f) => (l(), d("div", {
            key: f.id,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            class: Q(["skeleton-message", { mine: f.mine }]),
            style: be({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, rr)
      ]),
      cards: z(() => [
========
            class: ee(["skeleton-message", { mine: f.mine }]),
            style: $e({ width: `${f.width}%`, height: `${f.height}px` })
          }, null, 6))), 128))
        ], 8, cr)
      ]),
      cards: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, oe(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-card"
          }, [
            (l(), d(Q, null, oe(n, (g) => F(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        ], 8, ir)
      ]),
      file: z(() => [
========
        ], 8, ur)
      ]),
      file: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, oe(e.count, (f) => (l(), d("div", {
            key: f,
            class: "skeleton-file"
          }, [
            F(Qe, {
              class: "skeleton-file-head",
              bars: s
            }),
            (l(), d(Q, null, oe(a, (g) => F(Qe, {
              key: g.id,
              bars: g.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        ], 8, lr)
      ]),
      page: z(() => [
========
        ], 8, dr)
      ]),
      page: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          F(Qe, {
            class: "skeleton-heading",
            bars: i
          }),
          (l(!0), d(Q, null, oe(e.count, (f) => (l(), K(Qe, {
            key: f,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, cr)
      ]),
      text: z(() => [
========
            bars: G(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, hr)
      ]),
      text: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, oe(e.count, (f) => (l(), K(Qe, {
            key: f,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ur)
      ]),
      default: z(() => [
========
            bars: G(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, fr)
      ]),
      default: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (l(!0), d(Q, null, oe(e.count, (f) => (l(), K(Qe, {
            key: f,
            class: "skeleton-row",
            bars: o
          }))), 128))
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        ], 8, dr)
========
        ], 8, pr)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      ]),
      _: 1
    }, 8, ["value"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, wt = /* @__PURE__ */ J(hr, [["__scopeId", "data-v-c687fb85"]]), fr = {
  key: 1,
  class: "empty-state titled"
}, pr = { class: "empty-state-title" }, mr = { class: "empty-state-text" }, gr = {
  key: 2,
  class: "empty-state"
}, vr = {
========
}, wt = /* @__PURE__ */ J(mr, [["__scopeId", "data-v-c687fb85"]]), gr = {
  key: 1,
  class: "empty-state titled"
}, vr = { class: "empty-state-title" }, yr = { class: "empty-state-text" }, wr = {
  key: 2,
  class: "empty-state"
}, kr = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (l(), K(wt, {
      key: 0,
      shape: e.shape
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", fr, [
      p("p", pr, w(e.title), 1),
      p("p", mr, [
        we(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", gr, [
      we(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, nn = /* @__PURE__ */ J(vr, [["__scopeId", "data-v-b27e89b0"]]), yr = { class: "fold-group" }, wr = ["aria-expanded"], kr = { class: "fold-label" }, br = {
  key: 0,
  class: "fold-count"
}, $r = {
========
    }, null, 8, ["shape"])) : e.title ? (l(), d("div", gr, [
      p("p", vr, w(e.title), 1),
      p("p", yr, [
        ye(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (l(), d("p", wr, [
      ye(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, tn = /* @__PURE__ */ J(kr, [["__scopeId", "data-v-b27e89b0"]]), br = { class: "fold-group" }, $r = ["aria-expanded"], xr = { class: "fold-label" }, _r = {
  key: 0,
  class: "fold-count"
}, Mr = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "FoldGroup",
  props: {
    label: { type: String, required: !0 },
    count: { type: [Number, String], default: "" },
    open: { type: Boolean, default: !0 },
    flush: { type: Boolean, default: !1 },
    bar: { type: Boolean, default: !1 }
  },
  emits: ["toggle"],
  setup(e, { emit: t }) {
    const n = t;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), d("div", yr, [
========
    return (s, a) => (l(), d("div", br, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      p("button", {
        type: "button",
        class: Q(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        p("span", kr, w(e.label), 1),
        e.count !== "" ? (l(), d("span", br, w(e.count), 1)) : j("", !0),
========
        p("span", xr, w(e.label), 1),
        e.count !== "" ? (l(), d("span", _r, w(e.count), 1)) : L("", !0),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("span", {
          class: Q(["fold-mark", { shut: !e.open }])
        }, null, 2)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ], 10, wr),
      e.open ? we(s.$slots, "default", {}, void 0, !0, 0) : j("", !0)
    ]));
  }
}, Ev = /* @__PURE__ */ J($r, [["__scopeId", "data-v-9ef1865c"]]), xr = Symbol("open-view"), Ne = Symbol.for("journal.window-context");
function vs() {
  const e = Le(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Mr = {
========
      ], 10, $r),
      e.open ? ye(s.$slots, "default", {}, void 0, !0, 0) : L("", !0)
    ]));
  }
}, jv = /* @__PURE__ */ J(Mr, [["__scopeId", "data-v-9ef1865c"]]), Sr = Symbol("open-view"), Ne = Symbol.for("journal.window-context");
function ys() {
  const e = Ae(Ne, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Er = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, _r = /* @__PURE__ */ J(Mr, [["__scopeId", "data-v-eb453d6f"]]), Sr = {
========
}, Ar = /* @__PURE__ */ J(Er, [["__scopeId", "data-v-eb453d6f"]]), Cr = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Btn",
  props: {
    kind: { type: String, default: "ghost" },
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    bordered: Boolean,
    href: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = C(() => {
      var s;
      return t.busy || t.disabled || !!((s = Ae(Ne, null)) != null && s.readOnly);
    });
    return (s, a) => (l(), K(lt(e.href ? "a" : "button"), {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: Q(["btn", e.kind, { small: e.small, large: e.large, busy: e.busy, fill: e.fill, bordered: e.bordered }]),
      "aria-busy": e.busy,
      disabled: n.value
    }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      default: z(() => [
========
      default: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("span", {
          class: Q(["btn-label", { hidden: e.busy }])
        }, [
          ye(s.$slots, "default", {}, void 0, !0)
        ], 2),
        e.busy ? (l(), K(Ar, {
          key: 0,
          class: "btn-spinner"
        })) : L("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, ye = /* @__PURE__ */ J(Sr, [["__scopeId", "data-v-a2dc4bda"]]), Er = {
  class: "running",
  "data-running-command": ""
}, Ar = ["title"], Cr = {
  key: "idle",
  class: "running-idle"
}, Or = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Er, [
      H(Rt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: z(() => [
========
}, we = /* @__PURE__ */ J(Cr, [["__scopeId", "data-v-a2dc4bda"]]), Or = {
  class: "running",
  "data-running-command": ""
}, Tr = ["title"], Br = {
  key: "idle",
  class: "running-idle"
}, Ir = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (l(), d("span", Or, [
      F(Rt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          e.text ? (l(), d("span", {
            key: e.text,
            class: "running-line",
            title: e.text
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          }, w(e.text), 9, Ar)) : (l(), d("span", Cr, w(e.idle), 1))
========
          }, w(e.text), 9, Tr)) : (l(), d("span", Br, w(e.idle), 1))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        _: 1
      })
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Av = /* @__PURE__ */ J(Or, [["__scopeId", "data-v-d3240219"]]), Tr = ["aria-checked", "aria-label", "title"], Br = {
  key: 0,
  class: "switch-inner"
}, Ir = {
  key: 0,
  class: "switch-word"
}, Rr = {
========
}, Pv = /* @__PURE__ */ J(Ir, [["__scopeId", "data-v-d3240219"]]), Rr = ["aria-checked", "aria-label", "title"], Lr = {
  key: 0,
  class: "switch-inner"
}, Dr = {
  key: 0,
  class: "switch-word"
}, Nr = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("button", {
      type: "button",
      class: Q(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: Q(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        e.labelled ? (l(), d("span", Br, w(e.word), 1)) : j("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Ir, w(e.word), 1)) : j("", !0)
    ], 10, Tr));
  }
}, Cv = /* @__PURE__ */ J(Rr, [["__scopeId", "data-v-1bfb90f3"]]);
========
        e.labelled ? (l(), d("span", Lr, w(e.word), 1)) : L("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (l(), d("span", Dr, w(e.word), 1)) : L("", !0)
    ], 10, Rr));
  }
}, qv = /* @__PURE__ */ J(Nr, [["__scopeId", "data-v-1bfb90f3"]]);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
function Ma(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Ot(e, t) {
  return Ma(() => localStorage, e, t);
}
function Sa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function gn(e, t) {
  return _a(() => localStorage, e, t);
}
function Sa(e, t) {
  ke(t, (n) => gn(e, n), { deep: !0 });
}
function Lr(e, t) {
  return Ma(() => sessionStorage, e, t);
}
function Dr(e, t) {
  return _a(() => sessionStorage, e, t);
}
const sn = "journal.environment", Ea = q(Lr(sn, Ot(sn, "")));
function Nr(e) {
  Ea.value = e, Dr(sn, e), gn(sn, e);
}
const an = q(location.hash), Is = mn(null), Rs = { integrations: "mcp", library: "team" };
function jr() {
  if (!Is.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Rs[n]) {
    location.replace(`#/${[Rs[n], ...s].join("/")}${t ? `?${t}` : ""}`), an.value = location.hash;
    return;
  }
  !n || Is.value(n) || (Nr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), an.value = location.hash);
}
window.addEventListener("hashchange", () => {
  an.value = location.hash, jr();
});
const Pe = O(() => {
  const [e, t = ""] = an.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", m = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(m) || 0, env: c };
  });
  return {
    env: Ea.value,
========
function mn(e, t) {
  return Sa(() => localStorage, e, t);
}
function Ea(e, t) {
  ke(t, (n) => mn(e, n), { deep: !0 });
}
function jr(e, t) {
  return Ma(() => sessionStorage, e, t);
}
function Pr(e, t) {
  return Sa(() => sessionStorage, e, t);
}
const nn = "journal.environment", Aa = j(jr(nn, Ot(nn, "")));
function qr(e) {
  Aa.value = e, Pr(nn, e), mn(nn, e);
}
const sn = j(location.hash), Rs = pn(null), Ls = { integrations: "mcp", library: "team" };
function Wr() {
  if (!Rs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ls[n]) {
    location.replace(`#/${[Ls[n], ...s].join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash;
    return;
  }
  !n || Rs.value(n) || (qr(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), sn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  sn.value = location.hash, Wr();
});
const Pe = C(() => {
  const [e, t = ""] = sn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, c = ""] = r.split("@"), [u = "", f = "", g = ""] = i.split(":");
    return { table: u, id: Number(f), comment: Number(g) || 0, env: c };
  });
  return {
    env: Aa.value,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    page: n,
    n: s ? /^\d+$/.test(s) ? Number(s) : s : 0,
    q: a.get("q") || "",
    sub: a.get("sub") || "",
    tab: a.get("tab") || "",
    plugin: a.get("plugin") || "",
    install: a.get("install") || "",
    line: Number(a.get("line") || 0),
    at: a.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), vn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${vn.page(e)}?open=${t}`
};
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Pr(e = "", t = 0, n = "") {
  location.hash = vn.page(e, t, n);
}
const qr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Aa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(qr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Ov(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Ca(e, t, n = 0, s = "") {
========
function Fr(e = "", t = 0, n = "") {
  location.hash = gn.page(e, t, n);
}
const Hr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ca(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Hr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Wv(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Oa(e, t, n = 0, s = "") {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = gt[e]) != null && r.call(gt, t))) return;
  const a = Pe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  Aa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Wr(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return Ca(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Aa([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function it(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Wr(s, a, Number(o), 0, t) : Ca(a, Number(o), 0, t);
}
function Fr(e) {
========
  Ca([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Ur(e, t, n, s = 0, a = "") {
  if (e === Pe.value.env) return Oa(t, n, s, a);
  const o = Pe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Ca([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function it(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Ur(s, a, Number(o), 0, t) : Oa(a, Number(o), 0, t);
}
function Vr(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function mt(e) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  const t = Fr(e);
  t && it(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Hr = ["stroke-width", "innerHTML"], xe = {
========
  const t = Vr(e);
  t && it(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const zr = ["stroke-width", "innerHTML"], be = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const t = e, n = { right: 0, down: 90, left: 180, up: 270 }, s = {
      mail: "inbox",
      circle: "todos",
      play: "work",
      flag: "plan",
      file: "docs",
      report: "reports",
      pin: "pins",
      list: "rules",
      clock: "reminders",
      help: "questions",
      bubble: "inbox",
      wrench: "tools",
      brush: "style",
      band: "rules",
      smile: "smile",
      bot: "agents",
      panel: "activity",
      x: "close",
      check: "todos",
      clip: "paperclip",
      send: "arrow",
      more: "dots",
      chevron: "arrow"
    }, a = {
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
      terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
      trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
      chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
      edits: '<path d="M8 3v6M5 6h6M5 12.5h6"/>',
      gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
      hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
      request: '<path d="M3 5.2h9.4M10 2.9l2.4 2.3L10 7.5"/><path d="M13 10.8H3.6M6 8.5l-2.4 2.3L6 13.1"/>',
      heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
      weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
      points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
      bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
      bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
      todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
      task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
      pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
      style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
      warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
      book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
      auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
      branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
      wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
      narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
      up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
      down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
      board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
      ticket: '<path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.75a1.75 1.75 0 0 0 0 3.5v1.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.75a1.75 1.75 0 0 0 0-3.5z"/><path d="M6.5 5v1M6.5 7.5v1M6.5 10v1"/>',
      download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
      upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
      open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
      sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
      columns: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
      rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
      tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
      float: '<rect x="5.5" y="5.5" width="8" height="7.5" rx="1"/><path d="M2.5 10.5V3h8"/>',
      minimize: '<path d="M4 8h8"/>',
      chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
      reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
      copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
      broadcast: '<circle cx="8" cy="8" r="1.3"/><path d="M5.4 5.2a4 4 0 0 0 0 5.6"/><path d="M10.6 5.2a4 4 0 0 1 0 5.6"/><path d="M3.2 2.9a7 7 0 0 0 0 10.2"/><path d="M12.8 2.9a7 7 0 0 1 0 10.2"/>',
      artboard: '<path d="M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11"/>',
      webpage: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><path d="M2.5 5.8h11M5 8.6h6M5 10.6h3.6"/>',
      pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
      window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
      dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
      restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
      caret: '<path d="M5 6.5l3 3 3-3"/>',
      share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
      floppy: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4L13 5.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/><path d="M5.5 3v3h4.5V3"/><rect x="5" y="8.5" width="6" height="4.5" rx="0.6"/>',
      saveinto: '<path d="M5.5 3H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12 3h-1.5"/><path d="M8 1.75v6.5M5.75 6l2.25 2.25L10.25 6"/><path d="M5 10.75h6"/>',
      tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
      palette: '<path d="M8 2.5a5.5 5.5 0 1 0 0 11c.8 0 1.2-.5 1.2-1.1 0-.9-.8-1.2-.8-2 0-.6.5-1 1.1-1h1.6a2.4 2.4 0 0 0 2.4-2.4C13.5 4.6 11.1 2.5 8 2.5z"/><circle cx="5.3" cy="7.2" r=".6"/><circle cx="7.4" cy="5.1" r=".6"/><circle cx="10.2" cy="5.4" r=".6"/>',
      pause: '<path d="M5.8 4v8M10.2 4v8"/>',
      stop: '<path d="M4.5 4.5h7v7h-7z"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
      tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
      ring: '<circle cx="8" cy="8" r="5.25" stroke-width="2"/>',
      checkbox: '<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.5"/><path d="M5.4 8.1l1.8 1.8 3.5-3.7"/>',
      layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
      info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
      bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
      activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
      arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
      chevronRight: '<path d="M6 3 11 8 6 13"/>',
      back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
      paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
      crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
      camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
      wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
      model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
      agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
      reviewer: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/><path d="M5 7.1l1.4 1.4 2.6-2.8"/>',
      verifier: '<path d="M8 1.8v1.4"/><path d="M5.5 3.2h5"/><path d="M5 4.6h6v7.4H5z"/><path d="M4.5 13.6h7"/><path d="M8 6.9c.9.9 1.2 1.6 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.7.3-1.4 1.2-2.3z"/>',
      reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
      work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
      reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
      pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
      revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
      docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
      rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
      folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
      inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
      questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
      home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
      close: '<path d="M4 4l8 8M12 4l-8 8"/>',
      plus: '<path d="M8 3.5v9M3.5 8h9"/>',
      minus: '<path d="M3.5 8h9"/>',
      power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
      people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
      lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
      plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
      tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
      plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
      search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
      settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
      smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
      dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (o, r) => (l(), d("svg", {
      class: "ico",
      style: $e({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...t.facing === "right" ? {} : { transform: `rotate(${n[t.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[s[e.name] || e.name] || a.dot
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    }, null, 12, Hr));
========
    }, null, 12, zr));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
}, ws = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (l(), K(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      default: z(() => [
        H(xe, { name: "x" })
========
      default: U(() => [
        F(be, { name: "x" })
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Ur = {
  key: 1,
  class: "row-list-failure"
}, Vr = ["data-row"], zr = {
========
}, Gr = {
  key: 1,
  class: "row-list-failure"
}, Kr = ["data-row"], Yr = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "RowList",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    empty: { type: String, required: !0 },
    loaded: { type: Boolean, required: !0 },
    // what the skeleton looks like while the first read is out: the shape of what is coming
    shape: { type: String, default: "rows" },
    // reads the next page behind the rows and says whether it found any; with none given the list has no pages
    older: { type: Function, default: null },
    // whether the server holds a page behind the rows, which is what shows the button to read it
    more: { type: Boolean, default: !0 },
    // how a row comes in and goes out, {enter, leave} each given the row's element and the call that ends it; with none given rows just appear
    arrival: { type: Object, default: null }
  },
  setup(e) {
    const t = e, n = C(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = j(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (l(), K(wt, {
      key: 0,
      shape: e.shape
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Ur, w(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), G(nn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(X, { key: 3 }, [
      (l(), G(lt(e.arrival ? ya : "ul"), ot(n.value, { class: "row-list" }), {
        default: z(() => [
          (l(!0), d(X, null, re(e.rows, (i) => (l(), d("li", {
========
    }, null, 8, ["shape"])) : e.failure ? (l(), d("p", Gr, w(e.failure), 1)) : !e.rows.length && e.loaded ? (l(), K(tn, {
      key: 2,
      title: e.empty
    }, null, 8, ["title"])) : (l(), d(Q, { key: 3 }, [
      (l(), K(lt(e.arrival ? Jo : "ul"), ot(n.value, { class: "row-list" }), {
        default: U(() => [
          (l(!0), d(Q, null, oe(e.rows, (i) => (l(), d("li", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            we(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Vr))), 128))
========
            ye(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Kr))), 128))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (l(), d("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : L("", !0)
    ], 64));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Gr = /* @__PURE__ */ J(zr, [["__scopeId", "data-v-7f34ada7"]]), Kr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Yr = {
  key: 1,
  class: "agent-rows-note"
}, Jr = {
  key: 2,
  class: "agent-rows-note"
}, Zr = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Xr = ["data-agent-row", "onClick"], Qr = { class: "agent-row-name" }, ei = { class: "agent-row-state" }, ti = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = O(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = O(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Kr, [
      e.loaded ? e.failure ? (l(), d("p", Yr, w(e.failure), 1)) : e.rows.length ? (l(), d(X, { key: 3 }, [
        p("p", Zr, w(s.value) + " running", 1),
        (l(!0), d(X, null, re(n.value, (r) => (l(), d("button", {
========
}, Jr = /* @__PURE__ */ J(Yr, [["__scopeId", "data-v-a096d68d"]]), Zr = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Xr = {
  key: 1,
  class: "agent-rows-note"
}, Qr = {
  key: 2,
  class: "agent-rows-note"
}, ei = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ti = ["data-agent-row", "onClick"], ni = { class: "agent-row-name" }, si = { class: "agent-row-state" }, ai = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = C(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (l(), d("div", Zr, [
      e.loaded ? e.failure ? (l(), d("p", Xr, w(e.failure), 1)) : e.rows.length ? (l(), d(Q, { key: 3 }, [
        p("p", ei, w(s.value) + " running", 1),
        (l(!0), d(Q, null, oe(n.value, (r) => (l(), d("button", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          onClick: (i) => U(it)(`agents:${r.id}`)
        }, [
          p("span", Qr, "#" + w(r.id) + " " + w(r.session), 1),
          p("span", ei, w(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Xr))), 128))
      ], 64)) : (l(), d("p", Jr, w(e.none), 1)) : (l(), G(wt, {
========
          onClick: (i) => G(it)(`agents:${r.id}`)
        }, [
          p("span", ni, "#" + w(r.id) + " " + w(r.session), 1),
          p("span", si, w(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, ti))), 128))
      ], 64)) : (l(), d("p", Qr, w(e.none), 1)) : (l(), K(wt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 0,
        shape: "text"
      }))
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Tv = /* @__PURE__ */ J(ti, [["__scopeId", "data-v-a01e5a17"]]), ni = {
========
}, Fv = /* @__PURE__ */ J(ai, [["__scopeId", "data-v-a01e5a17"]]), oi = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: Q(["badge", e.tone])
    }, w(e.text), 3));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Oa = /* @__PURE__ */ J(ni, [["__scopeId", "data-v-9e7e1157"]]), si = ["aria-valuenow", "aria-valuemax"], ai = {
========
}, Ta = /* @__PURE__ */ J(oi, [["__scopeId", "data-v-9e7e1157"]]), ri = ["aria-valuenow", "aria-valuemax"], ii = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "ProgressBar",
  props: {
    value: { type: Number, required: !0 },
    max: { type: Number, default: 100 },
    tone: { type: String, default: "" },
    least: { type: Number, default: 0 },
    thin: Boolean,
    busy: Boolean
  },
  setup(e) {
    const t = e, n = C(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (l(), d("span", {
      class: Q(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: $e({ width: n.value })
      }, null, 4)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    ], 10, si));
  }
}, oi = /* @__PURE__ */ J(ai, [["__scopeId", "data-v-9eba6a85"]]), ri = { class: "bars" }, ii = { class: "bar-name" }, li = { class: "bar-value" }, ci = {
========
    ], 10, ri));
  }
}, li = /* @__PURE__ */ J(ii, [["__scopeId", "data-v-9eba6a85"]]), ci = { class: "bars" }, ui = { class: "bar-name" }, di = { class: "bar-value" }, hi = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = e, s = t, a = O(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = O(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", ri, [
      (l(!0), d(X, null, re(e.items, (c, u) => (l(), G(lt(c.open ? "button" : "div"), {
========
    const n = e, s = t, a = C(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = C(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (l(), d("div", ci, [
      (l(!0), d(Q, null, oe(e.items, (c, u) => (l(), K(lt(c.open ? "button" : "div"), {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: `${u}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: Q(["bar-row", c.tone, { opens: c.open }]),
        onClick: (f) => c.open && s("open", c.open)
      }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        default: z(() => [
          p("span", ii, w(c.label), 1),
          H(oi, {
========
        default: U(() => [
          p("span", ui, w(c.label), 1),
          F(li, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          p("span", li, w(c.value) + w(o.value), 1)
========
          p("span", di, w(c.value) + w(o.value), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, ui = /* @__PURE__ */ J(ci, [["__scopeId", "data-v-663427f4"]]), di = { class: "bars" }, hi = {
  key: 0,
  class: "bars-title"
}, fi = {
========
}, fi = /* @__PURE__ */ J(hi, [["__scopeId", "data-v-663427f4"]]), pi = { class: "bars" }, mi = {
  key: 0,
  class: "bars-title"
}, gi = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), d("div", di, [
      e.node.title ? (l(), d("span", hi, w(e.node.title), 1)) : j("", !0),
      H(ui, {
========
    return (s, a) => (l(), d("div", pi, [
      e.node.title ? (l(), d("span", mi, w(e.node.title), 1)) : L("", !0),
      F(fi, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, pi = /* @__PURE__ */ J(fi, [["__scopeId", "data-v-7135bb11"]]), mi = {
========
}, vi = /* @__PURE__ */ J(gi, [["__scopeId", "data-v-7135bb11"]]), yi = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = C(() => n[s.node.type](s.node));
    return (r, i) => (l(), d("div", {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      class: Q([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: be(o.value)
    }, [
      (l(!0), d(X, null, re(e.node.children || [], (c, u) => (l(), G(oo, {
========
      class: ee([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: $e(o.value)
    }, [
      (l(!0), d(Q, null, oe(e.node.children || [], (c, u) => (l(), K(ro, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: u,
        node: c,
        onOpen: i[0] || (i[0] = (f) => a("open", f)),
        onFile: i[1] || (i[1] = (f) => a("file", f))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Zt = /* @__PURE__ */ J(mi, [["__scopeId", "data-v-d142a3f4"]]), gi = {
  key: 0,
  class: "card-head"
}, vi = { class: "card-title" }, yi = {
  key: 0,
  class: "card-note"
}, wi = {
========
}, Zt = /* @__PURE__ */ J(yi, [["__scopeId", "data-v-d142a3f4"]]), wi = {
  key: 0,
  class: "card-head"
}, ki = { class: "card-title" }, bi = {
  key: 0,
  class: "card-note"
}, $i = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), d("section", {
      class: Q(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      e.node.title ? (l(), d("header", gi, [
        p("span", vi, w(e.node.title), 1),
        e.node.note ? (l(), d("span", yi, w(e.node.note), 1)) : j("", !0)
      ])) : j("", !0),
      H(Zt, {
========
      e.node.title ? (l(), d("header", wi, [
        p("span", ki, w(e.node.title), 1),
        e.node.note ? (l(), d("span", bi, w(e.node.note), 1)) : L("", !0)
      ])) : L("", !0),
      F(Zt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, ki = /* @__PURE__ */ J(wi, [["__scopeId", "data-v-67b72d40"]]), bi = (e, t, n) => Math.max(t, Math.min(n, e)), $i = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Me = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ls = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Mn = 80;
function Ds(e) {
  return e.length <= Mn ? e : `${e.slice(0, Mn + 1).replace(/\s+\S*$/, "") || e.slice(0, Mn)}…`;
========
}, xi = /* @__PURE__ */ J($i, [["__scopeId", "data-v-67b72d40"]]), _i = (e, t, n) => Math.max(t, Math.min(n, e)), Mi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, _e = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ds = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", xn = 80;
function Ns(e) {
  return e.length <= xn ? e : `${e.slice(0, xn + 1).replace(/\s+\S*$/, "") || e.slice(0, xn)}…`;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
}
const js = {
  messages: (e) => Ns(Ds(e.text)),
  comments: (e) => Ns(Ds(e.text)),
  questions: (e) => e.text,
  memories: (e) => `${e.text} (weight ${e.weight})`,
  rules: (e) => e.text,
  reminders: (e) => e.text,
  environments: (e) => e.name,
  agents: (e) => e.session,
  workers: (e) => e.name,
  triggers: (e) => (e.phrases || []).join(", "),
  reactions: (e) => e.face,
  nudges: (e) => {
    var t;
    return ((t = e.data) == null ? void 0 : t.line) || "";
  },
  plugins: (e) => {
    var t;
    return ((t = e.manifest) == null ? void 0 : t.title) || e.name;
  },
  shares: (e) => `Share of ${e.target || "nothing"}`
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, xi = (e) => (Ns[e.table] ? Ns[e.table](e) : e.title || "") || "", Mi = ["done", "cancelled"], Yn = {
  tasks: (e) => Me(e.completed_at) || (e.state === "cancelled" ? Me(e.updated_at) : 0),
  questions: (e) => e.answer ? Me(e.updated_at) : 0,
  plans: (e) => Mi.includes(e.state) ? Me(e.updated_at) : 0,
  notices: (e) => Me(e.closed_at),
  secrets: (e) => Me(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Me(e.updated_at) : 0,
  shares: (e) => Me(e.stopped_at),
  dumps: (e) => Me(e.completed_at),
  agents: (e) => e.state === "ended" ? Me(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Me(e.created_at) : 0
}, _i = (e) => Yn[e.table] ? Yn[e.table](e) : 0, Ta = (e) => _i(e) > 0, Si = (e) => !!Yn[e], Ba = (e) => Me(e.created_at), on = (e) => Me(e.updated_at) || Ba(e), Ei = (e) => "task_ids" in e, yn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ai = "Files are attached on the computer; the phone sends text.", Ia = 1024, Ci = Ia * 1024 * 1024, Oi = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ia} MB limit for one file.`;
function Ti() {
========
}, Si = (e) => (js[e.table] ? js[e.table](e) : e.title || "") || "", Ei = ["done", "cancelled"], Kn = {
  tasks: (e) => _e(e.completed_at) || (e.state === "cancelled" ? _e(e.updated_at) : 0),
  questions: (e) => e.answer ? _e(e.updated_at) : 0,
  plans: (e) => Ei.includes(e.state) ? _e(e.updated_at) : 0,
  notices: (e) => _e(e.closed_at),
  secrets: (e) => _e(e.deleted_at),
  workers: (e) => e.state === "stopped" ? _e(e.updated_at) : 0,
  shares: (e) => _e(e.stopped_at),
  dumps: (e) => _e(e.completed_at),
  agents: (e) => e.state === "ended" ? _e(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? _e(e.created_at) : 0
}, Ai = (e) => Kn[e.table] ? Kn[e.table](e) : 0, Ba = (e) => Ai(e) > 0, Ci = (e) => !!Kn[e], Ia = (e) => _e(e.created_at), an = (e) => _e(e.updated_at) || Ia(e), Oi = (e) => "task_ids" in e, vn = typeof document < "u" && document.documentElement.classList.contains("phone"), Ti = "Files are attached on the computer; the phone sends text.", Ra = 1024, Bi = Ra * 1024 * 1024, Ii = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ra} MB limit for one file.`;
function Ri() {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return () => {
  };
}
function Ps(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Bi(e = window) {
  if (!js(e.document)) {
========
function Li(e = window) {
  if (!Ps(e.document)) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ps(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Ra = "status.summary", ve = ms({
========
const La = "status.summary", ve = gs({
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  version: "",
  failure: "",
  late: !1,
  since: 0,
  external: !1,
  step: "",
  countdown: null,
  target: "",
  starting: !1,
  bootStep: ""
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}), Ii = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, La = () => !!ve.countdown || Ii() || ve.starting;
function Ri(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function Li(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Di() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function Ni(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Di(), !0);
}
let Ht = { version: "", started: 0 };
function ji(e) {
  return e.version ? (Ht.version || (Ht = { version: e.version, started: e.started || 0 }), e.version !== Ht.version || (e.started || 0) !== Ht.started) : !1;
}
function Pi(e) {
  Li(e.countdown), Ri(e.ready, e.step), (Ni(!!e.updating, e.step) || !e.updating && !qi(e) && ji(e)) && Bi(window);
}
const qi = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, Ps = 2e4, Wi = 3e5, Fe = 6e5, Ut = 6, Fi = 500, Hi = "/journal/summary", qs = yn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ui = (e) => e.split("?")[0].endsWith(Hi), Da = (e, t) => Object.assign(new Error(t), { status: e });
async function Vi(e, t, n = Da) {
========
}), Di = () => !!(ve.version || ve.external) && !ve.failure && !ve.late, Da = () => !!ve.countdown || Di() || ve.starting;
function Ni(e, t = "") {
  ve.starting = e === !1, ve.bootStep = ve.starting ? t : "";
}
function ji(e) {
  e && e.version && (ve.target = e.version), ve.countdown = e && e.version ? { version: e.version, until: Date.now() / 1e3 + e.seconds, starting: !!e.starting } : null;
}
function Pi() {
  Object.assign(ve, { version: "", failure: "", late: !1, since: 0, external: !1, step: "", countdown: null, target: "" });
}
function qi(e, t = "") {
  return e && t && (ve.step = t), ve.version || (e && !ve.external && Object.assign(ve, { external: !0, since: Date.now() / 1e3 }), e || !ve.external) ? !1 : (Pi(), !0);
}
let Ht = { version: "", started: 0 };
function Wi(e) {
  return e.version ? (Ht.version || (Ht = { version: e.version, started: e.started || 0 }), e.version !== Ht.version || (e.started || 0) !== Ht.started) : !1;
}
function Fi(e) {
  ji(e.countdown), Ni(e.ready, e.step), (qi(!!e.updating, e.step) || !e.updating && !Hi(e) && Wi(e)) && Li(window);
}
const Hi = (e) => !!ve.version && !ve.failure && !ve.late && e.version !== ve.version, qs = 2e4, Ui = 3e5, Fe = 6e5, Ut = 6, Vi = 500, zi = "/journal/summary", Ws = vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Gi = (e) => e.split("?")[0].endsWith(zi), Na = (e, t) => Object.assign(new Error(t), { status: e });
async function Ki(e, t, n = Na) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const zi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Gi {
========
const Yi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Ji {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Ut;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Ut;
    }
  }
  watch(t) {
    this.watcher = t;
  }
  onWrite(t) {
    this.written = t;
  }
  onBlocked(t) {
    this.refused = t;
  }
  async reach(t, n, s, a, o, r = {}) {
    const i = s instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        headers: { ...qs, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: zi(s),
        signal: AbortSignal.timeout(a || (i ? Wi : Ps))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Fi)), this.reach(t, n, s, a, o - 1, r);
========
        headers: { ...Ws, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Yi(s),
        signal: AbortSignal.timeout(a || (i ? Ui : qs))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((u) => setTimeout(u, Vi)), this.reach(t, n, s, a, o - 1, r);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }
  }
  async send(t, n, s, a = 0, o = Ut, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    } : Ti(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Vi(c, `${c.status} ${c.statusText}`).catch((u) => {
========
    } : Ri(), c = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Ki(c, `${c.status} ${c.statusText}`).catch((u) => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = await fetch(t, { headers: qs, signal: AbortSignal.timeout(Ps) });
    if (!n.ok) throw Da(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
========
    const n = await fetch(t, { headers: Ws, signal: AbortSignal.timeout(qs) });
    if (!n.ok) throw Na(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Ut, o).then((c) => (this.written(n), c));
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    if (La() && !Ui(n))
========
    if (Da() && !Gi(n))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(r)) return this.flying.get(r);
    const i = this.send(t, n, s, 0, this.tries, o);
    return this.flying.set(r, i), i.finally(() => this.flying.delete(r)).catch(() => {
    }), i;
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query
  stream(t) {
    return new EventSource(t);
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response
  raw(t, n = {}) {
    return fetch(t, n);
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const je = new Gi(), Ee = (e) => encodeURIComponent(e);
function de(e) {
========
const je = new Ji(), Ee = (e) => encodeURIComponent(e);
function he(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", Ki = "X-Journal-Env", Yi = "X-Journal-Request-At", _n = "/viewer/voices/figures/";
class ws {
========
const $t = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), xt = "the page does not know its environment yet", Zi = "X-Journal-Env", Xi = "X-Journal-Request-At", _n = "/viewer/voices/figures/";
class ks {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  constructor({ env: t = () => Pe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ks({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return { [Yi]: String(Date.now()), ...this.env() ? { [Ki]: this.env() } : {} };
========
    return { [Xi]: String(Date.now()), ...this.env() ? { [Zi]: this.env() } : {} };
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === xt ? Promise.reject(new Error(xt)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === xt ? Promise.reject(new Error(xt)) : je.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : xt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Ee(this.env())}`);
  }
  // the journal as a whole
  manifest() {
    return this.get("/manifest");
  }
  identity() {
    return this.get("/identity");
  }
  journals() {
    return this.get("/journals");
  }
  summary() {
    return this.get("/summary");
  }
  bar() {
    return this.get(this.here("/bar"));
  }
  developer() {
    return this.get("/developer");
  }
  supervised() {
    return this.get("/supervised");
  }
  clientError(t) {
    return this.post("/client-errors", t);
  }
  developerReset() {
    return this.post("/developer/reset");
  }
  // the nudges each agent was sent, counted since the last reset
  developerNudges() {
    return this.get("/developer/nudges");
  }
  developerNudgesReset() {
    return this.post("/developer/nudges/reset");
  }
  // how well the environment's readers read its runs
  developerReaders() {
    return this.get(this.here("/developer/readers"));
  }
  settings() {
    return this.get(this.here("/settings"));
  }
  saveSettings(t) {
    return this.post(this.here("/settings"), t);
  }
  releases() {
    return this.get("/updates");
  }
  freshReleases() {
    return this.get("/updates/fresh");
  }
  update() {
    return this.post("/updates", {});
  }
  forceUpdate() {
    return this.post("/updates/force", {});
  }
  planTimeline(t) {
    return this.get(this.here(`/plans/${t}/timeline`));
  }
  changelog(t) {
    return this.get(`/updates/changelog${he({ skip: t })}`);
  }
  // whether a version 3 journal is kept in .journal/version-3, and where bringing it across stands
  migration() {
    return this.get(this.here("/migration"));
  }
  putMigrationOff() {
    return this.post(this.here("/migration/later"), {});
  }
  startMigration() {
    return this.post(this.here("/migration/start"), {});
  }
  // the timeline the viewer stays live by: the entries after an id, or the newest, and the same as a stream
  entries(t = 0, n = 0) {
    return this.get(this.here(`/entries${he({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return je.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: c = !1, docked: u = !1 } = {}) {
    const f = this.here(`/${t}${he({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: c ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(f, `${t}.${$t({ before: s, after: a, since: o, ids: r, tasks: i, closed: c, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${he({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${$t({ before: s, since: a, docked: o })}`);
  }
  show(t, n) {
    return this.get(this.here(`/${t}/${n}`));
  }
  create(t, n) {
    return this.post(this.here(`/${t}`), n);
  }
  change(t, n, s) {
    return this.post(this.here(`/${t}/${n}`), s);
  }
  act(t, n, s, a = {}, o = 0) {
    return this.post(this.here(`/${t}/${n}/${s}`), a, o);
  }
  dockRow(t, n) {
    return this.post(this.here(`/docks/${t}/${n}`), {});
  }
  undockRow(t, n) {
    return this.post(this.here(`/docks/${t}/${n}/undock`), {});
  }
  // a button on a message's card names the path it posts to
  press(t) {
    return this.post(this.here(t.path), {}, Fe);
  }
  upload(t, n, s) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    if (yn) return Promise.reject(Object.assign(new Error(Ai), { status: 403 }));
    if (s.size > Ci) return Promise.reject(new Error(Oi(s)));
========
    if (vn) return Promise.reject(Object.assign(new Error(Ti), { status: 403 }));
    if (s.size > Bi) return Promise.reject(new Error(Ii(s)));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Ee(s)}`);
  }
  // a document's revisions in order, and keeping the open one as it is
  docRevisions(t) {
    return this.get(this.here(`/docs/${t}/revisions`));
  }
  keepDoc(t) {
    return this.act("docs", t, "keep");
  }
  // a document or report as a file to download, named by the journal
  exportUrl(t, n) {
    return this.address(`/${t}/${n}/export`);
  }
  // the bytes at a file's address, so the viewer can tell text from a file it must not print
  fileBytes(t) {
    return je.bytes(t);
  }
  // messages
  readMessages(t) {
    return this.post(this.here("/messages/read"), { ids: t });
  }
  // the message made with the key the page sent it with, once the environment's host has made it
  sentMessage(t) {
    return this.get(this.here(`/messages/sent/${encodeURIComponent(t)}`));
  }
  // the buttons pressed on a message's card, kept so the chat shows them spent
  pressed(t, n) {
    return this.act("messages", t, "press", { pressed: n });
  }
  // a comment: a message of the user's written under a row, named as tasks:12, or under a chat message as a reply to it
  comment(t, n) {
    return this.create("messages", { on: t, text: n });
  }
  // every comment under one row, named as reports:12: the messages written under it
  commentsOn(t) {
    return this.get(this.here(`/messages${he({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${he(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${he({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${he({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
  }
  // a plan's tasks
  planTasks(t) {
    return this.get(this.here(`/plans/${t}/tasks`));
  }
  addPlanTask(t, n) {
    return this.post(this.here(`/plans/${t}/tasks`), n);
  }
  // sets how a plan's agent is told to test, by a plan testing template's title, or none
  setPlanTesting(t, n) {
    return this.post(this.here(`/plans/${t}/testing`), { title: n });
  }
  // the plan testing templates a plan may follow
  planTestingTemplates() {
    return this.get(this.here("/plan-testing"));
  }
  taskLogs(t) {
    return this.get(this.here(`/tasks/${t}/logs`));
  }
  // what starts a sequence, and its steps
  setTriggers(t, n) {
    return this.act("sequences", t, "triggers", { triggers: n });
  }
  setSteps(t, n) {
    return this.act("sequences", t, "steps", { steps: n });
  }
  // agents
  liveAgents() {
    return this.get("/agents/live");
  }
  agentControls(t, n = "", s = "") {
    return this.get(`/agents/controls/${Ee(t)}${he({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Ee(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Ee(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${he(s)}`), `${a}.${$t(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${he(n)}`), `/verifiers/${t}/transcript.${$t(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${he(n)}`), `/workers/${t}/transcript.${$t(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${he({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${he({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${he({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${he({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${he({ team: t })}`);
  }
  // every team this journal is connected to, with as whom, the role and how many people, devices and shared items
  teams() {
    return this.get("/teams");
  }
  // connects to a team by its server's URL: a new server's makes this person its admin, an pair_code URL a member, a bare URL logs in
  connectTeam(t) {
    return this.post("/team/connect", t, Fe);
  }
  // disconnects from one team, the one or the one named; what was imported from its library stays
  disconnectTeam(t = "") {
    return this.post("/team/disconnect", { team: t });
  }
  // an pair_code URL for a person's email; admins only
  inviteToTeam(t, n = "") {
    return this.post("/team/invite", { email: t, team: n });
  }
  // the team's devices and people, and a device revoked; admins only
  teamDevices(t = "") {
    return this.get(`/team/devices${he({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${he({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${he({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${he({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${he({ team: t })}`);
  }
  // publishes a sequence or template, by its number, or a profile, by its name, as the library's next version
  publishLibraryItem(t, n, s, a, o = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, Fe);
  }
  // imports a library item's version as this journal's own copy; accept writes a reader or a sequence whose script or powers were read
  importLibraryItem(t, n, s, a = !1, o = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}/import`, { version: s, accept: a, team: o });
  }
  // updates the imported copy to the newest version; replace writes over a copy edited here
  updateLibraryItem(t, n, s, a = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}/update`, { replace: s, team: a });
  }
  // the work mode the plan bar's buttons set, and the pause of an agent
  saveMode(t) {
    return this.post(this.here("/mode"), { mode: t });
  }
  // the project's conversations Claude Code and Codex kept on this machine, newest first, for a new environment to carry on from
  pastSessions() {
    return this.get("/environments/sessions");
  }
  // how far a new environment's chat has been filled from its past session, in percent, null when it is not being filled
  filledPercent(t) {
    return this.get(`/environments/filling?name=${encodeURIComponent(t)}`);
  }
  pauseAgent(t) {
    return this.act("agents", t, "pause");
  }
  resumeAgent(t) {
    return this.act("agents", t, "resume");
  }
  launchAgent(t, n) {
    return this.act("environments", t, "launch", { agent: n });
  }
  stopAgentIn(t) {
    return this.act("environments", t, "stop");
  }
  removeEnvironment(t) {
    return this.act("environments", t, "remove");
  }
  leftWorktrees() {
    return this.get(this.here("/worktrees"));
  }
  removeLeftWorktree(t) {
    return this.post(this.here(`/worktrees/${encodeURIComponent(t)}/removal`));
  }
  removeWorktree(t) {
    return this.act("environments", t, "worktree-removal");
  }
  // one page of an output: the newest, the lines after a position, or the page before one
  // the workers' noteworthy moments, newest first, read from the marks written for them in the chat
  workerActivity() {
    const t = this.here("/workers/activity");
    return this.get(t, t);
  }
  // the outputs still running in this environment, each with its card and whether it is docked
  runningOutputs() {
    return this.get(this.here("/outputs/running"));
  }
  readOutput(t, { after: n, before: s } = {}) {
    const a = this.here(`/outputs/${t}${he({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${he({ agent: t })}`));
  }
  skill(t) {
    return this.get(this.here(`/skills/${Ee(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Ee(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Ee(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return je.request("GET", _n + "figures.json");
  }
  voiceFigureUrl(t) {
    return _n + t;
  }
  figureDecoderUrl() {
    return _n + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${he({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${he({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${he({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${he({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${he({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${he({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${he({ skip: t, last: n })}`));
  }
  gitPulls() {
    return this.get(this.here("/git/pulls"));
  }
  // secrets
  secretsFile() {
    return this.get(this.here("/secrets/where"));
  }
  // plugins
  previewPlugin(t) {
    return this.post(this.here("/plugins/preview"), { source: t }, Fe);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, Fe);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, Fe);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, Fe);
  }
  pluginLog(t, n = 200) {
    return this.get(this.here(`/plugins/${t}/log${he({ lines: n })}`));
  }
  pluginRecord(t) {
    return this.get(this.here(`/plugins/${t}/record`));
  }
  pluginDashboard(t) {
    return this.get(this.here(`/plugins/${t}/dashboard`));
  }
  // the agent profiles and the MCP servers
  gitHooks() {
    return this.get(this.here("/git-hooks"));
  }
  agentProfiles() {
    return this.get("/profiles");
  }
  saveAgentProfile(t, n) {
    return this.post(`/profiles/${Ee(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Ee(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Ee(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, Fe);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Ee(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Fe);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Ee(t)}` : ""}${vn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const ie = new ws({ base: yn ? "/p" : "" }), Ji = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), Zi = { claude: "Claude Code", codex: "Codex" };
Object.entries(Zi).map(([e, t]) => ({ key: e, label: t }));
const Ws = (e) => e.status === "stopped" ? 1 : 0, Xi = "main", Qi = (e) => e.filter((t) => t.role === Xi).sort((t, n) => Ws(t) - Ws(n) || Me(n.heard_at) - Me(t.heard_at))[0] || null, el = { me: 1, people: [] }, K = ms({
========
const ie = new ks({ base: vn ? "/p" : "" }), Qi = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(ie.base.length).split("/")[2]);
}), el = { claude: "Claude Code", codex: "Codex" };
Object.entries(el).map(([e, t]) => ({ key: e, label: t }));
const Fs = (e) => e.status === "stopped" ? 1 : 0, tl = "main", nl = (e) => e.filter((t) => t.role === tl).sort((t, n) => Fs(t) - Fs(n) || _e(n.heard_at) - _e(t.heard_at))[0] || null, sl = { me: 1, people: [] }, Y = gs({
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  spec: null,
  drafting: 0,
  quoting: null,
  dumping: !1,
  dumpSelected: 0,
  dumpFiles: [],
  pane: "chat",
  skill: "",
  pluginPage: null,
  identity: null,
  rows: {},
  elsewhere: {},
  paging: { size: {}, more: {} },
  counts: {},
  entries: [],
  settings: null,
  agents: [],
  live: [],
  journals: [],
  summary: null,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  people: el,
========
  people: sl,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Ot("journal.activity", !0),
  wide: !1,
  sideMini: Ot("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
Sa("journal.activity", () => K.activity);
Sa("journal.side.mini", () => K.sideMini);
const vt = O(() => Qi(K.agents));
O(() => !!vt.value && K.live.some((e) => e.agent.session === vt.value.session && e.environment === Pe.value.env));
O(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function tl(e, t = Date.now()) {
========
Ea("journal.activity", () => Y.activity);
Ea("journal.side.mini", () => Y.sideMini);
const vt = C(() => nl(Y.agents));
C(() => !!vt.value && Y.live.some((e) => e.agent.session === vt.value.session && e.environment === Pe.value.env));
C(() => !!vt.value && ["busy", "working"].includes(vt.value.status));
function al(e, t = Date.now()) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Jn(e) {
  const t = tl(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function Na(e) {
========
function Yn(e) {
  const t = al(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function ja(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Hs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Sn = (e) => String(e).padStart(2, "0");
function nl(e) {
========
const Mn = (e) => String(e).padStart(2, "0");
function ol(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Sn(t % 60)}s` : `${Math.floor(t / 3600)}h ${Sn(Math.floor(t % 3600 / 60))}m ${Sn(t % 60)}s`;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const sl = ["working", "busy", "waiting", "compacting"], al = (e) => sl.includes(e), ol = "builder";
O(() => !K.settings || K.settings.features.file_feed !== !1);
const rl = O(() => !K.settings || K.settings.features.status_bar !== !1);
O(() => K.settings && K.settings.workers && K.settings.workers.mode || ol);
O(() => !K.settings || !K.settings.tasks || K.settings.tasks.auto !== !1);
O(() => !!(K.settings && K.settings.reviewing && K.settings.reviewing.reviewer));
O(() => !K.settings || K.settings.features.sharing !== !1);
const rn = 50, ks = 100, il = { messages: 25 }, Re = (e) => il[e] || rn;
function ll(e, t) {
  if (e !== "messages") return Math.max(t.length - Re(e), 0);
========
const rl = ["working", "busy", "waiting", "compacting"], il = (e) => rl.includes(e), ll = "builder";
C(() => !Y.settings || Y.settings.features.file_feed !== !1);
const cl = C(() => !Y.settings || Y.settings.features.status_bar !== !1);
C(() => Y.settings && Y.settings.workers && Y.settings.workers.mode || ll);
C(() => !Y.settings || !Y.settings.tasks || Y.settings.tasks.auto !== !1);
C(() => !!(Y.settings && Y.settings.reviewing && Y.settings.reviewing.reviewer));
C(() => !Y.settings || Y.settings.features.sharing !== !1);
const on = 50, bs = 100, ul = { messages: 25 }, Le = (e) => ul[e] || on;
function dl(e, t) {
  if (e !== "messages") return Math.max(t.length - Le(e), 0);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Le(e)) return s;
  return 0;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const cl = "review_step", ul = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === cl).sort((t, n) => t.id - n.id), dl = 5, hl = 500, fl = 3e3, pl = () => K.entries.length ? K.entries[K.entries.length - 1].id : 0, Xt = { env: "", id: 0 }, ml = () => !!(K.bar && K.bar.length) || al(vt.value && vt.value.status);
function gl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function vl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: ks })))).then(ul);
}
function yl() {
  return Xt.env !== ie.env() && Object.assign(Xt, { env: ie.env(), id: pl() }), ie.entries(Xt.id);
}
function wl(e) {
  e.length && (Xt.id = e[e.length - 1].id, uc(e));
}
async function kl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", rn);
}
const Zn = /* @__PURE__ */ new Map();
async function Xn(e, t) {
  const n = `${e}:${ie.env()}`, s = Zn.get(n);
  if (!s) return Hs(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(on)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ie.list("workers", { limit: t, since: a, after: o });
========
const hl = "review_step", fl = (e) => e.flatMap((t) => t.rows || []).filter((t) => t.data && t.data.kind === hl).sort((t, n) => t.id - n.id), pl = 5, ml = 500, gl = 3e3, vl = () => Y.entries.length ? Y.entries[Y.entries.length - 1].id : 0, Xt = { env: "", id: 0 }, yl = () => !!(Y.bar && Y.bar.length) || il(vt.value && vt.value.status);
function wl({ session: e }) {
  return (e ? ie.chat(e, { docked: !0 }) : ie.list("messages", { docked: !0 })).then((t) => t.rows || []);
}
function kl() {
  return ie.list("reviewers", { limit: 20 }).then((e) => Promise.all((e.rows || []).filter((t) => t.session).map((t) => ie.chat(t.session, { limit: bs })))).then(fl);
}
function bl() {
  return Xt.env !== ie.env() && Object.assign(Xt, { env: ie.env(), id: vl() }), ie.entries(Xt.id);
}
function $l(e) {
  e.length && (Xt.id = e[e.length - 1].id, fc(e));
}
async function xl({ scope: e, table: t, id: n }) {
  await e.holding(t, [n]), await e.recent("messages", on);
}
const Jn = /* @__PURE__ */ new Map();
async function Zn(e, t) {
  const n = `${e}:${ie.env()}`, s = Jn.get(n);
  if (!s) return Us(n, (await ie.list("workers", { limit: t })).rows || []);
  const a = Math.max(0, ...s.map(an)), o = s.length ? Math.min(...s.map((c) => c.id)) - 1 : 0, r = await ie.list("workers", { limit: t, since: a, after: o });
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!r.is_last_page)
    return Zn.delete(n), Xn(e, t);
  const i = new Set(r.rows.map((c) => c.id));
  return Us(
    n,
    [...s.filter((c) => !i.has(c.id)), ...r.rows].sort((c, u) => c.id - u.id)
  );
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Hs = (e, t) => (Zn.set(e, t), t);
async function Us(e, t) {
========
const Us = (e, t) => (Jn.set(e, t), t);
async function Vs(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = await e.list("agents", { limit: t }), s = n.rows.map((a) => a.id);
  return s.length ? e.list("agents", { ids: s }) : n;
}
const zs = Object.freeze({
  "status.bar": {
    read: () => ie.bar(),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    every: () => ml() ? hl : fl,
    take: (e) => Array.isArray(e) && (K.bar = e),
    active: () => rl.value
  },
  "agents.index": { read: () => Us(ie, dl), every: 1e3, take: (e) => K.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => K.live = e },
========
    every: () => yl() ? ml : gl,
    take: (e) => Array.isArray(e) && (Y.bar = e),
    active: () => cl.value
  },
  "agents.index": { read: () => Vs(ie, pl), every: 1e3, take: (e) => Y.agents = e.rows },
  "agents.live": { read: () => ie.liveAgents(), every: 5e3, take: (e) => Y.live = e },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  "status.summary": {
    read: () => ie.summary(),
    every: () => ve.countdown || ve.external || ve.version ? 1e3 : 4e3,
    take: (e) => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      K.summary = e, Pi(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => K.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => K.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (K.people = e) },
  "entries.recent": { read: yl, every: 1e3, take: wl },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: gl, every: 1e3, by: ({ session: e }) => e || "main" },
========
      Y.summary = e, Fi(e);
    }
  },
  "journal.manifest": { read: () => ie.manifest(), every: 3e4, take: (e) => Y.spec = e },
  "journals.index": { read: () => ie.journals(), every: 1e4, take: (e) => Y.journals = e },
  "people.index": { read: () => ie.people(), every: 3e4, take: (e) => e && e.people && (Y.people = e) },
  "entries.recent": { read: bl, every: 1e3, take: $l },
  "outputs.running": { read: () => ie.runningOutputs(), every: 3e3 },
  "messages.docked": { read: wl, every: 1e3, by: ({ session: e }) => e || "main" },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  "mcp.servers": { read: () => ie.mcp(), every: 3e4 },
  "developer.readers": { read: () => ie.developerReaders(), every: 5e3 },
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 },
  "tour.start": { read: ({ clear: e }) => e(), every: 800 },
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  "workers.index": { read: () => Xn("workers.index", Re("workers")), every: 5e3 },
========
  "workers.index": { read: () => Zn("workers.index", Le("workers")), every: 5e3 },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  "workers.activity": { read: () => ie.workerActivity().then((e) => e.rows || []), every: 5e3 },
  "workers.every": { read: () => Xn("workers.every", 200), every: 5e3 },
  "verifiers.every": { read: () => ie.list("verifiers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
  "reviewers.every": { read: () => ie.list("reviewers", { limit: 200 }).then((e) => e.rows || []), every: 5e3 },
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  "reviewer.steps": { read: vl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Re("test_turns") }).then((e) => e.rows || []), every: 3e3 },
========
  "reviewer.steps": { read: kl, every: 3e3 },
  "tests.turns": { read: () => ie.list("test_turns", { limit: Le("test_turns") }).then((e) => e.rows || []), every: 3e3 },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  "rows.shown": { read: ({ table: e, ids: t }) => ie.list(e, { ids: t }).then((n) => n.rows || []), every: 1e4, by: ({ table: e, ids: t }) => `${e}:${t.join(",")}` },
  "workers.shown": { read: ({ ids: e }) => e.length ? ie.list("workers", { ids: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ ids: e }) => e.join(",") },
  "workers.holding": { read: ({ tasks: e }) => e.length ? ie.list("workers", { tasks: e }).then((t) => t.rows || []) : Promise.resolve([]), every: 5e3, by: ({ tasks: e }) => e.join(",") },
  "plugin.dashboard": { read: ({ plugin: e }) => ie.pluginDashboard(e), every: 1e4, by: ({ plugin: e, board: t }) => `${e}:${t}` },
  "plan.timeline": { read: ({ scope: e, plan: t }) => e.api.planTimeline(t), every: 15e3, by: ({ scope: e, plan: t }) => `${e.env}:${t}` },
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  "reader.elsewhere": { read: kl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Us(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
========
  "reader.elsewhere": { read: xl, every: 5e3, by: ({ scope: e, table: t, id: n }) => `${e.env}:${t}:${n}` },
  "inspector.agents": { read: ({ client: e }) => Vs(e, 20), every: 5e3, by: ({ client: e }) => e.env() },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  "inspector.rows": { read: ({ scope: e, tables: t }) => e.recentAll(t, 50), every: 5e3, by: ({ scope: e }) => e.env },
  "agent.terminal": { read: ({ client: e, agent: t, after: n }) => e.terminal(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.transcript": {
    read: ({ client: e, agent: t, session: n, since: s }) => e.transcript(t, n, { since: s, last: rn }),
    every: 3e3,
    by: ({ client: e, agent: t, session: n }) => `${e.env()}:${t}:${n || ""}`
  },
  "rows.older": { read: ({ scope: e, table: t }) => e.earlier(t), demand: !0, by: ({ scope: e, table: t }) => `${e.env}:${t}` },
  "agent.transcript.older": { read: ({ client: e, agent: t, session: n, before: s }) => e.transcript(t, n, { before: s, last: rn }), demand: !0, pauses: "agent.transcript" },
  "worker.chat": { read: ({ scope: e }) => e.chat.refresh(), every: 3e3, by: ({ scope: e }) => e.chat.session },
  "agent.edits": { read: ({ client: e, agent: t, cursor: n }) => e.edits(t, n), every: 2e3, by: ({ client: e, agent: t }) => `${e.env()}:${t}` },
  "agent.edits.older": { read: ({ client: e, agent: t, before: n }) => e.edits(t, 0, { before: n }), demand: !0, pauses: "agent.edits" }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}), bl = 6e4, $l = 3e3, xl = 4, Ml = 300, _l = 5e3, ja = /* @__PURE__ */ new Map();
function wn(e) {
  if (!(e in Vs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Vs[e];
}
function Sl(e) {
  const t = wn(e.key).every;
========
}), _l = 6e4, Ml = 3e3, Sl = 4, El = 300, Al = 5e3, Pa = /* @__PURE__ */ new Map();
function yn(e) {
  if (!(e in zs)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return zs[e];
}
function Cl(e) {
  const t = yn(e.key).every;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Al;
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const El = (e) => e / 2 + Math.random() * e / 2, Pa = (e) => [...e.users.values()].pop(), bs = (e) => ja.get(e.place) === e, Al = () => Math.random() * Ml, $s = () => document.hidden;
function Cl(e) {
  const t = Sl(e);
  return e.failures ? El(Math.min(e.key === Ra ? $l : bl, t * 2 ** e.failures)) : Math.max(t, xl * e.took);
}
function qa(e, t) {
  clearTimeout(e.timer), !(!bs(e) || e.paused || $s()) && (e.timer = setTimeout(() => Ol(e), t));
}
function Ol(e) {
  return bs(e) ? e.running ? (e.again = !0, e.running) : (e.running = Rl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Tl = (e) => {
  var t, n;
  return !e.paused && !$s() && (((n = (t = wn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Pa(e).active() && (!La() || e.key === Ra);
};
async function Bl(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => wn(e.key).read(Pa(e).params()));
========
const Ol = (e) => e / 2 + Math.random() * e / 2, qa = (e) => [...e.users.values()].pop(), $s = (e) => Pa.get(e.place) === e, Tl = () => Math.random() * El, xs = () => document.hidden;
function Bl(e) {
  const t = Cl(e);
  return e.failures ? Ol(Math.min(e.key === La ? Ml : _l, t * 2 ** e.failures)) : Math.max(t, Sl * e.took);
}
function Wa(e, t) {
  clearTimeout(e.timer), !(!$s(e) || e.paused || xs()) && (e.timer = setTimeout(() => Il(e), t));
}
function Il(e) {
  return $s(e) ? e.running ? (e.again = !0, e.running) : (e.running = Nl(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Rl = (e) => {
  var t, n;
  return !e.paused && !xs() && (((n = (t = yn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && qa(e).active() && (!Da() || e.key === La);
};
async function Ll(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => yn(e.key).read(qa(e).params()));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Il(e, t) {
========
function Dl(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var n, s;
  e.last = { got: t }, (s = (n = wn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
async function Rl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Tl(e) && Il(e, await Bl(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && bs(e) && !e.paused);
  qa(e, Cl(e));
}
const Ll = () => $s() || ja.forEach((e) => qa(e, Al()));
document.addEventListener("visibilitychange", Ll);
const Dl = 60, Nl = (e, t) => Me(e.created_at) >= Me(t.created_at) - Dl, jl = (e, t) => e.id > 0 && e.table === t.table && Nl(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), xs = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => jl(s, n))), En = [
========
async function Nl(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Rl(e) && Dl(e, await Ll(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && $s(e) && !e.paused);
  Wa(e, Bl(e));
}
const jl = () => xs() || Pa.forEach((e) => Wa(e, Tl()));
document.addEventListener("visibilitychange", jl);
const Pl = 60, ql = (e, t) => _e(e.created_at) >= _e(t.created_at) - Pl, Wl = (e, t) => e.id > 0 && e.table === t.table && ql(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), _s = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Wl(s, n))), Sn = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], fe = (e, t, n, s = {}) => ({
  title: e,
  icon: t,
  abstract: n,
  view: "small",
  scope: "environment",
  in_sidebar: !1,
  listed_under: "",
  needs_attention: !1,
  lists_completed_unread: !1,
  nested: !1,
  takes_comments: !1,
  closed_first: !1,
  created_in_viewer: !1,
  listed_as_cards: !1,
  typed_as_title: !1,
  start_as_count: !1,
  exports: !1,
  labels: {},
  filters: [],
  ...s
}), Dt = {
  messages: fe("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: fe("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: fe("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: En
  }),
  tasks: fe("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: En
  }),
  reports: fe("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: fe("Collection", "folder", "Rows that belong together, gathered under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: fe("Document", "file", "What stays true about the project, catalogued for every session", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    exports: !0,
    start_as_count: !0
  }),
  memories: fe("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: fe("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: fe("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  notices: fe("Notice", "band", "One line pinned to the chat while it matters", { filters: En }),
  reactions: fe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: fe("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: fe("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: fe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: fe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: fe("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: fe("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: fe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: fe("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: fe("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
  sequences: fe("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: fe("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: fe("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: fe("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
    view: "check",
    filters: [
      { key: "open", title: "Checks", shows: "open" },
      { key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check of its own." }
    ],
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0
  }),
  dumps: fe("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: fe("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: fe("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Pl = ["secrets", "plugins"], Wa = Object.keys(Dt).filter((e) => !(yn && Pl.includes(e)));
O(() => Wa.map((e) => ({ name: e, ...Dt[e] })));
const Nt = (e) => Dt[e], Fa = new Map(Wa.flatMap((e) => [e, e.replace(/s$/, ""), Dt[e].title.toLowerCase()].map((t) => [t, e]))), at = (e) => Fa.get(String(e).toLowerCase()) || "", Ha = [...Fa.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), Ms = q(0), jt = /* @__PURE__ */ new Set(), Pt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Qn = /* @__PURE__ */ new Set(), ql = /* @__PURE__ */ new Map(), Wl = /* @__PURE__ */ new Map();
let pt = !1, Mt = null;
const Fl = (e, t) => e.id - t.id, Hl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Ul = { messages: Hl }, Ua = (e) => Ul[e] || Fl;
function Va(e) {
  return Ms.value, Xe.has(e) || (Xe.add(e), K.booted && (!jt.has(e) || Pt.has(e)) && queueMicrotask(() => bn([e], !1))), K.rows[e] || [];
}
function Vl(e) {
  const t = K.rows[e] || [], n = ll(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  K.rows[e] = t.filter((a) => s.has(a) || Si(e) && !Ta(a)), K.paging.size[e] = Re(e), K.paging.more[e] = !0;
}
const zl = /* @__PURE__ */ new Set();
function Gl() {
  Xe.forEach(Vl), Xe.clear(), ql.clear(), Wl.clear(), Ms.value += 1;
}
ke(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, Gl);
ke(
  () => K.booted,
  (e) => e && bn(
========
}, Fl = ["secrets", "plugins"], Fa = Object.keys(Dt).filter((e) => !(vn && Fl.includes(e)));
C(() => Fa.map((e) => ({ name: e, ...Dt[e] })));
const Nt = (e) => Dt[e], Ha = new Map(Fa.flatMap((e) => [e, e.replace(/s$/, ""), Dt[e].title.toLowerCase()].map((t) => [t, e]))), at = (e) => Ha.get(String(e).toLowerCase()) || "", Ua = [...Ha.keys()].sort((e, t) => t.length - e.length).join("|"), Xe = /* @__PURE__ */ new Set(), Ms = j(0), jt = /* @__PURE__ */ new Set(), Pt = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new Set(), Xn = /* @__PURE__ */ new Set(), Hl = /* @__PURE__ */ new Map(), Ul = /* @__PURE__ */ new Map();
let pt = !1, _t = null;
const Vl = (e, t) => e.id - t.id, zl = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Gl = { messages: zl }, Va = (e) => Gl[e] || Vl;
function za(e) {
  return Ms.value, Xe.has(e) || (Xe.add(e), Y.booted && (!jt.has(e) || Pt.has(e)) && queueMicrotask(() => kn([e], !1))), Y.rows[e] || [];
}
function Kl(e) {
  const t = Y.rows[e] || [], n = dl(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  Y.rows[e] = t.filter((a) => s.has(a) || Ci(e) && !Ba(a)), Y.paging.size[e] = Le(e), Y.paging.more[e] = !0;
}
const Yl = /* @__PURE__ */ new Set();
function Jl() {
  Xe.forEach(Kl), Xe.clear(), Hl.clear(), Ul.clear(), Ms.value += 1;
}
ke(() => `${Pe.value.env}/${Pe.value.page}/${Pe.value.open ? Pe.value.open.table : ""}`, Jl);
ke(
  () => Y.booted,
  (e) => e && kn(
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    [...Xe].filter((t) => !jt.has(t)),
    !1
  )
);
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const es = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Ei(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function za(e, t) {
========
const Qn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Oi(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ga(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (es(s) && !es(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Ga(e, t) {
  jt.add(e), Ms.value += 1;
  const n = K.rows[e] || [];
  K.rows[e] = [...za(n, t.rows), ...xs(n.filter((s) => s.id === 0), t.rows)], K.paging.size[e] = K.paging.size[e] || Re(e), K.paging.more[e] = !t.is_last_page;
}
async function Kl(e) {
  const t = new Set((K.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Re(e) });
  kn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = xs((K.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ga(e, { ...n, rows: [...n.rows, ...a].sort(Ua(e)) }), K.paging.size[e] = Re(e), Ka.has(e) && await Ya(e), K.rows[e];
}
const kn = (e, t) => K.counts = { ...K.counts, [e]: t };
async function Yl(e) {
  const t = K.rows[e] || [], n = Math.max(0, ...t.map(on)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Re(e), since: n, after: s });
  if (kn(e, a.counts), !a.is_last_page) return Kl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = xs(t.filter((i) => !o.has(i.id)), a.rows).concat(za(t, a.rows));
  return K.rows[e] = r.sort(Ua(e)), K.paging.size[e] = K.rows[e].length, K.rows[e];
}
const An = /* @__PURE__ */ new Set();
async function Jl(e, t = !1) {
  e.forEach((n) => Pt.delete(n)), e.forEach((n) => Qn.add(n));
  try {
    await sc(e, t);
========
function Ka(e, t) {
  jt.add(e), Ms.value += 1;
  const n = Y.rows[e] || [];
  Y.rows[e] = [...Ga(n, t.rows), ..._s(n.filter((s) => s.id === 0), t.rows)], Y.paging.size[e] = Y.paging.size[e] || Le(e), Y.paging.more[e] = !t.is_last_page;
}
async function Zl(e) {
  const t = new Set((Y.rows[e] || []).map((o) => o.id)), n = await ie.list(e, { limit: Le(e) });
  wn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = _s((Y.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ka(e, { ...n, rows: [...n.rows, ...a].sort(Va(e)) }), Y.paging.size[e] = Le(e), Ya.has(e) && await Ja(e), Y.rows[e];
}
const wn = (e, t) => Y.counts = { ...Y.counts, [e]: t };
async function Xl(e) {
  const t = Y.rows[e] || [], n = Math.max(0, ...t.map(an)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await ie.list(e, { limit: Le(e), since: n, after: s });
  if (wn(e, a.counts), !a.is_last_page) return Zl(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = _s(t.filter((i) => !o.has(i.id)), a.rows).concat(Ga(t, a.rows));
  return Y.rows[e] = r.sort(Va(e)), Y.paging.size[e] = Y.rows[e].length, Y.rows[e];
}
const En = /* @__PURE__ */ new Set();
async function Ql(e, t = !1) {
  e.forEach((n) => Pt.delete(n)), e.forEach((n) => Xn.add(n));
  try {
    await rc(e, t);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  } finally {
    e.forEach((n) => Qn.delete(n));
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
async function Zl(e) {
  const t = await ie.list(e, { limit: Re(e) });
  kn(e, t.counts), Ga(e, t);
}
async function Xl(e) {
  kn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ka = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ya(e) {
  const t = (K.rows[e] || []).filter((a) => es(a) && (e !== "plans" || !Ta(a))).map((a) => a.id);
========
async function ec(e) {
  const t = await ie.list(e, { limit: Le(e) });
  wn(e, t.counts), Ka(e, t);
}
async function tc(e) {
  wn(e, (await ie.list(e, { limit: 1, closed: !0 })).counts);
}
const Ya = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Ja(e) {
  const t = (Y.rows[e] || []).filter((a) => Qn(a) && (e !== "plans" || !Ba(a))).map((a) => a.id);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!t.length) return;
  const n = await ie.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  Y.rows[e] = (Y.rows[e] || []).map((a) => s.get(a.id) || a);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Ql = (e, t) => !jt.has(e) || t && (K.paging.size[e] || Re(e)) === Re(e) && !zl.has(e);
async function ec(e, t) {
  if (!Xe.has(e)) return Xl(e);
  const n = await (Ql(e, t) ? Zl(e) : Yl(e));
  return Ka.has(e) && await Ya(e), n;
}
async function tc() {
  const [e, t] = await Promise.all([ie.entries(0, ks), ie.settings()]);
  Xa([...Ot(Za(), []), ...e]), JSON.stringify(t) !== JSON.stringify(K.settings) && (K.settings = t);
}
const nc = (e, t) => ec(e, t).then(
  () => null,
  () => e
);
async function sc(e, t) {
  const n = (await Promise.all(e.map((s) => nc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), Pt.add(s))), t && await tc(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ja = 1e3, ac = 15e3;
let Vt = Ja;
async function oc() {
  return Mt || (Mt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !An.has(e)) || pt; ) {
      const e = pt, t = [...e ? Object.keys(K.rows) : Ke].filter((s) => Dt[s] && (Xe.has(s) || s in K.rows)).filter((s) => e || !Xe.has(s) || Pt.has(s) || !jt.has(s)).filter((s) => !An.has(s)), n = [...Ke].filter((s) => An.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), pt = !1;
      try {
        await Jl(t, e), Vt = Ja;
      } catch {
        pt = pt || e, await new Promise((a) => setTimeout(a, Vt)), Vt = Math.min(Vt * 2, ac);
========
const nc = (e, t) => !jt.has(e) || t && (Y.paging.size[e] || Le(e)) === Le(e) && !Yl.has(e);
async function sc(e, t) {
  if (!Xe.has(e)) return tc(e);
  const n = await (nc(e, t) ? ec(e) : Xl(e));
  return Ya.has(e) && await Ja(e), n;
}
async function ac() {
  const [e, t] = await Promise.all([ie.entries(0, bs), ie.settings()]);
  Qa([...Ot(Xa(), []), ...e]), JSON.stringify(t) !== JSON.stringify(Y.settings) && (Y.settings = t);
}
const oc = (e, t) => sc(e, t).then(
  () => null,
  () => e
);
async function rc(e, t) {
  const n = (await Promise.all(e.map((s) => oc(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ke.add(s), Pt.add(s))), t && await ac(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Za = 1e3, ic = 15e3;
let Vt = Za;
async function lc() {
  return _t || (_t = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ke].some((e) => !En.has(e)) || pt; ) {
      const e = pt, t = [...e ? Object.keys(Y.rows) : Ke].filter((s) => Dt[s] && (Xe.has(s) || s in Y.rows)).filter((s) => e || !Xe.has(s) || Pt.has(s) || !jt.has(s)).filter((s) => !En.has(s)), n = [...Ke].filter((s) => En.has(s));
      Ke.clear(), n.forEach((s) => Ke.add(s)), pt = !1;
      try {
        await Ql(t, e), Vt = Za;
      } catch {
        pt = pt || e, await new Promise((a) => setTimeout(a, Vt)), Vt = Math.min(Vt * 2, ic);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      }
    }
  })().finally(() => Mt = null), Mt);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function bn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Qn.has(n)).forEach((n) => {
    Ke.add(n), t && Pt.add(n);
  }), Ke.has("settings") && (pt = !0), oc();
}
const Za = () => {
========
function kn(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Xn.has(n)).forEach((n) => {
    Ke.add(n), t && Pt.add(n);
  }), Ke.has("settings") && (pt = !0), lc();
}
const Xa = () => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var e;
  return `typed-entries:${((e = Y.identity) == null ? void 0 : e.root) || location.host}:${ie.env()}`;
};
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Xa(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  K.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ks), gn(Za(), K.entries.slice(-50));
}
const rc = ["created", "updated", "deleted"], ic = { phases: ["phases", "plans"] }, ts = (e) => ic[e] || [e], lc = (e) => rc.includes(e.entry_type) ? [...ts(e.data.table), ...(e.data.joins || []).flatMap(ts)] : [];
function cc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of ts(t.data.table).filter((s) => K.rows[s]))
      K.rows[n] = K.rows[n].filter((s) => s.id !== t.data.id);
}
function uc(e) {
  Xa([...K.entries, ...e]), cc(e), bn([...new Set(e.flatMap(lc))].filter((t) => t && t !== "agents"));
}
Ji((e) => K.streamOpen || bn([e]));
const ns = [], dc = 2e3, Ge = /* @__PURE__ */ new Map(), hc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, fc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
========
function Qa(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  Y.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-bs), mn(Xa(), Y.entries.slice(-50));
}
const cc = ["created", "updated", "deleted"], uc = { phases: ["phases", "plans"] }, es = (e) => uc[e] || [e], dc = (e) => cc.includes(e.entry_type) ? [...es(e.data.table), ...(e.data.joins || []).flatMap(es)] : [];
function hc(e) {
  for (const t of e.filter((n) => n.entry_type === "deleted"))
    for (const n of es(t.data.table).filter((s) => Y.rows[s]))
      Y.rows[n] = Y.rows[n].filter((s) => s.id !== t.data.id);
}
function fc(e) {
  Qa([...Y.entries, ...e]), hc(e), kn([...new Set(e.flatMap(dc))].filter((t) => t && t !== "agents"));
}
Qi((e) => Y.streamOpen || kn([e]));
const ts = [], pc = 2e3, Ge = /* @__PURE__ */ new Map(), mc = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, gc = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
function ct(e, { first: t = !1 } = {}) {
  t ? ns.unshift(e) : ns.push(e), Ge.clear();
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Qa(e, t, n) {
  var a;
  const s = Va(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const pc = (e) => Va(e.table).find((t) => t.id === e.id) === e.row, mc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function gc(e, t) {
========
function eo(e, t, n) {
  var a;
  const s = za(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const vc = (e) => za(e.table).find((t) => t.id === e.id) === e.row, yc = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function wc(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of ns)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Tt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  return vc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function vc(e) {
  return e.split(fc).map((t, n) => n % 2 ? t : t.replace(hc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
========
  return kc(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function kc(e) {
  return e.split(gc).map((t, n) => n % 2 ? t : t.replace(mc, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
}
function Gs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function yc(e) {
  const [t, , ...n] = e, s = zs(t).map((o) => `<th>${Tt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${zs(o).map((r) => `<td>${Tt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function wc(e) {
========
function bc(e) {
  const [t, , ...n] = e, s = Gs(t).map((o) => `<th>${Tt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Gs(o).map((r) => `<td>${Tt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function $c(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Tt(a)}</li>`).join("")}</${s}>`;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Gs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function eo(e) {
========
const Ks = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function to(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = String(e || "").replace(/\r\n/g, `
`).split(`
`), n = [];
  let s = 0;
  for (; s < t.length; ) {
    const a = t[s];
    if (!a.trim()) {
      s += 1;
      continue;
    }
    if (/^(```|~~~)/.test(a)) {
      const i = t.findIndex((u, f) => f > s && /^(```|~~~)/.test(u)), c = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(s + 1, c).join(`
`)}</code></pre>`), s = c + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${Tt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ks(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      n.push(yc(t.slice(s, i))), s = i;
========
      n.push(bc(t.slice(s, i))), s = i;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      n.push(wc(t.slice(s, i))), s = i;
========
      n.push($c(t.slice(s, i))), s = i;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        `<blockquote>${eo(
========
        `<blockquote>${to(
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          t.slice(s, i).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ks(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Tt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const kc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, bc = (e) => e.kind !== "text" && !kc.test(e.html);
function $c(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(eo(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : bc(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ss(e, t = { env: "" }) {
  const n = mc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(pc))
    return Ge.set(n, s), s.html;
  const a = [], o = $c(gc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > dc && Ge.delete(Ge.keys().next().value), o;
}
const to = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, ln = (e) => String(e || "").replace(to, (t, n, s, a) => a), xc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), zt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Mc = /^Traceback \(most recent call last\):/m, _c = 8;
function no(e) {
========
const xc = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, _c = (e) => e.kind !== "text" && !xc.test(e.html);
function Mc(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(to(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : _c(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function ns(e, t = { env: "" }) {
  const n = yc(e, t), s = Ge.get(n);
  if (Ge.delete(n), s && s.reads.every(vc))
    return Ge.set(n, s), s.html;
  const a = [], o = Mc(wc(e, { ...t, reads: a }));
  return Ge.set(n, { html: o, reads: a }), Ge.size > pc && Ge.delete(Ge.keys().next().value), o;
}
const no = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, rn = (e) => String(e || "").replace(no, (t, n, s, a) => a), Sc = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), zt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Ec = /^Traceback \(most recent call last\):/m, Ac = 8;
function so(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Ac).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Sc(e) {
  const t = [...e.matchAll(xc)].map((s) => s.index);
========
function Cc(e) {
  const t = [...e.matchAll(Sc)].map((s) => s.index);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (zt.lastIndex = 0, !t.length || !zt.test(e)) return null;
  zt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(zt)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: no(n), tail: "" } : null;
}
function Ec(e) {
  const t = Mc.exec(e);
========
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: so(n), tail: "" } : null;
}
function Oc(e) {
  const t = Ec.exec(e);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  return { lead: e.slice(0, t.index), html: no([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = ln(e), n = Ec(t) || Sc(t);
========
  return { lead: e.slice(0, t.index), html: so([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = rn(e), n = Oc(t) || Cc(t);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const as = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Ac = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Cc = `${as} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Oc = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Tc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ks = {
  js: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Ac, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Cc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: as, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Oc, line: "#", quotes: ['"', "'"] },
========
const ss = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Tc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Bc = `${ss} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ic = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Rc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ys = {
  js: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Tc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Bc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ss, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ic, line: "#", quotes: ['"', "'"] },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  sql: { keywords: Tc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
========
  sql: { keywords: Rc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Js(e, t, n) {
  return n && e.startsWith(n, t);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Bc(e, t) {
  const n = Ks[t] || Ks.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
========
function Lc(e, t) {
  const n = Ys[t] || Ys.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  let o = 0;
  const r = (i, c) => c && a.push({ kind: i, value: c });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), f = e.slice(o, u < 0 ? e.length : u);
      r(
        /^#{1,6}\s/.test(f) ? "keyword" : /^(```|~~~)/.test(f) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(f) ? "number" : "plain",
        f
      ), r("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (Js(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Js(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), f = u < 0 ? e.length : u + n.block[1].length;
      r("comment", e.slice(o, f)), o = f;
      continue;
    }
    const c = (n.triple || []).find((u) => e.startsWith(u, o));
    if (c) {
      const u = e.indexOf(c, o + 3), f = u < 0 ? e.length : u + 3;
      r("string", e.slice(o, f)), o = f;
      continue;
    }
    if (n.quotes.includes(i)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== i && (i === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      r("string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      r("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const f = e.slice(o).match(/^[\w$]+/)[0], g = n.lower ? f.toLowerCase() : f, k = n.property && /^\s*:/.test(e.slice(o + f.length));
      r(s.has(g) ? "keyword" : k ? "property" : /^[A-Z]/.test(f) && t !== "text" ? "type" : "plain", f), o += f.length;
      continue;
    }
    if (/\d/.test(i)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      r("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (i === ">" || e.startsWith("/>", o))) {
      const u = i === ">" ? 1 : 2;
      r("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    r("plain", i), o += 1;
  }
  return a;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Ic(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Bc(e, t))
========
function Dc(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Lc(e, t))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? Ue(r) : `<span class="tok-${s}">${Ue(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
async function Rc(e) {
========
async function Nc(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Lc = 1500, Js = /* @__PURE__ */ new WeakMap();
async function Dc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Rc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Js.get(t)), Js.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Lc)
  )));
}
typeof document < "u" && document.addEventListener("click", Dc, !0);
const Nc = /^(```|~~~)\s*(\w+)?\s*$/, jc = /^\s{4,}\S/, Pc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, qc = /^\s*(?:[-*+]|\d+[.)])\s/, so = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Wc = [
========
const jc = 1500, Zs = /* @__PURE__ */ new WeakMap();
async function Pc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Nc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Zs.get(t)), Zs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, jc)
  )));
}
typeof document < "u" && document.addEventListener("click", Pc, !0);
const qc = /^(```|~~~)\s*(\w+)?\s*$/, Wc = /^\s{4,}\S/, Fc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Hc = /^\s*(?:[-*+]|\d+[.)])\s/, ao = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Uc = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function ao(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Fc(e) {
  const t = ao(e.join(`
`));
  return (Wc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Hc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && so.test(t) && !qc.test(t);
};
function Zs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Ic(ao(e.join(`
`)), t || Fc(e)).join(`
`)}</code></pre></div>` };
}
function Uc(e) {
========
function oo(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Vc(e) {
  const t = oo(e.join(`
`));
  return (Uc.find(([, n]) => n.test(t)) || ["text"])[0];
}
const zc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ao.test(t) && !Hc.test(t);
};
function Xs(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${Dc(oo(e.join(`
`)), t || Vc(e)).join(`
`)}</code></pre></div>` };
}
function Gc(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`
`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const r = t[o].match(Nc);
    if (r) {
      const c = t.findIndex((f, m) => m > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Zs(t.slice(o + 1, u).map(ln), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Hc(s) ? Pc : jc;
========
    const r = t[o].match(qc);
    if (r) {
      const c = t.findIndex((f, g) => g > o && f.trim().startsWith(r[1])), u = c < 0 ? t.length : c;
      a(), n.push(Xs(t.slice(o + 1, u).map(rn), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = zc(s) ? Fc : Wc;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    if (i.test(t[o])) {
      let c = o;
      for (; c < t.length && (i.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const u = [];
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      for (; s.length && s[s.length - 1].trim() && so.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Zs([...u, ...t.slice(o, c)].map(ln), "")), o = c;
========
      for (; s.length && s[s.length - 1].trim() && ao.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (c - o + u.length >= 2) {
        a(), n.push(Xs([...u, ...t.slice(o, c)].map(rn), "")), o = c;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
ct((e) => Uc(e));
const Vc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, zc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Gc(e) {
  const t = Vc.exec(e);
  if (t && at(t[1])) return { at: t.index, length: t[0].length, table: at(t[1]), id: Number(t[2]), label: t[3] };
  const n = zc.exec(e), s = n && at(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Kc(e, t, n, s) {
  const a = Qa(s, e, t), o = ln(a ? xi(a) : n);
========
ct((e) => Gc(e));
const Kc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Yc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Jc(e) {
  const t = Kc.exec(e);
  if (t && at(t[1])) return { at: t.index, length: t[0].length, table: at(t[1]), id: Number(t[2]), label: t[3] };
  const n = Yc.exec(e), s = n && at(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Zc(e, t, n, s) {
  const a = eo(s, e, t), o = rn(a ? Si(a) : n);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(Nt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = Gc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Kc(n.table, n.id, n.label, t) },
========
    const n = Jc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Zc(n.table, n.id, n.label, t) },
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Yc = /\.(png|jpe?g|gif|webp|svg)$/i, Jc = (e) => Yc.test(e), Zc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Xc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Qc(e, t) {
  const n = Zc.exec(e), [, s, a, o, r, i] = n || [], c = n && at(s || o), u = c && Qa(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), m = `${Nt(c).title} ${u.id} · ${Ue(i)}`, y = Jc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${y}<span class="file-card-name">${m}</span></a>` };
}
function eu(e) {
  const t = Xc.exec(e);
========
const Xc = /\.(png|jpe?g|gif|webp|svg)$/i, Qc = (e) => Xc.test(e), eu = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, tu = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function nu(e, t) {
  const n = eu.exec(e), [, s, a, o, r, i] = n || [], c = n && at(s || o), u = c && eo(t, c, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const f = ie.in(t.env).fileUrl(c, u.id, i), g = `${Nt(c).title} ${u.id} · ${Ue(i)}`, k = Qc(i) ? `<img class="file-card-image" src="${f}" alt="${Ue(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${f}" data-attached="${Ue(i)}">${k}<span class="file-card-name">${g}</span></a>` };
}
function su(e) {
  const t = tu.exec(e);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = Qc(e, t) || eu(e);
========
    const n = nu(e, t) || su(e);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const tu = /`([^`\n]+)`/g;
ct((e) => e.replace(tu, (t, n) => `<code>${n}</code>`));
const Xs = {
========
const au = /`([^`\n]+)`/g;
ct((e) => e.replace(au, (t, n) => `<code>${n}</code>`));
const Qs = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${vn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  (e, t) => e.replace(to, (n, s, a, o) => Xs[s] ? Xs[s](a, o, t) : o)
);
const nu = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, su = new RegExp(`\\b(${Ha}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), au = new RegExp(`\\b(${Ha}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), ou = (e, t) => `<a class="row-pill" href="#" data-peek="${at(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, ru = (e) => e.replace(au, (t, n, s) => s.replace(/\d+/g, (a) => ou(n.replace(/s$/i, ""), a))), iu = (e) => ru(e).replace(
  su,
========
  (e, t) => e.replace(no, (n, s, a, o) => Qs[s] ? Qs[s](a, o, t) : o)
);
const ou = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, ru = new RegExp(`\\b(${Ua}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), iu = new RegExp(`\\b(${Ua}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), lu = (e, t) => `<a class="row-pill" href="#" data-peek="${at(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, cu = (e) => e.replace(iu, (t, n, s) => s.replace(/\d+/g, (a) => lu(n.replace(/s$/i, ""), a))), uu = (e) => cu(e).replace(
  ru,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${at(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  (e, t) => t.rowNames === !1 ? e : e.split(nu).map((n, s) => s % 2 ? n : iu(n)).join("")
);
const lu = ["innerHTML"], cu = ["innerHTML"], uu = {
========
  (e, t) => t.rowNames === !1 ? e : e.split(ou).map((n, s) => s % 2 ? n : uu(n)).join("")
);
const du = ["innerHTML"], hu = ["innerHTML"], fu = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = C(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = ss(s, { env: Pe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (l(), d("span", {
      key: 0,
      class: "md inline",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      onClick: a[0] || (a[0] = (...o) => U(mt) && U(mt)(...o)),
      innerHTML: n.value
    }, null, 8, lu)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(mt) && U(mt)(...o)),
      innerHTML: n.value
    }, null, 8, cu));
  }
}, st = /* @__PURE__ */ J(uu, [["__scopeId", "data-v-1a43d211"]]), du = { class: "fact" }, hu = { class: "fact-label" }, fu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", du, [
      p("span", hu, w(e.label), 1),
      H(st, {
========
      onClick: a[0] || (a[0] = (...o) => G(mt) && G(mt)(...o)),
      innerHTML: n.value
    }, null, 8, du)) : (l(), d("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => G(mt) && G(mt)(...o)),
      innerHTML: n.value
    }, null, 8, hu));
  }
}, st = /* @__PURE__ */ J(fu, [["__scopeId", "data-v-1a43d211"]]), pu = { class: "fact" }, mu = { class: "fact-label" }, gu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", pu, [
      p("span", mu, w(e.label), 1),
      F(st, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, pu = /* @__PURE__ */ J(fu, [["__scopeId", "data-v-3a88ecf8"]]), mu = { class: "list" }, gu = { class: "list-label" }, vu = {
  key: 1,
  class: "list-note"
}, yu = {
========
}, vu = /* @__PURE__ */ J(gu, [["__scopeId", "data-v-3a88ecf8"]]), yu = { class: "list" }, wu = { class: "list-label" }, ku = {
  key: 1,
  class: "list-note"
}, bu = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), d("div", mu, [
      (l(!0), d(X, null, re(e.items, (o, r) => (l(), G(lt(o.open ? "button" : "div"), {
========
    return (s, a) => (l(), d("div", yu, [
      (l(!0), d(Q, null, oe(e.items, (o, r) => (l(), K(lt(o.open ? "button" : "div"), {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: r,
        type: o.open ? "button" : void 0,
        class: Q(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        default: z(() => [
          p("span", gu, w(o.label), 1),
          o.badge ? (l(), G(Oa, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : j("", !0),
          o.note ? (l(), d("span", vu, w(o.note), 1)) : j("", !0)
========
        default: U(() => [
          p("span", wu, w(o.label), 1),
          o.badge ? (l(), K(Ta, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : L("", !0),
          o.note ? (l(), d("span", ku, w(o.note), 1)) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, wu = /* @__PURE__ */ J(yu, [["__scopeId", "data-v-ebe2ae0a"]]), ku = { class: "table" }, bu = {
  key: 0,
  class: "table-row empty"
}, $u = {
========
}, $u = /* @__PURE__ */ J(bu, [["__scopeId", "data-v-ebe2ae0a"]]), xu = { class: "table" }, _u = {
  key: 0,
  class: "table-row empty"
}, Mu = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = e, s = t, a = O(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", ku, [
========
    const n = e, s = t, a = C(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (l(), d("div", xu, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      p("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (l(!0), d(Q, null, oe(e.columns, (i) => (l(), d("span", {
          key: i,
          class: "cell"
        }, w(i), 1))), 128))
      ], 4),
      (l(!0), d(Q, null, oe(e.rows, (i, c) => (l(), K(lt(i.open ? "button" : "div"), {
        key: c,
        type: i.open ? "button" : void 0,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        class: Q(["table-row", i.tone, { opens: i.open }]),
        style: be(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: z(() => [
          (l(!0), d(X, null, re(i.cells, (u, f) => (l(), d("span", {
========
        class: ee(["table-row", i.tone, { opens: i.open }]),
        style: $e(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: U(() => [
          (l(!0), d(Q, null, oe(i.cells, (u, f) => (l(), d("span", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: f,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      !e.rows.length && e.empty ? (l(), d("div", bu, w(e.empty), 1)) : j("", !0)
    ]));
  }
}, xu = /* @__PURE__ */ J($u, [["__scopeId", "data-v-9326a52e"]]), Mu = { class: "stat-value" }, _u = { class: "stat-label" }, Su = {
  key: 0,
  class: "stat-note"
}, Eu = {
========
      !e.rows.length && e.empty ? (l(), d("div", _u, w(e.empty), 1)) : L("", !0)
    ]));
  }
}, Su = /* @__PURE__ */ J(Mu, [["__scopeId", "data-v-9326a52e"]]), Eu = { class: "stat-value" }, Au = { class: "stat-label" }, Cu = {
  key: 0,
  class: "stat-note"
}, Ou = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "StatTile",
  props: {
    label: { type: String, required: !0 },
    value: { type: [String, Number], required: !0 },
    note: { type: String, default: "" },
    tone: { type: String, default: "" },
    opens: Boolean
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(lt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Q(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      default: z(() => [
        p("span", Mu, w(e.value), 1),
        p("span", _u, w(e.label), 1),
        e.note ? (l(), d("span", Su, w(e.note), 1)) : j("", !0)
========
      default: U(() => [
        p("span", Eu, w(e.value), 1),
        p("span", Au, w(e.label), 1),
        e.note ? (l(), d("span", Cu, w(e.note), 1)) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Au = /* @__PURE__ */ J(Eu, [["__scopeId", "data-v-ad0db6d6"]]), Cu = { class: "code" }, Ou = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
========
}, Tu = /* @__PURE__ */ J(Ou, [["__scopeId", "data-v-ad0db6d6"]]), Bu = { class: "code" }, Iu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (l(), K(vs, {
      value: e.node.type
    }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      stack: z(() => [
        H(Zt, {
========
      stack: U(() => [
        F(Zt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      row: z(() => [
        H(Zt, {
========
      row: U(() => [
        F(Zt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      grid: z(() => [
        H(Zt, {
========
      grid: U(() => [
        F(Zt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      card: z(() => [
        H(ki, {
========
      card: U(() => [
        F(xi, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      heading: z(() => [
========
      heading: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("h3", {
          class: Q(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      divider: z(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: z(() => [
        H(Au, {
========
      divider: U(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: U(() => [
        F(Tu, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      bars: z(() => [
        H(pi, {
========
      bars: U(() => [
        F(vi, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      table: z(() => [
        H(xu, {
========
      table: U(() => [
        F(Su, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      list: z(() => [
        H(wu, {
========
      list: U(() => [
        F($u, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      text: z(() => [
        H(st, {
========
      text: U(() => [
        F(st, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      fact: z(() => [
        H(pu, {
========
      fact: U(() => [
        F(vu, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      badge: z(() => [
        H(Oa, {
========
      badge: U(() => [
        F(Ta, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      code: z(() => [
        p("pre", Cu, [
          p("code", null, w(e.node.text), 1)
        ])
      ]),
      file: z(() => [
========
      code: U(() => [
        p("pre", Bu, [
          p("code", null, w(e.node.text), 1)
        ])
      ]),
      file: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}), oo = /* @__PURE__ */ J(Ou, [["__scopeId", "data-v-cbdcf540"]]), Tu = { class: "dashboard" }, Bu = { class: "trail" }, Iu = ["onClick"], Ru = {
  key: 0,
  class: "gone",
  role: "status"
}, Lu = {
========
}), ro = /* @__PURE__ */ J(Iu, [["__scopeId", "data-v-cbdcf540"]]), Ru = { class: "dashboard" }, Lu = { class: "trail" }, Du = ["onClick"], Nu = {
  key: 0,
  class: "gone",
  role: "status"
}, ju = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (k) => k in (n.document.pages || {}), o = j(!!n.page && !a(n.page)), r = j(n.page && !o.value ? [n.page] : []), i = C(() => r.value.at(-1) || n.document.start), c = C(() => (n.document.pages || {})[i.value] || null), u = (k) => ((n.document.pages || {})[k] || {}).title || k, f = (k) => {
      o.value = !1, r.value = [...r.value, k];
    }, g = (k) => {
      o.value = !1, r.value = r.value.slice(0, k);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    ), (y, x) => (l(), d("div", Tu, [
      e.document.broken ? (l(), G(nn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: z(() => [
          he(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), G(nn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: z(() => [
          he(w(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(X, { key: 2 }, [
        p("nav", Bu, [
          p("button", {
            type: "button",
            class: Q(["step", { current: !r.value.length }]),
            onClick: x[0] || (x[0] = (P) => m(0))
          }, w(u(e.document.start)), 3),
          (l(!0), d(X, null, re(r.value, (P, M) => (l(), d(X, {
            key: `${M}-${P}`
========
    ), (k, _) => (l(), d("div", Ru, [
      e.document.broken ? (l(), K(tn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: U(() => [
          ue(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (l(), K(tn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: U(() => [
          ue(w(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (l(), d(Q, { key: 2 }, [
        p("nav", Lu, [
          p("button", {
            type: "button",
            class: ee(["step", { current: !r.value.length }]),
            onClick: _[0] || (_[0] = (D) => g(0))
          }, w(u(e.document.start)), 3),
          (l(!0), d(Q, null, oe(r.value, (D, P) => (l(), d(Q, {
            key: `${P}-${D}`
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }, [
            _[2] || (_[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              class: Q(["step", { current: M === r.value.length - 1 }]),
              onClick: (b) => m(M + 1)
            }, w(u(P)), 11, Iu)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Ru, "What you opened is no longer in this dashboard. Here is its start page.")) : j("", !0),
        H(Rt, {
          name: "page",
          mode: "out-in"
        }, {
          default: z(() => [
========
              class: ee(["step", { current: P === r.value.length - 1 }]),
              onClick: (b) => g(P + 1)
            }, w(u(D)), 11, Du)
          ], 64))), 128))
        ]),
        o.value ? (l(), d("p", Nu, "What you opened is no longer in this dashboard. Here is its start page.")) : L("", !0),
        F(Rt, {
          name: "page",
          mode: "out-in"
        }, {
          default: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            (l(), d("div", {
              key: i.value,
              class: "page"
            }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              H(oo, {
========
              F(ro, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                node: c.value.view,
                onOpen: f,
                onFile: _[1] || (_[1] = (D) => s("file", D))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : L("", !0)
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Bv = /* @__PURE__ */ J(Lu, [["__scopeId", "data-v-fbe83734"]]);
function Du(e, t, n, s = () => window) {
========
}, Hv = /* @__PURE__ */ J(ju, [["__scopeId", "data-v-fbe83734"]]);
function Pu(e, t, n, s = () => window) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  De(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ce(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Nu = (e, t = () => !0) => Du("keydown", (n) => n.key === "Escape" && t() && e());
function ju(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = q(!1), a = O(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Nu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Pu = 80, ht = ms([]);
function qu(e) {
========
const qu = (e, t = () => !0) => Pu("keydown", (n) => n.key === "Escape" && t() && e());
function Wu(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = j(!1), a = C(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return qu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Fu = 80, ht = gs([]);
function Hu(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ), Ae(n), O(() => Pu + Math.max(0, ht.indexOf(t)));
}
let ro = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ro = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
========
  ), Ce(n), C(() => Fu + Math.max(0, ht.indexOf(t)));
}
let io = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return io = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
}, {
  capture: !0,
  passive: !0
});
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Wu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Fu(e, t, n = e) {
========
const Uu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Vu(e, t, n = e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const r = [...e.value.querySelectorAll(Wu)];
========
    const r = [...e.value.querySelectorAll(Uu)];
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    if (!r.length) return o.preventDefault();
    const [i, c] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  De(() => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : ro, document.addEventListener("keydown", a), Lt(() => {
========
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : io, document.addEventListener("keydown", a), Lt(() => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ce(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Hu = ["aria-modal", "aria-label", "aria-labelledby"], Uu = {
  key: 0,
  class: "dialog-head"
}, Vu = ["id", "tabindex"], zu = {
  key: 1,
  class: "dialog-foot"
}, Gu = 500, Ku = 400, Yu = {
========
const zu = ["aria-modal", "aria-label", "aria-labelledby"], Gu = {
  key: 0,
  class: "dialog-head"
}, Ku = ["id", "tabindex"], Yu = {
  key: 1,
  class: "dialog-foot"
}, Ju = 500, Zu = 400, Xu = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Dialog",
  props: {
    title: { type: String, default: "" },
    follow: { type: Boolean, default: !1 },
    fits: Boolean,
    wide: Boolean,
    small: Boolean,
    tall: Boolean,
    large: Boolean,
    bare: Boolean,
    open: { type: Boolean, default: null },
    closable: { type: Boolean, default: !0 },
    modal: Boolean,
    sheet: Boolean
  },
  emits: ["close", "dismiss", "escape"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = e, s = t, { visible: a, close: o, closed: r } = ju(s, n), i = qu(a), c = q(null), u = q(null), f = q(null), m = wa(), y = q(!1), x = Date.now();
    n.modal && Fu(u, () => s("escape"), f);
    function P() {
      if (!n.modal) return n.closable && o();
      y.value = !0, setTimeout(() => y.value = !1, Ku);
    }
    function M(I) {
      !n.modal || Date.now() - x >= Gu || ![" ", "Enter"].includes(I.key) || (I.preventDefault(), I.stopPropagation());
    }
    const b = () => c.value && (c.value.scrollTop = c.value.scrollHeight), A = new MutationObserver(b);
    return ke(c, (I) => {
      A.disconnect(), I && n.follow && (A.observe(I, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), Ae(() => A.disconnect()), (I, ee) => (l(), G(ka, { to: "body" }, [
      H(Rt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: z(() => [
          U(a) ? (l(), d("div", {
            key: 0,
            class: Q(["dialog", { large: e.large, sheet: e.sheet }]),
            style: be({ zIndex: U(i) }),
            onClick: _e(P, ["self"])
========
    const n = e, s = t, { visible: a, close: o, closed: r } = Wu(s, n), i = Hu(a), c = j(null), u = j(null), f = j(null), g = ka(), k = j(!1), _ = Date.now();
    n.modal && Vu(u, () => s("escape"), f);
    function D() {
      if (!n.modal) return n.closable && o();
      k.value = !0, setTimeout(() => k.value = !1, Zu);
    }
    function P(H) {
      !n.modal || Date.now() - _ >= Ju || ![" ", "Enter"].includes(H.key) || (H.preventDefault(), H.stopPropagation());
    }
    const b = () => c.value && (c.value.scrollTop = c.value.scrollHeight), E = new MutationObserver(b);
    return ke(c, (H) => {
      E.disconnect(), H && n.follow && (E.observe(H, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), Ce(() => E.disconnect()), (H, V) => (l(), K(ba, { to: "body" }, [
      F(Rt, {
        name: "dialog",
        appear: "",
        onAfterLeave: G(r)
      }, {
        default: U(() => [
          G(a) ? (l(), d("div", {
            key: 0,
            class: ee(["dialog", { large: e.large, sheet: e.sheet }]),
            style: $e({ zIndex: G(i) }),
            onClick: Me(D, ["self"])
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              class: Q(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: y.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(m) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? j("", !0) : (l(), d("header", Uu, [
                p("h3", {
                  id: U(m),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Vu),
                e.closable ? (l(), G(ys, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : j("", !0)
========
              class: ee(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: k.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? G(g) : void 0,
              onKeydownCapture: P
            }, [
              e.bare ? L("", !0) : (l(), d("header", Gu, [
                p("h3", {
                  id: G(g),
                  ref_key: "heading",
                  ref: f,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Ku),
                e.closable ? (l(), K(ws, {
                  key: 0,
                  onClick: G(o)
                }, null, 8, ["onClick"])) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: Q(["dialog-body", { bare: e.bare }])
              }, [
                ye(H.$slots, "default", {}, void 0, !0)
              ], 2),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              I.$slots.foot ? (l(), d("footer", zu, [
                we(I.$slots, "foot", {}, void 0, !0)
              ])) : j("", !0)
            ], 42, Hu)
          ], 6)) : j("", !0)
========
              H.$slots.foot ? (l(), d("footer", Yu, [
                ye(H.$slots, "foot", {}, void 0, !0)
              ])) : L("", !0)
            ], 42, zu)
          ], 6)) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Ju = /* @__PURE__ */ J(Yu, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ie = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Be = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Zu = 6;
function _s(e, t) {
========
}, Qu = /* @__PURE__ */ J(Xu, [["__scopeId", "data-v-6d1ecd98"]]), ze = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Re = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ie = { across: 48, down: 110, margin: 32, labelSpace: 14 }, ed = 6;
function Ss(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Xu = (e) => {
  const t = _s(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function Qu(e, t, n) {
========
const td = (e) => {
  const t = Ss(e, ze.lineChars), n = Math.max(ze.minWidth, Math.max(...t.map((s) => s.length)) * ze.charWidth + ze.padX * 2);
  return { name: e, lines: t, line: ze.line, padY: ze.padY, width: n, height: t.length * ze.line + ze.padY * 2 };
};
function nd(e, t, n) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, c) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(c) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function ed(e, t) {
========
function sd(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function td(e, t, n) {
========
function ad(e, t, n) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, c) => [i, c]))), o = (r, i) => {
    const c = a(), u = (f) => {
      const g = i(f).map((k) => c.get(k));
      return g.length ? g.reduce((k, _) => k + _, 0) / g.length : c.get(f);
    };
    return [...r].sort((f, g) => u(f) - u(g));
  };
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  for (let r = 0; r < Zu; r++) {
========
  for (let r = 0; r < ed; r++) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    const i = r % 2 === 0, c = s.map((u, f) => f);
    (i ? c.slice(1) : c.slice(0, -1).reverse()).forEach((u) => {
      const f = (g) => t.filter((k) => k[i ? 1 : 0] === g).map((k) => k[i ? 0 : 1]);
      s[u] = o(s[u], f);
    });
  }
  return s;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function nd(e, t) {
========
function od(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = /* @__PURE__ */ new Map(), s = (a, o, r, i) => {
    const c = `${a[o]}:${r}`;
    (n.get(c) || n.set(c, []).get(c)).push({ arrow: a, end: o, other: i });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, r) => t.get(o.other).x - t.get(r.other).x), a.forEach(({ arrow: o, end: r }, i) => o[`${r}Share`] = (i + 1) / (a.length + 1));
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function sd(e) {
  const t = [...new Set(e.flatMap(([k, v]) => [k, v]))], n = new Set(e.map(([, k]) => k)), s = t.filter((k) => !n.has(k)), a = Qu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((k, v) => !a.has(v)), r = ed(t, o), i = td(t, o, r), c = new Map(t.map((k) => [k, Xu(k)])), u = i.map((k) => k.reduce((v, D) => v + c.get(D).width, 0) + Be.across * (k.length - 1)), f = Math.max(...u) + Be.margin * 2, m = od(e, r, i.length), y = /* @__PURE__ */ new Map();
  let x = Be.margin;
  i.forEach((k, v) => {
    let D = (f - u[v]) / 2;
    const T = Math.max(...k.map((W) => c.get(W).height));
    k.forEach((W) => {
      const $ = c.get(W);
      y.set(W, { ...$, x: D, y: x + (T - $.height) / 2 }), D += $.width + Be.across;
    }), x += T + (m[v] ?? Be.down);
  });
  const P = e.map(([k, v, D], T) => ({ from: k, to: v, label: D || "", back: a.has(T) || r.get(v) <= r.get(k) }));
  nd(P, y);
  const M = P.map((k) => rd(k, y.get(k.from), y.get(k.to))), b = [...y.values()], A = ud(M, b), I = Math.max(x - Be.down, ...A.filter((k) => k.label).map((k) => k.label.y + k.label.height));
  return { width: Math.max(f - Be.margin, ...A.filter((k) => k.label).map((k) => k.label.x + k.label.width)) + Be.margin, height: I + Be.margin, nodes: b, arrows: A };
}
const ad = (e) => e ? _s(e, Ie.lineChars).length * Ie.line + Ie.pad * 2 : 0;
function od(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Be.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += ad(r) + Be.labelSpace);
  }), s.map((a) => Math.max(Be.down, a));
}
function rd(e, t, n) {
  const s = e.label ? _s(e.label, Ie.lineChars) : [], a = s.length ? Math.max(...s.map((y) => y.length)) * Ie.charWidth + Ie.pad * 2 : 0, o = s.length * Ie.line + (s.length ? Ie.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, m = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const id = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, ld = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], cd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ie.line);
function ud(e, t) {
========
function rd(e) {
  const t = [...new Set(e.flatMap(([y, m]) => [y, m]))], n = new Set(e.map(([, y]) => y)), s = t.filter((y) => !n.has(y)), a = nd(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((y, m) => !a.has(m)), r = sd(t, o), i = ad(t, o, r), c = new Map(t.map((y) => [y, td(y)])), u = i.map((y) => y.reduce((m, I) => m + c.get(I).width, 0) + Ie.across * (y.length - 1)), f = Math.max(...u) + Ie.margin * 2, g = ld(e, r, i.length), k = /* @__PURE__ */ new Map();
  let _ = Ie.margin;
  i.forEach((y, m) => {
    let I = (f - u[m]) / 2;
    const O = Math.max(...y.map((q) => c.get(q).height));
    y.forEach((q) => {
      const $ = c.get(q);
      k.set(q, { ...$, x: I, y: _ + (O - $.height) / 2 }), I += $.width + Ie.across;
    }), _ += O + (g[m] ?? Ie.down);
  });
  const D = e.map(([y, m, I], O) => ({ from: y, to: m, label: I || "", back: a.has(O) || r.get(m) <= r.get(y) }));
  od(D, k);
  const P = D.map((y) => cd(y, k.get(y.from), k.get(y.to))), b = [...k.values()], E = fd(P, b), H = Math.max(_ - Ie.down, ...E.filter((y) => y.label).map((y) => y.label.y + y.label.height));
  return { width: Math.max(f - Ie.margin, ...E.filter((y) => y.label).map((y) => y.label.x + y.label.width)) + Ie.margin, height: H + Ie.margin, nodes: b, arrows: E };
}
const id = (e) => e ? Ss(e, Re.lineChars).length * Re.line + Re.pad * 2 : 0;
function ld(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Ie.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, c] = [t.get(a), t.get(o)].sort((u, f) => u - f);
    c > i && (s[i + Math.floor((c - i - 1) / 2)] += id(r) + Ie.labelSpace);
  }), s.map((a) => Math.max(Ie.down, a));
}
function cd(e, t, n) {
  const s = e.label ? Ss(e.label, Re.lineChars) : [], a = s.length ? Math.max(...s.map((k) => k.length)) * Re.charWidth + Re.pad * 2 : 0, o = s.length * Re.line + (s.length ? Re.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, f = (u - i) / 2, g = [{ x: r, y: i }, { x: r, y: i + f }, { x: c, y: u - f }, { x: c, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: g, path: `M${r} ${i} C${r} ${i + f} ${c} ${u - f} ${c} ${u}` };
}
const ud = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, dd = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], hd = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Re.line);
function fd(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, u) => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      const f = id(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = cd.flatMap((c) => ld.map((u) => a(u, c))).find((c) => !n.some((u) => Qs(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => Qs(i, c)); ) i.y += Ie.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Ie.line, pad: Ie.pad } };
  });
}
const Qs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, dd = { class: "flowchart-tools" }, hd = ["width", "height", "viewBox", "aria-label"], fd = ["d"], pd = ["x", "y", "width", "height"], md = ["x", "y"], gd = ["x", "dy"], vd = {
  key: 0,
  class: "flowchart-label"
}, yd = ["x", "y", "width", "height"], wd = ["x", "y"], kd = ["x", "dy"], bd = {
========
      const f = ud(s.curve, c);
      return { x: f.x - s.labelWidth / 2, y: f.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = hd.flatMap((c) => dd.map((u) => a(u, c))).find((c) => !n.some((u) => ea(c, u))) ?? a(0.5, 0);
    for (; n.some((c) => ea(i, c)); ) i.y += Re.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: Re.line, pad: Re.pad } };
  });
}
const ea = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, pd = { class: "flowchart-tools" }, md = ["width", "height", "viewBox", "aria-label"], gd = ["d"], vd = ["x", "y", "width", "height"], yd = ["x", "y"], wd = ["x", "dy"], kd = {
  key: 0,
  class: "flowchart-label"
}, bd = ["x", "y", "width", "height"], $d = ["x", "y"], xd = ["x", "dy"], _d = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = e, s = t, a = O(() => sd(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = q(null), i = q({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var A;
      const M = (A = r.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const b = Math.min(M.width / a.value.width, M.height / a.value.height, 1.5);
      i.value = { zoom: b, x: (M.width - a.value.width * b) / 2, y: (M.height - a.value.height * b) / 2 };
    }
    function f(M, b, A) {
      const { zoom: I, x: ee, y: k } = i.value, v = Math.min(o.most, Math.max(o.least, I * M));
      i.value = { zoom: v, x: b - (b - ee) * v / I, y: A - (A - k) * v / I };
    }
    function m(M) {
      const b = r.value.getBoundingClientRect();
      f(M, b.width / 2, b.height / 2);
    }
    function y(M) {
      const b = r.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? f(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - b.left, M.clientY - b.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function x(M) {
      var b, A, I;
      M.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), c = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (I = (A = r.value).setPointerCapture) == null || I.call(A, M.pointerId);
    }
    function P(M) {
      c && (i.value = { ...i.value, x: M.clientX - c.x, y: M.clientY - c.y });
    }
    return De(u), (M, b) => (l(), G(Ju, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (A) => s("close"))
    }, {
      default: z(() => [
        p("div", dd, [
          H(ye, {
            small: "",
            onClick: b[0] || (b[0] = (A) => m(o.step))
          }, {
            default: z(() => [...b[5] || (b[5] = [
              he("Zoom in", -1)
========
    const n = e, s = t, a = C(() => rd(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = j(null), i = j({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function u() {
      var E;
      const P = (E = r.value) == null ? void 0 : E.getBoundingClientRect();
      if (!(P != null && P.width)) return;
      const b = Math.min(P.width / a.value.width, P.height / a.value.height, 1.5);
      i.value = { zoom: b, x: (P.width - a.value.width * b) / 2, y: (P.height - a.value.height * b) / 2 };
    }
    function f(P, b, E) {
      const { zoom: H, x: V, y } = i.value, m = Math.min(o.most, Math.max(o.least, H * P));
      i.value = { zoom: m, x: b - (b - V) * m / H, y: E - (E - y) * m / H };
    }
    function g(P) {
      const b = r.value.getBoundingClientRect();
      f(P, b.width / 2, b.height / 2);
    }
    function k(P) {
      const b = r.value.getBoundingClientRect();
      P.ctrlKey || P.metaKey ? f(P.deltaY < 0 ? o.step : 1 / o.step, P.clientX - b.left, P.clientY - b.top) : i.value = { ...i.value, x: i.value.x - P.deltaX, y: i.value.y - P.deltaY };
    }
    function _(P) {
      var b, E, H;
      P.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), c = { x: P.clientX - i.value.x, y: P.clientY - i.value.y }, (H = (E = r.value).setPointerCapture) == null || H.call(E, P.pointerId);
    }
    function D(P) {
      c && (i.value = { ...i.value, x: P.clientX - c.x, y: P.clientY - c.y });
    }
    return De(u), (P, b) => (l(), K(Qu, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (E) => s("close"))
    }, {
      default: U(() => [
        p("div", pd, [
          F(we, {
            small: "",
            onClick: b[0] || (b[0] = (E) => g(o.step))
          }, {
            default: U(() => [...b[5] || (b[5] = [
              ue("Zoom in", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])]),
            _: 1
          }),
          F(we, {
            small: "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: b[1] || (b[1] = (A) => m(1 / o.step))
          }, {
            default: z(() => [...b[6] || (b[6] = [
              he("Zoom out", -1)
========
            onClick: b[1] || (b[1] = (E) => g(1 / o.step))
          }, {
            default: U(() => [...b[6] || (b[6] = [
              ue("Zoom out", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])]),
            _: 1
          }),
          F(we, {
            small: "",
            onClick: u
          }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            default: z(() => [...b[7] || (b[7] = [
              he("Fit the whole chart", -1)
========
            default: U(() => [...b[7] || (b[7] = [
              ue("Fit the whole chart", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          onWheel: _e(y, ["prevent"]),
          onPointerdown: x,
          onPointermove: P,
          onPointerup: b[2] || (b[2] = (A) => Bs(c) ? c.value = null : c = null),
          onPointercancel: b[3] || (b[3] = (A) => Bs(c) ? c.value = null : c = null)
========
          onWheel: Me(k, ["prevent"]),
          onPointerdown: _,
          onPointermove: D,
          onPointerup: b[2] || (b[2] = (E) => Is(c) ? c.value = null : c = null),
          onPointercancel: b[3] || (b[3] = (E) => Is(c) ? c.value = null : c = null)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        }, [
          (l(), d("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: $e({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            b[8] || (b[8] = p("defs", null, [
              p("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                p("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (l(!0), d(Q, null, oe(a.value.arrows, (E, H) => (l(), d("path", {
              key: `arrow-${H}`,
              class: "flowchart-arrow",
              d: E.path,
              "marker-end": "url(#flowchart-head)"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            }, null, 8, fd))), 128)),
            (l(!0), d(X, null, re(a.value.nodes, (A) => (l(), d("g", {
              key: A.name,
========
            }, null, 8, gd))), 128)),
            (l(!0), d(Q, null, oe(a.value.nodes, (E) => (l(), d("g", {
              key: E.name,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              class: "flowchart-node"
            }, [
              p("rect", {
                x: E.x,
                y: E.y,
                width: E.width,
                height: E.height,
                rx: "8"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              }, null, 8, pd),
========
              }, null, 8, vd),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              p("text", {
                x: E.x + E.width / 2,
                y: E.y + E.padY + E.line / 2
              }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                (l(!0), d(X, null, re(A.lines, (I, ee) => (l(), d("tspan", {
                  key: ee,
                  x: A.x + A.width / 2,
                  dy: ee ? A.line : 0
                }, w(I), 9, gd))), 128))
              ], 8, md)
========
                (l(!0), d(Q, null, oe(E.lines, (H, V) => (l(), d("tspan", {
                  key: V,
                  x: E.x + E.width / 2,
                  dy: V ? E.line : 0
                }, w(H), 9, wd))), 128))
              ], 8, yd)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ]))), 128)),
            (l(!0), d(Q, null, oe(a.value.arrows, (E, H) => (l(), d(Q, {
              key: `label-${H}`
            }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              A.label ? (l(), d("g", vd, [
========
              E.label ? (l(), d("g", kd, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("rect", {
                  x: E.label.x,
                  y: E.label.y,
                  width: E.label.width,
                  height: E.label.height,
                  rx: "4"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                }, null, 8, yd),
========
                }, null, 8, bd),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("text", {
                  x: E.label.x + E.label.width / 2,
                  y: E.label.y + E.label.pad + E.label.line / 2
                }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                  (l(!0), d(X, null, re(A.label.lines, (ee, k) => (l(), d("tspan", {
                    key: k,
                    x: A.label.x + A.label.width / 2,
                    dy: k ? A.label.line : 0
                  }, w(ee), 9, kd))), 128))
                ], 8, wd)
              ])) : j("", !0)
            ], 64))), 128))
          ], 12, hd))
========
                  (l(!0), d(Q, null, oe(E.label.lines, (V, y) => (l(), d("tspan", {
                    key: y,
                    x: E.label.x + E.label.width / 2,
                    dy: y ? E.label.line : 0
                  }, w(V), 9, xd))), 128))
                ], 8, $d)
              ])) : L("", !0)
            ], 64))), 128))
          ], 12, md))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, $d = /* @__PURE__ */ J(bd, [["__scopeId", "data-v-51d24cfe"]]), ea = {
========
}, Md = /* @__PURE__ */ J(_d, [["__scopeId", "data-v-51d24cfe"]]), ta = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  words: '<rect x="2.5" y="3" width="11" height="8" rx="2"/><polyline points="5,11 5,13.5 8,11"/>',
  summary: '<line x1="3" y1="4.5" x2="13" y2="4.5"/><line x1="3" y1="8" x2="11" y2="8"/><line x1="3" y1="11.5" x2="8" y2="11.5"/>',
  fault: '<polygon points="8,2.5 14,13 2,13"/><line x1="8" y1="6.5" x2="8" y2="9.3"/><circle class="f" cx="8" cy="11.2" r=".75"/>',
  visitor: '<circle cx="6.5" cy="5.5" r="2.3"/><path d="M2.5 13.5c0-2.3 1.8-3.8 4-3.8s4 1.5 4 3.8"/><line x1="12" y1="4" x2="14" y2="4"/><line x1="12" y1="6.5" x2="14" y2="6.5"/>',
  flowchart: '<rect x="5.5" y="2" width="5" height="3.5" rx="1"/><rect x="1.5" y="10.5" width="5" height="3.5" rx="1"/><rect x="9.5" y="10.5" width="5" height="3.5" rx="1"/><polyline points="8,5.5 8,8 4,8 4,10.5"/><polyline points="8,8 12,8 12,10.5"/>',
  skill: '<rect x="3" y="2.5" width="10" height="11" rx="1.5"/><line x1="6" y1="2.5" x2="6" y2="13.5"/>',
  compact: '<polyline points="5,2.5 8,5.5 11,2.5"/><polyline points="5,13.5 8,10.5 11,13.5"/><line x1="2.5" y1="8" x2="13.5" y2="8"/>',
  rule: '<path d="M4 13.5V6.5a4 4 0 0 1 8 0v7z"/><line x1="6.3" y1="7.6" x2="9.7" y2="7.6"/><line x1="6.3" y1="10.3" x2="9.7" y2="10.3"/>',
  fact: '<circle cx="8" cy="6" r="3.2"/><line x1="8" y1="9.2" x2="8" y2="14"/>',
  reminder: '<path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.2H3z"/><line x1="6.8" y1="14.2" x2="9.2" y2="14.2"/>',
  ack: '<path d="M4 11V7.5a4 4 0 0 1 8 0V11l1 1.2H3z"/><polyline points="6.2,7.8 7.6,9.2 10,6.6"/>',
  task: '<rect x="3" y="3" width="10" height="10" rx="2"/>',
  task_start: '<rect x="3" y="3" width="10" height="10" rx="2"/><polygon class="f" points="6.8,5.8 10.4,8 6.8,10.2"/>',
  task_done: '<rect x="3" y="3" width="10" height="10" rx="2"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  task_pause: '<rect x="3" y="3" width="10" height="10" rx="2"/><line x1="6.8" y1="6" x2="6.8" y2="10"/><line x1="9.2" y1="6" x2="9.2" y2="10"/>',
  task_block: '<rect x="3" y="3" width="10" height="10" rx="2"/><line x1="5.6" y1="8" x2="10.4" y2="8"/>',
  stuck: '<circle cx="8" cy="8" r="5.5"/><line x1="4.2" y1="11.8" x2="11.8" y2="4.2"/>',
  request: '<path d="M2.5 9l1.8-5.5h7.4L13.5 9v3.5h-11z"/><polyline points="2.5,9 6,9 6.8,10.5 9.2,10.5 10,9 13.5,9"/>',
  filed: '<polyline points="2.5,10 2.5,13 13.5,13 13.5,10"/><line x1="8" y1="2.5" x2="8" y2="9.5"/><polyline points="5.5,7 8,9.5 10.5,7"/>',
  question: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.6a1.7 1.7 0 1 1 2.4 1.5c-.5.3-.8.6-.8 1.2"/><circle class="f" cx="8" cy="11.1" r=".7"/>',
  answered: '<circle cx="8" cy="8" r="5.5"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  sequence: '<circle cx="4" cy="4" r="1.3"/><circle cx="4" cy="8" r="1.3"/><circle cx="4" cy="12" r="1.3"/><line x1="7" y1="4" x2="13" y2="4"/><line x1="7" y1="8" x2="13" y2="8"/><line x1="7" y1="12" x2="11" y2="12"/>',
  step: '<polyline points="6,4 10,8 6,12"/>',
  worker: '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>',
  subagent: '<circle cx="6.5" cy="6" r="2.2"/><path d="M2.5 13.5c0-2.4 1.8-4 4-4s4 1.6 4 4"/><circle cx="12" cy="4" r="1.4"/>',
  send: '<line x1="2.5" y1="8" x2="13" y2="8"/><polyline points="9,4 13,8 9,12"/>',
  receive: '<line x1="13.5" y1="8" x2="3" y2="8"/><polyline points="7,4 3,8 7,12"/>',
  report: '<rect x="3.5" y="2.5" width="9" height="11" rx="1.5"/><line x1="6" y1="6" x2="10" y2="6"/><line x1="6" y1="8.5" x2="10" y2="8.5"/><line x1="6" y1="11" x2="8.5" y2="11"/>',
  document: '<path d="M4 2.5h5.5l3 3v8h-8.5z"/><polyline points="9.5,2.5 9.5,5.5 12.5,5.5"/>',
  fitness: '<polyline points="2,9 5,9 6.5,5 9,12 10.5,8 14,8"/>',
  worker_step: '<path d="M12.5 6.5A5 5 0 0 0 3.6 6.6"/><polyline points="3.2,3.8 3.6,6.6 6.3,6.2"/><path d="M3.5 9.5a5 5 0 0 0 8.9-.1"/><polyline points="12.8,12.2 12.4,9.4 9.7,9.8"/>',
  trigger: '<polygon points="9,2 4,9 8,9 7,14 12,7 8,7"/>',
  check: '<circle cx="8" cy="8" r="5.5"/><polyline points="5.6,8.1 7.3,9.8 10.4,6.3"/>',
  check_fail: '<circle cx="8" cy="8" r="5.5"/><line x1="6" y1="6" x2="10" y2="10"/><line x1="10" y1="6" x2="6" y2="10"/>',
  terminal: '<rect x="2" y="3" width="12" height="10" rx="2"/><polyline points="5,6.5 7,8 5,9.5"/><line x1="8.5" y1="10" x2="11" y2="10"/>',
  verifier: '<path d="M8 2.5l4.5 1.8v3.6c0 2.8-2 4.8-4.5 5.6-2.5-.8-4.5-2.8-4.5-5.6V4.3z"/><polyline points="6,8 7.5,9.5 10,6.8"/>',
  review: '<path d="M2 8s2.2-4 6-4 6 4 6 4-2.2 4-6 4-6-4-6-4z"/><circle cx="8" cy="8" r="1.6"/>',
  menu: '<circle class="f" cx="3.5" cy="8" r="1"/><line x1="6" y1="4.5" x2="13" y2="4.5"/><line x1="6" y1="8" x2="13" y2="8"/><line x1="6" y1="11.5" x2="13" y2="11.5"/>',
  commit: '<circle cx="8" cy="8" r="2.5"/><line x1="2" y1="8" x2="5.5" y2="8"/><line x1="10.5" y1="8" x2="14" y2="8"/>',
  worktree: '<circle cx="5" cy="3.5" r="1.5"/><circle cx="5" cy="12.5" r="1.5"/><circle cx="11" cy="5.5" r="1.5"/><line x1="5" y1="5" x2="5" y2="11"/><path d="M11 7c0 2.6-6 2-6 4"/>',
  push: '<line x1="8" y1="11.5" x2="8" y2="3"/><polyline points="4.5,6.5 8,3 11.5,6.5"/><line x1="3" y1="13.5" x2="13" y2="13.5"/>',
  branch: '<line x1="3" y1="5.5" x2="12" y2="5.5"/><polyline points="9.5,3 12,5.5 9.5,8"/><line x1="13" y1="10.5" x2="4" y2="10.5"/><polyline points="6.5,8 4,10.5 6.5,13"/>',
  plugin: '<rect x="4" y="6" width="8" height="5" rx="1.5"/><line x1="6.5" y1="3" x2="6.5" y2="6"/><line x1="9.5" y1="3" x2="9.5" y2="6"/><line x1="8" y1="11" x2="8" y2="14"/>',
  phone: '<rect x="4.5" y="1.8" width="7" height="12.4" rx="1.8"/><line x1="7" y1="12" x2="9" y2="12"/>',
  share: '<path d="M6.5 9.5l5-5"/><polyline points="8,4.5 11.5,4.5 11.5,8"/><path d="M9.5 9.5v3a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1h3"/>',
  search: '<circle cx="7" cy="7" r="4"/><line x1="10" y1="10" x2="13.5" y2="13.5"/>',
  update: '<path d="M13 8a5 5 0 1 1-1.5-3.6"/><polyline points="11.8,1.9 11.6,4.6 8.9,4.4"/>',
  bulb: '<circle cx="8" cy="6.5" r="4"/><line x1="6.5" y1="12" x2="9.5" y2="12"/><line x1="7" y1="14" x2="9" y2="14"/>',
  conflict: '<rect x="2.5" y="5" width="7" height="7" rx="1.5"/><rect x="6.5" y="2.5" width="7" height="7" rx="1.5"/>',
  plan: '<line x1="4" y1="2.5" x2="4" y2="14"/><path d="M4 3h8l-2 2.8 2 2.7H4"/>',
  dock: '<rect x="2.5" y="2.5" width="11" height="11" rx="2"/><line x1="2.5" y1="6" x2="13.5" y2="6"/>',
  fold: '<polyline points="4,6 8,10 12,6"/>',
  open: '<path d="M7.5 3.5H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 12.5h6a1.5 1.5 0 0 0 1.5-1.5V8.5"/><line x1="8" y1="8" x2="12.5" y2="3.5"/><polyline points="9.5,3.5 12.5,3.5 12.5,6.5"/>',
  stop: '<circle cx="8" cy="8" r="5.75"/><rect class="f" x="5.9" y="5.9" width="4.2" height="4.2" rx=".9"/>',
  stopped: '<rect class="f" x="4" y="4" width="8" height="8" rx="1.6"/>',
  runs: '<rect x="2.5" y="6.5" width="11" height="7" rx="1.8"/><line x1="4.5" y1="4.3" x2="11.5" y2="4.3"/><line x1="6" y1="2.2" x2="10" y2="2.2"/>',
  linked: '<path d="M6.8 9.2l2.4-2.4"/><path d="M7.4 5.6l1-1a2.3 2.3 0 0 1 3.2 3.2l-1 1"/><path d="M8.6 10.4l-1 1a2.3 2.3 0 0 1-3.2-3.2l1-1"/>',
  close: '<line x1="4.5" y1="4.5" x2="11.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="4.5" y2="11.5"/>',
  tick: '<polyline points="3.5,8.3 6.5,11.2 12.5,4.8"/>',
  cross: '<line x1="4.5" y1="4.5" x2="11.5" y2="11.5"/><line x1="11.5" y1="4.5" x2="4.5" y2="11.5"/>',
  bang: '<line x1="8" y1="3.5" x2="8" y2="9"/><circle class="f" cx="8" cy="12" r="1"/>',
  file: '<path d="M4.5 2.5h4.5l2.5 2.5v8.5h-7z"/>',
  hash: '<line x1="6" y1="3" x2="5" y2="13"/><line x1="11" y1="3" x2="10" y2="13"/><line x1="3" y1="6.5" x2="13" y2="6.5"/><line x1="3" y1="10" x2="13" y2="10"/>',
  dot: '<circle class="f" cx="8" cy="8" r="2.5"/>',
  window: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><line x1="2.5" y1="6" x2="13.5" y2="6"/>'
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, xd = ["innerHTML"], Md = {
========
}, Sd = ["innerHTML"], Ed = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = C(() => ta[t.name] || ta.dot);
    return (s, a) => (l(), d("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    }, null, 8, xd));
  }
}, Ve = /* @__PURE__ */ J(Md, [["__scopeId", "data-v-beb5935c"]]), _d = {
========
    }, null, 8, Sd));
  }
}, Ve = /* @__PURE__ */ J(Ed, [["__scopeId", "data-v-beb5935c"]]), Ad = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: Q(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      F(Ve, { name: "fold" })
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Bt = /* @__PURE__ */ J(_d, [["__scopeId", "data-v-d03899bb"]]), Sd = ["data-tip", "aria-label"], Ed = {
  key: 0,
  class: "mact-word"
}, Ad = {
========
}, Bt = /* @__PURE__ */ J(Ad, [["__scopeId", "data-v-d03899bb"]]), Cd = ["data-tip", "aria-label"], Od = {
  key: 0,
  class: "mact-word"
}, Td = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: Q(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      H(Ve, { name: "open" }),
      e.open ? (l(), d("span", Ed, w(e.label), 1)) : j("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Sd));
  }
}, io = /* @__PURE__ */ J(Ad, [["__scopeId", "data-v-3b292e09"]]), Cd = 120, Cn = 280, Od = 160, Td = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function lo(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = q(t()), a = q("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, m = ++o;
    if (!f || !f.offsetWidth || Td()) {
      s.value = u;
      return;
    }
    const y = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, y), a.value = "leaving", await n(Cd), m !== o) return;
    s.value = u, a.value = "resizing", await Lt(), i(f);
    const x = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, y), f.offsetWidth, f.style.transition = `width ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, x), await n(Cn), m === o && (i(f), a.value = "entering", await n(Od), m === o && (a.value = ""));
========
      F(Ve, { name: "open" }),
      e.open ? (l(), d("span", Od, w(e.label), 1)) : L("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Cd));
  }
}, lo = /* @__PURE__ */ J(Td, [["__scopeId", "data-v-3b292e09"]]), Bd = 120, An = 280, Id = 160, Rd = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
};
function co(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = j(t()), a = j("");
  let o = 0;
  const r = (u, f) => Object.assign(u.style, { width: `${f.width}px`, height: `${f.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function c(u) {
    const f = e.value, g = ++o;
    if (!f || !f.offsetWidth || Rd()) {
      s.value = u;
      return;
    }
    const k = { width: f.offsetWidth, height: f.offsetHeight };
    if (r(f, k), a.value = "leaving", await n(Bd), g !== o) return;
    s.value = u, a.value = "resizing", await Lt(), i(f);
    const _ = { width: f.offsetWidth, height: f.offsetHeight };
    r(f, k), f.offsetWidth, f.style.transition = `width ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${An}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, _), await n(An), g === o && (i(f), a.value = "entering", await n(Id), g === o && (a.value = ""));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
  return ke(t, (u) => c(u)), yt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Bd = { class: "growing-card-top" }, Id = ["aria-expanded"], Rd = { class: "growing-card-avatar" }, Ld = { class: "growing-card-title" }, Dd = { class: "growing-card-more" }, Nd = { class: "growing-card-body" }, jd = {
========
const Ld = { class: "growing-card-top" }, Dd = ["aria-expanded"], Nd = { class: "growing-card-avatar" }, jd = { class: "growing-card-title" }, Pd = { class: "growing-card-more" }, qd = { class: "growing-card-body" }, Wd = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean
  },
  emits: ["act"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = e, s = t, a = q(!1), o = q(null), { folded: r, phase: i } = lo(o, () => !a.value), c = O(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = O(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, m) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: Q(["growing-card-wrap", U(i), { open: !U(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Bd, [
========
    const n = e, s = t, a = j(!1), o = j(null), { folded: r, phase: i } = co(o, () => !a.value), c = C(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = C(() => n.text.split(/\n\s*\n/).filter((f) => f.trim()));
    return (f, g) => (l(), d("div", {
      ref_key: "wrap",
      ref: o,
      class: ee(["growing-card-wrap", G(i), { open: !G(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Ld, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: g[0] || (g[0] = (k) => a.value = !a.value)
        }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          p("span", Rd, [
            e.bad ? (l(), G(Ve, {
========
          p("span", Nd, [
            e.bad ? (l(), K(Ve, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              key: 0,
              name: "cross"
            })) : c.value ? (l(), d(Q, { key: 1 }, [
              ue(w(c.value), 1)
            ], 64)) : (l(), K(be, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          p("span", Ld, w(e.title), 1),
          H(Bt, { open: a.value }, null, 8, ["open"])
        ], 8, Id),
        e.action ? (l(), G(io, {
========
          p("span", jd, w(e.title), 1),
          F(Bt, { open: a.value }, null, 8, ["open"])
        ], 8, Dd),
        e.action ? (l(), K(lo, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 0,
          label: e.action,
          open: a.value,
          onClick: g[1] || (g[1] = (k) => s("act"))
        }, null, 8, ["label", "open"])) : L("", !0)
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      p("div", Dd, [
        p("div", Nd, [
          (l(!0), d(X, null, re(u.value, (y, x) => (l(), d("p", {
            key: x,
========
      p("div", Pd, [
        p("div", qd, [
          (l(!0), d(Q, null, oe(u.value, (k, _) => (l(), d("p", {
            key: _,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            class: "growing-card-text"
          }, w(k), 1))), 128))
        ])
      ])
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Pd = /* @__PURE__ */ J(jd, [["__scopeId", "data-v-c09abbcf"]]), qd = ["title", "aria-label"], Wd = {
========
}, Fd = /* @__PURE__ */ J(Wd, [["__scopeId", "data-v-c09abbcf"]]), Hd = ["title", "aria-label"], Ud = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Fd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Hd = {
========
}, Vd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, zd = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = C(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (l(), d("span", {
      class: Q(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      (l(), d("svg", Wd, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", Fd)) : j("", !0)
      ]))
    ], 10, qd));
  }
}, Ud = /* @__PURE__ */ J(Hd, [["__scopeId", "data-v-6dc92808"]]), Vd = "img,pre,table";
function zd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Gd(e) {
========
      (l(), d("svg", Ud, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (l(), d("path", Vd)) : L("", !0)
      ]))
    ], 10, Hd));
  }
}, Gd = /* @__PURE__ */ J(zd, [["__scopeId", "data-v-6dc92808"]]), Kd = "img,pre,table";
function Yd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Jd(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Kd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Vd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = zd(Gd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Yd(e, t) {
  let n = null;
  const s = () => e.value && Kd(e.value);
========
function Zd(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Kd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Yd(Jd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Xd(e, t) {
  let n = null;
  const s = () => e.value && Zd(e.value);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  De(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ce(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Jd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Zd(e) {
========
const Qd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function eh(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Xd = ["data-ref"], Qd = ["data-from", "data-ref"], eh = { class: "message-body" }, th = ["title"], nh = ["innerHTML"], sh = ["innerHTML"], ah = {
  class: "message-faces",
  "data-message-faces": ""
}, oh = ["title", "data-face", "onClick"], rh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, ih = ["title", "data-reaction", "onClick"], lh = {
  key: 0,
  class: "message-reaction-count"
}, ch = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, uh = ["href", "title"], dh = ["src", "alt"], hh = ["href"], fh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, ph = {
  key: 1,
  "data-message-links-rows": ""
}, mh = { class: "message-foot" }, gh = { class: "message-time" }, vh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, yh = 1500, wh = "An earlier message", kh = "about", bh = 3, $h = {
========
const th = ["data-ref"], nh = ["data-from", "data-ref"], sh = { class: "message-body" }, ah = ["title"], oh = ["innerHTML"], rh = ["innerHTML"], ih = {
  class: "message-faces",
  "data-message-faces": ""
}, lh = ["title", "data-face", "onClick"], ch = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, uh = ["title", "data-reaction", "onClick"], dh = {
  key: 0,
  class: "message-reaction-count"
}, hh = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, fh = ["href", "title"], ph = ["src", "alt"], mh = ["href"], gh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, vh = {
  key: 1,
  "data-message-links-rows": ""
}, yh = { class: "message-foot" }, wh = { class: "message-time" }, kh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, bh = 1500, $h = "An earlier message", xh = "about", _h = 3, Mh = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "delete", "react"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    var B;
    const n = e, s = t, a = q(!1), o = q(null), r = O(() => ["user", "comment"].includes(n.message.type)), i = O(() => {
      const [S, Y] = (n.message.commented_row || ":").split(":"), V = at(S);
      return V ? { ref: `${V}:${Y}`, label: `${Nt(V).title.toLowerCase()} ${Y}` } : null;
    }), c = O(() => r.value && !n.message.read_at && !n.message.local);
    async function u() {
      var S;
      await ((S = navigator.clipboard) == null ? void 0 : S.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, yh);
    }
    const f = O(() => ss(n.message.text ?? "", { env: "" })), m = O(() => JSON.parse(n.message.flowchart_edges || "[]")), y = q(!1), x = O(() => ss(n.quote || wh, { env: "" }));
    function P() {
      const S = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      S ? S.scrollIntoView({ block: "center", behavior: "smooth" }) : it(`messages:${n.message.parent_id}`);
    }
    Yd(o, () => `${n.message.text} ${n.quote}`);
    const M = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, b = (S) => `/api/files/message/${n.message.id}/${encodeURIComponent(S)}`, A = O(() => JSON.parse(n.message.captions || "{}")), I = O(() => (n.message.files ?? []).map((S) => ({ name: S, address: b(S), isImage: M.test(S), title: A.value[S] || S }))), ee = O(() => Na(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), k = Le(Ne, null), v = q([]), D = q(!1), T = O(() => `Linked: ${v.value.join(", ")}`), W = O(() => v.value.length >= bh), $ = O(() => `${v.value.length} linked ${v.value.every((S) => S.startsWith("task ")) ? "tasks" : "rows"}`);
    async function E() {
      if (!r.value || !(k != null && k.read) || n.message.local) return;
      const S = await k.read(`link list --source message:${n.message.id}`);
      S.ok && (v.value = (S.value.rows ?? S.value ?? []).filter((Y) => Y.link_type === kh).map((Y) => `${Y.target_model} ${Y.target_id}`));
    }
    E(), (B = k == null ? void 0 : k.follow) == null || B.call(k, ["link.*"], E);
    const g = q(!1), h = O(() => Zd(n.message.reactions));
    function C(S) {
      g.value = !1, s("react", n.message, S);
========
    var T;
    const n = e, s = t, a = j(!1), o = j(null), r = C(() => ["user", "comment"].includes(n.message.type)), i = C(() => {
      const [M, Z] = (n.message.commented_row || ":").split(":"), z = at(M);
      return z ? { ref: `${z}:${Z}`, label: `${Nt(z).title.toLowerCase()} ${Z}` } : null;
    }), c = C(() => r.value && !n.message.read_at && !n.message.local);
    async function u() {
      var M;
      await ((M = navigator.clipboard) == null ? void 0 : M.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, bh);
    }
    const f = C(() => ns(n.message.text ?? "", { env: "" })), g = C(() => JSON.parse(n.message.flowchart_edges || "[]")), k = j(!1), _ = C(() => ns(n.quote || $h, { env: "" }));
    function D() {
      const M = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      M ? M.scrollIntoView({ block: "center", behavior: "smooth" }) : it(`messages:${n.message.parent_id}`);
    }
    Xd(o, () => `${n.message.text} ${n.quote}`);
    const P = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, b = (M) => `/api/files/message/${n.message.id}/${encodeURIComponent(M)}`, E = C(() => JSON.parse(n.message.captions || "{}")), H = C(() => (n.message.files ?? []).map((M) => ({ name: M, address: b(M), isImage: P.test(M), title: E.value[M] || M }))), V = C(() => ja(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), y = Ae(Ne, null), m = j([]), I = j(!1), O = C(() => `Linked: ${m.value.join(", ")}`), q = C(() => m.value.length >= _h), $ = C(() => `${m.value.length} linked ${m.value.every((M) => M.startsWith("task ")) ? "tasks" : "rows"}`);
    async function S() {
      if (!r.value || !(y != null && y.read) || n.message.local) return;
      const M = await y.read(`link list --source message:${n.message.id}`);
      M.ok && (m.value = (M.value.rows ?? M.value ?? []).filter((Z) => Z.link_type === xh).map((Z) => `${Z.target_model} ${Z.target_id}`));
    }
    S(), (T = y == null ? void 0 : y.follow) == null || T.call(y, ["link.*"], S);
    const v = j(!1), h = C(() => eh(n.message.reactions));
    function A(M) {
      v.value = !1, s("react", n.message, M);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }
    return (M, Z) => e.message.peer || e.message.recipient ? (l(), d("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      H(Pd, {
========
      F(Fd, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    ], 8, Xd)) : (l(), d("article", {
========
    ], 8, th)) : (l(), d("article", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      p("div", eh, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: Q(["message-card", "md", { comment: i.value }]),
          onClick: Y[3] || (Y[3] = (...V) => U(mt) && U(mt)(...V))
========
      p("div", sh, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: ee(["message-card", "md", { comment: i.value }]),
          onClick: Z[3] || (Z[3] = (...z) => G(mt) && G(mt)(...z))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        }, [
          i.value ? (l(), d("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: Y[0] || (Y[0] = _e((V) => U(it)(i.value.ref), ["stop"]))
========
            onClick: Z[0] || (Z[0] = Me((z) => G(it)(i.value.ref), ["stop"]))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }, [
            F(be, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + w(i.value.label), 1)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          ], 8, th)) : j("", !0),
========
          ], 8, ah)) : L("", !0),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          e.message.parent_id ? (l(), d("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: _e(P, ["stop"]),
            innerHTML: x.value
          }, null, 8, nh)) : j("", !0),
          p("div", { innerHTML: f.value }, null, 8, sh),
          m.value.length ? (l(), d(X, { key: 2 }, [
========
            onClick: Me(D, ["stop"]),
            innerHTML: _.value
          }, null, 8, oh)) : L("", !0),
          p("div", { innerHTML: f.value }, null, 8, rh),
          g.value.length ? (l(), d(Q, { key: 2 }, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              onClick: Y[1] || (Y[1] = (V) => y.value = !0)
            }, "Open the flowchart"),
            y.value ? (l(), G($d, {
              key: 0,
              title: e.message.text,
              edges: m.value,
              onClose: Y[2] || (Y[2] = (V) => y.value = !1)
            }, null, 8, ["title", "edges"])) : j("", !0)
          ], 64)) : j("", !0)
        ], 2),
        p("div", {
          class: Q(["message-tools", { picking: g.value }]),
          "data-message-tools": ""
        }, [
          g.value ? (l(), d(X, { key: 0 }, [
            p("div", ah, [
              (l(!0), d(X, null, re(U(Jd), (V) => (l(), d("button", {
                key: V,
                type: "button",
                class: "message-face",
                title: `React ${V}`,
                "data-face": V,
                onClick: (ue) => C(V)
              }, w(V), 9, oh))), 128))
========
              onClick: Z[1] || (Z[1] = (z) => k.value = !0)
            }, "Open the flowchart"),
            k.value ? (l(), K(Md, {
              key: 0,
              title: e.message.text,
              edges: g.value,
              onClose: Z[2] || (Z[2] = (z) => k.value = !1)
            }, null, 8, ["title", "edges"])) : L("", !0)
          ], 64)) : L("", !0)
        ], 2),
        p("div", {
          class: ee(["message-tools", { picking: v.value }]),
          "data-message-tools": ""
        }, [
          v.value ? (l(), d(Q, { key: 0 }, [
            p("div", ih, [
              (l(!0), d(Q, null, oe(G(Qd), (z) => (l(), d("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (de) => A(z)
              }, w(z), 9, lh))), 128))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              onClick: Y[4] || (Y[4] = (V) => g.value = !1)
========
              onClick: Z[4] || (Z[4] = (z) => v.value = !1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            }, [
              F(be, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (l(), d(Q, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              onClick: Y[5] || (Y[5] = (V) => g.value = !0)
========
              onClick: Z[5] || (Z[5] = (z) => v.value = !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              onClick: Y[6] || (Y[6] = (V) => s("reply", e.message))
========
              onClick: Z[6] || (Z[6] = (z) => s("reply", e.message))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: u
            }, w(a.value ? "Copied" : "Copy"), 1),
            c.value ? (l(), d("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              onClick: Y[7] || (Y[7] = (V) => s("delete", e.message))
            }, "Delete")) : j("", !0)
          ], 64))
        ], 2)
      ]),
      h.value.length ? (l(), d("div", rh, [
        (l(!0), d(X, null, re(h.value, (V) => (l(), d("button", {
          key: V.emoji,
          type: "button",
          class: Q(["message-reaction", { mine: V.mine }]),
          title: V.title,
          "data-reaction": V.emoji,
          onClick: (ue) => s("react", e.message, V.emoji)
        }, [
          he(w(V.emoji) + " ", 1),
          V.count > 1 ? (l(), d("span", lh, w(V.count), 1)) : j("", !0)
        ], 10, ih))), 128))
      ])) : j("", !0),
      I.value.length ? (l(), d("div", ch, [
        (l(!0), d(X, null, re(I.value, (V) => (l(), d(X, {
          key: V.name
        }, [
          V.isImage ? (l(), d("a", {
            key: 0,
            href: V.address,
            target: "_blank",
            class: "message-image",
            title: V.title
          }, [
            p("img", {
              src: V.address,
              alt: V.name
            }, null, 8, dh)
          ], 8, uh)) : (l(), d("a", {
            key: 1,
            href: V.address,
            target: "_blank",
            class: "message-file"
          }, w(V.name), 9, hh))
        ], 64))), 128))
      ])) : j("", !0),
      v.value.length ? (l(), d("div", fh, [
        H(Ve, {
========
              onClick: Z[7] || (Z[7] = (z) => s("delete", e.message))
            }, "Delete")) : L("", !0)
          ], 64))
        ], 2)
      ]),
      h.value.length ? (l(), d("div", ch, [
        (l(!0), d(Q, null, oe(h.value, (z) => (l(), d("button", {
          key: z.emoji,
          type: "button",
          class: ee(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (de) => s("react", e.message, z.emoji)
        }, [
          ue(w(z.emoji) + " ", 1),
          z.count > 1 ? (l(), d("span", dh, w(z.count), 1)) : L("", !0)
        ], 10, uh))), 128))
      ])) : L("", !0),
      H.value.length ? (l(), d("div", hh, [
        (l(!0), d(Q, null, oe(H.value, (z) => (l(), d(Q, {
          key: z.name
        }, [
          z.isImage ? (l(), d("a", {
            key: 0,
            href: z.address,
            target: "_blank",
            class: "message-image",
            title: z.title
          }, [
            p("img", {
              src: z.address,
              alt: z.name
            }, null, 8, ph)
          ], 8, fh)) : (l(), d("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, w(z.name), 9, mh))
        ], 64))), 128))
      ])) : L("", !0),
      m.value.length ? (l(), d("div", gh, [
        F(Ve, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          class: "message-links-icon",
          name: "linked"
        }),
        q.value && !I.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          onClick: Y[8] || (Y[8] = (V) => D.value = !0)
        }, w($.value), 1)) : (l(), d("span", ph, [
          H(st, {
            text: T.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : j("", !0),
      p("div", mh, [
        p("time", gh, w(ee.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", vh, "#" + w(e.message.id), 1)) : j("", !0),
        r.value ? (l(), G(Ud, {
========
          onClick: Z[8] || (Z[8] = (z) => I.value = !0)
        }, w($.value), 1)) : (l(), d("span", vh, [
          F(st, {
            text: O.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : L("", !0),
      p("div", yh, [
        p("time", wh, w(V.value), 1),
        Number.isInteger(e.message.id) ? (l(), d("span", kh, "message " + w(e.message.id), 1)) : L("", !0),
        r.value ? (l(), K(Gd, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : L("", !0)
      ])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    ], 8, Qd));
  }
}, Iv = /* @__PURE__ */ J($h, [["__scopeId", "data-v-5a08c284"]]), cn = [
========
    ], 8, nh));
  }
}, Uv = /* @__PURE__ */ J(Mh, [["__scopeId", "data-v-eb1d7000"]]), ln = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
], On = 200, co = (e) => {
  var t;
  return ((t = cn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? cn[0].key;
}, Rv = (e) => {
  var t;
  return ((t = cn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, xh = ["aria-label"], Mh = 300, ta = 400, _h = {
========
], Cn = 200, uo = (e) => {
  var t;
  return ((t = ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? ln[0].key;
}, Vv = (e) => {
  var t;
  return ((t = ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Sh = ["aria-label"], Eh = 300, na = 400, Ah = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "PriorityIcon",
  props: { value: { type: Number, default: On } },
  setup(e) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const t = e, n = O(() => co(t.value)), s = O(() => n.value < On ? [1, 0.25, 0.25] : n.value === On ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: Q(["ico", "prio", { hot: n.value >= ta, high: n.value >= Mh && n.value < ta }]),
========
    const t = e, n = C(() => uo(t.value)), s = C(() => n.value < Cn ? [1, 0.25, 0.25] : n.value === Cn ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (l(), d("svg", {
      class: ee(["ico", "prio", { hot: n.value >= na, high: n.value >= Eh && n.value < na }]),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      p("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: $e({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: $e({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: $e({ opacity: s.value[2] })
      }, null, 4)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    ], 10, xh));
  }
}, Lv = /* @__PURE__ */ J(_h, [["__scopeId", "data-v-b10e610f"]]), Sh = ["aria-checked", "aria-haspopup", "onClick"], Eh = {
  key: 0,
  class: "segmented-dot"
}, Ah = {
  key: 1,
  class: "segmented-count"
}, Ch = {
========
    ], 10, Sh));
  }
}, zv = /* @__PURE__ */ J(Ah, [["__scopeId", "data-v-b10e610f"]]), Ch = ["aria-checked", "aria-haspopup", "onClick"], Oh = {
  key: 0,
  class: "segmented-dot"
}, Th = {
  key: 1,
  class: "segmented-count"
}, Bh = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = t, s = wa();
    return (a, o) => {
      const r = Yo("tip");
========
    const n = t, s = ka();
    return (a, o) => {
      const r = Zo("tip");
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      return l(), d("span", {
        class: Q(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (l(!0), d(Q, null, oe(e.options, (i) => rt((l(), d("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Q(["segmented-option", { on: i.key === e.value }]),
          onClick: (c) => n("pick", i.key)
        }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          i.dot ? (l(), d("span", Eh)) : j("", !0),
          he(" " + w(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Ah, w(i.count), 1)) : j("", !0)
        ], 10, Sh)), [
          [r, i.tip || i.title, `${U(s)}-${i.key}`]
========
          i.dot ? (l(), d("span", Oh)) : L("", !0),
          ue(" " + w(i.label) + " ", 1),
          i.count !== void 0 ? (l(), d("em", Th, w(i.count), 1)) : L("", !0)
        ], 10, Ch)), [
          [r, i.tip || i.title, `${G(s)}-${i.key}`]
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ])), 128))
      ], 2);
    };
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, os = /* @__PURE__ */ J(Ch, [["__scopeId", "data-v-ca953072"]]), na = {
========
}, Ih = /* @__PURE__ */ J(Bh, [["__scopeId", "data-v-ca953072"]]), sa = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Oh = {
  key: 1,
  class: "text-field-label"
}, Th = {
  key: 2,
  class: "text-field-end"
}, Bh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
========
}, Rh = {
  key: 1,
  class: "text-field-label"
}, Lh = {
  key: 2,
  class: "text-field-end"
}, Dh = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "TextInput",
  props: /* @__PURE__ */ Gn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var f;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = zn(e, "modelValue"), s = ba(), a = "onUpdate:modelValue" in (((f = Jo()) == null ? void 0 : f.vnode.props) || {}), o = O(() => a ? n.value : s.value), r = (m) => a && (n.value = m.target.value), i = O(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = O(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), u = q(null);
    return t({ focus: () => u.value && u.value.focus() }), (m, y) => e.label || e.icon || m.$slots.end ? (l(), d("label", {
      key: 0,
      class: Q(["text-field", { large: e.large, ended: m.$slots.end }, U(s).class]),
      style: be(U(s).style)
========
    const n = Vn(e, "modelValue"), s = $a(), a = "onUpdate:modelValue" in (((f = Xo()) == null ? void 0 : f.vnode.props) || {}), o = C(() => a ? n.value : s.value), r = (g) => a && (n.value = g.target.value), i = C(
      () => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "class" && g !== "style" && g !== "value"))
    ), c = C(() => Object.fromEntries(Object.entries(s).filter(([g]) => g !== "value"))), u = j(null);
    return t({ focus: () => u.value && u.value.focus() }), (g, k) => e.label || e.icon || g.$slots.end ? (l(), d("label", {
      key: 0,
      class: ee(["text-field", { large: e.large, ended: g.$slots.end }, G(s).class]),
      style: $e(G(s).style)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }, [
      e.icon ? (l(), K(be, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, ["name"])) : j("", !0),
      e.label ? (l(), d("span", Oh, w(e.label), 1)) : j("", !0),
========
      }, null, 8, ["name"])) : L("", !0),
      e.label ? (l(), d("span", Rh, w(e.label), 1)) : L("", !0),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      rt(p("input", ot({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        [U(na), o.value]
      ]),
      m.$slots.end ? (l(), d("span", Th, [
        we(m.$slots, "end", {}, void 0, !0)
      ])) : j("", !0)
========
        [G(sa), o.value]
      ]),
      g.$slots.end ? (l(), d("span", Lh, [
        ye(g.$slots, "end", {}, void 0, !0)
      ])) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    ], 6)) : rt((l(), d("input", ot({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: r }), null, 16)), [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      [U(na), o.value]
    ]);
  }
}), Ih = /* @__PURE__ */ J(Bh, [["__scopeId", "data-v-d9c38ca8"]]);
function Rh(e, t, { incremental: n = !1 } = {}) {
  const s = vs(), a = q([]), o = q(""), r = q(!1), i = q(""), c = q(null);
  async function u(M) {
    const b = await s.read(`${e} --before-id ${M + 1} --limit 1`);
    if (!b.ok) return x();
    const A = b.value.rows.find((I) => I.id === M);
    a.value = A ? a.value.map((I) => I.id === M ? A : I) : a.value.filter((I) => I.id !== M);
  }
  async function f(M) {
    if (n && String((M == null ? void 0 : M.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((k) => k.id !== M.row_id));
    if (n && (M != null && M.row_id) && !String(M.event ?? "").endsWith(".create") && a.value.some((k) => k.id === M.row_id)) return u(M.row_id);
    if (!(n && a.value.length && String((M == null ? void 0 : M.event) ?? "").endsWith(".create"))) return x();
    const A = Math.max(...a.value.map((k) => k.id)), I = await s.read(`${e} --after-id ${A}`);
    if (!I.ok) return x();
    const ee = new Set(a.value.map((k) => k.id));
    a.value = [...I.value.rows.filter((k) => !ee.has(k.id)), ...a.value];
========
      [G(sa), o.value]
    ]);
  }
}), Gv = /* @__PURE__ */ J(Dh, [["__scopeId", "data-v-d9c38ca8"]]), aa = (e) => e.page * e.size < e.total;
function Nh(e, t, { incremental: n = !1 } = {}) {
  const s = ys(), a = j([]), o = j(""), r = j(!1), i = j(!1), c = j(""), u = j(null);
  async function f(b) {
    const E = await s.read(`${e} --before-id ${b + 1} --limit 1`);
    if (!E.ok) return D();
    const H = E.value.rows.find((V) => V.id === b);
    a.value = H ? a.value.map((V) => V.id === b ? H : V) : a.value.filter((V) => V.id !== b);
  }
  async function g(b) {
    if (n && String((b == null ? void 0 : b.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((m) => m.id !== b.row_id));
    if (n && (b != null && b.row_id) && !String(b.event ?? "").endsWith(".create") && a.value.some((m) => m.id === b.row_id)) return f(b.row_id);
    if (!(n && a.value.length && String((b == null ? void 0 : b.event) ?? "").endsWith(".create"))) return D();
    const H = Math.max(...a.value.map((m) => m.id)), V = await s.read(`${e} --after-id ${H}`);
    if (!V.ok) return D();
    const y = new Set(a.value.map((m) => m.id));
    a.value = [...V.value.rows.filter((m) => !y.has(m.id)), ...a.value];
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
  async function k() {
    if (!a.value.length) return !1;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const M = Math.min(...a.value.map((I) => I.id)), b = await s.read(`${e} --before-id ${M}`);
    if (!b.ok || !b.value.rows.length) return !1;
    const A = new Set(a.value.map((I) => I.id));
    return a.value = [...a.value, ...b.value.rows.filter((I) => !A.has(I.id))], !0;
  }
  let y = 0;
  async function x() {
    const M = ++y, b = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (M !== y) return;
    const A = b.ok ? s.shared ? [b.value] : b.value.rows : [], I = A.length ? Math.min(...A.map((ee) => ee.id)) : 0;
    a.value = n && b.ok && I ? [...a.value.filter((ee) => ee.id > Math.max(...A.map((k) => k.id))), ...A, ...a.value.filter((ee) => ee.id < I)] : A, o.value = b.ok ? "" : b.error, r.value = !0;
  }
  async function P(M) {
    const b = await s.run(M);
    return i.value = b.ok ? "" : b.error, c.value = b.ok ? b.value : null, await x(), b;
========
    const b = Math.min(...a.value.map((V) => V.id)), E = await s.read(`${e} --before-id ${b}`);
    if (!E.ok || !E.value.rows.length) return i.value = !1;
    i.value = aa(E.value);
    const H = new Set(a.value.map((V) => V.id));
    return a.value = [...a.value, ...E.value.rows.filter((V) => !H.has(V.id))], !0;
  }
  let _ = 0;
  async function D() {
    const b = ++_, E = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (b !== _) return;
    const H = E.ok ? s.shared ? [E.value] : E.value.rows : [], V = H.length ? Math.min(...H.map((y) => y.id)) : 0;
    a.value = n && E.ok && V ? [...a.value.filter((y) => y.id > Math.max(...H.map((m) => m.id))), ...H, ...a.value.filter((y) => y.id < V)] : H, E.ok && !a.value.some((y) => y.id < V) && (i.value = !s.shared && aa(E.value)), o.value = E.ok ? "" : E.error, r.value = !0;
  }
  async function P(b) {
    const E = await s.run(b);
    return c.value = E.ok ? "" : E.error, u.value = E.ok ? E.value : null, await D(), E;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
  return s.follow(t, g), D(), { rows: a, failure: o, loaded: r, more: i, load: D, older: k, act: P, actionFailure: c, answer: u, context: s };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Lh = { class: "title" }, Dh = { class: "state" }, Nh = {
========
const jh = { class: "title" }, Ph = { class: "state" }, qh = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const t = e, { rows: n, failure: s, loaded: a } = Rh(t.line, t.events);
    return (o, r) => (l(), G(Gr, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: z(({ row: i }) => [
        p("span", Lh, w(i.title), 1),
        p("span", Dh, w(i.state), 1)
========
    const t = e, { rows: n, failure: s, loaded: a } = Nh(t.line, t.events);
    return (o, r) => (l(), K(Jr, {
      rows: G(n),
      failure: G(s),
      loaded: G(a),
      empty: e.empty
    }, {
      default: U(({ row: i }) => [
        p("span", jh, w(i.title), 1),
        p("span", Ph, w(i.state), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Dv = /* @__PURE__ */ J(Nh, [["__scopeId", "data-v-a69084cd"]]), Tn = q(Date.now() / 1e3);
let sa = 0, Gt = 0;
function jh() {
  return Gt || (Tn.value = Date.now() / 1e3, sa = setInterval(() => Tn.value = Date.now() / 1e3, 1e3)), Gt += 1, $a() && xa(() => {
    Gt -= 1, Gt || clearInterval(sa);
  }), Tn;
}
const Ph = ["title", "data-figure-mark", "data-folded", "data-open"], qh = {
  key: 2,
  class: "worker"
}, Wh = { class: "head" }, Fh = { key: 0 }, Hh = {
  key: 3,
  class: "status"
}, Uh = {
  key: 0,
  class: "figure"
}, Vh = {
  key: 1,
  class: "ran-for"
}, zh = { key: 2 }, Gh = {
  key: 3,
  class: "news"
}, Kh = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Yh = {
  key: 6,
  class: "settled"
}, Jh = {
  key: 1,
  class: "bar"
}, Zh = {
  key: 3,
  class: "detail body"
}, Xh = {
  key: 0,
  class: "body-label"
}, Qh = ["title"], ef = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = ba(), s = ["onClick", "onAct"], a = O(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = q(!1), r = O(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = O(() => t.open !== void 0), c = O(() => i.value || r.value), u = O(() => i.value ? t.open : o.value), f = O(() => i.value ? !t.open : r.value && !o.value), m = O(() => !!(t.mark.action && n.onAct)), y = O(() => c.value || m.value || !!n.onClick), x = q(null), P = q(null), { folded: M, phase: b } = lo(x, () => f.value);
    function A(le) {
========
}, Kv = /* @__PURE__ */ J(qh, [["__scopeId", "data-v-a69084cd"]]), On = j(Date.now() / 1e3);
let oa = 0, Gt = 0;
function Wh() {
  return Gt || (On.value = Date.now() / 1e3, oa = setInterval(() => On.value = Date.now() / 1e3, 1e3)), Gt += 1, xa() && _a(() => {
    Gt -= 1, Gt || clearInterval(oa);
  }), On;
}
const Fh = ["title", "data-figure-mark", "data-folded", "data-open"], Hh = {
  key: 2,
  class: "worker"
}, Uh = { class: "head" }, Vh = { key: 0 }, zh = {
  key: 3,
  class: "status"
}, Gh = {
  key: 0,
  class: "figure"
}, Kh = {
  key: 1,
  class: "ran-for"
}, Yh = { key: 2 }, Jh = {
  key: 3,
  class: "news"
}, Zh = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Xh = {
  key: 6,
  class: "settled"
}, Qh = {
  key: 1,
  class: "bar"
}, ef = {
  key: 3,
  class: "detail body"
}, tf = {
  key: 0,
  class: "body-label"
}, nf = ["title"], sf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = $a(), s = ["onClick", "onAct"], a = C(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = j(!1), r = C(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = C(() => t.open !== void 0), c = C(() => i.value || r.value), u = C(() => i.value ? t.open : o.value), f = C(() => i.value ? !t.open : r.value && !o.value), g = C(() => !!(t.mark.action && n.onAct)), k = C(() => c.value || g.value || !!n.onClick), _ = j(null), D = j(null), { folded: P, phase: b } = co(_, () => f.value);
    function E(le) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      var me, Se;
      if (!(le.target !== _.value && !D.value.contains(le.target))) {
        if (i.value) return (me = n.onClick) == null ? void 0 : me.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Se = n.onAct || n.onClick) == null || Se(le);
      }
    }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const I = (le) => n.onAct(le), ee = ["failed", "unfinished"], k = O(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), v = O(() => t.mark.color ? t.mark.color : k.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : k.value ? `var(--tone-${k.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), D = O(() => v.value || "var(--tone-work)"), T = O(() => !t.mark.ending && !t.mark.ended && k.value !== "stopped"), W = jh(), $ = O(
      () => t.mark.began_at && T.value && !t.mark.figure && !t.mark.counting ? nl(W.value - t.mark.began_at) : ""
    ), E = O(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Fs(me - le, !0)}` : Fs(W.value - le, !0) : $.value;
    }), g = ["bad", "danger", "warn"], h = O(() => g.includes(k.value) || t.mark.asks ? "attention" : T.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), C = ["bad", "danger"], B = O(() => C.includes(k.value)), S = O(() => h.value === "process" ? "running" : B.value ? "cross" : k.value === "stopped" ? "stopped" : k.value === "good" ? "tick" : ""), Y = O(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || S.value || t.mark.settled || t.mark.news)
    ), V = O(() => [t.mark.title, t.mark.time ? Na(t.mark.time) : ""].filter(Boolean).join(" · ")), ue = O(() => ({
      ...v.value ? { "--mark": v.value } : {},
========
    const H = (le) => n.onAct(le), V = ["failed", "unfinished"], y = C(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? V.includes(t.mark.state) ? "danger" : "good" : ""), m = C(() => t.mark.color ? t.mark.color : y.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : y.value ? `var(--tone-${y.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), I = C(() => m.value || "var(--tone-work)"), O = C(() => !t.mark.ending && !t.mark.ended && y.value !== "stopped"), q = Wh(), $ = C(
      () => t.mark.began_at && O.value && !t.mark.figure && !t.mark.counting ? ol(q.value - t.mark.began_at) : ""
    ), S = C(() => {
      const { started: le, ended: me } = t.mark;
      return le ? me ? `ran ${Hs(me - le, !0)}` : Hs(q.value - le, !0) : $.value;
    }), v = ["bad", "danger", "warn"], h = C(() => v.includes(y.value) || t.mark.asks ? "attention" : O.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), A = ["bad", "danger"], T = C(() => A.includes(y.value)), M = C(() => h.value === "process" ? "running" : T.value ? "cross" : y.value === "stopped" ? "stopped" : y.value === "good" ? "tick" : ""), Z = C(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || M.value || t.mark.settled || t.mark.news)
    ), z = C(() => [t.mark.title, t.mark.time ? ja(t.mark.time) : ""].filter(Boolean).join(" · ")), de = C(() => ({
      ...m.value ? { "--mark": m.value } : {},
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, me) => (l(), d("div", ot(a.value, {
      ref_key: "root",
      ref: _,
      class: [
        "mark",
        `w-${h.value}`,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        U(b),
========
        G(b),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        {
          open: u.value,
          live: k.value,
          failed: T.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: m.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      style: ue.value,
      title: V.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U(M) ? "" : null,
========
      style: de.value,
      title: z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": G(P) ? "" : null,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      "data-open": i.value && e.open ? "" : null,
      onClick: E
    }), [
      (l(), K(lt(k.value ? "button" : "span"), {
        ref_key: "top",
        ref: D,
        class: "top",
        type: k.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!u.value) : void 0
      }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        default: z(() => [
          e.mark.markIcon ? (l(), G(Ve, {
========
        default: U(() => [
          e.mark.markIcon ? (l(), K(Ve, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (l(), K(be, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          e.mark.worker ? (l(), d("span", qh, w(e.mark.worker), 1)) : j("", !0),
          p("span", Wh, [
            H(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Fh, w(e.mark.name), 1)) : j("", !0),
            c.value ? (l(), G(Bt, {
========
          e.mark.worker ? (l(), d("span", Hh, w(e.mark.worker), 1)) : L("", !0),
          p("span", Uh, [
            F(st, {
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (l(), d("strong", Vh, w(e.mark.name), 1)) : L("", !0),
            c.value ? (l(), K(Bt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : L("", !0)
          ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          Y.value ? (l(), d("span", Hh, [
            e.mark.figure ? (l(), d("span", Uh, w(e.mark.figure), 1)) : j("", !0),
            E.value ? (l(), d("span", Vh, w(E.value), 1)) : j("", !0),
            e.mark.stopping ? (l(), d("span", zh, "Stopping")) : j("", !0),
            e.mark.news ? (l(), d("span", Gh, w(e.mark.news), 1)) : j("", !0),
            S.value === "running" ? (l(), d("span", Kh)) : S.value ? (l(), G(Ve, {
              key: 5,
              class: Q(["sign", S.value]),
              name: S.value
            }, null, 8, ["class", "name"])) : j("", !0),
            e.mark.settled ? (l(), d("span", Yh, w(e.mark.settled), 1)) : j("", !0)
          ])) : j("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (l(), G(io, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: _e(I, ["stop"])
      }, null, 8, ["label", "open"])) : j("", !0),
      (e.mark.figure || e.mark.counting) && T.value ? (l(), d("span", Jh, [
========
          Z.value ? (l(), d("span", zh, [
            e.mark.figure ? (l(), d("span", Gh, w(e.mark.figure), 1)) : L("", !0),
            S.value ? (l(), d("span", Kh, w(S.value), 1)) : L("", !0),
            e.mark.stopping ? (l(), d("span", Yh, "Stopping")) : L("", !0),
            e.mark.news ? (l(), d("span", Jh, w(e.mark.news), 1)) : L("", !0),
            M.value === "running" ? (l(), d("span", Zh)) : M.value ? (l(), K(Ve, {
              key: 5,
              class: ee(["sign", M.value]),
              name: M.value
            }, null, 8, ["class", "name"])) : L("", !0),
            e.mark.settled ? (l(), d("span", Xh, w(e.mark.settled), 1)) : L("", !0)
          ])) : L("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      g.value ? (l(), K(lo, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: Me(H, ["stop"])
      }, null, 8, ["label", "open"])) : L("", !0),
      (e.mark.figure || e.mark.counting) && O.value ? (l(), d("span", Qh, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: I.value })
        }, null, 4)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ])) : j("", !0),
      e.mark.detail && !U(M) ? (l(), G(st, {
========
      ])) : L("", !0),
      e.mark.detail && !G(P) ? (l(), K(st, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, ["text"])) : j("", !0),
      e.mark.body && !U(M) ? (l(), d("div", Zh, [
        e.mark.bodyLabel ? (l(), d("p", Xh, w(e.mark.bodyLabel), 1)) : j("", !0),
        H(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : j("", !0),
      e.mark.command && !U(M) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Qh)) : j("", !0),
      e.mark.card ? (l(), G(st, {
========
      }, null, 8, ["text"])) : L("", !0),
      e.mark.body && !G(P) ? (l(), d("div", ef, [
        e.mark.bodyLabel ? (l(), d("p", tf, w(e.mark.bodyLabel), 1)) : L("", !0),
        F(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : L("", !0),
      e.mark.command && !G(P) ? (l(), d("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, nf)) : L("", !0),
      e.mark.card ? (l(), K(st, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, ["text"])) : j("", !0),
      we(le.$slots, "default", {
        shown: !U(M)
      }, void 0, !0)
    ], 16, Ph));
  }
}), uo = /* @__PURE__ */ J(ef, [["__scopeId", "data-v-1bcf640e"]]), tf = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function ho(e) {
  var n;
  const t = tf[e] || ((n = Nt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const nf = (e) => ho(String(e).split(":")[0]), fo = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), sf = { passed: "good", failed: "danger", warned: "warn", running: "" }, af = { good: "good", warn: "warn", danger: "danger" }, aa = {
  "open row": (e) => it(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Pr(e.target_model, e.target_id || 0)
}, of = { "open row": (e) => nf(e.target_model), "open page": () => ho("pages") };
function rf(e, t) {
  const n = t || {}, s = aa[n.click] && e.target_model ? n.click : "";
========
      }, null, 8, ["text"])) : L("", !0),
      ye(le.$slots, "default", {
        shown: !G(P)
      }, void 0, !0)
    ], 16, Fh));
  }
}), ho = /* @__PURE__ */ J(sf, [["__scopeId", "data-v-1bcf640e"]]), af = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function fo(e) {
  var n;
  const t = af[e] || ((n = Nt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const of = (e) => fo(String(e).split(":")[0]), po = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), rf = { passed: "good", failed: "danger", warned: "warn", running: "" }, lf = { good: "good", warn: "warn", danger: "danger" }, ra = {
  "open row": (e) => it(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Fr(e.target_model, e.target_id || 0)
}, cf = { "open row": (e) => of(e.target_model), "open page": () => fo("pages") };
function uf(e, t) {
  const n = t || {}, s = ra[n.click] && e.target_model ? n.click : "";
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    tone: n.colouring === "outcome" ? sf[e.outcome] || "" : af[e.variant] || "",
========
    tone: n.colouring === "outcome" ? rf[e.outcome] || "" : lf[e.variant] || "",
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    action: s ? of[s](e) : "",
    handlers: s ? { onAct: () => aa[s](e) } : {}
  };
}
const lf = 24, cf = 1e3, oa = 2e3, uf = 0.25, df = 5e3;
function hf(e, t = lf, n = () => !0) {
  const s = q(!1), a = q(0), o = q(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const k = u();
    return k ? k.scrollHeight - k.scrollTop - k.clientHeight : 0;
  }, m = () => !u() || f() <= t;
  function y(k) {
    if (clearTimeout(r), !k) {
      o.value = !1, c = Date.now();
      return;
    }
    const v = Date.now() - c < oa ? oa : cf;
    r = setTimeout(() => o.value = s.value, v);
  }
  function x() {
    clearTimeout(i), s.value = !1, a.value = 0, y(!1);
  }
  function P(k = !1) {
    const v = u();
    v && k && v.scrollTo ? v.scrollTo({ top: v.scrollHeight, behavior: "smooth" }) : v && (v.scrollTop = v.scrollHeight), x();
  }
  function M() {
    A(), !s.value && (s.value = !0, y(!0));
  }
  const b = () => !!u() && f() <= u().clientHeight * uf;
  function A() {
    clearTimeout(i), b() && (i = setTimeout(() => s.value && b() && n() && P(!0), df));
  }
  function I() {
    m() ? x() : M();
  }
  function ee(k = 1, v = !1) {
    s.value ? a.value += Math.max(0, k) : P(v);
  }
  return $a() && xa(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: m, follow: x, toBottom: P, left: M, scrolled: I, arrived: ee };
}
const ff = {
========
    action: s ? cf[s](e) : "",
    handlers: s ? { onAct: () => ra[s](e) } : {}
  };
}
const df = 24, hf = 1e3, ia = 2e3, ff = 0.25, pf = 5e3;
function mf(e, t = df, n = () => !0) {
  const s = j(!1), a = j(0), o = j(!1);
  let r = 0, i = 0, c = 0;
  const u = () => e && "value" in e ? e.value : e, f = () => {
    const y = u();
    return y ? y.scrollHeight - y.scrollTop - y.clientHeight : 0;
  }, g = () => !u() || f() <= t;
  function k(y) {
    if (clearTimeout(r), !y) {
      o.value = !1, c = Date.now();
      return;
    }
    const m = Date.now() - c < ia ? ia : hf;
    r = setTimeout(() => o.value = s.value, m);
  }
  function _() {
    clearTimeout(i), s.value = !1, a.value = 0, k(!1);
  }
  function D(y = !1) {
    const m = u();
    m && y && m.scrollTo ? m.scrollTo({ top: m.scrollHeight, behavior: "smooth" }) : m && (m.scrollTop = m.scrollHeight), _();
  }
  function P() {
    E(), !s.value && (s.value = !0, k(!0));
  }
  const b = () => !!u() && f() <= u().clientHeight * ff;
  function E() {
    clearTimeout(i), b() && (i = setTimeout(() => s.value && b() && n() && D(!0), pf));
  }
  function H() {
    g() ? _() : P();
  }
  function V(y = 1, m = !1) {
    s.value ? a.value += Math.max(0, y) : D(m);
  }
  return xa() && _a(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: f, atBottom: g, follow: _, toBottom: D, left: P, scrolled: H, arrived: V };
}
const gf = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = e, s = t, a = q(null), { away: o, scrolled: r, arrived: i, toBottom: c } = hf(a);
========
    const n = e, s = t, a = j(null), { away: o, scrolled: r, arrived: i, toBottom: c } = mf(a);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    ke(
      () => n.lines.length,
      () => Lt(() => i()),
      { immediate: !0 }
    );
    function u(f) {
      r(), s("older", f.target);
    }
    return (f, g) => (l(), d("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      ue(w(e.lines.join(`
`) || e.empty), 1),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      U(o) ? (l(), d("button", {
========
      G(o) ? (l(), d("button", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        onClick: m[0] || (m[0] = (y) => U(c)(!0))
      }, "Follow")) : j("", !0)
    ], 544));
  }
}, pf = /* @__PURE__ */ J(ff, [["__scopeId", "data-v-09394a20"]]), mf = 1e4;
class gf {
========
        onClick: g[0] || (g[0] = (k) => G(c)(!0))
      }, "Follow")) : L("", !0)
    ], 544));
  }
}, vf = /* @__PURE__ */ J(gf, [["__scopeId", "data-v-09394a20"]]), yf = 1e4;
class wf {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  constructor(t, n) {
    this.frame = t, this.context = n, this.heardAt = null, this.received = this.received.bind(this);
  }
  start() {
    window.addEventListener("message", this.received);
  }
  stop() {
    window.removeEventListener("message", this.received);
  }
  silent(t = Date.now()) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return this.heardAt !== null && t - this.heardAt > mf;
========
    return this.heardAt !== null && t - this.heardAt > yf;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
  async received(t) {
    if (t.source !== this.frame.contentWindow) return;
    this.heardAt = Date.now();
    const n = t.data;
    !n || typeof n.id != "number" || (n.type === "read" && this.send(n.id, await this.context.read(n.line)), n.type === "run" && this.send(n.id, await this.context.run(n.line)), n.type === "option" && this.send(n.id, { ok: !0, value: this.context.option(n.key).value ?? null }), n.type === "follow" && (this.context.follow(n.patterns, (s) => this.send(n.id, { ok: !0, value: s })), this.send(n.id, { ok: !0, value: null })));
  }
  send(t, n) {
    var s;
    (s = this.frame.contentWindow) == null || s.postMessage({ id: t, answer: n }, "*");
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const vf = {
  key: 0,
  class: "frame-note"
}, yf = {
  key: 0,
  class: "frame-note"
}, wf = ["src", "title"], kf = 1e3, bf = {
========
const kf = {
  key: 0,
  class: "frame-note"
}, bf = {
  key: 0,
  class: "frame-note"
}, $f = ["src", "title"], xf = 1e3, _f = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ys(), s = j(null), a = j(!1), o = j(!1);
    let r = null, i = 0;
    return De(() => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      r = new gf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, kf);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", vf, "This window was closed because it stopped answering.")) : (l(), d(X, { key: 1 }, [
      a.value ? (l(), d("div", yf, [
========
      r = new wf(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, xf);
    }), Ce(() => {
      r == null || r.stop(), clearInterval(i);
    }), (c, u) => o.value ? (l(), d("p", kf, "This window was closed because it stopped answering.")) : (l(), d(Q, { key: 1 }, [
      a.value ? (l(), d("div", bf, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        F(we, {
          onClick: u[0] || (u[0] = (f) => o.value = !0)
        }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          default: z(() => [...u[1] || (u[1] = [
            he("Close the window", -1)
========
          default: U(() => [...u[1] || (u[1] = [
            ue("Close the window", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ])]),
          _: 1
        })
      ])) : L("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        title: U(n).window
      }, null, 8, wf)
    ], 64));
  }
}, $f = /* @__PURE__ */ J(bf, [["__scopeId", "data-v-32a49046"]]), xf = 0, Mf = "/api/lines", _f = "/api/line";
class Sf {
========
        title: G(n).window
      }, null, 8, $f)
    ], 64));
  }
}, Mf = /* @__PURE__ */ J(_f, [["__scopeId", "data-v-32a49046"]]), Sf = 0, Ef = "/api/lines", Af = "/api/line";
class Cf {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), xf));
========
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Sf));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    });
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var s;
      return !((s = n.signal) != null && s.aborted);
    });
    if (this.waiting.filter((n) => {
      var s;
      return (s = n.signal) == null ? void 0 : s.aborted;
    }).forEach((n) => n.reject(new DOMException("cancelled", "AbortError"))), this.waiting = [], this.timer = null, t.length === 1) return this.alone(t[0]);
    if (t.length)
      try {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        const n = await je.raw(Mf, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
========
        const n = await je.raw(Ef, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Af, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Ef = new Sf();
class Af {
========
const Of = new Cf();
class Tf {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  constructor() {
    this.follows = [], this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, s, a = () => !0) {
    const o = { window: t, patterns: n, heard: s, visible: a };
    return this.follows.push(o), () => this.follows = this.follows.filter((r) => r !== o);
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.follows = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    for (const n of this.follows)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      n.patterns.some((s) => po(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
========
      n.patterns.some((s) => mo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function po(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Cf = { 1: "refused", 2: "usage", 3: "fault" }, Of = 100, Tf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Bf({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = q({}), declared: u = [], autoScroll: f = "", tabs: m = [], readOnly: y = !1, shared: x = null }) {
  const P = /* @__PURE__ */ new Map(), M = new AbortController(), b = (A) => {
    const I = P.get(A);
    if (I && performance.now() - I.at < Of) return I.answer;
    const ee = At(e, A, t, M.signal);
    return P.set(A, { answer: ee, at: performance.now() }), ee;
========
function mo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Bf = Symbol("pane-page"), If = { 1: "refused", 2: "usage", 3: "fault" }, Rf = 100, Lf = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Df({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: c = j({}), declared: u = [], page: f = null, setOption: g = () => {
}, autoScroll: k = "", tabs: _ = [], readOnly: D = !1, shared: P = null }) {
  const b = /* @__PURE__ */ new Map(), E = new AbortController(), H = (V) => {
    const y = b.get(V);
    if (y && performance.now() - y.at < Rf) return y.answer;
    const m = Et(e, V, t, E.signal);
    return b.set(V, { answer: m, at: performance.now() }), m;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  };
  return {
    window: e,
    environment: t,
    agent: n,
    page: f,
    visible: C(() => s()),
    permissions: a,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    autoScroll: f,
    tabs: m,
    readOnly: y,
    shared: x,
    read: b,
    run: (A) => At(e, A, t, M.signal),
    upload: (A) => Rf(A, M.signal),
    cancel: () => M.abort(),
    follow: (A, I) => r.follow(e, A.filter((ee) => o.some((k) => po(k, ee))), I, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (A) => O(() => {
      var I;
      return c.value[A] ?? ((I = u.find((ee) => ee.key === A)) == null ? void 0 : I.default);
    }),
    setting: async (A, I) => {
      const ee = await b(`window setting ${e} ${A}`);
      return ee.ok ? ee.value.value : I;
    },
    keep: (A, I) => At(e, ["window", "save-setting", e, A, JSON.stringify(I)], t, M.signal)
  };
}
function If(e) {
========
    autoScroll: k,
    tabs: _,
    readOnly: D,
    shared: P,
    read: H,
    run: (V) => Et(e, V, t, E.signal),
    upload: (V) => jf(V, E.signal),
    cancel: () => E.abort(),
    follow: (V, y) => r.follow(e, V.filter((m) => o.some((I) => mo(I, m))), y, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (V) => C(() => {
      var y;
      return c.value[V] ?? ((y = u.find((m) => m.key === V)) == null ? void 0 : y.default);
    }),
    setting: async (V, y) => {
      const m = await H(`window setting ${e} ${V}`);
      return m.ok ? m.value.value : y;
    },
    setOption: g,
    keep: (V, y) => Et(e, ["window", "save-setting", e, V, JSON.stringify(y)], t, E.signal)
  };
}
function Nf(e) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const un = { ok: !1, failure: "cancelled", error: "" };
async function At(e, t, n, s = void 0) {
  try {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const a = await Ef.add({ window: e, line: Array.isArray(t) ? t : Lf(t), environment: n }, s);
    return s != null && s.aborted ? un : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Cf[a.code] || "fault", error: If(a.error) };
========
    const a = await Of.add({ window: e, line: Array.isArray(t) ? t : Pf(t), environment: n }, s);
    return s != null && s.aborted ? cn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: If[a.code] || "fault", error: Nf(a.error) };
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  } catch (a) {
    return s != null && s.aborted ? un : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
async function Rf(e, t = void 0) {
========
async function jf(e, t = void 0) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? un : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? un : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Lf(e) {
  return [...e.matchAll(Tf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function Df({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Nf = {
  class: "allowance-prompt",
  role: "dialog"
}, jf = { class: "allowance-prompt-text" }, Pf = { class: "allowance-prompt-buttons" }, qf = {
========
function Pf(e) {
  return [...e.matchAll(Lf)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function qf({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Wf = {
  class: "allowance-prompt",
  role: "dialog"
}, Ff = { class: "allowance-prompt-text" }, Hf = { class: "allowance-prompt-buttons" }, Uf = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), d("div", Nf, [
      p("p", jf, w(U(Df)(e.request)), 1),
      p("div", Pf, [
        H(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            he("Allow", -1)
========
    return (s, a) => (l(), d("div", Wf, [
      p("p", Ff, w(G(qf)(e.request)), 1),
      p("div", Hf, [
        F(we, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ue("Allow", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ])]),
          _: 1
        }),
        F(we, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          default: z(() => [...a[3] || (a[3] = [
            he("Not now", -1)
========
          default: U(() => [...a[3] || (a[3] = [
            ue("Not now", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ])]),
          _: 1
        })
      ])
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Wf = /* @__PURE__ */ J(qf, [["__scopeId", "data-v-102dc765"]]), Bn = {
========
}, Vf = /* @__PURE__ */ J(Uf, [["__scopeId", "data-v-102dc765"]]), Tn = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), G(nn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: z(() => [
        he(w(e.reason) + " ", 1),
        e.retry ? (l(), G(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            he("Retry", -1)
========
    return (s, a) => (l(), K(tn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: U(() => [
        ue(w(e.reason) + " ", 1),
        e.retry ? (l(), K(we, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: U(() => [...a[2] || (a[2] = [
            ue("Retry", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ])]),
          _: 1
        })) : L("", !0),
        e.removable ? (l(), K(we, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          default: z(() => [...a[3] || (a[3] = [
            he("Remove tab", -1)
========
          default: U(() => [...a[3] || (a[3] = [
            ue("Remove tab", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ])]),
          _: 1
        })) : L("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Ff = ["data-window", "data-agent"], Hf = {
========
}, zf = ["data-window", "data-agent"], Gf = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "WindowHost",
  props: {
    name: { type: String, required: !0 },
    component: { type: Object, default: null },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, default: "" },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, default: () => ({ reads: [], runs: [], missing: [], ask: async () => !0 }) },
    prompts: { type: Object, default: null },
    events: { type: Array, default: () => [] },
    unavailableReason: { type: String, default: "" },
    options: { type: Object, default: () => ({}) },
    declared: { type: Array, default: () => [] },
    autoScroll: { type: String, default: "" },
    tabs: { type: Array, default: () => [] },
    readOnly: Boolean,
    shared: { type: Object, default: null }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = j(""), o = j(0);
    function r() {
      a.value = "", o.value++;
    }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const i = Le(xr, null), c = Bf({
========
    const i = Ae(Sr, null), c = Df({
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: C(() => n.options),
      declared: n.declared,
      page: Ae(Bf, null),
      setOption: (g, k) => s("option", g, k),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (g, k) => {
        s("open", g, k), i == null || i(g, k);
      }
    });
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    Zo(Ne, c), ke(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ae(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), Xo((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const u = () => ps(n.component), f = () => {
      var m, y;
      return ((y = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : y.window) === n.name ? n.prompts.current.value : null;
========
    Qo(Ne, c), ke(() => n.visible, (g) => g && n.subscriptions.shown(n.name)), Ce(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), er((g) => (a.value = g instanceof Error ? g.message : String(g), n.subscriptions.stopAll(n.name), !1));
    const u = () => ms(n.component), f = () => {
      var g, k;
      return ((k = (g = n.prompts) == null ? void 0 : g.current.value) == null ? void 0 : k.window) === n.name ? n.prompts.current.value : null;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    };
    return (g, k) => (l(), d("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      f() ? (l(), G(Wf, {
        key: 0,
        request: f(),
        onAnswer: y[0] || (y[0] = (x) => e.prompts.answer(x))
      }, null, 8, ["request"])) : j("", !0),
      e.unavailableReason ? (l(), G(Bn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), G(Bn, {
========
      f() ? (l(), K(Vf, {
        key: 0,
        request: f(),
        onAnswer: k[0] || (k[0] = (_) => e.prompts.answer(_))
      }, null, 8, ["request"])) : L("", !0),
      e.unavailableReason ? (l(), K(Tn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (l(), K(Tn, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, ["name", "reason"])) : e.component ? (l(), G(u, { key: o.value })) : (l(), G(Bn, {
========
      }, null, 8, ["name", "reason"])) : e.component ? (l(), K(u, { key: o.value })) : (l(), K(Tn, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: k[1] || (k[1] = (_) => s("remove"))
      }, null, 8, ["name"]))
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    ], 8, Ff));
  }
}, mo = /* @__PURE__ */ J(Hf, [["__scopeId", "data-v-78089ffa"]]), Uf = {
========
    ], 8, zf));
  }
}, go = /* @__PURE__ */ J(Gf, [["__scopeId", "data-v-04dd3be3"]]), Kf = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "FrameWindow",
  props: {
    entry: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, default: () => ({ reads: [], runs: [], missing: [], ask: async () => !0 }) },
    prompts: { type: Object, default: null },
    options: { type: Object, default: () => ({}) }
  },
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  setup(e) {
    const t = e, n = { render: () => ps($f, { src: t.entry.entry_url }) };
    return (s, a) => (l(), G(mo, {
========
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = { render: () => ms(Mf, { src: n.entry.entry_url }) };
    return (o, r) => (l(), K(go, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      key: e.entry.entry_url,
      name: e.entry.name,
      component: a,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: r[0] || (r[0] = (i, c) => s("option", i, c))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "events", "unavailable-reason"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, rs = "journal.stale-build-reload", Vf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function zf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(rs) === e.message) return !1;
    t.setItem(rs, e.message);
========
}, as = "journal.stale-build-reload", Yf = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Jf(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(as) === e.message) return !1;
    t.setItem(as, e.message);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  } catch {
    return !1;
  }
  return n(), !0;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Gf(e = window.sessionStorage) {
  try {
    e.removeItem(rs);
========
function Zf(e = window.sessionStorage) {
  try {
    e.removeItem(as);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  } catch {
    return;
  }
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Kf = ["data-window"], Yf = {
========
const Xf = ["data-window"], Qf = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "PageWindow",
  props: {
    entry: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    permissions: { type: Object, required: !0 },
    prompts: { type: Object, default: null },
    options: { type: Object, default: () => ({}) }
  },
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  setup(e) {
    const t = e, n = mn(null), s = q("");
========
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = pn(null), o = j("");
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    return ke(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              a
            )).default, Gf();
          } catch (o) {
            if (Vf(o) && zf(o)) return;
            s.value = `This window's file could not be loaded: ${o.message}`;
========
              r
            )).default, Zf();
          } catch (i) {
            if (Yf(i) && Jf(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (l(), d("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      H(wt, { shape: "cards" })
    ], 8, Kf)) : (l(), G(mo, {
========
      F(wt, { shape: "cards" })
    ], 8, Xf)) : (l(), K(go, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      key: e.entry.entry_url,
      name: e.entry.name,
      component: a.value,
      subscriptions: e.subscriptions,
      environment: e.environment,
      agent: e.agent,
      visible: e.visible,
      permissions: e.permissions,
      prompts: e.prompts,
      options: e.options,
      declared: e.entry.options,
      "auto-scroll": e.entry.auto_scroll,
      tabs: e.entry.tabs,
      events: e.entry.events,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: i[0] || (i[0] = (c, u) => s("option", c, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "events", "unavailable-reason"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Jf = {
========
}, e1 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var i;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const t = e, n = new Af(), s = ((i = Le(Ne, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = O(() => ({
========
    const t = e, n = new Tf(), s = ((i = Ae(Ne, null)) == null ? void 0 : i.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = C(() => ({
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    })), r = O(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), G(Yf, {
      key: 0,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), G(Uf, {
      key: 1,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
========
    })), r = C(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, u) => r.value ? (l(), K(Qf, {
      key: 0,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (l(), K(Kf, {
      key: 1,
      entry: o.value,
      subscriptions: G(n),
      environment: G(s),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Zf = { class: "mark-more-inner" }, Xf = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Qf = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, e1 = {
  key: 3,
  class: "mark-lines"
}, t1 = "process", ra = "task", n1 = 2e3, s1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Le(Ne), s = O(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = O(() => fo.has(t.mark.variant) && t.mark.detail || ""), o = O(() => t.mark.target_model === ra ? t.mark.target_id : 0), r = q([]), i = q(!1), c = q(""), u = O(() => t.mark.target_model === t1 && !!t.mark.target_id);
========
}, t1 = { class: "mark-more-inner" }, n1 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, s1 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, a1 = {
  key: 3,
  class: "mark-lines"
}, o1 = "process", la = "task", r1 = 2e3, i1 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ae(Ne), s = C(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = C(() => po.has(t.mark.variant) && t.mark.detail || ""), o = C(() => t.mark.target_model === la ? t.mark.target_id : 0), r = j([]), i = j(!1), c = j(""), u = C(() => t.mark.target_model === o1 && !!t.mark.target_id);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    async function f() {
      const _ = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, c.value = _.ok ? "" : _.error, _.ok && (r.value = _.value.lines);
    }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    let m = null;
    const y = () => clearInterval(m);
    return ke(() => t.shown && u.value, (x) => {
      y(), x && (f(), t.mark.ended_at || (m = setInterval(f, n1)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (x) => x && t.shown && u.value && (y(), f())), Ae(y), (x, P) => (l(), d("div", {
      class: Q(["mark-more", { open: e.shown }]),
      onClick: P[1] || (P[1] = _e(() => {
      }, ["stop"]))
    }, [
      p("div", Zf, [
        e.declaration.body_url ? (l(), G(Jf, {
========
    let g = null;
    const k = () => clearInterval(g);
    return ke(() => t.shown && u.value, (_) => {
      k(), _ && (f(), t.mark.ended_at || (g = setInterval(f, r1)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (_) => _ && t.shown && u.value && (k(), f())), Ce(k), (_, D) => (l(), d("div", {
      class: ee(["mark-more", { open: e.shown }]),
      onClick: D[1] || (D[1] = Me(() => {
      }, ["stop"]))
    }, [
      p("div", t1, [
        e.declaration.body_url ? (l(), K(e1, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(X, { key: 1 }, [
          a.value ? (l(), d(X, { key: 0 }, [
            P[2] || (P[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Xf, w(a.value), 1)
          ], 64)) : j("", !0),
          u.value && c.value ? (l(), d("p", Qf, w(c.value), 1)) : u.value && i.value ? (l(), d(X, { key: 2 }, [
            P[3] || (P[3] = p("p", { class: "mark-label" }, "Output", -1)),
            H(pf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", e1, w(s.value.join(`
`)), 1)) : j("", !0),
========
        }, null, 8, ["declaration", "row", "head"])) : (l(), d(Q, { key: 1 }, [
          a.value ? (l(), d(Q, { key: 0 }, [
            D[2] || (D[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", n1, w(a.value), 1)
          ], 64)) : L("", !0),
          u.value && c.value ? (l(), d("p", s1, w(c.value), 1)) : u.value && i.value ? (l(), d(Q, { key: 2 }, [
            D[3] || (D[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(vf, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (l(), d("p", a1, w(s.value.join(`
`)), 1)) : L("", !0),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          o.value ? (l(), d("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: P[0] || (P[0] = _e((M) => U(it)(`${ra}:${o.value}`), ["stop"]))
          }, "Open task " + w(o.value) + " and its proofs", 1)) : j("", !0)
========
            onClick: D[0] || (D[0] = Me((P) => G(it)(`${la}:${o.value}`), ["stop"]))
          }, "Open task " + w(o.value) + " and its proofs", 1)) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ], 64))
      ])
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, is = /* @__PURE__ */ J(s1, [["__scopeId", "data-v-51f69bf1"]]), a1 = (e) => `show-${e}`, Nv = (e, t, n) => e.filter((s) => {
  var a;
  return n(a1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), o1 = "messages.chat", r1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), ls = (e, t, n) => At(o1, r1(e, t), n), i1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, l1 = ["title", "aria-label", "onClick"], c1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, u1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = O(() => i1(t.buttons, t.allowedRuns).filter((r) => {
========
}, os = /* @__PURE__ */ J(i1, [["__scopeId", "data-v-51f69bf1"]]), l1 = (e) => `show-${e}`, Yv = (e, t, n) => e.filter((s) => {
  var a;
  return n(l1((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), c1 = "messages.chat", u1 = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), rs = (e, t, n) => Et(c1, u1(e, t), n), d1 = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, h1 = ["title", "aria-label", "onClick"], f1 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, p1 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = C(() => d1(t.buttons, t.allowedRuns).filter((r) => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = j(""), a = Ae(Ne);
    async function o(r) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      const i = await ls(r, t.mark, a.environment);
========
      const i = await rs(r, t.mark, a.environment);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (l(), d(Q, null, [
      (l(!0), d(Q, null, oe(n.value, (c) => (l(), d("button", {
        key: c.runs,
        type: "button",
        class: "mark-button",
        title: c.label,
        "aria-label": c.label,
        onClick: _e((u) => o(c), ["stop"])
      }, [
        F(Ve, {
          name: c.icon
        }, null, 8, ["name"])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ], 8, l1))), 128)),
      s.value ? (l(), d("span", c1, w(s.value), 1)) : j("", !0)
    ], 64));
  }
}, d1 = /* @__PURE__ */ J(u1, [["__scopeId", "data-v-0dfda102"]]);
function go(e, t) {
  const n = mn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
========
      ], 8, h1))), 128)),
      s.value ? (l(), d("span", f1, w(s.value), 1)) : L("", !0)
    ], 64));
  }
}, m1 = /* @__PURE__ */ J(p1, [["__scopeId", "data-v-0dfda102"]]);
function vo(e, t) {
  const n = pn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const vo = go("/api/marks", "marks"), jv = vo.fetchAll, h1 = vo.find, f1 = 2e3;
function yo(e, t) {
========
const yo = vo("/api/marks", "marks"), Jv = yo.fetchAll, g1 = yo.find, v1 = 2e3;
function wo(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  let n = null;
  const s = () => {
    n = setTimeout(async () => {
      t() && await e(), s();
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    }, f1);
========
    }, v1);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  };
  De(async () => {
    await e(), s();
  }), yt(() => clearTimeout(n));
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const p1 = ["data-ref"], m1 = ["data-ref"], g1 = { class: "mark-row" }, v1 = "dock add", y1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = O(() => h1(s.mark.type)), o = Le(Ne, null), r = O(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = q(null);
    yo(async () => {
========
const y1 = ["data-ref"], w1 = ["data-ref"], k1 = { class: "mark-row" }, b1 = "dock add", $1 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = C(() => g1(s.mark.type)), o = Ae(Ne, null), r = C(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = j(null);
    wo(async () => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      if (!r.value) return;
      const k = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      k.ok && k.value.rows.length && (i.value = k.value.rows[0].progress);
    }, () => r.value);
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const c = O(() => {
      const y = rf(s.mark, a.value), x = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && x ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = O(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && fo.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), f = q(!1), m = O(() => {
      var y, x, P;
      return s.docked ? (x = (y = a.value) == null ? void 0 : y.buttons) == null ? void 0 : x.filter((M) => {
        var b;
        return !((b = M.runs) != null && b.startsWith(v1));
      }) : (P = a.value) == null ? void 0 : P.buttons;
    });
    return (y, x) => {
      var P, M;
      return (P = a.value) != null && P.card ? (l(), d("div", {
========
    const c = C(() => {
      const k = uf(s.mark, a.value), _ = !k.figure || k.figure.endsWith("%");
      return i.value && r.value && _ ? { ...k, figure: `${i.value}%`, fraction: i.value / 100 } : k;
    }), u = C(() => {
      var k;
      return !!(s.mark.lines || s.mark.detail && po.has(s.mark.variant) || t.has(s.mark.target_model) || (k = a.value) != null && k.body_url);
    }), f = j(!1), g = C(() => {
      var k, _, D;
      return s.docked ? (_ = (k = a.value) == null ? void 0 : k.buttons) == null ? void 0 : _.filter((P) => {
        var b;
        return !((b = P.runs) != null && b.startsWith(b1));
      }) : (D = a.value) == null ? void 0 : D.buttons;
    });
    return (k, _) => {
      var D, P;
      return (D = a.value) != null && D.card ? (l(), d("div", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 0,
        class: "thread-turn card whole-card",
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        H(is, {
========
        F(os, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ], 8, p1)) : (l(), d("div", {
        key: 1,
        class: Q(["thread-turn", "card", { "full-width": (M = a.value) == null ? void 0 : M.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", g1, [
          H(uo, ot({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, Qo(c.value.handlers), {
            onClick: x[0] || (x[0] = (b) => f.value = !f.value)
          }), er({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: z(({ shown: b }) => [
                H(is, {
========
      ], 8, y1)) : (l(), d("div", {
        key: 1,
        class: ee(["thread-turn", "card", { "full-width": (P = a.value) == null ? void 0 : P.full_width, docked: e.docked, "user-side": G(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", k1, [
          F(ho, ot({
            mark: c.value,
            open: u.value ? f.value : void 0
          }, tr(c.value.handlers), {
            onClick: _[0] || (_[0] = (b) => f.value = !f.value)
          }), nr({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: U(({ shown: b }) => [
                F(os, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: b
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          H(d1, {
            buttons: m.value,
========
          F(m1, {
            buttons: g.value,
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ], 10, m1));
    };
  }
}, w1 = /* @__PURE__ */ J(y1, [["__scopeId", "data-v-b5431d49"]]), k1 = ["data-ref"], b1 = ["inert"], $1 = { class: "thread-group" }, x1 = {
========
      ], 10, w1));
    };
  }
}, x1 = /* @__PURE__ */ J($1, [["__scopeId", "data-v-b143e18d"]]), _1 = ["data-ref"], M1 = ["inert"], S1 = { class: "thread-group" }, E1 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = j(!1), s = j(!1);
    ke(n, () => s.value = !0);
    const a = C(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (o, r) => (l(), d("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      H(uo, {
========
      F(ho, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        mark: a.value,
        open: n.value,
        onClick: r[0] || (r[0] = (i) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (l(), d("div", {
        key: 0,
        class: Q(["group-rows", { open: n.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        p("div", $1, [
          (l(!0), d(X, null, re(e.group.marks, (i) => (l(), G(w1, {
========
        p("div", S1, [
          (l(!0), d(Q, null, oe(e.group.marks, (i) => (l(), K(x1, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: i.id,
            mark: i
          }, null, 8, ["mark"]))), 128))
        ])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ], 10, b1)) : j("", !0)
    ], 8, k1));
  }
}, Pv = /* @__PURE__ */ J(x1, [["__scopeId", "data-v-8a285510"]]);
function M1(e) {
  const t = q(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), yt(() => n.disconnect()), t;
}
const _1 = { class: "chat-dock-fold" }, S1 = ["aria-label"], E1 = { class: "chat-dock-head" }, A1 = { class: "chat-dock-inner" }, wo = 700, C1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = q(null), s = q(null), a = M1(s), o = q(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, wo)), yt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: Q(["chat-dock", { lifted: e.lifted }])
========
      ], 10, M1)) : L("", !0)
    ], 8, _1));
  }
}, Zv = /* @__PURE__ */ J(E1, [["__scopeId", "data-v-8a285510"]]);
function A1(e) {
  const t = j(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return De(() => n.observe(e.value)), yt(() => n.disconnect()), t;
}
const C1 = { class: "chat-dock-fold" }, O1 = ["aria-label"], T1 = { class: "chat-dock-head" }, B1 = { class: "chat-dock-inner" }, I1 = 700, R1 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = j(null), s = j(null), a = A1(s), o = j(!1);
    let r = 0;
    return De(() => r = setTimeout(() => o.value = !0, I1)), yt(() => clearTimeout(r)), t({ card: n }), (i, c) => (l(), d("div", {
      class: ee(["chat-dock", { lifted: e.lifted }])
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }, [
      p("div", C1, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Q(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          we(i.$slots, "edge"),
          p("header", E1, [
            we(i.$slots, "head")
========
          ye(i.$slots, "edge"),
          p("header", T1, [
            ye(i.$slots, "head")
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ]),
          p("div", {
            class: Q(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            p("div", A1, [
              p("div", {
                class: Q(["chat-dock-grow", { settled: o.value }]),
                style: be(U(a) === null ? null : { height: `${U(a)}px` })
========
            p("div", B1, [
              p("div", {
                class: ee(["chat-dock-grow", { settled: o.value }]),
                style: $e(G(a) === null ? null : { height: `${G(a)}px` })
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  ye(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        ], 10, S1)
      ])
    ], 2));
  }
}, ko = /* @__PURE__ */ J(C1, [["__scopeId", "data-v-63e4dcfc"]]), O1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, In = 5, T1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(In, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${In}s`, animationDelay: `${(n - In).toFixed(2)}s` };
    return (a, o) => (l(), d("span", O1, [
      p("i", { style: s })
    ]));
  }
}, B1 = /* @__PURE__ */ J(T1, [["__scopeId", "data-v-d0c4b012"]]), bo = go("/api/docks", "docks"), qv = bo.fetchAll, cs = bo.find, I1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), us = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), R1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), L1 = (e) => e.kept ? us("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : us("keep", "pin", "Pin", `dock keep ${e.id}`);
function D1(e, t) {
========
        ], 10, O1)
      ])
    ], 2));
  }
}, ko = /* @__PURE__ */ J(R1, [["__scopeId", "data-v-63e4dcfc"]]), L1 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, Bn = 5, D1 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(Bn, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${Bn}s`, animationDelay: `${(n - Bn).toFixed(2)}s` };
    return (a, o) => (l(), d("span", L1, [
      p("i", { style: s })
    ]));
  }
}, N1 = /* @__PURE__ */ J(D1, [["__scopeId", "data-v-d0c4b012"]]), bo = vo("/api/docks", "docks"), Xv = bo.fetchAll, is = bo.find, j1 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ls = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), P1 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), q1 = (e) => e.kept ? ls("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : ls("keep", "pin", "Pin", `dock keep ${e.id}`);
function W1(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var n;
  return [
    ...P1(e, t) ? [q1(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Nt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    us("undock", "close", "Undock", `dock remove ${e.id}`)
========
    ls("undock", "close", "Undock", `dock remove ${e.id}`)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  ];
}
const F1 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: j1(e, t),
  buttons: W1(e, t)
}), H1 = { class: "dock-title" }, U1 = ["aria-expanded", "title"], V1 = { class: "chat-dock-acts dock-acts" }, z1 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, G1 = {
  key: 1,
  class: "dock-text"
}, K1 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = t, s = e, a = O(() => cs(s.item.type)), o = q(null), r = O(() => N1(s.item, a.value)), i = Le(Ne), c = q(/* @__PURE__ */ new Set()), u = q("");
    async function f(x) {
      if (x.action === "open") return it(`${s.item.target_model}:${s.item.target_id}`);
      if (x.action !== "declared") return ls(x, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, x.label]), u.value = "";
      const P = await ls(x, s.item, i.environment);
      (P == null ? void 0 : P.ok) === !1 && (c.value = new Set([...c.value].filter((M) => M !== x.label)), u.value = P.error);
    }
    const m = O(() => r.value.buttons.filter((x) => x.action !== "undock" && !c.value.has(x.label))), y = O(() => r.value.buttons.find((x) => x.action === "undock"));
    return (x, P) => (l(), G(ko, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: z(() => [
        e.leaving ? (l(), G(B1, {
========
    const n = t, s = e, a = C(() => is(s.item.type)), o = j(null), r = C(() => F1(s.item, a.value)), i = Ae(Ne), c = j(/* @__PURE__ */ new Set()), u = j("");
    async function f(_) {
      if (_.action === "open") return it(`${s.item.target_model}:${s.item.target_id}`);
      if (_.action !== "declared") return rs(_, s.item, i.environment);
      c.value = /* @__PURE__ */ new Set([...c.value, _.label]), u.value = "";
      const D = await rs(_, s.item, i.environment);
      (D == null ? void 0 : D.ok) === !1 && (c.value = new Set([...c.value].filter((P) => P !== _.label)), u.value = D.error);
    }
    const g = C(() => r.value.buttons.filter((_) => _.action !== "undock" && !c.value.has(_.label))), k = C(() => r.value.buttons.find((_) => _.action === "undock"));
    return (_, D) => (l(), K(ko, {
      label: r.value.title,
      folded: e.folded
    }, {
      edge: U(() => [
        e.leaving ? (l(), K(N1, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : L("", !0)
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      head: z(() => {
        var M, b, A;
        return [
          (M = a.value) != null && M.draws_head ? (l(), d("span", {
========
      head: U(() => {
        var P, b, E;
        return [
          (P = a.value) != null && P.draws_head ? (l(), d("span", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (l(), d(Q, { key: 1 }, [
            F(be, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", H1, w(r.value.title), 1)
          ], 64)),
          (b = a.value) != null && b.badge ? (l(), d("span", {
            key: 2,
            class: Q(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, w(a.value.badge), 3)) : L("", !0),
          (E = a.value) != null && E.draws_head ? L("", !0) : (l(), d("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: D[0] || (D[0] = (H) => n("fold"))
          }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            H(Bt, {
========
            F(Bt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, U1)),
          p("span", V1, [
            (l(!0), d(Q, null, oe(g.value, (H) => (l(), K(we, {
              key: H.action + H.runs,
              small: "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              kind: I.primary ? "primary" : "ghost",
              bordered: !I.primary,
              "data-dock-action": I.action,
              onClick: (ee) => f(I)
            }, {
              default: z(() => [
                he(w(I.label), 1)
========
              kind: H.primary ? "primary" : "ghost",
              bordered: !H.primary,
              "data-dock-action": H.action,
              onClick: (V) => f(H)
            }, {
              default: U(() => [
                ue(w(H.label), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              ]),
              _: 2
            }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128))
          ]),
          F(ws, {
            title: k.value.label,
            "data-dock-action": "undock",
            onClick: D[1] || (D[1] = (H) => f(k.value))
          }, null, 8, ["title"])
        ];
      }),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      default: z(() => {
        var M, b;
        return [
          u.value ? (l(), d("p", W1, w(u.value), 1)) : j("", !0),
          e.item.text && !((M = a.value) != null && M.body_url) ? (l(), d("p", F1, w(e.item.text), 1)) : j("", !0),
          (b = a.value) != null && b.body_url ? (l(), G(is, {
========
      default: U(() => {
        var P, b;
        return [
          u.value ? (l(), d("p", z1, w(u.value), 1)) : L("", !0),
          e.item.text && !((P = a.value) != null && P.body_url) ? (l(), d("p", G1, w(e.item.text), 1)) : L("", !0),
          (b = a.value) != null && b.body_url ? (l(), K(os, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : L("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded"]));
  }
}, ca = /* @__PURE__ */ J(K1, [["__scopeId", "data-v-608c189e"]]), Y1 = ["title", "aria-label"], J1 = { class: "run-chip-in" }, Z1 = {
  key: 0,
  class: "run-chip-ring"
}, X1 = { class: "run-chip-name" }, Q1 = { class: "run-chip-bar" }, ep = "processes.output", tp = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var f;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((f = Ae(Ne, null)) == null ? void 0 : f.environment) ?? "", o = j(null), r = C(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = C(() => {
      var g, k;
      return ((g = o.value) == null ? void 0 : g.title) || ((k = o.value) == null ? void 0 : k.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = C(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      const m = await At(Y1, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return yo(u, () => r.value), (m, y) => {
      var x;
========
      const g = await Et(ep, ["process", "card", String(s.item.target_id)], a);
      g.ok && (o.value = g.value);
    }
    return wo(u, () => r.value), (g, k) => {
      var _;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      return l(), d("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: $e({ "--tone": c.value })
      }, [
        p("span", J1, [
          r.value ? (l(), d("span", Z1)) : (l(), K(Ve, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", X1, w(i.value), 1)
        ]),
        p("span", Q1, [
          p("i", {
            style: $e({ width: r.value ? `${((_ = o.value) == null ? void 0 : _.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, Y1);
    };
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Z1 = /* @__PURE__ */ J(J1, [["__scopeId", "data-v-2036e274"]]), X1 = 24, Q1 = 8, Wv = 420;
function Fv({ top: e, before: t, height: n, shown: s }) {
========
}, np = /* @__PURE__ */ J(tp, [["__scopeId", "data-v-2036e274"]]), sp = 24, ap = 8, Qv = 420;
function ey({ top: e, before: t, height: n, shown: s }) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const a = n - e - s;
  return a <= sp && e > t ? !0 : e < t && a > ap ? !1 : null;
}
const op = (e, t) => e === void 0 ? t : e, rp = 6, ip = 3, ua = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, St = (e) => !!(e.leaves_at && !e.kept), sp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!St(e) || t < e.leaves_at || n.has(e.id)), ap = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => sp(s, t, n)).sort((s, a) => s.id - a.id);
function op(e, t, n = tp) {
========
}, cs = (e) => !!(e.leaves_at && !e.kept), lp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!cs(e) || t < e.leaves_at || n.has(e.id)), cp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => lp(s, t, n)).sort((s, a) => s.id - a.id);
function up(e, t, n = rp) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const rp = (e, t) => e >= np ? !0 : e <= 1 ? !1 : t, ip = {
  key: "runs-head",
  class: "dock-runs-head"
}, lp = { class: "dock-runs-chips" }, cp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = q(Date.now() / 1e3), s = q(/* @__PURE__ */ new Set()), a = q(!1), o = q(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ae(() => clearInterval(r));
    const i = O(() => ap(t.items, n.value, s.value)), c = O(() => op(i.value.filter((I) => la(I, cs)), n.value)), u = O(() => i.value.filter((I) => !c.value.includes(I) && !la(I, cs))), f = O(() => (a.value = rp(c.value.length, a.value)) && !o.value), m = q({}), y = (I) => ep(m.value[I.id], t.folded);
    function x(I) {
      m.value = { ...m.value, [I.id]: !y(I) };
    }
    function P(I) {
      m.value = { ...m.value, ...Object.fromEntries(c.value.map((ee) => [ee.id, ee.id !== I.id])) }, o.value = !0;
    }
    function M() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([I]) => !c.value.some((ee) => String(ee.id) === I))), o.value = !1;
    }
    function b(I) {
      s.value = /* @__PURE__ */ new Set([...s.value, I.id]);
    }
    function A(I) {
      s.value = new Set([...s.value].filter((ee) => ee !== I.id));
    }
    return (I, ee) => (l(), G(ya, {
      tag: "div",
      name: "dock",
      duration: U(wo),
      class: "dock-stack"
    }, {
      default: z(() => [
        (l(!0), d(X, null, re(u.value, (k) => (l(), G(ia, {
          key: k.id,
          item: k,
          class: Q({ timed: U(St)(k) }),
          leaving: U(St)(k) && !s.value.has(k.id),
          folded: y(k),
          onFold: (v) => x(k),
          onMouseenter: (v) => b(k),
          onMouseleave: (v) => A(k)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (l(), d("div", ip, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: M
          }, [
            he(w(c.value.length) + " runs ", 1),
            H(Bt, { open: "" })
          ])
        ])) : j("", !0),
        (l(!0), d(X, null, re(f.value ? [] : c.value, (k) => (l(), G(ia, {
          key: k.id,
          item: k,
          class: Q({ timed: U(St)(k) }),
          leaving: U(St)(k) && !s.value.has(k.id),
          folded: y(k),
          onFold: (v) => x(k),
          onMouseenter: (v) => b(k),
          onMouseleave: (v) => A(k)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        f.value ? (l(), G(ko, {
          key: "runs-row",
          label: `${c.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: z(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: ee[0] || (ee[0] = (k) => o.value = !0)
            }, [
              H(Ve, { name: "runs" }),
              he(" " + w(c.value.length) + " runs ", 1),
              H(Bt)
            ]),
            p("span", lp, [
              (l(!0), d(X, null, re(c.value, (k) => (l(), G(Z1, {
                key: k.id,
                item: k,
                onClick: (v) => P(k)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : j("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Hv = /* @__PURE__ */ J(cp, [["__scopeId", "data-v-98291381"]]), Et = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Qt = (e) => Math.min(Math.max(e, 0), 1), up = (e) => {
  const t = Qt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => up((e - t) / (n - t));
function Uv(e) {
  const t = Qt(e), n = Qt((t - 0.12) / 0.76) * Et.shuffles, s = Math.min(Math.floor(n), Et.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Qt((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / Et.shuffles, lift: Et.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const $o = 2400, dp = 0.05;
function Vv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, dp), r = Math.min(t + $o * o, a), i = e + r * o;
========
const dp = (e, t) => e >= ip ? !0 : e <= 1 ? !1 : t, hp = { class: "dock-stack" }, fp = ["onMouseenter", "onMouseleave"], pp = {
  key: 0,
  class: "dock-runs-head"
}, mp = ["onMouseenter", "onMouseleave"], gp = { class: "dock-runs-chips" }, vp = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = j(Date.now() / 1e3), s = j(/* @__PURE__ */ new Set()), a = j(!1), o = j(!1), r = setInterval(() => n.value = Date.now() / 1e3, 500);
    Ce(() => clearInterval(r));
    const i = C(() => cp(t.items, n.value, s.value)), c = C(() => up(i.value.filter((H) => ua(H, is)), n.value)), u = C(() => i.value.filter((H) => !c.value.includes(H) && !ua(H, is))), f = C(() => (a.value = dp(c.value.length, a.value)) && !o.value), g = j({}), k = (H) => op(g.value[H.id], t.folded);
    function _(H) {
      g.value = { ...g.value, [H.id]: !k(H) };
    }
    function D(H) {
      g.value = { ...g.value, ...Object.fromEntries(c.value.map((V) => [V.id, V.id !== H.id])) }, o.value = !0;
    }
    function P() {
      g.value = Object.fromEntries(Object.entries(g.value).filter(([H]) => !c.value.some((V) => String(V.id) === H))), o.value = !1;
    }
    function b(H) {
      s.value = /* @__PURE__ */ new Set([...s.value, H.id]);
    }
    function E(H) {
      s.value = new Set([...s.value].filter((V) => V !== H.id));
    }
    return (H, V) => (l(), d("div", hp, [
      (l(!0), d(Q, null, oe(u.value, (y) => (l(), d("div", {
        key: y.id,
        onMouseenter: (m) => b(y),
        onMouseleave: (m) => E(y)
      }, [
        F(ca, {
          item: y,
          leaving: G(cs)(y) && !s.value.has(y.id),
          folded: k(y),
          onFold: (m) => _(y)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, fp))), 128)),
      a.value && o.value ? (l(), d("div", pp, [
        p("button", {
          type: "button",
          class: "dock-runs-toggle",
          "aria-expanded": "true",
          title: "Fold the runs into one line",
          "data-dock-runs-fold": "",
          onClick: P
        }, [
          ue(w(c.value.length) + " runs ", 1),
          F(Bt, { open: "" })
        ])
      ])) : L("", !0),
      (l(!0), d(Q, null, oe(f.value ? [] : c.value, (y) => (l(), d("div", {
        key: y.id,
        onMouseenter: (m) => b(y),
        onMouseleave: (m) => E(y)
      }, [
        F(ca, {
          item: y,
          leaving: G(cs)(y) && !s.value.has(y.id),
          folded: k(y),
          onFold: (m) => _(y)
        }, null, 8, ["item", "leaving", "folded", "onFold"])
      ], 40, mp))), 128)),
      f.value ? (l(), K(ko, {
        key: 1,
        label: `${c.value.length} runs`,
        kind: "dock-runs-row"
      }, {
        head: U(() => [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "false",
            title: "Show each run as its own card",
            "data-dock-runs-open": "",
            onClick: V[0] || (V[0] = (y) => o.value = !0)
          }, [
            F(Ve, { name: "runs" }),
            ue(" " + w(c.value.length) + " runs ", 1),
            F(Bt)
          ]),
          p("span", gp, [
            (l(!0), d(Q, null, oe(c.value, (y) => (l(), K(np, {
              key: y.id,
              item: y,
              onClick: (m) => D(y)
            }, null, 8, ["item", "onClick"]))), 128))
          ])
        ]),
        _: 1
      }, 8, ["label"])) : L("", !0)
    ]));
  }
}, ty = /* @__PURE__ */ J(vp, [["__scopeId", "data-v-11842ee6"]]), St = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, Qt = (e) => Math.min(Math.max(e, 0), 1), yp = (e) => {
  const t = Qt(e);
  return t * t * (3 - 2 * t);
}, et = (e, t, n) => yp((e - t) / (n - t));
function ny(e) {
  const t = Qt(e), n = Qt((t - 0.12) / 0.76) * St.shuffles, s = Math.min(Math.floor(n), St.shuffles - 1), a = n - s, o = et(a, 0.26, 0.38) * (1 - et(a, 0.76, 0.96)), r = et(a, 0.38, 0.76), i = et(t, 0, 0.12) * (1 - et(t, 0.88, 1)), c = et(a, 0.2, 0.34) * (1 - et(a, 0.84, 1)), u = Math.sin(Math.PI * Qt((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / St.shuffles, lift: St.lift * o, ready: i, weight: c, follow: u, shuffle: s, phase: a };
}
const $o = 2400, wp = 0.05;
function sy({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, wp), r = Math.min(t + $o * o, a), i = e + r * o;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
const Ze = {
  // a celebration: it jumps for joy `jumps` times with its arms flung up, each jump a little lower than the last
  joy: { frames: 50, fps: 14, jumps: 5 },
  // a worker sent off or another session messaged: a call on an old desk telephone (figure.js TELEPHONE). The telephone appears on the
  // floor before it, whole, in a poof of smoke over `poof`, `above` its units over the floor, drops onto it over `drop` and settles with
  // a jiggle over `settle`, squashing `squash` flat as it lands and wobbling `wobbles` times to still (figure.js phoneArrival), its handset
  // resting on the cradle a moment; it bends to the handset over `reach` and lifts it to its ear over `lift`; it bends to the dial and
  // puts a finger in it over `finger` and turns it `turn` degrees over `dial`; over `back` the finger withdraws first for `release` of
  // that phase, then the dial springs back once the finger is clear. It
  // talks over `talk`, nodding `nods` times; it bends to put the handset back on the cradle over `hang`, stands back from it a moment, and the telephone goes in a poof over `goes`
  // While it talks and until the handset is down it says whom it calls in a speech bubble beside its head (figure/places.js callSays)
  // Seated it follows the same phases. The set sits beside and behind the hip, turned inward toward the hands; the torso
  // leans toward it while the far hand dials, then returns upright. `beside` and `behind` place it in the figure's units, `turn` rotates
  // the dial toward its owner, `lean` is the dialling lean in degrees, and `backLean` tips the torso toward the set for pickup.
  // phonePlacement.js reserves the complete rotated base and receiver footprint on the seat.
  phone_call: { frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: { beside: 1.2, behind: 0.95, turn: 45, lean: 20 } },
  // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
  ask_sign: { frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1] },
  // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
  // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
  // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
  scroll: { frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3 },
  // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
  // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
  // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
  hand_rub: { frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1] },
  // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
  type_ponder: { frames: 24, fps: 6 },
  // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
  // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
  // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
  // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
  // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
  // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
  ponder: { frames: 84, fps: 12, into: [0, 0.1], cloud: [0.06, 0.72], sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1] },
  think_cloud: { frames: 66, fps: 12, into: [0, 0.12], cloud: [0.07, 0.86], sways: 2, rise: [0.86, 1] },
  got_it: { frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1] },
  // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
  file_card: { frames: 42, fps: 12, reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72] },
  // searching from the compose box: binoculars at its eyes, tipped `up` degrees up the chat and scanning slowly up and down it `scan`
  // degrees either way, twice, with a little turn left and right
  binoculars: { frames: 100, fps: 10, sweep: 1, up: 9, scan: 6 },
  // searching, now and then: at the edge of the chat window the figure reaches past it into the space beyond, where nothing is seen, and
  // rummages there like a cartoon character hunting through a closet: it turns side-on to the edge and leans in, head and shoulders past
  // it, over `leans`, digging about `digs` times, and flings what it pulls out back over its shoulder, one thing at each of `throws`, each
  // from `from` (the figure's units, across, forward and up, before it turns side-on) on the arc its throw gives it (throwsFor), shrinking
  // away to nothing over `shrinks` once it lands; over `pops` it pulls back out, having found nothing
  rummage: {
    frames: 120,
    fps: 12,
    leans: [0.05, 0.14],
    digs: 7,
    pops: [0.8, 0.9],
    throws: [0.18, 0.28, 0.38, 0.48],
    from: [0, -1.5, 1.5],
    shrinks: 0.05
  },
  // a bar it was eager for failed: crushed at first, then plainly mad about it, stamping and fuming, steam rising off its head
  fume: { frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6 },
  // Each voice has its own angry performance, with a full recovery before ordinary activity resumes.
  tantrum: { frames: 108, fps: 18, hops: 6 },
  // a rope swing tied under a bubble, drawn whole from the act's first frame: its two ropes `rope` of the figure's height long from the
  // middle of the bubble's bottom edge, `ties` of it apart, just outside the figure's arms, down to a seat `seat` of it wide, a little wider
  // than its body, whose top is `under` of it below the line the figure sits on, where its thighs' underside rests. Its frames are an
  // intro, the figure sitting down onto the seat as it starts to swing; a held stretch looped for `swings` pendulum cycles toward the
  // camera and away, `angle` degrees either side of the bottom, around the fixed knots, its legs pumping; and an outro, settling as the
  // figure rises off it. The ropes stay straight and keep their length, the seat rising at both ends of the arc. The knots stand at
  // least `room` of the figure's height in from the chat's sides, with `clearance` extra room kept around the hanging figure.
  rope_swing: { intro: 12, hold: 60, outro: 12, fps: 12, swings: 2, rope: 0.62, ties: 0.53, seat: 0.59, under: 0.025, angle: 20, clearance: 0.12, room: 0.85 },
  // a pogo stick up onto a bubble's top: it reaches behind its back and pulls the stick out over `draw`, bounces `count` times on the spot
  // over `bounces`, each higher than the last up to `bounce` of its height, and springs up over `spring` to the top of its throw, `over`
  // of its height past the bubble's edge; there it lets the stick go over `release`, the stick falling away over `drop`, and it falls
  // onto the bubble on its own feet; every hop and the fall are timed by one gravity (pogoHop); the lower shaft keeps its existing
  // `stick`-based length, with the handles `handles` of the picture's height above the feet, shared by the stick and the hands
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], handles: 0.2455 },
  // a fixed run's bugs: two to five of them crawl along the chat window's walls (WALL_BUGS); the figure first walks to its firing spot,
  // turns its whole body toward each wall (back toward the screen for a top-wall bug), and pulls a rifle from behind its back
  // over `draw` and shoulders it, then shoots them one by one, each in its own `turn` of the act played over again for every bug
  // (bugShotFrame): it swings its aim onto the bug over `aim`, shoots `count` bursts over `shots`, each kicking the rifle and the shoulder
  // back, and the bug splatters on its wall at `splat`; after the last, drops of its splatter fly out at the screen over `fly`, growing
  // as they come, land on it as on a camera's lens at their `lens` places (from the figure's middle, in shares of the picture, as big as
  // `size`), and run down and fade over `drops`, as the rifle is lowered; a bug steeper from the figure's eyes than `back.limit` degrees is
  // first backed away from along the floor, facing it, stepping `back.stride` of the picture at a time, to within it (backPlan), never
  // nearer an end of its floor than `back.margin` of the picture
  bug_shot: {
    frames: 80,
    fps: 12,
    draw: [0, 0.22],
    aim: [0.25, 0.32],
    shots: [0.33, 0.48],
    count: 2,
    splat: 0.48,
    fly: [0.56, 0.64],
    drops: [0.64, 1],
    back: { stride: 0.5 }
  },
  // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
  // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
  // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
  // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
  // which lies flat and fades over `gone`, and lowers the mallet over `lower`
  bug_smash: {
    frames: 96,
    fps: 12,
    walk: [0.16, 0.38],
    raise: [0.46, 0.58],
    swing: [0.66, 0.72],
    blow: 0.72,
    gone: [0.84, 0.95],
    lower: [0.88, 0.95]
  },
  // a sin repented: a halo grows over the head over `grows` and fades over `fades`, the figure floating up `float` of its units and down
  // with its hands folded and a serene, holy look
  halo: { frames: 48, fps: 12, grows: [0, 0.15], fades: [0.85, 1], float: 0.01 },
  // A confession: the hands come to the chest during the descent, the head bows after the shoulders, and the figure rises slowly.
  repent: { frames: 84, fps: 12, stand: [0, 0.12], kneel: [0.12, 0.34], out: [0.18, 0.4], up: [0.34, 0.48], hold: [0.48, 0.74], down: [0.74, 0.86], rise: [0.76, 1] },
  // a disco dance under a disco ball: the classic move, one arm pointing up and the other down, switching sides `beats` times, the hips
  // swaying and the knees bouncing, the visor flashing through the colours; the ball `ball` of the picture across, turning, hung `clear`
  // of it over the hat, on a string at least `tie` of it long from the bottom of a bubble no further than `far` of the figure's height
  // above the hat
  disco: { frames: 96, fps: 12, beats: 8 },
  // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
  // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
  // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
  // `outer`, swung `over` degrees before the inner so its foot crosses over in front
  lean: { wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42 },
  // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
  // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
  chute: { frames: 24, fps: 8, width: 0.66 },
  // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
  // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
  pack_box: { intro: 36, hold: 24, outro: 26, fps: 12, hop: [0.3, 0.62], into: [0.55, 0.88], pops: 0.38, leap: [0.38, 0.88] },
  // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
  press: { intro: 24, hold: 24, outro: 24, fps: 12, squashes: [0.5, 1], frees: [0, 0.3] },
  // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
  vacuum: { intro: 10, hold: 40, outro: 10, fps: 10 }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, ds = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), hp = (e) => e * e * (3 - 2 * e), dn = (e, [t, n]) => hp(ds(e, t, n)), fp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Kt = ([e, t], n) => e + n() * (t - e);
function pp(e) {
  return fp.map(() => {
========
}, us = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), kp = (e) => e * e * (3 - 2 * e), un = (e, [t, n]) => kp(us(e, t, n)), bp = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Ye = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Kt = ([e, t], n) => e + n() * (t - e);
function $p(e) {
  return bp.map(() => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    const t = Kt(Ye.speed, e), n = Kt(Ye.angle, e) * Math.PI / 180, s = Kt(Ye.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Kt(Ye.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const mp = pp(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function gp(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function zv(e, t, n = mp) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = gp(o, s.from), i = s.shrinks * s.frames / s.fps;
========
const xp = $p(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function _p(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Ye.gravity * (t[2] - Ye.floor))) / Ye.gravity;
}
function ay(e, t, n = xp) {
  const s = Ze.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = _p(o, s.from), i = s.shrinks * s.frames / s.fps;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (a < 0 || a >= r + i) return null;
  const c = Math.min(a, r), u = s.from.map((f, g) => f + o.velocity[g] * c);
  return u[2] -= Ye.gravity * c * c / 2, { at: u, turn: o.spin * c, landed: Math.max(0, a - r) / i };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Gv(e, t) {
========
function oy(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = e.map((o) => Math.sqrt(o)), s = n.reduce((o, r) => o + r, 0);
  let a = Math.min(Math.max(t, 0), 1) * s;
  for (const [o, r] of n.entries()) {
    if (a <= r || o === n.length - 1) {
      const i = r > 0 ? Math.min(a / r, 1) : 1;
      return { index: o, s: i, height: e[o] * 4 * i * (1 - i) };
    }
    a -= r;
  }
  return { index: 0, s: 1, height: 0 };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Kv = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), Yv = { stride: 0.5 };
========
const ry = () => Array.from({ length: Ze.pogo.count }, (e, t) => Ze.pogo.bounce * (t + 1) / Ze.pogo.count), iy = { stride: 0.5 };
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
function xo(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: us(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: us(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Jv(e) {
  const { into: t, out: n } = xo(Ze.rope_swing, e);
  return 1 - dn(t, [0, 1]) * (1 - dn(n, [0, 1]));
}
function Zv(e) {
  const t = Ze.rope_swing, { into: n, out: s } = xo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return dn(n, [0, 1]) * (1 - dn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const vp = { after: 3 }, yp = 10, wp = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, kp = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, bp = { weight: 19 }, $p = {
  build: { cooldown: 180 }
}, xp = { every: 120 }, Mo = {
========
function ly(e) {
  const { into: t, out: n } = xo(Ze.rope_swing, e);
  return 1 - un(t, [0, 1]) * (1 - un(n, [0, 1]));
}
function cy(e) {
  const t = Ze.rope_swing, { into: n, out: s } = xo(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return un(n, [0, 1]) * (1 - un(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Mp = { after: 3 }, Sp = 10, Ep = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Ap = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Cp = { weight: 19 }, Op = {
  build: { cooldown: 180 }
}, Tp = { every: 120 }, _o = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, _o = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Mp = {
========
}, Mo = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Bp = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  "❤️": "hearts",
  "👍": "amused",
  "🎉": "startled",
  "😄": "amused",
  "👀": "reading",
  "🙏": "hearts",
  "👎": "worried",
  "💔": "worried",
  "😠": "angry",
  "🎩": "amused",
  "🧐": "reading",
  "🥂": "amused",
  "🤙": "amused",
  "😎": "amused",
  "🔥": "startled",
  "💪": "amused",
  "🏆": "hearts",
  "⚔️": "angry",
  "🛡️": "worried",
  "🏰": "amused"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, qt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: yp }), te = (e, t, n = {}) => qt(e, "clip", t, n), Rn = (e, t, n = {}) => qt(e, "look", t, n), ca = (e, t, n = {}) => qt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...qt(e, "pick", t, n), ...s }), pe = (e) => qt("nothing", "nothing", e, {}), _p = 120, Sp = 300, Ln = (e, t) => ({ ...te(e, t), cooldown: Sp }), Ep = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Ap = () => [te("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: wp[e.name] }), _t = (e) => ({ ...e, shenanigan: !0, lasts: kp[e.name] }), Ss = [
========
}, qt = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Sp }), te = (e, t, n = {}) => qt(e, "clip", t, n), In = (e, t, n = {}) => qt(e, "look", t, n), da = (e, t, n = {}) => qt(e, "gaze", t, n), ce = (e, t, n = {}, s = {}) => ({ ...qt(e, "pick", t, n), ...s }), pe = (e) => qt("nothing", "nothing", e, {}), Ip = 120, Rp = 300, Rn = (e, t) => ({ ...te(e, t), cooldown: Rp }), Lp = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Dp = () => [te("joy", 2)], tt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), nt = (e) => ({ ...e, cooldown: Ep[e.name] }), Mt = (e) => ({ ...e, shenanigan: !0, lasts: Ap[e.name] }), Es = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ne("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), pe(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ne("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...nt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...nt(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...ne("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), pe(1)]),
  ...ne("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), pe(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ne("sin_fixed", { cooldown: 300 }, [te("halo", 1), pe(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ne("sin_committed", { cooldown: 300 }, [te("repent", 1), pe(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  // a worker given work: a call on the telephone, at most one in two minutes, gathering any other worker given work while it waits or
  // plays (reactions.js joinedCall)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ...ne("messaged", { cooldown: Ep }, [te("phone_call", 1)]),
========
  ...ne("messaged", { cooldown: Lp }, [te("phone_call", 1)]),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  ...ne("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), pe(7)]),
  ...ne("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), pe(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ne("reported", { cooldown: 90 }, [da("read", 3), te("nod", 1), pe(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ne("read_message", { cooldown: 30 }, [da("read", 3), pe(1)]),
  ...ne("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), pe(6)]),
  ...ne("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), pe(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ...ne("bar_done", { holds: !0 }, Ap()),
========
  ...ne("bar_done", { holds: !0 }, Dp()),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  ...ne("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ne("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), pe(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ne("launched", { cooldown: 300 }, [te("tumble", 3), pe(47)]),
  // a break from the hammering now and then
  ...ne("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), pe(69)]),
  ...ne("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), pe(2)]),
  ...ne("refused", { cooldown: 20 }, [te("shake", 1), pe(1)]),
  ...ne("work_done", { cooldown: 120 }, [te("stretch", 2), pe(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ne("pondering", { cooldown: [30, 60] }, [ce("ponder", 1)]),
  ...ne("thought_cloud", { cooldown: 90 }, [ce("cloud", 1)]),
  ...ne("light_bulb", { cooldown: 150 }, [ce("bulb", 1)]),
  ...ne("answered", { cooldown: 15 }, [Rn("amused", 3), pe(2)]),
  ...ne("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    pe(1)
  ]),
  ...ne("long_walk", { cooldown: 90 }, [te("stumble", 3), pe(22)]),
  ...ne("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), pe(13)]),
  ...ne("typing", { cooldown: 60 }, [Rn("reading", 1), pe(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ...Object.entries(Mp).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [Rn(t, 1)])),
  ...Object.entries(Mo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ne(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(_o).flatMap(([e, t]) => ne(`agent_reacted:${e}`, {}, [te(t, 1)])),
========
  ...Object.entries(Bp).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [In(t, 1)])),
  ...Object.entries(_o).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ne(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Mo).flatMap(([e, t]) => ne(`agent_reacted:${e}`, {}, [te(t, 1)])),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ne("pastime", {}, [
    tt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    tt("rest", 3, 180, 120),
    tt("yawn", 2, 60, 60),
    tt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    tt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    tt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    tt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ..._t(nt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    _t(nt(te("disco", 2, { ball: "bubble" }))),
    pe(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop; watching the UFO with a hand shading the eyes or
  // waving up at it; and while the context compacts, packed into a box that shrinks, vacuuming up words, or
  // squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ...ne("held:search", { cooldown: _p }, [Ln("search", 3), { ...Ln("binoculars", 2), when: { home: !0 } }, { ...Ln("glass_bubble", 2), when: { bubble: !0 } }]),
========
  ...ne("held:search", { cooldown: Ip }, [Rn("search", 3), { ...Rn("binoculars", 2), when: { home: !0 } }, { ...Rn("glass_bubble", 2), when: { bubble: !0 } }]),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  ...ne("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...ne("held:watch", {}, [te("watch", 2), te("wave_up", 1)]),
  ...ne("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ne("spell", {}, [ce("writing", 12, { state: "writing" }), ce("reading", 12, { state: "reading" }), ce("searching", 12, { state: "searching" }), pe(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ne("tickled", {}, [{ ...nt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ne("eager", {}, [te("eager", 2, { slow: !0 }), pe(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ne("jump", {}, [_t(nt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ne("climb", {}, [ce("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ...ne("unit", { cooldown: $p.build.cooldown }, [ce("unit", bp.weight), pe(1)]),
========
  ...ne("unit", { cooldown: Op.build.cooldown }, [ce("unit", Cp.weight), pe(1)]),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ne("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ne("carrier", {}, [ce("ufo", 3), ce("crane", 1)]),
  ...ne("crane_from", {}, [ce("left", 1), ce("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  ...ne("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: xp.every }, ce("stand", 5)]),
========
  ...ne("perch", {}, [{ ...ce("hang", 1, { hands: !0, free: !0 }), cooldown: Tp.every }, ce("stand", 5)]),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  // a digit a blow's dust lets out
  ...ne("digit", {}, [ce("0", 1), ce("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ne("roam", {}, [
    ce("rest", 35, {}, { stay: [25, 60] }),
    ce("seat", 15, {}, { stay: [15, 40] }),
    ce("edge", 25, {}, { stay: [8, 20] }),
    _t(ce("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ce("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ce("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ce("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ce("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ce("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    _t(nt(ce("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ne("laptop", {}, [ce("seat", 6, {}, { stay: [60, 150] }), ce("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ne("ledge_at", {}, [ce("middle", 2, {}, { along: 1 / 2 }), ce("third", 1, {}, { along: 1 / 3 }), ce("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ne("composed_as", {}, [
    ce("facing", 4, {}, { turn: 0, leans: 0 }),
    ce("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ce("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ce("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ce("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
], Cp = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), So = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Op = (e) => Array.isArray(e) ? e[0] : e, Tp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Bp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || So(f).every(([m, y]) => n(m) >= Op(y)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Ss.filter((f) => Cp(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= vp.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var m;
    return f.kind === "nothing" || f.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function Ip(e, t) {
  const n = Bp(e);
========
], Np = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), So = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), jp = (e) => Array.isArray(e) ? e[0] : e, Pp = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function qp(e) {
  var u;
  const t = e.has ?? (() => !0), n = (f) => e.now - (e.memory.get(f) ?? -1 / 0), s = (f) => !e.memory || So(f).every(([g, k]) => n(g) >= jp(k)), a = (f) => !f.shenanigan || f.lasts <= (e.room ?? 0), o = Es.filter((f) => Np(f.when, e) && (f.kind !== "clip" || t(f.name)) && s(f) && a(f)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Mp.after && o.some((f) => f.shenanigan) ? o.filter((f) => f.shenanigan) : o, c = i.filter((f) => {
    var g;
    return f.kind === "nothing" || f.name !== ((g = e.tally) == null ? void 0 : g.last);
  });
  return c.some((f) => f.kind !== "nothing") ? c : i;
}
function Wp(e, t) {
  const n = qp(e);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Eo(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Eo(e, t, n) {
  var s;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  for (const [a, o] of So(t)) (s = e.memory) == null || s.set(a, e.now + Tp(o, n));
}
function Xv(e, t, n) {
  Eo(e, Ss.find((s) => s.when.moment === e.moment && s.name === t), n);
========
  for (const [a, o] of So(t)) (s = e.memory) == null || s.set(a, e.now + Pp(o, n));
}
function uy(e, t, n) {
  Eo(e, Es.find((s) => s.when.moment === e.moment && s.name === t), n);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
}
const ha = {
  idle: "idle",
  asleep: "sleep",
  thinking: "idle",
  quiet: "idle",
  searching: "search",
  reading: "read",
  writing: "type",
  testing: "idle",
  building: "work",
  running: "idle",
  waiting: "waiting",
  asking: "waiting",
  compacting: "compacting",
  paused: "idle",
  stopped: "sleep"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Qv = {
========
}, dy = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  Read: "reading",
  Grep: "searching",
  Glob: "searching",
  WebSearch: "searching",
  WebFetch: "searching",
  Edit: "writing",
  MultiEdit: "writing",
  Write: "writing",
  NotebookEdit: "writing",
  Bash: "running"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, ey = 120, ty = (e) => ua[e] || ua.idle;
[.../* @__PURE__ */ new Set([...Object.values(Mo).flatMap((e) => Object.keys(e)), ...Object.keys(_o)])];
const Te = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function ny(e, t, n) {
========
}, hy = 120, fy = (e) => ha[e] || ha.idle;
[.../* @__PURE__ */ new Set([...Object.values(_o).flatMap((e) => Object.keys(e)), ...Object.keys(Mo)])];
const Be = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function py(e, t, n) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Be.ahead * n ? 180 : Math.sign(s) * Be.turn;
}
const fa = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function sy(e, t) {
  const n = Math.min(Te.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Te.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Te.lines, Math.floor((e.bottom - e.top - 2 * s) / Te.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Te.sweep) % a, i = o % Te.sweep, c = Te.sweep - Te.returnSeconds, u = da((i - c) / Te.returnSeconds), f = i <= c ? da(i / c) : 1 - u, m = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + m * Te.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Rp = 1, Lp = (e, t, n, s, a, o = 0) => Ip({ moment: "jump", high: e > Rp * t, memory: s, now: a, room: o }, n).name === "backflip", ha = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, ay = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, oy = { width: 24, height: 27, top: 3, units: 2 }, Dp = "[data-figure-pile]", ry = { amber: [1, 0.69, 0.125], good: ha.colours.good, bad: ha.colours.bad }, Dn = { phases: 4, dim: 0.25 }, iy = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, Np = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Ss.filter((e) => Np.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const ly = {
  width: 84,
  belly: 13,
  blink: 4
}, fa = "[data-figure-home]", Wt = () => {
========
function my(e, t) {
  const n = Math.min(Be.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Be.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Be.lines, Math.floor((e.bottom - e.top - 2 * s) / Be.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Be.sweep) % a, i = o % Be.sweep, c = Be.sweep - Be.returnSeconds, u = fa((i - c) / Be.returnSeconds), f = i <= c ? fa(i / c) : 1 - u, g = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * f, y: e.top + s + g * Be.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Fp = 1, Hp = (e, t, n, s, a, o = 0) => Wp({ moment: "jump", high: e > Fp * t, memory: s, now: a, room: o }, n).name === "backflip", pa = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, gy = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, vy = { width: 24, height: 27, top: 3, units: 2 }, Up = "[data-figure-pile]", yy = { amber: [1, 0.69, 0.125], good: pa.colours.good, bad: pa.colours.bad }, Ln = { phases: 4, dim: 0.25 }, wy = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, Vp = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Es.filter((e) => Vp.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const ky = {
  width: 84,
  belly: 13,
  blink: 4
}, ma = "[data-figure-home]", Wt = () => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var t;
  const e = document.querySelector(ma);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(ma)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, jp = "[data-figure-docked-bars]", Pp = "[data-figure-chat-foot]", qp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Wp = "[data-figure-newest]";
function Fp() {
  var s, a;
  const e = (s = Wt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Wp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
========
}, zp = "[data-figure-docked-bars]", Gp = "[data-figure-chat-foot]", Kp = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Yp = "[data-figure-newest]";
function Jp() {
  var s, a;
  const e = (s = Wt()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Yp), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !As(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Ao(e, t, n = Fp()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = As(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = Et.gap;
  return !To(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Nn = 0.26, Hp = 0.54, $n = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Nn, travels: "stand" },
  lounge: { drop: Nn, travels: "stand" },
  composed: { drop: Nn, travels: "stand" },
  hang: { drop: Hp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Co = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Up = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), cy = (e, t) => (e === "sit" ? Up.has(t) : Co.has(e)) ? e : "stand", uy = 0.25, dy = (e, t) => Co.has(e) && $n[t].drop === 0, Oo = 2, Vp = 90, zp = 180, Gp = 140, Kp = 280, Yp = 420, Jp = 0.25, Zp = 290, Xp = 600, Qp = "cubic-bezier(0.2, 0.7, 0.4, 1)", em = "cubic-bezier(0.55, 0, 0.9, 0.6)", jn = 5;
function hn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: m = 0, pogo: y = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < jn) return null;
  (r || i) && (o = Math.max(o, Oo));
  const x = o > 1, P = Math.abs(t.x - e.x), M = P < jn ? 0 : P / (Vp * o) * 1e3, b = Math.min(M, x ? Gp : zp), A = Math.abs(t.y - e.y), I = t.y < e.y, ee = I && !y && Lp(A, n, c, u, f, m), k = I ? Yp + Math.min(A, 400) * Jp : Math.sqrt(2 * A / $o) * 1e3, v = {
    x: t.x,
    y: t.y,
    ms: A > jn ? ee ? Xp : k : 0,
    lead: ee ? Zp : I ? Kp : 0,
    easing: I ? Qp : em,
    hopping: !0,
    clip: ee ? "backflip" : I ? "jump" : "fall"
  }, D = { x: t.x, y: t.y, ms: M + b, lead: 0, easing: "linear", ramp: b, ...x ? { clip: "run" } : {} }, T = y ? tm(t, n) : v, W = I && !s ? [{ ...D, y: e.y }, T] : [{ ...v, x: e.x }, D];
  return { way: Math.sign(t.x - e.x) || 1, legs: W, lands: !a, pace: o, running: x };
}
const tm = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - $n[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, To = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Es = (e) => {
========
function Ao(e, t, n = Jp()) {
  if (!e || !n) return !0;
  const s = kt(e, t), a = Cs(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Je.top * t.size, bottom: s.top + Je.bottom * t.size }, r = St.gap;
  return !To(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
const Dn = 0.26, Zp = 0.54, bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Dn, travels: "stand" },
  lounge: { drop: Dn, travels: "stand" },
  composed: { drop: Dn, travels: "stand" },
  hang: { drop: Zp, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Co = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Xp = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), by = (e, t) => (e === "sit" ? Xp.has(t) : Co.has(e)) ? e : "stand", $y = 0.25, xy = (e, t) => Co.has(e) && bn[t].drop === 0, Oo = 2, Qp = 90, em = 180, tm = 140, nm = 280, sm = 420, am = 0.25, om = 290, rm = 600, im = "cubic-bezier(0.2, 0.7, 0.4, 1)", lm = "cubic-bezier(0.55, 0, 0.9, 0.6)", Nn = 5;
function dn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: c = Math.random, memory: u = null, now: f = 0, room: g = 0, pogo: k = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Nn) return null;
  (r || i) && (o = Math.max(o, Oo));
  const _ = o > 1, D = Math.abs(t.x - e.x), P = D < Nn ? 0 : D / (Qp * o) * 1e3, b = Math.min(P, _ ? tm : em), E = Math.abs(t.y - e.y), H = t.y < e.y, V = H && !k && Hp(E, n, c, u, f, g), y = H ? sm + Math.min(E, 400) * am : Math.sqrt(2 * E / $o) * 1e3, m = {
    x: t.x,
    y: t.y,
    ms: E > Nn ? V ? rm : y : 0,
    lead: V ? om : H ? nm : 0,
    easing: H ? im : lm,
    hopping: !0,
    clip: V ? "backflip" : H ? "jump" : "fall"
  }, I = { x: t.x, y: t.y, ms: P + b, lead: 0, easing: "linear", ramp: b, ..._ ? { clip: "run" } : {} }, O = k ? cm(t, n) : m, q = H && !s ? [{ ...I, y: e.y }, O] : [{ ...m, x: e.x }, I];
  return { way: Math.sign(t.x - e.x) || 1, legs: q, lands: !a, pace: o, running: _ };
}
const cm = (e, t) => ({ x: e.x, y: e.y, ms: Ze.pogo.frames / Ze.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), kt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, To = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, As = (e) => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function bt() {
  var t;
  const e = (t = Wt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Yt = 0.5, pa = 20;
function hy(e, t, n = bt()) {
========
const Yt = 0.5, ga = 20;
function _y(e, t, n = bt()) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const s = kt(e, t);
  return s.left >= n.left + ga && s.right <= n.right - ga;
}
function Bo(e, t, n = bt()) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  const s = kt(e, t), a = s.right - s.left, o = As(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Yt && i <= n.right + Yt && s.top >= n.top - Yt && c <= n.bottom + Yt;
}
const fn = [0.35, 0.5, 0.65], pn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: fn[0], right: fn.at(-1), top: pn[0], bottom: pn.at(-1) }, nm = 0.24;
function As(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + nm * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function sm(e, { size: t }, n = bt()) {
  const s = As(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const am = (Je.right - Je.left) / 2 + 0.08;
function om(e, t, n = "", s = "") {
========
  const s = kt(e, t), a = s.right - s.left, o = Cs(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - Yt && i <= n.right + Yt && s.top >= n.top - Yt && c <= n.bottom + Yt;
}
const hn = [0.35, 0.5, 0.65], fn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Je = { left: hn[0], right: hn.at(-1), top: fn[0], bottom: fn.at(-1) }, um = 0.24;
function Cs(e) {
  if (e.posture === "stand") return { left: Je.left, right: Je.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + um * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Je.left, t), right: Math.max(Je.right, t) };
}
function dm(e, { size: t }, n = bt()) {
  const s = Cs(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const hm = (Je.right - Je.left) / 2 + 0.08;
function fm(e, t, n = "", s = "") {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !As(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const c of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[c].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, c), u.setEnd(o, c + 1), [...u.getClientRects()].some((f) => e >= f.left && e <= f.right && t >= f.top && t <= f.bottom)) return !0;
  }
  return !1;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const rm = (e) => pn.flatMap(
  (t) => fn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function im(e, t, n = "") {
  if (!Ao(e, t)) return fn.length * pn.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(qp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && To(a, c) && Es(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return rm(a).filter(([i, c]) => r(i, c) || om(i, c, n)).length;
}
function lm(e, t, n) {
  const s = bt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Bo(r, t, s) && Ao(r, t)).map((r) => ({ spot: r, covered: im(r, t), away: a(r) }));
========
const pm = (e) => fn.flatMap(
  (t) => hn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function mm(e, t, n = "") {
  if (!Ao(e, t)) return hn.length * fn.length;
  const s = kt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Kp)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: c }) => c.width && c.height && To(a, c) && As(i)).map(({ rect: i }) => i), r = (i, c) => o.some((u) => i >= u.left && i <= u.right && c >= u.top && c <= u.bottom);
  return pm(a).filter(([i, c]) => r(i, c) || fm(i, c, n)).length;
}
function gm(e, t, n) {
  const s = bt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Bo(r, t, s) && Ao(r, t)).map((r) => ({ spot: r, covered: mm(r, t), away: a(r) }));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Io = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, cm = am, um = (e, t, { size: n }, s = cm) => dm(e, Io[t], s * n, "stand");
function dm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const fy = (e) => ((e + 180) % 360 + 360) % 360 - 180, py = { turns: [-20, -10, 0, 10, 20] }, hm = 7;
function fm() {
  const e = [...document.querySelectorAll(Dp)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const pm = 4;
function mm() {
  const e = Ro(), t = fm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > pm || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - hm - n, 0) } };
}
const my = ({ size: e, below: t }) => (1 - t) * e;
function gm(e, t) {
  const n = bt(), { size: s, below: a } = t, o = $n[e.posture].drop * s;
  return { ...sm(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const vm = (e, t) => Object.keys(Io).map((n) => gm(um(e, n, t), t)), ym = (e, t, n) => lm(e, t, n) ?? e[0];
function gy(e, t) {
  const { element: n, edge: s } = mm();
  return { ...ym(vm(s, e), e, t), view: null, on: n };
}
function Ro() {
  var s;
  const e = Wt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(jp);
========
}, vm = hm, ym = (e, t, { size: n }, s = vm) => wm(e, Io[t], s * n, "stand");
function wm(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const My = (e) => ((e + 180) % 360 + 360) % 360 - 180, Sy = { turns: [-20, -10, 0, 10, 20] }, km = 7;
function bm() {
  const e = [...document.querySelectorAll(Up)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const $m = 4;
function xm() {
  const e = Ro(), t = bm(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > $m || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - km - n, 0) } };
}
const Ey = ({ size: e, below: t }) => (1 - t) * e;
function _m(e, t) {
  const n = bt(), { size: s, below: a } = t, o = bn[e.posture].drop * s;
  return { ...dm(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const Mm = (e, t) => Object.keys(Io).map((n) => _m(ym(e, n, t), t)), Sm = (e, t, n) => gm(e, t, n) ?? e[0];
function Ay(e, t) {
  const { element: n, edge: s } = xm();
  return { ...Sm(Mm(s, e), e, t), view: null, on: n };
}
function Ro() {
  var s;
  const e = Wt(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(zp);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  if (!t) return { ...Lo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Lo() {
  const e = Wt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const wm = { climb: 90 };
function vy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: m = 0, pogo: y = !1 } = {}) {
  (o || r) && (a = Math.max(a, Oo));
  const x = (ee) => {
    const k = kt(ee, n, $n[ee.posture].travels);
    return { x: k.left, y: k.top };
  }, P = t.ladder ?? e.ladder;
  if (P && !(t.ladder && e.ladder)) return km(x(e), x(t), x({ ...P.foot, posture: "stand" }), P.way, !!t.ladder, n, a);
  const [M, ...b] = [e, ...c, t].map(x), A = hn(M, b[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: m, pogo: y }), I = b.slice(1).map((ee, k) => {
    var v;
    return (v = hn(b[k], ee, n.size, { random: i, memory: u, now: f, room: m })) == null ? void 0 : v.legs.find((D) => D.hopping);
========
const Em = { climb: 90 };
function Cy(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: c = [], memory: u = null, now: f = 0, room: g = 0, pogo: k = !1 } = {}) {
  (o || r) && (a = Math.max(a, Oo));
  const _ = (V) => {
    const y = kt(V, n, bn[V.posture].travels);
    return { x: y.left, y: y.top };
  }, D = t.ladder ?? e.ladder;
  if (D && !(t.ladder && e.ladder)) return Am(_(e), _(t), _({ ...D.foot, posture: "stand" }), D.way, !!t.ladder, n, a);
  const [P, ...b] = [e, ...c, t].map(_), E = dn(P, b[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: f, room: g, pogo: k }), H = b.slice(1).map((V, y) => {
    var m;
    return (m = dn(b[y], V, n.size, { random: i, memory: u, now: f, room: g })) == null ? void 0 : m.legs.find((I) => I.hopping);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  });
  return E && { ...E, legs: [...E.legs, ...H.filter(Boolean)] };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function km(e, t, n, s, a, o, r) {
  const i = (f, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - f.x, m.y - f.y) / wm.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? hn(e, n, o.size, { pace: r }) : hn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const bm = "[data-figure-bubble]", $m = 250;
let Ct = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Do = 0;
const No = () => Ct, Pn = /* @__PURE__ */ new WeakMap();
let xm = 0;
function jo(e) {
  return Pn.has(e) || Pn.set(e, `floor-${++xm}`), Pn.get(e);
}
const Mm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, _m = () => {
  var e, t;
  return ((t = (e = Wt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Sm(e, t) {
  var s;
  const n = (s = e.querySelector(Pp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Em(e, t) {
  const n = e && Sm(e, t), s = e ? [...e.querySelectorAll(bm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Mm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: jo(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Am = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= $m ? (t.top - s.top) / a * 1e3 : 0;
};
function Cm(e = Ct, t = performance.now()) {
  const n = bt(), s = _m(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Ro(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Lo();
  return u.element && c.push({ id: jo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Em(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: Am(e, f, t) }))) });
}
const hs = /* @__PURE__ */ new Set();
function Om(e) {
  return hs.add(e), () => hs.delete(e);
}
function Tm() {
  Po();
  const e = () => {
    Do = requestAnimationFrame(e), !document.hidden && (Ct = Cm(Ct), hs.forEach((t) => t(Ct)));
========
function Am(e, t, n, s, a, o, r) {
  const i = (f, g) => ({ x: g.x, y: g.y, ms: Math.hypot(g.x - f.x, g.y - f.y) / Em.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? dn(e, n, o.size, { pace: r }) : dn(n, t, o.size, { pace: r }), u = a ? [...(c == null ? void 0 : c.legs) ?? [], i(n, t)] : [i(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
const Cm = "[data-figure-bubble]", Om = 250;
let At = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Do = 0;
const No = () => At, jn = /* @__PURE__ */ new WeakMap();
let Tm = 0;
function jo(e) {
  return jn.has(e) || jn.set(e, `floor-${++Tm}`), jn.get(e);
}
const Bm = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Im = () => {
  var e, t;
  return ((t = (e = Wt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Rm(e, t) {
  var s;
  const n = (s = e.querySelector(Gp)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Lm(e, t) {
  const n = e && Rm(e, t), s = e ? [...e.querySelectorAll(Cm)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Bm(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: jo(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Dm = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Om ? (t.top - s.top) / a * 1e3 : 0;
};
function Nm(e = At, t = performance.now()) {
  const n = bt(), s = Im(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = Ro(), c = [];
  o && c.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = Lo();
  return u.element && c.push({ id: jo(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), c.push(...Lm(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((f) => Object.freeze({ ...f, vy: Dm(e, f, t) }))) });
}
const ds = /* @__PURE__ */ new Set();
function jm(e) {
  return ds.add(e), () => ds.delete(e);
}
function Pm() {
  Po();
  const e = () => {
    Do = requestAnimationFrame(e), !document.hidden && (At = Nm(At), ds.forEach((t) => t(At)));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  };
  e();
}
function Po() {
  cancelAnimationFrame(Do);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Bm = (e, t) => e.find((n) => n.id === t) ?? null;
function yy(e, t, n = No().floors) {
  const s = Bm(n, "home");
  return e.posture === "hang" && s && kt(e, t).bottom >= s.top ? !1 : Bo(e, t);
}
const Im = ["data-kind"], Rm = { class: "figure-floor-name" }, Lm = {
========
const qm = (e, t) => e.find((n) => n.id === t) ?? null;
function Oy(e, t, n = No().floors) {
  const s = qm(n, "home");
  return e.posture === "hang" && s && kt(e, t).bottom >= s.top ? !1 : Bo(e, t);
}
const Wm = ["data-kind"], Fm = { class: "figure-floor-name" }, Hm = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (l(), d("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      p("span", Rm, w(e.floor.kind), 1)
    ], 12, Im));
  }
}, Dm = /* @__PURE__ */ J(Lm, [["__scopeId", "data-v-8f6132da"]]), Nm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, jm = {
  __name: "FigureFloors",
  setup(e) {
    const t = mn(No().floors);
    let n = () => {
    };
    return De(() => {
      n = Om((s) => t.value = s.floors), Tm();
    }), Ae(() => {
      n(), Po();
    }), (s, a) => (l(), d("div", Nm, [
      (l(!0), d(X, null, re(t.value, (o) => (l(), G(Dm, {
========
      p("span", Fm, w(e.floor.kind), 1)
    ], 12, Wm));
  }
}, Um = /* @__PURE__ */ J(Hm, [["__scopeId", "data-v-8f6132da"]]), Vm = {
  class: "figure-floors",
  "aria-hidden": "true"
}, zm = {
  __name: "FigureFloors",
  setup(e) {
    const t = pn(No().floors);
    let n = () => {
    };
    return De(() => {
      n = jm((s) => t.value = s.floors), Pm();
    }), Ce(() => {
      n(), Po();
    }), (s, a) => (l(), d("div", Vm, [
      (l(!0), d(Q, null, oe(t.value, (o) => (l(), K(Um, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, wy = /* @__PURE__ */ J(jm, [["__scopeId", "data-v-e519168b"]]), qn = (e) => typeof e == "number" ? e : Date.parse(e);
function ky(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: qn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => qn(a.row.created_at) - qn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Pm = 3, Wn = {
========
}, Ty = /* @__PURE__ */ J(zm, [["__scopeId", "data-v-e519168b"]]), Pn = (e) => typeof e == "number" ? e : Date.parse(e);
function By(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Pn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Pn(a.row.created_at) - Pn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Gm = 3, qn = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function qm(e, t) {
========
function Km(e, t) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Wn[n.grouping]) == null ? void 0 : s.call(Wn, e.row, n)) || "";
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Wm(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function by(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Pm ? [Wm(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = qm(r, t);
========
function Ym(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Iy(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Gm ? [Ym(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Km(r, t);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Fm = 1e3;
function $y() {
  const e = q(Date.now()), t = setInterval(() => e.value = Date.now(), Fm);
  return yt(() => clearInterval(t)), e;
}
function xy(e) {
  const t = vs(), n = q(null), s = q("");
========
const Jm = 1e3;
function Ry() {
  const e = j(Date.now()), t = setInterval(() => e.value = Date.now(), Jm);
  return yt(() => clearInterval(t)), e;
}
function Ly(e) {
  const t = ys(), n = j(null), s = j("");
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const Hm = {
  class: "cards-page",
  "data-window-flush": ""
}, Um = { class: "cards-bar" }, Vm = { class: "cards-count" }, zm = { class: "cards" }, Gm = {
  key: 1,
  class: "cards-note"
}, Km = {
  key: 2,
  class: "cards-note"
}, Ym = ["data-row", "onClick"], Jm = { class: "card-head" }, Zm = { class: "card-age" }, Xm = { class: "card-title" }, Qm = { class: "card-foot" }, eg = {
========
const Zm = {
  class: "cards-page",
  "data-window-flush": ""
}, Xm = { class: "cards-bar" }, Qm = { class: "cards-count" }, eg = { class: "cards" }, tg = {
  key: 1,
  class: "cards-note"
}, ng = {
  key: 2,
  class: "cards-note"
}, sg = ["data-row", "onClick"], ag = { class: "card-head" }, og = { class: "card-age" }, rg = { class: "card-title" }, ig = { class: "card-foot" }, lg = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "RowCards",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    loaded: { type: Boolean, required: !0 },
    noun: { type: String, required: !0 },
    icon: { type: String, required: !0 },
    head: { type: Function, required: !0 },
    title: { type: Function, required: !0 },
    foot: { type: Function, required: !0 }
  },
  emits: ["new", "open"],
  setup(e, { emit: t }) {
    const n = t;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), d("div", Hm, [
      p("div", Um, [
        p("span", Vm, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        H(ye, ot({
========
    return (s, a) => (l(), d("div", Zm, [
      p("div", Xm, [
        p("span", Qm, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        F(we, ot({
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          default: z(() => [
            H(xe, {
========
          default: U(() => [
            F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              name: "plus",
              size: 12
            }),
            ue(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      p("div", zm, [
        e.loaded ? e.failure ? (l(), d("p", Gm, w(e.failure), 1)) : e.rows.length ? j("", !0) : (l(), d("p", Km, "No " + w(e.noun) + "s yet", 1)) : (l(), G(wt, {
========
      p("div", eg, [
        e.loaded ? e.failure ? (l(), d("p", tg, w(e.failure), 1)) : e.rows.length ? L("", !0) : (l(), d("p", ng, "No " + w(e.noun) + "s yet", 1)) : (l(), K(wt, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 0,
          shape: "cards"
        })),
        (l(!0), d(Q, null, oe(e.rows, (o) => (l(), d("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          p("span", Jm, [
            H(xe, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            he(" " + w(e.head(o)), 1),
            p("span", Zm, w(U(Jn)(o.created_at)), 1)
          ]),
          p("span", Xm, w(e.title(o)), 1),
          p("span", Qm, w(e.foot(o)), 1)
        ], 8, Ym))), 128))
========
          p("span", ag, [
            F(be, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ue(" " + w(e.head(o)), 1),
            p("span", og, w(G(Yn)(o.created_at)), 1)
          ]),
          p("span", rg, w(e.title(o)), 1),
          p("span", ig, w(e.foot(o)), 1)
        ], 8, sg))), 128))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      ]),
      ye(s.$slots, "default", {}, void 0, !0)
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, My = /* @__PURE__ */ J(eg, [["__scopeId", "data-v-d72d528d"]]), ma = "newest";
function _y(e, { title: t, isOpen: n = null }) {
  const s = q(""), a = q(ma), o = q("all"), r = O(() => {
========
}, Dy = /* @__PURE__ */ J(lg, [["__scopeId", "data-v-d72d528d"]]), va = "newest";
function Ny(e, { title: t, isOpen: n = null }) {
  const s = j(""), a = j(va), o = j("all"), r = C(() => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    const i = s.value.trim().toLowerCase(), c = e.value.filter((u) => (!i || JSON.stringify(u).toLowerCase().includes(i)) && (o.value === "all" || !n || n(u) === (o.value === "open")));
    return a.value === va ? c : [...c].sort((u, f) => t(u).localeCompare(t(f)));
  });
  return { words: s, order: a, state: o, shown: r, hasStates: !!n };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const tg = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, ng = 40, sg = "top", ag = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var m;
    const n = e, s = (m = Le(Ne, null)) == null ? void 0 : m.autoScroll, a = O(() => s === sg), o = q(null), r = q(!1), i = (y) => a.value ? y.scrollTop : y.scrollHeight - y.scrollTop - y.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function f() {
      r.value = i(o.value) >= ng;
    }
    return ke(() => n.rowCount, async () => {
      await Lt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (y, x) => (l(), d("div", tg, [
========
const cg = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, ug = 40, dg = "top", hg = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var g;
    const n = e, s = (g = Ae(Ne, null)) == null ? void 0 : g.autoScroll, a = C(() => s === dg), o = j(null), r = j(!1), i = (k) => a.value ? k.scrollTop : k.scrollHeight - k.scrollTop - k.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function f() {
      r.value = i(o.value) >= ug;
    }
    return ke(() => n.rowCount, async () => {
      await Lt(), !r.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (k, _) => (l(), d("div", cg, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      p("div", {
        ref_key: "pane",
        ref: o,
        class: Q(["auto-scroll-pane", e.paneClass]),
        onScroll: f
      }, [
        ye(k.$slots, "default", {}, void 0, !0)
      ], 34),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      H(Rt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: z(() => [
========
      F(Rt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          rt(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            F(be, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            _[0] || (_[0] = ue(" Newest ", -1))
          ], 512), [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            [tr, r.value]
========
            [sr, r.value]
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ])
        ]),
        _: 1
      })
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Sy = /* @__PURE__ */ J(ag, [["__scopeId", "data-v-3accb764"]]), og = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, rg = {
========
}, jy = /* @__PURE__ */ J(hg, [["__scopeId", "data-v-3accb764"]]), fg = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, pg = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = t, s = ((a = Le(Ne, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (l(), d("div", og, [
      (l(!0), d(X, null, re(U(s), (i) => {
========
    const n = t, s = ((a = Ae(Ne, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (l(), d("div", fg, [
      (l(!0), d(Q, null, oe(G(s), (i) => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        var c;
        return l(), K(we, {
          key: i.key,
          kind: "text",
          class: Q(["inner-tab", { on: ((c = e.active) == null ? void 0 : c.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          default: z(() => [
            he(w(i.label) + " " + w(e.answer[i.count_field]), 1)
========
          default: U(() => [
            ue(w(i.label) + " " + w(e.answer[i.count_field]), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Ey = /* @__PURE__ */ J(rg, [["__scopeId", "data-v-cf3bb39f"]]), ig = {
  class: "list-tools",
  "data-list-tools": ""
}, lg = {
========
}, Py = /* @__PURE__ */ J(pg, [["__scopeId", "data-v-cf3bb39f"]]), mg = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, gg = {
  key: 1,
  class: "menu-item-text"
}, vg = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", mg, w(e.checked ? "✓" : ""), 1)) : L("", !0),
      e.description ? (l(), d("span", gg, [
        p("span", null, [
          ye(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, w(e.description), 1)
      ])) : ye(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, hs = /* @__PURE__ */ J(vg, [["__scopeId", "data-v-c91b190e"]]), yg = {}, wg = { class: "menu-label" };
function kg(e, t) {
  return l(), d("span", wg, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const fs = /* @__PURE__ */ J(yg, [["render", kg], ["__scopeId", "data-v-aa955b3e"]]), qo = /* @__PURE__ */ new WeakMap(), bg = (e, t) => qo.set(e, t);
function $g(e, t) {
  for (let n = t; n; n = qo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function xg(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !$g(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ce(() => window.removeEventListener("click", n));
}
const ft = 8, _g = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = j(null), o = (h) => h ? `${h}px` : void 0, r = C(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = j({ w: 0, h: 0 }), c = j(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), g = (h) => {
      const A = h.closest(".pane, .float-window");
      return A ? f(A.getBoundingClientRect()) : u();
    }, k = (h, A) => `${Math.max(0, h ? Math.min(h, A) : A)}px`;
    function _(h, A) {
      return {
        below: h.bottom - A.bottom - s.gap - ft,
        above: A.top - h.top - s.gap - ft,
        across: h.right - h.left - 2 * ft
      };
    }
    function D(h) {
      const A = g(s.anchor), T = _(A, h);
      return i.value.w <= T.across && i.value.h <= Math.max(T.below, T.above) ? A : u();
    }
    const P = C(() => {
      if (!c.value) return r.value;
      const h = c.value, A = D(h), T = _(A, h), { w: M, h: Z } = i.value, z = s.align === "auto" ? h.left + h.right > A.left + A.right : s.align === "right", de = _i(z ? h.right - M : h.left, A.left + ft, Math.max(A.left + ft, A.right - M - ft)), me = Z > T.below && T.above > T.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: k(s.maxHeight, T.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: k(s.maxHeight, T.below) };
      return { ...r.value, ...me, left: `${de}px`, maxWidth: k(s.maxWidth, T.across) };
    }), b = n, E = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function H(h) {
      const A = E(), T = A.indexOf(document.activeElement);
      A[(T + h + A.length) % A.length].focus();
    }
    const V = { ArrowDown: () => H(1), ArrowUp: () => H(-1), Escape: () => b("close") }, y = (h) => V[h.key] && (h.preventDefault(), V[h.key]()), m = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let I = 0;
    const O = new ResizeObserver(() => {
      cancelAnimationFrame(I), I = requestAnimationFrame(m);
    });
    xg(a, (h) => s.anchor && !s.anchor.contains(h.target) && b("close"));
    const q = (h, A) => ["top", "left", "right", "bottom"].some((T) => Math.abs(h[T] - A[T]) > 1), $ = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let S = 0;
    function v() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(h)) return b("close");
        q(h, c.value) && (c.value = h);
      }
      S = requestAnimationFrame(v);
    }
    return De(() => {
      s.anchor && a.value && bg(a.value, s.anchor), m(), a.value && O.observe(a.value), !s.plain && E()[0] && E()[0].focus(), v();
    }), Ce(() => {
      O.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(I);
    }), t({ element: a }), (h, A) => (l(), K(ba, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ot({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: P.value,
        onKeydown: y
      }), [
        ye(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Wo = /* @__PURE__ */ J(_g, [["__scopeId", "data-v-3d203970"]]), Mg = {
  class: "search-bar",
  "data-search-bar": ""
}, Sg = { class: "search-bar-control" }, Eg = ["value", "placeholder", "aria-label"], Ag = ["aria-expanded"], Cg = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const s = n, a = ar(), o = j(null), r = j(null), i = (u) => r.value = r.value ? null : u.currentTarget;
    function c() {
      var u;
      s("update:modelValue", ""), (u = o.value) == null || u.focus();
    }
    return t({ focus: () => {
      var u;
      return (u = o.value) == null ? void 0 : u.focus();
    } }), (u, f) => (l(), d("div", Mg, [
      p("div", Sg, [
        F(be, {
          class: "search-bar-icon",
          name: "search",
          size: 14
        }),
        p("input", {
          ref_key: "field",
          ref: o,
          class: "search-bar-input",
          type: "text",
          "data-search-input": "",
          value: e.modelValue,
          placeholder: e.placeholder,
          "aria-label": e.placeholder,
          onInput: f[0] || (f[0] = (g) => s("update:modelValue", g.target.value)),
          onKeydown: Ct(c, ["esc"])
        }, null, 40, Eg),
        e.modelValue ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "search-bar-clear",
          "data-search-clear": "",
          "aria-label": "Clear the search",
          onClick: c
        }, [
          F(be, {
            name: "close",
            size: 12
          })
        ])) : L("", !0),
        G(a).menu ? (l(), d("button", {
          key: 1,
          type: "button",
          class: "search-bar-menu",
          "data-search-menu": "",
          "aria-label": "Options",
          title: "Options",
          "aria-expanded": !!r.value,
          onClick: i
        }, [
          F(be, {
            name: "caret",
            size: 12
          })
        ], 8, Ag)) : L("", !0)
      ]),
      ye(u.$slots, "default", {}, void 0, !0),
      r.value ? (l(), K(Wo, {
        key: 0,
        anchor: r.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: f[1] || (f[1] = Me(() => {
        }, ["stop"])),
        onClose: f[2] || (f[2] = (g) => r.value = null)
      }, {
        default: U(() => [
          ye(u.$slots, "menu", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : L("", !0)
    ]));
  }
}, Og = /* @__PURE__ */ J(Cg, [["__scopeId", "data-v-c2f6060d"]]), Tg = {
  class: "list-tools",
  "data-list-tools": ""
}, Bg = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  setup(e) {
    const t = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], n = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return (s, a) => (l(), d("div", ig, [
      H(Ih, {
========
    return (s, a) => (l(), d("div", Tg, [
      F(Og, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": a[0] || (a[0] = (o) => e.tools.words.value = o),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": ""
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, ["modelValue", "placeholder"]),
      H(os, {
        options: t,
        value: e.tools.order.value,
        "data-list-order": "",
        onPick: a[1] || (a[1] = (o) => e.tools.order.value = o)
      }, null, 8, ["value"]),
      e.tools.hasStates ? (l(), G(os, {
        key: 0,
        options: n,
        value: e.tools.state.value,
        "data-list-state": "",
        onPick: a[2] || (a[2] = (o) => e.tools.state.value = o)
      }, null, 8, ["value"])) : j("", !0)
    ]));
  }
}, Ay = /* @__PURE__ */ J(lg, [["__scopeId", "data-v-b2dd0a0d"]]);
function Cy() {
  const e = q(null);
========
      }, {
        menu: U(() => [
          F(fs, null, {
            default: U(() => [...a[1] || (a[1] = [
              ue("Order", -1)
            ])]),
            _: 1
          }),
          (l(), d(Q, null, oe(t, (o) => F(hs, {
            key: o.key,
            checked: e.tools.order.value === o.key,
            "data-list-order": o.key,
            onClick: (r) => e.tools.order.value = o.key
          }, {
            default: U(() => [
              ue(w(o.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
          e.tools.hasStates ? (l(), d(Q, { key: 0 }, [
            F(fs, null, {
              default: U(() => [...a[2] || (a[2] = [
                ue("Show", -1)
              ])]),
              _: 1
            }),
            (l(), d(Q, null, oe(n, (o) => F(hs, {
              key: o.key,
              checked: e.tools.state.value === o.key,
              "data-list-state": o.key,
              onClick: (r) => e.tools.state.value = o.key
            }, {
              default: U(() => [
                ue(w(o.label), 1)
              ]),
              _: 2
            }, 1032, ["checked", "data-list-state", "onClick"])), 64))
          ], 64)) : L("", !0)
        ]),
        default: U(() => [
          ye(s.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["modelValue", "placeholder"])
    ]));
  }
}, qy = /* @__PURE__ */ J(Bg, [["__scopeId", "data-v-9a3cea5b"]]);
function Wy() {
  const e = j(null);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const cg = 86400, fs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function ug(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fs(t) - fs(e)) / cg);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Oy(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: ug(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Fn = 280, Hn = 240, Un = 120, dg = 6, hg = 14, It = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function fg(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${hg}px)` }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${It}`, e.style.height = `${r}px`;
========
const Ig = 86400, ps = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Rg(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ps(t) - ps(e)) / Ig);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function Fy(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ps(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Rg(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Wn = 280, Fn = 240, Hn = 120, Lg = 6, Dg = 14, It = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Ng(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Dg}px)` }), e.offsetHeight, e.style.transition = `height ${Wn}ms ${It}`, e.style.height = `${r}px`;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const i = a();
  let c = !1;
  const u = () => {
    n() && (t.scrollTop = t.scrollHeight);
    const f = a() - i;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    if (!c && f >= Fn && (c = !0, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${It}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Fn + Hn) return s(u);
========
    if (!c && f >= Wn && (c = !0, e.style.transition = `opacity ${Fn}ms ease-out, transform ${Fn}ms ${It}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), f < Wn + Fn) return s(u);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(u);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Ty(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${dg}px)` }), e.offsetHeight, e.style.transition = `opacity ${Un}ms ease-out, transform ${Un}ms ${It}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
========
function Hy(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Lg}px)` }), e.offsetHeight, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${It}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const r = a(), i = () => {
    if (n() && (t.scrollTop = t.scrollHeight), a() - r < Un) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const pg = 140, Jt = 220, mg = 5;
function By({ gap: e = pg, later: t = setTimeout } = {}) {
========
const jg = 140, Jt = 220, Pg = 5;
function Uy({ gap: e = jg, later: t = setTimeout } = {}) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  const n = [];
  let s = !1;
  const a = (i) => {
    i.done(), t(o, e);
  };
  function o() {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const i = n.splice(0, mg);
========
    const i = n.splice(0, Pg);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    if (s = i.length > 0, !s) return;
    let c = i.length;
    for (const u of i)
      u.el.style.display = u.display, u.arrival(u.el, u.options, () => {
        u.done(), c -= 1, c || t(o, e);
      });
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
  const r = (i, c, u, f = fg) => {
========
  const r = (i, c, u, f = Ng) => {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    if (!c.pane || !c.follows()) return u();
    const g = { el: i, options: c, done: u, arrival: f, display: i.style.display || "" };
    if (!s)
      return s = !0, f(i, c, () => a(g));
    i.style.display = "none", n.push(g);
  };
  return r.flush = () => {
    for (const i of n.splice(0))
      i.el.style.display = i.display, i.done();
  }, r;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
function Iy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Jt}ms ${It}, opacity ${Jt}ms ease-in, margin ${Jt}ms ${It}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Jt);
}
const qo = "chat.pins.minimised", en = q(Ot(qo, !1));
function ga(e) {
  en.value = e, gn(qo, e);
}
function gg(e) {
  const t = O(() => e()), n = O(() => en.value ? [] : e()), s = () => ga(!en.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Ba(o) > a).length,
    (o, r) => o > r && ga(!1)
  ), { pins: t, visible: n, minimised: en, toggle: s };
}
const vg = ["title"], yg = {
  key: 0,
  class: "pins-count"
}, wg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = gg(() => t.notices);
    return (o, r) => U(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: Q(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = _e((...i) => U(a) && U(a)(...i), ["stop"]))
    }, [
      H(xe, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (l(), d("span", yg, w(U(n).length), 1)) : j("", !0)
    ], 10, vg)) : j("", !0);
  }
}, Ry = /* @__PURE__ */ J(wg, [["__scopeId", "data-v-c0d11526"]]), kg = ["title"], bg = ["title"], $g = { class: "diff-card-dir" }, xg = { class: "diff-card-name" }, Mg = { class: "diff-card-ago" }, _g = ["title"], Sg = ["title"], Eg = {
  key: 0,
  class: "diff-card-note"
}, Ag = ["href"], Cg = ["src", "alt"], Og = { class: "diff-card-rows" }, Tg = { class: "diff-row-num" }, Bg = { class: "diff-row-sign" }, Ig = { class: "diff-row-code" }, Rg = {
========
function Vy(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Jt}ms ${It}, opacity ${Jt}ms ease-in, margin ${Jt}ms ${It}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Jt);
}
const Fo = "chat.pins.minimised", en = j(Ot(Fo, !1));
function ya(e) {
  en.value = e, mn(Fo, e);
}
function qg(e) {
  const t = C(() => e()), n = C(() => en.value ? [] : e()), s = () => ya(!en.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Ia(o) > a).length,
    (o, r) => o > r && ya(!1)
  ), { pins: t, visible: n, minimised: en, toggle: s };
}
const Wg = ["title"], Fg = {
  key: 0,
  class: "pins-count"
}, Hg = {
  __name: "PinsToggle",
  props: { notices: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = qg(() => t.notices);
    return (o, r) => G(n).length ? (l(), d("button", {
      key: 0,
      type: "button",
      class: ee(["pins-toggle", { minimised: G(s), inline: e.inline }]),
      title: G(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = Me((...i) => G(a) && G(a)(...i), ["stop"]))
    }, [
      F(be, {
        name: G(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      G(s) ? (l(), d("span", Fg, w(G(n).length), 1)) : L("", !0)
    ], 10, Wg)) : L("", !0);
  }
}, zy = /* @__PURE__ */ J(Hg, [["__scopeId", "data-v-c0d11526"]]), Ug = ["title"], Vg = ["title"], zg = { class: "diff-card-dir" }, Gg = { class: "diff-card-name" }, Kg = { class: "diff-card-ago" }, Yg = ["title"], Jg = ["title"], Zg = {
  key: 0,
  class: "diff-card-note"
}, Xg = ["href"], Qg = ["src", "alt"], e0 = { class: "diff-card-rows" }, t0 = { class: "diff-row-num" }, n0 = { class: "diff-row-sign" }, s0 = { class: "diff-row-code" }, a0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    kind: { type: String, required: !0 },
    added: { type: Number, required: !0 },
    removed: { type: Number, required: !0 },
    ago: { type: String, required: !0 },
    rows: { type: Array, required: !0 },
    flush: Boolean,
    half: Boolean,
    folded: Boolean,
    editsOnly: Boolean,
    hideRemovals: Boolean,
    capped: Boolean,
    lines: { type: Number, default: 0 },
    whole: { type: Object, default: null },
    entering: Boolean,
    picture: { type: String, default: "" },
    fresh: { type: String, default: "" }
  },
  emits: ["fold", "whole", "open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";
    function o(S) {
      (S.metaKey || S.ctrlKey) && (S.stopPropagation(), s("open", n.path));
    }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = O(() => n.path.lastIndexOf("/") + 1), u = O(() => n.path.slice(0, c.value)), f = O(() => n.path.slice(c.value)), m = O(() => n.kind === "deleted"), y = O(() => r[n.kind]), x = O(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), P = q("after"), M = O(() => P.value === "before" ? n.whole.old : n.whole.text), b = O(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((E, g) => ({ line_type: P.value === "after" && x.value.has(g + 1) ? "add" : "ctx", line: g + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), A = q(!1), I = O(() => n.lines && !A.value && !n.whole), ee = O(() => I.value ? b.value.slice(0, n.lines) : b.value), k = O(() => b.value.length - ee.value.length), v = (E) => E.line === null || E.line_type === "del" ? "" : E.line, D = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, T = q(null), W = q(null);
========
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, c = C(() => n.path.lastIndexOf("/") + 1), u = C(() => n.path.slice(0, c.value)), f = C(() => n.path.slice(c.value)), g = C(() => n.kind === "deleted"), k = C(() => r[n.kind]), _ = C(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), D = j("after"), P = C(() => D.value === "before" ? n.whole.old : n.whole.text), b = C(() => n.whole && n.whole.text !== void 0 ? P.value.split(`
`).map((S, v) => ({ line_type: D.value === "after" && _.value.has(v + 1) ? "add" : "ctx", line: v + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), E = j(!1), H = C(() => n.lines && !E.value && !n.whole), V = C(() => H.value ? b.value.slice(0, n.lines) : b.value), y = C(() => b.value.length - V.value.length), m = (S) => S.line === null || S.line_type === "del" ? "" : S.line, I = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, O = j(null), q = j(null);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    let $ = null;
    return De(() => {
      if (!q.value) return;
      let S = !0;
      $ = new ResizeObserver(() => {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        !T.value || !W.value || (T.value.style.transition = E ? "none" : "", T.value.style.height = `${W.value.offsetHeight}px`, E = !1);
      }), $.observe(W.value);
    }), Ae(() => $ && $.disconnect()), (E, g) => (l(), d("section", {
      class: Q(["diff-card", { half: e.half, gone: m.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
========
        !O.value || !q.value || (O.value.style.transition = S ? "none" : "", O.value.style.height = `${q.value.offsetHeight}px`, S = !1);
      }), $.observe(q.value);
    }), Ce(() => $ && $.disconnect()), (S, v) => (l(), d("section", {
      class: ee(["diff-card", { half: e.half, gone: g.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }, [
      p("header", {
        class: "diff-card-head",
        title: g.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: v[2] || (v[2] = (h) => !g.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          p("span", $g, w(u.value), 1),
          p("span", xg, w(f.value), 1),
          y.value ? (l(), d("span", {
            key: 0,
            class: Q(["diff-card-badge", e.kind])
          }, w(y.value), 3)) : j("", !0)
        ], 8, bg),
========
          title: `${e.path} · ${G(a)}-click to open it`,
          onClick: o
        }, [
          p("span", zg, w(u.value), 1),
          p("span", Gg, w(f.value), 1),
          k.value ? (l(), d("span", {
            key: 0,
            class: ee(["diff-card-badge", e.kind])
          }, w(k.value), 3)) : L("", !0)
        ], 8, Vg),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("span", {
          class: Q(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        p("span", {
          class: Q(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        p("span", Mg, w(e.ago), 1),
========
        p("span", Kg, w(e.ago), 1),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        e.whole && e.whole.old !== void 0 ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          title: P.value === "after" ? "Show the file before" : "Show the file after",
          onClick: g[0] || (g[0] = _e((h) => P.value = P.value === "after" ? "before" : "after", ["stop"]))
        }, w(P.value === "after" ? "After" : "Before"), 9, _g)) : j("", !0),
        m.value ? j("", !0) : (l(), d("button", {
========
          title: D.value === "after" ? "Show the file before" : "Show the file after",
          onClick: v[0] || (v[0] = Me((h) => D.value = D.value === "after" ? "before" : "after", ["stop"]))
        }, w(D.value === "after" ? "After" : "Before"), 9, Yg)) : L("", !0),
        g.value ? L("", !0) : (l(), d("button", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 1,
          type: "button",
          class: Q(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          onClick: g[1] || (g[1] = _e((h) => s("whole"), ["stop"]))
========
          onClick: v[1] || (v[1] = Me((h) => s("whole"), ["stop"]))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        }, [
          F(be, {
            name: "file",
            size: 12
          })
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        ], 10, Sg))
      ], 8, kg),
      e.whole && e.whole.error ? (l(), d("p", Eg, w(e.whole.error), 1)) : j("", !0),
      !m.value && !e.folded ? (l(), d(X, { key: 1 }, [
========
        ], 10, Jg))
      ], 8, Ug),
      e.whole && e.whole.error ? (l(), d("p", Zg, w(e.whole.error), 1)) : L("", !0),
      !g.value && !e.folded ? (l(), d(Q, { key: 1 }, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        e.picture ? (l(), d("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          p("img", {
            src: e.picture,
            alt: f.value,
            loading: "lazy"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          }, null, 8, Cg)
        ], 8, Ag)) : (l(), d("div", {
========
          }, null, 8, Qg)
        ], 8, Xg)) : (l(), d("div", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 1,
          ref_key: "grow",
          ref: O,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: q,
            class: "diff-card-diff"
          }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            p("div", Og, [
              (l(!0), d(X, null, re(ee.value, (h, C) => (l(), d("div", {
                key: C,
                class: Q(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", Tg, w(v(h)), 1),
                p("span", Bg, w(i[h.line_type]), 1),
                p("span", Ig, w(D(h)), 1)
              ], 2))), 128)),
              k.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: g[3] || (g[3] = _e((h) => A.value = !0, ["stop"]))
              }, w(k.value) + " more " + w(k.value === 1 ? "line" : "lines"), 1)) : j("", !0)
========
            p("div", e0, [
              (l(!0), d(Q, null, oe(V.value, (h, A) => (l(), d("div", {
                key: A,
                class: ee(["diff-row", h.line_type, { fresh: e.fresh && h.edit === e.fresh }])
              }, [
                p("span", t0, w(m(h)), 1),
                p("span", n0, w(i[h.line_type]), 1),
                p("span", s0, w(I(h)), 1)
              ], 2))), 128)),
              y.value > 0 ? (l(), d("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: v[3] || (v[3] = Me((h) => E.value = !0, ["stop"]))
              }, w(y.value) + " more " + w(y.value === 1 ? "line" : "lines"), 1)) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])
          ], 512)
        ], 512))
      ], 64)) : L("", !0)
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Ly = /* @__PURE__ */ J(Rg, [["__scopeId", "data-v-b6424f6e"]]), Lg = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Dg = {
  key: 1,
  class: "menu-item-text"
}, Ng = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (l(), d("button", {
      type: "button",
      class: Q(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (l(), d("span", Lg, w(e.checked ? "✓" : ""), 1)) : j("", !0),
      e.description ? (l(), d("span", Dg, [
        p("span", null, [
          we(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, w(e.description), 1)
      ])) : we(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, jg = /* @__PURE__ */ J(Ng, [["__scopeId", "data-v-c91b190e"]]), Pg = {}, qg = { class: "menu-label" };
function Wg(e, t) {
  return l(), d("span", qg, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Fg = /* @__PURE__ */ J(Pg, [["render", Wg], ["__scopeId", "data-v-aa955b3e"]]), Wo = /* @__PURE__ */ new WeakMap(), Hg = (e, t) => Wo.set(e, t);
function Ug(e, t) {
  for (let n = t; n; n = Wo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Vg(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Ug(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const ft = 8, zg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = q(null), o = (h) => h ? `${h}px` : void 0, r = O(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = q({ w: 0, h: 0 }), c = q(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), f = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), m = (h) => {
      const C = h.closest(".pane, .float-window");
      return C ? f(C.getBoundingClientRect()) : u();
    }, y = (h, C) => `${Math.max(0, h ? Math.min(h, C) : C)}px`;
    function x(h, C) {
      return {
        below: h.bottom - C.bottom - s.gap - ft,
        above: C.top - h.top - s.gap - ft,
        across: h.right - h.left - 2 * ft
      };
    }
    function P(h) {
      const C = m(s.anchor), B = x(C, h);
      return i.value.w <= B.across && i.value.h <= Math.max(B.below, B.above) ? C : u();
    }
    const M = O(() => {
      if (!c.value) return r.value;
      const h = c.value, C = P(h), B = x(C, h), { w: S, h: Y } = i.value, V = s.align === "auto" ? h.left + h.right > C.left + C.right : s.align === "right", ue = bi(V ? h.right - S : h.left, C.left + ft, Math.max(C.left + ft, C.right - S - ft)), me = Y > B.below && B.above > B.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: y(s.maxHeight, B.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: y(s.maxHeight, B.below) };
      return { ...r.value, ...me, left: `${ue}px`, maxWidth: y(s.maxWidth, B.across) };
    }), b = n, A = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function I(h) {
      const C = A(), B = C.indexOf(document.activeElement);
      C[(B + h + C.length) % C.length].focus();
    }
    const ee = { ArrowDown: () => I(1), ArrowUp: () => I(-1), Escape: () => b("close") }, k = (h) => ee[h.key] && (h.preventDefault(), ee[h.key]()), v = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let D = 0;
    const T = new ResizeObserver(() => {
      cancelAnimationFrame(D), D = requestAnimationFrame(v);
    });
    Vg(a, (h) => s.anchor && !s.anchor.contains(h.target) && b("close"));
    const W = (h, C) => ["top", "left", "right", "bottom"].some((B) => Math.abs(h[B] - C[B]) > 1), $ = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let E = 0;
    function g() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || $(h)) return b("close");
        W(h, c.value) && (c.value = h);
      }
      E = requestAnimationFrame(g);
    }
    return De(() => {
      s.anchor && a.value && Hg(a.value, s.anchor), v(), a.value && T.observe(a.value), !s.plain && A()[0] && A()[0].focus(), g();
    }), Ae(() => {
      T.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(D);
    }), t({ element: a }), (h, C) => (l(), G(ka, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", ot({
        ref_key: "panel",
        ref: a
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: k
      }), [
        we(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Gg = /* @__PURE__ */ J(zg, [["__scopeId", "data-v-3d203970"]]), Kg = {
========
}, Gy = /* @__PURE__ */ J(a0, [["__scopeId", "data-v-b6424f6e"]]), o0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (l(), K(we, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      default: z(() => [
        H(xe, {
========
      default: U(() => [
        F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Yg = {
========
}, He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, r0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [{ word: "approve", label: "Approve", main: !0 }, He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Jg = {
========
}, i0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Zg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Xg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], Qg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], e0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], t0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], n0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? t0(t) : e === "agent" ? [...Qg(t), ...Xg(t)] : e === "check" ? e0(t) : e === "question" ? Zg(t) : ((n = { plan: Yg, task: Jg }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, s0 = {
========
}, l0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], c0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], u0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], d0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], h0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], f0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? h0(t) : e === "agent" ? [...u0(t), ...c0(t)] : e === "check" ? d0(t) : e === "question" ? l0(t) : ((n = { plan: r0, task: i0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, p0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, a0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, o0 = { class: "ask-text" }, r0 = ["placeholder", "aria-label"], i0 = ["placeholder", "aria-label"], l0 = {
  key: 3,
  class: "moves"
}, c0 = {
========
}, m0 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, g0 = { class: "ask-text" }, v0 = ["placeholder", "aria-label"], y0 = ["placeholder", "aria-label"], w0 = {
  key: 3,
  class: "moves"
}, k0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const s = e, a = n, o = O(() => n0(s.kind, s.row)), r = q(""), i = q(null), c = q(""), u = q("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(x, P = "") {
      const M = await s.read([x.noun ?? s.kind, x.word, String(s.id), ...x.flag ? [x.flag, P] : x.positional ? [P] : [], ...x.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = M.ok ? "" : M.error, M.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const m = (x) => x.confirm ? i.value = x : x.said ? f(x, x.said) : x.flag || x.positional ? (i.value = x, c.value = "") : f(x), y = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: m }), (x, P) => {
      var M;
========
    const s = e, a = n, o = C(() => f0(s.kind, s.row)), r = j(""), i = j(null), c = j(""), u = j("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function f(_, D = "") {
      const P = await s.read([_.noun ?? s.kind, _.word, String(s.id), ..._.flag ? [_.flag, D] : _.positional ? [D] : [], ..._.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = P.ok ? "" : P.error, P.ok && (i.value = null, c.value = "", u.value = "", a("done"));
    }
    const g = (_) => _.confirm ? i.value = _ : _.said ? f(_, _.said) : _.flag || _.positional ? (i.value = _, c.value = "") : f(_), k = () => c.value.trim() && f(i.value, c.value.trim());
    return t({ moves: o, press: g }), (_, D) => {
      var P;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      return o.value.length ? (l(), d("footer", {
        key: 0,
        class: Q(["foot", { inline: e.inline }])
      }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        r.value ? (l(), d("p", s0, w(r.value), 1)) : j("", !0),
        (M = i.value) != null && M.confirm ? (l(), d("div", a0, [
          p("span", o0, w(i.value.confirm), 1),
          H(ye, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: P[0] || (P[0] = (b) => f(i.value))
          }, {
            default: z(() => [
              he(w(i.value.label), 1)
========
        r.value ? (l(), d("p", p0, w(r.value), 1)) : L("", !0),
        (P = i.value) != null && P.confirm ? (l(), d("div", m0, [
          p("span", g0, w(i.value.confirm), 1),
          F(we, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: D[0] || (D[0] = (b) => f(i.value))
          }, {
            default: U(() => [
              ue(w(i.value.label), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ]),
            _: 1
          }),
          F(we, {
            small: "",
            kind: "ghost",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: P[1] || (P[1] = (b) => i.value = null)
          }, {
            default: z(() => [...P[7] || (P[7] = [
              he("Back", -1)
========
            onClick: D[1] || (D[1] = (b) => i.value = null)
          }, {
            default: U(() => [...D[7] || (D[7] = [
              ue("Back", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])]),
            _: 1
          })
        ])) : i.value ? (l(), d("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          onSubmit: _e(y, ["prevent"])
        }, [
          rt(p("input", {
            "onUpdate:modelValue": P[2] || (P[2] = (b) => c.value = b),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: P[3] || (P[3] = tn(_e((b) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, r0), [
            [Kn, c.value]
          ]),
          i.value.opener ? rt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": P[4] || (P[4] = (b) => u.value = b),
========
          onSubmit: Me(k, ["prevent"])
        }, [
          rt(p("input", {
            "onUpdate:modelValue": D[2] || (D[2] = (b) => c.value = b),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: D[3] || (D[3] = Ct(Me((b) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, v0), [
            [Gn, c.value]
          ]),
          i.value.opener ? rt((l(), d("input", {
            key: 0,
            "onUpdate:modelValue": D[4] || (D[4] = (b) => u.value = b),
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onKeydown: P[5] || (P[5] = tn(_e((b) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, i0)), [
            [Kn, u.value]
          ]) : j("", !0),
          H(ye, {
========
            onKeydown: D[5] || (D[5] = Ct(Me((b) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, y0)), [
            [Gn, u.value]
          ]) : L("", !0),
          F(we, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !c.value.trim()
          }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            default: z(() => [
              he(w(i.value.label), 1)
========
            default: U(() => [
              ue(w(i.value.label), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ]),
            _: 1
          }, 8, ["disabled"]),
          F(we, {
            small: "",
            kind: "ghost",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: P[6] || (P[6] = (b) => i.value = null)
          }, {
            default: z(() => [...P[8] || (P[8] = [
              he("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", l0, [
          (l(!0), d(X, null, re(o.value, (b) => (l(), G(ye, {
========
            onClick: D[6] || (D[6] = (b) => i.value = null)
          }, {
            default: U(() => [...D[8] || (D[8] = [
              ue("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (l(), d("div", w0, [
          (l(!0), d(Q, null, oe(o.value, (b) => (l(), K(we, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            key: b.word,
            small: "",
            kind: b.main ? "primary" : "ghost",
            "data-move": b.word,
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            onClick: (A) => m(b)
          }, {
            default: z(() => [
              he(w(b.label), 1)
========
            onClick: (E) => g(b)
          }, {
            default: U(() => [
              ue(w(b.label), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ]),
            _: 2
          }, 1032, ["kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : L("", !0);
    };
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, u0 = /* @__PURE__ */ J(c0, [["__scopeId", "data-v-fffa0bf6"]]), d0 = {
========
}, b0 = /* @__PURE__ */ J(k0, [["__scopeId", "data-v-fffa0bf6"]]), $0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, h0 = { ...d0, done: "Completed" }, f0 = { class: "task-status-icon" }, p0 = ["width", "height", "aria-label"], m0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", f0, [
      H(Rt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: z(() => [
========
}, x0 = { ...$0, done: "Completed" }, _0 = { class: "task-status-icon" }, M0 = ["width", "height", "aria-label"], S0 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (l(), d("span", _0, [
      F(Rt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: U(() => [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          (l(), d("svg", {
            key: e.status,
            class: Q(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            "aria-label": U(h0)[e.status]
          }, [
            H(gs, { value: e.status }, {
              blocked: z(() => [...n[0] || (n[0] = [
========
            "aria-label": G(x0)[e.status]
          }, [
            F(vs, { value: e.status }, {
              blocked: U(() => [...n[0] || (n[0] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                p("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              done: z(() => [...n[1] || (n[1] = [
========
              done: U(() => [...n[1] || (n[1] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                p("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              started: z(() => [...n[2] || (n[2] = [
========
              started: U(() => [...n[2] || (n[2] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              asked: z(() => [...n[3] || (n[3] = [
========
              asked: U(() => [...n[3] || (n[3] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                p("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              paused: z(() => [...n[4] || (n[4] = [
========
              paused: U(() => [...n[4] || (n[4] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                p("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              planned: z(() => [...n[5] || (n[5] = [
========
              planned: U(() => [...n[5] || (n[5] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              default: z(() => [...n[6] || (n[6] = [
========
              default: U(() => [...n[6] || (n[6] = [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          ], 10, p0))
========
          ], 10, M0))
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        _: 1
      })
    ]));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Fo = /* @__PURE__ */ J(m0, [["__scopeId", "data-v-2ab7e404"]]), g0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), v0 = (e) => g0.has(e), Ho = (e) => v0(e) ? "done" : e, y0 = { class: "facts" }, w0 = { class: "fact wide" }, k0 = { class: "fact-value" }, b0 = {
  key: 0,
  class: "fact"
}, $0 = { class: "fact-value" }, x0 = {
  key: 1,
  class: "fact"
}, M0 = { class: "fact-value" }, _0 = { class: "fact wide" }, S0 = {
========
}, Ho = /* @__PURE__ */ J(S0, [["__scopeId", "data-v-2ab7e404"]]), E0 = /* @__PURE__ */ new Set(["completed", "cancelled"]), A0 = (e) => E0.has(e), Uo = (e) => A0(e) ? "done" : e, C0 = { class: "facts" }, O0 = { class: "fact wide" }, T0 = { class: "fact-value" }, B0 = {
  key: 0,
  class: "fact"
}, I0 = { class: "fact-value" }, R0 = {
  key: 1,
  class: "fact"
}, L0 = { class: "fact-value" }, D0 = { class: "fact wide" }, N0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, E0 = {
========
}, j0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = cn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      return l(), d("div", y0, [
        p("div", w0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", k0, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", b0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", $0, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : j("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", x0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", M0, "Agent " + w(e.task.holder_id), 1)
        ])) : j("", !0),
        p("div", _0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          H(os, {
            options: U(n),
            value: String(U(co)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", S0, w(e.refusal), 1)) : j("", !0)
========
      return l(), d("div", C0, [
        p("div", O0, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", T0, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (l(), d("div", B0, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", I0, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : L("", !0),
        e.task.state === "started" && e.task.holder_id ? (l(), d("div", R0, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", L0, "Agent " + w(e.task.holder_id), 1)
        ])) : L("", !0),
        p("div", D0, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          F(Ih, {
            options: G(n),
            value: String(G(uo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (l(), d("p", N0, w(e.refusal), 1)) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ])
      ]);
    };
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, A0 = /* @__PURE__ */ J(E0, [["__scopeId", "data-v-2018762d"]]), C0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, O0 = ["onClick"], T0 = { class: "wait-id" }, B0 = { class: "wait-title" }, I0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, R0 = { class: "text" }, L0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, D0 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, N0 = 180, j0 = {
========
}, P0 = /* @__PURE__ */ J(j0, [["__scopeId", "data-v-2018762d"]]), q0 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, W0 = ["onClick"], F0 = { class: "wait-id" }, H0 = { class: "wait-title" }, U0 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, V0 = { class: "text" }, z0 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, G0 = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, K0 = 180, Y0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const n = t, s = q(!1);
    return (a, o) => (l(), d(X, null, [
      e.task.waits.length ? (l(), d("section", C0, [
========
    const n = t, s = j(!1);
    return (a, o) => (l(), d(Q, null, [
      e.task.waits.length ? (l(), d("section", q0, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (l(!0), d(Q, null, oe(e.task.waits, (r) => (l(), d("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          H(Fo, {
            status: U(Ho)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", T0, w(r.id), 1),
          p("span", B0, w(r.title), 1)
        ], 8, O0))), 128))
      ])) : j("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", I0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", R0, w(e.task.outcome), 1)
      ])) : j("", !0),
      e.task.brief ? (l(), d("section", L0, [
========
          F(Ho, {
            status: G(Uo)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", F0, w(r.id), 1),
          p("span", H0, w(r.title), 1)
        ], 8, W0))), 128))
      ])) : L("", !0),
      e.task.state === "completed" && e.task.outcome ? (l(), d("section", U0, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", V0, w(e.task.outcome), 1)
      ])) : L("", !0),
      e.task.brief ? (l(), d("section", z0, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Q(["text", { clamped: !s.value }])
        }, w(e.task.brief), 3),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        e.task.brief.length > N0 && !s.value ? (l(), d("button", {
========
        e.task.brief.length > K0 && !s.value ? (l(), d("button", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        }, "Show the whole brief")) : j("", !0)
      ])) : j("", !0),
      e.task.logs.length ? (l(), d("section", D0, [
========
        }, "Show the whole brief")) : L("", !0)
      ])) : L("", !0),
      e.task.logs.length ? (l(), d("section", G0, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (l(!0), d(Q, null, oe(e.task.logs, (r) => (l(), d("p", {
          key: r.id,
          class: "log"
        }, w(r.line), 1))), 128))
      ])) : L("", !0)
    ], 64));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, P0 = /* @__PURE__ */ J(j0, [["__scopeId", "data-v-f411ce35"]]), q0 = { class: "comment-side-head" }, W0 = {
  key: 0,
  class: "comment-none"
}, F0 = {
========
}, J0 = /* @__PURE__ */ J(Y0, [["__scopeId", "data-v-f411ce35"]]), Z0 = { class: "comment-side-head" }, X0 = {
  key: 0,
  class: "comment-none"
}, Q0 = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (l(), d("aside", {
      class: Q(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      p("header", q0, [
========
      p("header", Z0, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(ws, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      e.comments.length ? j("", !0) : (l(), d("p", W0, "No comments yet")),
      (l(!0), d(X, null, re(e.comments, (s) => (l(), d("p", {
========
      e.comments.length ? L("", !0) : (l(), d("p", X0, "No comments yet")),
      (l(!0), d(Q, null, oe(e.comments, (s) => (l(), d("p", {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, w(e.words(s)), 1))), 128))
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, H0 = /* @__PURE__ */ J(F0, [["__scopeId", "data-v-19fdbdd4"]]), U0 = ["data-comments-below"], V0 = 600, z0 = {
========
}, ev = /* @__PURE__ */ J(Q0, [["__scopeId", "data-v-19fdbdd4"]]), tv = ["data-comments-below"], nv = 600, sv = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const t = q(null), n = q(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < V0);
========
    const t = j(null), n = j(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < nv);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    return De(() => s.observe(t.value)), yt(() => s.disconnect()), (a, o) => (l(), d("div", {
      ref_key: "root",
      ref: t,
      class: Q(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      we(a.$slots, "default"),
      e.open ? (l(), G(H0, {
========
      ye(a.$slots, "default"),
      e.open ? (l(), K(ev, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (r) => a.$emit("close"))
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, ["comments", "words", "below"])) : j("", !0)
    ], 10, U0));
  }
}, G0 = /* @__PURE__ */ J(z0, [["__scopeId", "data-v-6c850df0"]]), K0 = ["placeholder"], Y0 = { class: "actions" }, J0 = { class: "error" }, Z0 = {
  key: 1,
  class: "card closed"
}, X0 = { class: "mark" }, Q0 = { class: "prompt" }, ev = {
  key: 0,
  class: "draft"
}, tv = {
========
      }, null, 8, ["comments", "words", "below"])) : L("", !0)
    ], 10, tv));
  }
}, av = /* @__PURE__ */ J(sv, [["__scopeId", "data-v-6c850df0"]]), ov = ["placeholder"], rv = { class: "actions" }, iv = { class: "error" }, lv = {
  key: 1,
  class: "card closed"
}, cv = { class: "mark" }, uv = { class: "prompt" }, dv = {
  key: 0,
  class: "draft"
}, hv = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Gn({
    send: { type: Function, required: !0 },
    count: { type: Number, default: 0 },
    ready: { type: Boolean, default: !0 },
    placeholder: { type: String, default: "Write a comment…" }
  }, {
    draft: { type: String, default: "" },
    draftModifiers: {},
    error: { type: String, default: "" },
    errorModifiers: {}
  }),
  emits: /* @__PURE__ */ Gn(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const s = e, a = n, o = zn(e, "draft"), r = zn(e, "error"), i = q(!!r.value), c = q(!1), u = q(!1), f = q(null);
    async function m() {
      var M, b;
      i.value = !0, c.value = !1, await Lt(), (b = ((M = f.value) == null ? void 0 : M.querySelector("input")) || f.value) == null || b.focus();
========
    const s = e, a = n, o = Vn(e, "draft"), r = Vn(e, "error"), i = j(!!r.value), c = j(!1), u = j(!1), f = j(null);
    async function g() {
      var P, b;
      i.value = !0, c.value = !1, await Lt(), (b = ((P = f.value) == null ? void 0 : P.querySelector("input")) || f.value) == null || b.focus();
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }
    function k() {
      i.value = !1, r.value = "";
    }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    function x(M) {
      M.shiftKey || M.isComposing || (M.preventDefault(), P());
    }
    async function P() {
      const M = o.value.trim();
      if (!(!M || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(M), i.value = !1, c.value = !0;
        } catch (b) {
          o.value = M, r.value = b.message;
========
    function _(P) {
      P.shiftKey || P.isComposing || (P.preventDefault(), D());
    }
    async function D() {
      const P = o.value.trim();
      if (!(!P || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(P), i.value = !1, c.value = !0;
        } catch (b) {
          o.value = P, r.value = b.message;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        } finally {
          u.value = !1;
        }
      }
    }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    return t({ expand: m }), (M, b) => (l(), d("div", {
      class: Q(["comment-bar", { open: i.value }])
========
    return t({ expand: g }), (P, b) => (l(), d("div", {
      class: ee(["comment-bar", { open: i.value }])
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }, [
      i.value ? (l(), d("form", {
        key: 0,
        class: "card compose",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        onSubmit: _e(P, ["prevent"]),
        onKeydown: tn(y, ["esc"])
      }, [
        we(M.$slots, "who", {}, void 0, !0),
        rt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": b[0] || (b[0] = (A) => o.value = A),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: tn(x, ["enter"])
        }, null, 40, K0), [
          [Kn, o.value]
        ]),
        p("div", Y0, [
          p("span", J0, w(r.value), 1),
          H(ye, {
========
        onSubmit: Me(D, ["prevent"]),
        onKeydown: Ct(k, ["esc"])
      }, [
        ye(P.$slots, "who", {}, void 0, !0),
        rt(p("textarea", {
          ref_key: "box",
          ref: f,
          "onUpdate:modelValue": b[0] || (b[0] = (E) => o.value = E),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: Ct(_, ["enter"])
        }, null, 40, ov), [
          [Gn, o.value]
        ]),
        p("div", rv, [
          p("span", iv, w(r.value), 1),
          F(we, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            small: "",
            onClick: k
          }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            default: z(() => [...b[2] || (b[2] = [
              he("Cancel", -1)
========
            default: U(() => [...b[2] || (b[2] = [
              ue("Cancel", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])]),
            _: 1
          }),
          F(we, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: D
          }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            default: z(() => [...b[3] || (b[3] = [
              he("Send", -1)
========
            default: U(() => [...b[3] || (b[3] = [
              ue("Send", -1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      ], 32)) : (l(), d("div", Z0, [
========
      ], 32)) : (l(), d("div", lv, [
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: g
        }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          p("span", X0, [
            H(xe, {
========
          p("span", cv, [
            F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          p("span", Q0, w(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", ev, "Draft kept")) : j("", !0)
========
          p("span", uv, w(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (l(), d("span", dv, "Draft kept")) : L("", !0)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ]),
        e.count ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "count",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          onClick: b[1] || (b[1] = (A) => a("show"))
        }, [
          p("span", null, w(U($i)(e.count, "comment")), 1),
          H(xe, {
========
          onClick: b[1] || (b[1] = (E) => a("show"))
        }, [
          p("span", null, w(G(Mi)(e.count, "comment")), 1),
          F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            name: "down",
            size: 12
          })
        ])) : L("", !0)
      ]))
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, nv = /* @__PURE__ */ J(tv, [["__scopeId", "data-v-79db0c2d"]]);
function sv(e, t) {
  const n = q([]), s = q(!1);
========
}, fv = /* @__PURE__ */ J(hv, [["__scopeId", "data-v-79db0c2d"]]);
function pv(e, t) {
  const n = j([]), s = j(!1);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: f, id: g, title: k } = e(), _ = `On ${f} ${g}, ${k}: `;
    return u.text.startsWith(_) ? u.text.slice(_.length) : u.text;
  };
  async function i() {
    const { kind: u, id: f } = e();
    if (!f) return;
    const g = ++o, k = await t([u, "comments", String(f)]);
    g === o && (n.value = k.ok ? k.value.rows ?? [] : []);
  }
  async function c(u) {
    const { kind: f, id: g } = e(), k = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, k], s.value = !0;
    const _ = await t([f, "comment", String(g), u]);
    if (!_.ok)
      throw n.value = n.value.filter((D) => D !== k && D.id !== k.id), new Error(_.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: c, load: i };
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
const av = { class: "top" }, ov = {
  class: "crumb",
  "data-task-crumb": ""
}, rv = {
========
const mv = { class: "top" }, gv = {
  class: "crumb",
  "data-task-crumb": ""
}, vv = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, iv = {
  key: 1,
  class: "body"
}, lv = { class: "stamp" }, cv = {
  class: "title",
  "data-resource-title": ""
}, uv = { class: "since" }, dv = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, hv = { class: "text" }, fv = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, pv = {
  key: 1,
  class: "note"
}, mv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, gv = { class: "text" }, vv = {
========
}, yv = {
  key: 1,
  class: "body"
}, wv = { class: "stamp" }, kv = {
  class: "title",
  "data-resource-title": ""
}, bv = { class: "since" }, $v = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, xv = { class: "text" }, _v = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Mv = {
  key: 1,
  class: "note"
}, Sv = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Ev = { class: "text" }, Av = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    const s = e, a = n, o = q(null), r = q(null), i = q(""), c = q(""), u = q(null), f = q(null), m = sv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (k) => s.read(k));
    ke(m.open, (k) => a("comments", k));
    let y = 0;
    const x = Ho, P = (k) => k.slice(0, 1).toUpperCase() + k.slice(1), M = O(() => {
      var k;
      return (k = r.value) != null && k.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function b() {
      const k = ++y, [v, D] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      k === y && (i.value = v.ok ? "" : v.error, o.value = v.ok ? v.value : null, r.value = D.ok ? D.value : null);
========
    const s = e, a = n, o = j(null), r = j(null), i = j(""), c = j(""), u = j(null), f = j(null), g = pv(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (y) => s.read(y));
    ke(g.open, (y) => a("comments", y));
    let k = 0;
    const _ = Uo, D = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), P = C(() => {
      var y;
      return (y = r.value) != null && y.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function b() {
      const y = ++k, [m, I] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      y === k && (i.value = m.ok ? "" : m.error, o.value = m.ok ? m.value : null, r.value = I.ok ? I.value : null);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
    }
    ke(() => s.id, () => {
      o.value = null, r.value = null, u.value = null, b();
    }, { immediate: !0 }), ke(() => s.changes, b);
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
    async function A(k) {
      const v = o.value.priority;
      o.value.priority = Number(k);
      const D = await s.read(["task", "edit", String(s.id), "--priority", k]);
      if (c.value = D.ok ? "" : D.error, D.ok) return b();
      o.value.priority = v;
    }
    function I(k) {
      u.value = null, f.value.press(k);
    }
    const ee = (k) => {
      var v;
      return ((v = f.value) == null ? void 0 : v.moves.length) && (u.value = k);
    };
    return t({ openStatus: ee }), (k, v) => (l(), d("aside", {
      class: Q(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", av, [
        e.backed ? (l(), G(Kg, {
          key: 0,
          onBack: v[0] || (v[0] = (D) => a("back"))
        })) : j("", !0),
        p("span", ov, w(M.value), 1),
        v[9] || (v[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(X, { key: 1 }, [
          H(ye, {
========
    async function E(y) {
      const m = o.value.priority;
      o.value.priority = Number(y);
      const I = await s.read(["task", "edit", String(s.id), "--priority", y]);
      if (c.value = I.ok ? "" : I.error, I.ok) return b();
      o.value.priority = m;
    }
    function H(y) {
      u.value = null, f.value.press(y);
    }
    const V = (y) => {
      var m;
      return ((m = f.value) == null ? void 0 : m.moves.length) && (u.value = y);
    };
    return t({ openStatus: V }), (y, m) => (l(), d("aside", {
      class: ee(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", mv, [
        e.backed ? (l(), K(o0, {
          key: 0,
          onBack: m[0] || (m[0] = (I) => a("back"))
        })) : L("", !0),
        p("span", gv, w(P.value), 1),
        m[9] || (m[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (l(), d(Q, { key: 1 }, [
          F(we, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: m[1] || (m[1] = (I) => a("step", -1))
          }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            default: z(() => [
              H(xe, {
========
            default: U(() => [
              F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          F(we, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: m[2] || (m[2] = (I) => a("step", 1))
          }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            default: z(() => [
              H(xe, {
========
            default: U(() => [
              F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : L("", !0),
        F(we, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: m[3] || (m[3] = (I) => a("close"))
        }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          default: z(() => [
            H(xe, {
========
          default: U(() => [
            F(be, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      i.value ? (l(), d("p", rv, w(i.value), 1)) : o.value ? (l(), d(X, { key: 2 }, [
        H(G0, {
          open: U(m).open.value,
          comments: U(m).comments.value,
          words: U(m).words,
          onClose: v[6] || (v[6] = (D) => U(m).open.value = !1)
        }, {
          default: z(() => {
            var D;
========
      i.value ? (l(), d("p", vv, w(i.value), 1)) : o.value ? (l(), d(Q, { key: 2 }, [
        F(av, {
          open: G(g).open.value,
          comments: G(g).comments.value,
          words: G(g).words,
          onClose: m[6] || (m[6] = (I) => G(g).open.value = !1)
        }, {
          default: U(() => {
            var I;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            return [
              (l(), d("div", {
                key: o.value.id,
                class: "body"
              }, [
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                p("div", lv, "Task " + w(o.value.id) + " · updated " + w(U(Jn)(U(on)(o.value)) || "just now"), 1),
                p("h3", cv, w(o.value.title), 1),
                p("div", {
                  class: Q(["state-line", U(x)(o.value.state)])
========
                p("div", wv, "Task " + w(o.value.id) + " · updated " + w(G(Yn)(G(an)(o.value)) || "just now"), 1),
                p("h3", kv, w(o.value.title), 1),
                p("div", {
                  class: ee(["state-line", G(_)(o.value.state)])
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                    onClick: v[4] || (v[4] = (T) => ee(T.currentTarget))
                  }, [
                    H(Fo, {
                      status: U(x)(o.value.state)
========
                    onClick: m[4] || (m[4] = (O) => V(O.currentTarget))
                  }, [
                    F(Ho, {
                      status: G(_)(o.value.state)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                    }, null, 8, ["status"]),
                    ue(" " + w(D(o.value.state)), 1)
                  ]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                  p("span", uv, "since " + w(U(Jn)(U(on)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", dv, [
                  v[10] || (v[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", hv, w(o.value.reason || "Other tasks"), 1),
                  (D = o.value.openers) != null && D.length ? (l(), d("p", fv, "Opens by itself when " + w(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", pv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", mv, [
                  v[11] || (v[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", gv, w(o.value.reason), 1)
                ])) : j("", !0),
                H(A0, {
========
                  p("span", bv, "since " + w(G(Yn)(G(an)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (l(), d("section", $v, [
                  m[10] || (m[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", xv, w(o.value.reason || "Other tasks"), 1),
                  (I = o.value.openers) != null && I.length ? (l(), d("p", _v, "Opens by itself when " + w(o.value.openers.join(" or ")) + ".", 1)) : (l(), d("p", Mv, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (l(), d("section", Sv, [
                  m[11] || (m[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", Ev, w(o.value.reason), 1)
                ])) : L("", !0),
                F(P0, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                  task: o.value,
                  place: r.value,
                  refusal: c.value,
                  onPriority: E
                }, null, 8, ["task", "place", "refusal"]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
                H(P0, {
========
                F(J0, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                  task: o.value,
                  onSelect: m[5] || (m[5] = (O) => a("select", O))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        H(nv, {
          send: U(m).send,
          count: U(m).comments.value.length,
          onShow: v[7] || (v[7] = (D) => U(m).open.value = !U(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", iv, [
        H(wt)
      ])),
      H(u0, {
========
        F(fv, {
          send: G(g).send,
          count: G(g).comments.value.length,
          onShow: m[7] || (m[7] = (I) => G(g).open.value = !G(g).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (l(), d("div", yv, [
        F(wt)
      ])),
      F(b0, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        ref_key: "footer",
        ref: f,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: b
      }, null, 8, ["id", "row", "read"]),
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      u.value ? (l(), G(Gg, {
========
      u.value ? (l(), K(Wo, {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: m[8] || (m[8] = (I) => u.value = null)
      }, {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        default: z(() => [
          H(Fg, null, {
            default: z(() => [
              he("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(X, null, re(f.value.moves, (D) => (l(), G(jg, {
            key: D.word,
            onClick: (T) => I(D)
          }, {
            default: z(() => [
              he(w(D.label), 1)
========
        default: U(() => [
          F(fs, null, {
            default: U(() => [
              ue("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (l(!0), d(Q, null, oe(f.value.moves, (I) => (l(), K(hs, {
            key: I.word,
            onClick: (O) => H(I)
          }, {
            default: U(() => [
              ue(w(I.label), 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : L("", !0)
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
}, Dy = /* @__PURE__ */ J(vv, [["__scopeId", "data-v-c76befc4"]]);
function yv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Vn = { exports: {} }, va;
function wv() {
  return va || (va = 1, (function(e, t) {
    var n = (function() {
      var s = function(v, D) {
        var T = 236, W = 17, $ = v, E = o[D], g = null, h = 0, C = null, B = [], S = {}, Y = function(R, L) {
          h = $ * 4 + 17, g = (function(_) {
            for (var N = new Array(_), F = 0; F < _; F += 1) {
              N[F] = new Array(_);
              for (var Z = 0; Z < _; Z += 1)
                N[F][Z] = null;
            }
            return N;
          })(h), V(0, 0), V(h - 7, 0), V(0, h - 7), me(), le(), qe(R, L), $ >= 7 && Se(R), C == null && (C = Uo($, E, B)), We(C, L);
        }, V = function(R, L) {
          for (var _ = -1; _ <= 7; _ += 1)
            if (!(R + _ <= -1 || h <= R + _))
              for (var N = -1; N <= 7; N += 1)
                L + N <= -1 || h <= L + N || (0 <= _ && _ <= 6 && (N == 0 || N == 6) || 0 <= N && N <= 6 && (_ == 0 || _ == 6) || 2 <= _ && _ <= 4 && 2 <= N && N <= 4 ? g[R + _][L + N] = !0 : g[R + _][L + N] = !1);
        }, ue = function() {
          for (var R = 0, L = 0, _ = 0; _ < 8; _ += 1) {
            Y(!0, _);
            var N = i.getLostPoint(S);
            (_ == 0 || R > N) && (R = N, L = _);
========
}, Ky = /* @__PURE__ */ J(Av, [["__scopeId", "data-v-c76befc4"]]);
function Cv(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Un = { exports: {} }, wa;
function Ov() {
  return wa || (wa = 1, (function(e, t) {
    var n = (function() {
      var s = function(m, I) {
        var O = 236, q = 17, $ = m, S = o[I], v = null, h = 0, A = null, T = [], M = {}, Z = function(B, R) {
          h = $ * 4 + 17, v = (function(x) {
            for (var N = new Array(x), W = 0; W < x; W += 1) {
              N[W] = new Array(x);
              for (var X = 0; X < x; X += 1)
                N[W][X] = null;
            }
            return N;
          })(h), z(0, 0), z(h - 7, 0), z(0, h - 7), me(), le(), qe(B, R), $ >= 7 && Se(B), A == null && (A = Vo($, S, T)), We(A, R);
        }, z = function(B, R) {
          for (var x = -1; x <= 7; x += 1)
            if (!(B + x <= -1 || h <= B + x))
              for (var N = -1; N <= 7; N += 1)
                R + N <= -1 || h <= R + N || (0 <= x && x <= 6 && (N == 0 || N == 6) || 0 <= N && N <= 6 && (x == 0 || x == 6) || 2 <= x && x <= 4 && 2 <= N && N <= 4 ? v[B + x][R + N] = !0 : v[B + x][R + N] = !1);
        }, de = function() {
          for (var B = 0, R = 0, x = 0; x < 8; x += 1) {
            Z(!0, x);
            var N = i.getLostPoint(M);
            (x == 0 || B > N) && (B = N, R = x);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }
          return R;
        }, le = function() {
          for (var B = 8; B < h - 8; B += 1)
            v[B][6] == null && (v[B][6] = B % 2 == 0);
          for (var R = 8; R < h - 8; R += 1)
            v[6][R] == null && (v[6][R] = R % 2 == 0);
        }, me = function() {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          for (var R = i.getPatternPosition($), L = 0; L < R.length; L += 1)
            for (var _ = 0; _ < R.length; _ += 1) {
              var N = R[L], F = R[_];
              if (g[N][F] == null)
                for (var Z = -2; Z <= 2; Z += 1)
========
          for (var B = i.getPatternPosition($), R = 0; R < B.length; R += 1)
            for (var x = 0; x < B.length; x += 1) {
              var N = B[R], W = B[x];
              if (v[N][W] == null)
                for (var X = -2; X <= 2; X += 1)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? v[N + X][W + ae] = !0 : v[N + X][W + ae] = !1;
            }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        }, Se = function(R) {
          for (var L = i.getBCHTypeNumber($), _ = 0; _ < 18; _ += 1) {
            var N = !R && (L >> _ & 1) == 1;
            g[Math.floor(_ / 3)][_ % 3 + h - 8 - 3] = N;
          }
          for (var _ = 0; _ < 18; _ += 1) {
            var N = !R && (L >> _ & 1) == 1;
            g[_ % 3 + h - 8 - 3][Math.floor(_ / 3)] = N;
          }
        }, qe = function(R, L) {
          for (var _ = E << 3 | L, N = i.getBCHTypeInfo(_), F = 0; F < 15; F += 1) {
            var Z = !R && (N >> F & 1) == 1;
            F < 6 ? g[F][8] = Z : F < 8 ? g[F + 1][8] = Z : g[h - 15 + F][8] = Z;
========
        }, Se = function(B) {
          for (var R = i.getBCHTypeNumber($), x = 0; x < 18; x += 1) {
            var N = !B && (R >> x & 1) == 1;
            v[Math.floor(x / 3)][x % 3 + h - 8 - 3] = N;
          }
          for (var x = 0; x < 18; x += 1) {
            var N = !B && (R >> x & 1) == 1;
            v[x % 3 + h - 8 - 3][Math.floor(x / 3)] = N;
          }
        }, qe = function(B, R) {
          for (var x = S << 3 | R, N = i.getBCHTypeInfo(x), W = 0; W < 15; W += 1) {
            var X = !B && (N >> W & 1) == 1;
            W < 6 ? v[W][8] = X : W < 8 ? v[W + 1][8] = X : v[h - 15 + W][8] = X;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }
          for (var W = 0; W < 15; W += 1) {
            var X = !B && (N >> W & 1) == 1;
            W < 8 ? v[8][h - W - 1] = X : W < 9 ? v[8][15 - W - 1 + 1] = X : v[8][15 - W - 1] = X;
          }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          g[h - 8][8] = !R;
        }, We = function(R, L) {
          for (var _ = -1, N = h - 1, F = 7, Z = 0, ae = i.getMaskFunction(L), se = h - 1; se > 0; se -= 2)
========
          v[h - 8][8] = !B;
        }, We = function(B, R) {
          for (var x = -1, N = h - 1, W = 7, X = 0, ae = i.getMaskFunction(R), se = h - 1; se > 0; se -= 2)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            for (se == 6 && (se -= 1); ; ) {
              for (var ge = 0; ge < 2; ge += 1)
                if (v[N][se - ge] == null) {
                  var xe = !1;
                  X < B.length && (xe = (B[X] >>> W & 1) == 1);
                  var re = ae(N, se - ge);
                  re && (xe = !xe), v[N][se - ge] = xe, W -= 1, W == -1 && (X += 1, W = 7);
                }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
              if (N += _, N < 0 || h <= N) {
                N -= _, _ = -_;
                break;
              }
            }
        }, ut = function(R, L) {
          for (var _ = 0, N = 0, F = 0, Z = new Array(L.length), ae = new Array(L.length), se = 0; se < L.length; se += 1) {
            var ge = L[se].dataCount, $e = L[se].totalCount - ge;
            N = Math.max(N, ge), F = Math.max(F, $e), Z[se] = new Array(ge);
            for (var oe = 0; oe < Z[se].length; oe += 1)
              Z[se][oe] = 255 & R.getBuffer()[oe + _];
            _ += ge;
            var Ce = i.getErrorCorrectPolynomial($e), Oe = u(Z[se], Ce.getLength() - 1), Cs = Oe.mod(Ce);
            ae[se] = new Array(Ce.getLength() - 1);
            for (var oe = 0; oe < ae[se].length; oe += 1) {
              var Os = oe + Cs.getLength() - ae[se].length;
              ae[se][oe] = Os >= 0 ? Cs.getAt(Os) : 0;
            }
          }
          for (var Ts = 0, oe = 0; oe < L.length; oe += 1)
            Ts += L[oe].totalCount;
          for (var xn = new Array(Ts), Ft = 0, oe = 0; oe < N; oe += 1)
            for (var se = 0; se < L.length; se += 1)
              oe < Z[se].length && (xn[Ft] = Z[se][oe], Ft += 1);
          for (var oe = 0; oe < F; oe += 1)
            for (var se = 0; se < L.length; se += 1)
              oe < ae[se].length && (xn[Ft] = ae[se][oe], Ft += 1);
          return xn;
        }, Uo = function(R, L, _) {
          for (var N = f.getRSBlocks(R, L), F = m(), Z = 0; Z < _.length; Z += 1) {
            var ae = _[Z];
            F.put(ae.getMode(), 4), F.put(ae.getLength(), i.getLengthInBits(ae.getMode(), R)), ae.write(F);
========
              if (N += x, N < 0 || h <= N) {
                N -= x, x = -x;
                break;
              }
            }
        }, ut = function(B, R) {
          for (var x = 0, N = 0, W = 0, X = new Array(R.length), ae = new Array(R.length), se = 0; se < R.length; se += 1) {
            var ge = R[se].dataCount, xe = R[se].totalCount - ge;
            N = Math.max(N, ge), W = Math.max(W, xe), X[se] = new Array(ge);
            for (var re = 0; re < X[se].length; re += 1)
              X[se][re] = 255 & B.getBuffer()[re + x];
            x += ge;
            var Oe = i.getErrorCorrectPolynomial(xe), Te = u(X[se], Oe.getLength() - 1), Os = Te.mod(Oe);
            ae[se] = new Array(Oe.getLength() - 1);
            for (var re = 0; re < ae[se].length; re += 1) {
              var Ts = re + Os.getLength() - ae[se].length;
              ae[se][re] = Ts >= 0 ? Os.getAt(Ts) : 0;
            }
          }
          for (var Bs = 0, re = 0; re < R.length; re += 1)
            Bs += R[re].totalCount;
          for (var $n = new Array(Bs), Ft = 0, re = 0; re < N; re += 1)
            for (var se = 0; se < R.length; se += 1)
              re < X[se].length && ($n[Ft] = X[se][re], Ft += 1);
          for (var re = 0; re < W; re += 1)
            for (var se = 0; se < R.length; se += 1)
              re < ae[se].length && ($n[Ft] = ae[se][re], Ft += 1);
          return $n;
        }, Vo = function(B, R, x) {
          for (var N = f.getRSBlocks(B, R), W = g(), X = 0; X < x.length; X += 1) {
            var ae = x[X];
            W.put(ae.getMode(), 4), W.put(ae.getLength(), i.getLengthInBits(ae.getMode(), B)), ae.write(W);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }
          for (var se = 0, X = 0; X < N.length; X += 1)
            se += N[X].dataCount;
          if (W.getLengthInBits() > se * 8)
            throw "code length overflow. (" + W.getLengthInBits() + ">" + se * 8 + ")";
          for (W.getLengthInBits() + 4 <= se * 8 && W.put(0, 4); W.getLengthInBits() % 8 != 0; )
            W.putBit(!1);
          for (; !(W.getLengthInBits() >= se * 8 || (W.put(O, 8), W.getLengthInBits() >= se * 8)); )
            W.put(q, 8);
          return ut(W, N);
        };
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        S.addData = function(R, L) {
          L = L || "Byte";
          var _ = null;
          switch (L) {
            case "Numeric":
              _ = y(R);
              break;
            case "Alphanumeric":
              _ = x(R);
              break;
            case "Byte":
              _ = P(R);
              break;
            case "Kanji":
              _ = M(R);
========
        M.addData = function(B, R) {
          R = R || "Byte";
          var x = null;
          switch (R) {
            case "Numeric":
              x = k(B);
              break;
            case "Alphanumeric":
              x = _(B);
              break;
            case "Byte":
              x = D(B);
              break;
            case "Kanji":
              x = P(B);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
              break;
            default:
              throw "mode:" + R;
          }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          B.push(_), C = null;
        }, S.isDark = function(R, L) {
          if (R < 0 || h <= R || L < 0 || h <= L)
            throw R + "," + L;
          return g[R][L];
        }, S.getModuleCount = function() {
========
          T.push(x), A = null;
        }, M.isDark = function(B, R) {
          if (B < 0 || h <= B || R < 0 || h <= R)
            throw B + "," + R;
          return v[B][R];
        }, M.getModuleCount = function() {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          return h;
        }, M.make = function() {
          if ($ < 1) {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
            for (var R = 1; R < 40; R++) {
              for (var L = f.getRSBlocks(R, E), _ = m(), N = 0; N < B.length; N++) {
                var F = B[N];
                _.put(F.getMode(), 4), _.put(F.getLength(), i.getLengthInBits(F.getMode(), R)), F.write(_);
              }
              for (var Z = 0, N = 0; N < L.length; N++)
                Z += L[N].dataCount;
              if (_.getLengthInBits() <= Z * 8)
========
            for (var B = 1; B < 40; B++) {
              for (var R = f.getRSBlocks(B, S), x = g(), N = 0; N < T.length; N++) {
                var W = T[N];
                x.put(W.getMode(), 4), x.put(W.getLength(), i.getLengthInBits(W.getMode(), B)), W.write(x);
              }
              for (var X = 0, N = 0; N < R.length; N++)
                X += R[N].dataCount;
              if (x.getLengthInBits() <= X * 8)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
                break;
            }
            $ = B;
          }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          Y(!1, ue());
        }, S.createTableTag = function(R, L) {
          R = R || 2, L = typeof L > "u" ? R * 4 : L;
          var _ = "";
          _ += '<table style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: " + L + "px;", _ += '">', _ += "<tbody>";
          for (var N = 0; N < S.getModuleCount(); N += 1) {
            _ += "<tr>";
            for (var F = 0; F < S.getModuleCount(); F += 1)
              _ += '<td style="', _ += " border-width: 0px; border-style: none;", _ += " border-collapse: collapse;", _ += " padding: 0px; margin: 0px;", _ += " width: " + R + "px;", _ += " height: " + R + "px;", _ += " background-color: ", _ += S.isDark(N, F) ? "#000000" : "#ffffff", _ += ";", _ += '"/>';
            _ += "</tr>";
          }
          return _ += "</tbody>", _ += "</table>", _;
        }, S.createSvgTag = function(R, L, _, N) {
          var F = {};
          typeof arguments[0] == "object" && (F = arguments[0], R = F.cellSize, L = F.margin, _ = F.alt, N = F.title), R = R || 2, L = typeof L > "u" ? R * 4 : L, _ = typeof _ == "string" ? { text: _ } : _ || {}, _.text = _.text || null, _.id = _.text ? _.id || "qrcode-description" : null, N = typeof N == "string" ? { text: N } : N || {}, N.text = N.text || null, N.id = N.text ? N.id || "qrcode-title" : null;
          var Z = S.getModuleCount() * R + L * 2, ae, se, ge, $e, oe = "", Ce;
          for (Ce = "l" + R + ",0 0," + R + " -" + R + ",0 0,-" + R + "z ", oe += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', oe += F.scalable ? "" : ' width="' + Z + 'px" height="' + Z + 'px"', oe += ' viewBox="0 0 ' + Z + " " + Z + '" ', oe += ' preserveAspectRatio="xMinYMin meet"', oe += N.text || _.text ? ' role="img" aria-labelledby="' + dt([N.id, _.id].join(" ").trim()) + '"' : "", oe += ">", oe += N.text ? '<title id="' + dt(N.id) + '">' + dt(N.text) + "</title>" : "", oe += _.text ? '<description id="' + dt(_.id) + '">' + dt(_.text) + "</description>" : "", oe += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', oe += '<path d="', ge = 0; ge < S.getModuleCount(); ge += 1)
            for ($e = ge * R + L, ae = 0; ae < S.getModuleCount(); ae += 1)
              S.isDark(ge, ae) && (se = ae * R + L, oe += "M" + se + "," + $e + Ce);
          return oe += '" stroke="transparent" fill="black"/>', oe += "</svg>", oe;
        }, S.createDataURL = function(R, L) {
          R = R || 2, L = typeof L > "u" ? R * 4 : L;
          var _ = S.getModuleCount() * R + L * 2, N = L, F = _ - L;
          return k(_, _, function(Z, ae) {
            if (N <= Z && Z < F && N <= ae && ae < F) {
              var se = Math.floor((Z - N) / R), ge = Math.floor((ae - N) / R);
              return S.isDark(ge, se) ? 0 : 1;
            } else
              return 1;
          });
        }, S.createImgTag = function(R, L, _) {
          R = R || 2, L = typeof L > "u" ? R * 4 : L;
          var N = S.getModuleCount() * R + L * 2, F = "";
          return F += "<img", F += ' src="', F += S.createDataURL(R, L), F += '"', F += ' width="', F += N, F += '"', F += ' height="', F += N, F += '"', _ && (F += ' alt="', F += dt(_), F += '"'), F += "/>", F;
        };
        var dt = function(R) {
          for (var L = "", _ = 0; _ < R.length; _ += 1) {
            var N = R.charAt(_);
========
          Z(!1, de());
        }, M.createTableTag = function(B, R) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var x = "";
          x += '<table style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: " + R + "px;", x += '">', x += "<tbody>";
          for (var N = 0; N < M.getModuleCount(); N += 1) {
            x += "<tr>";
            for (var W = 0; W < M.getModuleCount(); W += 1)
              x += '<td style="', x += " border-width: 0px; border-style: none;", x += " border-collapse: collapse;", x += " padding: 0px; margin: 0px;", x += " width: " + B + "px;", x += " height: " + B + "px;", x += " background-color: ", x += M.isDark(N, W) ? "#000000" : "#ffffff", x += ";", x += '"/>';
            x += "</tr>";
          }
          return x += "</tbody>", x += "</table>", x;
        }, M.createSvgTag = function(B, R, x, N) {
          var W = {};
          typeof arguments[0] == "object" && (W = arguments[0], B = W.cellSize, R = W.margin, x = W.alt, N = W.title), B = B || 2, R = typeof R > "u" ? B * 4 : R, x = typeof x == "string" ? { text: x } : x || {}, x.text = x.text || null, x.id = x.text ? x.id || "qrcode-description" : null, N = typeof N == "string" ? { text: N } : N || {}, N.text = N.text || null, N.id = N.text ? N.id || "qrcode-title" : null;
          var X = M.getModuleCount() * B + R * 2, ae, se, ge, xe, re = "", Oe;
          for (Oe = "l" + B + ",0 0," + B + " -" + B + ",0 0,-" + B + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += W.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', re += ' viewBox="0 0 ' + X + " " + X + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += N.text || x.text ? ' role="img" aria-labelledby="' + dt([N.id, x.id].join(" ").trim()) + '"' : "", re += ">", re += N.text ? '<title id="' + dt(N.id) + '">' + dt(N.text) + "</title>" : "", re += x.text ? '<description id="' + dt(x.id) + '">' + dt(x.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', ge = 0; ge < M.getModuleCount(); ge += 1)
            for (xe = ge * B + R, ae = 0; ae < M.getModuleCount(); ae += 1)
              M.isDark(ge, ae) && (se = ae * B + R, re += "M" + se + "," + xe + Oe);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, M.createDataURL = function(B, R) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var x = M.getModuleCount() * B + R * 2, N = R, W = x - R;
          return y(x, x, function(X, ae) {
            if (N <= X && X < W && N <= ae && ae < W) {
              var se = Math.floor((X - N) / B), ge = Math.floor((ae - N) / B);
              return M.isDark(ge, se) ? 0 : 1;
            } else
              return 1;
          });
        }, M.createImgTag = function(B, R, x) {
          B = B || 2, R = typeof R > "u" ? B * 4 : R;
          var N = M.getModuleCount() * B + R * 2, W = "";
          return W += "<img", W += ' src="', W += M.createDataURL(B, R), W += '"', W += ' width="', W += N, W += '"', W += ' height="', W += N, W += '"', x && (W += ' alt="', W += dt(x), W += '"'), W += "/>", W;
        };
        var dt = function(B) {
          for (var R = "", x = 0; x < B.length; x += 1) {
            var N = B.charAt(x);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            switch (N) {
              case "<":
                R += "&lt;";
                break;
              case ">":
                R += "&gt;";
                break;
              case "&":
                R += "&amp;";
                break;
              case '"':
                R += "&quot;";
                break;
              default:
                R += N;
                break;
            }
          }
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          return L;
        }, Vo = function(R) {
          var L = 1;
          R = typeof R > "u" ? L * 2 : R;
          var _ = S.getModuleCount() * L + R * 2, N = R, F = _ - R, Z, ae, se, ge, $e, oe = {
========
          return R;
        }, zo = function(B) {
          var R = 1;
          B = typeof B > "u" ? R * 2 : B;
          var x = M.getModuleCount() * R + B * 2, N = B, W = x - B, X, ae, se, ge, xe, re = {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Oe = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          }, Oe = "";
          for (Z = 0; Z < _; Z += 2) {
            for (se = Math.floor((Z - N) / L), ge = Math.floor((Z + 1 - N) / L), ae = 0; ae < _; ae += 1)
              $e = "█", N <= ae && ae < F && N <= Z && Z < F && S.isDark(se, Math.floor((ae - N) / L)) && ($e = " "), N <= ae && ae < F && N <= Z + 1 && Z + 1 < F && S.isDark(ge, Math.floor((ae - N) / L)) ? $e += " " : $e += "█", Oe += R < 1 && Z + 1 >= F ? Ce[$e] : oe[$e];
            Oe += `
`;
          }
          return _ % 2 && R > 0 ? Oe.substring(0, Oe.length - _ - 1) + Array(_ + 1).join("▀") : Oe.substring(0, Oe.length - 1);
        };
        return S.createASCII = function(R, L) {
          if (R = R || 1, R < 2)
            return Vo(L);
          R -= 1, L = typeof L > "u" ? R * 2 : L;
          var _ = S.getModuleCount() * R + L * 2, N = L, F = _ - L, Z, ae, se, ge, $e = Array(R + 1).join("██"), oe = Array(R + 1).join("  "), Ce = "", Oe = "";
          for (Z = 0; Z < _; Z += 1) {
            for (se = Math.floor((Z - N) / R), Oe = "", ae = 0; ae < _; ae += 1)
              ge = 1, N <= ae && ae < F && N <= Z && Z < F && S.isDark(se, Math.floor((ae - N) / R)) && (ge = 0), Oe += ge ? $e : oe;
            for (se = 0; se < R; se += 1)
              Ce += Oe + `
`;
          }
          return Ce.substring(0, Ce.length - 1);
        }, S.renderTo2dContext = function(R, L) {
          L = L || 2;
          for (var _ = S.getModuleCount(), N = 0; N < _; N++)
            for (var F = 0; F < _; F++)
              R.fillStyle = S.isDark(N, F) ? "black" : "white", R.fillRect(N * L, F * L, L, L);
        }, S;
========
          }, Te = "";
          for (X = 0; X < x; X += 2) {
            for (se = Math.floor((X - N) / R), ge = Math.floor((X + 1 - N) / R), ae = 0; ae < x; ae += 1)
              xe = "█", N <= ae && ae < W && N <= X && X < W && M.isDark(se, Math.floor((ae - N) / R)) && (xe = " "), N <= ae && ae < W && N <= X + 1 && X + 1 < W && M.isDark(ge, Math.floor((ae - N) / R)) ? xe += " " : xe += "█", Te += B < 1 && X + 1 >= W ? Oe[xe] : re[xe];
            Te += `
`;
          }
          return x % 2 && B > 0 ? Te.substring(0, Te.length - x - 1) + Array(x + 1).join("▀") : Te.substring(0, Te.length - 1);
        };
        return M.createASCII = function(B, R) {
          if (B = B || 1, B < 2)
            return zo(R);
          B -= 1, R = typeof R > "u" ? B * 2 : R;
          var x = M.getModuleCount() * B + R * 2, N = R, W = x - R, X, ae, se, ge, xe = Array(B + 1).join("██"), re = Array(B + 1).join("  "), Oe = "", Te = "";
          for (X = 0; X < x; X += 1) {
            for (se = Math.floor((X - N) / B), Te = "", ae = 0; ae < x; ae += 1)
              ge = 1, N <= ae && ae < W && N <= X && X < W && M.isDark(se, Math.floor((ae - N) / B)) && (ge = 0), Te += ge ? xe : re;
            for (se = 0; se < B; se += 1)
              Oe += Te + `
`;
          }
          return Oe.substring(0, Oe.length - 1);
        }, M.renderTo2dContext = function(B, R) {
          R = R || 2;
          for (var x = M.getModuleCount(), N = 0; N < x; N++)
            for (var W = 0; W < x; W++)
              B.fillStyle = M.isDark(N, W) ? "black" : "white", B.fillRect(N * R, W * R, R, R);
        }, M;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      };
      s.stringToBytesFuncs = {
        default: function(m) {
          for (var I = [], O = 0; O < m.length; O += 1) {
            var q = m.charCodeAt(O);
            I.push(q & 255);
          }
          return I;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(m, I) {
        var O = (function() {
          for (var $ = H(m), S = function() {
            var le = $.read();
            if (le == -1) throw "eof";
            return le;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
          }, g = 0, h = {}; ; ) {
            var C = $.read();
            if (C == -1) break;
            var B = E(), S = E(), Y = E(), V = String.fromCharCode(C << 8 | B), ue = S << 8 | Y;
            h[V] = ue, g += 1;
========
          }, v = 0, h = {}; ; ) {
            var A = $.read();
            if (A == -1) break;
            var T = S(), M = S(), Z = S(), z = String.fromCharCode(A << 8 | T), de = M << 8 | Z;
            h[z] = de, v += 1;
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          }
          if (v != I)
            throw v + " != " + I;
          return h;
        })(), q = 63;
        return function($) {
          for (var S = [], v = 0; v < $.length; v += 1) {
            var h = $.charCodeAt(v);
            if (h < 128)
              S.push(h);
            else {
              var A = O[$.charAt(v)];
              typeof A == "number" ? (A & 255) == A ? S.push(A) : (S.push(A >>> 8), S.push(A & 255)) : S.push(q);
            }
          }
          return S;
        };
      };
      var a = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, o = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, r = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, i = (function() {
        var m = [
          [],
          [6, 18],
          [6, 22],
          [6, 26],
          [6, 30],
          [6, 34],
          [6, 22, 38],
          [6, 24, 42],
          [6, 26, 46],
          [6, 28, 50],
          [6, 30, 54],
          [6, 32, 58],
          [6, 34, 62],
          [6, 26, 46, 66],
          [6, 26, 48, 70],
          [6, 26, 50, 74],
          [6, 30, 54, 78],
          [6, 30, 56, 82],
          [6, 30, 58, 86],
          [6, 34, 62, 90],
          [6, 28, 50, 72, 94],
          [6, 26, 50, 74, 98],
          [6, 30, 54, 78, 102],
          [6, 28, 54, 80, 106],
          [6, 32, 58, 84, 110],
          [6, 30, 58, 86, 114],
          [6, 34, 62, 90, 118],
          [6, 26, 50, 74, 98, 122],
          [6, 30, 54, 78, 102, 126],
          [6, 26, 52, 78, 104, 130],
          [6, 30, 56, 82, 108, 134],
          [6, 34, 60, 86, 112, 138],
          [6, 30, 58, 86, 114, 142],
          [6, 34, 62, 90, 118, 146],
          [6, 30, 54, 78, 102, 126, 150],
          [6, 24, 50, 76, 102, 128, 154],
          [6, 28, 54, 80, 106, 132, 158],
          [6, 32, 58, 84, 110, 136, 162],
          [6, 26, 54, 82, 110, 138, 166],
          [6, 30, 58, 86, 114, 142, 170]
        ], I = 1335, O = 7973, q = 21522, $ = {}, S = function(v) {
          for (var h = 0; v != 0; )
            h += 1, v >>>= 1;
          return h;
        };
        return $.getBCHTypeInfo = function(v) {
          for (var h = v << 10; S(h) - S(I) >= 0; )
            h ^= I << S(h) - S(I);
          return (v << 10 | h) ^ q;
        }, $.getBCHTypeNumber = function(v) {
          for (var h = v << 12; S(h) - S(O) >= 0; )
            h ^= O << S(h) - S(O);
          return v << 12 | h;
        }, $.getPatternPosition = function(v) {
          return m[v - 1];
        }, $.getMaskFunction = function(v) {
          switch (v) {
            case r.PATTERN000:
              return function(h, A) {
                return (h + A) % 2 == 0;
              };
            case r.PATTERN001:
              return function(h, A) {
                return h % 2 == 0;
              };
            case r.PATTERN010:
              return function(h, A) {
                return A % 3 == 0;
              };
            case r.PATTERN011:
              return function(h, A) {
                return (h + A) % 3 == 0;
              };
            case r.PATTERN100:
              return function(h, A) {
                return (Math.floor(h / 2) + Math.floor(A / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(h, A) {
                return h * A % 2 + h * A % 3 == 0;
              };
            case r.PATTERN110:
              return function(h, A) {
                return (h * A % 2 + h * A % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(h, A) {
                return (h * A % 3 + (h + A) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + v;
          }
        }, $.getErrorCorrectPolynomial = function(v) {
          for (var h = u([1], 0), A = 0; A < v; A += 1)
            h = h.multiply(u([1, c.gexp(A)], 0));
          return h;
        }, $.getLengthInBits = function(v, h) {
          if (1 <= h && h < 10)
            switch (v) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + v;
            }
          else if (h < 27)
            switch (v) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + v;
            }
          else if (h < 41)
            switch (v) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + v;
            }
          else
            throw "type:" + h;
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        }, $.getLostPoint = function(g) {
          for (var h = g.getModuleCount(), C = 0, B = 0; B < h; B += 1)
            for (var S = 0; S < h; S += 1) {
              for (var Y = 0, V = g.isDark(B, S), ue = -1; ue <= 1; ue += 1)
                if (!(B + ue < 0 || h <= B + ue))
                  for (var le = -1; le <= 1; le += 1)
                    S + le < 0 || h <= S + le || ue == 0 && le == 0 || V == g.isDark(B + ue, S + le) && (Y += 1);
              Y > 5 && (C += 3 + Y - 5);
========
        }, $.getLostPoint = function(v) {
          for (var h = v.getModuleCount(), A = 0, T = 0; T < h; T += 1)
            for (var M = 0; M < h; M += 1) {
              for (var Z = 0, z = v.isDark(T, M), de = -1; de <= 1; de += 1)
                if (!(T + de < 0 || h <= T + de))
                  for (var le = -1; le <= 1; le += 1)
                    M + le < 0 || h <= M + le || de == 0 && le == 0 || z == v.isDark(T + de, M + le) && (Z += 1);
              Z > 5 && (A += 3 + Z - 5);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
            }
          for (var T = 0; T < h - 1; T += 1)
            for (var M = 0; M < h - 1; M += 1) {
              var me = 0;
              v.isDark(T, M) && (me += 1), v.isDark(T + 1, M) && (me += 1), v.isDark(T, M + 1) && (me += 1), v.isDark(T + 1, M + 1) && (me += 1), (me == 0 || me == 4) && (A += 3);
            }
          for (var T = 0; T < h; T += 1)
            for (var M = 0; M < h - 6; M += 1)
              v.isDark(T, M) && !v.isDark(T, M + 1) && v.isDark(T, M + 2) && v.isDark(T, M + 3) && v.isDark(T, M + 4) && !v.isDark(T, M + 5) && v.isDark(T, M + 6) && (A += 40);
          for (var M = 0; M < h; M += 1)
            for (var T = 0; T < h - 6; T += 1)
              v.isDark(T, M) && !v.isDark(T + 1, M) && v.isDark(T + 2, M) && v.isDark(T + 3, M) && v.isDark(T + 4, M) && !v.isDark(T + 5, M) && v.isDark(T + 6, M) && (A += 40);
          for (var Se = 0, M = 0; M < h; M += 1)
            for (var T = 0; T < h; T += 1)
              v.isDark(T, M) && (Se += 1);
          var qe = Math.abs(100 * Se / h / h - 50) / 5;
          return A += qe * 10, A;
        }, $;
      })(), c = (function() {
        for (var m = new Array(256), I = new Array(256), O = 0; O < 8; O += 1)
          m[O] = 1 << O;
        for (var O = 8; O < 256; O += 1)
          m[O] = m[O - 4] ^ m[O - 5] ^ m[O - 6] ^ m[O - 8];
        for (var O = 0; O < 255; O += 1)
          I[m[O]] = O;
        var q = {};
        return q.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return I[$];
        }, q.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return m[$];
        }, q;
      })();
      function u(m, I) {
        if (typeof m.length > "u")
          throw m.length + "/" + I;
        var O = (function() {
          for (var $ = 0; $ < m.length && m[$] == 0; )
            $ += 1;
          for (var S = new Array(m.length - $ + I), v = 0; v < m.length - $; v += 1)
            S[v] = m[v + $];
          return S;
        })(), q = {};
        return q.getAt = function($) {
          return O[$];
        }, q.getLength = function() {
          return O.length;
        }, q.multiply = function($) {
          for (var S = new Array(q.getLength() + $.getLength() - 1), v = 0; v < q.getLength(); v += 1)
            for (var h = 0; h < $.getLength(); h += 1)
              S[v + h] ^= c.gexp(c.glog(q.getAt(v)) + c.glog($.getAt(h)));
          return u(S, 0);
        }, q.mod = function($) {
          if (q.getLength() - $.getLength() < 0)
            return q;
          for (var S = c.glog(q.getAt(0)) - c.glog($.getAt(0)), v = new Array(q.getLength()), h = 0; h < q.getLength(); h += 1)
            v[h] = q.getAt(h);
          for (var h = 0; h < $.getLength(); h += 1)
            v[h] ^= c.gexp(c.glog($.getAt(h)) + S);
          return u(v, 0).mod($);
        }, q;
      }
      var f = (function() {
        var m = [
          // L
          // M
          // Q
          // H
          // 1
          [1, 26, 19],
          [1, 26, 16],
          [1, 26, 13],
          [1, 26, 9],
          // 2
          [1, 44, 34],
          [1, 44, 28],
          [1, 44, 22],
          [1, 44, 16],
          // 3
          [1, 70, 55],
          [1, 70, 44],
          [2, 35, 17],
          [2, 35, 13],
          // 4
          [1, 100, 80],
          [2, 50, 32],
          [2, 50, 24],
          [4, 25, 9],
          // 5
          [1, 134, 108],
          [2, 67, 43],
          [2, 33, 15, 2, 34, 16],
          [2, 33, 11, 2, 34, 12],
          // 6
          [2, 86, 68],
          [4, 43, 27],
          [4, 43, 19],
          [4, 43, 15],
          // 7
          [2, 98, 78],
          [4, 49, 31],
          [2, 32, 14, 4, 33, 15],
          [4, 39, 13, 1, 40, 14],
          // 8
          [2, 121, 97],
          [2, 60, 38, 2, 61, 39],
          [4, 40, 18, 2, 41, 19],
          [4, 40, 14, 2, 41, 15],
          // 9
          [2, 146, 116],
          [3, 58, 36, 2, 59, 37],
          [4, 36, 16, 4, 37, 17],
          [4, 36, 12, 4, 37, 13],
          // 10
          [2, 86, 68, 2, 87, 69],
          [4, 69, 43, 1, 70, 44],
          [6, 43, 19, 2, 44, 20],
          [6, 43, 15, 2, 44, 16],
          // 11
          [4, 101, 81],
          [1, 80, 50, 4, 81, 51],
          [4, 50, 22, 4, 51, 23],
          [3, 36, 12, 8, 37, 13],
          // 12
          [2, 116, 92, 2, 117, 93],
          [6, 58, 36, 2, 59, 37],
          [4, 46, 20, 6, 47, 21],
          [7, 42, 14, 4, 43, 15],
          // 13
          [4, 133, 107],
          [8, 59, 37, 1, 60, 38],
          [8, 44, 20, 4, 45, 21],
          [12, 33, 11, 4, 34, 12],
          // 14
          [3, 145, 115, 1, 146, 116],
          [4, 64, 40, 5, 65, 41],
          [11, 36, 16, 5, 37, 17],
          [11, 36, 12, 5, 37, 13],
          // 15
          [5, 109, 87, 1, 110, 88],
          [5, 65, 41, 5, 66, 42],
          [5, 54, 24, 7, 55, 25],
          [11, 36, 12, 7, 37, 13],
          // 16
          [5, 122, 98, 1, 123, 99],
          [7, 73, 45, 3, 74, 46],
          [15, 43, 19, 2, 44, 20],
          [3, 45, 15, 13, 46, 16],
          // 17
          [1, 135, 107, 5, 136, 108],
          [10, 74, 46, 1, 75, 47],
          [1, 50, 22, 15, 51, 23],
          [2, 42, 14, 17, 43, 15],
          // 18
          [5, 150, 120, 1, 151, 121],
          [9, 69, 43, 4, 70, 44],
          [17, 50, 22, 1, 51, 23],
          [2, 42, 14, 19, 43, 15],
          // 19
          [3, 141, 113, 4, 142, 114],
          [3, 70, 44, 11, 71, 45],
          [17, 47, 21, 4, 48, 22],
          [9, 39, 13, 16, 40, 14],
          // 20
          [3, 135, 107, 5, 136, 108],
          [3, 67, 41, 13, 68, 42],
          [15, 54, 24, 5, 55, 25],
          [15, 43, 15, 10, 44, 16],
          // 21
          [4, 144, 116, 4, 145, 117],
          [17, 68, 42],
          [17, 50, 22, 6, 51, 23],
          [19, 46, 16, 6, 47, 17],
          // 22
          [2, 139, 111, 7, 140, 112],
          [17, 74, 46],
          [7, 54, 24, 16, 55, 25],
          [34, 37, 13],
          // 23
          [4, 151, 121, 5, 152, 122],
          [4, 75, 47, 14, 76, 48],
          [11, 54, 24, 14, 55, 25],
          [16, 45, 15, 14, 46, 16],
          // 24
          [6, 147, 117, 4, 148, 118],
          [6, 73, 45, 14, 74, 46],
          [11, 54, 24, 16, 55, 25],
          [30, 46, 16, 2, 47, 17],
          // 25
          [8, 132, 106, 4, 133, 107],
          [8, 75, 47, 13, 76, 48],
          [7, 54, 24, 22, 55, 25],
          [22, 45, 15, 13, 46, 16],
          // 26
          [10, 142, 114, 2, 143, 115],
          [19, 74, 46, 4, 75, 47],
          [28, 50, 22, 6, 51, 23],
          [33, 46, 16, 4, 47, 17],
          // 27
          [8, 152, 122, 4, 153, 123],
          [22, 73, 45, 3, 74, 46],
          [8, 53, 23, 26, 54, 24],
          [12, 45, 15, 28, 46, 16],
          // 28
          [3, 147, 117, 10, 148, 118],
          [3, 73, 45, 23, 74, 46],
          [4, 54, 24, 31, 55, 25],
          [11, 45, 15, 31, 46, 16],
          // 29
          [7, 146, 116, 7, 147, 117],
          [21, 73, 45, 7, 74, 46],
          [1, 53, 23, 37, 54, 24],
          [19, 45, 15, 26, 46, 16],
          // 30
          [5, 145, 115, 10, 146, 116],
          [19, 75, 47, 10, 76, 48],
          [15, 54, 24, 25, 55, 25],
          [23, 45, 15, 25, 46, 16],
          // 31
          [13, 145, 115, 3, 146, 116],
          [2, 74, 46, 29, 75, 47],
          [42, 54, 24, 1, 55, 25],
          [23, 45, 15, 28, 46, 16],
          // 32
          [17, 145, 115],
          [10, 74, 46, 23, 75, 47],
          [10, 54, 24, 35, 55, 25],
          [19, 45, 15, 35, 46, 16],
          // 33
          [17, 145, 115, 1, 146, 116],
          [14, 74, 46, 21, 75, 47],
          [29, 54, 24, 19, 55, 25],
          [11, 45, 15, 46, 46, 16],
          // 34
          [13, 145, 115, 6, 146, 116],
          [14, 74, 46, 23, 75, 47],
          [44, 54, 24, 7, 55, 25],
          [59, 46, 16, 1, 47, 17],
          // 35
          [12, 151, 121, 7, 152, 122],
          [12, 75, 47, 26, 76, 48],
          [39, 54, 24, 14, 55, 25],
          [22, 45, 15, 41, 46, 16],
          // 36
          [6, 151, 121, 14, 152, 122],
          [6, 75, 47, 34, 76, 48],
          [46, 54, 24, 10, 55, 25],
          [2, 45, 15, 64, 46, 16],
          // 37
          [17, 152, 122, 4, 153, 123],
          [29, 74, 46, 14, 75, 47],
          [49, 54, 24, 10, 55, 25],
          [24, 45, 15, 46, 46, 16],
          // 38
          [4, 152, 122, 18, 153, 123],
          [13, 74, 46, 32, 75, 47],
          [48, 54, 24, 14, 55, 25],
          [42, 45, 15, 32, 46, 16],
          // 39
          [20, 147, 117, 4, 148, 118],
          [40, 75, 47, 7, 76, 48],
          [43, 54, 24, 22, 55, 25],
          [10, 45, 15, 67, 46, 16],
          // 40
          [19, 148, 118, 6, 149, 119],
          [18, 75, 47, 31, 76, 48],
          [34, 54, 24, 34, 55, 25],
          [20, 45, 15, 61, 46, 16]
        ], I = function($, S) {
          var v = {};
          return v.totalCount = $, v.dataCount = S, v;
        }, O = {}, q = function($, S) {
          switch (S) {
            case o.L:
              return m[($ - 1) * 4 + 0];
            case o.M:
              return m[($ - 1) * 4 + 1];
            case o.Q:
              return m[($ - 1) * 4 + 2];
            case o.H:
              return m[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        return T.getRSBlocks = function($, E) {
          var g = W($, E);
          if (typeof g > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + E;
          for (var h = g.length / 3, C = [], B = 0; B < h; B += 1)
            for (var S = g[B * 3 + 0], Y = g[B * 3 + 1], V = g[B * 3 + 2], ue = 0; ue < S; ue += 1)
              C.push(D(Y, V));
          return C;
        }, T;
      })(), m = function() {
        var v = [], D = 0, T = {};
        return T.getBuffer = function() {
          return v;
        }, T.getAt = function(W) {
          var $ = Math.floor(W / 8);
          return (v[$] >>> 7 - W % 8 & 1) == 1;
        }, T.put = function(W, $) {
          for (var E = 0; E < $; E += 1)
            T.putBit((W >>> $ - E - 1 & 1) == 1);
        }, T.getLengthInBits = function() {
          return D;
        }, T.putBit = function(W) {
          var $ = Math.floor(D / 8);
          v.length <= $ && v.push(0), W && (v[$] |= 128 >>> D % 8), D += 1;
        }, T;
      }, y = function(v) {
        var D = a.MODE_NUMBER, T = v, W = {};
        W.getMode = function() {
          return D;
        }, W.getLength = function(g) {
          return T.length;
        }, W.write = function(g) {
          for (var h = T, C = 0; C + 2 < h.length; )
            g.put($(h.substring(C, C + 3)), 10), C += 3;
          C < h.length && (h.length - C == 1 ? g.put($(h.substring(C, C + 1)), 4) : h.length - C == 2 && g.put($(h.substring(C, C + 2)), 7));
========
        return O.getRSBlocks = function($, S) {
          var v = q($, S);
          if (typeof v > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + S;
          for (var h = v.length / 3, A = [], T = 0; T < h; T += 1)
            for (var M = v[T * 3 + 0], Z = v[T * 3 + 1], z = v[T * 3 + 2], de = 0; de < M; de += 1)
              A.push(I(Z, z));
          return A;
        }, O;
      })(), g = function() {
        var m = [], I = 0, O = {};
        return O.getBuffer = function() {
          return m;
        }, O.getAt = function(q) {
          var $ = Math.floor(q / 8);
          return (m[$] >>> 7 - q % 8 & 1) == 1;
        }, O.put = function(q, $) {
          for (var S = 0; S < $; S += 1)
            O.putBit((q >>> $ - S - 1 & 1) == 1);
        }, O.getLengthInBits = function() {
          return I;
        }, O.putBit = function(q) {
          var $ = Math.floor(I / 8);
          m.length <= $ && m.push(0), q && (m[$] |= 128 >>> I % 8), I += 1;
        }, O;
      }, k = function(m) {
        var I = a.MODE_NUMBER, O = m, q = {};
        q.getMode = function() {
          return I;
        }, q.getLength = function(v) {
          return O.length;
        }, q.write = function(v) {
          for (var h = O, A = 0; A + 2 < h.length; )
            v.put($(h.substring(A, A + 3)), 10), A += 3;
          A < h.length && (h.length - A == 1 ? v.put($(h.substring(A, A + 1)), 4) : h.length - A == 2 && v.put($(h.substring(A, A + 2)), 7));
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        };
        var $ = function(v) {
          for (var h = 0, A = 0; A < v.length; A += 1)
            h = h * 10 + S(v.charAt(A));
          return h;
        }, S = function(v) {
          if ("0" <= v && v <= "9")
            return v.charCodeAt(0) - 48;
          throw "illegal char :" + v;
        };
        return q;
      }, _ = function(m) {
        var I = a.MODE_ALPHA_NUM, O = m, q = {};
        q.getMode = function() {
          return I;
        }, q.getLength = function(S) {
          return O.length;
        }, q.write = function(S) {
          for (var v = O, h = 0; h + 1 < v.length; )
            S.put(
              $(v.charAt(h)) * 45 + $(v.charAt(h + 1)),
              11
            ), h += 2;
          h < v.length && S.put($(v.charAt(h)), 6);
        };
        var $ = function(S) {
          if ("0" <= S && S <= "9")
            return S.charCodeAt(0) - 48;
          if ("A" <= S && S <= "Z")
            return S.charCodeAt(0) - 65 + 10;
          switch (S) {
            case " ":
              return 36;
            case "$":
              return 37;
            case "%":
              return 38;
            case "*":
              return 39;
            case "+":
              return 40;
            case "-":
              return 41;
            case ".":
              return 42;
            case "/":
              return 43;
            case ":":
              return 44;
            default:
              throw "illegal char :" + S;
          }
        };
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        return W;
      }, P = function(v) {
        var D = a.MODE_8BIT_BYTE, T = s.stringToBytes(v), W = {};
        return W.getMode = function() {
          return D;
        }, W.getLength = function($) {
          return T.length;
        }, W.write = function($) {
          for (var E = 0; E < T.length; E += 1)
            $.put(T[E], 8);
        }, W;
      }, M = function(v) {
        var D = a.MODE_KANJI, T = s.stringToBytesFuncs.SJIS;
        if (!T)
========
        return q;
      }, D = function(m) {
        var I = a.MODE_8BIT_BYTE, O = s.stringToBytes(m), q = {};
        return q.getMode = function() {
          return I;
        }, q.getLength = function($) {
          return O.length;
        }, q.write = function($) {
          for (var S = 0; S < O.length; S += 1)
            $.put(O[S], 8);
        }, q;
      }, P = function(m) {
        var I = a.MODE_KANJI, O = s.stringToBytesFuncs.SJIS;
        if (!O)
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          throw "sjis not supported.";
        (function(S, v) {
          var h = O(S);
          if (h.length != 2 || (h[0] << 8 | h[1]) != v)
            throw "sjis not supported.";
        })("友", 38726);
        var q = O(m), $ = {};
        return $.getMode = function() {
          return I;
        }, $.getLength = function(S) {
          return ~~(q.length / 2);
        }, $.write = function(S) {
          for (var v = q, h = 0; h + 1 < v.length; ) {
            var A = (255 & v[h]) << 8 | 255 & v[h + 1];
            if (33088 <= A && A <= 40956)
              A -= 33088;
            else if (57408 <= A && A <= 60351)
              A -= 49472;
            else
              throw "illegal char at " + (h + 1) + "/" + A;
            A = (A >>> 8 & 255) * 192 + (A & 255), S.put(A, 13), h += 2;
          }
          if (h < v.length)
            throw "illegal char at " + (h + 1);
        }, $;
      }, b = function() {
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        var v = [], D = {};
        return D.writeByte = function(T) {
          v.push(T & 255);
        }, D.writeShort = function(T) {
          D.writeByte(T), D.writeByte(T >>> 8);
        }, D.writeBytes = function(T, W, $) {
          W = W || 0, $ = $ || T.length;
          for (var E = 0; E < $; E += 1)
            D.writeByte(T[E + W]);
        }, D.writeString = function(T) {
          for (var W = 0; W < T.length; W += 1)
            D.writeByte(T.charCodeAt(W));
        }, D.toByteArray = function() {
          return v;
        }, D.toString = function() {
          var T = "";
          T += "[";
          for (var W = 0; W < v.length; W += 1)
            W > 0 && (T += ","), T += v[W];
          return T += "]", T;
        }, D;
      }, A = function() {
        var v = 0, D = 0, T = 0, W = "", $ = {}, E = function(h) {
          W += String.fromCharCode(g(h & 63));
        }, g = function(h) {
========
        var m = [], I = {};
        return I.writeByte = function(O) {
          m.push(O & 255);
        }, I.writeShort = function(O) {
          I.writeByte(O), I.writeByte(O >>> 8);
        }, I.writeBytes = function(O, q, $) {
          q = q || 0, $ = $ || O.length;
          for (var S = 0; S < $; S += 1)
            I.writeByte(O[S + q]);
        }, I.writeString = function(O) {
          for (var q = 0; q < O.length; q += 1)
            I.writeByte(O.charCodeAt(q));
        }, I.toByteArray = function() {
          return m;
        }, I.toString = function() {
          var O = "";
          O += "[";
          for (var q = 0; q < m.length; q += 1)
            q > 0 && (O += ","), O += m[q];
          return O += "]", O;
        }, I;
      }, E = function() {
        var m = 0, I = 0, O = 0, q = "", $ = {}, S = function(h) {
          q += String.fromCharCode(v(h & 63));
        }, v = function(h) {
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
          if (!(h < 0)) {
            if (h < 26)
              return 65 + h;
            if (h < 52)
              return 97 + (h - 26);
            if (h < 62)
              return 48 + (h - 52);
            if (h == 62)
              return 43;
            if (h == 63)
              return 47;
          }
          throw "n:" + h;
        };
        return $.writeByte = function(h) {
          for (m = m << 8 | h & 255, I += 8, O += 1; I >= 6; )
            S(m >>> I - 6), I -= 6;
        }, $.flush = function() {
          if (I > 0 && (S(m << 6 - I), m = 0, I = 0), O % 3 != 0)
            for (var h = 3 - O % 3, A = 0; A < h; A += 1)
              q += "=";
        }, $.toString = function() {
          return q;
        }, $;
      }, H = function(m) {
        var I = m, O = 0, q = 0, $ = 0, S = {};
        S.read = function() {
          for (; $ < 8; ) {
            if (O >= I.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var h = I.charAt(O);
            if (O += 1, h == "=")
              return $ = 0, -1;
            if (h.match(/^\s$/))
              continue;
            q = q << 6 | v(h.charCodeAt(0)), $ += 6;
          }
          var A = q >>> $ - 8 & 255;
          return $ -= 8, A;
        };
        var v = function(h) {
          if (65 <= h && h <= 90)
            return h - 65;
          if (97 <= h && h <= 122)
            return h - 97 + 26;
          if (48 <= h && h <= 57)
            return h - 48 + 52;
          if (h == 43)
            return 62;
          if (h == 47)
            return 63;
          throw "c:" + h;
        };
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
        return E;
      }, ee = function(v, D) {
        var T = v, W = D, $ = new Array(v * D), E = {};
        E.setPixel = function(B, S, Y) {
          $[S * T + B] = Y;
        }, E.write = function(B) {
          B.writeString("GIF87a"), B.writeShort(T), B.writeShort(W), B.writeByte(128), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(0), B.writeByte(255), B.writeByte(255), B.writeByte(255), B.writeString(","), B.writeShort(0), B.writeShort(0), B.writeShort(T), B.writeShort(W), B.writeByte(0);
          var S = 2, Y = h(S);
          B.writeByte(S);
          for (var V = 0; Y.length - V > 255; )
            B.writeByte(255), B.writeBytes(Y, V, 255), V += 255;
          B.writeByte(Y.length - V), B.writeBytes(Y, V, Y.length - V), B.writeByte(0), B.writeString(";");
        };
        var g = function(B) {
          var S = B, Y = 0, V = 0, ue = {};
          return ue.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; Y + me >= 8; )
              S.writeByte(255 & (le << Y | V)), me -= 8 - Y, le >>>= 8 - Y, V = 0, Y = 0;
            V = le << Y | V, Y = Y + me;
          }, ue.flush = function() {
            Y > 0 && S.writeByte(V);
          }, ue;
        }, h = function(B) {
          for (var S = 1 << B, Y = (1 << B) + 1, V = B + 1, ue = C(), le = 0; le < S; le += 1)
            ue.add(String.fromCharCode(le));
          ue.add(String.fromCharCode(S)), ue.add(String.fromCharCode(Y));
          var me = b(), Se = g(me);
          Se.write(S, V);
          var qe = 0, We = String.fromCharCode($[qe]);
          for (qe += 1; qe < $.length; ) {
            var ut = String.fromCharCode($[qe]);
            qe += 1, ue.contains(We + ut) ? We = We + ut : (Se.write(ue.indexOf(We), V), ue.size() < 4095 && (ue.size() == 1 << V && (V += 1), ue.add(We + ut)), We = ut);
          }
          return Se.write(ue.indexOf(We), V), Se.write(Y, V), Se.flush(), me.toByteArray();
        }, C = function() {
          var B = {}, S = 0, Y = {};
          return Y.add = function(V) {
            if (Y.contains(V))
              throw "dup key:" + V;
            B[V] = S, S += 1;
          }, Y.size = function() {
            return S;
          }, Y.indexOf = function(V) {
            return B[V];
          }, Y.contains = function(V) {
            return typeof B[V] < "u";
          }, Y;
        };
        return E;
      }, k = function(v, D, T) {
        for (var W = ee(v, D), $ = 0; $ < D; $ += 1)
          for (var E = 0; E < v; E += 1)
            W.setPixel(E, $, T(E, $));
        var g = b();
        W.write(g);
        for (var h = A(), C = g.toByteArray(), B = 0; B < C.length; B += 1)
          h.writeByte(C[B]);
========
        return S;
      }, V = function(m, I) {
        var O = m, q = I, $ = new Array(m * I), S = {};
        S.setPixel = function(T, M, Z) {
          $[M * O + T] = Z;
        }, S.write = function(T) {
          T.writeString("GIF87a"), T.writeShort(O), T.writeShort(q), T.writeByte(128), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(0), T.writeByte(255), T.writeByte(255), T.writeByte(255), T.writeString(","), T.writeShort(0), T.writeShort(0), T.writeShort(O), T.writeShort(q), T.writeByte(0);
          var M = 2, Z = h(M);
          T.writeByte(M);
          for (var z = 0; Z.length - z > 255; )
            T.writeByte(255), T.writeBytes(Z, z, 255), z += 255;
          T.writeByte(Z.length - z), T.writeBytes(Z, z, Z.length - z), T.writeByte(0), T.writeString(";");
        };
        var v = function(T) {
          var M = T, Z = 0, z = 0, de = {};
          return de.write = function(le, me) {
            if (le >>> me)
              throw "length over";
            for (; Z + me >= 8; )
              M.writeByte(255 & (le << Z | z)), me -= 8 - Z, le >>>= 8 - Z, z = 0, Z = 0;
            z = le << Z | z, Z = Z + me;
          }, de.flush = function() {
            Z > 0 && M.writeByte(z);
          }, de;
        }, h = function(T) {
          for (var M = 1 << T, Z = (1 << T) + 1, z = T + 1, de = A(), le = 0; le < M; le += 1)
            de.add(String.fromCharCode(le));
          de.add(String.fromCharCode(M)), de.add(String.fromCharCode(Z));
          var me = b(), Se = v(me);
          Se.write(M, z);
          var qe = 0, We = String.fromCharCode($[qe]);
          for (qe += 1; qe < $.length; ) {
            var ut = String.fromCharCode($[qe]);
            qe += 1, de.contains(We + ut) ? We = We + ut : (Se.write(de.indexOf(We), z), de.size() < 4095 && (de.size() == 1 << z && (z += 1), de.add(We + ut)), We = ut);
          }
          return Se.write(de.indexOf(We), z), Se.write(Z, z), Se.flush(), me.toByteArray();
        }, A = function() {
          var T = {}, M = 0, Z = {};
          return Z.add = function(z) {
            if (Z.contains(z))
              throw "dup key:" + z;
            T[z] = M, M += 1;
          }, Z.size = function() {
            return M;
          }, Z.indexOf = function(z) {
            return T[z];
          }, Z.contains = function(z) {
            return typeof T[z] < "u";
          }, Z;
        };
        return S;
      }, y = function(m, I, O) {
        for (var q = V(m, I), $ = 0; $ < I; $ += 1)
          for (var S = 0; S < m; S += 1)
            q.setPixel(S, $, O(S, $));
        var v = b();
        q.write(v);
        for (var h = E(), A = v.toByteArray(), T = 0; T < A.length; T += 1)
          h.writeByte(A[T]);
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
        return h.flush(), "data:image/gif;base64," + h;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var r = [], i = 0; i < o.length; i++) {
            var c = o.charCodeAt(i);
            c < 128 ? r.push(c) : c < 2048 ? r.push(
              192 | c >> 6,
              128 | c & 63
            ) : c < 55296 || c >= 57344 ? r.push(
              224 | c >> 12,
              128 | c >> 6 & 63,
              128 | c & 63
            ) : (i++, c = 65536 + ((c & 1023) << 10 | o.charCodeAt(i) & 1023), r.push(
              240 | c >> 18,
              128 | c >> 12 & 63,
              128 | c >> 6 & 63,
              128 | c & 63
            ));
          }
          return r;
        }
        return a(s);
      };
    })(), (function(s) {
      e.exports = s();
    })(function() {
      return n;
    });
  })(Vn)), Vn.exports;
}
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
var kv = wv();
const bv = /* @__PURE__ */ yv(kv), $v = ["width", "height", "viewBox"], xv = ["width", "height"], Mv = ["d"], _v = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = O(() => {
      const s = bv(0, "M");
========
var Tv = Ov();
const Bv = /* @__PURE__ */ Cv(Tv), Iv = ["width", "height", "viewBox"], Rv = ["width", "height"], Lv = ["d"], Dv = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = C(() => {
      const s = Bv(0, "M");
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let r = 0; r < a; r += 1)
        for (let i = 0; i < a; i += 1)
          s.isDark(r, i) && o.push(`M${i + 4} ${r + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
    });
    return (s, a) => (l(), d("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      p("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
<<<<<<<< HEAD:src/core/modules/viewer/web/dist/kit/index-BS_xk84w.js
      }, null, 8, xv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Mv)
    ], 8, $v));
  }
}, Ny = /* @__PURE__ */ J(_v, [["__scopeId", "data-v-489f0852"]]), jy = nr(() => import("./VoiceFigure-CnrNaHbn.js").then((e) => e.V)), Py = "1.0.0", qy = "3.5";
export {
  Tv as $,
  ey as A,
  Je as B,
  uy as C,
  Xv as D,
  cy as E,
  Vv as F,
  Po as G,
  Tm as H,
  Cm as I,
  gy as J,
  kt as K,
  ry as L,
  Te as M,
  Et as N,
  ny as O,
  $n as P,
  sy as Q,
  fp as R,
  Co as S,
  Qv as T,
  ly as U,
  ha as V,
  mm as W,
  lm as X,
  vy as Y,
  dy as Z,
  J as _,
  ie as a,
  xy as a$,
  Sy as a0,
  ye as a1,
  ys as a2,
  Bv as a3,
  Ju as a4,
  Ly as a5,
  Hv as a6,
  nn as a7,
  wy as a8,
  Ev as a9,
  Dy as aA,
  Fo as aB,
  st as aC,
  Ih as aD,
  jy as aE,
  Ne as aF,
  tl as aG,
  Jn as aH,
  By as aI,
  Ty as aJ,
  Iy as aK,
  Fv as aL,
  qv as aM,
  jv as aN,
  by as aO,
  ky as aP,
  h1 as aQ,
  Ov as aR,
  it as aS,
  Rv as aT,
  Nv as aU,
  _y as aV,
  $y as aW,
  Cy as aX,
  Vg as aY,
  gg as aZ,
  yo as a_,
  Bt as aa,
  xe as ab,
  Ey as ac,
  Py as ad,
  qy as ae,
  Ay as af,
  is as ag,
  Pv as ah,
  w1 as ai,
  jg as aj,
  Fg as ak,
  Gg as al,
  Iv as am,
  xr as an,
  Ry as ao,
  Lv as ap,
  Ny as aq,
  My as ar,
  Gr as as,
  Av as at,
  Wv as au,
  os as av,
  wt as aw,
  Dv as ax,
  Cv as ay,
  gs as az,
  Ze as b,
  Rh as b0,
  vs as b1,
  Oy as b2,
  ty as c,
  Gv as d,
  Kv as e,
  zv as f,
  fy as g,
  xo as h,
  ay as i,
  oy as j,
  iy as k,
  py as l,
  Yv as m,
  Uv as n,
  Jv as o,
  dn as p,
  yy as q,
  hy as r,
  Zv as s,
  je as t,
  im as u,
  my as v,
  um as w,
  Ss as x,
  Bp as y,
  Ip as z
========
      }, null, 8, Rv),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Lv)
    ], 8, Iv));
  }
}, Yy = /* @__PURE__ */ J(Dv, [["__scopeId", "data-v-489f0852"]]), Jy = or(() => import("./VoiceFigure-B9R0pSXZ.js").then((e) => e.V)), Zy = "1.0.0", Xy = "3.5";
export {
  Fv as $,
  hy as A,
  Je as B,
  $y as C,
  uy as D,
  by as E,
  sy as F,
  Po as G,
  Pm as H,
  Nm as I,
  Ay as J,
  kt as K,
  yy as L,
  Be as M,
  St as N,
  py as O,
  bn as P,
  my as Q,
  bp as R,
  Co as S,
  dy as T,
  ky as U,
  pa as V,
  xm as W,
  gm as X,
  Cy as Y,
  xy as Z,
  J as _,
  ie as a,
  wo as a$,
  jy as a0,
  we as a1,
  ws as a2,
  Hv as a3,
  Qu as a4,
  Gy as a5,
  ty as a6,
  tn as a7,
  Ty as a8,
  jv as a9,
  vs as aA,
  Ky as aB,
  Ho as aC,
  st as aD,
  Gv as aE,
  Jy as aF,
  Ne as aG,
  al as aH,
  Yn as aI,
  Uy as aJ,
  Hy as aK,
  Vy as aL,
  ey as aM,
  Xv as aN,
  Jv as aO,
  Iy as aP,
  By as aQ,
  g1 as aR,
  Wv as aS,
  it as aT,
  Vv as aU,
  Yv as aV,
  Ny as aW,
  Ry as aX,
  Wy as aY,
  xg as aZ,
  qg as a_,
  Bt as aa,
  be as ab,
  Py as ac,
  Zy as ad,
  Xy as ae,
  qy as af,
  os as ag,
  Zv as ah,
  x1 as ai,
  hs as aj,
  fs as ak,
  Wo as al,
  Uv as am,
  Sr as an,
  zy as ao,
  zv as ap,
  Yy as aq,
  Dy as ar,
  Jr as as,
  Pv as at,
  Qv as au,
  Og as av,
  Ih as aw,
  wt as ax,
  Kv as ay,
  qv as az,
  Ze as b,
  Ly as b0,
  Nh as b1,
  ys as b2,
  Fy as b3,
  fy as c,
  oy as d,
  ry as e,
  ay as f,
  My as g,
  xo as h,
  gy as i,
  vy as j,
  wy as k,
  Sy as l,
  iy as m,
  ny as n,
  ly as o,
  un as p,
  Oy as q,
  _y as r,
  cy as s,
  je as t,
  mm as u,
  Ey as v,
  ym as w,
  Es as x,
  qp as y,
  Wp as z
>>>>>>>> version-5:src/core/modules/viewer/web/dist/kit/index--163JIE4.js
};
