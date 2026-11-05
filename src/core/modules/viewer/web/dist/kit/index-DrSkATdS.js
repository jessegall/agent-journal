/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ce, createElementVNode as g, normalizeClass as J, Fragment as G, renderList as te, normalizeStyle as fe, defineComponent as bl, Comment as wl, h as Ua, cloneVNode as xl, createBlock as V, withCtx as D, unref as H, createVNode as R, toDisplayString as k, createCommentVNode as C, inject as $e, useAttrs as In, computed as I, ref as B, resolveDynamicComponent as pt, mergeProps as Ge, onUnmounted as Ae, onMounted as Te, Teleport as za, useId as Va, resolveDirective as $l, withDirectives as Ke, createTextVNode as se, reactive as Ga, shallowRef as et, watch as me, nextTick as st, Transition as Ot, withModifiers as ke, TransitionGroup as wo, shallowReactive as Ml, isRef as vs, onBeforeUnmount as Tt, resolveComponent as Sl, useModel as ka, getCurrentInstance as _l, mergeModels as ba, getCurrentScope as xo, onScopeDispose as $o, provide as El, onErrorCaptured as Al, toHandlers as Cl, createSlots as Ol, vShow as Mo, useSlots as Tl, withKeys as Ft, vModelText as wa, defineAsyncComponent as Bl } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, s] of t)
    n[a] = s;
  return n;
}, Il = { class: "skeleton-line" }, Rl = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Il, [
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
}, ot = /* @__PURE__ */ Y(Rl, [["__scopeId", "data-v-0ebb6933"]]), Bt = bl({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", a = (t[n] ? t[n]() : []).filter((s) => s.type !== wl);
      return a.length !== 1 ? Ua(G, { key: n }, a) : a[0].key == null ? xl(a[0], { key: n }) : a[0];
    };
  }
}), Ll = ["aria-label"], Nl = ["aria-label"], Dl = ["aria-label"], Pl = ["aria-label"], jl = ["aria-label"], ql = ["aria-label"], Fl = ["aria-label"], Wl = {
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
        ], 8, Ll)
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
        ], 8, Nl)
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
            (c(), h(G, null, te(n, (f) => R(ot, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Dl)
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
            R(ot, {
              class: "skeleton-file-head",
              bars: a
            }),
            (c(), h(G, null, te(s, (f) => R(ot, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, Pl)
      ]),
      page: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          R(ot, {
            class: "skeleton-heading",
            bars: l
          }),
          (c(!0), h(G, null, te(e.count, (d) => (c(), V(ot, {
            key: d,
            bars: H(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, jl)
      ]),
      text: D(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(G, null, te(e.count, (d) => (c(), V(ot, {
            key: d,
            bars: H(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ql)
      ]),
      default: D(() => [
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
        ], 8, Fl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, gt = /* @__PURE__ */ Y(Wl, [["__scopeId", "data-v-1392eacb"]]), Hl = {
  key: 1,
  class: "empty-state titled"
}, Ul = { class: "empty-state-title" }, zl = { class: "empty-state-text" }, Vl = {
  key: 2,
  class: "empty-state"
}, Gl = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), V(gt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", Hl, [
      g("p", Ul, k(e.title), 1),
      g("p", zl, [
        ce(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", Vl, [
      ce(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, bn = /* @__PURE__ */ Y(Gl, [["__scopeId", "data-v-b27e89b0"]]), Kl = { class: "fold-group" }, Yl = ["aria-expanded"], Zl = { class: "fold-label" }, Jl = {
  key: 0,
  class: "fold-count"
}, Xl = {
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
    return (a, s) => (c(), h("div", Kl, [
      g("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: s[0] || (s[0] = (o) => n("toggle"))
      }, [
        g("span", Zl, k(e.label), 1),
        e.count !== "" ? (c(), h("span", Jl, k(e.count), 1)) : C("", !0),
        g("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Yl),
      e.open ? ce(a.$slots, "default", {}, void 0, !0, 0) : C("", !0)
    ]));
  }
}, T2 = /* @__PURE__ */ Y(Xl, [["__scopeId", "data-v-9ef1865c"]]), Ql = Symbol("open-view"), Se = Symbol.for("journal.window-context");
function vt() {
  const e = $e(Se, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const ei = ["stroke-width", "innerHTML"], pe = {
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
    }, null, 12, ei));
  }
}, ti = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, ni = /* @__PURE__ */ Y(ti, [["__scopeId", "data-v-eb453d6f"]]), ai = 120, si = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = In(), a = I(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), s = B(!1), o = I(() => t.busy || s.value), r = $e(Se, null), l = I(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function i(u) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(u)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => s.value = !0, ai);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), s.value = !1;
      }
    }
    return (u, d) => (c(), V(pt(e.href ? "a" : "button"), Ge(a.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: l.value,
      onClick: i
    }), {
      default: D(() => [
        g("span", {
          class: J(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), V(pe, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : C("", !0),
          ce(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), V(ni, {
          key: 0,
          class: "btn-spinner"
        })) : C("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), de = /* @__PURE__ */ Y(si, [["__scopeId", "data-v-033d70ca"]]), oi = (e, t, n) => Math.max(t, Math.min(n, e)), ri = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, So = /* @__PURE__ */ new WeakMap(), li = (e, t) => So.set(e, t);
function ii(e, t) {
  for (let n = t; n; n = So.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function _o(e, t) {
  const n = (a) => {
    var o, r;
    const s = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    s && !ii(s, a.target) && t(a);
  };
  window.addEventListener("click", n), Ae(() => window.removeEventListener("click", n));
}
const xt = 8, ci = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, s = B(null), o = (m) => m ? `${m}px` : void 0, r = I(() => ({
      minWidth: o(a.minWidth),
      maxWidth: o(a.maxWidth),
      maxHeight: o(a.maxHeight),
      height: o(a.height)
    })), l = B({ w: 0, h: 0 }), i = B(a.anchor ? a.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), f = (m) => {
      const L = m.closest(".pane, .float-window");
      return L ? d(L.getBoundingClientRect()) : u();
    }, p = (m, L) => `${Math.max(0, m ? Math.min(m, L) : L)}px`;
    function v(m, L) {
      return {
        below: m.bottom - L.bottom - a.gap - xt,
        above: L.top - m.top - a.gap - xt,
        across: m.right - m.left - 2 * xt
      };
    }
    function b(m) {
      const L = f(a.anchor), P = v(L, m);
      return l.value.w <= P.across && l.value.h <= Math.max(P.below, P.above) ? L : u();
    }
    const x = I(() => {
      if (!i.value) return r.value;
      const m = i.value, L = b(m), P = v(L, m), { w: U, h: ee } = l.value, X = a.align === "auto" ? m.left + m.right > L.left + L.right : a.align === "right", K = oi(X ? m.right - U : m.left, L.left + xt, Math.max(L.left + xt, L.right - U - xt)), ve = ee > P.below && P.above > P.below ? { bottom: `${window.innerHeight - m.top + a.gap}px`, maxHeight: p(a.maxHeight, P.above) } : { top: `${m.bottom + a.gap}px`, maxHeight: p(a.maxHeight, P.below) };
      return { ...r.value, ...ve, left: `${K}px`, maxWidth: p(a.maxWidth, P.across) };
    }), $ = n, O = () => [...s.value.querySelectorAll("button:not(:disabled)")];
    function q(m) {
      const L = O(), P = L.indexOf(document.activeElement);
      L[(P + m + L.length) % L.length].focus();
    }
    const Z = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => $("close") }, _ = (m) => Z[m.key] && (m.preventDefault(), Z[m.key]()), y = () => s.value && (l.value = { w: s.value.offsetWidth, h: s.value.scrollHeight });
    let E = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame(E), E = requestAnimationFrame(y);
    });
    _o(s, (m) => a.anchor && !a.anchor.contains(m.target) && $("close"));
    const T = (m, L) => ["top", "left", "right", "bottom"].some((P) => Math.abs(m[P] - L[P]) > 1), w = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let A = 0;
    function M() {
      if (a.anchor) {
        const m = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || w(m)) return $("close");
        T(m, i.value) && (i.value = m);
      }
      A = requestAnimationFrame(M);
    }
    return Te(() => {
      a.anchor && s.value && li(s.value, a.anchor), y(), s.value && S.observe(s.value), !a.plain && O()[0] && O()[0].focus(), M();
    }), Ae(() => {
      S.disconnect(), cancelAnimationFrame(A), cancelAnimationFrame(E);
    }), t({ element: s }), (m, L) => (c(), V(za, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ge({
        ref_key: "panel",
        ref: s
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: x.value,
        onKeydown: _
      }), [
        ce(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Rn = /* @__PURE__ */ Y(ci, [["__scopeId", "data-v-3d203970"]]), ui = { class: "split-button" }, di = {
  __name: "SplitButton",
  props: { kind: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, a = B(null), s = B(!1), o = () => s.value = !1;
    return (r, l) => (c(), h("span", ui, [
      R(de, {
        kind: e.kind,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: l[0] || (l[0] = (i) => n("main"))
      }, {
        default: D(() => [
          ce(r.$slots, "default", {}, void 0, !0)
        ]),
        _: 3
      }, 8, ["kind", "small", "disabled"]),
      g("span", {
        ref_key: "arrow",
        ref: a,
        class: "split-button-arrow-place"
      }, [
        R(de, {
          kind: e.kind,
          small: e.small,
          disabled: e.disabled,
          class: "split-button-arrow",
          "aria-label": e.menuLabel,
          title: e.menuLabel,
          "aria-expanded": s.value,
          onClick: l[1] || (l[1] = (i) => s.value = !s.value)
        }, {
          default: D(() => [
            R(pe, { name: "caret" })
          ]),
          _: 1
        }, 8, ["kind", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      s.value ? (c(), V(Rn, {
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
}, fi = /* @__PURE__ */ Y(di, [["__scopeId", "data-v-ef04170d"]]), hi = ["aria-checked", "aria-haspopup", "onClick"], mi = {
  key: 0,
  class: "segmented-dot"
}, pi = {
  key: 1,
  class: "segmented-count"
}, gi = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, a = Va();
    return (s, o) => {
      const r = $l("tip");
      return c(), h("span", {
        class: J(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(G, null, te(e.options, (l) => Ke((c(), h("button", {
          key: l.key,
          type: "button",
          role: "radio",
          "aria-checked": l.key === e.value,
          "aria-haspopup": l.opens,
          class: J(["segmented-option", { on: l.key === e.value }]),
          onClick: (i) => n("pick", l.key)
        }, [
          l.dot ? (c(), h("span", mi)) : C("", !0),
          se(" " + k(l.label) + " ", 1),
          l.count !== void 0 ? (c(), h("em", pi, k(l.count), 1)) : C("", !0)
        ], 10, hi)), [
          [r, l.tip || l.title, `${H(a)}-${l.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Ln = /* @__PURE__ */ Y(gi, [["__scopeId", "data-v-ca953072"]]), Eo = typeof document < "u" && document.documentElement.classList.contains("phone");
function vi() {
  return () => {
  };
}
function xa(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Ao(e = window) {
  if (!xa(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    xa(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const $a = "journal.stale-build-reload", yi = 'script[type="module"][src*="/assets/index-"]', ys = (e) => {
  var t;
  return ((t = e.querySelector(yi)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function ki(e = document, t = fetch, n = () => Ao(window)) {
  const a = ys(e), s = a ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(s != null && s.ok)) return !1;
  const o = ys(new DOMParser().parseFromString(await s.text(), "text/html"));
  return !o || o === a ? !1 : (n(), !0);
}
let zn = "";
function bi(e, t = () => Ao(window)) {
  if (!e) return !1;
  const n = !!zn && zn !== e;
  return zn = e, n && t(), n;
}
const wi = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function xi(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem($a) === e.message) return !1;
    t.setItem($a, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function $i(e = window.sessionStorage) {
  try {
    e.removeItem($a);
  } catch {
    return;
  }
}
const Mi = 2e3, Si = 3e4, je = Ga({ starting: !1, external: !1, late: !1, offline: !1 }), Co = () => je.starting, _i = 3;
let sn = 0, Ma = 0, Oo = 0, To = [];
async function Ei() {
  try {
    const e = await Et.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: je.external };
  }
}
function Ai() {
  clearInterval(Ma), clearTimeout(Oo), Ma = 0, Object.assign(je, { starting: !1, external: !1, late: !1, offline: !1 }), To.splice(0).forEach((e) => e()), ki();
}
let Vn = !1;
async function Ci() {
  if (je.offline = !navigator.onLine, Vn) return;
  Vn = !0;
  const e = await Ei();
  if (Vn = !1, je.external = e.updating, sn = !e.restarting && !e.updating && e.reachable ? sn + 1 : 0, sn < _i) return;
  sn = 0, (!bi(e.started_at) || xa()) && Ai();
}
function ks() {
  je.starting || (je.starting = !0, je.offline = !navigator.onLine, Ma = setInterval(Ci, Mi), Oo = setTimeout(() => je.late = !0, Si));
}
const Oi = () => je.starting ? new Promise((e) => To.push(e)) : Promise.resolve(), bs = 2e4, Ti = 3e5, on = 6, Bi = 500, Ii = "/journal/summary", Ri = "/api/server-state", Li = 2e4, ws = Eo ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Ni = (e) => e.split("?")[0].endsWith(Ii), Bo = (e, t) => Object.assign(new Error(t), { status: e });
async function Di(e, t, n = Bo) {
  const a = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, a.error || t), { blocked: !!a.blocked, details: a });
  return a;
}
const Pi = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class ji {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = on;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = on;
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
        headers: { ...ws, ...r, ...a === void 0 || l ? {} : { "Content-Type": "application/json" } },
        body: Pi(a),
        signal: AbortSignal.timeout(s || (l ? Ti : bs))
      });
    } catch (i) {
      if (i instanceof TypeError && ks(), t !== "GET" || !(i instanceof TypeError) || o <= 1) throw i;
      return await new Promise((u) => setTimeout(u, Bi)), this.reach(t, n, a, s, o - 1, r);
    }
  }
  async send(t, n, a, s = 0, o = on, r = {}) {
    this.watcher("sent", t, n, a);
    const l = t === "GET" ? () => {
    } : vi(), i = await this.reach(t, n, a, s, o, r).finally(() => {
      l(), this.watcher("answered", t, n, a);
    });
    return Di(i, `${i.status} ${i.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: ws, signal: AbortSignal.timeout(bs) });
    if (!n.ok) throw Bo(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, a, s = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, a, s, on, o).then((i) => (this.written(n), i));
    if (Co() && !Ni(n))
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
    return fetch(Ri, { cache: "no-store", signal: AbortSignal.timeout(Li) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (a) {
      throw a instanceof TypeError && ks(), a;
    }
  }
}
const Et = new ji(), qi = 0, Fi = "/api/lines", Wi = "/api/line";
class Hi {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((a, s) => {
      this.waiting.push({ body: t, signal: n, resolve: a, reject: s }), this.timer ?? (this.timer = setTimeout(() => this.send(), qi));
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
        const n = await Et.raw(Fi, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((s) => s.body) }) }), { answers: a } = await n.json();
        t.forEach((s, o) => s.resolve(a[o]));
      } catch (n) {
        t.forEach((a) => a.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Et.raw(Wi, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Ui = new Hi(), zi = 150, Vi = () => zi;
function Ka(e, t, n = Vi(), a = performance.now()) {
  const s = e + n - a;
  if (s <= 0) return void t();
  setTimeout(t, s);
}
class Gi {
  constructor() {
    this.follows = [], this.held = /* @__PURE__ */ new Set();
  }
  follow(t, n, a, s = () => !0) {
    const o = { window: t, patterns: n, heard: a, visible: s };
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
      n.patterns.some((a) => Io(a, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((a) => a.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Io(e, t) {
  const [n, a] = e.split("."), [s, o] = t.split(".");
  return (n === "*" || n === s) && (a === "*" || a === o);
}
const Ro = /* @__PURE__ */ new Map();
class Ki {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = et({ buttons: [], missing: {} }), this.loading = et(!1), this.loaded = et(!1), this.failed = et(""), this.pending = null;
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
function B2(e, t) {
  const n = new Ki(e, t);
  return Ro.set(e, n), n.load().catch(() => {
  }), n;
}
const Ya = (e) => Ro.get(e);
function Yi(e, t, n) {
  const a = Ya(e);
  return a ? a.offers.value.buttons.filter((s) => s.slots.includes(t)).filter((s) => n || !s.runs.includes("{row_id}")).filter((s) => !s.condition || !n || !Object.hasOwn(n, s.condition.field) || s.condition.values.includes(n[s.condition.field])).map((s) => ({ ...s, menu: s.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((s, o) => +!!s.from - +!!o.from) : [];
}
async function Zi(e, t) {
  if (!e) return !0;
  const n = Ya(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Ji = (e) => e.slice(0, 1).toUpperCase() + e.slice(1).replaceAll("_", " ");
let Lo = {};
async function I2(e = fetch) {
  const t = await e("/api/states").catch(() => null);
  t != null && t.ok && (Lo = (await t.json()).states);
}
const Za = (e, t) => {
  var n;
  return (n = Lo[e]) == null ? void 0 : n[t];
}, No = (e, t) => {
  var n;
  return ((n = Za(e, t)) == null ? void 0 : n.label) ?? Ji(t);
}, Do = (e, t) => {
  var n;
  return ((n = Za(e, t)) == null ? void 0 : n.looks_like) ?? t;
}, Xi = (e, t) => {
  var n;
  return ((n = Za(e, t)) == null ? void 0 : n.open_moves) ?? null;
}, Qi = Symbol("pane-page"), ec = { 1: "refused", 2: "usage", 3: "fault" }, tc = 100, nc = 50, ac = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, sc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function oc({ window: e, environment: t, agent: n, visible: a, permissions: s, events: o = [], subscriptions: r, open: l, options: i = B({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: p = "", tabs: v = [], sources: b = [], links: x = {}, search: $ = {}, readOnly: O = !1, shared: q = null }) {
  const Z = /* @__PURE__ */ new Map(), _ = new AbortController(), y = B(!1), E = performance.now();
  let S = 0, T = 0;
  const w = () => {
    clearTimeout(T), T = setTimeout(() => {
      S === 0 && Ka(E, () => y.value = !0);
    }, nc);
  }, A = (M) => {
    const m = Z.get(M);
    if (m && performance.now() - m.at < tc) return m.answer;
    S += 1;
    const L = jo(e, M, t, _.signal).finally(() => {
      S -= 1, w();
    });
    return Z.set(M, { answer: L, at: performance.now() }), L;
  };
  return {
    answered: y,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: I(() => a()),
    permissions: s,
    autoScroll: p,
    tabs: v,
    sources: b,
    links: x,
    search: $,
    readOnly: O,
    shared: q,
    read: A,
    run: (M) => ft(e, M, t, _.signal),
    upload: (M) => lc(M, _.signal),
    cancel: () => _.abort(),
    subscriptions: r,
    follow: (M, m) => r.follow(e, M.filter((L) => o.some((P) => Io(P, L))), (L) => {
      Z.clear(), m(L);
    }, a),
    open: l,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (M) => I(() => {
      var m;
      return i.value[M] ?? ((m = u.find((L) => L.key === M)) == null ? void 0 : m.default);
    }),
    setting: async (M, m) => {
      const L = await A(`window setting ${e} ${M}`);
      return L.ok ? L.value.value : m;
    },
    setOption: f,
    keep: (M, m) => ft(e, ["window", "save-setting", e, M, JSON.stringify(m)], t, _.signal)
  };
}
function rc(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Wt = { ok: !1, failure: "cancelled", error: "" }, Po = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function ft(e, t, n, a = void 0) {
  try {
    const s = await Ui.add({ window: e, line: Array.isArray(t) ? t : qo(t), environment: n }, a);
    return a != null && a.aborted ? Wt : s.code === 0 ? { ok: !0, value: s.value } : { ok: !1, failure: ec[s.code] || "fault", error: rc(s.error) };
  } catch {
    return a != null && a.aborted ? Wt : { ok: !1, failure: "unreachable", error: Po };
  }
}
async function jo(e, t, n, a) {
  const s = await ft(e, t, n, a);
  return s.failure !== "unreachable" || !Co() ? s : (await Oi(), a.aborted ? Wt : jo(e, t, n, a));
}
async function lc(e, t = void 0) {
  try {
    const n = await Et.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), a = await n.json();
    return t != null && t.aborted ? Wt : n.ok ? { ok: !0, value: a.file } : { ok: !1, failure: "refused", error: a.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Wt : { ok: !1, failure: "unreachable", error: Po };
  }
}
function qo(e) {
  return [...e.matchAll(ac)].map(([t]) => t.replace(sc, (n, a, s, o) => a ?? (s === void 0 ? o : s.replace(/\\(["\\])/g, "$1"))));
}
const ic = (e) => `show-${e}`, R2 = (e, t, n) => e.filter((a) => {
  var s;
  return n(ic((s = t(a.type)) == null ? void 0 : s.family)) !== !1;
}), Fo = "messages.chat", cc = {
  key: 0,
  class: "template-brief"
}, uc = {
  key: 1,
  class: "template-failure",
  role: "alert"
}, dc = {
  __name: "ButtonTemplateField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B([]), o = B(""), r = I(() => s.value.map((u) => ({ key: String(u.id), label: u.module ? `${u.title} · ${u.module}` : u.title }))), l = I(() => s.value.find((u) => String(u.id) === n.value));
    async function i() {
      const u = await ft(Fo, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!u.ok) {
        o.value = u.error;
        return;
      }
      s.value = u.value.rows;
      const d = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = s.value.find((p) => p.title === d);
      f && a("pick", String(f.id));
    }
    return i(), (u, d) => (c(), h(G, null, [
      R(Ln, {
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: d[0] || (d[0] = (f) => a("pick", f))
      }, null, 8, ["options", "value"]),
      l.value ? (c(), h("p", cc, k(l.value.brief), 1)) : C("", !0),
      o.value ? (c(), h("p", uc, k(o.value), 1)) : C("", !0)
    ], 64));
  }
}, fc = /* @__PURE__ */ Y(dc, [["__scopeId", "data-v-8cbacb6d"]]), hc = { class: "form-field" }, mc = { class: "form-field-head" }, pc = ["for"], gc = {
  key: 0,
  class: "form-field-aside"
}, vc = {
  key: 0,
  class: "form-field-help"
}, yc = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", hc, [
      g("div", mc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, pc),
        t.$slots.aside ? (c(), h("span", gc, [
          ce(t.$slots, "aside", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      ce(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", vc, k(e.help), 1)) : C("", !0)
    ]));
  }
}, kc = /* @__PURE__ */ Y(yc, [["__scopeId", "data-v-dd7cdcff"]]), Sa = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, bc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = In(), n = I(() => Object.fromEntries(Object.entries(t).filter(([a]) => a !== "value")));
    return (a, s) => Ke((c(), h("textarea", Ge({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [H(Sa), H(t).value]
    ]);
  }
}), wc = /* @__PURE__ */ Y(bc, [["__scopeId", "data-v-e130a5b9"]]), xc = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = Va(), o = I(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, l) => (c(), V(kc, {
      label: e.field.label,
      for: H(s),
      "data-button-field": e.field.name
    }, {
      default: D(() => [
        R(Bt, { value: o.value }, {
          choice: D(() => [
            R(Ln, {
              id: H(s),
              options: e.field.choices,
              value: e.value,
              wrap: "",
              onPick: l[0] || (l[0] = (i) => a("pick", i))
            }, null, 8, ["id", "options", "value"])
          ]),
          template: D(() => [
            R(fc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: l[1] || (l[1] = (i) => a("pick", i))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: D(() => [
            R(wc, {
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
}, Nn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), V(de, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: D(() => [
        R(pe, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function $c(e, t, n, a = () => window) {
  Te(() => {
    var s;
    return (s = a()) == null ? void 0 : s.addEventListener(e, t, n);
  }), Ae(() => {
    var s;
    return (s = a()) == null ? void 0 : s.removeEventListener(e, t, n);
  });
}
const Mc = (e, t = () => !0) => $c("keydown", (n) => n.key === "Escape" && t() && e());
function Wo(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, a = B(!1), s = I(() => n() ? t.open : !a.value), o = () => {
    n() || (a.value = !0), e("dismiss");
  };
  return Mc(o, () => !n() && t.closable !== !1), { visible: s, close: o, closed: () => e("close") };
}
const Sc = 80, $t = Ga([]);
function Ho(e) {
  const t = Symbol("layer"), n = () => $t.includes(t) && $t.splice($t.indexOf(t), 1);
  return me(
    e,
    (a) => {
      a && !$t.includes(t) && $t.push(t), a || n();
    },
    { immediate: !0 }
  ), Ae(n), I(() => Sc + Math.max(0, $t.indexOf(t)));
}
let Uo = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Uo = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const _c = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Ec(e, t, n = e) {
  let a = null;
  function s(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(_c)];
    if (!r.length) return o.preventDefault();
    const [l, i] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === l ? (o.preventDefault(), i.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === i && (o.preventDefault(), l.focus({ preventScroll: !0 }));
  }
  Te(() => {
    a = document.activeElement && document.activeElement !== document.body ? document.activeElement : Uo, document.addEventListener("keydown", s), st(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ae(() => {
    var o;
    document.removeEventListener("keydown", s), (o = a == null ? void 0 : a.focus) == null || o.call(a, { preventScroll: !0 });
  });
}
const Ac = ["aria-modal", "aria-label", "aria-labelledby"], Cc = {
  key: 0,
  class: "dialog-head"
}, Oc = ["id", "tabindex"], Tc = {
  key: 1,
  class: "dialog-foot"
}, Bc = 500, Ic = 400, Rc = {
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
    const n = e, a = t, { visible: s, close: o, closed: r } = Wo(a, n), l = Ho(s), i = B(null), u = B(null), d = B(null), f = Va(), p = B(!1), v = Date.now();
    n.modal && Ec(u, () => a("escape"), d);
    function b() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, Ic);
    }
    function x(q) {
      !n.modal || Date.now() - v >= Bc || ![" ", "Enter"].includes(q.key) || (q.preventDefault(), q.stopPropagation());
    }
    const $ = () => i.value && (i.value.scrollTop = i.value.scrollHeight), O = new MutationObserver($);
    return me(i, (q) => {
      O.disconnect(), q && n.follow && (O.observe(q, { childList: !0, subtree: !0, characterData: !0 }), $());
    }), Ae(() => O.disconnect()), (q, Z) => (c(), V(za, { to: "body" }, [
      R(Ot, {
        name: "dialog",
        appear: "",
        onAfterLeave: H(r)
      }, {
        default: D(() => [
          H(s) ? (c(), h("div", {
            key: 0,
            class: J(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: H(l) }),
            onClick: ke(b, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: J(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? H(f) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? C("", !0) : (c(), h("header", Cc, [
                g("h3", {
                  id: H(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, Oc),
                e.closable ? (c(), V(Nn, {
                  key: 0,
                  onClick: H(o)
                }, null, 8, ["onClick"])) : C("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: i,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                ce(q.$slots, "default", {}, void 0, !0)
              ], 2),
              q.$slots.foot ? (c(), h("footer", Tc, [
                ce(q.$slots, "foot", {}, void 0, !0)
              ])) : C("", !0)
            ], 42, Ac)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, zo = /* @__PURE__ */ Y(Rc, [["__scopeId", "data-v-6d1ecd98"]]), Lc = (e, t, n = {}) => qo(e.runs).map((a) => a.replace(/\{(\w+)\}/g, (s, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function Zt(e, t, n, a = {}) {
  try {
    return await Zi(e.module, n) ? ft(Fo, Lc(e, t, a), n) : { ok: !1, error: "" };
  } catch (s) {
    return { ok: !1, error: s.message };
  }
}
const Nc = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Gn = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], he = (e, t, n, a = {}) => ({
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
  messages: he("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: he("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: he("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
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
  tasks: he("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: Gn
  }),
  reports: he("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: he("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: he("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: he("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: he("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: he("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: he("Pin", "band", "One line pinned to the chat while it matters", { filters: Gn }),
  reactions: he("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: he("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: he("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: he("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: he("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: he("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: he("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: he("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: he("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  subagents: he("Subagent", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: he("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: he("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: he("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: he("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: he("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: he("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: he("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Dc = ["secrets", "plugins"], Vo = Object.keys(Dn).filter((e) => !(Eo && Dc.includes(e)));
I(() => Vo.map((e) => ({ name: e, ...Dn[e] })));
const It = (e) => Dn[e], Go = new Map(Vo.flatMap((e) => [e, e.replace(/s$/, ""), Dn[e].title.toLowerCase()].map((t) => [t, e]))), ze = (e) => Go.get(String(e).toLowerCase()) || "", Ko = [...Go.keys()].sort((e, t) => t.length - e.length).join("|"), Pc = {
  class: "button-form",
  "data-button-form": ""
}, jc = {
  key: 0,
  class: "button-form-title"
}, qc = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, Fc = { class: "button-form-actions" }, Wc = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(Object.fromEntries(n.button.fields.map((d) => [d.name, d.default || ""]))), o = B(!1), r = B(""), l = I(() => n.button.fields.every((d) => s.value[d.name].trim().length > 0)), i = I(() => {
      var f;
      if (!n.row) return n.button.label;
      const d = ((f = It(ze(n.row.kind))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${d} ${n.row.id}`;
    });
    async function u() {
      if (o.value || !l.value) return;
      o.value = !0;
      const d = await Zt(n.button, n.row, n.environment, s.value);
      o.value = !1, r.value = d.ok ? "" : d.error, d.ok && (a("done"), a("close"));
    }
    return (d, f) => (c(), V(zo, {
      title: i.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (p) => a("close"))
    }, {
      default: D(() => {
        var p;
        return [
          g("div", Pc, [
            (p = e.row) != null && p.title ? (c(), h("p", jc, k(e.row.title), 1)) : C("", !0),
            (c(!0), h(G, null, te(e.button.fields, (v) => (c(), V(xc, {
              key: v.name,
              field: v,
              value: s.value[v.name],
              environment: e.environment,
              onPick: (b) => s.value[v.name] = b
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            r.value ? (c(), h("p", qc, k(r.value), 1)) : C("", !0),
            g("div", Fc, [
              R(de, {
                small: "",
                onClick: f[0] || (f[0] = (v) => a("close"))
              }, {
                default: D(() => [...f[2] || (f[2] = [
                  se("Cancel", -1)
                ])]),
                _: 1
              }),
              R(de, {
                kind: "primary",
                small: "",
                disabled: !l.value || o.value,
                busy: o.value,
                "data-button-send": "",
                onClick: u
              }, {
                default: D(() => [...f[3] || (f[3] = [
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
}, Hc = /* @__PURE__ */ Y(Wc, [["__scopeId", "data-v-879955be"]]), Uc = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, zc = {
  key: 1,
  class: "menu-item-text"
}, Vc = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Uc, k(e.checked ? "✓" : ""), 1)) : C("", !0),
      e.description ? (c(), h("span", zc, [
        g("span", null, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, k(e.description), 1)
      ])) : ce(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ht = /* @__PURE__ */ Y(Vc, [["__scopeId", "data-v-fec99974"]]), Gc = ["aria-busy"], Kc = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Yc = {
  __name: "ButtonSlot",
  props: { name: { type: String, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 }, readOnly: Boolean },
  emits: ["done"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Ya(n.environment)), o = I(() => {
      var b;
      return !n.readOnly && ((b = s.value) == null ? void 0 : b.loading.value) && (!s.value.loaded.value || s.value.failed.value);
    }), r = I(() => {
      var b;
      return !n.readOnly && ((b = s.value) == null ? void 0 : b.failed.value);
    }), l = () => s.value.load().catch(() => {
    }), i = I(() => n.readOnly ? [] : Yi(n.environment, n.name, n.row)), u = B(null), d = B(""), f = B(!1), p = (b) => [b.from ? `From ${b.from}` : "", b.tip].filter(Boolean).join(" · ");
    async function v(b) {
      if (f.value || n.readOnly) return;
      if (b.fields.length) {
        u.value = b;
        return;
      }
      f.value = !0;
      const x = await Zt(b, n.row, n.environment);
      f.value = !1, d.value = x.ok ? "" : x.error, x.ok && a("done");
    }
    return (b, x) => (c(), h("span", {
      class: J(["button-slot", { loading: o.value }]),
      "aria-busy": !!o.value
    }, [
      !o.value && r.value ? (c(), h(G, { key: 0 }, [
        x[3] || (x[3] = g("span", {
          class: "button-slot-failure",
          role: "alert"
        }, "Buttons could not be loaded.", -1)),
        R(de, {
          small: "",
          onClick: l
        }, {
          default: D(() => [...x[2] || (x[2] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : o.value ? C("", !0) : (c(), h(G, { key: 1 }, [
        (c(!0), h(G, null, te(i.value, ($) => (c(), h(G, {
          key: $.name
        }, [
          $.menu.length ? (c(), V(fi, {
            key: 0,
            small: "",
            kind: $.primary ? "primary" : "ghost",
            disabled: f.value,
            "menu-label": $.menu_label || "More ways",
            title: p($),
            "data-button": $.name,
            onMain: (O) => v($)
          }, {
            menu: D(({ close: O }) => [
              (c(!0), h(G, null, te($.menu, (q) => (c(), V(ht, {
                key: q.label,
                description: q.description,
                onClick: (Z) => (O(), v({ ...$, ...q, menu: [] }))
              }, {
                default: D(() => [
                  se(k(q.label), 1)
                ]),
                _: 2
              }, 1032, ["description", "onClick"]))), 128))
            ]),
            default: D(() => [
              se(k($.label) + " ", 1)
            ]),
            _: 2
          }, 1032, ["kind", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), V(de, {
            key: 1,
            small: "",
            kind: $.primary ? "primary" : "ghost",
            bordered: !$.primary,
            icon: $.icon,
            disabled: f.value,
            title: p($),
            "data-button": $.name,
            onClick: (O) => v($)
          }, {
            default: D(() => [
              se(k($.label), 1)
            ]),
            _: 2
          }, 1032, ["kind", "bordered", "icon", "disabled", "title", "data-button", "onClick"]))
        ], 64))), 128)),
        d.value && !e.readOnly ? (c(), h("span", Kc, k(d.value), 1)) : C("", !0),
        u.value && !e.readOnly ? (c(), V(Hc, {
          key: u.value.runs,
          button: u.value,
          row: e.row,
          environment: e.environment,
          onClose: x[0] || (x[0] = ($) => u.value = null),
          onDone: x[1] || (x[1] = ($) => a("done"))
        }, null, 8, ["button", "row", "environment"])) : C("", !0)
      ], 64))
    ], 10, Gc));
  }
}, Zc = /* @__PURE__ */ Y(Yc, [["__scopeId", "data-v-babd6653"]]), Jc = {
  class: "running",
  "data-running-command": ""
}, Xc = ["title"], Qc = {
  key: "idle",
  class: "running-idle"
}, eu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Jc, [
      R(Ot, {
        name: "roll",
        mode: "out-in"
      }, {
        default: D(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, Xc)) : (c(), h("span", Qc, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, L2 = /* @__PURE__ */ Y(eu, [["__scopeId", "data-v-d3240219"]]), tu = ["aria-checked", "aria-label", "title"], nu = {
  key: 0,
  class: "switch-inner"
}, au = {
  key: 0,
  class: "switch-word"
}, su = {
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
        e.labelled ? (c(), h("span", nu, k(e.word), 1)) : C("", !0),
        s[1] || (s[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", au, k(e.word), 1)) : C("", !0)
    ], 10, tu));
  }
}, N2 = /* @__PURE__ */ Y(su, [["__scopeId", "data-v-1bfb90f3"]]);
function Yo(e, t, n) {
  try {
    const a = e().getItem(t);
    return a === null ? n : JSON.parse(a);
  } catch {
    return n;
  }
}
function wn(e, t) {
  return Yo(() => localStorage, e, t);
}
function Zo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Ja(e, t) {
  return Zo(() => localStorage, e, t);
}
function Jo(e, t) {
  me(t, (n) => Ja(e, n), { deep: !0 });
}
function ou(e, t) {
  return Yo(() => sessionStorage, e, t);
}
function ru(e, t) {
  return Zo(() => sessionStorage, e, t);
}
const xn = "journal.environment", Xo = B(ou(xn, wn(xn, "")));
function lu(e) {
  Xo.value = e, ru(xn, e), Ja(xn, e);
}
const $n = B(location.hash), xs = et(null), $s = { integrations: "mcp", library: "team" };
function iu() {
  if (!xs.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...a] = e.split("/");
  if ($s[n]) {
    location.replace(`#/${[$s[n], ...a].join("/")}${t ? `?${t}` : ""}`), $n.value = location.hash;
    return;
  }
  !n || xs.value(n) || (lu(n), location.replace(`#/${a.join("/")}${t ? `?${t}` : ""}`), $n.value = location.hash);
}
window.addEventListener("hashchange", () => {
  $n.value = location.hash, iu();
});
const _a = I(() => {
  const [e, t = ""] = $n.value.replace(/^#\/?/, "").split("?"), [n = "", a = ""] = e.split("/"), s = new URLSearchParams(t), o = (s.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [l, i = ""] = r.split("@"), [u = "", d = "", f = ""] = l.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: i };
  });
  return {
    env: Xo.value,
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
}), Xa = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Xa.page(e)}?open=${t}`
};
function cu(e = "", t = 0, n = "") {
  location.hash = Xa.page(e, t, n);
}
const uu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Qo(e, t = "") {
  const [n, a = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(a)].filter(([r]) => r !== "open" && r !== "sub").map(([r, l]) => `${r}=${encodeURIComponent(l)}`), ...e.length ? [`open=${e.map(uu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const St = {};
function D2(e, t) {
  return St[e] = t, () => St[e] === t && delete St[e];
}
function er(e, t, n = 0, a = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !a && ((r = St[e]) != null && r.call(St, t))) return;
  const s = _a.value.stack, o = s.findIndex((l) => l.table === e && l.id === t);
  Qo([...o < 0 ? s : s.slice(0, o), { table: e, id: t, comment: n }], a);
}
function du(e, t, n, a = 0, s = "") {
  if (e === _a.value.env) return er(t, n, a, s);
  const o = _a.value.stack, r = o.findIndex((l) => l.table === t && l.id === n && l.env === e);
  Qo([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: a, env: e }], s);
}
function Ne(e, t = "") {
  const [n, a] = e.split("@"), [s, o] = n.split(":");
  return a ? du(a, s, Number(o), 0, t) : er(s, Number(o), 0, t);
}
function fu(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Mt(e) {
  const t = fu(e);
  t && Ne(t, e.target.closest("[data-peek]").dataset.sub || "");
}
function P2(e, t, n) {
  const a = e.indexOf(t);
  return e[a < 0 ? 0 : Math.max(0, Math.min(e.length - 1, a + n))];
}
const hu = {
  key: 1,
  class: "row-list-failure"
}, mu = ["data-row"], pu = {
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
    const t = e, n = I(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), a = B(!1);
    async function s(o) {
      a.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), V(gt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", hu, k(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), V(bn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: D(() => [
        se(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(G, { key: 3 }, [
      (c(), V(pt(e.arrival ? wo : "ul"), Ge(n.value, { class: "row-list" }), {
        default: D(() => [
          (c(!0), h(G, null, te(e.rows, (l) => (c(), h("li", {
            key: l.id,
            class: "row-list-row",
            "data-row": l.id
          }, [
            ce(o.$slots, "default", { row: l }, void 0, !0)
          ], 8, mu))), 128))
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
}, gu = /* @__PURE__ */ Y(pu, [["__scopeId", "data-v-aa6ad7ff"]]), vu = {
  class: "agent-rows",
  "data-agent-rows": ""
}, yu = {
  key: 1,
  class: "agent-rows-note"
}, ku = {
  key: 2,
  class: "agent-rows-note"
}, bu = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, wu = ["data-agent-row", "onClick"], xu = { class: "agent-row-name" }, $u = { class: "agent-row-state" }, Mu = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => [...t.rows].sort((s, o) => !!s.ended_at - !!o.ended_at || o.id - s.id)), a = I(() => t.rows.filter((s) => !s.ended_at).length);
    return (s, o) => (c(), h("div", vu, [
      e.loaded ? e.failure ? (c(), h("p", yu, k(e.failure), 1)) : e.rows.length ? (c(), h(G, { key: 3 }, [
        g("p", bu, k(a.value) + " running", 1),
        (c(!0), h(G, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (l) => H(Ne)(`agents:${r.id}`)
        }, [
          g("span", xu, "#" + k(r.id) + " " + k(r.session), 1),
          g("span", $u, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, wu))), 128))
      ], 64)) : (c(), h("p", ku, k(e.none), 1)) : (c(), V(gt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, j2 = /* @__PURE__ */ Y(Mu, [["__scopeId", "data-v-a01e5a17"]]), Su = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["badge", e.tone])
    }, k(e.text), 3));
  }
}, tr = /* @__PURE__ */ Y(Su, [["__scopeId", "data-v-9e7e1157"]]), _u = ["aria-valuenow", "aria-valuemax"], Eu = {
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
      class: J(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      g("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, _u));
  }
}, Au = /* @__PURE__ */ Y(Eu, [["__scopeId", "data-v-9eba6a85"]]), Cu = { class: "bars" }, Ou = { class: "bar-name" }, Tu = { class: "bar-value" }, Bu = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = I(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, l) => (c(), h("div", Cu, [
      (c(!0), h(G, null, te(e.items, (i, u) => (c(), V(pt(i.open ? "button" : "div"), {
        key: `${u}-${i.label}`,
        type: i.open ? "button" : void 0,
        class: J(["bar-row", i.tone, { opens: i.open }]),
        onClick: (d) => i.open && a("open", i.open)
      }, {
        default: D(() => [
          g("span", Ou, k(i.label), 1),
          R(Au, {
            value: Number(i.value) || 0,
            max: s.value,
            tone: i.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", Tu, k(i.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Iu = /* @__PURE__ */ Y(Bu, [["__scopeId", "data-v-663427f4"]]), Ru = { class: "bars" }, Lu = {
  key: 0,
  class: "bars-title"
}, Nu = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Ru, [
      e.node.title ? (c(), h("span", Lu, k(e.node.title), 1)) : C("", !0),
      R(Iu, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: s[0] || (s[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Du = /* @__PURE__ */ Y(Nu, [["__scopeId", "data-v-7135bb11"]]), Pu = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, a = e, s = t, o = I(() => n[a.node.type](a.node));
    return (r, l) => (c(), h("div", {
      class: J([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(G, null, te(e.node.children || [], (i, u) => (c(), V(gr, {
        key: u,
        node: i,
        onOpen: l[0] || (l[0] = (d) => s("open", d)),
        onFile: l[1] || (l[1] = (d) => s("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, mn = /* @__PURE__ */ Y(Pu, [["__scopeId", "data-v-d142a3f4"]]), ju = {
  key: 0,
  class: "card-head"
}, qu = { class: "card-title" }, Fu = {
  key: 0,
  class: "card-note"
}, Wu = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: s[2] || (s[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", ju, [
        g("span", qu, k(e.node.title), 1),
        e.node.note ? (c(), h("span", Fu, k(e.node.note), 1)) : C("", !0)
      ])) : C("", !0),
      R(mn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: s[0] || (s[0] = (o) => n("open", o)),
        onFile: s[1] || (s[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Hu = /* @__PURE__ */ Y(Wu, [["__scopeId", "data-v-67b72d40"]]), Uu = { processes: "process", memories: "memory", replies: "reply" }, Mn = (e) => (Uu[e] ?? e.replace(/s$/, "")).replace(/_/g, "-"), Ea = [], zu = 2e3, Xe = /* @__PURE__ */ new Map(), Vu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Gu = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function yt(e, { first: t = !1 } = {}) {
  t ? Ea.unshift(e) : Ea.push(e), Xe.clear();
}
function nr(e, t, n) {
  var s, o;
  const a = (s = e.row) == null ? void 0 : s.call(e, t, n);
  return (o = e.reads) == null || o.push({ table: t, id: n, row: a }), a;
}
const Ku = (e, t) => {
  var n;
  return ((n = t.row) == null ? void 0 : n.call(t, e.table, e.id)) === e.row;
}, Yu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function Ve(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Zu(e, t) {
  const n = [{ kind: "text", text: Ve(e).replace(/\r\n/g, `
`) }];
  for (const a of Ea)
    for (let s = n.length - 1; s >= 0; s--) {
      const o = n[s];
      if (o.kind !== "text") continue;
      const r = a(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(s, 1, ...r);
    }
  return n;
}
function Ht(e) {
  const t = [], a = e.replace(/`([^`\n]+)`/g, (s, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Ju(a).replace(/\u0000(\d+)\u0000/g, (s, o) => t[Number(o)]);
}
function Ju(e) {
  return e.split(Gu).map((t, n) => n % 2 ? t : t.replace(Vu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ms(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
const Xu = 24;
function Qu(e) {
  const [t, , ...n] = e, a = Ms(t), s = n.map(Ms), o = (i) => [a, ...s].some((u) => (u[i] ?? "").length > Xu) ? ' class="text-column"' : "", r = a.map((i, u) => `<th${o(u)}>${Ht(i)}</th>`).join(""), l = s.map((i) => `<tr>${i.map((u, d) => `<td${o(d)}>${Ht(u)}</td>`).join("")}</tr>`).join("");
  return `<table><thead><tr>${r}</tr></thead><tbody>${l}</tbody></table>`;
}
const ar = /^\s*(?:[-*+]|\d+[.)])\s+/, Aa = /^\s*(\d+)[.)]\s/, Ss = (e) => e.match(/^\s*/)[0].length;
function sr(e) {
  const t = e[0].match(Aa), n = Ss(e[0]), a = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), l = a[a.length - 1];
    r && Ss(o) <= n ? a.push({ text: r[2], nested: [] }) : l && o.trim() && (r || l.nested.length) ? l.nested.push(o) : l && o.trim() && (l.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${a.map((o) => `<li>${Ht(o.text)}${o.nested.length ? sr(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function ed(e, t) {
  const n = Aa.test(e[t]);
  let a = t + 1;
  for (let s = a; s < e.length; s += 1)
    if (ar.test(e[s]) && Aa.test(e[s]) === n || s === a && /^\s{2,}\S/.test(e[s])) a = s + 1;
    else if (e[s].trim()) break;
  return a;
}
const _s = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function or(e) {
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
      n.push(`<h${l}>${Ht(o[2])}</h${l}>`), a += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(s)) {
      n.push("<hr>"), a += 1;
      continue;
    }
    if (_s(t, a)) {
      let l = a + 2;
      for (; l < t.length && t[l].includes("|"); ) l += 1;
      n.push(Qu(t.slice(a, l))), a = l;
      continue;
    }
    if (ar.test(s)) {
      const l = ed(t, a);
      n.push(sr(t.slice(a, l))), a = l;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(s)) {
      let l = a;
      for (; l < t.length && /^(?:>|&gt;)\s?/.test(t[l]); ) l += 1;
      n.push(
        `<blockquote>${or(
          t.slice(a, l).map((i) => i.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), a = l;
      continue;
    }
    let r = a;
    for (; r < t.length && t[r].trim() && !_s(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Ht(t.slice(a, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), a = r;
  }
  return n.join("");
}
const td = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, nd = (e) => e.kind !== "text" && !td.test(e.html);
function ad(e) {
  const t = [], n = [];
  let a = "";
  const s = () => {
    a && n.push(or(a).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), a = "";
  };
  for (const o of e)
    o.kind === "text" ? a += o.text : nd(o) ? a += `${t.push(o.html) - 1}` : (s(), n.push(o.html));
  return s(), n.filter(Boolean).join("");
}
function sd(e, t = { env: "" }) {
  const n = Yu(e, t), a = Xe.get(n);
  if (Xe.delete(n), a && a.source === t.source && a.reads.every((r) => Ku(r, t)))
    return Xe.set(n, a), a.html;
  const s = [], o = ad(Zu(e, { ...t, reads: s }));
  return Xe.set(n, { html: o, reads: s, source: t.source }), Xe.size > zu && Xe.delete(Xe.keys().next().value), o;
}
const Kn = /* @__PURE__ */ new WeakMap();
function od(e) {
  if (Kn.has(e)) return Kn.get(e);
  const t = Ml(/* @__PURE__ */ new Map()), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (u, d) => `${u}:${d}`;
  function o(u, d) {
    const f = s(u, d), p = e.read(`${Mn(u)} show ${d}`);
    n.set(f, p), p.then((v) => {
      n.get(f) === p && (n.delete(f), t.set(f, v.ok ? { ...v.value, table: u } : null));
    });
  }
  function r(u) {
    a.has(u) || (a.add(u), e.follow([`${Mn(u).replace(/-/g, "_")}.*`], (d) => {
      const f = `${u}:`;
      for (const p of t.keys()) {
        if (!p.startsWith(f)) continue;
        const v = Number(p.slice(f.length));
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
  return Kn.set(e, i), i;
}
function rr() {
  const e = $e(Se, null), t = e ? od(e) : null;
  return (n, a = {}) => sd(n, { ...a, env: (e == null ? void 0 : e.environment) ?? "", source: t == null ? void 0 : t.id, row: t == null ? void 0 : t.row });
}
const lr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Jt = (e) => String(e || "").replace(lr, (t, n, a, s) => s), rd = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), rn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, ld = /^Traceback \(most recent call last\):/m, id = 8;
function ir(e) {
  const t = e.map(
    (s) => `<div class="console-entry"><div class="console-head">${s.head}</div>${s.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, a = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, id).map((s) => `<div class="console-frame">${s}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? a + n : t}</div>`;
}
function cd(e) {
  const t = [...e.matchAll(rd)].map((a) => a.index);
  if (rn.lastIndex = 0, !t.length || !rn.test(e)) return null;
  rn.lastIndex = 0;
  const n = t.map((a, s) => {
    const o = e.slice(a, s + 1 < t.length ? t[s + 1] : e.length).trim(), r = [...o.matchAll(rn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((l) => l[0].trim()) };
  });
  return n.some((a) => a.frames.length) ? { lead: e.slice(0, t[0]), html: ir(n), tail: "" } : null;
}
function ud(e) {
  const t = ld.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), a = [n[0]];
  let s = 1;
  for (; s < n.length && n[s].trim() && (a.push(n[s]), s++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(a[a.length - 1])); )
    ;
  const o = { head: a[a.length - 1], frames: a.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: ir([o]), tail: n.slice(s).join(`
`) };
}
yt((e) => {
  const t = Jt(e), n = ud(t) || cd(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const dd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, fd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, hd = /[\w\]]\(/, md = /^[\w$.[\]'"]+\s*=\s*[^=]/, pd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, gd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, vd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, yd = /[[({,]$/, kd = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, bd = /^(\t|\s{2,})\S/, wd = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, xd = /`[^`]+`/, $d = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Md = /[{}()[\];=<>$&|*\\@+^~%]/g, cr = /^\s*(?:[-*+]|\d+[.)])\s/, Sd = /^\s*>/, _d = /^\s*\|/, Ed = 0.6, Ad = 0.4, Cd = 5, Od = 0.03, ur = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Cd && t.every((n) => $d.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Md) ?? []).length / e.length < Od;
}, Yn = (e) => {
  const t = e.trim();
  return xd.test(t) ? !1 : [dd, fd, hd, md, pd, gd, vd, yd, kd].some((n) => n.test(t)) || /[;{}]$/.test(t) || bd.test(e) && !cr.test(e) && !ur(e);
};
function Td(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || cr.test(t[0]) || t.every((o) => Sd.test(o) || _d.test(o))) return "text";
  const n = t.filter((o) => !wd.test(o.trim()));
  if (t.length === 1) return !n.length || Yn(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const a = n.filter(Yn).length, s = n.filter((o) => !Yn(o) && ur(o)).length;
  return a >= n.length * Ed && s <= n.length * Ad ? "code" : "text";
}
const Ca = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Bd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Id = `${Ca} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Rd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Ld = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Es = {
  js: { keywords: Ca, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Bd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Id, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ca, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Rd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Ld, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, Nd = {
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
function Dd(e, t) {
  const n = Es[Nd[t] ?? t] || Es.text, a = new Set(n.keywords.split(" ").filter(Boolean)), s = [];
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
function Pd(e, t) {
  const n = [""];
  for (const { kind: a, value: s } of Dd(e, t))
    s.split(`
`).forEach((r, l) => {
      l && n.push(""), r && (n[n.length - 1] += a === "plain" ? Ve(r) : `<span class="tok-${a}">${Ve(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function jd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const qd = 1500, Cs = /* @__PURE__ */ new WeakMap();
async function Fd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await jd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Cs.get(t)), Cs.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, qd)
  )));
}
typeof document < "u" && document.addEventListener("click", Fd, !0);
const Wd = /\n\s*\n/, Hd = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Ud = /^\s*(`{3,}|~{3,})\s*$/, zd = /^\s{4,}\S/, Vd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Oa = /^\s*(?:[-*+]|\d+[.)])\s/, dr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Gd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Qa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Kd(e) {
  const t = Qa(e.join(`
`));
  return (Gd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Yd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && dr.test(t) && !Oa.test(t);
}, Zd = (e, t) => Oa.test(t) || Oa.test([...e].reverse().find((n) => n.trim()) || "");
function es(e, t) {
  const n = t || Kd(e), a = Pd(Qa(e.join(`
`)), n).map((s) => `<span class="code-line">${s}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${a}</code></pre></div>` };
}
function Jd(e, t, n) {
  const a = e.findIndex((s, o) => o > t && s.trim().startsWith(n) && Ud.test(s));
  return a < 0 ? e.length : a;
}
function Xd(e, t, n) {
  const a = e.map((s) => s.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return es(a.map(Jt), n ? n.toLowerCase() : "");
}
function Qd(e) {
  const t = e.split(Wd).map((r) => ({ paragraph: r, kind: Td(Qa(r).split(`
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
      s(), n.push(es(l.map(({ paragraph: i }) => i).join(`

`).split(`
`).map(Jt), "")), o = r;
      continue;
    }
    a.push(t[o].paragraph), o += 1;
  }
  return s(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function ef(e, t) {
  const n = e.split(`
`), a = [];
  let s = [];
  const o = () => {
    s.length && a.push(...t ? [{ kind: "text", text: s.join(`
`) }] : Qd(s.join(`
`))), s = [];
  };
  let r = 0;
  for (; r < n.length; ) {
    const l = n[r].match(Hd);
    if (l) {
      const u = Jd(n, r, l[2]);
      o(), a.push(Xd(n.slice(r + 1, u), l[1], l[3])), r = u + 1;
      continue;
    }
    const i = Yd(s) ? Vd : zd;
    if (!t && i.test(n[r]) && !Zd(s, n[r])) {
      let u = r;
      for (; u < n.length && (i.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && dr.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (u - r + d.length >= 2) {
        o(), a.push(es([...d, ...n.slice(r, u)].map(Jt), "")), r = u;
        continue;
      }
      s.push(...d);
    }
    s.push(n[r]), r += 1;
  }
  return o(), a.length > 1 || a[0] && a[0].kind === "html" ? a : null;
}
yt((e, t) => ef(e, t.document));
const Sn = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, fr = (e) => `${e.table}:${e.id}`, Os = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", Zn = 80;
function Ts(e) {
  return e.length <= Zn ? e : `${e.slice(0, Zn + 1).replace(/\s+\S*$/, "") || e.slice(0, Zn)}…`;
}
const Bs = {
  messages: (e) => Ts(Os(e.text)),
  comments: (e) => Ts(Os(e.text)),
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
}, tf = (e) => (Bs[e.table] ? Bs[e.table](e) : e.title || "") || "", mt = (e) => Sn(e.created_at), hr = (e) => Sn(e.updated_at) || mt(e), nf = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, af = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function sf(e) {
  const t = nf.exec(e);
  if (t && ze(t[1])) return { at: t.index, length: t[0].length, table: ze(t[1]), id: Number(t[2]), label: t[3] };
  const n = af.exec(e), a = n && ze(n[1]);
  return a ? { at: n.index, length: n[0].length, table: a, id: Number(n[2]), label: n[0] } : null;
}
function of(e, t, n, a) {
  const s = nr(a, e, t), o = Jt(s ? tf(s) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ve(It(e).title)} ${t}</span><span class="row-card-title">${Ve(o)}</span></a>`;
}
yt(
  (e, t) => {
    const n = sf(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: of(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const rf = /\.(png|jpe?g|gif|webp|svg)$/i, lf = (e) => rf.test(e), cf = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, uf = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function df(e, t) {
  const n = cf.exec(e), [, a, s, o, r, l] = n || [], i = n && ze(a || o), u = i && nr(t, i, Number(s || r));
  if (i !== "messages" || !u || !(u.files || []).includes(l)) return null;
  const d = `/api/files/message/${u.id}/${encodeURIComponent(l)}`, f = `${It(i).title} ${u.id} · ${Ve(l)}`, p = lf(l) ? `<img class="file-card-image" src="${d}" alt="${Ve(l)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${Ve(l)}">${p}<span class="file-card-name">${f}</span></a>` };
}
function ff(e) {
  const t = uf.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ve(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
yt(
  (e, t) => {
    if (t.inline) return null;
    const n = df(e, t) || ff(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const hf = /`([^`\n]+)`/g;
yt((e) => e.replace(hf, (t, n) => `<code>${n}</code>`));
const Is = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, a] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Xa.file(n, a)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
yt(
  (e, t) => e.replace(lr, (n, a, s, o) => Is[a] ? Is[a](s, o, t) : o)
);
const mf = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, mr = new RegExp(`\\b(${Ko}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), pr = new RegExp(`\\b(${Ko}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), pf = new RegExp(`<code>((?:${mr.source}|${pr.source}))</code>`, "gi"), gf = (e) => e.replace(pf, "$1"), vf = (e, t) => `<a class="row-pill" href="#" data-peek="${ze(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, yf = (e) => e.replace(pr, (t, n, a) => a.replace(/\d+/g, (s) => vf(n.replace(/s$/i, ""), s))), kf = (e) => yf(e).replace(
  mr,
  (t, n, a, s = "", o) => {
    const r = a || o;
    return `<a class="row-pill" href="#" data-peek="${ze(n)}:${r}"${s ? ` data-sub="${s}"` : ""}>${n} <span class="row-pill-num">${r}${s ? `:${s}` : ""}</span></a>`;
  }
);
yt(
  (e, t) => t.rowNames === !1 ? e : gf(e).split(mf).map((n, a) => a % 2 ? n : kf(n)).join("")
);
const bf = ["innerHTML"], wf = ["innerHTML"], xf = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = rr(), a = I(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((r) => r.trim()) || "" : t.text, o = n(s, { rowNames: t.rowNames, inline: t.inline });
      return t.inline ? o.replace(/^<p>|<\/p>\s*$/g, "") : o;
    });
    return (s, o) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: o[0] || (o[0] = (...r) => H(Mt) && H(Mt)(...r)),
      innerHTML: a.value
    }, null, 8, bf)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: o[1] || (o[1] = (...r) => H(Mt) && H(Mt)(...r)),
      innerHTML: a.value
    }, null, 8, wf));
  }
}, tt = /* @__PURE__ */ Y(xf, [["__scopeId", "data-v-d8e75741"]]), $f = { class: "fact" }, Mf = { class: "fact-label" }, Sf = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", $f, [
      g("span", Mf, k(e.label), 1),
      R(tt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, _f = /* @__PURE__ */ Y(Sf, [["__scopeId", "data-v-3a88ecf8"]]), Ef = { class: "list" }, Af = { class: "list-label" }, Cf = {
  key: 1,
  class: "list-note"
}, Of = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", Ef, [
      (c(!0), h(G, null, te(e.items, (o, r) => (c(), V(pt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (l) => o.open && n("open", o.open)
      }, {
        default: D(() => [
          g("span", Af, k(o.label), 1),
          o.badge ? (c(), V(tr, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : C("", !0),
          o.note ? (c(), h("span", Cf, k(o.note), 1)) : C("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Tf = /* @__PURE__ */ Y(Of, [["__scopeId", "data-v-ebe2ae0a"]]), Bf = { class: "table" }, If = {
  key: 0,
  class: "table-row empty"
}, Rf = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", Bf, [
      g("div", {
        class: "table-row head",
        style: fe(s.value)
      }, [
        (c(!0), h(G, null, te(e.columns, (l) => (c(), h("span", {
          key: l,
          class: "cell"
        }, k(l), 1))), 128))
      ], 4),
      (c(!0), h(G, null, te(e.rows, (l, i) => (c(), V(pt(l.open ? "button" : "div"), {
        key: i,
        type: l.open ? "button" : void 0,
        class: J(["table-row", l.tone, { opens: l.open }]),
        style: fe(s.value),
        onClick: (u) => l.open && a("open", l.open)
      }, {
        default: D(() => [
          (c(!0), h(G, null, te(l.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, k(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", If, k(e.empty), 1)) : C("", !0)
    ]));
  }
}, Lf = /* @__PURE__ */ Y(Rf, [["__scopeId", "data-v-9326a52e"]]), Nf = { class: "stat-value" }, Df = { class: "stat-label" }, Pf = {
  key: 0,
  class: "stat-note"
}, jf = {
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
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: s[0] || (s[0] = (o) => e.opens && n("open"))
    }, {
      default: D(() => [
        g("span", Nf, k(e.value), 1),
        g("span", Df, k(e.label), 1),
        e.note ? (c(), h("span", Pf, k(e.note), 1)) : C("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, qf = /* @__PURE__ */ Y(jf, [["__scopeId", "data-v-ad0db6d6"]]), Ff = { class: "code" }, Wf = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, a = (o) => n("open", o), s = (o) => n("file", o);
    return (o, r) => (c(), V(Bt, {
      value: e.node.type
    }, {
      stack: D(() => [
        R(mn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      row: D(() => [
        R(mn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      grid: D(() => [
        R(mn, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      card: D(() => [
        R(Hu, {
          node: e.node,
          onOpen: a,
          onFile: s
        }, null, 8, ["node"])
      ]),
      heading: D(() => [
        g("h3", {
          class: J(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: D(() => [...r[2] || (r[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: D(() => [
        R(qf, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (l) => a(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: D(() => [
        R(Du, {
          node: e.node,
          onOpen: a
        }, null, 8, ["node"])
      ]),
      table: D(() => [
        R(Lf, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: a
        }, null, 8, ["columns", "rows"])
      ]),
      list: D(() => [
        R(Tf, {
          items: e.node.items,
          onOpen: a
        }, null, 8, ["items"])
      ]),
      text: D(() => [
        R(tt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: D(() => [
        R(_f, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: D(() => [
        R(tr, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: D(() => [
        g("pre", Ff, [
          g("code", null, k(e.node.text), 1)
        ])
      ]),
      file: D(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (l) => s(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), gr = /* @__PURE__ */ Y(Wf, [["__scopeId", "data-v-cbdcf540"]]), Hf = { class: "dashboard" }, Uf = { class: "trail" }, zf = ["onClick"], Vf = {
  key: 0,
  class: "gone",
  role: "status"
}, Gf = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = (p) => p in (n.document.pages || {}), o = B(!!n.page && !s(n.page)), r = B(n.page && !o.value ? [n.page] : []), l = I(() => r.value.at(-1) || n.document.start), i = I(() => (n.document.pages || {})[l.value] || null), u = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, r.value = [...r.value, p];
    }, f = (p) => {
      o.value = !1, r.value = r.value.slice(0, p);
    };
    return me(
      () => n.document.start,
      () => r.value = []
    ), (p, v) => (c(), h("div", Hf, [
      e.document.broken ? (c(), V(bn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: D(() => [
          se(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), V(bn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: D(() => [
          se(k(e.document.missing), 1)
        ]),
        _: 1
      })) : i.value ? (c(), h(G, { key: 2 }, [
        g("nav", Uf, [
          g("button", {
            type: "button",
            class: J(["step", { current: !r.value.length }]),
            onClick: v[0] || (v[0] = (b) => f(0))
          }, k(u(e.document.start)), 3),
          (c(!0), h(G, null, te(r.value, (b, x) => (c(), h(G, {
            key: `${x}-${b}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: J(["step", { current: x === r.value.length - 1 }]),
              onClick: ($) => f(x + 1)
            }, k(u(b)), 11, zf)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Vf, "What you opened is no longer in this dashboard. Here is its start page.")) : C("", !0),
        R(Ot, {
          name: "page",
          mode: "out-in"
        }, {
          default: D(() => [
            (c(), h("div", {
              key: l.value,
              class: "page"
            }, [
              R(gr, {
                node: i.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (b) => a("file", b))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : C("", !0)
    ]));
  }
}, q2 = /* @__PURE__ */ Y(Gf, [["__scopeId", "data-v-fbe83734"]]), Je = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Le = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Re = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Kf = 6;
function ts(e, t) {
  const n = [];
  for (const a of String(e).split(/\s+/).filter(Boolean)) {
    const s = n.at(-1);
    s !== void 0 && s.length + 1 + a.length <= t ? n[n.length - 1] = `${s} ${a}` : n.push(a);
  }
  return n.length ? n : [""];
}
const Yf = (e) => {
  const t = ts(e, Je.lineChars), n = Math.max(Je.minWidth, Math.max(...t.map((a) => a.length)) * Je.charWidth + Je.padX * 2);
  return { name: e, lines: t, line: Je.line, padY: Je.padY, width: n, height: t.length * Je.line + Je.padY * 2 };
};
function Zf(e, t, n) {
  const a = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), o = (r) => {
    s.set(r, "open"), t.forEach((l, i) => {
      if (l[0] !== r) return;
      const u = s.get(l[1]);
      u === "open" ? a.add(i) : u || o(l[1]);
    }), s.set(r, "done");
  };
  return [...n, ...e].forEach((r) => s.has(r) || o(r)), a;
}
function Jf(e, t) {
  const n = new Map(e.map((a) => [a, 0]));
  for (let a = 0; a < e.length; a++) {
    let s = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), s = !0);
    }), !s) break;
  }
  return n;
}
function Xf(e, t, n) {
  const a = [];
  e.forEach((r) => {
    var l;
    return (a[l = n.get(r)] || (a[l] = [])).push(r);
  });
  const s = () => new Map(a.flatMap((r) => r.map((l, i) => [l, i]))), o = (r, l) => {
    const i = s(), u = (d) => {
      const f = l(d).map((p) => i.get(p));
      return f.length ? f.reduce((p, v) => p + v, 0) / f.length : i.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < Kf; r++) {
    const l = r % 2 === 0, i = a.map((u, d) => d);
    (l ? i.slice(1) : i.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((p) => p[l ? 1 : 0] === f).map((p) => p[l ? 0 : 1]);
      a[u] = o(a[u], d);
    });
  }
  return a;
}
function Qf(e, t) {
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
function eh(e) {
  const t = [...new Set(e.flatMap(([_, y]) => [_, y]))], n = new Set(e.map(([, _]) => _)), a = t.filter((_) => !n.has(_)), s = Zf(t, e, a.length ? a : t.slice(0, 1)), o = e.filter((_, y) => !s.has(y)), r = Jf(t, o), l = Xf(t, o, r), i = new Map(t.map((_) => [_, Yf(_)])), u = l.map((_) => _.reduce((y, E) => y + i.get(E).width, 0) + Re.across * (_.length - 1)), d = Math.max(...u) + Re.margin * 2, f = nh(e, r, l.length), p = /* @__PURE__ */ new Map();
  let v = Re.margin;
  l.forEach((_, y) => {
    let E = (d - u[y]) / 2;
    const S = Math.max(..._.map((T) => i.get(T).height));
    _.forEach((T) => {
      const w = i.get(T);
      p.set(T, { ...w, x: E, y: v + (S - w.height) / 2 }), E += w.width + Re.across;
    }), v += S + (f[y] ?? Re.down);
  });
  const b = e.map(([_, y, E], S) => ({ from: _, to: y, label: E || "", back: s.has(S) || r.get(y) <= r.get(_) }));
  Qf(b, p);
  const x = b.map((_) => ah(_, p.get(_.from), p.get(_.to))), $ = [...p.values()], O = lh(x, $), q = Math.max(v - Re.down, ...O.filter((_) => _.label).map((_) => _.label.y + _.label.height));
  return { width: Math.max(d - Re.margin, ...O.filter((_) => _.label).map((_) => _.label.x + _.label.width)) + Re.margin, height: q + Re.margin, nodes: $, arrows: O };
}
const th = (e) => e ? ts(e, Le.lineChars).length * Le.line + Le.pad * 2 : 0;
function nh(e, t, n) {
  const a = Array.from({ length: Math.max(n - 1, 0) }, () => Re.labelSpace);
  return e.forEach(([s, o, r]) => {
    const [l, i] = [t.get(s), t.get(o)].sort((u, d) => u - d);
    i > l && (a[l + Math.floor((i - l - 1) / 2)] += th(r) + Re.labelSpace);
  }), a.map((s) => Math.max(Re.down, s));
}
function ah(e, t, n) {
  const a = e.label ? ts(e.label, Le.lineChars) : [], s = a.length ? Math.max(...a.map((p) => p.length)) * Le.charWidth + Le.pad * 2 : 0, o = a.length * Le.line + (a.length ? Le.pad * 2 : 0), r = t.x + t.width * e.fromShare, l = e.back ? t.y : t.y + t.height, i = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - l) / 2, f = [{ x: r, y: l }, { x: r, y: l + d }, { x: i, y: u - d }, { x: i, y: u }];
  return { ...e, lines: a, labelWidth: s, labelHeight: o, curve: f, path: `M${r} ${l} C${r} ${l + d} ${i} ${u - d} ${i} ${u}` };
}
const sh = ([e, t, n, a], s) => {
  const o = 1 - s, r = (l) => o * o * o * e[l] + 3 * o * o * s * t[l] + 3 * o * s * s * n[l] + s * s * s * a[l];
  return { x: r("x"), y: r("y") };
}, oh = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], rh = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Le.line);
function lh(e, t) {
  const n = t.map(({ x: a, y: s, width: o, height: r }) => ({ x: a, y: s, width: o, height: r }));
  return e.map((a) => {
    if (!a.lines.length) return { ...a, label: null };
    const s = (i, u) => {
      const d = sh(a.curve, i);
      return { x: d.x - a.labelWidth / 2, y: d.y - a.labelHeight / 2 + u, width: a.labelWidth, height: a.labelHeight };
    }, l = rh.flatMap((i) => oh.map((u) => s(u, i))).find((i) => !n.some((u) => Rs(i, u))) ?? s(0.5, 0);
    for (; n.some((i) => Rs(l, i)); ) l.y += Le.line;
    return n.push(l), { ...a, label: { ...l, lines: a.lines, line: Le.line, pad: Le.pad } };
  });
}
const Rs = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, ih = { class: "flowchart-tools" }, ch = ["width", "height", "viewBox", "aria-label"], uh = ["d"], dh = ["x", "y", "width", "height"], fh = ["x", "y"], hh = ["x", "dy"], mh = {
  key: 0,
  class: "flowchart-label"
}, ph = ["x", "y", "width", "height"], gh = ["x", "y"], vh = ["x", "dy"], yh = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => eh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = B(null), l = B({ zoom: 1, x: 0, y: 0 });
    let i = null;
    function u() {
      var O;
      const x = (O = r.value) == null ? void 0 : O.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const $ = Math.min(x.width / s.value.width, x.height / s.value.height, 1.5);
      l.value = { zoom: $, x: (x.width - s.value.width * $) / 2, y: (x.height - s.value.height * $) / 2 };
    }
    function d(x, $, O) {
      const { zoom: q, x: Z, y: _ } = l.value, y = Math.min(o.most, Math.max(o.least, q * x));
      l.value = { zoom: y, x: $ - ($ - Z) * y / q, y: O - (O - _) * y / q };
    }
    function f(x) {
      const $ = r.value.getBoundingClientRect();
      d(x, $.width / 2, $.height / 2);
    }
    function p(x) {
      const $ = r.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? d(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - $.left, x.clientY - $.top) : l.value = { ...l.value, x: l.value.x - x.deltaX, y: l.value.y - x.deltaY };
    }
    function v(x) {
      var $, O, q;
      x.preventDefault(), ($ = window.getSelection()) == null || $.removeAllRanges(), i = { x: x.clientX - l.value.x, y: x.clientY - l.value.y }, (q = (O = r.value).setPointerCapture) == null || q.call(O, x.pointerId);
    }
    function b(x) {
      i && (l.value = { ...l.value, x: x.clientX - i.x, y: x.clientY - i.y });
    }
    return Te(u), (x, $) => (c(), V(zo, {
      title: e.title,
      large: "",
      onClose: $[4] || ($[4] = (O) => a("close"))
    }, {
      default: D(() => [
        g("div", ih, [
          R(de, {
            small: "",
            onClick: $[0] || ($[0] = (O) => f(o.step))
          }, {
            default: D(() => [...$[5] || ($[5] = [
              se("Zoom in", -1)
            ])]),
            _: 1
          }),
          R(de, {
            small: "",
            onClick: $[1] || ($[1] = (O) => f(1 / o.step))
          }, {
            default: D(() => [...$[6] || ($[6] = [
              se("Zoom out", -1)
            ])]),
            _: 1
          }),
          R(de, {
            small: "",
            onClick: u
          }, {
            default: D(() => [...$[7] || ($[7] = [
              se("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: ke(p, ["prevent"]),
          onPointerdown: v,
          onPointermove: b,
          onPointerup: $[2] || ($[2] = (O) => vs(i) ? i.value = null : i = null),
          onPointercancel: $[3] || ($[3] = (O) => vs(i) ? i.value = null : i = null)
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
            (c(!0), h(G, null, te(s.value.arrows, (O, q) => (c(), h("path", {
              key: `arrow-${q}`,
              class: "flowchart-arrow",
              d: O.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, uh))), 128)),
            (c(!0), h(G, null, te(s.value.nodes, (O) => (c(), h("g", {
              key: O.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: O.x,
                y: O.y,
                width: O.width,
                height: O.height,
                rx: "8"
              }, null, 8, dh),
              g("text", {
                x: O.x + O.width / 2,
                y: O.y + O.padY + O.line / 2
              }, [
                (c(!0), h(G, null, te(O.lines, (q, Z) => (c(), h("tspan", {
                  key: Z,
                  x: O.x + O.width / 2,
                  dy: Z ? O.line : 0
                }, k(q), 9, hh))), 128))
              ], 8, fh)
            ]))), 128)),
            (c(!0), h(G, null, te(s.value.arrows, (O, q) => (c(), h(G, {
              key: `label-${q}`
            }, [
              O.label ? (c(), h("g", mh, [
                g("rect", {
                  x: O.label.x,
                  y: O.label.y,
                  width: O.label.width,
                  height: O.label.height,
                  rx: "4"
                }, null, 8, ph),
                g("text", {
                  x: O.label.x + O.label.width / 2,
                  y: O.label.y + O.label.pad + O.label.line / 2
                }, [
                  (c(!0), h(G, null, te(O.label.lines, (Z, _) => (c(), h("tspan", {
                    key: _,
                    x: O.label.x + O.label.width / 2,
                    dy: _ ? O.label.line : 0
                  }, k(Z), 9, vh))), 128))
                ], 8, gh)
              ])) : C("", !0)
            ], 64))), 128))
          ], 12, ch))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, kh = /* @__PURE__ */ Y(yh, [["__scopeId", "data-v-51d24cfe"]]), Ls = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ns = {
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
  agent: Ls,
  worker: Ls,
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
}, bh = ["innerHTML"], wh = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = I(() => Ns[t.name] || Ns.dot);
    return (a, s) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, bh));
  }
}, Ye = /* @__PURE__ */ Y(wh, [["__scopeId", "data-v-beb5935c"]]), xh = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: J(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      R(Ye, { name: "fold" })
    ], 2));
  }
}, At = /* @__PURE__ */ Y(xh, [["__scopeId", "data-v-d03899bb"]]), $h = ["data-tip", "aria-label"], Mh = {
  key: 0,
  class: "mact-word"
}, Sh = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: J(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      R(Ye, { name: "open" }),
      e.open ? (c(), h("span", Mh, k(e.label), 1)) : C("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, $h));
  }
}, vr = /* @__PURE__ */ Y(Sh, [["__scopeId", "data-v-3b292e09"]]), yr = 120, pn = 280, kr = 160, _h = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Eh = ["leaving", "resizing", "entering"];
function Ta(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Ah(e) {
  const t = Eh.filter((a) => e.classList.contains(a));
  e.classList.remove(...t);
  const n = Ta(e);
  return e.classList.add(...t), n;
}
function br(e, t, n = (a) => new Promise((s) => setTimeout(s, a))) {
  const a = B(t()), s = B("");
  let o = 0;
  const r = (f, p) => Object.assign(f.style, { width: `${p.width}px`, height: `${p.height}px` }), l = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function i(f, p) {
    l(f);
    const v = Ah(f);
    r(f, p), f.offsetWidth, f.style.transition = `width ${pn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${pn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, v);
  }
  function u(f) {
    const p = f.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let v = p.offsetHeight;
    const b = new ResizeObserver(() => {
      p.offsetHeight !== v && (v = p.offsetHeight, i(f, Ta(f)));
    });
    return b.observe(p), b;
  }
  async function d(f) {
    const p = e.value, v = ++o;
    if (!p || !p.offsetWidth || _h()) {
      a.value = f;
      return;
    }
    const b = Ta(p);
    if (r(p, b), s.value = "leaving", await n(yr), v !== o) return;
    a.value = f, s.value = "resizing", await st(), i(p, b);
    const x = u(p);
    await n(pn), x == null || x.disconnect(), v === o && (l(p), s.value = "entering", await n(kr), v === o && (s.value = ""));
  }
  return me(t, (f) => d(f)), Tt(() => {
    o += 1;
  }), { folded: a, phase: s };
}
const Ch = { class: "growing-card-top" }, Oh = ["aria-expanded"], Th = { class: "growing-card-avatar" }, Bh = { class: "growing-card-title" }, Ih = { class: "growing-card-more" }, Rh = { class: "growing-card-body" }, Lh = {
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
    const n = e, a = t, s = B(!1), o = B(null), { folded: r, phase: l } = br(o, () => !s.value), i = I(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = I(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", H(l), { open: !H(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", Ch, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": s.value,
          onClick: f[0] || (f[0] = (p) => s.value = !s.value)
        }, [
          g("span", Th, [
            e.bad ? (c(), V(Ye, {
              key: 0,
              name: "cross"
            })) : i.value ? (c(), h(G, { key: 1 }, [
              se(k(i.value), 1)
            ], 64)) : (c(), V(pe, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", Bh, k(e.title), 1),
          R(At, { open: s.value }, null, 8, ["open"])
        ], 8, Oh),
        e.action ? (c(), V(vr, {
          key: 0,
          label: e.action,
          open: s.value,
          onClick: f[1] || (f[1] = (p) => a("act"))
        }, null, 8, ["label", "open"])) : C("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (p) => a("comment"))
        }, [
          R(pe, {
            name: "bubble",
            size: 13
          })
        ])) : C("", !0)
      ]),
      g("div", Ih, [
        g("div", Rh, [
          (c(!0), h(G, null, te(u.value, (p, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, k(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Nh = /* @__PURE__ */ Y(Lh, [["__scopeId", "data-v-08411e3a"]]), Dh = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, Ph = {
  key: 0,
  class: "message-links-many"
}, jh = ["aria-expanded"], qh = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Fh = ["onClick"], Wh = { class: "row-pill message-links-chip" }, Hh = { class: "message-links-title" }, Jn = 3, Ds = "task", Uh = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = $e(Se, null), a = I(() => t.links.length), s = I(() => t.links.every((p) => p.model === Ds) ? "tasks" : "items"), o = I(() => `Linked: ${t.links.map((p) => `${p.model} ${p.id}`).join(" ")}`), r = B(!1), l = B({}), i = B(null);
    _o(i, () => r.value = !1);
    async function u() {
      const p = t.links.filter((b) => b.model === Ds && !(b.id in l.value)), v = await Promise.all(p.map((b) => n.read(`task show ${b.id}`)));
      l.value = { ...l.value, ...Object.fromEntries(v.filter((b) => b.ok).map((b) => [b.value.id, b.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(p) {
      r.value = !1, Ne(`${ze(p.model)}:${p.id}`);
    }
    return (p, v) => (c(), h("div", {
      ref_key: "line",
      ref: i,
      class: J(["message-links", { many: a.value > Jn, three: a.value === Jn, open: r.value }]),
      "data-message-links": ""
    }, [
      R(Ye, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", Dh, [
        R(tt, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      a.value >= Jn ? (c(), h("span", Ph, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          se(k(a.value) + " linked " + k(s.value) + " ", 1),
          R(At, { open: r.value }, null, 8, ["open"])
        ], 8, jh)
      ])) : C("", !0),
      r.value ? (c(), h("div", qh, [
        (c(!0), h(G, null, te(e.links, (b) => (c(), h("button", {
          key: `${b.model}:${b.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (x) => f(b)
        }, [
          g("span", Wh, k(b.model) + " " + k(b.id), 1),
          g("span", Hh, k(l.value[b.id]), 1)
        ], 8, Fh))), 128))
      ])) : C("", !0)
    ], 2));
  }
}, zh = /* @__PURE__ */ Y(Uh, [["__scopeId", "data-v-24868afd"]]), Vh = ["title", "aria-label"], Gh = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Kh = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Yh = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, a = I(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (s, o) => (c(), h("span", {
      class: J(["ticks", a.value, e.tone]),
      role: "img",
      title: n[a.value],
      "aria-label": n[a.value]
    }, [
      (c(), h("svg", Gh, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        a.value !== "sent" ? (c(), h("path", Kh)) : C("", !0)
      ]))
    ], 10, Vh));
  }
}, Zh = /* @__PURE__ */ Y(Yh, [["__scopeId", "data-v-6dc92808"]]);
function Jh(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, a = Math.max(0, t / 1e3 - n);
  return a < 60 ? "now" : a < 3600 ? `${Math.floor(a / 60)}m` : a < 86400 ? `${Math.floor(a / 3600)}h` : `${Math.floor(a / 86400)}d`;
}
function Xh(e, t = Date.now()) {
  const n = Jh(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const Qh = 36e5;
function F2(e, t, n, a = Date.now()) {
  const s = ((n ? Date.parse(n) : a) - Date.parse(t)) / Qh;
  return s > 0 && e ? Math.round(e / s) : 0;
}
function wr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), a = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? a : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${a}`;
}
function Ps(e, t = !1) {
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
  }), Ae(() => n == null ? void 0 : n.disconnect()), me(t, a, { flush: "post" });
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
}, S1 = ["data-sent-worker", "title", "onClick"], _1 = { class: "message-foot" }, E1 = { class: "message-time" }, A1 = {
  class: "message-id",
  "data-message-id": ""
}, C1 = 140, O1 = 2, T1 = 1500, B1 = "An earlier message", I1 = "about", R1 = "sent_to", L1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var U;
    const n = e, a = t, s = B(!1), o = B(null), r = I(() => ["user", "comment"].includes(n.message.type)), l = I(() => {
      const [ee, X] = (n.message.commented_row || ":").split(":"), K = ze(ee);
      return K ? { ref: `${K}:${X}`, label: `${It(K).title.toLowerCase()} ${X}` } : null;
    }), i = I(() => n.message.worker_id ?? null), u = B(!1), d = I(() => i.value !== null && ((n.message.text ?? "").length > C1 || (n.message.text ?? "").split(`
`).filter((ee) => ee.trim()).length > O1)), f = I(() => r.value && !n.message.read_at && !n.message.local);
    async function p() {
      var ee;
      await ((ee = navigator.clipboard) == null ? void 0 : ee.writeText(n.message.text ?? "")), s.value = !0, setTimeout(() => s.value = !1, T1);
    }
    const v = rr(), b = I(() => v(n.message.text ?? "")), x = I(() => JSON.parse(n.message.flowchart_edges || "[]")), $ = B(!1), O = I(() => v(n.quote || B1));
    function q() {
      const ee = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      ee ? ee.scrollIntoView({ block: "center", behavior: "smooth" }) : Ne(`messages:${n.message.parent_id}`);
    }
    o1(o, () => `${n.message.text} ${n.quote}`);
    const Z = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, _ = (ee) => `/api/files/message/${n.message.id}/${encodeURIComponent(ee)}`, y = I(() => JSON.parse(n.message.captions || "{}")), E = I(() => (n.message.files ?? []).map((ee) => ({ name: ee, address: _(ee), isImage: Z.test(ee), title: y.value[ee] || ee }))), S = I(() => wr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), T = $e(Se, null), w = B([]), A = B([]);
    async function M() {
      if (!r.value || !(T != null && T.read) || n.message.local) return;
      const ee = await T.read(`link list --source message:${n.message.id}`);
      if (!ee.ok) return;
      const X = ee.value.rows ?? ee.value ?? [];
      w.value = X.filter((K) => K.link_type === I1).map((K) => ({ model: K.target_model, id: K.target_id })), A.value = X.filter((K) => K.link_type === R1).map((K) => K.target_id);
    }
    M(), (U = T == null ? void 0 : T.follow) == null || U.call(T, ["link.*"], M);
    const m = B(!1), L = I(() => l1(n.message.reactions));
    function P(ee) {
      m.value = !1, a("react", n.message, ee);
    }
    return (ee, X) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      R(Nh, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: X[0] || (X[0] = (K) => a("comment", e.message))
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
          class: J(["message-card", "md", { comment: l.value }]),
          onClick: X[6] || (X[6] = (...K) => H(Mt) && H(Mt)(...K))
        }, [
          l.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${l.value.label}`,
            onClick: X[1] || (X[1] = ke((K) => H(Ne)(l.value.ref), ["stop"]))
          }, [
            R(pe, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + k(l.value.label), 1)
          ], 8, d1)) : C("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: ke(q, ["stop"]),
            innerHTML: O.value
          }, null, 8, f1)) : C("", !0),
          i.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${i.value}`,
            onClick: X[2] || (X[2] = ke((K) => H(Ne)(`agents:${i.value}`), ["stop"]))
          }, "Worker " + k(i.value), 9, h1)) : C("", !0),
          g("div", {
            class: J({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: b.value
          }, null, 10, m1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: X[3] || (X[3] = ke((K) => u.value = !u.value, ["stop"]))
          }, k(u.value ? "Show less" : "Show more"), 1)) : C("", !0),
          x.value.length ? (c(), h(G, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: X[4] || (X[4] = (K) => $.value = !0)
            }, "Open the flowchart"),
            $.value ? (c(), V(kh, {
              key: 0,
              title: e.message.text,
              edges: x.value,
              onClose: X[5] || (X[5] = (K) => $.value = !1)
            }, null, 8, ["title", "edges"])) : C("", !0)
          ], 64)) : C("", !0)
        ], 2),
        g("div", {
          class: J(["message-tools", { picking: m.value }]),
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
                onClick: (ie) => P(K)
              }, k(K), 9, g1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: X[7] || (X[7] = (K) => m.value = !1)
            }, [
              R(pe, {
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
              onClick: X[8] || (X[8] = (K) => m.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: X[9] || (X[9] = (K) => a("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: p
            }, k(s.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: X[10] || (X[10] = (K) => a("delete", e.message))
            }, "Delete")) : C("", !0)
          ], 64))
        ], 2)
      ]),
      L.value.length ? (c(), h("div", v1, [
        (c(!0), h(G, null, te(L.value, (K) => (c(), h("button", {
          key: K.emoji,
          type: "button",
          class: J(["message-reaction", { mine: K.mine }]),
          title: K.title,
          "data-reaction": K.emoji,
          onClick: (ie) => a("react", e.message, K.emoji)
        }, [
          se(k(K.emoji) + " ", 1),
          K.count > 1 ? (c(), h("span", k1, k(K.count), 1)) : C("", !0)
        ], 10, y1))), 128))
      ])) : C("", !0),
      E.value.length ? (c(), h("div", b1, [
        (c(!0), h(G, null, te(E.value, (K) => (c(), h(G, {
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
          }, k(K.name), 9, $1))
        ], 64))), 128))
      ])) : C("", !0),
      A.value.length ? (c(), h("div", M1, [
        R(pe, {
          name: "send",
          size: 12
        }),
        (c(!0), h(G, null, te(A.value, (K) => (c(), h("button", {
          key: K,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": K,
          title: `Open worker ${K}`,
          onClick: ke((ie) => H(Ne)(`agents:${K}`), ["stop"])
        }, "Also sent to worker " + k(K), 9, S1))), 128))
      ])) : C("", !0),
      g("div", _1, [
        g("time", E1, k(S.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(G, { key: 0 }, [
          X[11] || (X[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", A1, "message " + k(e.message.id), 1)
        ], 64)) : C("", !0),
        r.value ? (c(), V(Zh, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : C("", !0)
      ]),
      w.value.length ? (c(), V(zh, {
        key: 3,
        links: w.value
      }, null, 8, ["links"])) : C("", !0)
    ], 8, c1));
  }
}, W2 = /* @__PURE__ */ Y(L1, [["__scopeId", "data-v-2b3e68eb"]]), N1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, a = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), s = (o) => ({ ...a(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const l = Sl("SkeletonParts", !0);
      return c(!0), h(G, null, te(e.parts, (i, u) => (c(), h(G, { key: u }, [
        (c(!0), h(G, null, te(i.count, (d) => (c(), V(Bt, {
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
              R(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: D(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(a(i))
            }, [
              R(l, {
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
              R(l, {
                parts: i.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: D(() => [
            g("div", {
              class: "skeleton-grid",
              style: fe(s(i))
            }, [
              R(l, {
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
      R(D1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, xr = /* @__PURE__ */ Y(j1, [["__scopeId", "data-v-52f66b64"]]), _n = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], Qn = 200, $r = (e) => {
  var t;
  return ((t = _n.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? _n[0].key;
}, H2 = (e) => {
  var t;
  return ((t = _n.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, q1 = ["aria-label"], F1 = 300, js = 400, W1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: Qn } },
  setup(e) {
    const t = e, n = I(() => $r(t.value)), a = I(() => n.value < Qn ? [1, 0.25, 0.25] : n.value === Qn ? [1, 1, 0.25] : [1, 1, 1]);
    return (s, o) => (c(), h("svg", {
      class: J(["ico", "prio", { hot: n.value >= js, high: n.value >= F1 && n.value < js }]),
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
}, U2 = /* @__PURE__ */ Y(W1, [["__scopeId", "data-v-b10e610f"]]), qs = (e) => [...new Set(e.agents.map((t) => t.name))], z2 = (e) => qs(e).length === 1 ? `Worker: ${qs(e)[0]}` : "Delegated", H1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, Fs = (e) => H1[e.card.state] || "idle", U1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Ws = { working: 0, waiting: 1, idle: 2, stopped: 3 }, Hs = (e, t) => Ws[Fs(e)] - Ws[Fs(t)], Us = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, V2 = (e, t, n = []) => t === "number" ? [...e].sort((a, s) => Hs(a, s) || n.indexOf(a.key) - n.indexOf(s.key) || U1(a, s)) : [...e].sort((a, s) => Hs(a, s) || (Us[t] || Us.state)(a, s)), z1 = { class: "list-row" }, V1 = {
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
      e.kind ? (c(), h("span", V1, k(e.kind), 1)) : C("", !0),
      g("div", G1, [
        e.title ? (c(), h("span", K1, k(e.title), 1)) : C("", !0),
        g("div", Y1, [
          ce(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Z1, [
          ce(t.$slots, "end", {}, void 0, !0)
        ])) : C("", !0)
      ]),
      e.text ? (c(), h("span", J1, k(e.text), 1)) : C("", !0)
    ]));
  }
}, G2 = /* @__PURE__ */ Y(X1, [["__scopeId", "data-v-63155fba"]]), Q1 = {
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
    const n = e, a = t, s = B(!1), o = B(null), r = B(""), l = I(() => {
      const u = r.value.trim().toLowerCase();
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
        e.icon ? (c(), V(pe, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : C("", !0),
        g("span", nm, k(e.label), 1),
        R(pe, {
          name: "down",
          size: 11
        })
      ], 10, tm),
      s.value ? (c(), V(Rn, {
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
          }, null, 40, am)) : C("", !0),
          (c(!0), h(G, null, te(l.value, (f) => (c(), V(ht, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (p) => i(f)
          }, {
            default: D(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: J(["drop-dot", { live: f.running }])
              }, null, 2)) : C("", !0),
              f.lead ? (c(), h("span", sm, k(f.lead), 1)) : C("", !0),
              g("span", om, k(f.label), 1),
              f.note ? (c(), h("span", rm, k(f.note), 1)) : C("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          l.value.length ? C("", !0) : (c(), h("p", lm, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : C("", !0)
    ], 2));
  }
}, cm = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-29dfcce5"]]), K2 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = I(() => [
      ...Q1[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = I(() => (s.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
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
    const n = e, a = t, { visible: s, close: o, closed: r } = Wo(a, n), l = Ho(s);
    return (i, u) => (c(), V(za, { to: "body" }, [
      R(Ot, {
        name: "side",
        appear: "",
        onAfterLeave: H(r)
      }, {
        default: D(() => [
          H(s) ? (c(), h("div", {
            key: 0,
            class: J(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: H(l) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = ke((...d) => H(o) && H(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: J(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(G, { key: 0 }, [
                g("header", dm, [
                  g("div", fm, [
                    g("h2", null, k(e.title), 1),
                    e.abstract ? (c(), V(tt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : C("", !0)
                  ]),
                  ce(i.$slots, "actions", {}, void 0, !0),
                  R(Nn, {
                    title: e.closeLabel,
                    onClick: H(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", hm, [
                  ce(i.$slots, "default", {}, void 0, !0)
                ]),
                i.$slots.foot ? (c(), h("footer", mm, [
                  ce(i.$slots, "foot", {}, void 0, !0)
                ])) : C("", !0)
              ], 64)) : ce(i.$slots, "default", {}, void 0, !0, 1)
            ], 10, um)
          ], 6)) : C("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Y2 = /* @__PURE__ */ Y(pm, [["__scopeId", "data-v-c9a3f43a"]]), gm = {
  key: 1,
  class: "text-field-label"
}, vm = {
  key: 2,
  class: "text-field-end"
}, ym = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ ba({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = ka(e, "modelValue"), a = In(), s = "onUpdate:modelValue" in (((d = _l()) == null ? void 0 : d.vnode.props) || {}), o = I(() => s ? n.value : a.value), r = (f) => s && (n.value = f.target.value), l = I(
      () => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), i = I(() => Object.fromEntries(Object.entries(a).filter(([f]) => f !== "value"))), u = B(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, p) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: f.$slots.end }, H(a).class]),
      style: fe(H(a).style)
    }, [
      e.icon ? (c(), V(pe, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : C("", !0),
      e.label ? (c(), h("span", gm, k(e.label), 1)) : C("", !0),
      Ke(g("input", Ge({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, l.value, { onInput: r }), null, 16), [
        [H(Sa), o.value]
      ]),
      f.$slots.end ? (c(), h("span", vm, [
        ce(f.$slots, "end", {}, void 0, !0)
      ])) : C("", !0)
    ], 6)) : Ke((c(), h("input", Ge({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, i.value, { onInput: r }), null, 16)), [
      [H(Sa), o.value]
    ]);
  }
}), Z2 = /* @__PURE__ */ Y(ym, [["__scopeId", "data-v-d9c38ca8"]]);
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
const zs = (e) => e.page * e.size < e.total;
function J2(e) {
  const t = vt().sources.find((n) => n.key === e);
  return t ? Ba(t.read, t.events) : Ba("", []);
}
function Ba(e, t, { incremental: n = !1 } = {}) {
  const a = vt(), s = B([]), o = B(null), r = B(""), l = B(!1), i = performance.now(), u = B(!1), d = B(""), f = B(null);
  async function p(_) {
    const y = x, E = await a.read(`${e} --before-id ${_ + 1} --limit 1`);
    if (y !== x) return;
    if (!E.ok) return O();
    const S = E.value.rows.find((T) => T.id === _);
    s.value = S ? s.value.map((T) => T.id === _ ? S : T) : s.value.filter((T) => T.id !== _);
  }
  async function v(_) {
    if (n && String((_ == null ? void 0 : _.event) ?? "").endsWith(".delete")) return void (s.value = s.value.filter((A) => A.id !== _.row_id));
    if (n && (_ != null && _.row_id) && !String(_.event ?? "").endsWith(".create") && s.value.some((A) => A.id === _.row_id)) return p(_.row_id);
    if (!(n && s.value.length && String((_ == null ? void 0 : _.event) ?? "").endsWith(".create"))) return O();
    const E = Math.max(...s.value.map((A) => A.id)), S = x, T = await a.read(`${e} --after-id ${E}`);
    if (S !== x) return;
    if (!T.ok) return O();
    const w = new Set(s.value.map((A) => A.id));
    s.value = [...T.value.rows.filter((A) => !w.has(A.id)), ...s.value];
  }
  async function b() {
    if (!s.value.length) return !1;
    const _ = x, y = Math.min(...s.value.map((T) => T.id)), E = await a.read(`${e} --before-id ${y}`);
    if (_ !== x) return !1;
    if (!E.ok || !E.value.rows.length) return u.value = !1;
    u.value = zs(E.value);
    const S = new Set(s.value.map((T) => T.id));
    return s.value = [...s.value, ...E.value.rows.filter((T) => !S.has(T.id))], !0;
  }
  let x = 0;
  async function $(_) {
    const y = ++x, E = await a.read(a.shared ? `${a.shared.model} show ${a.shared.id}` : e);
    if (y !== x) return;
    const S = E.ok ? a.shared ? [E.value] : E.value.rows : [];
    s.value = _(S), o.value = E.ok ? E.value : null;
    const T = S.length ? Math.min(...S.map((w) => w.id)) : 0;
    E.ok && !s.value.some((w) => w.id < T) && (u.value = !a.shared && zs(E.value)), r.value = E.ok ? "" : E.error, Ka(i, () => l.value = !0);
  }
  function O() {
    return $((_) => {
      if (!n || !_.length) return _;
      const y = Math.min(..._.map((S) => S.id)), E = Math.max(..._.map((S) => S.id));
      return [...s.value.filter((S) => S.id > E), ..._, ...s.value.filter((S) => S.id < y)];
    });
  }
  const q = () => $((_) => _);
  async function Z(_, y = null) {
    const E = await km(y && { target: s, fields: { value: y(s.value) } }, _, a.run);
    return d.value = E.ok ? "" : E.error, f.value = E.ok ? E.value : null, await O(), E;
  }
  return e && (a.follow(t, v), O()), { rows: s, listing: o, failure: r, loaded: l, more: u, load: O, loadLatest: q, older: b, act: Z, actionFailure: d, answer: f, context: a };
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
    const t = e, { rows: n, failure: a, loaded: s } = Ba(t.line, t.events);
    return (o, r) => (c(), V(gu, {
      rows: H(n),
      failure: H(a),
      loaded: H(s),
      empty: e.empty
    }, {
      default: D(({ row: l }) => [
        g("span", bm, k(l.title), 1),
        g("span", wm, k(H(No)(e.kind, l.state)), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, X2 = /* @__PURE__ */ Y(xm, [["__scopeId", "data-v-3d3d982a"]]);
function $m(e = 1e3, t = null) {
  const n = B(Date.now() / 1e3);
  let a = 0;
  const s = (o) => {
    clearInterval(a), a = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? me(t, s, { immediate: !0 }) : s(!0), Ae(() => clearInterval(a)), n;
}
const ea = B(Date.now() / 1e3);
let Vs = 0, ln = 0;
function Mm() {
  return ln || (ea.value = Date.now() / 1e3, Vs = setInterval(() => ea.value = Date.now() / 1e3, 1e3)), ln += 1, xo() && $o(() => {
    ln -= 1, ln || clearInterval(Vs);
  }), ea;
}
const Sm = 200, _m = yr + pn + kr + Sm;
function Lt(e) {
  if (!e) return null;
  const { x: t, y: n, width: a, height: s } = e.getBoundingClientRect();
  return { x: t, y: n, width: a, height: s, opacity: getComputedStyle(e).opacity };
}
function Em(e, t, n) {
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
function Am(e, t, n, a) {
  me(t, (s) => {
    var u;
    const o = e.value;
    if (!o || !(a != null && a.run) || !((u = a.markMotion) != null && u.value)) return;
    const r = performance.now(), l = [];
    function i() {
      if (a.markMotion.value) {
        if (l.push(Em(o, r, n.value)), performance.now() - r < _m) return void requestAnimationFrame(i);
        a.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: s, at: (/* @__PURE__ */ new Date()).toISOString(), frames: l })]);
      }
    }
    i();
  }, { flush: "sync" });
}
const Cm = ["title", "data-figure-mark", "data-folded", "data-open"], Om = {
  key: 2,
  class: "worker"
}, Tm = { class: "head" }, Bm = { key: 0 }, Im = {
  key: 3,
  class: "status"
}, Rm = {
  key: 0,
  class: "figure"
}, Lm = {
  key: 1,
  class: "ran-for"
}, Nm = { key: 2 }, Dm = {
  key: 3,
  class: "news"
}, Pm = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, jm = {
  key: 6,
  class: "settled"
}, qm = {
  key: 1,
  class: "bar"
}, Fm = {
  key: 3,
  class: "detail body"
}, Wm = {
  key: 0,
  class: "body-label"
}, Hm = ["title"], Um = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = In(), a = ["onClick", "onAct"], s = I(() => Object.fromEntries(Object.entries(n).filter(([ie]) => !a.includes(ie)))), o = B(!1), r = I(() => !!(t.mark.detail || t.mark.command || t.mark.body)), l = I(() => t.open !== void 0), i = I(() => l.value || r.value), u = I(() => l.value ? t.open : o.value), d = I(() => l.value ? !t.open : r.value && !o.value), f = I(() => !!(t.mark.action && n.onAct)), p = I(() => i.value || f.value || !!n.onClick), v = B(null), b = B(null), { folded: x, phase: $ } = br(v, () => d.value);
    Am(v, d, $, $e(Se, null));
    function O(ie) {
      var ve, Oe;
      if (!(ie.target !== v.value && !b.value.contains(ie.target))) {
        if (l.value) return (ve = n.onClick) == null ? void 0 : ve.call(n, ie);
        if (r.value) return void (o.value = !o.value);
        (Oe = n.onAct || n.onClick) == null || Oe(ie);
      }
    }
    const q = (ie) => n.onAct(ie), Z = ["failed", "unfinished"], _ = I(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Z.includes(t.mark.state) ? "danger" : "good" : ""), y = I(() => t.mark.color ? t.mark.color : _.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : _.value ? `var(--tone-${_.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), E = I(() => y.value || "var(--tone-work)"), S = I(() => !t.mark.ending && !t.mark.ended && _.value !== "stopped"), T = Mm(), w = I(
      () => t.mark.began_at && S.value && !t.mark.figure && !t.mark.counting ? e1(T.value - t.mark.began_at) : ""
    ), A = I(() => {
      const { started: ie, ended: ve } = t.mark;
      return ie ? ve ? `ran ${Ps(ve - ie, !0)}` : Ps(T.value - ie, !0) : w.value;
    }), M = ["bad", "danger", "warn"], m = I(() => M.includes(_.value) || t.mark.asks ? "attention" : S.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), L = ["bad", "danger"], P = I(() => L.includes(_.value)), U = I(() => m.value === "process" ? "running" : P.value ? "cross" : _.value === "stopped" ? "stopped" : _.value === "good" ? "tick" : ""), ee = I(
      () => !!(t.mark.figure || A.value || t.mark.docked || t.mark.stopping || U.value || t.mark.settled || t.mark.news)
    ), X = I(() => [t.mark.title, t.mark.time ? wr(t.mark.time) : ""].filter(Boolean).join(" · ")), K = I(() => ({
      ...y.value ? { "--mark": y.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (ie, ve) => (c(), h("div", Ge(s.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${m.value}`,
        H($),
        {
          open: u.value,
          folding: l.value && d.value,
          live: p.value,
          failed: P.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: y.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: K.value,
      title: X.value,
      "data-figure-mark": e.mark.key,
      "data-folded": H(x) ? "" : null,
      "data-open": l.value && e.open ? "" : null,
      onClick: O
    }), [
      (c(), V(pt(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: b,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": i.value ? String(!!u.value) : void 0
      }, {
        default: D(() => [
          e.mark.markIcon ? (c(), V(Ye, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), V(pe, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Om, k(e.mark.worker), 1)) : C("", !0),
          g("span", Tm, [
            R(tt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Bm, k(e.mark.name), 1)) : C("", !0),
            i.value ? (c(), V(At, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : C("", !0)
          ]),
          ee.value ? (c(), h("span", Im, [
            e.mark.figure ? (c(), h("span", Rm, k(e.mark.figure), 1)) : C("", !0),
            A.value ? (c(), h("span", Lm, k(A.value), 1)) : C("", !0),
            e.mark.stopping ? (c(), h("span", Nm, "Stopping")) : C("", !0),
            e.mark.news ? (c(), h("span", Dm, k(e.mark.news), 1)) : C("", !0),
            U.value === "running" ? (c(), h("span", Pm)) : U.value ? (c(), V(Ye, {
              key: 5,
              class: J(["sign", U.value]),
              name: U.value
            }, null, 8, ["class", "name"])) : C("", !0),
            e.mark.settled ? (c(), h("span", jm, k(e.mark.settled), 1)) : C("", !0)
          ])) : C("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), V(vr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: ke(q, ["stop"])
      }, null, 8, ["label", "open"])) : C("", !0),
      (e.mark.figure || e.mark.counting) && S.value ? (c(), h("span", qm, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: E.value })
        }, null, 4)
      ])) : C("", !0),
      e.mark.detail && !H(x) ? (c(), V(tt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      e.mark.body && !H(x) ? (c(), h("div", Fm, [
        e.mark.bodyLabel ? (c(), h("p", Wm, k(e.mark.bodyLabel), 1)) : C("", !0),
        R(tt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : C("", !0),
      e.mark.command && !H(x) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, Hm)) : C("", !0),
      e.mark.card ? (c(), V(tt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : C("", !0),
      ce(ie.$slots, "default", {
        shown: !H(x)
      }, void 0, !0)
    ], 16, Cm));
  }
}), Mr = /* @__PURE__ */ Y(Um, [["__scopeId", "data-v-2aa9c496"]]), zm = 60;
function Vm(e, t) {
  const n = B([]), a = B(0);
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
    if (r || a.value <= 0 || d.scrollTop > zm) return;
    r = !0;
    const f = d.scrollHeight, p = await e(["output", "page", String(t()), "--before", String(a.value)]);
    r = !1, p.ok && (n.value = [...p.value.lines, ...n.value], a.value = p.value.first_byte, await st(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: l, follow: i, loadEarlier: u };
}
const Gm = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Sr(e) {
  var n;
  const t = Gm[e] || ((n = It(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Km = (e) => Sr(String(e).split(":")[0]), _r = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Ym = { passed: "good", failed: "danger", warned: "warn", running: "" }, Zm = { good: "good", warn: "warn", danger: "danger" }, Gs = {
  "open row": (e) => Ne(`${e.target_model}:${e.target_id}`),
  "open page": (e) => cu(e.target_model, e.target_id || 0)
}, Jm = { "open row": (e) => Km(e.target_model), "open page": () => Sr("pages") };
function Xm(e, t) {
  const n = t || {}, a = Gs[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? Ym[e.outcome] || "" : Zm[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: a ? Jm[a](e) : "",
    handlers: a ? { onAct: () => Gs[a](e) } : {}
  };
}
const Qm = 24, ep = 1e3, Ks = 2e3, tp = 0.25, np = 5e3;
function ap(e, t = Qm, n = () => !0) {
  const a = B(!1), s = B(0), o = B(!1);
  let r = 0, l = 0, i = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const _ = u();
    return _ ? _.scrollHeight - _.scrollTop - _.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function p(_) {
    if (clearTimeout(r), !_) {
      o.value = !1, i = Date.now();
      return;
    }
    const y = Date.now() - i < Ks ? Ks : ep;
    r = setTimeout(() => o.value = a.value, y);
  }
  function v() {
    clearTimeout(l), a.value = !1, s.value = 0, p(!1);
  }
  function b(_ = !1) {
    const y = u();
    y && _ && y.scrollTo ? y.scrollTo({ top: y.scrollHeight, behavior: "smooth" }) : y && (y.scrollTop = y.scrollHeight), v();
  }
  function x() {
    O(), !a.value && (a.value = !0, p(!0));
  }
  const $ = () => !!u() && d() <= u().clientHeight * tp;
  function O() {
    clearTimeout(l), $() && (l = setTimeout(() => a.value && $() && n() && b(!0), np));
  }
  function q() {
    f() ? v() : x();
  }
  function Z(_ = 1, y = !1) {
    a.value ? s.value += Math.max(0, _) : b(y);
  }
  return xo() && $o(() => [r, l].forEach(clearTimeout)), { away: a, missed: s, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: b, left: x, scrolled: q, arrived: Z };
}
const sp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, op = (e) => String(e ?? "").replace(sp, ""), rp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, a = t, s = B(null), { away: o, scrolled: r, arrived: l, toBottom: i } = ap(s);
    me(
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
      se(k(H(op)(e.lines.join(`
`)) || e.empty), 1),
      H(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (p) => H(i)(!0))
      }, "Follow")) : C("", !0)
    ], 544));
  }
}, lp = /* @__PURE__ */ Y(rp, [["__scopeId", "data-v-c2fb1783"]]), ip = 1e4;
class cp {
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
    return this.heardAt !== null && t - this.heardAt > ip;
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
const up = {
  key: 0,
  class: "frame-note"
}, dp = {
  key: 0,
  class: "frame-note"
}, fp = ["src", "title"], hp = 1e3, mp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = vt(), a = B(null), s = B(!1), o = B(!1);
    let r = null, l = 0;
    return Te(() => {
      r = new cp(a.value, n), r.start(), l = setInterval(() => {
        s.value = r.silent();
      }, hp);
    }), Ae(() => {
      r == null || r.stop(), clearInterval(l);
    }), (i, u) => o.value ? (c(), h("p", up, "This window was closed because it stopped answering.")) : (c(), h(G, { key: 1 }, [
      s.value ? (c(), h("div", dp, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        R(de, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: D(() => [...u[1] || (u[1] = [
            se("Close the window", -1)
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
        title: H(n).window
      }, null, 8, fp)
    ], 64));
  }
}, pp = /* @__PURE__ */ Y(mp, [["__scopeId", "data-v-32a49046"]]);
function gp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const vp = {
  class: "allowance-prompt",
  role: "dialog"
}, yp = { class: "allowance-prompt-text" }, kp = { class: "allowance-prompt-buttons" }, bp = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), h("div", vp, [
      g("p", yp, k(H(gp)(e.request)), 1),
      g("div", kp, [
        R(de, {
          kind: "primary",
          onClick: s[0] || (s[0] = (o) => n("answer", !0))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            se("Allow", -1)
          ])]),
          _: 1
        }),
        R(de, {
          onClick: s[1] || (s[1] = (o) => n("answer", !1))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            se("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, wp = /* @__PURE__ */ Y(bp, [["__scopeId", "data-v-102dc765"]]), ta = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), V(bn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: D(() => [
        se(k(e.reason) + " ", 1),
        e.retry ? (c(), V(de, {
          key: 0,
          onClick: s[0] || (s[0] = (o) => n("retry"))
        }, {
          default: D(() => [...s[2] || (s[2] = [
            se("Retry", -1)
          ])]),
          _: 1
        })) : C("", !0),
        e.removable ? (c(), V(de, {
          key: 1,
          onClick: s[1] || (s[1] = (o) => n("remove"))
        }, {
          default: D(() => [...s[3] || (s[3] = [
            se("Remove tab", -1)
          ])]),
          _: 1
        })) : C("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, xp = ["data-window", "data-agent"], $p = {
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
    const n = e, a = t, s = B(""), o = B(0);
    function r() {
      s.value = "", o.value++;
    }
    const l = $e(Ql, null), i = oc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: I(() => n.options),
      declared: n.declared,
      page: $e(Qi, null),
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
    El(Se, i), me(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Te(i.settle), Ae(() => {
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
      d() ? (c(), V(wp, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : C("", !0),
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
        }, null, 8, ["parts"])) : C("", !0)
      ], 64)) : (c(), V(ta, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (v) => a("remove"))
      }, null, 8, ["name"]))
    ], 8, xp));
  }
}, Er = /* @__PURE__ */ Y($p, [["__scopeId", "data-v-c4443e2b"]]), Mp = {
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
    const n = e, a = t, s = { render: () => Ua(pp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), V(Er, {
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
}, Sp = ["data-window"], _p = {
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
    const n = e, a = t, s = et(null), o = B("");
    return me(
      () => n.entry.entry_url,
      async (r) => {
        if (s.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            s.value = (await import(
              /* @vite-ignore */
              r
            )).default, $i();
          } catch (l) {
            if (wi(l) && xi(l)) return;
            o.value = `This window's file could not be loaded: ${l.message}`;
          }
      },
      { immediate: !0 }
    ), (r, l) => !s.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      R(xr, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Sp)) : (c(), V(Er, {
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
}, Ys = "*.*", Ep = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null }, environment: { type: String, default: "" } },
  setup(e) {
    var u;
    const t = e, n = $e(Se, null), a = new Gi(), s = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [Ys], (d) => a.dispatch(d));
    Ae(() => s == null ? void 0 : s());
    const o = (n == null ? void 0 : n.environment) ?? t.environment, r = { reads: [], runs: [], missing: [], ask: async () => !0 }, l = I(() => !!(t.declaration.shipped || t.declaration.trusted)), i = I(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: l.value ? [Ys] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => l.value ? (c(), V(_p, {
      key: 0,
      entry: i.value,
      subscriptions: H(a),
      environment: H(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), V(Mp, {
      key: 1,
      entry: i.value,
      subscriptions: H(a),
      environment: H(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Ap = { class: "mark-more-inner" }, Cp = {
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
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = $e(Se), a = I(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), s = I(() => _r.has(t.mark.variant) && t.mark.detail || ""), o = I(() => t.mark.target_model === Zs ? t.mark.target_id : 0), r = Vm((b) => n.run(b), () => t.mark.target_id), l = r.lines, i = B(!1), u = B(""), d = I(() => t.mark.target_model === Bp && !!t.mark.target_id);
    async function f(b = r.follow) {
      const x = await b();
      i.value = !0, u.value = x.ok ? "" : x.error;
    }
    let p = null;
    const v = () => clearInterval(p);
    return me(() => t.shown && d.value, (b) => {
      v(), b && (f(), t.mark.ended_at || (p = setInterval(f, Ip)));
    }, { immediate: !0 }), me(() => t.mark.ended_at, (b) => b && t.shown && d.value && (v(), f(r.newest))), Ae(v), (b, x) => (c(), h("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: x[1] || (x[1] = ke(() => {
      }, ["stop"]))
    }, [
      g("div", Ap, [
        e.declaration.body_url ? (c(), V(Ep, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(G, { key: 1 }, [
          s.value ? (c(), h(G, { key: 0 }, [
            x[2] || (x[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Cp, k(s.value), 1)
          ], 64)) : C("", !0),
          d.value && u.value ? (c(), h("p", Op, k(u.value), 1)) : d.value && i.value ? (c(), h(G, { key: 2 }, [
            x[3] || (x[3] = g("p", { class: "mark-label" }, "Output", -1)),
            R(lp, {
              class: "mark-terminal",
              lines: H(l),
              onOlder: H(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : a.value.length ? (c(), h("p", Tp, k(a.value.join(`
`)), 1)) : C("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: x[0] || (x[0] = ke(($) => H(Ne)(`${Zs}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : C("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ia = /* @__PURE__ */ Y(Rp, [["__scopeId", "data-v-3be263ac"]]), Lp = ["title", "aria-label", "onClick"], Np = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Dp = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = I(() => Nc(t.buttons, t.allowedRuns).filter((r) => {
      var l;
      return !((l = r.variants) != null && l.length) || r.variants.includes(t.mark.variant);
    })), a = B(""), s = $e(Se);
    async function o(r) {
      const l = await Zt(r, { id: t.mark.target_id }, s.environment);
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
        R(Ye, {
          name: i.icon
        }, null, 8, ["name"])
      ], 8, Lp))), 128)),
      a.value ? (c(), h("span", Np, k(a.value), 1)) : C("", !0)
    ], 64));
  }
}, Pp = /* @__PURE__ */ Y(Dp, [["__scopeId", "data-v-7a62c88e"]]);
function Ar(e, t) {
  const n = et(/* @__PURE__ */ new Map()), a = (o) => n.value = new Map(o.map((r) => [r.type, r])), s = async () => {
    try {
      return (await (await Et.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: a, read: s, fetchAll: async () => a(await s()), find: (o) => n.value.get(o) || null };
}
const Cr = Ar("/api/marks", "marks"), Q2 = Cr.fetchAll, jp = Cr.find, qp = 2e3;
function Or(e, t, n = qp) {
  let a = null;
  const s = () => {
    a = setTimeout(
      async () => {
        t() && await e(), s();
      },
      typeof n == "function" ? n() : n
    );
  };
  Te(async () => {
    await e(), s();
  }), Tt(() => clearTimeout(a));
}
const Fp = ["data-ref"], Wp = ["data-ref"], Hp = { class: "mark-row" }, Up = "dock add", zp = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), a = e, s = I(() => jp(a.mark.type)), o = $e(Se, null), r = I(() => !!(o && a.mark.target_model === "process" && a.mark.target_id && !a.mark.ended_at)), l = B(null);
    Or(async () => {
      if (!r.value) return;
      const v = await o.read(["output", "list", "--process", String(a.mark.target_id)]);
      v.ok && v.value.rows.length && (l.value = v.value.rows[0].progress);
    }, () => r.value);
    const i = I(() => {
      const v = Xm(a.mark, s.value), b = !v.figure || v.figure.endsWith("%");
      return l.value && r.value && b ? { ...v, figure: `${l.value}%`, fraction: l.value / 100 } : v;
    }), u = I(() => {
      var v;
      return !!(a.mark.lines || a.mark.detail && _r.has(a.mark.variant) || t.has(a.mark.target_model) || (v = s.value) != null && v.body_url);
    }), d = B(!1);
    function f(v) {
      if (i.value.handlers.onAct && !v.target.closest(".fold")) return i.value.handlers.onAct();
      d.value = !d.value;
    }
    const p = I(() => {
      var v;
      return (((v = s.value) == null ? void 0 : v.buttons) || []).filter((b) => {
        var x;
        return !a.docked || !((x = b.runs) != null && x.startsWith(Up));
      }).map((b) => ({ ...b, module: s.value.module }));
    });
    return (v, b) => {
      var x, $;
      return (x = s.value) != null && x.card ? (c(), h("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": H(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        R(Ia, {
          declaration: s.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Fp)) : (c(), h("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": ($ = s.value) == null ? void 0 : $.full_width, docked: e.docked, "user-side": H(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Hp, [
          R(Mr, Ge({
            mark: i.value,
            open: u.value ? d.value : void 0
          }, Cl(i.value.handlers), { onClick: f }), Ol({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: D(({ shown: O }) => [
                R(Ia, {
                  declaration: s.value || {},
                  mark: e.mark,
                  shown: O
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          R(Pp, {
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
    const t = e, n = B(!1), a = B(!1), s = B(!1), o = B(null);
    me(n, async (l) => {
      var i;
      a.value = !0, await st(), (i = o.value) == null || i.offsetHeight, s.value = l;
    });
    const r = I(() => ({
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
      R(Mr, {
        mark: r.value,
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
        g("div", Yp, [
          g("div", Zp, [
            (c(!0), h(G, null, te(e.group.marks, (u) => (c(), V(Vp, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Kp)) : C("", !0)
    ], 8, Gp));
  }
}, ew = /* @__PURE__ */ Y(Jp, [["__scopeId", "data-v-45b58b9b"]]);
function Xp(e) {
  const t = B(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Te(() => n.observe(e.value)), Tt(() => n.disconnect()), t;
}
const Qp = { class: "chat-dock-fold" }, eg = ["aria-label"], tg = { class: "chat-dock-head" }, ng = { class: "chat-dock-inner" }, Tr = 700, ag = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = B(null), a = B(null), s = Xp(a), o = B(!1);
    let r = 0;
    return Te(() => r = setTimeout(() => o.value = !0, Tr)), Tt(() => clearTimeout(r)), t({ card: n }), (l, i) => (c(), h("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", Qp, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          ce(l.$slots, "edge"),
          g("header", tg, [
            ce(l.$slots, "head")
          ]),
          g("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            g("div", ng, [
              g("div", {
                class: J(["chat-dock-grow", { settled: o.value }]),
                style: fe(H(s) === null ? null : { height: `${H(s)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: a
                }, [
                  ce(l.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, eg)
      ])
    ], 2));
  }
}, Br = /* @__PURE__ */ Y(ag, [["__scopeId", "data-v-512883e2"]]), sg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, na = 5, og = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(na, Math.max(0, e.endsAt - Date.now() / 1e3)), a = { animationDuration: `${na}s`, animationDelay: `${(n - na).toFixed(2)}s` };
    return (s, o) => (c(), h("span", sg, [
      g("i", { style: a })
    ]));
  }
}, Ir = /* @__PURE__ */ Y(og, [["__scopeId", "data-v-d0c4b012"]]), He = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, rg = {
  draft: [{ word: "ready", label: "Mark ready" }, He],
  ready: [He],
  approved: [{ word: "start", label: "Start", main: !0 }, He],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, He],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, He],
  completed: [],
  cancelled: []
}, lg = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, He],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, He],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, He],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, He],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, ig = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], cg = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], ug = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], dg = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], fg = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }];
function hg(e, t) {
  const n = { plan: rg, task: lg }[e], a = t != null && t.state ? Xi(e, t.state) : null;
  return a ? ((n == null ? void 0 : n[Do(e, t.state)]) ?? []).filter((s) => a.includes(s.word)) : (n == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}
const mg = (e, t) => e === "doc" || e === "report" ? fg(t) : e === "agent" ? [...ug(t), ...cg(t)] : e === "check" ? dg(t) : e === "question" ? ig(t) : hg(e, t), Rr = Ar("/api/docks", "docks"), tw = Rr.fetchAll, Ra = Rr.find, pg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), La = (e, t, n, a) => ({ action: e, icon: t, label: n, runs: a }), gg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), vg = (e) => e.kept ? La("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : La("keep", "pin", "Pin", `dock keep ${e.id}`), yg = ["pin", "stop"], kg = (e) => ({ ...e, iconOnly: yg.includes(e.icon) });
function bg(e, t) {
  var n;
  return [
    ...gg(e, t) ? [vg(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((a) => ({ ...a, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || It(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    La("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(kg);
}
const wg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: pg(e, t),
  buttons: bg(e, t)
}), xg = { class: "dock-title" }, $g = ["aria-expanded", "title"], Mg = { class: "chat-dock-acts dock-acts" }, Sg = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, _g = {
  key: 1,
  class: "dock-text"
}, Eg = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, a = e, s = I(() => Ra(a.item.type)), o = B(null), r = I(() => wg(a.item, s.value)), l = $e(Se), i = B(null);
    let u = 0;
    async function d() {
      var _, y;
      const $ = ++u, O = Mn(a.item.target_model ?? ""), q = `${O} show`;
      if (!((y = (_ = s.value) == null ? void 0 : _.reads) != null && y.includes(q))) return;
      const Z = await ft(a.item.type, [O, "show", String(a.item.target_id)], l.environment);
      $ === u && (i.value = Z.ok ? { ...Z.value, id: a.item.target_id, kind: O } : { id: a.item.target_id, kind: O });
    }
    me(() => [a.item.type, a.item.target_model, a.item.target_id, s.value], ($, O, q) => {
      var y;
      const Z = Mn(a.item.target_model ?? "");
      i.value = { id: a.item.target_id, kind: Z }, d();
      const _ = (y = l.subscriptions) == null ? void 0 : y.follow(`dock ${a.item.id}`, [`${Z.replaceAll("-", "_")}.*`], (E) => {
        (!E.row_id || E.row_id === a.item.target_id) && d();
      });
      q(() => {
        u += 1, _ == null || _();
      });
    }, { immediate: !0 });
    const f = B(/* @__PURE__ */ new Set()), p = B("");
    async function v($) {
      if ($.action === "open") return Ne(`${a.item.target_model}:${a.item.target_id}`);
      $.action === "declared" && (f.value = /* @__PURE__ */ new Set([...f.value, $.label])), p.value = "";
      const q = await Zt($, { id: a.item.target_id }, l.environment);
      (q == null ? void 0 : q.ok) === !1 && (f.value = new Set([...f.value].filter((Z) => Z !== $.label)), p.value = q.error);
    }
    const b = I(() => r.value.buttons.filter(($) => $.action !== "undock" && !f.value.has($.label))), x = I(() => r.value.buttons.find(($) => $.action === "undock"));
    return ($, O) => (c(), V(Br, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: D(() => [
        e.leaving ? (c(), V(Ir, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : C("", !0)
      ]),
      head: D(() => {
        var q, Z, _;
        return [
          (q = s.value) != null && q.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(G, { key: 1 }, [
            R(pe, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            g("span", xg, k(r.value.title), 1)
          ], 64)),
          (Z = s.value) != null && Z.badge ? (c(), h("span", {
            key: 2,
            class: J(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(s.value.badge), 3)) : C("", !0),
          (_ = s.value) != null && _.draws_head ? C("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: O[0] || (O[0] = (y) => n("fold"))
          }, [
            R(At, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, $g)),
          g("span", Mg, [
            R(Zc, {
              name: `dock.${e.item.type}`,
              row: i.value,
              environment: H(l).environment,
              "read-only": H(l).readOnly,
              onDone: d
            }, null, 8, ["name", "row", "environment", "read-only"]),
            (c(!0), h(G, null, te(b.value, (y) => (c(), h(G, {
              key: y.action + y.runs
            }, [
              y.iconOnly ? (c(), V(de, {
                key: 0,
                kind: "icon",
                "aria-label": y.label,
                title: y.label,
                "data-dock-action": y.action,
                onClick: (E) => v(y)
              }, {
                default: D(() => [
                  R(pe, {
                    name: y.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), V(de, {
                key: 1,
                small: "",
                kind: y.primary ? "primary" : "ghost",
                bordered: !y.primary,
                "data-dock-action": y.action,
                onClick: (E) => v(y)
              }, {
                default: D(() => [
                  se(k(y.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          R(Nn, {
            title: x.value.label,
            "data-dock-action": "undock",
            onClick: O[1] || (O[1] = (y) => n("undock", x.value))
          }, null, 8, ["title"])
        ];
      }),
      default: D(() => {
        var q, Z;
        return [
          p.value || e.refusal ? (c(), h("p", Sg, k(p.value || e.refusal), 1)) : C("", !0),
          e.item.text && !((q = s.value) != null && q.body_url) ? (c(), h("p", _g, k(e.item.text), 1)) : C("", !0),
          (Z = s.value) != null && Z.body_url ? (c(), V(Ia, {
            key: 2,
            declaration: s.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : C("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, Js = /* @__PURE__ */ Y(Eg, [["__scopeId", "data-v-35aad185"]]), Ag = 6, Cg = 3, Xs = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, ut = (e) => !!(e.leaves_at && !e.kept), Og = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!ut(e) || t < e.leaves_at || n.has(e.id)), Tg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((a) => Og(a, t, n)).sort((a, s) => a.id - s.id);
function Bg(e, t, n = Ag) {
  const a = e.length - n;
  if (a <= 0) return e;
  const s = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, a).map((o) => o.id));
  return e.filter((o) => !s.has(o.id));
}
const Ig = (e, t, n = e) => n < 2 ? !1 : e >= Cg ? !0 : t, Rg = ["title", "aria-label"], Lg = { class: "run-chip-in" }, Ng = {
  key: 0,
  class: "run-chip-ring"
}, Dg = { class: "run-chip-name" }, Pg = { class: "run-chip-bar" }, jg = "processes.output", qg = 5e3, Fg = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, a = e, s = ((d = $e(Se, null)) == null ? void 0 : d.environment) ?? "", o = B(null), r = I(() => !o.value || o.value.state === "running" || o.value.state === "background"), l = I(() => {
      var f, p;
      return ((f = o.value) == null ? void 0 : f.title) || ((p = o.value) == null ? void 0 : p.line) || a.item.title || `Run ${a.item.target_id}`;
    }), i = I(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await ft(jg, ["process", "card", String(a.item.target_id)], s);
      f.ok && (o.value = f.value);
    }
    return Or(u, () => r.value, qg), (f, p) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: l.value,
        "aria-label": `${l.value}; show its card`,
        style: fe({ "--tone": i.value })
      }, [
        H(ut)(e.item) ? (c(), V(Ir, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : C("", !0),
        g("span", Lg, [
          r.value ? (c(), h("span", Ng)) : (c(), V(Ye, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", Dg, k(l.value), 1)
        ]),
        g("span", Pg, [
          g("i", {
            style: fe({ width: r.value ? `${((v = o.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: i.value })
          }, null, 4)
        ])
      ], 12, Rg);
    };
  }
}, Wg = /* @__PURE__ */ Y(Fg, [["__scopeId", "data-v-597b05d2"]]), Hg = 24, Ug = 8, nw = 420;
function aw({ top: e, before: t, height: n, shown: a }) {
  const s = n - e - a;
  return s <= Hg && e > t ? !0 : e < t && s > Ug ? !1 : null;
}
const zg = (e, t) => e === void 0 ? t : e, Vg = { me: 1, people: [] }, ns = Ga({
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
  people: Vg,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: wn("journal.activity", !0),
  wide: !1,
  sideMini: wn("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Jo("journal.activity", () => ns.activity);
Jo("journal.side.mini", () => ns.sideMini);
const Lr = "journal.viewer.";
function Gg(e, t, n) {
  try {
    const a = n.getItem(Lr + e);
    return a === null ? t : JSON.parse(a);
  } catch {
    return t;
  }
}
function Kg(e, t, n) {
  try {
    n.setItem(Lr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function Yg(e, t, n = window.localStorage) {
  const a = B(Gg(e, t, n));
  return me(a, (s) => Kg(e, s, n), { deep: !0 }), a;
}
const Zg = {
  key: "runs-head",
  class: "dock-runs-head"
}, Jg = { class: "dock-runs-chips" }, Xg = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var E;
    const t = e, n = $m(500), a = B(/* @__PURE__ */ new Set()), s = B(!1), o = B(!1), r = $e(Se), l = B(/* @__PURE__ */ new Set()), i = B({});
    async function u(S, T) {
      l.value = /* @__PURE__ */ new Set([...l.value, S.id]);
      const w = await Zt(T, { id: S.target_id }, r.environment);
      (w == null ? void 0 : w.ok) === !1 && (l.value = new Set([...l.value].filter((A) => A !== S.id)), i.value = { ...i.value, [S.id]: w.error });
    }
    const d = I(() => Tg(t.items.filter((S) => !l.value.has(S.id)), n.value, a.value)), f = I(() => Bg(d.value.filter((S) => Xs(S, Ra)), n.value)), p = I(() => d.value.filter((S) => !f.value.includes(S) && !Xs(S, Ra))), v = I(() => f.value.filter((S) => !ut(S))), b = I(() => (s.value = Ig(f.value.length, s.value, v.value.length)) && !o.value), x = Yg(`dock-folded:${((E = ns.identity) == null ? void 0 : E.root) || location.host}`, {}), $ = (S) => zg(x.value[S.id], t.folded);
    function O(S) {
      x.value = { ...x.value, [S.id]: !$(S) };
    }
    function q(S) {
      x.value = { ...x.value, ...Object.fromEntries(f.value.map((T) => [T.id, T.id !== S.id])) }, o.value = !0;
    }
    function Z() {
      x.value = Object.fromEntries(Object.entries(x.value).filter(([S]) => !f.value.some((T) => String(T.id) === S))), o.value = !1;
    }
    function _(S) {
      a.value = /* @__PURE__ */ new Set([...a.value, S.id]);
    }
    function y(S) {
      a.value = new Set([...a.value].filter((T) => T !== S.id));
    }
    return (S, T) => (c(), V(wo, {
      tag: "div",
      name: "dock",
      duration: H(Tr),
      class: "dock-stack"
    }, {
      default: D(() => [
        (c(!0), h(G, null, te(p.value, (w) => (c(), V(Js, {
          key: w.id,
          item: w,
          class: J({ timed: H(ut)(w) }),
          leaving: H(ut)(w) && !a.value.has(w.id),
          folded: $(w),
          refusal: i.value[w.id],
          onFold: (A) => O(w),
          onUndock: (A) => u(w, A),
          onMouseenter: (A) => _(w),
          onMouseleave: (A) => y(w)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        s.value && o.value ? (c(), h("div", Zg, [
          g("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: Z
          }, [
            se(k(f.value.length) + " runs ", 1),
            R(At, { open: "" })
          ])
        ])) : C("", !0),
        (c(!0), h(G, null, te(b.value ? [] : f.value, (w) => (c(), V(Js, {
          key: w.id,
          item: w,
          class: J({ timed: H(ut)(w) }),
          leaving: H(ut)(w) && !a.value.has(w.id),
          folded: $(w),
          refusal: i.value[w.id],
          onFold: (A) => O(w),
          onUndock: (A) => u(w, A),
          onMouseenter: (A) => _(w),
          onMouseleave: (A) => y(w)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        b.value ? (c(), V(Br, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: D(() => [
            g("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run on a card",
              "data-dock-runs-open": "",
              onClick: T[0] || (T[0] = (w) => o.value = !0)
            }, [
              R(Ye, { name: "runs" }),
              se(" " + k(f.value.length) + " runs ", 1),
              R(At)
            ]),
            g("span", Jg, [
              (c(!0), h(G, null, te(f.value, (w) => (c(), V(Wg, {
                key: w.id,
                item: w,
                onClick: (A) => q(w)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : C("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, sw = /* @__PURE__ */ Y(Xg, [["__scopeId", "data-v-c63f6dea"]]), dt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, gn = (e) => Math.min(Math.max(e, 0), 1), Qg = (e) => {
  const t = gn(e);
  return t * t * (3 - 2 * t);
}, rt = (e, t, n) => Qg((e - t) / (n - t));
function ow(e) {
  const t = gn(e), n = gn((t - 0.12) / 0.76) * dt.shuffles, a = Math.min(Math.floor(n), dt.shuffles - 1), s = n - a, o = rt(s, 0.26, 0.38) * (1 - rt(s, 0.76, 0.96)), r = rt(s, 0.38, 0.76), l = rt(t, 0, 0.12) * (1 - rt(t, 0.88, 1)), i = rt(s, 0.2, 0.34) * (1 - rt(s, 0.84, 1)), u = Math.sin(Math.PI * gn((s - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (a + r) / dt.shuffles, lift: dt.lift * o, ready: l, weight: i, follow: u, shuffle: a, phase: s };
}
function rw(e, t, n, a, s) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: a, turning: !1 },
    seatPose: { face: a, from: e.facing, to: a, since: s, next: s + 4 }
  };
}
const Qs = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, lw = (e) => Qs[e] ?? Qs.butler, as = 2400, e0 = 0.05;
function t0({ y: e, speed: t }, n, a, s = 1 / 0) {
  const o = Math.min(a, e0), r = Math.min(t + as * o, s), l = e + r * o;
  return l < n ? { y: l, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function iw(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const a = e.intro || 0, s = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - s + t - n, e.frames - 1) : t < a ? t : a + (t - a) % (e.frames - a - s);
}
function n0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: a, extra: s } = t;
  return e < a + s ? n + (e - a) % (a - n) : e - s;
}
function cw(e, t) {
  const n = e.intro || 0, a = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / a) * a;
}
const uw = (e, t) => ({ ...e, stretch: t.stretch }), dw = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, Nr = (e, t) => t >= (e.least ?? 0);
function fw(e, t, n) {
  if (!Nr(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const a = e.leaves || e.frames;
  return Math.floor(t / a) > Math.floor(n / a);
}
const hw = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), a0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", eo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), s0 = (e) => e.right > e.left && e.bottom > e.top;
function mw(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var s;
  if (!e) return [];
  const n = e.getBoundingClientRect(), a = (s = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : s.getBoundingClientRect();
  return [...e.querySelectorAll(a0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let l = eo(r, n);
    const i = o.closest("[data-figure-scroll]");
    return i && !o.closest("[data-figure-chat-foot]") && (l = eo(l, i.getBoundingClientRect()), a && (l.bottom = Math.min(l.bottom, a.top))), s0(l) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: l }] : [];
  });
}
function Dr(e, t, n) {
  let a = null;
  for (const s of n) {
    const o = s.clip ?? s;
    let r = 0, l = 1;
    for (const [d, f, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[p]) && (l = -1);
      else {
        const b = (o[f] - e[d]) / v, x = (o[p] - e[d]) / v;
        r = Math.max(r, Math.min(b, x)), l = Math.min(l, Math.max(b, x));
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
}, Ut = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), o0 = (e) => e * e * (3 - 2 * e), Me = (e, [t, n]) => o0(Ut(e, t, n)), r0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], nt = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, cn = ([e, t], n) => e + n() * (t - e);
function l0(e) {
  return r0.map(() => {
    const t = cn(nt.speed, e), n = cn(nt.angle, e) * Math.PI / 180, a = cn(nt.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [cn(nt.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: a };
  });
}
const i0 = l0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function c0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * nt.gravity * (t[2] - nt.floor))) / nt.gravity;
}
function pw(e, t, n = i0) {
  const a = xe.rummage, s = (t - a.throws[e]) * a.frames / a.fps, o = n[e], r = c0(o, a.from), l = a.shrinks * a.frames / a.fps;
  if (s < 0 || s >= r + l) return null;
  const i = Math.min(s, r), u = a.from.map((d, f) => d + o.velocity[f] * i);
  return u[2] -= nt.gravity * i * i / 2, { at: u, turn: o.spin * i, landed: Math.max(0, s - r) / l };
}
const gw = (e, t) => e && xe[e.name] ? { name: e.name, u: t / e.frames } : null;
function vw(e, t) {
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
const yw = () => Array.from({ length: xe.pogo.count }, (e, t) => xe.pogo.bounce * (t + 1) / xe.pogo.count), _t = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function kw(e, t, n) {
  const { away: a, side: s } = xe.bug_smash, o = s * a * n, [r, l] = [t.left + _t.margin * n, t.right - _t.margin * n], i = Math.min(Math.max(e + o + s * _t.reach * n, r), l), u = i - o - e, d = i - (s * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [i - t.left, d - t.left] };
}
function bw(e, t, n) {
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
function ww(e, t, n, a) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= _t.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const s = t0({ y: e.y, speed: e.speed }, n, a);
  return { x: e.x, y: s.y, speed: s.speed, falling: !0 };
}
const Ce = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function xw(e) {
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
function u0(e, t) {
  const n = xe.bug_shot, [a, s] = n.turn.map((d) => d * n.frames), o = { from: a, to: s, extra: (t - 1) * (s - a) }, r = n0(e, o), l = e < a ? 0 : Math.min(Math.floor((e - a) / (s - a)), t - 1), u = e >= a + t * (s - a) ? t : l + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: l, shot: u };
}
function $w(e, t, n, { surfaces: a = [], bursts: s = null } = {}) {
  const o = xe.bug_shot, { frame: r, bug: l, shot: i } = u0(n, e.length), u = e.map((O, q) => ({ ...Na(O, t, Math.min(n / o.fps, vn(q).shot)), shot: q < i })), d = Me(r / o.frames, o.aim), [f, p] = [u[Math.max(l - 1, 0)], u[l]], v = e.map((O, q) => ({ bug: O, index: q, seconds: n / o.fps - vn(q).shot, spot: Na(O, t, vn(q).shot) })).filter((O) => O.seconds >= 0), b = v.flatMap((O) => {
    const q = (s == null ? void 0 : s.get(O.index)) ?? p0(O.bug, t, O.spot, s ? [] : a);
    return s == null || s.set(O.index, q), s && g0(q, O.seconds, a), v0(q, O.seconds, a);
  }), x = v.filter((O) => h0(O.bug)).map((O) => ({ seconds: O.seconds, from: O.spot })), $ = +(e[Math.max(l - 1, 0)].wall === "top") * (1 - d) + +(e[l].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (p.x - f.x) * d, y: f.y + (p.y - f.y) * d, back: $ }, slush: b, camera: x };
}
function vn(e) {
  const t = xe.bug_shot, [n, a] = t.turn.map((o) => o * t.frames), s = n + e * (a - n);
  return { walk: e ? s - (a - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: s + (t.aim[1] * t.frames - n), shot: (s + (t.splat * t.frames - n)) / t.fps };
}
function Mw(e, t, n, a) {
  const { limit: s, margin: o } = xe.bug_shot.back, [r, l] = [n.left + o * a, n.right - o * a];
  let i = n.x;
  return e.map((u, d) => {
    const f = vn(d), p = Na(u, t, f.shot), v = Math.abs(p.y - n.y) / Math.tan(s * Math.PI / 180), b = p.x === i ? i - r >= l - i ? -1 : 1 : Math.sign(i - p.x), x = Math.abs(p.x - i) >= v ? i : p.x + b * v, $ = b > 0 ? Math.max(i, Math.min(x, l)) : Math.min(i, Math.max(x, r)), O = { from: i, to: $, begin: f.walk, end: f.aim };
    return i = $, O;
  });
}
function Sw(e, t, n) {
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
const be = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, d0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function f0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const h0 = (e) => e.along * 97 % 1 < be.camera, zt = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * be.gravity * t * t });
function m0(e, t, n) {
  const s = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * be.gravity * (t.bottom - e.from.y))) / be.gravity, on: "floor" }];
  e.vx < 0 && s.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && s.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * be.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && s.push({ t: (-e.vy - Math.sqrt(o)) / be.gravity, on: "top" });
  const r = s.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let l = e.from;
  for (let u = 0; u < r.t; u += be.step) {
    const d = Math.min(u + be.step, r.t), f = zt(e, d), p = Dr(l, f, n);
    if (p) return { ...p, t: u + (d - u) * p.share };
    l = f;
  }
  const i = zt(e, r.t);
  return { ...r, x: Math.min(Math.max(i.x, t.left), t.right), y: Math.min(Math.max(i.y, t.top), t.bottom) };
}
function p0(e, t, n, a = []) {
  const s = f0(e.along + 1), [o, r] = d0[e.wall], l = Math.atan2(r, o);
  return Array.from({ length: be.count }, () => {
    const i = l + (s() - 0.5) * 2 * (be.spread * Math.PI / 180), u = be.speed[0] + s() * (be.speed[1] - be.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(i) * u, vy: Math.sin(i) * u, r: be.radius[0] + s() * (be.radius[1] - be.radius[0]) };
    return { ...d, ...m0(d, t, a) };
  });
}
function g0(e, t, n) {
  for (const a of e) {
    if (a.settled) continue;
    const s = Math.min(t, a.t);
    for (let o = a.checked ?? 0; o < s; o += be.step) {
      const r = Math.min(o + be.step, s), l = Dr(zt(a, o), zt(a, r), n);
      if (l) {
        Object.assign(a, l, { t: o + (r - o) * l.share });
        break;
      }
    }
    a.checked = t, a.settled = t >= a.t;
  }
}
function v0(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((a) => {
    if (t < a.t) return [{ ...zt(a, t), r: a.r, flying: !0 }];
    const s = t - a.t, o = 1 - Math.min(Math.max((s - be.hold) / be.fade, 0), 1);
    if (o <= 0) return [];
    const r = a.on === "surface" ? n.find((d) => d.id === a.surface) : null;
    if (a.on === "surface" && !r) return [];
    const l = r ? r.left + a.dx : a.x, i = r ? r.top + a.dy : a.y, u = r ? Math.min(s * s * 12, 48, Math.max(0, r.bottom - i)) : ["left", "right"].includes(a.on) ? Math.min(s * s * 8, 32) : 0;
    return [{ x: l, y: i, r: a.r * (1 + 1.2 * Math.min(s / 0.1, 1)), flying: !1, on: a.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function _w(e, t, n, a) {
  const { fly: s, drops: o, lens: r, frames: l, fps: i } = xe.bug_shot;
  if (e < 0) return [];
  const u = (s[1] - s[0]) * l / i, d = (o[1] - o[0]) * l / i, f = Me(e, [0, u]), p = Me(e, [u, u + d]);
  return r.map((v) => {
    const b = { x: a.x + v.at[0] * t, y: a.y + v.at[1] * t };
    return {
      x: n.x + (b.x - n.x) * f,
      y: n.y + (b.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: f >= 1
    };
  });
}
function Ew(e, t, n, a, s) {
  const { sway: o, above: r } = xe.chute, l = { x: t.x, y: t.y - r * a }, i = o / 2 * Math.sin(2 * Math.PI * s), [u, d] = [Math.cos(i * Math.PI / 180), Math.sin(i * Math.PI / 180)], f = (x) => {
    const [$, O] = [x.x - e.at.x, x.y - e.at.y];
    return { x: l.x + $ * u - O * d, y: l.y + $ * d + O * u };
  }, [p, v] = [...n].sort((x, $) => x.x - $.x), b = e.ends.map(f);
  return { left: l.x - e.at.x, top: l.y - e.at.y, middle: l, turn: i, lines: b.map((x, $) => ({ from: x, to: $ < b.length / 2 ? p : v })) };
}
const Aw = (e, t) => Me(t, e.grows) * (1 - Me(t, e.sinks));
function En(e, t) {
  const n = t * (e.intro + e.hold + e.outro), a = n >= e.intro && n < e.intro + e.hold;
  return { into: Ut(n, 0, e.intro), held: a ? (n - e.intro) / e.hold : null, out: Ut(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function Cw(e, t) {
  const n = xe[e];
  if (e === "pack_box") {
    const { into: a, held: s, out: o } = En(n, t), r = 1 - (1 - n.small) * Me(a, n.shrinks) * (1 - Me(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (s ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: a, out: s } = En(n, t), o = n.flat * Me(a, n.squashes) * (1 - Me(s, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * Ut(s, ...n.springs)) * (1 - Ut(s, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const Ow = (e) => e === "pack_box";
function Tw(e) {
  const { into: t, out: n } = En(xe.rope_swing, e);
  return 1 - Me(t, [0, 1]) * (1 - Me(n, [0, 1]));
}
function Bw(e) {
  const t = xe.rope_swing, { into: n, out: a } = En(t, e), s = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Me(n, [0, 1]) * (1 - Me(a, [0, 1])) * Math.sin(2 * Math.PI * t.swings * s);
}
const y0 = { after: 3 }, ss = 10, k0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, b0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, w0 = { weight: 19 }, Pr = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, x0 = { every: 120 }, jr = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, qr = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, $0 = {
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
}, Xt = (e, t, n, a) => ({ name: e, kind: t, weight: n, when: a, lifetime: ss }), ne = (e, t, n = {}) => Xt(e, "clip", t, n), aa = (e, t, n = {}) => Xt(e, "look", t, n), to = (e, t, n = {}) => Xt(e, "gaze", t, n), ue = (e, t, n = {}, a = {}) => ({ ...Xt(e, "pick", t, n), ...a }), ge = (e) => Xt("nothing", "nothing", e, {}), M0 = 120, S0 = 300, sa = (e, t) => ({ ...ne(e, t), cooldown: S0 }), re = (e, { cooldown: t = 0, ...n }, a) => a.map((s) => ({ ...n, ...s, when: { moment: e, ...s.when }, group: { name: e, cooldown: t } })), _0 = () => [ne("joy", 2)], lt = (e, t, n, a, s = {}) => ({ ...ne(e, t, { free: !0, lasted: n, ...s.when }), cooldown: a }), it = (e) => ({ ...e, cooldown: k0[e.name] }), Nt = (e) => ({ ...e, shenanigan: !0, lasts: b0[e.name] }), Pn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...re("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ne("nod", 2), ge(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...re("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...it(ne("bug_shot", 3)), toward: "", onto: !1 },
    { ...it(ne("bug_smash", 2)), toward: "", onto: !1 },
    ne("nod", 2)
  ]),
  ...re("tests_failed", { cooldown: 20, toward: "card" }, [ne("startled", 2), ne("dismay", 1), ne("tantrum", 3), ge(1)]),
  ...re("committed", { cooldown: 30, toward: "card", onto: !0 }, [ne("nod", 2), ge(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...re("sin_fixed", { cooldown: 300 }, [ne("halo", 1), ge(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...re("sin_committed", { cooldown: 300 }, [ne("repent", 1), ge(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...re("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ne("nod", 4), ne("hand_rub", 4), ge(7)]),
  ...re("question_asked", { cooldown: 60 }, [ne("ask_sign", 9), ne("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...re("reported", { cooldown: 90 }, [to("read", 3), ne("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...re("read_message", { cooldown: 30 }, [to("read", 3), ge(1)]),
  ...re("fact_filed", { cooldown: 120 }, [ne("file_card", 3), ne("nod", 1), ge(6)]),
  ...re("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ne("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...re("bar_done", { holds: !0 }, _0()),
  ...re("bar_failed", { holds: !0 }, [ne("fume", 1), ne("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...re("standing", { cooldown: 12 }, [ne("look_left", 2), ne("look_right", 2), ne("look_up", 1), ge(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...re("launched", { cooldown: 300 }, [ne("tumble", 3), ge(47)]),
  // a break from the hammering now and then
  ...re("building", { cooldown: 30 }, [ne("wipe_brow", 4), ne("look_left", 1), ne("look_right", 1), ge(69)]),
  ...re("failed", { cooldown: 20, toward: "card" }, [ne("shake", 3), ne("tantrum", 2), ge(2)]),
  ...re("refused", { cooldown: 20 }, [ne("shake", 1), ge(1)]),
  ...re("work_done", { cooldown: 120 }, [ne("stretch", 2), ge(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...re("pondering", { cooldown: [30, 60] }, [ue("ponder", 1)]),
  ...re("thought_cloud", { cooldown: 90 }, [ue("cloud", 1)]),
  ...re("light_bulb", { cooldown: 150 }, [ue("bulb", 1)]),
  ...re("answered", { cooldown: 15 }, [aa("amused", 3), ge(2)]),
  ...re("heard", { cooldown: 30 }, [
    ne("bow", 1, { voices: ["butler"] }),
    ne("salute", 1, { voices: ["squire"] }),
    ne("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ge(1)
  ]),
  ...re("long_walk", { cooldown: 90 }, [ne("stumble", 3), ge(22)]),
  ...re("card_arrived", { cooldown: 20, toward: "card" }, [ne("glance", 7), ge(13)]),
  ...re("typing", { cooldown: 60 }, [aa("reading", 1), ge(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries($0).flatMap(([e, t]) => re(`reacted:${e}`, {}, [aa(t, 1)])),
  ...Object.entries(jr).flatMap(([e, t]) => Object.entries(t).map(([n, a]) => re(`agent_reacted:${n}`, {}, [ne(a, 1, { voices: [e] })])[0])),
  ...Object.entries(qr).flatMap(([e, t]) => re(`agent_reacted:${e}`, {}, [ne(t, 1)])),
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
    { ...Nt(it(ne("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Nt(it(ne("disco", 2, { ball: "bubble" }))),
    ge(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...re("held:search", { cooldown: M0 }, [sa("search", 3), { ...sa("binoculars", 2), when: { home: !0 } }, { ...sa("glass_bubble", 2), when: { bubble: !0 } }]),
  ...re("held:type", {}, [ne("type", 3), ne("type_ponder", 1)]),
  ...re("held:compacting", {}, [ne("pack_box", 3), ne("vacuum", 2), ne("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...re("spell", {}, [ue("writing", 12, { state: "writing" }), ue("reading", 12, { state: "reading" }), ue("searching", 12, { state: "searching" }), ge(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...re("tickled", {}, [{ ...it(ne("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...re("eager", {}, [ne("eager", 2, { slow: !0 }), ge(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...re("jump", {}, [Nt(it(ne("backflip", 7, { high: !0 }))), ne("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...re("climb", {}, [ue("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...re("unit", { cooldown: Pr.build.cooldown }, [ue("unit", w0.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...re("progress_jump", { cooldown: 6 }, [ne("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...re("perch", {}, [{ ...ue("hang", 1, { hands: !0, free: !0 }), cooldown: x0.every }, ue("stand", 5)]),
  // a digit a blow's dust lets out
  ...re("digit", {}, [ue("0", 1), ue("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...re("roam", {}, [
    ue("rest", 35, {}, { stay: [25, 60] }),
    ue("seat", 15, {}, { stay: [15, 40] }),
    ue("edge", 25, {}, { stay: [8, 20] }),
    Nt(ue("bubble", 15, {}, { stay: [30, 80] })),
    // while its agent works, now and then, bored of the spot, it takes its work up onto a bubble a while
    ue("bubble", 6, { free: !1 }, { stay: [20, 45] }),
    ue("tab", 10, {}, { stay: [10, 25] }),
    // with nothing to do, it sits on the edge of the floor it stands on, facing the viewer, its legs over the edge
    ue("ledge", 9, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do, it walks to near the middle of the floor it stands on and sits there composed, facing the viewer, its hands
    // flat on the floor at its sides (perches.js composedSpot)
    ue("composed", 8, { free: !0 }, { stay: [25, 50] }),
    // with nothing to do, beside the side of a bubble rising over the floor it stands on, it leans against it to rest a while (perches.js
    // leanSpot)
    ue("lean", 2, { free: !0 }, { stay: [20, 45] }),
    // with nothing to do and a bubble near the middle of the chat above it, it ties a rope swing under that bubble and swings
    Nt(it(ue("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...re("laptop", {}, [ue("seat", 6, {}, { stay: [60, 150] }), ue("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...re("ledge_at", {}, [ue("middle", 2, {}, { along: 1 / 2 }), ue("third", 1, {}, { along: 1 / 3 }), ue("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...re("composed_as", {}, [
    ue("facing", 4, {}, { turn: 0, leans: 0 }),
    ue("turned_left", 1, {}, { turn: 335, leans: 0 }),
    ue("turned_right", 1, {}, { turn: 25, leans: 0 }),
    ue("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    ue("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], Fr = (e, t) => Object.entries(e).every(([n, a]) => n === "voices" ? a.includes(t.voice) : n === "lasted" ? t.lasted >= a : t[n] === a), Wr = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), E0 = (e) => Array.isArray(e) ? e[0] : e, A0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, C0 = (e) => Pn.some((t) => t.when.moment === e);
function O0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), a = (d) => !e.memory || Wr(d).every(([f, p]) => n(f) >= E0(p)), s = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Pn.filter((d) => Fr(d.when, e) && (d.kind !== "clip" || t(d.name)) && a(d) && s(d)), l = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= y0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, i = l.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return i.some((d) => d.kind !== "nothing") ? i : l;
}
function De(e, t) {
  const n = O0(e);
  let a = t() * n.reduce((o, r) => o + r.weight, 0);
  const s = n.find((o) => (a -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !s || s.kind === "nothing" ? null : (Hr(e, s, t), e.tally && Object.assign(e.tally, { plain: s.shenanigan ? 0 : e.tally.plain + 1, last: s.name }), s);
}
function Hr(e, t, n) {
  var a;
  for (const [s, o] of Wr(t)) (a = e.memory) == null || a.set(s, e.now + A0(o, n));
}
function Iw(e, t, n) {
  Hr(e, Pn.find((a) => a.when.moment === e.moment && a.name === t), n);
}
const Rw = (e) => Object.values(Pr).find((t) => Fr(t.when, e)) ?? null, T0 = (e, t, n) => n - t <= (e.lifetime ?? ss), Lw = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || Nr(e.clip, t));
class Ur {
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
}, Nw = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), zr = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), Dw = {
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
}, Pw = 120, B0 = 20, jw = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < B0), I0 = (e) => Da[e] || Da.idle, qw = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, Vr = "airborne", R0 = "landing", L0 = "travelling", Gr = "grounded", Fw = ({ airborne: e, landing: t, trip: n }) => e ? Vr : t ? R0 : n != null && n.started ? L0 : Gr;
function Ww(e, t) {
  var s;
  const n = N0(e, t);
  return e.mode === Gr && e.place.posture === "lounge" && !((s = e.trip) != null && s.started) ? { ...n, facing: e.place.face } : n;
}
function N0(e, t) {
  const { mode: n, leaving: a, arriving: s, trip: o, landing: r, place: l, beat: i, state: u, doing: d, doingFacing: f = 0, readingFacing: p = null } = e;
  if (n === Vr && l.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? l.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (a) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (s) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (i == null ? void 0 : i.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...D0(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (l.posture === "hang") return { clip: `hang_${l.grip}`, facing: l.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (i && !(i.onto && o)) return { clip: i.clip, facing: i.facing, once: !0, ...i.holds && { holds: !0 }, ...i.stretch && { stretch: i.stretch } };
  if (l.view && u === "asking") return { clip: "point", facing: 0 };
  const v = p !== null && l.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? p : e.composeFacing ?? 0 } : { clip: t(d, l.posture) ? d : I0(u), facing: v ? p : l.posture === "sit" ? l.face : f };
}
function D0(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const a = e.way > 0 ? 90 : 270, s = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: a, ...s } : t !== "idle" && n(t, "walk") ? { clip: t, facing: a, posture: "walk", ...s } : { clip: "walk", facing: a, ...s };
}
const Pa = (e) => e.outcome, P0 = "plugin:code-commandments:sins:", no = (e) => e.type === "plugins.card" && e.markKey.startsWith(P0), j0 = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => no(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => no(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], Hw = (e, t) => e.filter((n) => n.author === "user" && Sn(n.read_at) > t).map((n) => ({ beat: "read_message", time: Sn(n.read_at), card: fr(n) })).sort((n, a) => n.time - a.time), ao = { user: "reacted", agent: "agent_reacted" };
function Uw(e, t) {
  return e.filter((n) => ao[n.author] && mt(n) > t).map((n) => ({ beat: `${ao[n.author]}:${n.emoji}`, time: mt(n), card: `message:${n.message_id}` })).sort((n, a) => n.time - a.time);
}
const q0 = [.../* @__PURE__ */ new Set([...Object.values(jr).flatMap((e) => Object.keys(e)), ...Object.keys(qr)])];
function zw(e, t) {
  return e.filter((n) => n.author === "agent" && mt(n) > t).map((n) => {
    var a;
    return { m: n, face: (a = q0.map((s) => [s, n.text.indexOf(s)]).filter(([, s]) => s >= 0).sort((s, o) => s[1] - o[1])[0]) == null ? void 0 : a[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: a }) => ({ beat: `agent_reacted:${a}`, time: mt(n), card: fr(n) })).sort((n, a) => n.time - a.time);
}
const F0 = (e) => new Ur(e).isTest(), An = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[Pa(e)] || "";
}, W0 = 1800, H0 = (e, t) => {
  if (An(e) !== "finished") return "tests_failed";
  const n = t.filter((s) => Number(s.time) < Number(e.time)).sort((s, o) => Number(o.time) - Number(s.time))[0];
  return n && An(n) !== "finished" && Number(e.time) - Number(n.time) <= W0 ? "tests_fixed" : "tests_passed";
};
function Vw(e, t, n) {
  var r;
  const a = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(F0), s = a.filter((l) => An(l)), o = s.filter((l) => t.get(l.key) === "" || !t.has(l.key) && Number(l.time) > n);
  return a.forEach((l) => t.set(l.key, An(l))), o.map((l) => ({ beat: H0(l, s), time: Number(l.time), card: l.key }));
}
function Gw(e, t) {
  var s;
  const n = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.process), a = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(Pa(o)));
  return n.forEach((o) => t.set(o.key, o.active)), a.map((o) => ({ tone: Pa(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const Kw = (e) => e.map((t) => {
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
function Yw(e, t, n) {
  return e.map((a) => {
    const s = t.get(a.key), o = s ? s.variant === a.variant ? s.time : n : a.time;
    return t.set(a.key, { variant: a.variant, time: o }), { ...a, time: o };
  });
}
function Zw(e, t, n) {
  var s;
  const a = (((s = e == null ? void 0 : e.data) == null ? void 0 : s.cards) || []).filter((o) => o.key && !t.has(o.key));
  return a.forEach((o) => t.add(o.key)), a.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function Jw(e, t) {
  var o, r;
  const a = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((l) => l.time > t).map((l) => {
    var i;
    return { beat: (i = j0.find((u) => u.matches(l))) == null ? void 0 : i.beat, time: l.time, card: l.key };
  }).filter((l) => l.beat), s = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...a, ...s > t ? [{ beat: "heard", time: s }] : []].sort((l, i) => l.time - i.time);
}
function os(e, t, n, a) {
  const s = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(a / s, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const so = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function U0(e, t, n, a) {
  let [s, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const l = (s + o) / 2;
    os(e, t, l, a).pitch > n ? s = l : o = l;
  }
  return (s + o) / 2;
}
function Xw(e, t, n, a = {}) {
  const s = De({ moment: `held:${e}`, has: n, ...a }, t);
  return s ? s.name : C0(`held:${e}`) ? "idle" : e;
}
const Ee = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function Qw(e, t, n) {
  const a = (e.left + e.right) / 2 - t;
  return Math.abs(a) < Ee.ahead * n ? 180 : Math.sign(a) * Ee.turn;
}
const oo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function e5(e, t) {
  const n = Math.min(Ee.inset, Math.max(e.right - e.left, 0) / 2), a = Math.min(Ee.inset, Math.max(e.bottom - e.top, 0) / 2), s = Math.max(1, Math.min(Ee.lines, Math.floor((e.bottom - e.top - 2 * a) / Ee.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Ee.sweep) % s, l = o % Ee.sweep, i = Ee.sweep - Ee.returnSeconds, u = oo((l - i) / Ee.returnSeconds), d = l <= i ? oo(l / i) : 1 - u, f = r + ((r + 1) % s - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + a + f * Ee.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const ro = 3, Kr = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, lo = 12, t5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function n5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Kr(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const a = n - e.began;
  return a >= ro ? { looking: null, eyes: null } : { looking: { ...e, seen: a }, eyes: { mood: e.mood, seconds: Math.floor(a * lo) / lo, lasts: ro } };
}
const a5 = (e) => e.posture === "hang" && !Kr(e.face), z0 = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), V0 = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function s5(e, t, n) {
  return z0.has(e) ? 1 / 0 : !V0.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Yr(n - t.began, t.share) - Ue.lead, 0);
}
const G0 = 5;
function o5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const a = t || n;
  return { began: a, moment: n - a >= G0 ? { beat: "long_walk", time: n } : null };
}
const K0 = 30, un = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function r5(e, t, n, a, s = null) {
  if (t && n < t.until || !un.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = De({ moment: "spell", state: e, tally: s }, a), [r, l] = un.seconds;
  return o ? { state: o.name, began: n, until: n + r + a() * (l - r), next: n + un.every } : { state: e, began: 0, until: 0, next: n + un.every };
}
const l5 = (e, t, n) => t && n < t.until && zr.has(e.state) ? { state: t.state, since: t.began } : e, Ue = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Yr = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function i5(e, t, n, a) {
  var l;
  const s = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!s || e.ended)) {
    const i = s ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: i ? { beat: i } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = a - e.began, r = Yr(o, e.share);
  return s ? { eager: Y0(t, r), moment: null } : r > Ue.lead ? { eager: t, moment: null } : r < Ue.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Ue.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Ue.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((l = De({ moment: "eager", slow: !0 }, n)) == null ? void 0 : l.name) === "eager" }, moment: null };
}
function Y0(e, t) {
  return e.on && t > Ue.lead + Ue.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Ue.lead && t >= Ue.least ? { ...e, on: !0, calm: !1 } : e;
}
const Z0 = 1, J0 = { look: "look", gaze: "gaze" };
function X0(e, t, n, a, s = "", o = () => !0, r = null) {
  const l = De({ moment: e, voice: s, has: o, memory: t, now: n, tally: r }, a);
  return l ? { [J0[l.kind] ?? "clip"]: l.name, toward: l.toward ?? "", onto: !!l.onto, holds: !!l.holds, lifetime: l.lifetime } : null;
}
const Q0 = (e, t, n, a, s, o = "", r = () => !0, l = null, i = "") => De({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: a, tally: l, ball: i }, s), ev = (e, t, n, a, s, o = 0) => De({ moment: "jump", high: e > Z0 * t, memory: a, now: s, room: o }, n).name === "backflip", tv = { work: ["building"], idle: ["standing"] };
function c5(e, t, n, a) {
  const s = Da[e], o = [...t ? [{ beat: "typing", time: a }] : [], ...(tv[s] ?? []).map((r) => ({ beat: r, time: a }))];
  return e === "thinking" && o.push({ beat: "pondering", time: a, during: "thinking" }), zr.has(e) ? { moments: o, began: n || a } : (n && a - n >= K0 && o.push({ beat: "work_done", time: a }), { moments: o, began: 0 });
}
function nv(e, t, n) {
  return !De({ moment: "pondering", memory: e, now: t }, n) || !De({ moment: "thought_cloud", memory: e, now: t }, n) ? null : De({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const io = { pondering: nv };
function u5(e, t, n, a, s, o) {
  if (io[e.beat]) {
    const l = io[e.beat](n.reacted, a, s);
    return l && o(l) ? { beat: { clip: l, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = X0(e.beat, n.reacted, a, s, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== ss && { lifetime: r.lifetime } } } : null;
}
function d5(e, t, n, a, s, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const i = Q0(e.room ?? 0, t.lasted, n, a, s, e.voice, o, r, e.ball);
  return i && { clip: i.name, card: "", flies: !!i.flies };
}
const f5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function h5(e, t, n) {
  var s;
  return !!n && ((s = e[0]) == null ? void 0 : s.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function m5(e, t) {
  const n = e.findIndex((a) => a.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const p5 = (e, t) => !!(e != null && e.watches) && !t.once, g5 = 10, v5 = (e, t, n) => e.filter((a, s) => s === 0 && a.clip === t || !a.queuedAt || T0(a, a.queuedAt, n)), y5 = (e, t) => t ? null : e[0] ?? null;
function k5(e, t, n) {
  var s;
  const a = e.filter((o) => !o.during || o.during === t);
  return { beats: a, cut: !!n && ((s = e[0]) == null ? void 0 : s.clip) === n && a[0] !== e[0] };
}
const b5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), av = 2 * Math.PI, sv = 500;
function w5(e, t, n, a, s = null, o = 1) {
  const r = a - (e.at || a), l = r / sv, i = t && e.point && !!t.behind != !!e.point.behind, u = i && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + l, d) : Math.max(e.amount - l, d), p = av * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !i ? s && !t.behind && !v.behind ? rv(v, t, n, p, s) : iv(v, t, n, p) : t) ?? v, $ = x != null && x.behind && x.mood === "reading" ? ov(e.point, x, n, r, s) : x;
  return { point: $ ?? null, toward: $ ? { x: $.x - n.x, y: $.y - n.y } : null, amount: f, at: a };
}
function ov(e, t, n, a, s) {
  const o = (w) => w * 180 / Math.PI, r = (w) => o(Math.atan2(Math.sin(w * Math.PI / 180), Math.cos(w * Math.PI / 180))), l = (s == null ? void 0 : s.facing) ?? 0, i = (s == null ? void 0 : s.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -i)) - l), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -i)) - l), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = f ? r(e.readingFacing - l) : 0, v = f ? e.readingYaw + p : d, b = v + r(u - v), x = Math.min(Math.max(a / 1e3, 0), 0.1), $ = Ee.turnSpeed * x, O = f ? v + Math.min(Math.max(b - v, -$), $) : b, q = f ? e.readingFollow + p : O, Z = q + (O - q) * (1 - Math.exp(-x / Ee.followSeconds)), _ = (s == null ? void 0 : s.tip) ?? { up: 25, down: 35 }, y = o(os(t.x - n.x, -i, n.y - t.y, (s == null ? void 0 : s.above) ?? 0).pitch), E = Math.min(Math.max(y, -_.up), _.down), S = Ee.tipSpeed * x, T = f ? e.readingPitch + Math.min(Math.max(E - e.readingPitch, -S), S) : E;
  return { ...t, readingYaw: O, readingFollow: Z, readingPitch: T, readingFacing: l };
}
function rv(e, t, n, a, { depth: s, above: o, tip: r }) {
  const l = (q) => {
    const { yaw: Z, pitch: _ } = os(q.x - n.x, s, n.y - q.y, o);
    return { yaw: Z, pitch: Math.min(Math.max(_, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [i, u] = [so(l(e)), so(l(t))], d = Math.acos(Math.min(Math.max(i[0] * u[0] + i[1] * u[1] + i[2] * u[2], -1), 1));
  if (d <= a) return { ...t };
  const f = a / d, [p, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [b, x, $] = i.map((q, Z) => p * q + v * u[Z]), O = s * b / x;
  return { ...t, x: n.x + O, y: n.y - U0(O, s, -Math.asin(Math.min(Math.max($, -1), 1)), o) };
}
const lv = 0.15;
function x5(e, t, n) {
  const a = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) <= lv;
}
function iv(e, t, n, a) {
  const s = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - s), Math.cos(o - s)), l = s + Math.max(-a, Math.min(a, r)), i = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + i * Math.cos(l), y: n.y + i * Math.sin(l) };
}
const cv = (e) => !(e != null && e.on);
function $5(e, t, n) {
  if (cv(e)) return { answer: [...t, ...n], held: [] };
  const a = [...t, ...n].filter((s, o, r) => r.findIndex((l) => l.beat === s.beat && l.card === s.card) === o);
  return { answer: [], held: a };
}
const Vt = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, We = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, oa = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), co = (e) => e * e * (3 - 2 * e);
function uv(e) {
  if (e < 0 || e >= We.seconds) return null;
  const t = oa(e, ...We.flicker), n = Math.floor(t * We.flickers * 2) % 2 === 0, a = e < We.flicker[1] ? n ? 0.35 + 0.5 * t : We.dim : 1;
  return { strength: 1 - co(oa(e, ...We.fade)), lit: a, white: e < We.flash[0] ? 0 : 1 - co(oa(e, ...We.flash)) };
}
const M5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function S5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const a = uv(t - e.at);
  return a && { colour: Vt.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: We.signs[e.tone], ...a } };
}
function _5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function E5(e, t, n) {
  if (!e || e.at !== null) return e;
  const a = t ? e.facedAt ?? n : null;
  return a !== null && n - a >= Vt.looks || a === null && n - e.since >= Vt.waits ? { ...e, at: n } : { ...e, facedAt: a };
}
function A5(e, t) {
  const a = Math.floor(e * t * 2) * 137 % 360 / 360, s = (l) => (l + a * 12) % 12, o = (l) => 0.5 - 0.5 * Math.max(-1, Math.min(s(l) - 3, 9 - s(l), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const Qe = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, C5 = { behind: 39, figure: 40, ahead: 41 }, dv = "[data-figure-pile]", fv = { amber: [1, 0.69, 0.125], good: Vt.colours.good, bad: Vt.colours.bad }, yn = { phases: 4, ms: 230, dim: 0.25 }, O5 = (e, t, n) => e !== "amber" || (t + n) % yn.phases < yn.phases / 2 ? 1 : yn.dim, T5 = (e) => e === "amber" ? yn.phases : 1;
function B5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((a) => a.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const I5 = Object.keys(fv), Pe = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Dt = ([e, t], n) => e + n() * (t - e);
function R5(e) {
  const t = Pe.least + Math.floor(e() * (Pe.most - Pe.least + 1));
  return Array.from({ length: Math.min(t, Pe.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Pe.spread, [a, s] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Dt(Pe.start, e), r = Dt(Pe.reach, e);
    return {
      text: De({ moment: "digit" }, e).name,
      x: a * o,
      y: Pe.middle + s * o,
      dx: a * r,
      dy: s * r,
      moveMs: Math.round(Dt(Pe.moveMs, e)),
      fadeMs: Math.round(Dt(Pe.fadeMs, e))
    };
  });
}
const ra = { high: 3, gap: 1 };
function L5(e) {
  const t = Math.floor(e / ra.high);
  return { left: -(Qe.inside + Qe.width / 2 + t * (Qe.width + ra.gap)), up: e % ra.high * (Qe.height - Qe.top) };
}
const hv = (e, t, n) => De({ moment: "unit", memory: e, now: t }, n) !== null, mv = { after: 5 }, pv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Ur(t).isBuild());
function N5(e, t, n) {
  const a = pv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], s = a ? { card: a.key, since: Number(a.time) } : t;
  return s && n - s.since >= mv.after ? s : null;
}
function D5(e, t, n, a, s) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", a), t ? o && e.granted ? e : { card: t.card, granted: hv(n, a, s) } : null;
}
const uo = { ahead: 140, up: 70 };
function P5(e, t, n, a, s) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + s * uo.ahead, y: a - uo.up } } : o ? { at: { x: n(o), y: a - o.up - Qe.height } } : t ? { at: null } : null;
}
const la = { least: 4e3, most: 1e4 }, gv = (e) => la.least + e() * (la.most - la.least), ct = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function j5(e, t) {
  const n = [];
  let a = 0;
  for (; ; ) {
    const s = gv(t);
    if (n.length >= ct.most || t() >= ct.chance) return { began: e, until: e + a + s, inspects: n };
    const o = a + s * (ct.at[0] + t() * (ct.at[1] - ct.at[0]));
    n.push({ from: o, to: o + ct.ms }), a = o + ct.ms;
  }
}
const q5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), F5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Zr = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), W5 = new Set(Pn.filter((e) => Zr.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), vv = (e) => e.some((t) => t.state === "built"), H5 = (e, t) => vv(t) ? e.filter((n) => !Zr.has(n.beat)) : e, at = { reach: 40, room: 6 }, yv = (e, t) => t <= e - at.reach + 2, U5 = (e, t, n) => yv(e, n) ? t - at.reach : e - at.reach - at.room, z5 = (e, t, n, a) => a > 0 && t < e && t + at.reach >= e - 2 ? Math.min(n, Math.max(e, t + at.reach)) : e, ia = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, V5 = (e) => Dt(e() < ia.longShare ? ia.long : ia.short, e), kv = 2 * Qe.width;
function G5(e, t, n, a) {
  const s = Math.max(t - e, 1), o = e + a() * s;
  return n === null || Math.abs(o - n) >= kv ? o : e + (o - e + s / 2) % s;
}
const bv = 60, K5 = (e, t, n, a) => e.length > 0 && e.every((s) => s.state === "piled") && !t && n !== null && a - n >= bv, fo = "[data-figure-home]", Qt = () => {
  var t;
  const e = document.querySelector(fo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(fo)].find((n) => {
    var a;
    return (a = n.checkVisibility) == null ? void 0 : a.call(n);
  }) ?? e;
}, wv = "[data-figure-docked-bars]", xv = "[data-figure-chat-foot]", $v = [0.85, 0.6, 0.35, 0.15], Mv = ["question", "waiting", "suggestion"], Y5 = (e, t) => Mv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function Z5() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Sv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", _v = "[data-figure-newest]";
function Jr() {
  var a, s;
  const e = (a = Qt()) == null ? void 0 : a.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(_v), n = t ? [t] : [...((s = e.querySelectorAll) == null ? void 0 : s.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, l;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((l = o.getAttribute) == null ? void 0 : l.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !rs(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function Gt(e, t, n = Jr()) {
  if (!e || !n) return !0;
  const a = Ze(e, t), s = qn(e), o = { left: a.left + Math.min(s.left, 0.27) * t.size, right: a.left + Math.max(s.right, 0.73) * t.size, top: a.top + _e.top * t.size, bottom: a.top + _e.bottom * t.size }, r = dt.gap;
  return !jn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function J5(e, t, n, a = Jr()) {
  if (!a || Gt(t, e, a)) return null;
  const s = qn(t), o = (0.5 - Math.min(s.left, 0.27)) * e.size, r = (Math.max(s.right, 0.73) - 0.5) * e.size, l = kt(), i = t.posture === "stand" ? is * e.size : ol * e.size, u = Math.max(n.left + i, l.left + o), d = Math.min(n.right - i, l.right - r);
  return [a.left - dt.gap - r, a.right + dt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= u && p.x <= d && Gt(p, e, a) && ty(p, e)).sort((p, v) => Math.abs(p.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const ca = 0.26, Xr = 0.54, Ev = 1.25 / 5.4, en = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: ca, travels: "stand" },
  lounge: { drop: ca, travels: "stand" },
  composed: { drop: ca, travels: "stand" },
  hang: { drop: Xr, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, X5 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Ev * Math.cos(t * Math.PI / 180),
  y: 1 - n - Xr
}), Pt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Av = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), Q5 = (e, t) => (e === "sit" ? Av.has(t) : Pt.has(e)) ? e : "stand";
function e4(e, t) {
  return e.facing === t.facing || !Pt.has(e.posture) && !Pt.has(t.posture) ? t : { posture: "stand", facing: Pt.has(e.posture) ? e.facing : t.facing };
}
const t4 = 0.25, n4 = (e, t) => Pt.has(e) && en[t].drop === 0, Qr = 2, Cv = 90, Ov = 180, Tv = 140, Bv = 280, Iv = 420, Rv = 0.25, Lv = 290, Nv = 600, Dv = "cubic-bezier(0.2, 0.7, 0.4, 1)", Pv = "cubic-bezier(0.55, 0, 0.9, 0.6)", ua = 5;
function Cn(e, t, n, { straight: a = !1, hangs: s = !1, pace: o = 1, pressing: r = !1, sprinting: l = !1, random: i = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < ua) return null;
  (r || l) && (o = Math.max(o, Qr));
  const v = o > 1, b = Math.abs(t.x - e.x), x = b < ua ? 0 : b / (Cv * o) * 1e3, $ = Math.min(x, v ? Tv : Ov), O = Math.abs(t.y - e.y), q = t.y < e.y, Z = q && !p && ev(O, n, i, u, d, f), _ = q ? Iv + Math.min(O, 400) * Rv : Math.sqrt(2 * O / as) * 1e3, y = {
    x: t.x,
    y: t.y,
    ms: O > ua ? Z ? Nv : _ : 0,
    lead: Z ? Lv : q ? Bv : 0,
    easing: q ? Dv : Pv,
    hopping: !0,
    clip: Z ? "backflip" : q ? "jump" : "fall"
  }, E = { x: t.x, y: t.y, ms: x + $, lead: 0, easing: "linear", ramp: $, ...v ? { clip: "run" } : {} }, S = p ? jv(t, n) : y, T = q && !a ? [{ ...E, y: e.y }, S] : [{ ...y, x: e.x }, E];
  return { way: Math.sign(t.x - e.x) || 1, legs: T, lands: !s, pace: o, running: v };
}
const jv = (e, t) => ({ x: e.x, y: e.y, ms: xe.pogo.frames / xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), qv = (e, t) => e.postures.includes(t) ? t : e.postures[0], a4 = (e, t, n) => e.posture === "walk" && n ? "walk" : qv(e.clip, t), Ze = (e, { size: t, below: n }, a = e.posture) => {
  const s = e.y - (1 - n - en[a].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: s, bottom: s + t };
}, jn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, rs = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function kt() {
  var t;
  const e = (t = Qt()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const dn = 0.5, ho = 20;
function s4(e, t, n = kt()) {
  const a = Ze(e, t);
  return a.left >= n.left + ho && a.right <= n.right - ho;
}
function ls(e, t, n = kt()) {
  const a = Ze(e, t), s = a.right - a.left, o = qn(e), [r, l] = [a.left + o.left * s, a.left + o.right * s], i = e.posture === "hang" ? a.bottom : e.y;
  return r >= n.left - dn && l <= n.right + dn && a.top >= n.top - dn && i <= n.bottom + dn;
}
const On = [0.35, 0.5, 0.65], Tn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], _e = { left: On[0], right: On.at(-1), top: Tn[0], bottom: Tn.at(-1) }, Fv = 0.24;
function qn(e) {
  if (e.posture === "stand") return { left: _e.left, right: _e.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Fv * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(_e.left, t), right: Math.max(_e.right, t) };
}
function Wv(e, { size: t }, n = kt()) {
  const a = qn(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - a.left) * t), n.right - (a.right - 0.5) * t) };
}
const is = (_e.right - _e.left) / 2 + 0.08;
function o4(e, t) {
  return e === "hang" ? _e : { ..._e, bottom: Math.min(_e.bottom, 1 - t - en[e].drop) };
}
const Hv = "[data-figure-agent]";
function el(e, t, n = "", a = "") {
  var l;
  const s = (l = document.caretRangeFromPoint) == null ? void 0 : l.call(document, e, t);
  if (!s || s.startContainer.nodeType !== Node.TEXT_NODE || !rs(s.startContainer.parentElement) || n && s.startContainer.parentElement.closest(n) || a && !s.startContainer.parentElement.closest(a)) return !1;
  const o = s.startContainer, r = Math.min(s.startOffset, o.length - 1);
  for (const i of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[i].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, i), u.setEnd(o, i + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const tl = (e) => Tn.flatMap(
  (t) => On.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function cs(e, t, n = "") {
  if (!Gt(e, t)) return On.length * Tn.length;
  const a = Ze(e, t), s = e.posture === "hang" ? a : { ...a, bottom: Math.min(a.bottom, e.y) }, o = [...document.querySelectorAll(Sv)].map((l) => ({ control: l, rect: l.getBoundingClientRect() })).filter(({ control: l, rect: i }) => i.width && i.height && jn(s, i) && rs(l)).map(({ rect: l }) => l), r = (l, i) => o.some((u) => l >= u.left && l <= u.right && i >= u.top && i <= u.bottom);
  return tl(s).filter(([l, i]) => r(l, i) || el(l, i, n)).length;
}
function Uv(e, t) {
  const n = Ze(e, t);
  return tl({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([a, s]) => el(a, s, "", Hv)).length;
}
const mo = 4;
function r4(e, t, n) {
  const a = e.size / 2, s = Math.max(t.x - n.left, n.right - t.x);
  for (let o = mo; o <= s; o += mo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - a < n.left || r + a > n.right) continue;
      const l = { ...t, x: r };
      if (!Uv(l, e) && Gt(l, e)) return l;
    }
  return null;
}
function Kt(e, t, n) {
  const a = kt(), s = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => ls(r, t, a) && Gt(r, t)).map((r) => ({ spot: r, covered: cs(r, t), away: s(r) }));
  return o.length ? o.reduce(
    (r, l) => l.covered < r.covered || l.covered === r.covered && l.away < r.away ? l : r
  ).spot : null;
}
const nl = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), zv = [0.5, 0.25, 0.75], Vv = (e) => nl(e.getBoundingClientRect(), zv), al = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Gv = is, Kv = (e, t, { size: n }, a = Gv) => sl(e, al[t], a * n, "stand");
function sl(e, { along: t, inboard: n, face: a }, s, o) {
  return { x: e.left + e.width * t + n * s, y: e.top, face: a, posture: o };
}
const Yv = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, ol = 0.1, Zv = (e, t, { size: n }) => sl(e, Yv[t], ol * n, "sit"), Jv = (e) => ((e + 180) % 360 + 360) % 360 - 180, da = 60;
function l4(e, t) {
  const n = Jv(t);
  return !e.aside || Math.abs(n) >= da ? t : n < 0 ? 360 - da : da;
}
const jt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Xv = (e) => [.../* @__PURE__ */ new Set([e, ...jt.turns.map((t) => (t + 360) % 360)])];
function i4(e, t, n, a) {
  const s = (e == null ? void 0 : e.face) === t;
  if (s && n < e.next) return e;
  const o = Xv(t), r = jt.every[0] + a() * (jt.every[1] - jt.every[0]);
  return { face: t, from: s ? Qv(e, n) : t, to: o[Math.floor(a() * o.length)], since: n, next: n + r };
}
function Qv(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / jt.seconds)), a = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + a * n * n * (3 - 2 * n) + 360) % 360;
}
function c4(e, t) {
  const { element: n, edge: a } = Fn(), s = ["left", "right"].map((l) => tn(Zv(a, l, e), e)).filter((l) => n && ls(l, e) && !cs(l, e)), o = (l) => t ? Math.abs(l.x - t.x) : 0, r = s.sort((l, i) => o(l) - o(i))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function u4(e, t, { size: n }) {
  const a = (_e.right - _e.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + a > t.left && e.x - a < t.right ? { ...e, x: t.left - a - rl } : e;
}
const rl = 7;
function ll() {
  const e = [...document.querySelectorAll(dv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function ey(e, t) {
  const n = Ze(e, t), a = n.right - n.left;
  return { left: n.left + _e.left * a, right: n.left + _e.right * a, top: n.top + _e.top * a, bottom: n.bottom };
}
function ty(e, t) {
  const n = ll();
  return !n || !jn(ey(e, t), n);
}
const ny = 4;
function Fn() {
  const e = nn(), t = ll(), { left: n, width: a, top: s } = e.edge;
  return !t || Math.abs(t.bottom - s) > ny || t.left > n + a || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - rl - n, 0) } };
}
const d4 = ({ size: e, below: t }) => (1 - t) * e;
function tn(e, t) {
  const n = kt(), { size: a, below: s } = t, o = en[e.posture].drop * a;
  return { ...Wv(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - s) * a - o), n.bottom) };
}
const ja = (e, t) => Object.keys(al).map((n) => tn(Kv(e, n, t), t)), us = (e, t) => nl(e, $v).map((n) => tn(n, t)), il = (e, t, n) => Kt(e, t, n) ?? e[0];
function f4(e, t) {
  const { element: n, edge: a } = Fn();
  return { ...il(ja(a, e), e, t), view: null, on: n };
}
function h4(e, t, n, a) {
  const { element: s, edge: o } = Fn(), r = (a ? ja(o, t) : [...ja(o, t), ...us(o, t)]).filter(
    (u) => !jn(Ze(u, t), e)
  ), l = Kt(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), i = l && !cs(l, t) ? l : Kt(r, t, n);
  return i && { ...i, view: null, on: s };
}
function nn() {
  var a;
  const e = Qt(), t = (a = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : a.querySelector(wv);
  if (!t) return { ...Wn(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const po = { within: 2 };
function m4(e) {
  const { element: t, docked: n, edge: a } = nn();
  if (!n || e.on !== t) return !0;
  const s = Wn().edge;
  return a.left > s.left + po.within || a.left + a.width < s.left + s.width - po.within;
}
const ay = "[data-figure-closing]";
function p4() {
  var n;
  const { element: e, docked: t } = nn();
  return t && !!((n = e.firstElementChild) != null && n.matches(ay));
}
const cl = "[data-figure-progress]";
function g4(e) {
  const t = e.querySelector(cl);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function v4(e, t, n) {
  const a = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), s = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return a.length ? a.reduce((o, r) => s(r) < s(o) ? r : o) : null;
}
const sy = { across: 300, above: 380, below: 60 };
function y4(e) {
  const { across: t, above: n, below: a } = sy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((s) => ({ element: s, at: oy(s.getBoundingClientRect()) })).filter(({ at: s }) => Math.abs(s.x - e.x) <= t && s.y >= e.y - n && s.y <= e.y + a).sort((s, o) => Math.hypot(s.at.x - e.x, s.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: s }) => s);
}
const oy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), ul = "[data-figure-bar]", qa = { back: 144, along: 0.4 };
function k4(e) {
  const { element: t, docked: n, edge: a } = nn(), s = n ? t.querySelector(ul) : null;
  if (!(s != null && s.querySelector(cl))) return null;
  const o = s.getBoundingClientRect().right;
  return { ...tn({ x: o - qa.back, y: a.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function b4(e, t, n, a) {
  return { x: Math.abs(e.x - t.x) < qa.along * a.size ? t.x + qa.along * a.size : e.x, y: e.y, behind: !0 };
}
function w4(e) {
  const t = e.querySelector(ul), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const a = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: a, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function Wn() {
  const e = Qt();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function x4(e, t, { x: n = null, beside: a = 0, before: s = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: l } = Wn(), i = n === null ? ry(l, e, o === null ? t : { x: o, y: l.top }, a, s) : tn({ x: n, y: l.top, posture: "stand" }, e);
  return i && { ...i, view: null, on: r, stays: !0 };
}
function ry(e, t, n, a, s) {
  const o = us(e, t), r = Math.min(...o.map((i) => i.x)), l = o.filter((i) => i.x + a + Qe.width < s && i.x + a - at.reach - at.room >= r);
  return Kt(l.length ? l : o, t, n);
}
const ly = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function $4(e, t, n, { straight: a = !1, pace: s = 1, pressing: o = !1, sprinting: r = !1, random: l = Math.random, via: i = [], memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  (o || r) && (s = Math.max(s, Qr));
  const v = (Z) => {
    const _ = Ze(Z, n, en[Z.posture].travels);
    return { x: _.left, y: _.top };
  }, b = t.ladder ?? e.ladder;
  if (b && !(t.ladder && e.ladder)) return iy(v(e), v(t), v({ ...b.foot, posture: "stand" }), b.way, !!t.ladder, n, s);
  const [x, ...$] = [e, ...i, t].map(v), O = Cn(x, $[0], n.size, { straight: a, hangs: t.posture === "hang" || !!t.swings, pace: s, pressing: o, sprinting: r, random: l, memory: u, now: d, room: f, pogo: p }), q = $.slice(1).map((Z, _) => {
    var y;
    return (y = Cn($[_], Z, n.size, { random: l, memory: u, now: d, room: f })) == null ? void 0 : y.legs.find((E) => E.hopping);
  });
  return O && { ...O, legs: [...O.legs, ...q.filter(Boolean)] };
}
function iy(e, t, n, a, s, o, r) {
  const l = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / ly.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: a > 0 ? 90 : 270 }), i = s ? Cn(e, n, o.size, { pace: r }) : Cn(n, t, o.size, { pace: r }), u = s ? [...(i == null ? void 0 : i.legs) ?? [], l(n, t)] : [l(e, n), ...(i == null ? void 0 : i.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function M4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const a = n.getBoundingClientRect();
  return a.left + a.width / 2 > t ? 90 : 270;
}
function S4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && Kt(Vv(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: a, edge: s } = Fn();
  return { ...il(us(s, t), t, n), view: null, on: a };
}
const cy = "[data-figure-bubble]", uy = 250;
let qt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), dl = 0;
const Rt = () => qt, fa = /* @__PURE__ */ new WeakMap();
let dy = 0;
function ds(e) {
  return fa.has(e) || fa.set(e, `floor-${++dy}`), fa.get(e);
}
const fy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, hy = () => {
  var e, t;
  return ((t = (e = Qt()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function my(e, t) {
  var a;
  const n = (a = e.querySelector(xv)) == null ? void 0 : a.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function py(e, t) {
  const n = e && my(e, t), a = e ? [...e.querySelectorAll(cy)].map((o) => ({ element: o, kind: "bubble" })) : [], s = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...a, ...s].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || fy(r, n))).map(({ element: o, kind: r, box: l }) => ({ id: ds(o), kind: r, element: o, left: l.left, right: l.right, top: l.top, bottom: l.bottom }));
}
const gy = (e, t, n) => {
  const a = e.floors.find((o) => o.id === t.id), s = n - e.at;
  return a && s > 0 && s <= uy ? (t.top - a.top) / s * 1e3 : 0;
};
function fl(e = qt, t = performance.now()) {
  const n = kt(), a = hy(), s = (a == null ? void 0 : a.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: l } = nn(), i = [];
  o && i.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: l.left, right: l.left + l.width, top: l.top });
  const u = Wn();
  return u.element && i.push({ id: ds(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), i.push(...py(a, s)), i.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: s, floors: Object.freeze(i.map((d) => Object.freeze({ ...d, vy: gy(e, d, t) }))) });
}
const Fa = /* @__PURE__ */ new Set();
function vy(e) {
  return Fa.add(e), () => Fa.delete(e);
}
function yy() {
  hl();
  const e = () => {
    dl = requestAnimationFrame(e), !document.hidden && (qt = fl(qt), Fa.forEach((t) => t(qt)));
  };
  e();
}
function hl() {
  cancelAnimationFrame(dl);
}
const fs = 5, ky = 56, by = { share: 0.6 }, wy = (e) => -Math.sqrt(2 * as * by.share * e), Ct = (e, t) => e.find((n) => n.id === t) ?? null;
function _4(e, t = fl().floors) {
  const n = Ct(t, "home"), a = (n == null ? void 0 : n.kind) === "dock", s = e.on ? e.on === (n == null ? void 0 : n.element) && a && !e.stays ? "home" : ds(e.on) : null, o = s && Ct(t, s);
  return o ? { id: s, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: s === "home" } : null;
}
function ml({ id: e, dx: t, dy: n, posture: a, face: s, swings: o, home: r }, l, i = Rt().floors) {
  const u = Ct(i, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: a, face: s };
  return (r || xy(u, d, o)) && $y(d, l, i) ? { x: d.x, y: d.y } : null;
}
const hs = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, xy = (e, t, n) => !hs({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function E4(e, t = Rt().floors) {
  if (!hs(e)) return null;
  const n = t.find((a) => Math.abs(a.top - e.y) <= fs && e.x >= a.left && e.x <= a.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function $y(e, t, n = Rt().floors) {
  const a = Ct(n, "home");
  return e.posture === "hang" && a && Ze(e, t).bottom >= a.top ? !1 : ls(e, t);
}
function A4(e, t, n, a = Rt().floors) {
  const s = ml(e, n, a);
  if (!e.home) return My(e, t, s, a);
  if (!s) return null;
  const o = Ct(a, "home"), r = s.y - t.y, l = r > fs ? "dropping" : -r > ky ? "launched" : "carried";
  return { spot: { ...t, y: s.y }, footing: { ...e, dx: t.x - o.left }, motion: l };
}
function My(e, t, n, a) {
  const s = n ? Ct(a, e.id).vy : 0, o = !!n && s <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: wy(e.risen) };
  if (!n) return null;
  if (hs(t) && n.y - t.y > fs) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || s <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function C4(e, t, n) {
  const a = is * n.size, s = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !s || s.right - s.left < 2 * a ? e : { ...e, x: Math.min(Math.max(e.x, s.left + a), s.right - a) };
}
function O4(e, t, n, a = Rt().floors) {
  const s = t && ml(t, n, a);
  return s ? { ...e, ...s } : e;
}
const Sy = ["data-kind"], _y = { class: "figure-floor-name" }, Ey = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", _y, k(e.floor.kind), 1)
    ], 12, Sy));
  }
}, Ay = /* @__PURE__ */ Y(Ey, [["__scopeId", "data-v-8f6132da"]]), Cy = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Oy = {
  __name: "FigureFloors",
  setup(e) {
    const t = et(Rt().floors);
    let n = () => {
    };
    return Te(() => {
      n = vy((a) => t.value = a.floors), yy();
    }), Ae(() => {
      n(), hl();
    }), (a, s) => (c(), h("div", Cy, [
      (c(!0), h(G, null, te(t.value, (o) => (c(), V(Ay, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, T4 = /* @__PURE__ */ Y(Oy, [["__scopeId", "data-v-e519168b"]]), ha = (e) => typeof e == "number" ? e : Date.parse(e);
function B4(e, t) {
  const n = (s, o) => ({ kind: s, id: `${s}:${o.id}`, row: o, time: ha(o.created_at) / 1e3 });
  return [...e.map((s) => n("message", s)), ...t.map((s) => n("mark", s))].sort((s, o) => ha(s.row.created_at) - ha(o.row.created_at) || (s.kind === o.kind ? s.row.id - o.row.id : s.kind === "message" ? -1 : 1));
}
const Ty = 3, ma = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function By(e, t) {
  var a;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((a = ma[n.grouping]) == null ? void 0 : a.call(ma, e.row, n)) || "";
}
function Iy(e, t) {
  const n = t(e[0].row.type), a = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((s) => s.row), declaration: n, label: a };
}
function I4(e, t) {
  const n = [];
  let a = [], s = "";
  const o = () => {
    n.push(...a.length >= Ty ? [Iy(a, t)] : a), a = [];
  };
  for (const r of e) {
    const l = By(r, t);
    l !== s && o(), s = l, l ? a.push(r) : n.push(r);
  }
  return o(), n;
}
const Ry = 1e3;
function Ly() {
  const e = B(Date.now()), t = setInterval(() => e.value = Date.now(), Ry);
  return Tt(() => clearInterval(t)), e;
}
const Ny = ["datetime", "title"], Hn = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Ly(), a = I(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (s, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? a.value.toISOString() : e.at,
      title: e.at ? a.value.toLocaleString() : "",
      "data-time-ago": ""
    }, k(H(Xh)(e.at, H(n))), 9, Ny));
  }
};
function R4(e) {
  const t = vt(), n = t.option("row"), a = B(null);
  async function s() {
    const o = await t.read(`${e} show ${n.value.target_id}`);
    a.value = o.ok ? o.value : null;
  }
  return t.follow([`${e}.*`], s), me(() => {
    var o;
    return (o = n.value) == null ? void 0 : o.target_id;
  }, s, { immediate: !0 }), a;
}
function Dy(e, t, n = []) {
  return (n.length ? n.map((s) => e[s]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const L4 = (e) => (t) => t.filter((n) => n.id !== e), N4 = (e, t) => (n) => n.map((a) => a.id === e ? { ...a, ...t } : a), D4 = (e) => (t) => [...t, e], P4 = (e, t) => (n) => n.map((a) => e(a) ? { ...a, ...t } : a);
function j4(e) {
  const t = vt(), n = B(null), a = B("");
  async function s(...o) {
    const r = await t.read(e(...o));
    a.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: a, load: s };
}
function q4(e) {
  const t = vt(), n = B("");
  async function a(s) {
    const o = await t.run(s);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: a };
}
const fn = /* @__PURE__ */ new Map();
function Py(e, t) {
  if (fn.has(e)) return fn.get(e);
  const n = t().finally(() => fn.delete(e));
  return fn.set(e, n), n;
}
function F4() {
  const e = vt(), t = B(null), n = B("");
  async function a() {
    const s = await Py(e.environment, () => e.read("usage show"));
    n.value = s.ok ? "" : s.error, s.ok && (t.value = s.value);
  }
  return { value: t, failure: n, load: a };
}
const jy = { class: "cards-page" }, qy = { class: "cards-bar" }, Fy = { class: "cards-count" }, Wy = { class: "cards" }, Hy = {
  key: 1,
  class: "cards-note"
}, Uy = {
  key: 2,
  class: "cards-note"
}, zy = ["data-row", "onClick"], Vy = { class: "card-head" }, Gy = { class: "card-title" }, Ky = { class: "card-foot" }, Yy = {
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
    return (a, s) => (c(), h("div", jy, [
      g("div", qy, [
        g("span", Fy, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        R(de, Ge({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: s[0] || (s[0] = (o) => n("new"))
        }), {
          default: D(() => [
            R(pe, {
              name: "plus",
              size: 12
            }),
            se(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Wy, [
        e.loaded ? e.failure ? (c(), h("p", Hy, k(e.failure), 1)) : e.rows.length ? C("", !0) : (c(), h("p", Uy, "No " + k(e.noun) + "s yet", 1)) : (c(), V(gt, {
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
          g("span", Vy, [
            R(pe, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            se(" " + k(e.head(o)), 1),
            R(Hn, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", Gy, k(e.title(o)), 1),
          g("span", Ky, k(e.foot(o)), 1)
        ], 8, zy))), 128))
      ]),
      ce(a.$slots, "default", {}, void 0, !0)
    ]));
  }
}, W4 = /* @__PURE__ */ Y(Yy, [["__scopeId", "data-v-990e6b37"]]), go = "newest";
function H4(e, { title: t, isOpen: n = null }) {
  var u;
  const a = (u = $e(Se, null)) == null ? void 0 : u.search, s = B(""), o = B(go), r = B("all"), l = I(() => {
    const d = s.value.trim().toLowerCase(), f = e.value.filter((p) => Dy(p, d, a == null ? void 0 : a.fields) && (r.value === "all" || !n || n(p) === (r.value === "open")));
    return o.value === go ? f : [...f].sort((p, v) => t(p).localeCompare(t(v)));
  }), i = I(() => !!s.value.trim() || !!n && r.value !== "all");
  return { words: s, order: o, state: r, shown: l, filtering: i, hasStates: !!n };
}
const Zy = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Jy = 40, Xy = "top", Qy = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, a = (f = $e(Se, null)) == null ? void 0 : f.autoScroll, s = I(() => a === Xy), o = B(null), r = B(!1), l = (p) => s.value ? p.scrollTop : p.scrollHeight - p.scrollTop - p.clientHeight, i = () => s.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: i(), behavior: "smooth" });
    function d() {
      r.value = l(o.value) >= Jy;
    }
    return me(() => n.rowCount, async () => {
      await st(), !r.value && o.value && (o.value.scrollTop = i());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (p, v) => (c(), h("div", Zy, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: J(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        ce(p.$slots, "default", {}, void 0, !0)
      ], 34),
      R(Ot, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: D(() => [
          Ke(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            R(pe, {
              name: s.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = se(" Newest ", -1))
          ], 512), [
            [Mo, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, U4 = /* @__PURE__ */ Y(Qy, [["__scopeId", "data-v-3accb764"]]), ek = ["aria-selected", "data-tab", "onClick"], tk = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, nk = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var f;
    const n = e, a = t, s = ((f = $e(Se, null)) == null ? void 0 : f.tabs) ?? [], o = B(null), r = B({ left: 0, width: 0, slides: !1 }), l = (p) => n.answer[p.count_field] !== void 0;
    function i(p) {
      var b;
      const v = (b = o.value) == null ? void 0 : b.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: p }, o.value.scrollWidth > o.value.clientWidth && (o.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const u = () => st(() => i(!0));
    let d = null;
    return Te(() => {
      var p;
      i(!1), d = new ResizeObserver(() => i(!1)), d.observe(o.value), (p = document.fonts) == null || p.ready.then(() => i(!1));
    }), Ae(() => d == null ? void 0 : d.disconnect()), me(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, u), me(() => n.answer, u, { deep: !0 }), (p, v) => (c(), h("div", {
      ref_key: "band",
      ref: o,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(G, null, te(H(s), (b) => {
        var x, $;
        return c(), h("button", {
          key: b.key,
          type: "button",
          role: "tab",
          class: J(["inner-tab", { on: ((x = e.active) == null ? void 0 : x.key) === b.key }]),
          "aria-selected": (($ = e.active) == null ? void 0 : $.key) === b.key,
          "data-tab": b.key,
          onClick: (O) => a("choose", b)
        }, [
          se(k(b.label) + " ", 1),
          l(b) ? (c(), h("span", tk, k(e.answer[b.count_field]), 1)) : C("", !0)
        ], 10, ek);
      }), 128)),
      g("i", {
        class: J(["inner-tabs-line", { slides: r.value.slides }]),
        style: fe({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, z4 = /* @__PURE__ */ Y(nk, [["__scopeId", "data-v-46fc6186"]]), ak = {
  class: "tab-body",
  "data-tab-body": ""
}, sk = { "data-tab-content": "" }, ok = {
  __name: "TabBody",
  props: { tab: { type: Object, default: null }, shape: { type: String, default: "rows" } },
  setup(e) {
    const t = e, n = B(!1);
    let a = 0;
    return me(() => {
      var s;
      return (s = t.tab) == null ? void 0 : s.key;
    }, () => {
      const s = ++a;
      n.value = !0, Ka(performance.now(), () => {
        s === a && (n.value = !1);
      });
    }), (s, o) => (c(), h("div", ak, [
      n.value ? (c(), V(gt, {
        key: 0,
        shape: e.shape,
        "data-tab-skeleton": ""
      }, null, 8, ["shape"])) : C("", !0),
      Ke(g("div", sk, [
        ce(s.$slots, "default", {}, void 0, !0)
      ], 512), [
        [Mo, !n.value]
      ])
    ]));
  }
}, V4 = /* @__PURE__ */ Y(ok, [["__scopeId", "data-v-63876533"]]), rk = {}, lk = { class: "menu-label" };
function ik(e, t) {
  return c(), h("span", lk, [
    ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Wa = /* @__PURE__ */ Y(rk, [["render", ik], ["__scopeId", "data-v-aa955b3e"]]), ck = {
  class: "search-bar",
  "data-search-bar": ""
}, uk = { class: "search-bar-control" }, dk = ["value", "placeholder", "aria-label"], fk = ["aria-expanded"], hk = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var O;
    const a = e, s = n, o = Tl(), r = ((O = $e(Se, null)) == null ? void 0 : O.search) ?? {}, l = I(() => r.placeholder || a.placeholder), i = r.context ?? [], u = B(null), d = B(null), f = B([]), p = I(() => f.value.length ? f.value[f.value.length - 1].next : i), v = I(() => !!o.menu || i.length > 0), b = (q) => {
      f.value = [], d.value = d.value ? null : q.currentTarget;
    };
    function x(q) {
      if (q.next.length) {
        f.value = [...f.value, q];
        return;
      }
      d.value = null, s("pick", q.click);
    }
    function $() {
      var q;
      s("update:modelValue", ""), (q = u.value) == null || q.focus();
    }
    return t({ focus: () => {
      var q;
      return (q = u.value) == null ? void 0 : q.focus();
    } }), (q, Z) => {
      var _;
      return c(), h("div", ck, [
        g("div", uk, [
          R(pe, {
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
            onInput: Z[0] || (Z[0] = (y) => s("update:modelValue", y.target.value)),
            onKeydown: Ft($, ["esc"])
          }, null, 40, dk),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: $
          }, [
            R(pe, {
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
            onClick: b
          }, [
            R(pe, {
              name: "caret",
              size: 12
            })
          ], 8, fk)) : C("", !0)
        ]),
        (_ = H(r).button) != null && _.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Z[1] || (Z[1] = (y) => s("pick", H(r).button.click))
        }, k(H(r).button.title), 1)) : C("", !0),
        ce(q.$slots, "default", {}, void 0, !0),
        d.value ? (c(), V(Rn, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Z[3] || (Z[3] = ke(() => {
          }, ["stop"])),
          onClose: Z[4] || (Z[4] = (y) => d.value = null)
        }, {
          default: D(() => [
            f.value.length ? (c(), V(ht, {
              key: 0,
              "data-search-back": "",
              onClick: Z[2] || (Z[2] = (y) => f.value = f.value.slice(0, -1))
            }, {
              default: D(() => [
                se("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : C("", !0),
            (c(!0), h(G, null, te(p.value, (y) => (c(), V(ht, {
              key: y.title,
              description: y.subtext,
              "data-search-entry": y.title,
              onClick: (E) => x(y)
            }, {
              default: D(() => [
                se(k(y.title) + k(y.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? C("", !0) : ce(q.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : C("", !0)
      ]);
    };
  }
}, mk = /* @__PURE__ */ Y(hk, [["__scopeId", "data-v-43c4837e"]]), pk = {
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
    return (o, r) => (c(), V(mk, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (l) => e.tools.words.value = l),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (l) => n("pick", l))
    }, {
      menu: D(() => [
        R(Wa, null, {
          default: D(() => [...r[2] || (r[2] = [
            se("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(G, null, te(a, (l) => R(ht, {
          key: l.key,
          checked: e.tools.order.value === l.key,
          "data-list-order": l.key,
          onClick: (i) => e.tools.order.value = l.key
        }, {
          default: D(() => [
            se(k(l.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(G, { key: 0 }, [
          R(Wa, null, {
            default: D(() => [...r[3] || (r[3] = [
              se("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(G, null, te(s, (l) => R(ht, {
            key: l.key,
            checked: e.tools.state.value === l.key,
            "data-list-state": l.key,
            onClick: (i) => e.tools.state.value = l.key
          }, {
            default: D(() => [
              se(k(l.label), 1)
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
}, G4 = /* @__PURE__ */ Y(pk, [["__scopeId", "data-v-dab0064d"]]);
function K4() {
  const e = B(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Y4 = (e) => import(
  /* @vite-ignore */
  e
), gk = 86400, Ha = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function vk(e, t) {
  const n = new Date(e * 1e3), a = n.getFullYear() === new Date(t * 1e3).getFullYear(), s = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...a ? {} : { year: "numeric" } }), o = Math.round((Ha(t) - Ha(e)) / gk);
  return o === 0 ? `Today, ${s}` : o === 1 ? `Yesterday, ${s}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${s}`;
}
function Z4(e, t = Date.now() / 1e3) {
  const n = [];
  let a = 0;
  for (const s of e) {
    const o = Ha(s.time);
    o !== a && (a = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: s.time, title: vk(s.time, t), text: "", data: {} })), n.push(s);
  }
  return n;
}
const pa = 280, ga = 240, va = 120, yk = 6, kk = 14, Yt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function bk(e) {
  var a;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((a = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : a[1]) || 0;
}
function pl(e, t) {
  const n = Math.max(0, bk(t)), a = e.scrollHeight;
  if (!n) return a - e.clientHeight;
  const s = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (s >= a - 1 ? Math.min(a, s - n + o) : a) - e.clientHeight;
}
function wk(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${kk}px)` }), e.offsetHeight, e.style.transition = `height ${pa}ms ${Yt}`, e.style.height = `${r}px`;
  const l = s();
  let i = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = pl(t, e));
    const p = s() - l;
    if (!i && p >= pa && (i = !0, e.style.transition = `opacity ${ga}ms ease-out, transform ${ga}ms ${Yt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < pa + ga) return a(f);
    d();
  };
  return a(f), d;
}
function J4(e, { pane: t, follows: n, frame: a = requestAnimationFrame, clock: s = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${yk}px)` }), e.offsetHeight, e.style.transition = `opacity ${va}ms ease-out, transform ${va}ms ${Yt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = s(), l = () => {
    if (n() && (t.scrollTop = pl(t, e)), s() - r < va) return a(l);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  a(l);
}
const xk = 140, hn = 220, vo = 5;
function X4({ gap: e = xk, later: t = setTimeout } = {}) {
  const n = [], a = /* @__PURE__ */ new Set();
  let s = !1, o = 0, r = !1;
  function l(d, f) {
    a.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      a.delete(d), d.done(), f();
    });
  }
  function i() {
    const d = n.splice(0, vo);
    if (s = d.length > 0, !s) return;
    let f = d.length;
    for (const p of d)
      p.el.style.display = p.display, l(p, () => {
        f -= 1, f || (o = t(i, e));
      });
  }
  const u = (d, f, p, v = wk) => {
    if (r || !f.pane || !f.follows()) return p();
    const b = { el: d, options: f, done: p, arrival: v, display: d.style.display || "" };
    if (!s)
      return s = !0, l(b, () => o = t(i, e));
    d.style.display = "none", n.push(b), n.length >= vo && u.flush();
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
function Q4(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${hn}ms ${Yt}, opacity ${hn}ms ease-in, margin ${hn}ms ${Yt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, hn);
}
const gl = "chat.pins.minimised", kn = B(wn(gl, !1));
function yo(e) {
  kn.value = e, Ja(gl, e);
}
function $k(e) {
  const t = I(() => e()), n = I(() => kn.value ? [] : e()), a = () => yo(!kn.value), s = Date.now() / 1e3;
  return me(
    () => t.value.filter((o) => mt(o) > s).length,
    (o, r) => o > r && yo(!1)
  ), { pins: t, visible: n, minimised: kn, toggle: a };
}
const Mk = ["title"], Sk = {
  key: 0,
  class: "pins-count"
}, _k = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: a, toggle: s } = $k(() => t.pinRows);
    return (o, r) => H(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: J(["pins-toggle", { minimised: H(a), inline: e.inline }]),
      title: H(a) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = ke((...l) => H(s) && H(s)(...l), ["stop"]))
    }, [
      R(pe, {
        name: H(a) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      H(a) ? (c(), h("span", Sk, k(H(n).length), 1)) : C("", !0)
    ], 10, Mk)) : C("", !0);
  }
}, ex = /* @__PURE__ */ Y(_k, [["__scopeId", "data-v-d073c504"]]), Ek = ["title"], Ak = ["title"], Ck = { class: "diff-card-dir" }, Ok = { class: "diff-card-name" }, Tk = ["title"], Bk = ["title"], Ik = {
  key: 0,
  class: "diff-card-note"
}, Rk = ["href"], Lk = ["src", "alt"], Nk = { class: "diff-card-rows" }, Dk = { class: "diff-row-num" }, Pk = { class: "diff-row-sign" }, jk = { class: "diff-row-code" }, qk = {
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
    function o(A) {
      (A.metaKey || A.ctrlKey) && (A.stopPropagation(), a("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, l = { add: "+", del: "−" }, i = I(() => n.path.lastIndexOf("/") + 1), u = I(() => n.path.slice(0, i.value)), d = I(() => n.path.slice(i.value)), f = I(() => n.kind === "deleted"), p = I(() => r[n.kind]), v = I(() => new Set(n.rows.filter((A) => A.line_type === "add").map((A) => A.line))), b = B("after"), x = I(() => b.value === "before" ? n.whole.old : n.whole.text), $ = I(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((A, M) => ({ line_type: b.value === "after" && v.value.has(M + 1) ? "add" : "ctx", line: M + 1, text: A })) : n.rows.filter(
      (A) => !(n.editsOnly && ["ctx", "fold"].includes(A.line_type)) && !(n.hideRemovals && A.line_type === "del")
    )), O = B(!1), q = I(() => n.lines && !O.value && !n.whole), Z = I(() => q.value ? $.value.slice(0, n.lines) : $.value), _ = I(() => $.value.length - Z.value.length), y = (A) => A.line === null || A.line_type === "del" ? "" : A.line, E = (A) => A.line_type === "fold" ? A.hidden ? `⋯ ${A.hidden} lines` : "⋯" : A.text, S = B(null), T = B(null);
    let w = null;
    return Te(() => {
      if (!T.value) return;
      let A = !0;
      w = new ResizeObserver(() => {
        !S.value || !T.value || (S.value.style.transition = A ? "none" : "", S.value.style.height = `${T.value.offsetHeight}px`, A = !1);
      }), w.observe(T.value);
    }), Ae(() => w && w.disconnect()), (A, M) => (c(), h("section", {
      class: J(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: M[2] || (M[2] = (m) => !f.value && a("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${H(s)}-click to open it`,
          onClick: o
        }, [
          g("span", Ck, k(u.value), 1),
          g("span", Ok, k(d.value), 1),
          p.value ? (c(), h("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, k(p.value), 3)) : C("", !0)
        ], 8, Ak),
        g("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        g("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        R(Hn, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: b.value === "after" ? "Show the file before" : "Show the file after",
          onClick: M[0] || (M[0] = ke((m) => b.value = b.value === "after" ? "before" : "after", ["stop"]))
        }, k(b.value === "after" ? "After" : "Before"), 9, Tk)) : C("", !0),
        f.value ? C("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: J(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: M[1] || (M[1] = ke((m) => a("whole"), ["stop"]))
        }, [
          R(pe, {
            name: "file",
            size: 12
          })
        ], 10, Bk))
      ], 8, Ek),
      e.whole && e.whole.error ? (c(), h("p", Ik, k(e.whole.error), 1)) : C("", !0),
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
          }, null, 8, Lk)
        ], 8, Rk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: S,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: T,
            class: "diff-card-diff"
          }, [
            g("div", Nk, [
              (c(!0), h(G, null, te(Z.value, (m, L) => (c(), h("div", {
                key: L,
                class: J(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                g("span", Dk, k(y(m)), 1),
                g("span", Pk, k(l[m.line_type]), 1),
                g("span", jk, k(E(m)), 1)
              ], 2))), 128)),
              _.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: M[3] || (M[3] = ke((m) => O.value = !0, ["stop"]))
              }, k(_.value) + " more " + k(_.value === 1 ? "line" : "lines"), 1)) : C("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : C("", !0)
    ], 2));
  }
}, tx = /* @__PURE__ */ Y(qk, [["__scopeId", "data-v-fed58c18"]]), Fk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (a, s) => (c(), V(de, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: s[0] || (s[0] = (o) => n("back"))
    }, {
      default: D(() => [
        R(pe, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Wk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Hk = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Uk = { class: "ask-text" }, zk = ["placeholder", "aria-label"], Vk = ["placeholder", "aria-label"], Gk = {
  key: 3,
  class: "moves"
}, Kk = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = I(() => mg(a.kind, a.row)), r = B(""), l = B(null), i = B(""), u = B("");
    me(() => a.id, () => {
      r.value = "", l.value = null;
    });
    async function d(v, b = "") {
      const x = await a.read([v.noun ?? a.kind, v.word, String(a.id), ...v.flag ? [v.flag, b] : v.positional ? [b] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = x.ok ? "" : x.error, x.ok && (l.value = null, i.value = "", u.value = "", s("done"));
    }
    const f = (v) => v.confirm ? l.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (l.value = v, i.value = "") : d(v), p = () => i.value.trim() && d(l.value, i.value.trim());
    return t({ moves: o, press: f }), (v, b) => {
      var x;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: J(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", Wk, k(r.value), 1)) : C("", !0),
        (x = l.value) != null && x.confirm ? (c(), h("div", Hk, [
          g("span", Uk, k(l.value.confirm), 1),
          R(de, {
            small: "",
            kind: l.value.danger ? "ghost" : "primary",
            bordered: l.value.danger,
            class: J({ danger: l.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: b[0] || (b[0] = ($) => d(l.value))
          }, {
            default: D(() => [
              se(k(l.value.label), 1)
            ]),
            _: 1
          }, 8, ["kind", "bordered", "class"]),
          R(de, {
            small: "",
            kind: "ghost",
            onClick: b[1] || (b[1] = ($) => l.value = null)
          }, {
            default: D(() => [...b[7] || (b[7] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ])) : l.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: ke(p, ["prevent"])
        }, [
          Ke(g("input", {
            "onUpdate:modelValue": b[2] || (b[2] = ($) => i.value = $),
            class: "ask-input",
            placeholder: l.value.ask,
            "aria-label": l.value.ask,
            onKeydown: b[3] || (b[3] = Ft(ke(($) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, zk), [
            [wa, i.value]
          ]),
          l.value.opener ? Ke((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": b[4] || (b[4] = ($) => u.value = $),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: l.value.opener,
            "aria-label": l.value.opener,
            onKeydown: b[5] || (b[5] = Ft(ke(($) => l.value = null, ["stop"]), ["esc"]))
          }, null, 40, Vk)), [
            [wa, u.value]
          ]) : C("", !0),
          R(de, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !i.value.trim()
          }, {
            default: D(() => [
              se(k(l.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          R(de, {
            small: "",
            kind: "ghost",
            onClick: b[6] || (b[6] = ($) => l.value = null)
          }, {
            default: D(() => [...b[8] || (b[8] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Gk, [
          (c(!0), h(G, null, te(o.value, ($) => (c(), V(de, {
            key: $.word,
            small: !$.bordered,
            bordered: $.bordered,
            icon: $.icon,
            kind: $.main ? "primary" : "ghost",
            class: J({ danger: $.danger }),
            "data-move": $.word,
            onClick: (O) => f($)
          }, {
            default: D(() => [
              se(k($.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : C("", !0);
    };
  }
}, Yk = /* @__PURE__ */ Y(Kk, [["__scopeId", "data-v-74d3b5e8"]]), Zk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Jk = (e) => Zk.has(e), Bn = (e) => Jk(e) ? "done" : e, Xk = { class: "facts" }, Qk = { class: "fact wide" }, eb = { class: "fact-value" }, tb = {
  key: 0,
  class: "fact"
}, nb = { class: "fact-value" }, ab = { class: "fact" }, sb = { class: "fact-label" }, ob = ["title"], rb = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, lb = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, ib = {
  key: 2,
  class: "fact"
}, cb = { class: "fact-value" }, ub = { class: "fact wide" }, db = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, fb = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = _n.map(({ key: o, label: r }) => ({ key: String(o), label: r })), a = t, s = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var l, i;
      return c(), h("div", Xk, [
        g("div", Qk, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", eb, k((l = e.place) != null && l.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", tb, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", nb, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : C("", !0),
        e.task.helper_id ? (c(), h(G, { key: 1 }, [
          g("div", ab, [
            g("span", sb, k(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => H(Ne)(`agents:${e.task.helper_id}`))
            }, k(e.task.helper_name), 9, ob)
          ]),
          H(s).has(e.task.state) ? (c(), h("p", rb, k(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", lb, k(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : C("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", ib, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", cb, "Agent " + k(e.task.holder_id), 1)
        ])) : C("", !0),
        g("div", ub, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          R(Ln, {
            options: H(n),
            value: String(H($r)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => a("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", db, k(e.refusal), 1)) : C("", !0)
        ])
      ]);
    };
  }
}, hb = /* @__PURE__ */ Y(fb, [["__scopeId", "data-v-2bcdca7a"]]), mb = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, pb = { ...mb, done: "Completed" }, gb = { class: "task-status-icon" }, vb = ["width", "height", "aria-label"], yb = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    const t = e, n = I(() => Do("task", Bn(t.status))), a = I(() => n.value === "testing" ? "started" : n.value), s = I(() => pb[t.status] ?? No("task", t.status));
    return (o, r) => (c(), h("span", gb, [
      R(Ot, {
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
            R(Bt, { value: a.value }, {
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
          ], 10, vb))
        ]),
        _: 1
      })
    ]));
  }
}, vl = /* @__PURE__ */ Y(yb, [["__scopeId", "data-v-ae24a63f"]]), kb = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, bb = ["onClick"], wb = { class: "wait-id" }, xb = { class: "wait-title" }, $b = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Mb = { class: "text" }, Sb = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, _b = 180, Eb = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, a = B(!1);
    return (s, o) => (c(), h(G, null, [
      e.task.waits.length ? (c(), h("section", kb, [
        o[1] || (o[1] = g("h4", null, "Waits on", -1)),
        (c(!0), h(G, null, te(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (l) => n("select", r.id)
        }, [
          R(vl, {
            status: H(Bn)(r.state),
            size: 12
          }, null, 8, ["status"]),
          g("span", wb, k(r.id), 1),
          g("span", xb, k(r.title), 1)
        ], 8, bb))), 128))
      ])) : C("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", $b, [
        o[2] || (o[2] = g("h4", null, "How it was done", -1)),
        g("p", Mb, k(e.task.outcome), 1)
      ])) : C("", !0),
      e.task.brief ? (c(), h("section", Sb, [
        o[3] || (o[3] = g("h4", null, "The brief", -1)),
        g("p", {
          class: J(["text", { clamped: !a.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > _b && !a.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => a.value = !0)
        }, "Show the whole brief")) : C("", !0)
      ])) : C("", !0)
    ], 64));
  }
}, Ab = /* @__PURE__ */ Y(Eb, [["__scopeId", "data-v-8e4d95ae"]]), Cb = {
  class: "task-details",
  "data-task-details": ""
}, Ob = { class: "since" }, Tb = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Bb = { class: "text" }, Ib = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Rb = {
  key: 1,
  class: "note"
}, Lb = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Nb = { class: "text" }, Db = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, a = (s) => s.slice(0, 1).toUpperCase() + s.slice(1);
    return (s, o) => {
      var r;
      return c(), h("div", Cb, [
        g("div", {
          class: J(["state-line", H(Bn)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (l) => n("status", l.currentTarget))
          }, [
            R(vl, {
              status: H(Bn)(e.task.state)
            }, null, 8, ["status"]),
            se(" " + k(a(e.task.state)), 1)
          ]),
          g("span", Ob, [
            o[3] || (o[3] = se(" since ", -1)),
            R(Hn, {
              at: H(hr)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", Tb, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", Bb, k(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", Ib, "Opens by itself when " + k(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Rb, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Lb, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", Nb, k(e.task.reason), 1)
        ])) : C("", !0),
        R(hb, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (l) => n("priority", l))
        }, null, 8, ["task", "place", "refusal"]),
        R(Ab, {
          task: e.task,
          onSelect: o[2] || (o[2] = (l) => n("select", l))
        }, null, 8, ["task"])
      ]);
    };
  }
}, Pb = /* @__PURE__ */ Y(Db, [["__scopeId", "data-v-2863d987"]]), jb = 50, qb = { messages: 25 }, Fb = (e) => qb[e] || jb, Wb = {
  class: "task-log",
  "aria-label": "Task log"
}, Hb = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, Ub = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, zb = { class: "entries" }, Vb = ["datetime"], Gb = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, Kb = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = B([]), a = B(1), s = B(!0), o = B(!0), r = B("");
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
        String(Fb("task_logs")),
        "--page",
        String(u)
      ]);
      d === l && (o.value = !1, r.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, s.value = f.value.is_last_page));
    }
    return me(
      () => [t.id, t.changes],
      () => {
        n.value = [], i();
      },
      { immediate: !0 }
    ), Tt(() => {
      l += 1;
    }), (u, d) => (c(), h("section", Wb, [
      o.value ? (c(), V(gt, { key: 0 })) : r.value ? (c(), h(G, { key: 1 }, [
        g("p", Hb, k(r.value), 1),
        R(de, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => i(a.value))
        }, {
          default: D(() => [...d[3] || (d[3] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(G, { key: 2 }, [
        n.value.length ? C("", !0) : (c(), h("p", Ub, "No log entries yet.")),
        g("ol", zb, [
          (c(!0), h(G, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, k(new Date(f.created_at).toLocaleString()), 9, Vb),
            g("p", null, k(f.line), 1)
          ]))), 128))
        ]),
        a.value > 1 || !s.value ? (c(), h("nav", Gb, [
          R(de, {
            small: "",
            bordered: "",
            disabled: a.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => i(a.value - 1))
          }, {
            default: D(() => [...d[4] || (d[4] = [
              se("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + k(a.value), 1),
          R(de, {
            small: "",
            bordered: "",
            disabled: s.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => i(a.value + 1))
          }, {
            default: D(() => [...d[5] || (d[5] = [
              se("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : C("", !0)
      ], 64))
    ]));
  }
}, Yb = /* @__PURE__ */ Y(Kb, [["__scopeId", "data-v-953605e5"]]), Zb = { class: "comment-side-head" }, Jb = {
  key: 0,
  class: "comment-none"
}, Xb = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", Zb, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        R(Nn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (a) => t.$emit("close"))
        })
      ]),
      e.comments.length ? C("", !0) : (c(), h("p", Jb, "No comments yet")),
      (c(!0), h(G, null, te(e.comments, (a) => (c(), h("p", {
        key: a.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(a)), 1))), 128))
    ], 2));
  }
}, Qb = /* @__PURE__ */ Y(Xb, [["__scopeId", "data-v-19fdbdd4"]]);
var bo;
/Mac|iPhone|iPad/.test(((bo = navigator.userAgentData) == null ? void 0 : bo.platform) || navigator.platform);
function e2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const t2 = ["placeholder"], n2 = { class: "actions" }, a2 = { class: "error" }, s2 = {
  key: 1,
  class: "card closed"
}, o2 = { class: "mark" }, r2 = { class: "prompt" }, l2 = {
  key: 0,
  class: "draft"
}, i2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ ba({
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
  emits: /* @__PURE__ */ ba(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const a = e, s = n, o = ka(e, "draft"), r = ka(e, "error"), l = B(!!r.value), i = B(!1), u = B(!1), d = B(null);
    async function f() {
      var b, x;
      l.value = !0, i.value = !1, await st(), (x = ((b = d.value) == null ? void 0 : b.querySelector("input")) || d.value) == null || x.focus();
    }
    function p() {
      l.value = !1, r.value = "";
    }
    async function v() {
      const b = o.value.trim();
      if (!(!b || !a.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await a.send(b), l.value = !1, i.value = !0;
        } catch (x) {
          o.value = b, r.value = x.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (b, x) => (c(), h("div", {
      class: J(["comment-bar", { open: l.value }])
    }, [
      l.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: ke(v, ["prevent"]),
        onKeydown: Ft(p, ["esc"])
      }, [
        ce(b.$slots, "who", {}, void 0, !0),
        Ke(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": x[0] || (x[0] = ($) => o.value = $),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = Ft(($) => H(e2)($, v), ["enter"]))
        }, null, 40, t2), [
          [wa, o.value]
        ]),
        g("div", n2, [
          g("span", a2, k(r.value), 1),
          R(de, {
            small: "",
            onClick: p
          }, {
            default: D(() => [...x[3] || (x[3] = [
              se("Cancel", -1)
            ])]),
            _: 1
          }),
          R(de, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: D(() => [...x[4] || (x[4] = [
              se("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", s2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", o2, [
            R(pe, {
              name: i.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", r2, k(i.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", l2, "Draft kept")) : C("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = ($) => s("show"))
        }, [
          g("span", null, k(H(ri)(e.count, "comment")), 1),
          R(pe, {
            name: "down",
            size: 12
          })
        ])) : C("", !0)
      ]))
    ], 2));
  }
}, c2 = /* @__PURE__ */ Y(i2, [["__scopeId", "data-v-81f478d2"]]);
function u2(e, t) {
  const n = B([]), a = B(!1);
  let s = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: p } = e(), v = `On ${d} ${f}, ${p}: `;
    return u.text.startsWith(v) ? u.text.slice(v.length) : u.text;
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
    const v = await t([d, "comment", String(f), u]);
    if (!v.ok)
      throw n.value = n.value.filter((b) => b !== p && b.id !== p.id), new Error(v.error);
    await l();
  }
  return me(() => e().id, () => {
    a.value = !1, n.value = [], l();
  }, { immediate: !0 }), { comments: n, open: a, words: r, send: i, load: l };
}
const d2 = { class: "top" }, f2 = {
  class: "crumb",
  "data-task-crumb": ""
}, h2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, m2 = {
  key: 1,
  class: "body"
}, p2 = { class: "summary" }, g2 = { class: "stamp" }, v2 = {
  class: "title",
  "data-resource-title": ""
}, y2 = {
  class: "tabs",
  "data-task-tabs": ""
}, k2 = { class: "panels" }, b2 = {
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
    const a = e, s = n, o = B(null), r = B(null), l = B(""), i = B(""), u = B(null), d = B(null), f = B("details"), p = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = u2(
      () => o.value ? { kind: "task", id: a.id, title: o.value.title } : {},
      (_) => a.read(_)
    );
    let b = 0;
    const x = I(() => {
      var _;
      return (_ = r.value) != null && _.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function $() {
      const _ = ++b, [y, E] = await Promise.all([
        a.read(["task", "inspect", String(a.id)]),
        a.read(["plan", "place", String(a.id)])
      ]);
      _ === b && (l.value = y.ok ? "" : y.error, o.value = y.ok ? y.value : null, r.value = E.ok ? E.value : null);
    }
    me(
      () => a.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", $();
      },
      { immediate: !0 }
    ), me(() => a.changes, $), me(v.open, (_) => {
      _ && (f.value = "comments");
    });
    async function O(_) {
      const y = o.value.priority;
      o.value.priority = Number(_);
      const E = await a.read(["task", "edit", String(a.id), "--priority", _]);
      if (i.value = E.ok ? "" : E.error, E.ok) return $();
      o.value.priority = y;
    }
    function q(_) {
      u.value = null, d.value.press(_);
    }
    const Z = (_) => {
      var y;
      return ((y = d.value) == null ? void 0 : y.moves.length) && (u.value = _);
    };
    return t({ openStatus: Z }), (_, y) => (c(), h("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", d2, [
        e.backed ? (c(), V(Fk, {
          key: 0,
          onBack: y[0] || (y[0] = (E) => s("back"))
        })) : C("", !0),
        g("span", f2, k(x.value), 1),
        y[9] || (y[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(G, { key: 1 }, [
          R(de, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: y[1] || (y[1] = (E) => s("step", -1))
          }, {
            default: D(() => [
              R(pe, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          R(de, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: y[2] || (y[2] = (E) => s("step", 1))
          }, {
            default: D(() => [
              R(pe, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : C("", !0),
        R(de, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: y[3] || (y[3] = (E) => s("close"))
        }, {
          default: D(() => [
            R(pe, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      l.value ? (c(), h("p", h2, k(l.value), 1)) : o.value ? (c(), h(G, { key: 2 }, [
        R(Yk, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: $
        }, null, 8, ["id", "row", "read"]),
        g("header", p2, [
          g("div", g2, [
            se(" Task " + k(o.value.id) + " · updated ", 1),
            R(Hn, {
              at: H(hr)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", v2, k(o.value.title), 1)
        ]),
        g("div", y2, [
          R(Ln, {
            options: p,
            value: f.value,
            onPick: y[4] || (y[4] = (E) => f.value = E)
          }, null, 8, ["value"])
        ]),
        g("div", k2, [
          R(Bt, { value: f.value }, {
            details: D(() => [
              R(Pb, {
                task: o.value,
                place: r.value,
                refusal: i.value,
                onStatus: Z,
                onPriority: O,
                onSelect: y[5] || (y[5] = (E) => s("select", E))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: D(() => [
              R(Qb, {
                below: "",
                comments: H(v).comments.value,
                words: H(v).words,
                onClose: y[6] || (y[6] = (E) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: D(() => [
              R(Yb, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        R(c2, {
          send: H(v).send,
          count: H(v).comments.value.length,
          onShow: y[7] || (y[7] = (E) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", m2, [
        R(gt)
      ])),
      u.value ? (c(), V(Rn, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: y[8] || (y[8] = (E) => u.value = null)
      }, {
        default: D(() => [
          R(Wa, null, {
            default: D(() => [
              se("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(G, null, te(d.value.moves, (E) => (c(), V(ht, {
            key: E.word,
            onClick: (S) => q(E)
          }, {
            default: D(() => [
              se(k(E.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : C("", !0)
    ], 2));
  }
}, nx = /* @__PURE__ */ Y(b2, [["__scopeId", "data-v-43f3b122"]]);
function w2(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ya = { exports: {} }, ko;
function x2() {
  return ko || (ko = 1, (function(e, t) {
    var n = (function() {
      var a = function(y, E) {
        var S = 236, T = 17, w = y, A = o[E], M = null, m = 0, L = null, P = [], U = {}, ee = function(j, F) {
          m = w * 4 + 17, M = (function(N) {
            for (var W = new Array(N), z = 0; z < N; z += 1) {
              W[z] = new Array(N);
              for (var Q = 0; Q < N; Q += 1)
                W[z][Q] = null;
            }
            return W;
          })(m), X(0, 0), X(m - 7, 0), X(0, m - 7), ve(), ie(), qe(j, F), w >= 7 && Oe(j), L == null && (L = yl(w, A, P)), Fe(L, F);
        }, X = function(j, F) {
          for (var N = -1; N <= 7; N += 1)
            if (!(j + N <= -1 || m <= j + N))
              for (var W = -1; W <= 7; W += 1)
                F + W <= -1 || m <= F + W || (0 <= N && N <= 6 && (W == 0 || W == 6) || 0 <= W && W <= 6 && (N == 0 || N == 6) || 2 <= N && N <= 4 && 2 <= W && W <= 4 ? M[j + N][F + W] = !0 : M[j + N][F + W] = !1);
        }, K = function() {
          for (var j = 0, F = 0, N = 0; N < 8; N += 1) {
            ee(!0, N);
            var W = l.getLostPoint(U);
            (N == 0 || j > W) && (j = W, F = N);
          }
          return F;
        }, ie = function() {
          for (var j = 8; j < m - 8; j += 1)
            M[j][6] == null && (M[j][6] = j % 2 == 0);
          for (var F = 8; F < m - 8; F += 1)
            M[6][F] == null && (M[6][F] = F % 2 == 0);
        }, ve = function() {
          for (var j = l.getPatternPosition(w), F = 0; F < j.length; F += 1)
            for (var N = 0; N < j.length; N += 1) {
              var W = j[F], z = j[N];
              if (M[W][z] == null)
                for (var Q = -2; Q <= 2; Q += 1)
                  for (var oe = -2; oe <= 2; oe += 1)
                    Q == -2 || Q == 2 || oe == -2 || oe == 2 || Q == 0 && oe == 0 ? M[W + Q][z + oe] = !0 : M[W + Q][z + oe] = !1;
            }
        }, Oe = function(j) {
          for (var F = l.getBCHTypeNumber(w), N = 0; N < 18; N += 1) {
            var W = !j && (F >> N & 1) == 1;
            M[Math.floor(N / 3)][N % 3 + m - 8 - 3] = W;
          }
          for (var N = 0; N < 18; N += 1) {
            var W = !j && (F >> N & 1) == 1;
            M[N % 3 + m - 8 - 3][Math.floor(N / 3)] = W;
          }
        }, qe = function(j, F) {
          for (var N = A << 3 | F, W = l.getBCHTypeInfo(N), z = 0; z < 15; z += 1) {
            var Q = !j && (W >> z & 1) == 1;
            z < 6 ? M[z][8] = Q : z < 8 ? M[z + 1][8] = Q : M[m - 15 + z][8] = Q;
          }
          for (var z = 0; z < 15; z += 1) {
            var Q = !j && (W >> z & 1) == 1;
            z < 8 ? M[8][m - z - 1] = Q : z < 9 ? M[8][15 - z - 1 + 1] = Q : M[8][15 - z - 1] = Q;
          }
          M[m - 8][8] = !j;
        }, Fe = function(j, F) {
          for (var N = -1, W = m - 1, z = 7, Q = 0, oe = l.getMaskFunction(F), ae = m - 1; ae > 0; ae -= 2)
            for (ae == 6 && (ae -= 1); ; ) {
              for (var ye = 0; ye < 2; ye += 1)
                if (M[W][ae - ye] == null) {
                  var we = !1;
                  Q < j.length && (we = (j[Q] >>> z & 1) == 1);
                  var le = oe(W, ae - ye);
                  le && (we = !we), M[W][ae - ye] = we, z -= 1, z == -1 && (Q += 1, z = 7);
                }
              if (W += N, W < 0 || m <= W) {
                W -= N, N = -N;
                break;
              }
            }
        }, bt = function(j, F) {
          for (var N = 0, W = 0, z = 0, Q = new Array(F.length), oe = new Array(F.length), ae = 0; ae < F.length; ae += 1) {
            var ye = F[ae].dataCount, we = F[ae].totalCount - ye;
            W = Math.max(W, ye), z = Math.max(z, we), Q[ae] = new Array(ye);
            for (var le = 0; le < Q[ae].length; le += 1)
              Q[ae][le] = 255 & j.getBuffer()[le + N];
            N += ye;
            var Be = l.getErrorCorrectPolynomial(we), Ie = u(Q[ae], Be.getLength() - 1), ms = Ie.mod(Be);
            oe[ae] = new Array(Be.getLength() - 1);
            for (var le = 0; le < oe[ae].length; le += 1) {
              var ps = le + ms.getLength() - oe[ae].length;
              oe[ae][le] = ps >= 0 ? ms.getAt(ps) : 0;
            }
          }
          for (var gs = 0, le = 0; le < F.length; le += 1)
            gs += F[le].totalCount;
          for (var Un = new Array(gs), an = 0, le = 0; le < W; le += 1)
            for (var ae = 0; ae < F.length; ae += 1)
              le < Q[ae].length && (Un[an] = Q[ae][le], an += 1);
          for (var le = 0; le < z; le += 1)
            for (var ae = 0; ae < F.length; ae += 1)
              le < oe[ae].length && (Un[an] = oe[ae][le], an += 1);
          return Un;
        }, yl = function(j, F, N) {
          for (var W = d.getRSBlocks(j, F), z = f(), Q = 0; Q < N.length; Q += 1) {
            var oe = N[Q];
            z.put(oe.getMode(), 4), z.put(oe.getLength(), l.getLengthInBits(oe.getMode(), j)), oe.write(z);
          }
          for (var ae = 0, Q = 0; Q < W.length; Q += 1)
            ae += W[Q].dataCount;
          if (z.getLengthInBits() > ae * 8)
            throw "code length overflow. (" + z.getLengthInBits() + ">" + ae * 8 + ")";
          for (z.getLengthInBits() + 4 <= ae * 8 && z.put(0, 4); z.getLengthInBits() % 8 != 0; )
            z.putBit(!1);
          for (; !(z.getLengthInBits() >= ae * 8 || (z.put(S, 8), z.getLengthInBits() >= ae * 8)); )
            z.put(T, 8);
          return bt(z, W);
        };
        U.addData = function(j, F) {
          F = F || "Byte";
          var N = null;
          switch (F) {
            case "Numeric":
              N = p(j);
              break;
            case "Alphanumeric":
              N = v(j);
              break;
            case "Byte":
              N = b(j);
              break;
            case "Kanji":
              N = x(j);
              break;
            default:
              throw "mode:" + F;
          }
          P.push(N), L = null;
        }, U.isDark = function(j, F) {
          if (j < 0 || m <= j || F < 0 || m <= F)
            throw j + "," + F;
          return M[j][F];
        }, U.getModuleCount = function() {
          return m;
        }, U.make = function() {
          if (w < 1) {
            for (var j = 1; j < 40; j++) {
              for (var F = d.getRSBlocks(j, A), N = f(), W = 0; W < P.length; W++) {
                var z = P[W];
                N.put(z.getMode(), 4), N.put(z.getLength(), l.getLengthInBits(z.getMode(), j)), z.write(N);
              }
              for (var Q = 0, W = 0; W < F.length; W++)
                Q += F[W].dataCount;
              if (N.getLengthInBits() <= Q * 8)
                break;
            }
            w = j;
          }
          ee(!1, K());
        }, U.createTableTag = function(j, F) {
          j = j || 2, F = typeof F > "u" ? j * 4 : F;
          var N = "";
          N += '<table style="', N += " border-width: 0px; border-style: none;", N += " border-collapse: collapse;", N += " padding: 0px; margin: " + F + "px;", N += '">', N += "<tbody>";
          for (var W = 0; W < U.getModuleCount(); W += 1) {
            N += "<tr>";
            for (var z = 0; z < U.getModuleCount(); z += 1)
              N += '<td style="', N += " border-width: 0px; border-style: none;", N += " border-collapse: collapse;", N += " padding: 0px; margin: 0px;", N += " width: " + j + "px;", N += " height: " + j + "px;", N += " background-color: ", N += U.isDark(W, z) ? "#000000" : "#ffffff", N += ";", N += '"/>';
            N += "</tr>";
          }
          return N += "</tbody>", N += "</table>", N;
        }, U.createSvgTag = function(j, F, N, W) {
          var z = {};
          typeof arguments[0] == "object" && (z = arguments[0], j = z.cellSize, F = z.margin, N = z.alt, W = z.title), j = j || 2, F = typeof F > "u" ? j * 4 : F, N = typeof N == "string" ? { text: N } : N || {}, N.text = N.text || null, N.id = N.text ? N.id || "qrcode-description" : null, W = typeof W == "string" ? { text: W } : W || {}, W.text = W.text || null, W.id = W.text ? W.id || "qrcode-title" : null;
          var Q = U.getModuleCount() * j + F * 2, oe, ae, ye, we, le = "", Be;
          for (Be = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", le += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', le += z.scalable ? "" : ' width="' + Q + 'px" height="' + Q + 'px"', le += ' viewBox="0 0 ' + Q + " " + Q + '" ', le += ' preserveAspectRatio="xMinYMin meet"', le += W.text || N.text ? ' role="img" aria-labelledby="' + wt([W.id, N.id].join(" ").trim()) + '"' : "", le += ">", le += W.text ? '<title id="' + wt(W.id) + '">' + wt(W.text) + "</title>" : "", le += N.text ? '<description id="' + wt(N.id) + '">' + wt(N.text) + "</description>" : "", le += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', le += '<path d="', ye = 0; ye < U.getModuleCount(); ye += 1)
            for (we = ye * j + F, oe = 0; oe < U.getModuleCount(); oe += 1)
              U.isDark(ye, oe) && (ae = oe * j + F, le += "M" + ae + "," + we + Be);
          return le += '" stroke="transparent" fill="black"/>', le += "</svg>", le;
        }, U.createDataURL = function(j, F) {
          j = j || 2, F = typeof F > "u" ? j * 4 : F;
          var N = U.getModuleCount() * j + F * 2, W = F, z = N - F;
          return _(N, N, function(Q, oe) {
            if (W <= Q && Q < z && W <= oe && oe < z) {
              var ae = Math.floor((Q - W) / j), ye = Math.floor((oe - W) / j);
              return U.isDark(ye, ae) ? 0 : 1;
            } else
              return 1;
          });
        }, U.createImgTag = function(j, F, N) {
          j = j || 2, F = typeof F > "u" ? j * 4 : F;
          var W = U.getModuleCount() * j + F * 2, z = "";
          return z += "<img", z += ' src="', z += U.createDataURL(j, F), z += '"', z += ' width="', z += W, z += '"', z += ' height="', z += W, z += '"', N && (z += ' alt="', z += wt(N), z += '"'), z += "/>", z;
        };
        var wt = function(j) {
          for (var F = "", N = 0; N < j.length; N += 1) {
            var W = j.charAt(N);
            switch (W) {
              case "<":
                F += "&lt;";
                break;
              case ">":
                F += "&gt;";
                break;
              case "&":
                F += "&amp;";
                break;
              case '"':
                F += "&quot;";
                break;
              default:
                F += W;
                break;
            }
          }
          return F;
        }, kl = function(j) {
          var F = 1;
          j = typeof j > "u" ? F * 2 : j;
          var N = U.getModuleCount() * F + j * 2, W = j, z = N - j, Q, oe, ae, ye, we, le = {
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
          for (Q = 0; Q < N; Q += 2) {
            for (ae = Math.floor((Q - W) / F), ye = Math.floor((Q + 1 - W) / F), oe = 0; oe < N; oe += 1)
              we = "█", W <= oe && oe < z && W <= Q && Q < z && U.isDark(ae, Math.floor((oe - W) / F)) && (we = " "), W <= oe && oe < z && W <= Q + 1 && Q + 1 < z && U.isDark(ye, Math.floor((oe - W) / F)) ? we += " " : we += "█", Ie += j < 1 && Q + 1 >= z ? Be[we] : le[we];
            Ie += `
`;
          }
          return N % 2 && j > 0 ? Ie.substring(0, Ie.length - N - 1) + Array(N + 1).join("▀") : Ie.substring(0, Ie.length - 1);
        };
        return U.createASCII = function(j, F) {
          if (j = j || 1, j < 2)
            return kl(F);
          j -= 1, F = typeof F > "u" ? j * 2 : F;
          var N = U.getModuleCount() * j + F * 2, W = F, z = N - F, Q, oe, ae, ye, we = Array(j + 1).join("██"), le = Array(j + 1).join("  "), Be = "", Ie = "";
          for (Q = 0; Q < N; Q += 1) {
            for (ae = Math.floor((Q - W) / j), Ie = "", oe = 0; oe < N; oe += 1)
              ye = 1, W <= oe && oe < z && W <= Q && Q < z && U.isDark(ae, Math.floor((oe - W) / j)) && (ye = 0), Ie += ye ? we : le;
            for (ae = 0; ae < j; ae += 1)
              Be += Ie + `
`;
          }
          return Be.substring(0, Be.length - 1);
        }, U.renderTo2dContext = function(j, F) {
          F = F || 2;
          for (var N = U.getModuleCount(), W = 0; W < N; W++)
            for (var z = 0; z < N; z++)
              j.fillStyle = U.isDark(W, z) ? "black" : "white", j.fillRect(W * F, z * F, F, F);
        }, U;
      };
      a.stringToBytesFuncs = {
        default: function(y) {
          for (var E = [], S = 0; S < y.length; S += 1) {
            var T = y.charCodeAt(S);
            E.push(T & 255);
          }
          return E;
        }
      }, a.stringToBytes = a.stringToBytesFuncs.default, a.createStringToBytes = function(y, E) {
        var S = (function() {
          for (var w = q(y), A = function() {
            var ie = w.read();
            if (ie == -1) throw "eof";
            return ie;
          }, M = 0, m = {}; ; ) {
            var L = w.read();
            if (L == -1) break;
            var P = A(), U = A(), ee = A(), X = String.fromCharCode(L << 8 | P), K = U << 8 | ee;
            m[X] = K, M += 1;
          }
          if (M != E)
            throw M + " != " + E;
          return m;
        })(), T = 63;
        return function(w) {
          for (var A = [], M = 0; M < w.length; M += 1) {
            var m = w.charCodeAt(M);
            if (m < 128)
              A.push(m);
            else {
              var L = S[w.charAt(M)];
              typeof L == "number" ? (L & 255) == L ? A.push(L) : (A.push(L >>> 8), A.push(L & 255)) : A.push(T);
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
        var y = [
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
        ], E = 1335, S = 7973, T = 21522, w = {}, A = function(M) {
          for (var m = 0; M != 0; )
            m += 1, M >>>= 1;
          return m;
        };
        return w.getBCHTypeInfo = function(M) {
          for (var m = M << 10; A(m) - A(E) >= 0; )
            m ^= E << A(m) - A(E);
          return (M << 10 | m) ^ T;
        }, w.getBCHTypeNumber = function(M) {
          for (var m = M << 12; A(m) - A(S) >= 0; )
            m ^= S << A(m) - A(S);
          return M << 12 | m;
        }, w.getPatternPosition = function(M) {
          return y[M - 1];
        }, w.getMaskFunction = function(M) {
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
        }, w.getErrorCorrectPolynomial = function(M) {
          for (var m = u([1], 0), L = 0; L < M; L += 1)
            m = m.multiply(u([1, i.gexp(L)], 0));
          return m;
        }, w.getLengthInBits = function(M, m) {
          if (1 <= m && m < 10)
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
          else if (m < 27)
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
          else if (m < 41)
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
            throw "type:" + m;
        }, w.getLostPoint = function(M) {
          for (var m = M.getModuleCount(), L = 0, P = 0; P < m; P += 1)
            for (var U = 0; U < m; U += 1) {
              for (var ee = 0, X = M.isDark(P, U), K = -1; K <= 1; K += 1)
                if (!(P + K < 0 || m <= P + K))
                  for (var ie = -1; ie <= 1; ie += 1)
                    U + ie < 0 || m <= U + ie || K == 0 && ie == 0 || X == M.isDark(P + K, U + ie) && (ee += 1);
              ee > 5 && (L += 3 + ee - 5);
            }
          for (var P = 0; P < m - 1; P += 1)
            for (var U = 0; U < m - 1; U += 1) {
              var ve = 0;
              M.isDark(P, U) && (ve += 1), M.isDark(P + 1, U) && (ve += 1), M.isDark(P, U + 1) && (ve += 1), M.isDark(P + 1, U + 1) && (ve += 1), (ve == 0 || ve == 4) && (L += 3);
            }
          for (var P = 0; P < m; P += 1)
            for (var U = 0; U < m - 6; U += 1)
              M.isDark(P, U) && !M.isDark(P, U + 1) && M.isDark(P, U + 2) && M.isDark(P, U + 3) && M.isDark(P, U + 4) && !M.isDark(P, U + 5) && M.isDark(P, U + 6) && (L += 40);
          for (var U = 0; U < m; U += 1)
            for (var P = 0; P < m - 6; P += 1)
              M.isDark(P, U) && !M.isDark(P + 1, U) && M.isDark(P + 2, U) && M.isDark(P + 3, U) && M.isDark(P + 4, U) && !M.isDark(P + 5, U) && M.isDark(P + 6, U) && (L += 40);
          for (var Oe = 0, U = 0; U < m; U += 1)
            for (var P = 0; P < m; P += 1)
              M.isDark(P, U) && (Oe += 1);
          var qe = Math.abs(100 * Oe / m / m - 50) / 5;
          return L += qe * 10, L;
        }, w;
      })(), i = (function() {
        for (var y = new Array(256), E = new Array(256), S = 0; S < 8; S += 1)
          y[S] = 1 << S;
        for (var S = 8; S < 256; S += 1)
          y[S] = y[S - 4] ^ y[S - 5] ^ y[S - 6] ^ y[S - 8];
        for (var S = 0; S < 255; S += 1)
          E[y[S]] = S;
        var T = {};
        return T.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return E[w];
        }, T.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return y[w];
        }, T;
      })();
      function u(y, E) {
        if (typeof y.length > "u")
          throw y.length + "/" + E;
        var S = (function() {
          for (var w = 0; w < y.length && y[w] == 0; )
            w += 1;
          for (var A = new Array(y.length - w + E), M = 0; M < y.length - w; M += 1)
            A[M] = y[M + w];
          return A;
        })(), T = {};
        return T.getAt = function(w) {
          return S[w];
        }, T.getLength = function() {
          return S.length;
        }, T.multiply = function(w) {
          for (var A = new Array(T.getLength() + w.getLength() - 1), M = 0; M < T.getLength(); M += 1)
            for (var m = 0; m < w.getLength(); m += 1)
              A[M + m] ^= i.gexp(i.glog(T.getAt(M)) + i.glog(w.getAt(m)));
          return u(A, 0);
        }, T.mod = function(w) {
          if (T.getLength() - w.getLength() < 0)
            return T;
          for (var A = i.glog(T.getAt(0)) - i.glog(w.getAt(0)), M = new Array(T.getLength()), m = 0; m < T.getLength(); m += 1)
            M[m] = T.getAt(m);
          for (var m = 0; m < w.getLength(); m += 1)
            M[m] ^= i.gexp(i.glog(w.getAt(m)) + A);
          return u(M, 0).mod(w);
        }, T;
      }
      var d = (function() {
        var y = [
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
        ], E = function(w, A) {
          var M = {};
          return M.totalCount = w, M.dataCount = A, M;
        }, S = {}, T = function(w, A) {
          switch (A) {
            case o.L:
              return y[(w - 1) * 4 + 0];
            case o.M:
              return y[(w - 1) * 4 + 1];
            case o.Q:
              return y[(w - 1) * 4 + 2];
            case o.H:
              return y[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return S.getRSBlocks = function(w, A) {
          var M = T(w, A);
          if (typeof M > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + A;
          for (var m = M.length / 3, L = [], P = 0; P < m; P += 1)
            for (var U = M[P * 3 + 0], ee = M[P * 3 + 1], X = M[P * 3 + 2], K = 0; K < U; K += 1)
              L.push(E(ee, X));
          return L;
        }, S;
      })(), f = function() {
        var y = [], E = 0, S = {};
        return S.getBuffer = function() {
          return y;
        }, S.getAt = function(T) {
          var w = Math.floor(T / 8);
          return (y[w] >>> 7 - T % 8 & 1) == 1;
        }, S.put = function(T, w) {
          for (var A = 0; A < w; A += 1)
            S.putBit((T >>> w - A - 1 & 1) == 1);
        }, S.getLengthInBits = function() {
          return E;
        }, S.putBit = function(T) {
          var w = Math.floor(E / 8);
          y.length <= w && y.push(0), T && (y[w] |= 128 >>> E % 8), E += 1;
        }, S;
      }, p = function(y) {
        var E = s.MODE_NUMBER, S = y, T = {};
        T.getMode = function() {
          return E;
        }, T.getLength = function(M) {
          return S.length;
        }, T.write = function(M) {
          for (var m = S, L = 0; L + 2 < m.length; )
            M.put(w(m.substring(L, L + 3)), 10), L += 3;
          L < m.length && (m.length - L == 1 ? M.put(w(m.substring(L, L + 1)), 4) : m.length - L == 2 && M.put(w(m.substring(L, L + 2)), 7));
        };
        var w = function(M) {
          for (var m = 0, L = 0; L < M.length; L += 1)
            m = m * 10 + A(M.charAt(L));
          return m;
        }, A = function(M) {
          if ("0" <= M && M <= "9")
            return M.charCodeAt(0) - 48;
          throw "illegal char :" + M;
        };
        return T;
      }, v = function(y) {
        var E = s.MODE_ALPHA_NUM, S = y, T = {};
        T.getMode = function() {
          return E;
        }, T.getLength = function(A) {
          return S.length;
        }, T.write = function(A) {
          for (var M = S, m = 0; m + 1 < M.length; )
            A.put(
              w(M.charAt(m)) * 45 + w(M.charAt(m + 1)),
              11
            ), m += 2;
          m < M.length && A.put(w(M.charAt(m)), 6);
        };
        var w = function(A) {
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
        return T;
      }, b = function(y) {
        var E = s.MODE_8BIT_BYTE, S = a.stringToBytes(y), T = {};
        return T.getMode = function() {
          return E;
        }, T.getLength = function(w) {
          return S.length;
        }, T.write = function(w) {
          for (var A = 0; A < S.length; A += 1)
            w.put(S[A], 8);
        }, T;
      }, x = function(y) {
        var E = s.MODE_KANJI, S = a.stringToBytesFuncs.SJIS;
        if (!S)
          throw "sjis not supported.";
        (function(A, M) {
          var m = S(A);
          if (m.length != 2 || (m[0] << 8 | m[1]) != M)
            throw "sjis not supported.";
        })("友", 38726);
        var T = S(y), w = {};
        return w.getMode = function() {
          return E;
        }, w.getLength = function(A) {
          return ~~(T.length / 2);
        }, w.write = function(A) {
          for (var M = T, m = 0; m + 1 < M.length; ) {
            var L = (255 & M[m]) << 8 | 255 & M[m + 1];
            if (33088 <= L && L <= 40956)
              L -= 33088;
            else if (57408 <= L && L <= 60351)
              L -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + L;
            L = (L >>> 8 & 255) * 192 + (L & 255), A.put(L, 13), m += 2;
          }
          if (m < M.length)
            throw "illegal char at " + (m + 1);
        }, w;
      }, $ = function() {
        var y = [], E = {};
        return E.writeByte = function(S) {
          y.push(S & 255);
        }, E.writeShort = function(S) {
          E.writeByte(S), E.writeByte(S >>> 8);
        }, E.writeBytes = function(S, T, w) {
          T = T || 0, w = w || S.length;
          for (var A = 0; A < w; A += 1)
            E.writeByte(S[A + T]);
        }, E.writeString = function(S) {
          for (var T = 0; T < S.length; T += 1)
            E.writeByte(S.charCodeAt(T));
        }, E.toByteArray = function() {
          return y;
        }, E.toString = function() {
          var S = "";
          S += "[";
          for (var T = 0; T < y.length; T += 1)
            T > 0 && (S += ","), S += y[T];
          return S += "]", S;
        }, E;
      }, O = function() {
        var y = 0, E = 0, S = 0, T = "", w = {}, A = function(m) {
          T += String.fromCharCode(M(m & 63));
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
        return w.writeByte = function(m) {
          for (y = y << 8 | m & 255, E += 8, S += 1; E >= 6; )
            A(y >>> E - 6), E -= 6;
        }, w.flush = function() {
          if (E > 0 && (A(y << 6 - E), y = 0, E = 0), S % 3 != 0)
            for (var m = 3 - S % 3, L = 0; L < m; L += 1)
              T += "=";
        }, w.toString = function() {
          return T;
        }, w;
      }, q = function(y) {
        var E = y, S = 0, T = 0, w = 0, A = {};
        A.read = function() {
          for (; w < 8; ) {
            if (S >= E.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var m = E.charAt(S);
            if (S += 1, m == "=")
              return w = 0, -1;
            if (m.match(/^\s$/))
              continue;
            T = T << 6 | M(m.charCodeAt(0)), w += 6;
          }
          var L = T >>> w - 8 & 255;
          return w -= 8, L;
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
        return A;
      }, Z = function(y, E) {
        var S = y, T = E, w = new Array(y * E), A = {};
        A.setPixel = function(P, U, ee) {
          w[U * S + P] = ee;
        }, A.write = function(P) {
          P.writeString("GIF87a"), P.writeShort(S), P.writeShort(T), P.writeByte(128), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(255), P.writeByte(255), P.writeByte(255), P.writeString(","), P.writeShort(0), P.writeShort(0), P.writeShort(S), P.writeShort(T), P.writeByte(0);
          var U = 2, ee = m(U);
          P.writeByte(U);
          for (var X = 0; ee.length - X > 255; )
            P.writeByte(255), P.writeBytes(ee, X, 255), X += 255;
          P.writeByte(ee.length - X), P.writeBytes(ee, X, ee.length - X), P.writeByte(0), P.writeString(";");
        };
        var M = function(P) {
          var U = P, ee = 0, X = 0, K = {};
          return K.write = function(ie, ve) {
            if (ie >>> ve)
              throw "length over";
            for (; ee + ve >= 8; )
              U.writeByte(255 & (ie << ee | X)), ve -= 8 - ee, ie >>>= 8 - ee, X = 0, ee = 0;
            X = ie << ee | X, ee = ee + ve;
          }, K.flush = function() {
            ee > 0 && U.writeByte(X);
          }, K;
        }, m = function(P) {
          for (var U = 1 << P, ee = (1 << P) + 1, X = P + 1, K = L(), ie = 0; ie < U; ie += 1)
            K.add(String.fromCharCode(ie));
          K.add(String.fromCharCode(U)), K.add(String.fromCharCode(ee));
          var ve = $(), Oe = M(ve);
          Oe.write(U, X);
          var qe = 0, Fe = String.fromCharCode(w[qe]);
          for (qe += 1; qe < w.length; ) {
            var bt = String.fromCharCode(w[qe]);
            qe += 1, K.contains(Fe + bt) ? Fe = Fe + bt : (Oe.write(K.indexOf(Fe), X), K.size() < 4095 && (K.size() == 1 << X && (X += 1), K.add(Fe + bt)), Fe = bt);
          }
          return Oe.write(K.indexOf(Fe), X), Oe.write(ee, X), Oe.flush(), ve.toByteArray();
        }, L = function() {
          var P = {}, U = 0, ee = {};
          return ee.add = function(X) {
            if (ee.contains(X))
              throw "dup key:" + X;
            P[X] = U, U += 1;
          }, ee.size = function() {
            return U;
          }, ee.indexOf = function(X) {
            return P[X];
          }, ee.contains = function(X) {
            return typeof P[X] < "u";
          }, ee;
        };
        return A;
      }, _ = function(y, E, S) {
        for (var T = Z(y, E), w = 0; w < E; w += 1)
          for (var A = 0; A < y; A += 1)
            T.setPixel(A, w, S(A, w));
        var M = $();
        T.write(M);
        for (var m = O(), L = M.toByteArray(), P = 0; P < L.length; P += 1)
          m.writeByte(L[P]);
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
  })(ya)), ya.exports;
}
var $2 = x2();
const M2 = /* @__PURE__ */ w2($2), S2 = ["width", "height", "viewBox"], _2 = ["width", "height"], E2 = ["d"], A2 = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = I(() => {
      const a = M2(0, "M");
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
      }, null, 8, _2),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, E2)
    ], 8, S2));
  }
}, ax = /* @__PURE__ */ Y(A2, [["__scopeId", "data-v-489f0852"]]), C2 = {
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
}, sx = /* @__PURE__ */ Y(C2, [["__scopeId", "data-v-47e67f04"]]), ox = Bl(() => import("./VoiceFigure-BvF7X-k5.js").then((e) => e.V)), rx = "1.1.0", lx = "3.5";
export {
  oy as $,
  xe as A,
  _e as B,
  jn as C,
  Ze as D,
  h4 as E,
  Kv as F,
  a5 as G,
  c4 as H,
  ty as I,
  kt as J,
  is as K,
  Av as L,
  ly as M,
  ey as N,
  C5 as O,
  Pn as P,
  yn as Q,
  Nw as R,
  R5 as S,
  Aw as T,
  Me as U,
  En as V,
  Ew as W,
  _w as X,
  ou as Y,
  ru as Z,
  Y as _,
  yw as a,
  Uv as a$,
  Dw as a0,
  Pw as a1,
  Se as a2,
  Yw as a3,
  Kw as a4,
  mt as a5,
  jw as a6,
  l5 as a7,
  lw as a8,
  X5 as a9,
  _5 as aA,
  vv as aB,
  d5 as aC,
  f5 as aD,
  m4 as aE,
  Qr as aF,
  I5 as aG,
  Qt as aH,
  hw as aI,
  uw as aJ,
  a4 as aK,
  en as aL,
  l4 as aM,
  n5 as aN,
  E5 as aO,
  A5 as aP,
  S5 as aQ,
  Vt as aR,
  dt as aS,
  iw as aT,
  l0 as aU,
  $5 as aV,
  Rw as aW,
  Jr as aX,
  Ct as aY,
  Rt as aZ,
  J5 as a_,
  o4 as aa,
  gw as ab,
  Cw as ac,
  Ow as ad,
  Vw as ae,
  Gw as af,
  Zw as ag,
  xw as ah,
  fo as ai,
  qw as aj,
  r5 as ak,
  y4 as al,
  k5 as am,
  v5 as an,
  g5 as ao,
  Jw as ap,
  Uw as aq,
  Hw as ar,
  zw as as,
  B5 as at,
  o5 as au,
  i5 as av,
  w4 as aw,
  Pt as ax,
  c5 as ay,
  H5 as az,
  yy as b,
  dw as b$,
  r4 as b0,
  D5 as b1,
  N5 as b2,
  T0 as b3,
  Pr as b4,
  K5 as b5,
  s5 as b6,
  Wn as b7,
  Qe as b8,
  U5 as b9,
  z5 as bA,
  at as bB,
  L5 as bC,
  V5 as bD,
  u5 as bE,
  b5 as bF,
  h5 as bG,
  Ee as bH,
  t5 as bI,
  G5 as bJ,
  C4 as bK,
  O4 as bL,
  ow as bM,
  u0 as bN,
  Qw as bO,
  q5 as bP,
  kw as bQ,
  v4 as bR,
  P5 as bS,
  F5 as bT,
  W5 as bU,
  Xw as bV,
  yv as bW,
  e5 as bX,
  p5 as bY,
  g4 as bZ,
  b4 as b_,
  ra as ba,
  fr as bb,
  $4 as bc,
  _4 as bd,
  T5 as be,
  n4 as bf,
  rw as bg,
  y5 as bh,
  M4 as bi,
  Fw as bj,
  Ww as bk,
  Mw as bl,
  Lw as bm,
  fw as bn,
  e4 as bo,
  bw as bp,
  ww as bq,
  Sw as br,
  x5 as bs,
  n0 as bt,
  i4 as bu,
  Qv as bv,
  $w as bw,
  mw as bx,
  w5 as by,
  j5 as bz,
  O0 as c,
  X2 as c$,
  cw as c0,
  m5 as c1,
  E4 as c2,
  hs as c3,
  A4 as c4,
  ml as c5,
  t4 as c6,
  Bw as c7,
  Tw as c8,
  r0 as c9,
  rx as cA,
  lx as cB,
  G2 as cC,
  G4 as cD,
  Ia as cE,
  ew as cF,
  Vp as cG,
  ht as cH,
  Wa as cI,
  Rn as cJ,
  W2 as cK,
  K2 as cL,
  Ql as cM,
  lp as cN,
  ex as cO,
  U2 as cP,
  ax as cQ,
  W4 as cR,
  gu as cS,
  L2 as cT,
  nw as cU,
  mk as cV,
  Ln as cW,
  Y2 as cX,
  gt as cY,
  D1 as cZ,
  fi as c_,
  pw as ca,
  Jv as cb,
  M5 as cc,
  os as cd,
  fv as ce,
  O5 as cf,
  jt as cg,
  _t as ch,
  j2 as ci,
  U4 as cj,
  de as ck,
  Hc as cl,
  Zc as cm,
  Nn as cn,
  q2 as co,
  zo as cp,
  tx as cq,
  sw as cr,
  cm as cs,
  bn as ct,
  T4 as cu,
  T2 as cv,
  At as cw,
  kc as cx,
  pe as cy,
  z4 as cz,
  De as d,
  q4 as d$,
  N2 as d0,
  Bt as d1,
  V4 as d2,
  nx as d3,
  vl as d4,
  wc as d5,
  tt as d6,
  Z2 as d7,
  Hn as d8,
  ox as d9,
  V2 as dA,
  N4 as dB,
  P4 as dC,
  Ne as dD,
  F2 as dE,
  H2 as dF,
  L4 as dG,
  km as dH,
  R2 as dI,
  B2 as dJ,
  No as dK,
  Do as dL,
  Xi as dM,
  P2 as dN,
  ze as dO,
  Py as dP,
  J2 as dQ,
  R4 as dR,
  H4 as dS,
  Ly as dT,
  K4 as dU,
  Vm as dV,
  _o as dW,
  $k as dX,
  Or as dY,
  j4 as dZ,
  Ba as d_,
  sx as da,
  xr as db,
  D4 as dc,
  Ka as dd,
  Jh as de,
  qs as df,
  Xh as dg,
  Zi as dh,
  X4 as di,
  J4 as dj,
  Ya as dk,
  Yi as dl,
  z2 as dm,
  Q4 as dn,
  aw as dp,
  tw as dq,
  Q2 as dr,
  I4 as ds,
  Pd as dt,
  B4 as du,
  I2 as dv,
  Y4 as dw,
  jp as dx,
  Dy as dy,
  D2 as dz,
  Iw as e,
  F4 as e0,
  vt as e1,
  Z4 as e2,
  Ji as e3,
  t0 as f,
  x4 as g,
  Gt as h,
  u4 as i,
  S4 as j,
  d4 as k,
  Q5 as l,
  $y as m,
  cs as n,
  s4 as o,
  vw as p,
  f4 as q,
  fl as r,
  hl as s,
  Et as t,
  I0 as u,
  Y5 as v,
  k4 as w,
  Z5 as x,
  nn as y,
  p4 as z
};
