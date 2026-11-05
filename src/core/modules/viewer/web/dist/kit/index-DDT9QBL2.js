/* @code-commandments-generated */
import { openBlock as c, createElementBlock as f, renderSlot as ce, createElementVNode as g, normalizeClass as J, Fragment as K, renderList as ee, normalizeStyle as me, defineComponent as cl, Comment as ul, h as ma, cloneVNode as dl, createBlock as V, withCtx as P, unref as U, createVNode as B, toDisplayString as b, createCommentVNode as A, inject as _e, useAttrs as Yn, computed as R, ref as T, resolveDynamicComponent as _t, mergeProps as nt, onUnmounted as Te, onMounted as Ne, Teleport as pa, useId as ga, resolveDirective as fl, withDirectives as st, createTextVNode as se, reactive as va, shallowRef as ut, watch as pe, nextTick as pt, Transition as qt, withModifiers as be, TransitionGroup as Xo, isRef as Va, onBeforeUnmount as Ft, resolveComponent as hl, useModel as qs, getCurrentInstance as ml, mergeModels as Fs, getCurrentScope as Qo, onScopeDispose as er, provide as pl, onErrorCaptured as gl, toHandlers as vl, createSlots as yl, vShow as tr, useSlots as kl, withKeys as tn, vModelText as Ws, defineAsyncComponent as wl } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, bl = { class: "skeleton-line" }, xl = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), f("span", bl, [
      ce(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: J(["bars", { faded: e.filled }])
      }, [
        (c(!0), f(K, null, ee(e.bars, (s) => (c(), f("span", {
          key: s.width,
          class: J(["bar", { still: e.still }]),
          style: me({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, gt = /* @__PURE__ */ Y(xl, [["__scopeId", "data-v-0ebb6933"]]), Wt = cl({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== ul);
      return s.length !== 1 ? ma(K, { key: n }, s) : s[0].key == null ? dl(s[0], { key: n }) : s[0];
    };
  }
}), $l = ["aria-label"], Ml = ["aria-label"], Sl = ["aria-label"], _l = ["aria-label"], El = ["aria-label"], Al = ["aria-label"], Cl = ["aria-label"], Ol = {
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
    return (l, u) => (c(), V(Wt, { value: e.shape }, {
      messages: P(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), f(K, null, ee(t, (d) => g("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: me({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, $l)
      ]),
      older: P(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(K, null, ee(t.slice(0, 3), (d) => (c(), f("div", {
            key: d.id,
            class: J(["skeleton-message", { mine: d.mine }]),
            style: me({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Ml)
      ]),
      cards: P(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(K, null, ee(e.count, (d) => (c(), f("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), f(K, null, ee(n, (h) => B(gt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Sl)
      ]),
      file: P(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(K, null, ee(e.count, (d) => (c(), f("div", {
            key: d,
            class: "skeleton-file"
          }, [
            B(gt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), f(K, null, ee(a, (h) => B(gt, {
              key: h.id,
              bars: h.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, _l)
      ]),
      page: P(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          B(gt, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), f(K, null, ee(e.count, (d) => (c(), V(gt, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, El)
      ]),
      text: P(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(K, null, ee(e.count, (d) => (c(), V(gt, {
            key: d,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Al)
      ]),
      default: P(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), f(K, null, ee(e.count, (d) => (c(), V(gt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Cl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Et = /* @__PURE__ */ Y(Ol, [["__scopeId", "data-v-1392eacb"]]), Tl = {
  key: 1,
  class: "empty-state titled"
}, Il = { class: "empty-state-title" }, Rl = { class: "empty-state-text" }, Bl = {
  key: 2,
  class: "empty-state"
}, Ll = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), V(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), f("div", Tl, [
      g("p", Il, b(e.title), 1),
      g("p", Rl, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), f("p", Bl, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, jn = /* @__PURE__ */ Y(Ll, [["__scopeId", "data-v-b27e89b0"]]), Nl = { class: "fold-group" }, Dl = ["aria-expanded"], Pl = { class: "fold-label" }, jl = {
  key: 0,
  class: "fold-count"
}, ql = {
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
    return (s, a) => (c(), f("div", Nl, [
      g("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        g("span", Pl, b(e.label), 1),
        e.count !== "" ? (c(), f("span", jl, b(e.count), 1)) : A("", !0),
        g("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Dl),
      e.open ? ce(s.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, h5 = /* @__PURE__ */ Y(ql, [["__scopeId", "data-v-9ef1865c"]]), Fl = Symbol("open-view"), Ae = Symbol.for("journal.window-context");
function At() {
  const e = _e(Ae, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Wl = ["stroke-width", "innerHTML"], ve = {
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
    return (o, r) => (c(), f("svg", {
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
    }, null, 12, Wl));
  }
}, Hl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), f("span", {
      class: "spinner",
      style: me({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Ul = /* @__PURE__ */ Y(Hl, [["__scopeId", "data-v-eb453d6f"]]), zl = 120, Vl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Yn(), s = R(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = T(!1), o = R(() => t.busy || a.value), r = _e(Ae, null), i = R(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(u)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const h = setTimeout(() => a.value = !0, zl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(h), a.value = !1;
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
        o.value ? (c(), V(Ul, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), he = /* @__PURE__ */ Y(Vl, [["__scopeId", "data-v-033d70ca"]]), Gl = (e, t, n) => Math.max(t, Math.min(n, e)), Kl = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, nr = /* @__PURE__ */ new WeakMap(), Yl = (e, t) => nr.set(e, t);
function Jl(e, t) {
  for (let n = t; n; n = nr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function sr(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Jl(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const Rt = 8, Zl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = T(null), o = (m) => m ? `${m}px` : void 0, r = R(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = T({ w: 0, h: 0 }), l = T(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), h = (m) => {
      const L = m.closest(".pane, .float-window");
      return L ? d(L.getBoundingClientRect()) : u();
    }, p = (m, L) => `${Math.max(0, m ? Math.min(m, L) : L)}px`;
    function y(m, L) {
      return {
        below: m.bottom - L.bottom - s.gap - Rt,
        above: L.top - m.top - s.gap - Rt,
        across: m.right - m.left - 2 * Rt
      };
    }
    function w(m) {
      const L = h(s.anchor), j = y(L, m);
      return i.value.w <= j.across && i.value.h <= Math.max(j.below, j.above) ? L : u();
    }
    const $ = R(() => {
      if (!l.value) return r.value;
      const m = l.value, L = w(m), j = y(L, m), { w: D, h: Z } = i.value, G = s.align === "auto" ? m.left + m.right > L.left + L.right : s.align === "right", ue = Gl(G ? m.right - D : m.left, L.left + Rt, Math.max(L.left + Rt, L.right - D - Rt)), ke = Z > j.below && j.above > j.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: p(s.maxHeight, j.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: p(s.maxHeight, j.below) };
      return { ...r.value, ...ke, left: `${ue}px`, maxWidth: p(s.maxWidth, j.across) };
    }), S = n, I = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function q(m) {
      const L = I(), j = L.indexOf(document.activeElement);
      L[(j + m + L.length) % L.length].focus();
    }
    const X = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => S("close") }, _ = (m) => X[m.key] && (m.preventDefault(), X[m.key]()), k = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let E = 0;
    const v = new ResizeObserver(() => {
      cancelAnimationFrame(E), E = requestAnimationFrame(k);
    });
    sr(a, (m) => s.anchor && !s.anchor.contains(m.target) && S("close"));
    const O = (m, L) => ["top", "left", "right", "bottom"].some((j) => Math.abs(m[j] - L[j]) > 1), x = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let C = 0;
    function M() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(m)) return S("close");
        O(m, l.value) && (l.value = m);
      }
      C = requestAnimationFrame(M);
    }
    return Ne(() => {
      s.anchor && a.value && Yl(a.value, s.anchor), k(), a.value && v.observe(a.value), !s.plain && I()[0] && I()[0].focus(), M();
    }), Te(() => {
      v.disconnect(), cancelAnimationFrame(C), cancelAnimationFrame(E);
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
}), Jn = /* @__PURE__ */ Y(Zl, [["__scopeId", "data-v-3d203970"]]), Xl = { class: "split-button" }, Ql = {
  __name: "SplitButton",
  props: { kind: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, s = T(null), a = T(!1), o = () => a.value = !1;
    return (r, i) => (c(), f("span", Xl, [
      B(he, {
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
        B(he, {
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
            B(ve, { name: "caret" })
          ]),
          _: 1
        }, 8, ["kind", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      a.value ? (c(), V(Jn, {
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
}, ec = /* @__PURE__ */ Y(Ql, [["__scopeId", "data-v-ef04170d"]]), tc = ["aria-checked", "aria-haspopup", "onClick"], nc = {
  key: 0,
  class: "segmented-dot"
}, sc = {
  key: 1,
  class: "segmented-count"
}, ac = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = ga();
    return (a, o) => {
      const r = fl("tip");
      return c(), f("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), f(K, null, ee(e.options, (i) => st((c(), f("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: J(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), f("span", nc)) : A("", !0),
          se(" " + b(i.label) + " ", 1),
          i.count !== void 0 ? (c(), f("em", sc, b(i.count), 1)) : A("", !0)
        ], 10, tc)), [
          [r, i.tip || i.title, `${U(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Zn = /* @__PURE__ */ Y(ac, [["__scopeId", "data-v-ca953072"]]), Xn = typeof document < "u" && document.documentElement.classList.contains("phone"), oc = "Files are attached on the computer; the phone sends text.";
function rc() {
  return () => {
  };
}
function Hs(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ar(e = window) {
  if (!Hs(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Hs(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Us = "journal.stale-build-reload", ic = 'script[type="module"][src*="/assets/index-"]', Ga = (e) => {
  var t;
  return ((t = e.querySelector(ic)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function lc(e = document, t = fetch, n = () => ar(window)) {
  const s = Ga(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = Ga(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let ds = "";
function cc(e, t = () => ar(window)) {
  if (!e) return !1;
  const n = !!ds && ds !== e;
  return ds = e, n && t(), n;
}
const uc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function dc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Us) === e.message) return !1;
    t.setItem(Us, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function fc(e = window.sessionStorage) {
  try {
    e.removeItem(Us);
  } catch {
    return;
  }
}
const hc = 2e3, mc = 3e4, ze = va({ starting: !1, external: !1, late: !1, offline: !1 }), ya = () => ze.starting, pc = 3;
let $n = 0, zs = 0, or = 0, rr = [];
async function gc() {
  try {
    const e = await Le.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function vc() {
  clearInterval(zs), clearTimeout(or), zs = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), rr.splice(0).forEach((e) => e()), lc();
}
let fs = !1;
async function yc() {
  if (ze.offline = !navigator.onLine, fs) return;
  fs = !0;
  const e = await gc();
  if (fs = !1, ze.external = e.updating, $n = !e.restarting && !e.updating && e.reachable ? $n + 1 : 0, $n < pc) return;
  $n = 0, (!cc(e.started_at) || Hs()) && vc();
}
function Ka() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, zs = setInterval(yc, hc), or = setTimeout(() => ze.late = !0, mc));
}
const kc = () => ze.starting ? new Promise((e) => rr.push(e)) : Promise.resolve(), Ya = 2e4, wc = 3e5, Ye = 6e5, Mn = 6, bc = 500, xc = "/journal/summary", $c = "/api/server-state", Mc = 2e4, Ja = Xn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Sc = (e) => e.split("?")[0].endsWith(xc), ir = (e, t) => Object.assign(new Error(t), { status: e });
async function _c(e, t, n = ir) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Ec = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Ac {
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
        headers: { ...Ja, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Ec(s),
        signal: AbortSignal.timeout(a || (i ? wc : Ya))
      });
    } catch (l) {
      if (l instanceof TypeError && Ka(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, bc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Mn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : rc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return _c(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ja, signal: AbortSignal.timeout(Ya) });
    if (!n.ok) throw ir(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Mn, o).then((l) => (this.written(n), l));
    if (ya() && !Sc(n))
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
    return fetch($c, { cache: "no-store", signal: AbortSignal.timeout(Mc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && Ka(), s;
    }
  }
}
const Le = new Ac(), Cc = 0, Oc = "/api/lines", Tc = "/api/line";
class Ic {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Cc));
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
        const n = await Le.raw(Oc, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Le.raw(Tc, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Rc = new Ic(), Bc = 150, Lc = () => Bc;
function ka(e, t, n = Lc(), s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
class Nc {
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
      n.patterns.some((s) => lr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function lr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const cr = /* @__PURE__ */ new Map();
class Dc {
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
function m5(e, t) {
  const n = new Dc(e, t);
  return cr.set(e, n), n.load().catch(() => {
  }), n;
}
const wa = (e) => cr.get(e);
function Pc(e, t, n) {
  const s = wa(e);
  return s ? s.offers.value.buttons.filter((a) => a.slots.includes(t)).filter((a) => n || !a.runs.includes("{row_id}")).filter((a) => !a.condition || !n || !Object.hasOwn(n, a.condition.field) || a.condition.values.includes(n[a.condition.field])).map((a) => ({ ...a, menu: a.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((a, o) => +!!a.from - +!!o.from) : [];
}
async function jc(e, t) {
  if (!e) return !0;
  const n = wa(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
let ur = {};
async function p5(e = fetch) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (ur = (await t.json()).states);
}
const ba = (e, t) => {
  var n;
  return (n = ur[e]) == null ? void 0 : n[t];
}, qc = (e, t) => {
  var n;
  return ((n = ba(e, t)) == null ? void 0 : n.label) ?? t.slice(0, 1).toUpperCase() + t.slice(1);
}, dr = (e, t) => {
  var n;
  return ((n = ba(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Fc = (e, t) => {
  var n;
  return ((n = ba(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Wc = Symbol("pane-page"), Hc = { 1: "refused", 2: "usage", 3: "fault" }, Uc = 100, zc = 50, Vc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Gc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Kc({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = T({}), declared: u = [], page: d = null, setOption: h = () => {
}, autoScroll: p = "", tabs: y = [], sources: w = [], links: $ = {}, search: S = {}, readOnly: I = !1, shared: q = null }) {
  const X = /* @__PURE__ */ new Map(), _ = new AbortController(), k = T(!1), E = performance.now();
  let v = 0, O = 0;
  const x = () => {
    clearTimeout(O), O = setTimeout(() => {
      v === 0 && ka(E, () => k.value = !0);
    }, zc);
  }, C = (M) => {
    const m = X.get(M);
    if (m && performance.now() - m.at < Uc) return m.answer;
    v += 1;
    const L = hr(e, M, t, _.signal).finally(() => {
      v -= 1, x();
    });
    return X.set(M, { answer: L, at: performance.now() }), L;
  };
  return {
    answered: k,
    settle: x,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => s()),
    permissions: a,
    autoScroll: p,
    tabs: y,
    sources: w,
    links: $,
    search: S,
    readOnly: I,
    shared: q,
    read: C,
    run: (M) => $t(e, M, t, _.signal),
    upload: (M) => Jc(M, _.signal),
    cancel: () => _.abort(),
    subscriptions: r,
    follow: (M, m) => r.follow(e, M.filter((L) => o.some((j) => lr(j, L))), m, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (M) => R(() => {
      var m;
      return l.value[M] ?? ((m = u.find((L) => L.key === M)) == null ? void 0 : m.default);
    }),
    setting: async (M, m) => {
      const L = await C(`window setting ${e} ${M}`);
      return L.ok ? L.value.value : m;
    },
    setOption: h,
    keep: (M, m) => $t(e, ["window", "save-setting", e, M, JSON.stringify(m)], t, _.signal)
  };
}
function Yc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const nn = { ok: !1, failure: "cancelled", error: "" }, fr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function $t(e, t, n, s = void 0) {
  try {
    const a = await Rc.add({ window: e, line: Array.isArray(t) ? t : mr(t), environment: n }, s);
    return s != null && s.aborted ? nn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Hc[a.code] || "fault", error: Yc(a.error) };
  } catch {
    return s != null && s.aborted ? nn : { ok: !1, failure: "unreachable", error: fr };
  }
}
async function hr(e, t, n, s) {
  const a = await $t(e, t, n, s);
  return a.failure !== "unreachable" || !ya() ? a : (await kc(), s.aborted ? nn : hr(e, t, n, s));
}
async function Jc(e, t = void 0) {
  try {
    const n = await Le.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? nn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? nn : { ok: !1, failure: "unreachable", error: fr };
  }
}
function mr(e) {
  return [...e.matchAll(Vc)].map(([t]) => t.replace(Gc, (n, s, a, o) => s ?? (a === void 0 ? o : a.replace(/\\(["\\])/g, "$1"))));
}
const Zc = (e) => `show-${e}`, g5 = (e, t, n) => e.filter((s) => {
  var a;
  return n(Zc((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), pr = "messages.chat", Xc = {
  key: 0,
  class: "template-brief"
}, Qc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, eu = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T([]), o = T(""), r = R(() => a.value.map((u) => ({ key: String(u.id), label: u.module ? `${u.title} · ${u.module}` : u.title }))), i = R(() => a.value.find((u) => String(u.id) === n.value));
    async function l() {
      const u = await $t(pr, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      a.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), h = a.value.find((p) => p.title === d);
      h && s("pick", String(h.id));
    }
    return l(), (u, d) => (c(), f(K, null, [
      B(Zn, {
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (h) => s("pick", h))
      }, null, 8, ["options", "value"]),
      i.value ? (c(), f("p", Xc, b(i.value.brief), 1)) : A("", !0),
      o.value ? (c(), f("p", Qc, b(o.value), 1)) : A("", !0)
    ], 64));
  }
}, tu = /* @__PURE__ */ Y(eu, [["__scopeId", "data-v-8cbacb6d"]]), nu = { class: "form-field" }, su = { class: "form-field-head" }, au = ["for"], ou = {
  key: 0,
  class: "form-field-aside"
}, ru = {
  key: 0,
  class: "form-field-help"
}, iu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), f("div", nu, [
      g("div", su, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, au),
        t.$slots.aside ? (c(), f("span", ou, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), f("p", ru, b(e.help), 1)) : A("", !0)
    ]));
  }
}, lu = /* @__PURE__ */ Y(iu, [["__scopeId", "data-v-dd7cdcff"]]), Vs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, cu = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Yn(), n = R(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => st((c(), f("textarea", nt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(Vs), U(t).value]
    ]);
  }
}), uu = /* @__PURE__ */ Y(cu, [["__scopeId", "data-v-e130a5b9"]]), du = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = ga(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, i) => (c(), V(lu, {
      label: e.field.label,
      for: U(a),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        B(Wt, { value: o.value }, {
          choice: P(() => [
            B(Zn, {
              id: U(a),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: i[0] || (i[0] = (l) => s("pick", l))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: P(() => [
            B(tu, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (l) => s("pick", l))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            B(uu, {
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
}, Qn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), V(he, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        B(ve, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function fu(e, t, n, s = () => window) {
  Ne(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Te(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const hu = (e, t = () => !0) => fu("keydown", (n) => n.key === "Escape" && t() && e());
function gr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = T(!1), a = R(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return hu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const mu = 80, Bt = va([]);
function vr(e) {
  const t = Symbol("layer"), n = () => Bt.includes(t) && Bt.splice(Bt.indexOf(t), 1);
  return pe(
    e,
    (s) => {
      s && !Bt.includes(t) && Bt.push(t), s || n();
    },
    { immediate: !0 }
  ), Te(n), R(() => mu + Math.max(0, Bt.indexOf(t)));
}
let yr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return yr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const pu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function gu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(pu)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ne(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : yr, document.addEventListener("keydown", a), pt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const vu = ["aria-modal", "aria-label", "aria-labelledby"], yu = {
  key: 0,
  class: "dialog-head"
}, ku = ["id", "tabindex"], wu = {
  key: 1,
  class: "dialog-foot"
}, bu = 500, xu = 400, $u = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = gr(s, n), i = vr(a), l = T(null), u = T(null), d = T(null), h = ga(), p = T(!1), y = Date.now();
    n.modal && gu(u, () => s("escape"), d);
    function w() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, xu);
    }
    function $(q) {
      !n.modal || Date.now() - y >= bu || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const S = () => l.value && (l.value.scrollTop = l.value.scrollHeight), I = new MutationObserver(S);
    return pe(l, (q) => {
      I.disconnect(), q && n.follow && (I.observe(q, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Te(() => I.disconnect()), (q, X) => (c(), V(pa, { to: "body" }, [
      B(qt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: P(() => [
          U(a) ? (c(), f("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: me({ zIndex: U(i) }),
            onClick: be(w, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(h) : void 0,
              onKeydownCapture: $
            }, [
              e.bare ? A("", !0) : (c(), f("header", yu, [
                g("h3", {
                  id: U(h),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, ku),
                e.closable ? (c(), V(Qn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: l,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                ce(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (c(), f("footer", wu, [
                ce(q.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, vu)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, kr = /* @__PURE__ */ Y($u, [["__scopeId", "data-v-6d1ecd98"]]), Mu = (e, t, n = {}) => mr(e.runs).map((s) => s.replace(/\{(\w+)\}/g, (a, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function fn(e, t, n, s = {}) {
  try {
    return await jc(e.module, n) ? $t(pr, Mu(e, t, s), n) : { ok: !1, error: "" };
  } catch (a) {
    return { ok: !1, error: a.message };
  }
}
const Su = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, hs = [
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
    filters: hs
  }),
  tasks: ge("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: hs
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
  pins: ge("Pin", "band", "One line pinned to the chat while it matters", { filters: hs }),
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
}, _u = ["secrets", "plugins"], wr = Object.keys(hn).filter((e) => !(Xn && _u.includes(e)));
R(() => wr.map((e) => ({ name: e, ...hn[e] })));
const Ht = (e) => hn[e], br = new Map(wr.flatMap((e) => [e, e.replace(/s$/, ""), hn[e].title.toLowerCase()].map((t) => [t, e]))), et = (e) => br.get(String(e).toLowerCase()) || "", xr = [...br.keys()].sort((e, t) => t.length - e.length).join("|"), Eu = {
  class: "button-form",
  "data-button-form": ""
}, Au = {
  key: 0,
  class: "button-form-title"
}, Cu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Ou = { class: "button-form-actions" }, Tu = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = T(!1), r = T(""), i = R(() => n.button.fields.every((d) => a.value[d.name].trim().length > 0)), l = R(() => {
      var h;
      if (!n.row) return n.button.label;
      const d = ((h = Ht(et(n.row.kind))) == null ? void 0 : h.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !i.value) return;
      o.value = !0;
      const d = await fn(n.button, n.row, n.environment, a.value);
      o.value = !1, r.value = d.ok ? "" : d.error, d.ok && (s("done"), s("close"));
    }
    return (d, h) => (c(), V(kr, {
      title: l.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: h[1] || (h[1] = (p) => s("close"))
    }, {
      default: P(() => {
        var p;
        return [
          g("div", Eu, [
            (p = e.row) != null && p.title ? (c(), f("p", Au, b(e.row.title), 1)) : A("", !0),
            (c(!0), f(K, null, ee(e.button.fields, (y) => (c(), V(du, {
              key: y.name,
              field: y,
              value: a.value[y.name],
              environment: e.environment,
              onPick: (w) => a.value[y.name] = w
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            r.value ? (c(), f("p", Cu, b(r.value), 1)) : A("", !0),
            g("div", Ou, [
              B(he, {
                small: "",
                onClick: h[0] || (h[0] = (y) => s("close"))
              }, {
                default: P(() => [...h[2] || (h[2] = [
                  se("Cancel", -1)
                ])]),
                _: 1
              }),
              B(he, {
                kind: "primary",
                small: "",
                disabled: !i.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: P(() => [...h[3] || (h[3] = [
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
}, Iu = /* @__PURE__ */ Y(Tu, [["__scopeId", "data-v-879955be"]]), Ru = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Bu = {
  key: 1,
  class: "menu-item-text"
}, Lu = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), f("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), f("span", Ru, b(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), f("span", Bu, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, b(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Mt = /* @__PURE__ */ Y(Lu, [["__scopeId", "data-v-fec99974"]]), Nu = ["aria-busy"], Du = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Pu = {
  __name: "ButtonSlot",
  props: { name: { type: String, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 }, readOnly: Boolean },
  emits: ["done"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => wa(n.environment)), o = R(() => {
      var w;
      return !n.readOnly && ((w = a.value) == null ? void 0 : w.loading.value) && (!a.value.loaded.value || a.value.failed.value);
    }), r = R(() => {
      var w;
      return !n.readOnly && ((w = a.value) == null ? void 0 : w.failed.value);
    }), i = () => a.value.load().catch(() => {
    }), l = R(() => n.readOnly ? [] : Pc(n.environment, n.name, n.row)), u = T(null), d = T(""), h = T(!1), p = (w) => [w.from ? `From ${w.from}` : "", w.tip].filter(Boolean).join(" · ");
    async function y(w) {
      if (h.value || n.readOnly) return;
      if (w.fields.length) {
        u.value = w;
        return;
      }
      h.value = !0;
      const $ = await fn(w, n.row, n.environment);
      h.value = !1, d.value = $.ok ? "" : $.error, $.ok && s("done");
    }
    return (w, $) => (c(), f("span", {
      class: J(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && r.value ? (c(), f(K, { key: 0 }, [
        $[3] || ($[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        B(he, {
          small: "",
          onClick: i
        }, {
          default: P(() => [...$[2] || ($[2] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (c(), f(K, { key: 1 }, [
        (c(!0), f(K, null, ee(l.value, (S) => (c(), f(K, {
          key: S.name
        }, [
          S.menu.length ? (c(), V(ec, {
            key: 0,
            small: "",
            kind: S.primary ? "primary" : "ghost",
            disabled: h.value,
            "menu-label": S.menu_label || "More ways",
            title: p(S),
            "data-button": S.name,
            onMain: (I) => y(S)
          }, {
            menu: P(({ close: I }) => [
              (c(!0), f(K, null, ee(S.menu, (q) => (c(), V(Mt, {
                key: q.label,
                description: q.description,
                onClick: (X) => (I(), y({ ...S, ...q, menu: [] }))
              }, {
                default: P(() => [
                  se(b(q.label), 1)
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
            bordered: !S.primary,
            icon: S.icon,
            disabled: h.value,
            title: p(S),
            "data-button": S.name,
            onClick: (I) => y(S)
          }, {
            default: P(() => [
              se(b(S.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly ? (c(), f("span", Du, b(d.value), 1)) : A("", !0),
        u.value && !e.readOnly ? (c(), V(Iu, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: $[0] || ($[0] = (S) => u.value = null),
          onDone: $[1] || ($[1] = (S) => s("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, Nu));
  }
}, ju = /* @__PURE__ */ Y(Pu, [["__scopeId", "data-v-babd6653"]]), qu = {
  class: "running",
  "data-running-command": ""
}, Fu = ["title"], Wu = {
  key: "idle",
  class: "running-idle"
}, Hu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), f("span", qu, [
      B(qt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (c(), f("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, Fu)) : (c(), f("span", Wu, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, v5 = /* @__PURE__ */ Y(Hu, [["__scopeId", "data-v-d3240219"]]), Uu = ["aria-checked", "aria-label", "title"], zu = {
  key: 0,
  class: "switch-inner"
}, Vu = {
  key: 0,
  class: "switch-word"
}, Gu = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), f("button", {
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
        e.labelled ? (c(), f("span", zu, b(e.word), 1)) : A("", !0),
        a[1] || (a[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), f("span", Vu, b(e.word), 1)) : A("", !0)
    ], 10, Uu));
  }
}, y5 = /* @__PURE__ */ Y(Gu, [["__scopeId", "data-v-1bfb90f3"]]);
function $r(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function sn(e, t) {
  return $r(() => localStorage, e, t);
}
function Mr(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function es(e, t) {
  return Mr(() => localStorage, e, t);
}
function Sr(e, t) {
  pe(t, (n) => es(e, n), { deep: !0 });
}
function Ku(e, t) {
  return $r(() => sessionStorage, e, t);
}
function Yu(e, t) {
  return Mr(() => sessionStorage, e, t);
}
const qn = "journal.environment", _r = T(Ku(qn, sn(qn, "")));
function Ju(e) {
  _r.value = e, Yu(qn, e), es(qn, e);
}
const Fn = T(location.hash), Za = ut(null), Xa = { integrations: "mcp", library: "team" };
function Zu() {
  if (!Za.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Xa[n]) {
    location.replace(`#/${[Xa[n], ...s].join("/")}${t ? `?${t}` : ""}`), Fn.value = location.hash;
    return;
  }
  !n || Za.value(n) || (Ju(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Fn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Fn.value = location.hash, Zu();
});
const Xe = R(() => {
  const [e, t = ""] = Fn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", h = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(h) || 0, env: l };
  });
  return {
    env: _r.value,
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
}), ts = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${ts.page(e)}?open=${t}`
};
function Xu(e = "", t = 0, n = "") {
  location.hash = ts.page(e, t, n);
}
const Qu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Er(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Qu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Nt = {};
function k5(e, t) {
  return Nt[e] = t, () => Nt[e] === t && delete Nt[e];
}
function Ar(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Nt[e]) != null && r.call(Nt, t))) return;
  const a = Xe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Er([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function ed(e, t, n, s = 0, a = "") {
  if (e === Xe.value.env) return Ar(t, n, s, a);
  const o = Xe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Er([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Fe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? ed(s, a, Number(o), 0, t) : Ar(a, Number(o), 0, t);
}
function td(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Lt(e) {
  const t = td(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function w5(e, t, n) {
  const s = e.indexOf(t);
  return e[s < 0 ? 0 : Math.max(0, Math.min(e.length - 1, s + n))];
}
const nd = {
  key: 1,
  class: "row-list-failure"
}, sd = ["data-row"], ad = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = T(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), V(Et, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), f("p", nd, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), V(jn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        se(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), f(K, { key: 3 }, [
      (c(), V(_t(e.arrival ? Xo : "ul"), nt(n.value, { class: "row-list" }), {
        default: P(() => [
          (c(!0), f(K, null, ee(e.rows, (i) => (c(), f("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ce(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, sd))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : A("", !0)
    ], 64));
  }
}, od = /* @__PURE__ */ Y(ad, [["__scopeId", "data-v-aa6ad7ff"]]), rd = {
  class: "agent-rows",
  "data-agent-rows": ""
}, id = {
  key: 1,
  class: "agent-rows-note"
}, ld = {
  key: 2,
  class: "agent-rows-note"
}, cd = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ud = ["data-agent-row", "onClick"], dd = { class: "agent-row-name" }, fd = { class: "agent-row-state" }, hd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = R(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), f("div", rd, [
      e.loaded ? e.failure ? (c(), f("p", id, b(e.failure), 1)) : e.rows.length ? (c(), f(K, { key: 3 }, [
        g("p", cd, b(s.value) + " running", 1),
        (c(!0), f(K, null, ee(n.value, (r) => (c(), f("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => U(Fe)(`agents:${r.id}`)
        }, [
          g("span", dd, "#" + b(r.id) + " " + b(r.session), 1),
          g("span", fd, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, ud))), 128))
      ], 64)) : (c(), f("p", ld, b(e.none), 1)) : (c(), V(Et, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, b5 = /* @__PURE__ */ Y(hd, [["__scopeId", "data-v-a01e5a17"]]), md = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), f("span", {
      class: J(["badge", e.tone])
    }, b(e.text), 3));
  }
}, Cr = /* @__PURE__ */ Y(md, [["__scopeId", "data-v-9e7e1157"]]), pd = ["aria-valuenow", "aria-valuemax"], gd = {
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
    return (s, a) => (c(), f("span", {
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: me({ width: n.value })
      }, null, 4)
    ], 10, pd));
  }
}, vd = /* @__PURE__ */ Y(gd, [["__scopeId", "data-v-9eba6a85"]]), yd = { class: "bars" }, kd = { class: "bar-name" }, wd = { class: "bar-value" }, bd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), f("div", yd, [
      (c(!0), f(K, null, ee(e.items, (l, u) => (c(), V(_t(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: J(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: P(() => [
          g("span", kd, b(l.label), 1),
          B(vd, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", wd, b(l.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, xd = /* @__PURE__ */ Y(bd, [["__scopeId", "data-v-663427f4"]]), $d = { class: "bars" }, Md = {
  key: 0,
  class: "bars-title"
}, Sd = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), f("div", $d, [
      e.node.title ? (c(), f("span", Md, b(e.node.title), 1)) : A("", !0),
      B(xd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, _d = /* @__PURE__ */ Y(Sd, [["__scopeId", "data-v-7135bb11"]]), Ed = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = R(() => n[s.node.type](s.node));
    return (r, i) => (c(), f("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: me(o.value)
    }, [
      (c(!0), f(K, null, ee(e.node.children || [], (l, u) => (c(), V(si, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Rn = /* @__PURE__ */ Y(Ed, [["__scopeId", "data-v-d142a3f4"]]), Ad = {
  key: 0,
  class: "card-head"
}, Cd = { class: "card-title" }, Od = {
  key: 0,
  class: "card-note"
}, Td = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), f("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), f("header", Ad, [
        g("span", Cd, b(e.node.title), 1),
        e.node.note ? (c(), f("span", Od, b(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      B(Rn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Id = /* @__PURE__ */ Y(Td, [["__scopeId", "data-v-67b72d40"]]), Qa = (e) => [...new Set(e.agents.map((t) => t.name))], x5 = (e) => Qa(e).length === 1 ? `Worker: ${Qa(e)[0]}` : "Delegated", Rd = (e) => "task_ids" in e, Or = 1024, Bd = Or * 1024 * 1024, Ld = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Or} MB limit for one file.`, Be = (e) => encodeURIComponent(e);
function de(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const zt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Vt = "the page does not know its environment yet", Nd = "X-Journal-Env", Dd = "X-Journal-Request-At", ms = "/viewer/voices/figures/";
class xa {
  constructor({ env: t = () => Xe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new xa({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [Dd]: String(Date.now()), ...this.env() ? { [Nd]: this.env() } : {} };
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
    if (Xn) return Promise.reject(Object.assign(new Error(oc), { status: 403 }));
    if (s.size > Bd) return Promise.reject(new Error(Ld(s)));
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
    return Le.request("GET", ms + "figures.json");
  }
  voiceFigureUrl(t) {
    return ms + t;
  }
  figureDecoderUrl() {
    return ms + "draco/";
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
    return `${this.base}/${t ? `?env=${Be(t)}` : ""}${ts.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const Ve = new xa({ base: Xn ? "/p" : "" }), Pd = (e) => Le.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), eo = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), jd = 6e4, qd = 4, Fd = 300, Wd = 5e3, Tr = /* @__PURE__ */ new Map();
function ns(e) {
  if (!(e in eo)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return eo[e];
}
function Hd(e) {
  const t = ns(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Wd;
  }
}
const Ud = (e) => e / 2 + Math.random() * e / 2, Ir = (e) => [...e.users.values()].pop(), $a = (e) => Tr.get(e.place) === e, zd = () => Math.random() * Fd, Ma = () => document.hidden;
function Vd(e) {
  const t = Hd(e);
  return e.failures ? Ud(Math.min(jd, t * 2 ** e.failures)) : Math.max(t, qd * e.took);
}
function Rr(e, t) {
  clearTimeout(e.timer), !(!$a(e) || Ma()) && (e.timer = setTimeout(() => Gd(e), t));
}
function Gd(e) {
  return $a(e) ? e.running ? (e.again = !0, e.running) : (e.running = Zd(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Kd = (e) => {
  var t, n;
  return !Ma() && (((n = (t = ns(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Ir(e).active() && !ya();
};
async function Yd(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Le.attemptOnce(() => ns(e.key).read(Ir(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function Jd(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = ns(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function Zd(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Kd(e) && Jd(e, await Yd(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && $a(e));
  Rr(e, Vd(e));
}
const Xd = () => Ma() || Tr.forEach((e) => Rr(e, zd()));
document.addEventListener("visibilitychange", Xd);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Br = (e) => `${e.table}:${e.id}`, to = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ps = 80;
function no(e) {
  return e.length <= ps ? e : `${e.slice(0, ps + 1).replace(/\s+\S*$/, "") || e.slice(0, ps)}…`;
}
const so = {
  messages: (e) => no(to(e.text)),
  comments: (e) => no(to(e.text)),
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
}, Qd = (e) => (so[e.table] ? so[e.table](e) : e.title || "") || "", ef = ["done", "cancelled"], Gs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => ef.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, tf = (e) => Gs[e.table] ? Gs[e.table](e) : 0, Lr = (e) => tf(e) > 0, nf = (e) => !!Gs[e], St = (e) => Ee(e.created_at), Sa = (e) => Ee(e.updated_at) || St(e), sf = 60, af = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - sf, of = (e, t) => e.id > 0 && e.table === t.table && af(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), _a = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => of(s, n))), rf = { me: 1, people: [] }, ie = va({
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
  people: rf,
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
Sr("journal.activity", () => ie.activity);
Sr("journal.side.mini", () => ie.sideMini);
const lf = 50, Nr = 100, cf = { messages: 25 }, He = (e) => cf[e] || lf;
function uf(e, t) {
  if (e !== "messages") return Math.max(t.length - He(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === He(e)) return s;
  return 0;
}
const mt = /* @__PURE__ */ new Set(), Ea = T(0), mn = /* @__PURE__ */ new Set(), pn = /* @__PURE__ */ new Set(), lt = /* @__PURE__ */ new Set(), Ks = /* @__PURE__ */ new Set(), df = /* @__PURE__ */ new Map(), ff = /* @__PURE__ */ new Map();
let Gt = !1, Kt = null;
const hf = (e, t) => e.id - t.id, mf = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, pf = { messages: mf }, Dr = (e) => pf[e] || hf;
function Pr(e) {
  return Ea.value, mt.has(e) || (mt.add(e), ie.booted && (!mn.has(e) || pn.has(e)) && queueMicrotask(() => Aa([e], !1))), ie.rows[e] || [];
}
function gf(e) {
  const t = ie.rows[e] || [], n = uf(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ie.rows[e] = t.filter((a) => s.has(a) || nf(e) && !Lr(a)), ie.paging.size[e] = He(e), ie.paging.more[e] = !0;
}
const vf = /* @__PURE__ */ new Set();
function yf() {
  mt.forEach(gf), mt.clear(), df.clear(), ff.clear(), Ea.value += 1;
}
pe(() => `${Xe.value.env}/${Xe.value.page}/${Xe.value.open ? Xe.value.open.table : ""}`, yf);
pe(
  () => ie.booted,
  (e) => e && Aa(
    [...mt].filter((t) => !mn.has(t)),
    !1
  )
);
const Ys = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Rd(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function jr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ys(s) && !Ys(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function qr(e, t) {
  mn.add(e), Ea.value += 1;
  const n = ie.rows[e] || [];
  ie.rows[e] = [...jr(n, t.rows), ..._a(n.filter((s) => s.id === 0), t.rows)], ie.paging.size[e] = ie.paging.size[e] || He(e), ie.paging.more[e] = !t.is_last_page;
}
async function kf(e) {
  const t = new Set((ie.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: He(e) });
  ss(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = _a((ie.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return qr(e, { ...n, rows: [...n.rows, ...a].sort(Dr(e)) }), ie.paging.size[e] = He(e), Fr.has(e) && await Wr(e), ie.rows[e];
}
const ss = (e, t) => ie.counts = { ...ie.counts, [e]: t };
async function wf(e) {
  const t = ie.rows[e] || [], n = Math.max(0, ...t.map(Sa)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: He(e), since: n, after: s });
  if (ss(e, a.counts), !a.is_last_page) return kf(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = _a(t.filter((i) => !o.has(i.id)), a.rows).concat(jr(t, a.rows));
  return ie.rows[e] = r.sort(Dr(e)), ie.paging.size[e] = ie.rows[e].length, ie.rows[e];
}
const gs = /* @__PURE__ */ new Set();
async function bf(e, t = !1) {
  e.forEach((n) => pn.delete(n)), e.forEach((n) => Ks.add(n));
  try {
    await Af(e, t);
  } finally {
    e.forEach((n) => Ks.delete(n));
  }
}
async function xf(e) {
  const t = await Ve.list(e, { limit: He(e) });
  ss(e, t.counts), qr(e, t);
}
async function $f(e) {
  ss(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const Fr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Wr(e) {
  const t = (ie.rows[e] || []).filter((a) => Ys(a) && (e !== "plans" || !Lr(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ie.rows[e] = (ie.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Mf = (e, t) => !mn.has(e) || t && (ie.paging.size[e] || He(e)) === He(e) && !vf.has(e);
async function Sf(e, t) {
  if (!mt.has(e)) return $f(e);
  const n = await (Mf(e, t) ? xf(e) : wf(e));
  return Fr.has(e) && await Wr(e), n;
}
async function Hr() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ie.settings) && (ie.settings = e);
}
async function _f() {
  const [e] = await Promise.all([Ve.entries(0, Nr), Hr()]);
  Tf([...sn(zr(), []), ...e]);
}
const Ef = (e, t) => Sf(e, t).then(
  () => null,
  () => e
);
async function Af(e, t) {
  const n = (await Promise.all(e.map((s) => Ef(s, t)))).filter(Boolean);
  if (n.forEach((s) => (lt.add(s), pn.add(s))), t && await _f(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ur = 1e3, Cf = 15e3;
let Sn = Ur;
async function Of() {
  return Kt || (Kt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...lt].some((e) => !gs.has(e)) || Gt; ) {
      const e = Gt, t = [...e ? Object.keys(ie.rows) : lt].filter((s) => hn[s] && (mt.has(s) || s in ie.rows)).filter((s) => e || !mt.has(s) || pn.has(s) || !mn.has(s)).filter((s) => !gs.has(s)), n = [...lt].filter((s) => gs.has(s));
      lt.clear(), n.forEach((s) => lt.add(s)), Gt = !1;
      try {
        await bf(t, e), Sn = Ur;
      } catch {
        Gt = Gt || e, await new Promise((a) => setTimeout(a, Sn)), Sn = Math.min(Sn * 2, Cf);
      }
    }
  })().finally(() => Kt = null), Kt);
}
function Aa(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Ks.has(n)).forEach((n) => {
    lt.add(n), t && pn.add(n);
  }), lt.delete("settings") && Hr(), Of();
}
const zr = () => {
  var e;
  return `typed-entries:${((e = ie.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Tf(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ie.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Nr), es(zr(), ie.entries.slice(-50));
}
Pd((e) => ie.streamOpen || Aa([e]));
const Js = [], If = 2e3, it = /* @__PURE__ */ new Map(), Rf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Bf = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Ct(e, { first: t = !1 } = {}) {
  t ? Js.unshift(e) : Js.push(e), it.clear();
}
function Vr(e, t, n) {
  var a;
  const s = Pr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Lf = (e) => Pr(e.table).find((t) => t.id === e.id) === e.row, Nf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Df(e, t) {
  const n = [{ kind: "text", text: tt(e).replace(/\r\n/g, `
`) }];
  for (const s of Js)
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
  return Pf(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Pf(e) {
  return e.split(Bf).map((t, n) => n % 2 ? t : t.replace(Rf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function ao(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const jf = 24;
function qf(e) {
  const [t, , ...n] = e, s = ao(t), a = n.map(ao), o = (l) => [s, ...a].some((u) => (u[l] ?? "").length > jf) ? ' class="text-column"' : "", r = s.map((l, u) => `<th${o(u)}>${an(l)}</th>`).join(""), i = a.map((l) => `<tr>${l.map((u, d) => `<td${o(d)}>${an(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${r}</tr></thead><tbody>${i}</tbody></table>`;
}
const Gr = /^\s*(?:[-*+]|\d+[.)])\s+/, Zs = /^\s*(\d+)[.)]\s/, oo = (e) => e.match(/^\s*/)[0].length;
function Kr(e) {
  const t = e[0].match(Zs), n = oo(e[0]), s = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = s[s.length - 1];
    r && oo(o) <= n ? s.push({ text: r[2], nested: [] }) : i && o.trim() && (r || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${s.map((o) => `<li>${an(o.text)}${o.nested.length ? Kr(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Ff(e, t) {
  const n = Zs.test(e[t]);
  let s = t + 1;
  for (let a = s; a < e.length; a += 1)
    if (Gr.test(e[a]) && Zs.test(e[a]) === n || a === s && /^\s{2,}\S/.test(e[a])) s = a + 1;
    else if (e[a].trim()) break;
  return s;
}
const ro = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Yr(e) {
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
    if (ro(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(qf(t.slice(s, i))), s = i;
      continue;
    }
    if (Gr.test(a)) {
      const i = Ff(t, s);
      n.push(Kr(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Yr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !ro(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${an(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Wf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Hf = (e) => e.kind !== "text" && !Wf.test(e.html);
function Uf(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Yr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Hf(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Xs(e, t = { env: "" }) {
  const n = Nf(e, t), s = it.get(n);
  if (it.delete(n), s && s.reads.every(Lf))
    return it.set(n, s), s.html;
  const a = [], o = Uf(Df(e, { ...t, reads: a }));
  return it.set(n, { html: o, reads: a }), it.size > If && it.delete(it.keys().next().value), o;
}
const Jr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, gn = (e) => String(e || "").replace(Jr, (t, n, s, a) => a), zf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), _n = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Vf = /^Traceback \(most recent call last\):/m, Gf = 8;
function Zr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Gf).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Kf(e) {
  const t = [...e.matchAll(zf)].map((s) => s.index);
  if (_n.lastIndex = 0, !t.length || !_n.test(e)) return null;
  _n.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(_n)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Zr(n), tail: "" } : null;
}
function Yf(e) {
  const t = Vf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Zr([o]), tail: n.slice(a).join(`
`) };
}
Ct((e) => {
  const t = gn(e), n = Yf(t) || Kf(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const Jf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Zf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Xf = /[\w\]]\(/, Qf = /^[\w$.[\]'"]+\s*=\s*[^=]/, eh = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, th = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, nh = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, sh = /[[({,]$/, ah = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, oh = /^(\t|\s{2,})\S/, rh = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, ih = /`[^`]+`/, lh = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, ch = /[{}()[\];=<>$&|*\\@+^~%]/g, Xr = /^\s*(?:[-*+]|\d+[.)])\s/, uh = /^\s*>/, dh = /^\s*\|/, fh = 0.6, hh = 0.4, mh = 5, ph = 0.03, Qr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= mh && t.every((n) => lh.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(ch) ?? []).length / e.length < ph;
}, vs = (e) => {
  const t = e.trim();
  return ih.test(t) ? !1 : [Jf, Zf, Xf, Qf, eh, th, nh, sh, ah].some((n) => n.test(t)) || /[;{}]$/.test(t) || oh.test(e) && !Xr.test(e) && !Qr(e);
};
function gh(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Xr.test(t[0]) || t.every((o) => uh.test(o) || dh.test(o))) return "text";
  const n = t.filter((o) => !rh.test(o.trim()));
  if (t.length === 1) return !n.length || vs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(vs).length, a = n.filter((o) => !vs(o) && Qr(o)).length;
  return s >= n.length * fh && a <= n.length * hh ? "code" : "text";
}
const Qs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", vh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", yh = `${Qs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, kh = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", wh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", io = {
  js: { keywords: Qs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: vh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: yh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Qs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: kh, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: wh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, bh = {
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
function lo(e, t, n) {
  return n && e.startsWith(n, t);
}
function xh(e, t) {
  const n = io[bh[t] ?? t] || io.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (lo(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && lo(e, o, n.block[0])) {
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
      const d = e.slice(o).match(/^[\w$]+/)[0], h = n.lower ? d.toLowerCase() : d, p = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(s.has(h) ? "keyword" : p ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function $h(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of xh(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? tt(r) : `<span class="tok-${s}">${tt(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Mh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Sh = 1500, co = /* @__PURE__ */ new WeakMap();
async function _h(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Mh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(co.get(t)), co.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Sh)
  )));
}
typeof document < "u" && document.addEventListener("click", _h, !0);
const Eh = /\n\s*\n/, Ah = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Ch = /^\s*(`{3,}|~{3,})\s*$/, Oh = /^\s{4,}\S/, Th = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ea = /^\s*(?:[-*+]|\d+[.)])\s/, ei = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Ih = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ca(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Rh(e) {
  const t = Ca(e.join(`
`));
  return (Ih.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Bh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ei.test(t) && !ea.test(t);
}, Lh = (e, t) => ea.test(t) || ea.test([...e].reverse().find((n) => n.trim()) || "");
function Oa(e, t) {
  const n = t || Rh(e), s = $h(Ca(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function Nh(e, t, n) {
  const s = e.findIndex((a, o) => o > t && a.trim().startsWith(n) && Ch.test(a));
  return s < 0 ? e.length : s;
}
function Dh(e, t, n) {
  const s = e.map((a) => a.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return Oa(s.map(gn), n ? n.toLowerCase() : "");
}
function Ph(e) {
  const t = e.split(Eh).map((r) => ({ paragraph: r, kind: gh(Ca(r).split(`
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
      a(), n.push(Oa(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(gn), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function jh(e, t) {
  const n = e.split(`
`), s = [];
  let a = [];
  const o = () => {
    a.length && s.push(...t ? [{ kind: "text", text: a.join(`
`) }] : Ph(a.join(`
`))), a = [];
  };
  let r = 0;
  for (; r < n.length; ) {
    const i = n[r].match(Ah);
    if (i) {
      const u = Nh(n, r, i[2]);
      o(), s.push(Dh(n.slice(r + 1, u), i[1], i[3])), r = u + 1;
      continue;
    }
    const l = Bh(a) ? Th : Oh;
    if (!t && l.test(n[r]) && !Lh(a, n[r])) {
      let u = r;
      for (; u < n.length && (l.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; a.length && a[a.length - 1].trim() && ei.test(a[a.length - 1].trim()); ) d.unshift(a.pop());
      if (u - r + d.length >= 2) {
        o(), s.push(Oa([...d, ...n.slice(r, u)].map(gn), "")), r = u;
        continue;
      }
      a.push(...d);
    }
    a.push(n[r]), r += 1;
  }
  return o(), s.length > 1 || s[0] && s[0].kind === "html" ? s : null;
}
Ct((e, t) => jh(e, t.document));
const qh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Fh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Wh(e) {
  const t = qh.exec(e);
  if (t && et(t[1])) return { at: t.index, length: t[0].length, table: et(t[1]), id: Number(t[2]), label: t[3] };
  const n = Fh.exec(e), s = n && et(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Hh(e, t, n, s) {
  const a = Vr(s, e, t), o = gn(a ? Qd(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${tt(Ht(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
Ct(
  (e, t) => {
    const n = Wh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Hh(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Uh = /\.(png|jpe?g|gif|webp|svg)$/i, zh = (e) => Uh.test(e), Vh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Gh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Kh(e, t) {
  const n = Vh.exec(e), [, s, a, o, r, i] = n || [], l = n && et(s || o), u = l && Vr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), h = `${Ht(l).title} ${u.id} · ${tt(i)}`, p = zh(i) ? `<img class="file-card-image" src="${d}" alt="${tt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${tt(i)}">${p}<span class="file-card-name">${h}</span></a>` };
}
function Yh(e) {
  const t = Gh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Ct(
  (e, t) => {
    if (t.inline) return null;
    const n = Kh(e, t) || Yh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Jh = /`([^`\n]+)`/g;
Ct((e) => e.replace(Jh, (t, n) => `<code>${n}</code>`));
const uo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${ts.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Ct(
  (e, t) => e.replace(Jr, (n, s, a, o) => uo[s] ? uo[s](a, o, t) : o)
);
const Zh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, ti = new RegExp(`\\b(${xr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), ni = new RegExp(`\\b(${xr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Xh = new RegExp(`<code>((?:${ti.source}|${ni.source}))</code>`, "gi"), Qh = (e) => e.replace(Xh, "$1"), e1 = (e, t) => `<a class="row-pill" href="#" data-peek="${et(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, t1 = (e) => e.replace(ni, (t, n, s) => s.replace(/\d+/g, (a) => e1(n.replace(/s$/i, ""), a))), n1 = (e) => t1(e).replace(
  ti,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${et(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
Ct(
  (e, t) => t.rowNames === !1 ? e : Qh(e).split(Zh).map((n, s) => s % 2 ? n : n1(n)).join("")
);
const s1 = ["innerHTML"], a1 = ["innerHTML"], o1 = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Xs(s, { env: Xe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), f("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(Lt) && U(Lt)(...o)),
      innerHTML: n.value
    }, null, 8, s1)) : (c(), f("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(Lt) && U(Lt)(...o)),
      innerHTML: n.value
    }, null, 8, a1));
  }
}, dt = /* @__PURE__ */ Y(o1, [["__scopeId", "data-v-1a43d211"]]), r1 = { class: "fact" }, i1 = { class: "fact-label" }, l1 = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", r1, [
      g("span", i1, b(e.label), 1),
      B(dt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, c1 = /* @__PURE__ */ Y(l1, [["__scopeId", "data-v-3a88ecf8"]]), u1 = { class: "list" }, d1 = { class: "list-label" }, f1 = {
  key: 1,
  class: "list-note"
}, h1 = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), f("div", u1, [
      (c(!0), f(K, null, ee(e.items, (o, r) => (c(), V(_t(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          g("span", d1, b(o.label), 1),
          o.badge ? (c(), V(Cr, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), f("span", f1, b(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, m1 = /* @__PURE__ */ Y(h1, [["__scopeId", "data-v-ebe2ae0a"]]), p1 = { class: "table" }, g1 = {
  key: 0,
  class: "table-row empty"
}, v1 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), f("div", p1, [
      g("div", {
        class: "table-row head",
        style: me(a.value)
      }, [
        (c(!0), f(K, null, ee(e.columns, (i) => (c(), f("span", {
          key: i,
          class: "cell"
        }, b(i), 1))), 128))
      ], 4),
      (c(!0), f(K, null, ee(e.rows, (i, l) => (c(), V(_t(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: J(["table-row", i.tone, { opens: i.open }]),
        style: me(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: P(() => [
          (c(!0), f(K, null, ee(i.cells, (u, d) => (c(), f("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), f("div", g1, b(e.empty), 1)) : A("", !0)
    ]));
  }
}, y1 = /* @__PURE__ */ Y(v1, [["__scopeId", "data-v-9326a52e"]]), k1 = { class: "stat-value" }, w1 = { class: "stat-label" }, b1 = {
  key: 0,
  class: "stat-note"
}, x1 = {
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
        g("span", k1, b(e.value), 1),
        g("span", w1, b(e.label), 1),
        e.note ? (c(), f("span", b1, b(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, $1 = /* @__PURE__ */ Y(x1, [["__scopeId", "data-v-ad0db6d6"]]), M1 = { class: "code" }, S1 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), V(Wt, {
      value: e.node.type
    }, {
      stack: P(() => [
        B(Rn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: P(() => [
        B(Rn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: P(() => [
        B(Rn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: P(() => [
        B(Id, {
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
        B($1, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        B(_d, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        B(y1, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        B(m1, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        B(dt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        B(c1, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        B(Cr, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        g("pre", M1, [
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
}), si = /* @__PURE__ */ Y(S1, [["__scopeId", "data-v-cbdcf540"]]), _1 = { class: "dashboard" }, E1 = { class: "trail" }, A1 = ["onClick"], C1 = {
  key: 0,
  class: "gone",
  role: "status"
}, O1 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (p) => p in (n.document.pages || {}), o = T(!!n.page && !a(n.page)), r = T(n.page && !o.value ? [n.page] : []), i = R(() => r.value.at(-1) || n.document.start), l = R(() => (n.document.pages || {})[i.value] || null), u = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, r.value = [...r.value, p];
    }, h = (p) => {
      o.value = !1, r.value = r.value.slice(0, p);
    };
    return pe(
      () => n.document.start,
      () => r.value = []
    ), (p, y) => (c(), f("div", _1, [
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
      })) : l.value ? (c(), f(K, { key: 2 }, [
        g("nav", E1, [
          g("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (w) => h(0))
          }, b(u(e.document.start)), 3),
          (c(!0), f(K, null, ee(r.value, (w, $) => (c(), f(K, {
            key: `${$}-${w}`
          }, [
            y[2] || (y[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: J(["step", { current: $ === r.value.length - 1 }]),
              onClick: (S) => h($ + 1)
            }, b(u(w)), 11, A1)
          ], 64))), 128))
        ]),
        o.value ? (c(), f("p", C1, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        B(qt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (c(), f("div", {
              key: i.value,
              class: "page"
            }, [
              B(si, {
                node: l.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (w) => s("file", w))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, $5 = /* @__PURE__ */ Y(O1, [["__scopeId", "data-v-fbe83734"]]), rt = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, T1 = 6;
function Ta(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const I1 = (e) => {
  const t = Ta(e, rt.lineChars), n = Math.max(rt.minWidth, Math.max(...t.map((s) => s.length)) * rt.charWidth + rt.padX * 2);
  return { name: e, lines: t, line: rt.line, padY: rt.padY, width: n, height: t.length * rt.line + rt.padY * 2 };
};
function R1(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function B1(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function L1(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const h = i(d).map((p) => l.get(p));
      return h.length ? h.reduce((p, y) => p + y, 0) / h.length : l.get(d);
    };
    return [...r].sort((d, h) => u(d) - u(h));
  };
  for (let r = 0; r < T1; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (h) => t.filter((p) => p[i ? 1 : 0] === h).map((p) => p[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function N1(e, t) {
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
function D1(e) {
  const t = [...new Set(e.flatMap(([_, k]) => [_, k]))], n = new Set(e.map(([, _]) => _)), s = t.filter((_) => !n.has(_)), a = R1(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((_, k) => !a.has(k)), r = B1(t, o), i = L1(t, o, r), l = new Map(t.map((_) => [_, I1(_)])), u = i.map((_) => _.reduce((k, E) => k + l.get(E).width, 0) + je.across * (_.length - 1)), d = Math.max(...u) + je.margin * 2, h = j1(e, r, i.length), p = /* @__PURE__ */ new Map();
  let y = je.margin;
  i.forEach((_, k) => {
    let E = (d - u[k]) / 2;
    const v = Math.max(..._.map((O) => l.get(O).height));
    _.forEach((O) => {
      const x = l.get(O);
      p.set(O, { ...x, x: E, y: y + (v - x.height) / 2 }), E += x.width + je.across;
    }), y += v + (h[k] ?? je.down);
  });
  const w = e.map(([_, k, E], v) => ({ from: _, to: k, label: E || "", back: a.has(v) || r.get(k) <= r.get(_) }));
  N1(w, p);
  const $ = w.map((_) => q1(_, p.get(_.from), p.get(_.to))), S = [...p.values()], I = U1($, S), q = Math.max(y - je.down, ...I.filter((_) => _.label).map((_) => _.label.y + _.label.height));
  return { width: Math.max(d - je.margin, ...I.filter((_) => _.label).map((_) => _.label.x + _.label.width)) + je.margin, height: q + je.margin, nodes: S, arrows: I };
}
const P1 = (e) => e ? Ta(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function j1(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += P1(r) + je.labelSpace);
  }), s.map((a) => Math.max(je.down, a));
}
function q1(e, t, n) {
  const s = e.label ? Ta(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((p) => p.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, h = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: h, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const F1 = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, W1 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], H1 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function U1(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = F1(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = H1.flatMap((l) => W1.map((u) => a(u, l))).find((l) => !n.some((u) => fo(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => fo(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const fo = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, z1 = { class: "flowchart-tools" }, V1 = ["width", "height", "viewBox", "aria-label"], G1 = ["d"], K1 = ["x", "y", "width", "height"], Y1 = ["x", "y"], J1 = ["x", "dy"], Z1 = {
  key: 0,
  class: "flowchart-label"
}, X1 = ["x", "y", "width", "height"], Q1 = ["x", "y"], em = ["x", "dy"], tm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => D1(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = T(null), i = T({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var I;
      const $ = (I = r.value) == null ? void 0 : I.getBoundingClientRect();
      if (!($ != null && $.width)) return;
      const S = Math.min($.width / a.value.width, $.height / a.value.height, 1.5);
      i.value = { zoom: S, x: ($.width - a.value.width * S) / 2, y: ($.height - a.value.height * S) / 2 };
    }
    function d($, S, I) {
      const { zoom: q, x: X, y: _ } = i.value, k = Math.min(o.most, Math.max(o.least, q * $));
      i.value = { zoom: k, x: S - (S - X) * k / q, y: I - (I - _) * k / q };
    }
    function h($) {
      const S = r.value.getBoundingClientRect();
      d($, S.width / 2, S.height / 2);
    }
    function p($) {
      const S = r.value.getBoundingClientRect();
      $.ctrlKey || $.metaKey ? d($.deltaY < 0 ? o.step : 1 / o.step, $.clientX - S.left, $.clientY - S.top) : i.value = { ...i.value, x: i.value.x - $.deltaX, y: i.value.y - $.deltaY };
    }
    function y($) {
      var S, I, q;
      $.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), l = { x: $.clientX - i.value.x, y: $.clientY - i.value.y }, (q = (I = r.value).setPointerCapture) == null || q.call(I, $.pointerId);
    }
    function w($) {
      l && (i.value = { ...i.value, x: $.clientX - l.x, y: $.clientY - l.y });
    }
    return Ne(u), ($, S) => (c(), V(kr, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (I) => s("close"))
    }, {
      default: P(() => [
        g("div", z1, [
          B(he, {
            small: "",
            onClick: S[0] || (S[0] = (I) => h(o.step))
          }, {
            default: P(() => [...S[5] || (S[5] = [
              se("Zoom in", -1)
            ])]),
            _: 1
          }),
          B(he, {
            small: "",
            onClick: S[1] || (S[1] = (I) => h(1 / o.step))
          }, {
            default: P(() => [...S[6] || (S[6] = [
              se("Zoom out", -1)
            ])]),
            _: 1
          }),
          B(he, {
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
          onPointermove: w,
          onPointerup: S[2] || (S[2] = (I) => Va(l) ? l.value = null : l = null),
          onPointercancel: S[3] || (S[3] = (I) => Va(l) ? l.value = null : l = null)
        }, [
          (c(), f("svg", {
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
            (c(!0), f(K, null, ee(a.value.arrows, (I, q) => (c(), f("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: I.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, G1))), 128)),
            (c(!0), f(K, null, ee(a.value.nodes, (I) => (c(), f("g", {
              key: I.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: I.x,
                y: I.y,
                width: I.width,
                height: I.height,
                rx: "8"
              }, null, 8, K1),
              g("text", {
                x: I.x + I.width / 2,
                y: I.y + I.padY + I.line / 2
              }, [
                (c(!0), f(K, null, ee(I.lines, (q, X) => (c(), f("tspan", {
                  key: X,
                  x: I.x + I.width / 2,
                  dy: X ? I.line : 0
                }, b(q), 9, J1))), 128))
              ], 8, Y1)
            ]))), 128)),
            (c(!0), f(K, null, ee(a.value.arrows, (I, q) => (c(), f(K, {
              key: `label-${q}`
            }, [
              I.label ? (c(), f("g", Z1, [
                g("rect", {
                  x: I.label.x,
                  y: I.label.y,
                  width: I.label.width,
                  height: I.label.height,
                  rx: "4"
                }, null, 8, X1),
                g("text", {
                  x: I.label.x + I.label.width / 2,
                  y: I.label.y + I.label.pad + I.label.line / 2
                }, [
                  (c(!0), f(K, null, ee(I.label.lines, (X, _) => (c(), f("tspan", {
                    key: _,
                    x: I.label.x + I.label.width / 2,
                    dy: _ ? I.label.line : 0
                  }, b(X), 9, em))), 128))
                ], 8, Q1)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, V1))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, nm = /* @__PURE__ */ Y(tm, [["__scopeId", "data-v-51d24cfe"]]), ho = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', mo = {
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
  agent: ho,
  worker: ho,
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
}, sm = ["innerHTML"], am = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => mo[t.name] || mo.dot);
    return (s, a) => (c(), f("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, sm));
  }
}, at = /* @__PURE__ */ Y(am, [["__scopeId", "data-v-beb5935c"]]), om = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), f("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      B(at, { name: "fold" })
    ], 2));
  }
}, Pt = /* @__PURE__ */ Y(om, [["__scopeId", "data-v-d03899bb"]]), rm = ["data-tip", "aria-label"], im = {
  key: 0,
  class: "mact-word"
}, lm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), f("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      B(at, { name: "open" }),
      e.open ? (c(), f("span", im, b(e.label), 1)) : A("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, rm));
  }
}, ai = /* @__PURE__ */ Y(lm, [["__scopeId", "data-v-3b292e09"]]), oi = 120, Bn = 280, ri = 160, cm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, um = ["leaving", "resizing", "entering"];
function ta(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function dm(e) {
  const t = um.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = ta(e);
  return e.classList.add(...t), n;
}
function ii(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = T(t()), a = T("");
  let o = 0;
  const r = (h, p) => Object.assign(h.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (h) => Object.assign(h.style, { width: "", height: "", transition: "" });
  function l(h, p) {
    i(h);
    const y = dm(h);
    r(h, p), h.offsetWidth, h.style.transition = `width ${Bn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Bn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(h, y);
  }
  function u(h) {
    const p = h.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const w = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, l(h, ta(h)));
    });
    return w.observe(p), w;
  }
  async function d(h) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || cm()) {
      s.value = h;
      return;
    }
    const w = ta(p);
    if (r(p, w), a.value = "leaving", await n(oi), y !== o) return;
    s.value = h, a.value = "resizing", await pt(), l(p, w);
    const $ = u(p);
    await n(Bn), $ == null || $.disconnect(), y === o && (i(p), a.value = "entering", await n(ri), y === o && (a.value = ""));
  }
  return pe(t, (h) => d(h)), Ft(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const fm = { class: "growing-card-top" }, hm = ["aria-expanded"], mm = { class: "growing-card-avatar" }, pm = { class: "growing-card-title" }, gm = { class: "growing-card-more" }, vm = { class: "growing-card-body" }, ym = {
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
    const n = e, s = t, a = T(!1), o = T(null), { folded: r, phase: i } = ii(o, () => !a.value), l = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, h) => (c(), f("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(i), { open: !U(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", fm, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: h[0] || (h[0] = (p) => a.value = !a.value)
        }, [
          g("span", mm, [
            e.bad ? (c(), V(at, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), f(K, { key: 1 }, [
              se(b(l.value), 1)
            ], 64)) : (c(), V(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", pm, b(e.title), 1),
          B(Pt, { open: a.value }, null, 8, ["open"])
        ], 8, hm),
        e.action ? (c(), V(ai, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: h[1] || (h[1] = (p) => s("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (c(), f("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: h[2] || (h[2] = (p) => s("comment"))
        }, [
          B(ve, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      g("div", gm, [
        g("div", vm, [
          (c(!0), f(K, null, ee(u.value, (p, y) => (c(), f("p", {
            key: y,
            class: "growing-card-text"
          }, b(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, km = /* @__PURE__ */ Y(ym, [["__scopeId", "data-v-08411e3a"]]), wm = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, bm = {
  key: 0,
  class: "message-links-many"
}, xm = ["aria-expanded"], $m = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Mm = ["onClick"], Sm = { class: "row-pill message-links-chip" }, _m = { class: "message-links-title" }, ys = 3, po = "task", Em = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = _e(Ae, null), s = R(() => t.links.length), a = R(() => t.links.every((p) => p.model === po) ? "tasks" : "items"), o = R(() => `Linked: ${t.links.map((p) => `${p.model} ${p.id}`).join(" ")}`), r = T(!1), i = T({}), l = T(null);
    sr(l, () => r.value = !1);
    async function u() {
      const p = t.links.filter((w) => w.model === po && !(w.id in i.value)), y = await Promise.all(p.map((w) => n.read(`task show ${w.id}`)));
      i.value = { ...i.value, ...Object.fromEntries(y.filter((w) => w.ok).map((w) => [w.value.id, w.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function h(p) {
      r.value = !1, Fe(`${et(p.model)}:${p.id}`);
    }
    return (p, y) => (c(), f("div", {
      ref_key: "line",
      ref: l,
      class: J(["message-links", { many: s.value > ys, three: s.value === ys, open: r.value }]),
      "data-message-links": ""
    }, [
      B(at, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", wm, [
        B(dt, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      s.value >= ys ? (c(), f("span", bm, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          se(b(s.value) + " linked " + b(a.value) + " ", 1),
          B(Pt, { open: r.value }, null, 8, ["open"])
        ], 8, xm)
      ])) : A("", !0),
      r.value ? (c(), f("div", $m, [
        (c(!0), f(K, null, ee(e.links, (w) => (c(), f("button", {
          key: `${w.model}:${w.id}`,
          type: "button",
          class: "message-links-row",
          onClick: ($) => h(w)
        }, [
          g("span", Sm, b(w.model) + " " + b(w.id), 1),
          g("span", _m, b(i.value[w.id]), 1)
        ], 8, Mm))), 128))
      ])) : A("", !0)
    ], 2));
  }
}, Am = /* @__PURE__ */ Y(Em, [["__scopeId", "data-v-24868afd"]]), Cm = ["title", "aria-label"], Om = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Tm = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Im = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), f("span", {
      class: J(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), f("svg", Om, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), f("path", Tm)) : A("", !0)
      ]))
    ], 10, Cm));
  }
}, Rm = /* @__PURE__ */ Y(Im, [["__scopeId", "data-v-6dc92808"]]);
function Bm(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function li(e, t = Date.now()) {
  const n = Bm(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Lm = 36e5;
function M5(e, t, n, s = Date.now()) {
  const a = ((n ? Date.parse(n) : s) - Date.parse(t)) / Lm;
  return a > 0 && e ? Math.round(e / a) : 0;
}
function ci(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function go(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ks = (e) => String(e).padStart(2, "0");
function Nm(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ks(t % 60)}s` : `${Math.floor(t / 3600)}h ${ks(Math.floor(t % 3600 / 60))}m ${ks(t % 60)}s`;
}
const Dm = "img,pre,table";
function Pm(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function jm(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function qm(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Dm)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = e.offsetHeight, a = Pm(jm(e), n || 0);
  a && (a >= e.offsetWidth || (e.style.width = `${a}px`, e.offsetHeight !== s && (e.style.width = "")));
}
function Fm(e, t) {
  let n = null;
  const s = () => e.value && qm(e.value);
  Ne(() => {
    var o, r;
    if (s(), (o = document.fonts) == null || o.ready.then(s), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), pe(t, s, { flush: "post" });
}
const Wm = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Hm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Um = ["data-incoming", "data-ref"], zm = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Vm = { class: "message-body" }, Gm = ["title"], Km = ["innerHTML"], Ym = ["title"], Jm = ["innerHTML"], Zm = {
  class: "message-faces",
  "data-message-faces": ""
}, Xm = ["title", "data-face", "onClick"], Qm = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, ep = ["title", "data-reaction", "onClick"], tp = {
  key: 0,
  class: "message-reaction-count"
}, np = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, sp = ["href", "title"], ap = ["src", "alt"], op = ["href"], rp = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, ip = ["data-sent-worker", "title", "onClick"], lp = { class: "message-foot" }, cp = { class: "message-time" }, up = {
  class: "message-id",
  "data-message-id": ""
}, dp = 140, fp = 2, hp = 1500, mp = "An earlier message", pp = "about", gp = "sent_to", vp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var j;
    const n = e, s = t, a = T(!1), o = T(null), r = R(() => ["user", "comment"].includes(n.message.type)), i = R(() => {
      const [D, Z] = (n.message.commented_row || ":").split(":"), G = et(D);
      return G ? { ref: `${G}:${Z}`, label: `${Ht(G).title.toLowerCase()} ${Z}` } : null;
    }), l = R(() => n.message.worker_id ?? null), u = T(!1), d = R(() => l.value !== null && ((n.message.text ?? "").length > dp || (n.message.text ?? "").split(`
`).filter((D) => D.trim()).length > fp)), h = R(() => r.value && !n.message.read_at && !n.message.local);
    async function p() {
      var D;
      await ((D = navigator.clipboard) == null ? void 0 : D.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, hp);
    }
    const y = R(() => Xs(n.message.text ?? "", { env: "" })), w = R(() => JSON.parse(n.message.flowchart_edges || "[]")), $ = T(!1), S = R(() => Xs(n.quote || mp, { env: "" }));
    function I() {
      const D = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      D ? D.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    Fm(o, () => `${n.message.text} ${n.quote}`);
    const q = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, X = (D) => `/api/files/message/${n.message.id}/${encodeURIComponent(D)}`, _ = R(() => JSON.parse(n.message.captions || "{}")), k = R(() => (n.message.files ?? []).map((D) => ({ name: D, address: X(D), isImage: q.test(D), title: _.value[D] || D }))), E = R(() => ci(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), v = _e(Ae, null), O = T([]), x = T([]);
    async function C() {
      if (!r.value || !(v != null && v.read) || n.message.local) return;
      const D = await v.read(`link list --source message:${n.message.id}`);
      if (!D.ok) return;
      const Z = D.value.rows ?? D.value ?? [];
      O.value = Z.filter((G) => G.link_type === pp).map((G) => ({ model: G.target_model, id: G.target_id })), x.value = Z.filter((G) => G.link_type === gp).map((G) => G.target_id);
    }
    C(), (j = v == null ? void 0 : v.follow) == null || j.call(v, ["link.*"], C);
    const M = T(!1), m = R(() => Hm(n.message.reactions));
    function L(D) {
      M.value = !1, s("react", n.message, D);
    }
    return (D, Z) => e.message.peer || e.message.recipient ? (c(), f("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      B(km, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: Z[0] || (Z[0] = (G) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Um)) : (c(), f("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", Vm, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: J(["message-card", "md", { comment: i.value }]),
          onClick: Z[6] || (Z[6] = (...G) => U(Lt) && U(Lt)(...G))
        }, [
          i.value ? (c(), f("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: Z[1] || (Z[1] = be((G) => U(Fe)(i.value.ref), ["stop"]))
          }, [
            B(ve, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + b(i.value.label), 1)
          ], 8, Gm)) : A("", !0),
          e.message.parent_id ? (c(), f("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(I, ["stop"]),
            innerHTML: S.value
          }, null, 8, Km)) : A("", !0),
          l.value !== null ? (c(), f("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: Z[2] || (Z[2] = be((G) => U(Fe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + b(l.value), 9, Ym)) : A("", !0),
          g("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, Jm),
          d.value ? (c(), f("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: Z[3] || (Z[3] = be((G) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          w.value.length ? (c(), f(K, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: Z[4] || (Z[4] = (G) => $.value = !0)
            }, "Open the flowchart"),
            $.value ? (c(), V(nm, {
              key: 0,
              title: e.message.text,
              edges: w.value,
              onClose: Z[5] || (Z[5] = (G) => $.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        g("div", {
          class: J(["message-tools", { picking: M.value }]),
          "data-message-tools": ""
        }, [
          M.value ? (c(), f(K, { key: 0 }, [
            g("div", Zm, [
              (c(!0), f(K, null, ee(U(Wm), (G) => (c(), f("button", {
                key: G,
                type: "button",
                class: "message-face",
                title: `React ${G}`,
                "data-face": G,
                onClick: (ue) => L(G)
              }, b(G), 9, Xm))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Z[7] || (Z[7] = (G) => M.value = !1)
            }, [
              B(ve, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), f(K, { key: 1 }, [
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: Z[8] || (Z[8] = (G) => M.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: Z[9] || (Z[9] = (G) => s("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: p
            }, b(a.value ? "Copied" : "Copy"), 1),
            h.value ? (c(), f("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: Z[10] || (Z[10] = (G) => s("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      m.value.length ? (c(), f("div", Qm, [
        (c(!0), f(K, null, ee(m.value, (G) => (c(), f("button", {
          key: G.emoji,
          type: "button",
          class: J(["message-reaction", { mine: G.mine }]),
          title: G.title,
          "data-reaction": G.emoji,
          onClick: (ue) => s("react", e.message, G.emoji)
        }, [
          se(b(G.emoji) + " ", 1),
          G.count > 1 ? (c(), f("span", tp, b(G.count), 1)) : A("", !0)
        ], 10, ep))), 128))
      ])) : A("", !0),
      k.value.length ? (c(), f("div", np, [
        (c(!0), f(K, null, ee(k.value, (G) => (c(), f(K, {
          key: G.name
        }, [
          G.isImage ? (c(), f("a", {
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
            }, null, 8, ap)
          ], 8, sp)) : (c(), f("a", {
            key: 1,
            href: G.address,
            target: "_blank",
            class: "message-file"
          }, b(G.name), 9, op))
        ], 64))), 128))
      ])) : A("", !0),
      x.value.length ? (c(), f("div", rp, [
        B(ve, {
          name: "send",
          size: 12
        }),
        (c(!0), f(K, null, ee(x.value, (G) => (c(), f("button", {
          key: G,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": G,
          title: `Open worker ${G}`,
          onClick: be((ue) => U(Fe)(`agents:${G}`), ["stop"])
        }, "Also sent to worker " + b(G), 9, ip))), 128))
      ])) : A("", !0),
      g("div", lp, [
        g("time", cp, b(E.value), 1),
        Number.isInteger(e.message.id) ? (c(), f(K, { key: 0 }, [
          Z[11] || (Z[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", up, "message " + b(e.message.id), 1)
        ], 64)) : A("", !0),
        r.value ? (c(), V(Rm, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      O.value.length ? (c(), V(Am, {
        key: 3,
        links: O.value
      }, null, 8, ["links"])) : A("", !0)
    ], 8, zm));
  }
}, S5 = /* @__PURE__ */ Y(vp, [["__scopeId", "data-v-f1ee602a"]]), yp = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = hl("SkeletonParts", !0);
      return c(!0), f(K, null, ee(e.parts, (l, u) => (c(), f(K, { key: u }, [
        (c(!0), f(K, null, ee(l.count, (d) => (c(), V(Wt, {
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
              B(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: P(() => [
            g("div", {
              class: "skeleton-stack",
              style: me(s(l))
            }, [
              B(i, {
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
              B(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: P(() => [
            g("div", {
              class: "skeleton-grid",
              style: me(a(l))
            }, [
              B(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), kp = /* @__PURE__ */ Y(yp, [["__scopeId", "data-v-576c95e1"]]), wp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, bp = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), f("div", wp, [
      B(kp, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ui = /* @__PURE__ */ Y(bp, [["__scopeId", "data-v-52f66b64"]]), Wn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ws = 200, di = (e) => {
  var t;
  return ((t = Wn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Wn[0].key;
}, _5 = (e) => {
  var t;
  return ((t = Wn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, xp = ["aria-label"], $p = 300, vo = 400, Mp = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ws } },
  setup(e) {
    const t = e, n = R(() => di(t.value)), s = R(() => n.value < ws ? [1, 0.25, 0.25] : n.value === ws ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), f("svg", {
      class: J(["ico", "prio", { hot: n.value >= vo, high: n.value >= $p && n.value < vo }]),
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
    ], 10, xp));
  }
}, E5 = /* @__PURE__ */ Y(Mp, [["__scopeId", "data-v-b10e610f"]]), Sp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, yo = (e) => Sp[e.card.state] || "idle", _p = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), ko = { working: 0, waiting: 1, idle: 2, stopped: 3 }, wo = (e, t) => ko[yo(e)] - ko[yo(t)], bo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, A5 = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => wo(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || _p(s, a)) : [...e].sort((s, a) => wo(s, a) || (bo[t] || bo.state)(s, a)), Ep = { class: "list-row" }, Ap = {
  key: 0,
  class: "list-row-kind"
}, Cp = { class: "list-row-main" }, Op = {
  key: 0,
  class: "list-row-title"
}, Tp = { class: "list-row-body" }, Ip = {
  key: 1,
  class: "list-row-end"
}, Rp = {
  key: 1,
  class: "list-row-text"
}, Bp = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), f("div", Ep, [
      e.kind ? (c(), f("span", Ap, b(e.kind), 1)) : A("", !0),
      g("div", Cp, [
        e.title ? (c(), f("span", Op, b(e.title), 1)) : A("", !0),
        g("div", Tp, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), f("div", Ip, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), f("span", Rp, b(e.text), 1)) : A("", !0)
    ]));
  }
}, C5 = /* @__PURE__ */ Y(Bp, [["__scopeId", "data-v-63155fba"]]), Lp = {
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
}, Np = { claude: "Claude Code", codex: "Codex" }, Dp = ["aria-expanded"], Pp = { class: "drop-label" }, jp = ["value"], qp = {
  key: 1,
  class: "drop-lead"
}, Fp = { class: "drop-item-text" }, Wp = {
  key: 2,
  class: "drop-note"
}, Hp = {
  key: 1,
  class: "drop-none"
}, Up = {
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
    const n = e, s = t, a = T(!1), o = T(null), r = T(""), i = R(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function l(u) {
      a.value = !1, s("pick", u);
    }
    return (u, d) => (c(), f("div", {
      class: J(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: J(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (h) => a.value = !a.value)
      }, [
        e.icon ? (c(), V(ve, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        g("span", Pp, b(e.label), 1),
        B(ve, {
          name: "down",
          size: 11
        })
      ], 10, Dp),
      a.value ? (c(), V(Jn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (h) => a.value = !1)
      }, {
        default: P(() => [
          e.searchable ? (c(), f("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (h) => r.value = h.target.value)
          }, null, 40, jp)) : A("", !0),
          (c(!0), f(K, null, ee(i.value, (h) => (c(), V(Mt, {
            key: h.key,
            on: h.key === e.picked,
            "data-drop-item": h.key,
            onClick: (p) => l(h)
          }, {
            default: P(() => [
              h.running !== void 0 ? (c(), f("span", {
                key: 0,
                class: J(["drop-dot", { live: h.running }])
              }, null, 2)) : A("", !0),
              h.lead ? (c(), f("span", qp, b(h.lead), 1)) : A("", !0),
              g("span", Fp, b(h.label), 1),
              h.note ? (c(), f("span", Wp, b(h.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? A("", !0) : (c(), f("p", Hp, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, zp = /* @__PURE__ */ Y(Up, [["__scopeId", "data-v-29dfcce5"]]), O5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => [
      ...Lp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, i) => (c(), V(zp, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(Np)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Vp = ["aria-label"], Gp = { class: "head" }, Kp = { class: "names" }, Yp = { class: "body" }, Jp = {
  key: 0,
  class: "foot"
}, Zp = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = gr(s, n), i = vr(a);
    return (l, u) => (c(), V(pa, { to: "body" }, [
      B(qt, {
        name: "side",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: P(() => [
          U(a) ? (c(), f("div", {
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
              e.title ? (c(), f(K, { key: 0 }, [
                g("header", Gp, [
                  g("div", Kp, [
                    g("h2", null, b(e.title), 1),
                    e.abstract ? (c(), V(dt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ce(l.$slots, "actions", {}, void 0, !0),
                  B(Qn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", Yp, [
                  ce(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), f("footer", Jp, [
                  ce(l.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : ce(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, Vp)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, T5 = /* @__PURE__ */ Y(Zp, [["__scopeId", "data-v-c9a3f43a"]]), Xp = {
  key: 1,
  class: "text-field-label"
}, Qp = {
  key: 2,
  class: "text-field-end"
}, eg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Fs({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = qs(e, "modelValue"), s = Yn(), a = "onUpdate:modelValue" in (((d = ml()) == null ? void 0 : d.vnode.props) || {}), o = R(() => a ? n.value : s.value), r = (h) => a && (n.value = h.target.value), i = R(
      () => Object.fromEntries(Object.entries(s).filter(([h]) => h !== "class" && h !== "style" && h !== "value"))
    ), l = R(() => Object.fromEntries(Object.entries(s).filter(([h]) => h !== "value"))), u = T(null);
    return t({ focus: () => u.value && u.value.focus() }), (h, p) => e.label || e.icon || h.$slots.end ? (c(), f("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: h.$slots.end }, U(s).class]),
      style: me(U(s).style)
    }, [
      e.icon ? (c(), V(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), f("span", Xp, b(e.label), 1)) : A("", !0),
      st(g("input", nt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [U(Vs), o.value]
      ]),
      h.$slots.end ? (c(), f("span", Qp, [
        ce(h.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : st((c(), f("input", nt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [U(Vs), o.value]
    ]);
  }
}), I5 = /* @__PURE__ */ Y(eg, [["__scopeId", "data-v-d9c38ca8"]]), xo = (e) => e.page * e.size < e.total;
function R5(e) {
  const t = At().sources.find((n) => n.key === e);
  return t ? na(t.read, t.events) : na("", []);
}
function na(e, t, { incremental: n = !1 } = {}) {
  const s = At(), a = T([]), o = T(null), r = T(""), i = T(!1), l = performance.now(), u = T(!1), d = T(""), h = T(null);
  async function p(_) {
    const k = $, E = await s.read(`${e} --before-id ${_ + 1} --limit 1`);
    if (k !== $) return;
    if (!E.ok) return I();
    const v = E.value.rows.find((O) => O.id === _);
    a.value = v ? a.value.map((O) => O.id === _ ? v : O) : a.value.filter((O) => O.id !== _);
  }
  async function y(_) {
    if (n && String((_ == null ? void 0 : _.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((C) => C.id !== _.row_id));
    if (n && (_ != null && _.row_id) && !String(_.event ?? "").endsWith(".create") && a.value.some((C) => C.id === _.row_id)) return p(_.row_id);
    if (!(n && a.value.length && String((_ == null ? void 0 : _.event) ?? "").endsWith(".create"))) return I();
    const E = Math.max(...a.value.map((C) => C.id)), v = $, O = await s.read(`${e} --after-id ${E}`);
    if (v !== $) return;
    if (!O.ok) return I();
    const x = new Set(a.value.map((C) => C.id));
    a.value = [...O.value.rows.filter((C) => !x.has(C.id)), ...a.value];
  }
  async function w() {
    if (!a.value.length) return !1;
    const _ = $, k = Math.min(...a.value.map((O) => O.id)), E = await s.read(`${e} --before-id ${k}`);
    if (_ !== $) return !1;
    if (!E.ok || !E.value.rows.length) return u.value = !1;
    u.value = xo(E.value);
    const v = new Set(a.value.map((O) => O.id));
    return a.value = [...a.value, ...E.value.rows.filter((O) => !v.has(O.id))], !0;
  }
  let $ = 0;
  async function S(_) {
    const k = ++$, E = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== $) return;
    const v = E.ok ? s.shared ? [E.value] : E.value.rows : [];
    a.value = _(v), o.value = E.ok ? E.value : null;
    const O = v.length ? Math.min(...v.map((x) => x.id)) : 0;
    E.ok && !a.value.some((x) => x.id < O) && (u.value = !s.shared && xo(E.value)), r.value = E.ok ? "" : E.error, ka(l, () => i.value = !0);
  }
  function I() {
    return S((_) => {
      if (!n || !_.length) return _;
      const k = Math.min(..._.map((v) => v.id)), E = Math.max(..._.map((v) => v.id));
      return [...a.value.filter((v) => v.id > E), ..._, ...a.value.filter((v) => v.id < k)];
    });
  }
  const q = () => S((_) => _);
  async function X(_, k = null) {
    const E = a.value;
    k && (a.value = k(E));
    const v = await s.run(_);
    return k && !v.ok && (a.value = E), d.value = v.ok ? "" : v.error, h.value = v.ok ? v.value : null, await I(), v;
  }
  return e && (s.follow(t, y), I()), { rows: a, listing: o, failure: r, loaded: i, more: u, load: I, loadLatest: q, older: w, act: X, actionFailure: d, answer: h, context: s };
}
const tg = { class: "title" }, ng = { class: "state" }, sg = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = na(t.line, t.events);
    return (o, r) => (c(), V(od, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        g("span", tg, b(i.title), 1),
        g("span", ng, b(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, B5 = /* @__PURE__ */ Y(sg, [["__scopeId", "data-v-a69084cd"]]);
function ag(e = 1e3, t = null) {
  const n = T(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, a, { immediate: !0 }) : a(!0), Te(() => clearInterval(s)), n;
}
const bs = T(Date.now() / 1e3);
let $o = 0, En = 0;
function fi() {
  return En || (bs.value = Date.now() / 1e3, $o = setInterval(() => bs.value = Date.now() / 1e3, 1e3)), En += 1, Qo() && er(() => {
    En -= 1, En || clearInterval($o);
  }), bs;
}
const og = 200, rg = oi + Bn + ri + og;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: s, height: a } = e.getBoundingClientRect();
  return { x: t, y: n, width: s, height: a, opacity: getComputedStyle(e).opacity };
}
function ig(e, t, n) {
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
function lg(e, t, n, s) {
  pe(t, (a) => {
    var u;
    const o = e.value;
    if (!o || !(s != null && s.run) || !((u = s.markMotion) != null && u.value)) return;
    const r = performance.now(), i = [];
    function l() {
      if (s.markMotion.value) {
        if (i.push(ig(o, r, n.value)), performance.now() - r < rg) return void requestAnimationFrame(l);
        s.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: a, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    l();
  }, { flush: "sync" });
}
const cg = ["title", "data-figure-mark", "data-folded", "data-open"], ug = {
  key: 2,
  class: "worker"
}, dg = { class: "head" }, fg = { key: 0 }, hg = {
  key: 3,
  class: "status"
}, mg = {
  key: 0,
  class: "figure"
}, pg = {
  key: 1,
  class: "ran-for"
}, gg = { key: 2 }, vg = {
  key: 3,
  class: "news"
}, yg = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, kg = {
  key: 6,
  class: "settled"
}, wg = {
  key: 1,
  class: "bar"
}, bg = {
  key: 3,
  class: "detail body"
}, xg = {
  key: 0,
  class: "body-label"
}, $g = ["title"], Mg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Yn(), s = ["onClick", "onAct"], a = R(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = T(!1), r = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = R(() => t.open !== void 0), l = R(() => i.value || r.value), u = R(() => i.value ? t.open : o.value), d = R(() => i.value ? !t.open : r.value && !o.value), h = R(() => !!(t.mark.action && n.onAct)), p = R(() => l.value || h.value || !!n.onClick), y = T(null), w = T(null), { folded: $, phase: S } = ii(y, () => d.value);
    lg(y, d, S, _e(Ae, null));
    function I(le) {
      var ke, Re;
      if (!(le.target !== y.value && !w.value.contains(le.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Re = n.onAct || n.onClick) == null || Re(le);
      }
    }
    const q = (le) => n.onAct(le), X = ["failed", "unfinished"], _ = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? X.includes(t.mark.state) ? "danger" : "good" : ""), k = R(() => t.mark.color ? t.mark.color : _.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : _.value ? `var(--tone-${_.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), E = R(() => k.value || "var(--tone-work)"), v = R(() => !t.mark.ending && !t.mark.ended && _.value !== "stopped"), O = fi(), x = R(
      () => t.mark.began_at && v.value && !t.mark.figure && !t.mark.counting ? Nm(O.value - t.mark.began_at) : ""
    ), C = R(() => {
      const { started: le, ended: ke } = t.mark;
      return le ? ke ? `ran ${go(ke - le, !0)}` : go(O.value - le, !0) : x.value;
    }), M = ["bad", "danger", "warn"], m = R(() => M.includes(_.value) || t.mark.asks ? "attention" : v.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), L = ["bad", "danger"], j = R(() => L.includes(_.value)), D = R(() => m.value === "process" ? "running" : j.value ? "cross" : _.value === "stopped" ? "stopped" : _.value === "good" ? "tick" : ""), Z = R(
      () => !!(t.mark.figure || C.value || t.mark.docked || t.mark.stopping || D.value || t.mark.settled || t.mark.news)
    ), G = R(() => [t.mark.title, t.mark.time ? ci(t.mark.time) : ""].filter(Boolean).join(" · ")), ue = R(() => ({
      ...k.value ? { "--mark": k.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ke) => (c(), f("div", nt(a.value, {
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
          tinted: k.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ue.value,
      title: G.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U($) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: I
    }), [
      (c(), V(_t(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: w,
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
          e.mark.worker ? (c(), f("span", ug, b(e.mark.worker), 1)) : A("", !0),
          g("span", dg, [
            B(dt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), f("strong", fg, b(e.mark.name), 1)) : A("", !0),
            l.value ? (c(), V(Pt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          Z.value ? (c(), f("span", hg, [
            e.mark.figure ? (c(), f("span", mg, b(e.mark.figure), 1)) : A("", !0),
            C.value ? (c(), f("span", pg, b(C.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), f("span", gg, "Stopping")) : A("", !0),
            e.mark.news ? (c(), f("span", vg, b(e.mark.news), 1)) : A("", !0),
            D.value === "running" ? (c(), f("span", yg)) : D.value ? (c(), V(at, {
              key: 5,
              class: J(["sign", D.value]),
              name: D.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), f("span", kg, b(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      h.value ? (c(), V(ai, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(q, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && v.value ? (c(), f("span", wg, [
        g("span", {
          class: "progress",
          style: me({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: E.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !U($) ? (c(), V(dt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !U($) ? (c(), f("div", bg, [
        e.mark.bodyLabel ? (c(), f("p", xg, b(e.mark.bodyLabel), 1)) : A("", !0),
        B(dt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !U($) ? (c(), f("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, $g)) : A("", !0),
      e.mark.card ? (c(), V(dt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ce(le.$slots, "default", {
        shown: !U($)
      }, void 0, !0)
    ], 16, cg));
  }
}), hi = /* @__PURE__ */ Y(Mg, [["__scopeId", "data-v-2aa9c496"]]), Sg = 60;
function _g(e, t) {
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
    if (r || s.value <= 0 || d.scrollTop > Sg) return;
    r = !0;
    const h = d.scrollHeight, p = await e(["output", "page", String(t()), "--before", String(s.value)]);
    r = !1, p.ok && (n.value = [...p.value.lines, ...n.value], s.value = p.value.first_byte, await pt(), d.scrollTop += d.scrollHeight - h);
  }
  return { lines: n, newest: i, follow: l, loadEarlier: u };
}
const Eg = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function mi(e) {
  var n;
  const t = Eg[e] || ((n = Ht(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ag = (e) => mi(String(e).split(":")[0]), pi = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Cg = { passed: "good", failed: "danger", warned: "warn", running: "" }, Og = { good: "good", warn: "warn", danger: "danger" }, Mo = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Xu(e.target_model, e.target_id || 0)
}, Tg = { "open row": (e) => Ag(e.target_model), "open page": () => mi("pages") };
function Ig(e, t) {
  const n = t || {}, s = Mo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Cg[e.outcome] || "" : Og[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Tg[s](e) : "",
    handlers: s ? { onAct: () => Mo[s](e) } : {}
  };
}
const Rg = 24, Bg = 1e3, So = 2e3, Lg = 0.25, Ng = 5e3;
function Dg(e, t = Rg, n = () => !0) {
  const s = T(!1), a = T(0), o = T(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const _ = u();
    return _ ? _.scrollHeight - _.scrollTop - _.clientHeight : 0;
  }, h = () => !u() || d() <= t;
  function p(_) {
    if (clearTimeout(r), !_) {
      o.value = !1, l = Date.now();
      return;
    }
    const k = Date.now() - l < So ? So : Bg;
    r = setTimeout(() => o.value = s.value, k);
  }
  function y() {
    clearTimeout(i), s.value = !1, a.value = 0, p(!1);
  }
  function w(_ = !1) {
    const k = u();
    k && _ && k.scrollTo ? k.scrollTo({ top: k.scrollHeight, behavior: "smooth" }) : k && (k.scrollTop = k.scrollHeight), y();
  }
  function $() {
    I(), !s.value && (s.value = !0, p(!0));
  }
  const S = () => !!u() && d() <= u().clientHeight * Lg;
  function I() {
    clearTimeout(i), S() && (i = setTimeout(() => s.value && S() && n() && w(!0), Ng));
  }
  function q() {
    h() ? y() : $();
  }
  function X(_ = 1, k = !1) {
    s.value ? a.value += Math.max(0, _) : w(k);
  }
  return Qo() && er(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: h, follow: y, toBottom: w, left: $, scrolled: q, arrived: X };
}
const Pg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, jg = (e) => String(e ?? "").replace(Pg, ""), qg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Dg(a);
    pe(
      () => n.lines.length,
      () => pt(() => i()),
      { immediate: !0 }
    );
    function u(d) {
      r(), s("older", d.target);
    }
    return (d, h) => (c(), f("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: u
    }, [
      se(b(U(jg)(e.lines.join(`
`)) || e.empty), 1),
      U(o) ? (c(), f("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: h[0] || (h[0] = (p) => U(l)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, Fg = /* @__PURE__ */ Y(qg, [["__scopeId", "data-v-c2fb1783"]]), Wg = 1e4;
class Hg {
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
    return this.heardAt !== null && t - this.heardAt > Wg;
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
const Ug = {
  key: 0,
  class: "frame-note"
}, zg = {
  key: 0,
  class: "frame-note"
}, Vg = ["src", "title"], Gg = 1e3, Kg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = At(), s = T(null), a = T(!1), o = T(!1);
    let r = null, i = 0;
    return Ne(() => {
      r = new Hg(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Gg);
    }), Te(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), f("p", Ug, "This window was closed because it stopped answering.")) : (c(), f(K, { key: 1 }, [
      a.value ? (c(), f("div", zg, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        B(he, {
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
      }, null, 8, Vg)
    ], 64));
  }
}, Yg = /* @__PURE__ */ Y(Kg, [["__scopeId", "data-v-32a49046"]]);
function Jg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Zg = {
  class: "allowance-prompt",
  role: "dialog"
}, Xg = { class: "allowance-prompt-text" }, Qg = { class: "allowance-prompt-buttons" }, e0 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), f("div", Zg, [
      g("p", Xg, b(U(Jg)(e.request)), 1),
      g("div", Qg, [
        B(he, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: P(() => [...a[2] || (a[2] = [
            se("Allow", -1)
          ])]),
          _: 1
        }),
        B(he, {
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
}, t0 = /* @__PURE__ */ Y(e0, [["__scopeId", "data-v-102dc765"]]), xs = {
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
}, n0 = ["data-window", "data-agent"], s0 = {
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
    const i = _e(Fl, null), l = Kc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: _e(Wc, null),
      setOption: (h, p) => s("option", h, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (h, p) => {
        s("open", h, p), i == null || i(h, p);
      }
    });
    pl(Ae, l), pe(() => n.visible, (h) => h && n.subscriptions.shown(n.name)), Ne(l.settle), Te(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), gl((h) => (a.value = h instanceof Error ? h.message : String(h), n.subscriptions.stopAll(n.name), !1));
    const u = () => ma(n.component), d = () => {
      var h, p;
      return ((p = (h = n.prompts) == null ? void 0 : h.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (h, p) => (c(), f("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), V(t0, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), V(xs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), V(xs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), f(K, { key: 4 }, [
        (c(), V(u, { key: o.value })),
        e.skeleton.length && !U(l).answered.value ? (c(), V(ui, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), V(xs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, n0));
  }
}, gi = /* @__PURE__ */ Y(s0, [["__scopeId", "data-v-c4443e2b"]]), a0 = {
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
    const n = e, s = t, a = { render: () => ma(Yg, { src: n.entry.entry_url }) };
    return (o, r) => (c(), V(gi, {
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
}, o0 = ["data-window"], r0 = {
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
            )).default, fc();
          } catch (i) {
            if (uc(i) && dc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), f("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      B(ui, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, o0)) : (c(), V(gi, {
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
}, _o = "*.*", i0 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null }, environment: { type: String, default: "" } },
  setup(e) {
    var u;
    const t = e, n = _e(Ae, null), s = new Nc(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [_o], (d) => s.dispatch(d));
    Te(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? t.environment, r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = R(() => !!(t.declaration.shipped || t.declaration.trusted)), l = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [_o] : t.declaration.events ?? [],
      options: []
    }));
    return (d, h) => i.value ? (c(), V(r0, {
      key: 0,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), V(a0, {
      key: 1,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, l0 = { class: "mark-more-inner" }, c0 = {
  class: "mark-lines",
  "data-mark-reason": ""
}, u0 = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, d0 = {
  key: 3,
  class: "mark-lines"
}, f0 = "process", Eo = "task", h0 = 2e3, m0 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ae), s = R(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = R(() => pi.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === Eo ? t.mark.target_id : 0), r = _g((w) => n.run(w), () => t.mark.target_id), i = r.lines, l = T(!1), u = T(""), d = R(() => t.mark.target_model === f0 && !!t.mark.target_id);
    async function h(w = r.follow) {
      const $ = await w();
      l.value = !0, u.value = $.ok ? "" : $.error;
    }
    let p = null;
    const y = () => clearInterval(p);
    return pe(() => t.shown && d.value, (w) => {
      y(), w && (h(), t.mark.ended_at || (p = setInterval(h, h0)));
    }, { immediate: !0 }), pe(() => t.mark.ended_at, (w) => w && t.shown && d.value && (y(), h(r.newest))), Te(y), (w, $) => (c(), f("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: $[1] || ($[1] = be(() => {
      }, ["stop"]))
    }, [
      g("div", l0, [
        e.declaration.body_url ? (c(), V(i0, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), f(K, { key: 1 }, [
          a.value ? (c(), f(K, { key: 0 }, [
            $[2] || ($[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", c0, b(a.value), 1)
          ], 64)) : A("", !0),
          d.value && u.value ? (c(), f("p", u0, b(u.value), 1)) : d.value && l.value ? (c(), f(K, { key: 2 }, [
            $[3] || ($[3] = g("p", { class: "mark-label" }, "Output", -1)),
            B(Fg, {
              class: "mark-terminal",
              lines: U(i),
              onOlder: U(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : s.value.length ? (c(), f("p", d0, b(s.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), f("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: $[0] || ($[0] = be((S) => U(Fe)(`${Eo}:${o.value}`), ["stop"]))
          }, "Open task " + b(o.value) + " and its proofs", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, sa = /* @__PURE__ */ Y(m0, [["__scopeId", "data-v-3be263ac"]]), p0 = ["title", "aria-label", "onClick"], g0 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, v0 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => Su(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = T(""), a = _e(Ae);
    async function o(r) {
      const i = await fn(r, { id: t.mark.target_id }, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), f(K, null, [
      (c(!0), f(K, null, ee(n.value, (l) => (c(), f("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: be((u) => o(l), ["stop"])
      }, [
        B(at, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, p0))), 128)),
      s.value ? (c(), f("span", g0, b(s.value), 1)) : A("", !0)
    ], 64));
  }
}, y0 = /* @__PURE__ */ Y(v0, [["__scopeId", "data-v-7a62c88e"]]);
function vi(e, t) {
  const n = ut(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Le.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const yi = vi("/api/marks", "marks"), L5 = yi.fetchAll, k0 = yi.find, w0 = 2e3;
function ki(e, t, n = w0) {
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
  }), Ft(() => clearTimeout(s));
}
const b0 = ["data-ref"], x0 = ["data-ref"], $0 = { class: "mark-row" }, M0 = "dock add", S0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = R(() => k0(s.mark.type)), o = _e(Ae, null), r = R(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = T(null);
    ki(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      y.ok && y.value.rows.length && (i.value = y.value.rows[0].progress);
    }, () => r.value);
    const l = R(() => {
      const y = Ig(s.mark, a.value), w = !y.figure || y.figure.endsWith("%");
      return i.value && r.value && w ? { ...y, figure: `${i.value}%`, fraction: i.value / 100 } : y;
    }), u = R(() => {
      var y;
      return !!(s.mark.lines || s.mark.detail && pi.has(s.mark.variant) || t.has(s.mark.target_model) || (y = a.value) != null && y.body_url);
    }), d = T(!1);
    function h(y) {
      if (l.value.handlers.onAct && !y.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const p = R(() => {
      var y;
      return (((y = a.value) == null ? void 0 : y.buttons) || []).filter((w) => {
        var $;
        return !s.docked || !(($ = w.runs) != null && $.startsWith(M0));
      }).map((w) => ({ ...w, module: a.value.module }));
    });
    return (y, w) => {
      var $, S;
      return ($ = a.value) != null && $.card ? (c(), f("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        B(sa, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, b0)) : (c(), f("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (S = a.value) == null ? void 0 : S.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", $0, [
          B(hi, nt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, vl(l.value.handlers), { onClick: h }), yl({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: P(({ shown: I }) => [
                B(sa, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: I
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          B(y0, {
            buttons: p.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, x0));
    };
  }
}, _0 = /* @__PURE__ */ Y(S0, [["__scopeId", "data-v-073b7a24"]]), E0 = ["data-ref"], A0 = ["inert"], C0 = { class: "group-fold" }, O0 = { class: "thread-group" }, T0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = T(!1), s = T(!1), a = T(!1), o = T(null);
    pe(n, async (i) => {
      var l;
      s.value = !0, await pt(), (l = o.value) == null || l.offsetHeight, a.value = i;
    });
    const r = R(() => ({
      key: t.group.id,
      icon: t.group.declaration.family_icon || "",
      markIcon: t.group.declaration.mark_icon || "",
      group: t.group.declaration.group || "",
      label: t.group.label,
      time: t.group.time,
      title: n.value ? "Fold them back into one line" : "Show each of them"
    }));
    return (i, l) => (c(), f("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      B(hi, {
        mark: r.value,
        open: n.value,
        onClick: l[0] || (l[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), f("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: J(["group-rows", { open: a.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", C0, [
          g("div", O0, [
            (c(!0), f(K, null, ee(e.group.marks, (u) => (c(), V(_0, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, A0)) : A("", !0)
    ], 8, E0));
  }
}, N5 = /* @__PURE__ */ Y(T0, [["__scopeId", "data-v-45b58b9b"]]);
function I0(e) {
  const t = T(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ne(() => n.observe(e.value)), Ft(() => n.disconnect()), t;
}
const R0 = { class: "chat-dock-fold" }, B0 = ["aria-label"], L0 = { class: "chat-dock-head" }, N0 = { class: "chat-dock-inner" }, wi = 700, D0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = T(null), s = T(null), a = I0(s), o = T(!1);
    let r = 0;
    return Ne(() => r = setTimeout(() => o.value = !0, wi)), Ft(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), f("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", R0, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          ce(i.$slots, "edge"),
          g("header", L0, [
            ce(i.$slots, "head")
          ]),
          g("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            g("div", N0, [
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
        ], 10, B0)
      ])
    ], 2));
  }
}, bi = /* @__PURE__ */ Y(D0, [["__scopeId", "data-v-512883e2"]]), P0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, $s = 5, j0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min($s, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${$s}s`, animationDelay: `${(n - $s).toFixed(2)}s` };
    return (a, o) => (c(), f("span", P0, [
      g("i", { style: s })
    ]));
  }
}, xi = /* @__PURE__ */ Y(j0, [["__scopeId", "data-v-d0c4b012"]]), q0 = { processes: "process", memories: "memory", replies: "reply" }, Ao = (e) => (q0[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, F0 = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, W0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, H0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], U0 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], z0 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], V0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], G0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function K0(e, t) {
  const n = { plan: F0, task: W0 }[e], s = t != null && t.state ? Fc(e, t.state) : null;
  return s ? ((n == null ? void 0 : n[dr(e, t.state)]) ?? []).filter((a) => s.includes(a.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const Y0 = (e, t) => e === "doc" || e === "report" ? G0(t) : e === "agent" ? [...z0(t), ...U0(t)] : e === "check" ? V0(t) : e === "question" ? H0(t) : K0(e, t), $i = vi("/api/docks", "docks"), D5 = $i.fetchAll, aa = $i.find, J0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), oa = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Z0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), X0 = (e) => e.kept ? oa("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : oa("keep", "pin", "Pin", `dock keep ${e.id}`), Q0 = ["pin", "stop"], ev = (e) => ({ ...e, iconOnly: Q0.includes(e.icon) });
function tv(e, t) {
  var n;
  return [
    ...Z0(e, t) ? [X0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Ht(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    oa("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(ev);
}
const nv = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: J0(e, t),
  buttons: tv(e, t)
}), sv = { class: "dock-title" }, av = {
  key: 3,
  class: "dock-age",
  "data-dock-age": ""
}, ov = ["aria-expanded", "title"], rv = { class: "chat-dock-acts dock-acts" }, iv = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, lv = {
  key: 1,
  class: "dock-text"
}, cv = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = R(() => aa(s.item.type)), o = fi(), r = R(() => {
      var q;
      return (q = a.value) != null && q.shows_age ? li(s.item.created_at, o.value * 1e3) : "";
    }), i = T(null), l = R(() => nv(s.item, a.value)), u = _e(Ae), d = T(null);
    let h = 0;
    async function p() {
      var E, v;
      const q = ++h, X = Ao(s.item.target_model ?? ""), _ = `${X} show`;
      if (!((v = (E = a.value) == null ? void 0 : E.reads) != null && v.includes(_))) return;
      const k = await $t(s.item.type, [X, "show", String(s.item.target_id)], u.environment);
      q === h && (d.value = k.ok ? { ...k.value, id: s.item.target_id, kind: X } : { id: s.item.target_id, kind: X });
    }
    pe(() => [s.item.type, s.item.target_model, s.item.target_id, a.value], (q, X, _) => {
      var v;
      const k = Ao(s.item.target_model ?? "");
      d.value = { id: s.item.target_id, kind: k }, p();
      const E = (v = u.subscriptions) == null ? void 0 : v.follow(`dock ${s.item.id}`, [`${k.replaceAll("-", "_")}.*`], (O) => {
        (!O.row_id || O.row_id === s.item.target_id) && p();
      });
      _(() => {
        h += 1, E == null || E();
      });
    }, { immediate: !0 });
    const y = T(/* @__PURE__ */ new Set()), w = T("");
    async function $(q) {
      if (q.action === "open") return Fe(`${s.item.target_model}:${s.item.target_id}`);
      q.action === "declared" && (y.value = /* @__PURE__ */ new Set([...y.value, q.label])), w.value = "";
      const _ = await fn(q, { id: s.item.target_id }, u.environment);
      (_ == null ? void 0 : _.ok) === !1 && (y.value = new Set([...y.value].filter((k) => k !== q.label)), w.value = _.error);
    }
    const S = R(() => l.value.buttons.filter((q) => q.action !== "undock" && !y.value.has(q.label))), I = R(() => l.value.buttons.find((q) => q.action === "undock"));
    return (q, X) => (c(), V(bi, {
      label: l.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: P(() => [
        e.leaving ? (c(), V(xi, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0)
      ]),
      head: P(() => {
        var _, k, E;
        return [
          (_ = a.value) != null && _.draws_head ? (c(), f("span", {
            key: 0,
            ref_key: "head",
            ref: i,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), f(K, { key: 1 }, [
            B(ve, {
              name: l.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            g("span", sv, b(l.value.title), 1)
          ], 64)),
          (k = a.value) != null && k.badge ? (c(), f("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, b(a.value.badge), 3)) : A("", !0),
          r.value ? (c(), f("span", av, b(r.value), 1)) : A("", !0),
          (E = a.value) != null && E.draws_head ? A("", !0) : (c(), f("button", {
            key: 4,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: X[0] || (X[0] = (v) => n("fold"))
          }, [
            B(Pt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, ov)),
          g("span", rv, [
            B(ju, {
              name: `dock.${e.item.type}`,
              row: d.value,
              environment: U(u).environment,
              "read-only": U(u).readOnly,
              onDone: p
            }, null, 8, ["name", "row", "environment", "read-only"]),
            (c(!0), f(K, null, ee(S.value, (v) => (c(), f(K, {
              key: v.action + v.runs
            }, [
              v.iconOnly ? (c(), V(he, {
                key: 0,
                kind: "icon",
                "aria-label": v.label,
                title: v.label,
                "data-dock-action": v.action,
                onClick: (O) => $(v)
              }, {
                default: P(() => [
                  B(ve, {
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
                onClick: (O) => $(v)
              }, {
                default: P(() => [
                  se(b(v.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          B(Qn, {
            title: I.value.label,
            "data-dock-action": "undock",
            onClick: X[1] || (X[1] = (v) => n("undock", I.value))
          }, null, 8, ["title"])
        ];
      }),
      default: P(() => {
        var _, k, E;
        return [
          w.value || e.refusal ? (c(), f("p", iv, b(w.value || e.refusal), 1)) : A("", !0),
          e.item.text && !((_ = a.value) != null && _.body_url) && !((k = a.value) != null && k.shows_age) ? (c(), f("p", lv, b(e.item.text), 1)) : A("", !0),
          (E = a.value) != null && E.body_url ? (c(), V(sa, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: i.value
          }, null, 8, ["declaration", "mark", "head"])) : A("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, Co = /* @__PURE__ */ Y(cv, [["__scopeId", "data-v-93afd70d"]]), uv = 6, dv = 3, Oo = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, bt = (e) => !!(e.leaves_at && !e.kept), fv = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!bt(e) || t < e.leaves_at || n.has(e.id)), hv = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => fv(s, t, n)).sort((s, a) => s.id - a.id);
function mv(e, t, n = uv) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const pv = (e, t, n = e) => n < 2 ? !1 : e >= dv ? !0 : t, gv = ["title", "aria-label"], vv = { class: "run-chip-in" }, yv = {
  key: 0,
  class: "run-chip-ring"
}, kv = { class: "run-chip-name" }, wv = { class: "run-chip-bar" }, bv = "processes.output", xv = 5e3, $v = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = _e(Ae, null)) == null ? void 0 : d.environment) ?? "", o = T(null), r = R(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = R(() => {
      var h, p;
      return ((h = o.value) == null ? void 0 : h.title) || ((p = o.value) == null ? void 0 : p.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = R(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const h = await $t(bv, ["process", "card", String(s.item.target_id)], a);
      h.ok && (o.value = h.value);
    }
    return ki(u, () => r.value, xv), (h, p) => {
      var y;
      return c(), f("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: me({ "--tone": l.value })
      }, [
        U(bt)(e.item) ? (c(), V(xi, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0),
        g("span", vv, [
          r.value ? (c(), f("span", yv)) : (c(), V(at, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", kv, b(i.value), 1)
        ]),
        g("span", wv, [
          g("i", {
            style: me({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, gv);
    };
  }
}, Mv = /* @__PURE__ */ Y($v, [["__scopeId", "data-v-597b05d2"]]), Sv = 24, _v = 8, P5 = 420;
function j5({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= Sv && e > t ? !0 : e < t && a > _v ? !1 : null;
}
const Ev = (e, t) => e === void 0 ? t : e, Mi = "journal.viewer.";
function Av(e, t, n) {
  try {
    const s = n.getItem(Mi + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function Cv(e, t, n) {
  try {
    n.setItem(Mi + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Ov(e, t, n = window.localStorage) {
  const s = T(Av(e, t, n));
  return pe(s, (a) => Cv(e, a, n), { deep: !0 }), s;
}
const Tv = {
  key: "runs-head",
  class: "dock-runs-head"
}, Iv = { class: "dock-runs-chips" }, Rv = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var E;
    const t = e, n = ag(500), s = T(/* @__PURE__ */ new Set()), a = T(!1), o = T(!1), r = _e(Ae), i = T(/* @__PURE__ */ new Set()), l = T({});
    async function u(v, O) {
      i.value = /* @__PURE__ */ new Set([...i.value, v.id]);
      const x = await fn(O, { id: v.target_id }, r.environment);
      (x == null ? void 0 : x.ok) === !1 && (i.value = new Set([...i.value].filter((C) => C !== v.id)), l.value = { ...l.value, [v.id]: x.error });
    }
    const d = R(() => hv(t.items.filter((v) => !i.value.has(v.id)), n.value, s.value)), h = R(() => mv(d.value.filter((v) => Oo(v, aa)), n.value)), p = R(() => d.value.filter((v) => !h.value.includes(v) && !Oo(v, aa))), y = R(() => h.value.filter((v) => !bt(v))), w = R(() => (a.value = pv(h.value.length, a.value, y.value.length)) && !o.value), $ = Ov(`dock-folded:${((E = ie.identity) == null ? void 0 : E.root) || location.host}`, {}), S = (v) => Ev($.value[v.id], t.folded);
    function I(v) {
      $.value = { ...$.value, [v.id]: !S(v) };
    }
    function q(v) {
      $.value = { ...$.value, ...Object.fromEntries(h.value.map((O) => [O.id, O.id !== v.id])) }, o.value = !0;
    }
    function X() {
      $.value = Object.fromEntries(Object.entries($.value).filter(([v]) => !h.value.some((O) => String(O.id) === v))), o.value = !1;
    }
    function _(v) {
      s.value = /* @__PURE__ */ new Set([...s.value, v.id]);
    }
    function k(v) {
      s.value = new Set([...s.value].filter((O) => O !== v.id));
    }
    return (v, O) => (c(), V(Xo, {
      tag: "div",
      name: "dock",
      duration: U(wi),
      class: "dock-stack"
    }, {
      default: P(() => [
        (c(!0), f(K, null, ee(p.value, (x) => (c(), V(Co, {
          key: x.id,
          item: x,
          class: J({ timed: U(bt)(x) }),
          leaving: U(bt)(x) && !s.value.has(x.id),
          folded: S(x),
          refusal: l.value[x.id],
          onFold: (C) => I(x),
          onUndock: (C) => u(x, C),
          onMouseenter: (C) => _(x),
          onMouseleave: (C) => k(x)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), f("div", Tv, [
          g("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: X
          }, [
            se(b(h.value.length) + " runs ", 1),
            B(Pt, { open: "" })
          ])
        ])) : A("", !0),
        (c(!0), f(K, null, ee(w.value ? [] : h.value, (x) => (c(), V(Co, {
          key: x.id,
          item: x,
          class: J({ timed: U(bt)(x) }),
          leaving: U(bt)(x) && !s.value.has(x.id),
          folded: S(x),
          refusal: l.value[x.id],
          onFold: (C) => I(x),
          onUndock: (C) => u(x, C),
          onMouseenter: (C) => _(x),
          onMouseleave: (C) => k(x)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        w.value ? (c(), V(bi, {
          key: "runs-row",
          label: `${h.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: P(() => [
            g("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run on a card",
              "data-dock-runs-open": "",
              onClick: O[0] || (O[0] = (x) => o.value = !0)
            }, [
              B(at, { name: "runs" }),
              se(" " + b(h.value.length) + " runs ", 1),
              B(Pt)
            ]),
            g("span", Iv, [
              (c(!0), f(K, null, ee(h.value, (x) => (c(), V(Mv, {
                key: x.id,
                item: x,
                onClick: (C) => q(x)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : A("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, q5 = /* @__PURE__ */ Y(Rv, [["__scopeId", "data-v-c63f6dea"]]), xt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Ln = (e) => Math.min(Math.max(e, 0), 1), Bv = (e) => {
  const t = Ln(e);
  return t * t * (3 - 2 * t);
}, vt = (e, t, n) => Bv((e - t) / (n - t));
function F5(e) {
  const t = Ln(e), n = Ln((t - 0.12) / 0.76) * xt.shuffles, s = Math.min(Math.floor(n), xt.shuffles - 1), a = n - s, o = vt(a, 0.26, 0.38) * (1 - vt(a, 0.76, 0.96)), r = vt(a, 0.38, 0.76), i = vt(t, 0, 0.12) * (1 - vt(t, 0.88, 1)), l = vt(a, 0.2, 0.34) * (1 - vt(a, 0.84, 1)), u = Math.sin(Math.PI * Ln((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / xt.shuffles, lift: xt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function W5(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const To = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, H5 = (e) => To[e] ?? To.butler, Ia = 2400, Lv = 0.05;
function Nv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, Lv), r = Math.min(t + Ia * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function U5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function Dv(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function z5(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const V5 = (e, t) => ({ ...e, stretch: t.stretch }), G5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Si = (e, t) => t >= (e.least ?? 0);
function K5(e, t, n) {
  if (!Si(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const Y5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Pv = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Io = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), jv = (e) => e.right > e.left && e.bottom > e.top;
function J5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(Pv)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = Io(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = Io(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), jv(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function _i(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, h, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[h] || e[d] > o[p]) && (i = -1);
      else {
        const w = (o[h] - e[d]) / y, $ = (o[p] - e[d]) / y;
        r = Math.max(r, Math.min(w, $)), i = Math.min(i, Math.max(w, $));
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
}, on = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), qv = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => qv(on(e, t, n)), Fv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ft = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, An = ([e, t], n) => e + n() * (t - e);
function Wv(e) {
  return Fv.map(() => {
    const t = An(ft.speed, e), n = An(ft.angle, e) * Math.PI / 180, s = An(ft.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [An(ft.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const Hv = Wv(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Uv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ft.gravity * (t[2] - ft.floor))) / ft.gravity;
}
function Z5(e, t, n = Hv) {
  const s = Me.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Uv(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, h) => d + o.velocity[h] * l);
  return u[2] -= ft.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const X5 = (e, t) => e && Me[e.name] ? { name: e.name, u: t / e.frames } : null;
function Q5(e, t) {
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
const e4 = () => Array.from({ length: Me.pogo.count }, (e, t) => Me.pogo.bounce * (t + 1) / Me.pogo.count), Dt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function t4(e, t, n) {
  const { away: s, side: a } = Me.bug_smash, o = a * s * n, [r, i] = [t.left + Dt.margin * n, t.right - Dt.margin * n], l = Math.min(Math.max(e + o + a * Dt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function n4(e, t, n) {
  const s = Me.bug_smash, a = Se(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Dt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Dt.tall * n * (1 - Se(t, s.emerge)),
      turn: 90 * (1 - Se(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - Se(t, s.gone)
    }
  };
}
function s4(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Dt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = Nv({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
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
function ra(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Ie.margin, r = ((e.along - Ie.margin + e.way * Ie.speed * n / s) / a % 2 + 2) % 2, i = Ie.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function zv(e, t) {
  const n = Me.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = Dv(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function o4(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Me.bug_shot, { frame: r, bug: i, shot: l } = zv(n, e.length), u = e.map((I, q) => ({ ...ra(I, t, Math.min(n / o.fps, Nn(q).shot)), shot: q < l })), d = Se(r / o.frames, o.aim), [h, p] = [u[Math.max(i - 1, 0)], u[i]], y = e.map((I, q) => ({ bug: I, index: q, seconds: n / o.fps - Nn(q).shot, spot: ra(I, t, Nn(q).shot) })).filter((I) => I.seconds >= 0), w = y.flatMap((I) => {
    const q = (a == null ? void 0 : a.get(I.index)) ?? Jv(I.bug, t, I.spot, a ? [] : s);
    return a == null || a.set(I.index, q), a && Zv(q, I.seconds, s), Xv(q, I.seconds, s);
  }), $ = y.filter((I) => Kv(I.bug)).map((I) => ({ seconds: I.seconds, from: I.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: h.x + (p.x - h.x) * d, y: h.y + (p.y - h.y) * d, back: S }, slush: w, camera: $ };
}
function Nn(e) {
  const t = Me.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function r4(e, t, n, s) {
  const { limit: a, margin: o } = Me.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const h = Nn(d), p = ra(u, t, h.shot), y = Math.abs(p.y - n.y) / Math.tan(a * Math.PI / 180), w = p.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - p.x), $ = Math.abs(p.x - l) >= y ? l : p.x + w * y, S = w > 0 ? Math.max(l, Math.min($, i)) : Math.min(l, Math.max($, r)), I = { from: l, to: S, begin: h.walk, end: h.aim };
    return l = S, I;
  });
}
function i4(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, Vv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Gv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Kv = (e) => e.along * 97 % 1 < xe.camera, rn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function Yv(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += xe.step) {
    const d = Math.min(u + xe.step, r.t), h = rn(e, d), p = _i(i, h, n);
    if (p) return { ...p, t: u + (d - u) * p.share };
    i = h;
  }
  const l = rn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function Jv(e, t, n, s = []) {
  const a = Gv(e.along + 1), [o, r] = Vv[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: xe.count }, () => {
    const l = i + (a() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + a() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: xe.radius[0] + a() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...Yv(d, t, s) };
  });
}
function Zv(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += xe.step) {
      const r = Math.min(o + xe.step, a), i = _i(rn(s, o), rn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function Xv(e, t, n = []) {
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
function l4(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Me.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, h = Se(e, [0, u]), p = Se(e, [u, u + d]);
  return r.map((y) => {
    const w = { x: s.x + y.at[0] * t, y: s.y + y.at[1] * t };
    return {
      x: n.x + (w.x - n.x) * h,
      y: n.y + (w.y - n.y) * h,
      r: y.size * t * (0.15 + 0.85 * h * h),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: h >= 1
    };
  });
}
function c4(e, t, n, s, a) {
  const { sway: o, above: r } = Me.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], h = ($) => {
    const [S, I] = [$.x - e.at.x, $.y - e.at.y];
    return { x: i.x + S * u - I * d, y: i.y + S * d + I * u };
  }, [p, y] = [...n].sort(($, S) => $.x - S.x), w = e.ends.map(h);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: w.map(($, S) => ({ from: $, to: S < w.length / 2 ? p : y })) };
}
const u4 = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: on(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: on(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function d4(e, t) {
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
const f4 = (e) => e === "pack_box";
function h4(e) {
  const { into: t, out: n } = Hn(Me.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function m4(e) {
  const t = Me.rope_swing, { into: n, out: s } = Hn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Qv = { after: 3 }, Ra = 10, ey = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, ty = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, ny = { weight: 19 }, Ei = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, sy = { every: 120 }, Ai = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Ci = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, ay = {
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
}, vn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Ra }), te = (e, t, n = {}) => vn(e, "clip", t, n), Ms = (e, t, n = {}) => vn(e, "look", t, n), Ro = (e, t, n = {}) => vn(e, "gaze", t, n), fe = (e, t, n = {}, s = {}) => ({ ...vn(e, "pick", t, n), ...s }), ye = (e) => vn("nothing", "nothing", e, {}), oy = 120, ry = 300, Ss = (e, t) => ({ ...te(e, t), cooldown: ry }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), iy = () => [te("joy", 2)], yt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), kt = (e) => ({ ...e, cooldown: ey[e.name] }), Jt = (e) => ({ ...e, shenanigan: !0, lasts: ty[e.name] }), as = [
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
  ...oe("reported", { cooldown: 90 }, [Ro("read", 3), te("nod", 1), ye(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [Ro("read", 3), ye(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ye(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ye(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, iy()),
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
  ...oe("answered", { cooldown: 15 }, [Ms("amused", 3), ye(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ye(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), ye(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), ye(13)]),
  ...oe("typing", { cooldown: 60 }, [Ms("reading", 1), ye(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(ay).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [Ms(t, 1)])),
  ...Object.entries(Ai).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(Ci).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
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
  ...oe("held:search", { cooldown: oy }, [Ss("search", 3), { ...Ss("binoculars", 2), when: { home: !0 } }, { ...Ss("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...oe("unit", { cooldown: Ei.build.cooldown }, [fe("unit", ny.weight), ye(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...fe("hang", 1, { hands: !0, free: !0 }), cooldown: sy.every }, fe("stand", 5)]),
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
], Oi = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Ti = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), ly = (e) => Array.isArray(e) ? e[0] : e, cy = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, uy = (e) => as.some((t) => t.when.moment === e);
function dy(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || Ti(d).every(([h, p]) => n(h) >= ly(p)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = as.filter((d) => Oi(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= Qv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var h;
    return d.kind === "nothing" || d.name !== ((h = e.tally) == null ? void 0 : h.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = dy(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Ii(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Ii(e, t, n) {
  var s;
  for (const [a, o] of Ti(t)) (s = e.memory) == null || s.set(a, e.now + cy(o, n));
}
function p4(e, t, n) {
  Ii(e, as.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const g4 = (e) => Object.values(Ei).find((t) => Oi(t.when, e)) ?? null, fy = (e, t, n) => n - t <= (e.lifetime ?? Ra), v4 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Si(e.clip, t));
class Ri {
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
const ia = {
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
}, y4 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Bi = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), k4 = {
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
}, w4 = 120, hy = 20, b4 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < hy), my = (e) => ia[e] || ia.idle, x4 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Li = "airborne", py = "landing", gy = "travelling", Ni = "grounded", $4 = ({ airborne: e, landing: t, trip: n }) => e ? Li : t ? py : n != null && n.started ? gy : Ni;
function M4(e, t) {
  var a;
  const n = vy(e, t);
  return e.mode === Ni && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function vy(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: h = 0, readingFacing: p = null } = e;
  if (n === Li && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...yy(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : my(u), facing: y ? p : i.posture === "sit" ? i.face : h };
}
function yy(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const la = (e) => e.outcome, ky = "plugin:code-commandments:sins:", Bo = (e) => e.type === "plugins.card" && e.markKey.startsWith(ky), wy = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Bo(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Bo(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], S4 = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Br(n) })).sort((n, s) => n.time - s.time), Lo = { user: "reacted", agent: "agent_reacted" };
function _4(e, t) {
  return e.filter((n) => Lo[n.author] && St(n) > t).map((n) => ({ beat: `${Lo[n.author]}:${n.emoji}`, time: St(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const by = [.../* @__PURE__ */ new Set([...Object.values(Ai).flatMap((e) => Object.keys(e)), ...Object.keys(Ci)])];
function E4(e, t) {
  return e.filter((n) => n.author === "agent" && St(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = by.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: St(n), card: Br(n) })).sort((n, s) => n.time - s.time);
}
const xy = (e) => new Ri(e).isTest(), Un = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[la(e)] || "";
}, $y = 1800, My = (e, t) => {
  if (Un(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Un(n) !== "finished" && Number(e.time) - Number(n.time) <= $y ? "tests_fixed" : "tests_passed";
};
function A4(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(xy), a = s.filter((i) => Un(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Un(i))), o.map((i) => ({ beat: My(i, a), time: Number(i.time), card: i.key }));
}
function C4(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(la(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: la(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const O4 = (e) => e.map((t) => {
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
function T4(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function I4(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function R4(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = wy.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ba(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const No = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Sy(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ba(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function B4(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : uy(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function L4(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const Do = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function N4(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, u = Do((i - l) / Oe.returnSeconds), d = i <= l ? Do(i / l) : 1 - u, h = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + h * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Po = 3, Di = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, jo = 12, D4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function P4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Di(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= Po ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * jo) / jo, lasts: Po } };
}
const j4 = (e) => e.posture === "hang" && !Di(e.face), _y = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Ey = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function q4(e, t, n) {
  return _y.has(e) ? 1 / 0 : !Ey.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Pi(n - t.began, t.share) - Qe.lead, 0);
}
const Ay = 5;
function F4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= Ay ? { beat: "long_walk", time: n } : null };
}
const Cy = 30, Cn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function W4(e, t, n, s, a = null) {
  if (t && n < t.until || !Cn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = Cn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + Cn.every } : { state: e, began: 0, until: 0, next: n + Cn.every };
}
const H4 = (e, t, n) => t && n < t.until && Bi.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Pi = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function U4(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = Pi(o, e.share);
  return a ? { eager: Oy(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function Oy(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Ty = 1, Iy = { look: "look", gaze: "gaze" };
function Ry(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [Iy[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const By = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), Ly = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > Ty * t, memory: s, now: a, room: o }, n).name === "backflip", Ny = { work: ["building"], idle: ["standing"] };
function z4(e, t, n, s) {
  const a = ia[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(Ny[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), Bi.has(e) ? { moments: o, began: n || s } : (n && s - n >= Cy && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function Dy(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const qo = { pondering: Dy };
function V4(e, t, n, s, a, o) {
  if (qo[e.beat]) {
    const i = qo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = Ry(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== Ra && { lifetime: r.lifetime } } } : null;
}
function G4(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = By(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const K4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function Y4(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function J4(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const Z4 = (e, t) => !!(e != null && e.watches) && !t.once, X4 = 10, Q4 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || fy(s, s.queuedAt, n)), ex = (e, t) => t ? null : e[0] ?? null;
function tx(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const nx = (e, t) => !t.during || !e.some((n) => n.during === t.during), Py = 2 * Math.PI, jy = 500;
function sx(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / jy, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, h = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = Py * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, $ = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !l ? a && !t.behind && !y.behind ? Fy(y, t, n, p, a) : Hy(y, t, n, p) : t) ?? y, S = $ != null && $.behind && $.mood === "reading" ? qy(e.point, $, n, r, a) : $;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: h, at: s };
}
function qy(e, t, n, s, a) {
  const o = (x) => x * 180 / Math.PI, r = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), h = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = h ? r(e.readingFacing - i) : 0, y = h ? e.readingYaw + p : d, w = y + r(u - y), $ = Math.min(Math.max(s / 1e3, 0), 0.1), S = Oe.turnSpeed * $, I = h ? y + Math.min(Math.max(w - y, -S), S) : w, q = h ? e.readingFollow + p : I, X = q + (I - q) * (1 - Math.exp(-$ / Oe.followSeconds)), _ = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, k = o(Ba(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), E = Math.min(Math.max(k, -_.up), _.down), v = Oe.tipSpeed * $, O = h ? e.readingPitch + Math.min(Math.max(E - e.readingPitch, -v), v) : E;
  return { ...t, readingYaw: I, readingFollow: X, readingPitch: O, readingFacing: i };
}
function Fy(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (q) => {
    const { yaw: X, pitch: _ } = Ba(q.x - n.x, a, n.y - q.y, o);
    return { yaw: X, pitch: Math.min(Math.max(_, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [No(i(e)), No(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const h = s / d, [p, y] = [Math.sin((1 - h) * d) / Math.sin(d), Math.sin(h * d) / Math.sin(d)], [w, $, S] = l.map((q, X) => p * q + y * u[X]), I = a * w / $;
  return { ...t, x: n.x + I, y: n.y - Sy(I, a, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const Wy = 0.15;
function ax(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Wy;
}
function Hy(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const Uy = (e) => !(e != null && e.on);
function ox(e, t, n) {
  if (Uy(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const ln = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, _s = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Fo = (e) => e * e * (3 - 2 * e);
function zy(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = _s(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, s = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Fo(_s(e, ...Je.fade)), lit: s, white: e < Je.flash[0] ? 0 : 1 - Fo(_s(e, ...Je.flash)) };
}
const rx = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function ix(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = zy(t - e.at);
  return s && { colour: ln.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...s } };
}
function lx(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function cx(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= ln.looks || s === null && n - e.since >= ln.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function ux(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const ct = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, dx = { behind: 39, figure: 40, ahead: 41 }, Vy = "[data-figure-pile]", Gy = { amber: [1, 0.69, 0.125], good: ln.colours.good, bad: ln.colours.bad }, Dn = { phases: 4, ms: 230, dim: 0.25 }, fx = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, hx = (e) => e === "amber" ? Dn.phases : 1;
function mx(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const px = Object.keys(Gy), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Zt = ([e, t], n) => e + n() * (t - e);
function gx(e) {
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
const Es = { high: 3, gap: 1 };
function vx(e) {
  const t = Math.floor(e / Es.high);
  return { left: -(ct.inside + ct.width / 2 + t * (ct.width + Es.gap)), up: e % Es.high * (ct.height - ct.top) };
}
const Ky = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, Yy = { after: 5 }, Jy = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Ri(t).isBuild());
function yx(e, t, n) {
  const s = Jy(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Yy.after ? a : null;
}
function kx(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: Ky(n, s, a) } : null;
}
const Wo = { ahead: 140, up: 70 };
function wx(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Wo.ahead, y: s - Wo.up } } : o ? { at: { x: n(o), y: s - o.up - ct.height } } : t ? { at: null } : null;
}
const As = { least: 4e3, most: 1e4 }, Zy = (e) => As.least + e() * (As.most - As.least), wt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function bx(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Zy(t);
    if (n.length >= wt.most || t() >= wt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (wt.at[0] + t() * (wt.at[1] - wt.at[0]));
    n.push({ from: o, to: o + wt.ms }), s = o + wt.ms;
  }
}
const xx = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), $x = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), ji = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Mx = new Set(as.filter((e) => ji.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), Xy = (e) => e.some((t) => t.state === "built"), Sx = (e, t) => Xy(t) ? e.filter((n) => !ji.has(n.beat)) : e, ht = { reach: 40, room: 6 }, Qy = (e, t) => t <= e - ht.reach + 2, _x = (e, t, n) => Qy(e, n) ? t - ht.reach : e - ht.reach - ht.room, Ex = (e, t, n, s) => s > 0 && t < e && t + ht.reach >= e - 2 ? Math.min(n, Math.max(e, t + ht.reach)) : e, Cs = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Ax = (e) => Zt(e() < Cs.longShare ? Cs.long : Cs.short, e), ek = 2 * ct.width;
function Cx(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= ek ? o : e + (o - e + a / 2) % a;
}
const tk = 60, Ox = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= tk, Ho = "[data-figure-home]", yn = () => {
  var t;
  const e = document.querySelector(Ho);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ho)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, nk = "[data-figure-docked-bars]", sk = "[data-figure-chat-foot]", ak = [0.85, 0.6, 0.35, 0.15], ok = ["question", "waiting", "suggestion"], Tx = (e, t) => ok.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Ix() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const rk = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", ik = "[data-figure-newest]";
function qi() {
  var s, a;
  const e = (s = yn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(ik), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !La(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function cn(e, t, n = qi()) {
  if (!e || !n) return !0;
  const s = ot(e, t), a = rs(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ce.top * t.size, bottom: s.top + Ce.bottom * t.size }, r = xt.gap;
  return !os(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function Rx(e, t, n, s = qi()) {
  if (!s || cn(t, e, s)) return null;
  const a = rs(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Ot(), l = t.posture === "stand" ? Da * e.size : Ki * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - xt.gap - r, s.right + xt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= u && p.x <= d && cn(p, e, s) && Nk(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const Os = 0.26, Fi = 0.54, lk = 1.25 / 5.4, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Os, travels: "stand" },
  lounge: { drop: Os, travels: "stand" },
  composed: { drop: Os, travels: "stand" },
  hang: { drop: Fi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Bx = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * lk * Math.cos(t * Math.PI / 180),
  y: 1 - n - Fi
}), Xt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), ck = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Lx = (e, t) => (e === "sit" ? ck.has(t) : Xt.has(e)) ? e : "stand";
function Nx(e, t) {
  return e.facing === t.facing || !Xt.has(e.posture) && !Xt.has(t.posture) ? t : { posture: "stand", facing: Xt.has(e.posture) ? e.facing : t.facing };
}
const Dx = 0.25, Px = (e, t) => Xt.has(e) && kn[t].drop === 0, Wi = 2, uk = 90, dk = 180, fk = 140, hk = 280, mk = 420, pk = 0.25, gk = 290, vk = 600, yk = "cubic-bezier(0.2, 0.7, 0.4, 1)", kk = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ts = 5;
function zn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ts) return null;
  (r || i) && (o = Math.max(o, Wi));
  const y = o > 1, w = Math.abs(t.x - e.x), $ = w < Ts ? 0 : w / (uk * o) * 1e3, S = Math.min($, y ? fk : dk), I = Math.abs(t.y - e.y), q = t.y < e.y, X = q && !p && Ly(I, n, l, u, d, h), _ = q ? mk + Math.min(I, 400) * pk : Math.sqrt(2 * I / Ia) * 1e3, k = {
    x: t.x,
    y: t.y,
    ms: I > Ts ? X ? vk : _ : 0,
    lead: X ? gk : q ? hk : 0,
    easing: q ? yk : kk,
    hopping: !0,
    clip: X ? "backflip" : q ? "jump" : "fall"
  }, E = { x: t.x, y: t.y, ms: $ + S, lead: 0, easing: "linear", ramp: S, ...y ? { clip: "run" } : {} }, v = p ? wk(t, n) : k, O = q && !s ? [{ ...E, y: e.y }, v] : [{ ...k, x: e.x }, E];
  return { way: Math.sign(t.x - e.x) || 1, legs: O, lands: !a, pace: o, running: y };
}
const wk = (e, t) => ({ x: e.x, y: e.y, ms: Me.pogo.frames / Me.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), bk = (e, t) => e.postures.includes(t) ? t : e.postures[0], jx = (e, t, n) => e.posture === "walk" && n ? "walk" : bk(e.clip, t), ot = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - kn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, os = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, La = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Ot() {
  var t;
  const e = (t = yn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const On = 0.5, Uo = 20;
function qx(e, t, n = Ot()) {
  const s = ot(e, t);
  return s.left >= n.left + Uo && s.right <= n.right - Uo;
}
function Na(e, t, n = Ot()) {
  const s = ot(e, t), a = s.right - s.left, o = rs(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - On && i <= n.right + On && s.top >= n.top - On && l <= n.bottom + On;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, xk = 0.24;
function rs(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + xk * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function $k(e, { size: t }, n = Ot()) {
  const s = rs(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Da = (Ce.right - Ce.left) / 2 + 0.08;
function Fx(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - kn[e].drop) };
}
const Mk = "[data-figure-agent]";
function Hi(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !La(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Ui = (e) => Gn.flatMap(
  (t) => Vn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Pa(e, t, n = "") {
  if (!cn(e, t)) return Vn.length * Gn.length;
  const s = ot(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(rk)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && os(a, l) && La(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return Ui(a).filter(([i, l]) => r(i, l) || Hi(i, l, n)).length;
}
function Sk(e, t) {
  const n = ot(e, t);
  return Ui({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => Hi(s, a, "", Mk)).length;
}
const zo = 4;
function Wx(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = zo; o <= a; o += zo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!Sk(i, e) && cn(i, e)) return i;
    }
  return null;
}
function un(e, t, n) {
  const s = Ot(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Na(r, t, s) && cn(r, t)).map((r) => ({ spot: r, covered: Pa(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const zi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), _k = [0.5, 0.25, 0.75], Ek = (e) => zi(e.getBoundingClientRect(), _k), Vi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Ak = Da, Ck = (e, t, { size: n }, s = Ak) => Gi(e, Vi[t], s * n, "stand");
function Gi(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Ok = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Ki = 0.1, Tk = (e, t, { size: n }) => Gi(e, Ok[t], Ki * n, "sit"), Ik = (e) => ((e + 180) % 360 + 360) % 360 - 180, Is = 60;
function Hx(e, t) {
  const n = Ik(t);
  return !e.aside || Math.abs(n) >= Is ? t : n < 0 ? 360 - Is : Is;
}
const Qt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Rk = (e) => [.../* @__PURE__ */ new Set([e, ...Qt.turns.map((t) => (t + 360) % 360)])];
function Ux(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = Rk(t), r = Qt.every[0] + s() * (Qt.every[1] - Qt.every[0]);
  return { face: t, from: a ? Bk(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Bk(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Qt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function zx(e, t) {
  const { element: n, edge: s } = is(), a = ["left", "right"].map((i) => wn(Tk(s, i, e), e)).filter((i) => n && Na(i, e) && !Pa(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function Vx(e, t, { size: n }) {
  const s = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - Yi } : e;
}
const Yi = 7;
function Ji() {
  const e = [...document.querySelectorAll(Vy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Lk(e, t) {
  const n = ot(e, t), s = n.right - n.left;
  return { left: n.left + Ce.left * s, right: n.left + Ce.right * s, top: n.top + Ce.top * s, bottom: n.bottom };
}
function Nk(e, t) {
  const n = Ji();
  return !n || !os(Lk(e, t), n);
}
const Dk = 4;
function is() {
  const e = bn(), t = Ji(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Dk || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Yi - n, 0) } };
}
const Gx = ({ size: e, below: t }) => (1 - t) * e;
function wn(e, t) {
  const n = Ot(), { size: s, below: a } = t, o = kn[e.posture].drop * s;
  return { ...$k(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const ca = (e, t) => Object.keys(Vi).map((n) => wn(Ck(e, n, t), t)), ja = (e, t) => zi(e, ak).map((n) => wn(n, t)), Zi = (e, t, n) => un(e, t, n) ?? e[0];
function Kx(e, t) {
  const { element: n, edge: s } = is();
  return { ...Zi(ca(s, e), e, t), view: null, on: n };
}
function Yx(e, t, n, s) {
  const { element: a, edge: o } = is(), r = (s ? ca(o, t) : [...ca(o, t), ...ja(o, t)]).filter(
    (u) => !os(ot(u, t), e)
  ), i = un(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !Pa(i, t) ? i : un(r, t, n);
  return l && { ...l, view: null, on: a };
}
function bn() {
  var s;
  const e = yn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(nk);
  if (!t) return { ...ls(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Vo = { within: 2 };
function Jx(e) {
  const { element: t, docked: n, edge: s } = bn();
  if (!n || e.on !== t) return !0;
  const a = ls().edge;
  return s.left > a.left + Vo.within || s.left + s.width < a.left + a.width - Vo.within;
}
const Pk = "[data-figure-closing]";
function Zx() {
  var n;
  const { element: e, docked: t } = bn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Pk));
}
const Xi = "[data-figure-progress]";
function Xx(e) {
  const t = e.querySelector(Xi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Qx(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const jk = { across: 300, above: 380, below: 60 };
function e$(e) {
  const { across: t, above: n, below: s } = jk;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: qk(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const qk = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Qi = "[data-figure-bar]", ua = { back: 144, along: 0.4 };
function t$(e) {
  const { element: t, docked: n, edge: s } = bn(), a = n ? t.querySelector(Qi) : null;
  if (!(a != null && a.querySelector(Xi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...wn({ x: o - ua.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function n$(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < ua.along * s.size ? t.x + ua.along * s.size : e.x, y: e.y, behind: !0 };
}
function s$(e) {
  const t = e.querySelector(Qi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ls() {
  const e = yn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function a$(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = ls(), l = n === null ? Fk(i, e, o === null ? t : { x: o, y: i.top }, s, a) : wn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Fk(e, t, n, s, a) {
  const o = ja(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + ct.width < a && l.x + s - ht.reach - ht.room >= r);
  return un(i.length ? i : o, t, n);
}
const Wk = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function o$(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: h = 0, pogo: p = !1 } = {}) {
  (o || r) && (a = Math.max(a, Wi));
  const y = (X) => {
    const _ = ot(X, n, kn[X.posture].travels);
    return { x: _.left, y: _.top };
  }, w = t.ladder ?? e.ladder;
  if (w && !(t.ladder && e.ladder)) return Hk(y(e), y(t), y({ ...w.foot, posture: "stand" }), w.way, !!t.ladder, n, a);
  const [$, ...S] = [e, ...l, t].map(y), I = zn($, S[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: h, pogo: p }), q = S.slice(1).map((X, _) => {
    var k;
    return (k = zn(S[_], X, n.size, { random: i, memory: u, now: d, room: h })) == null ? void 0 : k.legs.find((E) => E.hopping);
  });
  return I && { ...I, legs: [...I.legs, ...q.filter(Boolean)] };
}
function Hk(e, t, n, s, a, o, r) {
  const i = (d, h) => ({ x: h.x, y: h.y, ms: Math.hypot(h.x - d.x, h.y - d.y) / Wk.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? zn(e, n, o.size, { pace: r }) : zn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function r$(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function i$(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && un(Ek(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = is();
  return { ...Zi(ja(a, t), t, n), view: null, on: s };
}
const Uk = "[data-figure-bubble]", zk = 250;
let en = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), el = 0;
const Ut = () => en, Rs = /* @__PURE__ */ new WeakMap();
let Vk = 0;
function qa(e) {
  return Rs.has(e) || Rs.set(e, `floor-${++Vk}`), Rs.get(e);
}
const Gk = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Kk = () => {
  var e, t;
  return ((t = (e = yn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Yk(e, t) {
  var s;
  const n = (s = e.querySelector(sk)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Jk(e, t) {
  const n = e && Yk(e, t), s = e ? [...e.querySelectorAll(Uk)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Gk(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: qa(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Zk = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= zk ? (t.top - s.top) / a * 1e3 : 0;
};
function tl(e = en, t = performance.now()) {
  const n = Ot(), s = Kk(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = bn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = ls();
  return u.element && l.push({ id: qa(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Jk(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: Zk(e, d, t) }))) });
}
const da = /* @__PURE__ */ new Set();
function Xk(e) {
  return da.add(e), () => da.delete(e);
}
function Qk() {
  nl();
  const e = () => {
    el = requestAnimationFrame(e), !document.hidden && (en = tl(en), da.forEach((t) => t(en)));
  };
  e();
}
function nl() {
  cancelAnimationFrame(el);
}
const Fa = 5, ew = 56, tw = { share: 0.6 }, nw = (e) => -Math.sqrt(2 * Ia * tw.share * e), jt = (e, t) => e.find((n) => n.id === t) ?? null;
function l$(e, t = tl().floors) {
  const n = jt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : qa(e.on) : null, o = a && jt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function sl({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Ut().floors) {
  const u = jt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || sw(u, d, o)) && aw(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Wa = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, sw = (e, t, n) => !Wa({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function c$(e, t = Ut().floors) {
  if (!Wa(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Fa && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function aw(e, t, n = Ut().floors) {
  const s = jt(n, "home");
  return e.posture === "hang" && s && ot(e, t).bottom >= s.top ? !1 : Na(e, t);
}
function u$(e, t, n, s = Ut().floors) {
  const a = sl(e, n, s);
  if (!e.home) return ow(e, t, a, s);
  if (!a) return null;
  const o = jt(s, "home"), r = a.y - t.y, i = r > Fa ? "dropping" : -r > ew ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function ow(e, t, n, s) {
  const a = n ? jt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: nw(e.risen) };
  if (!n) return null;
  if (Wa(t) && n.y - t.y > Fa) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function d$(e, t, n) {
  const s = Da * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function f$(e, t, n, s = Ut().floors) {
  const a = t && sl(t, n, s);
  return a ? { ...e, ...a } : e;
}
const rw = ["data-kind"], iw = { class: "figure-floor-name" }, lw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), f("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: me({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", iw, b(e.floor.kind), 1)
    ], 12, rw));
  }
}, cw = /* @__PURE__ */ Y(lw, [["__scopeId", "data-v-8f6132da"]]), uw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, dw = {
  __name: "FigureFloors",
  setup(e) {
    const t = ut(Ut().floors);
    let n = () => {
    };
    return Ne(() => {
      n = Xk((s) => t.value = s.floors), Qk();
    }), Te(() => {
      n(), nl();
    }), (s, a) => (c(), f("div", uw, [
      (c(!0), f(K, null, ee(t.value, (o) => (c(), V(cw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, h$ = /* @__PURE__ */ Y(dw, [["__scopeId", "data-v-e519168b"]]), Bs = (e) => typeof e == "number" ? e : Date.parse(e);
function m$(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Bs(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Bs(a.row.created_at) - Bs(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const fw = 3, Ls = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function hw(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Ls[n.grouping]) == null ? void 0 : s.call(Ls, e.row, n)) || "";
}
function mw(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function p$(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= fw ? [mw(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = hw(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const pw = 1e3;
function gw() {
  const e = T(Date.now()), t = setInterval(() => e.value = Date.now(), pw);
  return Ft(() => clearInterval(t)), e;
}
const vw = ["datetime", "title"], cs = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = gw(), s = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), f("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, b(U(li)(e.at, U(n))), 9, vw));
  }
};
function g$(e) {
  const t = At(), n = t.option("row"), s = T(null);
  async function a() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    s.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], a), pe(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, a, { immediate: !0 }), s;
}
function yw(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const v$ = (e) => (t) => t.filter((n) => n.id !== e), y$ = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), k$ = (e) => (t) => [...t, e], w$ = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function b$(e) {
  const t = At(), n = T(null), s = T("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
function x$(e) {
  const t = At(), n = T("");
  async function s(a) {
    const o = await t.run(a);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: s };
}
const Tn = /* @__PURE__ */ new Map();
function kw(e, t) {
  if (Tn.has(e)) return Tn.get(e);
  const n = t().finally(() => Tn.delete(e));
  return Tn.set(e, n), n;
}
function $$() {
  const e = At(), t = T(null), n = T("");
  async function s() {
    const a = await kw(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const ww = { class: "cards-page" }, bw = { class: "cards-bar" }, xw = { class: "cards-count" }, $w = { class: "cards" }, Mw = {
  key: 1,
  class: "cards-note"
}, Sw = {
  key: 2,
  class: "cards-note"
}, _w = ["data-row", "onClick"], Ew = { class: "card-head" }, Aw = { class: "card-title" }, Cw = { class: "card-foot" }, Ow = {
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
    return (s, a) => (c(), f("div", ww, [
      g("div", bw, [
        g("span", xw, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        B(he, nt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: P(() => [
            B(ve, {
              name: "plus",
              size: 12
            }),
            se(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", $w, [
        e.loaded ? e.failure ? (c(), f("p", Mw, b(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), f("p", Sw, "No " + b(e.noun) + "s yet", 1)) : (c(), V(Et, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), f(K, null, ee(e.rows, (o) => (c(), f("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          g("span", Ew, [
            B(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            se(" " + b(e.head(o)), 1),
            B(cs, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Aw, b(e.title(o)), 1),
          g("span", Cw, b(e.foot(o)), 1)
        ], 8, _w))), 128))
      ]),
      ce(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, M$ = /* @__PURE__ */ Y(Ow, [["__scopeId", "data-v-990e6b37"]]), Go = "newest";
function S$(e, { title: t, isOpen: n = null }) {
  var u;
  const s = (u = _e(Ae, null)) == null ? void 0 : u.search, a = T(""), o = T(Go), r = T("all"), i = R(() => {
    const d = a.value.trim().toLowerCase(), h = e.value.filter((p) => yw(p, d, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(p) === (r.value === "open")));
    return o.value === Go ? h : [...h].sort((p, y) => t(p).localeCompare(t(y)));
  }), l = R(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const Tw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Iw = 40, Rw = "top", Bw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var h;
    const n = e, s = (h = _e(Ae, null)) == null ? void 0 : h.autoScroll, a = R(() => s === Rw), o = T(null), r = T(!1), i = (p) => a.value ? p.scrollTop : p.scrollHeight - p.scrollTop - p.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Iw;
    }
    return pe(() => n.rowCount, async () => {
      await pt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (p, y) => (c(), f("div", Tw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(p.$slots, "default", {}, void 0, !0)
      ], 34),
      B(qt, {
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
            B(ve, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = se(" Newest ", -1))
          ], 512), [
            [tr, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, _$ = /* @__PURE__ */ Y(Bw, [["__scopeId", "data-v-3accb764"]]), Lw = ["aria-selected", "data-tab", "onClick"], Nw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Dw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var h;
    const n = e, s = t, a = ((h = _e(Ae, null)) == null ? void 0 : h.tabs) ?? [], o = T(null), r = T({ left: 0, width: 0, slides: !1 }), i = (p) => n.answer[p.count_field] !== void 0;
    function l(p) {
      var w;
      const y = (w = o.value) == null ? void 0 : w.querySelector(".inner-tab.on");
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
    }, u), pe(() => n.answer, u, { deep: !0 }), (p, y) => (c(), f("div", {
      ref_key: "band",
      ref: o,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), f(K, null, ee(U(a), (w) => {
        var $, S;
        return c(), f("button", {
          key: w.key,
          type: "button",
          role: "tab",
          class: J(["inner-tab", { on: (($ = e.active) == null ? void 0 : $.key) === w.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === w.key,
          "data-tab": w.key,
          onClick: (I) => s("choose", w)
        }, [
          se(b(w.label) + " ", 1),
          i(w) ? (c(), f("span", Nw, b(e.answer[w.count_field]), 1)) : A("", !0)
        ], 10, Lw);
      }), 128)),
      g("i", {
        class: J(["inner-tabs-line", { slides: r.value.slides }]),
        style: me({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, E$ = /* @__PURE__ */ Y(Dw, [["__scopeId", "data-v-46fc6186"]]), Pw = {
  class: "tab-body",
  "data-tab-body": ""
}, jw = { "data-tab-content": "" }, qw = {
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
    }), (a, o) => (c(), f("div", Pw, [
      n.value ? (c(), V(Et, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      st(g("div", jw, [
        ce(a.$slots, "default", {}, void 0, !0)
      ], 512), [
        [tr, !n.value]
      ])
    ]));
  }
}, A$ = /* @__PURE__ */ Y(qw, [["__scopeId", "data-v-63876533"]]), Fw = {}, Ww = { class: "menu-label" };
function Hw(e, t) {
  return c(), f("span", Ww, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const fa = /* @__PURE__ */ Y(Fw, [["render", Hw], ["__scopeId", "data-v-aa955b3e"]]), Uw = {
  class: "search-bar",
  "data-search-bar": ""
}, zw = { class: "search-bar-control" }, Vw = ["value", "placeholder", "aria-label"], Gw = ["aria-expanded"], Kw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var I;
    const s = e, a = n, o = kl(), r = ((I = _e(Ae, null)) == null ? void 0 : I.search) ?? {}, i = R(() => r.placeholder || s.placeholder), l = r.context ?? [], u = T(null), d = T(null), h = T([]), p = R(() => h.value.length ? h.value[h.value.length - 1].next : l), y = R(() => !!o.menu || l.length > 0), w = (q) => {
      h.value = [], d.value = d.value ? null : q.currentTarget;
    };
    function $(q) {
      if (q.next.length) {
        h.value = [...h.value, q];
        return;
      }
      d.value = null, a("pick", q.click);
    }
    function S() {
      var q;
      a("update:modelValue", ""), (q = u.value) == null || q.focus();
    }
    return t({ focus: () => {
      var q;
      return (q = u.value) == null ? void 0 : q.focus();
    } }), (q, X) => {
      var _;
      return c(), f("div", Uw, [
        g("div", zw, [
          B(ve, {
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
            onInput: X[0] || (X[0] = (k) => a("update:modelValue", k.target.value)),
            onKeydown: tn(S, ["esc"])
          }, null, 40, Vw),
          e.modelValue ? (c(), f("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            B(ve, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          y.value ? (c(), f("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: w
          }, [
            B(ve, {
              name: "caret",
              size: 12
            })
          ], 8, Gw)) : A("", !0)
        ]),
        (_ = U(r).button) != null && _.title ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: X[1] || (X[1] = (k) => a("pick", U(r).button.click))
        }, b(U(r).button.title), 1)) : A("", !0),
        ce(q.$slots, "default", {}, void 0, !0),
        d.value ? (c(), V(Jn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: X[3] || (X[3] = be(() => {
          }, ["stop"])),
          onClose: X[4] || (X[4] = (k) => d.value = null)
        }, {
          default: P(() => [
            h.value.length ? (c(), V(Mt, {
              key: 0,
              "data-search-back": "",
              onClick: X[2] || (X[2] = (k) => h.value = h.value.slice(0, -1))
            }, {
              default: P(() => [
                se("‹ " + b(h.value[h.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), f(K, null, ee(p.value, (k) => (c(), V(Mt, {
              key: k.title,
              description: k.subtext,
              "data-search-entry": k.title,
              onClick: (E) => $(k)
            }, {
              default: P(() => [
                se(b(k.title) + b(k.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            h.value.length ? A("", !0) : ce(q.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, Yw = /* @__PURE__ */ Y(Kw, [["__scopeId", "data-v-43c4837e"]]), Jw = {
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
    return (o, r) => (c(), V(Yw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        B(fa, null, {
          default: P(() => [...r[2] || (r[2] = [
            se("Order", -1)
          ])]),
          _: 1
        }),
        (c(), f(K, null, ee(s, (i) => B(Mt, {
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
        e.tools.hasStates ? (c(), f(K, { key: 0 }, [
          B(fa, null, {
            default: P(() => [...r[3] || (r[3] = [
              se("Show", -1)
            ])]),
            _: 1
          }),
          (c(), f(K, null, ee(a, (i) => B(Mt, {
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
}, C$ = /* @__PURE__ */ Y(Jw, [["__scopeId", "data-v-dab0064d"]]);
function O$() {
  const e = T(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const T$ = (e) => import(
  /* @vite-ignore */
  e
), Zw = 86400, ha = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Xw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ha(t) - ha(e)) / Zw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function I$(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ha(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Xw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ns = 280, Ds = 240, Ps = 120, Qw = 6, e2 = 14, dn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function t2(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function al(e, t) {
  const n = Math.max(0, t2(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function n2(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${e2}px)` }), e.offsetHeight, e.style.transition = `height ${Ns}ms ${dn}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, h = () => {
    if (u) return;
    n() && (t.scrollTop = al(t, e));
    const p = a() - i;
    if (!l && p >= Ns && (l = !0, e.style.transition = `opacity ${Ds}ms ease-out, transform ${Ds}ms ${dn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Ns + Ds) return s(h);
    d();
  };
  return s(h), d;
}
function R$(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Qw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ps}ms ease-out, transform ${Ps}ms ${dn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = al(t, e)), a() - r < Ps) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const s2 = 140, In = 220, Ko = 5;
function B$({ gap: e = s2, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(d, h) {
    s.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      s.delete(d), d.done(), h();
    });
  }
  function l() {
    const d = n.splice(0, Ko);
    if (a = d.length > 0, !a) return;
    let h = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        h -= 1, h || (o = t(l, e));
      });
  }
  const u = (d, h, p, y = n2) => {
    if (r || !h.pane || !h.follows()) return p();
    const w = { el: d, options: h, done: p, arrival: y, display: d.style.display || "" };
    if (!a)
      return a = !0, i(w, () => o = t(l, e));
    d.style.display = "none", n.push(w), n.length >= Ko && u.flush();
  };
  return u.flush = () => {
    var d;
    r = !0, queueMicrotask(() => r = !1);
    for (const h of [...s]) (d = h.cancel) == null || d.call(h);
    clearTimeout(o), a = !1;
    for (const h of n.splice(0))
      h.el.style.display = h.display, h.done();
  }, u;
}
function L$(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${In}ms ${dn}, opacity ${In}ms ease-in, margin ${In}ms ${dn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, In);
}
const ol = "chat.pins.minimised", Pn = T(sn(ol, !1));
function Yo(e) {
  Pn.value = e, es(ol, e);
}
function a2(e) {
  const t = R(() => e()), n = R(() => Pn.value ? [] : e()), s = () => Yo(!Pn.value), a = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => St(o) > a).length,
    (o, r) => o > r && Yo(!1)
  ), { pins: t, visible: n, minimised: Pn, toggle: s };
}
const o2 = ["title"], r2 = {
  key: 0,
  class: "pins-count"
}, i2 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = a2(() => t.pinRows);
    return (o, r) => U(n).length ? (c(), f("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => U(a) && U(a)(...i), ["stop"]))
    }, [
      B(ve, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (c(), f("span", r2, b(U(n).length), 1)) : A("", !0)
    ], 10, o2)) : A("", !0);
  }
}, N$ = /* @__PURE__ */ Y(i2, [["__scopeId", "data-v-d073c504"]]), l2 = ["title"], c2 = ["title"], u2 = { class: "diff-card-dir" }, d2 = { class: "diff-card-name" }, f2 = ["title"], h2 = ["title"], m2 = {
  key: 0,
  class: "diff-card-note"
}, p2 = ["href"], g2 = ["src", "alt"], v2 = { class: "diff-card-rows" }, y2 = { class: "diff-row-num" }, k2 = { class: "diff-row-sign" }, w2 = { class: "diff-row-code" }, b2 = {
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
    function o(C) {
      (C.metaKey || C.ctrlKey) && (C.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, l.value)), d = R(() => n.path.slice(l.value)), h = R(() => n.kind === "deleted"), p = R(() => r[n.kind]), y = R(() => new Set(n.rows.filter((C) => C.line_type === "add").map((C) => C.line))), w = T("after"), $ = R(() => w.value === "before" ? n.whole.old : n.whole.text), S = R(() => n.whole && n.whole.text !== void 0 ? $.value.split(`
`).map((C, M) => ({ line_type: w.value === "after" && y.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: C })) : n.rows.filter(
      (C) => !(n.editsOnly && ["ctx", "fold"].includes(C.line_type)) && !(n.hideRemovals && C.line_type === "del")
    )), I = T(!1), q = R(() => n.lines && !I.value && !n.whole), X = R(() => q.value ? S.value.slice(0, n.lines) : S.value), _ = R(() => S.value.length - X.value.length), k = (C) => C.line === null || C.line_type === "del" ? "" : C.line, E = (C) => C.line_type === "fold" ? C.hidden ? `⋯ ${C.hidden} lines` : "⋯" : C.text, v = T(null), O = T(null);
    let x = null;
    return Ne(() => {
      if (!O.value) return;
      let C = !0;
      x = new ResizeObserver(() => {
        !v.value || !O.value || (v.value.style.transition = C ? "none" : "", v.value.style.height = `${O.value.offsetHeight}px`, C = !1);
      }), x.observe(O.value);
    }), Te(() => x && x.disconnect()), (C, M) => (c(), f("section", {
      class: J(["diff-card", { half: e.half, gone: h.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: h.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (m) => !h.value && s("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          g("span", u2, b(u.value), 1),
          g("span", d2, b(d.value), 1),
          p.value ? (c(), f("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, b(p.value), 3)) : A("", !0)
        ], 8, c2),
        g("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        g("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        B(cs, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: w.value === "after" ? "Show the file before" : "Show the file after",
          onClick: M[0] || (M[0] = be((m) => w.value = w.value === "after" ? "before" : "after", ["stop"]))
        }, b(w.value === "after" ? "After" : "Before"), 9, f2)) : A("", !0),
        h.value ? A("", !0) : (c(), f("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: M[1] || (M[1] = be((m) => s("whole"), ["stop"]))
        }, [
          B(ve, {
            name: "file",
            size: 12
          })
        ], 10, h2))
      ], 8, l2),
      e.whole && e.whole.error ? (c(), f("p", m2, b(e.whole.error), 1)) : A("", !0),
      !h.value && !e.folded ? (c(), f(K, { key: 1 }, [
        e.picture ? (c(), f("a", {
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
          }, null, 8, g2)
        ], 8, p2)) : (c(), f("div", {
          key: 1,
          ref_key: "grow",
          ref: v,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: O,
            class: "diff-card-diff"
          }, [
            g("div", v2, [
              (c(!0), f(K, null, ee(X.value, (m, L) => (c(), f("div", {
                key: L,
                class: J(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                g("span", y2, b(k(m)), 1),
                g("span", k2, b(i[m.line_type]), 1),
                g("span", w2, b(E(m)), 1)
              ], 2))), 128)),
              _.value > 0 ? (c(), f("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = be((m) => I.value = !0, ["stop"]))
              }, b(_.value) + " more " + b(_.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, D$ = /* @__PURE__ */ Y(b2, [["__scopeId", "data-v-fed58c18"]]), x2 = {
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
        B(ve, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, $2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, M2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, S2 = { class: "ask-text" }, _2 = ["placeholder", "aria-label"], E2 = ["placeholder", "aria-label"], A2 = {
  key: 3,
  class: "moves"
}, C2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(() => Y0(s.kind, s.row)), r = T(""), i = T(null), l = T(""), u = T("");
    pe(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(y, w = "") {
      const $ = await s.read([y.noun ?? s.kind, y.word, String(s.id), ...y.flag ? [y.flag, w] : y.positional ? [w] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = $.ok ? "" : $.error, $.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const h = (y) => y.confirm ? i.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (i.value = y, l.value = "") : d(y), p = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: h }), (y, w) => {
      var $;
      return o.value.length ? (c(), f("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), f("p", $2, b(r.value), 1)) : A("", !0),
        ($ = i.value) != null && $.confirm ? (c(), f("div", M2, [
          g("span", S2, b(i.value.confirm), 1),
          B(he, {
            small: "",
            kind: i.value.danger ? "ghost" : "primary",
            bordered: i.value.danger,
            class: J({ danger: i.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: w[0] || (w[0] = (S) => d(i.value))
          }, {
            default: P(() => [
              se(b(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["kind", "bordered", "class"]),
          B(he, {
            small: "",
            kind: "ghost",
            onClick: w[1] || (w[1] = (S) => i.value = null)
          }, {
            default: P(() => [...w[7] || (w[7] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), f("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(p, ["prevent"])
        }, [
          st(g("input", {
            "onUpdate:modelValue": w[2] || (w[2] = (S) => l.value = S),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: w[3] || (w[3] = tn(be((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, _2), [
            [Ws, l.value]
          ]),
          i.value.opener ? st((c(), f("input", {
            key: 0,
            "onUpdate:modelValue": w[4] || (w[4] = (S) => u.value = S),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: w[5] || (w[5] = tn(be((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, E2)), [
            [Ws, u.value]
          ]) : A("", !0),
          B(he, {
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
          B(he, {
            small: "",
            kind: "ghost",
            onClick: w[6] || (w[6] = (S) => i.value = null)
          }, {
            default: P(() => [...w[8] || (w[8] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), f("div", A2, [
          (c(!0), f(K, null, ee(o.value, (S) => (c(), V(he, {
            key: S.word,
            small: !S.bordered,
            bordered: S.bordered,
            icon: S.icon,
            kind: S.main ? "primary" : "ghost",
            class: J({ danger: S.danger }),
            "data-move": S.word,
            onClick: (I) => h(S)
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
}, O2 = /* @__PURE__ */ Y(C2, [["__scopeId", "data-v-74d3b5e8"]]), T2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), I2 = (e) => T2.has(e), Kn = (e) => I2(e) ? "done" : e, R2 = { class: "facts" }, B2 = { class: "fact wide" }, L2 = { class: "fact-value" }, N2 = {
  key: 0,
  class: "fact"
}, D2 = { class: "fact-value" }, P2 = { class: "fact" }, j2 = { class: "fact-label" }, q2 = ["title"], F2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, W2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, H2 = {
  key: 2,
  class: "fact"
}, U2 = { class: "fact-value" }, z2 = { class: "fact wide" }, V2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, G2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Wn.map(({ key: o, label: r }) => ({ key: String(o), label: r })), s = t, a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var i, l;
      return c(), f("div", R2, [
        g("div", B2, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", L2, b((i = e.place) != null && i.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((l = e.place) == null ? void 0 : l.phase_total) > 1 ? (c(), f("div", N2, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", D2, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (c(), f(K, { key: 1 }, [
          g("div", P2, [
            g("span", j2, b(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => U(Fe)(`agents:${e.task.helper_id}`))
            }, b(e.task.helper_name), 9, q2)
          ]),
          U(a).has(e.task.state) ? (c(), f("p", F2, b(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), f("p", W2, b(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), f("div", H2, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", U2, "Agent " + b(e.task.holder_id), 1)
        ])) : A("", !0),
        g("div", z2, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          B(Zn, {
            options: U(n),
            value: String(U(di)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => s("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), f("p", V2, b(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, K2 = /* @__PURE__ */ Y(G2, [["__scopeId", "data-v-2bcdca7a"]]), Y2 = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, J2 = ["datetime"], Z2 = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), f("section", Y2, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), f(K, null, ee(e.renewals, (s) => (c(), f("article", {
        key: s.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: s.created_at
        }, b(new Date(s.created_at).toLocaleString()), 9, J2),
        g("p", null, b(s.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, X2 = /* @__PURE__ */ Y(Z2, [["__scopeId", "data-v-b41f213b"]]), Q2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, eb = { ...Q2, done: "Completed" }, tb = { class: "task-status-icon" }, nb = ["width", "height", "aria-label"], sb = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => dr("task", Kn(t.status))), s = R(() => n.value === "testing" ? "started" : n.value), a = R(() => eb[t.status] ?? qc("task", t.status));
    return (o, r) => (c(), f("span", tb, [
      B(qt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (c(), f("svg", {
            key: n.value,
            class: J(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": a.value
          }, [
            B(Wt, { value: s.value }, {
              blocked: P(() => [...r[0] || (r[0] = [
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
              done: P(() => [...r[1] || (r[1] = [
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
              started: P(() => [...r[2] || (r[2] = [
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
              asked: P(() => [...r[3] || (r[3] = [
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
              paused: P(() => [...r[4] || (r[4] = [
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
              planned: P(() => [...r[5] || (r[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: P(() => [...r[6] || (r[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, nb))
        ]),
        _: 1
      })
    ]));
  }
}, rl = /* @__PURE__ */ Y(sb, [["__scopeId", "data-v-ae24a63f"]]), ab = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, ob = ["onClick"], rb = { class: "wait-id" }, ib = { class: "wait-title" }, lb = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, cb = { class: "text" }, ub = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, db = 180, fb = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = T(!1);
    return (a, o) => (c(), f(K, null, [
      e.task.waits.length ? (c(), f("section", ab, [
        o[1] || (o[1] = g("h4", null, "Waits on", -1)),
        (c(!0), f(K, null, ee(e.task.waits, (r) => (c(), f("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          B(rl, {
            status: U(Kn)(r.state),
            size: 12
          }, null, 8, ["status"]),
          g("span", rb, b(r.id), 1),
          g("span", ib, b(r.title), 1)
        ], 8, ob))), 128))
      ])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), f("section", lb, [
        o[2] || (o[2] = g("h4", null, "How it was done", -1)),
        g("p", cb, b(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), f("section", ub, [
        o[3] || (o[3] = g("h4", null, "The brief", -1)),
        g("p", {
          class: J(["text", { clamped: !s.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > db && !s.value ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0)
    ], 64));
  }
}, hb = /* @__PURE__ */ Y(fb, [["__scopeId", "data-v-8e4d95ae"]]), mb = {
  class: "task-details",
  "data-task-details": ""
}, pb = { class: "since" }, gb = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, vb = { class: "text" }, yb = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, kb = {
  key: 1,
  class: "note"
}, wb = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, bb = { class: "text" }, xb = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), f("div", mb, [
        g("div", {
          class: J(["state-line", U(Kn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            B(rl, {
              status: U(Kn)(e.task.state)
            }, null, 8, ["status"]),
            se(" " + b(s(e.task.state)), 1)
          ]),
          g("span", pb, [
            o[3] || (o[3] = se(" since ", -1)),
            B(cs, {
              at: U(Sa)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), f("section", gb, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", vb, b(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), f("p", yb, "Opens by itself when " + b(e.task.openers.join(" or ")) + ".", 1)) : (c(), f("p", kb, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), f("section", wb, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", bb, b(e.task.reason), 1)
        ])) : A("", !0),
        B(K2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        B(hb, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"]),
        B(X2, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, $b = /* @__PURE__ */ Y(xb, [["__scopeId", "data-v-ab0cd816"]]), Mb = {
  class: "task-log",
  "aria-label": "Task log"
}, Sb = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, _b = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Eb = { class: "entries" }, Ab = ["datetime"], Cb = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Ob = {
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
      const h = await t.read([
        "task-log",
        "list",
        "--task-id",
        String(t.id),
        "--limit",
        String(He("task_logs")),
        "--page",
        String(u)
      ]);
      d === i && (o.value = !1, r.value = h.ok ? "" : h.error, h.ok && (n.value = h.value.rows, a.value = h.value.is_last_page));
    }
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], l();
      },
      { immediate: !0 }
    ), Ft(() => {
      i += 1;
    }), (u, d) => (c(), f("section", Mb, [
      o.value ? (c(), V(Et, { key: 0 })) : r.value ? (c(), f(K, { key: 1 }, [
        g("p", Sb, b(r.value), 1),
        B(he, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (h) => l(s.value))
        }, {
          default: P(() => [...d[3] || (d[3] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), f(K, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), f("p", _b, "No log entries yet.")),
        g("ol", Eb, [
          (c(!0), f(K, null, ee(n.value, (h) => (c(), f("li", {
            key: h.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: h.created_at
            }, b(new Date(h.created_at).toLocaleString()), 9, Ab),
            g("p", null, b(h.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), f("nav", Cb, [
          B(he, {
            small: "",
            bordered: "",
            disabled: s.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (h) => l(s.value - 1))
          }, {
            default: P(() => [...d[4] || (d[4] = [
              se("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + b(s.value), 1),
          B(he, {
            small: "",
            bordered: "",
            disabled: a.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (h) => l(s.value + 1))
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
}, Tb = /* @__PURE__ */ Y(Ob, [["__scopeId", "data-v-953605e5"]]), Ib = { class: "comment-side-head" }, Rb = {
  key: 0,
  class: "comment-none"
}, Bb = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), f("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", Ib, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        B(Qn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? A("", !0) : (c(), f("p", Rb, "No comments yet")),
      (c(!0), f(K, null, ee(e.comments, (s) => (c(), f("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(s)), 1))), 128))
    ], 2));
  }
}, Lb = /* @__PURE__ */ Y(Bb, [["__scopeId", "data-v-19fdbdd4"]]);
var Zo;
/Mac|iPhone|iPad/.test(((Zo = navigator.userAgentData) == null ? void 0 : Zo.platform) || navigator.platform);
function Nb(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const Db = ["placeholder"], Pb = { class: "actions" }, jb = { class: "error" }, qb = {
  key: 1,
  class: "card closed"
}, Fb = { class: "mark" }, Wb = { class: "prompt" }, Hb = {
  key: 0,
  class: "draft"
}, Ub = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Fs({
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
  emits: /* @__PURE__ */ Fs(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = qs(e, "draft"), r = qs(e, "error"), i = T(!!r.value), l = T(!1), u = T(!1), d = T(null);
    async function h() {
      var w, $;
      i.value = !0, l.value = !1, await pt(), ($ = ((w = d.value) == null ? void 0 : w.querySelector("input")) || d.value) == null || $.focus();
    }
    function p() {
      i.value = !1, r.value = "";
    }
    async function y() {
      const w = o.value.trim();
      if (!(!w || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(w), i.value = !1, l.value = !0;
        } catch ($) {
          o.value = w, r.value = $.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: h }), (w, $) => (c(), f("div", {
      class: J(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), f("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(y, ["prevent"]),
        onKeydown: tn(p, ["esc"])
      }, [
        ce(w.$slots, "who", {}, void 0, !0),
        st(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": $[0] || ($[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: $[1] || ($[1] = tn((S) => U(Nb)(S, y), ["enter"]))
        }, null, 40, Db), [
          [Ws, o.value]
        ]),
        g("div", Pb, [
          g("span", jb, b(r.value), 1),
          B(he, {
            small: "",
            onClick: p
          }, {
            default: P(() => [...$[3] || ($[3] = [
              se("Cancel", -1)
            ])]),
            _: 1
          }),
          B(he, {
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
      ], 32)) : (c(), f("div", qb, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: h
        }, [
          g("span", Fb, [
            B(ve, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", Wb, b(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), f("span", Hb, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), f("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: $[2] || ($[2] = (S) => a("show"))
        }, [
          g("span", null, b(U(Kl)(e.count, "comment")), 1),
          B(ve, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, zb = /* @__PURE__ */ Y(Ub, [["__scopeId", "data-v-81f478d2"]]);
function Vb(e, t) {
  const n = T([]), s = T(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: h, title: p } = e(), y = `On ${d} ${h}, ${p}: `;
    return u.text.startsWith(y) ? u.text.slice(y.length) : u.text;
  };
  async function i() {
    const { kind: u, id: d } = e();
    if (!d) return;
    const h = ++o, p = await t([u, "comments", String(d)]);
    h === o && (n.value = p.ok ? p.value.rows ?? [] : []);
  }
  async function l(u) {
    const { kind: d, id: h } = e(), p = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, p], s.value = !0;
    const y = await t([d, "comment", String(h), u]);
    if (!y.ok)
      throw n.value = n.value.filter((w) => w !== p && w.id !== p.id), new Error(y.error);
    await i();
  }
  return pe(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const Gb = { class: "top" }, Kb = {
  class: "crumb",
  "data-task-crumb": ""
}, Yb = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Jb = {
  key: 1,
  class: "body"
}, Zb = { class: "summary" }, Xb = { class: "stamp" }, Qb = {
  class: "title",
  "data-resource-title": ""
}, e5 = {
  class: "tabs",
  "data-task-tabs": ""
}, t5 = { class: "panels" }, n5 = {
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
    const s = e, a = n, o = T(null), r = T(null), i = T(""), l = T(""), u = T(null), d = T(null), h = T("details"), p = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], y = Vb(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (_) => s.read(_)
    );
    let w = 0;
    const $ = R(() => {
      var _;
      return (_ = r.value) != null && _.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function S() {
      const _ = ++w, [k, E] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      _ === w && (i.value = k.ok ? "" : k.error, o.value = k.ok ? k.value : null, r.value = E.ok ? E.value : null);
    }
    pe(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, h.value = "details", S();
      },
      { immediate: !0 }
    ), pe(() => s.changes, S), pe(y.open, (_) => {
      _ && (h.value = "comments");
    });
    async function I(_) {
      const k = o.value.priority;
      o.value.priority = Number(_);
      const E = await s.read(["task", "edit", String(s.id), "--priority", _]);
      if (l.value = E.ok ? "" : E.error, E.ok) return S();
      o.value.priority = k;
    }
    function q(_) {
      u.value = null, d.value.press(_);
    }
    const X = (_) => {
      var k;
      return ((k = d.value) == null ? void 0 : k.moves.length) && (u.value = _);
    };
    return t({ openStatus: X }), (_, k) => (c(), f("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", Gb, [
        e.backed ? (c(), V(x2, {
          key: 0,
          onBack: k[0] || (k[0] = (E) => a("back"))
        })) : A("", !0),
        g("span", Kb, b($.value), 1),
        k[9] || (k[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), f(K, { key: 1 }, [
          B(he, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: k[1] || (k[1] = (E) => a("step", -1))
          }, {
            default: P(() => [
              B(ve, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          B(he, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: k[2] || (k[2] = (E) => a("step", 1))
          }, {
            default: P(() => [
              B(ve, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        B(he, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: k[3] || (k[3] = (E) => a("close"))
        }, {
          default: P(() => [
            B(ve, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), f("p", Yb, b(i.value), 1)) : o.value ? (c(), f(K, { key: 2 }, [
        B(O2, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: S
        }, null, 8, ["id", "row", "read"]),
        g("header", Zb, [
          g("div", Xb, [
            se(" Task " + b(o.value.id) + " · updated ", 1),
            B(cs, {
              at: U(Sa)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", Qb, b(o.value.title), 1)
        ]),
        g("div", e5, [
          B(Zn, {
            options: p,
            value: h.value,
            onPick: k[4] || (k[4] = (E) => h.value = E)
          }, null, 8, ["value"])
        ]),
        g("div", t5, [
          B(Wt, { value: h.value }, {
            details: P(() => [
              B($b, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: X,
                onPriority: I,
                onSelect: k[5] || (k[5] = (E) => a("select", E))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: P(() => [
              B(Lb, {
                below: "",
                comments: U(y).comments.value,
                words: U(y).words,
                onClose: k[6] || (k[6] = (E) => h.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: P(() => [
              B(Tb, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        B(zb, {
          send: U(y).send,
          count: U(y).comments.value.length,
          onShow: k[7] || (k[7] = (E) => h.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), f("div", Jb, [
        B(Et)
      ])),
      u.value ? (c(), V(Jn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: k[8] || (k[8] = (E) => u.value = null)
      }, {
        default: P(() => [
          B(fa, null, {
            default: P(() => [
              se("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), f(K, null, ee(d.value.moves, (E) => (c(), V(Mt, {
            key: E.word,
            onClick: (v) => q(E)
          }, {
            default: P(() => [
              se(b(E.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, P$ = /* @__PURE__ */ Y(n5, [["__scopeId", "data-v-43f3b122"]]);
function s5(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var js = { exports: {} }, Jo;
function a5() {
  return Jo || (Jo = 1, (function(e, t) {
    var n = (function() {
      var s = function(k, E) {
        var v = 236, O = 17, x = k, C = o[E], M = null, m = 0, L = null, j = [], D = {}, Z = function(F, W) {
          m = x * 4 + 17, M = (function(N) {
            for (var H = new Array(N), z = 0; z < N; z += 1) {
              H[z] = new Array(N);
              for (var Q = 0; Q < N; Q += 1)
                H[z][Q] = null;
            }
            return H;
          })(m), G(0, 0), G(m - 7, 0), G(0, m - 7), ke(), le(), Ge(F, W), x >= 7 && Re(F), L == null && (L = il(x, C, j)), Ke(L, W);
        }, G = function(F, W) {
          for (var N = -1; N <= 7; N += 1)
            if (!(F + N <= -1 || m <= F + N))
              for (var H = -1; H <= 7; H += 1)
                W + H <= -1 || m <= W + H || (0 <= N && N <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (N == 0 || N == 6) || 2 <= N && N <= 4 && 2 <= H && H <= 4 ? M[F + N][W + H] = !0 : M[F + N][W + H] = !1);
        }, ue = function() {
          for (var F = 0, W = 0, N = 0; N < 8; N += 1) {
            Z(!0, N);
            var H = i.getLostPoint(D);
            (N == 0 || F > H) && (F = H, W = N);
          }
          return W;
        }, le = function() {
          for (var F = 8; F < m - 8; F += 1)
            M[F][6] == null && (M[F][6] = F % 2 == 0);
          for (var W = 8; W < m - 8; W += 1)
            M[6][W] == null && (M[6][W] = W % 2 == 0);
        }, ke = function() {
          for (var F = i.getPatternPosition(x), W = 0; W < F.length; W += 1)
            for (var N = 0; N < F.length; N += 1) {
              var H = F[W], z = F[N];
              if (M[H][z] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    Q == -2 || Q == 2 || ae == -2 || ae == 2 || Q == 0 && ae == 0 ? M[H + Q][z + ae] = !0 : M[H + Q][z + ae] = !1;
            }
        }, Re = function(F) {
          for (var W = i.getBCHTypeNumber(x), N = 0; N < 18; N += 1) {
            var H = !F && (W >> N & 1) == 1;
            M[Math.floor(N / 3)][N % 3 + m - 8 - 3] = H;
          }
          for (var N = 0; N < 18; N += 1) {
            var H = !F && (W >> N & 1) == 1;
            M[N % 3 + m - 8 - 3][Math.floor(N / 3)] = H;
          }
        }, Ge = function(F, W) {
          for (var N = C << 3 | W, H = i.getBCHTypeInfo(N), z = 0; z < 15; z += 1) {
            var Q = !F && (H >> z & 1) == 1;
            z < 6 ? M[z][8] = Q : z < 8 ? M[z + 1][8] = Q : M[m - 15 + z][8] = Q;
          }
          for (var z = 0; z < 15; z += 1) {
            var Q = !F && (H >> z & 1) == 1;
            z < 8 ? M[8][m - z - 1] = Q : z < 9 ? M[8][15 - z - 1 + 1] = Q : M[8][15 - z - 1] = Q;
          }
          M[m - 8][8] = !F;
        }, Ke = function(F, W) {
          for (var N = -1, H = m - 1, z = 7, Q = 0, ae = i.getMaskFunction(W), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (M[H][ne - we] == null) {
                  var $e = !1;
                  Q < F.length && ($e = (F[Q] >>> z & 1) == 1);
                  var re = ae(H, ne - we);
                  re && ($e = !$e), M[H][ne - we] = $e, z -= 1, z == -1 && (Q += 1, z = 7);
                }
              if (H += N, H < 0 || m <= H) {
                H -= N, N = -N;
                break;
              }
            }
        }, Tt = function(F, W) {
          for (var N = 0, H = 0, z = 0, Q = new Array(W.length), ae = new Array(W.length), ne = 0; ne < W.length; ne += 1) {
            var we = W[ne].dataCount, $e = W[ne].totalCount - we;
            H = Math.max(H, we), z = Math.max(z, $e), Q[ne] = new Array(we);
            for (var re = 0; re < Q[ne].length; re += 1)
              Q[ne][re] = 255 & F.getBuffer()[re + N];
            N += we;
            var De = i.getErrorCorrectPolynomial($e), Pe = u(Q[ne], De.getLength() - 1), Ha = Pe.mod(De);
            ae[ne] = new Array(De.getLength() - 1);
            for (var re = 0; re < ae[ne].length; re += 1) {
              var Ua = re + Ha.getLength() - ae[ne].length;
              ae[ne][re] = Ua >= 0 ? Ha.getAt(Ua) : 0;
            }
          }
          for (var za = 0, re = 0; re < W.length; re += 1)
            za += W[re].totalCount;
          for (var us = new Array(za), xn = 0, re = 0; re < H; re += 1)
            for (var ne = 0; ne < W.length; ne += 1)
              re < Q[ne].length && (us[xn] = Q[ne][re], xn += 1);
          for (var re = 0; re < z; re += 1)
            for (var ne = 0; ne < W.length; ne += 1)
              re < ae[ne].length && (us[xn] = ae[ne][re], xn += 1);
          return us;
        }, il = function(F, W, N) {
          for (var H = d.getRSBlocks(F, W), z = h(), Q = 0; Q < N.length; Q += 1) {
            var ae = N[Q];
            z.put(ae.getMode(), 4), z.put(ae.getLength(), i.getLengthInBits(ae.getMode(), F)), ae.write(z);
          }
          for (var ne = 0, Q = 0; Q < H.length; Q += 1)
            ne += H[Q].dataCount;
          if (z.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + z.getLengthInBits() + ">" + ne * 8 + ")";
          for (z.getLengthInBits() + 4 <= ne * 8 && z.put(0, 4); z.getLengthInBits() % 8 != 0; )
            z.putBit(!1);
          for (; !(z.getLengthInBits() >= ne * 8 || (z.put(v, 8), z.getLengthInBits() >= ne * 8)); )
            z.put(O, 8);
          return Tt(z, H);
        };
        D.addData = function(F, W) {
          W = W || "Byte";
          var N = null;
          switch (W) {
            case "Numeric":
              N = p(F);
              break;
            case "Alphanumeric":
              N = y(F);
              break;
            case "Byte":
              N = w(F);
              break;
            case "Kanji":
              N = $(F);
              break;
            default:
              throw "mode:" + W;
          }
          j.push(N), L = null;
        }, D.isDark = function(F, W) {
          if (F < 0 || m <= F || W < 0 || m <= W)
            throw F + "," + W;
          return M[F][W];
        }, D.getModuleCount = function() {
          return m;
        }, D.make = function() {
          if (x < 1) {
            for (var F = 1; F < 40; F++) {
              for (var W = d.getRSBlocks(F, C), N = h(), H = 0; H < j.length; H++) {
                var z = j[H];
                N.put(z.getMode(), 4), N.put(z.getLength(), i.getLengthInBits(z.getMode(), F)), z.write(N);
              }
              for (var Q = 0, H = 0; H < W.length; H++)
                Q += W[H].dataCount;
              if (N.getLengthInBits() <= Q * 8)
                break;
            }
            x = F;
          }
          Z(!1, ue());
        }, D.createTableTag = function(F, W) {
          F = F || 2, W = typeof W > "u" ? F * 4 : W;
          var N = "";
          N += '<table style="', N += " border-width: 0px; border-style: none;", N += " border-collapse: collapse;", N += " padding: 0px; margin: " + W + "px;", N += '">', N += "<tbody>";
          for (var H = 0; H < D.getModuleCount(); H += 1) {
            N += "<tr>";
            for (var z = 0; z < D.getModuleCount(); z += 1)
              N += '<td style="', N += " border-width: 0px; border-style: none;", N += " border-collapse: collapse;", N += " padding: 0px; margin: 0px;", N += " width: " + F + "px;", N += " height: " + F + "px;", N += " background-color: ", N += D.isDark(H, z) ? "#000000" : "#ffffff", N += ";", N += '"/>';
            N += "</tr>";
          }
          return N += "</tbody>", N += "</table>", N;
        }, D.createSvgTag = function(F, W, N, H) {
          var z = {};
          typeof arguments[0] == "object" && (z = arguments[0], F = z.cellSize, W = z.margin, N = z.alt, H = z.title), F = F || 2, W = typeof W > "u" ? F * 4 : W, N = typeof N == "string" ? { text: N } : N || {}, N.text = N.text || null, N.id = N.text ? N.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var Q = D.getModuleCount() * F + W * 2, ae, ne, we, $e, re = "", De;
          for (De = "l" + F + ",0 0," + F + " -" + F + ",0 0,-" + F + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += z.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', re += ' viewBox="0 0 ' + Q + " " + Q + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += H.text || N.text ? ' role="img" aria-labelledby="' + It([H.id, N.id].join(" ").trim()) + '"' : "", re += ">", re += H.text ? '<title id="' + It(H.id) + '">' + It(H.text) + "</title>" : "", re += N.text ? '<description id="' + It(N.id) + '">' + It(N.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', we = 0; we < D.getModuleCount(); we += 1)
            for ($e = we * F + W, ae = 0; ae < D.getModuleCount(); ae += 1)
              D.isDark(we, ae) && (ne = ae * F + W, re += "M" + ne + "," + $e + De);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, D.createDataURL = function(F, W) {
          F = F || 2, W = typeof W > "u" ? F * 4 : W;
          var N = D.getModuleCount() * F + W * 2, H = W, z = N - W;
          return _(N, N, function(Q, ae) {
            if (H <= Q && Q < z && H <= ae && ae < z) {
              var ne = Math.floor((Q - H) / F), we = Math.floor((ae - H) / F);
              return D.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, D.createImgTag = function(F, W, N) {
          F = F || 2, W = typeof W > "u" ? F * 4 : W;
          var H = D.getModuleCount() * F + W * 2, z = "";
          return z += "<img", z += ' src="', z += D.createDataURL(F, W), z += '"', z += ' width="', z += H, z += '"', z += ' height="', z += H, z += '"', N && (z += ' alt="', z += It(N), z += '"'), z += "/>", z;
        };
        var It = function(F) {
          for (var W = "", N = 0; N < F.length; N += 1) {
            var H = F.charAt(N);
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
        }, ll = function(F) {
          var W = 1;
          F = typeof F > "u" ? W * 2 : F;
          var N = D.getModuleCount() * W + F * 2, H = F, z = N - F, Q, ae, ne, we, $e, re = {
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
              $e = "█", H <= ae && ae < z && H <= Q && Q < z && D.isDark(ne, Math.floor((ae - H) / W)) && ($e = " "), H <= ae && ae < z && H <= Q + 1 && Q + 1 < z && D.isDark(we, Math.floor((ae - H) / W)) ? $e += " " : $e += "█", Pe += F < 1 && Q + 1 >= z ? De[$e] : re[$e];
            Pe += `
`;
          }
          return N % 2 && F > 0 ? Pe.substring(0, Pe.length - N - 1) + Array(N + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return D.createASCII = function(F, W) {
          if (F = F || 1, F < 2)
            return ll(W);
          F -= 1, W = typeof W > "u" ? F * 2 : W;
          var N = D.getModuleCount() * F + W * 2, H = W, z = N - W, Q, ae, ne, we, $e = Array(F + 1).join("██"), re = Array(F + 1).join("  "), De = "", Pe = "";
          for (Q = 0; Q < N; Q += 1) {
            for (ne = Math.floor((Q - H) / F), Pe = "", ae = 0; ae < N; ae += 1)
              we = 1, H <= ae && ae < z && H <= Q && Q < z && D.isDark(ne, Math.floor((ae - H) / F)) && (we = 0), Pe += we ? $e : re;
            for (ne = 0; ne < F; ne += 1)
              De += Pe + `
`;
          }
          return De.substring(0, De.length - 1);
        }, D.renderTo2dContext = function(F, W) {
          W = W || 2;
          for (var N = D.getModuleCount(), H = 0; H < N; H++)
            for (var z = 0; z < N; z++)
              F.fillStyle = D.isDark(H, z) ? "black" : "white", F.fillRect(H * W, z * W, W, W);
        }, D;
      };
      s.stringToBytesFuncs = {
        default: function(k) {
          for (var E = [], v = 0; v < k.length; v += 1) {
            var O = k.charCodeAt(v);
            E.push(O & 255);
          }
          return E;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(k, E) {
        var v = (function() {
          for (var x = q(k), C = function() {
            var le = x.read();
            if (le == -1) throw "eof";
            return le;
          }, M = 0, m = {}; ; ) {
            var L = x.read();
            if (L == -1) break;
            var j = C(), D = C(), Z = C(), G = String.fromCharCode(L << 8 | j), ue = D << 8 | Z;
            m[G] = ue, M += 1;
          }
          if (M != E)
            throw M + " != " + E;
          return m;
        })(), O = 63;
        return function(x) {
          for (var C = [], M = 0; M < x.length; M += 1) {
            var m = x.charCodeAt(M);
            if (m < 128)
              C.push(m);
            else {
              var L = v[x.charAt(M)];
              typeof L == "number" ? (L & 255) == L ? C.push(L) : (C.push(L >>> 8), C.push(L & 255)) : C.push(O);
            }
          }
          return C;
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
        var k = [
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
        ], E = 1335, v = 7973, O = 21522, x = {}, C = function(M) {
          for (var m = 0; M != 0; )
            m += 1, M >>>= 1;
          return m;
        };
        return x.getBCHTypeInfo = function(M) {
          for (var m = M << 10; C(m) - C(E) >= 0; )
            m ^= E << C(m) - C(E);
          return (M << 10 | m) ^ O;
        }, x.getBCHTypeNumber = function(M) {
          for (var m = M << 12; C(m) - C(v) >= 0; )
            m ^= v << C(m) - C(v);
          return M << 12 | m;
        }, x.getPatternPosition = function(M) {
          return k[M - 1];
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
              for (var Z = 0, G = M.isDark(j, D), ue = -1; ue <= 1; ue += 1)
                if (!(j + ue < 0 || m <= j + ue))
                  for (var le = -1; le <= 1; le += 1)
                    D + le < 0 || m <= D + le || ue == 0 && le == 0 || G == M.isDark(j + ue, D + le) && (Z += 1);
              Z > 5 && (L += 3 + Z - 5);
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
        for (var k = new Array(256), E = new Array(256), v = 0; v < 8; v += 1)
          k[v] = 1 << v;
        for (var v = 8; v < 256; v += 1)
          k[v] = k[v - 4] ^ k[v - 5] ^ k[v - 6] ^ k[v - 8];
        for (var v = 0; v < 255; v += 1)
          E[k[v]] = v;
        var O = {};
        return O.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return E[x];
        }, O.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return k[x];
        }, O;
      })();
      function u(k, E) {
        if (typeof k.length > "u")
          throw k.length + "/" + E;
        var v = (function() {
          for (var x = 0; x < k.length && k[x] == 0; )
            x += 1;
          for (var C = new Array(k.length - x + E), M = 0; M < k.length - x; M += 1)
            C[M] = k[M + x];
          return C;
        })(), O = {};
        return O.getAt = function(x) {
          return v[x];
        }, O.getLength = function() {
          return v.length;
        }, O.multiply = function(x) {
          for (var C = new Array(O.getLength() + x.getLength() - 1), M = 0; M < O.getLength(); M += 1)
            for (var m = 0; m < x.getLength(); m += 1)
              C[M + m] ^= l.gexp(l.glog(O.getAt(M)) + l.glog(x.getAt(m)));
          return u(C, 0);
        }, O.mod = function(x) {
          if (O.getLength() - x.getLength() < 0)
            return O;
          for (var C = l.glog(O.getAt(0)) - l.glog(x.getAt(0)), M = new Array(O.getLength()), m = 0; m < O.getLength(); m += 1)
            M[m] = O.getAt(m);
          for (var m = 0; m < x.getLength(); m += 1)
            M[m] ^= l.gexp(l.glog(x.getAt(m)) + C);
          return u(M, 0).mod(x);
        }, O;
      }
      var d = (function() {
        var k = [
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
        ], E = function(x, C) {
          var M = {};
          return M.totalCount = x, M.dataCount = C, M;
        }, v = {}, O = function(x, C) {
          switch (C) {
            case o.L:
              return k[(x - 1) * 4 + 0];
            case o.M:
              return k[(x - 1) * 4 + 1];
            case o.Q:
              return k[(x - 1) * 4 + 2];
            case o.H:
              return k[(x - 1) * 4 + 3];
            default:
              return;
          }
        };
        return v.getRSBlocks = function(x, C) {
          var M = O(x, C);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + C;
          for (var m = M.length / 3, L = [], j = 0; j < m; j += 1)
            for (var D = M[j * 3 + 0], Z = M[j * 3 + 1], G = M[j * 3 + 2], ue = 0; ue < D; ue += 1)
              L.push(E(Z, G));
          return L;
        }, v;
      })(), h = function() {
        var k = [], E = 0, v = {};
        return v.getBuffer = function() {
          return k;
        }, v.getAt = function(O) {
          var x = Math.floor(O / 8);
          return (k[x] >>> 7 - O % 8 & 1) == 1;
        }, v.put = function(O, x) {
          for (var C = 0; C < x; C += 1)
            v.putBit((O >>> x - C - 1 & 1) == 1);
        }, v.getLengthInBits = function() {
          return E;
        }, v.putBit = function(O) {
          var x = Math.floor(E / 8);
          k.length <= x && k.push(0), O && (k[x] |= 128 >>> E % 8), E += 1;
        }, v;
      }, p = function(k) {
        var E = a.MODE_NUMBER, v = k, O = {};
        O.getMode = function() {
          return E;
        }, O.getLength = function(M) {
          return v.length;
        }, O.write = function(M) {
          for (var m = v, L = 0; L + 2 < m.length; )
            M.put(x(m.substring(L, L + 3)), 10), L += 3;
          L < m.length && (m.length - L == 1 ? M.put(x(m.substring(L, L + 1)), 4) : m.length - L == 2 && M.put(x(m.substring(L, L + 2)), 7));
        };
        var x = function(M) {
          for (var m = 0, L = 0; L < M.length; L += 1)
            m = m * 10 + C(M.charAt(L));
          return m;
        }, C = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return O;
      }, y = function(k) {
        var E = a.MODE_ALPHA_NUM, v = k, O = {};
        O.getMode = function() {
          return E;
        }, O.getLength = function(C) {
          return v.length;
        }, O.write = function(C) {
          for (var M = v, m = 0; m + 1 < M.length; )
            C.put(
              x(M.charAt(m)) * 45 + x(M.charAt(m + 1)),
              11
            ), m += 2;
          m < M.length && C.put(x(M.charAt(m)), 6);
        };
        var x = function(C) {
          if ("0" <= C && C <= "9")
            return C.charCodeAt(0) - 48;
          if ("A" <= C && C <= "Z")
            return C.charCodeAt(0) - 65 + 10;
          switch (C) {
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
              throw "illegal char :" + C;
          }
        };
        return O;
      }, w = function(k) {
        var E = a.MODE_8BIT_BYTE, v = s.stringToBytes(k), O = {};
        return O.getMode = function() {
          return E;
        }, O.getLength = function(x) {
          return v.length;
        }, O.write = function(x) {
          for (var C = 0; C < v.length; C += 1)
            x.put(v[C], 8);
        }, O;
      }, $ = function(k) {
        var E = a.MODE_KANJI, v = s.stringToBytesFuncs.SJIS;
        if (!v)
          throw "sjis not supported.";
        (function(C, M) {
          var m = v(C);
          if (m.length != 2 || (m[0] << 8 | m[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var O = v(k), x = {};
        return x.getMode = function() {
          return E;
        }, x.getLength = function(C) {
          return ~~(O.length / 2);
        }, x.write = function(C) {
          for (var M = O, m = 0; m + 1 < M.length; ) {
            var L = (255 & M[m]) << 8 | 255 & M[m + 1];
            if (33088 <= L && L <= 40956)
              L -= 33088;
            else if (57408 <= L && L <= 60351)
              L -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + L;
            L = (L >>> 8 & 255) * 192 + (L & 255), C.put(L, 13), m += 2;
          }
          if (m < M.length)
            throw "illegal char at " + (m + 1);
        }, x;
      }, S = function() {
        var k = [], E = {};
        return E.writeByte = function(v) {
          k.push(v & 255);
        }, E.writeShort = function(v) {
          E.writeByte(v), E.writeByte(v >>> 8);
        }, E.writeBytes = function(v, O, x) {
          O = O || 0, x = x || v.length;
          for (var C = 0; C < x; C += 1)
            E.writeByte(v[C + O]);
        }, E.writeString = function(v) {
          for (var O = 0; O < v.length; O += 1)
            E.writeByte(v.charCodeAt(O));
        }, E.toByteArray = function() {
          return k;
        }, E.toString = function() {
          var v = "";
          v += "[";
          for (var O = 0; O < k.length; O += 1)
            O > 0 && (v += ","), v += k[O];
          return v += "]", v;
        }, E;
      }, I = function() {
        var k = 0, E = 0, v = 0, O = "", x = {}, C = function(m) {
          O += String.fromCharCode(M(m & 63));
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
          for (k = k << 8 | m & 255, E += 8, v += 1; E >= 6; )
            C(k >>> E - 6), E -= 6;
        }, x.flush = function() {
          if (E > 0 && (C(k << 6 - E), k = 0, E = 0), v % 3 != 0)
            for (var m = 3 - v % 3, L = 0; L < m; L += 1)
              O += "=";
        }, x.toString = function() {
          return O;
        }, x;
      }, q = function(k) {
        var E = k, v = 0, O = 0, x = 0, C = {};
        C.read = function() {
          for (; x < 8; ) {
            if (v >= E.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var m = E.charAt(v);
            if (v += 1, m == "=")
              return x = 0, -1;
            if (m.match(/^\s$/))
              continue;
            O = O << 6 | M(m.charCodeAt(0)), x += 6;
          }
          var L = O >>> x - 8 & 255;
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
        return C;
      }, X = function(k, E) {
        var v = k, O = E, x = new Array(k * E), C = {};
        C.setPixel = function(j, D, Z) {
          x[D * v + j] = Z;
        }, C.write = function(j) {
          j.writeString("GIF87a"), j.writeShort(v), j.writeShort(O), j.writeByte(128), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(255), j.writeByte(255), j.writeByte(255), j.writeString(","), j.writeShort(0), j.writeShort(0), j.writeShort(v), j.writeShort(O), j.writeByte(0);
          var D = 2, Z = m(D);
          j.writeByte(D);
          for (var G = 0; Z.length - G > 255; )
            j.writeByte(255), j.writeBytes(Z, G, 255), G += 255;
          j.writeByte(Z.length - G), j.writeBytes(Z, G, Z.length - G), j.writeByte(0), j.writeString(";");
        };
        var M = function(j) {
          var D = j, Z = 0, G = 0, ue = {};
          return ue.write = function(le, ke) {
            if (le >>> ke)
              throw "length over";
            for (; Z + ke >= 8; )
              D.writeByte(255 & (le << Z | G)), ke -= 8 - Z, le >>>= 8 - Z, G = 0, Z = 0;
            G = le << Z | G, Z = Z + ke;
          }, ue.flush = function() {
            Z > 0 && D.writeByte(G);
          }, ue;
        }, m = function(j) {
          for (var D = 1 << j, Z = (1 << j) + 1, G = j + 1, ue = L(), le = 0; le < D; le += 1)
            ue.add(String.fromCharCode(le));
          ue.add(String.fromCharCode(D)), ue.add(String.fromCharCode(Z));
          var ke = S(), Re = M(ke);
          Re.write(D, G);
          var Ge = 0, Ke = String.fromCharCode(x[Ge]);
          for (Ge += 1; Ge < x.length; ) {
            var Tt = String.fromCharCode(x[Ge]);
            Ge += 1, ue.contains(Ke + Tt) ? Ke = Ke + Tt : (Re.write(ue.indexOf(Ke), G), ue.size() < 4095 && (ue.size() == 1 << G && (G += 1), ue.add(Ke + Tt)), Ke = Tt);
          }
          return Re.write(ue.indexOf(Ke), G), Re.write(Z, G), Re.flush(), ke.toByteArray();
        }, L = function() {
          var j = {}, D = 0, Z = {};
          return Z.add = function(G) {
            if (Z.contains(G))
              throw "dup key:" + G;
            j[G] = D, D += 1;
          }, Z.size = function() {
            return D;
          }, Z.indexOf = function(G) {
            return j[G];
          }, Z.contains = function(G) {
            return typeof j[G] < "u";
          }, Z;
        };
        return C;
      }, _ = function(k, E, v) {
        for (var O = X(k, E), x = 0; x < E; x += 1)
          for (var C = 0; C < k; C += 1)
            O.setPixel(C, x, v(C, x));
        var M = S();
        O.write(M);
        for (var m = I(), L = M.toByteArray(), j = 0; j < L.length; j += 1)
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
  })(js)), js.exports;
}
var o5 = a5();
const r5 = /* @__PURE__ */ s5(o5), i5 = ["width", "height", "viewBox"], l5 = ["width", "height"], c5 = ["d"], u5 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const s = r5(0, "M");
      s.addData(t.text), s.make();
      const a = s.getModuleCount(), o = [];
      for (let r = 0; r < a; r += 1)
        for (let i = 0; i < a; i += 1)
          s.isDark(r, i) && o.push(`M${i + 4} ${r + 4}h1v1h-1z`);
      return { count: a + 8, path: o.join("") };
    });
    return (s, a) => (c(), f("svg", {
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
      }, null, 8, l5),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, c5)
    ], 8, i5));
  }
}, j$ = /* @__PURE__ */ Y(u5, [["__scopeId", "data-v-489f0852"]]), d5 = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), f("div", {
      class: "window-room",
      "data-window-room": "",
      style: me({ padding: e.padding })
    }, [
      ce(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, q$ = /* @__PURE__ */ Y(d5, [["__scopeId", "data-v-47e67f04"]]), F$ = wl(() => import("./VoiceFigure-D2vExBk-.js").then((e) => e.V)), W$ = "1.1.0", H$ = "3.5";
export {
  Yu as $,
  Me as A,
  Ce as B,
  Zx as C,
  os as D,
  ot as E,
  Yx as F,
  Ck as G,
  j4 as H,
  zx as I,
  Nk as J,
  Ot as K,
  ck as L,
  Da as M,
  Wk as N,
  Lk as O,
  as as P,
  dx as Q,
  y4 as R,
  Dn as S,
  gx as T,
  u4 as U,
  Se as V,
  Hn as W,
  c4 as X,
  l4 as Y,
  Ku as Z,
  Y as _,
  e4 as a,
  Rx as a$,
  qk as a0,
  k4 as a1,
  w4 as a2,
  Ae as a3,
  T4 as a4,
  O4 as a5,
  St as a6,
  b4 as a7,
  H4 as a8,
  H5 as a9,
  Sx as aA,
  lx as aB,
  Xy as aC,
  G4 as aD,
  K4 as aE,
  Jx as aF,
  Wi as aG,
  px as aH,
  yn as aI,
  Y5 as aJ,
  V5 as aK,
  jx as aL,
  kn as aM,
  Hx as aN,
  P4 as aO,
  cx as aP,
  ux as aQ,
  ix as aR,
  ln as aS,
  xt as aT,
  U5 as aU,
  Wv as aV,
  ox as aW,
  g4 as aX,
  qi as aY,
  jt as aZ,
  Ut as a_,
  Bx as aa,
  Fx as ab,
  X5 as ac,
  d4 as ad,
  f4 as ae,
  A4 as af,
  C4 as ag,
  I4 as ah,
  a4 as ai,
  Ho as aj,
  x4 as ak,
  W4 as al,
  e$ as am,
  tx as an,
  Q4 as ao,
  X4 as ap,
  R4 as aq,
  _4 as ar,
  S4 as as,
  E4 as at,
  mx as au,
  F4 as av,
  U4 as aw,
  s$ as ax,
  Xt as ay,
  z4 as az,
  Qk as b,
  n$ as b$,
  Sk as b0,
  Wx as b1,
  kx as b2,
  yx as b3,
  fy as b4,
  Ei as b5,
  Ox as b6,
  q4 as b7,
  ls as b8,
  ct as b9,
  bx as bA,
  Ex as bB,
  ht as bC,
  vx as bD,
  Ax as bE,
  V4 as bF,
  nx as bG,
  Y4 as bH,
  Oe as bI,
  D4 as bJ,
  Cx as bK,
  d$ as bL,
  f$ as bM,
  F5 as bN,
  zv as bO,
  L4 as bP,
  xx as bQ,
  t4 as bR,
  Qx as bS,
  wx as bT,
  $x as bU,
  Mx as bV,
  B4 as bW,
  Qy as bX,
  N4 as bY,
  Z4 as bZ,
  Xx as b_,
  _x as ba,
  Es as bb,
  Br as bc,
  o$ as bd,
  l$ as be,
  hx as bf,
  Px as bg,
  W5 as bh,
  ex as bi,
  r$ as bj,
  $4 as bk,
  M4 as bl,
  r4 as bm,
  v4 as bn,
  K5 as bo,
  Nx as bp,
  n4 as bq,
  s4 as br,
  i4 as bs,
  ax as bt,
  Dv as bu,
  Ux as bv,
  Bk as bw,
  o4 as bx,
  J5 as by,
  sx as bz,
  Ve as c,
  ec as c$,
  G5 as c0,
  z5 as c1,
  J4 as c2,
  c$ as c3,
  Wa as c4,
  u$ as c5,
  sl as c6,
  Dx as c7,
  m4 as c8,
  h4 as c9,
  E$ as cA,
  W$ as cB,
  H$ as cC,
  C5 as cD,
  C$ as cE,
  sa as cF,
  N5 as cG,
  _0 as cH,
  Mt as cI,
  fa as cJ,
  Jn as cK,
  S5 as cL,
  O5 as cM,
  Fl as cN,
  Fg as cO,
  N$ as cP,
  E5 as cQ,
  j$ as cR,
  M$ as cS,
  od as cT,
  v5 as cU,
  P5 as cV,
  Yw as cW,
  Zn as cX,
  T5 as cY,
  Et as cZ,
  kp as c_,
  Fv as ca,
  Z5 as cb,
  Ik as cc,
  rx as cd,
  Ba as ce,
  Gy as cf,
  fx as cg,
  Qt as ch,
  Dt as ci,
  b5 as cj,
  _$ as ck,
  he as cl,
  Iu as cm,
  ju as cn,
  Qn as co,
  $5 as cp,
  kr as cq,
  D$ as cr,
  q5 as cs,
  zp as ct,
  jn as cu,
  h$ as cv,
  h5 as cw,
  Pt as cx,
  lu as cy,
  ve as cz,
  dy as d,
  x$ as d$,
  B5 as d0,
  y5 as d1,
  Wt as d2,
  A$ as d3,
  P$ as d4,
  rl as d5,
  uu as d6,
  dt as d7,
  I5 as d8,
  cs as d9,
  k5 as dA,
  A5 as dB,
  y$ as dC,
  w$ as dD,
  Fe as dE,
  M5 as dF,
  _5 as dG,
  v$ as dH,
  g5 as dI,
  m5 as dJ,
  qc as dK,
  dr as dL,
  Fc as dM,
  w5 as dN,
  et as dO,
  kw as dP,
  R5 as dQ,
  g$ as dR,
  S$ as dS,
  gw as dT,
  O$ as dU,
  _g as dV,
  sr as dW,
  a2 as dX,
  ki as dY,
  b$ as dZ,
  na as d_,
  F$ as da,
  q$ as db,
  ui as dc,
  k$ as dd,
  ka as de,
  Bm as df,
  Qa as dg,
  li as dh,
  jc as di,
  B$ as dj,
  R$ as dk,
  wa as dl,
  Pc as dm,
  x5 as dn,
  L$ as dp,
  j5 as dq,
  D5 as dr,
  L5 as ds,
  p$ as dt,
  $h as du,
  m$ as dv,
  p5 as dw,
  T$ as dx,
  k0 as dy,
  yw as dz,
  We as e,
  $$ as e0,
  At as e1,
  I$ as e2,
  Nv as f,
  p4 as g,
  a$ as h,
  cn as i,
  Vx as j,
  i$ as k,
  Lx as l,
  Gx as m,
  aw as n,
  qx as o,
  Q5 as p,
  Pa as q,
  tl as r,
  nl as s,
  Le as t,
  Kx as u,
  my as v,
  t$ as w,
  Tx as x,
  Ix as y,
  bn as z
};
