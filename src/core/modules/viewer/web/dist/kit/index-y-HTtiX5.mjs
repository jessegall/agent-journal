/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as X, Fragment as K, renderList as te, normalizeStyle as fe, defineComponent as Wl, Comment as Hl, h as Wn, cloneVNode as Ul, createBlock as W, withCtx as D, unref as F, createVNode as N, toDisplayString as w, createCommentVNode as C, inject as $e, useAttrs as Hn, computed as B, ref as I, resolveDynamicComponent as kt, mergeProps as Ye, onUnmounted as Re, onMounted as Oe, Teleport as ns, useId as as, resolveDirective as zl, withDirectives as Je, createTextVNode as ne, reactive as ss, shallowRef as ze, watch as he, nextTick as it, Transition as Lt, withModifiers as we, TransitionGroup as jo, shallowReactive as Vl, isRef as Cs, onBeforeUnmount as xt, resolveComponent as Gl, useModel as Ta, getCurrentInstance as Kl, mergeModels as Ra, getCurrentScope as qo, onScopeDispose as Fo, provide as Yl, onErrorCaptured as Jl, toHandlers as Zl, createSlots as Xl, vShow as Wo, useSlots as Ql, withKeys as Kt, vModelText as Ba, defineAsyncComponent as ei } from "vue";
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ti = { class: "skeleton-line" }, ni = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", ti, [
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
}, ut = /* @__PURE__ */ J(ni, [["__scopeId", "data-v-b223ba3e"]]), Nt = Wl({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== Hl);
      return a.length !== 1 ? Wn(K, { key: n }, a) : a[0].key == null ? Ul(a[0], { key: n }) : a[0];
    };
  }
}), ai = ["aria-label"], si = ["aria-label"], oi = ["aria-label"], ri = ["aria-label"], li = ["aria-label"], ii = ["aria-label"], ci = ["aria-label"], ui = {
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
    ], r = ["94%", "88%", "91%", "62%"].map((i) => ({ width: i, height: 10 })), l = [
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
        ], 8, ai)
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
        ], 8, si)
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
        ], 8, oi)
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
        ], 8, ri)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(ut, {
            class: "skeleton-heading",
            bars: l
          }),
          (c(!0), h(K, null, te(e.count, (d) => (c(), W(ut, {
            key: d,
            bars: F(r)
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
            bars: F(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ii)
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
        ], 8, ci)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, $t = /* @__PURE__ */ J(ui, [["__scopeId", "data-v-6e29b4ae"]]), di = {
  key: 1,
  class: "empty-state titled"
}, fi = { class: "empty-state-title" }, hi = { class: "empty-state-text" }, mi = {
  key: 2,
  class: "empty-state"
}, pi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), W($t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", di, [
      g("p", fi, w(e.title), 1),
      g("p", hi, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", mi, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Yt = /* @__PURE__ */ J(pi, [["__scopeId", "data-v-bbb14fd6"]]), gi = { class: "fold-group" }, vi = ["aria-expanded"], yi = { class: "fold-label" }, wi = {
  key: 0,
  class: "fold-count"
}, bi = {
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
    return (a, s) => (c(), h("div", gi, [
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", yi, w(e.label), 1),
        e.count !== "" ? (c(), h("span", wi, w(e.count), 1)) : C("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, vi),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, O2 = /* @__PURE__ */ J(bi, [["__scopeId", "data-v-5a6a4d36"]]), ki = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function ct() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const xi = ["stroke-width", "innerHTML"], me = {
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
    return (o, r) => (c(), h("svg", {
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
    }, null, 12, xi));
  }
}, $i = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Mi = /* @__PURE__ */ J($i, [["__scopeId", "data-v-37ba86f3"]]), Si = 120, _i = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Hn(), a = B(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = I(!1), o = B(() => t.busy || s.value), r = $e(Se, null), l = B(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, Si);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), W(kt(e.href ? "a" : "button"), Ye(a.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: l.value,
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
        o.value ? (c(), W(Mi, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ J(_i, [["__scopeId", "data-v-3411506e"]]), Ei = (e, t, n) => Math.max(t, Math.min(n, e)), Ai = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Ho = /* @__PURE__ */ new WeakMap(), Ci = (e, t) => Ho.set(e, t);
function Oi(e, t) {
  for (let n = t; n; n = Ho.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Uo(e, t) {
  const n = (a) => {
    var o, r;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    s && !Oi(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const At = 8, Ti = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = I(null), o = (p) => p ? `${p}px` : void 0, r = B(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), l = I({ w: 0, h: 0 }), i = I(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (p) => ({
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
        below: p.bottom - _.bottom - a.gap - At,
        above: _.top - p.top - a.gap - At,
        across: p.right - p.left - 2 * At
      };
    }
    function y(p) {
      const _ = f(a.anchor), E = v(_, p);
      return l.value.w <= E.across && l.value.h <= Math.max(E.below, E.above) ? _ : u();
    }
    const O = B(() => {
      if (!i.value) return r.value;
      const p = i.value, _ = y(p), E = v(_, p), { w: $, h: V } = l.value, Z = a.align === "auto" ? p.left + p.right > _.left + _.right : a.align === "right", Y = Ei(Z ? p.right - $ : p.left, _.left + At, Math.max(_.left + At, _.right - $ - At)), ve = V > E.below && E.above > E.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, E.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, E.below) };
      return { ...r.value, ...ve, left: `${Y}px`, maxWidth: m(a.maxWidth, E.across) };
    }), b = n, L = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function z(p) {
      const _ = L(), E = _.indexOf(document.activeElement);
      _[(E + p + _.length) % _.length].focus();
    }
    const ee = { ArrowDown: () => z(1), ArrowUp: () => z(-1), Escape: () => b("close") }, j = (p) => ee[p.key] && (p.preventDefault(), ee[p.key]()), M = () => s.value && (l.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let S = 0;
    const R = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(M);
    });
    Uo(s, (p) => a.anchor && !a.anchor.contains(p.target) && b("close"));
    const A = (p, _) => ["top", "left", "right", "bottom"].some((E) => Math.abs(p[E] - _[E]) > 1), x = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let T = 0;
    function k() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || x(p)) return b("close");
        A(p, i.value) && (i.value = p);
      }
      T = requestAnimationFrame(k);
    }
    return Oe(() => {
      a.anchor && s.value && Ci(s.value, a.anchor), M(), s.value && R.observe(s.value), !a.plain && L()[0] && L()[0].focus(), k();
    }), Re(() => {
      R.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(S);
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
}), Un = /* @__PURE__ */ J(Ti, [["__scopeId", "data-v-7f046e0d"]]), Ri = { class: "split-button" }, Bi = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (r, l) => (c(), h("span", Ri, [
      N(ue, {
        variant: e.variant,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: l[0] || (l[0] = (i) => n("main"))
      }, {
        default: D(() => [
          ce(r.$slots, "default", {}, void 0, !0)
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
          onClick: l[1] || (l[1] = (i) => s.value = !s.value)
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
          ce(r.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : C("", !0)
    ]));
  }
}, Ii = /* @__PURE__ */ J(Bi, [["__scopeId", "data-v-9908ef1d"]]), Li = ["aria-checked", "aria-haspopup", "onClick"], Ni = {
  key: 0,
  class: "segmented-dot"
}, Di = {
  key: 1,
  class: "segmented-note"
}, Pi = {
  key: 2,
  class: "segmented-count"
}, ji = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = as();
    return (s, o) => {
      const r = zl("tip");
      return c(), h("span", {
        class: X(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(K, null, te(e.options, (l) => Je((c(), h("button", {
          key: l.key,
          type: "button",
          role: "radio",
          "aria-checked": l.key === e.value,
          "aria-haspopup": l.opens,
          class: X(["segmented-option", { on: l.key === e.value }]),
          onClick: (i) => n("pick", l.key)
        }, [
          l.dot ? (c(), h("span", Ni)) : C("", !0),
          ne(" " + w(l.label) + " ", 1),
          l.note ? (c(), h("small", Di, w(l.note), 1)) : C("", !0),
          l.count !== void 0 ? (c(), h("em", Pi, w(l.count), 1)) : C("", !0)
        ], 10, Li)), [
          [r, l.tip || l.title, `${F(a)}-${l.key}`]
        ])), 128))
      ], 2);
    };
  }
}, zn = /* @__PURE__ */ J(ji, [["__scopeId", "data-v-7d0b33ab"]]), zo = typeof document < "u" && document.documentElement.classList.contains("phone");
function qi() {
  return () => {
  };
}
function Ia(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Vo(e = window) {
  if (!Ia(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ia(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const La = "journal.stale-build-reload", Fi = 'script[type="module"][src*="/assets/index-"]', Os = (e) => {
  var t;
  return ((t = e.querySelector(Fi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Wi(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => Vo(window)) {
  const a = Os(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Os(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ta = "";
function Hi(e, t = () => Vo(window)) {
  if (!e) return !1;
  const n = !!ta && ta !== e;
  return ta = e, n && t(), n;
}
const Ui = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function zi(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(La) === e.message) return !1;
    t.setItem(La, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Vi(e = window.sessionStorage) {
  try {
    e.removeItem(La);
  } catch {
    return;
  }
}
const Gi = 2e3, Ki = 3e4, De = ss({ starting: !1, external: !1, late: !1, offline: !1 }), Go = () => De.starting, Yi = 3;
let fn = 0, Na = 0, Ko = 0, Yo = [];
async function Ji() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: De.external };
  }
}
let Ts = null;
const Zi = () => Ts ?? (Ts = Ji().finally(() => Ts = null));
function Xi() {
  clearTimeout(Na), clearTimeout(Ko), Na = 0, Object.assign(De, { starting: !1, external: !1, late: !1, offline: !1 }), Yo.splice(0).forEach((e) => e()), Wi();
}
async function Qi() {
  De.offline = !navigator.onLine;
  const e = await Zi();
  if (De.external = e.updating, fn = !e.restarting && !e.updating && e.reachable ? fn + 1 : 0, fn < Yi) return;
  fn = 0, (!Hi(e.started_at) || Ia()) && Xi();
}
function Jo() {
  Na = setTimeout(async () => {
    await Qi(), De.starting && Jo();
  }, Gi);
}
function ec() {
  De.starting || (De.starting = !0, De.offline = !navigator.onLine, Jo(), Ko = setTimeout(() => De.late = !0, Ki));
}
const tc = () => De.starting ? new Promise((e) => Yo.push(e)) : Promise.resolve();
function Zo(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const r = () => {
    s = !1, n = Date.now(), o && (o = !1, i());
  }, l = () => {
    a = null;
    const u = e();
    n = Date.now(), u instanceof Promise && (s = !0, u.catch(() => {
    }).finally(r));
  }, i = () => {
    if (s) {
      o = !0;
      return;
    }
    if (a) return;
    const u = t - (Date.now() - n);
    u <= 0 ? l() : a = setTimeout(l, u);
  };
  return i.cancel = () => {
    clearTimeout(a), a = null, o = !1;
  }, i;
}
function nc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class ac {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Zo(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = nc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const Xe = "viewer.shell", hn = 2e4, sc = 4, Rs = "/api/read-lines", oc = 5e3, rc = 403, Bs = "/api/repeated-lines", lc = 10, ic = 2e3, cc = 3e5, T2 = 6e5, mn = 6, uc = 500, dc = "/journal/summary", Is = "/api/server-state", fc = 2e4, pn = zo ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, hc = (e) => e.split("?")[0].endsWith(dc), Da = (e, t) => Object.assign(new Error(t), { status: e });
async function mc(e, t, n = Da) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const pc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), gc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Ls = (e) => e.split(" ").slice(0, 2).join(" "), tt = "read", Ot = "write", vc = "stream";
class yc {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.written = () => {
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
  requestCounts(t) {
    var s;
    const n = this.sentCounts(t), a = [...((s = this.joinCounts.get(t)) == null ? void 0 : s.values()) ?? []];
    return {
      http_requests: this.httpCounts.get(t) ?? 0,
      logical_commands: Object.entries(n).filter(([o]) => !o.startsWith("/")).reduce((o, [, r]) => o + r, 0),
      joined_callers: a.reduce((o, r) => o + r.joined_callers, 0),
      trailing_reads: a.reduce((o, r) => o + r.trailing_reads, 0),
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Ls(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), r = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < ic));
    if (r.set(a, o), this.recentLines.set(s, r), r.size < lc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const l = JSON.stringify({ window: t, line: n, count: r.size });
    this.out(Bs, { method: "POST", headers: { ...pn, "Content-Type": "application/json" }, body: l }, [{ window: Xe, line: Bs, kind: Ot }]).catch(() => {
    });
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), r = s ? { ...n, signal: gc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Ot ? { ...r, priority: "high" } : r);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = hn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && ec(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= sc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Rs, { headers: pn }, [{ window: Xe, line: Rs, kind: tt }], oc).then(async (t) => {
      if (t.status === rc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Da(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new ac(
      (r, l) => n(r, s ? this.readAttribution(l) : void 0),
      () => this.joinedReads.delete(t),
      (r, l) => {
        s && this.trackRead(s, r, l);
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), r = Ls(n.join(" ")), l = o.get(r) ?? { joined_callers: 0, trailing_reads: 0 };
    a === "asked" && s.callers > 1 && (l.joined_callers += 1), a === "sent" && s.trailingOf && (l.trailing_reads += 1), o.set(r, l), this.joinCounts.set(t, o), !(a !== "answered" || !this.recording) && (this.readReceipts.push(this.readAttribution(s)), this.receiptTimer ?? (this.receiptTimer = setTimeout(() => this.flushReadReceipts(), 50)));
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
  async reach(t, n, a, s, o, r = {}) {
    const l = a instanceof FormData, i = { method: t, headers: { ...pn, ...r, ...a === void 0 || l ? {} : { "Content-Type": "application/json" } }, body: pc(a) }, u = s || (l ? cc : hn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: Xe, line: n, kind: tt }], u)) : await this.sent(n, i, [{ window: Xe, line: n, kind: Ot }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, uc)), this.reach(t, n, a, s, o - 1, r);
    }
  }
  async send(t, n, a, s = 0, o = mn, r = {}) {
    this.watcher("sent", t, n, a);
    const l = t === "GET" ? () => {
    } : qi(), i = await this.reach(t, n, a, s, o, r).finally(() => {
      l(), this.watcher("answered", t, n, a);
    });
    return mc(i, `${i.status} ${i.statusText}`).catch((u) => {
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
  request(t, n, a, s = 0, o = {}, r = n.split("?")[0]) {
    return t !== "GET" ? this.send(t, n, a, s, mn, o).then((l) => (this.written(n), l)) : Go() && !hc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(r, () => this.send(t, n, a, 0, this.tries, o));
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
    return this.out(Is, { cache: "no-store" }, [{ window: Xe, line: Is, kind: tt }], fc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = Xe, line: s = t, limit: o = hn } = {}) {
    const r = (n.method ?? "GET") === "GET" ? tt : Ot;
    return r === Ot ? this.sent(t, n, [{ window: a, line: s, kind: r }], 0) : this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: r }], o));
  }
}
const na = Symbol.for("journal.transport"), Ae = globalThis[na] ?? (globalThis[na] = new yc()), wc = 0, bc = "/api/lines", kc = "/api/line", Ns = 5e3, Ds = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ps = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), aa = (e) => JSON.stringify(e.line), js = () => new DOMException("cancelled", "AbortError");
class xc {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const r = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(aa(t))) {
        Ae.whenFree(() => this.readAlone(r));
        return;
      }
      this.waiting.push(r), this.sendSoon();
    });
  }
  // a write always finishes, also when its window has gone: it carries no signal
  write(t) {
    return new Promise((n, a) => this.alone({ body: t, resolve: n, reject: a }, Ot));
  }
  sendSoon() {
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), wc));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(js())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(js()), n.abort();
    });
    t.forEach((o, r) => {
      var l;
      return (l = o.signal) == null ? void 0 : l.addEventListener("abort", s[r], { once: !0 });
    });
    try {
      const o = await Ae.sent(bc, Ds({ lines: t.map((l) => l.body) }, n.signal), t.map((l) => Ps(l.body, tt)), Ns), { answers: r } = await o.json();
      t.forEach((l, i) => l.resolve(r[i]));
    } catch (o) {
      n.signal.aborted ? (this.waiting.push(...a), a.size && this.sendSoon()) : o.name === "TimeoutError" ? t.forEach((r) => Ae.whenFree(() => this.readAlone(r))) : t.forEach((r) => r.reject(o));
    } finally {
      t.forEach((o, r) => {
        var l;
        return (l = o.signal) == null ? void 0 : l.removeEventListener("abort", s[r]);
      });
    }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, tt), Date.now() - n < Ns ? this.slow.delete(aa(t.body)) : this.slow.add(aa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(kc, Ds(t.body, t.signal), [Ps(t.body, n)], n === tt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Xo = new xc(), $c = 150, Mc = () => $c;
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
    return this.following.value = [...this.follows, o], () => this.following.value = this.follows.filter((r) => r !== o);
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
      n.patterns.some((a) => Qo(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Qo(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const er = /* @__PURE__ */ new Map();
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
      runs_missing: n.map(({ label: o, line: r }) => `${o}: ${r}`).join(", ")
    }) ? (await this.load(), !((s = this.offers.value.missing[t]) != null && s.length)) : !1 : !0;
  }
}
function R2(e, t) {
  const n = new _c(e, t);
  return er.set(e, n), n.load().catch(() => {
  }), n;
}
const rs = (e) => er.get(e);
function Ec(e, t, n) {
  const a = rs(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ac(e, t) {
  if (!e) return !0;
  const n = rs(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Cc = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let tr = {};
async function B2(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (tr = (await t.json()).states);
}
const ls = (e, t) => {
  var n;
  return (n = tr[e]) == null ? void 0 : n[t];
}, nr = (e, t) => {
  var n;
  return ((n = ls(e, t)) == null ? void 0 : n.label) ?? Cc(t);
}, ar = (e, t) => {
  var n;
  return ((n = ls(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Oc = (e, t) => {
  var n;
  return ((n = ls(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Tc = Symbol("pane-page"), Rc = Symbol("inspector-host"), Bc = { 1: "refused", 2: "usage", 3: "fault" }, Ic = 100, Lc = 50, Nc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Dc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Pc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: r, open: l, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: O = {}, search: b = {}, readOnly: L = !1, shared: z = null }) {
  const ee = /* @__PURE__ */ new Map(), j = new AbortController(), M = I(!1), S = performance.now();
  let R = 0, A = 0, x = () => {
  };
  const T = new Promise(($) => x = $);
  j.signal.addEventListener("abort", x, { once: !0 });
  const k = () => {
    clearTimeout(A), A = setTimeout(() => {
      R === 0 && os(S, () => {
        M.value = !0, x();
      });
    }, Lc);
  }, p = ($, V) => (R += 1, at(e, $, t, j.signal, V).finally(() => {
    R -= 1, k();
  })), _ = ($, V) => (k(), T.then(() => j.signal.aborted ? yt : at(e, $, t, j.signal, V))), E = ($, { unbatched: V = !1, deferred: Z = !1 } = {}) => {
    const Y = ee.get($);
    if (Y && performance.now() - Y.at < Ic) return Y.answer;
    const ie = Z && !M.value ? _($, V) : p($, V);
    return ee.set($, { answer: ie, at: performance.now() }), ie;
  };
  return {
    answered: M,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: B(() => a()),
    permissions: s,
    autoScroll: m,
    tabs: v,
    sources: y,
    links: O,
    search: b,
    readOnly: L,
    shared: z,
    read: E,
    run: ($) => at(e, $, t, j.signal),
    upload: ($) => qc($, e, j.signal),
    cancel: () => j.abort(),
    signal: j.signal,
    subscriptions: r,
    follow: ($, V) => r.follow(e, $.filter((Z) => o.some((Y) => Qo(Y, Z))), (Z) => {
      ee.clear(), V(Z);
    }, a),
    open: l,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: ($) => B(() => {
      var V;
      return i.value[$] ?? ((V = u.find((Z) => Z.key === $)) == null ? void 0 : V.default);
    }),
    setting: async ($, V) => {
      const Z = await E(`window setting ${e} ${$}`);
      return Z.ok ? Z.value.value : V;
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
const yt = { ok: !1, failure: "cancelled", error: "" }, sr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function or(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? yt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Bc[n.code] || "fault", error: jc(n.error) };
  } catch {
    return t != null && t.aborted ? yt : { ok: !1, failure: "unreachable", error: sr };
  }
}
async function rr(e, t, n) {
  const a = await or(() => Xo.read(e, t, n), t);
  return a.failure !== "unreachable" || !Go() ? a : (await tc(), t.aborted ? yt : rr(e, t, n));
}
async function at(e, t, n, a = void 0, s = !1) {
  const o = { window: e, line: Array.isArray(t) ? t : lr(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (r, l) => rr({ ...o, attribution: l }, r, s), a, o).catch(() => yt) : or(() => Xo.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function qc(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? yt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? yt : { ok: !1, failure: "unreachable", error: sr };
  }
}
function lr(e) {
  return [...e.matchAll(Nc)].map(([t]) => t.replace(Dc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Fc = (e) => `show-${e}`, I2 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Fc((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ir = "messages.chat", Wc = {
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
    const n = e, a = t, s = I([]), o = I(""), r = B(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), l = B(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await at(ir, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
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
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      l.value ? (c(), h("p", Wc, w(l.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", Hc, w(o.value), 1)) : C("", !0)
    ], 64));
  }
}, zc = /* @__PURE__ */ J(Uc, [["__scopeId", "data-v-8c3f5d57"]]), Vc = { class: "form-field" }, Gc = { class: "form-field-head" }, Kc = ["for"], Yc = {
  key: 0,
  class: "form-field-aside"
}, Jc = {
  key: 0,
  class: "form-field-help"
}, Zc = {
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
      e.help ? (c(), h("p", Jc, w(e.help), 1)) : C("", !0)
    ]));
  }
}, Xc = /* @__PURE__ */ J(Zc, [["__scopeId", "data-v-8f255b8f"]]), Pa = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Qc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Hn(), n = B(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((c(), h("textarea", Ye({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [F(Pa), F(t).value]
    ]);
  }
}), eu = /* @__PURE__ */ J(Qc, [["__scopeId", "data-v-11521837"]]), tu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = as(), o = B(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, l) => (c(), W(Xc, {
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
              onPick: l[0] || (l[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            N(zc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: l[1] || (l[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            N(eu, {
              id: F(s),
              value: e.value,
              onInput: l[2] || (l[2] = (i) => a("pick", i.target.value))
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
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const au = (e, t = () => !0) => nu("keydown", (n) => n.key === "Escape" && t() && e());
function cr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = B(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return au(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const su = 80, Ct = ss([]);
function ur(e) {
  const t = Symbol("layer"), n = () => Ct.includes(t) && Ct.splice(Ct.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Ct.includes(t) && Ct.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), B(() => su + Math.max(0, Ct.indexOf(t)));
}
let dr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return dr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const ou = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ru(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(ou)];
    if (!r.length) return o.preventDefault();
    const [l, i] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === l ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), l.focus({ preventScroll: !0 }));
  }
  Oe(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : dr, document.addEventListener("keydown", s), it(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const lu = ["aria-modal", "aria-label", "aria-labelledby"], iu = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = cr(a, n), l = ur(s), i = I(null), u = I(null), d = I(null), f = as(), m = I(!1), v = Date.now();
    n.modal && ru(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, fu);
    }
    function O(z) {
      !n.modal || Date.now() - v >= du || ![" ", "Enter"].includes(z.key) || (z.preventDefault(), z.stopPropagation());
    }
    const b = () => i.value && (i.value.scrollTop = i.value.scrollHeight), L = new MutationObserver(b);
    return he(i, (z) => {
      L.disconnect(), z && n.follow && (L.observe(z, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), Re(() => L.disconnect()), (z, ee) => (c(), W(ns, { to: "body" }, [
      N(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: F(r)
      }, {
        default: D(() => [
          F(s) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: F(l) }),
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
            ], 42, lu)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, fr = /* @__PURE__ */ J(hu, [["__scopeId", "data-v-484a731f"]]), mu = (e, t, n = {}) => lr(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function an(e, t, n, a = {}) {
  try {
    return await Ac(e.module, n) ? at(ir, mu(e, t, a), n) : { ok: !1, error: "" };
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
}, gu = ["secrets", "plugins"], hr = Object.keys(Vn).filter((e) => !(zo && gu.includes(e)));
B(() => hr.map((e) => ({ name: e, ...Vn[e] })));
const Dt = (e) => Vn[e], mr = new Map(hr.flatMap((e) => [e, e.replace(/s$/, ""), Vn[e].title.toLowerCase()].map((t) => [t, e]))), Ge = (e) => mr.get(String(e).toLowerCase()) || "", pr = [...mr.keys()].sort((e, t) => t.length - e.length).join("|"), vu = {
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
    const n = e, a = t, s = I(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = I(!1), r = I(""), l = B(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = B(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Dt(Ge(n.row.noun))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !l.value) return;
      o.value = !0;
      const d = await an(n.button, n.row, n.environment, s.value);
      o.value = !1, r.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), W(fr, {
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
            r.value ? (c(), h("p", wu, w(r.value), 1)) : C("", !0),
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
                disabled: !l.value || o.value,
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
}, xu = /* @__PURE__ */ J(ku, [["__scopeId", "data-v-e77a3ca7"]]), $u = {
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
}, wt = /* @__PURE__ */ J(Su, [["__scopeId", "data-v-9c67fe37"]]), _u = ["aria-busy"], Eu = {
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
    const n = e, a = t, s = B(() => rs(n.environment)), o = B(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), r = B(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), l = () => s.value.load().catch(() => {
    }), i = B(() => n.readOnly ? [] : Ec(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function v(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const O = await an(y, n.row, n.environment);
      f.value = !1, d.value = O.ok ? "" : O.error;
      const b = y.label.toLowerCase() + (n.objectName && !y.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", O.ok ? "" : `Could not ${b}: ${O.error}`), O.ok && a("done");
    }
    return (y, O) => (c(), h("span", {
      class: X(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && r.value ? (c(), h(K, { key: 0 }, [
        O[3] || (O[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        N(ue, {
          small: "",
          onClick: l
        }, {
          default: D(() => [...O[2] || (O[2] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? C("", !0) : (c(), h(K, { key: 1 }, [
        (c(!0), h(K, null, te(i.value, (b) => (c(), h(K, {
          key: b.name
        }, [
          b.menu.length ? (c(), W(Ii, {
            key: 0,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": b.menu_label || "More ways",
            title: m(b),
            "data-button": b.name,
            onMain: (L) => v(b)
          }, {
            menu: D(({ close: L }) => [
              (c(!0), h(K, null, te(b.menu, (z) => (c(), W(wt, {
                key: z.label,
                description: z.description,
                onClick: (ee) => (L(), v({ ...b, ...z, menu: [] }))
              }, {
                default: D(() => [
                  ne(w(z.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              ne(w(b.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["variant", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), W(ue, {
            key: 1,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            bordered: !b.primary,
            icon: b.icon,
            disabled: f.value,
            title: m(b),
            "data-button": b.name,
            onClick: (L) => v(b)
          }, {
            default: D(() => [
              ne(w(b.label), 1)
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
          onClose: O[0] || (O[0] = (b) => u.value = null),
          onDone: O[1] || (O[1] = (b) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, _u));
  }
}, Cu = /* @__PURE__ */ J(Au, [["__scopeId", "data-v-08a87e69"]]), Ou = {
  class: "running",
  "data-running-command": ""
}, Tu = ["title"], Ru = {
  key: "idle",
  class: "running-idle"
}, Bu = {
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
          }, w(e.text), 9, Tu)) : (c(), h("span", Ru, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, L2 = /* @__PURE__ */ J(Bu, [["__scopeId", "data-v-8311b32c"]]), Iu = ["aria-checked", "aria-label", "title"], Lu = {
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
}, N2 = /* @__PURE__ */ J(Du, [["__scopeId", "data-v-688091a6"]]);
function gr(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function On(e, t) {
  return gr(() => localStorage, e, t);
}
function vr(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function cs(e, t) {
  return vr(() => localStorage, e, t);
}
function yr(e, t) {
  he(t, (n) => cs(e, n), { deep: !0 });
}
function Pu(e, t) {
  return gr(() => sessionStorage, e, t);
}
function ju(e, t) {
  return vr(() => sessionStorage, e, t);
}
const Tn = "journal.environment", wr = I(Pu(Tn, On(Tn, "")));
function qu(e) {
  wr.value = e, ju(Tn, e), cs(Tn, e);
}
const Rn = I(location.hash), qs = ze(null), Fs = { integrations: "mcp", library: "team" };
function Fu() {
  if (!qs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Fs[n]) {
    location.replace(`#/${[Fs[n], ...a].join("/")}${t ? `?${t}` : ""}`), Rn.value = location.hash;
    return;
  }
  !n || qs.value(n) || (qu(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Rn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Rn.value = location.hash, Fu();
});
const ja = B(() => {
  const [e, t = ""] = Rn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [l, i = ""] = r.split("@"), [u = "", d = "", f = ""] = l.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: wr.value,
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
function br(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([r]) => r !== "open" && r !== "sub").map(([r, l]) => `${r}=${encodeURIComponent(l)}`), ...e.length ? [`open=${e.map(Hu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Rt = {};
function D2(e, t) {
  return Rt[e] = t, () => Rt[e] === t && delete Rt[e];
}
function kr(e, t, n = 0, a = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((r = Rt[e]) != null && r.call(Rt, t))) return;
  const s = ja.value.stack, o = s.findIndex((l) => l.table === e && l.id === t);
  br([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Uu(e, t, n, a = 0, s = "") {
  if (e === ja.value.env) return kr(t, n, a, s);
  const o = ja.value.stack, r = o.findIndex((l) => l.table === t && l.id === n && l.env === e);
  br([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Uu(a, s, Number(o), 0, t) : kr(s, Number(o), 0, t);
}
function zu(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Tt(e) {
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
}, j2 = /* @__PURE__ */ J(Ku, [["__scopeId", "data-v-426868e9"]]), Yu = {
  key: 1,
  class: "row-list-failure"
}, Ju = ["data-row"], Zu = {
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
    const t = e, n = B(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = I(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure && !e.rows.length ? (c(), W($t, {
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
      (c(), W(kt(e.arrival ? jo : "ul"), Ye(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), h(K, null, te(e.rows, (l) => (c(), h("li", {
            key: l.id,
            class: "row-list-row",
            "data-row": l.id
          }, [
            ce(o.$slots, "default", { row: l }, void 0, !0)
          ], 8, Ju))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (l) => s(e.older))
      }, "Show more")) : C("", !0)
    ], 64));
  }
}, Xu = /* @__PURE__ */ J(Zu, [["__scopeId", "data-v-3eb1aa55"]]), Qu = {
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
}, ad = ["data-agent-row", "onClick"], sd = { class: "agent-row-name" }, od = { class: "agent-row-state" }, rd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = B(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Qu, [
      e.loaded ? e.failure ? (c(), h("p", ed, w(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        g("p", nd, w(a.value) + " running", 1),
        (c(!0), h(K, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (l) => F(Pe)(`agents:${r.id}`)
        }, [
          g("span", sd, "#" + w(r.id) + " " + w(r.session), 1),
          g("span", od, w(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, ad))), 128))
      ], 64)) : (c(), h("p", td, w(e.none), 1)) : (c(), W($t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, q2 = /* @__PURE__ */ J(rd, [["__scopeId", "data-v-7e3656dc"]]), ld = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, w(e.text), 3));
  }
}, xr = /* @__PURE__ */ J(ld, [["__scopeId", "data-v-6ef74765"]]), id = ["aria-valuenow", "aria-valuemax"], cd = {
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
    const t = e, n = B(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
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
}, ud = /* @__PURE__ */ J(cd, [["__scopeId", "data-v-5045237e"]]), dd = { class: "bars" }, fd = { class: "bar-name" }, hd = { class: "bar-value" }, md = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, l) => (c(), h("div", dd, [
      (c(!0), h(K, null, te(e.items, (i, u) => (c(), W(kt(i.open ? "button" : "div"), {
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
}, pd = /* @__PURE__ */ J(md, [["__scopeId", "data-v-09485718"]]), gd = { class: "bars" }, vd = {
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
}, wd = /* @__PURE__ */ J(yd, [["__scopeId", "data-v-a9861a72"]]), bd = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = B(() => n[a.node.type](a.node));
    return (r, l) => (c(), h("div", {
      class: X([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(K, null, te(e.node.children || [], (i, u) => (c(), W(Dr, {
        key: u,
        node: i,
        onOpen: l[0] || (l[0] = (d) => s("open", d)),
        onFile: l[1] || (l[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Mn = /* @__PURE__ */ J(bd, [["__scopeId", "data-v-2a5c17d3"]]), kd = {
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
}, Sd = /* @__PURE__ */ J(Md, [["__scopeId", "data-v-bb0b3bdb"]]), _d = { processes: "process", memories: "memory", replies: "reply" }, Ht = (e) => (_d[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), qa = [], Ed = 2e3, et = /* @__PURE__ */ new Map(), Ad = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Cd = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Mt(e, { first: t = !1 } = {}) {
  t ? qa.unshift(e) : qa.push(e), et.clear();
}
function $r(e, t, n) {
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
function Rd(e, t) {
  const n = [{ type: "text", text: Ke(e).replace(/\r\n/g, `
`) }];
  for (const a of qa)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const r = a(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(s, 1, ...r);
    }
  return n;
}
function Jt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Bd(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Bd(e) {
  return e.split(Cd).map((t, n) => n % 2 ? t : t.replace(Ad, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ws(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Id = 24;
function Ld(e) {
  const [t, , ...n] = e, a = Ws(t), s = n.map(Ws), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Id) ? ' class="text-column"' : "", r = a.map((i, u) => `<th${o(u)}>${Jt(i)}</th>`).join(""), l = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${Jt(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${r}</tr></thead><tbody>${l}</tbody></table>`;
}
const Mr = /^\s*(?:[-*+]|\d+[.)])\s+/, Fa = /^\s*(\d+)[.)]\s/, Hs = (e) => e.match(/^\s*/)[0].length;
function Sr(e) {
  const t = e[0].match(Fa), n = Hs(e[0]), a = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), l = a[a.length - 1];
    r && Hs(o) <= n ? a.push({ text: r[2], nested: [] }) : l && o.trim() && (r || l.nested.length) ? l.nested.push(o) : l && o.trim() && (l.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Jt(o.text)}${o.nested.length ? Sr(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Nd(e, t) {
  const n = Fa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (Mr.test(e[s]) && Fa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Us = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function _r(e) {
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
      const l = t.findIndex((u, d) => d > a && /^(```|~~~)/.test(u)), i = l < 0 ? t.length : l;
      n.push(`<pre><code>${t.slice(a + 1, i).join(`
`)}</code></pre>`), a = i + 1;
      continue;
    }
    const o = s.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const l = Math.min(6, o[1].length + 2);
      n.push(`<h${l}>${Jt(o[2])}</h${l}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Us(t, a)) {
      let l = a + 2;
      for (; l < t.length && t[l].includes("|"); ) l += 1;
      n.push(Ld(t.slice(a, l))), a = l;
      continue;
    }
    if (Mr.test(s)) {
      const l = Nd(t, a);
      n.push(Sr(t.slice(a, l))), a = l;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let l = a;
      for (; l < t.length && /^(?:>|&gt;)\s?/.test(t[l]); ) l += 1;
      n.push(
        `<blockquote>${_r(
          t.slice(a, l).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = l;
      continue;
    }
    let r = a;
    for (; r < t.length && t[r].trim() && !Us(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Jt(t.slice(a, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = r;
  }
  return n.join("");
}
const Dd = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Pd = (e) => e.type !== "text" && !Dd.test(e.html);
function jd(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(_r(a).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Pd(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function qd(e, t = { env: "" }) {
  const n = Td(e, t), a = et.get(n);
  if (et.delete(n), a && a.source === t.source && a.reads.every((r) => Od(r, t)))
    return et.set(n, a), a.html;
  const s = [], o = jd(Rd(e, { ...t, reads: s }));
  return et.set(n, { html: o, reads: s, source: t.source }), et.size > Ed && et.delete(et.keys().next().value), o;
}
const oa = /* @__PURE__ */ new WeakMap();
function Fd(e) {
  if (oa.has(e)) return oa.get(e);
  const t = Vl(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Ht(u)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function r(u) {
    a.has(u) || (a.add(u), e.follow([`${Ht(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const m of t.keys()) {
        if (!m.startsWith(f)) continue;
        const v = Number(m.slice(f.length));
        (!d.row_id || d.row_id === v) && o(u, v);
      }
    }));
  }
  function l(u, d) {
    r(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: l };
  return oa.set(e, i), i;
}
function Er() {
  const e = $e(Se, null), t = e ? Fd(e) : null;
  return (n, a = {}) => qd(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Ar = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, sn = (e) => String(e || "").replace(Ar, (t, n, a, s) => s), Wd = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), gn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Hd = /^Traceback \(most recent call last\):/m, Ud = 8;
function Cr(e) {
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
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), r = [...o.matchAll(gn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((l) => l[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Cr(n), tail: "" } : null;
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
  return { lead: e.slice(0, t.index), html: Cr([o]), tail: n.slice(s).join(`
`) };
}
Mt((e) => {
  const t = sn(e), n = Vd(t) || zd(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Gd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Kd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Yd = /[\w\]]\(/, Jd = /^[\w$.[\]'"]+\s*=\s*[^=]/, Zd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Xd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Qd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, ef = /[[({,]$/, tf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, nf = /^(\t|\s{2,})\S/, af = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, sf = /`[^`]+`/, of = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, rf = /[{}()[\];=<>$&|*\\@+^~%]/g, Or = /^\s*(?:[-*+]|\d+[.)])\s/, lf = /^\s*>/, cf = /^\s*\|/, uf = 0.6, df = 0.4, ff = 5, hf = 0.03, Tr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ff && t.every((n) => of.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(rf) ?? []).length / e.length < hf;
}, ra = (e) => {
  const t = e.trim();
  return sf.test(t) ? !1 : [Gd, Kd, Yd, Jd, Zd, Xd, Qd, ef, tf].some((n) => n.test(t)) || /[;{}]$/.test(t) || nf.test(e) && !Or.test(e) && !Tr(e);
};
function mf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Or.test(t[0]) || t.every((o) => lf.test(o) || cf.test(o))) return "text";
  const n = t.filter((o) => !af.test(o.trim()));
  if (t.length === 1) return !n.length || ra(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(ra).length, s = n.filter((o) => !ra(o) && Tr(o)).length;
  return a >= n.length * uf && s <= n.length * df ? "code" : "text";
}
const Wa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", pf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", gf = `${Wa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, vf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", yf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", zs = {
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
function Vs(e, t, n) {
  return n && e.startsWith(n, t);
}
function bf(e, t) {
  const n = zs[wf[t] ?? t] || zs.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const r = (l, i) => i && s.push({ type: l, value: i });
  for (; o < e.length; ) {
    const l = e[o];
    if (n.markdown) {
      const u = e.indexOf(`
`, o), d = e.slice(o, u < 0 ? e.length : u);
      r(
        /^#{1,6}\s/.test(d) ? "keyword" : /^(```|~~~)/.test(d) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(d) ? "number" : "plain",
        d
      ), r("plain", u < 0 ? "" : `
`), o = u < 0 ? e.length : u + 1;
      continue;
    }
    if (Vs(e, o, n.line) || n.hash && l === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Vs(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      r("comment", e.slice(o, d)), o = d;
      continue;
    }
    const i = (n.triple || []).find((u) => e.startsWith(u, o));
    if (i) {
      const u = e.indexOf(i, o + 3), d = u < 0 ? e.length : u + 3;
      r("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(l)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== l && (l === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      r(n.keyed && /^\s*:/.test(e.slice(u + 1)) ? "property" : "string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && l === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      r("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(l)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, m = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(a.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
      continue;
    }
    if (/\d/.test(l)) {
      const u = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      r("number", u[0]), o += u[0].length;
      continue;
    }
    if (n.tags && (l === ">" || e.startsWith("/>", o))) {
      const u = l === ">" ? 1 : 2;
      r("keyword", e.slice(o, o + u)), o += u;
      continue;
    }
    r("plain", l), o += 1;
  }
  return s;
}
function kf(e, t) {
  const n = [""];
  for (const { type: a, value: s } of bf(e, t))
    s.split(`
`).forEach((r, l) => {
      l && n.push(""), r && (n[n.length - 1] += a === "plain" ? Ke(r) : `<span class="tok-${a}">${Ke(r)}</span>`);
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
const $f = 1500, Gs = /* @__PURE__ */ new WeakMap();
async function Mf(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await xf(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Gs.get(t)), Gs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, $f)
  )));
}
typeof document < "u" && document.addEventListener("click", Mf, !0);
const Sf = /\n\s*\n/, _f = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Ef = /^\s*(`{3,}|~{3,})\s*$/, Af = /^\s{4,}\S/, Cf = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ha = /^\s*(?:[-*+]|\d+[.)])\s/, Rr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Of = [
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
const Rf = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Rr.test(t) && !Ha.test(t);
}, Bf = (e, t) => Ha.test(t) || Ha.test([...e].reverse().find((n) => n.trim()) || "");
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
  const t = e.split(Sf).map((r) => ({ paragraph: r, type: mf(ds(r).split(`
`)) })), n = [];
  let a = [];
  const s = () => {
    a.length && n.push({ type: "text", text: a.join(`

`) }), a = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let r = o;
    for (; r < t.length && t[r].type !== "text"; ) r += 1;
    const l = t.slice(o, r);
    if (l.some(({ type: i }) => i === "code") || l.length > 1) {
      s(), n.push(fs(l.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(sn), "")), o = r;
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
  let r = 0;
  for (; r < n.length; ) {
    const l = n[r].match(_f);
    if (l) {
      const u = If(n, r, l[2]);
      o(), a.push(Lf(n.slice(r + 1, u), l[1], l[3])), r = u + 1;
      continue;
    }
    const i = Rf(s) ? Cf : Af;
    if (!t && i.test(n[r]) && !Bf(s, n[r])) {
      let u = r;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Rr.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - r + d.length >= 2) {
        o(), a.push(fs([...d, ...n.slice(r, u)].map(sn), "")), r = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[r]), r += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Mt((e, t) => Df(e, t.document));
const Bn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Br = (e) => `${e.table}:${e.id}`, Ks = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", la = 80;
function Ys(e) {
  return e.length <= la ? e : `${e.slice(0, la + 1).replace(/\s+\S*$/, "") || e.slice(0, la)}…`;
}
const Js = {
  messages: (e) => Ys(Ks(e.text)),
  comments: (e) => Ys(Ks(e.text)),
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
}, Pf = (e) => (Js[e.table] ? Js[e.table](e) : e.title || "") || "", bt = (e) => Bn(e.created_at), Ir = (e) => Bn(e.updated_at) || bt(e), jf = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, qf = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Ff(e) {
  const t = jf.exec(e);
  if (t && Ge(t[1])) return { at: t.index, length: t[0].length, table: Ge(t[1]), id: Number(t[2]), label: t[3] };
  const n = qf.exec(e), a = n && Ge(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Wf(e, t, n, a) {
  const s = $r(a, e, t), o = sn(s ? Pf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Ke(Dt(e).title)} ${t}</span><span class="row-card-title">${Ke(o)}</span></a>`;
}
Mt(
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
  const n = zf.exec(e), [, a, s, o, r, l] = n || [], i = n && Ge(a || o), u = i && $r(t, i, Number(s || r));
  if (i !== "messages" || !u || !(u.files || []).includes(l)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(l)}`, f = `${Dt(i).title} ${u.id} · ${Ke(l)}`, m = Uf(l) ? `<img class="file-card-image" src="${d}" alt="${Ke(l)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ke(l)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Kf(e) {
  const t = Vf.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ke(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Mt(
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
Mt((e) => e.replace(Yf, (t, n) => `<code>${n}</code>`));
const Zs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${us.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Mt(
  (e, t) => e.replace(Ar, (n, a, s, o) => Zs[a] ? Zs[a](s, o, t) : o)
);
const Jf = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Lr = new RegExp(`\\b(${pr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Nr = new RegExp(`\\b(${pr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Zf = new RegExp(`<code>((?:${Lr.source}|${Nr.source}))</code>`, "gi"), Xf = (e) => e.replace(Zf, "$1"), Qf = (e, t) => `<a class="row-pill" href="#" data-peek="${Ge(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, eh = (e) => e.replace(Nr, (t, n, a) => a.replace(/\d+/g, (s) => Qf(n.replace(/s$/i, ""), s))), th = (e) => eh(e).replace(
  Lr,
  (t, n, a, s = "", o) => {
    const r = a || o;
    return `<a class="row-pill" href="#" data-peek="${Ge(n)}:${r}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${r}${s ? `:${s}` : ""}</span></a>`;
  }
);
Mt(
  (e, t) => t.rowNames === !1 ? e : Xf(e).split(Jf).map((n, a) => a % 2 ? n : th(n)).join("")
);
const nh = ["innerHTML"], ah = ["innerHTML"], sh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Er(), a = B(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((r) => r.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...r) => F(Tt) && F(Tt)(...r)),
      innerHTML: a.value
    }, null, 8, nh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...r) => F(Tt) && F(Tt)(...r)),
      innerHTML: a.value
    }, null, 8, ah));
  }
}, st = /* @__PURE__ */ J(sh, [["__scopeId", "data-v-7cbf7b8a"]]), oh = { class: "fact" }, rh = { class: "fact-label" }, lh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", oh, [
      g("span", rh, w(e.label), 1),
      N(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, ih = /* @__PURE__ */ J(lh, [["__scopeId", "data-v-a0ce1d97"]]), ch = { class: "list" }, uh = { class: "list-label" }, dh = {
  key: 1,
  class: "list-note"
}, fh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", ch, [
      (c(!0), h(K, null, te(e.items, (o, r) => (c(), W(kt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (l) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", uh, w(o.label), 1),
          o.badge ? (c(), W(xr, {
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
}, hh = /* @__PURE__ */ J(fh, [["__scopeId", "data-v-e2e240a1"]]), mh = { class: "table" }, ph = {
  key: 0,
  class: "table-row empty"
}, gh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", mh, [
      g("div", {
        class: "table-row head",
        style: fe(s.value)
      }, [
        (c(!0), h(K, null, te(e.columns, (l) => (c(), h("span", {
          key: l,
          class: "cell"
        }, w(l), 1))), 128))
      ], 4),
      (c(!0), h(K, null, te(e.rows, (l, i) => (c(), W(kt(l.open ? "button" : "div"), {
        key: i,
        type: l.open ? "button" : void 0,
        class: X(["table-row", l.tone, { opens: l.open }]),
        style: fe(s.value),
        onClick: (u) => l.open && a("open", l.open)
      }, {
        default: D(() => [
          (c(!0), h(K, null, te(l.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, w(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", ph, w(e.empty), 1)) : C("", !0)
    ]));
  }
}, vh = /* @__PURE__ */ J(gh, [["__scopeId", "data-v-349d16ca"]]), yh = { class: "stat-value" }, wh = { class: "stat-label" }, bh = {
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
    return (a, s) => (c(), W(kt(e.opens ? "button" : "div"), {
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
}, xh = /* @__PURE__ */ J(kh, [["__scopeId", "data-v-bf2aa36f"]]), $h = { class: "code" }, Mh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, r) => (c(), W(Nt, {
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
      divider: D(() => [...r[2] || (r[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        N(xh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (l) => a(e.node.open))
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
        N(xr, {
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
          onClick: r[1] || (r[1] = (l) => s(e.node))
        }, w(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Dr = /* @__PURE__ */ J(Mh, [["__scopeId", "data-v-92ed1e03"]]), Sh = { class: "dashboard" }, _h = { class: "trail" }, Eh = ["onClick"], Ah = {
  key: 0,
  class: "gone",
  role: "status"
}, Ch = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (m) => m in (n.document.pages || {}), o = I(!!n.page && !s(n.page)), r = I(n.page && !o.value ? [n.page] : []), l = B(() => r.value.at(-1) || n.document.start), i = B(() => (n.document.pages || {})[l.value] || null), u = (m) => ((n.document.pages || {})[m] || {}).title || m, d = (m) => {
      o.value = !1, r.value = [...r.value, m];
    }, f = (m) => {
      o.value = !1, r.value = r.value.slice(0, m);
    };
    return he(
      () => n.document.start,
      () => r.value = []
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
            class: X(["step", { current: !r.value.length }]),
            onClick: v[0] || (v[0] = (y) => f(0))
          }, w(u(e.document.start)), 3),
          (c(!0), h(K, null, te(r.value, (y, O) => (c(), h(K, {
            key: `${O}-${y}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: X(["step", { current: O === r.value.length - 1 }]),
              onClick: (b) => f(O + 1)
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
              key: l.value,
              class: "page"
            }, [
              N(Dr, {
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
}, Oh = /* @__PURE__ */ J(Ch, [["__scopeId", "data-v-9e88e6d3"]]), Qe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ne = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Le = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Th = 6;
function hs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Rh = (e) => {
  const t = hs(e, Qe.lineChars), n = Math.max(Qe.minWidth, Math.max(...t.map((a) => a.length)) * Qe.charWidth + Qe.padX * 2);
  return { name: e, lines: t, line: Qe.line, padY: Qe.padY, width: n, height: t.length * Qe.line + Qe.padY * 2 };
};
function Bh(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (r) => {
    s.set(r, "open"), t.forEach((l, i) => {
      if (l[0] !== r) return;
      const u = s.get(l[1]);
      u === "open" ? a.add(i) : u || o(l[1]);
    }), s.set(r, "done");
  };
  return [...n, ...e].forEach((r) => s.has(r) || o(r)), a;
}
function Ih(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Lh(e, t, n) {
  const a = [];
  e.forEach((r) => {
    var l;
    return (a[l = n.get(r)] || (a[l] = [])).push(r);
  });
  const s = () => new Map(a.flatMap((r) => r.map((l, i) => [l, i]))), o = (r, l) => {
    const i = s(), u = (d) => {
      const f = l(d).map((m) => i.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : i.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < Th; r++) {
    const l = r % 2 === 0, i = a.map((u, d) => d);
    (l ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[l ? 1 : 0] === f).map((m) => m[l ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Nh(e, t) {
  const n = /* @__PURE__ */ new Map(), a = (s, o, r, l) => {
    const i = `${s[o]}:${r}`;
    (n.get(i) || n.set(i, []).get(i)).push({ arrow: s, end: o, other: l });
  };
  e.forEach((s) => {
    a(s, "from", s.back ? "top" : "bottom", s.to), a(s, "to", s.back ? "bottom" : "top", s.from);
  });
  for (const s of n.values())
    s.sort((o, r) => t.get(o.other).x - t.get(r.other).x), s.forEach(({ arrow: o, end: r }, l) => o[`${r}Share`] = (l + 1) / (s.length + 1));
}
function Dh(e) {
  const t = [...new Set(e.flatMap(([j, M]) => [j, M]))], n = new Set(e.map(([, j]) => j)), a = t.filter((j) => !n.has(j)), s = Bh(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((j, M) => !s.has(M)), r = Ih(t, o), l = Lh(t, o, r), i = new Map(t.map((j) => [j, Rh(j)])), u = l.map((j) => j.reduce((M, S) => M + i.get(S).width, 0) + Le.across * (j.length - 1)), d = Math.max(...u) + Le.margin * 2, f = jh(e, r, l.length), m = /* @__PURE__ */ new Map();
  let v = Le.margin;
  l.forEach((j, M) => {
    let S = (d - u[M]) / 2;
    const R = Math.max(...j.map((A) => i.get(A).height));
    j.forEach((A) => {
      const x = i.get(A);
      m.set(A, { ...x, x: S, y: v + (R - x.height) / 2 }), S += x.width + Le.across;
    }), v += R + (f[M] ?? Le.down);
  });
  const y = e.map(([j, M, S], R) => ({ from: j, to: M, label: S || "", back: s.has(R) || r.get(M) <= r.get(j) }));
  Nh(y, m);
  const O = y.map((j) => qh(j, m.get(j.from), m.get(j.to))), b = [...m.values()], L = Uh(O, b), z = Math.max(v - Le.down, ...L.filter((j) => j.label).map((j) => j.label.y + j.label.height));
  return { width: Math.max(d - Le.margin, ...L.filter((j) => j.label).map((j) => j.label.x + j.label.width)) + Le.margin, height: z + Le.margin, nodes: b, arrows: L };
}
const Ph = (e) => e ? hs(e, Ne.lineChars).length * Ne.line + Ne.pad * 2 : 0;
function jh(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Le.labelSpace);
  return e.forEach(([s, o, r]) => {
    const [l, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > l && (a[l + Math.floor((i - l - 1) / 2)] += Ph(r) + Le.labelSpace);
  }), a.map((s) => Math.max(Le.down, s));
}
function qh(e, t, n) {
  const a = e.label ? hs(e.label, Ne.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Ne.charWidth + Ne.pad * 2 : 0, o = a.length * Ne.line + (a.length ? Ne.pad * 2 : 0), r = t.x + t.width * e.fromShare, l = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - l) / 2, f = [{ x: r, y: l }, { x: r, y: l + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${r} ${l} C${r} ${l + d} ${i} ${u - d} ${i} ${u}` };
}
const Fh = ([e, t, n, a], s) => {
  const o = 1 - s, r = (l) => o * o * o * e[l] + 3 * o * o * s * t[l] + 3 * o * s * s * n[l] + s * s * s * a[l];
  return { x: r("x"), y: r("y") };
}, Wh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Hh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ne.line);
function Uh(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: r }) => ({ x: a, y: s, width: o, height: r }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = Fh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, l = Hh.flatMap((i) => Wh.map((u) => s(u, i))).find((i) => !n.some((u) => Xs(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => Xs(l, i)); ) l.y += Ne.line;
    return n.push(l), { ...a, label: { ...l, lines: a.lines, line: Ne.line, pad: Ne.pad } };
  });
}
const Xs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, zh = { class: "flowchart-tools" }, Vh = ["width", "height", "viewBox", "aria-label"], Gh = ["d"], Kh = ["x", "y", "width", "height"], Yh = ["x", "y"], Jh = ["x", "dy"], Zh = {
  key: 0,
  class: "flowchart-label"
}, Xh = ["x", "y", "width", "height"], Qh = ["x", "y"], e1 = ["x", "dy"], t1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => Dh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = I(null), l = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var L;
      const O = (L = r.value) == null ? void 0 : L.getBoundingClientRect();
      if (!(O != null && O.width)) return;
      const b = Math.min(O.width / s.value.width, O.height / s.value.height, 1.5);
      l.value = { zoom: b, x: (O.width - s.value.width * b) / 2, y: (O.height - s.value.height * b) / 2 };
    }
    function d(O, b, L) {
      const { zoom: z, x: ee, y: j } = l.value, M = Math.min(o.most, Math.max(o.least, z * O));
      l.value = { zoom: M, x: b - (b - ee) * M / z, y: L - (L - j) * M / z };
    }
    function f(O) {
      const b = r.value.getBoundingClientRect();
      d(O, b.width / 2, b.height / 2);
    }
    function m(O) {
      const b = r.value.getBoundingClientRect();
      O.ctrlKey || O.metaKey ? d(O.deltaY < 0 ? o.step : 1 / o.step, O.clientX - b.left, O.clientY - b.top) : l.value = { ...l.value, x: l.value.x - O.deltaX, y: l.value.y - O.deltaY };
    }
    function v(O) {
      var b, L, z;
      O.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), i = { x: O.clientX - l.value.x, y: O.clientY - l.value.y }, (z = (L = r.value).setPointerCapture) == null || z.call(L, O.pointerId);
    }
    function y(O) {
      i && (l.value = { ...l.value, x: O.clientX - i.x, y: O.clientY - i.y });
    }
    return Oe(u), (O, b) => (c(), W(fr, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (L) => a("close"))
    }, {
      default: D(() => [
        g("div", zh, [
          N(ue, {
            small: "",
            onClick: b[0] || (b[0] = (L) => f(o.step))
          }, {
            default: D(() => [...b[5] || (b[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          N(ue, {
            small: "",
            onClick: b[1] || (b[1] = (L) => f(1 / o.step))
          }, {
            default: D(() => [...b[6] || (b[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          N(ue, {
            small: "",
            onClick: u
          }, {
            default: D(() => [...b[7] || (b[7] = [
              ne("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: we(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: y,
          onPointerup: b[2] || (b[2] = (L) => Cs(i) ? i.value = null : i = null),
          onPointercancel: b[3] || (b[3] = (L) => Cs(i) ? i.value = null : i = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: s.value.width,
            height: s.value.height,
            viewBox: `0 0 ${s.value.width} ${s.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: fe({ transform: `translate(${l.value.x}px, ${l.value.y}px) scale(${l.value.zoom})` })
          }, [
            b[8] || (b[8] = g("defs", null, [
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
                }, w(z), 9, Jh))), 128))
              ], 8, Yh)
            ]))), 128)),
            (c(!0), h(K, null, te(s.value.arrows, (L, z) => (c(), h(K, {
              key: `label-${z}`
            }, [
              L.label ? (c(), h("g", Zh, [
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
}, n1 = /* @__PURE__ */ J(t1, [["__scopeId", "data-v-6f337720"]]), Qs = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', eo = {
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
  agent: Qs,
  worker: Qs,
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
    const t = e, n = B(() => eo[t.name] || eo.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, a1));
  }
}, lt = /* @__PURE__ */ J(s1, [["__scopeId", "data-v-939f191f"]]), o1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(lt, { name: "fold" })
    ], 2));
  }
}, vt = /* @__PURE__ */ J(o1, [["__scopeId", "data-v-a570162c"]]), r1 = ["data-tip", "aria-label"], l1 = {
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
      N(lt, { name: "open" }),
      e.open ? (c(), h("span", l1, w(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, r1));
  }
}, Pr = /* @__PURE__ */ J(i1, [["__scopeId", "data-v-2824bb7d"]]), jr = 120, Sn = 280, qr = 160, c1 = () => {
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
function Fr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const r = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), l = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    l(f);
    const v = d1(f);
    r(f, m), f.offsetWidth, f.style.transition = `width ${Sn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Sn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, v);
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
    if (r(m, y), s.value = "leaving", await n(jr), v !== o) return;
    a.value = f, s.value = "resizing", await it(), i(m, y);
    const O = u(m);
    await n(Sn), O == null || O.disconnect(), v === o && (l(m), s.value = "entering", await n(qr), v === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), xt(() => {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: r, phase: l } = Fr(o, () => !s.value), i = B(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = B(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", F(l), { open: !F(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", f1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", m1, [
            e.bad ? (c(), W(lt, {
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
          N(vt, { open: s.value }, null, 8, ["open"])
        ], 8, h1),
        e.action ? (c(), W(Pr, {
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
}, w1 = /* @__PURE__ */ J(y1, [["__scopeId", "data-v-9cee1e01"]]), b1 = {
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
}, M1 = ["onClick"], S1 = { class: "row-pill message-links-chip" }, _1 = { class: "message-links-title" }, ia = 3, to = "task", E1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = B(() => t.links.length), s = B(() => t.links.every((m) => m.model === to) ? "tasks" : "items"), o = B(() => `Linked: ${t.links.map((m) => `${m.model} ${m.id}`).join(" ")}`), r = I(!1), l = I({}), i = I(null);
    Uo(i, () => r.value = !1);
    async function u() {
      const m = t.links.filter((y) => y.model === to && !(y.id in l.value)), v = await Promise.all(m.map((y) => n.read(`task show ${y.id}`)));
      l.value = { ...l.value, ...Object.fromEntries(v.filter((y) => y.ok).map((y) => [y.value.id, y.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(m) {
      r.value = !1, Pe(`${Ge(m.model)}:${m.id}`);
    }
    return (m, v) => (c(), h("div", {
      ref_key: "line",
      ref: i,
      class: X(["message-links", { many: a.value > ia, three: a.value === ia, open: r.value }]),
      "data-message-links": ""
    }, [
      N(lt, {
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
          "aria-expanded": r.value,
          onClick: d
        }, [
          ne(w(a.value) + " linked " + w(s.value) + " ", 1),
          N(vt, { open: r.value }, null, 8, ["open"])
        ], 8, x1)
      ])) : C("", !0),
      r.value ? (c(), h("div", $1, [
        (c(!0), h(K, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.model}:${y.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (O) => f(y)
        }, [
          g("span", S1, w(y.model) + " " + w(y.id), 1),
          g("span", _1, w(l.value[y.id]), 1)
        ], 8, M1))), 128))
      ])) : C("", !0)
    ], 2));
  }
}, A1 = /* @__PURE__ */ J(E1, [["__scopeId", "data-v-419283b6"]]), C1 = ["title", "aria-label"], O1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, T1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, R1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = B(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
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
}, B1 = /* @__PURE__ */ J(R1, [["__scopeId", "data-v-6c0a4358"]]);
function I1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Wr(e, t = Date.now()) {
  const n = I1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const L1 = 36e5;
function F2(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / L1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function Hr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function no(e, t = !1) {
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
    var o, r;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([l]) => {
      l.contentRect.width !== s && (s = l.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
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
const U1 = ["data-incoming", "data-ref"], z1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], V1 = { class: "message-body" }, G1 = ["title"], K1 = ["innerHTML"], Y1 = ["title"], J1 = ["innerHTML"], Z1 = {
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
}, am = ["href", "title"], sm = ["src", "alt"], om = ["href"], rm = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, lm = ["data-sent-worker", "title", "onClick"], im = { class: "message-foot" }, cm = { class: "message-time" }, um = {
  class: "message-id",
  "data-message-id": ""
}, dm = 140, fm = 2, hm = 1500, mm = "An earlier message", pm = "about", gm = "sent_to", vm = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var $;
    const n = e, a = t, s = I(!1), o = I(null), r = B(() => ["user", "comment"].includes(n.message.type)), l = B(() => {
      const [V, Z] = (n.message.commented_row || ":").split(":"), Y = Ge(V);
      return Y ? { ref: `${Y}:${Z}`, label: `${Dt(Y).title.toLowerCase()} ${Z}` } : null;
    }), i = B(() => n.message.worker_id ?? null), u = I(!1), d = B(() => i.value !== null && ((n.message.text ?? "").length > dm || (n.message.text ?? "").split(`
`).filter((V) => V.trim()).length > fm)), f = B(() => r.value && !n.message.read_at && !n.message.local);
    async function m() {
      var V;
      await ((V = navigator.clipboard) == null ? void 0 : V.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, hm);
    }
    const v = Er(), y = B(() => v(n.message.text ?? "")), O = B(() => JSON.parse(n.message.flowchart_edges || "[]")), b = I(!1), L = B(() => v(n.quote || mm));
    function z() {
      const V = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      V ? V.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    F1(o, () => `${n.message.text} ${n.quote}`);
    const ee = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, j = (V) => `/api/files/message/${n.message.id}/${encodeURIComponent(V)}`, M = B(() => JSON.parse(n.message.captions || "{}")), S = B(() => (n.message.files ?? []).map((V) => ({ name: V, address: j(V), isImage: ee.test(V), title: M.value[V] || V }))), R = B(() => Hr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = $e(Se, null), x = I([]), T = I([]);
    async function k() {
      if (!r.value || !(A != null && A.read) || n.message.local) return;
      const V = await A.read(`link list --source message:${n.message.id}`);
      if (!V.ok) return;
      const Z = V.value.rows ?? V.value ?? [];
      x.value = Z.filter((Y) => Y.link_type === pm).map((Y) => ({ model: Y.target_model, id: Y.target_id })), T.value = Z.filter((Y) => Y.link_type === gm).map((Y) => Y.target_id);
    }
    k(), ($ = A == null ? void 0 : A.follow) == null || $.call(A, ["link.*"], k);
    const p = I(!1), _ = B(() => H1(n.message.reactions));
    function E(V) {
      p.value = !1, a("react", n.message, V);
    }
    return (V, Z) => e.message.peer || e.message.recipient ? (c(), h("div", {
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
        onComment: Z[0] || (Z[0] = (Y) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, U1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", V1, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: l.value }]),
          onClick: Z[6] || (Z[6] = (...Y) => F(Tt) && F(Tt)(...Y))
        }, [
          l.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${l.value.label}`,
            onClick: Z[1] || (Z[1] = we((Y) => F(Pe)(l.value.ref), ["stop"]))
          }, [
            N(me, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + w(l.value.label), 1)
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
            onClick: Z[2] || (Z[2] = we((Y) => F(Pe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, Y1)) : C("", !0),
          g("div", {
            class: X({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, J1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: Z[3] || (Z[3] = we((Y) => u.value = !u.value, ["stop"]))
          }, w(u.value ? "Show less" : "Show more"), 1)) : C("", !0),
          O.value.length ? (c(), h(K, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Z[4] || (Z[4] = (Y) => b.value = !0)
            }, "Open the flowchart"),
            b.value ? (c(), W(n1, {
              key: 0,
              title: e.message.text,
              edges: O.value,
              onClose: Z[5] || (Z[5] = (Y) => b.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        g("div", {
          class: X(["message-tools", { picking: p.value }]),
          "data-message-tools": ""
        }, [
          p.value ? (c(), h(K, { key: 0 }, [
            g("div", Z1, [
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
              onClick: Z[7] || (Z[7] = (Y) => p.value = !1)
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
              onClick: Z[8] || (Z[8] = (Y) => p.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: Z[9] || (Z[9] = (Y) => a("reply", e.message))
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
              onClick: Z[10] || (Z[10] = (Y) => a("delete", e.message))
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
      T.value.length ? (c(), h("div", rm, [
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
        }, "Also sent to worker " + w(Y), 9, lm))), 128))
      ])) : C("", !0),
      g("div", im, [
        g("time", cm, w(R.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          Z[11] || (Z[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", um, "message " + w(e.message.id), 1)
        ], 64)) : C("", !0),
        r.value ? (c(), W(B1, {
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
}, W2 = /* @__PURE__ */ J(vm, [["__scopeId", "data-v-82ff4b48"]]), ym = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const l = Gl("SkeletonParts", !0);
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
          grow: D(() => [...r[0] || (r[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            g("div", {
              class: "skeleton-row",
              style: fe(a(i))
            }, [
              N(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(a(i))
            }, [
              N(l, {
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
              N(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            g("div", {
              class: "skeleton-grid",
              style: fe(s(i))
            }, [
              N(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), wm = /* @__PURE__ */ J(ym, [["__scopeId", "data-v-80d07fe3"]]), bm = {
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
}, ms = /* @__PURE__ */ J(km, [["__scopeId", "data-v-a5cff6ec"]]), In = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ua = 200, Ur = (e) => {
  var t;
  return ((t = In.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? In[0].key;
}, H2 = (e) => {
  var t;
  return ((t = In.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, xm = ["aria-label"], $m = 300, ao = 400, Mm = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ua } },
  setup(e) {
    const t = e, n = B(() => Ur(t.value)), a = B(() => n.value < ua ? [1, 0.25, 0.25] : n.value === ua ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= ao, high: n.value >= $m && n.value < ao }]),
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
}, U2 = /* @__PURE__ */ J(Mm, [["__scopeId", "data-v-549d72cf"]]), so = (e) => [...new Set(e.agents.map((t) => t.name))], z2 = (e) => so(e).length === 1 ? `Worker: ${so(e)[0]}` : "Delegated", Sm = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, oo = (e) => Sm[e.card.state] || "idle", _m = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), ro = { working: 0, waiting: 1, idle: 2, stopped: 3 }, lo = (e, t) => ro[oo(e)] - ro[oo(t)], io = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, V2 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => lo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || _m(a, s)) : [...e].sort((a, s) => lo(a, s) || (io[t] || io.state)(a, s)), Em = { class: "list-row" }, Am = {
  key: 0,
  class: "list-row-type"
}, Cm = { class: "list-row-main" }, Om = {
  key: 0,
  class: "list-row-title"
}, Tm = { class: "list-row-body" }, Rm = {
  key: 1,
  class: "list-row-end"
}, Bm = {
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
        t.$slots.end ? (c(), h("div", Rm, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", Bm, w(e.text), 1)) : C("", !0)
    ]));
  }
}, G2 = /* @__PURE__ */ J(Im, [["__scopeId", "data-v-30fac05a"]]), Lm = {
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
    const n = e, a = t, s = I(!1), o = I(null), r = I(""), l = B(() => {
      const u = r.value.trim().toLowerCase();
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
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, jm)) : C("", !0),
          (c(!0), h(K, null, te(l.value, (f) => (c(), W(wt, {
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
          l.value.length ? C("", !0) : (c(), h("p", Hm, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, zm = /* @__PURE__ */ J(Um, [["__scopeId", "data-v-9d0322ab"]]), K2 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => [
      ...Lm[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = B(() => (s.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, l) => (c(), W(zm, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${F(Nm)[e.provider]} model`,
      onPick: l[0] || (l[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Vm = ["aria-label"], Gm = { class: "head" }, Km = { class: "names" }, Ym = { class: "body" }, Jm = {
  key: 0,
  class: "foot"
}, Zm = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = cr(a, n), l = ur(s);
    return (i, u) => (c(), W(ns, { to: "body" }, [
      N(Lt, {
        name: "side",
        appear: "",
        onAfterLeave: F(r)
      }, {
        default: D(() => [
          F(s) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: F(l) }),
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
                i.$slots.foot ? (c(), h("footer", Jm, [
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
}, Y2 = /* @__PURE__ */ J(Zm, [["__scopeId", "data-v-82aa5dd1"]]), Xm = {
  key: 1,
  class: "text-field-label"
}, Qm = {
  key: 2,
  class: "text-field-end"
}, ep = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ra({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ta(e, "modelValue"), a = Hn(), s = "onUpdate:modelValue" in (((d = Kl()) == null ? void 0 : d.vnode.props) || {}), o = B(() => s ? n.value : a.value), r = (f) => s && (n.value = f.target.value), l = B(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = B(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
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
      Je(g("input", Ye({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, l.value, { onInput: r }), null, 16), [
        [F(Pa), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Qm, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : Je((c(), h("input", Ye({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: r }), null, 16)), [
      [F(Pa), o.value]
    ]);
  }
}), J2 = /* @__PURE__ */ J(ep, [["__scopeId", "data-v-631ba0ce"]]);
async function tp(e, t, n) {
  if (!e) return n(t);
  const { target: a, fields: s } = e, o = Object.fromEntries(Object.keys(s).map((i) => [i, a[i]])), r = () => Object.assign(a, o);
  Object.assign(a, s);
  let l = !1;
  try {
    const i = await n(t);
    return l = i.ok, i;
  } finally {
    l || r();
  }
}
const co = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function Z2(e) {
  const t = ct().sources.find((n) => n.key === e);
  return t ? za(t.read, t.events) : za("", []);
}
function za(e, t, { incremental: n = !1 } = {}) {
  var M;
  const a = Number(((M = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : M[1]) ?? 50), s = ct(), o = I([]), r = I(null), l = I(""), i = I(!1), u = performance.now(), d = I(!1), f = I(""), m = I(null);
  async function v(S) {
    const R = b, A = await s.read(`${e} --before-id ${S + 1} --limit 1`);
    if (R !== b) return;
    if (!A.ok) return z();
    const x = A.value.rows.find((T) => T.id === S);
    o.value = x ? o.value.map((T) => T.id === S ? x : T) : o.value.filter((T) => T.id !== S);
  }
  async function y(S) {
    if (n && String((S == null ? void 0 : S.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== S.row_id));
    if (n && (S != null && S.row_id) && !String(S.event ?? "").endsWith(".create") && o.value.some((p) => p.id === S.row_id)) return v(S.row_id);
    if (!(n && o.value.length && String((S == null ? void 0 : S.event) ?? "").endsWith(".create"))) return z();
    const A = Math.max(...o.value.map((p) => p.id)), x = b, T = await s.read(`${e} --after-id ${A}`);
    if (x !== b) return;
    if (!T.ok) return z();
    const k = new Set(o.value.map((p) => p.id));
    o.value = [...T.value.rows.filter((p) => !k.has(p.id)), ...o.value];
  }
  async function O() {
    if (!d.value || !o.value.length) return !1;
    const S = b, R = Math.min(...o.value.map((T) => T.id)), A = await s.read(`${e} --before-id ${R}`);
    if (S !== b) return !1;
    if (!A.ok || !A.value.rows.length) return d.value = !1;
    d.value = co(A.value, a);
    const x = new Set(o.value.map((T) => T.id));
    return o.value = [...o.value, ...A.value.rows.filter((T) => !x.has(T.id))], !0;
  }
  let b = 0;
  async function L(S) {
    const R = ++b, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (R !== b) return;
    const x = A.ok ? s.shared ? [A.value] : A.value.rows : [];
    A.ok && (o.value = S(x)), r.value = A.ok ? A.value : null;
    const T = x.length ? Math.min(...x.map((k) => k.id)) : 0;
    A.ok && !o.value.some((k) => k.id < T) && (d.value = !s.shared && co(A.value, a)), l.value = A.ok ? "" : A.error, os(u, () => i.value = !0);
  }
  function z() {
    return L((S) => {
      if (!n || !S.length) return S;
      const R = Math.min(...S.map((x) => x.id)), A = Math.max(...S.map((x) => x.id));
      return [...o.value.filter((x) => x.id > A), ...S, ...o.value.filter((x) => x.id < R)];
    });
  }
  const ee = () => L((S) => S);
  async function j(S, R = null) {
    const A = await tp(R && { target: o, fields: { value: R(o.value) } }, S, s.run);
    return f.value = A.ok ? "" : A.error, m.value = A.ok ? A.value : null, await z(), A;
  }
  return e && (s.follow(t, y), z()), { rows: o, listing: r, failure: l, loaded: i, more: d, load: z, loadLatest: ee, older: O, act: j, actionFailure: f, answer: m, context: s };
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
    return (o, r) => (c(), W(Xu, {
      rows: F(n),
      failure: F(a),
      loaded: F(s),
      empty: e.empty
    }, {
      default: D(({ row: l }) => [
        g("span", np, w(l.title), 1),
        g("span", ap, w(F(nr)(e.noun, l.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, X2 = /* @__PURE__ */ J(sp, [["__scopeId", "data-v-46749af8"]]);
function op(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const da = I(Date.now() / 1e3);
let uo = 0, vn = 0;
function zr() {
  return vn || (da.value = Date.now() / 1e3, uo = setInterval(() => da.value = Date.now() / 1e3, 1e3)), vn += 1, qo() && Fo(() => {
    vn -= 1, vn || clearInterval(uo);
  }), da;
}
const rp = 200, lp = jr + Sn + qr + rp;
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
      var r, l, i, u;
      return `${((l = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : l.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: r, maxWidth: l, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: r, maxWidth: l, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: jt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function cp(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const r = performance.now(), l = [];
    function i() {
      if (a.markMotion.value) {
        if (l.push(ip(o, r, n.value)), performance.now() - r < lp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: l })]);
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
    const t = e, n = Hn(), a = ["onClick", "onAct"], s = B(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), r = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), l = B(() => t.open !== void 0), i = B(() => l.value || r.value), u = B(() => l.value ? t.open : o.value), d = B(() => l.value ? !t.open : r.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), m = B(() => i.value || f.value || !!n.onClick), v = I(null), y = I(null), { folded: O, phase: b } = Fr(v, () => d.value);
    cp(v, d, b, $e(Se, null));
    function L(ie) {
      var ve, Te;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (l.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (r.value) return void (o.value = !o.value);
        (Te = n.onAct || n.onClick) == null || Te(ie);
      }
    }
    const z = (ie) => n.onAct(ie), ee = ["failed", "unfinished"], j = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), M = B(() => t.mark.color ? t.mark.color : j.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : j.value ? `var(--tone-${j.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), S = B(() => M.value || "var(--tone-work)"), R = B(() => !t.mark.ending && !t.mark.ended && j.value !== "stopped"), A = zr(), x = B(
      () => t.mark.began_at && R.value && !t.mark.figure && !t.mark.counting ? N1(A.value - t.mark.began_at) : ""
    ), T = B(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${no(ve - ie, !0)}` : no(A.value - ie, !0) : x.value;
    }), k = ["bad", "danger", "warn"], p = B(() => k.includes(j.value) || t.mark.asks ? "attention" : R.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), _ = ["bad", "danger"], E = B(() => _.includes(j.value)), $ = B(() => p.value === "process" ? "running" : E.value ? "cross" : j.value === "stopped" ? "stopped" : j.value === "good" ? "tick" : ""), V = B(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || $.value || t.mark.settled || t.mark.news)
    ), Z = B(() => [t.mark.title, t.mark.time ? Hr(t.mark.time) : ""].filter(Boolean).join(" · ")), Y = B(() => ({
      ...M.value ? { "--mark": M.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ve) => (c(), h("div", Ye(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        F(b),
        {
          open: u.value,
          folding: l.value && d.value,
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
      title: Z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": F(O) ? "" : null,
      "data-open": l.value && e.open ? "" : null,
      onClick: L
    }), [
      (c(), W(kt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: y,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: D(() => [
          e.mark.markIcon ? (c(), W(lt, {
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
            i.value ? (c(), W(vt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          V.value ? (c(), h("span", mp, [
            e.mark.figure ? (c(), h("span", pp, w(e.mark.figure), 1)) : C("", !0),
            T.value ? (c(), h("span", gp, w(T.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", vp, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", yp, w(e.mark.news), 1)) : C("", !0),
            $.value === "running" ? (c(), h("span", wp)) : $.value ? (c(), W(lt, {
              key: 5,
              class: X(["sign", $.value]),
              name: $.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", bp, w(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), W(Pr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: we(z, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && R.value ? (c(), h("span", kp, [
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
}), Vr = /* @__PURE__ */ J(Sp, [["__scopeId", "data-v-dc93aa50"]]), _p = 60;
function Ep(e, t) {
  const n = I([]), a = I(0);
  let s = -1, o = 0, r = !1;
  async function l() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, a.value = d.value.first_byte, s = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function i() {
    if (s < 0) return l();
    const d = await e(["output", "page", String(t()), "--after", String(s)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < s ? l() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), s = d.value.last_byte, d) : d;
  }
  async function u(d) {
    if (r || a.value <= 0 || d.scrollTop > _p) return;
    r = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    r = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await it(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: l, follow: i, loadEarlier: u };
}
const Ap = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Gr(e) {
  var n;
  const t = Ap[e] || ((n = Dt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Cp = (e) => Gr(String(e).split(":")[0]), Kr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Op = { passed: "good", failed: "danger", warned: "warn", running: "" }, Tp = { good: "good", warn: "warn", danger: "danger" }, fo = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Wu(e.target_model, e.target_id || 0)
}, Rp = { "open row": (e) => Cp(e.target_model), "open page": () => Gr("pages") };
function Bp(e, t) {
  const n = t || {}, a = fo[n.click] && e.target_model ? n.click : "";
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
    action: a ? Rp[a](e) : "",
    handlers: a ? { onAct: () => fo[a](e) } : {}
  };
}
const Ip = 2e3;
function Lp(e, t, n = Ip) {
  let a = null, s = !1, o = !1;
  const r = async (d) => {
    o = !0;
    try {
      await d();
    } catch {
    } finally {
      o = !1;
    }
  }, l = () => r(async () => t() && await e()), i = () => {
    s || document.hidden || (a = setTimeout(
      async () => {
        document.hidden || await l(), i();
      },
      typeof n == "function" ? n() : n
    ));
  }, u = async () => {
    s || document.hidden || o || (clearTimeout(a), await l(), i());
  };
  Oe(async () => {
    document.addEventListener("visibilitychange", u), await r(e), i();
  }), xt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const Np = 24, Dp = 1e3, ho = 2e3, Pp = 0.25, jp = 5e3;
function qp(e, t = Np, n = () => !0) {
  const a = I(!1), s = I(0), o = I(!1);
  let r = 0, l = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const j = u();
    return j ? j.scrollHeight - j.scrollTop - j.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function m(j) {
    if (clearTimeout(r), !j) {
      o.value = !1, i = Date.now();
      return;
    }
    const M = Date.now() - i < ho ? ho : Dp;
    r = setTimeout(() => o.value = a.value, M);
  }
  function v() {
    clearTimeout(l), a.value = !1, s.value = 0, m(!1);
  }
  function y(j = !1) {
    const M = u();
    M && j && M.scrollTo ? M.scrollTo({ top: M.scrollHeight, behavior: "smooth" }) : M && (M.scrollTop = M.scrollHeight), v();
  }
  function O() {
    L(), !a.value && (a.value = !0, m(!0));
  }
  const b = () => !!u() && d() <= u().clientHeight * Pp;
  function L() {
    clearTimeout(l), b() && (l = setTimeout(() => a.value && b() && n() && y(!0), jp));
  }
  function z() {
    f() ? v() : O();
  }
  function ee(j = 1, M = !1) {
    a.value ? s.value += Math.max(0, j) : y(M);
  }
  return qo() && Fo(() => [r, l].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: y, left: O, scrolled: z, arrived: ee };
}
const Fp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Wp = (e) => String(e ?? "").replace(Fp, ""), Hp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: r, arrived: l, toBottom: i } = qp(s);
    he(
      () => n.lines.length,
      () => it(() => l()),
      { immediate: !0 }
    );
    function u(d) {
      r(), a("older", d.target);
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
}, Up = /* @__PURE__ */ J(Hp, [["__scopeId", "data-v-07980c45"]]), zp = 1e4;
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
}, Yp = ["src", "title"], Jp = 1e3, Zp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ct(), a = I(null), s = I(!1), o = I(!1);
    let r = null, l = 0;
    return Oe(() => {
      r = new Vp(a.value, n), r.start(), l = setInterval(() => {
        s.value = r.silent();
      }, Jp);
    }), Re(() => {
      r == null || r.stop(), clearInterval(l);
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
}, Xp = /* @__PURE__ */ J(Zp, [["__scopeId", "data-v-f3cb2f7c"]]), yn = (e) => e ? e.split(", ") : [];
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
}, og = /* @__PURE__ */ J(sg, [["__scopeId", "data-v-9319ffca"]]), fa = {
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
}, rg = ["data-window", "data-agent"], lg = {
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
    function r() {
      s.value = "", o.value++;
    }
    const l = $e(ki, null), i = Pc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
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
        a("open", f, m), l == null || l(f, m);
      }
    });
    Yl(Se, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Oe(i.settle), Re(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Jl((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
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
        onRetry: r
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
    ], 8, rg));
  }
}, Ut = /* @__PURE__ */ J(lg, [["__scopeId", "data-v-bd481e0c"]]), Yr = {
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
    return (o, r) => (c(), W(Ut, {
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
      onOption: r[0] || (r[0] = (l, i) => a("option", l, i))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, ig = ["data-window"], Jr = {
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
      async (r) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              r
            )).default, Vi();
          } catch (l) {
            if (Ui(l) && zi(l)) return;
            o.value = `This window's file could not be loaded: ${l.message}`;
          }
      },
      { immediate: !0 }
    ), (r, l) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
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
      onOption: l[0] || (l[0] = (i, u) => a("option", i, u))
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
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, r = B(() => !!(t.declaration.shipped || t.declaration.trusted)), l = B(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: r.value ? [cg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => r.value ? (c(), W(Jr, {
      key: 0,
      entry: l.value,
      subscriptions: F(a),
      environment: F(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), W(Yr, {
      key: 1,
      entry: l.value,
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
}, pg = "process", mo = "task", gg = {
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
    const t = e, n = $e(Se), a = B(
      () => String(t.mark.lines || "").split(`
`).filter(Boolean)
    ), s = B(() => Kr.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === mo ? t.mark.target_id : 0), r = Ep(
      (v) => n.run(v),
      () => t.mark.target_id
    ), l = r.lines, i = I(!1), u = I(""), d = B(() => !t.declaration.body_url && t.mark.target_model === pg && !!t.mark.target_id);
    async function f(v = r.follow) {
      const y = await v();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = B(() => t.shown && d.value);
    return he(m, (v) => v && f()), Lp(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(r.newest)
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
              lines: F(l),
              onOlder: F(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", mg, w(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = we((O) => F(Pe)(`${mo}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Va = /* @__PURE__ */ J(gg, [["__scopeId", "data-v-4e5e4ce1"]]), vg = ["title", "aria-label", "onClick"], yg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, wg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => pu(t.buttons, t.allowedRuns).filter((r) => {
      var l;
      return !((l = r.variants) != null && l.length) || r.variants.includes(t.mark.variant);
    })), a = I(""), s = $e(Se);
    async function o(r) {
      const l = await an(r, { id: t.mark.target_id }, s.environment);
      a.value = l.ok ? "" : l.error;
    }
    return (r, l) => (c(), h(K, null, [
      (c(!0), h(K, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: we((u) => o(i), ["stop"])
      }, [
        N(lt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, vg))), 128)),
      a.value ? (c(), h("span", yg, w(a.value), 1)) : C("", !0)
    ], 64));
  }
}, bg = /* @__PURE__ */ J(wg, [["__scopeId", "data-v-c8022f67"]]);
function Zr(e, t) {
  const n = ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((r) => [r.type, r])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Xr = Zr("/api/marks", "marks"), Q2 = Xr.fetchAll, kg = Xr.find, xg = ["data-ref"], $g = ["data-ref"], Mg = { class: "mark-row" }, Sg = "dock add", _g = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = B(() => kg(a.mark.type)), o = B(() => Bp(a.mark, s.value)), r = B(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && Kr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), l = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      l.value = !l.value;
    }
    const u = B(() => {
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
          N(Vr, Ye({
            mark: o.value,
            open: r.value ? l.value : void 0
          }, Zl(o.value.handlers), { onClick: i }), Xl({ _: 2 }, [
            r.value ? {
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
}, Eg = /* @__PURE__ */ J(_g, [["__scopeId", "data-v-822c50ad"]]), Ag = ["data-ref"], Cg = ["inert"], Og = { class: "group-fold" }, Tg = { class: "thread-group" }, Rg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    he(n, async (l) => {
      var i;
      a.value = !0, await it(), (i = o.value) == null || i.offsetHeight, s.value = l;
    });
    const r = B(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (l, i) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      N(Vr, {
        mark: r.value,
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
}, e5 = /* @__PURE__ */ J(Rg, [["__scopeId", "data-v-163808b2"]]);
function Bg(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Oe(() => n.observe(e.value)), xt(() => n.disconnect()), t;
}
const Ig = { class: "chat-dock-fold" }, Lg = ["aria-label"], Ng = { class: "chat-dock-head" }, Dg = { class: "chat-dock-inner" }, Pg = { class: "chat-dock-foot" }, Qr = 700, jg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = Bg(a), o = I(!1);
    let r = 0;
    return Oe(() => r = setTimeout(() => o.value = !0, Qr)), xt(() => clearTimeout(r)), t({ card: n }), (l, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", Ig, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ce(l.$slots, "edge", {}, void 0, !0),
          g("header", Ng, [
            ce(l.$slots, "head", {}, void 0, !0)
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
                  ce(l.$slots, "default", {}, void 0, !0)
                ], 512)
              ], 6)
            ])
          ], 2),
          ce(l.$slots, "still", {}, void 0, !0),
          g("footer", Pg, [
            ce(l.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Lg)
      ])
    ], 2));
  }
}, el = /* @__PURE__ */ J(jg, [["__scopeId", "data-v-faaa3f0d"]]), qg = {
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
}, tl = /* @__PURE__ */ J(Fg, [["__scopeId", "data-v-3be36688"]]), Wg = { reviewing: "Under review" }, Hg = (e, t) => e || Wg[t == null ? void 0 : t.state] || "", Ue = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Ug = {
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
], Yg = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], Jg = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Zg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Xg(e, t) {
  const n = { plan: Ug, task: zg }[e], a = t != null && t.state ? Oc(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[ar(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Qg = (e, t) => e === "doc" || e === "report" ? Zg(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Kg(t), ...Gg(t)] : e === "check" ? Jg(t) : e === "question" ? Vg(t) : e === "memory" ? Yg(t) : Xg(e, t), nl = Zr("/api/docks", "docks"), t5 = nl.fetchAll, Ft = nl.find, e0 = 6, t0 = 3, ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Gn = (e) => Date.parse(e.leaves_at) / 1e3, pt = (e) => !!(e.leaves_at && !e.kept), n0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!pt(e) || t < Gn(e) || n.has(e.id)), a0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => n0(a, t, n)).sort((a, s) => a.id - s.id);
function s0(e, t, n = e0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Gn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const o0 = (e, t, n = e) => n < 2 ? !1 : e >= t0 ? !0 : t, r0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ga = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), l0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), i0 = (e) => ({ ...e.kept ? Ga("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ga("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), c0 = ["pins"], u0 = (e) => ({ ...e, iconOnly: c0.includes(e.icon) });
function d0(e, t) {
  var n;
  return [
    ...l0(e, t) ? [i0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Dt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Ga("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(u0);
}
function f0(e, t) {
  const n = d0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: r0(e, t),
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
    const n = t, a = e, s = B(() => Ft(a.item.type)), o = zr(), r = B(() => Wr(a.item.created_at, o.value * 1e3)), l = I(null), i = I(null), u = I(null), d = I(null), f = B(() => f0(a.item, s.value)), m = $e(Se), v = I(null);
    let y = 0;
    async function O() {
      var T, k;
      const S = ++y, R = Ht(a.item.target_model ?? ""), A = `${R} show`;
      if (!((k = (T = s.value) == null ? void 0 : T.reads) != null && k.includes(A))) return;
      const x = await at(a.item.type, [R, "show", String(a.item.target_id)], m.environment, m.signal);
      S === y && (v.value = x.ok ? { ...x.value, id: a.item.target_id, noun: R } : { id: a.item.target_id, noun: R });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (S, R, A) => {
        var k;
        const x = Ht(a.item.target_model ?? "");
        v.value = { id: a.item.target_id, noun: x }, O();
        const T = (k = m.subscriptions) == null ? void 0 : k.follow(`dock ${a.item.id}`, [`${x.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && O();
        });
        A(() => {
          y += 1, T == null || T();
        });
      },
      { immediate: !0 }
    );
    const b = I(/* @__PURE__ */ new Set()), L = I("");
    async function z(S) {
      if (S.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      S.action === "declared" && (b.value = /* @__PURE__ */ new Set([...b.value, S.label])), L.value = "";
      const A = await an(S, { id: a.item.target_id }, m.environment);
      (A == null ? void 0 : A.ok) === !1 && (b.value = new Set([...b.value].filter((x) => x !== S.label)), L.value = `Could not ${S.label.toLowerCase()}: ${A.error}`);
    }
    const ee = B(() => f.value.actions.filter((S) => S.action !== "undock" && !b.value.has(S.label))), j = B(() => {
      var S;
      return Hg((S = s.value) == null ? void 0 : S.badge, v.value);
    }), M = B(() => f.value.buttons.find((S) => S.action === "undock"));
    return (S, R) => {
      var A, x, T, k;
      return c(), W(el, {
        label: f.value.title + ((A = s.value) != null && A.needs_user ? ", waiting for you" : ""),
        type: (x = s.value) != null && x.needs_user ? "waiting" : "",
        folded: !!((T = s.value) != null && T.folds) && e.folded,
        body: !!((k = s.value) != null && k.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: R[3] || (R[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (c(), W(tl, {
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
              ref: l,
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
                  !b.value.has(E.label) && (!(($ = E.variants) != null && $.length) || !((V = v.value) != null && V.state) || E.variants.includes(v.value.state)) ? (c(), W(ue, {
                    key: 0,
                    variant: "icon",
                    class: X({ kept: E.pressed }),
                    "aria-pressed": E.pressed,
                    "aria-label": E.label,
                    title: E.label,
                    "data-dock-action": E.action,
                    onClick: (Z) => z(E)
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
                ne(w(r.value), 1)
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
              onClick: R[0] || (R[0] = (E) => n("fold"))
            }, {
              default: D(() => [
                ne(w(s.value.folds) + " ", 1),
                N(vt, {
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
                onFailure: R[1] || (R[1] = (E) => L.value = E),
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
                onClick: R[2] || (R[2] = (E) => n("undock", M.value))
              }, {
                default: D(() => [...R[4] || (R[4] = [
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
              head: l.value,
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
}, po = /* @__PURE__ */ J(b0, [["__scopeId", "data-v-e97fd02d"]]), k0 = ["title", "aria-label"], x0 = { class: "run-chip-in" }, $0 = {
  key: 0,
  class: "run-chip-ring"
}, M0 = { class: "run-chip-name" }, S0 = { class: "run-chip-bar" }, _0 = "processes.output", E0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = $e(Se, null), o = (s == null ? void 0 : s.environment) ?? "", r = I(null), l = B(() => !r.value || r.value.state === "running" || r.value.state === "background"), i = B(() => {
      var m, v;
      return ((m = r.value) == null ? void 0 : m.title) || ((v = r.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = B(() => l.value ? t.running : t[r.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await at(_0, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
      m.ok && (r.value = m.value);
    }
    let f = null;
    return Oe(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), xt(() => f == null ? void 0 : f()), (m, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": u.value })
      }, [
        F(pt)(e.item) ? (c(), W(tl, {
          key: 0,
          "ends-at": F(Gn)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", x0, [
          l.value ? (c(), h("span", $0)) : (c(), W(lt, {
            key: 1,
            name: n[r.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", M0, w(i.value), 1)
        ]),
        g("span", S0, [
          g("i", {
            style: fe({ width: l.value ? `${((y = r.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, k0);
    };
  }
}, A0 = /* @__PURE__ */ J(E0, [["__scopeId", "data-v-ea37a735"]]), C0 = 24, O0 = 8, n5 = 420;
function a5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= C0 ? !0 : e < t && s > O0 ? !1 : null;
}
const T0 = (e, t) => e === void 0 ? t : e, R0 = { me: 1, people: [] }, Ln = ss({
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
  people: R0,
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
yr("journal.activity", () => Ln.activity);
yr("journal.side.mini", () => Ln.sideMini);
const al = "journal.viewer.";
function B0(e, t, n) {
  try {
    const a = n.getItem(al + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function I0(e, t, n) {
  try {
    n.setItem(al + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function go(e, t, n = window.localStorage) {
  const a = I(B0(e, t, n));
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
    var k, p;
    const t = e, n = op(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), r = $e(Se), l = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(_, E) {
      i.value = { ...i.value, [_.id]: "" }, l.value = /* @__PURE__ */ new Set([...l.value, _.id]);
      const $ = await an(E, { id: _.target_id }, r.environment);
      ($ == null ? void 0 : $.ok) === !1 && (l.value = new Set([...l.value].filter((V) => V !== _.id)), i.value = { ...i.value, [_.id]: `Could not close this card: ${$.error}` });
    }
    const d = B(
      () => a0(
        t.items.filter((_) => !l.value.has(_.id)),
        n.value,
        a.value
      )
    ), f = B(
      () => s0(
        d.value.filter((_) => ma(_, Ft)),
        n.value
      )
    ), m = B(() => d.value.filter((_) => !f.value.includes(_) && !ma(_, Ft))), v = B(() => f.value.filter((_) => !pt(_))), y = go(`dock-size:${((k = Ln.identity) == null ? void 0 : k.root) || location.host}`, null), O = (_) => y.value ? y.value.collapsed && !y.value.opened.includes(_.id) : t.collapsed, b = B(() => d.value.some(O)), L = B(() => (s.value = o0(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(O));
    function z() {
      y.value = { collapsed: !b.value, opened: [] };
    }
    function ee(_) {
      var $;
      if (!O(_)) return;
      const E = ($ = y.value) != null && $.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...E, _.id] };
    }
    const j = go(`dock-folded:${((p = Ln.identity) == null ? void 0 : p.root) || location.host}`, {}), M = (_) => {
      var E;
      return !!((E = Ft(_.type)) != null && E.folds) && T0(j.value[_.id], ma(_, Ft) || t.folded);
    };
    function S(_) {
      j.value = { ...j.value, [_.id]: !M(_) };
    }
    function R(_) {
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
    return (_, E) => (c(), W(jo, {
      tag: "div",
      name: "dock",
      duration: F(Qr),
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
              ne(w(b.value ? "Open all" : "Collapse all"), 1),
              N(vt, {
                open: !b.value
              }, null, 8, ["open"])
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(K, null, te(m.value, ($) => (c(), W(po, {
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
        s.value && o.value && !b.value ? (c(), h("div", N0, [
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
              N(vt, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(K, null, te(L.value ? [] : f.value, ($) => (c(), W(po, {
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
        L.value ? (c(), W(el, {
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
                onClick: (V) => R($)
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
                N(vt)
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
}, s5 = /* @__PURE__ */ J(j0, [["__scopeId", "data-v-fb45f5a5"]]), gt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, _n = (e) => Math.min(Math.max(e, 0), 1), q0 = (e) => {
  const t = _n(e);
  return t * t * (3 - 2 * t);
}, dt = (e, t, n) => q0((e - t) / (n - t));
function o5(e) {
  const t = _n(e), n = _n((t - 0.12) / 0.76) * gt.shuffles, a = Math.min(Math.floor(n), gt.shuffles - 1), s = n - a, o = dt(s, 0.26, 0.38) * (1 - dt(s, 0.76, 0.96)), r = dt(s, 0.38, 0.76), l = dt(t, 0, 0.12) * (1 - dt(t, 0.88, 1)), i = dt(s, 0.2, 0.34) * (1 - dt(s, 0.84, 1)), u = Math.sin(Math.PI * _n((s - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (a + r) / gt.shuffles, lift: gt.lift * o, ready: l, weight: i, follow: u, shuffle: a, phase: s };
}
function r5(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const vo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, l5 = (e) => vo[e] ?? vo.butler, ps = 2400, F0 = 0.05;
function W0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, F0), r = Math.min(t + ps * o, s), l = e + r * o;
  return l < n ? { y: l, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
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
const u5 = (e, t) => ({ ...e, stretch: t.stretch }), d5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, sl = (e, t) => t >= (e.least ?? 0);
function f5(e, t, n) {
  if (!sl(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const h5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), U0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", yo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), z0 = (e) => e.right > e.left && e.bottom > e.top;
function m5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(U0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let l = yo(r, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (l = yo(l, i.getBoundingClientRect()), a && (l.bottom = Math.min(l.bottom, a.top))), z0(l) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: l }] : [];
  });
}
function ol(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let r = 0, l = 1;
    for (const [d, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[m]) && (l = -1);
      else {
        const y = (o[f] - e[d]) / v, O = (o[m] - e[d]) / v;
        r = Math.max(r, Math.min(y, O)), l = Math.min(l, Math.max(y, O));
      }
    }
    if (r > l || a && r >= a.share) continue;
    const i = e.x + (t.x - e.x) * r, u = e.y + (t.y - e.y) * r;
    a = { share: r, x: i, y: u, on: "surface", surface: s.id, dx: i - s.left, dy: u - s.top };
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
}, Zt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), V0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => V0(Zt(e, t, n)), G0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ot = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, wn = ([e, t], n) => e + n() * (t - e);
function K0(e) {
  return G0.map(() => {
    const t = wn(ot.speed, e), n = wn(ot.angle, e) * Math.PI / 180, a = wn(ot.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [wn(ot.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const Y0 = K0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function J0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ot.gravity * (t[2] - ot.floor))) / ot.gravity;
}
function p5(e, t, n = Y0) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], r = J0(o, a.from), l = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= r + l) return null;
  const i = Math.min(s, r), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= ot.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - r) / l };
}
const g5 = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function v5(e, t) {
  const n = e.map((o) => Math.sqrt(o)), a = n.reduce((o, r) => o + r, 0);
  let s = Math.min(Math.max(t, 0), 1) * a;
  for (const [o, r] of n.entries()) {
    if (s <= r || o === n.length - 1) {
      const l = r > 0 ? Math.min(s / r, 1) : 1;
      return { index: o, s: l, height: e[o] * 4 * l * (1 - l) };
    }
    s -= r;
  }
  return { index: 0, s: 1, height: 0 };
}
const y5 = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), Bt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function w5(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [r, l] = [t.left + Bt.margin * n, t.right - Bt.margin * n], i = Math.min(Math.max(e + o + s * Bt.reach * n, r), l), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function b5(e, t, n) {
  const a = xe.bug_smash, s = Me(t, a.walk), o = ([r, l]) => r + (l - r) * s;
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
const Ce = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function x5(e) {
  const t = Ce.least + Math.floor(e() * (Ce.most - Ce.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ce.walls[Math.floor(e() * Ce.walls.length)],
    along: Ce.margin + e() * (1 - 2 * Ce.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ka(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ce.margin, r = ((e.along - Ce.margin + e.way * Ce.speed * n / a) / s % 2 + 2) % 2, l = Ce.margin + s * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + l * a, y: t.top + Ce.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ce.inset : t.right - Ce.inset, y: t.top + l * a, turn: e.wall === "left" ? 90 : -90 };
}
function Z0(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, r = H0(e, o), l = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : l + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: l, shot: u };
}
function $5(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: r, bug: l, shot: i } = Z0(n, e.length), u = e.map((L, z) => ({ ...Ka(L, t, Math.min(n / o.fps, En(z).shot)), shot: z < i })), d = Me(r / o.frames, o.aim), [f, m] = [u[Math.max(l - 1, 0)], u[l]], v = e.map((L, z) => ({ bug: L, index: z, seconds: n / o.fps - En(z).shot, spot: Ka(L, t, En(z).shot) })).filter((L) => L.seconds >= 0), y = v.flatMap((L) => {
    const z = (s == null ? void 0 : s.get(L.index)) ?? nv(L.bug, t, L.spot, s ? [] : a);
    return s == null || s.set(L.index, z), s && av(z, L.seconds, a), sv(z, L.seconds, a);
  }), O = v.filter((L) => ev(L.bug)).map((L) => ({ seconds: L.seconds, from: L.spot })), b = +(e[Math.max(l - 1, 0)].wall === "top") * (1 - d) + +(e[l].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: b }, slush: y, camera: O };
}
function En(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function M5(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [r, l] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = En(d), m = Ka(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - r >= l - i ? -1 : 1 : Math.sign(i - m.x), O = Math.abs(m.x - i) >= v ? i : m.x + y * v, b = y > 0 ? Math.max(i, Math.min(O, l)) : Math.min(i, Math.max(O, r)), L = { from: i, to: b, begin: f.walk, end: f.aim };
    return i = b, L;
  });
}
function S5(e, t, n) {
  var o;
  const a = xe.bug_shot.back.stride * n;
  let s = 0;
  for (const r of e) {
    if (t <= r.begin) return { x: r.from, steps: s / a, way: 0 };
    if (t < r.end) {
      const l = r.from + (r.to - r.from) * Me(t, [r.begin, r.end]);
      return { x: l, steps: (s + Math.abs(l - r.from)) / a, way: Math.sign(r.to - r.from) };
    }
    s += Math.abs(r.to - r.from);
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
  const r = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let l = e.from;
  for (let u = 0; u < r.t; u += be.step) {
    const d = Math.min(u + be.step, r.t), f = Xt(e, d), m = ol(l, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    l = f;
  }
  const i = Xt(e, r.t);
  return { ...r, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function nv(e, t, n, a = []) {
  const s = Q0(e.along + 1), [o, r] = X0[e.wall], l = Math.atan2(r, o);
  return Array.from({ length: be.count }, () => {
    const i = l + (s() - 0.5) * 2 * (be.spread * Math.PI / 180), u = be.speed[0] + s() * (be.speed[1] - be.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: be.radius[0] + s() * (be.radius[1] - be.radius[0]) };
    return { ...d, ...tv(d, t, a) };
  });
}
function av(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += be.step) {
      const r = Math.min(o + be.step, s), l = ol(Xt(a, o), Xt(a, r), n);
      if (l) {
        Object.assign(a, l, { t: o + (r - o) * l.share });
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
    const r = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !r) return [];
    const l = r ? r.left + a.dx : a.x, i = r ? r.top + a.dy : a.y, u = r ? Math.min(s * s * 12, 48, Math.max(0, r.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: l, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function _5(e, t, n, a) {
  const { fly: s, drops: o, lens: r, frames: l, fps: i } = xe.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * l / i, d = (o[1] - o[0]) * l / i, f = Me(e, [0, u]), m = Me(e, [u, u + d]);
  return r.map((v) => {
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
  const { sway: o, above: r } = xe.chute, l = { x: t.x, y: t.y - r * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (O) => {
    const [b, L] = [O.x - e.at.x, O.y - e.at.y];
    return { x: l.x + b * u - L * d, y: l.y + b * d + L * u };
  }, [m, v] = [...n].sort((O, b) => O.x - b.x), y = e.ends.map(f);
  return { left: l.x - e.at.x, top: l.y - e.at.y, middle: l, turn: i, lines: y.map((O, b) => ({ from: O, to: b < y.length / 2 ? m : v })) };
}
const A5 = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function Nn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Zt(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Zt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function C5(e, t) {
  const n = xe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Nn(n, t), r = 1 - (1 - n.small) * Me(a, n.shrinks) * (1 - Me(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: a, out: s } = Nn(n, t), o = n.flat * Me(a, n.squashes) * (1 - Me(s, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * Zt(s, ...n.springs)) * (1 - Zt(s, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const O5 = (e) => e === "pack_box";
function T5(e) {
  const { into: t, out: n } = Nn(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function R5(e) {
  const t = xe.rope_swing, { into: n, out: a } = Nn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const ov = { after: 3 }, gs = 10, rv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, lv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, iv = { weight: 19 }, rl = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, cv = { every: 120 }, ll = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, il = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, uv = {
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
}, on = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: gs }), ae = (e, t, n = {}) => on(e, "clip", t, n), pa = (e, t, n = {}) => on(e, "look", t, n), wo = (e, t, n = {}) => on(e, "gaze", t, n), de = (e, t, n = {}, a = {}) => ({ ...on(e, "pick", t, n), ...a }), ge = (e) => on("nothing", "nothing", e, {}), dv = 120, fv = 300, ga = (e, t) => ({ ...ae(e, t), cooldown: fv }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), hv = () => [ae("joy", 2)], ft = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), ht = (e) => ({ ...e, cooldown: rv[e.name] }), qt = (e) => ({ ...e, shenanigan: !0, lasts: lv[e.name] }), Kn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...re("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...re("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...ht(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...ht(ae("bug_smash", 2)), toward: "", onto: !1 },
    ae("nod", 2)
  ]),
  ...re("tests_failed", { cooldown: 20, toward: "card" }, [ae("startled", 2), ae("dismay", 1), ae("tantrum", 3), ge(1)]),
  ...re("committed", { cooldown: 30, toward: "card", onto: !0 }, [ae("nod", 2), ge(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...re("sin_fixed", { cooldown: 300 }, [ae("halo", 1), ge(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...re("sin_committed", { cooldown: 300 }, [ae("repent", 1), ge(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...re("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ae("nod", 4), ae("hand_rub", 4), ge(7)]),
  ...re("question_asked", { cooldown: 60 }, [ae("ask_sign", 9), ae("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...re("reported", { cooldown: 90 }, [wo("read", 3), ae("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [wo("read", 3), ge(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), ge(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, hv()),
  ...re("bar_failed", { holds: !0 }, [ae("fume", 1), ae("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...re("standing", { cooldown: 12 }, [ae("look_left", 2), ae("look_right", 2), ae("look_up", 1), ge(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...re("launched", { cooldown: 300 }, [ae("tumble", 3), ge(47)]),
  // a break from the hammering now and then
  ...re("building", { cooldown: 30 }, [ae("wipe_brow", 4), ae("look_left", 1), ae("look_right", 1), ge(69)]),
  ...re("failed", { cooldown: 20, toward: "card" }, [ae("shake", 3), ae("tantrum", 2), ge(2)]),
  ...re("refused", { cooldown: 20 }, [ae("shake", 1), ge(1)]),
  ...re("work_done", { cooldown: 120 }, [ae("stretch", 2), ge(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...re("pondering", { cooldown: [30, 60] }, [de("ponder", 1)]),
  ...re("thought_cloud", { cooldown: 90 }, [de("cloud", 1)]),
  ...re("light_bulb", { cooldown: 150 }, [de("bulb", 1)]),
  ...re("answered", { cooldown: 15 }, [pa("amused", 3), ge(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), ge(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), ge(13)]),
  ...re("typing", { cooldown: 60 }, [pa("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(uv).flatMap(([e, t]) => re(`reacted:${e}`, {}, [pa(t, 1)])),
  ...Object.entries(ll).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(il).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...re("pastime", {}, [
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
  ...re("held:search", { cooldown: dv }, [ga("search", 3), { ...ga("binoculars", 2), when: { home: !0 } }, { ...ga("glass_bubble", 2), when: { bubble: !0 } }]),
  ...re("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...re("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...re("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...re("tickled", {}, [{ ...ht(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...re("eager", {}, [ae("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...re("jump", {}, [qt(ht(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: rl.build.cooldown }, [de("unit", iv.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: cv.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
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
  ...re("laptop", {}, [de("seat", 6, {}, { stay: [60, 150] }), de("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...re("ledge_at", {}, [de("middle", 2, {}, { along: 1 / 2 }), de("third", 1, {}, { along: 1 / 3 }), de("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...re("composed_as", {}, [
    de("facing", 4, {}, { turn: 0, leans: 0 }),
    de("turned_left", 1, {}, { turn: 335, leans: 0 }),
    de("turned_right", 1, {}, { turn: 25, leans: 0 }),
    de("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    de("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], cl = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), ul = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), mv = (e) => Array.isArray(e) ? e[0] : e, pv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, gv = (e) => Kn.some((t) => t.when.moment === e);
function vv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || ul(d).every(([f, m]) => n(f) >= mv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Kn.filter((d) => cl(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), l = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= ov.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = l.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : l;
}
function je(e, t) {
  const n = vv(e);
  let a = t() * n.reduce((o, r) => o + r.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (dl(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function dl(e, t, n) {
  var a;
  for (const [s, o] of ul(t)) (a = e.memory) == null || a.set(s, e.now + pv(o, n));
}
function B5(e, t, n) {
  dl(e, Kn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const I5 = (e) => Object.values(rl).find((t) => cl(t.when, e)) ?? null, yv = (e, t, n) => n - t <= (e.lifetime ?? gs), L5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || sl(e.clip, t));
class fl {
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
}, N5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), hl = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), D5 = {
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
}, P5 = 120, wv = 20, j5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < wv), bv = (e) => Ya[e] || Ya.idle, q5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, ml = "airborne", kv = "landing", xv = "travelling", pl = "grounded", F5 = ({ airborne: e, landing: t, trip: n }) => e ? ml : t ? kv : n != null && n.started ? xv : pl;
function W5(e, t) {
  var s;
  const n = $v(e, t);
  return e.mode === pl && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function $v(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: r, place: l, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === ml && l.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? l.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Mv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (l.posture === "hang") return { clip: `hang_${l.grip}`, facing: l.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (l.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && l.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, l.posture) ? d : bv(u), facing: v ? m : l.posture === "sit" ? l.face : f };
}
function Mv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Ja = (e) => e.outcome, Sv = "plugin:code-commandments:sins:", bo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Sv), _v = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => bo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => bo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], H5 = (e, t) => e.filter((n) => n.author === "user" && Bn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Bn(n.read_at), card: Br(n) })).sort((n, a) => n.time - a.time), ko = { user: "reacted", agent: "agent_reacted" };
function U5(e, t) {
  return e.filter((n) => ko[n.author] && bt(n) > t).map((n) => ({ beat: `${ko[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Ev = [.../* @__PURE__ */ new Set([...Object.values(ll).flatMap((e) => Object.keys(e)), ...Object.keys(il)])];
function z5(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Ev.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: bt(n), card: Br(n) })).sort((n, a) => n.time - a.time);
}
const Av = (e) => new fl(e).isTest(), Dn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Ja(e)] || "";
}, Cv = 1800, Ov = (e, t) => {
  if (Dn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Dn(n) !== "finished" && Number(e.time) - Number(n.time) <= Cv ? "tests_fixed" : "tests_passed";
};
function V5(e, t, n) {
  var r;
  const a = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(Av), s = a.filter((l) => Dn(l)), o = s.filter((l) => t.get(l.key) === "" || !t.has(l.key) && Number(l.time) > n);
  return a.forEach((l) => t.set(l.key, Dn(l))), o.map((l) => ({ beat: Ov(l, s), time: Number(l.time), card: l.key }));
}
function G5(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Ja(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Ja(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const K5 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: bt(t),
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
function J5(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Z5(e, t) {
  var o, r;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((l) => l.time > t).map((l) => {
    var i;
    return { beat: (i = _v.find((u) => u.matches(l))) == null ? void 0 : i.beat, time: l.time, card: l.key };
  }).filter((l) => l.beat), s = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((l, i) => l.time - i.time);
}
function vs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const xo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Tv(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const l = (s + o) / 2;
    vs(e, t, l, a).pitch > n ? s = l : o = l;
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
const $o = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function e4(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ee.sweep) % s, l = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = $o((l - i) / Ee.returnSeconds), d = l <= i ? $o(l / i) : 1 - u, f = r + ((r + 1) % s - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Mo = 3, gl = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, So = 12, t4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function n4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!gl(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= Mo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * So) / So, lasts: Mo } };
}
const a4 = (e) => e.posture === "hang" && !gl(e.face), Rv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Bv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function s4(e, t, n) {
  return Rv.has(e) ? 1 / 0 : !Bv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(vl(n - t.began, t.share) - Ve.lead, 0);
}
const Iv = 5;
function o4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Iv ? { beat: "long_walk", time: n } : null };
}
const Lv = 30, bn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function r4(e, t, n, a, s = null) {
  if (t && n < t.until || !bn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = je({ moment: "spell", state: e, tally: s }, a), [r, l] = bn.seconds;
  return o ? { state: o.name, began: n, until: n + r + a() * (l - r), next: n + bn.every } : { state: e, began: 0, until: 0, next: n + bn.every };
}
const l4 = (e, t, n) => t && n < t.until && hl.has(e.state) ? { state: t.state, since: t.began } : e, Ve = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, vl = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function i4(e, t, n, a) {
  var l;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, r = vl(o, e.share);
  return s ? { eager: Nv(t, r), moment: null } : r > Ve.lead ? { eager: t, moment: null } : r < Ve.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ve.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ve.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((l = je({ moment: "eager", slow: !0 }, n)) == null ? void 0 : l.name) === "eager" }, moment: null };
}
function Nv(e, t) {
  return e.on && t > Ve.lead + Ve.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ve.lead && t >= Ve.least ? { ...e, on: !0, calm: !1 } : e;
}
const Dv = 1, Pv = { look: "look", gaze: "gaze" };
function jv(e, t, n, a, s = "", o = () => !0, r = null) {
  const l = je({ moment: e, voice: s, has: o, memory: t, now: n, tally: r }, a);
  return l ? { [Pv[l.type] ?? "clip"]: l.name, toward: l.toward ?? "", onto: !!l.onto, holds: !!l.holds, lifetime: l.lifetime } : null;
}
const qv = (e, t, n, a, s, o = "", r = () => !0, l = null, i = "") => je({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: a, tally: l, ball: i }, s), Fv = (e, t, n, a, s, o = 0) => je({ moment: "jump", high: e > Dv * t, memory: a, now: s, room: o }, n).name === "backflip", Wv = { work: ["building"], idle: ["standing"] };
function c4(e, t, n, a) {
  const s = Ya[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Wv[s] ?? []).map((r) => ({ beat: r, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), hl.has(e) ? { moments: o, began: n || a } : (n && a - n >= Lv && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Hv(e, t, n) {
  return !je({ moment: "pondering", memory: e, now: t }, n) || !je({ moment: "thought_cloud", memory: e, now: t }, n) ? null : je({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const _o = { pondering: Hv };
function u4(e, t, n, a, s, o) {
  if (_o[e.beat]) {
    const l = _o[e.beat](n.reacted, a, s);
    return l && o(l) ? { beat: { clip: l, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = jv(e.beat, n.reacted, a, s, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== gs && { lifetime: r.lifetime } } } : null;
}
function d4(e, t, n, a, s, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = qv(e.room ?? 0, t.lasted, n, a, s, e.voice, o, r, e.ball);
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
  const r = a - (e.at || a), l = r / zv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + l, d) : Math.max(e.amount - l, d), m = Uv * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, O = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Gv(v, t, n, m, s) : Yv(v, t, n, m) : t) ?? v, b = O != null && O.behind && O.mood === "reading" ? Vv(e.point, O, n, r, s) : O;
  return { point: b ?? null, toward: b ? { x: b.x - n.x, y: b.y - n.y } : null, amount: f, at: a };
}
function Vv(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, r = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), l = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -i)) - l), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - l), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? r(e.readingFacing - l) : 0, v = f ? e.readingYaw + m : d, y = v + r(u - v), O = Math.min(Math.max(a / 1e3, 0), 0.1), b = Ee.turnSpeed * O, L = f ? v + Math.min(Math.max(y - v, -b), b) : y, z = f ? e.readingFollow + m : L, ee = z + (L - z) * (1 - Math.exp(-O / Ee.followSeconds)), j = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, M = o(vs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), S = Math.min(Math.max(M, -j.up), j.down), R = Ee.tipSpeed * O, A = f ? e.readingPitch + Math.min(Math.max(S - e.readingPitch, -R), R) : S;
  return { ...t, readingYaw: L, readingFollow: ee, readingPitch: A, readingFacing: l };
}
function Gv(e, t, n, a, { depth: s, above: o, tip: r }) {
  const l = (z) => {
    const { yaw: ee, pitch: j } = vs(z.x - n.x, s, n.y - z.y, o);
    return { yaw: ee, pitch: Math.min(Math.max(j, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [i, u] = [xo(l(e)), xo(l(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, O, b] = i.map((z, ee) => m * z + v * u[ee]), L = s * y / O;
  return { ...t, x: n.x + L, y: n.y - Tv(L, s, -Math.asin(Math.min(Math.max(b, -1), 1)), o) };
}
const Kv = 0.15;
function x4(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Kv;
}
function Yv(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - s), Math.cos(o - s)), l = s + Math.max(-a, Math.min(a, r)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(l), y: n.y + i * Math.sin(l) };
}
const Jv = (e) => !(e != null && e.on);
function $4(e, t, n) {
  if (Jv(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, r) => r.findIndex((l) => l.beat === s.beat && l.card === s.card) === o);
  return { answer: [], held: a };
}
const Qt = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, He = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, va = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Eo = (e) => e * e * (3 - 2 * e);
function Zv(e) {
  if (e < 0 || e >= He.seconds) return null;
  const t = va(e, ...He.flicker), n = Math.floor(t * He.flickers * 2) % 2 === 0, a = e < He.flicker[1] ? n ? 0.35 + 0.5 * t : He.dim : 1;
  return { strength: 1 - Eo(va(e, ...He.fade)), lit: a, white: e < He.flash[0] ? 0 : 1 - Eo(va(e, ...He.flash)) };
}
const M4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function S4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Zv(t - e.at);
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
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (l) => (l + a * 12) % 12, o = (l) => 0.5 - 0.5 * Math.max(-1, Math.min(s(l) - 3, 9 - s(l), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const nt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, C4 = { behind: 39, figure: 40, ahead: 41 }, Xv = "[data-figure-pile]", Qv = { amber: [1, 0.69, 0.125], good: Qt.colours.good, bad: Qt.colours.bad }, An = { phases: 4, ms: 230, dim: 0.25 }, O4 = (e, t, n) => e !== "amber" || (t + n) % An.phases < An.phases / 2 ? 1 : An.dim, T4 = (e) => e === "amber" ? An.phases : 1;
function R4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const B4 = Object.keys(Qv), qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Wt = ([e, t], n) => e + n() * (t - e);
function I4(e) {
  const t = qe.least + Math.floor(e() * (qe.most - qe.least + 1));
  return Array.from({ length: Math.min(t, qe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * qe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Wt(qe.start, e), r = Wt(qe.reach, e);
    return {
      text: je({ moment: "digit" }, e).name,
      x: a * o,
      y: qe.middle + s * o,
      dx: a * r,
      dy: s * r,
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
const ey = (e, t, n) => je({ moment: "unit", memory: e, now: t }, n) !== null, ty = { after: 5 }, ny = (e) => e.filter((t) => t.active && (t.process || t.watch) && new fl(t).isBuild());
function N4(e, t, n) {
  const a = ny(e).sort((o, r) => Number(o.time) - Number(r.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= ty.after ? s : null;
}
function D4(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: ey(n, a, s) } : null;
}
const Ao = { ahead: 140, up: 70 };
function P4(e, t, n, a, s) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Ao.ahead, y: a - Ao.up } } : o ? { at: { x: n(o), y: a - o.up - nt.height } } : t ? { at: null } : null;
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
const q4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), F4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), yl = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), W4 = new Set(Kn.filter((e) => yl.has(e.when.moment) && e.type === "clip").map((e) => e.name)), sy = (e) => e.some((t) => t.state === "built"), H4 = (e, t) => sy(t) ? e.filter((n) => !yl.has(n.beat)) : e, rt = { reach: 40, room: 6 }, oy = (e, t) => t <= e - rt.reach + 2, U4 = (e, t, n) => oy(e, n) ? t - rt.reach : e - rt.reach - rt.room, z4 = (e, t, n, a) => a > 0 && t < e && t + rt.reach >= e - 2 ? Math.min(n, Math.max(e, t + rt.reach)) : e, ba = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, V4 = (e) => Wt(e() < ba.longShare ? ba.long : ba.short, e), ry = 2 * nt.width;
function G4(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= ry ? o : e + (o - e + s / 2) % s;
}
const ly = 60, K4 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= ly, Co = "[data-figure-home]", rn = () => {
  var t;
  const e = document.querySelector(Co);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Co)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, iy = "[data-figure-docked-bars]", cy = "[data-figure-chat-foot]", uy = [0.85, 0.6, 0.35, 0.15], dy = ["question", "waiting", "suggestion"], Y4 = (e, t) => dy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function J4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const fy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", hy = "[data-figure-newest]";
function wl() {
  var a, s;
  const e = (a = rn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(hy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, l;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((l = o.getAttribute) == null ? void 0 : l.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ys(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function en(e, t, n = wl()) {
  if (!e || !n) return !0;
  const a = Ze(e, t), s = Jn(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, r = gt.gap;
  return !Yn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function Z4(e, t, n, a = wl()) {
  if (!a || en(t, e, a)) return null;
  const s = Jn(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, r = (Math.max(s.right, 0.73) - 0.5) * e.size, l = St(), i = t.posture === "stand" ? bs * e.size : El * e.size, u = Math.max(n.left + i, l.left + o), d = Math.min(n.right - i, l.right - r);
  return [a.left - gt.gap - r, a.right + gt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && en(m, e, a) && Wy(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const ka = 0.26, bl = 0.54, my = 1.25 / 5.4, ln = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ka, travels: "stand" },
  lounge: { drop: ka, travels: "stand" },
  composed: { drop: ka, travels: "stand" },
  hang: { drop: bl, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, X4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * my * Math.cos(t * Math.PI / 180),
  y: 1 - n - bl
}), zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), py = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Q4 = (e, t) => (e === "sit" ? py.has(t) : zt.has(e)) ? e : "stand";
function ex(e, t) {
  return e.facing === t.facing || !zt.has(e.posture) && !zt.has(t.posture) ? t : { posture: "stand", facing: zt.has(e.posture) ? e.facing : t.facing };
}
const tx = 0.25, nx = (e, t) => zt.has(e) && ln[t].drop === 0, kl = 2, gy = 90, vy = 180, yy = 140, wy = 280, by = 420, ky = 0.25, xy = 290, $y = 600, My = "cubic-bezier(0.2, 0.7, 0.4, 1)", Sy = "cubic-bezier(0.55, 0, 0.9, 0.6)", xa = 5;
function Pn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: r = !1, sprinting: l = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < xa) return null;
  (r || l) && (o = Math.max(o, kl));
  const v = o > 1, y = Math.abs(t.x - e.x), O = y < xa ? 0 : y / (gy * o) * 1e3, b = Math.min(O, v ? yy : vy), L = Math.abs(t.y - e.y), z = t.y < e.y, ee = z && !m && Fv(L, n, i, u, d, f), j = z ? by + Math.min(L, 400) * ky : Math.sqrt(2 * L / ps) * 1e3, M = {
    x: t.x,
    y: t.y,
    ms: L > xa ? ee ? $y : j : 0,
    lead: ee ? xy : z ? wy : 0,
    easing: z ? My : Sy,
    hopping: !0,
    clip: ee ? "backflip" : z ? "jump" : "fall"
  }, S = { x: t.x, y: t.y, ms: O + b, lead: 0, easing: "linear", ramp: b, ...v ? { clip: "run" } : {} }, R = m ? _y(t, n) : M, A = z && !a ? [{ ...S, y: e.y }, R] : [{ ...M, x: e.x }, S];
  return { way: Math.sign(t.x - e.x) || 1, legs: A, lands: !s, pace: o, running: v };
}
const _y = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Ey = (e, t) => e.postures.includes(t) ? t : e.postures[0], ax = (e, t, n) => e.posture === "walk" && n ? "walk" : Ey(e.clip, t), Ze = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - ln[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Yn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ys = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function St() {
  var t;
  const e = (t = rn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const kn = 0.5, Oo = 20;
function sx(e, t, n = St()) {
  const a = Ze(e, t);
  return a.left >= n.left + Oo && a.right <= n.right - Oo;
}
function ws(e, t, n = St()) {
  const a = Ze(e, t), s = a.right - a.left, o = Jn(e), [r, l] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return r >= n.left - kn && l <= n.right + kn && a.top >= n.top - kn && i <= n.bottom + kn;
}
const jn = [0.35, 0.5, 0.65], qn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: jn[0], right: jn.at(-1), top: qn[0], bottom: qn.at(-1) }, Ay = 0.24;
function Jn(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ay * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function Cy(e, { size: t }, n = St()) {
  const a = Jn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const bs = (_e.right - _e.left) / 2 + 0.08;
function ox(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - ln[e].drop) };
}
const Oy = "[data-figure-agent]";
function xl(e, t, n = "", a = "") {
  var l;
  const s = (l = document.caretRangeFromPoint) == null ? void 0 : l.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ys(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, r = Math.min(s.startOffset, o.length - 1);
  for (const i of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const $l = (e) => qn.flatMap(
  (t) => jn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ks(e, t, n = "") {
  if (!en(e, t)) return jn.length * qn.length;
  const a = Ze(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(fy)].map((l) => ({ control: l, rect: l.getBoundingClientRect() })).filter(({ control: l, rect: i }) => i.width && i.height && Yn(s, i) && ys(l)).map(({ rect: l }) => l), r = (l, i) => o.some((u) => l >= u.left && l <= u.right && i >= u.top && i <= u.bottom);
  return $l(s).filter(([l, i]) => r(l, i) || xl(l, i, n)).length;
}
function Ty(e, t) {
  const n = Ze(e, t);
  return $l({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => xl(a, s, "", Oy)).length;
}
const To = 4;
function rx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = To; o <= s; o += To)
    for (const r of [t.x - o, t.x + o]) {
      if (r - a < n.left || r + a > n.right) continue;
      const l = { ...t, x: r };
      if (!Ty(l, e) && en(l, e)) return l;
    }
  return null;
}
function tn(e, t, n) {
  const a = St(), s = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => ws(r, t, a) && en(r, t)).map((r) => ({ spot: r, covered: ks(r, t), away: s(r) }));
  return o.length ? o.reduce(
    (r, l) => l.covered < r.covered || l.covered === r.covered && l.away < r.away ? l : r
  ).spot : null;
}
const Ml = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Ry = [0.5, 0.25, 0.75], By = (e) => Ml(e.getBoundingClientRect(), Ry), Sl = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Iy = bs, Ly = (e, t, { size: n }, a = Iy) => _l(e, Sl[t], a * n, "stand");
function _l(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Ny = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, El = 0.1, Dy = (e, t, { size: n }) => _l(e, Ny[t], El * n, "sit"), Py = (e) => ((e + 180) % 360 + 360) % 360 - 180, $a = 60;
function lx(e, t) {
  const n = Py(t);
  return !e.aside || Math.abs(n) >= $a ? t : n < 0 ? 360 - $a : $a;
}
const Vt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, jy = (e) => [.../* @__PURE__ */ new Set([e, ...Vt.turns.map((t) => (t + 360) % 360)])];
function ix(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = jy(t), r = Vt.every[0] + a() * (Vt.every[1] - Vt.every[0]);
  return { face: t, from: s ? qy(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + r };
}
function qy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Vt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function cx(e, t) {
  const { element: n, edge: a } = Zn(), s = ["left", "right"].map((l) => cn(Dy(a, l, e), e)).filter((l) => n && ws(l, e) && !ks(l, e)), o = (l) => t ? Math.abs(l.x - t.x) : 0, r = s.sort((l, i) => o(l) - o(i))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function ux(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Al } : e;
}
const Al = 7;
function Cl() {
  const e = [...document.querySelectorAll(Xv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Fy(e, t) {
  const n = Ze(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function Wy(e, t) {
  const n = Cl();
  return !n || !Yn(Fy(e, t), n);
}
const Hy = 4;
function Zn() {
  const e = un(), t = Cl(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Hy || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Al - n, 0) } };
}
const dx = ({ size: e, below: t }) => (1 - t) * e;
function cn(e, t) {
  const n = St(), { size: a, below: s } = t, o = ln[e.posture].drop * a;
  return { ...Cy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Za = (e, t) => Object.keys(Sl).map((n) => cn(Ly(e, n, t), t)), xs = (e, t) => Ml(e, uy).map((n) => cn(n, t)), Ol = (e, t, n) => tn(e, t, n) ?? e[0];
function fx(e, t) {
  const { element: n, edge: a } = Zn();
  return { ...Ol(Za(a, e), e, t), view: null, on: n };
}
function hx(e, t, n, a) {
  const { element: s, edge: o } = Zn(), r = (a ? Za(o, t) : [...Za(o, t), ...xs(o, t)]).filter(
    (u) => !Yn(Ze(u, t), e)
  ), l = tn(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = l && !ks(l, t) ? l : tn(r, t, n);
  return i && { ...i, view: null, on: s };
}
function un() {
  var a;
  const e = rn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(iy);
  if (!t) return { ...Xn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Ro = { within: 2 };
function mx(e) {
  const { element: t, docked: n, edge: a } = un();
  if (!n || e.on !== t) return !0;
  const s = Xn().edge;
  return a.left > s.left + Ro.within || a.left + a.width < s.left + s.width - Ro.within;
}
const Uy = "[data-figure-closing]";
function px() {
  var n;
  const { element: e, docked: t } = un();
  return t && !!((n = e.firstElementChild) != null && n.matches(Uy));
}
const Tl = "[data-figure-progress]";
function gx(e) {
  const t = e.querySelector(Tl);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function vx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, r) => s(r) < s(o) ? r : o) : null;
}
const zy = { across: 300, above: 380, below: 60 };
function yx(e) {
  const { across: t, above: n, below: a } = zy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Vy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Vy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Rl = "[data-figure-bar]", Xa = { back: 144, along: 0.4 };
function wx(e) {
  const { element: t, docked: n, edge: a } = un(), s = n ? t.querySelector(Rl) : null;
  if (!(s != null && s.querySelector(Tl))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...cn({ x: o - Xa.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function bx(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Xa.along * a.size ? t.x + Xa.along * a.size : e.x, y: e.y, behind: !0 };
}
function kx(e) {
  const t = e.querySelector(Rl), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Xn() {
  const e = rn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function xx(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: l } = Xn(), i = n === null ? Gy(l, e, o === null ? t : { x: o, y: l.top }, a, s) : cn({ x: n, y: l.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: r, stays: !0 };
}
function Gy(e, t, n, a, s) {
  const o = xs(e, t), r = Math.min(...o.map((i) => i.x)), l = o.filter((i) => i.x + a + nt.width < s && i.x + a - rt.reach - rt.room >= r);
  return tn(l.length ? l : o, t, n);
}
const Ky = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function $x(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: r = !1, random: l = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || r) && (s = Math.max(s, kl));
  const v = (ee) => {
    const j = Ze(ee, n, ln[ee.posture].travels);
    return { x: j.left, y: j.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Yy(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [O, ...b] = [e, ...i, t].map(v), L = Pn(O, b[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: r, random: l, memory: u, now: d, room: f, pogo: m }), z = b.slice(1).map((ee, j) => {
    var M;
    return (M = Pn(b[j], ee, n.size, { random: l, memory: u, now: d, room: f })) == null ? void 0 : M.legs.find((S) => S.hopping);
  });
  return L && { ...L, legs: [...L.legs, ...z.filter(Boolean)] };
}
function Yy(e, t, n, a, s, o, r) {
  const l = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Ky.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Pn(e, n, o.size, { pace: r }) : Pn(n, t, o.size, { pace: r }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], l(n, t)] : [l(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function Mx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function Sx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && tn(By(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Zn();
  return { ...Ol(xs(s, t), t, n), view: null, on: a };
}
const Jy = "[data-figure-bubble]", Zy = 250;
let Gt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Bl = 0;
const Pt = () => Gt, Ma = /* @__PURE__ */ new WeakMap();
let Xy = 0;
function $s(e) {
  return Ma.has(e) || Ma.set(e, `floor-${++Xy}`), Ma.get(e);
}
const Qy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, ew = () => {
  var e, t;
  return ((t = (e = rn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function tw(e, t) {
  var a;
  const n = (a = e.querySelector(cy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function nw(e, t) {
  const n = e && tw(e, t), a = e ? [...e.querySelectorAll(Jy)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: r }) => ({ element: o, type: r, box: o.getBoundingClientRect() })).filter(({ type: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Qy(r, n))).map(({ element: o, type: r, box: l }) => ({ id: $s(o), type: r, element: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom }));
}
const aw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Zy ? (t.top - a.top) / s * 1e3 : 0;
};
function Il(e = Gt, t = performance.now()) {
  const n = St(), a = ew(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: l } = un(), i = [];
  o && i.push({ id: "home", type: r ? "dock" : "compose", element: o, left: l.left, right: l.left + l.width, top: l.top });
  const u = Xn();
  return u.element && i.push({ id: $s(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...nw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: aw(e, d, t) }))) });
}
const Qa = /* @__PURE__ */ new Set();
function sw(e) {
  return Qa.add(e), () => Qa.delete(e);
}
function ow() {
  Ll();
  const e = () => {
    Bl = requestAnimationFrame(e), !document.hidden && (Gt = Il(Gt), Qa.forEach((t) => t(Gt)));
  };
  e();
}
function Ll() {
  cancelAnimationFrame(Bl);
}
const Ms = 5, rw = 56, lw = { share: 0.6 }, iw = (e) => -Math.sqrt(2 * ps * lw.share * e), It = (e, t) => e.find((n) => n.id === t) ?? null;
function _x(e, t = Il().floors) {
  const n = It(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : $s(e.on) : null, o = s && It(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Nl({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: r }, l, i = Pt().floors) {
  const u = It(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (r || cw(u, d, o)) && uw(d, l, i) ? { x: d.x, y: d.y } : null;
}
const Ss = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, cw = (e, t, n) => !Ss({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Ex(e, t = Pt().floors) {
  if (!Ss(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ms && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function uw(e, t, n = Pt().floors) {
  const a = It(n, "home");
  return e.posture === "hang" && a && Ze(e, t).bottom >= a.top ? !1 : ws(e, t);
}
function Ax(e, t, n, a = Pt().floors) {
  const s = Nl(e, n, a);
  if (!e.home) return dw(e, t, s, a);
  if (!s) return null;
  const o = It(a, "home"), r = s.y - t.y, l = r > Ms ? "dropping" : -r > rw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: l };
}
function dw(e, t, n, a) {
  const s = n ? It(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: iw(e.risen) };
  if (!n) return null;
  if (Ss(t) && n.y - t.y > Ms) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function Cx(e, t, n) {
  const a = bs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function Ox(e, t, n, a = Pt().floors) {
  const s = t && Nl(t, n, a);
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
}, pw = /* @__PURE__ */ J(mw, [["__scopeId", "data-v-ac620b01"]]), gw = {
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
    }), Re(() => {
      n(), Ll();
    }), (a, s) => (c(), h("div", gw, [
      (c(!0), h(K, null, te(t.value, (o) => (c(), W(pw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Tx = /* @__PURE__ */ J(vw, [["__scopeId", "data-v-c8fb9617"]]), Sa = (e) => typeof e == "number" ? e : Date.parse(e);
function Rx(e, t) {
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
function Bx(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= yw ? [bw(a, t)] : a), a = [];
  };
  for (const r of e) {
    const l = ww(r, t);
    l !== s && o(), s = l, l ? a.push(r) : n.push(r);
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
  return xt(() => clearInterval(t)), e;
}
const Mw = ["datetime", "title"], Qn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = $w(), a = B(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(F(Wr)(e.at, F(n))), 9, Mw));
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
  async function o(...r) {
    const l = await n.read(e(...r), t);
    s.value = l.ok ? "" : l.error, l.ok && (a.value = l.value);
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
}, Rw = {
  key: 2,
  class: "cards-note"
}, Bw = ["data-row", "onClick"], Iw = { class: "card-head" }, Lw = { class: "card-title" }, Nw = { class: "card-foot" }, Dw = {
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
        e.loaded ? e.failure ? (c(), h("p", Tw, w(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", Rw, "No " + w(e.noun) + "s yet", 1)) : (c(), W($t, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(K, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
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
        ], 8, Bw))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Wx = /* @__PURE__ */ J(Dw, [["__scopeId", "data-v-b9e18f79"]]), Bo = "newest";
function Hx(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = I(""), o = I(Bo), r = I("all"), l = B(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => Sw(m, d, a == null ? void 0 : a.fields) && (r.value === "all" || !n || n(m) === (r.value === "open")));
    return o.value === Bo ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = B(() => !!s.value.trim() || !!n && r.value !== "all");
  return { words: s, order: o, state: r, shown: l, filtering: i, hasStates: !!n };
}
const Pw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, jw = 40, qw = "top", Fw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = B(() => a === qw), o = I(null), r = I(!1), l = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      r.value = l(o.value) >= jw;
    }
    return he(() => n.rowCount, async () => {
      await it(), !r.value && o.value && (o.value.scrollTop = i());
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
          Je(g("button", {
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
            [Wo, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Ux = /* @__PURE__ */ J(Fw, [["__scopeId", "data-v-ffe6b8a5"]]), Ww = ["aria-selected", "data-tab", "onClick"], Hw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Uw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) }, tabs: { type: Array, default: null } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = $e(Se, null), o = B(() => n.tabs ?? (s == null ? void 0 : s.tabs) ?? []), r = I(null), l = I({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function u(m) {
      var y;
      const v = (y = r.value) == null ? void 0 : y.querySelector(".inner-tab.on");
      if (!v) return void (l.value = { left: 0, width: 0, slides: !1 });
      l.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, r.value.scrollWidth > r.value.clientWidth && (r.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => it(() => u(!0));
    let f = null;
    return Oe(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(r.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Re(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: r,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(K, null, te(o.value, (y) => {
        var O, b;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: X(["inner-tab", { on: ((O = e.active) == null ? void 0 : O.key) === y.key }]),
          "aria-selected": ((b = e.active) == null ? void 0 : b.key) === y.key,
          "data-tab": y.key,
          onClick: (L) => a("choose", y)
        }, [
          ne(w(y.label) + " ", 1),
          i(y) ? (c(), h("span", Hw, w(e.answer[y.count_field]), 1)) : C("", !0)
        ], 10, Ww);
      }), 128)),
      g("i", {
        class: X(["inner-tabs-line", { slides: l.value.slides }]),
        style: fe({ left: `${l.value.left}px`, width: `${l.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, zx = /* @__PURE__ */ J(Uw, [["__scopeId", "data-v-e0def8d7"]]), zw = {
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
      n.value ? (c(), W($t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Je(g("div", Vw, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Wo, !n.value]
      ])
    ]));
  }
}, Vx = /* @__PURE__ */ J(Gw, [["__scopeId", "data-v-fe3ebcad"]]), Kw = {}, Yw = { class: "menu-label" };
function Jw(e, t) {
  return c(), h("span", Yw, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const es = /* @__PURE__ */ J(Kw, [["render", Jw], ["__scopeId", "data-v-71c11156"]]), Zw = {
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
    const a = e, s = n, o = Ql(), r = ((L = $e(Se, null)) == null ? void 0 : L.search) ?? {}, l = B(() => r.placeholder || a.placeholder), i = r.context ?? [], u = I(null), d = I(null), f = I([]), m = B(() => f.value.length ? f.value[f.value.length - 1].next : i), v = B(() => !!o.menu || i.length > 0), y = (z) => {
      f.value = [], d.value = d.value ? null : z.currentTarget;
    };
    function O(z) {
      if (z.next.length) {
        f.value = [...f.value, z];
        return;
      }
      d.value = null, s("pick", z.click);
    }
    function b() {
      var z;
      s("update:modelValue", ""), (z = u.value) == null || z.focus();
    }
    return t({ focus: () => {
      var z;
      return (z = u.value) == null ? void 0 : z.focus();
    } }), (z, ee) => {
      var j;
      return c(), h("div", Zw, [
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
            placeholder: l.value,
            "aria-label": l.value,
            onInput: ee[0] || (ee[0] = (M) => s("update:modelValue", M.target.value)),
            onKeydown: Kt(b, ["esc"])
          }, null, 40, Qw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: b
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
        (j = F(r).button) != null && j.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: ee[1] || (ee[1] = (M) => s("pick", F(r).button.click))
        }, w(F(r).button.title), 1)) : C("", !0),
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
            f.value.length ? (c(), W(wt, {
              key: 0,
              "data-search-back": "",
              onClick: ee[2] || (ee[2] = (M) => f.value = f.value.slice(0, -1))
            }, {
              default: D(() => [
                ne("‹ " + w(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(K, null, te(m.value, (M) => (c(), W(wt, {
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
}, ab = /* @__PURE__ */ J(nb, [["__scopeId", "data-v-8617b565"]]), sb = {
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
    return (o, r) => (c(), W(ab, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (l) => e.tools.words.value = l),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (l) => n("pick", l))
    }, {
      menu: D(() => [
        N(es, null, {
          default: D(() => [...r[2] || (r[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, te(a, (l) => N(wt, {
          key: l.key,
          checked: e.tools.order.value === l.key,
          "data-list-order": l.key,
          onClick: (i) => e.tools.order.value = l.key
        }, {
          default: D(() => [
            ne(w(l.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          N(es, null, {
            default: D(() => [...r[3] || (r[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, te(s, (l) => N(wt, {
            key: l.key,
            checked: e.tools.state.value === l.key,
            "data-list-state": l.key,
            onClick: (i) => e.tools.state.value = l.key
          }, {
            default: D(() => [
              ne(w(l.label), 1)
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
}, Gx = /* @__PURE__ */ J(sb, [["__scopeId", "data-v-9c2114d0"]]);
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
function rb(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ts(t) - ts(e)) / ob);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Jx(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ts(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: rb(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ea = 280, Aa = 240, Ca = 120, lb = 6, ib = 14, nn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function cb(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Dl(e, t) {
  const n = Math.max(0, cb(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function ub(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${ib}px)` }), e.offsetHeight, e.style.transition = `height ${Ea}ms ${nn}`, e.style.height = `${r}px`;
  const l = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Dl(t, e));
    const m = s() - l;
    if (!i && m >= Ea && (i = !0, e.style.transition = `opacity ${Aa}ms ease-out, transform ${Aa}ms ${nn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ea + Aa) return a(f);
    d();
  };
  return a(f), d;
}
function Zx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${lb}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ca}ms ease-out, transform ${Ca}ms ${nn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = s(), l = () => {
    if (n() && (t.scrollTop = Dl(t, e)), s() - r < Ca) return a(l);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(l);
}
const db = 140, $n = 220, Io = 5;
function Xx({ gap: e = db, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, r = !1;
  function l(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Io);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, l(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = ub) => {
    if (r || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, l(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= Io && u.flush();
  };
  return u.flush = () => {
    var d;
    r = !0, queueMicrotask(() => r = !1);
    for (const f of [...a]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), s = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, u;
}
function Qx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${$n}ms ${nn}, opacity ${$n}ms ease-in, margin ${$n}ms ${nn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, $n);
}
const Pl = "chat.pins.minimised", Cn = I(On(Pl, !1));
function Lo(e) {
  Cn.value = e, cs(Pl, e);
}
function fb(e) {
  const t = B(() => e()), n = B(() => Cn.value ? [] : e()), a = () => Lo(!Cn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => bt(o) > s).length,
    (o, r) => o > r && Lo(!1)
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
    return (o, r) => F(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: F(a), inline: e.inline }]),
      title: F(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = we((...l) => F(s) && F(s)(...l), ["stop"]))
    }, [
      N(me, {
        name: F(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      F(a) ? (c(), h("span", mb, w(F(n).length), 1)) : C("", !0)
    ], 10, hb)) : C("", !0);
  }
}, e8 = /* @__PURE__ */ J(pb, [["__scopeId", "data-v-999f2559"]]), gb = ["title"], vb = ["title"], yb = { class: "diff-card-dir" }, wb = { class: "diff-card-name" }, bb = ["title"], kb = ["title"], xb = {
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
    const r = { new: "created", deleted: "deleted" }, l = { add: "+", del: "−" }, i = B(() => n.path.lastIndexOf("/") + 1), u = B(() => n.path.slice(0, i.value)), d = B(() => n.path.slice(i.value)), f = B(() => n.change === "deleted"), m = B(() => r[n.change]), v = B(() => new Set(n.rows.filter((T) => T.line_type === "add").map((T) => T.line))), y = I("after"), O = B(() => y.value === "before" ? n.whole.old : n.whole.text), b = B(() => n.whole && n.whole.text !== void 0 ? O.value.split(`
`).map((T, k) => ({ line_type: y.value === "after" && v.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: T })) : n.rows.filter(
      (T) => !(n.editsOnly && ["ctx", "fold"].includes(T.line_type)) && !(n.hideRemovals && T.line_type === "del")
    )), L = I(!1), z = B(() => n.lines && !L.value && !n.whole), ee = B(() => z.value ? b.value.slice(0, n.lines) : b.value), j = B(() => b.value.length - ee.value.length), M = (T) => T.line === null || T.line_type === "del" ? "" : T.line, S = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, R = I(null), A = I(null);
    let x = null;
    return Oe(() => {
      if (!A.value) return;
      let T = !0;
      x = new ResizeObserver(() => {
        !R.value || !A.value || (R.value.style.transition = T ? "none" : "", R.value.style.height = `${A.value.offsetHeight}px`, T = !1);
      }), x.observe(A.value);
    }), Re(() => x && x.disconnect()), (T, k) => (c(), h("section", {
      class: X(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (p) => !f.value && a("fold"))
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
          onClick: k[0] || (k[0] = we((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, w(y.value === "after" ? "After" : "Before"), 9, bb)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = we((p) => a("whole"), ["stop"]))
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
          ref: R,
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
                g("span", Eb, w(l[p.line_type]), 1),
                g("span", Ab, w(S(p)), 1)
              ], 2))), 128)),
              j.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = we((p) => L.value = !0, ["stop"]))
              }, w(j.value) + " more " + w(j.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, t8 = /* @__PURE__ */ J(Cb, [["__scopeId", "data-v-9c99c502"]]), Ob = {
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
    return n.follow(["*.*"], Zo(s, kw.openPanel)), s(), (o, r) => a.value && !a.value.ok ? (c(), h("p", Ob, w(a.value.error), 1)) : a.value ? (c(), W(Oh, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : C("", !0);
  }
}, Rb = {
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
    const n = t, a = e, s = B(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = B(() => s.value && { render: () => Wn(Tb, { line: s.value.line }) }), r = I(null), l = B(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = r.value) != null && v.component_trusted);
    }), i = B(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = B(
      () => {
        var m, v;
        return r.value ? eg(r.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
      }
    );
    async function d() {
      if (!s.value || s.value.allowed || !a.shellRead) return;
      const m = await a.shellRead(`window permissions ${a.name} --environment ${a.environment}`);
      r.value = m.ok ? m.value : null;
    }
    async function f() {
      const m = await a.prompts.ask(s.value.title, r.value);
      return await d(), m;
    }
    return he(
      () => {
        var m, v;
        return ((m = s.value) == null ? void 0 : m.entry_url) || ((v = s.value) == null ? void 0 : v.line);
      },
      async () => {
        await d(), u.value.missing.length && !l.value && f();
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
      })) : l.value ? (c(), W(Ut, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), W(Jr, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (b, L) => n("option", b, L))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), W(Yr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (b, L) => n("option", b, L))
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
        onOption: v[2] || (v[2] = (b, L) => n("option", b, L))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), W(Ut, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (b) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Bb = ["data-section"], Ib = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(Rc, null), a = B(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = B(() => ({ row: t.row }));
    return (o, r) => (c(!0), h(K, null, te(a.value, (l) => (c(), h("div", {
      key: l.name,
      class: "inspector-section",
      "data-section": l.name
    }, [
      N(Rb, {
        name: l.name,
        catalogue: F(n).catalogue,
        subscriptions: F(n).subscriptions,
        environment: F(n).environment,
        prompts: F(n).prompts,
        "shell-read": F(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Bb))), 128));
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
    const a = e, s = n, o = B(() => Qg(a.noun, a.row)), r = I(""), l = I(null), i = I(""), u = I("");
    he(() => a.id, () => {
      r.value = "", l.value = null;
    });
    async function d(v, y = "") {
      const O = await a.read([v.noun ?? a.noun, v.word, String(a.id), ...v.flag ? [v.flag, y] : v.positional ? [y] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = O.ok ? "" : O.error, O.ok && (l.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (v) => v.confirm ? l.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (l.value = v, i.value = "") : d(v), m = () => i.value.trim() && d(l.value, i.value.trim());
    return t({ moves: o, press: f }), (v, y) => {
      var O;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: X(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", Nb, w(r.value), 1)) : C("", !0),
        (O = l.value) != null && O.confirm ? (c(), h("div", Db, [
          g("span", Pb, w(l.value.confirm), 1),
          N(ue, {
            small: "",
            variant: l.value.danger ? "ghost" : "primary",
            bordered: l.value.danger,
            class: X({ danger: l.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (b) => d(l.value))
          }, {
            default: D(() => [
              ne(w(l.value.label), 1)
            ]),
            _: 1
          }, 8, ["variant", "bordered", "class"]),
          N(ue, {
            small: "",
            variant: "ghost",
            onClick: y[1] || (y[1] = (b) => l.value = null)
          }, {
            default: D(() => [...y[7] || (y[7] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ])) : l.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: we(m, ["prevent"])
        }, [
          Je(g("input", {
            "onUpdate:modelValue": y[2] || (y[2] = (b) => i.value = b),
            class: "ask-input",
            placeholder: l.value.ask,
            "aria-label": l.value.ask,
            onKeydown: y[3] || (y[3] = Kt(we((b) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, jb), [
            [Ba, i.value]
          ]),
          l.value.opener ? Je((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (b) => u.value = b),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: l.value.opener,
            "aria-label": l.value.opener,
            onKeydown: y[5] || (y[5] = Kt(we((b) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, qb)), [
            [Ba, u.value]
          ]) : C("", !0),
          N(ue, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: D(() => [
              ne(w(l.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          N(ue, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (b) => l.value = null)
          }, {
            default: D(() => [...y[8] || (y[8] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Fb, [
          (c(!0), h(K, null, te(o.value, (b) => (c(), W(ue, {
            key: b.word,
            small: !b.bordered,
            bordered: b.bordered,
            icon: b.icon,
            variant: b.main ? "primary" : "ghost",
            class: X({ danger: b.danger }),
            "data-move": b.word,
            onClick: (L) => f(b)
          }, {
            default: D(() => [
              ne(w(b.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : C("", !0);
    };
  }
}, Hb = /* @__PURE__ */ J(Wb, [["__scopeId", "data-v-5254ddd4"]]), Ub = /* @__PURE__ */ new Set(["completed", "cancelled"]), zb = (e) => Ub.has(e), Fn = (e) => zb(e) ? "done" : e, Vb = { class: "facts" }, Gb = { class: "fact wide" }, Kb = { class: "fact-value" }, Yb = {
  key: 0,
  class: "fact"
}, Jb = { class: "fact-value" }, Zb = { class: "fact" }, Xb = { class: "fact-label" }, Qb = ["title"], ek = {
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
}, rk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = In.map(({ key: o, label: r }) => ({ key: String(o), label: r })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var l, i;
      return c(), h("div", Vb, [
        g("div", Gb, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", Kb, w((l = e.place) != null && l.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Yb, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", Jb, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(K, { key: 1 }, [
          g("div", Zb, [
            g("span", Xb, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => F(Pe)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, Qb)
          ]),
          F(s).has(e.task.state) ? (c(), h("p", ek, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", tk, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", nk, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", ak, "Agent " + w(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", sk, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          N(zn, {
            options: F(n),
            value: String(F(Ur)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", ok, w(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, lk = /* @__PURE__ */ J(rk, [["__scopeId", "data-v-19f073bc"]]), ik = {
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
}, dk = /* @__PURE__ */ J(uk, [["__scopeId", "data-v-3019b030"]]), fk = {
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
    const t = e, n = B(() => ar("task", Fn(t.status))), a = B(() => n.value === "testing" ? "started" : n.value), s = B(() => hk[t.status] ?? nr("task", t.status));
    return (o, r) => (c(), h("span", mk, [
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
              blocked: D(() => [...r[0] || (r[0] = [
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
              done: D(() => [...r[1] || (r[1] = [
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
              started: D(() => [...r[2] || (r[2] = [
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
              asked: D(() => [...r[3] || (r[3] = [
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
              paused: D(() => [...r[4] || (r[4] = [
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
              planned: D(() => [...r[5] || (r[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: D(() => [...r[6] || (r[6] = [
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
}, jl = /* @__PURE__ */ J(gk, [["__scopeId", "data-v-b13c7c09"]]), vk = {
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
        onClick: (r) => n("select", o.id)
      }, [
        N(jl, {
          status: F(Fn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", wk, w(o.id), 1),
        g("span", bk, w(o.title), 1)
      ], 8, yk))), 128))
    ]));
  }
}, No = /* @__PURE__ */ J(kk, [["__scopeId", "data-v-96a767b5"]]), xk = {
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
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), r = B(() => a.task.waits.filter((i) => !n.has(i.state))), l = B(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(K, null, [
      r.value.length ? (c(), W(No, {
        key: 0,
        title: "Waits on",
        waits: r.value,
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
      l.value.length ? (c(), W(No, {
        key: 3,
        title: "Waited on",
        waits: l.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, Ek = /* @__PURE__ */ J(_k, [["__scopeId", "data-v-b628bea5"]]), Ak = {
  class: "task-details",
  "data-task-details": ""
}, Ck = { class: "since" }, Ok = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Tk = { class: "text" }, Rk = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Bk = {
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
      var r;
      return c(), h("div", Ak, [
        g("div", {
          class: X(["state-line", F(Fn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (l) => n("status", l.currentTarget))
          }, [
            N(jl, {
              status: F(Fn)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + w(a(e.task.state)), 1)
          ]),
          g("span", Ck, [
            o[3] || (o[3] = ne(" since ", -1)),
            N(Qn, {
              at: F(Ir)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", Ok, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", Tk, w(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", Rk, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Bk, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Ik, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", Lk, w(e.task.reason), 1)
        ])) : C("", !0),
        N(lk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (l) => n("priority", l))
        }, null, 8, ["task", "place", "refusal"]),
        N(Ek, {
          task: e.task,
          onSelect: o[2] || (o[2] = (l) => n("select", l))
        }, null, 8, ["task"]),
        N(dk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Dk = /* @__PURE__ */ J(Nk, [["__scopeId", "data-v-7b9702f2"]]), Pk = 50, jk = { messages: 25 }, qk = (e) => jk[e] || Pk, Fk = {
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
    const t = e, n = I([]), a = I(1), s = I(!0), o = I(!0), r = I("");
    let l = 0;
    async function i(u = 1) {
      const d = ++l;
      a.value = u, o.value = !0, r.value = "";
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
      d === l && (o.value = !1, r.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return he(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), xt(() => {
      l += 1;
    }), (u, d) => (c(), h("section", Fk, [
      o.value ? (c(), W($t, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        g("p", Wk, w(r.value), 1),
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
}, Kk = /* @__PURE__ */ J(Gk, [["__scopeId", "data-v-91807335"]]), Yk = { class: "comment-side-head" }, Jk = {
  key: 0,
  class: "comment-none"
}, Zk = {
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
      e.comments.length ? C("", !0) : (c(), h("p", Jk, "No comments yet")),
      (c(!0), h(K, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, w(e.words(a)), 1))), 128))
    ], 2));
  }
}, Xk = /* @__PURE__ */ J(Zk, [["__scopeId", "data-v-b224a4e7"]]);
var Po;
/Mac|iPhone|iPad/.test(((Po = navigator.userAgentData) == null ? void 0 : Po.platform) || navigator.platform);
function Qk(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const e2 = ["placeholder"], t2 = { class: "actions" }, n2 = { class: "error" }, a2 = {
  key: 1,
  class: "card closed"
}, s2 = { class: "mark" }, o2 = { class: "prompt" }, r2 = {
  key: 0,
  class: "draft"
}, l2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ra({
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
  emits: /* @__PURE__ */ Ra(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = Ta(e, "draft"), r = Ta(e, "error"), l = I(!!r.value), i = I(!1), u = I(!1), d = I(null);
    async function f() {
      var y, O;
      l.value = !0, i.value = !1, await it(), (O = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || O.focus();
    }
    function m() {
      l.value = !1, r.value = "";
    }
    async function v() {
      const y = o.value.trim();
      if (!(!y || !a.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await a.send(y), l.value = !1, i.value = !0;
        } catch (O) {
          o.value = y, r.value = O.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (y, O) => (c(), h("div", {
      class: X(["comment-bar", { open: l.value }])
    }, [
      l.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: we(v, ["prevent"]),
        onKeydown: Kt(m, ["esc"])
      }, [
        ce(y.$slots, "who", {}, void 0, !0),
        Je(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": O[0] || (O[0] = (b) => o.value = b),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: O[1] || (O[1] = Kt((b) => F(Qk)(b, v), ["enter"]))
        }, null, 40, e2), [
          [Ba, o.value]
        ]),
        g("div", t2, [
          g("span", n2, w(r.value), 1),
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
          o.value.trim() ? (c(), h("span", r2, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: O[2] || (O[2] = (b) => s("show"))
        }, [
          g("span", null, w(F(Ai)(e.count, "comment")), 1),
          N(me, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, i2 = /* @__PURE__ */ J(l2, [["__scopeId", "data-v-54460909"]]);
function c2(e, t) {
  const n = I([]), a = I(!1);
  let s = 0, o = 0;
  const r = (u) => {
    const { noun: d, id: f, title: m } = e(), v = `On ${d} ${f}, ${m}: `;
    return u.text.startsWith(v) ? u.text.slice(v.length) : u.text;
  };
  async function l() {
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
    await l();
  }
  return he(() => e().id, () => {
    a.value = !1, n.value = [], l();
  }, { immediate: !0 }), { comments: n, open: a, words: r, send: i, load: l };
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
    const a = e, s = n, o = I(null), r = I(null), l = I(""), i = I(""), u = I(null), d = I(null), f = I("details"), m = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = c2(
      () => o.value ? { noun: "task", id: a.id, title: o.value.title } : {},
      (j) => a.read(j)
    );
    let y = 0;
    const O = B(() => {
      var j;
      return (j = r.value) != null && j.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function b() {
      const j = ++y, [M, S] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      j === y && (l.value = M.ok ? "" : M.error, o.value = M.ok ? M.value : null, r.value = S.ok ? S.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", b();
      },
      { immediate: !0 }
    ), he(() => a.changes, b), he(v.open, (j) => {
      j && (f.value = "comments");
    });
    async function L(j) {
      const M = o.value.priority;
      o.value.priority = Number(j);
      const S = await a.read(["task", "edit", String(a.id), "--priority", j]);
      if (i.value = S.ok ? "" : S.error, S.ok) return b();
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
      l.value ? (c(), h("p", f2, w(l.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        N(Hb, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: b
        }, null, 8, ["id", "row", "read"]),
        g("header", m2, [
          g("div", p2, [
            ne(" Task " + w(o.value.id) + " · updated ", 1),
            N(Qn, {
              at: F(Ir)(o.value)
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
                place: r.value,
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
        N($t)
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
          (c(!0), h(K, null, te(d.value.moves, (S) => (c(), W(wt, {
            key: S.word,
            onClick: (R) => z(S)
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
}, n8 = /* @__PURE__ */ J(w2, [["__scopeId", "data-v-fb56bf88"]]);
function b2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Oa = { exports: {} }, Do;
function k2() {
  return Do || (Do = 1, (function(e, t) {
    var n = (function() {
      var a = function(M, S) {
        var R = 236, A = 17, x = M, T = o[S], k = null, p = 0, _ = null, E = [], $ = {}, V = function(q, H) {
          p = x * 4 + 17, k = (function(P) {
            for (var U = new Array(P), G = 0; G < P; G += 1) {
              U[G] = new Array(P);
              for (var Q = 0; Q < P; Q += 1)
                U[G][Q] = null;
            }
            return U;
          })(p), Z(0, 0), Z(p - 7, 0), Z(0, p - 7), ve(), ie(), Fe(q, H), x >= 7 && Te(q), _ == null && (_ = ql(x, T, E)), We(_, H);
        }, Z = function(q, H) {
          for (var P = -1; P <= 7; P += 1)
            if (!(q + P <= -1 || p <= q + P))
              for (var U = -1; U <= 7; U += 1)
                H + U <= -1 || p <= H + U || (0 <= P && P <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (P == 0 || P == 6) || 2 <= P && P <= 4 && 2 <= U && U <= 4 ? k[q + P][H + U] = !0 : k[q + P][H + U] = !1);
        }, Y = function() {
          for (var q = 0, H = 0, P = 0; P < 8; P += 1) {
            V(!0, P);
            var U = l.getLostPoint($);
            (P == 0 || q > U) && (q = U, H = P);
          }
          return H;
        }, ie = function() {
          for (var q = 8; q < p - 8; q += 1)
            k[q][6] == null && (k[q][6] = q % 2 == 0);
          for (var H = 8; H < p - 8; H += 1)
            k[6][H] == null && (k[6][H] = H % 2 == 0);
        }, ve = function() {
          for (var q = l.getPatternPosition(x), H = 0; H < q.length; H += 1)
            for (var P = 0; P < q.length; P += 1) {
              var U = q[H], G = q[P];
              if (k[U][G] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? k[U + Q][G + oe] = !0 : k[U + Q][G + oe] = !1;
            }
        }, Te = function(q) {
          for (var H = l.getBCHTypeNumber(x), P = 0; P < 18; P += 1) {
            var U = !q && (H >> P & 1) == 1;
            k[Math.floor(P / 3)][P % 3 + p - 8 - 3] = U;
          }
          for (var P = 0; P < 18; P += 1) {
            var U = !q && (H >> P & 1) == 1;
            k[P % 3 + p - 8 - 3][Math.floor(P / 3)] = U;
          }
        }, Fe = function(q, H) {
          for (var P = T << 3 | H, U = l.getBCHTypeInfo(P), G = 0; G < 15; G += 1) {
            var Q = !q && (U >> G & 1) == 1;
            G < 6 ? k[G][8] = Q : G < 8 ? k[G + 1][8] = Q : k[p - 15 + G][8] = Q;
          }
          for (var G = 0; G < 15; G += 1) {
            var Q = !q && (U >> G & 1) == 1;
            G < 8 ? k[8][p - G - 1] = Q : G < 9 ? k[8][15 - G - 1 + 1] = Q : k[8][15 - G - 1] = Q;
          }
          k[p - 8][8] = !q;
        }, We = function(q, H) {
          for (var P = -1, U = p - 1, G = 7, Q = 0, oe = l.getMaskFunction(H), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (k[U][se - ye] == null) {
                  var ke = !1;
                  Q < q.length && (ke = (q[Q] >>> G & 1) == 1);
                  var le = oe(U, se - ye);
                  le && (ke = !ke), k[U][se - ye] = ke, G -= 1, G == -1 && (Q += 1, G = 7);
                }
              if (U += P, U < 0 || p <= U) {
                U -= P, P = -P;
                break;
              }
            }
        }, _t = function(q, H) {
          for (var P = 0, U = 0, G = 0, Q = new Array(H.length), oe = new Array(H.length), se = 0; se < H.length; se += 1) {
            var ye = H[se].dataCount, ke = H[se].totalCount - ye;
            U = Math.max(U, ye), G = Math.max(G, ke), Q[se] = new Array(ye);
            for (var le = 0; le < Q[se].length; le += 1)
              Q[se][le] = 255 & q.getBuffer()[le + P];
            P += ye;
            var Be = l.getErrorCorrectPolynomial(ke), Ie = u(Q[se], Be.getLength() - 1), _s = Ie.mod(Be);
            oe[se] = new Array(Be.getLength() - 1);
            for (var le = 0; le < oe[se].length; le += 1) {
              var Es = le + _s.getLength() - oe[se].length;
              oe[se][le] = Es >= 0 ? _s.getAt(Es) : 0;
            }
          }
          for (var As = 0, le = 0; le < H.length; le += 1)
            As += H[le].totalCount;
          for (var ea = new Array(As), dn = 0, le = 0; le < U; le += 1)
            for (var se = 0; se < H.length; se += 1)
              le < Q[se].length && (ea[dn] = Q[se][le], dn += 1);
          for (var le = 0; le < G; le += 1)
            for (var se = 0; se < H.length; se += 1)
              le < oe[se].length && (ea[dn] = oe[se][le], dn += 1);
          return ea;
        }, ql = function(q, H, P) {
          for (var U = d.getRSBlocks(q, H), G = f(), Q = 0; Q < P.length; Q += 1) {
            var oe = P[Q];
            G.put(oe.getMode(), 4), G.put(oe.getLength(), l.getLengthInBits(oe.getMode(), q)), oe.write(G);
          }
          for (var se = 0, Q = 0; Q < U.length; Q += 1)
            se += U[Q].dataCount;
          if (G.getLengthInBits() > se * 8)
            throw "code length overflow. (" + G.getLengthInBits() + ">" + se * 8 + ")";
          for (G.getLengthInBits() + 4 <= se * 8 && G.put(0, 4); G.getLengthInBits() % 8 != 0; )
            G.putBit(!1);
          for (; !(G.getLengthInBits() >= se * 8 || (G.put(R, 8), G.getLengthInBits() >= se * 8)); )
            G.put(A, 8);
          return _t(G, U);
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
          return k[q][H];
        }, $.getModuleCount = function() {
          return p;
        }, $.make = function() {
          if (x < 1) {
            for (var q = 1; q < 40; q++) {
              for (var H = d.getRSBlocks(q, T), P = f(), U = 0; U < E.length; U++) {
                var G = E[U];
                P.put(G.getMode(), 4), P.put(G.getLength(), l.getLengthInBits(G.getMode(), q)), G.write(P);
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
          var Q = $.getModuleCount() * q + H * 2, oe, se, ye, ke, le = "", Be;
          for (Be = "l" + q + ",0 0," + q + " -" + q + ",0 0,-" + q + "z ", le += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', le += G.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', le += ' viewBox="0 0 ' + Q + " " + Q + '" ', le += ' preserveAspectRatio="xMinYMin meet"', le += U.text || P.text ? ' role="img" aria-labelledby="' + Et([U.id, P.id].join(" ").trim()) + '"' : "", le += ">", le += U.text ? '<title id="' + Et(U.id) + '">' + Et(U.text) + "</title>" : "", le += P.text ? '<description id="' + Et(P.id) + '">' + Et(P.text) + "</description>" : "", le += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', le += '<path d="', ye = 0; ye < $.getModuleCount(); ye += 1)
            for (ke = ye * q + H, oe = 0; oe < $.getModuleCount(); oe += 1)
              $.isDark(ye, oe) && (se = oe * q + H, le += "M" + se + "," + ke + Be);
          return le += '" stroke="transparent" fill="black"/>', le += "</svg>", le;
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
          return G += "<img", G += ' src="', G += $.createDataURL(q, H), G += '"', G += ' width="', G += U, G += '"', G += ' height="', G += U, G += '"', P && (G += ' alt="', G += Et(P), G += '"'), G += "/>", G;
        };
        var Et = function(q) {
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
        }, Fl = function(q) {
          var H = 1;
          q = typeof q > "u" ? H * 2 : q;
          var P = $.getModuleCount() * H + q * 2, U = q, G = P - q, Q, oe, se, ye, ke, le = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Be = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ie = "";
          for (Q = 0; Q < P; Q += 2) {
            for (se = Math.floor((Q - U) / H), ye = Math.floor((Q + 1 - U) / H), oe = 0; oe < P; oe += 1)
              ke = "█", U <= oe && oe < G && U <= Q && Q < G && $.isDark(se, Math.floor((oe - U) / H)) && (ke = " "), U <= oe && oe < G && U <= Q + 1 && Q + 1 < G && $.isDark(ye, Math.floor((oe - U) / H)) ? ke += " " : ke += "█", Ie += q < 1 && Q + 1 >= G ? Be[ke] : le[ke];
            Ie += `
`;
          }
          return P % 2 && q > 0 ? Ie.substring(0, Ie.length - P - 1) + Array(P + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return $.createASCII = function(q, H) {
          if (q = q || 1, q < 2)
            return Fl(H);
          q -= 1, H = typeof H > "u" ? q * 2 : H;
          var P = $.getModuleCount() * q + H * 2, U = H, G = P - H, Q, oe, se, ye, ke = Array(q + 1).join("██"), le = Array(q + 1).join("  "), Be = "", Ie = "";
          for (Q = 0; Q < P; Q += 1) {
            for (se = Math.floor((Q - U) / q), Ie = "", oe = 0; oe < P; oe += 1)
              ye = 1, U <= oe && oe < G && U <= Q && Q < G && $.isDark(se, Math.floor((oe - U) / q)) && (ye = 0), Ie += ye ? ke : le;
            for (se = 0; se < q; se += 1)
              Be += Ie + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, $.renderTo2dContext = function(q, H) {
          H = H || 2;
          for (var P = $.getModuleCount(), U = 0; U < P; U++)
            for (var G = 0; G < P; G++)
              q.fillStyle = $.isDark(U, G) ? "black" : "white", q.fillRect(U * H, G * H, H, H);
        }, $;
      };
      a.stringToBytesFuncs = {
        default: function(M) {
          for (var S = [], R = 0; R < M.length; R += 1) {
            var A = M.charCodeAt(R);
            S.push(A & 255);
          }
          return S;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(M, S) {
        var R = (function() {
          for (var x = z(M), T = function() {
            var ie = x.read();
            if (ie == -1) throw "eof";
            return ie;
          }, k = 0, p = {}; ; ) {
            var _ = x.read();
            if (_ == -1) break;
            var E = T(), $ = T(), V = T(), Z = String.fromCharCode(_ << 8 | E), Y = $ << 8 | V;
            p[Z] = Y, k += 1;
          }
          if (k != S)
            throw k + " != " + S;
          return p;
        })(), A = 63;
        return function(x) {
          for (var T = [], k = 0; k < x.length; k += 1) {
            var p = x.charCodeAt(k);
            if (p < 128)
              T.push(p);
            else {
              var _ = R[x.charAt(k)];
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
      }, r = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      }, l = (function() {
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
        ], S = 1335, R = 7973, A = 21522, x = {}, T = function(k) {
          for (var p = 0; k != 0; )
            p += 1, k >>>= 1;
          return p;
        };
        return x.getBCHTypeInfo = function(k) {
          for (var p = k << 10; T(p) - T(S) >= 0; )
            p ^= S << T(p) - T(S);
          return (k << 10 | p) ^ A;
        }, x.getBCHTypeNumber = function(k) {
          for (var p = k << 12; T(p) - T(R) >= 0; )
            p ^= R << T(p) - T(R);
          return k << 12 | p;
        }, x.getPatternPosition = function(k) {
          return M[k - 1];
        }, x.getMaskFunction = function(k) {
          switch (k) {
            case r.PATTERN000:
              return function(p, _) {
                return (p + _) % 2 == 0;
              };
            case r.PATTERN001:
              return function(p, _) {
                return p % 2 == 0;
              };
            case r.PATTERN010:
              return function(p, _) {
                return _ % 3 == 0;
              };
            case r.PATTERN011:
              return function(p, _) {
                return (p + _) % 3 == 0;
              };
            case r.PATTERN100:
              return function(p, _) {
                return (Math.floor(p / 2) + Math.floor(_ / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(p, _) {
                return p * _ % 2 + p * _ % 3 == 0;
              };
            case r.PATTERN110:
              return function(p, _) {
                return (p * _ % 2 + p * _ % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(p, _) {
                return (p * _ % 3 + (p + _) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, x.getErrorCorrectPolynomial = function(k) {
          for (var p = u([1], 0), _ = 0; _ < k; _ += 1)
            p = p.multiply(u([1, i.gexp(_)], 0));
          return p;
        }, x.getLengthInBits = function(k, p) {
          if (1 <= p && p < 10)
            switch (k) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + k;
            }
          else if (p < 27)
            switch (k) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + k;
            }
          else if (p < 41)
            switch (k) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + k;
            }
          else
            throw "type:" + p;
        }, x.getLostPoint = function(k) {
          for (var p = k.getModuleCount(), _ = 0, E = 0; E < p; E += 1)
            for (var $ = 0; $ < p; $ += 1) {
              for (var V = 0, Z = k.isDark(E, $), Y = -1; Y <= 1; Y += 1)
                if (!(E + Y < 0 || p <= E + Y))
                  for (var ie = -1; ie <= 1; ie += 1)
                    $ + ie < 0 || p <= $ + ie || Y == 0 && ie == 0 || Z == k.isDark(E + Y, $ + ie) && (V += 1);
              V > 5 && (_ += 3 + V - 5);
            }
          for (var E = 0; E < p - 1; E += 1)
            for (var $ = 0; $ < p - 1; $ += 1) {
              var ve = 0;
              k.isDark(E, $) && (ve += 1), k.isDark(E + 1, $) && (ve += 1), k.isDark(E, $ + 1) && (ve += 1), k.isDark(E + 1, $ + 1) && (ve += 1), (ve == 0 || ve == 4) && (_ += 3);
            }
          for (var E = 0; E < p; E += 1)
            for (var $ = 0; $ < p - 6; $ += 1)
              k.isDark(E, $) && !k.isDark(E, $ + 1) && k.isDark(E, $ + 2) && k.isDark(E, $ + 3) && k.isDark(E, $ + 4) && !k.isDark(E, $ + 5) && k.isDark(E, $ + 6) && (_ += 40);
          for (var $ = 0; $ < p; $ += 1)
            for (var E = 0; E < p - 6; E += 1)
              k.isDark(E, $) && !k.isDark(E + 1, $) && k.isDark(E + 2, $) && k.isDark(E + 3, $) && k.isDark(E + 4, $) && !k.isDark(E + 5, $) && k.isDark(E + 6, $) && (_ += 40);
          for (var Te = 0, $ = 0; $ < p; $ += 1)
            for (var E = 0; E < p; E += 1)
              k.isDark(E, $) && (Te += 1);
          var Fe = Math.abs(100 * Te / p / p - 50) / 5;
          return _ += Fe * 10, _;
        }, x;
      })(), i = (function() {
        for (var M = new Array(256), S = new Array(256), R = 0; R < 8; R += 1)
          M[R] = 1 << R;
        for (var R = 8; R < 256; R += 1)
          M[R] = M[R - 4] ^ M[R - 5] ^ M[R - 6] ^ M[R - 8];
        for (var R = 0; R < 255; R += 1)
          S[M[R]] = R;
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
        var R = (function() {
          for (var x = 0; x < M.length && M[x] == 0; )
            x += 1;
          for (var T = new Array(M.length - x + S), k = 0; k < M.length - x; k += 1)
            T[k] = M[k + x];
          return T;
        })(), A = {};
        return A.getAt = function(x) {
          return R[x];
        }, A.getLength = function() {
          return R.length;
        }, A.multiply = function(x) {
          for (var T = new Array(A.getLength() + x.getLength() - 1), k = 0; k < A.getLength(); k += 1)
            for (var p = 0; p < x.getLength(); p += 1)
              T[k + p] ^= i.gexp(i.glog(A.getAt(k)) + i.glog(x.getAt(p)));
          return u(T, 0);
        }, A.mod = function(x) {
          if (A.getLength() - x.getLength() < 0)
            return A;
          for (var T = i.glog(A.getAt(0)) - i.glog(x.getAt(0)), k = new Array(A.getLength()), p = 0; p < A.getLength(); p += 1)
            k[p] = A.getAt(p);
          for (var p = 0; p < x.getLength(); p += 1)
            k[p] ^= i.gexp(i.glog(x.getAt(p)) + T);
          return u(k, 0).mod(x);
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
          var k = {};
          return k.totalCount = x, k.dataCount = T, k;
        }, R = {}, A = function(x, T) {
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
        return R.getRSBlocks = function(x, T) {
          var k = A(x, T);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + T;
          for (var p = k.length / 3, _ = [], E = 0; E < p; E += 1)
            for (var $ = k[E * 3 + 0], V = k[E * 3 + 1], Z = k[E * 3 + 2], Y = 0; Y < $; Y += 1)
              _.push(S(V, Z));
          return _;
        }, R;
      })(), f = function() {
        var M = [], S = 0, R = {};
        return R.getBuffer = function() {
          return M;
        }, R.getAt = function(A) {
          var x = Math.floor(A / 8);
          return (M[x] >>> 7 - A % 8 & 1) == 1;
        }, R.put = function(A, x) {
          for (var T = 0; T < x; T += 1)
            R.putBit((A >>> x - T - 1 & 1) == 1);
        }, R.getLengthInBits = function() {
          return S;
        }, R.putBit = function(A) {
          var x = Math.floor(S / 8);
          M.length <= x && M.push(0), A && (M[x] |= 128 >>> S % 8), S += 1;
        }, R;
      }, m = function(M) {
        var S = s.MODE_NUMBER, R = M, A = {};
        A.getMode = function() {
          return S;
        }, A.getLength = function(k) {
          return R.length;
        }, A.write = function(k) {
          for (var p = R, _ = 0; _ + 2 < p.length; )
            k.put(x(p.substring(_, _ + 3)), 10), _ += 3;
          _ < p.length && (p.length - _ == 1 ? k.put(x(p.substring(_, _ + 1)), 4) : p.length - _ == 2 && k.put(x(p.substring(_, _ + 2)), 7));
        };
        var x = function(k) {
          for (var p = 0, _ = 0; _ < k.length; _ += 1)
            p = p * 10 + T(k.charAt(_));
          return p;
        }, T = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return A;
      }, v = function(M) {
        var S = s.MODE_ALPHA_NUM, R = M, A = {};
        A.getMode = function() {
          return S;
        }, A.getLength = function(T) {
          return R.length;
        }, A.write = function(T) {
          for (var k = R, p = 0; p + 1 < k.length; )
            T.put(
              x(k.charAt(p)) * 45 + x(k.charAt(p + 1)),
              11
            ), p += 2;
          p < k.length && T.put(x(k.charAt(p)), 6);
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
        var S = s.MODE_8BIT_BYTE, R = a.stringToBytes(M), A = {};
        return A.getMode = function() {
          return S;
        }, A.getLength = function(x) {
          return R.length;
        }, A.write = function(x) {
          for (var T = 0; T < R.length; T += 1)
            x.put(R[T], 8);
        }, A;
      }, O = function(M) {
        var S = s.MODE_KANJI, R = a.stringToBytesFuncs.SJIS;
        if (!R)
          throw "sjis not supported.";
        (function(T, k) {
          var p = R(T);
          if (p.length != 2 || (p[0] << 8 | p[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var A = R(M), x = {};
        return x.getMode = function() {
          return S;
        }, x.getLength = function(T) {
          return ~~(A.length / 2);
        }, x.write = function(T) {
          for (var k = A, p = 0; p + 1 < k.length; ) {
            var _ = (255 & k[p]) << 8 | 255 & k[p + 1];
            if (33088 <= _ && _ <= 40956)
              _ -= 33088;
            else if (57408 <= _ && _ <= 60351)
              _ -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + _;
            _ = (_ >>> 8 & 255) * 192 + (_ & 255), T.put(_, 13), p += 2;
          }
          if (p < k.length)
            throw "illegal char at " + (p + 1);
        }, x;
      }, b = function() {
        var M = [], S = {};
        return S.writeByte = function(R) {
          M.push(R & 255);
        }, S.writeShort = function(R) {
          S.writeByte(R), S.writeByte(R >>> 8);
        }, S.writeBytes = function(R, A, x) {
          A = A || 0, x = x || R.length;
          for (var T = 0; T < x; T += 1)
            S.writeByte(R[T + A]);
        }, S.writeString = function(R) {
          for (var A = 0; A < R.length; A += 1)
            S.writeByte(R.charCodeAt(A));
        }, S.toByteArray = function() {
          return M;
        }, S.toString = function() {
          var R = "";
          R += "[";
          for (var A = 0; A < M.length; A += 1)
            A > 0 && (R += ","), R += M[A];
          return R += "]", R;
        }, S;
      }, L = function() {
        var M = 0, S = 0, R = 0, A = "", x = {}, T = function(p) {
          A += String.fromCharCode(k(p & 63));
        }, k = function(p) {
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
          for (M = M << 8 | p & 255, S += 8, R += 1; S >= 6; )
            T(M >>> S - 6), S -= 6;
        }, x.flush = function() {
          if (S > 0 && (T(M << 6 - S), M = 0, S = 0), R % 3 != 0)
            for (var p = 3 - R % 3, _ = 0; _ < p; _ += 1)
              A += "=";
        }, x.toString = function() {
          return A;
        }, x;
      }, z = function(M) {
        var S = M, R = 0, A = 0, x = 0, T = {};
        T.read = function() {
          for (; x < 8; ) {
            if (R >= S.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var p = S.charAt(R);
            if (R += 1, p == "=")
              return x = 0, -1;
            if (p.match(/^\s$/))
              continue;
            A = A << 6 | k(p.charCodeAt(0)), x += 6;
          }
          var _ = A >>> x - 8 & 255;
          return x -= 8, _;
        };
        var k = function(p) {
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
        var R = M, A = S, x = new Array(M * S), T = {};
        T.setPixel = function(E, $, V) {
          x[$ * R + E] = V;
        }, T.write = function(E) {
          E.writeString("GIF87a"), E.writeShort(R), E.writeShort(A), E.writeByte(128), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(0), E.writeByte(255), E.writeByte(255), E.writeByte(255), E.writeString(","), E.writeShort(0), E.writeShort(0), E.writeShort(R), E.writeShort(A), E.writeByte(0);
          var $ = 2, V = p($);
          E.writeByte($);
          for (var Z = 0; V.length - Z > 255; )
            E.writeByte(255), E.writeBytes(V, Z, 255), Z += 255;
          E.writeByte(V.length - Z), E.writeBytes(V, Z, V.length - Z), E.writeByte(0), E.writeString(";");
        };
        var k = function(E) {
          var $ = E, V = 0, Z = 0, Y = {};
          return Y.write = function(ie, ve) {
            if (ie >>> ve)
              throw "length over";
            for (; V + ve >= 8; )
              $.writeByte(255 & (ie << V | Z)), ve -= 8 - V, ie >>>= 8 - V, Z = 0, V = 0;
            Z = ie << V | Z, V = V + ve;
          }, Y.flush = function() {
            V > 0 && $.writeByte(Z);
          }, Y;
        }, p = function(E) {
          for (var $ = 1 << E, V = (1 << E) + 1, Z = E + 1, Y = _(), ie = 0; ie < $; ie += 1)
            Y.add(String.fromCharCode(ie));
          Y.add(String.fromCharCode($)), Y.add(String.fromCharCode(V));
          var ve = b(), Te = k(ve);
          Te.write($, Z);
          var Fe = 0, We = String.fromCharCode(x[Fe]);
          for (Fe += 1; Fe < x.length; ) {
            var _t = String.fromCharCode(x[Fe]);
            Fe += 1, Y.contains(We + _t) ? We = We + _t : (Te.write(Y.indexOf(We), Z), Y.size() < 4095 && (Y.size() == 1 << Z && (Z += 1), Y.add(We + _t)), We = _t);
          }
          return Te.write(Y.indexOf(We), Z), Te.write(V, Z), Te.flush(), ve.toByteArray();
        }, _ = function() {
          var E = {}, $ = 0, V = {};
          return V.add = function(Z) {
            if (V.contains(Z))
              throw "dup key:" + Z;
            E[Z] = $, $ += 1;
          }, V.size = function() {
            return $;
          }, V.indexOf = function(Z) {
            return E[Z];
          }, V.contains = function(Z) {
            return typeof E[Z] < "u";
          }, V;
        };
        return T;
      }, j = function(M, S, R) {
        for (var A = ee(M, S), x = 0; x < S; x += 1)
          for (var T = 0; T < M; T += 1)
            A.setPixel(T, x, R(T, x));
        var k = b();
        A.write(k);
        for (var p = L(), _ = k.toByteArray(), E = 0; E < _.length; E += 1)
          p.writeByte(_[E]);
        return p.flush(), "data:image/gif;base64," + p;
      };
      return a;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(a) {
        function s(o) {
          for (var r = [], l = 0; l < o.length; l++) {
            var i = o.charCodeAt(l);
            i < 128 ? r.push(i) : i < 2048 ? r.push(
              192 | i >> 6,
              128 | i & 63
            ) : i < 55296 || i >= 57344 ? r.push(
              224 | i >> 12,
              128 | i >> 6 & 63,
              128 | i & 63
            ) : (l++, i = 65536 + ((i & 1023) << 10 | o.charCodeAt(l) & 1023), r.push(
              240 | i >> 18,
              128 | i >> 12 & 63,
              128 | i >> 6 & 63,
              128 | i & 63
            ));
          }
          return r;
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
    const t = e, n = B(() => {
      const a = $2(0, "M");
      a.addData(t.text), a.make();
      const s = a.getModuleCount(), o = [];
      for (let r = 0; r < s; r += 1)
        for (let l = 0; l < s; l += 1)
          a.isDark(r, l) && o.push(`M${l + 4} ${r + 4}h1v1h-1z`);
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
}, a8 = /* @__PURE__ */ J(E2, [["__scopeId", "data-v-b4458227"]]), A2 = {
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
}, s8 = /* @__PURE__ */ J(A2, [["__scopeId", "data-v-79847aff"]]);
function o8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const r8 = ei(() => import("./VoiceFigure-DwK9WZiF.mjs").then((e) => e.V)), l8 = "1.2.0", i8 = "3.5";
export {
  ju as $,
  xe as A,
  _e as B,
  Yn as C,
  Ze as D,
  hx as E,
  Ly as F,
  a4 as G,
  cx as H,
  py as I,
  Wy as J,
  St as K,
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
  J as _,
  y5 as a,
  Z4 as a$,
  Vy as a0,
  D5 as a1,
  P5 as a2,
  Se as a3,
  Y5 as a4,
  K5 as a5,
  bt as a6,
  j5 as a7,
  l4 as a8,
  l5 as a9,
  H4 as aA,
  _4 as aB,
  sy as aC,
  d4 as aD,
  f4 as aE,
  mx as aF,
  kl as aG,
  B4 as aH,
  rn as aI,
  h5 as aJ,
  u5 as aK,
  ax as aL,
  ln as aM,
  lx as aN,
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
  wl as aY,
  It as aZ,
  Pt as a_,
  X4 as aa,
  ox as ab,
  g5 as ac,
  C5 as ad,
  O5 as ae,
  V5 as af,
  G5 as ag,
  J5 as ah,
  x5 as ai,
  Co as aj,
  q5 as ak,
  r4 as al,
  yx as am,
  w4 as an,
  v4 as ao,
  g4 as ap,
  Z5 as aq,
  U5 as ar,
  H5 as as,
  z5 as at,
  R4 as au,
  o4 as av,
  i4 as aw,
  kx as ax,
  zt as ay,
  c4 as az,
  ow as b,
  bx as b$,
  Ty as b0,
  rx as b1,
  D4 as b2,
  N4 as b3,
  yv as b4,
  rl as b5,
  K4 as b6,
  s4 as b7,
  Xn as b8,
  nt as b9,
  j4 as bA,
  z4 as bB,
  rt as bC,
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
  Z0 as bO,
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
  Br as bc,
  $x as bd,
  _x as be,
  T4 as bf,
  nx as bg,
  r5 as bh,
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
  $t as c$,
  d5 as c0,
  c5 as c1,
  m4 as c2,
  Ex as c3,
  Ss as c4,
  Ax as c5,
  Nl as c6,
  tx as c7,
  R5 as c8,
  T5 as c9,
  zx as cA,
  j2 as cB,
  l8 as cC,
  i8 as cD,
  G2 as cE,
  Gx as cF,
  Va as cG,
  e5 as cH,
  Eg as cI,
  wt as cJ,
  es as cK,
  Un as cL,
  W2 as cM,
  K2 as cN,
  ki as cO,
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
  fr as cq,
  t8 as cr,
  s5 as cs,
  zm as ct,
  Yt as cu,
  Tx as cv,
  O2 as cw,
  vt as cx,
  Xc as cy,
  me as cz,
  je as d,
  Ep as d$,
  ut as d0,
  wm as d1,
  Ii as d2,
  X2 as d3,
  N2 as d4,
  Nt as d5,
  Vx as d6,
  n8 as d7,
  jl as d8,
  eu as d9,
  B2 as dA,
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
  R2 as dO,
  nr as dP,
  ar as dQ,
  Oc as dR,
  P2 as dS,
  Ge as dT,
  o8 as dU,
  _w as dV,
  Z2 as dW,
  Ix as dX,
  Hx as dY,
  $w as dZ,
  Kx as d_,
  st as da,
  J2 as db,
  Qn as dc,
  r8 as dd,
  s8 as de,
  ms as df,
  Dx as dg,
  os as dh,
  I1 as di,
  so as dj,
  Wr as dk,
  Ac as dl,
  Xx as dm,
  Zx as dn,
  rs as dp,
  Ec as dq,
  Zo as dr,
  z2 as ds,
  Qx as dt,
  a5 as du,
  t5 as dv,
  Q2 as dw,
  Bx as dx,
  kf as dy,
  Rx as dz,
  B5 as e,
  Uo as e0,
  fb as e1,
  Lp as e2,
  jx as e3,
  za as e4,
  qx as e5,
  Fx as e6,
  ct as e7,
  Jx as e8,
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
  Il as r,
  Ll as s,
  Ae as t,
  bv as u,
  Y4 as v,
  wx as w,
  J4 as x,
  un as y,
  px as z
};
