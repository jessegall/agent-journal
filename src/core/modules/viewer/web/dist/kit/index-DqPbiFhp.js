/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as J, Fragment as K, renderList as ee, normalizeStyle as me, defineComponent as al, Comment as ol, h as ma, cloneVNode as rl, createBlock as V, withCtx as P, unref as U, createVNode as R, toDisplayString as b, createCommentVNode as A, inject as _e, useAttrs as Kn, computed as B, ref as T, resolveDynamicComponent as _t, mergeProps as nt, onUnmounted as Te, onMounted as Ne, Teleport as pa, useId as ga, resolveDirective as il, withDirectives as st, createTextVNode as se, reactive as va, shallowRef as ut, watch as pe, nextTick as pt, Transition as jt, withModifiers as be, TransitionGroup as Zo, isRef as za, onBeforeUnmount as qt, resolveComponent as ll, useModel as js, getCurrentInstance as cl, mergeModels as qs, getCurrentScope as Xo, onScopeDispose as Qo, provide as ul, onErrorCaptured as dl, toHandlers as fl, createSlots as hl, vShow as er, useSlots as ml, withKeys as tn, vModelText as Fs, defineAsyncComponent as pl } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, gl = { class: "skeleton-line" }, vl = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", gl, [
      ce(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(K, null, ee(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: me({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, gt = /* @__PURE__ */ Y(vl, [["__scopeId", "data-v-0ebb6933"]]), Ft = al({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== ol);
      return s.length !== 1 ? ma(K, { key: n }, s) : s[0].key == null ? rl(s[0], { key: n }) : s[0];
    };
  }
}), yl = ["aria-label"], kl = ["aria-label"], wl = ["aria-label"], bl = ["aria-label"], xl = ["aria-label"], $l = ["aria-label"], Ml = ["aria-label"], Sl = {
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
    ], r = ["94%", "88%", "91%", "62%"].map((l) => ({ width: l, height: 10 })), i = [
      { width: "110px", height: 12 },
      { width: "86%", height: 24 },
      { width: "52%", height: 24 }
    ];
    return (l, u) => (c(), V(Ft, { value: e.shape }, {
      messages: P(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(K, null, ee(t, (d) => g("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: me({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, yl)
      ]),
      older: P(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: me({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, kl)
      ]),
      cards: P(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(K, null, ee(n, (f) => R(gt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, wl)
      ]),
      file: P(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            R(gt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(K, null, ee(a, (f) => R(gt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, bl)
      ]),
      page: P(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          R(gt, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(K, null, ee(e.count, (d) => (c(), V(gt, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, xl)
      ]),
      text: P(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (d) => (c(), V(gt, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, $l)
      ]),
      default: P(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (d) => (c(), V(gt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Ml)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ Y(Sl, [["__scopeId", "data-v-1392eacb"]]), _l = {
  key: 1,
  class: "empty-state titled"
}, El = { class: "empty-state-title" }, Al = { class: "empty-state-text" }, Cl = {
  key: 2,
  class: "empty-state"
}, Ol = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), V(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", _l, [
      g("p", El, b(e.title), 1),
      g("p", Al, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Cl, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, jn = /* @__PURE__ */ Y(Ol, [["__scopeId", "data-v-b27e89b0"]]), Tl = { class: "fold-group" }, Il = ["aria-expanded"], Rl = { class: "fold-label" }, Bl = {
  key: 0,
  class: "fold-count"
}, Ll = {
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
    return (s, a) => (c(), h("div", Tl, [
      g("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        g("span", Rl, b(e.label), 1),
        e.count !== "" ? (c(), h("span", Bl, b(e.count), 1)) : A("", !0),
        g("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Il),
      e.open ? ce(s.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, n5 = /* @__PURE__ */ Y(Ll, [["__scopeId", "data-v-9ef1865c"]]), Nl = Symbol("open-view"), Ae = Symbol.for("journal.window-context");
function Wt() {
  const e = _e(Ae, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Dl = ["stroke-width", "innerHTML"], ve = {
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
      style: me({
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
    }, null, 12, Dl));
  }
}, Pl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: me({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, jl = /* @__PURE__ */ Y(Pl, [["__scopeId", "data-v-eb453d6f"]]), ql = 120, Fl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "Btn",
  props: {
    kind: { type: String, default: "ghost" },
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
    const t = e, n = Kn(), s = B(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = T(!1), o = B(() => t.busy || a.value), r = _e(Ae, null), i = B(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(u)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => a.value = !0, ql);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), a.value = !1;
      }
    }
    return (u, d) => (c(), V(_t(e.href ? "a" : "button"), nt(s.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: l
    }), {
      default: P(() => [
        g("span", {
          class: J(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), V(ve, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ce(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), V(jl, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), he = /* @__PURE__ */ Y(Fl, [["__scopeId", "data-v-033d70ca"]]), Wl = (e, t, n) => Math.max(t, Math.min(n, e)), Hl = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, tr = /* @__PURE__ */ new WeakMap(), Ul = (e, t) => tr.set(e, t);
function zl(e, t) {
  for (let n = t; n; n = tr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function nr(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !zl(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const It = 8, Vl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = T(null), o = (m) => m ? `${m}px` : void 0, r = B(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = T({ w: 0, h: 0 }), l = T(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), f = (m) => {
      const L = m.closest(".pane, .float-window");
      return L ? d(L.getBoundingClientRect()) : u();
    }, p = (m, L) => `${Math.max(0, m ? Math.min(m, L) : L)}px`;
    function y(m, L) {
      return {
        below: m.bottom - L.bottom - s.gap - It,
        above: L.top - m.top - s.gap - It,
        across: m.right - m.left - 2 * It
      };
    }
    function k(m) {
      const L = f(s.anchor), j = y(L, m);
      return i.value.w <= j.across && i.value.h <= Math.max(j.below, j.above) ? L : u();
    }
    const $ = B(() => {
      if (!l.value) return r.value;
      const m = l.value, L = k(m), j = y(L, m), { w: D, h: X } = i.value, G = s.align === "auto" ? m.left + m.right > L.left + L.right : s.align === "right", ue = Wl(G ? m.right - D : m.left, L.left + It, Math.max(L.left + It, L.right - D - It)), ke = X > j.below && j.above > j.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: p(s.maxHeight, j.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: p(s.maxHeight, j.below) };
      return { ...r.value, ...ke, left: `${ue}px`, maxWidth: p(s.maxWidth, j.across) };
    }), S = n, C = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function F(m) {
      const L = C(), j = L.indexOf(document.activeElement);
      L[(j + m + L.length) % L.length].focus();
    }
    const Z = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => S("close") }, _ = (m) => Z[m.key] && (m.preventDefault(), Z[m.key]()), v = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let O = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(O), O = requestAnimationFrame(v);
    });
    nr(a, (m) => s.anchor && !s.anchor.contains(m.target) && S("close"));
    const I = (m, L) => ["top", "left", "right", "bottom"].some((j) => Math.abs(m[j] - L[j]) > 1), x = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let E = 0;
    function M() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(m)) return S("close");
        I(m, l.value) && (l.value = m);
      }
      E = requestAnimationFrame(M);
    }
    return Ne(() => {
      s.anchor && a.value && Ul(a.value, s.anchor), v(), a.value && w.observe(a.value), !s.plain && C()[0] && C()[0].focus(), M();
    }), Te(() => {
      w.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(O);
    }), t({ element: a }), (m, L) => (c(), V(pa, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", nt({
        ref_key: "panel",
        ref: a
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: $.value,
        onKeydown: _
      }), [
        ce(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Yn = /* @__PURE__ */ Y(Vl, [["__scopeId", "data-v-3d203970"]]), Gl = { class: "split-button" }, Kl = {
  __name: "SplitButton",
  props: { kind: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, s = T(null), a = T(!1), o = () => a.value = !1;
    return (r, i) => (c(), h("span", Gl, [
      R(he, {
        kind: e.kind,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (l) => n("main"))
      }, {
        default: P(() => [
          ce(r.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["kind", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: s,
        class: "split-button-arrow-place"
      }, [
        R(he, {
          kind: e.kind,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": a.value,
          onClick: i[1] || (i[1] = (l) => a.value = !a.value)
        }, {
          default: P(() => [
            R(ve, { name: "caret" })
          ]),
          _: 1
        }, 8, ["kind", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      a.value ? (c(), V(Yn, {
        key: 0,
        anchor: s.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          ce(r.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : A("", !0)
    ]));
  }
}, Yl = /* @__PURE__ */ Y(Kl, [["__scopeId", "data-v-ef04170d"]]), Jl = ["aria-checked", "aria-haspopup", "onClick"], Zl = {
  key: 0,
  class: "segmented-dot"
}, Xl = {
  key: 1,
  class: "segmented-count"
}, Ql = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ga();
    return (a, o) => {
      const r = il("tip");
      return c(), h("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(K, null, ee(e.options, (i) => st((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: J(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", Zl)) : A("", !0),
          se(" " + b(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", Xl, b(i.count), 1)) : A("", !0)
        ], 10, Jl)), [
          [r, i.tip || i.title, `${U(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Jn = /* @__PURE__ */ Y(Ql, [["__scopeId", "data-v-ca953072"]]), Zn = typeof document < "u" && document.documentElement.classList.contains("phone"), ec = "Files are attached on the computer; the phone sends text.";
function tc() {
  return () => {
  };
}
function Ws(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function sr(e = window) {
  if (!Ws(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ws(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Hs = "journal.stale-build-reload", nc = 'script[type="module"][src*="/assets/index-"]', Va = (e) => {
  var t;
  return ((t = e.querySelector(nc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function sc(e = document, t = fetch, n = () => sr(window)) {
  const s = Va(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = Va(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let us = "";
function ac(e, t = () => sr(window)) {
  if (!e) return !1;
  const n = !!us && us !== e;
  return us = e, n && t(), n;
}
const oc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function rc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Hs) === e.message) return !1;
    t.setItem(Hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ic(e = window.sessionStorage) {
  try {
    e.removeItem(Hs);
  } catch {
    return;
  }
}
const lc = 2e3, cc = 3e4, ze = va({ starting: !1, external: !1, late: !1, offline: !1 }), ya = () => ze.starting, uc = 3;
let $n = 0, Us = 0, ar = 0, or = [];
async function dc() {
  try {
    const e = await Le.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function fc() {
  clearInterval(Us), clearTimeout(ar), Us = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), or.splice(0).forEach((e) => e()), sc();
}
let ds = !1;
async function hc() {
  if (ze.offline = !navigator.onLine, ds) return;
  ds = !0;
  const e = await dc();
  if (ds = !1, ze.external = e.updating, $n = !e.restarting && !e.updating && e.reachable ? $n + 1 : 0, $n < uc) return;
  $n = 0, (!ac(e.started_at) || Ws()) && fc();
}
function Ga() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, Us = setInterval(hc, lc), ar = setTimeout(() => ze.late = !0, cc));
}
const mc = () => ze.starting ? new Promise((e) => or.push(e)) : Promise.resolve(), Ka = 2e4, pc = 3e5, Ye = 6e5, Mn = 6, gc = 500, vc = "/journal/summary", yc = "/api/server-state", kc = 2e4, Ya = Zn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, wc = (e) => e.split("?")[0].endsWith(vc), rr = (e, t) => Object.assign(new Error(t), { status: e });
async function bc(e, t, n = rr) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const xc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class $c {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = Mn;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = Mn;
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
        headers: { ...Ya, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: xc(s),
        signal: AbortSignal.timeout(a || (i ? pc : Ka))
      });
    } catch (l) {
      if (l instanceof TypeError && Ga(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, gc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Mn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : tc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return bc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ya, signal: AbortSignal.timeout(Ka) });
    if (!n.ok) throw rr(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Mn, o).then((l) => (this.written(n), l));
    if (ya() && !wc(n))
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
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return fetch(yc, { cache: "no-store", signal: AbortSignal.timeout(kc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && Ga(), s;
    }
  }
}
const Le = new $c(), Mc = 0, Sc = "/api/lines", _c = "/api/line";
class Ec {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Mc));
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
        const n = await Le.raw(Sc, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Le.raw(_c, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Ac = new Ec(), Cc = 150, Oc = () => Cc;
function ka(e, t, n = Oc(), s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
class Tc {
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
      n.patterns.some((s) => ir(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ir(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const lr = /* @__PURE__ */ new Map();
class Ic {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = ut({ buttons: [], missing: {} }), this.loading = ut(!1), this.loaded = ut(!1), this.failed = ut(""), this.pending = null;
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
    var a;
    const n = (a = t.data) == null ? void 0 : a.key, s = t.event.startsWith("setting.") && (!n || n.includes("suite"));
    return t.event === "registry.sync" || s ? this.load() : Promise.resolve();
  }
  async allowed(t) {
    var a;
    await this.load();
    const n = this.offers.value.missing[t];
    return n != null && n.length ? await this.prompts.ask(t, {
      window: `button:${t}`,
      reads_missing: "",
      runs_missing: n.map(({ label: o, line: r }) => `${o}: ${r}`).join(", ")
    }) ? (await this.load(), !((a = this.offers.value.missing[t]) != null && a.length)) : !1 : !0;
  }
}
function s5(e, t) {
  const n = new Ic(e, t);
  return lr.set(e, n), n.load().catch(() => {
  }), n;
}
const wa = (e) => lr.get(e);
function Rc(e, t, n) {
  const s = wa(e);
  return s ? s.offers.value.buttons.filter((a) => a.slots.includes(t)).filter((a) => n || !a.runs.includes("{row_id}")).filter((a) => !a.condition || !n || !Object.hasOwn(n, a.condition.field) || a.condition.values.includes(n[a.condition.field])).map((a) => ({ ...a, menu: a.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((a, o) => +!!a.from - +!!o.from) : [];
}
async function Bc(e, t) {
  if (!e) return !0;
  const n = wa(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Lc = Symbol("pane-page"), Nc = { 1: "refused", 2: "usage", 3: "fault" }, Dc = 100, Pc = 50, jc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, qc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Fc({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = T({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: p = "", tabs: y = [], sources: k = [], links: $ = {}, search: S = {}, readOnly: C = !1, shared: F = null }) {
  const Z = /* @__PURE__ */ new Map(), _ = new AbortController(), v = T(!1), O = performance.now();
  let w = 0, I = 0;
  const x = () => {
    clearTimeout(I), I = setTimeout(() => {
      w === 0 && ka(O, () => v.value = !0);
    }, Pc);
  }, E = (M) => {
    const m = Z.get(M);
    if (m && performance.now() - m.at < Dc) return m.answer;
    w += 1;
    const L = ur(e, M, t, _.signal).finally(() => {
      w -= 1, x();
    });
    return Z.set(M, { answer: L, at: performance.now() }), L;
  };
  return {
    answered: v,
    settle: x,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: B(() => s()),
    permissions: a,
    autoScroll: p,
    tabs: y,
    sources: k,
    links: $,
    search: S,
    readOnly: C,
    shared: F,
    read: E,
    run: (M) => $t(e, M, t, _.signal),
    upload: (M) => Hc(M, _.signal),
    cancel: () => _.abort(),
    subscriptions: r,
    follow: (M, m) => r.follow(e, M.filter((L) => o.some((j) => ir(j, L))), m, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (M) => B(() => {
      var m;
      return l.value[M] ?? ((m = u.find((L) => L.key === M)) == null ? void 0 : m.default);
    }),
    setting: async (M, m) => {
      const L = await E(`window setting ${e} ${M}`);
      return L.ok ? L.value.value : m;
    },
    setOption: f,
    keep: (M, m) => $t(e, ["window", "save-setting", e, M, JSON.stringify(m)], t, _.signal)
  };
}
function Wc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nn = { ok: !1, failure: "cancelled", error: "" }, cr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function $t(e, t, n, s = void 0) {
  try {
    const a = await Ac.add({ window: e, line: Array.isArray(t) ? t : dr(t), environment: n }, s);
    return s != null && s.aborted ? nn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Nc[a.code] || "fault", error: Wc(a.error) };
  } catch {
    return s != null && s.aborted ? nn : { ok: !1, failure: "unreachable", error: cr };
  }
}
async function ur(e, t, n, s) {
  const a = await $t(e, t, n, s);
  return a.failure !== "unreachable" || !ya() ? a : (await mc(), s.aborted ? nn : ur(e, t, n, s));
}
async function Hc(e, t = void 0) {
  try {
    const n = await Le.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? nn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? nn : { ok: !1, failure: "unreachable", error: cr };
  }
}
function dr(e) {
  return [...e.matchAll(jc)].map(([t]) => t.replace(qc, (n, s, a, o) => s ?? (a === void 0 ? o : a.replace(/\\(["\\])/g, "$1"))));
}
const Uc = (e) => `show-${e}`, a5 = (e, t, n) => e.filter((s) => {
  var a;
  return n(Uc((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), fr = "messages.chat", zc = {
  key: 0,
  class: "template-brief"
}, Vc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Gc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T([]), o = T(""), r = B(() => a.value.map((u) => ({ key: String(u.id), label: u.module ? `${u.title} · ${u.module}` : u.title }))), i = B(() => a.value.find((u) => String(u.id) === n.value));
    async function l() {
      const u = await $t(fr, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      a.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = a.value.find((p) => p.title === d);
      f && s("pick", String(f.id));
    }
    return l(), (u, d) => (c(), h(K, null, [
      R(Jn, {
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => s("pick", f))
      }, null, 8, ["options", "value"]),
      i.value ? (c(), h("p", zc, b(i.value.brief), 1)) : A("", !0),
      o.value ? (c(), h("p", Vc, b(o.value), 1)) : A("", !0)
    ], 64));
  }
}, Kc = /* @__PURE__ */ Y(Gc, [["__scopeId", "data-v-8cbacb6d"]]), Yc = { class: "form-field" }, Jc = { class: "form-field-head" }, Zc = ["for"], Xc = {
  key: 0,
  class: "form-field-aside"
}, Qc = {
  key: 0,
  class: "form-field-help"
}, eu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Yc, [
      g("div", Jc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, Zc),
        t.$slots.aside ? (c(), h("span", Xc, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Qc, b(e.help), 1)) : A("", !0)
    ]));
  }
}, tu = /* @__PURE__ */ Y(eu, [["__scopeId", "data-v-dd7cdcff"]]), zs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, nu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Kn(), n = B(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => st((c(), h("textarea", nt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(zs), U(t).value]
    ]);
  }
}), su = /* @__PURE__ */ Y(nu, [["__scopeId", "data-v-e130a5b9"]]), au = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = ga(), o = B(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, i) => (c(), V(tu, {
      label: e.field.label,
      for: U(a),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        R(Ft, { value: o.value }, {
          choice: P(() => [
            R(Jn, {
              id: U(a),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (l) => s("pick", l))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            R(Kc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (l) => s("pick", l))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            R(su, {
              id: U(a),
              value: e.value,
              onInput: i[2] || (i[2] = (l) => s("pick", l.target.value))
            }, null, 8, ["id", "value"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["label", "for", "data-button-field"]));
  }
}, Xn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), V(he, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        R(ve, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function ou(e, t, n, s = () => window) {
  Ne(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Te(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const ru = (e, t = () => !0) => ou("keydown", (n) => n.key === "Escape" && t() && e());
function hr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = T(!1), a = B(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return ru(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const iu = 80, Rt = va([]);
function mr(e) {
  const t = Symbol("layer"), n = () => Rt.includes(t) && Rt.splice(Rt.indexOf(t), 1);
  return pe(
    e,
    (s) => {
      s && !Rt.includes(t) && Rt.push(t), s || n();
    },
    { immediate: !0 }
  ), Te(n), B(() => iu + Math.max(0, Rt.indexOf(t)));
}
let pr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return pr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const lu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function cu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(lu)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ne(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : pr, document.addEventListener("keydown", a), pt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const uu = ["aria-modal", "aria-label", "aria-labelledby"], du = {
  key: 0,
  class: "dialog-head"
}, fu = ["id", "tabindex"], hu = {
  key: 1,
  class: "dialog-foot"
}, mu = 500, pu = 400, gu = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = hr(s, n), i = mr(a), l = T(null), u = T(null), d = T(null), f = ga(), p = T(!1), y = Date.now();
    n.modal && cu(u, () => s("escape"), d);
    function k() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, pu);
    }
    function $(F) {
      !n.modal || Date.now() - y >= mu || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const S = () => l.value && (l.value.scrollTop = l.value.scrollHeight), C = new MutationObserver(S);
    return pe(l, (F) => {
      C.disconnect(), F && n.follow && (C.observe(F, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Te(() => C.disconnect()), (F, Z) => (c(), V(pa, { to: "body" }, [
      R(jt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: P(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: me({ zIndex: U(i) }),
            onClick: be(k, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(f) : void 0,
              onKeydownCapture: $
            }, [
              e.bare ? A("", !0) : (c(), h("header", du, [
                g("h3", {
                  id: U(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, fu),
                e.closable ? (c(), V(Xn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: l,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                ce(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (c(), h("footer", hu, [
                ce(F.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, uu)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, gr = /* @__PURE__ */ Y(gu, [["__scopeId", "data-v-6d1ecd98"]]), vu = (e, t, n = {}) => dr(e.runs).map((s) => s.replace(/\{(\w+)\}/g, (a, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function fn(e, t, n, s = {}) {
  try {
    return await Bc(e.module, n) ? $t(fr, vu(e, t, s), n) : { ok: !1, error: "" };
  } catch (a) {
    return { ok: !1, error: a.message };
  }
}
const yu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, fs = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], ge = (e, t, n, s = {}) => ({
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
}), hn = {
  messages: ge("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: ge("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: ge("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: fs
  }),
  tasks: ge("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: fs
  }),
  reports: ge("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: ge("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: ge("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: ge("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: ge("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: ge("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: ge("Pin", "band", "One line pinned to the chat while it matters", { filters: fs }),
  reactions: ge("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: ge("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: ge("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: ge("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: ge("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: ge("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: ge("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: ge("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: ge("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  subagents: ge("Subagent", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: ge("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: ge("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: ge("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: ge("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: ge("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: ge("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: ge("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, ku = ["secrets", "plugins"], vr = Object.keys(hn).filter((e) => !(Zn && ku.includes(e)));
B(() => vr.map((e) => ({ name: e, ...hn[e] })));
const Ht = (e) => hn[e], yr = new Map(vr.flatMap((e) => [e, e.replace(/s$/, ""), hn[e].title.toLowerCase()].map((t) => [t, e]))), et = (e) => yr.get(String(e).toLowerCase()) || "", kr = [...yr.keys()].sort((e, t) => t.length - e.length).join("|"), wu = {
  class: "button-form",
  "data-button-form": ""
}, bu = {
  key: 0,
  class: "button-form-title"
}, xu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, $u = { class: "button-form-actions" }, Mu = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = T(!1), r = T(""), i = B(() => n.button.fields.every((d) => a.value[d.name].trim().length > 0)), l = B(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = Ht(et(n.row.kind))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await fn(n.button, n.row, n.environment, a.value);
      o.value = !1, r.value = d.ok ? "" : d.error, d.ok && (s("done"), s("close"));
    }
    return (d, f) => (c(), V(gr, {
      title: l.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (p) => s("close"))
    }, {
      default: P(() => {
        var p;
        return [
          g("div", wu, [
            (p = e.row) != null && p.title ? (c(), h("p", bu, b(e.row.title), 1)) : A("", !0),
            (c(!0), h(K, null, ee(e.button.fields, (y) => (c(), V(au, {
              key: y.name,
              field: y,
              value: a.value[y.name],
              environment: e.environment,
              onPick: (k) => a.value[y.name] = k
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            r.value ? (c(), h("p", xu, b(r.value), 1)) : A("", !0),
            g("div", $u, [
              R(he, {
                small: "",
                onClick: f[0] || (f[0] = (y) => s("close"))
              }, {
                default: P(() => [...f[2] || (f[2] = [
                  se("Cancel", -1)
                ])]),
                _: 1
              }),
              R(he, {
                kind: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: P(() => [...f[3] || (f[3] = [
                  se("Send", -1)
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
}, Su = /* @__PURE__ */ Y(Mu, [["__scopeId", "data-v-879955be"]]), _u = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Eu = {
  key: 1,
  class: "menu-item-text"
}, Au = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", _u, b(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), h("span", Eu, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, b(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(Au, [["__scopeId", "data-v-fec99974"]]), Cu = ["aria-busy"], Ou = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Tu = {
  __name: "ButtonSlot",
  props: { name: { type: String, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 }, readOnly: Boolean },
  emits: ["done"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => wa(n.environment)), o = B(() => {
      var k;
      return !n.readOnly && ((k = a.value) == null ? void 0 : k.loading.value) && (!a.value.loaded.value || a.value.failed.value);
    }), r = B(() => {
      var k;
      return !n.readOnly && ((k = a.value) == null ? void 0 : k.failed.value);
    }), i = () => a.value.load().catch(() => {
    }), l = B(() => n.readOnly ? [] : Rc(n.environment, n.name, n.row)), u = T(null), d = T(""), f = T(!1), p = (k) => [k.from ? `From ${k.from}` : "", k.tip].filter(Boolean).join(" · ");
    async function y(k) {
      if (f.value || n.readOnly) return;
      if (k.fields.length) {
        u.value = k;
        return;
      }
      f.value = !0;
      const $ = await fn(k, n.row, n.environment);
      f.value = !1, d.value = $.ok ? "" : $.error, $.ok && s("done");
    }
    return (k, $) => (c(), h("span", {
      class: J(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && r.value ? (c(), h(K, { key: 0 }, [
        $[3] || ($[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        R(he, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...$[2] || ($[2] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (c(), h(K, { key: 1 }, [
        (c(!0), h(K, null, ee(l.value, (S) => (c(), h(K, {
          key: S.name
        }, [
          S.menu.length ? (c(), V(Yl, {
            key: 0,
            small: "",
            kind: S.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": S.menu_label || "More ways",
            title: p(S),
            "data-button": S.name,
            onMain: (C) => y(S)
          }, {
            menu: P(({ close: C }) => [
              (c(!0), h(K, null, ee(S.menu, (F) => (c(), V(Mt, {
                key: F.label,
                description: F.description,
                onClick: (Z) => (C(), y({ ...S, ...F, menu: [] }))
              }, {
                default: P(() => [
                  se(b(F.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: P(() => [
              se(b(S.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["kind", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), V(he, {
            key: 1,
            small: "",
            kind: S.primary ? "primary" : "ghost",
            icon: S.icon,
            disabled: f.value,
            title: p(S),
            "data-button": S.name,
            onClick: (C) => y(S)
          }, {
            default: P(() => [
              se(b(S.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly ? (c(), h("span", Ou, b(d.value), 1)) : A("", !0),
        u.value && !e.readOnly ? (c(), V(Su, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: $[0] || ($[0] = (S) => u.value = null),
          onDone: $[1] || ($[1] = (S) => s("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, Cu));
  }
}, Iu = /* @__PURE__ */ Y(Tu, [["__scopeId", "data-v-2da32260"]]), Ru = {
  class: "running",
  "data-running-command": ""
}, Bu = ["title"], Lu = {
  key: "idle",
  class: "running-idle"
}, Nu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Ru, [
      R(jt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, Bu)) : (c(), h("span", Lu, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, o5 = /* @__PURE__ */ Y(Nu, [["__scopeId", "data-v-d3240219"]]), Du = ["aria-checked", "aria-label", "title"], Pu = {
  key: 0,
  class: "switch-inner"
}, ju = {
  key: 0,
  class: "switch-word"
}, qu = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("button", {
      type: "button",
      class: J(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: J(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Pu, b(e.word), 1)) : A("", !0),
        a[1] || (a[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", ju, b(e.word), 1)) : A("", !0)
    ], 10, Du));
  }
}, r5 = /* @__PURE__ */ Y(qu, [["__scopeId", "data-v-1bfb90f3"]]);
function wr(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function sn(e, t) {
  return wr(() => localStorage, e, t);
}
function br(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Qn(e, t) {
  return br(() => localStorage, e, t);
}
function xr(e, t) {
  pe(t, (n) => Qn(e, n), { deep: !0 });
}
function Fu(e, t) {
  return wr(() => sessionStorage, e, t);
}
function Wu(e, t) {
  return br(() => sessionStorage, e, t);
}
const qn = "journal.environment", $r = T(Fu(qn, sn(qn, "")));
function Hu(e) {
  $r.value = e, Wu(qn, e), Qn(qn, e);
}
const Fn = T(location.hash), Ja = ut(null), Za = { integrations: "mcp", library: "team" };
function Uu() {
  if (!Ja.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Za[n]) {
    location.replace(`#/${[Za[n], ...s].join("/")}${t ? `?${t}` : ""}`), Fn.value = location.hash;
    return;
  }
  !n || Ja.value(n) || (Hu(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Fn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Fn.value = location.hash, Uu();
});
const Xe = B(() => {
  const [e, t = ""] = Fn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: $r.value,
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
}), es = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${es.page(e)}?open=${t}`
};
function zu(e = "", t = 0, n = "") {
  location.hash = es.page(e, t, n);
}
const Vu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Mr(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Vu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Lt = {};
function i5(e, t) {
  return Lt[e] = t, () => Lt[e] === t && delete Lt[e];
}
function Sr(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Lt[e]) != null && r.call(Lt, t))) return;
  const a = Xe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Mr([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Gu(e, t, n, s = 0, a = "") {
  if (e === Xe.value.env) return Sr(t, n, s, a);
  const o = Xe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Mr([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Fe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Gu(s, a, Number(o), 0, t) : Sr(a, Number(o), 0, t);
}
function Ku(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Bt(e) {
  const t = Ku(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function l5(e, t, n) {
  const s = e.indexOf(t);
  return e[s < 0 ? 0 : Math.max(0, Math.min(e.length - 1, s + n))];
}
const Yu = {
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
    const t = e, n = B(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = T(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), V(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Yu, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), V(jn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        se(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(K, { key: 3 }, [
      (c(), V(_t(e.arrival ? Zo : "ul"), nt(n.value, { class: "row-list" }), {
        default: P(() => [
          (c(!0), h(K, null, ee(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ce(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Ju))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : A("", !0)
    ], 64));
  }
}, Xu = /* @__PURE__ */ Y(Zu, [["__scopeId", "data-v-aa6ad7ff"]]), Qu = {
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
}, sd = ["data-agent-row", "onClick"], ad = { class: "agent-row-name" }, od = { class: "agent-row-state" }, rd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = B(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Qu, [
      e.loaded ? e.failure ? (c(), h("p", ed, b(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        g("p", nd, b(s.value) + " running", 1),
        (c(!0), h(K, null, ee(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => U(Fe)(`agents:${r.id}`)
        }, [
          g("span", ad, "#" + b(r.id) + " " + b(r.session), 1),
          g("span", od, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, sd))), 128))
      ], 64)) : (c(), h("p", td, b(e.none), 1)) : (c(), V(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, c5 = /* @__PURE__ */ Y(rd, [["__scopeId", "data-v-a01e5a17"]]), id = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, b(e.text), 3));
  }
}, _r = /* @__PURE__ */ Y(id, [["__scopeId", "data-v-9e7e1157"]]), ld = ["aria-valuenow", "aria-valuemax"], cd = {
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
    return (s, a) => (c(), h("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: me({ width: n.value })
      }, null, 4)
    ], 10, ld));
  }
}, ud = /* @__PURE__ */ Y(cd, [["__scopeId", "data-v-9eba6a85"]]), dd = { class: "bars" }, fd = { class: "bar-name" }, hd = { class: "bar-value" }, md = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", dd, [
      (c(!0), h(K, null, ee(e.items, (l, u) => (c(), V(_t(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: J(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: P(() => [
          g("span", fd, b(l.label), 1),
          R(ud, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", hd, b(l.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, pd = /* @__PURE__ */ Y(md, [["__scopeId", "data-v-663427f4"]]), gd = { class: "bars" }, vd = {
  key: 0,
  class: "bars-title"
}, yd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", gd, [
      e.node.title ? (c(), h("span", vd, b(e.node.title), 1)) : A("", !0),
      R(pd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, kd = /* @__PURE__ */ Y(yd, [["__scopeId", "data-v-7135bb11"]]), wd = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = B(() => n[s.node.type](s.node));
    return (r, i) => (c(), h("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: me(o.value)
    }, [
      (c(!0), h(K, null, ee(e.node.children || [], (l, u) => (c(), V(ei, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Rn = /* @__PURE__ */ Y(wd, [["__scopeId", "data-v-d142a3f4"]]), bd = {
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
    return (s, a) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", bd, [
        g("span", xd, b(e.node.title), 1),
        e.node.note ? (c(), h("span", $d, b(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      R(Rn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Sd = /* @__PURE__ */ Y(Md, [["__scopeId", "data-v-67b72d40"]]), Xa = (e) => [...new Set(e.agents.map((t) => t.name))], u5 = (e) => Xa(e).length === 1 ? `Worker: ${Xa(e)[0]}` : "Delegated", _d = (e) => "task_ids" in e, Er = 1024, Ed = Er * 1024 * 1024, Ad = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Er} MB limit for one file.`, Be = (e) => encodeURIComponent(e);
function de(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const zt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Vt = "the page does not know its environment yet", Cd = "X-Journal-Env", Od = "X-Journal-Request-At", hs = "/viewer/voices/figures/";
class ba {
  constructor({ env: t = () => Xe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ba({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Od]: String(Date.now()), ...this.env() ? { [Cd]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === Vt ? Promise.reject(new Error(Vt)) : Le.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === Vt ? Promise.reject(new Error(Vt)) : Le.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : Vt;
  }
  // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
  address(t) {
    return this.url(`${this.here(t)}${t.includes("?") ? "&" : "?"}env=${Be(this.env())}`);
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
    return this.get(`/updates/changelog${de({ skip: t })}`);
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
    return this.get(this.here(`/entries${de({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return Le.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: u = !1 } = {}) {
    const d = this.here(`/${t}${de({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(d, `${t}.${zt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${de({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${zt({ before: s, since: a, docked: o })}`);
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
    return this.post(this.here(t.path), {}, Ye);
  }
  upload(t, n, s) {
    if (Zn) return Promise.reject(Object.assign(new Error(ec), { status: 403 }));
    if (s.size > Ed) return Promise.reject(new Error(Ad(s)));
    const a = new FormData();
    return a.append("file", s, s.name), this.post(this.here(`/${t}/${n}/files`), a);
  }
  fileUrl(t, n, s) {
    return this.address(`/${t}/${n}/files/${Be(s)}`);
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
    return Le.bytes(t);
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
    return this.get(this.here(`/messages${de({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${de(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${de({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${de({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Be(t)}${de({ model: n, effort: s })}`);
  }
  controlAgent(t, n, s) {
    return this.act("agents", t, "control", { action: n, value: s });
  }
  runShell(t, n) {
    return this.act("agents", t, "shell", { command: n });
  }
  stopJob(t, n) {
    return this.post(this.here(`/agents/${t}/jobs/${Be(n)}/stop`), {});
  }
  skipSequenceStep(t) {
    return this.act("agents", t, "skip-step");
  }
  endSequence(t) {
    return this.act("agents", t, "end-sequence");
  }
  transcript(t, n, s) {
    const a = `/agents/${t}${n ? `/subagents/${Be(n)}` : ""}/transcript`;
    return this.get(this.here(`${a}${de(s)}`), `${a}.${zt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${de(n)}`), `/verifiers/${t}/transcript.${zt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${de(n)}`), `/workers/${t}/transcript.${zt(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${de({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${de({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${de({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${de({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${de({ team: t })}`);
  }
  // every team this journal is connected to, with as whom, the role and how many people, devices and shared items
  teams() {
    return this.get("/teams");
  }
  // connects to a team by its server's URL: a new server's makes this person its admin, an pair_code URL a member, a bare URL logs in
  connectTeam(t) {
    return this.post("/team/connect", t, Ye);
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
    return this.get(`/team/devices${de({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${de({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${de({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${de({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${de({ team: t })}`);
  }
  // publishes a sequence or template, by its number, or a profile, by its name, as the library's next version
  publishLibraryItem(t, n, s, a, o = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, Ye);
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
    const a = this.here(`/outputs/${t}${de({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${de({ agent: t })}`));
  }
  skill(t) {
    return this.get(this.here(`/skills/${Be(t)}`));
  }
  loadSkill(t) {
    return this.post(this.here(`/skills/${Be(t)}/load`));
  }
  skillMoment(t, n, s) {
    return this.post(this.here(`/skills/${Be(t)}/moment`), { moment: n, on: s });
  }
  // the figure files of the voices travel with the viewer: an index of each voice's file, the files, and the decoder they are packed for
  voiceFigures() {
    return Le.request("GET", hs + "figures.json");
  }
  voiceFigureUrl(t) {
    return hs + t;
  }
  figureDecoderUrl() {
    return hs + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${de({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${de({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${de({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${de({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${de({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${de({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${de({ skip: t, last: n })}`));
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
    return this.post(this.here("/plugins/preview"), { source: t }, Ye);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, Ye);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, Ye);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, Ye);
  }
  pluginLog(t, n = 200) {
    return this.get(this.here(`/plugins/${t}/log${de({ lines: n })}`));
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
    return this.post(`/profiles/${Be(t)}`, n);
  }
  mcp() {
    return this.get("/mcp");
  }
  mcpInstall(t) {
    return this.post("/mcp/install", { name: t });
  }
  mcpKey(t, n) {
    return this.post(`/mcp/${Be(t)}/key`, { value: n });
  }
  mcpSignIn(t) {
    return this.post(`/mcp/${Be(t)}/sign-in`, {});
  }
  mcpAdd(t) {
    return this.post("/mcp/add", t, Ye);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Be(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Ye);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Be(t)}` : ""}${es.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const Ve = new ba({ base: Zn ? "/p" : "" }), Td = (e) => Le.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Qa = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Id = 6e4, Rd = 4, Bd = 300, Ld = 5e3, Ar = /* @__PURE__ */ new Map();
function ts(e) {
  if (!(e in Qa)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Qa[e];
}
function Nd(e) {
  const t = ts(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Ld;
  }
}
const Dd = (e) => e / 2 + Math.random() * e / 2, Cr = (e) => [...e.users.values()].pop(), xa = (e) => Ar.get(e.place) === e, Pd = () => Math.random() * Bd, $a = () => document.hidden;
function jd(e) {
  const t = Nd(e);
  return e.failures ? Dd(Math.min(Id, t * 2 ** e.failures)) : Math.max(t, Rd * e.took);
}
function Or(e, t) {
  clearTimeout(e.timer), !(!xa(e) || $a()) && (e.timer = setTimeout(() => qd(e), t));
}
function qd(e) {
  return xa(e) ? e.running ? (e.again = !0, e.running) : (e.running = Ud(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Fd = (e) => {
  var t, n;
  return !$a() && (((n = (t = ts(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Cr(e).active() && !ya();
};
async function Wd(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Le.attemptOnce(() => ts(e.key).read(Cr(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Hd(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = ts(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Ud(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Fd(e) && Hd(e, await Wd(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && xa(e));
  Or(e, jd(e));
}
const zd = () => $a() || Ar.forEach((e) => Or(e, Pd()));
document.addEventListener("visibilitychange", zd);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Tr = (e) => `${e.table}:${e.id}`, eo = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ms = 80;
function to(e) {
  return e.length <= ms ? e : `${e.slice(0, ms + 1).replace(/\s+\S*$/, "") || e.slice(0, ms)}…`;
}
const no = {
  messages: (e) => to(eo(e.text)),
  comments: (e) => to(eo(e.text)),
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
}, Vd = (e) => (no[e.table] ? no[e.table](e) : e.title || "") || "", Gd = ["done", "cancelled"], Vs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => Gd.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, Kd = (e) => Vs[e.table] ? Vs[e.table](e) : 0, Ir = (e) => Kd(e) > 0, Yd = (e) => !!Vs[e], St = (e) => Ee(e.created_at), Ma = (e) => Ee(e.updated_at) || St(e), Jd = 60, Zd = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - Jd, Xd = (e, t) => e.id > 0 && e.table === t.table && Zd(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), Sa = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Xd(s, n))), Qd = { me: 1, people: [] }, ie = va({
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
  people: Qd,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: sn("journal.activity", !0),
  wide: !1,
  sideMini: sn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
xr("journal.activity", () => ie.activity);
xr("journal.side.mini", () => ie.sideMini);
const ef = 50, Rr = 100, tf = { messages: 25 }, He = (e) => tf[e] || ef;
function nf(e, t) {
  if (e !== "messages") return Math.max(t.length - He(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === He(e)) return s;
  return 0;
}
const mt = /* @__PURE__ */ new Set(), _a = T(0), mn = /* @__PURE__ */ new Set(), pn = /* @__PURE__ */ new Set(), lt = /* @__PURE__ */ new Set(), Gs = /* @__PURE__ */ new Set(), sf = /* @__PURE__ */ new Map(), af = /* @__PURE__ */ new Map();
let Gt = !1, Kt = null;
const of = (e, t) => e.id - t.id, rf = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, lf = { messages: rf }, Br = (e) => lf[e] || of;
function Lr(e) {
  return _a.value, mt.has(e) || (mt.add(e), ie.booted && (!mn.has(e) || pn.has(e)) && queueMicrotask(() => Ea([e], !1))), ie.rows[e] || [];
}
function cf(e) {
  const t = ie.rows[e] || [], n = nf(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ie.rows[e] = t.filter((a) => s.has(a) || Yd(e) && !Ir(a)), ie.paging.size[e] = He(e), ie.paging.more[e] = !0;
}
const uf = /* @__PURE__ */ new Set();
function df() {
  mt.forEach(cf), mt.clear(), sf.clear(), af.clear(), _a.value += 1;
}
pe(() => `${Xe.value.env}/${Xe.value.page}/${Xe.value.open ? Xe.value.open.table : ""}`, df);
pe(
  () => ie.booted,
  (e) => e && Ea(
    [...mt].filter((t) => !mn.has(t)),
    !1
  )
);
const Ks = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !_d(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Nr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ks(s) && !Ks(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Dr(e, t) {
  mn.add(e), _a.value += 1;
  const n = ie.rows[e] || [];
  ie.rows[e] = [...Nr(n, t.rows), ...Sa(n.filter((s) => s.id === 0), t.rows)], ie.paging.size[e] = ie.paging.size[e] || He(e), ie.paging.more[e] = !t.is_last_page;
}
async function ff(e) {
  const t = new Set((ie.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: He(e) });
  ns(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = Sa((ie.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Dr(e, { ...n, rows: [...n.rows, ...a].sort(Br(e)) }), ie.paging.size[e] = He(e), Pr.has(e) && await jr(e), ie.rows[e];
}
const ns = (e, t) => ie.counts = { ...ie.counts, [e]: t };
async function hf(e) {
  const t = ie.rows[e] || [], n = Math.max(0, ...t.map(Ma)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: He(e), since: n, after: s });
  if (ns(e, a.counts), !a.is_last_page) return ff(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = Sa(t.filter((i) => !o.has(i.id)), a.rows).concat(Nr(t, a.rows));
  return ie.rows[e] = r.sort(Br(e)), ie.paging.size[e] = ie.rows[e].length, ie.rows[e];
}
const ps = /* @__PURE__ */ new Set();
async function mf(e, t = !1) {
  e.forEach((n) => pn.delete(n)), e.forEach((n) => Gs.add(n));
  try {
    await bf(e, t);
  } finally {
    e.forEach((n) => Gs.delete(n));
  }
}
async function pf(e) {
  const t = await Ve.list(e, { limit: He(e) });
  ns(e, t.counts), Dr(e, t);
}
async function gf(e) {
  ns(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const Pr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function jr(e) {
  const t = (ie.rows[e] || []).filter((a) => Ks(a) && (e !== "plans" || !Ir(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ie.rows[e] = (ie.rows[e] || []).map((a) => s.get(a.id) || a);
}
const vf = (e, t) => !mn.has(e) || t && (ie.paging.size[e] || He(e)) === He(e) && !uf.has(e);
async function yf(e, t) {
  if (!mt.has(e)) return gf(e);
  const n = await (vf(e, t) ? pf(e) : hf(e));
  return Pr.has(e) && await jr(e), n;
}
async function qr() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ie.settings) && (ie.settings = e);
}
async function kf() {
  const [e] = await Promise.all([Ve.entries(0, Rr), qr()]);
  Mf([...sn(Wr(), []), ...e]);
}
const wf = (e, t) => yf(e, t).then(
  () => null,
  () => e
);
async function bf(e, t) {
  const n = (await Promise.all(e.map((s) => wf(s, t)))).filter(Boolean);
  if (n.forEach((s) => (lt.add(s), pn.add(s))), t && await kf(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Fr = 1e3, xf = 15e3;
let Sn = Fr;
async function $f() {
  return Kt || (Kt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...lt].some((e) => !ps.has(e)) || Gt; ) {
      const e = Gt, t = [...e ? Object.keys(ie.rows) : lt].filter((s) => hn[s] && (mt.has(s) || s in ie.rows)).filter((s) => e || !mt.has(s) || pn.has(s) || !mn.has(s)).filter((s) => !ps.has(s)), n = [...lt].filter((s) => ps.has(s));
      lt.clear(), n.forEach((s) => lt.add(s)), Gt = !1;
      try {
        await mf(t, e), Sn = Fr;
      } catch {
        Gt = Gt || e, await new Promise((a) => setTimeout(a, Sn)), Sn = Math.min(Sn * 2, xf);
      }
    }
  })().finally(() => Kt = null), Kt);
}
function Ea(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Gs.has(n)).forEach((n) => {
    lt.add(n), t && pn.add(n);
  }), lt.delete("settings") && qr(), $f();
}
const Wr = () => {
  var e;
  return `typed-entries:${((e = ie.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Mf(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ie.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Rr), Qn(Wr(), ie.entries.slice(-50));
}
Td((e) => ie.streamOpen || Ea([e]));
const Ys = [], Sf = 2e3, it = /* @__PURE__ */ new Map(), _f = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Ef = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function At(e, { first: t = !1 } = {}) {
  t ? Ys.unshift(e) : Ys.push(e), it.clear();
}
function Hr(e, t, n) {
  var a;
  const s = Lr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Af = (e) => Lr(e.table).find((t) => t.id === e.id) === e.row, Cf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Of(e, t) {
  const n = [{ kind: "text", text: tt(e).replace(/\r\n/g, `
`) }];
  for (const s of Ys)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function an(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Tf(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Tf(e) {
  return e.split(Ef).map((t, n) => n % 2 ? t : t.replace(_f, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function so(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const If = 24;
function Rf(e) {
  const [t, , ...n] = e, s = so(t), a = n.map(so), o = (l) => [s, ...a].some((u) => (u[l] ?? "").length > If) ? ' class="text-column"' : "", r = s.map((l, u) => `<th${o(u)}>${an(l)}</th>`).join(""), i = a.map((l) => `<tr>${l.map((u, d) => `<td${o(d)}>${an(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${r}</tr></thead><tbody>${i}</tbody></table>`;
}
const Ur = /^\s*(?:[-*+]|\d+[.)])\s+/, Js = /^\s*(\d+)[.)]\s/, ao = (e) => e.match(/^\s*/)[0].length;
function zr(e) {
  const t = e[0].match(Js), n = ao(e[0]), s = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = s[s.length - 1];
    r && ao(o) <= n ? s.push({ text: r[2], nested: [] }) : i && o.trim() && (r || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${s.map((o) => `<li>${an(o.text)}${o.nested.length ? zr(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Bf(e, t) {
  const n = Js.test(e[t]);
  let s = t + 1;
  for (let a = s; a < e.length; a += 1)
    if (Ur.test(e[a]) && Js.test(e[a]) === n || a === s && /^\s{2,}\S/.test(e[a])) s = a + 1;
    else if (e[a].trim()) break;
  return s;
}
const oo = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Vr(e) {
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
      const i = t.findIndex((u, d) => d > s && /^(```|~~~)/.test(u)), l = i < 0 ? t.length : i;
      n.push(`<pre><code>${t.slice(s + 1, l).join(`
`)}</code></pre>`), s = l + 1;
      continue;
    }
    const o = a.match(/^(#{1,6})\s+(.*)$/);
    if (o) {
      const i = Math.min(6, o[1].length + 2);
      n.push(`<h${i}>${an(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (oo(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Rf(t.slice(s, i))), s = i;
      continue;
    }
    if (Ur.test(a)) {
      const i = Bf(t, s);
      n.push(zr(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Vr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !oo(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${an(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Lf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Nf = (e) => e.kind !== "text" && !Lf.test(e.html);
function Df(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Vr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Nf(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Zs(e, t = { env: "" }) {
  const n = Cf(e, t), s = it.get(n);
  if (it.delete(n), s && s.reads.every(Af))
    return it.set(n, s), s.html;
  const a = [], o = Df(Of(e, { ...t, reads: a }));
  return it.set(n, { html: o, reads: a }), it.size > Sf && it.delete(it.keys().next().value), o;
}
const Gr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, gn = (e) => String(e || "").replace(Gr, (t, n, s, a) => a), Pf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), _n = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, jf = /^Traceback \(most recent call last\):/m, qf = 8;
function Kr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, qf).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Ff(e) {
  const t = [...e.matchAll(Pf)].map((s) => s.index);
  if (_n.lastIndex = 0, !t.length || !_n.test(e)) return null;
  _n.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(_n)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Kr(n), tail: "" } : null;
}
function Wf(e) {
  const t = jf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Kr([o]), tail: n.slice(a).join(`
`) };
}
At((e) => {
  const t = gn(e), n = Wf(t) || Ff(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Hf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Uf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, zf = /[\w\]]\(/, Vf = /^[\w$.[\]'"]+\s*=\s*[^=]/, Gf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Kf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, Yf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Jf = /[[({,]$/, Zf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Xf = /^(\t|\s{2,})\S/, Qf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, eh = /`[^`]+`/, th = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, nh = /[{}()[\];=<>$&|*\\@+^~%]/g, Yr = /^\s*(?:[-*+]|\d+[.)])\s/, sh = /^\s*>/, ah = /^\s*\|/, oh = 0.6, rh = 0.4, ih = 5, lh = 0.03, Jr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= ih && t.every((n) => th.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(nh) ?? []).length / e.length < lh;
}, gs = (e) => {
  const t = e.trim();
  return eh.test(t) ? !1 : [Hf, Uf, zf, Vf, Gf, Kf, Yf, Jf, Zf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Xf.test(e) && !Yr.test(e) && !Jr(e);
};
function ch(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Yr.test(t[0]) || t.every((o) => sh.test(o) || ah.test(o))) return "text";
  const n = t.filter((o) => !Qf.test(o.trim()));
  if (t.length === 1) return !n.length || gs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(gs).length, a = n.filter((o) => !gs(o) && Jr(o)).length;
  return s >= n.length * oh && a <= n.length * rh ? "code" : "text";
}
const Xs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", uh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", dh = `${Xs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, fh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", hh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", ro = {
  js: { keywords: Xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: uh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: dh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: fh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: hh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, mh = {
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
function io(e, t, n) {
  return n && e.startsWith(n, t);
}
function ph(e, t) {
  const n = ro[mh[t] ?? t] || ro.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const r = (i, l) => l && a.push({ kind: i, value: l });
  for (; o < e.length; ) {
    const i = e[o];
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
    if (io(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && io(e, o, n.block[0])) {
      const u = e.indexOf(n.block[1], o + n.block[0].length), d = u < 0 ? e.length : u + n.block[1].length;
      r("comment", e.slice(o, d)), o = d;
      continue;
    }
    const l = (n.triple || []).find((u) => e.startsWith(u, o));
    if (l) {
      const u = e.indexOf(l, o + 3), d = u < 0 ? e.length : u + 3;
      r("string", e.slice(o, d)), o = d;
      continue;
    }
    if (n.quotes.includes(i)) {
      let u = o + 1;
      for (; u < e.length && e[u] !== i && (i === "`" || e[u] !== `
`); ) u += e[u] === "\\" ? 2 : 1;
      r(n.keyed && /^\s*:/.test(e.slice(u + 1)) ? "property" : "string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      r("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, p = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(s.has(f) ? "keyword" : p ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function gh(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of ph(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? tt(r) : `<span class="tok-${s}">${tt(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function vh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const yh = 1500, lo = /* @__PURE__ */ new WeakMap();
async function kh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await vh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(lo.get(t)), lo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, yh)
  )));
}
typeof document < "u" && document.addEventListener("click", kh, !0);
const wh = /\n\s*\n/, bh = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, xh = /^\s*(`{3,}|~{3,})\s*$/, $h = /^\s{4,}\S/, Mh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Qs = /^\s*(?:[-*+]|\d+[.)])\s/, Zr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Sh = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Aa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function _h(e) {
  const t = Aa(e.join(`
`));
  return (Sh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Eh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Zr.test(t) && !Qs.test(t);
}, Ah = (e, t) => Qs.test(t) || Qs.test([...e].reverse().find((n) => n.trim()) || "");
function Ca(e, t) {
  const n = t || _h(e), s = gh(Aa(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function Ch(e, t, n) {
  const s = e.findIndex((a, o) => o > t && a.trim().startsWith(n) && xh.test(a));
  return s < 0 ? e.length : s;
}
function Oh(e, t, n) {
  const s = e.map((a) => a.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Ca(s.map(gn), n ? n.toLowerCase() : "");
}
function Th(e) {
  const t = e.split(wh).map((r) => ({ paragraph: r, kind: ch(Aa(r).split(`
`)) })), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`

`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let r = o;
    for (; r < t.length && t[r].kind !== "text"; ) r += 1;
    const i = t.slice(o, r);
    if (i.some(({ kind: l }) => l === "code") || i.length > 1) {
      a(), n.push(Ca(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(gn), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Ih(e, t) {
  const n = e.split(`
`), s = [];
  let a = [];
  const o = () => {
    a.length && s.push(...t ? [{ kind: "text", text: a.join(`
`) }] : Th(a.join(`
`))), a = [];
  };
  let r = 0;
  for (; r < n.length; ) {
    const i = n[r].match(bh);
    if (i) {
      const u = Ch(n, r, i[2]);
      o(), s.push(Oh(n.slice(r + 1, u), i[1], i[3])), r = u + 1;
      continue;
    }
    const l = Eh(a) ? Mh : $h;
    if (!t && l.test(n[r]) && !Ah(a, n[r])) {
      let u = r;
      for (; u < n.length && (l.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; a.length && a[a.length - 1].trim() && Zr.test(a[a.length - 1].trim()); ) d.unshift(a.pop());
      if (u - r + d.length >= 2) {
        o(), s.push(Ca([...d, ...n.slice(r, u)].map(gn), "")), r = u;
        continue;
      }
      a.push(...d);
    }
    a.push(n[r]), r += 1;
  }
  return o(), s.length > 1 || s[0] && s[0].kind === "html" ? s : null;
}
At((e, t) => Ih(e, t.document));
const Rh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Bh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Lh(e) {
  const t = Rh.exec(e);
  if (t && et(t[1])) return { at: t.index, length: t[0].length, table: et(t[1]), id: Number(t[2]), label: t[3] };
  const n = Bh.exec(e), s = n && et(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Nh(e, t, n, s) {
  const a = Hr(s, e, t), o = gn(a ? Vd(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${tt(Ht(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
At(
  (e, t) => {
    const n = Lh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Nh(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Dh = /\.(png|jpe?g|gif|webp|svg)$/i, Ph = (e) => Dh.test(e), jh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, qh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Fh(e, t) {
  const n = jh.exec(e), [, s, a, o, r, i] = n || [], l = n && et(s || o), u = l && Hr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${Ht(l).title} ${u.id} · ${tt(i)}`, p = Ph(i) ? `<img class="file-card-image" src="${d}" alt="${tt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${tt(i)}">${p}<span class="file-card-name">${f}</span></a>` };
}
function Wh(e) {
  const t = qh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
At(
  (e, t) => {
    if (t.inline) return null;
    const n = Fh(e, t) || Wh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Hh = /`([^`\n]+)`/g;
At((e) => e.replace(Hh, (t, n) => `<code>${n}</code>`));
const co = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${es.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
At(
  (e, t) => e.replace(Gr, (n, s, a, o) => co[s] ? co[s](a, o, t) : o)
);
const Uh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Xr = new RegExp(`\\b(${kr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Qr = new RegExp(`\\b(${kr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), zh = new RegExp(`<code>((?:${Xr.source}|${Qr.source}))</code>`, "gi"), Vh = (e) => e.replace(zh, "$1"), Gh = (e, t) => `<a class="row-pill" href="#" data-peek="${et(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, Kh = (e) => e.replace(Qr, (t, n, s) => s.replace(/\d+/g, (a) => Gh(n.replace(/s$/i, ""), a))), Yh = (e) => Kh(e).replace(
  Xr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${et(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
At(
  (e, t) => t.rowNames === !1 ? e : Vh(e).split(Uh).map((n, s) => s % 2 ? n : Yh(n)).join("")
);
const Jh = ["innerHTML"], Zh = ["innerHTML"], Xh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = B(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Zs(s, { env: Xe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(Bt) && U(Bt)(...o)),
      innerHTML: n.value
    }, null, 8, Jh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(Bt) && U(Bt)(...o)),
      innerHTML: n.value
    }, null, 8, Zh));
  }
}, dt = /* @__PURE__ */ Y(Xh, [["__scopeId", "data-v-1a43d211"]]), Qh = { class: "fact" }, e1 = { class: "fact-label" }, t1 = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Qh, [
      g("span", e1, b(e.label), 1),
      R(dt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, n1 = /* @__PURE__ */ Y(t1, [["__scopeId", "data-v-3a88ecf8"]]), s1 = { class: "list" }, a1 = { class: "list-label" }, o1 = {
  key: 1,
  class: "list-note"
}, r1 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", s1, [
      (c(!0), h(K, null, ee(e.items, (o, r) => (c(), V(_t(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          g("span", a1, b(o.label), 1),
          o.badge ? (c(), V(_r, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), h("span", o1, b(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, i1 = /* @__PURE__ */ Y(r1, [["__scopeId", "data-v-ebe2ae0a"]]), l1 = { class: "table" }, c1 = {
  key: 0,
  class: "table-row empty"
}, u1 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", l1, [
      g("div", {
        class: "table-row head",
        style: me(a.value)
      }, [
        (c(!0), h(K, null, ee(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, b(i), 1))), 128))
      ], 4),
      (c(!0), h(K, null, ee(e.rows, (i, l) => (c(), V(_t(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: J(["table-row", i.tone, { opens: i.open }]),
        style: me(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: P(() => [
          (c(!0), h(K, null, ee(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", c1, b(e.empty), 1)) : A("", !0)
    ]));
  }
}, d1 = /* @__PURE__ */ Y(u1, [["__scopeId", "data-v-9326a52e"]]), f1 = { class: "stat-value" }, h1 = { class: "stat-label" }, m1 = {
  key: 0,
  class: "stat-note"
}, p1 = {
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
    return (s, a) => (c(), V(_t(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        g("span", f1, b(e.value), 1),
        g("span", h1, b(e.label), 1),
        e.note ? (c(), h("span", m1, b(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, g1 = /* @__PURE__ */ Y(p1, [["__scopeId", "data-v-ad0db6d6"]]), v1 = { class: "code" }, y1 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), V(Ft, {
      value: e.node.type
    }, {
      stack: P(() => [
        R(Rn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        R(Rn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        R(Rn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        R(Sd, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        g("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: P(() => [...r[2] || (r[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        R(g1, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        R(kd, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        R(d1, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        R(i1, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        R(dt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        R(n1, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        R(_r, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        g("pre", v1, [
          g("code", null, b(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), ei = /* @__PURE__ */ Y(y1, [["__scopeId", "data-v-cbdcf540"]]), k1 = { class: "dashboard" }, w1 = { class: "trail" }, b1 = ["onClick"], x1 = {
  key: 0,
  class: "gone",
  role: "status"
}, $1 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (p) => p in (n.document.pages || {}), o = T(!!n.page && !a(n.page)), r = T(n.page && !o.value ? [n.page] : []), i = B(() => r.value.at(-1) || n.document.start), l = B(() => (n.document.pages || {})[i.value] || null), u = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, r.value = [...r.value, p];
    }, f = (p) => {
      o.value = !1, r.value = r.value.slice(0, p);
    };
    return pe(
      () => n.document.start,
      () => r.value = []
    ), (p, y) => (c(), h("div", k1, [
      e.document.broken ? (c(), V(jn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          se(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), V(jn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          se(b(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(K, { key: 2 }, [
        g("nav", w1, [
          g("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (k) => f(0))
          }, b(u(e.document.start)), 3),
          (c(!0), h(K, null, ee(r.value, (k, $) => (c(), h(K, {
            key: `${$}-${k}`
          }, [
            y[2] || (y[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: J(["step", { current: $ === r.value.length - 1 }]),
              onClick: (S) => f($ + 1)
            }, b(u(k)), 11, b1)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", x1, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        R(jt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              R(ei, {
                node: l.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (k) => s("file", k))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, d5 = /* @__PURE__ */ Y($1, [["__scopeId", "data-v-fbe83734"]]), rt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, M1 = 6;
function Oa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const S1 = (e) => {
  const t = Oa(e, rt.lineChars), n = Math.max(rt.minWidth, Math.max(...t.map((s) => s.length)) * rt.charWidth + rt.padX * 2);
  return { name: e, lines: t, line: rt.line, padY: rt.padY, width: n, height: t.length * rt.line + rt.padY * 2 };
};
function _1(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function E1(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function A1(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const f = i(d).map((p) => l.get(p));
      return f.length ? f.reduce((p, y) => p + y, 0) / f.length : l.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < M1; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((p) => p[i ? 1 : 0] === f).map((p) => p[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function C1(e, t) {
  const n = /* @__PURE__ */ new Map(), s = (a, o, r, i) => {
    const l = `${a[o]}:${r}`;
    (n.get(l) || n.set(l, []).get(l)).push({ arrow: a, end: o, other: i });
  };
  e.forEach((a) => {
    s(a, "from", a.back ? "top" : "bottom", a.to), s(a, "to", a.back ? "bottom" : "top", a.from);
  });
  for (const a of n.values())
    a.sort((o, r) => t.get(o.other).x - t.get(r.other).x), a.forEach(({ arrow: o, end: r }, i) => o[`${r}Share`] = (i + 1) / (a.length + 1));
}
function O1(e) {
  const t = [...new Set(e.flatMap(([_, v]) => [_, v]))], n = new Set(e.map(([, _]) => _)), s = t.filter((_) => !n.has(_)), a = _1(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((_, v) => !a.has(v)), r = E1(t, o), i = A1(t, o, r), l = new Map(t.map((_) => [_, S1(_)])), u = i.map((_) => _.reduce((v, O) => v + l.get(O).width, 0) + je.across * (_.length - 1)), d = Math.max(...u) + je.margin * 2, f = I1(e, r, i.length), p = /* @__PURE__ */ new Map();
  let y = je.margin;
  i.forEach((_, v) => {
    let O = (d - u[v]) / 2;
    const w = Math.max(..._.map((I) => l.get(I).height));
    _.forEach((I) => {
      const x = l.get(I);
      p.set(I, { ...x, x: O, y: y + (w - x.height) / 2 }), O += x.width + je.across;
    }), y += w + (f[v] ?? je.down);
  });
  const k = e.map(([_, v, O], w) => ({ from: _, to: v, label: O || "", back: a.has(w) || r.get(v) <= r.get(_) }));
  C1(k, p);
  const $ = k.map((_) => R1(_, p.get(_.from), p.get(_.to))), S = [...p.values()], C = D1($, S), F = Math.max(y - je.down, ...C.filter((_) => _.label).map((_) => _.label.y + _.label.height));
  return { width: Math.max(d - je.margin, ...C.filter((_) => _.label).map((_) => _.label.x + _.label.width)) + je.margin, height: F + je.margin, nodes: S, arrows: C };
}
const T1 = (e) => e ? Oa(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function I1(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += T1(r) + je.labelSpace);
  }), s.map((a) => Math.max(je.down, a));
}
function R1(e, t, n) {
  const s = e.label ? Oa(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((p) => p.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const B1 = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, L1 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], N1 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function D1(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = B1(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = N1.flatMap((l) => L1.map((u) => a(u, l))).find((l) => !n.some((u) => uo(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => uo(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const uo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, P1 = { class: "flowchart-tools" }, j1 = ["width", "height", "viewBox", "aria-label"], q1 = ["d"], F1 = ["x", "y", "width", "height"], W1 = ["x", "y"], H1 = ["x", "dy"], U1 = {
  key: 0,
  class: "flowchart-label"
}, z1 = ["x", "y", "width", "height"], V1 = ["x", "y"], G1 = ["x", "dy"], K1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => O1(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = T(null), i = T({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var C;
      const $ = (C = r.value) == null ? void 0 : C.getBoundingClientRect();
      if (!($ != null && $.width)) return;
      const S = Math.min($.width / a.value.width, $.height / a.value.height, 1.5);
      i.value = { zoom: S, x: ($.width - a.value.width * S) / 2, y: ($.height - a.value.height * S) / 2 };
    }
    function d($, S, C) {
      const { zoom: F, x: Z, y: _ } = i.value, v = Math.min(o.most, Math.max(o.least, F * $));
      i.value = { zoom: v, x: S - (S - Z) * v / F, y: C - (C - _) * v / F };
    }
    function f($) {
      const S = r.value.getBoundingClientRect();
      d($, S.width / 2, S.height / 2);
    }
    function p($) {
      const S = r.value.getBoundingClientRect();
      $.ctrlKey || $.metaKey ? d($.deltaY < 0 ? o.step : 1 / o.step, $.clientX - S.left, $.clientY - S.top) : i.value = { ...i.value, x: i.value.x - $.deltaX, y: i.value.y - $.deltaY };
    }
    function y($) {
      var S, C, F;
      $.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), l = { x: $.clientX - i.value.x, y: $.clientY - i.value.y }, (F = (C = r.value).setPointerCapture) == null || F.call(C, $.pointerId);
    }
    function k($) {
      l && (i.value = { ...i.value, x: $.clientX - l.x, y: $.clientY - l.y });
    }
    return Ne(u), ($, S) => (c(), V(gr, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (C) => s("close"))
    }, {
      default: P(() => [
        g("div", P1, [
          R(he, {
            small: "",
            onClick: S[0] || (S[0] = (C) => f(o.step))
          }, {
            default: P(() => [...S[5] || (S[5] = [
              se("Zoom in", -1)
            ])]),
            _: 1
          }),
          R(he, {
            small: "",
            onClick: S[1] || (S[1] = (C) => f(1 / o.step))
          }, {
            default: P(() => [...S[6] || (S[6] = [
              se("Zoom out", -1)
            ])]),
            _: 1
          }),
          R(he, {
            small: "",
            onClick: u
          }, {
            default: P(() => [...S[7] || (S[7] = [
              se("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: be(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: k,
          onPointerup: S[2] || (S[2] = (C) => za(l) ? l.value = null : l = null),
          onPointercancel: S[3] || (S[3] = (C) => za(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: me({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            S[8] || (S[8] = g("defs", null, [
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
            (c(!0), h(K, null, ee(a.value.arrows, (C, F) => (c(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, q1))), 128)),
            (c(!0), h(K, null, ee(a.value.nodes, (C) => (c(), h("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, F1),
              g("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (c(!0), h(K, null, ee(C.lines, (F, Z) => (c(), h("tspan", {
                  key: Z,
                  x: C.x + C.width / 2,
                  dy: Z ? C.line : 0
                }, b(F), 9, H1))), 128))
              ], 8, W1)
            ]))), 128)),
            (c(!0), h(K, null, ee(a.value.arrows, (C, F) => (c(), h(K, {
              key: `label-${F}`
            }, [
              C.label ? (c(), h("g", U1, [
                g("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, z1),
                g("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (c(!0), h(K, null, ee(C.label.lines, (Z, _) => (c(), h("tspan", {
                    key: _,
                    x: C.label.x + C.label.width / 2,
                    dy: _ ? C.label.line : 0
                  }, b(Z), 9, G1))), 128))
                ], 8, V1)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, j1))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Y1 = /* @__PURE__ */ Y(K1, [["__scopeId", "data-v-51d24cfe"]]), fo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', ho = {
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
  agent: fo,
  worker: fo,
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
}, J1 = ["innerHTML"], Z1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => ho[t.name] || ho.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, J1));
  }
}, at = /* @__PURE__ */ Y(Z1, [["__scopeId", "data-v-beb5935c"]]), X1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      R(at, { name: "fold" })
    ], 2));
  }
}, Dt = /* @__PURE__ */ Y(X1, [["__scopeId", "data-v-d03899bb"]]), Q1 = ["data-tip", "aria-label"], em = {
  key: 0,
  class: "mact-word"
}, tm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      R(at, { name: "open" }),
      e.open ? (c(), h("span", em, b(e.label), 1)) : A("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, Q1));
  }
}, ti = /* @__PURE__ */ Y(tm, [["__scopeId", "data-v-3b292e09"]]), ni = 120, Bn = 280, si = 160, nm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, sm = ["leaving", "resizing", "entering"];
function ea(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function am(e) {
  const t = sm.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = ea(e);
  return e.classList.add(...t), n;
}
function ai(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = T(t()), a = T("");
  let o = 0;
  const r = (f, p) => Object.assign(f.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function l(f, p) {
    i(f);
    const y = am(f);
    r(f, p), f.offsetWidth, f.style.transition = `width ${Bn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Bn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, y);
  }
  function u(f) {
    const p = f.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const k = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, l(f, ea(f)));
    });
    return k.observe(p), k;
  }
  async function d(f) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || nm()) {
      s.value = f;
      return;
    }
    const k = ea(p);
    if (r(p, k), a.value = "leaving", await n(ni), y !== o) return;
    s.value = f, a.value = "resizing", await pt(), l(p, k);
    const $ = u(p);
    await n(Bn), $ == null || $.disconnect(), y === o && (i(p), a.value = "entering", await n(si), y === o && (a.value = ""));
  }
  return pe(t, (f) => d(f)), qt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const om = { class: "growing-card-top" }, rm = ["aria-expanded"], im = { class: "growing-card-avatar" }, lm = { class: "growing-card-title" }, cm = { class: "growing-card-more" }, um = { class: "growing-card-body" }, dm = {
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
    const n = e, s = t, a = T(!1), o = T(null), { folded: r, phase: i } = ai(o, () => !a.value), l = B(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = B(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(i), { open: !U(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", om, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (p) => a.value = !a.value)
        }, [
          g("span", im, [
            e.bad ? (c(), V(at, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(K, { key: 1 }, [
              se(b(l.value), 1)
            ], 64)) : (c(), V(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", lm, b(e.title), 1),
          R(Dt, { open: a.value }, null, 8, ["open"])
        ], 8, rm),
        e.action ? (c(), V(ti, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (p) => s("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (p) => s("comment"))
        }, [
          R(ve, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      g("div", cm, [
        g("div", um, [
          (c(!0), h(K, null, ee(u.value, (p, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, b(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, fm = /* @__PURE__ */ Y(dm, [["__scopeId", "data-v-08411e3a"]]), hm = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, mm = {
  key: 0,
  class: "message-links-many"
}, pm = ["aria-expanded"], gm = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, vm = ["onClick"], ym = { class: "row-pill message-links-chip" }, km = { class: "message-links-title" }, vs = 3, mo = "task", wm = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = _e(Ae, null), s = B(() => t.links.length), a = B(() => t.links.every((p) => p.model === mo) ? "tasks" : "items"), o = B(() => `Linked: ${t.links.map((p) => `${p.model} ${p.id}`).join(" ")}`), r = T(!1), i = T({}), l = T(null);
    nr(l, () => r.value = !1);
    async function u() {
      const p = t.links.filter((k) => k.model === mo && !(k.id in i.value)), y = await Promise.all(p.map((k) => n.read(`task show ${k.id}`)));
      i.value = { ...i.value, ...Object.fromEntries(y.filter((k) => k.ok).map((k) => [k.value.id, k.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(p) {
      r.value = !1, Fe(`${et(p.model)}:${p.id}`);
    }
    return (p, y) => (c(), h("div", {
      ref_key: "line",
      ref: l,
      class: J(["message-links", { many: s.value > vs, three: s.value === vs, open: r.value }]),
      "data-message-links": ""
    }, [
      R(at, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", hm, [
        R(dt, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      s.value >= vs ? (c(), h("span", mm, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          se(b(s.value) + " linked " + b(a.value) + " ", 1),
          R(Dt, { open: r.value }, null, 8, ["open"])
        ], 8, pm)
      ])) : A("", !0),
      r.value ? (c(), h("div", gm, [
        (c(!0), h(K, null, ee(e.links, (k) => (c(), h("button", {
          key: `${k.model}:${k.id}`,
          type: "button",
          class: "message-links-row",
          onClick: ($) => f(k)
        }, [
          g("span", ym, b(k.model) + " " + b(k.id), 1),
          g("span", km, b(i.value[k.id]), 1)
        ], 8, vm))), 128))
      ])) : A("", !0)
    ], 2));
  }
}, bm = /* @__PURE__ */ Y(wm, [["__scopeId", "data-v-24868afd"]]), xm = ["title", "aria-label"], $m = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Mm = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Sm = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = B(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: J(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", $m, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", Mm)) : A("", !0)
      ]))
    ], 10, xm));
  }
}, _m = /* @__PURE__ */ Y(Sm, [["__scopeId", "data-v-6dc92808"]]);
function Em(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Am(e, t = Date.now()) {
  const n = Em(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Cm = 36e5;
function f5(e, t, n, s = Date.now()) {
  const a = ((n ? Date.parse(n) : s) - Date.parse(t)) / Cm;
  return a > 0 && e ? Math.round(e / a) : 0;
}
function oi(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function po(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ys = (e) => String(e).padStart(2, "0");
function Om(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ys(t % 60)}s` : `${Math.floor(t / 3600)}h ${ys(Math.floor(t % 3600 / 60))}m ${ys(t % 60)}s`;
}
const Tm = "img,pre,table";
function Im(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Rm(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Bm(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Tm)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = e.offsetHeight, a = Im(Rm(e), n || 0);
  a && (a >= e.offsetWidth || (e.style.width = `${a}px`, e.offsetHeight !== s && (e.style.width = "")));
}
function Lm(e, t) {
  let n = null;
  const s = () => e.value && Bm(e.value);
  Ne(() => {
    var o, r;
    if (s(), (o = document.fonts) == null || o.ready.then(s), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), pe(t, s, { flush: "post" });
}
const Nm = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Dm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Pm = ["data-incoming", "data-ref"], jm = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], qm = { class: "message-body" }, Fm = ["title"], Wm = ["innerHTML"], Hm = ["title"], Um = ["innerHTML"], zm = {
  class: "message-faces",
  "data-message-faces": ""
}, Vm = ["title", "data-face", "onClick"], Gm = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, Km = ["title", "data-reaction", "onClick"], Ym = {
  key: 0,
  class: "message-reaction-count"
}, Jm = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Zm = ["href", "title"], Xm = ["src", "alt"], Qm = ["href"], ep = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, tp = ["data-sent-worker", "title", "onClick"], np = { class: "message-foot" }, sp = { class: "message-time" }, ap = {
  class: "message-id",
  "data-message-id": ""
}, op = 140, rp = 2, ip = 1500, lp = "An earlier message", cp = "about", up = "sent_to", dp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var j;
    const n = e, s = t, a = T(!1), o = T(null), r = B(() => ["user", "comment"].includes(n.message.type)), i = B(() => {
      const [D, X] = (n.message.commented_row || ":").split(":"), G = et(D);
      return G ? { ref: `${G}:${X}`, label: `${Ht(G).title.toLowerCase()} ${X}` } : null;
    }), l = B(() => n.message.worker_id ?? null), u = T(!1), d = B(() => l.value !== null && ((n.message.text ?? "").length > op || (n.message.text ?? "").split(`
`).filter((D) => D.trim()).length > rp)), f = B(() => r.value && !n.message.read_at && !n.message.local);
    async function p() {
      var D;
      await ((D = navigator.clipboard) == null ? void 0 : D.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, ip);
    }
    const y = B(() => Zs(n.message.text ?? "", { env: "" })), k = B(() => JSON.parse(n.message.flowchart_edges || "[]")), $ = T(!1), S = B(() => Zs(n.quote || lp, { env: "" }));
    function C() {
      const D = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      D ? D.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    Lm(o, () => `${n.message.text} ${n.quote}`);
    const F = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, Z = (D) => `/api/files/message/${n.message.id}/${encodeURIComponent(D)}`, _ = B(() => JSON.parse(n.message.captions || "{}")), v = B(() => (n.message.files ?? []).map((D) => ({ name: D, address: Z(D), isImage: F.test(D), title: _.value[D] || D }))), O = B(() => oi(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), w = _e(Ae, null), I = T([]), x = T([]);
    async function E() {
      if (!r.value || !(w != null && w.read) || n.message.local) return;
      const D = await w.read(`link list --source message:${n.message.id}`);
      if (!D.ok) return;
      const X = D.value.rows ?? D.value ?? [];
      I.value = X.filter((G) => G.link_type === cp).map((G) => ({ model: G.target_model, id: G.target_id })), x.value = X.filter((G) => G.link_type === up).map((G) => G.target_id);
    }
    E(), (j = w == null ? void 0 : w.follow) == null || j.call(w, ["link.*"], E);
    const M = T(!1), m = B(() => Dm(n.message.reactions));
    function L(D) {
      M.value = !1, s("react", n.message, D);
    }
    return (D, X) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      R(fm, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: X[0] || (X[0] = (G) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Pm)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", qm, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: i.value }]),
          onClick: X[6] || (X[6] = (...G) => U(Bt) && U(Bt)(...G))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: X[1] || (X[1] = be((G) => U(Fe)(i.value.ref), ["stop"]))
          }, [
            R(ve, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + b(i.value.label), 1)
          ], 8, Fm)) : A("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(C, ["stop"]),
            innerHTML: S.value
          }, null, 8, Wm)) : A("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: X[2] || (X[2] = be((G) => U(Fe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + b(l.value), 9, Hm)) : A("", !0),
          g("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Um),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: X[3] || (X[3] = be((G) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          k.value.length ? (c(), h(K, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: X[4] || (X[4] = (G) => $.value = !0)
            }, "Open the flowchart"),
            $.value ? (c(), V(Y1, {
              key: 0,
              title: e.message.text,
              edges: k.value,
              onClose: X[5] || (X[5] = (G) => $.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        g("div", {
          class: J(["message-tools", { picking: M.value }]),
          "data-message-tools": ""
        }, [
          M.value ? (c(), h(K, { key: 0 }, [
            g("div", zm, [
              (c(!0), h(K, null, ee(U(Nm), (G) => (c(), h("button", {
                key: G,
                type: "button",
                class: "message-face",
                title: `React ${G}`,
                "data-face": G,
                onClick: (ue) => L(G)
              }, b(G), 9, Vm))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: X[7] || (X[7] = (G) => M.value = !1)
            }, [
              R(ve, {
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
              onClick: X[8] || (X[8] = (G) => M.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: X[9] || (X[9] = (G) => s("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: p
            }, b(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: X[10] || (X[10] = (G) => s("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      m.value.length ? (c(), h("div", Gm, [
        (c(!0), h(K, null, ee(m.value, (G) => (c(), h("button", {
          key: G.emoji,
          type: "button",
          class: J(["message-reaction", { mine: G.mine }]),
          title: G.title,
          "data-reaction": G.emoji,
          onClick: (ue) => s("react", e.message, G.emoji)
        }, [
          se(b(G.emoji) + " ", 1),
          G.count > 1 ? (c(), h("span", Ym, b(G.count), 1)) : A("", !0)
        ], 10, Km))), 128))
      ])) : A("", !0),
      v.value.length ? (c(), h("div", Jm, [
        (c(!0), h(K, null, ee(v.value, (G) => (c(), h(K, {
          key: G.name
        }, [
          G.isImage ? (c(), h("a", {
            key: 0,
            href: G.address,
            target: "_blank",
            class: "message-image",
            title: G.title
          }, [
            g("img", {
              src: G.address,
              alt: G.name,
              "data-figure-picture": ""
            }, null, 8, Xm)
          ], 8, Zm)) : (c(), h("a", {
            key: 1,
            href: G.address,
            target: "_blank",
            class: "message-file"
          }, b(G.name), 9, Qm))
        ], 64))), 128))
      ])) : A("", !0),
      x.value.length ? (c(), h("div", ep, [
        R(ve, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, ee(x.value, (G) => (c(), h("button", {
          key: G,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": G,
          title: `Open worker ${G}`,
          onClick: be((ue) => U(Fe)(`agents:${G}`), ["stop"])
        }, "Also sent to worker " + b(G), 9, tp))), 128))
      ])) : A("", !0),
      g("div", np, [
        g("time", sp, b(O.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          X[11] || (X[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", ap, "message " + b(e.message.id), 1)
        ], 64)) : A("", !0),
        r.value ? (c(), V(_m, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      I.value.length ? (c(), V(bm, {
        key: 3,
        links: I.value
      }, null, 8, ["links"])) : A("", !0)
    ], 8, jm));
  }
}, h5 = /* @__PURE__ */ Y(dp, [["__scopeId", "data-v-f1ee602a"]]), fp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = ll("SkeletonParts", !0);
      return c(!0), h(K, null, ee(e.parts, (l, u) => (c(), h(K, { key: u }, [
        (c(!0), h(K, null, ee(l.count, (d) => (c(), V(Ft, {
          key: d,
          value: l.shape
        }, {
          line: P(() => [
            g("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: me({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: P(() => [
            g("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: me({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: P(() => [
            g("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: me({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: P(() => [...r[0] || (r[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: P(() => [
            g("div", {
              class: "skeleton-row",
              style: me(s(l))
            }, [
              R(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            g("div", {
              class: "skeleton-stack",
              style: me(s(l))
            }, [
              R(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: P(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: me(s(l))
            }, [
              R(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            g("div", {
              class: "skeleton-grid",
              style: me(a(l))
            }, [
              R(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), hp = /* @__PURE__ */ Y(fp, [["__scopeId", "data-v-576c95e1"]]), mp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, pp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", mp, [
      R(hp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ri = /* @__PURE__ */ Y(pp, [["__scopeId", "data-v-52f66b64"]]), Wn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ks = 200, ii = (e) => {
  var t;
  return ((t = Wn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Wn[0].key;
}, m5 = (e) => {
  var t;
  return ((t = Wn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, gp = ["aria-label"], vp = 300, go = 400, yp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ks } },
  setup(e) {
    const t = e, n = B(() => ii(t.value)), s = B(() => n.value < ks ? [1, 0.25, 0.25] : n.value === ks ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= go, high: n.value >= vp && n.value < go }]),
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
        style: me({ opacity: s.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: me({ opacity: s.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: me({ opacity: s.value[2] })
      }, null, 4)
    ], 10, gp));
  }
}, p5 = /* @__PURE__ */ Y(yp, [["__scopeId", "data-v-b10e610f"]]), kp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, vo = (e) => kp[e.card.state] || "idle", wp = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), yo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, ko = (e, t) => yo[vo(e)] - yo[vo(t)], wo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, g5 = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => ko(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || wp(s, a)) : [...e].sort((s, a) => ko(s, a) || (wo[t] || wo.state)(s, a)), bp = { class: "list-row" }, xp = {
  key: 0,
  class: "list-row-kind"
}, $p = { class: "list-row-main" }, Mp = {
  key: 0,
  class: "list-row-title"
}, Sp = { class: "list-row-body" }, _p = {
  key: 1,
  class: "list-row-end"
}, Ep = {
  key: 1,
  class: "list-row-text"
}, Ap = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", bp, [
      e.kind ? (c(), h("span", xp, b(e.kind), 1)) : A("", !0),
      g("div", $p, [
        e.title ? (c(), h("span", Mp, b(e.title), 1)) : A("", !0),
        g("div", Sp, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", _p, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), h("span", Ep, b(e.text), 1)) : A("", !0)
    ]));
  }
}, v5 = /* @__PURE__ */ Y(Ap, [["__scopeId", "data-v-63155fba"]]), Cp = {
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
}, Op = { claude: "Claude Code", codex: "Codex" }, Tp = ["aria-expanded"], Ip = { class: "drop-label" }, Rp = ["value"], Bp = {
  key: 1,
  class: "drop-lead"
}, Lp = { class: "drop-item-text" }, Np = {
  key: 2,
  class: "drop-note"
}, Dp = {
  key: 1,
  class: "drop-none"
}, Pp = {
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
    const n = e, s = t, a = T(!1), o = T(null), r = T(""), i = B(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function l(u) {
      a.value = !1, s("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: J(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => a.value = !a.value)
      }, [
        e.icon ? (c(), V(ve, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        g("span", Ip, b(e.label), 1),
        R(ve, {
          name: "down",
          size: 11
        })
      ], 10, Tp),
      a.value ? (c(), V(Yn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => a.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, Rp)) : A("", !0),
          (c(!0), h(K, null, ee(i.value, (f) => (c(), V(Mt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (p) => l(f)
          }, {
            default: P(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: J(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (c(), h("span", Bp, b(f.lead), 1)) : A("", !0),
              g("span", Lp, b(f.label), 1),
              f.note ? (c(), h("span", Np, b(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? A("", !0) : (c(), h("p", Dp, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, jp = /* @__PURE__ */ Y(Pp, [["__scopeId", "data-v-29dfcce5"]]), y5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(() => [
      ...Cp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = B(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, i) => (c(), V(jp, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(Op)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, qp = ["aria-label"], Fp = { class: "head" }, Wp = { class: "names" }, Hp = { class: "body" }, Up = {
  key: 0,
  class: "foot"
}, zp = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = hr(s, n), i = mr(a);
    return (l, u) => (c(), V(pa, { to: "body" }, [
      R(jt, {
        name: "side",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: P(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: me({ "--depth": e.depth, zIndex: U(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => U(o) && U(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                g("header", Fp, [
                  g("div", Wp, [
                    g("h2", null, b(e.title), 1),
                    e.abstract ? (c(), V(dt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ce(l.$slots, "actions", {}, void 0, !0),
                  R(Xn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", Hp, [
                  ce(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Up, [
                  ce(l.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : ce(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, qp)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, k5 = /* @__PURE__ */ Y(zp, [["__scopeId", "data-v-c9a3f43a"]]), Vp = {
  key: 1,
  class: "text-field-label"
}, Gp = {
  key: 2,
  class: "text-field-end"
}, Kp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qs({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = js(e, "modelValue"), s = Kn(), a = "onUpdate:modelValue" in (((d = cl()) == null ? void 0 : d.vnode.props) || {}), o = B(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = B(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = B(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = T(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, p) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, U(s).class]),
      style: me(U(s).style)
    }, [
      e.icon ? (c(), V(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), h("span", Vp, b(e.label), 1)) : A("", !0),
      st(g("input", nt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [U(zs), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Gp, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : st((c(), h("input", nt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [U(zs), o.value]
    ]);
  }
}), w5 = /* @__PURE__ */ Y(Kp, [["__scopeId", "data-v-d9c38ca8"]]), bo = (e) => e.page * e.size < e.total;
function b5(e) {
  const t = Wt().sources.find((n) => n.key === e);
  return t ? ta(t.read, t.events) : ta("", []);
}
function ta(e, t, { incremental: n = !1 } = {}) {
  const s = Wt(), a = T([]), o = T(null), r = T(""), i = T(!1), l = performance.now(), u = T(!1), d = T(""), f = T(null);
  async function p(_) {
    const v = $, O = await s.read(`${e} --before-id ${_ + 1} --limit 1`);
    if (v !== $) return;
    if (!O.ok) return C();
    const w = O.value.rows.find((I) => I.id === _);
    a.value = w ? a.value.map((I) => I.id === _ ? w : I) : a.value.filter((I) => I.id !== _);
  }
  async function y(_) {
    if (n && String((_ == null ? void 0 : _.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((E) => E.id !== _.row_id));
    if (n && (_ != null && _.row_id) && !String(_.event ?? "").endsWith(".create") && a.value.some((E) => E.id === _.row_id)) return p(_.row_id);
    if (!(n && a.value.length && String((_ == null ? void 0 : _.event) ?? "").endsWith(".create"))) return C();
    const O = Math.max(...a.value.map((E) => E.id)), w = $, I = await s.read(`${e} --after-id ${O}`);
    if (w !== $) return;
    if (!I.ok) return C();
    const x = new Set(a.value.map((E) => E.id));
    a.value = [...I.value.rows.filter((E) => !x.has(E.id)), ...a.value];
  }
  async function k() {
    if (!a.value.length) return !1;
    const _ = $, v = Math.min(...a.value.map((I) => I.id)), O = await s.read(`${e} --before-id ${v}`);
    if (_ !== $) return !1;
    if (!O.ok || !O.value.rows.length) return u.value = !1;
    u.value = bo(O.value);
    const w = new Set(a.value.map((I) => I.id));
    return a.value = [...a.value, ...O.value.rows.filter((I) => !w.has(I.id))], !0;
  }
  let $ = 0;
  async function S(_) {
    const v = ++$, O = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (v !== $) return;
    const w = O.ok ? s.shared ? [O.value] : O.value.rows : [];
    a.value = _(w), o.value = O.ok ? O.value : null;
    const I = w.length ? Math.min(...w.map((x) => x.id)) : 0;
    O.ok && !a.value.some((x) => x.id < I) && (u.value = !s.shared && bo(O.value)), r.value = O.ok ? "" : O.error, ka(l, () => i.value = !0);
  }
  function C() {
    return S((_) => {
      if (!n || !_.length) return _;
      const v = Math.min(..._.map((w) => w.id)), O = Math.max(..._.map((w) => w.id));
      return [...a.value.filter((w) => w.id > O), ..._, ...a.value.filter((w) => w.id < v)];
    });
  }
  const F = () => S((_) => _);
  async function Z(_, v = null) {
    const O = a.value;
    v && (a.value = v(O));
    const w = await s.run(_);
    return v && !w.ok && (a.value = O), d.value = w.ok ? "" : w.error, f.value = w.ok ? w.value : null, await C(), w;
  }
  return e && (s.follow(t, y), C()), { rows: a, listing: o, failure: r, loaded: i, more: u, load: C, loadLatest: F, older: k, act: Z, actionFailure: d, answer: f, context: s };
}
const Yp = { class: "title" }, Jp = { class: "state" }, Zp = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = ta(t.line, t.events);
    return (o, r) => (c(), V(Xu, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        g("span", Yp, b(i.title), 1),
        g("span", Jp, b(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, x5 = /* @__PURE__ */ Y(Zp, [["__scopeId", "data-v-a69084cd"]]);
function Xp(e = 1e3, t = null) {
  const n = T(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, a, { immediate: !0 }) : a(!0), Te(() => clearInterval(s)), n;
}
const ws = T(Date.now() / 1e3);
let xo = 0, En = 0;
function Qp() {
  return En || (ws.value = Date.now() / 1e3, xo = setInterval(() => ws.value = Date.now() / 1e3, 1e3)), En += 1, Xo() && Qo(() => {
    En -= 1, En || clearInterval(xo);
  }), ws;
}
const eg = 200, tg = ni + Bn + si + eg;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: s, height: a } = e.getBoundingClientRect();
  return { x: t, y: n, width: s, height: a, opacity: getComputedStyle(e).opacity };
}
function ng(e, t, n) {
  var s, a;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Yt(e),
    top: Yt(e.querySelector(".top")),
    title: Yt(e.querySelector(".title")),
    contents: Yt(e.querySelector(":scope > :not(.top)")),
    scroll: ((s = e.closest(".history")) == null ? void 0 : s.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var r, i, l, u;
      return `${((i = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : i.className) || ((u = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: u, display: d }) => ({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: u, display: d }))(getComputedStyle(e)),
    parent: Yt(e.parentElement),
    parentClasses: ((a = e.parentElement) == null ? void 0 : a.className) ?? ""
  };
}
function sg(e, t, n, s) {
  pe(t, (a) => {
    var u;
    const o = e.value;
    if (!o || !(s != null && s.run) || !((u = s.markMotion) != null && u.value)) return;
    const r = performance.now(), i = [];
    function l() {
      if (s.markMotion.value) {
        if (i.push(ng(o, r, n.value)), performance.now() - r < tg) return void requestAnimationFrame(l);
        s.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: a, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    l();
  }, { flush: "sync" });
}
const ag = ["title", "data-figure-mark", "data-folded", "data-open"], og = {
  key: 2,
  class: "worker"
}, rg = { class: "head" }, ig = { key: 0 }, lg = {
  key: 3,
  class: "status"
}, cg = {
  key: 0,
  class: "figure"
}, ug = {
  key: 1,
  class: "ran-for"
}, dg = { key: 2 }, fg = {
  key: 3,
  class: "news"
}, hg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, mg = {
  key: 6,
  class: "settled"
}, pg = {
  key: 1,
  class: "bar"
}, gg = {
  key: 3,
  class: "detail body"
}, vg = {
  key: 0,
  class: "body-label"
}, yg = ["title"], kg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Kn(), s = ["onClick", "onAct"], a = B(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = T(!1), r = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = B(() => t.open !== void 0), l = B(() => i.value || r.value), u = B(() => i.value ? t.open : o.value), d = B(() => i.value ? !t.open : r.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), p = B(() => l.value || f.value || !!n.onClick), y = T(null), k = T(null), { folded: $, phase: S } = ai(y, () => d.value);
    sg(y, d, S, _e(Ae, null));
    function C(le) {
      var ke, Re;
      if (!(le.target !== y.value && !k.value.contains(le.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Re = n.onAct || n.onClick) == null || Re(le);
      }
    }
    const F = (le) => n.onAct(le), Z = ["failed", "unfinished"], _ = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Z.includes(t.mark.state) ? "danger" : "good" : ""), v = B(() => t.mark.color ? t.mark.color : _.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : _.value ? `var(--tone-${_.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), O = B(() => v.value || "var(--tone-work)"), w = B(() => !t.mark.ending && !t.mark.ended && _.value !== "stopped"), I = Qp(), x = B(
      () => t.mark.began_at && w.value && !t.mark.figure && !t.mark.counting ? Om(I.value - t.mark.began_at) : ""
    ), E = B(() => {
      const { started: le, ended: ke } = t.mark;
      return le ? ke ? `ran ${po(ke - le, !0)}` : po(I.value - le, !0) : x.value;
    }), M = ["bad", "danger", "warn"], m = B(() => M.includes(_.value) || t.mark.asks ? "attention" : w.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), L = ["bad", "danger"], j = B(() => L.includes(_.value)), D = B(() => m.value === "process" ? "running" : j.value ? "cross" : _.value === "stopped" ? "stopped" : _.value === "good" ? "tick" : ""), X = B(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || D.value || t.mark.settled || t.mark.news)
    ), G = B(() => [t.mark.title, t.mark.time ? oi(t.mark.time) : ""].filter(Boolean).join(" · ")), ue = B(() => ({
      ...v.value ? { "--mark": v.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ke) => (c(), h("div", nt(a.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${m.value}`,
        U(S),
        {
          open: u.value,
          folding: i.value && d.value,
          live: p.value,
          failed: j.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: v.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ue.value,
      title: G.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U($) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (c(), V(_t(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: k,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: P(() => [
          e.mark.markIcon ? (c(), V(at, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), V(ve, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", og, b(e.mark.worker), 1)) : A("", !0),
          g("span", rg, [
            R(dt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", ig, b(e.mark.name), 1)) : A("", !0),
            l.value ? (c(), V(Dt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          X.value ? (c(), h("span", lg, [
            e.mark.figure ? (c(), h("span", cg, b(e.mark.figure), 1)) : A("", !0),
            E.value ? (c(), h("span", ug, b(E.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), h("span", dg, "Stopping")) : A("", !0),
            e.mark.news ? (c(), h("span", fg, b(e.mark.news), 1)) : A("", !0),
            D.value === "running" ? (c(), h("span", hg)) : D.value ? (c(), V(at, {
              key: 5,
              class: J(["sign", D.value]),
              name: D.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), h("span", mg, b(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), V(ti, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(F, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && w.value ? (c(), h("span", pg, [
        g("span", {
          class: "progress",
          style: me({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: O.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !U($) ? (c(), V(dt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !U($) ? (c(), h("div", gg, [
        e.mark.bodyLabel ? (c(), h("p", vg, b(e.mark.bodyLabel), 1)) : A("", !0),
        R(dt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !U($) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, yg)) : A("", !0),
      e.mark.card ? (c(), V(dt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ce(le.$slots, "default", {
        shown: !U($)
      }, void 0, !0)
    ], 16, ag));
  }
}), li = /* @__PURE__ */ Y(kg, [["__scopeId", "data-v-b4038573"]]), wg = 60;
function bg(e, t) {
  const n = T([]), s = T(0);
  let a = -1, o = 0, r = !1;
  async function i() {
    const d = await e(["output", "page", String(t())]);
    return d.ok && (n.value = d.value.lines, s.value = d.value.first_byte, a = d.value.last_byte, o = d.value.cut_bytes), d;
  }
  async function l() {
    if (a < 0) return i();
    const d = await e(["output", "page", String(t()), "--after", String(a)]);
    return d.ok ? d.value.cut_bytes !== o || d.value.total < a ? i() : (d.value.lines.length && (n.value = [...n.value, ...d.value.lines]), a = d.value.last_byte, d) : d;
  }
  async function u(d) {
    if (r || s.value <= 0 || d.scrollTop > wg) return;
    r = !0;
    const f = d.scrollHeight, p = await e(["output", "page", String(t()), "--before", String(s.value)]);
    r = !1, p.ok && (n.value = [...p.value.lines, ...n.value], s.value = p.value.first_byte, await pt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: i, follow: l, loadEarlier: u };
}
const xg = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function ci(e) {
  var n;
  const t = xg[e] || ((n = Ht(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const $g = (e) => ci(String(e).split(":")[0]), ui = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Mg = { passed: "good", failed: "danger", warned: "warn", running: "" }, Sg = { good: "good", warn: "warn", danger: "danger" }, $o = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => zu(e.target_model, e.target_id || 0)
}, _g = { "open row": (e) => $g(e.target_model), "open page": () => ci("pages") };
function Eg(e, t) {
  const n = t || {}, s = $o[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Mg[e.outcome] || "" : Sg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? _g[s](e) : "",
    handlers: s ? { onAct: () => $o[s](e) } : {}
  };
}
const Ag = 24, Cg = 1e3, Mo = 2e3, Og = 0.25, Tg = 5e3;
function Ig(e, t = Ag, n = () => !0) {
  const s = T(!1), a = T(0), o = T(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const _ = u();
    return _ ? _.scrollHeight - _.scrollTop - _.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function p(_) {
    if (clearTimeout(r), !_) {
      o.value = !1, l = Date.now();
      return;
    }
    const v = Date.now() - l < Mo ? Mo : Cg;
    r = setTimeout(() => o.value = s.value, v);
  }
  function y() {
    clearTimeout(i), s.value = !1, a.value = 0, p(!1);
  }
  function k(_ = !1) {
    const v = u();
    v && _ && v.scrollTo ? v.scrollTo({ top: v.scrollHeight, behavior: "smooth" }) : v && (v.scrollTop = v.scrollHeight), y();
  }
  function $() {
    C(), !s.value && (s.value = !0, p(!0));
  }
  const S = () => !!u() && d() <= u().clientHeight * Og;
  function C() {
    clearTimeout(i), S() && (i = setTimeout(() => s.value && S() && n() && k(!0), Tg));
  }
  function F() {
    f() ? y() : $();
  }
  function Z(_ = 1, v = !1) {
    s.value ? a.value += Math.max(0, _) : k(v);
  }
  return Xo() && Qo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: y, toBottom: k, left: $, scrolled: F, arrived: Z };
}
const Rg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Bg = (e) => String(e ?? "").replace(Rg, ""), Lg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Ig(a);
    pe(
      () => n.lines.length,
      () => pt(() => i()),
      { immediate: !0 }
    );
    function u(d) {
      r(), s("older", d.target);
    }
    return (d, f) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      se(b(U(Bg)(e.lines.join(`
`)) || e.empty), 1),
      U(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (p) => U(l)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, Ng = /* @__PURE__ */ Y(Lg, [["__scopeId", "data-v-c2fb1783"]]), Dg = 1e4;
class Pg {
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
    return this.heardAt !== null && t - this.heardAt > Dg;
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
const jg = {
  key: 0,
  class: "frame-note"
}, qg = {
  key: 0,
  class: "frame-note"
}, Fg = ["src", "title"], Wg = 1e3, Hg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Wt(), s = T(null), a = T(!1), o = T(!1);
    let r = null, i = 0;
    return Ne(() => {
      r = new Pg(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Wg);
    }), Te(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", jg, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      a.value ? (c(), h("div", qg, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        R(he, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: P(() => [...u[1] || (u[1] = [
            se("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: U(n).window
      }, null, 8, Fg)
    ], 64));
  }
}, Ug = /* @__PURE__ */ Y(Hg, [["__scopeId", "data-v-32a49046"]]);
function zg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Vg = {
  class: "allowance-prompt",
  role: "dialog"
}, Gg = { class: "allowance-prompt-text" }, Kg = { class: "allowance-prompt-buttons" }, Yg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Vg, [
      g("p", Gg, b(U(zg)(e.request)), 1),
      g("div", Kg, [
        R(he, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...a[2] || (a[2] = [
            se("Allow", -1)
          ])]),
          _: 1
        }),
        R(he, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: P(() => [...a[3] || (a[3] = [
            se("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Jg = /* @__PURE__ */ Y(Yg, [["__scopeId", "data-v-102dc765"]]), bs = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), V(jn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        se(b(e.reason) + " ", 1),
        e.retry ? (c(), V(he, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: P(() => [...a[2] || (a[2] = [
            se("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (c(), V(he, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: P(() => [...a[3] || (a[3] = [
            se("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Zg = ["data-window", "data-agent"], Xg = {
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
    const n = e, s = t, a = T(""), o = T(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = _e(Nl, null), l = Fc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
      declared: n.declared,
      page: _e(Lc, null),
      setOption: (f, p) => s("option", f, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, p) => {
        s("open", f, p), i == null || i(f, p);
      }
    });
    ul(Ae, l), pe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ne(l.settle), Te(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), dl((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ma(n.component), d = () => {
      var f, p;
      return ((p = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, p) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), V(Jg, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), V(bs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), V(bs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(K, { key: 4 }, [
        (c(), V(u, { key: o.value })),
        e.skeleton.length && !U(l).answered.value ? (c(), V(ri, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), V(bs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Zg));
  }
}, di = /* @__PURE__ */ Y(Xg, [["__scopeId", "data-v-c4443e2b"]]), Qg = {
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
    const n = e, s = t, a = { render: () => ma(Ug, { src: n.entry.entry_url }) };
    return (o, r) => (c(), V(di, {
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
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: r[0] || (r[0] = (i, l) => s("option", i, l))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "unavailable-reason"]));
  }
}, e0 = ["data-window"], t0 = {
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
    const n = e, s = t, a = ut(null), o = T("");
    return pe(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, ic();
          } catch (i) {
            if (oc(i) && rc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      R(ri, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, e0)) : (c(), V(di, {
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
      sources: e.entry.sources,
      links: e.entry.links,
      search: e.entry.search,
      events: e.entry.events,
      skeleton: e.entry.skeleton,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: i[0] || (i[0] = (l, u) => s("option", l, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, So = "*.*", n0 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null }, environment: { type: String, default: "" } },
  setup(e) {
    var u;
    const t = e, n = _e(Ae, null), s = new Tc(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [So], (d) => s.dispatch(d));
    Te(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? t.environment, r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = B(() => !!(t.declaration.shipped || t.declaration.trusted)), l = B(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [So] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), V(t0, {
      key: 0,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), V(Qg, {
      key: 1,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, s0 = { class: "mark-more-inner" }, a0 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, o0 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, r0 = {
  key: 3,
  class: "mark-lines"
}, i0 = "process", _o = "task", l0 = 2e3, c0 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ae), s = B(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = B(() => ui.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === _o ? t.mark.target_id : 0), r = bg((k) => n.run(k), () => t.mark.target_id), i = r.lines, l = T(!1), u = T(""), d = B(() => t.mark.target_model === i0 && !!t.mark.target_id);
    async function f(k = r.follow) {
      const $ = await k();
      l.value = !0, u.value = $.ok ? "" : $.error;
    }
    let p = null;
    const y = () => clearInterval(p);
    return pe(() => t.shown && d.value, (k) => {
      y(), k && (f(), t.mark.ended_at || (p = setInterval(f, l0)));
    }, { immediate: !0 }), pe(() => t.mark.ended_at, (k) => k && t.shown && d.value && (y(), f(r.newest))), Te(y), (k, $) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: $[1] || ($[1] = be(() => {
      }, ["stop"]))
    }, [
      g("div", s0, [
        e.declaration.body_url ? (c(), V(n0, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(K, { key: 1 }, [
          a.value ? (c(), h(K, { key: 0 }, [
            $[2] || ($[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", a0, b(a.value), 1)
          ], 64)) : A("", !0),
          d.value && u.value ? (c(), h("p", o0, b(u.value), 1)) : d.value && l.value ? (c(), h(K, { key: 2 }, [
            $[3] || ($[3] = g("p", { class: "mark-label" }, "Output", -1)),
            R(Ng, {
              class: "mark-terminal",
              lines: U(i),
              onOlder: U(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : s.value.length ? (c(), h("p", r0, b(s.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: $[0] || ($[0] = be((S) => U(Fe)(`${_o}:${o.value}`), ["stop"]))
          }, "Open task " + b(o.value) + " and its proofs", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, na = /* @__PURE__ */ Y(c0, [["__scopeId", "data-v-3be263ac"]]), u0 = ["title", "aria-label", "onClick"], d0 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, f0 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => yu(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = T(""), a = _e(Ae);
    async function o(r) {
      const i = await fn(r, { id: t.mark.target_id }, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(K, null, [
      (c(!0), h(K, null, ee(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: be((u) => o(l), ["stop"])
      }, [
        R(at, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, u0))), 128)),
      s.value ? (c(), h("span", d0, b(s.value), 1)) : A("", !0)
    ], 64));
  }
}, h0 = /* @__PURE__ */ Y(f0, [["__scopeId", "data-v-7a62c88e"]]);
function fi(e, t) {
  const n = ut(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Le.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const hi = fi("/api/marks", "marks"), $5 = hi.fetchAll, m0 = hi.find, p0 = 2e3;
function mi(e, t, n = p0) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  Ne(async () => {
    await e(), a();
  }), qt(() => clearTimeout(s));
}
const g0 = ["data-ref"], v0 = ["data-ref"], y0 = { class: "mark-row" }, k0 = "dock add", w0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = B(() => m0(s.mark.type)), o = _e(Ae, null), r = B(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = T(null);
    mi(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      y.ok && y.value.rows.length && (i.value = y.value.rows[0].progress);
    }, () => r.value);
    const l = B(() => {
      const y = Eg(s.mark, a.value), k = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && k ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = B(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && ui.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), d = T(!1);
    function f(y) {
      if (l.value.handlers.onAct && !y.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const p = B(() => {
      var y;
      return (((y = a.value) == null ? void 0 : y.buttons) || []).filter((k) => {
        var $;
        return !s.docked || !(($ = k.runs) != null && $.startsWith(k0));
      }).map((k) => ({ ...k, module: a.value.module }));
    });
    return (y, k) => {
      var $, S;
      return ($ = a.value) != null && $.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        R(na, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, g0)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (S = a.value) == null ? void 0 : S.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", y0, [
          R(li, nt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, fl(l.value.handlers), { onClick: f }), hl({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: P(({ shown: C }) => [
                R(na, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: C
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          R(h0, {
            buttons: p.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, v0));
    };
  }
}, b0 = /* @__PURE__ */ Y(w0, [["__scopeId", "data-v-073b7a24"]]), x0 = ["data-ref"], $0 = ["inert"], M0 = { class: "group-fold" }, S0 = { class: "thread-group" }, _0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = T(!1), s = T(!1), a = T(!1), o = T(null);
    pe(n, async (i) => {
      var l;
      s.value = !0, await pt(), (l = o.value) == null || l.offsetHeight, a.value = i;
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
    return (i, l) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      R(li, {
        mark: r.value,
        open: n.value,
        onClick: l[0] || (l[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: J(["group-rows", { open: a.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", M0, [
          g("div", S0, [
            (c(!0), h(K, null, ee(e.group.marks, (u) => (c(), V(b0, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, $0)) : A("", !0)
    ], 8, x0));
  }
}, M5 = /* @__PURE__ */ Y(_0, [["__scopeId", "data-v-45b58b9b"]]);
function E0(e) {
  const t = T(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ne(() => n.observe(e.value)), qt(() => n.disconnect()), t;
}
const A0 = { class: "chat-dock-fold" }, C0 = ["aria-label"], O0 = { class: "chat-dock-head" }, T0 = { class: "chat-dock-inner" }, pi = 700, I0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = T(null), s = T(null), a = E0(s), o = T(!1);
    let r = 0;
    return Ne(() => r = setTimeout(() => o.value = !0, pi)), qt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", A0, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          ce(i.$slots, "edge"),
          g("header", O0, [
            ce(i.$slots, "head")
          ]),
          g("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            g("div", T0, [
              g("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: me(U(a) === null ? null : { height: `${U(a)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  ce(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, C0)
      ])
    ], 2));
  }
}, gi = /* @__PURE__ */ Y(I0, [["__scopeId", "data-v-512883e2"]]), R0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, xs = 5, B0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(xs, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${xs}s`, animationDelay: `${(n - xs).toFixed(2)}s` };
    return (a, o) => (c(), h("span", R0, [
      g("i", { style: s })
    ]));
  }
}, vi = /* @__PURE__ */ Y(B0, [["__scopeId", "data-v-d0c4b012"]]), L0 = { processes: "process", memories: "memory", replies: "reply" }, Eo = (e) => (L0[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, N0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, D0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, P0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], j0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], q0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], F0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], W0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], H0 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? W0(t) : e === "agent" ? [...q0(t), ...j0(t)] : e === "check" ? F0(t) : e === "question" ? P0(t) : ((n = { plan: N0, task: D0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, yi = fi("/api/docks", "docks"), S5 = yi.fetchAll, sa = yi.find, U0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), aa = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), z0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), V0 = (e) => e.kept ? aa("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : aa("keep", "pin", "Pin", `dock keep ${e.id}`), G0 = ["pin", "stop"], K0 = (e) => ({ ...e, iconOnly: G0.includes(e.icon) });
function Y0(e, t) {
  var n;
  return [
    ...z0(e, t) ? [V0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Ht(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    aa("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(K0);
}
const J0 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: U0(e, t),
  buttons: Y0(e, t)
}), Z0 = { class: "dock-title" }, X0 = ["aria-expanded", "title"], Q0 = { class: "chat-dock-acts dock-acts" }, ev = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, tv = {
  key: 1,
  class: "dock-text"
}, nv = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = B(() => sa(s.item.type)), o = T(null), r = B(() => J0(s.item, a.value)), i = _e(Ae), l = T(null);
    let u = 0;
    async function d() {
      var _, v;
      const S = ++u, C = Eo(s.item.target_model ?? ""), F = `${C} show`;
      if (!((v = (_ = a.value) == null ? void 0 : _.reads) != null && v.includes(F))) return;
      const Z = await $t(s.item.type, [C, "show", String(s.item.target_id)], i.environment);
      S === u && (l.value = Z.ok ? { ...Z.value, id: s.item.target_id, kind: C } : { id: s.item.target_id, kind: C });
    }
    pe(() => [s.item.type, s.item.target_model, s.item.target_id, a.value], (S, C, F) => {
      var v;
      const Z = Eo(s.item.target_model ?? "");
      l.value = { id: s.item.target_id, kind: Z }, d();
      const _ = (v = i.subscriptions) == null ? void 0 : v.follow(`dock ${s.item.id}`, [`${Z.replaceAll("-", "_")}.*`], (O) => {
        (!O.row_id || O.row_id === s.item.target_id) && d();
      });
      F(() => {
        u += 1, _ == null || _();
      });
    }, { immediate: !0 });
    const f = T(/* @__PURE__ */ new Set()), p = T("");
    async function y(S) {
      if (S.action === "open") return Fe(`${s.item.target_model}:${s.item.target_id}`);
      S.action === "declared" && (f.value = /* @__PURE__ */ new Set([...f.value, S.label])), p.value = "";
      const F = await fn(S, { id: s.item.target_id }, i.environment);
      (F == null ? void 0 : F.ok) === !1 && (f.value = new Set([...f.value].filter((Z) => Z !== S.label)), p.value = F.error);
    }
    const k = B(() => r.value.buttons.filter((S) => S.action !== "undock" && !f.value.has(S.label))), $ = B(() => r.value.buttons.find((S) => S.action === "undock"));
    return (S, C) => (c(), V(gi, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: P(() => [
        e.leaving ? (c(), V(vi, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0)
      ]),
      head: P(() => {
        var F, Z, _;
        return [
          (F = a.value) != null && F.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(K, { key: 1 }, [
            R(ve, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            g("span", Z0, b(r.value.title), 1)
          ], 64)),
          (Z = a.value) != null && Z.badge ? (c(), h("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, b(a.value.badge), 3)) : A("", !0),
          (_ = a.value) != null && _.draws_head ? A("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: C[0] || (C[0] = (v) => n("fold"))
          }, [
            R(Dt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, X0)),
          g("span", Q0, [
            R(Iu, {
              name: `dock.${e.item.type}`,
              row: l.value,
              environment: U(i).environment,
              "read-only": U(i).readOnly,
              onDone: d
            }, null, 8, ["name", "row", "environment", "read-only"]),
            (c(!0), h(K, null, ee(k.value, (v) => (c(), h(K, {
              key: v.action + v.runs
            }, [
              v.iconOnly ? (c(), V(he, {
                key: 0,
                kind: "icon",
                "aria-label": v.label,
                title: v.label,
                "data-dock-action": v.action,
                onClick: (O) => y(v)
              }, {
                default: P(() => [
                  R(ve, {
                    name: v.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), V(he, {
                key: 1,
                small: "",
                kind: v.primary ? "primary" : "ghost",
                bordered: !v.primary,
                "data-dock-action": v.action,
                onClick: (O) => y(v)
              }, {
                default: P(() => [
                  se(b(v.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          R(Xn, {
            title: $.value.label,
            "data-dock-action": "undock",
            onClick: C[1] || (C[1] = (v) => n("undock", $.value))
          }, null, 8, ["title"])
        ];
      }),
      default: P(() => {
        var F, Z;
        return [
          p.value || e.refusal ? (c(), h("p", ev, b(p.value || e.refusal), 1)) : A("", !0),
          e.item.text && !((F = a.value) != null && F.body_url) ? (c(), h("p", tv, b(e.item.text), 1)) : A("", !0),
          (Z = a.value) != null && Z.body_url ? (c(), V(na, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : A("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, Ao = /* @__PURE__ */ Y(nv, [["__scopeId", "data-v-35aad185"]]), sv = 6, av = 3, Co = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, bt = (e) => !!(e.leaves_at && !e.kept), ov = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!bt(e) || t < e.leaves_at || n.has(e.id)), rv = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => ov(s, t, n)).sort((s, a) => s.id - a.id);
function iv(e, t, n = sv) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const lv = (e, t, n = e) => n < 2 ? !1 : e >= av ? !0 : t, cv = ["title", "aria-label"], uv = { class: "run-chip-in" }, dv = {
  key: 0,
  class: "run-chip-ring"
}, fv = { class: "run-chip-name" }, hv = { class: "run-chip-bar" }, mv = "processes.output", pv = 5e3, gv = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = _e(Ae, null)) == null ? void 0 : d.environment) ?? "", o = T(null), r = B(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = B(() => {
      var f, p;
      return ((f = o.value) == null ? void 0 : f.title) || ((p = o.value) == null ? void 0 : p.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = B(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await $t(mv, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return mi(u, () => r.value, pv), (f, p) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: me({ "--tone": l.value })
      }, [
        U(bt)(e.item) ? (c(), V(vi, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0),
        g("span", uv, [
          r.value ? (c(), h("span", dv)) : (c(), V(at, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", fv, b(i.value), 1)
        ]),
        g("span", hv, [
          g("i", {
            style: me({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, cv);
    };
  }
}, vv = /* @__PURE__ */ Y(gv, [["__scopeId", "data-v-597b05d2"]]), yv = 24, kv = 8, _5 = 420;
function E5({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= yv && e > t ? !0 : e < t && a > kv ? !1 : null;
}
const wv = (e, t) => e === void 0 ? t : e, ki = "journal.viewer.";
function bv(e, t, n) {
  try {
    const s = n.getItem(ki + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function xv(e, t, n) {
  try {
    n.setItem(ki + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function $v(e, t, n = window.localStorage) {
  const s = T(bv(e, t, n));
  return pe(s, (a) => xv(e, a, n), { deep: !0 }), s;
}
const Mv = {
  key: "runs-head",
  class: "dock-runs-head"
}, Sv = { class: "dock-runs-chips" }, _v = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var O;
    const t = e, n = Xp(500), s = T(/* @__PURE__ */ new Set()), a = T(!1), o = T(!1), r = _e(Ae), i = T(/* @__PURE__ */ new Set()), l = T({});
    async function u(w, I) {
      i.value = /* @__PURE__ */ new Set([...i.value, w.id]);
      const x = await fn(I, { id: w.target_id }, r.environment);
      (x == null ? void 0 : x.ok) === !1 && (i.value = new Set([...i.value].filter((E) => E !== w.id)), l.value = { ...l.value, [w.id]: x.error });
    }
    const d = B(() => rv(t.items.filter((w) => !i.value.has(w.id)), n.value, s.value)), f = B(() => iv(d.value.filter((w) => Co(w, sa)), n.value)), p = B(() => d.value.filter((w) => !f.value.includes(w) && !Co(w, sa))), y = B(() => f.value.filter((w) => !bt(w))), k = B(() => (a.value = lv(f.value.length, a.value, y.value.length)) && !o.value), $ = $v(`dock-folded:${((O = ie.identity) == null ? void 0 : O.root) || location.host}`, {}), S = (w) => wv($.value[w.id], t.folded);
    function C(w) {
      $.value = { ...$.value, [w.id]: !S(w) };
    }
    function F(w) {
      $.value = { ...$.value, ...Object.fromEntries(f.value.map((I) => [I.id, I.id !== w.id])) }, o.value = !0;
    }
    function Z() {
      $.value = Object.fromEntries(Object.entries($.value).filter(([w]) => !f.value.some((I) => String(I.id) === w))), o.value = !1;
    }
    function _(w) {
      s.value = /* @__PURE__ */ new Set([...s.value, w.id]);
    }
    function v(w) {
      s.value = new Set([...s.value].filter((I) => I !== w.id));
    }
    return (w, I) => (c(), V(Zo, {
      tag: "div",
      name: "dock",
      duration: U(pi),
      class: "dock-stack"
    }, {
      default: P(() => [
        (c(!0), h(K, null, ee(p.value, (x) => (c(), V(Ao, {
          key: x.id,
          item: x,
          class: J({ timed: U(bt)(x) }),
          leaving: U(bt)(x) && !s.value.has(x.id),
          folded: S(x),
          refusal: l.value[x.id],
          onFold: (E) => C(x),
          onUndock: (E) => u(x, E),
          onMouseenter: (E) => _(x),
          onMouseleave: (E) => v(x)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", Mv, [
          g("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: Z
          }, [
            se(b(f.value.length) + " runs ", 1),
            R(Dt, { open: "" })
          ])
        ])) : A("", !0),
        (c(!0), h(K, null, ee(k.value ? [] : f.value, (x) => (c(), V(Ao, {
          key: x.id,
          item: x,
          class: J({ timed: U(bt)(x) }),
          leaving: U(bt)(x) && !s.value.has(x.id),
          folded: S(x),
          refusal: l.value[x.id],
          onFold: (E) => C(x),
          onUndock: (E) => u(x, E),
          onMouseenter: (E) => _(x),
          onMouseleave: (E) => v(x)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        k.value ? (c(), V(gi, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: P(() => [
            g("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run on a card",
              "data-dock-runs-open": "",
              onClick: I[0] || (I[0] = (x) => o.value = !0)
            }, [
              R(at, { name: "runs" }),
              se(" " + b(f.value.length) + " runs ", 1),
              R(Dt)
            ]),
            g("span", Sv, [
              (c(!0), h(K, null, ee(f.value, (x) => (c(), V(vv, {
                key: x.id,
                item: x,
                onClick: (E) => F(x)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : A("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, A5 = /* @__PURE__ */ Y(_v, [["__scopeId", "data-v-c63f6dea"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Ln = (e) => Math.min(Math.max(e, 0), 1), Ev = (e) => {
  const t = Ln(e);
  return t * t * (3 - 2 * t);
}, vt = (e, t, n) => Ev((e - t) / (n - t));
function C5(e) {
  const t = Ln(e), n = Ln((t - 0.12) / 0.76) * xt.shuffles, s = Math.min(Math.floor(n), xt.shuffles - 1), a = n - s, o = vt(a, 0.26, 0.38) * (1 - vt(a, 0.76, 0.96)), r = vt(a, 0.38, 0.76), i = vt(t, 0, 0.12) * (1 - vt(t, 0.88, 1)), l = vt(a, 0.2, 0.34) * (1 - vt(a, 0.84, 1)), u = Math.sin(Math.PI * Ln((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / xt.shuffles, lift: xt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function O5(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const Oo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, T5 = (e) => Oo[e] ?? Oo.butler, Ta = 2400, Av = 0.05;
function Cv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Av), r = Math.min(t + Ta * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function I5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function Ov(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function R5(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const B5 = (e, t) => ({ ...e, stretch: t.stretch }), L5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, wi = (e, t) => t >= (e.least ?? 0);
function N5(e, t, n) {
  if (!wi(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const D5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Tv = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", To = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), Iv = (e) => e.right > e.left && e.bottom > e.top;
function P5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(Tv)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = To(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = To(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), Iv(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function bi(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[f] || e[d] > o[p]) && (i = -1);
      else {
        const k = (o[f] - e[d]) / y, $ = (o[p] - e[d]) / y;
        r = Math.max(r, Math.min(k, $)), i = Math.min(i, Math.max(k, $));
      }
    }
    if (r > i || s && r >= s.share) continue;
    const l = e.x + (t.x - e.x) * r, u = e.y + (t.y - e.y) * r;
    s = { share: r, x: l, y: u, on: "surface", surface: a.id, dx: l - a.left, dy: u - a.top };
  }
  return s;
}
const Me = {
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
}, on = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Rv = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => Rv(on(e, t, n)), Bv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ft = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, An = ([e, t], n) => e + n() * (t - e);
function Lv(e) {
  return Bv.map(() => {
    const t = An(ft.speed, e), n = An(ft.angle, e) * Math.PI / 180, s = An(ft.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [An(ft.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Nv = Lv(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Dv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ft.gravity * (t[2] - ft.floor))) / ft.gravity;
}
function j5(e, t, n = Nv) {
  const s = Me.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Dv(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= ft.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const q5 = (e, t) => e && Me[e.name] ? { name: e.name, u: t / e.frames } : null;
function F5(e, t) {
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
const W5 = () => Array.from({ length: Me.pogo.count }, (e, t) => Me.pogo.bounce * (t + 1) / Me.pogo.count), Nt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function H5(e, t, n) {
  const { away: s, side: a } = Me.bug_smash, o = a * s * n, [r, i] = [t.left + Nt.margin * n, t.right - Nt.margin * n], l = Math.min(Math.max(e + o + a * Nt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function U5(e, t, n) {
  const s = Me.bug_smash, a = Se(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Nt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Nt.tall * n * (1 - Se(t, s.emerge)),
      turn: 90 * (1 - Se(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - Se(t, s.gone)
    }
  };
}
function z5(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Nt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = Cv({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function V5(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function oa(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Ie.margin, r = ((e.along - Ie.margin + e.way * Ie.speed * n / s) / a % 2 + 2) % 2, i = Ie.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function Pv(e, t) {
  const n = Me.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = Ov(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function G5(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Me.bug_shot, { frame: r, bug: i, shot: l } = Pv(n, e.length), u = e.map((C, F) => ({ ...oa(C, t, Math.min(n / o.fps, Nn(F).shot)), shot: F < l })), d = Se(r / o.frames, o.aim), [f, p] = [u[Math.max(i - 1, 0)], u[i]], y = e.map((C, F) => ({ bug: C, index: F, seconds: n / o.fps - Nn(F).shot, spot: oa(C, t, Nn(F).shot) })).filter((C) => C.seconds >= 0), k = y.flatMap((C) => {
    const F = (a == null ? void 0 : a.get(C.index)) ?? Hv(C.bug, t, C.spot, a ? [] : s);
    return a == null || a.set(C.index, F), a && Uv(F, C.seconds, s), zv(F, C.seconds, s);
  }), $ = y.filter((C) => Fv(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (p.x - f.x) * d, y: f.y + (p.y - f.y) * d, back: S }, slush: k, camera: $ };
}
function Nn(e) {
  const t = Me.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function K5(e, t, n, s) {
  const { limit: a, margin: o } = Me.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Nn(d), p = oa(u, t, f.shot), y = Math.abs(p.y - n.y) / Math.tan(a * Math.PI / 180), k = p.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - p.x), $ = Math.abs(p.x - l) >= y ? l : p.x + k * y, S = k > 0 ? Math.max(l, Math.min($, i)) : Math.min(l, Math.max($, r)), C = { from: l, to: S, begin: f.walk, end: f.aim };
    return l = S, C;
  });
}
function Y5(e, t, n) {
  var o;
  const s = Me.bug_shot.back.stride * n;
  let a = 0;
  for (const r of e) {
    if (t <= r.begin) return { x: r.from, steps: a / s, way: 0 };
    if (t < r.end) {
      const i = r.from + (r.to - r.from) * Se(t, [r.begin, r.end]);
      return { x: i, steps: (a + Math.abs(i - r.from)) / s, way: Math.sign(r.to - r.from) };
    }
    a += Math.abs(r.to - r.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: a / s, way: 0 };
}
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, jv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function qv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Fv = (e) => e.along * 97 % 1 < xe.camera, rn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function Wv(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += xe.step) {
    const d = Math.min(u + xe.step, r.t), f = rn(e, d), p = bi(i, f, n);
    if (p) return { ...p, t: u + (d - u) * p.share };
    i = f;
  }
  const l = rn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function Hv(e, t, n, s = []) {
  const a = qv(e.along + 1), [o, r] = jv[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: xe.count }, () => {
    const l = i + (a() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + a() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: xe.radius[0] + a() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...Wv(d, t, s) };
  });
}
function Uv(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += xe.step) {
      const r = Math.min(o + xe.step, a), i = bi(rn(s, o), rn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function zv(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...rn(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((d) => d.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, u = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function J5(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Me.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = Se(e, [0, u]), p = Se(e, [u, u + d]);
  return r.map((y) => {
    const k = { x: s.x + y.at[0] * t, y: s.y + y.at[1] * t };
    return {
      x: n.x + (k.x - n.x) * f,
      y: n.y + (k.y - n.y) * f,
      r: y.size * t * (0.15 + 0.85 * f * f),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: f >= 1
    };
  });
}
function Z5(e, t, n, s, a) {
  const { sway: o, above: r } = Me.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = ($) => {
    const [S, C] = [$.x - e.at.x, $.y - e.at.y];
    return { x: i.x + S * u - C * d, y: i.y + S * d + C * u };
  }, [p, y] = [...n].sort(($, S) => $.x - S.x), k = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: k.map(($, S) => ({ from: $, to: S < k.length / 2 ? p : y })) };
}
const X5 = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: on(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: on(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Q5(e, t) {
  const n = Me[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Hn(n, t), r = 1 - (1 - n.small) * Se(s, n.shrinks) * (1 - Se(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Hn(n, t), o = n.flat * Se(s, n.squashes) * (1 - Se(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * on(a, ...n.springs)) * (1 - on(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const e4 = (e) => e === "pack_box";
function t4(e) {
  const { into: t, out: n } = Hn(Me.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function n4(e) {
  const t = Me.rope_swing, { into: n, out: s } = Hn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Vv = { after: 3 }, Ia = 10, Gv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Kv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Yv = { weight: 19 }, xi = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Jv = { every: 120 }, $i = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Mi = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Zv = {
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
}, vn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Ia }), te = (e, t, n = {}) => vn(e, "clip", t, n), $s = (e, t, n = {}) => vn(e, "look", t, n), Io = (e, t, n = {}) => vn(e, "gaze", t, n), fe = (e, t, n = {}, s = {}) => ({ ...vn(e, "pick", t, n), ...s }), ye = (e) => vn("nothing", "nothing", e, {}), Xv = 120, Qv = 300, Ms = (e, t) => ({ ...te(e, t), cooldown: Qv }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), ey = () => [te("joy", 2)], yt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), kt = (e) => ({ ...e, cooldown: Gv[e.name] }), Jt = (e) => ({ ...e, shenanigan: !0, lasts: Kv[e.name] }), ss = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...oe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), ye(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...oe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...kt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...kt(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...oe("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), ye(1)]),
  ...oe("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), ye(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...oe("sin_fixed", { cooldown: 300 }, [te("halo", 1), ye(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...oe("sin_committed", { cooldown: 300 }, [te("repent", 1), ye(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...oe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), ye(7)]),
  ...oe("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), ye(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...oe("reported", { cooldown: 90 }, [Io("read", 3), te("nod", 1), ye(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [Io("read", 3), ye(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ye(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ye(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, ey()),
  ...oe("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...oe("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), ye(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...oe("launched", { cooldown: 300 }, [te("tumble", 3), ye(47)]),
  // a break from the hammering now and then
  ...oe("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), ye(69)]),
  ...oe("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), ye(2)]),
  ...oe("refused", { cooldown: 20 }, [te("shake", 1), ye(1)]),
  ...oe("work_done", { cooldown: 120 }, [te("stretch", 2), ye(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...oe("pondering", { cooldown: [30, 60] }, [fe("ponder", 1)]),
  ...oe("thought_cloud", { cooldown: 90 }, [fe("cloud", 1)]),
  ...oe("light_bulb", { cooldown: 150 }, [fe("bulb", 1)]),
  ...oe("answered", { cooldown: 15 }, [$s("amused", 3), ye(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ye(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), ye(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ye(13)]),
  ...oe("typing", { cooldown: 60 }, [$s("reading", 1), ye(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(Zv).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [$s(t, 1)])),
  ...Object.entries($i).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Mi).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...oe("pastime", {}, [
    yt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    yt("rest", 3, 180, 120),
    yt("yawn", 2, 60, 60),
    yt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    yt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    yt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    yt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Jt(kt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Jt(kt(te("disco", 2, { ball: "bubble" }))),
    ye(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: Xv }, [Ms("search", 3), { ...Ms("binoculars", 2), when: { home: !0 } }, { ...Ms("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [fe("writing", 12, { state: "writing" }), fe("reading", 12, { state: "reading" }), fe("searching", 12, { state: "searching" }), ye(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...kt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), ye(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Jt(kt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [fe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: xi.build.cooldown }, [fe("unit", Yv.weight), ye(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...fe("hang", 1, { hands: !0, free: !0 }), cooldown: Jv.every }, fe("stand", 5)]),
  // a digit a blow's dust lets out
  ...oe("digit", {}, [fe("0", 1), fe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...oe("roam", {}, [
    fe("rest", 35, {}, { stay: [25, 60] }),
    fe("seat", 15, {}, { stay: [15, 40] }),
    fe("edge", 25, {}, { stay: [8, 20] }),
    Jt(fe("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    fe("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    fe("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    fe("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    fe("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    fe("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Jt(kt(fe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...oe("laptop", {}, [fe("seat", 6, {}, { stay: [60, 150] }), fe("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...oe("ledge_at", {}, [fe("middle", 2, {}, { along: 1 / 2 }), fe("third", 1, {}, { along: 1 / 3 }), fe("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...oe("composed_as", {}, [
    fe("facing", 4, {}, { turn: 0, leans: 0 }),
    fe("turned_left", 1, {}, { turn: 335, leans: 0 }),
    fe("turned_right", 1, {}, { turn: 25, leans: 0 }),
    fe("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    fe("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Si = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), _i = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), ty = (e) => Array.isArray(e) ? e[0] : e, ny = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, sy = (e) => ss.some((t) => t.when.moment === e);
function ay(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || _i(d).every(([f, p]) => n(f) >= ty(p)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = ss.filter((d) => Si(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Vv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = ay(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Ei(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Ei(e, t, n) {
  var s;
  for (const [a, o] of _i(t)) (s = e.memory) == null || s.set(a, e.now + ny(o, n));
}
function s4(e, t, n) {
  Ei(e, ss.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const a4 = (e) => Object.values(xi).find((t) => Si(t.when, e)) ?? null, oy = (e, t, n) => n - t <= (e.lifetime ?? Ia), o4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || wi(e.clip, t));
class Ai {
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
const ra = {
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
}, r4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Ci = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), i4 = {
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
}, l4 = 120, ry = 20, c4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < ry), iy = (e) => ra[e] || ra.idle, u4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Oi = "airborne", ly = "landing", cy = "travelling", Ti = "grounded", d4 = ({ airborne: e, landing: t, trip: n }) => e ? Oi : t ? ly : n != null && n.started ? cy : Ti;
function f4(e, t) {
  var a;
  const n = uy(e, t);
  return e.mode === Ti && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function uy(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: p = null } = e;
  if (n === Oi && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...dy(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : iy(u), facing: y ? p : i.posture === "sit" ? i.face : f };
}
function dy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const ia = (e) => e.outcome, fy = "plugin:code-commandments:sins:", Ro = (e) => e.type === "plugins.card" && e.markKey.startsWith(fy), hy = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Ro(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Ro(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], h4 = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Tr(n) })).sort((n, s) => n.time - s.time), Bo = { user: "reacted", agent: "agent_reacted" };
function m4(e, t) {
  return e.filter((n) => Bo[n.author] && St(n) > t).map((n) => ({ beat: `${Bo[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const my = [.../* @__PURE__ */ new Set([...Object.values($i).flatMap((e) => Object.keys(e)), ...Object.keys(Mi)])];
function p4(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = my.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: St(n), card: Tr(n) })).sort((n, s) => n.time - s.time);
}
const py = (e) => new Ai(e).isTest(), Un = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ia(e)] || "";
}, gy = 1800, vy = (e, t) => {
  if (Un(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Un(n) !== "finished" && Number(e.time) - Number(n.time) <= gy ? "tests_fixed" : "tests_passed";
};
function g4(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(py), a = s.filter((i) => Un(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Un(i))), o.map((i) => ({ beat: vy(i, a), time: Number(i.time), card: i.key }));
}
function v4(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ia(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: ia(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const y4 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: St(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function k4(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function w4(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function b4(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = hy.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ra(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Lo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function yy(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ra(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function x4(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : sy(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function $4(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const No = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function M4(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, u = No((i - l) / Oe.returnSeconds), d = i <= l ? No(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Do = 3, Ii = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Po = 12, S4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function _4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Ii(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= Do ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * Po) / Po, lasts: Do } };
}
const E4 = (e) => e.posture === "hang" && !Ii(e.face), ky = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), wy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function A4(e, t, n) {
  return ky.has(e) ? 1 / 0 : !wy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Ri(n - t.began, t.share) - Qe.lead, 0);
}
const by = 5;
function C4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= by ? { beat: "long_walk", time: n } : null };
}
const xy = 30, Cn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function O4(e, t, n, s, a = null) {
  if (t && n < t.until || !Cn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = Cn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + Cn.every } : { state: e, began: 0, until: 0, next: n + Cn.every };
}
const T4 = (e, t, n) => t && n < t.until && Ci.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Ri = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function I4(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = Ri(o, e.share);
  return a ? { eager: $y(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function $y(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const My = 1, Sy = { look: "look", gaze: "gaze" };
function _y(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [Sy[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const Ey = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), Ay = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > My * t, memory: s, now: a, room: o }, n).name === "backflip", Cy = { work: ["building"], idle: ["standing"] };
function R4(e, t, n, s) {
  const a = ra[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(Cy[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), Ci.has(e) ? { moments: o, began: n || s } : (n && s - n >= xy && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function Oy(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const jo = { pondering: Oy };
function B4(e, t, n, s, a, o) {
  if (jo[e.beat]) {
    const i = jo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = _y(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== Ia && { lifetime: r.lifetime } } } : null;
}
function L4(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = Ey(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const N4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function D4(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function P4(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const j4 = (e, t) => !!(e != null && e.watches) && !t.once, q4 = 10, F4 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || oy(s, s.queuedAt, n)), W4 = (e, t) => t ? null : e[0] ?? null;
function H4(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const U4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Ty = 2 * Math.PI, Iy = 500;
function z4(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / Iy, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = Ty * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, $ = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !l ? a && !t.behind && !y.behind ? By(y, t, n, p, a) : Ny(y, t, n, p) : t) ?? y, S = $ != null && $.behind && $.mood === "reading" ? Ry(e.point, $, n, r, a) : $;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: f, at: s };
}
function Ry(e, t, n, s, a) {
  const o = (x) => x * 180 / Math.PI, r = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = f ? r(e.readingFacing - i) : 0, y = f ? e.readingYaw + p : d, k = y + r(u - y), $ = Math.min(Math.max(s / 1e3, 0), 0.1), S = Oe.turnSpeed * $, C = f ? y + Math.min(Math.max(k - y, -S), S) : k, F = f ? e.readingFollow + p : C, Z = F + (C - F) * (1 - Math.exp(-$ / Oe.followSeconds)), _ = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, v = o(Ra(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), O = Math.min(Math.max(v, -_.up), _.down), w = Oe.tipSpeed * $, I = f ? e.readingPitch + Math.min(Math.max(O - e.readingPitch, -w), w) : O;
  return { ...t, readingYaw: C, readingFollow: Z, readingPitch: I, readingFacing: i };
}
function By(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (F) => {
    const { yaw: Z, pitch: _ } = Ra(F.x - n.x, a, n.y - F.y, o);
    return { yaw: Z, pitch: Math.min(Math.max(_, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [Lo(i(e)), Lo(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [p, y] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [k, $, S] = l.map((F, Z) => p * F + y * u[Z]), C = a * k / $;
  return { ...t, x: n.x + C, y: n.y - yy(C, a, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const Ly = 0.15;
function V4(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Ly;
}
function Ny(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const Dy = (e) => !(e != null && e.on);
function G4(e, t, n) {
  if (Dy(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const ln = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ss = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), qo = (e) => e * e * (3 - 2 * e);
function Py(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = Ss(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, s = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - qo(Ss(e, ...Je.fade)), lit: s, white: e < Je.flash[0] ? 0 : 1 - qo(Ss(e, ...Je.flash)) };
}
const K4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function Y4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = Py(t - e.at);
  return s && { colour: ln.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...s } };
}
function J4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function Z4(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= ln.looks || s === null && n - e.since >= ln.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function X4(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const ct = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, Q4 = { behind: 39, figure: 40, ahead: 41 }, jy = "[data-figure-pile]", qy = { amber: [1, 0.69, 0.125], good: ln.colours.good, bad: ln.colours.bad }, Dn = { phases: 4, ms: 230, dim: 0.25 }, ex = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, tx = (e) => e === "amber" ? Dn.phases : 1;
function nx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const sx = Object.keys(qy), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Zt = ([e, t], n) => e + n() * (t - e);
function ax(e) {
  const t = Ue.least + Math.floor(e() * (Ue.most - Ue.least + 1));
  return Array.from({ length: Math.min(t, Ue.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ue.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Zt(Ue.start, e), r = Zt(Ue.reach, e);
    return {
      text: We({ moment: "digit" }, e).name,
      x: s * o,
      y: Ue.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(Zt(Ue.moveMs, e)),
      fadeMs: Math.round(Zt(Ue.fadeMs, e))
    };
  });
}
const _s = { high: 3, gap: 1 };
function ox(e) {
  const t = Math.floor(e / _s.high);
  return { left: -(ct.inside + ct.width / 2 + t * (ct.width + _s.gap)), up: e % _s.high * (ct.height - ct.top) };
}
const Fy = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, Wy = { after: 5 }, Hy = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Ai(t).isBuild());
function rx(e, t, n) {
  const s = Hy(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Wy.after ? a : null;
}
function ix(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: Fy(n, s, a) } : null;
}
const Fo = { ahead: 140, up: 70 };
function lx(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Fo.ahead, y: s - Fo.up } } : o ? { at: { x: n(o), y: s - o.up - ct.height } } : t ? { at: null } : null;
}
const Es = { least: 4e3, most: 1e4 }, Uy = (e) => Es.least + e() * (Es.most - Es.least), wt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function cx(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Uy(t);
    if (n.length >= wt.most || t() >= wt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (wt.at[0] + t() * (wt.at[1] - wt.at[0]));
    n.push({ from: o, to: o + wt.ms }), s = o + wt.ms;
  }
}
const ux = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), dx = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Bi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), fx = new Set(ss.filter((e) => Bi.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), zy = (e) => e.some((t) => t.state === "built"), hx = (e, t) => zy(t) ? e.filter((n) => !Bi.has(n.beat)) : e, ht = { reach: 40, room: 6 }, Vy = (e, t) => t <= e - ht.reach + 2, mx = (e, t, n) => Vy(e, n) ? t - ht.reach : e - ht.reach - ht.room, px = (e, t, n, s) => s > 0 && t < e && t + ht.reach >= e - 2 ? Math.min(n, Math.max(e, t + ht.reach)) : e, As = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, gx = (e) => Zt(e() < As.longShare ? As.long : As.short, e), Gy = 2 * ct.width;
function vx(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= Gy ? o : e + (o - e + a / 2) % a;
}
const Ky = 60, yx = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= Ky, Wo = "[data-figure-home]", yn = () => {
  var t;
  const e = document.querySelector(Wo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Wo)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Yy = "[data-figure-docked-bars]", Jy = "[data-figure-chat-foot]", Zy = [0.85, 0.6, 0.35, 0.15], Xy = ["question", "waiting", "suggestion"], kx = (e, t) => Xy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function wx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Qy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", ek = "[data-figure-newest]";
function Li() {
  var s, a;
  const e = (s = yn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(ek), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Ba(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function cn(e, t, n = Li()) {
  if (!e || !n) return !0;
  const s = ot(e, t), a = os(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ce.top * t.size, bottom: s.top + Ce.bottom * t.size }, r = xt.gap;
  return !as(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function bx(e, t, n, s = Li()) {
  if (!s || cn(t, e, s)) return null;
  const a = os(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Ct(), l = t.posture === "stand" ? Na * e.size : Hi * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - xt.gap - r, s.right + xt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= u && p.x <= d && cn(p, e, s) && Ck(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Cs = 0.26, Ni = 0.54, tk = 1.25 / 5.4, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Cs, travels: "stand" },
  lounge: { drop: Cs, travels: "stand" },
  composed: { drop: Cs, travels: "stand" },
  hang: { drop: Ni, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, xx = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * tk * Math.cos(t * Math.PI / 180),
  y: 1 - n - Ni
}), Xt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), nk = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), $x = (e, t) => (e === "sit" ? nk.has(t) : Xt.has(e)) ? e : "stand";
function Mx(e, t) {
  return e.facing === t.facing || !Xt.has(e.posture) && !Xt.has(t.posture) ? t : { posture: "stand", facing: Xt.has(e.posture) ? e.facing : t.facing };
}
const Sx = 0.25, _x = (e, t) => Xt.has(e) && kn[t].drop === 0, Di = 2, sk = 90, ak = 180, ok = 140, rk = 280, ik = 420, lk = 0.25, ck = 290, uk = 600, dk = "cubic-bezier(0.2, 0.7, 0.4, 1)", fk = "cubic-bezier(0.55, 0, 0.9, 0.6)", Os = 5;
function zn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Os) return null;
  (r || i) && (o = Math.max(o, Di));
  const y = o > 1, k = Math.abs(t.x - e.x), $ = k < Os ? 0 : k / (sk * o) * 1e3, S = Math.min($, y ? ok : ak), C = Math.abs(t.y - e.y), F = t.y < e.y, Z = F && !p && Ay(C, n, l, u, d, f), _ = F ? ik + Math.min(C, 400) * lk : Math.sqrt(2 * C / Ta) * 1e3, v = {
    x: t.x,
    y: t.y,
    ms: C > Os ? Z ? uk : _ : 0,
    lead: Z ? ck : F ? rk : 0,
    easing: F ? dk : fk,
    hopping: !0,
    clip: Z ? "backflip" : F ? "jump" : "fall"
  }, O = { x: t.x, y: t.y, ms: $ + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, w = p ? hk(t, n) : v, I = F && !s ? [{ ...O, y: e.y }, w] : [{ ...v, x: e.x }, O];
  return { way: Math.sign(t.x - e.x) || 1, legs: I, lands: !a, pace: o, running: y };
}
const hk = (e, t) => ({ x: e.x, y: e.y, ms: Me.pogo.frames / Me.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), mk = (e, t) => e.postures.includes(t) ? t : e.postures[0], Ex = (e, t, n) => e.posture === "walk" && n ? "walk" : mk(e.clip, t), ot = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - kn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, as = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Ba = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ct() {
  var t;
  const e = (t = yn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const On = 0.5, Ho = 20;
function Ax(e, t, n = Ct()) {
  const s = ot(e, t);
  return s.left >= n.left + Ho && s.right <= n.right - Ho;
}
function La(e, t, n = Ct()) {
  const s = ot(e, t), a = s.right - s.left, o = os(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - On && i <= n.right + On && s.top >= n.top - On && l <= n.bottom + On;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, pk = 0.24;
function os(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + pk * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function gk(e, { size: t }, n = Ct()) {
  const s = os(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Na = (Ce.right - Ce.left) / 2 + 0.08;
function Cx(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - kn[e].drop) };
}
const vk = "[data-figure-agent]";
function Pi(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Ba(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const ji = (e) => Gn.flatMap(
  (t) => Vn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Da(e, t, n = "") {
  if (!cn(e, t)) return Vn.length * Gn.length;
  const s = ot(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Qy)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && as(a, l) && Ba(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return ji(a).filter(([i, l]) => r(i, l) || Pi(i, l, n)).length;
}
function yk(e, t) {
  const n = ot(e, t);
  return ji({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => Pi(s, a, "", vk)).length;
}
const Uo = 4;
function Ox(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Uo; o <= a; o += Uo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!yk(i, e) && cn(i, e)) return i;
    }
  return null;
}
function un(e, t, n) {
  const s = Ct(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => La(r, t, s) && cn(r, t)).map((r) => ({ spot: r, covered: Da(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const qi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), kk = [0.5, 0.25, 0.75], wk = (e) => qi(e.getBoundingClientRect(), kk), Fi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, bk = Na, xk = (e, t, { size: n }, s = bk) => Wi(e, Fi[t], s * n, "stand");
function Wi(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const $k = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Hi = 0.1, Mk = (e, t, { size: n }) => Wi(e, $k[t], Hi * n, "sit"), Sk = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ts = 60;
function Tx(e, t) {
  const n = Sk(t);
  return !e.aside || Math.abs(n) >= Ts ? t : n < 0 ? 360 - Ts : Ts;
}
const Qt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, _k = (e) => [.../* @__PURE__ */ new Set([e, ...Qt.turns.map((t) => (t + 360) % 360)])];
function Ix(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = _k(t), r = Qt.every[0] + s() * (Qt.every[1] - Qt.every[0]);
  return { face: t, from: a ? Ek(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Ek(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Qt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function Rx(e, t) {
  const { element: n, edge: s } = rs(), a = ["left", "right"].map((i) => wn(Mk(s, i, e), e)).filter((i) => n && La(i, e) && !Da(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function Bx(e, t, { size: n }) {
  const s = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - Ui } : e;
}
const Ui = 7;
function zi() {
  const e = [...document.querySelectorAll(jy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Ak(e, t) {
  const n = ot(e, t), s = n.right - n.left;
  return { left: n.left + Ce.left * s, right: n.left + Ce.right * s, top: n.top + Ce.top * s, bottom: n.bottom };
}
function Ck(e, t) {
  const n = zi();
  return !n || !as(Ak(e, t), n);
}
const Ok = 4;
function rs() {
  const e = bn(), t = zi(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Ok || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Ui - n, 0) } };
}
const Lx = ({ size: e, below: t }) => (1 - t) * e;
function wn(e, t) {
  const n = Ct(), { size: s, below: a } = t, o = kn[e.posture].drop * s;
  return { ...gk(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const la = (e, t) => Object.keys(Fi).map((n) => wn(xk(e, n, t), t)), Pa = (e, t) => qi(e, Zy).map((n) => wn(n, t)), Vi = (e, t, n) => un(e, t, n) ?? e[0];
function Nx(e, t) {
  const { element: n, edge: s } = rs();
  return { ...Vi(la(s, e), e, t), view: null, on: n };
}
function Dx(e, t, n, s) {
  const { element: a, edge: o } = rs(), r = (s ? la(o, t) : [...la(o, t), ...Pa(o, t)]).filter(
    (u) => !as(ot(u, t), e)
  ), i = un(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !Da(i, t) ? i : un(r, t, n);
  return l && { ...l, view: null, on: a };
}
function bn() {
  var s;
  const e = yn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Yy);
  if (!t) return { ...is(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const zo = { within: 2 };
function Px(e) {
  const { element: t, docked: n, edge: s } = bn();
  if (!n || e.on !== t) return !0;
  const a = is().edge;
  return s.left > a.left + zo.within || s.left + s.width < a.left + a.width - zo.within;
}
const Tk = "[data-figure-closing]";
function jx() {
  var n;
  const { element: e, docked: t } = bn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Tk));
}
const Gi = "[data-figure-progress]";
function qx(e) {
  const t = e.querySelector(Gi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Fx(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const Ik = { across: 300, above: 380, below: 60 };
function Wx(e) {
  const { across: t, above: n, below: s } = Ik;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: Rk(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const Rk = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ki = "[data-figure-bar]", ca = { back: 144, along: 0.4 };
function Hx(e) {
  const { element: t, docked: n, edge: s } = bn(), a = n ? t.querySelector(Ki) : null;
  if (!(a != null && a.querySelector(Gi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...wn({ x: o - ca.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Ux(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < ca.along * s.size ? t.x + ca.along * s.size : e.x, y: e.y, behind: !0 };
}
function zx(e) {
  const t = e.querySelector(Ki), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function is() {
  const e = yn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function Vx(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = is(), l = n === null ? Bk(i, e, o === null ? t : { x: o, y: i.top }, s, a) : wn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Bk(e, t, n, s, a) {
  const o = Pa(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + ct.width < a && l.x + s - ht.reach - ht.room >= r);
  return un(i.length ? i : o, t, n);
}
const Lk = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function Gx(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  (o || r) && (a = Math.max(a, Di));
  const y = (Z) => {
    const _ = ot(Z, n, kn[Z.posture].travels);
    return { x: _.left, y: _.top };
  }, k = t.ladder ?? e.ladder;
  if (k && !(t.ladder && e.ladder)) return Nk(y(e), y(t), y({ ...k.foot, posture: "stand" }), k.way, !!t.ladder, n, a);
  const [$, ...S] = [e, ...l, t].map(y), C = zn($, S[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: p }), F = S.slice(1).map((Z, _) => {
    var v;
    return (v = zn(S[_], Z, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : v.legs.find((O) => O.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...F.filter(Boolean)] };
}
function Nk(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Lk.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? zn(e, n, o.size, { pace: r }) : zn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function Kx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function Yx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && un(wk(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = rs();
  return { ...Vi(Pa(a, t), t, n), view: null, on: s };
}
const Dk = "[data-figure-bubble]", Pk = 250;
let en = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Yi = 0;
const Ut = () => en, Is = /* @__PURE__ */ new WeakMap();
let jk = 0;
function ja(e) {
  return Is.has(e) || Is.set(e, `floor-${++jk}`), Is.get(e);
}
const qk = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Fk = () => {
  var e, t;
  return ((t = (e = yn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Wk(e, t) {
  var s;
  const n = (s = e.querySelector(Jy)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Hk(e, t) {
  const n = e && Wk(e, t), s = e ? [...e.querySelectorAll(Dk)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || qk(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: ja(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Uk = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Pk ? (t.top - s.top) / a * 1e3 : 0;
};
function Ji(e = en, t = performance.now()) {
  const n = Ct(), s = Fk(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = bn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = is();
  return u.element && l.push({ id: ja(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Hk(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: Uk(e, d, t) }))) });
}
const ua = /* @__PURE__ */ new Set();
function zk(e) {
  return ua.add(e), () => ua.delete(e);
}
function Vk() {
  Zi();
  const e = () => {
    Yi = requestAnimationFrame(e), !document.hidden && (en = Ji(en), ua.forEach((t) => t(en)));
  };
  e();
}
function Zi() {
  cancelAnimationFrame(Yi);
}
const qa = 5, Gk = 56, Kk = { share: 0.6 }, Yk = (e) => -Math.sqrt(2 * Ta * Kk.share * e), Pt = (e, t) => e.find((n) => n.id === t) ?? null;
function Jx(e, t = Ji().floors) {
  const n = Pt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : ja(e.on) : null, o = a && Pt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Xi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Ut().floors) {
  const u = Pt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || Jk(u, d, o)) && Zk(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Fa = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Jk = (e, t, n) => !Fa({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Zx(e, t = Ut().floors) {
  if (!Fa(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= qa && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Zk(e, t, n = Ut().floors) {
  const s = Pt(n, "home");
  return e.posture === "hang" && s && ot(e, t).bottom >= s.top ? !1 : La(e, t);
}
function Xx(e, t, n, s = Ut().floors) {
  const a = Xi(e, n, s);
  if (!e.home) return Xk(e, t, a, s);
  if (!a) return null;
  const o = Pt(s, "home"), r = a.y - t.y, i = r > qa ? "dropping" : -r > Gk ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Xk(e, t, n, s) {
  const a = n ? Pt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Yk(e.risen) };
  if (!n) return null;
  if (Fa(t) && n.y - t.y > qa) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function Qx(e, t, n) {
  const s = Na * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function e$(e, t, n, s = Ut().floors) {
  const a = t && Xi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const Qk = ["data-kind"], ew = { class: "figure-floor-name" }, tw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: me({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", ew, b(e.floor.kind), 1)
    ], 12, Qk));
  }
}, nw = /* @__PURE__ */ Y(tw, [["__scopeId", "data-v-8f6132da"]]), sw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, aw = {
  __name: "FigureFloors",
  setup(e) {
    const t = ut(Ut().floors);
    let n = () => {
    };
    return Ne(() => {
      n = zk((s) => t.value = s.floors), Vk();
    }), Te(() => {
      n(), Zi();
    }), (s, a) => (c(), h("div", sw, [
      (c(!0), h(K, null, ee(t.value, (o) => (c(), V(nw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, t$ = /* @__PURE__ */ Y(aw, [["__scopeId", "data-v-e519168b"]]), Rs = (e) => typeof e == "number" ? e : Date.parse(e);
function n$(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Rs(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Rs(a.row.created_at) - Rs(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const ow = 3, Bs = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function rw(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Bs[n.grouping]) == null ? void 0 : s.call(Bs, e.row, n)) || "";
}
function iw(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function s$(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= ow ? [iw(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = rw(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const lw = 1e3;
function cw() {
  const e = T(Date.now()), t = setInterval(() => e.value = Date.now(), lw);
  return qt(() => clearInterval(t)), e;
}
const uw = ["datetime", "title"], ls = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = cw(), s = B(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, b(U(Am)(e.at, U(n))), 9, uw));
  }
};
function dw(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const a$ = (e) => (t) => t.filter((n) => n.id !== e), o$ = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), r$ = (e) => (t) => [...t, e], i$ = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function l$(e) {
  const t = Wt(), n = T(null), s = T("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
function c$(e) {
  const t = Wt(), n = T("");
  async function s(a) {
    const o = await t.run(a);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: s };
}
const Tn = /* @__PURE__ */ new Map();
function fw(e, t) {
  if (Tn.has(e)) return Tn.get(e);
  const n = t().finally(() => Tn.delete(e));
  return Tn.set(e, n), n;
}
function u$() {
  const e = Wt(), t = T(null), n = T("");
  async function s() {
    const a = await fw(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const hw = { class: "cards-page" }, mw = { class: "cards-bar" }, pw = { class: "cards-count" }, gw = { class: "cards" }, vw = {
  key: 1,
  class: "cards-note"
}, yw = {
  key: 2,
  class: "cards-note"
}, kw = ["data-row", "onClick"], ww = { class: "card-head" }, bw = { class: "card-title" }, xw = { class: "card-foot" }, $w = {
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
    return (s, a) => (c(), h("div", hw, [
      g("div", mw, [
        g("span", pw, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        R(he, nt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: P(() => [
            R(ve, {
              name: "plus",
              size: 12
            }),
            se(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", gw, [
        e.loaded ? e.failure ? (c(), h("p", vw, b(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), h("p", yw, "No " + b(e.noun) + "s yet", 1)) : (c(), V(Et, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(K, null, ee(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          g("span", ww, [
            R(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            se(" " + b(e.head(o)), 1),
            R(ls, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", bw, b(e.title(o)), 1),
          g("span", xw, b(e.foot(o)), 1)
        ], 8, kw))), 128))
      ]),
      ce(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, d$ = /* @__PURE__ */ Y($w, [["__scopeId", "data-v-990e6b37"]]), Vo = "newest";
function f$(e, { title: t, isOpen: n = null }) {
  var u;
  const s = (u = _e(Ae, null)) == null ? void 0 : u.search, a = T(""), o = T(Vo), r = T("all"), i = B(() => {
    const d = a.value.trim().toLowerCase(), f = e.value.filter((p) => dw(p, d, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(p) === (r.value === "open")));
    return o.value === Vo ? f : [...f].sort((p, y) => t(p).localeCompare(t(y)));
  }), l = B(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const Mw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Sw = 40, _w = "top", Ew = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = _e(Ae, null)) == null ? void 0 : f.autoScroll, a = B(() => s === _w), o = T(null), r = T(!1), i = (p) => a.value ? p.scrollTop : p.scrollHeight - p.scrollTop - p.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Sw;
    }
    return pe(() => n.rowCount, async () => {
      await pt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (p, y) => (c(), h("div", Mw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(p.$slots, "default", {}, void 0, !0)
      ], 34),
      R(jt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: P(() => [
          st(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            R(ve, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = se(" Newest ", -1))
          ], 512), [
            [er, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, h$ = /* @__PURE__ */ Y(Ew, [["__scopeId", "data-v-3accb764"]]), Aw = ["aria-selected", "data-tab", "onClick"], Cw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Ow = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var f;
    const n = e, s = t, a = ((f = _e(Ae, null)) == null ? void 0 : f.tabs) ?? [], o = T(null), r = T({ left: 0, width: 0, slides: !1 }), i = (p) => n.answer[p.count_field] !== void 0;
    function l(p) {
      var k;
      const y = (k = o.value) == null ? void 0 : k.querySelector(".inner-tab.on");
      if (!y) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, o.value.scrollWidth > o.value.clientWidth && (o.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const u = () => pt(() => l(!0));
    let d = null;
    return Ne(() => {
      var p;
      l(!1), d = new ResizeObserver(() => l(!1)), d.observe(o.value), (p = document.fonts) == null || p.ready.then(() => l(!1));
    }), Te(() => d == null ? void 0 : d.disconnect()), pe(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, u), pe(() => n.answer, u, { deep: !0 }), (p, y) => (c(), h("div", {
      ref_key: "band",
      ref: o,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(K, null, ee(U(a), (k) => {
        var $, S;
        return c(), h("button", {
          key: k.key,
          type: "button",
          role: "tab",
          class: J(["inner-tab", { on: (($ = e.active) == null ? void 0 : $.key) === k.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === k.key,
          "data-tab": k.key,
          onClick: (C) => s("choose", k)
        }, [
          se(b(k.label) + " ", 1),
          i(k) ? (c(), h("span", Cw, b(e.answer[k.count_field]), 1)) : A("", !0)
        ], 10, Aw);
      }), 128)),
      g("i", {
        class: J(["inner-tabs-line", { slides: r.value.slides }]),
        style: me({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, m$ = /* @__PURE__ */ Y(Ow, [["__scopeId", "data-v-46fc6186"]]), Tw = {
  class: "tab-body",
  "data-tab-body": ""
}, Iw = { "data-tab-content": "" }, Rw = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = T(!1);
    let s = 0;
    return pe(() => {
      var a;
      return (a = t.tab) == null ? void 0 : a.key;
    }, () => {
      const a = ++s;
      n.value = !0, ka(performance.now(), () => {
        a === s && (n.value = !1);
      });
    }), (a, o) => (c(), h("div", Tw, [
      n.value ? (c(), V(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      st(g("div", Iw, [
        ce(a.$slots, "default", {}, void 0, !0)
      ], 512), [
        [er, !n.value]
      ])
    ]));
  }
}, p$ = /* @__PURE__ */ Y(Rw, [["__scopeId", "data-v-63876533"]]), Bw = {}, Lw = { class: "menu-label" };
function Nw(e, t) {
  return c(), h("span", Lw, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const da = /* @__PURE__ */ Y(Bw, [["render", Nw], ["__scopeId", "data-v-aa955b3e"]]), Dw = {
  class: "search-bar",
  "data-search-bar": ""
}, Pw = { class: "search-bar-control" }, jw = ["value", "placeholder", "aria-label"], qw = ["aria-expanded"], Fw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const s = e, a = n, o = ml(), r = ((C = _e(Ae, null)) == null ? void 0 : C.search) ?? {}, i = B(() => r.placeholder || s.placeholder), l = r.context ?? [], u = T(null), d = T(null), f = T([]), p = B(() => f.value.length ? f.value[f.value.length - 1].next : l), y = B(() => !!o.menu || l.length > 0), k = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function $(F) {
      if (F.next.length) {
        f.value = [...f.value, F];
        return;
      }
      d.value = null, a("pick", F.click);
    }
    function S() {
      var F;
      a("update:modelValue", ""), (F = u.value) == null || F.focus();
    }
    return t({ focus: () => {
      var F;
      return (F = u.value) == null ? void 0 : F.focus();
    } }), (F, Z) => {
      var _;
      return c(), h("div", Dw, [
        g("div", Pw, [
          R(ve, {
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
            placeholder: i.value,
            "aria-label": i.value,
            onInput: Z[0] || (Z[0] = (v) => a("update:modelValue", v.target.value)),
            onKeydown: tn(S, ["esc"])
          }, null, 40, jw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            R(ve, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          y.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: k
          }, [
            R(ve, {
              name: "caret",
              size: 12
            })
          ], 8, qw)) : A("", !0)
        ]),
        (_ = U(r).button) != null && _.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Z[1] || (Z[1] = (v) => a("pick", U(r).button.click))
        }, b(U(r).button.title), 1)) : A("", !0),
        ce(F.$slots, "default", {}, void 0, !0),
        d.value ? (c(), V(Yn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Z[3] || (Z[3] = be(() => {
          }, ["stop"])),
          onClose: Z[4] || (Z[4] = (v) => d.value = null)
        }, {
          default: P(() => [
            f.value.length ? (c(), V(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: Z[2] || (Z[2] = (v) => f.value = f.value.slice(0, -1))
            }, {
              default: P(() => [
                se("‹ " + b(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), h(K, null, ee(p.value, (v) => (c(), V(Mt, {
              key: v.title,
              description: v.subtext,
              "data-search-entry": v.title,
              onClick: (O) => $(v)
            }, {
              default: P(() => [
                se(b(v.title) + b(v.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : ce(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, Ww = /* @__PURE__ */ Y(Fw, [["__scopeId", "data-v-43c4837e"]]), Hw = {
  __name: "ListTools",
  props: { tools: { type: Object, required: !0 }, placeholder: { type: String, default: "Search" } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ];
    return (o, r) => (c(), V(Ww, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        R(da, null, {
          default: P(() => [...r[2] || (r[2] = [
            se("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, ee(s, (i) => R(Mt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (l) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            se(b(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          R(da, null, {
            default: P(() => [...r[3] || (r[3] = [
              se("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, ee(a, (i) => R(Mt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (l) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              se(b(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: P(() => [
        ce(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, g$ = /* @__PURE__ */ Y(Hw, [["__scopeId", "data-v-dab0064d"]]);
function v$() {
  const e = T(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const y$ = (e) => import(
  /* @vite-ignore */
  e
), Uw = 86400, fa = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function zw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fa(t) - fa(e)) / Uw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function k$(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fa(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: zw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ls = 280, Ns = 240, Ds = 120, Vw = 6, Gw = 14, dn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Kw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Qi(e, t) {
  const n = Math.max(0, Kw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Yw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Gw}px)` }), e.offsetHeight, e.style.transition = `height ${Ls}ms ${dn}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Qi(t, e));
    const p = a() - i;
    if (!l && p >= Ls && (l = !0, e.style.transition = `opacity ${Ns}ms ease-out, transform ${Ns}ms ${dn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Ls + Ns) return s(f);
    d();
  };
  return s(f), d;
}
function w$(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Vw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ds}ms ease-out, transform ${Ds}ms ${dn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Qi(t, e)), a() - r < Ds) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Jw = 140, In = 220, Go = 5;
function b$({ gap: e = Jw, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(d, f) {
    s.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      s.delete(d), d.done(), f();
    });
  }
  function l() {
    const d = n.splice(0, Go);
    if (a = d.length > 0, !a) return;
    let f = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        f -= 1, f || (o = t(l, e));
      });
  }
  const u = (d, f, p, y = Yw) => {
    if (r || !f.pane || !f.follows()) return p();
    const k = { el: d, options: f, done: p, arrival: y, display: d.style.display || "" };
    if (!a)
      return a = !0, i(k, () => o = t(l, e));
    d.style.display = "none", n.push(k), n.length >= Go && u.flush();
  };
  return u.flush = () => {
    var d;
    r = !0, queueMicrotask(() => r = !1);
    for (const f of [...s]) (d = f.cancel) == null || d.call(f);
    clearTimeout(o), a = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, u;
}
function x$(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${In}ms ${dn}, opacity ${In}ms ease-in, margin ${In}ms ${dn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, In);
}
const el = "chat.pins.minimised", Pn = T(sn(el, !1));
function Ko(e) {
  Pn.value = e, Qn(el, e);
}
function Zw(e) {
  const t = B(() => e()), n = B(() => Pn.value ? [] : e()), s = () => Ko(!Pn.value), a = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => St(o) > a).length,
    (o, r) => o > r && Ko(!1)
  ), { pins: t, visible: n, minimised: Pn, toggle: s };
}
const Xw = ["title"], Qw = {
  key: 0,
  class: "pins-count"
}, e2 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Zw(() => t.pinRows);
    return (o, r) => U(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => U(a) && U(a)(...i), ["stop"]))
    }, [
      R(ve, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (c(), h("span", Qw, b(U(n).length), 1)) : A("", !0)
    ], 10, Xw)) : A("", !0);
  }
}, $$ = /* @__PURE__ */ Y(e2, [["__scopeId", "data-v-d073c504"]]), t2 = ["title"], n2 = ["title"], s2 = { class: "diff-card-dir" }, a2 = { class: "diff-card-name" }, o2 = ["title"], r2 = ["title"], i2 = {
  key: 0,
  class: "diff-card-note"
}, l2 = ["href"], c2 = ["src", "alt"], u2 = { class: "diff-card-rows" }, d2 = { class: "diff-row-num" }, f2 = { class: "diff-row-sign" }, h2 = { class: "diff-row-code" }, m2 = {
  __name: "DiffCard",
  props: {
    path: { type: String, required: !0 },
    kind: { type: String, required: !0 },
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
    const n = e, s = t, a = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";
    function o(E) {
      (E.metaKey || E.ctrlKey) && (E.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = B(() => n.path.lastIndexOf("/") + 1), u = B(() => n.path.slice(0, l.value)), d = B(() => n.path.slice(l.value)), f = B(() => n.kind === "deleted"), p = B(() => r[n.kind]), y = B(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), k = T("after"), $ = B(() => k.value === "before" ? n.whole.old : n.whole.text), S = B(() => n.whole && n.whole.text !== void 0 ? $.value.split(`
`).map((E, M) => ({ line_type: k.value === "after" && y.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), C = T(!1), F = B(() => n.lines && !C.value && !n.whole), Z = B(() => F.value ? S.value.slice(0, n.lines) : S.value), _ = B(() => S.value.length - Z.value.length), v = (E) => E.line === null || E.line_type === "del" ? "" : E.line, O = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, w = T(null), I = T(null);
    let x = null;
    return Ne(() => {
      if (!I.value) return;
      let E = !0;
      x = new ResizeObserver(() => {
        !w.value || !I.value || (w.value.style.transition = E ? "none" : "", w.value.style.height = `${I.value.offsetHeight}px`, E = !1);
      }), x.observe(I.value);
    }), Te(() => x && x.disconnect()), (E, M) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (m) => !f.value && s("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          g("span", s2, b(u.value), 1),
          g("span", a2, b(d.value), 1),
          p.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, b(p.value), 3)) : A("", !0)
        ], 8, n2),
        g("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        g("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        R(ls, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: k.value === "after" ? "Show the file before" : "Show the file after",
          onClick: M[0] || (M[0] = be((m) => k.value = k.value === "after" ? "before" : "after", ["stop"]))
        }, b(k.value === "after" ? "After" : "Before"), 9, o2)) : A("", !0),
        f.value ? A("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: M[1] || (M[1] = be((m) => s("whole"), ["stop"]))
        }, [
          R(ve, {
            name: "file",
            size: 12
          })
        ], 10, r2))
      ], 8, t2),
      e.whole && e.whole.error ? (c(), h("p", i2, b(e.whole.error), 1)) : A("", !0),
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
          }, null, 8, c2)
        ], 8, l2)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: w,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: I,
            class: "diff-card-diff"
          }, [
            g("div", u2, [
              (c(!0), h(K, null, ee(Z.value, (m, L) => (c(), h("div", {
                key: L,
                class: J(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                g("span", d2, b(v(m)), 1),
                g("span", f2, b(i[m.line_type]), 1),
                g("span", h2, b(O(m)), 1)
              ], 2))), 128)),
              _.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = be((m) => C.value = !0, ["stop"]))
              }, b(_.value) + " more " + b(_.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, M$ = /* @__PURE__ */ Y(m2, [["__scopeId", "data-v-fed58c18"]]), p2 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), V(he, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: P(() => [
        R(ve, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, g2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, v2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, y2 = { class: "ask-text" }, k2 = ["placeholder", "aria-label"], w2 = ["placeholder", "aria-label"], b2 = {
  key: 3,
  class: "moves"
}, x2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = B(() => H0(s.kind, s.row)), r = T(""), i = T(null), l = T(""), u = T("");
    pe(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(y, k = "") {
      const $ = await s.read([y.noun ?? s.kind, y.word, String(s.id), ...y.flag ? [y.flag, k] : y.positional ? [k] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = $.ok ? "" : $.error, $.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (y) => y.confirm ? i.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (i.value = y, l.value = "") : d(y), p = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (y, k) => {
      var $;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", g2, b(r.value), 1)) : A("", !0),
        ($ = i.value) != null && $.confirm ? (c(), h("div", v2, [
          g("span", y2, b(i.value.confirm), 1),
          R(he, {
            small: "",
            kind: i.value.danger ? "ghost" : "primary",
            bordered: i.value.danger,
            class: J({ danger: i.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: k[0] || (k[0] = (S) => d(i.value))
          }, {
            default: P(() => [
              se(b(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["kind", "bordered", "class"]),
          R(he, {
            small: "",
            kind: "ghost",
            onClick: k[1] || (k[1] = (S) => i.value = null)
          }, {
            default: P(() => [...k[7] || (k[7] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(p, ["prevent"])
        }, [
          st(g("input", {
            "onUpdate:modelValue": k[2] || (k[2] = (S) => l.value = S),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: k[3] || (k[3] = tn(be((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, k2), [
            [Fs, l.value]
          ]),
          i.value.opener ? st((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": k[4] || (k[4] = (S) => u.value = S),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: k[5] || (k[5] = tn(be((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, w2)), [
            [Fs, u.value]
          ]) : A("", !0),
          R(he, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: P(() => [
              se(b(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          R(he, {
            small: "",
            kind: "ghost",
            onClick: k[6] || (k[6] = (S) => i.value = null)
          }, {
            default: P(() => [...k[8] || (k[8] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", b2, [
          (c(!0), h(K, null, ee(o.value, (S) => (c(), V(he, {
            key: S.word,
            small: !S.bordered,
            bordered: S.bordered,
            icon: S.icon,
            kind: S.main ? "primary" : "ghost",
            class: J({ danger: S.danger }),
            "data-move": S.word,
            onClick: (C) => f(S)
          }, {
            default: P(() => [
              se(b(S.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : A("", !0);
    };
  }
}, $2 = /* @__PURE__ */ Y(x2, [["__scopeId", "data-v-74d3b5e8"]]), M2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), S2 = (e) => M2.has(e), ha = (e) => S2(e) ? "done" : e, _2 = { class: "facts" }, E2 = { class: "fact wide" }, A2 = { class: "fact-value" }, C2 = {
  key: 0,
  class: "fact"
}, O2 = { class: "fact-value" }, T2 = { class: "fact" }, I2 = { class: "fact-label" }, R2 = ["title"], B2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, L2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, N2 = {
  key: 2,
  class: "fact"
}, D2 = { class: "fact-value" }, P2 = { class: "fact wide" }, j2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, q2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Wn.map(({ key: o, label: r }) => ({ key: String(o), label: r })), s = t, a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var i, l;
      return c(), h("div", _2, [
        g("div", E2, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", A2, b((i = e.place) != null && i.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((l = e.place) == null ? void 0 : l.phase_total) > 1 ? (c(), h("div", C2, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", O2, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (c(), h(K, { key: 1 }, [
          g("div", T2, [
            g("span", I2, b(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => U(Fe)(`agents:${e.task.helper_id}`))
            }, b(e.task.helper_name), 9, R2)
          ]),
          U(a).has(e.task.state) ? (c(), h("p", B2, b(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", L2, b(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", N2, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", D2, "Agent " + b(e.task.holder_id), 1)
        ])) : A("", !0),
        g("div", P2, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          R(Jn, {
            options: U(n),
            value: String(U(ii)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => s("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", j2, b(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, F2 = /* @__PURE__ */ Y(q2, [["__scopeId", "data-v-2bcdca7a"]]), W2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, H2 = { ...W2, done: "Completed" }, U2 = { class: "task-status-icon" }, z2 = ["width", "height", "aria-label"], V2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", U2, [
      R(jt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (c(), h("svg", {
            key: e.status,
            class: J(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": U(H2)[e.status]
          }, [
            R(Ft, { value: e.status }, {
              blocked: P(() => [...n[0] || (n[0] = [
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
              done: P(() => [...n[1] || (n[1] = [
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
              started: P(() => [...n[2] || (n[2] = [
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
              asked: P(() => [...n[3] || (n[3] = [
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
              paused: P(() => [...n[4] || (n[4] = [
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
              planned: P(() => [...n[5] || (n[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...n[6] || (n[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, z2))
        ]),
        _: 1
      })
    ]));
  }
}, tl = /* @__PURE__ */ Y(V2, [["__scopeId", "data-v-2ab7e404"]]), G2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, K2 = ["onClick"], Y2 = { class: "wait-id" }, J2 = { class: "wait-title" }, Z2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, X2 = { class: "text" }, Q2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, eb = 180, tb = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = T(!1);
    return (a, o) => (c(), h(K, null, [
      e.task.waits.length ? (c(), h("section", G2, [
        o[1] || (o[1] = g("h4", null, "Waits on", -1)),
        (c(!0), h(K, null, ee(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          R(tl, {
            status: U(ha)(r.state),
            size: 12
          }, null, 8, ["status"]),
          g("span", Y2, b(r.id), 1),
          g("span", J2, b(r.title), 1)
        ], 8, K2))), 128))
      ])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", Z2, [
        o[2] || (o[2] = g("h4", null, "How it was done", -1)),
        g("p", X2, b(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), h("section", Q2, [
        o[3] || (o[3] = g("h4", null, "The brief", -1)),
        g("p", {
          class: J(["text", { clamped: !s.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > eb && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0)
    ], 64));
  }
}, nb = /* @__PURE__ */ Y(tb, [["__scopeId", "data-v-8e4d95ae"]]), sb = {
  class: "task-details",
  "data-task-details": ""
}, ab = { class: "since" }, ob = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, rb = { class: "text" }, ib = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, lb = {
  key: 1,
  class: "note"
}, cb = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, ub = { class: "text" }, db = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", sb, [
        g("div", {
          class: J(["state-line", U(ha)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            R(tl, {
              status: U(ha)(e.task.state)
            }, null, 8, ["status"]),
            se(" " + b(s(e.task.state)), 1)
          ]),
          g("span", ab, [
            o[3] || (o[3] = se(" since ", -1)),
            R(ls, {
              at: U(Ma)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", ob, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", rb, b(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", ib, "Opens by itself when " + b(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", lb, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", cb, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", ub, b(e.task.reason), 1)
        ])) : A("", !0),
        R(F2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        R(nb, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, fb = /* @__PURE__ */ Y(db, [["__scopeId", "data-v-2863d987"]]), hb = {
  class: "task-log",
  "aria-label": "Task log"
}, mb = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, pb = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, gb = { class: "entries" }, vb = ["datetime"], yb = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, kb = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = T([]), s = T(1), a = T(!0), o = T(!0), r = T("");
    let i = 0;
    async function l(u = 1) {
      const d = ++i;
      s.value = u, o.value = !0, r.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task-id",
        String(t.id),
        "--limit",
        String(He("task_logs")),
        "--page",
        String(u)
      ]);
      d === i && (o.value = !1, r.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, a.value = f.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], l();
      },
      { immediate: !0 }
    ), qt(() => {
      i += 1;
    }), (u, d) => (c(), h("section", hb, [
      o.value ? (c(), V(Et, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        g("p", mb, b(r.value), 1),
        R(he, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => l(s.value))
        }, {
          default: P(() => [...d[3] || (d[3] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(K, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), h("p", pb, "No log entries yet.")),
        g("ol", gb, [
          (c(!0), h(K, null, ee(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, b(new Date(f.created_at).toLocaleString()), 9, vb),
            g("p", null, b(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", yb, [
          R(he, {
            small: "",
            bordered: "",
            disabled: s.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => l(s.value - 1))
          }, {
            default: P(() => [...d[4] || (d[4] = [
              se("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + b(s.value), 1),
          R(he, {
            small: "",
            bordered: "",
            disabled: a.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => l(s.value + 1))
          }, {
            default: P(() => [...d[5] || (d[5] = [
              se("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, wb = /* @__PURE__ */ Y(kb, [["__scopeId", "data-v-953605e5"]]), bb = { class: "comment-side-head" }, xb = {
  key: 0,
  class: "comment-none"
}, $b = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", bb, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        R(Xn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? A("", !0) : (c(), h("p", xb, "No comments yet")),
      (c(!0), h(K, null, ee(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(s)), 1))), 128))
    ], 2));
  }
}, Mb = /* @__PURE__ */ Y($b, [["__scopeId", "data-v-19fdbdd4"]]);
var Jo;
/Mac|iPhone|iPad/.test(((Jo = navigator.userAgentData) == null ? void 0 : Jo.platform) || navigator.platform);
function Sb(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const _b = ["placeholder"], Eb = { class: "actions" }, Ab = { class: "error" }, Cb = {
  key: 1,
  class: "card closed"
}, Ob = { class: "mark" }, Tb = { class: "prompt" }, Ib = {
  key: 0,
  class: "draft"
}, Rb = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ qs({
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
  emits: /* @__PURE__ */ qs(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = js(e, "draft"), r = js(e, "error"), i = T(!!r.value), l = T(!1), u = T(!1), d = T(null);
    async function f() {
      var k, $;
      i.value = !0, l.value = !1, await pt(), ($ = ((k = d.value) == null ? void 0 : k.querySelector("input")) || d.value) == null || $.focus();
    }
    function p() {
      i.value = !1, r.value = "";
    }
    async function y() {
      const k = o.value.trim();
      if (!(!k || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(k), i.value = !1, l.value = !0;
        } catch ($) {
          o.value = k, r.value = $.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (k, $) => (c(), h("div", {
      class: J(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(y, ["prevent"]),
        onKeydown: tn(p, ["esc"])
      }, [
        ce(k.$slots, "who", {}, void 0, !0),
        st(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": $[0] || ($[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: $[1] || ($[1] = tn((S) => U(Sb)(S, y), ["enter"]))
        }, null, 40, _b), [
          [Fs, o.value]
        ]),
        g("div", Eb, [
          g("span", Ab, b(r.value), 1),
          R(he, {
            small: "",
            onClick: p
          }, {
            default: P(() => [...$[3] || ($[3] = [
              se("Cancel", -1)
            ])]),
            _: 1
          }),
          R(he, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: P(() => [...$[4] || ($[4] = [
              se("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", Cb, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", Ob, [
            R(ve, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", Tb, b(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", Ib, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: $[2] || ($[2] = (S) => a("show"))
        }, [
          g("span", null, b(U(Hl)(e.count, "comment")), 1),
          R(ve, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, Bb = /* @__PURE__ */ Y(Rb, [["__scopeId", "data-v-81f478d2"]]);
function Lb(e, t) {
  const n = T([]), s = T(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: p } = e(), y = `On ${d} ${f}, ${p}: `;
    return u.text.startsWith(y) ? u.text.slice(y.length) : u.text;
  };
  async function i() {
    const { kind: u, id: d } = e();
    if (!d) return;
    const f = ++o, p = await t([u, "comments", String(d)]);
    f === o && (n.value = p.ok ? p.value.rows ?? [] : []);
  }
  async function l(u) {
    const { kind: d, id: f } = e(), p = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, p], s.value = !0;
    const y = await t([d, "comment", String(f), u]);
    if (!y.ok)
      throw n.value = n.value.filter((k) => k !== p && k.id !== p.id), new Error(y.error);
    await i();
  }
  return pe(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const Nb = { class: "top" }, Db = {
  class: "crumb",
  "data-task-crumb": ""
}, Pb = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, jb = {
  key: 1,
  class: "body"
}, qb = { class: "summary" }, Fb = { class: "stamp" }, Wb = {
  class: "title",
  "data-resource-title": ""
}, Hb = {
  class: "tabs",
  "data-task-tabs": ""
}, Ub = { class: "panels" }, zb = {
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
    const s = e, a = n, o = T(null), r = T(null), i = T(""), l = T(""), u = T(null), d = T(null), f = T("details"), p = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], y = Lb(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (_) => s.read(_)
    );
    let k = 0;
    const $ = B(() => {
      var _;
      return (_ = r.value) != null && _.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function S() {
      const _ = ++k, [v, O] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      _ === k && (i.value = v.ok ? "" : v.error, o.value = v.ok ? v.value : null, r.value = O.ok ? O.value : null);
    }
    pe(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", S();
      },
      { immediate: !0 }
    ), pe(() => s.changes, S), pe(y.open, (_) => {
      _ && (f.value = "comments");
    });
    async function C(_) {
      const v = o.value.priority;
      o.value.priority = Number(_);
      const O = await s.read(["task", "edit", String(s.id), "--priority", _]);
      if (l.value = O.ok ? "" : O.error, O.ok) return S();
      o.value.priority = v;
    }
    function F(_) {
      u.value = null, d.value.press(_);
    }
    const Z = (_) => {
      var v;
      return ((v = d.value) == null ? void 0 : v.moves.length) && (u.value = _);
    };
    return t({ openStatus: Z }), (_, v) => (c(), h("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", Nb, [
        e.backed ? (c(), V(p2, {
          key: 0,
          onBack: v[0] || (v[0] = (O) => a("back"))
        })) : A("", !0),
        g("span", Db, b($.value), 1),
        v[9] || (v[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          R(he, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: v[1] || (v[1] = (O) => a("step", -1))
          }, {
            default: P(() => [
              R(ve, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          R(he, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: v[2] || (v[2] = (O) => a("step", 1))
          }, {
            default: P(() => [
              R(ve, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        R(he, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: v[3] || (v[3] = (O) => a("close"))
        }, {
          default: P(() => [
            R(ve, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", Pb, b(i.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        R($2, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: S
        }, null, 8, ["id", "row", "read"]),
        g("header", qb, [
          g("div", Fb, [
            se(" Task " + b(o.value.id) + " · updated ", 1),
            R(ls, {
              at: U(Ma)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", Wb, b(o.value.title), 1)
        ]),
        g("div", Hb, [
          R(Jn, {
            options: p,
            value: f.value,
            onPick: v[4] || (v[4] = (O) => f.value = O)
          }, null, 8, ["value"])
        ]),
        g("div", Ub, [
          R(Ft, { value: f.value }, {
            details: P(() => [
              R(fb, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: Z,
                onPriority: C,
                onSelect: v[5] || (v[5] = (O) => a("select", O))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: P(() => [
              R(Mb, {
                below: "",
                comments: U(y).comments.value,
                words: U(y).words,
                onClose: v[6] || (v[6] = (O) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: P(() => [
              R(wb, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        R(Bb, {
          send: U(y).send,
          count: U(y).comments.value.length,
          onShow: v[7] || (v[7] = (O) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", jb, [
        R(Et)
      ])),
      u.value ? (c(), V(Yn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: v[8] || (v[8] = (O) => u.value = null)
      }, {
        default: P(() => [
          R(da, null, {
            default: P(() => [
              se("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(K, null, ee(d.value.moves, (O) => (c(), V(Mt, {
            key: O.word,
            onClick: (w) => F(O)
          }, {
            default: P(() => [
              se(b(O.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, S$ = /* @__PURE__ */ Y(zb, [["__scopeId", "data-v-43f3b122"]]);
function Vb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ps = { exports: {} }, Yo;
function Gb() {
  return Yo || (Yo = 1, (function(e, t) {
    var n = (function() {
      var s = function(v, O) {
        var w = 236, I = 17, x = v, E = o[O], M = null, m = 0, L = null, j = [], D = {}, X = function(q, W) {
          m = x * 4 + 17, M = (function(N) {
            for (var H = new Array(N), z = 0; z < N; z += 1) {
              H[z] = new Array(N);
              for (var Q = 0; Q < N; Q += 1)
                H[z][Q] = null;
            }
            return H;
          })(m), G(0, 0), G(m - 7, 0), G(0, m - 7), ke(), le(), Ge(q, W), x >= 7 && Re(q), L == null && (L = nl(x, E, j)), Ke(L, W);
        }, G = function(q, W) {
          for (var N = -1; N <= 7; N += 1)
            if (!(q + N <= -1 || m <= q + N))
              for (var H = -1; H <= 7; H += 1)
                W + H <= -1 || m <= W + H || (0 <= N && N <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (N == 0 || N == 6) || 2 <= N && N <= 4 && 2 <= H && H <= 4 ? M[q + N][W + H] = !0 : M[q + N][W + H] = !1);
        }, ue = function() {
          for (var q = 0, W = 0, N = 0; N < 8; N += 1) {
            X(!0, N);
            var H = i.getLostPoint(D);
            (N == 0 || q > H) && (q = H, W = N);
          }
          return W;
        }, le = function() {
          for (var q = 8; q < m - 8; q += 1)
            M[q][6] == null && (M[q][6] = q % 2 == 0);
          for (var W = 8; W < m - 8; W += 1)
            M[6][W] == null && (M[6][W] = W % 2 == 0);
        }, ke = function() {
          for (var q = i.getPatternPosition(x), W = 0; W < q.length; W += 1)
            for (var N = 0; N < q.length; N += 1) {
              var H = q[W], z = q[N];
              if (M[H][z] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    Q == -2 || Q == 2 || ae == -2 || ae == 2 || Q == 0 && ae == 0 ? M[H + Q][z + ae] = !0 : M[H + Q][z + ae] = !1;
            }
        }, Re = function(q) {
          for (var W = i.getBCHTypeNumber(x), N = 0; N < 18; N += 1) {
            var H = !q && (W >> N & 1) == 1;
            M[Math.floor(N / 3)][N % 3 + m - 8 - 3] = H;
          }
          for (var N = 0; N < 18; N += 1) {
            var H = !q && (W >> N & 1) == 1;
            M[N % 3 + m - 8 - 3][Math.floor(N / 3)] = H;
          }
        }, Ge = function(q, W) {
          for (var N = E << 3 | W, H = i.getBCHTypeInfo(N), z = 0; z < 15; z += 1) {
            var Q = !q && (H >> z & 1) == 1;
            z < 6 ? M[z][8] = Q : z < 8 ? M[z + 1][8] = Q : M[m - 15 + z][8] = Q;
          }
          for (var z = 0; z < 15; z += 1) {
            var Q = !q && (H >> z & 1) == 1;
            z < 8 ? M[8][m - z - 1] = Q : z < 9 ? M[8][15 - z - 1 + 1] = Q : M[8][15 - z - 1] = Q;
          }
          M[m - 8][8] = !q;
        }, Ke = function(q, W) {
          for (var N = -1, H = m - 1, z = 7, Q = 0, ae = i.getMaskFunction(W), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (M[H][ne - we] == null) {
                  var $e = !1;
                  Q < q.length && ($e = (q[Q] >>> z & 1) == 1);
                  var re = ae(H, ne - we);
                  re && ($e = !$e), M[H][ne - we] = $e, z -= 1, z == -1 && (Q += 1, z = 7);
                }
              if (H += N, H < 0 || m <= H) {
                H -= N, N = -N;
                break;
              }
            }
        }, Ot = function(q, W) {
          for (var N = 0, H = 0, z = 0, Q = new Array(W.length), ae = new Array(W.length), ne = 0; ne < W.length; ne += 1) {
            var we = W[ne].dataCount, $e = W[ne].totalCount - we;
            H = Math.max(H, we), z = Math.max(z, $e), Q[ne] = new Array(we);
            for (var re = 0; re < Q[ne].length; re += 1)
              Q[ne][re] = 255 & q.getBuffer()[re + N];
            N += we;
            var De = i.getErrorCorrectPolynomial($e), Pe = u(Q[ne], De.getLength() - 1), Wa = Pe.mod(De);
            ae[ne] = new Array(De.getLength() - 1);
            for (var re = 0; re < ae[ne].length; re += 1) {
              var Ha = re + Wa.getLength() - ae[ne].length;
              ae[ne][re] = Ha >= 0 ? Wa.getAt(Ha) : 0;
            }
          }
          for (var Ua = 0, re = 0; re < W.length; re += 1)
            Ua += W[re].totalCount;
          for (var cs = new Array(Ua), xn = 0, re = 0; re < H; re += 1)
            for (var ne = 0; ne < W.length; ne += 1)
              re < Q[ne].length && (cs[xn] = Q[ne][re], xn += 1);
          for (var re = 0; re < z; re += 1)
            for (var ne = 0; ne < W.length; ne += 1)
              re < ae[ne].length && (cs[xn] = ae[ne][re], xn += 1);
          return cs;
        }, nl = function(q, W, N) {
          for (var H = d.getRSBlocks(q, W), z = f(), Q = 0; Q < N.length; Q += 1) {
            var ae = N[Q];
            z.put(ae.getMode(), 4), z.put(ae.getLength(), i.getLengthInBits(ae.getMode(), q)), ae.write(z);
          }
          for (var ne = 0, Q = 0; Q < H.length; Q += 1)
            ne += H[Q].dataCount;
          if (z.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + z.getLengthInBits() + ">" + ne * 8 + ")";
          for (z.getLengthInBits() + 4 <= ne * 8 && z.put(0, 4); z.getLengthInBits() % 8 != 0; )
            z.putBit(!1);
          for (; !(z.getLengthInBits() >= ne * 8 || (z.put(w, 8), z.getLengthInBits() >= ne * 8)); )
            z.put(I, 8);
          return Ot(z, H);
        };
        D.addData = function(q, W) {
          W = W || "Byte";
          var N = null;
          switch (W) {
            case "Numeric":
              N = p(q);
              break;
            case "Alphanumeric":
              N = y(q);
              break;
            case "Byte":
              N = k(q);
              break;
            case "Kanji":
              N = $(q);
              break;
            default:
              throw "mode:" + W;
          }
          j.push(N), L = null;
        }, D.isDark = function(q, W) {
          if (q < 0 || m <= q || W < 0 || m <= W)
            throw q + "," + W;
          return M[q][W];
        }, D.getModuleCount = function() {
          return m;
        }, D.make = function() {
          if (x < 1) {
            for (var q = 1; q < 40; q++) {
              for (var W = d.getRSBlocks(q, E), N = f(), H = 0; H < j.length; H++) {
                var z = j[H];
                N.put(z.getMode(), 4), N.put(z.getLength(), i.getLengthInBits(z.getMode(), q)), z.write(N);
              }
              for (var Q = 0, H = 0; H < W.length; H++)
                Q += W[H].dataCount;
              if (N.getLengthInBits() <= Q * 8)
                break;
            }
            x = q;
          }
          X(!1, ue());
        }, D.createTableTag = function(q, W) {
          q = q || 2, W = typeof W > "u" ? q * 4 : W;
          var N = "";
          N += '<table style="', N += " border-width: 0px; border-style: none;", N += " border-collapse: collapse;", N += " padding: 0px; margin: " + W + "px;", N += '">', N += "<tbody>";
          for (var H = 0; H < D.getModuleCount(); H += 1) {
            N += "<tr>";
            for (var z = 0; z < D.getModuleCount(); z += 1)
              N += '<td style="', N += " border-width: 0px; border-style: none;", N += " border-collapse: collapse;", N += " padding: 0px; margin: 0px;", N += " width: " + q + "px;", N += " height: " + q + "px;", N += " background-color: ", N += D.isDark(H, z) ? "#000000" : "#ffffff", N += ";", N += '"/>';
            N += "</tr>";
          }
          return N += "</tbody>", N += "</table>", N;
        }, D.createSvgTag = function(q, W, N, H) {
          var z = {};
          typeof arguments[0] == "object" && (z = arguments[0], q = z.cellSize, W = z.margin, N = z.alt, H = z.title), q = q || 2, W = typeof W > "u" ? q * 4 : W, N = typeof N == "string" ? { text: N } : N || {}, N.text = N.text || null, N.id = N.text ? N.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var Q = D.getModuleCount() * q + W * 2, ae, ne, we, $e, re = "", De;
          for (De = "l" + q + ",0 0," + q + " -" + q + ",0 0,-" + q + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += z.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', re += ' viewBox="0 0 ' + Q + " " + Q + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += H.text || N.text ? ' role="img" aria-labelledby="' + Tt([H.id, N.id].join(" ").trim()) + '"' : "", re += ">", re += H.text ? '<title id="' + Tt(H.id) + '">' + Tt(H.text) + "</title>" : "", re += N.text ? '<description id="' + Tt(N.id) + '">' + Tt(N.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', we = 0; we < D.getModuleCount(); we += 1)
            for ($e = we * q + W, ae = 0; ae < D.getModuleCount(); ae += 1)
              D.isDark(we, ae) && (ne = ae * q + W, re += "M" + ne + "," + $e + De);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, D.createDataURL = function(q, W) {
          q = q || 2, W = typeof W > "u" ? q * 4 : W;
          var N = D.getModuleCount() * q + W * 2, H = W, z = N - W;
          return _(N, N, function(Q, ae) {
            if (H <= Q && Q < z && H <= ae && ae < z) {
              var ne = Math.floor((Q - H) / q), we = Math.floor((ae - H) / q);
              return D.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, D.createImgTag = function(q, W, N) {
          q = q || 2, W = typeof W > "u" ? q * 4 : W;
          var H = D.getModuleCount() * q + W * 2, z = "";
          return z += "<img", z += ' src="', z += D.createDataURL(q, W), z += '"', z += ' width="', z += H, z += '"', z += ' height="', z += H, z += '"', N && (z += ' alt="', z += Tt(N), z += '"'), z += "/>", z;
        };
        var Tt = function(q) {
          for (var W = "", N = 0; N < q.length; N += 1) {
            var H = q.charAt(N);
            switch (H) {
              case "<":
                W += "&lt;";
                break;
              case ">":
                W += "&gt;";
                break;
              case "&":
                W += "&amp;";
                break;
              case '"':
                W += "&quot;";
                break;
              default:
                W += H;
                break;
            }
          }
          return W;
        }, sl = function(q) {
          var W = 1;
          q = typeof q > "u" ? W * 2 : q;
          var N = D.getModuleCount() * W + q * 2, H = q, z = N - q, Q, ae, ne, we, $e, re = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, De = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Pe = "";
          for (Q = 0; Q < N; Q += 2) {
            for (ne = Math.floor((Q - H) / W), we = Math.floor((Q + 1 - H) / W), ae = 0; ae < N; ae += 1)
              $e = "█", H <= ae && ae < z && H <= Q && Q < z && D.isDark(ne, Math.floor((ae - H) / W)) && ($e = " "), H <= ae && ae < z && H <= Q + 1 && Q + 1 < z && D.isDark(we, Math.floor((ae - H) / W)) ? $e += " " : $e += "█", Pe += q < 1 && Q + 1 >= z ? De[$e] : re[$e];
            Pe += `
`;
          }
          return N % 2 && q > 0 ? Pe.substring(0, Pe.length - N - 1) + Array(N + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return D.createASCII = function(q, W) {
          if (q = q || 1, q < 2)
            return sl(W);
          q -= 1, W = typeof W > "u" ? q * 2 : W;
          var N = D.getModuleCount() * q + W * 2, H = W, z = N - W, Q, ae, ne, we, $e = Array(q + 1).join("██"), re = Array(q + 1).join("  "), De = "", Pe = "";
          for (Q = 0; Q < N; Q += 1) {
            for (ne = Math.floor((Q - H) / q), Pe = "", ae = 0; ae < N; ae += 1)
              we = 1, H <= ae && ae < z && H <= Q && Q < z && D.isDark(ne, Math.floor((ae - H) / q)) && (we = 0), Pe += we ? $e : re;
            for (ne = 0; ne < q; ne += 1)
              De += Pe + `
`;
          }
          return De.substring(0, De.length - 1);
        }, D.renderTo2dContext = function(q, W) {
          W = W || 2;
          for (var N = D.getModuleCount(), H = 0; H < N; H++)
            for (var z = 0; z < N; z++)
              q.fillStyle = D.isDark(H, z) ? "black" : "white", q.fillRect(H * W, z * W, W, W);
        }, D;
      };
      s.stringToBytesFuncs = {
        default: function(v) {
          for (var O = [], w = 0; w < v.length; w += 1) {
            var I = v.charCodeAt(w);
            O.push(I & 255);
          }
          return O;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(v, O) {
        var w = (function() {
          for (var x = F(v), E = function() {
            var le = x.read();
            if (le == -1) throw "eof";
            return le;
          }, M = 0, m = {}; ; ) {
            var L = x.read();
            if (L == -1) break;
            var j = E(), D = E(), X = E(), G = String.fromCharCode(L << 8 | j), ue = D << 8 | X;
            m[G] = ue, M += 1;
          }
          if (M != O)
            throw M + " != " + O;
          return m;
        })(), I = 63;
        return function(x) {
          for (var E = [], M = 0; M < x.length; M += 1) {
            var m = x.charCodeAt(M);
            if (m < 128)
              E.push(m);
            else {
              var L = w[x.charAt(M)];
              typeof L == "number" ? (L & 255) == L ? E.push(L) : (E.push(L >>> 8), E.push(L & 255)) : E.push(I);
            }
          }
          return E;
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
        var v = [
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
        ], O = 1335, w = 7973, I = 21522, x = {}, E = function(M) {
          for (var m = 0; M != 0; )
            m += 1, M >>>= 1;
          return m;
        };
        return x.getBCHTypeInfo = function(M) {
          for (var m = M << 10; E(m) - E(O) >= 0; )
            m ^= O << E(m) - E(O);
          return (M << 10 | m) ^ I;
        }, x.getBCHTypeNumber = function(M) {
          for (var m = M << 12; E(m) - E(w) >= 0; )
            m ^= w << E(m) - E(w);
          return M << 12 | m;
        }, x.getPatternPosition = function(M) {
          return v[M - 1];
        }, x.getMaskFunction = function(M) {
          switch (M) {
            case r.PATTERN000:
              return function(m, L) {
                return (m + L) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, L) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, L) {
                return L % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, L) {
                return (m + L) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, L) {
                return (Math.floor(m / 2) + Math.floor(L / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, L) {
                return m * L % 2 + m * L % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, L) {
                return (m * L % 2 + m * L % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, L) {
                return (m * L % 3 + (m + L) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + M;
          }
        }, x.getErrorCorrectPolynomial = function(M) {
          for (var m = u([1], 0), L = 0; L < M; L += 1)
            m = m.multiply(u([1, l.gexp(L)], 0));
          return m;
        }, x.getLengthInBits = function(M, m) {
          if (1 <= m && m < 10)
            switch (M) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + M;
            }
          else if (m < 27)
            switch (M) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + M;
            }
          else if (m < 41)
            switch (M) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + M;
            }
          else
            throw "type:" + m;
        }, x.getLostPoint = function(M) {
          for (var m = M.getModuleCount(), L = 0, j = 0; j < m; j += 1)
            for (var D = 0; D < m; D += 1) {
              for (var X = 0, G = M.isDark(j, D), ue = -1; ue <= 1; ue += 1)
                if (!(j + ue < 0 || m <= j + ue))
                  for (var le = -1; le <= 1; le += 1)
                    D + le < 0 || m <= D + le || ue == 0 && le == 0 || G == M.isDark(j + ue, D + le) && (X += 1);
              X > 5 && (L += 3 + X - 5);
            }
          for (var j = 0; j < m - 1; j += 1)
            for (var D = 0; D < m - 1; D += 1) {
              var ke = 0;
              M.isDark(j, D) && (ke += 1), M.isDark(j + 1, D) && (ke += 1), M.isDark(j, D + 1) && (ke += 1), M.isDark(j + 1, D + 1) && (ke += 1), (ke == 0 || ke == 4) && (L += 3);
            }
          for (var j = 0; j < m; j += 1)
            for (var D = 0; D < m - 6; D += 1)
              M.isDark(j, D) && !M.isDark(j, D + 1) && M.isDark(j, D + 2) && M.isDark(j, D + 3) && M.isDark(j, D + 4) && !M.isDark(j, D + 5) && M.isDark(j, D + 6) && (L += 40);
          for (var D = 0; D < m; D += 1)
            for (var j = 0; j < m - 6; j += 1)
              M.isDark(j, D) && !M.isDark(j + 1, D) && M.isDark(j + 2, D) && M.isDark(j + 3, D) && M.isDark(j + 4, D) && !M.isDark(j + 5, D) && M.isDark(j + 6, D) && (L += 40);
          for (var Re = 0, D = 0; D < m; D += 1)
            for (var j = 0; j < m; j += 1)
              M.isDark(j, D) && (Re += 1);
          var Ge = Math.abs(100 * Re / m / m - 50) / 5;
          return L += Ge * 10, L;
        }, x;
      })(), l = (function() {
        for (var v = new Array(256), O = new Array(256), w = 0; w < 8; w += 1)
          v[w] = 1 << w;
        for (var w = 8; w < 256; w += 1)
          v[w] = v[w - 4] ^ v[w - 5] ^ v[w - 6] ^ v[w - 8];
        for (var w = 0; w < 255; w += 1)
          O[v[w]] = w;
        var I = {};
        return I.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return O[x];
        }, I.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return v[x];
        }, I;
      })();
      function u(v, O) {
        if (typeof v.length > "u")
          throw v.length + "/" + O;
        var w = (function() {
          for (var x = 0; x < v.length && v[x] == 0; )
            x += 1;
          for (var E = new Array(v.length - x + O), M = 0; M < v.length - x; M += 1)
            E[M] = v[M + x];
          return E;
        })(), I = {};
        return I.getAt = function(x) {
          return w[x];
        }, I.getLength = function() {
          return w.length;
        }, I.multiply = function(x) {
          for (var E = new Array(I.getLength() + x.getLength() - 1), M = 0; M < I.getLength(); M += 1)
            for (var m = 0; m < x.getLength(); m += 1)
              E[M + m] ^= l.gexp(l.glog(I.getAt(M)) + l.glog(x.getAt(m)));
          return u(E, 0);
        }, I.mod = function(x) {
          if (I.getLength() - x.getLength() < 0)
            return I;
          for (var E = l.glog(I.getAt(0)) - l.glog(x.getAt(0)), M = new Array(I.getLength()), m = 0; m < I.getLength(); m += 1)
            M[m] = I.getAt(m);
          for (var m = 0; m < x.getLength(); m += 1)
            M[m] ^= l.gexp(l.glog(x.getAt(m)) + E);
          return u(M, 0).mod(x);
        }, I;
      }
      var d = (function() {
        var v = [
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
        ], O = function(x, E) {
          var M = {};
          return M.totalCount = x, M.dataCount = E, M;
        }, w = {}, I = function(x, E) {
          switch (E) {
            case o.L:
              return v[(x - 1) * 4 + 0];
            case o.M:
              return v[(x - 1) * 4 + 1];
            case o.Q:
              return v[(x - 1) * 4 + 2];
            case o.H:
              return v[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return w.getRSBlocks = function(x, E) {
          var M = I(x, E);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + E;
          for (var m = M.length / 3, L = [], j = 0; j < m; j += 1)
            for (var D = M[j * 3 + 0], X = M[j * 3 + 1], G = M[j * 3 + 2], ue = 0; ue < D; ue += 1)
              L.push(O(X, G));
          return L;
        }, w;
      })(), f = function() {
        var v = [], O = 0, w = {};
        return w.getBuffer = function() {
          return v;
        }, w.getAt = function(I) {
          var x = Math.floor(I / 8);
          return (v[x] >>> 7 - I % 8 & 1) == 1;
        }, w.put = function(I, x) {
          for (var E = 0; E < x; E += 1)
            w.putBit((I >>> x - E - 1 & 1) == 1);
        }, w.getLengthInBits = function() {
          return O;
        }, w.putBit = function(I) {
          var x = Math.floor(O / 8);
          v.length <= x && v.push(0), I && (v[x] |= 128 >>> O % 8), O += 1;
        }, w;
      }, p = function(v) {
        var O = a.MODE_NUMBER, w = v, I = {};
        I.getMode = function() {
          return O;
        }, I.getLength = function(M) {
          return w.length;
        }, I.write = function(M) {
          for (var m = w, L = 0; L + 2 < m.length; )
            M.put(x(m.substring(L, L + 3)), 10), L += 3;
          L < m.length && (m.length - L == 1 ? M.put(x(m.substring(L, L + 1)), 4) : m.length - L == 2 && M.put(x(m.substring(L, L + 2)), 7));
        };
        var x = function(M) {
          for (var m = 0, L = 0; L < M.length; L += 1)
            m = m * 10 + E(M.charAt(L));
          return m;
        }, E = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return I;
      }, y = function(v) {
        var O = a.MODE_ALPHA_NUM, w = v, I = {};
        I.getMode = function() {
          return O;
        }, I.getLength = function(E) {
          return w.length;
        }, I.write = function(E) {
          for (var M = w, m = 0; m + 1 < M.length; )
            E.put(
              x(M.charAt(m)) * 45 + x(M.charAt(m + 1)),
              11
            ), m += 2;
          m < M.length && E.put(x(M.charAt(m)), 6);
        };
        var x = function(E) {
          if ("0" <= E && E <= "9")
            return E.charCodeAt(0) - 48;
          if ("A" <= E && E <= "Z")
            return E.charCodeAt(0) - 65 + 10;
          switch (E) {
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
              throw "illegal char :" + E;
          }
        };
        return I;
      }, k = function(v) {
        var O = a.MODE_8BIT_BYTE, w = s.stringToBytes(v), I = {};
        return I.getMode = function() {
          return O;
        }, I.getLength = function(x) {
          return w.length;
        }, I.write = function(x) {
          for (var E = 0; E < w.length; E += 1)
            x.put(w[E], 8);
        }, I;
      }, $ = function(v) {
        var O = a.MODE_KANJI, w = s.stringToBytesFuncs.SJIS;
        if (!w)
          throw "sjis not supported.";
        (function(E, M) {
          var m = w(E);
          if (m.length != 2 || (m[0] << 8 | m[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var I = w(v), x = {};
        return x.getMode = function() {
          return O;
        }, x.getLength = function(E) {
          return ~~(I.length / 2);
        }, x.write = function(E) {
          for (var M = I, m = 0; m + 1 < M.length; ) {
            var L = (255 & M[m]) << 8 | 255 & M[m + 1];
            if (33088 <= L && L <= 40956)
              L -= 33088;
            else if (57408 <= L && L <= 60351)
              L -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + L;
            L = (L >>> 8 & 255) * 192 + (L & 255), E.put(L, 13), m += 2;
          }
          if (m < M.length)
            throw "illegal char at " + (m + 1);
        }, x;
      }, S = function() {
        var v = [], O = {};
        return O.writeByte = function(w) {
          v.push(w & 255);
        }, O.writeShort = function(w) {
          O.writeByte(w), O.writeByte(w >>> 8);
        }, O.writeBytes = function(w, I, x) {
          I = I || 0, x = x || w.length;
          for (var E = 0; E < x; E += 1)
            O.writeByte(w[E + I]);
        }, O.writeString = function(w) {
          for (var I = 0; I < w.length; I += 1)
            O.writeByte(w.charCodeAt(I));
        }, O.toByteArray = function() {
          return v;
        }, O.toString = function() {
          var w = "";
          w += "[";
          for (var I = 0; I < v.length; I += 1)
            I > 0 && (w += ","), w += v[I];
          return w += "]", w;
        }, O;
      }, C = function() {
        var v = 0, O = 0, w = 0, I = "", x = {}, E = function(m) {
          I += String.fromCharCode(M(m & 63));
        }, M = function(m) {
          if (!(m < 0)) {
            if (m < 26)
              return 65 + m;
            if (m < 52)
              return 97 + (m - 26);
            if (m < 62)
              return 48 + (m - 52);
            if (m == 62)
              return 43;
            if (m == 63)
              return 47;
          }
          throw "n:" + m;
        };
        return x.writeByte = function(m) {
          for (v = v << 8 | m & 255, O += 8, w += 1; O >= 6; )
            E(v >>> O - 6), O -= 6;
        }, x.flush = function() {
          if (O > 0 && (E(v << 6 - O), v = 0, O = 0), w % 3 != 0)
            for (var m = 3 - w % 3, L = 0; L < m; L += 1)
              I += "=";
        }, x.toString = function() {
          return I;
        }, x;
      }, F = function(v) {
        var O = v, w = 0, I = 0, x = 0, E = {};
        E.read = function() {
          for (; x < 8; ) {
            if (w >= O.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var m = O.charAt(w);
            if (w += 1, m == "=")
              return x = 0, -1;
            if (m.match(/^\s$/))
              continue;
            I = I << 6 | M(m.charCodeAt(0)), x += 6;
          }
          var L = I >>> x - 8 & 255;
          return x -= 8, L;
        };
        var M = function(m) {
          if (65 <= m && m <= 90)
            return m - 65;
          if (97 <= m && m <= 122)
            return m - 97 + 26;
          if (48 <= m && m <= 57)
            return m - 48 + 52;
          if (m == 43)
            return 62;
          if (m == 47)
            return 63;
          throw "c:" + m;
        };
        return E;
      }, Z = function(v, O) {
        var w = v, I = O, x = new Array(v * O), E = {};
        E.setPixel = function(j, D, X) {
          x[D * w + j] = X;
        }, E.write = function(j) {
          j.writeString("GIF87a"), j.writeShort(w), j.writeShort(I), j.writeByte(128), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(255), j.writeByte(255), j.writeByte(255), j.writeString(","), j.writeShort(0), j.writeShort(0), j.writeShort(w), j.writeShort(I), j.writeByte(0);
          var D = 2, X = m(D);
          j.writeByte(D);
          for (var G = 0; X.length - G > 255; )
            j.writeByte(255), j.writeBytes(X, G, 255), G += 255;
          j.writeByte(X.length - G), j.writeBytes(X, G, X.length - G), j.writeByte(0), j.writeString(";");
        };
        var M = function(j) {
          var D = j, X = 0, G = 0, ue = {};
          return ue.write = function(le, ke) {
            if (le >>> ke)
              throw "length over";
            for (; X + ke >= 8; )
              D.writeByte(255 & (le << X | G)), ke -= 8 - X, le >>>= 8 - X, G = 0, X = 0;
            G = le << X | G, X = X + ke;
          }, ue.flush = function() {
            X > 0 && D.writeByte(G);
          }, ue;
        }, m = function(j) {
          for (var D = 1 << j, X = (1 << j) + 1, G = j + 1, ue = L(), le = 0; le < D; le += 1)
            ue.add(String.fromCharCode(le));
          ue.add(String.fromCharCode(D)), ue.add(String.fromCharCode(X));
          var ke = S(), Re = M(ke);
          Re.write(D, G);
          var Ge = 0, Ke = String.fromCharCode(x[Ge]);
          for (Ge += 1; Ge < x.length; ) {
            var Ot = String.fromCharCode(x[Ge]);
            Ge += 1, ue.contains(Ke + Ot) ? Ke = Ke + Ot : (Re.write(ue.indexOf(Ke), G), ue.size() < 4095 && (ue.size() == 1 << G && (G += 1), ue.add(Ke + Ot)), Ke = Ot);
          }
          return Re.write(ue.indexOf(Ke), G), Re.write(X, G), Re.flush(), ke.toByteArray();
        }, L = function() {
          var j = {}, D = 0, X = {};
          return X.add = function(G) {
            if (X.contains(G))
              throw "dup key:" + G;
            j[G] = D, D += 1;
          }, X.size = function() {
            return D;
          }, X.indexOf = function(G) {
            return j[G];
          }, X.contains = function(G) {
            return typeof j[G] < "u";
          }, X;
        };
        return E;
      }, _ = function(v, O, w) {
        for (var I = Z(v, O), x = 0; x < O; x += 1)
          for (var E = 0; E < v; E += 1)
            I.setPixel(E, x, w(E, x));
        var M = S();
        I.write(M);
        for (var m = C(), L = M.toByteArray(), j = 0; j < L.length; j += 1)
          m.writeByte(L[j]);
        return m.flush(), "data:image/gif;base64," + m;
      };
      return s;
    })();
    (function() {
      n.stringToBytesFuncs["UTF-8"] = function(s) {
        function a(o) {
          for (var r = [], i = 0; i < o.length; i++) {
            var l = o.charCodeAt(i);
            l < 128 ? r.push(l) : l < 2048 ? r.push(
              192 | l >> 6,
              128 | l & 63
            ) : l < 55296 || l >= 57344 ? r.push(
              224 | l >> 12,
              128 | l >> 6 & 63,
              128 | l & 63
            ) : (i++, l = 65536 + ((l & 1023) << 10 | o.charCodeAt(i) & 1023), r.push(
              240 | l >> 18,
              128 | l >> 12 & 63,
              128 | l >> 6 & 63,
              128 | l & 63
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
  })(Ps)), Ps.exports;
}
var Kb = Gb();
const Yb = /* @__PURE__ */ Vb(Kb), Jb = ["width", "height", "viewBox"], Zb = ["width", "height"], Xb = ["d"], Qb = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = B(() => {
      const s = Yb(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let r = 0; r < a; r += 1)
        for (let i = 0; i < a; i += 1)
          s.isDark(r, i) && o.push(`M${i + 4} ${r + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
    });
    return (s, a) => (c(), h("svg", {
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
      }, null, 8, Zb),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Xb)
    ], 8, Jb));
  }
}, _$ = /* @__PURE__ */ Y(Qb, [["__scopeId", "data-v-489f0852"]]), e5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: me({ padding: e.padding })
    }, [
      ce(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, E$ = /* @__PURE__ */ Y(e5, [["__scopeId", "data-v-47e67f04"]]), A$ = pl(() => import("./VoiceFigure-C3cfvmgt.js").then((e) => e.V)), C$ = "1.1.0", O$ = "3.5";
export {
  Wu as $,
  Me as A,
  Ce as B,
  jx as C,
  as as D,
  ot as E,
  Dx as F,
  xk as G,
  E4 as H,
  Rx as I,
  Ck as J,
  Ct as K,
  nk as L,
  Na as M,
  Lk as N,
  Ak as O,
  ss as P,
  Q4 as Q,
  r4 as R,
  Dn as S,
  ax as T,
  X5 as U,
  Se as V,
  Hn as W,
  Z5 as X,
  J5 as Y,
  Fu as Z,
  Y as _,
  W5 as a,
  bx as a$,
  Rk as a0,
  i4 as a1,
  l4 as a2,
  Ae as a3,
  k4 as a4,
  y4 as a5,
  St as a6,
  c4 as a7,
  T4 as a8,
  T5 as a9,
  hx as aA,
  J4 as aB,
  zy as aC,
  L4 as aD,
  N4 as aE,
  Px as aF,
  Di as aG,
  sx as aH,
  yn as aI,
  D5 as aJ,
  B5 as aK,
  Ex as aL,
  kn as aM,
  Tx as aN,
  _4 as aO,
  Z4 as aP,
  X4 as aQ,
  Y4 as aR,
  ln as aS,
  xt as aT,
  I5 as aU,
  Lv as aV,
  G4 as aW,
  a4 as aX,
  Li as aY,
  Pt as aZ,
  Ut as a_,
  xx as aa,
  Cx as ab,
  q5 as ac,
  Q5 as ad,
  e4 as ae,
  g4 as af,
  v4 as ag,
  w4 as ah,
  V5 as ai,
  Wo as aj,
  u4 as ak,
  O4 as al,
  Wx as am,
  H4 as an,
  F4 as ao,
  q4 as ap,
  b4 as aq,
  m4 as ar,
  h4 as as,
  p4 as at,
  nx as au,
  C4 as av,
  I4 as aw,
  zx as ax,
  Xt as ay,
  R4 as az,
  Vk as b,
  Ux as b$,
  yk as b0,
  Ox as b1,
  ix as b2,
  rx as b3,
  oy as b4,
  xi as b5,
  yx as b6,
  A4 as b7,
  is as b8,
  ct as b9,
  cx as bA,
  px as bB,
  ht as bC,
  ox as bD,
  gx as bE,
  B4 as bF,
  U4 as bG,
  D4 as bH,
  Oe as bI,
  S4 as bJ,
  vx as bK,
  Qx as bL,
  e$ as bM,
  C5 as bN,
  Pv as bO,
  $4 as bP,
  ux as bQ,
  H5 as bR,
  Fx as bS,
  lx as bT,
  dx as bU,
  fx as bV,
  x4 as bW,
  Vy as bX,
  M4 as bY,
  j4 as bZ,
  qx as b_,
  mx as ba,
  _s as bb,
  Tr as bc,
  Gx as bd,
  Jx as be,
  tx as bf,
  _x as bg,
  O5 as bh,
  W4 as bi,
  Kx as bj,
  d4 as bk,
  f4 as bl,
  K5 as bm,
  o4 as bn,
  N5 as bo,
  Mx as bp,
  U5 as bq,
  z5 as br,
  Y5 as bs,
  V4 as bt,
  Ov as bu,
  Ix as bv,
  Ek as bw,
  G5 as bx,
  P5 as by,
  z4 as bz,
  Ve as c,
  Yl as c$,
  L5 as c0,
  R5 as c1,
  P4 as c2,
  Zx as c3,
  Fa as c4,
  Xx as c5,
  Xi as c6,
  Sx as c7,
  n4 as c8,
  t4 as c9,
  m$ as cA,
  C$ as cB,
  O$ as cC,
  v5 as cD,
  g$ as cE,
  na as cF,
  M5 as cG,
  b0 as cH,
  Mt as cI,
  da as cJ,
  Yn as cK,
  h5 as cL,
  y5 as cM,
  Nl as cN,
  Ng as cO,
  $$ as cP,
  p5 as cQ,
  _$ as cR,
  d$ as cS,
  Xu as cT,
  o5 as cU,
  _5 as cV,
  Ww as cW,
  Jn as cX,
  k5 as cY,
  Et as cZ,
  hp as c_,
  Bv as ca,
  j5 as cb,
  Sk as cc,
  K4 as cd,
  Ra as ce,
  qy as cf,
  ex as cg,
  Qt as ch,
  Nt as ci,
  c5 as cj,
  h$ as ck,
  he as cl,
  Su as cm,
  Iu as cn,
  Xn as co,
  d5 as cp,
  gr as cq,
  M$ as cr,
  A5 as cs,
  jp as ct,
  jn as cu,
  t$ as cv,
  n5 as cw,
  Dt as cx,
  tu as cy,
  ve as cz,
  ay as d,
  x5 as d0,
  r5 as d1,
  Ft as d2,
  p$ as d3,
  S$ as d4,
  tl as d5,
  su as d6,
  dt as d7,
  w5 as d8,
  ls as d9,
  g5 as dA,
  o$ as dB,
  i$ as dC,
  Fe as dD,
  f5 as dE,
  m5 as dF,
  a$ as dG,
  a5 as dH,
  s5 as dI,
  l5 as dJ,
  et as dK,
  fw as dL,
  b5 as dM,
  f$ as dN,
  cw as dO,
  v$ as dP,
  bg as dQ,
  nr as dR,
  Zw as dS,
  mi as dT,
  l$ as dU,
  ta as dV,
  c$ as dW,
  u$ as dX,
  Wt as dY,
  k$ as dZ,
  A$ as da,
  E$ as db,
  ri as dc,
  r$ as dd,
  ka as de,
  Em as df,
  Xa as dg,
  Am as dh,
  Bc as di,
  b$ as dj,
  w$ as dk,
  wa as dl,
  Rc as dm,
  u5 as dn,
  x$ as dp,
  E5 as dq,
  S5 as dr,
  $5 as ds,
  s$ as dt,
  gh as du,
  n$ as dv,
  y$ as dw,
  m0 as dx,
  dw as dy,
  i5 as dz,
  We as e,
  Cv as f,
  s4 as g,
  Vx as h,
  cn as i,
  Bx as j,
  Yx as k,
  $x as l,
  Lx as m,
  Zk as n,
  Ax as o,
  F5 as p,
  Da as q,
  Ji as r,
  Zi as s,
  Le as t,
  Nx as u,
  iy as v,
  Hx as w,
  kx as x,
  wx as y,
  bn as z
};
