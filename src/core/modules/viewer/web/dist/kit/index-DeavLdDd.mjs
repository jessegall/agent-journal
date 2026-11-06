/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as P, renderSlot as ue, createElementVNode as v, normalizeClass as Z, Fragment as V, renderList as ee, defineComponent as Zr, Comment as Xr, h as Gn, cloneVNode as Qr, createBlock as H, withCtx as j, createVNode as N, toDisplayString as w, createCommentVNode as E, inject as Ee, useAttrs as Kn, computed as L, ref as I, resolveDynamicComponent as St, mergeProps as Ge, createTextVNode as Q, watch as he, onUnmounted as Le, onMounted as Be, Teleport as cs, useId as us, resolveDirective as ei, withDirectives as Qe, reactive as ds, shallowRef as Ve, nextTick as dt, Transition as Dt, withModifiers as xe, TransitionGroup as Yo, shallowReactive as ti, isRef as Ps, onBeforeUnmount as _t, onScopeDispose as fs, resolveComponent as ni, useModel as Pa, getCurrentInstance as ai, mergeModels as ja, getCurrentScope as Jo, provide as si, onErrorCaptured as oi, toHandlers as li, createSlots as ri, vShow as Zo, useSlots as ii, withKeys as Xt, vModelText as qa, defineAsyncComponent as ci } from "vue";
function Xo(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ui = 1600, di = {
  __name: "Shimmer",
  setup(e) {
    const t = Xo(ui);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: ge(P(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ K(di, [["__scopeId", "data-v-1c6fdf5f"]]), fi = { class: "skeleton-line" }, hi = 2e3, mi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Xo(hi);
    return (n, a) => (c(), h("span", fi, [
      ue(n.$slots, "default", {}, void 0, !0),
      v("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(V, null, ee(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...P(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ht = /* @__PURE__ */ K(mi, [["__scopeId", "data-v-341b98f6"]]), Pt = Zr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Xr);
      return a.length !== 1 ? Gn(V, { key: n }, a) : a[0].key == null ? Qr(a[0], { key: n }) : a[0];
    };
  }
}), pi = ["aria-label"], gi = ["aria-label"], vi = ["aria-label"], yi = ["aria-label"], bi = ["aria-label"], wi = ["aria-label"], ki = ["aria-label"], xi = {
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
      { id: "type", bars: [{ width: "64px", height: 8 }] },
      { id: "title", bars: [{ width: "70%", height: 12 }] },
      { id: "line", bars: [{ width: "45%", height: 9 }] }
    ], a = [
      { width: "46%", height: 12 },
      { width: "52px", height: 9 }
    ], s = [
      { id: "first", bars: [{ width: "88%", height: 9 }] },
      { id: "second", bars: [{ width: "64%", height: 9 }] },
      { id: "third", bars: [{ width: "76%", height: 9 }] }
    ], o = [
      { width: "58%", height: 11 },
      { width: "32%", height: 9 }
    ], l = ["94%", "88%", "91%", "62%"].map((i) => ({ width: i, height: 10 })), r = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (i, u) => (c(), H(Pt, { value: e.shape }, {
      messages: j(() => [
        v("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(V, null, ee(t, (d) => N(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, pi)
      ]),
      older: j(() => [
        v("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, ee(t.slice(0, 3), (d) => (c(), H(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, gi)
      ]),
      cards: j(() => [
        v("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, ee(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(V, null, ee(n, (f) => N(ht, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, vi)
      ]),
      file: j(() => [
        v("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, ee(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(ht, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(V, null, ee(s, (f) => N(ht, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, yi)
      ]),
      page: j(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(ht, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(V, null, ee(e.count, (d) => (c(), H(ht, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, bi)
      ]),
      text: j(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, ee(e.count, (d) => (c(), H(ht, {
            key: d,
            bars: P(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, wi)
      ]),
      default: j(() => [
        v("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(V, null, ee(e.count, (d) => (c(), H(ht, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ki)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ K(xi, [["__scopeId", "data-v-5a4a3667"]]), $i = {
  key: 1,
  class: "empty-state titled"
}, Mi = { class: "empty-state-title" }, Si = { class: "empty-state-text" }, _i = {
  key: 2,
  class: "empty-state"
}, Ei = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", $i, [
      v("p", Mi, w(e.title), 1),
      v("p", Si, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", _i, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qt = /* @__PURE__ */ K(Ei, [["__scopeId", "data-v-bbb14fd6"]]), Ai = { class: "fold-group" }, Ci = ["aria-expanded"], Oi = { class: "fold-label" }, Ti = {
  key: 0,
  class: "fold-count"
}, Ri = {
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
    return (a, s) => (c(), h("div", Ai, [
      v("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        v("span", Oi, w(e.label), 1),
        e.count !== "" ? (c(), h("span", Ti, w(e.count), 1)) : E("", !0),
        v("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Ci),
      e.open ? ue(a.$slots, "default", {}, void 0, !0, 0) : E("", !0)
    ]));
  }
}, d5 = /* @__PURE__ */ K(Ri, [["__scopeId", "data-v-5a6a4d36"]]), Ii = Symbol("open-view"), Te = Symbol.for("journal.window-context");
function ft() {
  const e = Ee(Te, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Qo = 120;
var Go;
const ra = globalThis[Go = Symbol.for("journal.pressed")] ?? (globalThis[Go] = { control: null, disabledHere: /* @__PURE__ */ new WeakSet() });
function Bi(e = 0) {
  const t = ra.control;
  if (!t) return () => {
  };
  let n = !1;
  const a = () => {
    n = !0, t.dataset.busy = Number(t.dataset.busy || 0) + 1, t.disabled || (t.disabled = !0, ra.disabledHere.add(t));
  }, s = e ? setTimeout(a, e) : a();
  return () => {
    if (clearTimeout(s), !n) return;
    const o = Number(t.dataset.busy) - 1;
    if (o > 0) return void (t.dataset.busy = o);
    delete t.dataset.busy, ra.disabledHere.delete(t) && (t.disabled = !1);
  };
}
const Li = ["stroke-width", "innerHTML"], ye = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const t = e, n = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, s = {
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
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
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
    return (o, l) => (c(), h("svg", {
      class: "ico",
      style: ge({
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
      innerHTML: s[a[e.name] || e.name] || s.dot
    }, null, 12, Li));
  }
}, Ni = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: ge({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Di = /* @__PURE__ */ K(Ni, [["__scopeId", "data-v-37ba86f3"]]), Pi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "Btn",
  props: {
    variant: { type: String, default: "ghost" },
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    bordered: Boolean,
    href: { type: String, default: "" },
    icon: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Kn(), a = L(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = I(!1), o = L(() => t.busy || s.value), l = Ee(Te, null), r = L(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, Qo);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), H(St(e.href ? "a" : "button"), Ge(a.value, {
      type: e.href ? void 0 : P(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: j(() => [
        v("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), H(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : E("", !0),
          ue(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), H(Di, {
          key: 0,
          class: "btn-spinner"
        })) : E("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ K(Pi, [["__scopeId", "data-v-7068e4e1"]]), ji = {
  key: 0,
  class: "more-items"
}, qi = {
  key: 0,
  role: "alert"
}, Fi = {
  __name: "MoreItems",
  props: { more: Boolean, loading: Boolean, failure: { type: String, default: "" }, label: { type: String, default: "More items" } },
  emits: ["more"],
  setup(e) {
    return (t, n) => e.failure || e.more ? (c(), h("div", ji, [
      e.failure ? (c(), h("p", qi, w(e.failure), 1)) : E("", !0),
      e.more ? (c(), H(de, {
        key: 1,
        small: "",
        "data-page-more": "",
        disabled: e.loading,
        onClick: n[0] || (n[0] = (a) => t.$emit("more"))
      }, {
        default: j(() => [
          Q(w(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : E("", !0)
    ])) : E("", !0);
  }
}, Yn = /* @__PURE__ */ K(Fi, [["__scopeId", "data-v-5355e7f5"]]), Wi = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, Hi = ["data-kind"], zi = { class: "count" }, Ui = ["disabled", "onClick"], Vi = { class: "type" }, Gi = { class: "title" }, Ki = { class: "relations" }, Yi = {
  key: 0,
  class: "unavailable"
}, Ji = ["data-kind", "onClick"], Zi = { key: 0 }, Xi = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    shownPerKind: { type: Number, default: 3 },
    changes: { type: Number, default: 0 },
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(null), l = I(!1), r = I("");
    let i = 0;
    const u = (b) => b.endpoint.model === "doc" && b.endpoint.id === n.documentId, d = L(() => [...s.value].sort((b, x) => Number(u(x)) - Number(u(b)))), f = I(/* @__PURE__ */ new Set()), m = (b) => u(b) ? "design" : b.endpoint.model, g = (b) => b === "design" ? "Design document" : b.replaceAll("_", " "), y = L(() => {
      const b = /* @__PURE__ */ new Map();
      for (const x of d.value) b.set(m(x), [...b.get(m(x)) ?? [], x]);
      return [...b].map(([x, S]) => ({ kind: x, items: S, shown: f.value.has(x) ? S : S.slice(0, n.shownPerKind) }));
    }), $ = (b) => f.value = /* @__PURE__ */ new Set([...f.value, b]), k = (b) => b.endpoint.unavailable || !b.endpoint.open_ref, R = (b) => ({ [n.linkAttribute]: !0, "data-link-model": b.endpoint.model, "data-link-id": b.endpoint.id });
    async function F(b = 1) {
      const x = ++i;
      l.value = !0, r.value = "";
      const S = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(b), "--page-size", String(n.pageSize)];
      n.documentId && S.push("--first-counterpart", `doc:${n.documentId}`);
      try {
        const C = await n.read(S);
        if (x !== i) return;
        if (!C.ok) {
          r.value = C.error;
          return;
        }
        const _ = C.value.counterparts ?? [], B = b === 1 ? _ : [...s.value, ..._];
        s.value = [...new Map(B.map((M) => [`${M.endpoint.model}:${M.endpoint.id}`, M])).values()], o.value = C.value.next_page ?? null;
      } catch (C) {
        x === i && (r.value = C.message);
      } finally {
        x === i && (l.value = !1);
      }
    }
    function Y(b) {
      if (k(b)) return;
      const [x, S] = b.endpoint.open_ref.split(":");
      a("open", { table: x, id: Number(S) });
    }
    const D = () => !l.value && o.value && F(o.value);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}`, () => {
      s.value = [], o.value = null, f.value = /* @__PURE__ */ new Set(), F();
    }, { immediate: !0 }), (b, x) => d.value.length || l.value || r.value || e.empty ? (c(), h("section", Wi, [
      (c(!0), h(V, null, ee(y.value, (S) => (c(), h(V, {
        key: S.kind
      }, [
        v("h4", {
          class: "kind",
          "data-link-kind": "",
          "data-kind": S.kind
        }, [
          Q(w(g(S.kind)) + " ", 1),
          v("span", zi, w(S.items.length) + w(o.value ? "+" : ""), 1)
        ], 8, Hi),
        (c(!0), h(V, null, ee(S.shown, (C) => (c(), h("button", Ge({
          key: `${C.endpoint.model}:${C.endpoint.id}`,
          type: "button",
          class: "resource-link"
        }, { ref_for: !0 }, R(C), {
          disabled: k(C),
          onClick: (_) => Y(C)
        }), [
          v("span", Vi, w(u(C) ? "Design document" : C.endpoint.model.replaceAll("_", " ")) + " " + w(C.endpoint.id), 1),
          v("span", Gi, w(C.endpoint.title), 1),
          v("span", Ki, w(C.relations.join(", ")), 1),
          k(C) ? (c(), h("span", Yi, "Unavailable")) : E("", !0)
        ], 16, Ui))), 128)),
        S.shown.length < S.items.length ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "show-more",
          "data-link-show-more": "",
          "data-kind": S.kind,
          onClick: (C) => $(S.kind)
        }, "Show " + w(S.items.length - S.shown.length) + " more", 9, Ji)) : E("", !0)
      ], 64))), 128)),
      !d.value.length && !l.value && !r.value && e.empty ? (c(), h("p", Zi, w(e.empty), 1)) : E("", !0),
      N(Yn, {
        more: !!o.value,
        loading: l.value,
        failure: r.value,
        label: "More linked items",
        onMore: D
      }, null, 8, ["more", "loading", "failure"])
    ])) : E("", !0);
  }
}, Qi = /* @__PURE__ */ K(Xi, [["__scopeId", "data-v-691b6dc3"]]), ec = (e, t, n) => Math.max(t, Math.min(n, e)), tc = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, el = /* @__PURE__ */ new WeakMap(), nc = (e, t) => el.set(e, t);
function ac(e, t) {
  for (let n = t; n; n = el.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function tl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !ac(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Le(() => window.removeEventListener("click", n));
}
const Ot = 8, sc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = I(null), o = (p) => p ? `${p}px` : void 0, l = L(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = I({ w: 0, h: 0 }), i = I(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const T = p.closest(".pane, .float-window");
      return T ? d(T.getBoundingClientRect()) : u();
    }, m = (p, T) => `${Math.max(0, p ? Math.min(p, T) : T)}px`;
    function g(p, T) {
      return {
        below: p.bottom - T.bottom - a.gap - Ot,
        above: T.top - p.top - a.gap - Ot,
        across: p.right - p.left - 2 * Ot
      };
    }
    function y(p) {
      const T = f(a.anchor), O = g(T, p);
      return r.value.w <= O.across && r.value.h <= Math.max(O.below, O.above) ? T : u();
    }
    const $ = L(() => {
      if (!i.value) return l.value;
      const p = i.value, T = y(p), O = g(T, p), { w: A, h: J } = r.value, te = a.align === "auto" ? p.left + p.right > T.left + T.right : a.align === "right", ce = ec(te ? p.right - A : p.left, T.left + Ot, Math.max(T.left + Ot, T.right - A - Ot)), pe = J > O.below && O.above > O.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, O.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, O.below) };
      return { ...l.value, ...pe, left: `${ce}px`, maxWidth: m(a.maxWidth, O.across) };
    }), k = n, R = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function F(p) {
      const T = R(), O = T.indexOf(document.activeElement);
      T[(O + p + T.length) % T.length].focus();
    }
    const Y = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => k("close") }, D = (p) => Y[p.key] && (p.preventDefault(), Y[p.key]()), b = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let x = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame(x), x = requestAnimationFrame(b);
    });
    tl(s, (p) => a.anchor && !a.anchor.contains(p.target) && k("close"));
    const C = (p, T) => ["top", "left", "right", "bottom"].some((O) => Math.abs(p[O] - T[O]) > 1), _ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let B = 0;
    function M() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || _(p)) return k("close");
        C(p, i.value) && (i.value = p);
      }
      B = requestAnimationFrame(M);
    }
    return Be(() => {
      a.anchor && s.value && nc(s.value, a.anchor), b(), s.value && S.observe(s.value), !a.plain && R()[0] && R()[0].focus(), M();
    }), Le(() => {
      S.disconnect(), cancelAnimationFrame(B), cancelAnimationFrame(x);
    }), t({ element: s }), (p, T) => (c(), H(cs, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: $.value,
        onKeydown: D
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Jn = /* @__PURE__ */ K(sc, [["__scopeId", "data-v-7f046e0d"]]), oc = { class: "split-button" }, lc = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", oc, [
      N(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: j(() => [
          ue(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      v("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        N(de, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: j(() => [
            N(ye, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), H(Jn, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: j(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : E("", !0)
    ]));
  }
}, rc = /* @__PURE__ */ K(lc, [["__scopeId", "data-v-9908ef1d"]]), ic = ["aria-checked", "aria-haspopup", "onClick"], cc = {
  key: 0,
  class: "segmented-dot"
}, uc = {
  key: 1,
  class: "segmented-note"
}, dc = {
  key: 2,
  class: "segmented-count"
}, fc = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = us();
    return (s, o) => {
      const l = ei("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(V, null, ee(e.options, (r) => Qe((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", cc)) : E("", !0),
          Q(" " + w(r.label) + " ", 1),
          r.note ? (c(), h("small", uc, w(r.note), 1)) : E("", !0),
          r.count !== void 0 ? (c(), h("em", dc, w(r.count), 1)) : E("", !0)
        ], 10, ic)), [
          [l, r.tip || r.title, `${P(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Zn = /* @__PURE__ */ K(fc, [["__scopeId", "data-v-7d0b33ab"]]), nl = typeof document < "u" && document.documentElement.classList.contains("phone");
function Fa(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function al(e = window) {
  if (!Fa(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Fa(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Wa = "journal.stale-build-reload", hc = 'script[type="module"][src*="/assets/index-"]', js = (e) => {
  var t;
  return ((t = e.querySelector(hc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function mc(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => al(window)) {
  const a = js(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = js(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ia = "";
function pc(e, t = () => al(window)) {
  if (!e) return !1;
  const n = !!ia && ia !== e;
  return ia = e, n && t(), n;
}
const gc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function vc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Wa) === e.message) return !1;
    t.setItem(Wa, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function yc(e = window.sessionStorage) {
  try {
    e.removeItem(Wa);
  } catch {
    return;
  }
}
const bc = 2e3, wc = 3e4, Fe = ds({ starting: !1, external: !1, late: !1, offline: !1 }), sl = () => Fe.starting, kc = 3;
let gn = 0, Ha = 0, ol = 0, ll = [];
async function xc() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Fe.external };
  }
}
let qs = null;
const $c = () => qs ?? (qs = xc().finally(() => qs = null));
function Mc() {
  clearTimeout(Ha), clearTimeout(ol), Ha = 0, Object.assign(Fe, { starting: !1, external: !1, late: !1, offline: !1 }), ll.splice(0).forEach((e) => e()), mc();
}
async function Sc() {
  Fe.offline = !navigator.onLine;
  const e = await $c();
  if (Fe.external = e.updating, gn = !e.restarting && !e.updating && e.reachable ? gn + 1 : 0, gn < kc) return;
  gn = 0, (!pc(e.started_at) || Fa()) && Mc();
}
function rl() {
  Ha = setTimeout(async () => {
    await Sc(), Fe.starting && rl();
  }, bc);
}
function _c() {
  Fe.starting || (Fe.starting = !0, Fe.offline = !navigator.onLine, rl(), ol = setTimeout(() => Fe.late = !0, wc));
}
const Ec = () => Fe.starting ? new Promise((e) => ll.push(e)) : Promise.resolve();
function il(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const l = () => {
    s = !1, n = Date.now(), o && (o = !1, i());
  }, r = () => {
    a = null;
    const u = e();
    n = Date.now(), u instanceof Promise && (s = !0, u.catch(() => {
    }).finally(l));
  }, i = () => {
    if (s) {
      o = !0;
      return;
    }
    if (a) return;
    const u = t - (Date.now() - n);
    u <= 0 ? r() : a = setTimeout(r, u);
  };
  return i.cancel = () => {
    clearTimeout(a), a = null, o = !1;
  }, i;
}
function Ac(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class Cc {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = il(() => this.leave(), 0);
  }
  leave() {
    const t = this.following;
    this.following = null, this.flying = t, this.outdated = !1, this.tracked("sent", t);
    const n = this.read(t.stop.signal, t);
    t.resolve(n);
    const a = () => {
      this.tracked("answered", t), this.flying === t && (this.flying = null), this.following || this.ended();
    };
    return n.then(a, a), n;
  }
  asked(t) {
    var o;
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Ac(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
    a.askers += 1, a.callers += 1, this.tracked("asked", a);
    const s = this.answerFor(a, t);
    return this.following === a && this.ask(), s;
  }
  answerFor(t, n) {
    return n ? new Promise((a, s) => {
      const o = () => {
        this.left(t), s(new DOMException("cancelled", "AbortError"));
      };
      if (n.aborted) return o();
      n.addEventListener("abort", o, { once: !0 }), t.answer.then(a, s).finally(() => n.removeEventListener("abort", o));
    }) : t.answer;
  }
  left(t) {
    t.askers -= 1, !(t.askers > 0) && (t.stop.abort(), t === this.following && (this.following = null, this.ask.cancel(), this.flying || this.ended()));
  }
  heardEvent() {
    this.flying && (this.outdated = !0);
  }
}
const tt = "viewer.shell", vn = 2e4, Oc = 4, Fs = "/api/read-lines", Tc = 5e3, Rc = 403, Ws = "/api/repeated-lines", Ic = 10, Bc = 2e3, Lc = 3e5, f5 = 6e5, yn = 6, Nc = 500, Dc = "/journal/summary", Hs = "/api/server-state", Pc = 2e4, bn = nl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, jc = (e) => e.split("?")[0].endsWith(Dc), za = (e, t) => Object.assign(new Error(t), { status: e });
async function qc(e, t, n = za) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Fc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), Wc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), zs = (e) => e.split(" ").slice(0, 2).join(" "), st = "read", Rt = "write", Hc = "stream";
class zc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.knownReads = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = yn;
  }
  // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
  inFlight(t = null) {
    return [...this.flights].filter((n) => t === null || n.window === t).map((n) => ({ ...n }));
  }
  // how many requests a window has sent, by noun and verb
  sentCounts(t) {
    return Object.fromEntries(this.lineCounts.get(t) ?? []);
  }
  requestCounts(t) {
    var s;
    const n = this.sentCounts(t), a = [...((s = this.joinCounts.get(t)) == null ? void 0 : s.values()) ?? []];
    return {
      http_requests: this.httpCounts.get(t) ?? 0,
      logical_commands: Object.entries(n).filter(([o]) => !o.startsWith("/")).reduce((o, [, l]) => o + l, 0),
      joined_callers: a.reduce((o, l) => o + l.joined_callers, 0),
      trailing_reads: a.reduce((o, l) => o + l.trailing_reads, 0),
      by_command: n
    };
  }
  requestTotals() {
    const t = [...this.lineCounts.keys()].map((n) => this.requestCounts(n));
    return {
      http_requests: this.httpRequests,
      logical_commands: t.reduce((n, a) => n + a.logical_commands, 0),
      joined_callers: t.reduce((n, a) => n + a.joined_callers, 0),
      trailing_reads: t.reduce((n, a) => n + a.trailing_reads, 0)
    };
  }
  took(t, n) {
    /\/api\/lines?$/.test(n) && (this.httpRequests += 1, new Set(t.map((o) => o.window)).forEach((o) => this.httpCounts.set(o, (this.httpCounts.get(o) ?? 0) + 1)));
    const a = Date.now(), s = t.map((o) => ({ ...o, url: n, started_at: a }));
    return s.forEach((o) => {
      this.flights.add(o), this.counted(o);
    }), () => s.forEach((o) => this.flights.delete(o));
  }
  counted({ window: t, line: n }) {
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = zs(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < Bc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Ic || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Ws, { method: "POST", headers: { ...bn, "Content-Type": "application/json" }, body: r }, [{ window: tt, line: Ws, kind: Rt }]).catch(() => {
    });
  }
  // a request a click causes, read or write, holds the button clicked from the moment it is asked until it is answered (platform/pressed.js):
  // it is held when asked, as a read may wait for a place or a batch and leave after the click has been handled
  // a read shows the spinner after a short wait, a write at once
  held(t, n = !1) {
    const a = Bi(n ? Qo : 0);
    try {
      return t().finally(a);
    } catch (s) {
      throw a(), s;
    }
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: Wc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Rt ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = vn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && _c(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Oc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
    try {
      return await t();
    } finally {
      const n = this.readsWaiting.shift();
      n ? n() : this.readsFlying -= 1;
    }
  }
  // whether a line only reads, as the server knows its command: a line the server has not called a read is a write, which is never joined
  async isRead(t) {
    return this.readLines ?? (this.readLines = this.answeredReadLines()), this.knownReads = await this.readLines, this.knownReads.has(t.slice(0, 2).join(" "));
  }
  // the same, at once and without asking: a line is taken for a write until the server's list of reads has come
  knownRead(t) {
    var n;
    return !!((n = this.knownReads) != null && n.has(t.slice(0, 2).join(" ")));
  }
  answeredReadLines() {
    return this.out(Fs, { headers: bn }, [{ window: tt, line: Fs, kind: st }], Tc).then(async (t) => {
      if (t.status === Rc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw za(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new Cc(
      (l, r) => n(l, s ? this.readAttribution(r) : void 0),
      () => this.joinedReads.delete(t),
      (l, r) => {
        s && this.trackRead(s, l, r);
      }
    );
    return this.joinedReads.set(t, o), o.asked(a);
  }
  readAttribution(t) {
    return {
      client_id: this.clientId,
      command_id: t.id,
      joined_callers: t.callers - 1,
      followed_command_id: t.trailingOf,
      complete: !1
    };
  }
  trackRead({ window: t, line: n }, a, s) {
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), l = zs(n.join(" ")), r = o.get(l) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (r.joined_callers += 1), a === "sent" && s.trailingOf && (r.trailing_reads += 1), o.set(l, r), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
  }
  flushReadReceipts() {
    clearTimeout(this.receiptTimer), this.receiptTimer = null;
    const t = this.readReceipts;
    return this.readReceipts = [], t.length ? (this.receiptSending = this.receiptSending.then(async () => {
      try {
        (await this.raw("/api/read-receipts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ receipts: t })
        })).ok || (this.receiptFailures += t.length);
      } catch {
        this.receiptFailures += t.length;
      }
    }), this.receiptSending) : this.receiptSending;
  }
  // an event has come: a read in flight may be older than it, so whoever asks that read from now on gets one that runs after it
  readsOutdated() {
    this.joinedReads.forEach((t) => t.heardEvent());
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = yn;
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
  async reach(t, n, a, s, o, l = {}) {
    const r = a instanceof FormData, i = { method: t, headers: { ...bn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Fc(a) }, u = s || (r ? Lc : vn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: tt, line: n, kind: st }], u)) : await this.sent(n, i, [{ window: tt, line: n, kind: Rt }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, Nc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = yn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return qc(r, `${r.status} ${r.statusText}`).catch((i) => {
      throw i.blocked && t !== "GET" && this.refused(i.message), i;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.held(() => this.whenFree(() => this.out(t, n, [{ window: tt, line: t, kind: st }], vn)), !0);
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: bn });
    if (!n.ok) throw za(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return this.held(() => this.asked(t, n, a, s, o, l), t === "GET");
  }
  asked(t, n, a, s, o, l) {
    return t !== "GET" ? this.send(t, n, a, s, yn, o).then((r) => (this.written(n), r)) : sl() && !jc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: tt, line: t, kind: Hc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Hs, { cache: "no-store" }, [{ window: tt, line: Hs, kind: st }], Pc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = tt, line: s = t, limit: o = vn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? st : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ca = Symbol.for("journal.transport"), Ae = globalThis[ca] ?? (globalThis[ca] = new zc()), Uc = 0, Vc = "/api/lines", Gc = "/api/line", Us = 5e3, Vs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Gs = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ua = (e) => JSON.stringify(e.line), Ks = () => new DOMException("cancelled", "AbortError");
class Kc {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(ua(t))) {
        Ae.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Rt));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), Uc));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Ks())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Ks()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ae.sent(Vc, Vs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Gs(r.body, st)), Us), { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ae.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, st), Date.now() - n < Us ? this.slow.delete(ua(t.body)) : this.slow.add(ua(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(Gc, Vs(t.body, t.signal), [Gs(t.body, n)], n === st ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const cl = new Kc(), Yc = 150, Jc = () => Yc;
function hs(e, t, n = Jc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Zc {
  constructor() {
    this.following = Ve([]), this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, a, s = () => !0) {
    const o = { window: t, patterns: n, heard: a, visible: s };
    return this.following.value = [...this.follows, o], () => this.following.value = this.follows.filter((l) => l !== o);
  }
  get follows() {
    return this.following.value;
  }
  get patterns() {
    return [...new Set(this.follows.flatMap((t) => t.patterns))].sort();
  }
  count(t) {
    return this.follows.filter((n) => n.window === t).length;
  }
  stopAll(t) {
    this.following.value = this.follows.filter((n) => n.window !== t), this.held = new Set([...this.held].filter((n) => n.window !== t));
  }
  dispatch(t) {
    Ae.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => ul(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ul(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const dl = /* @__PURE__ */ new Map();
class Xc {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ve({ buttons: [], missing: {} }), this.loading = Ve(!1), this.loaded = Ve(!1), this.failed = Ve(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ae.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
    if (t.status === 403) return { buttons: [], missing: {} };
    const n = await t.json();
    if (!t.ok) throw new Error(n.error || "Buttons could not be loaded.");
    return n;
  }
  heard(t) {
    var s;
    const n = (s = t.data) == null ? void 0 : s.key, a = t.event.startsWith("setting.") && (!n || n.includes("suite"));
    return t.event === "registry.sync" || a ? this.load() : Promise.resolve();
  }
  async allowed(t) {
    var s;
    await this.load();
    const n = this.offers.value.missing[t];
    return n != null && n.length ? await this.prompts.ask(t, {
      window: `button:${t}`,
      reads_missing: "",
      runs_missing: n.map(({ label: o, line: l }) => `${o}: ${l}`).join(", ")
    }) ? (await this.load(), !((s = this.offers.value.missing[t]) != null && s.length)) : !1 : !0;
  }
}
function h5(e, t) {
  const n = new Xc(e, t);
  return dl.set(e, n), n.load().catch(() => {
  }), n;
}
const ms = (e) => dl.get(e);
function Qc(e, t, n) {
  const a = ms(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function eu(e, t) {
  if (!e) return !0;
  const n = ms(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const tu = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let fl = {};
async function m5(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (fl = (await t.json()).states);
}
const ps = (e, t) => {
  var n;
  return (n = fl[e]) == null ? void 0 : n[t];
}, hl = (e, t) => {
  var n;
  return ((n = ps(e, t)) == null ? void 0 : n.label) ?? tu(t);
}, ml = (e, t) => {
  var n;
  return ((n = ps(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, nu = (e, t) => {
  var n;
  return ((n = ps(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, au = Symbol("pane-page"), su = Symbol("inspector-host"), ou = { 1: "refused", 2: "usage", 3: "fault" }, lu = 100, ru = 50, iu = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, cu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function uu({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: y = [], links: $ = {}, search: k = {}, readOnly: R = !1, shared: F = null }) {
  const Y = /* @__PURE__ */ new Map(), D = new AbortController(), b = I(!1), x = performance.now();
  let S = 0, C = 0, _ = () => {
  };
  const B = new Promise((A) => _ = A);
  D.signal.addEventListener("abort", _, { once: !0 });
  const M = () => {
    clearTimeout(C), C = setTimeout(() => {
      S === 0 && hs(x, () => {
        b.value = !0, _();
      });
    }, ru);
  }, p = (A, J) => (S += 1, lt(e, A, t, D.signal, J).finally(() => {
    S -= 1, M();
  })), T = (A, J) => (M(), B.then(() => D.signal.aborted ? xt : lt(e, A, t, D.signal, J))), O = (A, { unbatched: J = !1, deferred: te = !1 } = {}) => {
    const ce = Y.get(A);
    if (ce && performance.now() - ce.at < lu) return ce.answer;
    const ie = te && !b.value ? T(A, J) : p(A, J);
    return Y.set(A, { answer: ie, at: performance.now() }), ie;
  };
  return {
    answered: b,
    settle: M,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: L(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: y,
    links: $,
    search: k,
    readOnly: R,
    shared: F,
    read: O,
    run: (A) => lt(e, A, t, D.signal),
    upload: (A) => hu(A, e, D.signal),
    cancel: () => D.abort(),
    signal: D.signal,
    subscriptions: l,
    follow: (A, J) => l.follow(e, A.filter((te) => o.some((ce) => ul(ce, te))), (te) => {
      Y.clear(), J(te);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (A) => L(() => {
      var J;
      return i.value[A] ?? ((J = u.find((te) => te.key === A)) == null ? void 0 : J.default);
    }),
    setting: async (A, J) => {
      const te = await O(`window setting ${e} ${A}`);
      return te.ok ? te.value.value : J;
    },
    setOption: f,
    keep: (A, J) => lt(e, ["window", "save-setting", e, A, JSON.stringify(J)], t, D.signal)
  };
}
function du(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const xt = { ok: !1, failure: "cancelled", error: "" }, pl = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function gl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? xt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: ou[n.code] || "fault", error: du(n.error) };
  } catch {
    return t != null && t.aborted ? xt : { ok: !1, failure: "unreachable", error: pl };
  }
}
async function vl(e, t, n) {
  const a = await gl(() => cl.read(e, t, n), t);
  return a.failure !== "unreachable" || !sl() ? a : (await Ec(), t.aborted ? xt : vl(e, t, n));
}
function lt(e, t, n, a = void 0, s = !1) {
  return Ae.held(() => fu(e, t, n, a, s), Ae.knownRead(Array.isArray(t) ? t : gs(t)));
}
async function fu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : gs(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (l, r) => vl({ ...o, attribution: r }, l, s), a, o).catch(() => xt) : gl(() => cl.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function hu(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? xt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? xt : { ok: !1, failure: "unreachable", error: pl };
  }
}
function gs(e) {
  return [...e.matchAll(iu)].map(([t]) => t.replace(cu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const mu = (e) => `show-${e}`, p5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(mu((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), yl = "messages.chat", pu = {
  key: 0,
  class: "template-brief"
}, gu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, vu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = L(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = L(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await lt(yl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(V, null, [
      N(Zn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", pu, w(r.value.brief), 1)) : E("", !0),
      o.value ? (c(), h("p", gu, w(o.value), 1)) : E("", !0)
    ], 64));
  }
}, yu = /* @__PURE__ */ K(vu, [["__scopeId", "data-v-8c3f5d57"]]), bu = { class: "form-field" }, wu = { class: "form-field-head" }, ku = ["for"], xu = {
  key: 0,
  class: "form-field-aside"
}, $u = {
  key: 0,
  class: "form-field-help"
}, Mu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", bu, [
      v("div", wu, [
        v("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, ku),
        t.$slots.aside ? (c(), h("span", xu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", $u, w(e.help), 1)) : E("", !0)
    ]));
  }
}, Su = /* @__PURE__ */ K(Mu, [["__scopeId", "data-v-8f255b8f"]]), Ua = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, _u = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Kn(), n = L(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Qe((c(), h("textarea", Ge({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [P(Ua), P(t).value]
    ]);
  }
}), Eu = /* @__PURE__ */ K(_u, [["__scopeId", "data-v-11521837"]]), Au = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = us(), o = L(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(Su, {
      label: e.field.label,
      for: P(s),
      "data-button-field": e.field.name
    }, {
      default: j(() => [
        N(Pt, { value: o.value }, {
          choice: j(() => [
            N(Zn, {
              id: P(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: j(() => [
            N(yu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: j(() => [
            N(Eu, {
              id: P(s),
              value: e.value,
              onInput: r[2] || (r[2] = (i) => a("pick", i.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, vs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), H(de, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: j(() => [
        N(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Cu(e, t, n, a = () => window) {
  Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Ou = (e, t = () => !0) => Cu("keydown", (n) => n.key === "Escape" && t() && e());
function bl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = L(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Ou(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Tu = 80, Tt = ds([]);
function wl(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Le(n), L(() => Tu + Math.max(0, Tt.indexOf(t)));
}
let kl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return kl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Ru = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Iu(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Ru)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Be(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : kl, document.addEventListener("keydown", s), dt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Le(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Bu = ["aria-modal", "aria-label", "aria-labelledby"], Lu = {
  key: 0,
  class: "dialog-head"
}, Nu = ["id", "tabindex"], Du = {
  key: 1,
  class: "dialog-foot"
}, Pu = 500, ju = 400, qu = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = bl(a, n), r = wl(s), i = I(null), u = I(null), d = I(null), f = us(), m = I(!1), g = Date.now();
    n.modal && Iu(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, ju);
    }
    function $(F) {
      !n.modal || Date.now() - g >= Pu || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const k = () => i.value && (i.value.scrollTop = i.value.scrollHeight), R = new MutationObserver(k);
    return he(i, (F) => {
      R.disconnect(), F && n.follow && (R.observe(F, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Le(() => R.disconnect()), (F, Y) => (c(), H(cs, { to: "body" }, [
      N(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: j(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: P(r) }),
            onClick: xe(y, ["self"])
          }, [
            v("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? P(f) : void 0,
              onKeydownCapture: $
            }, [
              e.bare ? E("", !0) : (c(), h("header", Lu, [
                v("h3", {
                  id: P(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Nu),
                e.closable ? (c(), H(vs, {
                  key: 0,
                  onClick: P(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              v("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (c(), h("footer", Du, [
                ue(F.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, Bu)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, xl = /* @__PURE__ */ K(qu, [["__scopeId", "data-v-484a731f"]]), Fu = (e, t, n = {}) => gs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function rn(e, t, n, a = {}) {
  try {
    return await eu(e.module, n) ? lt(yl, Fu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const Wu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, da = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], be = (e, t, n, a = {}) => ({
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
  ...a
}), Xn = {
  messages: be("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: be("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: be("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: da
  }),
  tasks: be("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: da
  }),
  reports: be("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: be("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: be("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: be("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: be("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: be("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: be("Pin", "band", "One line pinned to the chat while it matters", { filters: da }),
  reactions: be("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: be("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: be("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: be("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: be("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: be("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: be("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: be("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: be("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: be("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: be("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: be("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: be("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: be("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
    view: "check",
    filters: [
      { key: "open", title: "Checks", shows: "open" },
      { key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check." }
    ],
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0
  }),
  dumps: be("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: be("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: be("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Hu = ["secrets", "plugins"], $l = Object.keys(Xn).filter((e) => !(nl && Hu.includes(e)));
L(() => $l.map((e) => ({ name: e, ...Xn[e] })));
const jt = (e) => Xn[e], Ml = new Map($l.flatMap((e) => [e, e.replace(/s$/, ""), Xn[e].title.toLowerCase()].map((t) => [t, e]))), it = (e) => Ml.get(String(e).toLowerCase()) || "", Sl = [...Ml.keys()].sort((e, t) => t.length - e.length).join("|"), zu = {
  class: "button-form",
  "data-button-form": ""
}, Uu = {
  key: 0,
  class: "button-form-title"
}, Vu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Gu = { class: "button-form-actions" }, Ku = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = I(!1), l = I(""), r = L(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = L(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = jt(it(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await rn(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), H(xl, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: j(() => {
        var m;
        return [
          v("div", zu, [
            (m = e.row) != null && m.title ? (c(), h("p", Uu, w(e.row.title), 1)) : E("", !0),
            (c(!0), h(V, null, ee(e.button.fields, (g) => (c(), H(Au, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (y) => s.value[g.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Vu, w(l.value), 1)) : E("", !0),
            v("div", Gu, [
              N(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: j(() => [...f[2] || (f[2] = [
                  Q("Cancel", -1)
                ])]),
                _: 1
              }),
              N(de, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: j(() => [...f[3] || (f[3] = [
                  Q("Send", -1)
                ])]),
                _: 1
              }, 8, ["disabled", "busy"])
            ])
          ])
        ];
      }),
      _: 1
    }, 8, ["title"]));
  }
}, Yu = /* @__PURE__ */ K(Ku, [["__scopeId", "data-v-e77a3ca7"]]), Ju = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Zu = {
  key: 1,
  class: "menu-item-text"
}, Xu = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Ju, w(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", Zu, [
        v("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, w(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, $t = /* @__PURE__ */ K(Xu, [["__scopeId", "data-v-9c67fe37"]]), Qu = ["aria-busy"], ed = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, td = {
  __name: "ButtonSlot",
  props: {
    name: { type: String, required: !0 },
    row: { type: Object, default: null },
    environment: { type: String, required: !0 },
    readOnly: Boolean,
    externalFailure: Boolean,
    objectName: { type: String, default: "" }
  },
  emits: ["done", "failure"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(() => ms(n.environment)), o = L(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = L(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = L(() => n.readOnly ? [] : Qc(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function g(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const $ = await rn(y, n.row, n.environment);
      f.value = !1, d.value = $.ok ? "" : $.error;
      const k = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", $.ok ? "" : `Could not ${k}: ${$.error}`), $.ok && a("done");
    }
    return (y, $) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(V, { key: 0 }, [
        $[3] || ($[3] = v("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(de, {
          small: "",
          onClick: r
        }, {
          default: j(() => [...$[2] || ($[2] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? E("", !0) : (c(), h(V, { key: 1 }, [
        (c(!0), h(V, null, ee(i.value, (k) => (c(), h(V, {
          key: k.name
        }, [
          k.menu.length ? (c(), H(rc, {
            key: 0,
            small: "",
            variant: k.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": k.menu_label || "More ways",
            title: m(k),
            "data-button": k.name,
            onMain: (R) => g(k)
          }, {
            menu: j(({ close: R }) => [
              (c(!0), h(V, null, ee(k.menu, (F) => (c(), H($t, {
                key: F.label,
                description: F.description,
                onClick: (Y) => (R(), g({ ...k, ...F, menu: [] }))
              }, {
                default: j(() => [
                  Q(w(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: j(() => [
              Q(w(k.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), H(de, {
            key: 1,
            small: "",
            variant: k.primary ? "primary" : "ghost",
            bordered: !k.primary,
            icon: k.icon,
            disabled: f.value,
            title: m(k),
            "data-button": k.name,
            onClick: (R) => g(k)
          }, {
            default: j(() => [
              Q(w(k.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", ed, w(d.value), 1)) : E("", !0),
        u.value && !e.readOnly ? (c(), H(Yu, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: $[0] || ($[0] = (k) => u.value = null),
          onDone: $[1] || ($[1] = (k) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : E("", !0)
      ], 64))
    ], 10, Qu));
  }
}, nd = /* @__PURE__ */ K(td, [["__scopeId", "data-v-08a87e69"]]), ad = {
  class: "running",
  "data-running-command": ""
}, sd = ["title"], od = {
  key: "idle",
  class: "running-idle"
}, ld = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", ad, [
      N(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: j(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, sd)) : (c(), h("span", od, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, g5 = /* @__PURE__ */ K(ld, [["__scopeId", "data-v-8311b32c"]]), rd = ["aria-checked", "aria-label", "title"], id = {
  key: 0,
  class: "switch-inner"
}, cd = {
  key: 0,
  class: "switch-word"
}, ud = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      v("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", id, w(e.word), 1)) : E("", !0),
        s[1] || (s[1] = v("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", cd, w(e.word), 1)) : E("", !0)
    ], 10, rd));
  }
}, v5 = /* @__PURE__ */ K(ud, [["__scopeId", "data-v-688091a6"]]);
function _l(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Ln(e, t) {
  return _l(() => localStorage, e, t);
}
function El(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function ys(e, t) {
  return El(() => localStorage, e, t);
}
function Al(e, t) {
  he(t, (n) => ys(e, n), { deep: !0 });
}
function dd(e, t) {
  return _l(() => sessionStorage, e, t);
}
function fd(e, t) {
  return El(() => sessionStorage, e, t);
}
const Nn = "journal.environment", Cl = I(dd(Nn, Ln(Nn, "")));
function hd(e) {
  Cl.value = e, fd(Nn, e), ys(Nn, e);
}
const Dn = I(location.hash), Ys = Ve(null), Js = { integrations: "mcp", library: "team" };
function md() {
  if (!Ys.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Js[n]) {
    location.replace(`#/${[Js[n], ...a].join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash;
    return;
  }
  !n || Ys.value(n) || (hd(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Dn.value = location.hash, md();
});
const Va = L(() => {
  const [e, t = ""] = Dn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Cl.value,
    page: n,
    n: a ? /^\d+$/.test(a) ? Number(a) : a : 0,
    q: s.get("q") || "",
    sub: s.get("sub") || "",
    tab: s.get("tab") || "",
    plugin: s.get("plugin") || "",
    install: s.get("install") || "",
    line: Number(s.get("line") || 0),
    at: s.get("at") || "",
    stack: o,
    open: o[o.length - 1] || null
  };
}), bs = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${bs.page(e)}?open=${t}`
};
function pd(e = "", t = 0, n = "") {
  location.hash = bs.page(e, t, n);
}
const gd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ol(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(gd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function y5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Tl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Va.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Ol([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function vd(e, t, n, a = 0, s = "") {
  if (e === Va.value.env) return Tl(t, n, a, s);
  const o = Va.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Ol([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function We(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? vd(a, s, Number(o), 0, t) : Tl(s, Number(o), 0, t);
}
function yd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = yd(e);
  t && We(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function b5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const bd = { class: "inspector-part" }, wd = { class: "inspector-part-title" }, kd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", bd, [
      v("h4", wd, w(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, w5 = /* @__PURE__ */ K(kd, [["__scopeId", "data-v-426868e9"]]), xd = {
  key: 1,
  class: "row-list-failure"
}, $d = ["data-row"], Md = {
  __name: "RowList",
  props: {
    rows: { type: Array, required: !0 },
    failure: { type: String, default: "" },
    // what is empty, in the window's own terms, and under it the sentence that says what brings rows there
    empty: { type: String, required: !0 },
    hint: { type: String, default: "" },
    // whether a search or a filter is on: with it, and no row left, the list says nothing matches (`matches` names it in the window's words) and what to try, not that it is empty
    searching: Boolean,
    matches: { type: String, default: "Nothing matches" },
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
    const t = e, n = L(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = I(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", xd, w(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: j(() => [
        Q(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(V, { key: 3 }, [
      (c(), H(St(e.arrival ? Yo : "ul"), Ge(n.value, { class: "row-list" }), {
        default: j(() => [
          (c(!0), h(V, null, ee(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, $d))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : E("", !0)
    ], 64));
  }
}, Sd = /* @__PURE__ */ K(Md, [["__scopeId", "data-v-3eb1aa55"]]), _d = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ed = {
  key: 1,
  class: "agent-rows-note"
}, Ad = {
  key: 2,
  class: "agent-rows-note"
}, Cd = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Od = ["data-agent-row", "onClick"], Td = { class: "agent-row-name" }, Rd = { class: "agent-row-state" }, Id = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = L(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = L(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", _d, [
      e.loaded ? e.failure ? (c(), h("p", Ed, w(e.failure), 1)) : e.rows.length ? (c(), h(V, { key: 3 }, [
        v("p", Cd, w(a.value) + " running", 1),
        (c(!0), h(V, null, ee(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => P(We)(`agents:${l.id}`)
        }, [
          v("span", Td, "#" + w(l.id) + " " + w(l.session), 1),
          v("span", Rd, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Od))), 128))
      ], 64)) : (c(), h("p", Ad, w(e.none), 1)) : (c(), H(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, k5 = /* @__PURE__ */ K(Id, [["__scopeId", "data-v-7e3656dc"]]), Bd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, w(e.text), 3));
  }
}, Rl = /* @__PURE__ */ K(Bd, [["__scopeId", "data-v-6ef74765"]]), Ld = ["aria-valuenow", "aria-valuemax"], Nd = {
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
    const t = e, n = L(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      v("span", {
        class: "fill",
        style: ge({ width: n.value })
      }, null, 4)
    ], 10, Ld));
  }
}, Dd = /* @__PURE__ */ K(Nd, [["__scopeId", "data-v-5045237e"]]), Pd = { class: "bars" }, jd = { class: "bar-name" }, qd = { class: "bar-value" }, Fd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = L(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", Pd, [
      (c(!0), h(V, null, ee(e.items, (i, u) => (c(), H(St(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: j(() => [
          v("span", jd, w(i.label), 1),
          N(Dd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          v("span", qd, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Wd = /* @__PURE__ */ K(Fd, [["__scopeId", "data-v-09485718"]]), Hd = { class: "bars" }, zd = {
  key: 0,
  class: "bars-title"
}, Ud = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Hd, [
      e.node.title ? (c(), h("span", zd, w(e.node.title), 1)) : E("", !0),
      N(Wd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Vd = /* @__PURE__ */ K(Ud, [["__scopeId", "data-v-a9861a72"]]), Gd = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = L(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(V, null, ee(e.node.children || [], (i, u) => (c(), H(Gl, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ K(Gd, [["__scopeId", "data-v-2a5c17d3"]]), Kd = {
  key: 0,
  class: "card-head"
}, Yd = { class: "card-title" }, Jd = {
  key: 0,
  class: "card-note"
}, Zd = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Kd, [
        v("span", Yd, w(e.node.title), 1),
        e.node.note ? (c(), h("span", Jd, w(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      N(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Xd = /* @__PURE__ */ K(Zd, [["__scopeId", "data-v-bb0b3bdb"]]), Qd = { processes: "process", memories: "memory", replies: "reply" }, Gt = (e) => (Qd[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ga = [], ef = 2e3, at = /* @__PURE__ */ new Map(), tf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, nf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? Ga.unshift(e) : Ga.push(e), at.clear();
}
function Il(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const af = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, sf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Xe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function of(e, t) {
  const n = [{ type: "text", text: Xe(e).replace(/\r\n/g, `
`) }];
  for (const a of Ga)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function en(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return lf(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function lf(e) {
  return e.split(nf).map((t, n) => n % 2 ? t : t.replace(tf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Zs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const rf = 24;
function cf(e) {
  const [t, , ...n] = e, a = Zs(t), s = n.map(Zs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > rf) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${en(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const Bl = /^\s*(?:[-*+]|\d+[.)])\s+/, Ka = /^\s*(\d+)[.)]\s/, Xs = (e) => e.match(/^\s*/)[0].length;
function Ll(e) {
  const t = e[0].match(Ka), n = Xs(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && Xs(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${en(o.text)}${o.nested.length ? Ll(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function uf(e, t) {
  const n = Ka.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Bl.test(e[s]) && Ka.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Qs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Nl(e) {
  const t = String(e || "").replace(/\r\n/g, `
`).split(`
`), n = [];
  let a = 0;
  for (; a < t.length; ) {
    const s = t[a];
    if (!s.trim()) {
      a += 1;
      continue;
    }
    if (/^(```|~~~)/.test(s)) {
      const r = t.findIndex((u, d) => d > a && /^(```|~~~)/.test(u)), i = r < 0 ? t.length : r;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const r = Math.min(6, o[1].length + 2);
      n.push(`<h${r}>${en(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Qs(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(cf(t.slice(a, r))), a = r;
      continue;
    }
    if (Bl.test(s)) {
      const r = uf(t, a);
      n.push(Ll(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Nl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Qs(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${en(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const df = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ff = (e) => e.type !== "text" && !df.test(e.html);
function hf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Nl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : ff(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function mf(e, t = { env: "" }) {
  const n = sf(e, t), a = at.get(n);
  if (at.delete(n), a && a.source === t.source && a.reads.every((l) => af(l, t)))
    return at.set(n, a), a.html;
  const s = [], o = hf(of(e, { ...t, reads: s }));
  return at.set(n, { html: o, reads: s, source: t.source }), at.size > ef && at.delete(at.keys().next().value), o;
}
const fa = /* @__PURE__ */ new WeakMap();
function pf(e) {
  if (fa.has(e)) return fa.get(e);
  const t = ti(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Gt(u)} show ${d}`);
    n.set(f, m), m.then((g) => {
      n.get(f) === m && (n.delete(f), t.set(f, g.ok ? { ...g.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Gt(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const g = Number(m.slice(f.length));
        (!d.row_id || d.row_id === g) && o(u, g);
      }
    }));
  }
  function r(u, d) {
    l(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return fa.set(e, i), i;
}
function Dl() {
  const e = Ee(Te, null), t = e ? pf(e) : null;
  return (n, a = {}) => mf(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Pl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, cn = (e) => String(e || "").replace(Pl, (t, n, a, s) => s), gf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), wn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, vf = /^Traceback \(most recent call last\):/m, yf = 8;
function jl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, yf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function bf(e) {
  const t = [...e.matchAll(gf)].map((a) => a.index);
  if (wn.lastIndex = 0, !t.length || !wn.test(e)) return null;
  wn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(wn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: jl(n), tail: "" } : null;
}
function wf(e) {
  const t = vf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: jl([o]), tail: n.slice(s).join(`
`) };
}
At((e) => {
  const t = cn(e), n = wf(t) || bf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const kf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, xf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, $f = /[\w\]]\(/, Mf = /^[\w$.[\]'"]+\s*=\s*[^=]/, Sf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, _f = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Ef = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Af = /[[({,]$/, Cf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Of = /^(\t|\s{2,})\S/, Tf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Rf = /`[^`]+`/, If = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Bf = /[{}()[\];=<>$&|*\\@+^~%]/g, ql = /^\s*(?:[-*+]|\d+[.)])\s/, Lf = /^\s*>/, Nf = /^\s*\|/, Df = 0.6, Pf = 0.4, jf = 5, qf = 0.03, Fl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= jf && t.every((n) => If.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Bf) ?? []).length / e.length < qf;
}, ha = (e) => {
  const t = e.trim();
  return Rf.test(t) ? !1 : [kf, xf, $f, Mf, Sf, _f, Ef, Af, Cf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Of.test(e) && !ql.test(e) && !Fl(e);
};
function Ff(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || ql.test(t[0]) || t.every((o) => Lf.test(o) || Nf.test(o))) return "text";
  const n = t.filter((o) => !Tf.test(o.trim()));
  if (t.length === 1) return !n.length || ha(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ha).length, s = n.filter((o) => !ha(o) && Fl(o)).length;
  return a >= n.length * Df && s <= n.length * Pf ? "code" : "text";
}
const Ya = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Wf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Hf = `${Ya} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, zf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Uf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", eo = {
  js: { keywords: Ya, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Wf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Hf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ya, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: zf, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Uf, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Vf = {
  javascript: "js",
  mjs: "js",
  cjs: "js",
  ts: "js",
  typescript: "js",
  tsx: "js",
  jsx: "js",
  vue: "html",
  python: "py",
  cpp: "c",
  cc: "c",
  h: "c",
  hpp: "c",
  cs: "c",
  csharp: "c",
  java: "c",
  kt: "c",
  kotlin: "c",
  go: "c",
  golang: "c",
  rs: "c",
  rust: "c",
  swift: "c",
  scala: "c",
  dart: "c",
  bash: "sh",
  shell: "sh",
  zsh: "sh",
  fish: "sh",
  scss: "css",
  less: "css",
  htm: "html",
  xml: "html",
  yml: "yaml",
  markdown: "md"
};
function to(e, t, n) {
  return n && e.startsWith(n, t);
}
function Gf(e, t) {
  const n = eo[Vf[t] ?? t] || eo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const l = (r, i) => i && s.push({ type: r, value: i });
  for (; o < e.length; ) {
    const r = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), d = e.slice(o, u < 0 ? e.length : u);
      l(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), l("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (to(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && to(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      l("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((u) => e.startsWith(u, o));
    if (i) {
      const u = e.indexOf(i, o + 3), d = u < 0 ? e.length : u + 3;
      l("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(r)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== r && (r === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      l(n.keyed && /^\s*:/.test(e.slice(u + 1)) ? "property" : "string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && r === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      l("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(r)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      l(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(r)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      l("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (r === ">" || e.startsWith("/>", o))) {
      const u = r === ">" ? 1 : 2;
      l("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    l("plain", r), o += 1;
  }
  return s;
}
function Kf(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Gf(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? Xe(l) : `<span class="tok-${a}">${Xe(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Yf(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Jf = 1500, no = /* @__PURE__ */ new WeakMap();
async function Zf(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Yf(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(no.get(t)), no.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Jf)
  )));
}
typeof document < "u" && document.addEventListener("click", Zf, !0);
const Xf = /\n\s*\n/, Qf = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, eh = /^\s*(`{3,}|~{3,})\s*$/, th = /^\s{4,}\S/, nh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ja = /^\s*(?:[-*+]|\d+[.)])\s/, Wl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, ah = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ws(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function sh(e) {
  const t = ws(e.join(`
`));
  return (ah.find(([, n]) => n.test(t)) || ["text"])[0];
}
const oh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Wl.test(t) && !Ja.test(t);
}, lh = (e, t) => Ja.test(t) || Ja.test([...e].reverse().find((n) => n.trim()) || "");
function ks(e, t) {
  const n = t || sh(e), a = Kf(ws(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function rh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && eh.test(s));
  return a < 0 ? e.length : a;
}
function ih(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return ks(a.map(cn), n ? n.toLowerCase() : "");
}
function ch(e) {
  const t = e.split(Xf).map((l) => ({ paragraph: l, type: Ff(ws(l).split(`
`)) })), n = [];
  let a = [];
  const s = () => {
    a.length && n.push({ type: "text", text: a.join(`

`) }), a = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let l = o;
    for (; l < t.length && t[l].type !== "text"; ) l += 1;
    const r = t.slice(o, l);
    if (r.some(({ type: i }) => i === "code") || r.length > 1) {
      s(), n.push(ks(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(cn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function uh(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : ch(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Qf);
    if (r) {
      const u = rh(n, l, r[2]);
      o(), a.push(ih(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = oh(s) ? nh : th;
    if (!t && i.test(n[l]) && !lh(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Wl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push(ks([...d, ...n.slice(l, u)].map(cn), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
At((e, t) => uh(e, t.document));
const Pn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Hl = (e) => `${e.table}:${e.id}`, ao = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ma = 80;
function so(e) {
  return e.length <= ma ? e : `${e.slice(0, ma + 1).replace(/\s+\S*$/, "") || e.slice(0, ma)}…`;
}
const oo = {
  messages: (e) => so(ao(e.text)),
  comments: (e) => so(ao(e.text)),
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
}, dh = (e) => (oo[e.table] ? oo[e.table](e) : e.title || "") || "", Mt = (e) => Pn(e.created_at), zl = (e) => Pn(e.updated_at) || Mt(e), fh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, hh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function mh(e) {
  const t = fh.exec(e);
  if (t && it(t[1])) return { at: t.index, length: t[0].length, table: it(t[1]), id: Number(t[2]), label: t[3] };
  const n = hh.exec(e), a = n && it(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function ph(e, t, n, a) {
  const s = Il(a, e, t), o = cn(s ? dh(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Xe(jt(e).title)} ${t}</span><span class="row-card-title">${Xe(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = mh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: ph(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const gh = /\.(png|jpe?g|gif|webp|svg)$/i, vh = (e) => gh.test(e), yh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, bh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function wh(e, t) {
  const n = yh.exec(e), [, a, s, o, l, r] = n || [], i = n && it(a || o), u = i && Il(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${jt(i).title} ${u.id} · ${Xe(r)}`, m = vh(r) ? `<img class="file-card-image" src="${d}" alt="${Xe(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Xe(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function kh(e) {
  const t = bh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Xe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = wh(e, t) || kh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const xh = /`([^`\n]+)`/g;
At((e) => e.replace(xh, (t, n) => `<code>${n}</code>`));
const lo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${bs.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(Pl, (n, a, s, o) => lo[a] ? lo[a](s, o, t) : o)
);
const $h = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ul = new RegExp(`\\b(${Sl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Vl = new RegExp(`\\b(${Sl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Mh = new RegExp(`<code>((?:${Ul.source}|${Vl.source}))</code>`, "gi"), Sh = (e) => e.replace(Mh, "$1"), _h = (e, t) => `<a class="row-pill" href="#" data-peek="${it(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Eh = (e) => e.replace(Vl, (t, n, a) => a.replace(/\d+/g, (s) => _h(n.replace(/s$/i, ""), s))), Ah = (e) => Eh(e).replace(
  Ul,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${it(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Sh(e).split($h).map((n, a) => a % 2 ? n : Ah(n)).join("")
);
const Ch = ["innerHTML"], Oh = ["innerHTML"], Th = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Dl(), a = L(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Ch)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => P(It) && P(It)(...l)),
      innerHTML: a.value
    }, null, 8, Oh));
  }
}, bt = /* @__PURE__ */ K(Th, [["__scopeId", "data-v-7cbf7b8a"]]), Rh = { class: "fact" }, Ih = { class: "fact-label" }, Bh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Rh, [
      v("span", Ih, w(e.label), 1),
      N(bt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Lh = /* @__PURE__ */ K(Bh, [["__scopeId", "data-v-a0ce1d97"]]), Nh = { class: "list" }, Dh = { class: "list-label" }, Ph = {
  key: 1,
  class: "list-note"
}, jh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Nh, [
      (c(!0), h(V, null, ee(e.items, (o, l) => (c(), H(St(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: j(() => [
          v("span", Dh, w(o.label), 1),
          o.badge ? (c(), H(Rl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", Ph, w(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, qh = /* @__PURE__ */ K(jh, [["__scopeId", "data-v-e2e240a1"]]), Fh = { class: "table" }, Wh = {
  key: 0,
  class: "table-row empty"
}, Hh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", Fh, [
      v("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(V, null, ee(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (c(!0), h(V, null, ee(e.rows, (r, i) => (c(), H(St(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: j(() => [
          (c(!0), h(V, null, ee(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Wh, w(e.empty), 1)) : E("", !0)
    ]));
  }
}, zh = /* @__PURE__ */ K(Hh, [["__scopeId", "data-v-349d16ca"]]), Uh = { class: "stat-value" }, Vh = { class: "stat-label" }, Gh = {
  key: 0,
  class: "stat-note"
}, Kh = {
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
    return (a, s) => (c(), H(St(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: j(() => [
        v("span", Uh, w(e.value), 1),
        v("span", Vh, w(e.label), 1),
        e.note ? (c(), h("span", Gh, w(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Yh = /* @__PURE__ */ K(Kh, [["__scopeId", "data-v-bf2aa36f"]]), Jh = { class: "code" }, Zh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), H(Pt, {
      value: e.node.type
    }, {
      stack: j(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: j(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: j(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: j(() => [
        N(Xd, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: j(() => [
        v("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: j(() => [...l[2] || (l[2] = [
        v("hr", { class: "divider" }, null, -1)
      ])]),
      stat: j(() => [
        N(Yh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: j(() => [
        N(Vd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: j(() => [
        N(zh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: j(() => [
        N(qh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: j(() => [
        N(bt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: j(() => [
        N(Lh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: j(() => [
        N(Rl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: j(() => [
        v("pre", Jh, [
          v("code", null, w(e.node.text), 1)
        ])
      ]),
      file: j(() => [
        v("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Gl = /* @__PURE__ */ K(Zh, [["__scopeId", "data-v-92ed1e03"]]), Xh = { class: "dashboard" }, Qh = { class: "trail" }, em = ["onClick"], tm = {
  key: 0,
  class: "gone",
  role: "status"
}, nm = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), l = I(n.page && !o.value ? [n.page] : []), r = L(() => l.value.at(-1) || n.document.start), i = L(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (m, g) => (c(), h("div", Xh, [
      e.document.broken ? (c(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: j(() => [
          Q(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: j(() => [
          Q(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(V, { key: 2 }, [
        v("nav", Qh, [
          v("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (y) => f(0))
          }, w(u(e.document.start)), 3),
          (c(!0), h(V, null, ee(l.value, (y, $) => (c(), h(V, {
            key: `${$}-${y}`
          }, [
            g[2] || (g[2] = v("span", { class: "sep" }, "/", -1)),
            v("button", {
              type: "button",
              class: Z(["step", { current: $ === l.value.length - 1 }]),
              onClick: (k) => f($ + 1)
            }, w(u(y)), 11, em)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", tm, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        N(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: j(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              N(Gl, {
                node: i.value.view,
                onOpen: d,
                onFile: g[1] || (g[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : E("", !0)
    ]));
  }
}, am = /* @__PURE__ */ K(nm, [["__scopeId", "data-v-9e88e6d3"]]), nt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, je = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, sm = 6;
function xs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const om = (e) => {
  const t = xs(e, nt.lineChars), n = Math.max(nt.minWidth, Math.max(...t.map((a) => a.length)) * nt.charWidth + nt.padX * 2);
  return { name: e, lines: t, line: nt.line, padY: nt.padY, width: n, height: t.length * nt.line + nt.padY * 2 };
};
function lm(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function rm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function im(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, g) => m + g, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < sm; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function cm(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, l, r) => {
    const i = `${s[o]}:${l}`;
    (n.get(i) || n.set(i, []).get(i)).push({ arrow: s, end: o, other: r });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, l) => t.get(o.other).x - t.get(l.other).x), s.forEach(({ arrow: o, end: l }, r) => o[`${l}Share`] = (r + 1) / (s.length + 1));
}
function um(e) {
  const t = [...new Set(e.flatMap(([D, b]) => [D, b]))], n = new Set(e.map(([, D]) => D)), a = t.filter((D) => !n.has(D)), s = lm(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((D, b) => !s.has(b)), l = rm(t, o), r = im(t, o, l), i = new Map(t.map((D) => [D, om(D)])), u = r.map((D) => D.reduce((b, x) => b + i.get(x).width, 0) + Pe.across * (D.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = fm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = Pe.margin;
  r.forEach((D, b) => {
    let x = (d - u[b]) / 2;
    const S = Math.max(...D.map((C) => i.get(C).height));
    D.forEach((C) => {
      const _ = i.get(C);
      m.set(C, { ..._, x, y: g + (S - _.height) / 2 }), x += _.width + Pe.across;
    }), g += S + (f[b] ?? Pe.down);
  });
  const y = e.map(([D, b, x], S) => ({ from: D, to: b, label: x || "", back: s.has(S) || l.get(b) <= l.get(D) }));
  cm(y, m);
  const $ = y.map((D) => hm(D, m.get(D.from), m.get(D.to))), k = [...m.values()], R = vm($, k), F = Math.max(g - Pe.down, ...R.filter((D) => D.label).map((D) => D.label.y + D.label.height));
  return { width: Math.max(d - Pe.margin, ...R.filter((D) => D.label).map((D) => D.label.x + D.label.width)) + Pe.margin, height: F + Pe.margin, nodes: k, arrows: R };
}
const dm = (e) => e ? xs(e, je.lineChars).length * je.line + je.pad * 2 : 0;
function fm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += dm(l) + Pe.labelSpace);
  }), a.map((s) => Math.max(Pe.down, s));
}
function hm(e, t, n) {
  const a = e.label ? xs(e.label, je.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * je.charWidth + je.pad * 2 : 0, o = a.length * je.line + (a.length ? je.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const mm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, pm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], gm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * je.line);
function vm(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = mm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = gm.flatMap((i) => pm.map((u) => s(u, i))).find((i) => !n.some((u) => ro(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => ro(r, i)); ) r.y += je.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: je.line, pad: je.pad } };
  });
}
const ro = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ym = { class: "flowchart-tools" }, bm = ["width", "height", "viewBox", "aria-label"], wm = ["d"], km = ["x", "y", "width", "height"], xm = ["x", "y"], $m = ["x", "dy"], Mm = {
  key: 0,
  class: "flowchart-label"
}, Sm = ["x", "y", "width", "height"], _m = ["x", "y"], Em = ["x", "dy"], Am = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(() => um(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var R;
      const $ = (R = l.value) == null ? void 0 : R.getBoundingClientRect();
      if (!($ != null && $.width)) return;
      const k = Math.min($.width / s.value.width, $.height / s.value.height, 1.5);
      r.value = { zoom: k, x: ($.width - s.value.width * k) / 2, y: ($.height - s.value.height * k) / 2 };
    }
    function d($, k, R) {
      const { zoom: F, x: Y, y: D } = r.value, b = Math.min(o.most, Math.max(o.least, F * $));
      r.value = { zoom: b, x: k - (k - Y) * b / F, y: R - (R - D) * b / F };
    }
    function f($) {
      const k = l.value.getBoundingClientRect();
      d($, k.width / 2, k.height / 2);
    }
    function m($) {
      const k = l.value.getBoundingClientRect();
      $.ctrlKey || $.metaKey ? d($.deltaY < 0 ? o.step : 1 / o.step, $.clientX - k.left, $.clientY - k.top) : r.value = { ...r.value, x: r.value.x - $.deltaX, y: r.value.y - $.deltaY };
    }
    function g($) {
      var k, R, F;
      $.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), i = { x: $.clientX - r.value.x, y: $.clientY - r.value.y }, (F = (R = l.value).setPointerCapture) == null || F.call(R, $.pointerId);
    }
    function y($) {
      i && (r.value = { ...r.value, x: $.clientX - i.x, y: $.clientY - i.y });
    }
    return Be(u), ($, k) => (c(), H(xl, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (R) => a("close"))
    }, {
      default: j(() => [
        v("div", ym, [
          N(de, {
            small: "",
            onClick: k[0] || (k[0] = (R) => f(o.step))
          }, {
            default: j(() => [...k[5] || (k[5] = [
              Q("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: k[1] || (k[1] = (R) => f(1 / o.step))
          }, {
            default: j(() => [...k[6] || (k[6] = [
              Q("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: u
          }, {
            default: j(() => [...k[7] || (k[7] = [
              Q("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        v("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: xe(m, ["prevent"]),
          onPointerdown: g,
          onPointermove: y,
          onPointerup: k[2] || (k[2] = (R) => Ps(i) ? i.value = null : i = null),
          onPointercancel: k[3] || (k[3] = (R) => Ps(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: ge({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            k[8] || (k[8] = v("defs", null, [
              v("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                v("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(V, null, ee(s.value.arrows, (R, F) => (c(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: R.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, wm))), 128)),
            (c(!0), h(V, null, ee(s.value.nodes, (R) => (c(), h("g", {
              key: R.name,
              class: "flowchart-node"
            }, [
              v("rect", {
                x: R.x,
                y: R.y,
                width: R.width,
                height: R.height,
                rx: "8"
              }, null, 8, km),
              v("text", {
                x: R.x + R.width / 2,
                y: R.y + R.padY + R.line / 2
              }, [
                (c(!0), h(V, null, ee(R.lines, (F, Y) => (c(), h("tspan", {
                  key: Y,
                  x: R.x + R.width / 2,
                  dy: Y ? R.line : 0
                }, w(F), 9, $m))), 128))
              ], 8, xm)
            ]))), 128)),
            (c(!0), h(V, null, ee(s.value.arrows, (R, F) => (c(), h(V, {
              key: `label-${F}`
            }, [
              R.label ? (c(), h("g", Mm, [
                v("rect", {
                  x: R.label.x,
                  y: R.label.y,
                  width: R.label.width,
                  height: R.label.height,
                  rx: "4"
                }, null, 8, Sm),
                v("text", {
                  x: R.label.x + R.label.width / 2,
                  y: R.label.y + R.label.pad + R.label.line / 2
                }, [
                  (c(!0), h(V, null, ee(R.label.lines, (Y, D) => (c(), h("tspan", {
                    key: D,
                    x: R.label.x + R.label.width / 2,
                    dy: D ? R.label.line : 0
                  }, w(Y), 9, Em))), 128))
                ], 8, _m)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, bm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Cm = /* @__PURE__ */ K(Am, [["__scopeId", "data-v-6f337720"]]), io = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', co = {
  words: '<rect x="2.5" y="3" width="11" height="8" rx="2"/><polyline points="5,11 5,13.5 8,11"/>',
  summary: '<line x1="3" y1="4.5" x2="13" y2="4.5"/><line x1="3" y1="8" x2="11" y2="8"/><line x1="3" y1="11.5" x2="8" y2="11.5"/>',
  warning: '<polygon points="8,2.5 14,13 2,13"/><line x1="8" y1="6.5" x2="8" y2="9.3"/><circle class="f" cx="8" cy="11.2" r=".75"/>',
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
  agent: io,
  worker: io,
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
}, Om = ["innerHTML"], Tm = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = L(() => co[t.name] || co.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Om));
  }
}, ut = /* @__PURE__ */ K(Tm, [["__scopeId", "data-v-939f191f"]]), Rm = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(ut, { name: "fold" })
    ], 2));
  }
}, kt = /* @__PURE__ */ K(Rm, [["__scopeId", "data-v-a570162c"]]), Im = ["data-tip", "aria-label"], Bm = {
  key: 0,
  class: "mact-word"
}, Lm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      N(ut, { name: "open" }),
      e.open ? (c(), h("span", Bm, w(e.label), 1)) : E("", !0),
      n[0] || (n[0] = v("span", { class: "hit" }, null, -1))
    ], 10, Im));
  }
}, Kl = /* @__PURE__ */ K(Lm, [["__scopeId", "data-v-2824bb7d"]]), Yl = 120, On = 280, Jl = 160, Nm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Dm = ["leaving", "resizing", "entering"];
function Za(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Pm(e) {
  const t = Dm.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Za(e);
  return e.classList.add(...t), n;
}
function Zl(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const g = Pm(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${On}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${On}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, g);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let g = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== g && (g = m.offsetHeight, i(f, Za(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, g = ++o;
    if (!m || !m.offsetWidth || Nm()) {
      a.value = f;
      return;
    }
    const y = Za(m);
    if (l(m, y), s.value = "leaving", await n(Yl), g !== o) return;
    a.value = f, s.value = "resizing", await dt(), i(m, y);
    const $ = u(m);
    await n(On), $ == null || $.disconnect(), g === o && (r(m), s.value = "entering", await n(Jl), g === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), _t(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const jm = { class: "growing-card-top" }, qm = ["aria-expanded"], Fm = { class: "growing-card-avatar" }, Wm = { class: "growing-card-title" }, Hm = { class: "growing-card-more" }, zm = { class: "growing-card-body" }, Um = {
  __name: "GrowingCard",
  props: {
    title: { type: String, required: !0 },
    text: { type: String, default: "" },
    icon: { type: String, default: "agents" },
    person: { type: String, default: "" },
    bad: Boolean,
    action: { type: String, default: "" },
    incoming: Boolean,
    commentable: Boolean
  },
  emits: ["act", "comment"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = Zl(o, () => !s.value), i = L(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = L(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", P(r), { open: !P(l), bad: e.bad, incoming: e.incoming }])
    }, [
      v("div", jm, [
        v("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          v("span", Fm, [
            e.bad ? (c(), H(ut, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(V, { key: 1 }, [
              Q(w(i.value), 1)
            ], 64)) : (c(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          v("span", Wm, w(e.title), 1),
          N(kt, { open: s.value }, null, 8, ["open"])
        ], 8, qm),
        e.action ? (c(), H(Kl, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : E("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          N(ye, {
            name: "bubble",
            size: 13
          })
        ])) : E("", !0)
      ]),
      v("div", Hm, [
        v("div", zm, [
          (c(!0), h(V, null, ee(u.value, (m, g) => (c(), h("p", {
            key: g,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Vm = /* @__PURE__ */ K(Um, [["__scopeId", "data-v-9cee1e01"]]), Gm = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Km = { class: "md inline" }, Ym = ["disabled", "title", "onClick"], Jm = {
  key: 1,
  class: "message-links-many"
}, Zm = ["aria-expanded"], Xm = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Qm = ["disabled", "onClick"], e1 = { class: "row-pill message-links-chip" }, t1 = { class: "message-links-title" }, n1 = { key: 0 }, pa = 3, a1 = "task", s1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(() => n.total || n.links.length), o = L(() => n.links.every((m) => m.endpoint.model === a1) ? "tasks" : "items"), l = I(!1), r = I(null);
    tl(r, () => l.value = !1);
    const i = () => l.value = !l.value, u = (m) => m.endpoint.unavailable || !m.endpoint.open_ref, d = (m) => m.relations.includes("edited") ? m.relations.includes("about") ? "Created, edited" : "Edited" : "";
    function f(m) {
      u(m) || (l.value = !1, We(m.endpoint.open_ref));
    }
    return (m, g) => (c(), h("div", {
      ref_key: "line",
      ref: r,
      class: Z(["message-links", { many: s.value > pa, three: s.value === pa, open: l.value }]),
      "data-message-links": ""
    }, [
      N(ut, {
        class: "message-links-icon",
        name: "linked"
      }),
      e.links.length ? (c(), h("span", Gm, [
        v("span", Km, [
          g[1] || (g[1] = Q("Linked: ", -1)),
          (c(!0), h(V, null, ee(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(y),
            title: y.endpoint.title,
            onClick: ($) => f(y)
          }, [
            Q(w(y.endpoint.model.replaceAll("_", " ")) + " " + w(y.endpoint.id), 1),
            d(y) ? (c(), h(V, { key: 0 }, [
              Q(" (" + w(d(y)) + ")", 1)
            ], 64)) : E("", !0),
            u(y) ? (c(), h(V, { key: 1 }, [
              Q(" (unavailable)")
            ], 64)) : E("", !0)
          ], 8, Ym))), 128))
        ])
      ])) : E("", !0),
      s.value >= pa ? (c(), h("span", Jm, [
        v("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          Q(w(s.value) + " linked " + w(o.value) + " ", 1),
          N(kt, { open: l.value }, null, 8, ["open"])
        ], 8, Zm)
      ])) : E("", !0),
      l.value ? (c(), h("div", Xm, [
        (c(!0), h(V, null, ee(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(y),
          onClick: ($) => f(y)
        }, [
          v("span", e1, w(y.endpoint.model.replaceAll("_", " ")) + " " + w(y.endpoint.id), 1),
          v("span", t1, w(y.endpoint.title), 1),
          v("span", null, w(d(y)), 1),
          u(y) ? (c(), h("span", n1, "Unavailable")) : E("", !0)
        ], 8, Qm))), 128))
      ])) : E("", !0),
      N(Yn, {
        more: l.value && e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More linked work",
        onMore: g[0] || (g[0] = (y) => a("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, o1 = /* @__PURE__ */ K(s1, [["__scopeId", "data-v-417b955f"]]), l1 = ["title", "aria-label"], r1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, i1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, c1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = L(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", r1, [
        o[0] || (o[0] = v("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", i1)) : E("", !0)
      ]))
    ], 10, l1));
  }
}, u1 = /* @__PURE__ */ K(c1, [["__scopeId", "data-v-6c0a4358"]]);
function d1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Xl(e, t = Date.now()) {
  const n = d1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const f1 = 36e5;
function x5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / f1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Ql(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function uo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ga = (e) => String(e).padStart(2, "0");
function h1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ga(t % 60)}s` : `${Math.floor(t / 3600)}h ${ga(Math.floor(t % 3600 / 60))}m ${ga(t % 60)}s`;
}
const m1 = "img,pre,table";
function p1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function g1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function v1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(m1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = p1(g1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function y1(e, t) {
  let n = null;
  const a = () => e.value && v1(e.value);
  Be(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Le(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const b1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function w1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const kn = /* @__PURE__ */ new WeakMap(), Ue = "work", Ht = "sent", k1 = 50, fo = () => ({ rows: I([]), total: I(0), next: I(null), loading: I(!1), failure: I(""), version: 0 });
function x1(e) {
  var f;
  if (kn.has(e)) return kn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, g, y = 1) {
    const $ = m[g], k = ++$.version;
    $.loading.value = !0, $.failure.value = "";
    const R = g === Ue ? "--type about --type edited --group-counterparts" : "--type sent_to", F = `link list --source message:${m.id} ${R} --page ${y} --page-size ${g === Ue ? 10 : 25}`;
    try {
      const Y = await e.read(F);
      if (t.get(m.id) !== m || $.version !== k) return;
      if (!Y.ok) {
        $.failure.value = Y.error;
        return;
      }
      const D = g === Ue ? Y.value.counterparts ?? [] : Y.value.rows ?? [], b = y === 1 ? D : [...$.rows.value, ...D], x = g === Ue ? (S) => `${S.endpoint.model}:${S.endpoint.id}` : (S) => S.id ?? S.target_id;
      $.rows.value = [...new Map(b.map((S) => [x(S), S])).values()], $.total.value = Y.value.total ?? $.rows.value.length, $.next.value = Y.value.next_page ?? null;
    } catch (Y) {
      $.version === k && ($.failure.value = Y.message);
    } finally {
      $.version === k && ($.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const y = [...g.dirty];
      g.dirty.clear();
      for (const $ of y) o(g, $);
    }
  }
  function r(m, g = [Ue, Ht]) {
    for (const y of g) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), $ = y.length ? [Ue, Ht].filter((R) => R === Ue ? y.some((F) => ["about", "edited"].includes(F)) : y.includes("sent_to")) : [Ue, Ht];
    if (!$.length) return;
    const k = g.length ? [...new Set(g.filter((R) => R.model === "message").map((R) => R.id))].map((R) => t.get(R)).filter(Boolean) : [...t.values()].filter(s).slice(0, k1);
    for (const R of k) r(R, $);
  }
  const u = (f = e.follow) == null ? void 0 : f.call(e, ["link.*"], i), d = {
    attach(m, g) {
      let y = t.get(m);
      return y || (y = { id: m, views: /* @__PURE__ */ new Set(), dirty: /* @__PURE__ */ new Set([Ue, Ht]), work: fo(), sent: fo() }, t.set(m, y)), y.views.add(g), y.dirty.size && r(y, [...y.dirty]), y;
    },
    shown(m) {
      m.dirty.size && r(m, [...m.dirty]);
    },
    detach(m, g) {
      m.views.delete(g), m.views.size || t.delete(m.id), t.size || (clearTimeout(a), u == null || u(), kn.delete(e));
    },
    more(m, g) {
      const y = m == null ? void 0 : m[g];
      if (y != null && y.next.value && !y.loading.value) return o(m, g, y.next.value);
    }
  };
  return kn.set(e, d), d;
}
function $1(e, t, n) {
  const a = Ve(null);
  let s = null;
  const o = he(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = x1(e);
    const u = { visible: typeof IntersectionObserver > "u" }, d = s.attach(l, u);
    a.value = d;
    const f = typeof IntersectionObserver > "u" ? null : new IntersectionObserver((g) => {
      u.visible = g.some((y) => y.isIntersecting), u.visible && s.shown(d);
    }, { rootMargin: "100px" }), m = he(n, (g) => {
      f == null || f.disconnect(), g && (f == null || f.observe(g));
    }, { immediate: !0, flush: "post" });
    i(() => {
      m(), f == null || f.disconnect(), s.detach(d, u), a.value = null;
    });
  }, { immediate: !0 });
  return fs(o), {
    links: L(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: L(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: L(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: L(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: L(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: L(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: L(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: L(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: L(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ue),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const M1 = ["data-incoming", "data-ref"], S1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], _1 = { class: "message-body" }, E1 = ["title"], A1 = ["innerHTML"], C1 = ["title"], O1 = ["innerHTML"], T1 = {
  class: "message-faces",
  "data-message-faces": ""
}, R1 = ["title", "data-face", "onClick"], I1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, B1 = ["title", "data-reaction", "onClick"], L1 = {
  key: 0,
  class: "message-reaction-count"
}, N1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, D1 = ["href", "title"], P1 = ["src", "alt"], j1 = ["href"], q1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, F1 = ["disabled", "data-sent-worker", "title", "onClick"], W1 = { class: "message-foot" }, H1 = { class: "message-time" }, z1 = {
  class: "message-id",
  "data-message-id": ""
}, U1 = 140, V1 = 2, G1 = 1500, K1 = "An earlier message", Y1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = L(() => ["user", "comment"].includes(n.message.type)), r = L(() => {
      const [ve, fe] = (n.message.commented_row || ":").split(":"), ae = it(ve);
      return ae ? { ref: `${ae}:${fe}`, label: `${jt(ae).title.toLowerCase()} ${fe}` } : null;
    }), i = L(() => n.message.worker_id ?? null), u = I(!1), d = L(() => i.value !== null && ((n.message.text ?? "").length > U1 || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > V1)), f = L(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, G1);
    }
    const g = Dl(), y = L(() => g(n.message.text ?? "")), $ = L(() => JSON.parse(n.message.flowchart_edges || "[]")), k = I(!1), R = L(() => g(n.quote || K1));
    function F() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : We(`messages:${n.message.parent_id}`);
    }
    y1(o, () => `${n.message.text} ${n.quote}`);
    const Y = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, D = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, b = L(() => JSON.parse(n.message.captions || "{}")), x = L(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: D(ve), isImage: Y.test(ve), title: b.value[ve] || ve }))), S = L(() => Ql(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), C = Ee(Te, null), { links: _, total: B, more: M, loading: p, failure: T, sentTo: O, sentMore: A, sentLoading: J, sentFailure: te, loadMore: ce, loadSent: ie } = $1(C, () => l.value && !n.message.local ? n.message.id : null, o), pe = I(!1), Ce = L(() => w1(n.message.reactions));
    function qe(ve) {
      pe.value = !1, a("react", n.message, ve);
    }
    return (ve, fe) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      N(Vm, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: fe[0] || (fe[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, M1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      v("div", _1, [
        v("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: fe[6] || (fe[6] = (...ae) => P(It) && P(It)(...ae))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: fe[1] || (fe[1] = xe((ae) => P(We)(r.value.ref), ["stop"]))
          }, [
            N(ye, {
              name: "bubble",
              size: 12
            }),
            v("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, E1)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(F, ["stop"]),
            innerHTML: R.value
          }, null, 8, A1)) : E("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: fe[2] || (fe[2] = xe((ae) => P(We)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, C1)) : E("", !0),
          v("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, O1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: fe[3] || (fe[3] = xe((ae) => u.value = !u.value, ["stop"]))
          }, w(u.value ? "Show less" : "Show more"), 1)) : E("", !0),
          $.value.length ? (c(), h(V, { key: 4 }, [
            v("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: fe[4] || (fe[4] = (ae) => k.value = !0)
            }, "Open the flowchart"),
            k.value ? (c(), H(Cm, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: fe[5] || (fe[5] = (ae) => k.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        v("div", {
          class: Z(["message-tools", { picking: pe.value }]),
          "data-message-tools": ""
        }, [
          pe.value ? (c(), h(V, { key: 0 }, [
            v("div", T1, [
              (c(!0), h(V, null, ee(P(b1), (ae) => (c(), h("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Ke) => qe(ae)
              }, w(ae), 9, R1))), 128))
            ]),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: fe[7] || (fe[7] = (ae) => pe.value = !1)
            }, [
              N(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(V, { key: 1 }, [
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: fe[8] || (fe[8] = (ae) => pe.value = !0)
            }, "React"),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: fe[9] || (fe[9] = (ae) => a("reply", e.message))
            }, "Reply"),
            v("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, w(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: fe[10] || (fe[10] = (ae) => a("delete", e.message))
            }, "Delete")) : E("", !0)
          ], 64))
        ], 2)
      ]),
      Ce.value.length ? (c(), h("div", I1, [
        (c(!0), h(V, null, ee(Ce.value, (ae) => (c(), h("button", {
          key: ae.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Ke) => a("react", e.message, ae.emoji)
        }, [
          Q(w(ae.emoji) + " ", 1),
          ae.count > 1 ? (c(), h("span", L1, w(ae.count), 1)) : E("", !0)
        ], 10, B1))), 128))
      ])) : E("", !0),
      x.value.length ? (c(), h("div", N1, [
        (c(!0), h(V, null, ee(x.value, (ae) => (c(), h(V, {
          key: ae.name
        }, [
          ae.isImage ? (c(), h("a", {
            key: 0,
            href: ae.address,
            target: "_blank",
            class: "message-image",
            title: ae.title
          }, [
            v("img", {
              src: ae.address,
              alt: ae.name,
              "data-figure-picture": ""
            }, null, 8, P1)
          ], 8, D1)) : (c(), h("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, w(ae.name), 9, j1))
        ], 64))), 128))
      ])) : E("", !0),
      P(O).length ? (c(), h("div", q1, [
        N(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(V, null, ee(P(O), (ae) => (c(), h("button", {
          key: ae.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          title: `Open worker ${ae.id}`,
          onClick: xe((Ke) => ae.open_ref && P(We)(ae.open_ref), ["stop"])
        }, [
          Q("Also sent to worker " + w(ae.id), 1),
          ae.unavailable ? (c(), h(V, { key: 0 }, [
            Q(" (unavailable)")
          ], 64)) : E("", !0)
        ], 8, F1))), 128))
      ])) : E("", !0),
      N(Yn, {
        more: P(A),
        loading: P(J),
        failure: P(te),
        label: "More recipients",
        onMore: P(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      v("div", W1, [
        v("time", H1, w(S.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(V, { key: 0 }, [
          fe[11] || (fe[11] = v("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          v("span", z1, "message " + w(e.message.id), 1)
        ], 64)) : E("", !0),
        l.value ? (c(), H(u1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ]),
      P(_).length || P(T) ? (c(), H(o1, {
        key: 3,
        links: P(_),
        total: P(B),
        more: P(M),
        loading: P(p),
        failure: P(T),
        onMore: P(ce)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : E("", !0)
    ], 8, S1));
  }
}, $5 = /* @__PURE__ */ K(Y1, [["__scopeId", "data-v-bc09cda6"]]), J1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = ni("SkeletonParts", !0);
      return c(!0), h(V, null, ee(e.parts, (i, u) => (c(), h(V, { key: u }, [
        (c(!0), h(V, null, ee(i.count, (d) => (c(), H(Pt, {
          key: d,
          value: i.shape
        }, {
          line: j(() => [
            N(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: j(() => [
            N(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: j(() => [
            N(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: j(() => [...l[0] || (l[0] = [
            v("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: j(() => [
            v("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: j(() => [
            v("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: j(() => [
            v("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: j(() => [
            v("div", {
              class: "skeleton-grid",
              style: ge(s(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), Z1 = /* @__PURE__ */ K(J1, [["__scopeId", "data-v-b78e62d9"]]), X1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, Q1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", X1, [
      N(Z1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, $s = /* @__PURE__ */ K(Q1, [["__scopeId", "data-v-a5cff6ec"]]), jn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], va = 200, er = (e) => {
  var t;
  return ((t = jn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? jn[0].key;
}, M5 = (e) => {
  var t;
  return ((t = jn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, ep = ["aria-label"], tp = 300, ho = 400, np = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: va } },
  setup(e) {
    const t = e, n = L(() => er(t.value)), a = L(() => n.value < va ? [1, 0.25, 0.25] : n.value === va ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= ho, high: n.value >= tp && n.value < ho }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      v("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: ge({ opacity: a.value[0] })
      }, null, 4),
      v("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: ge({ opacity: a.value[1] })
      }, null, 4),
      v("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: ge({ opacity: a.value[2] })
      }, null, 4)
    ], 10, ep));
  }
}, S5 = /* @__PURE__ */ K(np, [["__scopeId", "data-v-549d72cf"]]), mo = (e) => [...new Set(e.agents.map((t) => t.name))], _5 = (e) => mo(e).length === 1 ? `Worker: ${mo(e)[0]}` : "Delegated", ap = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, po = (e) => ap[e.card.state] || "idle", sp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), go = { working: 0, waiting: 1, idle: 2, stopped: 3 }, vo = (e, t) => go[po(e)] - go[po(t)], yo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, E5 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => vo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || sp(a, s)) : [...e].sort((a, s) => vo(a, s) || (yo[t] || yo.state)(a, s)), op = { class: "list-row" }, lp = {
  key: 0,
  class: "list-row-type"
}, rp = { class: "list-row-main" }, ip = {
  key: 0,
  class: "list-row-title"
}, cp = { class: "list-row-body" }, up = {
  key: 1,
  class: "list-row-end"
}, dp = {
  key: 1,
  class: "list-row-text"
}, fp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", op, [
      e.type ? (c(), h("span", lp, w(e.type), 1)) : E("", !0),
      v("div", rp, [
        e.title ? (c(), h("span", ip, w(e.title), 1)) : E("", !0),
        v("div", cp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", up, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", dp, w(e.text), 1)) : E("", !0)
    ]));
  }
}, A5 = /* @__PURE__ */ K(fp, [["__scopeId", "data-v-30fac05a"]]), hp = {
  claude: [
    { key: "haiku", label: "haiku", note: "fast, for mechanical work" },
    { key: "sonnet", label: "sonnet", note: "careful work without invention" },
    { key: "opus", label: "opus", note: "judgement" },
    { key: "fable", label: "fable", note: "the most demanding work, for rare occasions" }
  ],
  codex: [
    { key: "gpt-6-luna", label: "gpt-6-luna", note: "fast, for mechanical work" },
    { key: "gpt-6.1-terra", label: "gpt-6.1-terra", note: "careful work without invention" },
    { key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "judgement" },
    { key: "gpt-6-astra", label: "gpt-6-astra", note: "the most demanding work, for rare occasions" }
  ]
}, mp = { claude: "Claude Code", codex: "Codex" }, pp = ["aria-expanded"], gp = { class: "drop-label" }, vp = ["value"], yp = {
  key: 1,
  class: "drop-lead"
}, bp = { class: "drop-item-text" }, wp = {
  key: 2,
  class: "drop-note"
}, kp = {
  key: 1,
  class: "drop-none"
}, xp = {
  __name: "DropList",
  props: {
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
    items: { type: Array, default: () => [] },
    picked: { type: String, default: "" },
    empty: { type: String, default: "Nothing here" },
    wide: Boolean,
    bare: Boolean,
    menuWidth: { type: Number, default: 260 },
    searchable: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(!1), o = I(null), l = I(""), r = L(() => {
      const u = l.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      v("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), H(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : E("", !0),
        v("span", gp, w(e.label), 1),
        N(ye, {
          name: "down",
          size: 11
        })
      ], 10, pp),
      s.value ? (c(), H(Jn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: j(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, vp)) : E("", !0),
          (c(!0), h(V, null, ee(r.value, (f) => (c(), H($t, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: j(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : E("", !0),
              f.lead ? (c(), h("span", yp, w(f.lead), 1)) : E("", !0),
              v("span", bp, w(f.label), 1),
              f.note ? (c(), h("span", wp, w(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? E("", !0) : (c(), h("p", kp, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, $p = /* @__PURE__ */ K(xp, [["__scopeId", "data-v-9d0322ab"]]), C5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = L(() => [
      ...hp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = L(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), H($p, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${P(mp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Mp = ["aria-label"], Sp = { class: "head" }, _p = { class: "names" }, Ep = { class: "body" }, Ap = {
  key: 0,
  class: "foot"
}, Cp = {
  __name: "SidePanel",
  props: {
    title: { type: String, default: "" },
    abstract: { type: String, default: "" },
    width: { type: String, default: "normal" },
    open: { type: Boolean, default: null },
    depth: { type: Number, default: 0 },
    over: { type: Boolean, default: !1 },
    closeLabel: { type: String, default: "Close the panel" }
  },
  emits: ["close", "dismiss"],
  setup(e, { emit: t }) {
    const n = e, a = t, { visible: s, close: o, closed: l } = bl(a, n), r = wl(s);
    return (i, u) => (c(), H(cs, { to: "body" }, [
      N(Dt, {
        name: "side",
        appear: "",
        onAfterLeave: P(l)
      }, {
        default: j(() => [
          P(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: P(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => P(o) && P(o)(...d), ["self"]))
          }, [
            v("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(V, { key: 0 }, [
                v("header", Sp, [
                  v("div", _p, [
                    v("h2", null, w(e.title), 1),
                    e.abstract ? (c(), H(bt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : E("", !0)
                  ]),
                  ue(i.$slots, "actions", {}, void 0, !0),
                  N(vs, {
                    title: e.closeLabel,
                    onClick: P(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                v("div", Ep, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", Ap, [
                  ue(i.$slots, "foot", {}, void 0, !0)
                ])) : E("", !0)
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Mp)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, O5 = /* @__PURE__ */ K(Cp, [["__scopeId", "data-v-82aa5dd1"]]), Op = {
  key: 1,
  class: "text-field-label"
}, Tp = {
  key: 2,
  class: "text-field-end"
}, Rp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ ja({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Pa(e, "modelValue"), a = Kn(), s = "onUpdate:modelValue" in (((d = ai()) == null ? void 0 : d.vnode.props) || {}), o = L(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = L(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = L(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, P(a).class]),
      style: ge(P(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", Op, w(e.label), 1)) : E("", !0),
      Qe(v("input", Ge({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [P(Ua), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Tp, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : Qe((c(), h("input", Ge({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [P(Ua), o.value]
    ]);
  }
}), T5 = /* @__PURE__ */ K(Rp, [["__scopeId", "data-v-631ba0ce"]]);
async function Ip(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((i) => [i, a[i]])), l = () => Object.assign(a, o);
  Object.assign(a, s);
  let r = !1;
  try {
    const i = await n(t);
    return r = i.ok, i;
  } finally {
    r || l();
  }
}
const bo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function R5(e) {
  const t = ft().sources.find((n) => n.key === e);
  return t ? Xa(t.read, t.events) : Xa("", []);
}
function Xa(e, t, { incremental: n = !1 } = {}) {
  var b;
  const a = Number(((b = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : b[1]) ?? 50), s = ft(), o = I([]), l = I(null), r = I(""), i = I(!1), u = performance.now(), d = I(!1), f = I(""), m = I(null);
  async function g(x) {
    const S = k, C = await s.read(`${e} --before-id ${x + 1} --limit 1`);
    if (S !== k) return;
    if (!C.ok) return F();
    const _ = C.value.rows.find((B) => B.id === x);
    o.value = _ ? o.value.map((B) => B.id === x ? _ : B) : o.value.filter((B) => B.id !== x);
  }
  async function y(x) {
    if (n && String((x == null ? void 0 : x.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== x.row_id));
    if (n && (x != null && x.row_id) && !String(x.event ?? "").endsWith(".create") && o.value.some((p) => p.id === x.row_id)) return g(x.row_id);
    if (!(n && o.value.length && String((x == null ? void 0 : x.event) ?? "").endsWith(".create"))) return F();
    const C = Math.max(...o.value.map((p) => p.id)), _ = k, B = await s.read(`${e} --after-id ${C}`);
    if (_ !== k) return;
    if (!B.ok) return F();
    const M = new Set(o.value.map((p) => p.id));
    o.value = [...B.value.rows.filter((p) => !M.has(p.id)), ...o.value];
  }
  async function $() {
    if (!d.value || !o.value.length) return !1;
    const x = k, S = Math.min(...o.value.map((B) => B.id)), C = await s.read(`${e} --before-id ${S}`);
    if (x !== k) return !1;
    if (!C.ok || !C.value.rows.length) return d.value = !1;
    d.value = bo(C.value, a);
    const _ = new Set(o.value.map((B) => B.id));
    return o.value = [...o.value, ...C.value.rows.filter((B) => !_.has(B.id))], !0;
  }
  let k = 0;
  async function R(x) {
    const S = ++k, C = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (S !== k) return;
    const _ = C.ok ? s.shared ? [C.value] : C.value.rows : [];
    C.ok && (o.value = x(_)), l.value = C.ok ? C.value : null;
    const B = _.length ? Math.min(..._.map((M) => M.id)) : 0;
    C.ok && !o.value.some((M) => M.id < B) && (d.value = !s.shared && bo(C.value, a)), r.value = C.ok ? "" : C.error, hs(u, () => i.value = !0);
  }
  function F() {
    return R((x) => {
      if (!n || !x.length) return x;
      const S = Math.min(...x.map((_) => _.id)), C = Math.max(...x.map((_) => _.id));
      return [...o.value.filter((_) => _.id > C), ...x, ...o.value.filter((_) => _.id < S)];
    });
  }
  const Y = () => R((x) => x);
  async function D(x, S = null) {
    const C = await Ip(S && { target: o, fields: { value: S(o.value) } }, x, s.run);
    return f.value = C.ok ? "" : C.error, m.value = C.ok ? C.value : null, await F(), C;
  }
  return e && (s.follow(t, y), F()), { rows: o, listing: l, failure: r, loaded: i, more: d, load: F, loadLatest: Y, older: $, act: D, actionFailure: f, answer: m, context: s };
}
const Bp = { class: "title" }, Lp = { class: "state" }, Np = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Xa(t.line, t.events);
    return (o, l) => (c(), H(Sd, {
      rows: P(n),
      failure: P(a),
      loaded: P(s),
      empty: e.empty
    }, {
      default: j(({ row: r }) => [
        v("span", Bp, w(r.title), 1),
        v("span", Lp, w(P(hl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, I5 = /* @__PURE__ */ K(Np, [["__scopeId", "data-v-46749af8"]]);
function Dp(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Le(() => clearInterval(a)), n;
}
const ya = I(Date.now() / 1e3);
let wo = 0, xn = 0;
function tr() {
  return xn || (ya.value = Date.now() / 1e3, wo = setInterval(() => ya.value = Date.now() / 1e3, 1e3)), xn += 1, Jo() && fs(() => {
    xn -= 1, xn || clearInterval(wo);
  }), ya;
}
const Pp = 200, jp = Yl + On + Jl + Pp;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function qp(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Ft(e),
    top: Ft(e.querySelector(".top")),
    title: Ft(e.querySelector(".title")),
    contents: Ft(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: Ft(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Fp(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(qp(o, l, n.value)), performance.now() - l < jp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const Wp = ["title", "data-figure-mark", "data-folded", "data-open"], Hp = {
  key: 2,
  class: "worker"
}, zp = { class: "head" }, Up = { key: 0 }, Vp = {
  key: 3,
  class: "status"
}, Gp = {
  key: 0,
  class: "figure"
}, Kp = {
  key: 1,
  class: "ran-for"
}, Yp = { key: 2 }, Jp = {
  key: 3,
  class: "news"
}, Zp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Xp = {
  key: 6,
  class: "settled"
}, Qp = {
  key: 1,
  class: "bar"
}, eg = {
  key: 3,
  class: "detail body"
}, tg = {
  key: 0,
  class: "body-label"
}, ng = ["title"], ag = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Kn(), a = ["onClick", "onAct"], s = L(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = L(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = L(() => t.open !== void 0), i = L(() => r.value || l.value), u = L(() => r.value ? t.open : o.value), d = L(() => r.value ? !t.open : l.value && !o.value), f = L(() => !!(t.mark.action && n.onAct)), m = L(() => i.value || f.value || !!n.onClick), g = I(null), y = I(null), { folded: $, phase: k } = Zl(g, () => d.value);
    Fp(g, d, k, Ee(Te, null));
    function R(ie) {
      var pe, Ce;
      if (!(ie.target !== g.value && !y.value.contains(ie.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ce = n.onAct || n.onClick) == null || Ce(ie);
      }
    }
    const F = (ie) => n.onAct(ie), Y = ["failed", "unfinished"], D = L(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Y.includes(t.mark.state) ? "danger" : "good" : ""), b = L(() => t.mark.color ? t.mark.color : D.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : D.value ? `var(--tone-${D.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), x = L(() => b.value || "var(--tone-work)"), S = L(() => !t.mark.ending && !t.mark.ended && D.value !== "stopped"), C = tr(), _ = L(
      () => t.mark.began_at && S.value && !t.mark.figure && !t.mark.counting ? h1(C.value - t.mark.began_at) : ""
    ), B = L(() => {
      const { started: ie, ended: pe } = t.mark;
      return ie ? pe ? `ran ${uo(pe - ie, !0)}` : uo(C.value - ie, !0) : _.value;
    }), M = ["bad", "danger", "warn"], p = L(() => M.includes(D.value) || t.mark.asks ? "attention" : S.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), T = ["bad", "danger"], O = L(() => T.includes(D.value)), A = L(() => p.value === "process" ? "running" : O.value ? "cross" : D.value === "stopped" ? "stopped" : D.value === "good" ? "tick" : ""), J = L(
      () => !!(t.mark.figure || B.value || t.mark.docked || t.mark.stopping || A.value || t.mark.settled || t.mark.news)
    ), te = L(() => [t.mark.title, t.mark.time ? Ql(t.mark.time) : ""].filter(Boolean).join(" · ")), ce = L(() => ({
      ...b.value ? { "--mark": b.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, pe) => (c(), h("div", Ge(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${p.value}`,
        P(k),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: O.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: b.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ce.value,
      title: te.value,
      "data-figure-mark": e.mark.key,
      "data-folded": P($) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: R
    }), [
      (c(), H(St(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: j(() => [
          e.mark.markIcon ? (c(), H(ut, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Hp, w(e.mark.worker), 1)) : E("", !0),
          v("span", zp, [
            N(bt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Up, w(e.mark.name), 1)) : E("", !0),
            i.value ? (c(), H(kt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          J.value ? (c(), h("span", Vp, [
            e.mark.figure ? (c(), h("span", Gp, w(e.mark.figure), 1)) : E("", !0),
            B.value ? (c(), h("span", Kp, w(B.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", Yp, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", Jp, w(e.mark.news), 1)) : E("", !0),
            A.value === "running" ? (c(), h("span", Zp)) : A.value ? (c(), H(ut, {
              key: 5,
              class: Z(["sign", A.value]),
              name: A.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", Xp, w(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(Kl, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(F, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && S.value ? (c(), h("span", Qp, [
        v("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: x.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !P($) ? (c(), H(bt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !P($) ? (c(), h("div", eg, [
        e.mark.bodyLabel ? (c(), h("p", tg, w(e.mark.bodyLabel), 1)) : E("", !0),
        N(bt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !P($) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, ng)) : E("", !0),
      e.mark.card ? (c(), H(bt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      ue(ie.$slots, "default", {
        shown: !P($)
      }, void 0, !0)
    ], 16, Wp));
  }
}), nr = /* @__PURE__ */ K(ag, [["__scopeId", "data-v-dc93aa50"]]), sg = 60;
function og(e, t) {
  const n = I([]), a = I(0);
  let s = -1, o = 0, l = !1;
  async function r() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function i() {
    if (s < 0) return r();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? r() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function u(d) {
    if (l || a.value <= 0 || d.scrollTop > sg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await dt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const lg = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function ar(e) {
  var n;
  const t = lg[e] || ((n = jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const rg = (e) => ar(String(e).split(":")[0]), sr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), ig = { passed: "good", failed: "danger", warned: "warn", running: "" }, cg = { good: "good", warn: "warn", danger: "danger" }, ko = {
  "open row": (e) => We(`${e.target_model}:${e.target_id}`),
  "open page": (e) => pd(e.target_model, e.target_id || 0)
}, ug = { "open row": (e) => rg(e.target_model), "open page": () => ar("pages") };
function dg(e, t) {
  const n = t || {}, a = ko[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? ig[e.outcome] || "" : cg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? ug[a](e) : "",
    handlers: a ? { onAct: () => ko[a](e) } : {}
  };
}
const fg = 2e3;
function hg(e, t, n = fg) {
  let a = null, s = !1, o = !1;
  const l = async (d) => {
    o = !0;
    try {
      await d();
    } catch {
    } finally {
      o = !1;
    }
  }, r = () => l(async () => t() && await e()), i = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await r(), i();
      },
      typeof n == "function" ? n() : n
    ));
  }, u = async () => {
    s || document.hidden || o || (clearTimeout(a), await r(), i());
  };
  Be(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), _t(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const mg = 24, pg = 1e3, xo = 2e3, gg = 0.25, vg = 5e3;
function yg(e, t = mg, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const D = u();
    return D ? D.scrollHeight - D.scrollTop - D.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(D) {
    if (clearTimeout(l), !D) {
      o.value = !1, i = Date.now();
      return;
    }
    const b = Date.now() - i < xo ? xo : pg;
    l = setTimeout(() => o.value = a.value, b);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(D = !1) {
    const b = u();
    b && D && b.scrollTo ? b.scrollTo({ top: b.scrollHeight, behavior: "smooth" }) : b && (b.scrollTop = b.scrollHeight), g();
  }
  function $() {
    R(), !a.value && (a.value = !0, m(!0));
  }
  const k = () => !!u() && d() <= u().clientHeight * gg;
  function R() {
    clearTimeout(r), k() && (r = setTimeout(() => a.value && k() && n() && y(!0), vg));
  }
  function F() {
    f() ? g() : $();
  }
  function Y(D = 1, b = !1) {
    a.value ? s.value += Math.max(0, D) : y(b);
  }
  return Jo() && fs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: y, left: $, scrolled: F, arrived: Y };
}
const bg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, wg = (e) => String(e ?? "").replace(bg, ""), kg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = yg(s);
    he(
      () => n.lines.length,
      () => dt(() => r()),
      { immediate: !0 }
    );
    function u(d) {
      l(), a("older", d.target);
    }
    return (d, f) => (c(), h("pre", {
      ref_key: "box",
      ref: s,
      class: "output-lines",
      onScroll: u
    }, [
      Q(w(P(wg)(e.lines.join(`
`)) || e.empty), 1),
      P(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => P(i)(!0))
      }, "Follow")) : E("", !0)
    ], 544));
  }
}, xg = /* @__PURE__ */ K(kg, [["__scopeId", "data-v-07980c45"]]), $g = 1e4;
class Mg {
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
    return this.heardAt !== null && t - this.heardAt > $g;
  }
  async received(t) {
    if (t.source !== this.frame.contentWindow) return;
    this.heardAt = Date.now();
    const n = t.data;
    !n || typeof n.id != "number" || (n.type === "read" && this.send(n.id, await this.context.read(n.line)), n.type === "run" && this.send(n.id, await this.context.run(n.line)), n.type === "option" && this.send(n.id, { ok: !0, value: this.context.option(n.key).value ?? null }), n.type === "follow" && (this.context.follow(n.patterns, (a) => this.send(n.id, { ok: !0, value: a })), this.send(n.id, { ok: !0, value: null })));
  }
  send(t, n) {
    var a;
    (a = this.frame.contentWindow) == null || a.postMessage({ id: t, answer: n }, "*");
  }
}
const Sg = {
  key: 0,
  class: "frame-note"
}, _g = {
  key: 0,
  class: "frame-note"
}, Eg = ["src", "title"], Ag = 1e3, Cg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ft(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Be(() => {
      l = new Mg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Ag);
    }), Le(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", Sg, "This window was closed because it stopped answering.")) : (c(), h(V, { key: 1 }, [
      s.value ? (c(), h("div", _g, [
        u[2] || (u[2] = v("p", null, "This window has not answered for ten seconds.", -1)),
        N(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: j(() => [...u[1] || (u[1] = [
            Q("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : E("", !0),
      v("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: P(n).window
      }, null, 8, Eg)
    ], 64));
  }
}, Og = /* @__PURE__ */ K(Cg, [["__scopeId", "data-v-f3cb2f7c"]]), $n = (e) => e ? e.split(", ") : [];
function Tg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Rg(e, t) {
  return {
    reads: $n(e.reads_allowed),
    runs: $n(e.runs_allowed),
    missing: [...$n(e.reads_missing), ...$n(e.runs_missing)],
    ask: t
  };
}
const Ig = {
  class: "allowance-prompt",
  role: "dialog"
}, Bg = { class: "allowance-prompt-text" }, Lg = { class: "allowance-prompt-buttons" }, Ng = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Ig, [
      v("p", Bg, w(P(Tg)(e.request)), 1),
      v("div", Lg, [
        N(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            Q("Allow", -1)
          ])]),
          _: 1
        }),
        N(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            Q("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Dg = /* @__PURE__ */ K(Ng, [["__scopeId", "data-v-9319ffca"]]), ba = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: j(() => [
        Q(w(e.reason) + " ", 1),
        e.retry ? (c(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: j(() => [...s[2] || (s[2] = [
            Q("Retry", -1)
          ])]),
          _: 1
        })) : E("", !0),
        e.removable ? (c(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: j(() => [...s[3] || (s[3] = [
            Q("Remove tab", -1)
          ])]),
          _: 1
        })) : E("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Pg = ["data-window", "data-agent"], jg = {
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
    sources: { type: Array, default: () => [] },
    links: { type: Object, default: () => ({}) },
    search: { type: Object, default: () => ({}) },
    readOnly: Boolean,
    shared: { type: Object, default: null },
    skeleton: { type: Array, default: () => [] }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(""), o = I(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Ee(Ii, null), i = uu({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: L(() => n.options),
      declared: n.declared,
      page: Ee(au, null),
      setOption: (f, m) => a("option", f, m),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, m) => {
        a("open", f, m), r == null || r(f, m);
      }
    });
    si(Te, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Be(i.settle), Le(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), oi((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Gn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), H(Dg, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (g) => e.prompts.answer(g))
      }, null, 8, ["request"])) : E("", !0),
      e.unavailableReason ? (c(), H(ba, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), H(ba, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(V, { key: 4 }, [
        (c(), H(u, { key: o.value })),
        e.skeleton.length && !P(i).answered.value ? (c(), H($s, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : E("", !0)
      ], 64)) : (c(), H(ba, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (g) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, Pg));
  }
}, Kt = /* @__PURE__ */ K(jg, [["__scopeId", "data-v-bd481e0c"]]), or = {
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
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = { render: () => Gn(Og, { src: n.entry.entry_url }) };
    return (o, l) => (c(), H(Kt, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: s,
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
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: l[0] || (l[0] = (r, i) => a("option", r, i))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, qg = ["data-window"], lr = {
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
  emits: ["option"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ve(null), o = I("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, yc();
          } catch (r) {
            if (gc(r) && vc(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      N($s, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, qg)) : (c(), H(Kt, {
      key: e.entry.entry_url,
      name: e.entry.name,
      component: s.value,
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
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events,
      skeleton: e.entry.skeleton,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: r[0] || (r[0] = (i, u) => a("option", i, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, Fg = "*.*", Wg = {
  __name: "ModuleBody",
  props: {
    declaration: { type: Object, required: !0 },
    row: { type: Object, default: null },
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean,
    environment: { type: String, default: "" }
  },
  setup(e) {
    const t = e, n = Ee(Te, null), a = new Zc();
    he(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = L(() => !!(t.declaration.shipped || t.declaration.trusted)), r = L(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Fg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), H(lr, {
      key: 0,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(or, {
      key: 1,
      entry: r.value,
      subscriptions: P(a),
      environment: P(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Hg = { class: "mark-more-inner" }, zg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Ug = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Vg = {
  key: 3,
  class: "mark-lines"
}, Gg = "process", $o = "task", Kg = {
  __name: "MarkBody",
  props: {
    declaration: { type: Object, required: !0 },
    mark: { type: Object, required: !0 },
    shown: Boolean,
    head: { type: Object, default: null },
    foot: { type: Object, default: null },
    actions: { type: Object, default: null },
    time: { type: Object, default: null },
    folded: Boolean
  },
  setup(e) {
    const t = e, n = Ee(Te), a = L(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = L(() => sr.has(t.mark.variant) && t.mark.detail || ""), o = L(() => t.mark.target_model === $o ? t.mark.target_id : 0), l = og(
      (g) => n.run(g),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), u = I(""), d = L(() => !t.declaration.body_url && t.mark.target_model === Gg && !!t.mark.target_id);
    async function f(g = l.follow) {
      const y = await g();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = L(() => t.shown && d.value);
    return he(m, (g) => g && f()), hg(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, y) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = xe(() => {
      }, ["stop"]))
    }, [
      v("div", Hg, [
        e.declaration.body_url ? (c(), H(Wg, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(V, { key: 1 }, [
          s.value ? (c(), h(V, { key: 0 }, [
            y[2] || (y[2] = v("p", { class: "mark-label" }, "Why it stopped", -1)),
            v("p", zg, w(s.value), 1)
          ], 64)) : E("", !0),
          d.value && u.value ? (c(), h("p", Ug, w(u.value), 1)) : d.value && i.value ? (c(), h(V, { key: 2 }, [
            y[3] || (y[3] = v("p", { class: "mark-label" }, "Output", -1)),
            N(xg, {
              class: "mark-terminal",
              lines: P(r),
              onOlder: P(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Vg, w(a.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = xe(($) => P(We)(`${$o}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Qa = /* @__PURE__ */ K(Kg, [["__scopeId", "data-v-4e5e4ce1"]]), Yg = ["title", "aria-label", "onClick"], Jg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Zg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = L(() => Wu(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = I(""), s = Ee(Te);
    async function o(l) {
      const r = await rn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(V, null, [
      (c(!0), h(V, null, ee(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: xe((u) => o(i), ["stop"])
      }, [
        N(ut, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Yg))), 128)),
      a.value ? (c(), h("span", Jg, w(a.value), 1)) : E("", !0)
    ], 64));
  }
}, Xg = /* @__PURE__ */ K(Zg, [["__scopeId", "data-v-c8022f67"]]);
function rr(e, t) {
  const n = Ve(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const ir = rr("/api/marks", "marks"), B5 = ir.fetchAll, Qg = ir.find, e0 = ["data-ref"], t0 = ["data-ref"], n0 = { class: "mark-row" }, a0 = "dock add", s0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = L(() => Qg(a.mark.type)), o = L(() => dg(a.mark, s.value)), l = L(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && sr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = L(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(a0));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(Qa, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, e0)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": P(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        v("span", n0, [
          N(nr, Ge({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, li(o.value.handlers), { onClick: i }), ri({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: j(({ shown: y }) => [
                N(Qa, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          N(Xg, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, t0));
    };
  }
}, o0 = /* @__PURE__ */ K(s0, [["__scopeId", "data-v-822c50ad"]]), l0 = ["data-ref"], r0 = ["inert"], i0 = { class: "group-fold" }, c0 = { class: "thread-group" }, u0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await dt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = L(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (r, i) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      N(nr, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        v("div", i0, [
          v("div", c0, [
            (c(!0), h(V, null, ee(e.group.marks, (u) => (c(), H(o0, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, r0)) : E("", !0)
    ], 8, l0));
  }
}, L5 = /* @__PURE__ */ K(u0, [["__scopeId", "data-v-163808b2"]]);
function d0(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Be(() => n.observe(e.value)), _t(() => n.disconnect()), t;
}
const f0 = { class: "chat-dock-fold" }, h0 = ["aria-label"], m0 = { class: "chat-dock-head" }, p0 = { class: "chat-dock-inner" }, g0 = { class: "chat-dock-foot" }, cr = 700, v0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = d0(a), o = I(!1);
    let l = 0;
    return Be(() => l = setTimeout(() => o.value = !0, cr)), _t(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      v("div", f0, [
        v("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          v("header", m0, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          v("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            v("div", p0, [
              v("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(P(s) === null ? null : { height: `${P(s)}px` })
              }, [
                v("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ue(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ue(r.$slots, "still", {}, void 0, !0),
          v("footer", g0, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, h0)
      ])
    ], 2));
  }
}, ur = /* @__PURE__ */ K(v0, [["__scopeId", "data-v-faaa3f0d"]]), y0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, wa = 5, b0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(wa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${wa}s`, animationDelay: `${(n - wa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", y0, [
      v("i", { style: a })
    ]));
  }
}, dr = /* @__PURE__ */ K(b0, [["__scopeId", "data-v-3be36688"]]), w0 = { reviewing: "Under review" }, k0 = (e, t) => e || w0[t == null ? void 0 : t.state] || "", Je = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, x0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Je],
  ready: [Je],
  approved: [{ word: "start", label: "Start", main: !0 }, Je],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Je],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Je],
  completed: [],
  cancelled: []
}, $0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Je],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Je],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Je],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Je],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, M0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], S0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], _0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], E0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], A0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], C0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function O0(e, t) {
  const n = { plan: x0, task: $0 }[e], a = t != null && t.state ? nu(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[ml(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const T0 = (e, t) => e === "doc" || e === "report" ? C0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [..._0(t), ...S0(t)] : e === "check" ? A0(t) : e === "question" ? M0(t) : e === "memory" ? E0(t) : O0(e, t), fr = rr("/api/docks", "docks"), N5 = fr.fetchAll, zt = fr.find, R0 = 6, I0 = 3, ka = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Qn = (e) => Date.parse(e.leaves_at) / 1e3, yt = (e) => !!(e.leaves_at && !e.kept), B0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < Qn(e) || n.has(e.id)), L0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => B0(a, t, n)).sort((a, s) => a.id - s.id);
function N0(e, t, n = R0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Qn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const D0 = (e, t, n = e) => n < 2 ? !1 : e >= I0 ? !0 : t, P0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), es = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), j0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), q0 = (e) => ({ ...e.kept ? es("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : es("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), F0 = ["pins"], W0 = (e) => ({ ...e, iconOnly: F0.includes(e.icon) });
function H0(e, t) {
  var n;
  return [
    ...j0(e, t) ? [q0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    es("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(W0);
}
function z0(e, t) {
  const n = H0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: P0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const U0 = ["title"], V0 = {
  key: 2,
  class: "dock-controls"
}, G0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, K0 = { class: "dock-facts" }, Y0 = { key: 1 }, J0 = {
  key: 2,
  class: "dock-kept"
}, Z0 = { class: "dock-acts" }, X0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = L(() => zt(a.item.type)), o = tr(), l = L(() => Xl(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), u = I(null), d = I(null), f = L(() => z0(a.item, s.value)), m = Ee(Te), g = I(null);
    let y = 0;
    async function $() {
      var B, M;
      const x = ++y, S = Gt(a.item.target_model ?? ""), C = `${S} show`;
      if (!((M = (B = s.value) == null ? void 0 : B.reads) != null && M.includes(C))) return;
      const _ = await lt(a.item.type, [S, "show", String(a.item.target_id)], m.environment, m.signal);
      x === y && (g.value = _.ok ? { ..._.value, id: a.item.target_id, noun: S } : { id: a.item.target_id, noun: S });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (x, S, C) => {
        var M;
        const _ = Gt(a.item.target_model ?? "");
        g.value = { id: a.item.target_id, noun: _ }, $();
        const B = (M = m.subscriptions) == null ? void 0 : M.follow(`dock ${a.item.id}`, [`${_.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && $();
        });
        C(() => {
          y += 1, B == null || B();
        });
      },
      { immediate: !0 }
    );
    const k = I(/* @__PURE__ */ new Set()), R = I("");
    async function F(x) {
      if (x.action === "open") return We(`${a.item.target_model}:${a.item.target_id}`);
      x.action === "declared" && (k.value = /* @__PURE__ */ new Set([...k.value, x.label])), R.value = "";
      const C = await rn(x, { id: a.item.target_id }, m.environment);
      (C == null ? void 0 : C.ok) === !1 && (k.value = new Set([...k.value].filter((_) => _ !== x.label)), R.value = `Could not ${x.label.toLowerCase()}: ${C.error}`);
    }
    const Y = L(() => f.value.actions.filter((x) => x.action !== "undock" && !k.value.has(x.label))), D = L(() => {
      var x;
      return k0((x = s.value) == null ? void 0 : x.badge, g.value);
    }), b = L(() => f.value.buttons.find((x) => x.action === "undock"));
    return (x, S) => {
      var C, _, B, M;
      return c(), H(ur, {
        label: f.value.title + ((C = s.value) != null && C.needs_user ? ", waiting for you" : ""),
        type: (_ = s.value) != null && _.needs_user ? "waiting" : "",
        folded: !!((B = s.value) != null && B.folds) && e.folded,
        body: !!((M = s.value) != null && M.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: S[3] || (S[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: j(() => [
          e.leaving && !e.item.kept ? (c(), H(dr, {
            key: 0,
            "ends-at": P(Qn)(e.item)
          }, null, 8, ["ends-at"])) : E("", !0)
        ]),
        head: j(() => {
          var p, T;
          return [
            (p = s.value) != null && p.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(V, { key: 1 }, [
              N(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              v("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, U0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", V0, [
              (c(!0), h(V, null, ee(f.value.controls, (O) => {
                var A, J;
                return c(), h(V, {
                  key: O.action + O.runs
                }, [
                  !k.value.has(O.label) && (!((A = O.variants) != null && A.length) || !((J = g.value) != null && J.state) || O.variants.includes(g.value.state)) ? (c(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: O.pressed }),
                    "aria-pressed": O.pressed,
                    "aria-label": O.label,
                    title: O.label,
                    "data-dock-action": O.action,
                    onClick: (te) => F(O)
                  }, {
                    default: j(() => [
                      N(ye, {
                        name: O.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : E("", !0)
                ], 64);
              }), 128))
            ])) : E("", !0),
            v("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              e.collapsed || !((T = s.value) != null && T.leaves_after_seconds) ? (c(), h(V, { key: 0 }, [
                Q(w(l.value), 1)
              ], 64)) : E("", !0)
            ], 512)
          ];
        }),
        still: j(() => [
          R.value || e.refusal ? (c(), h("p", G0, w(R.value || e.refusal), 1)) : E("", !0)
        ]),
        foot: j(() => {
          var p, T;
          return [
            v("span", K0, [
              D.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(D.value), 3)) : E("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", Y0, w(s.value.word), 1)) : E("", !0),
              v("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", J0, "Kept")) : E("", !0)
            ]),
            (T = s.value) != null && T.folds ? (c(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: S[0] || (S[0] = (O) => n("fold"))
            }, {
              default: j(() => [
                Q(w(s.value.folds) + " ", 1),
                N(kt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : E("", !0),
            v("span", Z0, [
              v("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              N(nd, {
                name: `dock.${e.item.type}`,
                row: g.value,
                environment: P(m).environment,
                "read-only": P(m).readOnly,
                "object-name": P(Gt)(e.item.target_model),
                "external-failure": "",
                onFailure: S[1] || (S[1] = (O) => R.value = O),
                onDone: $
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(V, null, ee(Y.value, (O) => (c(), H(de, {
                key: O.action + O.runs,
                small: "",
                variant: O.primary ? "primary" : "ghost",
                bordered: !O.primary,
                "data-dock-action": O.action,
                onClick: (A) => F(O)
              }, {
                default: j(() => [
                  Q(w(O.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(de, {
                small: "",
                bordered: "",
                title: b.value.label,
                "data-dock-action": "undock",
                onClick: S[2] || (S[2] = (O) => n("undock", b.value))
              }, {
                default: j(() => [...S[4] || (S[4] = [
                  Q("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: j(() => {
          var p;
          return [
            (p = s.value) != null && p.body_url ? (c(), H(Qa, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : E("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, Mo = /* @__PURE__ */ K(X0, [["__scopeId", "data-v-e97fd02d"]]), Q0 = ["title", "aria-label"], ev = { class: "run-chip-in" }, tv = {
  key: 0,
  class: "run-chip-ring"
}, nv = { class: "run-chip-name" }, av = { class: "run-chip-bar" }, sv = "processes.output", ov = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ee(Te, null), o = (s == null ? void 0 : s.environment) ?? "", l = I(null), r = L(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = L(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), u = L(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await lt(sv, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Be(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (g) => {
        (!g.row_id || g.row_id === a.item.target_id) && d();
      });
    }), _t(() => f == null ? void 0 : f()), (m, g) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: ge({ "--tone": u.value })
      }, [
        P(yt)(e.item) ? (c(), H(dr, {
          key: 0,
          "ends-at": P(Qn)(e.item)
        }, null, 8, ["ends-at"])) : E("", !0),
        v("span", ev, [
          r.value ? (c(), h("span", tv)) : (c(), H(ut, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          v("span", nv, w(i.value), 1)
        ]),
        v("span", av, [
          v("i", {
            style: ge({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, Q0);
    };
  }
}, lv = /* @__PURE__ */ K(ov, [["__scopeId", "data-v-ea37a735"]]), rv = 24, iv = 8, D5 = 420;
function P5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= rv ? !0 : e < t && s > iv ? !1 : null;
}
const cv = (e, t) => e === void 0 ? t : e, uv = { me: 1, people: [] }, qn = ds({
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
  people: uv,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Ln("journal.activity", !0),
  wide: !1,
  sideMini: Ln("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Al("journal.activity", () => qn.activity);
Al("journal.side.mini", () => qn.sideMini);
const hr = "journal.viewer.";
function dv(e, t, n) {
  try {
    const a = n.getItem(hr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function fv(e, t, n) {
  try {
    n.setItem(hr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function So(e, t, n = window.localStorage) {
  const a = I(dv(e, t, n));
  return he(a, (s) => fv(e, s, n), { deep: !0 }), a;
}
const hv = {
  key: "dock-all",
  class: "dock-all"
}, mv = {
  key: "runs-head",
  class: "dock-runs-head"
}, pv = { class: "dock-runs-title" }, gv = { class: "dock-runs-chips" }, vv = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var M, p;
    const t = e, n = Dp(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = Ee(Te), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(T, O) {
      i.value = { ...i.value, [T.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, T.id]);
      const A = await rn(O, { id: T.target_id }, l.environment);
      (A == null ? void 0 : A.ok) === !1 && (r.value = new Set([...r.value].filter((J) => J !== T.id)), i.value = { ...i.value, [T.id]: `Could not close this card: ${A.error}` });
    }
    const d = L(
      () => L0(
        t.items.filter((T) => !r.value.has(T.id)),
        n.value,
        a.value
      )
    ), f = L(
      () => N0(
        d.value.filter((T) => ka(T, zt)),
        n.value
      )
    ), m = L(() => d.value.filter((T) => !f.value.includes(T) && !ka(T, zt))), g = L(() => f.value.filter((T) => !yt(T))), y = So(`dock-size:${((M = qn.identity) == null ? void 0 : M.root) || location.host}`, null), $ = (T) => y.value ? y.value.collapsed && !y.value.opened.includes(T.id) : t.collapsed, k = L(() => d.value.some($)), R = L(() => (s.value = D0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some($));
    function F() {
      y.value = { collapsed: !k.value, opened: [] };
    }
    function Y(T) {
      var A;
      if (!$(T)) return;
      const O = (A = y.value) != null && A.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...O, T.id] };
    }
    const D = So(`dock-folded:${((p = qn.identity) == null ? void 0 : p.root) || location.host}`, {}), b = (T) => {
      var O;
      return !!((O = zt(T.type)) != null && O.folds) && cv(D.value[T.id], ka(T, zt) || t.folded);
    };
    function x(T) {
      D.value = { ...D.value, [T.id]: !b(T) };
    }
    function S(T) {
      D.value = { ...D.value, ...Object.fromEntries(f.value.map((O) => [O.id, O.id !== T.id])) }, o.value = !0;
    }
    function C() {
      D.value = Object.fromEntries(Object.entries(D.value).filter(([T]) => !f.value.some((O) => String(O.id) === T))), o.value = !1;
    }
    function _(T) {
      a.value = /* @__PURE__ */ new Set([...a.value, T.id]);
    }
    function B(T) {
      a.value = new Set([...a.value].filter((O) => O !== T.id));
    }
    return (T, O) => (c(), H(Yo, {
      tag: "div",
      name: "dock",
      duration: P(cr),
      class: "dock-stack"
    }, {
      default: j(() => [
        d.value.length > 1 ? (c(), h("div", hv, [
          N(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: F
          }, {
            default: j(() => [
              Q(w(k.value ? "Open all" : "Collapse all"), 1),
              N(kt, {
                open: !k.value
              }, null, 8, ["open"])
            ]),
            _: 1
          })
        ])) : E("", !0),
        (c(!0), h(V, null, ee(m.value, (A) => (c(), H(Mo, {
          key: A.id,
          item: A,
          class: Z({ timed: P(yt)(A) }),
          leaving: P(yt)(A) && !a.value.has(A.id),
          folded: b(A),
          collapsed: $(A),
          refusal: i.value[A.id],
          onOpen: (J) => Y(A),
          onFold: (J) => x(A),
          onUndock: (J) => u(A, J),
          onMouseenter: (J) => _(A),
          onMouseleave: (J) => B(A)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !k.value ? (c(), h("div", mv, [
          v("span", null, w(f.value.length) + " runs", 1),
          N(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: C
          }, {
            default: j(() => [
              O[1] || (O[1] = Q(" Runs ", -1)),
              N(kt, { open: "" })
            ]),
            _: 1
          })
        ])) : E("", !0),
        (c(!0), h(V, null, ee(R.value ? [] : f.value, (A) => (c(), H(Mo, {
          key: A.id,
          item: A,
          class: Z({ timed: P(yt)(A) }),
          leaving: P(yt)(A) && !a.value.has(A.id),
          folded: b(A),
          collapsed: $(A),
          refusal: i.value[A.id],
          onOpen: (J) => Y(A),
          onFold: (J) => x(A),
          onUndock: (J) => u(A, J),
          onMouseenter: (J) => _(A),
          onMouseleave: (J) => B(A)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        R.value ? (c(), H(ur, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: j(() => [
            N(ye, {
              name: "runs",
              size: 14
            }),
            v("span", pv, w(f.value.length) + " runs", 1)
          ]),
          foot: j(() => [
            v("span", gv, [
              (c(!0), h(V, null, ee(f.value, (A) => (c(), H(lv, {
                key: A.id,
                item: A,
                onClick: (J) => S(A)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: O[0] || (O[0] = (A) => o.value = !0)
            }, {
              default: j(() => [
                O[2] || (O[2] = Q(" Runs ", -1)),
                N(kt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : E("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, j5 = /* @__PURE__ */ K(vv, [["__scopeId", "data-v-fb45f5a5"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Tn = (e) => Math.min(Math.max(e, 0), 1), yv = (e) => {
  const t = Tn(e);
  return t * t * (3 - 2 * t);
}, mt = (e, t, n) => yv((e - t) / (n - t));
function q5(e) {
  const t = Tn(e), n = Tn((t - 0.12) / 0.76) * wt.shuffles, a = Math.min(Math.floor(n), wt.shuffles - 1), s = n - a, o = mt(s, 0.26, 0.38) * (1 - mt(s, 0.76, 0.96)), l = mt(s, 0.38, 0.76), r = mt(t, 0, 0.12) * (1 - mt(t, 0.88, 1)), i = mt(s, 0.2, 0.34) * (1 - mt(s, 0.84, 1)), u = Math.sin(Math.PI * Tn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / wt.shuffles, lift: wt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function F5(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const _o = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, W5 = (e) => _o[e] ?? _o.butler, Ms = 2400, bv = 0.05;
function wv({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, bv), l = Math.min(t + Ms * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function H5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function kv(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function z5(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const U5 = (e, t) => ({ ...e, stretch: t.stretch }), V5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, mr = (e, t) => t >= (e.least ?? 0);
function G5(e, t, n) {
  if (!mr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const K5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), xv = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Eo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), $v = (e) => e.right > e.left && e.bottom > e.top;
function Y5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(xv)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Eo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Eo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), $v(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function pr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const g = t[d] - e[d];
      if (Math.abs(g) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[d]) / g, $ = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(y, $)), r = Math.min(r, Math.max(y, $));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
  }
  return a;
}
const Se = {
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
  phone_call: { frames: 108, fps: 12, poof: [0, 0.06], above: 0.7, drop: [0.015, 0.055], settle: [0.055, 0.12], squash: 0.24, wobbles: 3, reach: [0.13, 0.2], lift: [0.2, 0.28], finger: [0.28, 0.33], dial: [0.33, 0.42], turn: 250, back: [0.42, 0.5], release: 0.25, talk: [0.5, 0.72], nods: 3, hang: [0.72, 0.84], goes: [0.92, 1], seated: { finger: [0.28, 0.33], dial: [0.33, 0.42], back: [0.42, 0.5], reach: [0.13, 0.2], lift: [0.2, 0.28], beside: 1.2, behind: 0.95, wide: 0.82, turn: 45, lean: 20, backLean: 8 } },
  // a question asked: it raises a sign with a question mark on a stick over its head and waggles it
  ask_sign: { frames: 42, fps: 12, raise: [0, 0.22], waggle: [0.22, 0.78], waggles: 3, lower: [0.78, 1] },
  // a report: it brings the rolled scroll up before its chest over `raise`, a roller in each hand, the free hand's on top; pulls the
  // rollers apart over `unrolls`, the written side toward itself and the parchment's plain back to the viewer (figure.js SCROLL); reads
  // it `lines` lines down, its head going slowly along each; rolls it closed between its hands over `rolls` and lowers it over `lower`
  scroll: { frames: 96, fps: 12, raise: [0, 0.09], unrolls: [0.09, 0.22], rolls: [0.85, 0.93], lower: [0.93, 1], lines: 3 },
  // a task finished, a job well done: standing, it brings its hands together before its chest over `together`, rubs them round each
  // other `rubs` times, slowly, a stroke and a half a second at most, nodding a little with each, and lowers them over `apart`; `puffs`
  // small puffs rise from the hands once each over `puff`, with `sparkles` sparkles among them (chat/act/HandRub.vue)
  hand_rub: { frames: 48, fps: 12, together: [0, 0.12], rubs: 2, apart: [0.88, 1], puff: [0.2, 0.9], puffs: 2, sparkles: 1 },
  // stopping to think at the laptop (figure.js type_ponder), under the thought cloud, its dots pulsing three times a loop
  type_ponder: { frames: 24, fps: 6, pulse: 4 / 3 },
  // The thinking act, now and then while the agent thinks (figure.js thinkingClip, reactions.js thinkingAct), in its three plays. With
  // the cloud: it raises its finger to its cheek over `into`, tilting its head up, swaying `sways` times; three puffs rise from its head
  // over `puffs` into a small thought cloud over it, held over `cloud`, its three dots pulsing one after another, `pulse` seconds round
  // (chat/FigureAct.vue), and over `rise` its hand comes away. With the bulb: over `rise` the finger comes up, "got it", the light bulb
  // over the head (figure.js LIGHT_BULB) appears over `appears`, switches on over `lights`, glows, goes out over `fades` and is gone over
  // `goes`. "ponder" has both, the bulb at its end; "think_cloud" the cloud alone, its hand going down; "got_it" the bulb alone.
  ponder: { frames: 84, fps: 12, into: [0, 0.1], puffs: [0.06, 0.24], cloud: [0.06, 0.72], pulse: 1.2, sways: 2, rise: [0.72, 0.8], appears: [0.75, 0.78], lights: [0.79, 0.82], fades: [0.9, 0.96], goes: [0.95, 1] },
  think_cloud: { frames: 66, fps: 12, into: [0, 0.12], puffs: [0.07, 0.29], cloud: [0.07, 0.86], pulse: 1.2, sways: 2, rise: [0.86, 1] },
  got_it: { frames: 30, fps: 12, rise: [0, 0.25], appears: [0.05, 0.15], lights: [0.18, 0.26], fades: [0.72, 0.88], goes: [0.86, 1] },
  // a fact or a reminder: a small cabinet grows beside it, its drawer slides out, it files a card in it and the drawer shuts
  file_card: { frames: 42, fps: 12, grows: [0, 0.15], opens: [0.12, 0.28], reach: [0.2, 0.44], filed: [0.44, 0.56], back: [0.56, 0.72], shuts: [0.58, 0.72], sinks: [0.86, 1] },
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
  fume: { frames: 54, fps: 12, crushed: [0, 0.36], mad: [0.36, 0.96], stamps: 6, steam: [0.42, 0.96] },
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
  pogo: { frames: 54, fps: 12, draw: [0, 0.18], bounces: [0.18, 0.62], count: 3, bounce: 0.45, spring: [0.62, 0.82], over: 0.3, release: [0.82, 0.86], drop: [0.82, 1], stick: 0.62, handles: 0.2455 },
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
    turn: [0.25, 0.55],
    aim: [0.25, 0.32],
    shots: [0.33, 0.48],
    count: 2,
    splat: 0.48,
    fly: [0.56, 0.64],
    drops: [0.64, 1],
    back: { limit: 55, margin: 0.25, stride: 0.5 },
    lens: [{ at: [-1.3, -1.6], size: 0.2 }, { at: [0.9, -0.9], size: 0.14 }, { at: [-0.4, 0.2], size: 0.16 }, { at: [1.6, -2.1], size: 0.1 }]
  },
  // a fixed run's bug smashed with a big wooden mallet on the floor the figure stands on (smashPlan): the bug climbs up the back of the
  // floor's box, out of sight behind it, over `emerge`, comes over its top edge onto it over `climb`, and it and the figure walk to meet
  // each other over `walk`, until it is `away` of the picture out on the figure's left (`side`); the figure raises the mallet high before
  // its head over `raise` and holds it there for the wind-up until `swing`, swings it down over `swing` and flattens the bug at `blow`,
  // which lies flat and fades over `gone`, and lowers the mallet over `lower`
  bug_smash: {
    frames: 96,
    fps: 12,
    side: 1,
    emerge: [0, 0.09],
    climb: [0.09, 0.16],
    walk: [0.16, 0.38],
    raise: [0.46, 0.58],
    swing: [0.66, 0.72],
    blow: 0.72,
    gone: [0.84, 0.95],
    lower: [0.88, 0.95],
    away: 0.42
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
  disco: { frames: 96, fps: 12, beats: 8, ball: 0.24, clear: 0.08, tie: 0.1, far: 2.2 },
  // leaning against a wall to rest (perches.js leanSpot): the wall `wall` of the picture out from its middle, the hand flat against it
  // `contact` of the figure's units above its feet; the whole body tilted `tilt` degrees toward it from the feet, its weight on that hand;
  // the other hand on its hip at `hip` (across, forward, up); the ankles crossed, the inner leg turned in `inner` degrees and the outer
  // `outer`, swung `over` degrees before the inner so its foot crosses over in front
  lean: { wall: 0.33, contact: 1.95, tilt: 16, hip: [0.62, 0.05, 1.5], inner: 20, outer: 42, over: 12 },
  // coming down on a parachute, swaying `sway` degrees under it, its canopy (figure.js canopyOf) `width` of the picture across with its
  // rim `above` of the picture over the eyes, the lines running from the rim down to the hands
  chute: { frames: 24, fps: 8, sway: 8, width: 0.66, above: 0.5 },
  // compacting: a box appears, it hops into it and the box shrinks with it inside; once the compaction is over the box grows back and
  // pops in a puff, and it jumps out. Its frames are an intro, a held stretch looped while the compaction lasts, and an outro
  pack_box: { intro: 36, hold: 24, outro: 26, fps: 12, appears: [0, 0.3], hop: [0.3, 0.62], into: [0.55, 0.88], shrinks: [0.86, 1], grows: [0, 0.3], pops: 0.38, leap: [0.38, 0.88], small: 0.5 },
  // compacting: a press comes down onto its head, it holds it up with both hands and is squashed under it, and springs back once it lifts
  press: { intro: 24, hold: 24, outro: 24, fps: 12, lowers: [0, 0.55], squashes: [0.5, 1], frees: [0, 0.3], springs: [0.25, 0.7], lifts: [0.3, 1], flat: 0.42 },
  // compacting: it vacuums up the words flying in from beside it, the canister on the floor and the nozzle in its hand
  vacuum: { intro: 10, hold: 40, outro: 10, fps: 10, words: 5 }
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Mv = (e) => e * e * (3 - 2 * e), _e = (e, [t, n]) => Mv(tn(e, t, n)), Sv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], rt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function _v(e) {
  return Sv.map(() => {
    const t = Mn(rt.speed, e), n = Mn(rt.angle, e) * Math.PI / 180, a = Mn(rt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(rt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Ev = _v(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Av(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * rt.gravity * (t[2] - rt.floor))) / rt.gravity;
}
function J5(e, t, n = Ev) {
  const a = Se.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Av(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= rt.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const Z5 = (e, t) => e && Se[e.name] ? { name: e.name, u: t / e.frames } : null;
function X5(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, l) => o + l, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, l] of n.entries()) {
    if (s <= l || o === n.length - 1) {
      const r = l > 0 ? Math.min(s / l, 1) : 1;
      return { index: o, s: r, height: e[o] * 4 * r * (1 - r) };
    }
    s -= l;
  }
  return { index: 0, s: 1, height: 0 };
}
const Q5 = () => Array.from({ length: Se.pogo.count }, (e, t) => Se.pogo.bounce * (t + 1) / Se.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function e4(e, t, n) {
  const { away: a, side: s } = Se.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function t4(e, t, n) {
  const a = Se.bug_smash, s = _e(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Lt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Lt.tall * n * (1 - _e(t, a.emerge)),
      turn: 90 * (1 - _e(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - _e(t, a.gone)
    }
  };
}
function n4(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = wv({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function a4(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function ts(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ie.margin, l = ((e.along - Ie.margin + e.way * Ie.speed * n / a) / s % 2 + 2) % 2, r = Ie.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function Cv(e, t) {
  const n = Se.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = kv(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function s4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Se.bug_shot, { frame: l, bug: r, shot: i } = Cv(n, e.length), u = e.map((R, F) => ({ ...ts(R, t, Math.min(n / o.fps, Rn(F).shot)), shot: F < i })), d = _e(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], g = e.map((R, F) => ({ bug: R, index: F, seconds: n / o.fps - Rn(F).shot, spot: ts(R, t, Rn(F).shot) })).filter((R) => R.seconds >= 0), y = g.flatMap((R) => {
    const F = (s == null ? void 0 : s.get(R.index)) ?? Bv(R.bug, t, R.spot, s ? [] : a);
    return s == null || s.set(R.index, F), s && Lv(F, R.seconds, a), Nv(F, R.seconds, a);
  }), $ = g.filter((R) => Rv(R.bug)).map((R) => ({ seconds: R.seconds, from: R.spot })), k = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: k }, slush: y, camera: $ };
}
function Rn(e) {
  const t = Se.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function o4(e, t, n, a) {
  const { limit: s, margin: o } = Se.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = Rn(d), m = ts(u, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), $ = Math.abs(m.x - i) >= g ? i : m.x + y * g, k = y > 0 ? Math.max(i, Math.min($, r)) : Math.min(i, Math.max($, l)), R = { from: i, to: k, begin: f.walk, end: f.aim };
    return i = k, R;
  });
}
function l4(e, t, n) {
  var o;
  const a = Se.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * _e(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Ov = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Tv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Rv = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function Iv(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += $e.step) {
    const d = Math.min(u + $e.step, l.t), f = nn(e, d), m = pr(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = nn(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function Bv(e, t, n, a = []) {
  const s = Tv(e.along + 1), [o, l] = Ov[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...Iv(d, t, a) };
  });
}
function Lv(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += $e.step) {
      const l = Math.min(o + $e.step, s), r = pr(nn(a, o), nn(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function Nv(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...nn(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function r4(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = Se.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = _e(e, [0, u]), m = _e(e, [u, u + d]);
  return l.map((g) => {
    const y = { x: a.x + g.at[0] * t, y: a.y + g.at[1] * t };
    return {
      x: n.x + (y.x - n.x) * f,
      y: n.y + (y.y - n.y) * f,
      r: g.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function i4(e, t, n, a, s) {
  const { sway: o, above: l } = Se.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = ($) => {
    const [k, R] = [$.x - e.at.x, $.y - e.at.y];
    return { x: r.x + k * u - R * d, y: r.y + k * d + R * u };
  }, [m, g] = [...n].sort(($, k) => $.x - k.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map(($, k) => ({ from: $, to: k < y.length / 2 ? m : g })) };
}
const c4 = (e, t) => _e(t, e.grows) * (1 - _e(t, e.sinks));
function Fn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function u4(e, t) {
  const n = Se[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Fn(n, t), l = 1 - (1 - n.small) * _e(a, n.shrinks) * (1 - _e(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Fn(n, t), o = n.flat * _e(a, n.squashes) * (1 - _e(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * tn(s, ...n.springs)) * (1 - tn(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const d4 = (e) => e === "pack_box";
function f4(e) {
  const { into: t, out: n } = Fn(Se.rope_swing, e);
  return 1 - _e(t, [0, 1]) * (1 - _e(n, [0, 1]));
}
function h4(e) {
  const t = Se.rope_swing, { into: n, out: a } = Fn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return _e(n, [0, 1]) * (1 - _e(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Dv = { after: 3 }, Ss = 10, Pv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, jv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, qv = { weight: 19 }, gr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Fv = { every: 120 }, vr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, yr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Wv = {
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
}, un = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Ss }), ne = (e, t, n = {}) => un(e, "clip", t, n), xa = (e, t, n = {}) => un(e, "look", t, n), Ao = (e, t, n = {}) => un(e, "gaze", t, n), me = (e, t, n = {}, a = {}) => ({ ...un(e, "pick", t, n), ...a }), we = (e) => un("nothing", "nothing", e, {}), Hv = 120, zv = 300, $a = (e, t) => ({ ...ne(e, t), cooldown: zv }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Uv = () => [ne("joy", 2)], pt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), gt = (e) => ({ ...e, cooldown: Pv[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: jv[e.name] }), ea = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...gt(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...gt(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...le("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), we(1)]),
  ...le("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...le("sin_fixed", { cooldown: 300 }, [ne("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...le("sin_committed", { cooldown: 300 }, [ne("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...le("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), we(7)]),
  ...le("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...le("reported", { cooldown: 90 }, [Ao("read", 3), ne("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [Ao("read", 3), we(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), we(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, Uv()),
  ...le("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...le("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...le("launched", { cooldown: 300 }, [ne("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...le("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), we(69)]),
  ...le("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), we(2)]),
  ...le("refused", { cooldown: 20 }, [ne("shake", 1), we(1)]),
  ...le("work_done", { cooldown: 120 }, [ne("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...le("pondering", { cooldown: [30, 60] }, [me("ponder", 1)]),
  ...le("thought_cloud", { cooldown: 90 }, [me("cloud", 1)]),
  ...le("light_bulb", { cooldown: 150 }, [me("bulb", 1)]),
  ...le("answered", { cooldown: 15 }, [xa("amused", 3), we(2)]),
  ...le("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...le("long_walk", { cooldown: 90 }, [ne("stumble", 3), we(22)]),
  ...le("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), we(13)]),
  ...le("typing", { cooldown: 60 }, [xa("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Wv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [xa(t, 1)])),
  ...Object.entries(vr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ne(a, 1, { voices: [e] })])[0])),
  ...Object.entries(yr).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ne(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
    pt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    pt("rest", 3, 180, 120),
    pt("yawn", 2, 60, 60),
    pt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    pt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    pt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    pt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Wt(gt(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Wt(gt(ne("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: Hv }, [$a("search", 3), { ...$a("binoculars", 2), when: { home: !0 } }, { ...$a("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...le("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [me("writing", 12, { state: "writing" }), me("reading", 12, { state: "reading" }), me("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...gt(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ne("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [Wt(gt(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [me("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: gr.build.cooldown }, [me("unit", qv.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...me("hang", 1, { hands: !0, free: !0 }), cooldown: Fv.every }, me("stand", 5)]),
  // a digit a blow's dust lets out
  ...le("digit", {}, [me("0", 1), me("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...le("roam", {}, [
    me("rest", 35, {}, { stay: [25, 60] }),
    me("seat", 15, {}, { stay: [15, 40] }),
    me("edge", 25, {}, { stay: [8, 20] }),
    Wt(me("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    me("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    me("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    me("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    me("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    me("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Wt(gt(me("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...le("laptop", {}, [me("seat", 6, {}, { stay: [60, 150] }), me("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...le("ledge_at", {}, [me("middle", 2, {}, { along: 1 / 2 }), me("third", 1, {}, { along: 1 / 3 }), me("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...le("composed_as", {}, [
    me("facing", 4, {}, { turn: 0, leans: 0 }),
    me("turned_left", 1, {}, { turn: 335, leans: 0 }),
    me("turned_right", 1, {}, { turn: 25, leans: 0 }),
    me("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    me("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], br = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), wr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Vv = (e) => Array.isArray(e) ? e[0] : e, Gv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Kv = (e) => ea.some((t) => t.when.moment === e);
function Yv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || wr(d).every(([f, m]) => n(f) >= Vv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ea.filter((d) => br(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Dv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function He(e, t) {
  const n = Yv(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (kr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function kr(e, t, n) {
  var a;
  for (const [s, o] of wr(t)) (a = e.memory) == null || a.set(s, e.now + Gv(o, n));
}
function m4(e, t, n) {
  kr(e, ea.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const p4 = (e) => Object.values(gr).find((t) => br(t.when, e)) ?? null, Jv = (e, t, n) => n - t <= (e.lifetime ?? Ss), g4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || mr(e.clip, t));
class xr {
  constructor(t) {
    this.card = t;
  }
  isTest() {
    var t;
    return !!((t = this.card.guesses) != null && t.test);
  }
  isBuild() {
    var t;
    return !!((t = this.card.guesses) != null && t.build);
  }
  isUpload() {
    var t;
    return !!((t = this.card.guesses) != null && t.upload);
  }
}
const ns = {
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
}, v4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), $r = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), y4 = {
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
}, b4 = 120, Zv = 20, w4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Zv), Xv = (e) => ns[e] || ns.idle, k4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Mr = "airborne", Qv = "landing", ey = "travelling", Sr = "grounded", x4 = ({ airborne: e, landing: t, trip: n }) => e ? Mr : t ? Qv : n != null && n.started ? ey : Sr;
function $4(e, t) {
  var s;
  const n = ty(e, t);
  return e.mode === Sr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function ty(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Mr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...ny(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : Xv(u), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function ny(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const as = (e) => e.outcome, ay = "plugin:code-commandments:sins:", Co = (e) => e.type === "plugins.card" && e.markKey.startsWith(ay), sy = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Co(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Co(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], M4 = (e, t) => e.filter((n) => n.author === "user" && Pn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Pn(n.read_at), card: Hl(n) })).sort((n, a) => n.time - a.time), Oo = { user: "reacted", agent: "agent_reacted" };
function S4(e, t) {
  return e.filter((n) => Oo[n.author] && Mt(n) > t).map((n) => ({ beat: `${Oo[n.author]}:${n.emoji}`, time: Mt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const oy = [.../* @__PURE__ */ new Set([...Object.values(vr).flatMap((e) => Object.keys(e)), ...Object.keys(yr)])];
function _4(e, t) {
  return e.filter((n) => n.author === "agent" && Mt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = oy.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Mt(n), card: Hl(n) })).sort((n, a) => n.time - a.time);
}
const ly = (e) => new xr(e).isTest(), Wn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[as(e)] || "";
}, ry = 1800, iy = (e, t) => {
  if (Wn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Wn(n) !== "finished" && Number(e.time) - Number(n.time) <= ry ? "tests_fixed" : "tests_passed";
};
function E4(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(ly), s = a.filter((r) => Wn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Wn(r))), o.map((r) => ({ beat: iy(r, s), time: Number(r.time), card: r.key }));
}
function A4(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(as(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: as(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const C4 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: Mt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function O4(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function T4(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function R4(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = sy.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function _s(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const To = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function cy(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    _s(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function I4(e, t, n, a = {}) {
  const s = He({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Kv(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function B4(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const Ro = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function L4(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, r = o % Re.sweep, i = Re.sweep - Re.returnSeconds, u = Ro((r - i) / Re.returnSeconds), d = r <= i ? Ro(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Io = 3, _r = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Bo = 12, N4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function D4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!_r(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Io ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Bo) / Bo, lasts: Io } };
}
const P4 = (e) => e.posture === "hang" && !_r(e.face), uy = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), dy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function j4(e, t, n) {
  return uy.has(e) ? 1 / 0 : !dy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Er(n - t.began, t.share) - Ze.lead, 0);
}
const fy = 5;
function q4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= fy ? { beat: "long_walk", time: n } : null };
}
const hy = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function F4(e, t, n, a, s = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = He({ moment: "spell", state: e, tally: s }, a), [l, r] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const W4 = (e, t, n) => t && n < t.until && $r.has(e.state) ? { state: t.state, since: t.began } : e, Ze = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Er = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function H4(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Er(o, e.share);
  return s ? { eager: my(t, l), moment: null } : l > Ze.lead ? { eager: t, moment: null } : l < Ze.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ze.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ze.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = He({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function my(e, t) {
  return e.on && t > Ze.lead + Ze.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ze.lead && t >= Ze.least ? { ...e, on: !0, calm: !1 } : e;
}
const py = 1, gy = { look: "look", gaze: "gaze" };
function vy(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = He({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [gy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const yy = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => He({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), by = (e, t, n, a, s, o = 0) => He({ moment: "jump", high: e > py * t, memory: a, now: s, room: o }, n).name === "backflip", wy = { work: ["building"], idle: ["standing"] };
function z4(e, t, n, a) {
  const s = ns[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(wy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), $r.has(e) ? { moments: o, began: n || a } : (n && a - n >= hy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function ky(e, t, n) {
  return !He({ moment: "pondering", memory: e, now: t }, n) || !He({ moment: "thought_cloud", memory: e, now: t }, n) ? null : He({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Lo = { pondering: ky };
function U4(e, t, n, a, s, o) {
  if (Lo[e.beat]) {
    const r = Lo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = vy(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Ss && { lifetime: l.lifetime } } } : null;
}
function V4(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = yy(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const G4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function K4(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function Y4(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const J4 = (e, t) => !!(e != null && e.watches) && !t.once, Z4 = 10, X4 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || Jv(a, a.queuedAt, n)), Q4 = (e, t) => t ? null : e[0] ?? null;
function ex(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const tx = (e, t) => !t.during || !e.some((n) => n.during === t.during), xy = 2 * Math.PI, $y = 500;
function nx(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / $y, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = xy * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, $ = (u ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? Sy(g, t, n, m, s) : Ey(g, t, n, m) : t) ?? g, k = $ != null && $.behind && $.mood === "reading" ? My(e.point, $, n, l, s) : $;
  return { point: k ?? null, toward: k ? { x: k.x - n.x, y: k.y - n.y } : null, amount: f, at: a };
}
function My(e, t, n, a, s) {
  const o = (_) => _ * 180 / Math.PI, l = (_) => o(Math.atan2(Math.sin(_ * Math.PI / 180), Math.cos(_ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, y = g + l(u - g), $ = Math.min(Math.max(a / 1e3, 0), 0.1), k = Re.turnSpeed * $, R = f ? g + Math.min(Math.max(y - g, -k), k) : y, F = f ? e.readingFollow + m : R, Y = F + (R - F) * (1 - Math.exp(-$ / Re.followSeconds)), D = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, b = o(_s(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), x = Math.min(Math.max(b, -D.up), D.down), S = Re.tipSpeed * $, C = f ? e.readingPitch + Math.min(Math.max(x - e.readingPitch, -S), S) : x;
  return { ...t, readingYaw: R, readingFollow: Y, readingPitch: C, readingFacing: r };
}
function Sy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (F) => {
    const { yaw: Y, pitch: D } = _s(F.x - n.x, s, n.y - F.y, o);
    return { yaw: Y, pitch: Math.min(Math.max(D, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [To(r(e)), To(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, $, k] = i.map((F, Y) => m * F + g * u[Y]), R = s * y / $;
  return { ...t, x: n.x + R, y: n.y - cy(R, s, -Math.asin(Math.min(Math.max(k, -1), 1)), o) };
}
const _y = 0.15;
function ax(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= _y;
}
function Ey(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Ay = (e) => !(e != null && e.on);
function sx(e, t, n) {
  if (Ay(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ye = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ma = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), No = (e) => e * e * (3 - 2 * e);
function Cy(e) {
  if (e < 0 || e >= Ye.seconds) return null;
  const t = Ma(e, ...Ye.flicker), n = Math.floor(t * Ye.flickers * 2) % 2 === 0, a = e < Ye.flicker[1] ? n ? 0.35 + 0.5 * t : Ye.dim : 1;
  return { strength: 1 - No(Ma(e, ...Ye.fade)), lit: a, white: e < Ye.flash[0] ? 0 : 1 - No(Ma(e, ...Ye.flash)) };
}
const ox = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function lx(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Cy(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ye.signs[e.tone], ...a } };
}
function rx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function ix(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function cx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ot = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, ux = { behind: 39, figure: 40, ahead: 41 }, Oy = "[data-figure-pile]", Ty = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, dx = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, fx = (e) => e === "amber" ? In.phases : 1;
function hx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const mx = Object.keys(Ty), ze = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function px(e) {
  const t = ze.least + Math.floor(e() * (ze.most - ze.least + 1));
  return Array.from({ length: Math.min(t, ze.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * ze.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Ut(ze.start, e), l = Ut(ze.reach, e);
    return {
      text: He({ moment: "digit" }, e).name,
      x: a * o,
      y: ze.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Ut(ze.moveMs, e)),
      fadeMs: Math.round(Ut(ze.fadeMs, e))
    };
  });
}
const Sa = { high: 3, gap: 1 };
function gx(e) {
  const t = Math.floor(e / Sa.high);
  return { left: -(ot.inside + ot.width / 2 + t * (ot.width + Sa.gap)), up: e % Sa.high * (ot.height - ot.top) };
}
const Ry = (e, t, n) => He({ moment: "unit", memory: e, now: t }, n) !== null, Iy = { after: 5 }, By = (e) => e.filter((t) => t.active && (t.process || t.watch) && new xr(t).isBuild());
function vx(e, t, n) {
  const a = By(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Iy.after ? s : null;
}
function yx(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Ry(n, a, s) } : null;
}
const Do = { ahead: 140, up: 70 };
function bx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Do.ahead, y: a - Do.up } } : o ? { at: { x: n(o), y: a - o.up - ot.height } } : t ? { at: null } : null;
}
const _a = { least: 4e3, most: 1e4 }, Ly = (e) => _a.least + e() * (_a.most - _a.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function wx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Ly(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), a = o + vt.ms;
  }
}
const kx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), xx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Ar = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), $x = new Set(ea.filter((e) => Ar.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Ny = (e) => e.some((t) => t.state === "built"), Mx = (e, t) => Ny(t) ? e.filter((n) => !Ar.has(n.beat)) : e, ct = { reach: 40, room: 6 }, Dy = (e, t) => t <= e - ct.reach + 2, Sx = (e, t, n) => Dy(e, n) ? t - ct.reach : e - ct.reach - ct.room, _x = (e, t, n, a) => a > 0 && t < e && t + ct.reach >= e - 2 ? Math.min(n, Math.max(e, t + ct.reach)) : e, Ea = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Ex = (e) => Ut(e() < Ea.longShare ? Ea.long : Ea.short, e), Py = 2 * ot.width;
function Ax(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Py ? o : e + (o - e + s / 2) % s;
}
const jy = 60, Cx = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= jy, Po = "[data-figure-home]", dn = () => {
  var t;
  const e = document.querySelector(Po);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Po)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, qy = "[data-figure-docked-bars]", Fy = "[data-figure-chat-foot]", Wy = [0.85, 0.6, 0.35, 0.15], Hy = ["question", "waiting", "suggestion"], Ox = (e, t) => Hy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Tx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const zy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Uy = "[data-figure-newest]";
function Cr() {
  var a, s;
  const e = (a = dn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Uy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Es(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function sn(e, t, n = Cr()) {
  if (!e || !n) return !0;
  const a = et(e, t), s = na(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + Oe.top * t.size, bottom: a.top + Oe.bottom * t.size }, l = wt.gap;
  return !ta(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Rx(e, t, n, a = Cr()) {
  if (!a || sn(t, e, a)) return null;
  const s = na(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ct(), i = t.posture === "stand" ? Cs * e.size : Dr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - wt.gap - l, a.right + wt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && sn(m, e, a) && wb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Aa = 0.26, Or = 0.54, Vy = 1.25 / 5.4, fn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Aa, travels: "stand" },
  lounge: { drop: Aa, travels: "stand" },
  composed: { drop: Aa, travels: "stand" },
  hang: { drop: Or, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ix = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Vy * Math.cos(t * Math.PI / 180),
  y: 1 - n - Or
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Gy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Bx = (e, t) => (e === "sit" ? Gy.has(t) : Yt.has(e)) ? e : "stand";
function Lx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Nx = 0.25, Dx = (e, t) => Yt.has(e) && fn[t].drop === 0, Tr = 2, Ky = 90, Yy = 180, Jy = 140, Zy = 280, Xy = 420, Qy = 0.25, eb = 290, tb = 600, nb = "cubic-bezier(0.2, 0.7, 0.4, 1)", ab = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ca = 5;
function Hn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ca) return null;
  (l || r) && (o = Math.max(o, Tr));
  const g = o > 1, y = Math.abs(t.x - e.x), $ = y < Ca ? 0 : y / (Ky * o) * 1e3, k = Math.min($, g ? Jy : Yy), R = Math.abs(t.y - e.y), F = t.y < e.y, Y = F && !m && by(R, n, i, u, d, f), D = F ? Xy + Math.min(R, 400) * Qy : Math.sqrt(2 * R / Ms) * 1e3, b = {
    x: t.x,
    y: t.y,
    ms: R > Ca ? Y ? tb : D : 0,
    lead: Y ? eb : F ? Zy : 0,
    easing: F ? nb : ab,
    hopping: !0,
    clip: Y ? "backflip" : F ? "jump" : "fall"
  }, x = { x: t.x, y: t.y, ms: $ + k, lead: 0, easing: "linear", ramp: k, ...g ? { clip: "run" } : {} }, S = m ? sb(t, n) : b, C = F && !a ? [{ ...x, y: e.y }, S] : [{ ...b, x: e.x }, x];
  return { way: Math.sign(t.x - e.x) || 1, legs: C, lands: !s, pace: o, running: g };
}
const sb = (e, t) => ({ x: e.x, y: e.y, ms: Se.pogo.frames / Se.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), ob = (e, t) => e.postures.includes(t) ? t : e.postures[0], Px = (e, t, n) => e.posture === "walk" && n ? "walk" : ob(e.clip, t), et = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - fn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, ta = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Es = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ct() {
  var t;
  const e = (t = dn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const _n = 0.5, jo = 20;
function jx(e, t, n = Ct()) {
  const a = et(e, t);
  return a.left >= n.left + jo && a.right <= n.right - jo;
}
function As(e, t, n = Ct()) {
  const a = et(e, t), s = a.right - a.left, o = na(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - _n && r <= n.right + _n && a.top >= n.top - _n && i <= n.bottom + _n;
}
const zn = [0.35, 0.5, 0.65], Un = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Oe = { left: zn[0], right: zn.at(-1), top: Un[0], bottom: Un.at(-1) }, lb = 0.24;
function na(e) {
  if (e.posture === "stand") return { left: Oe.left, right: Oe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + lb * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Oe.left, t), right: Math.max(Oe.right, t) };
}
function rb(e, { size: t }, n = Ct()) {
  const a = na(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Cs = (Oe.right - Oe.left) / 2 + 0.08;
function qx(e, t) {
  return e === "hang" ? Oe : { ...Oe, bottom: Math.min(Oe.bottom, 1 - t - fn[e].drop) };
}
const ib = "[data-figure-agent]";
function Rr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !Es(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Ir = (e) => Un.flatMap(
  (t) => zn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Os(e, t, n = "") {
  if (!sn(e, t)) return zn.length * Un.length;
  const a = et(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(zy)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && ta(s, i) && Es(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return Ir(s).filter(([r, i]) => l(r, i) || Rr(r, i, n)).length;
}
function cb(e, t) {
  const n = et(e, t);
  return Ir({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Rr(a, s, "", ib)).length;
}
const qo = 4;
function Fx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = qo; o <= s; o += qo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!cb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = Ct(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => As(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Os(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Br = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), ub = [0.5, 0.25, 0.75], db = (e) => Br(e.getBoundingClientRect(), ub), Lr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, fb = Cs, hb = (e, t, { size: n }, a = fb) => Nr(e, Lr[t], a * n, "stand");
function Nr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const mb = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Dr = 0.1, pb = (e, t, { size: n }) => Nr(e, mb[t], Dr * n, "sit"), gb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Oa = 60;
function Wx(e, t) {
  const n = gb(t);
  return !e.aside || Math.abs(n) >= Oa ? t : n < 0 ? 360 - Oa : Oa;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, vb = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function Hx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = vb(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? yb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function yb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function zx(e, t) {
  const { element: n, edge: a } = aa(), s = ["left", "right"].map((r) => hn(pb(a, r, e), e)).filter((r) => n && As(r, e) && !Os(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function Ux(e, t, { size: n }) {
  const a = (Oe.right - Oe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Pr } : e;
}
const Pr = 7;
function jr() {
  const e = [...document.querySelectorAll(Oy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function bb(e, t) {
  const n = et(e, t), a = n.right - n.left;
  return { left: n.left + Oe.left * a, right: n.left + Oe.right * a, top: n.top + Oe.top * a, bottom: n.bottom };
}
function wb(e, t) {
  const n = jr();
  return !n || !ta(bb(e, t), n);
}
const kb = 4;
function aa() {
  const e = mn(), t = jr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > kb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Pr - n, 0) } };
}
const Vx = ({ size: e, below: t }) => (1 - t) * e;
function hn(e, t) {
  const n = Ct(), { size: a, below: s } = t, o = fn[e.posture].drop * a;
  return { ...rb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ss = (e, t) => Object.keys(Lr).map((n) => hn(hb(e, n, t), t)), Ts = (e, t) => Br(e, Wy).map((n) => hn(n, t)), qr = (e, t, n) => on(e, t, n) ?? e[0];
function Gx(e, t) {
  const { element: n, edge: a } = aa();
  return { ...qr(ss(a, e), e, t), view: null, on: n };
}
function Kx(e, t, n, a) {
  const { element: s, edge: o } = aa(), l = (a ? ss(o, t) : [...ss(o, t), ...Ts(o, t)]).filter(
    (u) => !ta(et(u, t), e)
  ), r = on(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !Os(r, t) ? r : on(l, t, n);
  return i && { ...i, view: null, on: s };
}
function mn() {
  var a;
  const e = dn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(qy);
  if (!t) return { ...sa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Fo = { within: 2 };
function Yx(e) {
  const { element: t, docked: n, edge: a } = mn();
  if (!n || e.on !== t) return !0;
  const s = sa().edge;
  return a.left > s.left + Fo.within || a.left + a.width < s.left + s.width - Fo.within;
}
const xb = "[data-figure-closing]";
function Jx() {
  var n;
  const { element: e, docked: t } = mn();
  return t && !!((n = e.firstElementChild) != null && n.matches(xb));
}
const Fr = "[data-figure-progress]";
function Zx(e) {
  const t = e.querySelector(Fr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Xx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const $b = { across: 300, above: 380, below: 60 };
function Qx(e) {
  const { across: t, above: n, below: a } = $b;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Mb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Mb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Wr = "[data-figure-bar]", os = { back: 144, along: 0.4 };
function e8(e) {
  const { element: t, docked: n, edge: a } = mn(), s = n ? t.querySelector(Wr) : null;
  if (!(s != null && s.querySelector(Fr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...hn({ x: o - os.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function t8(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < os.along * a.size ? t.x + os.along * a.size : e.x, y: e.y, behind: !0 };
}
function n8(e) {
  const t = e.querySelector(Wr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function sa() {
  const e = dn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function a8(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = sa(), i = n === null ? Sb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : hn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Sb(e, t, n, a, s) {
  const o = Ts(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + ot.width < s && i.x + a - ct.reach - ct.room >= l);
  return on(r.length ? r : o, t, n);
}
const _b = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function s8(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Tr));
  const g = (Y) => {
    const D = et(Y, n, fn[Y.posture].travels);
    return { x: D.left, y: D.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Eb(g(e), g(t), g({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [$, ...k] = [e, ...i, t].map(g), R = Hn($, k[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), F = k.slice(1).map((Y, D) => {
    var b;
    return (b = Hn(k[D], Y, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : b.legs.find((x) => x.hopping);
  });
  return R && { ...R, legs: [...R.legs, ...F.filter(Boolean)] };
}
function Eb(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / _b.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Hn(e, n, o.size, { pace: l }) : Hn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function o8(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function l8(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(db(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = aa();
  return { ...qr(Ts(s, t), t, n), view: null, on: a };
}
const Ab = "[data-figure-bubble]", Cb = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Hr = 0;
const qt = () => Zt, Ta = /* @__PURE__ */ new WeakMap();
let Ob = 0;
function Rs(e) {
  return Ta.has(e) || Ta.set(e, `floor-${++Ob}`), Ta.get(e);
}
const Tb = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Rb = () => {
  var e, t;
  return ((t = (e = dn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Ib(e, t) {
  var a;
  const n = (a = e.querySelector(Fy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Bb(e, t) {
  const n = e && Ib(e, t), a = e ? [...e.querySelectorAll(Ab)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Tb(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Rs(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Lb = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Cb ? (t.top - a.top) / s * 1e3 : 0;
};
function zr(e = Zt, t = performance.now()) {
  const n = Ct(), a = Rb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = mn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = sa();
  return u.element && i.push({ id: Rs(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...Bb(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: Lb(e, d, t) }))) });
}
const ls = /* @__PURE__ */ new Set();
function Nb(e) {
  return ls.add(e), () => ls.delete(e);
}
function Db() {
  Ur();
  const e = () => {
    Hr = requestAnimationFrame(e), !document.hidden && (Zt = zr(Zt), ls.forEach((t) => t(Zt)));
  };
  e();
}
function Ur() {
  cancelAnimationFrame(Hr);
}
const Is = 5, Pb = 56, jb = { share: 0.6 }, qb = (e) => -Math.sqrt(2 * Ms * jb.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function r8(e, t = zr().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Rs(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Vr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const u = Nt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || Fb(u, d, o)) && Wb(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Bs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Fb = (e, t, n) => !Bs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function i8(e, t = qt().floors) {
  if (!Bs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Is && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Wb(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && et(e, t).bottom >= a.top ? !1 : As(e, t);
}
function c8(e, t, n, a = qt().floors) {
  const s = Vr(e, n, a);
  if (!e.home) return Hb(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Is ? "dropping" : -l > Pb ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function Hb(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: qb(e.risen) };
  if (!n) return null;
  if (Bs(t) && n.y - t.y > Is) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function u8(e, t, n) {
  const a = Cs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function d8(e, t, n, a = qt().floors) {
  const s = t && Vr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const zb = ["data-type"], Ub = { class: "figure-floor-name" }, Vb = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      v("span", Ub, w(e.floor.type), 1)
    ], 12, zb));
  }
}, Gb = /* @__PURE__ */ K(Vb, [["__scopeId", "data-v-ac620b01"]]), Kb = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Yb = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ve(qt().floors);
    let n = () => {
    };
    return Be(() => {
      n = Nb((a) => t.value = a.floors), Db();
    }), Le(() => {
      n(), Ur();
    }), (a, s) => (c(), h("div", Kb, [
      (c(!0), h(V, null, ee(t.value, (o) => (c(), H(Gb, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, f8 = /* @__PURE__ */ K(Yb, [["__scopeId", "data-v-c8fb9617"]]), Ra = (e) => typeof e == "number" ? e : Date.parse(e);
function h8(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ra(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ra(s.row.created_at) - Ra(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Jb = 3, Ia = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Zb(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ia[n.grouping]) == null ? void 0 : a.call(Ia, e.row, n)) || "";
}
function Xb(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function m8(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Jb ? [Xb(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Zb(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const Qb = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4,
  systemLogs: 5e3
}, ew = 1e3;
function tw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), ew);
  return _t(() => clearInterval(t)), e;
}
const nw = ["datetime", "title"], oa = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = tw(), a = L(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(P(Xl)(e.at, P(n))), 9, nw));
  }
};
function p8(e) {
  const t = ft(), n = t.option("row"), a = I(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function aw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const g8 = (e) => (t) => t.filter((n) => n.id !== e), v8 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), y8 = (e) => (t) => [...t, e], b8 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function w8(e, t = {}) {
  const n = ft(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function k8(e) {
  const t = ft(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const En = /* @__PURE__ */ new Map();
function sw(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function x8() {
  const e = ft(), t = I(null), n = I("");
  async function a() {
    const s = await sw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const ow = { class: "cards-page" }, lw = { class: "cards-bar" }, rw = { class: "cards-count" }, iw = { class: "cards" }, cw = {
  key: 1,
  class: "cards-note"
}, uw = {
  key: 2,
  class: "cards-note"
}, dw = ["data-row", "onClick"], fw = { class: "card-head" }, hw = { class: "card-title" }, mw = { class: "card-foot" }, pw = {
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
    return (a, s) => (c(), h("div", ow, [
      v("div", lw, [
        v("span", rw, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        N(de, Ge({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: j(() => [
            N(ye, {
              name: "plus",
              size: 12
            }),
            Q(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      v("div", iw, [
        e.loaded ? e.failure ? (c(), h("p", cw, w(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", uw, "No " + w(e.noun) + "s yet", 1)) : (c(), H(Et, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(V, null, ee(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          v("span", fw, [
            N(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            Q(" " + w(e.head(o)), 1),
            N(oa, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          v("span", hw, w(e.title(o)), 1),
          v("span", mw, w(e.foot(o)), 1)
        ], 8, dw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, $8 = /* @__PURE__ */ K(pw, [["__scopeId", "data-v-b9e18f79"]]), Wo = "newest";
function M8(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Ee(Te, null)) == null ? void 0 : u.search, s = I(""), o = I(Wo), l = I("all"), r = L(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => aw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Wo ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = L(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const gw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, vw = 40, yw = "top", bw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Ee(Te, null)) == null ? void 0 : f.autoScroll, s = L(() => a === yw), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= vw;
    }
    return he(() => n.rowCount, async () => {
      await dt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (c(), h("div", gw, [
      v("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      N(Dt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: j(() => [
          Qe(v("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            N(ye, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            g[0] || (g[0] = Q(" Newest ", -1))
          ], 512), [
            [Zo, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, S8 = /* @__PURE__ */ K(bw, [["__scopeId", "data-v-ffe6b8a5"]]), ww = ["aria-selected", "data-tab", "onClick"], kw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, xw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ee(Te, null), o = L(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const g = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!g) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: g.offsetLeft, width: g.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, g.offsetLeft - 12));
    }
    const d = () => dt(() => u(!0));
    let f = null;
    return Be(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Le(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (m, g) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(V, null, ee(o.value, (y) => {
        var $, k;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: (($ = e.active) == null ? void 0 : $.key) === y.key }]),
          "aria-selected": ((k = e.active) == null ? void 0 : k.key) === y.key,
          "data-tab": y.key,
          onClick: (R) => a("choose", y)
        }, [
          Q(w(y.label) + " ", 1),
          i(y) ? (c(), h("span", kw, w(e.answer[y.count_field]), 1)) : E("", !0)
        ], 10, ww);
      }), 128)),
      v("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, _8 = /* @__PURE__ */ K(xw, [["__scopeId", "data-v-e0def8d7"]]), $w = {
  class: "tab-body",
  "data-tab-body": ""
}, Mw = { "data-tab-content": "" }, Sw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = I(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, hs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", $w, [
      n.value ? (c(), H(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : E("", !0),
      Qe(v("div", Mw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Zo, !n.value]
      ])
    ]));
  }
}, E8 = /* @__PURE__ */ K(Sw, [["__scopeId", "data-v-fe3ebcad"]]), _w = {}, Ew = { class: "menu-label" };
function Aw(e, t) {
  return c(), h("span", Ew, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const rs = /* @__PURE__ */ K(_w, [["render", Aw], ["__scopeId", "data-v-71c11156"]]), Cw = {
  class: "search-bar",
  "data-search-bar": ""
}, Ow = { class: "search-bar-control" }, Tw = ["value", "placeholder", "aria-label"], Rw = ["aria-expanded"], Iw = {
  key: 0,
  "data-menu-count": ""
}, Bw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var R;
    const a = e, s = n, o = ii(), l = ((R = Ee(Te, null)) == null ? void 0 : R.search) ?? {}, r = L(() => l.placeholder || a.placeholder), i = l.context ?? [], u = I(null), d = I(null), f = I([]), m = L(() => f.value.length ? f.value[f.value.length - 1].next : i), g = L(() => !!o.menu || i.length > 0), y = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function $(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      d.value = null, s("pick", F.click);
    }
    function k() {
      var F;
      s("update:modelValue", ""), (F = u.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = u.value) == null ? void 0 : F.focus();
    } }), (F, Y) => {
      var D;
      return c(), h("div", Cw, [
        v("div", Ow, [
          N(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          v("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: Y[0] || (Y[0] = (b) => s("update:modelValue", b.target.value)),
            onKeydown: Xt(k, ["esc"])
          }, null, 40, Tw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: k
          }, [
            N(ye, {
              name: "close",
              size: 12
            })
          ])) : E("", !0),
          g.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: y
          }, [
            e.menuCount ? (c(), h("span", Iw, w(e.menuCount), 1)) : E("", !0),
            N(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Rw)) : E("", !0)
        ]),
        (D = P(l).button) != null && D.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Y[1] || (Y[1] = (b) => s("pick", P(l).button.click))
        }, w(P(l).button.title), 1)) : E("", !0),
        ue(F.$slots, "default", {}, void 0, !0),
        d.value ? (c(), H(Jn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Y[3] || (Y[3] = xe(() => {
          }, ["stop"])),
          onClose: Y[4] || (Y[4] = (b) => d.value = null)
        }, {
          default: j(() => [
            f.value.length ? (c(), H($t, {
              key: 0,
              "data-search-back": "",
              onClick: Y[2] || (Y[2] = (b) => f.value = f.value.slice(0, -1))
            }, {
              default: j(() => [
                Q("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(V, null, ee(m.value, (b) => (c(), H($t, {
              key: b.title,
              description: b.subtext,
              "data-search-entry": b.title,
              onClick: (x) => $(b)
            }, {
              default: j(() => [
                Q(w(b.title) + w(b.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? E("", !0) : ue(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : E("", !0)
      ]);
    };
  }
}, Lw = /* @__PURE__ */ K(Bw, [["__scopeId", "data-v-8617b565"]]), Nw = {
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], s = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
    return (o, l) => (c(), H(Lw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: j(() => [
        N(rs, null, {
          default: j(() => [...l[2] || (l[2] = [
            Q("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(V, null, ee(a, (r) => N($t, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: j(() => [
            Q(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(V, { key: 0 }, [
          N(rs, null, {
            default: j(() => [...l[3] || (l[3] = [
              Q("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(V, null, ee(s, (r) => N($t, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: j(() => [
              Q(w(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : E("", !0)
      ]),
      default: j(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, A8 = /* @__PURE__ */ K(Nw, [["__scopeId", "data-v-9c2114d0"]]);
function C8() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const O8 = (e) => import(
  /* @vite-ignore */
  e
), Dw = 86400, is = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Pw(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((is(t) - is(e)) / Dw);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function T8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = is(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Pw(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ba = 280, La = 240, Na = 120, jw = 6, qw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Fw(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Gr(e, t) {
  const n = Math.max(0, Fw(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Ww(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${qw}px)` }), e.offsetHeight, e.style.transition = `height ${Ba}ms ${ln}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Gr(t, e));
    const m = s() - r;
    if (!i && m >= Ba && (i = !0, e.style.transition = `opacity ${La}ms ease-out, transform ${La}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ba + La) return a(f);
    d();
  };
  return a(f), d;
}
function R8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${jw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Na}ms ease-out, transform ${Na}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Gr(t, e)), s() - l < Na) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const Hw = 140, An = 220, Ho = 5;
function I8({ gap: e = Hw, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Ho);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, g = Ww) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: g, display: d.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= Ho && u.flush();
  };
  return u.flush = () => {
    var d;
    l = !0, queueMicrotask(() => l = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, u;
}
function B8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${ln}, opacity ${An}ms ease-in, margin ${An}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Kr = "chat.pins.minimised", Bn = I(Ln(Kr, !1));
function zo(e) {
  Bn.value = e, ys(Kr, e);
}
function zw(e) {
  const t = L(() => e()), n = L(() => Bn.value ? [] : e()), a = () => zo(!Bn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => Mt(o) > s).length,
    (o, l) => o > l && zo(!1)
  ), { pins: t, visible: n, minimised: Bn, toggle: a };
}
const Uw = ["title"], Vw = {
  key: 0,
  class: "pins-count"
}, Gw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = zw(() => t.pinRows);
    return (o, l) => P(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: P(a), inline: e.inline }]),
      title: P(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => P(s) && P(s)(...r), ["stop"]))
    }, [
      N(ye, {
        name: P(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      P(a) ? (c(), h("span", Vw, w(P(n).length), 1)) : E("", !0)
    ], 10, Uw)) : E("", !0);
  }
}, L8 = /* @__PURE__ */ K(Gw, [["__scopeId", "data-v-999f2559"]]), Kw = ["title"], Yw = ["title"], Jw = { class: "diff-card-dir" }, Zw = { class: "diff-card-name" }, Xw = ["title"], Qw = ["title"], ek = {
  key: 0,
  class: "diff-card-note"
}, tk = ["href"], nk = ["src", "alt"], ak = { class: "diff-card-rows" }, sk = { class: "diff-row-num" }, ok = { class: "diff-row-sign" }, lk = { class: "diff-row-code" }, rk = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    change: { type: String, required: !0 },
    added: { type: Number, required: !0 },
    removed: { type: Number, required: !0 },
    at: { type: [String, Number], required: !0 },
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
    const n = e, a = t, s = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";
    function o(B) {
      (B.metaKey || B.ctrlKey) && (B.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = L(() => n.path.lastIndexOf("/") + 1), u = L(() => n.path.slice(0, i.value)), d = L(() => n.path.slice(i.value)), f = L(() => n.change === "deleted"), m = L(() => l[n.change]), g = L(() => new Set(n.rows.filter((B) => B.line_type === "add").map((B) => B.line))), y = I("after"), $ = L(() => y.value === "before" ? n.whole.old : n.whole.text), k = L(() => n.whole && n.whole.text !== void 0 ? $.value.split(`
`).map((B, M) => ({ line_type: y.value === "after" && g.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: B })) : n.rows.filter(
      (B) => !(n.editsOnly && ["ctx", "fold"].includes(B.line_type)) && !(n.hideRemovals && B.line_type === "del")
    )), R = I(!1), F = L(() => n.lines && !R.value && !n.whole), Y = L(() => F.value ? k.value.slice(0, n.lines) : k.value), D = L(() => k.value.length - Y.value.length), b = (B) => B.line === null || B.line_type === "del" ? "" : B.line, x = (B) => B.line_type === "fold" ? B.hidden ? `⋯ ${B.hidden} lines` : "⋯" : B.text, S = I(null), C = I(null);
    let _ = null;
    return Be(() => {
      if (!C.value) return;
      let B = !0;
      _ = new ResizeObserver(() => {
        !S.value || !C.value || (S.value.style.transition = B ? "none" : "", S.value.style.height = `${C.value.offsetHeight}px`, B = !1);
      }), _.observe(C.value);
    }), Le(() => _ && _.disconnect()), (B, M) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      v("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (p) => !f.value && a("fold"))
      }, [
        v("span", {
          class: "diff-card-path",
          title: `${e.path} · ${P(s)}-click to open it`,
          onClick: o
        }, [
          v("span", Jw, w(u.value), 1),
          v("span", Zw, w(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, w(m.value), 3)) : E("", !0)
        ], 8, Yw),
        v("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        v("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        N(oa, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: M[0] || (M[0] = xe((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, w(y.value === "after" ? "After" : "Before"), 9, Xw)) : E("", !0),
        f.value ? E("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: M[1] || (M[1] = xe((p) => a("whole"), ["stop"]))
        }, [
          N(ye, {
            name: "file",
            size: 12
          })
        ], 10, Qw))
      ], 8, Kw),
      e.whole && e.whole.error ? (c(), h("p", ek, w(e.whole.error), 1)) : E("", !0),
      !f.value && !e.folded ? (c(), h(V, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          v("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, nk)
        ], 8, tk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: S,
          class: "diff-card-grow"
        }, [
          v("div", {
            ref_key: "body",
            ref: C,
            class: "diff-card-diff"
          }, [
            v("div", ak, [
              (c(!0), h(V, null, ee(Y.value, (p, T) => (c(), h("div", {
                key: T,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                v("span", sk, w(b(p)), 1),
                v("span", ok, w(r[p.line_type]), 1),
                v("span", lk, w(x(p)), 1)
              ], 2))), 128)),
              D.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = xe((p) => R.value = !0, ["stop"]))
              }, w(D.value) + " more " + w(D.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, N8 = /* @__PURE__ */ K(rk, [["__scopeId", "data-v-9c99c502"]]), ik = {
  key: 0,
  class: "window-failure"
}, ck = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ft(), a = I(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], il(s, Qb.openPanel)), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", ik, w(a.value.error), 1)) : a.value ? (c(), H(am, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : E("", !0);
  }
}, uk = {
  __name: "WindowPane",
  props: {
    name: { type: String, required: !0 },
    catalogue: { type: Object, required: !0 },
    subscriptions: { type: Object, required: !0 },
    environment: { type: String, required: !0 },
    agent: { type: Number, default: null },
    visible: { type: Boolean, default: !0 },
    prompts: { type: Object, default: null },
    shellRead: { type: Function, default: null },
    options: { type: Object, default: () => ({}) },
    dropdown: { type: Boolean, default: !1 },
    bar: { type: Boolean, default: !1 }
  },
  emits: ["remove", "option"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = L(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = L(() => s.value && { render: () => Gn(ck, { line: s.value.line }) }), l = I(null), r = L(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = L(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = L(
      () => {
        var m, g;
        return l.value ? Rg(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      l.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, l.value);
      return await d(), m;
    }
    return he(
      () => {
        var m, g;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((g = s.value) == null ? void 0 : g.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, g) => {
      var y, $;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), H($s, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : (($ = s.value) == null ? void 0 : $.shows) === "one-agent" && e.agent === null ? (c(), H(Qt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), H(Kt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), H(lr, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[0] || (g[0] = (k, R) => n("option", k, R))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), H(or, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: g[1] || (g[1] = (k, R) => n("option", k, R))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), H(Kt, {
        key: s.value.line || s.value.entry_url,
        name: e.name,
        component: o.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        events: s.value.events,
        options: e.options,
        declared: s.value.options,
        "auto-scroll": s.value.auto_scroll,
        tabs: s.value.tabs,
        sources: s.value.sources,
        links: s.value.links,
        search: s.value.search,
        skeleton: s.value.skeleton,
        "unavailable-reason": s.value.unavailable_reason,
        onOption: g[2] || (g[2] = (k, R) => n("option", k, R))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (k) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, dk = ["data-section"], fk = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ee(su, null), a = L(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = L(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(V, null, ee(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(uk, {
        name: r.name,
        catalogue: P(n).catalogue,
        subscriptions: P(n).subscriptions,
        environment: P(n).environment,
        prompts: P(n).prompts,
        "shell-read": P(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, dk))), 128));
  }
}, hk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: j(() => [
        N(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, mk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, pk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, gk = { class: "ask-text" }, vk = ["placeholder", "aria-label"], yk = ["placeholder", "aria-label"], bk = {
  key: 3,
  class: "moves"
}, wk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = L(() => T0(a.noun, a.row)), l = I(""), r = I(null), i = I(""), u = I("");
    he(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, y = "") {
      const $ = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, y] : g.positional ? [y] : [], ...g.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = $.ok ? "" : $.error, $.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, y) => {
      var $;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", mk, w(l.value), 1)) : E("", !0),
        ($ = r.value) != null && $.confirm ? (c(), h("div", pk, [
          v("span", gk, w(r.value.confirm), 1),
          N(de, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: Z({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (k) => d(r.value))
          }, {
            default: j(() => [
              Q(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          N(de, {
            small: "",
            variant: "ghost",
            onClick: y[1] || (y[1] = (k) => r.value = null)
          }, {
            default: j(() => [...y[7] || (y[7] = [
              Q("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: xe(m, ["prevent"])
        }, [
          Qe(v("input", {
            "onUpdate:modelValue": y[2] || (y[2] = (k) => i.value = k),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: y[3] || (y[3] = Xt(xe((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, vk), [
            [qa, i.value]
          ]),
          r.value.opener ? Qe((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (k) => u.value = k),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: y[5] || (y[5] = Xt(xe((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, yk)), [
            [qa, u.value]
          ]) : E("", !0),
          N(de, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: j(() => [
              Q(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          N(de, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (k) => r.value = null)
          }, {
            default: j(() => [...y[8] || (y[8] = [
              Q("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", bk, [
          (c(!0), h(V, null, ee(o.value, (k) => (c(), H(de, {
            key: k.word,
            small: !k.bordered,
            bordered: k.bordered,
            icon: k.icon,
            variant: k.main ? "primary" : "ghost",
            class: Z({ danger: k.danger }),
            "data-move": k.word,
            onClick: (R) => f(k)
          }, {
            default: j(() => [
              Q(w(k.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : E("", !0);
    };
  }
}, kk = /* @__PURE__ */ K(wk, [["__scopeId", "data-v-5254ddd4"]]), xk = /* @__PURE__ */ new Set(["completed", "cancelled"]), $k = (e) => xk.has(e), Vn = (e) => $k(e) ? "done" : e, Mk = { class: "facts" }, Sk = { class: "fact wide" }, _k = { class: "fact-value" }, Ek = {
  key: 0,
  class: "fact"
}, Ak = { class: "fact-value" }, Ck = { class: "fact" }, Ok = { class: "fact-label" }, Tk = ["title"], Rk = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Ik = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Bk = {
  key: 2,
  class: "fact"
}, Lk = { class: "fact-value" }, Nk = { class: "fact wide" }, Dk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Pk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = jn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", Mk, [
        v("div", Sk, [
          l[2] || (l[2] = v("span", { class: "fact-label" }, "Plan", -1)),
          v("span", _k, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Ek, [
          l[3] || (l[3] = v("span", { class: "fact-label" }, "Phase", -1)),
          v("span", Ak, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.helper_id ? (c(), h(V, { key: 1 }, [
          v("div", Ck, [
            v("span", Ok, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            v("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[0] || (l[0] = (u) => P(We)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Tk)
          ]),
          P(s).has(e.task.state) ? (c(), h("p", Rk, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", Ik, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : E("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", Bk, [
          l[4] || (l[4] = v("span", { class: "fact-label" }, "Assigned to", -1)),
          v("span", Lk, "Agent " + w(e.task.holder_id), 1)
        ])) : E("", !0),
        v("div", Nk, [
          l[5] || (l[5] = v("span", { class: "fact-label" }, "Priority", -1)),
          N(Zn, {
            options: P(n),
            value: String(P(er)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[1] || (l[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Dk, w(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, jk = /* @__PURE__ */ K(Pk, [["__scopeId", "data-v-19f073bc"]]), qk = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, Fk = ["datetime"], Wk = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", qk, [
      n[0] || (n[0] = v("h3", null, "Block history", -1)),
      (c(!0), h(V, null, ee(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        v("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, Fk),
        v("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : E("", !0);
  }
}, Hk = /* @__PURE__ */ K(Wk, [["__scopeId", "data-v-3019b030"]]), zk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Uk = { ...zk, done: "Completed" }, Vk = { class: "task-status-icon" }, Gk = ["width", "height", "aria-label"], Kk = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = L(() => ml("task", Vn(t.status))), a = L(() => n.value === "testing" ? "started" : n.value), s = L(() => Uk[t.status] ?? hl("task", t.status));
    return (o, l) => (c(), h("span", Vk, [
      N(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: j(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            N(Pt, { value: a.value }, {
              blocked: j(() => [...l[0] || (l[0] = [
                v("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                v("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                v("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: j(() => [...l[1] || (l[1] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                v("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: j(() => [...l[2] || (l[2] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                v("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: j(() => [...l[3] || (l[3] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                v("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                v("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: j(() => [...l[4] || (l[4] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                v("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                v("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: j(() => [...l[5] || (l[5] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: j(() => [...l[6] || (l[6] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Gk))
        ]),
        _: 1
      })
    ]));
  }
}, Yr = /* @__PURE__ */ K(Kk, [["__scopeId", "data-v-b13c7c09"]]), Yk = {
  class: "part",
  "data-resource-waits": ""
}, Jk = ["onClick"], Zk = { class: "wait-id" }, Xk = { class: "wait-title" }, Qk = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", Yk, [
      v("h4", null, w(e.title), 1),
      (c(!0), h(V, null, ee(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Yr, {
          status: P(Vn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        v("span", Zk, w(o.id), 1),
        v("span", Xk, w(o.title), 1)
      ], 8, Jk))), 128))
    ]));
  }
}, Uo = /* @__PURE__ */ K(Qk, [["__scopeId", "data-v-96a767b5"]]), e2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, t2 = { class: "text" }, n2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, a2 = 180, s2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = L(() => a.task.waits.filter((i) => !n.has(i.state))), r = L(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(V, null, [
      l.value.length ? (c(), H(Uo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", e2, [
        u[3] || (u[3] = v("h4", null, "How it was done", -1)),
        v("p", t2, w(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", n2, [
        u[4] || (u[4] = v("h4", null, "The brief", -1)),
        v("p", {
          class: Z(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > a2 && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : E("", !0)
      ])) : E("", !0),
      r.value.length ? (c(), H(Uo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : E("", !0)
    ], 64));
  }
}, o2 = /* @__PURE__ */ K(s2, [["__scopeId", "data-v-b628bea5"]]), l2 = {
  class: "task-details",
  "data-task-details": ""
}, r2 = { class: "since" }, i2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, c2 = { class: "text" }, u2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, d2 = {
  key: 1,
  class: "note"
}, f2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, h2 = { class: "text" }, m2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", l2, [
        v("div", {
          class: Z(["state-line", P(Vn)(e.task.state)])
        }, [
          v("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Yr, {
              status: P(Vn)(e.task.state)
            }, null, 8, ["status"]),
            Q(" " + w(a(e.task.state)), 1)
          ]),
          v("span", r2, [
            o[3] || (o[3] = Q(" since ", -1)),
            N(oa, {
              at: P(zl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", i2, [
          o[4] || (o[4] = v("span", { class: "label" }, "Blocked, waiting on", -1)),
          v("p", c2, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", u2, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", d2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", f2, [
          o[5] || (o[5] = v("span", { class: "label" }, "Why it was cancelled", -1)),
          v("p", h2, w(e.task.reason), 1)
        ])) : E("", !0),
        N(jk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(o2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(Hk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, p2 = /* @__PURE__ */ K(m2, [["__scopeId", "data-v-7b9702f2"]]), g2 = 50, v2 = { messages: 25 }, y2 = (e) => v2[e] || g2, b2 = {
  class: "task-log",
  "aria-label": "Task log"
}, w2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, k2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, x2 = { class: "entries" }, $2 = ["datetime"], M2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, S2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = I([]), a = I(1), s = I(!0), o = I(!0), l = I("");
    let r = 0;
    async function i(u = 1) {
      const d = ++r;
      a.value = u, o.value = !0, l.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task",
        String(t.id),
        "--limit",
        String(y2("task_logs")),
        "--page",
        String(u)
      ]);
      d === r && (o.value = !1, l.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), _t(() => {
      r += 1;
    }), (u, d) => (c(), h("section", b2, [
      o.value ? (c(), H(Et, { key: 0 })) : l.value ? (c(), h(V, { key: 1 }, [
        v("p", w2, w(l.value), 1),
        N(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: j(() => [...d[3] || (d[3] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(V, { key: 2 }, [
        n.value.length ? E("", !0) : (c(), h("p", k2, "No log entries yet.")),
        v("ol", x2, [
          (c(!0), h(V, null, ee(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            v("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, $2),
            v("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", M2, [
          N(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: j(() => [...d[4] || (d[4] = [
              Q("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          v("span", null, "Page " + w(a.value), 1),
          N(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: j(() => [...d[5] || (d[5] = [
              Q("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : E("", !0)
      ], 64))
    ]));
  }
}, _2 = /* @__PURE__ */ K(S2, [["__scopeId", "data-v-91807335"]]), E2 = { class: "comment-side-head" }, A2 = {
  key: 0,
  class: "comment-none"
}, C2 = { key: 0 }, O2 = {
  key: 1,
  class: "comment-none"
}, T2 = {
  class: "comment",
  "data-comment": ""
}, R2 = {
  __name: "CommentSide",
  props: {
    comments: { type: Array, required: !0 },
    words: { type: Function, required: !0 },
    below: Boolean,
    more: Boolean,
    loading: Boolean,
    failure: { type: String, default: "" }
  },
  emits: ["close", "more"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      v("header", E2, [
        n[2] || (n[2] = v("h3", null, "Comments", -1)),
        N(vs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", A2, "No comments yet")) : E("", !0),
      (c(!0), h(V, null, ee(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", C2, w(a.quote), 1)) : E("", !0),
        a.revision ? (c(), h("span", O2, "Revision " + w(a.revision), 1)) : E("", !0),
        v("p", T2, w(e.words(a)), 1)
      ]))), 128)),
      N(Yn, {
        more: e.more,
        loading: e.loading,
        failure: e.failure,
        label: "More comments",
        onMore: n[1] || (n[1] = (a) => t.$emit("more"))
      }, null, 8, ["more", "loading", "failure"])
    ], 2));
  }
}, I2 = /* @__PURE__ */ K(R2, [["__scopeId", "data-v-798005b2"]]);
var Ko;
/Mac|iPhone|iPad/.test(((Ko = navigator.userAgentData) == null ? void 0 : Ko.platform) || navigator.platform);
function B2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const L2 = ["placeholder"], N2 = { class: "actions" }, D2 = { class: "error" }, P2 = {
  key: 1,
  class: "card closed"
}, j2 = { class: "mark" }, q2 = { class: "prompt" }, F2 = {
  key: 0,
  class: "draft"
}, W2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ ja({
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
  emits: /* @__PURE__ */ ja(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Pa(e, "draft"), l = Pa(e, "error"), r = I(!!l.value), i = I(!1), u = I(!1), d = I(null);
    async function f() {
      var y, $;
      r.value = !0, i.value = !1, await dt(), ($ = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || $.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function g() {
      const y = o.value.trim();
      if (!(!y || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(y), r.value = !1, i.value = !0;
        } catch ($) {
          o.value = y, l.value = $.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, $) => (c(), h("div", {
      class: Z(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(g, ["prevent"]),
        onKeydown: Xt(m, ["esc"])
      }, [
        ue(y.$slots, "who", {}, void 0, !0),
        Qe(v("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": $[0] || ($[0] = (k) => o.value = k),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: $[1] || ($[1] = Xt((k) => P(B2)(k, g), ["enter"]))
        }, null, 40, L2), [
          [qa, o.value]
        ]),
        v("div", N2, [
          v("span", D2, w(l.value), 1),
          N(de, {
            small: "",
            onClick: m
          }, {
            default: j(() => [...$[3] || ($[3] = [
              Q("Cancel", -1)
            ])]),
            _: 1
          }),
          N(de, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: g
          }, {
            default: j(() => [...$[4] || ($[4] = [
              Q("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", P2, [
        v("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          v("span", j2, [
            N(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          v("span", q2, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", F2, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: $[2] || ($[2] = (k) => s("show"))
        }, [
          v("span", null, w(P(tc)(e.count, "comment")), 1),
          N(ye, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, H2 = /* @__PURE__ */ K(W2, [["__scopeId", "data-v-54460909"]]);
function z2(e, t) {
  const n = I([]), a = I(!1), s = I(null), o = I(0), l = I(!1), r = I("");
  let i = 0, u = 0;
  const d = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: $, id: k, title: R } = e(), F = `On ${$} ${k}, ${R}: `;
    return y.text.startsWith(F) ? y.text.slice(F.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: $, id: k } = e();
    if (!k) return;
    const R = ++u;
    l.value = !0, r.value = "";
    try {
      const F = await t([$, "comments", String(k), "--page", String(y), "--page-size", "25"]);
      if (R !== u) return;
      if (!F.ok) {
        r.value = F.error;
        return;
      }
      const Y = F.value.rows ?? [], D = y === 1 ? Y : [...n.value, ...Y];
      n.value = [...new Map(D.map((b) => [b.id, b])).values()], o.value = F.value.total ?? n.value.length, s.value = F.value.next_page ?? null;
    } catch (F) {
      R === u && (r.value = F.message);
    } finally {
      R === u && (l.value = !1);
    }
  }
  async function m(y) {
    var b;
    const { noun: $, id: k } = e(), R = `${$}:${k}`, F = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, F], o.value++, a.value = !0;
    const Y = await t([$, "comment", String(k), y]);
    if (R !== `${e().noun}:${e().id}`) return;
    if (!Y.ok)
      throw n.value = n.value.filter((x) => x.id !== F.id), o.value = Math.max(0, o.value - 1), new Error(Y.error);
    await f();
    const D = (b = Y.value) == null ? void 0 : b.id;
    D && !n.value.some((x) => x.id === D) && (n.value = [...n.value, { ...F, id: D }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return he(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const U2 = { class: "top" }, V2 = {
  class: "crumb",
  "data-task-crumb": ""
}, G2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, K2 = {
  key: 1,
  class: "body"
}, Y2 = { class: "summary" }, J2 = { class: "stamp" }, Z2 = {
  class: "title",
  "data-resource-title": ""
}, X2 = {
  class: "tabs",
  "data-task-tabs": ""
}, Q2 = { class: "panels" }, e5 = {
  __name: "TaskInspector",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    lone: Boolean,
    stepped: Boolean,
    backed: Boolean,
    changes: { type: Number, default: 0 }
  },
  emits: ["close", "step", "select", "back"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(null), l = I(null), r = I(""), i = I(""), u = I(null), d = I(null), f = I("details"), m = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], g = z2(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (D) => a.read(D)
    );
    let y = 0;
    const $ = L(() => {
      var D;
      return (D = l.value) != null && D.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function k() {
      const D = ++y, [b, x] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      D === y && (r.value = b.ok ? "" : b.error, o.value = b.ok ? b.value : null, l.value = x.ok ? x.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, l.value = null, u.value = null, f.value = "details", k();
      },
      { immediate: !0 }
    ), he(() => a.changes, k), he(g.open, (D) => {
      D && (f.value = "comments");
    });
    async function R(D) {
      const b = o.value.priority;
      o.value.priority = Number(D);
      const x = await a.read(["task", "edit", String(a.id), "--priority", D]);
      if (i.value = x.ok ? "" : x.error, x.ok) return k();
      o.value.priority = b;
    }
    function F(D) {
      u.value = null, d.value.press(D);
    }
    const Y = (D) => {
      var b;
      return ((b = d.value) == null ? void 0 : b.moves.length) && (u.value = D);
    };
    return t({ openStatus: Y }), (D, b) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      v("div", U2, [
        e.backed ? (c(), H(hk, {
          key: 0,
          onBack: b[0] || (b[0] = (x) => s("back"))
        })) : E("", !0),
        v("span", V2, w($.value), 1),
        b[10] || (b[10] = v("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(V, { key: 1 }, [
          N(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: b[1] || (b[1] = (x) => s("step", -1))
          }, {
            default: j(() => [
              N(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          N(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: b[2] || (b[2] = (x) => s("step", 1))
          }, {
            default: j(() => [
              N(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : E("", !0),
        N(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: b[3] || (b[3] = (x) => s("close"))
        }, {
          default: j(() => [
            N(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (c(), h("p", G2, w(r.value), 1)) : o.value ? (c(), h(V, { key: 2 }, [
        N(kk, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: k
        }, null, 8, ["id", "row", "read"]),
        v("header", Y2, [
          v("div", J2, [
            Q(" Task " + w(o.value.id) + " · updated ", 1),
            N(oa, {
              at: P(zl)(o.value)
            }, null, 8, ["at"])
          ]),
          v("h3", Z2, w(o.value.title), 1)
        ]),
        v("div", X2, [
          N(Zn, {
            options: m,
            value: f.value,
            onPick: b[4] || (b[4] = (x) => f.value = x)
          }, null, 8, ["value"])
        ]),
        v("div", Q2, [
          N(Pt, { value: f.value }, {
            details: j(() => [
              N(p2, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: Y,
                onPriority: R,
                onSelect: b[5] || (b[5] = (x) => s("select", x))
              }, null, 8, ["task", "place", "refusal"]),
              N(fk, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              N(Qi, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: b[6] || (b[6] = (x) => s("select", x))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: j(() => [
              N(I2, {
                below: "",
                comments: P(g).comments.value,
                words: P(g).words,
                more: !!P(g).nextPage.value,
                loading: P(g).loading.value,
                failure: P(g).failure.value,
                onMore: P(g).loadMore,
                onClose: b[7] || (b[7] = (x) => f.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: j(() => [
              N(_2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(H2, {
          send: P(g).send,
          count: P(g).total.value,
          onShow: b[8] || (b[8] = (x) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", K2, [
        N(Et)
      ])),
      u.value ? (c(), H(Jn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: b[9] || (b[9] = (x) => u.value = null)
      }, {
        default: j(() => [
          N(rs, null, {
            default: j(() => [
              Q("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(V, null, ee(d.value.moves, (x) => (c(), H($t, {
            key: x.word,
            onClick: (S) => F(x)
          }, {
            default: j(() => [
              Q(w(x.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, D8 = /* @__PURE__ */ K(e5, [["__scopeId", "data-v-a6bebf87"]]);
function t5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Da = { exports: {} }, Vo;
function n5() {
  return Vo || (Vo = 1, (function(e, t) {
    var n = (function() {
      var a = function(b, x) {
        var S = 236, C = 17, _ = b, B = o[x], M = null, p = 0, T = null, O = [], A = {}, J = function(W, z) {
          p = _ * 4 + 17, M = (function(q) {
            for (var U = new Array(q), G = 0; G < q; G += 1) {
              U[G] = new Array(q);
              for (var X = 0; X < q; X += 1)
                U[G][X] = null;
            }
            return U;
          })(p), te(0, 0), te(p - 7, 0), te(0, p - 7), pe(), ie(), qe(W, z), _ >= 7 && Ce(W), T == null && (T = ae(_, B, O)), ve(T, z);
        }, te = function(W, z) {
          for (var q = -1; q <= 7; q += 1)
            if (!(W + q <= -1 || p <= W + q))
              for (var U = -1; U <= 7; U += 1)
                z + U <= -1 || p <= z + U || (0 <= q && q <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (q == 0 || q == 6) || 2 <= q && q <= 4 && 2 <= U && U <= 4 ? M[W + q][z + U] = !0 : M[W + q][z + U] = !1);
        }, ce = function() {
          for (var W = 0, z = 0, q = 0; q < 8; q += 1) {
            J(!0, q);
            var U = r.getLostPoint(A);
            (q == 0 || W > U) && (W = U, z = q);
          }
          return z;
        }, ie = function() {
          for (var W = 8; W < p - 8; W += 1)
            M[W][6] == null && (M[W][6] = W % 2 == 0);
          for (var z = 8; z < p - 8; z += 1)
            M[6][z] == null && (M[6][z] = z % 2 == 0);
        }, pe = function() {
          for (var W = r.getPatternPosition(_), z = 0; z < W.length; z += 1)
            for (var q = 0; q < W.length; q += 1) {
              var U = W[z], G = W[q];
              if (M[U][G] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? M[U + X][G + oe] = !0 : M[U + X][G + oe] = !1;
            }
        }, Ce = function(W) {
          for (var z = r.getBCHTypeNumber(_), q = 0; q < 18; q += 1) {
            var U = !W && (z >> q & 1) == 1;
            M[Math.floor(q / 3)][q % 3 + p - 8 - 3] = U;
          }
          for (var q = 0; q < 18; q += 1) {
            var U = !W && (z >> q & 1) == 1;
            M[q % 3 + p - 8 - 3][Math.floor(q / 3)] = U;
          }
        }, qe = function(W, z) {
          for (var q = B << 3 | z, U = r.getBCHTypeInfo(q), G = 0; G < 15; G += 1) {
            var X = !W && (U >> G & 1) == 1;
            G < 6 ? M[G][8] = X : G < 8 ? M[G + 1][8] = X : M[p - 15 + G][8] = X;
          }
          for (var G = 0; G < 15; G += 1) {
            var X = !W && (U >> G & 1) == 1;
            G < 8 ? M[8][p - G - 1] = X : G < 9 ? M[8][15 - G - 1 + 1] = X : M[8][15 - G - 1] = X;
          }
          M[p - 8][8] = !W;
        }, ve = function(W, z) {
          for (var q = -1, U = p - 1, G = 7, X = 0, oe = r.getMaskFunction(z), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (M[U][se - ke] == null) {
                  var Me = !1;
                  X < W.length && (Me = (W[X] >>> G & 1) == 1);
                  var re = oe(U, se - ke);
                  re && (Me = !Me), M[U][se - ke] = Me, G -= 1, G == -1 && (X += 1, G = 7);
                }
              if (U += q, U < 0 || p <= U) {
                U -= q, q = -q;
                break;
              }
            }
        }, fe = function(W, z) {
          for (var q = 0, U = 0, G = 0, X = new Array(z.length), oe = new Array(z.length), se = 0; se < z.length; se += 1) {
            var ke = z[se].dataCount, Me = z[se].totalCount - ke;
            U = Math.max(U, ke), G = Math.max(G, Me), X[se] = new Array(ke);
            for (var re = 0; re < X[se].length; re += 1)
              X[se][re] = 255 & W.getBuffer()[re + q];
            q += ke;
            var Ne = r.getErrorCorrectPolynomial(Me), De = u(X[se], Ne.getLength() - 1), Ls = De.mod(Ne);
            oe[se] = new Array(Ne.getLength() - 1);
            for (var re = 0; re < oe[se].length; re += 1) {
              var Ns = re + Ls.getLength() - oe[se].length;
              oe[se][re] = Ns >= 0 ? Ls.getAt(Ns) : 0;
            }
          }
          for (var Ds = 0, re = 0; re < z.length; re += 1)
            Ds += z[re].totalCount;
          for (var la = new Array(Ds), pn = 0, re = 0; re < U; re += 1)
            for (var se = 0; se < z.length; se += 1)
              re < X[se].length && (la[pn] = X[se][re], pn += 1);
          for (var re = 0; re < G; re += 1)
            for (var se = 0; se < z.length; se += 1)
              re < oe[se].length && (la[pn] = oe[se][re], pn += 1);
          return la;
        }, ae = function(W, z, q) {
          for (var U = d.getRSBlocks(W, z), G = f(), X = 0; X < q.length; X += 1) {
            var oe = q[X];
            G.put(oe.getMode(), 4), G.put(oe.getLength(), r.getLengthInBits(oe.getMode(), W)), oe.write(G);
          }
          for (var se = 0, X = 0; X < U.length; X += 1)
            se += U[X].dataCount;
          if (G.getLengthInBits() > se * 8)
            throw "code length overflow. (" + G.getLengthInBits() + ">" + se * 8 + ")";
          for (G.getLengthInBits() + 4 <= se * 8 && G.put(0, 4); G.getLengthInBits() % 8 != 0; )
            G.putBit(!1);
          for (; !(G.getLengthInBits() >= se * 8 || (G.put(S, 8), G.getLengthInBits() >= se * 8)); )
            G.put(C, 8);
          return fe(G, U);
        };
        A.addData = function(W, z) {
          z = z || "Byte";
          var q = null;
          switch (z) {
            case "Numeric":
              q = m(W);
              break;
            case "Alphanumeric":
              q = g(W);
              break;
            case "Byte":
              q = y(W);
              break;
            case "Kanji":
              q = $(W);
              break;
            default:
              throw "mode:" + z;
          }
          O.push(q), T = null;
        }, A.isDark = function(W, z) {
          if (W < 0 || p <= W || z < 0 || p <= z)
            throw W + "," + z;
          return M[W][z];
        }, A.getModuleCount = function() {
          return p;
        }, A.make = function() {
          if (_ < 1) {
            for (var W = 1; W < 40; W++) {
              for (var z = d.getRSBlocks(W, B), q = f(), U = 0; U < O.length; U++) {
                var G = O[U];
                q.put(G.getMode(), 4), q.put(G.getLength(), r.getLengthInBits(G.getMode(), W)), G.write(q);
              }
              for (var X = 0, U = 0; U < z.length; U++)
                X += z[U].dataCount;
              if (q.getLengthInBits() <= X * 8)
                break;
            }
            _ = W;
          }
          J(!1, ce());
        }, A.createTableTag = function(W, z) {
          W = W || 2, z = typeof z > "u" ? W * 4 : z;
          var q = "";
          q += '<table style="', q += " border-width: 0px; border-style: none;", q += " border-collapse: collapse;", q += " padding: 0px; margin: " + z + "px;", q += '">', q += "<tbody>";
          for (var U = 0; U < A.getModuleCount(); U += 1) {
            q += "<tr>";
            for (var G = 0; G < A.getModuleCount(); G += 1)
              q += '<td style="', q += " border-width: 0px; border-style: none;", q += " border-collapse: collapse;", q += " padding: 0px; margin: 0px;", q += " width: " + W + "px;", q += " height: " + W + "px;", q += " background-color: ", q += A.isDark(U, G) ? "#000000" : "#ffffff", q += ";", q += '"/>';
            q += "</tr>";
          }
          return q += "</tbody>", q += "</table>", q;
        }, A.createSvgTag = function(W, z, q, U) {
          var G = {};
          typeof arguments[0] == "object" && (G = arguments[0], W = G.cellSize, z = G.margin, q = G.alt, U = G.title), W = W || 2, z = typeof z > "u" ? W * 4 : z, q = typeof q == "string" ? { text: q } : q || {}, q.text = q.text || null, q.id = q.text ? q.id || "qrcode-description" : null, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-title" : null;
          var X = A.getModuleCount() * W + z * 2, oe, se, ke, Me, re = "", Ne;
          for (Ne = "l" + W + ",0 0," + W + " -" + W + ",0 0,-" + W + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += G.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', re += ' viewBox="0 0 ' + X + " " + X + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += U.text || q.text ? ' role="img" aria-labelledby="' + Ke([U.id, q.id].join(" ").trim()) + '"' : "", re += ">", re += U.text ? '<title id="' + Ke(U.id) + '">' + Ke(U.text) + "</title>" : "", re += q.text ? '<description id="' + Ke(q.id) + '">' + Ke(q.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', ke = 0; ke < A.getModuleCount(); ke += 1)
            for (Me = ke * W + z, oe = 0; oe < A.getModuleCount(); oe += 1)
              A.isDark(ke, oe) && (se = oe * W + z, re += "M" + se + "," + Me + Ne);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, A.createDataURL = function(W, z) {
          W = W || 2, z = typeof z > "u" ? W * 4 : z;
          var q = A.getModuleCount() * W + z * 2, U = z, G = q - z;
          return D(q, q, function(X, oe) {
            if (U <= X && X < G && U <= oe && oe < G) {
              var se = Math.floor((X - U) / W), ke = Math.floor((oe - U) / W);
              return A.isDark(ke, se) ? 0 : 1;
            } else
              return 1;
          });
        }, A.createImgTag = function(W, z, q) {
          W = W || 2, z = typeof z > "u" ? W * 4 : z;
          var U = A.getModuleCount() * W + z * 2, G = "";
          return G += "<img", G += ' src="', G += A.createDataURL(W, z), G += '"', G += ' width="', G += U, G += '"', G += ' height="', G += U, G += '"', q && (G += ' alt="', G += Ke(q), G += '"'), G += "/>", G;
        };
        var Ke = function(W) {
          for (var z = "", q = 0; q < W.length; q += 1) {
            var U = W.charAt(q);
            switch (U) {
              case "<":
                z += "&lt;";
                break;
              case ">":
                z += "&gt;";
                break;
              case "&":
                z += "&amp;";
                break;
              case '"':
                z += "&quot;";
                break;
              default:
                z += U;
                break;
            }
          }
          return z;
        }, Jr = function(W) {
          var z = 1;
          W = typeof W > "u" ? z * 2 : W;
          var q = A.getModuleCount() * z + W * 2, U = W, G = q - W, X, oe, se, ke, Me, re = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Ne = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, De = "";
          for (X = 0; X < q; X += 2) {
            for (se = Math.floor((X - U) / z), ke = Math.floor((X + 1 - U) / z), oe = 0; oe < q; oe += 1)
              Me = "█", U <= oe && oe < G && U <= X && X < G && A.isDark(se, Math.floor((oe - U) / z)) && (Me = " "), U <= oe && oe < G && U <= X + 1 && X + 1 < G && A.isDark(ke, Math.floor((oe - U) / z)) ? Me += " " : Me += "█", De += W < 1 && X + 1 >= G ? Ne[Me] : re[Me];
            De += `
`;
          }
          return q % 2 && W > 0 ? De.substring(0, De.length - q - 1) + Array(q + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return A.createASCII = function(W, z) {
          if (W = W || 1, W < 2)
            return Jr(z);
          W -= 1, z = typeof z > "u" ? W * 2 : z;
          var q = A.getModuleCount() * W + z * 2, U = z, G = q - z, X, oe, se, ke, Me = Array(W + 1).join("██"), re = Array(W + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < q; X += 1) {
            for (se = Math.floor((X - U) / W), De = "", oe = 0; oe < q; oe += 1)
              ke = 1, U <= oe && oe < G && U <= X && X < G && A.isDark(se, Math.floor((oe - U) / W)) && (ke = 0), De += ke ? Me : re;
            for (se = 0; se < W; se += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, A.renderTo2dContext = function(W, z) {
          z = z || 2;
          for (var q = A.getModuleCount(), U = 0; U < q; U++)
            for (var G = 0; G < q; G++)
              W.fillStyle = A.isDark(U, G) ? "black" : "white", W.fillRect(U * z, G * z, z, z);
        }, A;
      };
      a.stringToBytesFuncs = {
        default: function(b) {
          for (var x = [], S = 0; S < b.length; S += 1) {
            var C = b.charCodeAt(S);
            x.push(C & 255);
          }
          return x;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(b, x) {
        var S = (function() {
          for (var _ = F(b), B = function() {
            var ie = _.read();
            if (ie == -1) throw "eof";
            return ie;
          }, M = 0, p = {}; ; ) {
            var T = _.read();
            if (T == -1) break;
            var O = B(), A = B(), J = B(), te = String.fromCharCode(T << 8 | O), ce = A << 8 | J;
            p[te] = ce, M += 1;
          }
          if (M != x)
            throw M + " != " + x;
          return p;
        })(), C = 63;
        return function(_) {
          for (var B = [], M = 0; M < _.length; M += 1) {
            var p = _.charCodeAt(M);
            if (p < 128)
              B.push(p);
            else {
              var T = S[_.charAt(M)];
              typeof T == "number" ? (T & 255) == T ? B.push(T) : (B.push(T >>> 8), B.push(T & 255)) : B.push(C);
            }
          }
          return B;
        };
      };
      var s = {
        MODE_NUMBER: 1,
        MODE_ALPHA_NUM: 2,
        MODE_8BIT_BYTE: 4,
        MODE_KANJI: 8
      }, o = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
      }, l = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, r = (function() {
        var b = [
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
        ], x = 1335, S = 7973, C = 21522, _ = {}, B = function(M) {
          for (var p = 0; M != 0; )
            p += 1, M >>>= 1;
          return p;
        };
        return _.getBCHTypeInfo = function(M) {
          for (var p = M << 10; B(p) - B(x) >= 0; )
            p ^= x << B(p) - B(x);
          return (M << 10 | p) ^ C;
        }, _.getBCHTypeNumber = function(M) {
          for (var p = M << 12; B(p) - B(S) >= 0; )
            p ^= S << B(p) - B(S);
          return M << 12 | p;
        }, _.getPatternPosition = function(M) {
          return b[M - 1];
        }, _.getMaskFunction = function(M) {
          switch (M) {
            case l.PATTERN000:
              return function(p, T) {
                return (p + T) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, T) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, T) {
                return T % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, T) {
                return (p + T) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, T) {
                return (Math.floor(p / 2) + Math.floor(T / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, T) {
                return p * T % 2 + p * T % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, T) {
                return (p * T % 2 + p * T % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, T) {
                return (p * T % 3 + (p + T) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + M;
          }
        }, _.getErrorCorrectPolynomial = function(M) {
          for (var p = u([1], 0), T = 0; T < M; T += 1)
            p = p.multiply(u([1, i.gexp(T)], 0));
          return p;
        }, _.getLengthInBits = function(M, p) {
          if (1 <= p && p < 10)
            switch (M) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + M;
            }
          else if (p < 27)
            switch (M) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + M;
            }
          else if (p < 41)
            switch (M) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + M;
            }
          else
            throw "type:" + p;
        }, _.getLostPoint = function(M) {
          for (var p = M.getModuleCount(), T = 0, O = 0; O < p; O += 1)
            for (var A = 0; A < p; A += 1) {
              for (var J = 0, te = M.isDark(O, A), ce = -1; ce <= 1; ce += 1)
                if (!(O + ce < 0 || p <= O + ce))
                  for (var ie = -1; ie <= 1; ie += 1)
                    A + ie < 0 || p <= A + ie || ce == 0 && ie == 0 || te == M.isDark(O + ce, A + ie) && (J += 1);
              J > 5 && (T += 3 + J - 5);
            }
          for (var O = 0; O < p - 1; O += 1)
            for (var A = 0; A < p - 1; A += 1) {
              var pe = 0;
              M.isDark(O, A) && (pe += 1), M.isDark(O + 1, A) && (pe += 1), M.isDark(O, A + 1) && (pe += 1), M.isDark(O + 1, A + 1) && (pe += 1), (pe == 0 || pe == 4) && (T += 3);
            }
          for (var O = 0; O < p; O += 1)
            for (var A = 0; A < p - 6; A += 1)
              M.isDark(O, A) && !M.isDark(O, A + 1) && M.isDark(O, A + 2) && M.isDark(O, A + 3) && M.isDark(O, A + 4) && !M.isDark(O, A + 5) && M.isDark(O, A + 6) && (T += 40);
          for (var A = 0; A < p; A += 1)
            for (var O = 0; O < p - 6; O += 1)
              M.isDark(O, A) && !M.isDark(O + 1, A) && M.isDark(O + 2, A) && M.isDark(O + 3, A) && M.isDark(O + 4, A) && !M.isDark(O + 5, A) && M.isDark(O + 6, A) && (T += 40);
          for (var Ce = 0, A = 0; A < p; A += 1)
            for (var O = 0; O < p; O += 1)
              M.isDark(O, A) && (Ce += 1);
          var qe = Math.abs(100 * Ce / p / p - 50) / 5;
          return T += qe * 10, T;
        }, _;
      })(), i = (function() {
        for (var b = new Array(256), x = new Array(256), S = 0; S < 8; S += 1)
          b[S] = 1 << S;
        for (var S = 8; S < 256; S += 1)
          b[S] = b[S - 4] ^ b[S - 5] ^ b[S - 6] ^ b[S - 8];
        for (var S = 0; S < 255; S += 1)
          x[b[S]] = S;
        var C = {};
        return C.glog = function(_) {
          if (_ < 1)
            throw "glog(" + _ + ")";
          return x[_];
        }, C.gexp = function(_) {
          for (; _ < 0; )
            _ += 255;
          for (; _ >= 256; )
            _ -= 255;
          return b[_];
        }, C;
      })();
      function u(b, x) {
        if (typeof b.length > "u")
          throw b.length + "/" + x;
        var S = (function() {
          for (var _ = 0; _ < b.length && b[_] == 0; )
            _ += 1;
          for (var B = new Array(b.length - _ + x), M = 0; M < b.length - _; M += 1)
            B[M] = b[M + _];
          return B;
        })(), C = {};
        return C.getAt = function(_) {
          return S[_];
        }, C.getLength = function() {
          return S.length;
        }, C.multiply = function(_) {
          for (var B = new Array(C.getLength() + _.getLength() - 1), M = 0; M < C.getLength(); M += 1)
            for (var p = 0; p < _.getLength(); p += 1)
              B[M + p] ^= i.gexp(i.glog(C.getAt(M)) + i.glog(_.getAt(p)));
          return u(B, 0);
        }, C.mod = function(_) {
          if (C.getLength() - _.getLength() < 0)
            return C;
          for (var B = i.glog(C.getAt(0)) - i.glog(_.getAt(0)), M = new Array(C.getLength()), p = 0; p < C.getLength(); p += 1)
            M[p] = C.getAt(p);
          for (var p = 0; p < _.getLength(); p += 1)
            M[p] ^= i.gexp(i.glog(_.getAt(p)) + B);
          return u(M, 0).mod(_);
        }, C;
      }
      var d = (function() {
        var b = [
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
        ], x = function(_, B) {
          var M = {};
          return M.totalCount = _, M.dataCount = B, M;
        }, S = {}, C = function(_, B) {
          switch (B) {
            case o.L:
              return b[(_ - 1) * 4 + 0];
            case o.M:
              return b[(_ - 1) * 4 + 1];
            case o.Q:
              return b[(_ - 1) * 4 + 2];
            case o.H:
              return b[(_ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return S.getRSBlocks = function(_, B) {
          var M = C(_, B);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + _ + "/errorCorrectionLevel:" + B;
          for (var p = M.length / 3, T = [], O = 0; O < p; O += 1)
            for (var A = M[O * 3 + 0], J = M[O * 3 + 1], te = M[O * 3 + 2], ce = 0; ce < A; ce += 1)
              T.push(x(J, te));
          return T;
        }, S;
      })(), f = function() {
        var b = [], x = 0, S = {};
        return S.getBuffer = function() {
          return b;
        }, S.getAt = function(C) {
          var _ = Math.floor(C / 8);
          return (b[_] >>> 7 - C % 8 & 1) == 1;
        }, S.put = function(C, _) {
          for (var B = 0; B < _; B += 1)
            S.putBit((C >>> _ - B - 1 & 1) == 1);
        }, S.getLengthInBits = function() {
          return x;
        }, S.putBit = function(C) {
          var _ = Math.floor(x / 8);
          b.length <= _ && b.push(0), C && (b[_] |= 128 >>> x % 8), x += 1;
        }, S;
      }, m = function(b) {
        var x = s.MODE_NUMBER, S = b, C = {};
        C.getMode = function() {
          return x;
        }, C.getLength = function(M) {
          return S.length;
        }, C.write = function(M) {
          for (var p = S, T = 0; T + 2 < p.length; )
            M.put(_(p.substring(T, T + 3)), 10), T += 3;
          T < p.length && (p.length - T == 1 ? M.put(_(p.substring(T, T + 1)), 4) : p.length - T == 2 && M.put(_(p.substring(T, T + 2)), 7));
        };
        var _ = function(M) {
          for (var p = 0, T = 0; T < M.length; T += 1)
            p = p * 10 + B(M.charAt(T));
          return p;
        }, B = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return C;
      }, g = function(b) {
        var x = s.MODE_ALPHA_NUM, S = b, C = {};
        C.getMode = function() {
          return x;
        }, C.getLength = function(B) {
          return S.length;
        }, C.write = function(B) {
          for (var M = S, p = 0; p + 1 < M.length; )
            B.put(
              _(M.charAt(p)) * 45 + _(M.charAt(p + 1)),
              11
            ), p += 2;
          p < M.length && B.put(_(M.charAt(p)), 6);
        };
        var _ = function(B) {
          if ("0" <= B && B <= "9")
            return B.charCodeAt(0) - 48;
          if ("A" <= B && B <= "Z")
            return B.charCodeAt(0) - 65 + 10;
          switch (B) {
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
              throw "illegal char :" + B;
          }
        };
        return C;
      }, y = function(b) {
        var x = s.MODE_8BIT_BYTE, S = a.stringToBytes(b), C = {};
        return C.getMode = function() {
          return x;
        }, C.getLength = function(_) {
          return S.length;
        }, C.write = function(_) {
          for (var B = 0; B < S.length; B += 1)
            _.put(S[B], 8);
        }, C;
      }, $ = function(b) {
        var x = s.MODE_KANJI, S = a.stringToBytesFuncs.SJIS;
        if (!S)
          throw "sjis not supported.";
        (function(B, M) {
          var p = S(B);
          if (p.length != 2 || (p[0] << 8 | p[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var C = S(b), _ = {};
        return _.getMode = function() {
          return x;
        }, _.getLength = function(B) {
          return ~~(C.length / 2);
        }, _.write = function(B) {
          for (var M = C, p = 0; p + 1 < M.length; ) {
            var T = (255 & M[p]) << 8 | 255 & M[p + 1];
            if (33088 <= T && T <= 40956)
              T -= 33088;
            else if (57408 <= T && T <= 60351)
              T -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + T;
            T = (T >>> 8 & 255) * 192 + (T & 255), B.put(T, 13), p += 2;
          }
          if (p < M.length)
            throw "illegal char at " + (p + 1);
        }, _;
      }, k = function() {
        var b = [], x = {};
        return x.writeByte = function(S) {
          b.push(S & 255);
        }, x.writeShort = function(S) {
          x.writeByte(S), x.writeByte(S >>> 8);
        }, x.writeBytes = function(S, C, _) {
          C = C || 0, _ = _ || S.length;
          for (var B = 0; B < _; B += 1)
            x.writeByte(S[B + C]);
        }, x.writeString = function(S) {
          for (var C = 0; C < S.length; C += 1)
            x.writeByte(S.charCodeAt(C));
        }, x.toByteArray = function() {
          return b;
        }, x.toString = function() {
          var S = "";
          S += "[";
          for (var C = 0; C < b.length; C += 1)
            C > 0 && (S += ","), S += b[C];
          return S += "]", S;
        }, x;
      }, R = function() {
        var b = 0, x = 0, S = 0, C = "", _ = {}, B = function(p) {
          C += String.fromCharCode(M(p & 63));
        }, M = function(p) {
          if (!(p < 0)) {
            if (p < 26)
              return 65 + p;
            if (p < 52)
              return 97 + (p - 26);
            if (p < 62)
              return 48 + (p - 52);
            if (p == 62)
              return 43;
            if (p == 63)
              return 47;
          }
          throw "n:" + p;
        };
        return _.writeByte = function(p) {
          for (b = b << 8 | p & 255, x += 8, S += 1; x >= 6; )
            B(b >>> x - 6), x -= 6;
        }, _.flush = function() {
          if (x > 0 && (B(b << 6 - x), b = 0, x = 0), S % 3 != 0)
            for (var p = 3 - S % 3, T = 0; T < p; T += 1)
              C += "=";
        }, _.toString = function() {
          return C;
        }, _;
      }, F = function(b) {
        var x = b, S = 0, C = 0, _ = 0, B = {};
        B.read = function() {
          for (; _ < 8; ) {
            if (S >= x.length) {
              if (_ == 0)
                return -1;
              throw "unexpected end of file./" + _;
            }
            var p = x.charAt(S);
            if (S += 1, p == "=")
              return _ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            C = C << 6 | M(p.charCodeAt(0)), _ += 6;
          }
          var T = C >>> _ - 8 & 255;
          return _ -= 8, T;
        };
        var M = function(p) {
          if (65 <= p && p <= 90)
            return p - 65;
          if (97 <= p && p <= 122)
            return p - 97 + 26;
          if (48 <= p && p <= 57)
            return p - 48 + 52;
          if (p == 43)
            return 62;
          if (p == 47)
            return 63;
          throw "c:" + p;
        };
        return B;
      }, Y = function(b, x) {
        var S = b, C = x, _ = new Array(b * x), B = {};
        B.setPixel = function(O, A, J) {
          _[A * S + O] = J;
        }, B.write = function(O) {
          O.writeString("GIF87a"), O.writeShort(S), O.writeShort(C), O.writeByte(128), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(0), O.writeByte(255), O.writeByte(255), O.writeByte(255), O.writeString(","), O.writeShort(0), O.writeShort(0), O.writeShort(S), O.writeShort(C), O.writeByte(0);
          var A = 2, J = p(A);
          O.writeByte(A);
          for (var te = 0; J.length - te > 255; )
            O.writeByte(255), O.writeBytes(J, te, 255), te += 255;
          O.writeByte(J.length - te), O.writeBytes(J, te, J.length - te), O.writeByte(0), O.writeString(";");
        };
        var M = function(O) {
          var A = O, J = 0, te = 0, ce = {};
          return ce.write = function(ie, pe) {
            if (ie >>> pe)
              throw "length over";
            for (; J + pe >= 8; )
              A.writeByte(255 & (ie << J | te)), pe -= 8 - J, ie >>>= 8 - J, te = 0, J = 0;
            te = ie << J | te, J = J + pe;
          }, ce.flush = function() {
            J > 0 && A.writeByte(te);
          }, ce;
        }, p = function(O) {
          for (var A = 1 << O, J = (1 << O) + 1, te = O + 1, ce = T(), ie = 0; ie < A; ie += 1)
            ce.add(String.fromCharCode(ie));
          ce.add(String.fromCharCode(A)), ce.add(String.fromCharCode(J));
          var pe = k(), Ce = M(pe);
          Ce.write(A, te);
          var qe = 0, ve = String.fromCharCode(_[qe]);
          for (qe += 1; qe < _.length; ) {
            var fe = String.fromCharCode(_[qe]);
            qe += 1, ce.contains(ve + fe) ? ve = ve + fe : (Ce.write(ce.indexOf(ve), te), ce.size() < 4095 && (ce.size() == 1 << te && (te += 1), ce.add(ve + fe)), ve = fe);
          }
          return Ce.write(ce.indexOf(ve), te), Ce.write(J, te), Ce.flush(), pe.toByteArray();
        }, T = function() {
          var O = {}, A = 0, J = {};
          return J.add = function(te) {
            if (J.contains(te))
              throw "dup key:" + te;
            O[te] = A, A += 1;
          }, J.size = function() {
            return A;
          }, J.indexOf = function(te) {
            return O[te];
          }, J.contains = function(te) {
            return typeof O[te] < "u";
          }, J;
        };
        return B;
      }, D = function(b, x, S) {
        for (var C = Y(b, x), _ = 0; _ < x; _ += 1)
          for (var B = 0; B < b; B += 1)
            C.setPixel(B, _, S(B, _));
        var M = k();
        C.write(M);
        for (var p = R(), T = M.toByteArray(), O = 0; O < T.length; O += 1)
          p.writeByte(T[O]);
        return p.flush(), "data:image/gif;base64," + p;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var l = [], r = 0; r < o.length; r++) {
            var i = o.charCodeAt(r);
            i < 128 ? l.push(i) : i < 2048 ? l.push(
              192 | i >> 6,
              128 | i & 63
            ) : i < 55296 || i >= 57344 ? l.push(
              224 | i >> 12,
              128 | i >> 6 & 63,
              128 | i & 63
            ) : (r++, i = 65536 + ((i & 1023) << 10 | o.charCodeAt(r) & 1023), l.push(
              240 | i >> 18,
              128 | i >> 12 & 63,
              128 | i >> 6 & 63,
              128 | i & 63
            ));
          }
          return l;
        }
        return s(a);
      };
    })(), (function(a) {
      e.exports = a();
    })(function() {
      return n;
    });
  })(Da)), Da.exports;
}
var a5 = n5();
const s5 = /* @__PURE__ */ t5(a5), o5 = ["width", "height", "viewBox"], l5 = ["width", "height"], r5 = ["d"], i5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = L(() => {
      const a = s5(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let l = 0; l < s; l += 1)
        for (let r = 0; r < s; r += 1)
          a.isDark(l, r) && o.push(`M${r + 4} ${l + 4}h1v1h-1z`);
      return { count: s + 8, path: o.join("") };
    });
    return (a, s) => (c(), h("svg", {
      class: "qr",
      width: e.size,
      height: e.size,
      viewBox: `0 0 ${n.value.count} ${n.value.count}`,
      "shape-rendering": "crispEdges",
      role: "img",
      "aria-label": "QR code"
    }, [
      v("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, l5),
      v("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, r5)
    ], 8, o5));
  }
}, P8 = /* @__PURE__ */ K(i5, [["__scopeId", "data-v-b4458227"]]), c5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: ge({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, j8 = /* @__PURE__ */ K(c5, [["__scopeId", "data-v-79847aff"]]);
function q8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const F8 = ci(() => import("./VoiceFigure-CdfvMH8t.mjs").then((e) => e.V)), W8 = "1.2.0", H8 = "3.5";
export {
  fd as $,
  Se as A,
  Oe as B,
  ta as C,
  et as D,
  Kx as E,
  hb as F,
  P4 as G,
  zx as H,
  Gy as I,
  wb as J,
  Ct as K,
  f5 as L,
  Cs as M,
  _b as N,
  bb as O,
  ea as P,
  ux as Q,
  v4 as R,
  In as S,
  px as T,
  c4 as U,
  _e as V,
  Fn as W,
  i4 as X,
  r4 as Y,
  dd as Z,
  K as _,
  Q5 as a,
  Rx as a$,
  Mb as a0,
  y4 as a1,
  b4 as a2,
  Te as a3,
  O4 as a4,
  C4 as a5,
  Mt as a6,
  w4 as a7,
  W4 as a8,
  W5 as a9,
  Mx as aA,
  rx as aB,
  Ny as aC,
  V4 as aD,
  G4 as aE,
  Yx as aF,
  Tr as aG,
  mx as aH,
  dn as aI,
  K5 as aJ,
  U5 as aK,
  Px as aL,
  fn as aM,
  Wx as aN,
  D4 as aO,
  ix as aP,
  cx as aQ,
  lx as aR,
  an as aS,
  wt as aT,
  H5 as aU,
  _v as aV,
  sx as aW,
  p4 as aX,
  Cr as aY,
  Nt as aZ,
  qt as a_,
  Ix as aa,
  qx as ab,
  Z5 as ac,
  u4 as ad,
  d4 as ae,
  E4 as af,
  A4 as ag,
  T4 as ah,
  a4 as ai,
  Po as aj,
  k4 as ak,
  F4 as al,
  Qx as am,
  ex as an,
  X4 as ao,
  Z4 as ap,
  R4 as aq,
  S4 as ar,
  M4 as as,
  _4 as at,
  hx as au,
  q4 as av,
  H4 as aw,
  n8 as ax,
  Yt as ay,
  z4 as az,
  Db as b,
  t8 as b$,
  cb as b0,
  Fx as b1,
  yx as b2,
  vx as b3,
  Jv as b4,
  gr as b5,
  Cx as b6,
  j4 as b7,
  sa as b8,
  ot as b9,
  wx as bA,
  _x as bB,
  ct as bC,
  gx as bD,
  Ex as bE,
  U4 as bF,
  tx as bG,
  K4 as bH,
  Re as bI,
  N4 as bJ,
  Ax as bK,
  u8 as bL,
  d8 as bM,
  q5 as bN,
  Cv as bO,
  B4 as bP,
  kx as bQ,
  e4 as bR,
  Xx as bS,
  bx as bT,
  xx as bU,
  $x as bV,
  I4 as bW,
  Dy as bX,
  L4 as bY,
  J4 as bZ,
  Zx as b_,
  Sx as ba,
  Sa as bb,
  Hl as bc,
  s8 as bd,
  r8 as be,
  fx as bf,
  Dx as bg,
  F5 as bh,
  Q4 as bi,
  o8 as bj,
  x4 as bk,
  $4 as bl,
  o4 as bm,
  g4 as bn,
  G5 as bo,
  Lx as bp,
  t4 as bq,
  n4 as br,
  l4 as bs,
  ax as bt,
  kv as bu,
  Hx as bv,
  yb as bw,
  s4 as bx,
  Y5 as by,
  nx as bz,
  Yv as c,
  O5 as c$,
  V5 as c0,
  z5 as c1,
  Y4 as c2,
  i8 as c3,
  Bs as c4,
  c8 as c5,
  Vr as c6,
  Nx as c7,
  h4 as c8,
  f4 as c9,
  _8 as cA,
  w5 as cB,
  W8 as cC,
  H8 as cD,
  A5 as cE,
  A8 as cF,
  Qa as cG,
  L5 as cH,
  o0 as cI,
  $t as cJ,
  rs as cK,
  Jn as cL,
  $5 as cM,
  C5 as cN,
  Ii as cO,
  xg as cP,
  L8 as cQ,
  S5 as cR,
  P8 as cS,
  Qb as cT,
  Qi as cU,
  $8 as cV,
  Sd as cW,
  g5 as cX,
  D5 as cY,
  Lw as cZ,
  Zn as c_,
  Sv as ca,
  J5 as cb,
  gb as cc,
  ox as cd,
  _s as ce,
  Ty as cf,
  dx as cg,
  Jt as ch,
  Lt as ci,
  k5 as cj,
  S8 as ck,
  de as cl,
  Yu as cm,
  nd as cn,
  vs as co,
  am as cp,
  xl as cq,
  N8 as cr,
  j5 as cs,
  $p as ct,
  Qt as cu,
  f8 as cv,
  d5 as cw,
  kt as cx,
  Su as cy,
  ye as cz,
  He as d,
  C8 as d$,
  Et as d0,
  ht as d1,
  Z1 as d2,
  rc as d3,
  I5 as d4,
  v5 as d5,
  Pt as d6,
  E8 as d7,
  D8 as d8,
  Yr as d9,
  h8 as dA,
  m5 as dB,
  O8 as dC,
  Qg as dD,
  aw as dE,
  y5 as dF,
  E5 as dG,
  v8 as dH,
  b8 as dI,
  We as dJ,
  x5 as dK,
  M5 as dL,
  g8 as dM,
  Ip as dN,
  p5 as dO,
  h5 as dP,
  hl as dQ,
  ml as dR,
  nu as dS,
  b5 as dT,
  it as dU,
  q8 as dV,
  sw as dW,
  R5 as dX,
  p8 as dY,
  M8 as dZ,
  tw as d_,
  Eu as da,
  bt as db,
  T5 as dc,
  oa as dd,
  F8 as de,
  j8 as df,
  $s as dg,
  y8 as dh,
  hs as di,
  d1 as dj,
  mo as dk,
  Xl as dl,
  eu as dm,
  I8 as dn,
  R8 as dp,
  ms as dq,
  Qc as dr,
  il as ds,
  _5 as dt,
  B8 as du,
  P5 as dv,
  N5 as dw,
  B5 as dx,
  m8 as dy,
  Kf as dz,
  m4 as e,
  og as e0,
  tl as e1,
  zw as e2,
  hg as e3,
  w8 as e4,
  Xa as e5,
  k8 as e6,
  x8 as e7,
  ft as e8,
  T8 as e9,
  tu as ea,
  wv as f,
  a8 as g,
  sn as h,
  Ux as i,
  l8 as j,
  Vx as k,
  Bx as l,
  Wb as m,
  Os as n,
  jx as o,
  X5 as p,
  Gx as q,
  zr as r,
  Ur as s,
  Ae as t,
  Xv as u,
  Ox as v,
  e8 as w,
  Tx as x,
  mn as y,
  Jx as z
};
