/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as Z, Fragment as G, renderList as te, normalizeStyle as fe, defineComponent as wl, Comment as xl, h as Ua, cloneVNode as $l, createBlock as V, withCtx as N, unref as H, createVNode as I, toDisplayString as b, createCommentVNode as A, inject as $e, useAttrs as Rn, computed as R, ref as T, resolveDynamicComponent as pt, mergeProps as Ke, onUnmounted as Ae, onMounted as Te, Teleport as za, useId as Va, resolveDirective as Ml, withDirectives as Ye, createTextVNode as ne, reactive as Ga, shallowRef as Ue, watch as he, nextTick as st, Transition as Ot, withModifiers as ke, TransitionGroup as bo, shallowReactive as Sl, isRef as ys, onBeforeUnmount as Tt, resolveComponent as _l, useModel as ba, getCurrentInstance as El, mergeModels as wa, getCurrentScope as wo, onScopeDispose as xo, provide as Cl, onErrorCaptured as Al, toHandlers as Ol, createSlots as Tl, vShow as $o, useSlots as Bl, withKeys as Ht, vModelText as xa, defineAsyncComponent as Il } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Rl = { class: "skeleton-line" }, Ll = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Rl, [
      ce(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(G, null, te(e.bars, (a) => (c(), h("span", {
          key: a.width,
          class: Z(["bar", { still: e.still }]),
          style: fe({ width: a.width, height: `${a.height}px`, borderRadius: `${a.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ot = /* @__PURE__ */ Y(Ll, [["__scopeId", "data-v-0ebb6933"]]), Bt = wl({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== xl);
      return a.length !== 1 ? Ua(G, { key: n }, a) : a[0].key == null ? $l(a[0], { key: n }) : a[0];
    };
  }
}), Nl = ["aria-label"], Dl = ["aria-label"], Pl = ["aria-label"], jl = ["aria-label"], ql = ["aria-label"], Fl = ["aria-label"], Wl = ["aria-label"], Hl = {
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
    return (i, u) => (c(), V(Bt, { value: e.shape }, {
      messages: N(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(G, null, te(t, (d) => g("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Nl)
      ]),
      older: N(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, Dl)
      ]),
      cards: N(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(G, null, te(n, (f) => I(ot, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Pl)
      ]),
      file: N(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            I(ot, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(G, null, te(s, (f) => I(ot, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, jl)
      ]),
      page: N(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          I(ot, {
            class: "skeleton-heading",
            bars: l
          }),
          (c(!0), h(G, null, te(e.count, (d) => (c(), V(ot, {
            key: d,
            bars: H(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ql)
      ]),
      text: N(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), V(ot, {
            key: d,
            bars: H(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, Fl)
      ]),
      default: N(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), V(ot, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, Wl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, gt = /* @__PURE__ */ Y(Hl, [["__scopeId", "data-v-1392eacb"]]), Ul = {
  key: 1,
  class: "empty-state titled"
}, zl = { class: "empty-state-title" }, Vl = { class: "empty-state-text" }, Gl = {
  key: 2,
  class: "empty-state"
}, Kl = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), V(gt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Ul, [
      g("p", zl, b(e.title), 1),
      g("p", Vl, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Gl, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, xn = /* @__PURE__ */ Y(Kl, [["__scopeId", "data-v-b27e89b0"]]), Yl = { class: "fold-group" }, Zl = ["aria-expanded"], Jl = { class: "fold-label" }, Xl = {
  key: 0,
  class: "fold-count"
}, Ql = {
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
    return (a, s) => (c(), h("div", Yl, [
      g("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", Jl, b(e.label), 1),
        e.count !== "" ? (c(), h("span", Xl, b(e.count), 1)) : A("", !0),
        g("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Zl),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, j2 = /* @__PURE__ */ Y(Ql, [["__scopeId", "data-v-9ef1865c"]]), ei = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function vt() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const ti = ["stroke-width", "innerHTML"], me = {
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
    }, null, 12, ti));
  }
}, ni = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, ai = /* @__PURE__ */ Y(ni, [["__scopeId", "data-v-eb453d6f"]]), si = 120, oi = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Rn(), a = R(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = T(!1), o = R(() => t.busy || s.value), r = $e(Se, null), l = R(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(u)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, si);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), V(pt(e.href ? "a" : "button"), Ke(a.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: l.value,
      onClick: i
    }), {
      default: N(() => [
        g("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), V(me, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          ce(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), V(ai, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ue = /* @__PURE__ */ Y(oi, [["__scopeId", "data-v-033d70ca"]]), ri = (e, t, n) => Math.max(t, Math.min(n, e)), li = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Mo = /* @__PURE__ */ new WeakMap(), ii = (e, t) => Mo.set(e, t);
function ci(e, t) {
  for (let n = t; n; n = Mo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function So(e, t) {
  const n = (a) => {
    var o, r;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    s && !ci(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const xt = 8, ui = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = T(null), o = (m) => m ? `${m}px` : void 0, r = R(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), l = T({ w: 0, h: 0 }), i = T(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), f = (m) => {
      const O = m.closest(".pane, .float-window");
      return O ? d(O.getBoundingClientRect()) : u();
    }, p = (m, O) => `${Math.max(0, m ? Math.min(m, O) : O)}px`;
    function y(m, O) {
      return {
        below: m.bottom - O.bottom - a.gap - xt,
        above: O.top - m.top - a.gap - xt,
        across: m.right - m.left - 2 * xt
      };
    }
    function w(m) {
      const O = f(a.anchor), L = y(O, m);
      return l.value.w <= L.across && l.value.h <= Math.max(L.below, L.above) ? O : u();
    }
    const S = R(() => {
      if (!i.value) return r.value;
      const m = i.value, O = w(m), L = y(O, m), { w: F, h: X } = l.value, J = a.align === "auto" ? m.left + m.right > O.left + O.right : a.align === "right", K = ri(J ? m.right - F : m.left, O.left + xt, Math.max(O.left + xt, O.right - F - xt)), ve = X > L.below && L.above > L.below ? { bottom: `${window.innerHeight - m.top + a.gap}px`, maxHeight: p(a.maxHeight, L.above) } : { top: `${m.bottom + a.gap}px`, maxHeight: p(a.maxHeight, L.below) };
      return { ...r.value, ...ve, left: `${K}px`, maxWidth: p(a.maxWidth, L.across) };
    }), $ = n, B = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function U(m) {
      const O = B(), L = O.indexOf(document.activeElement);
      O[(L + m + O.length) % O.length].focus();
    }
    const ee = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => $("close") }, P = (m) => ee[m.key] && (m.preventDefault(), ee[m.key]()), x = () => s.value && (l.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let C = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(C), C = requestAnimationFrame(x);
    });
    So(s, (m) => a.anchor && !a.anchor.contains(m.target) && $("close"));
    const _ = (m, O) => ["top", "left", "right", "bottom"].some((L) => Math.abs(m[L] - O[L]) > 1), v = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let E = 0;
    function k() {
      if (a.anchor) {
        const m = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || v(m)) return $("close");
        _(m, i.value) && (i.value = m);
      }
      E = requestAnimationFrame(k);
    }
    return Te(() => {
      a.anchor && s.value && ii(s.value, a.anchor), x(), s.value && M.observe(s.value), !a.plain && B()[0] && B()[0].focus(), k();
    }), Ae(() => {
      M.disconnect(), cancelAnimationFrame(E), cancelAnimationFrame(C);
    }), t({ element: s }), (m, O) => (c(), V(za, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ke({
        ref_key: "panel",
        ref: s
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: S.value,
        onKeydown: P
      }), [
        ce(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ln = /* @__PURE__ */ Y(ui, [["__scopeId", "data-v-3d203970"]]), di = { class: "split-button" }, fi = {
  __name: "SplitButton",
  props: { kind: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = T(null), s = T(!1), o = () => s.value = !1;
    return (r, l) => (c(), h("span", di, [
      I(ue, {
        kind: e.kind,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: l[0] || (l[0] = (i) => n("main"))
      }, {
        default: N(() => [
          ce(r.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["kind", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        I(ue, {
          kind: e.kind,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: l[1] || (l[1] = (i) => s.value = !s.value)
        }, {
          default: N(() => [
            I(me, { name: "caret" })
          ]),
          _: 1
        }, 8, ["kind", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), V(Ln, {
        key: 0,
        anchor: a.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: N(() => [
          ce(r.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : A("", !0)
    ]));
  }
}, hi = /* @__PURE__ */ Y(fi, [["__scopeId", "data-v-ef04170d"]]), mi = ["aria-checked", "aria-haspopup", "onClick"], pi = {
  key: 0,
  class: "segmented-dot"
}, gi = {
  key: 1,
  class: "segmented-count"
}, vi = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Va();
    return (s, o) => {
      const r = Ml("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(G, null, te(e.options, (l) => Ye((c(), h("button", {
          key: l.key,
          type: "button",
          role: "radio",
          "aria-checked": l.key === e.value,
          "aria-haspopup": l.opens,
          class: Z(["segmented-option", { on: l.key === e.value }]),
          onClick: (i) => n("pick", l.key)
        }, [
          l.dot ? (c(), h("span", pi)) : A("", !0),
          ne(" " + b(l.label) + " ", 1),
          l.count !== void 0 ? (c(), h("em", gi, b(l.count), 1)) : A("", !0)
        ], 10, mi)), [
          [r, l.tip || l.title, `${H(a)}-${l.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nn = /* @__PURE__ */ Y(vi, [["__scopeId", "data-v-ca953072"]]), _o = typeof document < "u" && document.documentElement.classList.contains("phone");
function yi() {
  return () => {
  };
}
function $a(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Eo(e = window) {
  if (!$a(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    $a(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ma = "journal.stale-build-reload", ki = 'script[type="module"][src*="/assets/index-"]', ks = (e) => {
  var t;
  return ((t = e.querySelector(ki)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function bi(e = document, t = fetch, n = () => Eo(window)) {
  const a = ks(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = ks(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let zn = "";
function wi(e, t = () => Eo(window)) {
  if (!e) return !1;
  const n = !!zn && zn !== e;
  return zn = e, n && t(), n;
}
const xi = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function $i(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ma) === e.message) return !1;
    t.setItem(Ma, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Mi(e = window.sessionStorage) {
  try {
    e.removeItem(Ma);
  } catch {
    return;
  }
}
const Si = 2e3, _i = 3e4, je = Ga({ starting: !1, external: !1, late: !1, offline: !1 }), Co = () => je.starting, Ei = 3;
let rn = 0, Sa = 0, Ao = 0, Oo = [];
async function Ci() {
  try {
    const e = await Et.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: je.external };
  }
}
function Ai() {
  clearInterval(Sa), clearTimeout(Ao), Sa = 0, Object.assign(je, { starting: !1, external: !1, late: !1, offline: !1 }), Oo.splice(0).forEach((e) => e()), bi();
}
let Vn = !1;
async function Oi() {
  if (je.offline = !navigator.onLine, Vn) return;
  Vn = !0;
  const e = await Ci();
  if (Vn = !1, je.external = e.updating, rn = !e.restarting && !e.updating && e.reachable ? rn + 1 : 0, rn < Ei) return;
  rn = 0, (!wi(e.started_at) || $a()) && Ai();
}
function bs() {
  je.starting || (je.starting = !0, je.offline = !navigator.onLine, Sa = setInterval(Oi, Si), Ao = setTimeout(() => je.late = !0, _i));
}
const Ti = () => je.starting ? new Promise((e) => Oo.push(e)) : Promise.resolve(), ws = 2e4, Bi = 3e5, ln = 6, Ii = 500, Ri = "/journal/summary", Li = "/api/server-state", Ni = 2e4, xs = _o ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Di = (e) => e.split("?")[0].endsWith(Ri), To = (e, t) => Object.assign(new Error(t), { status: e });
async function Pi(e, t, n = To) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const ji = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class qi {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = ln;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = ln;
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
    const l = a instanceof FormData;
    try {
      return await fetch(n, {
        method: t,
        headers: { ...xs, ...r, ...a === void 0 || l ? {} : { "Content-Type": "application/json" } },
        body: ji(a),
        signal: AbortSignal.timeout(s || (l ? Bi : ws))
      });
    } catch (i) {
      if (i instanceof TypeError && bs(), t !== "GET" || !(i instanceof TypeError) || o <= 1) throw i;
      return await new Promise((u) => setTimeout(u, Ii)), this.reach(t, n, a, s, o - 1, r);
    }
  }
  async send(t, n, a, s = 0, o = ln, r = {}) {
    this.watcher("sent", t, n, a);
    const l = t === "GET" ? () => {
    } : yi(), i = await this.reach(t, n, a, s, o, r).finally(() => {
      l(), this.watcher("answered", t, n, a);
    });
    return Pi(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: xs, signal: AbortSignal.timeout(ws) });
    if (!n.ok) throw To(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, a, s, ln, o).then((i) => (this.written(n), i));
    if (Co() && !Di(n))
      return Promise.reject(Object.assign(new Error("The journal is updating."), { updating: !0 }));
    if (this.flying.has(r)) return this.flying.get(r);
    const l = this.send(t, n, a, 0, this.tries, o);
    return this.flying.set(r, l), l.finally(() => this.flying.delete(r)).catch(() => {
    }), l;
  }
  // the stream of the journal's entries, which an address names whole, its environment in its query
  stream(t) {
    return new EventSource(t);
  }
  // what the server says of itself while the cover is up: a request that fails here is the cover's own question, so it says nothing more
  serverState() {
    return fetch(Li, { cache: "no-store", signal: AbortSignal.timeout(Ni) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (a) {
      throw a instanceof TypeError && bs(), a;
    }
  }
}
const Et = new qi(), Fi = 0, Wi = "/api/lines", Hi = "/api/line";
class Ui {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((a, s) => {
      this.waiting.push({ body: t, signal: n, resolve: a, reject: s }), this.timer ?? (this.timer = setTimeout(() => this.send(), Fi));
    });
  }
  async send() {
    const t = this.waiting.filter((n) => {
      var a;
      return !((a = n.signal) != null && a.aborted);
    });
    if (this.waiting.filter((n) => {
      var a;
      return (a = n.signal) == null ? void 0 : a.aborted;
    }).forEach((n) => n.reject(new DOMException("cancelled", "AbortError"))), this.waiting = [], this.timer = null, t.length === 1) return this.alone(t[0]);
    if (t.length)
      try {
        const n = await Et.raw(Wi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((s) => s.body) }) }), { answers: a } = await n.json();
        t.forEach((s, o) => s.resolve(a[o]));
      } catch (n) {
        t.forEach((a) => a.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Et.raw(Hi, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const zi = new Ui(), Vi = 150, Gi = () => Vi;
function Ka(e, t, n = Gi(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Ki {
  constructor() {
    this.following = Ue([]), this.held = /* @__PURE__ */ new Set();
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
    for (const n of this.follows)
      n.patterns.some((a) => Bo(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Bo(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Io = /* @__PURE__ */ new Map();
class Yi {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Ue({ buttons: [], missing: {} }), this.loading = Ue(!1), this.loaded = Ue(!1), this.failed = Ue(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.loading.value = !0, this.pending = this.read().then((t) => (this.offers.value = t, this.loaded.value = !0, this.failed.value = "", t)).catch((t) => {
      throw this.failed.value = t.message, t;
    }).finally(() => {
      this.pending = null, this.loading.value = !1;
    }), this.pending);
  }
  async read() {
    const t = await Et.raw(`/api/buttons?environment=${encodeURIComponent(this.environment)}`);
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
function q2(e, t) {
  const n = new Yi(e, t);
  return Io.set(e, n), n.load().catch(() => {
  }), n;
}
const Ya = (e) => Io.get(e);
function Zi(e, t, n) {
  const a = Ya(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Ji(e, t) {
  if (!e) return !0;
  const n = Ya(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Xi = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Ro = {};
async function F2(e = fetch) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Ro = (await t.json()).states);
}
const Za = (e, t) => {
  var n;
  return (n = Ro[e]) == null ? void 0 : n[t];
}, Lo = (e, t) => {
  var n;
  return ((n = Za(e, t)) == null ? void 0 : n.label) ?? Xi(t);
}, No = (e, t) => {
  var n;
  return ((n = Za(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Qi = (e, t) => {
  var n;
  return ((n = Za(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, ec = Symbol("pane-page"), tc = { 1: "refused", 2: "usage", 3: "fault" }, nc = 100, ac = 50, sc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, oc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function rc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: r, open: l, options: i = T({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: p = "", tabs: y = [], sources: w = [], links: S = {}, search: $ = {}, readOnly: B = !1, shared: U = null }) {
  const ee = /* @__PURE__ */ new Map(), P = new AbortController(), x = T(!1), C = performance.now();
  let M = 0, _ = 0;
  const v = () => {
    clearTimeout(_), _ = setTimeout(() => {
      M === 0 && Ka(C, () => x.value = !0);
    }, ac);
  }, E = (k) => {
    const m = ee.get(k);
    if (m && performance.now() - m.at < nc) return m.answer;
    M += 1;
    const O = Po(e, k, t, P.signal).finally(() => {
      M -= 1, v();
    });
    return ee.set(k, { answer: O, at: performance.now() }), O;
  };
  return {
    answered: x,
    settle: v,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: y,
    sources: w,
    links: S,
    search: $,
    readOnly: B,
    shared: U,
    read: E,
    run: (k) => ft(e, k, t, P.signal),
    upload: (k) => ic(k, P.signal),
    cancel: () => P.abort(),
    subscriptions: r,
    follow: (k, m) => r.follow(e, k.filter((O) => o.some((L) => Bo(L, O))), (O) => {
      ee.clear(), m(O);
    }, a),
    open: l,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (k) => R(() => {
      var m;
      return i.value[k] ?? ((m = u.find((O) => O.key === k)) == null ? void 0 : m.default);
    }),
    setting: async (k, m) => {
      const O = await E(`window setting ${e} ${k}`);
      return O.ok ? O.value.value : m;
    },
    setOption: f,
    keep: (k, m) => ft(e, ["window", "save-setting", e, k, JSON.stringify(m)], t, P.signal)
  };
}
function lc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Ut = { ok: !1, failure: "cancelled", error: "" }, Do = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ft(e, t, n, a = void 0) {
  try {
    const s = await zi.add({ window: e, line: Array.isArray(t) ? t : jo(t), environment: n }, a);
    return a != null && a.aborted ? Ut : s.code === 0 ? { ok: !0, value: s.value } : { ok: !1, failure: tc[s.code] || "fault", error: lc(s.error) };
  } catch {
    return a != null && a.aborted ? Ut : { ok: !1, failure: "unreachable", error: Do };
  }
}
async function Po(e, t, n, a) {
  const s = await ft(e, t, n, a);
  return s.failure !== "unreachable" || !Co() ? s : (await Ti(), a.aborted ? Ut : Po(e, t, n, a));
}
async function ic(e, t = void 0) {
  try {
    const n = await Et.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), a = await n.json();
    return t != null && t.aborted ? Ut : n.ok ? { ok: !0, value: a.file } : { ok: !1, failure: "refused", error: a.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Ut : { ok: !1, failure: "unreachable", error: Do };
  }
}
function jo(e) {
  return [...e.matchAll(sc)].map(([t]) => t.replace(oc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const cc = (e) => `show-${e}`, W2 = (e, t, n) => e.filter((a) => {
  var s;
  return n(cc((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), qo = "messages.chat", uc = {
  key: 0,
  class: "template-brief"
}, dc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, fc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T([]), o = T(""), r = R(() => s.value.map((u) => ({ key: String(u.id), label: u.module ? `${u.title} · ${u.module}` : u.title }))), l = R(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await ft(qo, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((p) => p.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(G, null, [
      I(Nn, {
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      l.value ? (c(), h("p", uc, b(l.value.brief), 1)) : A("", !0),
      o.value ? (c(), h("p", dc, b(o.value), 1)) : A("", !0)
    ], 64));
  }
}, hc = /* @__PURE__ */ Y(fc, [["__scopeId", "data-v-8cbacb6d"]]), mc = { class: "form-field" }, pc = { class: "form-field-head" }, gc = ["for"], vc = {
  key: 0,
  class: "form-field-aside"
}, yc = {
  key: 0,
  class: "form-field-help"
}, kc = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", mc, [
      g("div", pc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, b(e.label), 9, gc),
        t.$slots.aside ? (c(), h("span", vc, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", yc, b(e.help), 1)) : A("", !0)
    ]));
  }
}, bc = /* @__PURE__ */ Y(kc, [["__scopeId", "data-v-dd7cdcff"]]), _a = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, wc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Rn(), n = R(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ye((c(), h("textarea", Ke({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [H(_a), H(t).value]
    ]);
  }
}), xc = /* @__PURE__ */ Y(wc, [["__scopeId", "data-v-e130a5b9"]]), $c = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Va(), o = R(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, l) => (c(), V(bc, {
      label: e.field.label,
      for: H(s),
      "data-button-field": e.field.name
    }, {
      default: N(() => [
        I(Bt, { value: o.value }, {
          choice: N(() => [
            I(Nn, {
              id: H(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: l[0] || (l[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: N(() => [
            I(hc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: l[1] || (l[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: N(() => [
            I(xc, {
              id: H(s),
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
}, Ja = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), V(ue, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: N(() => [
        I(me, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function Mc(e, t, n, a = () => window) {
  Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ae(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Sc = (e, t = () => !0) => Mc("keydown", (n) => n.key === "Escape" && t() && e());
function Fo(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = T(!1), s = R(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Sc(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const _c = 80, $t = Ga([]);
function Wo(e) {
  const t = Symbol("layer"), n = () => $t.includes(t) && $t.splice($t.indexOf(t), 1);
  return he(
    e,
    (a) => {
      a && !$t.includes(t) && $t.push(t), a || n();
    },
    { immediate: !0 }
  ), Ae(n), R(() => _c + Math.max(0, $t.indexOf(t)));
}
let Ho = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Ho = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Ec = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Cc(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Ec)];
    if (!r.length) return o.preventDefault();
    const [l, i] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === l ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), l.focus({ preventScroll: !0 }));
  }
  Te(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Ho, document.addEventListener("keydown", s), st(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Ac = ["aria-modal", "aria-label", "aria-labelledby"], Oc = {
  key: 0,
  class: "dialog-head"
}, Tc = ["id", "tabindex"], Bc = {
  key: 1,
  class: "dialog-foot"
}, Ic = 500, Rc = 400, Lc = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = Fo(a, n), l = Wo(s), i = T(null), u = T(null), d = T(null), f = Va(), p = T(!1), y = Date.now();
    n.modal && Cc(u, () => a("escape"), d);
    function w() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Rc);
    }
    function S(U) {
      !n.modal || Date.now() - y >= Ic || ![" ", "Enter"].includes(U.key) || (U.preventDefault(), U.stopPropagation());
    }
    const $ = () => i.value && (i.value.scrollTop = i.value.scrollHeight), B = new MutationObserver($);
    return he(i, (U) => {
      B.disconnect(), U && n.follow && (B.observe(U, { childList: !0, subtree: !0, characterData: !0 }), $());
    }), Ae(() => B.disconnect()), (U, ee) => (c(), V(za, { to: "body" }, [
      I(Ot, {
        name: "dialog",
        appear: "",
        onAfterLeave: H(r)
      }, {
        default: N(() => [
          H(s) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: H(l) }),
            onClick: ke(w, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? H(f) : void 0,
              onKeydownCapture: S
            }, [
              e.bare ? A("", !0) : (c(), h("header", Oc, [
                g("h3", {
                  id: H(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, b(e.title), 9, Tc),
                e.closable ? (c(), V(Ja, {
                  key: 0,
                  onClick: H(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ce(U.$slots, "default", {}, void 0, !0)
              ], 2),
              U.$slots.foot ? (c(), h("footer", Bc, [
                ce(U.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, Ac)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Uo = /* @__PURE__ */ Y(Lc, [["__scopeId", "data-v-6d1ecd98"]]), Nc = (e, t, n = {}) => jo(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Xt(e, t, n, a = {}) {
  try {
    return await Ji(e.module, n) ? ft(qo, Nc(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const Dc = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Gn = [
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
}), Dn = {
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
    filters: Gn
  }),
  tasks: pe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Gn
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
  pins: pe("Pin", "band", "One line pinned to the chat while it matters", { filters: Gn }),
  reactions: pe("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: pe("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: pe("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: pe("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: pe("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: pe("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: pe("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: pe("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: pe("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  subagents: pe("Subagent", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
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
}, Pc = ["secrets", "plugins"], zo = Object.keys(Dn).filter((e) => !(_o && Pc.includes(e)));
R(() => zo.map((e) => ({ name: e, ...Dn[e] })));
const It = (e) => Dn[e], Vo = new Map(zo.flatMap((e) => [e, e.replace(/s$/, ""), Dn[e].title.toLowerCase()].map((t) => [t, e]))), Ve = (e) => Vo.get(String(e).toLowerCase()) || "", Go = [...Vo.keys()].sort((e, t) => t.length - e.length).join("|"), jc = {
  class: "button-form",
  "data-button-form": ""
}, qc = {
  key: 0,
  class: "button-form-title"
}, Fc = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Wc = { class: "button-form-actions" }, Hc = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = T(!1), r = T(""), l = R(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = R(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = It(Ve(n.row.kind))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !l.value) return;
      o.value = !0;
      const d = await Xt(n.button, n.row, n.environment, s.value);
      o.value = !1, r.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), V(Uo, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (p) => a("close"))
    }, {
      default: N(() => {
        var p;
        return [
          g("div", jc, [
            (p = e.row) != null && p.title ? (c(), h("p", qc, b(e.row.title), 1)) : A("", !0),
            (c(!0), h(G, null, te(e.button.fields, (y) => (c(), V($c, {
              key: y.name,
              field: y,
              value: s.value[y.name],
              environment: e.environment,
              onPick: (w) => s.value[y.name] = w
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            r.value ? (c(), h("p", Fc, b(r.value), 1)) : A("", !0),
            g("div", Wc, [
              I(ue, {
                small: "",
                onClick: f[0] || (f[0] = (y) => a("close"))
              }, {
                default: N(() => [...f[2] || (f[2] = [
                  ne("Cancel", -1)
                ])]),
                _: 1
              }),
              I(ue, {
                kind: "primary",
                small: "",
                disabled: !l.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: N(() => [...f[3] || (f[3] = [
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
}, Uc = /* @__PURE__ */ Y(Hc, [["__scopeId", "data-v-879955be"]]), zc = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Vc = {
  key: 1,
  class: "menu-item-text"
}, Gc = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", zc, b(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), h("span", Vc, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, b(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ht = /* @__PURE__ */ Y(Gc, [["__scopeId", "data-v-fec99974"]]), Kc = ["aria-busy"], Yc = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Zc = {
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
    const n = e, a = t, s = R(() => Ya(n.environment)), o = R(
      () => {
        var w;
        return !n.readOnly && ((w = s.value) == null ? void 0 : w.loading.value) && (!s.value.loaded.value || s.value.failed.value);
      }
    ), r = R(() => {
      var w;
      return !n.readOnly && ((w = s.value) == null ? void 0 : w.failed.value);
    }), l = () => s.value.load().catch(() => {
    }), i = R(() => n.readOnly ? [] : Zi(n.environment, n.name, n.row)), u = T(null), d = T(""), f = T(!1), p = (w) => [w.from ? `From ${w.from}` : "", w.tip].filter(Boolean).join(" · ");
    async function y(w) {
      if (f.value || n.readOnly) return;
      if (w.fields.length) {
        u.value = w;
        return;
      }
      d.value = "", a("failure", ""), f.value = !0;
      const S = await Xt(w, n.row, n.environment);
      f.value = !1, d.value = S.ok ? "" : S.error;
      const $ = w.label.toLowerCase() + (n.objectName && !w.label.includes(" ") ? ` the ${n.objectName}` : "");
      a("failure", S.ok ? "" : `Could not ${$}: ${S.error}`), S.ok && a("done");
    }
    return (w, S) => (c(), h("span", {
      class: Z(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && r.value ? (c(), h(G, { key: 0 }, [
        S[3] || (S[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        I(ue, {
          small: "",
          onClick: l
        }, {
          default: N(() => [...S[2] || (S[2] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? A("", !0) : (c(), h(G, { key: 1 }, [
        (c(!0), h(G, null, te(i.value, ($) => (c(), h(G, {
          key: $.name
        }, [
          $.menu.length ? (c(), V(hi, {
            key: 0,
            small: "",
            kind: $.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": $.menu_label || "More ways",
            title: p($),
            "data-button": $.name,
            onMain: (B) => y($)
          }, {
            menu: N(({ close: B }) => [
              (c(!0), h(G, null, te($.menu, (U) => (c(), V(ht, {
                key: U.label,
                description: U.description,
                onClick: (ee) => (B(), y({ ...$, ...U, menu: [] }))
              }, {
                default: N(() => [
                  ne(b(U.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: N(() => [
              ne(b($.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["kind", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), V(ue, {
            key: 1,
            small: "",
            kind: $.primary ? "primary" : "ghost",
            bordered: !$.primary,
            icon: $.icon,
            disabled: f.value,
            title: p($),
            "data-button": $.name,
            onClick: (B) => y($)
          }, {
            default: N(() => [
              ne(b($.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly && !e.externalFailure ? (c(), h("span", Yc, b(d.value), 1)) : A("", !0),
        u.value && !e.readOnly ? (c(), V(Uc, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: S[0] || (S[0] = ($) => u.value = null),
          onDone: S[1] || (S[1] = ($) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : A("", !0)
      ], 64))
    ], 10, Kc));
  }
}, Jc = /* @__PURE__ */ Y(Zc, [["__scopeId", "data-v-b213b7b7"]]), Xc = {
  class: "running",
  "data-running-command": ""
}, Qc = ["title"], eu = {
  key: "idle",
  class: "running-idle"
}, tu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Xc, [
      I(Ot, {
        name: "roll",
        mode: "out-in"
      }, {
        default: N(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, b(e.text), 9, Qc)) : (c(), h("span", eu, b(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, H2 = /* @__PURE__ */ Y(tu, [["__scopeId", "data-v-d3240219"]]), nu = ["aria-checked", "aria-label", "title"], au = {
  key: 0,
  class: "switch-inner"
}, su = {
  key: 0,
  class: "switch-word"
}, ou = {
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
      g("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", au, b(e.word), 1)) : A("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", su, b(e.word), 1)) : A("", !0)
    ], 10, nu));
  }
}, U2 = /* @__PURE__ */ Y(ou, [["__scopeId", "data-v-1bfb90f3"]]);
function Ko(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function $n(e, t) {
  return Ko(() => localStorage, e, t);
}
function Yo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Xa(e, t) {
  return Yo(() => localStorage, e, t);
}
function Zo(e, t) {
  he(t, (n) => Xa(e, n), { deep: !0 });
}
function ru(e, t) {
  return Ko(() => sessionStorage, e, t);
}
function lu(e, t) {
  return Yo(() => sessionStorage, e, t);
}
const Mn = "journal.environment", Jo = T(ru(Mn, $n(Mn, "")));
function iu(e) {
  Jo.value = e, lu(Mn, e), Xa(Mn, e);
}
const Sn = T(location.hash), $s = Ue(null), Ms = { integrations: "mcp", library: "team" };
function cu() {
  if (!$s.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if (Ms[n]) {
    location.replace(`#/${[Ms[n], ...a].join("/")}${t ? `?${t}` : ""}`), Sn.value = location.hash;
    return;
  }
  !n || $s.value(n) || (iu(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), Sn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Sn.value = location.hash, cu();
});
const Ea = R(() => {
  const [e, t = ""] = Sn.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [l, i = ""] = r.split("@"), [u = "", d = "", f = ""] = l.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Jo.value,
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
}), Qa = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Qa.page(e)}?open=${t}`
};
function uu(e = "", t = 0, n = "") {
  location.hash = Qa.page(e, t, n);
}
const du = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Xo(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([r]) => r !== "open" && r !== "sub").map(([r, l]) => `${r}=${encodeURIComponent(l)}`), ...e.length ? [`open=${e.map(du).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const St = {};
function z2(e, t) {
  return St[e] = t, () => St[e] === t && delete St[e];
}
function Qo(e, t, n = 0, a = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((r = St[e]) != null && r.call(St, t))) return;
  const s = Ea.value.stack, o = s.findIndex((l) => l.table === e && l.id === t);
  Xo([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function fu(e, t, n, a = 0, s = "") {
  if (e === Ea.value.env) return Qo(t, n, a, s);
  const o = Ea.value.stack, r = o.findIndex((l) => l.table === t && l.id === n && l.env === e);
  Xo([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? fu(a, s, Number(o), 0, t) : Qo(s, Number(o), 0, t);
}
function hu(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Mt(e) {
  const t = hu(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function V2(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const mu = {
  key: 1,
  class: "row-list-failure"
}, pu = ["data-row"], gu = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = T(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), V(gt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", mu, b(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), V(xn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: N(() => [
        ne(b(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), V(pt(e.arrival ? bo : "ul"), Ke(n.value, { class: "row-list" }), {
        default: N(() => [
          (c(!0), h(G, null, te(e.rows, (l) => (c(), h("li", {
            key: l.id,
            class: "row-list-row",
            "data-row": l.id
          }, [
            ce(o.$slots, "default", { row: l }, void 0, !0)
          ], 8, pu))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !a.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (l) => s(e.older))
      }, "Show more")) : A("", !0)
    ], 64));
  }
}, vu = /* @__PURE__ */ Y(gu, [["__scopeId", "data-v-aa6ad7ff"]]), yu = {
  class: "agent-rows",
  "data-agent-rows": ""
}, ku = {
  key: 1,
  class: "agent-rows-note"
}, bu = {
  key: 2,
  class: "agent-rows-note"
}, wu = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, xu = ["data-agent-row", "onClick"], $u = { class: "agent-row-name" }, Mu = { class: "agent-row-state" }, Su = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = R(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", yu, [
      e.loaded ? e.failure ? (c(), h("p", ku, b(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        g("p", wu, b(a.value) + " running", 1),
        (c(!0), h(G, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (l) => H(Ne)(`agents:${r.id}`)
        }, [
          g("span", $u, "#" + b(r.id) + " " + b(r.session), 1),
          g("span", Mu, b(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, xu))), 128))
      ], 64)) : (c(), h("p", bu, b(e.none), 1)) : (c(), V(gt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, G2 = /* @__PURE__ */ Y(Su, [["__scopeId", "data-v-a01e5a17"]]), _u = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, b(e.text), 3));
  }
}, er = /* @__PURE__ */ Y(_u, [["__scopeId", "data-v-9e7e1157"]]), Eu = ["aria-valuenow", "aria-valuemax"], Cu = {
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
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, Eu));
  }
}, Au = /* @__PURE__ */ Y(Cu, [["__scopeId", "data-v-9eba6a85"]]), Ou = { class: "bars" }, Tu = { class: "bar-name" }, Bu = { class: "bar-value" }, Iu = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, l) => (c(), h("div", Ou, [
      (c(!0), h(G, null, te(e.items, (i, u) => (c(), V(pt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: Z(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: N(() => [
          g("span", Tu, b(i.label), 1),
          I(Au, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Bu, b(i.value) + b(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Ru = /* @__PURE__ */ Y(Iu, [["__scopeId", "data-v-663427f4"]]), Lu = { class: "bars" }, Nu = {
  key: 0,
  class: "bars-title"
}, Du = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Lu, [
      e.node.title ? (c(), h("span", Nu, b(e.node.title), 1)) : A("", !0),
      I(Ru, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Pu = /* @__PURE__ */ Y(Du, [["__scopeId", "data-v-7135bb11"]]), ju = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = R(() => n[a.node.type](a.node));
    return (r, l) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(G, null, te(e.node.children || [], (i, u) => (c(), V(pr, {
        key: u,
        node: i,
        onOpen: l[0] || (l[0] = (d) => s("open", d)),
        onFile: l[1] || (l[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, gn = /* @__PURE__ */ Y(ju, [["__scopeId", "data-v-d142a3f4"]]), qu = {
  key: 0,
  class: "card-head"
}, Fu = { class: "card-title" }, Wu = {
  key: 0,
  class: "card-note"
}, Hu = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", qu, [
        g("span", Fu, b(e.node.title), 1),
        e.node.note ? (c(), h("span", Wu, b(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      I(gn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Uu = /* @__PURE__ */ Y(Hu, [["__scopeId", "data-v-67b72d40"]]), zu = { processes: "process", memories: "memory", replies: "reply" }, jt = (e) => (zu[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ca = [], Vu = 2e3, Xe = /* @__PURE__ */ new Map(), Gu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Ku = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function yt(e, { first: t = !1 } = {}) {
  t ? Ca.unshift(e) : Ca.push(e), Xe.clear();
}
function tr(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Yu = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Zu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Ge(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Ju(e, t) {
  const n = [{ kind: "text", text: Ge(e).replace(/\r\n/g, `
`) }];
  for (const a of Ca)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.kind !== "text") continue;
      const r = a(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(s, 1, ...r);
    }
  return n;
}
function zt(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Xu(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Xu(e) {
  return e.split(Ku).map((t, n) => n % 2 ? t : t.replace(Gu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ss(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Qu = 24;
function ed(e) {
  const [t, , ...n] = e, a = Ss(t), s = n.map(Ss), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Qu) ? ' class="text-column"' : "", r = a.map((i, u) => `<th${o(u)}>${zt(i)}</th>`).join(""), l = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${zt(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${r}</tr></thead><tbody>${l}</tbody></table>`;
}
const nr = /^\s*(?:[-*+]|\d+[.)])\s+/, Aa = /^\s*(\d+)[.)]\s/, _s = (e) => e.match(/^\s*/)[0].length;
function ar(e) {
  const t = e[0].match(Aa), n = _s(e[0]), a = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), l = a[a.length - 1];
    r && _s(o) <= n ? a.push({ text: r[2], nested: [] }) : l && o.trim() && (r || l.nested.length) ? l.nested.push(o) : l && o.trim() && (l.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${zt(o.text)}${o.nested.length ? ar(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function td(e, t) {
  const n = Aa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (nr.test(e[s]) && Aa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const Es = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function sr(e) {
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
      n.push(`<h${l}>${zt(o[2])}</h${l}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (Es(t, a)) {
      let l = a + 2;
      for (; l < t.length && t[l].includes("|"); ) l += 1;
      n.push(ed(t.slice(a, l))), a = l;
      continue;
    }
    if (nr.test(s)) {
      const l = td(t, a);
      n.push(ar(t.slice(a, l))), a = l;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let l = a;
      for (; l < t.length && /^(?:>|&gt;)\s?/.test(t[l]); ) l += 1;
      n.push(
        `<blockquote>${sr(
          t.slice(a, l).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = l;
      continue;
    }
    let r = a;
    for (; r < t.length && t[r].trim() && !Es(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${zt(t.slice(a, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = r;
  }
  return n.join("");
}
const nd = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ad = (e) => e.kind !== "text" && !nd.test(e.html);
function sd(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(sr(a).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), a = "";
  };
  for (const o of e)
    o.kind === "text" ? a += o.text : ad(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function od(e, t = { env: "" }) {
  const n = Zu(e, t), a = Xe.get(n);
  if (Xe.delete(n), a && a.source === t.source && a.reads.every((r) => Yu(r, t)))
    return Xe.set(n, a), a.html;
  const s = [], o = sd(Ju(e, { ...t, reads: s }));
  return Xe.set(n, { html: o, reads: s, source: t.source }), Xe.size > Vu && Xe.delete(Xe.keys().next().value), o;
}
const Kn = /* @__PURE__ */ new WeakMap();
function rd(e) {
  if (Kn.has(e)) return Kn.get(e);
  const t = Sl(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), p = e.read(`${jt(u)} show ${d}`);
    n.set(f, p), p.then((y) => {
      n.get(f) === p && (n.delete(f), t.set(f, y.ok ? { ...y.value, table: u } : null));
    });
  }
  function r(u) {
    a.has(u) || (a.add(u), e.follow([`${jt(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(f)) continue;
        const y = Number(p.slice(f.length));
        (!d.row_id || d.row_id === y) && o(u, y);
      }
    }));
  }
  function l(u, d) {
    r(u);
    const f = s(u, d);
    return !t.has(f) && !n.has(f) && o(u, d), t.get(f);
  }
  const i = { id: Symbol("window text rows"), row: l };
  return Kn.set(e, i), i;
}
function or() {
  const e = $e(Se, null), t = e ? rd(e) : null;
  return (n, a = {}) => od(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const rr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Qt = (e) => String(e || "").replace(rr, (t, n, a, s) => s), ld = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), cn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, id = /^Traceback \(most recent call last\):/m, cd = 8;
function lr(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, cd).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function ud(e) {
  const t = [...e.matchAll(ld)].map((a) => a.index);
  if (cn.lastIndex = 0, !t.length || !cn.test(e)) return null;
  cn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), r = [...o.matchAll(cn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((l) => l[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: lr(n), tail: "" } : null;
}
function dd(e) {
  const t = id.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: lr([o]), tail: n.slice(s).join(`
`) };
}
yt((e) => {
  const t = Qt(e), n = dd(t) || ud(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const fd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, hd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, md = /[\w\]]\(/, pd = /^[\w$.[\]'"]+\s*=\s*[^=]/, gd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, vd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, yd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, kd = /[[({,]$/, bd = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, wd = /^(\t|\s{2,})\S/, xd = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, $d = /`[^`]+`/, Md = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Sd = /[{}()[\];=<>$&|*\\@+^~%]/g, ir = /^\s*(?:[-*+]|\d+[.)])\s/, _d = /^\s*>/, Ed = /^\s*\|/, Cd = 0.6, Ad = 0.4, Od = 5, Td = 0.03, cr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Od && t.every((n) => Md.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Sd) ?? []).length / e.length < Td;
}, Yn = (e) => {
  const t = e.trim();
  return $d.test(t) ? !1 : [fd, hd, md, pd, gd, vd, yd, kd, bd].some((n) => n.test(t)) || /[;{}]$/.test(t) || wd.test(e) && !ir.test(e) && !cr(e);
};
function Bd(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || ir.test(t[0]) || t.every((o) => _d.test(o) || Ed.test(o))) return "text";
  const n = t.filter((o) => !xd.test(o.trim()));
  if (t.length === 1) return !n.length || Yn(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Yn).length, s = n.filter((o) => !Yn(o) && cr(o)).length;
  return a >= n.length * Cd && s <= n.length * Ad ? "code" : "text";
}
const Oa = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Id = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Rd = `${Oa} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ld = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Nd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Cs = {
  js: { keywords: Oa, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Id, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Rd, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Oa, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ld, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Nd, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Dd = {
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
function As(e, t, n) {
  return n && e.startsWith(n, t);
}
function Pd(e, t) {
  const n = Cs[Dd[t] ?? t] || Cs.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
  let o = 0;
  const r = (l, i) => i && s.push({ kind: l, value: i });
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
    if (As(e, o, n.line) || n.hash && l === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && As(e, o, n.block[0])) {
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
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, p = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(a.has(f) ? "keyword" : p ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function jd(e, t) {
  const n = [""];
  for (const { kind: a, value: s } of Pd(e, t))
    s.split(`
`).forEach((r, l) => {
      l && n.push(""), r && (n[n.length - 1] += a === "plain" ? Ge(r) : `<span class="tok-${a}">${Ge(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function qd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Fd = 1500, Os = /* @__PURE__ */ new WeakMap();
async function Wd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await qd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Os.get(t)), Os.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Fd)
  )));
}
typeof document < "u" && document.addEventListener("click", Wd, !0);
const Hd = /\n\s*\n/, Ud = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, zd = /^\s*(`{3,}|~{3,})\s*$/, Vd = /^\s{4,}\S/, Gd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ta = /^\s*(?:[-*+]|\d+[.)])\s/, ur = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Kd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function es(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Yd(e) {
  const t = es(e.join(`
`));
  return (Kd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Zd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && ur.test(t) && !Ta.test(t);
}, Jd = (e, t) => Ta.test(t) || Ta.test([...e].reverse().find((n) => n.trim()) || "");
function ts(e, t) {
  const n = t || Yd(e), a = jd(es(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Xd(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && zd.test(s));
  return a < 0 ? e.length : a;
}
function Qd(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return ts(a.map(Qt), n ? n.toLowerCase() : "");
}
function ef(e) {
  const t = e.split(Hd).map((r) => ({ paragraph: r, kind: Bd(es(r).split(`
`)) })), n = [];
  let a = [];
  const s = () => {
    a.length && n.push({ kind: "text", text: a.join(`

`) }), a = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let r = o;
    for (; r < t.length && t[r].kind !== "text"; ) r += 1;
    const l = t.slice(o, r);
    if (l.some(({ kind: i }) => i === "code") || l.length > 1) {
      s(), n.push(ts(l.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(Qt), "")), o = r;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function tf(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ kind: "text", text: s.join(`
`) }] : ef(s.join(`
`))), s = [];
  };
  let r = 0;
  for (; r < n.length; ) {
    const l = n[r].match(Ud);
    if (l) {
      const u = Xd(n, r, l[2]);
      o(), a.push(Qd(n.slice(r + 1, u), l[1], l[3])), r = u + 1;
      continue;
    }
    const i = Zd(s) ? Gd : Vd;
    if (!t && i.test(n[r]) && !Jd(s, n[r])) {
      let u = r;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && ur.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - r + d.length >= 2) {
        o(), a.push(ts([...d, ...n.slice(r, u)].map(Qt), "")), r = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[r]), r += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].kind === "html" ? a : null;
}
yt((e, t) => tf(e, t.document));
const _n = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, dr = (e) => `${e.table}:${e.id}`, Ts = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Zn = 80;
function Bs(e) {
  return e.length <= Zn ? e : `${e.slice(0, Zn + 1).replace(/\s+\S*$/, "") || e.slice(0, Zn)}…`;
}
const Is = {
  messages: (e) => Bs(Ts(e.text)),
  comments: (e) => Bs(Ts(e.text)),
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
}, nf = (e) => (Is[e.table] ? Is[e.table](e) : e.title || "") || "", mt = (e) => _n(e.created_at), fr = (e) => _n(e.updated_at) || mt(e), af = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, sf = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function of(e) {
  const t = af.exec(e);
  if (t && Ve(t[1])) return { at: t.index, length: t[0].length, table: Ve(t[1]), id: Number(t[2]), label: t[3] };
  const n = sf.exec(e), a = n && Ve(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function rf(e, t, n, a) {
  const s = tr(a, e, t), o = Qt(s ? nf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ge(It(e).title)} ${t}</span><span class="row-card-title">${Ge(o)}</span></a>`;
}
yt(
  (e, t) => {
    const n = of(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: rf(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const lf = /\.(png|jpe?g|gif|webp|svg)$/i, cf = (e) => lf.test(e), uf = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, df = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function ff(e, t) {
  const n = uf.exec(e), [, a, s, o, r, l] = n || [], i = n && Ve(a || o), u = i && tr(t, i, Number(s || r));
  if (i !== "messages" || !u || !(u.files || []).includes(l)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(l)}`, f = `${It(i).title} ${u.id} · ${Ge(l)}`, p = cf(l) ? `<img class="file-card-image" src="${d}" alt="${Ge(l)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ge(l)}">${p}<span class="file-card-name">${f}</span></a>` };
}
function hf(e) {
  const t = df.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ge(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
yt(
  (e, t) => {
    if (t.inline) return null;
    const n = ff(e, t) || hf(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const mf = /`([^`\n]+)`/g;
yt((e) => e.replace(mf, (t, n) => `<code>${n}</code>`));
const Rs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Qa.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
yt(
  (e, t) => e.replace(rr, (n, a, s, o) => Rs[a] ? Rs[a](s, o, t) : o)
);
const pf = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, hr = new RegExp(`\\b(${Go}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), mr = new RegExp(`\\b(${Go}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), gf = new RegExp(`<code>((?:${hr.source}|${mr.source}))</code>`, "gi"), vf = (e) => e.replace(gf, "$1"), yf = (e, t) => `<a class="row-pill" href="#" data-peek="${Ve(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, kf = (e) => e.replace(mr, (t, n, a) => a.replace(/\d+/g, (s) => yf(n.replace(/s$/i, ""), s))), bf = (e) => kf(e).replace(
  hr,
  (t, n, a, s = "", o) => {
    const r = a || o;
    return `<a class="row-pill" href="#" data-peek="${Ve(n)}:${r}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${r}${s ? `:${s}` : ""}</span></a>`;
  }
);
yt(
  (e, t) => t.rowNames === !1 ? e : vf(e).split(pf).map((n, a) => a % 2 ? n : bf(n)).join("")
);
const wf = ["innerHTML"], xf = ["innerHTML"], $f = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = or(), a = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((r) => r.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...r) => H(Mt) && H(Mt)(...r)),
      innerHTML: a.value
    }, null, 8, wf)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...r) => H(Mt) && H(Mt)(...r)),
      innerHTML: a.value
    }, null, 8, xf));
  }
}, et = /* @__PURE__ */ Y($f, [["__scopeId", "data-v-d8e75741"]]), Mf = { class: "fact" }, Sf = { class: "fact-label" }, _f = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Mf, [
      g("span", Sf, b(e.label), 1),
      I(et, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Ef = /* @__PURE__ */ Y(_f, [["__scopeId", "data-v-3a88ecf8"]]), Cf = { class: "list" }, Af = { class: "list-label" }, Of = {
  key: 1,
  class: "list-note"
}, Tf = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Cf, [
      (c(!0), h(G, null, te(e.items, (o, r) => (c(), V(pt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (l) => o.open && n("open", o.open)
      }, {
        default: N(() => [
          g("span", Af, b(o.label), 1),
          o.badge ? (c(), V(er, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), h("span", Of, b(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Bf = /* @__PURE__ */ Y(Tf, [["__scopeId", "data-v-ebe2ae0a"]]), If = { class: "table" }, Rf = {
  key: 0,
  class: "table-row empty"
}, Lf = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", If, [
      g("div", {
        class: "table-row head",
        style: fe(s.value)
      }, [
        (c(!0), h(G, null, te(e.columns, (l) => (c(), h("span", {
          key: l,
          class: "cell"
        }, b(l), 1))), 128))
      ], 4),
      (c(!0), h(G, null, te(e.rows, (l, i) => (c(), V(pt(l.open ? "button" : "div"), {
        key: i,
        type: l.open ? "button" : void 0,
        class: Z(["table-row", l.tone, { opens: l.open }]),
        style: fe(s.value),
        onClick: (u) => l.open && a("open", l.open)
      }, {
        default: N(() => [
          (c(!0), h(G, null, te(l.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, b(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Rf, b(e.empty), 1)) : A("", !0)
    ]));
  }
}, Nf = /* @__PURE__ */ Y(Lf, [["__scopeId", "data-v-9326a52e"]]), Df = { class: "stat-value" }, Pf = { class: "stat-label" }, jf = {
  key: 0,
  class: "stat-note"
}, qf = {
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
    return (a, s) => (c(), V(pt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: N(() => [
        g("span", Df, b(e.value), 1),
        g("span", Pf, b(e.label), 1),
        e.note ? (c(), h("span", jf, b(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Ff = /* @__PURE__ */ Y(qf, [["__scopeId", "data-v-ad0db6d6"]]), Wf = { class: "code" }, Hf = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, r) => (c(), V(Bt, {
      value: e.node.type
    }, {
      stack: N(() => [
        I(gn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: N(() => [
        I(gn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: N(() => [
        I(gn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: N(() => [
        I(Uu, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: N(() => [
        g("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, b(e.node.text), 3)
      ]),
      divider: N(() => [...r[2] || (r[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: N(() => [
        I(Ff, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (l) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: N(() => [
        I(Pu, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: N(() => [
        I(Nf, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: N(() => [
        I(Bf, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: N(() => [
        I(et, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: N(() => [
        I(Ef, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: N(() => [
        I(er, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: N(() => [
        g("pre", Wf, [
          g("code", null, b(e.node.text), 1)
        ])
      ]),
      file: N(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (l) => s(e.node))
        }, b(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), pr = /* @__PURE__ */ Y(Hf, [["__scopeId", "data-v-cbdcf540"]]), Uf = { class: "dashboard" }, zf = { class: "trail" }, Vf = ["onClick"], Gf = {
  key: 0,
  class: "gone",
  role: "status"
}, Kf = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = T(!!n.page && !s(n.page)), r = T(n.page && !o.value ? [n.page] : []), l = R(() => r.value.at(-1) || n.document.start), i = R(() => (n.document.pages || {})[l.value] || null), u = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, r.value = [...r.value, p];
    }, f = (p) => {
      o.value = !1, r.value = r.value.slice(0, p);
    };
    return he(
      () => n.document.start,
      () => r.value = []
    ), (p, y) => (c(), h("div", Uf, [
      e.document.broken ? (c(), V(xn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: N(() => [
          ne(b(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), V(xn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: N(() => [
          ne(b(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(G, { key: 2 }, [
        g("nav", zf, [
          g("button", {
            type: "button",
            class: Z(["step", { current: !r.value.length }]),
            onClick: y[0] || (y[0] = (w) => f(0))
          }, b(u(e.document.start)), 3),
          (c(!0), h(G, null, te(r.value, (w, S) => (c(), h(G, {
            key: `${S}-${w}`
          }, [
            y[2] || (y[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: Z(["step", { current: S === r.value.length - 1 }]),
              onClick: ($) => f(S + 1)
            }, b(u(w)), 11, Vf)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Gf, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        I(Ot, {
          name: "page",
          mode: "out-in"
        }, {
          default: N(() => [
            (c(), h("div", {
              key: l.value,
              class: "page"
            }, [
              I(pr, {
                node: i.value.view,
                onOpen: d,
                onFile: y[1] || (y[1] = (w) => a("file", w))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, K2 = /* @__PURE__ */ Y(Kf, [["__scopeId", "data-v-fbe83734"]]), Je = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Re = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Yf = 6;
function ns(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Zf = (e) => {
  const t = ns(e, Je.lineChars), n = Math.max(Je.minWidth, Math.max(...t.map((a) => a.length)) * Je.charWidth + Je.padX * 2);
  return { name: e, lines: t, line: Je.line, padY: Je.padY, width: n, height: t.length * Je.line + Je.padY * 2 };
};
function Jf(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (r) => {
    s.set(r, "open"), t.forEach((l, i) => {
      if (l[0] !== r) return;
      const u = s.get(l[1]);
      u === "open" ? a.add(i) : u || o(l[1]);
    }), s.set(r, "done");
  };
  return [...n, ...e].forEach((r) => s.has(r) || o(r)), a;
}
function Xf(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Qf(e, t, n) {
  const a = [];
  e.forEach((r) => {
    var l;
    return (a[l = n.get(r)] || (a[l] = [])).push(r);
  });
  const s = () => new Map(a.flatMap((r) => r.map((l, i) => [l, i]))), o = (r, l) => {
    const i = s(), u = (d) => {
      const f = l(d).map((p) => i.get(p));
      return f.length ? f.reduce((p, y) => p + y, 0) / f.length : i.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < Yf; r++) {
    const l = r % 2 === 0, i = a.map((u, d) => d);
    (l ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((p) => p[l ? 1 : 0] === f).map((p) => p[l ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function eh(e, t) {
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
function th(e) {
  const t = [...new Set(e.flatMap(([P, x]) => [P, x]))], n = new Set(e.map(([, P]) => P)), a = t.filter((P) => !n.has(P)), s = Jf(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((P, x) => !s.has(x)), r = Xf(t, o), l = Qf(t, o, r), i = new Map(t.map((P) => [P, Zf(P)])), u = l.map((P) => P.reduce((x, C) => x + i.get(C).width, 0) + Re.across * (P.length - 1)), d = Math.max(...u) + Re.margin * 2, f = ah(e, r, l.length), p = /* @__PURE__ */ new Map();
  let y = Re.margin;
  l.forEach((P, x) => {
    let C = (d - u[x]) / 2;
    const M = Math.max(...P.map((_) => i.get(_).height));
    P.forEach((_) => {
      const v = i.get(_);
      p.set(_, { ...v, x: C, y: y + (M - v.height) / 2 }), C += v.width + Re.across;
    }), y += M + (f[x] ?? Re.down);
  });
  const w = e.map(([P, x, C], M) => ({ from: P, to: x, label: C || "", back: s.has(M) || r.get(x) <= r.get(P) }));
  eh(w, p);
  const S = w.map((P) => sh(P, p.get(P.from), p.get(P.to))), $ = [...p.values()], B = ih(S, $), U = Math.max(y - Re.down, ...B.filter((P) => P.label).map((P) => P.label.y + P.label.height));
  return { width: Math.max(d - Re.margin, ...B.filter((P) => P.label).map((P) => P.label.x + P.label.width)) + Re.margin, height: U + Re.margin, nodes: $, arrows: B };
}
const nh = (e) => e ? ns(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function ah(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Re.labelSpace);
  return e.forEach(([s, o, r]) => {
    const [l, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > l && (a[l + Math.floor((i - l - 1) / 2)] += nh(r) + Re.labelSpace);
  }), a.map((s) => Math.max(Re.down, s));
}
function sh(e, t, n) {
  const a = e.label ? ns(e.label, Le.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Le.charWidth + Le.pad * 2 : 0, o = a.length * Le.line + (a.length ? Le.pad * 2 : 0), r = t.x + t.width * e.fromShare, l = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - l) / 2, f = [{ x: r, y: l }, { x: r, y: l + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${r} ${l} C${r} ${l + d} ${i} ${u - d} ${i} ${u}` };
}
const oh = ([e, t, n, a], s) => {
  const o = 1 - s, r = (l) => o * o * o * e[l] + 3 * o * o * s * t[l] + 3 * o * s * s * n[l] + s * s * s * a[l];
  return { x: r("x"), y: r("y") };
}, rh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], lh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function ih(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: r }) => ({ x: a, y: s, width: o, height: r }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = oh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, l = lh.flatMap((i) => rh.map((u) => s(u, i))).find((i) => !n.some((u) => Ls(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => Ls(l, i)); ) l.y += Le.line;
    return n.push(l), { ...a, label: { ...l, lines: a.lines, line: Le.line, pad: Le.pad } };
  });
}
const Ls = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ch = { class: "flowchart-tools" }, uh = ["width", "height", "viewBox", "aria-label"], dh = ["d"], fh = ["x", "y", "width", "height"], hh = ["x", "y"], mh = ["x", "dy"], ph = {
  key: 0,
  class: "flowchart-label"
}, gh = ["x", "y", "width", "height"], vh = ["x", "y"], yh = ["x", "dy"], kh = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => th(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = T(null), l = T({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var B;
      const S = (B = r.value) == null ? void 0 : B.getBoundingClientRect();
      if (!(S != null && S.width)) return;
      const $ = Math.min(S.width / s.value.width, S.height / s.value.height, 1.5);
      l.value = { zoom: $, x: (S.width - s.value.width * $) / 2, y: (S.height - s.value.height * $) / 2 };
    }
    function d(S, $, B) {
      const { zoom: U, x: ee, y: P } = l.value, x = Math.min(o.most, Math.max(o.least, U * S));
      l.value = { zoom: x, x: $ - ($ - ee) * x / U, y: B - (B - P) * x / U };
    }
    function f(S) {
      const $ = r.value.getBoundingClientRect();
      d(S, $.width / 2, $.height / 2);
    }
    function p(S) {
      const $ = r.value.getBoundingClientRect();
      S.ctrlKey || S.metaKey ? d(S.deltaY < 0 ? o.step : 1 / o.step, S.clientX - $.left, S.clientY - $.top) : l.value = { ...l.value, x: l.value.x - S.deltaX, y: l.value.y - S.deltaY };
    }
    function y(S) {
      var $, B, U;
      S.preventDefault(), ($ = window.getSelection()) == null || $.removeAllRanges(), i = { x: S.clientX - l.value.x, y: S.clientY - l.value.y }, (U = (B = r.value).setPointerCapture) == null || U.call(B, S.pointerId);
    }
    function w(S) {
      i && (l.value = { ...l.value, x: S.clientX - i.x, y: S.clientY - i.y });
    }
    return Te(u), (S, $) => (c(), V(Uo, {
      title: e.title,
      large: "",
      onClose: $[4] || ($[4] = (B) => a("close"))
    }, {
      default: N(() => [
        g("div", ch, [
          I(ue, {
            small: "",
            onClick: $[0] || ($[0] = (B) => f(o.step))
          }, {
            default: N(() => [...$[5] || ($[5] = [
              ne("Zoom in", -1)
            ])]),
            _: 1
          }),
          I(ue, {
            small: "",
            onClick: $[1] || ($[1] = (B) => f(1 / o.step))
          }, {
            default: N(() => [...$[6] || ($[6] = [
              ne("Zoom out", -1)
            ])]),
            _: 1
          }),
          I(ue, {
            small: "",
            onClick: u
          }, {
            default: N(() => [...$[7] || ($[7] = [
              ne("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: ke(p, ["prevent"]),
          onPointerdown: y,
          onPointermove: w,
          onPointerup: $[2] || ($[2] = (B) => ys(i) ? i.value = null : i = null),
          onPointercancel: $[3] || ($[3] = (B) => ys(i) ? i.value = null : i = null)
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
            $[8] || ($[8] = g("defs", null, [
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
            (c(!0), h(G, null, te(s.value.arrows, (B, U) => (c(), h("path", {
              key: `arrow-${U}`,
              class: "flowchart-arrow",
              d: B.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, dh))), 128)),
            (c(!0), h(G, null, te(s.value.nodes, (B) => (c(), h("g", {
              key: B.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: B.x,
                y: B.y,
                width: B.width,
                height: B.height,
                rx: "8"
              }, null, 8, fh),
              g("text", {
                x: B.x + B.width / 2,
                y: B.y + B.padY + B.line / 2
              }, [
                (c(!0), h(G, null, te(B.lines, (U, ee) => (c(), h("tspan", {
                  key: ee,
                  x: B.x + B.width / 2,
                  dy: ee ? B.line : 0
                }, b(U), 9, mh))), 128))
              ], 8, hh)
            ]))), 128)),
            (c(!0), h(G, null, te(s.value.arrows, (B, U) => (c(), h(G, {
              key: `label-${U}`
            }, [
              B.label ? (c(), h("g", ph, [
                g("rect", {
                  x: B.label.x,
                  y: B.label.y,
                  width: B.label.width,
                  height: B.label.height,
                  rx: "4"
                }, null, 8, gh),
                g("text", {
                  x: B.label.x + B.label.width / 2,
                  y: B.label.y + B.label.pad + B.label.line / 2
                }, [
                  (c(!0), h(G, null, te(B.label.lines, (ee, P) => (c(), h("tspan", {
                    key: P,
                    x: B.label.x + B.label.width / 2,
                    dy: P ? B.label.line : 0
                  }, b(ee), 9, yh))), 128))
                ], 8, vh)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, uh))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, bh = /* @__PURE__ */ Y(kh, [["__scopeId", "data-v-51d24cfe"]]), Ns = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ds = {
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
  agent: Ns,
  worker: Ns,
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
}, wh = ["innerHTML"], xh = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => Ds[t.name] || Ds.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, wh));
  }
}, at = /* @__PURE__ */ Y(xh, [["__scopeId", "data-v-beb5935c"]]), $h = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      I(at, { name: "fold" })
    ], 2));
  }
}, Ct = /* @__PURE__ */ Y($h, [["__scopeId", "data-v-d03899bb"]]), Mh = ["data-tip", "aria-label"], Sh = {
  key: 0,
  class: "mact-word"
}, _h = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      I(at, { name: "open" }),
      e.open ? (c(), h("span", Sh, b(e.label), 1)) : A("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, Mh));
  }
}, gr = /* @__PURE__ */ Y(_h, [["__scopeId", "data-v-3b292e09"]]), vr = 120, vn = 280, yr = 160, Eh = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Ch = ["leaving", "resizing", "entering"];
function Ba(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Ah(e) {
  const t = Ch.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ba(e);
  return e.classList.add(...t), n;
}
function kr(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = T(t()), s = T("");
  let o = 0;
  const r = (f, p) => Object.assign(f.style, { width: `${p.width}px`, height: `${p.height}px` }), l = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, p) {
    l(f);
    const y = Ah(f);
    r(f, p), f.offsetWidth, f.style.transition = `width ${vn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${vn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, y);
  }
  function u(f) {
    const p = f.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let y = p.offsetHeight;
    const w = new ResizeObserver(() => {
      p.offsetHeight !== y && (y = p.offsetHeight, i(f, Ba(f)));
    });
    return w.observe(p), w;
  }
  async function d(f) {
    const p = e.value, y = ++o;
    if (!p || !p.offsetWidth || Eh()) {
      a.value = f;
      return;
    }
    const w = Ba(p);
    if (r(p, w), s.value = "leaving", await n(vr), y !== o) return;
    a.value = f, s.value = "resizing", await st(), i(p, w);
    const S = u(p);
    await n(vn), S == null || S.disconnect(), y === o && (l(p), s.value = "entering", await n(yr), y === o && (s.value = ""));
  }
  return he(t, (f) => d(f)), Tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Oh = { class: "growing-card-top" }, Th = ["aria-expanded"], Bh = { class: "growing-card-avatar" }, Ih = { class: "growing-card-title" }, Rh = { class: "growing-card-more" }, Lh = { class: "growing-card-body" }, Nh = {
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
    const n = e, a = t, s = T(!1), o = T(null), { folded: r, phase: l } = kr(o, () => !s.value), i = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", H(l), { open: !H(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", Oh, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (p) => s.value = !s.value)
        }, [
          g("span", Bh, [
            e.bad ? (c(), V(at, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(G, { key: 1 }, [
              ne(b(i.value), 1)
            ], 64)) : (c(), V(me, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", Ih, b(e.title), 1),
          I(Ct, { open: s.value }, null, 8, ["open"])
        ], 8, Th),
        e.action ? (c(), V(gr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (p) => a("comment"))
        }, [
          I(me, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      g("div", Rh, [
        g("div", Lh, [
          (c(!0), h(G, null, te(u.value, (p, y) => (c(), h("p", {
            key: y,
            class: "growing-card-text"
          }, b(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Dh = /* @__PURE__ */ Y(Nh, [["__scopeId", "data-v-08411e3a"]]), Ph = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, jh = {
  key: 0,
  class: "message-links-many"
}, qh = ["aria-expanded"], Fh = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Wh = ["onClick"], Hh = { class: "row-pill message-links-chip" }, Uh = { class: "message-links-title" }, Jn = 3, Ps = "task", zh = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = R(() => t.links.length), s = R(() => t.links.every((p) => p.model === Ps) ? "tasks" : "items"), o = R(() => `Linked: ${t.links.map((p) => `${p.model} ${p.id}`).join(" ")}`), r = T(!1), l = T({}), i = T(null);
    So(i, () => r.value = !1);
    async function u() {
      const p = t.links.filter((w) => w.model === Ps && !(w.id in l.value)), y = await Promise.all(p.map((w) => n.read(`task show ${w.id}`)));
      l.value = { ...l.value, ...Object.fromEntries(y.filter((w) => w.ok).map((w) => [w.value.id, w.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(p) {
      r.value = !1, Ne(`${Ve(p.model)}:${p.id}`);
    }
    return (p, y) => (c(), h("div", {
      ref_key: "line",
      ref: i,
      class: Z(["message-links", { many: a.value > Jn, three: a.value === Jn, open: r.value }]),
      "data-message-links": ""
    }, [
      I(at, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", Ph, [
        I(et, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      a.value >= Jn ? (c(), h("span", jh, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          ne(b(a.value) + " linked " + b(s.value) + " ", 1),
          I(Ct, { open: r.value }, null, 8, ["open"])
        ], 8, qh)
      ])) : A("", !0),
      r.value ? (c(), h("div", Fh, [
        (c(!0), h(G, null, te(e.links, (w) => (c(), h("button", {
          key: `${w.model}:${w.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (S) => f(w)
        }, [
          g("span", Hh, b(w.model) + " " + b(w.id), 1),
          g("span", Uh, b(l.value[w.id]), 1)
        ], 8, Wh))), 128))
      ])) : A("", !0)
    ], 2));
  }
}, Vh = /* @__PURE__ */ Y(zh, [["__scopeId", "data-v-24868afd"]]), Gh = ["title", "aria-label"], Kh = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Yh = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Zh = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: Z(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", Kh, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", Yh)) : A("", !0)
      ]))
    ], 10, Gh));
  }
}, Jh = /* @__PURE__ */ Y(Zh, [["__scopeId", "data-v-6dc92808"]]);
function Xh(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function br(e, t = Date.now()) {
  const n = Xh(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Qh = 36e5;
function Y2(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Qh;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function wr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function js(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const a = Math.floor(n / 3600), s = Math.floor(n % 3600 / 60);
  return a < 24 ? `${a}h ${s}m` : `${Math.floor(a / 24)}d ${a % 24}h`;
}
const Xn = (e) => String(e).padStart(2, "0");
function e1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${Xn(t % 60)}s` : `${Math.floor(t / 3600)}h ${Xn(Math.floor(t % 3600 / 60))}m ${Xn(t % 60)}s`;
}
const t1 = "img,pre,table";
function n1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function a1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), a = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (a.selectNodeContents(n.currentNode), t.push(...a.getClientRects()));
  return t;
}
function s1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(t1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), a = e.offsetHeight, s = n1(a1(e), n || 0);
  s && (s >= e.offsetWidth || (e.style.width = `${s}px`, e.offsetHeight !== a && (e.style.width = "")));
}
function o1(e, t) {
  let n = null;
  const a = () => e.value && s1(e.value);
  Te(() => {
    var o, r;
    if (a(), (o = document.fonts) == null || o.ready.then(a), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let s = 0;
    n = new ResizeObserver(([l]) => {
      l.contentRect.width !== s && (s = l.contentRect.width, a());
    }), n.observe(e.value.parentElement);
  }), Ae(() => n == null ? void 0 : n.disconnect()), he(t, a, { flush: "post" });
}
const r1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function l1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const a = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    a.count += 1, a.mine || (a.mine = n.actor_type === "user"), a.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, a);
  }
  return [...t.values()].map(({ names: n, ...a }) => ({ ...a, title: [...n].join(" and ") }));
}
const i1 = ["data-incoming", "data-ref"], c1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], u1 = { class: "message-body" }, d1 = ["title"], f1 = ["innerHTML"], h1 = ["title"], m1 = ["innerHTML"], p1 = {
  class: "message-faces",
  "data-message-faces": ""
}, g1 = ["title", "data-face", "onClick"], v1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, y1 = ["title", "data-reaction", "onClick"], k1 = {
  key: 0,
  class: "message-reaction-count"
}, b1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, w1 = ["href", "title"], x1 = ["src", "alt"], $1 = ["href"], M1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, S1 = ["data-sent-worker", "title", "onClick"], _1 = { class: "message-foot" }, E1 = { class: "message-time" }, C1 = {
  class: "message-id",
  "data-message-id": ""
}, A1 = 140, O1 = 2, T1 = 1500, B1 = "An earlier message", I1 = "about", R1 = "sent_to", L1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var F;
    const n = e, a = t, s = T(!1), o = T(null), r = R(() => ["user", "comment"].includes(n.message.type)), l = R(() => {
      const [X, J] = (n.message.commented_row || ":").split(":"), K = Ve(X);
      return K ? { ref: `${K}:${J}`, label: `${It(K).title.toLowerCase()} ${J}` } : null;
    }), i = R(() => n.message.worker_id ?? null), u = T(!1), d = R(() => i.value !== null && ((n.message.text ?? "").length > A1 || (n.message.text ?? "").split(`
`).filter((X) => X.trim()).length > O1)), f = R(() => r.value && !n.message.read_at && !n.message.local);
    async function p() {
      var X;
      await ((X = navigator.clipboard) == null ? void 0 : X.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, T1);
    }
    const y = or(), w = R(() => y(n.message.text ?? "")), S = R(() => JSON.parse(n.message.flowchart_edges || "[]")), $ = T(!1), B = R(() => y(n.quote || B1));
    function U() {
      const X = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      X ? X.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    o1(o, () => `${n.message.text} ${n.quote}`);
    const ee = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, P = (X) => `/api/files/message/${n.message.id}/${encodeURIComponent(X)}`, x = R(() => JSON.parse(n.message.captions || "{}")), C = R(() => (n.message.files ?? []).map((X) => ({ name: X, address: P(X), isImage: ee.test(X), title: x.value[X] || X }))), M = R(() => wr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), _ = $e(Se, null), v = T([]), E = T([]);
    async function k() {
      if (!r.value || !(_ != null && _.read) || n.message.local) return;
      const X = await _.read(`link list --source message:${n.message.id}`);
      if (!X.ok) return;
      const J = X.value.rows ?? X.value ?? [];
      v.value = J.filter((K) => K.link_type === I1).map((K) => ({ model: K.target_model, id: K.target_id })), E.value = J.filter((K) => K.link_type === R1).map((K) => K.target_id);
    }
    k(), (F = _ == null ? void 0 : _.follow) == null || F.call(_, ["link.*"], k);
    const m = T(!1), O = R(() => l1(n.message.reactions));
    function L(X) {
      m.value = !1, a("react", n.message, X);
    }
    return (X, J) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      I(Dh, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (K) => a("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, i1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", u1, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: l.value }]),
          onClick: J[6] || (J[6] = (...K) => H(Mt) && H(Mt)(...K))
        }, [
          l.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${l.value.label}`,
            onClick: J[1] || (J[1] = ke((K) => H(Ne)(l.value.ref), ["stop"]))
          }, [
            I(me, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + b(l.value.label), 1)
          ], 8, d1)) : A("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ke(U, ["stop"]),
            innerHTML: B.value
          }, null, 8, f1)) : A("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: J[2] || (J[2] = ke((K) => H(Ne)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + b(i.value), 9, h1)) : A("", !0),
          g("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: w.value
          }, null, 10, m1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = ke((K) => u.value = !u.value, ["stop"]))
          }, b(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          S.value.length ? (c(), h(G, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (K) => $.value = !0)
            }, "Open the flowchart"),
            $.value ? (c(), V(bh, {
              key: 0,
              title: e.message.text,
              edges: S.value,
              onClose: J[5] || (J[5] = (K) => $.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        g("div", {
          class: Z(["message-tools", { picking: m.value }]),
          "data-message-tools": ""
        }, [
          m.value ? (c(), h(G, { key: 0 }, [
            g("div", p1, [
              (c(!0), h(G, null, te(H(r1), (K) => (c(), h("button", {
                key: K,
                type: "button",
                class: "message-face",
                title: `React ${K}`,
                "data-face": K,
                onClick: (ie) => L(K)
              }, b(K), 9, g1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (K) => m.value = !1)
            }, [
              I(me, {
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
              onClick: J[8] || (J[8] = (K) => m.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[9] || (J[9] = (K) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: p
            }, b(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (K) => a("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      O.value.length ? (c(), h("div", v1, [
        (c(!0), h(G, null, te(O.value, (K) => (c(), h("button", {
          key: K.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: K.mine }]),
          title: K.title,
          "data-reaction": K.emoji,
          onClick: (ie) => a("react", e.message, K.emoji)
        }, [
          ne(b(K.emoji) + " ", 1),
          K.count > 1 ? (c(), h("span", k1, b(K.count), 1)) : A("", !0)
        ], 10, y1))), 128))
      ])) : A("", !0),
      C.value.length ? (c(), h("div", b1, [
        (c(!0), h(G, null, te(C.value, (K) => (c(), h(G, {
          key: K.name
        }, [
          K.isImage ? (c(), h("a", {
            key: 0,
            href: K.address,
            target: "_blank",
            class: "message-image",
            title: K.title
          }, [
            g("img", {
              src: K.address,
              alt: K.name,
              "data-figure-picture": ""
            }, null, 8, x1)
          ], 8, w1)) : (c(), h("a", {
            key: 1,
            href: K.address,
            target: "_blank",
            class: "message-file"
          }, b(K.name), 9, $1))
        ], 64))), 128))
      ])) : A("", !0),
      E.value.length ? (c(), h("div", M1, [
        I(me, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, te(E.value, (K) => (c(), h("button", {
          key: K,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": K,
          title: `Open worker ${K}`,
          onClick: ke((ie) => H(Ne)(`agents:${K}`), ["stop"])
        }, "Also sent to worker " + b(K), 9, S1))), 128))
      ])) : A("", !0),
      g("div", _1, [
        g("time", E1, b(M.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(G, { key: 0 }, [
          J[11] || (J[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", C1, "message " + b(e.message.id), 1)
        ], 64)) : A("", !0),
        r.value ? (c(), V(Jh, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ]),
      v.value.length ? (c(), V(Vh, {
        key: 3,
        links: v.value
      }, null, 8, ["links"])) : A("", !0)
    ], 8, c1));
  }
}, Z2 = /* @__PURE__ */ Y(L1, [["__scopeId", "data-v-2b3e68eb"]]), N1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const l = _l("SkeletonParts", !0);
      return c(!0), h(G, null, te(e.parts, (i, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, te(i.count, (d) => (c(), V(Bt, {
          key: d,
          value: i.shape
        }, {
          line: N(() => [
            g("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: i.width, height: `${t[i.size]}px` })
            }, null, 4)
          ]),
          circle: N(() => [
            g("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[i.size]}px`, height: `${n[i.size]}px` })
            }, null, 4)
          ]),
          block: N(() => [
            g("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: i.width, height: `${i.height}px` })
            }, null, 4)
          ]),
          grow: N(() => [...r[0] || (r[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: N(() => [
            g("div", {
              class: "skeleton-row",
              style: fe(a(i))
            }, [
              I(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: N(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(a(i))
            }, [
              I(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: N(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: fe(a(i))
            }, [
              I(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: N(() => [
            g("div", {
              class: "skeleton-grid",
              style: fe(s(i))
            }, [
              I(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), D1 = /* @__PURE__ */ Y(N1, [["__scopeId", "data-v-576c95e1"]]), P1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, j1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", P1, [
      I(D1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, xr = /* @__PURE__ */ Y(j1, [["__scopeId", "data-v-52f66b64"]]), En = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Qn = 200, $r = (e) => {
  var t;
  return ((t = En.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? En[0].key;
}, J2 = (e) => {
  var t;
  return ((t = En.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, q1 = ["aria-label"], F1 = 300, qs = 400, W1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Qn } },
  setup(e) {
    const t = e, n = R(() => $r(t.value)), a = R(() => n.value < Qn ? [1, 0.25, 0.25] : n.value === Qn ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= qs, high: n.value >= F1 && n.value < qs }]),
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
    ], 10, q1));
  }
}, X2 = /* @__PURE__ */ Y(W1, [["__scopeId", "data-v-b10e610f"]]), Fs = (e) => [...new Set(e.agents.map((t) => t.name))], Q2 = (e) => Fs(e).length === 1 ? `Worker: ${Fs(e)[0]}` : "Delegated", H1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Ws = (e) => H1[e.card.state] || "idle", U1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Hs = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Us = (e, t) => Hs[Ws(e)] - Hs[Ws(t)], zs = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, ew = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Us(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || U1(a, s)) : [...e].sort((a, s) => Us(a, s) || (zs[t] || zs.state)(a, s)), z1 = { class: "list-row" }, V1 = {
  key: 0,
  class: "list-row-kind"
}, G1 = { class: "list-row-main" }, K1 = {
  key: 0,
  class: "list-row-title"
}, Y1 = { class: "list-row-body" }, Z1 = {
  key: 1,
  class: "list-row-end"
}, J1 = {
  key: 1,
  class: "list-row-text"
}, X1 = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", z1, [
      e.kind ? (c(), h("span", V1, b(e.kind), 1)) : A("", !0),
      g("div", G1, [
        e.title ? (c(), h("span", K1, b(e.title), 1)) : A("", !0),
        g("div", Y1, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Z1, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), h("span", J1, b(e.text), 1)) : A("", !0)
    ]));
  }
}, tw = /* @__PURE__ */ Y(X1, [["__scopeId", "data-v-63155fba"]]), Q1 = {
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
}, em = { claude: "Claude Code", codex: "Codex" }, tm = ["aria-expanded"], nm = { class: "drop-label" }, am = ["value"], sm = {
  key: 1,
  class: "drop-lead"
}, om = { class: "drop-item-text" }, rm = {
  key: 2,
  class: "drop-note"
}, lm = {
  key: 1,
  class: "drop-none"
}, im = {
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
    const n = e, a = t, s = T(!1), o = T(null), r = T(""), l = R(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function i(u) {
      s.value = !1, a("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: s.value }]),
        "aria-expanded": s.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => s.value = !s.value)
      }, [
        e.icon ? (c(), V(me, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        g("span", nm, b(e.label), 1),
        I(me, {
          name: "down",
          size: 11
        })
      ], 10, tm),
      s.value ? (c(), V(Ln, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => s.value = !1)
      }, {
        default: N(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, am)) : A("", !0),
          (c(!0), h(G, null, te(l.value, (f) => (c(), V(ht, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (p) => i(f)
          }, {
            default: N(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (c(), h("span", sm, b(f.lead), 1)) : A("", !0),
              g("span", om, b(f.label), 1),
              f.note ? (c(), h("span", rm, b(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          l.value.length ? A("", !0) : (c(), h("p", lm, b(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, cm = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-29dfcce5"]]), nw = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = R(() => [
      ...Q1[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = R(() => (s.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, l) => (c(), V(cm, {
      label: o.value,
      icon: "model",
      items: s.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${H(em)[e.provider]} model`,
      onPick: l[0] || (l[0] = (i) => a("pick", i.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, um = ["aria-label"], dm = { class: "head" }, fm = { class: "names" }, hm = { class: "body" }, mm = {
  key: 0,
  class: "foot"
}, pm = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = Fo(a, n), l = Wo(s);
    return (i, u) => (c(), V(za, { to: "body" }, [
      I(Ot, {
        name: "side",
        appear: "",
        onAfterLeave: H(r)
      }, {
        default: N(() => [
          H(s) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: H(l) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = ke((...d) => H(o) && H(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(G, { key: 0 }, [
                g("header", dm, [
                  g("div", fm, [
                    g("h2", null, b(e.title), 1),
                    e.abstract ? (c(), V(et, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  ce(i.$slots, "actions", {}, void 0, !0),
                  I(Ja, {
                    title: e.closeLabel,
                    onClick: H(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", hm, [
                  ce(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", mm, [
                  ce(i.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : ce(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, um)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, aw = /* @__PURE__ */ Y(pm, [["__scopeId", "data-v-c9a3f43a"]]), gm = {
  key: 1,
  class: "text-field-label"
}, vm = {
  key: 2,
  class: "text-field-end"
}, ym = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ wa({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = ba(e, "modelValue"), a = Rn(), s = "onUpdate:modelValue" in (((d = El()) == null ? void 0 : d.vnode.props) || {}), o = R(() => s ? n.value : a.value), r = (f) => s && (n.value = f.target.value), l = R(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = R(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = T(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, p) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, H(a).class]),
      style: fe(H(a).style)
    }, [
      e.icon ? (c(), V(me, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), h("span", gm, b(e.label), 1)) : A("", !0),
      Ye(g("input", Ke({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, l.value, { onInput: r }), null, 16), [
        [H(_a), o.value]
      ]),
      f.$slots.end ? (c(), h("span", vm, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : Ye((c(), h("input", Ke({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: r }), null, 16)), [
      [H(_a), o.value]
    ]);
  }
}), sw = /* @__PURE__ */ Y(ym, [["__scopeId", "data-v-d9c38ca8"]]);
async function km(e, t, n) {
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
const Vs = (e, t) => "total" in e ? e.page * e.size < e.total : e.rows.length >= t;
function ow(e) {
  const t = vt().sources.find((n) => n.key === e);
  return t ? Ia(t.read, t.events) : Ia("", []);
}
function Ia(e, t, { incremental: n = !1 } = {}) {
  var x;
  const a = Number(((x = e.match(/--limit[=\s]+(\d+)/)) == null ? void 0 : x[1]) ?? 50), s = vt(), o = T([]), r = T(null), l = T(""), i = T(!1), u = performance.now(), d = T(!1), f = T(""), p = T(null);
  async function y(C) {
    const M = $, _ = await s.read(`${e} --before-id ${C + 1} --limit 1`);
    if (M !== $) return;
    if (!_.ok) return U();
    const v = _.value.rows.find((E) => E.id === C);
    o.value = v ? o.value.map((E) => E.id === C ? v : E) : o.value.filter((E) => E.id !== C);
  }
  async function w(C) {
    if (n && String((C == null ? void 0 : C.event) ?? "").endsWith(".delete")) return void (o.value = o.value.filter((m) => m.id !== C.row_id));
    if (n && (C != null && C.row_id) && !String(C.event ?? "").endsWith(".create") && o.value.some((m) => m.id === C.row_id)) return y(C.row_id);
    if (!(n && o.value.length && String((C == null ? void 0 : C.event) ?? "").endsWith(".create"))) return U();
    const _ = Math.max(...o.value.map((m) => m.id)), v = $, E = await s.read(`${e} --after-id ${_}`);
    if (v !== $) return;
    if (!E.ok) return U();
    const k = new Set(o.value.map((m) => m.id));
    o.value = [...E.value.rows.filter((m) => !k.has(m.id)), ...o.value];
  }
  async function S() {
    if (!d.value || !o.value.length) return !1;
    const C = $, M = Math.min(...o.value.map((E) => E.id)), _ = await s.read(`${e} --before-id ${M}`);
    if (C !== $) return !1;
    if (!_.ok || !_.value.rows.length) return d.value = !1;
    d.value = Vs(_.value, a);
    const v = new Set(o.value.map((E) => E.id));
    return o.value = [...o.value, ..._.value.rows.filter((E) => !v.has(E.id))], !0;
  }
  let $ = 0;
  async function B(C) {
    const M = ++$, _ = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (M !== $) return;
    const v = _.ok ? s.shared ? [_.value] : _.value.rows : [];
    o.value = C(v), r.value = _.ok ? _.value : null;
    const E = v.length ? Math.min(...v.map((k) => k.id)) : 0;
    _.ok && !o.value.some((k) => k.id < E) && (d.value = !s.shared && Vs(_.value, a)), l.value = _.ok ? "" : _.error, Ka(u, () => i.value = !0);
  }
  function U() {
    return B((C) => {
      if (!n || !C.length) return C;
      const M = Math.min(...C.map((v) => v.id)), _ = Math.max(...C.map((v) => v.id));
      return [...o.value.filter((v) => v.id > _), ...C, ...o.value.filter((v) => v.id < M)];
    });
  }
  const ee = () => B((C) => C);
  async function P(C, M = null) {
    const _ = await km(M && { target: o, fields: { value: M(o.value) } }, C, s.run);
    return f.value = _.ok ? "" : _.error, p.value = _.ok ? _.value : null, await U(), _;
  }
  return e && (s.follow(t, w), U()), { rows: o, listing: r, failure: l, loaded: i, more: d, load: U, loadLatest: ee, older: S, act: P, actionFailure: f, answer: p, context: s };
}
const bm = { class: "title" }, wm = { class: "state" }, xm = {
  __name: "StateRows",
  props: {
    kind: { type: String, required: !0 },
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: a, loaded: s } = Ia(t.line, t.events);
    return (o, r) => (c(), V(vu, {
      rows: H(n),
      failure: H(a),
      loaded: H(s),
      empty: e.empty
    }, {
      default: N(({ row: l }) => [
        g("span", bm, b(l.title), 1),
        g("span", wm, b(H(Lo)(e.kind, l.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, rw = /* @__PURE__ */ Y(xm, [["__scopeId", "data-v-3d3d982a"]]);
function $m(e = 1e3, t = null) {
  const n = T(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? he(t, s, { immediate: !0 }) : s(!0), Ae(() => clearInterval(a)), n;
}
const ea = T(Date.now() / 1e3);
let Gs = 0, un = 0;
function Mr() {
  return un || (ea.value = Date.now() / 1e3, Gs = setInterval(() => ea.value = Date.now() / 1e3, 1e3)), un += 1, wo() && xo(() => {
    un -= 1, un || clearInterval(Gs);
  }), ea;
}
const Mm = 200, Sm = vr + vn + yr + Mm;
function Lt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function _m(e, t, n) {
  var a, s;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Lt(e),
    top: Lt(e.querySelector(".top")),
    title: Lt(e.querySelector(".title")),
    contents: Lt(e.querySelector(":scope > :not(.top)")),
    scroll: ((a = e.closest(".history")) == null ? void 0 : a.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var r, l, i, u;
      return `${((l = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : l.className) || ((u = (i = o.effect) == null ? void 0 : i.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: r, maxWidth: l, boxSizing: i, transform: u, display: d }) => ({ width: o, minWidth: r, maxWidth: l, boxSizing: i, transform: u, display: d }))(getComputedStyle(e)),
    parent: Lt(e.parentElement),
    parentClasses: ((s = e.parentElement) == null ? void 0 : s.className) ?? ""
  };
}
function Em(e, t, n, a) {
  he(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const r = performance.now(), l = [];
    function i() {
      if (a.markMotion.value) {
        if (l.push(_m(o, r, n.value)), performance.now() - r < Sm) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: l })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const Cm = ["title", "data-figure-mark", "data-folded", "data-open"], Am = {
  key: 2,
  class: "worker"
}, Om = { class: "head" }, Tm = { key: 0 }, Bm = {
  key: 3,
  class: "status"
}, Im = {
  key: 0,
  class: "figure"
}, Rm = {
  key: 1,
  class: "ran-for"
}, Lm = { key: 2 }, Nm = {
  key: 3,
  class: "news"
}, Dm = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Pm = {
  key: 6,
  class: "settled"
}, jm = {
  key: 1,
  class: "bar"
}, qm = {
  key: 3,
  class: "detail body"
}, Fm = {
  key: 0,
  class: "body-label"
}, Wm = ["title"], Hm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Rn(), a = ["onClick", "onAct"], s = R(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = T(!1), r = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), l = R(() => t.open !== void 0), i = R(() => l.value || r.value), u = R(() => l.value ? t.open : o.value), d = R(() => l.value ? !t.open : r.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), p = R(() => i.value || f.value || !!n.onClick), y = T(null), w = T(null), { folded: S, phase: $ } = kr(y, () => d.value);
    Em(y, d, $, $e(Se, null));
    function B(ie) {
      var ve, Oe;
      if (!(ie.target !== y.value && !w.value.contains(ie.target))) {
        if (l.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (r.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ie);
      }
    }
    const U = (ie) => n.onAct(ie), ee = ["failed", "unfinished"], P = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? ee.includes(t.mark.state) ? "danger" : "good" : ""), x = R(() => t.mark.color ? t.mark.color : P.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : P.value ? `var(--tone-${P.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), C = R(() => x.value || "var(--tone-work)"), M = R(() => !t.mark.ending && !t.mark.ended && P.value !== "stopped"), _ = Mr(), v = R(
      () => t.mark.began_at && M.value && !t.mark.figure && !t.mark.counting ? e1(_.value - t.mark.began_at) : ""
    ), E = R(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${js(ve - ie, !0)}` : js(_.value - ie, !0) : v.value;
    }), k = ["bad", "danger", "warn"], m = R(() => k.includes(P.value) || t.mark.asks ? "attention" : M.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), O = ["bad", "danger"], L = R(() => O.includes(P.value)), F = R(() => m.value === "process" ? "running" : L.value ? "cross" : P.value === "stopped" ? "stopped" : P.value === "good" ? "tick" : ""), X = R(
      () => !!(t.mark.figure || E.value || t.mark.docked || t.mark.stopping || F.value || t.mark.settled || t.mark.news)
    ), J = R(() => [t.mark.title, t.mark.time ? wr(t.mark.time) : ""].filter(Boolean).join(" · ")), K = R(() => ({
      ...x.value ? { "--mark": x.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ve) => (c(), h("div", Ke(s.value, {
      ref_key: "root",
      ref: y,
      class: [
        "mark",
        `w-${m.value}`,
        H($),
        {
          open: u.value,
          folding: l.value && d.value,
          live: p.value,
          failed: L.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: x.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: K.value,
      title: J.value,
      "data-figure-mark": e.mark.key,
      "data-folded": H(S) ? "" : null,
      "data-open": l.value && e.open ? "" : null,
      onClick: B
    }), [
      (c(), V(pt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: w,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: N(() => [
          e.mark.markIcon ? (c(), V(at, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), V(me, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Am, b(e.mark.worker), 1)) : A("", !0),
          g("span", Om, [
            I(et, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Tm, b(e.mark.name), 1)) : A("", !0),
            i.value ? (c(), V(Ct, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          X.value ? (c(), h("span", Bm, [
            e.mark.figure ? (c(), h("span", Im, b(e.mark.figure), 1)) : A("", !0),
            E.value ? (c(), h("span", Rm, b(E.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), h("span", Lm, "Stopping")) : A("", !0),
            e.mark.news ? (c(), h("span", Nm, b(e.mark.news), 1)) : A("", !0),
            F.value === "running" ? (c(), h("span", Dm)) : F.value ? (c(), V(at, {
              key: 5,
              class: Z(["sign", F.value]),
              name: F.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), h("span", Pm, b(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), V(gr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: ke(U, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && M.value ? (c(), h("span", jm, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: C.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !H(S) ? (c(), V(et, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !H(S) ? (c(), h("div", qm, [
        e.mark.bodyLabel ? (c(), h("p", Fm, b(e.mark.bodyLabel), 1)) : A("", !0),
        I(et, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !H(S) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, b(e.mark.command), 9, Wm)) : A("", !0),
      e.mark.card ? (c(), V(et, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      ce(ie.$slots, "default", {
        shown: !H(S)
      }, void 0, !0)
    ], 16, Cm));
  }
}), Sr = /* @__PURE__ */ Y(Hm, [["__scopeId", "data-v-2aa9c496"]]), Um = 60;
function zm(e, t) {
  const n = T([]), a = T(0);
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
    if (r || a.value <= 0 || d.scrollTop > Um) return;
    r = !0;
    const f = d.scrollHeight, p = await e(["output", "page", String(t()), "--before", String(a.value)]);
    r = !1, p.ok && (n.value = [...p.value.lines, ...n.value], a.value = p.value.first_byte, await st(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: l, follow: i, loadEarlier: u };
}
const Vm = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function _r(e) {
  var n;
  const t = Vm[e] || ((n = It(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Gm = (e) => _r(String(e).split(":")[0]), Er = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Km = { passed: "good", failed: "danger", warned: "warn", running: "" }, Ym = { good: "good", warn: "warn", danger: "danger" }, Ks = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => uu(e.target_model, e.target_id || 0)
}, Zm = { "open row": (e) => Gm(e.target_model), "open page": () => _r("pages") };
function Jm(e, t) {
  const n = t || {}, a = Ks[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Km[e.outcome] || "" : Ym[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Zm[a](e) : "",
    handlers: a ? { onAct: () => Ks[a](e) } : {}
  };
}
const Xm = 24, Qm = 1e3, Ys = 2e3, ep = 0.25, tp = 5e3;
function np(e, t = Xm, n = () => !0) {
  const a = T(!1), s = T(0), o = T(!1);
  let r = 0, l = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const P = u();
    return P ? P.scrollHeight - P.scrollTop - P.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function p(P) {
    if (clearTimeout(r), !P) {
      o.value = !1, i = Date.now();
      return;
    }
    const x = Date.now() - i < Ys ? Ys : Qm;
    r = setTimeout(() => o.value = a.value, x);
  }
  function y() {
    clearTimeout(l), a.value = !1, s.value = 0, p(!1);
  }
  function w(P = !1) {
    const x = u();
    x && P && x.scrollTo ? x.scrollTo({ top: x.scrollHeight, behavior: "smooth" }) : x && (x.scrollTop = x.scrollHeight), y();
  }
  function S() {
    B(), !a.value && (a.value = !0, p(!0));
  }
  const $ = () => !!u() && d() <= u().clientHeight * ep;
  function B() {
    clearTimeout(l), $() && (l = setTimeout(() => a.value && $() && n() && w(!0), tp));
  }
  function U() {
    f() ? y() : S();
  }
  function ee(P = 1, x = !1) {
    a.value ? s.value += Math.max(0, P) : w(x);
  }
  return wo() && xo(() => [r, l].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: y, toBottom: w, left: S, scrolled: U, arrived: ee };
}
const ap = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, sp = (e) => String(e ?? "").replace(ap, ""), op = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = T(null), { away: o, scrolled: r, arrived: l, toBottom: i } = np(s);
    he(
      () => n.lines.length,
      () => st(() => l()),
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
      ne(b(H(sp)(e.lines.join(`
`)) || e.empty), 1),
      H(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (p) => H(i)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, rp = /* @__PURE__ */ Y(op, [["__scopeId", "data-v-c2fb1783"]]), lp = 1e4;
class ip {
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
    return this.heardAt !== null && t - this.heardAt > lp;
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
const cp = {
  key: 0,
  class: "frame-note"
}, up = {
  key: 0,
  class: "frame-note"
}, dp = ["src", "title"], fp = 1e3, hp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = vt(), a = T(null), s = T(!1), o = T(!1);
    let r = null, l = 0;
    return Te(() => {
      r = new ip(a.value, n), r.start(), l = setInterval(() => {
        s.value = r.silent();
      }, fp);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(l);
    }), (i, u) => o.value ? (c(), h("p", cp, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      s.value ? (c(), h("div", up, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        I(ue, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: N(() => [...u[1] || (u[1] = [
            ne("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: a,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: H(n).window
      }, null, 8, dp)
    ], 64));
  }
}, mp = /* @__PURE__ */ Y(hp, [["__scopeId", "data-v-32a49046"]]);
function pp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const gp = {
  class: "allowance-prompt",
  role: "dialog"
}, vp = { class: "allowance-prompt-text" }, yp = { class: "allowance-prompt-buttons" }, kp = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", gp, [
      g("p", vp, b(H(pp)(e.request)), 1),
      g("div", yp, [
        I(ue, {
          kind: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            ne("Allow", -1)
          ])]),
          _: 1
        }),
        I(ue, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            ne("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, bp = /* @__PURE__ */ Y(kp, [["__scopeId", "data-v-102dc765"]]), ta = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), V(xn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: N(() => [
        ne(b(e.reason) + " ", 1),
        e.retry ? (c(), V(ue, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: N(() => [...s[2] || (s[2] = [
            ne("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (c(), V(ue, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: N(() => [...s[3] || (s[3] = [
            ne("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, wp = ["data-window", "data-agent"], xp = {
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
    const n = e, a = t, s = T(""), o = T(0);
    function r() {
      s.value = "", o.value++;
    }
    const l = $e(ei, null), i = rc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: $e(ec, null),
      setOption: (f, p) => a("option", f, p),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, p) => {
        a("open", f, p), l == null || l(f, p);
      }
    });
    Cl(Se, i), he(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Te(i.settle), Ae(() => {
      i.cancel(), n.subscriptions.stopAll(n.name);
    }), Al((f) => (s.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => Ua(n.component), d = () => {
      var f, p;
      return ((p = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, p) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), V(bp, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (y) => e.prompts.answer(y))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), V(ta, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : s.value ? (c(), V(ta, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${s.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(G, { key: 4 }, [
        (c(), V(u, { key: o.value })),
        e.skeleton.length && !H(i).answered.value ? (c(), V(xr, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), V(ta, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (y) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, wp));
  }
}, Cr = /* @__PURE__ */ Y(xp, [["__scopeId", "data-v-c4443e2b"]]), $p = {
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
    const n = e, a = t, s = { render: () => Ua(mp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), V(Cr, {
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
}, Mp = ["data-window"], Sp = {
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
    const n = e, a = t, s = Ue(null), o = T("");
    return he(
      () => n.entry.entry_url,
      async (r) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              r
            )).default, Mi();
          } catch (l) {
            if (xi(l) && $i(l)) return;
            o.value = `This window's file could not be loaded: ${l.message}`;
          }
      },
      { immediate: !0 }
    ), (r, l) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      I(xr, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Mp)) : (c(), V(Cr, {
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
}, _p = "*.*", Ep = {
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
    const t = e, n = $e(Se, null), a = new Ki();
    he(
      () => a.patterns,
      (i, u, d) => {
        var p;
        const f = (p = n == null ? void 0 : n.subscriptions) == null ? void 0 : p.follow(`body of ${t.declaration.type}`, i, (y) => a.dispatch(y));
        d(() => f == null ? void 0 : f());
      },
      { immediate: !0, flush: "sync" }
    );
    const s = (n == null ? void 0 : n.environment) ?? t.environment, o = { reads: [], runs: [], missing: [], ask: async () => !0 }, r = R(() => !!(t.declaration.shipped || t.declaration.trusted)), l = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: r.value ? [_p] : t.declaration.events ?? [],
      options: []
    }));
    return (i, u) => r.value ? (c(), V(Sp, {
      key: 0,
      entry: l.value,
      subscriptions: H(a),
      environment: H(s),
      permissions: o,
      options: { row: e.row, head: e.head, foot: e.foot, actions: e.actions, time: e.time, folded: e.folded }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), V($p, {
      key: 1,
      entry: l.value,
      subscriptions: H(a),
      environment: H(s),
      permissions: o,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Cp = { class: "mark-more-inner" }, Ap = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Op = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Tp = {
  key: 3,
  class: "mark-lines"
}, Bp = "process", Zs = "task", Ip = 2e3, Rp = {
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
    ), s = R(() => Er.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === Zs ? t.mark.target_id : 0), r = zm(
      (w) => n.run(w),
      () => t.mark.target_id
    ), l = r.lines, i = T(!1), u = T(""), d = R(() => !t.declaration.body_url && t.mark.target_model === Bp && !!t.mark.target_id);
    async function f(w = r.follow) {
      const S = await w();
      i.value = !0, u.value = S.ok ? "" : S.error;
    }
    let p = null;
    const y = () => clearInterval(p);
    return he(
      () => t.shown && d.value,
      (w) => {
        y(), w && (f(), t.mark.ended_at || (p = setInterval(f, Ip)));
      },
      { immediate: !0 }
    ), he(
      () => t.mark.ended_at,
      (w) => w && t.shown && d.value && (y(), f(r.newest))
    ), Ae(y), (w, S) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: S[1] || (S[1] = ke(() => {
      }, ["stop"]))
    }, [
      g("div", Cp, [
        e.declaration.body_url ? (c(), V(Ep, {
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
            S[2] || (S[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Ap, b(s.value), 1)
          ], 64)) : A("", !0),
          d.value && u.value ? (c(), h("p", Op, b(u.value), 1)) : d.value && i.value ? (c(), h(G, { key: 2 }, [
            S[3] || (S[3] = g("p", { class: "mark-label" }, "Output", -1)),
            I(rp, {
              class: "mark-terminal",
              lines: H(l),
              onOlder: H(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Tp, b(a.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: S[0] || (S[0] = ke(($) => H(Ne)(`${Zs}:${o.value}`), ["stop"]))
          }, " Open task " + b(o.value) + " and its proofs ", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ra = /* @__PURE__ */ Y(Rp, [["__scopeId", "data-v-d1f40e82"]]), Lp = ["title", "aria-label", "onClick"], Np = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Dp = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => Dc(t.buttons, t.allowedRuns).filter((r) => {
      var l;
      return !((l = r.variants) != null && l.length) || r.variants.includes(t.mark.variant);
    })), a = T(""), s = $e(Se);
    async function o(r) {
      const l = await Xt(r, { id: t.mark.target_id }, s.environment);
      a.value = l.ok ? "" : l.error;
    }
    return (r, l) => (c(), h(G, null, [
      (c(!0), h(G, null, te(n.value, (i) => (c(), h("button", {
        key: i.runs,
        type: "button",
        class: "mark-button",
        title: i.label,
        "aria-label": i.label,
        onClick: ke((u) => o(i), ["stop"])
      }, [
        I(at, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Lp))), 128)),
      a.value ? (c(), h("span", Np, b(a.value), 1)) : A("", !0)
    ], 64));
  }
}, Pp = /* @__PURE__ */ Y(Dp, [["__scopeId", "data-v-7a62c88e"]]);
function Ar(e, t) {
  const n = Ue(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((r) => [r.type, r])), s = async () => {
    try {
      return (await (await Et.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Or = Ar("/api/marks", "marks"), lw = Or.fetchAll, jp = Or.find, qp = 2e3;
function Tr(e, t, n = qp) {
  let a = null, s = !1;
  const o = () => {
    s || (a = setTimeout(
      async () => {
        t() && await e(), o();
      },
      typeof n == "function" ? n() : n
    ));
  };
  Te(async () => {
    await e(), o();
  }), Tt(() => {
    s = !0, clearTimeout(a);
  });
}
const Fp = ["data-ref"], Wp = ["data-ref"], Hp = { class: "mark-row" }, Up = "dock add", zp = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = R(() => jp(a.mark.type)), o = $e(Se, null), r = R(() => !!(o && a.mark.target_model === "process" && a.mark.target_id && !a.mark.ended_at)), l = T(null);
    Tr(async () => {
      if (!r.value) return;
      const y = await o.read(["output", "list", "--process", String(a.mark.target_id)]);
      y.ok && y.value.rows.length && (l.value = y.value.rows[0].progress);
    }, () => r.value);
    const i = R(() => {
      const y = Jm(a.mark, s.value), w = !y.figure || y.figure.endsWith("%");
      return l.value && r.value && w ? { ...y, figure: `${l.value}%`, fraction: l.value / 100 } : y;
    }), u = R(() => {
      var y;
      return !!(a.mark.lines || a.mark.detail && Er.has(a.mark.variant) || t.has(a.mark.target_model) || (y = s.value) != null && y.body_url);
    }), d = T(!1);
    function f(y) {
      if (i.value.handlers.onAct && !y.target.closest(".fold")) return i.value.handlers.onAct();
      d.value = !d.value;
    }
    const p = R(() => {
      var y;
      return (((y = s.value) == null ? void 0 : y.buttons) || []).filter((w) => {
        var S;
        return !a.docked || !((S = w.runs) != null && S.startsWith(Up));
      }).map((w) => ({ ...w, module: s.value.module }));
    });
    return (y, w) => {
      var S, $;
      return (S = s.value) != null && S.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": H(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        I(Ra, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Fp)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": ($ = s.value) == null ? void 0 : $.full_width, docked: e.docked, "user-side": H(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Hp, [
          I(Sr, Ke({
            mark: i.value,
            open: u.value ? d.value : void 0
          }, Ol(i.value.handlers), { onClick: f }), Tl({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: N(({ shown: B }) => [
                I(Ra, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: B
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          I(Pp, {
            buttons: p.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Wp));
    };
  }
}, Vp = /* @__PURE__ */ Y(zp, [["__scopeId", "data-v-073b7a24"]]), Gp = ["data-ref"], Kp = ["inert"], Yp = { class: "group-fold" }, Zp = { class: "thread-group" }, Jp = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = T(!1), a = T(!1), s = T(!1), o = T(null);
    he(n, async (l) => {
      var i;
      a.value = !0, await st(), (i = o.value) == null || i.offsetHeight, s.value = l;
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
    return (l, i) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      I(Sr, {
        mark: r.value,
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
        g("div", Yp, [
          g("div", Zp, [
            (c(!0), h(G, null, te(e.group.marks, (u) => (c(), V(Vp, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Kp)) : A("", !0)
    ], 8, Gp));
  }
}, iw = /* @__PURE__ */ Y(Jp, [["__scopeId", "data-v-45b58b9b"]]);
function Xp(e) {
  const t = T(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Te(() => n.observe(e.value)), Tt(() => n.disconnect()), t;
}
const Qp = { class: "chat-dock-fold" }, eg = ["aria-label"], tg = { class: "chat-dock-head" }, ng = { class: "chat-dock-inner" }, ag = { class: "chat-dock-foot" }, Br = 700, sg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, body: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = T(null), a = T(null), s = Xp(a), o = T(!1);
    let r = 0;
    return Te(() => r = setTimeout(() => o.value = !0, Br)), Tt(() => clearTimeout(r)), t({ card: n }), (l, i) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", Qp, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          ce(l.$slots, "edge", {}, void 0, !0),
          g("header", tg, [
            ce(l.$slots, "head", {}, void 0, !0)
          ]),
          g("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value, body: e.body }])
          }, [
            g("div", ng, [
              g("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: fe(H(s) === null ? null : { height: `${H(s)}px` })
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
          g("footer", ag, [
            ce(l.$slots, "foot", {}, void 0, !0)
          ])
        ], 10, eg)
      ])
    ], 2));
  }
}, Ir = /* @__PURE__ */ Y(sg, [["__scopeId", "data-v-b508c301"]]), og = {
  class: "dock-leave",
  "aria-hidden": "true"
}, na = 5, rg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(na, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${na}s`, animationDelay: `${(n - na).toFixed(2)}s` };
    return (s, o) => (c(), h("span", og, [
      g("i", { style: a })
    ]));
  }
}, Rr = /* @__PURE__ */ Y(rg, [["__scopeId", "data-v-2a7bc150"]]), He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, lg = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, ig = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, cg = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], ug = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], dg = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], fg = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], hg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function mg(e, t) {
  const n = { plan: lg, task: ig }[e], a = t != null && t.state ? Qi(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[No(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const pg = (e, t) => e === "doc" || e === "report" ? hg(t) : e === "agent" ? [...dg(t), ...ug(t)] : e === "check" ? fg(t) : e === "question" ? cg(t) : mg(e, t), Lr = Ar("/api/docks", "docks"), cw = Lr.fetchAll, Dt = Lr.find, gg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), La = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), vg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), yg = (e) => ({ ...e.kept ? La("unkeep", "pins", "Let this card close", `dock unkeep ${e.id}`) : La("keep", "pins", "Keep this card", `dock keep ${e.id}`), pressed: !!e.kept }), kg = ["pins", "stop"], bg = (e) => ({ ...e, iconOnly: kg.includes(e.icon) });
function wg(e, t) {
  var n;
  return [
    ...vg(e, t) ? [yg(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || It(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    La("undock", "close", "Close this card", `dock remove ${e.id}`)
  ].map(bg);
}
function xg(e, t) {
  const n = wg(e, t);
  return {
    icon: (t == null ? void 0 : t.icon) || "",
    title: gg(e, t),
    buttons: n,
    controls: n.filter((a) => a.iconOnly),
    actions: n.filter((a) => !a.iconOnly)
  };
}
const $g = ["title"], Mg = {
  key: 2,
  class: "dock-controls"
}, Sg = {
  key: 0,
  class: "dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, _g = { class: "dock-facts" }, Eg = { key: 1 }, Cg = {
  key: 2,
  class: "dock-kept"
}, Ag = { class: "dock-acts" }, Og = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = R(() => Dt(a.item.type)), o = Mr(), r = R(() => br(a.item.created_at, o.value * 1e3)), l = T(null), i = T(null), u = T(null), d = T(null), f = R(() => xg(a.item, s.value)), p = $e(Se), y = T(null);
    let w = 0;
    async function S() {
      var v, E;
      const x = ++w, C = jt(a.item.target_model ?? ""), M = `${C} show`;
      if (!((E = (v = s.value) == null ? void 0 : v.reads) != null && E.includes(M))) return;
      const _ = await ft(a.item.type, [C, "show", String(a.item.target_id)], p.environment);
      x === w && (y.value = _.ok ? { ..._.value, id: a.item.target_id, kind: C } : { id: a.item.target_id, kind: C });
    }
    he(
      () => [a.item.type, a.item.target_model, a.item.target_id, s.value],
      (x, C, M) => {
        var E;
        const _ = jt(a.item.target_model ?? "");
        y.value = { id: a.item.target_id, kind: _ }, S();
        const v = (E = p.subscriptions) == null ? void 0 : E.follow(`dock ${a.item.id}`, [`${_.replaceAll("-", "_")}.*`], (k) => {
          (!k.row_id || k.row_id === a.item.target_id) && S();
        });
        M(() => {
          w += 1, v == null || v();
        });
      },
      { immediate: !0 }
    );
    const $ = T(/* @__PURE__ */ new Set()), B = T("");
    async function U(x) {
      if (x.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      x.action === "declared" && ($.value = /* @__PURE__ */ new Set([...$.value, x.label])), B.value = "";
      const M = await Xt(x, { id: a.item.target_id }, p.environment);
      (M == null ? void 0 : M.ok) === !1 && ($.value = new Set([...$.value].filter((_) => _ !== x.label)), B.value = `Could not ${x.label.toLowerCase()}: ${M.error}`);
    }
    const ee = R(() => f.value.actions.filter((x) => x.action !== "undock" && !$.value.has(x.label))), P = R(() => f.value.buttons.find((x) => x.action === "undock"));
    return (x, C) => {
      var M, _, v, E;
      return c(), V(Ir, {
        label: f.value.title + ((M = s.value) != null && M.needs_user ? ", waiting for you" : ""),
        kind: (_ = s.value) != null && _.needs_user ? "waiting" : "",
        folded: !!((v = s.value) != null && v.folds) && e.folded,
        body: !!((E = s.value) != null && E.folds),
        "data-figure-closing": e.leaving ? "" : null
      }, {
        edge: N(() => [
          e.leaving && !e.item.kept ? (c(), V(Rr, {
            key: 0,
            "ends-at": e.item.leaves_at
          }, null, 8, ["ends-at"])) : A("", !0)
        ]),
        head: N(() => {
          var k, m;
          return [
            (k = s.value) != null && k.draws_head ? (c(), h("span", {
              key: 0,
              ref_key: "head",
              ref: l,
              class: "dock-head",
              "data-dock-head": ""
            }, null, 512)) : (c(), h(G, { key: 1 }, [
              I(me, {
                name: f.value.icon,
                class: "dock-icon",
                size: 14
              }, null, 8, ["name"]),
              g("span", {
                class: "dock-title",
                title: f.value.title
              }, b(f.value.title), 9, $g)
            ], 64)),
            f.value.controls.length ? (c(), h("span", Mg, [
              (c(!0), h(G, null, te(f.value.controls, (O) => {
                var L, F;
                return c(), h(G, {
                  key: O.action + O.runs
                }, [
                  !$.value.has(O.label) && (!((L = O.variants) != null && L.length) || !((F = y.value) != null && F.state) || O.variants.includes(y.value.state)) ? (c(), V(ue, {
                    key: 0,
                    kind: "icon",
                    class: Z({ kept: O.pressed }),
                    "aria-pressed": O.pressed,
                    "aria-label": O.label,
                    title: O.label,
                    "data-dock-action": O.action,
                    onClick: (X) => U(O)
                  }, {
                    default: N(() => [
                      I(me, {
                        name: O.icon,
                        size: 13
                      }, null, 8, ["name"])
                    ]),
                    _: 2
                  }, 1032, ["class", "aria-pressed", "aria-label", "title", "data-dock-action", "onClick"])) : A("", !0)
                ], 64);
              }), 128))
            ])) : A("", !0),
            g("span", {
              ref_key: "time",
              ref: d,
              class: "dock-age",
              "data-dock-age": ""
            }, [
              (m = s.value) != null && m.leaves_after_seconds ? A("", !0) : (c(), h(G, { key: 0 }, [
                ne(b(r.value), 1)
              ], 64))
            ], 512)
          ];
        }),
        still: N(() => [
          B.value || e.refusal ? (c(), h("p", Sg, b(B.value || e.refusal), 1)) : A("", !0)
        ]),
        foot: N(() => {
          var k, m, O;
          return [
            g("span", _g, [
              (k = s.value) != null && k.badge ? (c(), h("span", {
                key: 0,
                class: Z(["dock-badge", e.item.type.split(".")[1]]),
                "data-dock-badge": ""
              }, b(s.value.badge), 3)) : A("", !0),
              (m = s.value) != null && m.word ? (c(), h("span", Eg, b(s.value.word), 1)) : A("", !0),
              g("span", {
                ref_key: "foot",
                ref: i,
                class: "dock-module-facts"
              }, null, 512),
              e.item.kept ? (c(), h("span", Cg, "Kept")) : A("", !0)
            ]),
            (O = s.value) != null && O.folds ? (c(), V(ue, {
              key: 0,
              small: "",
              bordered: "",
              "data-dock-fold": "",
              "aria-expanded": !e.folded,
              onClick: C[0] || (C[0] = (L) => n("fold"))
            }, {
              default: N(() => [
                ne(b(s.value.folds) + " ", 1),
                I(Ct, {
                  open: !e.folded
                }, null, 8, ["open"])
              ]),
              _: 1
            }, 8, ["aria-expanded"])) : A("", !0),
            g("span", Ag, [
              g("span", {
                ref_key: "actions",
                ref: u,
                class: "dock-module-actions"
              }, null, 512),
              I(Jc, {
                name: `dock.${e.item.type}`,
                row: y.value,
                environment: H(p).environment,
                "read-only": H(p).readOnly,
                "object-name": H(jt)(e.item.target_model),
                "external-failure": "",
                onFailure: C[1] || (C[1] = (L) => B.value = L),
                onDone: S
              }, null, 8, ["name", "row", "environment", "read-only", "object-name"]),
              (c(!0), h(G, null, te(ee.value, (L) => (c(), V(ue, {
                key: L.action + L.runs,
                small: "",
                kind: L.primary ? "primary" : "ghost",
                bordered: !L.primary,
                "data-dock-action": L.action,
                onClick: (F) => U(L)
              }, {
                default: N(() => [
                  ne(b(L.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))), 128)),
              I(ue, {
                small: "",
                bordered: "",
                title: P.value.label,
                "data-dock-action": "undock",
                onClick: C[2] || (C[2] = (L) => n("undock", P.value))
              }, {
                default: N(() => [...C[3] || (C[3] = [
                  ne("Close", -1)
                ])]),
                _: 1
              }, 8, ["title"])
            ])
          ];
        }),
        default: N(() => {
          var k;
          return [
            (k = s.value) != null && k.body_url ? (c(), V(Ra, {
              key: 0,
              declaration: s.value,
              mark: e.item,
              shown: "",
              head: l.value,
              foot: i.value,
              actions: u.value,
              time: d.value,
              folded: e.folded
            }, null, 8, ["declaration", "mark", "head", "foot", "actions", "time", "folded"])) : A("", !0)
          ];
        }),
        _: 1
      }, 8, ["label", "kind", "folded", "body", "data-figure-closing"]);
    };
  }
}, Js = /* @__PURE__ */ Y(Og, [["__scopeId", "data-v-4c3cb013"]]), Tg = 6, Bg = 3, aa = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ut = (e) => !!(e.leaves_at && !e.kept), Ig = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!ut(e) || t < e.leaves_at || n.has(e.id)), Rg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Ig(a, t, n)).sort((a, s) => a.id - s.id);
function Lg(e, t, n = Tg) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Ng = (e, t, n = e) => n < 2 ? !1 : e >= Bg ? !0 : t, Dg = ["title", "aria-label"], Pg = { class: "run-chip-in" }, jg = {
  key: 0,
  class: "run-chip-ring"
}, qg = { class: "run-chip-name" }, Fg = { class: "run-chip-bar" }, Wg = "processes.output", Hg = 5e3, Ug = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = ((d = $e(Se, null)) == null ? void 0 : d.environment) ?? "", o = T(null), r = R(() => !o.value || o.value.state === "running" || o.value.state === "background"), l = R(() => {
      var f, p;
      return ((f = o.value) == null ? void 0 : f.title) || ((p = o.value) == null ? void 0 : p.line) || a.item.title || "";
    }), i = R(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await ft(Wg, ["process", "card", String(a.item.target_id)], s);
      f.ok && (o.value = f.value);
    }
    return Tr(u, () => r.value, Hg), (f, p) => {
      var y;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: l.value,
        "aria-label": `${l.value}; show its card`,
        style: fe({ "--tone": i.value })
      }, [
        H(ut)(e.item) ? (c(), V(Rr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0),
        g("span", Pg, [
          r.value ? (c(), h("span", jg)) : (c(), V(at, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", qg, b(l.value), 1)
        ]),
        g("span", Fg, [
          g("i", {
            style: fe({ width: r.value ? `${((y = o.value) == null ? void 0 : y.progress) ?? 0}%` : "100%", background: i.value })
          }, null, 4)
        ])
      ], 12, Dg);
    };
  }
}, zg = /* @__PURE__ */ Y(Ug, [["__scopeId", "data-v-40503394"]]), Vg = 24, Gg = 8, uw = 420;
function dw({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Vg && e > t ? !0 : e < t && s > Gg ? !1 : null;
}
const Kg = (e, t) => e === void 0 ? t : e, Yg = { me: 1, people: [] }, as = Ga({
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
  people: Yg,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: $n("journal.activity", !0),
  wide: !1,
  sideMini: $n("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Zo("journal.activity", () => as.activity);
Zo("journal.side.mini", () => as.sideMini);
const Nr = "journal.viewer.";
function Zg(e, t, n) {
  try {
    const a = n.getItem(Nr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function Jg(e, t, n) {
  try {
    n.setItem(Nr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Xg(e, t, n = window.localStorage) {
  const a = T(Zg(e, t, n));
  return he(a, (s) => Jg(e, s, n), { deep: !0 }), a;
}
const Qg = {
  key: "runs-head",
  class: "dock-runs-head"
}, e0 = { class: "dock-runs-title" }, t0 = { class: "dock-runs-chips" }, n0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var C;
    const t = e, n = $m(500), a = T(/* @__PURE__ */ new Set()), s = T(!1), o = T(!1), r = $e(Se), l = T(/* @__PURE__ */ new Set()), i = T({});
    async function u(M, _) {
      i.value = { ...i.value, [M.id]: "" }, l.value = /* @__PURE__ */ new Set([...l.value, M.id]);
      const v = await Xt(_, { id: M.target_id }, r.environment);
      (v == null ? void 0 : v.ok) === !1 && (l.value = new Set([...l.value].filter((E) => E !== M.id)), i.value = { ...i.value, [M.id]: `Could not close this card: ${v.error}` });
    }
    const d = R(
      () => Rg(
        t.items.filter((M) => !l.value.has(M.id)),
        n.value,
        a.value
      )
    ), f = R(
      () => Lg(
        d.value.filter((M) => aa(M, Dt)),
        n.value
      )
    ), p = R(() => d.value.filter((M) => !f.value.includes(M) && !aa(M, Dt))), y = R(() => f.value.filter((M) => !ut(M))), w = R(() => (s.value = Ng(f.value.length, s.value, y.value.length)) && !o.value), S = Xg(`dock-folded:${((C = as.identity) == null ? void 0 : C.root) || location.host}`, {}), $ = (M) => {
      var _;
      return !!((_ = Dt(M.type)) != null && _.folds) && Kg(S.value[M.id], aa(M, Dt) || t.folded);
    };
    function B(M) {
      S.value = { ...S.value, [M.id]: !$(M) };
    }
    function U(M) {
      S.value = { ...S.value, ...Object.fromEntries(f.value.map((_) => [_.id, _.id !== M.id])) }, o.value = !0;
    }
    function ee() {
      S.value = Object.fromEntries(Object.entries(S.value).filter(([M]) => !f.value.some((_) => String(_.id) === M))), o.value = !1;
    }
    function P(M) {
      a.value = /* @__PURE__ */ new Set([...a.value, M.id]);
    }
    function x(M) {
      a.value = new Set([...a.value].filter((_) => _ !== M.id));
    }
    return (M, _) => (c(), V(bo, {
      tag: "div",
      name: "dock",
      duration: H(Br),
      class: "dock-stack"
    }, {
      default: N(() => [
        (c(!0), h(G, null, te(p.value, (v) => (c(), V(Js, {
          key: v.id,
          item: v,
          class: Z({ timed: H(ut)(v) }),
          leaving: H(ut)(v) && !a.value.has(v.id),
          folded: $(v),
          refusal: i.value[v.id],
          onFold: (E) => B(v),
          onUndock: (E) => u(v, E),
          onMouseenter: (E) => P(v),
          onMouseleave: (E) => x(v)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value ? (c(), h("div", Qg, [
          g("span", null, b(f.value.length) + " runs", 1),
          I(ue, {
            small: "",
            bordered: "",
            "aria-expanded": "true",
            "data-dock-runs-fold": "",
            onClick: ee
          }, {
            default: N(() => [
              _[1] || (_[1] = ne(" Runs ", -1)),
              I(Ct, { open: "" })
            ]),
            _: 1
          })
        ])) : A("", !0),
        (c(!0), h(G, null, te(w.value ? [] : f.value, (v) => (c(), V(Js, {
          key: v.id,
          item: v,
          class: Z({ timed: H(ut)(v) }),
          leaving: H(ut)(v) && !a.value.has(v.id),
          folded: $(v),
          refusal: i.value[v.id],
          onFold: (E) => B(v),
          onUndock: (E) => u(v, E),
          onMouseenter: (E) => P(v),
          onMouseleave: (E) => x(v)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        w.value ? (c(), V(Ir, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: N(() => [
            I(me, {
              name: "runs",
              size: 14
            }),
            g("span", e0, b(f.value.length) + " runs", 1)
          ]),
          foot: N(() => [
            g("span", t0, [
              (c(!0), h(G, null, te(f.value, (v) => (c(), V(zg, {
                key: v.id,
                item: v,
                onClick: (E) => U(v)
              }, null, 8, ["item", "onClick"]))), 128))
            ]),
            I(ue, {
              small: "",
              bordered: "",
              "aria-expanded": "false",
              "data-dock-runs-open": "",
              onClick: _[0] || (_[0] = (v) => o.value = !0)
            }, {
              default: N(() => [
                _[2] || (_[2] = ne(" Runs ", -1)),
                I(Ct)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["label"])) : A("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, fw = /* @__PURE__ */ Y(n0, [["__scopeId", "data-v-bf8cd8b0"]]), dt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, yn = (e) => Math.min(Math.max(e, 0), 1), a0 = (e) => {
  const t = yn(e);
  return t * t * (3 - 2 * t);
}, rt = (e, t, n) => a0((e - t) / (n - t));
function hw(e) {
  const t = yn(e), n = yn((t - 0.12) / 0.76) * dt.shuffles, a = Math.min(Math.floor(n), dt.shuffles - 1), s = n - a, o = rt(s, 0.26, 0.38) * (1 - rt(s, 0.76, 0.96)), r = rt(s, 0.38, 0.76), l = rt(t, 0, 0.12) * (1 - rt(t, 0.88, 1)), i = rt(s, 0.2, 0.34) * (1 - rt(s, 0.84, 1)), u = Math.sin(Math.PI * yn((s - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (a + r) / dt.shuffles, lift: dt.lift * o, ready: l, weight: i, follow: u, shuffle: a, phase: s };
}
function mw(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Xs = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, pw = (e) => Xs[e] ?? Xs.butler, ss = 2400, s0 = 0.05;
function o0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, s0), r = Math.min(t + ss * o, s), l = e + r * o;
  return l < n ? { y: l, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function gw(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function r0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function vw(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const yw = (e, t) => ({ ...e, stretch: t.stretch }), kw = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Dr = (e, t) => t >= (e.least ?? 0);
function bw(e, t, n) {
  if (!Dr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const ww = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), l0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Qs = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), i0 = (e) => e.right > e.left && e.bottom > e.top;
function xw(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(l0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let l = Qs(r, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (l = Qs(l, i.getBoundingClientRect()), a && (l.bottom = Math.min(l.bottom, a.top))), i0(l) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: l }] : [];
  });
}
function Pr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let r = 0, l = 1;
    for (const [d, f, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const y = t[d] - e[d];
      if (Math.abs(y) < 1e-9)
        (e[d] < o[f] || e[d] > o[p]) && (l = -1);
      else {
        const w = (o[f] - e[d]) / y, S = (o[p] - e[d]) / y;
        r = Math.max(r, Math.min(w, S)), l = Math.min(l, Math.max(w, S));
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
}, Vt = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), c0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => c0(Vt(e, t, n)), u0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], tt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, dn = ([e, t], n) => e + n() * (t - e);
function d0(e) {
  return u0.map(() => {
    const t = dn(tt.speed, e), n = dn(tt.angle, e) * Math.PI / 180, a = dn(tt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [dn(tt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const f0 = d0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function h0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * tt.gravity * (t[2] - tt.floor))) / tt.gravity;
}
function $w(e, t, n = f0) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], r = h0(o, a.from), l = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= r + l) return null;
  const i = Math.min(s, r), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= tt.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - r) / l };
}
const Mw = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function Sw(e, t) {
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
const _w = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), _t = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Ew(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [r, l] = [t.left + _t.margin * n, t.right - _t.margin * n], i = Math.min(Math.max(e + o + s * _t.reach * n, r), l), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function Cw(e, t, n) {
  const a = xe.bug_smash, s = Me(t, a.walk), o = ([r, l]) => r + (l - r) * s;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (_t.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: _t.tall * n * (1 - Me(t, a.emerge)),
      turn: 90 * (1 - Me(t, a.climb)),
      whole: t < a.blow,
      flat: t >= a.blow ? 1 : 0,
      shows: 1 - Me(t, a.gone)
    }
  };
}
function Aw(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= _t.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = o0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ce = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Ow(e) {
  const t = Ce.least + Math.floor(e() * (Ce.most - Ce.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ce.walls[Math.floor(e() * Ce.walls.length)],
    along: Ce.margin + e() * (1 - 2 * Ce.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Na(e, t, n) {
  const a = e.wall === "top" ? t.right - t.left : t.bottom - t.top, s = 1 - 2 * Ce.margin, r = ((e.along - Ce.margin + e.way * Ce.speed * n / a) / s % 2 + 2) % 2, l = Ce.margin + s * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + l * a, y: t.top + Ce.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ce.inset : t.right - Ce.inset, y: t.top + l * a, turn: e.wall === "left" ? 90 : -90 };
}
function m0(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, r = r0(e, o), l = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : l + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: l, shot: u };
}
function Tw(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: r, bug: l, shot: i } = m0(n, e.length), u = e.map((B, U) => ({ ...Na(B, t, Math.min(n / o.fps, kn(U).shot)), shot: U < i })), d = Me(r / o.frames, o.aim), [f, p] = [u[Math.max(l - 1, 0)], u[l]], y = e.map((B, U) => ({ bug: B, index: U, seconds: n / o.fps - kn(U).shot, spot: Na(B, t, kn(U).shot) })).filter((B) => B.seconds >= 0), w = y.flatMap((B) => {
    const U = (s == null ? void 0 : s.get(B.index)) ?? k0(B.bug, t, B.spot, s ? [] : a);
    return s == null || s.set(B.index, U), s && b0(U, B.seconds, a), w0(U, B.seconds, a);
  }), S = y.filter((B) => v0(B.bug)).map((B) => ({ seconds: B.seconds, from: B.spot })), $ = +(e[Math.max(l - 1, 0)].wall === "top") * (1 - d) + +(e[l].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (p.x - f.x) * d, y: f.y + (p.y - f.y) * d, back: $ }, slush: w, camera: S };
}
function kn(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function Bw(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [r, l] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = kn(d), p = Na(u, t, f.shot), y = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), w = p.x === i ? i - r >= l - i ? -1 : 1 : Math.sign(i - p.x), S = Math.abs(p.x - i) >= y ? i : p.x + w * y, $ = w > 0 ? Math.max(i, Math.min(S, l)) : Math.min(i, Math.max(S, r)), B = { from: i, to: $, begin: f.walk, end: f.aim };
    return i = $, B;
  });
}
function Iw(e, t, n) {
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
const be = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, p0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function g0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const v0 = (e) => e.along * 97 % 1 < be.camera, Gt = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * be.gravity * t * t });
function y0(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * be.gravity * (t.bottom - e.from.y))) / be.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * be.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / be.gravity, on: "top" });
  const r = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let l = e.from;
  for (let u = 0; u < r.t; u += be.step) {
    const d = Math.min(u + be.step, r.t), f = Gt(e, d), p = Pr(l, f, n);
    if (p) return { ...p, t: u + (d - u) * p.share };
    l = f;
  }
  const i = Gt(e, r.t);
  return { ...r, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function k0(e, t, n, a = []) {
  const s = g0(e.along + 1), [o, r] = p0[e.wall], l = Math.atan2(r, o);
  return Array.from({ length: be.count }, () => {
    const i = l + (s() - 0.5) * 2 * (be.spread * Math.PI / 180), u = be.speed[0] + s() * (be.speed[1] - be.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: be.radius[0] + s() * (be.radius[1] - be.radius[0]) };
    return { ...d, ...y0(d, t, a) };
  });
}
function b0(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += be.step) {
      const r = Math.min(o + be.step, s), l = Pr(Gt(a, o), Gt(a, r), n);
      if (l) {
        Object.assign(a, l, { t: o + (r - o) * l.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function w0(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...Gt(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - be.hold) / be.fade, 0), 1);
    if (o <= 0) return [];
    const r = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !r) return [];
    const l = r ? r.left + a.dx : a.x, i = r ? r.top + a.dy : a.y, u = r ? Math.min(s * s * 12, 48, Math.max(0, r.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: l, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function Rw(e, t, n, a) {
  const { fly: s, drops: o, lens: r, frames: l, fps: i } = xe.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * l / i, d = (o[1] - o[0]) * l / i, f = Me(e, [0, u]), p = Me(e, [u, u + d]);
  return r.map((y) => {
    const w = { x: a.x + y.at[0] * t, y: a.y + y.at[1] * t };
    return {
      x: n.x + (w.x - n.x) * f,
      y: n.y + (w.y - n.y) * f,
      r: y.size * t * (0.15 + 0.85 * f * f),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: f >= 1
    };
  });
}
function Lw(e, t, n, a, s) {
  const { sway: o, above: r } = xe.chute, l = { x: t.x, y: t.y - r * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (S) => {
    const [$, B] = [S.x - e.at.x, S.y - e.at.y];
    return { x: l.x + $ * u - B * d, y: l.y + $ * d + B * u };
  }, [p, y] = [...n].sort((S, $) => S.x - $.x), w = e.ends.map(f);
  return { left: l.x - e.at.x, top: l.y - e.at.y, middle: l, turn: i, lines: w.map((S, $) => ({ from: S, to: $ < w.length / 2 ? p : y })) };
}
const Nw = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function Cn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Vt(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Vt(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Dw(e, t) {
  const n = xe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = Cn(n, t), r = 1 - (1 - n.small) * Me(a, n.shrinks) * (1 - Me(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: a, out: s } = Cn(n, t), o = n.flat * Me(a, n.squashes) * (1 - Me(s, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * Vt(s, ...n.springs)) * (1 - Vt(s, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const Pw = (e) => e === "pack_box";
function jw(e) {
  const { into: t, out: n } = Cn(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function qw(e) {
  const t = xe.rope_swing, { into: n, out: a } = Cn(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const x0 = { after: 3 }, os = 10, $0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, M0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, S0 = { weight: 19 }, jr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, _0 = { every: 120 }, qr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, Fr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, E0 = {
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
}, en = (e, t, n, a) => ({ name: e, kind: t, weight: n, when: a, lifetime: os }), ae = (e, t, n = {}) => en(e, "clip", t, n), sa = (e, t, n = {}) => en(e, "look", t, n), eo = (e, t, n = {}) => en(e, "gaze", t, n), de = (e, t, n = {}, a = {}) => ({ ...en(e, "pick", t, n), ...a }), ge = (e) => en("nothing", "nothing", e, {}), C0 = 120, A0 = 300, oa = (e, t) => ({ ...ae(e, t), cooldown: A0 }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), O0 = () => [ae("joy", 2)], lt = (e, t, n, a, s = {}) => ({ ...ae(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), it = (e) => ({ ...e, cooldown: $0[e.name] }), Nt = (e) => ({ ...e, shenanigan: !0, lasts: M0[e.name] }), Pn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...re("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ae("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...re("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...it(ae("bug_shot", 3)), toward: "", onto: !1 },
    { ...it(ae("bug_smash", 2)), toward: "", onto: !1 },
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
  ...re("reported", { cooldown: 90 }, [eo("read", 3), ae("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [eo("read", 3), ge(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ae("file_card", 3), ae("nod", 1), ge(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ae("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, O0()),
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
  ...re("answered", { cooldown: 15 }, [sa("amused", 3), ge(2)]),
  ...re("heard", { cooldown: 30 }, [
    ae("bow", 1, { voices: ["butler"] }),
    ae("salute", 1, { voices: ["squire"] }),
    ae("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ae("stumble", 3), ge(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ae("glance", 7), ge(13)]),
  ...re("typing", { cooldown: 60 }, [sa("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(E0).flatMap(([e, t]) => re(`reacted:${e}`, {}, [sa(t, 1)])),
  ...Object.entries(qr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ae(a, 1, { voices: [e] })])[0])),
  ...Object.entries(Fr).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ae(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...re("pastime", {}, [
    lt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    lt("rest", 3, 180, 120),
    lt("yawn", 2, 60, 60),
    lt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    lt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    lt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    lt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Nt(it(ae("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Nt(it(ae("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...re("held:search", { cooldown: C0 }, [oa("search", 3), { ...oa("binoculars", 2), when: { home: !0 } }, { ...oa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...re("held:type", {}, [ae("type", 3), ae("type_ponder", 1)]),
  ...re("held:compacting", {}, [ae("pack_box", 3), ae("vacuum", 2), ae("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...re("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...re("tickled", {}, [{ ...it(ae("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...re("eager", {}, [ae("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...re("jump", {}, [Nt(it(ae("backflip", 7, { high: !0 }))), ae("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: jr.build.cooldown }, [de("unit", S0.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ae("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: _0.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    Nt(de("bubble", 15, {}, { stay: [30, 80] })),
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
    Nt(it(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], Wr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Hr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), T0 = (e) => Array.isArray(e) ? e[0] : e, B0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, I0 = (e) => Pn.some((t) => t.when.moment === e);
function R0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Hr(d).every(([f, p]) => n(f) >= T0(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Pn.filter((d) => Wr(d.when, e) && (d.kind !== "clip" || t(d.name)) && a(d) && s(d)), l = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= x0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = l.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.kind !== "nothing") ? i : l;
}
function De(e, t) {
  const n = R0(e);
  let a = t() * n.reduce((o, r) => o + r.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.kind === "nothing" ? null : (Ur(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Ur(e, t, n) {
  var a;
  for (const [s, o] of Hr(t)) (a = e.memory) == null || a.set(s, e.now + B0(o, n));
}
function Fw(e, t, n) {
  Ur(e, Pn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const Ww = (e) => Object.values(jr).find((t) => Wr(t.when, e)) ?? null, L0 = (e, t, n) => n - t <= (e.lifetime ?? os), Hw = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Dr(e.clip, t));
class zr {
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
const Da = {
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
}, Uw = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Vr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), zw = {
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
}, Vw = 120, N0 = 20, Gw = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < N0), D0 = (e) => Da[e] || Da.idle, Kw = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Gr = "airborne", P0 = "landing", j0 = "travelling", Kr = "grounded", Yw = ({ airborne: e, landing: t, trip: n }) => e ? Gr : t ? P0 : n != null && n.started ? j0 : Kr;
function Zw(e, t) {
  var s;
  const n = q0(e, t);
  return e.mode === Kr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function q0(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: r, place: l, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: p = null } = e;
  if (n === Gr && l.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? l.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...F0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (l.posture === "hang") return { clip: `hang_${l.grip}`, facing: l.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (l.view && u === "asking") return { clip: "point", facing: 0 };
  const y = p !== null && l.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: y ? p : e.composeFacing ?? 0 } : { clip: t(d, l.posture) ? d : D0(u), facing: y ? p : l.posture === "sit" ? l.face : f };
}
function F0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Pa = (e) => e.outcome, W0 = "plugin:code-commandments:sins:", to = (e) => e.type === "plugins.card" && e.markKey.startsWith(W0), H0 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => to(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => to(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], Jw = (e, t) => e.filter((n) => n.author === "user" && _n(n.read_at) > t).map((n) => ({ beat: "read_message", time: _n(n.read_at), card: dr(n) })).sort((n, a) => n.time - a.time), no = { user: "reacted", agent: "agent_reacted" };
function Xw(e, t) {
  return e.filter((n) => no[n.author] && mt(n) > t).map((n) => ({ beat: `${no[n.author]}:${n.emoji}`, time: mt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const U0 = [.../* @__PURE__ */ new Set([...Object.values(qr).flatMap((e) => Object.keys(e)), ...Object.keys(Fr)])];
function Qw(e, t) {
  return e.filter((n) => n.author === "agent" && mt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = U0.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: mt(n), card: dr(n) })).sort((n, a) => n.time - a.time);
}
const z0 = (e) => new zr(e).isTest(), An = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Pa(e)] || "";
}, V0 = 1800, G0 = (e, t) => {
  if (An(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && An(n) !== "finished" && Number(e.time) - Number(n.time) <= V0 ? "tests_fixed" : "tests_passed";
};
function e5(e, t, n) {
  var r;
  const a = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(z0), s = a.filter((l) => An(l)), o = s.filter((l) => t.get(l.key) === "" || !t.has(l.key) && Number(l.time) > n);
  return a.forEach((l) => t.set(l.key, An(l))), o.map((l) => ({ beat: G0(l, s), time: Number(l.time), card: l.key }));
}
function t5(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Pa(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Pa(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const n5 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: mt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function a5(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function s5(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function o5(e, t) {
  var o, r;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((l) => l.time > t).map((l) => {
    var i;
    return { beat: (i = H0.find((u) => u.matches(l))) == null ? void 0 : i.beat, time: l.time, card: l.key };
  }).filter((l) => l.beat), s = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((l, i) => l.time - i.time);
}
function rs(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const ao = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function K0(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const l = (s + o) / 2;
    rs(e, t, l, a).pitch > n ? s = l : o = l;
  }
  return (s + o) / 2;
}
function r5(e, t, n, a = {}) {
  const s = De({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : I0(`held:${e}`) ? "idle" : e;
}
const Ee = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function l5(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ee.ahead * n ? 180 : Math.sign(a) * Ee.turn;
}
const so = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function i5(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ee.sweep) % s, l = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = so((l - i) / Ee.returnSeconds), d = l <= i ? so(l / i) : 1 - u, f = r + ((r + 1) % s - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const oo = 3, Yr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, ro = 12, c5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function u5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Yr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= oo ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * ro) / ro, lasts: oo } };
}
const d5 = (e) => e.posture === "hang" && !Yr(e.face), Y0 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Z0 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function f5(e, t, n) {
  return Y0.has(e) ? 1 / 0 : !Z0.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Zr(n - t.began, t.share) - ze.lead, 0);
}
const J0 = 5;
function h5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= J0 ? { beat: "long_walk", time: n } : null };
}
const X0 = 30, fn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function m5(e, t, n, a, s = null) {
  if (t && n < t.until || !fn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = De({ moment: "spell", state: e, tally: s }, a), [r, l] = fn.seconds;
  return o ? { state: o.name, began: n, until: n + r + a() * (l - r), next: n + fn.every } : { state: e, began: 0, until: 0, next: n + fn.every };
}
const p5 = (e, t, n) => t && n < t.until && Vr.has(e.state) ? { state: t.state, since: t.began } : e, ze = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Zr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function g5(e, t, n, a) {
  var l;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, r = Zr(o, e.share);
  return s ? { eager: Q0(t, r), moment: null } : r > ze.lead ? { eager: t, moment: null } : r < ze.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > ze.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < ze.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((l = De({ moment: "eager", slow: !0 }, n)) == null ? void 0 : l.name) === "eager" }, moment: null };
}
function Q0(e, t) {
  return e.on && t > ze.lead + ze.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= ze.lead && t >= ze.least ? { ...e, on: !0, calm: !1 } : e;
}
const ev = 1, tv = { look: "look", gaze: "gaze" };
function nv(e, t, n, a, s = "", o = () => !0, r = null) {
  const l = De({ moment: e, voice: s, has: o, memory: t, now: n, tally: r }, a);
  return l ? { [tv[l.kind] ?? "clip"]: l.name, toward: l.toward ?? "", onto: !!l.onto, holds: !!l.holds, lifetime: l.lifetime } : null;
}
const av = (e, t, n, a, s, o = "", r = () => !0, l = null, i = "") => De({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: a, tally: l, ball: i }, s), sv = (e, t, n, a, s, o = 0) => De({ moment: "jump", high: e > ev * t, memory: a, now: s, room: o }, n).name === "backflip", ov = { work: ["building"], idle: ["standing"] };
function v5(e, t, n, a) {
  const s = Da[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(ov[s] ?? []).map((r) => ({ beat: r, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), Vr.has(e) ? { moments: o, began: n || a } : (n && a - n >= X0 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function rv(e, t, n) {
  return !De({ moment: "pondering", memory: e, now: t }, n) || !De({ moment: "thought_cloud", memory: e, now: t }, n) ? null : De({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const lo = { pondering: rv };
function y5(e, t, n, a, s, o) {
  if (lo[e.beat]) {
    const l = lo[e.beat](n.reacted, a, s);
    return l && o(l) ? { beat: { clip: l, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = nv(e.beat, n.reacted, a, s, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== os && { lifetime: r.lifetime } } } : null;
}
function k5(e, t, n, a, s, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = av(e.room ?? 0, t.lasted, n, a, s, e.voice, o, r, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const b5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function w5(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function x5(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const $5 = (e, t) => !!(e != null && e.watches) && !t.once, M5 = 10, S5 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || L0(a, a.queuedAt, n)), _5 = (e, t) => t ? null : e[0] ?? null;
function E5(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const C5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), lv = 2 * Math.PI, iv = 500;
function A5(e, t, n, a, s = null, o = 1) {
  const r = a - (e.at || a), l = r / iv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + l, d) : Math.max(e.amount - l, d), p = lv * r / 1e3, y = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, S = (u ? y : t != null && t.behind && t.mood === "reading" ? { ...t } : t && y && !i ? s && !t.behind && !y.behind ? uv(y, t, n, p, s) : fv(y, t, n, p) : t) ?? y, $ = S != null && S.behind && S.mood === "reading" ? cv(e.point, S, n, r, s) : S;
  return { point: $ ?? null, toward: $ ? { x: $.x - n.x, y: $.y - n.y } : null, amount: f, at: a };
}
function cv(e, t, n, a, s) {
  const o = (v) => v * 180 / Math.PI, r = (v) => o(Math.atan2(Math.sin(v * Math.PI / 180), Math.cos(v * Math.PI / 180))), l = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -i)) - l), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - l), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = f ? r(e.readingFacing - l) : 0, y = f ? e.readingYaw + p : d, w = y + r(u - y), S = Math.min(Math.max(a / 1e3, 0), 0.1), $ = Ee.turnSpeed * S, B = f ? y + Math.min(Math.max(w - y, -$), $) : w, U = f ? e.readingFollow + p : B, ee = U + (B - U) * (1 - Math.exp(-S / Ee.followSeconds)), P = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, x = o(rs(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), C = Math.min(Math.max(x, -P.up), P.down), M = Ee.tipSpeed * S, _ = f ? e.readingPitch + Math.min(Math.max(C - e.readingPitch, -M), M) : C;
  return { ...t, readingYaw: B, readingFollow: ee, readingPitch: _, readingFacing: l };
}
function uv(e, t, n, a, { depth: s, above: o, tip: r }) {
  const l = (U) => {
    const { yaw: ee, pitch: P } = rs(U.x - n.x, s, n.y - U.y, o);
    return { yaw: ee, pitch: Math.min(Math.max(P, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [i, u] = [ao(l(e)), ao(l(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [p, y] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [w, S, $] = i.map((U, ee) => p * U + y * u[ee]), B = s * w / S;
  return { ...t, x: n.x + B, y: n.y - K0(B, s, -Math.asin(Math.min(Math.max($, -1), 1)), o) };
}
const dv = 0.15;
function O5(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= dv;
}
function fv(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - s), Math.cos(o - s)), l = s + Math.max(-a, Math.min(a, r)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(l), y: n.y + i * Math.sin(l) };
}
const hv = (e) => !(e != null && e.on);
function T5(e, t, n) {
  if (hv(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, r) => r.findIndex((l) => l.beat === s.beat && l.card === s.card) === o);
  return { answer: [], held: a };
}
const Kt = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, We = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ra = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), io = (e) => e * e * (3 - 2 * e);
function mv(e) {
  if (e < 0 || e >= We.seconds) return null;
  const t = ra(e, ...We.flicker), n = Math.floor(t * We.flickers * 2) % 2 === 0, a = e < We.flicker[1] ? n ? 0.35 + 0.5 * t : We.dim : 1;
  return { strength: 1 - io(ra(e, ...We.fade)), lit: a, white: e < We.flash[0] ? 0 : 1 - io(ra(e, ...We.flash)) };
}
const B5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function I5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = mv(t - e.at);
  return a && { colour: Kt.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: We.signs[e.tone], ...a } };
}
function R5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function L5(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= Kt.looks || a === null && n - e.since >= Kt.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function N5(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (l) => (l + a * 12) % 12, o = (l) => 0.5 - 0.5 * Math.max(-1, Math.min(s(l) - 3, 9 - s(l), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const Qe = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, D5 = { behind: 39, figure: 40, ahead: 41 }, pv = "[data-figure-pile]", gv = { amber: [1, 0.69, 0.125], good: Kt.colours.good, bad: Kt.colours.bad }, bn = { phases: 4, ms: 230, dim: 0.25 }, P5 = (e, t, n) => e !== "amber" || (t + n) % bn.phases < bn.phases / 2 ? 1 : bn.dim, j5 = (e) => e === "amber" ? bn.phases : 1;
function q5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const F5 = Object.keys(gv), Pe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Pt = ([e, t], n) => e + n() * (t - e);
function W5(e) {
  const t = Pe.least + Math.floor(e() * (Pe.most - Pe.least + 1));
  return Array.from({ length: Math.min(t, Pe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Pe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Pt(Pe.start, e), r = Pt(Pe.reach, e);
    return {
      text: De({ moment: "digit" }, e).name,
      x: a * o,
      y: Pe.middle + s * o,
      dx: a * r,
      dy: s * r,
      moveMs: Math.round(Pt(Pe.moveMs, e)),
      fadeMs: Math.round(Pt(Pe.fadeMs, e))
    };
  });
}
const la = { high: 3, gap: 1 };
function H5(e) {
  const t = Math.floor(e / la.high);
  return { left: -(Qe.inside + Qe.width / 2 + t * (Qe.width + la.gap)), up: e % la.high * (Qe.height - Qe.top) };
}
const vv = (e, t, n) => De({ moment: "unit", memory: e, now: t }, n) !== null, yv = { after: 5 }, kv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new zr(t).isBuild());
function U5(e, t, n) {
  const a = kv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= yv.after ? s : null;
}
function z5(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: vv(n, a, s) } : null;
}
const co = { ahead: 140, up: 70 };
function V5(e, t, n, a, s) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * co.ahead, y: a - co.up } } : o ? { at: { x: n(o), y: a - o.up - Qe.height } } : t ? { at: null } : null;
}
const ia = { least: 4e3, most: 1e4 }, bv = (e) => ia.least + e() * (ia.most - ia.least), ct = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function G5(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = bv(t);
    if (n.length >= ct.most || t() >= ct.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (ct.at[0] + t() * (ct.at[1] - ct.at[0]));
    n.push({ from: o, to: o + ct.ms }), a = o + ct.ms;
  }
}
const K5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Y5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Jr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Z5 = new Set(Pn.filter((e) => Jr.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), wv = (e) => e.some((t) => t.state === "built"), J5 = (e, t) => wv(t) ? e.filter((n) => !Jr.has(n.beat)) : e, nt = { reach: 40, room: 6 }, xv = (e, t) => t <= e - nt.reach + 2, X5 = (e, t, n) => xv(e, n) ? t - nt.reach : e - nt.reach - nt.room, Q5 = (e, t, n, a) => a > 0 && t < e && t + nt.reach >= e - 2 ? Math.min(n, Math.max(e, t + nt.reach)) : e, ca = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, e4 = (e) => Pt(e() < ca.longShare ? ca.long : ca.short, e), $v = 2 * Qe.width;
function t4(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= $v ? o : e + (o - e + s / 2) % s;
}
const Mv = 60, n4 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= Mv, uo = "[data-figure-home]", tn = () => {
  var t;
  const e = document.querySelector(uo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(uo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, Sv = "[data-figure-docked-bars]", _v = "[data-figure-chat-foot]", Ev = [0.85, 0.6, 0.35, 0.15], Cv = ["question", "waiting", "suggestion"], a4 = (e, t) => Cv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function s4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Av = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Ov = "[data-figure-newest]";
function Xr() {
  var a, s;
  const e = (a = tn()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Ov), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, l;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((l = o.getAttribute) == null ? void 0 : l.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !ls(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function Yt(e, t, n = Xr()) {
  if (!e || !n) return !0;
  const a = Ze(e, t), s = qn(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, r = dt.gap;
  return !jn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function o4(e, t, n, a = Xr()) {
  if (!a || Yt(t, e, a)) return null;
  const s = qn(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, r = (Math.max(s.right, 0.73) - 0.5) * e.size, l = kt(), i = t.posture === "stand" ? cs * e.size : rl * e.size, u = Math.max(n.left + i, l.left + o), d = Math.min(n.right - i, l.right - r);
  return [a.left - dt.gap - r, a.right + dt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= u && p.x <= d && Yt(p, e, a) && oy(p, e)).sort((p, y) => Math.abs(p.x - t.x) - Math.abs(y.x - t.x))[0] ?? null;
}
const ua = 0.26, Qr = 0.54, Tv = 1.25 / 5.4, nn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ua, travels: "stand" },
  lounge: { drop: ua, travels: "stand" },
  composed: { drop: ua, travels: "stand" },
  hang: { drop: Qr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, r4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Tv * Math.cos(t * Math.PI / 180),
  y: 1 - n - Qr
}), qt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Bv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), l4 = (e, t) => (e === "sit" ? Bv.has(t) : qt.has(e)) ? e : "stand";
function i4(e, t) {
  return e.facing === t.facing || !qt.has(e.posture) && !qt.has(t.posture) ? t : { posture: "stand", facing: qt.has(e.posture) ? e.facing : t.facing };
}
const c4 = 0.25, u4 = (e, t) => qt.has(e) && nn[t].drop === 0, el = 2, Iv = 90, Rv = 180, Lv = 140, Nv = 280, Dv = 420, Pv = 0.25, jv = 290, qv = 600, Fv = "cubic-bezier(0.2, 0.7, 0.4, 1)", Wv = "cubic-bezier(0.55, 0, 0.9, 0.6)", da = 5;
function On(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: r = !1, sprinting: l = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < da) return null;
  (r || l) && (o = Math.max(o, el));
  const y = o > 1, w = Math.abs(t.x - e.x), S = w < da ? 0 : w / (Iv * o) * 1e3, $ = Math.min(S, y ? Lv : Rv), B = Math.abs(t.y - e.y), U = t.y < e.y, ee = U && !p && sv(B, n, i, u, d, f), P = U ? Dv + Math.min(B, 400) * Pv : Math.sqrt(2 * B / ss) * 1e3, x = {
    x: t.x,
    y: t.y,
    ms: B > da ? ee ? qv : P : 0,
    lead: ee ? jv : U ? Nv : 0,
    easing: U ? Fv : Wv,
    hopping: !0,
    clip: ee ? "backflip" : U ? "jump" : "fall"
  }, C = { x: t.x, y: t.y, ms: S + $, lead: 0, easing: "linear", ramp: $, ...y ? { clip: "run" } : {} }, M = p ? Hv(t, n) : x, _ = U && !a ? [{ ...C, y: e.y }, M] : [{ ...x, x: e.x }, C];
  return { way: Math.sign(t.x - e.x) || 1, legs: _, lands: !s, pace: o, running: y };
}
const Hv = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Uv = (e, t) => e.postures.includes(t) ? t : e.postures[0], d4 = (e, t, n) => e.posture === "walk" && n ? "walk" : Uv(e.clip, t), Ze = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - nn[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, jn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, ls = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function kt() {
  var t;
  const e = (t = tn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const hn = 0.5, fo = 20;
function f4(e, t, n = kt()) {
  const a = Ze(e, t);
  return a.left >= n.left + fo && a.right <= n.right - fo;
}
function is(e, t, n = kt()) {
  const a = Ze(e, t), s = a.right - a.left, o = qn(e), [r, l] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return r >= n.left - hn && l <= n.right + hn && a.top >= n.top - hn && i <= n.bottom + hn;
}
const Tn = [0.35, 0.5, 0.65], Bn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: Tn[0], right: Tn.at(-1), top: Bn[0], bottom: Bn.at(-1) }, zv = 0.24;
function qn(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + zv * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function Vv(e, { size: t }, n = kt()) {
  const a = qn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const cs = (_e.right - _e.left) / 2 + 0.08;
function h4(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - nn[e].drop) };
}
const Gv = "[data-figure-agent]";
function tl(e, t, n = "", a = "") {
  var l;
  const s = (l = document.caretRangeFromPoint) == null ? void 0 : l.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !ls(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, r = Math.min(s.startOffset, o.length - 1);
  for (const i of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const nl = (e) => Bn.flatMap(
  (t) => Tn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function us(e, t, n = "") {
  if (!Yt(e, t)) return Tn.length * Bn.length;
  const a = Ze(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Av)].map((l) => ({ control: l, rect: l.getBoundingClientRect() })).filter(({ control: l, rect: i }) => i.width && i.height && jn(s, i) && ls(l)).map(({ rect: l }) => l), r = (l, i) => o.some((u) => l >= u.left && l <= u.right && i >= u.top && i <= u.bottom);
  return nl(s).filter(([l, i]) => r(l, i) || tl(l, i, n)).length;
}
function Kv(e, t) {
  const n = Ze(e, t);
  return nl({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => tl(a, s, "", Gv)).length;
}
const ho = 4;
function m4(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = ho; o <= s; o += ho)
    for (const r of [t.x - o, t.x + o]) {
      if (r - a < n.left || r + a > n.right) continue;
      const l = { ...t, x: r };
      if (!Kv(l, e) && Yt(l, e)) return l;
    }
  return null;
}
function Zt(e, t, n) {
  const a = kt(), s = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => is(r, t, a) && Yt(r, t)).map((r) => ({ spot: r, covered: us(r, t), away: s(r) }));
  return o.length ? o.reduce(
    (r, l) => l.covered < r.covered || l.covered === r.covered && l.away < r.away ? l : r
  ).spot : null;
}
const al = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Yv = [0.5, 0.25, 0.75], Zv = (e) => al(e.getBoundingClientRect(), Yv), sl = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Jv = cs, Xv = (e, t, { size: n }, a = Jv) => ol(e, sl[t], a * n, "stand");
function ol(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Qv = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, rl = 0.1, ey = (e, t, { size: n }) => ol(e, Qv[t], rl * n, "sit"), ty = (e) => ((e + 180) % 360 + 360) % 360 - 180, fa = 60;
function p4(e, t) {
  const n = ty(t);
  return !e.aside || Math.abs(n) >= fa ? t : n < 0 ? 360 - fa : fa;
}
const Ft = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, ny = (e) => [.../* @__PURE__ */ new Set([e, ...Ft.turns.map((t) => (t + 360) % 360)])];
function g4(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = ny(t), r = Ft.every[0] + a() * (Ft.every[1] - Ft.every[0]);
  return { face: t, from: s ? ay(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + r };
}
function ay(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Ft.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function v4(e, t) {
  const { element: n, edge: a } = Fn(), s = ["left", "right"].map((l) => an(ey(a, l, e), e)).filter((l) => n && is(l, e) && !us(l, e)), o = (l) => t ? Math.abs(l.x - t.x) : 0, r = s.sort((l, i) => o(l) - o(i))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function y4(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - ll } : e;
}
const ll = 7;
function il() {
  const e = [...document.querySelectorAll(pv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function sy(e, t) {
  const n = Ze(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function oy(e, t) {
  const n = il();
  return !n || !jn(sy(e, t), n);
}
const ry = 4;
function Fn() {
  const e = sn(), t = il(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > ry || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - ll - n, 0) } };
}
const k4 = ({ size: e, below: t }) => (1 - t) * e;
function an(e, t) {
  const n = kt(), { size: a, below: s } = t, o = nn[e.posture].drop * a;
  return { ...Vv(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ja = (e, t) => Object.keys(sl).map((n) => an(Xv(e, n, t), t)), ds = (e, t) => al(e, Ev).map((n) => an(n, t)), cl = (e, t, n) => Zt(e, t, n) ?? e[0];
function b4(e, t) {
  const { element: n, edge: a } = Fn();
  return { ...cl(ja(a, e), e, t), view: null, on: n };
}
function w4(e, t, n, a) {
  const { element: s, edge: o } = Fn(), r = (a ? ja(o, t) : [...ja(o, t), ...ds(o, t)]).filter(
    (u) => !jn(Ze(u, t), e)
  ), l = Zt(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = l && !us(l, t) ? l : Zt(r, t, n);
  return i && { ...i, view: null, on: s };
}
function sn() {
  var a;
  const e = tn(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(Sv);
  if (!t) return { ...Wn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const mo = { within: 2 };
function x4(e) {
  const { element: t, docked: n, edge: a } = sn();
  if (!n || e.on !== t) return !0;
  const s = Wn().edge;
  return a.left > s.left + mo.within || a.left + a.width < s.left + s.width - mo.within;
}
const ly = "[data-figure-closing]";
function $4() {
  var n;
  const { element: e, docked: t } = sn();
  return t && !!((n = e.firstElementChild) != null && n.matches(ly));
}
const ul = "[data-figure-progress]";
function M4(e) {
  const t = e.querySelector(ul);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function S4(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, r) => s(r) < s(o) ? r : o) : null;
}
const iy = { across: 300, above: 380, below: 60 };
function _4(e) {
  const { across: t, above: n, below: a } = iy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: cy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const cy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), dl = "[data-figure-bar]", qa = { back: 144, along: 0.4 };
function E4(e) {
  const { element: t, docked: n, edge: a } = sn(), s = n ? t.querySelector(dl) : null;
  if (!(s != null && s.querySelector(ul))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...an({ x: o - qa.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function C4(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < qa.along * a.size ? t.x + qa.along * a.size : e.x, y: e.y, behind: !0 };
}
function A4(e) {
  const t = e.querySelector(dl), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Wn() {
  const e = tn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function O4(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: l } = Wn(), i = n === null ? uy(l, e, o === null ? t : { x: o, y: l.top }, a, s) : an({ x: n, y: l.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: r, stays: !0 };
}
function uy(e, t, n, a, s) {
  const o = ds(e, t), r = Math.min(...o.map((i) => i.x)), l = o.filter((i) => i.x + a + Qe.width < s && i.x + a - nt.reach - nt.room >= r);
  return Zt(l.length ? l : o, t, n);
}
const dy = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function T4(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: r = !1, random: l = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  (o || r) && (s = Math.max(s, el));
  const y = (ee) => {
    const P = Ze(ee, n, nn[ee.posture].travels);
    return { x: P.left, y: P.top };
  }, w = t.ladder ?? e.ladder;
  if (w && !(t.ladder && e.ladder)) return fy(y(e), y(t), y({ ...w.foot, posture: "stand" }), w.way, !!t.ladder, n, s);
  const [S, ...$] = [e, ...i, t].map(y), B = On(S, $[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: r, random: l, memory: u, now: d, room: f, pogo: p }), U = $.slice(1).map((ee, P) => {
    var x;
    return (x = On($[P], ee, n.size, { random: l, memory: u, now: d, room: f })) == null ? void 0 : x.legs.find((C) => C.hopping);
  });
  return B && { ...B, legs: [...B.legs, ...U.filter(Boolean)] };
}
function fy(e, t, n, a, s, o, r) {
  const l = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / dy.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? On(e, n, o.size, { pace: r }) : On(n, t, o.size, { pace: r }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], l(n, t)] : [l(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function B4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function I4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && Zt(Zv(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Fn();
  return { ...cl(ds(s, t), t, n), view: null, on: a };
}
const hy = "[data-figure-bubble]", my = 250;
let Wt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), fl = 0;
const Rt = () => Wt, ha = /* @__PURE__ */ new WeakMap();
let py = 0;
function fs(e) {
  return ha.has(e) || ha.set(e, `floor-${++py}`), ha.get(e);
}
const gy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, vy = () => {
  var e, t;
  return ((t = (e = tn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function yy(e, t) {
  var a;
  const n = (a = e.querySelector(_v)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function ky(e, t) {
  const n = e && yy(e, t), a = e ? [...e.querySelectorAll(hy)].map((o) => ({ element: o, kind: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...a, ...s].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || gy(r, n))).map(({ element: o, kind: r, box: l }) => ({ id: fs(o), kind: r, element: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom }));
}
const by = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= my ? (t.top - a.top) / s * 1e3 : 0;
};
function hl(e = Wt, t = performance.now()) {
  const n = kt(), a = vy(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: l } = sn(), i = [];
  o && i.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: l.left, right: l.left + l.width, top: l.top });
  const u = Wn();
  return u.element && i.push({ id: fs(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...ky(a, s)), i.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: by(e, d, t) }))) });
}
const Fa = /* @__PURE__ */ new Set();
function wy(e) {
  return Fa.add(e), () => Fa.delete(e);
}
function xy() {
  ml();
  const e = () => {
    fl = requestAnimationFrame(e), !document.hidden && (Wt = hl(Wt), Fa.forEach((t) => t(Wt)));
  };
  e();
}
function ml() {
  cancelAnimationFrame(fl);
}
const hs = 5, $y = 56, My = { share: 0.6 }, Sy = (e) => -Math.sqrt(2 * ss * My.share * e), At = (e, t) => e.find((n) => n.id === t) ?? null;
function R4(e, t = hl().floors) {
  const n = At(t, "home"), a = (n == null ? void 0 : n.kind) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : fs(e.on) : null, o = s && At(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function pl({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: r }, l, i = Rt().floors) {
  const u = At(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (r || _y(u, d, o)) && Ey(d, l, i) ? { x: d.x, y: d.y } : null;
}
const ms = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, _y = (e, t, n) => !ms({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function L4(e, t = Rt().floors) {
  if (!ms(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= hs && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Ey(e, t, n = Rt().floors) {
  const a = At(n, "home");
  return e.posture === "hang" && a && Ze(e, t).bottom >= a.top ? !1 : is(e, t);
}
function N4(e, t, n, a = Rt().floors) {
  const s = pl(e, n, a);
  if (!e.home) return Cy(e, t, s, a);
  if (!s) return null;
  const o = At(a, "home"), r = s.y - t.y, l = r > hs ? "dropping" : -r > $y ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: l };
}
function Cy(e, t, n, a) {
  const s = n ? At(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Sy(e.risen) };
  if (!n) return null;
  if (ms(t) && n.y - t.y > hs) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function D4(e, t, n) {
  const a = cs * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function P4(e, t, n, a = Rt().floors) {
  const s = t && pl(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Ay = ["data-kind"], Oy = { class: "figure-floor-name" }, Ty = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Oy, b(e.floor.kind), 1)
    ], 12, Ay));
  }
}, By = /* @__PURE__ */ Y(Ty, [["__scopeId", "data-v-8f6132da"]]), Iy = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Ry = {
  __name: "FigureFloors",
  setup(e) {
    const t = Ue(Rt().floors);
    let n = () => {
    };
    return Te(() => {
      n = wy((a) => t.value = a.floors), xy();
    }), Ae(() => {
      n(), ml();
    }), (a, s) => (c(), h("div", Iy, [
      (c(!0), h(G, null, te(t.value, (o) => (c(), V(By, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, j4 = /* @__PURE__ */ Y(Ry, [["__scopeId", "data-v-e519168b"]]), ma = (e) => typeof e == "number" ? e : Date.parse(e);
function q4(e, t) {
  const n = (s, o) => ({ kind: s, id: `${s}:${o.id}`, row: o, time: ma(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => ma(s.row.created_at) - ma(o.row.created_at) || (s.kind === o.kind ? s.row.id - o.row.id : s.kind === "message" ? -1 : 1));
}
const Ly = 3, pa = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Ny(e, t) {
  var a;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = pa[n.grouping]) == null ? void 0 : a.call(pa, e.row, n)) || "";
}
function Dy(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function F4(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Ly ? [Dy(a, t)] : a), a = [];
  };
  for (const r of e) {
    const l = Ny(r, t);
    l !== s && o(), s = l, l ? a.push(r) : n.push(r);
  }
  return o(), n;
}
const Py = 1e3;
function jy() {
  const e = T(Date.now()), t = setInterval(() => e.value = Date.now(), Py);
  return Tt(() => clearInterval(t)), e;
}
const qy = ["datetime", "title"], Hn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = jy(), a = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, b(H(br)(e.at, H(n))), 9, qy));
  }
};
function W4(e) {
  const t = vt(), n = t.option("row"), a = T(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), he(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Fy(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const H4 = (e) => (t) => t.filter((n) => n.id !== e), U4 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), z4 = (e) => (t) => [...t, e], V4 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function G4(e) {
  const t = vt(), n = T(null), a = T("");
  async function s(...o) {
    const r = await t.read(e(...o));
    a.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: a, load: s };
}
function K4(e) {
  const t = vt(), n = T("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const mn = /* @__PURE__ */ new Map();
function Wy(e, t) {
  if (mn.has(e)) return mn.get(e);
  const n = t().finally(() => mn.delete(e));
  return mn.set(e, n), n;
}
function Y4() {
  const e = vt(), t = T(null), n = T("");
  async function a() {
    const s = await Wy(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const Hy = { class: "cards-page" }, Uy = { class: "cards-bar" }, zy = { class: "cards-count" }, Vy = { class: "cards" }, Gy = {
  key: 1,
  class: "cards-note"
}, Ky = {
  key: 2,
  class: "cards-note"
}, Yy = ["data-row", "onClick"], Zy = { class: "card-head" }, Jy = { class: "card-title" }, Xy = { class: "card-foot" }, Qy = {
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
    return (a, s) => (c(), h("div", Hy, [
      g("div", Uy, [
        g("span", zy, b(e.rows.length) + " " + b(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        I(ue, Ke({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: N(() => [
            I(me, {
              name: "plus",
              size: 12
            }),
            ne(" New " + b(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Vy, [
        e.loaded ? e.failure ? (c(), h("p", Gy, b(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), h("p", Ky, "No " + b(e.noun) + "s yet", 1)) : (c(), V(gt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(G, null, te(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          g("span", Zy, [
            I(me, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ne(" " + b(e.head(o)), 1),
            I(Hn, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Jy, b(e.title(o)), 1),
          g("span", Xy, b(e.foot(o)), 1)
        ], 8, Yy))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Z4 = /* @__PURE__ */ Y(Qy, [["__scopeId", "data-v-990e6b37"]]), po = "newest";
function J4(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = T(""), o = T(po), r = T("all"), l = R(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((p) => Fy(p, d, a == null ? void 0 : a.fields) && (r.value === "all" || !n || n(p) === (r.value === "open")));
    return o.value === po ? f : [...f].sort((p, y) => t(p).localeCompare(t(y)));
  }), i = R(() => !!s.value.trim() || !!n && r.value !== "all");
  return { words: s, order: o, state: r, shown: l, filtering: i, hasStates: !!n };
}
const ek = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, tk = 40, nk = "top", ak = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = R(() => a === nk), o = T(null), r = T(!1), l = (p) => s.value ? p.scrollTop : p.scrollHeight - p.scrollTop - p.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      r.value = l(o.value) >= tk;
    }
    return he(() => n.rowCount, async () => {
      await st(), !r.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (p, y) => (c(), h("div", ek, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(p.$slots, "default", {}, void 0, !0)
      ], 34),
      I(Ot, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: N(() => [
          Ye(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            I(me, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            y[0] || (y[0] = ne(" Newest ", -1))
          ], 512), [
            [$o, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, X4 = /* @__PURE__ */ Y(ak, [["__scopeId", "data-v-3accb764"]]), sk = ["aria-selected", "data-tab", "onClick"], ok = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, rk = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var f;
    const n = e, a = t, s = ((f = $e(Se, null)) == null ? void 0 : f.tabs) ?? [], o = T(null), r = T({ left: 0, width: 0, slides: !1 }), l = (p) => n.answer[p.count_field] !== void 0;
    function i(p) {
      var w;
      const y = (w = o.value) == null ? void 0 : w.querySelector(".inner-tab.on");
      if (!y) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: y.offsetLeft, width: y.offsetWidth, slides: p }, o.value.scrollWidth > o.value.clientWidth && (o.value.scrollLeft = Math.max(0, y.offsetLeft - 12));
    }
    const u = () => st(() => i(!0));
    let d = null;
    return Te(() => {
      var p;
      i(!1), d = new ResizeObserver(() => i(!1)), d.observe(o.value), (p = document.fonts) == null || p.ready.then(() => i(!1));
    }), Ae(() => d == null ? void 0 : d.disconnect()), he(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, u), he(() => n.answer, u, { deep: !0 }), (p, y) => (c(), h("div", {
      ref_key: "band",
      ref: o,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(G, null, te(H(s), (w) => {
        var S, $;
        return c(), h("button", {
          key: w.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((S = e.active) == null ? void 0 : S.key) === w.key }]),
          "aria-selected": (($ = e.active) == null ? void 0 : $.key) === w.key,
          "data-tab": w.key,
          onClick: (B) => a("choose", w)
        }, [
          ne(b(w.label) + " ", 1),
          l(w) ? (c(), h("span", ok, b(e.answer[w.count_field]), 1)) : A("", !0)
        ], 10, sk);
      }), 128)),
      g("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: fe({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, Q4 = /* @__PURE__ */ Y(rk, [["__scopeId", "data-v-46fc6186"]]), lk = {
  class: "tab-body",
  "data-tab-body": ""
}, ik = { "data-tab-content": "" }, ck = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = T(!1);
    let a = 0;
    return he(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Ka(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", lk, [
      n.value ? (c(), V(gt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : A("", !0),
      Ye(g("div", ik, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [$o, !n.value]
      ])
    ]));
  }
}, ex = /* @__PURE__ */ Y(ck, [["__scopeId", "data-v-63876533"]]), uk = {}, dk = { class: "menu-label" };
function fk(e, t) {
  return c(), h("span", dk, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Wa = /* @__PURE__ */ Y(uk, [["render", fk], ["__scopeId", "data-v-aa955b3e"]]), hk = {
  class: "search-bar",
  "data-search-bar": ""
}, mk = { class: "search-bar-control" }, pk = ["value", "placeholder", "aria-label"], gk = ["aria-expanded"], vk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var B;
    const a = e, s = n, o = Bl(), r = ((B = $e(Se, null)) == null ? void 0 : B.search) ?? {}, l = R(() => r.placeholder || a.placeholder), i = r.context ?? [], u = T(null), d = T(null), f = T([]), p = R(() => f.value.length ? f.value[f.value.length - 1].next : i), y = R(() => !!o.menu || i.length > 0), w = (U) => {
      f.value = [], d.value = d.value ? null : U.currentTarget;
    };
    function S(U) {
      if (U.next.length) {
        f.value = [...f.value, U];
        return;
      }
      d.value = null, s("pick", U.click);
    }
    function $() {
      var U;
      s("update:modelValue", ""), (U = u.value) == null || U.focus();
    }
    return t({ focus: () => {
      var U;
      return (U = u.value) == null ? void 0 : U.focus();
    } }), (U, ee) => {
      var P;
      return c(), h("div", hk, [
        g("div", mk, [
          I(me, {
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
            onInput: ee[0] || (ee[0] = (x) => s("update:modelValue", x.target.value)),
            onKeydown: Ht($, ["esc"])
          }, null, 40, pk),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: $
          }, [
            I(me, {
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
            onClick: w
          }, [
            I(me, {
              name: "caret",
              size: 12
            })
          ], 8, gk)) : A("", !0)
        ]),
        (P = H(r).button) != null && P.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: ee[1] || (ee[1] = (x) => s("pick", H(r).button.click))
        }, b(H(r).button.title), 1)) : A("", !0),
        ce(U.$slots, "default", {}, void 0, !0),
        d.value ? (c(), V(Ln, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: ee[3] || (ee[3] = ke(() => {
          }, ["stop"])),
          onClose: ee[4] || (ee[4] = (x) => d.value = null)
        }, {
          default: N(() => [
            f.value.length ? (c(), V(ht, {
              key: 0,
              "data-search-back": "",
              onClick: ee[2] || (ee[2] = (x) => f.value = f.value.slice(0, -1))
            }, {
              default: N(() => [
                ne("‹ " + b(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), h(G, null, te(p.value, (x) => (c(), V(ht, {
              key: x.title,
              description: x.subtext,
              "data-search-entry": x.title,
              onClick: (C) => S(x)
            }, {
              default: N(() => [
                ne(b(x.title) + b(x.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : ce(U.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, yk = /* @__PURE__ */ Y(vk, [["__scopeId", "data-v-43c4837e"]]), kk = {
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
    return (o, r) => (c(), V(yk, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (l) => e.tools.words.value = l),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (l) => n("pick", l))
    }, {
      menu: N(() => [
        I(Wa, null, {
          default: N(() => [...r[2] || (r[2] = [
            ne("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(G, null, te(a, (l) => I(ht, {
          key: l.key,
          checked: e.tools.order.value === l.key,
          "data-list-order": l.key,
          onClick: (i) => e.tools.order.value = l.key
        }, {
          default: N(() => [
            ne(b(l.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(G, { key: 0 }, [
          I(Wa, null, {
            default: N(() => [...r[3] || (r[3] = [
              ne("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, te(s, (l) => I(ht, {
            key: l.key,
            checked: e.tools.state.value === l.key,
            "data-list-state": l.key,
            onClick: (i) => e.tools.state.value = l.key
          }, {
            default: N(() => [
              ne(b(l.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: N(() => [
        ce(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, tx = /* @__PURE__ */ Y(kk, [["__scopeId", "data-v-dab0064d"]]);
function nx() {
  const e = T(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const ax = (e) => import(
  /* @vite-ignore */
  e
), bk = 86400, Ha = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function wk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ha(t) - Ha(e)) / bk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function sx(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ha(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: s.time, title: wk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const ga = 280, va = 240, ya = 120, xk = 6, $k = 14, Jt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Mk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function gl(e, t) {
  const n = Math.max(0, Mk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function Sk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${$k}px)` }), e.offsetHeight, e.style.transition = `height ${ga}ms ${Jt}`, e.style.height = `${r}px`;
  const l = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = gl(t, e));
    const p = s() - l;
    if (!i && p >= ga && (i = !0, e.style.transition = `opacity ${va}ms ease-out, transform ${va}ms ${Jt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < ga + va) return a(f);
    d();
  };
  return a(f), d;
}
function ox(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${xk}px)` }), e.offsetHeight, e.style.transition = `opacity ${ya}ms ease-out, transform ${ya}ms ${Jt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = s(), l = () => {
    if (n() && (t.scrollTop = gl(t, e)), s() - r < ya) return a(l);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(l);
}
const _k = 140, pn = 220, go = 5;
function rx({ gap: e = _k, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, r = !1;
  function l(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, go);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const p of d)
      p.el.style.display = p.display, l(p, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, p, y = Sk) => {
    if (r || !f.pane || !f.follows()) return p();
    const w = { el: d, options: f, done: p, arrival: y, display: d.style.display || "" };
    if (!s)
      return s = !0, l(w, () => o = t(i, e));
    d.style.display = "none", n.push(w), n.length >= go && u.flush();
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
function lx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${pn}ms ${Jt}, opacity ${pn}ms ease-in, margin ${pn}ms ${Jt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, pn);
}
const vl = "chat.pins.minimised", wn = T($n(vl, !1));
function vo(e) {
  wn.value = e, Xa(vl, e);
}
function Ek(e) {
  const t = R(() => e()), n = R(() => wn.value ? [] : e()), a = () => vo(!wn.value), s = Date.now() / 1e3;
  return he(
    () => t.value.filter((o) => mt(o) > s).length,
    (o, r) => o > r && vo(!1)
  ), { pins: t, visible: n, minimised: wn, toggle: a };
}
const Ck = ["title"], Ak = {
  key: 0,
  class: "pins-count"
}, Ok = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = Ek(() => t.pinRows);
    return (o, r) => H(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: H(a), inline: e.inline }]),
      title: H(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = ke((...l) => H(s) && H(s)(...l), ["stop"]))
    }, [
      I(me, {
        name: H(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      H(a) ? (c(), h("span", Ak, b(H(n).length), 1)) : A("", !0)
    ], 10, Ck)) : A("", !0);
  }
}, ix = /* @__PURE__ */ Y(Ok, [["__scopeId", "data-v-d073c504"]]), Tk = ["title"], Bk = ["title"], Ik = { class: "diff-card-dir" }, Rk = { class: "diff-card-name" }, Lk = ["title"], Nk = ["title"], Dk = {
  key: 0,
  class: "diff-card-note"
}, Pk = ["href"], jk = ["src", "alt"], qk = { class: "diff-card-rows" }, Fk = { class: "diff-row-num" }, Wk = { class: "diff-row-sign" }, Hk = { class: "diff-row-code" }, Uk = {
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
    const n = e, a = t, s = navigator.platform.startsWith("Mac") ? "⌘" : "Ctrl";
    function o(E) {
      (E.metaKey || E.ctrlKey) && (E.stopPropagation(), a("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, l = { add: "+", del: "−" }, i = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, i.value)), d = R(() => n.path.slice(i.value)), f = R(() => n.kind === "deleted"), p = R(() => r[n.kind]), y = R(() => new Set(n.rows.filter((E) => E.line_type === "add").map((E) => E.line))), w = T("after"), S = R(() => w.value === "before" ? n.whole.old : n.whole.text), $ = R(() => n.whole && n.whole.text !== void 0 ? S.value.split(`
`).map((E, k) => ({ line_type: w.value === "after" && y.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: E })) : n.rows.filter(
      (E) => !(n.editsOnly && ["ctx", "fold"].includes(E.line_type)) && !(n.hideRemovals && E.line_type === "del")
    )), B = T(!1), U = R(() => n.lines && !B.value && !n.whole), ee = R(() => U.value ? $.value.slice(0, n.lines) : $.value), P = R(() => $.value.length - ee.value.length), x = (E) => E.line === null || E.line_type === "del" ? "" : E.line, C = (E) => E.line_type === "fold" ? E.hidden ? `⋯ ${E.hidden} lines` : "⋯" : E.text, M = T(null), _ = T(null);
    let v = null;
    return Te(() => {
      if (!_.value) return;
      let E = !0;
      v = new ResizeObserver(() => {
        !M.value || !_.value || (M.value.style.transition = E ? "none" : "", M.value.style.height = `${_.value.offsetHeight}px`, E = !1);
      }), v.observe(_.value);
    }), Ae(() => v && v.disconnect()), (E, k) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (m) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${H(s)}-click to open it`,
          onClick: o
        }, [
          g("span", Ik, b(u.value), 1),
          g("span", Rk, b(d.value), 1),
          p.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.kind])
          }, b(p.value), 3)) : A("", !0)
        ], 8, Bk),
        g("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + b(e.added), 3),
        g("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + b(e.removed), 3),
        I(Hn, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: w.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = ke((m) => w.value = w.value === "after" ? "before" : "after", ["stop"]))
        }, b(w.value === "after" ? "After" : "Before"), 9, Lk)) : A("", !0),
        f.value ? A("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = ke((m) => a("whole"), ["stop"]))
        }, [
          I(me, {
            name: "file",
            size: 12
          })
        ], 10, Nk))
      ], 8, Tk),
      e.whole && e.whole.error ? (c(), h("p", Dk, b(e.whole.error), 1)) : A("", !0),
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
          }, null, 8, jk)
        ], 8, Pk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: M,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: _,
            class: "diff-card-diff"
          }, [
            g("div", qk, [
              (c(!0), h(G, null, te(ee.value, (m, O) => (c(), h("div", {
                key: O,
                class: Z(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                g("span", Fk, b(x(m)), 1),
                g("span", Wk, b(l[m.line_type]), 1),
                g("span", Hk, b(C(m)), 1)
              ], 2))), 128)),
              P.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = ke((m) => B.value = !0, ["stop"]))
              }, b(P.value) + " more " + b(P.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, cx = /* @__PURE__ */ Y(Uk, [["__scopeId", "data-v-fed58c18"]]), zk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), V(ue, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: N(() => [
        I(me, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Vk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Gk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Kk = { class: "ask-text" }, Yk = ["placeholder", "aria-label"], Zk = ["placeholder", "aria-label"], Jk = {
  key: 3,
  class: "moves"
}, Xk = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = R(() => pg(a.kind, a.row)), r = T(""), l = T(null), i = T(""), u = T("");
    he(() => a.id, () => {
      r.value = "", l.value = null;
    });
    async function d(y, w = "") {
      const S = await a.read([y.noun ?? a.kind, y.word, String(a.id), ...y.flag ? [y.flag, w] : y.positional ? [w] : [], ...y.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = S.ok ? "" : S.error, S.ok && (l.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (y) => y.confirm ? l.value = y : y.said ? d(y, y.said) : y.flag || y.positional ? (l.value = y, i.value = "") : d(y), p = () => i.value.trim() && d(l.value, i.value.trim());
    return t({ moves: o, press: f }), (y, w) => {
      var S;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", Vk, b(r.value), 1)) : A("", !0),
        (S = l.value) != null && S.confirm ? (c(), h("div", Gk, [
          g("span", Kk, b(l.value.confirm), 1),
          I(ue, {
            small: "",
            kind: l.value.danger ? "ghost" : "primary",
            bordered: l.value.danger,
            class: Z({ danger: l.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: w[0] || (w[0] = ($) => d(l.value))
          }, {
            default: N(() => [
              ne(b(l.value.label), 1)
            ]),
            _: 1
          }, 8, ["kind", "bordered", "class"]),
          I(ue, {
            small: "",
            kind: "ghost",
            onClick: w[1] || (w[1] = ($) => l.value = null)
          }, {
            default: N(() => [...w[7] || (w[7] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ])) : l.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: ke(p, ["prevent"])
        }, [
          Ye(g("input", {
            "onUpdate:modelValue": w[2] || (w[2] = ($) => i.value = $),
            class: "ask-input",
            placeholder: l.value.ask,
            "aria-label": l.value.ask,
            onKeydown: w[3] || (w[3] = Ht(ke(($) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, Yk), [
            [xa, i.value]
          ]),
          l.value.opener ? Ye((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": w[4] || (w[4] = ($) => u.value = $),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: l.value.opener,
            "aria-label": l.value.opener,
            onKeydown: w[5] || (w[5] = Ht(ke(($) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, Zk)), [
            [xa, u.value]
          ]) : A("", !0),
          I(ue, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: N(() => [
              ne(b(l.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          I(ue, {
            small: "",
            kind: "ghost",
            onClick: w[6] || (w[6] = ($) => l.value = null)
          }, {
            default: N(() => [...w[8] || (w[8] = [
              ne("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Jk, [
          (c(!0), h(G, null, te(o.value, ($) => (c(), V(ue, {
            key: $.word,
            small: !$.bordered,
            bordered: $.bordered,
            icon: $.icon,
            kind: $.main ? "primary" : "ghost",
            class: Z({ danger: $.danger }),
            "data-move": $.word,
            onClick: (B) => f($)
          }, {
            default: N(() => [
              ne(b($.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : A("", !0);
    };
  }
}, Qk = /* @__PURE__ */ Y(Xk, [["__scopeId", "data-v-74d3b5e8"]]), eb = /* @__PURE__ */ new Set(["completed", "cancelled"]), tb = (e) => eb.has(e), In = (e) => tb(e) ? "done" : e, nb = { class: "facts" }, ab = { class: "fact wide" }, sb = { class: "fact-value" }, ob = {
  key: 0,
  class: "fact"
}, rb = { class: "fact-value" }, lb = { class: "fact" }, ib = { class: "fact-label" }, cb = ["title"], ub = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, db = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, fb = {
  key: 2,
  class: "fact"
}, hb = { class: "fact-value" }, mb = { class: "fact wide" }, pb = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, gb = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = En.map(({ key: o, label: r }) => ({ key: String(o), label: r })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var l, i;
      return c(), h("div", nb, [
        g("div", ab, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", sb, b((l = e.place) != null && l.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", ob, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", rb, b(e.place.phase_number) + " of " + b(e.place.phase_total) + ": " + b(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.helper_id ? (c(), h(G, { key: 1 }, [
          g("div", lb, [
            g("span", ib, b(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => H(Ne)(`agents:${e.task.helper_id}`))
            }, b(e.task.helper_name), 9, cb)
          ]),
          H(s).has(e.task.state) ? (c(), h("p", ub, b(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", db, b(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : A("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", fb, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", hb, "Agent " + b(e.task.holder_id), 1)
        ])) : A("", !0),
        g("div", mb, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          I(Nn, {
            options: H(n),
            value: String(H($r)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", pb, b(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, vb = /* @__PURE__ */ Y(gb, [["__scopeId", "data-v-2bcdca7a"]]), yb = {
  key: 0,
  class: "block-history",
  "data-task-block-history": ""
}, kb = ["datetime"], bb = {
  __name: "TaskBlockRenewals",
  props: { renewals: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => e.renewals.length ? (c(), h("section", yb, [
      n[0] || (n[0] = g("h3", null, "Block history", -1)),
      (c(!0), h(G, null, te(e.renewals, (a) => (c(), h("article", {
        key: a.id,
        "data-task-block-renewal": ""
      }, [
        g("time", {
          datetime: a.created_at
        }, b(new Date(a.created_at).toLocaleString()), 9, kb),
        g("p", null, b(a.reason), 1)
      ]))), 128))
    ])) : A("", !0);
  }
}, wb = /* @__PURE__ */ Y(bb, [["__scopeId", "data-v-b41f213b"]]), xb = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, $b = { ...xb, done: "Completed" }, Mb = { class: "task-status-icon" }, Sb = ["width", "height", "aria-label"], _b = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = R(() => No("task", In(t.status))), a = R(() => n.value === "testing" ? "started" : n.value), s = R(() => $b[t.status] ?? Lo("task", t.status));
    return (o, r) => (c(), h("span", Mb, [
      I(Ot, {
        name: "turn",
        mode: "out-in"
      }, {
        default: N(() => [
          (c(), h("svg", {
            key: n.value,
            class: Z(["ring", n.value]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": s.value
          }, [
            I(Bt, { value: a.value }, {
              blocked: N(() => [...r[0] || (r[0] = [
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
              done: N(() => [...r[1] || (r[1] = [
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
              started: N(() => [...r[2] || (r[2] = [
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
              asked: N(() => [...r[3] || (r[3] = [
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
              paused: N(() => [...r[4] || (r[4] = [
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
              planned: N(() => [...r[5] || (r[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: N(() => [...r[6] || (r[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, Sb))
        ]),
        _: 1
      })
    ]));
  }
}, yl = /* @__PURE__ */ Y(_b, [["__scopeId", "data-v-ae24a63f"]]), Eb = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, Cb = ["onClick"], Ab = { class: "wait-id" }, Ob = { class: "wait-title" }, Tb = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Bb = { class: "text" }, Ib = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, Rb = 180, Lb = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, a = T(!1);
    return (s, o) => (c(), h(G, null, [
      e.task.waits.length ? (c(), h("section", Eb, [
        o[1] || (o[1] = g("h4", null, "Waits on", -1)),
        (c(!0), h(G, null, te(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (l) => n("select", r.id)
        }, [
          I(yl, {
            status: H(In)(r.state),
            size: 12
          }, null, 8, ["status"]),
          g("span", Ab, b(r.id), 1),
          g("span", Ob, b(r.title), 1)
        ], 8, Cb))), 128))
      ])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", Tb, [
        o[2] || (o[2] = g("h4", null, "How it was done", -1)),
        g("p", Bb, b(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), h("section", Ib, [
        o[3] || (o[3] = g("h4", null, "The brief", -1)),
        g("p", {
          class: Z(["text", { clamped: !a.value }])
        }, b(e.task.brief), 3),
        e.task.brief.length > Rb && !a.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => a.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0)
    ], 64));
  }
}, Nb = /* @__PURE__ */ Y(Lb, [["__scopeId", "data-v-8e4d95ae"]]), Db = {
  class: "task-details",
  "data-task-details": ""
}, Pb = { class: "since" }, jb = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, qb = { class: "text" }, Fb = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Wb = {
  key: 1,
  class: "note"
}, Hb = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Ub = { class: "text" }, zb = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var r;
      return c(), h("div", Db, [
        g("div", {
          class: Z(["state-line", H(In)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (l) => n("status", l.currentTarget))
          }, [
            I(yl, {
              status: H(In)(e.task.state)
            }, null, 8, ["status"]),
            ne(" " + b(a(e.task.state)), 1)
          ]),
          g("span", Pb, [
            o[3] || (o[3] = ne(" since ", -1)),
            I(Hn, {
              at: H(fr)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", jb, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", qb, b(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", Fb, "Opens by itself when " + b(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Wb, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Hb, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", Ub, b(e.task.reason), 1)
        ])) : A("", !0),
        I(vb, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (l) => n("priority", l))
        }, null, 8, ["task", "place", "refusal"]),
        I(Nb, {
          task: e.task,
          onSelect: o[2] || (o[2] = (l) => n("select", l))
        }, null, 8, ["task"]),
        I(wb, {
          renewals: e.task.block_renewals
        }, null, 8, ["renewals"])
      ]);
    };
  }
}, Vb = /* @__PURE__ */ Y(zb, [["__scopeId", "data-v-ab0cd816"]]), Gb = 50, Kb = { messages: 25 }, Yb = (e) => Kb[e] || Gb, Zb = {
  class: "task-log",
  "aria-label": "Task log"
}, Jb = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Xb = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, Qb = { class: "entries" }, e2 = ["datetime"], t2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, n2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = T([]), a = T(1), s = T(!0), o = T(!0), r = T("");
    let l = 0;
    async function i(u = 1) {
      const d = ++l;
      a.value = u, o.value = !0, r.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task-id",
        String(t.id),
        "--limit",
        String(Yb("task_logs")),
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
    ), Tt(() => {
      l += 1;
    }), (u, d) => (c(), h("section", Zb, [
      o.value ? (c(), V(gt, { key: 0 })) : r.value ? (c(), h(G, { key: 1 }, [
        g("p", Jb, b(r.value), 1),
        I(ue, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: N(() => [...d[3] || (d[3] = [
            ne("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), h("p", Xb, "No log entries yet.")),
        g("ol", Qb, [
          (c(!0), h(G, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, b(new Date(f.created_at).toLocaleString()), 9, e2),
            g("p", null, b(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", t2, [
          I(ue, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: N(() => [...d[4] || (d[4] = [
              ne("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + b(a.value), 1),
          I(ue, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: N(() => [...d[5] || (d[5] = [
              ne("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, a2 = /* @__PURE__ */ Y(n2, [["__scopeId", "data-v-953605e5"]]), s2 = { class: "comment-side-head" }, o2 = {
  key: 0,
  class: "comment-none"
}, r2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", s2, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        I(Ja, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      e.comments.length ? A("", !0) : (c(), h("p", o2, "No comments yet")),
      (c(!0), h(G, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, b(e.words(a)), 1))), 128))
    ], 2));
  }
}, l2 = /* @__PURE__ */ Y(r2, [["__scopeId", "data-v-19fdbdd4"]]);
var ko;
/Mac|iPhone|iPad/.test(((ko = navigator.userAgentData) == null ? void 0 : ko.platform) || navigator.platform);
function i2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const c2 = ["placeholder"], u2 = { class: "actions" }, d2 = { class: "error" }, f2 = {
  key: 1,
  class: "card closed"
}, h2 = { class: "mark" }, m2 = { class: "prompt" }, p2 = {
  key: 0,
  class: "draft"
}, g2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ wa({
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
  emits: /* @__PURE__ */ wa(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = ba(e, "draft"), r = ba(e, "error"), l = T(!!r.value), i = T(!1), u = T(!1), d = T(null);
    async function f() {
      var w, S;
      l.value = !0, i.value = !1, await st(), (S = ((w = d.value) == null ? void 0 : w.querySelector("input")) || d.value) == null || S.focus();
    }
    function p() {
      l.value = !1, r.value = "";
    }
    async function y() {
      const w = o.value.trim();
      if (!(!w || !a.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await a.send(w), l.value = !1, i.value = !0;
        } catch (S) {
          o.value = w, r.value = S.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (w, S) => (c(), h("div", {
      class: Z(["comment-bar", { open: l.value }])
    }, [
      l.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: ke(y, ["prevent"]),
        onKeydown: Ht(p, ["esc"])
      }, [
        ce(w.$slots, "who", {}, void 0, !0),
        Ye(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": S[0] || (S[0] = ($) => o.value = $),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: S[1] || (S[1] = Ht(($) => H(i2)($, y), ["enter"]))
        }, null, 40, c2), [
          [xa, o.value]
        ]),
        g("div", u2, [
          g("span", d2, b(r.value), 1),
          I(ue, {
            small: "",
            onClick: p
          }, {
            default: N(() => [...S[3] || (S[3] = [
              ne("Cancel", -1)
            ])]),
            _: 1
          }),
          I(ue, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: y
          }, {
            default: N(() => [...S[4] || (S[4] = [
              ne("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", f2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", h2, [
            I(me, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", m2, b(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", p2, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: S[2] || (S[2] = ($) => s("show"))
        }, [
          g("span", null, b(H(li)(e.count, "comment")), 1),
          I(me, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, v2 = /* @__PURE__ */ Y(g2, [["__scopeId", "data-v-81f478d2"]]);
function y2(e, t) {
  const n = T([]), a = T(!1);
  let s = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: p } = e(), y = `On ${d} ${f}, ${p}: `;
    return u.text.startsWith(y) ? u.text.slice(y.length) : u.text;
  };
  async function l() {
    const { kind: u, id: d } = e();
    if (!d) return;
    const f = ++o, p = await t([u, "comments", String(d)]);
    f === o && (n.value = p.ok ? p.value.rows ?? [] : []);
  }
  async function i(u) {
    const { kind: d, id: f } = e(), p = { id: `sending-${++s}`, text: u };
    n.value = [...n.value, p], a.value = !0;
    const y = await t([d, "comment", String(f), u]);
    if (!y.ok)
      throw n.value = n.value.filter((w) => w !== p && w.id !== p.id), new Error(y.error);
    await l();
  }
  return he(() => e().id, () => {
    a.value = !1, n.value = [], l();
  }, { immediate: !0 }), { comments: n, open: a, words: r, send: i, load: l };
}
const k2 = { class: "top" }, b2 = {
  class: "crumb",
  "data-task-crumb": ""
}, w2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, x2 = {
  key: 1,
  class: "body"
}, $2 = { class: "summary" }, M2 = { class: "stamp" }, S2 = {
  class: "title",
  "data-resource-title": ""
}, _2 = {
  class: "tabs",
  "data-task-tabs": ""
}, E2 = { class: "panels" }, C2 = {
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
    const a = e, s = n, o = T(null), r = T(null), l = T(""), i = T(""), u = T(null), d = T(null), f = T("details"), p = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], y = y2(
      () => o.value ? { kind: "task", id: a.id, title: o.value.title } : {},
      (P) => a.read(P)
    );
    let w = 0;
    const S = R(() => {
      var P;
      return (P = r.value) != null && P.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function $() {
      const P = ++w, [x, C] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      P === w && (l.value = x.ok ? "" : x.error, o.value = x.ok ? x.value : null, r.value = C.ok ? C.value : null);
    }
    he(
      () => a.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", $();
      },
      { immediate: !0 }
    ), he(() => a.changes, $), he(y.open, (P) => {
      P && (f.value = "comments");
    });
    async function B(P) {
      const x = o.value.priority;
      o.value.priority = Number(P);
      const C = await a.read(["task", "edit", String(a.id), "--priority", P]);
      if (i.value = C.ok ? "" : C.error, C.ok) return $();
      o.value.priority = x;
    }
    function U(P) {
      u.value = null, d.value.press(P);
    }
    const ee = (P) => {
      var x;
      return ((x = d.value) == null ? void 0 : x.moves.length) && (u.value = P);
    };
    return t({ openStatus: ee }), (P, x) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", k2, [
        e.backed ? (c(), V(zk, {
          key: 0,
          onBack: x[0] || (x[0] = (C) => s("back"))
        })) : A("", !0),
        g("span", b2, b(S.value), 1),
        x[9] || (x[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
          I(ue, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: x[1] || (x[1] = (C) => s("step", -1))
          }, {
            default: N(() => [
              I(me, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          I(ue, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: x[2] || (x[2] = (C) => s("step", 1))
          }, {
            default: N(() => [
              I(me, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        I(ue, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: x[3] || (x[3] = (C) => s("close"))
        }, {
          default: N(() => [
            I(me, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      l.value ? (c(), h("p", w2, b(l.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        I(Qk, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: $
        }, null, 8, ["id", "row", "read"]),
        g("header", $2, [
          g("div", M2, [
            ne(" Task " + b(o.value.id) + " · updated ", 1),
            I(Hn, {
              at: H(fr)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", S2, b(o.value.title), 1)
        ]),
        g("div", _2, [
          I(Nn, {
            options: p,
            value: f.value,
            onPick: x[4] || (x[4] = (C) => f.value = C)
          }, null, 8, ["value"])
        ]),
        g("div", E2, [
          I(Bt, { value: f.value }, {
            details: N(() => [
              I(Vb, {
                task: o.value,
                place: r.value,
                refusal: i.value,
                onStatus: ee,
                onPriority: B,
                onSelect: x[5] || (x[5] = (C) => s("select", C))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: N(() => [
              I(l2, {
                below: "",
                comments: H(y).comments.value,
                words: H(y).words,
                onClose: x[6] || (x[6] = (C) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: N(() => [
              I(a2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        I(v2, {
          send: H(y).send,
          count: H(y).comments.value.length,
          onShow: x[7] || (x[7] = (C) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", x2, [
        I(gt)
      ])),
      u.value ? (c(), V(Ln, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: x[8] || (x[8] = (C) => u.value = null)
      }, {
        default: N(() => [
          I(Wa, null, {
            default: N(() => [
              ne("Change the status of task " + b(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, te(d.value.moves, (C) => (c(), V(ht, {
            key: C.word,
            onClick: (M) => U(C)
          }, {
            default: N(() => [
              ne(b(C.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, ux = /* @__PURE__ */ Y(C2, [["__scopeId", "data-v-43f3b122"]]);
function A2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ka = { exports: {} }, yo;
function O2() {
  return yo || (yo = 1, (function(e, t) {
    var n = (function() {
      var a = function(x, C) {
        var M = 236, _ = 17, v = x, E = o[C], k = null, m = 0, O = null, L = [], F = {}, X = function(j, q) {
          m = v * 4 + 17, k = (function(D) {
            for (var W = new Array(D), z = 0; z < D; z += 1) {
              W[z] = new Array(D);
              for (var Q = 0; Q < D; Q += 1)
                W[z][Q] = null;
            }
            return W;
          })(m), J(0, 0), J(m - 7, 0), J(0, m - 7), ve(), ie(), qe(j, q), v >= 7 && Oe(j), O == null && (O = kl(v, E, L)), Fe(O, q);
        }, J = function(j, q) {
          for (var D = -1; D <= 7; D += 1)
            if (!(j + D <= -1 || m <= j + D))
              for (var W = -1; W <= 7; W += 1)
                q + W <= -1 || m <= q + W || (0 <= D && D <= 6 && (W == 0 || W == 6) || 0 <= W && W <= 6 && (D == 0 || D == 6) || 2 <= D && D <= 4 && 2 <= W && W <= 4 ? k[j + D][q + W] = !0 : k[j + D][q + W] = !1);
        }, K = function() {
          for (var j = 0, q = 0, D = 0; D < 8; D += 1) {
            X(!0, D);
            var W = l.getLostPoint(F);
            (D == 0 || j > W) && (j = W, q = D);
          }
          return q;
        }, ie = function() {
          for (var j = 8; j < m - 8; j += 1)
            k[j][6] == null && (k[j][6] = j % 2 == 0);
          for (var q = 8; q < m - 8; q += 1)
            k[6][q] == null && (k[6][q] = q % 2 == 0);
        }, ve = function() {
          for (var j = l.getPatternPosition(v), q = 0; q < j.length; q += 1)
            for (var D = 0; D < j.length; D += 1) {
              var W = j[q], z = j[D];
              if (k[W][z] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? k[W + Q][z + oe] = !0 : k[W + Q][z + oe] = !1;
            }
        }, Oe = function(j) {
          for (var q = l.getBCHTypeNumber(v), D = 0; D < 18; D += 1) {
            var W = !j && (q >> D & 1) == 1;
            k[Math.floor(D / 3)][D % 3 + m - 8 - 3] = W;
          }
          for (var D = 0; D < 18; D += 1) {
            var W = !j && (q >> D & 1) == 1;
            k[D % 3 + m - 8 - 3][Math.floor(D / 3)] = W;
          }
        }, qe = function(j, q) {
          for (var D = E << 3 | q, W = l.getBCHTypeInfo(D), z = 0; z < 15; z += 1) {
            var Q = !j && (W >> z & 1) == 1;
            z < 6 ? k[z][8] = Q : z < 8 ? k[z + 1][8] = Q : k[m - 15 + z][8] = Q;
          }
          for (var z = 0; z < 15; z += 1) {
            var Q = !j && (W >> z & 1) == 1;
            z < 8 ? k[8][m - z - 1] = Q : z < 9 ? k[8][15 - z - 1 + 1] = Q : k[8][15 - z - 1] = Q;
          }
          k[m - 8][8] = !j;
        }, Fe = function(j, q) {
          for (var D = -1, W = m - 1, z = 7, Q = 0, oe = l.getMaskFunction(q), se = m - 1; se > 0; se -= 2)
            for (se == 6 && (se -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (k[W][se - ye] == null) {
                  var we = !1;
                  Q < j.length && (we = (j[Q] >>> z & 1) == 1);
                  var le = oe(W, se - ye);
                  le && (we = !we), k[W][se - ye] = we, z -= 1, z == -1 && (Q += 1, z = 7);
                }
              if (W += D, W < 0 || m <= W) {
                W -= D, D = -D;
                break;
              }
            }
        }, bt = function(j, q) {
          for (var D = 0, W = 0, z = 0, Q = new Array(q.length), oe = new Array(q.length), se = 0; se < q.length; se += 1) {
            var ye = q[se].dataCount, we = q[se].totalCount - ye;
            W = Math.max(W, ye), z = Math.max(z, we), Q[se] = new Array(ye);
            for (var le = 0; le < Q[se].length; le += 1)
              Q[se][le] = 255 & j.getBuffer()[le + D];
            D += ye;
            var Be = l.getErrorCorrectPolynomial(we), Ie = u(Q[se], Be.getLength() - 1), ps = Ie.mod(Be);
            oe[se] = new Array(Be.getLength() - 1);
            for (var le = 0; le < oe[se].length; le += 1) {
              var gs = le + ps.getLength() - oe[se].length;
              oe[se][le] = gs >= 0 ? ps.getAt(gs) : 0;
            }
          }
          for (var vs = 0, le = 0; le < q.length; le += 1)
            vs += q[le].totalCount;
          for (var Un = new Array(vs), on = 0, le = 0; le < W; le += 1)
            for (var se = 0; se < q.length; se += 1)
              le < Q[se].length && (Un[on] = Q[se][le], on += 1);
          for (var le = 0; le < z; le += 1)
            for (var se = 0; se < q.length; se += 1)
              le < oe[se].length && (Un[on] = oe[se][le], on += 1);
          return Un;
        }, kl = function(j, q, D) {
          for (var W = d.getRSBlocks(j, q), z = f(), Q = 0; Q < D.length; Q += 1) {
            var oe = D[Q];
            z.put(oe.getMode(), 4), z.put(oe.getLength(), l.getLengthInBits(oe.getMode(), j)), oe.write(z);
          }
          for (var se = 0, Q = 0; Q < W.length; Q += 1)
            se += W[Q].dataCount;
          if (z.getLengthInBits() > se * 8)
            throw "code length overflow. (" + z.getLengthInBits() + ">" + se * 8 + ")";
          for (z.getLengthInBits() + 4 <= se * 8 && z.put(0, 4); z.getLengthInBits() % 8 != 0; )
            z.putBit(!1);
          for (; !(z.getLengthInBits() >= se * 8 || (z.put(M, 8), z.getLengthInBits() >= se * 8)); )
            z.put(_, 8);
          return bt(z, W);
        };
        F.addData = function(j, q) {
          q = q || "Byte";
          var D = null;
          switch (q) {
            case "Numeric":
              D = p(j);
              break;
            case "Alphanumeric":
              D = y(j);
              break;
            case "Byte":
              D = w(j);
              break;
            case "Kanji":
              D = S(j);
              break;
            default:
              throw "mode:" + q;
          }
          L.push(D), O = null;
        }, F.isDark = function(j, q) {
          if (j < 0 || m <= j || q < 0 || m <= q)
            throw j + "," + q;
          return k[j][q];
        }, F.getModuleCount = function() {
          return m;
        }, F.make = function() {
          if (v < 1) {
            for (var j = 1; j < 40; j++) {
              for (var q = d.getRSBlocks(j, E), D = f(), W = 0; W < L.length; W++) {
                var z = L[W];
                D.put(z.getMode(), 4), D.put(z.getLength(), l.getLengthInBits(z.getMode(), j)), z.write(D);
              }
              for (var Q = 0, W = 0; W < q.length; W++)
                Q += q[W].dataCount;
              if (D.getLengthInBits() <= Q * 8)
                break;
            }
            v = j;
          }
          X(!1, K());
        }, F.createTableTag = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var D = "";
          D += '<table style="', D += " border-width: 0px; border-style: none;", D += " border-collapse: collapse;", D += " padding: 0px; margin: " + q + "px;", D += '">', D += "<tbody>";
          for (var W = 0; W < F.getModuleCount(); W += 1) {
            D += "<tr>";
            for (var z = 0; z < F.getModuleCount(); z += 1)
              D += '<td style="', D += " border-width: 0px; border-style: none;", D += " border-collapse: collapse;", D += " padding: 0px; margin: 0px;", D += " width: " + j + "px;", D += " height: " + j + "px;", D += " background-color: ", D += F.isDark(W, z) ? "#000000" : "#ffffff", D += ";", D += '"/>';
            D += "</tr>";
          }
          return D += "</tbody>", D += "</table>", D;
        }, F.createSvgTag = function(j, q, D, W) {
          var z = {};
          typeof arguments[0] == "object" && (z = arguments[0], j = z.cellSize, q = z.margin, D = z.alt, W = z.title), j = j || 2, q = typeof q > "u" ? j * 4 : q, D = typeof D == "string" ? { text: D } : D || {}, D.text = D.text || null, D.id = D.text ? D.id || "qrcode-description" : null, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-title" : null;
          var Q = F.getModuleCount() * j + q * 2, oe, se, ye, we, le = "", Be;
          for (Be = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", le += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', le += z.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', le += ' viewBox="0 0 ' + Q + " " + Q + '" ', le += ' preserveAspectRatio="xMinYMin meet"', le += W.text || D.text ? ' role="img" aria-labelledby="' + wt([W.id, D.id].join(" ").trim()) + '"' : "", le += ">", le += W.text ? '<title id="' + wt(W.id) + '">' + wt(W.text) + "</title>" : "", le += D.text ? '<description id="' + wt(D.id) + '">' + wt(D.text) + "</description>" : "", le += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', le += '<path d="', ye = 0; ye < F.getModuleCount(); ye += 1)
            for (we = ye * j + q, oe = 0; oe < F.getModuleCount(); oe += 1)
              F.isDark(ye, oe) && (se = oe * j + q, le += "M" + se + "," + we + Be);
          return le += '" stroke="transparent" fill="black"/>', le += "</svg>", le;
        }, F.createDataURL = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var D = F.getModuleCount() * j + q * 2, W = q, z = D - q;
          return P(D, D, function(Q, oe) {
            if (W <= Q && Q < z && W <= oe && oe < z) {
              var se = Math.floor((Q - W) / j), ye = Math.floor((oe - W) / j);
              return F.isDark(ye, se) ? 0 : 1;
            } else
              return 1;
          });
        }, F.createImgTag = function(j, q, D) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var W = F.getModuleCount() * j + q * 2, z = "";
          return z += "<img", z += ' src="', z += F.createDataURL(j, q), z += '"', z += ' width="', z += W, z += '"', z += ' height="', z += W, z += '"', D && (z += ' alt="', z += wt(D), z += '"'), z += "/>", z;
        };
        var wt = function(j) {
          for (var q = "", D = 0; D < j.length; D += 1) {
            var W = j.charAt(D);
            switch (W) {
              case "<":
                q += "&lt;";
                break;
              case ">":
                q += "&gt;";
                break;
              case "&":
                q += "&amp;";
                break;
              case '"':
                q += "&quot;";
                break;
              default:
                q += W;
                break;
            }
          }
          return q;
        }, bl = function(j) {
          var q = 1;
          j = typeof j > "u" ? q * 2 : j;
          var D = F.getModuleCount() * q + j * 2, W = j, z = D - j, Q, oe, se, ye, we, le = {
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
          for (Q = 0; Q < D; Q += 2) {
            for (se = Math.floor((Q - W) / q), ye = Math.floor((Q + 1 - W) / q), oe = 0; oe < D; oe += 1)
              we = "█", W <= oe && oe < z && W <= Q && Q < z && F.isDark(se, Math.floor((oe - W) / q)) && (we = " "), W <= oe && oe < z && W <= Q + 1 && Q + 1 < z && F.isDark(ye, Math.floor((oe - W) / q)) ? we += " " : we += "█", Ie += j < 1 && Q + 1 >= z ? Be[we] : le[we];
            Ie += `
`;
          }
          return D % 2 && j > 0 ? Ie.substring(0, Ie.length - D - 1) + Array(D + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return F.createASCII = function(j, q) {
          if (j = j || 1, j < 2)
            return bl(q);
          j -= 1, q = typeof q > "u" ? j * 2 : q;
          var D = F.getModuleCount() * j + q * 2, W = q, z = D - q, Q, oe, se, ye, we = Array(j + 1).join("██"), le = Array(j + 1).join("  "), Be = "", Ie = "";
          for (Q = 0; Q < D; Q += 1) {
            for (se = Math.floor((Q - W) / j), Ie = "", oe = 0; oe < D; oe += 1)
              ye = 1, W <= oe && oe < z && W <= Q && Q < z && F.isDark(se, Math.floor((oe - W) / j)) && (ye = 0), Ie += ye ? we : le;
            for (se = 0; se < j; se += 1)
              Be += Ie + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, F.renderTo2dContext = function(j, q) {
          q = q || 2;
          for (var D = F.getModuleCount(), W = 0; W < D; W++)
            for (var z = 0; z < D; z++)
              j.fillStyle = F.isDark(W, z) ? "black" : "white", j.fillRect(W * q, z * q, q, q);
        }, F;
      };
      a.stringToBytesFuncs = {
        default: function(x) {
          for (var C = [], M = 0; M < x.length; M += 1) {
            var _ = x.charCodeAt(M);
            C.push(_ & 255);
          }
          return C;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(x, C) {
        var M = (function() {
          for (var v = U(x), E = function() {
            var ie = v.read();
            if (ie == -1) throw "eof";
            return ie;
          }, k = 0, m = {}; ; ) {
            var O = v.read();
            if (O == -1) break;
            var L = E(), F = E(), X = E(), J = String.fromCharCode(O << 8 | L), K = F << 8 | X;
            m[J] = K, k += 1;
          }
          if (k != C)
            throw k + " != " + C;
          return m;
        })(), _ = 63;
        return function(v) {
          for (var E = [], k = 0; k < v.length; k += 1) {
            var m = v.charCodeAt(k);
            if (m < 128)
              E.push(m);
            else {
              var O = M[v.charAt(k)];
              typeof O == "number" ? (O & 255) == O ? E.push(O) : (E.push(O >>> 8), E.push(O & 255)) : E.push(_);
            }
          }
          return E;
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
        ], C = 1335, M = 7973, _ = 21522, v = {}, E = function(k) {
          for (var m = 0; k != 0; )
            m += 1, k >>>= 1;
          return m;
        };
        return v.getBCHTypeInfo = function(k) {
          for (var m = k << 10; E(m) - E(C) >= 0; )
            m ^= C << E(m) - E(C);
          return (k << 10 | m) ^ _;
        }, v.getBCHTypeNumber = function(k) {
          for (var m = k << 12; E(m) - E(M) >= 0; )
            m ^= M << E(m) - E(M);
          return k << 12 | m;
        }, v.getPatternPosition = function(k) {
          return x[k - 1];
        }, v.getMaskFunction = function(k) {
          switch (k) {
            case r.PATTERN000:
              return function(m, O) {
                return (m + O) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, O) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, O) {
                return O % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, O) {
                return (m + O) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, O) {
                return (Math.floor(m / 2) + Math.floor(O / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, O) {
                return m * O % 2 + m * O % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, O) {
                return (m * O % 2 + m * O % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, O) {
                return (m * O % 3 + (m + O) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, v.getErrorCorrectPolynomial = function(k) {
          for (var m = u([1], 0), O = 0; O < k; O += 1)
            m = m.multiply(u([1, i.gexp(O)], 0));
          return m;
        }, v.getLengthInBits = function(k, m) {
          if (1 <= m && m < 10)
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
          else if (m < 27)
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
          else if (m < 41)
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
            throw "type:" + m;
        }, v.getLostPoint = function(k) {
          for (var m = k.getModuleCount(), O = 0, L = 0; L < m; L += 1)
            for (var F = 0; F < m; F += 1) {
              for (var X = 0, J = k.isDark(L, F), K = -1; K <= 1; K += 1)
                if (!(L + K < 0 || m <= L + K))
                  for (var ie = -1; ie <= 1; ie += 1)
                    F + ie < 0 || m <= F + ie || K == 0 && ie == 0 || J == k.isDark(L + K, F + ie) && (X += 1);
              X > 5 && (O += 3 + X - 5);
            }
          for (var L = 0; L < m - 1; L += 1)
            for (var F = 0; F < m - 1; F += 1) {
              var ve = 0;
              k.isDark(L, F) && (ve += 1), k.isDark(L + 1, F) && (ve += 1), k.isDark(L, F + 1) && (ve += 1), k.isDark(L + 1, F + 1) && (ve += 1), (ve == 0 || ve == 4) && (O += 3);
            }
          for (var L = 0; L < m; L += 1)
            for (var F = 0; F < m - 6; F += 1)
              k.isDark(L, F) && !k.isDark(L, F + 1) && k.isDark(L, F + 2) && k.isDark(L, F + 3) && k.isDark(L, F + 4) && !k.isDark(L, F + 5) && k.isDark(L, F + 6) && (O += 40);
          for (var F = 0; F < m; F += 1)
            for (var L = 0; L < m - 6; L += 1)
              k.isDark(L, F) && !k.isDark(L + 1, F) && k.isDark(L + 2, F) && k.isDark(L + 3, F) && k.isDark(L + 4, F) && !k.isDark(L + 5, F) && k.isDark(L + 6, F) && (O += 40);
          for (var Oe = 0, F = 0; F < m; F += 1)
            for (var L = 0; L < m; L += 1)
              k.isDark(L, F) && (Oe += 1);
          var qe = Math.abs(100 * Oe / m / m - 50) / 5;
          return O += qe * 10, O;
        }, v;
      })(), i = (function() {
        for (var x = new Array(256), C = new Array(256), M = 0; M < 8; M += 1)
          x[M] = 1 << M;
        for (var M = 8; M < 256; M += 1)
          x[M] = x[M - 4] ^ x[M - 5] ^ x[M - 6] ^ x[M - 8];
        for (var M = 0; M < 255; M += 1)
          C[x[M]] = M;
        var _ = {};
        return _.glog = function(v) {
          if (v < 1)
            throw "glog(" + v + ")";
          return C[v];
        }, _.gexp = function(v) {
          for (; v < 0; )
            v += 255;
          for (; v >= 256; )
            v -= 255;
          return x[v];
        }, _;
      })();
      function u(x, C) {
        if (typeof x.length > "u")
          throw x.length + "/" + C;
        var M = (function() {
          for (var v = 0; v < x.length && x[v] == 0; )
            v += 1;
          for (var E = new Array(x.length - v + C), k = 0; k < x.length - v; k += 1)
            E[k] = x[k + v];
          return E;
        })(), _ = {};
        return _.getAt = function(v) {
          return M[v];
        }, _.getLength = function() {
          return M.length;
        }, _.multiply = function(v) {
          for (var E = new Array(_.getLength() + v.getLength() - 1), k = 0; k < _.getLength(); k += 1)
            for (var m = 0; m < v.getLength(); m += 1)
              E[k + m] ^= i.gexp(i.glog(_.getAt(k)) + i.glog(v.getAt(m)));
          return u(E, 0);
        }, _.mod = function(v) {
          if (_.getLength() - v.getLength() < 0)
            return _;
          for (var E = i.glog(_.getAt(0)) - i.glog(v.getAt(0)), k = new Array(_.getLength()), m = 0; m < _.getLength(); m += 1)
            k[m] = _.getAt(m);
          for (var m = 0; m < v.getLength(); m += 1)
            k[m] ^= i.gexp(i.glog(v.getAt(m)) + E);
          return u(k, 0).mod(v);
        }, _;
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
        ], C = function(v, E) {
          var k = {};
          return k.totalCount = v, k.dataCount = E, k;
        }, M = {}, _ = function(v, E) {
          switch (E) {
            case o.L:
              return x[(v - 1) * 4 + 0];
            case o.M:
              return x[(v - 1) * 4 + 1];
            case o.Q:
              return x[(v - 1) * 4 + 2];
            case o.H:
              return x[(v - 1) * 4 + 3];
            default:
              return;
          }
        };
        return M.getRSBlocks = function(v, E) {
          var k = _(v, E);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + v + "/errorCorrectionLevel:" + E;
          for (var m = k.length / 3, O = [], L = 0; L < m; L += 1)
            for (var F = k[L * 3 + 0], X = k[L * 3 + 1], J = k[L * 3 + 2], K = 0; K < F; K += 1)
              O.push(C(X, J));
          return O;
        }, M;
      })(), f = function() {
        var x = [], C = 0, M = {};
        return M.getBuffer = function() {
          return x;
        }, M.getAt = function(_) {
          var v = Math.floor(_ / 8);
          return (x[v] >>> 7 - _ % 8 & 1) == 1;
        }, M.put = function(_, v) {
          for (var E = 0; E < v; E += 1)
            M.putBit((_ >>> v - E - 1 & 1) == 1);
        }, M.getLengthInBits = function() {
          return C;
        }, M.putBit = function(_) {
          var v = Math.floor(C / 8);
          x.length <= v && x.push(0), _ && (x[v] |= 128 >>> C % 8), C += 1;
        }, M;
      }, p = function(x) {
        var C = s.MODE_NUMBER, M = x, _ = {};
        _.getMode = function() {
          return C;
        }, _.getLength = function(k) {
          return M.length;
        }, _.write = function(k) {
          for (var m = M, O = 0; O + 2 < m.length; )
            k.put(v(m.substring(O, O + 3)), 10), O += 3;
          O < m.length && (m.length - O == 1 ? k.put(v(m.substring(O, O + 1)), 4) : m.length - O == 2 && k.put(v(m.substring(O, O + 2)), 7));
        };
        var v = function(k) {
          for (var m = 0, O = 0; O < k.length; O += 1)
            m = m * 10 + E(k.charAt(O));
          return m;
        }, E = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return _;
      }, y = function(x) {
        var C = s.MODE_ALPHA_NUM, M = x, _ = {};
        _.getMode = function() {
          return C;
        }, _.getLength = function(E) {
          return M.length;
        }, _.write = function(E) {
          for (var k = M, m = 0; m + 1 < k.length; )
            E.put(
              v(k.charAt(m)) * 45 + v(k.charAt(m + 1)),
              11
            ), m += 2;
          m < k.length && E.put(v(k.charAt(m)), 6);
        };
        var v = function(E) {
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
        return _;
      }, w = function(x) {
        var C = s.MODE_8BIT_BYTE, M = a.stringToBytes(x), _ = {};
        return _.getMode = function() {
          return C;
        }, _.getLength = function(v) {
          return M.length;
        }, _.write = function(v) {
          for (var E = 0; E < M.length; E += 1)
            v.put(M[E], 8);
        }, _;
      }, S = function(x) {
        var C = s.MODE_KANJI, M = a.stringToBytesFuncs.SJIS;
        if (!M)
          throw "sjis not supported.";
        (function(E, k) {
          var m = M(E);
          if (m.length != 2 || (m[0] << 8 | m[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var _ = M(x), v = {};
        return v.getMode = function() {
          return C;
        }, v.getLength = function(E) {
          return ~~(_.length / 2);
        }, v.write = function(E) {
          for (var k = _, m = 0; m + 1 < k.length; ) {
            var O = (255 & k[m]) << 8 | 255 & k[m + 1];
            if (33088 <= O && O <= 40956)
              O -= 33088;
            else if (57408 <= O && O <= 60351)
              O -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + O;
            O = (O >>> 8 & 255) * 192 + (O & 255), E.put(O, 13), m += 2;
          }
          if (m < k.length)
            throw "illegal char at " + (m + 1);
        }, v;
      }, $ = function() {
        var x = [], C = {};
        return C.writeByte = function(M) {
          x.push(M & 255);
        }, C.writeShort = function(M) {
          C.writeByte(M), C.writeByte(M >>> 8);
        }, C.writeBytes = function(M, _, v) {
          _ = _ || 0, v = v || M.length;
          for (var E = 0; E < v; E += 1)
            C.writeByte(M[E + _]);
        }, C.writeString = function(M) {
          for (var _ = 0; _ < M.length; _ += 1)
            C.writeByte(M.charCodeAt(_));
        }, C.toByteArray = function() {
          return x;
        }, C.toString = function() {
          var M = "";
          M += "[";
          for (var _ = 0; _ < x.length; _ += 1)
            _ > 0 && (M += ","), M += x[_];
          return M += "]", M;
        }, C;
      }, B = function() {
        var x = 0, C = 0, M = 0, _ = "", v = {}, E = function(m) {
          _ += String.fromCharCode(k(m & 63));
        }, k = function(m) {
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
        return v.writeByte = function(m) {
          for (x = x << 8 | m & 255, C += 8, M += 1; C >= 6; )
            E(x >>> C - 6), C -= 6;
        }, v.flush = function() {
          if (C > 0 && (E(x << 6 - C), x = 0, C = 0), M % 3 != 0)
            for (var m = 3 - M % 3, O = 0; O < m; O += 1)
              _ += "=";
        }, v.toString = function() {
          return _;
        }, v;
      }, U = function(x) {
        var C = x, M = 0, _ = 0, v = 0, E = {};
        E.read = function() {
          for (; v < 8; ) {
            if (M >= C.length) {
              if (v == 0)
                return -1;
              throw "unexpected end of file./" + v;
            }
            var m = C.charAt(M);
            if (M += 1, m == "=")
              return v = 0, -1;
            if (m.match(/^\s$/))
              continue;
            _ = _ << 6 | k(m.charCodeAt(0)), v += 6;
          }
          var O = _ >>> v - 8 & 255;
          return v -= 8, O;
        };
        var k = function(m) {
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
      }, ee = function(x, C) {
        var M = x, _ = C, v = new Array(x * C), E = {};
        E.setPixel = function(L, F, X) {
          v[F * M + L] = X;
        }, E.write = function(L) {
          L.writeString("GIF87a"), L.writeShort(M), L.writeShort(_), L.writeByte(128), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(0), L.writeByte(255), L.writeByte(255), L.writeByte(255), L.writeString(","), L.writeShort(0), L.writeShort(0), L.writeShort(M), L.writeShort(_), L.writeByte(0);
          var F = 2, X = m(F);
          L.writeByte(F);
          for (var J = 0; X.length - J > 255; )
            L.writeByte(255), L.writeBytes(X, J, 255), J += 255;
          L.writeByte(X.length - J), L.writeBytes(X, J, X.length - J), L.writeByte(0), L.writeString(";");
        };
        var k = function(L) {
          var F = L, X = 0, J = 0, K = {};
          return K.write = function(ie, ve) {
            if (ie >>> ve)
              throw "length over";
            for (; X + ve >= 8; )
              F.writeByte(255 & (ie << X | J)), ve -= 8 - X, ie >>>= 8 - X, J = 0, X = 0;
            J = ie << X | J, X = X + ve;
          }, K.flush = function() {
            X > 0 && F.writeByte(J);
          }, K;
        }, m = function(L) {
          for (var F = 1 << L, X = (1 << L) + 1, J = L + 1, K = O(), ie = 0; ie < F; ie += 1)
            K.add(String.fromCharCode(ie));
          K.add(String.fromCharCode(F)), K.add(String.fromCharCode(X));
          var ve = $(), Oe = k(ve);
          Oe.write(F, J);
          var qe = 0, Fe = String.fromCharCode(v[qe]);
          for (qe += 1; qe < v.length; ) {
            var bt = String.fromCharCode(v[qe]);
            qe += 1, K.contains(Fe + bt) ? Fe = Fe + bt : (Oe.write(K.indexOf(Fe), J), K.size() < 4095 && (K.size() == 1 << J && (J += 1), K.add(Fe + bt)), Fe = bt);
          }
          return Oe.write(K.indexOf(Fe), J), Oe.write(X, J), Oe.flush(), ve.toByteArray();
        }, O = function() {
          var L = {}, F = 0, X = {};
          return X.add = function(J) {
            if (X.contains(J))
              throw "dup key:" + J;
            L[J] = F, F += 1;
          }, X.size = function() {
            return F;
          }, X.indexOf = function(J) {
            return L[J];
          }, X.contains = function(J) {
            return typeof L[J] < "u";
          }, X;
        };
        return E;
      }, P = function(x, C, M) {
        for (var _ = ee(x, C), v = 0; v < C; v += 1)
          for (var E = 0; E < x; E += 1)
            _.setPixel(E, v, M(E, v));
        var k = $();
        _.write(k);
        for (var m = B(), O = k.toByteArray(), L = 0; L < O.length; L += 1)
          m.writeByte(O[L]);
        return m.flush(), "data:image/gif;base64," + m;
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
  })(ka)), ka.exports;
}
var T2 = O2();
const B2 = /* @__PURE__ */ A2(T2), I2 = ["width", "height", "viewBox"], R2 = ["width", "height"], L2 = ["d"], N2 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const a = B2(0, "M");
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
      }, null, 8, R2),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, L2)
    ], 8, I2));
  }
}, dx = /* @__PURE__ */ Y(N2, [["__scopeId", "data-v-489f0852"]]), D2 = {
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
}, fx = /* @__PURE__ */ Y(D2, [["__scopeId", "data-v-47e67f04"]]), hx = Il(() => import("./VoiceFigure-DktTPYxc.js").then((e) => e.V)), mx = "1.1.0", px = "3.5";
export {
  cy as $,
  xe as A,
  _e as B,
  jn as C,
  Ze as D,
  w4 as E,
  Xv as F,
  d5 as G,
  v4 as H,
  oy as I,
  kt as J,
  cs as K,
  Bv as L,
  dy as M,
  sy as N,
  D5 as O,
  Pn as P,
  bn as Q,
  Uw as R,
  W5 as S,
  Nw as T,
  Me as U,
  Cn as V,
  Lw as W,
  Rw as X,
  ru as Y,
  lu as Z,
  Y as _,
  _w as a,
  Kv as a$,
  zw as a0,
  Vw as a1,
  Se as a2,
  a5 as a3,
  n5 as a4,
  mt as a5,
  Gw as a6,
  p5 as a7,
  pw as a8,
  r4 as a9,
  R5 as aA,
  wv as aB,
  k5 as aC,
  b5 as aD,
  x4 as aE,
  el as aF,
  F5 as aG,
  tn as aH,
  ww as aI,
  yw as aJ,
  d4 as aK,
  nn as aL,
  p4 as aM,
  u5 as aN,
  L5 as aO,
  N5 as aP,
  I5 as aQ,
  Kt as aR,
  dt as aS,
  gw as aT,
  d0 as aU,
  T5 as aV,
  Ww as aW,
  Xr as aX,
  At as aY,
  Rt as aZ,
  o4 as a_,
  h4 as aa,
  Mw as ab,
  Dw as ac,
  Pw as ad,
  e5 as ae,
  t5 as af,
  s5 as ag,
  Ow as ah,
  uo as ai,
  Kw as aj,
  m5 as ak,
  _4 as al,
  E5 as am,
  S5 as an,
  M5 as ao,
  o5 as ap,
  Xw as aq,
  Jw as ar,
  Qw as as,
  q5 as at,
  h5 as au,
  g5 as av,
  A4 as aw,
  qt as ax,
  v5 as ay,
  J5 as az,
  xy as b,
  kw as b$,
  m4 as b0,
  z5 as b1,
  U5 as b2,
  L0 as b3,
  jr as b4,
  n4 as b5,
  f5 as b6,
  Wn as b7,
  Qe as b8,
  X5 as b9,
  Q5 as bA,
  nt as bB,
  H5 as bC,
  e4 as bD,
  y5 as bE,
  C5 as bF,
  w5 as bG,
  Ee as bH,
  c5 as bI,
  t4 as bJ,
  D4 as bK,
  P4 as bL,
  hw as bM,
  m0 as bN,
  l5 as bO,
  K5 as bP,
  Ew as bQ,
  S4 as bR,
  V5 as bS,
  Y5 as bT,
  Z5 as bU,
  r5 as bV,
  xv as bW,
  i5 as bX,
  $5 as bY,
  M4 as bZ,
  C4 as b_,
  la as ba,
  dr as bb,
  T4 as bc,
  R4 as bd,
  j5 as be,
  u4 as bf,
  mw as bg,
  _5 as bh,
  B4 as bi,
  Yw as bj,
  Zw as bk,
  Bw as bl,
  Hw as bm,
  bw as bn,
  i4 as bo,
  Cw as bp,
  Aw as bq,
  Iw as br,
  O5 as bs,
  r0 as bt,
  g4 as bu,
  ay as bv,
  Tw as bw,
  xw as bx,
  A5 as by,
  G5 as bz,
  R0 as c,
  hi as c$,
  vw as c0,
  x5 as c1,
  L4 as c2,
  ms as c3,
  N4 as c4,
  pl as c5,
  c4 as c6,
  qw as c7,
  jw as c8,
  u0 as c9,
  mx as cA,
  px as cB,
  tw as cC,
  tx as cD,
  Ra as cE,
  iw as cF,
  Vp as cG,
  ht as cH,
  Wa as cI,
  Ln as cJ,
  Z2 as cK,
  nw as cL,
  ei as cM,
  rp as cN,
  ix as cO,
  X2 as cP,
  dx as cQ,
  Z4 as cR,
  vu as cS,
  H2 as cT,
  uw as cU,
  yk as cV,
  Nn as cW,
  aw as cX,
  gt as cY,
  ot as cZ,
  D1 as c_,
  $w as ca,
  ty as cb,
  B5 as cc,
  rs as cd,
  gv as ce,
  P5 as cf,
  Ft as cg,
  _t as ch,
  G2 as ci,
  X4 as cj,
  ue as ck,
  Uc as cl,
  Jc as cm,
  Ja as cn,
  K2 as co,
  Uo as cp,
  cx as cq,
  fw as cr,
  cm as cs,
  xn as ct,
  j4 as cu,
  j2 as cv,
  Ct as cw,
  bc as cx,
  me as cy,
  Q4 as cz,
  De as d,
  Ia as d$,
  rw as d0,
  U2 as d1,
  Bt as d2,
  ex as d3,
  ux as d4,
  yl as d5,
  xc as d6,
  et as d7,
  sw as d8,
  Hn as d9,
  z2 as dA,
  ew as dB,
  U4 as dC,
  V4 as dD,
  Ne as dE,
  Y2 as dF,
  J2 as dG,
  H4 as dH,
  km as dI,
  W2 as dJ,
  q2 as dK,
  Lo as dL,
  No as dM,
  Qi as dN,
  V2 as dO,
  Ve as dP,
  Wy as dQ,
  ow as dR,
  W4 as dS,
  J4 as dT,
  jy as dU,
  nx as dV,
  zm as dW,
  So as dX,
  Ek as dY,
  Tr as dZ,
  G4 as d_,
  hx as da,
  fx as db,
  xr as dc,
  z4 as dd,
  Ka as de,
  Xh as df,
  Fs as dg,
  br as dh,
  Ji as di,
  rx as dj,
  ox as dk,
  Ya as dl,
  Zi as dm,
  Q2 as dn,
  lx as dp,
  dw as dq,
  cw as dr,
  lw as ds,
  F4 as dt,
  jd as du,
  q4 as dv,
  F2 as dw,
  ax as dx,
  jp as dy,
  Fy as dz,
  Fw as e,
  K4 as e0,
  Y4 as e1,
  vt as e2,
  sx as e3,
  Xi as e4,
  o0 as f,
  O4 as g,
  Yt as h,
  y4 as i,
  I4 as j,
  k4 as k,
  l4 as l,
  Ey as m,
  us as n,
  f4 as o,
  Sw as p,
  b4 as q,
  hl as r,
  ml as s,
  Et as t,
  D0 as u,
  a4 as v,
  E4 as w,
  s4 as x,
  sn as y,
  $4 as z
};
