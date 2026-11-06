/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as X, Fragment as K, renderList as te, normalizeStyle as fe, defineComponent as Fr, Comment as Wr, h as Wn, cloneVNode as Hr, createBlock as W, withCtx as D, unref as F, createVNode as N, toDisplayString as w, createCommentVNode as C, inject as $e, useAttrs as Hn, computed as R, ref as I, resolveDynamicComponent as bt, mergeProps as Ye, onUnmounted as Be, onMounted as Oe, Teleport as ns, useId as as, resolveDirective as Ur, withDirectives as Ze, createTextVNode as ne, reactive as ss, shallowRef as ze, watch as he, nextTick as it, Transition as Lt, withModifiers as we, TransitionGroup as Po, shallowReactive as zr, isRef as Cs, onBeforeUnmount as kt, resolveComponent as Vr, useModel as Ta, getCurrentInstance as Gr, mergeModels as Ba, getCurrentScope as jo, onScopeDispose as qo, provide as Kr, onErrorCaptured as Yr, toHandlers as Zr, createSlots as Jr, vShow as Fo, useSlots as Xr, withKeys as Kt, vModelText as Ra, defineAsyncComponent as Qr } from "vue";
const Z = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ei = { class: "skeleton-line" }, ti = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", ei, [
      ce(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(K, null, te(e.bars, (a) => (c(), h("span", {
          key: a.width,
          class: X(["bar", { still: e.still }]),
          style: fe({ width: a.width, height: `${a.height}px`, borderRadius: `${a.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ut = /* @__PURE__ */ Z(ti, [["__scopeId", "data-v-0ebb6933"]]), Nt = Fr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Wr);
      return a.length !== 1 ? Wn(K, { key: n }, a) : a[0].key == null ? Hr(a[0], { key: n }) : a[0];
    };
  }
}), ni = ["aria-label"], ai = ["aria-label"], si = ["aria-label"], oi = ["aria-label"], li = ["aria-label"], ri = ["aria-label"], ii = ["aria-label"], ci = {
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
    return (i, u) => (c(), W(Nt, { value: e.shape }, {
      messages: D(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(K, null, te(t, (d) => g("div", {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, ni)
      ]),
      older: D(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, ai)
      ]),
      cards: D(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(K, null, te(n, (f) => N(ut, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, si)
      ]),
      file: D(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(ut, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(K, null, te(s, (f) => N(ut, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, oi)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(ut, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(K, null, te(e.count, (d) => (c(), W(ut, {
            key: d,
            bars: F(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, li)
      ]),
      text: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), W(ut, {
            key: d,
            bars: F(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, ri)
      ]),
      default: D(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), W(ut, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ii)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, xt = /* @__PURE__ */ Z(ci, [["__scopeId", "data-v-384b7120"]]), ui = {
  key: 1,
  class: "empty-state titled"
}, di = { class: "empty-state-title" }, fi = { class: "empty-state-text" }, hi = {
  key: 2,
  class: "empty-state"
}, mi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), W(xt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", ui, [
      g("p", di, w(e.title), 1),
      g("p", fi, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", hi, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Yt = /* @__PURE__ */ Z(mi, [["__scopeId", "data-v-b27e89b0"]]), pi = { class: "fold-group" }, gi = ["aria-expanded"], vi = { class: "fold-label" }, yi = {
  key: 0,
  class: "fold-count"
}, wi = {
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
    return (a, s) => (c(), h("div", pi, [
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", vi, w(e.label), 1),
        e.count !== "" ? (c(), h("span", yi, w(e.count), 1)) : C("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, gi),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, O2 = /* @__PURE__ */ Z(wi, [["__scopeId", "data-v-9ef1865c"]]), bi = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function ct() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const ki = ["stroke-width", "innerHTML"], me = {
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
      style: fe({
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
    }, null, 12, ki));
  }
}, xi = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, $i = /* @__PURE__ */ Z(xi, [["__scopeId", "data-v-eb453d6f"]]), Mi = 120, Si = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Hn(), a = R(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = I(!1), o = R(() => t.busy || s.value), l = $e(Se, null), r = R(() => o.value || t.disabled || !!(l != null && l.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, Mi);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), W(bt(e.href ? "a" : "button"), Ye(a.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: D(() => [
        g("span", {
          class: X(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), W(me, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          ce(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), W($i, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ Z(Si, [["__scopeId", "data-v-13c30dc0"]]), _i = (e, t, n) => Math.max(t, Math.min(n, e)), Ei = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Wo = /* @__PURE__ */ new WeakMap(), Ai = (e, t) => Wo.set(e, t);
function Ci(e, t) {
  for (let n = t; n; n = Wo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Ho(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Ci(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Be(() => window.removeEventListener("click", n));
}
const Et = 8, Oi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = I(null), o = (p) => p ? `${p}px` : void 0, l = R(() => ({
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
      const _ = p.closest(".pane, .float-window");
      return _ ? d(_.getBoundingClientRect()) : u();
    }, m = (p, _) => `${Math.max(0, p ? Math.min(p, _) : _)}px`;
    function v(p, _) {
      return {
        below: p.bottom - _.bottom - a.gap - Et,
        above: _.top - p.top - a.gap - Et,
        across: p.right - p.left - 2 * Et
      };
    }
    function y(p) {
      const _ = f(a.anchor), E = v(_, p);
      return r.value.w <= E.across && r.value.h <= Math.max(E.below, E.above) ? _ : u();
    }
    const O = R(() => {
      if (!i.value) return l.value;
      const p = i.value, _ = y(p), E = v(_, p), { w: $, h: V } = r.value, J = a.align === "auto" ? p.left + p.right > _.left + _.right : a.align === "right", Y = _i(J ? p.right - $ : p.left, _.left + Et, Math.max(_.left + Et, _.right - $ - Et)), ve = V > E.below && E.above > E.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, E.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, E.below) };
      return { ...l.value, ...ve, left: `${Y}px`, maxWidth: m(a.maxWidth, E.across) };
    }), k = n, L = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function z(p) {
      const _ = L(), E = _.indexOf(document.activeElement);
      _[(E + p + _.length) % _.length].focus();
    }
    const ee = { ArrowDown: () => z(1), ArrowUp: () => z(-1), Escape: () => k("close") }, j = (p) => ee[p.key] && (p.preventDefault(), ee[p.key]()), M = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let S = 0;
    const B = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(M);
    });
    Ho(s, (p) => a.anchor && !a.anchor.contains(p.target) && k("close"));
    const A = (p, _) => ["top", "left", "right", "bottom"].some((E) => Math.abs(p[E] - _[E]) > 1), x = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let T = 0;
    function b() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(p)) return k("close");
        A(p, i.value) && (i.value = p);
      }
      T = requestAnimationFrame(b);
    }
    return Oe(() => {
      a.anchor && s.value && Ai(s.value, a.anchor), M(), s.value && B.observe(s.value), !a.plain && L()[0] && L()[0].focus(), b();
    }), Be(() => {
      B.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(S);
    }), t({ element: s }), (p, _) => (c(), W(ns, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ye({
        ref_key: "panel",
        ref: s
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: j
      }), [
        ce(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Un = /* @__PURE__ */ Z(Oi, [["__scopeId", "data-v-3d203970"]]), Ti = { class: "split-button" }, Bi = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", Ti, [
      N(ue, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: r[0] || (r[0] = (i) => n("main"))
      }, {
        default: D(() => [
          ce(l.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["variant", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        N(ue, {
          variant: e.variant,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: r[1] || (r[1] = (i) => s.value = !s.value)
        }, {
          default: D(() => [
            N(me, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), W(Un, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: D(() => [
          ce(l.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : C("", !0)
    ]));
  }
}, Ri = /* @__PURE__ */ Z(Bi, [["__scopeId", "data-v-c258494d"]]), Ii = ["aria-checked", "aria-haspopup", "onClick"], Li = {
  key: 0,
  class: "segmented-dot"
}, Ni = {
  key: 1,
  class: "segmented-note"
}, Di = {
  key: 2,
  class: "segmented-count"
}, Pi = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = as();
    return (s, o) => {
      const l = Ur("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(K, null, te(e.options, (r) => Ze((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: X(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Li)) : C("", !0),
          ne(" " + w(r.label) + " ", 1),
          r.note ? (c(), h("small", Ni, w(r.note), 1)) : C("", !0),
          r.count !== void 0 ? (c(), h("em", Di, w(r.count), 1)) : C("", !0)
        ], 10, Ii)), [
          [l, r.tip || r.title, `${F(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, zn = /* @__PURE__ */ Z(Pi, [["__scopeId", "data-v-c89bc92d"]]), Uo = typeof document < "u" && document.documentElement.classList.contains("phone");
function ji() {
  return () => {
  };
}
function Ia(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function zo(e = window) {
  if (!Ia(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ia(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const La = "journal.stale-build-reload", qi = 'script[type="module"][src*="/assets/index-"]', Os = (e) => {
  var t;
  return ((t = e.querySelector(qi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Fi(e = document, t = (a, s) => Ce.quietRead(a, s), n = () => zo(window)) {
  const a = Os(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Os(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ta = "";
function Wi(e, t = () => zo(window)) {
  if (!e) return !1;
  const n = !!ta && ta !== e;
  return ta = e, n && t(), n;
}
const Hi = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ui(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(La) === e.message) return !1;
    t.setItem(La, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function zi(e = window.sessionStorage) {
  try {
    e.removeItem(La);
  } catch {
    return;
  }
}
const Vi = 2e3, Gi = 3e4, De = ss({ starting: !1, external: !1, late: !1, offline: !1 }), Vo = () => De.starting, Ki = 3;
let fn = 0, Na = 0, Go = 0, Ko = [];
async function Yi() {
  try {
    const e = await Ce.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: De.external };
  }
}
let Ts = null;
const Zi = () => Ts ?? (Ts = Yi().finally(() => Ts = null));
function Ji() {
  clearTimeout(Na), clearTimeout(Go), Na = 0, Object.assign(De, { starting: !1, external: !1, late: !1, offline: !1 }), Ko.splice(0).forEach((e) => e()), Fi();
}
async function Xi() {
  De.offline = !navigator.onLine;
  const e = await Zi();
  if (De.external = e.updating, fn = !e.restarting && !e.updating && e.reachable ? fn + 1 : 0, fn < Ki) return;
  fn = 0, (!Wi(e.started_at) || Ia()) && Ji();
}
function Yo() {
  Na = setTimeout(async () => {
    await Xi(), De.starting && Yo();
  }, Vi);
}
function Qi() {
  De.starting || (De.starting = !0, De.offline = !navigator.onLine, Yo(), Go = setTimeout(() => De.late = !0, Gi));
}
const ec = () => De.starting ? new Promise((e) => Ko.push(e)) : Promise.resolve();
function Zo(e, t) {
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
function tc() {
  const e = { askers: 0, stop: new AbortController() };
  return e.answer = new Promise((t) => e.resolve = t), e;
}
class nc {
  constructor(t, n) {
    this.read = t, this.ended = n, this.flying = null, this.following = null, this.outdated = !1, this.ask = Zo(() => this.leave(), 0);
  }
  leave() {
    const t = this.following;
    this.following = null, this.flying = t, this.outdated = !1;
    const n = this.read(t.stop.signal);
    t.resolve(n);
    const a = () => {
      this.flying === t && (this.flying = null), this.following || this.ended();
    };
    return n.then(a, a), n;
  }
  asked(t) {
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = tc());
    a.askers += 1;
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
const Xe = "viewer.shell", hn = 2e4, ac = 4, Bs = "/api/read-lines", sc = 5e3, oc = 403, Rs = "/api/repeated-lines", lc = 10, rc = 2e3, ic = 3e5, T2 = 6e5, mn = 6, cc = 500, uc = "/journal/summary", Is = "/api/server-state", dc = 2e4, pn = Uo ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, fc = (e) => e.split("?")[0].endsWith(uc), Da = (e, t) => Object.assign(new Error(t), { status: e });
async function hc(e, t, n = Da) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const mc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), pc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), gc = (e) => e.split(" ").slice(0, 2).join(" "), tt = "read", Ct = "write", vc = "stream";
class yc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = mn;
  }
  // what is in flight, of one window or of all: each with its window, line, kind (read, write or stream), address and started_at
  inFlight(t = null) {
    return [...this.flights].filter((n) => t === null || n.window === t).map((n) => ({ ...n }));
  }
  // how many requests a window has sent, by noun and verb
  sentCounts(t) {
    return Object.fromEntries(this.lineCounts.get(t) ?? []);
  }
  took(t, n) {
    const a = Date.now(), s = t.map((o) => ({ ...o, url: n, started_at: a }));
    return s.forEach((o) => {
      this.flights.add(o), this.counted(o);
    }), () => s.forEach((o) => this.flights.delete(o));
  }
  counted({ window: t, line: n }) {
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = gc(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < rc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < lc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Rs, { method: "POST", headers: { ...pn, "Content-Type": "application/json" }, body: r }, [{ window: Xe, line: Rs, kind: Ct }]).catch(() => {
    });
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: pc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Ct ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = hn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Qi(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= ac ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
    try {
      return await t();
    } finally {
      const n = this.readsWaiting.shift();
      n ? n() : this.readsFlying -= 1;
    }
  }
  // whether a line only reads, as the server knows its command: a line the server has not called a read is a write, which is never joined
  async isRead(t) {
    return this.readLines ?? (this.readLines = this.answeredReadLines()), (await this.readLines).has(t.slice(0, 2).join(" "));
  }
  answeredReadLines() {
    return this.out(Bs, { headers: pn }, [{ window: Xe, line: Bs, kind: tt }], sc).then(async (t) => {
      if (t.status === oc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Da(t.status, "The read lines did not answer");
      return new Set((await t.json()).reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0) {
    const s = this.joinedReads.get(t) ?? new nc(n, () => this.joinedReads.delete(t));
    return this.joinedReads.set(t, s), s.asked(a);
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
      this.tries = mn;
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
    const r = a instanceof FormData, i = { method: t, headers: { ...pn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: mc(a) }, u = s || (r ? ic : hn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: Xe, line: n, kind: tt }], u)) : await this.sent(n, i, [{ window: Xe, line: n, kind: Ct }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, cc)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = mn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = t === "GET" ? () => {
    } : ji(), i = await this.reach(t, n, a, s, o, l).finally(() => {
      r(), this.watcher("answered", t, n, a);
    });
    return hc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.whenFree(() => this.out(t, n, [{ window: Xe, line: t, kind: tt }], hn));
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: pn });
    if (!n.ok) throw Da(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return t !== "GET" ? this.send(t, n, a, s, mn, o).then((r) => (this.written(n), r)) : Vo() && !fc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: Xe, line: t, kind: vc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Is, { cache: "no-store" }, [{ window: Xe, line: Is, kind: tt }], dc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = Xe, line: s = t, limit: o = hn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? tt : Ct;
    return l === Ct ? this.sent(t, n, [{ window: a, line: s, kind: l }], 0) : this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o));
  }
}
const na = Symbol.for("journal.transport"), Ce = globalThis[na] ?? (globalThis[na] = new yc()), wc = 0, bc = "/api/lines", kc = "/api/line", Ls = 5e3, Ns = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ds = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), aa = (e) => JSON.stringify(e.line), Ps = () => new DOMException("cancelled", "AbortError");
class xc {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(aa(t))) {
        Ce.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Ct));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ce.whenFree(() => this.send()), wc));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(Ps())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(Ps()), n.abort();
    });
    t.forEach((o, l) => {
      var r;
      return (r = o.signal) == null ? void 0 : r.addEventListener("abort", s[l], { once: !0 });
    });
    try {
      const o = await Ce.sent(bc, Ns({ lines: t.map((r) => r.body) }, n.signal), t.map((r) => Ds(r.body, tt)), Ls), { answers: l } = await o.json();
      t.forEach((r, i) => r.resolve(l[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((l) => Ce.whenFree(() => this.readAlone(l))) : t.forEach((l) => l.reject(o));
    } finally {
      t.forEach((o, l) => {
        var r;
        return (r = o.signal) == null ? void 0 : r.removeEventListener("abort", s[l]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, tt), Date.now() - n < Ls ? this.slow.delete(aa(t.body)) : this.slow.add(aa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ce.sent(kc, Ns(t.body, t.signal), [Ds(t.body, n)], n === tt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Jo = new xc(), $c = 150, Mc = () => $c;
function os(e, t, n = Mc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Sc {
  constructor() {
    this.following = ze([]), this.held = /* @__PURE__ */ new Set();
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
    Ce.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Xo(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Xo(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Qo = /* @__PURE__ */ new Map();
class _c {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = ze({ buttons: [], missing: {} }), this.loading = ze(!1), this.loaded = ze(!1), this.failed = ze(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Ce.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function B2(e, t) {
  const n = new _c(e, t);
  return Qo.set(e, n), n.load().catch(() => {
  }), n;
}
const ls = (e) => Qo.get(e);
function Ec(e, t, n) {
  const a = ls(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ac(e, t) {
  if (!e) return !0;
  const n = ls(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Cc = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let el = {};
async function R2(e = (t) => Ce.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (el = (await t.json()).states);
}
const rs = (e, t) => {
  var n;
  return (n = el[e]) == null ? void 0 : n[t];
}, tl = (e, t) => {
  var n;
  return ((n = rs(e, t)) == null ? void 0 : n.label) ?? Cc(t);
}, nl = (e, t) => {
  var n;
  return ((n = rs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Oc = (e, t) => {
  var n;
  return ((n = rs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Tc = Symbol("pane-page"), Bc = Symbol("inspector-host"), Rc = { 1: "refused", 2: "usage", 3: "fault" }, Ic = 100, Lc = 50, Nc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Dc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Pc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: O = {}, search: k = {}, readOnly: L = !1, shared: z = null }) {
  const ee = /* @__PURE__ */ new Map(), j = new AbortController(), M = I(!1), S = performance.now();
  let B = 0, A = 0, x = () => {
  };
  const T = new Promise(($) => x = $);
  j.signal.addEventListener("abort", x, { once: !0 });
  const b = () => {
    clearTimeout(A), A = setTimeout(() => {
      B === 0 && os(S, () => {
        M.value = !0, x();
      });
    }, Lc);
  }, p = ($, V) => (B += 1, at(e, $, t, j.signal, V).finally(() => {
    B -= 1, b();
  })), _ = ($, V) => (b(), T.then(() => j.signal.aborted ? vt : at(e, $, t, j.signal, V))), E = ($, { unbatched: V = !1, deferred: J = !1 } = {}) => {
    const Y = ee.get($);
    if (Y && performance.now() - Y.at < Ic) return Y.answer;
    const ie = J && !M.value ? _($, V) : p($, V);
    return ee.set($, { answer: ie, at: performance.now() }), ie;
  };
  return {
    answered: M,
    settle: b,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: y,
    links: O,
    search: k,
    readOnly: L,
    shared: z,
    read: E,
    run: ($) => at(e, $, t, j.signal),
    upload: ($) => qc($, e, j.signal),
    cancel: () => j.abort(),
    signal: j.signal,
    subscriptions: l,
    follow: ($, V) => l.follow(e, $.filter((J) => o.some((Y) => Xo(Y, J))), (J) => {
      ee.clear(), V(J);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: ($) => R(() => {
      var V;
      return i.value[$] ?? ((V = u.find((J) => J.key === $)) == null ? void 0 : V.default);
    }),
    setting: async ($, V) => {
      const J = await E(`window setting ${e} ${$}`);
      return J.ok ? J.value.value : V;
    },
    setOption: f,
    keep: ($, V) => at(e, ["window", "save-setting", e, $, JSON.stringify(V)], t, j.signal)
  };
}
function jc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const vt = { ok: !1, failure: "cancelled", error: "" }, al = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function sl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? vt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Rc[n.code] || "fault", error: jc(n.error) };
  } catch {
    return t != null && t.aborted ? vt : { ok: !1, failure: "unreachable", error: al };
  }
}
async function ol(e, t, n) {
  const a = await sl(() => Jo.read(e, t, n), t);
  return a.failure !== "unreachable" || !Vo() ? a : (await ec(), t.aborted ? vt : ol(e, t, n));
}
async function at(e, t, n, a = void 0, s = !1) {
  const o = { window: e, line: Array.isArray(t) ? t : ll(t), environment: n };
  return await Ce.isRead(o.line) ? Ce.joined(JSON.stringify(o), (l) => ol(o, l, s), a).catch(() => vt) : sl(() => Jo.write(o), a);
}
async function qc(e, t, n = void 0) {
  try {
    const a = await Ce.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? vt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? vt : { ok: !1, failure: "unreachable", error: al };
  }
}
function ll(e) {
  return [...e.matchAll(Nc)].map(([t]) => t.replace(Dc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Fc = (e) => `show-${e}`, I2 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Fc((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), rl = "messages.chat", Wc = {
  key: 0,
  class: "template-brief"
}, Hc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Uc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = R(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = R(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await at(rl, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(K, null, [
      N(zn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", Wc, w(r.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", Hc, w(o.value), 1)) : C("", !0)
    ], 64));
  }
}, zc = /* @__PURE__ */ Z(Uc, [["__scopeId", "data-v-14be8a5c"]]), Vc = { class: "form-field" }, Gc = { class: "form-field-head" }, Kc = ["for"], Yc = {
  key: 0,
  class: "form-field-aside"
}, Zc = {
  key: 0,
  class: "form-field-help"
}, Jc = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Vc, [
      g("div", Gc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, Kc),
        t.$slots.aside ? (c(), h("span", Yc, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Zc, w(e.help), 1)) : C("", !0)
    ]));
  }
}, Xc = /* @__PURE__ */ Z(Jc, [["__scopeId", "data-v-dd7cdcff"]]), Pa = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Qc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Hn(), n = R(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ze((c(), h("textarea", Ye({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [F(Pa), F(t).value]
    ]);
  }
}), eu = /* @__PURE__ */ Z(Qc, [["__scopeId", "data-v-e130a5b9"]]), tu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = as(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), W(Xc, {
      label: e.field.label,
      for: F(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        N(Nt, { value: o.value }, {
          choice: D(() => [
            N(zn, {
              id: F(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: r[0] || (r[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            N(zc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            N(eu, {
              id: F(s),
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
}, is = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), W(ue, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        N(me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function nu(e, t, n, a = () => window) {
  Oe(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Be(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const au = (e, t = () => !0) => nu("keydown", (n) => n.key === "Escape" && t() && e());
function il(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = R(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return au(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const su = 80, At = ss([]);
function cl(e) {
  const t = Symbol("layer"), n = () => At.includes(t) && At.splice(At.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !At.includes(t) && At.push(t), a || n();
    },
    { immediate: !0 }
  ), Be(n), R(() => su + Math.max(0, At.indexOf(t)));
}
let ul = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return ul = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const ou = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function lu(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(ou)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Oe(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : ul, document.addEventListener("keydown", s), it(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Be(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const ru = ["aria-modal", "aria-label", "aria-labelledby"], iu = {
  key: 0,
  class: "dialog-head"
}, cu = ["id", "tabindex"], uu = {
  key: 1,
  class: "dialog-foot"
}, du = 500, fu = 400, hu = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = il(a, n), r = cl(s), i = I(null), u = I(null), d = I(null), f = as(), m = I(!1), v = Date.now();
    n.modal && lu(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, fu);
    }
    function O(z) {
      !n.modal || Date.now() - v >= du || ![" ", "Enter"].includes(z.key) || (z.preventDefault(), z.stopPropagation());
    }
    const k = () => i.value && (i.value.scrollTop = i.value.scrollHeight), L = new MutationObserver(k);
    return he(i, (z) => {
      L.disconnect(), z && n.follow && (L.observe(z, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Be(() => L.disconnect()), (z, ee) => (c(), W(ns, { to: "body" }, [
      N(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: F(l)
      }, {
        default: D(() => [
          F(s) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: F(r) }),
            onClick: we(y, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? F(f) : void 0,
              onKeydownCapture: O
            }, [
              e.bare ? C("", !0) : (c(), h("header", iu, [
                g("h3", {
                  id: F(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, cu),
                e.closable ? (c(), W(is, {
                  key: 0,
                  onClick: F(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                ce(z.$slots, "default", {}, void 0, !0)
              ], 2),
              z.$slots.foot ? (c(), h("footer", uu, [
                ce(z.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, ru)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, dl = /* @__PURE__ */ Z(hu, [["__scopeId", "data-v-6d1ecd98"]]), mu = (e, t, n = {}) => ll(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function an(e, t, n, a = {}) {
  try {
    return await Ac(e.module, n) ? at(rl, mu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const pu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, sa = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], pe = (e, t, n, a = {}) => ({
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
}), Vn = {
  messages: pe("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: pe("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: pe("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: sa
  }),
  tasks: pe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: sa
  }),
  reports: pe("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: pe("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: pe("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: pe("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: pe("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: pe("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: pe("Pin", "band", "One line pinned to the chat while it matters", { filters: sa }),
  reactions: pe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: pe("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: pe("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: pe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: pe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: pe("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: pe("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: pe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: pe("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  helpers: pe("Helper", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: pe("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: pe("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: pe("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: pe("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: pe("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: pe("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: pe("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, gu = ["secrets", "plugins"], fl = Object.keys(Vn).filter((e) => !(Uo && gu.includes(e)));
R(() => fl.map((e) => ({ name: e, ...Vn[e] })));
const Dt = (e) => Vn[e], hl = new Map(fl.flatMap((e) => [e, e.replace(/s$/, ""), Vn[e].title.toLowerCase()].map((t) => [t, e]))), Ge = (e) => hl.get(String(e).toLowerCase()) || "", ml = [...hl.keys()].sort((e, t) => t.length - e.length).join("|"), vu = {
  class: "button-form",
  "data-button-form": ""
}, yu = {
  key: 0,
  class: "button-form-title"
}, wu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, bu = { class: "button-form-actions" }, ku = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = I(!1), l = I(""), r = R(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = R(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Dt(Ge(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !r.value) return;
      o.value = !0;
      const d = await an(n.button, n.row, n.environment, s.value);
      o.value = !1, l.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), W(dl, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: D(() => {
        var m;
        return [
          g("div", vu, [
            (m = e.row) != null && m.title ? (c(), h("p", yu, w(e.row.title), 1)) : C("", !0),
            (c(!0), h(K, null, te(e.button.fields, (v) => (c(), W(tu, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (y) => s.value[v.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", wu, w(l.value), 1)) : C("", !0),
            g("div", bu, [
              N(ue, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: D(() => [...f[2] || (f[2] = [
                  ne("Cancel", -1)
                ])]),
                _: 1
              }),
              N(ue, {
                variant: "primary",
                small: "",
                disabled: !r.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: D(() => [...f[3] || (f[3] = [
                  ne("Send", -1)
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
}, xu = /* @__PURE__ */ Z(ku, [["__scopeId", "data-v-f26c27a7"]]), $u = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Mu = {
  key: 1,
  class: "menu-item-text"
}, Su = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", $u, w(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", Mu, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, w(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, yt = /* @__PURE__ */ Z(Su, [["__scopeId", "data-v-fec99974"]]), _u = ["aria-busy"], Eu = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Au = {
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
    const n = e, a = t, s = R(() => ls(n.environment)), o = R(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), l = R(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), r = () => s.value.load().catch(() => {
    }), i = R(() => n.readOnly ? [] : Ec(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function v(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const O = await an(y, n.row, n.environment);
      f.value = !1, d.value = O.ok ? "" : O.error;
      const k = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", O.ok ? "" : `Could not ${k}: ${O.error}`), O.ok && a("done");
    }
    return (y, O) => (c(), h("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(K, { key: 0 }, [
        O[3] || (O[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(ue, {
          small: "",
          onClick: r
        }, {
          default: D(() => [...O[2] || (O[2] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? C("", !0) : (c(), h(K, { key: 1 }, [
        (c(!0), h(K, null, te(i.value, (k) => (c(), h(K, {
          key: k.name
        }, [
          k.menu.length ? (c(), W(Ri, {
            key: 0,
            small: "",
            variant: k.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": k.menu_label || "More ways",
            title: m(k),
            "data-button": k.name,
            onMain: (L) => v(k)
          }, {
            menu: D(({ close: L }) => [
              (c(!0), h(K, null, te(k.menu, (z) => (c(), W(yt, {
                key: z.label,
                description: z.description,
                onClick: (ee) => (L(), v({ ...k, ...z, menu: [] }))
              }, {
                default: D(() => [
                  ne(w(z.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              ne(w(k.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), W(ue, {
            key: 1,
            small: "",
            variant: k.primary ? "primary" : "ghost",
            bordered: !k.primary,
            icon: k.icon,
            disabled: f.value,
            title: m(k),
            "data-button": k.name,
            onClick: (L) => v(k)
          }, {
            default: D(() => [
              ne(w(k.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Eu, w(d.value), 1)) : C("", !0),
        u.value && !e.readOnly ? (c(), W(xu, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: O[0] || (O[0] = (k) => u.value = null),
          onDone: O[1] || (O[1] = (k) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, _u));
  }
}, Cu = /* @__PURE__ */ Z(Au, [["__scopeId", "data-v-a07b49a4"]]), Ou = {
  class: "running",
  "data-running-command": ""
}, Tu = ["title"], Bu = {
  key: "idle",
  class: "running-idle"
}, Ru = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Ou, [
      N(Lt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, Tu)) : (c(), h("span", Bu, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, L2 = /* @__PURE__ */ Z(Ru, [["__scopeId", "data-v-d3240219"]]), Iu = ["aria-checked", "aria-label", "title"], Lu = {
  key: 0,
  class: "switch-inner"
}, Nu = {
  key: 0,
  class: "switch-word"
}, Du = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("button", {
      type: "button",
      class: X(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: X(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Lu, w(e.word), 1)) : C("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Nu, w(e.word), 1)) : C("", !0)
    ], 10, Iu));
  }
}, N2 = /* @__PURE__ */ Z(Du, [["__scopeId", "data-v-1bfb90f3"]]);
function pl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function On(e, t) {
  return pl(() => localStorage, e, t);
}
function gl(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function cs(e, t) {
  return gl(() => localStorage, e, t);
}
function vl(e, t) {
  he(t, (n) => cs(e, n), { deep: !0 });
}
function Pu(e, t) {
  return pl(() => sessionStorage, e, t);
}
function ju(e, t) {
  return gl(() => sessionStorage, e, t);
}
const Tn = "journal.environment", yl = I(Pu(Tn, On(Tn, "")));
function qu(e) {
  yl.value = e, ju(Tn, e), cs(Tn, e);
}
const Bn = I(location.hash), js = ze(null), qs = { integrations: "mcp", library: "team" };
function Fu() {
  if (!js.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (qs[n]) {
    location.replace(`#/${[qs[n], ...a].join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash;
    return;
  }
  !n || js.value(n) || (qu(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Bn.value = location.hash, Fu();
});
const ja = R(() => {
  const [e, t = ""] = Bn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: yl.value,
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
}), us = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${us.page(e)}?open=${t}`
};
function Wu(e = "", t = 0, n = "") {
  location.hash = us.page(e, t, n);
}
const Hu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function wl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Hu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Tt = {};
function D2(e, t) {
  return Tt[e] = t, () => Tt[e] === t && delete Tt[e];
}
function bl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Tt[e]) != null && l.call(Tt, t))) return;
  const s = ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  wl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Uu(e, t, n, a = 0, s = "") {
  if (e === ja.value.env) return bl(t, n, a, s);
  const o = ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  wl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Uu(a, s, Number(o), 0, t) : bl(s, Number(o), 0, t);
}
function zu(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ot(e) {
  const t = zu(e);
  t && Pe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function P2(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Vu = { class: "inspector-part" }, Gu = { class: "inspector-part-title" }, Ku = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", Vu, [
      g("h4", Gu, w(e.title), 1),
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, j2 = /* @__PURE__ */ Z(Ku, [["__scopeId", "data-v-0da7fa52"]]), Yu = {
  key: 1,
  class: "row-list-failure"
}, Zu = ["data-row"], Ju = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = I(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), W(xt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Yu, w(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), W(Yt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        ne(w(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(K, { key: 3 }, [
      (c(), W(bt(e.arrival ? Po : "ul"), Ye(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), h(K, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ce(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Zu))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: l[0] || (l[0] = (r) => s(e.older))
      }, "Show more")) : C("", !0)
    ], 64));
  }
}, Xu = /* @__PURE__ */ Z(Ju, [["__scopeId", "data-v-6c7ba696"]]), Qu = {
  class: "agent-rows",
  "data-agent-rows": ""
}, ed = {
  key: 1,
  class: "agent-rows-note"
}, td = {
  key: 2,
  class: "agent-rows-note"
}, nd = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ad = ["data-agent-row", "onClick"], sd = { class: "agent-row-name" }, od = { class: "agent-row-state" }, ld = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = R(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Qu, [
      e.loaded ? e.failure ? (c(), h("p", ed, w(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        g("p", nd, w(a.value) + " running", 1),
        (c(!0), h(K, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => F(Pe)(`agents:${l.id}`)
        }, [
          g("span", sd, "#" + w(l.id) + " " + w(l.session), 1),
          g("span", od, w(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, ad))), 128))
      ], 64)) : (c(), h("p", td, w(e.none), 1)) : (c(), W(xt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, q2 = /* @__PURE__ */ Z(ld, [["__scopeId", "data-v-a01e5a17"]]), rd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, w(e.text), 3));
  }
}, kl = /* @__PURE__ */ Z(rd, [["__scopeId", "data-v-9e7e1157"]]), id = ["aria-valuenow", "aria-valuemax"], cd = {
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
    const t = e, n = R(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (a, s) => (c(), h("span", {
      class: X(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, id));
  }
}, ud = /* @__PURE__ */ Z(cd, [["__scopeId", "data-v-9eba6a85"]]), dd = { class: "bars" }, fd = { class: "bar-name" }, hd = { class: "bar-value" }, md = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", dd, [
      (c(!0), h(K, null, te(e.items, (i, u) => (c(), W(bt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: X(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          g("span", fd, w(i.label), 1),
          N(ud, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", hd, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, pd = /* @__PURE__ */ Z(md, [["__scopeId", "data-v-663427f4"]]), gd = { class: "bars" }, vd = {
  key: 0,
  class: "bars-title"
}, yd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", gd, [
      e.node.title ? (c(), h("span", vd, w(e.node.title), 1)) : C("", !0),
      N(pd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, wd = /* @__PURE__ */ Z(yd, [["__scopeId", "data-v-7135bb11"]]), bd = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (l) => ({ gap: `${l.gap || 14}px` }),
      row: (l) => ({ gap: `${l.gap || 12}px` }),
      grid: (l) => ({ gap: `${l.gap || 12}px`, gridTemplateColumns: `repeat(${l.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = R(() => n[a.node.type](a.node));
    return (l, r) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(K, null, te(e.node.children || [], (i, u) => (c(), W(Nl, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Mn = /* @__PURE__ */ Z(bd, [["__scopeId", "data-v-d142a3f4"]]), kd = {
  key: 0,
  class: "card-head"
}, xd = { class: "card-title" }, $d = {
  key: 0,
  class: "card-note"
}, Md = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", kd, [
        g("span", xd, w(e.node.title), 1),
        e.node.note ? (c(), h("span", $d, w(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      N(Mn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Sd = /* @__PURE__ */ Z(Md, [["__scopeId", "data-v-67b72d40"]]), _d = { processes: "process", memories: "memory", replies: "reply" }, Ht = (e) => (_d[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), qa = [], Ed = 2e3, et = /* @__PURE__ */ new Map(), Ad = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Cd = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? qa.unshift(e) : qa.push(e), et.clear();
}
function xl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Od = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Td = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Ke(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Bd(e, t) {
  const n = [{ type: "text", text: Ke(e).replace(/\r\n/g, `
`) }];
  for (const a of qa)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const l = a(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(s, 1, ...l);
    }
  return n;
}
function Zt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Rd(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Rd(e) {
  return e.split(Cd).map((t, n) => n % 2 ? t : t.replace(Ad, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Fs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Id = 24;
function Ld(e) {
  const [t, , ...n] = e, a = Fs(t), s = n.map(Fs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Id) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${Zt(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${Zt(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const $l = /^\s*(?:[-*+]|\d+[.)])\s+/, Fa = /^\s*(\d+)[.)]\s/, Ws = (e) => e.match(/^\s*/)[0].length;
function Ml(e) {
  const t = e[0].match(Fa), n = Ws(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && Ws(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Zt(o.text)}${o.nested.length ? Ml(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Nd(e, t) {
  const n = Fa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if ($l.test(e[s]) && Fa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Hs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Sl(e) {
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
      n.push(`<h${r}>${Zt(o[2])}</h${r}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Hs(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Ld(t.slice(a, r))), a = r;
      continue;
    }
    if ($l.test(s)) {
      const r = Nd(t, a);
      n.push(Ml(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Sl(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Hs(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${Zt(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Dd = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Pd = (e) => e.type !== "text" && !Dd.test(e.html);
function jd(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Sl(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Pd(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function qd(e, t = { env: "" }) {
  const n = Td(e, t), a = et.get(n);
  if (et.delete(n), a && a.source === t.source && a.reads.every((l) => Od(l, t)))
    return et.set(n, a), a.html;
  const s = [], o = jd(Bd(e, { ...t, reads: s }));
  return et.set(n, { html: o, reads: s, source: t.source }), et.size > Ed && et.delete(et.keys().next().value), o;
}
const oa = /* @__PURE__ */ new WeakMap();
function Fd(e) {
  if (oa.has(e)) return oa.get(e);
  const t = zr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Ht(u)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function l(u) {
    a.has(u) || (a.add(u), e.follow([`${Ht(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const v = Number(m.slice(f.length));
        (!d.row_id || d.row_id === v) && o(u, v);
      }
    }));
  }
  function r(u, d) {
    l(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: r };
  return oa.set(e, i), i;
}
function _l() {
  const e = $e(Se, null), t = e ? Fd(e) : null;
  return (n, a = {}) => qd(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const El = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, sn = (e) => String(e || "").replace(El, (t, n, a, s) => s), Wd = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), gn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Hd = /^Traceback \(most recent call last\):/m, Ud = 8;
function Al(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Ud).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function zd(e) {
  const t = [...e.matchAll(Wd)].map((a) => a.index);
  if (gn.lastIndex = 0, !t.length || !gn.test(e)) return null;
  gn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(gn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Al(n), tail: "" } : null;
}
function Vd(e) {
  const t = Hd.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Al([o]), tail: n.slice(s).join(`
`) };
}
$t((e) => {
  const t = sn(e), n = Vd(t) || zd(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Gd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Kd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Yd = /[\w\]]\(/, Zd = /^[\w$.[\]'"]+\s*=\s*[^=]/, Jd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Xd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Qd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, ef = /[[({,]$/, tf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, nf = /^(\t|\s{2,})\S/, af = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, sf = /`[^`]+`/, of = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, lf = /[{}()[\];=<>$&|*\\@+^~%]/g, Cl = /^\s*(?:[-*+]|\d+[.)])\s/, rf = /^\s*>/, cf = /^\s*\|/, uf = 0.6, df = 0.4, ff = 5, hf = 0.03, Ol = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ff && t.every((n) => of.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(lf) ?? []).length / e.length < hf;
}, la = (e) => {
  const t = e.trim();
  return sf.test(t) ? !1 : [Gd, Kd, Yd, Zd, Jd, Xd, Qd, ef, tf].some((n) => n.test(t)) || /[;{}]$/.test(t) || nf.test(e) && !Cl.test(e) && !Ol(e);
};
function mf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Cl.test(t[0]) || t.every((o) => rf.test(o) || cf.test(o))) return "text";
  const n = t.filter((o) => !af.test(o.trim()));
  if (t.length === 1) return !n.length || la(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(la).length, s = n.filter((o) => !la(o) && Ol(o)).length;
  return a >= n.length * uf && s <= n.length * df ? "code" : "text";
}
const Wa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", pf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", gf = `${Wa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, vf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", yf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Us = {
  js: { keywords: Wa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: pf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: gf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Wa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: vf, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: yf, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, wf = {
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
function zs(e, t, n) {
  return n && e.startsWith(n, t);
}
function bf(e, t) {
  const n = Us[wf[t] ?? t] || Us.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (zs(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && zs(e, o, n.block[0])) {
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
function kf(e, t) {
  const n = [""];
  for (const { type: a, value: s } of bf(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? Ke(l) : `<span class="tok-${a}">${Ke(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function xf(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const $f = 1500, Vs = /* @__PURE__ */ new WeakMap();
async function Mf(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await xf(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Vs.get(t)), Vs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, $f)
  )));
}
typeof document < "u" && document.addEventListener("click", Mf, !0);
const Sf = /\n\s*\n/, _f = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Ef = /^\s*(`{3,}|~{3,})\s*$/, Af = /^\s{4,}\S/, Cf = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ha = /^\s*(?:[-*+]|\d+[.)])\s/, Tl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Of = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ds(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Tf(e) {
  const t = ds(e.join(`
`));
  return (Of.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Bf = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Tl.test(t) && !Ha.test(t);
}, Rf = (e, t) => Ha.test(t) || Ha.test([...e].reverse().find((n) => n.trim()) || "");
function fs(e, t) {
  const n = t || Tf(e), a = kf(ds(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function If(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Ef.test(s));
  return a < 0 ? e.length : a;
}
function Lf(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return fs(a.map(sn), n ? n.toLowerCase() : "");
}
function Nf(e) {
  const t = e.split(Sf).map((l) => ({ paragraph: l, type: mf(ds(l).split(`
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
      s(), n.push(fs(r.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(sn), "")), o = l;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Df(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Nf(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(_f);
    if (r) {
      const u = If(n, l, r[2]);
      o(), a.push(Lf(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = Bf(s) ? Cf : Af;
    if (!t && i.test(n[l]) && !Rf(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Tl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - l + d.length >= 2) {
        o(), a.push(fs([...d, ...n.slice(l, u)].map(sn), "")), l = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[l]), l += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
$t((e, t) => Df(e, t.document));
const Rn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Bl = (e) => `${e.table}:${e.id}`, Gs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ra = 80;
function Ks(e) {
  return e.length <= ra ? e : `${e.slice(0, ra + 1).replace(/\s+\S*$/, "") || e.slice(0, ra)}…`;
}
const Ys = {
  messages: (e) => Ks(Gs(e.text)),
  comments: (e) => Ks(Gs(e.text)),
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
}, Pf = (e) => (Ys[e.table] ? Ys[e.table](e) : e.title || "") || "", wt = (e) => Rn(e.created_at), Rl = (e) => Rn(e.updated_at) || wt(e), jf = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, qf = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Ff(e) {
  const t = jf.exec(e);
  if (t && Ge(t[1])) return { at: t.index, length: t[0].length, table: Ge(t[1]), id: Number(t[2]), label: t[3] };
  const n = qf.exec(e), a = n && Ge(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Wf(e, t, n, a) {
  const s = xl(a, e, t), o = sn(s ? Pf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Ke(Dt(e).title)} ${t}</span><span class="row-card-title">${Ke(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Ff(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Wf(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Hf = /\.(png|jpe?g|gif|webp|svg)$/i, Uf = (e) => Hf.test(e), zf = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Vf = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Gf(e, t) {
  const n = zf.exec(e), [, a, s, o, l, r] = n || [], i = n && Ge(a || o), u = i && xl(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${Dt(i).title} ${u.id} · ${Ke(r)}`, m = Uf(r) ? `<img class="file-card-image" src="${d}" alt="${Ke(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ke(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Kf(e) {
  const t = Vf.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ke(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = Gf(e, t) || Kf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Yf = /`([^`\n]+)`/g;
$t((e) => e.replace(Yf, (t, n) => `<code>${n}</code>`));
const Zs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${us.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(El, (n, a, s, o) => Zs[a] ? Zs[a](s, o, t) : o)
);
const Zf = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Il = new RegExp(`\\b(${ml}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Ll = new RegExp(`\\b(${ml}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Jf = new RegExp(`<code>((?:${Il.source}|${Ll.source}))</code>`, "gi"), Xf = (e) => e.replace(Jf, "$1"), Qf = (e, t) => `<a class="row-pill" href="#" data-peek="${Ge(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, eh = (e) => e.replace(Ll, (t, n, a) => a.replace(/\d+/g, (s) => Qf(n.replace(/s$/i, ""), s))), th = (e) => eh(e).replace(
  Il,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${Ge(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : Xf(e).split(Zf).map((n, a) => a % 2 ? n : th(n)).join("")
);
const nh = ["innerHTML"], ah = ["innerHTML"], sh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = _l(), a = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => F(Ot) && F(Ot)(...l)),
      innerHTML: a.value
    }, null, 8, nh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => F(Ot) && F(Ot)(...l)),
      innerHTML: a.value
    }, null, 8, ah));
  }
}, st = /* @__PURE__ */ Z(sh, [["__scopeId", "data-v-d8e75741"]]), oh = { class: "fact" }, lh = { class: "fact-label" }, rh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", oh, [
      g("span", lh, w(e.label), 1),
      N(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, ih = /* @__PURE__ */ Z(rh, [["__scopeId", "data-v-3a88ecf8"]]), ch = { class: "list" }, uh = { class: "list-label" }, dh = {
  key: 1,
  class: "list-note"
}, fh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", ch, [
      (c(!0), h(K, null, te(e.items, (o, l) => (c(), W(bt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", uh, w(o.label), 1),
          o.badge ? (c(), W(kl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", dh, w(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, hh = /* @__PURE__ */ Z(fh, [["__scopeId", "data-v-ebe2ae0a"]]), mh = { class: "table" }, ph = {
  key: 0,
  class: "table-row empty"
}, gh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", mh, [
      g("div", {
        class: "table-row head",
        style: fe(s.value)
      }, [
        (c(!0), h(K, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, w(r), 1))), 128))
      ], 4),
      (c(!0), h(K, null, te(e.rows, (r, i) => (c(), W(bt(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: X(["table-row", r.tone, { opens: r.open }]),
        style: fe(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: D(() => [
          (c(!0), h(K, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", ph, w(e.empty), 1)) : C("", !0)
    ]));
  }
}, vh = /* @__PURE__ */ Z(gh, [["__scopeId", "data-v-9326a52e"]]), yh = { class: "stat-value" }, wh = { class: "stat-label" }, bh = {
  key: 0,
  class: "stat-note"
}, kh = {
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
    return (a, s) => (c(), W(bt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: X(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        g("span", yh, w(e.value), 1),
        g("span", wh, w(e.label), 1),
        e.note ? (c(), h("span", bh, w(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, xh = /* @__PURE__ */ Z(kh, [["__scopeId", "data-v-ad0db6d6"]]), $h = { class: "code" }, Mh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, l) => (c(), W(Nt, {
      value: e.node.type
    }, {
      stack: D(() => [
        N(Mn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        N(Mn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        N(Mn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        N(Sd, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        g("h3", {
          class: X(["heading", `level-${e.node.level || 2}`])
        }, w(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        N(xh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        N(wd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        N(vh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        N(hh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        N(st, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        N(ih, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        N(kl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        g("pre", $h, [
          g("code", null, w(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Nl = /* @__PURE__ */ Z(Mh, [["__scopeId", "data-v-cbdcf540"]]), Sh = { class: "dashboard" }, _h = { class: "trail" }, Eh = ["onClick"], Ah = {
  key: 0,
  class: "gone",
  role: "status"
}, Ch = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), l = I(n.page && !o.value ? [n.page] : []), r = R(() => l.value.at(-1) || n.document.start), i = R(() => (n.document.pages || {})[r.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, l.value = [...l.value, m];
    }, f = (m) => {
      o.value = !1, l.value = l.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => l.value = []
    ), (m, v) => (c(), h("div", Sh, [
      e.document.broken ? (c(), W(Yt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          ne(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), W(Yt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          ne(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(K, { key: 2 }, [
        g("nav", _h, [
          g("button", {
            type: "button",
            class: X(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (y) => f(0))
          }, w(u(e.document.start)), 3),
          (c(!0), h(K, null, te(l.value, (y, O) => (c(), h(K, {
            key: `${O}-${y}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: O === l.value.length - 1 }]),
              onClick: (k) => f(O + 1)
            }, w(u(y)), 11, Eh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Ah, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        N(Lt, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              N(Nl, {
                node: i.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (y) => a("file", y))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : C("", !0)
    ]));
  }
}, Oh = /* @__PURE__ */ Z(Ch, [["__scopeId", "data-v-fbe83734"]]), Qe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ne = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Le = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Th = 6;
function hs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Bh = (e) => {
  const t = hs(e, Qe.lineChars), n = Math.max(Qe.minWidth, Math.max(...t.map((a) => a.length)) * Qe.charWidth + Qe.padX * 2);
  return { name: e, lines: t, line: Qe.line, padY: Qe.padY, width: n, height: t.length * Qe.line + Qe.padY * 2 };
};
function Rh(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Ih(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Lh(e, t, n) {
  const a = [];
  e.forEach((l) => {
    var r;
    return (a[r = n.get(l)] || (a[r] = [])).push(l);
  });
  const s = () => new Map(a.flatMap((l) => l.map((r, i) => [r, i]))), o = (l, r) => {
    const i = s(), u = (d) => {
      const f = r(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : i.get(d);
    };
    return [...l].sort((d, f) => u(d) - u(f));
  };
  for (let l = 0; l < Th; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Nh(e, t) {
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
function Dh(e) {
  const t = [...new Set(e.flatMap(([j, M]) => [j, M]))], n = new Set(e.map(([, j]) => j)), a = t.filter((j) => !n.has(j)), s = Rh(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((j, M) => !s.has(M)), l = Ih(t, o), r = Lh(t, o, l), i = new Map(t.map((j) => [j, Bh(j)])), u = r.map((j) => j.reduce((M, S) => M + i.get(S).width, 0) + Le.across * (j.length - 1)), d = Math.max(...u) + Le.margin * 2, f = jh(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Le.margin;
  r.forEach((j, M) => {
    let S = (d - u[M]) / 2;
    const B = Math.max(...j.map((A) => i.get(A).height));
    j.forEach((A) => {
      const x = i.get(A);
      m.set(A, { ...x, x: S, y: v + (B - x.height) / 2 }), S += x.width + Le.across;
    }), v += B + (f[M] ?? Le.down);
  });
  const y = e.map(([j, M, S], B) => ({ from: j, to: M, label: S || "", back: s.has(B) || l.get(M) <= l.get(j) }));
  Nh(y, m);
  const O = y.map((j) => qh(j, m.get(j.from), m.get(j.to))), k = [...m.values()], L = Uh(O, k), z = Math.max(v - Le.down, ...L.filter((j) => j.label).map((j) => j.label.y + j.label.height));
  return { width: Math.max(d - Le.margin, ...L.filter((j) => j.label).map((j) => j.label.x + j.label.width)) + Le.margin, height: z + Le.margin, nodes: k, arrows: L };
}
const Ph = (e) => e ? hs(e, Ne.lineChars).length * Ne.line + Ne.pad * 2 : 0;
function jh(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Le.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Ph(l) + Le.labelSpace);
  }), a.map((s) => Math.max(Le.down, s));
}
function qh(e, t, n) {
  const a = e.label ? hs(e.label, Ne.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Ne.charWidth + Ne.pad * 2 : 0, o = a.length * Ne.line + (a.length ? Ne.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const Fh = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Wh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Hh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ne.line);
function Uh(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = Fh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = Hh.flatMap((i) => Wh.map((u) => s(u, i))).find((i) => !n.some((u) => Js(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => Js(r, i)); ) r.y += Ne.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Ne.line, pad: Ne.pad } };
  });
}
const Js = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, zh = { class: "flowchart-tools" }, Vh = ["width", "height", "viewBox", "aria-label"], Gh = ["d"], Kh = ["x", "y", "width", "height"], Yh = ["x", "y"], Zh = ["x", "dy"], Jh = {
  key: 0,
  class: "flowchart-label"
}, Xh = ["x", "y", "width", "height"], Qh = ["x", "y"], e1 = ["x", "dy"], t1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Dh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var L;
      const O = (L = l.value) == null ? void 0 : L.getBoundingClientRect();
      if (!(O != null && O.width)) return;
      const k = Math.min(O.width / s.value.width, O.height / s.value.height, 1.5);
      r.value = { zoom: k, x: (O.width - s.value.width * k) / 2, y: (O.height - s.value.height * k) / 2 };
    }
    function d(O, k, L) {
      const { zoom: z, x: ee, y: j } = r.value, M = Math.min(o.most, Math.max(o.least, z * O));
      r.value = { zoom: M, x: k - (k - ee) * M / z, y: L - (L - j) * M / z };
    }
    function f(O) {
      const k = l.value.getBoundingClientRect();
      d(O, k.width / 2, k.height / 2);
    }
    function m(O) {
      const k = l.value.getBoundingClientRect();
      O.ctrlKey || O.metaKey ? d(O.deltaY < 0 ? o.step : 1 / o.step, O.clientX - k.left, O.clientY - k.top) : r.value = { ...r.value, x: r.value.x - O.deltaX, y: r.value.y - O.deltaY };
    }
    function v(O) {
      var k, L, z;
      O.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), i = { x: O.clientX - r.value.x, y: O.clientY - r.value.y }, (z = (L = l.value).setPointerCapture) == null || z.call(L, O.pointerId);
    }
    function y(O) {
      i && (r.value = { ...r.value, x: O.clientX - i.x, y: O.clientY - i.y });
    }
    return Oe(u), (O, k) => (c(), W(dl, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (L) => a("close"))
    }, {
      default: D(() => [
        g("div", zh, [
          N(ue, {
            small: "",
            onClick: k[0] || (k[0] = (L) => f(o.step))
          }, {
            default: D(() => [...k[5] || (k[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(ue, {
            small: "",
            onClick: k[1] || (k[1] = (L) => f(1 / o.step))
          }, {
            default: D(() => [...k[6] || (k[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(ue, {
            small: "",
            onClick: u
          }, {
            default: D(() => [...k[7] || (k[7] = [
              ne("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: l,
          class: "flowchart-frame",
          onWheel: we(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: y,
          onPointerup: k[2] || (k[2] = (L) => Cs(i) ? i.value = null : i = null),
          onPointercancel: k[3] || (k[3] = (L) => Cs(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: fe({ transform: `translate(${r.value.x}px, ${r.value.y}px) scale(${r.value.zoom})` })
          }, [
            k[8] || (k[8] = g("defs", null, [
              g("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                g("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(K, null, te(s.value.arrows, (L, z) => (c(), h("path", {
              key: `arrow-${z}`,
              class: "flowchart-arrow",
              d: L.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Gh))), 128)),
            (c(!0), h(K, null, te(s.value.nodes, (L) => (c(), h("g", {
              key: L.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: L.x,
                y: L.y,
                width: L.width,
                height: L.height,
                rx: "8"
              }, null, 8, Kh),
              g("text", {
                x: L.x + L.width / 2,
                y: L.y + L.padY + L.line / 2
              }, [
                (c(!0), h(K, null, te(L.lines, (z, ee) => (c(), h("tspan", {
                  key: ee,
                  x: L.x + L.width / 2,
                  dy: ee ? L.line : 0
                }, w(z), 9, Zh))), 128))
              ], 8, Yh)
            ]))), 128)),
            (c(!0), h(K, null, te(s.value.arrows, (L, z) => (c(), h(K, {
              key: `label-${z}`
            }, [
              L.label ? (c(), h("g", Jh, [
                g("rect", {
                  x: L.label.x,
                  y: L.label.y,
                  width: L.label.width,
                  height: L.label.height,
                  rx: "4"
                }, null, 8, Xh),
                g("text", {
                  x: L.label.x + L.label.width / 2,
                  y: L.label.y + L.label.pad + L.label.line / 2
                }, [
                  (c(!0), h(K, null, te(L.label.lines, (ee, j) => (c(), h("tspan", {
                    key: j,
                    x: L.label.x + L.label.width / 2,
                    dy: j ? L.label.line : 0
                  }, w(ee), 9, e1))), 128))
                ], 8, Qh)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, Vh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, n1 = /* @__PURE__ */ Z(t1, [["__scopeId", "data-v-51d24cfe"]]), Xs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Qs = {
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
  agent: Xs,
  worker: Xs,
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
}, a1 = ["innerHTML"], s1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Qs[t.name] || Qs.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, a1));
  }
}, rt = /* @__PURE__ */ Z(s1, [["__scopeId", "data-v-beb5935c"]]), o1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(rt, { name: "fold" })
    ], 2));
  }
}, Rt = /* @__PURE__ */ Z(o1, [["__scopeId", "data-v-d03899bb"]]), l1 = ["data-tip", "aria-label"], r1 = {
  key: 0,
  class: "mact-word"
}, i1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      N(rt, { name: "open" }),
      e.open ? (c(), h("span", r1, w(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, l1));
  }
}, Dl = /* @__PURE__ */ Z(i1, [["__scopeId", "data-v-3b292e09"]]), Pl = 120, Sn = 280, jl = 160, c1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, u1 = ["leaving", "resizing", "entering"];
function Ua(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function d1(e) {
  const t = u1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ua(e);
  return e.classList.add(...t), n;
}
function ql(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const v = d1(f);
    l(f, m), f.offsetWidth, f.style.transition = `width ${Sn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Sn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(f, v);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, Ua(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || c1()) {
      a.value = f;
      return;
    }
    const y = Ua(m);
    if (l(m, y), s.value = "leaving", await n(Pl), v !== o) return;
    a.value = f, s.value = "resizing", await it(), i(m, y);
    const O = u(m);
    await n(Sn), O == null || O.disconnect(), v === o && (r(m), s.value = "entering", await n(jl), v === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), kt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const f1 = { class: "growing-card-top" }, h1 = ["aria-expanded"], m1 = { class: "growing-card-avatar" }, p1 = { class: "growing-card-title" }, g1 = { class: "growing-card-more" }, v1 = { class: "growing-card-body" }, y1 = {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = ql(o, () => !s.value), i = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", F(r), { open: !F(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", f1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", m1, [
            e.bad ? (c(), W(rt, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(K, { key: 1 }, [
              ne(w(i.value), 1)
            ], 64)) : (c(), W(me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", p1, w(e.title), 1),
          N(Rt, { open: s.value }, null, 8, ["open"])
        ], 8, h1),
        e.action ? (c(), W(Dl, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (m) => a("act"))
        }, null, 8, ["label", "open"])) : C("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => a("comment"))
        }, [
          N(me, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      g("div", g1, [
        g("div", v1, [
          (c(!0), h(K, null, te(u.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, w1 = /* @__PURE__ */ Z(y1, [["__scopeId", "data-v-f2b4930d"]]), b1 = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, k1 = {
  key: 0,
  class: "message-links-many"
}, x1 = ["aria-expanded"], $1 = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, M1 = ["onClick"], S1 = { class: "row-pill message-links-chip" }, _1 = { class: "message-links-title" }, ia = 3, eo = "task", E1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = R(() => t.links.length), s = R(() => t.links.every((m) => m.model === eo) ? "tasks" : "items"), o = R(() => `Linked: ${t.links.map((m) => `${m.model} ${m.id}`).join(" ")}`), l = I(!1), r = I({}), i = I(null);
    Ho(i, () => l.value = !1);
    async function u() {
      const m = t.links.filter((y) => y.model === eo && !(y.id in r.value)), v = await Promise.all(m.map((y) => n.read(`task show ${y.id}`)));
      r.value = { ...r.value, ...Object.fromEntries(v.filter((y) => y.ok).map((y) => [y.value.id, y.value.title])) };
    }
    function d() {
      l.value = !l.value, l.value && u();
    }
    function f(m) {
      l.value = !1, Pe(`${Ge(m.model)}:${m.id}`);
    }
    return (m, v) => (c(), h("div", {
      ref_key: "line",
      ref: i,
      class: X(["message-links", { many: a.value > ia, three: a.value === ia, open: l.value }]),
      "data-message-links": ""
    }, [
      N(rt, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", b1, [
        N(st, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      a.value >= ia ? (c(), h("span", k1, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: d
        }, [
          ne(w(a.value) + " linked " + w(s.value) + " ", 1),
          N(Rt, { open: l.value }, null, 8, ["open"])
        ], 8, x1)
      ])) : C("", !0),
      l.value ? (c(), h("div", $1, [
        (c(!0), h(K, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.model}:${y.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (O) => f(y)
        }, [
          g("span", S1, w(y.model) + " " + w(y.id), 1),
          g("span", _1, w(r.value[y.id]), 1)
        ], 8, M1))), 128))
      ])) : C("", !0)
    ], 2));
  }
}, A1 = /* @__PURE__ */ Z(E1, [["__scopeId", "data-v-24868afd"]]), C1 = ["title", "aria-label"], O1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, T1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, B1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: X(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", O1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", T1)) : C("", !0)
      ]))
    ], 10, C1));
  }
}, R1 = /* @__PURE__ */ Z(B1, [["__scopeId", "data-v-6dc92808"]]);
function I1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Fl(e, t = Date.now()) {
  const n = I1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const L1 = 36e5;
function F2(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / L1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Wl(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function to(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ca = (e) => String(e).padStart(2, "0");
function N1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ca(t % 60)}s` : `${Math.floor(t / 3600)}h ${ca(Math.floor(t % 3600 / 60))}m ${ca(t % 60)}s`;
}
const D1 = "img,pre,table";
function P1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function j1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function q1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(D1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = P1(j1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function F1(e, t) {
  let n = null;
  const a = () => e.value && q1(e.value);
  Oe(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Be(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const W1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function H1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const U1 = ["data-incoming", "data-ref"], z1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], V1 = { class: "message-body" }, G1 = ["title"], K1 = ["innerHTML"], Y1 = ["title"], Z1 = ["innerHTML"], J1 = {
  class: "message-faces",
  "data-message-faces": ""
}, X1 = ["title", "data-face", "onClick"], Q1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, em = ["title", "data-reaction", "onClick"], tm = {
  key: 0,
  class: "message-reaction-count"
}, nm = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, am = ["href", "title"], sm = ["src", "alt"], om = ["href"], lm = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, rm = ["data-sent-worker", "title", "onClick"], im = { class: "message-foot" }, cm = { class: "message-time" }, um = {
  class: "message-id",
  "data-message-id": ""
}, dm = 140, fm = 2, hm = 1500, mm = "An earlier message", pm = "about", gm = "sent_to", vm = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var $;
    const n = e, a = t, s = I(!1), o = I(null), l = R(() => ["user", "comment"].includes(n.message.type)), r = R(() => {
      const [V, J] = (n.message.commented_row || ":").split(":"), Y = Ge(V);
      return Y ? { ref: `${Y}:${J}`, label: `${Dt(Y).title.toLowerCase()} ${J}` } : null;
    }), i = R(() => n.message.worker_id ?? null), u = I(!1), d = R(() => i.value !== null && ((n.message.text ?? "").length > dm || (n.message.text ?? "").split(`
`).filter((V) => V.trim()).length > fm)), f = R(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var V;
      await ((V = navigator.clipboard) == null ? void 0 : V.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, hm);
    }
    const v = _l(), y = R(() => v(n.message.text ?? "")), O = R(() => JSON.parse(n.message.flowchart_edges || "[]")), k = I(!1), L = R(() => v(n.quote || mm));
    function z() {
      const V = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      V ? V.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    F1(o, () => `${n.message.text} ${n.quote}`);
    const ee = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, j = (V) => `/api/files/message/${n.message.id}/${encodeURIComponent(V)}`, M = R(() => JSON.parse(n.message.captions || "{}")), S = R(() => (n.message.files ?? []).map((V) => ({ name: V, address: j(V), isImage: ee.test(V), title: M.value[V] || V }))), B = R(() => Wl(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = $e(Se, null), x = I([]), T = I([]);
    async function b() {
      if (!l.value || !(A != null && A.read) || n.message.local) return;
      const V = await A.read(`link list --source message:${n.message.id}`);
      if (!V.ok) return;
      const J = V.value.rows ?? V.value ?? [];
      x.value = J.filter((Y) => Y.link_type === pm).map((Y) => ({ model: Y.target_model, id: Y.target_id })), T.value = J.filter((Y) => Y.link_type === gm).map((Y) => Y.target_id);
    }
    b(), ($ = A == null ? void 0 : A.follow) == null || $.call(A, ["link.*"], b);
    const p = I(!1), _ = R(() => H1(n.message.reactions));
    function E(V) {
      p.value = !1, a("react", n.message, V);
    }
    return (V, J) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      N(w1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (Y) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, U1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", V1, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: r.value }]),
          onClick: J[6] || (J[6] = (...Y) => F(Ot) && F(Ot)(...Y))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: J[1] || (J[1] = we((Y) => F(Pe)(r.value.ref), ["stop"]))
          }, [
            N(me, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + w(r.value.label), 1)
          ], 8, G1)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: we(z, ["stop"]),
            innerHTML: L.value
          }, null, 8, K1)) : C("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: J[2] || (J[2] = we((Y) => F(Pe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, Y1)) : C("", !0),
          g("div", {
            class: X({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Z1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = we((Y) => u.value = !u.value, ["stop"]))
          }, w(u.value ? "Show less" : "Show more"), 1)) : C("", !0),
          O.value.length ? (c(), h(K, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (Y) => k.value = !0)
            }, "Open the flowchart"),
            k.value ? (c(), W(n1, {
              key: 0,
              title: e.message.text,
              edges: O.value,
              onClose: J[5] || (J[5] = (Y) => k.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        g("div", {
          class: X(["message-tools", { picking: p.value }]),
          "data-message-tools": ""
        }, [
          p.value ? (c(), h(K, { key: 0 }, [
            g("div", J1, [
              (c(!0), h(K, null, te(F(W1), (Y) => (c(), h("button", {
                key: Y,
                type: "button",
                class: "message-face",
                title: `React ${Y}`,
                "data-face": Y,
                onClick: (ie) => E(Y)
              }, w(Y), 9, X1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (Y) => p.value = !1)
            }, [
              N(me, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(K, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: J[8] || (J[8] = (Y) => p.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[9] || (J[9] = (Y) => a("reply", e.message))
            }, "Reply"),
            g("button", {
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
              onClick: J[10] || (J[10] = (Y) => a("delete", e.message))
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      _.value.length ? (c(), h("div", Q1, [
        (c(!0), h(K, null, te(_.value, (Y) => (c(), h("button", {
          key: Y.emoji,
          type: "button",
          class: X(["message-reaction", { mine: Y.mine }]),
          title: Y.title,
          "data-reaction": Y.emoji,
          onClick: (ie) => a("react", e.message, Y.emoji)
        }, [
          ne(w(Y.emoji) + " ", 1),
          Y.count > 1 ? (c(), h("span", tm, w(Y.count), 1)) : C("", !0)
        ], 10, em))), 128))
      ])) : C("", !0),
      S.value.length ? (c(), h("div", nm, [
        (c(!0), h(K, null, te(S.value, (Y) => (c(), h(K, {
          key: Y.name
        }, [
          Y.isImage ? (c(), h("a", {
            key: 0,
            href: Y.address,
            target: "_blank",
            class: "message-image",
            title: Y.title
          }, [
            g("img", {
              src: Y.address,
              alt: Y.name,
              "data-figure-picture": ""
            }, null, 8, sm)
          ], 8, am)) : (c(), h("a", {
            key: 1,
            href: Y.address,
            target: "_blank",
            class: "message-file"
          }, w(Y.name), 9, om))
        ], 64))), 128))
      ])) : C("", !0),
      T.value.length ? (c(), h("div", lm, [
        N(me, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, te(T.value, (Y) => (c(), h("button", {
          key: Y,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Y,
          title: `Open worker ${Y}`,
          onClick: we((ie) => F(Pe)(`agents:${Y}`), ["stop"])
        }, "Also sent to worker " + w(Y), 9, rm))), 128))
      ])) : C("", !0),
      g("div", im, [
        g("time", cm, w(B.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          J[11] || (J[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", um, "message " + w(e.message.id), 1)
        ], 64)) : C("", !0),
        l.value ? (c(), W(R1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      x.value.length ? (c(), W(A1, {
        key: 3,
        links: x.value
      }, null, 8, ["links"])) : C("", !0)
    ], 8, z1));
  }
}, W2 = /* @__PURE__ */ Z(vm, [["__scopeId", "data-v-2b3e68eb"]]), ym = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = Vr("SkeletonParts", !0);
      return c(!0), h(K, null, te(e.parts, (i, u) => (c(), h(K, { key: u }, [
        (c(!0), h(K, null, te(i.count, (d) => (c(), W(Nt, {
          key: d,
          value: i.shape
        }, {
          line: D(() => [
            g("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: i.width, height: `${t[i.size]}px` })
            }, null, 4)
          ]),
          circle: D(() => [
            g("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 4)
          ]),
          block: D(() => [
            g("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: i.width, height: `${i.height}px` })
            }, null, 4)
          ]),
          grow: D(() => [...l[0] || (l[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            g("div", {
              class: "skeleton-row",
              style: fe(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: D(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: fe(a(i))
            }, [
              N(r, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            g("div", {
              class: "skeleton-grid",
              style: fe(s(i))
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
}), wm = /* @__PURE__ */ Z(ym, [["__scopeId", "data-v-576c95e1"]]), bm = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, km = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", bm, [
      N(wm, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ms = /* @__PURE__ */ Z(km, [["__scopeId", "data-v-52f66b64"]]), In = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ua = 200, Hl = (e) => {
  var t;
  return ((t = In.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? In[0].key;
}, H2 = (e) => {
  var t;
  return ((t = In.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, xm = ["aria-label"], $m = 300, no = 400, Mm = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ua } },
  setup(e) {
    const t = e, n = R(() => Hl(t.value)), a = R(() => n.value < ua ? [1, 0.25, 0.25] : n.value === ua ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= no, high: n.value >= $m && n.value < no }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      g("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: fe({ opacity: a.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: fe({ opacity: a.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: fe({ opacity: a.value[2] })
      }, null, 4)
    ], 10, xm));
  }
}, U2 = /* @__PURE__ */ Z(Mm, [["__scopeId", "data-v-b10e610f"]]), ao = (e) => [...new Set(e.agents.map((t) => t.name))], z2 = (e) => ao(e).length === 1 ? `Worker: ${ao(e)[0]}` : "Delegated", Sm = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, so = (e) => Sm[e.card.state] || "idle", _m = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), oo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, lo = (e, t) => oo[so(e)] - oo[so(t)], ro = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, V2 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => lo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || _m(a, s)) : [...e].sort((a, s) => lo(a, s) || (ro[t] || ro.state)(a, s)), Em = { class: "list-row" }, Am = {
  key: 0,
  class: "list-row-type"
}, Cm = { class: "list-row-main" }, Om = {
  key: 0,
  class: "list-row-title"
}, Tm = { class: "list-row-body" }, Bm = {
  key: 1,
  class: "list-row-end"
}, Rm = {
  key: 1,
  class: "list-row-text"
}, Im = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Em, [
      e.type ? (c(), h("span", Am, w(e.type), 1)) : C("", !0),
      g("div", Cm, [
        e.title ? (c(), h("span", Om, w(e.title), 1)) : C("", !0),
        g("div", Tm, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Bm, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", Rm, w(e.text), 1)) : C("", !0)
    ]));
  }
}, G2 = /* @__PURE__ */ Z(Im, [["__scopeId", "data-v-dfc8c3a7"]]), Lm = {
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
}, Nm = { claude: "Claude Code", codex: "Codex" }, Dm = ["aria-expanded"], Pm = { class: "drop-label" }, jm = ["value"], qm = {
  key: 1,
  class: "drop-lead"
}, Fm = { class: "drop-item-text" }, Wm = {
  key: 2,
  class: "drop-note"
}, Hm = {
  key: 1,
  class: "drop-none"
}, Um = {
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
    const n = e, a = t, s = I(!1), o = I(null), l = I(""), r = R(() => {
      const u = l.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: X(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: X(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), W(me, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        g("span", Pm, w(e.label), 1),
        N(me, {
          name: "down",
          size: 11
        })
      ], 10, Dm),
      s.value ? (c(), W(Un, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: D(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: l.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => l.value = f.target.value)
          }, null, 40, jm)) : C("", !0),
          (c(!0), h(K, null, te(r.value, (f) => (c(), W(yt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: D(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: X(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (c(), h("span", qm, w(f.lead), 1)) : C("", !0),
              g("span", Fm, w(f.label), 1),
              f.note ? (c(), h("span", Wm, w(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? C("", !0) : (c(), h("p", Hm, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, zm = /* @__PURE__ */ Z(Um, [["__scopeId", "data-v-29dfcce5"]]), K2 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => [
      ...Lm[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), W(zm, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${F(Nm)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Vm = ["aria-label"], Gm = { class: "head" }, Km = { class: "names" }, Ym = { class: "body" }, Zm = {
  key: 0,
  class: "foot"
}, Jm = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = il(a, n), r = cl(s);
    return (i, u) => (c(), W(ns, { to: "body" }, [
      N(Lt, {
        name: "side",
        appear: "",
        onAfterLeave: F(l)
      }, {
        default: D(() => [
          F(s) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: F(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = we((...d) => F(o) && F(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                g("header", Gm, [
                  g("div", Km, [
                    g("h2", null, w(e.title), 1),
                    e.abstract ? (c(), W(st, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  ce(i.$slots, "actions", {}, void 0, !0),
                  N(is, {
                    title: e.closeLabel,
                    onClick: F(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", Ym, [
                  ce(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", Zm, [
                  ce(i.$slots, "foot", {}, void 0, !0)
                ])) : C("", !0)
              ], 64)) : ce(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Vm)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Y2 = /* @__PURE__ */ Z(Jm, [["__scopeId", "data-v-c9a3f43a"]]), Xm = {
  key: 1,
  class: "text-field-label"
}, Qm = {
  key: 2,
  class: "text-field-end"
}, ep = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ba({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ta(e, "modelValue"), a = Hn(), s = "onUpdate:modelValue" in (((d = Gr()) == null ? void 0 : d.vnode.props) || {}), o = R(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = R(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = R(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: f.$slots.end }, F(a).class]),
      style: fe(F(a).style)
    }, [
      e.icon ? (c(), W(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", Xm, w(e.label), 1)) : C("", !0),
      Ze(g("input", Ye({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [F(Pa), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Qm, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : Ze((c(), h("input", Ye({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: l }), null, 16)), [
      [F(Pa), o.value]
    ]);
  }
}), Z2 = /* @__PURE__ */ Z(ep, [["__scopeId", "data-v-d9c38ca8"]]);
async function tp(e, t, n) {
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
const io = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function J2(e) {
  const t = ct().sources.find((n) => n.key === e);
  return t ? za(t.read, t.events) : za("", []);
}
function za(e, t, { incremental: n = !1 } = {}) {
  var M;
  const a = Number(((M = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : M[1]) ?? 50), s = ct(), o = I([]), l = I(null), r = I(""), i = I(!1), u = performance.now(), d = I(!1), f = I(""), m = I(null);
  async function v(S) {
    const B = k, A = await s.read(`${e} --before-id ${S + 1} --limit 1`);
    if (B !== k) return;
    if (!A.ok) return z();
    const x = A.value.rows.find((T) => T.id === S);
    o.value = x ? o.value.map((T) => T.id === S ? x : T) : o.value.filter((T) => T.id !== S);
  }
  async function y(S) {
    if (n && String((S == null ? void 0 : S.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== S.row_id));
    if (n && (S != null && S.row_id) && !String(S.event ?? "").endsWith(".create") && o.value.some((p) => p.id === S.row_id)) return v(S.row_id);
    if (!(n && o.value.length && String((S == null ? void 0 : S.event) ?? "").endsWith(".create"))) return z();
    const A = Math.max(...o.value.map((p) => p.id)), x = k, T = await s.read(`${e} --after-id ${A}`);
    if (x !== k) return;
    if (!T.ok) return z();
    const b = new Set(o.value.map((p) => p.id));
    o.value = [...T.value.rows.filter((p) => !b.has(p.id)), ...o.value];
  }
  async function O() {
    if (!d.value || !o.value.length) return !1;
    const S = k, B = Math.min(...o.value.map((T) => T.id)), A = await s.read(`${e} --before-id ${B}`);
    if (S !== k) return !1;
    if (!A.ok || !A.value.rows.length) return d.value = !1;
    d.value = io(A.value, a);
    const x = new Set(o.value.map((T) => T.id));
    return o.value = [...o.value, ...A.value.rows.filter((T) => !x.has(T.id))], !0;
  }
  let k = 0;
  async function L(S) {
    const B = ++k, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (B !== k) return;
    const x = A.ok ? s.shared ? [A.value] : A.value.rows : [];
    A.ok && (o.value = S(x)), l.value = A.ok ? A.value : null;
    const T = x.length ? Math.min(...x.map((b) => b.id)) : 0;
    A.ok && !o.value.some((b) => b.id < T) && (d.value = !s.shared && io(A.value, a)), r.value = A.ok ? "" : A.error, os(u, () => i.value = !0);
  }
  function z() {
    return L((S) => {
      if (!n || !S.length) return S;
      const B = Math.min(...S.map((x) => x.id)), A = Math.max(...S.map((x) => x.id));
      return [...o.value.filter((x) => x.id > A), ...S, ...o.value.filter((x) => x.id < B)];
    });
  }
  const ee = () => L((S) => S);
  async function j(S, B = null) {
    const A = await tp(B && { target: o, fields: { value: B(o.value) } }, S, s.run);
    return f.value = A.ok ? "" : A.error, m.value = A.ok ? A.value : null, await z(), A;
  }
  return e && (s.follow(t, y), z()), { rows: o, listing: l, failure: r, loaded: i, more: d, load: z, loadLatest: ee, older: O, act: j, actionFailure: f, answer: m, context: s };
}
const np = { class: "title" }, ap = { class: "state" }, sp = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = za(t.line, t.events);
    return (o, l) => (c(), W(Xu, {
      rows: F(n),
      failure: F(a),
      loaded: F(s),
      empty: e.empty
    }, {
      default: D(({ row: r }) => [
        g("span", np, w(r.title), 1),
        g("span", ap, w(F(tl)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, X2 = /* @__PURE__ */ Z(sp, [["__scopeId", "data-v-9191a6f0"]]);
function op(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Be(() => clearInterval(a)), n;
}
const da = I(Date.now() / 1e3);
let co = 0, vn = 0;
function Ul() {
  return vn || (da.value = Date.now() / 1e3, co = setInterval(() => da.value = Date.now() / 1e3, 1e3)), vn += 1, jo() && qo(() => {
    vn -= 1, vn || clearInterval(co);
  }), da;
}
const lp = 200, rp = Pl + Sn + jl + lp;
function jt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function ip(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: jt(e),
    top: jt(e.querySelector(".top")),
    title: jt(e.querySelector(".title")),
    contents: jt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var l, r, i, u;
      return `${((r = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : r.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: l, maxWidth: r, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: jt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function cp(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(ip(o, l, n.value)), performance.now() - l < rp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const up = ["title", "data-figure-mark", "data-folded", "data-open"], dp = {
  key: 2,
  class: "worker"
}, fp = { class: "head" }, hp = { key: 0 }, mp = {
  key: 3,
  class: "status"
}, pp = {
  key: 0,
  class: "figure"
}, gp = {
  key: 1,
  class: "ran-for"
}, vp = { key: 2 }, yp = {
  key: 3,
  class: "news"
}, wp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, bp = {
  key: 6,
  class: "settled"
}, kp = {
  key: 1,
  class: "bar"
}, xp = {
  key: 3,
  class: "detail body"
}, $p = {
  key: 0,
  class: "body-label"
}, Mp = ["title"], Sp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Hn(), a = ["onClick", "onAct"], s = R(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = R(() => t.open !== void 0), i = R(() => r.value || l.value), u = R(() => r.value ? t.open : o.value), d = R(() => r.value ? !t.open : l.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), m = R(() => i.value || f.value || !!n.onClick), v = I(null), y = I(null), { folded: O, phase: k } = ql(v, () => d.value);
    cp(v, d, k, $e(Se, null));
    function L(ie) {
      var ve, Te;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (r.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Te = n.onAct || n.onClick) == null || Te(ie);
      }
    }
    const z = (ie) => n.onAct(ie), ee = ["failed", "unfinished"], j = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), M = R(() => t.mark.color ? t.mark.color : j.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : j.value ? `var(--tone-${j.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), S = R(() => M.value || "var(--tone-work)"), B = R(() => !t.mark.ending && !t.mark.ended && j.value !== "stopped"), A = Ul(), x = R(
      () => t.mark.began_at && B.value && !t.mark.figure && !t.mark.counting ? N1(A.value - t.mark.began_at) : ""
    ), T = R(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${to(ve - ie, !0)}` : to(A.value - ie, !0) : x.value;
    }), b = ["bad", "danger", "warn"], p = R(() => b.includes(j.value) || t.mark.asks ? "attention" : B.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), _ = ["bad", "danger"], E = R(() => _.includes(j.value)), $ = R(() => p.value === "process" ? "running" : E.value ? "cross" : j.value === "stopped" ? "stopped" : j.value === "good" ? "tick" : ""), V = R(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || $.value || t.mark.settled || t.mark.news)
    ), J = R(() => [t.mark.title, t.mark.time ? Wl(t.mark.time) : ""].filter(Boolean).join(" · ")), Y = R(() => ({
      ...M.value ? { "--mark": M.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ve) => (c(), h("div", Ye(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        F(k),
        {
          open: u.value,
          folding: r.value && d.value,
          live: m.value,
          failed: E.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: M.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: Y.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": F(O) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: L
    }), [
      (c(), W(bt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: D(() => [
          e.mark.markIcon ? (c(), W(rt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), W(me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", dp, w(e.mark.worker), 1)) : C("", !0),
          g("span", fp, [
            N(st, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", hp, w(e.mark.name), 1)) : C("", !0),
            i.value ? (c(), W(Rt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          V.value ? (c(), h("span", mp, [
            e.mark.figure ? (c(), h("span", pp, w(e.mark.figure), 1)) : C("", !0),
            T.value ? (c(), h("span", gp, w(T.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", vp, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", yp, w(e.mark.news), 1)) : C("", !0),
            $.value === "running" ? (c(), h("span", wp)) : $.value ? (c(), W(rt, {
              key: 5,
              class: X(["sign", $.value]),
              name: $.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", bp, w(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), W(Dl, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: we(z, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && B.value ? (c(), h("span", kp, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: S.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !F(O) ? (c(), W(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !F(O) ? (c(), h("div", xp, [
        e.mark.bodyLabel ? (c(), h("p", $p, w(e.mark.bodyLabel), 1)) : C("", !0),
        N(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !F(O) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Mp)) : C("", !0),
      e.mark.card ? (c(), W(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ce(ie.$slots, "default", {
        shown: !F(O)
      }, void 0, !0)
    ], 16, up));
  }
}), zl = /* @__PURE__ */ Z(Sp, [["__scopeId", "data-v-2aa9c496"]]), _p = 60;
function Ep(e, t) {
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
    if (l || a.value <= 0 || d.scrollTop > _p) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await it(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const Ap = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Vl(e) {
  var n;
  const t = Ap[e] || ((n = Dt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Cp = (e) => Vl(String(e).split(":")[0]), Gl = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Op = { passed: "good", failed: "danger", warned: "warn", running: "" }, Tp = { good: "good", warn: "warn", danger: "danger" }, uo = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Wu(e.target_model, e.target_id || 0)
}, Bp = { "open row": (e) => Cp(e.target_model), "open page": () => Vl("pages") };
function Rp(e, t) {
  const n = t || {}, a = uo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Op[e.outcome] || "" : Tp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Bp[a](e) : "",
    handlers: a ? { onAct: () => uo[a](e) } : {}
  };
}
const Ip = 2e3;
function Lp(e, t, n = Ip) {
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
  Oe(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), kt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const Np = 24, Dp = 1e3, fo = 2e3, Pp = 0.25, jp = 5e3;
function qp(e, t = Np, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let l = 0, r = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const j = u();
    return j ? j.scrollHeight - j.scrollTop - j.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(j) {
    if (clearTimeout(l), !j) {
      o.value = !1, i = Date.now();
      return;
    }
    const M = Date.now() - i < fo ? fo : Dp;
    l = setTimeout(() => o.value = a.value, M);
  }
  function v() {
    clearTimeout(r), a.value = !1, s.value = 0, m(!1);
  }
  function y(j = !1) {
    const M = u();
    M && j && M.scrollTo ? M.scrollTo({ top: M.scrollHeight, behavior: "smooth" }) : M && (M.scrollTop = M.scrollHeight), v();
  }
  function O() {
    L(), !a.value && (a.value = !0, m(!0));
  }
  const k = () => !!u() && d() <= u().clientHeight * Pp;
  function L() {
    clearTimeout(r), k() && (r = setTimeout(() => a.value && k() && n() && y(!0), jp));
  }
  function z() {
    f() ? v() : O();
  }
  function ee(j = 1, M = !1) {
    a.value ? s.value += Math.max(0, j) : y(M);
  }
  return jo() && qo(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: y, left: O, scrolled: z, arrived: ee };
}
const Fp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Wp = (e) => String(e ?? "").replace(Fp, ""), Hp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = qp(s);
    he(
      () => n.lines.length,
      () => it(() => r()),
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
      ne(w(F(Wp)(e.lines.join(`
`)) || e.empty), 1),
      F(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => F(i)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, Up = /* @__PURE__ */ Z(Hp, [["__scopeId", "data-v-c2fb1783"]]), zp = 1e4;
class Vp {
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
    return this.heardAt !== null && t - this.heardAt > zp;
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
const Gp = {
  key: 0,
  class: "frame-note"
}, Kp = {
  key: 0,
  class: "frame-note"
}, Yp = ["src", "title"], Zp = 1e3, Jp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ct(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Oe(() => {
      l = new Vp(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Zp);
    }), Be(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", Gp, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      s.value ? (c(), h("div", Kp, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        N(ue, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: D(() => [...u[1] || (u[1] = [
            ne("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : C("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: F(n).window
      }, null, 8, Yp)
    ], 64));
  }
}, Xp = /* @__PURE__ */ Z(Jp, [["__scopeId", "data-v-32a49046"]]), yn = (e) => e ? e.split(", ") : [];
function Qp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function eg(e, t) {
  return {
    reads: yn(e.reads_allowed),
    runs: yn(e.runs_allowed),
    missing: [...yn(e.reads_missing), ...yn(e.runs_missing)],
    ask: t
  };
}
const tg = {
  class: "allowance-prompt",
  role: "dialog"
}, ng = { class: "allowance-prompt-text" }, ag = { class: "allowance-prompt-buttons" }, sg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", tg, [
      g("p", ng, w(F(Qp)(e.request)), 1),
      g("div", ag, [
        N(ue, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ne("Allow", -1)
          ])]),
          _: 1
        }),
        N(ue, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            ne("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, og = /* @__PURE__ */ Z(sg, [["__scopeId", "data-v-cad69fe2"]]), fa = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), W(Yt, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        ne(w(e.reason) + " ", 1),
        e.retry ? (c(), W(ue, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ne("Retry", -1)
          ])]),
          _: 1
        })) : C("", !0),
        e.removable ? (c(), W(ue, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            ne("Remove tab", -1)
          ])]),
          _: 1
        })) : C("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, lg = ["data-window", "data-agent"], rg = {
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
    const r = $e(bi, null), i = Pc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: $e(Tc, null),
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
    Kr(Se, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Oe(i.settle), Be(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Yr((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Wn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), W(og, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : C("", !0),
      e.unavailableReason ? (c(), W(fa, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), W(fa, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(K, { key: 4 }, [
        (c(), W(u, { key: o.value })),
        e.skeleton.length && !F(i).answered.value ? (c(), W(ms, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (c(), W(fa, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, lg));
  }
}, Ut = /* @__PURE__ */ Z(rg, [["__scopeId", "data-v-c4443e2b"]]), Kl = {
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
    const n = e, a = t, s = { render: () => Wn(Xp, { src: n.entry.entry_url }) };
    return (o, l) => (c(), W(Ut, {
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
}, ig = ["data-window"], Yl = {
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
    const n = e, a = t, s = ze(null), o = I("");
    return he(
      () => n.entry.entry_url,
      async (l) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              l
            )).default, zi();
          } catch (r) {
            if (Hi(r) && Ui(r)) return;
            o.value = `This window's file could not be loaded: ${r.message}`;
          }
      },
      { immediate: !0 }
    ), (l, r) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      N(ms, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, ig)) : (c(), W(Ut, {
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
}, cg = "*.*", ug = {
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
    const t = e, n = $e(Se, null), a = new Sc();
    he(
      () => a.patterns,
      (i, u, d) => {
        var m;
        const f = (m = n == null ? void 0 : n.subscriptions) == null ? void 0 : m.follow(`body of ${t.declaration.type}`, i, (v) => a.dispatch(v));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = R(() => !!(t.declaration.shipped || t.declaration.trusted)), r = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [cg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), W(Yl, {
      key: 0,
      entry: r.value,
      subscriptions: F(a),
      environment: F(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), W(Kl, {
      key: 1,
      entry: r.value,
      subscriptions: F(a),
      environment: F(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, dg = { class: "mark-more-inner" }, fg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, hg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, mg = {
  key: 3,
  class: "mark-lines"
}, pg = "process", ho = "task", gg = {
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
    const t = e, n = $e(Se), a = R(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = R(() => Gl.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === ho ? t.mark.target_id : 0), l = Ep(
      (v) => n.run(v),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), u = I(""), d = R(() => !t.declaration.body_url && t.mark.target_model === pg && !!t.mark.target_id);
    async function f(v = l.follow) {
      const y = await v();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = R(() => t.shown && d.value);
    return he(m, (v) => v && f()), Lp(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, y) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = we(() => {
      }, ["stop"]))
    }, [
      g("div", dg, [
        e.declaration.body_url ? (c(), W(ug, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head,
          foot: e.foot,
          actions: e.actions,
          time: e.time,
          folded: e.folded
        }, null, 8, ["declaration", "row", "head", "foot", "actions", "time", "folded"])) : (c(), h(K, { key: 1 }, [
          s.value ? (c(), h(K, { key: 0 }, [
            y[2] || (y[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", fg, w(s.value), 1)
          ], 64)) : C("", !0),
          d.value && u.value ? (c(), h("p", hg, w(u.value), 1)) : d.value && i.value ? (c(), h(K, { key: 2 }, [
            y[3] || (y[3] = g("p", { class: "mark-label" }, "Output", -1)),
            N(Up, {
              class: "mark-terminal",
              lines: F(r),
              onOlder: F(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", mg, w(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = we((O) => F(Pe)(`${ho}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Va = /* @__PURE__ */ Z(gg, [["__scopeId", "data-v-f4d037e5"]]), vg = ["title", "aria-label", "onClick"], yg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, wg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => pu(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = I(""), s = $e(Se);
    async function o(l) {
      const r = await an(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(K, null, [
      (c(!0), h(K, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: we((u) => o(i), ["stop"])
      }, [
        N(rt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, vg))), 128)),
      a.value ? (c(), h("span", yg, w(a.value), 1)) : C("", !0)
    ], 64));
  }
}, bg = /* @__PURE__ */ Z(wg, [["__scopeId", "data-v-7a62c88e"]]);
function Zl(e, t) {
  const n = ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Ce.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Jl = Zl("/api/marks", "marks"), Q2 = Jl.fetchAll, kg = Jl.find, xg = ["data-ref"], $g = ["data-ref"], Mg = { class: "mark-row" }, Sg = "dock add", _g = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = R(() => kg(a.mark.type)), o = R(() => Rp(a.mark, s.value)), l = R(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && Gl.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = R(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Sg));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": F(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(Va, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, xg)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": F(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Mg, [
          N(zl, Ye({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, Zr(o.value.handlers), { onClick: i }), Jr({ _: 2 }, [
            l.value ? {
              name: "default",
              fn: D(({ shown: y }) => [
                N(Va, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          N(bg, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, $g));
    };
  }
}, Eg = /* @__PURE__ */ Z(_g, [["__scopeId", "data-v-8196402d"]]), Ag = ["data-ref"], Cg = ["inert"], Og = { class: "group-fold" }, Tg = { class: "thread-group" }, Bg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await it(), (i = o.value) == null || i.offsetHeight, s.value = r;
    });
    const l = R(() => ({
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
      N(zl, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: X(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", Og, [
          g("div", Tg, [
            (c(!0), h(K, null, te(e.group.marks, (u) => (c(), W(Eg, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Cg)) : C("", !0)
    ], 8, Ag));
  }
}, e5 = /* @__PURE__ */ Z(Bg, [["__scopeId", "data-v-45b58b9b"]]);
function Rg(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Oe(() => n.observe(e.value)), kt(() => n.disconnect()), t;
}
const Ig = { class: "chat-dock-fold" }, Lg = ["aria-label"], Ng = { class: "chat-dock-head" }, Dg = { class: "chat-dock-inner" }, Pg = { class: "chat-dock-foot" }, Xl = 700, jg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = Rg(a), o = I(!1);
    let l = 0;
    return Oe(() => l = setTimeout(() => o.value = !0, Xl)), kt(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", Ig, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ce(r.$slots, "edge", {}, void 0, !0),
          g("header", Ng, [
            ce(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Dg, [
              g("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: fe(F(s) === null ? null : { height: `${F(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ce(r.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ce(r.$slots, "still", {}, void 0, !0),
          g("footer", Pg, [
            ce(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Lg)
      ])
    ], 2));
  }
}, Ql = /* @__PURE__ */ Z(jg, [["__scopeId", "data-v-74d44b19"]]), qg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ha = 5, Fg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ha, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ha}s`, animationDelay: `${(n - ha).toFixed(2)}s` };
    return (s, o) => (c(), h("span", qg, [
      g("i", { style: a })
    ]));
  }
}, er = /* @__PURE__ */ Z(Fg, [["__scopeId", "data-v-2a7bc150"]]), Wg = { reviewing: "Under review" }, Hg = (e, t) => e || Wg[t == null ? void 0 : t.state] || "", Ue = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Ug = {
  draft: [{ word: "ready", label: "Mark ready" }, Ue],
  ready: [Ue],
  approved: [{ word: "start", label: "Start", main: !0 }, Ue],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ue],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ue],
  completed: [],
  cancelled: []
}, zg = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ue],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ue],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ue],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ue],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Vg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Gg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Kg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Yg = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], Zg = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Jg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Xg(e, t) {
  const n = { plan: Ug, task: zg }[e], a = t != null && t.state ? Oc(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[nl(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Qg = (e, t) => e === "doc" || e === "report" ? Jg(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Kg(t), ...Gg(t)] : e === "check" ? Zg(t) : e === "question" ? Vg(t) : e === "memory" ? Yg(t) : Xg(e, t), tr = Zl("/api/docks", "docks"), t5 = tr.fetchAll, Ft = tr.find, e0 = 6, t0 = 3, ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Gn = (e) => Date.parse(e.leaves_at) / 1e3, pt = (e) => !!(e.leaves_at && !e.kept), n0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!pt(e) || t < Gn(e) || n.has(e.id)), a0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => n0(a, t, n)).sort((a, s) => a.id - s.id);
function s0(e, t, n = e0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Gn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const o0 = (e, t, n = e) => n < 2 ? !1 : e >= t0 ? !0 : t, l0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ga = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), r0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), i0 = (e) => ({ ...e.kept ? Ga("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ga("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), c0 = ["pins"], u0 = (e) => ({ ...e, iconOnly: c0.includes(e.icon) });
function d0(e, t) {
  var n;
  return [
    ...r0(e, t) ? [i0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Dt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Ga("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(u0);
}
function f0(e, t) {
  const n = d0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: l0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const h0 = ["title"], m0 = {
  key: 2,
  class: "dock-controls"
}, p0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, g0 = { class: "dock-facts" }, v0 = { key: 1 }, y0 = {
  key: 2,
  class: "dock-kept"
}, w0 = { class: "dock-acts" }, b0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = R(() => Ft(a.item.type)), o = Ul(), l = R(() => Fl(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), u = I(null), d = I(null), f = R(() => f0(a.item, s.value)), m = $e(Se), v = I(null);
    let y = 0;
    async function O() {
      var T, b;
      const S = ++y, B = Ht(a.item.target_model ?? ""), A = `${B} show`;
      if (!((b = (T = s.value) == null ? void 0 : T.reads) != null && b.includes(A))) return;
      const x = await at(a.item.type, [B, "show", String(a.item.target_id)], m.environment, m.signal);
      S === y && (v.value = x.ok ? { ...x.value, id: a.item.target_id, noun: B } : { id: a.item.target_id, noun: B });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (S, B, A) => {
        var b;
        const x = Ht(a.item.target_model ?? "");
        v.value = { id: a.item.target_id, noun: x }, O();
        const T = (b = m.subscriptions) == null ? void 0 : b.follow(`dock ${a.item.id}`, [`${x.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && O();
        });
        A(() => {
          y += 1, T == null || T();
        });
      },
      { immediate: !0 }
    );
    const k = I(/* @__PURE__ */ new Set()), L = I("");
    async function z(S) {
      if (S.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      S.action === "declared" && (k.value = /* @__PURE__ */ new Set([...k.value, S.label])), L.value = "";
      const A = await an(S, { id: a.item.target_id }, m.environment);
      (A == null ? void 0 : A.ok) === !1 && (k.value = new Set([...k.value].filter((x) => x !== S.label)), L.value = `Could not ${S.label.toLowerCase()}: ${A.error}`);
    }
    const ee = R(() => f.value.actions.filter((S) => S.action !== "undock" && !k.value.has(S.label))), j = R(() => {
      var S;
      return Hg((S = s.value) == null ? void 0 : S.badge, v.value);
    }), M = R(() => f.value.buttons.find((S) => S.action === "undock"));
    return (S, B) => {
      var A, x, T, b;
      return c(), W(Ql, {
        label: f.value.title + ((A = s.value) != null && A.needs_user ? ", waiting for you" : ""),
        type: (x = s.value) != null && x.needs_user ? "waiting" : "",
        folded: !!((T = s.value) != null && T.folds) && e.folded,
        body: !!((b = s.value) != null && b.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: B[3] || (B[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (c(), W(er, {
            key: 0,
            "ends-at": F(Gn)(e.item)
          }, null, 8, ["ends-at"])) : C("", !0)
        ]),
        head: D(() => {
          var p, _;
          return [
            (p = s.value) != null && p.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(K, { key: 1 }, [
              N(me, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, h0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", m0, [
              (c(!0), h(K, null, te(f.value.controls, (E) => {
                var $, V;
                return c(), h(K, {
                  key: E.action + E.runs
                }, [
                  !k.value.has(E.label) && (!(($ = E.variants) != null && $.length) || !((V = v.value) != null && V.state) || E.variants.includes(v.value.state)) ? (c(), W(ue, {
                    key: 0,
                    variant: "icon",
                    class: X({ kept: E.pressed }),
                    "aria-pressed": E.pressed,
                    "aria-label": E.label,
                    title: E.label,
                    "data-dock-action": E.action,
                    onClick: (J) => z(E)
                  }, {
                    default: D(() => [
                      N(me, {
                        name: E.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : C("", !0)
                ], 64);
              }), 128))
            ])) : C("", !0),
            g("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              e.collapsed || !((_ = s.value) != null && _.leaves_after_seconds) ? (c(), h(K, { key: 0 }, [
                ne(w(l.value), 1)
              ], 64)) : C("", !0)
            ], 512)
          ];
        }),
        still: D(() => [
          L.value || e.refusal ? (c(), h("p", p0, w(L.value || e.refusal), 1)) : C("", !0)
        ]),
        foot: D(() => {
          var p, _;
          return [
            g("span", g0, [
              j.value ? (c(), h("span", {
                key: 0,
                class: X(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(j.value), 3)) : C("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", v0, w(s.value.word), 1)) : C("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", y0, "Kept")) : C("", !0)
            ]),
            (_ = s.value) != null && _.folds ? (c(), W(ue, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: B[0] || (B[0] = (E) => n("fold"))
            }, {
              default: D(() => [
                ne(w(s.value.folds) + " ", 1),
                N(Rt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : C("", !0),
            g("span", w0, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              N(Cu, {
                name: `dock.${e.item.type}`,
                row: v.value,
                environment: F(m).environment,
                "read-only": F(m).readOnly,
                "object-name": F(Ht)(e.item.target_model),
                "external-failure": "",
                onFailure: B[1] || (B[1] = (E) => L.value = E),
                onDone: O
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(K, null, te(ee.value, (E) => (c(), W(ue, {
                key: E.action + E.runs,
                small: "",
                variant: E.primary ? "primary" : "ghost",
                bordered: !E.primary,
                "data-dock-action": E.action,
                onClick: ($) => z(E)
              }, {
                default: D(() => [
                  ne(w(E.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(ue, {
                small: "",
                bordered: "",
                title: M.value.label,
                "data-dock-action": "undock",
                onClick: B[2] || (B[2] = (E) => n("undock", M.value))
              }, {
                default: D(() => [...B[4] || (B[4] = [
                  ne("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: D(() => {
          var p;
          return [
            (p = s.value) != null && p.body_url ? (c(), W(Va, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: r.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : C("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "type", "folded", "body", "collapsed", "data-figure-closing"]);
    };
  }
}, mo = /* @__PURE__ */ Z(b0, [["__scopeId", "data-v-68ee4c3c"]]), k0 = ["title", "aria-label"], x0 = { class: "run-chip-in" }, $0 = {
  key: 0,
  class: "run-chip-ring"
}, M0 = { class: "run-chip-name" }, S0 = { class: "run-chip-bar" }, _0 = "processes.output", E0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = $e(Se, null), o = (s == null ? void 0 : s.environment) ?? "", l = I(null), r = R(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = R(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = R(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await at(_0, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Oe(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), kt(() => f == null ? void 0 : f()), (m, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": u.value })
      }, [
        F(pt)(e.item) ? (c(), W(er, {
          key: 0,
          "ends-at": F(Gn)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", x0, [
          r.value ? (c(), h("span", $0)) : (c(), W(rt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", M0, w(i.value), 1)
        ]),
        g("span", S0, [
          g("i", {
            style: fe({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, k0);
    };
  }
}, A0 = /* @__PURE__ */ Z(E0, [["__scopeId", "data-v-f864bc58"]]), C0 = 24, O0 = 8, n5 = 420;
function a5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= C0 ? !0 : e < t && s > O0 ? !1 : null;
}
const T0 = (e, t) => e === void 0 ? t : e, B0 = { me: 1, people: [] }, Ln = ss({
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
  people: B0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: On("journal.activity", !0),
  wide: !1,
  sideMini: On("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
vl("journal.activity", () => Ln.activity);
vl("journal.side.mini", () => Ln.sideMini);
const nr = "journal.viewer.";
function R0(e, t, n) {
  try {
    const a = n.getItem(nr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function I0(e, t, n) {
  try {
    n.setItem(nr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function po(e, t, n = window.localStorage) {
  const a = I(R0(e, t, n));
  return he(a, (s) => I0(e, s, n), { deep: !0 }), a;
}
const L0 = {
  key: "dock-all",
  class: "dock-all"
}, N0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, D0 = { class: "dock-runs-title" }, P0 = { class: "dock-runs-chips" }, j0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var b, p;
    const t = e, n = op(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = $e(Se), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(_, E) {
      i.value = { ...i.value, [_.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, _.id]);
      const $ = await an(E, { id: _.target_id }, l.environment);
      ($ == null ? void 0 : $.ok) === !1 && (r.value = new Set([...r.value].filter((V) => V !== _.id)), i.value = { ...i.value, [_.id]: `Could not close this card: ${$.error}` });
    }
    const d = R(
      () => a0(
        t.items.filter((_) => !r.value.has(_.id)),
        n.value,
        a.value
      )
    ), f = R(
      () => s0(
        d.value.filter((_) => ma(_, Ft)),
        n.value
      )
    ), m = R(() => d.value.filter((_) => !f.value.includes(_) && !ma(_, Ft))), v = R(() => f.value.filter((_) => !pt(_))), y = po(`dock-size:${((b = Ln.identity) == null ? void 0 : b.root) || location.host}`, null), O = (_) => y.value ? y.value.collapsed && !y.value.opened.includes(_.id) : t.collapsed, k = R(() => d.value.some(O)), L = R(() => (s.value = o0(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(O));
    function z() {
      y.value = { collapsed: !k.value, opened: [] };
    }
    function ee(_) {
      var $;
      if (!O(_)) return;
      const E = ($ = y.value) != null && $.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...E, _.id] };
    }
    const j = po(`dock-folded:${((p = Ln.identity) == null ? void 0 : p.root) || location.host}`, {}), M = (_) => {
      var E;
      return !!((E = Ft(_.type)) != null && E.folds) && T0(j.value[_.id], ma(_, Ft) || t.folded);
    };
    function S(_) {
      j.value = { ...j.value, [_.id]: !M(_) };
    }
    function B(_) {
      j.value = { ...j.value, ...Object.fromEntries(f.value.map((E) => [E.id, E.id !== _.id])) }, o.value = !0;
    }
    function A() {
      j.value = Object.fromEntries(Object.entries(j.value).filter(([_]) => !f.value.some((E) => String(E.id) === _))), o.value = !1;
    }
    function x(_) {
      a.value = /* @__PURE__ */ new Set([...a.value, _.id]);
    }
    function T(_) {
      a.value = new Set([...a.value].filter((E) => E !== _.id));
    }
    return (_, E) => (c(), W(Po, {
      tag: "div",
      name: "dock",
      duration: F(Xl),
      class: "dock-stack"
    }, {
      default: D(() => [
        d.value.length > 1 ? (c(), h("div", L0, [
          N(ue, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: z
          }, {
            default: D(() => [
              ne(w(k.value ? "Open all" : "Collapse all"), 1)
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(K, null, te(m.value, ($) => (c(), W(mo, {
          key: $.id,
          item: $,
          class: X({ timed: F(pt)($) }),
          leaving: F(pt)($) && !a.value.has($.id),
          folded: M($),
          collapsed: O($),
          refusal: i.value[$.id],
          onOpen: (V) => ee($),
          onFold: (V) => S($),
          onUndock: (V) => u($, V),
          onMouseenter: (V) => x($),
          onMouseleave: (V) => T($)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !k.value ? (c(), h("div", N0, [
          g("span", null, w(f.value.length) + " runs", 1),
          N(ue, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: A
          }, {
            default: D(() => [
              E[1] || (E[1] = ne(" Runs ", -1)),
              N(Rt, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(K, null, te(L.value ? [] : f.value, ($) => (c(), W(mo, {
          key: $.id,
          item: $,
          class: X({ timed: F(pt)($) }),
          leaving: F(pt)($) && !a.value.has($.id),
          folded: M($),
          collapsed: O($),
          refusal: i.value[$.id],
          onOpen: (V) => ee($),
          onFold: (V) => S($),
          onUndock: (V) => u($, V),
          onMouseenter: (V) => x($),
          onMouseleave: (V) => T($)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        L.value ? (c(), W(Ql, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: D(() => [
            N(me, {
              name: "runs",
              size: 14
            }),
            g("span", D0, w(f.value.length) + " runs", 1)
          ]),
          foot: D(() => [
            g("span", P0, [
              (c(!0), h(K, null, te(f.value, ($) => (c(), W(A0, {
                key: $.id,
                item: $,
                onClick: (V) => B($)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(ue, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: E[0] || (E[0] = ($) => o.value = !0)
            }, {
              default: D(() => [
                E[2] || (E[2] = ne(" Runs ", -1)),
                N(Rt)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : C("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, s5 = /* @__PURE__ */ Z(j0, [["__scopeId", "data-v-25882fa9"]]), gt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, _n = (e) => Math.min(Math.max(e, 0), 1), q0 = (e) => {
  const t = _n(e);
  return t * t * (3 - 2 * t);
}, dt = (e, t, n) => q0((e - t) / (n - t));
function o5(e) {
  const t = _n(e), n = _n((t - 0.12) / 0.76) * gt.shuffles, a = Math.min(Math.floor(n), gt.shuffles - 1), s = n - a, o = dt(s, 0.26, 0.38) * (1 - dt(s, 0.76, 0.96)), l = dt(s, 0.38, 0.76), r = dt(t, 0, 0.12) * (1 - dt(t, 0.88, 1)), i = dt(s, 0.2, 0.34) * (1 - dt(s, 0.84, 1)), u = Math.sin(Math.PI * _n((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / gt.shuffles, lift: gt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function l5(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const go = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, r5 = (e) => go[e] ?? go.butler, ps = 2400, F0 = 0.05;
function W0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, F0), l = Math.min(t + ps * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function i5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function H0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function c5(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const u5 = (e, t) => ({ ...e, stretch: t.stretch }), d5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, ar = (e, t) => t >= (e.least ?? 0);
function f5(e, t, n) {
  if (!ar(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const h5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), U0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", vo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), z0 = (e) => e.right > e.left && e.bottom > e.top;
function m5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(U0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = vo(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = vo(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), z0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function sr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let l = 0, r = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (r = -1);
      else {
        const y = (o[f] - e[d]) / v, O = (o[m] - e[d]) / v;
        l = Math.max(l, Math.min(y, O)), r = Math.min(r, Math.max(y, O));
      }
    }
    if (l > r || a && l >= a.share) continue;
    const i = e.x + (t.x - e.x) * l, u = e.y + (t.y - e.y) * l;
    a = { share: l, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
  }
  return a;
}
const xe = {
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
}, Jt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), V0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => V0(Jt(e, t, n)), G0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ot = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, wn = ([e, t], n) => e + n() * (t - e);
function K0(e) {
  return G0.map(() => {
    const t = wn(ot.speed, e), n = wn(ot.angle, e) * Math.PI / 180, a = wn(ot.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [wn(ot.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Y0 = K0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Z0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ot.gravity * (t[2] - ot.floor))) / ot.gravity;
}
function p5(e, t, n = Y0) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Z0(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= ot.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const g5 = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function v5(e, t) {
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
const y5 = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), Bt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function w5(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [l, r] = [t.left + Bt.margin * n, t.right - Bt.margin * n], i = Math.min(Math.max(e + o + s * Bt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function b5(e, t, n) {
  const a = xe.bug_smash, s = Me(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Bt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Bt.tall * n * (1 - Me(t, a.emerge)),
      turn: 90 * (1 - Me(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Me(t, a.gone)
    }
  };
}
function k5(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Bt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = W0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ae = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function x5(e) {
  const t = Ae.least + Math.floor(e() * (Ae.most - Ae.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ae.walls[Math.floor(e() * Ae.walls.length)],
    along: Ae.margin + e() * (1 - 2 * Ae.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ka(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ae.margin, l = ((e.along - Ae.margin + e.way * Ae.speed * n / a) / s % 2 + 2) % 2, r = Ae.margin + s * (l <= 1 ? l : 2 - l);
  return e.wall === "top" ? { x: t.left + r * a, y: t.top + Ae.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ae.inset : t.right - Ae.inset, y: t.top + r * a, turn: e.wall === "left" ? 90 : -90 };
}
function J0(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = H0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function $5(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: l, bug: r, shot: i } = J0(n, e.length), u = e.map((L, z) => ({ ...Ka(L, t, Math.min(n / o.fps, En(z).shot)), shot: z < i })), d = Me(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], v = e.map((L, z) => ({ bug: L, index: z, seconds: n / o.fps - En(z).shot, spot: Ka(L, t, En(z).shot) })).filter((L) => L.seconds >= 0), y = v.flatMap((L) => {
    const z = (s == null ? void 0 : s.get(L.index)) ?? nv(L.bug, t, L.spot, s ? [] : a);
    return s == null || s.set(L.index, z), s && av(z, L.seconds, a), sv(z, L.seconds, a);
  }), O = v.filter((L) => ev(L.bug)).map((L) => ({ seconds: L.seconds, from: L.spot })), k = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: k }, slush: y, camera: O };
}
function En(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function M5(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = En(d), m = Ka(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), O = Math.abs(m.x - i) >= v ? i : m.x + y * v, k = y > 0 ? Math.max(i, Math.min(O, r)) : Math.min(i, Math.max(O, l)), L = { from: i, to: k, begin: f.walk, end: f.aim };
    return i = k, L;
  });
}
function S5(e, t, n) {
  var o;
  const a = xe.bug_shot.back.stride * n;
  let s = 0;
  for (const l of e) {
    if (t <= l.begin) return { x: l.from, steps: s / a, way: 0 };
    if (t < l.end) {
      const r = l.from + (l.to - l.from) * Me(t, [l.begin, l.end]);
      return { x: r, steps: (s + Math.abs(r - l.from)) / a, way: Math.sign(l.to - l.from) };
    }
    s += Math.abs(l.to - l.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: s / a, way: 0 };
}
const be = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, X0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Q0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const ev = (e) => e.along * 97 % 1 < be.camera, Xt = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * be.gravity * t * t });
function tv(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * be.gravity * (t.bottom - e.from.y))) / be.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * be.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / be.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += be.step) {
    const d = Math.min(u + be.step, l.t), f = Xt(e, d), m = sr(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = Xt(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function nv(e, t, n, a = []) {
  const s = Q0(e.along + 1), [o, l] = X0[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: be.count }, () => {
    const i = r + (s() - 0.5) * 2 * (be.spread * Math.PI / 180), u = be.speed[0] + s() * (be.speed[1] - be.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: be.radius[0] + s() * (be.radius[1] - be.radius[0]) };
    return { ...d, ...tv(d, t, a) };
  });
}
function av(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += be.step) {
      const l = Math.min(o + be.step, s), r = sr(Xt(a, o), Xt(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function sv(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...Xt(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - be.hold) / be.fade, 0), 1);
    if (o <= 0) return [];
    const l = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !l) return [];
    const r = l ? l.left + a.dx : a.x, i = l ? l.top + a.dy : a.y, u = l ? Math.min(s * s * 12, 48, Math.max(0, l.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: r, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...l ? { clip: l.clip ?? l } : {} }];
  });
}
function _5(e, t, n, a) {
  const { fly: s, drops: o, lens: l, frames: r, fps: i } = xe.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * r / i, d = (o[1] - o[0]) * r / i, f = Me(e, [0, u]), m = Me(e, [u, u + d]);
  return l.map((v) => {
    const y = { x: a.x + v.at[0] * t, y: a.y + v.at[1] * t };
    return {
      x: n.x + (y.x - n.x) * f,
      y: n.y + (y.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function E5(e, t, n, a, s) {
  const { sway: o, above: l } = xe.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (O) => {
    const [k, L] = [O.x - e.at.x, O.y - e.at.y];
    return { x: r.x + k * u - L * d, y: r.y + k * d + L * u };
  }, [m, v] = [...n].sort((O, k) => O.x - k.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((O, k) => ({ from: O, to: k < y.length / 2 ? m : v })) };
}
const A5 = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function Nn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Jt(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Jt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function C5(e, t) {
  const n = xe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Nn(n, t), l = 1 - (1 - n.small) * Me(a, n.shrinks) * (1 - Me(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: l, y: l };
  }
  if (e === "press") {
    const { into: a, out: s } = Nn(n, t), o = n.flat * Me(a, n.squashes) * (1 - Me(s, n.frees)), l = 0.14 * Math.sin(2 * Math.PI * Jt(s, ...n.springs)) * (1 - Jt(s, ...n.springs));
    return { x: 1 + 0.5 * o - l / 2, y: 1 - o + l };
  }
  return null;
}
const O5 = (e) => e === "pack_box";
function T5(e) {
  const { into: t, out: n } = Nn(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function B5(e) {
  const t = xe.rope_swing, { into: n, out: a } = Nn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const ov = { after: 3 }, gs = 10, lv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, rv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, iv = { weight: 19 }, or = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, cv = { every: 120 }, lr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, rr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, uv = {
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
}, on = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: gs }), ae = (e, t, n = {}) => on(e, "clip", t, n), pa = (e, t, n = {}) => on(e, "look", t, n), yo = (e, t, n = {}) => on(e, "gaze", t, n), de = (e, t, n = {}, a = {}) => ({ ...on(e, "pick", t, n), ...a }), ge = (e) => on("nothing", "nothing", e, {}), dv = 120, fv = 300, ga = (e, t) => ({ ...ae(e, t), cooldown: fv }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), hv = () => [ae("joy", 2)], ft = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), ht = (e) => ({ ...e, cooldown: lv[e.name] }), qt = (e) => ({ ...e, shenanigan: !0, lasts: rv[e.name] }), Kn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...ht(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...ht(ae("bug_smash", 2)), toward: "", onto: !1 },
    ae("nod", 2)
  ]),
  ...le("tests_failed", { cooldown: 20, toward: "card" }, [ae("startled", 2), ae("dismay", 1), ae("tantrum", 3), ge(1)]),
  ...le("committed", { cooldown: 30, toward: "card", onto: !0 }, [ae("nod", 2), ge(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...le("sin_fixed", { cooldown: 300 }, [ae("halo", 1), ge(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...le("sin_committed", { cooldown: 300 }, [ae("repent", 1), ge(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...le("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ae("nod", 4), ae("hand_rub", 4), ge(7)]),
  ...le("question_asked", { cooldown: 60 }, [ae("ask_sign", 9), ae("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...le("reported", { cooldown: 90 }, [yo("read", 3), ae("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [yo("read", 3), ge(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), ge(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, hv()),
  ...le("bar_failed", { holds: !0 }, [ae("fume", 1), ae("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...le("standing", { cooldown: 12 }, [ae("look_left", 2), ae("look_right", 2), ae("look_up", 1), ge(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...le("launched", { cooldown: 300 }, [ae("tumble", 3), ge(47)]),
  // a break from the hammering now and then
  ...le("building", { cooldown: 30 }, [ae("wipe_brow", 4), ae("look_left", 1), ae("look_right", 1), ge(69)]),
  ...le("failed", { cooldown: 20, toward: "card" }, [ae("shake", 3), ae("tantrum", 2), ge(2)]),
  ...le("refused", { cooldown: 20 }, [ae("shake", 1), ge(1)]),
  ...le("work_done", { cooldown: 120 }, [ae("stretch", 2), ge(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...le("pondering", { cooldown: [30, 60] }, [de("ponder", 1)]),
  ...le("thought_cloud", { cooldown: 90 }, [de("cloud", 1)]),
  ...le("light_bulb", { cooldown: 150 }, [de("bulb", 1)]),
  ...le("answered", { cooldown: 15 }, [pa("amused", 3), ge(2)]),
  ...le("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...le("long_walk", { cooldown: 90 }, [ae("stumble", 3), ge(22)]),
  ...le("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), ge(13)]),
  ...le("typing", { cooldown: 60 }, [pa("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(uv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [pa(t, 1)])),
  ...Object.entries(lr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(rr).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
    ft("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    ft("rest", 3, 180, 120),
    ft("yawn", 2, 60, 60),
    ft("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    ft("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    ft("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    ft("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...qt(ht(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    qt(ht(ae("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: dv }, [ga("search", 3), { ...ga("binoculars", 2), when: { home: !0 } }, { ...ga("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...le("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...ht(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ae("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [qt(ht(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: or.build.cooldown }, [de("unit", iv.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: cv.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...le("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...le("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    qt(de("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    de("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    de("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    de("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    de("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    de("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    qt(ht(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...le("laptop", {}, [de("seat", 6, {}, { stay: [60, 150] }), de("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...le("ledge_at", {}, [de("middle", 2, {}, { along: 1 / 2 }), de("third", 1, {}, { along: 1 / 3 }), de("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...le("composed_as", {}, [
    de("facing", 4, {}, { turn: 0, leans: 0 }),
    de("turned_left", 1, {}, { turn: 335, leans: 0 }),
    de("turned_right", 1, {}, { turn: 25, leans: 0 }),
    de("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    de("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], ir = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), cr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), mv = (e) => Array.isArray(e) ? e[0] : e, pv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, gv = (e) => Kn.some((t) => t.when.moment === e);
function vv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || cr(d).every(([f, m]) => n(f) >= mv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Kn.filter((d) => ir(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= ov.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function je(e, t) {
  const n = vv(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (ur(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function ur(e, t, n) {
  var a;
  for (const [s, o] of cr(t)) (a = e.memory) == null || a.set(s, e.now + pv(o, n));
}
function R5(e, t, n) {
  ur(e, Kn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const I5 = (e) => Object.values(or).find((t) => ir(t.when, e)) ?? null, yv = (e, t, n) => n - t <= (e.lifetime ?? gs), L5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || ar(e.clip, t));
class dr {
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
const Ya = {
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
}, N5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), fr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), D5 = {
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
}, P5 = 120, wv = 20, j5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < wv), bv = (e) => Ya[e] || Ya.idle, q5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, hr = "airborne", kv = "landing", xv = "travelling", mr = "grounded", F5 = ({ airborne: e, landing: t, trip: n }) => e ? hr : t ? kv : n != null && n.started ? xv : mr;
function W5(e, t) {
  var s;
  const n = $v(e, t);
  return e.mode === mr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function $v(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === hr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Mv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : bv(u), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function Mv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Za = (e) => e.outcome, Sv = "plugin:code-commandments:sins:", wo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Sv), _v = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => wo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => wo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], H5 = (e, t) => e.filter((n) => n.author === "user" && Rn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Rn(n.read_at), card: Bl(n) })).sort((n, a) => n.time - a.time), bo = { user: "reacted", agent: "agent_reacted" };
function U5(e, t) {
  return e.filter((n) => bo[n.author] && wt(n) > t).map((n) => ({ beat: `${bo[n.author]}:${n.emoji}`, time: wt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Ev = [.../* @__PURE__ */ new Set([...Object.values(lr).flatMap((e) => Object.keys(e)), ...Object.keys(rr)])];
function z5(e, t) {
  return e.filter((n) => n.author === "agent" && wt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Ev.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: wt(n), card: Bl(n) })).sort((n, a) => n.time - a.time);
}
const Av = (e) => new dr(e).isTest(), Dn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Za(e)] || "";
}, Cv = 1800, Ov = (e, t) => {
  if (Dn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Dn(n) !== "finished" && Number(e.time) - Number(n.time) <= Cv ? "tests_fixed" : "tests_passed";
};
function V5(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Av), s = a.filter((r) => Dn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Dn(r))), o.map((r) => ({ beat: Ov(r, s), time: Number(r.time), card: r.key }));
}
function G5(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Za(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Za(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const K5 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: wt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function Y5(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function Z5(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function J5(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = _v.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function vs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ko = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Tv(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    vs(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function X5(e, t, n, a = {}) {
  const s = je({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : gv(`held:${e}`) ? "idle" : e;
}
const Ee = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function Q5(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ee.ahead * n ? 180 : Math.sign(a) * Ee.turn;
}
const xo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function e4(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ee.sweep) % s, r = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = xo((r - i) / Ee.returnSeconds), d = r <= i ? xo(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const $o = 3, pr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Mo = 12, t4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function n4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!pr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= $o ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * Mo) / Mo, lasts: $o } };
}
const a4 = (e) => e.posture === "hang" && !pr(e.face), Bv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Rv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function s4(e, t, n) {
  return Bv.has(e) ? 1 / 0 : !Rv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(gr(n - t.began, t.share) - Ve.lead, 0);
}
const Iv = 5;
function o4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Iv ? { beat: "long_walk", time: n } : null };
}
const Lv = 30, bn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function l4(e, t, n, a, s = null) {
  if (t && n < t.until || !bn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = je({ moment: "spell", state: e, tally: s }, a), [l, r] = bn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + bn.every } : { state: e, began: 0, until: 0, next: n + bn.every };
}
const r4 = (e, t, n) => t && n < t.until && fr.has(e.state) ? { state: t.state, since: t.began } : e, Ve = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, gr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function i4(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = gr(o, e.share);
  return s ? { eager: Nv(t, l), moment: null } : l > Ve.lead ? { eager: t, moment: null } : l < Ve.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ve.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ve.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = je({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Nv(e, t) {
  return e.on && t > Ve.lead + Ve.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ve.lead && t >= Ve.least ? { ...e, on: !0, calm: !1 } : e;
}
const Dv = 1, Pv = { look: "look", gaze: "gaze" };
function jv(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = je({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Pv[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const qv = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => je({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), Fv = (e, t, n, a, s, o = 0) => je({ moment: "jump", high: e > Dv * t, memory: a, now: s, room: o }, n).name === "backflip", Wv = { work: ["building"], idle: ["standing"] };
function c4(e, t, n, a) {
  const s = Ya[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Wv[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), fr.has(e) ? { moments: o, began: n || a } : (n && a - n >= Lv && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Hv(e, t, n) {
  return !je({ moment: "pondering", memory: e, now: t }, n) || !je({ moment: "thought_cloud", memory: e, now: t }, n) ? null : je({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const So = { pondering: Hv };
function u4(e, t, n, a, s, o) {
  if (So[e.beat]) {
    const r = So[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = jv(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== gs && { lifetime: l.lifetime } } } : null;
}
function d4(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = qv(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const f4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function h4(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function m4(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const p4 = (e, t) => !!(e != null && e.watches) && !t.once, g4 = 10, v4 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || yv(a, a.queuedAt, n)), y4 = (e, t) => t ? null : e[0] ?? null;
function w4(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const b4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Uv = 2 * Math.PI, zv = 500;
function k4(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / zv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Uv * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, O = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Gv(v, t, n, m, s) : Yv(v, t, n, m) : t) ?? v, k = O != null && O.behind && O.mood === "reading" ? Vv(e.point, O, n, l, s) : O;
  return { point: k ?? null, toward: k ? { x: k.x - n.x, y: k.y - n.y } : null, amount: f, at: a };
}
function Vv(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, l = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : d, y = v + l(u - v), O = Math.min(Math.max(a / 1e3, 0), 0.1), k = Ee.turnSpeed * O, L = f ? v + Math.min(Math.max(y - v, -k), k) : y, z = f ? e.readingFollow + m : L, ee = z + (L - z) * (1 - Math.exp(-O / Ee.followSeconds)), j = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, M = o(vs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), S = Math.min(Math.max(M, -j.up), j.down), B = Ee.tipSpeed * O, A = f ? e.readingPitch + Math.min(Math.max(S - e.readingPitch, -B), B) : S;
  return { ...t, readingYaw: L, readingFollow: ee, readingPitch: A, readingFacing: r };
}
function Gv(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (z) => {
    const { yaw: ee, pitch: j } = vs(z.x - n.x, s, n.y - z.y, o);
    return { yaw: ee, pitch: Math.min(Math.max(j, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [ko(r(e)), ko(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, O, k] = i.map((z, ee) => m * z + v * u[ee]), L = s * y / O;
  return { ...t, x: n.x + L, y: n.y - Tv(L, s, -Math.asin(Math.min(Math.max(k, -1), 1)), o) };
}
const Kv = 0.15;
function x4(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Kv;
}
function Yv(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Zv = (e) => !(e != null && e.on);
function $4(e, t, n) {
  if (Zv(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const Qt = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, He = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, va = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), _o = (e) => e * e * (3 - 2 * e);
function Jv(e) {
  if (e < 0 || e >= He.seconds) return null;
  const t = va(e, ...He.flicker), n = Math.floor(t * He.flickers * 2) % 2 === 0, a = e < He.flicker[1] ? n ? 0.35 + 0.5 * t : He.dim : 1;
  return { strength: 1 - _o(va(e, ...He.fade)), lit: a, white: e < He.flash[0] ? 0 : 1 - _o(va(e, ...He.flash)) };
}
const M4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function S4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Jv(t - e.at);
  return a && { colour: Qt.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: He.signs[e.tone], ...a } };
}
function _4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function E4(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= Qt.looks || a === null && n - e.since >= Qt.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function A4(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const nt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, C4 = { behind: 39, figure: 40, ahead: 41 }, Xv = "[data-figure-pile]", Qv = { amber: [1, 0.69, 0.125], good: Qt.colours.good, bad: Qt.colours.bad }, An = { phases: 4, ms: 230, dim: 0.25 }, O4 = (e, t, n) => e !== "amber" || (t + n) % An.phases < An.phases / 2 ? 1 : An.dim, T4 = (e) => e === "amber" ? An.phases : 1;
function B4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const R4 = Object.keys(Qv), qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Wt = ([e, t], n) => e + n() * (t - e);
function I4(e) {
  const t = qe.least + Math.floor(e() * (qe.most - qe.least + 1));
  return Array.from({ length: Math.min(t, qe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * qe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Wt(qe.start, e), l = Wt(qe.reach, e);
    return {
      text: je({ moment: "digit" }, e).name,
      x: a * o,
      y: qe.middle + s * o,
      dx: a * l,
      dy: s * l,
      moveMs: Math.round(Wt(qe.moveMs, e)),
      fadeMs: Math.round(Wt(qe.fadeMs, e))
    };
  });
}
const ya = { high: 3, gap: 1 };
function L4(e) {
  const t = Math.floor(e / ya.high);
  return { left: -(nt.inside + nt.width / 2 + t * (nt.width + ya.gap)), up: e % ya.high * (nt.height - nt.top) };
}
const ey = (e, t, n) => je({ moment: "unit", memory: e, now: t }, n) !== null, ty = { after: 5 }, ny = (e) => e.filter((t) => t.active && (t.process || t.watch) && new dr(t).isBuild());
function N4(e, t, n) {
  const a = ny(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= ty.after ? s : null;
}
function D4(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: ey(n, a, s) } : null;
}
const Eo = { ahead: 140, up: 70 };
function P4(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Eo.ahead, y: a - Eo.up } } : o ? { at: { x: n(o), y: a - o.up - nt.height } } : t ? { at: null } : null;
}
const wa = { least: 4e3, most: 1e4 }, ay = (e) => wa.least + e() * (wa.most - wa.least), mt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function j4(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = ay(t);
    if (n.length >= mt.most || t() >= mt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (mt.at[0] + t() * (mt.at[1] - mt.at[0]));
    n.push({ from: o, to: o + mt.ms }), a = o + mt.ms;
  }
}
const q4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), F4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), vr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), W4 = new Set(Kn.filter((e) => vr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), sy = (e) => e.some((t) => t.state === "built"), H4 = (e, t) => sy(t) ? e.filter((n) => !vr.has(n.beat)) : e, lt = { reach: 40, room: 6 }, oy = (e, t) => t <= e - lt.reach + 2, U4 = (e, t, n) => oy(e, n) ? t - lt.reach : e - lt.reach - lt.room, z4 = (e, t, n, a) => a > 0 && t < e && t + lt.reach >= e - 2 ? Math.min(n, Math.max(e, t + lt.reach)) : e, ba = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, V4 = (e) => Wt(e() < ba.longShare ? ba.long : ba.short, e), ly = 2 * nt.width;
function G4(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= ly ? o : e + (o - e + s / 2) % s;
}
const ry = 60, K4 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= ry, Ao = "[data-figure-home]", ln = () => {
  var t;
  const e = document.querySelector(Ao);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ao)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, iy = "[data-figure-docked-bars]", cy = "[data-figure-chat-foot]", uy = [0.85, 0.6, 0.35, 0.15], dy = ["question", "waiting", "suggestion"], Y4 = (e, t) => dy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Z4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const fy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", hy = "[data-figure-newest]";
function yr() {
  var a, s;
  const e = (a = ln()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(hy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ys(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function en(e, t, n = yr()) {
  if (!e || !n) return !0;
  const a = Je(e, t), s = Zn(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, l = gt.gap;
  return !Yn(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function J4(e, t, n, a = yr()) {
  if (!a || en(t, e, a)) return null;
  const s = Zn(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = Mt(), i = t.posture === "stand" ? bs * e.size : _r * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - gt.gap - l, a.right + gt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && en(m, e, a) && Wy(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const ka = 0.26, wr = 0.54, my = 1.25 / 5.4, rn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ka, travels: "stand" },
  lounge: { drop: ka, travels: "stand" },
  composed: { drop: ka, travels: "stand" },
  hang: { drop: wr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, X4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * my * Math.cos(t * Math.PI / 180),
  y: 1 - n - wr
}), zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), py = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Q4 = (e, t) => (e === "sit" ? py.has(t) : zt.has(e)) ? e : "stand";
function ex(e, t) {
  return e.facing === t.facing || !zt.has(e.posture) && !zt.has(t.posture) ? t : { posture: "stand", facing: zt.has(e.posture) ? e.facing : t.facing };
}
const tx = 0.25, nx = (e, t) => zt.has(e) && rn[t].drop === 0, br = 2, gy = 90, vy = 180, yy = 140, wy = 280, by = 420, ky = 0.25, xy = 290, $y = 600, My = "cubic-bezier(0.2, 0.7, 0.4, 1)", Sy = "cubic-bezier(0.55, 0, 0.9, 0.6)", xa = 5;
function Pn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < xa) return null;
  (l || r) && (o = Math.max(o, br));
  const v = o > 1, y = Math.abs(t.x - e.x), O = y < xa ? 0 : y / (gy * o) * 1e3, k = Math.min(O, v ? yy : vy), L = Math.abs(t.y - e.y), z = t.y < e.y, ee = z && !m && Fv(L, n, i, u, d, f), j = z ? by + Math.min(L, 400) * ky : Math.sqrt(2 * L / ps) * 1e3, M = {
    x: t.x,
    y: t.y,
    ms: L > xa ? ee ? $y : j : 0,
    lead: ee ? xy : z ? wy : 0,
    easing: z ? My : Sy,
    hopping: !0,
    clip: ee ? "backflip" : z ? "jump" : "fall"
  }, S = { x: t.x, y: t.y, ms: O + k, lead: 0, easing: "linear", ramp: k, ...v ? { clip: "run" } : {} }, B = m ? _y(t, n) : M, A = z && !a ? [{ ...S, y: e.y }, B] : [{ ...M, x: e.x }, S];
  return { way: Math.sign(t.x - e.x) || 1, legs: A, lands: !s, pace: o, running: v };
}
const _y = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Ey = (e, t) => e.postures.includes(t) ? t : e.postures[0], ax = (e, t, n) => e.posture === "walk" && n ? "walk" : Ey(e.clip, t), Je = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - rn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Yn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ys = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Mt() {
  var t;
  const e = (t = ln()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const kn = 0.5, Co = 20;
function sx(e, t, n = Mt()) {
  const a = Je(e, t);
  return a.left >= n.left + Co && a.right <= n.right - Co;
}
function ws(e, t, n = Mt()) {
  const a = Je(e, t), s = a.right - a.left, o = Zn(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - kn && r <= n.right + kn && a.top >= n.top - kn && i <= n.bottom + kn;
}
const jn = [0.35, 0.5, 0.65], qn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: jn[0], right: jn.at(-1), top: qn[0], bottom: qn.at(-1) }, Ay = 0.24;
function Zn(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ay * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function Cy(e, { size: t }, n = Mt()) {
  const a = Zn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const bs = (_e.right - _e.left) / 2 + 0.08;
function ox(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - rn[e].drop) };
}
const Oy = "[data-figure-agent]";
function kr(e, t, n = "", a = "") {
  var r;
  const s = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ys(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, l = Math.min(s.startOffset, o.length - 1);
  for (const i of [l - 1, l].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const xr = (e) => qn.flatMap(
  (t) => jn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ks(e, t, n = "") {
  if (!en(e, t)) return jn.length * qn.length;
  const a = Je(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(fy)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && Yn(s, i) && ys(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return xr(s).filter(([r, i]) => l(r, i) || kr(r, i, n)).length;
}
function Ty(e, t) {
  const n = Je(e, t);
  return xr({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => kr(a, s, "", Oy)).length;
}
const Oo = 4;
function lx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Oo; o <= s; o += Oo)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Ty(r, e) && en(r, e)) return r;
    }
  return null;
}
function tn(e, t, n) {
  const a = Mt(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ws(l, t, a) && en(l, t)).map((l) => ({ spot: l, covered: ks(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const $r = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), By = [0.5, 0.25, 0.75], Ry = (e) => $r(e.getBoundingClientRect(), By), Mr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Iy = bs, Ly = (e, t, { size: n }, a = Iy) => Sr(e, Mr[t], a * n, "stand");
function Sr(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Ny = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, _r = 0.1, Dy = (e, t, { size: n }) => Sr(e, Ny[t], _r * n, "sit"), Py = (e) => ((e + 180) % 360 + 360) % 360 - 180, $a = 60;
function rx(e, t) {
  const n = Py(t);
  return !e.aside || Math.abs(n) >= $a ? t : n < 0 ? 360 - $a : $a;
}
const Vt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, jy = (e) => [.../* @__PURE__ */ new Set([e, ...Vt.turns.map((t) => (t + 360) % 360)])];
function ix(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = jy(t), l = Vt.every[0] + a() * (Vt.every[1] - Vt.every[0]);
  return { face: t, from: s ? qy(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function qy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Vt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function cx(e, t) {
  const { element: n, edge: a } = Jn(), s = ["left", "right"].map((r) => cn(Dy(a, r, e), e)).filter((r) => n && ws(r, e) && !ks(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function ux(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Er } : e;
}
const Er = 7;
function Ar() {
  const e = [...document.querySelectorAll(Xv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Fy(e, t) {
  const n = Je(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function Wy(e, t) {
  const n = Ar();
  return !n || !Yn(Fy(e, t), n);
}
const Hy = 4;
function Jn() {
  const e = un(), t = Ar(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Hy || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Er - n, 0) } };
}
const dx = ({ size: e, below: t }) => (1 - t) * e;
function cn(e, t) {
  const n = Mt(), { size: a, below: s } = t, o = rn[e.posture].drop * a;
  return { ...Cy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ja = (e, t) => Object.keys(Mr).map((n) => cn(Ly(e, n, t), t)), xs = (e, t) => $r(e, uy).map((n) => cn(n, t)), Cr = (e, t, n) => tn(e, t, n) ?? e[0];
function fx(e, t) {
  const { element: n, edge: a } = Jn();
  return { ...Cr(Ja(a, e), e, t), view: null, on: n };
}
function hx(e, t, n, a) {
  const { element: s, edge: o } = Jn(), l = (a ? Ja(o, t) : [...Ja(o, t), ...xs(o, t)]).filter(
    (u) => !Yn(Je(u, t), e)
  ), r = tn(
    l.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = r && !ks(r, t) ? r : tn(l, t, n);
  return i && { ...i, view: null, on: s };
}
function un() {
  var a;
  const e = ln(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(iy);
  if (!t) return { ...Xn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const To = { within: 2 };
function mx(e) {
  const { element: t, docked: n, edge: a } = un();
  if (!n || e.on !== t) return !0;
  const s = Xn().edge;
  return a.left > s.left + To.within || a.left + a.width < s.left + s.width - To.within;
}
const Uy = "[data-figure-closing]";
function px() {
  var n;
  const { element: e, docked: t } = un();
  return t && !!((n = e.firstElementChild) != null && n.matches(Uy));
}
const Or = "[data-figure-progress]";
function gx(e) {
  const t = e.querySelector(Or);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function vx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const zy = { across: 300, above: 380, below: 60 };
function yx(e) {
  const { across: t, above: n, below: a } = zy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Vy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Vy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Tr = "[data-figure-bar]", Xa = { back: 144, along: 0.4 };
function wx(e) {
  const { element: t, docked: n, edge: a } = un(), s = n ? t.querySelector(Tr) : null;
  if (!(s != null && s.querySelector(Or))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...cn({ x: o - Xa.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function bx(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Xa.along * a.size ? t.x + Xa.along * a.size : e.x, y: e.y, behind: !0 };
}
function kx(e) {
  const t = e.querySelector(Tr), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Xn() {
  const e = ln();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function xx(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = Xn(), i = n === null ? Gy(r, e, o === null ? t : { x: o, y: r.top }, a, s) : cn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Gy(e, t, n, a, s) {
  const o = xs(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + nt.width < s && i.x + a - lt.reach - lt.room >= l);
  return tn(r.length ? r : o, t, n);
}
const Ky = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function $x(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, br));
  const v = (ee) => {
    const j = Je(ee, n, rn[ee.posture].travels);
    return { x: j.left, y: j.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Yy(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [O, ...k] = [e, ...i, t].map(v), L = Pn(O, k[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), z = k.slice(1).map((ee, j) => {
    var M;
    return (M = Pn(k[j], ee, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : M.legs.find((S) => S.hopping);
  });
  return L && { ...L, legs: [...L.legs, ...z.filter(Boolean)] };
}
function Yy(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Ky.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Pn(e, n, o.size, { pace: l }) : Pn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function Mx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function Sx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && tn(Ry(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Jn();
  return { ...Cr(xs(s, t), t, n), view: null, on: a };
}
const Zy = "[data-figure-bubble]", Jy = 250;
let Gt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Br = 0;
const Pt = () => Gt, Ma = /* @__PURE__ */ new WeakMap();
let Xy = 0;
function $s(e) {
  return Ma.has(e) || Ma.set(e, `floor-${++Xy}`), Ma.get(e);
}
const Qy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, ew = () => {
  var e, t;
  return ((t = (e = ln()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function tw(e, t) {
  var a;
  const n = (a = e.querySelector(cy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function nw(e, t) {
  const n = e && tw(e, t), a = e ? [...e.querySelectorAll(Zy)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Qy(l, n))).map(({ element: o, type: l, box: r }) => ({ id: $s(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const aw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Jy ? (t.top - a.top) / s * 1e3 : 0;
};
function Rr(e = Gt, t = performance.now()) {
  const n = Mt(), a = ew(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = un(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = Xn();
  return u.element && i.push({ id: $s(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...nw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: aw(e, d, t) }))) });
}
const Qa = /* @__PURE__ */ new Set();
function sw(e) {
  return Qa.add(e), () => Qa.delete(e);
}
function ow() {
  Ir();
  const e = () => {
    Br = requestAnimationFrame(e), !document.hidden && (Gt = Rr(Gt), Qa.forEach((t) => t(Gt)));
  };
  e();
}
function Ir() {
  cancelAnimationFrame(Br);
}
const Ms = 5, lw = 56, rw = { share: 0.6 }, iw = (e) => -Math.sqrt(2 * ps * rw.share * e), It = (e, t) => e.find((n) => n.id === t) ?? null;
function _x(e, t = Rr().floors) {
  const n = It(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : $s(e.on) : null, o = s && It(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Lr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Pt().floors) {
  const u = It(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || cw(u, d, o)) && uw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Ss = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, cw = (e, t, n) => !Ss({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Ex(e, t = Pt().floors) {
  if (!Ss(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ms && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function uw(e, t, n = Pt().floors) {
  const a = It(n, "home");
  return e.posture === "hang" && a && Je(e, t).bottom >= a.top ? !1 : ws(e, t);
}
function Ax(e, t, n, a = Pt().floors) {
  const s = Lr(e, n, a);
  if (!e.home) return dw(e, t, s, a);
  if (!s) return null;
  const o = It(a, "home"), l = s.y - t.y, r = l > Ms ? "dropping" : -l > lw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function dw(e, t, n, a) {
  const s = n ? It(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: iw(e.risen) };
  if (!n) return null;
  if (Ss(t) && n.y - t.y > Ms) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function Cx(e, t, n) {
  const a = bs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function Ox(e, t, n, a = Pt().floors) {
  const s = t && Lr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const fw = ["data-type"], hw = { class: "figure-floor-name" }, mw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", hw, w(e.floor.type), 1)
    ], 12, fw));
  }
}, pw = /* @__PURE__ */ Z(mw, [["__scopeId", "data-v-4e0f1e2e"]]), gw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, vw = {
  __name: "FigureFloors",
  setup(e) {
    const t = ze(Pt().floors);
    let n = () => {
    };
    return Oe(() => {
      n = sw((a) => t.value = a.floors), ow();
    }), Be(() => {
      n(), Ir();
    }), (a, s) => (c(), h("div", gw, [
      (c(!0), h(K, null, te(t.value, (o) => (c(), W(pw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Tx = /* @__PURE__ */ Z(vw, [["__scopeId", "data-v-e519168b"]]), Sa = (e) => typeof e == "number" ? e : Date.parse(e);
function Bx(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Sa(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Sa(s.row.created_at) - Sa(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const yw = 3, _a = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function ww(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = _a[n.grouping]) == null ? void 0 : a.call(_a, e.row, n)) || "";
}
function bw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function Rx(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= yw ? [bw(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = ww(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const kw = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4
}, xw = 1e3;
function $w() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), xw);
  return kt(() => clearInterval(t)), e;
}
const Mw = ["datetime", "title"], Qn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = $w(), a = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(F(Fl)(e.at, F(n))), 9, Mw));
  }
};
function Ix(e) {
  const t = ct(), n = t.option("row"), a = I(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Sw(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const Lx = (e) => (t) => t.filter((n) => n.id !== e), Nx = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), Dx = (e) => (t) => [...t, e], Px = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function jx(e, t = {}) {
  const n = ct(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function qx(e) {
  const t = ct(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const xn = /* @__PURE__ */ new Map();
function _w(e, t) {
  if (xn.has(e)) return xn.get(e);
  const n = t().finally(() => xn.delete(e));
  return xn.set(e, n), n;
}
function Fx() {
  const e = ct(), t = I(null), n = I("");
  async function a() {
    const s = await _w(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Ew = { class: "cards-page" }, Aw = { class: "cards-bar" }, Cw = { class: "cards-count" }, Ow = { class: "cards" }, Tw = {
  key: 1,
  class: "cards-note"
}, Bw = {
  key: 2,
  class: "cards-note"
}, Rw = ["data-row", "onClick"], Iw = { class: "card-head" }, Lw = { class: "card-title" }, Nw = { class: "card-foot" }, Dw = {
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
    return (a, s) => (c(), h("div", Ew, [
      g("div", Aw, [
        g("span", Cw, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        N(ue, Ye({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            N(me, {
              name: "plus",
              size: 12
            }),
            ne(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Ow, [
        e.loaded ? e.failure ? (c(), h("p", Tw, w(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", Bw, "No " + w(e.noun) + "s yet", 1)) : (c(), W(xt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(K, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          g("span", Iw, [
            N(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + w(e.head(o)), 1),
            N(Qn, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Lw, w(e.title(o)), 1),
          g("span", Nw, w(e.foot(o)), 1)
        ], 8, Rw))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Wx = /* @__PURE__ */ Z(Dw, [["__scopeId", "data-v-990e6b37"]]), Bo = "newest";
function Hx(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = I(""), o = I(Bo), l = I("all"), r = R(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => Sw(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === Bo ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = R(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Pw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, jw = 40, qw = "top", Fw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = R(() => a === qw), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= jw;
    }
    return he(() => n.rowCount, async () => {
      await it(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", Pw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(m.$slots, "default", {}, void 0, !0)
      ], 34),
      N(Lt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: D(() => [
          Ze(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            N(me, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ne(" Newest ", -1))
          ], 512), [
            [Fo, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Ux = /* @__PURE__ */ Z(Fw, [["__scopeId", "data-v-3accb764"]]), Ww = ["aria-selected", "data-tab", "onClick"], Hw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Uw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = $e(Se, null), o = R(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), l = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const v = (y = l.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, l.value.scrollWidth > l.value.clientWidth && (l.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => it(() => u(!0));
    let f = null;
    return Oe(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Be(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(K, null, te(o.value, (y) => {
        var O, k;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((O = e.active) == null ? void 0 : O.key) === y.key }]),
          "aria-selected": ((k = e.active) == null ? void 0 : k.key) === y.key,
          "data-tab": y.key,
          onClick: (L) => a("choose", y)
        }, [
          ne(w(y.label) + " ", 1),
          i(y) ? (c(), h("span", Hw, w(e.answer[y.count_field]), 1)) : C("", !0)
        ], 10, Ww);
      }), 128)),
      g("i", {
        class: X(["inner-tabs-line", { slides: r.value.slides }]),
        style: fe({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, zx = /* @__PURE__ */ Z(Uw, [["__scopeId", "data-v-63fcd326"]]), zw = {
  class: "tab-body",
  "data-tab-body": ""
}, Vw = { "data-tab-content": "" }, Gw = {
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
      n.value = !0, os(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", zw, [
      n.value ? (c(), W(xt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Ze(g("div", Vw, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Fo, !n.value]
      ])
    ]));
  }
}, Vx = /* @__PURE__ */ Z(Gw, [["__scopeId", "data-v-63876533"]]), Kw = {}, Yw = { class: "menu-label" };
function Zw(e, t) {
  return c(), h("span", Yw, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const es = /* @__PURE__ */ Z(Kw, [["render", Zw], ["__scopeId", "data-v-aa955b3e"]]), Jw = {
  class: "search-bar",
  "data-search-bar": ""
}, Xw = { class: "search-bar-control" }, Qw = ["value", "placeholder", "aria-label"], eb = ["aria-expanded"], tb = {
  key: 0,
  "data-menu-count": ""
}, nb = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var L;
    const a = e, s = n, o = Xr(), l = ((L = $e(Se, null)) == null ? void 0 : L.search) ?? {}, r = R(() => l.placeholder || a.placeholder), i = l.context ?? [], u = I(null), d = I(null), f = I([]), m = R(() => f.value.length ? f.value[f.value.length - 1].next : i), v = R(() => !!o.menu || i.length > 0), y = (z) => {
      f.value = [], d.value = d.value ? null : z.currentTarget;
    };
    function O(z) {
      if (z.next.length) {
        f.value = [...f.value, z];
        return;
      }
      d.value = null, s("pick", z.click);
    }
    function k() {
      var z;
      s("update:modelValue", ""), (z = u.value) == null || z.focus();
    }
    return t({ focus: () => {
      var z;
      return (z = u.value) == null ? void 0 : z.focus();
    } }), (z, ee) => {
      var j;
      return c(), h("div", Jw, [
        g("div", Xw, [
          N(me, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          g("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: r.value,
            "aria-label": r.value,
            onInput: ee[0] || (ee[0] = (M) => s("update:modelValue", M.target.value)),
            onKeydown: Kt(k, ["esc"])
          }, null, 40, Qw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: k
          }, [
            N(me, {
              name: "close",
              size: 12
            })
          ])) : C("", !0),
          v.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: y
          }, [
            e.menuCount ? (c(), h("span", tb, w(e.menuCount), 1)) : C("", !0),
            N(me, {
              name: "caret",
              size: 12
            })
          ], 8, eb)) : C("", !0)
        ]),
        (j = F(l).button) != null && j.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: ee[1] || (ee[1] = (M) => s("pick", F(l).button.click))
        }, w(F(l).button.title), 1)) : C("", !0),
        ce(z.$slots, "default", {}, void 0, !0),
        d.value ? (c(), W(Un, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: ee[3] || (ee[3] = we(() => {
          }, ["stop"])),
          onClose: ee[4] || (ee[4] = (M) => d.value = null)
        }, {
          default: D(() => [
            f.value.length ? (c(), W(yt, {
              key: 0,
              "data-search-back": "",
              onClick: ee[2] || (ee[2] = (M) => f.value = f.value.slice(0, -1))
            }, {
              default: D(() => [
                ne("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(K, null, te(m.value, (M) => (c(), W(yt, {
              key: M.title,
              description: M.subtext,
              "data-search-entry": M.title,
              onClick: (S) => O(M)
            }, {
              default: D(() => [
                ne(w(M.title) + w(M.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? C("", !0) : ce(z.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : C("", !0)
      ]);
    };
  }
}, ab = /* @__PURE__ */ Z(nb, [["__scopeId", "data-v-45374bed"]]), sb = {
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
    return (o, l) => (c(), W(ab, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: l[1] || (l[1] = (r) => n("pick", r))
    }, {
      menu: D(() => [
        N(es, null, {
          default: D(() => [...l[2] || (l[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, te(a, (r) => N(yt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: D(() => [
            ne(w(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          N(es, null, {
            default: D(() => [...l[3] || (l[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, te(s, (r) => N(yt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: D(() => [
              ne(w(r.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : C("", !0)
      ]),
      default: D(() => [
        ce(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, Gx = /* @__PURE__ */ Z(sb, [["__scopeId", "data-v-dab0064d"]]);
function Kx() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Yx = (e) => import(
  /* @vite-ignore */
  e
), ob = 86400, ts = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function lb(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ts(t) - ts(e)) / ob);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Zx(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ts(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: lb(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ea = 280, Aa = 240, Ca = 120, rb = 6, ib = 14, nn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function cb(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Nr(e, t) {
  const n = Math.max(0, cb(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function ub(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${ib}px)` }), e.offsetHeight, e.style.transition = `height ${Ea}ms ${nn}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Nr(t, e));
    const m = s() - r;
    if (!i && m >= Ea && (i = !0, e.style.transition = `opacity ${Aa}ms ease-out, transform ${Aa}ms ${nn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ea + Aa) return a(f);
    d();
  };
  return a(f), d;
}
function Jx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${rb}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ca}ms ease-out, transform ${Ca}ms ${nn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Nr(t, e)), s() - l < Ca) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const db = 140, $n = 220, Ro = 5;
function Xx({ gap: e = db, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Ro);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = ub) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= Ro && u.flush();
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
function Qx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${$n}ms ${nn}, opacity ${$n}ms ease-in, margin ${$n}ms ${nn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, $n);
}
const Dr = "chat.pins.minimised", Cn = I(On(Dr, !1));
function Io(e) {
  Cn.value = e, cs(Dr, e);
}
function fb(e) {
  const t = R(() => e()), n = R(() => Cn.value ? [] : e()), a = () => Io(!Cn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => wt(o) > s).length,
    (o, l) => o > l && Io(!1)
  ), { pins: t, visible: n, minimised: Cn, toggle: a };
}
const hb = ["title"], mb = {
  key: 0,
  class: "pins-count"
}, pb = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = fb(() => t.pinRows);
    return (o, l) => F(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: F(a), inline: e.inline }]),
      title: F(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = we((...r) => F(s) && F(s)(...r), ["stop"]))
    }, [
      N(me, {
        name: F(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      F(a) ? (c(), h("span", mb, w(F(n).length), 1)) : C("", !0)
    ], 10, hb)) : C("", !0);
  }
}, e8 = /* @__PURE__ */ Z(pb, [["__scopeId", "data-v-d073c504"]]), gb = ["title"], vb = ["title"], yb = { class: "diff-card-dir" }, wb = { class: "diff-card-name" }, bb = ["title"], kb = ["title"], xb = {
  key: 0,
  class: "diff-card-note"
}, $b = ["href"], Mb = ["src", "alt"], Sb = { class: "diff-card-rows" }, _b = { class: "diff-row-num" }, Eb = { class: "diff-row-sign" }, Ab = { class: "diff-row-code" }, Cb = {
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
    function o(T) {
      (T.metaKey || T.ctrlKey) && (T.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, i.value)), d = R(() => n.path.slice(i.value)), f = R(() => n.change === "deleted"), m = R(() => l[n.change]), v = R(() => new Set(n.rows.filter((T) => T.line_type === "add").map((T) => T.line))), y = I("after"), O = R(() => y.value === "before" ? n.whole.old : n.whole.text), k = R(() => n.whole && n.whole.text !== void 0 ? O.value.split(`
`).map((T, b) => ({ line_type: y.value === "after" && v.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: T })) : n.rows.filter(
      (T) => !(n.editsOnly && ["ctx", "fold"].includes(T.line_type)) && !(n.hideRemovals && T.line_type === "del")
    )), L = I(!1), z = R(() => n.lines && !L.value && !n.whole), ee = R(() => z.value ? k.value.slice(0, n.lines) : k.value), j = R(() => k.value.length - ee.value.length), M = (T) => T.line === null || T.line_type === "del" ? "" : T.line, S = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, B = I(null), A = I(null);
    let x = null;
    return Oe(() => {
      if (!A.value) return;
      let T = !0;
      x = new ResizeObserver(() => {
        !B.value || !A.value || (B.value.style.transition = T ? "none" : "", B.value.style.height = `${A.value.offsetHeight}px`, T = !1);
      }), x.observe(A.value);
    }), Be(() => x && x.disconnect()), (T, b) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (p) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${F(s)}-click to open it`,
          onClick: o
        }, [
          g("span", yb, w(u.value), 1),
          g("span", wb, w(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, w(m.value), 3)) : C("", !0)
        ], 8, vb),
        g("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        g("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        N(Qn, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = we((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, w(y.value === "after" ? "After" : "Before"), 9, bb)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = we((p) => a("whole"), ["stop"]))
        }, [
          N(me, {
            name: "file",
            size: 12
          })
        ], 10, kb))
      ], 8, gb),
      e.whole && e.whole.error ? (c(), h("p", xb, w(e.whole.error), 1)) : C("", !0),
      !f.value && !e.folded ? (c(), h(K, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          g("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, Mb)
        ], 8, $b)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: B,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: A,
            class: "diff-card-diff"
          }, [
            g("div", Sb, [
              (c(!0), h(K, null, te(ee.value, (p, _) => (c(), h("div", {
                key: _,
                class: X(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", _b, w(M(p)), 1),
                g("span", Eb, w(r[p.line_type]), 1),
                g("span", Ab, w(S(p)), 1)
              ], 2))), 128)),
              j.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = we((p) => L.value = !0, ["stop"]))
              }, w(j.value) + " more " + w(j.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, t8 = /* @__PURE__ */ Z(Cb, [["__scopeId", "data-v-23581cbb"]]), Ob = {
  key: 0,
  class: "window-failure"
}, Tb = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ct(), a = I(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], Zo(s, kw.openPanel)), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", Ob, w(a.value.error), 1)) : a.value ? (c(), W(Oh, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : C("", !0);
  }
}, Bb = {
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
    const n = t, a = e, s = R(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = R(() => s.value && { render: () => Wn(Tb, { line: s.value.line }) }), l = I(null), r = R(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = R(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = R(
      () => {
        var m, v;
        return l.value ? eg(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
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
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), u.value.missing.length && !r.value && f();
      },
      { immediate: !0 }
    ), (m, v) => {
      var y, O;
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), W(ms, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((O = s.value) == null ? void 0 : O.shows) === "one-agent" && e.agent === null ? (c(), W(Yt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : r.value ? (c(), W(Ut, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), W(Yl, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (k, L) => n("option", k, L))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), W(Kl, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (k, L) => n("option", k, L))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), W(Ut, {
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
        onOption: v[2] || (v[2] = (k, L) => n("option", k, L))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), W(Ut, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (k) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Rb = ["data-section"], Ib = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(Bc, null), a = R(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = R(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(K, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(Bb, {
        name: r.name,
        catalogue: F(n).catalogue,
        subscriptions: F(n).subscriptions,
        environment: F(n).environment,
        prompts: F(n).prompts,
        "shell-read": F(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Rb))), 128));
  }
}, Lb = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), W(ue, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: D(() => [
        N(me, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Nb = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Db = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Pb = { class: "ask-text" }, jb = ["placeholder", "aria-label"], qb = ["placeholder", "aria-label"], Fb = {
  key: 3,
  class: "moves"
}, Wb = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = R(() => Qg(a.noun, a.row)), l = I(""), r = I(null), i = I(""), u = I("");
    he(() => a.id, () => {
      l.value = "", r.value = null;
    });
    async function d(v, y = "") {
      const O = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, y] : v.positional ? [y] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      l.value = O.ok ? "" : O.error, O.ok && (r.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (v) => v.confirm ? r.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (r.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(r.value, i.value.trim());
    return t({ moves: o, press: f }), (v, y) => {
      var O;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", Nb, w(l.value), 1)) : C("", !0),
        (O = r.value) != null && O.confirm ? (c(), h("div", Db, [
          g("span", Pb, w(r.value.confirm), 1),
          N(ue, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: X({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (k) => d(r.value))
          }, {
            default: D(() => [
              ne(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          N(ue, {
            small: "",
            variant: "ghost",
            onClick: y[1] || (y[1] = (k) => r.value = null)
          }, {
            default: D(() => [...y[7] || (y[7] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ])) : r.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: we(m, ["prevent"])
        }, [
          Ze(g("input", {
            "onUpdate:modelValue": y[2] || (y[2] = (k) => i.value = k),
            class: "ask-input",
            placeholder: r.value.ask,
            "aria-label": r.value.ask,
            onKeydown: y[3] || (y[3] = Kt(we((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, jb), [
            [Ra, i.value]
          ]),
          r.value.opener ? Ze((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (k) => u.value = k),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: y[5] || (y[5] = Kt(we((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, qb)), [
            [Ra, u.value]
          ]) : C("", !0),
          N(ue, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: D(() => [
              ne(w(r.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          N(ue, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (k) => r.value = null)
          }, {
            default: D(() => [...y[8] || (y[8] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Fb, [
          (c(!0), h(K, null, te(o.value, (k) => (c(), W(ue, {
            key: k.word,
            small: !k.bordered,
            bordered: k.bordered,
            icon: k.icon,
            variant: k.main ? "primary" : "ghost",
            class: X({ danger: k.danger }),
            "data-move": k.word,
            onClick: (L) => f(k)
          }, {
            default: D(() => [
              ne(w(k.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : C("", !0);
    };
  }
}, Hb = /* @__PURE__ */ Z(Wb, [["__scopeId", "data-v-0262f48f"]]), Ub = /* @__PURE__ */ new Set(["completed", "cancelled"]), zb = (e) => Ub.has(e), Fn = (e) => zb(e) ? "done" : e, Vb = { class: "facts" }, Gb = { class: "fact wide" }, Kb = { class: "fact-value" }, Yb = {
  key: 0,
  class: "fact"
}, Zb = { class: "fact-value" }, Jb = { class: "fact" }, Xb = { class: "fact-label" }, Qb = ["title"], ek = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, tk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, nk = {
  key: 2,
  class: "fact"
}, ak = { class: "fact-value" }, sk = { class: "fact wide" }, ok = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, lk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = In.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", Vb, [
        g("div", Gb, [
          l[2] || (l[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", Kb, w((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Yb, [
          l[3] || (l[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", Zb, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(K, { key: 1 }, [
          g("div", Jb, [
            g("span", Xb, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[0] || (l[0] = (u) => F(Pe)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Qb)
          ]),
          F(s).has(e.task.state) ? (c(), h("p", ek, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", tk, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", nk, [
          l[4] || (l[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", ak, "Agent " + w(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", sk, [
          l[5] || (l[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          N(zn, {
            options: F(n),
            value: String(F(Hl)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[1] || (l[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", ok, w(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, rk = /* @__PURE__ */ Z(lk, [["__scopeId", "data-v-2bcdca7a"]]), ik = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, ck = ["datetime"], uk = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", ik, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(K, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, ck),
        g("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : C("", !0);
  }
}, dk = /* @__PURE__ */ Z(uk, [["__scopeId", "data-v-b41f213b"]]), fk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, hk = { ...fk, done: "Completed" }, mk = { class: "task-status-icon" }, pk = ["width", "height", "aria-label"], gk = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => nl("task", Fn(t.status))), a = R(() => n.value === "testing" ? "started" : n.value), s = R(() => hk[t.status] ?? tl("task", t.status));
    return (o, l) => (c(), h("span", mk, [
      N(Lt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (c(), h("svg", {
            key: n.value,
            class: X(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            N(Nt, { value: a.value }, {
              blocked: D(() => [...l[0] || (l[0] = [
                g("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                g("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: D(() => [...l[1] || (l[1] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                g("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: D(() => [...l[2] || (l[2] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: D(() => [...l[3] || (l[3] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                g("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: D(() => [...l[4] || (l[4] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                g("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                g("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: D(() => [...l[5] || (l[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...l[6] || (l[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, pk))
        ]),
        _: 1
      })
    ]));
  }
}, Pr = /* @__PURE__ */ Z(gk, [["__scopeId", "data-v-ae24a63f"]]), vk = {
  class: "part",
  "data-resource-waits": ""
}, yk = ["onClick"], wk = { class: "wait-id" }, bk = { class: "wait-title" }, kk = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", vk, [
      g("h4", null, w(e.title), 1),
      (c(!0), h(K, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Pr, {
          status: F(Fn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", wk, w(o.id), 1),
        g("span", bk, w(o.title), 1)
      ], 8, yk))), 128))
    ]));
  }
}, Lo = /* @__PURE__ */ Z(kk, [["__scopeId", "data-v-8fb2e251"]]), xk = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, $k = { class: "text" }, Mk = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, Sk = 180, _k = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = R(() => a.task.waits.filter((i) => !n.has(i.state))), r = R(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(K, null, [
      l.value.length ? (c(), W(Lo, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", xk, [
        u[3] || (u[3] = g("h4", null, "How it was done", -1)),
        g("p", $k, w(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", Mk, [
        u[4] || (u[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: X(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > Sk && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0),
      r.value.length ? (c(), W(Lo, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, Ek = /* @__PURE__ */ Z(_k, [["__scopeId", "data-v-4a3f1e79"]]), Ak = {
  class: "task-details",
  "data-task-details": ""
}, Ck = { class: "since" }, Ok = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Tk = { class: "text" }, Bk = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Rk = {
  key: 1,
  class: "note"
}, Ik = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Lk = { class: "text" }, Nk = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", Ak, [
        g("div", {
          class: X(["state-line", F(Fn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Pr, {
              status: F(Fn)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + w(a(e.task.state)), 1)
          ]),
          g("span", Ck, [
            o[3] || (o[3] = ne(" since ", -1)),
            N(Qn, {
              at: F(Rl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", Ok, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", Tk, w(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", Bk, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Rk, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Ik, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", Lk, w(e.task.reason), 1)
        ])) : C("", !0),
        N(rk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(Ek, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(dk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Dk = /* @__PURE__ */ Z(Nk, [["__scopeId", "data-v-408e9f91"]]), Pk = 50, jk = { messages: 25 }, qk = (e) => jk[e] || Pk, Fk = {
  class: "task-log",
  "aria-label": "Task log"
}, Wk = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Hk = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Uk = { class: "entries" }, zk = ["datetime"], Vk = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Gk = {
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
        String(qk("task_logs")),
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
    ), kt(() => {
      r += 1;
    }), (u, d) => (c(), h("section", Fk, [
      o.value ? (c(), W(xt, { key: 0 })) : l.value ? (c(), h(K, { key: 1 }, [
        g("p", Wk, w(l.value), 1),
        N(ue, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: D(() => [...d[3] || (d[3] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(K, { key: 2 }, [
        n.value.length ? C("", !0) : (c(), h("p", Hk, "No log entries yet.")),
        g("ol", Uk, [
          (c(!0), h(K, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, zk),
            g("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", Vk, [
          N(ue, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: D(() => [...d[4] || (d[4] = [
              ne("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + w(a.value), 1),
          N(ue, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: D(() => [...d[5] || (d[5] = [
              ne("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : C("", !0)
      ], 64))
    ]));
  }
}, Kk = /* @__PURE__ */ Z(Gk, [["__scopeId", "data-v-98b3a6b1"]]), Yk = { class: "comment-side-head" }, Zk = {
  key: 0,
  class: "comment-none"
}, Jk = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: X(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", Yk, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        N(is, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      e.comments.length ? C("", !0) : (c(), h("p", Zk, "No comments yet")),
      (c(!0), h(K, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, w(e.words(a)), 1))), 128))
    ], 2));
  }
}, Xk = /* @__PURE__ */ Z(Jk, [["__scopeId", "data-v-19fdbdd4"]]);
var Do;
/Mac|iPhone|iPad/.test(((Do = navigator.userAgentData) == null ? void 0 : Do.platform) || navigator.platform);
function Qk(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const e2 = ["placeholder"], t2 = { class: "actions" }, n2 = { class: "error" }, a2 = {
  key: 1,
  class: "card closed"
}, s2 = { class: "mark" }, o2 = { class: "prompt" }, l2 = {
  key: 0,
  class: "draft"
}, r2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ba({
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
  emits: /* @__PURE__ */ Ba(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Ta(e, "draft"), l = Ta(e, "error"), r = I(!!l.value), i = I(!1), u = I(!1), d = I(null);
    async function f() {
      var y, O;
      r.value = !0, i.value = !1, await it(), (O = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || O.focus();
    }
    function m() {
      r.value = !1, l.value = "";
    }
    async function v() {
      const y = o.value.trim();
      if (!(!y || !a.ready || u.value)) {
        l.value = "", u.value = !0, o.value = "";
        try {
          await a.send(y), r.value = !1, i.value = !0;
        } catch (O) {
          o.value = y, l.value = O.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, O) => (c(), h("div", {
      class: X(["comment-bar", { open: r.value }])
    }, [
      r.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: we(v, ["prevent"]),
        onKeydown: Kt(m, ["esc"])
      }, [
        ce(y.$slots, "who", {}, void 0, !0),
        Ze(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": O[0] || (O[0] = (k) => o.value = k),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: O[1] || (O[1] = Kt((k) => F(Qk)(k, v), ["enter"]))
        }, null, 40, e2), [
          [Ra, o.value]
        ]),
        g("div", t2, [
          g("span", n2, w(l.value), 1),
          N(ue, {
            small: "",
            onClick: m
          }, {
            default: D(() => [...O[3] || (O[3] = [
              ne("Cancel", -1)
            ])]),
            _: 1
          }),
          N(ue, {
            variant: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: D(() => [...O[4] || (O[4] = [
              ne("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", a2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", s2, [
            N(me, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", o2, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", l2, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: O[2] || (O[2] = (k) => s("show"))
        }, [
          g("span", null, w(F(Ei)(e.count, "comment")), 1),
          N(me, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, i2 = /* @__PURE__ */ Z(r2, [["__scopeId", "data-v-b68baddd"]]);
function c2(e, t) {
  const n = I([]), a = I(!1);
  let s = 0, o = 0;
  const l = (u) => {
    const { noun: d, id: f, title: m } = e(), v = `On ${d} ${f}, ${m}: `;
    return u.text.startsWith(v) ? u.text.slice(v.length) : u.text;
  };
  async function r() {
    const { noun: u, id: d } = e();
    if (!d) return;
    const f = ++o, m = await t([u, "comments", String(d)]);
    f === o && (n.value = m.ok ? m.value.rows ?? [] : []);
  }
  async function i(u) {
    const { noun: d, id: f } = e(), m = { id: `sending-${++s}`, text: u };
    n.value = [...n.value, m], a.value = !0;
    const v = await t([d, "comment", String(f), u]);
    if (!v.ok)
      throw n.value = n.value.filter((y) => y !== m && y.id !== m.id), new Error(v.error);
    await r();
  }
  return he(() => e().id, () => {
    a.value = !1, n.value = [], r();
  }, { immediate: !0 }), { comments: n, open: a, words: l, send: i, load: r };
}
const u2 = { class: "top" }, d2 = {
  class: "crumb",
  "data-task-crumb": ""
}, f2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, h2 = {
  key: 1,
  class: "body"
}, m2 = { class: "summary" }, p2 = { class: "stamp" }, g2 = {
  class: "title",
  "data-resource-title": ""
}, v2 = {
  class: "tabs",
  "data-task-tabs": ""
}, y2 = { class: "panels" }, w2 = {
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
    ], v = c2(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (j) => a.read(j)
    );
    let y = 0;
    const O = R(() => {
      var j;
      return (j = l.value) != null && j.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function k() {
      const j = ++y, [M, S] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      j === y && (r.value = M.ok ? "" : M.error, o.value = M.ok ? M.value : null, l.value = S.ok ? S.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, l.value = null, u.value = null, f.value = "details", k();
      },
      { immediate: !0 }
    ), he(() => a.changes, k), he(v.open, (j) => {
      j && (f.value = "comments");
    });
    async function L(j) {
      const M = o.value.priority;
      o.value.priority = Number(j);
      const S = await a.read(["task", "edit", String(a.id), "--priority", j]);
      if (i.value = S.ok ? "" : S.error, S.ok) return k();
      o.value.priority = M;
    }
    function z(j) {
      u.value = null, d.value.press(j);
    }
    const ee = (j) => {
      var M;
      return ((M = d.value) == null ? void 0 : M.moves.length) && (u.value = j);
    };
    return t({ openStatus: ee }), (j, M) => (c(), h("aside", {
      class: X(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", u2, [
        e.backed ? (c(), W(Lb, {
          key: 0,
          onBack: M[0] || (M[0] = (S) => s("back"))
        })) : C("", !0),
        g("span", d2, w(O.value), 1),
        M[9] || (M[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          N(ue, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: M[1] || (M[1] = (S) => s("step", -1))
          }, {
            default: D(() => [
              N(me, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          N(ue, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: M[2] || (M[2] = (S) => s("step", 1))
          }, {
            default: D(() => [
              N(me, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        N(ue, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: M[3] || (M[3] = (S) => s("close"))
        }, {
          default: D(() => [
            N(me, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      r.value ? (c(), h("p", f2, w(r.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        N(Hb, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: k
        }, null, 8, ["id", "row", "read"]),
        g("header", m2, [
          g("div", p2, [
            ne(" Task " + w(o.value.id) + " · updated ", 1),
            N(Qn, {
              at: F(Rl)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", g2, w(o.value.title), 1)
        ]),
        g("div", v2, [
          N(zn, {
            options: m,
            value: f.value,
            onPick: M[4] || (M[4] = (S) => f.value = S)
          }, null, 8, ["value"])
        ]),
        g("div", y2, [
          N(Nt, { value: f.value }, {
            details: D(() => [
              N(Dk, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: ee,
                onPriority: L,
                onSelect: M[5] || (M[5] = (S) => s("select", S))
              }, null, 8, ["task", "place", "refusal"]),
              N(Ib, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"])
            ]),
            comments: D(() => [
              N(Xk, {
                below: "",
                comments: F(v).comments.value,
                words: F(v).words,
                onClose: M[6] || (M[6] = (S) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: D(() => [
              N(Kk, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(i2, {
          send: F(v).send,
          count: F(v).comments.value.length,
          onShow: M[7] || (M[7] = (S) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", h2, [
        N(xt)
      ])),
      u.value ? (c(), W(Un, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: M[8] || (M[8] = (S) => u.value = null)
      }, {
        default: D(() => [
          N(es, null, {
            default: D(() => [
              ne("Change the status of task " + w(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(K, null, te(d.value.moves, (S) => (c(), W(yt, {
            key: S.word,
            onClick: (B) => z(S)
          }, {
            default: D(() => [
              ne(w(S.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, n8 = /* @__PURE__ */ Z(w2, [["__scopeId", "data-v-a1cff4e4"]]);
function b2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Oa = { exports: {} }, No;
function k2() {
  return No || (No = 1, (function(e, t) {
    var n = (function() {
      var a = function(M, S) {
        var B = 236, A = 17, x = M, T = o[S], b = null, p = 0, _ = null, E = [], $ = {}, V = function(q, H) {
          p = x * 4 + 17, b = (function(P) {
            for (var U = new Array(P), G = 0; G < P; G += 1) {
              U[G] = new Array(P);
              for (var Q = 0; Q < P; Q += 1)
                U[G][Q] = null;
            }
            return U;
          })(p), J(0, 0), J(p - 7, 0), J(0, p - 7), ve(), ie(), Fe(q, H), x >= 7 && Te(q), _ == null && (_ = jr(x, T, E)), We(_, H);
        }, J = function(q, H) {
          for (var P = -1; P <= 7; P += 1)
            if (!(q + P <= -1 || p <= q + P))
              for (var U = -1; U <= 7; U += 1)
                H + U <= -1 || p <= H + U || (0 <= P && P <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (P == 0 || P == 6) || 2 <= P && P <= 4 && 2 <= U && U <= 4 ? b[q + P][H + U] = !0 : b[q + P][H + U] = !1);
        }, Y = function() {
          for (var q = 0, H = 0, P = 0; P < 8; P += 1) {
            V(!0, P);
            var U = r.getLostPoint($);
            (P == 0 || q > U) && (q = U, H = P);
          }
          return H;
        }, ie = function() {
          for (var q = 8; q < p - 8; q += 1)
            b[q][6] == null && (b[q][6] = q % 2 == 0);
          for (var H = 8; H < p - 8; H += 1)
            b[6][H] == null && (b[6][H] = H % 2 == 0);
        }, ve = function() {
          for (var q = r.getPatternPosition(x), H = 0; H < q.length; H += 1)
            for (var P = 0; P < q.length; P += 1) {
              var U = q[H], G = q[P];
              if (b[U][G] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? b[U + Q][G + oe] = !0 : b[U + Q][G + oe] = !1;
            }
        }, Te = function(q) {
          for (var H = r.getBCHTypeNumber(x), P = 0; P < 18; P += 1) {
            var U = !q && (H >> P & 1) == 1;
            b[Math.floor(P / 3)][P % 3 + p - 8 - 3] = U;
          }
          for (var P = 0; P < 18; P += 1) {
            var U = !q && (H >> P & 1) == 1;
            b[P % 3 + p - 8 - 3][Math.floor(P / 3)] = U;
          }
        }, Fe = function(q, H) {
          for (var P = T << 3 | H, U = r.getBCHTypeInfo(P), G = 0; G < 15; G += 1) {
            var Q = !q && (U >> G & 1) == 1;
            G < 6 ? b[G][8] = Q : G < 8 ? b[G + 1][8] = Q : b[p - 15 + G][8] = Q;
          }
          for (var G = 0; G < 15; G += 1) {
            var Q = !q && (U >> G & 1) == 1;
            G < 8 ? b[8][p - G - 1] = Q : G < 9 ? b[8][15 - G - 1 + 1] = Q : b[8][15 - G - 1] = Q;
          }
          b[p - 8][8] = !q;
        }, We = function(q, H) {
          for (var P = -1, U = p - 1, G = 7, Q = 0, oe = r.getMaskFunction(H), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (b[U][se - ye] == null) {
                  var ke = !1;
                  Q < q.length && (ke = (q[Q] >>> G & 1) == 1);
                  var re = oe(U, se - ye);
                  re && (ke = !ke), b[U][se - ye] = ke, G -= 1, G == -1 && (Q += 1, G = 7);
                }
              if (U += P, U < 0 || p <= U) {
                U -= P, P = -P;
                break;
              }
            }
        }, St = function(q, H) {
          for (var P = 0, U = 0, G = 0, Q = new Array(H.length), oe = new Array(H.length), se = 0; se < H.length; se += 1) {
            var ye = H[se].dataCount, ke = H[se].totalCount - ye;
            U = Math.max(U, ye), G = Math.max(G, ke), Q[se] = new Array(ye);
            for (var re = 0; re < Q[se].length; re += 1)
              Q[se][re] = 255 & q.getBuffer()[re + P];
            P += ye;
            var Re = r.getErrorCorrectPolynomial(ke), Ie = u(Q[se], Re.getLength() - 1), _s = Ie.mod(Re);
            oe[se] = new Array(Re.getLength() - 1);
            for (var re = 0; re < oe[se].length; re += 1) {
              var Es = re + _s.getLength() - oe[se].length;
              oe[se][re] = Es >= 0 ? _s.getAt(Es) : 0;
            }
          }
          for (var As = 0, re = 0; re < H.length; re += 1)
            As += H[re].totalCount;
          for (var ea = new Array(As), dn = 0, re = 0; re < U; re += 1)
            for (var se = 0; se < H.length; se += 1)
              re < Q[se].length && (ea[dn] = Q[se][re], dn += 1);
          for (var re = 0; re < G; re += 1)
            for (var se = 0; se < H.length; se += 1)
              re < oe[se].length && (ea[dn] = oe[se][re], dn += 1);
          return ea;
        }, jr = function(q, H, P) {
          for (var U = d.getRSBlocks(q, H), G = f(), Q = 0; Q < P.length; Q += 1) {
            var oe = P[Q];
            G.put(oe.getMode(), 4), G.put(oe.getLength(), r.getLengthInBits(oe.getMode(), q)), oe.write(G);
          }
          for (var se = 0, Q = 0; Q < U.length; Q += 1)
            se += U[Q].dataCount;
          if (G.getLengthInBits() > se * 8)
            throw "code length overflow. (" + G.getLengthInBits() + ">" + se * 8 + ")";
          for (G.getLengthInBits() + 4 <= se * 8 && G.put(0, 4); G.getLengthInBits() % 8 != 0; )
            G.putBit(!1);
          for (; !(G.getLengthInBits() >= se * 8 || (G.put(B, 8), G.getLengthInBits() >= se * 8)); )
            G.put(A, 8);
          return St(G, U);
        };
        $.addData = function(q, H) {
          H = H || "Byte";
          var P = null;
          switch (H) {
            case "Numeric":
              P = m(q);
              break;
            case "Alphanumeric":
              P = v(q);
              break;
            case "Byte":
              P = y(q);
              break;
            case "Kanji":
              P = O(q);
              break;
            default:
              throw "mode:" + H;
          }
          E.push(P), _ = null;
        }, $.isDark = function(q, H) {
          if (q < 0 || p <= q || H < 0 || p <= H)
            throw q + "," + H;
          return b[q][H];
        }, $.getModuleCount = function() {
          return p;
        }, $.make = function() {
          if (x < 1) {
            for (var q = 1; q < 40; q++) {
              for (var H = d.getRSBlocks(q, T), P = f(), U = 0; U < E.length; U++) {
                var G = E[U];
                P.put(G.getMode(), 4), P.put(G.getLength(), r.getLengthInBits(G.getMode(), q)), G.write(P);
              }
              for (var Q = 0, U = 0; U < H.length; U++)
                Q += H[U].dataCount;
              if (P.getLengthInBits() <= Q * 8)
                break;
            }
            x = q;
          }
          V(!1, Y());
        }, $.createTableTag = function(q, H) {
          q = q || 2, H = typeof H > "u" ? q * 4 : H;
          var P = "";
          P += '<table style="', P += " border-width: 0px; border-style: none;", P += " border-collapse: collapse;", P += " padding: 0px; margin: " + H + "px;", P += '">', P += "<tbody>";
          for (var U = 0; U < $.getModuleCount(); U += 1) {
            P += "<tr>";
            for (var G = 0; G < $.getModuleCount(); G += 1)
              P += '<td style="', P += " border-width: 0px; border-style: none;", P += " border-collapse: collapse;", P += " padding: 0px; margin: 0px;", P += " width: " + q + "px;", P += " height: " + q + "px;", P += " background-color: ", P += $.isDark(U, G) ? "#000000" : "#ffffff", P += ";", P += '"/>';
            P += "</tr>";
          }
          return P += "</tbody>", P += "</table>", P;
        }, $.createSvgTag = function(q, H, P, U) {
          var G = {};
          typeof arguments[0] == "object" && (G = arguments[0], q = G.cellSize, H = G.margin, P = G.alt, U = G.title), q = q || 2, H = typeof H > "u" ? q * 4 : H, P = typeof P == "string" ? { text: P } : P || {}, P.text = P.text || null, P.id = P.text ? P.id || "qrcode-description" : null, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-title" : null;
          var Q = $.getModuleCount() * q + H * 2, oe, se, ye, ke, re = "", Re;
          for (Re = "l" + q + ",0 0," + q + " -" + q + ",0 0,-" + q + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += G.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', re += ' viewBox="0 0 ' + Q + " " + Q + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += U.text || P.text ? ' role="img" aria-labelledby="' + _t([U.id, P.id].join(" ").trim()) + '"' : "", re += ">", re += U.text ? '<title id="' + _t(U.id) + '">' + _t(U.text) + "</title>" : "", re += P.text ? '<description id="' + _t(P.id) + '">' + _t(P.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', ye = 0; ye < $.getModuleCount(); ye += 1)
            for (ke = ye * q + H, oe = 0; oe < $.getModuleCount(); oe += 1)
              $.isDark(ye, oe) && (se = oe * q + H, re += "M" + se + "," + ke + Re);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, $.createDataURL = function(q, H) {
          q = q || 2, H = typeof H > "u" ? q * 4 : H;
          var P = $.getModuleCount() * q + H * 2, U = H, G = P - H;
          return j(P, P, function(Q, oe) {
            if (U <= Q && Q < G && U <= oe && oe < G) {
              var se = Math.floor((Q - U) / q), ye = Math.floor((oe - U) / q);
              return $.isDark(ye, se) ? 0 : 1;
            } else
              return 1;
          });
        }, $.createImgTag = function(q, H, P) {
          q = q || 2, H = typeof H > "u" ? q * 4 : H;
          var U = $.getModuleCount() * q + H * 2, G = "";
          return G += "<img", G += ' src="', G += $.createDataURL(q, H), G += '"', G += ' width="', G += U, G += '"', G += ' height="', G += U, G += '"', P && (G += ' alt="', G += _t(P), G += '"'), G += "/>", G;
        };
        var _t = function(q) {
          for (var H = "", P = 0; P < q.length; P += 1) {
            var U = q.charAt(P);
            switch (U) {
              case "<":
                H += "&lt;";
                break;
              case ">":
                H += "&gt;";
                break;
              case "&":
                H += "&amp;";
                break;
              case '"':
                H += "&quot;";
                break;
              default:
                H += U;
                break;
            }
          }
          return H;
        }, qr = function(q) {
          var H = 1;
          q = typeof q > "u" ? H * 2 : q;
          var P = $.getModuleCount() * H + q * 2, U = q, G = P - q, Q, oe, se, ye, ke, re = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Re = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ie = "";
          for (Q = 0; Q < P; Q += 2) {
            for (se = Math.floor((Q - U) / H), ye = Math.floor((Q + 1 - U) / H), oe = 0; oe < P; oe += 1)
              ke = "█", U <= oe && oe < G && U <= Q && Q < G && $.isDark(se, Math.floor((oe - U) / H)) && (ke = " "), U <= oe && oe < G && U <= Q + 1 && Q + 1 < G && $.isDark(ye, Math.floor((oe - U) / H)) ? ke += " " : ke += "█", Ie += q < 1 && Q + 1 >= G ? Re[ke] : re[ke];
            Ie += `
`;
          }
          return P % 2 && q > 0 ? Ie.substring(0, Ie.length - P - 1) + Array(P + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return $.createASCII = function(q, H) {
          if (q = q || 1, q < 2)
            return qr(H);
          q -= 1, H = typeof H > "u" ? q * 2 : H;
          var P = $.getModuleCount() * q + H * 2, U = H, G = P - H, Q, oe, se, ye, ke = Array(q + 1).join("██"), re = Array(q + 1).join("  "), Re = "", Ie = "";
          for (Q = 0; Q < P; Q += 1) {
            for (se = Math.floor((Q - U) / q), Ie = "", oe = 0; oe < P; oe += 1)
              ye = 1, U <= oe && oe < G && U <= Q && Q < G && $.isDark(se, Math.floor((oe - U) / q)) && (ye = 0), Ie += ye ? ke : re;
            for (se = 0; se < q; se += 1)
              Re += Ie + `
`;
          }
          return Re.substring(0, Re.length - 1);
        }, $.renderTo2dContext = function(q, H) {
          H = H || 2;
          for (var P = $.getModuleCount(), U = 0; U < P; U++)
            for (var G = 0; G < P; G++)
              q.fillStyle = $.isDark(U, G) ? "black" : "white", q.fillRect(U * H, G * H, H, H);
        }, $;
      };
      a.stringToBytesFuncs = {
        default: function(M) {
          for (var S = [], B = 0; B < M.length; B += 1) {
            var A = M.charCodeAt(B);
            S.push(A & 255);
          }
          return S;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(M, S) {
        var B = (function() {
          for (var x = z(M), T = function() {
            var ie = x.read();
            if (ie == -1) throw "eof";
            return ie;
          }, b = 0, p = {}; ; ) {
            var _ = x.read();
            if (_ == -1) break;
            var E = T(), $ = T(), V = T(), J = String.fromCharCode(_ << 8 | E), Y = $ << 8 | V;
            p[J] = Y, b += 1;
          }
          if (b != S)
            throw b + " != " + S;
          return p;
        })(), A = 63;
        return function(x) {
          for (var T = [], b = 0; b < x.length; b += 1) {
            var p = x.charCodeAt(b);
            if (p < 128)
              T.push(p);
            else {
              var _ = B[x.charAt(b)];
              typeof _ == "number" ? (_ & 255) == _ ? T.push(_) : (T.push(_ >>> 8), T.push(_ & 255)) : T.push(A);
            }
          }
          return T;
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
        var M = [
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
        ], S = 1335, B = 7973, A = 21522, x = {}, T = function(b) {
          for (var p = 0; b != 0; )
            p += 1, b >>>= 1;
          return p;
        };
        return x.getBCHTypeInfo = function(b) {
          for (var p = b << 10; T(p) - T(S) >= 0; )
            p ^= S << T(p) - T(S);
          return (b << 10 | p) ^ A;
        }, x.getBCHTypeNumber = function(b) {
          for (var p = b << 12; T(p) - T(B) >= 0; )
            p ^= B << T(p) - T(B);
          return b << 12 | p;
        }, x.getPatternPosition = function(b) {
          return M[b - 1];
        }, x.getMaskFunction = function(b) {
          switch (b) {
            case l.PATTERN000:
              return function(p, _) {
                return (p + _) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, _) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, _) {
                return _ % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, _) {
                return (p + _) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, _) {
                return (Math.floor(p / 2) + Math.floor(_ / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, _) {
                return p * _ % 2 + p * _ % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, _) {
                return (p * _ % 2 + p * _ % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, _) {
                return (p * _ % 3 + (p + _) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, x.getErrorCorrectPolynomial = function(b) {
          for (var p = u([1], 0), _ = 0; _ < b; _ += 1)
            p = p.multiply(u([1, i.gexp(_)], 0));
          return p;
        }, x.getLengthInBits = function(b, p) {
          if (1 <= p && p < 10)
            switch (b) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + b;
            }
          else if (p < 27)
            switch (b) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + b;
            }
          else if (p < 41)
            switch (b) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + b;
            }
          else
            throw "type:" + p;
        }, x.getLostPoint = function(b) {
          for (var p = b.getModuleCount(), _ = 0, E = 0; E < p; E += 1)
            for (var $ = 0; $ < p; $ += 1) {
              for (var V = 0, J = b.isDark(E, $), Y = -1; Y <= 1; Y += 1)
                if (!(E + Y < 0 || p <= E + Y))
                  for (var ie = -1; ie <= 1; ie += 1)
                    $ + ie < 0 || p <= $ + ie || Y == 0 && ie == 0 || J == b.isDark(E + Y, $ + ie) && (V += 1);
              V > 5 && (_ += 3 + V - 5);
            }
          for (var E = 0; E < p - 1; E += 1)
            for (var $ = 0; $ < p - 1; $ += 1) {
              var ve = 0;
              b.isDark(E, $) && (ve += 1), b.isDark(E + 1, $) && (ve += 1), b.isDark(E, $ + 1) && (ve += 1), b.isDark(E + 1, $ + 1) && (ve += 1), (ve == 0 || ve == 4) && (_ += 3);
            }
          for (var E = 0; E < p; E += 1)
            for (var $ = 0; $ < p - 6; $ += 1)
              b.isDark(E, $) && !b.isDark(E, $ + 1) && b.isDark(E, $ + 2) && b.isDark(E, $ + 3) && b.isDark(E, $ + 4) && !b.isDark(E, $ + 5) && b.isDark(E, $ + 6) && (_ += 40);
          for (var $ = 0; $ < p; $ += 1)
            for (var E = 0; E < p - 6; E += 1)
              b.isDark(E, $) && !b.isDark(E + 1, $) && b.isDark(E + 2, $) && b.isDark(E + 3, $) && b.isDark(E + 4, $) && !b.isDark(E + 5, $) && b.isDark(E + 6, $) && (_ += 40);
          for (var Te = 0, $ = 0; $ < p; $ += 1)
            for (var E = 0; E < p; E += 1)
              b.isDark(E, $) && (Te += 1);
          var Fe = Math.abs(100 * Te / p / p - 50) / 5;
          return _ += Fe * 10, _;
        }, x;
      })(), i = (function() {
        for (var M = new Array(256), S = new Array(256), B = 0; B < 8; B += 1)
          M[B] = 1 << B;
        for (var B = 8; B < 256; B += 1)
          M[B] = M[B - 4] ^ M[B - 5] ^ M[B - 6] ^ M[B - 8];
        for (var B = 0; B < 255; B += 1)
          S[M[B]] = B;
        var A = {};
        return A.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return S[x];
        }, A.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return M[x];
        }, A;
      })();
      function u(M, S) {
        if (typeof M.length > "u")
          throw M.length + "/" + S;
        var B = (function() {
          for (var x = 0; x < M.length && M[x] == 0; )
            x += 1;
          for (var T = new Array(M.length - x + S), b = 0; b < M.length - x; b += 1)
            T[b] = M[b + x];
          return T;
        })(), A = {};
        return A.getAt = function(x) {
          return B[x];
        }, A.getLength = function() {
          return B.length;
        }, A.multiply = function(x) {
          for (var T = new Array(A.getLength() + x.getLength() - 1), b = 0; b < A.getLength(); b += 1)
            for (var p = 0; p < x.getLength(); p += 1)
              T[b + p] ^= i.gexp(i.glog(A.getAt(b)) + i.glog(x.getAt(p)));
          return u(T, 0);
        }, A.mod = function(x) {
          if (A.getLength() - x.getLength() < 0)
            return A;
          for (var T = i.glog(A.getAt(0)) - i.glog(x.getAt(0)), b = new Array(A.getLength()), p = 0; p < A.getLength(); p += 1)
            b[p] = A.getAt(p);
          for (var p = 0; p < x.getLength(); p += 1)
            b[p] ^= i.gexp(i.glog(x.getAt(p)) + T);
          return u(b, 0).mod(x);
        }, A;
      }
      var d = (function() {
        var M = [
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
        ], S = function(x, T) {
          var b = {};
          return b.totalCount = x, b.dataCount = T, b;
        }, B = {}, A = function(x, T) {
          switch (T) {
            case o.L:
              return M[(x - 1) * 4 + 0];
            case o.M:
              return M[(x - 1) * 4 + 1];
            case o.Q:
              return M[(x - 1) * 4 + 2];
            case o.H:
              return M[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return B.getRSBlocks = function(x, T) {
          var b = A(x, T);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + T;
          for (var p = b.length / 3, _ = [], E = 0; E < p; E += 1)
            for (var $ = b[E * 3 + 0], V = b[E * 3 + 1], J = b[E * 3 + 2], Y = 0; Y < $; Y += 1)
              _.push(S(V, J));
          return _;
        }, B;
      })(), f = function() {
        var M = [], S = 0, B = {};
        return B.getBuffer = function() {
          return M;
        }, B.getAt = function(A) {
          var x = Math.floor(A / 8);
          return (M[x] >>> 7 - A % 8 & 1) == 1;
        }, B.put = function(A, x) {
          for (var T = 0; T < x; T += 1)
            B.putBit((A >>> x - T - 1 & 1) == 1);
        }, B.getLengthInBits = function() {
          return S;
        }, B.putBit = function(A) {
          var x = Math.floor(S / 8);
          M.length <= x && M.push(0), A && (M[x] |= 128 >>> S % 8), S += 1;
        }, B;
      }, m = function(M) {
        var S = s.MODE_NUMBER, B = M, A = {};
        A.getMode = function() {
          return S;
        }, A.getLength = function(b) {
          return B.length;
        }, A.write = function(b) {
          for (var p = B, _ = 0; _ + 2 < p.length; )
            b.put(x(p.substring(_, _ + 3)), 10), _ += 3;
          _ < p.length && (p.length - _ == 1 ? b.put(x(p.substring(_, _ + 1)), 4) : p.length - _ == 2 && b.put(x(p.substring(_, _ + 2)), 7));
        };
        var x = function(b) {
          for (var p = 0, _ = 0; _ < b.length; _ += 1)
            p = p * 10 + T(b.charAt(_));
          return p;
        }, T = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return A;
      }, v = function(M) {
        var S = s.MODE_ALPHA_NUM, B = M, A = {};
        A.getMode = function() {
          return S;
        }, A.getLength = function(T) {
          return B.length;
        }, A.write = function(T) {
          for (var b = B, p = 0; p + 1 < b.length; )
            T.put(
              x(b.charAt(p)) * 45 + x(b.charAt(p + 1)),
              11
            ), p += 2;
          p < b.length && T.put(x(b.charAt(p)), 6);
        };
        var x = function(T) {
          if ("0" <= T && T <= "9")
            return T.charCodeAt(0) - 48;
          if ("A" <= T && T <= "Z")
            return T.charCodeAt(0) - 65 + 10;
          switch (T) {
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
              throw "illegal char :" + T;
          }
        };
        return A;
      }, y = function(M) {
        var S = s.MODE_8BIT_BYTE, B = a.stringToBytes(M), A = {};
        return A.getMode = function() {
          return S;
        }, A.getLength = function(x) {
          return B.length;
        }, A.write = function(x) {
          for (var T = 0; T < B.length; T += 1)
            x.put(B[T], 8);
        }, A;
      }, O = function(M) {
        var S = s.MODE_KANJI, B = a.stringToBytesFuncs.SJIS;
        if (!B)
          throw "sjis not supported.";
        (function(T, b) {
          var p = B(T);
          if (p.length != 2 || (p[0] << 8 | p[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var A = B(M), x = {};
        return x.getMode = function() {
          return S;
        }, x.getLength = function(T) {
          return ~~(A.length / 2);
        }, x.write = function(T) {
          for (var b = A, p = 0; p + 1 < b.length; ) {
            var _ = (255 & b[p]) << 8 | 255 & b[p + 1];
            if (33088 <= _ && _ <= 40956)
              _ -= 33088;
            else if (57408 <= _ && _ <= 60351)
              _ -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + _;
            _ = (_ >>> 8 & 255) * 192 + (_ & 255), T.put(_, 13), p += 2;
          }
          if (p < b.length)
            throw "illegal char at " + (p + 1);
        }, x;
      }, k = function() {
        var M = [], S = {};
        return S.writeByte = function(B) {
          M.push(B & 255);
        }, S.writeShort = function(B) {
          S.writeByte(B), S.writeByte(B >>> 8);
        }, S.writeBytes = function(B, A, x) {
          A = A || 0, x = x || B.length;
          for (var T = 0; T < x; T += 1)
            S.writeByte(B[T + A]);
        }, S.writeString = function(B) {
          for (var A = 0; A < B.length; A += 1)
            S.writeByte(B.charCodeAt(A));
        }, S.toByteArray = function() {
          return M;
        }, S.toString = function() {
          var B = "";
          B += "[";
          for (var A = 0; A < M.length; A += 1)
            A > 0 && (B += ","), B += M[A];
          return B += "]", B;
        }, S;
      }, L = function() {
        var M = 0, S = 0, B = 0, A = "", x = {}, T = function(p) {
          A += String.fromCharCode(b(p & 63));
        }, b = function(p) {
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
        return x.writeByte = function(p) {
          for (M = M << 8 | p & 255, S += 8, B += 1; S >= 6; )
            T(M >>> S - 6), S -= 6;
        }, x.flush = function() {
          if (S > 0 && (T(M << 6 - S), M = 0, S = 0), B % 3 != 0)
            for (var p = 3 - B % 3, _ = 0; _ < p; _ += 1)
              A += "=";
        }, x.toString = function() {
          return A;
        }, x;
      }, z = function(M) {
        var S = M, B = 0, A = 0, x = 0, T = {};
        T.read = function() {
          for (; x < 8; ) {
            if (B >= S.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var p = S.charAt(B);
            if (B += 1, p == "=")
              return x = 0, -1;
            if (p.match(/^\s$/))
              continue;
            A = A << 6 | b(p.charCodeAt(0)), x += 6;
          }
          var _ = A >>> x - 8 & 255;
          return x -= 8, _;
        };
        var b = function(p) {
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
        return T;
      }, ee = function(M, S) {
        var B = M, A = S, x = new Array(M * S), T = {};
        T.setPixel = function(E, $, V) {
          x[$ * B + E] = V;
        }, T.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(B), E.writeShort(A), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(B), E.writeShort(A), E.writeByte(0);
          var $ = 2, V = p($);
          E.writeByte($);
          for (var J = 0; V.length - J > 255; )
            E.writeByte(255), E.writeBytes(V, J, 255), J += 255;
          E.writeByte(V.length - J), E.writeBytes(V, J, V.length - J), E.writeByte(0), E.writeString(";");
        };
        var b = function(E) {
          var $ = E, V = 0, J = 0, Y = {};
          return Y.write = function(ie, ve) {
            if (ie >>> ve)
              throw "length over";
            for (; V + ve >= 8; )
              $.writeByte(255 & (ie << V | J)), ve -= 8 - V, ie >>>= 8 - V, J = 0, V = 0;
            J = ie << V | J, V = V + ve;
          }, Y.flush = function() {
            V > 0 && $.writeByte(J);
          }, Y;
        }, p = function(E) {
          for (var $ = 1 << E, V = (1 << E) + 1, J = E + 1, Y = _(), ie = 0; ie < $; ie += 1)
            Y.add(String.fromCharCode(ie));
          Y.add(String.fromCharCode($)), Y.add(String.fromCharCode(V));
          var ve = k(), Te = b(ve);
          Te.write($, J);
          var Fe = 0, We = String.fromCharCode(x[Fe]);
          for (Fe += 1; Fe < x.length; ) {
            var St = String.fromCharCode(x[Fe]);
            Fe += 1, Y.contains(We + St) ? We = We + St : (Te.write(Y.indexOf(We), J), Y.size() < 4095 && (Y.size() == 1 << J && (J += 1), Y.add(We + St)), We = St);
          }
          return Te.write(Y.indexOf(We), J), Te.write(V, J), Te.flush(), ve.toByteArray();
        }, _ = function() {
          var E = {}, $ = 0, V = {};
          return V.add = function(J) {
            if (V.contains(J))
              throw "dup key:" + J;
            E[J] = $, $ += 1;
          }, V.size = function() {
            return $;
          }, V.indexOf = function(J) {
            return E[J];
          }, V.contains = function(J) {
            return typeof E[J] < "u";
          }, V;
        };
        return T;
      }, j = function(M, S, B) {
        for (var A = ee(M, S), x = 0; x < S; x += 1)
          for (var T = 0; T < M; T += 1)
            A.setPixel(T, x, B(T, x));
        var b = k();
        A.write(b);
        for (var p = L(), _ = b.toByteArray(), E = 0; E < _.length; E += 1)
          p.writeByte(_[E]);
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
  })(Oa)), Oa.exports;
}
var x2 = k2();
const $2 = /* @__PURE__ */ b2(x2), M2 = ["width", "height", "viewBox"], S2 = ["width", "height"], _2 = ["d"], E2 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const a = $2(0, "M");
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
      g("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, S2),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, _2)
    ], 8, M2));
  }
}, a8 = /* @__PURE__ */ Z(E2, [["__scopeId", "data-v-489f0852"]]), A2 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: fe({ padding: e.padding })
    }, [
      ce(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, s8 = /* @__PURE__ */ Z(A2, [["__scopeId", "data-v-47e67f04"]]);
function o8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const l8 = Qr(() => import("./VoiceFigure-ohRLZGzR.js").then((e) => e.V)), r8 = "1.2.0", i8 = "3.5";
export {
  ju as $,
  xe as A,
  _e as B,
  Yn as C,
  Je as D,
  hx as E,
  Ly as F,
  a4 as G,
  cx as H,
  py as I,
  Wy as J,
  Mt as K,
  T2 as L,
  bs as M,
  Ky as N,
  Fy as O,
  Kn as P,
  C4 as Q,
  N5 as R,
  An as S,
  I4 as T,
  A5 as U,
  Me as V,
  Nn as W,
  E5 as X,
  _5 as Y,
  Pu as Z,
  Z as _,
  y5 as a,
  J4 as a$,
  Vy as a0,
  D5 as a1,
  P5 as a2,
  Se as a3,
  Y5 as a4,
  K5 as a5,
  wt as a6,
  j5 as a7,
  r4 as a8,
  r5 as a9,
  H4 as aA,
  _4 as aB,
  sy as aC,
  d4 as aD,
  f4 as aE,
  mx as aF,
  br as aG,
  R4 as aH,
  ln as aI,
  h5 as aJ,
  u5 as aK,
  ax as aL,
  rn as aM,
  rx as aN,
  n4 as aO,
  E4 as aP,
  A4 as aQ,
  S4 as aR,
  Qt as aS,
  gt as aT,
  i5 as aU,
  K0 as aV,
  $4 as aW,
  I5 as aX,
  yr as aY,
  It as aZ,
  Pt as a_,
  X4 as aa,
  ox as ab,
  g5 as ac,
  C5 as ad,
  O5 as ae,
  V5 as af,
  G5 as ag,
  Z5 as ah,
  x5 as ai,
  Ao as aj,
  q5 as ak,
  l4 as al,
  yx as am,
  w4 as an,
  v4 as ao,
  g4 as ap,
  J5 as aq,
  U5 as ar,
  H5 as as,
  z5 as at,
  B4 as au,
  o4 as av,
  i4 as aw,
  kx as ax,
  zt as ay,
  c4 as az,
  ow as b,
  bx as b$,
  Ty as b0,
  lx as b1,
  D4 as b2,
  N4 as b3,
  yv as b4,
  or as b5,
  K4 as b6,
  s4 as b7,
  Xn as b8,
  nt as b9,
  j4 as bA,
  z4 as bB,
  lt as bC,
  L4 as bD,
  V4 as bE,
  u4 as bF,
  b4 as bG,
  h4 as bH,
  Ee as bI,
  t4 as bJ,
  G4 as bK,
  Cx as bL,
  Ox as bM,
  o5 as bN,
  J0 as bO,
  Q5 as bP,
  q4 as bQ,
  w5 as bR,
  vx as bS,
  P4 as bT,
  F4 as bU,
  W4 as bV,
  X5 as bW,
  oy as bX,
  e4 as bY,
  p4 as bZ,
  gx as b_,
  U4 as ba,
  ya as bb,
  Bl as bc,
  $x as bd,
  _x as be,
  T4 as bf,
  nx as bg,
  l5 as bh,
  y4 as bi,
  Mx as bj,
  F5 as bk,
  W5 as bl,
  M5 as bm,
  L5 as bn,
  f5 as bo,
  ex as bp,
  b5 as bq,
  k5 as br,
  S5 as bs,
  x4 as bt,
  H0 as bu,
  ix as bv,
  qy as bw,
  $5 as bx,
  m5 as by,
  k4 as bz,
  vv as c,
  xt as c$,
  d5 as c0,
  c5 as c1,
  m4 as c2,
  Ex as c3,
  Ss as c4,
  Ax as c5,
  Lr as c6,
  tx as c7,
  B5 as c8,
  T5 as c9,
  zx as cA,
  j2 as cB,
  r8 as cC,
  i8 as cD,
  G2 as cE,
  Gx as cF,
  Va as cG,
  e5 as cH,
  Eg as cI,
  yt as cJ,
  es as cK,
  Un as cL,
  W2 as cM,
  K2 as cN,
  bi as cO,
  Up as cP,
  e8 as cQ,
  U2 as cR,
  a8 as cS,
  kw as cT,
  Wx as cU,
  Xu as cV,
  L2 as cW,
  n5 as cX,
  ab as cY,
  zn as cZ,
  Y2 as c_,
  G0 as ca,
  p5 as cb,
  Py as cc,
  M4 as cd,
  vs as ce,
  Qv as cf,
  O4 as cg,
  Vt as ch,
  Bt as ci,
  q2 as cj,
  Ux as ck,
  ue as cl,
  xu as cm,
  Cu as cn,
  is as co,
  Oh as cp,
  dl as cq,
  t8 as cr,
  s5 as cs,
  zm as ct,
  Yt as cu,
  Tx as cv,
  O2 as cw,
  Rt as cx,
  Xc as cy,
  me as cz,
  je as d,
  Ep as d$,
  ut as d0,
  wm as d1,
  Ri as d2,
  X2 as d3,
  N2 as d4,
  Nt as d5,
  Vx as d6,
  n8 as d7,
  Pr as d8,
  eu as d9,
  R2 as dA,
  Yx as dB,
  kg as dC,
  Sw as dD,
  D2 as dE,
  V2 as dF,
  Nx as dG,
  Px as dH,
  Pe as dI,
  F2 as dJ,
  H2 as dK,
  Lx as dL,
  tp as dM,
  I2 as dN,
  B2 as dO,
  tl as dP,
  nl as dQ,
  Oc as dR,
  P2 as dS,
  Ge as dT,
  o8 as dU,
  _w as dV,
  J2 as dW,
  Ix as dX,
  Hx as dY,
  $w as dZ,
  Kx as d_,
  st as da,
  Z2 as db,
  Qn as dc,
  l8 as dd,
  s8 as de,
  ms as df,
  Dx as dg,
  os as dh,
  I1 as di,
  ao as dj,
  Fl as dk,
  Ac as dl,
  Xx as dm,
  Jx as dn,
  ls as dp,
  Ec as dq,
  Zo as dr,
  z2 as ds,
  Qx as dt,
  a5 as du,
  t5 as dv,
  Q2 as dw,
  Rx as dx,
  kf as dy,
  Bx as dz,
  R5 as e,
  Ho as e0,
  fb as e1,
  Lp as e2,
  jx as e3,
  za as e4,
  qx as e5,
  Fx as e6,
  ct as e7,
  Zx as e8,
  Cc as e9,
  W0 as f,
  xx as g,
  en as h,
  ux as i,
  Sx as j,
  dx as k,
  Q4 as l,
  uw as m,
  ks as n,
  sx as o,
  v5 as p,
  fx as q,
  Rr as r,
  Ir as s,
  Ce as t,
  bv as u,
  Y4 as v,
  wx as w,
  Z4 as x,
  un as y,
  px as z
};
