/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as J, Fragment as G, renderList as te, normalizeStyle as fe, defineComponent as jr, Comment as qr, h as Wn, cloneVNode as Fr, createBlock as W, withCtx as D, unref as F, createVNode as N, toDisplayString as b, createCommentVNode as C, inject as $e, useAttrs as Hn, computed as R, ref as I, resolveDynamicComponent as wt, mergeProps as Ye, onUnmounted as Te, onMounted as Ce, Teleport as ns, useId as as, resolveDirective as Wr, withDirectives as Ze, createTextVNode as ne, reactive as ss, shallowRef as ze, watch as he, nextTick as rt, Transition as Lt, withModifiers as we, TransitionGroup as Do, shallowReactive as Hr, isRef as Cs, onBeforeUnmount as bt, resolveComponent as Ur, useModel as Ta, getCurrentInstance as zr, mergeModels as Ba, getCurrentScope as Po, onScopeDispose as jo, provide as Vr, onErrorCaptured as Gr, toHandlers as Kr, createSlots as Yr, vShow as qo, useSlots as Zr, withKeys as Kt, vModelText as Ra, defineAsyncComponent as Jr } from "vue";
const K = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Xr = { class: "skeleton-line" }, Qr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Xr, [
      ce(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(G, null, te(e.bars, (a) => (c(), h("span", {
          key: a.width,
          class: J(["bar", { still: e.still }]),
          style: fe({ width: a.width, height: `${a.height}px`, borderRadius: `${a.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ct = /* @__PURE__ */ K(Qr, [["__scopeId", "data-v-0ebb6933"]]), Nt = jr({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== qr);
      return a.length !== 1 ? Wn(G, { key: n }, a) : a[0].key == null ? Fr(a[0], { key: n }) : a[0];
    };
  }
}), ei = ["aria-label"], ti = ["aria-label"], ni = ["aria-label"], ai = ["aria-label"], si = ["aria-label"], oi = ["aria-label"], li = ["aria-label"], ri = {
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
          (c(), h(G, null, te(t, (d) => g("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, ei)
      ]),
      older: D(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, ti)
      ]),
      cards: D(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(G, null, te(n, (f) => N(ct, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ni)
      ]),
      file: D(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            N(ct, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(G, null, te(s, (f) => N(ct, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ai)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          N(ct, {
            class: "skeleton-heading",
            bars: r
          }),
          (c(!0), h(G, null, te(e.count, (d) => (c(), W(ct, {
            key: d,
            bars: F(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, si)
      ]),
      text: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), W(ct, {
            key: d,
            bars: F(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, oi)
      ]),
      default: D(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), W(ct, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, li)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, kt = /* @__PURE__ */ K(ri, [["__scopeId", "data-v-384b7120"]]), ii = {
  key: 1,
  class: "empty-state titled"
}, ci = { class: "empty-state-title" }, ui = { class: "empty-state-text" }, di = {
  key: 2,
  class: "empty-state"
}, fi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), W(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", ii, [
      g("p", ci, b(e.title), 1),
      g("p", ui, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", di, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Yt = /* @__PURE__ */ K(fi, [["__scopeId", "data-v-b27e89b0"]]), hi = { class: "fold-group" }, mi = ["aria-expanded"], pi = { class: "fold-label" }, gi = {
  key: 0,
  class: "fold-count"
}, vi = {
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
    return (a, s) => (c(), h("div", hi, [
      g("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", pi, b(e.label), 1),
        e.count !== "" ? (c(), h("span", gi, b(e.count), 1)) : C("", !0),
        g("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, mi),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, A2 = /* @__PURE__ */ K(vi, [["__scopeId", "data-v-9ef1865c"]]), yi = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function it() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const wi = ["stroke-width", "innerHTML"], me = {
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
    }, null, 12, wi));
  }
}, bi = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, ki = /* @__PURE__ */ K(bi, [["__scopeId", "data-v-eb453d6f"]]), xi = 120, $i = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
      const f = setTimeout(() => s.value = !0, xi);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), W(wt(e.href ? "a" : "button"), Ye(a.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.variant, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: r.value,
      onClick: i
    }), {
      default: D(() => [
        g("span", {
          class: J(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), W(me, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          ce(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), W(ki, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ K($i, [["__scopeId", "data-v-13c30dc0"]]), Mi = (e, t, n) => Math.max(t, Math.min(n, e)), Si = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Fo = /* @__PURE__ */ new WeakMap(), _i = (e, t) => Fo.set(e, t);
function Ei(e, t) {
  for (let n = t; n; n = Fo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Wo(e, t) {
  const n = (a) => {
    var o, l;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    s && !Ei(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const _t = 8, Ai = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
      const x = p.closest(".pane, .float-window");
      return x ? d(x.getBoundingClientRect()) : u();
    }, m = (p, x) => `${Math.max(0, p ? Math.min(p, x) : x)}px`;
    function v(p, x) {
      return {
        below: p.bottom - x.bottom - a.gap - _t,
        above: x.top - p.top - a.gap - _t,
        across: p.right - p.left - 2 * _t
      };
    }
    function y(p) {
      const x = f(a.anchor), _ = v(x, p);
      return r.value.w <= _.across && r.value.h <= Math.max(_.below, _.above) ? x : u();
    }
    const O = R(() => {
      if (!i.value) return l.value;
      const p = i.value, x = y(p), _ = v(x, p), { w: B, h: Z } = r.value, X = a.align === "auto" ? p.left + p.right > x.left + x.right : a.align === "right", Y = Mi(X ? p.right - B : p.left, x.left + _t, Math.max(x.left + _t, x.right - B - _t)), ve = Z > _.below && _.above > _.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, _.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, _.below) };
      return { ...l.value, ...ve, left: `${Y}px`, maxWidth: m(a.maxWidth, _.across) };
    }), k = n, L = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function z(p) {
      const x = L(), _ = x.indexOf(document.activeElement);
      x[(_ + p + x.length) % x.length].focus();
    }
    const ee = { ArrowDown: () => z(1), ArrowUp: () => z(-1), Escape: () => k("close") }, j = (p) => ee[p.key] && (p.preventDefault(), ee[p.key]()), M = () => s.value && (r.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let S = 0;
    const T = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(M);
    });
    Wo(s, (p) => a.anchor && !a.anchor.contains(p.target) && k("close"));
    const E = (p, x) => ["top", "left", "right", "bottom"].some((_) => Math.abs(p[_] - x[_]) > 1), $ = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let A = 0;
    function w() {
      if (a.anchor) {
        const p = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || $(p)) return k("close");
        E(p, i.value) && (i.value = p);
      }
      A = requestAnimationFrame(w);
    }
    return Ce(() => {
      a.anchor && s.value && _i(s.value, a.anchor), M(), s.value && T.observe(s.value), !a.plain && L()[0] && L()[0].focus(), w();
    }), Te(() => {
      T.disconnect(), cancelAnimationFrame(A), cancelAnimationFrame(S);
    }), t({ element: s }), (p, x) => (c(), W(ns, {
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
}), Un = /* @__PURE__ */ K(Ai, [["__scopeId", "data-v-3d203970"]]), Ci = { class: "split-button" }, Oi = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (l, r) => (c(), h("span", Ci, [
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
}, Ti = /* @__PURE__ */ K(Oi, [["__scopeId", "data-v-c258494d"]]), Bi = ["aria-checked", "aria-haspopup", "onClick"], Ri = {
  key: 0,
  class: "segmented-dot"
}, Ii = {
  key: 1,
  class: "segmented-note"
}, Li = {
  key: 2,
  class: "segmented-count"
}, Ni = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = as();
    return (s, o) => {
      const l = Wr("tip");
      return c(), h("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(G, null, te(e.options, (r) => Ze((c(), h("button", {
          key: r.key,
          type: "button",
          role: "radio",
          "aria-checked": r.key === e.value,
          "aria-haspopup": r.opens,
          class: J(["segmented-option", { on: r.key === e.value }]),
          onClick: (i) => n("pick", r.key)
        }, [
          r.dot ? (c(), h("span", Ri)) : C("", !0),
          ne(" " + b(r.label) + " ", 1),
          r.note ? (c(), h("small", Ii, b(r.note), 1)) : C("", !0),
          r.count !== void 0 ? (c(), h("em", Li, b(r.count), 1)) : C("", !0)
        ], 10, Bi)), [
          [l, r.tip || r.title, `${F(a)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, zn = /* @__PURE__ */ K(Ni, [["__scopeId", "data-v-c89bc92d"]]), Ho = typeof document < "u" && document.documentElement.classList.contains("phone");
function Di() {
  return () => {
  };
}
function Ia(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Uo(e = window) {
  if (!Ia(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ia(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const La = "journal.stale-build-reload", Pi = 'script[type="module"][src*="/assets/index-"]', Os = (e) => {
  var t;
  return ((t = e.querySelector(Pi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function ji(e = document, t = fetch, n = () => Uo(window)) {
  const a = Os(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Os(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let ta = "";
function qi(e, t = () => Uo(window)) {
  if (!e) return !1;
  const n = !!ta && ta !== e;
  return ta = e, n && t(), n;
}
const Fi = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Wi(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(La) === e.message) return !1;
    t.setItem(La, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Hi(e = window.sessionStorage) {
  try {
    e.removeItem(La);
  } catch {
    return;
  }
}
const Ui = 2e3, zi = 3e4, De = ss({ starting: !1, external: !1, late: !1, offline: !1 }), zo = () => De.starting, Vi = 3;
let fn = 0, Na = 0, Vo = 0, Go = [];
async function Gi() {
  try {
    const e = await Le.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: De.external };
  }
}
let Ts = null;
const Ki = () => Ts ?? (Ts = Gi().finally(() => Ts = null));
function Yi() {
  clearTimeout(Na), clearTimeout(Vo), Na = 0, Object.assign(De, { starting: !1, external: !1, late: !1, offline: !1 }), Go.splice(0).forEach((e) => e()), ji();
}
async function Zi() {
  De.offline = !navigator.onLine;
  const e = await Ki();
  if (De.external = e.updating, fn = !e.restarting && !e.updating && e.reachable ? fn + 1 : 0, fn < Vi) return;
  fn = 0, (!qi(e.started_at) || Ia()) && Yi();
}
function Ko() {
  Na = setTimeout(async () => {
    await Zi(), De.starting && Ko();
  }, Ui);
}
function Ji() {
  De.starting || (De.starting = !0, De.offline = !navigator.onLine, Ko(), Vo = setTimeout(() => De.late = !0, zi));
}
const Xi = () => De.starting ? new Promise((e) => Go.push(e)) : Promise.resolve();
function Qi(e, t) {
  let n = 0, a = null, s = !1, o = !1;
  const l = () => {
    s = !1, o && (o = !1, i());
  }, r = () => {
    a = null, n = Date.now();
    const u = e();
    u instanceof Promise && (s = !0, u.catch(() => {
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
function ec() {
  const e = { askers: 0, stop: new AbortController() };
  return e.answer = new Promise((t) => e.resolve = t), e;
}
class tc {
  constructor(t, n) {
    this.read = t, this.ended = n, this.flying = null, this.following = null, this.outdated = !1, this.ask = Qi(() => this.leave(), 0);
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
    const n = this.flying && !this.outdated, a = n ? this.flying : this.following ?? (this.following = ec());
    a.askers += 1;
    const s = this.answerFor(a, t);
    return n || this.ask(), s;
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
const hn = 2e4, nc = 4, Bs = "/api/read-lines", ac = 5e3, sc = 403, Rs = "/api/repeated-lines", oc = 10, lc = 2e3, Xe = "viewer.shell", rc = 3e5, C2 = 6e5, mn = 6, ic = 500, cc = "/journal/summary", Is = "/api/server-state", uc = 2e4, pn = Ho ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, dc = (e) => e.split("?")[0].endsWith(cc), Da = (e, t) => Object.assign(new Error(t), { status: e });
async function fc(e, t, n = Da) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const hc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), mc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), pc = (e) => e.split(" ").slice(0, 2).join(" "), tt = "read", At = "write", gc = "stream";
class vc {
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = pc(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), l = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < lc));
    if (l.set(a, o), this.recentLines.set(s, l), l.size < oc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const r = JSON.stringify({ window: t, line: n, count: l.size });
    this.out(Rs, { method: "POST", headers: { ...pn, "Content-Type": "application/json" }, body: r }, [{ window: Xe, line: Rs, kind: At }]).catch(() => {
    });
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), l = s ? { ...n, signal: mc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === At ? { ...l, priority: "high" } : l);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = hn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && Ji(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= nc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Bs, { headers: pn }, [{ window: Xe, line: Bs, kind: tt }], ac).then(async (t) => {
      if (t.status === sc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Da(t.status, "The read lines did not answer");
      return new Set((await t.json()).reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0) {
    const s = this.joinedReads.get(t) ?? new tc(n, () => this.joinedReads.delete(t));
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
    const r = a instanceof FormData, i = { method: t, headers: { ...pn, ...l, ...a === void 0 || r ? {} : { "Content-Type": "application/json" } }, body: hc(a) }, u = s || (r ? rc : hn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: Xe, line: n, kind: tt }], u)) : await this.sent(n, i, [{ window: Xe, line: n, kind: At }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, ic)), this.reach(t, n, a, s, o - 1, l);
    }
  }
  async send(t, n, a, s = 0, o = mn, l = {}) {
    this.watcher("sent", t, n, a);
    const r = t === "GET" ? () => {
    } : Di(), i = await this.reach(t, n, a, s, o, l).finally(() => {
      r(), this.watcher("answered", t, n, a);
    });
    return fc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.whenFree(() => this.out(t, { headers: pn }, [{ window: Xe, line: t, kind: tt }], hn));
    if (!n.ok) throw Da(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, l = n.split("?")[0]) {
    return t !== "GET" ? this.send(t, n, a, s, mn, o).then((r) => (this.written(n), r)) : zo() && !dc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(l, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: Xe, line: t, kind: gc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Is, { cache: "no-store" }, [{ window: Xe, line: Is, kind: tt }], uc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = Xe, line: s = t, limit: o = hn } = {}) {
    const l = (n.method ?? "GET") === "GET" ? tt : At;
    return l === At ? this.sent(t, n, [{ window: a, line: s, kind: l }], 0) : this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: l }], o));
  }
}
const na = Symbol.for("journal.transport"), Le = globalThis[na] ?? (globalThis[na] = new vc()), yc = 0, wc = "/api/lines", bc = "/api/line", Ls = 5e3, Ns = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), Ds = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), aa = (e) => JSON.stringify(e.line);
class kc {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const l = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(aa(t))) {
        Le.whenFree(() => this.readAlone(l));
        return;
      }
      this.waiting.push(l), this.timer ?? (this.timer = setTimeout(() => Le.whenFree(() => this.send()), yc));
    });
  }
  write(t, n) {
    return new Promise((a, s) => this.alone({ body: t, signal: n, resolve: a, reject: s }, At));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(new DOMException("cancelled", "AbortError"))), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    if (t.length)
      try {
        const n = await Le.sent(wc, Ns({ lines: t.map((s) => s.body) }), t.map((s) => Ds(s.body, tt)), Ls), { answers: a } = await n.json();
        t.forEach((s, o) => s.resolve(a[o]));
      } catch (n) {
        n.name === "TimeoutError" ? t.forEach((a) => Le.whenFree(() => this.readAlone(a))) : t.forEach((a) => a.reject(n));
      }
  }
  async readAlone(t) {
    const n = Date.now();
    await this.alone(t, tt), Date.now() - n < Ls ? this.slow.delete(aa(t.body)) : this.slow.add(aa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Le.sent(bc, Ns(t.body, t.signal), [Ds(t.body, n)], n === tt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const Yo = new kc(), xc = 150, $c = () => xc;
function os(e, t, n = $c(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Mc {
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
    Le.readsOutdated();
    for (const n of this.follows)
      n.patterns.some((a) => Zo(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Zo(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Jo = /* @__PURE__ */ new Map();
class Sc {
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
    const t = await Le.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function O2(e, t) {
  const n = new Sc(e, t);
  return Jo.set(e, n), n.load().catch(() => {
  }), n;
}
const ls = (e) => Jo.get(e);
function _c(e, t, n) {
  const a = ls(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ec(e, t) {
  if (!e) return !0;
  const n = ls(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Ac = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Xo = {};
async function T2(e = fetch) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Xo = (await t.json()).states);
}
const rs = (e, t) => {
  var n;
  return (n = Xo[e]) == null ? void 0 : n[t];
}, Qo = (e, t) => {
  var n;
  return ((n = rs(e, t)) == null ? void 0 : n.label) ?? Ac(t);
}, el = (e, t) => {
  var n;
  return ((n = rs(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Cc = (e, t) => {
  var n;
  return ((n = rs(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Oc = Symbol("pane-page"), Tc = Symbol("inspector-host"), Bc = { 1: "refused", 2: "usage", 3: "fault" }, Rc = 100, Ic = 50, Lc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Nc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Dc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: l, open: r, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: O = {}, search: k = {}, readOnly: L = !1, shared: z = null }) {
  const ee = /* @__PURE__ */ new Map(), j = new AbortController(), M = I(!1), S = performance.now();
  let T = 0, E = 0;
  const $ = () => {
    clearTimeout(E), E = setTimeout(() => {
      T === 0 && os(S, () => M.value = !0);
    }, Ic);
  }, A = (w, { unbatched: p = !1 } = {}) => {
    const x = ee.get(w);
    if (x && performance.now() - x.at < Rc) return x.answer;
    T += 1;
    const _ = gt(e, w, t, j.signal, p).finally(() => {
      T -= 1, $();
    });
    return ee.set(w, { answer: _, at: performance.now() }), _;
  };
  return {
    answered: M,
    settle: $,
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
    read: A,
    run: (w) => gt(e, w, t, j.signal),
    upload: (w) => jc(w, e, j.signal),
    cancel: () => j.abort(),
    subscriptions: l,
    follow: (w, p) => l.follow(e, w.filter((x) => o.some((_) => Zo(_, x))), (x) => {
      ee.clear(), p(x);
    }, a),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (w) => R(() => {
      var p;
      return i.value[w] ?? ((p = u.find((x) => x.key === w)) == null ? void 0 : p.default);
    }),
    setting: async (w, p) => {
      const x = await A(`window setting ${e} ${w}`);
      return x.ok ? x.value.value : p;
    },
    setOption: f,
    keep: (w, p) => gt(e, ["window", "save-setting", e, w, JSON.stringify(p)], t, j.signal)
  };
}
function Pc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Bt = { ok: !1, failure: "cancelled", error: "" }, tl = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function nl(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? Bt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Bc[n.code] || "fault", error: Pc(n.error) };
  } catch {
    return t != null && t.aborted ? Bt : { ok: !1, failure: "unreachable", error: tl };
  }
}
async function al(e, t, n) {
  const a = await nl(() => Yo.read(e, t, n), t);
  return a.failure !== "unreachable" || !zo() ? a : (await Xi(), t.aborted ? Bt : al(e, t, n));
}
async function gt(e, t, n, a = void 0, s = !1) {
  const o = { window: e, line: Array.isArray(t) ? t : sl(t), environment: n };
  return await Le.isRead(o.line) ? Le.joined(JSON.stringify(o), (l) => al(o, l, s), a).catch(() => Bt) : nl(() => Yo.write(o, a), a);
}
async function jc(e, t, n = void 0) {
  try {
    const a = await Le.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: n, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? Bt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? Bt : { ok: !1, failure: "unreachable", error: tl };
  }
}
function sl(e) {
  return [...e.matchAll(Lc)].map(([t]) => t.replace(Nc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const qc = (e) => `show-${e}`, B2 = (e, t, n) => e.filter((a) => {
  var s;
  return n(qc((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ol = "messages.chat", Fc = {
  key: 0,
  class: "template-brief"
}, Wc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Hc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), l = R(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), r = R(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await gt(ol, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(G, null, [
      N(zn, {
        options: l.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      r.value ? (c(), h("p", Fc, b(r.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", Wc, b(o.value), 1)) : C("", !0)
    ], 64));
  }
}, Uc = /* @__PURE__ */ K(Hc, [["__scopeId", "data-v-14be8a5c"]]), zc = { class: "form-field" }, Vc = { class: "form-field-head" }, Gc = ["for"], Kc = {
  key: 0,
  class: "form-field-aside"
}, Yc = {
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
    return (t, n) => (c(), h("div", zc, [
      g("div", Vc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, Gc),
        t.$slots.aside ? (c(), h("span", Kc, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Yc, b(e.help), 1)) : C("", !0)
    ]));
  }
}, Jc = /* @__PURE__ */ K(Zc, [["__scopeId", "data-v-dd7cdcff"]]), Pa = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Xc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
}), Qc = /* @__PURE__ */ K(Xc, [["__scopeId", "data-v-e130a5b9"]]), eu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = as(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (l, r) => (c(), W(Jc, {
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
            N(Uc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: r[1] || (r[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            N(Qc, {
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
function tu(e, t, n, a = () => window) {
  Ce(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const nu = (e, t = () => !0) => tu("keydown", (n) => n.key === "Escape" && t() && e());
function ll(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = R(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return nu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const au = 80, Et = ss([]);
function rl(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Et.includes(t) && Et.push(t), a || n();
    },
    { immediate: !0 }
  ), Te(n), R(() => au + Math.max(0, Et.indexOf(t)));
}
let il = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return il = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const su = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ou(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(su)];
    if (!l.length) return o.preventDefault();
    const [r, i] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Ce(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : il, document.addEventListener("keydown", s), rt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const lu = ["aria-modal", "aria-label", "aria-labelledby"], ru = {
  key: 0,
  class: "dialog-head"
}, iu = ["id", "tabindex"], cu = {
  key: 1,
  class: "dialog-foot"
}, uu = 500, du = 400, fu = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ll(a, n), r = rl(s), i = I(null), u = I(null), d = I(null), f = as(), m = I(!1), v = Date.now();
    n.modal && ou(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, du);
    }
    function O(z) {
      !n.modal || Date.now() - v >= uu || ![" ", "Enter"].includes(z.key) || (z.preventDefault(), z.stopPropagation());
    }
    const k = () => i.value && (i.value.scrollTop = i.value.scrollHeight), L = new MutationObserver(k);
    return he(i, (z) => {
      L.disconnect(), z && n.follow && (L.observe(z, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Te(() => L.disconnect()), (z, ee) => (c(), W(ns, { to: "body" }, [
      N(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: F(l)
      }, {
        default: D(() => [
          F(s) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: F(r) }),
            onClick: we(y, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? F(f) : void 0,
              onKeydownCapture: O
            }, [
              e.bare ? C("", !0) : (c(), h("header", ru, [
                g("h3", {
                  id: F(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, iu),
                e.closable ? (c(), W(is, {
                  key: 0,
                  onClick: F(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                ce(z.$slots, "default", {}, void 0, !0)
              ], 2),
              z.$slots.foot ? (c(), h("footer", cu, [
                ce(z.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, lu)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, cl = /* @__PURE__ */ K(fu, [["__scopeId", "data-v-6d1ecd98"]]), hu = (e, t, n = {}) => sl(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function an(e, t, n, a = {}) {
  try {
    return await Ec(e.module, n) ? gt(ol, hu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const mu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, sa = [
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
}, pu = ["secrets", "plugins"], ul = Object.keys(Vn).filter((e) => !(Ho && pu.includes(e)));
R(() => ul.map((e) => ({ name: e, ...Vn[e] })));
const Dt = (e) => Vn[e], dl = new Map(ul.flatMap((e) => [e, e.replace(/s$/, ""), Vn[e].title.toLowerCase()].map((t) => [t, e]))), Ge = (e) => dl.get(String(e).toLowerCase()) || "", fl = [...dl.keys()].sort((e, t) => t.length - e.length).join("|"), gu = {
  class: "button-form",
  "data-button-form": ""
}, vu = {
  key: 0,
  class: "button-form-title"
}, yu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, wu = { class: "button-form-actions" }, bu = {
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
    return (d, f) => (c(), W(cl, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: D(() => {
        var m;
        return [
          g("div", gu, [
            (m = e.row) != null && m.title ? (c(), h("p", vu, b(e.row.title), 1)) : C("", !0),
            (c(!0), h(G, null, te(e.button.fields, (v) => (c(), W(eu, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (y) => s.value[v.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            l.value ? (c(), h("p", yu, b(l.value), 1)) : C("", !0),
            g("div", wu, [
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
}, ku = /* @__PURE__ */ K(bu, [["__scopeId", "data-v-f26c27a7"]]), xu = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, $u = {
  key: 1,
  class: "menu-item-text"
}, Mu = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", xu, b(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", $u, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, b(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, vt = /* @__PURE__ */ K(Mu, [["__scopeId", "data-v-fec99974"]]), Su = ["aria-busy"], _u = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Eu = {
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
    }), i = R(() => n.readOnly ? [] : _c(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
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
      class: J(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && l.value ? (c(), h(G, { key: 0 }, [
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
      ], 64)) : o.value ? C("", !0) : (c(), h(G, { key: 1 }, [
        (c(!0), h(G, null, te(i.value, (k) => (c(), h(G, {
          key: k.name
        }, [
          k.menu.length ? (c(), W(Ti, {
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
              (c(!0), h(G, null, te(k.menu, (z) => (c(), W(vt, {
                key: z.label,
                description: z.description,
                onClick: (ee) => (L(), v({ ...k, ...z, menu: [] }))
              }, {
                default: D(() => [
                  ne(b(z.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              ne(b(k.label) + " ", 1)
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
              ne(b(k.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", _u, b(d.value), 1)) : C("", !0),
        u.value && !e.readOnly ? (c(), W(ku, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: O[0] || (O[0] = (k) => u.value = null),
          onDone: O[1] || (O[1] = (k) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, Su));
  }
}, Au = /* @__PURE__ */ K(Eu, [["__scopeId", "data-v-a07b49a4"]]), Cu = {
  class: "running",
  "data-running-command": ""
}, Ou = ["title"], Tu = {
  key: "idle",
  class: "running-idle"
}, Bu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Cu, [
      N(Lt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, Ou)) : (c(), h("span", Tu, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, R2 = /* @__PURE__ */ K(Bu, [["__scopeId", "data-v-d3240219"]]), Ru = ["aria-checked", "aria-label", "title"], Iu = {
  key: 0,
  class: "switch-inner"
}, Lu = {
  key: 0,
  class: "switch-word"
}, Nu = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("button", {
      type: "button",
      class: J(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: s[0] || (s[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: J(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Iu, b(e.word), 1)) : C("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Lu, b(e.word), 1)) : C("", !0)
    ], 10, Ru));
  }
}, I2 = /* @__PURE__ */ K(Nu, [["__scopeId", "data-v-1bfb90f3"]]);
function hl(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function On(e, t) {
  return hl(() => localStorage, e, t);
}
function ml(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function cs(e, t) {
  return ml(() => localStorage, e, t);
}
function pl(e, t) {
  he(t, (n) => cs(e, n), { deep: !0 });
}
function Du(e, t) {
  return hl(() => sessionStorage, e, t);
}
function Pu(e, t) {
  return ml(() => sessionStorage, e, t);
}
const Tn = "journal.environment", gl = I(Du(Tn, On(Tn, "")));
function ju(e) {
  gl.value = e, Pu(Tn, e), cs(Tn, e);
}
const Bn = I(location.hash), Ps = ze(null), js = { integrations: "mcp", library: "team" };
function qu() {
  if (!Ps.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (js[n]) {
    location.replace(`#/${[js[n], ...a].join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash;
    return;
  }
  !n || Ps.value(n) || (ju(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Bn.value = location.hash, qu();
});
const ja = R(() => {
  const [e, t = ""] = Bn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, i = ""] = l.split("@"), [u = "", d = "", f = ""] = r.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: gl.value,
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
function Fu(e = "", t = 0, n = "") {
  location.hash = us.page(e, t, n);
}
const Wu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function vl(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Wu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function L2(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function yl(e, t, n = 0, a = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((l = Ot[e]) != null && l.call(Ot, t))) return;
  const s = ja.value.stack, o = s.findIndex((r) => r.table === e && r.id === t);
  vl([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Hu(e, t, n, a = 0, s = "") {
  if (e === ja.value.env) return yl(t, n, a, s);
  const o = ja.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  vl([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Hu(a, s, Number(o), 0, t) : yl(s, Number(o), 0, t);
}
function Uu(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Uu(e);
  t && Pe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function N2(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const zu = { class: "inspector-part" }, Vu = { class: "inspector-part-title" }, Gu = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", zu, [
      g("h4", Vu, b(e.title), 1),
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, D2 = /* @__PURE__ */ K(Gu, [["__scopeId", "data-v-0da7fa52"]]), Ku = {
  key: 1,
  class: "row-list-failure"
}, Yu = ["data-row"], Zu = {
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
    return (o, l) => !e.loaded && !e.failure && !e.rows.length ? (c(), W(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Ku, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), W(Yt, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        ne(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), W(wt(e.arrival ? Do : "ul"), Ye(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), h(G, null, te(e.rows, (r) => (c(), h("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            ce(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, Yu))), 128))
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
}, Ju = /* @__PURE__ */ K(Zu, [["__scopeId", "data-v-6c7ba696"]]), Xu = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Qu = {
  key: 1,
  class: "agent-rows-note"
}, ed = {
  key: 2,
  class: "agent-rows-note"
}, td = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, nd = ["data-agent-row", "onClick"], ad = { class: "agent-row-name" }, sd = { class: "agent-row-state" }, od = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = R(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", Xu, [
      e.loaded ? e.failure ? (c(), h("p", Qu, b(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        g("p", td, b(a.value) + " running", 1),
        (c(!0), h(G, null, te(n.value, (l) => (c(), h("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => F(Pe)(`agents:${l.id}`)
        }, [
          g("span", ad, "#" + b(l.id) + " " + b(l.session), 1),
          g("span", sd, b(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, nd))), 128))
      ], 64)) : (c(), h("p", ed, b(e.none), 1)) : (c(), W(kt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, P2 = /* @__PURE__ */ K(od, [["__scopeId", "data-v-a01e5a17"]]), ld = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, b(e.text), 3));
  }
}, wl = /* @__PURE__ */ K(ld, [["__scopeId", "data-v-9e7e1157"]]), rd = ["aria-valuenow", "aria-valuemax"], id = {
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
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, rd));
  }
}, cd = /* @__PURE__ */ K(id, [["__scopeId", "data-v-9eba6a85"]]), ud = { class: "bars" }, dd = { class: "bar-name" }, fd = { class: "bar-value" }, hd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (c(), h("div", ud, [
      (c(!0), h(G, null, te(e.items, (i, u) => (c(), W(wt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: J(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          g("span", dd, b(i.label), 1),
          N(cd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", fd, b(i.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, md = /* @__PURE__ */ K(hd, [["__scopeId", "data-v-663427f4"]]), pd = { class: "bars" }, gd = {
  key: 0,
  class: "bars-title"
}, vd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", pd, [
      e.node.title ? (c(), h("span", gd, b(e.node.title), 1)) : C("", !0),
      N(md, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, yd = /* @__PURE__ */ K(vd, [["__scopeId", "data-v-7135bb11"]]), wd = {
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
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(G, null, te(e.node.children || [], (i, u) => (c(), W(Il, {
        key: u,
        node: i,
        onOpen: r[0] || (r[0] = (d) => s("open", d)),
        onFile: r[1] || (r[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Mn = /* @__PURE__ */ K(wd, [["__scopeId", "data-v-d142a3f4"]]), bd = {
  key: 0,
  class: "card-head"
}, kd = { class: "card-title" }, xd = {
  key: 0,
  class: "card-note"
}, $d = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", bd, [
        g("span", kd, b(e.node.title), 1),
        e.node.note ? (c(), h("span", xd, b(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      N(Mn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Md = /* @__PURE__ */ K($d, [["__scopeId", "data-v-67b72d40"]]), Sd = { processes: "process", memories: "memory", replies: "reply" }, Ht = (e) => (Sd[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), qa = [], _d = 2e3, et = /* @__PURE__ */ new Map(), Ed = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Ad = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function xt(e, { first: t = !1 } = {}) {
  t ? qa.unshift(e) : qa.push(e), et.clear();
}
function bl(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Cd = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Od = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Ke(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Td(e, t) {
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
  return Bd(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Bd(e) {
  return e.split(Ad).map((t, n) => n % 2 ? t : t.replace(Ed, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function qs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Rd = 24;
function Id(e) {
  const [t, , ...n] = e, a = qs(t), s = n.map(qs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Rd) ? ' class="text-column"' : "", l = a.map((i, u) => `<th${o(u)}>${Zt(i)}</th>`).join(""), r = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${Zt(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${l}</tr></thead><tbody>${r}</tbody></table>`;
}
const kl = /^\s*(?:[-*+]|\d+[.)])\s+/, Fa = /^\s*(\d+)[.)]\s/, Fs = (e) => e.match(/^\s*/)[0].length;
function xl(e) {
  const t = e[0].match(Fa), n = Fs(e[0]), a = [];
  for (const o of e) {
    const l = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), r = a[a.length - 1];
    l && Fs(o) <= n ? a.push({ text: l[2], nested: [] }) : r && o.trim() && (l || r.nested.length) ? r.nested.push(o) : r && o.trim() && (r.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Zt(o.text)}${o.nested.length ? xl(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Ld(e, t) {
  const n = Fa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (kl.test(e[s]) && Fa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Ws = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function $l(e) {
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
    if (Ws(t, a)) {
      let r = a + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Id(t.slice(a, r))), a = r;
      continue;
    }
    if (kl.test(s)) {
      const r = Ld(t, a);
      n.push(xl(t.slice(a, r))), a = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let r = a;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${$l(
          t.slice(a, r).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = r;
      continue;
    }
    let l = a;
    for (; l < t.length && t[l].trim() && !Ws(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${Zt(t.slice(a, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = l;
  }
  return n.join("");
}
const Nd = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Dd = (e) => e.type !== "text" && !Nd.test(e.html);
function Pd(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push($l(a).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Dd(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function jd(e, t = { env: "" }) {
  const n = Od(e, t), a = et.get(n);
  if (et.delete(n), a && a.source === t.source && a.reads.every((l) => Cd(l, t)))
    return et.set(n, a), a.html;
  const s = [], o = Pd(Td(e, { ...t, reads: s }));
  return et.set(n, { html: o, reads: s, source: t.source }), et.size > _d && et.delete(et.keys().next().value), o;
}
const oa = /* @__PURE__ */ new WeakMap();
function qd(e) {
  if (oa.has(e)) return oa.get(e);
  const t = Hr(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
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
function Ml() {
  const e = $e(Se, null), t = e ? qd(e) : null;
  return (n, a = {}) => jd(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Sl = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, sn = (e) => String(e || "").replace(Sl, (t, n, a, s) => s), Fd = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), gn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Wd = /^Traceback \(most recent call last\):/m, Hd = 8;
function _l(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Hd).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Ud(e) {
  const t = [...e.matchAll(Fd)].map((a) => a.index);
  if (gn.lastIndex = 0, !t.length || !gn.test(e)) return null;
  gn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), l = [...o.matchAll(gn)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: _l(n), tail: "" } : null;
}
function zd(e) {
  const t = Wd.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: _l([o]), tail: n.slice(s).join(`
`) };
}
xt((e) => {
  const t = sn(e), n = zd(t) || Ud(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Vd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Gd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Kd = /[\w\]]\(/, Yd = /^[\w$.[\]'"]+\s*=\s*[^=]/, Zd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Jd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Xd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Qd = /[[({,]$/, ef = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, tf = /^(\t|\s{2,})\S/, nf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, af = /`[^`]+`/, sf = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, of = /[{}()[\];=<>$&|*\\@+^~%]/g, El = /^\s*(?:[-*+]|\d+[.)])\s/, lf = /^\s*>/, rf = /^\s*\|/, cf = 0.6, uf = 0.4, df = 5, ff = 0.03, Al = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= df && t.every((n) => sf.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(of) ?? []).length / e.length < ff;
}, la = (e) => {
  const t = e.trim();
  return af.test(t) ? !1 : [Vd, Gd, Kd, Yd, Zd, Jd, Xd, Qd, ef].some((n) => n.test(t)) || /[;{}]$/.test(t) || tf.test(e) && !El.test(e) && !Al(e);
};
function hf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || El.test(t[0]) || t.every((o) => lf.test(o) || rf.test(o))) return "text";
  const n = t.filter((o) => !nf.test(o.trim()));
  if (t.length === 1) return !n.length || la(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(la).length, s = n.filter((o) => !la(o) && Al(o)).length;
  return a >= n.length * cf && s <= n.length * uf ? "code" : "text";
}
const Wa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", mf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", pf = `${Wa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, gf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", vf = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Hs = {
  js: { keywords: Wa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: mf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: pf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Wa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: gf, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: vf, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, yf = {
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
function Us(e, t, n) {
  return n && e.startsWith(n, t);
}
function wf(e, t) {
  const n = Hs[yf[t] ?? t] || Hs.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Us(e, o, n.line) || n.hash && r === "#") {
      const u = e.indexOf(`
`, o);
      l("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Us(e, o, n.block[0])) {
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
function bf(e, t) {
  const n = [""];
  for (const { type: a, value: s } of wf(e, t))
    s.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += a === "plain" ? Ke(l) : `<span class="tok-${a}">${Ke(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function kf(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const xf = 1500, zs = /* @__PURE__ */ new WeakMap();
async function $f(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await kf(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(zs.get(t)), zs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, xf)
  )));
}
typeof document < "u" && document.addEventListener("click", $f, !0);
const Mf = /\n\s*\n/, Sf = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, _f = /^\s*(`{3,}|~{3,})\s*$/, Ef = /^\s{4,}\S/, Af = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ha = /^\s*(?:[-*+]|\d+[.)])\s/, Cl = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Cf = [
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
function Of(e) {
  const t = ds(e.join(`
`));
  return (Cf.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Tf = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Cl.test(t) && !Ha.test(t);
}, Bf = (e, t) => Ha.test(t) || Ha.test([...e].reverse().find((n) => n.trim()) || "");
function fs(e, t) {
  const n = t || Of(e), a = bf(ds(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Rf(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && _f.test(s));
  return a < 0 ? e.length : a;
}
function If(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return fs(a.map(sn), n ? n.toLowerCase() : "");
}
function Lf(e) {
  const t = e.split(Mf).map((l) => ({ paragraph: l, type: hf(ds(l).split(`
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
function Nf(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Lf(s.join(`
`))), s = [];
  };
  let l = 0;
  for (; l < n.length; ) {
    const r = n[l].match(Sf);
    if (r) {
      const u = Rf(n, l, r[2]);
      o(), a.push(If(n.slice(l + 1, u), r[1], r[3])), l = u + 1;
      continue;
    }
    const i = Tf(s) ? Af : Ef;
    if (!t && i.test(n[l]) && !Bf(s, n[l])) {
      let u = l;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > l && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Cl.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
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
xt((e, t) => Nf(e, t.document));
const Rn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ol = (e) => `${e.table}:${e.id}`, Vs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ra = 80;
function Gs(e) {
  return e.length <= ra ? e : `${e.slice(0, ra + 1).replace(/\s+\S*$/, "") || e.slice(0, ra)}…`;
}
const Ks = {
  messages: (e) => Gs(Vs(e.text)),
  comments: (e) => Gs(Vs(e.text)),
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
}, Df = (e) => (Ks[e.table] ? Ks[e.table](e) : e.title || "") || "", yt = (e) => Rn(e.created_at), Tl = (e) => Rn(e.updated_at) || yt(e), Pf = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, jf = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function qf(e) {
  const t = Pf.exec(e);
  if (t && Ge(t[1])) return { at: t.index, length: t[0].length, table: Ge(t[1]), id: Number(t[2]), label: t[3] };
  const n = jf.exec(e), a = n && Ge(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Ff(e, t, n, a) {
  const s = bl(a, e, t), o = sn(s ? Df(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Ke(Dt(e).title)} ${t}</span><span class="row-card-title">${Ke(o)}</span></a>`;
}
xt(
  (e, t) => {
    const n = qf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Ff(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Wf = /\.(png|jpe?g|gif|webp|svg)$/i, Hf = (e) => Wf.test(e), Uf = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, zf = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Vf(e, t) {
  const n = Uf.exec(e), [, a, s, o, l, r] = n || [], i = n && Ge(a || o), u = i && bl(t, i, Number(s || l));
  if (i !== "messages" || !u || !(u.files || []).includes(r)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(r)}`, f = `${Dt(i).title} ${u.id} · ${Ke(r)}`, m = Hf(r) ? `<img class="file-card-image" src="${d}" alt="${Ke(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ke(r)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Gf(e) {
  const t = zf.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ke(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
xt(
  (e, t) => {
    if (t.inline) return null;
    const n = Vf(e, t) || Gf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Kf = /`([^`\n]+)`/g;
xt((e) => e.replace(Kf, (t, n) => `<code>${n}</code>`));
const Ys = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${us.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
xt(
  (e, t) => e.replace(Sl, (n, a, s, o) => Ys[a] ? Ys[a](s, o, t) : o)
);
const Yf = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Bl = new RegExp(`\\b(${fl}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Rl = new RegExp(`\\b(${fl}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Zf = new RegExp(`<code>((?:${Bl.source}|${Rl.source}))</code>`, "gi"), Jf = (e) => e.replace(Zf, "$1"), Xf = (e, t) => `<a class="row-pill" href="#" data-peek="${Ge(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Qf = (e) => e.replace(Rl, (t, n, a) => a.replace(/\d+/g, (s) => Xf(n.replace(/s$/i, ""), s))), eh = (e) => Qf(e).replace(
  Bl,
  (t, n, a, s = "", o) => {
    const l = a || o;
    return `<a class="row-pill" href="#" data-peek="${Ge(n)}:${l}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${l}${s ? `:${s}` : ""}</span></a>`;
  }
);
xt(
  (e, t) => t.rowNames === !1 ? e : Jf(e).split(Yf).map((n, a) => a % 2 ? n : eh(n)).join("")
);
const th = ["innerHTML"], nh = ["innerHTML"], ah = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Ml(), a = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((l) => l.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...l) => F(Ct) && F(Ct)(...l)),
      innerHTML: a.value
    }, null, 8, th)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...l) => F(Ct) && F(Ct)(...l)),
      innerHTML: a.value
    }, null, 8, nh));
  }
}, at = /* @__PURE__ */ K(ah, [["__scopeId", "data-v-d8e75741"]]), sh = { class: "fact" }, oh = { class: "fact-label" }, lh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", sh, [
      g("span", oh, b(e.label), 1),
      N(at, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, rh = /* @__PURE__ */ K(lh, [["__scopeId", "data-v-3a88ecf8"]]), ih = { class: "list" }, ch = { class: "list-label" }, uh = {
  key: 1,
  class: "list-note"
}, dh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", ih, [
      (c(!0), h(G, null, te(e.items, (o, l) => (c(), W(wt(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", ch, b(o.label), 1),
          o.badge ? (c(), W(wl, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", uh, b(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, fh = /* @__PURE__ */ K(dh, [["__scopeId", "data-v-ebe2ae0a"]]), hh = { class: "table" }, mh = {
  key: 0,
  class: "table-row empty"
}, ph = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (c(), h("div", hh, [
      g("div", {
        class: "table-row head",
        style: fe(s.value)
      }, [
        (c(!0), h(G, null, te(e.columns, (r) => (c(), h("span", {
          key: r,
          class: "cell"
        }, b(r), 1))), 128))
      ], 4),
      (c(!0), h(G, null, te(e.rows, (r, i) => (c(), W(wt(r.open ? "button" : "div"), {
        key: i,
        type: r.open ? "button" : void 0,
        class: J(["table-row", r.tone, { opens: r.open }]),
        style: fe(s.value),
        onClick: (u) => r.open && a("open", r.open)
      }, {
        default: D(() => [
          (c(!0), h(G, null, te(r.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", mh, b(e.empty), 1)) : C("", !0)
    ]));
  }
}, gh = /* @__PURE__ */ K(ph, [["__scopeId", "data-v-9326a52e"]]), vh = { class: "stat-value" }, yh = { class: "stat-label" }, wh = {
  key: 0,
  class: "stat-note"
}, bh = {
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
    return (a, s) => (c(), W(wt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        g("span", vh, b(e.value), 1),
        g("span", yh, b(e.label), 1),
        e.note ? (c(), h("span", wh, b(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, kh = /* @__PURE__ */ K(bh, [["__scopeId", "data-v-ad0db6d6"]]), xh = { class: "code" }, $h = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
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
        N(Md, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        g("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: D(() => [...l[2] || (l[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        N(kh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        N(yd, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        N(gh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        N(fh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        N(at, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        N(rh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        N(wl, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        g("pre", xh, [
          g("code", null, b(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: l[1] || (l[1] = (r) => s(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Il = /* @__PURE__ */ K($h, [["__scopeId", "data-v-cbdcf540"]]), Mh = { class: "dashboard" }, Sh = { class: "trail" }, _h = ["onClick"], Eh = {
  key: 0,
  class: "gone",
  role: "status"
}, Ah = {
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
    ), (m, v) => (c(), h("div", Mh, [
      e.document.broken ? (c(), W(Yt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          ne(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), W(Yt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          ne(b(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(G, { key: 2 }, [
        g("nav", Sh, [
          g("button", {
            type: "button",
            class: J(["step", { current: !l.value.length }]),
            onClick: v[0] || (v[0] = (y) => f(0))
          }, b(u(e.document.start)), 3),
          (c(!0), h(G, null, te(l.value, (y, O) => (c(), h(G, {
            key: `${O}-${y}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: J(["step", { current: O === l.value.length - 1 }]),
              onClick: (k) => f(O + 1)
            }, b(u(y)), 11, _h)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Eh, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        N(Lt, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (c(), h("div", {
              key: r.value,
              class: "page"
            }, [
              N(Il, {
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
}, Ch = /* @__PURE__ */ K(Ah, [["__scopeId", "data-v-fbe83734"]]), Qe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ne = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ie = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Oh = 6;
function hs(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Th = (e) => {
  const t = hs(e, Qe.lineChars), n = Math.max(Qe.minWidth, Math.max(...t.map((a) => a.length)) * Qe.charWidth + Qe.padX * 2);
  return { name: e, lines: t, line: Qe.line, padY: Qe.padY, width: n, height: t.length * Qe.line + Qe.padY * 2 };
};
function Bh(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (l) => {
    s.set(l, "open"), t.forEach((r, i) => {
      if (r[0] !== l) return;
      const u = s.get(r[1]);
      u === "open" ? a.add(i) : u || o(r[1]);
    }), s.set(l, "done");
  };
  return [...n, ...e].forEach((l) => s.has(l) || o(l)), a;
}
function Rh(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Ih(e, t, n) {
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
  for (let l = 0; l < Oh; l++) {
    const r = l % 2 === 0, i = a.map((u, d) => d);
    (r ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[r ? 1 : 0] === f).map((m) => m[r ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Lh(e, t) {
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
function Nh(e) {
  const t = [...new Set(e.flatMap(([j, M]) => [j, M]))], n = new Set(e.map(([, j]) => j)), a = t.filter((j) => !n.has(j)), s = Bh(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((j, M) => !s.has(M)), l = Rh(t, o), r = Ih(t, o, l), i = new Map(t.map((j) => [j, Th(j)])), u = r.map((j) => j.reduce((M, S) => M + i.get(S).width, 0) + Ie.across * (j.length - 1)), d = Math.max(...u) + Ie.margin * 2, f = Ph(e, l, r.length), m = /* @__PURE__ */ new Map();
  let v = Ie.margin;
  r.forEach((j, M) => {
    let S = (d - u[M]) / 2;
    const T = Math.max(...j.map((E) => i.get(E).height));
    j.forEach((E) => {
      const $ = i.get(E);
      m.set(E, { ...$, x: S, y: v + (T - $.height) / 2 }), S += $.width + Ie.across;
    }), v += T + (f[M] ?? Ie.down);
  });
  const y = e.map(([j, M, S], T) => ({ from: j, to: M, label: S || "", back: s.has(T) || l.get(M) <= l.get(j) }));
  Lh(y, m);
  const O = y.map((j) => jh(j, m.get(j.from), m.get(j.to))), k = [...m.values()], L = Hh(O, k), z = Math.max(v - Ie.down, ...L.filter((j) => j.label).map((j) => j.label.y + j.label.height));
  return { width: Math.max(d - Ie.margin, ...L.filter((j) => j.label).map((j) => j.label.x + j.label.width)) + Ie.margin, height: z + Ie.margin, nodes: k, arrows: L };
}
const Dh = (e) => e ? hs(e, Ne.lineChars).length * Ne.line + Ne.pad * 2 : 0;
function Ph(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Ie.labelSpace);
  return e.forEach(([s, o, l]) => {
    const [r, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > r && (a[r + Math.floor((i - r - 1) / 2)] += Dh(l) + Ie.labelSpace);
  }), a.map((s) => Math.max(Ie.down, s));
}
function jh(e, t, n) {
  const a = e.label ? hs(e.label, Ne.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Ne.charWidth + Ne.pad * 2 : 0, o = a.length * Ne.line + (a.length ? Ne.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - r) / 2, f = [{ x: l, y: r }, { x: l, y: r + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${l} ${r} C${l} ${r + d} ${i} ${u - d} ${i} ${u}` };
}
const qh = ([e, t, n, a], s) => {
  const o = 1 - s, l = (r) => o * o * o * e[r] + 3 * o * o * s * t[r] + 3 * o * s * s * n[r] + s * s * s * a[r];
  return { x: l("x"), y: l("y") };
}, Fh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Wh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ne.line);
function Hh(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: l }) => ({ x: a, y: s, width: o, height: l }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = qh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, r = Wh.flatMap((i) => Fh.map((u) => s(u, i))).find((i) => !n.some((u) => Zs(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => Zs(r, i)); ) r.y += Ne.line;
    return n.push(r), { ...a, label: { ...r, lines: a.lines, line: Ne.line, pad: Ne.pad } };
  });
}
const Zs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Uh = { class: "flowchart-tools" }, zh = ["width", "height", "viewBox", "aria-label"], Vh = ["d"], Gh = ["x", "y", "width", "height"], Kh = ["x", "y"], Yh = ["x", "dy"], Zh = {
  key: 0,
  class: "flowchart-label"
}, Jh = ["x", "y", "width", "height"], Xh = ["x", "y"], Qh = ["x", "dy"], e1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Nh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = I(null), r = I({ zoom: 1, x: 0, y: 0 });
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
    return Ce(u), (O, k) => (c(), W(cl, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (L) => a("close"))
    }, {
      default: D(() => [
        g("div", Uh, [
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
            (c(!0), h(G, null, te(s.value.arrows, (L, z) => (c(), h("path", {
              key: `arrow-${z}`,
              class: "flowchart-arrow",
              d: L.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Vh))), 128)),
            (c(!0), h(G, null, te(s.value.nodes, (L) => (c(), h("g", {
              key: L.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: L.x,
                y: L.y,
                width: L.width,
                height: L.height,
                rx: "8"
              }, null, 8, Gh),
              g("text", {
                x: L.x + L.width / 2,
                y: L.y + L.padY + L.line / 2
              }, [
                (c(!0), h(G, null, te(L.lines, (z, ee) => (c(), h("tspan", {
                  key: ee,
                  x: L.x + L.width / 2,
                  dy: ee ? L.line : 0
                }, b(z), 9, Yh))), 128))
              ], 8, Kh)
            ]))), 128)),
            (c(!0), h(G, null, te(s.value.arrows, (L, z) => (c(), h(G, {
              key: `label-${z}`
            }, [
              L.label ? (c(), h("g", Zh, [
                g("rect", {
                  x: L.label.x,
                  y: L.label.y,
                  width: L.label.width,
                  height: L.label.height,
                  rx: "4"
                }, null, 8, Jh),
                g("text", {
                  x: L.label.x + L.label.width / 2,
                  y: L.label.y + L.label.pad + L.label.line / 2
                }, [
                  (c(!0), h(G, null, te(L.label.lines, (ee, j) => (c(), h("tspan", {
                    key: j,
                    x: L.label.x + L.label.width / 2,
                    dy: j ? L.label.line : 0
                  }, b(ee), 9, Qh))), 128))
                ], 8, Xh)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, zh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, t1 = /* @__PURE__ */ K(e1, [["__scopeId", "data-v-51d24cfe"]]), Js = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Xs = {
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
  agent: Js,
  worker: Js,
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
}, n1 = ["innerHTML"], a1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Xs[t.name] || Xs.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, n1));
  }
}, lt = /* @__PURE__ */ K(a1, [["__scopeId", "data-v-beb5935c"]]), s1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      N(lt, { name: "fold" })
    ], 2));
  }
}, Rt = /* @__PURE__ */ K(s1, [["__scopeId", "data-v-d03899bb"]]), o1 = ["data-tip", "aria-label"], l1 = {
  key: 0,
  class: "mact-word"
}, r1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      N(lt, { name: "open" }),
      e.open ? (c(), h("span", l1, b(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, o1));
  }
}, Ll = /* @__PURE__ */ K(r1, [["__scopeId", "data-v-3b292e09"]]), Nl = 120, Sn = 280, Dl = 160, i1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, c1 = ["leaving", "resizing", "entering"];
function Ua(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function u1(e) {
  const t = c1.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ua(e);
  return e.classList.add(...t), n;
}
function Pl(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const l = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), r = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    r(f);
    const v = u1(f);
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
    if (!m || !m.offsetWidth || i1()) {
      a.value = f;
      return;
    }
    const y = Ua(m);
    if (l(m, y), s.value = "leaving", await n(Nl), v !== o) return;
    a.value = f, s.value = "resizing", await rt(), i(m, y);
    const O = u(m);
    await n(Sn), O == null || O.disconnect(), v === o && (r(m), s.value = "entering", await n(Dl), v === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), bt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const d1 = { class: "growing-card-top" }, f1 = ["aria-expanded"], h1 = { class: "growing-card-avatar" }, m1 = { class: "growing-card-title" }, p1 = { class: "growing-card-more" }, g1 = { class: "growing-card-body" }, v1 = {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: l, phase: r } = Pl(o, () => !s.value), i = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", F(r), { open: !F(l), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", d1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", h1, [
            e.bad ? (c(), W(lt, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(G, { key: 1 }, [
              ne(b(i.value), 1)
            ], 64)) : (c(), W(me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", m1, b(e.title), 1),
          N(Rt, { open: s.value }, null, 8, ["open"])
        ], 8, f1),
        e.action ? (c(), W(Ll, {
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
      g("div", p1, [
        g("div", g1, [
          (c(!0), h(G, null, te(u.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, b(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, y1 = /* @__PURE__ */ K(v1, [["__scopeId", "data-v-f2b4930d"]]), w1 = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, b1 = {
  key: 0,
  class: "message-links-many"
}, k1 = ["aria-expanded"], x1 = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, $1 = ["onClick"], M1 = { class: "row-pill message-links-chip" }, S1 = { class: "message-links-title" }, ia = 3, Qs = "task", _1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = R(() => t.links.length), s = R(() => t.links.every((m) => m.model === Qs) ? "tasks" : "items"), o = R(() => `Linked: ${t.links.map((m) => `${m.model} ${m.id}`).join(" ")}`), l = I(!1), r = I({}), i = I(null);
    Wo(i, () => l.value = !1);
    async function u() {
      const m = t.links.filter((y) => y.model === Qs && !(y.id in r.value)), v = await Promise.all(m.map((y) => n.read(`task show ${y.id}`)));
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
      class: J(["message-links", { many: a.value > ia, three: a.value === ia, open: l.value }]),
      "data-message-links": ""
    }, [
      N(lt, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", w1, [
        N(at, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      a.value >= ia ? (c(), h("span", b1, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": l.value,
          onClick: d
        }, [
          ne(b(a.value) + " linked " + b(s.value) + " ", 1),
          N(Rt, { open: l.value }, null, 8, ["open"])
        ], 8, k1)
      ])) : C("", !0),
      l.value ? (c(), h("div", x1, [
        (c(!0), h(G, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.model}:${y.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (O) => f(y)
        }, [
          g("span", M1, b(y.model) + " " + b(y.id), 1),
          g("span", S1, b(r.value[y.id]), 1)
        ], 8, $1))), 128))
      ])) : C("", !0)
    ], 2));
  }
}, E1 = /* @__PURE__ */ K(_1, [["__scopeId", "data-v-24868afd"]]), A1 = ["title", "aria-label"], C1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, O1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, T1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: J(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", C1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", O1)) : C("", !0)
      ]))
    ], 10, A1));
  }
}, B1 = /* @__PURE__ */ K(T1, [["__scopeId", "data-v-6dc92808"]]);
function R1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function jl(e, t = Date.now()) {
  const n = R1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const I1 = 36e5;
function j2(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / I1;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function ql(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function eo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ca = (e) => String(e).padStart(2, "0");
function L1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ca(t % 60)}s` : `${Math.floor(t / 3600)}h ${ca(Math.floor(t % 3600 / 60))}m ${ca(t % 60)}s`;
}
const N1 = "img,pre,table";
function D1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function P1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function j1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(N1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = D1(P1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function q1(e, t) {
  let n = null;
  const a = () => e.value && j1(e.value);
  Ce(() => {
    var o, l;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((l = e.value) != null && l.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== s && (s = r.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const F1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function W1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const H1 = ["data-incoming", "data-ref"], U1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], z1 = { class: "message-body" }, V1 = ["title"], G1 = ["innerHTML"], K1 = ["title"], Y1 = ["innerHTML"], Z1 = {
  class: "message-faces",
  "data-message-faces": ""
}, J1 = ["title", "data-face", "onClick"], X1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Q1 = ["title", "data-reaction", "onClick"], em = {
  key: 0,
  class: "message-reaction-count"
}, tm = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, nm = ["href", "title"], am = ["src", "alt"], sm = ["href"], om = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, lm = ["data-sent-worker", "title", "onClick"], rm = { class: "message-foot" }, im = { class: "message-time" }, cm = {
  class: "message-id",
  "data-message-id": ""
}, um = 140, dm = 2, fm = 1500, hm = "An earlier message", mm = "about", pm = "sent_to", gm = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var B;
    const n = e, a = t, s = I(!1), o = I(null), l = R(() => ["user", "comment"].includes(n.message.type)), r = R(() => {
      const [Z, X] = (n.message.commented_row || ":").split(":"), Y = Ge(Z);
      return Y ? { ref: `${Y}:${X}`, label: `${Dt(Y).title.toLowerCase()} ${X}` } : null;
    }), i = R(() => n.message.worker_id ?? null), u = I(!1), d = R(() => i.value !== null && ((n.message.text ?? "").length > um || (n.message.text ?? "").split(`
`).filter((Z) => Z.trim()).length > dm)), f = R(() => l.value && !n.message.read_at && !n.message.local);
    async function m() {
      var Z;
      await ((Z = navigator.clipboard) == null ? void 0 : Z.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, fm);
    }
    const v = Ml(), y = R(() => v(n.message.text ?? "")), O = R(() => JSON.parse(n.message.flowchart_edges || "[]")), k = I(!1), L = R(() => v(n.quote || hm));
    function z() {
      const Z = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Z ? Z.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    q1(o, () => `${n.message.text} ${n.quote}`);
    const ee = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, j = (Z) => `/api/files/message/${n.message.id}/${encodeURIComponent(Z)}`, M = R(() => JSON.parse(n.message.captions || "{}")), S = R(() => (n.message.files ?? []).map((Z) => ({ name: Z, address: j(Z), isImage: ee.test(Z), title: M.value[Z] || Z }))), T = R(() => ql(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), E = $e(Se, null), $ = I([]), A = I([]);
    async function w() {
      if (!l.value || !(E != null && E.read) || n.message.local) return;
      const Z = await E.read(`link list --source message:${n.message.id}`);
      if (!Z.ok) return;
      const X = Z.value.rows ?? Z.value ?? [];
      $.value = X.filter((Y) => Y.link_type === mm).map((Y) => ({ model: Y.target_model, id: Y.target_id })), A.value = X.filter((Y) => Y.link_type === pm).map((Y) => Y.target_id);
    }
    w(), (B = E == null ? void 0 : E.follow) == null || B.call(E, ["link.*"], w);
    const p = I(!1), x = R(() => W1(n.message.reactions));
    function _(Z) {
      p.value = !1, a("react", n.message, Z);
    }
    return (Z, X) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      N(y1, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: X[0] || (X[0] = (Y) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, H1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": l.value ? null : "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", z1, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: r.value }]),
          onClick: X[6] || (X[6] = (...Y) => F(Ct) && F(Ct)(...Y))
        }, [
          r.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${r.value.label}`,
            onClick: X[1] || (X[1] = we((Y) => F(Pe)(r.value.ref), ["stop"]))
          }, [
            N(me, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + b(r.value.label), 1)
          ], 8, V1)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: we(z, ["stop"]),
            innerHTML: L.value
          }, null, 8, G1)) : C("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: X[2] || (X[2] = we((Y) => F(Pe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + b(i.value), 9, K1)) : C("", !0),
          g("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Y1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: X[3] || (X[3] = we((Y) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : C("", !0),
          O.value.length ? (c(), h(G, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: X[4] || (X[4] = (Y) => k.value = !0)
            }, "Open the flowchart"),
            k.value ? (c(), W(t1, {
              key: 0,
              title: e.message.text,
              edges: O.value,
              onClose: X[5] || (X[5] = (Y) => k.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        g("div", {
          class: J(["message-tools", { picking: p.value }]),
          "data-message-tools": ""
        }, [
          p.value ? (c(), h(G, { key: 0 }, [
            g("div", Z1, [
              (c(!0), h(G, null, te(F(F1), (Y) => (c(), h("button", {
                key: Y,
                type: "button",
                class: "message-face",
                title: `React ${Y}`,
                "data-face": Y,
                onClick: (ie) => _(Y)
              }, b(Y), 9, J1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: X[7] || (X[7] = (Y) => p.value = !1)
            }, [
              N(me, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(G, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: X[8] || (X[8] = (Y) => p.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: X[9] || (X[9] = (Y) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, b(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: X[10] || (X[10] = (Y) => a("delete", e.message))
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      x.value.length ? (c(), h("div", X1, [
        (c(!0), h(G, null, te(x.value, (Y) => (c(), h("button", {
          key: Y.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Y.mine }]),
          title: Y.title,
          "data-reaction": Y.emoji,
          onClick: (ie) => a("react", e.message, Y.emoji)
        }, [
          ne(b(Y.emoji) + " ", 1),
          Y.count > 1 ? (c(), h("span", em, b(Y.count), 1)) : C("", !0)
        ], 10, Q1))), 128))
      ])) : C("", !0),
      S.value.length ? (c(), h("div", tm, [
        (c(!0), h(G, null, te(S.value, (Y) => (c(), h(G, {
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
            }, null, 8, am)
          ], 8, nm)) : (c(), h("a", {
            key: 1,
            href: Y.address,
            target: "_blank",
            class: "message-file"
          }, b(Y.name), 9, sm))
        ], 64))), 128))
      ])) : C("", !0),
      A.value.length ? (c(), h("div", om, [
        N(me, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, te(A.value, (Y) => (c(), h("button", {
          key: Y,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Y,
          title: `Open worker ${Y}`,
          onClick: we((ie) => F(Pe)(`agents:${Y}`), ["stop"])
        }, "Also sent to worker " + b(Y), 9, lm))), 128))
      ])) : C("", !0),
      g("div", rm, [
        g("time", im, b(T.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(G, { key: 0 }, [
          X[11] || (X[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", cm, "message " + b(e.message.id), 1)
        ], 64)) : C("", !0),
        l.value ? (c(), W(B1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      $.value.length ? (c(), W(E1, {
        key: 3,
        links: $.value
      }, null, 8, ["links"])) : C("", !0)
    ], 8, U1));
  }
}, q2 = /* @__PURE__ */ K(gm, [["__scopeId", "data-v-2b3e68eb"]]), vm = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, l) => {
      const r = Ur("SkeletonParts", !0);
      return c(!0), h(G, null, te(e.parts, (i, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, te(i.count, (d) => (c(), W(Nt, {
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
}), ym = /* @__PURE__ */ K(vm, [["__scopeId", "data-v-576c95e1"]]), wm = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, bm = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", wm, [
      N(ym, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ms = /* @__PURE__ */ K(bm, [["__scopeId", "data-v-52f66b64"]]), In = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ua = 200, Fl = (e) => {
  var t;
  return ((t = In.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? In[0].key;
}, F2 = (e) => {
  var t;
  return ((t = In.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, km = ["aria-label"], xm = 300, to = 400, $m = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ua } },
  setup(e) {
    const t = e, n = R(() => Fl(t.value)), a = R(() => n.value < ua ? [1, 0.25, 0.25] : n.value === ua ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= to, high: n.value >= xm && n.value < to }]),
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
    ], 10, km));
  }
}, W2 = /* @__PURE__ */ K($m, [["__scopeId", "data-v-b10e610f"]]), no = (e) => [...new Set(e.agents.map((t) => t.name))], H2 = (e) => no(e).length === 1 ? `Worker: ${no(e)[0]}` : "Delegated", Mm = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, ao = (e) => Mm[e.card.state] || "idle", Sm = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), so = { working: 0, waiting: 1, idle: 2, stopped: 3 }, oo = (e, t) => so[ao(e)] - so[ao(t)], lo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, U2 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => oo(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || Sm(a, s)) : [...e].sort((a, s) => oo(a, s) || (lo[t] || lo.state)(a, s)), _m = { class: "list-row" }, Em = {
  key: 0,
  class: "list-row-type"
}, Am = { class: "list-row-main" }, Cm = {
  key: 0,
  class: "list-row-title"
}, Om = { class: "list-row-body" }, Tm = {
  key: 1,
  class: "list-row-end"
}, Bm = {
  key: 1,
  class: "list-row-text"
}, Rm = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", _m, [
      e.type ? (c(), h("span", Em, b(e.type), 1)) : C("", !0),
      g("div", Am, [
        e.title ? (c(), h("span", Cm, b(e.title), 1)) : C("", !0),
        g("div", Om, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Tm, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", Bm, b(e.text), 1)) : C("", !0)
    ]));
  }
}, z2 = /* @__PURE__ */ K(Rm, [["__scopeId", "data-v-dfc8c3a7"]]), Im = {
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
}, Lm = { claude: "Claude Code", codex: "Codex" }, Nm = ["aria-expanded"], Dm = { class: "drop-label" }, Pm = ["value"], jm = {
  key: 1,
  class: "drop-lead"
}, qm = { class: "drop-item-text" }, Fm = {
  key: 2,
  class: "drop-note"
}, Wm = {
  key: 1,
  class: "drop-none"
}, Hm = {
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
      class: J(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), W(me, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        g("span", Dm, b(e.label), 1),
        N(me, {
          name: "down",
          size: 11
        })
      ], 10, Nm),
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
          }, null, 40, Pm)) : C("", !0),
          (c(!0), h(G, null, te(r.value, (f) => (c(), W(vt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => i(f)
          }, {
            default: D(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: J(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (c(), h("span", jm, b(f.lead), 1)) : C("", !0),
              g("span", qm, b(f.label), 1),
              f.note ? (c(), h("span", Fm, b(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? C("", !0) : (c(), h("p", Wm, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, Um = /* @__PURE__ */ K(Hm, [["__scopeId", "data-v-29dfcce5"]]), V2 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => [
      ...Im[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (s.value.find((l) => l.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (l, r) => (c(), W(Um, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${F(Lm)[e.provider]} model`,
      onPick: r[0] || (r[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, zm = ["aria-label"], Vm = { class: "head" }, Gm = { class: "names" }, Km = { class: "body" }, Ym = {
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
    const n = e, a = t, { visible: s, close: o, closed: l } = ll(a, n), r = rl(s);
    return (i, u) => (c(), W(ns, { to: "body" }, [
      N(Lt, {
        name: "side",
        appear: "",
        onAfterLeave: F(l)
      }, {
        default: D(() => [
          F(s) ? (c(), h("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: F(r) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = we((...d) => F(o) && F(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(G, { key: 0 }, [
                g("header", Vm, [
                  g("div", Gm, [
                    g("h2", null, b(e.title), 1),
                    e.abstract ? (c(), W(at, {
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
                g("div", Km, [
                  ce(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", Ym, [
                  ce(i.$slots, "foot", {}, void 0, !0)
                ])) : C("", !0)
              ], 64)) : ce(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, zm)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, G2 = /* @__PURE__ */ K(Zm, [["__scopeId", "data-v-c9a3f43a"]]), Jm = {
  key: 1,
  class: "text-field-label"
}, Xm = {
  key: 2,
  class: "text-field-end"
}, Qm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ba({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ta(e, "modelValue"), a = Hn(), s = "onUpdate:modelValue" in (((d = zr()) == null ? void 0 : d.vnode.props) || {}), o = R(() => s ? n.value : a.value), l = (f) => s && (n.value = f.target.value), r = R(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = R(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, F(a).class]),
      style: fe(F(a).style)
    }, [
      e.icon ? (c(), W(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", Jm, b(e.label), 1)) : C("", !0),
      Ze(g("input", Ye({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [F(Pa), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Xm, [
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
}), K2 = /* @__PURE__ */ K(Qm, [["__scopeId", "data-v-d9c38ca8"]]);
async function ep(e, t, n) {
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
const ro = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function Y2(e) {
  const t = it().sources.find((n) => n.key === e);
  return t ? za(t.read, t.events) : za("", []);
}
function za(e, t, { incremental: n = !1 } = {}) {
  var M;
  const a = Number(((M = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : M[1]) ?? 50), s = it(), o = I([]), l = I(null), r = I(""), i = I(!1), u = performance.now(), d = I(!1), f = I(""), m = I(null);
  async function v(S) {
    const T = k, E = await s.read(`${e} --before-id ${S + 1} --limit 1`);
    if (T !== k) return;
    if (!E.ok) return z();
    const $ = E.value.rows.find((A) => A.id === S);
    o.value = $ ? o.value.map((A) => A.id === S ? $ : A) : o.value.filter((A) => A.id !== S);
  }
  async function y(S) {
    if (n && String((S == null ? void 0 : S.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((p) => p.id !== S.row_id));
    if (n && (S != null && S.row_id) && !String(S.event ?? "").endsWith(".create") && o.value.some((p) => p.id === S.row_id)) return v(S.row_id);
    if (!(n && o.value.length && String((S == null ? void 0 : S.event) ?? "").endsWith(".create"))) return z();
    const E = Math.max(...o.value.map((p) => p.id)), $ = k, A = await s.read(`${e} --after-id ${E}`);
    if ($ !== k) return;
    if (!A.ok) return z();
    const w = new Set(o.value.map((p) => p.id));
    o.value = [...A.value.rows.filter((p) => !w.has(p.id)), ...o.value];
  }
  async function O() {
    if (!d.value || !o.value.length) return !1;
    const S = k, T = Math.min(...o.value.map((A) => A.id)), E = await s.read(`${e} --before-id ${T}`);
    if (S !== k) return !1;
    if (!E.ok || !E.value.rows.length) return d.value = !1;
    d.value = ro(E.value, a);
    const $ = new Set(o.value.map((A) => A.id));
    return o.value = [...o.value, ...E.value.rows.filter((A) => !$.has(A.id))], !0;
  }
  let k = 0;
  async function L(S) {
    const T = ++k, E = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (T !== k) return;
    const $ = E.ok ? s.shared ? [E.value] : E.value.rows : [];
    E.ok && (o.value = S($)), l.value = E.ok ? E.value : null;
    const A = $.length ? Math.min(...$.map((w) => w.id)) : 0;
    E.ok && !o.value.some((w) => w.id < A) && (d.value = !s.shared && ro(E.value, a)), r.value = E.ok ? "" : E.error, os(u, () => i.value = !0);
  }
  function z() {
    return L((S) => {
      if (!n || !S.length) return S;
      const T = Math.min(...S.map(($) => $.id)), E = Math.max(...S.map(($) => $.id));
      return [...o.value.filter(($) => $.id > E), ...S, ...o.value.filter(($) => $.id < T)];
    });
  }
  const ee = () => L((S) => S);
  async function j(S, T = null) {
    const E = await ep(T && { target: o, fields: { value: T(o.value) } }, S, s.run);
    return f.value = E.ok ? "" : E.error, m.value = E.ok ? E.value : null, await z(), E;
  }
  return e && (s.follow(t, y), z()), { rows: o, listing: l, failure: r, loaded: i, more: d, load: z, loadLatest: ee, older: O, act: j, actionFailure: f, answer: m, context: s };
}
const tp = { class: "title" }, np = { class: "state" }, ap = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = za(t.line, t.events);
    return (o, l) => (c(), W(Ju, {
      rows: F(n),
      failure: F(a),
      loaded: F(s),
      empty: e.empty
    }, {
      default: D(({ row: r }) => [
        g("span", tp, b(r.title), 1),
        g("span", np, b(F(Qo)(e.noun, r.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Z2 = /* @__PURE__ */ K(ap, [["__scopeId", "data-v-9191a6f0"]]);
function sp(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Te(() => clearInterval(a)), n;
}
const da = I(Date.now() / 1e3);
let io = 0, vn = 0;
function Wl() {
  return vn || (da.value = Date.now() / 1e3, io = setInterval(() => da.value = Date.now() / 1e3, 1e3)), vn += 1, Po() && jo(() => {
    vn -= 1, vn || clearInterval(io);
  }), da;
}
const op = 200, lp = Nl + Sn + Dl + op;
function jt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function rp(e, t, n) {
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
function ip(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const l = performance.now(), r = [];
    function i() {
      if (a.markMotion.value) {
        if (r.push(rp(o, l, n.value)), performance.now() - l < lp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: r })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const cp = ["title", "data-figure-mark", "data-folded", "data-open"], up = {
  key: 2,
  class: "worker"
}, dp = { class: "head" }, fp = { key: 0 }, hp = {
  key: 3,
  class: "status"
}, mp = {
  key: 0,
  class: "figure"
}, pp = {
  key: 1,
  class: "ran-for"
}, gp = { key: 2 }, vp = {
  key: 3,
  class: "news"
}, yp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, wp = {
  key: 6,
  class: "settled"
}, bp = {
  key: 1,
  class: "bar"
}, kp = {
  key: 3,
  class: "detail body"
}, xp = {
  key: 0,
  class: "body-label"
}, $p = ["title"], Mp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Hn(), a = ["onClick", "onAct"], s = R(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), l = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = R(() => t.open !== void 0), i = R(() => r.value || l.value), u = R(() => r.value ? t.open : o.value), d = R(() => r.value ? !t.open : l.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), m = R(() => i.value || f.value || !!n.onClick), v = I(null), y = I(null), { folded: O, phase: k } = Pl(v, () => d.value);
    ip(v, d, k, $e(Se, null));
    function L(ie) {
      var ve, Oe;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (r.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (l.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ie);
      }
    }
    const z = (ie) => n.onAct(ie), ee = ["failed", "unfinished"], j = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), M = R(() => t.mark.color ? t.mark.color : j.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : j.value ? `var(--tone-${j.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), S = R(() => M.value || "var(--tone-work)"), T = R(() => !t.mark.ending && !t.mark.ended && j.value !== "stopped"), E = Wl(), $ = R(
      () => t.mark.began_at && T.value && !t.mark.figure && !t.mark.counting ? L1(E.value - t.mark.began_at) : ""
    ), A = R(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${eo(ve - ie, !0)}` : eo(E.value - ie, !0) : $.value;
    }), w = ["bad", "danger", "warn"], p = R(() => w.includes(j.value) || t.mark.asks ? "attention" : T.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), x = ["bad", "danger"], _ = R(() => x.includes(j.value)), B = R(() => p.value === "process" ? "running" : _.value ? "cross" : j.value === "stopped" ? "stopped" : j.value === "good" ? "tick" : ""), Z = R(
      () => !!(t.mark.figure || A.value || t.mark.docked || t.mark.stopping || B.value || t.mark.settled || t.mark.news)
    ), X = R(() => [t.mark.title, t.mark.time ? ql(t.mark.time) : ""].filter(Boolean).join(" · ")), Y = R(() => ({
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
          failed: _.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: M.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: Y.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": F(O) ? "" : null,
      "data-open": r.value && e.open ? "" : null,
      onClick: L
    }), [
      (c(), W(wt(m.value ? "button" : "span"), {
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
          e.mark.worker ? (c(), h("span", up, b(e.mark.worker), 1)) : C("", !0),
          g("span", dp, [
            N(at, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", fp, b(e.mark.name), 1)) : C("", !0),
            i.value ? (c(), W(Rt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          Z.value ? (c(), h("span", hp, [
            e.mark.figure ? (c(), h("span", mp, b(e.mark.figure), 1)) : C("", !0),
            A.value ? (c(), h("span", pp, b(A.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", gp, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", vp, b(e.mark.news), 1)) : C("", !0),
            B.value === "running" ? (c(), h("span", yp)) : B.value ? (c(), W(lt, {
              key: 5,
              class: J(["sign", B.value]),
              name: B.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", wp, b(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), W(Ll, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: we(z, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && T.value ? (c(), h("span", bp, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: S.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !F(O) ? (c(), W(at, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !F(O) ? (c(), h("div", kp, [
        e.mark.bodyLabel ? (c(), h("p", xp, b(e.mark.bodyLabel), 1)) : C("", !0),
        N(at, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !F(O) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, $p)) : C("", !0),
      e.mark.card ? (c(), W(at, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ce(ie.$slots, "default", {
        shown: !F(O)
      }, void 0, !0)
    ], 16, cp));
  }
}), Hl = /* @__PURE__ */ K(Mp, [["__scopeId", "data-v-2aa9c496"]]), Sp = 60;
function _p(e, t) {
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
    if (l || a.value <= 0 || d.scrollTop > Sp) return;
    l = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    l = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await rt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: r, follow: i, loadEarlier: u };
}
const Ep = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Ul(e) {
  var n;
  const t = Ep[e] || ((n = Dt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ap = (e) => Ul(String(e).split(":")[0]), zl = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Cp = { passed: "good", failed: "danger", warned: "warn", running: "" }, Op = { good: "good", warn: "warn", danger: "danger" }, co = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Fu(e.target_model, e.target_id || 0)
}, Tp = { "open row": (e) => Ap(e.target_model), "open page": () => Ul("pages") };
function Bp(e, t) {
  const n = t || {}, a = co[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Cp[e.outcome] || "" : Op[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Tp[a](e) : "",
    handlers: a ? { onAct: () => co[a](e) } : {}
  };
}
const Rp = 2e3;
function Ip(e, t, n = Rp) {
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
  Ce(async () => {
    document.addEventListener("visibilitychange", u), await l(e), i();
  }), bt(() => {
    s = !0, clearTimeout(a), document.removeEventListener("visibilitychange", u);
  });
}
const Lp = 24, Np = 1e3, uo = 2e3, Dp = 0.25, Pp = 5e3;
function jp(e, t = Lp, n = () => !0) {
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
    const M = Date.now() - i < uo ? uo : Np;
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
  const k = () => !!u() && d() <= u().clientHeight * Dp;
  function L() {
    clearTimeout(r), k() && (r = setTimeout(() => a.value && k() && n() && y(!0), Pp));
  }
  function z() {
    f() ? v() : O();
  }
  function ee(j = 1, M = !1) {
    a.value ? s.value += Math.max(0, j) : y(M);
  }
  return Po() && jo(() => [l, r].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: y, left: O, scrolled: z, arrived: ee };
}
const qp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Fp = (e) => String(e ?? "").replace(qp, ""), Wp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: l, arrived: r, toBottom: i } = jp(s);
    he(
      () => n.lines.length,
      () => rt(() => r()),
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
      ne(b(F(Fp)(e.lines.join(`
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
}, Hp = /* @__PURE__ */ K(Wp, [["__scopeId", "data-v-c2fb1783"]]), Up = 1e4;
class zp {
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
    return this.heardAt !== null && t - this.heardAt > Up;
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
const Vp = {
  key: 0,
  class: "frame-note"
}, Gp = {
  key: 0,
  class: "frame-note"
}, Kp = ["src", "title"], Yp = 1e3, Zp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = it(), a = I(null), s = I(!1), o = I(!1);
    let l = null, r = 0;
    return Ce(() => {
      l = new zp(a.value, n), l.start(), r = setInterval(() => {
        s.value = l.silent();
      }, Yp);
    }), Te(() => {
      l == null || l.stop(), clearInterval(r);
    }), (i, u) => o.value ? (c(), h("p", Vp, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      s.value ? (c(), h("div", Gp, [
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
      }, null, 8, Kp)
    ], 64));
  }
}, Jp = /* @__PURE__ */ K(Zp, [["__scopeId", "data-v-32a49046"]]), yn = (e) => e ? e.split(", ") : [];
function Xp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function Qp(e, t) {
  return {
    reads: yn(e.reads_allowed),
    runs: yn(e.runs_allowed),
    missing: [...yn(e.reads_missing), ...yn(e.runs_missing)],
    ask: t
  };
}
const eg = {
  class: "allowance-prompt",
  role: "dialog"
}, tg = { class: "allowance-prompt-text" }, ng = { class: "allowance-prompt-buttons" }, ag = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", eg, [
      g("p", tg, b(F(Xp)(e.request)), 1),
      g("div", ng, [
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
}, sg = /* @__PURE__ */ K(ag, [["__scopeId", "data-v-cad69fe2"]]), fa = {
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
        ne(b(e.reason) + " ", 1),
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
}, og = ["data-window", "data-agent"], lg = {
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
    const r = $e(yi, null), i = Dc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: $e(Oc, null),
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
    Vr(Se, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ce(i.settle), Te(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Gr((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Wn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), W(sg, {
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
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(G, { key: 4 }, [
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
    ], 8, og));
  }
}, Ut = /* @__PURE__ */ K(lg, [["__scopeId", "data-v-c4443e2b"]]), Vl = {
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
    const n = e, a = t, s = { render: () => Wn(Jp, { src: n.entry.entry_url }) };
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
}, rg = ["data-window"], Gl = {
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
            )).default, Hi();
          } catch (r) {
            if (Fi(r) && Wi(r)) return;
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
    ], 8, rg)) : (c(), W(Ut, {
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
}, ig = "*.*", cg = {
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
    const t = e, n = $e(Se, null), a = new Mc();
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
      events: l.value ? [ig] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => l.value ? (c(), W(Gl, {
      key: 0,
      entry: r.value,
      subscriptions: F(a),
      environment: F(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), W(Vl, {
      key: 1,
      entry: r.value,
      subscriptions: F(a),
      environment: F(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, ug = { class: "mark-more-inner" }, dg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, fg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, hg = {
  key: 3,
  class: "mark-lines"
}, mg = "process", fo = "task", pg = {
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
    ), s = R(() => zl.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === fo ? t.mark.target_id : 0), l = _p(
      (v) => n.run(v),
      () => t.mark.target_id
    ), r = l.lines, i = I(!1), u = I(""), d = R(() => !t.declaration.body_url && t.mark.target_model === mg && !!t.mark.target_id);
    async function f(v = l.follow) {
      const y = await v();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = R(() => t.shown && d.value);
    return he(m, (v) => v && f()), Ip(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(l.newest)
    ), (v, y) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = we(() => {
      }, ["stop"]))
    }, [
      g("div", ug, [
        e.declaration.body_url ? (c(), W(cg, {
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
            y[2] || (y[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", dg, b(s.value), 1)
          ], 64)) : C("", !0),
          d.value && u.value ? (c(), h("p", fg, b(u.value), 1)) : d.value && i.value ? (c(), h(G, { key: 2 }, [
            y[3] || (y[3] = g("p", { class: "mark-label" }, "Output", -1)),
            N(Hp, {
              class: "mark-terminal",
              lines: F(r),
              onOlder: F(l).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", hg, b(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = we((O) => F(Pe)(`${fo}:${o.value}`), ["stop"]))
          }, " Open task " + b(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Va = /* @__PURE__ */ K(pg, [["__scopeId", "data-v-f4d037e5"]]), gg = ["title", "aria-label", "onClick"], vg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, yg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => mu(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), a = I(""), s = $e(Se);
    async function o(l) {
      const r = await an(l, { id: t.mark.target_id }, s.environment);
      a.value = r.ok ? "" : r.error;
    }
    return (l, r) => (c(), h(G, null, [
      (c(!0), h(G, null, te(n.value, (i) => (c(), h("button", {
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
      ], 8, gg))), 128)),
      a.value ? (c(), h("span", vg, b(a.value), 1)) : C("", !0)
    ], 64));
  }
}, wg = /* @__PURE__ */ K(yg, [["__scopeId", "data-v-7a62c88e"]]);
function Kl(e, t) {
  const n = ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((l) => [l.type, l])), s = async () => {
    try {
      return (await (await Le.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Yl = Kl("/api/marks", "marks"), J2 = Yl.fetchAll, bg = Yl.find, kg = ["data-ref"], xg = ["data-ref"], $g = { class: "mark-row" }, Mg = "dock add", Sg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = R(() => bg(a.mark.type)), o = R(() => Bp(a.mark, s.value)), l = R(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && zl.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), r = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      r.value = !r.value;
    }
    const u = R(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Mg));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": F(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        N(Va, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, kg)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": F(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", $g, [
          N(Hl, Ye({
            mark: o.value,
            open: l.value ? r.value : void 0
          }, Kr(o.value.handlers), { onClick: i }), Yr({ _: 2 }, [
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
          N(wg, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, xg));
    };
  }
}, _g = /* @__PURE__ */ K(Sg, [["__scopeId", "data-v-8196402d"]]), Eg = ["data-ref"], Ag = ["inert"], Cg = { class: "group-fold" }, Og = { class: "thread-group" }, Tg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), a = I(!1), s = I(!1), o = I(null);
    he(n, async (r) => {
      var i;
      a.value = !0, await rt(), (i = o.value) == null || i.offsetHeight, s.value = r;
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
      N(Hl, {
        mark: l.value,
        open: n.value,
        onClick: i[0] || (i[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      a.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: J(["group-rows", { open: s.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", Cg, [
          g("div", Og, [
            (c(!0), h(G, null, te(e.group.marks, (u) => (c(), W(_g, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Ag)) : C("", !0)
    ], 8, Eg));
  }
}, X2 = /* @__PURE__ */ K(Tg, [["__scopeId", "data-v-45b58b9b"]]);
function Bg(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ce(() => n.observe(e.value)), bt(() => n.disconnect()), t;
}
const Rg = { class: "chat-dock-fold" }, Ig = ["aria-label"], Lg = { class: "chat-dock-head" }, Ng = { class: "chat-dock-inner" }, Dg = { class: "chat-dock-foot" }, Zl = 700, Pg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = Bg(a), o = I(!1);
    let l = 0;
    return Ce(() => l = setTimeout(() => o.value = !0, Zl)), bt(() => clearTimeout(l)), t({ card: n }), (r, i) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", Rg, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ce(r.$slots, "edge", {}, void 0, !0),
          g("header", Lg, [
            ce(r.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Ng, [
              g("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
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
          g("footer", Dg, [
            ce(r.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, Ig)
      ])
    ], 2));
  }
}, Jl = /* @__PURE__ */ K(Pg, [["__scopeId", "data-v-50fe9157"]]), jg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ha = 5, qg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ha, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ha}s`, animationDelay: `${(n - ha).toFixed(2)}s` };
    return (s, o) => (c(), h("span", jg, [
      g("i", { style: a })
    ]));
  }
}, Xl = /* @__PURE__ */ K(qg, [["__scopeId", "data-v-2a7bc150"]]), Fg = { reviewing: "Under review" }, Wg = (e, t) => e || Fg[t == null ? void 0 : t.state] || "", Ue = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Hg = {
  draft: [{ word: "ready", label: "Mark ready" }, Ue],
  ready: [Ue],
  approved: [{ word: "start", label: "Start", main: !0 }, Ue],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ue],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ue],
  completed: [],
  cancelled: []
}, Ug = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ue],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ue],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ue],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ue],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, zg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Vg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Gg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Kg = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], Yg = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Zg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function Jg(e, t) {
  const n = { plan: Hg, task: Ug }[e], a = t != null && t.state ? Cc(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[el(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Xg = (e, t) => e === "doc" || e === "report" ? Zg(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Gg(t), ...Vg(t)] : e === "check" ? Yg(t) : e === "question" ? zg(t) : e === "memory" ? Kg(t) : Jg(e, t), Ql = Kl("/api/docks", "docks"), Q2 = Ql.fetchAll, Ft = Ql.find, Qg = 6, e0 = 3, ma = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Gn = (e) => Date.parse(e.leaves_at) / 1e3, mt = (e) => !!(e.leaves_at && !e.kept), t0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!mt(e) || t < Gn(e) || n.has(e.id)), n0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => t0(a, t, n)).sort((a, s) => a.id - s.id);
function a0(e, t, n = Qg) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Gn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const s0 = (e, t, n = e) => n < 2 ? !1 : e >= e0 ? !0 : t, o0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ga = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), l0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), r0 = (e) => ({ ...e.kept ? Ga("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ga("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), i0 = ["pins"], c0 = (e) => ({ ...e, iconOnly: i0.includes(e.icon) });
function u0(e, t) {
  var n;
  return [
    ...l0(e, t) ? [r0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Dt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Ga("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(c0);
}
function d0(e, t) {
  const n = u0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: o0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const f0 = ["title"], h0 = {
  key: 2,
  class: "dock-controls"
}, m0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, p0 = { class: "dock-facts" }, g0 = { key: 1 }, v0 = {
  key: 2,
  class: "dock-kept"
}, y0 = { class: "dock-acts" }, w0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = R(() => Ft(a.item.type)), o = Wl(), l = R(() => jl(a.item.created_at, o.value * 1e3)), r = I(null), i = I(null), u = I(null), d = I(null), f = R(() => d0(a.item, s.value)), m = $e(Se), v = I(null);
    let y = 0;
    async function O() {
      var A, w;
      const S = ++y, T = Ht(a.item.target_model ?? ""), E = `${T} show`;
      if (!((w = (A = s.value) == null ? void 0 : A.reads) != null && w.includes(E))) return;
      const $ = await gt(a.item.type, [T, "show", String(a.item.target_id)], m.environment);
      S === y && (v.value = $.ok ? { ...$.value, id: a.item.target_id, noun: T } : { id: a.item.target_id, noun: T });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (S, T, E) => {
        var w;
        const $ = Ht(a.item.target_model ?? "");
        v.value = { id: a.item.target_id, noun: $ }, O();
        const A = (w = m.subscriptions) == null ? void 0 : w.follow(`dock ${a.item.id}`, [`${$.replaceAll("-", "_")}.*`], (p) => {
          (!p.row_id || p.row_id === a.item.target_id) && O();
        });
        E(() => {
          y += 1, A == null || A();
        });
      },
      { immediate: !0 }
    );
    const k = I(/* @__PURE__ */ new Set()), L = I("");
    async function z(S) {
      if (S.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      S.action === "declared" && (k.value = /* @__PURE__ */ new Set([...k.value, S.label])), L.value = "";
      const E = await an(S, { id: a.item.target_id }, m.environment);
      (E == null ? void 0 : E.ok) === !1 && (k.value = new Set([...k.value].filter(($) => $ !== S.label)), L.value = `Could not ${S.label.toLowerCase()}: ${E.error}`);
    }
    const ee = R(() => f.value.actions.filter((S) => S.action !== "undock" && !k.value.has(S.label))), j = R(() => {
      var S;
      return Wg((S = s.value) == null ? void 0 : S.badge, v.value);
    }), M = R(() => f.value.buttons.find((S) => S.action === "undock"));
    return (S, T) => {
      var E, $, A, w;
      return c(), W(Jl, {
        label: f.value.title + ((E = s.value) != null && E.needs_user ? ", waiting for you" : ""),
        type: ($ = s.value) != null && $.needs_user ? "waiting" : "",
        folded: !!((A = s.value) != null && A.folds) && e.folded,
        body: !!((w = s.value) != null && w.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: T[3] || (T[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (c(), W(Xl, {
            key: 0,
            "ends-at": F(Gn)(e.item)
          }, null, 8, ["ends-at"])) : C("", !0)
        ]),
        head: D(() => {
          var p, x;
          return [
            (p = s.value) != null && p.draws_head && !e.collapsed ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: r,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(G, { key: 1 }, [
              N(me, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, b(f.value.title), 9, f0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", h0, [
              (c(!0), h(G, null, te(f.value.controls, (_) => {
                var B, Z;
                return c(), h(G, {
                  key: _.action + _.runs
                }, [
                  !k.value.has(_.label) && (!((B = _.variants) != null && B.length) || !((Z = v.value) != null && Z.state) || _.variants.includes(v.value.state)) ? (c(), W(ue, {
                    key: 0,
                    variant: "icon",
                    class: J({ kept: _.pressed }),
                    "aria-pressed": _.pressed,
                    "aria-label": _.label,
                    title: _.label,
                    "data-dock-action": _.action,
                    onClick: (X) => z(_)
                  }, {
                    default: D(() => [
                      N(me, {
                        name: _.icon,
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
              e.collapsed || !((x = s.value) != null && x.leaves_after_seconds) ? (c(), h(G, { key: 0 }, [
                ne(b(l.value), 1)
              ], 64)) : C("", !0)
            ], 512)
          ];
        }),
        still: D(() => [
          L.value || e.refusal ? (c(), h("p", m0, b(L.value || e.refusal), 1)) : C("", !0)
        ]),
        foot: D(() => {
          var p, x;
          return [
            g("span", p0, [
              j.value ? (c(), h("span", {
                key: 0,
                class: J(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, b(j.value), 3)) : C("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", g0, b(s.value.word), 1)) : C("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", v0, "Kept")) : C("", !0)
            ]),
            (x = s.value) != null && x.folds ? (c(), W(ue, {
              key: 0,
              small: "",
              class: "dock-fold",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: T[0] || (T[0] = (_) => n("fold"))
            }, {
              default: D(() => [
                ne(b(s.value.folds) + " ", 1),
                N(Rt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : C("", !0),
            g("span", y0, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              N(Au, {
                name: `dock.${e.item.type}`,
                row: v.value,
                environment: F(m).environment,
                "read-only": F(m).readOnly,
                "object-name": F(Ht)(e.item.target_model),
                "external-failure": "",
                onFailure: T[1] || (T[1] = (_) => L.value = _),
                onDone: O
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(G, null, te(ee.value, (_) => (c(), W(ue, {
                key: _.action + _.runs,
                small: "",
                variant: _.primary ? "primary" : "ghost",
                bordered: !_.primary,
                "data-dock-action": _.action,
                onClick: (B) => z(_)
              }, {
                default: D(() => [
                  ne(b(_.label), 1)
                ]),
                _: 2
              }, 1032, ["variant", "bordered", "data-dock-action", "onClick"]))), 128)),
              N(ue, {
                small: "",
                bordered: "",
                title: M.value.label,
                "data-dock-action": "undock",
                onClick: T[2] || (T[2] = (_) => n("undock", M.value))
              }, {
                default: D(() => [...T[4] || (T[4] = [
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
}, ho = /* @__PURE__ */ K(w0, [["__scopeId", "data-v-e99b734d"]]), b0 = ["title", "aria-label"], k0 = { class: "run-chip-in" }, x0 = {
  key: 0,
  class: "run-chip-ring"
}, $0 = { class: "run-chip-name" }, M0 = { class: "run-chip-bar" }, S0 = "processes.output", _0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = $e(Se, null), o = (s == null ? void 0 : s.environment) ?? "", l = I(null), r = R(() => !l.value || l.value.state === "running" || l.value.state === "background"), i = R(() => {
      var m, v;
      return ((m = l.value) == null ? void 0 : m.title) || ((v = l.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = R(() => r.value ? t.running : t[l.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await gt(S0, ["process", "card", String(a.item.target_id)], o);
      m.ok && (l.value = m.value);
    }
    let f = null;
    return Ce(() => {
      var m;
      d(), f = (m = s == null ? void 0 : s.subscriptions) == null ? void 0 : m.follow(`run chip ${a.item.id}`, ["process.*"], (v) => {
        (!v.row_id || v.row_id === a.item.target_id) && d();
      });
    }), bt(() => f == null ? void 0 : f()), (m, v) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": u.value })
      }, [
        F(mt)(e.item) ? (c(), W(Xl, {
          key: 0,
          "ends-at": F(Gn)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", k0, [
          r.value ? (c(), h("span", x0)) : (c(), W(lt, {
            key: 1,
            name: n[l.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", $0, b(i.value), 1)
        ]),
        g("span", M0, [
          g("i", {
            style: fe({ width: r.value ? `${((y = l.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, b0);
    };
  }
}, E0 = /* @__PURE__ */ K(_0, [["__scopeId", "data-v-44c1df26"]]), A0 = 24, C0 = 8, e5 = 420;
function t5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= A0 ? !0 : e < t && s > C0 ? !1 : null;
}
const O0 = (e, t) => e === void 0 ? t : e, T0 = { me: 1, people: [] }, Ln = ss({
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
  people: T0,
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
pl("journal.activity", () => Ln.activity);
pl("journal.side.mini", () => Ln.sideMini);
const er = "journal.viewer.";
function B0(e, t, n) {
  try {
    const a = n.getItem(er + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function R0(e, t, n) {
  try {
    n.setItem(er + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function mo(e, t, n = window.localStorage) {
  const a = I(B0(e, t, n));
  return he(a, (s) => R0(e, s, n), { deep: !0 }), a;
}
const I0 = {
  key: "dock-all",
  class: "dock-all"
}, L0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, N0 = { class: "dock-runs-title" }, D0 = { class: "dock-runs-chips" }, P0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var w, p;
    const t = e, n = sp(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), l = $e(Se), r = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(x, _) {
      i.value = { ...i.value, [x.id]: "" }, r.value = /* @__PURE__ */ new Set([...r.value, x.id]);
      const B = await an(_, { id: x.target_id }, l.environment);
      (B == null ? void 0 : B.ok) === !1 && (r.value = new Set([...r.value].filter((Z) => Z !== x.id)), i.value = { ...i.value, [x.id]: `Could not close this card: ${B.error}` });
    }
    const d = R(
      () => n0(
        t.items.filter((x) => !r.value.has(x.id)),
        n.value,
        a.value
      )
    ), f = R(
      () => a0(
        d.value.filter((x) => ma(x, Ft)),
        n.value
      )
    ), m = R(() => d.value.filter((x) => !f.value.includes(x) && !ma(x, Ft))), v = R(() => f.value.filter((x) => !mt(x))), y = mo(`dock-size:${((w = Ln.identity) == null ? void 0 : w.root) || location.host}`, null), O = (x) => y.value ? y.value.collapsed && !y.value.opened.includes(x.id) : t.collapsed, k = R(() => d.value.some(O)), L = R(() => (s.value = s0(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(O));
    function z() {
      y.value = { collapsed: !k.value, opened: [] };
    }
    function ee(x) {
      var B;
      if (!O(x)) return;
      const _ = (B = y.value) != null && B.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [..._, x.id] };
    }
    const j = mo(`dock-folded:${((p = Ln.identity) == null ? void 0 : p.root) || location.host}`, {}), M = (x) => {
      var _;
      return !!((_ = Ft(x.type)) != null && _.folds) && O0(j.value[x.id], ma(x, Ft) || t.folded);
    };
    function S(x) {
      j.value = { ...j.value, [x.id]: !M(x) };
    }
    function T(x) {
      j.value = { ...j.value, ...Object.fromEntries(f.value.map((_) => [_.id, _.id !== x.id])) }, o.value = !0;
    }
    function E() {
      j.value = Object.fromEntries(Object.entries(j.value).filter(([x]) => !f.value.some((_) => String(_.id) === x))), o.value = !1;
    }
    function $(x) {
      a.value = /* @__PURE__ */ new Set([...a.value, x.id]);
    }
    function A(x) {
      a.value = new Set([...a.value].filter((_) => _ !== x.id));
    }
    return (x, _) => (c(), W(Do, {
      tag: "div",
      name: "dock",
      duration: F(Zl),
      class: "dock-stack"
    }, {
      default: D(() => [
        d.value.length > 1 ? (c(), h("div", I0, [
          N(ue, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: z
          }, {
            default: D(() => [
              ne(b(k.value ? "Open all" : "Collapse all"), 1)
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(G, null, te(m.value, (B) => (c(), W(ho, {
          key: B.id,
          item: B,
          class: J({ timed: F(mt)(B) }),
          leaving: F(mt)(B) && !a.value.has(B.id),
          folded: M(B),
          collapsed: O(B),
          refusal: i.value[B.id],
          onOpen: (Z) => ee(B),
          onFold: (Z) => S(B),
          onUndock: (Z) => u(B, Z),
          onMouseenter: (Z) => $(B),
          onMouseleave: (Z) => A(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !k.value ? (c(), h("div", L0, [
          g("span", null, b(f.value.length) + " runs", 1),
          N(ue, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: E
          }, {
            default: D(() => [
              _[1] || (_[1] = ne(" Runs ", -1)),
              N(Rt, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(G, null, te(L.value ? [] : f.value, (B) => (c(), W(ho, {
          key: B.id,
          item: B,
          class: J({ timed: F(mt)(B) }),
          leaving: F(mt)(B) && !a.value.has(B.id),
          folded: M(B),
          collapsed: O(B),
          refusal: i.value[B.id],
          onOpen: (Z) => ee(B),
          onFold: (Z) => S(B),
          onUndock: (Z) => u(B, Z),
          onMouseenter: (Z) => $(B),
          onMouseleave: (Z) => A(B)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        L.value ? (c(), W(Jl, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: D(() => [
            N(me, {
              name: "runs",
              size: 14
            }),
            g("span", N0, b(f.value.length) + " runs", 1)
          ]),
          foot: D(() => [
            g("span", D0, [
              (c(!0), h(G, null, te(f.value, (B) => (c(), W(E0, {
                key: B.id,
                item: B,
                onClick: (Z) => T(B)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            N(ue, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: _[0] || (_[0] = (B) => o.value = !0)
            }, {
              default: D(() => [
                _[2] || (_[2] = ne(" Runs ", -1)),
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
}, n5 = /* @__PURE__ */ K(P0, [["__scopeId", "data-v-d4c81ace"]]), pt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, _n = (e) => Math.min(Math.max(e, 0), 1), j0 = (e) => {
  const t = _n(e);
  return t * t * (3 - 2 * t);
}, ut = (e, t, n) => j0((e - t) / (n - t));
function a5(e) {
  const t = _n(e), n = _n((t - 0.12) / 0.76) * pt.shuffles, a = Math.min(Math.floor(n), pt.shuffles - 1), s = n - a, o = ut(s, 0.26, 0.38) * (1 - ut(s, 0.76, 0.96)), l = ut(s, 0.38, 0.76), r = ut(t, 0, 0.12) * (1 - ut(t, 0.88, 1)), i = ut(s, 0.2, 0.34) * (1 - ut(s, 0.84, 1)), u = Math.sin(Math.PI * _n((s - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (a + l) / pt.shuffles, lift: pt.lift * o, ready: r, weight: i, follow: u, shuffle: a, phase: s };
}
function s5(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const po = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, o5 = (e) => po[e] ?? po.butler, ps = 2400, q0 = 0.05;
function F0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, q0), l = Math.min(t + ps * o, s), r = e + l * o;
  return r < n ? { y: r, speed: l, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function l5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function W0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function r5(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const i5 = (e, t) => ({ ...e, stretch: t.stretch }), c5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, tr = (e, t) => t >= (e.least ?? 0);
function u5(e, t, n) {
  if (!tr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const d5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), H0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", go = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), U0 = (e) => e.right > e.left && e.bottom > e.top;
function f5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(H0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const l = o.getBoundingClientRect();
    let r = go(l, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (r = go(r, i.getBoundingClientRect()), a && (r.bottom = Math.min(r.bottom, a.top))), U0(r) ? [{ id: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom, clip: r }] : [];
  });
}
function nr(e, t, n) {
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
}, Jt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), z0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => z0(Jt(e, t, n)), V0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], st = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, wn = ([e, t], n) => e + n() * (t - e);
function G0(e) {
  return V0.map(() => {
    const t = wn(st.speed, e), n = wn(st.angle, e) * Math.PI / 180, a = wn(st.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [wn(st.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const K0 = G0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Y0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * st.gravity * (t[2] - st.floor))) / st.gravity;
}
function h5(e, t, n = K0) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], l = Y0(o, a.from), r = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= l + r) return null;
  const i = Math.min(s, l), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= st.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - l) / r };
}
const m5 = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function p5(e, t) {
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
const g5 = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function v5(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [l, r] = [t.left + Tt.margin * n, t.right - Tt.margin * n], i = Math.min(Math.max(e + o + s * Tt.reach * n, l), r), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function y5(e, t, n) {
  const a = xe.bug_smash, s = Me(t, a.walk), o = ([l, r]) => l + (r - l) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Tt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Tt.tall * n * (1 - Me(t, a.emerge)),
      turn: 90 * (1 - Me(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Me(t, a.gone)
    }
  };
}
function w5(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = F0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ae = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function b5(e) {
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
function Z0(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, l = W0(e, o), r = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : r + (l / n.frames >= n.splat ? 1 : 0);
  return { frame: l, stretch: o, bug: r, shot: u };
}
function k5(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: l, bug: r, shot: i } = Z0(n, e.length), u = e.map((L, z) => ({ ...Ka(L, t, Math.min(n / o.fps, En(z).shot)), shot: z < i })), d = Me(l / o.frames, o.aim), [f, m] = [u[Math.max(r - 1, 0)], u[r]], v = e.map((L, z) => ({ bug: L, index: z, seconds: n / o.fps - En(z).shot, spot: Ka(L, t, En(z).shot) })).filter((L) => L.seconds >= 0), y = v.flatMap((L) => {
    const z = (s == null ? void 0 : s.get(L.index)) ?? tv(L.bug, t, L.spot, s ? [] : a);
    return s == null || s.set(L.index, z), s && nv(z, L.seconds, a), av(z, L.seconds, a);
  }), O = v.filter((L) => Q0(L.bug)).map((L) => ({ seconds: L.seconds, from: L.spot })), k = +(e[Math.max(r - 1, 0)].wall === "top") * (1 - d) + +(e[r].wall === "top") * d;
  return { bugs: u, frame: l, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: k }, slush: y, camera: O };
}
function En(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function x5(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [l, r] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = En(d), m = Ka(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - l >= r - i ? -1 : 1 : Math.sign(i - m.x), O = Math.abs(m.x - i) >= v ? i : m.x + y * v, k = y > 0 ? Math.max(i, Math.min(O, r)) : Math.min(i, Math.max(O, l)), L = { from: i, to: k, begin: f.walk, end: f.aim };
    return i = k, L;
  });
}
function $5(e, t, n) {
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
const be = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, J0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function X0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Q0 = (e) => e.along * 97 % 1 < be.camera, Xt = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * be.gravity * t * t });
function ev(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * be.gravity * (t.bottom - e.from.y))) / be.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * be.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / be.gravity, on: "top" });
  const l = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let r = e.from;
  for (let u = 0; u < l.t; u += be.step) {
    const d = Math.min(u + be.step, l.t), f = Xt(e, d), m = nr(r, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    r = f;
  }
  const i = Xt(e, l.t);
  return { ...l, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function tv(e, t, n, a = []) {
  const s = X0(e.along + 1), [o, l] = J0[e.wall], r = Math.atan2(l, o);
  return Array.from({ length: be.count }, () => {
    const i = r + (s() - 0.5) * 2 * (be.spread * Math.PI / 180), u = be.speed[0] + s() * (be.speed[1] - be.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: be.radius[0] + s() * (be.radius[1] - be.radius[0]) };
    return { ...d, ...ev(d, t, a) };
  });
}
function nv(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += be.step) {
      const l = Math.min(o + be.step, s), r = nr(Xt(a, o), Xt(a, l), n);
      if (r) {
        Object.assign(a, r, { t: o + (l - o) * r.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function av(e, t, n = []) {
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
function M5(e, t, n, a) {
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
function S5(e, t, n, a, s) {
  const { sway: o, above: l } = xe.chute, r = { x: t.x, y: t.y - l * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (O) => {
    const [k, L] = [O.x - e.at.x, O.y - e.at.y];
    return { x: r.x + k * u - L * d, y: r.y + k * d + L * u };
  }, [m, v] = [...n].sort((O, k) => O.x - k.x), y = e.ends.map(f);
  return { left: r.x - e.at.x, top: r.y - e.at.y, middle: r, turn: i, lines: y.map((O, k) => ({ from: O, to: k < y.length / 2 ? m : v })) };
}
const _5 = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function Nn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Jt(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Jt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function E5(e, t) {
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
const A5 = (e) => e === "pack_box";
function C5(e) {
  const { into: t, out: n } = Nn(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function O5(e) {
  const t = xe.rope_swing, { into: n, out: a } = Nn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const sv = { after: 3 }, gs = 10, ov = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, lv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, rv = { weight: 19 }, ar = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, iv = { every: 120 }, sr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, or = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, cv = {
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
}, on = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: gs }), ae = (e, t, n = {}) => on(e, "clip", t, n), pa = (e, t, n = {}) => on(e, "look", t, n), vo = (e, t, n = {}) => on(e, "gaze", t, n), de = (e, t, n = {}, a = {}) => ({ ...on(e, "pick", t, n), ...a }), ge = (e) => on("nothing", "nothing", e, {}), uv = 120, dv = 300, ga = (e, t) => ({ ...ae(e, t), cooldown: dv }), le = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), fv = () => [ae("joy", 2)], dt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), ft = (e) => ({ ...e, cooldown: ov[e.name] }), qt = (e) => ({ ...e, shenanigan: !0, lasts: lv[e.name] }), Kn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...le("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...le("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...ft(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...ft(ae("bug_smash", 2)), toward: "", onto: !1 },
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
  ...le("reported", { cooldown: 90 }, [vo("read", 3), ae("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...le("read_message", { cooldown: 30 }, [vo("read", 3), ge(1)]),
  ...le("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), ge(6)]),
  ...le("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...le("bar_done", { holds: !0 }, fv()),
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
  ...Object.entries(cv).flatMap(([e, t]) => le(`reacted:${e}`, {}, [pa(t, 1)])),
  ...Object.entries(sr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => le(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(or).flatMap(([e, t]) => le(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...le("pastime", {}, [
    dt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    dt("rest", 3, 180, 120),
    dt("yawn", 2, 60, 60),
    dt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    dt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    dt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    dt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...qt(ft(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    qt(ft(ae("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...le("held:search", { cooldown: uv }, [ga("search", 3), { ...ga("binoculars", 2), when: { home: !0 } }, { ...ga("glass_bubble", 2), when: { bubble: !0 } }]),
  ...le("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...le("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...le("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...le("tickled", {}, [{ ...ft(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...le("eager", {}, [ae("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...le("jump", {}, [qt(ft(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...le("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...le("unit", { cooldown: ar.build.cooldown }, [de("unit", rv.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...le("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...le("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: iv.every }, de("stand", 5)]),
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
    qt(ft(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], lr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), rr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), hv = (e) => Array.isArray(e) ? e[0] : e, mv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, pv = (e) => Kn.some((t) => t.when.moment === e);
function gv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || rr(d).every(([f, m]) => n(f) >= hv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Kn.filter((d) => lr(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), r = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= sv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = r.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : r;
}
function je(e, t) {
  const n = gv(e);
  let a = t() * n.reduce((o, l) => o + l.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (ir(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function ir(e, t, n) {
  var a;
  for (const [s, o] of rr(t)) (a = e.memory) == null || a.set(s, e.now + mv(o, n));
}
function T5(e, t, n) {
  ir(e, Kn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const B5 = (e) => Object.values(ar).find((t) => lr(t.when, e)) ?? null, vv = (e, t, n) => n - t <= (e.lifetime ?? gs), R5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || tr(e.clip, t));
class cr {
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
}, I5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ur = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), L5 = {
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
}, N5 = 120, yv = 20, D5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < yv), wv = (e) => Ya[e] || Ya.idle, P5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, dr = "airborne", bv = "landing", kv = "travelling", fr = "grounded", j5 = ({ airborne: e, landing: t, trip: n }) => e ? dr : t ? bv : n != null && n.started ? kv : fr;
function q5(e, t) {
  var s;
  const n = xv(e, t);
  return e.mode === fr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function xv(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: l, place: r, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === dr && r.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? r.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (l) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...$v(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (r.posture === "hang") return { clip: `hang_${r.grip}`, facing: r.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (r.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && r.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, r.posture) ? d : wv(u), facing: v ? m : r.posture === "sit" ? r.face : f };
}
function $v(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Za = (e) => e.outcome, Mv = "plugin:code-commandments:sins:", yo = (e) => e.type === "plugins.card" && e.markKey.startsWith(Mv), Sv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => yo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => yo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], F5 = (e, t) => e.filter((n) => n.author === "user" && Rn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Rn(n.read_at), card: Ol(n) })).sort((n, a) => n.time - a.time), wo = { user: "reacted", agent: "agent_reacted" };
function W5(e, t) {
  return e.filter((n) => wo[n.author] && yt(n) > t).map((n) => ({ beat: `${wo[n.author]}:${n.emoji}`, time: yt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const _v = [.../* @__PURE__ */ new Set([...Object.values(sr).flatMap((e) => Object.keys(e)), ...Object.keys(or)])];
function H5(e, t) {
  return e.filter((n) => n.author === "agent" && yt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = _v.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: yt(n), card: Ol(n) })).sort((n, a) => n.time - a.time);
}
const Ev = (e) => new cr(e).isTest(), Dn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Za(e)] || "";
}, Av = 1800, Cv = (e, t) => {
  if (Dn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Dn(n) !== "finished" && Number(e.time) - Number(n.time) <= Av ? "tests_fixed" : "tests_passed";
};
function U5(e, t, n) {
  var l;
  const a = (((l = e == null ? void 0 : e.data) == null ? void 0 : l.cards) || []).filter(Ev), s = a.filter((r) => Dn(r)), o = s.filter((r) => t.get(r.key) === "" || !t.has(r.key) && Number(r.time) > n);
  return a.forEach((r) => t.set(r.key, Dn(r))), o.map((r) => ({ beat: Cv(r, s), time: Number(r.time), card: r.key }));
}
function z5(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Za(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Za(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const V5 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: yt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function G5(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function K5(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Y5(e, t) {
  var o, l;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((r) => r.time > t).map((r) => {
    var i;
    return { beat: (i = Sv.find((u) => u.matches(r))) == null ? void 0 : i.beat, time: r.time, card: r.key };
  }).filter((r) => r.beat), s = Number(((l = e == null ? void 0 : e.data) == null ? void 0 : l.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((r, i) => r.time - i.time);
}
function vs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const bo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Ov(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let l = 0; l < 60; l++) {
    const r = (s + o) / 2;
    vs(e, t, r, a).pitch > n ? s = r : o = r;
  }
  return (s + o) / 2;
}
function Z5(e, t, n, a = {}) {
  const s = je({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : pv(`held:${e}`) ? "idle" : e;
}
const Ee = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function J5(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ee.ahead * n ? 180 : Math.sign(a) * Ee.turn;
}
const ko = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function X5(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Ee.sweep) % s, r = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = ko((r - i) / Ee.returnSeconds), d = r <= i ? ko(r / i) : 1 - u, f = l + ((l + 1) % s - l) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const xo = 3, hr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, $o = 12, Q5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function e4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!hr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= xo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * $o) / $o, lasts: xo } };
}
const t4 = (e) => e.posture === "hang" && !hr(e.face), Tv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Bv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function n4(e, t, n) {
  return Tv.has(e) ? 1 / 0 : !Bv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(mr(n - t.began, t.share) - Ve.lead, 0);
}
const Rv = 5;
function a4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= Rv ? { beat: "long_walk", time: n } : null };
}
const Iv = 30, bn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function s4(e, t, n, a, s = null) {
  if (t && n < t.until || !bn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = je({ moment: "spell", state: e, tally: s }, a), [l, r] = bn.seconds;
  return o ? { state: o.name, began: n, until: n + l + a() * (r - l), next: n + bn.every } : { state: e, began: 0, until: 0, next: n + bn.every };
}
const o4 = (e, t, n) => t && n < t.until && ur.has(e.state) ? { state: t.state, since: t.began } : e, Ve = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, mr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function l4(e, t, n, a) {
  var r;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, l = mr(o, e.share);
  return s ? { eager: Lv(t, l), moment: null } : l > Ve.lead ? { eager: t, moment: null } : l < Ve.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ve.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ve.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((r = je({ moment: "eager", slow: !0 }, n)) == null ? void 0 : r.name) === "eager" }, moment: null };
}
function Lv(e, t) {
  return e.on && t > Ve.lead + Ve.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ve.lead && t >= Ve.least ? { ...e, on: !0, calm: !1 } : e;
}
const Nv = 1, Dv = { look: "look", gaze: "gaze" };
function Pv(e, t, n, a, s = "", o = () => !0, l = null) {
  const r = je({ moment: e, voice: s, has: o, memory: t, now: n, tally: l }, a);
  return r ? { [Dv[r.type] ?? "clip"]: r.name, toward: r.toward ?? "", onto: !!r.onto, holds: !!r.holds, lifetime: r.lifetime } : null;
}
const jv = (e, t, n, a, s, o = "", l = () => !0, r = null, i = "") => je({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: l, memory: n, now: a, tally: r, ball: i }, s), qv = (e, t, n, a, s, o = 0) => je({ moment: "jump", high: e > Nv * t, memory: a, now: s, room: o }, n).name === "backflip", Fv = { work: ["building"], idle: ["standing"] };
function r4(e, t, n, a) {
  const s = Ya[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Fv[s] ?? []).map((l) => ({ beat: l, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), ur.has(e) ? { moments: o, began: n || a } : (n && a - n >= Iv && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Wv(e, t, n) {
  return !je({ moment: "pondering", memory: e, now: t }, n) || !je({ moment: "thought_cloud", memory: e, now: t }, n) ? null : je({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Mo = { pondering: Wv };
function i4(e, t, n, a, s, o) {
  if (Mo[e.beat]) {
    const r = Mo[e.beat](n.reacted, a, s);
    return r && o(r) ? { beat: { clip: r, card: "", ...e.during && { during: e.during } } } : null;
  }
  const l = Pv(e.beat, n.reacted, a, s, t, o, n.tally);
  return l != null && l.look ? { look: l.look } : l != null && l.gaze && e.card ? { gaze: { card: e.card } } : l != null && l.clip ? { beat: { clip: l.clip, card: l.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...l.onto && e.card ? { onto: !0 } : {}, ...l.holds && { holds: !0 }, ...l.lifetime !== gs && { lifetime: l.lifetime } } } : null;
}
function c4(e, t, n, a, s, o, l = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = jv(e.room ?? 0, t.lasted, n, a, s, e.voice, o, l, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const u4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function d4(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function f4(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const h4 = (e, t) => !!(e != null && e.watches) && !t.once, m4 = 10, p4 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || vv(a, a.queuedAt, n)), g4 = (e, t) => t ? null : e[0] ?? null;
function v4(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const y4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Hv = 2 * Math.PI, Uv = 500;
function w4(e, t, n, a, s = null, o = 1) {
  const l = a - (e.at || a), r = l / Uv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + r, d) : Math.max(e.amount - r, d), m = Hv * l / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, O = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Vv(v, t, n, m, s) : Kv(v, t, n, m) : t) ?? v, k = O != null && O.behind && O.mood === "reading" ? zv(e.point, O, n, l, s) : O;
  return { point: k ?? null, toward: k ? { x: k.x - n.x, y: k.y - n.y } : null, amount: f, at: a };
}
function zv(e, t, n, a, s) {
  const o = ($) => $ * 180 / Math.PI, l = ($) => o(Math.atan2(Math.sin($ * Math.PI / 180), Math.cos($ * Math.PI / 180))), r = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = l(o(Math.atan2(t.x - n.x, -i)) - r), d = l(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - r), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? l(e.readingFacing - r) : 0, v = f ? e.readingYaw + m : d, y = v + l(u - v), O = Math.min(Math.max(a / 1e3, 0), 0.1), k = Ee.turnSpeed * O, L = f ? v + Math.min(Math.max(y - v, -k), k) : y, z = f ? e.readingFollow + m : L, ee = z + (L - z) * (1 - Math.exp(-O / Ee.followSeconds)), j = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, M = o(vs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), S = Math.min(Math.max(M, -j.up), j.down), T = Ee.tipSpeed * O, E = f ? e.readingPitch + Math.min(Math.max(S - e.readingPitch, -T), T) : S;
  return { ...t, readingYaw: L, readingFollow: ee, readingPitch: E, readingFacing: r };
}
function Vv(e, t, n, a, { depth: s, above: o, tip: l }) {
  const r = (z) => {
    const { yaw: ee, pitch: j } = vs(z.x - n.x, s, n.y - z.y, o);
    return { yaw: ee, pitch: Math.min(Math.max(j, -l.up * Math.PI / 180), l.down * Math.PI / 180) };
  }, [i, u] = [bo(r(e)), bo(r(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, O, k] = i.map((z, ee) => m * z + v * u[ee]), L = s * y / O;
  return { ...t, x: n.x + L, y: n.y - Ov(L, s, -Math.asin(Math.min(Math.max(k, -1), 1)), o) };
}
const Gv = 0.15;
function b4(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Gv;
}
function Kv(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), l = Math.atan2(Math.sin(o - s), Math.cos(o - s)), r = s + Math.max(-a, Math.min(a, l)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(r), y: n.y + i * Math.sin(r) };
}
const Yv = (e) => !(e != null && e.on);
function k4(e, t, n) {
  if (Yv(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, l) => l.findIndex((r) => r.beat === s.beat && r.card === s.card) === o);
  return { answer: [], held: a };
}
const Qt = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, He = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, va = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), So = (e) => e * e * (3 - 2 * e);
function Zv(e) {
  if (e < 0 || e >= He.seconds) return null;
  const t = va(e, ...He.flicker), n = Math.floor(t * He.flickers * 2) % 2 === 0, a = e < He.flicker[1] ? n ? 0.35 + 0.5 * t : He.dim : 1;
  return { strength: 1 - So(va(e, ...He.fade)), lit: a, white: e < He.flash[0] ? 0 : 1 - So(va(e, ...He.flash)) };
}
const x4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function $4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = Zv(t - e.at);
  return a && { colour: Qt.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: He.signs[e.tone], ...a } };
}
function M4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function S4(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= Qt.looks || a === null && n - e.since >= Qt.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function _4(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (r) => (r + a * 12) % 12, o = (r) => 0.5 - 0.5 * Math.max(-1, Math.min(s(r) - 3, 9 - s(r), 1)), l = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - l, across: l, open: l, flash: 0, glow: l };
}
const nt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, E4 = { behind: 39, figure: 40, ahead: 41 }, Jv = "[data-figure-pile]", Xv = { amber: [1, 0.69, 0.125], good: Qt.colours.good, bad: Qt.colours.bad }, An = { phases: 4, ms: 230, dim: 0.25 }, A4 = (e, t, n) => e !== "amber" || (t + n) % An.phases < An.phases / 2 ? 1 : An.dim, C4 = (e) => e === "amber" ? An.phases : 1;
function O4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const T4 = Object.keys(Xv), qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Wt = ([e, t], n) => e + n() * (t - e);
function B4(e) {
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
function R4(e) {
  const t = Math.floor(e / ya.high);
  return { left: -(nt.inside + nt.width / 2 + t * (nt.width + ya.gap)), up: e % ya.high * (nt.height - nt.top) };
}
const Qv = (e, t, n) => je({ moment: "unit", memory: e, now: t }, n) !== null, ey = { after: 5 }, ty = (e) => e.filter((t) => t.active && (t.process || t.watch) && new cr(t).isBuild());
function I4(e, t, n) {
  const a = ty(e).sort((o, l) => Number(o.time) - Number(l.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= ey.after ? s : null;
}
function L4(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: Qv(n, a, s) } : null;
}
const _o = { ahead: 140, up: 70 };
function N4(e, t, n, a, s) {
  const o = e.find((l) => l.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * _o.ahead, y: a - _o.up } } : o ? { at: { x: n(o), y: a - o.up - nt.height } } : t ? { at: null } : null;
}
const wa = { least: 4e3, most: 1e4 }, ny = (e) => wa.least + e() * (wa.most - wa.least), ht = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function D4(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = ny(t);
    if (n.length >= ht.most || t() >= ht.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (ht.at[0] + t() * (ht.at[1] - ht.at[0]));
    n.push({ from: o, to: o + ht.ms }), a = o + ht.ms;
  }
}
const P4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), j4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), pr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), q4 = new Set(Kn.filter((e) => pr.has(e.when.moment) && e.type === "clip").map((e) => e.name)), ay = (e) => e.some((t) => t.state === "built"), F4 = (e, t) => ay(t) ? e.filter((n) => !pr.has(n.beat)) : e, ot = { reach: 40, room: 6 }, sy = (e, t) => t <= e - ot.reach + 2, W4 = (e, t, n) => sy(e, n) ? t - ot.reach : e - ot.reach - ot.room, H4 = (e, t, n, a) => a > 0 && t < e && t + ot.reach >= e - 2 ? Math.min(n, Math.max(e, t + ot.reach)) : e, ba = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, U4 = (e) => Wt(e() < ba.longShare ? ba.long : ba.short, e), oy = 2 * nt.width;
function z4(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= oy ? o : e + (o - e + s / 2) % s;
}
const ly = 60, V4 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= ly, Eo = "[data-figure-home]", ln = () => {
  var t;
  const e = document.querySelector(Eo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Eo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, ry = "[data-figure-docked-bars]", iy = "[data-figure-chat-foot]", cy = [0.85, 0.6, 0.35, 0.15], uy = ["question", "waiting", "suggestion"], G4 = (e, t) => uy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function K4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const dy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", fy = "[data-figure-newest]";
function gr() {
  var a, s;
  const e = (a = ln()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(fy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
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
function en(e, t, n = gr()) {
  if (!e || !n) return !0;
  const a = Je(e, t), s = Zn(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, l = pt.gap;
  return !Yn(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
function Y4(e, t, n, a = gr()) {
  if (!a || en(t, e, a)) return null;
  const s = Zn(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, l = (Math.max(s.right, 0.73) - 0.5) * e.size, r = $t(), i = t.posture === "stand" ? bs * e.size : Mr * e.size, u = Math.max(n.left + i, r.left + o), d = Math.min(n.right - i, r.right - l);
  return [a.left - pt.gap - l, a.right + pt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && en(m, e, a) && Fy(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const ka = 0.26, vr = 0.54, hy = 1.25 / 5.4, rn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ka, travels: "stand" },
  lounge: { drop: ka, travels: "stand" },
  composed: { drop: ka, travels: "stand" },
  hang: { drop: vr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Z4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * hy * Math.cos(t * Math.PI / 180),
  y: 1 - n - vr
}), zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), my = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), J4 = (e, t) => (e === "sit" ? my.has(t) : zt.has(e)) ? e : "stand";
function X4(e, t) {
  return e.facing === t.facing || !zt.has(e.posture) && !zt.has(t.posture) ? t : { posture: "stand", facing: zt.has(e.posture) ? e.facing : t.facing };
}
const Q4 = 0.25, ex = (e, t) => zt.has(e) && rn[t].drop === 0, yr = 2, py = 90, gy = 180, vy = 140, yy = 280, wy = 420, by = 0.25, ky = 290, xy = 600, $y = "cubic-bezier(0.2, 0.7, 0.4, 1)", My = "cubic-bezier(0.55, 0, 0.9, 0.6)", xa = 5;
function Pn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < xa) return null;
  (l || r) && (o = Math.max(o, yr));
  const v = o > 1, y = Math.abs(t.x - e.x), O = y < xa ? 0 : y / (py * o) * 1e3, k = Math.min(O, v ? vy : gy), L = Math.abs(t.y - e.y), z = t.y < e.y, ee = z && !m && qv(L, n, i, u, d, f), j = z ? wy + Math.min(L, 400) * by : Math.sqrt(2 * L / ps) * 1e3, M = {
    x: t.x,
    y: t.y,
    ms: L > xa ? ee ? xy : j : 0,
    lead: ee ? ky : z ? yy : 0,
    easing: z ? $y : My,
    hopping: !0,
    clip: ee ? "backflip" : z ? "jump" : "fall"
  }, S = { x: t.x, y: t.y, ms: O + k, lead: 0, easing: "linear", ramp: k, ...v ? { clip: "run" } : {} }, T = m ? Sy(t, n) : M, E = z && !a ? [{ ...S, y: e.y }, T] : [{ ...M, x: e.x }, S];
  return { way: Math.sign(t.x - e.x) || 1, legs: E, lands: !s, pace: o, running: v };
}
const Sy = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), _y = (e, t) => e.postures.includes(t) ? t : e.postures[0], tx = (e, t, n) => e.posture === "walk" && n ? "walk" : _y(e.clip, t), Je = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - rn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Yn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ys = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function $t() {
  var t;
  const e = (t = ln()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const kn = 0.5, Ao = 20;
function nx(e, t, n = $t()) {
  const a = Je(e, t);
  return a.left >= n.left + Ao && a.right <= n.right - Ao;
}
function ws(e, t, n = $t()) {
  const a = Je(e, t), s = a.right - a.left, o = Zn(e), [l, r] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return l >= n.left - kn && r <= n.right + kn && a.top >= n.top - kn && i <= n.bottom + kn;
}
const jn = [0.35, 0.5, 0.65], qn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: jn[0], right: jn.at(-1), top: qn[0], bottom: qn.at(-1) }, Ey = 0.24;
function Zn(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ey * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function Ay(e, { size: t }, n = $t()) {
  const a = Zn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const bs = (_e.right - _e.left) / 2 + 0.08;
function ax(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - rn[e].drop) };
}
const Cy = "[data-figure-agent]";
function wr(e, t, n = "", a = "") {
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
const br = (e) => qn.flatMap(
  (t) => jn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function ks(e, t, n = "") {
  if (!en(e, t)) return jn.length * qn.length;
  const a = Je(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(dy)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: i }) => i.width && i.height && Yn(s, i) && ys(r)).map(({ rect: r }) => r), l = (r, i) => o.some((u) => r >= u.left && r <= u.right && i >= u.top && i <= u.bottom);
  return br(s).filter(([r, i]) => l(r, i) || wr(r, i, n)).length;
}
function Oy(e, t) {
  const n = Je(e, t);
  return br({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => wr(a, s, "", Cy)).length;
}
const Co = 4;
function sx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Co; o <= s; o += Co)
    for (const l of [t.x - o, t.x + o]) {
      if (l - a < n.left || l + a > n.right) continue;
      const r = { ...t, x: l };
      if (!Oy(r, e) && en(r, e)) return r;
    }
  return null;
}
function tn(e, t, n) {
  const a = $t(), s = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => ws(l, t, a) && en(l, t)).map((l) => ({ spot: l, covered: ks(l, t), away: s(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const kr = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Ty = [0.5, 0.25, 0.75], By = (e) => kr(e.getBoundingClientRect(), Ty), xr = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Ry = bs, Iy = (e, t, { size: n }, a = Ry) => $r(e, xr[t], a * n, "stand");
function $r(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Ly = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Mr = 0.1, Ny = (e, t, { size: n }) => $r(e, Ly[t], Mr * n, "sit"), Dy = (e) => ((e + 180) % 360 + 360) % 360 - 180, $a = 60;
function ox(e, t) {
  const n = Dy(t);
  return !e.aside || Math.abs(n) >= $a ? t : n < 0 ? 360 - $a : $a;
}
const Vt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Py = (e) => [.../* @__PURE__ */ new Set([e, ...Vt.turns.map((t) => (t + 360) % 360)])];
function lx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Py(t), l = Vt.every[0] + a() * (Vt.every[1] - Vt.every[0]);
  return { face: t, from: s ? jy(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + l };
}
function jy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Vt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function rx(e, t) {
  const { element: n, edge: a } = Jn(), s = ["left", "right"].map((r) => cn(Ny(a, r, e), e)).filter((r) => n && ws(r, e) && !ks(r, e)), o = (r) => t ? Math.abs(r.x - t.x) : 0, l = s.sort((r, i) => o(r) - o(i))[0];
  return l ? { ...l, view: null, on: n } : null;
}
function ix(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Sr } : e;
}
const Sr = 7;
function _r() {
  const e = [...document.querySelectorAll(Jv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function qy(e, t) {
  const n = Je(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function Fy(e, t) {
  const n = _r();
  return !n || !Yn(qy(e, t), n);
}
const Wy = 4;
function Jn() {
  const e = un(), t = _r(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Wy || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Sr - n, 0) } };
}
const cx = ({ size: e, below: t }) => (1 - t) * e;
function cn(e, t) {
  const n = $t(), { size: a, below: s } = t, o = rn[e.posture].drop * a;
  return { ...Ay(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Ja = (e, t) => Object.keys(xr).map((n) => cn(Iy(e, n, t), t)), xs = (e, t) => kr(e, cy).map((n) => cn(n, t)), Er = (e, t, n) => tn(e, t, n) ?? e[0];
function ux(e, t) {
  const { element: n, edge: a } = Jn();
  return { ...Er(Ja(a, e), e, t), view: null, on: n };
}
function dx(e, t, n, a) {
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
  const e = ln(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(ry);
  if (!t) return { ...Xn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Oo = { within: 2 };
function fx(e) {
  const { element: t, docked: n, edge: a } = un();
  if (!n || e.on !== t) return !0;
  const s = Xn().edge;
  return a.left > s.left + Oo.within || a.left + a.width < s.left + s.width - Oo.within;
}
const Hy = "[data-figure-closing]";
function hx() {
  var n;
  const { element: e, docked: t } = un();
  return t && !!((n = e.firstElementChild) != null && n.matches(Hy));
}
const Ar = "[data-figure-progress]";
function mx(e) {
  const t = e.querySelector(Ar);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function px(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, l) => s(l) < s(o) ? l : o) : null;
}
const Uy = { across: 300, above: 380, below: 60 };
function gx(e) {
  const { across: t, above: n, below: a } = Uy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: zy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const zy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Cr = "[data-figure-bar]", Xa = { back: 144, along: 0.4 };
function vx(e) {
  const { element: t, docked: n, edge: a } = un(), s = n ? t.querySelector(Cr) : null;
  if (!(s != null && s.querySelector(Ar))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...cn({ x: o - Xa.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function yx(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Xa.along * a.size ? t.x + Xa.along * a.size : e.x, y: e.y, behind: !0 };
}
function wx(e) {
  const t = e.querySelector(Cr), n = t == null ? void 0 : t.firstElementChild;
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
function bx(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: l, edge: r } = Xn(), i = n === null ? Vy(r, e, o === null ? t : { x: o, y: r.top }, a, s) : cn({ x: n, y: r.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: l, stays: !0 };
}
function Vy(e, t, n, a, s) {
  const o = xs(e, t), l = Math.min(...o.map((i) => i.x)), r = o.filter((i) => i.x + a + nt.width < s && i.x + a - ot.reach - ot.room >= l);
  return tn(r.length ? r : o, t, n);
}
const Gy = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function kx(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || l) && (s = Math.max(s, yr));
  const v = (ee) => {
    const j = Je(ee, n, rn[ee.posture].travels);
    return { x: j.left, y: j.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return Ky(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [O, ...k] = [e, ...i, t].map(v), L = Pn(O, k[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: l, random: r, memory: u, now: d, room: f, pogo: m }), z = k.slice(1).map((ee, j) => {
    var M;
    return (M = Pn(k[j], ee, n.size, { random: r, memory: u, now: d, room: f })) == null ? void 0 : M.legs.find((S) => S.hopping);
  });
  return L && { ...L, legs: [...L.legs, ...z.filter(Boolean)] };
}
function Ky(e, t, n, a, s, o, l) {
  const r = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Gy.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Pn(e, n, o.size, { pace: l }) : Pn(n, t, o.size, { pace: l }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], r(n, t)] : [r(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: l, running: l > 1 };
}
function xx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function $x(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), l = o && tn(By(o), t, n);
    return l ? { ...l, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Jn();
  return { ...Er(xs(s, t), t, n), view: null, on: a };
}
const Yy = "[data-figure-bubble]", Zy = 250;
let Gt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Or = 0;
const Pt = () => Gt, Ma = /* @__PURE__ */ new WeakMap();
let Jy = 0;
function $s(e) {
  return Ma.has(e) || Ma.set(e, `floor-${++Jy}`), Ma.get(e);
}
const Xy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Qy = () => {
  var e, t;
  return ((t = (e = ln()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function ew(e, t) {
  var a;
  const n = (a = e.querySelector(iy)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function tw(e, t) {
  const n = e && ew(e, t), a = e ? [...e.querySelectorAll(Yy)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: l }) => ({ element: o, type: l, box: o.getBoundingClientRect() })).filter(({ type: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Xy(l, n))).map(({ element: o, type: l, box: r }) => ({ id: $s(o), type: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const nw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= Zy ? (t.top - a.top) / s * 1e3 : 0;
};
function Tr(e = Gt, t = performance.now()) {
  const n = $t(), a = Qy(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = un(), i = [];
  o && i.push({ id: "home", type: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const u = Xn();
  return u.element && i.push({ id: $s(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...tw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: nw(e, d, t) }))) });
}
const Qa = /* @__PURE__ */ new Set();
function aw(e) {
  return Qa.add(e), () => Qa.delete(e);
}
function sw() {
  Br();
  const e = () => {
    Or = requestAnimationFrame(e), !document.hidden && (Gt = Tr(Gt), Qa.forEach((t) => t(Gt)));
  };
  e();
}
function Br() {
  cancelAnimationFrame(Or);
}
const Ms = 5, ow = 56, lw = { share: 0.6 }, rw = (e) => -Math.sqrt(2 * ps * lw.share * e), It = (e, t) => e.find((n) => n.id === t) ?? null;
function Mx(e, t = Tr().floors) {
  const n = It(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : $s(e.on) : null, o = s && It(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Rr({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: l }, r, i = Pt().floors) {
  const u = It(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (l || iw(u, d, o)) && cw(d, r, i) ? { x: d.x, y: d.y } : null;
}
const Ss = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, iw = (e, t, n) => !Ss({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Sx(e, t = Pt().floors) {
  if (!Ss(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ms && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function cw(e, t, n = Pt().floors) {
  const a = It(n, "home");
  return e.posture === "hang" && a && Je(e, t).bottom >= a.top ? !1 : ws(e, t);
}
function _x(e, t, n, a = Pt().floors) {
  const s = Rr(e, n, a);
  if (!e.home) return uw(e, t, s, a);
  if (!s) return null;
  const o = It(a, "home"), l = s.y - t.y, r = l > Ms ? "dropping" : -l > ow ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: r };
}
function uw(e, t, n, a) {
  const s = n ? It(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: rw(e.risen) };
  if (!n) return null;
  if (Ss(t) && n.y - t.y > Ms) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const l = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...l }, motion: "carried" };
}
function Ex(e, t, n) {
  const a = bs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function Ax(e, t, n, a = Pt().floors) {
  const s = t && Rr(t, n, a);
  return s ? { ...e, ...s } : e;
}
const dw = ["data-type"], fw = { class: "figure-floor-name" }, hw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", fw, b(e.floor.type), 1)
    ], 12, dw));
  }
}, mw = /* @__PURE__ */ K(hw, [["__scopeId", "data-v-4e0f1e2e"]]), pw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, gw = {
  __name: "FigureFloors",
  setup(e) {
    const t = ze(Pt().floors);
    let n = () => {
    };
    return Ce(() => {
      n = aw((a) => t.value = a.floors), sw();
    }), Te(() => {
      n(), Br();
    }), (a, s) => (c(), h("div", pw, [
      (c(!0), h(G, null, te(t.value, (o) => (c(), W(mw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Cx = /* @__PURE__ */ K(gw, [["__scopeId", "data-v-e519168b"]]), Sa = (e) => typeof e == "number" ? e : Date.parse(e);
function Ox(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: Sa(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => Sa(s.row.created_at) - Sa(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const vw = 3, _a = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function yw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = _a[n.grouping]) == null ? void 0 : a.call(_a, e.row, n)) || "";
}
function ww(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function Tx(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= vw ? [ww(a, t)] : a), a = [];
  };
  for (const l of e) {
    const r = yw(l, t);
    r !== s && o(), s = r, r ? a.push(l) : n.push(l);
  }
  return o(), n;
}
const bw = 1e3;
function kw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), bw);
  return bt(() => clearInterval(t)), e;
}
const xw = ["datetime", "title"], Qn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = kw(), a = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, b(F(jl)(e.at, F(n))), 9, xw));
  }
};
function Bx(e) {
  const t = it(), n = t.option("row"), a = I(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function $w(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const Rx = (e) => (t) => t.filter((n) => n.id !== e), Ix = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), Lx = (e) => (t) => [...t, e], Nx = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function Dx(e, t = {}) {
  const n = it(), a = I(null), s = I("");
  async function o(...l) {
    const r = await n.read(e(...l), t);
    s.value = r.ok ? "" : r.error, r.ok && (a.value = r.value);
  }
  return { value: a, failure: s, load: o };
}
function Px(e) {
  const t = it(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const xn = /* @__PURE__ */ new Map();
function Mw(e, t) {
  if (xn.has(e)) return xn.get(e);
  const n = t().finally(() => xn.delete(e));
  return xn.set(e, n), n;
}
function jx() {
  const e = it(), t = I(null), n = I("");
  async function a() {
    const s = await Mw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Sw = { class: "cards-page" }, _w = { class: "cards-bar" }, Ew = { class: "cards-count" }, Aw = { class: "cards" }, Cw = {
  key: 1,
  class: "cards-note"
}, Ow = {
  key: 2,
  class: "cards-note"
}, Tw = ["data-row", "onClick"], Bw = { class: "card-head" }, Rw = { class: "card-title" }, Iw = { class: "card-foot" }, Lw = {
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
    return (a, s) => (c(), h("div", Sw, [
      g("div", _w, [
        g("span", Ew, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
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
            ne(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Aw, [
        e.loaded ? e.failure ? (c(), h("p", Cw, b(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", Ow, "No " + b(e.noun) + "s yet", 1)) : (c(), W(kt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(G, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (l) => n("open", o)
        }, [
          g("span", Bw, [
            N(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + b(e.head(o)), 1),
            N(Qn, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Rw, b(e.title(o)), 1),
          g("span", Iw, b(e.foot(o)), 1)
        ], 8, Tw))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, qx = /* @__PURE__ */ K(Lw, [["__scopeId", "data-v-990e6b37"]]), To = "newest";
function Fx(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = I(""), o = I(To), l = I("all"), r = R(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => $w(m, d, a == null ? void 0 : a.fields) && (l.value === "all" || !n || n(m) === (l.value === "open")));
    return o.value === To ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = R(() => !!s.value.trim() || !!n && l.value !== "all");
  return { words: s, order: o, state: l, shown: r, filtering: i, hasStates: !!n };
}
const Nw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Dw = 40, Pw = "top", jw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = R(() => a === Pw), o = I(null), l = I(!1), r = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      l.value = r(o.value) >= Dw;
    }
    return he(() => n.rowCount, async () => {
      await rt(), !l.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", Nw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
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
            [qo, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Wx = /* @__PURE__ */ K(jw, [["__scopeId", "data-v-3accb764"]]), qw = ["aria-selected", "data-tab", "onClick"], Fw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Ww = {
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
    const d = () => rt(() => u(!0));
    let f = null;
    return Ce(() => {
      var m;
      u(!1), f = new ResizeObserver(() => u(!1)), f.observe(l.value), (m = document.fonts) == null || m.ready.then(() => u(!1));
    }), Te(() => f == null ? void 0 : f.disconnect()), he(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), he(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: l,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(G, null, te(o.value, (y) => {
        var O, k;
        return c(), h("button", {
          key: y.key,
          type: "button",
          role: "tab",
          class: J(["inner-tab", { on: ((O = e.active) == null ? void 0 : O.key) === y.key }]),
          "aria-selected": ((k = e.active) == null ? void 0 : k.key) === y.key,
          "data-tab": y.key,
          onClick: (L) => a("choose", y)
        }, [
          ne(b(y.label) + " ", 1),
          i(y) ? (c(), h("span", Fw, b(e.answer[y.count_field]), 1)) : C("", !0)
        ], 10, qw);
      }), 128)),
      g("i", {
        class: J(["inner-tabs-line", { slides: r.value.slides }]),
        style: fe({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, Hx = /* @__PURE__ */ K(Ww, [["__scopeId", "data-v-63fcd326"]]), Hw = {
  class: "tab-body",
  "data-tab-body": ""
}, Uw = { "data-tab-content": "" }, zw = {
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
    }), (s, o) => (c(), h("div", Hw, [
      n.value ? (c(), W(kt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Ze(g("div", Uw, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [qo, !n.value]
      ])
    ]));
  }
}, Ux = /* @__PURE__ */ K(zw, [["__scopeId", "data-v-63876533"]]), Vw = {}, Gw = { class: "menu-label" };
function Kw(e, t) {
  return c(), h("span", Gw, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const es = /* @__PURE__ */ K(Vw, [["render", Kw], ["__scopeId", "data-v-aa955b3e"]]), Yw = {
  class: "search-bar",
  "data-search-bar": ""
}, Zw = { class: "search-bar-control" }, Jw = ["value", "placeholder", "aria-label"], Xw = ["aria-expanded"], Qw = {
  key: 0,
  "data-menu-count": ""
}, eb = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var L;
    const a = e, s = n, o = Zr(), l = ((L = $e(Se, null)) == null ? void 0 : L.search) ?? {}, r = R(() => l.placeholder || a.placeholder), i = l.context ?? [], u = I(null), d = I(null), f = I([]), m = R(() => f.value.length ? f.value[f.value.length - 1].next : i), v = R(() => !!o.menu || i.length > 0), y = (z) => {
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
      return c(), h("div", Yw, [
        g("div", Zw, [
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
          }, null, 40, Jw),
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
            e.menuCount ? (c(), h("span", Qw, b(e.menuCount), 1)) : C("", !0),
            N(me, {
              name: "caret",
              size: 12
            })
          ], 8, Xw)) : C("", !0)
        ]),
        (j = F(l).button) != null && j.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: ee[1] || (ee[1] = (M) => s("pick", F(l).button.click))
        }, b(F(l).button.title), 1)) : C("", !0),
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
            f.value.length ? (c(), W(vt, {
              key: 0,
              "data-search-back": "",
              onClick: ee[2] || (ee[2] = (M) => f.value = f.value.slice(0, -1))
            }, {
              default: D(() => [
                ne("‹ " + b(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(G, null, te(m.value, (M) => (c(), W(vt, {
              key: M.title,
              description: M.subtext,
              "data-search-entry": M.title,
              onClick: (S) => O(M)
            }, {
              default: D(() => [
                ne(b(M.title) + b(M.next.length ? " ›" : ""), 1)
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
}, tb = /* @__PURE__ */ K(eb, [["__scopeId", "data-v-36dee105"]]), nb = {
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
    return (o, l) => (c(), W(tb, {
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
        (c(), h(G, null, te(a, (r) => N(vt, {
          key: r.key,
          checked: e.tools.order.value === r.key,
          "data-list-order": r.key,
          onClick: (i) => e.tools.order.value = r.key
        }, {
          default: D(() => [
            ne(b(r.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(G, { key: 0 }, [
          N(es, null, {
            default: D(() => [...l[3] || (l[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, te(s, (r) => N(vt, {
            key: r.key,
            checked: e.tools.state.value === r.key,
            "data-list-state": r.key,
            onClick: (i) => e.tools.state.value = r.key
          }, {
            default: D(() => [
              ne(b(r.label), 1)
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
}, zx = /* @__PURE__ */ K(nb, [["__scopeId", "data-v-dab0064d"]]);
function Vx() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Gx = (e) => import(
  /* @vite-ignore */
  e
), ab = 86400, ts = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function sb(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ts(t) - ts(e)) / ab);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Kx(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ts(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: sb(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Ea = 280, Aa = 240, Ca = 120, ob = 6, lb = 14, nn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function rb(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function Ir(e, t) {
  const n = Math.max(0, rb(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function ib(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${lb}px)` }), e.offsetHeight, e.style.transition = `height ${Ea}ms ${nn}`, e.style.height = `${l}px`;
  const r = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Ir(t, e));
    const m = s() - r;
    if (!i && m >= Ea && (i = !0, e.style.transition = `opacity ${Aa}ms ease-out, transform ${Aa}ms ${nn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ea + Aa) return a(f);
    d();
  };
  return a(f), d;
}
function Yx(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${ob}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ca}ms ease-out, transform ${Ca}ms ${nn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = s(), r = () => {
    if (n() && (t.scrollTop = Ir(t, e)), s() - l < Ca) return a(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(r);
}
const cb = 140, $n = 220, Bo = 5;
function Zx({ gap: e = cb, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, l = !1;
  function r(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Bo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, r(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = ib) => {
    if (l || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, r(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= Bo && u.flush();
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
function Jx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${$n}ms ${nn}, opacity ${$n}ms ease-in, margin ${$n}ms ${nn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, $n);
}
const Lr = "chat.pins.minimised", Cn = I(On(Lr, !1));
function Ro(e) {
  Cn.value = e, cs(Lr, e);
}
function ub(e) {
  const t = R(() => e()), n = R(() => Cn.value ? [] : e()), a = () => Ro(!Cn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => yt(o) > s).length,
    (o, l) => o > l && Ro(!1)
  ), { pins: t, visible: n, minimised: Cn, toggle: a };
}
const db = ["title"], fb = {
  key: 0,
  class: "pins-count"
}, hb = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = ub(() => t.pinRows);
    return (o, l) => F(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: F(a), inline: e.inline }]),
      title: F(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: l[0] || (l[0] = we((...r) => F(s) && F(s)(...r), ["stop"]))
    }, [
      N(me, {
        name: F(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      F(a) ? (c(), h("span", fb, b(F(n).length), 1)) : C("", !0)
    ], 10, db)) : C("", !0);
  }
}, Xx = /* @__PURE__ */ K(hb, [["__scopeId", "data-v-d073c504"]]), mb = ["title"], pb = ["title"], gb = { class: "diff-card-dir" }, vb = { class: "diff-card-name" }, yb = ["title"], wb = ["title"], bb = {
  key: 0,
  class: "diff-card-note"
}, kb = ["href"], xb = ["src", "alt"], $b = { class: "diff-card-rows" }, Mb = { class: "diff-row-num" }, Sb = { class: "diff-row-sign" }, _b = { class: "diff-row-code" }, Eb = {
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
    function o(A) {
      (A.metaKey || A.ctrlKey) && (A.stopPropagation(), a("open", n.path));
    }
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, i = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, i.value)), d = R(() => n.path.slice(i.value)), f = R(() => n.change === "deleted"), m = R(() => l[n.change]), v = R(() => new Set(n.rows.filter((A) => A.line_type === "add").map((A) => A.line))), y = I("after"), O = R(() => y.value === "before" ? n.whole.old : n.whole.text), k = R(() => n.whole && n.whole.text !== void 0 ? O.value.split(`
`).map((A, w) => ({ line_type: y.value === "after" && v.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: A })) : n.rows.filter(
      (A) => !(n.editsOnly && ["ctx", "fold"].includes(A.line_type)) && !(n.hideRemovals && A.line_type === "del")
    )), L = I(!1), z = R(() => n.lines && !L.value && !n.whole), ee = R(() => z.value ? k.value.slice(0, n.lines) : k.value), j = R(() => k.value.length - ee.value.length), M = (A) => A.line === null || A.line_type === "del" ? "" : A.line, S = (A) => A.line_type === "fold" ? A.hidden ? `⋯ ${A.hidden} lines` : "⋯" : A.text, T = I(null), E = I(null);
    let $ = null;
    return Ce(() => {
      if (!E.value) return;
      let A = !0;
      $ = new ResizeObserver(() => {
        !T.value || !E.value || (T.value.style.transition = A ? "none" : "", T.value.style.height = `${E.value.offsetHeight}px`, A = !1);
      }), $.observe(E.value);
    }), Te(() => $ && $.disconnect()), (A, w) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (p) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${F(s)}-click to open it`,
          onClick: o
        }, [
          g("span", gb, b(u.value), 1),
          g("span", vb, b(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.change])
          }, b(m.value), 3)) : C("", !0)
        ], 8, pb),
        g("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        g("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        N(Qn, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = we((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, b(y.value === "after" ? "After" : "Before"), 9, yb)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = we((p) => a("whole"), ["stop"]))
        }, [
          N(me, {
            name: "file",
            size: 12
          })
        ], 10, wb))
      ], 8, mb),
      e.whole && e.whole.error ? (c(), h("p", bb, b(e.whole.error), 1)) : C("", !0),
      !f.value && !e.folded ? (c(), h(G, { key: 1 }, [
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
          }, null, 8, xb)
        ], 8, kb)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: T,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: E,
            class: "diff-card-diff"
          }, [
            g("div", $b, [
              (c(!0), h(G, null, te(ee.value, (p, x) => (c(), h("div", {
                key: x,
                class: J(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", Mb, b(M(p)), 1),
                g("span", Sb, b(r[p.line_type]), 1),
                g("span", _b, b(S(p)), 1)
              ], 2))), 128)),
              j.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = we((p) => L.value = !0, ["stop"]))
              }, b(j.value) + " more " + b(j.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, Qx = /* @__PURE__ */ K(Eb, [["__scopeId", "data-v-23581cbb"]]), Ab = {
  key: 0,
  class: "window-failure"
}, Cb = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = it(), a = I(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], s), s(), (o, l) => a.value && !a.value.ok ? (c(), h("p", Ab, b(a.value.error), 1)) : a.value ? (c(), W(Ch, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : C("", !0);
  }
}, Ob = {
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
    const n = t, a = e, s = R(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = R(() => s.value && { render: () => Wn(Cb, { line: s.value.line }) }), l = I(null), r = R(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = l.value) != null && v.component_trusted);
    }), i = R(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = R(
      () => {
        var m, v;
        return l.value ? Qp(l.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
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
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), W(Gl, {
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
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), W(Vl, {
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
}, Tb = ["data-section"], Bb = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(Tc, null), a = R(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = R(() => ({ row: t.row }));
    return (o, l) => (c(!0), h(G, null, te(a.value, (r) => (c(), h("div", {
      key: r.name,
      class: "inspector-section",
      "data-section": r.name
    }, [
      N(Ob, {
        name: r.name,
        catalogue: F(n).catalogue,
        subscriptions: F(n).subscriptions,
        environment: F(n).environment,
        prompts: F(n).prompts,
        "shell-read": F(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Tb))), 128));
  }
}, Rb = {
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
}, Ib = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Lb = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Nb = { class: "ask-text" }, Db = ["placeholder", "aria-label"], Pb = ["placeholder", "aria-label"], jb = {
  key: 3,
  class: "moves"
}, qb = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = R(() => Xg(a.noun, a.row)), l = I(""), r = I(null), i = I(""), u = I("");
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
        class: J(["foot", { inline: e.inline }])
      }, [
        l.value ? (c(), h("p", Ib, b(l.value), 1)) : C("", !0),
        (O = r.value) != null && O.confirm ? (c(), h("div", Lb, [
          g("span", Nb, b(r.value.confirm), 1),
          N(ue, {
            small: "",
            variant: r.value.danger ? "ghost" : "primary",
            bordered: r.value.danger,
            class: J({ danger: r.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: y[0] || (y[0] = (k) => d(r.value))
          }, {
            default: D(() => [
              ne(b(r.value.label), 1)
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
          }, null, 40, Db), [
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
          }, null, 40, Pb)), [
            [Ra, u.value]
          ]) : C("", !0),
          N(ue, {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: D(() => [
              ne(b(r.value.label), 1)
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
        ], 32)) : (c(), h("div", jb, [
          (c(!0), h(G, null, te(o.value, (k) => (c(), W(ue, {
            key: k.word,
            small: !k.bordered,
            bordered: k.bordered,
            icon: k.icon,
            variant: k.main ? "primary" : "ghost",
            class: J({ danger: k.danger }),
            "data-move": k.word,
            onClick: (L) => f(k)
          }, {
            default: D(() => [
              ne(b(k.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "variant", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : C("", !0);
    };
  }
}, Fb = /* @__PURE__ */ K(qb, [["__scopeId", "data-v-0262f48f"]]), Wb = /* @__PURE__ */ new Set(["completed", "cancelled"]), Hb = (e) => Wb.has(e), Fn = (e) => Hb(e) ? "done" : e, Ub = { class: "facts" }, zb = { class: "fact wide" }, Vb = { class: "fact-value" }, Gb = {
  key: 0,
  class: "fact"
}, Kb = { class: "fact-value" }, Yb = { class: "fact" }, Zb = { class: "fact-label" }, Jb = ["title"], Xb = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, Qb = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, ek = {
  key: 2,
  class: "fact"
}, tk = { class: "fact-value" }, nk = { class: "fact wide" }, ak = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, sk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = In.map(({ key: o, label: l }) => ({ key: String(o), label: l })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, l) => {
      var r, i;
      return c(), h("div", Ub, [
        g("div", zb, [
          l[2] || (l[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", Vb, b((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Gb, [
          l[3] || (l[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", Kb, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(G, { key: 1 }, [
          g("div", Yb, [
            g("span", Zb, b(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: l[0] || (l[0] = (u) => F(Pe)(`agents:${e.task.helper_id}`))
            }, b(e.task.helper_name), 9, Jb)
          ]),
          F(s).has(e.task.state) ? (c(), h("p", Xb, b(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", Qb, b(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", ek, [
          l[4] || (l[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", tk, "Agent " + b(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", nk, [
          l[5] || (l[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          N(zn, {
            options: F(n),
            value: String(F(Fl)(e.task.priority)),
            "data-task-priority": "",
            onPick: l[1] || (l[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", ak, b(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, ok = /* @__PURE__ */ K(sk, [["__scopeId", "data-v-2bcdca7a"]]), lk = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, rk = ["datetime"], ik = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", lk, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(G, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, b(new Date(a.created_at).toLocaleString()), 9, rk),
        g("p", null, b(a.reason), 1)
      ]))), 128))
    ])) : C("", !0);
  }
}, ck = /* @__PURE__ */ K(ik, [["__scopeId", "data-v-b41f213b"]]), uk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, dk = { ...uk, done: "Completed" }, fk = { class: "task-status-icon" }, hk = ["width", "height", "aria-label"], mk = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => el("task", Fn(t.status))), a = R(() => n.value === "testing" ? "started" : n.value), s = R(() => dk[t.status] ?? Qo("task", t.status));
    return (o, l) => (c(), h("span", fk, [
      N(Lt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: D(() => [
          (c(), h("svg", {
            key: n.value,
            class: J(["ring", n.value]),
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
          ], 10, hk))
        ]),
        _: 1
      })
    ]));
  }
}, Nr = /* @__PURE__ */ K(mk, [["__scopeId", "data-v-ae24a63f"]]), pk = {
  class: "part",
  "data-resource-waits": ""
}, gk = ["onClick"], vk = { class: "wait-id" }, yk = { class: "wait-title" }, wk = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", pk, [
      g("h4", null, b(e.title), 1),
      (c(!0), h(G, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (l) => n("select", o.id)
      }, [
        N(Nr, {
          status: F(Fn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", vk, b(o.id), 1),
        g("span", yk, b(o.title), 1)
      ], 8, gk))), 128))
    ]));
  }
}, Io = /* @__PURE__ */ K(wk, [["__scopeId", "data-v-8fb2e251"]]), bk = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, kk = { class: "text" }, xk = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, $k = 180, Mk = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), l = R(() => a.task.waits.filter((i) => !n.has(i.state))), r = R(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(G, null, [
      l.value.length ? (c(), W(Io, {
        key: 0,
        title: "Waits on",
        waits: l.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", bk, [
        u[3] || (u[3] = g("h4", null, "How it was done", -1)),
        g("p", kk, b(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", xk, [
        u[4] || (u[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: J(["text", { clamped: !o.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > $k && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0),
      r.value.length ? (c(), W(Io, {
        key: 3,
        title: "Waited on",
        waits: r.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, Sk = /* @__PURE__ */ K(Mk, [["__scopeId", "data-v-4a3f1e79"]]), _k = {
  class: "task-details",
  "data-task-details": ""
}, Ek = { class: "since" }, Ak = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Ck = { class: "text" }, Ok = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Tk = {
  key: 1,
  class: "note"
}, Bk = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Rk = { class: "text" }, Ik = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var l;
      return c(), h("div", _k, [
        g("div", {
          class: J(["state-line", F(Fn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (r) => n("status", r.currentTarget))
          }, [
            N(Nr, {
              status: F(Fn)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + b(a(e.task.state)), 1)
          ]),
          g("span", Ek, [
            o[3] || (o[3] = ne(" since ", -1)),
            N(Qn, {
              at: F(Tl)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", Ak, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", Ck, b(e.task.reason || "Other tasks"), 1),
          (l = e.task.openers) != null && l.length ? (c(), h("p", Ok, "Opens by itself when " + b(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Tk, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Bk, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", Rk, b(e.task.reason), 1)
        ])) : C("", !0),
        N(ok, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (r) => n("priority", r))
        }, null, 8, ["task", "place", "refusal"]),
        N(Sk, {
          task: e.task,
          onSelect: o[2] || (o[2] = (r) => n("select", r))
        }, null, 8, ["task"]),
        N(ck, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Lk = /* @__PURE__ */ K(Ik, [["__scopeId", "data-v-408e9f91"]]), Nk = 50, Dk = { messages: 25 }, Pk = (e) => Dk[e] || Nk, jk = {
  class: "task-log",
  "aria-label": "Task log"
}, qk = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Fk = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Wk = { class: "entries" }, Hk = ["datetime"], Uk = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, zk = {
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
        String(Pk("task_logs")),
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
    ), bt(() => {
      r += 1;
    }), (u, d) => (c(), h("section", jk, [
      o.value ? (c(), W(kt, { key: 0 })) : l.value ? (c(), h(G, { key: 1 }, [
        g("p", qk, b(l.value), 1),
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
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? C("", !0) : (c(), h("p", Fk, "No log entries yet.")),
        g("ol", Wk, [
          (c(!0), h(G, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, b(new Date(f.created_at).toLocaleString()), 9, Hk),
            g("p", null, b(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", Uk, [
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
          g("span", null, "Page " + b(a.value), 1),
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
}, Vk = /* @__PURE__ */ K(zk, [["__scopeId", "data-v-98b3a6b1"]]), Gk = { class: "comment-side-head" }, Kk = {
  key: 0,
  class: "comment-none"
}, Yk = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", Gk, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        N(is, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      e.comments.length ? C("", !0) : (c(), h("p", Kk, "No comments yet")),
      (c(!0), h(G, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(a)), 1))), 128))
    ], 2));
  }
}, Zk = /* @__PURE__ */ K(Yk, [["__scopeId", "data-v-19fdbdd4"]]);
var No;
/Mac|iPhone|iPad/.test(((No = navigator.userAgentData) == null ? void 0 : No.platform) || navigator.platform);
function Jk(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Xk = ["placeholder"], Qk = { class: "actions" }, e2 = { class: "error" }, t2 = {
  key: 1,
  class: "card closed"
}, n2 = { class: "mark" }, a2 = { class: "prompt" }, s2 = {
  key: 0,
  class: "draft"
}, o2 = {
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
      r.value = !0, i.value = !1, await rt(), (O = ((y = d.value) == null ? void 0 : y.querySelector("input")) || d.value) == null || O.focus();
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
      class: J(["comment-bar", { open: r.value }])
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
          onKeydown: O[1] || (O[1] = Kt((k) => F(Jk)(k, v), ["enter"]))
        }, null, 40, Xk), [
          [Ra, o.value]
        ]),
        g("div", Qk, [
          g("span", e2, b(l.value), 1),
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
      ], 32)) : (c(), h("div", t2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", n2, [
            N(me, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", a2, b(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", s2, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: O[2] || (O[2] = (k) => s("show"))
        }, [
          g("span", null, b(F(Si)(e.count, "comment")), 1),
          N(me, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, l2 = /* @__PURE__ */ K(o2, [["__scopeId", "data-v-b68baddd"]]);
function r2(e, t) {
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
const i2 = { class: "top" }, c2 = {
  class: "crumb",
  "data-task-crumb": ""
}, u2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, d2 = {
  key: 1,
  class: "body"
}, f2 = { class: "summary" }, h2 = { class: "stamp" }, m2 = {
  class: "title",
  "data-resource-title": ""
}, p2 = {
  class: "tabs",
  "data-task-tabs": ""
}, g2 = { class: "panels" }, v2 = {
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
    ], v = r2(
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
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", i2, [
        e.backed ? (c(), W(Rb, {
          key: 0,
          onBack: M[0] || (M[0] = (S) => s("back"))
        })) : C("", !0),
        g("span", c2, b(O.value), 1),
        M[9] || (M[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
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
      r.value ? (c(), h("p", u2, b(r.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        N(Fb, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: k
        }, null, 8, ["id", "row", "read"]),
        g("header", f2, [
          g("div", h2, [
            ne(" Task " + b(o.value.id) + " · updated ", 1),
            N(Qn, {
              at: F(Tl)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", m2, b(o.value.title), 1)
        ]),
        g("div", p2, [
          N(zn, {
            options: m,
            value: f.value,
            onPick: M[4] || (M[4] = (S) => f.value = S)
          }, null, 8, ["value"])
        ]),
        g("div", g2, [
          N(Nt, { value: f.value }, {
            details: D(() => [
              N(Lk, {
                task: o.value,
                place: l.value,
                refusal: i.value,
                onStatus: ee,
                onPriority: L,
                onSelect: M[5] || (M[5] = (S) => s("select", S))
              }, null, 8, ["task", "place", "refusal"]),
              N(Bb, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"])
            ]),
            comments: D(() => [
              N(Zk, {
                below: "",
                comments: F(v).comments.value,
                words: F(v).words,
                onClose: M[6] || (M[6] = (S) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: D(() => [
              N(Vk, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        N(l2, {
          send: F(v).send,
          count: F(v).comments.value.length,
          onShow: M[7] || (M[7] = (S) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", d2, [
        N(kt)
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
              ne("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, te(d.value.moves, (S) => (c(), W(vt, {
            key: S.word,
            onClick: (T) => z(S)
          }, {
            default: D(() => [
              ne(b(S.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, e8 = /* @__PURE__ */ K(v2, [["__scopeId", "data-v-a1cff4e4"]]);
function y2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Oa = { exports: {} }, Lo;
function w2() {
  return Lo || (Lo = 1, (function(e, t) {
    var n = (function() {
      var a = function(M, S) {
        var T = 236, E = 17, $ = M, A = o[S], w = null, p = 0, x = null, _ = [], B = {}, Z = function(q, H) {
          p = $ * 4 + 17, w = (function(P) {
            for (var U = new Array(P), V = 0; V < P; V += 1) {
              U[V] = new Array(P);
              for (var Q = 0; Q < P; Q += 1)
                U[V][Q] = null;
            }
            return U;
          })(p), X(0, 0), X(p - 7, 0), X(0, p - 7), ve(), ie(), Fe(q, H), $ >= 7 && Oe(q), x == null && (x = Dr($, A, _)), We(x, H);
        }, X = function(q, H) {
          for (var P = -1; P <= 7; P += 1)
            if (!(q + P <= -1 || p <= q + P))
              for (var U = -1; U <= 7; U += 1)
                H + U <= -1 || p <= H + U || (0 <= P && P <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (P == 0 || P == 6) || 2 <= P && P <= 4 && 2 <= U && U <= 4 ? w[q + P][H + U] = !0 : w[q + P][H + U] = !1);
        }, Y = function() {
          for (var q = 0, H = 0, P = 0; P < 8; P += 1) {
            Z(!0, P);
            var U = r.getLostPoint(B);
            (P == 0 || q > U) && (q = U, H = P);
          }
          return H;
        }, ie = function() {
          for (var q = 8; q < p - 8; q += 1)
            w[q][6] == null && (w[q][6] = q % 2 == 0);
          for (var H = 8; H < p - 8; H += 1)
            w[6][H] == null && (w[6][H] = H % 2 == 0);
        }, ve = function() {
          for (var q = r.getPatternPosition($), H = 0; H < q.length; H += 1)
            for (var P = 0; P < q.length; P += 1) {
              var U = q[H], V = q[P];
              if (w[U][V] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? w[U + Q][V + oe] = !0 : w[U + Q][V + oe] = !1;
            }
        }, Oe = function(q) {
          for (var H = r.getBCHTypeNumber($), P = 0; P < 18; P += 1) {
            var U = !q && (H >> P & 1) == 1;
            w[Math.floor(P / 3)][P % 3 + p - 8 - 3] = U;
          }
          for (var P = 0; P < 18; P += 1) {
            var U = !q && (H >> P & 1) == 1;
            w[P % 3 + p - 8 - 3][Math.floor(P / 3)] = U;
          }
        }, Fe = function(q, H) {
          for (var P = A << 3 | H, U = r.getBCHTypeInfo(P), V = 0; V < 15; V += 1) {
            var Q = !q && (U >> V & 1) == 1;
            V < 6 ? w[V][8] = Q : V < 8 ? w[V + 1][8] = Q : w[p - 15 + V][8] = Q;
          }
          for (var V = 0; V < 15; V += 1) {
            var Q = !q && (U >> V & 1) == 1;
            V < 8 ? w[8][p - V - 1] = Q : V < 9 ? w[8][15 - V - 1 + 1] = Q : w[8][15 - V - 1] = Q;
          }
          w[p - 8][8] = !q;
        }, We = function(q, H) {
          for (var P = -1, U = p - 1, V = 7, Q = 0, oe = r.getMaskFunction(H), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (w[U][se - ye] == null) {
                  var ke = !1;
                  Q < q.length && (ke = (q[Q] >>> V & 1) == 1);
                  var re = oe(U, se - ye);
                  re && (ke = !ke), w[U][se - ye] = ke, V -= 1, V == -1 && (Q += 1, V = 7);
                }
              if (U += P, U < 0 || p <= U) {
                U -= P, P = -P;
                break;
              }
            }
        }, Mt = function(q, H) {
          for (var P = 0, U = 0, V = 0, Q = new Array(H.length), oe = new Array(H.length), se = 0; se < H.length; se += 1) {
            var ye = H[se].dataCount, ke = H[se].totalCount - ye;
            U = Math.max(U, ye), V = Math.max(V, ke), Q[se] = new Array(ye);
            for (var re = 0; re < Q[se].length; re += 1)
              Q[se][re] = 255 & q.getBuffer()[re + P];
            P += ye;
            var Be = r.getErrorCorrectPolynomial(ke), Re = u(Q[se], Be.getLength() - 1), _s = Re.mod(Be);
            oe[se] = new Array(Be.getLength() - 1);
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
          for (var re = 0; re < V; re += 1)
            for (var se = 0; se < H.length; se += 1)
              re < oe[se].length && (ea[dn] = oe[se][re], dn += 1);
          return ea;
        }, Dr = function(q, H, P) {
          for (var U = d.getRSBlocks(q, H), V = f(), Q = 0; Q < P.length; Q += 1) {
            var oe = P[Q];
            V.put(oe.getMode(), 4), V.put(oe.getLength(), r.getLengthInBits(oe.getMode(), q)), oe.write(V);
          }
          for (var se = 0, Q = 0; Q < U.length; Q += 1)
            se += U[Q].dataCount;
          if (V.getLengthInBits() > se * 8)
            throw "code length overflow. (" + V.getLengthInBits() + ">" + se * 8 + ")";
          for (V.getLengthInBits() + 4 <= se * 8 && V.put(0, 4); V.getLengthInBits() % 8 != 0; )
            V.putBit(!1);
          for (; !(V.getLengthInBits() >= se * 8 || (V.put(T, 8), V.getLengthInBits() >= se * 8)); )
            V.put(E, 8);
          return Mt(V, U);
        };
        B.addData = function(q, H) {
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
          _.push(P), x = null;
        }, B.isDark = function(q, H) {
          if (q < 0 || p <= q || H < 0 || p <= H)
            throw q + "," + H;
          return w[q][H];
        }, B.getModuleCount = function() {
          return p;
        }, B.make = function() {
          if ($ < 1) {
            for (var q = 1; q < 40; q++) {
              for (var H = d.getRSBlocks(q, A), P = f(), U = 0; U < _.length; U++) {
                var V = _[U];
                P.put(V.getMode(), 4), P.put(V.getLength(), r.getLengthInBits(V.getMode(), q)), V.write(P);
              }
              for (var Q = 0, U = 0; U < H.length; U++)
                Q += H[U].dataCount;
              if (P.getLengthInBits() <= Q * 8)
                break;
            }
            $ = q;
          }
          Z(!1, Y());
        }, B.createTableTag = function(q, H) {
          q = q || 2, H = typeof H > "u" ? q * 4 : H;
          var P = "";
          P += '<table style="', P += " border-width: 0px; border-style: none;", P += " border-collapse: collapse;", P += " padding: 0px; margin: " + H + "px;", P += '">', P += "<tbody>";
          for (var U = 0; U < B.getModuleCount(); U += 1) {
            P += "<tr>";
            for (var V = 0; V < B.getModuleCount(); V += 1)
              P += '<td style="', P += " border-width: 0px; border-style: none;", P += " border-collapse: collapse;", P += " padding: 0px; margin: 0px;", P += " width: " + q + "px;", P += " height: " + q + "px;", P += " background-color: ", P += B.isDark(U, V) ? "#000000" : "#ffffff", P += ";", P += '"/>';
            P += "</tr>";
          }
          return P += "</tbody>", P += "</table>", P;
        }, B.createSvgTag = function(q, H, P, U) {
          var V = {};
          typeof arguments[0] == "object" && (V = arguments[0], q = V.cellSize, H = V.margin, P = V.alt, U = V.title), q = q || 2, H = typeof H > "u" ? q * 4 : H, P = typeof P == "string" ? { text: P } : P || {}, P.text = P.text || null, P.id = P.text ? P.id || "qrcode-description" : null, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-title" : null;
          var Q = B.getModuleCount() * q + H * 2, oe, se, ye, ke, re = "", Be;
          for (Be = "l" + q + ",0 0," + q + " -" + q + ",0 0,-" + q + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += V.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', re += ' viewBox="0 0 ' + Q + " " + Q + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += U.text || P.text ? ' role="img" aria-labelledby="' + St([U.id, P.id].join(" ").trim()) + '"' : "", re += ">", re += U.text ? '<title id="' + St(U.id) + '">' + St(U.text) + "</title>" : "", re += P.text ? '<description id="' + St(P.id) + '">' + St(P.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', ye = 0; ye < B.getModuleCount(); ye += 1)
            for (ke = ye * q + H, oe = 0; oe < B.getModuleCount(); oe += 1)
              B.isDark(ye, oe) && (se = oe * q + H, re += "M" + se + "," + ke + Be);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, B.createDataURL = function(q, H) {
          q = q || 2, H = typeof H > "u" ? q * 4 : H;
          var P = B.getModuleCount() * q + H * 2, U = H, V = P - H;
          return j(P, P, function(Q, oe) {
            if (U <= Q && Q < V && U <= oe && oe < V) {
              var se = Math.floor((Q - U) / q), ye = Math.floor((oe - U) / q);
              return B.isDark(ye, se) ? 0 : 1;
            } else
              return 1;
          });
        }, B.createImgTag = function(q, H, P) {
          q = q || 2, H = typeof H > "u" ? q * 4 : H;
          var U = B.getModuleCount() * q + H * 2, V = "";
          return V += "<img", V += ' src="', V += B.createDataURL(q, H), V += '"', V += ' width="', V += U, V += '"', V += ' height="', V += U, V += '"', P && (V += ' alt="', V += St(P), V += '"'), V += "/>", V;
        };
        var St = function(q) {
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
        }, Pr = function(q) {
          var H = 1;
          q = typeof q > "u" ? H * 2 : q;
          var P = B.getModuleCount() * H + q * 2, U = q, V = P - q, Q, oe, se, ye, ke, re = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Be = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Re = "";
          for (Q = 0; Q < P; Q += 2) {
            for (se = Math.floor((Q - U) / H), ye = Math.floor((Q + 1 - U) / H), oe = 0; oe < P; oe += 1)
              ke = "█", U <= oe && oe < V && U <= Q && Q < V && B.isDark(se, Math.floor((oe - U) / H)) && (ke = " "), U <= oe && oe < V && U <= Q + 1 && Q + 1 < V && B.isDark(ye, Math.floor((oe - U) / H)) ? ke += " " : ke += "█", Re += q < 1 && Q + 1 >= V ? Be[ke] : re[ke];
            Re += `
`;
          }
          return P % 2 && q > 0 ? Re.substring(0, Re.length - P - 1) + Array(P + 1).join("▀") : Re.substring(0, Re.length - 1);
        };
        return B.createASCII = function(q, H) {
          if (q = q || 1, q < 2)
            return Pr(H);
          q -= 1, H = typeof H > "u" ? q * 2 : H;
          var P = B.getModuleCount() * q + H * 2, U = H, V = P - H, Q, oe, se, ye, ke = Array(q + 1).join("██"), re = Array(q + 1).join("  "), Be = "", Re = "";
          for (Q = 0; Q < P; Q += 1) {
            for (se = Math.floor((Q - U) / q), Re = "", oe = 0; oe < P; oe += 1)
              ye = 1, U <= oe && oe < V && U <= Q && Q < V && B.isDark(se, Math.floor((oe - U) / q)) && (ye = 0), Re += ye ? ke : re;
            for (se = 0; se < q; se += 1)
              Be += Re + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, B.renderTo2dContext = function(q, H) {
          H = H || 2;
          for (var P = B.getModuleCount(), U = 0; U < P; U++)
            for (var V = 0; V < P; V++)
              q.fillStyle = B.isDark(U, V) ? "black" : "white", q.fillRect(U * H, V * H, H, H);
        }, B;
      };
      a.stringToBytesFuncs = {
        default: function(M) {
          for (var S = [], T = 0; T < M.length; T += 1) {
            var E = M.charCodeAt(T);
            S.push(E & 255);
          }
          return S;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(M, S) {
        var T = (function() {
          for (var $ = z(M), A = function() {
            var ie = $.read();
            if (ie == -1) throw "eof";
            return ie;
          }, w = 0, p = {}; ; ) {
            var x = $.read();
            if (x == -1) break;
            var _ = A(), B = A(), Z = A(), X = String.fromCharCode(x << 8 | _), Y = B << 8 | Z;
            p[X] = Y, w += 1;
          }
          if (w != S)
            throw w + " != " + S;
          return p;
        })(), E = 63;
        return function($) {
          for (var A = [], w = 0; w < $.length; w += 1) {
            var p = $.charCodeAt(w);
            if (p < 128)
              A.push(p);
            else {
              var x = T[$.charAt(w)];
              typeof x == "number" ? (x & 255) == x ? A.push(x) : (A.push(x >>> 8), A.push(x & 255)) : A.push(E);
            }
          }
          return A;
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
        ], S = 1335, T = 7973, E = 21522, $ = {}, A = function(w) {
          for (var p = 0; w != 0; )
            p += 1, w >>>= 1;
          return p;
        };
        return $.getBCHTypeInfo = function(w) {
          for (var p = w << 10; A(p) - A(S) >= 0; )
            p ^= S << A(p) - A(S);
          return (w << 10 | p) ^ E;
        }, $.getBCHTypeNumber = function(w) {
          for (var p = w << 12; A(p) - A(T) >= 0; )
            p ^= T << A(p) - A(T);
          return w << 12 | p;
        }, $.getPatternPosition = function(w) {
          return M[w - 1];
        }, $.getMaskFunction = function(w) {
          switch (w) {
            case l.PATTERN000:
              return function(p, x) {
                return (p + x) % 2 == 0;
              };
            case l.PATTERN001:
              return function(p, x) {
                return p % 2 == 0;
              };
            case l.PATTERN010:
              return function(p, x) {
                return x % 3 == 0;
              };
            case l.PATTERN011:
              return function(p, x) {
                return (p + x) % 3 == 0;
              };
            case l.PATTERN100:
              return function(p, x) {
                return (Math.floor(p / 2) + Math.floor(x / 3)) % 2 == 0;
              };
            case l.PATTERN101:
              return function(p, x) {
                return p * x % 2 + p * x % 3 == 0;
              };
            case l.PATTERN110:
              return function(p, x) {
                return (p * x % 2 + p * x % 3) % 2 == 0;
              };
            case l.PATTERN111:
              return function(p, x) {
                return (p * x % 3 + (p + x) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, $.getErrorCorrectPolynomial = function(w) {
          for (var p = u([1], 0), x = 0; x < w; x += 1)
            p = p.multiply(u([1, i.gexp(x)], 0));
          return p;
        }, $.getLengthInBits = function(w, p) {
          if (1 <= p && p < 10)
            switch (w) {
              case s.MODE_NUMBER:
                return 10;
              case s.MODE_ALPHA_NUM:
                return 9;
              case s.MODE_8BIT_BYTE:
                return 8;
              case s.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + w;
            }
          else if (p < 27)
            switch (w) {
              case s.MODE_NUMBER:
                return 12;
              case s.MODE_ALPHA_NUM:
                return 11;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + w;
            }
          else if (p < 41)
            switch (w) {
              case s.MODE_NUMBER:
                return 14;
              case s.MODE_ALPHA_NUM:
                return 13;
              case s.MODE_8BIT_BYTE:
                return 16;
              case s.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + w;
            }
          else
            throw "type:" + p;
        }, $.getLostPoint = function(w) {
          for (var p = w.getModuleCount(), x = 0, _ = 0; _ < p; _ += 1)
            for (var B = 0; B < p; B += 1) {
              for (var Z = 0, X = w.isDark(_, B), Y = -1; Y <= 1; Y += 1)
                if (!(_ + Y < 0 || p <= _ + Y))
                  for (var ie = -1; ie <= 1; ie += 1)
                    B + ie < 0 || p <= B + ie || Y == 0 && ie == 0 || X == w.isDark(_ + Y, B + ie) && (Z += 1);
              Z > 5 && (x += 3 + Z - 5);
            }
          for (var _ = 0; _ < p - 1; _ += 1)
            for (var B = 0; B < p - 1; B += 1) {
              var ve = 0;
              w.isDark(_, B) && (ve += 1), w.isDark(_ + 1, B) && (ve += 1), w.isDark(_, B + 1) && (ve += 1), w.isDark(_ + 1, B + 1) && (ve += 1), (ve == 0 || ve == 4) && (x += 3);
            }
          for (var _ = 0; _ < p; _ += 1)
            for (var B = 0; B < p - 6; B += 1)
              w.isDark(_, B) && !w.isDark(_, B + 1) && w.isDark(_, B + 2) && w.isDark(_, B + 3) && w.isDark(_, B + 4) && !w.isDark(_, B + 5) && w.isDark(_, B + 6) && (x += 40);
          for (var B = 0; B < p; B += 1)
            for (var _ = 0; _ < p - 6; _ += 1)
              w.isDark(_, B) && !w.isDark(_ + 1, B) && w.isDark(_ + 2, B) && w.isDark(_ + 3, B) && w.isDark(_ + 4, B) && !w.isDark(_ + 5, B) && w.isDark(_ + 6, B) && (x += 40);
          for (var Oe = 0, B = 0; B < p; B += 1)
            for (var _ = 0; _ < p; _ += 1)
              w.isDark(_, B) && (Oe += 1);
          var Fe = Math.abs(100 * Oe / p / p - 50) / 5;
          return x += Fe * 10, x;
        }, $;
      })(), i = (function() {
        for (var M = new Array(256), S = new Array(256), T = 0; T < 8; T += 1)
          M[T] = 1 << T;
        for (var T = 8; T < 256; T += 1)
          M[T] = M[T - 4] ^ M[T - 5] ^ M[T - 6] ^ M[T - 8];
        for (var T = 0; T < 255; T += 1)
          S[M[T]] = T;
        var E = {};
        return E.glog = function($) {
          if ($ < 1)
            throw "glog(" + $ + ")";
          return S[$];
        }, E.gexp = function($) {
          for (; $ < 0; )
            $ += 255;
          for (; $ >= 256; )
            $ -= 255;
          return M[$];
        }, E;
      })();
      function u(M, S) {
        if (typeof M.length > "u")
          throw M.length + "/" + S;
        var T = (function() {
          for (var $ = 0; $ < M.length && M[$] == 0; )
            $ += 1;
          for (var A = new Array(M.length - $ + S), w = 0; w < M.length - $; w += 1)
            A[w] = M[w + $];
          return A;
        })(), E = {};
        return E.getAt = function($) {
          return T[$];
        }, E.getLength = function() {
          return T.length;
        }, E.multiply = function($) {
          for (var A = new Array(E.getLength() + $.getLength() - 1), w = 0; w < E.getLength(); w += 1)
            for (var p = 0; p < $.getLength(); p += 1)
              A[w + p] ^= i.gexp(i.glog(E.getAt(w)) + i.glog($.getAt(p)));
          return u(A, 0);
        }, E.mod = function($) {
          if (E.getLength() - $.getLength() < 0)
            return E;
          for (var A = i.glog(E.getAt(0)) - i.glog($.getAt(0)), w = new Array(E.getLength()), p = 0; p < E.getLength(); p += 1)
            w[p] = E.getAt(p);
          for (var p = 0; p < $.getLength(); p += 1)
            w[p] ^= i.gexp(i.glog($.getAt(p)) + A);
          return u(w, 0).mod($);
        }, E;
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
        ], S = function($, A) {
          var w = {};
          return w.totalCount = $, w.dataCount = A, w;
        }, T = {}, E = function($, A) {
          switch (A) {
            case o.L:
              return M[($ - 1) * 4 + 0];
            case o.M:
              return M[($ - 1) * 4 + 1];
            case o.Q:
              return M[($ - 1) * 4 + 2];
            case o.H:
              return M[($ - 1) * 4 + 3];
            default:
              return;
          }
        };
        return T.getRSBlocks = function($, A) {
          var w = E($, A);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + $ + "/errorCorrectionLevel:" + A;
          for (var p = w.length / 3, x = [], _ = 0; _ < p; _ += 1)
            for (var B = w[_ * 3 + 0], Z = w[_ * 3 + 1], X = w[_ * 3 + 2], Y = 0; Y < B; Y += 1)
              x.push(S(Z, X));
          return x;
        }, T;
      })(), f = function() {
        var M = [], S = 0, T = {};
        return T.getBuffer = function() {
          return M;
        }, T.getAt = function(E) {
          var $ = Math.floor(E / 8);
          return (M[$] >>> 7 - E % 8 & 1) == 1;
        }, T.put = function(E, $) {
          for (var A = 0; A < $; A += 1)
            T.putBit((E >>> $ - A - 1 & 1) == 1);
        }, T.getLengthInBits = function() {
          return S;
        }, T.putBit = function(E) {
          var $ = Math.floor(S / 8);
          M.length <= $ && M.push(0), E && (M[$] |= 128 >>> S % 8), S += 1;
        }, T;
      }, m = function(M) {
        var S = s.MODE_NUMBER, T = M, E = {};
        E.getMode = function() {
          return S;
        }, E.getLength = function(w) {
          return T.length;
        }, E.write = function(w) {
          for (var p = T, x = 0; x + 2 < p.length; )
            w.put($(p.substring(x, x + 3)), 10), x += 3;
          x < p.length && (p.length - x == 1 ? w.put($(p.substring(x, x + 1)), 4) : p.length - x == 2 && w.put($(p.substring(x, x + 2)), 7));
        };
        var $ = function(w) {
          for (var p = 0, x = 0; x < w.length; x += 1)
            p = p * 10 + A(w.charAt(x));
          return p;
        }, A = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return E;
      }, v = function(M) {
        var S = s.MODE_ALPHA_NUM, T = M, E = {};
        E.getMode = function() {
          return S;
        }, E.getLength = function(A) {
          return T.length;
        }, E.write = function(A) {
          for (var w = T, p = 0; p + 1 < w.length; )
            A.put(
              $(w.charAt(p)) * 45 + $(w.charAt(p + 1)),
              11
            ), p += 2;
          p < w.length && A.put($(w.charAt(p)), 6);
        };
        var $ = function(A) {
          if ("0" <= A && A <= "9")
            return A.charCodeAt(0) - 48;
          if ("A" <= A && A <= "Z")
            return A.charCodeAt(0) - 65 + 10;
          switch (A) {
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
              throw "illegal char :" + A;
          }
        };
        return E;
      }, y = function(M) {
        var S = s.MODE_8BIT_BYTE, T = a.stringToBytes(M), E = {};
        return E.getMode = function() {
          return S;
        }, E.getLength = function($) {
          return T.length;
        }, E.write = function($) {
          for (var A = 0; A < T.length; A += 1)
            $.put(T[A], 8);
        }, E;
      }, O = function(M) {
        var S = s.MODE_KANJI, T = a.stringToBytesFuncs.SJIS;
        if (!T)
          throw "sjis not supported.";
        (function(A, w) {
          var p = T(A);
          if (p.length != 2 || (p[0] << 8 | p[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var E = T(M), $ = {};
        return $.getMode = function() {
          return S;
        }, $.getLength = function(A) {
          return ~~(E.length / 2);
        }, $.write = function(A) {
          for (var w = E, p = 0; p + 1 < w.length; ) {
            var x = (255 & w[p]) << 8 | 255 & w[p + 1];
            if (33088 <= x && x <= 40956)
              x -= 33088;
            else if (57408 <= x && x <= 60351)
              x -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + x;
            x = (x >>> 8 & 255) * 192 + (x & 255), A.put(x, 13), p += 2;
          }
          if (p < w.length)
            throw "illegal char at " + (p + 1);
        }, $;
      }, k = function() {
        var M = [], S = {};
        return S.writeByte = function(T) {
          M.push(T & 255);
        }, S.writeShort = function(T) {
          S.writeByte(T), S.writeByte(T >>> 8);
        }, S.writeBytes = function(T, E, $) {
          E = E || 0, $ = $ || T.length;
          for (var A = 0; A < $; A += 1)
            S.writeByte(T[A + E]);
        }, S.writeString = function(T) {
          for (var E = 0; E < T.length; E += 1)
            S.writeByte(T.charCodeAt(E));
        }, S.toByteArray = function() {
          return M;
        }, S.toString = function() {
          var T = "";
          T += "[";
          for (var E = 0; E < M.length; E += 1)
            E > 0 && (T += ","), T += M[E];
          return T += "]", T;
        }, S;
      }, L = function() {
        var M = 0, S = 0, T = 0, E = "", $ = {}, A = function(p) {
          E += String.fromCharCode(w(p & 63));
        }, w = function(p) {
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
        return $.writeByte = function(p) {
          for (M = M << 8 | p & 255, S += 8, T += 1; S >= 6; )
            A(M >>> S - 6), S -= 6;
        }, $.flush = function() {
          if (S > 0 && (A(M << 6 - S), M = 0, S = 0), T % 3 != 0)
            for (var p = 3 - T % 3, x = 0; x < p; x += 1)
              E += "=";
        }, $.toString = function() {
          return E;
        }, $;
      }, z = function(M) {
        var S = M, T = 0, E = 0, $ = 0, A = {};
        A.read = function() {
          for (; $ < 8; ) {
            if (T >= S.length) {
              if ($ == 0)
                return -1;
              throw "unexpected end of file./" + $;
            }
            var p = S.charAt(T);
            if (T += 1, p == "=")
              return $ = 0, -1;
            if (p.match(/^\s$/))
              continue;
            E = E << 6 | w(p.charCodeAt(0)), $ += 6;
          }
          var x = E >>> $ - 8 & 255;
          return $ -= 8, x;
        };
        var w = function(p) {
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
        return A;
      }, ee = function(M, S) {
        var T = M, E = S, $ = new Array(M * S), A = {};
        A.setPixel = function(_, B, Z) {
          $[B * T + _] = Z;
        }, A.write = function(_) {
          _.writeString("GIF87a"), _.writeShort(T), _.writeShort(E), _.writeByte(128), _.writeByte(0), _.writeByte(0), _.writeByte(0), _.writeByte(0), _.writeByte(0), _.writeByte(255), _.writeByte(255), _.writeByte(255), _.writeString(","), _.writeShort(0), _.writeShort(0), _.writeShort(T), _.writeShort(E), _.writeByte(0);
          var B = 2, Z = p(B);
          _.writeByte(B);
          for (var X = 0; Z.length - X > 255; )
            _.writeByte(255), _.writeBytes(Z, X, 255), X += 255;
          _.writeByte(Z.length - X), _.writeBytes(Z, X, Z.length - X), _.writeByte(0), _.writeString(";");
        };
        var w = function(_) {
          var B = _, Z = 0, X = 0, Y = {};
          return Y.write = function(ie, ve) {
            if (ie >>> ve)
              throw "length over";
            for (; Z + ve >= 8; )
              B.writeByte(255 & (ie << Z | X)), ve -= 8 - Z, ie >>>= 8 - Z, X = 0, Z = 0;
            X = ie << Z | X, Z = Z + ve;
          }, Y.flush = function() {
            Z > 0 && B.writeByte(X);
          }, Y;
        }, p = function(_) {
          for (var B = 1 << _, Z = (1 << _) + 1, X = _ + 1, Y = x(), ie = 0; ie < B; ie += 1)
            Y.add(String.fromCharCode(ie));
          Y.add(String.fromCharCode(B)), Y.add(String.fromCharCode(Z));
          var ve = k(), Oe = w(ve);
          Oe.write(B, X);
          var Fe = 0, We = String.fromCharCode($[Fe]);
          for (Fe += 1; Fe < $.length; ) {
            var Mt = String.fromCharCode($[Fe]);
            Fe += 1, Y.contains(We + Mt) ? We = We + Mt : (Oe.write(Y.indexOf(We), X), Y.size() < 4095 && (Y.size() == 1 << X && (X += 1), Y.add(We + Mt)), We = Mt);
          }
          return Oe.write(Y.indexOf(We), X), Oe.write(Z, X), Oe.flush(), ve.toByteArray();
        }, x = function() {
          var _ = {}, B = 0, Z = {};
          return Z.add = function(X) {
            if (Z.contains(X))
              throw "dup key:" + X;
            _[X] = B, B += 1;
          }, Z.size = function() {
            return B;
          }, Z.indexOf = function(X) {
            return _[X];
          }, Z.contains = function(X) {
            return typeof _[X] < "u";
          }, Z;
        };
        return A;
      }, j = function(M, S, T) {
        for (var E = ee(M, S), $ = 0; $ < S; $ += 1)
          for (var A = 0; A < M; A += 1)
            E.setPixel(A, $, T(A, $));
        var w = k();
        E.write(w);
        for (var p = L(), x = w.toByteArray(), _ = 0; _ < x.length; _ += 1)
          p.writeByte(x[_]);
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
var b2 = w2();
const k2 = /* @__PURE__ */ y2(b2), x2 = ["width", "height", "viewBox"], $2 = ["width", "height"], M2 = ["d"], S2 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const a = k2(0, "M");
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
      }, null, 8, $2),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, M2)
    ], 8, x2));
  }
}, t8 = /* @__PURE__ */ K(S2, [["__scopeId", "data-v-489f0852"]]), _2 = {
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
}, n8 = /* @__PURE__ */ K(_2, [["__scopeId", "data-v-47e67f04"]]);
function a8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const s8 = Jr(() => import("./VoiceFigure-bi05DSLJ.js").then((e) => e.V)), o8 = "1.2.0", l8 = "3.5";
export {
  Pu as $,
  xe as A,
  _e as B,
  Yn as C,
  Je as D,
  dx as E,
  Iy as F,
  t4 as G,
  rx as H,
  my as I,
  Fy as J,
  $t as K,
  C2 as L,
  bs as M,
  Gy as N,
  qy as O,
  Kn as P,
  E4 as Q,
  I5 as R,
  An as S,
  B4 as T,
  _5 as U,
  Me as V,
  Nn as W,
  S5 as X,
  M5 as Y,
  Du as Z,
  K as _,
  g5 as a,
  Y4 as a$,
  zy as a0,
  L5 as a1,
  N5 as a2,
  Se as a3,
  G5 as a4,
  V5 as a5,
  yt as a6,
  D5 as a7,
  o4 as a8,
  o5 as a9,
  F4 as aA,
  M4 as aB,
  ay as aC,
  c4 as aD,
  u4 as aE,
  fx as aF,
  yr as aG,
  T4 as aH,
  ln as aI,
  d5 as aJ,
  i5 as aK,
  tx as aL,
  rn as aM,
  ox as aN,
  e4 as aO,
  S4 as aP,
  _4 as aQ,
  $4 as aR,
  Qt as aS,
  pt as aT,
  l5 as aU,
  G0 as aV,
  k4 as aW,
  B5 as aX,
  gr as aY,
  It as aZ,
  Pt as a_,
  Z4 as aa,
  ax as ab,
  m5 as ac,
  E5 as ad,
  A5 as ae,
  U5 as af,
  z5 as ag,
  K5 as ah,
  b5 as ai,
  Eo as aj,
  P5 as ak,
  s4 as al,
  gx as am,
  v4 as an,
  p4 as ao,
  m4 as ap,
  Y5 as aq,
  W5 as ar,
  F5 as as,
  H5 as at,
  O4 as au,
  a4 as av,
  l4 as aw,
  wx as ax,
  zt as ay,
  r4 as az,
  sw as b,
  yx as b$,
  Oy as b0,
  sx as b1,
  L4 as b2,
  I4 as b3,
  vv as b4,
  ar as b5,
  V4 as b6,
  n4 as b7,
  Xn as b8,
  nt as b9,
  D4 as bA,
  H4 as bB,
  ot as bC,
  R4 as bD,
  U4 as bE,
  i4 as bF,
  y4 as bG,
  d4 as bH,
  Ee as bI,
  Q5 as bJ,
  z4 as bK,
  Ex as bL,
  Ax as bM,
  a5 as bN,
  Z0 as bO,
  J5 as bP,
  P4 as bQ,
  v5 as bR,
  px as bS,
  N4 as bT,
  j4 as bU,
  q4 as bV,
  Z5 as bW,
  sy as bX,
  X5 as bY,
  h4 as bZ,
  mx as b_,
  W4 as ba,
  ya as bb,
  Ol as bc,
  kx as bd,
  Mx as be,
  C4 as bf,
  ex as bg,
  s5 as bh,
  g4 as bi,
  xx as bj,
  j5 as bk,
  q5 as bl,
  x5 as bm,
  R5 as bn,
  u5 as bo,
  X4 as bp,
  y5 as bq,
  w5 as br,
  $5 as bs,
  b4 as bt,
  W0 as bu,
  lx as bv,
  jy as bw,
  k5 as bx,
  f5 as by,
  w4 as bz,
  gv as c,
  ct as c$,
  c5 as c0,
  r5 as c1,
  f4 as c2,
  Sx as c3,
  Ss as c4,
  _x as c5,
  Rr as c6,
  Q4 as c7,
  O5 as c8,
  C5 as c9,
  Hx as cA,
  D2 as cB,
  o8 as cC,
  l8 as cD,
  z2 as cE,
  zx as cF,
  Va as cG,
  X2 as cH,
  _g as cI,
  vt as cJ,
  es as cK,
  Un as cL,
  q2 as cM,
  V2 as cN,
  yi as cO,
  Hp as cP,
  Xx as cQ,
  W2 as cR,
  t8 as cS,
  qx as cT,
  Ju as cU,
  R2 as cV,
  e5 as cW,
  tb as cX,
  zn as cY,
  G2 as cZ,
  kt as c_,
  V0 as ca,
  h5 as cb,
  Dy as cc,
  x4 as cd,
  vs as ce,
  Xv as cf,
  A4 as cg,
  Vt as ch,
  Tt as ci,
  P2 as cj,
  Wx as ck,
  ue as cl,
  ku as cm,
  Au as cn,
  is as co,
  Ch as cp,
  cl as cq,
  Qx as cr,
  n5 as cs,
  Um as ct,
  Yt as cu,
  Cx as cv,
  A2 as cw,
  Rt as cx,
  Jc as cy,
  me as cz,
  je as d,
  ub as d$,
  ym as d0,
  Ti as d1,
  Z2 as d2,
  I2 as d3,
  Nt as d4,
  Ux as d5,
  e8 as d6,
  Nr as d7,
  Qc as d8,
  at as d9,
  bg as dA,
  $w as dB,
  L2 as dC,
  U2 as dD,
  Ix as dE,
  Nx as dF,
  Pe as dG,
  j2 as dH,
  F2 as dI,
  Rx as dJ,
  ep as dK,
  B2 as dL,
  O2 as dM,
  Qo as dN,
  el as dO,
  Cc as dP,
  N2 as dQ,
  Ge as dR,
  a8 as dS,
  Mw as dT,
  Y2 as dU,
  Bx as dV,
  Fx as dW,
  kw as dX,
  Vx as dY,
  _p as dZ,
  Wo as d_,
  K2 as da,
  Qn as db,
  s8 as dc,
  n8 as dd,
  ms as de,
  Lx as df,
  os as dg,
  R1 as dh,
  no as di,
  jl as dj,
  Ec as dk,
  Zx as dl,
  Yx as dm,
  ls as dn,
  _c as dp,
  H2 as dq,
  Jx as dr,
  t5 as ds,
  Q2 as dt,
  J2 as du,
  Tx as dv,
  bf as dw,
  Ox as dx,
  T2 as dy,
  Gx as dz,
  T5 as e,
  Ip as e0,
  Dx as e1,
  za as e2,
  Px as e3,
  jx as e4,
  it as e5,
  Kx as e6,
  Ac as e7,
  F0 as f,
  bx as g,
  en as h,
  ix as i,
  $x as j,
  cx as k,
  J4 as l,
  cw as m,
  ks as n,
  nx as o,
  p5 as p,
  ux as q,
  Tr as r,
  Br as s,
  Le as t,
  wv as u,
  G4 as v,
  vx as w,
  K4 as x,
  un as y,
  hx as z
};
