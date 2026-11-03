/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as me, createElementVNode as p, normalizeClass as Z, Fragment as K, renderList as se, normalizeStyle as pe, defineComponent as Pi, Comment as ji, h as ia, cloneVNode as qi, createBlock as G, withCtx as F, unref as z, createVNode as B, toDisplayString as x, createCommentVNode as A, inject as Ce, useAttrs as Hn, computed as R, ref as I, resolveDynamicComponent as xt, mergeProps as tt, Transition as Bt, watch as be, shallowRef as Un, createTextVNode as le, TransitionGroup as Do, reactive as la, onMounted as Fe, onUnmounted as Re, nextTick as Lt, useId as Po, Teleport as ca, withModifiers as xe, isRef as Na, onBeforeUnmount as Nt, resolveComponent as Fi, resolveDirective as Wi, withDirectives as dt, useModel as Bs, getCurrentInstance as Hi, mergeModels as Ls, getCurrentScope as jo, onScopeDispose as qo, provide as Ui, onErrorCaptured as zi, toHandlers as Vi, createSlots as Gi, vShow as Ki, useSlots as Yi, withKeys as Kt, vModelText as Ns, defineAsyncComponent as Ji } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, Zi = { class: "skeleton-line" }, Xi = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", Zi, [
      me(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(K, null, se(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: pe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, ft = /* @__PURE__ */ Y(Xi, [["__scopeId", "data-v-0ebb6933"]]), ln = Pi({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== ji);
      return s.length !== 1 ? ia(K, { key: n }, s) : s[0].key == null ? qi(s[0], { key: n }) : s[0];
    };
  }
}), Qi = ["aria-label"], el = ["aria-label"], tl = ["aria-label"], nl = ["aria-label"], sl = ["aria-label"], al = ["aria-label"], ol = ["aria-label"], rl = {
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
    return (l, u) => (c(), G(ln, { value: e.shape }, {
      messages: F(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(K, null, se(t, (d) => p("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: pe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, Qi)
      ]),
      older: F(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, se(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: pe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, el)
      ]),
      cards: F(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(K, null, se(n, (f) => B(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, tl)
      ]),
      file: F(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, se(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            B(ft, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(K, null, se(a, (f) => B(ft, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, nl)
      ]),
      page: F(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          B(ft, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(K, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, sl)
      ]),
      text: F(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, al)
      ]),
      default: F(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, se(e.count, (d) => (c(), G(ft, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, ol)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Dt = /* @__PURE__ */ Y(rl, [["__scopeId", "data-v-1392eacb"]]), il = {
  key: 1,
  class: "empty-state titled"
}, ll = { class: "empty-state-title" }, cl = { class: "empty-state-text" }, ul = {
  key: 2,
  class: "empty-state"
}, dl = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Dt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", il, [
      p("p", ll, x(e.title), 1),
      p("p", cl, [
        me(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", ul, [
      me(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Bn = /* @__PURE__ */ Y(dl, [["__scopeId", "data-v-b27e89b0"]]), hl = { class: "fold-group" }, fl = ["aria-expanded"], ml = { class: "fold-label" }, pl = {
  key: 0,
  class: "fold-count"
}, gl = {
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
    return (s, a) => (c(), h("div", hl, [
      p("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", ml, x(e.label), 1),
        e.count !== "" ? (c(), h("span", pl, x(e.count), 1)) : A("", !0),
        p("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, fl),
      e.open ? me(s.$slots, "default", {}, void 0, !0, 0) : A("", !0)
    ]));
  }
}, zk = /* @__PURE__ */ Y(gl, [["__scopeId", "data-v-9ef1865c"]]), vl = Symbol("open-view"), Te = Symbol.for("journal.window-context");
function zn() {
  const e = Ce(Te, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const yl = ["stroke-width", "innerHTML"], ye = {
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
      style: pe({
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
    }, null, 12, yl));
  }
}, wl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: pe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, kl = /* @__PURE__ */ Y(wl, [["__scopeId", "data-v-eb453d6f"]]), bl = 120, xl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Hn(), s = R(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = I(!1), o = R(() => t.busy || a.value), r = Ce(Te, null), i = R(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((v) => v(u)).filter((v) => v instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => a.value = !0, bl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), a.value = !1;
      }
    }
    return (u, d) => (c(), G(xt(e.href ? "a" : "button"), tt(s.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: l
    }), {
      default: F(() => [
        p("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), G(ye, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : A("", !0),
          me(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), G(kl, {
          key: 0,
          class: "btn-spinner"
        })) : A("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ve = /* @__PURE__ */ Y(xl, [["__scopeId", "data-v-033d70ca"]]), $l = {
  class: "running",
  "data-running-command": ""
}, Ml = ["title"], Sl = {
  key: "idle",
  class: "running-idle"
}, _l = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", $l, [
      B(Bt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, x(e.text), 9, Ml)) : (c(), h("span", Sl, x(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Vk = /* @__PURE__ */ Y(_l, [["__scopeId", "data-v-d3240219"]]), El = ["aria-checked", "aria-label", "title"], Al = {
  key: 0,
  class: "switch-inner"
}, Cl = {
  key: 0,
  class: "switch-word"
}, Ol = {
  __name: "Switch",
  props: { on: Boolean, word: { type: String, default: "" }, title: { type: String, default: "" }, framed: Boolean, labelled: Boolean, large: Boolean, beside: Boolean },
  emits: ["change"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      p("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Al, x(e.word), 1)) : A("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Cl, x(e.word), 1)) : A("", !0)
    ], 10, El));
  }
}, Gk = /* @__PURE__ */ Y(Ol, [["__scopeId", "data-v-1bfb90f3"]]);
function Fo(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Yt(e, t) {
  return Fo(() => localStorage, e, t);
}
function Wo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Vn(e, t) {
  return Wo(() => localStorage, e, t);
}
function Ho(e, t) {
  be(t, (n) => Vn(e, n), { deep: !0 });
}
function Tl(e, t) {
  return Fo(() => sessionStorage, e, t);
}
function Il(e, t) {
  return Wo(() => sessionStorage, e, t);
}
const Ln = "journal.environment", Uo = I(Tl(Ln, Yt(Ln, "")));
function Rl(e) {
  Uo.value = e, Il(Ln, e), Vn(Ln, e);
}
const Nn = I(location.hash), Da = Un(null), Pa = { integrations: "mcp", library: "team" };
function Bl() {
  if (!Da.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Pa[n]) {
    location.replace(`#/${[Pa[n], ...s].join("/")}${t ? `?${t}` : ""}`), Nn.value = location.hash;
    return;
  }
  !n || Da.value(n) || (Rl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Nn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Nn.value = location.hash, Bl();
});
const Ze = R(() => {
  const [e, t = ""] = Nn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: Uo.value,
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
}), Gn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Gn.page(e)}?open=${t}`
};
function Ll(e = "", t = 0, n = "") {
  location.hash = Gn.page(e, t, n);
}
const Nl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function zo(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Nl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Ot = {};
function Kk(e, t) {
  return Ot[e] = t, () => Ot[e] === t && delete Ot[e];
}
function Vo(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Ot[e]) != null && r.call(Ot, t))) return;
  const a = Ze.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  zo([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Dl(e, t, n, s = 0, a = "") {
  if (e === Ze.value.env) return Vo(t, n, s, a);
  const o = Ze.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  zo([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Xe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Dl(s, a, Number(o), 0, t) : Vo(a, Number(o), 0, t);
}
function Pl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ct(e) {
  const t = Pl(e);
  t && Xe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Kn = typeof document < "u" && document.documentElement.classList.contains("phone"), jl = "Files are attached on the computer; the phone sends text.", os = [
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
}), cn = {
  messages: ge("Message", "mail", "What the user left for the agent, or the agent for the user", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: ge("Question", "help", "Something the agent asks the user, with choices to pick", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: ge("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: os
  }),
  tasks: ge("Task", "ring", "One unit of work with a life: open, started, done", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: os
  }),
  reports: ge("Report", "report", "What was checked and what was found, written for the user", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: ge("Collection", "folder", "Rows that belong together, gathered under a name", {
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
  rules: ge("Rule", "list", "A ruling that binds every environment of the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: ge("Reminder", "clock", "An instruction said again until it is retired", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: ge("Pin", "band", "One line pinned to the chat while it matters", { filters: os }),
  reactions: ge("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: ge("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", { scope: "project" }),
  environments: ge("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", { scope: "project" }),
  agents: ge("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: ge("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: ge("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
  verifiers: ge("Verifier", "verifier", "An agent the journal sends by itself to judge whether a dismissed reader report was dismissed rightly"),
  test_turns: ge("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: ge("Reviewer", "reviewer", "An agent the journal sends by itself, in orchestrator mode with the reviewer on, to test and check each worker's work and report each point to the agent"),
  subagents: ge("Subagent", "bot", "A helper the agent started inside its own session for one job", { nested: !0 }),
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
  triggers: ge("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
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
      { key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check of its own." }
    ],
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0
  }),
  dumps: ge("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: ge("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: ge("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, ql = ["secrets", "plugins"], Go = Object.keys(cn).filter((e) => !(Kn && ql.includes(e)));
R(() => Go.map((e) => ({ name: e, ...cn[e] })));
const un = (e) => cn[e], Ko = new Map(Go.flatMap((e) => [e, e.replace(/s$/, ""), cn[e].title.toLowerCase()].map((t) => [t, e]))), kt = (e) => Ko.get(String(e).toLowerCase()) || "", Yo = [...Ko.keys()].sort((e, t) => t.length - e.length).join("|"), Yn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(ve, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        B(ye, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Fl = {
  key: 1,
  class: "row-list-failure"
}, Wl = ["data-row"], Hl = {
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
    const t = e, n = R(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = I(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), G(Dt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Fl, x(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(Bn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: F(() => [
        le(x(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(K, { key: 3 }, [
      (c(), G(xt(e.arrival ? Do : "ul"), tt(n.value, { class: "row-list" }), {
        default: F(() => [
          (c(!0), h(K, null, se(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            me(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Wl))), 128))
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
}, Ul = /* @__PURE__ */ Y(Hl, [["__scopeId", "data-v-aa6ad7ff"]]), zl = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Vl = {
  key: 1,
  class: "agent-rows-note"
}, Gl = {
  key: 2,
  class: "agent-rows-note"
}, Kl = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Yl = ["data-agent-row", "onClick"], Jl = { class: "agent-row-name" }, Zl = { class: "agent-row-state" }, Xl = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = R(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", zl, [
      e.loaded ? e.failure ? (c(), h("p", Vl, x(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        p("p", Kl, x(s.value) + " running", 1),
        (c(!0), h(K, null, se(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(Xe)(`agents:${r.id}`)
        }, [
          p("span", Jl, "#" + x(r.id) + " " + x(r.session), 1),
          p("span", Zl, x(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Yl))), 128))
      ], 64)) : (c(), h("p", Gl, x(e.none), 1)) : (c(), G(Dt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Yk = /* @__PURE__ */ Y(Xl, [["__scopeId", "data-v-a01e5a17"]]), Ql = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, x(e.text), 3));
  }
}, Jo = /* @__PURE__ */ Y(Ql, [["__scopeId", "data-v-9e7e1157"]]), ec = ["aria-valuenow", "aria-valuemax"], tc = {
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
    return (s, a) => (c(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: pe({ width: n.value })
      }, null, 4)
    ], 10, ec));
  }
}, nc = /* @__PURE__ */ Y(tc, [["__scopeId", "data-v-9eba6a85"]]), sc = { class: "bars" }, ac = { class: "bar-name" }, oc = { class: "bar-value" }, rc = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = R(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", sc, [
      (c(!0), h(K, null, se(e.items, (l, u) => (c(), G(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: Z(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: F(() => [
          p("span", ac, x(l.label), 1),
          B(nc, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", oc, x(l.value) + x(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, ic = /* @__PURE__ */ Y(rc, [["__scopeId", "data-v-663427f4"]]), lc = { class: "bars" }, cc = {
  key: 0,
  class: "bars-title"
}, uc = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", lc, [
      e.node.title ? (c(), h("span", cc, x(e.node.title), 1)) : A("", !0),
      B(ic, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, dc = /* @__PURE__ */ Y(uc, [["__scopeId", "data-v-7135bb11"]]), hc = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = R(() => n[s.node.type](s.node));
    return (r, i) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: pe(o.value)
    }, [
      (c(!0), h(K, null, se(e.node.children || [], (l, u) => (c(), G(_r, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Cn = /* @__PURE__ */ Y(hc, [["__scopeId", "data-v-d142a3f4"]]), fc = {
  key: 0,
  class: "card-head"
}, mc = { class: "card-title" }, pc = {
  key: 0,
  class: "card-note"
}, gc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", fc, [
        p("span", mc, x(e.node.title), 1),
        e.node.note ? (c(), h("span", pc, x(e.node.note), 1)) : A("", !0)
      ])) : A("", !0),
      B(Cn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, vc = /* @__PURE__ */ Y(gc, [["__scopeId", "data-v-67b72d40"]]), yc = (e) => "task_ids" in e, Zo = 1024, wc = Zo * 1024 * 1024, kc = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Zo} MB limit for one file.`;
function bc() {
  return () => {
  };
}
function Ds(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Xo(e = window) {
  if (!Ds(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ds(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Ps = "journal.stale-build-reload", xc = 'script[type="module"][src*="/assets/index-"]', ja = (e) => {
  var t;
  return ((t = e.querySelector(xc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function $c(e = document, t = fetch, n = () => Xo(window)) {
  const s = ja(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = ja(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let rs = "";
function Mc(e, t = () => Xo(window)) {
  if (!e) return !1;
  const n = !!rs && rs !== e;
  return rs = e, n && t(), n;
}
const Sc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function _c(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Ps) === e.message) return !1;
    t.setItem(Ps, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Ec(e = window.sessionStorage) {
  try {
    e.removeItem(Ps);
  } catch {
    return;
  }
}
const Ac = 2e3, Cc = 3e4, ze = la({ starting: !1, external: !1, late: !1, offline: !1 }), ua = () => ze.starting, Oc = 3;
let wn = 0, js = 0, Qo = 0, er = [];
async function Tc() {
  try {
    const e = await je.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function Ic() {
  clearInterval(js), clearTimeout(Qo), js = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), er.splice(0).forEach((e) => e()), $c();
}
let is = !1;
async function Rc() {
  if (ze.offline = !navigator.onLine, is) return;
  is = !0;
  const e = await Tc();
  if (is = !1, ze.external = e.updating, wn = !e.restarting && !e.updating && e.reachable ? wn + 1 : 0, wn < Oc) return;
  wn = 0, (!Mc(e.started_at) || Ds()) && Ic();
}
function qa() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, js = setInterval(Rc, Ac), Qo = setTimeout(() => ze.late = !0, Cc));
}
const Bc = () => ze.starting ? new Promise((e) => er.push(e)) : Promise.resolve(), Fa = 2e4, Lc = 3e5, Ke = 6e5, kn = 6, Nc = 500, Dc = "/journal/summary", Pc = "/api/server-state", jc = 5e3, Wa = Kn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, qc = (e) => e.split("?")[0].endsWith(Dc), tr = (e, t) => Object.assign(new Error(t), { status: e });
async function Fc(e, t, n = tr) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Wc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Hc {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = kn;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = kn;
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
        headers: { ...Wa, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Wc(s),
        signal: AbortSignal.timeout(a || (i ? Lc : Fa))
      });
    } catch (l) {
      if (l instanceof TypeError && qa(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Nc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = kn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : bc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Fc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Wa, signal: AbortSignal.timeout(Fa) });
    if (!n.ok) throw tr(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, kn, o).then((l) => (this.written(n), l));
    if (ua() && !qc(n))
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
    return fetch(Pc, { cache: "no-store", signal: AbortSignal.timeout(jc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && qa(), s;
    }
  }
}
const je = new Hc(), Be = (e) => encodeURIComponent(e);
function he(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const jt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), qt = "the page does not know its environment yet", Uc = "X-Journal-Env", zc = "X-Journal-Request-At", ls = "/viewer/voices/figures/";
class da {
  constructor({ env: t = () => Ze.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new da({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [zc]: String(Date.now()), ...this.env() ? { [Uc]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === qt ? Promise.reject(new Error(qt)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === qt ? Promise.reject(new Error(qt)) : je.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : qt;
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
    return this.get(`/updates/changelog${he({ skip: t })}`);
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
    return this.get(this.here(`/entries${he({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return je.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: u = !1 } = {}) {
    const d = this.here(`/${t}${he({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(d, `${t}.${jt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${he({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${jt({ before: s, since: a, docked: o })}`);
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
    return this.post(this.here(t.path), {}, Ke);
  }
  upload(t, n, s) {
    if (Kn) return Promise.reject(Object.assign(new Error(jl), { status: 403 }));
    if (s.size > wc) return Promise.reject(new Error(kc(s)));
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
    return je.bytes(t);
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
    return this.get(this.here(`/messages${he({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${he(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${he({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${he({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Be(t)}${he({ model: n, effort: s })}`);
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
    return this.get(this.here(`${a}${he(s)}`), `${a}.${jt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${he(n)}`), `/verifiers/${t}/transcript.${jt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${he(n)}`), `/workers/${t}/transcript.${jt(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${he({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${he({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${he({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${he({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${he({ team: t })}`);
  }
  // every team this journal is connected to, with as whom, the role and how many people, devices and shared items
  teams() {
    return this.get("/teams");
  }
  // connects to a team by its server's URL: a new server's makes this person its admin, an pair_code URL a member, a bare URL logs in
  connectTeam(t) {
    return this.post("/team/connect", t, Ke);
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
    return this.get(`/team/devices${he({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${he({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${he({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${he({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${he({ team: t })}`);
  }
  // publishes a sequence or template, by its number, or a profile, by its name, as the library's next version
  publishLibraryItem(t, n, s, a, o = "") {
    return this.post(`/library/items/${encodeURIComponent(t)}/publish`, { reference: n, note: s, description: a, team: o }, Ke);
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
    const a = this.here(`/outputs/${t}${he({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${he({ agent: t })}`));
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
    return je.request("GET", ls + "figures.json");
  }
  voiceFigureUrl(t) {
    return ls + t;
  }
  figureDecoderUrl() {
    return ls + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${he({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${he({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${he({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${he({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${he({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${he({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${he({ skip: t, last: n })}`));
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
    return this.post(this.here("/plugins/preview"), { source: t }, Ke);
  }
  installPlugin(t) {
    return this.post(this.here("/plugins"), { source: t }, Ke);
  }
  previewUpgrade(t) {
    return this.act("plugins", t, "upgrade-preview", {}, Ke);
  }
  upgradePlugin(t, n) {
    return this.act("plugins", t, "upgrade", { ref: n }, Ke);
  }
  pluginLog(t, n = 200) {
    return this.get(this.here(`/plugins/${t}/log${he({ lines: n })}`));
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
    return this.post("/mcp/add", t, Ke);
  }
  mcpRemove(t) {
    return this.post(`/mcp/${Be(t)}/remove`, {});
  }
  mcpCheck() {
    return this.post("/mcp/check", {}, Ke);
  }
  page(t = "", n = "") {
    return `${this.base}/${t ? `?env=${Be(t)}` : ""}${Gn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const Ve = new da({ base: Kn ? "/p" : "" }), Vc = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Ha = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Gc = 6e4, Kc = 4, Yc = 300, Jc = 5e3, nr = /* @__PURE__ */ new Map();
function Jn(e) {
  if (!(e in Ha)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ha[e];
}
function Zc(e) {
  const t = Jn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Jc;
  }
}
const Xc = (e) => e / 2 + Math.random() * e / 2, sr = (e) => [...e.users.values()].pop(), ha = (e) => nr.get(e.place) === e, Qc = () => Math.random() * Yc, fa = () => document.hidden;
function eu(e) {
  const t = Zc(e);
  return e.failures ? Xc(Math.min(Gc, t * 2 ** e.failures)) : Math.max(t, Kc * e.took);
}
function ar(e, t) {
  clearTimeout(e.timer), !(!ha(e) || fa()) && (e.timer = setTimeout(() => tu(e), t));
}
function tu(e) {
  return ha(e) ? e.running ? (e.again = !0, e.running) : (e.running = ou(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const nu = (e) => {
  var t, n;
  return !fa() && (((n = (t = Jn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && sr(e).active() && !ua();
};
async function su(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => Jn(e.key).read(sr(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function au(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Jn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function ou(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      nu(e) && au(e, await su(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ha(e));
  ar(e, eu(e));
}
const ru = () => fa() || nr.forEach((e) => ar(e, Qc()));
document.addEventListener("visibilitychange", ru);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, or = (e) => `${e.table}:${e.id}`, Ua = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", cs = 80;
function za(e) {
  return e.length <= cs ? e : `${e.slice(0, cs + 1).replace(/\s+\S*$/, "") || e.slice(0, cs)}…`;
}
const Va = {
  messages: (e) => za(Ua(e.text)),
  comments: (e) => za(Ua(e.text)),
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
}, iu = (e) => (Va[e.table] ? Va[e.table](e) : e.title || "") || "", lu = ["done", "cancelled"], qs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => lu.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, cu = (e) => qs[e.table] ? qs[e.table](e) : 0, rr = (e) => cu(e) > 0, uu = (e) => !!qs[e], bt = (e) => Ee(e.created_at), ma = (e) => Ee(e.updated_at) || bt(e), du = 60, hu = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - du, fu = (e, t) => e.id > 0 && e.table === t.table && hu(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), pa = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => fu(s, n))), mu = { me: 1, people: [] }, ue = la({
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
  people: mu,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Yt("journal.activity", !0),
  wide: !1,
  sideMini: Yt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ho("journal.activity", () => ue.activity);
Ho("journal.side.mini", () => ue.sideMini);
const pu = 50, ir = 100, gu = { messages: 25 }, He = (e) => gu[e] || pu;
function vu(e, t) {
  if (e !== "messages") return Math.max(t.length - He(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === He(e)) return s;
  return 0;
}
const ht = /* @__PURE__ */ new Set(), ga = I(0), dn = /* @__PURE__ */ new Set(), hn = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new Set(), Fs = /* @__PURE__ */ new Set(), yu = /* @__PURE__ */ new Map(), wu = /* @__PURE__ */ new Map();
let Ft = !1, Wt = null;
const ku = (e, t) => e.id - t.id, bu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, xu = { messages: bu }, lr = (e) => xu[e] || ku;
function cr(e) {
  return ga.value, ht.has(e) || (ht.add(e), ue.booted && (!dn.has(e) || hn.has(e)) && queueMicrotask(() => va([e], !1))), ue.rows[e] || [];
}
function $u(e) {
  const t = ue.rows[e] || [], n = vu(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || uu(e) && !rr(a)), ue.paging.size[e] = He(e), ue.paging.more[e] = !0;
}
const Mu = /* @__PURE__ */ new Set();
function Su() {
  ht.forEach($u), ht.clear(), yu.clear(), wu.clear(), ga.value += 1;
}
be(() => `${Ze.value.env}/${Ze.value.page}/${Ze.value.open ? Ze.value.open.table : ""}`, Su);
be(
  () => ue.booted,
  (e) => e && va(
    [...ht].filter((t) => !dn.has(t)),
    !1
  )
);
const Ws = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !yc(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function ur(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ws(s) && !Ws(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function dr(e, t) {
  dn.add(e), ga.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...ur(n, t.rows), ...pa(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || He(e), ue.paging.more[e] = !t.is_last_page;
}
async function _u(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: He(e) });
  Zn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = pa((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return dr(e, { ...n, rows: [...n.rows, ...a].sort(lr(e)) }), ue.paging.size[e] = He(e), hr.has(e) && await fr(e), ue.rows[e];
}
const Zn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function Eu(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(ma)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: He(e), since: n, after: s });
  if (Zn(e, a.counts), !a.is_last_page) return _u(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = pa(t.filter((i) => !o.has(i.id)), a.rows).concat(ur(t, a.rows));
  return ue.rows[e] = r.sort(lr(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const us = /* @__PURE__ */ new Set();
async function Au(e, t = !1) {
  e.forEach((n) => hn.delete(n)), e.forEach((n) => Fs.add(n));
  try {
    await Lu(e, t);
  } finally {
    e.forEach((n) => Fs.delete(n));
  }
}
async function Cu(e) {
  const t = await Ve.list(e, { limit: He(e) });
  Zn(e, t.counts), dr(e, t);
}
async function Ou(e) {
  Zn(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const hr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function fr(e) {
  const t = (ue.rows[e] || []).filter((a) => Ws(a) && (e !== "plans" || !rr(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Tu = (e, t) => !dn.has(e) || t && (ue.paging.size[e] || He(e)) === He(e) && !Mu.has(e);
async function Iu(e, t) {
  if (!ht.has(e)) return Ou(e);
  const n = await (Tu(e, t) ? Cu(e) : Eu(e));
  return hr.has(e) && await fr(e), n;
}
async function mr() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function Ru() {
  const [e] = await Promise.all([Ve.entries(0, ir), mr()]);
  Pu([...Yt(gr(), []), ...e]);
}
const Bu = (e, t) => Iu(e, t).then(
  () => null,
  () => e
);
async function Lu(e, t) {
  const n = (await Promise.all(e.map((s) => Bu(s, t)))).filter(Boolean);
  if (n.forEach((s) => (rt.add(s), hn.add(s))), t && await Ru(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const pr = 1e3, Nu = 15e3;
let bn = pr;
async function Du() {
  return Wt || (Wt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...rt].some((e) => !us.has(e)) || Ft; ) {
      const e = Ft, t = [...e ? Object.keys(ue.rows) : rt].filter((s) => cn[s] && (ht.has(s) || s in ue.rows)).filter((s) => e || !ht.has(s) || hn.has(s) || !dn.has(s)).filter((s) => !us.has(s)), n = [...rt].filter((s) => us.has(s));
      rt.clear(), n.forEach((s) => rt.add(s)), Ft = !1;
      try {
        await Au(t, e), bn = pr;
      } catch {
        Ft = Ft || e, await new Promise((a) => setTimeout(a, bn)), bn = Math.min(bn * 2, Nu);
      }
    }
  })().finally(() => Wt = null), Wt);
}
function va(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Fs.has(n)).forEach((n) => {
    rt.add(n), t && hn.add(n);
  }), rt.delete("settings") && mr(), Du();
}
const gr = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Pu(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-ir), Vn(gr(), ue.entries.slice(-50));
}
Vc((e) => ue.streamOpen || va([e]));
const Hs = [], ju = 2e3, ot = /* @__PURE__ */ new Map(), qu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Fu = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function $t(e, { first: t = !1 } = {}) {
  t ? Hs.unshift(e) : Hs.push(e), ot.clear();
}
function vr(e, t, n) {
  var a;
  const s = cr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Wu = (e) => cr(e.table).find((t) => t.id === e.id) === e.row, Hu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Uu(e, t) {
  const n = [{ kind: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const s of Hs)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Jt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return zu(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function zu(e) {
  return e.split(Fu).map((t, n) => n % 2 ? t : t.replace(qu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Ga(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Vu(e) {
  const [t, , ...n] = e, s = Ga(t).map((o) => `<th>${Jt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Ga(o).map((r) => `<td>${Jt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function Gu(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${Jt(a)}</li>`).join("")}</${s}>`;
}
const Ka = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function yr(e) {
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
      n.push(`<h${i}>${Jt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Ka(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Vu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let i = s + 1;
      for (; i < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[i]) || /^\s{2,}\S/.test(t[i])); ) i += 1;
      n.push(Gu(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${yr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Ka(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Jt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Ku = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Yu = (e) => e.kind !== "text" && !Ku.test(e.html);
function Ju(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(yr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Yu(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Us(e, t = { env: "" }) {
  const n = Hu(e, t), s = ot.get(n);
  if (ot.delete(n), s && s.reads.every(Wu))
    return ot.set(n, s), s.html;
  const a = [], o = Ju(Uu(e, { ...t, reads: a }));
  return ot.set(n, { html: o, reads: a }), ot.size > ju && ot.delete(ot.keys().next().value), o;
}
const wr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Zt = (e) => String(e || "").replace(wr, (t, n, s, a) => a), Zu = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), xn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Xu = /^Traceback \(most recent call last\):/m, Qu = 8;
function kr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Qu).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function ed(e) {
  const t = [...e.matchAll(Zu)].map((s) => s.index);
  if (xn.lastIndex = 0, !t.length || !xn.test(e)) return null;
  xn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(xn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: kr(n), tail: "" } : null;
}
function td(e) {
  const t = Xu.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: kr([o]), tail: n.slice(a).join(`
`) };
}
$t((e) => {
  const t = Zt(e), n = td(t) || ed(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const nd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, sd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, ad = /[\w\]]\(/, od = /^[\w$.[\]'"]+\s*=\s*[^=]/, rd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, id = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, ld = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, cd = /[[({,]$/, ud = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, dd = /^(\t|\s{2,})\S/, hd = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, fd = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, md = /[{}()[\];=<>$&|*\\@+^~%]/g, br = /^\s*(?:[-*+]|\d+[.)])\s/, pd = /^\s*>/, gd = /^\s*\|/, vd = 0.6, yd = 0.4, wd = 5, kd = 0.03, xr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= wd && t.every((n) => fd.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(md) ?? []).length / e.length < kd;
}, ds = (e) => {
  const t = e.trim();
  return [nd, sd, ad, od, rd, id, ld, cd, ud].some((n) => n.test(t)) || /[;{}]$/.test(t) || dd.test(e) && !br.test(e) && !xr(e);
};
function bd(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || br.test(t[0]) || t.every((o) => pd.test(o) || gd.test(o))) return "text";
  const n = t.filter((o) => !hd.test(o.trim()));
  if (t.length === 1) return !n.length || ds(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(ds).length, a = n.filter((o) => !ds(o) && xr(o)).length;
  return s >= n.length * vd && a <= n.length * yd ? "code" : "text";
}
const zs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", xd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", $d = `${zs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Md = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Sd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", Ya = {
  js: { keywords: zs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: xd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: $d, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: zs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Md, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: Sd, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, _d = {
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
function Ja(e, t, n) {
  return n && e.startsWith(n, t);
}
function Ed(e, t) {
  const n = Ya[_d[t] ?? t] || Ya.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Ja(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && Ja(e, o, n.block[0])) {
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
      r("string", e.slice(o, u + 1)), o = u + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const u = e.slice(o).match(/^<\/?[\w:-]+/);
      r("keyword", u[0]), o += u[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, v = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(s.has(f) ? "keyword" : v ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function Ad(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Ed(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? et(r) : `<span class="tok-${s}">${et(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Cd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Od = 1500, Za = /* @__PURE__ */ new WeakMap();
async function Td(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Cd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Za.get(t)), Za.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Od)
  )));
}
typeof document < "u" && document.addEventListener("click", Td, !0);
const Id = /\n\s*\n/, Rd = /^(```|~~~)\s*(\w+)?\s*$/, Bd = /^\s{4,}\S/, Ld = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Vs = /^\s*(?:[-*+]|\d+[.)])\s/, $r = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Nd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function ya(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Dd(e) {
  const t = ya(e.join(`
`));
  return (Nd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Pd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && $r.test(t) && !Vs.test(t);
}, jd = (e, t) => Vs.test(t) || Vs.test([...e].reverse().find((n) => n.trim()) || "");
function Gs(e, t) {
  const n = t || Dd(e), s = Ad(ya(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function qd(e) {
  const t = e.split(Id).map((r) => ({ paragraph: r, kind: bd(ya(r).split(`
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
      a(), n.push(Gs(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Zt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Fd(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...qd(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Rd);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Gs(t.slice(o + 1, u).map(Zt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Pd(s) ? Ld : Bd;
    if (i.test(t[o]) && !jd(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && $r.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(Gs([...u, ...t.slice(o, l)].map(Zt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
$t((e) => Fd(e));
const Wd = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, Hd = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Ud(e) {
  const t = Wd.exec(e);
  if (t && kt(t[1])) return { at: t.index, length: t[0].length, table: kt(t[1]), id: Number(t[2]), label: t[3] };
  const n = Hd.exec(e), s = n && kt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function zd(e, t, n, s) {
  const a = vr(s, e, t), o = Zt(a ? iu(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${et(un(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
$t(
  (e, t) => {
    const n = Ud(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: zd(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Vd = /\.(png|jpe?g|gif|webp|svg)$/i, Gd = (e) => Vd.test(e), Kd = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Yd = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Jd(e, t) {
  const n = Kd.exec(e), [, s, a, o, r, i] = n || [], l = n && kt(s || o), u = l && vr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${un(l).title} ${u.id} · ${et(i)}`, v = Gd(i) ? `<img class="file-card-image" src="${d}" alt="${et(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(i)}">${v}<span class="file-card-name">${f}</span></a>` };
}
function Zd(e) {
  const t = Yd.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
$t(
  (e, t) => {
    if (t.inline) return null;
    const n = Jd(e, t) || Zd(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Xd = /`([^`\n]+)`/g;
$t((e) => e.replace(Xd, (t, n) => `<code>${n}</code>`));
const Xa = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
$t(
  (e, t) => e.replace(wr, (n, s, a, o) => Xa[s] ? Xa[s](a, o, t) : o)
);
const Qd = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Mr = new RegExp(`\\b(${Yo}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Sr = new RegExp(`\\b(${Yo}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), eh = new RegExp(`<code>((?:${Mr.source}|${Sr.source}))</code>`, "gi"), th = (e) => e.replace(eh, "$1"), nh = (e, t) => `<a class="row-pill" href="#" data-peek="${kt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, sh = (e) => e.replace(Sr, (t, n, s) => s.replace(/\d+/g, (a) => nh(n.replace(/s$/i, ""), a))), ah = (e) => sh(e).replace(
  Mr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${kt(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
$t(
  (e, t) => t.rowNames === !1 ? e : th(e).split(Qd).map((n, s) => s % 2 ? n : ah(n)).join("")
);
const oh = ["innerHTML"], rh = ["innerHTML"], ih = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = R(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Us(s, { env: Ze.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => z(Ct) && z(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, oh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(Ct) && z(Ct)(...o)),
      innerHTML: n.value
    }, null, 8, rh));
  }
}, lt = /* @__PURE__ */ Y(ih, [["__scopeId", "data-v-1a43d211"]]), lh = { class: "fact" }, ch = { class: "fact-label" }, uh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", lh, [
      p("span", ch, x(e.label), 1),
      B(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, dh = /* @__PURE__ */ Y(uh, [["__scopeId", "data-v-3a88ecf8"]]), hh = { class: "list" }, fh = { class: "list-label" }, mh = {
  key: 1,
  class: "list-note"
}, ph = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", hh, [
      (c(!0), h(K, null, se(e.items, (o, r) => (c(), G(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: F(() => [
          p("span", fh, x(o.label), 1),
          o.badge ? (c(), G(Jo, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : A("", !0),
          o.note ? (c(), h("span", mh, x(o.note), 1)) : A("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, gh = /* @__PURE__ */ Y(ph, [["__scopeId", "data-v-ebe2ae0a"]]), vh = { class: "table" }, yh = {
  key: 0,
  class: "table-row empty"
}, wh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", vh, [
      p("div", {
        class: "table-row head",
        style: pe(a.value)
      }, [
        (c(!0), h(K, null, se(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, x(i), 1))), 128))
      ], 4),
      (c(!0), h(K, null, se(e.rows, (i, l) => (c(), G(xt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: Z(["table-row", i.tone, { opens: i.open }]),
        style: pe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: F(() => [
          (c(!0), h(K, null, se(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, x(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", yh, x(e.empty), 1)) : A("", !0)
    ]));
  }
}, kh = /* @__PURE__ */ Y(wh, [["__scopeId", "data-v-9326a52e"]]), bh = { class: "stat-value" }, xh = { class: "stat-label" }, $h = {
  key: 0,
  class: "stat-note"
}, Mh = {
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
    return (s, a) => (c(), G(xt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: F(() => [
        p("span", bh, x(e.value), 1),
        p("span", xh, x(e.label), 1),
        e.note ? (c(), h("span", $h, x(e.note), 1)) : A("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Sh = /* @__PURE__ */ Y(Mh, [["__scopeId", "data-v-ad0db6d6"]]), _h = { class: "code" }, Eh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(ln, {
      value: e.node.type
    }, {
      stack: F(() => [
        B(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        B(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        B(Cn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        B(vc, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        p("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, x(e.node.text), 3)
      ]),
      divider: F(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        B(Sh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        B(dc, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        B(kh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        B(gh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: F(() => [
        B(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: F(() => [
        B(dh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        B(Jo, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        p("pre", _h, [
          p("code", null, x(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, x(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), _r = /* @__PURE__ */ Y(Eh, [["__scopeId", "data-v-cbdcf540"]]), Ah = { class: "dashboard" }, Ch = { class: "trail" }, Oh = ["onClick"], Th = {
  key: 0,
  class: "gone",
  role: "status"
}, Ih = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (v) => v in (n.document.pages || {}), o = I(!!n.page && !a(n.page)), r = I(n.page && !o.value ? [n.page] : []), i = R(() => r.value.at(-1) || n.document.start), l = R(() => (n.document.pages || {})[i.value] || null), u = (v) => ((n.document.pages || {})[v] || {}).title || v, d = (v) => {
      o.value = !1, r.value = [...r.value, v];
    }, f = (v) => {
      o.value = !1, r.value = r.value.slice(0, v);
    };
    return be(
      () => n.document.start,
      () => r.value = []
    ), (v, w) => (c(), h("div", Ah, [
      e.document.broken ? (c(), G(Bn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          le(x(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(Bn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          le(x(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(K, { key: 2 }, [
        p("nav", Ch, [
          p("button", {
            type: "button",
            class: Z(["step", { current: !r.value.length }]),
            onClick: w[0] || (w[0] = (E) => f(0))
          }, x(u(e.document.start)), 3),
          (c(!0), h(K, null, se(r.value, (E, M) => (c(), h(K, {
            key: `${M}-${E}`
          }, [
            w[2] || (w[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Z(["step", { current: M === r.value.length - 1 }]),
              onClick: (S) => f(M + 1)
            }, x(u(E)), 11, Oh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Th, "What you opened is no longer in this dashboard. Here is its start page.")) : A("", !0),
        B(Bt, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              B(_r, {
                node: l.value.view,
                onOpen: d,
                onFile: w[1] || (w[1] = (E) => s("file", E))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : A("", !0)
    ]));
  }
}, Jk = /* @__PURE__ */ Y(Ih, [["__scopeId", "data-v-fbe83734"]]);
function Rh(e, t, n, s = () => window) {
  Fe(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Re(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Bh = (e, t = () => !0) => Rh("keydown", (n) => n.key === "Escape" && t() && e());
function Er(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = I(!1), a = R(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Bh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Lh = 80, Et = la([]);
function Ar(e) {
  const t = Symbol("layer"), n = () => Et.includes(t) && Et.splice(Et.indexOf(t), 1);
  return be(
    e,
    (s) => {
      s && !Et.includes(t) && Et.push(t), s || n();
    },
    { immediate: !0 }
  ), Re(n), R(() => Lh + Math.max(0, Et.indexOf(t)));
}
let Cr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Cr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Nh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Dh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Nh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Fe(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Cr, document.addEventListener("keydown", a), Lt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Re(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Ph = ["aria-modal", "aria-label", "aria-labelledby"], jh = {
  key: 0,
  class: "dialog-head"
}, qh = ["id", "tabindex"], Fh = {
  key: 1,
  class: "dialog-foot"
}, Wh = 500, Hh = 400, Uh = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Er(s, n), i = Ar(a), l = I(null), u = I(null), d = I(null), f = Po(), v = I(!1), w = Date.now();
    n.modal && Dh(u, () => s("escape"), d);
    function E() {
      if (!n.modal) return n.closable && o();
      v.value = !0, setTimeout(() => v.value = !1, Hh);
    }
    function M(j) {
      !n.modal || Date.now() - w >= Wh || ![" ", "Enter"].includes(j.key) || (j.preventDefault(), j.stopPropagation());
    }
    const S = () => l.value && (l.value.scrollTop = l.value.scrollHeight), C = new MutationObserver(S);
    return be(l, (j) => {
      C.disconnect(), j && n.follow && (C.observe(j, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Re(() => C.disconnect()), (j, V) => (c(), G(ca, { to: "body" }, [
      B(Bt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: F(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: pe({ zIndex: z(i) }),
            onClick: xe(E, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: v.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(f) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? A("", !0) : (c(), h("header", jh, [
                p("h3", {
                  id: z(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, x(e.title), 9, qh),
                e.closable ? (c(), G(Yn, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : A("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: l,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                me(j.$slots, "default", {}, void 0, !0)
              ], 2),
              j.$slots.foot ? (c(), h("footer", Fh, [
                me(j.$slots, "foot", {}, void 0, !0)
              ])) : A("", !0)
            ], 42, Ph)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, zh = /* @__PURE__ */ Y(Uh, [["__scopeId", "data-v-6d1ecd98"]]), at = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Vh = 6;
function wa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Gh = (e) => {
  const t = wa(e, at.lineChars), n = Math.max(at.minWidth, Math.max(...t.map((s) => s.length)) * at.charWidth + at.padX * 2);
  return { name: e, lines: t, line: at.line, padY: at.padY, width: n, height: t.length * at.line + at.padY * 2 };
};
function Kh(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function Yh(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Jh(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const f = i(d).map((v) => l.get(v));
      return f.length ? f.reduce((v, w) => v + w, 0) / f.length : l.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < Vh; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((v) => v[i ? 1 : 0] === f).map((v) => v[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function Zh(e, t) {
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
function Xh(e) {
  const t = [...new Set(e.flatMap(([L, y]) => [L, y]))], n = new Set(e.map(([, L]) => L)), s = t.filter((L) => !n.has(L)), a = Kh(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((L, y) => !a.has(y)), r = Yh(t, o), i = Jh(t, o, r), l = new Map(t.map((L) => [L, Gh(L)])), u = i.map((L) => L.reduce((y, _) => y + l.get(_).width, 0) + Pe.across * (L.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = ef(e, r, i.length), v = /* @__PURE__ */ new Map();
  let w = Pe.margin;
  i.forEach((L, y) => {
    let _ = (d - u[y]) / 2;
    const k = Math.max(...L.map((O) => l.get(O).height));
    L.forEach((O) => {
      const g = l.get(O);
      v.set(O, { ...g, x: _, y: w + (k - g.height) / 2 }), _ += g.width + Pe.across;
    }), w += k + (f[y] ?? Pe.down);
  });
  const E = e.map(([L, y, _], k) => ({ from: L, to: y, label: _ || "", back: a.has(k) || r.get(y) <= r.get(L) }));
  Zh(E, v);
  const M = E.map((L) => tf(L, v.get(L.from), v.get(L.to))), S = [...v.values()], C = of(M, S), j = Math.max(w - Pe.down, ...C.filter((L) => L.label).map((L) => L.label.y + L.label.height));
  return { width: Math.max(d - Pe.margin, ...C.filter((L) => L.label).map((L) => L.label.x + L.label.width)) + Pe.margin, height: j + Pe.margin, nodes: S, arrows: C };
}
const Qh = (e) => e ? wa(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function ef(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += Qh(r) + Pe.labelSpace);
  }), s.map((a) => Math.max(Pe.down, a));
}
function tf(e, t, n) {
  const s = e.label ? wa(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((v) => v.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const nf = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, sf = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], af = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function of(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = nf(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = af.flatMap((l) => sf.map((u) => a(u, l))).find((l) => !n.some((u) => Qa(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => Qa(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const Qa = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, rf = { class: "flowchart-tools" }, lf = ["width", "height", "viewBox", "aria-label"], cf = ["d"], uf = ["x", "y", "width", "height"], df = ["x", "y"], hf = ["x", "dy"], ff = {
  key: 0,
  class: "flowchart-label"
}, mf = ["x", "y", "width", "height"], pf = ["x", "y"], gf = ["x", "dy"], vf = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => Xh(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = I(null), i = I({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var C;
      const M = (C = r.value) == null ? void 0 : C.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const S = Math.min(M.width / a.value.width, M.height / a.value.height, 1.5);
      i.value = { zoom: S, x: (M.width - a.value.width * S) / 2, y: (M.height - a.value.height * S) / 2 };
    }
    function d(M, S, C) {
      const { zoom: j, x: V, y: L } = i.value, y = Math.min(o.most, Math.max(o.least, j * M));
      i.value = { zoom: y, x: S - (S - V) * y / j, y: C - (C - L) * y / j };
    }
    function f(M) {
      const S = r.value.getBoundingClientRect();
      d(M, S.width / 2, S.height / 2);
    }
    function v(M) {
      const S = r.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? d(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - S.left, M.clientY - S.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function w(M) {
      var S, C, j;
      M.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), l = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (j = (C = r.value).setPointerCapture) == null || j.call(C, M.pointerId);
    }
    function E(M) {
      l && (i.value = { ...i.value, x: M.clientX - l.x, y: M.clientY - l.y });
    }
    return Fe(u), (M, S) => (c(), G(zh, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (C) => s("close"))
    }, {
      default: F(() => [
        p("div", rf, [
          B(ve, {
            small: "",
            onClick: S[0] || (S[0] = (C) => f(o.step))
          }, {
            default: F(() => [...S[5] || (S[5] = [
              le("Zoom in", -1)
            ])]),
            _: 1
          }),
          B(ve, {
            small: "",
            onClick: S[1] || (S[1] = (C) => f(1 / o.step))
          }, {
            default: F(() => [...S[6] || (S[6] = [
              le("Zoom out", -1)
            ])]),
            _: 1
          }),
          B(ve, {
            small: "",
            onClick: u
          }, {
            default: F(() => [...S[7] || (S[7] = [
              le("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: xe(v, ["prevent"]),
          onPointerdown: w,
          onPointermove: E,
          onPointerup: S[2] || (S[2] = (C) => Na(l) ? l.value = null : l = null),
          onPointercancel: S[3] || (S[3] = (C) => Na(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: pe({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            S[8] || (S[8] = p("defs", null, [
              p("marker", {
                id: "flowchart-head",
                viewBox: "0 0 10 10",
                refX: "9",
                refY: "5",
                markerWidth: "7",
                markerHeight: "7",
                orient: "auto"
              }, [
                p("path", { d: "M0 0L10 5L0 10z" })
              ])
            ], -1)),
            (c(!0), h(K, null, se(a.value.arrows, (C, j) => (c(), h("path", {
              key: `arrow-${j}`,
              class: "flowchart-arrow",
              d: C.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, cf))), 128)),
            (c(!0), h(K, null, se(a.value.nodes, (C) => (c(), h("g", {
              key: C.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: C.x,
                y: C.y,
                width: C.width,
                height: C.height,
                rx: "8"
              }, null, 8, uf),
              p("text", {
                x: C.x + C.width / 2,
                y: C.y + C.padY + C.line / 2
              }, [
                (c(!0), h(K, null, se(C.lines, (j, V) => (c(), h("tspan", {
                  key: V,
                  x: C.x + C.width / 2,
                  dy: V ? C.line : 0
                }, x(j), 9, hf))), 128))
              ], 8, df)
            ]))), 128)),
            (c(!0), h(K, null, se(a.value.arrows, (C, j) => (c(), h(K, {
              key: `label-${j}`
            }, [
              C.label ? (c(), h("g", ff, [
                p("rect", {
                  x: C.label.x,
                  y: C.label.y,
                  width: C.label.width,
                  height: C.label.height,
                  rx: "4"
                }, null, 8, mf),
                p("text", {
                  x: C.label.x + C.label.width / 2,
                  y: C.label.y + C.label.pad + C.label.line / 2
                }, [
                  (c(!0), h(K, null, se(C.label.lines, (V, L) => (c(), h("tspan", {
                    key: L,
                    x: C.label.x + C.label.width / 2,
                    dy: L ? C.label.line : 0
                  }, x(V), 9, gf))), 128))
                ], 8, pf)
              ])) : A("", !0)
            ], 64))), 128))
          ], 12, lf))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, yf = /* @__PURE__ */ Y(vf, [["__scopeId", "data-v-51d24cfe"]]), eo = {
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
  worker: '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>',
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
}, wf = ["innerHTML"], kf = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = R(() => eo[t.name] || eo.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, wf));
  }
}, nt = /* @__PURE__ */ Y(kf, [["__scopeId", "data-v-beb5935c"]]), bf = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      B(nt, { name: "fold" })
    ], 2));
  }
}, Xt = /* @__PURE__ */ Y(bf, [["__scopeId", "data-v-d03899bb"]]), xf = ["data-tip", "aria-label"], $f = {
  key: 0,
  class: "mact-word"
}, Mf = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      B(nt, { name: "open" }),
      e.open ? (c(), h("span", $f, x(e.label), 1)) : A("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, xf));
  }
}, Or = /* @__PURE__ */ Y(Mf, [["__scopeId", "data-v-3b292e09"]]), Sf = 120, hs = 280, _f = 160, Ef = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Af = ["leaving", "resizing", "entering"];
function Tr(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Cf(e) {
  const t = Af.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = Tr(e);
  return e.classList.add(...t), n;
}
function Ir(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = I(t()), a = I("");
  let o = 0;
  const r = (u, d) => Object.assign(u.style, { width: `${d.width}px`, height: `${d.height}px` }), i = (u) => Object.assign(u.style, { width: "", height: "", transition: "" });
  async function l(u) {
    const d = e.value, f = ++o;
    if (!d || !d.offsetWidth || Ef()) {
      s.value = u;
      return;
    }
    const v = Tr(d);
    if (r(d, v), a.value = "leaving", await n(Sf), f !== o) return;
    s.value = u, a.value = "resizing", await Lt(), i(d);
    const w = Cf(d);
    r(d, v), d.offsetWidth, d.style.transition = `width ${hs}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${hs}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(d, w), await n(hs), f === o && (i(d), a.value = "entering", await n(_f), f === o && (a.value = ""));
  }
  return be(t, (u) => l(u)), Nt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Of = { class: "growing-card-top" }, Tf = ["aria-expanded"], If = { class: "growing-card-avatar" }, Rf = { class: "growing-card-title" }, Bf = { class: "growing-card-more" }, Lf = { class: "growing-card-body" }, Nf = {
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
    const n = e, s = t, a = I(!1), o = I(null), { folded: r, phase: i } = Ir(o, () => !a.value), l = R(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = R(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Of, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (v) => a.value = !a.value)
        }, [
          p("span", If, [
            e.bad ? (c(), G(nt, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(K, { key: 1 }, [
              le(x(l.value), 1)
            ], 64)) : (c(), G(ye, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Rf, x(e.title), 1),
          B(Xt, { open: a.value }, null, 8, ["open"])
        ], 8, Tf),
        e.action ? (c(), G(Or, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (v) => s("act"))
        }, null, 8, ["label", "open"])) : A("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (v) => s("comment"))
        }, [
          B(ye, {
            name: "bubble",
            size: 13
          })
        ])) : A("", !0)
      ]),
      p("div", Bf, [
        p("div", Lf, [
          (c(!0), h(K, null, se(u.value, (v, w) => (c(), h("p", {
            key: w,
            class: "growing-card-text"
          }, x(v), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Df = /* @__PURE__ */ Y(Nf, [["__scopeId", "data-v-08411e3a"]]), Pf = ["title", "aria-label"], jf = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, qf = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Ff = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = R(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: Z(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", jf, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", qf)) : A("", !0)
      ]))
    ], 10, Pf));
  }
}, Wf = /* @__PURE__ */ Y(Ff, [["__scopeId", "data-v-6dc92808"]]);
function Hf(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function Uf(e, t = Date.now()) {
  const n = Hf(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
function Rr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function to(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const fs = (e) => String(e).padStart(2, "0");
function zf(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${fs(t % 60)}s` : `${Math.floor(t / 3600)}h ${fs(Math.floor(t % 3600 / 60))}m ${fs(t % 60)}s`;
}
const Vf = "img,pre,table";
function Gf(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Kf(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Yf(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Vf)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Gf(Kf(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function Jf(e, t) {
  let n = null;
  const s = () => e.value && Yf(e.value);
  Fe(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([r]) => {
      r.contentRect.width !== a && (a = r.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Re(() => n == null ? void 0 : n.disconnect()), be(t, s, { flush: "post" });
}
const Zf = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Xf(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Qf = ["data-incoming", "data-ref"], e1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], t1 = { class: "message-body" }, n1 = ["title"], s1 = ["innerHTML"], a1 = ["title"], o1 = ["innerHTML"], r1 = {
  class: "message-faces",
  "data-message-faces": ""
}, i1 = ["title", "data-face", "onClick"], l1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, c1 = ["title", "data-reaction", "onClick"], u1 = {
  key: 0,
  class: "message-reaction-count"
}, d1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, h1 = ["href", "title"], f1 = ["src", "alt"], m1 = ["href"], p1 = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, g1 = {
  key: 1,
  "data-message-links-rows": ""
}, v1 = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, y1 = ["data-sent-worker", "title", "onClick"], w1 = { class: "message-foot" }, k1 = { class: "message-time" }, b1 = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, x1 = 140, $1 = 2, M1 = 1500, S1 = "An earlier message", _1 = "about", E1 = "sent_to", A1 = 3, C1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var de;
    const n = e, s = t, a = I(!1), o = I(null), r = R(() => ["user", "comment"].includes(n.message.type)), i = R(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), J = kt(Q);
      return J ? { ref: `${J}:${ee}`, label: `${un(J).title.toLowerCase()} ${ee}` } : null;
    }), l = R(() => n.message.worker_id ?? null), u = I(!1), d = R(() => l.value !== null && ((n.message.text ?? "").length > x1 || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > $1)), f = R(() => r.value && !n.message.read_at && !n.message.local);
    async function v() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, M1);
    }
    const w = R(() => Us(n.message.text ?? "", { env: "" })), E = R(() => JSON.parse(n.message.flowchart_edges || "[]")), M = I(!1), S = R(() => Us(n.quote || S1, { env: "" }));
    function C() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : Xe(`messages:${n.message.parent_id}`);
    }
    Jf(o, () => `${n.message.text} ${n.quote}`);
    const j = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, V = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, L = R(() => JSON.parse(n.message.captions || "{}")), y = R(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: V(Q), isImage: j.test(Q), title: L.value[Q] || Q }))), _ = R(() => Rr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), k = Ce(Te, null), O = I([]), g = I([]), $ = I(!1), b = R(() => `Linked: ${O.value.join(", ")}`), m = R(() => O.value.length >= A1), N = R(() => `${O.value.length} linked ${O.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function D() {
      if (!r.value || !(k != null && k.read) || n.message.local) return;
      const Q = await k.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      O.value = ee.filter((J) => J.link_type === _1).map((J) => `${J.target_model} ${J.target_id}`), g.value = ee.filter((J) => J.link_type === E1).map((J) => J.target_id);
    }
    D(), (de = k == null ? void 0 : k.follow) == null || de.call(k, ["link.*"], D);
    const W = I(!1), re = R(() => Xf(n.message.reactions));
    function ce(Q) {
      W.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      B(Df, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (J) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Qf)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", t1, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: i.value }]),
          onClick: ee[6] || (ee[6] = (...J) => z(Ct) && z(Ct)(...J))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: ee[1] || (ee[1] = xe((J) => z(Xe)(i.value.ref), ["stop"]))
          }, [
            B(ye, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + x(i.value.label), 1)
          ], 8, n1)) : A("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: xe(C, ["stop"]),
            innerHTML: S.value
          }, null, 8, s1)) : A("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: ee[2] || (ee[2] = xe((J) => z(Xe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + x(l.value), 9, a1)) : A("", !0),
          p("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: w.value
          }, null, 10, o1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: ee[3] || (ee[3] = xe((J) => u.value = !u.value, ["stop"]))
          }, x(u.value ? "Show less" : "Show more"), 1)) : A("", !0),
          E.value.length ? (c(), h(K, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: ee[4] || (ee[4] = (J) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (c(), G(yf, {
              key: 0,
              title: e.message.text,
              edges: E.value,
              onClose: ee[5] || (ee[5] = (J) => M.value = !1)
            }, null, 8, ["title", "edges"])) : A("", !0)
          ], 64)) : A("", !0)
        ], 2),
        p("div", {
          class: Z(["message-tools", { picking: W.value }]),
          "data-message-tools": ""
        }, [
          W.value ? (c(), h(K, { key: 0 }, [
            p("div", r1, [
              (c(!0), h(K, null, se(z(Zf), (J) => (c(), h("button", {
                key: J,
                type: "button",
                class: "message-face",
                title: `React ${J}`,
                "data-face": J,
                onClick: (Le) => ce(J)
              }, x(J), 9, i1))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: ee[7] || (ee[7] = (J) => W.value = !1)
            }, [
              B(ye, {
                name: "close",
                size: 11
              })
            ])
          ], 64)) : (c(), h(K, { key: 1 }, [
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "react",
              title: "React to this",
              onClick: ee[8] || (ee[8] = (J) => W.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: ee[9] || (ee[9] = (J) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: v
            }, x(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: ee[10] || (ee[10] = (J) => s("delete", e.message))
            }, "Delete")) : A("", !0)
          ], 64))
        ], 2)
      ]),
      re.value.length ? (c(), h("div", l1, [
        (c(!0), h(K, null, se(re.value, (J) => (c(), h("button", {
          key: J.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: J.mine }]),
          title: J.title,
          "data-reaction": J.emoji,
          onClick: (Le) => s("react", e.message, J.emoji)
        }, [
          le(x(J.emoji) + " ", 1),
          J.count > 1 ? (c(), h("span", u1, x(J.count), 1)) : A("", !0)
        ], 10, c1))), 128))
      ])) : A("", !0),
      y.value.length ? (c(), h("div", d1, [
        (c(!0), h(K, null, se(y.value, (J) => (c(), h(K, {
          key: J.name
        }, [
          J.isImage ? (c(), h("a", {
            key: 0,
            href: J.address,
            target: "_blank",
            class: "message-image",
            title: J.title
          }, [
            p("img", {
              src: J.address,
              alt: J.name,
              "data-figure-picture": ""
            }, null, 8, f1)
          ], 8, h1)) : (c(), h("a", {
            key: 1,
            href: J.address,
            target: "_blank",
            class: "message-file"
          }, x(J.name), 9, m1))
        ], 64))), 128))
      ])) : A("", !0),
      O.value.length ? (c(), h("div", p1, [
        B(nt, {
          class: "message-links-icon",
          name: "linked"
        }),
        m.value && !$.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (J) => $.value = !0)
        }, x(N.value), 1)) : (c(), h("span", g1, [
          B(lt, {
            text: b.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : A("", !0),
      g.value.length ? (c(), h("div", v1, [
        B(ye, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, se(g.value, (J) => (c(), h("button", {
          key: J,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": J,
          title: `Open worker ${J}`,
          onClick: xe((Le) => z(Xe)(`agents:${J}`), ["stop"])
        }, "Also sent to worker " + x(J), 9, y1))), 128))
      ])) : A("", !0),
      p("div", w1, [
        p("time", k1, x(_.value), 1),
        Number.isInteger(e.message.id) ? (c(), h("span", b1, "message " + x(e.message.id), 1)) : A("", !0),
        r.value ? (c(), G(Wf, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : A("", !0)
      ])
    ], 8, e1));
  }
}, Zk = /* @__PURE__ */ Y(C1, [["__scopeId", "data-v-817edd99"]]), O1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = Fi("SkeletonParts", !0);
      return c(!0), h(K, null, se(e.parts, (l, u) => (c(), h(K, { key: u }, [
        (c(!0), h(K, null, se(l.count, (d) => (c(), G(ln, {
          key: d,
          value: l.shape
        }, {
          line: F(() => [
            p("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: pe({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: F(() => [
            p("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: pe({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: F(() => [
            p("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: pe({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: F(() => [...r[0] || (r[0] = [
            p("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: F(() => [
            p("div", {
              class: "skeleton-row",
              style: pe(s(l))
            }, [
              B(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: F(() => [
            p("div", {
              class: "skeleton-stack",
              style: pe(s(l))
            }, [
              B(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: F(() => [
            p("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: pe(s(l))
            }, [
              B(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: F(() => [
            p("div", {
              class: "skeleton-grid",
              style: pe(a(l))
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
}), T1 = /* @__PURE__ */ Y(O1, [["__scopeId", "data-v-576c95e1"]]), I1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, R1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", I1, [
      B(T1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Br = /* @__PURE__ */ Y(R1, [["__scopeId", "data-v-52f66b64"]]), Dn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ms = 200, Lr = (e) => {
  var t;
  return ((t = Dn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Dn[0].key;
}, Xk = (e) => {
  var t;
  return ((t = Dn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, B1 = ["aria-label"], L1 = 300, no = 400, N1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ms } },
  setup(e) {
    const t = e, n = R(() => Lr(t.value)), s = R(() => n.value < ms ? [1, 0.25, 0.25] : n.value === ms ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= no, high: n.value >= L1 && n.value < no }]),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-label": `priority ${e.value}`
    }, [
      p("path", {
        d: "M4.5 13l3.5-2.25L11.5 13",
        style: pe({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: pe({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: pe({ opacity: s.value[2] })
      }, null, 4)
    ], 10, B1));
  }
}, Qk = /* @__PURE__ */ Y(N1, [["__scopeId", "data-v-b10e610f"]]), D1 = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, so = (e) => D1[e.card.state] || "idle", P1 = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), ao = { working: 0, waiting: 1, idle: 2, stopped: 3 }, oo = (e, t) => ao[so(e)] - ao[so(t)], ro = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, eb = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => oo(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || P1(s, a)) : [...e].sort((s, a) => oo(s, a) || (ro[t] || ro.state)(s, a)), j1 = ["aria-checked", "aria-haspopup", "onClick"], q1 = {
  key: 0,
  class: "segmented-dot"
}, F1 = {
  key: 1,
  class: "segmented-count"
}, W1 = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = Po();
    return (a, o) => {
      const r = Wi("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(K, null, se(e.options, (i) => dt((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Z(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", q1)) : A("", !0),
          le(" " + x(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", F1, x(i.count), 1)) : A("", !0)
        ], 10, j1)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Nr = /* @__PURE__ */ Y(W1, [["__scopeId", "data-v-ca953072"]]), H1 = { class: "form-field" }, U1 = { class: "form-field-head" }, z1 = ["for"], V1 = {
  key: 0,
  class: "form-field-aside"
}, G1 = {
  key: 0,
  class: "form-field-help"
}, K1 = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", H1, [
      p("div", U1, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, x(e.label), 9, z1),
        t.$slots.aside ? (c(), h("span", V1, [
          me(t.$slots, "aside", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      me(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", G1, x(e.help), 1)) : A("", !0)
    ]));
  }
}, tb = /* @__PURE__ */ Y(K1, [["__scopeId", "data-v-dd7cdcff"]]), Y1 = { class: "list-row" }, J1 = {
  key: 0,
  class: "list-row-kind"
}, Z1 = { class: "list-row-main" }, X1 = {
  key: 0,
  class: "list-row-title"
}, Q1 = { class: "list-row-body" }, em = {
  key: 1,
  class: "list-row-end"
}, tm = {
  key: 1,
  class: "list-row-text"
}, nm = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", Y1, [
      e.kind ? (c(), h("span", J1, x(e.kind), 1)) : A("", !0),
      p("div", Z1, [
        e.title ? (c(), h("span", X1, x(e.title), 1)) : A("", !0),
        p("div", Q1, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", em, [
          me(t.$slots, "end", {}, void 0, !0)
        ])) : A("", !0)
      ]),
      e.text ? (c(), h("span", tm, x(e.text), 1)) : A("", !0)
    ]));
  }
}, nb = /* @__PURE__ */ Y(nm, [["__scopeId", "data-v-63155fba"]]), sm = {
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
}, am = { claude: "Claude Code", codex: "Codex" }, om = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, rm = {
  key: 1,
  class: "menu-item-text"
}, im = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", om, x(e.checked ? "✓" : ""), 1)) : A("", !0),
      e.description ? (c(), h("span", rm, [
        p("span", null, [
          me(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, x(e.description), 1)
      ])) : me(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, It = /* @__PURE__ */ Y(im, [["__scopeId", "data-v-fec99974"]]), lm = (e, t, n) => Math.max(t, Math.min(n, e)), cm = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Dr = /* @__PURE__ */ new WeakMap(), um = (e, t) => Dr.set(e, t);
function dm(e, t) {
  for (let n = t; n; n = Dr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function hm(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !dm(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Re(() => window.removeEventListener("click", n));
}
const At = 8, fm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = I(null), o = (m) => m ? `${m}px` : void 0, r = R(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = I({ w: 0, h: 0 }), l = I(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), f = (m) => {
      const N = m.closest(".pane, .float-window");
      return N ? d(N.getBoundingClientRect()) : u();
    }, v = (m, N) => `${Math.max(0, m ? Math.min(m, N) : N)}px`;
    function w(m, N) {
      return {
        below: m.bottom - N.bottom - s.gap - At,
        above: N.top - m.top - s.gap - At,
        across: m.right - m.left - 2 * At
      };
    }
    function E(m) {
      const N = f(s.anchor), D = w(N, m);
      return i.value.w <= D.across && i.value.h <= Math.max(D.below, D.above) ? N : u();
    }
    const M = R(() => {
      if (!l.value) return r.value;
      const m = l.value, N = E(m), D = w(N, m), { w: W, h: re } = i.value, ce = s.align === "auto" ? m.left + m.right > N.left + N.right : s.align === "right", de = lm(ce ? m.right - W : m.left, N.left + At, Math.max(N.left + At, N.right - W - At)), ee = re > D.below && D.above > D.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: v(s.maxHeight, D.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: v(s.maxHeight, D.below) };
      return { ...r.value, ...ee, left: `${de}px`, maxWidth: v(s.maxWidth, D.across) };
    }), S = n, C = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function j(m) {
      const N = C(), D = N.indexOf(document.activeElement);
      N[(D + m + N.length) % N.length].focus();
    }
    const V = { ArrowDown: () => j(1), ArrowUp: () => j(-1), Escape: () => S("close") }, L = (m) => V[m.key] && (m.preventDefault(), V[m.key]()), y = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let _ = 0;
    const k = new ResizeObserver(() => {
      cancelAnimationFrame(_), _ = requestAnimationFrame(y);
    });
    hm(a, (m) => s.anchor && !s.anchor.contains(m.target) && S("close"));
    const O = (m, N) => ["top", "left", "right", "bottom"].some((D) => Math.abs(m[D] - N[D]) > 1), g = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let $ = 0;
    function b() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || g(m)) return S("close");
        O(m, l.value) && (l.value = m);
      }
      $ = requestAnimationFrame(b);
    }
    return Fe(() => {
      s.anchor && a.value && um(a.value, s.anchor), y(), a.value && k.observe(a.value), !s.plain && C()[0] && C()[0].focus(), b();
    }), Re(() => {
      k.disconnect(), cancelAnimationFrame($), cancelAnimationFrame(_);
    }), t({ element: a }), (m, N) => (c(), G(ca, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", tt({
        ref_key: "panel",
        ref: a
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: L
      }), [
        me(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ka = /* @__PURE__ */ Y(fm, [["__scopeId", "data-v-3d203970"]]), mm = ["aria-expanded"], pm = { class: "drop-label" }, gm = ["value"], vm = {
  key: 1,
  class: "drop-lead"
}, ym = { class: "drop-item-text" }, wm = {
  key: 2,
  class: "drop-note"
}, km = {
  key: 1,
  class: "drop-none"
}, bm = {
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
    const n = e, s = t, a = I(!1), o = I(null), r = I(""), i = R(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function l(u) {
      a.value = !1, s("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      p("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: d[0] || (d[0] = (f) => a.value = !a.value)
      }, [
        e.icon ? (c(), G(ye, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : A("", !0),
        p("span", pm, x(e.label), 1),
        B(ye, {
          name: "down",
          size: 11
        })
      ], 10, mm),
      a.value ? (c(), G(ka, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => a.value = !1)
      }, {
        default: F(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, gm)) : A("", !0),
          (c(!0), h(K, null, se(i.value, (f) => (c(), G(It, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (v) => l(f)
          }, {
            default: F(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : A("", !0),
              f.lead ? (c(), h("span", vm, x(f.lead), 1)) : A("", !0),
              p("span", ym, x(f.label), 1),
              f.note ? (c(), h("span", wm, x(f.note), 1)) : A("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? A("", !0) : (c(), h("p", km, x(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : A("", !0)
    ], 2));
  }
}, xm = /* @__PURE__ */ Y(bm, [["__scopeId", "data-v-29dfcce5"]]), sb = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = R(() => [
      ...sm[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = R(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (r, i) => (c(), G(xm, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${z(am)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, $m = ["aria-label"], Mm = { class: "head" }, Sm = { class: "names" }, _m = { class: "body" }, Em = {
  key: 0,
  class: "foot"
}, Am = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Er(s, n), i = Ar(a);
    return (l, u) => (c(), G(ca, { to: "body" }, [
      B(Bt, {
        name: "side",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: F(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: pe({ "--depth": e.depth, zIndex: z(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = xe((...d) => z(o) && z(o)(...d), ["self"]))
          }, [
            p("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                p("header", Mm, [
                  p("div", Sm, [
                    p("h2", null, x(e.title), 1),
                    e.abstract ? (c(), G(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : A("", !0)
                  ]),
                  me(l.$slots, "actions", {}, void 0, !0),
                  B(Yn, {
                    title: e.closeLabel,
                    onClick: z(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", _m, [
                  me(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Em, [
                  me(l.$slots, "foot", {}, void 0, !0)
                ])) : A("", !0)
              ], 64)) : me(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, $m)
          ], 6)) : A("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, ab = /* @__PURE__ */ Y(Am, [["__scopeId", "data-v-c9a3f43a"]]), Ks = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Cm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Hn(), n = R(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => dt((c(), h("textarea", tt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [z(Ks), z(t).value]
    ]);
  }
}), ob = /* @__PURE__ */ Y(Cm, [["__scopeId", "data-v-e130a5b9"]]), Om = {
  key: 1,
  class: "text-field-label"
}, Tm = {
  key: 2,
  class: "text-field-end"
}, Im = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ls({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Bs(e, "modelValue"), s = Hn(), a = "onUpdate:modelValue" in (((d = Hi()) == null ? void 0 : d.vnode.props) || {}), o = R(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = R(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = R(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, v) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, z(s).class]),
      style: pe(z(s).style)
    }, [
      e.icon ? (c(), G(ye, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : A("", !0),
      e.label ? (c(), h("span", Om, x(e.label), 1)) : A("", !0),
      dt(p("input", tt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(Ks), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Tm, [
        me(f.$slots, "end", {}, void 0, !0)
      ])) : A("", !0)
    ], 6)) : dt((c(), h("input", tt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [z(Ks), o.value]
    ]);
  }
}), rb = /* @__PURE__ */ Y(Im, [["__scopeId", "data-v-d9c38ca8"]]), Rm = 150;
function Pr(e, t, n = Rm, s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
const io = (e) => e.page * e.size < e.total;
function Bm(e, t, { incremental: n = !1 } = {}) {
  const s = zn(), a = I([]), o = I(""), r = I(!1), i = performance.now(), l = I(!1), u = I(""), d = I(null);
  async function f(V) {
    const L = E, y = await s.read(`${e} --before-id ${V + 1} --limit 1`);
    if (L !== E) return;
    if (!y.ok) return S();
    const _ = y.value.rows.find((k) => k.id === V);
    a.value = _ ? a.value.map((k) => k.id === V ? _ : k) : a.value.filter((k) => k.id !== V);
  }
  async function v(V) {
    if (n && String((V == null ? void 0 : V.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== V.row_id));
    if (n && (V != null && V.row_id) && !String(V.event ?? "").endsWith(".create") && a.value.some((g) => g.id === V.row_id)) return f(V.row_id);
    if (!(n && a.value.length && String((V == null ? void 0 : V.event) ?? "").endsWith(".create"))) return S();
    const y = Math.max(...a.value.map((g) => g.id)), _ = E, k = await s.read(`${e} --after-id ${y}`);
    if (_ !== E) return;
    if (!k.ok) return S();
    const O = new Set(a.value.map((g) => g.id));
    a.value = [...k.value.rows.filter((g) => !O.has(g.id)), ...a.value];
  }
  async function w() {
    if (!a.value.length) return !1;
    const V = E, L = Math.min(...a.value.map((k) => k.id)), y = await s.read(`${e} --before-id ${L}`);
    if (V !== E) return !1;
    if (!y.ok || !y.value.rows.length) return l.value = !1;
    l.value = io(y.value);
    const _ = new Set(a.value.map((k) => k.id));
    return a.value = [...a.value, ...y.value.rows.filter((k) => !_.has(k.id))], !0;
  }
  let E = 0;
  async function M(V) {
    const L = ++E, y = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (L !== E) return;
    const _ = y.ok ? s.shared ? [y.value] : y.value.rows : [];
    a.value = V(_);
    const k = _.length ? Math.min(..._.map((O) => O.id)) : 0;
    y.ok && !a.value.some((O) => O.id < k) && (l.value = !s.shared && io(y.value)), o.value = y.ok ? "" : y.error, Pr(i, () => r.value = !0);
  }
  function S() {
    return M((V) => {
      if (!n || !V.length) return V;
      const L = Math.min(...V.map((_) => _.id)), y = Math.max(...V.map((_) => _.id));
      return [...a.value.filter((_) => _.id > y), ...V, ...a.value.filter((_) => _.id < L)];
    });
  }
  const C = () => M((V) => V);
  async function j(V, L = null) {
    const y = a.value;
    L && (a.value = L(y));
    const _ = await s.run(V);
    return L && !_.ok && (a.value = y), u.value = _.ok ? "" : _.error, d.value = _.ok ? _.value : null, await S(), _;
  }
  return s.follow(t, v), S(), { rows: a, failure: o, loaded: r, more: l, load: S, loadLatest: C, older: w, act: j, actionFailure: u, answer: d, context: s };
}
const Lm = { class: "title" }, Nm = { class: "state" }, Dm = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Bm(t.line, t.events);
    return (o, r) => (c(), G(Ul, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: F(({ row: i }) => [
        p("span", Lm, x(i.title), 1),
        p("span", Nm, x(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, ib = /* @__PURE__ */ Y(Dm, [["__scopeId", "data-v-a69084cd"]]);
function Pm(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? be(t, a, { immediate: !0 }) : a(!0), Re(() => clearInterval(s)), n;
}
const ps = I(Date.now() / 1e3);
let lo = 0, $n = 0;
function jm() {
  return $n || (ps.value = Date.now() / 1e3, lo = setInterval(() => ps.value = Date.now() / 1e3, 1e3)), $n += 1, jo() && qo(() => {
    $n -= 1, $n || clearInterval(lo);
  }), ps;
}
const qm = ["title", "data-figure-mark", "data-folded", "data-open"], Fm = {
  key: 2,
  class: "worker"
}, Wm = { class: "head" }, Hm = { key: 0 }, Um = {
  key: 3,
  class: "status"
}, zm = {
  key: 0,
  class: "figure"
}, Vm = {
  key: 1,
  class: "ran-for"
}, Gm = { key: 2 }, Km = {
  key: 3,
  class: "news"
}, Ym = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Jm = {
  key: 6,
  class: "settled"
}, Zm = {
  key: 1,
  class: "bar"
}, Xm = {
  key: 3,
  class: "detail body"
}, Qm = {
  key: 0,
  class: "body-label"
}, ep = ["title"], tp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Hn(), s = ["onClick", "onAct"], a = R(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = I(!1), r = R(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = R(() => t.open !== void 0), l = R(() => i.value || r.value), u = R(() => i.value ? t.open : o.value), d = R(() => i.value ? !t.open : r.value && !o.value), f = R(() => !!(t.mark.action && n.onAct)), v = R(() => l.value || f.value || !!n.onClick), w = I(null), E = I(null), { folded: M, phase: S } = Ir(w, () => d.value);
    function C(Q) {
      var ee, J;
      if (!(Q.target !== w.value && !E.value.contains(Q.target))) {
        if (i.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (r.value) return void (o.value = !o.value);
        (J = n.onAct || n.onClick) == null || J(Q);
      }
    }
    const j = (Q) => n.onAct(Q), V = ["failed", "unfinished"], L = R(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? V.includes(t.mark.state) ? "danger" : "good" : ""), y = R(() => t.mark.color ? t.mark.color : L.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : L.value ? `var(--tone-${L.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), _ = R(() => y.value || "var(--tone-work)"), k = R(() => !t.mark.ending && !t.mark.ended && L.value !== "stopped"), O = jm(), g = R(
      () => t.mark.began_at && k.value && !t.mark.figure && !t.mark.counting ? zf(O.value - t.mark.began_at) : ""
    ), $ = R(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${to(ee - Q, !0)}` : to(O.value - Q, !0) : g.value;
    }), b = ["bad", "danger", "warn"], m = R(() => b.includes(L.value) || t.mark.asks ? "attention" : k.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), N = ["bad", "danger"], D = R(() => N.includes(L.value)), W = R(() => m.value === "process" ? "running" : D.value ? "cross" : L.value === "stopped" ? "stopped" : L.value === "good" ? "tick" : ""), re = R(
      () => !!(t.mark.figure || $.value || t.mark.docked || t.mark.stopping || W.value || t.mark.settled || t.mark.news)
    ), ce = R(() => [t.mark.title, t.mark.time ? Rr(t.mark.time) : ""].filter(Boolean).join(" · ")), de = R(() => ({
      ...y.value ? { "--mark": y.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (Q, ee) => (c(), h("div", tt(a.value, {
      ref_key: "root",
      ref: w,
      class: [
        "mark",
        `w-${m.value}`,
        z(S),
        {
          open: u.value,
          folding: i.value && d.value,
          live: v.value,
          failed: D.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: y.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: de.value,
      title: ce.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(M) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: C
    }), [
      (c(), G(xt(v.value ? "button" : "span"), {
        ref_key: "top",
        ref: E,
        class: "top",
        type: v.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (c(), G(nt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ye, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Fm, x(e.mark.worker), 1)) : A("", !0),
          p("span", Wm, [
            B(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Hm, x(e.mark.name), 1)) : A("", !0),
            l.value ? (c(), G(Xt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : A("", !0)
          ]),
          re.value ? (c(), h("span", Um, [
            e.mark.figure ? (c(), h("span", zm, x(e.mark.figure), 1)) : A("", !0),
            $.value ? (c(), h("span", Vm, x($.value), 1)) : A("", !0),
            e.mark.stopping ? (c(), h("span", Gm, "Stopping")) : A("", !0),
            e.mark.news ? (c(), h("span", Km, x(e.mark.news), 1)) : A("", !0),
            W.value === "running" ? (c(), h("span", Ym)) : W.value ? (c(), G(nt, {
              key: 5,
              class: Z(["sign", W.value]),
              name: W.value
            }, null, 8, ["class", "name"])) : A("", !0),
            e.mark.settled ? (c(), h("span", Jm, x(e.mark.settled), 1)) : A("", !0)
          ])) : A("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(Or, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: xe(j, ["stop"])
      }, null, 8, ["label", "open"])) : A("", !0),
      (e.mark.figure || e.mark.counting) && k.value ? (c(), h("span", Zm, [
        p("span", {
          class: "progress",
          style: pe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: _.value })
        }, null, 4)
      ])) : A("", !0),
      e.mark.detail && !z(M) ? (c(), G(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      e.mark.body && !z(M) ? (c(), h("div", Xm, [
        e.mark.bodyLabel ? (c(), h("p", Qm, x(e.mark.bodyLabel), 1)) : A("", !0),
        B(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : A("", !0),
      e.mark.command && !z(M) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, x(e.mark.command), 9, ep)) : A("", !0),
      e.mark.card ? (c(), G(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : A("", !0),
      me(Q.$slots, "default", {
        shown: !z(M)
      }, void 0, !0)
    ], 16, qm));
  }
}), jr = /* @__PURE__ */ Y(tp, [["__scopeId", "data-v-74d78abb"]]), np = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function qr(e) {
  var n;
  const t = np[e] || ((n = un(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const sp = (e) => qr(String(e).split(":")[0]), Fr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), ap = { passed: "good", failed: "danger", warned: "warn", running: "" }, op = { good: "good", warn: "warn", danger: "danger" }, co = {
  "open row": (e) => Xe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Ll(e.target_model, e.target_id || 0)
}, rp = { "open row": (e) => sp(e.target_model), "open page": () => qr("pages") };
function ip(e, t) {
  const n = t || {}, s = co[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? ap[e.outcome] || "" : op[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? rp[s](e) : "",
    handlers: s ? { onAct: () => co[s](e) } : {}
  };
}
const lp = 24, cp = 1e3, uo = 2e3, up = 0.25, dp = 5e3;
function hp(e, t = lp, n = () => !0) {
  const s = I(!1), a = I(0), o = I(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const L = u();
    return L ? L.scrollHeight - L.scrollTop - L.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function v(L) {
    if (clearTimeout(r), !L) {
      o.value = !1, l = Date.now();
      return;
    }
    const y = Date.now() - l < uo ? uo : cp;
    r = setTimeout(() => o.value = s.value, y);
  }
  function w() {
    clearTimeout(i), s.value = !1, a.value = 0, v(!1);
  }
  function E(L = !1) {
    const y = u();
    y && L && y.scrollTo ? y.scrollTo({ top: y.scrollHeight, behavior: "smooth" }) : y && (y.scrollTop = y.scrollHeight), w();
  }
  function M() {
    C(), !s.value && (s.value = !0, v(!0));
  }
  const S = () => !!u() && d() <= u().clientHeight * up;
  function C() {
    clearTimeout(i), S() && (i = setTimeout(() => s.value && S() && n() && E(!0), dp));
  }
  function j() {
    f() ? w() : M();
  }
  function V(L = 1, y = !1) {
    s.value ? a.value += Math.max(0, L) : E(y);
  }
  return jo() && qo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: w, toBottom: E, left: M, scrolled: j, arrived: V };
}
const fp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, mp = (e) => String(e ?? "").replace(fp, ""), pp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(null), { away: o, scrolled: r, arrived: i, toBottom: l } = hp(a);
    be(
      () => n.lines.length,
      () => Lt(() => i()),
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
      le(x(z(mp)(e.lines.join(`
`)) || e.empty), 1),
      z(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (v) => z(l)(!0))
      }, "Follow")) : A("", !0)
    ], 544));
  }
}, gp = /* @__PURE__ */ Y(pp, [["__scopeId", "data-v-d9fa8127"]]), vp = 1e4;
class yp {
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
    return this.heardAt !== null && t - this.heardAt > vp;
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
const wp = {
  key: 0,
  class: "frame-note"
}, kp = {
  key: 0,
  class: "frame-note"
}, bp = ["src", "title"], xp = 1e3, $p = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = zn(), s = I(null), a = I(!1), o = I(!1);
    let r = null, i = 0;
    return Fe(() => {
      r = new yp(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, xp);
    }), Re(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", wp, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      a.value ? (c(), h("div", kp, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        B(ve, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: F(() => [...u[1] || (u[1] = [
            le("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : A("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: z(n).window
      }, null, 8, bp)
    ], 64));
  }
}, Mp = /* @__PURE__ */ Y($p, [["__scopeId", "data-v-32a49046"]]), Sp = 0, _p = "/api/lines", Ep = "/api/line";
class Ap {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Sp));
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
        const n = await je.raw(_p, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Ep, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Cp = new Ap();
class Op {
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
      n.patterns.some((s) => Wr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Wr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Tp = Symbol("pane-page"), Ip = { 1: "refused", 2: "usage", 3: "fault" }, Rp = 100, Bp = 50, Lp = /"([^"]*)"|'([^']*)'|(\S+)/g;
function Np({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: v = "", tabs: w = [], search: E = {}, readOnly: M = !1, shared: S = null }) {
  const C = /* @__PURE__ */ new Map(), j = new AbortController(), V = I(!1), L = performance.now();
  let y = 0, _ = 0;
  const k = () => {
    clearTimeout(_), _ = setTimeout(() => {
      y === 0 && Pr(L, () => V.value = !0);
    }, Bp);
  }, O = (g) => {
    const $ = C.get(g);
    if ($ && performance.now() - $.at < Rp) return $.answer;
    y += 1;
    const b = Ur(e, g, t, j.signal).finally(() => {
      y -= 1, k();
    });
    return C.set(g, { answer: b, at: performance.now() }), b;
  };
  return {
    answered: V,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: R(() => s()),
    permissions: a,
    autoScroll: v,
    tabs: w,
    search: E,
    readOnly: M,
    shared: S,
    read: O,
    run: (g) => en(e, g, t, j.signal),
    upload: (g) => Pp(g, j.signal),
    cancel: () => j.abort(),
    subscriptions: r,
    follow: (g, $) => r.follow(e, g.filter((b) => o.some((m) => Wr(m, b))), $, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (g) => R(() => {
      var $;
      return l.value[g] ?? (($ = u.find((b) => b.key === g)) == null ? void 0 : $.default);
    }),
    setting: async (g, $) => {
      const b = await O(`window setting ${e} ${g}`);
      return b.ok ? b.value.value : $;
    },
    setOption: f,
    keep: (g, $) => en(e, ["window", "save-setting", e, g, JSON.stringify($)], t, j.signal)
  };
}
function Dp(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const Qt = { ok: !1, failure: "cancelled", error: "" }, Hr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function en(e, t, n, s = void 0) {
  try {
    const a = await Cp.add({ window: e, line: Array.isArray(t) ? t : jp(t), environment: n }, s);
    return s != null && s.aborted ? Qt : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Ip[a.code] || "fault", error: Dp(a.error) };
  } catch {
    return s != null && s.aborted ? Qt : { ok: !1, failure: "unreachable", error: Hr };
  }
}
async function Ur(e, t, n, s) {
  const a = await en(e, t, n, s);
  return a.failure !== "unreachable" || !ua() ? a : (await Bc(), s.aborted ? Qt : Ur(e, t, n, s));
}
async function Pp(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? Qt : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? Qt : { ok: !1, failure: "unreachable", error: Hr };
  }
}
function jp(e) {
  return [...e.matchAll(Lp)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function qp({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Fp = {
  class: "allowance-prompt",
  role: "dialog"
}, Wp = { class: "allowance-prompt-text" }, Hp = { class: "allowance-prompt-buttons" }, Up = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Fp, [
      p("p", Wp, x(z(qp)(e.request)), 1),
      p("div", Hp, [
        B(ve, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            le("Allow", -1)
          ])]),
          _: 1
        }),
        B(ve, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            le("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, zp = /* @__PURE__ */ Y(Up, [["__scopeId", "data-v-102dc765"]]), gs = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(Bn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        le(x(e.reason) + " ", 1),
        e.retry ? (c(), G(ve, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            le("Retry", -1)
          ])]),
          _: 1
        })) : A("", !0),
        e.removable ? (c(), G(ve, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            le("Remove tab", -1)
          ])]),
          _: 1
        })) : A("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Vp = ["data-window", "data-agent"], Gp = {
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
    search: { type: Object, default: () => ({}) },
    readOnly: Boolean,
    shared: { type: Object, default: null },
    skeleton: { type: Array, default: () => [] }
  },
  emits: ["open", "option", "remove"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(""), o = I(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = Ce(vl, null), l = Np({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: R(() => n.options),
      declared: n.declared,
      page: Ce(Tp, null),
      setOption: (f, v) => s("option", f, v),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, v) => {
        s("open", f, v), i == null || i(f, v);
      }
    });
    Ui(Te, l), be(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Fe(l.settle), Re(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), zi((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ia(n.component), d = () => {
      var f, v;
      return ((v = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : v.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, v) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G(zp, {
        key: 0,
        request: d(),
        onAnswer: v[0] || (v[0] = (w) => e.prompts.answer(w))
      }, null, 8, ["request"])) : A("", !0),
      e.unavailableReason ? (c(), G(gs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(gs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(K, { key: 4 }, [
        (c(), G(u, { key: o.value })),
        e.skeleton.length && !z(l).answered.value ? (c(), G(Br, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : A("", !0)
      ], 64)) : (c(), G(gs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: v[1] || (v[1] = (w) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Vp));
  }
}, zr = /* @__PURE__ */ Y(Gp, [["__scopeId", "data-v-1db91f82"]]), Kp = {
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
    const n = e, s = t, a = { render: () => ia(Mp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(zr, {
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
      search: e.entry.search,
      events: e.entry.events || [],
      "unavailable-reason": e.entry.unavailable_reason || "",
      onOption: r[0] || (r[0] = (i, l) => s("option", i, l))
    }, null, 8, ["name", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "unavailable-reason"]));
  }
}, Yp = ["data-window"], Jp = {
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
    const n = e, s = t, a = Un(null), o = I("");
    return be(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, Ec();
          } catch (i) {
            if (Sc(i) && _c(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      B(Br, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Yp)) : (c(), G(zr, {
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
      search: e.entry.search,
      events: e.entry.events,
      skeleton: e.entry.skeleton,
      "unavailable-reason": e.entry.unavailable_reason || o.value,
      onOption: i[0] || (i[0] = (l, u) => s("option", l, u))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, ho = "*.*", Zp = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = Ce(Te, null), s = new Op(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [ho], (d) => s.dispatch(d));
    Re(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = R(() => !!(t.declaration.shipped || t.declaration.trusted)), l = R(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [ho] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), G(Jp, {
      key: 0,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(Kp, {
      key: 1,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Xp = { class: "mark-more-inner" }, Qp = {
  class: "mark-lines",
  "data-mark-reason": ""
}, eg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, tg = {
  key: 3,
  class: "mark-lines"
}, ng = "process", fo = "task", sg = 2e3, ag = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = Ce(Te), s = R(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = R(() => Fr.has(t.mark.variant) && t.mark.detail || ""), o = R(() => t.mark.target_model === fo ? t.mark.target_id : 0), r = I([]), i = I(!1), l = I(""), u = R(() => t.mark.target_model === ng && !!t.mark.target_id);
    async function d() {
      const w = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      i.value = !0, l.value = w.ok ? "" : w.error, w.ok && (r.value = w.value.lines);
    }
    let f = null;
    const v = () => clearInterval(f);
    return be(() => t.shown && u.value, (w) => {
      v(), w && (d(), t.mark.ended_at || (f = setInterval(d, sg)));
    }, { immediate: !0 }), be(() => t.mark.ended_at, (w) => w && t.shown && u.value && (v(), d())), Re(v), (w, E) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: E[1] || (E[1] = xe(() => {
      }, ["stop"]))
    }, [
      p("div", Xp, [
        e.declaration.body_url ? (c(), G(Zp, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(K, { key: 1 }, [
          a.value ? (c(), h(K, { key: 0 }, [
            E[2] || (E[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", Qp, x(a.value), 1)
          ], 64)) : A("", !0),
          u.value && l.value ? (c(), h("p", eg, x(l.value), 1)) : u.value && i.value ? (c(), h(K, { key: 2 }, [
            E[3] || (E[3] = p("p", { class: "mark-label" }, "Output", -1)),
            B(gp, {
              class: "mark-terminal",
              lines: r.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (c(), h("p", tg, x(s.value.join(`
`)), 1)) : A("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: E[0] || (E[0] = xe((M) => z(Xe)(`${fo}:${o.value}`), ["stop"]))
          }, "Open task " + x(o.value) + " and its proofs", 1)) : A("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Ys = /* @__PURE__ */ Y(ag, [["__scopeId", "data-v-51f69bf1"]]), og = (e) => `show-${e}`, lb = (e, t, n) => e.filter((s) => {
  var a;
  return n(og((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), rg = "messages.chat", ig = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), ba = (e, t, n) => en(rg, ig(e, t), n), lg = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, cg = ["title", "aria-label", "onClick"], ug = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, dg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = R(() => lg(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = I(""), a = Ce(Te);
    async function o(r) {
      const i = await ba(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(K, null, [
      (c(!0), h(K, null, se(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: xe((u) => o(l), ["stop"])
      }, [
        B(nt, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, cg))), 128)),
      s.value ? (c(), h("span", ug, x(s.value), 1)) : A("", !0)
    ], 64));
  }
}, hg = /* @__PURE__ */ Y(dg, [["__scopeId", "data-v-0dfda102"]]);
function Vr(e, t) {
  const n = Un(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const Gr = Vr("/api/marks", "marks"), cb = Gr.fetchAll, fg = Gr.find, mg = 2e3;
function Kr(e, t, n = mg) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  Fe(async () => {
    await e(), a();
  }), Nt(() => clearTimeout(s));
}
const pg = ["data-ref"], gg = ["data-ref"], vg = { class: "mark-row" }, yg = "dock add", wg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = R(() => fg(s.mark.type)), o = Ce(Te, null), r = R(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = I(null);
    Kr(async () => {
      if (!r.value) return;
      const w = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      w.ok && w.value.rows.length && (i.value = w.value.rows[0].progress);
    }, () => r.value);
    const l = R(() => {
      const w = ip(s.mark, a.value), E = !w.figure || w.figure.endsWith("%");
      return i.value && r.value && E ? { ...w, figure: `${i.value}%`, fraction: i.value / 100 } : w;
    }), u = R(() => {
      var w;
      return !!(s.mark.lines || s.mark.detail && Fr.has(s.mark.variant) || t.has(s.mark.target_model) || (w = a.value) != null && w.body_url);
    }), d = I(!1);
    function f(w) {
      if (l.value.handlers.onAct && !w.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const v = R(() => {
      var w, E, M;
      return s.docked ? (E = (w = a.value) == null ? void 0 : w.buttons) == null ? void 0 : E.filter((S) => {
        var C;
        return !((C = S.runs) != null && C.startsWith(yg));
      }) : (M = a.value) == null ? void 0 : M.buttons;
    });
    return (w, E) => {
      var M, S;
      return (M = a.value) != null && M.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        B(Ys, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, pg)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (S = a.value) == null ? void 0 : S.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", vg, [
          B(jr, tt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, Vi(l.value.handlers), { onClick: f }), Gi({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: F(({ shown: C }) => [
                B(Ys, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: C
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          B(hg, {
            buttons: v.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, gg));
    };
  }
}, kg = /* @__PURE__ */ Y(wg, [["__scopeId", "data-v-cc29b2a4"]]), bg = ["data-ref"], xg = ["inert"], $g = { class: "group-fold" }, Mg = { class: "thread-group" }, Sg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), s = I(!1), a = I(!1), o = I(null);
    be(n, async (i) => {
      var l;
      s.value = !0, await Lt(), (l = o.value) == null || l.offsetHeight, a.value = i;
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
    return (i, l) => (c(), h("div", {
      class: "thread-turn group",
      "data-ref": e.group.id
    }, [
      B(jr, {
        mark: r.value,
        open: n.value,
        onClick: l[0] || (l[0] = (u) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: a.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        p("div", $g, [
          p("div", Mg, [
            (c(!0), h(K, null, se(e.group.marks, (u) => (c(), G(kg, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, xg)) : A("", !0)
    ], 8, bg));
  }
}, ub = /* @__PURE__ */ Y(Sg, [["__scopeId", "data-v-594fc44f"]]);
function _g(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Fe(() => n.observe(e.value)), Nt(() => n.disconnect()), t;
}
const Eg = { class: "chat-dock-fold" }, Ag = ["aria-label"], Cg = { class: "chat-dock-head" }, Og = { class: "chat-dock-inner" }, Yr = 700, Tg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), s = I(null), a = _g(s), o = I(!1);
    let r = 0;
    return Fe(() => r = setTimeout(() => o.value = !0, Yr)), Nt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Eg, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          me(i.$slots, "edge"),
          p("header", Cg, [
            me(i.$slots, "head")
          ]),
          p("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", Og, [
              p("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: pe(z(a) === null ? null : { height: `${z(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  me(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, Ag)
      ])
    ], 2));
  }
}, Jr = /* @__PURE__ */ Y(Tg, [["__scopeId", "data-v-63e4dcfc"]]), Ig = {
  class: "dock-leave",
  "aria-hidden": "true"
}, vs = 5, Rg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(vs, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${vs}s`, animationDelay: `${(n - vs).toFixed(2)}s` };
    return (a, o) => (c(), h("span", Ig, [
      p("i", { style: s })
    ]));
  }
}, Zr = /* @__PURE__ */ Y(Rg, [["__scopeId", "data-v-d0c4b012"]]), Xr = Vr("/api/docks", "docks"), db = Xr.fetchAll, Js = Xr.find, Bg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), Zs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Lg = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Ng = (e) => e.kept ? Zs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : Zs("keep", "pin", "Pin", `dock keep ${e.id}`), Dg = ["pin", "stop"], Pg = (e) => ({ ...e, iconOnly: Dg.includes(e.icon) });
function jg(e, t) {
  var n;
  return [
    ...Lg(e, t) ? [Ng(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || un(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    Zs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(Pg);
}
const qg = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Bg(e, t),
  buttons: jg(e, t)
}), Fg = { class: "dock-title" }, Wg = ["aria-expanded", "title"], Hg = { class: "chat-dock-acts dock-acts" }, Ug = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, zg = {
  key: 1,
  class: "dock-text"
}, Vg = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = R(() => Js(s.item.type)), o = I(null), r = R(() => qg(s.item, a.value)), i = Ce(Te), l = I(/* @__PURE__ */ new Set()), u = I("");
    async function d(w) {
      if (w.action === "open") return Xe(`${s.item.target_model}:${s.item.target_id}`);
      w.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, w.label])), u.value = "";
      const M = await ba(w, s.item, i.environment);
      (M == null ? void 0 : M.ok) === !1 && (l.value = new Set([...l.value].filter((S) => S !== w.label)), u.value = M.error);
    }
    const f = R(() => r.value.buttons.filter((w) => w.action !== "undock" && !l.value.has(w.label))), v = R(() => r.value.buttons.find((w) => w.action === "undock"));
    return (w, E) => (c(), G(Jr, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: F(() => [
        e.leaving ? (c(), G(Zr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0)
      ]),
      head: F(() => {
        var M, S, C;
        return [
          (M = a.value) != null && M.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(K, { key: 1 }, [
            B(ye, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", Fg, x(r.value.title), 1)
          ], 64)),
          (S = a.value) != null && S.badge ? (c(), h("span", {
            key: 2,
            class: Z(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, x(a.value.badge), 3)) : A("", !0),
          (C = a.value) != null && C.draws_head ? A("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: E[0] || (E[0] = (j) => n("fold"))
          }, [
            B(Xt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Wg)),
          p("span", Hg, [
            (c(!0), h(K, null, se(f.value, (j) => (c(), h(K, {
              key: j.action + j.runs
            }, [
              j.iconOnly ? (c(), G(ve, {
                key: 0,
                kind: "icon",
                "aria-label": j.label,
                title: j.label,
                "data-dock-action": j.action,
                onClick: (V) => d(j)
              }, {
                default: F(() => [
                  B(ye, {
                    name: j.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(ve, {
                key: 1,
                small: "",
                kind: j.primary ? "primary" : "ghost",
                bordered: !j.primary,
                "data-dock-action": j.action,
                onClick: (V) => d(j)
              }, {
                default: F(() => [
                  le(x(j.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          B(Yn, {
            title: v.value.label,
            "data-dock-action": "undock",
            onClick: E[1] || (E[1] = (j) => n("undock", v.value))
          }, null, 8, ["title"])
        ];
      }),
      default: F(() => {
        var M, S;
        return [
          u.value || e.refusal ? (c(), h("p", Ug, x(u.value || e.refusal), 1)) : A("", !0),
          e.item.text && !((M = a.value) != null && M.body_url) ? (c(), h("p", zg, x(e.item.text), 1)) : A("", !0),
          (S = a.value) != null && S.body_url ? (c(), G(Ys, {
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
}, mo = /* @__PURE__ */ Y(Vg, [["__scopeId", "data-v-1ac9db13"]]), Gg = 6, Kg = 3, po = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, yt = (e) => !!(e.leaves_at && !e.kept), Yg = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!yt(e) || t < e.leaves_at || n.has(e.id)), Jg = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => Yg(s, t, n)).sort((s, a) => s.id - a.id);
function Zg(e, t, n = Gg) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Xg = (e, t, n = e) => n < 2 ? !1 : e >= Kg ? !0 : t, Qg = ["title", "aria-label"], e0 = { class: "run-chip-in" }, t0 = {
  key: 0,
  class: "run-chip-ring"
}, n0 = { class: "run-chip-name" }, s0 = { class: "run-chip-bar" }, a0 = "processes.output", o0 = 5e3, r0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = Ce(Te, null)) == null ? void 0 : d.environment) ?? "", o = I(null), r = R(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = R(() => {
      var f, v;
      return ((f = o.value) == null ? void 0 : f.title) || ((v = o.value) == null ? void 0 : v.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = R(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await en(a0, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return Kr(u, () => r.value, o0), (f, v) => {
      var w;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: pe({ "--tone": l.value })
      }, [
        z(yt)(e.item) ? (c(), G(Zr, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : A("", !0),
        p("span", e0, [
          r.value ? (c(), h("span", t0)) : (c(), G(nt, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", n0, x(i.value), 1)
        ]),
        p("span", s0, [
          p("i", {
            style: pe({ width: r.value ? `${((w = o.value) == null ? void 0 : w.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, Qg);
    };
  }
}, i0 = /* @__PURE__ */ Y(r0, [["__scopeId", "data-v-597b05d2"]]), l0 = 24, c0 = 8, hb = 420;
function fb({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= l0 && e > t ? !0 : e < t && a > c0 ? !1 : null;
}
const u0 = (e, t) => e === void 0 ? t : e, Qr = "journal.viewer.";
function d0(e, t, n) {
  try {
    const s = n.getItem(Qr + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function h0(e, t, n) {
  try {
    n.setItem(Qr + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function f0(e, t, n = window.localStorage) {
  const s = I(d0(e, t, n));
  return be(s, (a) => h0(e, a, n), { deep: !0 }), s;
}
const m0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, p0 = { class: "dock-runs-chips" }, g0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var _;
    const t = e, n = Pm(500), s = I(/* @__PURE__ */ new Set()), a = I(!1), o = I(!1), r = Ce(Te), i = I(/* @__PURE__ */ new Set()), l = I({});
    async function u(k, O) {
      i.value = /* @__PURE__ */ new Set([...i.value, k.id]);
      const g = await ba(O, k, r.environment);
      (g == null ? void 0 : g.ok) === !1 && (i.value = new Set([...i.value].filter(($) => $ !== k.id)), l.value = { ...l.value, [k.id]: g.error });
    }
    const d = R(() => Jg(t.items.filter((k) => !i.value.has(k.id)), n.value, s.value)), f = R(() => Zg(d.value.filter((k) => po(k, Js)), n.value)), v = R(() => d.value.filter((k) => !f.value.includes(k) && !po(k, Js))), w = R(() => f.value.filter((k) => !yt(k))), E = R(() => (a.value = Xg(f.value.length, a.value, w.value.length)) && !o.value), M = f0(`dock-folded:${((_ = ue.identity) == null ? void 0 : _.root) || location.host}`, {}), S = (k) => u0(M.value[k.id], t.folded);
    function C(k) {
      M.value = { ...M.value, [k.id]: !S(k) };
    }
    function j(k) {
      M.value = { ...M.value, ...Object.fromEntries(f.value.map((O) => [O.id, O.id !== k.id])) }, o.value = !0;
    }
    function V() {
      M.value = Object.fromEntries(Object.entries(M.value).filter(([k]) => !f.value.some((O) => String(O.id) === k))), o.value = !1;
    }
    function L(k) {
      s.value = /* @__PURE__ */ new Set([...s.value, k.id]);
    }
    function y(k) {
      s.value = new Set([...s.value].filter((O) => O !== k.id));
    }
    return (k, O) => (c(), G(Do, {
      tag: "div",
      name: "dock",
      duration: z(Yr),
      class: "dock-stack"
    }, {
      default: F(() => [
        (c(!0), h(K, null, se(v.value, (g) => (c(), G(mo, {
          key: g.id,
          item: g,
          class: Z({ timed: z(yt)(g) }),
          leaving: z(yt)(g) && !s.value.has(g.id),
          folded: S(g),
          refusal: l.value[g.id],
          onFold: ($) => C(g),
          onUndock: ($) => u(g, $),
          onMouseenter: ($) => L(g),
          onMouseleave: ($) => y(g)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", m0, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: V
          }, [
            le(x(f.value.length) + " runs ", 1),
            B(Xt, { open: "" })
          ])
        ])) : A("", !0),
        (c(!0), h(K, null, se(E.value ? [] : f.value, (g) => (c(), G(mo, {
          key: g.id,
          item: g,
          class: Z({ timed: z(yt)(g) }),
          leaving: z(yt)(g) && !s.value.has(g.id),
          folded: S(g),
          refusal: l.value[g.id],
          onFold: ($) => C(g),
          onUndock: ($) => u(g, $),
          onMouseenter: ($) => L(g),
          onMouseleave: ($) => y(g)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        E.value ? (c(), G(Jr, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: F(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run as its own card",
              "data-dock-runs-open": "",
              onClick: O[0] || (O[0] = (g) => o.value = !0)
            }, [
              B(nt, { name: "runs" }),
              le(" " + x(f.value.length) + " runs ", 1),
              B(Xt)
            ]),
            p("span", p0, [
              (c(!0), h(K, null, se(f.value, (g) => (c(), G(i0, {
                key: g.id,
                item: g,
                onClick: ($) => j(g)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : A("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, mb = /* @__PURE__ */ Y(g0, [["__scopeId", "data-v-65c310f9"]]), wt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, On = (e) => Math.min(Math.max(e, 0), 1), v0 = (e) => {
  const t = On(e);
  return t * t * (3 - 2 * t);
}, mt = (e, t, n) => v0((e - t) / (n - t));
function pb(e) {
  const t = On(e), n = On((t - 0.12) / 0.76) * wt.shuffles, s = Math.min(Math.floor(n), wt.shuffles - 1), a = n - s, o = mt(a, 0.26, 0.38) * (1 - mt(a, 0.76, 0.96)), r = mt(a, 0.38, 0.76), i = mt(t, 0, 0.12) * (1 - mt(t, 0.88, 1)), l = mt(a, 0.2, 0.34) * (1 - mt(a, 0.84, 1)), u = Math.sin(Math.PI * On((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / wt.shuffles, lift: wt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function gb(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const go = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, vb = (e) => go[e] ?? go.butler, xa = 2400, y0 = 0.05;
function w0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, y0), r = Math.min(t + xa * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function yb(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function k0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function wb(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const kb = (e, t) => ({ ...e, stretch: t.stretch }), bb = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, ei = (e, t) => t >= (e.least ?? 0);
function xb(e, t, n) {
  if (!ei(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const $b = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), b0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", vo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), x0 = (e) => e.right > e.left && e.bottom > e.top;
function Mb(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(b0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = vo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = vo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), x0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function ti(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, v] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const w = t[d] - e[d];
      if (Math.abs(w) < 1e-9)
        (e[d] < o[f] || e[d] > o[v]) && (i = -1);
      else {
        const E = (o[f] - e[d]) / w, M = (o[v] - e[d]) / w;
        r = Math.max(r, Math.min(E, M)), i = Math.min(i, Math.max(E, M));
      }
    }
    if (r > i || s && r >= s.share) continue;
    const l = e.x + (t.x - e.x) * r, u = e.y + (t.y - e.y) * r;
    s = { share: r, x: l, y: u, on: "surface", surface: a.id, dx: l - a.left, dy: u - a.top };
  }
  return s;
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
}, tn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), $0 = (e) => e * e * (3 - 2 * e), _e = (e, [t, n]) => $0(tn(e, t, n)), M0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Mn = ([e, t], n) => e + n() * (t - e);
function S0(e) {
  return M0.map(() => {
    const t = Mn(ct.speed, e), n = Mn(ct.angle, e) * Math.PI / 180, s = Mn(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Mn(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const _0 = S0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function E0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function Sb(e, t, n = _0) {
  const s = Se.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = E0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= ct.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const _b = (e, t) => e && Se[e.name] ? { name: e.name, u: t / e.frames } : null;
function Eb(e, t) {
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
const Ab = () => Array.from({ length: Se.pogo.count }, (e, t) => Se.pogo.bounce * (t + 1) / Se.pogo.count), Tt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Cb(e, t, n) {
  const { away: s, side: a } = Se.bug_smash, o = a * s * n, [r, i] = [t.left + Tt.margin * n, t.right - Tt.margin * n], l = Math.min(Math.max(e + o + a * Tt.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function Ob(e, t, n) {
  const s = Se.bug_smash, a = _e(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Tt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Tt.tall * n * (1 - _e(t, s.emerge)),
      turn: 90 * (1 - _e(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - _e(t, s.gone)
    }
  };
}
function Tb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Tt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = w0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Ib(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function Xs(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Ie.margin, r = ((e.along - Ie.margin + e.way * Ie.speed * n / s) / a % 2 + 2) % 2, i = Ie.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function A0(e, t) {
  const n = Se.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = k0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function Rb(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Se.bug_shot, { frame: r, bug: i, shot: l } = A0(n, e.length), u = e.map((C, j) => ({ ...Xs(C, t, Math.min(n / o.fps, Tn(j).shot)), shot: j < l })), d = _e(r / o.frames, o.aim), [f, v] = [u[Math.max(i - 1, 0)], u[i]], w = e.map((C, j) => ({ bug: C, index: j, seconds: n / o.fps - Tn(j).shot, spot: Xs(C, t, Tn(j).shot) })).filter((C) => C.seconds >= 0), E = w.flatMap((C) => {
    const j = (a == null ? void 0 : a.get(C.index)) ?? R0(C.bug, t, C.spot, a ? [] : s);
    return a == null || a.set(C.index, j), a && B0(j, C.seconds, s), L0(j, C.seconds, s);
  }), M = w.filter((C) => T0(C.bug)).map((C) => ({ seconds: C.seconds, from: C.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (v.x - f.x) * d, y: f.y + (v.y - f.y) * d, back: S }, slush: E, camera: M };
}
function Tn(e) {
  const t = Se.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function Bb(e, t, n, s) {
  const { limit: a, margin: o } = Se.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Tn(d), v = Xs(u, t, f.shot), w = Math.abs(v.y - n.y) / Math.tan(a * Math.PI / 180), E = v.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - v.x), M = Math.abs(v.x - l) >= w ? l : v.x + E * w, S = E > 0 ? Math.max(l, Math.min(M, i)) : Math.min(l, Math.max(M, r)), C = { from: l, to: S, begin: f.walk, end: f.aim };
    return l = S, C;
  });
}
function Lb(e, t, n) {
  var o;
  const s = Se.bug_shot.back.stride * n;
  let a = 0;
  for (const r of e) {
    if (t <= r.begin) return { x: r.from, steps: a / s, way: 0 };
    if (t < r.end) {
      const i = r.from + (r.to - r.from) * _e(t, [r.begin, r.end]);
      return { x: i, steps: (a + Math.abs(i - r.from)) / s, way: Math.sign(r.to - r.from) };
    }
    a += Math.abs(r.to - r.from);
  }
  return { x: ((o = e.at(-1)) == null ? void 0 : o.to) ?? 0, steps: a / s, way: 0 };
}
const $e = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, C0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function O0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const T0 = (e) => e.along * 97 % 1 < $e.camera, nn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * $e.gravity * t * t });
function I0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * $e.gravity * (t.bottom - e.from.y))) / $e.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * $e.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / $e.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += $e.step) {
    const d = Math.min(u + $e.step, r.t), f = nn(e, d), v = ti(i, f, n);
    if (v) return { ...v, t: u + (d - u) * v.share };
    i = f;
  }
  const l = nn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function R0(e, t, n, s = []) {
  const a = O0(e.along + 1), [o, r] = C0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: $e.count }, () => {
    const l = i + (a() - 0.5) * 2 * ($e.spread * Math.PI / 180), u = $e.speed[0] + a() * ($e.speed[1] - $e.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: $e.radius[0] + a() * ($e.radius[1] - $e.radius[0]) };
    return { ...d, ...I0(d, t, s) };
  });
}
function B0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += $e.step) {
      const r = Math.min(o + $e.step, a), i = ti(nn(s, o), nn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function L0(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...nn(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - $e.hold) / $e.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((d) => d.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, u = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function Nb(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Se.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = _e(e, [0, u]), v = _e(e, [u, u + d]);
  return r.map((w) => {
    const E = { x: s.x + w.at[0] * t, y: s.y + w.at[1] * t };
    return {
      x: n.x + (E.x - n.x) * f,
      y: n.y + (E.y - n.y) * f,
      r: w.size * t * (0.15 + 0.85 * f * f),
      run: v * v * t * 1.2,
      fade: 1 - v,
      landed: f >= 1
    };
  });
}
function Db(e, t, n, s, a) {
  const { sway: o, above: r } = Se.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (M) => {
    const [S, C] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + S * u - C * d, y: i.y + S * d + C * u };
  }, [v, w] = [...n].sort((M, S) => M.x - S.x), E = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: E.map((M, S) => ({ from: M, to: S < E.length / 2 ? v : w })) };
}
const Pb = (e, t) => _e(t, e.grows) * (1 - _e(t, e.sinks));
function Pn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: tn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: tn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function jb(e, t) {
  const n = Se[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Pn(n, t), r = 1 - (1 - n.small) * _e(s, n.shrinks) * (1 - _e(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Pn(n, t), o = n.flat * _e(s, n.squashes) * (1 - _e(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * tn(a, ...n.springs)) * (1 - tn(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const qb = (e) => e === "pack_box";
function Fb(e) {
  const { into: t, out: n } = Pn(Se.rope_swing, e);
  return 1 - _e(t, [0, 1]) * (1 - _e(n, [0, 1]));
}
function Wb(e) {
  const t = Se.rope_swing, { into: n, out: s } = Pn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return _e(n, [0, 1]) * (1 - _e(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const N0 = { after: 3 }, $a = 10, D0 = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, P0 = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, j0 = { weight: 19 }, ni = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, q0 = { every: 120 }, si = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, ai = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, F0 = {
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
}, fn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: $a }), te = (e, t, n = {}) => fn(e, "clip", t, n), ys = (e, t, n = {}) => fn(e, "look", t, n), yo = (e, t, n = {}) => fn(e, "gaze", t, n), fe = (e, t, n = {}, s = {}) => ({ ...fn(e, "pick", t, n), ...s }), we = (e) => fn("nothing", "nothing", e, {}), W0 = 120, H0 = 300, ws = (e, t) => ({ ...te(e, t), cooldown: H0 }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), U0 = () => [te("joy", 2)], pt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), gt = (e) => ({ ...e, cooldown: D0[e.name] }), Ht = (e) => ({ ...e, shenanigan: !0, lasts: P0[e.name] }), Xn = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...oe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), we(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...oe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...gt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...gt(te("bug_smash", 2)), toward: "", onto: !1 },
    te("nod", 2)
  ]),
  ...oe("tests_failed", { cooldown: 20, toward: "card" }, [te("startled", 2), te("dismay", 1), te("tantrum", 3), we(1)]),
  ...oe("committed", { cooldown: 30, toward: "card", onto: !0 }, [te("nod", 2), we(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...oe("sin_fixed", { cooldown: 300 }, [te("halo", 1), we(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...oe("sin_committed", { cooldown: 300 }, [te("repent", 1), we(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...oe("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), we(7)]),
  ...oe("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), we(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...oe("reported", { cooldown: 90 }, [yo("read", 3), te("nod", 1), we(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [yo("read", 3), we(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), we(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), we(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, U0()),
  ...oe("bar_failed", { holds: !0 }, [te("fume", 1), te("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...oe("standing", { cooldown: 12 }, [te("look_left", 2), te("look_right", 2), te("look_up", 1), we(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...oe("launched", { cooldown: 300 }, [te("tumble", 3), we(47)]),
  // a break from the hammering now and then
  ...oe("building", { cooldown: 30 }, [te("wipe_brow", 4), te("look_left", 1), te("look_right", 1), we(69)]),
  ...oe("failed", { cooldown: 20, toward: "card" }, [te("shake", 3), te("tantrum", 2), we(2)]),
  ...oe("refused", { cooldown: 20 }, [te("shake", 1), we(1)]),
  ...oe("work_done", { cooldown: 120 }, [te("stretch", 2), we(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...oe("pondering", { cooldown: [30, 60] }, [fe("ponder", 1)]),
  ...oe("thought_cloud", { cooldown: 90 }, [fe("cloud", 1)]),
  ...oe("light_bulb", { cooldown: 150 }, [fe("bulb", 1)]),
  ...oe("answered", { cooldown: 15 }, [ys("amused", 3), we(2)]),
  ...oe("heard", { cooldown: 30 }, [
    te("bow", 1, { voices: ["butler"] }),
    te("salute", 1, { voices: ["squire"] }),
    te("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    we(1)
  ]),
  ...oe("long_walk", { cooldown: 90 }, [te("stumble", 3), we(22)]),
  ...oe("card_arrived", { cooldown: 20, toward: "card" }, [te("glance", 7), we(13)]),
  ...oe("typing", { cooldown: 60 }, [ys("reading", 1), we(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(F0).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [ys(t, 1)])),
  ...Object.entries(si).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(ai).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...oe("pastime", {}, [
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
    { ...Ht(gt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Ht(gt(te("disco", 2, { ball: "bubble" }))),
    we(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: W0 }, [ws("search", 3), { ...ws("binoculars", 2), when: { home: !0 } }, { ...ws("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [fe("writing", 12, { state: "writing" }), fe("reading", 12, { state: "reading" }), fe("searching", 12, { state: "searching" }), we(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...gt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), we(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Ht(gt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [fe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: ni.build.cooldown }, [fe("unit", j0.weight), we(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...fe("hang", 1, { hands: !0, free: !0 }), cooldown: q0.every }, fe("stand", 5)]),
  // a digit a blow's dust lets out
  ...oe("digit", {}, [fe("0", 1), fe("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...oe("roam", {}, [
    fe("rest", 35, {}, { stay: [25, 60] }),
    fe("seat", 15, {}, { stay: [15, 40] }),
    fe("edge", 25, {}, { stay: [8, 20] }),
    Ht(fe("bubble", 15, {}, { stay: [30, 80] })),
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
    Ht(gt(fe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], oi = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), ri = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), z0 = (e) => Array.isArray(e) ? e[0] : e, V0 = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, G0 = (e) => Xn.some((t) => t.when.moment === e);
function K0(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || ri(d).every(([f, v]) => n(f) >= z0(v)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = Xn.filter((d) => oi(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= N0.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = K0(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (ii(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function ii(e, t, n) {
  var s;
  for (const [a, o] of ri(t)) (s = e.memory) == null || s.set(a, e.now + V0(o, n));
}
function Hb(e, t, n) {
  ii(e, Xn.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const Ub = (e) => Object.values(ni).find((t) => oi(t.when, e)) ?? null, Y0 = (e, t, n) => n - t <= (e.lifetime ?? $a), zb = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || ei(e.clip, t));
class li {
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
const Qs = {
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
}, Vb = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), ci = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), Gb = {
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
}, Kb = 120, J0 = 20, Yb = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < J0), Z0 = (e) => Qs[e] || Qs.idle, Jb = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, ui = "airborne", X0 = "landing", Q0 = "travelling", di = "grounded", Zb = ({ airborne: e, landing: t, trip: n }) => e ? ui : t ? X0 : n != null && n.started ? Q0 : di;
function Xb(e, t) {
  var a;
  const n = ev(e, t);
  return e.mode === di && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function ev(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: v = null } = e;
  if (n === ui && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...tv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const w = v !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: w ? v : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : Z0(u), facing: w ? v : i.posture === "sit" ? i.face : f };
}
function tv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const ea = (e) => e.outcome, nv = "plugin:code-commandments:sins:", wo = (e) => e.type === "plugins.card" && e.markKey.startsWith(nv), sv = [
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
], Qb = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: or(n) })).sort((n, s) => n.time - s.time), ko = { user: "reacted", agent: "agent_reacted" };
function e5(e, t) {
  return e.filter((n) => ko[n.author] && bt(n) > t).map((n) => ({ beat: `${ko[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const av = [.../* @__PURE__ */ new Set([...Object.values(si).flatMap((e) => Object.keys(e)), ...Object.keys(ai)])];
function t5(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = av.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: bt(n), card: or(n) })).sort((n, s) => n.time - s.time);
}
const ov = (e) => new li(e).isTest(), jn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[ea(e)] || "";
}, rv = 1800, iv = (e, t) => {
  if (jn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && jn(n) !== "finished" && Number(e.time) - Number(n.time) <= rv ? "tests_fixed" : "tests_passed";
};
function n5(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(ov), a = s.filter((i) => jn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, jn(i))), o.map((i) => ({ beat: iv(i, a), time: Number(i.time), card: i.key }));
}
function s5(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(ea(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: ea(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const a5 = (e) => e.map((t) => {
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
function o5(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function r5(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function i5(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = sv.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ma(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const bo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function lv(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ma(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function l5(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : G0(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function c5(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const xo = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function u5(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, u = xo((i - l) / Oe.returnSeconds), d = i <= l ? xo(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const $o = 3, hi = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Mo = 12, d5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function h5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!hi(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= $o ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * Mo) / Mo, lasts: $o } };
}
const f5 = (e) => e.posture === "hang" && !hi(e.face), cv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), uv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function m5(e, t, n) {
  return cv.has(e) ? 1 / 0 : !uv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(fi(n - t.began, t.share) - Qe.lead, 0);
}
const dv = 5;
function p5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= dv ? { beat: "long_walk", time: n } : null };
}
const hv = 30, Sn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function g5(e, t, n, s, a = null) {
  if (t && n < t.until || !Sn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = Sn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + Sn.every } : { state: e, began: 0, until: 0, next: n + Sn.every };
}
const v5 = (e, t, n) => t && n < t.until && ci.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, fi = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function y5(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = fi(o, e.share);
  return a ? { eager: fv(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function fv(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const mv = 1, pv = { look: "look", gaze: "gaze" };
function gv(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [pv[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const vv = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), yv = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > mv * t, memory: s, now: a, room: o }, n).name === "backflip", wv = { work: ["building"], idle: ["standing"] };
function w5(e, t, n, s) {
  const a = Qs[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(wv[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), ci.has(e) ? { moments: o, began: n || s } : (n && s - n >= hv && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function kv(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const So = { pondering: kv };
function k5(e, t, n, s, a, o) {
  if (So[e.beat]) {
    const i = So[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = gv(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== $a && { lifetime: r.lifetime } } } : null;
}
function b5(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = vv(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const x5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function $5(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function M5(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const S5 = (e, t) => !!(e != null && e.watches) && !t.once, _5 = 10, E5 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || Y0(s, s.queuedAt, n)), A5 = (e, t) => t ? null : e[0] ?? null;
function C5(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const O5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), bv = 2 * Math.PI, xv = 500;
function T5(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / xv, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), v = bv * r / 1e3, w = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (u ? w : t != null && t.behind && t.mood === "reading" ? { ...t } : t && w && !l ? a && !t.behind && !w.behind ? Mv(w, t, n, v, a) : _v(w, t, n, v) : t) ?? w, S = M != null && M.behind && M.mood === "reading" ? $v(e.point, M, n, r, a) : M;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: f, at: s };
}
function $v(e, t, n, s, a) {
  const o = (g) => g * 180 / Math.PI, r = (g) => o(Math.atan2(Math.sin(g * Math.PI / 180), Math.cos(g * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), v = f ? r(e.readingFacing - i) : 0, w = f ? e.readingYaw + v : d, E = w + r(u - w), M = Math.min(Math.max(s / 1e3, 0), 0.1), S = Oe.turnSpeed * M, C = f ? w + Math.min(Math.max(E - w, -S), S) : E, j = f ? e.readingFollow + v : C, V = j + (C - j) * (1 - Math.exp(-M / Oe.followSeconds)), L = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, y = o(Ma(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), _ = Math.min(Math.max(y, -L.up), L.down), k = Oe.tipSpeed * M, O = f ? e.readingPitch + Math.min(Math.max(_ - e.readingPitch, -k), k) : _;
  return { ...t, readingYaw: C, readingFollow: V, readingPitch: O, readingFacing: i };
}
function Mv(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (j) => {
    const { yaw: V, pitch: L } = Ma(j.x - n.x, a, n.y - j.y, o);
    return { yaw: V, pitch: Math.min(Math.max(L, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [bo(i(e)), bo(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [v, w] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [E, M, S] = l.map((j, V) => v * j + w * u[V]), C = a * E / M;
  return { ...t, x: n.x + C, y: n.y - lv(C, a, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const Sv = 0.15;
function I5(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Sv;
}
function _v(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const Ev = (e) => !(e != null && e.on);
function R5(e, t, n) {
  if (Ev(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const sn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Ye = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, ks = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), _o = (e) => e * e * (3 - 2 * e);
function Av(e) {
  if (e < 0 || e >= Ye.seconds) return null;
  const t = ks(e, ...Ye.flicker), n = Math.floor(t * Ye.flickers * 2) % 2 === 0, s = e < Ye.flicker[1] ? n ? 0.35 + 0.5 * t : Ye.dim : 1;
  return { strength: 1 - _o(ks(e, ...Ye.fade)), lit: s, white: e < Ye.flash[0] ? 0 : 1 - _o(ks(e, ...Ye.flash)) };
}
const B5 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function L5(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = Av(t - e.at);
  return s && { colour: sn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Ye.signs[e.tone], ...s } };
}
function N5(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function D5(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= sn.looks || s === null && n - e.since >= sn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function P5(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const it = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, j5 = { behind: 39, figure: 40, ahead: 41 }, Cv = "[data-figure-pile]", Ov = { amber: [1, 0.69, 0.125], good: sn.colours.good, bad: sn.colours.bad }, In = { phases: 4, ms: 230, dim: 0.25 }, q5 = (e, t, n) => e !== "amber" || (t + n) % In.phases < In.phases / 2 ? 1 : In.dim, F5 = (e) => e === "amber" ? In.phases : 1;
function W5(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const H5 = Object.keys(Ov), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Ut = ([e, t], n) => e + n() * (t - e);
function U5(e) {
  const t = Ue.least + Math.floor(e() * (Ue.most - Ue.least + 1));
  return Array.from({ length: Math.min(t, Ue.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ue.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Ut(Ue.start, e), r = Ut(Ue.reach, e);
    return {
      text: We({ moment: "digit" }, e).name,
      x: s * o,
      y: Ue.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(Ut(Ue.moveMs, e)),
      fadeMs: Math.round(Ut(Ue.fadeMs, e))
    };
  });
}
const bs = { high: 3, gap: 1 };
function z5(e) {
  const t = Math.floor(e / bs.high);
  return { left: -(it.inside + it.width / 2 + t * (it.width + bs.gap)), up: e % bs.high * (it.height - it.top) };
}
const Tv = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, Iv = { after: 5 }, Rv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new li(t).isBuild());
function V5(e, t, n) {
  const s = Rv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Iv.after ? a : null;
}
function G5(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: Tv(n, s, a) } : null;
}
const Eo = { ahead: 140, up: 70 };
function K5(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Eo.ahead, y: s - Eo.up } } : o ? { at: { x: n(o), y: s - o.up - it.height } } : t ? { at: null } : null;
}
const xs = { least: 4e3, most: 1e4 }, Bv = (e) => xs.least + e() * (xs.most - xs.least), vt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function Y5(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Bv(t);
    if (n.length >= vt.most || t() >= vt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (vt.at[0] + t() * (vt.at[1] - vt.at[0]));
    n.push({ from: o, to: o + vt.ms }), s = o + vt.ms;
  }
}
const J5 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), Z5 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), mi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), X5 = new Set(Xn.filter((e) => mi.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), Lv = (e) => e.some((t) => t.state === "built"), Q5 = (e, t) => Lv(t) ? e.filter((n) => !mi.has(n.beat)) : e, ut = { reach: 40, room: 6 }, Nv = (e, t) => t <= e - ut.reach + 2, e4 = (e, t, n) => Nv(e, n) ? t - ut.reach : e - ut.reach - ut.room, t4 = (e, t, n, s) => s > 0 && t < e && t + ut.reach >= e - 2 ? Math.min(n, Math.max(e, t + ut.reach)) : e, $s = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, n4 = (e) => Ut(e() < $s.longShare ? $s.long : $s.short, e), Dv = 2 * it.width;
function s4(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= Dv ? o : e + (o - e + a / 2) % a;
}
const Pv = 60, a4 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= Pv, Ao = "[data-figure-home]", mn = () => {
  var t;
  const e = document.querySelector(Ao);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Ao)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, jv = "[data-figure-docked-bars]", qv = "[data-figure-chat-foot]", Fv = [0.85, 0.6, 0.35, 0.15], Wv = ["question", "waiting", "suggestion"], o4 = (e, t) => Wv.find((n) => e[n] > 0 && t[n] === "behind") || null;
function r4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Hv = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Uv = "[data-figure-newest]";
function pi() {
  var s, a;
  const e = (s = mn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Uv), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Sa(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function an(e, t, n = pi()) {
  if (!e || !n) return !0;
  const s = st(e, t), a = es(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ae.top * t.size, bottom: s.top + Ae.bottom * t.size }, r = wt.gap;
  return !Qn(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function i4(e, t, n, s = pi()) {
  if (!s || an(t, e, s)) return null;
  const a = es(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = Mt(), l = t.posture === "stand" ? Ea * e.size : $i * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - wt.gap - r, s.right + wt.gap + o].map((v) => ({ ...t, x: v })).filter((v) => v.x >= u && v.x <= d && an(v, e, s) && wy(v, e)).sort((v, w) => Math.abs(v.x - t.x) - Math.abs(w.x - t.x))[0] ?? null;
}
const Ms = 0.26, gi = 0.54, zv = 1.25 / 5.4, pn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Ms, travels: "stand" },
  lounge: { drop: Ms, travels: "stand" },
  composed: { drop: Ms, travels: "stand" },
  hang: { drop: gi, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, l4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * zv * Math.cos(t * Math.PI / 180),
  y: 1 - n - gi
}), zt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Vv = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), c4 = (e, t) => (e === "sit" ? Vv.has(t) : zt.has(e)) ? e : "stand";
function u4(e, t) {
  return e.facing === t.facing || !zt.has(e.posture) && !zt.has(t.posture) ? t : { posture: "stand", facing: zt.has(e.posture) ? e.facing : t.facing };
}
const d4 = 0.25, h4 = (e, t) => zt.has(e) && pn[t].drop === 0, vi = 2, Gv = 90, Kv = 180, Yv = 140, Jv = 280, Zv = 420, Xv = 0.25, Qv = 290, ey = 600, ty = "cubic-bezier(0.2, 0.7, 0.4, 1)", ny = "cubic-bezier(0.55, 0, 0.9, 0.6)", Ss = 5;
function qn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Ss) return null;
  (r || i) && (o = Math.max(o, vi));
  const w = o > 1, E = Math.abs(t.x - e.x), M = E < Ss ? 0 : E / (Gv * o) * 1e3, S = Math.min(M, w ? Yv : Kv), C = Math.abs(t.y - e.y), j = t.y < e.y, V = j && !v && yv(C, n, l, u, d, f), L = j ? Zv + Math.min(C, 400) * Xv : Math.sqrt(2 * C / xa) * 1e3, y = {
    x: t.x,
    y: t.y,
    ms: C > Ss ? V ? ey : L : 0,
    lead: V ? Qv : j ? Jv : 0,
    easing: j ? ty : ny,
    hopping: !0,
    clip: V ? "backflip" : j ? "jump" : "fall"
  }, _ = { x: t.x, y: t.y, ms: M + S, lead: 0, easing: "linear", ramp: S, ...w ? { clip: "run" } : {} }, k = v ? sy(t, n) : y, O = j && !s ? [{ ..._, y: e.y }, k] : [{ ...y, x: e.x }, _];
  return { way: Math.sign(t.x - e.x) || 1, legs: O, lands: !a, pace: o, running: w };
}
const sy = (e, t) => ({ x: e.x, y: e.y, ms: Se.pogo.frames / Se.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), ay = (e, t) => e.postures.includes(t) ? t : e.postures[0], f4 = (e, t, n) => e.posture === "walk" && n ? "walk" : ay(e.clip, t), st = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - pn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, Qn = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Sa = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function Mt() {
  var t;
  const e = (t = mn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const _n = 0.5, Co = 20;
function m4(e, t, n = Mt()) {
  const s = st(e, t);
  return s.left >= n.left + Co && s.right <= n.right - Co;
}
function _a(e, t, n = Mt()) {
  const s = st(e, t), a = s.right - s.left, o = es(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - _n && i <= n.right + _n && s.top >= n.top - _n && l <= n.bottom + _n;
}
const Fn = [0.35, 0.5, 0.65], Wn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ae = { left: Fn[0], right: Fn.at(-1), top: Wn[0], bottom: Wn.at(-1) }, oy = 0.24;
function es(e) {
  if (e.posture === "stand") return { left: Ae.left, right: Ae.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + oy * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ae.left, t), right: Math.max(Ae.right, t) };
}
function ry(e, { size: t }, n = Mt()) {
  const s = es(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Ea = (Ae.right - Ae.left) / 2 + 0.08;
function p4(e, t) {
  return e === "hang" ? Ae : { ...Ae, bottom: Math.min(Ae.bottom, 1 - t - pn[e].drop) };
}
const iy = "[data-figure-agent]";
function yi(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Sa(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const wi = (e) => Wn.flatMap(
  (t) => Fn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Aa(e, t, n = "") {
  if (!an(e, t)) return Fn.length * Wn.length;
  const s = st(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Hv)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && Qn(a, l) && Sa(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return wi(a).filter(([i, l]) => r(i, l) || yi(i, l, n)).length;
}
function ly(e, t) {
  const n = st(e, t);
  return wi({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => yi(s, a, "", iy)).length;
}
const Oo = 4;
function g4(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Oo; o <= a; o += Oo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!ly(i, e) && an(i, e)) return i;
    }
  return null;
}
function on(e, t, n) {
  const s = Mt(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => _a(r, t, s) && an(r, t)).map((r) => ({ spot: r, covered: Aa(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const ki = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), cy = [0.5, 0.25, 0.75], uy = (e) => ki(e.getBoundingClientRect(), cy), bi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, dy = Ea, hy = (e, t, { size: n }, s = dy) => xi(e, bi[t], s * n, "stand");
function xi(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const fy = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, $i = 0.1, my = (e, t, { size: n }) => xi(e, fy[t], $i * n, "sit"), py = (e) => ((e + 180) % 360 + 360) % 360 - 180, _s = 60;
function v4(e, t) {
  const n = py(t);
  return !e.aside || Math.abs(n) >= _s ? t : n < 0 ? 360 - _s : _s;
}
const Vt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, gy = (e) => [.../* @__PURE__ */ new Set([e, ...Vt.turns.map((t) => (t + 360) % 360)])];
function y4(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = gy(t), r = Vt.every[0] + s() * (Vt.every[1] - Vt.every[0]);
  return { face: t, from: a ? vy(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function vy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Vt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function w4(e, t) {
  const { element: n, edge: s } = ts(), a = ["left", "right"].map((i) => gn(my(s, i, e), e)).filter((i) => n && _a(i, e) && !Aa(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function k4(e, t, { size: n }) {
  const s = (Ae.right - Ae.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - Mi } : e;
}
const Mi = 7;
function Si() {
  const e = [...document.querySelectorAll(Cv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function yy(e, t) {
  const n = st(e, t), s = n.right - n.left;
  return { left: n.left + Ae.left * s, right: n.left + Ae.right * s, top: n.top + Ae.top * s, bottom: n.bottom };
}
function wy(e, t) {
  const n = Si();
  return !n || !Qn(yy(e, t), n);
}
const ky = 4;
function ts() {
  const e = vn(), t = Si(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > ky || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Mi - n, 0) } };
}
const b4 = ({ size: e, below: t }) => (1 - t) * e;
function gn(e, t) {
  const n = Mt(), { size: s, below: a } = t, o = pn[e.posture].drop * s;
  return { ...ry(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const ta = (e, t) => Object.keys(bi).map((n) => gn(hy(e, n, t), t)), Ca = (e, t) => ki(e, Fv).map((n) => gn(n, t)), _i = (e, t, n) => on(e, t, n) ?? e[0];
function x4(e, t) {
  const { element: n, edge: s } = ts();
  return { ..._i(ta(s, e), e, t), view: null, on: n };
}
function $4(e, t, n, s) {
  const { element: a, edge: o } = ts(), r = (s ? ta(o, t) : [...ta(o, t), ...Ca(o, t)]).filter(
    (u) => !Qn(st(u, t), e)
  ), i = on(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !Aa(i, t) ? i : on(r, t, n);
  return l && { ...l, view: null, on: a };
}
function vn() {
  var s;
  const e = mn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(jv);
  if (!t) return { ...ns(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const To = { within: 2 };
function M4(e) {
  const { element: t, docked: n, edge: s } = vn();
  if (!n || e.on !== t) return !0;
  const a = ns().edge;
  return s.left > a.left + To.within || s.left + s.width < a.left + a.width - To.within;
}
const by = "[data-figure-closing]";
function S4() {
  var n;
  const { element: e, docked: t } = vn();
  return t && !!((n = e.firstElementChild) != null && n.matches(by));
}
const Ei = "[data-figure-progress]";
function _4(e) {
  const t = e.querySelector(Ei);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function E4(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const xy = { across: 300, above: 380, below: 60 };
function A4(e) {
  const { across: t, above: n, below: s } = xy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: $y(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const $y = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ai = "[data-figure-bar]", na = { back: 144, along: 0.4 };
function C4(e) {
  const { element: t, docked: n, edge: s } = vn(), a = n ? t.querySelector(Ai) : null;
  if (!(a != null && a.querySelector(Ei))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...gn({ x: o - na.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function O4(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < na.along * s.size ? t.x + na.along * s.size : e.x, y: e.y, behind: !0 };
}
function T4(e) {
  const t = e.querySelector(Ai), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function ns() {
  const e = mn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function I4(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = ns(), l = n === null ? My(i, e, o === null ? t : { x: o, y: i.top }, s, a) : gn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function My(e, t, n, s, a) {
  const o = Ca(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + it.width < a && l.x + s - ut.reach - ut.room >= r);
  return on(i.length ? i : o, t, n);
}
const Sy = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function R4(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: v = !1 } = {}) {
  (o || r) && (a = Math.max(a, vi));
  const w = (V) => {
    const L = st(V, n, pn[V.posture].travels);
    return { x: L.left, y: L.top };
  }, E = t.ladder ?? e.ladder;
  if (E && !(t.ladder && e.ladder)) return _y(w(e), w(t), w({ ...E.foot, posture: "stand" }), E.way, !!t.ladder, n, a);
  const [M, ...S] = [e, ...l, t].map(w), C = qn(M, S[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: v }), j = S.slice(1).map((V, L) => {
    var y;
    return (y = qn(S[L], V, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : y.legs.find((_) => _.hopping);
  });
  return C && { ...C, legs: [...C.legs, ...j.filter(Boolean)] };
}
function _y(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Sy.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? qn(e, n, o.size, { pace: r }) : qn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function B4(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function L4(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && on(uy(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = ts();
  return { ..._i(Ca(a, t), t, n), view: null, on: s };
}
const Ey = "[data-figure-bubble]", Ay = 250;
let Gt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Ci = 0;
const Pt = () => Gt, Es = /* @__PURE__ */ new WeakMap();
let Cy = 0;
function Oa(e) {
  return Es.has(e) || Es.set(e, `floor-${++Cy}`), Es.get(e);
}
const Oy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Ty = () => {
  var e, t;
  return ((t = (e = mn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Iy(e, t) {
  var s;
  const n = (s = e.querySelector(qv)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Ry(e, t) {
  const n = e && Iy(e, t), s = e ? [...e.querySelectorAll(Ey)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Oy(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Oa(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const By = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Ay ? (t.top - s.top) / a * 1e3 : 0;
};
function Oi(e = Gt, t = performance.now()) {
  const n = Mt(), s = Ty(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = vn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = ns();
  return u.element && l.push({ id: Oa(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Ry(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: By(e, d, t) }))) });
}
const sa = /* @__PURE__ */ new Set();
function Ly(e) {
  return sa.add(e), () => sa.delete(e);
}
function Ny() {
  Ti();
  const e = () => {
    Ci = requestAnimationFrame(e), !document.hidden && (Gt = Oi(Gt), sa.forEach((t) => t(Gt)));
  };
  e();
}
function Ti() {
  cancelAnimationFrame(Ci);
}
const Ta = 5, Dy = 56, Py = { share: 0.6 }, jy = (e) => -Math.sqrt(2 * xa * Py.share * e), Rt = (e, t) => e.find((n) => n.id === t) ?? null;
function N4(e, t = Oi().floors) {
  const n = Rt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Oa(e.on) : null, o = a && Rt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Ii({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Pt().floors) {
  const u = Rt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || qy(u, d, o)) && Fy(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Ia = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, qy = (e, t, n) => !Ia({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function D4(e, t = Pt().floors) {
  if (!Ia(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Ta && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Fy(e, t, n = Pt().floors) {
  const s = Rt(n, "home");
  return e.posture === "hang" && s && st(e, t).bottom >= s.top ? !1 : _a(e, t);
}
function P4(e, t, n, s = Pt().floors) {
  const a = Ii(e, n, s);
  if (!e.home) return Wy(e, t, a, s);
  if (!a) return null;
  const o = Rt(s, "home"), r = a.y - t.y, i = r > Ta ? "dropping" : -r > Dy ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Wy(e, t, n, s) {
  const a = n ? Rt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: jy(e.risen) };
  if (!n) return null;
  if (Ia(t) && n.y - t.y > Ta) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function j4(e, t, n) {
  const s = Ea * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function q4(e, t, n, s = Pt().floors) {
  const a = t && Ii(t, n, s);
  return a ? { ...e, ...a } : e;
}
const Hy = ["data-kind"], Uy = { class: "figure-floor-name" }, zy = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: pe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", Uy, x(e.floor.kind), 1)
    ], 12, Hy));
  }
}, Vy = /* @__PURE__ */ Y(zy, [["__scopeId", "data-v-8f6132da"]]), Gy = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Ky = {
  __name: "FigureFloors",
  setup(e) {
    const t = Un(Pt().floors);
    let n = () => {
    };
    return Fe(() => {
      n = Ly((s) => t.value = s.floors), Ny();
    }), Re(() => {
      n(), Ti();
    }), (s, a) => (c(), h("div", Gy, [
      (c(!0), h(K, null, se(t.value, (o) => (c(), G(Vy, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, F4 = /* @__PURE__ */ Y(Ky, [["__scopeId", "data-v-e519168b"]]), As = (e) => typeof e == "number" ? e : Date.parse(e);
function W4(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: As(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => As(a.row.created_at) - As(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Yy = 3, Cs = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Jy(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Cs[n.grouping]) == null ? void 0 : s.call(Cs, e.row, n)) || "";
}
function Zy(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function H4(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Yy ? [Zy(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Jy(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Xy = 1e3;
function Qy() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), Xy);
  return Nt(() => clearInterval(t)), e;
}
const ew = ["datetime", "title"], ss = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Qy(), s = R(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, x(z(Uf)(e.at, z(n))), 9, ew));
  }
};
function tw(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const U4 = (e) => (t) => t.filter((n) => n.id !== e), z4 = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), V4 = (e) => (t) => [...t, e], G4 = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function K4(e) {
  const t = zn(), n = I(null), s = I("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const En = /* @__PURE__ */ new Map();
function nw(e, t) {
  if (En.has(e)) return En.get(e);
  const n = t().finally(() => En.delete(e));
  return En.set(e, n), n;
}
function Y4() {
  const e = zn(), t = I(null), n = I("");
  async function s() {
    const a = await nw(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const sw = { class: "cards-page" }, aw = { class: "cards-bar" }, ow = { class: "cards-count" }, rw = { class: "cards" }, iw = {
  key: 1,
  class: "cards-note"
}, lw = {
  key: 2,
  class: "cards-note"
}, cw = ["data-row", "onClick"], uw = { class: "card-head" }, dw = { class: "card-title" }, hw = { class: "card-foot" }, fw = {
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
    return (s, a) => (c(), h("div", sw, [
      p("div", aw, [
        p("span", ow, x(e.rows.length) + " " + x(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        B(ve, tt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: F(() => [
            B(ye, {
              name: "plus",
              size: 12
            }),
            le(" New " + x(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", rw, [
        e.loaded ? e.failure ? (c(), h("p", iw, x(e.failure), 1)) : e.rows.length ? A("", !0) : (c(), h("p", lw, "No " + x(e.noun) + "s yet", 1)) : (c(), G(Dt, {
          key: 0,
          shape: "cards"
        })),
        (c(!0), h(K, null, se(e.rows, (o) => (c(), h("button", {
          key: o.id,
          type: "button",
          class: "card",
          "data-row": o.id,
          onClick: (r) => n("open", o)
        }, [
          p("span", uw, [
            B(ye, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            le(" " + x(e.head(o)), 1),
            B(ss, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          p("span", dw, x(e.title(o)), 1),
          p("span", hw, x(e.foot(o)), 1)
        ], 8, cw))), 128))
      ]),
      me(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, J4 = /* @__PURE__ */ Y(fw, [["__scopeId", "data-v-990e6b37"]]), Io = "newest";
function Z4(e, { title: t, isOpen: n = null }) {
  var u;
  const s = (u = Ce(Te, null)) == null ? void 0 : u.search, a = I(""), o = I(Io), r = I("all"), i = R(() => {
    const d = a.value.trim().toLowerCase(), f = e.value.filter((v) => tw(v, d, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(v) === (r.value === "open")));
    return o.value === Io ? f : [...f].sort((v, w) => t(v).localeCompare(t(w)));
  }), l = R(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const mw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, pw = 40, gw = "top", vw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = Ce(Te, null)) == null ? void 0 : f.autoScroll, a = R(() => s === gw), o = I(null), r = I(!1), i = (v) => a.value ? v.scrollTop : v.scrollHeight - v.scrollTop - v.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= pw;
    }
    return be(() => n.rowCount, async () => {
      await Lt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (v, w) => (c(), h("div", mw, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        me(v.$slots, "default", {}, void 0, !0)
      ], 34),
      B(Bt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: F(() => [
          dt(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            B(ye, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            w[0] || (w[0] = le(" Newest ", -1))
          ], 512), [
            [Ki, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, X4 = /* @__PURE__ */ Y(vw, [["__scopeId", "data-v-3accb764"]]), yw = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, ww = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = Ce(Te, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", yw, [
      (c(!0), h(K, null, se(z(s), (i) => {
        var l;
        return c(), G(ve, {
          key: i.key,
          kind: "text",
          class: Z(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: F(() => [
            le(x(i.label) + " " + x(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, Q4 = /* @__PURE__ */ Y(ww, [["__scopeId", "data-v-cf3bb39f"]]), kw = {}, bw = { class: "menu-label" };
function xw(e, t) {
  return c(), h("span", bw, [
    me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const aa = /* @__PURE__ */ Y(kw, [["render", xw], ["__scopeId", "data-v-aa955b3e"]]), $w = {
  class: "search-bar",
  "data-search-bar": ""
}, Mw = { class: "search-bar-control" }, Sw = ["value", "placeholder", "aria-label"], _w = ["aria-expanded"], Ew = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var C;
    const s = e, a = n, o = Yi(), r = ((C = Ce(Te, null)) == null ? void 0 : C.search) ?? {}, i = R(() => r.placeholder || s.placeholder), l = r.context ?? [], u = I(null), d = I(null), f = I([]), v = R(() => f.value.length ? f.value[f.value.length - 1].next : l), w = R(() => !!o.menu || l.length > 0), E = (j) => {
      f.value = [], d.value = d.value ? null : j.currentTarget;
    };
    function M(j) {
      if (j.next.length) {
        f.value = [...f.value, j];
        return;
      }
      d.value = null, a("pick", j.click);
    }
    function S() {
      var j;
      a("update:modelValue", ""), (j = u.value) == null || j.focus();
    }
    return t({ focus: () => {
      var j;
      return (j = u.value) == null ? void 0 : j.focus();
    } }), (j, V) => {
      var L;
      return c(), h("div", $w, [
        p("div", Mw, [
          B(ye, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          p("input", {
            ref_key: "field",
            ref: u,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: V[0] || (V[0] = (y) => a("update:modelValue", y.target.value)),
            onKeydown: Kt(S, ["esc"])
          }, null, 40, Sw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
          }, [
            B(ye, {
              name: "close",
              size: 12
            })
          ])) : A("", !0),
          w.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: E
          }, [
            B(ye, {
              name: "caret",
              size: 12
            })
          ], 8, _w)) : A("", !0)
        ]),
        (L = z(r).button) != null && L.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: V[1] || (V[1] = (y) => a("pick", z(r).button.click))
        }, x(z(r).button.title), 1)) : A("", !0),
        me(j.$slots, "default", {}, void 0, !0),
        d.value ? (c(), G(ka, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: V[3] || (V[3] = xe(() => {
          }, ["stop"])),
          onClose: V[4] || (V[4] = (y) => d.value = null)
        }, {
          default: F(() => [
            f.value.length ? (c(), G(It, {
              key: 0,
              "data-search-back": "",
              onClick: V[2] || (V[2] = (y) => f.value = f.value.slice(0, -1))
            }, {
              default: F(() => [
                le("‹ " + x(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : A("", !0),
            (c(!0), h(K, null, se(v.value, (y) => (c(), G(It, {
              key: y.title,
              description: y.subtext,
              "data-search-entry": y.title,
              onClick: (_) => M(y)
            }, {
              default: F(() => [
                le(x(y.title) + x(y.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? A("", !0) : me(j.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : A("", !0)
      ]);
    };
  }
}, Aw = /* @__PURE__ */ Y(Ew, [["__scopeId", "data-v-43c4837e"]]), Cw = {
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
    return (o, r) => (c(), G(Aw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: F(() => [
        B(aa, null, {
          default: F(() => [...r[2] || (r[2] = [
            le("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, se(s, (i) => B(It, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (l) => e.tools.order.value = i.key
        }, {
          default: F(() => [
            le(x(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          B(aa, null, {
            default: F(() => [...r[3] || (r[3] = [
              le("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, se(a, (i) => B(It, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (l) => e.tools.state.value = i.key
          }, {
            default: F(() => [
              le(x(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : A("", !0)
      ]),
      default: F(() => [
        me(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, ex = /* @__PURE__ */ Y(Cw, [["__scopeId", "data-v-dab0064d"]]);
function tx() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Ow = 86400, oa = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Tw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((oa(t) - oa(e)) / Ow);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function nx(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = oa(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Tw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Os = 280, Ts = 240, Is = 120, Iw = 6, Rw = 14, rn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Bw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Ri(e, t) {
  const n = Math.max(0, Bw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Lw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Rw}px)` }), e.offsetHeight, e.style.transition = `height ${Os}ms ${rn}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Ri(t, e));
    const v = a() - i;
    if (!l && v >= Os && (l = !0, e.style.transition = `opacity ${Ts}ms ease-out, transform ${Ts}ms ${rn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), v < Os + Ts) return s(f);
    d();
  };
  return s(f), d;
}
function sx(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Iw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Is}ms ease-out, transform ${Is}ms ${rn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Ri(t, e)), a() - r < Is) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Nw = 140, An = 220, Ro = 5;
function ax({ gap: e = Nw, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(d, f) {
    s.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      s.delete(d), d.done(), f();
    });
  }
  function l() {
    const d = n.splice(0, Ro);
    if (a = d.length > 0, !a) return;
    let f = d.length;
    for (const v of d)
      v.el.style.display = v.display, i(v, () => {
        f -= 1, f || (o = t(l, e));
      });
  }
  const u = (d, f, v, w = Lw) => {
    if (r || !f.pane || !f.follows()) return v();
    const E = { el: d, options: f, done: v, arrival: w, display: d.style.display || "" };
    if (!a)
      return a = !0, i(E, () => o = t(l, e));
    d.style.display = "none", n.push(E), n.length >= Ro && u.flush();
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
function ox(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${An}ms ${rn}, opacity ${An}ms ease-in, margin ${An}ms ${rn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, An);
}
const Bi = "chat.pins.minimised", Rn = I(Yt(Bi, !1));
function Bo(e) {
  Rn.value = e, Vn(Bi, e);
}
function Dw(e) {
  const t = R(() => e()), n = R(() => Rn.value ? [] : e()), s = () => Bo(!Rn.value), a = Date.now() / 1e3;
  return be(
    () => t.value.filter((o) => bt(o) > a).length,
    (o, r) => o > r && Bo(!1)
  ), { pins: t, visible: n, minimised: Rn, toggle: s };
}
const Pw = ["title"], jw = {
  key: 0,
  class: "pins-count"
}, qw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Dw(() => t.pinRows);
    return (o, r) => z(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = xe((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      B(ye, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (c(), h("span", jw, x(z(n).length), 1)) : A("", !0)
    ], 10, Pw)) : A("", !0);
  }
}, rx = /* @__PURE__ */ Y(qw, [["__scopeId", "data-v-d073c504"]]), Fw = ["title"], Ww = ["title"], Hw = { class: "diff-card-dir" }, Uw = { class: "diff-card-name" }, zw = ["title"], Vw = ["title"], Gw = {
  key: 0,
  class: "diff-card-note"
}, Kw = ["href"], Yw = ["src", "alt"], Jw = { class: "diff-card-rows" }, Zw = { class: "diff-row-num" }, Xw = { class: "diff-row-sign" }, Qw = { class: "diff-row-code" }, e2 = {
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
    function o($) {
      ($.metaKey || $.ctrlKey) && ($.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = R(() => n.path.lastIndexOf("/") + 1), u = R(() => n.path.slice(0, l.value)), d = R(() => n.path.slice(l.value)), f = R(() => n.kind === "deleted"), v = R(() => r[n.kind]), w = R(() => new Set(n.rows.filter(($) => $.line_type === "add").map(($) => $.line))), E = I("after"), M = R(() => E.value === "before" ? n.whole.old : n.whole.text), S = R(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map(($, b) => ({ line_type: E.value === "after" && w.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: $ })) : n.rows.filter(
      ($) => !(n.editsOnly && ["ctx", "fold"].includes($.line_type)) && !(n.hideRemovals && $.line_type === "del")
    )), C = I(!1), j = R(() => n.lines && !C.value && !n.whole), V = R(() => j.value ? S.value.slice(0, n.lines) : S.value), L = R(() => S.value.length - V.value.length), y = ($) => $.line === null || $.line_type === "del" ? "" : $.line, _ = ($) => $.line_type === "fold" ? $.hidden ? `⋯ ${$.hidden} lines` : "⋯" : $.text, k = I(null), O = I(null);
    let g = null;
    return Fe(() => {
      if (!O.value) return;
      let $ = !0;
      g = new ResizeObserver(() => {
        !k.value || !O.value || (k.value.style.transition = $ ? "none" : "", k.value.style.height = `${O.value.offsetHeight}px`, $ = !1);
      }), g.observe(O.value);
    }), Re(() => g && g.disconnect()), ($, b) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (m) => !f.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          p("span", Hw, x(u.value), 1),
          p("span", Uw, x(d.value), 1),
          v.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.kind])
          }, x(v.value), 3)) : A("", !0)
        ], 8, Ww),
        p("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + x(e.added), 3),
        p("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + x(e.removed), 3),
        B(ss, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: E.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = xe((m) => E.value = E.value === "after" ? "before" : "after", ["stop"]))
        }, x(E.value === "after" ? "After" : "Before"), 9, zw)) : A("", !0),
        f.value ? A("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = xe((m) => s("whole"), ["stop"]))
        }, [
          B(ye, {
            name: "file",
            size: 12
          })
        ], 10, Vw))
      ], 8, Fw),
      e.whole && e.whole.error ? (c(), h("p", Gw, x(e.whole.error), 1)) : A("", !0),
      !f.value && !e.folded ? (c(), h(K, { key: 1 }, [
        e.picture ? (c(), h("a", {
          key: 0,
          class: "diff-card-picture",
          href: e.picture,
          target: "_blank",
          rel: "noopener"
        }, [
          p("img", {
            src: e.picture,
            alt: d.value,
            loading: "lazy"
          }, null, 8, Yw)
        ], 8, Kw)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: k,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: O,
            class: "diff-card-diff"
          }, [
            p("div", Jw, [
              (c(!0), h(K, null, se(V.value, (m, N) => (c(), h("div", {
                key: N,
                class: Z(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                p("span", Zw, x(y(m)), 1),
                p("span", Xw, x(i[m.line_type]), 1),
                p("span", Qw, x(_(m)), 1)
              ], 2))), 128)),
              L.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = xe((m) => C.value = !0, ["stop"]))
              }, x(L.value) + " more " + x(L.value === 1 ? "line" : "lines"), 1)) : A("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : A("", !0)
    ], 2));
  }
}, ix = /* @__PURE__ */ Y(e2, [["__scopeId", "data-v-fed58c18"]]), t2 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(ve, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: F(() => [
        B(ye, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Je = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, n2 = {
  draft: [{ word: "ready", label: "Mark ready" }, Je],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Je],
  approved: [{ word: "start", label: "Start", main: !0 }, Je],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Je],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Je],
  completed: [],
  cancelled: []
}, s2 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Je],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, Je],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, Je],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Je],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, a2 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], o2 = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], r2 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], i2 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], l2 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], c2 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? l2(t) : e === "agent" ? [...r2(t), ...o2(t)] : e === "check" ? i2(t) : e === "question" ? a2(t) : ((n = { plan: n2, task: s2 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, u2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, d2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, h2 = { class: "ask-text" }, f2 = ["placeholder", "aria-label"], m2 = ["placeholder", "aria-label"], p2 = {
  key: 3,
  class: "moves"
}, g2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = R(() => c2(s.kind, s.row)), r = I(""), i = I(null), l = I(""), u = I("");
    be(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(w, E = "") {
      const M = await s.read([w.noun ?? s.kind, w.word, String(s.id), ...w.flag ? [w.flag, E] : w.positional ? [E] : [], ...w.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = M.ok ? "" : M.error, M.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (w) => w.confirm ? i.value = w : w.said ? d(w, w.said) : w.flag || w.positional ? (i.value = w, l.value = "") : d(w), v = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (w, E) => {
      var M;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", u2, x(r.value), 1)) : A("", !0),
        (M = i.value) != null && M.confirm ? (c(), h("div", d2, [
          p("span", h2, x(i.value.confirm), 1),
          B(ve, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: E[0] || (E[0] = (S) => d(i.value))
          }, {
            default: F(() => [
              le(x(i.value.label), 1)
            ]),
            _: 1
          }),
          B(ve, {
            small: "",
            kind: "ghost",
            onClick: E[1] || (E[1] = (S) => i.value = null)
          }, {
            default: F(() => [...E[7] || (E[7] = [
              le("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: xe(v, ["prevent"])
        }, [
          dt(p("input", {
            "onUpdate:modelValue": E[2] || (E[2] = (S) => l.value = S),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: E[3] || (E[3] = Kt(xe((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, f2), [
            [Ns, l.value]
          ]),
          i.value.opener ? dt((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": E[4] || (E[4] = (S) => u.value = S),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: E[5] || (E[5] = Kt(xe((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, m2)), [
            [Ns, u.value]
          ]) : A("", !0),
          B(ve, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: F(() => [
              le(x(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          B(ve, {
            small: "",
            kind: "ghost",
            onClick: E[6] || (E[6] = (S) => i.value = null)
          }, {
            default: F(() => [...E[8] || (E[8] = [
              le("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", p2, [
          (c(!0), h(K, null, se(o.value, (S) => (c(), G(ve, {
            key: S.word,
            small: !S.bordered,
            bordered: S.bordered,
            icon: S.icon,
            kind: S.main ? "primary" : "ghost",
            "data-move": S.word,
            onClick: (C) => f(S)
          }, {
            default: F(() => [
              le(x(S.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : A("", !0);
    };
  }
}, v2 = /* @__PURE__ */ Y(g2, [["__scopeId", "data-v-ed426b4f"]]), y2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), w2 = (e) => y2.has(e), ra = (e) => w2(e) ? "done" : e, k2 = { class: "facts" }, b2 = { class: "fact wide" }, x2 = { class: "fact-value" }, $2 = {
  key: 0,
  class: "fact"
}, M2 = { class: "fact-value" }, S2 = {
  key: 1,
  class: "fact"
}, _2 = { class: "fact-value" }, E2 = { class: "fact wide" }, A2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, C2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Dn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", k2, [
        p("div", b2, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", x2, x((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", $2, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", M2, x(e.place.phase_number) + " of " + x(e.place.phase_total) + ": " + x(e.place.phase_title), 1)
        ])) : A("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", S2, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", _2, "Agent " + x(e.task.holder_id), 1)
        ])) : A("", !0),
        p("div", E2, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          B(Nr, {
            options: z(n),
            value: String(z(Lr)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", A2, x(e.refusal), 1)) : A("", !0)
        ])
      ]);
    };
  }
}, O2 = /* @__PURE__ */ Y(C2, [["__scopeId", "data-v-2018762d"]]), T2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, I2 = { ...T2, done: "Completed" }, R2 = { class: "task-status-icon" }, B2 = ["width", "height", "aria-label"], L2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", R2, [
      B(Bt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: F(() => [
          (c(), h("svg", {
            key: e.status,
            class: Z(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": z(I2)[e.status]
          }, [
            B(ln, { value: e.status }, {
              blocked: F(() => [...n[0] || (n[0] = [
                p("circle", {
                  cx: "6.3",
                  cy: "8",
                  r: "4.7",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "10.8",
                  y: "7.3",
                  width: "3.2",
                  height: "1.4",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                p("circle", {
                  cx: "14.5",
                  cy: "8",
                  r: "1.25",
                  class: "fill"
                }, null, -1)
              ])]),
              done: F(() => [...n[1] || (n[1] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "6.3",
                  class: "fill"
                }, null, -1),
                p("polyline", {
                  points: "5.3,8.2 7.2,10 10.7,6.2",
                  class: "tick"
                }, null, -1)
              ])]),
              started: F(() => [...n[2] || (n[2] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("path", {
                  d: "M8 4.2 A3.8 3.8 0 0 1 8 11.8 Z",
                  class: "fill"
                }, null, -1)
              ])]),
              asked: F(() => [...n[3] || (n[3] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "7.3",
                  y: "4.8",
                  width: "1.4",
                  height: "3.6",
                  rx: "0.7",
                  class: "fill"
                }, null, -1),
                p("circle", {
                  cx: "8",
                  cy: "10.5",
                  r: "0.9",
                  class: "fill"
                }, null, -1)
              ])]),
              paused: F(() => [...n[4] || (n[4] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1),
                p("rect", {
                  x: "6",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1),
                p("rect", {
                  x: "8.7",
                  y: "5.6",
                  width: "1.3",
                  height: "4.8",
                  rx: "0.6",
                  class: "fill"
                }, null, -1)
              ])]),
              planned: F(() => [...n[5] || (n[5] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: F(() => [...n[6] || (n[6] = [
                p("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, B2))
        ]),
        _: 1
      })
    ]));
  }
}, Li = /* @__PURE__ */ Y(L2, [["__scopeId", "data-v-2ab7e404"]]), N2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, D2 = ["onClick"], P2 = { class: "wait-id" }, j2 = { class: "wait-title" }, q2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, F2 = { class: "text" }, W2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, H2 = 180, U2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = I(!1);
    return (a, o) => (c(), h(K, null, [
      e.task.waits.length ? (c(), h("section", N2, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (c(!0), h(K, null, se(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          B(Li, {
            status: z(ra)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", P2, x(r.id), 1),
          p("span", j2, x(r.title), 1)
        ], 8, D2))), 128))
      ])) : A("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", q2, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", F2, x(e.task.outcome), 1)
      ])) : A("", !0),
      e.task.brief ? (c(), h("section", W2, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Z(["text", { clamped: !s.value }])
        }, x(e.task.brief), 3),
        e.task.brief.length > H2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : A("", !0)
      ])) : A("", !0)
    ], 64));
  }
}, z2 = /* @__PURE__ */ Y(U2, [["__scopeId", "data-v-8e4d95ae"]]), V2 = {
  class: "task-details",
  "data-task-details": ""
}, G2 = { class: "since" }, K2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, Y2 = { class: "text" }, J2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, Z2 = {
  key: 1,
  class: "note"
}, X2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, Q2 = { class: "text" }, ek = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", V2, [
        p("div", {
          class: Z(["state-line", z(ra)(e.task.state)])
        }, [
          p("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            B(Li, {
              status: z(ra)(e.task.state)
            }, null, 8, ["status"]),
            le(" " + x(s(e.task.state)), 1)
          ]),
          p("span", G2, [
            o[3] || (o[3] = le(" since ", -1)),
            B(ss, {
              at: z(ma)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", K2, [
          o[4] || (o[4] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
          p("p", Y2, x(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", J2, "Opens by itself when " + x(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", Z2, "Nothing opens it by itself. Unblock it when that is done."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", X2, [
          o[5] || (o[5] = p("span", { class: "label" }, "Why it was cancelled", -1)),
          p("p", Q2, x(e.task.reason), 1)
        ])) : A("", !0),
        B(O2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        B(z2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, tk = /* @__PURE__ */ Y(ek, [["__scopeId", "data-v-4a8b1505"]]), nk = {
  class: "task-log",
  "aria-label": "Task log"
}, sk = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, ak = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, ok = { class: "entries" }, rk = ["datetime"], ik = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, lk = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = I([]), s = I(1), a = I(!0), o = I(!0), r = I("");
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
    return be(
      () => [t.id, t.changes],
      () => {
        n.value = [], l();
      },
      { immediate: !0 }
    ), Nt(() => {
      i += 1;
    }), (u, d) => (c(), h("section", nk, [
      o.value ? (c(), G(Dt, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        p("p", sk, x(r.value), 1),
        B(ve, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => l(s.value))
        }, {
          default: F(() => [...d[3] || (d[3] = [
            le("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(K, { key: 2 }, [
        n.value.length ? A("", !0) : (c(), h("p", ak, "No log entries yet.")),
        p("ol", ok, [
          (c(!0), h(K, null, se(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            p("time", {
              datetime: f.created_at
            }, x(new Date(f.created_at).toLocaleString()), 9, rk),
            p("p", null, x(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", ik, [
          B(ve, {
            small: "",
            bordered: "",
            disabled: s.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => l(s.value - 1))
          }, {
            default: F(() => [...d[4] || (d[4] = [
              le("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          p("span", null, "Page " + x(s.value), 1),
          B(ve, {
            small: "",
            bordered: "",
            disabled: a.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => l(s.value + 1))
          }, {
            default: F(() => [...d[5] || (d[5] = [
              le("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : A("", !0)
      ], 64))
    ]));
  }
}, ck = /* @__PURE__ */ Y(lk, [["__scopeId", "data-v-953605e5"]]), uk = { class: "comment-side-head" }, dk = {
  key: 0,
  class: "comment-none"
}, hk = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", uk, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        B(Yn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? A("", !0) : (c(), h("p", dk, "No comments yet")),
      (c(!0), h(K, null, se(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, x(e.words(s)), 1))), 128))
    ], 2));
  }
}, fk = /* @__PURE__ */ Y(hk, [["__scopeId", "data-v-19fdbdd4"]]);
var No;
/Mac|iPhone|iPad/.test(((No = navigator.userAgentData) == null ? void 0 : No.platform) || navigator.platform);
function mk(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const pk = ["placeholder"], gk = { class: "actions" }, vk = { class: "error" }, yk = {
  key: 1,
  class: "card closed"
}, wk = { class: "mark" }, kk = { class: "prompt" }, bk = {
  key: 0,
  class: "draft"
}, xk = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ls({
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
  emits: /* @__PURE__ */ Ls(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Bs(e, "draft"), r = Bs(e, "error"), i = I(!!r.value), l = I(!1), u = I(!1), d = I(null);
    async function f() {
      var E, M;
      i.value = !0, l.value = !1, await Lt(), (M = ((E = d.value) == null ? void 0 : E.querySelector("input")) || d.value) == null || M.focus();
    }
    function v() {
      i.value = !1, r.value = "";
    }
    async function w() {
      const E = o.value.trim();
      if (!(!E || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(E), i.value = !1, l.value = !0;
        } catch (M) {
          o.value = E, r.value = M.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (E, M) => (c(), h("div", {
      class: Z(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: xe(w, ["prevent"]),
        onKeydown: Kt(v, ["esc"])
      }, [
        me(E.$slots, "who", {}, void 0, !0),
        dt(p("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": M[0] || (M[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: M[1] || (M[1] = Kt((S) => z(mk)(S, w), ["enter"]))
        }, null, 40, pk), [
          [Ns, o.value]
        ]),
        p("div", gk, [
          p("span", vk, x(r.value), 1),
          B(ve, {
            small: "",
            onClick: v
          }, {
            default: F(() => [...M[3] || (M[3] = [
              le("Cancel", -1)
            ])]),
            _: 1
          }),
          B(ve, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: w
          }, {
            default: F(() => [...M[4] || (M[4] = [
              le("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", yk, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          p("span", wk, [
            B(ye, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", kk, x(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", bk, "Draft kept")) : A("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: M[2] || (M[2] = (S) => a("show"))
        }, [
          p("span", null, x(z(cm)(e.count, "comment")), 1),
          B(ye, {
            name: "down",
            size: 12
          })
        ])) : A("", !0)
      ]))
    ], 2));
  }
}, $k = /* @__PURE__ */ Y(xk, [["__scopeId", "data-v-81f478d2"]]);
function Mk(e, t) {
  const n = I([]), s = I(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: v } = e(), w = `On ${d} ${f}, ${v}: `;
    return u.text.startsWith(w) ? u.text.slice(w.length) : u.text;
  };
  async function i() {
    const { kind: u, id: d } = e();
    if (!d) return;
    const f = ++o, v = await t([u, "comments", String(d)]);
    f === o && (n.value = v.ok ? v.value.rows ?? [] : []);
  }
  async function l(u) {
    const { kind: d, id: f } = e(), v = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, v], s.value = !0;
    const w = await t([d, "comment", String(f), u]);
    if (!w.ok)
      throw n.value = n.value.filter((E) => E !== v && E.id !== v.id), new Error(w.error);
    await i();
  }
  return be(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const Sk = { class: "top" }, _k = {
  class: "crumb",
  "data-task-crumb": ""
}, Ek = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Ak = {
  key: 1,
  class: "body"
}, Ck = { class: "summary" }, Ok = { class: "stamp" }, Tk = {
  class: "title",
  "data-resource-title": ""
}, Ik = {
  class: "tabs",
  "data-task-tabs": ""
}, Rk = { class: "panels" }, Bk = {
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
    const s = e, a = n, o = I(null), r = I(null), i = I(""), l = I(""), u = I(null), d = I(null), f = I("details"), v = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], w = Mk(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (L) => s.read(L)
    );
    let E = 0;
    const M = R(() => {
      var L;
      return (L = r.value) != null && L.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function S() {
      const L = ++E, [y, _] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      L === E && (i.value = y.ok ? "" : y.error, o.value = y.ok ? y.value : null, r.value = _.ok ? _.value : null);
    }
    be(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", S();
      },
      { immediate: !0 }
    ), be(() => s.changes, S), be(w.open, (L) => {
      L && (f.value = "comments");
    });
    async function C(L) {
      const y = o.value.priority;
      o.value.priority = Number(L);
      const _ = await s.read(["task", "edit", String(s.id), "--priority", L]);
      if (l.value = _.ok ? "" : _.error, _.ok) return S();
      o.value.priority = y;
    }
    function j(L) {
      u.value = null, d.value.press(L);
    }
    const V = (L) => {
      var y;
      return ((y = d.value) == null ? void 0 : y.moves.length) && (u.value = L);
    };
    return t({ openStatus: V }), (L, y) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", Sk, [
        e.backed ? (c(), G(t2, {
          key: 0,
          onBack: y[0] || (y[0] = (_) => a("back"))
        })) : A("", !0),
        p("span", _k, x(M.value), 1),
        y[9] || (y[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          B(ve, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: y[1] || (y[1] = (_) => a("step", -1))
          }, {
            default: F(() => [
              B(ye, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          B(ve, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: y[2] || (y[2] = (_) => a("step", 1))
          }, {
            default: F(() => [
              B(ye, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : A("", !0),
        B(ve, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: y[3] || (y[3] = (_) => a("close"))
        }, {
          default: F(() => [
            B(ye, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", Ek, x(i.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        B(v2, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: S
        }, null, 8, ["id", "row", "read"]),
        p("header", Ck, [
          p("div", Ok, [
            le(" Task " + x(o.value.id) + " · updated ", 1),
            B(ss, {
              at: z(ma)(o.value)
            }, null, 8, ["at"])
          ]),
          p("h3", Tk, x(o.value.title), 1)
        ]),
        p("div", Ik, [
          B(Nr, {
            options: v,
            value: f.value,
            onPick: y[4] || (y[4] = (_) => f.value = _)
          }, null, 8, ["value"])
        ]),
        p("div", Rk, [
          B(ln, { value: f.value }, {
            details: F(() => [
              B(tk, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: V,
                onPriority: C,
                onSelect: y[5] || (y[5] = (_) => a("select", _))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: F(() => [
              B(fk, {
                below: "",
                comments: z(w).comments.value,
                words: z(w).words,
                onClose: y[6] || (y[6] = (_) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: F(() => [
              B(ck, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        B($k, {
          send: z(w).send,
          count: z(w).comments.value.length,
          onShow: y[7] || (y[7] = (_) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", Ak, [
        B(Dt)
      ])),
      u.value ? (c(), G(ka, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: y[8] || (y[8] = (_) => u.value = null)
      }, {
        default: F(() => [
          B(aa, null, {
            default: F(() => [
              le("Change the status of task " + x(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(K, null, se(d.value.moves, (_) => (c(), G(It, {
            key: _.word,
            onClick: (k) => j(_)
          }, {
            default: F(() => [
              le(x(_.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : A("", !0)
    ], 2));
  }
}, lx = /* @__PURE__ */ Y(Bk, [["__scopeId", "data-v-43f3b122"]]);
function Lk(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Rs = { exports: {} }, Lo;
function Nk() {
  return Lo || (Lo = 1, (function(e, t) {
    var n = (function() {
      var s = function(y, _) {
        var k = 236, O = 17, g = y, $ = o[_], b = null, m = 0, N = null, D = [], W = {}, re = function(P, q) {
          m = g * 4 + 17, b = (function(T) {
            for (var H = new Array(T), U = 0; U < T; U += 1) {
              H[U] = new Array(T);
              for (var X = 0; X < T; X += 1)
                H[U][X] = null;
            }
            return H;
          })(m), ce(0, 0), ce(m - 7, 0), ce(0, m - 7), ee(), Q(), Le(P, q), g >= 7 && J(P), N == null && (N = Ni(g, $, D)), Ge(N, q);
        }, ce = function(P, q) {
          for (var T = -1; T <= 7; T += 1)
            if (!(P + T <= -1 || m <= P + T))
              for (var H = -1; H <= 7; H += 1)
                q + H <= -1 || m <= q + H || (0 <= T && T <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (T == 0 || T == 6) || 2 <= T && T <= 4 && 2 <= H && H <= 4 ? b[P + T][q + H] = !0 : b[P + T][q + H] = !1);
        }, de = function() {
          for (var P = 0, q = 0, T = 0; T < 8; T += 1) {
            re(!0, T);
            var H = i.getLostPoint(W);
            (T == 0 || P > H) && (P = H, q = T);
          }
          return q;
        }, Q = function() {
          for (var P = 8; P < m - 8; P += 1)
            b[P][6] == null && (b[P][6] = P % 2 == 0);
          for (var q = 8; q < m - 8; q += 1)
            b[6][q] == null && (b[6][q] = q % 2 == 0);
        }, ee = function() {
          for (var P = i.getPatternPosition(g), q = 0; q < P.length; q += 1)
            for (var T = 0; T < P.length; T += 1) {
              var H = P[q], U = P[T];
              if (b[H][U] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? b[H + X][U + ae] = !0 : b[H + X][U + ae] = !1;
            }
        }, J = function(P) {
          for (var q = i.getBCHTypeNumber(g), T = 0; T < 18; T += 1) {
            var H = !P && (q >> T & 1) == 1;
            b[Math.floor(T / 3)][T % 3 + m - 8 - 3] = H;
          }
          for (var T = 0; T < 18; T += 1) {
            var H = !P && (q >> T & 1) == 1;
            b[T % 3 + m - 8 - 3][Math.floor(T / 3)] = H;
          }
        }, Le = function(P, q) {
          for (var T = $ << 3 | q, H = i.getBCHTypeInfo(T), U = 0; U < 15; U += 1) {
            var X = !P && (H >> U & 1) == 1;
            U < 6 ? b[U][8] = X : U < 8 ? b[U + 1][8] = X : b[m - 15 + U][8] = X;
          }
          for (var U = 0; U < 15; U += 1) {
            var X = !P && (H >> U & 1) == 1;
            U < 8 ? b[8][m - U - 1] = X : U < 9 ? b[8][15 - U - 1 + 1] = X : b[8][15 - U - 1] = X;
          }
          b[m - 8][8] = !P;
        }, Ge = function(P, q) {
          for (var T = -1, H = m - 1, U = 7, X = 0, ae = i.getMaskFunction(q), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var ke = 0; ke < 2; ke += 1)
                if (b[H][ne - ke] == null) {
                  var Me = !1;
                  X < P.length && (Me = (P[X] >>> U & 1) == 1);
                  var ie = ae(H, ne - ke);
                  ie && (Me = !Me), b[H][ne - ke] = Me, U -= 1, U == -1 && (X += 1, U = 7);
                }
              if (H += T, H < 0 || m <= H) {
                H -= T, T = -T;
                break;
              }
            }
        }, St = function(P, q) {
          for (var T = 0, H = 0, U = 0, X = new Array(q.length), ae = new Array(q.length), ne = 0; ne < q.length; ne += 1) {
            var ke = q[ne].dataCount, Me = q[ne].totalCount - ke;
            H = Math.max(H, ke), U = Math.max(U, Me), X[ne] = new Array(ke);
            for (var ie = 0; ie < X[ne].length; ie += 1)
              X[ne][ie] = 255 & P.getBuffer()[ie + T];
            T += ke;
            var Ne = i.getErrorCorrectPolynomial(Me), De = u(X[ne], Ne.getLength() - 1), Ra = De.mod(Ne);
            ae[ne] = new Array(Ne.getLength() - 1);
            for (var ie = 0; ie < ae[ne].length; ie += 1) {
              var Ba = ie + Ra.getLength() - ae[ne].length;
              ae[ne][ie] = Ba >= 0 ? Ra.getAt(Ba) : 0;
            }
          }
          for (var La = 0, ie = 0; ie < q.length; ie += 1)
            La += q[ie].totalCount;
          for (var as = new Array(La), yn = 0, ie = 0; ie < H; ie += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              ie < X[ne].length && (as[yn] = X[ne][ie], yn += 1);
          for (var ie = 0; ie < U; ie += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              ie < ae[ne].length && (as[yn] = ae[ne][ie], yn += 1);
          return as;
        }, Ni = function(P, q, T) {
          for (var H = d.getRSBlocks(P, q), U = f(), X = 0; X < T.length; X += 1) {
            var ae = T[X];
            U.put(ae.getMode(), 4), U.put(ae.getLength(), i.getLengthInBits(ae.getMode(), P)), ae.write(U);
          }
          for (var ne = 0, X = 0; X < H.length; X += 1)
            ne += H[X].dataCount;
          if (U.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + U.getLengthInBits() + ">" + ne * 8 + ")";
          for (U.getLengthInBits() + 4 <= ne * 8 && U.put(0, 4); U.getLengthInBits() % 8 != 0; )
            U.putBit(!1);
          for (; !(U.getLengthInBits() >= ne * 8 || (U.put(k, 8), U.getLengthInBits() >= ne * 8)); )
            U.put(O, 8);
          return St(U, H);
        };
        W.addData = function(P, q) {
          q = q || "Byte";
          var T = null;
          switch (q) {
            case "Numeric":
              T = v(P);
              break;
            case "Alphanumeric":
              T = w(P);
              break;
            case "Byte":
              T = E(P);
              break;
            case "Kanji":
              T = M(P);
              break;
            default:
              throw "mode:" + q;
          }
          D.push(T), N = null;
        }, W.isDark = function(P, q) {
          if (P < 0 || m <= P || q < 0 || m <= q)
            throw P + "," + q;
          return b[P][q];
        }, W.getModuleCount = function() {
          return m;
        }, W.make = function() {
          if (g < 1) {
            for (var P = 1; P < 40; P++) {
              for (var q = d.getRSBlocks(P, $), T = f(), H = 0; H < D.length; H++) {
                var U = D[H];
                T.put(U.getMode(), 4), T.put(U.getLength(), i.getLengthInBits(U.getMode(), P)), U.write(T);
              }
              for (var X = 0, H = 0; H < q.length; H++)
                X += q[H].dataCount;
              if (T.getLengthInBits() <= X * 8)
                break;
            }
            g = P;
          }
          re(!1, de());
        }, W.createTableTag = function(P, q) {
          P = P || 2, q = typeof q > "u" ? P * 4 : q;
          var T = "";
          T += '<table style="', T += " border-width: 0px; border-style: none;", T += " border-collapse: collapse;", T += " padding: 0px; margin: " + q + "px;", T += '">', T += "<tbody>";
          for (var H = 0; H < W.getModuleCount(); H += 1) {
            T += "<tr>";
            for (var U = 0; U < W.getModuleCount(); U += 1)
              T += '<td style="', T += " border-width: 0px; border-style: none;", T += " border-collapse: collapse;", T += " padding: 0px; margin: 0px;", T += " width: " + P + "px;", T += " height: " + P + "px;", T += " background-color: ", T += W.isDark(H, U) ? "#000000" : "#ffffff", T += ";", T += '"/>';
            T += "</tr>";
          }
          return T += "</tbody>", T += "</table>", T;
        }, W.createSvgTag = function(P, q, T, H) {
          var U = {};
          typeof arguments[0] == "object" && (U = arguments[0], P = U.cellSize, q = U.margin, T = U.alt, H = U.title), P = P || 2, q = typeof q > "u" ? P * 4 : q, T = typeof T == "string" ? { text: T } : T || {}, T.text = T.text || null, T.id = T.text ? T.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var X = W.getModuleCount() * P + q * 2, ae, ne, ke, Me, ie = "", Ne;
          for (Ne = "l" + P + ",0 0," + P + " -" + P + ",0 0,-" + P + "z ", ie += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', ie += U.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', ie += ' viewBox="0 0 ' + X + " " + X + '" ', ie += ' preserveAspectRatio="xMinYMin meet"', ie += H.text || T.text ? ' role="img" aria-labelledby="' + _t([H.id, T.id].join(" ").trim()) + '"' : "", ie += ">", ie += H.text ? '<title id="' + _t(H.id) + '">' + _t(H.text) + "</title>" : "", ie += T.text ? '<description id="' + _t(T.id) + '">' + _t(T.text) + "</description>" : "", ie += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', ie += '<path d="', ke = 0; ke < W.getModuleCount(); ke += 1)
            for (Me = ke * P + q, ae = 0; ae < W.getModuleCount(); ae += 1)
              W.isDark(ke, ae) && (ne = ae * P + q, ie += "M" + ne + "," + Me + Ne);
          return ie += '" stroke="transparent" fill="black"/>', ie += "</svg>", ie;
        }, W.createDataURL = function(P, q) {
          P = P || 2, q = typeof q > "u" ? P * 4 : q;
          var T = W.getModuleCount() * P + q * 2, H = q, U = T - q;
          return L(T, T, function(X, ae) {
            if (H <= X && X < U && H <= ae && ae < U) {
              var ne = Math.floor((X - H) / P), ke = Math.floor((ae - H) / P);
              return W.isDark(ke, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, W.createImgTag = function(P, q, T) {
          P = P || 2, q = typeof q > "u" ? P * 4 : q;
          var H = W.getModuleCount() * P + q * 2, U = "";
          return U += "<img", U += ' src="', U += W.createDataURL(P, q), U += '"', U += ' width="', U += H, U += '"', U += ' height="', U += H, U += '"', T && (U += ' alt="', U += _t(T), U += '"'), U += "/>", U;
        };
        var _t = function(P) {
          for (var q = "", T = 0; T < P.length; T += 1) {
            var H = P.charAt(T);
            switch (H) {
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
                q += H;
                break;
            }
          }
          return q;
        }, Di = function(P) {
          var q = 1;
          P = typeof P > "u" ? q * 2 : P;
          var T = W.getModuleCount() * q + P * 2, H = P, U = T - P, X, ae, ne, ke, Me, ie = {
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
          for (X = 0; X < T; X += 2) {
            for (ne = Math.floor((X - H) / q), ke = Math.floor((X + 1 - H) / q), ae = 0; ae < T; ae += 1)
              Me = "█", H <= ae && ae < U && H <= X && X < U && W.isDark(ne, Math.floor((ae - H) / q)) && (Me = " "), H <= ae && ae < U && H <= X + 1 && X + 1 < U && W.isDark(ke, Math.floor((ae - H) / q)) ? Me += " " : Me += "█", De += P < 1 && X + 1 >= U ? Ne[Me] : ie[Me];
            De += `
`;
          }
          return T % 2 && P > 0 ? De.substring(0, De.length - T - 1) + Array(T + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return W.createASCII = function(P, q) {
          if (P = P || 1, P < 2)
            return Di(q);
          P -= 1, q = typeof q > "u" ? P * 2 : q;
          var T = W.getModuleCount() * P + q * 2, H = q, U = T - q, X, ae, ne, ke, Me = Array(P + 1).join("██"), ie = Array(P + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < T; X += 1) {
            for (ne = Math.floor((X - H) / P), De = "", ae = 0; ae < T; ae += 1)
              ke = 1, H <= ae && ae < U && H <= X && X < U && W.isDark(ne, Math.floor((ae - H) / P)) && (ke = 0), De += ke ? Me : ie;
            for (ne = 0; ne < P; ne += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, W.renderTo2dContext = function(P, q) {
          q = q || 2;
          for (var T = W.getModuleCount(), H = 0; H < T; H++)
            for (var U = 0; U < T; U++)
              P.fillStyle = W.isDark(H, U) ? "black" : "white", P.fillRect(H * q, U * q, q, q);
        }, W;
      };
      s.stringToBytesFuncs = {
        default: function(y) {
          for (var _ = [], k = 0; k < y.length; k += 1) {
            var O = y.charCodeAt(k);
            _.push(O & 255);
          }
          return _;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(y, _) {
        var k = (function() {
          for (var g = j(y), $ = function() {
            var Q = g.read();
            if (Q == -1) throw "eof";
            return Q;
          }, b = 0, m = {}; ; ) {
            var N = g.read();
            if (N == -1) break;
            var D = $(), W = $(), re = $(), ce = String.fromCharCode(N << 8 | D), de = W << 8 | re;
            m[ce] = de, b += 1;
          }
          if (b != _)
            throw b + " != " + _;
          return m;
        })(), O = 63;
        return function(g) {
          for (var $ = [], b = 0; b < g.length; b += 1) {
            var m = g.charCodeAt(b);
            if (m < 128)
              $.push(m);
            else {
              var N = k[g.charAt(b)];
              typeof N == "number" ? (N & 255) == N ? $.push(N) : ($.push(N >>> 8), $.push(N & 255)) : $.push(O);
            }
          }
          return $;
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
        ], _ = 1335, k = 7973, O = 21522, g = {}, $ = function(b) {
          for (var m = 0; b != 0; )
            m += 1, b >>>= 1;
          return m;
        };
        return g.getBCHTypeInfo = function(b) {
          for (var m = b << 10; $(m) - $(_) >= 0; )
            m ^= _ << $(m) - $(_);
          return (b << 10 | m) ^ O;
        }, g.getBCHTypeNumber = function(b) {
          for (var m = b << 12; $(m) - $(k) >= 0; )
            m ^= k << $(m) - $(k);
          return b << 12 | m;
        }, g.getPatternPosition = function(b) {
          return y[b - 1];
        }, g.getMaskFunction = function(b) {
          switch (b) {
            case r.PATTERN000:
              return function(m, N) {
                return (m + N) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, N) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, N) {
                return N % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, N) {
                return (m + N) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, N) {
                return (Math.floor(m / 2) + Math.floor(N / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, N) {
                return m * N % 2 + m * N % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, N) {
                return (m * N % 2 + m * N % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, N) {
                return (m * N % 3 + (m + N) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, g.getErrorCorrectPolynomial = function(b) {
          for (var m = u([1], 0), N = 0; N < b; N += 1)
            m = m.multiply(u([1, l.gexp(N)], 0));
          return m;
        }, g.getLengthInBits = function(b, m) {
          if (1 <= m && m < 10)
            switch (b) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + b;
            }
          else if (m < 27)
            switch (b) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + b;
            }
          else if (m < 41)
            switch (b) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + b;
            }
          else
            throw "type:" + m;
        }, g.getLostPoint = function(b) {
          for (var m = b.getModuleCount(), N = 0, D = 0; D < m; D += 1)
            for (var W = 0; W < m; W += 1) {
              for (var re = 0, ce = b.isDark(D, W), de = -1; de <= 1; de += 1)
                if (!(D + de < 0 || m <= D + de))
                  for (var Q = -1; Q <= 1; Q += 1)
                    W + Q < 0 || m <= W + Q || de == 0 && Q == 0 || ce == b.isDark(D + de, W + Q) && (re += 1);
              re > 5 && (N += 3 + re - 5);
            }
          for (var D = 0; D < m - 1; D += 1)
            for (var W = 0; W < m - 1; W += 1) {
              var ee = 0;
              b.isDark(D, W) && (ee += 1), b.isDark(D + 1, W) && (ee += 1), b.isDark(D, W + 1) && (ee += 1), b.isDark(D + 1, W + 1) && (ee += 1), (ee == 0 || ee == 4) && (N += 3);
            }
          for (var D = 0; D < m; D += 1)
            for (var W = 0; W < m - 6; W += 1)
              b.isDark(D, W) && !b.isDark(D, W + 1) && b.isDark(D, W + 2) && b.isDark(D, W + 3) && b.isDark(D, W + 4) && !b.isDark(D, W + 5) && b.isDark(D, W + 6) && (N += 40);
          for (var W = 0; W < m; W += 1)
            for (var D = 0; D < m - 6; D += 1)
              b.isDark(D, W) && !b.isDark(D + 1, W) && b.isDark(D + 2, W) && b.isDark(D + 3, W) && b.isDark(D + 4, W) && !b.isDark(D + 5, W) && b.isDark(D + 6, W) && (N += 40);
          for (var J = 0, W = 0; W < m; W += 1)
            for (var D = 0; D < m; D += 1)
              b.isDark(D, W) && (J += 1);
          var Le = Math.abs(100 * J / m / m - 50) / 5;
          return N += Le * 10, N;
        }, g;
      })(), l = (function() {
        for (var y = new Array(256), _ = new Array(256), k = 0; k < 8; k += 1)
          y[k] = 1 << k;
        for (var k = 8; k < 256; k += 1)
          y[k] = y[k - 4] ^ y[k - 5] ^ y[k - 6] ^ y[k - 8];
        for (var k = 0; k < 255; k += 1)
          _[y[k]] = k;
        var O = {};
        return O.glog = function(g) {
          if (g < 1)
            throw "glog(" + g + ")";
          return _[g];
        }, O.gexp = function(g) {
          for (; g < 0; )
            g += 255;
          for (; g >= 256; )
            g -= 255;
          return y[g];
        }, O;
      })();
      function u(y, _) {
        if (typeof y.length > "u")
          throw y.length + "/" + _;
        var k = (function() {
          for (var g = 0; g < y.length && y[g] == 0; )
            g += 1;
          for (var $ = new Array(y.length - g + _), b = 0; b < y.length - g; b += 1)
            $[b] = y[b + g];
          return $;
        })(), O = {};
        return O.getAt = function(g) {
          return k[g];
        }, O.getLength = function() {
          return k.length;
        }, O.multiply = function(g) {
          for (var $ = new Array(O.getLength() + g.getLength() - 1), b = 0; b < O.getLength(); b += 1)
            for (var m = 0; m < g.getLength(); m += 1)
              $[b + m] ^= l.gexp(l.glog(O.getAt(b)) + l.glog(g.getAt(m)));
          return u($, 0);
        }, O.mod = function(g) {
          if (O.getLength() - g.getLength() < 0)
            return O;
          for (var $ = l.glog(O.getAt(0)) - l.glog(g.getAt(0)), b = new Array(O.getLength()), m = 0; m < O.getLength(); m += 1)
            b[m] = O.getAt(m);
          for (var m = 0; m < g.getLength(); m += 1)
            b[m] ^= l.gexp(l.glog(g.getAt(m)) + $);
          return u(b, 0).mod(g);
        }, O;
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
        ], _ = function(g, $) {
          var b = {};
          return b.totalCount = g, b.dataCount = $, b;
        }, k = {}, O = function(g, $) {
          switch ($) {
            case o.L:
              return y[(g - 1) * 4 + 0];
            case o.M:
              return y[(g - 1) * 4 + 1];
            case o.Q:
              return y[(g - 1) * 4 + 2];
            case o.H:
              return y[(g - 1) * 4 + 3];
            default:
              return;
          }
        };
        return k.getRSBlocks = function(g, $) {
          var b = O(g, $);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + g + "/errorCorrectionLevel:" + $;
          for (var m = b.length / 3, N = [], D = 0; D < m; D += 1)
            for (var W = b[D * 3 + 0], re = b[D * 3 + 1], ce = b[D * 3 + 2], de = 0; de < W; de += 1)
              N.push(_(re, ce));
          return N;
        }, k;
      })(), f = function() {
        var y = [], _ = 0, k = {};
        return k.getBuffer = function() {
          return y;
        }, k.getAt = function(O) {
          var g = Math.floor(O / 8);
          return (y[g] >>> 7 - O % 8 & 1) == 1;
        }, k.put = function(O, g) {
          for (var $ = 0; $ < g; $ += 1)
            k.putBit((O >>> g - $ - 1 & 1) == 1);
        }, k.getLengthInBits = function() {
          return _;
        }, k.putBit = function(O) {
          var g = Math.floor(_ / 8);
          y.length <= g && y.push(0), O && (y[g] |= 128 >>> _ % 8), _ += 1;
        }, k;
      }, v = function(y) {
        var _ = a.MODE_NUMBER, k = y, O = {};
        O.getMode = function() {
          return _;
        }, O.getLength = function(b) {
          return k.length;
        }, O.write = function(b) {
          for (var m = k, N = 0; N + 2 < m.length; )
            b.put(g(m.substring(N, N + 3)), 10), N += 3;
          N < m.length && (m.length - N == 1 ? b.put(g(m.substring(N, N + 1)), 4) : m.length - N == 2 && b.put(g(m.substring(N, N + 2)), 7));
        };
        var g = function(b) {
          for (var m = 0, N = 0; N < b.length; N += 1)
            m = m * 10 + $(b.charAt(N));
          return m;
        }, $ = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return O;
      }, w = function(y) {
        var _ = a.MODE_ALPHA_NUM, k = y, O = {};
        O.getMode = function() {
          return _;
        }, O.getLength = function($) {
          return k.length;
        }, O.write = function($) {
          for (var b = k, m = 0; m + 1 < b.length; )
            $.put(
              g(b.charAt(m)) * 45 + g(b.charAt(m + 1)),
              11
            ), m += 2;
          m < b.length && $.put(g(b.charAt(m)), 6);
        };
        var g = function($) {
          if ("0" <= $ && $ <= "9")
            return $.charCodeAt(0) - 48;
          if ("A" <= $ && $ <= "Z")
            return $.charCodeAt(0) - 65 + 10;
          switch ($) {
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
              throw "illegal char :" + $;
          }
        };
        return O;
      }, E = function(y) {
        var _ = a.MODE_8BIT_BYTE, k = s.stringToBytes(y), O = {};
        return O.getMode = function() {
          return _;
        }, O.getLength = function(g) {
          return k.length;
        }, O.write = function(g) {
          for (var $ = 0; $ < k.length; $ += 1)
            g.put(k[$], 8);
        }, O;
      }, M = function(y) {
        var _ = a.MODE_KANJI, k = s.stringToBytesFuncs.SJIS;
        if (!k)
          throw "sjis not supported.";
        (function($, b) {
          var m = k($);
          if (m.length != 2 || (m[0] << 8 | m[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var O = k(y), g = {};
        return g.getMode = function() {
          return _;
        }, g.getLength = function($) {
          return ~~(O.length / 2);
        }, g.write = function($) {
          for (var b = O, m = 0; m + 1 < b.length; ) {
            var N = (255 & b[m]) << 8 | 255 & b[m + 1];
            if (33088 <= N && N <= 40956)
              N -= 33088;
            else if (57408 <= N && N <= 60351)
              N -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + N;
            N = (N >>> 8 & 255) * 192 + (N & 255), $.put(N, 13), m += 2;
          }
          if (m < b.length)
            throw "illegal char at " + (m + 1);
        }, g;
      }, S = function() {
        var y = [], _ = {};
        return _.writeByte = function(k) {
          y.push(k & 255);
        }, _.writeShort = function(k) {
          _.writeByte(k), _.writeByte(k >>> 8);
        }, _.writeBytes = function(k, O, g) {
          O = O || 0, g = g || k.length;
          for (var $ = 0; $ < g; $ += 1)
            _.writeByte(k[$ + O]);
        }, _.writeString = function(k) {
          for (var O = 0; O < k.length; O += 1)
            _.writeByte(k.charCodeAt(O));
        }, _.toByteArray = function() {
          return y;
        }, _.toString = function() {
          var k = "";
          k += "[";
          for (var O = 0; O < y.length; O += 1)
            O > 0 && (k += ","), k += y[O];
          return k += "]", k;
        }, _;
      }, C = function() {
        var y = 0, _ = 0, k = 0, O = "", g = {}, $ = function(m) {
          O += String.fromCharCode(b(m & 63));
        }, b = function(m) {
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
        return g.writeByte = function(m) {
          for (y = y << 8 | m & 255, _ += 8, k += 1; _ >= 6; )
            $(y >>> _ - 6), _ -= 6;
        }, g.flush = function() {
          if (_ > 0 && ($(y << 6 - _), y = 0, _ = 0), k % 3 != 0)
            for (var m = 3 - k % 3, N = 0; N < m; N += 1)
              O += "=";
        }, g.toString = function() {
          return O;
        }, g;
      }, j = function(y) {
        var _ = y, k = 0, O = 0, g = 0, $ = {};
        $.read = function() {
          for (; g < 8; ) {
            if (k >= _.length) {
              if (g == 0)
                return -1;
              throw "unexpected end of file./" + g;
            }
            var m = _.charAt(k);
            if (k += 1, m == "=")
              return g = 0, -1;
            if (m.match(/^\s$/))
              continue;
            O = O << 6 | b(m.charCodeAt(0)), g += 6;
          }
          var N = O >>> g - 8 & 255;
          return g -= 8, N;
        };
        var b = function(m) {
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
        return $;
      }, V = function(y, _) {
        var k = y, O = _, g = new Array(y * _), $ = {};
        $.setPixel = function(D, W, re) {
          g[W * k + D] = re;
        }, $.write = function(D) {
          D.writeString("GIF87a"), D.writeShort(k), D.writeShort(O), D.writeByte(128), D.writeByte(0), D.writeByte(0), D.writeByte(0), D.writeByte(0), D.writeByte(0), D.writeByte(255), D.writeByte(255), D.writeByte(255), D.writeString(","), D.writeShort(0), D.writeShort(0), D.writeShort(k), D.writeShort(O), D.writeByte(0);
          var W = 2, re = m(W);
          D.writeByte(W);
          for (var ce = 0; re.length - ce > 255; )
            D.writeByte(255), D.writeBytes(re, ce, 255), ce += 255;
          D.writeByte(re.length - ce), D.writeBytes(re, ce, re.length - ce), D.writeByte(0), D.writeString(";");
        };
        var b = function(D) {
          var W = D, re = 0, ce = 0, de = {};
          return de.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              W.writeByte(255 & (Q << re | ce)), ee -= 8 - re, Q >>>= 8 - re, ce = 0, re = 0;
            ce = Q << re | ce, re = re + ee;
          }, de.flush = function() {
            re > 0 && W.writeByte(ce);
          }, de;
        }, m = function(D) {
          for (var W = 1 << D, re = (1 << D) + 1, ce = D + 1, de = N(), Q = 0; Q < W; Q += 1)
            de.add(String.fromCharCode(Q));
          de.add(String.fromCharCode(W)), de.add(String.fromCharCode(re));
          var ee = S(), J = b(ee);
          J.write(W, ce);
          var Le = 0, Ge = String.fromCharCode(g[Le]);
          for (Le += 1; Le < g.length; ) {
            var St = String.fromCharCode(g[Le]);
            Le += 1, de.contains(Ge + St) ? Ge = Ge + St : (J.write(de.indexOf(Ge), ce), de.size() < 4095 && (de.size() == 1 << ce && (ce += 1), de.add(Ge + St)), Ge = St);
          }
          return J.write(de.indexOf(Ge), ce), J.write(re, ce), J.flush(), ee.toByteArray();
        }, N = function() {
          var D = {}, W = 0, re = {};
          return re.add = function(ce) {
            if (re.contains(ce))
              throw "dup key:" + ce;
            D[ce] = W, W += 1;
          }, re.size = function() {
            return W;
          }, re.indexOf = function(ce) {
            return D[ce];
          }, re.contains = function(ce) {
            return typeof D[ce] < "u";
          }, re;
        };
        return $;
      }, L = function(y, _, k) {
        for (var O = V(y, _), g = 0; g < _; g += 1)
          for (var $ = 0; $ < y; $ += 1)
            O.setPixel($, g, k($, g));
        var b = S();
        O.write(b);
        for (var m = C(), N = b.toByteArray(), D = 0; D < N.length; D += 1)
          m.writeByte(N[D]);
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
  })(Rs)), Rs.exports;
}
var Dk = Nk();
const Pk = /* @__PURE__ */ Lk(Dk), jk = ["width", "height", "viewBox"], qk = ["width", "height"], Fk = ["d"], Wk = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = R(() => {
      const s = Pk(0, "M");
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
      p("rect", {
        width: n.value.count,
        height: n.value.count,
        fill: "#fff"
      }, null, 8, qk),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Fk)
    ], 8, jk));
  }
}, cx = /* @__PURE__ */ Y(Wk, [["__scopeId", "data-v-489f0852"]]), Hk = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: pe({ padding: e.padding })
    }, [
      me(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, ux = /* @__PURE__ */ Y(Hk, [["__scopeId", "data-v-47e67f04"]]), dx = Ji(() => import("./VoiceFigure-dzCYQzdf.js").then((e) => e.V)), hx = "1.0.0", fx = "3.5";
export {
  Il as $,
  Se as A,
  Ae as B,
  S4 as C,
  Qn as D,
  st as E,
  $4 as F,
  hy as G,
  f5 as H,
  w4 as I,
  wy as J,
  Mt as K,
  Vv as L,
  Ea as M,
  Sy as N,
  yy as O,
  Xn as P,
  j5 as Q,
  Vb as R,
  In as S,
  U5 as T,
  Pb as U,
  _e as V,
  Pn as W,
  Db as X,
  Nb as Y,
  Tl as Z,
  Y as _,
  Ab as a,
  i4 as a$,
  $y as a0,
  Gb as a1,
  Kb as a2,
  Te as a3,
  o5 as a4,
  a5,
  bt as a6,
  Yb as a7,
  v5 as a8,
  vb as a9,
  Q5 as aA,
  N5 as aB,
  Lv as aC,
  b5 as aD,
  x5 as aE,
  M4 as aF,
  vi as aG,
  H5 as aH,
  mn as aI,
  $b as aJ,
  kb as aK,
  f4 as aL,
  pn as aM,
  v4 as aN,
  h5 as aO,
  D5 as aP,
  P5 as aQ,
  L5 as aR,
  sn as aS,
  wt as aT,
  yb as aU,
  S0 as aV,
  R5 as aW,
  Ub as aX,
  pi as aY,
  Rt as aZ,
  Pt as a_,
  l4 as aa,
  p4 as ab,
  _b as ac,
  jb as ad,
  qb as ae,
  n5 as af,
  s5 as ag,
  r5 as ah,
  Ib as ai,
  Ao as aj,
  Jb as ak,
  g5 as al,
  A4 as am,
  C5 as an,
  E5 as ao,
  _5 as ap,
  i5 as aq,
  e5 as ar,
  Qb as as,
  t5 as at,
  W5 as au,
  p5 as av,
  y5 as aw,
  T4 as ax,
  zt as ay,
  w5 as az,
  Ny as b,
  O4 as b$,
  ly as b0,
  g4 as b1,
  G5 as b2,
  V5 as b3,
  Y0 as b4,
  ni as b5,
  a4 as b6,
  m5 as b7,
  ns as b8,
  it as b9,
  Y5 as bA,
  t4 as bB,
  ut as bC,
  z5 as bD,
  n4 as bE,
  k5 as bF,
  O5 as bG,
  $5 as bH,
  Oe as bI,
  d5 as bJ,
  s4 as bK,
  j4 as bL,
  q4 as bM,
  pb as bN,
  A0 as bO,
  c5 as bP,
  J5 as bQ,
  Cb as bR,
  E4 as bS,
  K5 as bT,
  Z5 as bU,
  X5 as bV,
  l5 as bW,
  Nv as bX,
  u5 as bY,
  S5 as bZ,
  _4 as b_,
  e4 as ba,
  bs as bb,
  or as bc,
  R4 as bd,
  N4 as be,
  F5 as bf,
  h4 as bg,
  gb as bh,
  A5 as bi,
  B4 as bj,
  Zb as bk,
  Xb as bl,
  Bb as bm,
  zb as bn,
  xb as bo,
  u4 as bp,
  Ob as bq,
  Tb as br,
  Lb as bs,
  I5 as bt,
  k0 as bu,
  y4 as bv,
  vy as bw,
  Rb as bx,
  Mb as by,
  T5 as bz,
  Ve as c,
  lx as c$,
  bb as c0,
  wb as c1,
  M5 as c2,
  D4 as c3,
  Ia as c4,
  P4 as c5,
  Ii as c6,
  d4 as c7,
  Wb as c8,
  Fb as c9,
  fx as cA,
  nb as cB,
  ex as cC,
  Ys as cD,
  ub as cE,
  kg as cF,
  It as cG,
  aa as cH,
  ka as cI,
  Zk as cJ,
  sb as cK,
  vl as cL,
  rx as cM,
  Qk as cN,
  cx as cO,
  J4 as cP,
  Ul as cQ,
  Vk as cR,
  hb as cS,
  Aw as cT,
  Nr as cU,
  ab as cV,
  Dt as cW,
  T1 as cX,
  ib as cY,
  Gk as cZ,
  ln as c_,
  M0 as ca,
  Sb as cb,
  py as cc,
  B5 as cd,
  Ma as ce,
  Ov as cf,
  q5 as cg,
  Vt as ch,
  Tt as ci,
  Yk as cj,
  X4 as ck,
  ve as cl,
  Yn as cm,
  Jk as cn,
  zh as co,
  ix as cp,
  mb as cq,
  xm as cr,
  Bn as cs,
  F4 as ct,
  zk as cu,
  Xt as cv,
  tb as cw,
  ye as cx,
  Q4 as cy,
  hx as cz,
  K0 as d,
  Li as d0,
  ob as d1,
  lt as d2,
  rb as d3,
  ss as d4,
  dx as d5,
  ux as d6,
  Br as d7,
  V4 as d8,
  Hf as d9,
  Dw as dA,
  Kr as dB,
  K4 as dC,
  Bm as dD,
  Y4 as dE,
  zn as dF,
  nx as dG,
  Uf as da,
  ax as db,
  sx as dc,
  ox as dd,
  fb as de,
  db as df,
  cb as dg,
  H4 as dh,
  W4 as di,
  fg as dj,
  tw as dk,
  Kk as dl,
  eb as dm,
  z4 as dn,
  G4 as dp,
  Xe as dq,
  Xk as dr,
  U4 as ds,
  lb as dt,
  kt as du,
  nw as dv,
  Z4 as dw,
  Qy as dx,
  tx as dy,
  hm as dz,
  We as e,
  w0 as f,
  Hb as g,
  I4 as h,
  an as i,
  k4 as j,
  L4 as k,
  c4 as l,
  b4 as m,
  Fy as n,
  m4 as o,
  Eb as p,
  Aa as q,
  Oi as r,
  Ti as s,
  je as t,
  x4 as u,
  Z0 as v,
  C4 as w,
  o4 as x,
  r4 as y,
  vn as z
};
