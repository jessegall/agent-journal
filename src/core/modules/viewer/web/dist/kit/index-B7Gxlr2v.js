/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as he, createElementVNode as p, normalizeClass as Z, Fragment as K, renderList as te, normalizeStyle as fe, defineComponent as Ki, Comment as Yi, h as ha, cloneVNode as Ji, createBlock as G, withCtx as F, unref as V, createVNode as D, toDisplayString as $, createCommentVNode as O, inject as _e, useAttrs as Vn, computed as N, ref as B, resolveDynamicComponent as xt, mergeProps as tt, Transition as Nt, watch as ke, shallowRef as Gn, createTextVNode as oe, TransitionGroup as Uo, reactive as fa, onMounted as qe, onUnmounted as Ie, nextTick as $t, useId as zo, Teleport as ma, withModifiers as be, isRef as Fa, onBeforeUnmount as Dt, resolveComponent as Zi, resolveDirective as Xi, withDirectives as ht, useModel as Ns, getCurrentInstance as Qi, mergeModels as Ds, getCurrentScope as Vo, onScopeDispose as Go, provide as el, onErrorCaptured as tl, toHandlers as nl, createSlots as sl, vShow as al, useSlots as ol, withKeys as Jt, vModelText as Ps, defineAsyncComponent as rl } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, il = { class: "skeleton-line" }, ll = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", il, [
      he(t.$slots, "default", {}, void 0, !0),
      p("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(K, null, te(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: fe({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, mt = /* @__PURE__ */ Y(ll, [["__scopeId", "data-v-0ebb6933"]]), cn = Ki({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Yi);
      return s.length !== 1 ? ha(K, { key: n }, s) : s[0].key == null ? Ji(s[0], { key: n }) : s[0];
    };
  }
}), cl = ["aria-label"], ul = ["aria-label"], dl = ["aria-label"], hl = ["aria-label"], fl = ["aria-label"], ml = ["aria-label"], pl = ["aria-label"], gl = {
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
    return (l, u) => (c(), G(cn, { value: e.shape }, {
      messages: F(() => [
        p("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(K, null, te(t, (d) => p("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, cl)
      ]),
      older: F(() => [
        p("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, ul)
      ]),
      cards: F(() => [
        p("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(K, null, te(n, (f) => D(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, dl)
      ]),
      file: F(() => [
        p("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            D(mt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(K, null, te(a, (f) => D(mt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, hl)
      ]),
      page: F(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          D(mt, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(K, null, te(e.count, (d) => (c(), G(mt, {
            key: d,
            bars: V(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, fl)
      ]),
      text: F(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), G(mt, {
            key: d,
            bars: V(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, ml)
      ]),
      default: F(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), G(mt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, pl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Pt = /* @__PURE__ */ Y(gl, [["__scopeId", "data-v-1392eacb"]]), vl = {
  key: 1,
  class: "empty-state titled"
}, yl = { class: "empty-state-title" }, wl = { class: "empty-state-text" }, kl = {
  key: 2,
  class: "empty-state"
}, bl = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", vl, [
      p("p", yl, $(e.title), 1),
      p("p", wl, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", kl, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Dn = /* @__PURE__ */ Y(bl, [["__scopeId", "data-v-b27e89b0"]]), xl = { class: "fold-group" }, $l = ["aria-expanded"], Ml = { class: "fold-label" }, Sl = {
  key: 0,
  class: "fold-count"
}, _l = {
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
    return (s, a) => (c(), h("div", xl, [
      p("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", Ml, $(e.label), 1),
        e.count !== "" ? (c(), h("span", Sl, $(e.count), 1)) : O("", !0),
        p("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, $l),
      e.open ? he(s.$slots, "default", {}, void 0, !0, 0) : O("", !0)
    ]));
  }
}, ub = /* @__PURE__ */ Y(_l, [["__scopeId", "data-v-9ef1865c"]]), El = Symbol("open-view"), Ae = Symbol.for("journal.window-context");
function un() {
  const e = _e(Ae, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Al = ["stroke-width", "innerHTML"], ge = {
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
      innerHTML: a[s[e.name] || e.name] || a.dot
    }, null, 12, Al));
  }
}, Cl = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Ol = /* @__PURE__ */ Y(Cl, [["__scopeId", "data-v-eb453d6f"]]), Tl = 120, Il = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Vn(), s = N(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = B(!1), o = N(() => t.busy || a.value), r = _e(Ae, null), i = N(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((g) => g(u)).filter((g) => g instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => a.value = !0, Tl);
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
          e.icon ? (c(), G(ge, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : O("", !0),
          he(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), G(Ol, {
          key: 0,
          class: "btn-spinner"
        })) : O("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), pe = /* @__PURE__ */ Y(Il, [["__scopeId", "data-v-033d70ca"]]), Rl = {
  class: "running",
  "data-running-command": ""
}, Bl = ["title"], Ll = {
  key: "idle",
  class: "running-idle"
}, Nl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Rl, [
      D(Nt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: F(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, Bl)) : (c(), h("span", Ll, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, db = /* @__PURE__ */ Y(Nl, [["__scopeId", "data-v-d3240219"]]), Dl = ["aria-checked", "aria-label", "title"], Pl = {
  key: 0,
  class: "switch-inner"
}, jl = {
  key: 0,
  class: "switch-word"
}, ql = {
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
        e.labelled ? (c(), h("span", Pl, $(e.word), 1)) : O("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", jl, $(e.word), 1)) : O("", !0)
    ], 10, Dl));
  }
}, hb = /* @__PURE__ */ Y(ql, [["__scopeId", "data-v-1bfb90f3"]]);
function Ko(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Zt(e, t) {
  return Ko(() => localStorage, e, t);
}
function Yo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Kn(e, t) {
  return Yo(() => localStorage, e, t);
}
function Jo(e, t) {
  ke(t, (n) => Kn(e, n), { deep: !0 });
}
function Fl(e, t) {
  return Ko(() => sessionStorage, e, t);
}
function Wl(e, t) {
  return Yo(() => sessionStorage, e, t);
}
const Pn = "journal.environment", Zo = B(Fl(Pn, Zt(Pn, "")));
function Hl(e) {
  Zo.value = e, Wl(Pn, e), Kn(Pn, e);
}
const jn = B(location.hash), Wa = Gn(null), Ha = { integrations: "mcp", library: "team" };
function Ul() {
  if (!Wa.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ha[n]) {
    location.replace(`#/${[Ha[n], ...s].join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash;
    return;
  }
  !n || Wa.value(n) || (Hl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  jn.value = location.hash, Ul();
});
const Xe = N(() => {
  const [e, t = ""] = jn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: Zo.value,
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
}), Yn = {
  page: (e = "", t = 0, n = "") => `#/${e}${t ? `/${t}` : ""}${n ? `?q=${encodeURIComponent(n)}` : ""}`,
  file: (e, t = 0, n = "") => `#/file?q=${encodeURIComponent(e)}${t ? `&line=${t}` : ""}${n ? `&sub=${n}` : ""}`,
  reportUpdates: () => "#/reports?sub=updates",
  settings: (e) => `#/settings?sub=${e}`,
  opened: (e, t) => `${Yn.page(e)}?open=${t}`
};
function zl(e = "", t = 0, n = "") {
  location.hash = Yn.page(e, t, n);
}
const Vl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Xo(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Vl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Tt = {};
function fb(e, t) {
  return Tt[e] = t, () => Tt[e] === t && delete Tt[e];
}
function Qo(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Tt[e]) != null && r.call(Tt, t))) return;
  const a = Xe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  Xo([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Gl(e, t, n, s = 0, a = "") {
  if (e === Xe.value.env) return Qo(t, n, s, a);
  const o = Xe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  Xo([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Ue(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Gl(s, a, Number(o), 0, t) : Qo(a, Number(o), 0, t);
}
function Kl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ot(e) {
  const t = Kl(e);
  t && Ue(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Jn = typeof document < "u" && document.documentElement.classList.contains("phone"), Yl = "Files are attached on the computer; the phone sends text.", is = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], me = (e, t, n, s = {}) => ({
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
}), dn = {
  messages: me("Message", "mail", "Messages between you and the agent", { in_sidebar: !0, listed_under: "environment", takes_comments: !0 }),
  questions: me("Question", "help", "A question from the agent with suggested answers", { needs_attention: !0, takes_comments: !0, labels: { answer: "Answer" } }),
  plans: me("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
    view: "document",
    in_sidebar: !0,
    listed_under: "sidebar",
    needs_attention: !0,
    lists_completed_unread: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you want, in your own words; the agent builds the plan with you from here" },
    filters: is
  }),
  tasks: me("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: is
  }),
  reports: me("Report", "report", "A record of what was checked and found", {
    view: "document",
    in_sidebar: !0,
    listed_under: "environment",
    needs_attention: !0,
    takes_comments: !0,
    closed_first: !0,
    exports: !0
  }),
  collections: me("Collection", "folder", "Related items grouped under a name", {
    in_sidebar: !0,
    listed_under: "sidebar",
    listed_as_cards: !0,
    created_in_viewer: !0,
    typed_as_title: !0,
    labels: { abstract: "What belongs in it" }
  }),
  docs: me("Document", "file", "What stays true about the project, catalogued for every session", {
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
  memories: me("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { weight: "A weight from 1 to 10" }
  }),
  rules: me("Rule", "list", "An instruction that applies to every environment in the project", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { reason: "Reasoning" }
  }),
  reminders: me("Reminder", "clock", "An instruction repeated until it is removed", {
    in_sidebar: !0,
    listed_under: "environment",
    takes_comments: !0,
    created_in_viewer: !0
  }),
  pins: me("Pin", "band", "One line pinned to the chat while it matters", { filters: is }),
  reactions: me("Reaction", "smile", "A face on a message", { nested: !0, typed_as_title: !0 }),
  plugins: me("Plugin", "plug", "An installed extension that responds to events and can run background services", { scope: "project" }),
  environments: me("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", { scope: "project" }),
  agents: me("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
  nudges: me("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", { nested: !0, typed_as_title: !0 }),
  workers: me("Worker", "bot", "An agent assigned a task in a separate working copy"),
  verifiers: me("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
  test_turns: me("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
  reviewers: me("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
  subagents: me("Subagent", "bot", "A helper started by the agent for a specific job", { nested: !0 }),
  sequences: me("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    listed_as_cards: !0,
    takes_comments: !0,
    labels: { brief: "What it is for" }
  }),
  templates: me("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
    view: "document",
    scope: "project",
    in_sidebar: !0,
    listed_under: "project",
    labels: { brief: "Instructions" }
  }),
  triggers: me("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
    scope: "project",
    in_sidebar: !0,
    listed_under: "sidebar",
    created_in_viewer: !0,
    labels: { words: "Words", action: "What it does", text: "What it sends" }
  }),
  checks: me("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
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
  dumps: me("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
    view: "document",
    needs_attention: !0,
    takes_comments: !0,
    created_in_viewer: !0,
    labels: { brief: "What you dumped", outcome: "Filed" }
  }),
  shares: me("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", { scope: "project" }),
  secrets: me("Secret", "key", "A key or login the agent may use without ever seeing it", { scope: "project" })
}, Jl = ["secrets", "plugins"], er = Object.keys(dn).filter((e) => !(Jn && Jl.includes(e)));
N(() => er.map((e) => ({ name: e, ...dn[e] })));
const hn = (e) => dn[e], tr = new Map(er.flatMap((e) => [e, e.replace(/s$/, ""), dn[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => tr.get(String(e).toLowerCase()) || "", nr = [...tr.keys()].sort((e, t) => t.length - e.length).join("|"), Zn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(pe, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: F(() => [
        D(ge, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Zl = {
  key: 1,
  class: "row-list-failure"
}, Xl = ["data-row"], Ql = {
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
    const t = e, n = N(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = B(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), G(Pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", Zl, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(Dn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: F(() => [
        oe($(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(K, { key: 3 }, [
      (c(), G(xt(e.arrival ? Uo : "ul"), tt(n.value, { class: "row-list" }), {
        default: F(() => [
          (c(!0), h(K, null, te(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Xl))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : O("", !0)
    ], 64));
  }
}, ec = /* @__PURE__ */ Y(Ql, [["__scopeId", "data-v-aa6ad7ff"]]), tc = {
  class: "agent-rows",
  "data-agent-rows": ""
}, nc = {
  key: 1,
  class: "agent-rows-note"
}, sc = {
  key: 2,
  class: "agent-rows-note"
}, ac = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, oc = ["data-agent-row", "onClick"], rc = { class: "agent-row-name" }, ic = { class: "agent-row-state" }, lc = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = N(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = N(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", tc, [
      e.loaded ? e.failure ? (c(), h("p", nc, $(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        p("p", ac, $(s.value) + " running", 1),
        (c(!0), h(K, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => V(Ue)(`agents:${r.id}`)
        }, [
          p("span", rc, "#" + $(r.id) + " " + $(r.session), 1),
          p("span", ic, $(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, oc))), 128))
      ], 64)) : (c(), h("p", sc, $(e.none), 1)) : (c(), G(Pt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, mb = /* @__PURE__ */ Y(lc, [["__scopeId", "data-v-a01e5a17"]]), cc = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, $(e.text), 3));
  }
}, sr = /* @__PURE__ */ Y(cc, [["__scopeId", "data-v-9e7e1157"]]), uc = ["aria-valuenow", "aria-valuemax"], dc = {
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
    const t = e, n = N(() => t.busy ? "40%" : `${Math.max(t.least, 100 * t.value / Math.max(1, t.max))}%`);
    return (s, a) => (c(), h("span", {
      class: Z(["track", e.tone, { thin: e.thin, busy: e.busy }]),
      role: "progressbar",
      "aria-valuenow": e.busy ? void 0 : e.value,
      "aria-valuemax": e.max
    }, [
      p("span", {
        class: "fill",
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, uc));
  }
}, hc = /* @__PURE__ */ Y(dc, [["__scopeId", "data-v-9eba6a85"]]), fc = { class: "bars" }, mc = { class: "bar-name" }, pc = { class: "bar-value" }, gc = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = N(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", fc, [
      (c(!0), h(K, null, te(e.items, (l, u) => (c(), G(xt(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: Z(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: F(() => [
          p("span", mc, $(l.label), 1),
          D(hc, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", pc, $(l.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, vc = /* @__PURE__ */ Y(gc, [["__scopeId", "data-v-663427f4"]]), yc = { class: "bars" }, wc = {
  key: 0,
  class: "bars-title"
}, kc = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", yc, [
      e.node.title ? (c(), h("span", wc, $(e.node.title), 1)) : O("", !0),
      D(vc, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, bc = /* @__PURE__ */ Y(kc, [["__scopeId", "data-v-7135bb11"]]), xc = {
  __name: "DashboardGroup",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = {
      stack: (r) => ({ gap: `${r.gap || 14}px` }),
      row: (r) => ({ gap: `${r.gap || 12}px` }),
      grid: (r) => ({ gap: `${r.gap || 12}px`, gridTemplateColumns: `repeat(${r.columns || 2}, minmax(0, 1fr))` })
    }, s = e, a = t, o = N(() => n[s.node.type](s.node));
    return (r, i) => (c(), h("div", {
      class: Z([e.node.type, { wrap: e.node.type === "row" && e.node.wrap !== !1 }]),
      style: fe(o.value)
    }, [
      (c(!0), h(K, null, te(e.node.children || [], (l, u) => (c(), G(Br, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ Y(xc, [["__scopeId", "data-v-d142a3f4"]]), $c = {
  key: 0,
  class: "card-head"
}, Mc = { class: "card-title" }, Sc = {
  key: 0,
  class: "card-note"
}, _c = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", $c, [
        p("span", Mc, $(e.node.title), 1),
        e.node.note ? (c(), h("span", Sc, $(e.node.note), 1)) : O("", !0)
      ])) : O("", !0),
      D(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Ec = /* @__PURE__ */ Y(_c, [["__scopeId", "data-v-67b72d40"]]), Ac = (e) => "task_ids" in e, ar = 1024, Cc = ar * 1024 * 1024, Oc = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${ar} MB limit for one file.`;
function Tc() {
  return () => {
  };
}
function js(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function or(e = window) {
  if (!js(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    js(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const qs = "journal.stale-build-reload", Ic = 'script[type="module"][src*="/assets/index-"]', Ua = (e) => {
  var t;
  return ((t = e.querySelector(Ic)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Rc(e = document, t = fetch, n = () => or(window)) {
  const s = Ua(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = Ua(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let ls = "";
function Bc(e, t = () => or(window)) {
  if (!e) return !1;
  const n = !!ls && ls !== e;
  return ls = e, n && t(), n;
}
const Lc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function Nc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(qs) === e.message) return !1;
    t.setItem(qs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Dc(e = window.sessionStorage) {
  try {
    e.removeItem(qs);
  } catch {
    return;
  }
}
const Pc = 2e3, jc = 3e4, ze = fa({ starting: !1, external: !1, late: !1, offline: !1 }), pa = () => ze.starting, qc = 3;
let bn = 0, Fs = 0, rr = 0, ir = [];
async function Fc() {
  try {
    const e = await Pe.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function Wc() {
  clearInterval(Fs), clearTimeout(rr), Fs = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), ir.splice(0).forEach((e) => e()), Rc();
}
let cs = !1;
async function Hc() {
  if (ze.offline = !navigator.onLine, cs) return;
  cs = !0;
  const e = await Fc();
  if (cs = !1, ze.external = e.updating, bn = !e.restarting && !e.updating && e.reachable ? bn + 1 : 0, bn < qc) return;
  bn = 0, (!Bc(e.started_at) || js()) && Wc();
}
function za() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, Fs = setInterval(Hc, Pc), rr = setTimeout(() => ze.late = !0, jc));
}
const Uc = () => ze.starting ? new Promise((e) => ir.push(e)) : Promise.resolve(), Va = 2e4, zc = 3e5, Ye = 6e5, xn = 6, Vc = 500, Gc = "/journal/summary", Kc = "/api/server-state", Yc = 2e4, Ga = Jn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Jc = (e) => e.split("?")[0].endsWith(Gc), lr = (e, t) => Object.assign(new Error(t), { status: e });
async function Zc(e, t, n = lr) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const Xc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Qc {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = xn;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = xn;
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
        headers: { ...Ga, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: Xc(s),
        signal: AbortSignal.timeout(a || (i ? zc : Va))
      });
    } catch (l) {
      if (l instanceof TypeError && za(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Vc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = xn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Tc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return Zc(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ga, signal: AbortSignal.timeout(Va) });
    if (!n.ok) throw lr(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, xn, o).then((l) => (this.written(n), l));
    if (pa() && !Jc(n))
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
    return fetch(Kc, { cache: "no-store", signal: AbortSignal.timeout(Yc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && za(), s;
    }
  }
}
const Pe = new Qc(), Be = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const qt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Ft = "the page does not know its environment yet", eu = "X-Journal-Env", tu = "X-Journal-Request-At", us = "/viewer/voices/figures/";
class ga {
  constructor({ env: t = () => Xe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new ga({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [tu]: String(Date.now()), ...this.env() ? { [eu]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === Ft ? Promise.reject(new Error(Ft)) : Pe.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === Ft ? Promise.reject(new Error(Ft)) : Pe.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : Ft;
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
    return this.get(`/updates/changelog${ue({ skip: t })}`);
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
    return this.get(this.here(`/entries${ue({ since: t, last: n })}`));
  }
  stream(t = 0) {
    const n = t ? `?since=${t}` : "";
    return Pe.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: u = !1 } = {}) {
    const d = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(d, `${t}.${qt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${qt({ before: s, since: a, docked: o })}`);
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
    if (Jn) return Promise.reject(Object.assign(new Error(Yl), { status: 403 }));
    if (s.size > Cc) return Promise.reject(new Error(Oc(s)));
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
    return Pe.bytes(t);
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
    return this.get(this.here(`/messages${ue({ on: t })}`), "messages.on");
  }
  // every row and conversation line here that holds all the words
  search(t, { models: n = [], conversations: s = !1 } = {}) {
    const a = { words: t, models: n.join(","), conversations: s ? 1 : "" };
    return this.get(this.here(`/search${ue(a)}`));
  }
  // the documents a search finds, best first, and the files attached to messages, a page at a time
  locateDocs(t) {
    return this.get(this.here(`/docs/search${ue({ words: t })}`));
  }
  attachments({ file_type: t, shelf: n, search: s, last: a, skip: o }) {
    return this.get(this.here(`/attachments${ue({ file_type: t, shelf: n, search: s, last: a, skip: o })}`));
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
    return this.get(`/agents/controls/${Be(t)}${ue({ model: n, effort: s })}`);
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
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${qt(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${qt(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${qt(n)}`);
  }
  edits(t, n, s = {}) {
    return this.get(this.here(`/agents/${t}/edits${ue({ since: n, ...s })}`));
  }
  editedText(t, n) {
    return this.get(this.here(`/agents/${t}/edits/text${ue({ edit: n })}`));
  }
  editedImageUrl(t, n) {
    return this.address(`/agents/${t}/edits/image${ue({ edit: n })}`);
  }
  terminal(t, n = 0) {
    return this.get(this.here(`/agents/${t}/terminal${ue({ after: n })}`));
  }
  // who the viewer is and who else is on the journal, so it says you only for its own person
  people() {
    return this.get("/people");
  }
  // whether this journal is connected to a team, and as whom; the one team, or the team named
  team(t = "") {
    return this.get(`/team${ue({ team: t })}`);
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
    return this.get(`/team/devices${ue({ team: t })}`);
  }
  revokeTeamDevice(t, n = "") {
    return this.post("/team/revoke", { device: t, team: n });
  }
  teamPeople(t = "") {
    return this.get(`/team/people${ue({ team: t })}`);
  }
  // changes this person's own password on the team
  changeTeamPassword(t, n, s = "") {
    return this.post("/team/password", { old: t, new: n, team: s });
  }
  // the library's items, each with its newest version and the version this journal imported, by kind and words
  libraryItems(t, n, s = "") {
    return this.get(`/library/items${ue({ type: t, search: n, team: s })}`);
  }
  // one library item with every version and its note, and the version this journal imported
  libraryItem(t, n, s = "") {
    return this.get(`/library/items/${encodeURIComponent(t)}/${encodeURIComponent(n)}${ue({ team: s })}`);
  }
  // every copy here that came from the library, with the version it came from and the row or file it is
  libraryCopies(t = "") {
    return this.get(`/library/copies${ue({ team: t })}`);
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
    const a = this.here(`/outputs/${t}${ue({ after: n, before: s })}`);
    return this.get(a, a);
  }
  activeCards(t) {
    return this.get(this.here(`/cards/active?ids=${t.join(",")}`));
  }
  // skills and voices
  skills(t = 0) {
    return this.get(this.here(`/skills${ue({ agent: t })}`));
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
    return Pe.request("GET", us + "figures.json");
  }
  voiceFigureUrl(t) {
    return us + t;
  }
  figureDecoderUrl() {
    return us + "draco/";
  }
  // the project's files
  projectFiles(t = "") {
    return this.get(this.here(`/project-files${ue({ folder: t })}`));
  }
  findFiles(t) {
    return this.get(this.here(`/project-files/find${ue({ q: t })}`));
  }
  projectFile(t) {
    return this.get(this.here(`/project-files/file${ue({ path: t })}`));
  }
  projectFileUrl(t) {
    return this.address(`/project-files/raw${ue({ path: t })}`);
  }
  fileDiff(t) {
    return this.get(this.here(`/project-files/diff${ue({ path: t })}`));
  }
  // the project's repository
  gitBranches(t = 0, n = 30) {
    return this.get(this.here(`/git/branches${ue({ skip: t, last: n })}`));
  }
  gitCommits(t = 0, n = 30) {
    return this.get(this.here(`/git/commits${ue({ skip: t, last: n })}`));
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
    return this.get(this.here(`/plugins/${t}/log${ue({ lines: n })}`));
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
    return `${this.base}/${t ? `?env=${Be(t)}` : ""}${Yn.page(n)}`;
  }
  origin() {
    return this.base || location.origin;
  }
}
const Ve = new ga({ base: Jn ? "/p" : "" }), nu = (e) => Pe.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Ka = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), su = 6e4, au = 4, ou = 300, ru = 5e3, cr = /* @__PURE__ */ new Map();
function Xn(e) {
  if (!(e in Ka)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ka[e];
}
function iu(e) {
  const t = Xn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return ru;
  }
}
const lu = (e) => e / 2 + Math.random() * e / 2, ur = (e) => [...e.users.values()].pop(), va = (e) => cr.get(e.place) === e, cu = () => Math.random() * ou, ya = () => document.hidden;
function uu(e) {
  const t = iu(e);
  return e.failures ? lu(Math.min(su, t * 2 ** e.failures)) : Math.max(t, au * e.took);
}
function dr(e, t) {
  clearTimeout(e.timer), !(!va(e) || ya()) && (e.timer = setTimeout(() => du(e), t));
}
function du(e) {
  return va(e) ? e.running ? (e.again = !0, e.running) : (e.running = pu(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const hu = (e) => {
  var t, n;
  return !ya() && (((n = (t = Xn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && ur(e).active() && !pa();
};
async function fu(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Pe.attemptOnce(() => Xn(e.key).read(ur(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function mu(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Xn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function pu(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      hu(e) && mu(e, await fu(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && va(e));
  dr(e, uu(e));
}
const gu = () => ya() || cr.forEach((e) => dr(e, cu()));
document.addEventListener("visibilitychange", gu);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, hr = (e) => `${e.table}:${e.id}`, Ya = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ds = 80;
function Ja(e) {
  return e.length <= ds ? e : `${e.slice(0, ds + 1).replace(/\s+\S*$/, "") || e.slice(0, ds)}…`;
}
const Za = {
  messages: (e) => Ja(Ya(e.text)),
  comments: (e) => Ja(Ya(e.text)),
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
}, vu = (e) => (Za[e.table] ? Za[e.table](e) : e.title || "") || "", yu = ["done", "cancelled"], Ws = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => yu.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, wu = (e) => Ws[e.table] ? Ws[e.table](e) : 0, fr = (e) => wu(e) > 0, ku = (e) => !!Ws[e], bt = (e) => Ee(e.created_at), wa = (e) => Ee(e.updated_at) || bt(e), bu = 60, xu = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - bu, $u = (e, t) => e.id > 0 && e.table === t.table && xu(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ka = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => $u(s, n))), Mu = { me: 1, people: [] }, ie = fa({
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
  people: Mu,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Zt("journal.activity", !0),
  wide: !1,
  sideMini: Zt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Jo("journal.activity", () => ie.activity);
Jo("journal.side.mini", () => ie.sideMini);
const Su = 50, mr = 100, _u = { messages: 25 }, We = (e) => _u[e] || Su;
function Eu(e, t) {
  if (e !== "messages") return Math.max(t.length - We(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === We(e)) return s;
  return 0;
}
const ft = /* @__PURE__ */ new Set(), ba = B(0), fn = /* @__PURE__ */ new Set(), mn = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new Set(), Hs = /* @__PURE__ */ new Set(), Au = /* @__PURE__ */ new Map(), Cu = /* @__PURE__ */ new Map();
let Wt = !1, Ht = null;
const Ou = (e, t) => e.id - t.id, Tu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Iu = { messages: Tu }, pr = (e) => Iu[e] || Ou;
function gr(e) {
  return ba.value, ft.has(e) || (ft.add(e), ie.booted && (!fn.has(e) || mn.has(e)) && queueMicrotask(() => xa([e], !1))), ie.rows[e] || [];
}
function Ru(e) {
  const t = ie.rows[e] || [], n = Eu(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ie.rows[e] = t.filter((a) => s.has(a) || ku(e) && !fr(a)), ie.paging.size[e] = We(e), ie.paging.more[e] = !0;
}
const Bu = /* @__PURE__ */ new Set();
function Lu() {
  ft.forEach(Ru), ft.clear(), Au.clear(), Cu.clear(), ba.value += 1;
}
ke(() => `${Xe.value.env}/${Xe.value.page}/${Xe.value.open ? Xe.value.open.table : ""}`, Lu);
ke(
  () => ie.booted,
  (e) => e && xa(
    [...ft].filter((t) => !fn.has(t)),
    !1
  )
);
const Us = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Ac(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function vr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Us(s) && !Us(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function yr(e, t) {
  fn.add(e), ba.value += 1;
  const n = ie.rows[e] || [];
  ie.rows[e] = [...vr(n, t.rows), ...ka(n.filter((s) => s.id === 0), t.rows)], ie.paging.size[e] = ie.paging.size[e] || We(e), ie.paging.more[e] = !t.is_last_page;
}
async function Nu(e) {
  const t = new Set((ie.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: We(e) });
  Qn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ka((ie.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return yr(e, { ...n, rows: [...n.rows, ...a].sort(pr(e)) }), ie.paging.size[e] = We(e), wr.has(e) && await kr(e), ie.rows[e];
}
const Qn = (e, t) => ie.counts = { ...ie.counts, [e]: t };
async function Du(e) {
  const t = ie.rows[e] || [], n = Math.max(0, ...t.map(wa)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: We(e), since: n, after: s });
  if (Qn(e, a.counts), !a.is_last_page) return Nu(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ka(t.filter((i) => !o.has(i.id)), a.rows).concat(vr(t, a.rows));
  return ie.rows[e] = r.sort(pr(e)), ie.paging.size[e] = ie.rows[e].length, ie.rows[e];
}
const hs = /* @__PURE__ */ new Set();
async function Pu(e, t = !1) {
  e.forEach((n) => mn.delete(n)), e.forEach((n) => Hs.add(n));
  try {
    await zu(e, t);
  } finally {
    e.forEach((n) => Hs.delete(n));
  }
}
async function ju(e) {
  const t = await Ve.list(e, { limit: We(e) });
  Qn(e, t.counts), yr(e, t);
}
async function qu(e) {
  Qn(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const wr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function kr(e) {
  const t = (ie.rows[e] || []).filter((a) => Us(a) && (e !== "plans" || !fr(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ie.rows[e] = (ie.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Fu = (e, t) => !fn.has(e) || t && (ie.paging.size[e] || We(e)) === We(e) && !Bu.has(e);
async function Wu(e, t) {
  if (!ft.has(e)) return qu(e);
  const n = await (Fu(e, t) ? ju(e) : Du(e));
  return wr.has(e) && await kr(e), n;
}
async function br() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ie.settings) && (ie.settings = e);
}
async function Hu() {
  const [e] = await Promise.all([Ve.entries(0, mr), br()]);
  Ku([...Zt($r(), []), ...e]);
}
const Uu = (e, t) => Wu(e, t).then(
  () => null,
  () => e
);
async function zu(e, t) {
  const n = (await Promise.all(e.map((s) => Uu(s, t)))).filter(Boolean);
  if (n.forEach((s) => (rt.add(s), mn.add(s))), t && await Hu(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const xr = 1e3, Vu = 15e3;
let $n = xr;
async function Gu() {
  return Ht || (Ht = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...rt].some((e) => !hs.has(e)) || Wt; ) {
      const e = Wt, t = [...e ? Object.keys(ie.rows) : rt].filter((s) => dn[s] && (ft.has(s) || s in ie.rows)).filter((s) => e || !ft.has(s) || mn.has(s) || !fn.has(s)).filter((s) => !hs.has(s)), n = [...rt].filter((s) => hs.has(s));
      rt.clear(), n.forEach((s) => rt.add(s)), Wt = !1;
      try {
        await Pu(t, e), $n = xr;
      } catch {
        Wt = Wt || e, await new Promise((a) => setTimeout(a, $n)), $n = Math.min($n * 2, Vu);
      }
    }
  })().finally(() => Ht = null), Ht);
}
function xa(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Hs.has(n)).forEach((n) => {
    rt.add(n), t && mn.add(n);
  }), rt.delete("settings") && br(), Gu();
}
const $r = () => {
  var e;
  return `typed-entries:${((e = ie.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Ku(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ie.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-mr), Kn($r(), ie.entries.slice(-50));
}
nu((e) => ie.streamOpen || xa([e]));
const zs = [], Yu = 2e3, ot = /* @__PURE__ */ new Map(), Ju = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Zu = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Mt(e, { first: t = !1 } = {}) {
  t ? zs.unshift(e) : zs.push(e), ot.clear();
}
function Mr(e, t, n) {
  var a;
  const s = gr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Xu = (e) => gr(e.table).find((t) => t.id === e.id) === e.row, Qu = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function ed(e, t) {
  const n = [{ kind: "text", text: et(e).replace(/\r\n/g, `
`) }];
  for (const s of zs)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const r = s(o.text, t);
      typeof r == "string" ? o.text = r : r && n.splice(a, 1, ...r);
    }
  return n;
}
function Xt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return td(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function td(e) {
  return e.split(Zu).map((t, n) => n % 2 ? t : t.replace(Ju, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Xa(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function nd(e) {
  const [t, , ...n] = e, s = Xa(t).map((o) => `<th>${Xt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Xa(o).map((r) => `<td>${Xt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
const Sr = /^\s*(?:[-*+]|\d+[.)])\s+/, Vs = /^\s*(\d+)[.)]\s/;
function sd(e) {
  const t = e[0].match(Vs), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && a.trim() && (n[n.length - 1] += ` ${a.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${n.map((a) => `<li>${Xt(a)}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function ad(e, t) {
  const n = Vs.test(e[t]);
  let s = t + 1;
  for (let a = s; a < e.length; a += 1)
    if (Sr.test(e[a]) && Vs.test(e[a]) === n || a === s && /^\s{2,}\S/.test(e[a])) s = a + 1;
    else if (e[a].trim()) break;
  return s;
}
const Qa = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function _r(e) {
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
      n.push(`<h${i}>${Xt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Qa(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(nd(t.slice(s, i))), s = i;
      continue;
    }
    if (Sr.test(a)) {
      const i = ad(t, s);
      n.push(sd(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${_r(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !Qa(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Xt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const od = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, rd = (e) => e.kind !== "text" && !od.test(e.html);
function id(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(_r(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : rd(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Gs(e, t = { env: "" }) {
  const n = Qu(e, t), s = ot.get(n);
  if (ot.delete(n), s && s.reads.every(Xu))
    return ot.set(n, s), s.html;
  const a = [], o = id(ed(e, { ...t, reads: a }));
  return ot.set(n, { html: o, reads: a }), ot.size > Yu && ot.delete(ot.keys().next().value), o;
}
const Er = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Qt = (e) => String(e || "").replace(Er, (t, n, s, a) => a), ld = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Mn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, cd = /^Traceback \(most recent call last\):/m, ud = 8;
function Ar(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, ud).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function dd(e) {
  const t = [...e.matchAll(ld)].map((s) => s.index);
  if (Mn.lastIndex = 0, !t.length || !Mn.test(e)) return null;
  Mn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Mn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Ar(n), tail: "" } : null;
}
function hd(e) {
  const t = cd.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Ar([o]), tail: n.slice(a).join(`
`) };
}
Mt((e) => {
  const t = Qt(e), n = hd(t) || dd(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const fd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, md = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, pd = /[\w\]]\(/, gd = /^[\w$.[\]'"]+\s*=\s*[^=]/, vd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, yd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, wd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, kd = /[[({,]$/, bd = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, xd = /^(\t|\s{2,})\S/, $d = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Md = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Sd = /[{}()[\];=<>$&|*\\@+^~%]/g, Cr = /^\s*(?:[-*+]|\d+[.)])\s/, _d = /^\s*>/, Ed = /^\s*\|/, Ad = 0.6, Cd = 0.4, Od = 5, Td = 0.03, Or = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Od && t.every((n) => Md.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Sd) ?? []).length / e.length < Td;
}, fs = (e) => {
  const t = e.trim();
  return [fd, md, pd, gd, vd, yd, wd, kd, bd].some((n) => n.test(t)) || /[;{}]$/.test(t) || xd.test(e) && !Cr.test(e) && !Or(e);
};
function Id(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Cr.test(t[0]) || t.every((o) => _d.test(o) || Ed.test(o))) return "text";
  const n = t.filter((o) => !$d.test(o.trim()));
  if (t.length === 1) return !n.length || fs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(fs).length, a = n.filter((o) => !fs(o) && Or(o)).length;
  return s >= n.length * Ad && a <= n.length * Cd ? "code" : "text";
}
const Ks = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Rd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Bd = `${Ks} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Ld = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", Nd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", eo = {
  js: { keywords: Ks, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Rd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Bd, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ks, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Ld, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
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
function to(e, t, n) {
  return n && e.startsWith(n, t);
}
function Pd(e, t) {
  const n = eo[Dd[t] ?? t] || eo.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (to(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && to(e, o, n.block[0])) {
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
      const d = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? d.toLowerCase() : d, g = n.property && /^\s*:/.test(e.slice(o + d.length));
      r(s.has(f) ? "keyword" : g ? "property" : /^[A-Z]/.test(d) && t !== "text" ? "type" : "plain", d), o += d.length;
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
function jd(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Pd(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? et(r) : `<span class="tok-${s}">${et(r)}</span>`);
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
const Fd = 1500, no = /* @__PURE__ */ new WeakMap();
async function Wd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await qd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(no.get(t)), no.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Fd)
  )));
}
typeof document < "u" && document.addEventListener("click", Wd, !0);
const Hd = /\n\s*\n/, Ud = /^(```|~~~)\s*(\w+)?\s*$/, zd = /^\s{4,}\S/, Vd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ys = /^\s*(?:[-*+]|\d+[.)])\s/, Tr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Gd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function $a(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Kd(e) {
  const t = $a(e.join(`
`));
  return (Gd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Yd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Tr.test(t) && !Ys.test(t);
}, Jd = (e, t) => Ys.test(t) || Ys.test([...e].reverse().find((n) => n.trim()) || "");
function Js(e, t) {
  const n = t || Kd(e), s = jd($a(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function Zd(e) {
  const t = e.split(Hd).map((r) => ({ paragraph: r, kind: Id($a(r).split(`
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
      a(), n.push(Js(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(Qt), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Xd(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Zd(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(Ud);
    if (r) {
      const l = t.findIndex((d, f) => f > o && d.trim().startsWith(r[1])), u = l < 0 ? t.length : l;
      a(), n.push(Js(t.slice(o + 1, u).map(Qt), r[2] ? r[2].toLowerCase() : "")), o = u + 1;
      continue;
    }
    const i = Yd(s) ? Vd : zd;
    if (i.test(t[o]) && !Jd(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const u = [];
      for (; s.length && s[s.length - 1].trim() && Tr.test(s[s.length - 1].trim()); ) u.unshift(s.pop());
      if (l - o + u.length >= 2) {
        a(), n.push(Js([...u, ...t.slice(o, l)].map(Qt), "")), o = l;
        continue;
      }
      s.push(...u);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
Mt((e) => Xd(e));
const Qd = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, eh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function th(e) {
  const t = Qd.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = eh.exec(e), s = n && ut(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function nh(e, t, n, s) {
  const a = Mr(s, e, t), o = Qt(a ? vu(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${et(hn(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
Mt(
  (e, t) => {
    const n = th(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: nh(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const sh = /\.(png|jpe?g|gif|webp|svg)$/i, ah = (e) => sh.test(e), oh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, rh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function ih(e, t) {
  const n = oh.exec(e), [, s, a, o, r, i] = n || [], l = n && ut(s || o), u = l && Mr(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${hn(l).title} ${u.id} · ${et(i)}`, g = ah(i) ? `<img class="file-card-image" src="${d}" alt="${et(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(i)}">${g}<span class="file-card-name">${f}</span></a>` };
}
function lh(e) {
  const t = rh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Mt(
  (e, t) => {
    if (t.inline) return null;
    const n = ih(e, t) || lh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ch = /`([^`\n]+)`/g;
Mt((e) => e.replace(ch, (t, n) => `<code>${n}</code>`));
const so = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Yn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Mt(
  (e, t) => e.replace(Er, (n, s, a, o) => so[s] ? so[s](a, o, t) : o)
);
const uh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Ir = new RegExp(`\\b(${nr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Rr = new RegExp(`\\b(${nr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), dh = new RegExp(`<code>((?:${Ir.source}|${Rr.source}))</code>`, "gi"), hh = (e) => e.replace(dh, "$1"), fh = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, mh = (e) => e.replace(Rr, (t, n, s) => s.replace(/\d+/g, (a) => fh(n.replace(/s$/i, ""), a))), ph = (e) => mh(e).replace(
  Ir,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
Mt(
  (e, t) => t.rowNames === !1 ? e : hh(e).split(uh).map((n, s) => s % 2 ? n : ph(n)).join("")
);
const gh = ["innerHTML"], vh = ["innerHTML"], yh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = N(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Gs(s, { env: Xe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => V(Ot) && V(Ot)(...o)),
      innerHTML: n.value
    }, null, 8, gh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => V(Ot) && V(Ot)(...o)),
      innerHTML: n.value
    }, null, 8, vh));
  }
}, lt = /* @__PURE__ */ Y(yh, [["__scopeId", "data-v-1a43d211"]]), wh = { class: "fact" }, kh = { class: "fact-label" }, bh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", wh, [
      p("span", kh, $(e.label), 1),
      D(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, xh = /* @__PURE__ */ Y(bh, [["__scopeId", "data-v-3a88ecf8"]]), $h = { class: "list" }, Mh = { class: "list-label" }, Sh = {
  key: 1,
  class: "list-note"
}, _h = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", $h, [
      (c(!0), h(K, null, te(e.items, (o, r) => (c(), G(xt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: F(() => [
          p("span", Mh, $(o.label), 1),
          o.badge ? (c(), G(sr, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : O("", !0),
          o.note ? (c(), h("span", Sh, $(o.note), 1)) : O("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Eh = /* @__PURE__ */ Y(_h, [["__scopeId", "data-v-ebe2ae0a"]]), Ah = { class: "table" }, Ch = {
  key: 0,
  class: "table-row empty"
}, Oh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", Ah, [
      p("div", {
        class: "table-row head",
        style: fe(a.value)
      }, [
        (c(!0), h(K, null, te(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, $(i), 1))), 128))
      ], 4),
      (c(!0), h(K, null, te(e.rows, (i, l) => (c(), G(xt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: Z(["table-row", i.tone, { opens: i.open }]),
        style: fe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: F(() => [
          (c(!0), h(K, null, te(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, $(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Ch, $(e.empty), 1)) : O("", !0)
    ]));
  }
}, Th = /* @__PURE__ */ Y(Oh, [["__scopeId", "data-v-9326a52e"]]), Ih = { class: "stat-value" }, Rh = { class: "stat-label" }, Bh = {
  key: 0,
  class: "stat-note"
}, Lh = {
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
        p("span", Ih, $(e.value), 1),
        p("span", Rh, $(e.label), 1),
        e.note ? (c(), h("span", Bh, $(e.note), 1)) : O("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Nh = /* @__PURE__ */ Y(Lh, [["__scopeId", "data-v-ad0db6d6"]]), Dh = { class: "code" }, Ph = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(cn, {
      value: e.node.type
    }, {
      stack: F(() => [
        D(Tn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: F(() => [
        D(Tn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: F(() => [
        D(Tn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: F(() => [
        D(Ec, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: F(() => [
        p("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, $(e.node.text), 3)
      ]),
      divider: F(() => [...r[2] || (r[2] = [
        p("hr", { class: "divider" }, null, -1)
      ])]),
      stat: F(() => [
        D(Nh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: F(() => [
        D(bc, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: F(() => [
        D(Th, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: F(() => [
        D(Eh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: F(() => [
        D(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: F(() => [
        D(xh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: F(() => [
        D(sr, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: F(() => [
        p("pre", Dh, [
          p("code", null, $(e.node.text), 1)
        ])
      ]),
      file: F(() => [
        p("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, $(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Br = /* @__PURE__ */ Y(Ph, [["__scopeId", "data-v-cbdcf540"]]), jh = { class: "dashboard" }, qh = { class: "trail" }, Fh = ["onClick"], Wh = {
  key: 0,
  class: "gone",
  role: "status"
}, Hh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (g) => g in (n.document.pages || {}), o = B(!!n.page && !a(n.page)), r = B(n.page && !o.value ? [n.page] : []), i = N(() => r.value.at(-1) || n.document.start), l = N(() => (n.document.pages || {})[i.value] || null), u = (g) => ((n.document.pages || {})[g] || {}).title || g, d = (g) => {
      o.value = !1, r.value = [...r.value, g];
    }, f = (g) => {
      o.value = !1, r.value = r.value.slice(0, g);
    };
    return ke(
      () => n.document.start,
      () => r.value = []
    ), (g, v) => (c(), h("div", jh, [
      e.document.broken ? (c(), G(Dn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: F(() => [
          oe($(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(Dn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: F(() => [
          oe($(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(K, { key: 2 }, [
        p("nav", qh, [
          p("button", {
            type: "button",
            class: Z(["step", { current: !r.value.length }]),
            onClick: v[0] || (v[0] = (M) => f(0))
          }, $(u(e.document.start)), 3),
          (c(!0), h(K, null, te(r.value, (M, x) => (c(), h(K, {
            key: `${x}-${M}`
          }, [
            v[2] || (v[2] = p("span", { class: "sep" }, "/", -1)),
            p("button", {
              type: "button",
              class: Z(["step", { current: x === r.value.length - 1 }]),
              onClick: (_) => f(x + 1)
            }, $(u(M)), 11, Fh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Wh, "What you opened is no longer in this dashboard. Here is its start page.")) : O("", !0),
        D(Nt, {
          name: "page",
          mode: "out-in"
        }, {
          default: F(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              D(Br, {
                node: l.value.view,
                onOpen: d,
                onFile: v[1] || (v[1] = (M) => s("file", M))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : O("", !0)
    ]));
  }
}, pb = /* @__PURE__ */ Y(Hh, [["__scopeId", "data-v-fbe83734"]]);
function Uh(e, t, n, s = () => window) {
  qe(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ie(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const zh = (e, t = () => !0) => Uh("keydown", (n) => n.key === "Escape" && t() && e());
function Lr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = B(!1), a = N(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return zh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Vh = 80, At = fa([]);
function Nr(e) {
  const t = Symbol("layer"), n = () => At.includes(t) && At.splice(At.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !At.includes(t) && At.push(t), s || n();
    },
    { immediate: !0 }
  ), Ie(n), N(() => Vh + Math.max(0, At.indexOf(t)));
}
let Dr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return Dr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Gh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Kh(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Gh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  qe(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : Dr, document.addEventListener("keydown", a), $t(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ie(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Yh = ["aria-modal", "aria-label", "aria-labelledby"], Jh = {
  key: 0,
  class: "dialog-head"
}, Zh = ["id", "tabindex"], Xh = {
  key: 1,
  class: "dialog-foot"
}, Qh = 500, ef = 400, tf = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Lr(s, n), i = Nr(a), l = B(null), u = B(null), d = B(null), f = zo(), g = B(!1), v = Date.now();
    n.modal && Kh(u, () => s("escape"), d);
    function M() {
      if (!n.modal) return n.closable && o();
      g.value = !0, setTimeout(() => g.value = !1, ef);
    }
    function x(W) {
      !n.modal || Date.now() - v >= Qh || ![" ", "Enter"].includes(W.key) || (W.preventDefault(), W.stopPropagation());
    }
    const _ = () => l.value && (l.value.scrollTop = l.value.scrollHeight), T = new MutationObserver(_);
    return ke(l, (W) => {
      T.disconnect(), W && n.follow && (T.observe(W, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Ie(() => T.disconnect()), (W, Q) => (c(), G(ma, { to: "body" }, [
      D(Nt, {
        name: "dialog",
        appear: "",
        onAfterLeave: V(r)
      }, {
        default: F(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: V(i) }),
            onClick: be(M, ["self"])
          }, [
            p("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: g.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? V(f) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? O("", !0) : (c(), h("header", Jh, [
                p("h3", {
                  id: V(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, Zh),
                e.closable ? (c(), G(Zn, {
                  key: 0,
                  onClick: V(o)
                }, null, 8, ["onClick"])) : O("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: l,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                he(W.$slots, "default", {}, void 0, !0)
              ], 2),
              W.$slots.foot ? (c(), h("footer", Xh, [
                he(W.$slots, "foot", {}, void 0, !0)
              ])) : O("", !0)
            ], 42, Yh)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, nf = /* @__PURE__ */ Y(tf, [["__scopeId", "data-v-6d1ecd98"]]), at = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, je = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, De = { across: 48, down: 110, margin: 32, labelSpace: 14 }, sf = 6;
function Ma(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const af = (e) => {
  const t = Ma(e, at.lineChars), n = Math.max(at.minWidth, Math.max(...t.map((s) => s.length)) * at.charWidth + at.padX * 2);
  return { name: e, lines: t, line: at.line, padY: at.padY, width: n, height: t.length * at.line + at.padY * 2 };
};
function of(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function rf(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function lf(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const f = i(d).map((g) => l.get(g));
      return f.length ? f.reduce((g, v) => g + v, 0) / f.length : l.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < sf; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((g) => g[i ? 1 : 0] === f).map((g) => g[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function cf(e, t) {
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
function uf(e) {
  const t = [...new Set(e.flatMap(([E, b]) => [E, b]))], n = new Set(e.map(([, E]) => E)), s = t.filter((E) => !n.has(E)), a = of(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((E, b) => !a.has(b)), r = rf(t, o), i = lf(t, o, r), l = new Map(t.map((E) => [E, af(E)])), u = i.map((E) => E.reduce((b, A) => b + l.get(A).width, 0) + De.across * (E.length - 1)), d = Math.max(...u) + De.margin * 2, f = hf(e, r, i.length), g = /* @__PURE__ */ new Map();
  let v = De.margin;
  i.forEach((E, b) => {
    let A = (d - u[b]) / 2;
    const y = Math.max(...E.map((C) => l.get(C).height));
    E.forEach((C) => {
      const w = l.get(C);
      g.set(C, { ...w, x: A, y: v + (y - w.height) / 2 }), A += w.width + De.across;
    }), v += y + (f[b] ?? De.down);
  });
  const M = e.map(([E, b, A], y) => ({ from: E, to: b, label: A || "", back: a.has(y) || r.get(b) <= r.get(E) }));
  cf(M, g);
  const x = M.map((E) => ff(E, g.get(E.from), g.get(E.to))), _ = [...g.values()], T = vf(x, _), W = Math.max(v - De.down, ...T.filter((E) => E.label).map((E) => E.label.y + E.label.height));
  return { width: Math.max(d - De.margin, ...T.filter((E) => E.label).map((E) => E.label.x + E.label.width)) + De.margin, height: W + De.margin, nodes: _, arrows: T };
}
const df = (e) => e ? Ma(e, je.lineChars).length * je.line + je.pad * 2 : 0;
function hf(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => De.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += df(r) + De.labelSpace);
  }), s.map((a) => Math.max(De.down, a));
}
function ff(e, t, n) {
  const s = e.label ? Ma(e.label, je.lineChars) : [], a = s.length ? Math.max(...s.map((g) => g.length)) * je.charWidth + je.pad * 2 : 0, o = s.length * je.line + (s.length ? je.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const mf = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, pf = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], gf = [0, -1, 1, -2, 2, -3, 3].map((e) => e * je.line);
function vf(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = mf(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = gf.flatMap((l) => pf.map((u) => a(u, l))).find((l) => !n.some((u) => ao(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => ao(i, l)); ) i.y += je.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: je.line, pad: je.pad } };
  });
}
const ao = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, yf = { class: "flowchart-tools" }, wf = ["width", "height", "viewBox", "aria-label"], kf = ["d"], bf = ["x", "y", "width", "height"], xf = ["x", "y"], $f = ["x", "dy"], Mf = {
  key: 0,
  class: "flowchart-label"
}, Sf = ["x", "y", "width", "height"], _f = ["x", "y"], Ef = ["x", "dy"], Af = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => uf(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = B(null), i = B({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var T;
      const x = (T = r.value) == null ? void 0 : T.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const _ = Math.min(x.width / a.value.width, x.height / a.value.height, 1.5);
      i.value = { zoom: _, x: (x.width - a.value.width * _) / 2, y: (x.height - a.value.height * _) / 2 };
    }
    function d(x, _, T) {
      const { zoom: W, x: Q, y: E } = i.value, b = Math.min(o.most, Math.max(o.least, W * x));
      i.value = { zoom: b, x: _ - (_ - Q) * b / W, y: T - (T - E) * b / W };
    }
    function f(x) {
      const _ = r.value.getBoundingClientRect();
      d(x, _.width / 2, _.height / 2);
    }
    function g(x) {
      const _ = r.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? d(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - _.left, x.clientY - _.top) : i.value = { ...i.value, x: i.value.x - x.deltaX, y: i.value.y - x.deltaY };
    }
    function v(x) {
      var _, T, W;
      x.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), l = { x: x.clientX - i.value.x, y: x.clientY - i.value.y }, (W = (T = r.value).setPointerCapture) == null || W.call(T, x.pointerId);
    }
    function M(x) {
      l && (i.value = { ...i.value, x: x.clientX - l.x, y: x.clientY - l.y });
    }
    return qe(u), (x, _) => (c(), G(nf, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (T) => s("close"))
    }, {
      default: F(() => [
        p("div", yf, [
          D(pe, {
            small: "",
            onClick: _[0] || (_[0] = (T) => f(o.step))
          }, {
            default: F(() => [..._[5] || (_[5] = [
              oe("Zoom in", -1)
            ])]),
            _: 1
          }),
          D(pe, {
            small: "",
            onClick: _[1] || (_[1] = (T) => f(1 / o.step))
          }, {
            default: F(() => [..._[6] || (_[6] = [
              oe("Zoom out", -1)
            ])]),
            _: 1
          }),
          D(pe, {
            small: "",
            onClick: u
          }, {
            default: F(() => [..._[7] || (_[7] = [
              oe("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        p("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: be(g, ["prevent"]),
          onPointerdown: v,
          onPointermove: M,
          onPointerup: _[2] || (_[2] = (T) => Fa(l) ? l.value = null : l = null),
          onPointercancel: _[3] || (_[3] = (T) => Fa(l) ? l.value = null : l = null)
        }, [
          (c(), h("svg", {
            class: "flowchart",
            width: a.value.width,
            height: a.value.height,
            viewBox: `0 0 ${a.value.width} ${a.value.height}`,
            role: "img",
            "aria-label": e.title,
            style: fe({ transform: `translate(${i.value.x}px, ${i.value.y}px) scale(${i.value.zoom})` })
          }, [
            _[8] || (_[8] = p("defs", null, [
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
            (c(!0), h(K, null, te(a.value.arrows, (T, W) => (c(), h("path", {
              key: `arrow-${W}`,
              class: "flowchart-arrow",
              d: T.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, kf))), 128)),
            (c(!0), h(K, null, te(a.value.nodes, (T) => (c(), h("g", {
              key: T.name,
              class: "flowchart-node"
            }, [
              p("rect", {
                x: T.x,
                y: T.y,
                width: T.width,
                height: T.height,
                rx: "8"
              }, null, 8, bf),
              p("text", {
                x: T.x + T.width / 2,
                y: T.y + T.padY + T.line / 2
              }, [
                (c(!0), h(K, null, te(T.lines, (W, Q) => (c(), h("tspan", {
                  key: Q,
                  x: T.x + T.width / 2,
                  dy: Q ? T.line : 0
                }, $(W), 9, $f))), 128))
              ], 8, xf)
            ]))), 128)),
            (c(!0), h(K, null, te(a.value.arrows, (T, W) => (c(), h(K, {
              key: `label-${W}`
            }, [
              T.label ? (c(), h("g", Mf, [
                p("rect", {
                  x: T.label.x,
                  y: T.label.y,
                  width: T.label.width,
                  height: T.label.height,
                  rx: "4"
                }, null, 8, Sf),
                p("text", {
                  x: T.label.x + T.label.width / 2,
                  y: T.label.y + T.label.pad + T.label.line / 2
                }, [
                  (c(!0), h(K, null, te(T.label.lines, (Q, E) => (c(), h("tspan", {
                    key: E,
                    x: T.label.x + T.label.width / 2,
                    dy: E ? T.label.line : 0
                  }, $(Q), 9, Ef))), 128))
                ], 8, _f)
              ])) : O("", !0)
            ], 64))), 128))
          ], 12, wf))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Cf = /* @__PURE__ */ Y(Af, [["__scopeId", "data-v-51d24cfe"]]), oo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', ro = {
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
  agent: oo,
  worker: oo,
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
}, Of = ["innerHTML"], Tf = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = N(() => ro[t.name] || ro.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Of));
  }
}, nt = /* @__PURE__ */ Y(Tf, [["__scopeId", "data-v-beb5935c"]]), If = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      D(nt, { name: "fold" })
    ], 2));
  }
}, Rt = /* @__PURE__ */ Y(If, [["__scopeId", "data-v-d03899bb"]]), Rf = ["data-tip", "aria-label"], Bf = {
  key: 0,
  class: "mact-word"
}, Lf = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      D(nt, { name: "open" }),
      e.open ? (c(), h("span", Bf, $(e.label), 1)) : O("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, Rf));
  }
}, Pr = /* @__PURE__ */ Y(Lf, [["__scopeId", "data-v-3b292e09"]]), jr = 120, In = 280, qr = 160, Nf = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Df = ["leaving", "resizing", "entering"];
function Zs(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Pf(e) {
  const t = Df.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = Zs(e);
  return e.classList.add(...t), n;
}
function Fr(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = B(t()), a = B("");
  let o = 0;
  const r = (f, g) => Object.assign(f.style, { width: `${g.width}px`, height: `${g.height}px` }), i = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function l(f, g) {
    i(f);
    const v = Pf(f);
    r(f, g), f.offsetWidth, f.style.transition = `width ${In}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${In}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, v);
  }
  function u(f) {
    const g = f.querySelector(":scope > :not(.top)");
    if (!g || typeof ResizeObserver > "u") return null;
    let v = g.offsetHeight;
    const M = new ResizeObserver(() => {
      g.offsetHeight !== v && (v = g.offsetHeight, l(f, Zs(f)));
    });
    return M.observe(g), M;
  }
  async function d(f) {
    const g = e.value, v = ++o;
    if (!g || !g.offsetWidth || Nf()) {
      s.value = f;
      return;
    }
    const M = Zs(g);
    if (r(g, M), a.value = "leaving", await n(jr), v !== o) return;
    s.value = f, a.value = "resizing", await $t(), l(g, M);
    const x = u(g);
    await n(In), x == null || x.disconnect(), v === o && (i(g), a.value = "entering", await n(qr), v === o && (a.value = ""));
  }
  return ke(t, (f) => d(f)), Dt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const jf = { class: "growing-card-top" }, qf = ["aria-expanded"], Ff = { class: "growing-card-avatar" }, Wf = { class: "growing-card-title" }, Hf = { class: "growing-card-more" }, Uf = { class: "growing-card-body" }, zf = {
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
    const n = e, s = t, a = B(!1), o = B(null), { folded: r, phase: i } = Fr(o, () => !a.value), l = N(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = N(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", V(i), { open: !V(r), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", jf, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (g) => a.value = !a.value)
        }, [
          p("span", Ff, [
            e.bad ? (c(), G(nt, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(K, { key: 1 }, [
              oe($(l.value), 1)
            ], 64)) : (c(), G(ge, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Wf, $(e.title), 1),
          D(Rt, { open: a.value }, null, 8, ["open"])
        ], 8, qf),
        e.action ? (c(), G(Pr, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (g) => s("act"))
        }, null, 8, ["label", "open"])) : O("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (g) => s("comment"))
        }, [
          D(ge, {
            name: "bubble",
            size: 13
          })
        ])) : O("", !0)
      ]),
      p("div", Hf, [
        p("div", Uf, [
          (c(!0), h(K, null, te(u.value, (g, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, $(g), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Vf = /* @__PURE__ */ Y(zf, [["__scopeId", "data-v-08411e3a"]]), Wr = /* @__PURE__ */ new WeakMap(), Gf = (e, t) => Wr.set(e, t);
function Kf(e, t) {
  for (let n = t; n; n = Wr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Hr(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Kf(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ie(() => window.removeEventListener("click", n));
}
const Yf = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, Jf = {
  key: 0,
  class: "message-links-many"
}, Zf = ["aria-expanded"], Xf = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, Qf = ["onClick"], e1 = { class: "row-pill message-links-chip" }, t1 = { class: "message-links-title" }, ms = 3, io = "task", n1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = _e(Ae, null), s = N(() => t.links.length), a = N(() => t.links.every((g) => g.model === io) ? "tasks" : "items"), o = N(() => `Linked: ${t.links.map((g) => `${g.model} ${g.id}`).join(" ")}`), r = B(!1), i = B({}), l = B(null);
    Hr(l, () => r.value = !1);
    async function u() {
      const g = t.links.filter((M) => M.model === io && !(M.id in i.value)), v = await Promise.all(g.map((M) => n.read(`task show ${M.id}`)));
      i.value = { ...i.value, ...Object.fromEntries(v.filter((M) => M.ok).map((M) => [M.value.id, M.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(g) {
      r.value = !1, Ue(`${ut(g.model)}:${g.id}`);
    }
    return (g, v) => (c(), h("div", {
      ref_key: "line",
      ref: l,
      class: Z(["message-links", { many: s.value > ms, three: s.value === ms, open: r.value }]),
      "data-message-links": ""
    }, [
      D(nt, {
        class: "message-links-icon",
        name: "linked"
      }),
      p("span", Yf, [
        D(lt, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      s.value >= ms ? (c(), h("span", Jf, [
        p("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          oe($(s.value) + " linked " + $(a.value) + " ", 1),
          D(Rt, { open: r.value }, null, 8, ["open"])
        ], 8, Zf)
      ])) : O("", !0),
      r.value ? (c(), h("div", Xf, [
        (c(!0), h(K, null, te(e.links, (M) => (c(), h("button", {
          key: `${M.model}:${M.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (x) => f(M)
        }, [
          p("span", e1, $(M.model) + " " + $(M.id), 1),
          p("span", t1, $(i.value[M.id]), 1)
        ], 8, Qf))), 128))
      ])) : O("", !0)
    ], 2));
  }
}, s1 = /* @__PURE__ */ Y(n1, [["__scopeId", "data-v-24868afd"]]), a1 = ["title", "aria-label"], o1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, r1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, i1 = {
  __name: "ReadTicks",
  props: { message: { type: Object, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    const t = e, n = { sent: "Sent", read: "Read", filed: "Processed" }, s = N(() => (t.message.filed || []).length ? "filed" : t.message.read_at ? "read" : "sent");
    return (a, o) => (c(), h("span", {
      class: Z(["ticks", s.value, e.tone]),
      role: "img",
      title: n[s.value],
      "aria-label": n[s.value]
    }, [
      (c(), h("svg", o1, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", r1)) : O("", !0)
      ]))
    ], 10, a1));
  }
}, l1 = /* @__PURE__ */ Y(i1, [["__scopeId", "data-v-6dc92808"]]);
function c1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function u1(e, t = Date.now()) {
  const n = c1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
function Ur(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function lo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ps = (e) => String(e).padStart(2, "0");
function d1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ps(t % 60)}s` : `${Math.floor(t / 3600)}h ${ps(Math.floor(t % 3600 / 60))}m ${ps(t % 60)}s`;
}
const h1 = "img,pre,table";
function f1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function m1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function p1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(h1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = e.offsetHeight, a = f1(m1(e), n || 0);
  a && (a >= e.offsetWidth || (e.style.width = `${a}px`, e.offsetHeight !== s && (e.style.width = "")));
}
function g1(e, t) {
  let n = null;
  const s = () => e.value && p1(e.value);
  qe(() => {
    var o, r;
    if (s(), (o = document.fonts) == null || o.ready.then(s), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ie(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const v1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function y1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const w1 = ["data-incoming", "data-ref"], k1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], b1 = { class: "message-body" }, x1 = ["title"], $1 = ["innerHTML"], M1 = ["title"], S1 = ["innerHTML"], _1 = {
  class: "message-faces",
  "data-message-faces": ""
}, E1 = ["title", "data-face", "onClick"], A1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, C1 = ["title", "data-reaction", "onClick"], O1 = {
  key: 0,
  class: "message-reaction-count"
}, T1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, I1 = ["href", "title"], R1 = ["src", "alt"], B1 = ["href"], L1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, N1 = ["data-sent-worker", "title", "onClick"], D1 = { class: "message-foot" }, P1 = { class: "message-time" }, j1 = {
  class: "message-id",
  "data-message-id": ""
}, q1 = 140, F1 = 2, W1 = 1500, H1 = "An earlier message", U1 = "about", z1 = "sent_to", V1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var P;
    const n = e, s = t, a = B(!1), o = B(null), r = N(() => ["user", "comment"].includes(n.message.type)), i = N(() => {
      const [L, J] = (n.message.commented_row || ":").split(":"), z = ut(L);
      return z ? { ref: `${z}:${J}`, label: `${hn(z).title.toLowerCase()} ${J}` } : null;
    }), l = N(() => n.message.worker_id ?? null), u = B(!1), d = N(() => l.value !== null && ((n.message.text ?? "").length > q1 || (n.message.text ?? "").split(`
`).filter((L) => L.trim()).length > F1)), f = N(() => r.value && !n.message.read_at && !n.message.local);
    async function g() {
      var L;
      await ((L = navigator.clipboard) == null ? void 0 : L.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, W1);
    }
    const v = N(() => Gs(n.message.text ?? "", { env: "" })), M = N(() => JSON.parse(n.message.flowchart_edges || "[]")), x = B(!1), _ = N(() => Gs(n.quote || H1, { env: "" }));
    function T() {
      const L = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      L ? L.scrollIntoView({ block: "center", behavior: "smooth" }) : Ue(`messages:${n.message.parent_id}`);
    }
    g1(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, Q = (L) => `/api/files/message/${n.message.id}/${encodeURIComponent(L)}`, E = N(() => JSON.parse(n.message.captions || "{}")), b = N(() => (n.message.files ?? []).map((L) => ({ name: L, address: Q(L), isImage: W.test(L), title: E.value[L] || L }))), A = N(() => Ur(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), y = _e(Ae, null), C = B([]), w = B([]);
    async function S() {
      if (!r.value || !(y != null && y.read) || n.message.local) return;
      const L = await y.read(`link list --source message:${n.message.id}`);
      if (!L.ok) return;
      const J = L.value.rows ?? L.value ?? [];
      C.value = J.filter((z) => z.link_type === U1).map((z) => ({ model: z.target_model, id: z.target_id })), w.value = J.filter((z) => z.link_type === z1).map((z) => z.target_id);
    }
    S(), (P = y == null ? void 0 : y.follow) == null || P.call(y, ["link.*"], S);
    const k = B(!1), m = N(() => y1(n.message.reactions));
    function I(L) {
      k.value = !1, s("react", n.message, L);
    }
    return (L, J) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      D(Vf, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, w1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", b1, [
        p("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: i.value }]),
          onClick: J[6] || (J[6] = (...z) => V(Ot) && V(Ot)(...z))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: J[1] || (J[1] = be((z) => V(Ue)(i.value.ref), ["stop"]))
          }, [
            D(ge, {
              name: "bubble",
              size: 12
            }),
            p("span", null, "Comment on " + $(i.value.label), 1)
          ], 8, x1)) : O("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(T, ["stop"]),
            innerHTML: _.value
          }, null, 8, $1)) : O("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: J[2] || (J[2] = be((z) => V(Ue)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + $(l.value), 9, M1)) : O("", !0),
          p("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, S1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = be((z) => u.value = !u.value, ["stop"]))
          }, $(u.value ? "Show less" : "Show more"), 1)) : O("", !0),
          M.value.length ? (c(), h(K, { key: 4 }, [
            p("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (z) => x.value = !0)
            }, "Open the flowchart"),
            x.value ? (c(), G(Cf, {
              key: 0,
              title: e.message.text,
              edges: M.value,
              onClose: J[5] || (J[5] = (z) => x.value = !1)
            }, null, 8, ["title", "edges"])) : O("", !0)
          ], 64)) : O("", !0)
        ], 2),
        p("div", {
          class: Z(["message-tools", { picking: k.value }]),
          "data-message-tools": ""
        }, [
          k.value ? (c(), h(K, { key: 0 }, [
            p("div", _1, [
              (c(!0), h(K, null, te(V(v1), (z) => (c(), h("button", {
                key: z,
                type: "button",
                class: "message-face",
                title: `React ${z}`,
                "data-face": z,
                onClick: (ce) => I(z)
              }, $(z), 9, E1))), 128))
            ]),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (z) => k.value = !1)
            }, [
              D(ge, {
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
              onClick: J[8] || (J[8] = (z) => k.value = !0)
            }, "React"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[9] || (J[9] = (z) => s("reply", e.message))
            }, "Reply"),
            p("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: g
            }, $(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (z) => s("delete", e.message))
            }, "Delete")) : O("", !0)
          ], 64))
        ], 2)
      ]),
      m.value.length ? (c(), h("div", A1, [
        (c(!0), h(K, null, te(m.value, (z) => (c(), h("button", {
          key: z.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: z.mine }]),
          title: z.title,
          "data-reaction": z.emoji,
          onClick: (ce) => s("react", e.message, z.emoji)
        }, [
          oe($(z.emoji) + " ", 1),
          z.count > 1 ? (c(), h("span", O1, $(z.count), 1)) : O("", !0)
        ], 10, C1))), 128))
      ])) : O("", !0),
      b.value.length ? (c(), h("div", T1, [
        (c(!0), h(K, null, te(b.value, (z) => (c(), h(K, {
          key: z.name
        }, [
          z.isImage ? (c(), h("a", {
            key: 0,
            href: z.address,
            target: "_blank",
            class: "message-image",
            title: z.title
          }, [
            p("img", {
              src: z.address,
              alt: z.name,
              "data-figure-picture": ""
            }, null, 8, R1)
          ], 8, I1)) : (c(), h("a", {
            key: 1,
            href: z.address,
            target: "_blank",
            class: "message-file"
          }, $(z.name), 9, B1))
        ], 64))), 128))
      ])) : O("", !0),
      w.value.length ? (c(), h("div", L1, [
        D(ge, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, te(w.value, (z) => (c(), h("button", {
          key: z,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": z,
          title: `Open worker ${z}`,
          onClick: be((ce) => V(Ue)(`agents:${z}`), ["stop"])
        }, "Also sent to worker " + $(z), 9, N1))), 128))
      ])) : O("", !0),
      p("div", D1, [
        p("time", P1, $(A.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          J[11] || (J[11] = p("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          p("span", j1, "message " + $(e.message.id), 1)
        ], 64)) : O("", !0),
        r.value ? (c(), G(l1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : O("", !0)
      ]),
      C.value.length ? (c(), G(s1, {
        key: 3,
        links: C.value
      }, null, 8, ["links"])) : O("", !0)
    ], 8, k1));
  }
}, gb = /* @__PURE__ */ Y(V1, [["__scopeId", "data-v-5547df44"]]), G1 = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = Zi("SkeletonParts", !0);
      return c(!0), h(K, null, te(e.parts, (l, u) => (c(), h(K, { key: u }, [
        (c(!0), h(K, null, te(l.count, (d) => (c(), G(cn, {
          key: d,
          value: l.shape
        }, {
          line: F(() => [
            p("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: F(() => [
            p("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: F(() => [
            p("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: F(() => [...r[0] || (r[0] = [
            p("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: F(() => [
            p("div", {
              class: "skeleton-row",
              style: fe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: F(() => [
            p("div", {
              class: "skeleton-stack",
              style: fe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: F(() => [
            p("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: fe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: F(() => [
            p("div", {
              class: "skeleton-grid",
              style: fe(a(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          _: 2
        }, 1032, ["value"]))), 128))
      ], 64))), 128);
    };
  }
}), K1 = /* @__PURE__ */ Y(G1, [["__scopeId", "data-v-576c95e1"]]), Y1 = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, J1 = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", Y1, [
      D(K1, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, zr = /* @__PURE__ */ Y(J1, [["__scopeId", "data-v-52f66b64"]]), qn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], gs = 200, Vr = (e) => {
  var t;
  return ((t = qn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? qn[0].key;
}, vb = (e) => {
  var t;
  return ((t = qn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, Z1 = ["aria-label"], X1 = 300, co = 400, Q1 = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: gs } },
  setup(e) {
    const t = e, n = N(() => Vr(t.value)), s = N(() => n.value < gs ? [1, 0.25, 0.25] : n.value === gs ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= co, high: n.value >= X1 && n.value < co }]),
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
        style: fe({ opacity: s.value[0] })
      }, null, 4),
      p("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: fe({ opacity: s.value[1] })
      }, null, 4),
      p("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: fe({ opacity: s.value[2] })
      }, null, 4)
    ], 10, Z1));
  }
}, yb = /* @__PURE__ */ Y(Q1, [["__scopeId", "data-v-b10e610f"]]), em = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, uo = (e) => em[e.card.state] || "idle", tm = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), ho = { working: 0, waiting: 1, idle: 2, stopped: 3 }, fo = (e, t) => ho[uo(e)] - ho[uo(t)], mo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, wb = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => fo(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || tm(s, a)) : [...e].sort((s, a) => fo(s, a) || (mo[t] || mo.state)(s, a)), nm = ["aria-checked", "aria-haspopup", "onClick"], sm = {
  key: 0,
  class: "segmented-dot"
}, am = {
  key: 1,
  class: "segmented-count"
}, om = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = zo();
    return (a, o) => {
      const r = Xi("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(K, null, te(e.options, (i) => ht((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Z(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", sm)) : O("", !0),
          oe(" " + $(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", am, $(i.count), 1)) : O("", !0)
        ], 10, nm)), [
          [r, i.tip || i.title, `${V(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Gr = /* @__PURE__ */ Y(om, [["__scopeId", "data-v-ca953072"]]), rm = { class: "form-field" }, im = { class: "form-field-head" }, lm = ["for"], cm = {
  key: 0,
  class: "form-field-aside"
}, um = {
  key: 0,
  class: "form-field-help"
}, dm = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", rm, [
      p("div", im, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, $(e.label), 9, lm),
        t.$slots.aside ? (c(), h("span", cm, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", um, $(e.help), 1)) : O("", !0)
    ]));
  }
}, kb = /* @__PURE__ */ Y(dm, [["__scopeId", "data-v-dd7cdcff"]]), hm = { class: "list-row" }, fm = {
  key: 0,
  class: "list-row-kind"
}, mm = { class: "list-row-main" }, pm = {
  key: 0,
  class: "list-row-title"
}, gm = { class: "list-row-body" }, vm = {
  key: 1,
  class: "list-row-end"
}, ym = {
  key: 1,
  class: "list-row-text"
}, wm = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", hm, [
      e.kind ? (c(), h("span", fm, $(e.kind), 1)) : O("", !0),
      p("div", mm, [
        e.title ? (c(), h("span", pm, $(e.title), 1)) : O("", !0),
        p("div", gm, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", vm, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      e.text ? (c(), h("span", ym, $(e.text), 1)) : O("", !0)
    ]));
  }
}, bb = /* @__PURE__ */ Y(wm, [["__scopeId", "data-v-63155fba"]]), km = {
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
}, bm = { claude: "Claude Code", codex: "Codex" }, xm = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, $m = {
  key: 1,
  class: "menu-item-text"
}, Mm = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", xm, $(e.checked ? "✓" : ""), 1)) : O("", !0),
      e.description ? (c(), h("span", $m, [
        p("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, $(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Bt = /* @__PURE__ */ Y(Mm, [["__scopeId", "data-v-fec99974"]]), Sm = (e, t, n) => Math.max(t, Math.min(n, e)), _m = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Ct = 8, Em = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = B(null), o = (m) => m ? `${m}px` : void 0, r = N(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = B({ w: 0, h: 0 }), l = B(s.anchor ? s.anchor.getBoundingClientRect() : null), u = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), d = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), f = (m) => {
      const I = m.closest(".pane, .float-window");
      return I ? d(I.getBoundingClientRect()) : u();
    }, g = (m, I) => `${Math.max(0, m ? Math.min(m, I) : I)}px`;
    function v(m, I) {
      return {
        below: m.bottom - I.bottom - s.gap - Ct,
        above: I.top - m.top - s.gap - Ct,
        across: m.right - m.left - 2 * Ct
      };
    }
    function M(m) {
      const I = f(s.anchor), P = v(I, m);
      return i.value.w <= P.across && i.value.h <= Math.max(P.below, P.above) ? I : u();
    }
    const x = N(() => {
      if (!l.value) return r.value;
      const m = l.value, I = M(m), P = v(I, m), { w: L, h: J } = i.value, z = s.align === "auto" ? m.left + m.right > I.left + I.right : s.align === "right", ce = Sm(z ? m.right - L : m.left, I.left + Ct, Math.max(I.left + Ct, I.right - L - Ct)), ye = J > P.below && P.above > P.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: g(s.maxHeight, P.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: g(s.maxHeight, P.below) };
      return { ...r.value, ...ye, left: `${ce}px`, maxWidth: g(s.maxWidth, P.across) };
    }), _ = n, T = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function W(m) {
      const I = T(), P = I.indexOf(document.activeElement);
      I[(P + m + I.length) % I.length].focus();
    }
    const Q = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => _("close") }, E = (m) => Q[m.key] && (m.preventDefault(), Q[m.key]()), b = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let A = 0;
    const y = new ResizeObserver(() => {
      cancelAnimationFrame(A), A = requestAnimationFrame(b);
    });
    Hr(a, (m) => s.anchor && !s.anchor.contains(m.target) && _("close"));
    const C = (m, I) => ["top", "left", "right", "bottom"].some((P) => Math.abs(m[P] - I[P]) > 1), w = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let S = 0;
    function k() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || w(m)) return _("close");
        C(m, l.value) && (l.value = m);
      }
      S = requestAnimationFrame(k);
    }
    return qe(() => {
      s.anchor && a.value && Gf(a.value, s.anchor), b(), a.value && y.observe(a.value), !s.plain && T()[0] && T()[0].focus(), k();
    }), Ie(() => {
      y.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(A);
    }), t({ element: a }), (m, I) => (c(), G(ma, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", tt({
        ref_key: "panel",
        ref: a
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: x.value,
        onKeydown: E
      }), [
        he(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Sa = /* @__PURE__ */ Y(Em, [["__scopeId", "data-v-3d203970"]]), Am = ["aria-expanded"], Cm = { class: "drop-label" }, Om = ["value"], Tm = {
  key: 1,
  class: "drop-lead"
}, Im = { class: "drop-item-text" }, Rm = {
  key: 2,
  class: "drop-note"
}, Bm = {
  key: 1,
  class: "drop-none"
}, Lm = {
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
    const n = e, s = t, a = B(!1), o = B(null), r = B(""), i = N(() => {
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
        e.icon ? (c(), G(ge, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : O("", !0),
        p("span", Cm, $(e.label), 1),
        D(ge, {
          name: "down",
          size: 11
        })
      ], 10, Am),
      a.value ? (c(), G(Sa, {
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
          }, null, 40, Om)) : O("", !0),
          (c(!0), h(K, null, te(i.value, (f) => (c(), G(Bt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (g) => l(f)
          }, {
            default: F(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : O("", !0),
              f.lead ? (c(), h("span", Tm, $(f.lead), 1)) : O("", !0),
              p("span", Im, $(f.label), 1),
              f.note ? (c(), h("span", Rm, $(f.note), 1)) : O("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? O("", !0) : (c(), h("p", Bm, $(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : O("", !0)
    ], 2));
  }
}, Nm = /* @__PURE__ */ Y(Lm, [["__scopeId", "data-v-29dfcce5"]]), xb = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => [
      ...km[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = N(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, i) => (c(), G(Nm, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${V(bm)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Dm = ["aria-label"], Pm = { class: "head" }, jm = { class: "names" }, qm = { class: "body" }, Fm = {
  key: 0,
  class: "foot"
}, Wm = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Lr(s, n), i = Nr(a);
    return (l, u) => (c(), G(ma, { to: "body" }, [
      D(Nt, {
        name: "side",
        appear: "",
        onAfterLeave: V(r)
      }, {
        default: F(() => [
          V(a) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: V(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => V(o) && V(o)(...d), ["self"]))
          }, [
            p("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                p("header", Pm, [
                  p("div", jm, [
                    p("h2", null, $(e.title), 1),
                    e.abstract ? (c(), G(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : O("", !0)
                  ]),
                  he(l.$slots, "actions", {}, void 0, !0),
                  D(Zn, {
                    title: e.closeLabel,
                    onClick: V(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                p("div", qm, [
                  he(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Fm, [
                  he(l.$slots, "foot", {}, void 0, !0)
                ])) : O("", !0)
              ], 64)) : he(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, Dm)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, $b = /* @__PURE__ */ Y(Wm, [["__scopeId", "data-v-c9a3f43a"]]), Xs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Hm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Vn(), n = N(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => ht((c(), h("textarea", tt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [V(Xs), V(t).value]
    ]);
  }
}), Mb = /* @__PURE__ */ Y(Hm, [["__scopeId", "data-v-e130a5b9"]]), Um = {
  key: 1,
  class: "text-field-label"
}, zm = {
  key: 2,
  class: "text-field-end"
}, Vm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ds({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ns(e, "modelValue"), s = Vn(), a = "onUpdate:modelValue" in (((d = Qi()) == null ? void 0 : d.vnode.props) || {}), o = N(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = N(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = N(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = B(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, g) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, V(s).class]),
      style: fe(V(s).style)
    }, [
      e.icon ? (c(), G(ge, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : O("", !0),
      e.label ? (c(), h("span", Um, $(e.label), 1)) : O("", !0),
      ht(p("input", tt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [V(Xs), o.value]
      ]),
      f.$slots.end ? (c(), h("span", zm, [
        he(f.$slots, "end", {}, void 0, !0)
      ])) : O("", !0)
    ], 6)) : ht((c(), h("input", tt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [V(Xs), o.value]
    ]);
  }
}), Sb = /* @__PURE__ */ Y(Vm, [["__scopeId", "data-v-d9c38ca8"]]), Gm = 150;
function Kr(e, t, n = Gm, s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
const po = (e) => e.page * e.size < e.total;
function _b(e) {
  const t = un().sources.find((n) => n.key === e);
  return t ? Qs(t.read, t.events) : Qs("", []);
}
function Qs(e, t, { incremental: n = !1 } = {}) {
  const s = un(), a = B([]), o = B(null), r = B(""), i = B(!1), l = performance.now(), u = B(!1), d = B(""), f = B(null);
  async function g(E) {
    const b = x, A = await s.read(`${e} --before-id ${E + 1} --limit 1`);
    if (b !== x) return;
    if (!A.ok) return T();
    const y = A.value.rows.find((C) => C.id === E);
    a.value = y ? a.value.map((C) => C.id === E ? y : C) : a.value.filter((C) => C.id !== E);
  }
  async function v(E) {
    if (n && String((E == null ? void 0 : E.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((S) => S.id !== E.row_id));
    if (n && (E != null && E.row_id) && !String(E.event ?? "").endsWith(".create") && a.value.some((S) => S.id === E.row_id)) return g(E.row_id);
    if (!(n && a.value.length && String((E == null ? void 0 : E.event) ?? "").endsWith(".create"))) return T();
    const A = Math.max(...a.value.map((S) => S.id)), y = x, C = await s.read(`${e} --after-id ${A}`);
    if (y !== x) return;
    if (!C.ok) return T();
    const w = new Set(a.value.map((S) => S.id));
    a.value = [...C.value.rows.filter((S) => !w.has(S.id)), ...a.value];
  }
  async function M() {
    if (!a.value.length) return !1;
    const E = x, b = Math.min(...a.value.map((C) => C.id)), A = await s.read(`${e} --before-id ${b}`);
    if (E !== x) return !1;
    if (!A.ok || !A.value.rows.length) return u.value = !1;
    u.value = po(A.value);
    const y = new Set(a.value.map((C) => C.id));
    return a.value = [...a.value, ...A.value.rows.filter((C) => !y.has(C.id))], !0;
  }
  let x = 0;
  async function _(E) {
    const b = ++x, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (b !== x) return;
    const y = A.ok ? s.shared ? [A.value] : A.value.rows : [];
    a.value = E(y), o.value = A.ok ? A.value : null;
    const C = y.length ? Math.min(...y.map((w) => w.id)) : 0;
    A.ok && !a.value.some((w) => w.id < C) && (u.value = !s.shared && po(A.value)), r.value = A.ok ? "" : A.error, Kr(l, () => i.value = !0);
  }
  function T() {
    return _((E) => {
      if (!n || !E.length) return E;
      const b = Math.min(...E.map((y) => y.id)), A = Math.max(...E.map((y) => y.id));
      return [...a.value.filter((y) => y.id > A), ...E, ...a.value.filter((y) => y.id < b)];
    });
  }
  const W = () => _((E) => E);
  async function Q(E, b = null) {
    const A = a.value;
    b && (a.value = b(A));
    const y = await s.run(E);
    return b && !y.ok && (a.value = A), d.value = y.ok ? "" : y.error, f.value = y.ok ? y.value : null, await T(), y;
  }
  return e && (s.follow(t, v), T()), { rows: a, listing: o, failure: r, loaded: i, more: u, load: T, loadLatest: W, older: M, act: Q, actionFailure: d, answer: f, context: s };
}
const Km = { class: "title" }, Ym = { class: "state" }, Jm = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Qs(t.line, t.events);
    return (o, r) => (c(), G(ec, {
      rows: V(n),
      failure: V(s),
      loaded: V(a),
      empty: e.empty
    }, {
      default: F(({ row: i }) => [
        p("span", Km, $(i.title), 1),
        p("span", Ym, $(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Eb = /* @__PURE__ */ Y(Jm, [["__scopeId", "data-v-a69084cd"]]);
function Zm(e = 1e3, t = null) {
  const n = B(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ke(t, a, { immediate: !0 }) : a(!0), Ie(() => clearInterval(s)), n;
}
const vs = B(Date.now() / 1e3);
let go = 0, Sn = 0;
function Xm() {
  return Sn || (vs.value = Date.now() / 1e3, go = setInterval(() => vs.value = Date.now() / 1e3, 1e3)), Sn += 1, Vo() && Go(() => {
    Sn -= 1, Sn || clearInterval(go);
  }), vs;
}
const Qm = 200, ep = jr + In + qr + Qm;
function Ut(e) {
  if (!e) return null;
  const { x: t, y: n, width: s, height: a } = e.getBoundingClientRect();
  return { x: t, y: n, width: s, height: a, opacity: getComputedStyle(e).opacity };
}
function tp(e, t, n) {
  var s, a;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: Ut(e),
    top: Ut(e.querySelector(".top")),
    title: Ut(e.querySelector(".title")),
    contents: Ut(e.querySelector(":scope > :not(.top)")),
    scroll: ((s = e.closest(".history")) == null ? void 0 : s.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var r, i, l, u;
      return `${((i = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : i.className) || ((u = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: u, display: d }) => ({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: u, display: d }))(getComputedStyle(e)),
    parent: Ut(e.parentElement),
    parentClasses: ((a = e.parentElement) == null ? void 0 : a.className) ?? ""
  };
}
function np(e, t, n, s) {
  ke(t, (a) => {
    var u;
    const o = e.value;
    if (!o || !(s != null && s.run) || !((u = s.markMotion) != null && u.value)) return;
    const r = performance.now(), i = [];
    function l() {
      if (s.markMotion.value) {
        if (i.push(tp(o, r, n.value)), performance.now() - r < ep) return void requestAnimationFrame(l);
        s.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: a, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    l();
  }, { flush: "sync" });
}
const sp = ["title", "data-figure-mark", "data-folded", "data-open"], ap = {
  key: 2,
  class: "worker"
}, op = { class: "head" }, rp = { key: 0 }, ip = {
  key: 3,
  class: "status"
}, lp = {
  key: 0,
  class: "figure"
}, cp = {
  key: 1,
  class: "ran-for"
}, up = { key: 2 }, dp = {
  key: 3,
  class: "news"
}, hp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, fp = {
  key: 6,
  class: "settled"
}, mp = {
  key: 1,
  class: "bar"
}, pp = {
  key: 3,
  class: "detail body"
}, gp = {
  key: 0,
  class: "body-label"
}, vp = ["title"], yp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Vn(), s = ["onClick", "onAct"], a = N(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = B(!1), r = N(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = N(() => t.open !== void 0), l = N(() => i.value || r.value), u = N(() => i.value ? t.open : o.value), d = N(() => i.value ? !t.open : r.value && !o.value), f = N(() => !!(t.mark.action && n.onAct)), g = N(() => l.value || f.value || !!n.onClick), v = B(null), M = B(null), { folded: x, phase: _ } = Fr(v, () => d.value);
    np(v, d, _, _e(Ae, null));
    function T(le) {
      var ye, Re;
      if (!(le.target !== v.value && !M.value.contains(le.target))) {
        if (i.value) return (ye = n.onClick) == null ? void 0 : ye.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Re = n.onAct || n.onClick) == null || Re(le);
      }
    }
    const W = (le) => n.onAct(le), Q = ["failed", "unfinished"], E = N(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), b = N(() => t.mark.color ? t.mark.color : E.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : E.value ? `var(--tone-${E.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), A = N(() => b.value || "var(--tone-work)"), y = N(() => !t.mark.ending && !t.mark.ended && E.value !== "stopped"), C = Xm(), w = N(
      () => t.mark.began_at && y.value && !t.mark.figure && !t.mark.counting ? d1(C.value - t.mark.began_at) : ""
    ), S = N(() => {
      const { started: le, ended: ye } = t.mark;
      return le ? ye ? `ran ${lo(ye - le, !0)}` : lo(C.value - le, !0) : w.value;
    }), k = ["bad", "danger", "warn"], m = N(() => k.includes(E.value) || t.mark.asks ? "attention" : y.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), I = ["bad", "danger"], P = N(() => I.includes(E.value)), L = N(() => m.value === "process" ? "running" : P.value ? "cross" : E.value === "stopped" ? "stopped" : E.value === "good" ? "tick" : ""), J = N(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), z = N(() => [t.mark.title, t.mark.time ? Ur(t.mark.time) : ""].filter(Boolean).join(" · ")), ce = N(() => ({
      ...b.value ? { "--mark": b.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ye) => (c(), h("div", tt(a.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${m.value}`,
        V(_),
        {
          open: u.value,
          folding: i.value && d.value,
          live: g.value,
          failed: P.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: b.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ce.value,
      title: z.value,
      "data-figure-mark": e.mark.key,
      "data-folded": V(x) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: T
    }), [
      (c(), G(xt(g.value ? "button" : "span"), {
        ref_key: "top",
        ref: M,
        class: "top",
        type: g.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: F(() => [
          e.mark.markIcon ? (c(), G(nt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ge, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", ap, $(e.mark.worker), 1)) : O("", !0),
          p("span", op, [
            D(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", rp, $(e.mark.name), 1)) : O("", !0),
            l.value ? (c(), G(Rt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : O("", !0)
          ]),
          J.value ? (c(), h("span", ip, [
            e.mark.figure ? (c(), h("span", lp, $(e.mark.figure), 1)) : O("", !0),
            S.value ? (c(), h("span", cp, $(S.value), 1)) : O("", !0),
            e.mark.stopping ? (c(), h("span", up, "Stopping")) : O("", !0),
            e.mark.news ? (c(), h("span", dp, $(e.mark.news), 1)) : O("", !0),
            L.value === "running" ? (c(), h("span", hp)) : L.value ? (c(), G(nt, {
              key: 5,
              class: Z(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : O("", !0),
            e.mark.settled ? (c(), h("span", fp, $(e.mark.settled), 1)) : O("", !0)
          ])) : O("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(Pr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(W, ["stop"])
      }, null, 8, ["label", "open"])) : O("", !0),
      (e.mark.figure || e.mark.counting) && y.value ? (c(), h("span", mp, [
        p("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: A.value })
        }, null, 4)
      ])) : O("", !0),
      e.mark.detail && !V(x) ? (c(), G(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      e.mark.body && !V(x) ? (c(), h("div", pp, [
        e.mark.bodyLabel ? (c(), h("p", gp, $(e.mark.bodyLabel), 1)) : O("", !0),
        D(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : O("", !0),
      e.mark.command && !V(x) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, vp)) : O("", !0),
      e.mark.card ? (c(), G(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      he(le.$slots, "default", {
        shown: !V(x)
      }, void 0, !0)
    ], 16, sp));
  }
}), Yr = /* @__PURE__ */ Y(yp, [["__scopeId", "data-v-b4038573"]]), wp = 60;
function kp(e, t) {
  const n = B([]), s = B(0);
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
    if (r || s.value <= 0 || d.scrollTop > wp) return;
    r = !0;
    const f = d.scrollHeight, g = await e(["output", "page", String(t()), "--before", String(s.value)]);
    r = !1, g.ok && (n.value = [...g.value.lines, ...n.value], s.value = g.value.first_byte, await $t(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: i, follow: l, loadEarlier: u };
}
const bp = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Jr(e) {
  var n;
  const t = bp[e] || ((n = hn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const xp = (e) => Jr(String(e).split(":")[0]), Zr = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), $p = { passed: "good", failed: "danger", warned: "warn", running: "" }, Mp = { good: "good", warn: "warn", danger: "danger" }, vo = {
  "open row": (e) => Ue(`${e.target_model}:${e.target_id}`),
  "open page": (e) => zl(e.target_model, e.target_id || 0)
}, Sp = { "open row": (e) => xp(e.target_model), "open page": () => Jr("pages") };
function _p(e, t) {
  const n = t || {}, s = vo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? $p[e.outcome] || "" : Mp[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? Sp[s](e) : "",
    handlers: s ? { onAct: () => vo[s](e) } : {}
  };
}
const Ep = 24, Ap = 1e3, yo = 2e3, Cp = 0.25, Op = 5e3;
function Tp(e, t = Ep, n = () => !0) {
  const s = B(!1), a = B(0), o = B(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const E = u();
    return E ? E.scrollHeight - E.scrollTop - E.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function g(E) {
    if (clearTimeout(r), !E) {
      o.value = !1, l = Date.now();
      return;
    }
    const b = Date.now() - l < yo ? yo : Ap;
    r = setTimeout(() => o.value = s.value, b);
  }
  function v() {
    clearTimeout(i), s.value = !1, a.value = 0, g(!1);
  }
  function M(E = !1) {
    const b = u();
    b && E && b.scrollTo ? b.scrollTo({ top: b.scrollHeight, behavior: "smooth" }) : b && (b.scrollTop = b.scrollHeight), v();
  }
  function x() {
    T(), !s.value && (s.value = !0, g(!0));
  }
  const _ = () => !!u() && d() <= u().clientHeight * Cp;
  function T() {
    clearTimeout(i), _() && (i = setTimeout(() => s.value && _() && n() && M(!0), Op));
  }
  function W() {
    f() ? v() : x();
  }
  function Q(E = 1, b = !1) {
    s.value ? a.value += Math.max(0, E) : M(b);
  }
  return Vo() && Go(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: M, left: x, scrolled: W, arrived: Q };
}
const Ip = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, Rp = (e) => String(e ?? "").replace(Ip, ""), Bp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Tp(a);
    ke(
      () => n.lines.length,
      () => $t(() => i()),
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
      oe($(V(Rp)(e.lines.join(`
`)) || e.empty), 1),
      V(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (g) => V(l)(!0))
      }, "Follow")) : O("", !0)
    ], 544));
  }
}, Lp = /* @__PURE__ */ Y(Bp, [["__scopeId", "data-v-c2fb1783"]]), Np = 1e4;
class Dp {
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
    return this.heardAt !== null && t - this.heardAt > Np;
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
const Pp = {
  key: 0,
  class: "frame-note"
}, jp = {
  key: 0,
  class: "frame-note"
}, qp = ["src", "title"], Fp = 1e3, Wp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = un(), s = B(null), a = B(!1), o = B(!1);
    let r = null, i = 0;
    return qe(() => {
      r = new Dp(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Fp);
    }), Ie(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", Pp, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      a.value ? (c(), h("div", jp, [
        u[2] || (u[2] = p("p", null, "This window has not answered for ten seconds.", -1)),
        D(pe, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: F(() => [...u[1] || (u[1] = [
            oe("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : O("", !0),
      p("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: V(n).window
      }, null, 8, qp)
    ], 64));
  }
}, Hp = /* @__PURE__ */ Y(Wp, [["__scopeId", "data-v-32a49046"]]), Up = 0, zp = "/api/lines", Vp = "/api/line";
class Gp {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Up));
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
        const n = await Pe.raw(zp, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Pe.raw(Vp, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Kp = new Gp();
class Yp {
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
      n.patterns.some((s) => Xr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function Xr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const Jp = Symbol("pane-page"), Zp = { 1: "refused", 2: "usage", 3: "fault" }, Xp = 100, Qp = 50, eg = /"([^"]*)"|'([^']*)'|(\S+)/g;
function tg({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = B({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: g = "", tabs: v = [], sources: M = [], links: x = {}, search: _ = {}, readOnly: T = !1, shared: W = null }) {
  const Q = /* @__PURE__ */ new Map(), E = new AbortController(), b = B(!1), A = performance.now();
  let y = 0, C = 0;
  const w = () => {
    clearTimeout(C), C = setTimeout(() => {
      y === 0 && Kr(A, () => b.value = !0);
    }, Qp);
  }, S = (k) => {
    const m = Q.get(k);
    if (m && performance.now() - m.at < Xp) return m.answer;
    y += 1;
    const I = ei(e, k, t, E.signal).finally(() => {
      y -= 1, w();
    });
    return Q.set(k, { answer: I, at: performance.now() }), I;
  };
  return {
    answered: b,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: N(() => s()),
    permissions: a,
    autoScroll: g,
    tabs: v,
    sources: M,
    links: x,
    search: _,
    readOnly: T,
    shared: W,
    read: S,
    run: (k) => tn(e, k, t, E.signal),
    upload: (k) => sg(k, E.signal),
    cancel: () => E.abort(),
    subscriptions: r,
    follow: (k, m) => r.follow(e, k.filter((I) => o.some((P) => Xr(P, I))), m, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (k) => N(() => {
      var m;
      return l.value[k] ?? ((m = u.find((I) => I.key === k)) == null ? void 0 : m.default);
    }),
    setting: async (k, m) => {
      const I = await S(`window setting ${e} ${k}`);
      return I.ok ? I.value.value : m;
    },
    setOption: f,
    keep: (k, m) => tn(e, ["window", "save-setting", e, k, JSON.stringify(m)], t, E.signal)
  };
}
function ng(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const en = { ok: !1, failure: "cancelled", error: "" }, Qr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function tn(e, t, n, s = void 0) {
  try {
    const a = await Kp.add({ window: e, line: Array.isArray(t) ? t : ag(t), environment: n }, s);
    return s != null && s.aborted ? en : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Zp[a.code] || "fault", error: ng(a.error) };
  } catch {
    return s != null && s.aborted ? en : { ok: !1, failure: "unreachable", error: Qr };
  }
}
async function ei(e, t, n, s) {
  const a = await tn(e, t, n, s);
  return a.failure !== "unreachable" || !pa() ? a : (await Uc(), s.aborted ? en : ei(e, t, n, s));
}
async function sg(e, t = void 0) {
  try {
    const n = await Pe.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? en : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? en : { ok: !1, failure: "unreachable", error: Qr };
  }
}
function ag(e) {
  return [...e.matchAll(eg)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function og({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const rg = {
  class: "allowance-prompt",
  role: "dialog"
}, ig = { class: "allowance-prompt-text" }, lg = { class: "allowance-prompt-buttons" }, cg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", rg, [
      p("p", ig, $(V(og)(e.request)), 1),
      p("div", lg, [
        D(pe, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            oe("Allow", -1)
          ])]),
          _: 1
        }),
        D(pe, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            oe("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, ug = /* @__PURE__ */ Y(cg, [["__scopeId", "data-v-102dc765"]]), ys = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(Dn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: F(() => [
        oe($(e.reason) + " ", 1),
        e.retry ? (c(), G(pe, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: F(() => [...a[2] || (a[2] = [
            oe("Retry", -1)
          ])]),
          _: 1
        })) : O("", !0),
        e.removable ? (c(), G(pe, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: F(() => [...a[3] || (a[3] = [
            oe("Remove tab", -1)
          ])]),
          _: 1
        })) : O("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, dg = ["data-window", "data-agent"], hg = {
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
    const n = e, s = t, a = B(""), o = B(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = _e(El, null), l = tg({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: N(() => n.options),
      declared: n.declared,
      page: _e(Jp, null),
      setOption: (f, g) => s("option", f, g),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, g) => {
        s("open", f, g), i == null || i(f, g);
      }
    });
    el(Ae, l), ke(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), qe(l.settle), Ie(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), tl((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => ha(n.component), d = () => {
      var f, g;
      return ((g = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : g.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, g) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G(ug, {
        key: 0,
        request: d(),
        onAnswer: g[0] || (g[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : O("", !0),
      e.unavailableReason ? (c(), G(ys, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(ys, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(K, { key: 4 }, [
        (c(), G(u, { key: o.value })),
        e.skeleton.length && !V(l).answered.value ? (c(), G(zr, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : O("", !0)
      ], 64)) : (c(), G(ys, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: g[1] || (g[1] = (v) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, dg));
  }
}, ti = /* @__PURE__ */ Y(hg, [["__scopeId", "data-v-c4443e2b"]]), fg = {
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
    const n = e, s = t, a = { render: () => ha(Hp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(ti, {
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
}, mg = ["data-window"], pg = {
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
    const n = e, s = t, a = Gn(null), o = B("");
    return ke(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, Dc();
          } catch (i) {
            if (Lc(i) && Nc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      D(zr, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, mg)) : (c(), G(ti, {
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
}, wo = "*.*", gg = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var u;
    const t = e, n = _e(Ae, null), s = new Yp(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [wo], (d) => s.dispatch(d));
    Ie(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? "", r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = N(() => !!(t.declaration.shipped || t.declaration.trusted)), l = N(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [wo] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), G(pg, {
      key: 0,
      entry: l.value,
      subscriptions: V(s),
      environment: V(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(fg, {
      key: 1,
      entry: l.value,
      subscriptions: V(s),
      environment: V(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, vg = { class: "mark-more-inner" }, yg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, wg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, kg = {
  key: 3,
  class: "mark-lines"
}, bg = "process", ko = "task", xg = 2e3, $g = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ae), s = N(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = N(() => Zr.has(t.mark.variant) && t.mark.detail || ""), o = N(() => t.mark.target_model === ko ? t.mark.target_id : 0), r = kp((M) => n.run(M), () => t.mark.target_id), i = r.lines, l = B(!1), u = B(""), d = N(() => t.mark.target_model === bg && !!t.mark.target_id);
    async function f(M = r.follow) {
      const x = await M();
      l.value = !0, u.value = x.ok ? "" : x.error;
    }
    let g = null;
    const v = () => clearInterval(g);
    return ke(() => t.shown && d.value, (M) => {
      v(), M && (f(), t.mark.ended_at || (g = setInterval(f, xg)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (M) => M && t.shown && d.value && (v(), f(r.newest))), Ie(v), (M, x) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: x[1] || (x[1] = be(() => {
      }, ["stop"]))
    }, [
      p("div", vg, [
        e.declaration.body_url ? (c(), G(gg, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(K, { key: 1 }, [
          a.value ? (c(), h(K, { key: 0 }, [
            x[2] || (x[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", yg, $(a.value), 1)
          ], 64)) : O("", !0),
          d.value && u.value ? (c(), h("p", wg, $(u.value), 1)) : d.value && l.value ? (c(), h(K, { key: 2 }, [
            x[3] || (x[3] = p("p", { class: "mark-label" }, "Output", -1)),
            D(Lp, {
              class: "mark-terminal",
              lines: V(i),
              onOlder: V(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : s.value.length ? (c(), h("p", kg, $(s.value.join(`
`)), 1)) : O("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: x[0] || (x[0] = be((_) => V(Ue)(`${ko}:${o.value}`), ["stop"]))
          }, "Open task " + $(o.value) + " and its proofs", 1)) : O("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ea = /* @__PURE__ */ Y($g, [["__scopeId", "data-v-3be263ac"]]), Mg = (e) => `show-${e}`, Ab = (e, t, n) => e.filter((s) => {
  var a;
  return n(Mg((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Sg = "messages.chat", _g = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), _a = (e, t, n) => tn(Sg, _g(e, t), n), Eg = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Ag = ["title", "aria-label", "onClick"], Cg = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Og = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = N(() => Eg(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = B(""), a = _e(Ae);
    async function o(r) {
      const i = await _a(r, t.mark, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(K, null, [
      (c(!0), h(K, null, te(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: be((u) => o(l), ["stop"])
      }, [
        D(nt, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, Ag))), 128)),
      s.value ? (c(), h("span", Cg, $(s.value), 1)) : O("", !0)
    ], 64));
  }
}, Tg = /* @__PURE__ */ Y(Og, [["__scopeId", "data-v-0dfda102"]]);
function ni(e, t) {
  const n = Gn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Pe.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const si = ni("/api/marks", "marks"), Cb = si.fetchAll, Ig = si.find, Rg = 2e3;
function ai(e, t, n = Rg) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  qe(async () => {
    await e(), a();
  }), Dt(() => clearTimeout(s));
}
const Bg = ["data-ref"], Lg = ["data-ref"], Ng = { class: "mark-row" }, Dg = "dock add", Pg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = N(() => Ig(s.mark.type)), o = _e(Ae, null), r = N(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = B(null);
    ai(async () => {
      if (!r.value) return;
      const v = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      v.ok && v.value.rows.length && (i.value = v.value.rows[0].progress);
    }, () => r.value);
    const l = N(() => {
      const v = _p(s.mark, a.value), M = !v.figure || v.figure.endsWith("%");
      return i.value && r.value && M ? { ...v, figure: `${i.value}%`, fraction: i.value / 100 } : v;
    }), u = N(() => {
      var v;
      return !!(s.mark.lines || s.mark.detail && Zr.has(s.mark.variant) || t.has(s.mark.target_model) || (v = a.value) != null && v.body_url);
    }), d = B(!1);
    function f(v) {
      if (l.value.handlers.onAct && !v.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const g = N(() => {
      var v, M, x;
      return s.docked ? (M = (v = a.value) == null ? void 0 : v.buttons) == null ? void 0 : M.filter((_) => {
        var T;
        return !((T = _.runs) != null && T.startsWith(Dg));
      }) : (x = a.value) == null ? void 0 : x.buttons;
    });
    return (v, M) => {
      var x, _;
      return (x = a.value) != null && x.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": V(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        D(ea, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Bg)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (_ = a.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": V(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", Ng, [
          D(Yr, tt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, nl(l.value.handlers), { onClick: f }), sl({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: F(({ shown: T }) => [
                D(ea, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: T
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          D(Tg, {
            buttons: g.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Lg));
    };
  }
}, jg = /* @__PURE__ */ Y(Pg, [["__scopeId", "data-v-06041f79"]]), qg = ["data-ref"], Fg = ["inert"], Wg = { class: "group-fold" }, Hg = { class: "thread-group" }, Ug = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = B(!1), s = B(!1), a = B(!1), o = B(null);
    ke(n, async (i) => {
      var l;
      s.value = !0, await $t(), (l = o.value) == null || l.offsetHeight, a.value = i;
    });
    const r = N(() => ({
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
      D(Yr, {
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
        p("div", Wg, [
          p("div", Hg, [
            (c(!0), h(K, null, te(e.group.marks, (u) => (c(), G(jg, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Fg)) : O("", !0)
    ], 8, qg));
  }
}, Ob = /* @__PURE__ */ Y(Ug, [["__scopeId", "data-v-45b58b9b"]]);
function zg(e) {
  const t = B(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return qe(() => n.observe(e.value)), Dt(() => n.disconnect()), t;
}
const Vg = { class: "chat-dock-fold" }, Gg = ["aria-label"], Kg = { class: "chat-dock-head" }, Yg = { class: "chat-dock-inner" }, oi = 700, Jg = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = B(null), s = B(null), a = zg(s), o = B(!1);
    let r = 0;
    return qe(() => r = setTimeout(() => o.value = !0, oi)), Dt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Vg, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge"),
          p("header", Kg, [
            he(i.$slots, "head")
          ]),
          p("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", Yg, [
              p("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: fe(V(a) === null ? null : { height: `${V(a)}px` })
              }, [
                p("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  he(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, Gg)
      ])
    ], 2));
  }
}, ri = /* @__PURE__ */ Y(Jg, [["__scopeId", "data-v-63e4dcfc"]]), Zg = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ws = 5, Xg = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ws, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${ws}s`, animationDelay: `${(n - ws).toFixed(2)}s` };
    return (a, o) => (c(), h("span", Zg, [
      p("i", { style: s })
    ]));
  }
}, ii = /* @__PURE__ */ Y(Xg, [["__scopeId", "data-v-d0c4b012"]]), li = ni("/api/docks", "docks"), Tb = li.fetchAll, ta = li.find, Qg = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), na = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), e0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), t0 = (e) => e.kept ? na("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : na("keep", "pin", "Pin", `dock keep ${e.id}`), n0 = ["pin", "stop"], s0 = (e) => ({ ...e, iconOnly: n0.includes(e.icon) });
function a0(e, t) {
  var n;
  return [
    ...e0(e, t) ? [t0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || hn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    na("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(s0);
}
const o0 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Qg(e, t),
  buttons: a0(e, t)
}), r0 = { class: "dock-title" }, i0 = ["aria-expanded", "title"], l0 = { class: "chat-dock-acts dock-acts" }, c0 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, u0 = {
  key: 1,
  class: "dock-text"
}, d0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = N(() => ta(s.item.type)), o = B(null), r = N(() => o0(s.item, a.value)), i = _e(Ae), l = B(/* @__PURE__ */ new Set()), u = B("");
    async function d(v) {
      if (v.action === "open") return Ue(`${s.item.target_model}:${s.item.target_id}`);
      v.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, v.label])), u.value = "";
      const x = await _a(v, s.item, i.environment);
      (x == null ? void 0 : x.ok) === !1 && (l.value = new Set([...l.value].filter((_) => _ !== v.label)), u.value = x.error);
    }
    const f = N(() => r.value.buttons.filter((v) => v.action !== "undock" && !l.value.has(v.label))), g = N(() => r.value.buttons.find((v) => v.action === "undock"));
    return (v, M) => (c(), G(ri, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: F(() => [
        e.leaving ? (c(), G(ii, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : O("", !0)
      ]),
      head: F(() => {
        var x, _, T;
        return [
          (x = a.value) != null && x.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(K, { key: 1 }, [
            D(ge, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            p("span", r0, $(r.value.title), 1)
          ], 64)),
          (_ = a.value) != null && _.badge ? (c(), h("span", {
            key: 2,
            class: Z(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, $(a.value.badge), 3)) : O("", !0),
          (T = a.value) != null && T.draws_head ? O("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: M[0] || (M[0] = (W) => n("fold"))
          }, [
            D(Rt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, i0)),
          p("span", l0, [
            (c(!0), h(K, null, te(f.value, (W) => (c(), h(K, {
              key: W.action + W.runs
            }, [
              W.iconOnly ? (c(), G(pe, {
                key: 0,
                kind: "icon",
                "aria-label": W.label,
                title: W.label,
                "data-dock-action": W.action,
                onClick: (Q) => d(W)
              }, {
                default: F(() => [
                  D(ge, {
                    name: W.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(pe, {
                key: 1,
                small: "",
                kind: W.primary ? "primary" : "ghost",
                bordered: !W.primary,
                "data-dock-action": W.action,
                onClick: (Q) => d(W)
              }, {
                default: F(() => [
                  oe($(W.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          D(Zn, {
            title: g.value.label,
            "data-dock-action": "undock",
            onClick: M[1] || (M[1] = (W) => n("undock", g.value))
          }, null, 8, ["title"])
        ];
      }),
      default: F(() => {
        var x, _;
        return [
          u.value || e.refusal ? (c(), h("p", c0, $(u.value || e.refusal), 1)) : O("", !0),
          e.item.text && !((x = a.value) != null && x.body_url) ? (c(), h("p", u0, $(e.item.text), 1)) : O("", !0),
          (_ = a.value) != null && _.body_url ? (c(), G(ea, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : O("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, bo = /* @__PURE__ */ Y(d0, [["__scopeId", "data-v-1ac9db13"]]), h0 = 6, f0 = 3, xo = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, wt = (e) => !!(e.leaves_at && !e.kept), m0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < e.leaves_at || n.has(e.id)), p0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => m0(s, t, n)).sort((s, a) => s.id - a.id);
function g0(e, t, n = h0) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const v0 = (e, t, n = e) => n < 2 ? !1 : e >= f0 ? !0 : t, y0 = ["title", "aria-label"], w0 = { class: "run-chip-in" }, k0 = {
  key: 0,
  class: "run-chip-ring"
}, b0 = { class: "run-chip-name" }, x0 = { class: "run-chip-bar" }, $0 = "processes.output", M0 = 5e3, S0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = _e(Ae, null)) == null ? void 0 : d.environment) ?? "", o = B(null), r = N(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = N(() => {
      var f, g;
      return ((f = o.value) == null ? void 0 : f.title) || ((g = o.value) == null ? void 0 : g.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = N(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await tn($0, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return ai(u, () => r.value, M0), (f, g) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": l.value })
      }, [
        V(wt)(e.item) ? (c(), G(ii, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : O("", !0),
        p("span", w0, [
          r.value ? (c(), h("span", k0)) : (c(), G(nt, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", b0, $(i.value), 1)
        ]),
        p("span", x0, [
          p("i", {
            style: fe({ width: r.value ? `${((v = o.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, y0);
    };
  }
}, _0 = /* @__PURE__ */ Y(S0, [["__scopeId", "data-v-597b05d2"]]), E0 = 24, A0 = 8, Ib = 420;
function Rb({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= E0 && e > t ? !0 : e < t && a > A0 ? !1 : null;
}
const C0 = (e, t) => e === void 0 ? t : e, ci = "journal.viewer.";
function O0(e, t, n) {
  try {
    const s = n.getItem(ci + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function T0(e, t, n) {
  try {
    n.setItem(ci + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function I0(e, t, n = window.localStorage) {
  const s = B(O0(e, t, n));
  return ke(s, (a) => T0(e, a, n), { deep: !0 }), s;
}
const R0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, B0 = { class: "dock-runs-chips" }, L0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var A;
    const t = e, n = Zm(500), s = B(/* @__PURE__ */ new Set()), a = B(!1), o = B(!1), r = _e(Ae), i = B(/* @__PURE__ */ new Set()), l = B({});
    async function u(y, C) {
      i.value = /* @__PURE__ */ new Set([...i.value, y.id]);
      const w = await _a(C, y, r.environment);
      (w == null ? void 0 : w.ok) === !1 && (i.value = new Set([...i.value].filter((S) => S !== y.id)), l.value = { ...l.value, [y.id]: w.error });
    }
    const d = N(() => p0(t.items.filter((y) => !i.value.has(y.id)), n.value, s.value)), f = N(() => g0(d.value.filter((y) => xo(y, ta)), n.value)), g = N(() => d.value.filter((y) => !f.value.includes(y) && !xo(y, ta))), v = N(() => f.value.filter((y) => !wt(y))), M = N(() => (a.value = v0(f.value.length, a.value, v.value.length)) && !o.value), x = I0(`dock-folded:${((A = ie.identity) == null ? void 0 : A.root) || location.host}`, {}), _ = (y) => C0(x.value[y.id], t.folded);
    function T(y) {
      x.value = { ...x.value, [y.id]: !_(y) };
    }
    function W(y) {
      x.value = { ...x.value, ...Object.fromEntries(f.value.map((C) => [C.id, C.id !== y.id])) }, o.value = !0;
    }
    function Q() {
      x.value = Object.fromEntries(Object.entries(x.value).filter(([y]) => !f.value.some((C) => String(C.id) === y))), o.value = !1;
    }
    function E(y) {
      s.value = /* @__PURE__ */ new Set([...s.value, y.id]);
    }
    function b(y) {
      s.value = new Set([...s.value].filter((C) => C !== y.id));
    }
    return (y, C) => (c(), G(Uo, {
      tag: "div",
      name: "dock",
      duration: V(oi),
      class: "dock-stack"
    }, {
      default: F(() => [
        (c(!0), h(K, null, te(g.value, (w) => (c(), G(bo, {
          key: w.id,
          item: w,
          class: Z({ timed: V(wt)(w) }),
          leaving: V(wt)(w) && !s.value.has(w.id),
          folded: _(w),
          refusal: l.value[w.id],
          onFold: (S) => T(w),
          onUndock: (S) => u(w, S),
          onMouseenter: (S) => E(w),
          onMouseleave: (S) => b(w)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", R0, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: Q
          }, [
            oe($(f.value.length) + " runs ", 1),
            D(Rt, { open: "" })
          ])
        ])) : O("", !0),
        (c(!0), h(K, null, te(M.value ? [] : f.value, (w) => (c(), G(bo, {
          key: w.id,
          item: w,
          class: Z({ timed: V(wt)(w) }),
          leaving: V(wt)(w) && !s.value.has(w.id),
          folded: _(w),
          refusal: l.value[w.id],
          onFold: (S) => T(w),
          onUndock: (S) => u(w, S),
          onMouseenter: (S) => E(w),
          onMouseleave: (S) => b(w)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        M.value ? (c(), G(ri, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: F(() => [
            p("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run on a card",
              "data-dock-runs-open": "",
              onClick: C[0] || (C[0] = (w) => o.value = !0)
            }, [
              D(nt, { name: "runs" }),
              oe(" " + $(f.value.length) + " runs ", 1),
              D(Rt)
            ]),
            p("span", B0, [
              (c(!0), h(K, null, te(f.value, (w) => (c(), G(_0, {
                key: w.id,
                item: w,
                onClick: (S) => W(w)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : O("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Bb = /* @__PURE__ */ Y(L0, [["__scopeId", "data-v-c9a1014f"]]), kt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Rn = (e) => Math.min(Math.max(e, 0), 1), N0 = (e) => {
  const t = Rn(e);
  return t * t * (3 - 2 * t);
}, pt = (e, t, n) => N0((e - t) / (n - t));
function Lb(e) {
  const t = Rn(e), n = Rn((t - 0.12) / 0.76) * kt.shuffles, s = Math.min(Math.floor(n), kt.shuffles - 1), a = n - s, o = pt(a, 0.26, 0.38) * (1 - pt(a, 0.76, 0.96)), r = pt(a, 0.38, 0.76), i = pt(t, 0, 0.12) * (1 - pt(t, 0.88, 1)), l = pt(a, 0.2, 0.34) * (1 - pt(a, 0.84, 1)), u = Math.sin(Math.PI * Rn((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / kt.shuffles, lift: kt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Nb(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const $o = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Db = (e) => $o[e] ?? $o.butler, Ea = 2400, D0 = 0.05;
function P0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, D0), r = Math.min(t + Ea * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function Pb(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function j0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function jb(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const qb = (e, t) => ({ ...e, stretch: t.stretch }), Fb = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, ui = (e, t) => t >= (e.least ?? 0);
function Wb(e, t, n) {
  if (!ui(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const Hb = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), q0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Mo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), F0 = (e) => e.right > e.left && e.bottom > e.top;
function Ub(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(q0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = Mo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = Mo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), F0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function di(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, g] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[g]) && (i = -1);
      else {
        const M = (o[f] - e[d]) / v, x = (o[g] - e[d]) / v;
        r = Math.max(r, Math.min(M, x)), i = Math.min(i, Math.max(M, x));
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
}, nn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), W0 = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => W0(nn(e, t, n)), H0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function U0(e) {
  return H0.map(() => {
    const t = _n(ct.speed, e), n = _n(ct.angle, e) * Math.PI / 180, s = _n(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const z0 = U0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function V0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function zb(e, t, n = z0) {
  const s = Me.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = V0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= ct.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const Vb = (e, t) => e && Me[e.name] ? { name: e.name, u: t / e.frames } : null;
function Gb(e, t) {
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
const Kb = () => Array.from({ length: Me.pogo.count }, (e, t) => Me.pogo.bounce * (t + 1) / Me.pogo.count), It = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function Yb(e, t, n) {
  const { away: s, side: a } = Me.bug_smash, o = a * s * n, [r, i] = [t.left + It.margin * n, t.right - It.margin * n], l = Math.min(Math.max(e + o + a * It.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function Jb(e, t, n) {
  const s = Me.bug_smash, a = Se(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (It.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: It.tall * n * (1 - Se(t, s.emerge)),
      turn: 90 * (1 - Se(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - Se(t, s.gone)
    }
  };
}
function Zb(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= It.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = P0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Te = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function Xb(e) {
  const t = Te.least + Math.floor(e() * (Te.most - Te.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Te.walls[Math.floor(e() * Te.walls.length)],
    along: Te.margin + e() * (1 - 2 * Te.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function sa(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Te.margin, r = ((e.along - Te.margin + e.way * Te.speed * n / s) / a % 2 + 2) % 2, i = Te.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Te.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Te.inset : t.right - Te.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function G0(e, t) {
  const n = Me.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = j0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function Qb(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Me.bug_shot, { frame: r, bug: i, shot: l } = G0(n, e.length), u = e.map((T, W) => ({ ...sa(T, t, Math.min(n / o.fps, Bn(W).shot)), shot: W < l })), d = Se(r / o.frames, o.aim), [f, g] = [u[Math.max(i - 1, 0)], u[i]], v = e.map((T, W) => ({ bug: T, index: W, seconds: n / o.fps - Bn(W).shot, spot: sa(T, t, Bn(W).shot) })).filter((T) => T.seconds >= 0), M = v.flatMap((T) => {
    const W = (a == null ? void 0 : a.get(T.index)) ?? X0(T.bug, t, T.spot, a ? [] : s);
    return a == null || a.set(T.index, W), a && Q0(W, T.seconds, s), ev(W, T.seconds, s);
  }), x = v.filter((T) => J0(T.bug)).map((T) => ({ seconds: T.seconds, from: T.spot })), _ = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (g.x - f.x) * d, y: f.y + (g.y - f.y) * d, back: _ }, slush: M, camera: x };
}
function Bn(e) {
  const t = Me.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function e5(e, t, n, s) {
  const { limit: a, margin: o } = Me.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Bn(d), g = sa(u, t, f.shot), v = Math.abs(g.y - n.y) / Math.tan(a * Math.PI / 180), M = g.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - g.x), x = Math.abs(g.x - l) >= v ? l : g.x + M * v, _ = M > 0 ? Math.max(l, Math.min(x, i)) : Math.min(l, Math.max(x, r)), T = { from: l, to: _, begin: f.walk, end: f.aim };
    return l = _, T;
  });
}
function t5(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, K0 = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function Y0(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const J0 = (e) => e.along * 97 % 1 < xe.camera, sn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function Z0(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += xe.step) {
    const d = Math.min(u + xe.step, r.t), f = sn(e, d), g = di(i, f, n);
    if (g) return { ...g, t: u + (d - u) * g.share };
    i = f;
  }
  const l = sn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function X0(e, t, n, s = []) {
  const a = Y0(e.along + 1), [o, r] = K0[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: xe.count }, () => {
    const l = i + (a() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + a() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: xe.radius[0] + a() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...Z0(d, t, s) };
  });
}
function Q0(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += xe.step) {
      const r = Math.min(o + xe.step, a), i = di(sn(s, o), sn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function ev(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...sn(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((d) => d.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, u = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: u, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function n5(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Me.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = Se(e, [0, u]), g = Se(e, [u, u + d]);
  return r.map((v) => {
    const M = { x: s.x + v.at[0] * t, y: s.y + v.at[1] * t };
    return {
      x: n.x + (M.x - n.x) * f,
      y: n.y + (M.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: g * g * t * 1.2,
      fade: 1 - g,
      landed: f >= 1
    };
  });
}
function s5(e, t, n, s, a) {
  const { sway: o, above: r } = Me.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (x) => {
    const [_, T] = [x.x - e.at.x, x.y - e.at.y];
    return { x: i.x + _ * u - T * d, y: i.y + _ * d + T * u };
  }, [g, v] = [...n].sort((x, _) => x.x - _.x), M = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: M.map((x, _) => ({ from: x, to: _ < M.length / 2 ? g : v })) };
}
const a5 = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Fn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: nn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: nn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function o5(e, t) {
  const n = Me[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Fn(n, t), r = 1 - (1 - n.small) * Se(s, n.shrinks) * (1 - Se(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Fn(n, t), o = n.flat * Se(s, n.squashes) * (1 - Se(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * nn(a, ...n.springs)) * (1 - nn(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const r5 = (e) => e === "pack_box";
function i5(e) {
  const { into: t, out: n } = Fn(Me.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function l5(e) {
  const t = Me.rope_swing, { into: n, out: s } = Fn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const tv = { after: 3 }, Aa = 10, nv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, sv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, av = { weight: 19 }, hi = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, ov = { every: 120 }, fi = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, mi = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, rv = {
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
}, pn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Aa }), ee = (e, t, n = {}) => pn(e, "clip", t, n), ks = (e, t, n = {}) => pn(e, "look", t, n), So = (e, t, n = {}) => pn(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...pn(e, "pick", t, n), ...s }), ve = (e) => pn("nothing", "nothing", e, {}), iv = 120, lv = 300, bs = (e, t) => ({ ...ee(e, t), cooldown: lv }), ae = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), cv = () => [ee("joy", 2)], gt = (e, t, n, s, a = {}) => ({ ...ee(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), vt = (e) => ({ ...e, cooldown: nv[e.name] }), zt = (e) => ({ ...e, shenanigan: !0, lasts: sv[e.name] }), es = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ae("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ee("nod", 2), ve(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ae("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...vt(ee("bug_shot", 3)), toward: "", onto: !1 },
    { ...vt(ee("bug_smash", 2)), toward: "", onto: !1 },
    ee("nod", 2)
  ]),
  ...ae("tests_failed", { cooldown: 20, toward: "card" }, [ee("startled", 2), ee("dismay", 1), ee("tantrum", 3), ve(1)]),
  ...ae("committed", { cooldown: 30, toward: "card", onto: !0 }, [ee("nod", 2), ve(2)]),
  // a sin the commandments plugin found repented: now and then a halo over the head and a serene, holy look
  ...ae("sin_fixed", { cooldown: 300 }, [ee("halo", 1), ve(2)]),
  // a sin it found in the agent's change: now and then it stands, kneels down toward the sin's mark and holds up a big cross in both hands
  // to ask forgiveness
  ...ae("sin_committed", { cooldown: 300 }, [ee("repent", 1), ve(2)]),
  // what the agent has just done in the journal, acted out now and then, never every time
  ...ae("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [ee("nod", 4), ee("hand_rub", 4), ve(7)]),
  ...ae("question_asked", { cooldown: 60 }, [ee("ask_sign", 9), ee("look_up", 3), ve(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ae("reported", { cooldown: 90 }, [So("read", 3), ee("nod", 1), ve(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ae("read_message", { cooldown: 30 }, [So("read", 3), ve(1)]),
  ...ae("fact_filed", { cooldown: 120 }, [ee("file_card", 3), ee("nod", 1), ve(6)]),
  ...ae("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ee("nod", 2), ve(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ae("bar_done", { holds: !0 }, cv()),
  ...ae("bar_failed", { holds: !0 }, [ee("fume", 1), ee("tantrum", 3)]),
  // standing still or thinking, it glances aside now and then, at uneven times, so standing still is never the same loop
  ...ae("standing", { cooldown: 12 }, [ee("look_left", 2), ee("look_right", 2), ee("look_up", 1), ve(40)]),
  // landing from a launch it very rarely trips and falls to its knees
  ...ae("launched", { cooldown: 300 }, [ee("tumble", 3), ve(47)]),
  // a break from the hammering now and then
  ...ae("building", { cooldown: 30 }, [ee("wipe_brow", 4), ee("look_left", 1), ee("look_right", 1), ve(69)]),
  ...ae("failed", { cooldown: 20, toward: "card" }, [ee("shake", 3), ee("tantrum", 2), ve(2)]),
  ...ae("refused", { cooldown: 20 }, [ee("shake", 1), ve(1)]),
  ...ae("work_done", { cooldown: 120 }, [ee("stretch", 2), ve(3)]),
  // while the agent thinks, the thinking act, at most once in 30 to 60 seconds, and nothing of thinking between plays; its two parts
  // each on a cooldown of their own, so neither shows every play: the thought cloud with the finger at the cheek, and the bulb at its
  // end (reactions.js thinkingAct)
  ...ae("pondering", { cooldown: [30, 60] }, [de("ponder", 1)]),
  ...ae("thought_cloud", { cooldown: 90 }, [de("cloud", 1)]),
  ...ae("light_bulb", { cooldown: 150 }, [de("bulb", 1)]),
  ...ae("answered", { cooldown: 15 }, [ks("amused", 3), ve(2)]),
  ...ae("heard", { cooldown: 30 }, [
    ee("bow", 1, { voices: ["butler"] }),
    ee("salute", 1, { voices: ["squire"] }),
    ee("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ve(1)
  ]),
  ...ae("long_walk", { cooldown: 90 }, [ee("stumble", 3), ve(22)]),
  ...ae("card_arrived", { cooldown: 20, toward: "card" }, [ee("glance", 7), ve(13)]),
  ...ae("typing", { cooldown: 60 }, [ks("reading", 1), ve(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(rv).flatMap(([e, t]) => ae(`reacted:${e}`, {}, [ks(t, 1)])),
  ...Object.entries(fi).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ae(`agent_reacted:${n}`, {}, [ee(s, 1, { voices: [e] })])[0])),
  ...Object.entries(mi).flatMap(([e, t]) => ae(`agent_reacted:${e}`, {}, [ee(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ae("pastime", {}, [
    gt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    gt("rest", 3, 180, 120),
    gt("yawn", 2, 60, 60),
    gt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    gt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    gt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    gt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...zt(vt(ee("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    zt(vt(ee("disco", 2, { ball: "bubble" }))),
    ve(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ae("held:search", { cooldown: iv }, [bs("search", 3), { ...bs("binoculars", 2), when: { home: !0 } }, { ...bs("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ae("held:type", {}, [ee("type", 3), ee("type_ponder", 1)]),
  ...ae("held:compacting", {}, [ee("pack_box", 3), ee("vacuum", 2), ee("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ae("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ve(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ae("tickled", {}, [{ ...vt(ee("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ae("eager", {}, [ee("eager", 2, { slow: !0 }), ve(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ae("jump", {}, [zt(vt(ee("backflip", 7, { high: !0 }))), ee("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ae("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ae("unit", { cooldown: hi.build.cooldown }, [de("unit", av.weight), ve(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ae("progress_jump", { cooldown: 6 }, [ee("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ae("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: ov.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...ae("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ae("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    zt(de("bubble", 15, {}, { stay: [30, 80] })),
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
    zt(vt(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
  ]),
  // where it sits at its laptop while its agent works at it: mostly on a corner at home, now and then, bored of the spot, on the edge of
  // a bubble, keeping to each a while
  ...ae("laptop", {}, [de("seat", 6, {}, { stay: [60, 150] }), de("bubble_ledge", 1, {}, { stay: [30, 60] })]),
  // where along the floor it sits on the edge: around the middle, or a third of the way from either end, never at an end
  ...ae("ledge_at", {}, [de("middle", 2, {}, { along: 1 / 2 }), de("third", 1, {}, { along: 1 / 3 }), de("two_thirds", 1, {}, { along: 2 / 3 })]),
  // how it sits composed, drawn once a stay (figure.js COMPOSED): most often facing the viewer, both hands flat on the floor beside it;
  // now and then turned a little to the left or right, `turn` degrees, one arm free; sometimes leaning over on one arm, its left (`leans`
  // 1, figure.js SIDES) or its right (-1)
  ...ae("composed_as", {}, [
    de("facing", 4, {}, { turn: 0, leans: 0 }),
    de("turned_left", 1, {}, { turn: 335, leans: 0 }),
    de("turned_right", 1, {}, { turn: 25, leans: 0 }),
    de("leaning_on_left_arm", 1, {}, { turn: 0, leans: 1 }),
    de("leaning_on_right_arm", 1, {}, { turn: 0, leans: -1 })
  ])
], pi = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), gi = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), uv = (e) => Array.isArray(e) ? e[0] : e, dv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, hv = (e) => es.some((t) => t.when.moment === e);
function fv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || gi(d).every(([f, g]) => n(f) >= uv(g)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = es.filter((d) => pi(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= tv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function Fe(e, t) {
  const n = fv(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (vi(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function vi(e, t, n) {
  var s;
  for (const [a, o] of gi(t)) (s = e.memory) == null || s.set(a, e.now + dv(o, n));
}
function c5(e, t, n) {
  vi(e, es.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const u5 = (e) => Object.values(hi).find((t) => pi(t.when, e)) ?? null, mv = (e, t, n) => n - t <= (e.lifetime ?? Aa), d5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || ui(e.clip, t));
class yi {
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
const aa = {
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
}, h5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), wi = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), f5 = {
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
}, m5 = 120, pv = 20, p5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < pv), gv = (e) => aa[e] || aa.idle, g5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, ki = "airborne", vv = "landing", yv = "travelling", bi = "grounded", v5 = ({ airborne: e, landing: t, trip: n }) => e ? ki : t ? vv : n != null && n.started ? yv : bi;
function y5(e, t) {
  var a;
  const n = wv(e, t);
  return e.mode === bi && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function wv(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: g = null } = e;
  if (n === ki && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...kv(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const v = g !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? g : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : gv(u), facing: v ? g : i.posture === "sit" ? i.face : f };
}
function kv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const oa = (e) => e.outcome, bv = "plugin:code-commandments:sins:", _o = (e) => e.type === "plugins.card" && e.markKey.startsWith(bv), xv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => _o(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => _o(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], w5 = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: hr(n) })).sort((n, s) => n.time - s.time), Eo = { user: "reacted", agent: "agent_reacted" };
function k5(e, t) {
  return e.filter((n) => Eo[n.author] && bt(n) > t).map((n) => ({ beat: `${Eo[n.author]}:${n.emoji}`, time: bt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const $v = [.../* @__PURE__ */ new Set([...Object.values(fi).flatMap((e) => Object.keys(e)), ...Object.keys(mi)])];
function b5(e, t) {
  return e.filter((n) => n.author === "agent" && bt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = $v.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: bt(n), card: hr(n) })).sort((n, s) => n.time - s.time);
}
const Mv = (e) => new yi(e).isTest(), Wn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[oa(e)] || "";
}, Sv = 1800, _v = (e, t) => {
  if (Wn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Wn(n) !== "finished" && Number(e.time) - Number(n.time) <= Sv ? "tests_fixed" : "tests_passed";
};
function x5(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(Mv), a = s.filter((i) => Wn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Wn(i))), o.map((i) => ({ beat: _v(i, a), time: Number(i.time), card: i.key }));
}
function $5(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(oa(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: oa(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const M5 = (e) => e.map((t) => {
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
function S5(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function _5(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function E5(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = xv.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ca(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Ao = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Ev(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ca(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function A5(e, t, n, s = {}) {
  const a = Fe({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : hv(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function C5(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const Co = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function O5(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, u = Co((i - l) / Oe.returnSeconds), d = i <= l ? Co(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Oo = 3, xi = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, To = 12, T5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function I5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!xi(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= Oo ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * To) / To, lasts: Oo } };
}
const R5 = (e) => e.posture === "hang" && !xi(e.face), Av = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Cv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function B5(e, t, n) {
  return Av.has(e) ? 1 / 0 : !Cv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max($i(n - t.began, t.share) - Qe.lead, 0);
}
const Ov = 5;
function L5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= Ov ? { beat: "long_walk", time: n } : null };
}
const Tv = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function N5(e, t, n, s, a = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = Fe({ moment: "spell", state: e, tally: a }, s), [r, i] = En.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const D5 = (e, t, n) => t && n < t.until && wi.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, $i = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function P5(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = $i(o, e.share);
  return a ? { eager: Iv(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = Fe({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function Iv(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const Rv = 1, Bv = { look: "look", gaze: "gaze" };
function Lv(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = Fe({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [Bv[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const Nv = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => Fe({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), Dv = (e, t, n, s, a, o = 0) => Fe({ moment: "jump", high: e > Rv * t, memory: s, now: a, room: o }, n).name === "backflip", Pv = { work: ["building"], idle: ["standing"] };
function j5(e, t, n, s) {
  const a = aa[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(Pv[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), wi.has(e) ? { moments: o, began: n || s } : (n && s - n >= Tv && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function jv(e, t, n) {
  return !Fe({ moment: "pondering", memory: e, now: t }, n) || !Fe({ moment: "thought_cloud", memory: e, now: t }, n) ? null : Fe({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Io = { pondering: jv };
function q5(e, t, n, s, a, o) {
  if (Io[e.beat]) {
    const i = Io[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = Lv(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== Aa && { lifetime: r.lifetime } } } : null;
}
function F5(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = Nv(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const W5 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function H5(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function U5(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const z5 = (e, t) => !!(e != null && e.watches) && !t.once, V5 = 10, G5 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || mv(s, s.queuedAt, n)), K5 = (e, t) => t ? null : e[0] ?? null;
function Y5(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const J5 = (e, t) => !t.during || !e.some((n) => n.during === t.during), qv = 2 * Math.PI, Fv = 500;
function Z5(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / Fv, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), g = qv * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !l ? a && !t.behind && !v.behind ? Hv(v, t, n, g, a) : zv(v, t, n, g) : t) ?? v, _ = x != null && x.behind && x.mood === "reading" ? Wv(e.point, x, n, r, a) : x;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: f, at: s };
}
function Wv(e, t, n, s, a) {
  const o = (w) => w * 180 / Math.PI, r = (w) => o(Math.atan2(Math.sin(w * Math.PI / 180), Math.cos(w * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), g = f ? r(e.readingFacing - i) : 0, v = f ? e.readingYaw + g : d, M = v + r(u - v), x = Math.min(Math.max(s / 1e3, 0), 0.1), _ = Oe.turnSpeed * x, T = f ? v + Math.min(Math.max(M - v, -_), _) : M, W = f ? e.readingFollow + g : T, Q = W + (T - W) * (1 - Math.exp(-x / Oe.followSeconds)), E = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, b = o(Ca(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), A = Math.min(Math.max(b, -E.up), E.down), y = Oe.tipSpeed * x, C = f ? e.readingPitch + Math.min(Math.max(A - e.readingPitch, -y), y) : A;
  return { ...t, readingYaw: T, readingFollow: Q, readingPitch: C, readingFacing: i };
}
function Hv(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (W) => {
    const { yaw: Q, pitch: E } = Ca(W.x - n.x, a, n.y - W.y, o);
    return { yaw: Q, pitch: Math.min(Math.max(E, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [Ao(i(e)), Ao(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [g, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [M, x, _] = l.map((W, Q) => g * W + v * u[Q]), T = a * M / x;
  return { ...t, x: n.x + T, y: n.y - Ev(T, a, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const Uv = 0.15;
function X5(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Uv;
}
function zv(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const Vv = (e) => !(e != null && e.on);
function Q5(e, t, n) {
  if (Vv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, xs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Ro = (e) => e * e * (3 - 2 * e);
function Gv(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = xs(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, s = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Ro(xs(e, ...Je.fade)), lit: s, white: e < Je.flash[0] ? 0 : 1 - Ro(xs(e, ...Je.flash)) };
}
const e4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function t4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = Gv(t - e.at);
  return s && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...s } };
}
function n4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function s4(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= an.looks || s === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function a4(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const it = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, o4 = { behind: 39, figure: 40, ahead: 41 }, Kv = "[data-figure-pile]", Yv = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, r4 = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, i4 = (e) => e === "amber" ? Ln.phases : 1;
function l4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const c4 = Object.keys(Yv), He = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Vt = ([e, t], n) => e + n() * (t - e);
function u4(e) {
  const t = He.least + Math.floor(e() * (He.most - He.least + 1));
  return Array.from({ length: Math.min(t, He.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * He.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Vt(He.start, e), r = Vt(He.reach, e);
    return {
      text: Fe({ moment: "digit" }, e).name,
      x: s * o,
      y: He.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(Vt(He.moveMs, e)),
      fadeMs: Math.round(Vt(He.fadeMs, e))
    };
  });
}
const $s = { high: 3, gap: 1 };
function d4(e) {
  const t = Math.floor(e / $s.high);
  return { left: -(it.inside + it.width / 2 + t * (it.width + $s.gap)), up: e % $s.high * (it.height - it.top) };
}
const Jv = (e, t, n) => Fe({ moment: "unit", memory: e, now: t }, n) !== null, Zv = { after: 5 }, Xv = (e) => e.filter((t) => t.active && (t.process || t.watch) && new yi(t).isBuild());
function h4(e, t, n) {
  const s = Xv(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Zv.after ? a : null;
}
function f4(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: Jv(n, s, a) } : null;
}
const Bo = { ahead: 140, up: 70 };
function m4(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Bo.ahead, y: s - Bo.up } } : o ? { at: { x: n(o), y: s - o.up - it.height } } : t ? { at: null } : null;
}
const Ms = { least: 4e3, most: 1e4 }, Qv = (e) => Ms.least + e() * (Ms.most - Ms.least), yt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function p4(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Qv(t);
    if (n.length >= yt.most || t() >= yt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (yt.at[0] + t() * (yt.at[1] - yt.at[0]));
    n.push({ from: o, to: o + yt.ms }), s = o + yt.ms;
  }
}
const g4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), v4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Mi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), y4 = new Set(es.filter((e) => Mi.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), ey = (e) => e.some((t) => t.state === "built"), w4 = (e, t) => ey(t) ? e.filter((n) => !Mi.has(n.beat)) : e, dt = { reach: 40, room: 6 }, ty = (e, t) => t <= e - dt.reach + 2, k4 = (e, t, n) => ty(e, n) ? t - dt.reach : e - dt.reach - dt.room, b4 = (e, t, n, s) => s > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, Ss = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, x4 = (e) => Vt(e() < Ss.longShare ? Ss.long : Ss.short, e), ny = 2 * it.width;
function $4(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= ny ? o : e + (o - e + a / 2) % a;
}
const sy = 60, M4 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= sy, Lo = "[data-figure-home]", gn = () => {
  var t;
  const e = document.querySelector(Lo);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Lo)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, ay = "[data-figure-docked-bars]", oy = "[data-figure-chat-foot]", ry = [0.85, 0.6, 0.35, 0.15], iy = ["question", "waiting", "suggestion"], S4 = (e, t) => iy.find((n) => e[n] > 0 && t[n] === "behind") || null;
function _4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const ly = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", cy = "[data-figure-newest]";
function Si() {
  var s, a;
  const e = (s = gn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(cy), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Oa(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function on(e, t, n = Si()) {
  if (!e || !n) return !0;
  const s = st(e, t), a = ns(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ce.top * t.size, bottom: s.top + Ce.bottom * t.size }, r = kt.gap;
  return !ts(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function E4(e, t, n, s = Si()) {
  if (!s || on(t, e, s)) return null;
  const a = ns(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = St(), l = t.posture === "stand" ? Ia * e.size : Ri * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - kt.gap - r, s.right + kt.gap + o].map((g) => ({ ...t, x: g })).filter((g) => g.x >= u && g.x <= d && on(g, e, s) && Py(g, e)).sort((g, v) => Math.abs(g.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const _s = 0.26, _i = 0.54, uy = 1.25 / 5.4, vn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: _s, travels: "stand" },
  lounge: { drop: _s, travels: "stand" },
  composed: { drop: _s, travels: "stand" },
  hang: { drop: _i, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, A4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * uy * Math.cos(t * Math.PI / 180),
  y: 1 - n - _i
}), Gt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), dy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), C4 = (e, t) => (e === "sit" ? dy.has(t) : Gt.has(e)) ? e : "stand";
function O4(e, t) {
  return e.facing === t.facing || !Gt.has(e.posture) && !Gt.has(t.posture) ? t : { posture: "stand", facing: Gt.has(e.posture) ? e.facing : t.facing };
}
const T4 = 0.25, I4 = (e, t) => Gt.has(e) && vn[t].drop === 0, Ei = 2, hy = 90, fy = 180, my = 140, py = 280, gy = 420, vy = 0.25, yy = 290, wy = 600, ky = "cubic-bezier(0.2, 0.7, 0.4, 1)", by = "cubic-bezier(0.55, 0, 0.9, 0.6)", Es = 5;
function Hn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: g = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Es) return null;
  (r || i) && (o = Math.max(o, Ei));
  const v = o > 1, M = Math.abs(t.x - e.x), x = M < Es ? 0 : M / (hy * o) * 1e3, _ = Math.min(x, v ? my : fy), T = Math.abs(t.y - e.y), W = t.y < e.y, Q = W && !g && Dv(T, n, l, u, d, f), E = W ? gy + Math.min(T, 400) * vy : Math.sqrt(2 * T / Ea) * 1e3, b = {
    x: t.x,
    y: t.y,
    ms: T > Es ? Q ? wy : E : 0,
    lead: Q ? yy : W ? py : 0,
    easing: W ? ky : by,
    hopping: !0,
    clip: Q ? "backflip" : W ? "jump" : "fall"
  }, A = { x: t.x, y: t.y, ms: x + _, lead: 0, easing: "linear", ramp: _, ...v ? { clip: "run" } : {} }, y = g ? xy(t, n) : b, C = W && !s ? [{ ...A, y: e.y }, y] : [{ ...b, x: e.x }, A];
  return { way: Math.sign(t.x - e.x) || 1, legs: C, lands: !a, pace: o, running: v };
}
const xy = (e, t) => ({ x: e.x, y: e.y, ms: Me.pogo.frames / Me.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), $y = (e, t) => e.postures.includes(t) ? t : e.postures[0], R4 = (e, t, n) => e.posture === "walk" && n ? "walk" : $y(e.clip, t), st = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - vn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, ts = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Oa = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function St() {
  var t;
  const e = (t = gn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const An = 0.5, No = 20;
function B4(e, t, n = St()) {
  const s = st(e, t);
  return s.left >= n.left + No && s.right <= n.right - No;
}
function Ta(e, t, n = St()) {
  const s = st(e, t), a = s.right - s.left, o = ns(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - An && i <= n.right + An && s.top >= n.top - An && l <= n.bottom + An;
}
const Un = [0.35, 0.5, 0.65], zn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Un[0], right: Un.at(-1), top: zn[0], bottom: zn.at(-1) }, My = 0.24;
function ns(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + My * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Sy(e, { size: t }, n = St()) {
  const s = ns(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Ia = (Ce.right - Ce.left) / 2 + 0.08;
function L4(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - vn[e].drop) };
}
const _y = "[data-figure-agent]";
function Ai(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Oa(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((u) => u >= 0)) {
    if (!o.data[l].trim()) continue;
    const u = document.createRange();
    if (u.setStart(o, l), u.setEnd(o, l + 1), [...u.getClientRects()].some((d) => e >= d.left && e <= d.right && t >= d.top && t <= d.bottom)) return !0;
  }
  return !1;
}
const Ci = (e) => zn.flatMap(
  (t) => Un.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ra(e, t, n = "") {
  if (!on(e, t)) return Un.length * zn.length;
  const s = st(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(ly)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && ts(a, l) && Oa(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return Ci(a).filter(([i, l]) => r(i, l) || Ai(i, l, n)).length;
}
function Ey(e, t) {
  const n = st(e, t);
  return Ci({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => Ai(s, a, "", _y)).length;
}
const Do = 4;
function N4(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = Do; o <= a; o += Do)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!Ey(i, e) && on(i, e)) return i;
    }
  return null;
}
function rn(e, t, n) {
  const s = St(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Ta(r, t, s) && on(r, t)).map((r) => ({ spot: r, covered: Ra(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Oi = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Ay = [0.5, 0.25, 0.75], Cy = (e) => Oi(e.getBoundingClientRect(), Ay), Ti = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Oy = Ia, Ty = (e, t, { size: n }, s = Oy) => Ii(e, Ti[t], s * n, "stand");
function Ii(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const Iy = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Ri = 0.1, Ry = (e, t, { size: n }) => Ii(e, Iy[t], Ri * n, "sit"), By = (e) => ((e + 180) % 360 + 360) % 360 - 180, As = 60;
function D4(e, t) {
  const n = By(t);
  return !e.aside || Math.abs(n) >= As ? t : n < 0 ? 360 - As : As;
}
const Kt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Ly = (e) => [.../* @__PURE__ */ new Set([e, ...Kt.turns.map((t) => (t + 360) % 360)])];
function P4(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = Ly(t), r = Kt.every[0] + s() * (Kt.every[1] - Kt.every[0]);
  return { face: t, from: a ? Ny(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Ny(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Kt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function j4(e, t) {
  const { element: n, edge: s } = ss(), a = ["left", "right"].map((i) => yn(Ry(s, i, e), e)).filter((i) => n && Ta(i, e) && !Ra(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function q4(e, t, { size: n }) {
  const s = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - Bi } : e;
}
const Bi = 7;
function Li() {
  const e = [...document.querySelectorAll(Kv)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Dy(e, t) {
  const n = st(e, t), s = n.right - n.left;
  return { left: n.left + Ce.left * s, right: n.left + Ce.right * s, top: n.top + Ce.top * s, bottom: n.bottom };
}
function Py(e, t) {
  const n = Li();
  return !n || !ts(Dy(e, t), n);
}
const jy = 4;
function ss() {
  const e = wn(), t = Li(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > jy || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Bi - n, 0) } };
}
const F4 = ({ size: e, below: t }) => (1 - t) * e;
function yn(e, t) {
  const n = St(), { size: s, below: a } = t, o = vn[e.posture].drop * s;
  return { ...Sy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const ra = (e, t) => Object.keys(Ti).map((n) => yn(Ty(e, n, t), t)), Ba = (e, t) => Oi(e, ry).map((n) => yn(n, t)), Ni = (e, t, n) => rn(e, t, n) ?? e[0];
function W4(e, t) {
  const { element: n, edge: s } = ss();
  return { ...Ni(ra(s, e), e, t), view: null, on: n };
}
function H4(e, t, n, s) {
  const { element: a, edge: o } = ss(), r = (s ? ra(o, t) : [...ra(o, t), ...Ba(o, t)]).filter(
    (u) => !ts(st(u, t), e)
  ), i = rn(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !Ra(i, t) ? i : rn(r, t, n);
  return l && { ...l, view: null, on: a };
}
function wn() {
  var s;
  const e = gn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(ay);
  if (!t) return { ...as(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Po = { within: 2 };
function U4(e) {
  const { element: t, docked: n, edge: s } = wn();
  if (!n || e.on !== t) return !0;
  const a = as().edge;
  return s.left > a.left + Po.within || s.left + s.width < a.left + a.width - Po.within;
}
const qy = "[data-figure-closing]";
function z4() {
  var n;
  const { element: e, docked: t } = wn();
  return t && !!((n = e.firstElementChild) != null && n.matches(qy));
}
const Di = "[data-figure-progress]";
function V4(e) {
  const t = e.querySelector(Di);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function G4(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const Fy = { across: 300, above: 380, below: 60 };
function K4(e) {
  const { across: t, above: n, below: s } = Fy;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: Wy(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const Wy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Pi = "[data-figure-bar]", ia = { back: 144, along: 0.4 };
function Y4(e) {
  const { element: t, docked: n, edge: s } = wn(), a = n ? t.querySelector(Pi) : null;
  if (!(a != null && a.querySelector(Di))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...yn({ x: o - ia.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function J4(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < ia.along * s.size ? t.x + ia.along * s.size : e.x, y: e.y, behind: !0 };
}
function Z4(e) {
  const t = e.querySelector(Pi), n = t == null ? void 0 : t.firstElementChild;
  if (!n) return null;
  const s = n.getBoundingClientRect().width / Math.max(t.getBoundingClientRect().width, 1);
  return { bar: t, share: s, ended: t.dataset.figureBar, began: Number(t.dataset.figureBegan) };
}
function as() {
  const e = gn();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
function X4(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = as(), l = n === null ? Hy(i, e, o === null ? t : { x: o, y: i.top }, s, a) : yn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Hy(e, t, n, s, a) {
  const o = Ba(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + it.width < a && l.x + s - dt.reach - dt.room >= r);
  return rn(i.length ? i : o, t, n);
}
const Uy = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function Q4(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: g = !1 } = {}) {
  (o || r) && (a = Math.max(a, Ei));
  const v = (Q) => {
    const E = st(Q, n, vn[Q.posture].travels);
    return { x: E.left, y: E.top };
  }, M = t.ladder ?? e.ladder;
  if (M && !(t.ladder && e.ladder)) return zy(v(e), v(t), v({ ...M.foot, posture: "stand" }), M.way, !!t.ladder, n, a);
  const [x, ..._] = [e, ...l, t].map(v), T = Hn(x, _[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: g }), W = _.slice(1).map((Q, E) => {
    var b;
    return (b = Hn(_[E], Q, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : b.legs.find((A) => A.hopping);
  });
  return T && { ...T, legs: [...T.legs, ...W.filter(Boolean)] };
}
function zy(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Uy.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? Hn(e, n, o.size, { pace: r }) : Hn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function ex(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function tx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && rn(Cy(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = ss();
  return { ...Ni(Ba(a, t), t, n), view: null, on: s };
}
const Vy = "[data-figure-bubble]", Gy = 250;
let Yt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), ji = 0;
const jt = () => Yt, Cs = /* @__PURE__ */ new WeakMap();
let Ky = 0;
function La(e) {
  return Cs.has(e) || Cs.set(e, `floor-${++Ky}`), Cs.get(e);
}
const Yy = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Jy = () => {
  var e, t;
  return ((t = (e = gn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Zy(e, t) {
  var s;
  const n = (s = e.querySelector(oy)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Xy(e, t) {
  const n = e && Zy(e, t), s = e ? [...e.querySelectorAll(Vy)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || Yy(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: La(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Qy = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Gy ? (t.top - s.top) / a * 1e3 : 0;
};
function qi(e = Yt, t = performance.now()) {
  const n = St(), s = Jy(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = wn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = as();
  return u.element && l.push({ id: La(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...Xy(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: Qy(e, d, t) }))) });
}
const la = /* @__PURE__ */ new Set();
function ew(e) {
  return la.add(e), () => la.delete(e);
}
function tw() {
  Fi();
  const e = () => {
    ji = requestAnimationFrame(e), !document.hidden && (Yt = qi(Yt), la.forEach((t) => t(Yt)));
  };
  e();
}
function Fi() {
  cancelAnimationFrame(ji);
}
const Na = 5, nw = 56, sw = { share: 0.6 }, aw = (e) => -Math.sqrt(2 * Ea * sw.share * e), Lt = (e, t) => e.find((n) => n.id === t) ?? null;
function nx(e, t = qi().floors) {
  const n = Lt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : La(e.on) : null, o = a && Lt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Wi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = jt().floors) {
  const u = Lt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || ow(u, d, o)) && rw(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Da = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, ow = (e, t, n) => !Da({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function sx(e, t = jt().floors) {
  if (!Da(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Na && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function rw(e, t, n = jt().floors) {
  const s = Lt(n, "home");
  return e.posture === "hang" && s && st(e, t).bottom >= s.top ? !1 : Ta(e, t);
}
function ax(e, t, n, s = jt().floors) {
  const a = Wi(e, n, s);
  if (!e.home) return iw(e, t, a, s);
  if (!a) return null;
  const o = Lt(s, "home"), r = a.y - t.y, i = r > Na ? "dropping" : -r > nw ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function iw(e, t, n, s) {
  const a = n ? Lt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: aw(e.risen) };
  if (!n) return null;
  if (Da(t) && n.y - t.y > Na) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function ox(e, t, n) {
  const s = Ia * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function rx(e, t, n, s = jt().floors) {
  const a = t && Wi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const lw = ["data-kind"], cw = { class: "figure-floor-name" }, uw = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", cw, $(e.floor.kind), 1)
    ], 12, lw));
  }
}, dw = /* @__PURE__ */ Y(uw, [["__scopeId", "data-v-8f6132da"]]), hw = {
  class: "figure-floors",
  "aria-hidden": "true"
}, fw = {
  __name: "FigureFloors",
  setup(e) {
    const t = Gn(jt().floors);
    let n = () => {
    };
    return qe(() => {
      n = ew((s) => t.value = s.floors), tw();
    }), Ie(() => {
      n(), Fi();
    }), (s, a) => (c(), h("div", hw, [
      (c(!0), h(K, null, te(t.value, (o) => (c(), G(dw, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, ix = /* @__PURE__ */ Y(fw, [["__scopeId", "data-v-e519168b"]]), Os = (e) => typeof e == "number" ? e : Date.parse(e);
function lx(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Os(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Os(a.row.created_at) - Os(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const mw = 3, Ts = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function pw(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Ts[n.grouping]) == null ? void 0 : s.call(Ts, e.row, n)) || "";
}
function gw(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function cx(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= mw ? [gw(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = pw(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const vw = 1e3;
function yw() {
  const e = B(Date.now()), t = setInterval(() => e.value = Date.now(), vw);
  return Dt(() => clearInterval(t)), e;
}
const ww = ["datetime", "title"], os = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = yw(), s = N(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, $(V(u1)(e.at, V(n))), 9, ww));
  }
};
function kw(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const ux = (e) => (t) => t.filter((n) => n.id !== e), dx = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), hx = (e) => (t) => [...t, e], fx = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function mx(e) {
  const t = un(), n = B(null), s = B("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
const Cn = /* @__PURE__ */ new Map();
function bw(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function px() {
  const e = un(), t = B(null), n = B("");
  async function s() {
    const a = await bw(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const xw = { class: "cards-page" }, $w = { class: "cards-bar" }, Mw = { class: "cards-count" }, Sw = { class: "cards" }, _w = {
  key: 1,
  class: "cards-note"
}, Ew = {
  key: 2,
  class: "cards-note"
}, Aw = ["data-row", "onClick"], Cw = { class: "card-head" }, Ow = { class: "card-title" }, Tw = { class: "card-foot" }, Iw = {
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
    return (s, a) => (c(), h("div", xw, [
      p("div", $w, [
        p("span", Mw, $(e.rows.length) + " " + $(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        D(pe, tt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: F(() => [
            D(ge, {
              name: "plus",
              size: 12
            }),
            oe(" New " + $(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      p("div", Sw, [
        e.loaded ? e.failure ? (c(), h("p", _w, $(e.failure), 1)) : e.rows.length ? O("", !0) : (c(), h("p", Ew, "No " + $(e.noun) + "s yet", 1)) : (c(), G(Pt, {
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
          p("span", Cw, [
            D(ge, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            oe(" " + $(e.head(o)), 1),
            D(os, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          p("span", Ow, $(e.title(o)), 1),
          p("span", Tw, $(e.foot(o)), 1)
        ], 8, Aw))), 128))
      ]),
      he(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, gx = /* @__PURE__ */ Y(Iw, [["__scopeId", "data-v-990e6b37"]]), jo = "newest";
function vx(e, { title: t, isOpen: n = null }) {
  var u;
  const s = (u = _e(Ae, null)) == null ? void 0 : u.search, a = B(""), o = B(jo), r = B("all"), i = N(() => {
    const d = a.value.trim().toLowerCase(), f = e.value.filter((g) => kw(g, d, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(g) === (r.value === "open")));
    return o.value === jo ? f : [...f].sort((g, v) => t(g).localeCompare(t(v)));
  }), l = N(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const Rw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Bw = 40, Lw = "top", Nw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = _e(Ae, null)) == null ? void 0 : f.autoScroll, a = N(() => s === Lw), o = B(null), r = B(!1), i = (g) => a.value ? g.scrollTop : g.scrollHeight - g.scrollTop - g.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Bw;
    }
    return ke(() => n.rowCount, async () => {
      await $t(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (g, v) => (c(), h("div", Rw, [
      p("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        he(g.$slots, "default", {}, void 0, !0)
      ], 34),
      D(Nt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: F(() => [
          ht(p("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: u
          }, [
            D(ge, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = oe(" Newest ", -1))
          ], 512), [
            [al, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, yx = /* @__PURE__ */ Y(Nw, [["__scopeId", "data-v-3accb764"]]), Dw = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, Pw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = _e(Ae, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, r) => (c(), h("div", Dw, [
      (c(!0), h(K, null, te(V(s), (i) => {
        var l;
        return c(), G(pe, {
          key: i.key,
          kind: "text",
          class: Z(["inner-tab", { on: ((l = e.active) == null ? void 0 : l.key) === i.key }]),
          "data-tab": i.key,
          onClick: (u) => n("choose", i)
        }, {
          default: F(() => [
            oe($(i.label) + " " + $(e.answer[i.count_field]), 1)
          ]),
          _: 2
        }, 1032, ["class", "data-tab", "onClick"]);
      }), 128))
    ]));
  }
}, wx = /* @__PURE__ */ Y(Pw, [["__scopeId", "data-v-cf3bb39f"]]), jw = {}, qw = { class: "menu-label" };
function Fw(e, t) {
  return c(), h("span", qw, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ca = /* @__PURE__ */ Y(jw, [["render", Fw], ["__scopeId", "data-v-aa955b3e"]]), Ww = {
  class: "search-bar",
  "data-search-bar": ""
}, Hw = { class: "search-bar-control" }, Uw = ["value", "placeholder", "aria-label"], zw = ["aria-expanded"], Vw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var T;
    const s = e, a = n, o = ol(), r = ((T = _e(Ae, null)) == null ? void 0 : T.search) ?? {}, i = N(() => r.placeholder || s.placeholder), l = r.context ?? [], u = B(null), d = B(null), f = B([]), g = N(() => f.value.length ? f.value[f.value.length - 1].next : l), v = N(() => !!o.menu || l.length > 0), M = (W) => {
      f.value = [], d.value = d.value ? null : W.currentTarget;
    };
    function x(W) {
      if (W.next.length) {
        f.value = [...f.value, W];
        return;
      }
      d.value = null, a("pick", W.click);
    }
    function _() {
      var W;
      a("update:modelValue", ""), (W = u.value) == null || W.focus();
    }
    return t({ focus: () => {
      var W;
      return (W = u.value) == null ? void 0 : W.focus();
    } }), (W, Q) => {
      var E;
      return c(), h("div", Ww, [
        p("div", Hw, [
          D(ge, {
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
            onInput: Q[0] || (Q[0] = (b) => a("update:modelValue", b.target.value)),
            onKeydown: Jt(_, ["esc"])
          }, null, 40, Uw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            D(ge, {
              name: "close",
              size: 12
            })
          ])) : O("", !0),
          v.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!d.value,
            onClick: M
          }, [
            D(ge, {
              name: "caret",
              size: 12
            })
          ], 8, zw)) : O("", !0)
        ]),
        (E = V(r).button) != null && E.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Q[1] || (Q[1] = (b) => a("pick", V(r).button.click))
        }, $(V(r).button.title), 1)) : O("", !0),
        he(W.$slots, "default", {}, void 0, !0),
        d.value ? (c(), G(Sa, {
          key: 1,
          anchor: d.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Q[3] || (Q[3] = be(() => {
          }, ["stop"])),
          onClose: Q[4] || (Q[4] = (b) => d.value = null)
        }, {
          default: F(() => [
            f.value.length ? (c(), G(Bt, {
              key: 0,
              "data-search-back": "",
              onClick: Q[2] || (Q[2] = (b) => f.value = f.value.slice(0, -1))
            }, {
              default: F(() => [
                oe("‹ " + $(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : O("", !0),
            (c(!0), h(K, null, te(g.value, (b) => (c(), G(Bt, {
              key: b.title,
              description: b.subtext,
              "data-search-entry": b.title,
              onClick: (A) => x(b)
            }, {
              default: F(() => [
                oe($(b.title) + $(b.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? O("", !0) : he(W.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : O("", !0)
      ]);
    };
  }
}, Gw = /* @__PURE__ */ Y(Vw, [["__scopeId", "data-v-43c4837e"]]), Kw = {
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
    return (o, r) => (c(), G(Gw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: F(() => [
        D(ca, null, {
          default: F(() => [...r[2] || (r[2] = [
            oe("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, te(s, (i) => D(Bt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (l) => e.tools.order.value = i.key
        }, {
          default: F(() => [
            oe($(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          D(ca, null, {
            default: F(() => [...r[3] || (r[3] = [
              oe("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, te(a, (i) => D(Bt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (l) => e.tools.state.value = i.key
          }, {
            default: F(() => [
              oe($(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : O("", !0)
      ]),
      default: F(() => [
        he(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, kx = /* @__PURE__ */ Y(Kw, [["__scopeId", "data-v-dab0064d"]]);
function bx() {
  const e = B(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const xx = (e) => import(
  /* @vite-ignore */
  e
), Yw = 86400, ua = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Jw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ua(t) - ua(e)) / Yw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function $x(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ua(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Jw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Is = 280, Rs = 240, Bs = 120, Zw = 6, Xw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Qw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Hi(e, t) {
  const n = Math.max(0, Qw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function ek(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Xw}px)` }), e.offsetHeight, e.style.transition = `height ${Is}ms ${ln}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Hi(t, e));
    const g = a() - i;
    if (!l && g >= Is && (l = !0, e.style.transition = `opacity ${Rs}ms ease-out, transform ${Rs}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), g < Is + Rs) return s(f);
    d();
  };
  return s(f), d;
}
function Mx(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${Zw}px)` }), e.offsetHeight, e.style.transition = `opacity ${Bs}ms ease-out, transform ${Bs}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Hi(t, e)), a() - r < Bs) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const tk = 140, On = 220, qo = 5;
function Sx({ gap: e = tk, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(d, f) {
    s.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      s.delete(d), d.done(), f();
    });
  }
  function l() {
    const d = n.splice(0, qo);
    if (a = d.length > 0, !a) return;
    let f = d.length;
    for (const g of d)
      g.el.style.display = g.display, i(g, () => {
        f -= 1, f || (o = t(l, e));
      });
  }
  const u = (d, f, g, v = ek) => {
    if (r || !f.pane || !f.follows()) return g();
    const M = { el: d, options: f, done: g, arrival: v, display: d.style.display || "" };
    if (!a)
      return a = !0, i(M, () => o = t(l, e));
    d.style.display = "none", n.push(M), n.length >= qo && u.flush();
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
function _x(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const Ui = "chat.pins.minimised", Nn = B(Zt(Ui, !1));
function Fo(e) {
  Nn.value = e, Kn(Ui, e);
}
function nk(e) {
  const t = N(() => e()), n = N(() => Nn.value ? [] : e()), s = () => Fo(!Nn.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => bt(o) > a).length,
    (o, r) => o > r && Fo(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: s };
}
const sk = ["title"], ak = {
  key: 0,
  class: "pins-count"
}, ok = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = nk(() => t.pinRows);
    return (o, r) => V(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: V(s), inline: e.inline }]),
      title: V(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => V(a) && V(a)(...i), ["stop"]))
    }, [
      D(ge, {
        name: V(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      V(s) ? (c(), h("span", ak, $(V(n).length), 1)) : O("", !0)
    ], 10, sk)) : O("", !0);
  }
}, Ex = /* @__PURE__ */ Y(ok, [["__scopeId", "data-v-d073c504"]]), rk = ["title"], ik = ["title"], lk = { class: "diff-card-dir" }, ck = { class: "diff-card-name" }, uk = ["title"], dk = ["title"], hk = {
  key: 0,
  class: "diff-card-note"
}, fk = ["href"], mk = ["src", "alt"], pk = { class: "diff-card-rows" }, gk = { class: "diff-row-num" }, vk = { class: "diff-row-sign" }, yk = { class: "diff-row-code" }, wk = {
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
    function o(S) {
      (S.metaKey || S.ctrlKey) && (S.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = N(() => n.path.lastIndexOf("/") + 1), u = N(() => n.path.slice(0, l.value)), d = N(() => n.path.slice(l.value)), f = N(() => n.kind === "deleted"), g = N(() => r[n.kind]), v = N(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), M = B("after"), x = N(() => M.value === "before" ? n.whole.old : n.whole.text), _ = N(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((S, k) => ({ line_type: M.value === "after" && v.value.has(k + 1) ? "add" : "ctx", line: k + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), T = B(!1), W = N(() => n.lines && !T.value && !n.whole), Q = N(() => W.value ? _.value.slice(0, n.lines) : _.value), E = N(() => _.value.length - Q.value.length), b = (S) => S.line === null || S.line_type === "del" ? "" : S.line, A = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, y = B(null), C = B(null);
    let w = null;
    return qe(() => {
      if (!C.value) return;
      let S = !0;
      w = new ResizeObserver(() => {
        !y.value || !C.value || (y.value.style.transition = S ? "none" : "", y.value.style.height = `${C.value.offsetHeight}px`, S = !1);
      }), w.observe(C.value);
    }), Ie(() => w && w.disconnect()), (S, k) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      p("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: k[2] || (k[2] = (m) => !f.value && s("fold"))
      }, [
        p("span", {
          class: "diff-card-path",
          title: `${e.path} · ${V(a)}-click to open it`,
          onClick: o
        }, [
          p("span", lk, $(u.value), 1),
          p("span", ck, $(d.value), 1),
          g.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.kind])
          }, $(g.value), 3)) : O("", !0)
        ], 8, ik),
        p("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + $(e.added), 3),
        p("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + $(e.removed), 3),
        D(os, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: M.value === "after" ? "Show the file before" : "Show the file after",
          onClick: k[0] || (k[0] = be((m) => M.value = M.value === "after" ? "before" : "after", ["stop"]))
        }, $(M.value === "after" ? "After" : "Before"), 9, uk)) : O("", !0),
        f.value ? O("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: k[1] || (k[1] = be((m) => s("whole"), ["stop"]))
        }, [
          D(ge, {
            name: "file",
            size: 12
          })
        ], 10, dk))
      ], 8, rk),
      e.whole && e.whole.error ? (c(), h("p", hk, $(e.whole.error), 1)) : O("", !0),
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
          }, null, 8, mk)
        ], 8, fk)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: y,
          class: "diff-card-grow"
        }, [
          p("div", {
            ref_key: "body",
            ref: C,
            class: "diff-card-diff"
          }, [
            p("div", pk, [
              (c(!0), h(K, null, te(Q.value, (m, I) => (c(), h("div", {
                key: I,
                class: Z(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                p("span", gk, $(b(m)), 1),
                p("span", vk, $(i[m.line_type]), 1),
                p("span", yk, $(A(m)), 1)
              ], 2))), 128)),
              E.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: k[3] || (k[3] = be((m) => T.value = !0, ["stop"]))
              }, $(E.value) + " more " + $(E.value === 1 ? "line" : "lines"), 1)) : O("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : O("", !0)
    ], 2));
  }
}, Ax = /* @__PURE__ */ Y(wk, [["__scopeId", "data-v-fed58c18"]]), kk = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(pe, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: F(() => [
        D(ge, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, bk = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, xk = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, $k = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Mk = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], Sk = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], _k = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Ek = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], Ak = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? Ek(t) : e === "agent" ? [...Sk(t), ...Mk(t)] : e === "check" ? _k(t) : e === "question" ? $k(t) : ((n = { plan: bk, task: xk }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Ck = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Ok = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, Tk = { class: "ask-text" }, Ik = ["placeholder", "aria-label"], Rk = ["placeholder", "aria-label"], Bk = {
  key: 3,
  class: "moves"
}, Lk = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = N(() => Ak(s.kind, s.row)), r = B(""), i = B(null), l = B(""), u = B("");
    ke(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(v, M = "") {
      const x = await s.read([v.noun ?? s.kind, v.word, String(s.id), ...v.flag ? [v.flag, M] : v.positional ? [M] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = x.ok ? "" : x.error, x.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (v) => v.confirm ? i.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (i.value = v, l.value = "") : d(v), g = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (v, M) => {
      var x;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", Ck, $(r.value), 1)) : O("", !0),
        (x = i.value) != null && x.confirm ? (c(), h("div", Ok, [
          p("span", Tk, $(i.value.confirm), 1),
          D(pe, {
            small: "",
            kind: "primary",
            "data-resource-confirm-yes": "",
            onClick: M[0] || (M[0] = (_) => d(i.value))
          }, {
            default: F(() => [
              oe($(i.value.label), 1)
            ]),
            _: 1
          }),
          D(pe, {
            small: "",
            kind: "ghost",
            onClick: M[1] || (M[1] = (_) => i.value = null)
          }, {
            default: F(() => [...M[7] || (M[7] = [
              oe("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(g, ["prevent"])
        }, [
          ht(p("input", {
            "onUpdate:modelValue": M[2] || (M[2] = (_) => l.value = _),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: M[3] || (M[3] = Jt(be((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, Ik), [
            [Ps, l.value]
          ]),
          i.value.opener ? ht((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": M[4] || (M[4] = (_) => u.value = _),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: M[5] || (M[5] = Jt(be((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, Rk)), [
            [Ps, u.value]
          ]) : O("", !0),
          D(pe, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: F(() => [
              oe($(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          D(pe, {
            small: "",
            kind: "ghost",
            onClick: M[6] || (M[6] = (_) => i.value = null)
          }, {
            default: F(() => [...M[8] || (M[8] = [
              oe("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Bk, [
          (c(!0), h(K, null, te(o.value, (_) => (c(), G(pe, {
            key: _.word,
            small: !_.bordered,
            bordered: _.bordered,
            icon: _.icon,
            kind: _.main ? "primary" : "ghost",
            "data-move": _.word,
            onClick: (T) => f(_)
          }, {
            default: F(() => [
              oe($(_.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : O("", !0);
    };
  }
}, Nk = /* @__PURE__ */ Y(Lk, [["__scopeId", "data-v-ed426b4f"]]), Dk = /* @__PURE__ */ new Set(["completed", "cancelled"]), Pk = (e) => Dk.has(e), da = (e) => Pk(e) ? "done" : e, jk = { class: "facts" }, qk = { class: "fact wide" }, Fk = { class: "fact-value" }, Wk = {
  key: 0,
  class: "fact"
}, Hk = { class: "fact-value" }, Uk = {
  key: 1,
  class: "fact"
}, zk = { class: "fact-value" }, Vk = { class: "fact wide" }, Gk = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Kk = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = qn.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var r, i;
      return c(), h("div", jk, [
        p("div", qk, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", Fk, $((r = e.place) != null && r.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((i = e.place) == null ? void 0 : i.phase_total) > 1 ? (c(), h("div", Wk, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", Hk, $(e.place.phase_number) + " of " + $(e.place.phase_total) + ": " + $(e.place.phase_title), 1)
        ])) : O("", !0),
        e.task.state === "started" && e.task.holder_id ? (c(), h("div", Uk, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Assigned to", -1)),
          p("span", zk, "Agent " + $(e.task.holder_id), 1)
        ])) : O("", !0),
        p("div", Vk, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          D(Gr, {
            options: V(n),
            value: String(V(Vr)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (l) => s("priority", l))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", Gk, $(e.refusal), 1)) : O("", !0)
        ])
      ]);
    };
  }
}, Yk = /* @__PURE__ */ Y(Kk, [["__scopeId", "data-v-dd83aeb0"]]), Jk = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, Zk = { ...Jk, done: "Completed" }, Xk = { class: "task-status-icon" }, Qk = ["width", "height", "aria-label"], e2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", Xk, [
      D(Nt, {
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
            "aria-label": V(Zk)[e.status]
          }, [
            D(cn, { value: e.status }, {
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
          ], 10, Qk))
        ]),
        _: 1
      })
    ]));
  }
}, zi = /* @__PURE__ */ Y(e2, [["__scopeId", "data-v-2ab7e404"]]), t2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, n2 = ["onClick"], s2 = { class: "wait-id" }, a2 = { class: "wait-title" }, o2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, r2 = { class: "text" }, i2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, l2 = 180, c2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = B(!1);
    return (a, o) => (c(), h(K, null, [
      e.task.waits.length ? (c(), h("section", t2, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (c(!0), h(K, null, te(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          D(zi, {
            status: V(da)(r.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", s2, $(r.id), 1),
          p("span", a2, $(r.title), 1)
        ], 8, n2))), 128))
      ])) : O("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", o2, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", r2, $(e.task.outcome), 1)
      ])) : O("", !0),
      e.task.brief ? (c(), h("section", i2, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: Z(["text", { clamped: !s.value }])
        }, $(e.task.brief), 3),
        e.task.brief.length > l2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : O("", !0)
      ])) : O("", !0)
    ], 64));
  }
}, u2 = /* @__PURE__ */ Y(c2, [["__scopeId", "data-v-8e4d95ae"]]), d2 = {
  class: "task-details",
  "data-task-details": ""
}, h2 = { class: "since" }, f2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, m2 = { class: "text" }, p2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, g2 = {
  key: 1,
  class: "note"
}, v2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, y2 = { class: "text" }, w2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", d2, [
        p("div", {
          class: Z(["state-line", V(da)(e.task.state)])
        }, [
          p("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            D(zi, {
              status: V(da)(e.task.state)
            }, null, 8, ["status"]),
            oe(" " + $(s(e.task.state)), 1)
          ]),
          p("span", h2, [
            o[3] || (o[3] = oe(" since ", -1)),
            D(os, {
              at: V(wa)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", f2, [
          o[4] || (o[4] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
          p("p", m2, $(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", p2, "Opens by itself when " + $(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", g2, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", v2, [
          o[5] || (o[5] = p("span", { class: "label" }, "Why it was cancelled", -1)),
          p("p", y2, $(e.task.reason), 1)
        ])) : O("", !0),
        D(Yk, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        D(u2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, k2 = /* @__PURE__ */ Y(w2, [["__scopeId", "data-v-2863d987"]]), b2 = {
  class: "task-log",
  "aria-label": "Task log"
}, x2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, $2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, M2 = { class: "entries" }, S2 = ["datetime"], _2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, E2 = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = B([]), s = B(1), a = B(!0), o = B(!0), r = B("");
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
        String(We("task_logs")),
        "--page",
        String(u)
      ]);
      d === i && (o.value = !1, r.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, a.value = f.value.is_last_page));
    }
    return ke(
      () => [t.id, t.changes],
      () => {
        n.value = [], l();
      },
      { immediate: !0 }
    ), Dt(() => {
      i += 1;
    }), (u, d) => (c(), h("section", b2, [
      o.value ? (c(), G(Pt, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        p("p", x2, $(r.value), 1),
        D(pe, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => l(s.value))
        }, {
          default: F(() => [...d[3] || (d[3] = [
            oe("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(K, { key: 2 }, [
        n.value.length ? O("", !0) : (c(), h("p", $2, "No log entries yet.")),
        p("ol", M2, [
          (c(!0), h(K, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            p("time", {
              datetime: f.created_at
            }, $(new Date(f.created_at).toLocaleString()), 9, S2),
            p("p", null, $(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", _2, [
          D(pe, {
            small: "",
            bordered: "",
            disabled: s.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => l(s.value - 1))
          }, {
            default: F(() => [...d[4] || (d[4] = [
              oe("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          p("span", null, "Page " + $(s.value), 1),
          D(pe, {
            small: "",
            bordered: "",
            disabled: a.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => l(s.value + 1))
          }, {
            default: F(() => [...d[5] || (d[5] = [
              oe("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : O("", !0)
      ], 64))
    ]));
  }
}, A2 = /* @__PURE__ */ Y(E2, [["__scopeId", "data-v-953605e5"]]), C2 = { class: "comment-side-head" }, O2 = {
  key: 0,
  class: "comment-none"
}, T2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", C2, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        D(Zn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? O("", !0) : (c(), h("p", O2, "No comments yet")),
      (c(!0), h(K, null, te(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, $(e.words(s)), 1))), 128))
    ], 2));
  }
}, I2 = /* @__PURE__ */ Y(T2, [["__scopeId", "data-v-19fdbdd4"]]);
var Ho;
/Mac|iPhone|iPad/.test(((Ho = navigator.userAgentData) == null ? void 0 : Ho.platform) || navigator.platform);
function R2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const B2 = ["placeholder"], L2 = { class: "actions" }, N2 = { class: "error" }, D2 = {
  key: 1,
  class: "card closed"
}, P2 = { class: "mark" }, j2 = { class: "prompt" }, q2 = {
  key: 0,
  class: "draft"
}, F2 = {
  __name: "QuickCommentBar",
  props: /* @__PURE__ */ Ds({
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
  emits: /* @__PURE__ */ Ds(["show"], ["update:draft", "update:error"]),
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = Ns(e, "draft"), r = Ns(e, "error"), i = B(!!r.value), l = B(!1), u = B(!1), d = B(null);
    async function f() {
      var M, x;
      i.value = !0, l.value = !1, await $t(), (x = ((M = d.value) == null ? void 0 : M.querySelector("input")) || d.value) == null || x.focus();
    }
    function g() {
      i.value = !1, r.value = "";
    }
    async function v() {
      const M = o.value.trim();
      if (!(!M || !s.ready || u.value)) {
        r.value = "", u.value = !0, o.value = "";
        try {
          await s.send(M), i.value = !1, l.value = !0;
        } catch (x) {
          o.value = M, r.value = x.message;
        } finally {
          u.value = !1;
        }
      }
    }
    return t({ expand: f }), (M, x) => (c(), h("div", {
      class: Z(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(v, ["prevent"]),
        onKeydown: Jt(g, ["esc"])
      }, [
        he(M.$slots, "who", {}, void 0, !0),
        ht(p("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": x[0] || (x[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = Jt((_) => V(R2)(_, v), ["enter"]))
        }, null, 40, B2), [
          [Ps, o.value]
        ]),
        p("div", L2, [
          p("span", N2, $(r.value), 1),
          D(pe, {
            small: "",
            onClick: g
          }, {
            default: F(() => [...x[3] || (x[3] = [
              oe("Cancel", -1)
            ])]),
            _: 1
          }),
          D(pe, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: F(() => [...x[4] || (x[4] = [
              oe("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", D2, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          p("span", P2, [
            D(ge, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", j2, $(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", q2, "Draft kept")) : O("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = (_) => a("show"))
        }, [
          p("span", null, $(V(_m)(e.count, "comment")), 1),
          D(ge, {
            name: "down",
            size: 12
          })
        ])) : O("", !0)
      ]))
    ], 2));
  }
}, W2 = /* @__PURE__ */ Y(F2, [["__scopeId", "data-v-81f478d2"]]);
function H2(e, t) {
  const n = B([]), s = B(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: g } = e(), v = `On ${d} ${f}, ${g}: `;
    return u.text.startsWith(v) ? u.text.slice(v.length) : u.text;
  };
  async function i() {
    const { kind: u, id: d } = e();
    if (!d) return;
    const f = ++o, g = await t([u, "comments", String(d)]);
    f === o && (n.value = g.ok ? g.value.rows ?? [] : []);
  }
  async function l(u) {
    const { kind: d, id: f } = e(), g = { id: `sending-${++a}`, text: u };
    n.value = [...n.value, g], s.value = !0;
    const v = await t([d, "comment", String(f), u]);
    if (!v.ok)
      throw n.value = n.value.filter((M) => M !== g && M.id !== g.id), new Error(v.error);
    await i();
  }
  return ke(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const U2 = { class: "top" }, z2 = {
  class: "crumb",
  "data-task-crumb": ""
}, V2 = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, G2 = {
  key: 1,
  class: "body"
}, K2 = { class: "summary" }, Y2 = { class: "stamp" }, J2 = {
  class: "title",
  "data-resource-title": ""
}, Z2 = {
  class: "tabs",
  "data-task-tabs": ""
}, X2 = { class: "panels" }, Q2 = {
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
    const s = e, a = n, o = B(null), r = B(null), i = B(""), l = B(""), u = B(null), d = B(null), f = B("details"), g = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = H2(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (E) => s.read(E)
    );
    let M = 0;
    const x = N(() => {
      var E;
      return (E = r.value) != null && E.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function _() {
      const E = ++M, [b, A] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      E === M && (i.value = b.ok ? "" : b.error, o.value = b.ok ? b.value : null, r.value = A.ok ? A.value : null);
    }
    ke(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", _();
      },
      { immediate: !0 }
    ), ke(() => s.changes, _), ke(v.open, (E) => {
      E && (f.value = "comments");
    });
    async function T(E) {
      const b = o.value.priority;
      o.value.priority = Number(E);
      const A = await s.read(["task", "edit", String(s.id), "--priority", E]);
      if (l.value = A.ok ? "" : A.error, A.ok) return _();
      o.value.priority = b;
    }
    function W(E) {
      u.value = null, d.value.press(E);
    }
    const Q = (E) => {
      var b;
      return ((b = d.value) == null ? void 0 : b.moves.length) && (u.value = E);
    };
    return t({ openStatus: Q }), (E, b) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", U2, [
        e.backed ? (c(), G(kk, {
          key: 0,
          onBack: b[0] || (b[0] = (A) => a("back"))
        })) : O("", !0),
        p("span", z2, $(x.value), 1),
        b[9] || (b[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          D(pe, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: b[1] || (b[1] = (A) => a("step", -1))
          }, {
            default: F(() => [
              D(ge, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          D(pe, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: b[2] || (b[2] = (A) => a("step", 1))
          }, {
            default: F(() => [
              D(ge, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : O("", !0),
        D(pe, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: b[3] || (b[3] = (A) => a("close"))
        }, {
          default: F(() => [
            D(ge, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", V2, $(i.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        D(Nk, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: _
        }, null, 8, ["id", "row", "read"]),
        p("header", K2, [
          p("div", Y2, [
            oe(" Task " + $(o.value.id) + " · updated ", 1),
            D(os, {
              at: V(wa)(o.value)
            }, null, 8, ["at"])
          ]),
          p("h3", J2, $(o.value.title), 1)
        ]),
        p("div", Z2, [
          D(Gr, {
            options: g,
            value: f.value,
            onPick: b[4] || (b[4] = (A) => f.value = A)
          }, null, 8, ["value"])
        ]),
        p("div", X2, [
          D(cn, { value: f.value }, {
            details: F(() => [
              D(k2, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: Q,
                onPriority: T,
                onSelect: b[5] || (b[5] = (A) => a("select", A))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: F(() => [
              D(I2, {
                below: "",
                comments: V(v).comments.value,
                words: V(v).words,
                onClose: b[6] || (b[6] = (A) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: F(() => [
              D(A2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        D(W2, {
          send: V(v).send,
          count: V(v).comments.value.length,
          onShow: b[7] || (b[7] = (A) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", G2, [
        D(Pt)
      ])),
      u.value ? (c(), G(Sa, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: b[8] || (b[8] = (A) => u.value = null)
      }, {
        default: F(() => [
          D(ca, null, {
            default: F(() => [
              oe("Change the status of task " + $(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(K, null, te(d.value.moves, (A) => (c(), G(Bt, {
            key: A.word,
            onClick: (y) => W(A)
          }, {
            default: F(() => [
              oe($(A.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : O("", !0)
    ], 2));
  }
}, Cx = /* @__PURE__ */ Y(Q2, [["__scopeId", "data-v-43f3b122"]]);
function eb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ls = { exports: {} }, Wo;
function tb() {
  return Wo || (Wo = 1, (function(e, t) {
    var n = (function() {
      var s = function(b, A) {
        var y = 236, C = 17, w = b, S = o[A], k = null, m = 0, I = null, P = [], L = {}, J = function(j, q) {
          m = w * 4 + 17, k = (function(R) {
            for (var H = new Array(R), U = 0; U < R; U += 1) {
              H[U] = new Array(R);
              for (var X = 0; X < R; X += 1)
                H[U][X] = null;
            }
            return H;
          })(m), z(0, 0), z(m - 7, 0), z(0, m - 7), ye(), le(), Ge(j, q), w >= 7 && Re(j), I == null && (I = Vi(w, S, P)), Ke(I, q);
        }, z = function(j, q) {
          for (var R = -1; R <= 7; R += 1)
            if (!(j + R <= -1 || m <= j + R))
              for (var H = -1; H <= 7; H += 1)
                q + H <= -1 || m <= q + H || (0 <= R && R <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (R == 0 || R == 6) || 2 <= R && R <= 4 && 2 <= H && H <= 4 ? k[j + R][q + H] = !0 : k[j + R][q + H] = !1);
        }, ce = function() {
          for (var j = 0, q = 0, R = 0; R < 8; R += 1) {
            J(!0, R);
            var H = i.getLostPoint(L);
            (R == 0 || j > H) && (j = H, q = R);
          }
          return q;
        }, le = function() {
          for (var j = 8; j < m - 8; j += 1)
            k[j][6] == null && (k[j][6] = j % 2 == 0);
          for (var q = 8; q < m - 8; q += 1)
            k[6][q] == null && (k[6][q] = q % 2 == 0);
        }, ye = function() {
          for (var j = i.getPatternPosition(w), q = 0; q < j.length; q += 1)
            for (var R = 0; R < j.length; R += 1) {
              var H = j[q], U = j[R];
              if (k[H][U] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var se = -2; se <= 2; se += 1)
                    X == -2 || X == 2 || se == -2 || se == 2 || X == 0 && se == 0 ? k[H + X][U + se] = !0 : k[H + X][U + se] = !1;
            }
        }, Re = function(j) {
          for (var q = i.getBCHTypeNumber(w), R = 0; R < 18; R += 1) {
            var H = !j && (q >> R & 1) == 1;
            k[Math.floor(R / 3)][R % 3 + m - 8 - 3] = H;
          }
          for (var R = 0; R < 18; R += 1) {
            var H = !j && (q >> R & 1) == 1;
            k[R % 3 + m - 8 - 3][Math.floor(R / 3)] = H;
          }
        }, Ge = function(j, q) {
          for (var R = S << 3 | q, H = i.getBCHTypeInfo(R), U = 0; U < 15; U += 1) {
            var X = !j && (H >> U & 1) == 1;
            U < 6 ? k[U][8] = X : U < 8 ? k[U + 1][8] = X : k[m - 15 + U][8] = X;
          }
          for (var U = 0; U < 15; U += 1) {
            var X = !j && (H >> U & 1) == 1;
            U < 8 ? k[8][m - U - 1] = X : U < 9 ? k[8][15 - U - 1 + 1] = X : k[8][15 - U - 1] = X;
          }
          k[m - 8][8] = !j;
        }, Ke = function(j, q) {
          for (var R = -1, H = m - 1, U = 7, X = 0, se = i.getMaskFunction(q), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (k[H][ne - we] == null) {
                  var $e = !1;
                  X < j.length && ($e = (j[X] >>> U & 1) == 1);
                  var re = se(H, ne - we);
                  re && ($e = !$e), k[H][ne - we] = $e, U -= 1, U == -1 && (X += 1, U = 7);
                }
              if (H += R, H < 0 || m <= H) {
                H -= R, R = -R;
                break;
              }
            }
        }, _t = function(j, q) {
          for (var R = 0, H = 0, U = 0, X = new Array(q.length), se = new Array(q.length), ne = 0; ne < q.length; ne += 1) {
            var we = q[ne].dataCount, $e = q[ne].totalCount - we;
            H = Math.max(H, we), U = Math.max(U, $e), X[ne] = new Array(we);
            for (var re = 0; re < X[ne].length; re += 1)
              X[ne][re] = 255 & j.getBuffer()[re + R];
            R += we;
            var Le = i.getErrorCorrectPolynomial($e), Ne = u(X[ne], Le.getLength() - 1), Pa = Ne.mod(Le);
            se[ne] = new Array(Le.getLength() - 1);
            for (var re = 0; re < se[ne].length; re += 1) {
              var ja = re + Pa.getLength() - se[ne].length;
              se[ne][re] = ja >= 0 ? Pa.getAt(ja) : 0;
            }
          }
          for (var qa = 0, re = 0; re < q.length; re += 1)
            qa += q[re].totalCount;
          for (var rs = new Array(qa), kn = 0, re = 0; re < H; re += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              re < X[ne].length && (rs[kn] = X[ne][re], kn += 1);
          for (var re = 0; re < U; re += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              re < se[ne].length && (rs[kn] = se[ne][re], kn += 1);
          return rs;
        }, Vi = function(j, q, R) {
          for (var H = d.getRSBlocks(j, q), U = f(), X = 0; X < R.length; X += 1) {
            var se = R[X];
            U.put(se.getMode(), 4), U.put(se.getLength(), i.getLengthInBits(se.getMode(), j)), se.write(U);
          }
          for (var ne = 0, X = 0; X < H.length; X += 1)
            ne += H[X].dataCount;
          if (U.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + U.getLengthInBits() + ">" + ne * 8 + ")";
          for (U.getLengthInBits() + 4 <= ne * 8 && U.put(0, 4); U.getLengthInBits() % 8 != 0; )
            U.putBit(!1);
          for (; !(U.getLengthInBits() >= ne * 8 || (U.put(y, 8), U.getLengthInBits() >= ne * 8)); )
            U.put(C, 8);
          return _t(U, H);
        };
        L.addData = function(j, q) {
          q = q || "Byte";
          var R = null;
          switch (q) {
            case "Numeric":
              R = g(j);
              break;
            case "Alphanumeric":
              R = v(j);
              break;
            case "Byte":
              R = M(j);
              break;
            case "Kanji":
              R = x(j);
              break;
            default:
              throw "mode:" + q;
          }
          P.push(R), I = null;
        }, L.isDark = function(j, q) {
          if (j < 0 || m <= j || q < 0 || m <= q)
            throw j + "," + q;
          return k[j][q];
        }, L.getModuleCount = function() {
          return m;
        }, L.make = function() {
          if (w < 1) {
            for (var j = 1; j < 40; j++) {
              for (var q = d.getRSBlocks(j, S), R = f(), H = 0; H < P.length; H++) {
                var U = P[H];
                R.put(U.getMode(), 4), R.put(U.getLength(), i.getLengthInBits(U.getMode(), j)), U.write(R);
              }
              for (var X = 0, H = 0; H < q.length; H++)
                X += q[H].dataCount;
              if (R.getLengthInBits() <= X * 8)
                break;
            }
            w = j;
          }
          J(!1, ce());
        }, L.createTableTag = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var R = "";
          R += '<table style="', R += " border-width: 0px; border-style: none;", R += " border-collapse: collapse;", R += " padding: 0px; margin: " + q + "px;", R += '">', R += "<tbody>";
          for (var H = 0; H < L.getModuleCount(); H += 1) {
            R += "<tr>";
            for (var U = 0; U < L.getModuleCount(); U += 1)
              R += '<td style="', R += " border-width: 0px; border-style: none;", R += " border-collapse: collapse;", R += " padding: 0px; margin: 0px;", R += " width: " + j + "px;", R += " height: " + j + "px;", R += " background-color: ", R += L.isDark(H, U) ? "#000000" : "#ffffff", R += ";", R += '"/>';
            R += "</tr>";
          }
          return R += "</tbody>", R += "</table>", R;
        }, L.createSvgTag = function(j, q, R, H) {
          var U = {};
          typeof arguments[0] == "object" && (U = arguments[0], j = U.cellSize, q = U.margin, R = U.alt, H = U.title), j = j || 2, q = typeof q > "u" ? j * 4 : q, R = typeof R == "string" ? { text: R } : R || {}, R.text = R.text || null, R.id = R.text ? R.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var X = L.getModuleCount() * j + q * 2, se, ne, we, $e, re = "", Le;
          for (Le = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += U.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', re += ' viewBox="0 0 ' + X + " " + X + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += H.text || R.text ? ' role="img" aria-labelledby="' + Et([H.id, R.id].join(" ").trim()) + '"' : "", re += ">", re += H.text ? '<title id="' + Et(H.id) + '">' + Et(H.text) + "</title>" : "", re += R.text ? '<description id="' + Et(R.id) + '">' + Et(R.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', we = 0; we < L.getModuleCount(); we += 1)
            for ($e = we * j + q, se = 0; se < L.getModuleCount(); se += 1)
              L.isDark(we, se) && (ne = se * j + q, re += "M" + ne + "," + $e + Le);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, L.createDataURL = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var R = L.getModuleCount() * j + q * 2, H = q, U = R - q;
          return E(R, R, function(X, se) {
            if (H <= X && X < U && H <= se && se < U) {
              var ne = Math.floor((X - H) / j), we = Math.floor((se - H) / j);
              return L.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(j, q, R) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var H = L.getModuleCount() * j + q * 2, U = "";
          return U += "<img", U += ' src="', U += L.createDataURL(j, q), U += '"', U += ' width="', U += H, U += '"', U += ' height="', U += H, U += '"', R && (U += ' alt="', U += Et(R), U += '"'), U += "/>", U;
        };
        var Et = function(j) {
          for (var q = "", R = 0; R < j.length; R += 1) {
            var H = j.charAt(R);
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
        }, Gi = function(j) {
          var q = 1;
          j = typeof j > "u" ? q * 2 : j;
          var R = L.getModuleCount() * q + j * 2, H = j, U = R - j, X, se, ne, we, $e, re = {
            "██": "█",
            "█ ": "▀",
            " █": "▄",
            "  ": " "
          }, Le = {
            "██": "▀",
            "█ ": "▀",
            " █": " ",
            "  ": " "
          }, Ne = "";
          for (X = 0; X < R; X += 2) {
            for (ne = Math.floor((X - H) / q), we = Math.floor((X + 1 - H) / q), se = 0; se < R; se += 1)
              $e = "█", H <= se && se < U && H <= X && X < U && L.isDark(ne, Math.floor((se - H) / q)) && ($e = " "), H <= se && se < U && H <= X + 1 && X + 1 < U && L.isDark(we, Math.floor((se - H) / q)) ? $e += " " : $e += "█", Ne += j < 1 && X + 1 >= U ? Le[$e] : re[$e];
            Ne += `
`;
          }
          return R % 2 && j > 0 ? Ne.substring(0, Ne.length - R - 1) + Array(R + 1).join("▀") : Ne.substring(0, Ne.length - 1);
        };
        return L.createASCII = function(j, q) {
          if (j = j || 1, j < 2)
            return Gi(q);
          j -= 1, q = typeof q > "u" ? j * 2 : q;
          var R = L.getModuleCount() * j + q * 2, H = q, U = R - q, X, se, ne, we, $e = Array(j + 1).join("██"), re = Array(j + 1).join("  "), Le = "", Ne = "";
          for (X = 0; X < R; X += 1) {
            for (ne = Math.floor((X - H) / j), Ne = "", se = 0; se < R; se += 1)
              we = 1, H <= se && se < U && H <= X && X < U && L.isDark(ne, Math.floor((se - H) / j)) && (we = 0), Ne += we ? $e : re;
            for (ne = 0; ne < j; ne += 1)
              Le += Ne + `
`;
          }
          return Le.substring(0, Le.length - 1);
        }, L.renderTo2dContext = function(j, q) {
          q = q || 2;
          for (var R = L.getModuleCount(), H = 0; H < R; H++)
            for (var U = 0; U < R; U++)
              j.fillStyle = L.isDark(H, U) ? "black" : "white", j.fillRect(H * q, U * q, q, q);
        }, L;
      };
      s.stringToBytesFuncs = {
        default: function(b) {
          for (var A = [], y = 0; y < b.length; y += 1) {
            var C = b.charCodeAt(y);
            A.push(C & 255);
          }
          return A;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(b, A) {
        var y = (function() {
          for (var w = W(b), S = function() {
            var le = w.read();
            if (le == -1) throw "eof";
            return le;
          }, k = 0, m = {}; ; ) {
            var I = w.read();
            if (I == -1) break;
            var P = S(), L = S(), J = S(), z = String.fromCharCode(I << 8 | P), ce = L << 8 | J;
            m[z] = ce, k += 1;
          }
          if (k != A)
            throw k + " != " + A;
          return m;
        })(), C = 63;
        return function(w) {
          for (var S = [], k = 0; k < w.length; k += 1) {
            var m = w.charCodeAt(k);
            if (m < 128)
              S.push(m);
            else {
              var I = y[w.charAt(k)];
              typeof I == "number" ? (I & 255) == I ? S.push(I) : (S.push(I >>> 8), S.push(I & 255)) : S.push(C);
            }
          }
          return S;
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
        var b = [
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
        ], A = 1335, y = 7973, C = 21522, w = {}, S = function(k) {
          for (var m = 0; k != 0; )
            m += 1, k >>>= 1;
          return m;
        };
        return w.getBCHTypeInfo = function(k) {
          for (var m = k << 10; S(m) - S(A) >= 0; )
            m ^= A << S(m) - S(A);
          return (k << 10 | m) ^ C;
        }, w.getBCHTypeNumber = function(k) {
          for (var m = k << 12; S(m) - S(y) >= 0; )
            m ^= y << S(m) - S(y);
          return k << 12 | m;
        }, w.getPatternPosition = function(k) {
          return b[k - 1];
        }, w.getMaskFunction = function(k) {
          switch (k) {
            case r.PATTERN000:
              return function(m, I) {
                return (m + I) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, I) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, I) {
                return I % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, I) {
                return (m + I) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, I) {
                return (Math.floor(m / 2) + Math.floor(I / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, I) {
                return m * I % 2 + m * I % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, I) {
                return (m * I % 2 + m * I % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, I) {
                return (m * I % 3 + (m + I) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + k;
          }
        }, w.getErrorCorrectPolynomial = function(k) {
          for (var m = u([1], 0), I = 0; I < k; I += 1)
            m = m.multiply(u([1, l.gexp(I)], 0));
          return m;
        }, w.getLengthInBits = function(k, m) {
          if (1 <= m && m < 10)
            switch (k) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + k;
            }
          else if (m < 27)
            switch (k) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + k;
            }
          else if (m < 41)
            switch (k) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + k;
            }
          else
            throw "type:" + m;
        }, w.getLostPoint = function(k) {
          for (var m = k.getModuleCount(), I = 0, P = 0; P < m; P += 1)
            for (var L = 0; L < m; L += 1) {
              for (var J = 0, z = k.isDark(P, L), ce = -1; ce <= 1; ce += 1)
                if (!(P + ce < 0 || m <= P + ce))
                  for (var le = -1; le <= 1; le += 1)
                    L + le < 0 || m <= L + le || ce == 0 && le == 0 || z == k.isDark(P + ce, L + le) && (J += 1);
              J > 5 && (I += 3 + J - 5);
            }
          for (var P = 0; P < m - 1; P += 1)
            for (var L = 0; L < m - 1; L += 1) {
              var ye = 0;
              k.isDark(P, L) && (ye += 1), k.isDark(P + 1, L) && (ye += 1), k.isDark(P, L + 1) && (ye += 1), k.isDark(P + 1, L + 1) && (ye += 1), (ye == 0 || ye == 4) && (I += 3);
            }
          for (var P = 0; P < m; P += 1)
            for (var L = 0; L < m - 6; L += 1)
              k.isDark(P, L) && !k.isDark(P, L + 1) && k.isDark(P, L + 2) && k.isDark(P, L + 3) && k.isDark(P, L + 4) && !k.isDark(P, L + 5) && k.isDark(P, L + 6) && (I += 40);
          for (var L = 0; L < m; L += 1)
            for (var P = 0; P < m - 6; P += 1)
              k.isDark(P, L) && !k.isDark(P + 1, L) && k.isDark(P + 2, L) && k.isDark(P + 3, L) && k.isDark(P + 4, L) && !k.isDark(P + 5, L) && k.isDark(P + 6, L) && (I += 40);
          for (var Re = 0, L = 0; L < m; L += 1)
            for (var P = 0; P < m; P += 1)
              k.isDark(P, L) && (Re += 1);
          var Ge = Math.abs(100 * Re / m / m - 50) / 5;
          return I += Ge * 10, I;
        }, w;
      })(), l = (function() {
        for (var b = new Array(256), A = new Array(256), y = 0; y < 8; y += 1)
          b[y] = 1 << y;
        for (var y = 8; y < 256; y += 1)
          b[y] = b[y - 4] ^ b[y - 5] ^ b[y - 6] ^ b[y - 8];
        for (var y = 0; y < 255; y += 1)
          A[b[y]] = y;
        var C = {};
        return C.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return A[w];
        }, C.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return b[w];
        }, C;
      })();
      function u(b, A) {
        if (typeof b.length > "u")
          throw b.length + "/" + A;
        var y = (function() {
          for (var w = 0; w < b.length && b[w] == 0; )
            w += 1;
          for (var S = new Array(b.length - w + A), k = 0; k < b.length - w; k += 1)
            S[k] = b[k + w];
          return S;
        })(), C = {};
        return C.getAt = function(w) {
          return y[w];
        }, C.getLength = function() {
          return y.length;
        }, C.multiply = function(w) {
          for (var S = new Array(C.getLength() + w.getLength() - 1), k = 0; k < C.getLength(); k += 1)
            for (var m = 0; m < w.getLength(); m += 1)
              S[k + m] ^= l.gexp(l.glog(C.getAt(k)) + l.glog(w.getAt(m)));
          return u(S, 0);
        }, C.mod = function(w) {
          if (C.getLength() - w.getLength() < 0)
            return C;
          for (var S = l.glog(C.getAt(0)) - l.glog(w.getAt(0)), k = new Array(C.getLength()), m = 0; m < C.getLength(); m += 1)
            k[m] = C.getAt(m);
          for (var m = 0; m < w.getLength(); m += 1)
            k[m] ^= l.gexp(l.glog(w.getAt(m)) + S);
          return u(k, 0).mod(w);
        }, C;
      }
      var d = (function() {
        var b = [
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
        ], A = function(w, S) {
          var k = {};
          return k.totalCount = w, k.dataCount = S, k;
        }, y = {}, C = function(w, S) {
          switch (S) {
            case o.L:
              return b[(w - 1) * 4 + 0];
            case o.M:
              return b[(w - 1) * 4 + 1];
            case o.Q:
              return b[(w - 1) * 4 + 2];
            case o.H:
              return b[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return y.getRSBlocks = function(w, S) {
          var k = C(w, S);
          if (typeof k > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + S;
          for (var m = k.length / 3, I = [], P = 0; P < m; P += 1)
            for (var L = k[P * 3 + 0], J = k[P * 3 + 1], z = k[P * 3 + 2], ce = 0; ce < L; ce += 1)
              I.push(A(J, z));
          return I;
        }, y;
      })(), f = function() {
        var b = [], A = 0, y = {};
        return y.getBuffer = function() {
          return b;
        }, y.getAt = function(C) {
          var w = Math.floor(C / 8);
          return (b[w] >>> 7 - C % 8 & 1) == 1;
        }, y.put = function(C, w) {
          for (var S = 0; S < w; S += 1)
            y.putBit((C >>> w - S - 1 & 1) == 1);
        }, y.getLengthInBits = function() {
          return A;
        }, y.putBit = function(C) {
          var w = Math.floor(A / 8);
          b.length <= w && b.push(0), C && (b[w] |= 128 >>> A % 8), A += 1;
        }, y;
      }, g = function(b) {
        var A = a.MODE_NUMBER, y = b, C = {};
        C.getMode = function() {
          return A;
        }, C.getLength = function(k) {
          return y.length;
        }, C.write = function(k) {
          for (var m = y, I = 0; I + 2 < m.length; )
            k.put(w(m.substring(I, I + 3)), 10), I += 3;
          I < m.length && (m.length - I == 1 ? k.put(w(m.substring(I, I + 1)), 4) : m.length - I == 2 && k.put(w(m.substring(I, I + 2)), 7));
        };
        var w = function(k) {
          for (var m = 0, I = 0; I < k.length; I += 1)
            m = m * 10 + S(k.charAt(I));
          return m;
        }, S = function(k) {
          if ("0" <= k && k <= "9")
            return k.charCodeAt(0) - 48;
          throw "illegal char :" + k;
        };
        return C;
      }, v = function(b) {
        var A = a.MODE_ALPHA_NUM, y = b, C = {};
        C.getMode = function() {
          return A;
        }, C.getLength = function(S) {
          return y.length;
        }, C.write = function(S) {
          for (var k = y, m = 0; m + 1 < k.length; )
            S.put(
              w(k.charAt(m)) * 45 + w(k.charAt(m + 1)),
              11
            ), m += 2;
          m < k.length && S.put(w(k.charAt(m)), 6);
        };
        var w = function(S) {
          if ("0" <= S && S <= "9")
            return S.charCodeAt(0) - 48;
          if ("A" <= S && S <= "Z")
            return S.charCodeAt(0) - 65 + 10;
          switch (S) {
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
              throw "illegal char :" + S;
          }
        };
        return C;
      }, M = function(b) {
        var A = a.MODE_8BIT_BYTE, y = s.stringToBytes(b), C = {};
        return C.getMode = function() {
          return A;
        }, C.getLength = function(w) {
          return y.length;
        }, C.write = function(w) {
          for (var S = 0; S < y.length; S += 1)
            w.put(y[S], 8);
        }, C;
      }, x = function(b) {
        var A = a.MODE_KANJI, y = s.stringToBytesFuncs.SJIS;
        if (!y)
          throw "sjis not supported.";
        (function(S, k) {
          var m = y(S);
          if (m.length != 2 || (m[0] << 8 | m[1]) != k)
            throw "sjis not supported.";
        })("友", 38726);
        var C = y(b), w = {};
        return w.getMode = function() {
          return A;
        }, w.getLength = function(S) {
          return ~~(C.length / 2);
        }, w.write = function(S) {
          for (var k = C, m = 0; m + 1 < k.length; ) {
            var I = (255 & k[m]) << 8 | 255 & k[m + 1];
            if (33088 <= I && I <= 40956)
              I -= 33088;
            else if (57408 <= I && I <= 60351)
              I -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + I;
            I = (I >>> 8 & 255) * 192 + (I & 255), S.put(I, 13), m += 2;
          }
          if (m < k.length)
            throw "illegal char at " + (m + 1);
        }, w;
      }, _ = function() {
        var b = [], A = {};
        return A.writeByte = function(y) {
          b.push(y & 255);
        }, A.writeShort = function(y) {
          A.writeByte(y), A.writeByte(y >>> 8);
        }, A.writeBytes = function(y, C, w) {
          C = C || 0, w = w || y.length;
          for (var S = 0; S < w; S += 1)
            A.writeByte(y[S + C]);
        }, A.writeString = function(y) {
          for (var C = 0; C < y.length; C += 1)
            A.writeByte(y.charCodeAt(C));
        }, A.toByteArray = function() {
          return b;
        }, A.toString = function() {
          var y = "";
          y += "[";
          for (var C = 0; C < b.length; C += 1)
            C > 0 && (y += ","), y += b[C];
          return y += "]", y;
        }, A;
      }, T = function() {
        var b = 0, A = 0, y = 0, C = "", w = {}, S = function(m) {
          C += String.fromCharCode(k(m & 63));
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
        return w.writeByte = function(m) {
          for (b = b << 8 | m & 255, A += 8, y += 1; A >= 6; )
            S(b >>> A - 6), A -= 6;
        }, w.flush = function() {
          if (A > 0 && (S(b << 6 - A), b = 0, A = 0), y % 3 != 0)
            for (var m = 3 - y % 3, I = 0; I < m; I += 1)
              C += "=";
        }, w.toString = function() {
          return C;
        }, w;
      }, W = function(b) {
        var A = b, y = 0, C = 0, w = 0, S = {};
        S.read = function() {
          for (; w < 8; ) {
            if (y >= A.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var m = A.charAt(y);
            if (y += 1, m == "=")
              return w = 0, -1;
            if (m.match(/^\s$/))
              continue;
            C = C << 6 | k(m.charCodeAt(0)), w += 6;
          }
          var I = C >>> w - 8 & 255;
          return w -= 8, I;
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
        return S;
      }, Q = function(b, A) {
        var y = b, C = A, w = new Array(b * A), S = {};
        S.setPixel = function(P, L, J) {
          w[L * y + P] = J;
        }, S.write = function(P) {
          P.writeString("GIF87a"), P.writeShort(y), P.writeShort(C), P.writeByte(128), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(255), P.writeByte(255), P.writeByte(255), P.writeString(","), P.writeShort(0), P.writeShort(0), P.writeShort(y), P.writeShort(C), P.writeByte(0);
          var L = 2, J = m(L);
          P.writeByte(L);
          for (var z = 0; J.length - z > 255; )
            P.writeByte(255), P.writeBytes(J, z, 255), z += 255;
          P.writeByte(J.length - z), P.writeBytes(J, z, J.length - z), P.writeByte(0), P.writeString(";");
        };
        var k = function(P) {
          var L = P, J = 0, z = 0, ce = {};
          return ce.write = function(le, ye) {
            if (le >>> ye)
              throw "length over";
            for (; J + ye >= 8; )
              L.writeByte(255 & (le << J | z)), ye -= 8 - J, le >>>= 8 - J, z = 0, J = 0;
            z = le << J | z, J = J + ye;
          }, ce.flush = function() {
            J > 0 && L.writeByte(z);
          }, ce;
        }, m = function(P) {
          for (var L = 1 << P, J = (1 << P) + 1, z = P + 1, ce = I(), le = 0; le < L; le += 1)
            ce.add(String.fromCharCode(le));
          ce.add(String.fromCharCode(L)), ce.add(String.fromCharCode(J));
          var ye = _(), Re = k(ye);
          Re.write(L, z);
          var Ge = 0, Ke = String.fromCharCode(w[Ge]);
          for (Ge += 1; Ge < w.length; ) {
            var _t = String.fromCharCode(w[Ge]);
            Ge += 1, ce.contains(Ke + _t) ? Ke = Ke + _t : (Re.write(ce.indexOf(Ke), z), ce.size() < 4095 && (ce.size() == 1 << z && (z += 1), ce.add(Ke + _t)), Ke = _t);
          }
          return Re.write(ce.indexOf(Ke), z), Re.write(J, z), Re.flush(), ye.toByteArray();
        }, I = function() {
          var P = {}, L = 0, J = {};
          return J.add = function(z) {
            if (J.contains(z))
              throw "dup key:" + z;
            P[z] = L, L += 1;
          }, J.size = function() {
            return L;
          }, J.indexOf = function(z) {
            return P[z];
          }, J.contains = function(z) {
            return typeof P[z] < "u";
          }, J;
        };
        return S;
      }, E = function(b, A, y) {
        for (var C = Q(b, A), w = 0; w < A; w += 1)
          for (var S = 0; S < b; S += 1)
            C.setPixel(S, w, y(S, w));
        var k = _();
        C.write(k);
        for (var m = T(), I = k.toByteArray(), P = 0; P < I.length; P += 1)
          m.writeByte(I[P]);
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
  })(Ls)), Ls.exports;
}
var nb = tb();
const sb = /* @__PURE__ */ eb(nb), ab = ["width", "height", "viewBox"], ob = ["width", "height"], rb = ["d"], ib = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = N(() => {
      const s = sb(0, "M");
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
      }, null, 8, ob),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, rb)
    ], 8, ab));
  }
}, Ox = /* @__PURE__ */ Y(ib, [["__scopeId", "data-v-489f0852"]]), lb = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: fe({ padding: e.padding })
    }, [
      he(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, Tx = /* @__PURE__ */ Y(lb, [["__scopeId", "data-v-47e67f04"]]), Ix = rl(() => import("./VoiceFigure-Bpk5MJUf.js").then((e) => e.V)), Rx = "1.0.0", Bx = "3.5";
export {
  Wl as $,
  Me as A,
  Ce as B,
  z4 as C,
  ts as D,
  st as E,
  H4 as F,
  Ty as G,
  R5 as H,
  j4 as I,
  Py as J,
  St as K,
  dy as L,
  Ia as M,
  Uy as N,
  Dy as O,
  es as P,
  o4 as Q,
  h5 as R,
  Ln as S,
  u4 as T,
  a5 as U,
  Se as V,
  Fn as W,
  s5 as X,
  n5 as Y,
  Fl as Z,
  Y as _,
  Kb as a,
  E4 as a$,
  Wy as a0,
  f5 as a1,
  m5 as a2,
  Ae as a3,
  S5 as a4,
  M5 as a5,
  bt as a6,
  p5 as a7,
  D5 as a8,
  Db as a9,
  w4 as aA,
  n4 as aB,
  ey as aC,
  F5 as aD,
  W5 as aE,
  U4 as aF,
  Ei as aG,
  c4 as aH,
  gn as aI,
  Hb as aJ,
  qb as aK,
  R4 as aL,
  vn as aM,
  D4 as aN,
  I5 as aO,
  s4 as aP,
  a4 as aQ,
  t4 as aR,
  an as aS,
  kt as aT,
  Pb as aU,
  U0 as aV,
  Q5 as aW,
  u5 as aX,
  Si as aY,
  Lt as aZ,
  jt as a_,
  A4 as aa,
  L4 as ab,
  Vb as ac,
  o5 as ad,
  r5 as ae,
  x5 as af,
  $5 as ag,
  _5 as ah,
  Xb as ai,
  Lo as aj,
  g5 as ak,
  N5 as al,
  K4 as am,
  Y5 as an,
  G5 as ao,
  V5 as ap,
  E5 as aq,
  k5 as ar,
  w5 as as,
  b5 as at,
  l4 as au,
  L5 as av,
  P5 as aw,
  Z4 as ax,
  Gt as ay,
  j5 as az,
  tw as b,
  J4 as b$,
  Ey as b0,
  N4 as b1,
  f4 as b2,
  h4 as b3,
  mv as b4,
  hi as b5,
  M4 as b6,
  B5 as b7,
  as as b8,
  it as b9,
  p4 as bA,
  b4 as bB,
  dt as bC,
  d4 as bD,
  x4 as bE,
  q5 as bF,
  J5 as bG,
  H5 as bH,
  Oe as bI,
  T5 as bJ,
  $4 as bK,
  ox as bL,
  rx as bM,
  Lb as bN,
  G0 as bO,
  C5 as bP,
  g4 as bQ,
  Yb as bR,
  G4 as bS,
  m4 as bT,
  v4 as bU,
  y4 as bV,
  A5 as bW,
  ty as bX,
  O5 as bY,
  z5 as bZ,
  V4 as b_,
  k4 as ba,
  $s as bb,
  hr as bc,
  Q4 as bd,
  nx as be,
  i4 as bf,
  I4 as bg,
  Nb as bh,
  K5 as bi,
  ex as bj,
  v5 as bk,
  y5 as bl,
  e5 as bm,
  d5 as bn,
  Wb as bo,
  O4 as bp,
  Jb as bq,
  Zb as br,
  t5 as bs,
  X5 as bt,
  j0 as bu,
  P4 as bv,
  Ny as bw,
  Qb as bx,
  Ub as by,
  Z5 as bz,
  Ve as c,
  cn as c$,
  Fb as c0,
  jb as c1,
  U5 as c2,
  sx as c3,
  Da as c4,
  ax as c5,
  Wi as c6,
  T4 as c7,
  l5 as c8,
  i5 as c9,
  Bx as cA,
  bb as cB,
  kx as cC,
  ea as cD,
  Ob as cE,
  jg as cF,
  Bt as cG,
  ca as cH,
  Sa as cI,
  gb as cJ,
  xb as cK,
  El as cL,
  Lp as cM,
  Ex as cN,
  yb as cO,
  Ox as cP,
  gx as cQ,
  ec as cR,
  db as cS,
  Ib as cT,
  Gw as cU,
  Gr as cV,
  $b as cW,
  Pt as cX,
  K1 as cY,
  Eb as cZ,
  hb as c_,
  H0 as ca,
  zb as cb,
  By as cc,
  e4 as cd,
  Ca as ce,
  Yv as cf,
  r4 as cg,
  Kt as ch,
  It as ci,
  mb as cj,
  yx as ck,
  pe as cl,
  Zn as cm,
  pb as cn,
  nf as co,
  Ax as cp,
  Bb as cq,
  Nm as cr,
  Dn as cs,
  ix as ct,
  ub as cu,
  Rt as cv,
  kb as cw,
  ge as cx,
  wx as cy,
  Rx as cz,
  fv as d,
  Cx as d0,
  zi as d1,
  Mb as d2,
  lt as d3,
  Sb as d4,
  os as d5,
  Ix as d6,
  Tx as d7,
  zr as d8,
  hx as d9,
  yw as dA,
  bx as dB,
  kp as dC,
  Hr as dD,
  nk as dE,
  ai as dF,
  mx as dG,
  Qs as dH,
  px as dI,
  un as dJ,
  $x as dK,
  c1 as da,
  u1 as db,
  Sx as dc,
  Mx as dd,
  _x as de,
  Rb as df,
  Tb as dg,
  Cb as dh,
  cx as di,
  lx as dj,
  xx as dk,
  Ig as dl,
  kw as dm,
  fb as dn,
  wb as dp,
  dx as dq,
  fx as dr,
  Ue as ds,
  vb as dt,
  ux as du,
  Ab as dv,
  ut as dw,
  bw as dx,
  _b as dy,
  vx as dz,
  Fe as e,
  P0 as f,
  c5 as g,
  X4 as h,
  on as i,
  q4 as j,
  tx as k,
  C4 as l,
  F4 as m,
  rw as n,
  B4 as o,
  Gb as p,
  Ra as q,
  qi as r,
  Fi as s,
  Pe as t,
  W4 as u,
  gv as v,
  Y4 as w,
  S4 as x,
  _4 as y,
  wn as z
};
