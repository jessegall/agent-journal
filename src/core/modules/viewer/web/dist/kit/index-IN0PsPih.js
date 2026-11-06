/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as ge, unref as j, renderSlot as ue, createElementVNode as v, normalizeClass as Z, Fragment as G, renderList as ee, defineComponent as Zr, Comment as Xr, h as Gn, cloneVNode as Qr, createBlock as H, withCtx as q, createVNode as N, toDisplayString as w, createCommentVNode as E, inject as Ee, useAttrs as Kn, computed as I, ref as R, resolveDynamicComponent as St, mergeProps as Ge, createTextVNode as Q, watch as he, onUnmounted as Le, onMounted as Be, Teleport as cs, useId as us, resolveDirective as ei, withDirectives as Qe, reactive as ds, shallowRef as Ve, nextTick as dt, Transition as Dt, withModifiers as xe, TransitionGroup as Yo, shallowReactive as ti, isRef as Ps, onBeforeUnmount as _t, onScopeDispose as fs, resolveComponent as ni, useModel as Pa, getCurrentInstance as ai, mergeModels as ja, getCurrentScope as Jo, provide as si, onErrorCaptured as oi, toHandlers as li, createSlots as ri, vShow as Zo, useSlots as ii, withKeys as Xt, vModelText as qa, defineAsyncComponent as ci } from "vue";
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
      style: ge(j(t))
    }, null, 4));
  }
}, Vt = /* @__PURE__ */ K(di, [["__scopeId", "data-v-6c018b03"]]), fi = { class: "skeleton-line" }, hi = 2e3, mi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Xo(hi);
    return (n, a) => (c(), h("span", fi, [
      ue(n.$slots, "default", {}, void 0, !0),
      v("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(G, null, ee(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: ge({ ...j(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ht = /* @__PURE__ */ K(mi, [["__scopeId", "data-v-484fe8a0"]]), Pt = Zr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Xr);
      return a.length !== 1 ? Gn(G, { key: n }, a) : a[0].key == null ? Qr(a[0], { key: n }) : a[0];
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
      messages: q(() => [
        v("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(G, null, ee(t, (d) => N(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, pi)
      ]),
      older: q(() => [
        v("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, ee(t.slice(0, 3), (d) => (c(), H(Vt, {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: ge({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, gi)
      ]),
      cards: q(() => [
        v("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, ee(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(G, null, ee(n, (f) => N(ht, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, vi)
      ]),
      file: q(() => [
        v("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, ee(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(ht, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(G, null, ee(s, (f) => N(ht, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, yi)
      ]),
      page: q(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(ht, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(G, null, ee(e.count, (d) => (c(), H(ht, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, bi)
      ]),
      text: q(() => [
        v("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, ee(e.count, (d) => (c(), H(ht, {
            key: d,
            bars: j(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, wi)
      ]),
      default: q(() => [
        v("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, ee(e.count, (d) => (c(), H(ht, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ki)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ K(xi, [["__scopeId", "data-v-ef519c5f"]]), $i = {
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
}, Qt = /* @__PURE__ */ K(Ei, [["__scopeId", "data-v-b27e89b0"]]), Ai = { class: "fold-group" }, Ci = ["aria-expanded"], Oi = { class: "fold-label" }, Ti = {
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
}, i5 = /* @__PURE__ */ K(Ri, [["__scopeId", "data-v-9ef1865c"]]), Ii = Symbol("open-view"), Te = Symbol.for("journal.window-context");
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
}, Di = /* @__PURE__ */ K(Ni, [["__scopeId", "data-v-eb453d6f"]]), Pi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Kn(), a = I(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = R(!1), o = I(() => t.busy || s.value), l = Ee(Te, null), r = I(() => o.value || t.disabled || !!(l != null && l.readOnly));
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
      type: e.href ? void 0 : j(n).type || "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: q(() => [
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
}), de = /* @__PURE__ */ K(Pi, [["__scopeId", "data-v-ededdadf"]]), ji = {
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
        default: q(() => [
          Q(w(e.loading ? "Loading" : e.label), 1)
        ]),
        _: 1
      }, 8, ["disabled"])) : E("", !0)
    ])) : E("", !0);
  }
}, Yn = /* @__PURE__ */ K(Fi, [["__scopeId", "data-v-10464014"]]), Wi = {
  key: 0,
  class: "resource-links",
  "data-resource-links": ""
}, Hi = ["disabled", "onClick"], zi = { class: "type" }, Ui = { class: "title" }, Vi = { class: "relations" }, Gi = {
  key: 0,
  class: "unavailable"
}, Ki = { key: 0 }, Yi = {
  __name: "ResourceLinks",
  props: {
    model: { type: String, required: !0 },
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    documentId: { type: Number, default: 0 },
    pageSize: { type: Number, default: 10 },
    changes: { type: Number, default: 0 },
    linkAttribute: { type: String, default: "data-resource-link" },
    empty: { type: String, default: "" }
  },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R([]), o = R(null), l = R(!1), r = R("");
    let i = 0;
    const u = (b) => b.endpoint.model === "doc" && b.endpoint.id === n.documentId, d = I(() => [...s.value].sort((b, A) => Number(u(A)) - Number(u(b)))), f = (b) => b.endpoint.unavailable || !b.endpoint.open_ref, m = (b) => ({ [n.linkAttribute]: !0, "data-link-model": b.endpoint.model, "data-link-id": b.endpoint.id });
    async function g(b = 1) {
      const A = ++i;
      l.value = !0, r.value = "";
      const D = ["link", "list", "--row", `${n.model}:${n.id}`, "--group-counterparts", "--page", String(b), "--page-size", String(n.pageSize)];
      n.documentId && D.push("--first-counterpart", `doc:${n.documentId}`);
      try {
        const Y = await n.read(D);
        if (A !== i) return;
        if (!Y.ok) {
          r.value = Y.error;
          return;
        }
        const P = Y.value.counterparts ?? [], x = b === 1 ? P : [...s.value, ...P];
        s.value = [...new Map(x.map(($) => [`${$.endpoint.model}:${$.endpoint.id}`, $])).values()], o.value = Y.value.next_page ?? null;
      } catch (Y) {
        A === i && (r.value = Y.message);
      } finally {
        A === i && (l.value = !1);
      }
    }
    function y(b) {
      if (f(b)) return;
      const [A, D] = b.endpoint.open_ref.split(":");
      a("open", { table: A, id: Number(D) });
    }
    const k = () => !l.value && o.value && g(o.value);
    return he(() => `${n.model}:${n.id}:${n.documentId}:${n.changes}`, () => {
      s.value = [], o.value = null, g();
    }, { immediate: !0 }), (b, A) => d.value.length || l.value || r.value || e.empty ? (c(), h("section", Wi, [
      (c(!0), h(G, null, ee(d.value, (D) => (c(), h("button", Ge({
        key: `${D.endpoint.model}:${D.endpoint.id}`,
        type: "button",
        class: "resource-link"
      }, { ref_for: !0 }, m(D), {
        disabled: f(D),
        onClick: (Y) => y(D)
      }), [
        v("span", zi, w(u(D) ? "Design document" : D.endpoint.model.replaceAll("_", " ")) + " " + w(D.endpoint.id), 1),
        v("span", Ui, w(D.endpoint.title), 1),
        v("span", Vi, w(D.relations.join(", ")), 1),
        f(D) ? (c(), h("span", Gi, "Unavailable")) : E("", !0)
      ], 16, Hi))), 128)),
      !d.value.length && !l.value && !r.value && e.empty ? (c(), h("p", Ki, w(e.empty), 1)) : E("", !0),
      N(Yn, {
        more: !!o.value,
        loading: l.value,
        failure: r.value,
        label: "More linked items",
        onMore: k
      }, null, 8, ["more", "loading", "failure"])
    ])) : E("", !0);
  }
}, Ji = /* @__PURE__ */ K(Yi, [["__scopeId", "data-v-cb36876d"]]), Zi = (e, t, n) => Math.max(t, Math.min(n, e)), Xi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, el = /* @__PURE__ */ new WeakMap(), Qi = (e, t) => el.set(e, t);
function ec(e, t) {
  for (let n = t; n; n = el.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function tl(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !ec(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Le(() => window.removeEventListener("click", n));
}
const Ot = 8, tc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = R(null), o = (p) => p ? `${p}px` : void 0, l = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), r = R({ w: 0, h: 0 }), i = R(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const O = p.closest(".pane, .float-window");
      return O ? d(O.getBoundingClientRect()) : u();
    }, m = (p, O) => `${Math.max(0, p ? Math.min(p, O) : O)}px`;
    function g(p, O) {
      return {
        below: p.bottom - O.bottom - a.gap - Ot,
        above: O.top - p.top - a.gap - Ot,
        across: p.right - p.left - 2 * Ot
      };
    }
    function y(p) {
      const O = f(a.anchor), C = g(O, p);
      return r.value.w <= C.across && r.value.h <= Math.max(C.below, C.above) ? O : u();
    }
    const k = I(() => {
      if (!i.value) return l.value;
      const p = i.value, O = y(p), C = g(O, p), { w: _, h: J } = r.value, te = a.align === "auto" ? p.left + p.right > O.left + O.right : a.align === "right", ce = Zi(te ? p.right - _ : p.left, O.left + Ot, Math.max(O.left + Ot, O.right - _ - Ot)), pe = J > C.below && C.above > C.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, C.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, C.below) };
      return { ...l.value, ...pe, left: `${ce}px`, maxWidth: m(a.maxWidth, C.across) };
    }), b = n, A = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function D(p) {
      const O = A(), C = O.indexOf(document.activeElement);
      O[(C + p + O.length) % O.length].focus();
    }
    const Y = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => b("close") }, P = (p) => Y[p.key] && (p.preventDefault(), Y[p.key]()), x = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let $ = 0;
    const T = new ResizeObserver(() => {
      cancelAnimationFrame($), $ = requestAnimationFrame(x);
    });
    tl(s, (p) => a.anchor && !a.anchor.contains(p.target) && b("close"));
    const L = (p, O) => ["top", "left", "right", "bottom"].some((C) => Math.abs(p[C] - O[C]) > 1), S = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let B = 0;
    function M() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || S(p)) return b("close");
        L(p, i.value) && (i.value = p);
      }
      B = requestAnimationFrame(M);
    }
    return Be(() => {
      a.anchor && s.value && Qi(s.value, a.anchor), x(), s.value && T.observe(s.value), !a.plain && A()[0] && A()[0].focus(), M();
    }), Le(() => {
      T.disconnect(), cancelAnimationFrame(B), cancelAnimationFrame($);
    }), t({ element: s }), (p, O) => (c(), H(cs, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: k.value,
        onKeydown: P
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Jn = /* @__PURE__ */ K(tc, [["__scopeId", "data-v-3d203970"]]), nc = { class: "split-button" }, ac = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = R(null), s = R(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", nc, [
      N(de, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: q(() => [
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
          default: q(() => [
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
        default: q(() => [
          ue(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : E("", !0)
    ]));
  }
}, sc = /* @__PURE__ */ K(ac, [["__scopeId", "data-v-c258494d"]]), oc = ["aria-checked", "aria-haspopup", "onClick"], lc = {
  key: 0,
  class: "segmented-dot"
}, rc = {
  key: 1,
  class: "segmented-note"
}, ic = {
  key: 2,
  class: "segmented-count"
}, cc = {
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
        (c(!0), h(G, null, ee(e.options, (r) => Qe((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: Z(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", lc)) : E("", !0),
          Q(" " + w(r.label) + " ", 1),
          r.note ? (c(), h("small", rc, w(r.note), 1)) : E("", !0),
          r.count !== void 0 ? (c(), h("em", ic, w(r.count), 1)) : E("", !0)
        ], 10, oc)), [
          [l, r.tip || r.title, `${j(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Zn = /* @__PURE__ */ K(cc, [["__scopeId", "data-v-c89bc92d"]]), nl = typeof document < "u" && document.documentElement.classList.contains("phone");
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
const Wa = "journal.stale-build-reload", uc = 'script[type="module"][src*="/assets/index-"]', js = (e) => {
  var t;
  return ((t = e.querySelector(uc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function dc(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => al(window)) {
  const a = js(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = js(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ia = "";
function fc(e, t = () => al(window)) {
  if (!e) return !1;
  const n = !!ia && ia !== e;
  return ia = e, n && t(), n;
}
const hc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function mc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Wa) === e.message) return !1;
    t.setItem(Wa, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function pc(e = window.sessionStorage) {
  try {
    e.removeItem(Wa);
  } catch {
    return;
  }
}
const gc = 2e3, vc = 3e4, Fe = ds({ starting: !1, external: !1, late: !1, offline: !1 }), sl = () => Fe.starting, yc = 3;
let gn = 0, Ha = 0, ol = 0, ll = [];
async function bc() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: Fe.external };
  }
}
let qs = null;
const wc = () => qs ?? (qs = bc().finally(() => qs = null));
function kc() {
  clearTimeout(Ha), clearTimeout(ol), Ha = 0, Object.assign(Fe, { starting: !1, external: !1, late: !1, offline: !1 }), ll.splice(0).forEach((e) => e()), dc();
}
async function xc() {
  Fe.offline = !navigator.onLine;
  const e = await wc();
  if (Fe.external = e.updating, gn = !e.restarting && !e.updating && e.reachable ? gn + 1 : 0, gn < yc) return;
  gn = 0, (!fc(e.started_at) || Fa()) && kc();
}
function rl() {
  Ha = setTimeout(async () => {
    await xc(), Fe.starting && rl();
  }, gc);
}
function $c() {
  Fe.starting || (Fe.starting = !0, Fe.offline = !navigator.onLine, rl(), ol = setTimeout(() => Fe.late = !0, vc));
}
const Mc = () => Fe.starting ? new Promise((e) => ll.push(e)) : Promise.resolve();
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
function Sc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class _c {
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = Sc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const tt = "viewer.shell", vn = 2e4, Ec = 4, Fs = "/api/read-lines", Ac = 5e3, Cc = 403, Ws = "/api/repeated-lines", Oc = 10, Tc = 2e3, Rc = 3e5, c5 = 6e5, yn = 6, Ic = 500, Bc = "/journal/summary", Hs = "/api/server-state", Lc = 2e4, bn = nl ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Nc = (e) => e.split("?")[0].endsWith(Bc), za = (e, t) => Object.assign(new Error(t), { status: e });
async function Dc(e, t, n = za) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Pc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), jc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), zs = (e) => e.split(" ").slice(0, 2).join(" "), st = "read", Rt = "write", qc = "stream";
class Fc {
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
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < Tc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < Oc || this.reportedLines.has(s)) return;
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
    const o = this.took(a, t), l = s ? { ...n, signal: jc(n.signal, s) } : n;
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
      throw o instanceof TypeError && $c(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= Ec ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Fs, { headers: bn }, [{ window: tt, line: Fs, kind: st }], Ac).then(async (t) => {
      if (t.status === Cc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw za(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new _c(
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
    const r = a instanceof FormData, i = { method: t, headers: { ...bn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: Pc(a) }, u = s || (r ? Rc : vn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: tt, line: n, kind: st }], u)) : await this.sent(n, i, [{ window: tt, line: n, kind: Rt }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, Ic)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = yn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = await this.reach(t, n, a, s, o, l).finally(() => {
      this.watcher("answered", t, n, a);
    });
    return Dc(r, `${r.status} ${r.statusText}`).catch((i) => {
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
    return t !== "GET" ? this.send(t, n, a, s, yn, o).then((r) => (this.written(n), r)) : sl() && !Nc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: tt, line: t, kind: qc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Hs, { cache: "no-store" }, [{ window: tt, line: Hs, kind: st }], Lc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = tt, line: s = t, limit: o = vn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? st : Rt;
    return l === Rt ? this.held(() => this.sent(t, n, [{ window: a, line: s, kind: l }], 0)) : this.held(() => this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o)), !0);
  }
}
const ca = Symbol.for("journal.transport"), Ae = globalThis[ca] ?? (globalThis[ca] = new Fc()), Wc = 0, Hc = "/api/lines", zc = "/api/line", Us = 5e3, Vs = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Gs = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), ua = (e) => JSON.stringify(e.line), Ks = () => new DOMException("cancelled", "AbortError");
class Uc {
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
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), Wc));
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
      const o = await Ae.sent(Hc, Vs({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Gs(r.body, st)), Us);
      if (!o.ok) throw new Error(`the journal answered ${o.status} to a batch of lines`);
      const { answers: l } = await o.json();
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
      const a = await Ae.sent(zc, Vs(t.body, t.signal), [Gs(t.body, n)], n === st ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const cl = new Uc(), Vc = 150, Gc = () => Vc;
function hs(e, t, n = Gc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Kc {
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
class Yc {
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
function u5(e, t) {
  const n = new Yc(e, t);
  return dl.set(e, n), n.load().catch(() => {
  }), n;
}
const ms = (e) => dl.get(e);
function Jc(e, t, n) {
  const a = ms(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Zc(e, t) {
  if (!e) return !0;
  const n = ms(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Xc = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let fl = {};
async function d5(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (fl = (await t.json()).states);
}
const ps = (e, t) => {
  var n;
  return (n = fl[e]) == null ? void 0 : n[t];
}, hl = (e, t) => {
  var n;
  return ((n = ps(e, t)) == null ? void 0 : n.label) ?? Xc(t);
}, ml = (e, t) => {
  var n;
  return ((n = ps(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Qc = (e, t) => {
  var n;
  return ((n = ps(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, eu = Symbol("pane-page"), tu = Symbol("inspector-host"), nu = { 1: "refused", 2: "usage", 3: "fault" }, au = 100, su = 50, ou = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, lu = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function ru({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = R({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: g = [], sources: y = [], links: k = {}, search: b = {}, readOnly: A = !1, shared: D = null }) {
  const Y = /* @__PURE__ */ new Map(), P = new AbortController(), x = R(!1), $ = performance.now();
  let T = 0, L = 0, S = () => {
  };
  const B = new Promise((_) => S = _);
  P.signal.addEventListener("abort", S, { once: !0 });
  const M = () => {
    clearTimeout(L), L = setTimeout(() => {
      T === 0 && hs($, () => {
        x.value = !0, S();
      });
    }, su);
  }, p = (_, J) => (T += 1, lt(e, _, t, P.signal, J).finally(() => {
    T -= 1, M();
  })), O = (_, J) => (M(), B.then(() => P.signal.aborted ? xt : lt(e, _, t, P.signal, J))), C = (_, { unbatched: J = !1, deferred: te = !1 } = {}) => {
    const ce = Y.get(_);
    if (ce && performance.now() - ce.at < au) return ce.answer;
    const ie = te && !x.value ? O(_, J) : p(_, J);
    return Y.set(_, { answer: ie, at: performance.now() }), ie;
  };
  return {
    answered: x,
    settle: M,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: g,
    sources: y,
    links: k,
    search: b,
    readOnly: A,
    shared: D,
    read: C,
    run: (_) => lt(e, _, t, P.signal),
    upload: (_) => uu(_, e, P.signal),
    cancel: () => P.abort(),
    signal: P.signal,
    subscriptions: l,
    follow: (_, J) => l.follow(e, _.filter((te) => o.some((ce) => ul(ce, te))), (te) => {
      Y.clear(), J(te);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (_) => I(() => {
      var J;
      return i.value[_] ?? ((J = u.find((te) => te.key === _)) == null ? void 0 : J.default);
    }),
    setting: async (_, J) => {
      const te = await C(`window setting ${e} ${_}`);
      return te.ok ? te.value.value : J;
    },
    setOption: f,
    keep: (_, J) => lt(e, ["window", "save-setting", e, _, JSON.stringify(J)], t, P.signal)
  };
}
function iu(e) {
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
    return t != null && t.aborted ? xt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: nu[n.code] || "fault", error: iu(n.error) };
  } catch {
    return t != null && t.aborted ? xt : { ok: !1, failure: "unreachable", error: pl };
  }
}
async function vl(e, t, n) {
  const a = await gl(() => cl.read(e, t, n), t);
  return a.failure !== "unreachable" || !sl() ? a : (await Mc(), t.aborted ? xt : vl(e, t, n));
}
function lt(e, t, n, a = void 0, s = !1) {
  return Ae.held(() => cu(e, t, n, a, s), Ae.knownRead(Array.isArray(t) ? t : gs(t)));
}
async function cu(e, t, n, a, s) {
  const o = { window: e, line: Array.isArray(t) ? t : gs(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (l, r) => vl({ ...o, attribution: r }, l, s), a, o).catch(() => xt) : gl(() => cl.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function uu(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? xt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? xt : { ok: !1, failure: "unreachable", error: pl };
  }
}
function gs(e) {
  return [...e.matchAll(ou)].map(([t]) => t.replace(lu, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const du = (e) => `show-${e}`, f5 = (e, t, n) => e.filter((a) => {
  var s;
  return n(du((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), yl = "messages.chat", fu = {
  key: 0,
  class: "template-brief"
}, hu = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, mu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R([]), o = R(""), l = I(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = I(() => s.value.find((u) => String(u.id) === n.value));
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
    return i(), (u, d) => (c(), h(G, null, [
      N(Zn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", fu, w(r.value.brief), 1)) : E("", !0),
      o.value ? (c(), h("p", hu, w(o.value), 1)) : E("", !0)
    ], 64));
  }
}, pu = /* @__PURE__ */ K(mu, [["__scopeId", "data-v-14be8a5c"]]), gu = { class: "form-field" }, vu = { class: "form-field-head" }, yu = ["for"], bu = {
  key: 0,
  class: "form-field-aside"
}, wu = {
  key: 0,
  class: "form-field-help"
}, ku = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", gu, [
      v("div", vu, [
        v("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, yu),
        t.$slots.aside ? (c(), h("span", bu, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", wu, w(e.help), 1)) : E("", !0)
    ]));
  }
}, xu = /* @__PURE__ */ K(ku, [["__scopeId", "data-v-dd7cdcff"]]), Ua = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, $u = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Kn(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Qe((c(), h("textarea", Ge({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [j(Ua), j(t).value]
    ]);
  }
}), Mu = /* @__PURE__ */ K($u, [["__scopeId", "data-v-e130a5b9"]]), Su = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = us(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), H(xu, {
      label: e.field.label,
      for: j(s),
      "data-button-field": e.field.name
    }, {
      default: q(() => [
        N(Pt, { value: o.value }, {
          choice: q(() => [
            N(Zn, {
              id: j(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: q(() => [
            N(pu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: q(() => [
            N(Mu, {
              id: j(s),
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
      default: q(() => [
        N(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function _u(e, t, n, a = () => window) {
  Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Le(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Eu = (e, t = () => !0) => _u("keydown", (n) => n.key === "Escape" && t() && e());
function bl(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = R(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Eu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Au = 80, Tt = ds([]);
function wl(e) {
  const t = Symbol("layer"), n = () => Tt.includes(t) && Tt.splice(Tt.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Tt.includes(t) && Tt.push(t), a || n();
    },
    { immediate: !0 }
  ), Le(n), I(() => Au + Math.max(0, Tt.indexOf(t)));
}
let kl = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return kl = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Cu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Ou(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Cu)];
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
const Tu = ["aria-modal", "aria-label", "aria-labelledby"], Ru = {
  key: 0,
  class: "dialog-head"
}, Iu = ["id", "tabindex"], Bu = {
  key: 1,
  class: "dialog-foot"
}, Lu = 500, Nu = 400, Du = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = bl(a, n), r = wl(s), i = R(null), u = R(null), d = R(null), f = us(), m = R(!1), g = Date.now();
    n.modal && Ou(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, Nu);
    }
    function k(D) {
      !n.modal || Date.now() - g >= Lu || ![" ", "Enter"].includes(D.key) || (D.preventDefault(), D.stopPropagation());
    }
    const b = () => i.value && (i.value.scrollTop = i.value.scrollHeight), A = new MutationObserver(b);
    return he(i, (D) => {
      A.disconnect(), D && n.follow && (A.observe(D, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), Le(() => A.disconnect()), (D, Y) => (c(), H(cs, { to: "body" }, [
      N(Dt, {
        name: "dialog",
        appear: "",
        onAfterLeave: j(l)
      }, {
        default: q(() => [
          j(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: ge({ zIndex: j(r) }),
            onClick: xe(y, ["self"])
          }, [
            v("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? j(f) : void 0,
              onKeydownCapture: k
            }, [
              e.bare ? E("", !0) : (c(), h("header", Ru, [
                v("h3", {
                  id: j(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, Iu),
                e.closable ? (c(), H(vs, {
                  key: 0,
                  onClick: j(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              v("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(D.$slots, "default", {}, void 0, !0)
              ], 2),
              D.$slots.foot ? (c(), h("footer", Bu, [
                ue(D.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, Tu)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, xl = /* @__PURE__ */ K(Du, [["__scopeId", "data-v-6d1ecd98"]]), Pu = (e, t, n = {}) => gs(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function rn(e, t, n, a = {}) {
  try {
    return await Zc(e.module, n) ? lt(yl, Pu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const ju = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, da = [
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
}, qu = ["secrets", "plugins"], $l = Object.keys(Xn).filter((e) => !(nl && qu.includes(e)));
I(() => $l.map((e) => ({ name: e, ...Xn[e] })));
const jt = (e) => Xn[e], Ml = new Map($l.flatMap((e) => [e, e.replace(/s$/, ""), Xn[e].title.toLowerCase()].map((t) => [t, e]))), it = (e) => Ml.get(String(e).toLowerCase()) || "", Sl = [...Ml.keys()].sort((e, t) => t.length - e.length).join("|"), Fu = {
  class: "button-form",
  "data-button-form": ""
}, Wu = {
  key: 0,
  class: "button-form-title"
}, Hu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, zu = { class: "button-form-actions" }, Uu = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = R(!1), l = R(""), r = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
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
      default: q(() => {
        var m;
        return [
          v("div", Fu, [
            (m = e.row) != null && m.title ? (c(), h("p", Wu, w(e.row.title), 1)) : E("", !0),
            (c(!0), h(G, null, ee(e.button.fields, (g) => (c(), H(Su, {
              key: g.name,
              field: g,
              value: s.value[g.name],
              environment: e.environment,
              onPick: (y) => s.value[g.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", Hu, w(l.value), 1)) : E("", !0),
            v("div", zu, [
              N(de, {
                small: "",
                onClick: f[0] || (f[0] = (g) => a("close"))
              }, {
                default: q(() => [...f[2] || (f[2] = [
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
                default: q(() => [...f[3] || (f[3] = [
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
}, Vu = /* @__PURE__ */ K(Uu, [["__scopeId", "data-v-f26c27a7"]]), Gu = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ku = {
  key: 1,
  class: "menu-item-text"
}, Yu = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Gu, w(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", Ku, [
        v("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, w(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, $t = /* @__PURE__ */ K(Yu, [["__scopeId", "data-v-fec99974"]]), Ju = ["aria-busy"], Zu = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Xu = {
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
    const n = e, a = t, s = I(() => ms(n.environment)), o = I(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = I(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : Jc(n.environment, n.name, n.row)), u = R(null), d = R(""), f = R(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function g(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const k = await rn(y, n.row, n.environment);
      f.value = !1, d.value = k.ok ? "" : k.error;
      const b = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", k.ok ? "" : `Could not ${b}: ${k.error}`), k.ok && a("done");
    }
    return (y, k) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(G, { key: 0 }, [
        k[3] || (k[3] = v("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(de, {
          small: "",
          onClick: r
        }, {
          default: q(() => [...k[2] || (k[2] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? E("", !0) : (c(), h(G, { key: 1 }, [
        (c(!0), h(G, null, ee(i.value, (b) => (c(), h(G, {
          key: b.name
        }, [
          b.menu.length ? (c(), H(sc, {
            key: 0,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": b.menu_label || "More ways",
            title: m(b),
            "data-button": b.name,
            onMain: (A) => g(b)
          }, {
            menu: q(({ close: A }) => [
              (c(!0), h(G, null, ee(b.menu, (D) => (c(), H($t, {
                key: D.label,
                description: D.description,
                onClick: (Y) => (A(), g({ ...b, ...D, menu: [] }))
              }, {
                default: q(() => [
                  Q(w(D.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: q(() => [
              Q(w(b.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), H(de, {
            key: 1,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            bordered: !b.primary,
            icon: b.icon,
            disabled: f.value,
            title: m(b),
            "data-button": b.name,
            onClick: (A) => g(b)
          }, {
            default: q(() => [
              Q(w(b.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Zu, w(d.value), 1)) : E("", !0),
        u.value && !e.readOnly ? (c(), H(Vu, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: k[0] || (k[0] = (b) => u.value = null),
          onDone: k[1] || (k[1] = (b) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : E("", !0)
      ], 64))
    ], 10, Ju));
  }
}, Qu = /* @__PURE__ */ K(Xu, [["__scopeId", "data-v-a07b49a4"]]), ed = {
  class: "running",
  "data-running-command": ""
}, td = ["title"], nd = {
  key: "idle",
  class: "running-idle"
}, ad = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", ed, [
      N(Dt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: q(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, td)) : (c(), h("span", nd, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, h5 = /* @__PURE__ */ K(ad, [["__scopeId", "data-v-d3240219"]]), sd = ["aria-checked", "aria-label", "title"], od = {
  key: 0,
  class: "switch-inner"
}, ld = {
  key: 0,
  class: "switch-word"
}, rd = {
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
        e.labelled ? (c(), h("span", od, w(e.word), 1)) : E("", !0),
        s[1] || (s[1] = v("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", ld, w(e.word), 1)) : E("", !0)
    ], 10, sd));
  }
}, m5 = /* @__PURE__ */ K(rd, [["__scopeId", "data-v-1bfb90f3"]]);
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
function id(e, t) {
  return _l(() => sessionStorage, e, t);
}
function cd(e, t) {
  return El(() => sessionStorage, e, t);
}
const Nn = "journal.environment", Cl = R(id(Nn, Ln(Nn, "")));
function ud(e) {
  Cl.value = e, cd(Nn, e), ys(Nn, e);
}
const Dn = R(location.hash), Ys = Ve(null), Js = { integrations: "mcp", library: "team" };
function dd() {
  if (!Ys.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Js[n]) {
    location.replace(`#/${[Js[n], ...a].join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash;
    return;
  }
  !n || Ys.value(n) || (ud(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Dn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Dn.value = location.hash, dd();
});
const Va = I(() => {
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
function fd(e = "", t = 0, n = "") {
  location.hash = bs.page(e, t, n);
}
const hd = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Ol(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(hd).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Bt = {};
function p5(e, t) {
  return Bt[e] = t, () => Bt[e] === t && delete Bt[e];
}
function Tl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Bt[e]) != null && l.call(Bt, t))) return;
  const s = Va.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  Ol([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function md(e, t, n, a = 0, s = "") {
  if (e === Va.value.env) return Tl(t, n, a, s);
  const o = Va.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Ol([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function We(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? md(a, s, Number(o), 0, t) : Tl(s, Number(o), 0, t);
}
function pd(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function It(e) {
  const t = pd(e);
  t && We(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function g5(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const gd = { class: "inspector-part" }, vd = { class: "inspector-part-title" }, yd = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", gd, [
      v("h4", vd, w(e.title), 1),
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, v5 = /* @__PURE__ */ K(yd, [["__scopeId", "data-v-0da7fa52"]]), bd = {
  key: 1,
  class: "row-list-failure"
}, wd = ["data-row"], kd = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = R(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), H(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", bd, w(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), H(Qt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: q(() => [
        Q(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), H(St(e.arrival ? Yo : "ul"), Ge(n.value, { class: "row-list" }), {
        default: q(() => [
          (c(!0), h(G, null, ee(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ue(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, wd))), 128))
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
}, xd = /* @__PURE__ */ K(kd, [["__scopeId", "data-v-6c7ba696"]]), $d = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Md = {
  key: 1,
  class: "agent-rows-note"
}, Sd = {
  key: 2,
  class: "agent-rows-note"
}, _d = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Ed = ["data-agent-row", "onClick"], Ad = { class: "agent-row-name" }, Cd = { class: "agent-row-state" }, Od = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", $d, [
      e.loaded ? e.failure ? (c(), h("p", Md, w(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        v("p", _d, w(a.value) + " running", 1),
        (c(!0), h(G, null, ee(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => j(We)(`agents:${l.id}`)
        }, [
          v("span", Ad, "#" + w(l.id) + " " + w(l.session), 1),
          v("span", Cd, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, Ed))), 128))
      ], 64)) : (c(), h("p", Sd, w(e.none), 1)) : (c(), H(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, y5 = /* @__PURE__ */ K(Od, [["__scopeId", "data-v-a01e5a17"]]), Td = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, w(e.text), 3));
  }
}, Rl = /* @__PURE__ */ K(Td, [["__scopeId", "data-v-9e7e1157"]]), Rd = ["aria-valuenow", "aria-valuemax"], Id = {
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
    const t = e, n = I(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
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
    ], 10, Rd));
  }
}, Bd = /* @__PURE__ */ K(Id, [["__scopeId", "data-v-9eba6a85"]]), Ld = { class: "bars" }, Nd = { class: "bar-name" }, Dd = { class: "bar-value" }, Pd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", Ld, [
      (c(!0), h(G, null, ee(e.items, (i, u) => (c(), H(St(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: q(() => [
          v("span", Nd, w(i.label), 1),
          N(Bd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          v("span", Dd, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, jd = /* @__PURE__ */ K(Pd, [["__scopeId", "data-v-663427f4"]]), qd = { class: "bars" }, Fd = {
  key: 0,
  class: "bars-title"
}, Wd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", qd, [
      e.node.title ? (c(), h("span", Fd, w(e.node.title), 1)) : E("", !0),
      N(jd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Hd = /* @__PURE__ */ K(Wd, [["__scopeId", "data-v-7135bb11"]]), zd = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: ge(o.value)
    }, [
      (c(!0), h(G, null, ee(e.node.children || [], (i, u) => (c(), H(Gl, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ K(zd, [["__scopeId", "data-v-d142a3f4"]]), Ud = {
  key: 0,
  class: "card-head"
}, Vd = { class: "card-title" }, Gd = {
  key: 0,
  class: "card-note"
}, Kd = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", Ud, [
        v("span", Vd, w(e.node.title), 1),
        e.node.note ? (c(), h("span", Gd, w(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      N(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Yd = /* @__PURE__ */ K(Kd, [["__scopeId", "data-v-67b72d40"]]), Jd = { processes: "process", memories: "memory", replies: "reply" }, Gt = (e) => (Jd[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ga = [], Zd = 2e3, at = /* @__PURE__ */ new Map(), Xd = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Qd = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? Ga.unshift(e) : Ga.push(e), at.clear();
}
function Il(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const ef = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, tf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Xe(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function nf(e, t) {
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
  return af(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function af(e) {
  return e.split(Qd).map((t, n) => n % 2 ? t : t.replace(Xd, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Zs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const sf = 24;
function of(e) {
  const [t, , ...n] = e, a = Zs(t), s = n.map(Zs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > sf) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${en(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${en(u)}</td>`).join("")}</tr>`).join("");
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
function lf(e, t) {
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
      n.push(of(t.slice(a, r))), a = r;
      continue;
    }
    if (Bl.test(s)) {
      const r = lf(t, a);
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
const rf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, cf = (e) => e.type !== "text" && !rf.test(e.html);
function uf(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Nl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : cf(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function df(e, t = { env: "" }) {
  const n = tf(e, t), a = at.get(n);
  if (at.delete(n), a && a.source === t.source && a.reads.every((l) => ef(l, t)))
    return at.set(n, a), a.html;
  const s = [], o = uf(nf(e, { ...t, reads: s }));
  return at.set(n, { html: o, reads: s, source: t.source }), at.size > Zd && at.delete(at.keys().next().value), o;
}
const fa = /* @__PURE__ */ new WeakMap();
function ff(e) {
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
  const e = Ee(Te, null), t = e ? ff(e) : null;
  return (n, a = {}) => df(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Pl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, cn = (e) => String(e || "").replace(Pl, (t, n, a, s) => s), hf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), wn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, mf = /^Traceback \(most recent call last\):/m, pf = 8;
function jl(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, pf).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function gf(e) {
  const t = [...e.matchAll(hf)].map((a) => a.index);
  if (wn.lastIndex = 0, !t.length || !wn.test(e)) return null;
  wn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(wn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: jl(n), tail: "" } : null;
}
function vf(e) {
  const t = mf.exec(e);
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
  const t = cn(e), n = vf(t) || gf(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const yf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, bf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, wf = /[\w\]]\(/, kf = /^[\w$.[\]'"]+\s*=\s*[^=]/, xf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, $f = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Mf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Sf = /[[({,]$/, _f = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Ef = /^(\t|\s{2,})\S/, Af = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Cf = /`[^`]+`/, Of = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Tf = /[{}()[\];=<>$&|*\\@+^~%]/g, ql = /^\s*(?:[-*+]|\d+[.)])\s/, Rf = /^\s*>/, If = /^\s*\|/, Bf = 0.6, Lf = 0.4, Nf = 5, Df = 0.03, Fl = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Nf && t.every((n) => Of.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Tf) ?? []).length / e.length < Df;
}, ha = (e) => {
  const t = e.trim();
  return Cf.test(t) ? !1 : [yf, bf, wf, kf, xf, $f, Mf, Sf, _f].some((n) => n.test(t)) || /[;{}]$/.test(t) || Ef.test(e) && !ql.test(e) && !Fl(e);
};
function Pf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || ql.test(t[0]) || t.every((o) => Rf.test(o) || If.test(o))) return "text";
  const n = t.filter((o) => !Af.test(o.trim()));
  if (t.length === 1) return !n.length || ha(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ha).length, s = n.filter((o) => !ha(o) && Fl(o)).length;
  return a >= n.length * Bf && s <= n.length * Lf ? "code" : "text";
}
const Ya = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", jf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", qf = `${Ya} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ff = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Wf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", eo = {
  js: { keywords: Ya, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: jf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: qf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ya, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ff, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Wf, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Hf = {
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
function zf(e, t) {
  const n = eo[Hf[t] ?? t] || eo.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function Uf(e, t) {
  const n = [""];
  for (const { type: a, value: s } of zf(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? Xe(l) : `<span class="tok-${a}">${Xe(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Vf(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Gf = 1500, no = /* @__PURE__ */ new WeakMap();
async function Kf(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Vf(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(no.get(t)), no.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Gf)
  )));
}
typeof document < "u" && document.addEventListener("click", Kf, !0);
const Yf = /\n\s*\n/, Jf = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Zf = /^\s*(`{3,}|~{3,})\s*$/, Xf = /^\s{4,}\S/, Qf = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ja = /^\s*(?:[-*+]|\d+[.)])\s/, Wl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, eh = [
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
function th(e) {
  const t = ws(e.join(`
`));
  return (eh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const nh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Wl.test(t) && !Ja.test(t);
}, ah = (e, t) => Ja.test(t) || Ja.test([...e].reverse().find((n) => n.trim()) || "");
function ks(e, t) {
  const n = t || th(e), a = Uf(ws(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function sh(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Zf.test(s));
  return a < 0 ? e.length : a;
}
function oh(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return ks(a.map(cn), n ? n.toLowerCase() : "");
}
function lh(e) {
  const t = e.split(Yf).map((l) => ({ paragraph: l, type: Pf(ws(l).split(`
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
function rh(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : lh(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Jf);
    if (r) {
      const u = sh(n, l, r[2]);
      o(), a.push(oh(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = nh(s) ? Qf : Xf;
    if (!t && i.test(n[l]) && !ah(s, n[l])) {
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
At((e, t) => rh(e, t.document));
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
}, ih = (e) => (oo[e.table] ? oo[e.table](e) : e.title || "") || "", Mt = (e) => Pn(e.created_at), zl = (e) => Pn(e.updated_at) || Mt(e), ch = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, uh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function dh(e) {
  const t = ch.exec(e);
  if (t && it(t[1])) return { at: t.index, length: t[0].length, table: it(t[1]), id: Number(t[2]), label: t[3] };
  const n = uh.exec(e), a = n && it(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function fh(e, t, n, a) {
  const s = Il(a, e, t), o = cn(s ? ih(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Xe(jt(e).title)} ${t}</span><span class="row-card-title">${Xe(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = dh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: fh(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const hh = /\.(png|jpe?g|gif|webp|svg)$/i, mh = (e) => hh.test(e), ph = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, gh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function vh(e, t) {
  const n = ph.exec(e), [, a, s, o, l, r] = n || [], i = n && it(a || o), u = i && Il(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${jt(i).title} ${u.id} · ${Xe(r)}`, m = mh(r) ? `<img class="file-card-image" src="${d}" alt="${Xe(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Xe(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function yh(e) {
  const t = gh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Xe(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = vh(e, t) || yh(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const bh = /`([^`\n]+)`/g;
At((e) => e.replace(bh, (t, n) => `<code>${n}</code>`));
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
const wh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ul = new RegExp(`\\b(${Sl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Vl = new RegExp(`\\b(${Sl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), kh = new RegExp(`<code>((?:${Ul.source}|${Vl.source}))</code>`, "gi"), xh = (e) => e.replace(kh, "$1"), $h = (e, t) => `<a class="row-pill" href="#" data-peek="${it(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Mh = (e) => e.replace(Vl, (t, n, a) => a.replace(/\d+/g, (s) => $h(n.replace(/s$/i, ""), s))), Sh = (e) => Mh(e).replace(
  Ul,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${it(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : xh(e).split(wh).map((n, a) => a % 2 ? n : Sh(n)).join("")
);
const _h = ["innerHTML"], Eh = ["innerHTML"], Ah = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Dl(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, _h)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => j(It) && j(It)(...l)),
      innerHTML: a.value
    }, null, 8, Eh));
  }
}, bt = /* @__PURE__ */ K(Ah, [["__scopeId", "data-v-d8e75741"]]), Ch = { class: "fact" }, Oh = { class: "fact-label" }, Th = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Ch, [
      v("span", Oh, w(e.label), 1),
      N(bt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Rh = /* @__PURE__ */ K(Th, [["__scopeId", "data-v-3a88ecf8"]]), Ih = { class: "list" }, Bh = { class: "list-label" }, Lh = {
  key: 1,
  class: "list-note"
}, Nh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Ih, [
      (c(!0), h(G, null, ee(e.items, (o, l) => (c(), H(St(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: q(() => [
          v("span", Bh, w(o.label), 1),
          o.badge ? (c(), H(Rl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", Lh, w(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Dh = /* @__PURE__ */ K(Nh, [["__scopeId", "data-v-ebe2ae0a"]]), Ph = { class: "table" }, jh = {
  key: 0,
  class: "table-row empty"
}, qh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", Ph, [
      v("div", {
        class: "table-row head",
        style: ge(s.value)
      }, [
        (c(!0), h(G, null, ee(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (c(!0), h(G, null, ee(e.rows, (r, i) => (c(), H(St(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: Z(["table-row", r.tone, { opens: r.open }]),
        style: ge(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: q(() => [
          (c(!0), h(G, null, ee(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", jh, w(e.empty), 1)) : E("", !0)
    ]));
  }
}, Fh = /* @__PURE__ */ K(qh, [["__scopeId", "data-v-9326a52e"]]), Wh = { class: "stat-value" }, Hh = { class: "stat-label" }, zh = {
  key: 0,
  class: "stat-note"
}, Uh = {
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
      default: q(() => [
        v("span", Wh, w(e.value), 1),
        v("span", Hh, w(e.label), 1),
        e.note ? (c(), h("span", zh, w(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Vh = /* @__PURE__ */ K(Uh, [["__scopeId", "data-v-ad0db6d6"]]), Gh = { class: "code" }, Kh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), H(Pt, {
      value: e.node.type
    }, {
      stack: q(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: q(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: q(() => [
        N(Cn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: q(() => [
        N(Yd, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: q(() => [
        v("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: q(() => [...l[2] || (l[2] = [
        v("hr", { class: "divider" }, null, -1)
      ])]),
      stat: q(() => [
        N(Vh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: q(() => [
        N(Hd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: q(() => [
        N(Fh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: q(() => [
        N(Dh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: q(() => [
        N(bt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: q(() => [
        N(Rh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: q(() => [
        N(Rl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: q(() => [
        v("pre", Gh, [
          v("code", null, w(e.node.text), 1)
        ])
      ]),
      file: q(() => [
        v("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Gl = /* @__PURE__ */ K(Kh, [["__scopeId", "data-v-cbdcf540"]]), Yh = { class: "dashboard" }, Jh = { class: "trail" }, Zh = ["onClick"], Xh = {
  key: 0,
  class: "gone",
  role: "status"
}, Qh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = R(!!n.page && !s(n.page)), l = R(n.page && !o.value ? [n.page] : []), r = I(() => l.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (m, g) => (c(), h("div", Yh, [
      e.document.broken ? (c(), H(Qt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: q(() => [
          Q(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), H(Qt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: q(() => [
          Q(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(G, { key: 2 }, [
        v("nav", Jh, [
          v("button", {
            type: "button",
            class: Z(["step", { current: !l.value.length }]),
            onClick: g[0] || (g[0] = (y) => f(0))
          }, w(u(e.document.start)), 3),
          (c(!0), h(G, null, ee(l.value, (y, k) => (c(), h(G, {
            key: `${k}-${y}`
          }, [
            g[2] || (g[2] = v("span", { class: "sep" }, "/", -1)),
            v("button", {
              type: "button",
              class: Z(["step", { current: k === l.value.length - 1 }]),
              onClick: (b) => f(k + 1)
            }, w(u(y)), 11, Zh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Xh, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        N(Dt, {
          name: "page",
          mode: "out-in"
        }, {
          default: q(() => [
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
}, em = /* @__PURE__ */ K(Qh, [["__scopeId", "data-v-fbe83734"]]), nt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, je = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, tm = 6;
function xs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const nm = (e) => {
  const t = xs(e, nt.lineChars), n = Math.max(nt.minWidth, Math.max(...t.map((a) => a.length)) * nt.charWidth + nt.padX * 2);
  return { name: e, lines: t, line: nt.line, padY: nt.padY, width: n, height: t.length * nt.line + nt.padY * 2 };
};
function am(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function sm(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function om(e, t, n) {
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
  for (let l = 0; l < tm; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function lm(e, t) {
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
function rm(e) {
  const t = [...new Set(e.flatMap(([P, x]) => [P, x]))], n = new Set(e.map(([, P]) => P)), a = t.filter((P) => !n.has(P)), s = am(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((P, x) => !s.has(x)), l = sm(t, o), r = om(t, o, l), i = new Map(t.map((P) => [P, nm(P)])), u = r.map((P) => P.reduce((x, $) => x + i.get($).width, 0) + Pe.across * (P.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = cm(e, l, r.length), m = /* @__PURE__ */ new Map();
  let g = Pe.margin;
  r.forEach((P, x) => {
    let $ = (d - u[x]) / 2;
    const T = Math.max(...P.map((L) => i.get(L).height));
    P.forEach((L) => {
      const S = i.get(L);
      m.set(L, { ...S, x: $, y: g + (T - S.height) / 2 }), $ += S.width + Pe.across;
    }), g += T + (f[x] ?? Pe.down);
  });
  const y = e.map(([P, x, $], T) => ({ from: P, to: x, label: $ || "", back: s.has(T) || l.get(x) <= l.get(P) }));
  lm(y, m);
  const k = y.map((P) => um(P, m.get(P.from), m.get(P.to))), b = [...m.values()], A = mm(k, b), D = Math.max(g - Pe.down, ...A.filter((P) => P.label).map((P) => P.label.y + P.label.height));
  return { width: Math.max(d - Pe.margin, ...A.filter((P) => P.label).map((P) => P.label.x + P.label.width)) + Pe.margin, height: D + Pe.margin, nodes: b, arrows: A };
}
const im = (e) => e ? xs(e, je.lineChars).length * je.line + je.pad * 2 : 0;
function cm(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += im(l) + Pe.labelSpace);
  }), a.map((s) => Math.max(Pe.down, s));
}
function um(e, t, n) {
  const a = e.label ? xs(e.label, je.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * je.charWidth + je.pad * 2 : 0, o = a.length * je.line + (a.length ? je.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const dm = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, fm = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], hm = [0, -1, 1, -2, 2, -3, 3].map((e) => e * je.line);
function mm(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = dm(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = hm.flatMap((i) => fm.map((u) => s(u, i))).find((i) => !n.some((u) => ro(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => ro(r, i)); ) r.y += je.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: je.line, pad: je.pad } };
  });
}
const ro = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, pm = { class: "flowchart-tools" }, gm = ["width", "height", "viewBox", "aria-label"], vm = ["d"], ym = ["x", "y", "width", "height"], bm = ["x", "y"], wm = ["x", "dy"], km = {
  key: 0,
  class: "flowchart-label"
}, xm = ["x", "y", "width", "height"], $m = ["x", "y"], Mm = ["x", "dy"], Sm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => rm(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = R(null), r = R({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var A;
      const k = (A = l.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(k != null && k.width)) return;
      const b = Math.min(k.width / s.value.width, k.height / s.value.height, 1.5);
      r.value = { zoom: b, x: (k.width - s.value.width * b) / 2, y: (k.height - s.value.height * b) / 2 };
    }
    function d(k, b, A) {
      const { zoom: D, x: Y, y: P } = r.value, x = Math.min(o.most, Math.max(o.least, D * k));
      r.value = { zoom: x, x: b - (b - Y) * x / D, y: A - (A - P) * x / D };
    }
    function f(k) {
      const b = l.value.getBoundingClientRect();
      d(k, b.width / 2, b.height / 2);
    }
    function m(k) {
      const b = l.value.getBoundingClientRect();
      k.ctrlKey || k.metaKey ? d(k.deltaY < 0 ? o.step : 1 / o.step, k.clientX - b.left, k.clientY - b.top) : r.value = { ...r.value, x: r.value.x - k.deltaX, y: r.value.y - k.deltaY };
    }
    function g(k) {
      var b, A, D;
      k.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), i = { x: k.clientX - r.value.x, y: k.clientY - r.value.y }, (D = (A = l.value).setPointerCapture) == null || D.call(A, k.pointerId);
    }
    function y(k) {
      i && (r.value = { ...r.value, x: k.clientX - i.x, y: k.clientY - i.y });
    }
    return Be(u), (k, b) => (c(), H(xl, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (A) => a("close"))
    }, {
      default: q(() => [
        v("div", pm, [
          N(de, {
            small: "",
            onClick: b[0] || (b[0] = (A) => f(o.step))
          }, {
            default: q(() => [...b[5] || (b[5] = [
              Q("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: b[1] || (b[1] = (A) => f(1 / o.step))
          }, {
            default: q(() => [...b[6] || (b[6] = [
              Q("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(de, {
            small: "",
            onClick: u
          }, {
            default: q(() => [...b[7] || (b[7] = [
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
          onPointerup: b[2] || (b[2] = (A) => Ps(i) ? i.value = null : i = null),
          onPointercancel: b[3] || (b[3] = (A) => Ps(i) ? i.value = null : i = null)
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
            b[8] || (b[8] = v("defs", null, [
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
            (c(!0), h(G, null, ee(s.value.arrows, (A, D) => (c(), h("path", {
              key: `arrow-${D}`,
              class: "flowchart-arrow",
              d: A.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, vm))), 128)),
            (c(!0), h(G, null, ee(s.value.nodes, (A) => (c(), h("g", {
              key: A.name,
              class: "flowchart-node"
            }, [
              v("rect", {
                x: A.x,
                y: A.y,
                width: A.width,
                height: A.height,
                rx: "8"
              }, null, 8, ym),
              v("text", {
                x: A.x + A.width / 2,
                y: A.y + A.padY + A.line / 2
              }, [
                (c(!0), h(G, null, ee(A.lines, (D, Y) => (c(), h("tspan", {
                  key: Y,
                  x: A.x + A.width / 2,
                  dy: Y ? A.line : 0
                }, w(D), 9, wm))), 128))
              ], 8, bm)
            ]))), 128)),
            (c(!0), h(G, null, ee(s.value.arrows, (A, D) => (c(), h(G, {
              key: `label-${D}`
            }, [
              A.label ? (c(), h("g", km, [
                v("rect", {
                  x: A.label.x,
                  y: A.label.y,
                  width: A.label.width,
                  height: A.label.height,
                  rx: "4"
                }, null, 8, xm),
                v("text", {
                  x: A.label.x + A.label.width / 2,
                  y: A.label.y + A.label.pad + A.label.line / 2
                }, [
                  (c(!0), h(G, null, ee(A.label.lines, (Y, P) => (c(), h("tspan", {
                    key: P,
                    x: A.label.x + A.label.width / 2,
                    dy: P ? A.label.line : 0
                  }, w(Y), 9, Mm))), 128))
                ], 8, $m)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, gm))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, _m = /* @__PURE__ */ K(Sm, [["__scopeId", "data-v-51d24cfe"]]), io = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', co = {
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
}, Em = ["innerHTML"], Am = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => co[t.name] || co.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Em));
  }
}, ut = /* @__PURE__ */ K(Am, [["__scopeId", "data-v-beb5935c"]]), Cm = {
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
}, kt = /* @__PURE__ */ K(Cm, [["__scopeId", "data-v-d03899bb"]]), Om = ["data-tip", "aria-label"], Tm = {
  key: 0,
  class: "mact-word"
}, Rm = {
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
      e.open ? (c(), h("span", Tm, w(e.label), 1)) : E("", !0),
      n[0] || (n[0] = v("span", { class: "hit" }, null, -1))
    ], 10, Om));
  }
}, Kl = /* @__PURE__ */ K(Rm, [["__scopeId", "data-v-3b292e09"]]), Yl = 120, On = 280, Jl = 160, Im = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Bm = ["leaving", "resizing", "entering"];
function Za(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Lm(e) {
  const t = Bm.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Za(e);
  return e.classList.add(...t), n;
}
function Zl(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = R(t()), s = R("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const g = Lm(f);
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
    if (!m || !m.offsetWidth || Im()) {
      a.value = f;
      return;
    }
    const y = Za(m);
    if (l(m, y), s.value = "leaving", await n(Yl), g !== o) return;
    a.value = f, s.value = "resizing", await dt(), i(m, y);
    const k = u(m);
    await n(On), k == null || k.disconnect(), g === o && (r(m), s.value = "entering", await n(Jl), g === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), _t(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Nm = { class: "growing-card-top" }, Dm = ["aria-expanded"], Pm = { class: "growing-card-avatar" }, jm = { class: "growing-card-title" }, qm = { class: "growing-card-more" }, Fm = { class: "growing-card-body" }, Wm = {
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
    const n = e, a = t, s = R(!1), o = R(null), { folded: l, phase: r } = Zl(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", j(r), { open: !j(l), bad: e.bad, incoming: e.incoming }])
    }, [
      v("div", Nm, [
        v("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          v("span", Pm, [
            e.bad ? (c(), H(ut, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(G, { key: 1 }, [
              Q(w(i.value), 1)
            ], 64)) : (c(), H(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          v("span", jm, w(e.title), 1),
          N(kt, { open: s.value }, null, 8, ["open"])
        ], 8, Dm),
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
      v("div", qm, [
        v("div", Fm, [
          (c(!0), h(G, null, ee(u.value, (m, g) => (c(), h("p", {
            key: g,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Hm = /* @__PURE__ */ K(Wm, [["__scopeId", "data-v-f2b4930d"]]), zm = {
  key: 0,
  class: "message-links-few",
  "data-message-links-rows": ""
}, Um = { class: "md inline" }, Vm = ["disabled", "title", "onClick"], Gm = {
  key: 1,
  class: "message-links-many"
}, Km = ["aria-expanded"], Ym = {
  key: 2,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Jm = ["disabled", "onClick"], Zm = { class: "row-pill message-links-chip" }, Xm = { class: "message-links-title" }, Qm = { key: 0 }, pa = 3, e1 = "task", t1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 }, total: { type: Number, default: 0 }, more: Boolean, loading: Boolean, failure: { type: String, default: "" } },
  emits: ["more"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => n.total || n.links.length), o = I(() => n.links.every((m) => m.endpoint.model === e1) ? "tasks" : "items"), l = R(!1), r = R(null);
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
      e.links.length ? (c(), h("span", zm, [
        v("span", Um, [
          g[1] || (g[1] = Q("Linked: ", -1)),
          (c(!0), h(G, null, ee(e.links, (y) => (c(), h("button", {
            key: `${y.endpoint.model}:${y.endpoint.id}`,
            type: "button",
            class: "message-links-inline",
            disabled: u(y),
            title: y.endpoint.title,
            onClick: (k) => f(y)
          }, [
            Q(w(y.endpoint.model.replaceAll("_", " ")) + " " + w(y.endpoint.id), 1),
            d(y) ? (c(), h(G, { key: 0 }, [
              Q(" (" + w(d(y)) + ")", 1)
            ], 64)) : E("", !0),
            u(y) ? (c(), h(G, { key: 1 }, [
              Q(" (unavailable)")
            ], 64)) : E("", !0)
          ], 8, Vm))), 128))
        ])
      ])) : E("", !0),
      s.value >= pa ? (c(), h("span", Gm, [
        v("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: i
        }, [
          Q(w(s.value) + " linked " + w(o.value) + " ", 1),
          N(kt, { open: l.value }, null, 8, ["open"])
        ], 8, Km)
      ])) : E("", !0),
      l.value ? (c(), h("div", Ym, [
        (c(!0), h(G, null, ee(e.links, (y) => (c(), h("button", {
          key: `${y.endpoint.model}:${y.endpoint.id}`,
          type: "button",
          class: "message-links-row",
          disabled: u(y),
          onClick: (k) => f(y)
        }, [
          v("span", Zm, w(y.endpoint.model.replaceAll("_", " ")) + " " + w(y.endpoint.id), 1),
          v("span", Xm, w(y.endpoint.title), 1),
          v("span", null, w(d(y)), 1),
          u(y) ? (c(), h("span", Qm, "Unavailable")) : E("", !0)
        ], 8, Jm))), 128))
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
}, n1 = /* @__PURE__ */ K(t1, [["__scopeId", "data-v-e9bc783c"]]), a1 = ["title", "aria-label"], s1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, o1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, l1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", s1, [
        o[0] || (o[0] = v("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", o1)) : E("", !0)
      ]))
    ], 10, a1));
  }
}, r1 = /* @__PURE__ */ K(l1, [["__scopeId", "data-v-6dc92808"]]);
function i1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Xl(e, t = Date.now()) {
  const n = i1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const c1 = 36e5;
function b5(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / c1;
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
function u1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ga(t % 60)}s` : `${Math.floor(t / 3600)}h ${ga(Math.floor(t % 3600 / 60))}m ${ga(t % 60)}s`;
}
const d1 = "img,pre,table";
function f1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function h1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function m1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(d1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = f1(h1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function p1(e, t) {
  let n = null;
  const a = () => e.value && m1(e.value);
  Be(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Le(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const g1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function v1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const kn = /* @__PURE__ */ new WeakMap(), Ue = "work", Ht = "sent", y1 = 50, fo = () => ({ rows: R([]), total: R(0), next: R(null), loading: R(!1), failure: R(""), version: 0 });
function b1(e) {
  var f;
  if (kn.has(e)) return kn.get(e);
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
  let a = null;
  const s = (m) => {
    var g;
    return ((g = e.visible) == null ? void 0 : g.value) !== !1 && [...m.views].some((y) => y.visible);
  };
  async function o(m, g, y = 1) {
    const k = m[g], b = ++k.version;
    k.loading.value = !0, k.failure.value = "";
    const A = g === Ue ? "--type about --type edited --group-counterparts" : "--type sent_to", D = `link list --source message:${m.id} ${A} --page ${y} --page-size ${g === Ue ? 10 : 25}`;
    try {
      const Y = await e.read(D);
      if (t.get(m.id) !== m || k.version !== b) return;
      if (!Y.ok) {
        k.failure.value = Y.error;
        return;
      }
      const P = g === Ue ? Y.value.counterparts ?? [] : Y.value.rows ?? [], x = y === 1 ? P : [...k.rows.value, ...P], $ = g === Ue ? (T) => `${T.endpoint.model}:${T.endpoint.id}` : (T) => T.id ?? T.target_id;
      k.rows.value = [...new Map(x.map((T) => [$(T), T])).values()], k.total.value = Y.value.total ?? k.rows.value.length, k.next.value = Y.value.next_page ?? null;
    } catch (Y) {
      k.version === b && (k.failure.value = Y.message);
    } finally {
      k.version === b && (k.loading.value = !1);
    }
  }
  function l() {
    a = null;
    const m = [...n].map((g) => t.get(g)).filter((g) => g && s(g));
    n.clear();
    for (const g of m) {
      const y = [...g.dirty];
      g.dirty.clear();
      for (const k of y) o(g, k);
    }
  }
  function r(m, g = [Ue, Ht]) {
    for (const y of g) m.dirty.add(y);
    s(m) && (n.add(m.id), a ?? (a = setTimeout(l, 0)));
  }
  function i(m) {
    const g = m.sources ?? (m.source_model && Number.isInteger(m.source_id) ? [{ model: m.source_model, id: m.source_id }] : []), y = m.link_types ?? (m.link_type ? [m.link_type] : []), k = y.length ? [Ue, Ht].filter((A) => A === Ue ? y.some((D) => ["about", "edited"].includes(D)) : y.includes("sent_to")) : [Ue, Ht];
    if (!k.length) return;
    const b = g.length ? [...new Set(g.filter((A) => A.model === "message").map((A) => A.id))].map((A) => t.get(A)).filter(Boolean) : [...t.values()].filter(s).slice(0, y1);
    for (const A of b) r(A, k);
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
function w1(e, t, n) {
  const a = Ve(null);
  let s = null;
  const o = he(t, (l, r, i) => {
    if (!(e != null && e.read) || !Number.isInteger(l) || l < 1) return;
    s = b1(e);
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
    links: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.rows.value) ?? [];
    }),
    total: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.total.value) ?? 0;
    }),
    more: I(() => {
      var l;
      return !!((l = a.value) != null && l.work.next.value);
    }),
    loading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.loading.value) ?? !1;
    }),
    failure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.work.failure.value) ?? "";
    }),
    sentTo: I(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.sent.rows.value) ?? []).map((r) => r.target);
    }),
    sentMore: I(() => {
      var l;
      return !!((l = a.value) != null && l.sent.next.value);
    }),
    sentLoading: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.loading.value) ?? !1;
    }),
    sentFailure: I(() => {
      var l;
      return ((l = a.value) == null ? void 0 : l.sent.failure.value) ?? "";
    }),
    loadMore: () => s == null ? void 0 : s.more(a.value, Ue),
    loadSent: () => s == null ? void 0 : s.more(a.value, Ht)
  };
}
const k1 = ["data-incoming", "data-ref"], x1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], $1 = { class: "message-body" }, M1 = ["title"], S1 = ["innerHTML"], _1 = ["title"], E1 = ["innerHTML"], A1 = {
  class: "message-faces",
  "data-message-faces": ""
}, C1 = ["title", "data-face", "onClick"], O1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, T1 = ["title", "data-reaction", "onClick"], R1 = {
  key: 0,
  class: "message-reaction-count"
}, I1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, B1 = ["href", "title"], L1 = ["src", "alt"], N1 = ["href"], D1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, P1 = ["disabled", "data-sent-worker", "title", "onClick"], j1 = { class: "message-foot" }, q1 = { class: "message-time" }, F1 = {
  class: "message-id",
  "data-message-id": ""
}, W1 = 140, H1 = 2, z1 = 1500, U1 = "An earlier message", V1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(!1), o = R(null), l = I(() => ["user", "comment"].includes(n.message.type)), r = I(() => {
      const [ve, fe] = (n.message.commented_row || ":").split(":"), ae = it(ve);
      return ae ? { ref: `${ae}:${fe}`, label: `${jt(ae).title.toLowerCase()} ${fe}` } : null;
    }), i = I(() => n.message.worker_id ?? null), u = R(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > W1 || (n.message.text ?? "").split(`
`).filter((ve) => ve.trim()).length > H1)), f = I(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var ve;
      await ((ve = navigator.clipboard) == null ? void 0 : ve.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, z1);
    }
    const g = Dl(), y = I(() => g(n.message.text ?? "")), k = I(() => JSON.parse(n.message.flowchart_edges || "[]")), b = R(!1), A = I(() => g(n.quote || U1));
    function D() {
      const ve = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ve ? ve.scrollIntoView({ block: "center", behavior: "smooth" }) : We(`messages:${n.message.parent_id}`);
    }
    p1(o, () => `${n.message.text} ${n.quote}`);
    const Y = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, P = (ve) => `/api/files/message/${n.message.id}/${encodeURIComponent(ve)}`, x = I(() => JSON.parse(n.message.captions || "{}")), $ = I(() => (n.message.files ?? []).map((ve) => ({ name: ve, address: P(ve), isImage: Y.test(ve), title: x.value[ve] || ve }))), T = I(() => Ql(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), L = Ee(Te, null), { links: S, total: B, more: M, loading: p, failure: O, sentTo: C, sentMore: _, sentLoading: J, sentFailure: te, loadMore: ce, loadSent: ie } = w1(L, () => l.value && !n.message.local ? n.message.id : null, o), pe = R(!1), Ce = I(() => v1(n.message.reactions));
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
      N(Hm, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: fe[0] || (fe[0] = (ae) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, k1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      v("div", $1, [
        v("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: r.value }]),
          onClick: fe[6] || (fe[6] = (...ae) => j(It) && j(It)(...ae))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: fe[1] || (fe[1] = xe((ae) => j(We)(r.value.ref), ["stop"]))
          }, [
            N(ye, {
              name: "bubble",
              size: 12
            }),
            v("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, M1)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(D, ["stop"]),
            innerHTML: A.value
          }, null, 8, S1)) : E("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: fe[2] || (fe[2] = xe((ae) => j(We)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, _1)) : E("", !0),
          v("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, E1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: fe[3] || (fe[3] = xe((ae) => u.value = !u.value, ["stop"]))
          }, w(u.value ? "Show less" : "Show more"), 1)) : E("", !0),
          k.value.length ? (c(), h(G, { key: 4 }, [
            v("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: fe[4] || (fe[4] = (ae) => b.value = !0)
            }, "Open the flowchart"),
            b.value ? (c(), H(_m, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: fe[5] || (fe[5] = (ae) => b.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        v("div", {
          class: Z(["message-tools", { picking: pe.value }]),
          "data-message-tools": ""
        }, [
          pe.value ? (c(), h(G, { key: 0 }, [
            v("div", A1, [
              (c(!0), h(G, null, ee(j(g1), (ae) => (c(), h("button", {
                key: ae,
                type: "button",
                class: "message-face",
                title: `React ${ae}`,
                "data-face": ae,
                onClick: (Ke) => qe(ae)
              }, w(ae), 9, C1))), 128))
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
          ], 64)) : (c(), h(G, { key: 1 }, [
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
      Ce.value.length ? (c(), h("div", O1, [
        (c(!0), h(G, null, ee(Ce.value, (ae) => (c(), h("button", {
          key: ae.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: ae.mine }]),
          title: ae.title,
          "data-reaction": ae.emoji,
          onClick: (Ke) => a("react", e.message, ae.emoji)
        }, [
          Q(w(ae.emoji) + " ", 1),
          ae.count > 1 ? (c(), h("span", R1, w(ae.count), 1)) : E("", !0)
        ], 10, T1))), 128))
      ])) : E("", !0),
      $.value.length ? (c(), h("div", I1, [
        (c(!0), h(G, null, ee($.value, (ae) => (c(), h(G, {
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
            }, null, 8, L1)
          ], 8, B1)) : (c(), h("a", {
            key: 1,
            href: ae.address,
            target: "_blank",
            class: "message-file"
          }, w(ae.name), 9, N1))
        ], 64))), 128))
      ])) : E("", !0),
      j(C).length ? (c(), h("div", D1, [
        N(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, ee(j(C), (ae) => (c(), h("button", {
          key: ae.id,
          type: "button",
          class: "message-sent-worker",
          disabled: ae.unavailable || !ae.open_ref,
          "data-sent-worker": ae.id,
          title: `Open worker ${ae.id}`,
          onClick: xe((Ke) => ae.open_ref && j(We)(ae.open_ref), ["stop"])
        }, [
          Q("Also sent to worker " + w(ae.id), 1),
          ae.unavailable ? (c(), h(G, { key: 0 }, [
            Q(" (unavailable)")
          ], 64)) : E("", !0)
        ], 8, P1))), 128))
      ])) : E("", !0),
      N(Yn, {
        more: j(_),
        loading: j(J),
        failure: j(te),
        label: "More recipients",
        onMore: j(ie)
      }, null, 8, ["more", "loading", "failure", "onMore"]),
      v("div", j1, [
        v("time", q1, w(T.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(G, { key: 0 }, [
          fe[11] || (fe[11] = v("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          v("span", F1, "message " + w(e.message.id), 1)
        ], 64)) : E("", !0),
        l.value ? (c(), H(r1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ]),
      j(S).length || j(O) ? (c(), H(n1, {
        key: 3,
        links: j(S),
        total: j(B),
        more: j(M),
        loading: j(p),
        failure: j(O),
        onMore: j(ce)
      }, null, 8, ["links", "total", "more", "loading", "failure", "onMore"])) : E("", !0)
    ], 8, x1));
  }
}, w5 = /* @__PURE__ */ K(V1, [["__scopeId", "data-v-0be1107c"]]), G1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = ni("SkeletonParts", !0);
      return c(!0), h(G, null, ee(e.parts, (i, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, ee(i.count, (d) => (c(), H(Pt, {
          key: d,
          value: i.shape
        }, {
          line: q(() => [
            N(Vt, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: ge({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: q(() => [
            N(Vt, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: ge({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: q(() => [
            N(Vt, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: ge({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: q(() => [...l[0] || (l[0] = [
            v("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: q(() => [
            v("div", {
              class: "skeleton-row",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: q(() => [
            v("div", {
              class: "skeleton-stack",
              style: ge(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: q(() => [
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
          grid: q(() => [
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
}), K1 = /* @__PURE__ */ K(G1, [["__scopeId", "data-v-fa8baeaf"]]), Y1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, J1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Y1, [
      N(K1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, $s = /* @__PURE__ */ K(J1, [["__scopeId", "data-v-52f66b64"]]), jn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], va = 200, er = (e) => {
  var t;
  return ((t = jn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? jn[0].key;
}, k5 = (e) => {
  var t;
  return ((t = jn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Z1 = ["aria-label"], X1 = 300, ho = 400, Q1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: va } },
  setup(e) {
    const t = e, n = I(() => er(t.value)), a = I(() => n.value < va ? [1, 0.25, 0.25] : n.value === va ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= ho, high: n.value >= X1 && n.value < ho }]),
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
    ], 10, Z1));
  }
}, x5 = /* @__PURE__ */ K(Q1, [["__scopeId", "data-v-b10e610f"]]), mo = (e) => [...new Set(e.agents.map((t) => t.name))], $5 = (e) => mo(e).length === 1 ? `Worker: ${mo(e)[0]}` : "Delegated", ep = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, po = (e) => ep[e.card.state] || "idle", tp = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), go = { working: 0, waiting: 1, idle: 2, stopped: 3 }, vo = (e, t) => go[po(e)] - go[po(t)], yo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, M5 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => vo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || tp(a, s)) : [...e].sort((a, s) => vo(a, s) || (yo[t] || yo.state)(a, s)), np = { class: "list-row" }, ap = {
  key: 0,
  class: "list-row-type"
}, sp = { class: "list-row-main" }, op = {
  key: 0,
  class: "list-row-title"
}, lp = { class: "list-row-body" }, rp = {
  key: 1,
  class: "list-row-end"
}, ip = {
  key: 1,
  class: "list-row-text"
}, cp = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", np, [
      e.type ? (c(), h("span", ap, w(e.type), 1)) : E("", !0),
      v("div", sp, [
        e.title ? (c(), h("span", op, w(e.title), 1)) : E("", !0),
        v("div", lp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", rp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", ip, w(e.text), 1)) : E("", !0)
    ]));
  }
}, S5 = /* @__PURE__ */ K(cp, [["__scopeId", "data-v-dfc8c3a7"]]), up = {
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
}, dp = { claude: "Claude Code", codex: "Codex" }, fp = ["aria-expanded"], hp = { class: "drop-label" }, mp = ["value"], pp = {
  key: 1,
  class: "drop-lead"
}, gp = { class: "drop-item-text" }, vp = {
  key: 2,
  class: "drop-note"
}, yp = {
  key: 1,
  class: "drop-none"
}, bp = {
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
    const n = e, a = t, s = R(!1), o = R(null), l = R(""), r = I(() => {
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
        v("span", hp, w(e.label), 1),
        N(ye, {
          name: "down",
          size: 11
        })
      ], 10, fp),
      s.value ? (c(), H(Jn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: q(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, mp)) : E("", !0),
          (c(!0), h(G, null, ee(r.value, (f) => (c(), H($t, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: q(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : E("", !0),
              f.lead ? (c(), h("span", pp, w(f.lead), 1)) : E("", !0),
              v("span", gp, w(f.label), 1),
              f.note ? (c(), h("span", vp, w(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? E("", !0) : (c(), h("p", yp, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, wp = /* @__PURE__ */ K(bp, [["__scopeId", "data-v-29dfcce5"]]), _5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...up[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), H(wp, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${j(dp)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, kp = ["aria-label"], xp = { class: "head" }, $p = { class: "names" }, Mp = { class: "body" }, Sp = {
  key: 0,
  class: "foot"
}, _p = {
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
        onAfterLeave: j(l)
      }, {
        default: q(() => [
          j(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: ge({ "--depth": e.depth, zIndex: j(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => j(o) && j(o)(...d), ["self"]))
          }, [
            v("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(G, { key: 0 }, [
                v("header", xp, [
                  v("div", $p, [
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
                    onClick: j(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                v("div", Mp, [
                  ue(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", Sp, [
                  ue(i.$slots, "foot", {}, void 0, !0)
                ])) : E("", !0)
              ], 64)) : ue(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, kp)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, E5 = /* @__PURE__ */ K(_p, [["__scopeId", "data-v-c9a3f43a"]]), Ep = {
  key: 1,
  class: "text-field-label"
}, Ap = {
  key: 2,
  class: "text-field-end"
}, Cp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ ja({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Pa(e, "modelValue"), a = Kn(), s = "onUpdate:modelValue" in (((d = ai()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = I(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = R(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, j(a).class]),
      style: ge(j(a).style)
    }, [
      e.icon ? (c(), H(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", Ep, w(e.label), 1)) : E("", !0),
      Qe(v("input", Ge({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [j(Ua), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Ap, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : Qe((c(), h("input", Ge({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [j(Ua), o.value]
    ]);
  }
}), A5 = /* @__PURE__ */ K(Cp, [["__scopeId", "data-v-d9c38ca8"]]);
async function Op(e, t, n) {
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
function C5(e) {
  const t = ft().sources.find((n) => n.key === e);
  return t ? Xa(t.read, t.events) : Xa("", []);
}
function Xa(e, t, { incremental: n = !1 } = {}) {
  var x;
  const a = Number(((x = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : x[1]) ?? 50), s = ft(), o = R([]), l = R(null), r = R(""), i = R(!1), u = performance.now(), d = R(!1), f = R(""), m = R(null);
  async function g($) {
    const T = b, L = await s.read(`${e} --before-id ${$ + 1} --limit 1`);
    if (T !== b) return;
    if (!L.ok) return D();
    const S = L.value.rows.find((B) => B.id === $);
    o.value = S ? o.value.map((B) => B.id === $ ? S : B) : o.value.filter((B) => B.id !== $);
  }
  async function y($) {
    if (n && String(($ == null ? void 0 : $.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== $.row_id));
    if (n && ($ != null && $.row_id) && !String($.event ?? "").endsWith(".create") && o.value.some((p) => p.id === $.row_id)) return g($.row_id);
    if (!(n && o.value.length && String(($ == null ? void 0 : $.event) ?? "").endsWith(".create"))) return D();
    const L = Math.max(...o.value.map((p) => p.id)), S = b, B = await s.read(`${e} --after-id ${L}`);
    if (S !== b) return;
    if (!B.ok) return D();
    const M = new Set(o.value.map((p) => p.id));
    o.value = [...B.value.rows.filter((p) => !M.has(p.id)), ...o.value];
  }
  async function k() {
    if (!d.value || !o.value.length) return !1;
    const $ = b, T = Math.min(...o.value.map((B) => B.id)), L = await s.read(`${e} --before-id ${T}`);
    if ($ !== b) return !1;
    if (!L.ok || !L.value.rows.length) return d.value = !1;
    d.value = bo(L.value, a);
    const S = new Set(o.value.map((B) => B.id));
    return o.value = [...o.value, ...L.value.rows.filter((B) => !S.has(B.id))], !0;
  }
  let b = 0;
  async function A($) {
    const T = ++b, L = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (T !== b) return;
    const S = L.ok ? s.shared ? [L.value] : L.value.rows : [];
    L.ok && (o.value = $(S)), l.value = L.ok ? L.value : null;
    const B = S.length ? Math.min(...S.map((M) => M.id)) : 0;
    L.ok && !o.value.some((M) => M.id < B) && (d.value = !s.shared && bo(L.value, a)), r.value = L.ok ? "" : L.error, hs(u, () => i.value = !0);
  }
  function D() {
    return A(($) => {
      if (!n || !$.length) return $;
      const T = Math.min(...$.map((S) => S.id)), L = Math.max(...$.map((S) => S.id));
      return [...o.value.filter((S) => S.id > L), ...$, ...o.value.filter((S) => S.id < T)];
    });
  }
  const Y = () => A(($) => $);
  async function P($, T = null) {
    const L = await Op(T && { target: o, fields: { value: T(o.value) } }, $, s.run);
    return f.value = L.ok ? "" : L.error, m.value = L.ok ? L.value : null, await D(), L;
  }
  return e && (s.follow(t, y), D()), { rows: o, listing: l, failure: r, loaded: i, more: d, load: D, loadLatest: Y, older: k, act: P, actionFailure: f, answer: m, context: s };
}
const Tp = { class: "title" }, Rp = { class: "state" }, Ip = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Xa(t.line, t.events);
    return (o, l) => (c(), H(xd, {
      rows: j(n),
      failure: j(a),
      loaded: j(s),
      empty: e.empty
    }, {
      default: q(({ row: r }) => [
        v("span", Tp, w(r.title), 1),
        v("span", Rp, w(j(hl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, O5 = /* @__PURE__ */ K(Ip, [["__scopeId", "data-v-9191a6f0"]]);
function Bp(e = 1e3, t = null) {
  const n = R(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Le(() => clearInterval(a)), n;
}
const ya = R(Date.now() / 1e3);
let wo = 0, xn = 0;
function tr() {
  return xn || (ya.value = Date.now() / 1e3, wo = setInterval(() => ya.value = Date.now() / 1e3, 1e3)), xn += 1, Jo() && fs(() => {
    xn -= 1, xn || clearInterval(wo);
  }), ya;
}
const Lp = 200, Np = Yl + On + Jl + Lp;
function Ft(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Dp(e, t, n) {
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
function Pp(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(Dp(o, l, n.value)), performance.now() - l < Np) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const jp = ["title", "data-figure-mark", "data-folded", "data-open"], qp = {
  key: 2,
  class: "worker"
}, Fp = { class: "head" }, Wp = { key: 0 }, Hp = {
  key: 3,
  class: "status"
}, zp = {
  key: 0,
  class: "figure"
}, Up = {
  key: 1,
  class: "ran-for"
}, Vp = { key: 2 }, Gp = {
  key: 3,
  class: "news"
}, Kp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Yp = {
  key: 6,
  class: "settled"
}, Jp = {
  key: 1,
  class: "bar"
}, Zp = {
  key: 3,
  class: "detail body"
}, Xp = {
  key: 0,
  class: "body-label"
}, Qp = ["title"], eg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Kn(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = R(!1), l = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = I(() => t.open !== void 0), i = I(() => r.value || l.value), u = I(() => r.value ? t.open : o.value), d = I(() => r.value ? !t.open : l.value && !o.value), f = I(() => !!(t.mark.action && n.onAct)), m = I(() => i.value || f.value || !!n.onClick), g = R(null), y = R(null), { folded: k, phase: b } = Zl(g, () => d.value);
    Pp(g, d, b, Ee(Te, null));
    function A(ie) {
      var pe, Ce;
      if (!(ie.target !== g.value && !y.value.contains(ie.target))) {
        if (r.value) return (pe = n.onClick) == null ? void 0 : pe.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Ce = n.onAct || n.onClick) == null || Ce(ie);
      }
    }
    const D = (ie) => n.onAct(ie), Y = ["failed", "unfinished"], P = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Y.includes(t.mark.state) ? "danger" : "good" : ""), x = I(() => t.mark.color ? t.mark.color : P.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : P.value ? `var(--tone-${P.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), $ = I(() => x.value || "var(--tone-work)"), T = I(() => !t.mark.ending && !t.mark.ended && P.value !== "stopped"), L = tr(), S = I(
      () => t.mark.began_at && T.value && !t.mark.figure && !t.mark.counting ? u1(L.value - t.mark.began_at) : ""
    ), B = I(() => {
      const { started: ie, ended: pe } = t.mark;
      return ie ? pe ? `ran ${uo(pe - ie, !0)}` : uo(L.value - ie, !0) : S.value;
    }), M = ["bad", "danger", "warn"], p = I(() => M.includes(P.value) || t.mark.asks ? "attention" : T.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), O = ["bad", "danger"], C = I(() => O.includes(P.value)), _ = I(() => p.value === "process" ? "running" : C.value ? "cross" : P.value === "stopped" ? "stopped" : P.value === "good" ? "tick" : ""), J = I(
      () => !!(t.mark.figure || B.value || t.mark.docked || t.mark.stopping || _.value || t.mark.settled || t.mark.news)
    ), te = I(() => [t.mark.title, t.mark.time ? Ql(t.mark.time) : ""].filter(Boolean).join(" · ")), ce = I(() => ({
      ...x.value ? { "--mark": x.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, pe) => (c(), h("div", Ge(s.value, {
      ref_key: "root",
      ref: g,
      class: [
        "mark",
        `w-${p.value}`,
        j(b),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: C.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: x.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ce.value,
      title: te.value,
      "data-figure-mark": e.mark.key,
      "data-folded": j(k) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: A
    }), [
      (c(), H(St(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: q(() => [
          e.mark.markIcon ? (c(), H(ut, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), H(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", qp, w(e.mark.worker), 1)) : E("", !0),
          v("span", Fp, [
            N(bt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Wp, w(e.mark.name), 1)) : E("", !0),
            i.value ? (c(), H(kt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          J.value ? (c(), h("span", Hp, [
            e.mark.figure ? (c(), h("span", zp, w(e.mark.figure), 1)) : E("", !0),
            B.value ? (c(), h("span", Up, w(B.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", Vp, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", Gp, w(e.mark.news), 1)) : E("", !0),
            _.value === "running" ? (c(), h("span", Kp)) : _.value ? (c(), H(ut, {
              key: 5,
              class: Z(["sign", _.value]),
              name: _.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", Yp, w(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), H(Kl, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(D, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && T.value ? (c(), h("span", Jp, [
        v("span", {
          class: "progress",
          style: ge({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: $.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !j(k) ? (c(), H(bt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !j(k) ? (c(), h("div", Zp, [
        e.mark.bodyLabel ? (c(), h("p", Xp, w(e.mark.bodyLabel), 1)) : E("", !0),
        N(bt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !j(k) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Qp)) : E("", !0),
      e.mark.card ? (c(), H(bt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      ue(ie.$slots, "default", {
        shown: !j(k)
      }, void 0, !0)
    ], 16, jp));
  }
}), nr = /* @__PURE__ */ K(eg, [["__scopeId", "data-v-2aa9c496"]]), tg = 60;
function ng(e, t) {
  const n = R([]), a = R(0);
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
    if (l || a.value <= 0 || d.scrollTop > tg) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await dt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const ag = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function ar(e) {
  var n;
  const t = ag[e] || ((n = jt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const sg = (e) => ar(String(e).split(":")[0]), sr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), og = { passed: "good", failed: "danger", warned: "warn", running: "" }, lg = { good: "good", warn: "warn", danger: "danger" }, ko = {
  "open row": (e) => We(`${e.target_model}:${e.target_id}`),
  "open page": (e) => fd(e.target_model, e.target_id || 0)
}, rg = { "open row": (e) => sg(e.target_model), "open page": () => ar("pages") };
function ig(e, t) {
  const n = t || {}, a = ko[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? og[e.outcome] || "" : lg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? rg[a](e) : "",
    handlers: a ? { onAct: () => ko[a](e) } : {}
  };
}
const cg = 2e3;
function ug(e, t, n = cg) {
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
const dg = 24, fg = 1e3, xo = 2e3, hg = 0.25, mg = 5e3;
function pg(e, t = dg, n = () => !0) {
  const a = R(!1), s = R(0), o = R(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const P = u();
    return P ? P.scrollHeight - P.scrollTop - P.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(P) {
    if (clearTimeout(l), !P) {
      o.value = !1, i = Date.now();
      return;
    }
    const x = Date.now() - i < xo ? xo : fg;
    l = setTimeout(() => o.value = a.value, x);
  }
  function g() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(P = !1) {
    const x = u();
    x && P && x.scrollTo ? x.scrollTo({ top: x.scrollHeight, behavior: "smooth" }) : x && (x.scrollTop = x.scrollHeight), g();
  }
  function k() {
    A(), !a.value && (a.value = !0, m(!0));
  }
  const b = () => !!u() && d() <= u().clientHeight * hg;
  function A() {
    clearTimeout(r), b() && (r = setTimeout(() => a.value && b() && n() && y(!0), mg));
  }
  function D() {
    f() ? g() : k();
  }
  function Y(P = 1, x = !1) {
    a.value ? s.value += Math.max(0, P) : y(x);
  }
  return Jo() && fs(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: g, toBottom: y, left: k, scrolled: D, arrived: Y };
}
const gg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, vg = (e) => String(e ?? "").replace(gg, ""), yg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(null), { away: o, scrolled: l, arrived: r, toBottom: i } = pg(s);
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
      Q(w(j(vg)(e.lines.join(`
`)) || e.empty), 1),
      j(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => j(i)(!0))
      }, "Follow")) : E("", !0)
    ], 544));
  }
}, bg = /* @__PURE__ */ K(yg, [["__scopeId", "data-v-c2fb1783"]]), wg = 1e4;
class kg {
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
    return this.heardAt !== null && t - this.heardAt > wg;
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
const xg = {
  key: 0,
  class: "frame-note"
}, $g = {
  key: 0,
  class: "frame-note"
}, Mg = ["src", "title"], Sg = 1e3, _g = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ft(), a = R(null), s = R(!1), o = R(!1);
    let l = null, r = 0;
    return Be(() => {
      l = new kg(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Sg);
    }), Le(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", xg, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      s.value ? (c(), h("div", $g, [
        u[2] || (u[2] = v("p", null, "This window has not answered for ten seconds.", -1)),
        N(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: q(() => [...u[1] || (u[1] = [
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
        title: j(n).window
      }, null, 8, Mg)
    ], 64));
  }
}, Eg = /* @__PURE__ */ K(_g, [["__scopeId", "data-v-32a49046"]]), $n = (e) => e ? e.split(", ") : [];
function Ag({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Cg(e, t) {
  return {
    reads: $n(e.reads_allowed),
    runs: $n(e.runs_allowed),
    missing: [...$n(e.reads_missing), ...$n(e.runs_missing)],
    ask: t
  };
}
const Og = {
  class: "allowance-prompt",
  role: "dialog"
}, Tg = { class: "allowance-prompt-text" }, Rg = { class: "allowance-prompt-buttons" }, Ig = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Og, [
      v("p", Tg, w(j(Ag)(e.request)), 1),
      v("div", Rg, [
        N(de, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            Q("Allow", -1)
          ])]),
          _: 1
        }),
        N(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            Q("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Bg = /* @__PURE__ */ K(Ig, [["__scopeId", "data-v-cad69fe2"]]), ba = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), H(Qt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: q(() => [
        Q(w(e.reason) + " ", 1),
        e.retry ? (c(), H(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: q(() => [...s[2] || (s[2] = [
            Q("Retry", -1)
          ])]),
          _: 1
        })) : E("", !0),
        e.removable ? (c(), H(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: q(() => [...s[3] || (s[3] = [
            Q("Remove tab", -1)
          ])]),
          _: 1
        })) : E("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Lg = ["data-window", "data-agent"], Ng = {
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
    const n = e, a = t, s = R(""), o = R(0);
    function l() {
      s.value = "", o.value++;
    }
    const r = Ee(Ii, null), i = ru({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      page: Ee(eu, null),
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
      d() ? (c(), H(Bg, {
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
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(G, { key: 4 }, [
        (c(), H(u, { key: o.value })),
        e.skeleton.length && !j(i).answered.value ? (c(), H($s, {
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
    ], 8, Lg));
  }
}, Kt = /* @__PURE__ */ K(Ng, [["__scopeId", "data-v-c4443e2b"]]), or = {
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
    const n = e, a = t, s = { render: () => Gn(Eg, { src: n.entry.entry_url }) };
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
}, Dg = ["data-window"], lr = {
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
    const n = e, a = t, s = Ve(null), o = R("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, pc();
          } catch (r) {
            if (hc(r) && mc(r)) return;
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
    ], 8, Dg)) : (c(), H(Kt, {
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
}, Pg = "*.*", jg = {
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
    const t = e, n = Ee(Te, null), a = new Kc();
    he(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (g) => a.dispatch(g));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), r = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Pg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), H(lr, {
      key: 0,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), H(or, {
      key: 1,
      entry: r.value,
      subscriptions: j(a),
      environment: j(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, qg = { class: "mark-more-inner" }, Fg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Wg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Hg = {
  key: 3,
  class: "mark-lines"
}, zg = "process", $o = "task", Ug = {
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
    const t = e, n = Ee(Te), a = I(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = I(() => sr.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === $o ? t.mark.target_id : 0), l = ng(
      (g) => n.run(g),
      () => t.mark.target_id
    ), r = l.lines, i = R(!1), u = R(""), d = I(() => !t.declaration.body_url && t.mark.target_model === zg && !!t.mark.target_id);
    async function f(g = l.follow) {
      const y = await g();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = I(() => t.shown && d.value);
    return he(m, (g) => g && f()), ug(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (g) => g && m.value && f(l.newest)
    ), (g, y) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = xe(() => {
      }, ["stop"]))
    }, [
      v("div", qg, [
        e.declaration.body_url ? (c(), H(jg, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(G, { key: 1 }, [
          s.value ? (c(), h(G, { key: 0 }, [
            y[2] || (y[2] = v("p", { class: "mark-label" }, "Why it stopped", -1)),
            v("p", Fg, w(s.value), 1)
          ], 64)) : E("", !0),
          d.value && u.value ? (c(), h("p", Wg, w(u.value), 1)) : d.value && i.value ? (c(), h(G, { key: 2 }, [
            y[3] || (y[3] = v("p", { class: "mark-label" }, "Output", -1)),
            N(bg, {
              class: "mark-terminal",
              lines: j(r),
              onOlder: j(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Hg, w(a.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = xe((k) => j(We)(`${$o}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Qa = /* @__PURE__ */ K(Ug, [["__scopeId", "data-v-f4d037e5"]]), Vg = ["title", "aria-label", "onClick"], Gg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Kg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => ju(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = R(""), s = Ee(Te);
    async function o(l) {
      const r = await rn(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(G, null, [
      (c(!0), h(G, null, ee(n.value, (i) => (c(), h("button", {
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
      ], 8, Vg))), 128)),
      a.value ? (c(), h("span", Gg, w(a.value), 1)) : E("", !0)
    ], 64));
  }
}, Yg = /* @__PURE__ */ K(Kg, [["__scopeId", "data-v-7a62c88e"]]);
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
const ir = rr("/api/marks", "marks"), T5 = ir.fetchAll, Jg = ir.find, Zg = ["data-ref"], Xg = ["data-ref"], Qg = { class: "mark-row" }, e0 = "dock add", t0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => Jg(a.mark.type)), o = I(() => ig(a.mark, s.value)), l = I(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && sr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = R(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = I(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(e0));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, g;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(Qa, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Zg)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (g = s.value) == null ? void 0 : g.full_width, docked: e.docked, "user-side": j(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        v("span", Qg, [
          N(nr, Ge({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, li(o.value.handlers), { onClick: i }), ri({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: q(({ shown: y }) => [
                N(Qa, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          N(Yg, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Xg));
    };
  }
}, n0 = /* @__PURE__ */ K(t0, [["__scopeId", "data-v-8196402d"]]), a0 = ["data-ref"], s0 = ["inert"], o0 = { class: "group-fold" }, l0 = { class: "thread-group" }, r0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(!1), a = R(!1), s = R(!1), o = R(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await dt(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = I(() => ({
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
        v("div", o0, [
          v("div", l0, [
            (c(!0), h(G, null, ee(e.group.marks, (u) => (c(), H(n0, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, s0)) : E("", !0)
    ], 8, a0));
  }
}, R5 = /* @__PURE__ */ K(r0, [["__scopeId", "data-v-45b58b9b"]]);
function i0(e) {
  const t = R(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Be(() => n.observe(e.value)), _t(() => n.disconnect()), t;
}
const c0 = { class: "chat-dock-fold" }, u0 = ["aria-label"], d0 = { class: "chat-dock-head" }, f0 = { class: "chat-dock-inner" }, h0 = { class: "chat-dock-foot" }, cr = 700, m0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = R(null), a = R(null), s = i0(a), o = R(!1);
    let l = 0;
    return Be(() => l = setTimeout(() => o.value = !0, cr)), _t(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      v("div", c0, [
        v("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ue(r.$slots, "edge", {}, void 0, !0),
          v("header", d0, [
            ue(r.$slots, "head", {}, void 0, !0)
          ]),
          v("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            v("div", f0, [
              v("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: ge(j(s) === null ? null : { height: `${j(s)}px` })
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
          v("footer", h0, [
            ue(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, u0)
      ])
    ], 2));
  }
}, ur = /* @__PURE__ */ K(m0, [["__scopeId", "data-v-74d44b19"]]), p0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, wa = 5, g0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(wa, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${wa}s`, animationDelay: `${(n - wa).toFixed(2)}s` };
    return (s, o) => (c(), h("span", p0, [
      v("i", { style: a })
    ]));
  }
}, dr = /* @__PURE__ */ K(g0, [["__scopeId", "data-v-2a7bc150"]]), v0 = { reviewing: "Under review" }, y0 = (e, t) => e || v0[t == null ? void 0 : t.state] || "", Je = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, b0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Je],
  ready: [Je],
  approved: [{ word: "start", label: "Start", main: !0 }, Je],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Je],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Je],
  completed: [],
  cancelled: []
}, w0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Je],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Je],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Je],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Je],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, k0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], x0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], $0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], M0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], S0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], _0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function E0(e, t) {
  const n = { plan: b0, task: w0 }[e], a = t != null && t.state ? Qc(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[ml(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const A0 = (e, t) => e === "doc" || e === "report" ? _0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...$0(t), ...x0(t)] : e === "check" ? S0(t) : e === "question" ? k0(t) : e === "memory" ? M0(t) : E0(e, t), fr = rr("/api/docks", "docks"), I5 = fr.fetchAll, zt = fr.find, C0 = 6, O0 = 3, ka = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Qn = (e) => Date.parse(e.leaves_at) / 1e3, yt = (e) => !!(e.leaves_at && !e.kept), T0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < Qn(e) || n.has(e.id)), R0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => T0(a, t, n)).sort((a, s) => a.id - s.id);
function I0(e, t, n = C0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Qn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const B0 = (e, t, n = e) => n < 2 ? !1 : e >= O0 ? !0 : t, L0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), es = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), N0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), D0 = (e) => ({ ...e.kept ? es("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : es("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), P0 = ["pins"], j0 = (e) => ({ ...e, iconOnly: P0.includes(e.icon) });
function q0(e, t) {
  var n;
  return [
    ...N0(e, t) ? [D0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || jt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    es("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(j0);
}
function F0(e, t) {
  const n = q0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: L0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const W0 = ["title"], H0 = {
  key: 2,
  class: "dock-controls"
}, z0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, U0 = { class: "dock-facts" }, V0 = { key: 1 }, G0 = {
  key: 2,
  class: "dock-kept"
}, K0 = { class: "dock-acts" }, Y0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => zt(a.item.type)), o = tr(), l = I(() => Xl(a.item.created_at, o.value * 1e3)), r = R(null), i = R(null), u = R(null), d = R(null), f = I(() => F0(a.item, s.value)), m = Ee(Te), g = R(null);
    let y = 0;
    async function k() {
      var B, M;
      const $ = ++y, T = Gt(a.item.target_model ?? ""), L = `${T} show`;
      if (!((M = (B = s.value) == null ? void 0 : B.reads) != null && M.includes(L))) return;
      const S = await lt(a.item.type, [T, "show", String(a.item.target_id)], m.environment, m.signal);
      $ === y && (g.value = S.ok ? { ...S.value, id: a.item.target_id, noun: T } : { id: a.item.target_id, noun: T });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      ($, T, L) => {
        var M;
        const S = Gt(a.item.target_model ?? "");
        g.value = { id: a.item.target_id, noun: S }, k();
        const B = (M = m.subscriptions) == null ? void 0 : M.follow(`dock ${a.item.id}`, [`${S.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && k();
        });
        L(() => {
          y += 1, B == null || B();
        });
      },
      { immediate: !0 }
    );
    const b = R(/* @__PURE__ */ new Set()), A = R("");
    async function D($) {
      if ($.action === "open") return We(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (b.value = /* @__PURE__ */ new Set([...b.value, $.label])), A.value = "";
      const L = await rn($, { id: a.item.target_id }, m.environment);
      (L == null ? void 0 : L.ok) === !1 && (b.value = new Set([...b.value].filter((S) => S !== $.label)), A.value = `Could not ${$.label.toLowerCase()}: ${L.error}`);
    }
    const Y = I(() => f.value.actions.filter(($) => $.action !== "undock" && !b.value.has($.label))), P = I(() => {
      var $;
      return y0(($ = s.value) == null ? void 0 : $.badge, g.value);
    }), x = I(() => f.value.buttons.find(($) => $.action === "undock"));
    return ($, T) => {
      var L, S, B, M;
      return c(), H(ur, {
        label: f.value.title + ((L = s.value) != null && L.needs_user ? ", waiting for you" : ""),
        type: (S = s.value) != null && S.needs_user ? "waiting" : "",
        folded: !!((B = s.value) != null && B.folds) && e.folded,
        body: !!((M = s.value) != null && M.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: T[3] || (T[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: q(() => [
          e.leaving && !e.item.kept ? (c(), H(dr, {
            key: 0,
            "ends-at": j(Qn)(e.item)
          }, null, 8, ["ends-at"])) : E("", !0)
        ]),
        head: q(() => {
          var p, O;
          return [
            (p = s.value) != null && p.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(G, { key: 1 }, [
              N(ye, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              v("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, W0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", H0, [
              (c(!0), h(G, null, ee(f.value.controls, (C) => {
                var _, J;
                return c(), h(G, {
                  key: C.action + C.runs
                }, [
                  !b.value.has(C.label) && (!((_ = C.variants) != null && _.length) || !((J = g.value) != null && J.state) || C.variants.includes(g.value.state)) ? (c(), H(de, {
                    key: 0,
                    variant: "icon",
                    class: Z({ kept: C.pressed }),
                    "aria-pressed": C.pressed,
                    "aria-label": C.label,
                    title: C.label,
                    "data-dock-action": C.action,
                    onClick: (te) => D(C)
                  }, {
                    default: q(() => [
                      N(ye, {
                        name: C.icon,
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
              (O = s.value) != null && O.leaves_after_seconds ? E("", !0) : (c(), h(G, { key: 0 }, [
                Q(w(l.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: q(() => [
          A.value || e.refusal ? (c(), h("p", z0, w(A.value || e.refusal), 1)) : E("", !0)
        ]),
        foot: q(() => {
          var p, O;
          return [
            v("span", U0, [
              P.value ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(P.value), 3)) : E("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", V0, w(s.value.word), 1)) : E("", !0),
              v("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", G0, "Kept")) : E("", !0)
            ]),
            (O = s.value) != null && O.folds ? (c(), H(de, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: T[0] || (T[0] = (C) => n("fold"))
            }, {
              default: q(() => [
                Q(w(s.value.folds) + " ", 1),
                N(kt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : E("", !0),
            v("span", K0, [
              v("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              N(Qu, {
                name: `dock.${e.item.type}`,
                row: g.value,
                environment: j(m).environment,
                "read-only": j(m).readOnly,
                "object-name": j(Gt)(e.item.target_model),
                "external-failure": "",
                onFailure: T[1] || (T[1] = (C) => A.value = C),
                onDone: k
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(G, null, ee(Y.value, (C) => (c(), H(de, {
                key: C.action + C.runs,
                small: "",
                variant: C.primary ? "primary" : "ghost",
                bordered: !C.primary,
                "data-dock-action": C.action,
                onClick: (_) => D(C)
              }, {
                default: q(() => [
                  Q(w(C.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(de, {
                small: "",
                bordered: "",
                title: x.value.label,
                "data-dock-action": "undock",
                onClick: T[2] || (T[2] = (C) => n("undock", x.value))
              }, {
                default: q(() => [...T[4] || (T[4] = [
                  Q("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: q(() => {
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
}, Mo = /* @__PURE__ */ K(Y0, [["__scopeId", "data-v-460364d0"]]), J0 = ["title", "aria-label"], Z0 = { class: "run-chip-in" }, X0 = {
  key: 0,
  class: "run-chip-ring"
}, Q0 = { class: "run-chip-name" }, ev = { class: "run-chip-bar" }, tv = "processes.output", nv = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = Ee(Te, null), o = (s == null ? void 0 : s.environment) ?? "", l = R(null), r = I(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = I(() => {
      var m, g;
      return ((m = l.value) == null ? void 0 : m.title) || ((g = l.value) == null ? void 0 : g.line) || a.item.title || "";
    }), u = I(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await lt(tv, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
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
        j(yt)(e.item) ? (c(), H(dr, {
          key: 0,
          "ends-at": j(Qn)(e.item)
        }, null, 8, ["ends-at"])) : E("", !0),
        v("span", Z0, [
          r.value ? (c(), h("span", X0)) : (c(), H(ut, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          v("span", Q0, w(i.value), 1)
        ]),
        v("span", ev, [
          v("i", {
            style: ge({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, J0);
    };
  }
}, av = /* @__PURE__ */ K(nv, [["__scopeId", "data-v-f864bc58"]]), sv = 24, ov = 8, B5 = 420;
function L5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= sv ? !0 : e < t && s > ov ? !1 : null;
}
const lv = (e, t) => e === void 0 ? t : e, rv = { me: 1, people: [] }, qn = ds({
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
  people: rv,
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
function iv(e, t, n) {
  try {
    const a = n.getItem(hr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function cv(e, t, n) {
  try {
    n.setItem(hr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function So(e, t, n = window.localStorage) {
  const a = R(iv(e, t, n));
  return he(a, (s) => cv(e, s, n), { deep: !0 }), a;
}
const uv = {
  key: "dock-all",
  class: "dock-all"
}, dv = {
  key: "runs-head",
  class: "dock-runs-head"
}, fv = { class: "dock-runs-title" }, hv = { class: "dock-runs-chips" }, mv = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var M, p;
    const t = e, n = Bp(500), a = R(/* @__PURE__ */ new Set()), s = R(!1), o = R(!1), l = Ee(Te), r = R(/* @__PURE__ */ new Set()), i = R({});
    async function u(O, C) {
      i.value = { ...i.value, [O.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, O.id]);
      const _ = await rn(C, { id: O.target_id }, l.environment);
      (_ == null ? void 0 : _.ok) === !1 && (r.value = new Set([...r.value].filter((J) => J !== O.id)), i.value = { ...i.value, [O.id]: `Could not close this card: ${_.error}` });
    }
    const d = I(
      () => R0(
        t.items.filter((O) => !r.value.has(O.id)),
        n.value,
        a.value
      )
    ), f = I(
      () => I0(
        d.value.filter((O) => ka(O, zt)),
        n.value
      )
    ), m = I(() => d.value.filter((O) => !f.value.includes(O) && !ka(O, zt))), g = I(() => f.value.filter((O) => !yt(O))), y = So(`dock-size:${((M = qn.identity) == null ? void 0 : M.root) || location.host}`, null), k = (O) => y.value ? y.value.collapsed && !y.value.opened.includes(O.id) : t.collapsed, b = I(() => d.value.some(k)), A = I(() => (s.value = B0(f.value.length, s.value, g.value.length)) && !o.value && !d.value.some(k));
    function D() {
      y.value = { collapsed: !b.value, opened: [] };
    }
    function Y(O) {
      var _;
      if (!k(O)) return;
      const C = (_ = y.value) != null && _.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...C, O.id] };
    }
    const P = So(`dock-folded:${((p = qn.identity) == null ? void 0 : p.root) || location.host}`, {}), x = (O) => {
      var C;
      return !!((C = zt(O.type)) != null && C.folds) && lv(P.value[O.id], ka(O, zt) || t.folded);
    };
    function $(O) {
      P.value = { ...P.value, [O.id]: !x(O) };
    }
    function T(O) {
      P.value = { ...P.value, ...Object.fromEntries(f.value.map((C) => [C.id, C.id !== O.id])) }, o.value = !0;
    }
    function L() {
      P.value = Object.fromEntries(Object.entries(P.value).filter(([O]) => !f.value.some((C) => String(C.id) === O))), o.value = !1;
    }
    function S(O) {
      a.value = /* @__PURE__ */ new Set([...a.value, O.id]);
    }
    function B(O) {
      a.value = new Set([...a.value].filter((C) => C !== O.id));
    }
    return (O, C) => (c(), H(Yo, {
      tag: "div",
      name: "dock",
      duration: j(cr),
      class: "dock-stack"
    }, {
      default: q(() => [
        d.value.length > 1 ? (c(), h("div", uv, [
          N(de, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: D
          }, {
            default: q(() => [
              Q(w(b.value ? "Open all" : "Collapse all"), 1),
              N(kt, {
                open: !b.value
              }, null, 8, ["open"])
            ]),
            _: 1
          })
        ])) : E("", !0),
        (c(!0), h(G, null, ee(m.value, (_) => (c(), H(Mo, {
          key: _.id,
          item: _,
          class: Z({ timed: j(yt)(_) }),
          leaving: j(yt)(_) && !a.value.has(_.id),
          folded: x(_),
          collapsed: k(_),
          refusal: i.value[_.id],
          onOpen: (J) => Y(_),
          onFold: (J) => $(_),
          onUndock: (J) => u(_, J),
          onMouseenter: (J) => S(_),
          onMouseleave: (J) => B(_)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !b.value ? (c(), h("div", dv, [
          v("span", null, w(f.value.length) + " runs", 1),
          N(de, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: L
          }, {
            default: q(() => [
              C[1] || (C[1] = Q(" Runs ", -1)),
              N(kt, { open: "" })
            ]),
            _: 1
          })
        ])) : E("", !0),
        (c(!0), h(G, null, ee(A.value ? [] : f.value, (_) => (c(), H(Mo, {
          key: _.id,
          item: _,
          class: Z({ timed: j(yt)(_) }),
          leaving: j(yt)(_) && !a.value.has(_.id),
          folded: x(_),
          collapsed: k(_),
          refusal: i.value[_.id],
          onOpen: (J) => Y(_),
          onFold: (J) => $(_),
          onUndock: (J) => u(_, J),
          onMouseenter: (J) => S(_),
          onMouseleave: (J) => B(_)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        A.value ? (c(), H(ur, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: q(() => [
            N(ye, {
              name: "runs",
              size: 14
            }),
            v("span", fv, w(f.value.length) + " runs", 1)
          ]),
          foot: q(() => [
            v("span", hv, [
              (c(!0), h(G, null, ee(f.value, (_) => (c(), H(av, {
                key: _.id,
                item: _,
                onClick: (J) => T(_)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(de, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: C[0] || (C[0] = (_) => o.value = !0)
            }, {
              default: q(() => [
                C[2] || (C[2] = Q(" Runs ", -1)),
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
}, N5 = /* @__PURE__ */ K(mv, [["__scopeId", "data-v-ea618218"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Tn = (e) => Math.min(Math.max(e, 0), 1), pv = (e) => {
  const t = Tn(e);
  return t * t * (3 - 2 * t);
}, mt = (e, t, n) => pv((e - t) / (n - t));
function D5(e) {
  const t = Tn(e), n = Tn((t - 0.12) / 0.76) * wt.shuffles, a = Math.min(Math.floor(n), wt.shuffles - 1), s = n - a, o = mt(s, 0.26, 0.38) * (1 - mt(s, 0.76, 0.96)), l = mt(s, 0.38, 0.76), r = mt(t, 0, 0.12) * (1 - mt(t, 0.88, 1)), i = mt(s, 0.2, 0.34) * (1 - mt(s, 0.84, 1)), u = Math.sin(Math.PI * Tn((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / wt.shuffles, lift: wt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function P5(e, t, n, a, s) {
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
}, j5 = (e) => _o[e] ?? _o.butler, Ms = 2400, gv = 0.05;
function vv({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, gv), l = Math.min(t + Ms * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function q5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function yv(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function F5(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const W5 = (e, t) => ({ ...e, stretch: t.stretch }), H5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, mr = (e, t) => t >= (e.least ?? 0);
function z5(e, t, n) {
  if (!mr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const U5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), bv = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Eo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), wv = (e) => e.right > e.left && e.bottom > e.top;
function V5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(bv)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = Eo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = Eo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), wv(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
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
        const y = (o[f] - e[d]) / g, k = (o[m] - e[d]) / g;
        l = Math.max(l, Math.min(y, k)), r = Math.min(r, Math.max(y, k));
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), kv = (e) => e * e * (3 - 2 * e), _e = (e, [t, n]) => kv(tn(e, t, n)), xv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], rt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function $v(e) {
  return xv.map(() => {
    const t = Mn(rt.speed, e), n = Mn(rt.angle, e) * Math.PI / 180, a = Mn(rt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(rt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Mv = $v(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Sv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * rt.gravity * (t[2] - rt.floor))) / rt.gravity;
}
function G5(e, t, n = Mv) {
  const a = Se.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Sv(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= rt.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const K5 = (e, t) => e && Se[e.name] ? { name: e.name, u: t / e.frames } : null;
function Y5(e, t) {
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
const J5 = () => Array.from({ length: Se.pogo.count }, (e, t) => Se.pogo.bounce * (t + 1) / Se.pogo.count), Lt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Z5(e, t, n) {
  const { away: a, side: s } = Se.bug_smash, o = s * a * n, [l, r] = [t.left + Lt.margin * n, t.right - Lt.margin * n], i = Math.min(Math.max(e + o + s * Lt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function X5(e, t, n) {
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
function Q5(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Lt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = vv({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function e4(e) {
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
function _v(e, t) {
  const n = Se.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = yv(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function t4(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = Se.bug_shot, { frame: l, bug: r, shot: i } = _v(n, e.length), u = e.map((A, D) => ({ ...ts(A, t, Math.min(n / o.fps, Rn(D).shot)), shot: D < i })), d = _e(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], g = e.map((A, D) => ({ bug: A, index: D, seconds: n / o.fps - Rn(D).shot, spot: ts(A, t, Rn(D).shot) })).filter((A) => A.seconds >= 0), y = g.flatMap((A) => {
    const D = (s == null ? void 0 : s.get(A.index)) ?? Tv(A.bug, t, A.spot, s ? [] : a);
    return s == null || s.set(A.index, D), s && Rv(D, A.seconds, a), Iv(D, A.seconds, a);
  }), k = g.filter((A) => Cv(A.bug)).map((A) => ({ seconds: A.seconds, from: A.spot })), b = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: b }, slush: y, camera: k };
}
function Rn(e) {
  const t = Se.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function n4(e, t, n, a) {
  const { limit: s, margin: o } = Se.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = Rn(d), m = ts(u, t, f.shot), g = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), k = Math.abs(m.x - i) >= g ? i : m.x + y * g, b = y > 0 ? Math.max(i, Math.min(k, r)) : Math.min(i, Math.max(k, l)), A = { from: i, to: b, begin: f.walk, end: f.aim };
    return i = b, A;
  });
}
function a4(e, t, n) {
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
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Ev = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Av(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Cv = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function Ov(e, t, n) {
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
function Tv(e, t, n, a = []) {
  const s = Av(e.along + 1), [o, l] = Ev[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: $e.count }, () => {
    const i = r + (s() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + s() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: $e.radius[0] + s() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...Ov(d, t, a) };
  });
}
function Rv(e, t, n) {
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
function Iv(e, t, n = []) {
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
function s4(e, t, n, a) {
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
function o4(e, t, n, a, s) {
  const { sway: o, above: l } = Se.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (k) => {
    const [b, A] = [k.x - e.at.x, k.y - e.at.y];
    return { x: r.x + b * u - A * d, y: r.y + b * d + A * u };
  }, [m, g] = [...n].sort((k, b) => k.x - b.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((k, b) => ({ from: k, to: b < y.length / 2 ? m : g })) };
}
const l4 = (e, t) => _e(t, e.grows) * (1 - _e(t, e.sinks));
function Fn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function r4(e, t) {
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
const i4 = (e) => e === "pack_box";
function c4(e) {
  const { into: t, out: n } = Fn(Se.rope_swing, e);
  return 1 - _e(t, [0, 1]) * (1 - _e(n, [0, 1]));
}
function u4(e) {
  const t = Se.rope_swing, { into: n, out: a } = Fn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return _e(n, [0, 1]) * (1 - _e(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const Bv = { after: 3 }, Ss = 10, Lv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Nv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Dv = { weight: 19 }, gr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Pv = { every: 120 }, vr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, yr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, jv = {
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
}, un = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: Ss }), ne = (e, t, n = {}) => un(e, "clip", t, n), xa = (e, t, n = {}) => un(e, "look", t, n), Ao = (e, t, n = {}) => un(e, "gaze", t, n), me = (e, t, n = {}, a = {}) => ({ ...un(e, "pick", t, n), ...a }), we = (e) => un("nothing", "nothing", e, {}), qv = 120, Fv = 300, $a = (e, t) => ({ ...ne(e, t), cooldown: Fv }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), Wv = () => [ne("joy", 2)], pt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), gt = (e) => ({ ...e, cooldown: Lv[e.name] }), Wt = (e) => ({ ...e, shenanigan: !0, lasts: Nv[e.name] }), ea = [
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
  ...le("bar_done", { holds: !0 }, Wv()),
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
  ...Object.entries(jv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [xa(t, 1)])),
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
  ...le("held:search", { cooldown: qv }, [$a("search", 3), { ...$a("binoculars", 2), when: { home: !0 } }, { ...$a("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...le("unit", { cooldown: gr.build.cooldown }, [me("unit", Dv.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...me("hang", 1, { hands: !0, free: !0 }), cooldown: Pv.every }, me("stand", 5)]),
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
], br = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), wr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Hv = (e) => Array.isArray(e) ? e[0] : e, zv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, Uv = (e) => ea.some((t) => t.when.moment === e);
function Vv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || wr(d).every(([f, m]) => n(f) >= Hv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ea.filter((d) => br(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Bv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function He(e, t) {
  const n = Vv(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (kr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function kr(e, t, n) {
  var a;
  for (const [s, o] of wr(t)) (a = e.memory) == null || a.set(s, e.now + zv(o, n));
}
function d4(e, t, n) {
  kr(e, ea.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const f4 = (e) => Object.values(gr).find((t) => br(t.when, e)) ?? null, Gv = (e, t, n) => n - t <= (e.lifetime ?? Ss), h4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || mr(e.clip, t));
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
}, m4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), $r = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), p4 = {
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
}, g4 = 120, Kv = 20, v4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Kv), Yv = (e) => ns[e] || ns.idle, y4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Mr = "airborne", Jv = "landing", Zv = "travelling", Sr = "grounded", b4 = ({ airborne: e, landing: t, trip: n }) => e ? Mr : t ? Jv : n != null && n.started ? Zv : Sr;
function w4(e, t) {
  var s;
  const n = Xv(e, t);
  return e.mode === Sr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Xv(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === Mr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Qv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const g = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: g ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : Yv(u), facing: g ? m : r.posture === "sit" ? r.face : f };
}
function Qv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const as = (e) => e.outcome, ey = "plugin:code-commandments:sins:", Co = (e) => e.type === "plugins.card" && e.markKey.startsWith(ey), ty = [
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
], k4 = (e, t) => e.filter((n) => n.author === "user" && Pn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Pn(n.read_at), card: Hl(n) })).sort((n, a) => n.time - a.time), Oo = { user: "reacted", agent: "agent_reacted" };
function x4(e, t) {
  return e.filter((n) => Oo[n.author] && Mt(n) > t).map((n) => ({ beat: `${Oo[n.author]}:${n.emoji}`, time: Mt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const ny = [.../* @__PURE__ */ new Set([...Object.values(vr).flatMap((e) => Object.keys(e)), ...Object.keys(yr)])];
function $4(e, t) {
  return e.filter((n) => n.author === "agent" && Mt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = ny.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: Mt(n), card: Hl(n) })).sort((n, a) => n.time - a.time);
}
const ay = (e) => new xr(e).isTest(), Wn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[as(e)] || "";
}, sy = 1800, oy = (e, t) => {
  if (Wn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Wn(n) !== "finished" && Number(e.time) - Number(n.time) <= sy ? "tests_fixed" : "tests_passed";
};
function M4(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(ay), s = a.filter((r) => Wn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Wn(r))), o.map((r) => ({ beat: oy(r, s), time: Number(r.time), card: r.key }));
}
function S4(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(as(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: as(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const _4 = (e) => e.map((t) => {
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
function E4(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function A4(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function C4(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = ty.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function _s(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const To = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function ly(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    _s(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function O4(e, t, n, a = {}) {
  const s = He({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : Uv(`held:${e}`) ? "idle" : e;
}
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function T4(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Re.ahead * n ? 180 : Math.sign(a) * Re.turn;
}
const Ro = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function R4(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * a) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % s, r = o % Re.sweep, i = Re.sweep - Re.returnSeconds, u = Ro((r - i) / Re.returnSeconds), d = r <= i ? Ro(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Io = 3, _r = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Bo = 12, I4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function B4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!_r(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Io ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Bo) / Bo, lasts: Io } };
}
const L4 = (e) => e.posture === "hang" && !_r(e.face), ry = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), iy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function N4(e, t, n) {
  return ry.has(e) ? 1 / 0 : !iy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Er(n - t.began, t.share) - Ze.lead, 0);
}
const cy = 5;
function D4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= cy ? { beat: "long_walk", time: n } : null };
}
const uy = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function P4(e, t, n, a, s = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = He({ moment: "spell", state: e, tally: s }, a), [l, r] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const j4 = (e, t, n) => t && n < t.until && $r.has(e.state) ? { state: t.state, since: t.began } : e, Ze = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Er = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function q4(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = Er(o, e.share);
  return s ? { eager: dy(t, l), moment: null } : l > Ze.lead ? { eager: t, moment: null } : l < Ze.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ze.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ze.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = He({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function dy(e, t) {
  return e.on && t > Ze.lead + Ze.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ze.lead && t >= Ze.least ? { ...e, on: !0, calm: !1 } : e;
}
const fy = 1, hy = { look: "look", gaze: "gaze" };
function my(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = He({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [hy[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const py = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => He({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), gy = (e, t, n, a, s, o = 0) => He({ moment: "jump", high: e > fy * t, memory: a, now: s, room: o }, n).name === "backflip", vy = { work: ["building"], idle: ["standing"] };
function F4(e, t, n, a) {
  const s = ns[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(vy[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), $r.has(e) ? { moments: o, began: n || a } : (n && a - n >= uy && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function yy(e, t, n) {
  return !He({ moment: "pondering", memory: e, now: t }, n) || !He({ moment: "thought_cloud", memory: e, now: t }, n) ? null : He({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Lo = { pondering: yy };
function W4(e, t, n, a, s, o) {
  if (Lo[e.beat]) {
    const r = Lo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = my(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== Ss && { lifetime: l.lifetime } } } : null;
}
function H4(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = py(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const z4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function U4(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function V4(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const G4 = (e, t) => !!(e != null && e.watches) && !t.once, K4 = 10, Y4 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || Gv(a, a.queuedAt, n)), J4 = (e, t) => t ? null : e[0] ?? null;
function Z4(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const X4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), by = 2 * Math.PI, wy = 500;
function Q4(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / wy, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = by * l / 1e3, g = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, k = (u ? g : t != null && t.behind && t.mood === "reading" ? { ...t } : t && g && !i ? s && !t.behind && !g.behind ? xy(g, t, n, m, s) : My(g, t, n, m) : t) ?? g, b = k != null && k.behind && k.mood === "reading" ? ky(e.point, k, n, l, s) : k;
  return { point: b ?? null, toward: b ? { x: b.x - n.x, y: b.y - n.y } : null, amount: f, at: a };
}
function ky(e, t, n, a, s) {
  const o = (S) => S * 180 / Math.PI, l = (S) => o(Math.atan2(Math.sin(S * Math.PI / 180), Math.cos(S * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, g = f ? e.readingYaw + m : d, y = g + l(u - g), k = Math.min(Math.max(a / 1e3, 0), 0.1), b = Re.turnSpeed * k, A = f ? g + Math.min(Math.max(y - g, -b), b) : y, D = f ? e.readingFollow + m : A, Y = D + (A - D) * (1 - Math.exp(-k / Re.followSeconds)), P = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, x = o(_s(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), $ = Math.min(Math.max(x, -P.up), P.down), T = Re.tipSpeed * k, L = f ? e.readingPitch + Math.min(Math.max($ - e.readingPitch, -T), T) : $;
  return { ...t, readingYaw: A, readingFollow: Y, readingPitch: L, readingFacing: r };
}
function xy(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (D) => {
    const { yaw: Y, pitch: P } = _s(D.x - n.x, s, n.y - D.y, o);
    return { yaw: Y, pitch: Math.min(Math.max(P, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [To(r(e)), To(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, g] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, k, b] = i.map((D, Y) => m * D + g * u[Y]), A = s * y / k;
  return { ...t, x: n.x + A, y: n.y - ly(A, s, -Math.asin(Math.min(Math.max(b, -1), 1)), o) };
}
const $y = 0.15;
function ex(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= $y;
}
function My(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Sy = (e) => !(e != null && e.on);
function tx(e, t, n) {
  if (Sy(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ye = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ma = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), No = (e) => e * e * (3 - 2 * e);
function _y(e) {
  if (e < 0 || e >= Ye.seconds) return null;
  const t = Ma(e, ...Ye.flicker), n = Math.floor(t * Ye.flickers * 2) % 2 === 0, a = e < Ye.flicker[1] ? n ? 0.35 + 0.5 * t : Ye.dim : 1;
  return { strength: 1 - No(Ma(e, ...Ye.fade)), lit: a, white: e < Ye.flash[0] ? 0 : 1 - No(Ma(e, ...Ye.flash)) };
}
const nx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function ax(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = _y(t - e.at);
  return a && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ye.signs[e.tone], ...a } };
}
function sx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function ox(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= an.looks || a === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function lx(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const ot = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, rx = { behind: 39, figure: 40, ahead: 41 }, Ey = "[data-figure-pile]", Ay = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, ix = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, cx = (e) => e === "amber" ? In.phases : 1;
function ux(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const dx = Object.keys(Ay), ze = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function fx(e) {
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
function hx(e) {
  const t = Math.floor(e / Sa.high);
  return { left: -(ot.inside + ot.width / 2 + t * (ot.width + Sa.gap)), up: e % Sa.high * (ot.height - ot.top) };
}
const Cy = (e, t, n) => He({ moment: "unit", memory: e, now: t }, n) !== null, Oy = { after: 5 }, Ty = (e) => e.filter((t) => t.active && (t.process || t.watch) && new xr(t).isBuild());
function mx(e, t, n) {
  const a = Ty(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= Oy.after ? s : null;
}
function px(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Cy(n, a, s) } : null;
}
const Do = { ahead: 140, up: 70 };
function gx(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Do.ahead, y: a - Do.up } } : o ? { at: { x: n(o), y: a - o.up - ot.height } } : t ? { at: null } : null;
}
const _a = { least: 4e3, most: 1e4 }, Ry = (e) => _a.least + e() * (_a.most - _a.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function vx(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = Ry(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), a = o + vt.ms;
  }
}
const yx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), bx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Ar = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), wx = new Set(ea.filter((e) => Ar.has(e.when.moment) && e.type === "clip").map((e) => e.name)), Iy = (e) => e.some((t) => t.state === "built"), kx = (e, t) => Iy(t) ? e.filter((n) => !Ar.has(n.beat)) : e, ct = { reach: 40, room: 6 }, By = (e, t) => t <= e - ct.reach + 2, xx = (e, t, n) => By(e, n) ? t - ct.reach : e - ct.reach - ct.room, $x = (e, t, n, a) => a > 0 && t < e && t + ct.reach >= e - 2 ? Math.min(n, Math.max(e, t + ct.reach)) : e, Ea = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Mx = (e) => Ut(e() < Ea.longShare ? Ea.long : Ea.short, e), Ly = 2 * ot.width;
function Sx(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= Ly ? o : e + (o - e + s / 2) % s;
}
const Ny = 60, _x = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Ny, Po = "[data-figure-home]", dn = () => {
  var t;
  const e = document.querySelector(Po);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Po)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Dy = "[data-figure-docked-bars]", Py = "[data-figure-chat-foot]", jy = [0.85, 0.6, 0.35, 0.15], qy = ["question", "waiting", "suggestion"], Ex = (e, t) => qy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Ax() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Fy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Wy = "[data-figure-newest]";
function Cr() {
  var a, s;
  const e = (a = dn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Wy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function Cx(e, t, n, a = Cr()) {
  if (!a || sn(t, e, a)) return null;
  const s = na(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Ct(), i = t.posture === "stand" ? Cs * e.size : Dr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - wt.gap - l, a.right + wt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && sn(m, e, a) && vb(m, e)).sort((m, g) => Math.abs(m.x - t.x) - Math.abs(g.x - t.x))[0] ?? null;
}
const Aa = 0.26, Or = 0.54, Hy = 1.25 / 5.4, fn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Aa, travels: "stand" },
  lounge: { drop: Aa, travels: "stand" },
  composed: { drop: Aa, travels: "stand" },
  hang: { drop: Or, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Ox = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Hy * Math.cos(t * Math.PI / 180),
  y: 1 - n - Or
}), Yt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), zy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Tx = (e, t) => (e === "sit" ? zy.has(t) : Yt.has(e)) ? e : "stand";
function Rx(e, t) {
  return e.facing === t.facing || !Yt.has(e.posture) && !Yt.has(t.posture) ? t : { posture: "stand", facing: Yt.has(e.posture) ? e.facing : t.facing };
}
const Ix = 0.25, Bx = (e, t) => Yt.has(e) && fn[t].drop === 0, Tr = 2, Uy = 90, Vy = 180, Gy = 140, Ky = 280, Yy = 420, Jy = 0.25, Zy = 290, Xy = 600, Qy = "cubic-bezier(0.2, 0.7, 0.4, 1)", eb = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ca = 5;
function Hn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ca) return null;
  (l || r) && (o = Math.max(o, Tr));
  const g = o > 1, y = Math.abs(t.x - e.x), k = y < Ca ? 0 : y / (Uy * o) * 1e3, b = Math.min(k, g ? Gy : Vy), A = Math.abs(t.y - e.y), D = t.y < e.y, Y = D && !m && gy(A, n, i, u, d, f), P = D ? Yy + Math.min(A, 400) * Jy : Math.sqrt(2 * A / Ms) * 1e3, x = {
    x: t.x,
    y: t.y,
    ms: A > Ca ? Y ? Xy : P : 0,
    lead: Y ? Zy : D ? Ky : 0,
    easing: D ? Qy : eb,
    hopping: !0,
    clip: Y ? "backflip" : D ? "jump" : "fall"
  }, $ = { x: t.x, y: t.y, ms: k + b, lead: 0, easing: "linear", ramp: b, ...g ? { clip: "run" } : {} }, T = m ? tb(t, n) : x, L = D && !a ? [{ ...$, y: e.y }, T] : [{ ...x, x: e.x }, $];
  return { way: Math.sign(t.x - e.x) || 1, legs: L, lands: !s, pace: o, running: g };
}
const tb = (e, t) => ({ x: e.x, y: e.y, ms: Se.pogo.frames / Se.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), nb = (e, t) => e.postures.includes(t) ? t : e.postures[0], Lx = (e, t, n) => e.posture === "walk" && n ? "walk" : nb(e.clip, t), et = (e, { size: t, below: n }, a = e.posture) => {
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
function Nx(e, t, n = Ct()) {
  const a = et(e, t);
  return a.left >= n.left + jo && a.right <= n.right - jo;
}
function As(e, t, n = Ct()) {
  const a = et(e, t), s = a.right - a.left, o = na(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - _n && r <= n.right + _n && a.top >= n.top - _n && i <= n.bottom + _n;
}
const zn = [0.35, 0.5, 0.65], Un = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Oe = { left: zn[0], right: zn.at(-1), top: Un[0], bottom: Un.at(-1) }, ab = 0.24;
function na(e) {
  if (e.posture === "stand") return { left: Oe.left, right: Oe.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + ab * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Oe.left, t), right: Math.max(Oe.right, t) };
}
function sb(e, { size: t }, n = Ct()) {
  const a = na(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const Cs = (Oe.right - Oe.left) / 2 + 0.08;
function Dx(e, t) {
  return e === "hang" ? Oe : { ...Oe, bottom: Math.min(Oe.bottom, 1 - t - fn[e].drop) };
}
const ob = "[data-figure-agent]";
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
  const a = et(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Fy)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && ta(s, i) && Es(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return Ir(s).filter(([r, i]) => l(r, i) || Rr(r, i, n)).length;
}
function lb(e, t) {
  const n = et(e, t);
  return Ir({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Rr(a, s, "", ob)).length;
}
const qo = 4;
function Px(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = qo; o <= s; o += qo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!lb(r, e) && sn(r, e)) return r;
    }
  return null;
}
function on(e, t, n) {
  const a = Ct(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => As(l, t, a) && sn(l, t)).map((l) => ({ spot: l, covered: Os(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Br = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), rb = [0.5, 0.25, 0.75], ib = (e) => Br(e.getBoundingClientRect(), rb), Lr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, cb = Cs, ub = (e, t, { size: n }, a = cb) => Nr(e, Lr[t], a * n, "stand");
function Nr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const db = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Dr = 0.1, fb = (e, t, { size: n }) => Nr(e, db[t], Dr * n, "sit"), hb = (e) => ((e + 180) % 360 + 360) % 360 - 180, Oa = 60;
function jx(e, t) {
  const n = hb(t);
  return !e.aside || Math.abs(n) >= Oa ? t : n < 0 ? 360 - Oa : Oa;
}
const Jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, mb = (e) => [.../* @__PURE__ */ new Set([e, ...Jt.turns.map((t) => (t + 360) % 360)])];
function qx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = mb(t), l = Jt.every[0] + a() * (Jt.every[1] - Jt.every[0]);
  return { face: t, from: s ? pb(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function pb(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function Fx(e, t) {
  const { element: n, edge: a } = aa(), s = ["left", "right"].map((r) => hn(fb(a, r, e), e)).filter((r) => n && As(r, e) && !Os(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function Wx(e, t, { size: n }) {
  const a = (Oe.right - Oe.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Pr } : e;
}
const Pr = 7;
function jr() {
  const e = [...document.querySelectorAll(Ey)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function gb(e, t) {
  const n = et(e, t), a = n.right - n.left;
  return { left: n.left + Oe.left * a, right: n.left + Oe.right * a, top: n.top + Oe.top * a, bottom: n.bottom };
}
function vb(e, t) {
  const n = jr();
  return !n || !ta(gb(e, t), n);
}
const yb = 4;
function aa() {
  const e = mn(), t = jr(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > yb || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Pr - n, 0) } };
}
const Hx = ({ size: e, below: t }) => (1 - t) * e;
function hn(e, t) {
  const n = Ct(), { size: a, below: s } = t, o = fn[e.posture].drop * a;
  return { ...sb(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ss = (e, t) => Object.keys(Lr).map((n) => hn(ub(e, n, t), t)), Ts = (e, t) => Br(e, jy).map((n) => hn(n, t)), qr = (e, t, n) => on(e, t, n) ?? e[0];
function zx(e, t) {
  const { element: n, edge: a } = aa();
  return { ...qr(ss(a, e), e, t), view: null, on: n };
}
function Ux(e, t, n, a) {
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
  const e = dn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Dy);
  if (!t) return { ...sa(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Fo = { within: 2 };
function Vx(e) {
  const { element: t, docked: n, edge: a } = mn();
  if (!n || e.on !== t) return !0;
  const s = sa().edge;
  return a.left > s.left + Fo.within || a.left + a.width < s.left + s.width - Fo.within;
}
const bb = "[data-figure-closing]";
function Gx() {
  var n;
  const { element: e, docked: t } = mn();
  return t && !!((n = e.firstElementChild) != null && n.matches(bb));
}
const Fr = "[data-figure-progress]";
function Kx(e) {
  const t = e.querySelector(Fr);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Yx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const wb = { across: 300, above: 380, below: 60 };
function Jx(e) {
  const { across: t, above: n, below: a } = wb;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: kb(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const kb = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Wr = "[data-figure-bar]", os = { back: 144, along: 0.4 };
function Zx(e) {
  const { element: t, docked: n, edge: a } = mn(), s = n ? t.querySelector(Wr) : null;
  if (!(s != null && s.querySelector(Fr))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...hn({ x: o - os.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Xx(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < os.along * a.size ? t.x + os.along * a.size : e.x, y: e.y, behind: !0 };
}
function Qx(e) {
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
function e8(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = sa(), i = n === null ? xb(r, e, o === null ? t : { x: o, y: r.top }, a, s) : hn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function xb(e, t, n, a, s) {
  const o = Ts(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + ot.width < s && i.x + a - ct.reach - ct.room >= l);
  return on(r.length ? r : o, t, n);
}
const $b = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function t8(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, Tr));
  const g = (Y) => {
    const P = et(Y, n, fn[Y.posture].travels);
    return { x: P.left, y: P.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Mb(g(e), g(t), g({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [k, ...b] = [e, ...i, t].map(g), A = Hn(k, b[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), D = b.slice(1).map((Y, P) => {
    var x;
    return (x = Hn(b[P], Y, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : x.legs.find(($) => $.hopping);
  });
  return A && { ...A, legs: [...A.legs, ...D.filter(Boolean)] };
}
function Mb(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / $b.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Hn(e, n, o.size, { pace: l }) : Hn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function n8(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function a8(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && on(ib(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = aa();
  return { ...qr(Ts(s, t), t, n), view: null, on: a };
}
const Sb = "[data-figure-bubble]", _b = 250;
let Zt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Hr = 0;
const qt = () => Zt, Ta = /* @__PURE__ */ new WeakMap();
let Eb = 0;
function Rs(e) {
  return Ta.has(e) || Ta.set(e, `floor-${++Eb}`), Ta.get(e);
}
const Ab = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Cb = () => {
  var e, t;
  return ((t = (e = dn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Ob(e, t) {
  var a;
  const n = (a = e.querySelector(Py)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Tb(e, t) {
  const n = e && Ob(e, t), a = e ? [...e.querySelectorAll(Sb)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Ab(l, n))).map(({ element: o, type: l, box: r }) => ({ id: Rs(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Rb = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= _b ? (t.top - a.top) / s * 1e3 : 0;
};
function zr(e = Zt, t = performance.now()) {
  const n = Ct(), a = Cb(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = mn(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = sa();
  return u.element && i.push({ id: Rs(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...Tb(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: Rb(e, d, t) }))) });
}
const ls = /* @__PURE__ */ new Set();
function Ib(e) {
  return ls.add(e), () => ls.delete(e);
}
function Bb() {
  Ur();
  const e = () => {
    Hr = requestAnimationFrame(e), !document.hidden && (Zt = zr(Zt), ls.forEach((t) => t(Zt)));
  };
  e();
}
function Ur() {
  cancelAnimationFrame(Hr);
}
const Is = 5, Lb = 56, Nb = { share: 0.6 }, Db = (e) => -Math.sqrt(2 * Ms * Nb.share * e), Nt = (e, t) => e.find((n) => n.id === t) ?? null;
function s8(e, t = zr().floors) {
  const n = Nt(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Rs(e.on) : null, o = s && Nt(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Vr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = qt().floors) {
  const u = Nt(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || Pb(u, d, o)) && jb(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Bs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Pb = (e, t, n) => !Bs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function o8(e, t = qt().floors) {
  if (!Bs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Is && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function jb(e, t, n = qt().floors) {
  const a = Nt(n, "home");
  return e.posture === "hang" && a && et(e, t).bottom >= a.top ? !1 : As(e, t);
}
function l8(e, t, n, a = qt().floors) {
  const s = Vr(e, n, a);
  if (!e.home) return qb(e, t, s, a);
  if (!s) return null;
  const o = Nt(a, "home"), l = s.y - t.y, r = l > Is ? "dropping" : -l > Lb ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function qb(e, t, n, a) {
  const s = n ? Nt(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Db(e.risen) };
  if (!n) return null;
  if (Bs(t) && n.y - t.y > Is) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function r8(e, t, n) {
  const a = Cs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function i8(e, t, n, a = qt().floors) {
  const s = t && Vr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Fb = ["data-type"], Wb = { class: "figure-floor-name" }, Hb = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: ge({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      v("span", Wb, w(e.floor.type), 1)
    ], 12, Fb));
  }
}, zb = /* @__PURE__ */ K(Hb, [["__scopeId", "data-v-4e0f1e2e"]]), Ub = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Vb = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ve(qt().floors);
    let n = () => {
    };
    return Be(() => {
      n = Ib((a) => t.value = a.floors), Bb();
    }), Le(() => {
      n(), Ur();
    }), (a, s) => (c(), h("div", Ub, [
      (c(!0), h(G, null, ee(t.value, (o) => (c(), H(zb, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, c8 = /* @__PURE__ */ K(Vb, [["__scopeId", "data-v-e519168b"]]), Ra = (e) => typeof e == "number" ? e : Date.parse(e);
function u8(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Ra(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Ra(s.row.created_at) - Ra(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const Gb = 3, Ia = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Kb(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ia[n.grouping]) == null ? void 0 : a.call(Ia, e.row, n)) || "";
}
function Yb(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function d8(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Gb ? [Yb(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = Kb(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const Jb = {
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
}, Zb = 1e3;
function Xb() {
  const e = R(Date.now()), t = setInterval(() => e.value = Date.now(), Zb);
  return _t(() => clearInterval(t)), e;
}
const Qb = ["datetime", "title"], oa = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Xb(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(j(Xl)(e.at, j(n))), 9, Qb));
  }
};
function f8(e) {
  const t = ft(), n = t.option("row"), a = R(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function ew(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const h8 = (e) => (t) => t.filter((n) => n.id !== e), m8 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), p8 = (e) => (t) => [...t, e], g8 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function v8(e, t = {}) {
  const n = ft(), a = R(null), s = R("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function y8(e) {
  const t = ft(), n = R("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const En = /* @__PURE__ */ new Map();
function tw(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function b8() {
  const e = ft(), t = R(null), n = R("");
  async function a() {
    const s = await tw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const nw = { class: "cards-page" }, aw = { class: "cards-bar" }, sw = { class: "cards-count" }, ow = { class: "cards" }, lw = {
  key: 1,
  class: "cards-note"
}, rw = {
  key: 2,
  class: "cards-note"
}, iw = ["data-row", "onClick"], cw = { class: "card-head" }, uw = { class: "card-title" }, dw = { class: "card-foot" }, fw = {
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
    return (a, s) => (c(), h("div", nw, [
      v("div", aw, [
        v("span", sw, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        N(de, Ge({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: q(() => [
            N(ye, {
              name: "plus",
              size: 12
            }),
            Q(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      v("div", ow, [
        e.loaded ? e.failure ? (c(), h("p", lw, w(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", rw, "No " + w(e.noun) + "s yet", 1)) : (c(), H(Et, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(G, null, ee(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          v("span", cw, [
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
          v("span", uw, w(e.title(o)), 1),
          v("span", dw, w(e.foot(o)), 1)
        ], 8, iw))), 128))
      ]),
      ue(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, w8 = /* @__PURE__ */ K(fw, [["__scopeId", "data-v-990e6b37"]]), Wo = "newest";
function k8(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = Ee(Te, null)) == null ? void 0 : u.search, s = R(""), o = R(Wo), l = R("all"), r = I(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => ew(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Wo ? f : [...f].sort((m, g) => t(m).localeCompare(t(g)));
  }), i = I(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const hw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, mw = 40, pw = "top", gw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = Ee(Te, null)) == null ? void 0 : f.autoScroll, s = I(() => a === pw), o = R(null), l = R(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= mw;
    }
    return he(() => n.rowCount, async () => {
      await dt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, g) => (c(), h("div", hw, [
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
        default: q(() => [
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
}, x8 = /* @__PURE__ */ K(gw, [["__scopeId", "data-v-3accb764"]]), vw = ["aria-selected", "data-tab", "onClick"], yw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, bw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Ee(Te, null), o = I(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = R(null), r = R({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
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
      (c(!0), h(G, null, ee(o.value, (y) => {
        var k, b;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((k = e.active) == null ? void 0 : k.key) === y.key }]),
          "aria-selected": ((b = e.active) == null ? void 0 : b.key) === y.key,
          "data-tab": y.key,
          onClick: (A) => a("choose", y)
        }, [
          Q(w(y.label) + " ", 1),
          i(y) ? (c(), h("span", yw, w(e.answer[y.count_field]), 1)) : E("", !0)
        ], 10, vw);
      }), 128)),
      v("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: ge({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, $8 = /* @__PURE__ */ K(bw, [["__scopeId", "data-v-63fcd326"]]), ww = {
  class: "tab-body",
  "data-tab-body": ""
}, kw = { "data-tab-content": "" }, xw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = R(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, hs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", ww, [
      n.value ? (c(), H(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : E("", !0),
      Qe(v("div", kw, [
        ue(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Zo, !n.value]
      ])
    ]));
  }
}, M8 = /* @__PURE__ */ K(xw, [["__scopeId", "data-v-63876533"]]), $w = {}, Mw = { class: "menu-label" };
function Sw(e, t) {
  return c(), h("span", Mw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const rs = /* @__PURE__ */ K($w, [["render", Sw], ["__scopeId", "data-v-aa955b3e"]]), _w = {
  class: "search-bar",
  "data-search-bar": ""
}, Ew = { class: "search-bar-control" }, Aw = ["value", "placeholder", "aria-label"], Cw = ["aria-expanded"], Ow = {
  key: 0,
  "data-menu-count": ""
}, Tw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var A;
    const a = e, s = n, o = ii(), l = ((A = Ee(Te, null)) == null ? void 0 : A.search) ?? {}, r = I(() => l.placeholder || a.placeholder), i = l.context ?? [], u = R(null), d = R(null), f = R([]), m = I(() => f.value.length ? f.value[f.value.length - 1].next : i), g = I(() => !!o.menu || i.length > 0), y = (D) => {
      f.value = [], d.value = d.value ? null : D.currentTarget;
    };
    function k(D) {
      if (D.next.length) {
        f.value = [...f.value, D];
        return;
      }
      d.value = null, s("pick", D.click);
    }
    function b() {
      var D;
      s("update:modelValue", ""), (D = u.value) == null || D.focus();
    }
    return t({ focus: () => {
      var D;
      return (D = u.value) == null ? void 0 : D.focus();
    } }), (D, Y) => {
      var P;
      return c(), h("div", _w, [
        v("div", Ew, [
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
            onInput: Y[0] || (Y[0] = (x) => s("update:modelValue", x.target.value)),
            onKeydown: Xt(b, ["esc"])
          }, null, 40, Aw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: b
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
            e.menuCount ? (c(), h("span", Ow, w(e.menuCount), 1)) : E("", !0),
            N(ye, {
              name: "caret",
              size: 12
            })
          ], 8, Cw)) : E("", !0)
        ]),
        (P = j(l).button) != null && P.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Y[1] || (Y[1] = (x) => s("pick", j(l).button.click))
        }, w(j(l).button.title), 1)) : E("", !0),
        ue(D.$slots, "default", {}, void 0, !0),
        d.value ? (c(), H(Jn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Y[3] || (Y[3] = xe(() => {
          }, ["stop"])),
          onClose: Y[4] || (Y[4] = (x) => d.value = null)
        }, {
          default: q(() => [
            f.value.length ? (c(), H($t, {
              key: 0,
              "data-search-back": "",
              onClick: Y[2] || (Y[2] = (x) => f.value = f.value.slice(0, -1))
            }, {
              default: q(() => [
                Q("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(G, null, ee(m.value, (x) => (c(), H($t, {
              key: x.title,
              description: x.subtext,
              "data-search-entry": x.title,
              onClick: ($) => k(x)
            }, {
              default: q(() => [
                Q(w(x.title) + w(x.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? E("", !0) : ue(D.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : E("", !0)
      ]);
    };
  }
}, Rw = /* @__PURE__ */ K(Tw, [["__scopeId", "data-v-45374bed"]]), Iw = {
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
    return (o, l) => (c(), H(Rw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: q(() => [
        N(rs, null, {
          default: q(() => [...l[2] || (l[2] = [
            Q("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(G, null, ee(a, (r) => N($t, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: q(() => [
            Q(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(G, { key: 0 }, [
          N(rs, null, {
            default: q(() => [...l[3] || (l[3] = [
              Q("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, ee(s, (r) => N($t, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: q(() => [
              Q(w(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : E("", !0)
      ]),
      default: q(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, S8 = /* @__PURE__ */ K(Iw, [["__scopeId", "data-v-dab0064d"]]);
function _8() {
  const e = R(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const E8 = (e) => import(
  /* @vite-ignore */
  e
), Bw = 86400, is = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Lw(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((is(t) - is(e)) / Bw);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function A8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = is(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: Lw(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ba = 280, La = 240, Na = 120, Nw = 6, Dw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Pw(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Gr(e, t) {
  const n = Math.max(0, Pw(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function jw(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Dw}px)` }), e.offsetHeight, e.style.transition = `height ${Ba}ms ${ln}`, e.style.height = `${l}px`;
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
function C8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Nw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Na}ms ease-out, transform ${Na}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Gr(t, e)), s() - l < Na) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const qw = 140, An = 220, Ho = 5;
function O8({ gap: e = qw, later: t = setTimeout } = {}) {
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
  const u = (d, f, m, g = jw) => {
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
function T8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${ln}, opacity ${An}ms ease-in, margin ${An}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Kr = "chat.pins.minimised", Bn = R(Ln(Kr, !1));
function zo(e) {
  Bn.value = e, ys(Kr, e);
}
function Fw(e) {
  const t = I(() => e()), n = I(() => Bn.value ? [] : e()), a = () => zo(!Bn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => Mt(o) > s).length,
    (o, l) => o > l && zo(!1)
  ), { pins: t, visible: n, minimised: Bn, toggle: a };
}
const Ww = ["title"], Hw = {
  key: 0,
  class: "pins-count"
}, zw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Fw(() => t.pinRows);
    return (o, l) => j(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: j(a), inline: e.inline }]),
      title: j(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = xe((...r) => j(s) && j(s)(...r), ["stop"]))
    }, [
      N(ye, {
        name: j(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      j(a) ? (c(), h("span", Hw, w(j(n).length), 1)) : E("", !0)
    ], 10, Ww)) : E("", !0);
  }
}, R8 = /* @__PURE__ */ K(zw, [["__scopeId", "data-v-d073c504"]]), Uw = ["title"], Vw = ["title"], Gw = { class: "diff-card-dir" }, Kw = { class: "diff-card-name" }, Yw = ["title"], Jw = ["title"], Zw = {
  key: 0,
  class: "diff-card-note"
}, Xw = ["href"], Qw = ["src", "alt"], ek = { class: "diff-card-rows" }, tk = { class: "diff-row-num" }, nk = { class: "diff-row-sign" }, ak = { class: "diff-row-code" }, sk = {
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
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), u = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), f = I(() => n.change === "deleted"), m = I(() => l[n.change]), g = I(() => new Set(n.rows.filter((B) => B.line_type === "add").map((B) => B.line))), y = R("after"), k = I(() => y.value === "before" ? n.whole.old : n.whole.text), b = I(() => n.whole && n.whole.text !== void 0 ? k.value.split(`
`).map((B, M) => ({ line_type: y.value === "after" && g.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: B })) : n.rows.filter(
      (B) => !(n.editsOnly && ["ctx", "fold"].includes(B.line_type)) && !(n.hideRemovals && B.line_type === "del")
    )), A = R(!1), D = I(() => n.lines && !A.value && !n.whole), Y = I(() => D.value ? b.value.slice(0, n.lines) : b.value), P = I(() => b.value.length - Y.value.length), x = (B) => B.line === null || B.line_type === "del" ? "" : B.line, $ = (B) => B.line_type === "fold" ? B.hidden ? `⋯ ${B.hidden} lines` : "⋯" : B.text, T = R(null), L = R(null);
    let S = null;
    return Be(() => {
      if (!L.value) return;
      let B = !0;
      S = new ResizeObserver(() => {
        !T.value || !L.value || (T.value.style.transition = B ? "none" : "", T.value.style.height = `${L.value.offsetHeight}px`, B = !1);
      }), S.observe(L.value);
    }), Le(() => S && S.disconnect()), (B, M) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      v("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (p) => !f.value && a("fold"))
      }, [
        v("span", {
          class: "diff-card-path",
          title: `${e.path} · ${j(s)}-click to open it`,
          onClick: o
        }, [
          v("span", Gw, w(u.value), 1),
          v("span", Kw, w(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.change])
          }, w(m.value), 3)) : E("", !0)
        ], 8, Vw),
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
        }, w(y.value === "after" ? "After" : "Before"), 9, Yw)) : E("", !0),
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
        ], 10, Jw))
      ], 8, Uw),
      e.whole && e.whole.error ? (c(), h("p", Zw, w(e.whole.error), 1)) : E("", !0),
      !f.value && !e.folded ? (c(), h(G, { key: 1 }, [
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
          }, null, 8, Qw)
        ], 8, Xw)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: T,
          class: "diff-card-grow"
        }, [
          v("div", {
            ref_key: "body",
            ref: L,
            class: "diff-card-diff"
          }, [
            v("div", ek, [
              (c(!0), h(G, null, ee(Y.value, (p, O) => (c(), h("div", {
                key: O,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                v("span", tk, w(x(p)), 1),
                v("span", nk, w(r[p.line_type]), 1),
                v("span", ak, w($(p)), 1)
              ], 2))), 128)),
              P.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = xe((p) => A.value = !0, ["stop"]))
              }, w(P.value) + " more " + w(P.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, I8 = /* @__PURE__ */ K(sk, [["__scopeId", "data-v-23581cbb"]]), ok = {
  key: 0,
  class: "window-failure"
}, lk = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ft(), a = R(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], il(s, Jb.openPanel)), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", ok, w(a.value.error), 1)) : a.value ? (c(), H(em, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : E("", !0);
  }
}, rk = {
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
    const n = t, a = e, s = I(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = I(() => s.value && { render: () => Gn(lk, { line: s.value.line }) }), l = R(null), r = I(() => {
      var m, g;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((g = l.value) != null && g.component_trusted);
    }), i = I(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = I(
      () => {
        var m, g;
        return l.value ? Cg(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((g = s.value) == null ? void 0 : g.runs) || [], missing: [], ask: async () => !0 };
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
      var y, k;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), H($s, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((k = s.value) == null ? void 0 : k.shows) === "one-agent" && e.agent === null ? (c(), H(Qt, {
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
        onOption: g[0] || (g[0] = (b, A) => n("option", b, A))
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
        onOption: g[1] || (g[1] = (b, A) => n("option", b, A))
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
        onOption: g[2] || (g[2] = (b, A) => n("option", b, A))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), H(Kt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: g[3] || (g[3] = (b) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, ik = ["data-section"], ck = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = Ee(tu, null), a = I(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = I(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(G, null, ee(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(rk, {
        name: r.name,
        catalogue: j(n).catalogue,
        subscriptions: j(n).subscriptions,
        environment: j(n).environment,
        prompts: j(n).prompts,
        "shell-read": j(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, ik))), 128));
  }
}, uk = {
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
      default: q(() => [
        N(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, dk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, fk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, hk = { class: "ask-text" }, mk = ["placeholder", "aria-label"], pk = ["placeholder", "aria-label"], gk = {
  key: 3,
  class: "moves"
}, vk = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => A0(a.noun, a.row)), l = R(""), r = R(null), i = R(""), u = R("");
    he(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(g, y = "") {
      const k = await a.read([g.noun ?? a.noun, g.word, String(a.id), ...g.flag ? [g.flag, y] : g.positional ? [y] : [], ...g.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = k.ok ? "" : k.error, k.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (g) => g.confirm ? r.value = g : g.said ? d(g, g.said) : g.flag || g.positional ? (r.value = g, i.value = "") : d(g), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (g, y) => {
      var k;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", dk, w(l.value), 1)) : E("", !0),
        (k = r.value) != null && k.confirm ? (c(), h("div", fk, [
          v("span", hk, w(r.value.confirm), 1),
          N(de, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: Z({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (b) => d(r.value))
          }, {
            default: q(() => [
              Q(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          N(de, {
            small: "",
            variant: "ghost",
            onClick: y[1] || (y[1] = (b) => r.value = null)
          }, {
            default: q(() => [...y[7] || (y[7] = [
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
            "onUpdate:modelValue": y[2] || (y[2] = (b) => i.value = b),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: y[3] || (y[3] = Xt(xe((b) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, mk), [
            [qa, i.value]
          ]),
          r.value.opener ? Qe((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (b) => u.value = b),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: y[5] || (y[5] = Xt(xe((b) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, pk)), [
            [qa, u.value]
          ]) : E("", !0),
          N(de, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: q(() => [
              Q(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          N(de, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (b) => r.value = null)
          }, {
            default: q(() => [...y[8] || (y[8] = [
              Q("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", gk, [
          (c(!0), h(G, null, ee(o.value, (b) => (c(), H(de, {
            key: b.word,
            small: !b.bordered,
            bordered: b.bordered,
            icon: b.icon,
            variant: b.main ? "primary" : "ghost",
            class: Z({ danger: b.danger }),
            "data-move": b.word,
            onClick: (A) => f(b)
          }, {
            default: q(() => [
              Q(w(b.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : E("", !0);
    };
  }
}, yk = /* @__PURE__ */ K(vk, [["__scopeId", "data-v-0262f48f"]]), bk = /* @__PURE__ */ new Set(["completed", "cancelled"]), wk = (e) => bk.has(e), Vn = (e) => wk(e) ? "done" : e, kk = { class: "facts" }, xk = { class: "fact wide" }, $k = { class: "fact-value" }, Mk = {
  key: 0,
  class: "fact"
}, Sk = { class: "fact-value" }, _k = { class: "fact" }, Ek = { class: "fact-label" }, Ak = ["title"], Ck = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Ok = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, Tk = {
  key: 2,
  class: "fact"
}, Rk = { class: "fact-value" }, Ik = { class: "fact wide" }, Bk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Lk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = jn.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", kk, [
        v("div", xk, [
          l[2] || (l[2] = v("span", { class: "fact-label" }, "Plan", -1)),
          v("span", $k, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Mk, [
          l[3] || (l[3] = v("span", { class: "fact-label" }, "Phase", -1)),
          v("span", Sk, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.helper_id ? (c(), h(G, { key: 1 }, [
          v("div", _k, [
            v("span", Ek, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            v("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[0] || (l[0] = (u) => j(We)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Ak)
          ]),
          j(s).has(e.task.state) ? (c(), h("p", Ck, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", Ok, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : E("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", Tk, [
          l[4] || (l[4] = v("span", { class: "fact-label" }, "Assigned to", -1)),
          v("span", Rk, "Agent " + w(e.task.holder_id), 1)
        ])) : E("", !0),
        v("div", Ik, [
          l[5] || (l[5] = v("span", { class: "fact-label" }, "Priority", -1)),
          N(Zn, {
            options: j(n),
            value: String(j(er)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[1] || (l[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Bk, w(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, Nk = /* @__PURE__ */ K(Lk, [["__scopeId", "data-v-2bcdca7a"]]), Dk = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, Pk = ["datetime"], jk = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", Dk, [
      n[0] || (n[0] = v("h3", null, "Block history", -1)),
      (c(!0), h(G, null, ee(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        v("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, Pk),
        v("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : E("", !0);
  }
}, qk = /* @__PURE__ */ K(jk, [["__scopeId", "data-v-b41f213b"]]), Fk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Wk = { ...Fk, done: "Completed" }, Hk = { class: "task-status-icon" }, zk = ["width", "height", "aria-label"], Uk = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => ml("task", Vn(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => Wk[t.status] ?? hl("task", t.status));
    return (o, l) => (c(), h("span", Hk, [
      N(Dt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: q(() => [
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
              blocked: q(() => [...l[0] || (l[0] = [
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
              done: q(() => [...l[1] || (l[1] = [
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
              started: q(() => [...l[2] || (l[2] = [
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
              asked: q(() => [...l[3] || (l[3] = [
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
              paused: q(() => [...l[4] || (l[4] = [
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
              planned: q(() => [...l[5] || (l[5] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: q(() => [...l[6] || (l[6] = [
                v("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, zk))
        ]),
        _: 1
      })
    ]));
  }
}, Yr = /* @__PURE__ */ K(Uk, [["__scopeId", "data-v-ae24a63f"]]), Vk = {
  class: "part",
  "data-resource-waits": ""
}, Gk = ["onClick"], Kk = { class: "wait-id" }, Yk = { class: "wait-title" }, Jk = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", Vk, [
      v("h4", null, w(e.title), 1),
      (c(!0), h(G, null, ee(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Yr, {
          status: j(Vn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        v("span", Kk, w(o.id), 1),
        v("span", Yk, w(o.title), 1)
      ], 8, Gk))), 128))
    ]));
  }
}, Uo = /* @__PURE__ */ K(Jk, [["__scopeId", "data-v-8fb2e251"]]), Zk = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Xk = { class: "text" }, Qk = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, e2 = 180, t2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = R(!1), l = I(() => a.task.waits.filter((i) => !n.has(i.state))), r = I(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(G, null, [
      l.value.length ? (c(), H(Uo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", Zk, [
        u[3] || (u[3] = v("h4", null, "How it was done", -1)),
        v("p", Xk, w(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", Qk, [
        u[4] || (u[4] = v("h4", null, "The brief", -1)),
        v("p", {
          class: Z(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > e2 && !o.value ? (c(), h("button", {
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
}, n2 = /* @__PURE__ */ K(t2, [["__scopeId", "data-v-4a3f1e79"]]), a2 = {
  class: "task-details",
  "data-task-details": ""
}, s2 = { class: "since" }, o2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, l2 = { class: "text" }, r2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, i2 = {
  key: 1,
  class: "note"
}, c2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, u2 = { class: "text" }, d2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", a2, [
        v("div", {
          class: Z(["state-line", j(Vn)(e.task.state)])
        }, [
          v("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Yr, {
              status: j(Vn)(e.task.state)
            }, null, 8, ["status"]),
            Q(" " + w(a(e.task.state)), 1)
          ]),
          v("span", s2, [
            o[3] || (o[3] = Q(" since ", -1)),
            N(oa, {
              at: j(zl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", o2, [
          o[4] || (o[4] = v("span", { class: "label" }, "Blocked, waiting on", -1)),
          v("p", l2, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", r2, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", i2, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", c2, [
          o[5] || (o[5] = v("span", { class: "label" }, "Why it was cancelled", -1)),
          v("p", u2, w(e.task.reason), 1)
        ])) : E("", !0),
        N(Nk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(n2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(qk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, f2 = /* @__PURE__ */ K(d2, [["__scopeId", "data-v-408e9f91"]]), h2 = 50, m2 = { messages: 25 }, p2 = (e) => m2[e] || h2, g2 = {
  class: "task-log",
  "aria-label": "Task log"
}, v2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, y2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, b2 = { class: "entries" }, w2 = ["datetime"], k2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, x2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = R([]), a = R(1), s = R(!0), o = R(!0), l = R("");
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
        String(p2("task_logs")),
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
    }), (u, d) => (c(), h("section", g2, [
      o.value ? (c(), H(Et, { key: 0 })) : l.value ? (c(), h(G, { key: 1 }, [
        v("p", v2, w(l.value), 1),
        N(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: q(() => [...d[3] || (d[3] = [
            Q("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? E("", !0) : (c(), h("p", y2, "No log entries yet.")),
        v("ol", b2, [
          (c(!0), h(G, null, ee(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            v("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, w2),
            v("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", k2, [
          N(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: q(() => [...d[4] || (d[4] = [
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
            default: q(() => [...d[5] || (d[5] = [
              Q("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : E("", !0)
      ], 64))
    ]));
  }
}, $2 = /* @__PURE__ */ K(x2, [["__scopeId", "data-v-98b3a6b1"]]), M2 = { class: "comment-side-head" }, S2 = {
  key: 0,
  class: "comment-none"
}, _2 = { key: 0 }, E2 = {
  key: 1,
  class: "comment-none"
}, A2 = {
  class: "comment",
  "data-comment": ""
}, C2 = {
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
      v("header", M2, [
        n[2] || (n[2] = v("h3", null, "Comments", -1)),
        N(vs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      !e.comments.length && !e.loading && !e.failure ? (c(), h("p", S2, "No comments yet")) : E("", !0),
      (c(!0), h(G, null, ee(e.comments, (a) => (c(), h("section", {
        key: a.id
      }, [
        a.quote ? (c(), h("blockquote", _2, w(a.quote), 1)) : E("", !0),
        a.revision ? (c(), h("span", E2, "Revision " + w(a.revision), 1)) : E("", !0),
        v("p", A2, w(e.words(a)), 1)
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
}, O2 = /* @__PURE__ */ K(C2, [["__scopeId", "data-v-276284a3"]]);
var Ko;
/Mac|iPhone|iPad/.test(((Ko = navigator.userAgentData) == null ? void 0 : Ko.platform) || navigator.platform);
function T2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const R2 = ["placeholder"], I2 = { class: "actions" }, B2 = { class: "error" }, L2 = {
  key: 1,
  class: "card closed"
}, N2 = { class: "mark" }, D2 = { class: "prompt" }, P2 = {
  key: 0,
  class: "draft"
}, j2 = {
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
    const a = e, s = n, o = Pa(e, "draft"), l = Pa(e, "error"), r = R(!!l.value), i = R(!1), u = R(!1), d = R(null);
    async function f() {
      var y, k;
      r.value = !0, i.value = !1, await dt(), (k = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || k.focus();
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
        } catch (k) {
          o.value = y, l.value = k.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, k) => (c(), h("div", {
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
          "onUpdate:modelValue": k[0] || (k[0] = (b) => o.value = b),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: k[1] || (k[1] = Xt((b) => j(T2)(b, g), ["enter"]))
        }, null, 40, R2), [
          [qa, o.value]
        ]),
        v("div", I2, [
          v("span", B2, w(l.value), 1),
          N(de, {
            small: "",
            onClick: m
          }, {
            default: q(() => [...k[3] || (k[3] = [
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
            default: q(() => [...k[4] || (k[4] = [
              Q("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", L2, [
        v("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          v("span", N2, [
            N(ye, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          v("span", D2, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", P2, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[2] || (k[2] = (b) => s("show"))
        }, [
          v("span", null, w(j(Xi)(e.count, "comment")), 1),
          N(ye, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, q2 = /* @__PURE__ */ K(j2, [["__scopeId", "data-v-b68baddd"]]);
function F2(e, t) {
  const n = R([]), a = R(!1), s = R(null), o = R(0), l = R(!1), r = R("");
  let i = 0, u = 0;
  const d = (y) => {
    if (typeof y.body == "string") return y.body;
    const { noun: k, id: b, title: A } = e(), D = `On ${k} ${b}, ${A}: `;
    return y.text.startsWith(D) ? y.text.slice(D.length) : y.text;
  };
  async function f(y = 1) {
    const { noun: k, id: b } = e();
    if (!b) return;
    const A = ++u;
    l.value = !0, r.value = "";
    try {
      const D = await t([k, "comments", String(b), "--page", String(y), "--page-size", "25"]);
      if (A !== u) return;
      if (!D.ok) {
        r.value = D.error;
        return;
      }
      const Y = D.value.rows ?? [], P = y === 1 ? Y : [...n.value, ...Y];
      n.value = [...new Map(P.map((x) => [x.id, x])).values()], o.value = D.value.total ?? n.value.length, s.value = D.value.next_page ?? null;
    } catch (D) {
      A === u && (r.value = D.message);
    } finally {
      A === u && (l.value = !1);
    }
  }
  async function m(y) {
    var x;
    const { noun: k, id: b } = e(), A = `${k}:${b}`, D = { id: `sending-${++i}`, text: y };
    n.value = [...n.value, D], o.value++, a.value = !0;
    const Y = await t([k, "comment", String(b), y]);
    if (A !== `${e().noun}:${e().id}`) return;
    if (!Y.ok)
      throw n.value = n.value.filter(($) => $.id !== D.id), o.value = Math.max(0, o.value - 1), new Error(Y.error);
    await f();
    const P = (x = Y.value) == null ? void 0 : x.id;
    P && !n.value.some(($) => $.id === P) && (n.value = [...n.value, { ...D, id: P }]);
  }
  const g = () => !l.value && s.value && f(s.value);
  return he(() => `${e().noun}:${e().id}`, () => {
    a.value = !1, n.value = [], s.value = null, o.value = 0, r.value = "", u++, f();
  }, { immediate: !0 }), { comments: n, open: a, words: d, send: m, load: f, loadMore: g, nextPage: s, total: o, loading: l, failure: r };
}
const W2 = { class: "top" }, H2 = {
  class: "crumb",
  "data-task-crumb": ""
}, z2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, U2 = {
  key: 1,
  class: "body"
}, V2 = { class: "summary" }, G2 = { class: "stamp" }, K2 = {
  class: "title",
  "data-resource-title": ""
}, Y2 = {
  class: "tabs",
  "data-task-tabs": ""
}, J2 = { class: "panels" }, Z2 = {
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
    const a = e, s = n, o = R(null), l = R(null), r = R(""), i = R(""), u = R(null), d = R(null), f = R("details"), m = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], g = F2(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (P) => a.read(P)
    );
    let y = 0;
    const k = I(() => {
      var P;
      return (P = l.value) != null && P.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function b() {
      const P = ++y, [x, $] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      P === y && (r.value = x.ok ? "" : x.error, o.value = x.ok ? x.value : null, l.value = $.ok ? $.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, l.value = null, u.value = null, f.value = "details", b();
      },
      { immediate: !0 }
    ), he(() => a.changes, b), he(g.open, (P) => {
      P && (f.value = "comments");
    });
    async function A(P) {
      const x = o.value.priority;
      o.value.priority = Number(P);
      const $ = await a.read(["task", "edit", String(a.id), "--priority", P]);
      if (i.value = $.ok ? "" : $.error, $.ok) return b();
      o.value.priority = x;
    }
    function D(P) {
      u.value = null, d.value.press(P);
    }
    const Y = (P) => {
      var x;
      return ((x = d.value) == null ? void 0 : x.moves.length) && (u.value = P);
    };
    return t({ openStatus: Y }), (P, x) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      v("div", W2, [
        e.backed ? (c(), H(uk, {
          key: 0,
          onBack: x[0] || (x[0] = ($) => s("back"))
        })) : E("", !0),
        v("span", H2, w(k.value), 1),
        x[10] || (x[10] = v("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
          N(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: x[1] || (x[1] = ($) => s("step", -1))
          }, {
            default: q(() => [
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
            onClick: x[2] || (x[2] = ($) => s("step", 1))
          }, {
            default: q(() => [
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
          onClick: x[3] || (x[3] = ($) => s("close"))
        }, {
          default: q(() => [
            N(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (c(), h("p", z2, w(r.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        N(yk, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: b
        }, null, 8, ["id", "row", "read"]),
        v("header", V2, [
          v("div", G2, [
            Q(" Task " + w(o.value.id) + " · updated ", 1),
            N(oa, {
              at: j(zl)(o.value)
            }, null, 8, ["at"])
          ]),
          v("h3", K2, w(o.value.title), 1)
        ]),
        v("div", Y2, [
          N(Zn, {
            options: m,
            value: f.value,
            onPick: x[4] || (x[4] = ($) => f.value = $)
          }, null, 8, ["value"])
        ]),
        v("div", J2, [
          N(Pt, { value: f.value }, {
            details: q(() => [
              N(f2, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: Y,
                onPriority: A,
                onSelect: x[5] || (x[5] = ($) => s("select", $))
              }, null, 8, ["task", "place", "refusal"]),
              N(ck, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"]),
              N(Ji, {
                model: "task",
                id: e.id,
                read: e.read,
                changes: e.changes,
                onOpen: x[6] || (x[6] = ($) => s("select", $))
              }, null, 8, ["id", "read", "changes"])
            ]),
            comments: q(() => [
              N(O2, {
                below: "",
                comments: j(g).comments.value,
                words: j(g).words,
                more: !!j(g).nextPage.value,
                loading: j(g).loading.value,
                failure: j(g).failure.value,
                onMore: j(g).loadMore,
                onClose: x[7] || (x[7] = ($) => f.value = "details")
              }, null, 8, ["comments", "words", "more", "loading", "failure", "onMore"])
            ]),
            log: q(() => [
              N($2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(q2, {
          send: j(g).send,
          count: j(g).total.value,
          onShow: x[8] || (x[8] = ($) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", U2, [
        N(Et)
      ])),
      u.value ? (c(), H(Jn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: x[9] || (x[9] = ($) => u.value = null)
      }, {
        default: q(() => [
          N(rs, null, {
            default: q(() => [
              Q("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, ee(d.value.moves, ($) => (c(), H($t, {
            key: $.word,
            onClick: (T) => D($)
          }, {
            default: q(() => [
              Q(w($.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, B8 = /* @__PURE__ */ K(Z2, [["__scopeId", "data-v-7a9aa909"]]);
function X2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Da = { exports: {} }, Vo;
function Q2() {
  return Vo || (Vo = 1, (function(e, t) {
    var n = (function() {
      var a = function(x, $) {
        var T = 236, L = 17, S = x, B = o[$], M = null, p = 0, O = null, C = [], _ = {}, J = function(W, z) {
          p = S * 4 + 17, M = (function(F) {
            for (var U = new Array(F), V = 0; V < F; V += 1) {
              U[V] = new Array(F);
              for (var X = 0; X < F; X += 1)
                U[V][X] = null;
            }
            return U;
          })(p), te(0, 0), te(p - 7, 0), te(0, p - 7), pe(), ie(), qe(W, z), S >= 7 && Ce(W), O == null && (O = ae(S, B, C)), ve(O, z);
        }, te = function(W, z) {
          for (var F = -1; F <= 7; F += 1)
            if (!(W + F <= -1 || p <= W + F))
              for (var U = -1; U <= 7; U += 1)
                z + U <= -1 || p <= z + U || (0 <= F && F <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (F == 0 || F == 6) || 2 <= F && F <= 4 && 2 <= U && U <= 4 ? M[W + F][z + U] = !0 : M[W + F][z + U] = !1);
        }, ce = function() {
          for (var W = 0, z = 0, F = 0; F < 8; F += 1) {
            J(!0, F);
            var U = r.getLostPoint(_);
            (F == 0 || W > U) && (W = U, z = F);
          }
          return z;
        }, ie = function() {
          for (var W = 8; W < p - 8; W += 1)
            M[W][6] == null && (M[W][6] = W % 2 == 0);
          for (var z = 8; z < p - 8; z += 1)
            M[6][z] == null && (M[6][z] = z % 2 == 0);
        }, pe = function() {
          for (var W = r.getPatternPosition(S), z = 0; z < W.length; z += 1)
            for (var F = 0; F < W.length; F += 1) {
              var U = W[z], V = W[F];
              if (M[U][V] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    X == -2 || X == 2 || oe == -2 || oe == 2 || X == 0 && oe == 0 ? M[U + X][V + oe] = !0 : M[U + X][V + oe] = !1;
            }
        }, Ce = function(W) {
          for (var z = r.getBCHTypeNumber(S), F = 0; F < 18; F += 1) {
            var U = !W && (z >> F & 1) == 1;
            M[Math.floor(F / 3)][F % 3 + p - 8 - 3] = U;
          }
          for (var F = 0; F < 18; F += 1) {
            var U = !W && (z >> F & 1) == 1;
            M[F % 3 + p - 8 - 3][Math.floor(F / 3)] = U;
          }
        }, qe = function(W, z) {
          for (var F = B << 3 | z, U = r.getBCHTypeInfo(F), V = 0; V < 15; V += 1) {
            var X = !W && (U >> V & 1) == 1;
            V < 6 ? M[V][8] = X : V < 8 ? M[V + 1][8] = X : M[p - 15 + V][8] = X;
          }
          for (var V = 0; V < 15; V += 1) {
            var X = !W && (U >> V & 1) == 1;
            V < 8 ? M[8][p - V - 1] = X : V < 9 ? M[8][15 - V - 1 + 1] = X : M[8][15 - V - 1] = X;
          }
          M[p - 8][8] = !W;
        }, ve = function(W, z) {
          for (var F = -1, U = p - 1, V = 7, X = 0, oe = r.getMaskFunction(z), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (M[U][se - ke] == null) {
                  var Me = !1;
                  X < W.length && (Me = (W[X] >>> V & 1) == 1);
                  var re = oe(U, se - ke);
                  re && (Me = !Me), M[U][se - ke] = Me, V -= 1, V == -1 && (X += 1, V = 7);
                }
              if (U += F, U < 0 || p <= U) {
                U -= F, F = -F;
                break;
              }
            }
        }, fe = function(W, z) {
          for (var F = 0, U = 0, V = 0, X = new Array(z.length), oe = new Array(z.length), se = 0; se < z.length; se += 1) {
            var ke = z[se].dataCount, Me = z[se].totalCount - ke;
            U = Math.max(U, ke), V = Math.max(V, Me), X[se] = new Array(ke);
            for (var re = 0; re < X[se].length; re += 1)
              X[se][re] = 255 & W.getBuffer()[re + F];
            F += ke;
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
          for (var re = 0; re < V; re += 1)
            for (var se = 0; se < z.length; se += 1)
              re < oe[se].length && (la[pn] = oe[se][re], pn += 1);
          return la;
        }, ae = function(W, z, F) {
          for (var U = d.getRSBlocks(W, z), V = f(), X = 0; X < F.length; X += 1) {
            var oe = F[X];
            V.put(oe.getMode(), 4), V.put(oe.getLength(), r.getLengthInBits(oe.getMode(), W)), oe.write(V);
          }
          for (var se = 0, X = 0; X < U.length; X += 1)
            se += U[X].dataCount;
          if (V.getLengthInBits() > se * 8)
            throw "code length overflow. (" + V.getLengthInBits() + ">" + se * 8 + ")";
          for (V.getLengthInBits() + 4 <= se * 8 && V.put(0, 4); V.getLengthInBits() % 8 != 0; )
            V.putBit(!1);
          for (; !(V.getLengthInBits() >= se * 8 || (V.put(T, 8), V.getLengthInBits() >= se * 8)); )
            V.put(L, 8);
          return fe(V, U);
        };
        _.addData = function(W, z) {
          z = z || "Byte";
          var F = null;
          switch (z) {
            case "Numeric":
              F = m(W);
              break;
            case "Alphanumeric":
              F = g(W);
              break;
            case "Byte":
              F = y(W);
              break;
            case "Kanji":
              F = k(W);
              break;
            default:
              throw "mode:" + z;
          }
          C.push(F), O = null;
        }, _.isDark = function(W, z) {
          if (W < 0 || p <= W || z < 0 || p <= z)
            throw W + "," + z;
          return M[W][z];
        }, _.getModuleCount = function() {
          return p;
        }, _.make = function() {
          if (S < 1) {
            for (var W = 1; W < 40; W++) {
              for (var z = d.getRSBlocks(W, B), F = f(), U = 0; U < C.length; U++) {
                var V = C[U];
                F.put(V.getMode(), 4), F.put(V.getLength(), r.getLengthInBits(V.getMode(), W)), V.write(F);
              }
              for (var X = 0, U = 0; U < z.length; U++)
                X += z[U].dataCount;
              if (F.getLengthInBits() <= X * 8)
                break;
            }
            S = W;
          }
          J(!1, ce());
        }, _.createTableTag = function(W, z) {
          W = W || 2, z = typeof z > "u" ? W * 4 : z;
          var F = "";
          F += '<table style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: " + z + "px;", F += '">', F += "<tbody>";
          for (var U = 0; U < _.getModuleCount(); U += 1) {
            F += "<tr>";
            for (var V = 0; V < _.getModuleCount(); V += 1)
              F += '<td style="', F += " border-width: 0px; border-style: none;", F += " border-collapse: collapse;", F += " padding: 0px; margin: 0px;", F += " width: " + W + "px;", F += " height: " + W + "px;", F += " background-color: ", F += _.isDark(U, V) ? "#000000" : "#ffffff", F += ";", F += '"/>';
            F += "</tr>";
          }
          return F += "</tbody>", F += "</table>", F;
        }, _.createSvgTag = function(W, z, F, U) {
          var V = {};
          typeof arguments[0] == "object" && (V = arguments[0], W = V.cellSize, z = V.margin, F = V.alt, U = V.title), W = W || 2, z = typeof z > "u" ? W * 4 : z, F = typeof F == "string" ? { text: F } : F || {}, F.text = F.text || null, F.id = F.text ? F.id || "qrcode-description" : null, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-title" : null;
          var X = _.getModuleCount() * W + z * 2, oe, se, ke, Me, re = "", Ne;
          for (Ne = "l" + W + ",0 0," + W + " -" + W + ",0 0,-" + W + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += V.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', re += ' viewBox="0 0 ' + X + " " + X + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += U.text || F.text ? ' role="img" aria-labelledby="' + Ke([U.id, F.id].join(" ").trim()) + '"' : "", re += ">", re += U.text ? '<title id="' + Ke(U.id) + '">' + Ke(U.text) + "</title>" : "", re += F.text ? '<description id="' + Ke(F.id) + '">' + Ke(F.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', ke = 0; ke < _.getModuleCount(); ke += 1)
            for (Me = ke * W + z, oe = 0; oe < _.getModuleCount(); oe += 1)
              _.isDark(ke, oe) && (se = oe * W + z, re += "M" + se + "," + Me + Ne);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, _.createDataURL = function(W, z) {
          W = W || 2, z = typeof z > "u" ? W * 4 : z;
          var F = _.getModuleCount() * W + z * 2, U = z, V = F - z;
          return P(F, F, function(X, oe) {
            if (U <= X && X < V && U <= oe && oe < V) {
              var se = Math.floor((X - U) / W), ke = Math.floor((oe - U) / W);
              return _.isDark(ke, se) ? 0 : 1;
            } else
              return 1;
          });
        }, _.createImgTag = function(W, z, F) {
          W = W || 2, z = typeof z > "u" ? W * 4 : z;
          var U = _.getModuleCount() * W + z * 2, V = "";
          return V += "<img", V += ' src="', V += _.createDataURL(W, z), V += '"', V += ' width="', V += U, V += '"', V += ' height="', V += U, V += '"', F && (V += ' alt="', V += Ke(F), V += '"'), V += "/>", V;
        };
        var Ke = function(W) {
          for (var z = "", F = 0; F < W.length; F += 1) {
            var U = W.charAt(F);
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
          var F = _.getModuleCount() * z + W * 2, U = W, V = F - W, X, oe, se, ke, Me, re = {
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
          for (X = 0; X < F; X += 2) {
            for (se = Math.floor((X - U) / z), ke = Math.floor((X + 1 - U) / z), oe = 0; oe < F; oe += 1)
              Me = "█", U <= oe && oe < V && U <= X && X < V && _.isDark(se, Math.floor((oe - U) / z)) && (Me = " "), U <= oe && oe < V && U <= X + 1 && X + 1 < V && _.isDark(ke, Math.floor((oe - U) / z)) ? Me += " " : Me += "█", De += W < 1 && X + 1 >= V ? Ne[Me] : re[Me];
            De += `
`;
          }
          return F % 2 && W > 0 ? De.substring(0, De.length - F - 1) + Array(F + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return _.createASCII = function(W, z) {
          if (W = W || 1, W < 2)
            return Jr(z);
          W -= 1, z = typeof z > "u" ? W * 2 : z;
          var F = _.getModuleCount() * W + z * 2, U = z, V = F - z, X, oe, se, ke, Me = Array(W + 1).join("██"), re = Array(W + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < F; X += 1) {
            for (se = Math.floor((X - U) / W), De = "", oe = 0; oe < F; oe += 1)
              ke = 1, U <= oe && oe < V && U <= X && X < V && _.isDark(se, Math.floor((oe - U) / W)) && (ke = 0), De += ke ? Me : re;
            for (se = 0; se < W; se += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, _.renderTo2dContext = function(W, z) {
          z = z || 2;
          for (var F = _.getModuleCount(), U = 0; U < F; U++)
            for (var V = 0; V < F; V++)
              W.fillStyle = _.isDark(U, V) ? "black" : "white", W.fillRect(U * z, V * z, z, z);
        }, _;
      };
      a.stringToBytesFuncs = {
        default: function(x) {
          for (var $ = [], T = 0; T < x.length; T += 1) {
            var L = x.charCodeAt(T);
            $.push(L & 255);
          }
          return $;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(x, $) {
        var T = (function() {
          for (var S = D(x), B = function() {
            var ie = S.read();
            if (ie == -1) throw "eof";
            return ie;
          }, M = 0, p = {}; ; ) {
            var O = S.read();
            if (O == -1) break;
            var C = B(), _ = B(), J = B(), te = String.fromCharCode(O << 8 | C), ce = _ << 8 | J;
            p[te] = ce, M += 1;
          }
          if (M != $)
            throw M + " != " + $;
          return p;
        })(), L = 63;
        return function(S) {
          for (var B = [], M = 0; M < S.length; M += 1) {
            var p = S.charCodeAt(M);
            if (p < 128)
              B.push(p);
            else {
              var O = T[S.charAt(M)];
              typeof O == "number" ? (O & 255) == O ? B.push(O) : (B.push(O >>> 8), B.push(O & 255)) : B.push(L);
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
        var x = [
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
        ], $ = 1335, T = 7973, L = 21522, S = {}, B = function(M) {
          for (var p = 0; M != 0; )
            p += 1, M >>>= 1;
          return p;
        };
        return S.getBCHTypeInfo = function(M) {
          for (var p = M << 10; B(p) - B($) >= 0; )
            p ^= $ << B(p) - B($);
          return (M << 10 | p) ^ L;
        }, S.getBCHTypeNumber = function(M) {
          for (var p = M << 12; B(p) - B(T) >= 0; )
            p ^= T << B(p) - B(T);
          return M << 12 | p;
        }, S.getPatternPosition = function(M) {
          return x[M - 1];
        }, S.getMaskFunction = function(M) {
          switch (M) {
            case l.PATTERN000:
              return function(p, O) {
                return (p + O) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, O) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, O) {
                return O % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, O) {
                return (p + O) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, O) {
                return (Math.floor(p / 2) + Math.floor(O / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, O) {
                return p * O % 2 + p * O % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, O) {
                return (p * O % 2 + p * O % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, O) {
                return (p * O % 3 + (p + O) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + M;
          }
        }, S.getErrorCorrectPolynomial = function(M) {
          for (var p = u([1], 0), O = 0; O < M; O += 1)
            p = p.multiply(u([1, i.gexp(O)], 0));
          return p;
        }, S.getLengthInBits = function(M, p) {
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
        }, S.getLostPoint = function(M) {
          for (var p = M.getModuleCount(), O = 0, C = 0; C < p; C += 1)
            for (var _ = 0; _ < p; _ += 1) {
              for (var J = 0, te = M.isDark(C, _), ce = -1; ce <= 1; ce += 1)
                if (!(C + ce < 0 || p <= C + ce))
                  for (var ie = -1; ie <= 1; ie += 1)
                    _ + ie < 0 || p <= _ + ie || ce == 0 && ie == 0 || te == M.isDark(C + ce, _ + ie) && (J += 1);
              J > 5 && (O += 3 + J - 5);
            }
          for (var C = 0; C < p - 1; C += 1)
            for (var _ = 0; _ < p - 1; _ += 1) {
              var pe = 0;
              M.isDark(C, _) && (pe += 1), M.isDark(C + 1, _) && (pe += 1), M.isDark(C, _ + 1) && (pe += 1), M.isDark(C + 1, _ + 1) && (pe += 1), (pe == 0 || pe == 4) && (O += 3);
            }
          for (var C = 0; C < p; C += 1)
            for (var _ = 0; _ < p - 6; _ += 1)
              M.isDark(C, _) && !M.isDark(C, _ + 1) && M.isDark(C, _ + 2) && M.isDark(C, _ + 3) && M.isDark(C, _ + 4) && !M.isDark(C, _ + 5) && M.isDark(C, _ + 6) && (O += 40);
          for (var _ = 0; _ < p; _ += 1)
            for (var C = 0; C < p - 6; C += 1)
              M.isDark(C, _) && !M.isDark(C + 1, _) && M.isDark(C + 2, _) && M.isDark(C + 3, _) && M.isDark(C + 4, _) && !M.isDark(C + 5, _) && M.isDark(C + 6, _) && (O += 40);
          for (var Ce = 0, _ = 0; _ < p; _ += 1)
            for (var C = 0; C < p; C += 1)
              M.isDark(C, _) && (Ce += 1);
          var qe = Math.abs(100 * Ce / p / p - 50) / 5;
          return O += qe * 10, O;
        }, S;
      })(), i = (function() {
        for (var x = new Array(256), $ = new Array(256), T = 0; T < 8; T += 1)
          x[T] = 1 << T;
        for (var T = 8; T < 256; T += 1)
          x[T] = x[T - 4] ^ x[T - 5] ^ x[T - 6] ^ x[T - 8];
        for (var T = 0; T < 255; T += 1)
          $[x[T]] = T;
        var L = {};
        return L.glog = function(S) {
          if (S < 1)
            throw "glog(" + S + ")";
          return $[S];
        }, L.gexp = function(S) {
          for (; S < 0; )
            S += 255;
          for (; S >= 256; )
            S -= 255;
          return x[S];
        }, L;
      })();
      function u(x, $) {
        if (typeof x.length > "u")
          throw x.length + "/" + $;
        var T = (function() {
          for (var S = 0; S < x.length && x[S] == 0; )
            S += 1;
          for (var B = new Array(x.length - S + $), M = 0; M < x.length - S; M += 1)
            B[M] = x[M + S];
          return B;
        })(), L = {};
        return L.getAt = function(S) {
          return T[S];
        }, L.getLength = function() {
          return T.length;
        }, L.multiply = function(S) {
          for (var B = new Array(L.getLength() + S.getLength() - 1), M = 0; M < L.getLength(); M += 1)
            for (var p = 0; p < S.getLength(); p += 1)
              B[M + p] ^= i.gexp(i.glog(L.getAt(M)) + i.glog(S.getAt(p)));
          return u(B, 0);
        }, L.mod = function(S) {
          if (L.getLength() - S.getLength() < 0)
            return L;
          for (var B = i.glog(L.getAt(0)) - i.glog(S.getAt(0)), M = new Array(L.getLength()), p = 0; p < L.getLength(); p += 1)
            M[p] = L.getAt(p);
          for (var p = 0; p < S.getLength(); p += 1)
            M[p] ^= i.gexp(i.glog(S.getAt(p)) + B);
          return u(M, 0).mod(S);
        }, L;
      }
      var d = (function() {
        var x = [
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
        ], $ = function(S, B) {
          var M = {};
          return M.totalCount = S, M.dataCount = B, M;
        }, T = {}, L = function(S, B) {
          switch (B) {
            case o.L:
              return x[(S - 1) * 4 + 0];
            case o.M:
              return x[(S - 1) * 4 + 1];
            case o.Q:
              return x[(S - 1) * 4 + 2];
            case o.H:
              return x[(S - 1) * 4 + 3];
            default:
              return;
          }
        };
        return T.getRSBlocks = function(S, B) {
          var M = L(S, B);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + S + "/errorCorrectionLevel:" + B;
          for (var p = M.length / 3, O = [], C = 0; C < p; C += 1)
            for (var _ = M[C * 3 + 0], J = M[C * 3 + 1], te = M[C * 3 + 2], ce = 0; ce < _; ce += 1)
              O.push($(J, te));
          return O;
        }, T;
      })(), f = function() {
        var x = [], $ = 0, T = {};
        return T.getBuffer = function() {
          return x;
        }, T.getAt = function(L) {
          var S = Math.floor(L / 8);
          return (x[S] >>> 7 - L % 8 & 1) == 1;
        }, T.put = function(L, S) {
          for (var B = 0; B < S; B += 1)
            T.putBit((L >>> S - B - 1 & 1) == 1);
        }, T.getLengthInBits = function() {
          return $;
        }, T.putBit = function(L) {
          var S = Math.floor($ / 8);
          x.length <= S && x.push(0), L && (x[S] |= 128 >>> $ % 8), $ += 1;
        }, T;
      }, m = function(x) {
        var $ = s.MODE_NUMBER, T = x, L = {};
        L.getMode = function() {
          return $;
        }, L.getLength = function(M) {
          return T.length;
        }, L.write = function(M) {
          for (var p = T, O = 0; O + 2 < p.length; )
            M.put(S(p.substring(O, O + 3)), 10), O += 3;
          O < p.length && (p.length - O == 1 ? M.put(S(p.substring(O, O + 1)), 4) : p.length - O == 2 && M.put(S(p.substring(O, O + 2)), 7));
        };
        var S = function(M) {
          for (var p = 0, O = 0; O < M.length; O += 1)
            p = p * 10 + B(M.charAt(O));
          return p;
        }, B = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return L;
      }, g = function(x) {
        var $ = s.MODE_ALPHA_NUM, T = x, L = {};
        L.getMode = function() {
          return $;
        }, L.getLength = function(B) {
          return T.length;
        }, L.write = function(B) {
          for (var M = T, p = 0; p + 1 < M.length; )
            B.put(
              S(M.charAt(p)) * 45 + S(M.charAt(p + 1)),
              11
            ), p += 2;
          p < M.length && B.put(S(M.charAt(p)), 6);
        };
        var S = function(B) {
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
        return L;
      }, y = function(x) {
        var $ = s.MODE_8BIT_BYTE, T = a.stringToBytes(x), L = {};
        return L.getMode = function() {
          return $;
        }, L.getLength = function(S) {
          return T.length;
        }, L.write = function(S) {
          for (var B = 0; B < T.length; B += 1)
            S.put(T[B], 8);
        }, L;
      }, k = function(x) {
        var $ = s.MODE_KANJI, T = a.stringToBytesFuncs.SJIS;
        if (!T)
          throw "sjis not supported.";
        (function(B, M) {
          var p = T(B);
          if (p.length != 2 || (p[0] << 8 | p[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var L = T(x), S = {};
        return S.getMode = function() {
          return $;
        }, S.getLength = function(B) {
          return ~~(L.length / 2);
        }, S.write = function(B) {
          for (var M = L, p = 0; p + 1 < M.length; ) {
            var O = (255 & M[p]) << 8 | 255 & M[p + 1];
            if (33088 <= O && O <= 40956)
              O -= 33088;
            else if (57408 <= O && O <= 60351)
              O -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + O;
            O = (O >>> 8 & 255) * 192 + (O & 255), B.put(O, 13), p += 2;
          }
          if (p < M.length)
            throw "illegal char at " + (p + 1);
        }, S;
      }, b = function() {
        var x = [], $ = {};
        return $.writeByte = function(T) {
          x.push(T & 255);
        }, $.writeShort = function(T) {
          $.writeByte(T), $.writeByte(T >>> 8);
        }, $.writeBytes = function(T, L, S) {
          L = L || 0, S = S || T.length;
          for (var B = 0; B < S; B += 1)
            $.writeByte(T[B + L]);
        }, $.writeString = function(T) {
          for (var L = 0; L < T.length; L += 1)
            $.writeByte(T.charCodeAt(L));
        }, $.toByteArray = function() {
          return x;
        }, $.toString = function() {
          var T = "";
          T += "[";
          for (var L = 0; L < x.length; L += 1)
            L > 0 && (T += ","), T += x[L];
          return T += "]", T;
        }, $;
      }, A = function() {
        var x = 0, $ = 0, T = 0, L = "", S = {}, B = function(p) {
          L += String.fromCharCode(M(p & 63));
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
        return S.writeByte = function(p) {
          for (x = x << 8 | p & 255, $ += 8, T += 1; $ >= 6; )
            B(x >>> $ - 6), $ -= 6;
        }, S.flush = function() {
          if ($ > 0 && (B(x << 6 - $), x = 0, $ = 0), T % 3 != 0)
            for (var p = 3 - T % 3, O = 0; O < p; O += 1)
              L += "=";
        }, S.toString = function() {
          return L;
        }, S;
      }, D = function(x) {
        var $ = x, T = 0, L = 0, S = 0, B = {};
        B.read = function() {
          for (; S < 8; ) {
            if (T >= $.length) {
              if (S == 0)
                return -1;
              throw "unexpected end of file./" + S;
            }
            var p = $.charAt(T);
            if (T += 1, p == "=")
              return S = 0, -1;
            if (p.match(/^\s$/))
              continue;
            L = L << 6 | M(p.charCodeAt(0)), S += 6;
          }
          var O = L >>> S - 8 & 255;
          return S -= 8, O;
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
      }, Y = function(x, $) {
        var T = x, L = $, S = new Array(x * $), B = {};
        B.setPixel = function(C, _, J) {
          S[_ * T + C] = J;
        }, B.write = function(C) {
          C.writeString("GIF87a"), C.writeShort(T), C.writeShort(L), C.writeByte(128), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(0), C.writeByte(255), C.writeByte(255), C.writeByte(255), C.writeString(","), C.writeShort(0), C.writeShort(0), C.writeShort(T), C.writeShort(L), C.writeByte(0);
          var _ = 2, J = p(_);
          C.writeByte(_);
          for (var te = 0; J.length - te > 255; )
            C.writeByte(255), C.writeBytes(J, te, 255), te += 255;
          C.writeByte(J.length - te), C.writeBytes(J, te, J.length - te), C.writeByte(0), C.writeString(";");
        };
        var M = function(C) {
          var _ = C, J = 0, te = 0, ce = {};
          return ce.write = function(ie, pe) {
            if (ie >>> pe)
              throw "length over";
            for (; J + pe >= 8; )
              _.writeByte(255 & (ie << J | te)), pe -= 8 - J, ie >>>= 8 - J, te = 0, J = 0;
            te = ie << J | te, J = J + pe;
          }, ce.flush = function() {
            J > 0 && _.writeByte(te);
          }, ce;
        }, p = function(C) {
          for (var _ = 1 << C, J = (1 << C) + 1, te = C + 1, ce = O(), ie = 0; ie < _; ie += 1)
            ce.add(String.fromCharCode(ie));
          ce.add(String.fromCharCode(_)), ce.add(String.fromCharCode(J));
          var pe = b(), Ce = M(pe);
          Ce.write(_, te);
          var qe = 0, ve = String.fromCharCode(S[qe]);
          for (qe += 1; qe < S.length; ) {
            var fe = String.fromCharCode(S[qe]);
            qe += 1, ce.contains(ve + fe) ? ve = ve + fe : (Ce.write(ce.indexOf(ve), te), ce.size() < 4095 && (ce.size() == 1 << te && (te += 1), ce.add(ve + fe)), ve = fe);
          }
          return Ce.write(ce.indexOf(ve), te), Ce.write(J, te), Ce.flush(), pe.toByteArray();
        }, O = function() {
          var C = {}, _ = 0, J = {};
          return J.add = function(te) {
            if (J.contains(te))
              throw "dup key:" + te;
            C[te] = _, _ += 1;
          }, J.size = function() {
            return _;
          }, J.indexOf = function(te) {
            return C[te];
          }, J.contains = function(te) {
            return typeof C[te] < "u";
          }, J;
        };
        return B;
      }, P = function(x, $, T) {
        for (var L = Y(x, $), S = 0; S < $; S += 1)
          for (var B = 0; B < x; B += 1)
            L.setPixel(B, S, T(B, S));
        var M = b();
        L.write(M);
        for (var p = A(), O = M.toByteArray(), C = 0; C < O.length; C += 1)
          p.writeByte(O[C]);
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
var e5 = Q2();
const t5 = /* @__PURE__ */ X2(e5), n5 = ["width", "height", "viewBox"], a5 = ["width", "height"], s5 = ["d"], o5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = t5(0, "M");
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
      }, null, 8, a5),
      v("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, s5)
    ], 8, n5));
  }
}, L8 = /* @__PURE__ */ K(o5, [["__scopeId", "data-v-489f0852"]]), l5 = {
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
}, N8 = /* @__PURE__ */ K(l5, [["__scopeId", "data-v-47e67f04"]]);
function D8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const P8 = ci(() => import("./VoiceFigure-Bm1_6mo-.js").then((e) => e.V)), j8 = "1.2.0", q8 = "3.5";
export {
  cd as $,
  Se as A,
  Oe as B,
  ta as C,
  et as D,
  Ux as E,
  ub as F,
  L4 as G,
  Fx as H,
  zy as I,
  vb as J,
  Ct as K,
  c5 as L,
  Cs as M,
  $b as N,
  gb as O,
  ea as P,
  rx as Q,
  m4 as R,
  In as S,
  fx as T,
  l4 as U,
  _e as V,
  Fn as W,
  o4 as X,
  s4 as Y,
  id as Z,
  K as _,
  J5 as a,
  Cx as a$,
  kb as a0,
  p4 as a1,
  g4 as a2,
  Te as a3,
  E4 as a4,
  _4 as a5,
  Mt as a6,
  v4 as a7,
  j4 as a8,
  j5 as a9,
  kx as aA,
  sx as aB,
  Iy as aC,
  H4 as aD,
  z4 as aE,
  Vx as aF,
  Tr as aG,
  dx as aH,
  dn as aI,
  U5 as aJ,
  W5 as aK,
  Lx as aL,
  fn as aM,
  jx as aN,
  B4 as aO,
  ox as aP,
  lx as aQ,
  ax as aR,
  an as aS,
  wt as aT,
  q5 as aU,
  $v as aV,
  tx as aW,
  f4 as aX,
  Cr as aY,
  Nt as aZ,
  qt as a_,
  Ox as aa,
  Dx as ab,
  K5 as ac,
  r4 as ad,
  i4 as ae,
  M4 as af,
  S4 as ag,
  A4 as ah,
  e4 as ai,
  Po as aj,
  y4 as ak,
  P4 as al,
  Jx as am,
  Z4 as an,
  Y4 as ao,
  K4 as ap,
  C4 as aq,
  x4 as ar,
  k4 as as,
  $4 as at,
  ux as au,
  D4 as av,
  q4 as aw,
  Qx as ax,
  Yt as ay,
  F4 as az,
  Bb as b,
  Xx as b$,
  lb as b0,
  Px as b1,
  px as b2,
  mx as b3,
  Gv as b4,
  gr as b5,
  _x as b6,
  N4 as b7,
  sa as b8,
  ot as b9,
  vx as bA,
  $x as bB,
  ct as bC,
  hx as bD,
  Mx as bE,
  W4 as bF,
  X4 as bG,
  U4 as bH,
  Re as bI,
  I4 as bJ,
  Sx as bK,
  r8 as bL,
  i8 as bM,
  D5 as bN,
  _v as bO,
  T4 as bP,
  yx as bQ,
  Z5 as bR,
  Yx as bS,
  gx as bT,
  bx as bU,
  wx as bV,
  O4 as bW,
  By as bX,
  R4 as bY,
  G4 as bZ,
  Kx as b_,
  xx as ba,
  Sa as bb,
  Hl as bc,
  t8 as bd,
  s8 as be,
  cx as bf,
  Bx as bg,
  P5 as bh,
  J4 as bi,
  n8 as bj,
  b4 as bk,
  w4 as bl,
  n4 as bm,
  h4 as bn,
  z5 as bo,
  Rx as bp,
  X5 as bq,
  Q5 as br,
  a4 as bs,
  ex as bt,
  yv as bu,
  qx as bv,
  pb as bw,
  t4 as bx,
  V5 as by,
  Q4 as bz,
  Vv as c,
  E5 as c$,
  H5 as c0,
  F5 as c1,
  V4 as c2,
  o8 as c3,
  Bs as c4,
  l8 as c5,
  Vr as c6,
  Ix as c7,
  u4 as c8,
  c4 as c9,
  $8 as cA,
  v5 as cB,
  j8 as cC,
  q8 as cD,
  S5 as cE,
  S8 as cF,
  Qa as cG,
  R5 as cH,
  n0 as cI,
  $t as cJ,
  rs as cK,
  Jn as cL,
  w5 as cM,
  _5 as cN,
  Ii as cO,
  bg as cP,
  R8 as cQ,
  x5 as cR,
  L8 as cS,
  Jb as cT,
  Ji as cU,
  w8 as cV,
  xd as cW,
  h5 as cX,
  B5 as cY,
  Rw as cZ,
  Zn as c_,
  xv as ca,
  G5 as cb,
  hb as cc,
  nx as cd,
  _s as ce,
  Ay as cf,
  ix as cg,
  Jt as ch,
  Lt as ci,
  y5 as cj,
  x8 as ck,
  de as cl,
  Vu as cm,
  Qu as cn,
  vs as co,
  em as cp,
  xl as cq,
  I8 as cr,
  N5 as cs,
  wp as ct,
  Qt as cu,
  c8 as cv,
  i5 as cw,
  kt as cx,
  xu as cy,
  ye as cz,
  He as d,
  _8 as d$,
  Et as d0,
  ht as d1,
  K1 as d2,
  sc as d3,
  O5 as d4,
  m5 as d5,
  Pt as d6,
  M8 as d7,
  B8 as d8,
  Yr as d9,
  u8 as dA,
  d5 as dB,
  E8 as dC,
  Jg as dD,
  ew as dE,
  p5 as dF,
  M5 as dG,
  m8 as dH,
  g8 as dI,
  We as dJ,
  b5 as dK,
  k5 as dL,
  h8 as dM,
  Op as dN,
  f5 as dO,
  u5 as dP,
  hl as dQ,
  ml as dR,
  Qc as dS,
  g5 as dT,
  it as dU,
  D8 as dV,
  tw as dW,
  C5 as dX,
  f8 as dY,
  k8 as dZ,
  Xb as d_,
  Mu as da,
  bt as db,
  A5 as dc,
  oa as dd,
  P8 as de,
  N8 as df,
  $s as dg,
  p8 as dh,
  hs as di,
  i1 as dj,
  mo as dk,
  Xl as dl,
  Zc as dm,
  O8 as dn,
  C8 as dp,
  ms as dq,
  Jc as dr,
  il as ds,
  $5 as dt,
  T8 as du,
  L5 as dv,
  I5 as dw,
  T5 as dx,
  d8 as dy,
  Uf as dz,
  d4 as e,
  ng as e0,
  tl as e1,
  Fw as e2,
  ug as e3,
  v8 as e4,
  Xa as e5,
  y8 as e6,
  b8 as e7,
  ft as e8,
  A8 as e9,
  Xc as ea,
  vv as f,
  e8 as g,
  sn as h,
  Wx as i,
  a8 as j,
  Hx as k,
  Tx as l,
  jb as m,
  Os as n,
  Nx as o,
  Y5 as p,
  zx as q,
  zr as r,
  Ur as s,
  Ae as t,
  Yv as u,
  Ex as v,
  Zx as w,
  Ax as x,
  mn as y,
  Gx as z
};
