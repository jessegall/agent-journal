/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, normalizeStyle as fe, unref as q, renderSlot as ce, createElementVNode as g, normalizeClass as X, Fragment as K, renderList as te, defineComponent as Ul, Comment as zl, h as Hn, cloneVNode as Vl, createBlock as W, withCtx as D, createVNode as L, toDisplayString as w, createCommentVNode as C, inject as $e, useAttrs as Un, computed as B, ref as I, resolveDynamicComponent as kt, mergeProps as Ye, onUnmounted as Re, onMounted as Oe, Teleport as as, useId as ss, resolveDirective as Gl, withDirectives as Je, createTextVNode as ne, reactive as os, shallowRef as ze, watch as he, nextTick as it, Transition as Lt, withModifiers as we, TransitionGroup as qo, shallowReactive as Kl, isRef as Os, onBeforeUnmount as xt, resolveComponent as Yl, useModel as Ra, getCurrentInstance as Jl, mergeModels as Ba, getCurrentScope as Fo, onScopeDispose as Wo, provide as Zl, onErrorCaptured as Xl, toHandlers as Ql, createSlots as ei, vShow as Ho, useSlots as ti, withKeys as Yt, vModelText as Ia, defineAsyncComponent as ni } from "vue";
function Uo(e, t = performance.now()) {
  return { "--shimmer-ms": `${e}ms`, animationDelay: `${-(t % e)}ms` };
}
const J = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, ai = 1600, si = {
  __name: "Shimmer",
  setup(e) {
    const t = Uo(ai);
    return (n, a) => (c(), h("span", {
      class: "shimmer",
      style: fe(q(t))
    }, null, 4));
  }
}, Ht = /* @__PURE__ */ J(si, [["__scopeId", "data-v-6c018b03"]]), oi = { class: "skeleton-line" }, ri = 2e3, li = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    const t = Uo(ri);
    return (n, a) => (c(), h("span", oi, [
      ce(n.$slots, "default", {}, void 0, !0),
      g("span", {
        class: X(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(K, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: X(["bar", { still: e.still }]),
          style: fe({ ...q(t), width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ut = /* @__PURE__ */ J(li, [["__scopeId", "data-v-484fe8a0"]]), Nt = Ul({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== zl);
      return a.length !== 1 ? Hn(K, { key: n }, a) : a[0].key == null ? Vl(a[0], { key: n }) : a[0];
    };
  }
}), ii = ["aria-label"], ci = ["aria-label"], ui = ["aria-label"], di = ["aria-label"], fi = ["aria-label"], hi = ["aria-label"], mi = ["aria-label"], pi = {
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
          (c(), h(K, null, te(t, (d) => L(Ht, {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"])), 64))
        ], 8, ii)
      ]),
      older: D(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(t.slice(0, 3), (d) => (c(), W(Ht, {
            key: d.id,
            class: X(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 8, ["class", "style"]))), 128))
        ], 8, ci)
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
            (c(), h(K, null, te(n, (f) => L(ut, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ui)
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
            L(ut, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(K, null, te(s, (f) => L(ut, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, di)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          L(ut, {
            class: "skeleton-heading",
            bars: l
          }),
          (c(!0), h(K, null, te(e.count, (d) => (c(), W(ut, {
            key: d,
            bars: q(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, fi)
      ]),
      text: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), W(ut, {
            key: d,
            bars: q(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, hi)
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
        ], 8, mi)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, $t = /* @__PURE__ */ J(pi, [["__scopeId", "data-v-ef519c5f"]]), gi = {
  key: 1,
  class: "empty-state titled"
}, vi = { class: "empty-state-title" }, yi = { class: "empty-state-text" }, wi = {
  key: 2,
  class: "empty-state"
}, bi = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), W($t, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", gi, [
      g("p", vi, w(e.title), 1),
      g("p", yi, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", wi, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Jt = /* @__PURE__ */ J(bi, [["__scopeId", "data-v-b27e89b0"]]), ki = { class: "fold-group" }, xi = ["aria-expanded"], $i = { class: "fold-label" }, Mi = {
  key: 0,
  class: "fold-count"
}, Si = {
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
    return (a, s) => (c(), h("div", ki, [
      g("button", {
        type: "button",
        class: X(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", $i, w(e.label), 1),
        e.count !== "" ? (c(), h("span", Mi, w(e.count), 1)) : C("", !0),
        g("span", {
          class: X(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, xi),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, L2 = /* @__PURE__ */ J(Si, [["__scopeId", "data-v-9ef1865c"]]), _i = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function ct() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Ei = ["stroke-width", "innerHTML"], me = {
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
    }, null, 12, Ei));
  }
}, Ai = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Ci = /* @__PURE__ */ J(Ai, [["__scopeId", "data-v-eb453d6f"]]), Oi = 120, Ti = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Un(), a = B(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = I(!1), o = B(() => t.busy || s.value), r = $e(Se, null), l = B(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((m) => m(u)).filter((m) => m instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, Oi);
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
        o.value ? (c(), W(Ci, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ J(Ti, [["__scopeId", "data-v-13c30dc0"]]), Ri = (e, t, n) => Math.max(t, Math.min(n, e)), Bi = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, zo = /* @__PURE__ */ new WeakMap(), Ii = (e, t) => zo.set(e, t);
function Li(e, t) {
  for (let n = t; n; n = zo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Vo(e, t) {
  const n = (a) => {
    var o, r;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    s && !Li(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const At = 8, Ni = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
      const p = i.value, _ = y(p), E = v(_, p), { w: $, h: V } = l.value, Z = a.align === "auto" ? p.left + p.right > _.left + _.right : a.align === "right", Y = Ri(Z ? p.right - $ : p.left, _.left + At, Math.max(_.left + At, _.right - $ - At)), ve = V > E.below && E.above > E.below ? { bottom: `${window.innerHeight - p.top + a.gap}px`, maxHeight: m(a.maxHeight, E.above) } : { top: `${p.bottom + a.gap}px`, maxHeight: m(a.maxHeight, E.below) };
      return { ...r.value, ...ve, left: `${Y}px`, maxWidth: m(a.maxWidth, E.across) };
    }), b = n, N = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function z(p) {
      const _ = N(), E = _.indexOf(document.activeElement);
      _[(E + p + _.length) % _.length].focus();
    }
    const ee = { ArrowDown: () => z(1), ArrowUp: () => z(-1), Escape: () => b("close") }, j = (p) => ee[p.key] && (p.preventDefault(), ee[p.key]()), M = () => s.value && (l.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let S = 0;
    const R = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(M);
    });
    Vo(s, (p) => a.anchor && !a.anchor.contains(p.target) && b("close"));
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
      a.anchor && s.value && Ii(s.value, a.anchor), M(), s.value && R.observe(s.value), !a.plain && N()[0] && N()[0].focus(), k();
    }), Re(() => {
      R.disconnect(), cancelAnimationFrame(T), cancelAnimationFrame(S);
    }), t({ element: s }), (p, _) => (c(), W(as, {
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
}), zn = /* @__PURE__ */ J(Ni, [["__scopeId", "data-v-3d203970"]]), Di = { class: "split-button" }, Pi = {
  __name: "SplitButton",
  props: { variant: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = I(null), s = I(!1), o = () => s.value = !1;
    return (r, l) => (c(), h("span", Di, [
      L(ue, {
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
        L(ue, {
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
            L(me, { name: "caret" })
          ]),
          _: 1
        }, 8, ["variant", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), W(zn, {
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
}, ji = /* @__PURE__ */ J(Pi, [["__scopeId", "data-v-c258494d"]]), qi = ["aria-checked", "aria-haspopup", "onClick"], Fi = {
  key: 0,
  class: "segmented-dot"
}, Wi = {
  key: 1,
  class: "segmented-note"
}, Hi = {
  key: 2,
  class: "segmented-count"
}, Ui = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = ss();
    return (s, o) => {
      const r = Gl("tip");
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
          l.dot ? (c(), h("span", Fi)) : C("", !0),
          ne(" " + w(l.label) + " ", 1),
          l.note ? (c(), h("small", Wi, w(l.note), 1)) : C("", !0),
          l.count !== void 0 ? (c(), h("em", Hi, w(l.count), 1)) : C("", !0)
        ], 10, qi)), [
          [r, l.tip || l.title, `${q(a)}-${l.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Vn = /* @__PURE__ */ J(Ui, [["__scopeId", "data-v-c89bc92d"]]), Go = typeof document < "u" && document.documentElement.classList.contains("phone");
function zi() {
  return () => {
  };
}
function La(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Ko(e = window) {
  if (!La(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    La(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Na = "journal.stale-build-reload", Vi = 'script[type="module"][src*="/assets/index-"]', Ts = (e) => {
  var t;
  return ((t = e.querySelector(Vi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Gi(e = document, t = (a, s) => Ae.quietRead(a, s), n = () => Ko(window)) {
  const a = Ts(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = Ts(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let na = "";
function Ki(e, t = () => Ko(window)) {
  if (!e) return !1;
  const n = !!na && na !== e;
  return na = e, n && t(), n;
}
const Yi = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Ji(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Na) === e.message) return !1;
    t.setItem(Na, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Zi(e = window.sessionStorage) {
  try {
    e.removeItem(Na);
  } catch {
    return;
  }
}
const Xi = 2e3, Qi = 3e4, De = os({ starting: !1, external: !1, late: !1, offline: !1 }), Yo = () => De.starting, ec = 3;
let hn = 0, Da = 0, Jo = 0, Zo = [];
async function tc() {
  try {
    const e = await Ae.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: De.external };
  }
}
let Rs = null;
const nc = () => Rs ?? (Rs = tc().finally(() => Rs = null));
function ac() {
  clearTimeout(Da), clearTimeout(Jo), Da = 0, Object.assign(De, { starting: !1, external: !1, late: !1, offline: !1 }), Zo.splice(0).forEach((e) => e()), Gi();
}
async function sc() {
  De.offline = !navigator.onLine;
  const e = await nc();
  if (De.external = e.updating, hn = !e.restarting && !e.updating && e.reachable ? hn + 1 : 0, hn < ec) return;
  hn = 0, (!Ki(e.started_at) || La()) && ac();
}
function Xo() {
  Da = setTimeout(async () => {
    await sc(), De.starting && Xo();
  }, Xi);
}
function oc() {
  De.starting || (De.starting = !0, De.offline = !navigator.onLine, Xo(), Jo = setTimeout(() => De.late = !0, Qi));
}
const rc = () => De.starting ? new Promise((e) => Zo.push(e)) : Promise.resolve();
function Qo(e, t) {
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
function lc(e) {
  const t = { id: crypto.randomUUID(), trailingOf: e, askers: 0, callers: 0, stop: new AbortController() };
  return t.answer = new Promise((n) => t.resolve = n), t;
}
class ic {
  constructor(t, n, a = () => {
  }) {
    this.read = t, this.ended = n, this.tracked = a, this.flying = null, this.following = null, this.outdated = !1, this.ask = Qo(() => this.leave(), 0);
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
    const a = this.flying && !this.outdated ? this.flying : this.following ?? (this.following = lc(this.outdated ? ((o = this.flying) == null ? void 0 : o.id) ?? "" : ""));
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
const Xe = "viewer.shell", mn = 2e4, cc = 4, Bs = "/api/read-lines", uc = 5e3, dc = 403, Is = "/api/repeated-lines", fc = 10, hc = 2e3, mc = 3e5, N2 = 6e5, pn = 6, pc = 500, gc = "/journal/summary", Ls = "/api/server-state", vc = 2e4, gn = Go ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, yc = (e) => e.split("?")[0].endsWith(gc), Pa = (e, t) => Object.assign(new Error(t), { status: e });
async function wc(e, t, n = Pa) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const bc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e), kc = (e, t) => AbortSignal.any([AbortSignal.timeout(t), ...e ? [e] : []]), Ns = (e) => e.split(" ").slice(0, 2).join(" "), tt = "read", Ot = "write", xc = "stream";
class $c {
  constructor() {
    this.joinedReads = /* @__PURE__ */ new Map(), this.flights = /* @__PURE__ */ new Set(), this.lineCounts = /* @__PURE__ */ new Map(), this.httpCounts = /* @__PURE__ */ new Map(), this.httpRequests = 0, this.joinCounts = /* @__PURE__ */ new Map(), this.clientId = crypto.randomUUID(), this.recording = !1, this.readReceipts = [], this.receiptTimer = null, this.receiptSending = Promise.resolve(), this.receiptFailures = 0, this.recentLines = /* @__PURE__ */ new Map(), this.reportedLines = /* @__PURE__ */ new Set(), this.readsFlying = 0, this.readsWaiting = [], this.readLines = null, this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = pn;
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
    const a = this.lineCounts.get(t) ?? /* @__PURE__ */ new Map(), s = Ns(n);
    a.set(s, (a.get(s) ?? 0) + 1), this.lineCounts.set(t, a), this.noticeRepeatedLines(t, s, n);
  }
  // a window that sends one noun and verb for many ids in a short time should read them in one line: it is a fault of the window, told to the developer once
  noticeRepeatedLines(t, n, a) {
    const s = `${t} ${n}`, o = Date.now(), r = new Map([...this.recentLines.get(s) ?? []].filter(([, i]) => o - i < hc));
    if (r.set(a, o), this.recentLines.set(s, r), r.size < fc || this.reportedLines.has(s)) return;
    this.reportedLines.add(s);
    const l = JSON.stringify({ window: t, line: n, count: r.size });
    this.out(Is, { method: "POST", headers: { ...gn, "Content-Type": "application/json" }, body: l }, [{ window: Xe, line: Is, kind: Ot }]).catch(() => {
    });
  }
  // the one place a request leaves
  async out(t, n, a, s = 0) {
    const o = this.took(a, t), r = s ? { ...n, signal: kc(n.signal, s) } : n;
    try {
      return await fetch(t, a[0].kind === Ot ? { ...r, priority: "high" } : r);
    } finally {
      o();
    }
  }
  // a request that fails to reach the server puts the cover up
  async sent(t, n, a, s = mn) {
    try {
      return await this.out(t, n, a, s);
    } catch (o) {
      throw o instanceof TypeError && oc(), o;
    }
  }
  // a read waits here for a free place, not in the browser, so the reads asked meanwhile can still go together and a write passes them all
  async whenFree(t) {
    this.readsFlying >= cc ? await new Promise((n) => this.readsWaiting.push(n)) : this.readsFlying += 1;
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
    return this.out(Bs, { headers: gn }, [{ window: Xe, line: Bs, kind: tt }], uc).then(async (t) => {
      if (t.status === dc) return /* @__PURE__ */ new Set();
      if (!t.ok) throw Pa(t.status, "The read lines did not answer");
      const n = await t.json();
      return this.recording = n.recording === !0, new Set(n.reads);
    }).catch(() => (this.readLines = null, /* @__PURE__ */ new Set()));
  }
  // the same read joins the one in flight, whichever part of the viewer asks: see JoinedRead
  joined(t, n, a = void 0, s = null) {
    const o = this.joinedReads.get(t) ?? new ic(
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
    const o = this.joinCounts.get(t) ?? /* @__PURE__ */ new Map(), r = Ns(n.join(" ")), l = o.get(r) ?? { joined_callers: 0, trailing_reads: 0 };
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
      this.tries = pn;
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
    const l = a instanceof FormData, i = { method: t, headers: { ...gn, ...r, ...a === void 0 || l ? {} : { "Content-Type": "application/json" } }, body: bc(a) }, u = s || (l ? mc : mn);
    try {
      return t === "GET" ? await this.whenFree(() => this.sent(n, i, [{ window: Xe, line: n, kind: tt }], u)) : await this.sent(n, i, [{ window: Xe, line: n, kind: Ot }], u);
    } catch (d) {
      if (t !== "GET" || !(d instanceof TypeError) || o <= 1) throw d;
      return await new Promise((f) => setTimeout(f, pc)), this.reach(t, n, a, s, o - 1, r);
    }
  }
  async send(t, n, a, s = 0, o = pn, r = {}) {
    this.watcher("sent", t, n, a);
    const l = t === "GET" ? () => {
    } : zi(), i = await this.reach(t, n, a, s, o, r).finally(() => {
      l(), this.watcher("answered", t, n, a);
    });
    return wc(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a read whose failure says nothing about the server, so it puts no cover up
  quietRead(t, n = {}) {
    return this.whenFree(() => this.out(t, n, [{ window: Xe, line: t, kind: tt }], mn));
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await this.quietRead(t, { headers: gn });
    if (!n.ok) throw Pa(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, r = n.split("?")[0]) {
    return t !== "GET" ? this.send(t, n, a, s, pn, o).then((l) => (this.written(n), l)) : Yo() && !yc(n) ? Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 })) : this.joined(r, () => this.send(t, n, a, 0, this.tries, o));
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query; it is in the table until it is closed
  stream(t) {
    const n = this.took([{ window: Xe, line: t, kind: xc }], t), a = new EventSource(t), s = a.close;
    return a.close = () => {
      n(), s.call(a);
    }, a;
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return this.out(Ls, { cache: "no-store" }, [{ window: Xe, line: Ls, kind: tt }], vc);
  }
  // a request to an address beside the page, or a file the build carries, answered as the browser's own response, under the window that asked and with
  // how long a read may take; a request the server never answered puts the cover up
  raw(t, n = {}, { window: a = Xe, line: s = t, limit: o = mn } = {}) {
    const r = (n.method ?? "GET") === "GET" ? tt : Ot;
    return r === Ot ? this.sent(t, n, [{ window: a, line: s, kind: r }], 0) : this.whenFree(() => this.sent(t, n, [{ window: a, line: s, kind: r }], o));
  }
}
const aa = Symbol.for("journal.transport"), Ae = globalThis[aa] ?? (globalThis[aa] = new $c()), Mc = 0, Sc = "/api/lines", _c = "/api/line", Ds = 5e3, Ps = (e, t) => ({ signal: t, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(e) }), js = (e, t) => ({ window: e.window, line: e.line.join(" "), kind: t }), sa = (e) => JSON.stringify(e.line), qs = () => new DOMException("cancelled", "AbortError");
class Ec {
  constructor() {
    this.waiting = [], this.timer = null, this.slow = /* @__PURE__ */ new Set();
  }
  read(t, n, a = !1) {
    return new Promise((s, o) => {
      const r = { body: t, signal: n, resolve: s, reject: o };
      if (a || this.slow.has(sa(t))) {
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
    this.timer ?? (this.timer = setTimeout(() => Ae.whenFree(() => this.send()), Mc));
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(qs())), this.waiting = [], this.timer = null, t.length === 1) return this.readAlone(t[0]);
    t.length && await this.sendTogether(t);
  }
  // a line whose window has gone leaves the batch: the request is cut and what others still wait on goes again without it
  async sendTogether(t) {
    const n = new AbortController(), a = new Set(t), s = t.map((o) => () => {
      a.delete(o), o.reject(qs()), n.abort();
    });
    t.forEach((o, r) => {
      var l;
      return (l = o.signal) == null ? void 0 : l.addEventListener("abort", s[r], { once: !0 });
    });
    try {
      const o = await Ae.sent(Sc, Ps({ lines: t.map((l) => l.body) }, n.signal), t.map((l) => js(l.body, tt)), Ds), { answers: r } = await o.json();
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
    await this.alone(t, tt), Date.now() - n < Ds ? this.slow.delete(sa(t.body)) : this.slow.add(sa(t.body));
  }
  async alone(t, n) {
    try {
      const a = await Ae.sent(_c, Ps(t.body, t.signal), [js(t.body, n)], n === tt ? void 0 : 0);
      t.resolve(await a.json());
    } catch (a) {
      t.reject(a);
    }
  }
}
const er = new Ec(), Ac = 150, Cc = () => Ac;
function rs(e, t, n = Cc(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Oc {
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
      n.patterns.some((a) => tr(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function tr(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const nr = /* @__PURE__ */ new Map();
class Tc {
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
function D2(e, t) {
  const n = new Tc(e, t);
  return nr.set(e, n), n.load().catch(() => {
  }), n;
}
const ls = (e) => nr.get(e);
function Rc(e, t, n) {
  const a = ls(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Bc(e, t) {
  if (!e) return !0;
  const n = ls(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Ic = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let ar = {};
async function P2(e = (t) => Ae.raw(t)) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (ar = (await t.json()).states);
}
const is = (e, t) => {
  var n;
  return (n = ar[e]) == null ? void 0 : n[t];
}, sr = (e, t) => {
  var n;
  return ((n = is(e, t)) == null ? void 0 : n.label) ?? Ic(t);
}, or = (e, t) => {
  var n;
  return ((n = is(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Lc = (e, t) => {
  var n;
  return ((n = is(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Nc = Symbol("pane-page"), Dc = Symbol("inspector-host"), Pc = { 1: "refused", 2: "usage", 3: "fault" }, jc = 100, qc = 50, Fc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Wc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Hc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: r, open: l, options: i = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: y = [], links: O = {}, search: b = {}, readOnly: N = !1, shared: z = null }) {
  const ee = /* @__PURE__ */ new Map(), j = new AbortController(), M = I(!1), S = performance.now();
  let R = 0, A = 0, x = () => {
  };
  const T = new Promise(($) => x = $);
  j.signal.addEventListener("abort", x, { once: !0 });
  const k = () => {
    clearTimeout(A), A = setTimeout(() => {
      R === 0 && rs(S, () => {
        M.value = !0, x();
      });
    }, qc);
  }, p = ($, V) => (R += 1, at(e, $, t, j.signal, V).finally(() => {
    R -= 1, k();
  })), _ = ($, V) => (k(), T.then(() => j.signal.aborted ? yt : at(e, $, t, j.signal, V))), E = ($, { unbatched: V = !1, deferred: Z = !1 } = {}) => {
    const Y = ee.get($);
    if (Y && performance.now() - Y.at < jc) return Y.answer;
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
    readOnly: N,
    shared: z,
    read: E,
    run: ($) => at(e, $, t, j.signal),
    upload: ($) => zc($, e, j.signal),
    cancel: () => j.abort(),
    signal: j.signal,
    subscriptions: r,
    follow: ($, V) => r.follow(e, $.filter((Z) => o.some((Y) => tr(Y, Z))), (Z) => {
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
function Uc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const yt = { ok: !1, failure: "cancelled", error: "" }, rr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function lr(e, t) {
  try {
    const n = await e();
    return t != null && t.aborted ? yt : n.code === 0 ? { ok: !0, value: n.value } : { ok: !1, failure: Pc[n.code] || "fault", error: Uc(n.error) };
  } catch {
    return t != null && t.aborted ? yt : { ok: !1, failure: "unreachable", error: rr };
  }
}
async function ir(e, t, n) {
  const a = await lr(() => er.read(e, t, n), t);
  return a.failure !== "unreachable" || !Yo() ? a : (await rc(), t.aborted ? yt : ir(e, t, n));
}
async function at(e, t, n, a = void 0, s = !1) {
  const o = { window: e, line: Array.isArray(t) ? t : cr(t), environment: n };
  return await Ae.isRead(o.line) ? Ae.joined(JSON.stringify(o), (r, l) => ir({ ...o, attribution: l }, r, s), a, o).catch(() => yt) : lr(() => er.write({ ...o, attribution: {
    client_id: Ae.clientId,
    command_id: crypto.randomUUID(),
    joined_callers: 0,
    followed_command_id: "",
    complete: !0
  } }), a);
}
async function zc(e, t, n = void 0) {
  try {
    const a = await Ae.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }, { window: t, line: `upload ${e.name}` }), s = await a.json();
    return n != null && n.aborted ? yt : a.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return n != null && n.aborted ? yt : { ok: !1, failure: "unreachable", error: rr };
  }
}
function cr(e) {
  return [...e.matchAll(Fc)].map(([t]) => t.replace(Wc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const Vc = (e) => `show-${e}`, j2 = (e, t, n) => e.filter((a) => {
  var s;
  return n(Vc((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), ur = "messages.chat", Gc = {
  key: 0,
  class: "template-brief"
}, Kc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, Yc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I([]), o = I(""), r = B(() => s.value.map((u) => ({ key: String(u.id), label: u.title, note: u.module }))), l = B(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await at(ur, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((m) => m.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(K, null, [
      L(Vn, {
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      l.value ? (c(), h("p", Gc, w(l.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", Kc, w(o.value), 1)) : C("", !0)
    ], 64));
  }
}, Jc = /* @__PURE__ */ J(Yc, [["__scopeId", "data-v-14be8a5c"]]), Zc = { class: "form-field" }, Xc = { class: "form-field-head" }, Qc = ["for"], eu = {
  key: 0,
  class: "form-field-aside"
}, tu = {
  key: 0,
  class: "form-field-help"
}, nu = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Zc, [
      g("div", Xc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, w(e.label), 9, Qc),
        t.$slots.aside ? (c(), h("span", eu, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", tu, w(e.help), 1)) : C("", !0)
    ]));
  }
}, au = /* @__PURE__ */ J(nu, [["__scopeId", "data-v-dd7cdcff"]]), ja = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, su = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Un(), n = B(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Je((c(), h("textarea", Ye({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [q(ja), q(t).value]
    ]);
  }
}), ou = /* @__PURE__ */ J(su, [["__scopeId", "data-v-e130a5b9"]]), ru = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = ss(), o = B(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, l) => (c(), W(au, {
      label: e.field.label,
      for: q(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        L(Nt, { value: o.value }, {
          choice: D(() => [
            L(Vn, {
              id: q(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: l[0] || (l[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            L(Jc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: l[1] || (l[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            L(ou, {
              id: q(s),
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
}, cs = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), W(ue, {
      variant: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        L(me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function lu(e, t, n, a = () => window) {
  Oe(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Re(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const iu = (e, t = () => !0) => lu("keydown", (n) => n.key === "Escape" && t() && e());
function dr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = I(!1), s = B(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return iu(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const cu = 80, Ct = os([]);
function fr(e) {
  const t = Symbol("layer"), n = () => Ct.includes(t) && Ct.splice(Ct.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !Ct.includes(t) && Ct.push(t), a || n();
    },
    { immediate: !0 }
  ), Re(n), B(() => cu + Math.max(0, Ct.indexOf(t)));
}
let hr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return hr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const uu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function du(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(uu)];
    if (!r.length) return o.preventDefault();
    const [l, i] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === l ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), l.focus({ preventScroll: !0 }));
  }
  Oe(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : hr, document.addEventListener("keydown", s), it(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const fu = ["aria-modal", "aria-label", "aria-labelledby"], hu = {
  key: 0,
  class: "dialog-head"
}, mu = ["id", "tabindex"], pu = {
  key: 1,
  class: "dialog-foot"
}, gu = 500, vu = 400, yu = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = dr(a, n), l = fr(s), i = I(null), u = I(null), d = I(null), f = ss(), m = I(!1), v = Date.now();
    n.modal && du(u, () => a("escape"), d);
    function y() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, vu);
    }
    function O(z) {
      !n.modal || Date.now() - v >= gu || ![" ", "Enter"].includes(z.key) || (z.preventDefault(), z.stopPropagation());
    }
    const b = () => i.value && (i.value.scrollTop = i.value.scrollHeight), N = new MutationObserver(b);
    return he(i, (z) => {
      N.disconnect(), z && n.follow && (N.observe(z, { childList: !0, subtree: !0, characterData: !0 }), b());
    }), Re(() => N.disconnect()), (z, ee) => (c(), W(as, { to: "body" }, [
      L(Lt, {
        name: "dialog",
        appear: "",
        onAfterLeave: q(r)
      }, {
        default: D(() => [
          q(s) ? (c(), h("div", {
            key: 0,
            class: X(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: q(l) }),
            onClick: we(y, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: X(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? q(f) : void 0,
              onKeydownCapture: O
            }, [
              e.bare ? C("", !0) : (c(), h("header", hu, [
                g("h3", {
                  id: q(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, w(e.title), 9, mu),
                e.closable ? (c(), W(cs, {
                  key: 0,
                  onClick: q(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: X(["dialog-body", { bare: e.bare }])
              }, [
                ce(z.$slots, "default", {}, void 0, !0)
              ], 2),
              z.$slots.foot ? (c(), h("footer", pu, [
                ce(z.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, fu)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, mr = /* @__PURE__ */ J(yu, [["__scopeId", "data-v-6d1ecd98"]]), wu = (e, t, n = {}) => cr(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function sn(e, t, n, a = {}) {
  try {
    return await Bc(e.module, n) ? at(ur, wu(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const bu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, oa = [
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
}), Gn = {
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
    filters: oa
  }),
  tasks: pe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: oa
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
  pins: pe("Pin", "band", "One line pinned to the chat while it matters", { filters: oa }),
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
}, ku = ["secrets", "plugins"], pr = Object.keys(Gn).filter((e) => !(Go && ku.includes(e)));
B(() => pr.map((e) => ({ name: e, ...Gn[e] })));
const Dt = (e) => Gn[e], gr = new Map(pr.flatMap((e) => [e, e.replace(/s$/, ""), Gn[e].title.toLowerCase()].map((t) => [t, e]))), Ge = (e) => gr.get(String(e).toLowerCase()) || "", vr = [...gr.keys()].sort((e, t) => t.length - e.length).join("|"), xu = {
  class: "button-form",
  "data-button-form": ""
}, $u = {
  key: 0,
  class: "button-form-title"
}, Mu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Su = { class: "button-form-actions" }, _u = {
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
      const d = await sn(n.button, n.row, n.environment, s.value);
      o.value = !1, r.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), W(mr, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => a("close"))
    }, {
      default: D(() => {
        var m;
        return [
          g("div", xu, [
            (m = e.row) != null && m.title ? (c(), h("p", $u, w(e.row.title), 1)) : C("", !0),
            (c(!0), h(K, null, te(e.button.fields, (v) => (c(), W(ru, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (y) => s.value[v.name] = y
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            r.value ? (c(), h("p", Mu, w(r.value), 1)) : C("", !0),
            g("div", Su, [
              L(ue, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: D(() => [...f[2] || (f[2] = [
                  ne("Cancel", -1)
                ])]),
                _: 1
              }),
              L(ue, {
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
}, Eu = /* @__PURE__ */ J(_u, [["__scopeId", "data-v-f26c27a7"]]), Au = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Cu = {
  key: 1,
  class: "menu-item-text"
}, Ou = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Au, w(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", Cu, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, w(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, wt = /* @__PURE__ */ J(Ou, [["__scopeId", "data-v-fec99974"]]), Tu = ["aria-busy"], Ru = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Bu = {
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
    const n = e, a = t, s = B(() => ls(n.environment)), o = B(
      () => {
        var y;
        return !n.readOnly && ((y = s.value) == null ? void 0 : y.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), r = B(() => {
      var y;
      return !n.readOnly && ((y = s.value) == null ? void 0 : y.failed.value);
    }), l = () => s.value.load().catch(() => {
    }), i = B(() => n.readOnly ? [] : Rc(n.environment, n.name, n.row)), u = I(null), d = I(""), f = I(!1), m = (y) => [y.from ? `From ${y.from}` : "", y.tip].filter(Boolean).join(" · ");
    async function v(y) {
      if (f.value || n.readOnly) return;
      if (y.fields.length) {
        u.value = y;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const O = await sn(y, n.row, n.environment);
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
        L(ue, {
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
          b.menu.length ? (c(), W(ji, {
            key: 0,
            small: "",
            variant: b.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": b.menu_label || "More ways",
            title: m(b),
            "data-button": b.name,
            onMain: (N) => v(b)
          }, {
            menu: D(({ close: N }) => [
              (c(!0), h(K, null, te(b.menu, (z) => (c(), W(wt, {
                key: z.label,
                description: z.description,
                onClick: (ee) => (N(), v({ ...b, ...z, menu: [] }))
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
            onClick: (N) => v(b)
          }, {
            default: D(() => [
              ne(w(b.label), 1)
            ]),
            _: 2
          }, 1032, ["variant", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Ru, w(d.value), 1)) : C("", !0),
        u.value && !e.readOnly ? (c(), W(Eu, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: O[0] || (O[0] = (b) => u.value = null),
          onDone: O[1] || (O[1] = (b) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, Tu));
  }
}, Iu = /* @__PURE__ */ J(Bu, [["__scopeId", "data-v-a07b49a4"]]), Lu = {
  class: "running",
  "data-running-command": ""
}, Nu = ["title"], Du = {
  key: "idle",
  class: "running-idle"
}, Pu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Lu, [
      L(Lt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, w(e.text), 9, Nu)) : (c(), h("span", Du, w(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, q2 = /* @__PURE__ */ J(Pu, [["__scopeId", "data-v-d3240219"]]), ju = ["aria-checked", "aria-label", "title"], qu = {
  key: 0,
  class: "switch-inner"
}, Fu = {
  key: 0,
  class: "switch-word"
}, Wu = {
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
        e.labelled ? (c(), h("span", qu, w(e.word), 1)) : C("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Fu, w(e.word), 1)) : C("", !0)
    ], 10, ju));
  }
}, F2 = /* @__PURE__ */ J(Wu, [["__scopeId", "data-v-1bfb90f3"]]);
function yr(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function Tn(e, t) {
  return yr(() => localStorage, e, t);
}
function wr(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function us(e, t) {
  return wr(() => localStorage, e, t);
}
function br(e, t) {
  he(t, (n) => us(e, n), { deep: !0 });
}
function Hu(e, t) {
  return yr(() => sessionStorage, e, t);
}
function Uu(e, t) {
  return wr(() => sessionStorage, e, t);
}
const Rn = "journal.environment", kr = I(Hu(Rn, Tn(Rn, "")));
function zu(e) {
  kr.value = e, Uu(Rn, e), us(Rn, e);
}
const Bn = I(location.hash), Fs = ze(null), Ws = { integrations: "mcp", library: "team" };
function Vu() {
  if (!Fs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Ws[n]) {
    location.replace(`#/${[Ws[n], ...a].join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash;
    return;
  }
  !n || Fs.value(n) || (zu(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Bn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Bn.value = location.hash, Vu();
});
const qa = B(() => {
  const [e, t = ""] = Bn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [l, i = ""] = r.split("@"), [u = "", d = "", f = ""] = l.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: kr.value,
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
}), ds = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${ds.page(e)}?open=${t}`
};
function Gu(e = "", t = 0, n = "") {
  location.hash = ds.page(e, t, n);
}
const Ku = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function xr(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([r]) => r !== "open" && r !== "sub").map(([r, l]) => `${r}=${encodeURIComponent(l)}`), ...e.length ? [`open=${e.map(Ku).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Rt = {};
function W2(e, t) {
  return Rt[e] = t, () => Rt[e] === t && delete Rt[e];
}
function $r(e, t, n = 0, a = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((r = Rt[e]) != null && r.call(Rt, t))) return;
  const s = qa.value.stack, o = s.findIndex((l) => l.table === e && l.id === t);
  xr([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function Yu(e, t, n, a = 0, s = "") {
  if (e === qa.value.env) return $r(t, n, a, s);
  const o = qa.value.stack, r = o.findIndex((l) => l.table === t && l.id === n && l.env === e);
  xr([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: a, env: e }], s);
}
function Pe(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? Yu(a, s, Number(o), 0, t) : $r(s, Number(o), 0, t);
}
function Ju(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Tt(e) {
  const t = Ju(e);
  t && Pe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function H2(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const Zu = { class: "inspector-part" }, Xu = { class: "inspector-part-title" }, Qu = {
  __name: "InspectorPart",
  props: { title: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("section", Zu, [
      g("h4", Xu, w(e.title), 1),
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, U2 = /* @__PURE__ */ J(Qu, [["__scopeId", "data-v-0da7fa52"]]), ed = {
  key: 1,
  class: "row-list-failure"
}, td = ["data-row"], nd = {
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
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", ed, w(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), W(Jt, {
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
      (c(), W(kt(e.arrival ? qo : "ul"), Ye(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), h(K, null, te(e.rows, (l) => (c(), h("li", {
            key: l.id,
            class: "row-list-row",
            "data-row": l.id
          }, [
            ce(o.$slots, "default", { row: l }, void 0, !0)
          ], 8, td))), 128))
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
}, ad = /* @__PURE__ */ J(nd, [["__scopeId", "data-v-6c7ba696"]]), sd = {
  class: "agent-rows",
  "data-agent-rows": ""
}, od = {
  key: 1,
  class: "agent-rows-note"
}, rd = {
  key: 2,
  class: "agent-rows-note"
}, ld = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, id = ["data-agent-row", "onClick"], cd = { class: "agent-row-name" }, ud = { class: "agent-row-state" }, dd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = B(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", sd, [
      e.loaded ? e.failure ? (c(), h("p", od, w(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        g("p", ld, w(a.value) + " running", 1),
        (c(!0), h(K, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (l) => q(Pe)(`agents:${r.id}`)
        }, [
          g("span", cd, "#" + w(r.id) + " " + w(r.session), 1),
          g("span", ud, w(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, id))), 128))
      ], 64)) : (c(), h("p", rd, w(e.none), 1)) : (c(), W($t, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, z2 = /* @__PURE__ */ J(dd, [["__scopeId", "data-v-a01e5a17"]]), fd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["badge", e.tone])
    }, w(e.text), 3));
  }
}, Mr = /* @__PURE__ */ J(fd, [["__scopeId", "data-v-9e7e1157"]]), hd = ["aria-valuenow", "aria-valuemax"], md = {
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
    ], 10, hd));
  }
}, pd = /* @__PURE__ */ J(md, [["__scopeId", "data-v-9eba6a85"]]), gd = { class: "bars" }, vd = { class: "bar-name" }, yd = { class: "bar-value" }, wd = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = B(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, l) => (c(), h("div", gd, [
      (c(!0), h(K, null, te(e.items, (i, u) => (c(), W(kt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: X(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          g("span", vd, w(i.label), 1),
          L(pd, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", yd, w(i.value) + w(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, bd = /* @__PURE__ */ J(wd, [["__scopeId", "data-v-663427f4"]]), kd = { class: "bars" }, xd = {
  key: 0,
  class: "bars-title"
}, $d = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", kd, [
      e.node.title ? (c(), h("span", xd, w(e.node.title), 1)) : C("", !0),
      L(bd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Md = /* @__PURE__ */ J($d, [["__scopeId", "data-v-7135bb11"]]), Sd = {
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
      (c(!0), h(K, null, te(e.node.children || [], (i, u) => (c(), W(jr, {
        key: u,
        node: i,
        onOpen: l[0] || (l[0] = (d) => s("open", d)),
        onFile: l[1] || (l[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Sn = /* @__PURE__ */ J(Sd, [["__scopeId", "data-v-d142a3f4"]]), _d = {
  key: 0,
  class: "card-head"
}, Ed = { class: "card-title" }, Ad = {
  key: 0,
  class: "card-note"
}, Cd = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: X(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", _d, [
        g("span", Ed, w(e.node.title), 1),
        e.node.note ? (c(), h("span", Ad, w(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      L(Sn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Od = /* @__PURE__ */ J(Cd, [["__scopeId", "data-v-67b72d40"]]), Td = { processes: "process", memories: "memory", replies: "reply" }, Ut = (e) => (Td[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Fa = [], Rd = 2e3, et = /* @__PURE__ */ new Map(), Bd = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Id = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Mt(e, { first: t = !1 } = {}) {
  t ? Fa.unshift(e) : Fa.push(e), et.clear();
}
function Sr(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Ld = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Nd = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Ke(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Dd(e, t) {
  const n = [{ type: "text", text: Ke(e).replace(/\r\n/g, `
`) }];
  for (const a of Fa)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.type !== "text") continue;
      const r = a(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(s, 1, ...r);
    }
  return n;
}
function Zt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Pd(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Pd(e) {
  return e.split(Id).map((t, n) => n % 2 ? t : t.replace(Bd, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Hs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const jd = 24;
function qd(e) {
  const [t, , ...n] = e, a = Hs(t), s = n.map(Hs), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > jd) ? ' class="text-column"' : "", r = a.map((i, u) => `<th${o(u)}>${Zt(i)}</th>`).join(""), l = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${Zt(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${r}</tr></thead><tbody>${l}</tbody></table>`;
}
const _r = /^\s*(?:[-*+]|\d+[.)])\s+/, Wa = /^\s*(\d+)[.)]\s/, Us = (e) => e.match(/^\s*/)[0].length;
function Er(e) {
  const t = e[0].match(Wa), n = Us(e[0]), a = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), l = a[a.length - 1];
    r && Us(o) <= n ? a.push({ text: r[2], nested: [] }) : l && o.trim() && (r || l.nested.length) ? l.nested.push(o) : l && o.trim() && (l.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Zt(o.text)}${o.nested.length ? Er(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Fd(e, t) {
  const n = Wa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (_r.test(e[s]) && Wa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const zs = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Ar(e) {
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
      n.push(`<h${l}>${Zt(o[2])}</h${l}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (zs(t, a)) {
      let l = a + 2;
      for (; l < t.length && t[l].includes("|"); ) l += 1;
      n.push(qd(t.slice(a, l))), a = l;
      continue;
    }
    if (_r.test(s)) {
      const l = Fd(t, a);
      n.push(Er(t.slice(a, l))), a = l;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let l = a;
      for (; l < t.length && /^(?:>|&gt;)\s?/.test(t[l]); ) l += 1;
      n.push(
        `<blockquote>${Ar(
          t.slice(a, l).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = l;
      continue;
    }
    let r = a;
    for (; r < t.length && t[r].trim() && !zs(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Zt(t.slice(a, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = r;
  }
  return n.join("");
}
const Wd = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Hd = (e) => e.type !== "text" && !Wd.test(e.html);
function Ud(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(Ar(a).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), a = "";
  };
  for (const o of e)
    o.type === "text" ? a += o.text : Hd(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function zd(e, t = { env: "" }) {
  const n = Nd(e, t), a = et.get(n);
  if (et.delete(n), a && a.source === t.source && a.reads.every((r) => Ld(r, t)))
    return et.set(n, a), a.html;
  const s = [], o = Ud(Dd(e, { ...t, reads: s }));
  return et.set(n, { html: o, reads: s, source: t.source }), et.size > Rd && et.delete(et.keys().next().value), o;
}
const ra = /* @__PURE__ */ new WeakMap();
function Vd(e) {
  if (ra.has(e)) return ra.get(e);
  const t = Kl(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), m = e.read(`${Ut(u)} show ${d}`);
    n.set(f, m), m.then((v) => {
      n.get(f) === m && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function r(u) {
    a.has(u) || (a.add(u), e.follow([`${Ut(u).replace(/-/g, "_")}.*`], (d) => {
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
  return ra.set(e, i), i;
}
function Cr() {
  const e = $e(Se, null), t = e ? Vd(e) : null;
  return (n, a = {}) => zd(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const Or = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, on = (e) => String(e || "").replace(Or, (t, n, a, s) => s), Gd = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), vn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Kd = /^Traceback \(most recent call last\):/m, Yd = 8;
function Tr(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Yd).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function Jd(e) {
  const t = [...e.matchAll(Gd)].map((a) => a.index);
  if (vn.lastIndex = 0, !t.length || !vn.test(e)) return null;
  vn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), r = [...o.matchAll(vn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((l) => l[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: Tr(n), tail: "" } : null;
}
function Zd(e) {
  const t = Kd.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Tr([o]), tail: n.slice(s).join(`
`) };
}
Mt((e) => {
  const t = on(e), n = Zd(t) || Jd(t);
  return n ? [
    { type: "text", text: n.lead },
    { type: "html", html: n.html },
    { type: "text", text: n.tail }
  ] : null;
});
const Xd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, Qd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, ef = /[\w\]]\(/, tf = /^[\w$.[\]'"]+\s*=\s*[^=]/, nf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, af = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, sf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, of = /[[({,]$/, rf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, lf = /^(\t|\s{2,})\S/, cf = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, uf = /`[^`]+`/, df = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, ff = /[{}()[\];=<>$&|*\\@+^~%]/g, Rr = /^\s*(?:[-*+]|\d+[.)])\s/, hf = /^\s*>/, mf = /^\s*\|/, pf = 0.6, gf = 0.4, vf = 5, yf = 0.03, Br = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= vf && t.every((n) => df.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(ff) ?? []).length / e.length < yf;
}, la = (e) => {
  const t = e.trim();
  return uf.test(t) ? !1 : [Xd, Qd, ef, tf, nf, af, sf, of, rf].some((n) => n.test(t)) || /[;{}]$/.test(t) || lf.test(e) && !Rr.test(e) && !Br(e);
};
function wf(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Rr.test(t[0]) || t.every((o) => hf.test(o) || mf.test(o))) return "text";
  const n = t.filter((o) => !cf.test(o.trim()));
  if (t.length === 1) return !n.length || la(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(la).length, s = n.filter((o) => !la(o) && Br(o)).length;
  return a >= n.length * pf && s <= n.length * gf ? "code" : "text";
}
const Ha = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", bf = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", kf = `${Ha} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, xf = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", $f = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Vs = {
  js: { keywords: Ha, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: bf, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: kf, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ha, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: xf, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: $f, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Mf = {
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
function Gs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Sf(e, t) {
  const n = Vs[Mf[t] ?? t] || Vs.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
    if (Gs(e, o, n.line) || n.hash && l === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Gs(e, o, n.block[0])) {
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
function _f(e, t) {
  const n = [""];
  for (const { type: a, value: s } of Sf(e, t))
    s.split(`
`).forEach((r, l) => {
      l && n.push(""), r && (n[n.length - 1] += a === "plain" ? Ke(r) : `<span class="tok-${a}">${Ke(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Ef(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Af = 1500, Ks = /* @__PURE__ */ new WeakMap();
async function Cf(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Ef(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ks.get(t)), Ks.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Af)
  )));
}
typeof document < "u" && document.addEventListener("click", Cf, !0);
const Of = /\n\s*\n/, Tf = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Rf = /^\s*(`{3,}|~{3,})\s*$/, Bf = /^\s{4,}\S/, If = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ua = /^\s*(?:[-*+]|\d+[.)])\s/, Ir = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Lf = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function fs(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Nf(e) {
  const t = fs(e.join(`
`));
  return (Lf.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Df = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Ir.test(t) && !Ua.test(t);
}, Pf = (e, t) => Ua.test(t) || Ua.test([...e].reverse().find((n) => n.trim()) || "");
function hs(e, t) {
  const n = t || Nf(e), a = _f(fs(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { type: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function jf(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Rf.test(s));
  return a < 0 ? e.length : a;
}
function qf(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return hs(a.map(on), n ? n.toLowerCase() : "");
}
function Ff(e) {
  const t = e.split(Of).map((r) => ({ paragraph: r, type: wf(fs(r).split(`
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
      s(), n.push(hs(l.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(on), "")), o = r;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].type === "text" ? [{ type: "text", text: e }] : n;
}
function Wf(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ type: "text", text: s.join(`
`) }] : Ff(s.join(`
`))), s = [];
  };
  let r = 0;
  for (; r < n.length; ) {
    const l = n[r].match(Tf);
    if (l) {
      const u = jf(n, r, l[2]);
      o(), a.push(qf(n.slice(r + 1, u), l[1], l[3])), r = u + 1;
      continue;
    }
    const i = Df(s) ? If : Bf;
    if (!t && i.test(n[r]) && !Pf(s, n[r])) {
      let u = r;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Ir.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - r + d.length >= 2) {
        o(), a.push(hs([...d, ...n.slice(r, u)].map(on), "")), r = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[r]), r += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].type === "html" ? a : null;
}
Mt((e, t) => Wf(e, t.document));
const In = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Lr = (e) => `${e.table}:${e.id}`, Ys = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ia = 80;
function Js(e) {
  return e.length <= ia ? e : `${e.slice(0, ia + 1).replace(/\s+\S*$/, "") || e.slice(0, ia)}…`;
}
const Zs = {
  messages: (e) => Js(Ys(e.text)),
  comments: (e) => Js(Ys(e.text)),
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
}, Hf = (e) => (Zs[e.table] ? Zs[e.table](e) : e.title || "") || "", bt = (e) => In(e.created_at), Nr = (e) => In(e.updated_at) || bt(e), Uf = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, zf = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Vf(e) {
  const t = Uf.exec(e);
  if (t && Ge(t[1])) return { at: t.index, length: t[0].length, table: Ge(t[1]), id: Number(t[2]), label: t[3] };
  const n = zf.exec(e), a = n && Ge(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function Gf(e, t, n, a) {
  const s = Sr(a, e, t), o = on(s ? Hf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-type">${Ke(Dt(e).title)} ${t}</span><span class="row-card-title">${Ke(o)}</span></a>`;
}
Mt(
  (e, t) => {
    const n = Vf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: Gf(n.table, n.id, n.label, t) },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Kf = /\.(png|jpe?g|gif|webp|svg)$/i, Yf = (e) => Kf.test(e), Jf = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Zf = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Xf(e, t) {
  const n = Jf.exec(e), [, a, s, o, r, l] = n || [], i = n && Ge(a || o), u = i && Sr(t, i, Number(s || r));
  if (i !== "messages" || !u || !(u.files || []).includes(l)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(l)}`, f = `${Dt(i).title} ${u.id} · ${Ke(l)}`, m = Yf(l) ? `<img class="file-card-image" src="${d}" alt="${Ke(l)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ke(l)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Qf(e) {
  const t = Zf.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ke(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Mt(
  (e, t) => {
    if (t.inline) return null;
    const n = Xf(e, t) || Qf(e);
    return n ? [
      { type: "text", text: e.slice(0, n.at) },
      { type: "html", html: n.html },
      { type: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const eh = /`([^`\n]+)`/g;
Mt((e) => e.replace(eh, (t, n) => `<code>${n}</code>`));
const Xs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${ds.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Mt(
  (e, t) => e.replace(Or, (n, a, s, o) => Xs[a] ? Xs[a](s, o, t) : o)
);
const th = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Dr = new RegExp(`\\b(${vr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Pr = new RegExp(`\\b(${vr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), nh = new RegExp(`<code>((?:${Dr.source}|${Pr.source}))</code>`, "gi"), ah = (e) => e.replace(nh, "$1"), sh = (e, t) => `<a class="row-pill" href="#" data-peek="${Ge(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, oh = (e) => e.replace(Pr, (t, n, a) => a.replace(/\d+/g, (s) => sh(n.replace(/s$/i, ""), s))), rh = (e) => oh(e).replace(
  Dr,
  (t, n, a, s = "", o) => {
    const r = a || o;
    return `<a class="row-pill" href="#" data-peek="${Ge(n)}:${r}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${r}${s ? `:${s}` : ""}</span></a>`;
  }
);
Mt(
  (e, t) => t.rowNames === !1 ? e : ah(e).split(th).map((n, a) => a % 2 ? n : rh(n)).join("")
);
const lh = ["innerHTML"], ih = ["innerHTML"], ch = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = Cr(), a = B(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((r) => r.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...r) => q(Tt) && q(Tt)(...r)),
      innerHTML: a.value
    }, null, 8, lh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...r) => q(Tt) && q(Tt)(...r)),
      innerHTML: a.value
    }, null, 8, ih));
  }
}, st = /* @__PURE__ */ J(ch, [["__scopeId", "data-v-d8e75741"]]), uh = { class: "fact" }, dh = { class: "fact-label" }, fh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", uh, [
      g("span", dh, w(e.label), 1),
      L(st, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, hh = /* @__PURE__ */ J(fh, [["__scopeId", "data-v-3a88ecf8"]]), mh = { class: "list" }, ph = { class: "list-label" }, gh = {
  key: 1,
  class: "list-note"
}, vh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", mh, [
      (c(!0), h(K, null, te(e.items, (o, r) => (c(), W(kt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: X(["list-item", { opens: o.open }]),
        onClick: (l) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", ph, w(o.label), 1),
          o.badge ? (c(), W(Mr, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", gh, w(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, yh = /* @__PURE__ */ J(vh, [["__scopeId", "data-v-ebe2ae0a"]]), wh = { class: "table" }, bh = {
  key: 0,
  class: "table-row empty"
}, kh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", wh, [
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
      !e.rows.length && e.empty ? (c(), h("div", bh, w(e.empty), 1)) : C("", !0)
    ]));
  }
}, xh = /* @__PURE__ */ J(kh, [["__scopeId", "data-v-9326a52e"]]), $h = { class: "stat-value" }, Mh = { class: "stat-label" }, Sh = {
  key: 0,
  class: "stat-note"
}, _h = {
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
        g("span", $h, w(e.value), 1),
        g("span", Mh, w(e.label), 1),
        e.note ? (c(), h("span", Sh, w(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Eh = /* @__PURE__ */ J(_h, [["__scopeId", "data-v-ad0db6d6"]]), Ah = { class: "code" }, Ch = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, r) => (c(), W(Nt, {
      value: e.node.type
    }, {
      stack: D(() => [
        L(Sn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        L(Sn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        L(Sn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        L(Od, {
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
        L(Eh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (l) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        L(Md, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        L(xh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        L(yh, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        L(st, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        L(hh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        L(Mr, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        g("pre", Ah, [
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
}), jr = /* @__PURE__ */ J(Ch, [["__scopeId", "data-v-cbdcf540"]]), Oh = { class: "dashboard" }, Th = { class: "trail" }, Rh = ["onClick"], Bh = {
  key: 0,
  class: "gone",
  role: "status"
}, Ih = {
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
    ), (m, v) => (c(), h("div", Oh, [
      e.document.broken ? (c(), W(Jt, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          ne(w(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), W(Jt, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          ne(w(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(K, { key: 2 }, [
        g("nav", Th, [
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
            }, w(u(y)), 11, Rh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Bh, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        L(Lt, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (c(), h("div", {
              key: l.value,
              class: "page"
            }, [
              L(jr, {
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
}, Lh = /* @__PURE__ */ J(Ih, [["__scopeId", "data-v-fbe83734"]]), Qe = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Ne = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Le = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Nh = 6;
function ms(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Dh = (e) => {
  const t = ms(e, Qe.lineChars), n = Math.max(Qe.minWidth, Math.max(...t.map((a) => a.length)) * Qe.charWidth + Qe.padX * 2);
  return { name: e, lines: t, line: Qe.line, padY: Qe.padY, width: n, height: t.length * Qe.line + Qe.padY * 2 };
};
function Ph(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (r) => {
    s.set(r, "open"), t.forEach((l, i) => {
      if (l[0] !== r) return;
      const u = s.get(l[1]);
      u === "open" ? a.add(i) : u || o(l[1]);
    }), s.set(r, "done");
  };
  return [...n, ...e].forEach((r) => s.has(r) || o(r)), a;
}
function jh(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function qh(e, t, n) {
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
  for (let r = 0; r < Nh; r++) {
    const l = r % 2 === 0, i = a.map((u, d) => d);
    (l ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((m) => m[l ? 1 : 0] === f).map((m) => m[l ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Fh(e, t) {
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
function Wh(e) {
  const t = [...new Set(e.flatMap(([j, M]) => [j, M]))], n = new Set(e.map(([, j]) => j)), a = t.filter((j) => !n.has(j)), s = Ph(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((j, M) => !s.has(M)), r = jh(t, o), l = qh(t, o, r), i = new Map(t.map((j) => [j, Dh(j)])), u = l.map((j) => j.reduce((M, S) => M + i.get(S).width, 0) + Le.across * (j.length - 1)), d = Math.max(...u) + Le.margin * 2, f = Uh(e, r, l.length), m = /* @__PURE__ */ new Map();
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
  Fh(y, m);
  const O = y.map((j) => zh(j, m.get(j.from), m.get(j.to))), b = [...m.values()], N = Yh(O, b), z = Math.max(v - Le.down, ...N.filter((j) => j.label).map((j) => j.label.y + j.label.height));
  return { width: Math.max(d - Le.margin, ...N.filter((j) => j.label).map((j) => j.label.x + j.label.width)) + Le.margin, height: z + Le.margin, nodes: b, arrows: N };
}
const Hh = (e) => e ? ms(e, Ne.lineChars).length * Ne.line + Ne.pad * 2 : 0;
function Uh(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Le.labelSpace);
  return e.forEach(([s, o, r]) => {
    const [l, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > l && (a[l + Math.floor((i - l - 1) / 2)] += Hh(r) + Le.labelSpace);
  }), a.map((s) => Math.max(Le.down, s));
}
function zh(e, t, n) {
  const a = e.label ? ms(e.label, Ne.lineChars) : [], s = a.length ? Math.max(...a.map((m) => m.length)) * Ne.charWidth + Ne.pad * 2 : 0, o = a.length * Ne.line + (a.length ? Ne.pad * 2 : 0), r = t.x + t.width * e.fromShare, l = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - l) / 2, f = [{ x: r, y: l }, { x: r, y: l + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${r} ${l} C${r} ${l + d} ${i} ${u - d} ${i} ${u}` };
}
const Vh = ([e, t, n, a], s) => {
  const o = 1 - s, r = (l) => o * o * o * e[l] + 3 * o * o * s * t[l] + 3 * o * s * s * n[l] + s * s * s * a[l];
  return { x: r("x"), y: r("y") };
}, Gh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], Kh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Ne.line);
function Yh(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: r }) => ({ x: a, y: s, width: o, height: r }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = Vh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, l = Kh.flatMap((i) => Gh.map((u) => s(u, i))).find((i) => !n.some((u) => Qs(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => Qs(l, i)); ) l.y += Ne.line;
    return n.push(l), { ...a, label: { ...l, lines: a.lines, line: Ne.line, pad: Ne.pad } };
  });
}
const Qs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Jh = { class: "flowchart-tools" }, Zh = ["width", "height", "viewBox", "aria-label"], Xh = ["d"], Qh = ["x", "y", "width", "height"], em = ["x", "y"], tm = ["x", "dy"], nm = {
  key: 0,
  class: "flowchart-label"
}, am = ["x", "y", "width", "height"], sm = ["x", "y"], om = ["x", "dy"], rm = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => Wh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = I(null), l = I({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var N;
      const O = (N = r.value) == null ? void 0 : N.getBoundingClientRect();
      if (!(O != null && O.width)) return;
      const b = Math.min(O.width / s.value.width, O.height / s.value.height, 1.5);
      l.value = { zoom: b, x: (O.width - s.value.width * b) / 2, y: (O.height - s.value.height * b) / 2 };
    }
    function d(O, b, N) {
      const { zoom: z, x: ee, y: j } = l.value, M = Math.min(o.most, Math.max(o.least, z * O));
      l.value = { zoom: M, x: b - (b - ee) * M / z, y: N - (N - j) * M / z };
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
      var b, N, z;
      O.preventDefault(), (b = window.getSelection()) == null || b.removeAllRanges(), i = { x: O.clientX - l.value.x, y: O.clientY - l.value.y }, (z = (N = r.value).setPointerCapture) == null || z.call(N, O.pointerId);
    }
    function y(O) {
      i && (l.value = { ...l.value, x: O.clientX - i.x, y: O.clientY - i.y });
    }
    return Oe(u), (O, b) => (c(), W(mr, {
      title: e.title,
      large: "",
      onClose: b[4] || (b[4] = (N) => a("close"))
    }, {
      default: D(() => [
        g("div", Jh, [
          L(ue, {
            small: "",
            onClick: b[0] || (b[0] = (N) => f(o.step))
          }, {
            default: D(() => [...b[5] || (b[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          L(ue, {
            small: "",
            onClick: b[1] || (b[1] = (N) => f(1 / o.step))
          }, {
            default: D(() => [...b[6] || (b[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          L(ue, {
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
          onPointerup: b[2] || (b[2] = (N) => Os(i) ? i.value = null : i = null),
          onPointercancel: b[3] || (b[3] = (N) => Os(i) ? i.value = null : i = null)
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
            (c(!0), h(K, null, te(s.value.arrows, (N, z) => (c(), h("path", {
              key: `arrow-${z}`,
              class: "flowchart-arrow",
              d: N.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, Xh))), 128)),
            (c(!0), h(K, null, te(s.value.nodes, (N) => (c(), h("g", {
              key: N.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: N.x,
                y: N.y,
                width: N.width,
                height: N.height,
                rx: "8"
              }, null, 8, Qh),
              g("text", {
                x: N.x + N.width / 2,
                y: N.y + N.padY + N.line / 2
              }, [
                (c(!0), h(K, null, te(N.lines, (z, ee) => (c(), h("tspan", {
                  key: ee,
                  x: N.x + N.width / 2,
                  dy: ee ? N.line : 0
                }, w(z), 9, tm))), 128))
              ], 8, em)
            ]))), 128)),
            (c(!0), h(K, null, te(s.value.arrows, (N, z) => (c(), h(K, {
              key: `label-${z}`
            }, [
              N.label ? (c(), h("g", nm, [
                g("rect", {
                  x: N.label.x,
                  y: N.label.y,
                  width: N.label.width,
                  height: N.label.height,
                  rx: "4"
                }, null, 8, am),
                g("text", {
                  x: N.label.x + N.label.width / 2,
                  y: N.label.y + N.label.pad + N.label.line / 2
                }, [
                  (c(!0), h(K, null, te(N.label.lines, (ee, j) => (c(), h("tspan", {
                    key: j,
                    x: N.label.x + N.label.width / 2,
                    dy: j ? N.label.line : 0
                  }, w(ee), 9, om))), 128))
                ], 8, sm)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, Zh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, lm = /* @__PURE__ */ J(rm, [["__scopeId", "data-v-51d24cfe"]]), eo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', to = {
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
  agent: eo,
  worker: eo,
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
}, im = ["innerHTML"], cm = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = B(() => to[t.name] || to.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, im));
  }
}, lt = /* @__PURE__ */ J(cm, [["__scopeId", "data-v-beb5935c"]]), um = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: X(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      L(lt, { name: "fold" })
    ], 2));
  }
}, vt = /* @__PURE__ */ J(um, [["__scopeId", "data-v-d03899bb"]]), dm = ["data-tip", "aria-label"], fm = {
  key: 0,
  class: "mact-word"
}, hm = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: X(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      L(lt, { name: "open" }),
      e.open ? (c(), h("span", fm, w(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, dm));
  }
}, qr = /* @__PURE__ */ J(hm, [["__scopeId", "data-v-3b292e09"]]), Fr = 120, _n = 280, Wr = 160, mm = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, pm = ["leaving", "resizing", "entering"];
function za(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function gm(e) {
  const t = pm.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = za(e);
  return e.classList.add(...t), n;
}
function Hr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = I(t()), s = I("");
  let o = 0;
  const r = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), l = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, m) {
    l(f);
    const v = gm(f);
    r(f, m), f.offsetWidth, f.style.transition = `width ${_n}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${_n}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, v);
  }
  function u(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const y = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, i(f, za(f)));
    });
    return y.observe(m), y;
  }
  async function d(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || mm()) {
      a.value = f;
      return;
    }
    const y = za(m);
    if (r(m, y), s.value = "leaving", await n(Fr), v !== o) return;
    a.value = f, s.value = "resizing", await it(), i(m, y);
    const O = u(m);
    await n(_n), O == null || O.disconnect(), v === o && (l(m), s.value = "entering", await n(Wr), v === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), xt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const vm = { class: "growing-card-top" }, ym = ["aria-expanded"], wm = { class: "growing-card-avatar" }, bm = { class: "growing-card-title" }, km = { class: "growing-card-more" }, xm = { class: "growing-card-body" }, $m = {
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
    const n = e, a = t, s = I(!1), o = I(null), { folded: r, phase: l } = Hr(o, () => !s.value), i = B(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = B(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: X(["growing-card-wrap", q(l), { open: !q(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", vm, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (m) => s.value = !s.value)
        }, [
          g("span", wm, [
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
          g("span", bm, w(e.title), 1),
          L(vt, { open: s.value }, null, 8, ["open"])
        ], 8, ym),
        e.action ? (c(), W(qr, {
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
          L(me, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      g("div", km, [
        g("div", xm, [
          (c(!0), h(K, null, te(u.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, w(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Mm = /* @__PURE__ */ J($m, [["__scopeId", "data-v-f2b4930d"]]), Sm = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, _m = {
  key: 0,
  class: "message-links-many"
}, Em = ["aria-expanded"], Am = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Cm = ["onClick"], Om = { class: "row-pill message-links-chip" }, Tm = { class: "message-links-title" }, ca = 3, no = "task", Rm = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = B(() => t.links.length), s = B(() => t.links.every((m) => m.model === no) ? "tasks" : "items"), o = B(() => `Linked: ${t.links.map((m) => `${m.model} ${m.id}`).join(" ")}`), r = I(!1), l = I({}), i = I(null);
    Vo(i, () => r.value = !1);
    async function u() {
      const m = t.links.filter((y) => y.model === no && !(y.id in l.value)), v = await Promise.all(m.map((y) => n.read(`task show ${y.id}`)));
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
      class: X(["message-links", { many: a.value > ca, three: a.value === ca, open: r.value }]),
      "data-message-links": ""
    }, [
      L(lt, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", Sm, [
        L(st, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      a.value >= ca ? (c(), h("span", _m, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          ne(w(a.value) + " linked " + w(s.value) + " ", 1),
          L(vt, { open: r.value }, null, 8, ["open"])
        ], 8, Em)
      ])) : C("", !0),
      r.value ? (c(), h("div", Am, [
        (c(!0), h(K, null, te(e.links, (y) => (c(), h("button", {
          key: `${y.model}:${y.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (O) => f(y)
        }, [
          g("span", Om, w(y.model) + " " + w(y.id), 1),
          g("span", Tm, w(l.value[y.id]), 1)
        ], 8, Cm))), 128))
      ])) : C("", !0)
    ], 2));
  }
}, Bm = /* @__PURE__ */ J(Rm, [["__scopeId", "data-v-24868afd"]]), Im = ["title", "aria-label"], Lm = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Nm = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Dm = {
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
      (c(), h("svg", Lm, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", Nm)) : C("", !0)
      ]))
    ], 10, Im));
  }
}, Pm = /* @__PURE__ */ J(Dm, [["__scopeId", "data-v-6dc92808"]]);
function jm(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Ur(e, t = Date.now()) {
  const n = jm(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const qm = 36e5;
function V2(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / qm;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function zr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function ao(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const ua = (e) => String(e).padStart(2, "0");
function Fm(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ua(t % 60)}s` : `${Math.floor(t / 3600)}h ${ua(Math.floor(t % 3600 / 60))}m ${ua(t % 60)}s`;
}
const Wm = "img,pre,table";
function Hm(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Um(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function zm(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Wm)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = Hm(Um(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function Vm(e, t) {
  let n = null;
  const a = () => e.value && zm(e.value);
  Oe(() => {
    var o, r;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([l]) => {
      l.contentRect.width !== s && (s = l.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const Gm = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Km(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const Ym = ["data-incoming", "data-ref"], Jm = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Zm = { class: "message-body" }, Xm = ["title"], Qm = ["innerHTML"], e1 = ["title"], t1 = ["innerHTML"], n1 = {
  class: "message-faces",
  "data-message-faces": ""
}, a1 = ["title", "data-face", "onClick"], s1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, o1 = ["title", "data-reaction", "onClick"], r1 = {
  key: 0,
  class: "message-reaction-count"
}, l1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, i1 = ["href", "title"], c1 = ["src", "alt"], u1 = ["href"], d1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, f1 = ["data-sent-worker", "title", "onClick"], h1 = { class: "message-foot" }, m1 = { class: "message-time" }, p1 = {
  class: "message-id",
  "data-message-id": ""
}, g1 = 140, v1 = 2, y1 = 1500, w1 = "An earlier message", b1 = "about", k1 = "sent_to", x1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var $;
    const n = e, a = t, s = I(!1), o = I(null), r = B(() => ["user", "comment"].includes(n.message.type)), l = B(() => {
      const [V, Z] = (n.message.commented_row || ":").split(":"), Y = Ge(V);
      return Y ? { ref: `${Y}:${Z}`, label: `${Dt(Y).title.toLowerCase()} ${Z}` } : null;
    }), i = B(() => n.message.worker_id ?? null), u = I(!1), d = B(() => i.value !== null && ((n.message.text ?? "").length > g1 || (n.message.text ?? "").split(`
`).filter((V) => V.trim()).length > v1)), f = B(() => r.value && !n.message.read_at && !n.message.local);
    async function m() {
      var V;
      await ((V = navigator.clipboard) == null ? void 0 : V.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, y1);
    }
    const v = Cr(), y = B(() => v(n.message.text ?? "")), O = B(() => JSON.parse(n.message.flowchart_edges || "[]")), b = I(!1), N = B(() => v(n.quote || w1));
    function z() {
      const V = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      V ? V.scrollIntoView({ block: "center", behavior: "smooth" }) : Pe(`messages:${n.message.parent_id}`);
    }
    Vm(o, () => `${n.message.text} ${n.quote}`);
    const ee = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, j = (V) => `/api/files/message/${n.message.id}/${encodeURIComponent(V)}`, M = B(() => JSON.parse(n.message.captions || "{}")), S = B(() => (n.message.files ?? []).map((V) => ({ name: V, address: j(V), isImage: ee.test(V), title: M.value[V] || V }))), R = B(() => zr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), A = $e(Se, null), x = I([]), T = I([]);
    async function k() {
      if (!r.value || !(A != null && A.read) || n.message.local) return;
      const V = await A.read(`link list --source message:${n.message.id}`);
      if (!V.ok) return;
      const Z = V.value.rows ?? V.value ?? [];
      x.value = Z.filter((Y) => Y.link_type === b1).map((Y) => ({ model: Y.target_model, id: Y.target_id })), T.value = Z.filter((Y) => Y.link_type === k1).map((Y) => Y.target_id);
    }
    k(), ($ = A == null ? void 0 : A.follow) == null || $.call(A, ["link.*"], k);
    const p = I(!1), _ = B(() => Km(n.message.reactions));
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
      L(Mm, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: Z[0] || (Z[0] = (Y) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Ym)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", Zm, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: X(["message-card", "md", { comment: l.value }]),
          onClick: Z[6] || (Z[6] = (...Y) => q(Tt) && q(Tt)(...Y))
        }, [
          l.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${l.value.label}`,
            onClick: Z[1] || (Z[1] = we((Y) => q(Pe)(l.value.ref), ["stop"]))
          }, [
            L(me, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + w(l.value.label), 1)
          ], 8, Xm)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: we(z, ["stop"]),
            innerHTML: N.value
          }, null, 8, Qm)) : C("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: Z[2] || (Z[2] = we((Y) => q(Pe)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + w(i.value), 9, e1)) : C("", !0),
          g("div", {
            class: X({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: y.value
          }, null, 10, t1),
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
            b.value ? (c(), W(lm, {
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
            g("div", n1, [
              (c(!0), h(K, null, te(q(Gm), (Y) => (c(), h("button", {
                key: Y,
                type: "button",
                class: "message-face",
                title: `React ${Y}`,
                "data-face": Y,
                onClick: (ie) => E(Y)
              }, w(Y), 9, a1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: Z[7] || (Z[7] = (Y) => p.value = !1)
            }, [
              L(me, {
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
      _.value.length ? (c(), h("div", s1, [
        (c(!0), h(K, null, te(_.value, (Y) => (c(), h("button", {
          key: Y.emoji,
          type: "button",
          class: X(["message-reaction", { mine: Y.mine }]),
          title: Y.title,
          "data-reaction": Y.emoji,
          onClick: (ie) => a("react", e.message, Y.emoji)
        }, [
          ne(w(Y.emoji) + " ", 1),
          Y.count > 1 ? (c(), h("span", r1, w(Y.count), 1)) : C("", !0)
        ], 10, o1))), 128))
      ])) : C("", !0),
      S.value.length ? (c(), h("div", l1, [
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
            }, null, 8, c1)
          ], 8, i1)) : (c(), h("a", {
            key: 1,
            href: Y.address,
            target: "_blank",
            class: "message-file"
          }, w(Y.name), 9, u1))
        ], 64))), 128))
      ])) : C("", !0),
      T.value.length ? (c(), h("div", d1, [
        L(me, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, te(T.value, (Y) => (c(), h("button", {
          key: Y,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": Y,
          title: `Open worker ${Y}`,
          onClick: we((ie) => q(Pe)(`agents:${Y}`), ["stop"])
        }, "Also sent to worker " + w(Y), 9, f1))), 128))
      ])) : C("", !0),
      g("div", h1, [
        g("time", m1, w(R.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          Z[11] || (Z[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", p1, "message " + w(e.message.id), 1)
        ], 64)) : C("", !0),
        r.value ? (c(), W(Pm, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      x.value.length ? (c(), W(Bm, {
        key: 3,
        links: x.value
      }, null, 8, ["links"])) : C("", !0)
    ], 8, Jm));
  }
}, G2 = /* @__PURE__ */ J(x1, [["__scopeId", "data-v-2b3e68eb"]]), $1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const l = Yl("SkeletonParts", !0);
      return c(!0), h(K, null, te(e.parts, (i, u) => (c(), h(K, { key: u }, [
        (c(!0), h(K, null, te(i.count, (d) => (c(), W(Nt, {
          key: d,
          value: i.shape
        }, {
          line: D(() => [
            L(Ht, {
              class: "shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: i.width, height: `${t[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          circle: D(() => [
            L(Ht, {
              class: "shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 8, ["style"])
          ]),
          block: D(() => [
            L(Ht, {
              class: "shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: i.width, height: `${i.height}px` })
            }, null, 8, ["style"])
          ]),
          grow: D(() => [...r[0] || (r[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: D(() => [
            g("div", {
              class: "skeleton-row",
              style: fe(a(i))
            }, [
              L(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(a(i))
            }, [
              L(l, {
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
              L(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            g("div", {
              class: "skeleton-grid",
              style: fe(s(i))
            }, [
              L(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), M1 = /* @__PURE__ */ J($1, [["__scopeId", "data-v-fa8baeaf"]]), S1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, _1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", S1, [
      L(M1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ps = /* @__PURE__ */ J(_1, [["__scopeId", "data-v-52f66b64"]]), Ln = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], da = 200, Vr = (e) => {
  var t;
  return ((t = Ln.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Ln[0].key;
}, K2 = (e) => {
  var t;
  return ((t = Ln.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, E1 = ["aria-label"], A1 = 300, so = 400, C1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: da } },
  setup(e) {
    const t = e, n = B(() => Vr(t.value)), a = B(() => n.value < da ? [1, 0.25, 0.25] : n.value === da ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: X(["ico", "prio", { hot: n.value >= so, high: n.value >= A1 && n.value < so }]),
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
    ], 10, E1));
  }
}, Y2 = /* @__PURE__ */ J(C1, [["__scopeId", "data-v-b10e610f"]]), oo = (e) => [...new Set(e.agents.map((t) => t.name))], J2 = (e) => oo(e).length === 1 ? `Worker: ${oo(e)[0]}` : "Delegated", O1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, ro = (e) => O1[e.card.state] || "idle", T1 = (e, t) => e.n - t.n || e.type.localeCompare(t.type) || e.key.localeCompare(t.key), lo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, io = (e, t) => lo[ro(e)] - lo[ro(t)], co = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, Z2 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => io(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || T1(a, s)) : [...e].sort((a, s) => io(a, s) || (co[t] || co.state)(a, s)), R1 = { class: "list-row" }, B1 = {
  key: 0,
  class: "list-row-type"
}, I1 = { class: "list-row-main" }, L1 = {
  key: 0,
  class: "list-row-title"
}, N1 = { class: "list-row-body" }, D1 = {
  key: 1,
  class: "list-row-end"
}, P1 = {
  key: 1,
  class: "list-row-text"
}, j1 = {
  __name: "ListRow",
  props: {
    type: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", R1, [
      e.type ? (c(), h("span", B1, w(e.type), 1)) : C("", !0),
      g("div", I1, [
        e.title ? (c(), h("span", L1, w(e.title), 1)) : C("", !0),
        g("div", N1, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", D1, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", P1, w(e.text), 1)) : C("", !0)
    ]));
  }
}, X2 = /* @__PURE__ */ J(j1, [["__scopeId", "data-v-dfc8c3a7"]]), q1 = {
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
}, F1 = { claude: "Claude Code", codex: "Codex" }, W1 = ["aria-expanded"], H1 = { class: "drop-label" }, U1 = ["value"], z1 = {
  key: 1,
  class: "drop-lead"
}, V1 = { class: "drop-item-text" }, G1 = {
  key: 2,
  class: "drop-note"
}, K1 = {
  key: 1,
  class: "drop-none"
}, Y1 = {
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
        g("span", H1, w(e.label), 1),
        L(me, {
          name: "down",
          size: 11
        })
      ], 10, W1),
      s.value ? (c(), W(zn, {
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
          }, null, 40, U1)) : C("", !0),
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
              f.lead ? (c(), h("span", z1, w(f.lead), 1)) : C("", !0),
              g("span", V1, w(f.label), 1),
              f.note ? (c(), h("span", G1, w(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          l.value.length ? C("", !0) : (c(), h("p", K1, w(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, J1 = /* @__PURE__ */ J(Y1, [["__scopeId", "data-v-29dfcce5"]]), Q2 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(() => [
      ...q1[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = B(() => (s.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, l) => (c(), W(J1, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${q(F1)[e.provider]} model`,
      onPick: l[0] || (l[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Z1 = ["aria-label"], X1 = { class: "head" }, Q1 = { class: "names" }, ep = { class: "body" }, tp = {
  key: 0,
  class: "foot"
}, np = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = dr(a, n), l = fr(s);
    return (i, u) => (c(), W(as, { to: "body" }, [
      L(Lt, {
        name: "side",
        appear: "",
        onAfterLeave: q(r)
      }, {
        default: D(() => [
          q(s) ? (c(), h("div", {
            key: 0,
            class: X(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: q(l) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = we((...d) => q(o) && q(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: X(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                g("header", X1, [
                  g("div", Q1, [
                    g("h2", null, w(e.title), 1),
                    e.abstract ? (c(), W(st, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  ce(i.$slots, "actions", {}, void 0, !0),
                  L(cs, {
                    title: e.closeLabel,
                    onClick: q(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", ep, [
                  ce(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", tp, [
                  ce(i.$slots, "foot", {}, void 0, !0)
                ])) : C("", !0)
              ], 64)) : ce(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, Z1)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, e5 = /* @__PURE__ */ J(np, [["__scopeId", "data-v-c9a3f43a"]]), ap = {
  key: 1,
  class: "text-field-label"
}, sp = {
  key: 2,
  class: "text-field-end"
}, op = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ba({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ra(e, "modelValue"), a = Un(), s = "onUpdate:modelValue" in (((d = Jl()) == null ? void 0 : d.vnode.props) || {}), o = B(() => s ? n.value : a.value), r = (f) => s && (n.value = f.target.value), l = B(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = B(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: X(["text-field", { large: e.large, ended: f.$slots.end }, q(a).class]),
      style: fe(q(a).style)
    }, [
      e.icon ? (c(), W(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", ap, w(e.label), 1)) : C("", !0),
      Je(g("input", Ye({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, l.value, { onInput: r }), null, 16), [
        [q(ja), o.value]
      ]),
      f.$slots.end ? (c(), h("span", sp, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : Je((c(), h("input", Ye({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: r }), null, 16)), [
      [q(ja), o.value]
    ]);
  }
}), t5 = /* @__PURE__ */ J(op, [["__scopeId", "data-v-d9c38ca8"]]);
async function rp(e, t, n) {
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
const uo = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function n5(e) {
  const t = ct().sources.find((n) => n.key === e);
  return t ? Va(t.read, t.events) : Va("", []);
}
function Va(e, t, { incremental: n = !1 } = {}) {
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
    d.value = uo(A.value, a);
    const x = new Set(o.value.map((T) => T.id));
    return o.value = [...o.value, ...A.value.rows.filter((T) => !x.has(T.id))], !0;
  }
  let b = 0;
  async function N(S) {
    const R = ++b, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (R !== b) return;
    const x = A.ok ? s.shared ? [A.value] : A.value.rows : [];
    A.ok && (o.value = S(x)), r.value = A.ok ? A.value : null;
    const T = x.length ? Math.min(...x.map((k) => k.id)) : 0;
    A.ok && !o.value.some((k) => k.id < T) && (d.value = !s.shared && uo(A.value, a)), l.value = A.ok ? "" : A.error, rs(u, () => i.value = !0);
  }
  function z() {
    return N((S) => {
      if (!n || !S.length) return S;
      const R = Math.min(...S.map((x) => x.id)), A = Math.max(...S.map((x) => x.id));
      return [...o.value.filter((x) => x.id > A), ...S, ...o.value.filter((x) => x.id < R)];
    });
  }
  const ee = () => N((S) => S);
  async function j(S, R = null) {
    const A = await rp(R && { target: o, fields: { value: R(o.value) } }, S, s.run);
    return f.value = A.ok ? "" : A.error, m.value = A.ok ? A.value : null, await z(), A;
  }
  return e && (s.follow(t, y), z()), { rows: o, listing: r, failure: l, loaded: i, more: d, load: z, loadLatest: ee, older: O, act: j, actionFailure: f, answer: m, context: s };
}
const lp = { class: "title" }, ip = { class: "state" }, cp = {
  __name: "StateRows",
  props: {
    noun: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Va(t.line, t.events);
    return (o, r) => (c(), W(ad, {
      rows: q(n),
      failure: q(a),
      loaded: q(s),
      empty: e.empty
    }, {
      default: D(({ row: l }) => [
        g("span", lp, w(l.title), 1),
        g("span", ip, w(q(sr)(e.noun, l.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, a5 = /* @__PURE__ */ J(cp, [["__scopeId", "data-v-9191a6f0"]]);
function up(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Re(() => clearInterval(a)), n;
}
const fa = I(Date.now() / 1e3);
let fo = 0, yn = 0;
function Gr() {
  return yn || (fa.value = Date.now() / 1e3, fo = setInterval(() => fa.value = Date.now() / 1e3, 1e3)), yn += 1, Fo() && Wo(() => {
    yn -= 1, yn || clearInterval(fo);
  }), fa;
}
const dp = 200, fp = Fr + _n + Wr + dp;
function jt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function hp(e, t, n) {
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
function mp(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const r = performance.now(), l = [];
    function i() {
      if (a.markMotion.value) {
        if (l.push(hp(o, r, n.value)), performance.now() - r < fp) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: l })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const pp = ["title", "data-figure-mark", "data-folded", "data-open"], gp = {
  key: 2,
  class: "worker"
}, vp = { class: "head" }, yp = { key: 0 }, wp = {
  key: 3,
  class: "status"
}, bp = {
  key: 0,
  class: "figure"
}, kp = {
  key: 1,
  class: "ran-for"
}, xp = { key: 2 }, $p = {
  key: 3,
  class: "news"
}, Mp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Sp = {
  key: 6,
  class: "settled"
}, _p = {
  key: 1,
  class: "bar"
}, Ep = {
  key: 3,
  class: "detail body"
}, Ap = {
  key: 0,
  class: "body-label"
}, Cp = ["title"], Op = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Un(), a = ["onClick", "onAct"], s = B(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = I(!1), r = B(() => !!(t.mark.detail || t.mark.command || t.mark.body)), l = B(() => t.open !== void 0), i = B(() => l.value || r.value), u = B(() => l.value ? t.open : o.value), d = B(() => l.value ? !t.open : r.value && !o.value), f = B(() => !!(t.mark.action && n.onAct)), m = B(() => i.value || f.value || !!n.onClick), v = I(null), y = I(null), { folded: O, phase: b } = Hr(v, () => d.value);
    mp(v, d, b, $e(Se, null));
    function N(ie) {
      var ve, Te;
      if (!(ie.target !== v.value && !y.value.contains(ie.target))) {
        if (l.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (r.value) return void (o.value = !o.value);
        (Te = n.onAct || n.onClick) == null || Te(ie);
      }
    }
    const z = (ie) => n.onAct(ie), ee = ["failed", "unfinished"], j = B(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), M = B(() => t.mark.color ? t.mark.color : j.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : j.value ? `var(--tone-${j.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), S = B(() => M.value || "var(--tone-work)"), R = B(() => !t.mark.ending && !t.mark.ended && j.value !== "stopped"), A = Gr(), x = B(
      () => t.mark.began_at && R.value && !t.mark.figure && !t.mark.counting ? Fm(A.value - t.mark.began_at) : ""
    ), T = B(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${ao(ve - ie, !0)}` : ao(A.value - ie, !0) : x.value;
    }), k = ["bad", "danger", "warn"], p = B(() => k.includes(j.value) || t.mark.asks ? "attention" : R.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), _ = ["bad", "danger"], E = B(() => _.includes(j.value)), $ = B(() => p.value === "process" ? "running" : E.value ? "cross" : j.value === "stopped" ? "stopped" : j.value === "good" ? "tick" : ""), V = B(
      () => !!(t.mark.figure || T.value || t.mark.docked || t.mark.stopping || $.value || t.mark.settled || t.mark.news)
    ), Z = B(() => [t.mark.title, t.mark.time ? zr(t.mark.time) : ""].filter(Boolean).join(" · ")), Y = B(() => ({
      ...M.value ? { "--mark": M.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ve) => (c(), h("div", Ye(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        q(b),
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
      "data-folded": q(O) ? "" : null,
      "data-open": l.value && e.open ? "" : null,
      onClick: N
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
          e.mark.worker ? (c(), h("span", gp, w(e.mark.worker), 1)) : C("", !0),
          g("span", vp, [
            L(st, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", yp, w(e.mark.name), 1)) : C("", !0),
            i.value ? (c(), W(vt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          V.value ? (c(), h("span", wp, [
            e.mark.figure ? (c(), h("span", bp, w(e.mark.figure), 1)) : C("", !0),
            T.value ? (c(), h("span", kp, w(T.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", xp, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", $p, w(e.mark.news), 1)) : C("", !0),
            $.value === "running" ? (c(), h("span", Mp)) : $.value ? (c(), W(lt, {
              key: 5,
              class: X(["sign", $.value]),
              name: $.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", Sp, w(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), W(qr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: we(z, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && R.value ? (c(), h("span", _p, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: S.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !q(O) ? (c(), W(st, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !q(O) ? (c(), h("div", Ep, [
        e.mark.bodyLabel ? (c(), h("p", Ap, w(e.mark.bodyLabel), 1)) : C("", !0),
        L(st, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !q(O) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, w(e.mark.command), 9, Cp)) : C("", !0),
      e.mark.card ? (c(), W(st, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ce(ie.$slots, "default", {
        shown: !q(O)
      }, void 0, !0)
    ], 16, pp));
  }
}), Kr = /* @__PURE__ */ J(Op, [["__scopeId", "data-v-2aa9c496"]]), Tp = 60;
function Rp(e, t) {
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
    if (r || a.value <= 0 || d.scrollTop > Tp) return;
    r = !0;
    const f = d.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(a.value)]);
    r = !1, m.ok && (n.value = [...m.value.lines, ...n.value], a.value = m.value.first_byte, await it(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: l, follow: i, loadEarlier: u };
}
const Bp = { outputs: "output", skills: "skill", agents: "agent", helpers: "agent", pages: "page" };
function Yr(e) {
  var n;
  const t = Bp[e] || ((n = Dt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Ip = (e) => Yr(String(e).split(":")[0]), Jr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Lp = { passed: "good", failed: "danger", warned: "warn", running: "" }, Np = { good: "good", warn: "warn", danger: "danger" }, ho = {
  "open row": (e) => Pe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Gu(e.target_model, e.target_id || 0)
}, Dp = { "open row": (e) => Ip(e.target_model), "open page": () => Yr("pages") };
function Pp(e, t) {
  const n = t || {}, a = ho[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Lp[e.outcome] || "" : Np[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Dp[a](e) : "",
    handlers: a ? { onAct: () => ho[a](e) } : {}
  };
}
const jp = 2e3;
function qp(e, t, n = jp) {
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
const Fp = 24, Wp = 1e3, mo = 2e3, Hp = 0.25, Up = 5e3;
function zp(e, t = Fp, n = () => !0) {
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
    const M = Date.now() - i < mo ? mo : Wp;
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
    N(), !a.value && (a.value = !0, m(!0));
  }
  const b = () => !!u() && d() <= u().clientHeight * Hp;
  function N() {
    clearTimeout(l), b() && (l = setTimeout(() => a.value && b() && n() && y(!0), Up));
  }
  function z() {
    f() ? v() : O();
  }
  function ee(j = 1, M = !1) {
    a.value ? s.value += Math.max(0, j) : y(M);
  }
  return Fo() && Wo(() => [r, l].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: y, left: O, scrolled: z, arrived: ee };
}
const Vp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Gp = (e) => String(e ?? "").replace(Vp, ""), Kp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(null), { away: o, scrolled: r, arrived: l, toBottom: i } = zp(s);
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
      ne(w(q(Gp)(e.lines.join(`
`)) || e.empty), 1),
      q(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => q(i)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, Yp = /* @__PURE__ */ J(Kp, [["__scopeId", "data-v-c2fb1783"]]), Jp = 1e4;
class Zp {
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
    return this.heardAt !== null && t - this.heardAt > Jp;
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
const Xp = {
  key: 0,
  class: "frame-note"
}, Qp = {
  key: 0,
  class: "frame-note"
}, eg = ["src", "title"], tg = 1e3, ng = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ct(), a = I(null), s = I(!1), o = I(!1);
    let r = null, l = 0;
    return Oe(() => {
      r = new Zp(a.value, n), r.start(), l = setInterval(() => {
        s.value = r.silent();
      }, tg);
    }), Re(() => {
      r == null || r.stop(), clearInterval(l);
    }), (i, u) => o.value ? (c(), h("p", Xp, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      s.value ? (c(), h("div", Qp, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        L(ue, {
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
        title: q(n).window
      }, null, 8, eg)
    ], 64));
  }
}, ag = /* @__PURE__ */ J(ng, [["__scopeId", "data-v-32a49046"]]), wn = (e) => e ? e.split(", ") : [];
function sg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
function og(e, t) {
  return {
    reads: wn(e.reads_allowed),
    runs: wn(e.runs_allowed),
    missing: [...wn(e.reads_missing), ...wn(e.runs_missing)],
    ask: t
  };
}
const rg = {
  class: "allowance-prompt",
  role: "dialog"
}, lg = { class: "allowance-prompt-text" }, ig = { class: "allowance-prompt-buttons" }, cg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", rg, [
      g("p", lg, w(q(sg)(e.request)), 1),
      g("div", ig, [
        L(ue, {
          variant: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            ne("Allow", -1)
          ])]),
          _: 1
        }),
        L(ue, {
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
}, ug = /* @__PURE__ */ J(cg, [["__scopeId", "data-v-cad69fe2"]]), ha = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), W(Jt, {
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
}, dg = ["data-window", "data-agent"], fg = {
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
    const l = $e(_i, null), i = Hc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: B(() => n.options),
      declared: n.declared,
      page: $e(Nc, null),
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
    Zl(Se, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Oe(i.settle), Re(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Xl((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Hn(n.component), d = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), W(ug, {
        key: 0,
        request: d(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : C("", !0),
      e.unavailableReason ? (c(), W(ha, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), W(ha, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(K, { key: 4 }, [
        (c(), W(u, { key: o.value })),
        e.skeleton.length && !q(i).answered.value ? (c(), W(ps, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (c(), W(ha, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, dg));
  }
}, zt = /* @__PURE__ */ J(fg, [["__scopeId", "data-v-c4443e2b"]]), Zr = {
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
    const n = e, a = t, s = { render: () => Hn(ag, { src: n.entry.entry_url }) };
    return (o, r) => (c(), W(zt, {
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
}, hg = ["data-window"], Xr = {
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
            )).default, Zi();
          } catch (l) {
            if (Yi(l) && Ji(l)) return;
            o.value = `This window's file could not be loaded: ${l.message}`;
          }
      },
      { immediate: !0 }
    ), (r, l) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      L(ps, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, hg)) : (c(), W(zt, {
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
}, mg = "*.*", pg = {
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
    const t = e, n = $e(Se, null), a = new Oc();
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
      events: r.value ? [mg] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => r.value ? (c(), W(Xr, {
      key: 0,
      entry: l.value,
      subscriptions: q(a),
      environment: q(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), W(Zr, {
      key: 1,
      entry: l.value,
      subscriptions: q(a),
      environment: q(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, gg = { class: "mark-more-inner" }, vg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, yg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, wg = {
  key: 3,
  class: "mark-lines"
}, bg = "process", po = "task", kg = {
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
    ), s = B(() => Jr.has(t.mark.variant) && t.mark.detail || ""), o = B(() => t.mark.target_model === po ? t.mark.target_id : 0), r = Rp(
      (v) => n.run(v),
      () => t.mark.target_id
    ), l = r.lines, i = I(!1), u = I(""), d = B(() => !t.declaration.body_url && t.mark.target_model === bg && !!t.mark.target_id);
    async function f(v = r.follow) {
      const y = await v();
      i.value = !0, u.value = y.ok ? "" : y.error;
    }
    const m = B(() => t.shown && d.value);
    return he(m, (v) => v && f()), qp(() => m.value && f(), () => m.value && !t.mark.ended_at), he(
      () => t.mark.ended_at,
      (v) => v && m.value && f(r.newest)
    ), (v, y) => (c(), h("div", {
      class: X(["mark-more", { open: e.shown }]),
      onClick: y[1] || (y[1] = we(() => {
      }, ["stop"]))
    }, [
      g("div", gg, [
        e.declaration.body_url ? (c(), W(pg, {
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
            g("p", vg, w(s.value), 1)
          ], 64)) : C("", !0),
          d.value && u.value ? (c(), h("p", yg, w(u.value), 1)) : d.value && i.value ? (c(), h(K, { key: 2 }, [
            y[3] || (y[3] = g("p", { class: "mark-label" }, "Output", -1)),
            L(Yp, {
              class: "mark-terminal",
              lines: q(l),
              onOlder: q(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", wg, w(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: y[0] || (y[0] = we((O) => q(Pe)(`${po}:${o.value}`), ["stop"]))
          }, " Open task " + w(o.value) + " and its proofs ", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ga = /* @__PURE__ */ J(kg, [["__scopeId", "data-v-f4d037e5"]]), xg = ["title", "aria-label", "onClick"], $g = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Mg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = B(() => bu(t.buttons, t.allowedRuns).filter((r) => {
      var l;
      return !((l = r.variants) != null && l.length) || r.variants.includes(t.mark.variant);
    })), a = I(""), s = $e(Se);
    async function o(r) {
      const l = await sn(r, { id: t.mark.target_id }, s.environment);
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
        L(lt, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, xg))), 128)),
      a.value ? (c(), h("span", $g, w(a.value), 1)) : C("", !0)
    ], 64));
  }
}, Sg = /* @__PURE__ */ J(Mg, [["__scopeId", "data-v-7a62c88e"]]);
function Qr(e, t) {
  const n = ze(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((r) => [r.type, r])), s = async () => {
    try {
      return (await (await Ae.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const el = Qr("/api/marks", "marks"), s5 = el.fetchAll, _g = el.find, Eg = ["data-ref"], Ag = ["data-ref"], Cg = { class: "mark-row" }, Og = "dock add", Tg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = B(() => _g(a.mark.type)), o = B(() => Pp(a.mark, s.value)), r = B(() => {
      var d;
      return !!(a.mark.lines || a.mark.detail && Jr.has(a.mark.variant) || t.has(a.mark.target_model) || (d = s.value) != null && d.body_url);
    }), l = I(!1);
    function i(d) {
      if (o.value.handlers.onAct && !d.target.closest(".fold")) return o.value.handlers.onAct();
      l.value = !l.value;
    }
    const u = B(() => {
      var d;
      return (((d = s.value) == null ? void 0 : d.buttons) || []).filter((f) => {
        var m;
        return !a.docked || !((m = f.runs) != null && m.startsWith(Og));
      }).map((f) => ({ ...f, module: s.value.module }));
    });
    return (d, f) => {
      var m, v;
      return (m = s.value) != null && m.card ? (c(), h("div", {
        key: 0,
        class: X(["thread-turn", "card", "whole-card", { "user-side": q(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        L(Ga, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Eg)) : (c(), h("div", {
        key: 1,
        class: X(["thread-turn", "card", { "full-width": (v = s.value) == null ? void 0 : v.full_width, docked: e.docked, "user-side": q(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Cg, [
          L(Kr, Ye({
            mark: o.value,
            open: r.value ? l.value : void 0
          }, Ql(o.value.handlers), { onClick: i }), ei({ _: 2 }, [
            r.value ? {
              name: "default",
              fn: D(({ shown: y }) => [
                L(Ga, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: y
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          L(Sg, {
            buttons: u.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Ag));
    };
  }
}, Rg = /* @__PURE__ */ J(Tg, [["__scopeId", "data-v-8196402d"]]), Bg = ["data-ref"], Ig = ["inert"], Lg = { class: "group-fold" }, Ng = { class: "thread-group" }, Dg = {
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
      L(Kr, {
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
        g("div", Lg, [
          g("div", Ng, [
            (c(!0), h(K, null, te(e.group.marks, (u) => (c(), W(Rg, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Ig)) : C("", !0)
    ], 8, Bg));
  }
}, o5 = /* @__PURE__ */ J(Dg, [["__scopeId", "data-v-45b58b9b"]]);
function Pg(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Oe(() => n.observe(e.value)), xt(() => n.disconnect()), t;
}
const jg = { class: "chat-dock-fold" }, qg = ["aria-label"], Fg = { class: "chat-dock-head" }, Wg = { class: "chat-dock-inner" }, Hg = { class: "chat-dock-foot" }, tl = 700, Ug = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, collapsed: Boolean, body: Boolean, lifted: Boolean, type: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), a = I(null), s = Pg(a), o = I(!1);
    let r = 0;
    return Oe(() => r = setTimeout(() => o.value = !0, tl)), xt(() => clearTimeout(r)), t({ card: n }), (l, i) => (c(), h("div", {
      class: X(["chat-dock", { lifted: e.lifted, collapsed: e.collapsed }])
    }, [
      g("div", jg, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: X(["chat-dock-card", e.type]),
          "aria-label": e.label
        }, [
          ce(l.$slots, "edge", {}, void 0, !0),
          g("header", Fg, [
            ce(l.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: X(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", Wg, [
              g("div", {
                class: X(["chat-dock-grow", { settled: o.value }]),
                style: fe(q(s) === null ? null : { height: `${q(s)}px` })
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
          g("footer", Hg, [
            ce(l.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, qg)
      ])
    ], 2));
  }
}, nl = /* @__PURE__ */ J(Ug, [["__scopeId", "data-v-74d44b19"]]), zg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ma = 5, Vg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ma, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${ma}s`, animationDelay: `${(n - ma).toFixed(2)}s` };
    return (s, o) => (c(), h("span", zg, [
      g("i", { style: a })
    ]));
  }
}, al = /* @__PURE__ */ J(Vg, [["__scopeId", "data-v-2a7bc150"]]), Gg = { reviewing: "Under review" }, Kg = (e, t) => e || Gg[t == null ? void 0 : t.state] || "", Ue = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Yg = {
  draft: [{ word: "ready", label: "Mark ready" }, Ue],
  ready: [Ue],
  approved: [{ word: "start", label: "Start", main: !0 }, Ue],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ue],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ue],
  completed: [],
  cancelled: []
}, Jg = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ue],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ue],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ue],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ue],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Zg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Xg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Qg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], e0 = (e) => e ? e.state === "removed" ? [{ word: "restore", label: "Restore", main: !0 }] : [{ word: "remove", label: "Remove", flag: "--reason", ask: "Why is it removed?" }] : [], t0 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], n0 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function a0(e, t) {
  const n = { plan: Yg, task: Jg }[e], a = t != null && t.state ? Lc(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[or(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const s0 = (e, t) => e === "doc" || e === "report" ? n0(t).map((n) => ({ ...n, word: e === "doc" ? "settle" : n.word })) : e === "agent" ? [...Qg(t), ...Xg(t)] : e === "check" ? t0(t) : e === "question" ? Zg(t) : e === "memory" ? e0(t) : a0(e, t), sl = Qr("/api/docks", "docks"), r5 = sl.fetchAll, Ft = sl.find, o0 = 6, r0 = 3, pa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, Kn = (e) => Date.parse(e.leaves_at) / 1e3, pt = (e) => !!(e.leaves_at && !e.kept), l0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!pt(e) || t < Kn(e) || n.has(e.id)), i0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => l0(a, t, n)).sort((a, s) => a.id - s.id);
function c0(e, t, n = o0) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(Kn(o) > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const u0 = (e, t, n = e) => n < 2 ? !1 : e >= r0 ? !0 : t, d0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Ka = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), f0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), h0 = (e) => ({ ...e.kept ? Ka("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : Ka("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), m0 = ["pins"], p0 = (e) => ({ ...e, iconOnly: m0.includes(e.icon) });
function g0(e, t) {
  var n;
  return [
    ...f0(e, t) ? [h0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Dt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Ka("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(p0);
}
function v0(e, t) {
  const n = g0(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: d0(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const y0 = ["title"], w0 = {
  key: 2,
  class: "dock-controls"
}, b0 = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, k0 = { class: "dock-facts" }, x0 = { key: 1 }, $0 = {
  key: 2,
  class: "dock-kept"
}, M0 = { class: "dock-acts" }, S0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, collapsed: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock", "open"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = B(() => Ft(a.item.type)), o = Gr(), r = B(() => Ur(a.item.created_at, o.value * 1e3)), l = I(null), i = I(null), u = I(null), d = I(null), f = B(() => v0(a.item, s.value)), m = $e(Se), v = I(null);
    let y = 0;
    async function O() {
      var T, k;
      const S = ++y, R = Ut(a.item.target_model ?? ""), A = `${R} show`;
      if (!((k = (T = s.value) == null ? void 0 : T.reads) != null && k.includes(A))) return;
      const x = await at(a.item.type, [R, "show", String(a.item.target_id)], m.environment, m.signal);
      S === y && (v.value = x.ok ? { ...x.value, id: a.item.target_id, noun: R } : { id: a.item.target_id, noun: R });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (S, R, A) => {
        var k;
        const x = Ut(a.item.target_model ?? "");
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
    const b = I(/* @__PURE__ */ new Set()), N = I("");
    async function z(S) {
      if (S.action === "open") return Pe(`${a.item.target_model}:${a.item.target_id}`);
      S.action === "declared" && (b.value = /* @__PURE__ */ new Set([...b.value, S.label])), N.value = "";
      const A = await sn(S, { id: a.item.target_id }, m.environment);
      (A == null ? void 0 : A.ok) === !1 && (b.value = new Set([...b.value].filter((x) => x !== S.label)), N.value = `Could not ${S.label.toLowerCase()}: ${A.error}`);
    }
    const ee = B(() => f.value.actions.filter((S) => S.action !== "undock" && !b.value.has(S.label))), j = B(() => {
      var S;
      return Kg((S = s.value) == null ? void 0 : S.badge, v.value);
    }), M = B(() => f.value.buttons.find((S) => S.action === "undock"));
    return (S, R) => {
      var A, x, T, k;
      return c(), W(nl, {
        label: f.value.title + ((A = s.value) != null && A.needs_user ? ", waiting for you" : ""),
        type: (x = s.value) != null && x.needs_user ? "waiting" : "",
        folded: !!((T = s.value) != null && T.folds) && e.folded,
        body: !!((k = s.value) != null && k.folds),
        collapsed: e.collapsed,
        "data-figure-closing": e.leaving ? "" : null,
        onClick: R[3] || (R[3] = (p) => e.collapsed && n("open"))
      }, {
        edge: D(() => [
          e.leaving && !e.item.kept ? (c(), W(al, {
            key: 0,
            "ends-at": q(Kn)(e.item)
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
              L(me, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, w(f.value.title), 9, y0)
            ], 64)),
            f.value.controls.length && !e.collapsed ? (c(), h("span", w0, [
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
                      L(me, {
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
          N.value || e.refusal ? (c(), h("p", b0, w(N.value || e.refusal), 1)) : C("", !0)
        ]),
        foot: D(() => {
          var p, _;
          return [
            g("span", k0, [
              j.value ? (c(), h("span", {
                key: 0,
                class: X(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, w(j.value), 3)) : C("", !0),
              (p = s.value) != null && p.word ? (c(), h("span", x0, w(s.value.word), 1)) : C("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", $0, "Kept")) : C("", !0)
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
                L(vt, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : C("", !0),
            g("span", M0, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              L(Iu, {
                name: `dock.${e.item.type}`,
                row: v.value,
                environment: q(m).environment,
                "read-only": q(m).readOnly,
                "object-name": q(Ut)(e.item.target_model),
                "external-failure": "",
                onFailure: R[1] || (R[1] = (E) => N.value = E),
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
              L(ue, {
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
            (p = s.value) != null && p.body_url ? (c(), W(Ga, {
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
}, go = /* @__PURE__ */ J(S0, [["__scopeId", "data-v-68ee4c3c"]]), _0 = ["title", "aria-label"], E0 = { class: "run-chip-in" }, A0 = {
  key: 0,
  class: "run-chip-ring"
}, C0 = { class: "run-chip-name" }, O0 = { class: "run-chip-bar" }, T0 = "processes.output", R0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = $e(Se, null), o = (s == null ? void 0 : s.environment) ?? "", r = I(null), l = B(() => !r.value || r.value.state === "running" || r.value.state === "background"), i = B(() => {
      var m, v;
      return ((m = r.value) == null ? void 0 : m.title) || ((v = r.value) == null ? void 0 : v.line) || a.item.title || "";
    }), u = B(() => l.value ? t.running : t[r.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await at(T0, ["process", "card", String(a.item.target_id)], o, s == null ? void 0 : s.signal);
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
        q(pt)(e.item) ? (c(), W(al, {
          key: 0,
          "ends-at": q(Kn)(e.item)
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", E0, [
          l.value ? (c(), h("span", A0)) : (c(), W(lt, {
            key: 1,
            name: n[r.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", C0, w(i.value), 1)
        ]),
        g("span", O0, [
          g("i", {
            style: fe({ width: l.value ? `${((y = r.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: u.value })
          }, null, 4)
        ])
      ], 12, _0);
    };
  }
}, B0 = /* @__PURE__ */ J(R0, [["__scopeId", "data-v-f864bc58"]]), I0 = 24, L0 = 8, l5 = 420;
function i5({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= I0 ? !0 : e < t && s > L0 ? !1 : null;
}
const N0 = (e, t) => e === void 0 ? t : e, D0 = { me: 1, people: [] }, Nn = os({
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
  people: D0,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Tn("journal.activity", !0),
  wide: !1,
  sideMini: Tn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
br("journal.activity", () => Nn.activity);
br("journal.side.mini", () => Nn.sideMini);
const ol = "journal.viewer.";
function P0(e, t, n) {
  try {
    const a = n.getItem(ol + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function j0(e, t, n) {
  try {
    n.setItem(ol + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function vo(e, t, n = window.localStorage) {
  const a = I(P0(e, t, n));
  return he(a, (s) => j0(e, s, n), { deep: !0 }), a;
}
const q0 = {
  key: "dock-all",
  class: "dock-all"
}, F0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, W0 = { class: "dock-runs-title" }, H0 = { class: "dock-runs-chips" }, U0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean, collapsed: Boolean },
  setup(e) {
    var k, p;
    const t = e, n = up(500), a = I(/* @__PURE__ */ new Set()), s = I(!1), o = I(!1), r = $e(Se), l = I(/* @__PURE__ */ new Set()), i = I({});
    async function u(_, E) {
      i.value = { ...i.value, [_.id]: "" }, l.value = /* @__PURE__ */ new Set([...l.value, _.id]);
      const $ = await sn(E, { id: _.target_id }, r.environment);
      ($ == null ? void 0 : $.ok) === !1 && (l.value = new Set([...l.value].filter((V) => V !== _.id)), i.value = { ...i.value, [_.id]: `Could not close this card: ${$.error}` });
    }
    const d = B(
      () => i0(
        t.items.filter((_) => !l.value.has(_.id)),
        n.value,
        a.value
      )
    ), f = B(
      () => c0(
        d.value.filter((_) => pa(_, Ft)),
        n.value
      )
    ), m = B(() => d.value.filter((_) => !f.value.includes(_) && !pa(_, Ft))), v = B(() => f.value.filter((_) => !pt(_))), y = vo(`dock-size:${((k = Nn.identity) == null ? void 0 : k.root) || location.host}`, null), O = (_) => y.value ? y.value.collapsed && !y.value.opened.includes(_.id) : t.collapsed, b = B(() => d.value.some(O)), N = B(() => (s.value = u0(f.value.length, s.value, v.value.length)) && !o.value && !d.value.some(O));
    function z() {
      y.value = { collapsed: !b.value, opened: [] };
    }
    function ee(_) {
      var $;
      if (!O(_)) return;
      const E = ($ = y.value) != null && $.collapsed ? y.value.opened : [];
      y.value = { collapsed: !0, opened: [...E, _.id] };
    }
    const j = vo(`dock-folded:${((p = Nn.identity) == null ? void 0 : p.root) || location.host}`, {}), M = (_) => {
      var E;
      return !!((E = Ft(_.type)) != null && E.folds) && N0(j.value[_.id], pa(_, Ft) || t.folded);
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
    return (_, E) => (c(), W(qo, {
      tag: "div",
      name: "dock",
      duration: q(tl),
      class: "dock-stack"
    }, {
      default: D(() => [
        d.value.length > 1 ? (c(), h("div", q0, [
          L(ue, {
            small: "",
            bordered: "",
            "data-dock-all": "",
            onClick: z
          }, {
            default: D(() => [
              ne(w(b.value ? "Open all" : "Collapse all"), 1),
              L(vt, {
                open: !b.value
              }, null, 8, ["open"])
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(K, null, te(m.value, ($) => (c(), W(go, {
          key: $.id,
          item: $,
          class: X({ timed: q(pt)($) }),
          leaving: q(pt)($) && !a.value.has($.id),
          folded: M($),
          collapsed: O($),
          refusal: i.value[$.id],
          onOpen: (V) => ee($),
          onFold: (V) => S($),
          onUndock: (V) => u($, V),
          onMouseenter: (V) => x($),
          onMouseleave: (V) => T($)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value && !b.value ? (c(), h("div", F0, [
          g("span", null, w(f.value.length) + " runs", 1),
          L(ue, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: A
          }, {
            default: D(() => [
              E[1] || (E[1] = ne(" Runs ", -1)),
              L(vt, { open: "" })
            ]),
            _: 1
          })
        ])) : C("", !0),
        (c(!0), h(K, null, te(N.value ? [] : f.value, ($) => (c(), W(go, {
          key: $.id,
          item: $,
          class: X({ timed: q(pt)($) }),
          leaving: q(pt)($) && !a.value.has($.id),
          folded: M($),
          collapsed: O($),
          refusal: i.value[$.id],
          onOpen: (V) => ee($),
          onFold: (V) => S($),
          onUndock: (V) => u($, V),
          onMouseenter: (V) => x($),
          onMouseleave: (V) => T($)
        }, null, 8, ["item", "class", "leaving", "folded", "collapsed", "refusal", "onOpen", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        N.value ? (c(), W(nl, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          type: "dock-runs-row"
        }, {
          head: D(() => [
            L(me, {
              name: "runs",
              size: 14
            }),
            g("span", W0, w(f.value.length) + " runs", 1)
          ]),
          foot: D(() => [
            g("span", H0, [
              (c(!0), h(K, null, te(f.value, ($) => (c(), W(B0, {
                key: $.id,
                item: $,
                onClick: (V) => R($)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            L(ue, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: E[0] || (E[0] = ($) => o.value = !0)
            }, {
              default: D(() => [
                E[2] || (E[2] = ne(" Runs ", -1)),
                L(vt)
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
}, c5 = /* @__PURE__ */ J(U0, [["__scopeId", "data-v-ea618218"]]), gt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, En = (e) => Math.min(Math.max(e, 0), 1), z0 = (e) => {
  const t = En(e);
  return t * t * (3 - 2 * t);
}, dt = (e, t, n) => z0((e - t) / (n - t));
function u5(e) {
  const t = En(e), n = En((t - 0.12) / 0.76) * gt.shuffles, a = Math.min(Math.floor(n), gt.shuffles - 1), s = n - a, o = dt(s, 0.26, 0.38) * (1 - dt(s, 0.76, 0.96)), r = dt(s, 0.38, 0.76), l = dt(t, 0, 0.12) * (1 - dt(t, 0.88, 1)), i = dt(s, 0.2, 0.34) * (1 - dt(s, 0.84, 1)), u = Math.sin(Math.PI * En((s - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (a + r) / gt.shuffles, lift: gt.lift * o, ready: l, weight: i, follow: u, shuffle: a, phase: s };
}
function d5(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const yo = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, f5 = (e) => yo[e] ?? yo.butler, gs = 2400, V0 = 0.05;
function G0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, V0), r = Math.min(t + gs * o, s), l = e + r * o;
  return l < n ? { y: l, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function h5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function K0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function m5(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const p5 = (e, t) => ({ ...e, stretch: t.stretch }), g5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, rl = (e, t) => t >= (e.least ?? 0);
function v5(e, t, n) {
  if (!rl(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const y5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), Y0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", wo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), J0 = (e) => e.right > e.left && e.bottom > e.top;
function w5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(Y0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let l = wo(r, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (l = wo(l, i.getBoundingClientRect()), a && (l.bottom = Math.min(l.bottom, a.top))), J0(l) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: l }] : [];
  });
}
function ll(e, t, n) {
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
}, Xt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Z0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => Z0(Xt(e, t, n)), X0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ot = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, bn = ([e, t], n) => e + n() * (t - e);
function Q0(e) {
  return X0.map(() => {
    const t = bn(ot.speed, e), n = bn(ot.angle, e) * Math.PI / 180, a = bn(ot.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [bn(ot.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const ev = Q0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function tv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ot.gravity * (t[2] - ot.floor))) / ot.gravity;
}
function b5(e, t, n = ev) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], r = tv(o, a.from), l = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= r + l) return null;
  const i = Math.min(s, r), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= ot.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - r) / l };
}
const k5 = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function x5(e, t) {
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
const $5 = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), Bt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function M5(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [r, l] = [t.left + Bt.margin * n, t.right - Bt.margin * n], i = Math.min(Math.max(e + o + s * Bt.reach * n, r), l), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function S5(e, t, n) {
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
function _5(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Bt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = G0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ce = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function E5(e) {
  const t = Ce.least + Math.floor(e() * (Ce.most - Ce.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ce.walls[Math.floor(e() * Ce.walls.length)],
    along: Ce.margin + e() * (1 - 2 * Ce.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Ya(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ce.margin, r = ((e.along - Ce.margin + e.way * Ce.speed * n / a) / s % 2 + 2) % 2, l = Ce.margin + s * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + l * a, y: t.top + Ce.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ce.inset : t.right - Ce.inset, y: t.top + l * a, turn: e.wall === "left" ? 90 : -90 };
}
function nv(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, r = K0(e, o), l = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : l + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: l, shot: u };
}
function A5(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: r, bug: l, shot: i } = nv(n, e.length), u = e.map((N, z) => ({ ...Ya(N, t, Math.min(n / o.fps, An(z).shot)), shot: z < i })), d = Me(r / o.frames, o.aim), [f, m] = [u[Math.max(l - 1, 0)], u[l]], v = e.map((N, z) => ({ bug: N, index: z, seconds: n / o.fps - An(z).shot, spot: Ya(N, t, An(z).shot) })).filter((N) => N.seconds >= 0), y = v.flatMap((N) => {
    const z = (s == null ? void 0 : s.get(N.index)) ?? lv(N.bug, t, N.spot, s ? [] : a);
    return s == null || s.set(N.index, z), s && iv(z, N.seconds, a), cv(z, N.seconds, a);
  }), O = v.filter((N) => ov(N.bug)).map((N) => ({ seconds: N.seconds, from: N.spot })), b = +(e[Math.max(l - 1, 0)].wall === "top") * (1 - d) + +(e[l].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (m.x - f.x) * d, y: f.y + (m.y - f.y) * d, back: b }, slush: y, camera: O };
}
function An(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function C5(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [r, l] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = An(d), m = Ya(u, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(s * Math.PI / 180), y = m.x === i ? i - r >= l - i ? -1 : 1 : Math.sign(i - m.x), O = Math.abs(m.x - i) >= v ? i : m.x + y * v, b = y > 0 ? Math.max(i, Math.min(O, l)) : Math.min(i, Math.max(O, r)), N = { from: i, to: b, begin: f.walk, end: f.aim };
    return i = b, N;
  });
}
function O5(e, t, n) {
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
const be = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, av = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function sv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const ov = (e) => e.along * 97 % 1 < be.camera, Qt = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * be.gravity * t * t });
function rv(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * be.gravity * (t.bottom - e.from.y))) / be.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * be.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / be.gravity, on: "top" });
  const r = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let l = e.from;
  for (let u = 0; u < r.t; u += be.step) {
    const d = Math.min(u + be.step, r.t), f = Qt(e, d), m = ll(l, f, n);
    if (m) return { ...m, t: u + (d - u) * m.share };
    l = f;
  }
  const i = Qt(e, r.t);
  return { ...r, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function lv(e, t, n, a = []) {
  const s = sv(e.along + 1), [o, r] = av[e.wall], l = Math.atan2(r, o);
  return Array.from({ length: be.count }, () => {
    const i = l + (s() - 0.5) * 2 * (be.spread * Math.PI / 180), u = be.speed[0] + s() * (be.speed[1] - be.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: be.radius[0] + s() * (be.radius[1] - be.radius[0]) };
    return { ...d, ...rv(d, t, a) };
  });
}
function iv(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += be.step) {
      const r = Math.min(o + be.step, s), l = ll(Qt(a, o), Qt(a, r), n);
      if (l) {
        Object.assign(a, l, { t: o + (r - o) * l.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function cv(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...Qt(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - be.hold) / be.fade, 0), 1);
    if (o <= 0) return [];
    const r = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !r) return [];
    const l = r ? r.left + a.dx : a.x, i = r ? r.top + a.dy : a.y, u = r ? Math.min(s * s * 12, 48, Math.max(0, r.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: l, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function T5(e, t, n, a) {
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
function R5(e, t, n, a, s) {
  const { sway: o, above: r } = xe.chute, l = { x: t.x, y: t.y - r * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (O) => {
    const [b, N] = [O.x - e.at.x, O.y - e.at.y];
    return { x: l.x + b * u - N * d, y: l.y + b * d + N * u };
  }, [m, v] = [...n].sort((O, b) => O.x - b.x), y = e.ends.map(f);
  return { left: l.x - e.at.x, top: l.y - e.at.y, middle: l, turn: i, lines: y.map((O, b) => ({ from: O, to: b < y.length / 2 ? m : v })) };
}
const B5 = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function Dn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Xt(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Xt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function I5(e, t) {
  const n = xe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Dn(n, t), r = 1 - (1 - n.small) * Me(a, n.shrinks) * (1 - Me(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: a, out: s } = Dn(n, t), o = n.flat * Me(a, n.squashes) * (1 - Me(s, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * Xt(s, ...n.springs)) * (1 - Xt(s, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const L5 = (e) => e === "pack_box";
function N5(e) {
  const { into: t, out: n } = Dn(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function D5(e) {
  const t = xe.rope_swing, { into: n, out: a } = Dn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const uv = { after: 3 }, vs = 10, dv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, fv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, hv = { weight: 19 }, il = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, mv = { every: 120 }, cl = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ul = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, pv = {
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
}, rn = (e, t, n, a) => ({ name: e, type: t, weight: n, when: a, lifetime: vs }), ae = (e, t, n = {}) => rn(e, "clip", t, n), ga = (e, t, n = {}) => rn(e, "look", t, n), bo = (e, t, n = {}) => rn(e, "gaze", t, n), de = (e, t, n = {}, a = {}) => ({ ...rn(e, "pick", t, n), ...a }), ge = (e) => rn("nothing", "nothing", e, {}), gv = 120, vv = 300, va = (e, t) => ({ ...ae(e, t), cooldown: vv }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), yv = () => [ae("joy", 2)], ft = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), ht = (e) => ({ ...e, cooldown: dv[e.name] }), qt = (e) => ({ ...e, shenanigan: !0, lasts: fv[e.name] }), Yn = [
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
  ...re("reported", { cooldown: 90 }, [bo("read", 3), ae("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [bo("read", 3), ge(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), ge(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, yv()),
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
  ...re("answered", { cooldown: 15 }, [ga("amused", 3), ge(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), ge(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), ge(13)]),
  ...re("typing", { cooldown: 60 }, [ga("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(pv).flatMap(([e, t]) => re(`reacted:${e}`, {}, [ga(t, 1)])),
  ...Object.entries(cl).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(ul).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
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
  ...re("held:search", { cooldown: gv }, [va("search", 3), { ...va("binoculars", 2), when: { home: !0 } }, { ...va("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...re("unit", { cooldown: il.build.cooldown }, [de("unit", hv.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: mv.every }, de("stand", 5)]),
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
], dl = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), fl = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), wv = (e) => Array.isArray(e) ? e[0] : e, bv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, kv = (e) => Yn.some((t) => t.when.moment === e);
function xv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || fl(d).every(([f, m]) => n(f) >= wv(m)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Yn.filter((d) => dl(d.when, e) && (d.type !== "clip" || t(d.name)) && a(d) && s(d)), l = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= uv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = l.filter((d) => {
    var f;
    return d.type === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.type !== "nothing") ? i : l;
}
function je(e, t) {
  const n = xv(e);
  let a = t() * n.reduce((o, r) => o + r.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.type === "nothing" ? null : (hl(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function hl(e, t, n) {
  var a;
  for (const [s, o] of fl(t)) (a = e.memory) == null || a.set(s, e.now + bv(o, n));
}
function P5(e, t, n) {
  hl(e, Yn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const j5 = (e) => Object.values(il).find((t) => dl(t.when, e)) ?? null, $v = (e, t, n) => n - t <= (e.lifetime ?? vs), q5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || rl(e.clip, t));
class ml {
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
const Ja = {
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
}, F5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), pl = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), W5 = {
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
}, H5 = 120, Mv = 20, U5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Mv), Sv = (e) => Ja[e] || Ja.idle, z5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, gl = "airborne", _v = "landing", Ev = "travelling", vl = "grounded", V5 = ({ airborne: e, landing: t, trip: n }) => e ? gl : t ? _v : n != null && n.started ? Ev : vl;
function G5(e, t) {
  var s;
  const n = Av(e, t);
  return e.mode === vl && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function Av(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: r, place: l, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === gl && l.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? l.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Cv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (l.posture === "hang") return { clip: `hang_${l.grip}`, facing: l.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (l.view && u === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && l.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(d, l.posture) ? d : Sv(u), facing: v ? m : l.posture === "sit" ? l.face : f };
}
function Cv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Za = (e) => e.outcome, Ov = "plugin:code-commandments:sins:", ko = (e) => e.type === "plugins.card" && e.markKey.startsWith(Ov), Tv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => ko(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => ko(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], K5 = (e, t) => e.filter((n) => n.author === "user" && In(n.read_at) > t).map((n) => ({ beat: "read_message", time: In(n.read_at), card: Lr(n) })).sort((n, a) => n.time - a.time), xo = { user: "reacted", agent: "agent_reacted" };
function Y5(e, t) {
  return e.filter((n) => xo[n.author] && bt(n) > t).map((n) => ({ beat: `${xo[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const Rv = [.../* @__PURE__ */ new Set([...Object.values(cl).flatMap((e) => Object.keys(e)), ...Object.keys(ul)])];
function J5(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = Rv.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: bt(n), card: Lr(n) })).sort((n, a) => n.time - a.time);
}
const Bv = (e) => new ml(e).isTest(), Pn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Za(e)] || "";
}, Iv = 1800, Lv = (e, t) => {
  if (Pn(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && Pn(n) !== "finished" && Number(e.time) - Number(n.time) <= Iv ? "tests_fixed" : "tests_passed";
};
function Z5(e, t, n) {
  var r;
  const a = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(Bv), s = a.filter((l) => Pn(l)), o = s.filter((l) => t.get(l.key) === "" || !t.has(l.key) && Number(l.time) > n);
  return a.forEach((l) => t.set(l.key, Pn(l))), o.map((l) => ({ beat: Lv(l, s), time: Number(l.time), card: l.key }));
}
function X5(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Za(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Za(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const Q5 = (e) => e.map((t) => {
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
function e4(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function t4(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function n4(e, t) {
  var o, r;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((l) => l.time > t).map((l) => {
    var i;
    return { beat: (i = Tv.find((u) => u.matches(l))) == null ? void 0 : i.beat, time: l.time, card: l.key };
  }).filter((l) => l.beat), s = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((l, i) => l.time - i.time);
}
function ys(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const $o = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Nv(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const l = (s + o) / 2;
    ys(e, t, l, a).pitch > n ? s = l : o = l;
  }
  return (s + o) / 2;
}
function a4(e, t, n, a = {}) {
  const s = je({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : kv(`held:${e}`) ? "idle" : e;
}
const Ee = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function s4(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ee.ahead * n ? 180 : Math.sign(a) * Ee.turn;
}
const Mo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function o4(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ee.sweep) % s, l = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = Mo((l - i) / Ee.returnSeconds), d = l <= i ? Mo(l / i) : 1 - u, f = r + ((r + 1) % s - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const So = 3, yl = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, _o = 12, r4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function l4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!yl(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= So ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * _o) / _o, lasts: So } };
}
const i4 = (e) => e.posture === "hang" && !yl(e.face), Dv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Pv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function c4(e, t, n) {
  return Dv.has(e) ? 1 / 0 : !Pv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(wl(n - t.began, t.share) - Ve.lead, 0);
}
const jv = 5;
function u4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= jv ? { beat: "long_walk", time: n } : null };
}
const qv = 30, kn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function d4(e, t, n, a, s = null) {
  if (t && n < t.until || !kn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = je({ moment: "spell", state: e, tally: s }, a), [r, l] = kn.seconds;
  return o ? { state: o.name, began: n, until: n + r + a() * (l - r), next: n + kn.every } : { state: e, began: 0, until: 0, next: n + kn.every };
}
const f4 = (e, t, n) => t && n < t.until && pl.has(e.state) ? { state: t.state, since: t.began } : e, Ve = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, wl = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function h4(e, t, n, a) {
  var l;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, r = wl(o, e.share);
  return s ? { eager: Fv(t, r), moment: null } : r > Ve.lead ? { eager: t, moment: null } : r < Ve.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ve.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ve.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((l = je({ moment: "eager", slow: !0 }, n)) == null ? void 0 : l.name) === "eager" }, moment: null };
}
function Fv(e, t) {
  return e.on && t > Ve.lead + Ve.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ve.lead && t >= Ve.least ? { ...e, on: !0, calm: !1 } : e;
}
const Wv = 1, Hv = { look: "look", gaze: "gaze" };
function Uv(e, t, n, a, s = "", o = () => !0, r = null) {
  const l = je({ moment: e, voice: s, has: o, memory: t, now: n, tally: r }, a);
  return l ? { [Hv[l.type] ?? "clip"]: l.name, toward: l.toward ?? "", onto: !!l.onto, holds: !!l.holds, lifetime: l.lifetime } : null;
}
const zv = (e, t, n, a, s, o = "", r = () => !0, l = null, i = "") => je({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: a, tally: l, ball: i }, s), Vv = (e, t, n, a, s, o = 0) => je({ moment: "jump", high: e > Wv * t, memory: a, now: s, room: o }, n).name === "backflip", Gv = { work: ["building"], idle: ["standing"] };
function m4(e, t, n, a) {
  const s = Ja[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(Gv[s] ?? []).map((r) => ({ beat: r, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), pl.has(e) ? { moments: o, began: n || a } : (n && a - n >= qv && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function Kv(e, t, n) {
  return !je({ moment: "pondering", memory: e, now: t }, n) || !je({ moment: "thought_cloud", memory: e, now: t }, n) ? null : je({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Eo = { pondering: Kv };
function p4(e, t, n, a, s, o) {
  if (Eo[e.beat]) {
    const l = Eo[e.beat](n.reacted, a, s);
    return l && o(l) ? { beat: { clip: l, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = Uv(e.beat, n.reacted, a, s, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== vs && { lifetime: r.lifetime } } } : null;
}
function g4(e, t, n, a, s, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = zv(e.room ?? 0, t.lasted, n, a, s, e.voice, o, r, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const v4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function y4(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function w4(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const b4 = (e, t) => !!(e != null && e.watches) && !t.once, k4 = 10, x4 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || $v(a, a.queuedAt, n)), $4 = (e, t) => t ? null : e[0] ?? null;
function M4(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const S4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Yv = 2 * Math.PI, Jv = 500;
function _4(e, t, n, a, s = null, o = 1) {
  const r = a - (e.at || a), l = r / Jv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + l, d) : Math.max(e.amount - l, d), m = Yv * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, O = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? Xv(v, t, n, m, s) : ey(v, t, n, m) : t) ?? v, b = O != null && O.behind && O.mood === "reading" ? Zv(e.point, O, n, r, s) : O;
  return { point: b ?? null, toward: b ? { x: b.x - n.x, y: b.y - n.y } : null, amount: f, at: a };
}
function Zv(e, t, n, a, s) {
  const o = (x) => x * 180 / Math.PI, r = (x) => o(Math.atan2(Math.sin(x * Math.PI / 180), Math.cos(x * Math.PI / 180))), l = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -i)) - l), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - l), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? r(e.readingFacing - l) : 0, v = f ? e.readingYaw + m : d, y = v + r(u - v), O = Math.min(Math.max(a / 1e3, 0), 0.1), b = Ee.turnSpeed * O, N = f ? v + Math.min(Math.max(y - v, -b), b) : y, z = f ? e.readingFollow + m : N, ee = z + (N - z) * (1 - Math.exp(-O / Ee.followSeconds)), j = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, M = o(ys(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), S = Math.min(Math.max(M, -j.up), j.down), R = Ee.tipSpeed * O, A = f ? e.readingPitch + Math.min(Math.max(S - e.readingPitch, -R), R) : S;
  return { ...t, readingYaw: N, readingFollow: ee, readingPitch: A, readingFacing: l };
}
function Xv(e, t, n, a, { depth: s, above: o, tip: r }) {
  const l = (z) => {
    const { yaw: ee, pitch: j } = ys(z.x - n.x, s, n.y - z.y, o);
    return { yaw: ee, pitch: Math.min(Math.max(j, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [i, u] = [$o(l(e)), $o(l(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [m, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [y, O, b] = i.map((z, ee) => m * z + v * u[ee]), N = s * y / O;
  return { ...t, x: n.x + N, y: n.y - Nv(N, s, -Math.asin(Math.min(Math.max(b, -1), 1)), o) };
}
const Qv = 0.15;
function E4(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= Qv;
}
function ey(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - s), Math.cos(o - s)), l = s + Math.max(-a, Math.min(a, r)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(l), y: n.y + i * Math.sin(l) };
}
const ty = (e) => !(e != null && e.on);
function A4(e, t, n) {
  if (ty(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, r) => r.findIndex((l) => l.beat === s.beat && l.card === s.card) === o);
  return { answer: [], held: a };
}
const en = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, He = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ya = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ao = (e) => e * e * (3 - 2 * e);
function ny(e) {
  if (e < 0 || e >= He.seconds) return null;
  const t = ya(e, ...He.flicker), n = Math.floor(t * He.flickers * 2) % 2 === 0, a = e < He.flicker[1] ? n ? 0.35 + 0.5 * t : He.dim : 1;
  return { strength: 1 - Ao(ya(e, ...He.fade)), lit: a, white: e < He.flash[0] ? 0 : 1 - Ao(ya(e, ...He.flash)) };
}
const C4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function O4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = ny(t - e.at);
  return a && { colour: en.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: He.signs[e.tone], ...a } };
}
function T4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function R4(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= en.looks || a === null && n - e.since >= en.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function B4(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (l) => (l + a * 12) % 12, o = (l) => 0.5 - 0.5 * Math.max(-1, Math.min(s(l) - 3, 9 - s(l), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const nt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, I4 = { behind: 39, figure: 40, ahead: 41 }, ay = "[data-figure-pile]", sy = { amber: [1, 0.69, 0.125], good: en.colours.good, bad: en.colours.bad }, Cn = { phases: 4, ms: 230, dim: 0.25 }, L4 = (e, t, n) => e !== "amber" || (t + n) % Cn.phases < Cn.phases / 2 ? 1 : Cn.dim, N4 = (e) => e === "amber" ? Cn.phases : 1;
function D4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const P4 = Object.keys(sy), qe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Wt = ([e, t], n) => e + n() * (t - e);
function j4(e) {
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
const wa = { high: 3, gap: 1 };
function q4(e) {
  const t = Math.floor(e / wa.high);
  return { left: -(nt.inside + nt.width / 2 + t * (nt.width + wa.gap)), up: e % wa.high * (nt.height - nt.top) };
}
const oy = (e, t, n) => je({ moment: "unit", memory: e, now: t }, n) !== null, ry = { after: 5 }, ly = (e) => e.filter((t) => t.active && (t.process || t.watch) && new ml(t).isBuild());
function F4(e, t, n) {
  const a = ly(e).sort((o, r) => Number(o.time) - Number(r.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= ry.after ? s : null;
}
function W4(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: oy(n, a, s) } : null;
}
const Co = { ahead: 140, up: 70 };
function H4(e, t, n, a, s) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * Co.ahead, y: a - Co.up } } : o ? { at: { x: n(o), y: a - o.up - nt.height } } : t ? { at: null } : null;
}
const ba = { least: 4e3, most: 1e4 }, iy = (e) => ba.least + e() * (ba.most - ba.least), mt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function U4(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = iy(t);
    if (n.length >= mt.most || t() >= mt.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (mt.at[0] + t() * (mt.at[1] - mt.at[0]));
    n.push({ from: o, to: o + mt.ms }), a = o + mt.ms;
  }
}
const z4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), V4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), bl = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), G4 = new Set(Yn.filter((e) => bl.has(e.when.moment) && e.type === "clip").map((e) => e.name)), cy = (e) => e.some((t) => t.state === "built"), K4 = (e, t) => cy(t) ? e.filter((n) => !bl.has(n.beat)) : e, rt = { reach: 40, room: 6 }, uy = (e, t) => t <= e - rt.reach + 2, Y4 = (e, t, n) => uy(e, n) ? t - rt.reach : e - rt.reach - rt.room, J4 = (e, t, n, a) => a > 0 && t < e && t + rt.reach >= e - 2 ? Math.min(n, Math.max(e, t + rt.reach)) : e, ka = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, Z4 = (e) => Wt(e() < ka.longShare ? ka.long : ka.short, e), dy = 2 * nt.width;
function X4(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= dy ? o : e + (o - e + s / 2) % s;
}
const fy = 60, Q4 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= fy, Oo = "[data-figure-home]", ln = () => {
  var t;
  const e = document.querySelector(Oo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Oo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, hy = "[data-figure-docked-bars]", my = "[data-figure-chat-foot]", py = [0.85, 0.6, 0.35, 0.15], gy = ["question", "waiting", "suggestion"], ex = (e, t) => gy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function tx() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const vy = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", yy = "[data-figure-newest]";
function kl() {
  var a, s;
  const e = (a = ln()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(yy), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, l;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((l = o.getAttribute) == null ? void 0 : l.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ws(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function tn(e, t, n = kl()) {
  if (!e || !n) return !0;
  const a = Ze(e, t), s = Zn(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, r = gt.gap;
  return !Jn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function nx(e, t, n, a = kl()) {
  if (!a || tn(t, e, a)) return null;
  const s = Zn(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, r = (Math.max(s.right, 0.73) - 0.5) * e.size, l = St(), i = t.posture === "stand" ? ks * e.size : Cl * e.size, u = Math.max(n.left + i, l.left + o), d = Math.min(n.right - i, l.right - r);
  return [a.left - gt.gap - r, a.right + gt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= u && m.x <= d && tn(m, e, a) && Gy(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const xa = 0.26, xl = 0.54, wy = 1.25 / 5.4, cn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: xa, travels: "stand" },
  lounge: { drop: xa, travels: "stand" },
  composed: { drop: xa, travels: "stand" },
  hang: { drop: xl, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, ax = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * wy * Math.cos(t * Math.PI / 180),
  y: 1 - n - xl
}), Vt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), by = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), sx = (e, t) => (e === "sit" ? by.has(t) : Vt.has(e)) ? e : "stand";
function ox(e, t) {
  return e.facing === t.facing || !Vt.has(e.posture) && !Vt.has(t.posture) ? t : { posture: "stand", facing: Vt.has(e.posture) ? e.facing : t.facing };
}
const rx = 0.25, lx = (e, t) => Vt.has(e) && cn[t].drop === 0, $l = 2, ky = 90, xy = 180, $y = 140, My = 280, Sy = 420, _y = 0.25, Ey = 290, Ay = 600, Cy = "cubic-bezier(0.2, 0.7, 0.4, 1)", Oy = "cubic-bezier(0.55, 0, 0.9, 0.6)", $a = 5;
function jn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: r = !1, sprinting: l = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < $a) return null;
  (r || l) && (o = Math.max(o, $l));
  const v = o > 1, y = Math.abs(t.x - e.x), O = y < $a ? 0 : y / (ky * o) * 1e3, b = Math.min(O, v ? $y : xy), N = Math.abs(t.y - e.y), z = t.y < e.y, ee = z && !m && Vv(N, n, i, u, d, f), j = z ? Sy + Math.min(N, 400) * _y : Math.sqrt(2 * N / gs) * 1e3, M = {
    x: t.x,
    y: t.y,
    ms: N > $a ? ee ? Ay : j : 0,
    lead: ee ? Ey : z ? My : 0,
    easing: z ? Cy : Oy,
    hopping: !0,
    clip: ee ? "backflip" : z ? "jump" : "fall"
  }, S = { x: t.x, y: t.y, ms: O + b, lead: 0, easing: "linear", ramp: b, ...v ? { clip: "run" } : {} }, R = m ? Ty(t, n) : M, A = z && !a ? [{ ...S, y: e.y }, R] : [{ ...M, x: e.x }, S];
  return { way: Math.sign(t.x - e.x) || 1, legs: A, lands: !s, pace: o, running: v };
}
const Ty = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Ry = (e, t) => e.postures.includes(t) ? t : e.postures[0], ix = (e, t, n) => e.posture === "walk" && n ? "walk" : Ry(e.clip, t), Ze = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - cn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, Jn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ws = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function St() {
  var t;
  const e = (t = ln()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const xn = 0.5, To = 20;
function cx(e, t, n = St()) {
  const a = Ze(e, t);
  return a.left >= n.left + To && a.right <= n.right - To;
}
function bs(e, t, n = St()) {
  const a = Ze(e, t), s = a.right - a.left, o = Zn(e), [r, l] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return r >= n.left - xn && l <= n.right + xn && a.top >= n.top - xn && i <= n.bottom + xn;
}
const qn = [0.35, 0.5, 0.65], Fn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: qn[0], right: qn.at(-1), top: Fn[0], bottom: Fn.at(-1) }, By = 0.24;
function Zn(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + By * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function Iy(e, { size: t }, n = St()) {
  const a = Zn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const ks = (_e.right - _e.left) / 2 + 0.08;
function ux(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - cn[e].drop) };
}
const Ly = "[data-figure-agent]";
function Ml(e, t, n = "", a = "") {
  var l;
  const s = (l = document.caretRangeFromPoint) == null ? void 0 : l.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ws(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, r = Math.min(s.startOffset, o.length - 1);
  for (const i of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Sl = (e) => Fn.flatMap(
  (t) => qn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function xs(e, t, n = "") {
  if (!tn(e, t)) return qn.length * Fn.length;
  const a = Ze(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(vy)].map((l) => ({ control: l, rect: l.getBoundingClientRect() })).filter(({ control: l, rect: i }) => i.width && i.height && Jn(s, i) && ws(l)).map(({ rect: l }) => l), r = (l, i) => o.some((u) => l >= u.left && l <= u.right && i >= u.top && i <= u.bottom);
  return Sl(s).filter(([l, i]) => r(l, i) || Ml(l, i, n)).length;
}
function Ny(e, t) {
  const n = Ze(e, t);
  return Sl({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => Ml(a, s, "", Ly)).length;
}
const Ro = 4;
function dx(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Ro; o <= s; o += Ro)
    for (const r of [t.x - o, t.x + o]) {
      if (r - a < n.left || r + a > n.right) continue;
      const l = { ...t, x: r };
      if (!Ny(l, e) && tn(l, e)) return l;
    }
  return null;
}
function nn(e, t, n) {
  const a = St(), s = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => bs(r, t, a) && tn(r, t)).map((r) => ({ spot: r, covered: xs(r, t), away: s(r) }));
  return o.length ? o.reduce(
    (r, l) => l.covered < r.covered || l.covered === r.covered && l.away < r.away ? l : r
  ).spot : null;
}
const _l = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Dy = [0.5, 0.25, 0.75], Py = (e) => _l(e.getBoundingClientRect(), Dy), El = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, jy = ks, qy = (e, t, { size: n }, a = jy) => Al(e, El[t], a * n, "stand");
function Al(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Fy = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Cl = 0.1, Wy = (e, t, { size: n }) => Al(e, Fy[t], Cl * n, "sit"), Hy = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ma = 60;
function fx(e, t) {
  const n = Hy(t);
  return !e.aside || Math.abs(n) >= Ma ? t : n < 0 ? 360 - Ma : Ma;
}
const Gt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Uy = (e) => [.../* @__PURE__ */ new Set([e, ...Gt.turns.map((t) => (t + 360) % 360)])];
function hx(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Uy(t), r = Gt.every[0] + a() * (Gt.every[1] - Gt.every[0]);
  return { face: t, from: s ? zy(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + r };
}
function zy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Gt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function mx(e, t) {
  const { element: n, edge: a } = Xn(), s = ["left", "right"].map((l) => un(Wy(a, l, e), e)).filter((l) => n && bs(l, e) && !xs(l, e)), o = (l) => t ? Math.abs(l.x - t.x) : 0, r = s.sort((l, i) => o(l) - o(i))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function px(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - Ol } : e;
}
const Ol = 7;
function Tl() {
  const e = [...document.querySelectorAll(ay)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Vy(e, t) {
  const n = Ze(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function Gy(e, t) {
  const n = Tl();
  return !n || !Jn(Vy(e, t), n);
}
const Ky = 4;
function Xn() {
  const e = dn(), t = Tl(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > Ky || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Ol - n, 0) } };
}
const gx = ({ size: e, below: t }) => (1 - t) * e;
function un(e, t) {
  const n = St(), { size: a, below: s } = t, o = cn[e.posture].drop * a;
  return { ...Iy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const Xa = (e, t) => Object.keys(El).map((n) => un(qy(e, n, t), t)), $s = (e, t) => _l(e, py).map((n) => un(n, t)), Rl = (e, t, n) => nn(e, t, n) ?? e[0];
function vx(e, t) {
  const { element: n, edge: a } = Xn();
  return { ...Rl(Xa(a, e), e, t), view: null, on: n };
}
function yx(e, t, n, a) {
  const { element: s, edge: o } = Xn(), r = (a ? Xa(o, t) : [...Xa(o, t), ...$s(o, t)]).filter(
    (u) => !Jn(Ze(u, t), e)
  ), l = nn(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = l && !xs(l, t) ? l : nn(r, t, n);
  return i && { ...i, view: null, on: s };
}
function dn() {
  var a;
  const e = ln(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(hy);
  if (!t) return { ...Qn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Bo = { within: 2 };
function wx(e) {
  const { element: t, docked: n, edge: a } = dn();
  if (!n || e.on !== t) return !0;
  const s = Qn().edge;
  return a.left > s.left + Bo.within || a.left + a.width < s.left + s.width - Bo.within;
}
const Yy = "[data-figure-closing]";
function bx() {
  var n;
  const { element: e, docked: t } = dn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Yy));
}
const Bl = "[data-figure-progress]";
function kx(e) {
  const t = e.querySelector(Bl);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function xx(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, r) => s(r) < s(o) ? r : o) : null;
}
const Jy = { across: 300, above: 380, below: 60 };
function $x(e) {
  const { across: t, above: n, below: a } = Jy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: Zy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const Zy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Il = "[data-figure-bar]", Qa = { back: 144, along: 0.4 };
function Mx(e) {
  const { element: t, docked: n, edge: a } = dn(), s = n ? t.querySelector(Il) : null;
  if (!(s != null && s.querySelector(Bl))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...un({ x: o - Qa.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Sx(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < Qa.along * a.size ? t.x + Qa.along * a.size : e.x, y: e.y, behind: !0 };
}
function _x(e) {
  const t = e.querySelector(Il), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Qn() {
  const e = ln();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function Ex(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: l } = Qn(), i = n === null ? Xy(l, e, o === null ? t : { x: o, y: l.top }, a, s) : un({ x: n, y: l.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: r, stays: !0 };
}
function Xy(e, t, n, a, s) {
  const o = $s(e, t), r = Math.min(...o.map((i) => i.x)), l = o.filter((i) => i.x + a + nt.width < s && i.x + a - rt.reach - rt.room >= r);
  return nn(l.length ? l : o, t, n);
}
const Qy = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function Ax(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: r = !1, random: l = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || r) && (s = Math.max(s, $l));
  const v = (ee) => {
    const j = Ze(ee, n, cn[ee.posture].travels);
    return { x: j.left, y: j.top };
  }, y = t.ladder ?? e.ladder;
  if (y && !(t.ladder && e.ladder)) return ew(v(e), v(t), v({ ...y.foot, posture: "stand" }), y.way, !!t.ladder, n, s);
  const [O, ...b] = [e, ...i, t].map(v), N = jn(O, b[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: r, random: l, memory: u, now: d, room: f, pogo: m }), z = b.slice(1).map((ee, j) => {
    var M;
    return (M = jn(b[j], ee, n.size, { random: l, memory: u, now: d, room: f })) == null ? void 0 : M.legs.find((S) => S.hopping);
  });
  return N && { ...N, legs: [...N.legs, ...z.filter(Boolean)] };
}
function ew(e, t, n, a, s, o, r) {
  const l = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Qy.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? jn(e, n, o.size, { pace: r }) : jn(n, t, o.size, { pace: r }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], l(n, t)] : [l(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function Cx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function Ox(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && nn(Py(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Xn();
  return { ...Rl($s(s, t), t, n), view: null, on: a };
}
const tw = "[data-figure-bubble]", nw = 250;
let Kt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ll = 0;
const Pt = () => Kt, Sa = /* @__PURE__ */ new WeakMap();
let aw = 0;
function Ms(e) {
  return Sa.has(e) || Sa.set(e, `floor-${++aw}`), Sa.get(e);
}
const sw = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, ow = () => {
  var e, t;
  return ((t = (e = ln()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function rw(e, t) {
  var a;
  const n = (a = e.querySelector(my)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function lw(e, t) {
  const n = e && rw(e, t), a = e ? [...e.querySelectorAll(tw)].map((o) => ({ element: o, type: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, type: "tab" }));
  return [...a, ...s].map(({ element: o, type: r }) => ({ element: o, type: r, box: o.getBoundingClientRect() })).filter(({ type: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || sw(r, n))).map(({ element: o, type: r, box: l }) => ({ id: Ms(o), type: r, element: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom }));
}
const iw = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= nw ? (t.top - a.top) / s * 1e3 : 0;
};
function Nl(e = Kt, t = performance.now()) {
  const n = St(), a = ow(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: l } = dn(), i = [];
  o && i.push({ id: "home", type: r ? "dock" : "compose", element: o, left: l.left, right: l.left + l.width, top: l.top });
  const u = Qn();
  return u.element && i.push({ id: Ms(u.element), type: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...lw(a, s)), i.push({ id: "foot", type: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: iw(e, d, t) }))) });
}
const es = /* @__PURE__ */ new Set();
function cw(e) {
  return es.add(e), () => es.delete(e);
}
function uw() {
  Dl();
  const e = () => {
    Ll = requestAnimationFrame(e), !document.hidden && (Kt = Nl(Kt), es.forEach((t) => t(Kt)));
  };
  e();
}
function Dl() {
  cancelAnimationFrame(Ll);
}
const Ss = 5, dw = 56, fw = { share: 0.6 }, hw = (e) => -Math.sqrt(2 * gs * fw.share * e), It = (e, t) => e.find((n) => n.id === t) ?? null;
function Tx(e, t = Nl().floors) {
  const n = It(t, "home"), a = (n == null ? void 0 : n.type) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : Ms(e.on) : null, o = s && It(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function Pl({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: r }, l, i = Pt().floors) {
  const u = It(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (r || mw(u, d, o)) && pw(d, l, i) ? { x: d.x, y: d.y } : null;
}
const _s = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, mw = (e, t, n) => !_s({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Rx(e, t = Pt().floors) {
  if (!_s(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= Ss && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function pw(e, t, n = Pt().floors) {
  const a = It(n, "home");
  return e.posture === "hang" && a && Ze(e, t).bottom >= a.top ? !1 : bs(e, t);
}
function Bx(e, t, n, a = Pt().floors) {
  const s = Pl(e, n, a);
  if (!e.home) return gw(e, t, s, a);
  if (!s) return null;
  const o = It(a, "home"), r = s.y - t.y, l = r > Ss ? "dropping" : -r > dw ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: l };
}
function gw(e, t, n, a) {
  const s = n ? It(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: hw(e.risen) };
  if (!n) return null;
  if (_s(t) && n.y - t.y > Ss) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function Ix(e, t, n) {
  const a = ks * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function Lx(e, t, n, a = Pt().floors) {
  const s = t && Pl(t, n, a);
  return s ? { ...e, ...s } : e;
}
const vw = ["data-type"], yw = { class: "figure-floor-name" }, ww = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-type": e.floor.type,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", yw, w(e.floor.type), 1)
    ], 12, vw));
  }
}, bw = /* @__PURE__ */ J(ww, [["__scopeId", "data-v-4e0f1e2e"]]), kw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, xw = {
  __name: "FigureFloors",
  setup(e) {
    const t = ze(Pt().floors);
    let n = () => {
    };
    return Oe(() => {
      n = cw((a) => t.value = a.floors), uw();
    }), Re(() => {
      n(), Dl();
    }), (a, s) => (c(), h("div", kw, [
      (c(!0), h(K, null, te(t.value, (o) => (c(), W(bw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Nx = /* @__PURE__ */ J(xw, [["__scopeId", "data-v-e519168b"]]), _a = (e) => typeof e == "number" ? e : Date.parse(e);
function Dx(e, t) {
  const n = (s, o) => ({ type: s, id: `${s}:${o.id}`, row: o, time: _a(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => _a(s.row.created_at) - _a(o.row.created_at) || (s.type === o.type ? s.row.id - o.row.id : s.type === "message" ? -1 : 1));
}
const $w = 3, Ea = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Mw(e, t) {
  var a;
  if (e.type !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = Ea[n.grouping]) == null ? void 0 : a.call(Ea, e.row, n)) || "";
}
function Sw(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { type: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function Px(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= $w ? [Sw(a, t)] : a), a = [];
  };
  for (const r of e) {
    const l = Mw(r, t);
    l !== s && o(), s = l, l ? a.push(r) : n.push(r);
  }
  return o(), n;
}
const _w = {
  runningTool: 1e3,
  agentCommand: 5e3,
  planCard: 3e3,
  openPanel: 5e3,
  pageOfAgents: 3e3,
  projectHooks: 1e4,
  numbers: 1e4,
  services: 15e3,
  libraryCopies: 3e4
}, Ew = 1e3;
function Aw() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), Ew);
  return xt(() => clearInterval(t)), e;
}
const Cw = ["datetime", "title"], ea = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Aw(), a = B(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, w(q(Ur)(e.at, q(n))), 9, Cw));
  }
};
function jx(e) {
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
function Ow(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const qx = (e) => (t) => t.filter((n) => n.id !== e), Fx = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), Wx = (e) => (t) => [...t, e], Hx = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function Ux(e, t = {}) {
  const n = ct(), a = I(null), s = I("");
  async function o(...r) {
    const l = await n.read(e(...r), t);
    s.value = l.ok ? "" : l.error, l.ok && (a.value = l.value);
  }
  return { value: a, failure: s, load: o };
}
function zx(e) {
  const t = ct(), n = I("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const $n = /* @__PURE__ */ new Map();
function Tw(e, t) {
  if ($n.has(e)) return $n.get(e);
  const n = t().finally(() => $n.delete(e));
  return $n.set(e, n), n;
}
function Vx() {
  const e = ct(), t = I(null), n = I("");
  async function a() {
    const s = await Tw(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Rw = { class: "cards-page" }, Bw = { class: "cards-bar" }, Iw = { class: "cards-count" }, Lw = { class: "cards" }, Nw = {
  key: 1,
  class: "cards-note"
}, Dw = {
  key: 2,
  class: "cards-note"
}, Pw = ["data-row", "onClick"], jw = { class: "card-head" }, qw = { class: "card-title" }, Fw = { class: "card-foot" }, Ww = {
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
    return (a, s) => (c(), h("div", Rw, [
      g("div", Bw, [
        g("span", Iw, w(e.rows.length) + " " + w(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        L(ue, Ye({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            L(me, {
              name: "plus",
              size: 12
            }),
            ne(" New " + w(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Lw, [
        e.loaded ? e.failure ? (c(), h("p", Nw, w(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", Dw, "No " + w(e.noun) + "s yet", 1)) : (c(), W($t, {
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
          g("span", jw, [
            L(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + w(e.head(o)), 1),
            L(ea, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", qw, w(e.title(o)), 1),
          g("span", Fw, w(e.foot(o)), 1)
        ], 8, Pw))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Gx = /* @__PURE__ */ J(Ww, [["__scopeId", "data-v-990e6b37"]]), Io = "newest";
function Kx(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = I(""), o = I(Io), r = I("all"), l = B(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((m) => Ow(m, d, a == null ? void 0 : a.fields) && (r.value === "all" || !n || n(m) === (r.value === "open")));
    return o.value === Io ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), i = B(() => !!s.value.trim() || !!n && r.value !== "all");
  return { words: s, order: o, state: r, shown: l, filtering: i, hasStates: !!n };
}
const Hw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Uw = 40, zw = "top", Vw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = B(() => a === zw), o = I(null), r = I(!1), l = (m) => s.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      r.value = l(o.value) >= Uw;
    }
    return he(() => n.rowCount, async () => {
      await it(), !r.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", Hw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: X(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(m.$slots, "default", {}, void 0, !0)
      ], 34),
      L(Lt, {
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
            L(me, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = ne(" Newest ", -1))
          ], 512), [
            [Ho, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Yx = /* @__PURE__ */ J(Vw, [["__scopeId", "data-v-3accb764"]]), Gw = ["aria-selected", "data-tab", "onClick"], Kw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Yw = {
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
          onClick: (N) => a("choose", y)
        }, [
          ne(w(y.label) + " ", 1),
          i(y) ? (c(), h("span", Kw, w(e.answer[y.count_field]), 1)) : C("", !0)
        ], 10, Gw);
      }), 128)),
      g("i", {
        class: X(["inner-tabs-line", { slides: l.value.slides }]),
        style: fe({ left: `${l.value.left}px`, width: `${l.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, Jx = /* @__PURE__ */ J(Yw, [["__scopeId", "data-v-63fcd326"]]), Jw = {
  class: "tab-body",
  "data-tab-body": ""
}, Zw = { "data-tab-content": "" }, Xw = {
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
      n.value = !0, rs(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", Jw, [
      n.value ? (c(), W($t, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Je(g("div", Zw, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Ho, !n.value]
      ])
    ]));
  }
}, Zx = /* @__PURE__ */ J(Xw, [["__scopeId", "data-v-63876533"]]), Qw = {}, eb = { class: "menu-label" };
function tb(e, t) {
  return c(), h("span", eb, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ts = /* @__PURE__ */ J(Qw, [["render", tb], ["__scopeId", "data-v-aa955b3e"]]), nb = {
  class: "search-bar",
  "data-search-bar": ""
}, ab = { class: "search-bar-control" }, sb = ["value", "placeholder", "aria-label"], ob = ["aria-expanded"], rb = {
  key: 0,
  "data-menu-count": ""
}, lb = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" }, menuCount: { type: Number, default: 0 } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var N;
    const a = e, s = n, o = ti(), r = ((N = $e(Se, null)) == null ? void 0 : N.search) ?? {}, l = B(() => r.placeholder || a.placeholder), i = r.context ?? [], u = I(null), d = I(null), f = I([]), m = B(() => f.value.length ? f.value[f.value.length - 1].next : i), v = B(() => !!o.menu || i.length > 0), y = (z) => {
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
      return c(), h("div", nb, [
        g("div", ab, [
          L(me, {
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
            onKeydown: Yt(b, ["esc"])
          }, null, 40, sb),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: b
          }, [
            L(me, {
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
            e.menuCount ? (c(), h("span", rb, w(e.menuCount), 1)) : C("", !0),
            L(me, {
              name: "caret",
              size: 12
            })
          ], 8, ob)) : C("", !0)
        ]),
        (j = q(r).button) != null && j.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: ee[1] || (ee[1] = (M) => s("pick", q(r).button.click))
        }, w(q(r).button.title), 1)) : C("", !0),
        ce(z.$slots, "default", {}, void 0, !0),
        d.value ? (c(), W(zn, {
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
}, ib = /* @__PURE__ */ J(lb, [["__scopeId", "data-v-45374bed"]]), cb = {
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
    return (o, r) => (c(), W(ib, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (l) => e.tools.words.value = l),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (l) => n("pick", l))
    }, {
      menu: D(() => [
        L(ts, null, {
          default: D(() => [...r[2] || (r[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, te(a, (l) => L(wt, {
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
          L(ts, null, {
            default: D(() => [...r[3] || (r[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, te(s, (l) => L(wt, {
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
}, Xx = /* @__PURE__ */ J(cb, [["__scopeId", "data-v-dab0064d"]]);
function Qx() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const e8 = (e) => import(
  /* @vite-ignore */
  e
), ub = 86400, ns = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function db(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((ns(t) - ns(e)) / ub);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function t8(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = ns(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, type: "day", who: "", time: s.time, title: db(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const Aa = 280, Ca = 240, Oa = 120, fb = 6, hb = 14, an = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function mb(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function jl(e, t) {
  const n = Math.max(0, mb(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function pb(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${hb}px)` }), e.offsetHeight, e.style.transition = `height ${Aa}ms ${an}`, e.style.height = `${r}px`;
  const l = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = jl(t, e));
    const m = s() - l;
    if (!i && m >= Aa && (i = !0, e.style.transition = `opacity ${Ca}ms ease-out, transform ${Ca}ms ${an}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Aa + Ca) return a(f);
    d();
  };
  return a(f), d;
}
function n8(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${fb}px)` }), e.offsetHeight, e.style.transition = `opacity ${Oa}ms ease-out, transform ${Oa}ms ${an}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = s(), l = () => {
    if (n() && (t.scrollTop = jl(t, e)), s() - r < Oa) return a(l);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(l);
}
const gb = 140, Mn = 220, Lo = 5;
function a8({ gap: e = gb, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, r = !1;
  function l(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, Lo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const m of d)
      m.el.style.display = m.display, l(m, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, m, v = pb) => {
    if (r || !f.pane || !f.follows()) return m();
    const y = { el: d, options: f, done: m, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, l(y, () => o = t(i, e));
    d.style.display = "none", n.push(y), n.length >= Lo && u.flush();
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
function s8(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Mn}ms ${an}, opacity ${Mn}ms ease-in, margin ${Mn}ms ${an}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Mn);
}
const ql = "chat.pins.minimised", On = I(Tn(ql, !1));
function No(e) {
  On.value = e, us(ql, e);
}
function vb(e) {
  const t = B(() => e()), n = B(() => On.value ? [] : e()), a = () => No(!On.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => bt(o) > s).length,
    (o, r) => o > r && No(!1)
  ), { pins: t, visible: n, minimised: On, toggle: a };
}
const yb = ["title"], wb = {
  key: 0,
  class: "pins-count"
}, bb = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = vb(() => t.pinRows);
    return (o, r) => q(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: X(["pins-toggle", { minimised: q(a), inline: e.inline }]),
      title: q(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = we((...l) => q(s) && q(s)(...l), ["stop"]))
    }, [
      L(me, {
        name: q(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      q(a) ? (c(), h("span", wb, w(q(n).length), 1)) : C("", !0)
    ], 10, yb)) : C("", !0);
  }
}, o8 = /* @__PURE__ */ J(bb, [["__scopeId", "data-v-d073c504"]]), kb = ["title"], xb = ["title"], $b = { class: "diff-card-dir" }, Mb = { class: "diff-card-name" }, Sb = ["title"], _b = ["title"], Eb = {
  key: 0,
  class: "diff-card-note"
}, Ab = ["href"], Cb = ["src", "alt"], Ob = { class: "diff-card-rows" }, Tb = { class: "diff-row-num" }, Rb = { class: "diff-row-sign" }, Bb = { class: "diff-row-code" }, Ib = {
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
    )), N = I(!1), z = B(() => n.lines && !N.value && !n.whole), ee = B(() => z.value ? b.value.slice(0, n.lines) : b.value), j = B(() => b.value.length - ee.value.length), M = (T) => T.line === null || T.line_type === "del" ? "" : T.line, S = (T) => T.line_type === "fold" ? T.hidden ? `⋯ ${T.hidden} lines` : "⋯" : T.text, R = I(null), A = I(null);
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
          title: `${e.path} · ${q(s)}-click to open it`,
          onClick: o
        }, [
          g("span", $b, w(u.value), 1),
          g("span", Mb, w(d.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: X(["diff-card-badge", e.change])
          }, w(m.value), 3)) : C("", !0)
        ], 8, xb),
        g("span", {
          class: X(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + w(e.added), 3),
        g("span", {
          class: X(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + w(e.removed), 3),
        L(ea, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: y.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = we((p) => y.value = y.value === "after" ? "before" : "after", ["stop"]))
        }, w(y.value === "after" ? "After" : "Before"), 9, Sb)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: X(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = we((p) => a("whole"), ["stop"]))
        }, [
          L(me, {
            name: "file",
            size: 12
          })
        ], 10, _b))
      ], 8, kb),
      e.whole && e.whole.error ? (c(), h("p", Eb, w(e.whole.error), 1)) : C("", !0),
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
          }, null, 8, Cb)
        ], 8, Ab)) : (c(), h("div", {
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
            g("div", Ob, [
              (c(!0), h(K, null, te(ee.value, (p, _) => (c(), h("div", {
                key: _,
                class: X(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", Tb, w(M(p)), 1),
                g("span", Rb, w(l[p.line_type]), 1),
                g("span", Bb, w(S(p)), 1)
              ], 2))), 128)),
              j.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = we((p) => N.value = !0, ["stop"]))
              }, w(j.value) + " more " + w(j.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, r8 = /* @__PURE__ */ J(Ib, [["__scopeId", "data-v-23581cbb"]]), Lb = {
  key: 0,
  class: "window-failure"
}, Nb = {
  __name: "DocumentWindow",
  props: { line: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = ct(), a = I(null);
    async function s() {
      a.value = await n.read(t.line);
    }
    return n.follow(["*.*"], Qo(s, _w.openPanel)), s(), (o, r) => a.value && !a.value.ok ? (c(), h("p", Lb, w(a.value.error), 1)) : a.value ? (c(), W(Lh, {
      key: 1,
      document: a.value.value
    }, null, 8, ["document"])) : C("", !0);
  }
}, Db = {
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
    const n = t, a = e, s = B(() => a.bar ? a.catalogue.bar(a.name) : a.dropdown && a.catalogue.dropdown(a.name) || a.catalogue.window(a.name)), o = B(() => s.value && { render: () => Hn(Nb, { line: s.value.line }) }), r = I(null), l = B(() => {
      var m, v;
      return ((m = s.value) == null ? void 0 : m.loading) === "component" && !s.value.allowed && !((v = r.value) != null && v.component_trusted);
    }), i = B(
      () => `This window runs in the page with the viewer's rights. Trust its module's code with journal window trust ${s.value.module} to show it.`
    ), u = B(
      () => {
        var m, v;
        return r.value ? og(r.value, f) : { reads: ((m = s.value) == null ? void 0 : m.reads) || [], runs: ((v = s.value) == null ? void 0 : v.runs) || [], missing: [], ask: async () => !0 };
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
      return !s.value && ((y = e.catalogue.loaded) == null ? void 0 : y.value) === !1 ? (c(), W(ps, {
        key: 0,
        parts: e.catalogue.skeleton(e.name)
      }, null, 8, ["parts"])) : ((O = s.value) == null ? void 0 : O.shows) === "one-agent" && e.agent === null ? (c(), W(Jt, {
        key: 1,
        title: "No agent is running here",
        "data-window-no-agent": ""
      })) : l.value ? (c(), W(zt, {
        key: 2,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        "unavailable-reason": i.value
      }, null, 8, ["name", "subscriptions", "environment", "unavailable-reason"])) : s.value && s.value.loading === "component" ? (c(), W(Xr, {
        key: u.value.missing.length,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[0] || (v[0] = (b, N) => n("option", b, N))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value && s.value.loading === "frame" ? (c(), W(Zr, {
        key: 4,
        entry: s.value,
        subscriptions: e.subscriptions,
        environment: e.environment,
        agent: e.agent,
        visible: e.visible,
        permissions: u.value,
        prompts: e.prompts,
        options: e.options,
        onOption: v[1] || (v[1] = (b, N) => n("option", b, N))
      }, null, 8, ["entry", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options"])) : s.value ? (c(), W(zt, {
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
        onOption: v[2] || (v[2] = (b, N) => n("option", b, N))
      }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "events", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "skeleton", "unavailable-reason"])) : (c(), W(zt, {
        key: 6,
        name: e.name,
        subscriptions: e.subscriptions,
        environment: e.environment,
        options: e.options,
        onRemove: v[3] || (v[3] = (b) => n("remove"))
      }, null, 8, ["name", "subscriptions", "environment", "options"]));
    };
  }
}, Pb = ["data-section"], jb = {
  __name: "InspectorSections",
  props: { slotName: { type: String, required: !0 }, row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = $e(Dc, null), a = B(() => (n == null ? void 0 : n.catalogue.sectionsAt(t.slotName)) ?? []), s = B(() => ({ row: t.row }));
    return (o, r) => (c(!0), h(K, null, te(a.value, (l) => (c(), h("div", {
      key: l.name,
      class: "inspector-section",
      "data-section": l.name
    }, [
      L(Db, {
        name: l.name,
        catalogue: q(n).catalogue,
        subscriptions: q(n).subscriptions,
        environment: q(n).environment,
        prompts: q(n).prompts,
        "shell-read": q(n).shellRead,
        options: s.value
      }, null, 8, ["name", "catalogue", "subscriptions", "environment", "prompts", "shell-read", "options"])
    ], 8, Pb))), 128));
  }
}, qb = {
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
        L(me, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Fb = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Wb = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Hb = { class: "ask-text" }, Ub = ["placeholder", "aria-label"], zb = ["placeholder", "aria-label"], Vb = {
  key: 3,
  class: "moves"
}, Gb = {
  __name: "RowMoves",
  props: { noun: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = B(() => s0(a.noun, a.row)), r = I(""), l = I(null), i = I(""), u = I("");
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
        r.value ? (c(), h("p", Fb, w(r.value), 1)) : C("", !0),
        (O = l.value) != null && O.confirm ? (c(), h("div", Wb, [
          g("span", Hb, w(l.value.confirm), 1),
          L(ue, {
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
          L(ue, {
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
            onKeydown: y[3] || (y[3] = Yt(we((b) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, Ub), [
            [Ia, i.value]
          ]),
          l.value.opener ? Je((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": y[4] || (y[4] = (b) => u.value = b),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: l.value.opener,
            "aria-label": l.value.opener,
            onKeydown: y[5] || (y[5] = Yt(we((b) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, zb)), [
            [Ia, u.value]
          ]) : C("", !0),
          L(ue, {
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
          L(ue, {
            small: "",
            variant: "ghost",
            onClick: y[6] || (y[6] = (b) => l.value = null)
          }, {
            default: D(() => [...y[8] || (y[8] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Vb, [
          (c(!0), h(K, null, te(o.value, (b) => (c(), W(ue, {
            key: b.word,
            small: !b.bordered,
            bordered: b.bordered,
            icon: b.icon,
            variant: b.main ? "primary" : "ghost",
            class: X({ danger: b.danger }),
            "data-move": b.word,
            onClick: (N) => f(b)
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
}, Kb = /* @__PURE__ */ J(Gb, [["__scopeId", "data-v-0262f48f"]]), Yb = /* @__PURE__ */ new Set(["completed", "cancelled"]), Jb = (e) => Yb.has(e), Wn = (e) => Jb(e) ? "done" : e, Zb = { class: "facts" }, Xb = { class: "fact wide" }, Qb = { class: "fact-value" }, ek = {
  key: 0,
  class: "fact"
}, tk = { class: "fact-value" }, nk = { class: "fact" }, ak = { class: "fact-label" }, sk = ["title"], ok = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, rk = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, lk = {
  key: 2,
  class: "fact"
}, ik = { class: "fact-value" }, ck = { class: "fact wide" }, uk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, dk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Ln.map(({ key: o, label: r }) => ({ key: String(o), label: r })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var l, i;
      return c(), h("div", Zb, [
        g("div", Xb, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", Qb, w((l = e.place) != null && l.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", ek, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", tk, w(e.place.phase_number) + " of " + w(e.place.phase_total) + ": " + w(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(K, { key: 1 }, [
          g("div", nk, [
            g("span", ak, w(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => q(Pe)(`agents:${e.task.helper_id}`))
            }, w(e.task.helper_name), 9, sk)
          ]),
          q(s).has(e.task.state) ? (c(), h("p", ok, w(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", rk, w(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", lk, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", ik, "Agent " + w(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", ck, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          L(Vn, {
            options: q(n),
            value: String(q(Vr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", uk, w(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, fk = /* @__PURE__ */ J(dk, [["__scopeId", "data-v-2bcdca7a"]]), hk = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, mk = ["datetime"], pk = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", hk, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(K, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, w(new Date(a.created_at).toLocaleString()), 9, mk),
        g("p", null, w(a.reason), 1)
      ]))), 128))
    ])) : C("", !0);
  }
}, gk = /* @__PURE__ */ J(pk, [["__scopeId", "data-v-b41f213b"]]), vk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, yk = { ...vk, done: "Completed" }, wk = { class: "task-status-icon" }, bk = ["width", "height", "aria-label"], kk = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = B(() => or("task", Wn(t.status))), a = B(() => n.value === "testing" ? "started" : n.value), s = B(() => yk[t.status] ?? sr("task", t.status));
    return (o, r) => (c(), h("span", wk, [
      L(Lt, {
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
            L(Nt, { value: a.value }, {
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
          ], 10, bk))
        ]),
        _: 1
      })
    ]));
  }
}, Fl = /* @__PURE__ */ J(kk, [["__scopeId", "data-v-ae24a63f"]]), xk = {
  class: "part",
  "data-resource-waits": ""
}, $k = ["onClick"], Mk = { class: "wait-id" }, Sk = { class: "wait-title" }, _k = {
  __name: "TaskWaitList",
  props: { title: { type: String, required: !0 }, waits: { type: Array, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", xk, [
      g("h4", null, w(e.title), 1),
      (c(!0), h(K, null, te(e.waits, (o) => (c(), h("button", {
        key: o.id,
        type: "button",
        class: "wait",
        onClick: (r) => n("select", o.id)
      }, [
        L(Fl, {
          status: q(Wn)(o.state),
          size: 12
        }, null, 8, ["status"]),
        g("span", Mk, w(o.id), 1),
        g("span", Sk, w(o.title), 1)
      ], 8, $k))), 128))
    ]));
  }
}, Do = /* @__PURE__ */ J(_k, [["__scopeId", "data-v-8fb2e251"]]), Ek = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Ak = { class: "text" }, Ck = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, Ok = 180, Tk = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = /* @__PURE__ */ new Set(["completed", "cancelled"]), a = e, s = t, o = I(!1), r = B(() => a.task.waits.filter((i) => !n.has(i.state))), l = B(() => a.task.waits.filter((i) => n.has(i.state)));
    return (i, u) => (c(), h(K, null, [
      r.value.length ? (c(), W(Do, {
        key: 0,
        title: "Waits on",
        waits: r.value,
        onSelect: u[0] || (u[0] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", Ek, [
        u[3] || (u[3] = g("h4", null, "How it was done", -1)),
        g("p", Ak, w(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", Ck, [
        u[4] || (u[4] = g("h4", null, "The brief", -1)),
        g("p", {
          class: X(["text", { clamped: !o.value }])
        }, w(e.task.brief), 3),
        e.task.brief.length > Ok && !o.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: u[1] || (u[1] = (d) => o.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0),
      l.value.length ? (c(), W(Do, {
        key: 3,
        title: "Waited on",
        waits: l.value,
        onSelect: u[2] || (u[2] = (d) => s("select", d))
      }, null, 8, ["waits"])) : C("", !0)
    ], 64));
  }
}, Rk = /* @__PURE__ */ J(Tk, [["__scopeId", "data-v-4a3f1e79"]]), Bk = {
  class: "task-details",
  "data-task-details": ""
}, Ik = { class: "since" }, Lk = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Nk = { class: "text" }, Dk = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Pk = {
  key: 1,
  class: "note"
}, jk = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, qk = { class: "text" }, Fk = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var r;
      return c(), h("div", Bk, [
        g("div", {
          class: X(["state-line", q(Wn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (l) => n("status", l.currentTarget))
          }, [
            L(Fl, {
              status: q(Wn)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + w(a(e.task.state)), 1)
          ]),
          g("span", Ik, [
            o[3] || (o[3] = ne(" since ", -1)),
            L(ea, {
              at: q(Nr)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", Lk, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", Nk, w(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", Dk, "Opens by itself when " + w(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Pk, "Nothing opens this task automatically. Unblock it when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", jk, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", qk, w(e.task.reason), 1)
        ])) : C("", !0),
        L(fk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (l) => n("priority", l))
        }, null, 8, ["task", "place", "refusal"]),
        L(Rk, {
          task: e.task,
          onSelect: o[2] || (o[2] = (l) => n("select", l))
        }, null, 8, ["task"]),
        L(gk, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Wk = /* @__PURE__ */ J(Fk, [["__scopeId", "data-v-408e9f91"]]), Hk = 50, Uk = { messages: 25 }, zk = (e) => Uk[e] || Hk, Vk = {
  class: "task-log",
  "aria-label": "Task log"
}, Gk = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Kk = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Yk = { class: "entries" }, Jk = ["datetime"], Zk = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Xk = {
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
        String(zk("task_logs")),
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
    }), (u, d) => (c(), h("section", Vk, [
      o.value ? (c(), W($t, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        g("p", Gk, w(r.value), 1),
        L(ue, {
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
        n.value.length ? C("", !0) : (c(), h("p", Kk, "No log entries yet.")),
        g("ol", Yk, [
          (c(!0), h(K, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, w(new Date(f.created_at).toLocaleString()), 9, Jk),
            g("p", null, w(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", Zk, [
          L(ue, {
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
          L(ue, {
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
}, Qk = /* @__PURE__ */ J(Xk, [["__scopeId", "data-v-98b3a6b1"]]), e2 = { class: "comment-side-head" }, t2 = {
  key: 0,
  class: "comment-none"
}, n2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: X(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", e2, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        L(cs, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      e.comments.length ? C("", !0) : (c(), h("p", t2, "No comments yet")),
      (c(!0), h(K, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, w(e.words(a)), 1))), 128))
    ], 2));
  }
}, a2 = /* @__PURE__ */ J(n2, [["__scopeId", "data-v-19fdbdd4"]]);
var jo;
/Mac|iPhone|iPad/.test(((jo = navigator.userAgentData) == null ? void 0 : jo.platform) || navigator.platform);
function s2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const o2 = ["placeholder"], r2 = { class: "actions" }, l2 = { class: "error" }, i2 = {
  key: 1,
  class: "card closed"
}, c2 = { class: "mark" }, u2 = { class: "prompt" }, d2 = {
  key: 0,
  class: "draft"
}, f2 = {
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
    const a = e, s = n, o = Ra(e, "draft"), r = Ra(e, "error"), l = I(!!r.value), i = I(!1), u = I(!1), d = I(null);
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
        onKeydown: Yt(m, ["esc"])
      }, [
        ce(y.$slots, "who", {}, void 0, !0),
        Je(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": O[0] || (O[0] = (b) => o.value = b),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: O[1] || (O[1] = Yt((b) => q(s2)(b, v), ["enter"]))
        }, null, 40, o2), [
          [Ia, o.value]
        ]),
        g("div", r2, [
          g("span", l2, w(r.value), 1),
          L(ue, {
            small: "",
            onClick: m
          }, {
            default: D(() => [...O[3] || (O[3] = [
              ne("Cancel", -1)
            ])]),
            _: 1
          }),
          L(ue, {
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
      ], 32)) : (c(), h("div", i2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", c2, [
            L(me, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", u2, w(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", d2, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: O[2] || (O[2] = (b) => s("show"))
        }, [
          g("span", null, w(q(Bi)(e.count, "comment")), 1),
          L(me, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, h2 = /* @__PURE__ */ J(f2, [["__scopeId", "data-v-b68baddd"]]);
function m2(e, t) {
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
const p2 = { class: "top" }, g2 = {
  class: "crumb",
  "data-task-crumb": ""
}, v2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, y2 = {
  key: 1,
  class: "body"
}, w2 = { class: "summary" }, b2 = { class: "stamp" }, k2 = {
  class: "title",
  "data-resource-title": ""
}, x2 = {
  class: "tabs",
  "data-task-tabs": ""
}, $2 = { class: "panels" }, M2 = {
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
    ], v = m2(
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
    async function N(j) {
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
      g("div", p2, [
        e.backed ? (c(), W(qb, {
          key: 0,
          onBack: M[0] || (M[0] = (S) => s("back"))
        })) : C("", !0),
        g("span", g2, w(O.value), 1),
        M[9] || (M[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          L(ue, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: M[1] || (M[1] = (S) => s("step", -1))
          }, {
            default: D(() => [
              L(me, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          L(ue, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: M[2] || (M[2] = (S) => s("step", 1))
          }, {
            default: D(() => [
              L(me, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        L(ue, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: M[3] || (M[3] = (S) => s("close"))
        }, {
          default: D(() => [
            L(me, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      l.value ? (c(), h("p", v2, w(l.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        L(Kb, {
          ref_key: "footer",
          ref: d,
          noun: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: b
        }, null, 8, ["id", "row", "read"]),
        g("header", w2, [
          g("div", b2, [
            ne(" Task " + w(o.value.id) + " · updated ", 1),
            L(ea, {
              at: q(Nr)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", k2, w(o.value.title), 1)
        ]),
        g("div", x2, [
          L(Vn, {
            options: m,
            value: f.value,
            onPick: M[4] || (M[4] = (S) => f.value = S)
          }, null, 8, ["value"])
        ]),
        g("div", $2, [
          L(Nt, { value: f.value }, {
            details: D(() => [
              L(Wk, {
                task: o.value,
                place: r.value,
                refusal: i.value,
                onStatus: ee,
                onPriority: N,
                onSelect: M[5] || (M[5] = (S) => s("select", S))
              }, null, 8, ["task", "place", "refusal"]),
              L(jb, {
                "slot-name": "inspector.task",
                row: o.value
              }, null, 8, ["row"])
            ]),
            comments: D(() => [
              L(a2, {
                below: "",
                comments: q(v).comments.value,
                words: q(v).words,
                onClose: M[6] || (M[6] = (S) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: D(() => [
              L(Qk, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        L(h2, {
          send: q(v).send,
          count: q(v).comments.value.length,
          onShow: M[7] || (M[7] = (S) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", y2, [
        L($t)
      ])),
      u.value ? (c(), W(zn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: M[8] || (M[8] = (S) => u.value = null)
      }, {
        default: D(() => [
          L(ts, null, {
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
}, l8 = /* @__PURE__ */ J(M2, [["__scopeId", "data-v-a1cff4e4"]]);
function S2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ta = { exports: {} }, Po;
function _2() {
  return Po || (Po = 1, (function(e, t) {
    var n = (function() {
      var a = function(M, S) {
        var R = 236, A = 17, x = M, T = o[S], k = null, p = 0, _ = null, E = [], $ = {}, V = function(F, H) {
          p = x * 4 + 17, k = (function(P) {
            for (var U = new Array(P), G = 0; G < P; G += 1) {
              U[G] = new Array(P);
              for (var Q = 0; Q < P; Q += 1)
                U[G][Q] = null;
            }
            return U;
          })(p), Z(0, 0), Z(p - 7, 0), Z(0, p - 7), ve(), ie(), Fe(F, H), x >= 7 && Te(F), _ == null && (_ = Wl(x, T, E)), We(_, H);
        }, Z = function(F, H) {
          for (var P = -1; P <= 7; P += 1)
            if (!(F + P <= -1 || p <= F + P))
              for (var U = -1; U <= 7; U += 1)
                H + U <= -1 || p <= H + U || (0 <= P && P <= 6 && (U == 0 || U == 6) || 0 <= U && U <= 6 && (P == 0 || P == 6) || 2 <= P && P <= 4 && 2 <= U && U <= 4 ? k[F + P][H + U] = !0 : k[F + P][H + U] = !1);
        }, Y = function() {
          for (var F = 0, H = 0, P = 0; P < 8; P += 1) {
            V(!0, P);
            var U = l.getLostPoint($);
            (P == 0 || F > U) && (F = U, H = P);
          }
          return H;
        }, ie = function() {
          for (var F = 8; F < p - 8; F += 1)
            k[F][6] == null && (k[F][6] = F % 2 == 0);
          for (var H = 8; H < p - 8; H += 1)
            k[6][H] == null && (k[6][H] = H % 2 == 0);
        }, ve = function() {
          for (var F = l.getPatternPosition(x), H = 0; H < F.length; H += 1)
            for (var P = 0; P < F.length; P += 1) {
              var U = F[H], G = F[P];
              if (k[U][G] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? k[U + Q][G + oe] = !0 : k[U + Q][G + oe] = !1;
            }
        }, Te = function(F) {
          for (var H = l.getBCHTypeNumber(x), P = 0; P < 18; P += 1) {
            var U = !F && (H >> P & 1) == 1;
            k[Math.floor(P / 3)][P % 3 + p - 8 - 3] = U;
          }
          for (var P = 0; P < 18; P += 1) {
            var U = !F && (H >> P & 1) == 1;
            k[P % 3 + p - 8 - 3][Math.floor(P / 3)] = U;
          }
        }, Fe = function(F, H) {
          for (var P = T << 3 | H, U = l.getBCHTypeInfo(P), G = 0; G < 15; G += 1) {
            var Q = !F && (U >> G & 1) == 1;
            G < 6 ? k[G][8] = Q : G < 8 ? k[G + 1][8] = Q : k[p - 15 + G][8] = Q;
          }
          for (var G = 0; G < 15; G += 1) {
            var Q = !F && (U >> G & 1) == 1;
            G < 8 ? k[8][p - G - 1] = Q : G < 9 ? k[8][15 - G - 1 + 1] = Q : k[8][15 - G - 1] = Q;
          }
          k[p - 8][8] = !F;
        }, We = function(F, H) {
          for (var P = -1, U = p - 1, G = 7, Q = 0, oe = l.getMaskFunction(H), se = p - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (k[U][se - ye] == null) {
                  var ke = !1;
                  Q < F.length && (ke = (F[Q] >>> G & 1) == 1);
                  var le = oe(U, se - ye);
                  le && (ke = !ke), k[U][se - ye] = ke, G -= 1, G == -1 && (Q += 1, G = 7);
                }
              if (U += P, U < 0 || p <= U) {
                U -= P, P = -P;
                break;
              }
            }
        }, _t = function(F, H) {
          for (var P = 0, U = 0, G = 0, Q = new Array(H.length), oe = new Array(H.length), se = 0; se < H.length; se += 1) {
            var ye = H[se].dataCount, ke = H[se].totalCount - ye;
            U = Math.max(U, ye), G = Math.max(G, ke), Q[se] = new Array(ye);
            for (var le = 0; le < Q[se].length; le += 1)
              Q[se][le] = 255 & F.getBuffer()[le + P];
            P += ye;
            var Be = l.getErrorCorrectPolynomial(ke), Ie = u(Q[se], Be.getLength() - 1), Es = Ie.mod(Be);
            oe[se] = new Array(Be.getLength() - 1);
            for (var le = 0; le < oe[se].length; le += 1) {
              var As = le + Es.getLength() - oe[se].length;
              oe[se][le] = As >= 0 ? Es.getAt(As) : 0;
            }
          }
          for (var Cs = 0, le = 0; le < H.length; le += 1)
            Cs += H[le].totalCount;
          for (var ta = new Array(Cs), fn = 0, le = 0; le < U; le += 1)
            for (var se = 0; se < H.length; se += 1)
              le < Q[se].length && (ta[fn] = Q[se][le], fn += 1);
          for (var le = 0; le < G; le += 1)
            for (var se = 0; se < H.length; se += 1)
              le < oe[se].length && (ta[fn] = oe[se][le], fn += 1);
          return ta;
        }, Wl = function(F, H, P) {
          for (var U = d.getRSBlocks(F, H), G = f(), Q = 0; Q < P.length; Q += 1) {
            var oe = P[Q];
            G.put(oe.getMode(), 4), G.put(oe.getLength(), l.getLengthInBits(oe.getMode(), F)), oe.write(G);
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
        $.addData = function(F, H) {
          H = H || "Byte";
          var P = null;
          switch (H) {
            case "Numeric":
              P = m(F);
              break;
            case "Alphanumeric":
              P = v(F);
              break;
            case "Byte":
              P = y(F);
              break;
            case "Kanji":
              P = O(F);
              break;
            default:
              throw "mode:" + H;
          }
          E.push(P), _ = null;
        }, $.isDark = function(F, H) {
          if (F < 0 || p <= F || H < 0 || p <= H)
            throw F + "," + H;
          return k[F][H];
        }, $.getModuleCount = function() {
          return p;
        }, $.make = function() {
          if (x < 1) {
            for (var F = 1; F < 40; F++) {
              for (var H = d.getRSBlocks(F, T), P = f(), U = 0; U < E.length; U++) {
                var G = E[U];
                P.put(G.getMode(), 4), P.put(G.getLength(), l.getLengthInBits(G.getMode(), F)), G.write(P);
              }
              for (var Q = 0, U = 0; U < H.length; U++)
                Q += H[U].dataCount;
              if (P.getLengthInBits() <= Q * 8)
                break;
            }
            x = F;
          }
          V(!1, Y());
        }, $.createTableTag = function(F, H) {
          F = F || 2, H = typeof H > "u" ? F * 4 : H;
          var P = "";
          P += '<table style="', P += " border-width: 0px; border-style: none;", P += " border-collapse: collapse;", P += " padding: 0px; margin: " + H + "px;", P += '">', P += "<tbody>";
          for (var U = 0; U < $.getModuleCount(); U += 1) {
            P += "<tr>";
            for (var G = 0; G < $.getModuleCount(); G += 1)
              P += '<td style="', P += " border-width: 0px; border-style: none;", P += " border-collapse: collapse;", P += " padding: 0px; margin: 0px;", P += " width: " + F + "px;", P += " height: " + F + "px;", P += " background-color: ", P += $.isDark(U, G) ? "#000000" : "#ffffff", P += ";", P += '"/>';
            P += "</tr>";
          }
          return P += "</tbody>", P += "</table>", P;
        }, $.createSvgTag = function(F, H, P, U) {
          var G = {};
          typeof arguments[0] == "object" && (G = arguments[0], F = G.cellSize, H = G.margin, P = G.alt, U = G.title), F = F || 2, H = typeof H > "u" ? F * 4 : H, P = typeof P == "string" ? { text: P } : P || {}, P.text = P.text || null, P.id = P.text ? P.id || "qrcode-description" : null, U = typeof U == "string" ? { text: U } : U || {}, U.text = U.text || null, U.id = U.text ? U.id || "qrcode-title" : null;
          var Q = $.getModuleCount() * F + H * 2, oe, se, ye, ke, le = "", Be;
          for (Be = "l" + F + ",0 0," + F + " -" + F + ",0 0,-" + F + "z ", le += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', le += G.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', le += ' viewBox="0 0 ' + Q + " " + Q + '" ', le += ' preserveAspectRatio="xMinYMin meet"', le += U.text || P.text ? ' role="img" aria-labelledby="' + Et([U.id, P.id].join(" ").trim()) + '"' : "", le += ">", le += U.text ? '<title id="' + Et(U.id) + '">' + Et(U.text) + "</title>" : "", le += P.text ? '<description id="' + Et(P.id) + '">' + Et(P.text) + "</description>" : "", le += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', le += '<path d="', ye = 0; ye < $.getModuleCount(); ye += 1)
            for (ke = ye * F + H, oe = 0; oe < $.getModuleCount(); oe += 1)
              $.isDark(ye, oe) && (se = oe * F + H, le += "M" + se + "," + ke + Be);
          return le += '" stroke="transparent" fill="black"/>', le += "</svg>", le;
        }, $.createDataURL = function(F, H) {
          F = F || 2, H = typeof H > "u" ? F * 4 : H;
          var P = $.getModuleCount() * F + H * 2, U = H, G = P - H;
          return j(P, P, function(Q, oe) {
            if (U <= Q && Q < G && U <= oe && oe < G) {
              var se = Math.floor((Q - U) / F), ye = Math.floor((oe - U) / F);
              return $.isDark(ye, se) ? 0 : 1;
            } else
              return 1;
          });
        }, $.createImgTag = function(F, H, P) {
          F = F || 2, H = typeof H > "u" ? F * 4 : H;
          var U = $.getModuleCount() * F + H * 2, G = "";
          return G += "<img", G += ' src="', G += $.createDataURL(F, H), G += '"', G += ' width="', G += U, G += '"', G += ' height="', G += U, G += '"', P && (G += ' alt="', G += Et(P), G += '"'), G += "/>", G;
        };
        var Et = function(F) {
          for (var H = "", P = 0; P < F.length; P += 1) {
            var U = F.charAt(P);
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
        }, Hl = function(F) {
          var H = 1;
          F = typeof F > "u" ? H * 2 : F;
          var P = $.getModuleCount() * H + F * 2, U = F, G = P - F, Q, oe, se, ye, ke, le = {
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
              ke = "█", U <= oe && oe < G && U <= Q && Q < G && $.isDark(se, Math.floor((oe - U) / H)) && (ke = " "), U <= oe && oe < G && U <= Q + 1 && Q + 1 < G && $.isDark(ye, Math.floor((oe - U) / H)) ? ke += " " : ke += "█", Ie += F < 1 && Q + 1 >= G ? Be[ke] : le[ke];
            Ie += `
`;
          }
          return P % 2 && F > 0 ? Ie.substring(0, Ie.length - P - 1) + Array(P + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return $.createASCII = function(F, H) {
          if (F = F || 1, F < 2)
            return Hl(H);
          F -= 1, H = typeof H > "u" ? F * 2 : H;
          var P = $.getModuleCount() * F + H * 2, U = H, G = P - H, Q, oe, se, ye, ke = Array(F + 1).join("██"), le = Array(F + 1).join("  "), Be = "", Ie = "";
          for (Q = 0; Q < P; Q += 1) {
            for (se = Math.floor((Q - U) / F), Ie = "", oe = 0; oe < P; oe += 1)
              ye = 1, U <= oe && oe < G && U <= Q && Q < G && $.isDark(se, Math.floor((oe - U) / F)) && (ye = 0), Ie += ye ? ke : le;
            for (se = 0; se < F; se += 1)
              Be += Ie + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, $.renderTo2dContext = function(F, H) {
          H = H || 2;
          for (var P = $.getModuleCount(), U = 0; U < P; U++)
            for (var G = 0; G < P; G++)
              F.fillStyle = $.isDark(U, G) ? "black" : "white", F.fillRect(U * H, G * H, H, H);
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
      }, N = function() {
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
        for (var p = N(), _ = k.toByteArray(), E = 0; E < _.length; E += 1)
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
  })(Ta)), Ta.exports;
}
var E2 = _2();
const A2 = /* @__PURE__ */ S2(E2), C2 = ["width", "height", "viewBox"], O2 = ["width", "height"], T2 = ["d"], R2 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = B(() => {
      const a = A2(0, "M");
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
      }, null, 8, O2),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, T2)
    ], 8, C2));
  }
}, i8 = /* @__PURE__ */ J(R2, [["__scopeId", "data-v-489f0852"]]), B2 = {
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
}, c8 = /* @__PURE__ */ J(B2, [["__scopeId", "data-v-47e67f04"]]);
function u8(e, t, n) {
  const a = e[t];
  return { ...e, [t]: a.includes(n) ? a.filter((s) => s !== n) : [...a, n] };
}
const d8 = ni(() => import("./VoiceFigure-BBWJbNS7.js").then((e) => e.V)), f8 = "1.2.0", h8 = "3.5";
export {
  Uu as $,
  xe as A,
  _e as B,
  Jn as C,
  Ze as D,
  yx as E,
  qy as F,
  i4 as G,
  mx as H,
  by as I,
  Gy as J,
  St as K,
  N2 as L,
  ks as M,
  Qy as N,
  Vy as O,
  Yn as P,
  I4 as Q,
  F5 as R,
  Cn as S,
  j4 as T,
  B5 as U,
  Me as V,
  Dn as W,
  R5 as X,
  T5 as Y,
  Hu as Z,
  J as _,
  $5 as a,
  nx as a$,
  Zy as a0,
  W5 as a1,
  H5 as a2,
  Se as a3,
  e4 as a4,
  Q5 as a5,
  bt as a6,
  U5 as a7,
  f4 as a8,
  f5 as a9,
  K4 as aA,
  T4 as aB,
  cy as aC,
  g4 as aD,
  v4 as aE,
  wx as aF,
  $l as aG,
  P4 as aH,
  ln as aI,
  y5 as aJ,
  p5 as aK,
  ix as aL,
  cn as aM,
  fx as aN,
  l4 as aO,
  R4 as aP,
  B4 as aQ,
  O4 as aR,
  en as aS,
  gt as aT,
  h5 as aU,
  Q0 as aV,
  A4 as aW,
  j5 as aX,
  kl as aY,
  It as aZ,
  Pt as a_,
  ax as aa,
  ux as ab,
  k5 as ac,
  I5 as ad,
  L5 as ae,
  Z5 as af,
  X5 as ag,
  t4 as ah,
  E5 as ai,
  Oo as aj,
  z5 as ak,
  d4 as al,
  $x as am,
  M4 as an,
  x4 as ao,
  k4 as ap,
  n4 as aq,
  Y5 as ar,
  K5 as as,
  J5 as at,
  D4 as au,
  u4 as av,
  h4 as aw,
  _x as ax,
  Vt as ay,
  m4 as az,
  uw as b,
  Sx as b$,
  Ny as b0,
  dx as b1,
  W4 as b2,
  F4 as b3,
  $v as b4,
  il as b5,
  Q4 as b6,
  c4 as b7,
  Qn as b8,
  nt as b9,
  U4 as bA,
  J4 as bB,
  rt as bC,
  q4 as bD,
  Z4 as bE,
  p4 as bF,
  S4 as bG,
  y4 as bH,
  Ee as bI,
  r4 as bJ,
  X4 as bK,
  Ix as bL,
  Lx as bM,
  u5 as bN,
  nv as bO,
  s4 as bP,
  z4 as bQ,
  M5 as bR,
  xx as bS,
  H4 as bT,
  V4 as bU,
  G4 as bV,
  a4 as bW,
  uy as bX,
  o4 as bY,
  b4 as bZ,
  kx as b_,
  Y4 as ba,
  wa as bb,
  Lr as bc,
  Ax as bd,
  Tx as be,
  N4 as bf,
  lx as bg,
  d5 as bh,
  $4 as bi,
  Cx as bj,
  V5 as bk,
  G5 as bl,
  C5 as bm,
  q5 as bn,
  v5 as bo,
  ox as bp,
  S5 as bq,
  _5 as br,
  O5 as bs,
  E4 as bt,
  K0 as bu,
  hx as bv,
  zy as bw,
  A5 as bx,
  w5 as by,
  _4 as bz,
  xv as c,
  $t as c$,
  g5 as c0,
  m5 as c1,
  w4 as c2,
  Rx as c3,
  _s as c4,
  Bx as c5,
  Pl as c6,
  rx as c7,
  D5 as c8,
  N5 as c9,
  Jx as cA,
  U2 as cB,
  f8 as cC,
  h8 as cD,
  X2 as cE,
  Xx as cF,
  Ga as cG,
  o5 as cH,
  Rg as cI,
  wt as cJ,
  ts as cK,
  zn as cL,
  G2 as cM,
  Q2 as cN,
  _i as cO,
  Yp as cP,
  o8 as cQ,
  Y2 as cR,
  i8 as cS,
  _w as cT,
  Gx as cU,
  ad as cV,
  q2 as cW,
  l5 as cX,
  ib as cY,
  Vn as cZ,
  e5 as c_,
  X0 as ca,
  b5 as cb,
  Hy as cc,
  C4 as cd,
  ys as ce,
  sy as cf,
  L4 as cg,
  Gt as ch,
  Bt as ci,
  z2 as cj,
  Yx as ck,
  ue as cl,
  Eu as cm,
  Iu as cn,
  cs as co,
  Lh as cp,
  mr as cq,
  r8 as cr,
  c5 as cs,
  J1 as ct,
  Jt as cu,
  Nx as cv,
  L2 as cw,
  vt as cx,
  au as cy,
  me as cz,
  je as d,
  Rp as d$,
  ut as d0,
  M1 as d1,
  ji as d2,
  a5 as d3,
  F2 as d4,
  Nt as d5,
  Zx as d6,
  l8 as d7,
  Fl as d8,
  ou as d9,
  P2 as dA,
  e8 as dB,
  _g as dC,
  Ow as dD,
  W2 as dE,
  Z2 as dF,
  Fx as dG,
  Hx as dH,
  Pe as dI,
  V2 as dJ,
  K2 as dK,
  qx as dL,
  rp as dM,
  j2 as dN,
  D2 as dO,
  sr as dP,
  or as dQ,
  Lc as dR,
  H2 as dS,
  Ge as dT,
  u8 as dU,
  Tw as dV,
  n5 as dW,
  jx as dX,
  Kx as dY,
  Aw as dZ,
  Qx as d_,
  st as da,
  t5 as db,
  ea as dc,
  d8 as dd,
  c8 as de,
  ps as df,
  Wx as dg,
  rs as dh,
  jm as di,
  oo as dj,
  Ur as dk,
  Bc as dl,
  a8 as dm,
  n8 as dn,
  ls as dp,
  Rc as dq,
  Qo as dr,
  J2 as ds,
  s8 as dt,
  i5 as du,
  r5 as dv,
  s5 as dw,
  Px as dx,
  _f as dy,
  Dx as dz,
  P5 as e,
  Vo as e0,
  vb as e1,
  qp as e2,
  Ux as e3,
  Va as e4,
  zx as e5,
  Vx as e6,
  ct as e7,
  t8 as e8,
  Ic as e9,
  G0 as f,
  Ex as g,
  tn as h,
  px as i,
  Ox as j,
  gx as k,
  sx as l,
  pw as m,
  xs as n,
  cx as o,
  x5 as p,
  vx as q,
  Nl as r,
  Dl as s,
  Ae as t,
  Sv as u,
  ex as v,
  Mx as w,
  tx as x,
  dn as y,
  bx as z
};
