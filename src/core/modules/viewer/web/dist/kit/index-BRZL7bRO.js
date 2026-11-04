/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as ue, createElementVNode as g, normalizeClass as Z, Fragment as K, renderList as ee, normalizeStyle as me, defineComponent as el, Comment as tl, h as pa, cloneVNode as nl, createBlock as G, withCtx as P, unref as U, createVNode as R, toDisplayString as k, createCommentVNode as E, inject as _e, useAttrs as Kn, computed as N, ref as O, resolveDynamicComponent as Mt, mergeProps as nt, onUnmounted as Te, onMounted as Ne, Teleport as ga, useId as va, resolveDirective as sl, withDirectives as ft, createTextVNode as se, reactive as ya, shallowRef as Bt, watch as ve, nextTick as mt, Transition as Pt, withModifiers as be, TransitionGroup as Go, isRef as Ha, onBeforeUnmount as jt, resolveComponent as al, useModel as js, getCurrentInstance as ol, mergeModels as qs, getCurrentScope as Ko, onScopeDispose as Yo, provide as rl, onErrorCaptured as il, toHandlers as ll, createSlots as cl, vShow as ul, useSlots as dl, withKeys as tn, vModelText as Fs, defineAsyncComponent as fl } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, hl = { class: "skeleton-line" }, ml = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", hl, [
      ue(t.$slots, "default", {}, void 0, !0),
      g("span", {
        class: Z(["bars", { faded: e.filled }])
      }, [
        (c(!0), h(K, null, ee(e.bars, (s) => (c(), h("span", {
          key: s.width,
          class: Z(["bar", { still: e.still }]),
          style: me({ width: s.width, height: `${s.height}px`, borderRadius: `${s.height / 2}px` })
        }, null, 6))), 128))
      ], 2)
    ]));
  }
}, pt = /* @__PURE__ */ Y(ml, [["__scopeId", "data-v-0ebb6933"]]), qt = el({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== tl);
      return s.length !== 1 ? pa(K, { key: n }, s) : s[0].key == null ? nl(s[0], { key: n }) : s[0];
    };
  }
}), pl = ["aria-label"], gl = ["aria-label"], vl = ["aria-label"], yl = ["aria-label"], kl = ["aria-label"], wl = ["aria-label"], bl = ["aria-label"], xl = {
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
    return (l, d) => (c(), G(qt, { value: e.shape }, {
      messages: P(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(K, null, ee(t, (u) => g("div", {
            key: u.id,
            class: Z(["skeleton-message", { mine: u.mine }]),
            style: me({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 6)), 64))
        ], 8, pl)
      ]),
      older: P(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(t.slice(0, 3), (u) => (c(), h("div", {
            key: u.id,
            class: Z(["skeleton-message", { mine: u.mine }]),
            style: me({ width: `${u.width}%`, height: `${u.height}px` })
          }, null, 6))), 128))
        ], 8, gl)
      ]),
      cards: P(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (u) => (c(), h("div", {
            key: u,
            class: "skeleton-card"
          }, [
            (c(), h(K, null, ee(n, (f) => R(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, vl)
      ]),
      file: P(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (u) => (c(), h("div", {
            key: u,
            class: "skeleton-file"
          }, [
            R(pt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(K, null, ee(a, (f) => R(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, yl)
      ]),
      page: P(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          R(pt, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(K, null, ee(e.count, (u) => (c(), G(pt, {
            key: u,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, kl)
      ]),
      text: P(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (u) => (c(), G(pt, {
            key: u,
            bars: U(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, wl)
      ]),
      default: P(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, ee(e.count, (u) => (c(), G(pt, {
            key: u,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, bl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Ft = /* @__PURE__ */ Y(xl, [["__scopeId", "data-v-1392eacb"]]), $l = {
  key: 1,
  class: "empty-state titled"
}, Ml = { class: "empty-state-title" }, Sl = { class: "empty-state-text" }, _l = {
  key: 2,
  class: "empty-state"
}, El = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Ft, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", $l, [
      g("p", Ml, k(e.title), 1),
      g("p", Sl, [
        ue(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", _l, [
      ue(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, jn = /* @__PURE__ */ Y(El, [["__scopeId", "data-v-b27e89b0"]]), Al = { class: "fold-group" }, Cl = ["aria-expanded"], Ol = { class: "fold-label" }, Tl = {
  key: 0,
  class: "fold-count"
}, Il = {
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
    return (s, a) => (c(), h("div", Al, [
      g("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        g("span", Ol, k(e.label), 1),
        e.count !== "" ? (c(), h("span", Tl, k(e.count), 1)) : E("", !0),
        g("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Cl),
      e.open ? ue(s.$slots, "default", {}, void 0, !0, 0) : E("", !0)
    ]));
  }
}, Ub = /* @__PURE__ */ Y(Il, [["__scopeId", "data-v-9ef1865c"]]), Rl = Symbol("open-view"), Ae = Symbol.for("journal.window-context");
function Wt() {
  const e = _e(Ae, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Bl = ["stroke-width", "innerHTML"], ge = {
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
    }, null, 12, Bl));
  }
}, Ll = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: me({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Nl = /* @__PURE__ */ Y(Ll, [["__scopeId", "data-v-eb453d6f"]]), Dl = 120, Pl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Kn(), s = N(() => Object.fromEntries(Object.entries(n).filter(([d]) => d !== "onClick"))), a = O(!1), o = N(() => t.busy || a.value), r = _e(Ae, null), i = N(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(d) {
      const u = [n.onClick].flat().filter(Boolean).map((m) => m(d)).filter((m) => m instanceof Promise);
      if (!u.length) return;
      const f = setTimeout(() => a.value = !0, Dl);
      try {
        await Promise.all(u);
      } finally {
        clearTimeout(f), a.value = !1;
      }
    }
    return (d, u) => (c(), G(Mt(e.href ? "a" : "button"), nt(s.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: l
    }), {
      default: P(() => [
        g("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), G(ge, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : E("", !0),
          ue(d.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), G(Nl, {
          key: 0,
          class: "btn-spinner"
        })) : E("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), he = /* @__PURE__ */ Y(Pl, [["__scopeId", "data-v-033d70ca"]]), jl = (e, t, n) => Math.max(t, Math.min(n, e)), ql = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Jo = /* @__PURE__ */ new WeakMap(), Fl = (e, t) => Jo.set(e, t);
function Wl(e, t) {
  for (let n = t; n; n = Jo.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Zo(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !Wl(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const Ct = 8, Hl = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = O(null), o = (p) => p ? `${p}px` : void 0, r = N(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), i = O({ w: 0, h: 0 }), l = O(s.anchor ? s.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), u = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), f = (p) => {
      const B = p.closest(".pane, .float-window");
      return B ? u(B.getBoundingClientRect()) : d();
    }, m = (p, B) => `${Math.max(0, p ? Math.min(p, B) : B)}px`;
    function v(p, B) {
      return {
        below: p.bottom - B.bottom - s.gap - Ct,
        above: B.top - p.top - s.gap - Ct,
        across: p.right - p.left - 2 * Ct
      };
    }
    function $(p) {
      const B = f(s.anchor), j = v(B, p);
      return i.value.w <= j.across && i.value.h <= Math.max(j.below, j.above) ? B : d();
    }
    const M = N(() => {
      if (!l.value) return r.value;
      const p = l.value, B = $(p), j = v(B, p), { w: D, h: J } = i.value, V = s.align === "auto" ? p.left + p.right > B.left + B.right : s.align === "right", ce = jl(V ? p.right - D : p.left, B.left + Ct, Math.max(B.left + Ct, B.right - D - Ct)), ke = J > j.below && j.above > j.below ? { bottom: `${window.innerHeight - p.top + s.gap}px`, maxHeight: m(s.maxHeight, j.above) } : { top: `${p.bottom + s.gap}px`, maxHeight: m(s.maxHeight, j.below) };
      return { ...r.value, ...ke, left: `${ce}px`, maxWidth: m(s.maxWidth, j.across) };
    }), _ = n, I = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function W(p) {
      const B = I(), j = B.indexOf(document.activeElement);
      B[(j + p + B.length) % B.length].focus();
    }
    const Q = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => _("close") }, A = (p) => Q[p.key] && (p.preventDefault(), Q[p.key]()), x = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let C = 0;
    const y = new ResizeObserver(() => {
      cancelAnimationFrame(C), C = requestAnimationFrame(x);
    });
    Zo(a, (p) => s.anchor && !s.anchor.contains(p.target) && _("close"));
    const T = (p, B) => ["top", "left", "right", "bottom"].some((j) => Math.abs(p[j] - B[j]) > 1), w = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let S = 0;
    function b() {
      if (s.anchor) {
        const p = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || w(p)) return _("close");
        T(p, l.value) && (l.value = p);
      }
      S = requestAnimationFrame(b);
    }
    return Ne(() => {
      s.anchor && a.value && Fl(a.value, s.anchor), x(), a.value && y.observe(a.value), !s.plain && I()[0] && I()[0].focus(), b();
    }), Te(() => {
      y.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(C);
    }), t({ element: a }), (p, B) => (c(), G(ga, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", nt({
        ref_key: "panel",
        ref: a
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: M.value,
        onKeydown: A
      }), [
        ue(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Yn = /* @__PURE__ */ Y(Hl, [["__scopeId", "data-v-3d203970"]]), Ul = { class: "split-button" }, zl = {
  __name: "SplitButton",
  props: { kind: { type: String, default: "ghost" }, small: Boolean, disabled: Boolean, menuLabel: { type: String, default: "More ways" } },
  emits: ["main"],
  setup(e, { emit: t }) {
    const n = t, s = O(null), a = O(!1), o = () => a.value = !1;
    return (r, i) => (c(), h("span", Ul, [
      R(he, {
        kind: e.kind,
        small: e.small,
        disabled: e.disabled,
        class: "split-button-main",
        onClick: i[0] || (i[0] = (l) => n("main"))
      }, {
        default: P(() => [
          ue(r.$slots, "default", {}, void 0, !0)
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
            R(ge, { name: "caret" })
          ]),
          _: 1
        }, 8, ["kind", "small", "disabled", "aria-label", "title", "aria-expanded"])
      ], 512),
      a.value ? (c(), G(Yn, {
        key: 0,
        anchor: s.value,
        "min-width": 220,
        align: "right",
        onClose: o
      }, {
        default: P(() => [
          ue(r.$slots, "menu", { close: o }, void 0, !0)
        ]),
        _: 3
      }, 8, ["anchor"])) : E("", !0)
    ]));
  }
}, Vl = /* @__PURE__ */ Y(zl, [["__scopeId", "data-v-ef04170d"]]), Gl = ["aria-checked", "aria-haspopup", "onClick"], Kl = {
  key: 0,
  class: "segmented-dot"
}, Yl = {
  key: 1,
  class: "segmented-count"
}, Jl = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = va();
    return (a, o) => {
      const r = sl("tip");
      return c(), h("span", {
        class: Z(["segmented", { fill: e.fill, wrap: e.wrap }]),
        role: "radiogroup"
      }, [
        (c(!0), h(K, null, ee(e.options, (i) => ft((c(), h("button", {
          key: i.key,
          type: "button",
          role: "radio",
          "aria-checked": i.key === e.value,
          "aria-haspopup": i.opens,
          class: Z(["segmented-option", { on: i.key === e.value }]),
          onClick: (l) => n("pick", i.key)
        }, [
          i.dot ? (c(), h("span", Kl)) : E("", !0),
          se(" " + k(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", Yl, k(i.count), 1)) : E("", !0)
        ], 10, Gl)), [
          [r, i.tip || i.title, `${U(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Jn = /* @__PURE__ */ Y(Jl, [["__scopeId", "data-v-ca953072"]]), Zn = typeof document < "u" && document.documentElement.classList.contains("phone"), Zl = "Files are attached on the computer; the phone sends text.";
function Xl() {
  return () => {
  };
}
function Ws(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function Xo(e = window) {
  if (!Ws(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    Ws(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const Hs = "journal.stale-build-reload", Ql = 'script[type="module"][src*="/assets/index-"]', Ua = (e) => {
  var t;
  return ((t = e.querySelector(Ql)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function ec(e = document, t = fetch, n = () => Xo(window)) {
  const s = Ua(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = Ua(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let us = "";
function tc(e, t = () => Xo(window)) {
  if (!e) return !1;
  const n = !!us && us !== e;
  return us = e, n && t(), n;
}
const nc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function sc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(Hs) === e.message) return !1;
    t.setItem(Hs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function ac(e = window.sessionStorage) {
  try {
    e.removeItem(Hs);
  } catch {
    return;
  }
}
const oc = 2e3, rc = 3e4, ze = ya({ starting: !1, external: !1, late: !1, offline: !1 }), ka = () => ze.starting, ic = 3;
let $n = 0, Us = 0, Qo = 0, er = [];
async function lc() {
  try {
    const e = await Le.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function cc() {
  clearInterval(Us), clearTimeout(Qo), Us = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), er.splice(0).forEach((e) => e()), ec();
}
let ds = !1;
async function uc() {
  if (ze.offline = !navigator.onLine, ds) return;
  ds = !0;
  const e = await lc();
  if (ds = !1, ze.external = e.updating, $n = !e.restarting && !e.updating && e.reachable ? $n + 1 : 0, $n < ic) return;
  $n = 0, (!tc(e.started_at) || Ws()) && cc();
}
function za() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, Us = setInterval(uc, oc), Qo = setTimeout(() => ze.late = !0, rc));
}
const dc = () => ze.starting ? new Promise((e) => er.push(e)) : Promise.resolve(), Va = 2e4, fc = 3e5, Ye = 6e5, Mn = 6, hc = 500, mc = "/journal/summary", pc = "/api/server-state", gc = 2e4, Ga = Zn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, vc = (e) => e.split("?")[0].endsWith(mc), tr = (e, t) => Object.assign(new Error(t), { status: e });
async function yc(e, t, n = tr) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const kc = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class wc {
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
        headers: { ...Ga, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: kc(s),
        signal: AbortSignal.timeout(a || (i ? fc : Va))
      });
    } catch (l) {
      if (l instanceof TypeError && za(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((d) => setTimeout(d, hc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = Mn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Xl(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return yc(l, `${l.status} ${l.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ga, signal: AbortSignal.timeout(Va) });
    if (!n.ok) throw tr(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, Mn, o).then((l) => (this.written(n), l));
    if (ka() && !vc(n))
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
    return fetch(pc, { cache: "no-store", signal: AbortSignal.timeout(gc) });
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
const Le = new wc(), bc = 0, xc = "/api/lines", $c = "/api/line";
class Mc {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), bc));
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
        const n = await Le.raw(xc, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await Le.raw($c, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const Sc = new Mc(), _c = 150;
function nr(e, t, n = _c, s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
class Ec {
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
      n.patterns.some((s) => sr(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function sr(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const ar = /* @__PURE__ */ new Map();
class Ac {
  constructor(t, n) {
    this.environment = t, this.prompts = n, this.offers = Bt({ buttons: [], missing: {} }), this.problem = Bt(""), this.pending = null;
  }
  load() {
    return this.pending ? this.pending : (this.pending = this.read().then((t) => (this.offers.value = t, this.problem.value = "", t)).catch((t) => {
      throw this.problem.value = t.message, t;
    }).finally(() => {
      this.pending = null;
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
function zb(e, t) {
  const n = new Ac(e, t);
  return ar.set(e, n), n.load().catch(() => {
  }), n;
}
const or = (e) => ar.get(e);
function Cc(e, t, n) {
  const s = or(e);
  return s ? s.offers.value.buttons.filter((a) => a.slots.includes(t)).filter((a) => n || !a.runs.includes("{row_id}")).filter((a) => !a.condition || !n || !Object.hasOwn(n, a.condition.field) || a.condition.values.includes(n[a.condition.field])).map((a) => ({ ...a, menu: a.menu.filter((o) => n || !o.runs.includes("{row_id}")) })).sort((a, o) => +!!a.from - +!!o.from) : [];
}
async function Oc(e, t) {
  if (!e) return !0;
  const n = or(t);
  if (!n) throw new Error("Button permissions are not ready.");
  return n.allowed(e);
}
const Tc = Symbol("pane-page"), Ic = { 1: "refused", 2: "usage", 3: "fault" }, Rc = 100, Bc = 50, Lc = /(?:[^\s"'\\]|\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'[^']*')+/g, Nc = /'([^']*)'|"((?:\\[\s\S]|[^"\\])*)"|\\([\s\S])/g;
function Dc({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = O({}), declared: d = [], page: u = null, setOption: f = () => {
}, autoScroll: m = "", tabs: v = [], sources: $ = [], links: M = {}, search: _ = {}, readOnly: I = !1, shared: W = null }) {
  const Q = /* @__PURE__ */ new Map(), A = new AbortController(), x = O(!1), C = performance.now();
  let y = 0, T = 0;
  const w = () => {
    clearTimeout(T), T = setTimeout(() => {
      y === 0 && nr(C, () => x.value = !0);
    }, Bc);
  }, S = (b) => {
    const p = Q.get(b);
    if (p && performance.now() - p.at < Rc) return p.answer;
    y += 1;
    const B = ir(e, b, t, A.signal).finally(() => {
      y -= 1, w();
    });
    return Q.set(b, { answer: B, at: performance.now() }), B;
  };
  return {
    answered: x,
    settle: w,
    window: e,
    environment: t,
    agent: n,
    page: u,
    visible: N(() => s()),
    permissions: a,
    autoScroll: m,
    tabs: v,
    sources: $,
    links: M,
    search: _,
    readOnly: I,
    shared: W,
    read: S,
    run: (b) => Lt(e, b, t, A.signal),
    upload: (b) => jc(b, A.signal),
    cancel: () => A.abort(),
    subscriptions: r,
    follow: (b, p) => r.follow(e, b.filter((B) => o.some((j) => sr(j, B))), p, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (b) => N(() => {
      var p;
      return l.value[b] ?? ((p = d.find((B) => B.key === b)) == null ? void 0 : p.default);
    }),
    setting: async (b, p) => {
      const B = await S(`window setting ${e} ${b}`);
      return B.ok ? B.value.value : p;
    },
    setOption: f,
    keep: (b, p) => Lt(e, ["window", "save-setting", e, b, JSON.stringify(p)], t, A.signal)
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
const nn = { ok: !1, failure: "cancelled", error: "" }, rr = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function Lt(e, t, n, s = void 0) {
  try {
    const a = await Sc.add({ window: e, line: Array.isArray(t) ? t : lr(t), environment: n }, s);
    return s != null && s.aborted ? nn : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: Ic[a.code] || "fault", error: Pc(a.error) };
  } catch {
    return s != null && s.aborted ? nn : { ok: !1, failure: "unreachable", error: rr };
  }
}
async function ir(e, t, n, s) {
  const a = await Lt(e, t, n, s);
  return a.failure !== "unreachable" || !ka() ? a : (await dc(), s.aborted ? nn : ir(e, t, n, s));
}
async function jc(e, t = void 0) {
  try {
    const n = await Le.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? nn : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? nn : { ok: !1, failure: "unreachable", error: rr };
  }
}
function lr(e) {
  return [...e.matchAll(Lc)].map(([t]) => t.replace(Nc, (n, s, a, o) => s ?? (a === void 0 ? o : a.replace(/\\(["\\])/g, "$1"))));
}
const qc = (e) => `show-${e}`, Vb = (e, t, n) => e.filter((s) => {
  var a;
  return n(qc((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), cr = "messages.chat", Fc = {
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
    const n = e, s = t, a = O([]), o = O(""), r = N(() => a.value.map((d) => ({ key: String(d.id), label: d.module ? `${d.title} · ${d.module}` : d.title }))), i = N(() => a.value.find((d) => String(d.id) === n.value));
    async function l() {
      const d = await Lt(cr, ["template", "list", "--target", n.field.target, "--purpose", n.field.purpose], n.environment);
      if (!d.ok) {
        o.value = d.error;
        return;
      }
      a.value = d.value.rows;
      const u = n.field.default_title || (n.field.purpose === "critique" ? "General critique" : ""), f = a.value.find((m) => m.title === u);
      f && s("pick", String(f.id));
    }
    return l(), (d, u) => (c(), h(K, null, [
      R(Jn, {
        options: r.value,
        value: e.value,
        wrap: "",
        onPick: u[0] || (u[0] = (f) => s("pick", f))
      }, null, 8, ["options", "value"]),
      i.value ? (c(), h("p", Fc, k(i.value.brief), 1)) : E("", !0),
      o.value ? (c(), h("p", Wc, k(o.value), 1)) : E("", !0)
    ], 64));
  }
}, Uc = /* @__PURE__ */ Y(Hc, [["__scopeId", "data-v-8cbacb6d"]]), zc = { class: "form-field" }, Vc = { class: "form-field-head" }, Gc = ["for"], Kc = {
  key: 0,
  class: "form-field-aside"
}, Yc = {
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
    return (t, n) => (c(), h("div", zc, [
      g("div", Vc, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, k(e.label), 9, Gc),
        t.$slots.aside ? (c(), h("span", Kc, [
          ue(t.$slots, "aside", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      ue(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", Yc, k(e.help), 1)) : E("", !0)
    ]));
  }
}, Zc = /* @__PURE__ */ Y(Jc, [["__scopeId", "data-v-dd7cdcff"]]), zs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Xc = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Kn(), n = N(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => ft((c(), h("textarea", nt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(zs), U(t).value]
    ]);
  }
}), Qc = /* @__PURE__ */ Y(Xc, [["__scopeId", "data-v-e130a5b9"]]), eu = {
  __name: "ButtonField",
  props: { field: { type: Object, required: !0 }, value: { type: String, required: !0 }, environment: { type: String, required: !0 } },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = va(), o = N(() => n.field.choices ? "choice" : n.field.target ? "template" : "text");
    return (r, i) => (c(), G(Zc, {
      label: e.field.label,
      for: U(a),
      "data-button-field": e.field.name
    }, {
      default: P(() => [
        R(qt, { value: o.value }, {
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
            R(Uc, {
              field: e.field,
              value: e.value,
              environment: e.environment,
              onPick: i[1] || (i[1] = (l) => s("pick", l))
            }, null, 8, ["field", "value", "environment"])
          ]),
          text: P(() => [
            R(Qc, {
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
    return (t, n) => (c(), G(he, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: P(() => [
        R(ge, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
};
function tu(e, t, n, s = () => window) {
  Ne(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Te(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const nu = (e, t = () => !0) => tu("keydown", (n) => n.key === "Escape" && t() && e());
function ur(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = O(!1), a = N(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return nu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const su = 80, Ot = ya([]);
function dr(e) {
  const t = Symbol("layer"), n = () => Ot.includes(t) && Ot.splice(Ot.indexOf(t), 1);
  return ve(
    e,
    (s) => {
      s && !Ot.includes(t) && Ot.push(t), s || n();
    },
    { immediate: !0 }
  ), Te(n), N(() => su + Math.max(0, Ot.indexOf(t)));
}
let fr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return fr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const au = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ou(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(au)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Ne(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : fr, document.addEventListener("keydown", a), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const ru = ["aria-modal", "aria-label", "aria-labelledby"], iu = {
  key: 0,
  class: "dialog-head"
}, lu = ["id", "tabindex"], cu = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = ur(s, n), i = dr(a), l = O(null), d = O(null), u = O(null), f = va(), m = O(!1), v = Date.now();
    n.modal && ou(d, () => s("escape"), u);
    function $() {
      if (!n.modal) return n.closable && o();
      m.value = !0, setTimeout(() => m.value = !1, du);
    }
    function M(W) {
      !n.modal || Date.now() - v >= uu || ![" ", "Enter"].includes(W.key) || (W.preventDefault(), W.stopPropagation());
    }
    const _ = () => l.value && (l.value.scrollTop = l.value.scrollHeight), I = new MutationObserver(_);
    return ve(l, (W) => {
      I.disconnect(), W && n.follow && (I.observe(W, { childList: !0, subtree: !0, characterData: !0 }), _());
    }), Te(() => I.disconnect()), (W, Q) => (c(), G(ga, { to: "body" }, [
      R(Pt, {
        name: "dialog",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: P(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: me({ zIndex: U(i) }),
            onClick: be($, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: d,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: m.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? U(f) : void 0,
              onKeydownCapture: M
            }, [
              e.bare ? E("", !0) : (c(), h("header", iu, [
                g("h3", {
                  id: U(f),
                  ref_key: "heading",
                  ref: u,
                  tabindex: e.modal ? -1 : void 0
                }, k(e.title), 9, lu),
                e.closable ? (c(), G(Xn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : E("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: l,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                ue(W.$slots, "default", {}, void 0, !0)
              ], 2),
              W.$slots.foot ? (c(), h("footer", cu, [
                ue(W.$slots, "foot", {}, void 0, !0)
              ])) : E("", !0)
            ], 42, ru)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, hr = /* @__PURE__ */ Y(fu, [["__scopeId", "data-v-6d1ecd98"]]), hu = (e, t, n = {}) => lr(e.runs).map((s) => s.replace(/\{(\w+)\}/g, (a, o) => o === "row_id" ? String((t == null ? void 0 : t.id) ?? "") : n[o]));
async function hn(e, t, n, s = {}) {
  try {
    return await Oc(e.module, n) ? Lt(cr, hu(e, t, s), n) : { ok: !1, error: "" };
  } catch (a) {
    return { ok: !1, error: a.message };
  }
}
const mu = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, fs = [
  { key: "open", title: "Open", shows: "open" },
  { key: "closed", title: "Closed", shows: "closed" }
], pe = (e, t, n, s = {}) => ({
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
}), mn = {
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
    filters: fs
  }),
  tasks: pe("Task", "ring", "A unit of work tracked from creation to completion", {
    in_sidebar: !0,
    listed_under: "sidebar",
    takes_comments: !0,
    created_in_viewer: !0,
    start_as_count: !0,
    labels: { outcome: "How" },
    filters: fs
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
  pins: pe("Pin", "band", "One line pinned to the chat while it matters", { filters: fs }),
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
}, pu = ["secrets", "plugins"], mr = Object.keys(mn).filter((e) => !(Zn && pu.includes(e)));
N(() => mr.map((e) => ({ name: e, ...mn[e] })));
const Ht = (e) => mn[e], pr = new Map(mr.flatMap((e) => [e, e.replace(/s$/, ""), mn[e].title.toLowerCase()].map((t) => [t, e]))), et = (e) => pr.get(String(e).toLowerCase()) || "", gr = [...pr.keys()].sort((e, t) => t.length - e.length).join("|"), gu = {
  class: "button-form",
  "data-button-form": ""
}, vu = {
  key: 0,
  class: "button-form-title"
}, yu = {
  key: 1,
  class: "button-form-failure",
  role: "alert"
}, ku = { class: "button-form-actions" }, wu = {
  __name: "ButtonForm",
  props: { button: { type: Object, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 } },
  emits: ["close", "done"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(Object.fromEntries(n.button.fields.map((u) => [u.name, u.default || ""]))), o = O(!1), r = O(""), i = N(() => n.button.fields.every((u) => a.value[u.name].trim().length > 0)), l = N(() => {
      var f;
      if (!n.row) return n.button.label;
      const u = ((f = Ht(et(n.row.kind))) == null ? void 0 : f.title) || "Item";
      return `${n.button.label} · ${u} ${n.row.id}`;
    });
    async function d() {
      if (o.value || !i.value) return;
      o.value = !0;
      const u = await hn(n.button, n.row, n.environment, a.value);
      o.value = !1, r.value = u.ok ? "" : u.error, u.ok && (s("done"), s("close"));
    }
    return (u, f) => (c(), G(hr, {
      title: l.value,
      fits: "",
      small: "",
      sheet: "",
      onClose: f[1] || (f[1] = (m) => s("close"))
    }, {
      default: P(() => {
        var m;
        return [
          g("div", gu, [
            (m = e.row) != null && m.title ? (c(), h("p", vu, k(e.row.title), 1)) : E("", !0),
            (c(!0), h(K, null, ee(e.button.fields, (v) => (c(), G(eu, {
              key: v.name,
              field: v,
              value: a.value[v.name],
              environment: e.environment,
              onPick: ($) => a.value[v.name] = $
            }, null, 8, ["field", "value", "environment", "onPick"]))), 128)),
            r.value ? (c(), h("p", yu, k(r.value), 1)) : E("", !0),
            g("div", ku, [
              R(he, {
                small: "",
                onClick: f[0] || (f[0] = (v) => s("close"))
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
                onClick: d
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
}, bu = /* @__PURE__ */ Y(wu, [["__scopeId", "data-v-879955be"]]), xu = {
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
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", xu, k(e.checked ? "✓" : ""), 1)) : E("", !0),
      e.description ? (c(), h("span", $u, [
        g("span", null, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, k(e.description), 1)
      ])) : ue(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, xt = /* @__PURE__ */ Y(Mu, [["__scopeId", "data-v-fec99974"]]), Su = { class: "button-slot" }, _u = {
  key: 0,
  class: "button-slot-failure",
  role: "alert"
}, Eu = {
  __name: "ButtonSlot",
  props: { name: { type: String, required: !0 }, row: { type: Object, default: null }, environment: { type: String, required: !0 }, readOnly: Boolean },
  emits: ["done"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => n.readOnly ? [] : Cc(n.environment, n.name, n.row)), o = O(null), r = O(""), i = O(!1), l = (u) => [u.from ? `From ${u.from}` : "", u.tip].filter(Boolean).join(" · ");
    async function d(u) {
      if (i.value || n.readOnly) return;
      if (u.fields.length) {
        o.value = u;
        return;
      }
      i.value = !0;
      const f = await hn(u, n.row, n.environment);
      i.value = !1, r.value = f.ok ? "" : f.error, f.ok && s("done");
    }
    return (u, f) => (c(), h("span", Su, [
      (c(!0), h(K, null, ee(a.value, (m) => (c(), h(K, {
        key: m.name
      }, [
        m.menu.length ? (c(), G(Vl, {
          key: 0,
          small: "",
          kind: m.primary ? "primary" : "ghost",
          disabled: i.value,
          "menu-label": m.menu_label || "More ways",
          title: l(m),
          "data-button": m.name,
          onMain: (v) => d(m)
        }, {
          menu: P(({ close: v }) => [
            (c(!0), h(K, null, ee(m.menu, ($) => (c(), G(xt, {
              key: $.label,
              description: $.description,
              onClick: (M) => (v(), d({ ...m, ...$, menu: [] }))
            }, {
              default: P(() => [
                se(k($.label), 1)
              ]),
              _: 2
            }, 1032, ["description", "onClick"]))), 128))
          ]),
          default: P(() => [
            se(k(m.label) + " ", 1)
          ]),
          _: 2
        }, 1032, ["kind", "disabled", "menu-label", "title", "data-button", "onMain"])) : (c(), G(he, {
          key: 1,
          small: "",
          kind: m.primary ? "primary" : "ghost",
          icon: m.icon,
          disabled: i.value,
          title: l(m),
          "data-button": m.name,
          onClick: (v) => d(m)
        }, {
          default: P(() => [
            se(k(m.label), 1)
          ]),
          _: 2
        }, 1032, ["kind", "icon", "disabled", "title", "data-button", "onClick"]))
      ], 64))), 128)),
      r.value && !e.readOnly ? (c(), h("span", _u, k(r.value), 1)) : E("", !0),
      o.value && !e.readOnly ? (c(), G(bu, {
        key: o.value.runs,
        button: o.value,
        row: e.row,
        environment: e.environment,
        onClose: f[0] || (f[0] = (m) => o.value = null),
        onDone: f[1] || (f[1] = (m) => s("done"))
      }, null, 8, ["button", "row", "environment"])) : E("", !0)
    ]));
  }
}, Au = /* @__PURE__ */ Y(Eu, [["__scopeId", "data-v-efea084d"]]), Cu = {
  class: "running",
  "data-running-command": ""
}, Ou = ["title"], Tu = {
  key: "idle",
  class: "running-idle"
}, Iu = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Cu, [
      R(Pt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: P(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, k(e.text), 9, Ou)) : (c(), h("span", Tu, k(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Gb = /* @__PURE__ */ Y(Iu, [["__scopeId", "data-v-d3240219"]]), Ru = ["aria-checked", "aria-label", "title"], Bu = {
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
    return (s, a) => (c(), h("button", {
      type: "button",
      class: Z(["switch-button", { framed: e.framed }]),
      role: "switch",
      "aria-checked": e.on ? "true" : "false",
      "aria-label": e.title,
      title: e.beside ? "" : e.title,
      onClick: a[0] || (a[0] = (o) => n("change", !e.on))
    }, [
      g("span", {
        class: Z(["switch", { on: e.on, labelled: e.labelled, large: e.large }])
      }, [
        e.labelled ? (c(), h("span", Bu, k(e.word), 1)) : E("", !0),
        a[1] || (a[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Lu, k(e.word), 1)) : E("", !0)
    ], 10, Ru));
  }
}, Kb = /* @__PURE__ */ Y(Nu, [["__scopeId", "data-v-1bfb90f3"]]);
function vr(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function sn(e, t) {
  return vr(() => localStorage, e, t);
}
function yr(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Qn(e, t) {
  return yr(() => localStorage, e, t);
}
function kr(e, t) {
  ve(t, (n) => Qn(e, n), { deep: !0 });
}
function Du(e, t) {
  return vr(() => sessionStorage, e, t);
}
function Pu(e, t) {
  return yr(() => sessionStorage, e, t);
}
const qn = "journal.environment", wr = O(Du(qn, sn(qn, "")));
function ju(e) {
  wr.value = e, Pu(qn, e), Qn(qn, e);
}
const Fn = O(location.hash), Ka = Bt(null), Ya = { integrations: "mcp", library: "team" };
function qu() {
  if (!Ka.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ya[n]) {
    location.replace(`#/${[Ya[n], ...s].join("/")}${t ? `?${t}` : ""}`), Fn.value = location.hash;
    return;
  }
  !n || Ka.value(n) || (ju(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), Fn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  Fn.value = location.hash, qu();
});
const Xe = N(() => {
  const [e, t = ""] = Fn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [d = "", u = "", f = ""] = i.split(":");
    return { table: d, id: Number(u), comment: Number(f) || 0, env: l };
  });
  return {
    env: wr.value,
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
function Fu(e = "", t = 0, n = "") {
  location.hash = es.page(e, t, n);
}
const Wu = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function br(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Wu).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const It = {};
function Yb(e, t) {
  return It[e] = t, () => It[e] === t && delete It[e];
}
function xr(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = It[e]) != null && r.call(It, t))) return;
  const a = Xe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  br([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Hu(e, t, n, s = 0, a = "") {
  if (e === Xe.value.env) return xr(t, n, s, a);
  const o = Xe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  br([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Fe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Hu(s, a, Number(o), 0, t) : xr(a, Number(o), 0, t);
}
function Uu(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Tt(e) {
  const t = Uu(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const zu = {
  key: 1,
  class: "row-list-failure"
}, Vu = ["data-row"], Gu = {
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
    const t = e, n = N(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = O(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), G(Ft, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", zu, k(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(jn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: P(() => [
        se(k(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(K, { key: 3 }, [
      (c(), G(Mt(e.arrival ? Go : "ul"), nt(n.value, { class: "row-list" }), {
        default: P(() => [
          (c(!0), h(K, null, ee(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            ue(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, Vu))), 128))
        ]),
        _: 3
      }, 16)),
      e.older && e.more && !s.value && e.rows.length ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "row-list-more",
        "data-row-list-more": "",
        onClick: r[0] || (r[0] = (i) => a(e.older))
      }, "Show more")) : E("", !0)
    ], 64));
  }
}, Ku = /* @__PURE__ */ Y(Gu, [["__scopeId", "data-v-aa6ad7ff"]]), Yu = {
  class: "agent-rows",
  "data-agent-rows": ""
}, Ju = {
  key: 1,
  class: "agent-rows-note"
}, Zu = {
  key: 2,
  class: "agent-rows-note"
}, Xu = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, Qu = ["data-agent-row", "onClick"], ed = { class: "agent-row-name" }, td = { class: "agent-row-state" }, nd = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = N(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = N(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", Yu, [
      e.loaded ? e.failure ? (c(), h("p", Ju, k(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        g("p", Xu, k(s.value) + " running", 1),
        (c(!0), h(K, null, ee(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => U(Fe)(`agents:${r.id}`)
        }, [
          g("span", ed, "#" + k(r.id) + " " + k(r.session), 1),
          g("span", td, k(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, Qu))), 128))
      ], 64)) : (c(), h("p", Zu, k(e.none), 1)) : (c(), G(Ft, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Jb = /* @__PURE__ */ Y(nd, [["__scopeId", "data-v-a01e5a17"]]), sd = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, k(e.text), 3));
  }
}, $r = /* @__PURE__ */ Y(sd, [["__scopeId", "data-v-9e7e1157"]]), ad = ["aria-valuenow", "aria-valuemax"], od = {
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
      g("span", {
        class: "fill",
        style: me({ width: n.value })
      }, null, 4)
    ], 10, ad));
  }
}, rd = /* @__PURE__ */ Y(od, [["__scopeId", "data-v-9eba6a85"]]), id = { class: "bars" }, ld = { class: "bar-name" }, cd = { class: "bar-value" }, ud = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = N(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", id, [
      (c(!0), h(K, null, ee(e.items, (l, d) => (c(), G(Mt(l.open ? "button" : "div"), {
        key: `${d}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: Z(["bar-row", l.tone, { opens: l.open }]),
        onClick: (u) => l.open && s("open", l.open)
      }, {
        default: P(() => [
          g("span", ld, k(l.label), 1),
          R(rd, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", cd, k(l.value) + k(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, dd = /* @__PURE__ */ Y(ud, [["__scopeId", "data-v-663427f4"]]), fd = { class: "bars" }, hd = {
  key: 0,
  class: "bars-title"
}, md = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", fd, [
      e.node.title ? (c(), h("span", hd, k(e.node.title), 1)) : E("", !0),
      R(dd, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, pd = /* @__PURE__ */ Y(md, [["__scopeId", "data-v-7135bb11"]]), gd = {
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
      style: me(o.value)
    }, [
      (c(!0), h(K, null, ee(e.node.children || [], (l, d) => (c(), G(Jr, {
        key: d,
        node: l,
        onOpen: i[0] || (i[0] = (u) => a("open", u)),
        onFile: i[1] || (i[1] = (u) => a("file", u))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Rn = /* @__PURE__ */ Y(gd, [["__scopeId", "data-v-d142a3f4"]]), vd = {
  key: 0,
  class: "card-head"
}, yd = { class: "card-title" }, kd = {
  key: 0,
  class: "card-note"
}, wd = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", vd, [
        g("span", yd, k(e.node.title), 1),
        e.node.note ? (c(), h("span", kd, k(e.node.note), 1)) : E("", !0)
      ])) : E("", !0),
      R(Rn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, bd = /* @__PURE__ */ Y(wd, [["__scopeId", "data-v-67b72d40"]]), Ja = (e) => [...new Set(e.agents.map((t) => t.name))], Zb = (e) => Ja(e).length === 1 ? `Worker: ${Ja(e)[0]}` : "Delegated", xd = (e) => "task_ids" in e, Mr = 1024, $d = Mr * 1024 * 1024, Md = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Mr} MB limit for one file.`, Be = (e) => encodeURIComponent(e);
function de(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const zt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Vt = "the page does not know its environment yet", Sd = "X-Journal-Env", _d = "X-Journal-Request-At", hs = "/viewer/voices/figures/";
class wa {
  constructor({ env: t = () => Xe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new wa({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [_d]: String(Date.now()), ...this.env() ? { [Sd]: this.env() } : {} };
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
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: d = !1 } = {}) {
    const u = this.here(`/${t}${de({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: d ? "1" : "" })}`);
    return this.get(u, `${t}.${zt({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: d })}`);
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
    if (Zn) return Promise.reject(Object.assign(new Error(Zl), { status: 403 }));
    if (s.size > $d) return Promise.reject(new Error(Md(s)));
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
const Ve = new wa({ base: Zn ? "/p" : "" }), Ed = (e) => Le.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Za = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), Ad = 6e4, Cd = 4, Od = 300, Td = 5e3, Sr = /* @__PURE__ */ new Map();
function ts(e) {
  if (!(e in Za)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Za[e];
}
function Id(e) {
  const t = ts(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Td;
  }
}
const Rd = (e) => e / 2 + Math.random() * e / 2, _r = (e) => [...e.users.values()].pop(), ba = (e) => Sr.get(e.place) === e, Bd = () => Math.random() * Od, xa = () => document.hidden;
function Ld(e) {
  const t = Id(e);
  return e.failures ? Rd(Math.min(Ad, t * 2 ** e.failures)) : Math.max(t, Cd * e.took);
}
function Er(e, t) {
  clearTimeout(e.timer), !(!ba(e) || xa()) && (e.timer = setTimeout(() => Nd(e), t));
}
function Nd(e) {
  return ba(e) ? e.running ? (e.again = !0, e.running) : (e.running = qd(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const Dd = (e) => {
  var t, n;
  return !xa() && (((n = (t = ts(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && _r(e).active() && !ka();
};
async function Pd(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await Le.attemptOnce(() => ts(e.key).read(_r(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function jd(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = ts(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function qd(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      Dd(e) && jd(e, await Pd(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ba(e));
  Er(e, Ld(e));
}
const Fd = () => xa() || Sr.forEach((e) => Er(e, Bd()));
document.addEventListener("visibilitychange", Fd);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, Ar = (e) => `${e.table}:${e.id}`, Xa = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ms = 80;
function Qa(e) {
  return e.length <= ms ? e : `${e.slice(0, ms + 1).replace(/\s+\S*$/, "") || e.slice(0, ms)}…`;
}
const eo = {
  messages: (e) => Qa(Xa(e.text)),
  comments: (e) => Qa(Xa(e.text)),
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
}, Wd = (e) => (eo[e.table] ? eo[e.table](e) : e.title || "") || "", Hd = ["done", "cancelled"], Vs = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => Hd.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, Ud = (e) => Vs[e.table] ? Vs[e.table](e) : 0, Cr = (e) => Ud(e) > 0, zd = (e) => !!Vs[e], $t = (e) => Ee(e.created_at), $a = (e) => Ee(e.updated_at) || $t(e), Vd = 60, Gd = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - Vd, Kd = (e, t) => e.id > 0 && e.table === t.table && Gd(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), Ma = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => Kd(s, n))), Yd = { me: 1, people: [] }, ie = ya({
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
  people: Yd,
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
kr("journal.activity", () => ie.activity);
kr("journal.side.mini", () => ie.sideMini);
const Jd = 50, Or = 100, Zd = { messages: 25 }, He = (e) => Zd[e] || Jd;
function Xd(e, t) {
  if (e !== "messages") return Math.max(t.length - He(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === He(e)) return s;
  return 0;
}
const ht = /* @__PURE__ */ new Set(), Sa = O(0), pn = /* @__PURE__ */ new Set(), gn = /* @__PURE__ */ new Set(), it = /* @__PURE__ */ new Set(), Gs = /* @__PURE__ */ new Set(), Qd = /* @__PURE__ */ new Map(), ef = /* @__PURE__ */ new Map();
let Gt = !1, Kt = null;
const tf = (e, t) => e.id - t.id, nf = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, sf = { messages: nf }, Tr = (e) => sf[e] || tf;
function Ir(e) {
  return Sa.value, ht.has(e) || (ht.add(e), ie.booted && (!pn.has(e) || gn.has(e)) && queueMicrotask(() => _a([e], !1))), ie.rows[e] || [];
}
function af(e) {
  const t = ie.rows[e] || [], n = Xd(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ie.rows[e] = t.filter((a) => s.has(a) || zd(e) && !Cr(a)), ie.paging.size[e] = He(e), ie.paging.more[e] = !0;
}
const of = /* @__PURE__ */ new Set();
function rf() {
  ht.forEach(af), ht.clear(), Qd.clear(), ef.clear(), Sa.value += 1;
}
ve(() => `${Xe.value.env}/${Xe.value.page}/${Xe.value.open ? Xe.value.open.table : ""}`, rf);
ve(
  () => ie.booted,
  (e) => e && _a(
    [...ht].filter((t) => !pn.has(t)),
    !1
  )
);
const Ks = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !xd(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Rr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Ks(s) && !Ks(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Br(e, t) {
  pn.add(e), Sa.value += 1;
  const n = ie.rows[e] || [];
  ie.rows[e] = [...Rr(n, t.rows), ...Ma(n.filter((s) => s.id === 0), t.rows)], ie.paging.size[e] = ie.paging.size[e] || He(e), ie.paging.more[e] = !t.is_last_page;
}
async function lf(e) {
  const t = new Set((ie.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: He(e) });
  ns(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = Ma((ie.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Br(e, { ...n, rows: [...n.rows, ...a].sort(Tr(e)) }), ie.paging.size[e] = He(e), Lr.has(e) && await Nr(e), ie.rows[e];
}
const ns = (e, t) => ie.counts = { ...ie.counts, [e]: t };
async function cf(e) {
  const t = ie.rows[e] || [], n = Math.max(0, ...t.map($a)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: He(e), since: n, after: s });
  if (ns(e, a.counts), !a.is_last_page) return lf(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = Ma(t.filter((i) => !o.has(i.id)), a.rows).concat(Rr(t, a.rows));
  return ie.rows[e] = r.sort(Tr(e)), ie.paging.size[e] = ie.rows[e].length, ie.rows[e];
}
const ps = /* @__PURE__ */ new Set();
async function uf(e, t = !1) {
  e.forEach((n) => gn.delete(n)), e.forEach((n) => Gs.add(n));
  try {
    await vf(e, t);
  } finally {
    e.forEach((n) => Gs.delete(n));
  }
}
async function df(e) {
  const t = await Ve.list(e, { limit: He(e) });
  ns(e, t.counts), Br(e, t);
}
async function ff(e) {
  ns(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const Lr = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Nr(e) {
  const t = (ie.rows[e] || []).filter((a) => Ks(a) && (e !== "plans" || !Cr(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ie.rows[e] = (ie.rows[e] || []).map((a) => s.get(a.id) || a);
}
const hf = (e, t) => !pn.has(e) || t && (ie.paging.size[e] || He(e)) === He(e) && !of.has(e);
async function mf(e, t) {
  if (!ht.has(e)) return ff(e);
  const n = await (hf(e, t) ? df(e) : cf(e));
  return Lr.has(e) && await Nr(e), n;
}
async function Dr() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ie.settings) && (ie.settings = e);
}
async function pf() {
  const [e] = await Promise.all([Ve.entries(0, Or), Dr()]);
  wf([...sn(jr(), []), ...e]);
}
const gf = (e, t) => mf(e, t).then(
  () => null,
  () => e
);
async function vf(e, t) {
  const n = (await Promise.all(e.map((s) => gf(s, t)))).filter(Boolean);
  if (n.forEach((s) => (it.add(s), gn.add(s))), t && await pf(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Pr = 1e3, yf = 15e3;
let Sn = Pr;
async function kf() {
  return Kt || (Kt = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...it].some((e) => !ps.has(e)) || Gt; ) {
      const e = Gt, t = [...e ? Object.keys(ie.rows) : it].filter((s) => mn[s] && (ht.has(s) || s in ie.rows)).filter((s) => e || !ht.has(s) || gn.has(s) || !pn.has(s)).filter((s) => !ps.has(s)), n = [...it].filter((s) => ps.has(s));
      it.clear(), n.forEach((s) => it.add(s)), Gt = !1;
      try {
        await uf(t, e), Sn = Pr;
      } catch {
        Gt = Gt || e, await new Promise((a) => setTimeout(a, Sn)), Sn = Math.min(Sn * 2, yf);
      }
    }
  })().finally(() => Kt = null), Kt);
}
function _a(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Gs.has(n)).forEach((n) => {
    it.add(n), t && gn.add(n);
  }), it.delete("settings") && Dr(), kf();
}
const jr = () => {
  var e;
  return `typed-entries:${((e = ie.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function wf(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ie.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-Or), Qn(jr(), ie.entries.slice(-50));
}
Ed((e) => ie.streamOpen || _a([e]));
const Ys = [], bf = 2e3, rt = /* @__PURE__ */ new Map(), xf = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, $f = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function St(e, { first: t = !1 } = {}) {
  t ? Ys.unshift(e) : Ys.push(e), rt.clear();
}
function qr(e, t, n) {
  var a;
  const s = Ir(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const Mf = (e) => Ir(e.table).find((t) => t.id === e.id) === e.row, Sf = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function tt(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function _f(e, t) {
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
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Ef(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Ef(e) {
  return e.split($f).map((t, n) => n % 2 ? t : t.replace(xf, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function to(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Af(e) {
  const [t, , ...n] = e, s = to(t).map((o) => `<th>${an(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${to(o).map((r) => `<td>${an(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
const Fr = /^\s*(?:[-*+]|\d+[.)])\s+/, Js = /^\s*(\d+)[.)]\s/;
function Cf(e) {
  const t = e[0].match(Js), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && a.trim() && (n[n.length - 1] += ` ${a.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${n.map((a) => `<li>${an(a)}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function Of(e, t) {
  const n = Js.test(e[t]);
  let s = t + 1;
  for (let a = s; a < e.length; a += 1)
    if (Fr.test(e[a]) && Js.test(e[a]) === n || a === s && /^\s{2,}\S/.test(e[a])) s = a + 1;
    else if (e[a].trim()) break;
  return s;
}
const no = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Wr(e) {
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
      const i = t.findIndex((d, u) => u > s && /^(```|~~~)/.test(d)), l = i < 0 ? t.length : i;
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
    if (no(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(Af(t.slice(s, i))), s = i;
      continue;
    }
    if (Fr.test(a)) {
      const i = Of(t, s);
      n.push(Cf(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Wr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !no(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${an(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const Tf = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, If = (e) => e.kind !== "text" && !Tf.test(e.html);
function Rf(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Wr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : If(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Zs(e, t = { env: "" }) {
  const n = Sf(e, t), s = rt.get(n);
  if (rt.delete(n), s && s.reads.every(Mf))
    return rt.set(n, s), s.html;
  const a = [], o = Rf(_f(e, { ...t, reads: a }));
  return rt.set(n, { html: o, reads: a }), rt.size > bf && rt.delete(rt.keys().next().value), o;
}
const Hr = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, on = (e) => String(e || "").replace(Hr, (t, n, s, a) => a), Bf = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), _n = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Lf = /^Traceback \(most recent call last\):/m, Nf = 8;
function Ur(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Nf).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Df(e) {
  const t = [...e.matchAll(Bf)].map((s) => s.index);
  if (_n.lastIndex = 0, !t.length || !_n.test(e)) return null;
  _n.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(_n)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Ur(n), tail: "" } : null;
}
function Pf(e) {
  const t = Lf.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Ur([o]), tail: n.slice(a).join(`
`) };
}
St((e) => {
  const t = on(e), n = Pf(t) || Df(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const jf = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, qf = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, Ff = /[\w\]]\(/, Wf = /^[\w$.[\]'"]+\s*=\s*[^=]/, Hf = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, Uf = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, zf = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, Vf = /[[({,]$/, Gf = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Kf = /^(\t|\s{2,})\S/, Yf = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, Jf = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Zf = /[{}()[\];=<>$&|*\\@+^~%]/g, zr = /^\s*(?:[-*+]|\d+[.)])\s/, Xf = /^\s*>/, Qf = /^\s*\|/, eh = 0.6, th = 0.4, nh = 5, sh = 0.03, Vr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= nh && t.every((n) => Jf.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Zf) ?? []).length / e.length < sh;
}, gs = (e) => {
  const t = e.trim();
  return [jf, qf, Ff, Wf, Hf, Uf, zf, Vf, Gf].some((n) => n.test(t)) || /[;{}]$/.test(t) || Kf.test(e) && !zr.test(e) && !Vr(e);
};
function ah(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || zr.test(t[0]) || t.every((o) => Xf.test(o) || Qf.test(o))) return "text";
  const n = t.filter((o) => !Yf.test(o.trim()));
  if (t.length === 1) return !n.length || gs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(gs).length, a = n.filter((o) => !gs(o) && Vr(o)).length;
  return s >= n.length * eh && a <= n.length * th ? "code" : "text";
}
const Xs = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", oh = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", rh = `${Xs} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, ih = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", lh = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", so = {
  js: { keywords: Xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: oh, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: rh, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Xs, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: ih, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: lh, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, ch = {
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
function ao(e, t, n) {
  return n && e.startsWith(n, t);
}
function uh(e, t) {
  const n = so[ch[t] ?? t] || so.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
  let o = 0;
  const r = (i, l) => l && a.push({ kind: i, value: l });
  for (; o < e.length; ) {
    const i = e[o];
    if (n.markdown) {
      const d = e.indexOf(`
`, o), u = e.slice(o, d < 0 ? e.length : d);
      r(
        /^#{1,6}\s/.test(u) ? "keyword" : /^(```|~~~)/.test(u) ? "comment" : /^\s*([-*+]|\d+\.)\s/.test(u) ? "number" : "plain",
        u
      ), r("plain", d < 0 ? "" : `
`), o = d < 0 ? e.length : d + 1;
      continue;
    }
    if (ao(e, o, n.line) || n.hash && i === "#") {
      const d = e.indexOf(`
`, o);
      r("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && ao(e, o, n.block[0])) {
      const d = e.indexOf(n.block[1], o + n.block[0].length), u = d < 0 ? e.length : d + n.block[1].length;
      r("comment", e.slice(o, u)), o = u;
      continue;
    }
    const l = (n.triple || []).find((d) => e.startsWith(d, o));
    if (l) {
      const d = e.indexOf(l, o + 3), u = d < 0 ? e.length : d + 3;
      r("string", e.slice(o, u)), o = u;
      continue;
    }
    if (n.quotes.includes(i)) {
      let d = o + 1;
      for (; d < e.length && e[d] !== i && (i === "`" || e[d] !== `
`); ) d += e[d] === "\\" ? 2 : 1;
      r(n.keyed && /^\s*:/.test(e.slice(d + 1)) ? "property" : "string", e.slice(o, d + 1)), o = d + 1;
      continue;
    }
    if (n.tags && i === "<" && /[A-Za-z/!?]/.test(e[o + 1] || "")) {
      const d = e.slice(o).match(/^<\/?[\w:-]+/);
      r("keyword", d[0]), o += d[0].length;
      continue;
    }
    if (/[A-Za-z_$]/.test(i)) {
      const u = e.slice(o).match(/^[\w$]+/)[0], f = n.lower ? u.toLowerCase() : u, m = n.property && /^\s*:/.test(e.slice(o + u.length));
      r(s.has(f) ? "keyword" : m ? "property" : /^[A-Z]/.test(u) && t !== "text" ? "type" : "plain", u), o += u.length;
      continue;
    }
    if (/\d/.test(i)) {
      const d = e.slice(o).match(/^(0x[\da-fA-F]+|\d[\d_]*(\.\d+)?([eE][+-]?\d+)?)/);
      r("number", d[0]), o += d[0].length;
      continue;
    }
    if (n.tags && (i === ">" || e.startsWith("/>", o))) {
      const d = i === ">" ? 1 : 2;
      r("keyword", e.slice(o, o + d)), o += d;
      continue;
    }
    r("plain", i), o += 1;
  }
  return a;
}
function dh(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of uh(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? tt(r) : `<span class="tok-${s}">${tt(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function fh(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const hh = 1500, oo = /* @__PURE__ */ new WeakMap();
async function mh(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await fh(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(oo.get(t)), oo.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, hh)
  )));
}
typeof document < "u" && document.addEventListener("click", mh, !0);
const ph = /\n\s*\n/, gh = /^(```|~~~)\s*(\w+)?\s*$/, vh = /^\s{4,}\S/, yh = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Qs = /^\s*(?:[-*+]|\d+[.)])\s/, Gr = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, kh = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function Ea(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function wh(e) {
  const t = Ea(e.join(`
`));
  return (kh.find(([, n]) => n.test(t)) || ["text"])[0];
}
const bh = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Gr.test(t) && !Qs.test(t);
}, xh = (e, t) => Qs.test(t) || Qs.test([...e].reverse().find((n) => n.trim()) || "");
function ea(e, t) {
  const n = t || wh(e), s = dh(Ea(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function $h(e) {
  const t = e.split(ph).map((r) => ({ paragraph: r, kind: ah(Ea(r).split(`
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
      a(), n.push(ea(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(on), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function Mh(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...$h(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const r = t[o].match(gh);
    if (r) {
      const l = t.findIndex((u, f) => f > o && u.trim().startsWith(r[1])), d = l < 0 ? t.length : l;
      a(), n.push(ea(t.slice(o + 1, d).map(on), r[2] ? r[2].toLowerCase() : "")), o = d + 1;
      continue;
    }
    const i = bh(s) ? yh : vh;
    if (i.test(t[o]) && !xh(s, t[o])) {
      let l = o;
      for (; l < t.length && (i.test(t[l]) || !t[l].trim()); ) l += 1;
      for (; l > o && !t[l - 1].trim(); ) l -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && Gr.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (l - o + d.length >= 2) {
        a(), n.push(ea([...d, ...t.slice(o, l)].map(on), "")), o = l;
        continue;
      }
      s.push(...d);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
St((e) => Mh(e));
const Sh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, _h = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Eh(e) {
  const t = Sh.exec(e);
  if (t && et(t[1])) return { at: t.index, length: t[0].length, table: et(t[1]), id: Number(t[2]), label: t[3] };
  const n = _h.exec(e), s = n && et(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Ah(e, t, n, s) {
  const a = qr(s, e, t), o = on(a ? Wd(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${tt(Ht(e).title)} ${t}</span><span class="row-card-title">${tt(o)}</span></a>`;
}
St(
  (e, t) => {
    const n = Eh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Ah(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Ch = /\.(png|jpe?g|gif|webp|svg)$/i, Oh = (e) => Ch.test(e), Th = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Ih = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Rh(e, t) {
  const n = Th.exec(e), [, s, a, o, r, i] = n || [], l = n && et(s || o), d = l && qr(t, l, Number(a || r));
  if (!d || !(d.files || []).includes(i)) return null;
  const u = Ve.in(t.env).fileUrl(l, d.id, i), f = `${Ht(l).title} ${d.id} · ${tt(i)}`, m = Oh(i) ? `<img class="file-card-image" src="${u}" alt="${tt(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${u}" data-attached="${tt(i)}">${m}<span class="file-card-name">${f}</span></a>` };
}
function Bh(e) {
  const t = Ih.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${tt(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
St(
  (e, t) => {
    if (t.inline) return null;
    const n = Rh(e, t) || Bh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Lh = /`([^`\n]+)`/g;
St((e) => e.replace(Lh, (t, n) => `<code>${n}</code>`));
const ro = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${es.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
St(
  (e, t) => e.replace(Hr, (n, s, a, o) => ro[s] ? ro[s](a, o, t) : o)
);
const Nh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Kr = new RegExp(`\\b(${gr}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Yr = new RegExp(`\\b(${gr}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Dh = new RegExp(`<code>((?:${Kr.source}|${Yr.source}))</code>`, "gi"), Ph = (e) => e.replace(Dh, "$1"), jh = (e, t) => `<a class="row-pill" href="#" data-peek="${et(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, qh = (e) => e.replace(Yr, (t, n, s) => s.replace(/\d+/g, (a) => jh(n.replace(/s$/i, ""), a))), Fh = (e) => qh(e).replace(
  Kr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${et(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
St(
  (e, t) => t.rowNames === !1 ? e : Ph(e).split(Nh).map((n, s) => s % 2 ? n : Fh(n)).join("")
);
const Wh = ["innerHTML"], Hh = ["innerHTML"], Uh = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = N(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = Zs(s, { env: Xe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (c(), h("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(Tt) && U(Tt)(...o)),
      innerHTML: n.value
    }, null, 8, Wh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(Tt) && U(Tt)(...o)),
      innerHTML: n.value
    }, null, 8, Hh));
  }
}, ct = /* @__PURE__ */ Y(Uh, [["__scopeId", "data-v-1a43d211"]]), zh = { class: "fact" }, Vh = { class: "fact-label" }, Gh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", zh, [
      g("span", Vh, k(e.label), 1),
      R(ct, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Kh = /* @__PURE__ */ Y(Gh, [["__scopeId", "data-v-3a88ecf8"]]), Yh = { class: "list" }, Jh = { class: "list-label" }, Zh = {
  key: 1,
  class: "list-note"
}, Xh = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Yh, [
      (c(!0), h(K, null, ee(e.items, (o, r) => (c(), G(Mt(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: P(() => [
          g("span", Jh, k(o.label), 1),
          o.badge ? (c(), G($r, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : E("", !0),
          o.note ? (c(), h("span", Zh, k(o.note), 1)) : E("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Qh = /* @__PURE__ */ Y(Xh, [["__scopeId", "data-v-ebe2ae0a"]]), e1 = { class: "table" }, t1 = {
  key: 0,
  class: "table-row empty"
}, n1 = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", e1, [
      g("div", {
        class: "table-row head",
        style: me(a.value)
      }, [
        (c(!0), h(K, null, ee(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, k(i), 1))), 128))
      ], 4),
      (c(!0), h(K, null, ee(e.rows, (i, l) => (c(), G(Mt(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: Z(["table-row", i.tone, { opens: i.open }]),
        style: me(a.value),
        onClick: (d) => i.open && s("open", i.open)
      }, {
        default: P(() => [
          (c(!0), h(K, null, ee(i.cells, (d, u) => (c(), h("span", {
            key: u,
            class: "cell"
          }, k(d), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", t1, k(e.empty), 1)) : E("", !0)
    ]));
  }
}, s1 = /* @__PURE__ */ Y(n1, [["__scopeId", "data-v-9326a52e"]]), a1 = { class: "stat-value" }, o1 = { class: "stat-label" }, r1 = {
  key: 0,
  class: "stat-note"
}, i1 = {
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
    return (s, a) => (c(), G(Mt(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: P(() => [
        g("span", a1, k(e.value), 1),
        g("span", o1, k(e.label), 1),
        e.note ? (c(), h("span", r1, k(e.note), 1)) : E("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, l1 = /* @__PURE__ */ Y(i1, [["__scopeId", "data-v-ad0db6d6"]]), c1 = { class: "code" }, u1 = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(qt, {
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
        R(bd, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: P(() => [
        g("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, k(e.node.text), 3)
      ]),
      divider: P(() => [...r[2] || (r[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: P(() => [
        R(l1, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: P(() => [
        R(pd, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: P(() => [
        R(s1, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: P(() => [
        R(Qh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: P(() => [
        R(ct, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: P(() => [
        R(Kh, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: P(() => [
        R($r, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: P(() => [
        g("pre", c1, [
          g("code", null, k(e.node.text), 1)
        ])
      ]),
      file: P(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, k(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Jr = /* @__PURE__ */ Y(u1, [["__scopeId", "data-v-cbdcf540"]]), d1 = { class: "dashboard" }, f1 = { class: "trail" }, h1 = ["onClick"], m1 = {
  key: 0,
  class: "gone",
  role: "status"
}, p1 = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (m) => m in (n.document.pages || {}), o = O(!!n.page && !a(n.page)), r = O(n.page && !o.value ? [n.page] : []), i = N(() => r.value.at(-1) || n.document.start), l = N(() => (n.document.pages || {})[i.value] || null), d = (m) => ((n.document.pages || {})[m] || {}).title || m, u = (m) => {
      o.value = !1, r.value = [...r.value, m];
    }, f = (m) => {
      o.value = !1, r.value = r.value.slice(0, m);
    };
    return ve(
      () => n.document.start,
      () => r.value = []
    ), (m, v) => (c(), h("div", d1, [
      e.document.broken ? (c(), G(jn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: P(() => [
          se(k(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(jn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: P(() => [
          se(k(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(K, { key: 2 }, [
        g("nav", f1, [
          g("button", {
            type: "button",
            class: Z(["step", { current: !r.value.length }]),
            onClick: v[0] || (v[0] = ($) => f(0))
          }, k(d(e.document.start)), 3),
          (c(!0), h(K, null, ee(r.value, ($, M) => (c(), h(K, {
            key: `${M}-${$}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: Z(["step", { current: M === r.value.length - 1 }]),
              onClick: (_) => f(M + 1)
            }, k(d($)), 11, h1)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", m1, "What you opened is no longer in this dashboard. Here is its start page.")) : E("", !0),
        R(Pt, {
          name: "page",
          mode: "out-in"
        }, {
          default: P(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              R(Jr, {
                node: l.value.view,
                onOpen: u,
                onFile: v[1] || (v[1] = ($) => s("file", $))
              }, null, 8, ["node"])
            ]))
          ]),
          _: 1
        })
      ], 64)) : E("", !0)
    ]));
  }
}, Xb = /* @__PURE__ */ Y(p1, [["__scopeId", "data-v-fbe83734"]]), ot = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, je = { across: 48, down: 110, margin: 32, labelSpace: 14 }, g1 = 6;
function Aa(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const v1 = (e) => {
  const t = Aa(e, ot.lineChars), n = Math.max(ot.minWidth, Math.max(...t.map((s) => s.length)) * ot.charWidth + ot.padX * 2);
  return { name: e, lines: t, line: ot.line, padY: ot.padY, width: n, height: t.length * ot.line + ot.padY * 2 };
};
function y1(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const d = a.get(i[1]);
      d === "open" ? s.add(l) : d || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function k1(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function w1(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), d = (u) => {
      const f = i(u).map((m) => l.get(m));
      return f.length ? f.reduce((m, v) => m + v, 0) / f.length : l.get(u);
    };
    return [...r].sort((u, f) => d(u) - d(f));
  };
  for (let r = 0; r < g1; r++) {
    const i = r % 2 === 0, l = s.map((d, u) => u);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((d) => {
      const u = (f) => t.filter((m) => m[i ? 1 : 0] === f).map((m) => m[i ? 0 : 1]);
      s[d] = o(s[d], u);
    });
  }
  return s;
}
function b1(e, t) {
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
function x1(e) {
  const t = [...new Set(e.flatMap(([A, x]) => [A, x]))], n = new Set(e.map(([, A]) => A)), s = t.filter((A) => !n.has(A)), a = y1(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((A, x) => !a.has(x)), r = k1(t, o), i = w1(t, o, r), l = new Map(t.map((A) => [A, v1(A)])), d = i.map((A) => A.reduce((x, C) => x + l.get(C).width, 0) + je.across * (A.length - 1)), u = Math.max(...d) + je.margin * 2, f = M1(e, r, i.length), m = /* @__PURE__ */ new Map();
  let v = je.margin;
  i.forEach((A, x) => {
    let C = (u - d[x]) / 2;
    const y = Math.max(...A.map((T) => l.get(T).height));
    A.forEach((T) => {
      const w = l.get(T);
      m.set(T, { ...w, x: C, y: v + (y - w.height) / 2 }), C += w.width + je.across;
    }), v += y + (f[x] ?? je.down);
  });
  const $ = e.map(([A, x, C], y) => ({ from: A, to: x, label: C || "", back: a.has(y) || r.get(x) <= r.get(A) }));
  b1($, m);
  const M = $.map((A) => S1(A, m.get(A.from), m.get(A.to))), _ = [...m.values()], I = C1(M, _), W = Math.max(v - je.down, ...I.filter((A) => A.label).map((A) => A.label.y + A.label.height));
  return { width: Math.max(u - je.margin, ...I.filter((A) => A.label).map((A) => A.label.x + A.label.width)) + je.margin, height: W + je.margin, nodes: _, arrows: I };
}
const $1 = (e) => e ? Aa(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function M1(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => je.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((d, u) => d - u);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += $1(r) + je.labelSpace);
  }), s.map((a) => Math.max(je.down, a));
}
function S1(e, t, n) {
  const s = e.label ? Aa(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((m) => m.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, u = (d - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + u }, { x: l, y: d - u }, { x: l, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + u} ${l} ${d - u} ${l} ${d}` };
}
const _1 = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, E1 = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], A1 = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function C1(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, d) => {
      const u = _1(s.curve, l);
      return { x: u.x - s.labelWidth / 2, y: u.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, i = A1.flatMap((l) => E1.map((d) => a(d, l))).find((l) => !n.some((d) => io(l, d))) ?? a(0.5, 0);
    for (; n.some((l) => io(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const io = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, O1 = { class: "flowchart-tools" }, T1 = ["width", "height", "viewBox", "aria-label"], I1 = ["d"], R1 = ["x", "y", "width", "height"], B1 = ["x", "y"], L1 = ["x", "dy"], N1 = {
  key: 0,
  class: "flowchart-label"
}, D1 = ["x", "y", "width", "height"], P1 = ["x", "y"], j1 = ["x", "dy"], q1 = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => x1(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = O(null), i = O({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function d() {
      var I;
      const M = (I = r.value) == null ? void 0 : I.getBoundingClientRect();
      if (!(M != null && M.width)) return;
      const _ = Math.min(M.width / a.value.width, M.height / a.value.height, 1.5);
      i.value = { zoom: _, x: (M.width - a.value.width * _) / 2, y: (M.height - a.value.height * _) / 2 };
    }
    function u(M, _, I) {
      const { zoom: W, x: Q, y: A } = i.value, x = Math.min(o.most, Math.max(o.least, W * M));
      i.value = { zoom: x, x: _ - (_ - Q) * x / W, y: I - (I - A) * x / W };
    }
    function f(M) {
      const _ = r.value.getBoundingClientRect();
      u(M, _.width / 2, _.height / 2);
    }
    function m(M) {
      const _ = r.value.getBoundingClientRect();
      M.ctrlKey || M.metaKey ? u(M.deltaY < 0 ? o.step : 1 / o.step, M.clientX - _.left, M.clientY - _.top) : i.value = { ...i.value, x: i.value.x - M.deltaX, y: i.value.y - M.deltaY };
    }
    function v(M) {
      var _, I, W;
      M.preventDefault(), (_ = window.getSelection()) == null || _.removeAllRanges(), l = { x: M.clientX - i.value.x, y: M.clientY - i.value.y }, (W = (I = r.value).setPointerCapture) == null || W.call(I, M.pointerId);
    }
    function $(M) {
      l && (i.value = { ...i.value, x: M.clientX - l.x, y: M.clientY - l.y });
    }
    return Ne(d), (M, _) => (c(), G(hr, {
      title: e.title,
      large: "",
      onClose: _[4] || (_[4] = (I) => s("close"))
    }, {
      default: P(() => [
        g("div", O1, [
          R(he, {
            small: "",
            onClick: _[0] || (_[0] = (I) => f(o.step))
          }, {
            default: P(() => [..._[5] || (_[5] = [
              se("Zoom in", -1)
            ])]),
            _: 1
          }),
          R(he, {
            small: "",
            onClick: _[1] || (_[1] = (I) => f(1 / o.step))
          }, {
            default: P(() => [..._[6] || (_[6] = [
              se("Zoom out", -1)
            ])]),
            _: 1
          }),
          R(he, {
            small: "",
            onClick: d
          }, {
            default: P(() => [..._[7] || (_[7] = [
              se("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: be(m, ["prevent"]),
          onPointerdown: v,
          onPointermove: $,
          onPointerup: _[2] || (_[2] = (I) => Ha(l) ? l.value = null : l = null),
          onPointercancel: _[3] || (_[3] = (I) => Ha(l) ? l.value = null : l = null)
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
            _[8] || (_[8] = g("defs", null, [
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
            (c(!0), h(K, null, ee(a.value.arrows, (I, W) => (c(), h("path", {
              key: `arrow-${W}`,
              class: "flowchart-arrow",
              d: I.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, I1))), 128)),
            (c(!0), h(K, null, ee(a.value.nodes, (I) => (c(), h("g", {
              key: I.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: I.x,
                y: I.y,
                width: I.width,
                height: I.height,
                rx: "8"
              }, null, 8, R1),
              g("text", {
                x: I.x + I.width / 2,
                y: I.y + I.padY + I.line / 2
              }, [
                (c(!0), h(K, null, ee(I.lines, (W, Q) => (c(), h("tspan", {
                  key: Q,
                  x: I.x + I.width / 2,
                  dy: Q ? I.line : 0
                }, k(W), 9, L1))), 128))
              ], 8, B1)
            ]))), 128)),
            (c(!0), h(K, null, ee(a.value.arrows, (I, W) => (c(), h(K, {
              key: `label-${W}`
            }, [
              I.label ? (c(), h("g", N1, [
                g("rect", {
                  x: I.label.x,
                  y: I.label.y,
                  width: I.label.width,
                  height: I.label.height,
                  rx: "4"
                }, null, 8, D1),
                g("text", {
                  x: I.label.x + I.label.width / 2,
                  y: I.label.y + I.label.pad + I.label.line / 2
                }, [
                  (c(!0), h(K, null, ee(I.label.lines, (Q, A) => (c(), h("tspan", {
                    key: A,
                    x: I.label.x + I.label.width / 2,
                    dy: A ? I.label.line : 0
                  }, k(Q), 9, j1))), 128))
                ], 8, P1)
              ])) : E("", !0)
            ], 64))), 128))
          ], 12, T1))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, F1 = /* @__PURE__ */ Y(q1, [["__scopeId", "data-v-51d24cfe"]]), lo = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', co = {
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
  agent: lo,
  worker: lo,
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
}, W1 = ["innerHTML"], H1 = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = N(() => co[t.name] || co.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, W1));
  }
}, st = /* @__PURE__ */ Y(H1, [["__scopeId", "data-v-beb5935c"]]), U1 = {
  __name: "FoldSign",
  props: { open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["fold", { open: e.open }]),
      "aria-hidden": "true"
    }, [
      R(st, { name: "fold" })
    ], 2));
  }
}, Nt = /* @__PURE__ */ Y(U1, [["__scopeId", "data-v-d03899bb"]]), z1 = ["data-tip", "aria-label"], V1 = {
  key: 0,
  class: "mact-word"
}, G1 = {
  __name: "MarkAction",
  props: { label: { type: String, required: !0 }, open: Boolean },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["mact", { open: e.open }]),
      "data-tip": e.label,
      "aria-label": e.label
    }, [
      R(st, { name: "open" }),
      e.open ? (c(), h("span", V1, k(e.label), 1)) : E("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, z1));
  }
}, Zr = /* @__PURE__ */ Y(G1, [["__scopeId", "data-v-3b292e09"]]), Xr = 120, Bn = 280, Qr = 160, K1 = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Y1 = ["leaving", "resizing", "entering"];
function ta(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function J1(e) {
  const t = Y1.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = ta(e);
  return e.classList.add(...t), n;
}
function ei(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = O(t()), a = O("");
  let o = 0;
  const r = (f, m) => Object.assign(f.style, { width: `${m.width}px`, height: `${m.height}px` }), i = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function l(f, m) {
    i(f);
    const v = J1(f);
    r(f, m), f.offsetWidth, f.style.transition = `width ${Bn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Bn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, v);
  }
  function d(f) {
    const m = f.querySelector(":scope > :not(.top)");
    if (!m || typeof ResizeObserver > "u") return null;
    let v = m.offsetHeight;
    const $ = new ResizeObserver(() => {
      m.offsetHeight !== v && (v = m.offsetHeight, l(f, ta(f)));
    });
    return $.observe(m), $;
  }
  async function u(f) {
    const m = e.value, v = ++o;
    if (!m || !m.offsetWidth || K1()) {
      s.value = f;
      return;
    }
    const $ = ta(m);
    if (r(m, $), a.value = "leaving", await n(Xr), v !== o) return;
    s.value = f, a.value = "resizing", await mt(), l(m, $);
    const M = d(m);
    await n(Bn), M == null || M.disconnect(), v === o && (i(m), a.value = "entering", await n(Qr), v === o && (a.value = ""));
  }
  return ve(t, (f) => u(f)), jt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Z1 = { class: "growing-card-top" }, X1 = ["aria-expanded"], Q1 = { class: "growing-card-avatar" }, em = { class: "growing-card-title" }, tm = { class: "growing-card-more" }, nm = { class: "growing-card-body" }, sm = {
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
    const n = e, s = t, a = O(!1), o = O(null), { folded: r, phase: i } = ei(o, () => !a.value), l = N(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = N(() => n.text.split(/\n\s*\n/).filter((u) => u.trim()));
    return (u, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", U(i), { open: !U(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", Z1, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (m) => a.value = !a.value)
        }, [
          g("span", Q1, [
            e.bad ? (c(), G(st, {
              key: 0,
              name: "cross"
            })) : l.value ? (c(), h(K, { key: 1 }, [
              se(k(l.value), 1)
            ], 64)) : (c(), G(ge, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          g("span", em, k(e.title), 1),
          R(Nt, { open: a.value }, null, 8, ["open"])
        ], 8, X1),
        e.action ? (c(), G(Zr, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (m) => s("act"))
        }, null, 8, ["label", "open"])) : E("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (m) => s("comment"))
        }, [
          R(ge, {
            name: "bubble",
            size: 13
          })
        ])) : E("", !0)
      ]),
      g("div", tm, [
        g("div", nm, [
          (c(!0), h(K, null, ee(d.value, (m, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, k(m), 1))), 128))
        ])
      ])
    ], 2));
  }
}, am = /* @__PURE__ */ Y(sm, [["__scopeId", "data-v-08411e3a"]]), om = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, rm = {
  key: 0,
  class: "message-links-many"
}, im = ["aria-expanded"], lm = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, cm = ["onClick"], um = { class: "row-pill message-links-chip" }, dm = { class: "message-links-title" }, vs = 3, uo = "task", fm = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = _e(Ae, null), s = N(() => t.links.length), a = N(() => t.links.every((m) => m.model === uo) ? "tasks" : "items"), o = N(() => `Linked: ${t.links.map((m) => `${m.model} ${m.id}`).join(" ")}`), r = O(!1), i = O({}), l = O(null);
    Zo(l, () => r.value = !1);
    async function d() {
      const m = t.links.filter(($) => $.model === uo && !($.id in i.value)), v = await Promise.all(m.map(($) => n.read(`task show ${$.id}`)));
      i.value = { ...i.value, ...Object.fromEntries(v.filter(($) => $.ok).map(($) => [$.value.id, $.value.title])) };
    }
    function u() {
      r.value = !r.value, r.value && d();
    }
    function f(m) {
      r.value = !1, Fe(`${et(m.model)}:${m.id}`);
    }
    return (m, v) => (c(), h("div", {
      ref_key: "line",
      ref: l,
      class: Z(["message-links", { many: s.value > vs, three: s.value === vs, open: r.value }]),
      "data-message-links": ""
    }, [
      R(st, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", om, [
        R(ct, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      s.value >= vs ? (c(), h("span", rm, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: u
        }, [
          se(k(s.value) + " linked " + k(a.value) + " ", 1),
          R(Nt, { open: r.value }, null, 8, ["open"])
        ], 8, im)
      ])) : E("", !0),
      r.value ? (c(), h("div", lm, [
        (c(!0), h(K, null, ee(e.links, ($) => (c(), h("button", {
          key: `${$.model}:${$.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (M) => f($)
        }, [
          g("span", um, k($.model) + " " + k($.id), 1),
          g("span", dm, k(i.value[$.id]), 1)
        ], 8, cm))), 128))
      ])) : E("", !0)
    ], 2));
  }
}, hm = /* @__PURE__ */ Y(fm, [["__scopeId", "data-v-24868afd"]]), mm = ["title", "aria-label"], pm = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, gm = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, vm = {
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
      (c(), h("svg", pm, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", gm)) : E("", !0)
      ]))
    ], 10, mm));
  }
}, ym = /* @__PURE__ */ Y(vm, [["__scopeId", "data-v-6dc92808"]]);
function km(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function wm(e, t = Date.now()) {
  const n = km(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const bm = 36e5;
function Qb(e, t, n, s = Date.now()) {
  const a = ((n ? Date.parse(n) : s) - Date.parse(t)) / bm;
  return a > 0 && e ? Math.round(e / a) : 0;
}
function ti(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function fo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ys = (e) => String(e).padStart(2, "0");
function xm(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ys(t % 60)}s` : `${Math.floor(t / 3600)}h ${ys(Math.floor(t % 3600 / 60))}m ${ys(t % 60)}s`;
}
const $m = "img,pre,table";
function Mm(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Sm(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function _m(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector($m)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = e.offsetHeight, a = Mm(Sm(e), n || 0);
  a && (a >= e.offsetWidth || (e.style.width = `${a}px`, e.offsetHeight !== s && (e.style.width = "")));
}
function Em(e, t) {
  let n = null;
  const s = () => e.value && _m(e.value);
  Ne(() => {
    var o, r;
    if (s(), (o = document.fonts) == null || o.ready.then(s), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), ve(t, s, { flush: "post" });
}
const Am = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Cm(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Om = ["data-incoming", "data-ref"], Tm = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], Im = { class: "message-body" }, Rm = ["title"], Bm = ["innerHTML"], Lm = ["title"], Nm = ["innerHTML"], Dm = {
  class: "message-faces",
  "data-message-faces": ""
}, Pm = ["title", "data-face", "onClick"], jm = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, qm = ["title", "data-reaction", "onClick"], Fm = {
  key: 0,
  class: "message-reaction-count"
}, Wm = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, Hm = ["href", "title"], Um = ["src", "alt"], zm = ["href"], Vm = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, Gm = ["data-sent-worker", "title", "onClick"], Km = { class: "message-foot" }, Ym = { class: "message-time" }, Jm = {
  class: "message-id",
  "data-message-id": ""
}, Zm = 140, Xm = 2, Qm = 1500, ep = "An earlier message", tp = "about", np = "sent_to", sp = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var j;
    const n = e, s = t, a = O(!1), o = O(null), r = N(() => ["user", "comment"].includes(n.message.type)), i = N(() => {
      const [D, J] = (n.message.commented_row || ":").split(":"), V = et(D);
      return V ? { ref: `${V}:${J}`, label: `${Ht(V).title.toLowerCase()} ${J}` } : null;
    }), l = N(() => n.message.worker_id ?? null), d = O(!1), u = N(() => l.value !== null && ((n.message.text ?? "").length > Zm || (n.message.text ?? "").split(`
`).filter((D) => D.trim()).length > Xm)), f = N(() => r.value && !n.message.read_at && !n.message.local);
    async function m() {
      var D;
      await ((D = navigator.clipboard) == null ? void 0 : D.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Qm);
    }
    const v = N(() => Zs(n.message.text ?? "", { env: "" })), $ = N(() => JSON.parse(n.message.flowchart_edges || "[]")), M = O(!1), _ = N(() => Zs(n.quote || ep, { env: "" }));
    function I() {
      const D = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      D ? D.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    Em(o, () => `${n.message.text} ${n.quote}`);
    const W = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, Q = (D) => `/api/files/message/${n.message.id}/${encodeURIComponent(D)}`, A = N(() => JSON.parse(n.message.captions || "{}")), x = N(() => (n.message.files ?? []).map((D) => ({ name: D, address: Q(D), isImage: W.test(D), title: A.value[D] || D }))), C = N(() => ti(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), y = _e(Ae, null), T = O([]), w = O([]);
    async function S() {
      if (!r.value || !(y != null && y.read) || n.message.local) return;
      const D = await y.read(`link list --source message:${n.message.id}`);
      if (!D.ok) return;
      const J = D.value.rows ?? D.value ?? [];
      T.value = J.filter((V) => V.link_type === tp).map((V) => ({ model: V.target_model, id: V.target_id })), w.value = J.filter((V) => V.link_type === np).map((V) => V.target_id);
    }
    S(), (j = y == null ? void 0 : y.follow) == null || j.call(y, ["link.*"], S);
    const b = O(!1), p = N(() => Cm(n.message.reactions));
    function B(D) {
      b.value = !1, s("react", n.message, D);
    }
    return (D, J) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      R(am, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (V) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Om)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", Im, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: i.value }]),
          onClick: J[6] || (J[6] = (...V) => U(Tt) && U(Tt)(...V))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: J[1] || (J[1] = be((V) => U(Fe)(i.value.ref), ["stop"]))
          }, [
            R(ge, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + k(i.value.label), 1)
          ], 8, Rm)) : E("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(I, ["stop"]),
            innerHTML: _.value
          }, null, 8, Bm)) : E("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: J[2] || (J[2] = be((V) => U(Fe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + k(l.value), 9, Lm)) : E("", !0),
          g("div", {
            class: Z({ "message-folded": u.value && !d.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, Nm),
          u.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = be((V) => d.value = !d.value, ["stop"]))
          }, k(d.value ? "Show less" : "Show more"), 1)) : E("", !0),
          $.value.length ? (c(), h(K, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (V) => M.value = !0)
            }, "Open the flowchart"),
            M.value ? (c(), G(F1, {
              key: 0,
              title: e.message.text,
              edges: $.value,
              onClose: J[5] || (J[5] = (V) => M.value = !1)
            }, null, 8, ["title", "edges"])) : E("", !0)
          ], 64)) : E("", !0)
        ], 2),
        g("div", {
          class: Z(["message-tools", { picking: b.value }]),
          "data-message-tools": ""
        }, [
          b.value ? (c(), h(K, { key: 0 }, [
            g("div", Dm, [
              (c(!0), h(K, null, ee(U(Am), (V) => (c(), h("button", {
                key: V,
                type: "button",
                class: "message-face",
                title: `React ${V}`,
                "data-face": V,
                onClick: (ce) => B(V)
              }, k(V), 9, Pm))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (V) => b.value = !1)
            }, [
              R(ge, {
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
              onClick: J[8] || (J[8] = (V) => b.value = !0)
            }, "React"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "reply",
              onClick: J[9] || (J[9] = (V) => s("reply", e.message))
            }, "Reply"),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "copy",
              onClick: m
            }, k(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (V) => s("delete", e.message))
            }, "Delete")) : E("", !0)
          ], 64))
        ], 2)
      ]),
      p.value.length ? (c(), h("div", jm, [
        (c(!0), h(K, null, ee(p.value, (V) => (c(), h("button", {
          key: V.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: V.mine }]),
          title: V.title,
          "data-reaction": V.emoji,
          onClick: (ce) => s("react", e.message, V.emoji)
        }, [
          se(k(V.emoji) + " ", 1),
          V.count > 1 ? (c(), h("span", Fm, k(V.count), 1)) : E("", !0)
        ], 10, qm))), 128))
      ])) : E("", !0),
      x.value.length ? (c(), h("div", Wm, [
        (c(!0), h(K, null, ee(x.value, (V) => (c(), h(K, {
          key: V.name
        }, [
          V.isImage ? (c(), h("a", {
            key: 0,
            href: V.address,
            target: "_blank",
            class: "message-image",
            title: V.title
          }, [
            g("img", {
              src: V.address,
              alt: V.name,
              "data-figure-picture": ""
            }, null, 8, Um)
          ], 8, Hm)) : (c(), h("a", {
            key: 1,
            href: V.address,
            target: "_blank",
            class: "message-file"
          }, k(V.name), 9, zm))
        ], 64))), 128))
      ])) : E("", !0),
      w.value.length ? (c(), h("div", Vm, [
        R(ge, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, ee(w.value, (V) => (c(), h("button", {
          key: V,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": V,
          title: `Open worker ${V}`,
          onClick: be((ce) => U(Fe)(`agents:${V}`), ["stop"])
        }, "Also sent to worker " + k(V), 9, Gm))), 128))
      ])) : E("", !0),
      g("div", Km, [
        g("time", Ym, k(C.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          J[11] || (J[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", Jm, "message " + k(e.message.id), 1)
        ], 64)) : E("", !0),
        r.value ? (c(), G(ym, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : E("", !0)
      ]),
      T.value.length ? (c(), G(hm, {
        key: 3,
        links: T.value
      }, null, 8, ["links"])) : E("", !0)
    ], 8, Tm));
  }
}, e5 = /* @__PURE__ */ Y(sp, [["__scopeId", "data-v-f1ee602a"]]), ap = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = al("SkeletonParts", !0);
      return c(!0), h(K, null, ee(e.parts, (l, d) => (c(), h(K, { key: d }, [
        (c(!0), h(K, null, ee(l.count, (u) => (c(), G(qt, {
          key: u,
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
}), op = /* @__PURE__ */ Y(ap, [["__scopeId", "data-v-576c95e1"]]), rp = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, ip = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", rp, [
      R(op, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, ni = /* @__PURE__ */ Y(ip, [["__scopeId", "data-v-52f66b64"]]), Wn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], ks = 200, si = (e) => {
  var t;
  return ((t = Wn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? Wn[0].key;
}, t5 = (e) => {
  var t;
  return ((t = Wn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, lp = ["aria-label"], cp = 300, ho = 400, up = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: ks } },
  setup(e) {
    const t = e, n = N(() => si(t.value)), s = N(() => n.value < ks ? [1, 0.25, 0.25] : n.value === ks ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= ho, high: n.value >= cp && n.value < ho }]),
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
    ], 10, lp));
  }
}, n5 = /* @__PURE__ */ Y(up, [["__scopeId", "data-v-b10e610f"]]), dp = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, mo = (e) => dp[e.card.state] || "idle", fp = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), po = { working: 0, waiting: 1, idle: 2, stopped: 3 }, go = (e, t) => po[mo(e)] - po[mo(t)], vo = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, s5 = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => go(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || fp(s, a)) : [...e].sort((s, a) => go(s, a) || (vo[t] || vo.state)(s, a)), hp = { class: "list-row" }, mp = {
  key: 0,
  class: "list-row-kind"
}, pp = { class: "list-row-main" }, gp = {
  key: 0,
  class: "list-row-title"
}, vp = { class: "list-row-body" }, yp = {
  key: 1,
  class: "list-row-end"
}, kp = {
  key: 1,
  class: "list-row-text"
}, wp = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", hp, [
      e.kind ? (c(), h("span", mp, k(e.kind), 1)) : E("", !0),
      g("div", pp, [
        e.title ? (c(), h("span", gp, k(e.title), 1)) : E("", !0),
        g("div", vp, [
          ue(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", yp, [
          ue(t.$slots, "end", {}, void 0, !0)
        ])) : E("", !0)
      ]),
      e.text ? (c(), h("span", kp, k(e.text), 1)) : E("", !0)
    ]));
  }
}, a5 = /* @__PURE__ */ Y(wp, [["__scopeId", "data-v-63155fba"]]), bp = {
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
}, xp = { claude: "Claude Code", codex: "Codex" }, $p = ["aria-expanded"], Mp = { class: "drop-label" }, Sp = ["value"], _p = {
  key: 1,
  class: "drop-lead"
}, Ep = { class: "drop-item-text" }, Ap = {
  key: 2,
  class: "drop-note"
}, Cp = {
  key: 1,
  class: "drop-none"
}, Op = {
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
    const n = e, s = t, a = O(!1), o = O(null), r = O(""), i = N(() => {
      const d = r.value.trim().toLowerCase();
      return d ? n.items.filter((u) => `${u.label} ${u.note || ""}`.toLowerCase().includes(d)) : n.items;
    });
    function l(d) {
      a.value = !1, s("pick", d);
    }
    return (d, u) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
        ref_key: "head",
        ref: o,
        type: "button",
        class: Z(["drop-head", { on: a.value }]),
        "aria-expanded": a.value,
        "data-drop-head": "",
        onClick: u[0] || (u[0] = (f) => a.value = !a.value)
      }, [
        e.icon ? (c(), G(ge, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : E("", !0),
        g("span", Mp, k(e.label), 1),
        R(ge, {
          name: "down",
          size: 11
        })
      ], 10, $p),
      a.value ? (c(), G(Yn, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: u[2] || (u[2] = (f) => a.value = !1)
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
            onInput: u[1] || (u[1] = (f) => r.value = f.target.value)
          }, null, 40, Sp)) : E("", !0),
          (c(!0), h(K, null, ee(i.value, (f) => (c(), G(xt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (m) => l(f)
          }, {
            default: P(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : E("", !0),
              f.lead ? (c(), h("span", _p, k(f.lead), 1)) : E("", !0),
              g("span", Ep, k(f.label), 1),
              f.note ? (c(), h("span", Ap, k(f.note), 1)) : E("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? E("", !0) : (c(), h("p", Cp, k(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : E("", !0)
    ], 2));
  }
}, Tp = /* @__PURE__ */ Y(Op, [["__scopeId", "data-v-29dfcce5"]]), o5 = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => [
      ...bp[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = N(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, i) => (c(), G(Tp, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(xp)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Ip = ["aria-label"], Rp = { class: "head" }, Bp = { class: "names" }, Lp = { class: "body" }, Np = {
  key: 0,
  class: "foot"
}, Dp = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = ur(s, n), i = dr(a);
    return (l, d) => (c(), G(ga, { to: "body" }, [
      R(Pt, {
        name: "side",
        appear: "",
        onAfterLeave: U(r)
      }, {
        default: P(() => [
          U(a) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: me({ "--depth": e.depth, zIndex: U(i) }),
            "data-side-panel": "",
            onClick: d[0] || (d[0] = be((...u) => U(o) && U(o)(...u), ["self"]))
          }, [
            g("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                g("header", Rp, [
                  g("div", Bp, [
                    g("h2", null, k(e.title), 1),
                    e.abstract ? (c(), G(ct, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : E("", !0)
                  ]),
                  ue(l.$slots, "actions", {}, void 0, !0),
                  R(Xn, {
                    title: e.closeLabel,
                    onClick: U(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", Lp, [
                  ue(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Np, [
                  ue(l.$slots, "foot", {}, void 0, !0)
                ])) : E("", !0)
              ], 64)) : ue(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, Ip)
          ], 6)) : E("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, r5 = /* @__PURE__ */ Y(Dp, [["__scopeId", "data-v-c9a3f43a"]]), Pp = {
  key: 1,
  class: "text-field-label"
}, jp = {
  key: 2,
  class: "text-field-end"
}, qp = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ qs({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var u;
    const n = js(e, "modelValue"), s = Kn(), a = "onUpdate:modelValue" in (((u = ol()) == null ? void 0 : u.vnode.props) || {}), o = N(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = N(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = N(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), d = O(null);
    return t({ focus: () => d.value && d.value.focus() }), (f, m) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, U(s).class]),
      style: me(U(s).style)
    }, [
      e.icon ? (c(), G(ge, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : E("", !0),
      e.label ? (c(), h("span", Pp, k(e.label), 1)) : E("", !0),
      ft(g("input", nt({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [U(zs), o.value]
      ]),
      f.$slots.end ? (c(), h("span", jp, [
        ue(f.$slots, "end", {}, void 0, !0)
      ])) : E("", !0)
    ], 6)) : ft((c(), h("input", nt({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [U(zs), o.value]
    ]);
  }
}), i5 = /* @__PURE__ */ Y(qp, [["__scopeId", "data-v-d9c38ca8"]]), yo = (e) => e.page * e.size < e.total;
function l5(e) {
  const t = Wt().sources.find((n) => n.key === e);
  return t ? na(t.read, t.events) : na("", []);
}
function na(e, t, { incremental: n = !1 } = {}) {
  const s = Wt(), a = O([]), o = O(null), r = O(""), i = O(!1), l = performance.now(), d = O(!1), u = O(""), f = O(null);
  async function m(A) {
    const x = M, C = await s.read(`${e} --before-id ${A + 1} --limit 1`);
    if (x !== M) return;
    if (!C.ok) return I();
    const y = C.value.rows.find((T) => T.id === A);
    a.value = y ? a.value.map((T) => T.id === A ? y : T) : a.value.filter((T) => T.id !== A);
  }
  async function v(A) {
    if (n && String((A == null ? void 0 : A.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((S) => S.id !== A.row_id));
    if (n && (A != null && A.row_id) && !String(A.event ?? "").endsWith(".create") && a.value.some((S) => S.id === A.row_id)) return m(A.row_id);
    if (!(n && a.value.length && String((A == null ? void 0 : A.event) ?? "").endsWith(".create"))) return I();
    const C = Math.max(...a.value.map((S) => S.id)), y = M, T = await s.read(`${e} --after-id ${C}`);
    if (y !== M) return;
    if (!T.ok) return I();
    const w = new Set(a.value.map((S) => S.id));
    a.value = [...T.value.rows.filter((S) => !w.has(S.id)), ...a.value];
  }
  async function $() {
    if (!a.value.length) return !1;
    const A = M, x = Math.min(...a.value.map((T) => T.id)), C = await s.read(`${e} --before-id ${x}`);
    if (A !== M) return !1;
    if (!C.ok || !C.value.rows.length) return d.value = !1;
    d.value = yo(C.value);
    const y = new Set(a.value.map((T) => T.id));
    return a.value = [...a.value, ...C.value.rows.filter((T) => !y.has(T.id))], !0;
  }
  let M = 0;
  async function _(A) {
    const x = ++M, C = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (x !== M) return;
    const y = C.ok ? s.shared ? [C.value] : C.value.rows : [];
    a.value = A(y), o.value = C.ok ? C.value : null;
    const T = y.length ? Math.min(...y.map((w) => w.id)) : 0;
    C.ok && !a.value.some((w) => w.id < T) && (d.value = !s.shared && yo(C.value)), r.value = C.ok ? "" : C.error, nr(l, () => i.value = !0);
  }
  function I() {
    return _((A) => {
      if (!n || !A.length) return A;
      const x = Math.min(...A.map((y) => y.id)), C = Math.max(...A.map((y) => y.id));
      return [...a.value.filter((y) => y.id > C), ...A, ...a.value.filter((y) => y.id < x)];
    });
  }
  const W = () => _((A) => A);
  async function Q(A, x = null) {
    const C = a.value;
    x && (a.value = x(C));
    const y = await s.run(A);
    return x && !y.ok && (a.value = C), u.value = y.ok ? "" : y.error, f.value = y.ok ? y.value : null, await I(), y;
  }
  return e && (s.follow(t, v), I()), { rows: a, listing: o, failure: r, loaded: i, more: d, load: I, loadLatest: W, older: $, act: Q, actionFailure: u, answer: f, context: s };
}
const Fp = { class: "title" }, Wp = { class: "state" }, Hp = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = na(t.line, t.events);
    return (o, r) => (c(), G(Ku, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: P(({ row: i }) => [
        g("span", Fp, k(i.title), 1),
        g("span", Wp, k(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, c5 = /* @__PURE__ */ Y(Hp, [["__scopeId", "data-v-a69084cd"]]);
function Up(e = 1e3, t = null) {
  const n = O(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ve(t, a, { immediate: !0 }) : a(!0), Te(() => clearInterval(s)), n;
}
const ws = O(Date.now() / 1e3);
let ko = 0, En = 0;
function zp() {
  return En || (ws.value = Date.now() / 1e3, ko = setInterval(() => ws.value = Date.now() / 1e3, 1e3)), En += 1, Ko() && Yo(() => {
    En -= 1, En || clearInterval(ko);
  }), ws;
}
const Vp = 200, Gp = Xr + Bn + Qr + Vp;
function Yt(e) {
  if (!e) return null;
  const { x: t, y: n, width: s, height: a } = e.getBoundingClientRect();
  return { x: t, y: n, width: s, height: a, opacity: getComputedStyle(e).opacity };
}
function Kp(e, t, n) {
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
      var r, i, l, d;
      return `${((i = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : i.className) || ((d = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : d.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: d, display: u }) => ({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: d, display: u }))(getComputedStyle(e)),
    parent: Yt(e.parentElement),
    parentClasses: ((a = e.parentElement) == null ? void 0 : a.className) ?? ""
  };
}
function Yp(e, t, n, s) {
  ve(t, (a) => {
    var d;
    const o = e.value;
    if (!o || !(s != null && s.run) || !((d = s.markMotion) != null && d.value)) return;
    const r = performance.now(), i = [];
    function l() {
      if (s.markMotion.value) {
        if (i.push(Kp(o, r, n.value)), performance.now() - r < Gp) return void requestAnimationFrame(l);
        s.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: a, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    l();
  }, { flush: "sync" });
}
const Jp = ["title", "data-figure-mark", "data-folded", "data-open"], Zp = {
  key: 2,
  class: "worker"
}, Xp = { class: "head" }, Qp = { key: 0 }, eg = {
  key: 3,
  class: "status"
}, tg = {
  key: 0,
  class: "figure"
}, ng = {
  key: 1,
  class: "ran-for"
}, sg = { key: 2 }, ag = {
  key: 3,
  class: "news"
}, og = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, rg = {
  key: 6,
  class: "settled"
}, ig = {
  key: 1,
  class: "bar"
}, lg = {
  key: 3,
  class: "detail body"
}, cg = {
  key: 0,
  class: "body-label"
}, ug = ["title"], dg = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = Kn(), s = ["onClick", "onAct"], a = N(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = O(!1), r = N(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = N(() => t.open !== void 0), l = N(() => i.value || r.value), d = N(() => i.value ? t.open : o.value), u = N(() => i.value ? !t.open : r.value && !o.value), f = N(() => !!(t.mark.action && n.onAct)), m = N(() => l.value || f.value || !!n.onClick), v = O(null), $ = O(null), { folded: M, phase: _ } = ei(v, () => u.value);
    Yp(v, u, _, _e(Ae, null));
    function I(le) {
      var ke, Re;
      if (!(le.target !== v.value && !$.value.contains(le.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Re = n.onAct || n.onClick) == null || Re(le);
      }
    }
    const W = (le) => n.onAct(le), Q = ["failed", "unfinished"], A = N(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), x = N(() => t.mark.color ? t.mark.color : A.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : A.value ? `var(--tone-${A.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), C = N(() => x.value || "var(--tone-work)"), y = N(() => !t.mark.ending && !t.mark.ended && A.value !== "stopped"), T = zp(), w = N(
      () => t.mark.began_at && y.value && !t.mark.figure && !t.mark.counting ? xm(T.value - t.mark.began_at) : ""
    ), S = N(() => {
      const { started: le, ended: ke } = t.mark;
      return le ? ke ? `ran ${fo(ke - le, !0)}` : fo(T.value - le, !0) : w.value;
    }), b = ["bad", "danger", "warn"], p = N(() => b.includes(A.value) || t.mark.asks ? "attention" : y.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), B = ["bad", "danger"], j = N(() => B.includes(A.value)), D = N(() => p.value === "process" ? "running" : j.value ? "cross" : A.value === "stopped" ? "stopped" : A.value === "good" ? "tick" : ""), J = N(
      () => !!(t.mark.figure || S.value || t.mark.docked || t.mark.stopping || D.value || t.mark.settled || t.mark.news)
    ), V = N(() => [t.mark.title, t.mark.time ? ti(t.mark.time) : ""].filter(Boolean).join(" · ")), ce = N(() => ({
      ...x.value ? { "--mark": x.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ke) => (c(), h("div", nt(a.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${p.value}`,
        U(_),
        {
          open: d.value,
          folding: i.value && u.value,
          live: m.value,
          failed: j.value,
          stopping: e.mark.stopping,
          struck: e.mark.struck,
          worked: e.mark.worker,
          tinted: x.value,
          console: e.mark.command,
          nested: e.mark.depth > 0
        }
      ],
      style: ce.value,
      title: V.value,
      "data-figure-mark": e.mark.key,
      "data-folded": U(M) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: I
    }), [
      (c(), G(Mt(m.value ? "button" : "span"), {
        ref_key: "top",
        ref: $,
        class: "top",
        type: m.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!d.value) : void 0
      }, {
        default: P(() => [
          e.mark.markIcon ? (c(), G(st, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ge, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", Zp, k(e.mark.worker), 1)) : E("", !0),
          g("span", Xp, [
            R(ct, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", Qp, k(e.mark.name), 1)) : E("", !0),
            l.value ? (c(), G(Nt, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : E("", !0)
          ]),
          J.value ? (c(), h("span", eg, [
            e.mark.figure ? (c(), h("span", tg, k(e.mark.figure), 1)) : E("", !0),
            S.value ? (c(), h("span", ng, k(S.value), 1)) : E("", !0),
            e.mark.stopping ? (c(), h("span", sg, "Stopping")) : E("", !0),
            e.mark.news ? (c(), h("span", ag, k(e.mark.news), 1)) : E("", !0),
            D.value === "running" ? (c(), h("span", og)) : D.value ? (c(), G(st, {
              key: 5,
              class: Z(["sign", D.value]),
              name: D.value
            }, null, 8, ["class", "name"])) : E("", !0),
            e.mark.settled ? (c(), h("span", rg, k(e.mark.settled), 1)) : E("", !0)
          ])) : E("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(Zr, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: be(W, ["stop"])
      }, null, 8, ["label", "open"])) : E("", !0),
      (e.mark.figure || e.mark.counting) && y.value ? (c(), h("span", ig, [
        g("span", {
          class: "progress",
          style: me({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: C.value })
        }, null, 4)
      ])) : E("", !0),
      e.mark.detail && !U(M) ? (c(), G(ct, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      e.mark.body && !U(M) ? (c(), h("div", lg, [
        e.mark.bodyLabel ? (c(), h("p", cg, k(e.mark.bodyLabel), 1)) : E("", !0),
        R(ct, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : E("", !0),
      e.mark.command && !U(M) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, k(e.mark.command), 9, ug)) : E("", !0),
      e.mark.card ? (c(), G(ct, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : E("", !0),
      ue(le.$slots, "default", {
        shown: !U(M)
      }, void 0, !0)
    ], 16, Jp));
  }
}), ai = /* @__PURE__ */ Y(dg, [["__scopeId", "data-v-b4038573"]]), fg = 60;
function hg(e, t) {
  const n = O([]), s = O(0);
  let a = -1, o = 0, r = !1;
  async function i() {
    const u = await e(["output", "page", String(t())]);
    return u.ok && (n.value = u.value.lines, s.value = u.value.first_byte, a = u.value.last_byte, o = u.value.cut_bytes), u;
  }
  async function l() {
    if (a < 0) return i();
    const u = await e(["output", "page", String(t()), "--after", String(a)]);
    return u.ok ? u.value.cut_bytes !== o || u.value.total < a ? i() : (u.value.lines.length && (n.value = [...n.value, ...u.value.lines]), a = u.value.last_byte, u) : u;
  }
  async function d(u) {
    if (r || s.value <= 0 || u.scrollTop > fg) return;
    r = !0;
    const f = u.scrollHeight, m = await e(["output", "page", String(t()), "--before", String(s.value)]);
    r = !1, m.ok && (n.value = [...m.value.lines, ...n.value], s.value = m.value.first_byte, await mt(), u.scrollTop += u.scrollHeight - f);
  }
  return { lines: n, newest: i, follow: l, loadEarlier: d };
}
const mg = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function oi(e) {
  var n;
  const t = mg[e] || ((n = Ht(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const pg = (e) => oi(String(e).split(":")[0]), ri = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), gg = { passed: "good", failed: "danger", warned: "warn", running: "" }, vg = { good: "good", warn: "warn", danger: "danger" }, wo = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Fu(e.target_model, e.target_id || 0)
}, yg = { "open row": (e) => pg(e.target_model), "open page": () => oi("pages") };
function kg(e, t) {
  const n = t || {}, s = wo[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? gg[e.outcome] || "" : vg[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? yg[s](e) : "",
    handlers: s ? { onAct: () => wo[s](e) } : {}
  };
}
const wg = 24, bg = 1e3, bo = 2e3, xg = 0.25, $g = 5e3;
function Mg(e, t = wg, n = () => !0) {
  const s = O(!1), a = O(0), o = O(!1);
  let r = 0, i = 0, l = 0;
  const d = () => e && "value" in e ? e.value : e, u = () => {
    const A = d();
    return A ? A.scrollHeight - A.scrollTop - A.clientHeight : 0;
  }, f = () => !d() || u() <= t;
  function m(A) {
    if (clearTimeout(r), !A) {
      o.value = !1, l = Date.now();
      return;
    }
    const x = Date.now() - l < bo ? bo : bg;
    r = setTimeout(() => o.value = s.value, x);
  }
  function v() {
    clearTimeout(i), s.value = !1, a.value = 0, m(!1);
  }
  function $(A = !1) {
    const x = d();
    x && A && x.scrollTo ? x.scrollTo({ top: x.scrollHeight, behavior: "smooth" }) : x && (x.scrollTop = x.scrollHeight), v();
  }
  function M() {
    I(), !s.value && (s.value = !0, m(!0));
  }
  const _ = () => !!d() && u() <= d().clientHeight * xg;
  function I() {
    clearTimeout(i), _() && (i = setTimeout(() => s.value && _() && n() && $(!0), $g));
  }
  function W() {
    f() ? v() : M();
  }
  function Q(A = 1, x = !1) {
    s.value ? a.value += Math.max(0, A) : $(x);
  }
  return Ko() && Yo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: u, atBottom: f, follow: v, toBottom: $, left: M, scrolled: W, arrived: Q };
}
const Sg = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, _g = (e) => String(e ?? "").replace(Sg, ""), Eg = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = O(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Mg(a);
    ve(
      () => n.lines.length,
      () => mt(() => i()),
      { immediate: !0 }
    );
    function d(u) {
      r(), s("older", u.target);
    }
    return (u, f) => (c(), h("pre", {
      ref_key: "box",
      ref: a,
      class: "output-lines",
      onScroll: d
    }, [
      se(k(U(_g)(e.lines.join(`
`)) || e.empty), 1),
      U(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (m) => U(l)(!0))
      }, "Follow")) : E("", !0)
    ], 544));
  }
}, Ag = /* @__PURE__ */ Y(Eg, [["__scopeId", "data-v-c2fb1783"]]), Cg = 1e4;
class Og {
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
    return this.heardAt !== null && t - this.heardAt > Cg;
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
const Tg = {
  key: 0,
  class: "frame-note"
}, Ig = {
  key: 0,
  class: "frame-note"
}, Rg = ["src", "title"], Bg = 1e3, Lg = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = Wt(), s = O(null), a = O(!1), o = O(!1);
    let r = null, i = 0;
    return Ne(() => {
      r = new Og(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Bg);
    }), Te(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, d) => o.value ? (c(), h("p", Tg, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      a.value ? (c(), h("div", Ig, [
        d[2] || (d[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        R(he, {
          onClick: d[0] || (d[0] = (u) => o.value = !0)
        }, {
          default: P(() => [...d[1] || (d[1] = [
            se("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : E("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: U(n).window
      }, null, 8, Rg)
    ], 64));
  }
}, Ng = /* @__PURE__ */ Y(Lg, [["__scopeId", "data-v-32a49046"]]);
function Dg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const Pg = {
  class: "allowance-prompt",
  role: "dialog"
}, jg = { class: "allowance-prompt-text" }, qg = { class: "allowance-prompt-buttons" }, Fg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Pg, [
      g("p", jg, k(U(Dg)(e.request)), 1),
      g("div", qg, [
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
}, Wg = /* @__PURE__ */ Y(Fg, [["__scopeId", "data-v-102dc765"]]), bs = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(jn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: P(() => [
        se(k(e.reason) + " ", 1),
        e.retry ? (c(), G(he, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: P(() => [...a[2] || (a[2] = [
            se("Retry", -1)
          ])]),
          _: 1
        })) : E("", !0),
        e.removable ? (c(), G(he, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: P(() => [...a[3] || (a[3] = [
            se("Remove tab", -1)
          ])]),
          _: 1
        })) : E("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Hg = ["data-window", "data-agent"], Ug = {
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
    const n = e, s = t, a = O(""), o = O(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = _e(Rl, null), l = Dc({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: N(() => n.options),
      declared: n.declared,
      page: _e(Tc, null),
      setOption: (f, m) => s("option", f, m),
      autoScroll: n.autoScroll,
      tabs: n.tabs,
      sources: n.sources,
      links: n.links,
      search: n.search,
      readOnly: n.readOnly,
      shared: n.shared,
      open: (f, m) => {
        s("open", f, m), i == null || i(f, m);
      }
    });
    rl(Ae, l), ve(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Ne(l.settle), Te(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), il((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const d = () => pa(n.component), u = () => {
      var f, m;
      return ((m = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : m.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, m) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      u() ? (c(), G(Wg, {
        key: 0,
        request: u(),
        onAnswer: m[0] || (m[0] = (v) => e.prompts.answer(v))
      }, null, 8, ["request"])) : E("", !0),
      e.unavailableReason ? (c(), G(bs, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (c(), G(bs, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: r
      }, null, 8, ["name", "reason"])) : e.component ? (c(), h(K, { key: 4 }, [
        (c(), G(d, { key: o.value })),
        e.skeleton.length && !U(l).answered.value ? (c(), G(ni, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : E("", !0)
      ], 64)) : (c(), G(bs, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: m[1] || (m[1] = (v) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, Hg));
  }
}, ii = /* @__PURE__ */ Y(Ug, [["__scopeId", "data-v-c4443e2b"]]), zg = {
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
    const n = e, s = t, a = { render: () => pa(Ng, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(ii, {
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
}, Vg = ["data-window"], Gg = {
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
    const n = e, s = t, a = Bt(null), o = O("");
    return ve(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, ac();
          } catch (i) {
            if (nc(i) && sc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      R(ni, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, Vg)) : (c(), G(ii, {
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
      onOption: i[0] || (i[0] = (l, d) => s("option", l, d))
    }, null, 8, ["name", "component", "subscriptions", "environment", "agent", "visible", "permissions", "prompts", "options", "declared", "auto-scroll", "tabs", "sources", "links", "search", "events", "skeleton", "unavailable-reason"]));
  }
}, xo = "*.*", Kg = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null }, environment: { type: String, default: "" } },
  setup(e) {
    var d;
    const t = e, n = _e(Ae, null), s = new Ec(), a = (d = n == null ? void 0 : n.subscriptions) == null ? void 0 : d.follow(`body of ${t.declaration.type}`, [xo], (u) => s.dispatch(u));
    Te(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? t.environment, r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = N(() => !!(t.declaration.shipped || t.declaration.trusted)), l = N(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [xo] : t.declaration.events ?? [],
      options: []
    }));
    return (u, f) => i.value ? (c(), G(Gg, {
      key: 0,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(zg, {
      key: 1,
      entry: l.value,
      subscriptions: U(s),
      environment: U(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Yg = { class: "mark-more-inner" }, Jg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, Zg = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Xg = {
  key: 3,
  class: "mark-lines"
}, Qg = "process", $o = "task", e0 = 2e3, t0 = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ae), s = N(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = N(() => ri.has(t.mark.variant) && t.mark.detail || ""), o = N(() => t.mark.target_model === $o ? t.mark.target_id : 0), r = hg(($) => n.run($), () => t.mark.target_id), i = r.lines, l = O(!1), d = O(""), u = N(() => t.mark.target_model === Qg && !!t.mark.target_id);
    async function f($ = r.follow) {
      const M = await $();
      l.value = !0, d.value = M.ok ? "" : M.error;
    }
    let m = null;
    const v = () => clearInterval(m);
    return ve(() => t.shown && u.value, ($) => {
      v(), $ && (f(), t.mark.ended_at || (m = setInterval(f, e0)));
    }, { immediate: !0 }), ve(() => t.mark.ended_at, ($) => $ && t.shown && u.value && (v(), f(r.newest))), Te(v), ($, M) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: M[1] || (M[1] = be(() => {
      }, ["stop"]))
    }, [
      g("div", Yg, [
        e.declaration.body_url ? (c(), G(Kg, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(K, { key: 1 }, [
          a.value ? (c(), h(K, { key: 0 }, [
            M[2] || (M[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Jg, k(a.value), 1)
          ], 64)) : E("", !0),
          u.value && d.value ? (c(), h("p", Zg, k(d.value), 1)) : u.value && l.value ? (c(), h(K, { key: 2 }, [
            M[3] || (M[3] = g("p", { class: "mark-label" }, "Output", -1)),
            R(Ag, {
              class: "mark-terminal",
              lines: U(i),
              onOlder: U(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : s.value.length ? (c(), h("p", Xg, k(s.value.join(`
`)), 1)) : E("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: M[0] || (M[0] = be((_) => U(Fe)(`${$o}:${o.value}`), ["stop"]))
          }, "Open task " + k(o.value) + " and its proofs", 1)) : E("", !0)
        ], 64))
      ])
    ], 2));
  }
}, sa = /* @__PURE__ */ Y(t0, [["__scopeId", "data-v-3be263ac"]]), n0 = ["title", "aria-label", "onClick"], s0 = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, a0 = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = N(() => mu(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = O(""), a = _e(Ae);
    async function o(r) {
      const i = await hn(r, { id: t.mark.target_id }, a.environment);
      s.value = i.ok ? "" : i.error;
    }
    return (r, i) => (c(), h(K, null, [
      (c(!0), h(K, null, ee(n.value, (l) => (c(), h("button", {
        key: l.runs,
        type: "button",
        class: "mark-button",
        title: l.label,
        "aria-label": l.label,
        onClick: be((d) => o(l), ["stop"])
      }, [
        R(st, {
          name: l.icon
        }, null, 8, ["name"])
      ], 8, n0))), 128)),
      s.value ? (c(), h("span", s0, k(s.value), 1)) : E("", !0)
    ], 64));
  }
}, o0 = /* @__PURE__ */ Y(a0, [["__scopeId", "data-v-7a62c88e"]]);
function li(e, t) {
  const n = Bt(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await Le.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const ci = li("/api/marks", "marks"), u5 = ci.fetchAll, r0 = ci.find, i0 = 2e3;
function ui(e, t, n = i0) {
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
  }), jt(() => clearTimeout(s));
}
const l0 = ["data-ref"], c0 = ["data-ref"], u0 = { class: "mark-row" }, d0 = "dock add", f0 = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = N(() => r0(s.mark.type)), o = _e(Ae, null), r = N(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = O(null);
    ui(async () => {
      if (!r.value) return;
      const v = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      v.ok && v.value.rows.length && (i.value = v.value.rows[0].progress);
    }, () => r.value);
    const l = N(() => {
      const v = kg(s.mark, a.value), $ = !v.figure || v.figure.endsWith("%");
      return i.value && r.value && $ ? { ...v, figure: `${i.value}%`, fraction: i.value / 100 } : v;
    }), d = N(() => {
      var v;
      return !!(s.mark.lines || s.mark.detail && ri.has(s.mark.variant) || t.has(s.mark.target_model) || (v = a.value) != null && v.body_url);
    }), u = O(!1);
    function f(v) {
      if (l.value.handlers.onAct && !v.target.closest(".fold")) return l.value.handlers.onAct();
      u.value = !u.value;
    }
    const m = N(() => {
      var v;
      return (((v = a.value) == null ? void 0 : v.buttons) || []).filter(($) => {
        var M;
        return !s.docked || !((M = $.runs) != null && M.startsWith(d0));
      }).map(($) => ({ ...$, module: a.value.module }));
    });
    return (v, $) => {
      var M, _;
      return (M = a.value) != null && M.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        R(sa, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, l0)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (_ = a.value) == null ? void 0 : _.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", u0, [
          R(ai, nt({
            mark: l.value,
            open: d.value ? u.value : void 0
          }, ll(l.value.handlers), { onClick: f }), cl({ _: 2 }, [
            d.value ? {
              name: "default",
              fn: P(({ shown: I }) => [
                R(sa, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: I
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          R(o0, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, c0));
    };
  }
}, h0 = /* @__PURE__ */ Y(f0, [["__scopeId", "data-v-073b7a24"]]), m0 = ["data-ref"], p0 = ["inert"], g0 = { class: "group-fold" }, v0 = { class: "thread-group" }, y0 = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = O(!1), s = O(!1), a = O(!1), o = O(null);
    ve(n, async (i) => {
      var l;
      s.value = !0, await mt(), (l = o.value) == null || l.offsetHeight, a.value = i;
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
      R(ai, {
        mark: r.value,
        open: n.value,
        onClick: l[0] || (l[0] = (d) => n.value = !n.value)
      }, null, 8, ["mark", "open"]),
      s.value ? (c(), h("div", {
        key: 0,
        ref_key: "rows",
        ref: o,
        class: Z(["group-rows", { open: a.value }]),
        inert: !n.value,
        "data-mark-group-rows": ""
      }, [
        g("div", g0, [
          g("div", v0, [
            (c(!0), h(K, null, ee(e.group.marks, (d) => (c(), G(h0, {
              key: d.id,
              mark: d
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, p0)) : E("", !0)
    ], 8, m0));
  }
}, d5 = /* @__PURE__ */ Y(y0, [["__scopeId", "data-v-45b58b9b"]]);
function k0(e) {
  const t = O(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Ne(() => n.observe(e.value)), jt(() => n.disconnect()), t;
}
const w0 = { class: "chat-dock-fold" }, b0 = ["aria-label"], x0 = { class: "chat-dock-head" }, $0 = { class: "chat-dock-inner" }, di = 700, M0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = O(null), s = O(null), a = k0(s), o = O(!1);
    let r = 0;
    return Ne(() => r = setTimeout(() => o.value = !0, di)), jt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", w0, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          ue(i.$slots, "edge"),
          g("header", x0, [
            ue(i.$slots, "head")
          ]),
          g("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            g("div", $0, [
              g("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: me(U(a) === null ? null : { height: `${U(a)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  ue(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, b0)
      ])
    ], 2));
  }
}, fi = /* @__PURE__ */ Y(M0, [["__scopeId", "data-v-512883e2"]]), S0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, xs = 5, _0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(xs, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${xs}s`, animationDelay: `${(n - xs).toFixed(2)}s` };
    return (a, o) => (c(), h("span", S0, [
      g("i", { style: s })
    ]));
  }
}, hi = /* @__PURE__ */ Y(_0, [["__scopeId", "data-v-d0c4b012"]]), mi = li("/api/docks", "docks"), f5 = mi.fetchAll, aa = mi.find, E0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), oa = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), A0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), C0 = (e) => e.kept ? oa("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : oa("keep", "pin", "Pin", `dock keep ${e.id}`), O0 = ["pin", "stop"], T0 = (e) => ({ ...e, iconOnly: O0.includes(e.icon) });
function I0(e, t) {
  var n;
  return [
    ...A0(e, t) ? [C0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, module: t.module, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Ht(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    oa("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(T0);
}
const R0 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: E0(e, t),
  buttons: I0(e, t)
}), B0 = { class: "dock-title" }, L0 = ["aria-expanded", "title"], N0 = { class: "chat-dock-acts dock-acts" }, D0 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, P0 = {
  key: 1,
  class: "dock-text"
}, j0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = N(() => aa(s.item.type)), o = O(null), r = N(() => R0(s.item, a.value)), i = _e(Ae), l = O(/* @__PURE__ */ new Set()), d = O("");
    async function u(v) {
      if (v.action === "open") return Fe(`${s.item.target_model}:${s.item.target_id}`);
      v.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, v.label])), d.value = "";
      const M = await hn(v, { id: s.item.target_id }, i.environment);
      (M == null ? void 0 : M.ok) === !1 && (l.value = new Set([...l.value].filter((_) => _ !== v.label)), d.value = M.error);
    }
    const f = N(() => r.value.buttons.filter((v) => v.action !== "undock" && !l.value.has(v.label))), m = N(() => r.value.buttons.find((v) => v.action === "undock"));
    return (v, $) => (c(), G(fi, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: P(() => [
        e.leaving ? (c(), G(hi, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0)
      ]),
      head: P(() => {
        var M, _, I;
        return [
          (M = a.value) != null && M.draws_head ? (c(), h("span", {
            key: 0,
            ref_key: "head",
            ref: o,
            class: "dock-head",
            "data-dock-head": ""
          }, null, 512)) : (c(), h(K, { key: 1 }, [
            R(ge, {
              name: r.value.icon,
              class: "dock-icon"
            }, null, 8, ["name"]),
            g("span", B0, k(r.value.title), 1)
          ], 64)),
          (_ = a.value) != null && _.badge ? (c(), h("span", {
            key: 2,
            class: Z(["dock-badge", e.item.type.split(".")[1]]),
            "data-dock-badge": ""
          }, k(a.value.badge), 3)) : E("", !0),
          (I = a.value) != null && I.draws_head ? E("", !0) : (c(), h("button", {
            key: 3,
            type: "button",
            class: "dock-fold",
            "data-dock-fold": "",
            "aria-expanded": !e.folded,
            title: e.folded ? "Unfold" : "Fold",
            onClick: $[0] || ($[0] = (W) => n("fold"))
          }, [
            R(Nt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, L0)),
          g("span", N0, [
            R(Au, {
              name: `dock.${e.item.type}`,
              row: { id: e.item.target_id, kind: e.item.target_model },
              environment: U(i).environment,
              "read-only": U(i).readOnly
            }, null, 8, ["name", "row", "environment", "read-only"]),
            (c(!0), h(K, null, ee(f.value, (W) => (c(), h(K, {
              key: W.action + W.runs
            }, [
              W.iconOnly ? (c(), G(he, {
                key: 0,
                kind: "icon",
                "aria-label": W.label,
                title: W.label,
                "data-dock-action": W.action,
                onClick: (Q) => u(W)
              }, {
                default: P(() => [
                  R(ge, {
                    name: W.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(he, {
                key: 1,
                small: "",
                kind: W.primary ? "primary" : "ghost",
                bordered: !W.primary,
                "data-dock-action": W.action,
                onClick: (Q) => u(W)
              }, {
                default: P(() => [
                  se(k(W.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          R(Xn, {
            title: m.value.label,
            "data-dock-action": "undock",
            onClick: $[1] || ($[1] = (W) => n("undock", m.value))
          }, null, 8, ["title"])
        ];
      }),
      default: P(() => {
        var M, _;
        return [
          d.value || e.refusal ? (c(), h("p", D0, k(d.value || e.refusal), 1)) : E("", !0),
          e.item.text && !((M = a.value) != null && M.body_url) ? (c(), h("p", P0, k(e.item.text), 1)) : E("", !0),
          (_ = a.value) != null && _.body_url ? (c(), G(sa, {
            key: 2,
            declaration: a.value,
            mark: e.item,
            shown: "",
            head: o.value
          }, null, 8, ["declaration", "mark", "head"])) : E("", !0)
        ];
      }),
      _: 1
    }, 8, ["label", "folded", "data-figure-closing"]));
  }
}, Mo = /* @__PURE__ */ Y(j0, [["__scopeId", "data-v-45fb9023"]]), q0 = 6, F0 = 3, So = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, wt = (e) => !!(e.leaves_at && !e.kept), W0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < e.leaves_at || n.has(e.id)), H0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => W0(s, t, n)).sort((s, a) => s.id - a.id);
function U0(e, t, n = q0) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const z0 = (e, t, n = e) => n < 2 ? !1 : e >= F0 ? !0 : t, V0 = ["title", "aria-label"], G0 = { class: "run-chip-in" }, K0 = {
  key: 0,
  class: "run-chip-ring"
}, Y0 = { class: "run-chip-name" }, J0 = { class: "run-chip-bar" }, Z0 = "processes.output", X0 = 5e3, Q0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var u;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((u = _e(Ae, null)) == null ? void 0 : u.environment) ?? "", o = O(null), r = N(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = N(() => {
      var f, m;
      return ((f = o.value) == null ? void 0 : f.title) || ((m = o.value) == null ? void 0 : m.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = N(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function d() {
      const f = await Lt(Z0, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return ui(d, () => r.value, X0), (f, m) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: me({ "--tone": l.value })
      }, [
        U(wt)(e.item) ? (c(), G(hi, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : E("", !0),
        g("span", G0, [
          r.value ? (c(), h("span", K0)) : (c(), G(st, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", Y0, k(i.value), 1)
        ]),
        g("span", J0, [
          g("i", {
            style: me({ width: r.value ? `${((v = o.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, V0);
    };
  }
}, ev = /* @__PURE__ */ Y(Q0, [["__scopeId", "data-v-597b05d2"]]), tv = 24, nv = 8, h5 = 420;
function m5({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= tv && e > t ? !0 : e < t && a > nv ? !1 : null;
}
const sv = (e, t) => e === void 0 ? t : e, pi = "journal.viewer.";
function av(e, t, n) {
  try {
    const s = n.getItem(pi + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function ov(e, t, n) {
  try {
    n.setItem(pi + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function rv(e, t, n = window.localStorage) {
  const s = O(av(e, t, n));
  return ve(s, (a) => ov(e, a, n), { deep: !0 }), s;
}
const iv = {
  key: "runs-head",
  class: "dock-runs-head"
}, lv = { class: "dock-runs-chips" }, cv = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var C;
    const t = e, n = Up(500), s = O(/* @__PURE__ */ new Set()), a = O(!1), o = O(!1), r = _e(Ae), i = O(/* @__PURE__ */ new Set()), l = O({});
    async function d(y, T) {
      i.value = /* @__PURE__ */ new Set([...i.value, y.id]);
      const w = await hn(T, { id: y.target_id }, r.environment);
      (w == null ? void 0 : w.ok) === !1 && (i.value = new Set([...i.value].filter((S) => S !== y.id)), l.value = { ...l.value, [y.id]: w.error });
    }
    const u = N(() => H0(t.items.filter((y) => !i.value.has(y.id)), n.value, s.value)), f = N(() => U0(u.value.filter((y) => So(y, aa)), n.value)), m = N(() => u.value.filter((y) => !f.value.includes(y) && !So(y, aa))), v = N(() => f.value.filter((y) => !wt(y))), $ = N(() => (a.value = z0(f.value.length, a.value, v.value.length)) && !o.value), M = rv(`dock-folded:${((C = ie.identity) == null ? void 0 : C.root) || location.host}`, {}), _ = (y) => sv(M.value[y.id], t.folded);
    function I(y) {
      M.value = { ...M.value, [y.id]: !_(y) };
    }
    function W(y) {
      M.value = { ...M.value, ...Object.fromEntries(f.value.map((T) => [T.id, T.id !== y.id])) }, o.value = !0;
    }
    function Q() {
      M.value = Object.fromEntries(Object.entries(M.value).filter(([y]) => !f.value.some((T) => String(T.id) === y))), o.value = !1;
    }
    function A(y) {
      s.value = /* @__PURE__ */ new Set([...s.value, y.id]);
    }
    function x(y) {
      s.value = new Set([...s.value].filter((T) => T !== y.id));
    }
    return (y, T) => (c(), G(Go, {
      tag: "div",
      name: "dock",
      duration: U(di),
      class: "dock-stack"
    }, {
      default: P(() => [
        (c(!0), h(K, null, ee(m.value, (w) => (c(), G(Mo, {
          key: w.id,
          item: w,
          class: Z({ timed: U(wt)(w) }),
          leaving: U(wt)(w) && !s.value.has(w.id),
          folded: _(w),
          refusal: l.value[w.id],
          onFold: (S) => I(w),
          onUndock: (S) => d(w, S),
          onMouseenter: (S) => A(w),
          onMouseleave: (S) => x(w)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", iv, [
          g("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: Q
          }, [
            se(k(f.value.length) + " runs ", 1),
            R(Nt, { open: "" })
          ])
        ])) : E("", !0),
        (c(!0), h(K, null, ee($.value ? [] : f.value, (w) => (c(), G(Mo, {
          key: w.id,
          item: w,
          class: Z({ timed: U(wt)(w) }),
          leaving: U(wt)(w) && !s.value.has(w.id),
          folded: _(w),
          refusal: l.value[w.id],
          onFold: (S) => I(w),
          onUndock: (S) => d(w, S),
          onMouseenter: (S) => A(w),
          onMouseleave: (S) => x(w)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        $.value ? (c(), G(fi, {
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
              onClick: T[0] || (T[0] = (w) => o.value = !0)
            }, [
              R(st, { name: "runs" }),
              se(" " + k(f.value.length) + " runs ", 1),
              R(Nt)
            ]),
            g("span", lv, [
              (c(!0), h(K, null, ee(f.value, (w) => (c(), G(ev, {
                key: w.id,
                item: w,
                onClick: (S) => W(w)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : E("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, p5 = /* @__PURE__ */ Y(cv, [["__scopeId", "data-v-c63f6dea"]]), bt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Ln = (e) => Math.min(Math.max(e, 0), 1), uv = (e) => {
  const t = Ln(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => uv((e - t) / (n - t));
function g5(e) {
  const t = Ln(e), n = Ln((t - 0.12) / 0.76) * bt.shuffles, s = Math.min(Math.floor(n), bt.shuffles - 1), a = n - s, o = gt(a, 0.26, 0.38) * (1 - gt(a, 0.76, 0.96)), r = gt(a, 0.38, 0.76), i = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), l = gt(a, 0.2, 0.34) * (1 - gt(a, 0.84, 1)), d = Math.sin(Math.PI * Ln((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / bt.shuffles, lift: bt.lift * o, ready: i, weight: l, follow: d, shuffle: s, phase: a };
}
function v5(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const _o = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, y5 = (e) => _o[e] ?? _o.butler, Ca = 2400, dv = 0.05;
function fv({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, dv), r = Math.min(t + Ca * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function k5(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function hv(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function w5(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const b5 = (e, t) => ({ ...e, stretch: t.stretch }), x5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, gi = (e, t) => t >= (e.least ?? 0);
function $5(e, t, n) {
  if (!gi(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const M5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), mv = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", Eo = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), pv = (e) => e.right > e.left && e.bottom > e.top;
function S5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(mv)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = Eo(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = Eo(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), pv(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function vi(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [u, f, m] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[u] - e[u];
      if (Math.abs(v) < 1e-9)
        (e[u] < o[f] || e[u] > o[m]) && (i = -1);
      else {
        const $ = (o[f] - e[u]) / v, M = (o[m] - e[u]) / v;
        r = Math.max(r, Math.min($, M)), i = Math.min(i, Math.max($, M));
      }
    }
    if (r > i || s && r >= s.share) continue;
    const l = e.x + (t.x - e.x) * r, d = e.y + (t.y - e.y) * r;
    s = { share: r, x: l, y: d, on: "surface", surface: a.id, dx: l - a.left, dy: d - a.top };
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
}, rn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), gv = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => gv(rn(e, t, n)), vv = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ut = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, An = ([e, t], n) => e + n() * (t - e);
function yv(e) {
  return vv.map(() => {
    const t = An(ut.speed, e), n = An(ut.angle, e) * Math.PI / 180, s = An(ut.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [An(ut.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const kv = yv(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function wv(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ut.gravity * (t[2] - ut.floor))) / ut.gravity;
}
function _5(e, t, n = kv) {
  const s = Me.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = wv(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), d = s.from.map((u, f) => u + o.velocity[f] * l);
  return d[2] -= ut.gravity * l * l / 2, { at: d, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const E5 = (e, t) => e && Me[e.name] ? { name: e.name, u: t / e.frames } : null;
function A5(e, t) {
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
const C5 = () => Array.from({ length: Me.pogo.count }, (e, t) => Me.pogo.bounce * (t + 1) / Me.pogo.count), Rt = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function O5(e, t, n) {
  const { away: s, side: a } = Me.bug_smash, o = a * s * n, [r, i] = [t.left + Rt.margin * n, t.right - Rt.margin * n], l = Math.min(Math.max(e + o + a * Rt.reach * n, r), i), d = l - o - e, u = l - (a * d > 0 ? d / 2 : 0);
  return { figure: [e - t.left, u - o - t.left], bug: [l - t.left, u - t.left] };
}
function T5(e, t, n) {
  const s = Me.bug_smash, a = Se(t, s.walk), o = ([r, i]) => r + (i - r) * a;
  return {
    figure: o(e.figure),
    steps: Math.abs(o(e.figure) - e.figure[0]) / (Rt.stride * n),
    way: Math.sign(e.figure[1] - e.figure[0]),
    bug: {
      dx: o(e.bug),
      below: Rt.tall * n * (1 - Se(t, s.emerge)),
      turn: 90 * (1 - Se(t, s.climb)),
      whole: t < s.blow,
      flat: t >= s.blow ? 1 : 0,
      shows: 1 - Se(t, s.gone)
    }
  };
}
function I5(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= Rt.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = fv({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function R5(e) {
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
function bv(e, t) {
  const n = Me.bug_shot, [s, a] = n.turn.map((u) => u * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = hv(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), d = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: d };
}
function B5(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Me.bug_shot, { frame: r, bug: i, shot: l } = bv(n, e.length), d = e.map((I, W) => ({ ...ra(I, t, Math.min(n / o.fps, Nn(W).shot)), shot: W < l })), u = Se(r / o.frames, o.aim), [f, m] = [d[Math.max(i - 1, 0)], d[i]], v = e.map((I, W) => ({ bug: I, index: W, seconds: n / o.fps - Nn(W).shot, spot: ra(I, t, Nn(W).shot) })).filter((I) => I.seconds >= 0), $ = v.flatMap((I) => {
    const W = (a == null ? void 0 : a.get(I.index)) ?? _v(I.bug, t, I.spot, a ? [] : s);
    return a == null || a.set(I.index, W), a && Ev(W, I.seconds, s), Av(W, I.seconds, s);
  }), M = v.filter((I) => Mv(I.bug)).map((I) => ({ seconds: I.seconds, from: I.spot })), _ = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - u) + +(e[i].wall === "top") * u;
  return { bugs: d, frame: r, target: { x: f.x + (m.x - f.x) * u, y: f.y + (m.y - f.y) * u, back: _ }, slush: $, camera: M };
}
function Nn(e) {
  const t = Me.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function L5(e, t, n, s) {
  const { limit: a, margin: o } = Me.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((d, u) => {
    const f = Nn(u), m = ra(d, t, f.shot), v = Math.abs(m.y - n.y) / Math.tan(a * Math.PI / 180), $ = m.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - m.x), M = Math.abs(m.x - l) >= v ? l : m.x + $ * v, _ = $ > 0 ? Math.max(l, Math.min(M, i)) : Math.min(l, Math.max(M, r)), I = { from: l, to: _, begin: f.walk, end: f.aim };
    return l = _, I;
  });
}
function N5(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, xv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function $v(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const Mv = (e) => e.along * 97 % 1 < xe.camera, ln = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function Sv(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const r = a.filter((d) => d.t >= 0).sort((d, u) => d.t - u.t)[0];
  let i = e.from;
  for (let d = 0; d < r.t; d += xe.step) {
    const u = Math.min(d + xe.step, r.t), f = ln(e, u), m = vi(i, f, n);
    if (m) return { ...m, t: d + (u - d) * m.share };
    i = f;
  }
  const l = ln(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function _v(e, t, n, s = []) {
  const a = $v(e.along + 1), [o, r] = xv[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: xe.count }, () => {
    const l = i + (a() - 0.5) * 2 * (xe.spread * Math.PI / 180), d = xe.speed[0] + a() * (xe.speed[1] - xe.speed[0]), u = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * d, vy: Math.sin(l) * d, r: xe.radius[0] + a() * (xe.radius[1] - xe.radius[0]) };
    return { ...u, ...Sv(u, t, s) };
  });
}
function Ev(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += xe.step) {
      const r = Math.min(o + xe.step, a), i = vi(ln(s, o), ln(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function Av(e, t, n = []) {
  return t < 0 ? [] : e.flatMap((s) => {
    if (t < s.t) return [{ ...ln(s, t), r: s.r, flying: !0 }];
    const a = t - s.t, o = 1 - Math.min(Math.max((a - xe.hold) / xe.fade, 0), 1);
    if (o <= 0) return [];
    const r = s.on === "surface" ? n.find((u) => u.id === s.surface) : null;
    if (s.on === "surface" && !r) return [];
    const i = r ? r.left + s.dx : s.x, l = r ? r.top + s.dy : s.y, d = r ? Math.min(a * a * 12, 48, Math.max(0, r.bottom - l)) : ["left", "right"].includes(s.on) ? Math.min(a * a * 8, 32) : 0;
    return [{ x: i, y: l, r: s.r * (1 + 1.2 * Math.min(a / 0.1, 1)), flying: !1, on: s.on, opacity: o, run: d, ...r ? { clip: r.clip ?? r } : {} }];
  });
}
function D5(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Me.bug_shot;
  if (e < 0) return [];
  const d = (a[1] - a[0]) * i / l, u = (o[1] - o[0]) * i / l, f = Se(e, [0, d]), m = Se(e, [d, d + u]);
  return r.map((v) => {
    const $ = { x: s.x + v.at[0] * t, y: s.y + v.at[1] * t };
    return {
      x: n.x + ($.x - n.x) * f,
      y: n.y + ($.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: m * m * t * 1.2,
      fade: 1 - m,
      landed: f >= 1
    };
  });
}
function P5(e, t, n, s, a) {
  const { sway: o, above: r } = Me.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [d, u] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (M) => {
    const [_, I] = [M.x - e.at.x, M.y - e.at.y];
    return { x: i.x + _ * d - I * u, y: i.y + _ * u + I * d };
  }, [m, v] = [...n].sort((M, _) => M.x - _.x), $ = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: $.map((M, _) => ({ from: M, to: _ < $.length / 2 ? m : v })) };
}
const j5 = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Hn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: rn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: rn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function q5(e, t) {
  const n = Me[e];
  if (e === "pack_box") {
    const { into: s, held: a, out: o } = Hn(n, t), r = 1 - (1 - n.small) * Se(s, n.shrinks) * (1 - Se(o, n.grows)) + 0.02 * Math.sin(2 * Math.PI * 2 * (a ?? 0));
    return { x: r, y: r };
  }
  if (e === "press") {
    const { into: s, out: a } = Hn(n, t), o = n.flat * Se(s, n.squashes) * (1 - Se(a, n.frees)), r = 0.14 * Math.sin(2 * Math.PI * rn(a, ...n.springs)) * (1 - rn(a, ...n.springs));
    return { x: 1 + 0.5 * o - r / 2, y: 1 - o + r };
  }
  return null;
}
const F5 = (e) => e === "pack_box";
function W5(e) {
  const { into: t, out: n } = Hn(Me.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function H5(e) {
  const t = Me.rope_swing, { into: n, out: s } = Hn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const Cv = { after: 3 }, Oa = 10, Ov = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Tv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, Iv = { weight: 19 }, yi = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, Rv = { every: 120 }, ki = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, wi = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Bv = {
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
}, vn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Oa }), te = (e, t, n = {}) => vn(e, "clip", t, n), $s = (e, t, n = {}) => vn(e, "look", t, n), Ao = (e, t, n = {}) => vn(e, "gaze", t, n), fe = (e, t, n = {}, s = {}) => ({ ...vn(e, "pick", t, n), ...s }), ye = (e) => vn("nothing", "nothing", e, {}), Lv = 120, Nv = 300, Ms = (e, t) => ({ ...te(e, t), cooldown: Nv }), oe = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Dv = () => [te("joy", 2)], vt = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), yt = (e) => ({ ...e, cooldown: Ov[e.name] }), Jt = (e) => ({ ...e, shenanigan: !0, lasts: Tv[e.name] }), ss = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...oe("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [te("nod", 2), ye(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...oe("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...yt(te("bug_shot", 3)), toward: "", onto: !1 },
    { ...yt(te("bug_smash", 2)), toward: "", onto: !1 },
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
  ...oe("reported", { cooldown: 90 }, [Ao("read", 3), te("nod", 1), ye(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...oe("read_message", { cooldown: 30 }, [Ao("read", 3), ye(1)]),
  ...oe("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ye(6)]),
  ...oe("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ye(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...oe("bar_done", { holds: !0 }, Dv()),
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
  ...Object.entries(Bv).flatMap(([e, t]) => oe(`reacted:${e}`, {}, [$s(t, 1)])),
  ...Object.entries(ki).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => oe(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(wi).flatMap(([e, t]) => oe(`agent_reacted:${e}`, {}, [te(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...oe("pastime", {}, [
    vt("stretch", 3, 90, 90),
    // after a long quiet it lies down on its back for a while, whistling, on any floor it stands on
    vt("rest", 3, 180, 120),
    vt("yawn", 2, 60, 60),
    vt("whistle", 4, 45, 60, { when: { voices: ["coach"] } }),
    vt("sip", 4, 45, 60, { when: { voices: ["colleague"] } }),
    vt("groove", 4, 45, 60, { when: { voices: ["homie"] } }),
    vt("shield_polish", 4, 45, 60, { when: { voices: ["squire"] } }),
    // the shenanigan: it hops up the bubbles off the top of the chat and comes back down on a parachute (figure/skyward.js); it turns
    // a salto only now and then on a high jump up onto a bubble (the jump moment), never where it stands
    { ...Jt(yt(te("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Jt(yt(te("disco", 2, { ball: "bubble" }))),
    ye(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...oe("held:search", { cooldown: Lv }, [Ms("search", 3), { ...Ms("binoculars", 2), when: { home: !0 } }, { ...Ms("glass_bubble", 2), when: { bubble: !0 } }]),
  ...oe("held:type", {}, [te("type", 3), te("type_ponder", 1)]),
  ...oe("held:compacting", {}, [te("pack_box", 3), te("vacuum", 2), te("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...oe("spell", {}, [fe("writing", 12, { state: "writing" }), fe("reading", 12, { state: "reading" }), fe("searching", 12, { state: "searching" }), ye(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...oe("tickled", {}, [{ ...yt(te("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...oe("eager", {}, [te("eager", 2, { slow: !0 }), ye(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...oe("jump", {}, [Jt(yt(te("backflip", 7, { high: !0 }))), te("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...oe("climb", {}, [fe("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...oe("unit", { cooldown: yi.build.cooldown }, [fe("unit", Iv.weight), ye(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...oe("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...oe("perch", {}, [{ ...fe("hang", 1, { hands: !0, free: !0 }), cooldown: Rv.every }, fe("stand", 5)]),
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
    Jt(yt(fe("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], bi = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), xi = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Pv = (e) => Array.isArray(e) ? e[0] : e, jv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, qv = (e) => ss.some((t) => t.when.moment === e);
function Fv(e) {
  var d;
  const t = e.has ?? (() => !0), n = (u) => e.now - (e.memory.get(u) ?? -1 / 0), s = (u) => !e.memory || xi(u).every(([f, m]) => n(f) >= Pv(m)), a = (u) => !u.shenanigan || u.lasts <= (e.room ?? 0), o = ss.filter((u) => bi(u.when, e) && (u.kind !== "clip" || t(u.name)) && s(u) && a(u)), i = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= Cv.after && o.some((u) => u.shenanigan) ? o.filter((u) => u.shenanigan) : o, l = i.filter((u) => {
    var f;
    return u.kind === "nothing" || u.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((u) => u.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = Fv(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : ($i(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function $i(e, t, n) {
  var s;
  for (const [a, o] of xi(t)) (s = e.memory) == null || s.set(a, e.now + jv(o, n));
}
function U5(e, t, n) {
  $i(e, ss.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const z5 = (e) => Object.values(yi).find((t) => bi(t.when, e)) ?? null, Wv = (e, t, n) => n - t <= (e.lifetime ?? Oa), V5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || gi(e.clip, t));
class Mi {
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
}, G5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), Si = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), K5 = {
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
}, Y5 = 120, Hv = 20, J5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < Hv), Uv = (e) => ia[e] || ia.idle, Z5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, _i = "airborne", zv = "landing", Vv = "travelling", Ei = "grounded", X5 = ({ airborne: e, landing: t, trip: n }) => e ? _i : t ? zv : n != null && n.started ? Vv : Ei;
function Q5(e, t) {
  var a;
  const n = Gv(e, t);
  return e.mode === Ei && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function Gv(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: d, doing: u, doingFacing: f = 0, readingFacing: m = null } = e;
  if (n === _i && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Kv(o, u, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && d === "asking") return { clip: "point", facing: 0 };
  const v = m !== null && i.posture === "stand" && u !== "push";
  return ["asking", "waiting"].includes(d) && !["work", "push"].includes(u) ? { clip: "waiting", facing: v ? m : e.composeFacing ?? 0 } : { clip: t(u, i.posture) ? u : Uv(d), facing: v ? m : i.posture === "sit" ? i.face : f };
}
function Kv(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const la = (e) => e.outcome, Yv = "plugin:code-commandments:sins:", Co = (e) => e.type === "plugins.card" && e.markKey.startsWith(Yv), Jv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Co(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Co(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], e4 = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: Ar(n) })).sort((n, s) => n.time - s.time), Oo = { user: "reacted", agent: "agent_reacted" };
function t4(e, t) {
  return e.filter((n) => Oo[n.author] && $t(n) > t).map((n) => ({ beat: `${Oo[n.author]}:${n.emoji}`, time: $t(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const Zv = [.../* @__PURE__ */ new Set([...Object.values(ki).flatMap((e) => Object.keys(e)), ...Object.keys(wi)])];
function n4(e, t) {
  return e.filter((n) => n.author === "agent" && $t(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = Zv.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: $t(n), card: Ar(n) })).sort((n, s) => n.time - s.time);
}
const Xv = (e) => new Mi(e).isTest(), Un = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[la(e)] || "";
}, Qv = 1800, ey = (e, t) => {
  if (Un(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Un(n) !== "finished" && Number(e.time) - Number(n.time) <= Qv ? "tests_fixed" : "tests_passed";
};
function s4(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(Xv), a = s.filter((i) => Un(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Un(i))), o.map((i) => ({ beat: ey(i, a), time: Number(i.time), card: i.key }));
}
function a4(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(la(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: la(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const o4 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: $t(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function r4(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function i4(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function l4(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = Jv.find((d) => d.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ta(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const To = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function ty(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ta(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function c4(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : qv(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function u4(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const Io = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function d4(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, d = Io((i - l) / Oe.returnSeconds), u = i <= l ? Io(i / l) : 1 - d, f = r + ((r + 1) % a - r) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * u, y: e.top + s + f * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Ro = 3, Ai = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Bo = 12, f4 = (e, t) => ({ mood: e, began: t, seen: 0 });
function h4(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Ai(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= Ro ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * Bo) / Bo, lasts: Ro } };
}
const m4 = (e) => e.posture === "hang" && !Ai(e.face), ny = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), sy = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function p4(e, t, n) {
  return ny.has(e) ? 1 / 0 : !sy.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(Ci(n - t.began, t.share) - Qe.lead, 0);
}
const ay = 5;
function g4(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= ay ? { beat: "long_walk", time: n } : null };
}
const oy = 30, Cn = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function v4(e, t, n, s, a = null) {
  if (t && n < t.until || !Cn.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = Cn.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + Cn.every } : { state: e, began: 0, until: 0, next: n + Cn.every };
}
const y4 = (e, t, n) => t && n < t.until && Si.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, Ci = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function k4(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = Ci(o, e.share);
  return a ? { eager: ry(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function ry(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const iy = 1, ly = { look: "look", gaze: "gaze" };
function cy(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [ly[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const uy = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), dy = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > iy * t, memory: s, now: a, room: o }, n).name === "backflip", fy = { work: ["building"], idle: ["standing"] };
function w4(e, t, n, s) {
  const a = ia[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(fy[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), Si.has(e) ? { moments: o, began: n || s } : (n && s - n >= oy && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function hy(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Lo = { pondering: hy };
function b4(e, t, n, s, a, o) {
  if (Lo[e.beat]) {
    const i = Lo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = cy(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== Oa && { lifetime: r.lifetime } } } : null;
}
function x4(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = uy(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const $4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function M4(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function S4(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const _4 = (e, t) => !!(e != null && e.watches) && !t.once, E4 = 10, A4 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || Wv(s, s.queuedAt, n)), C4 = (e, t) => t ? null : e[0] ?? null;
function O4(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const T4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), my = 2 * Math.PI, py = 500;
function I4(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / py, l = t && e.point && !!t.behind != !!e.point.behind, d = l && e.amount > 0, u = t && !d ? o : 0, f = e.amount < u ? Math.min(e.amount + i, u) : Math.max(e.amount - i, u), m = my * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, M = (d ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !l ? a && !t.behind && !v.behind ? vy(v, t, n, m, a) : ky(v, t, n, m) : t) ?? v, _ = M != null && M.behind && M.mood === "reading" ? gy(e.point, M, n, r, a) : M;
  return { point: _ ?? null, toward: _ ? { x: _.x - n.x, y: _.y - n.y } : null, amount: f, at: s };
}
function gy(e, t, n, s, a) {
  const o = (w) => w * 180 / Math.PI, r = (w) => o(Math.atan2(Math.sin(w * Math.PI / 180), Math.cos(w * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, d = r(o(Math.atan2(t.x - n.x, -l)) - i), u = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), m = f ? r(e.readingFacing - i) : 0, v = f ? e.readingYaw + m : u, $ = v + r(d - v), M = Math.min(Math.max(s / 1e3, 0), 0.1), _ = Oe.turnSpeed * M, I = f ? v + Math.min(Math.max($ - v, -_), _) : $, W = f ? e.readingFollow + m : I, Q = W + (I - W) * (1 - Math.exp(-M / Oe.followSeconds)), A = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, x = o(Ta(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), C = Math.min(Math.max(x, -A.up), A.down), y = Oe.tipSpeed * M, T = f ? e.readingPitch + Math.min(Math.max(C - e.readingPitch, -y), y) : C;
  return { ...t, readingYaw: I, readingFollow: Q, readingPitch: T, readingFacing: i };
}
function vy(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (W) => {
    const { yaw: Q, pitch: A } = Ta(W.x - n.x, a, n.y - W.y, o);
    return { yaw: Q, pitch: Math.min(Math.max(A, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, d] = [To(i(e)), To(i(t))], u = Math.acos(Math.min(Math.max(l[0] * d[0] + l[1] * d[1] + l[2] * d[2], -1), 1));
  if (u <= s) return { ...t };
  const f = s / u, [m, v] = [Math.sin((1 - f) * u) / Math.sin(u), Math.sin(f * u) / Math.sin(u)], [$, M, _] = l.map((W, Q) => m * W + v * d[Q]), I = a * $ / M;
  return { ...t, x: n.x + I, y: n.y - ty(I, a, -Math.asin(Math.min(Math.max(_, -1), 1)), o) };
}
const yy = 0.15;
function R4(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= yy;
}
function ky(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const wy = (e) => !(e != null && e.on);
function B4(e, t, n) {
  if (wy(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const cn = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, Ss = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), No = (e) => e * e * (3 - 2 * e);
function by(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = Ss(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, s = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - No(Ss(e, ...Je.fade)), lit: s, white: e < Je.flash[0] ? 0 : 1 - No(Ss(e, ...Je.flash)) };
}
const L4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function N4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = by(t - e.at);
  return s && { colour: cn.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...s } };
}
function D4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function P4(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= cn.looks || s === null && n - e.since >= cn.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function j4(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const lt = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, q4 = { behind: 39, figure: 40, ahead: 41 }, xy = "[data-figure-pile]", $y = { amber: [1, 0.69, 0.125], good: cn.colours.good, bad: cn.colours.bad }, Dn = { phases: 4, ms: 230, dim: 0.25 }, F4 = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, W4 = (e) => e === "amber" ? Dn.phases : 1;
function H4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const U4 = Object.keys($y), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Zt = ([e, t], n) => e + n() * (t - e);
function z4(e) {
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
function V4(e) {
  const t = Math.floor(e / _s.high);
  return { left: -(lt.inside + lt.width / 2 + t * (lt.width + _s.gap)), up: e % _s.high * (lt.height - lt.top) };
}
const My = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, Sy = { after: 5 }, _y = (e) => e.filter((t) => t.active && (t.process || t.watch) && new Mi(t).isBuild());
function G4(e, t, n) {
  const s = _y(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= Sy.after ? a : null;
}
function K4(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: My(n, s, a) } : null;
}
const Do = { ahead: 140, up: 70 };
function Y4(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * Do.ahead, y: s - Do.up } } : o ? { at: { x: n(o), y: s - o.up - lt.height } } : t ? { at: null } : null;
}
const Es = { least: 4e3, most: 1e4 }, Ey = (e) => Es.least + e() * (Es.most - Es.least), kt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function J4(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = Ey(t);
    if (n.length >= kt.most || t() >= kt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (kt.at[0] + t() * (kt.at[1] - kt.at[0]));
    n.push({ from: o, to: o + kt.ms }), s = o + kt.ms;
  }
}
const Z4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), X4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Oi = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), Q4 = new Set(ss.filter((e) => Oi.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), Ay = (e) => e.some((t) => t.state === "built"), ex = (e, t) => Ay(t) ? e.filter((n) => !Oi.has(n.beat)) : e, dt = { reach: 40, room: 6 }, Cy = (e, t) => t <= e - dt.reach + 2, tx = (e, t, n) => Cy(e, n) ? t - dt.reach : e - dt.reach - dt.room, nx = (e, t, n, s) => s > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, As = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, sx = (e) => Zt(e() < As.longShare ? As.long : As.short, e), Oy = 2 * lt.width;
function ax(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= Oy ? o : e + (o - e + a / 2) % a;
}
const Ty = 60, ox = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= Ty, Po = "[data-figure-home]", yn = () => {
  var t;
  const e = document.querySelector(Po);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Po)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Iy = "[data-figure-docked-bars]", Ry = "[data-figure-chat-foot]", By = [0.85, 0.6, 0.35, 0.15], Ly = ["question", "waiting", "suggestion"], rx = (e, t) => Ly.find((n) => e[n] > 0 && t[n] === "behind") || null;
function ix() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const Ny = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", Dy = "[data-figure-newest]";
function Ti() {
  var s, a;
  const e = (s = yn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(Dy), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var r, i;
      return !((r = o.closest) != null && r.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((i = o.getAttribute) == null ? void 0 : i.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !Ia(o)) continue;
    const r = o.getBoundingClientRect();
    if (r.right > r.left && r.bottom > r.top) return r;
  }
  return null;
}
function un(e, t, n = Ti()) {
  if (!e || !n) return !0;
  const s = at(e, t), a = os(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ce.top * t.size, bottom: s.top + Ce.bottom * t.size }, r = bt.gap;
  return !as(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function lx(e, t, n, s = Ti()) {
  if (!s || un(t, e, s)) return null;
  const a = os(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = _t(), l = t.posture === "stand" ? Ba * e.size : ji * e.size, d = Math.max(n.left + l, i.left + o), u = Math.min(n.right - l, i.right - r);
  return [s.left - bt.gap - r, s.right + bt.gap + o].map((m) => ({ ...t, x: m })).filter((m) => m.x >= d && m.x <= u && un(m, e, s) && fk(m, e)).sort((m, v) => Math.abs(m.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const Cs = 0.26, Ii = 0.54, Py = 1.25 / 5.4, kn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Cs, travels: "stand" },
  lounge: { drop: Cs, travels: "stand" },
  composed: { drop: Cs, travels: "stand" },
  hang: { drop: Ii, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, cx = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * Py * Math.cos(t * Math.PI / 180),
  y: 1 - n - Ii
}), Xt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), jy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), ux = (e, t) => (e === "sit" ? jy.has(t) : Xt.has(e)) ? e : "stand";
function dx(e, t) {
  return e.facing === t.facing || !Xt.has(e.posture) && !Xt.has(t.posture) ? t : { posture: "stand", facing: Xt.has(e.posture) ? e.facing : t.facing };
}
const fx = 0.25, hx = (e, t) => Xt.has(e) && kn[t].drop === 0, Ri = 2, qy = 90, Fy = 180, Wy = 140, Hy = 280, Uy = 420, zy = 0.25, Vy = 290, Gy = 600, Ky = "cubic-bezier(0.2, 0.7, 0.4, 1)", Yy = "cubic-bezier(0.55, 0, 0.9, 0.6)", Os = 5;
function zn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: d = null, now: u = 0, room: f = 0, pogo: m = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Os) return null;
  (r || i) && (o = Math.max(o, Ri));
  const v = o > 1, $ = Math.abs(t.x - e.x), M = $ < Os ? 0 : $ / (qy * o) * 1e3, _ = Math.min(M, v ? Wy : Fy), I = Math.abs(t.y - e.y), W = t.y < e.y, Q = W && !m && dy(I, n, l, d, u, f), A = W ? Uy + Math.min(I, 400) * zy : Math.sqrt(2 * I / Ca) * 1e3, x = {
    x: t.x,
    y: t.y,
    ms: I > Os ? Q ? Gy : A : 0,
    lead: Q ? Vy : W ? Hy : 0,
    easing: W ? Ky : Yy,
    hopping: !0,
    clip: Q ? "backflip" : W ? "jump" : "fall"
  }, C = { x: t.x, y: t.y, ms: M + _, lead: 0, easing: "linear", ramp: _, ...v ? { clip: "run" } : {} }, y = m ? Jy(t, n) : x, T = W && !s ? [{ ...C, y: e.y }, y] : [{ ...x, x: e.x }, C];
  return { way: Math.sign(t.x - e.x) || 1, legs: T, lands: !a, pace: o, running: v };
}
const Jy = (e, t) => ({ x: e.x, y: e.y, ms: Me.pogo.frames / Me.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Zy = (e, t) => e.postures.includes(t) ? t : e.postures[0], mx = (e, t, n) => e.posture === "walk" && n ? "walk" : Zy(e.clip, t), at = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - kn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, as = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, Ia = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function _t() {
  var t;
  const e = (t = yn()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const On = 0.5, jo = 20;
function px(e, t, n = _t()) {
  const s = at(e, t);
  return s.left >= n.left + jo && s.right <= n.right - jo;
}
function Ra(e, t, n = _t()) {
  const s = at(e, t), a = s.right - s.left, o = os(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - On && i <= n.right + On && s.top >= n.top - On && l <= n.bottom + On;
}
const Vn = [0.35, 0.5, 0.65], Gn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Vn[0], right: Vn.at(-1), top: Gn[0], bottom: Gn.at(-1) }, Xy = 0.24;
function os(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Xy * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Qy(e, { size: t }, n = _t()) {
  const s = os(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Ba = (Ce.right - Ce.left) / 2 + 0.08;
function gx(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - kn[e].drop) };
}
const ek = "[data-figure-agent]";
function Bi(e, t, n = "", s = "") {
  var i;
  const a = (i = document.caretRangeFromPoint) == null ? void 0 : i.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !Ia(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, r = Math.min(a.startOffset, o.length - 1);
  for (const l of [r - 1, r].filter((d) => d >= 0)) {
    if (!o.data[l].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, l), d.setEnd(o, l + 1), [...d.getClientRects()].some((u) => e >= u.left && e <= u.right && t >= u.top && t <= u.bottom)) return !0;
  }
  return !1;
}
const Li = (e) => Gn.flatMap(
  (t) => Vn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function La(e, t, n = "") {
  if (!un(e, t)) return Vn.length * Gn.length;
  const s = at(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Ny)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && as(a, l) && Ia(i)).map(({ rect: i }) => i), r = (i, l) => o.some((d) => i >= d.left && i <= d.right && l >= d.top && l <= d.bottom);
  return Li(a).filter(([i, l]) => r(i, l) || Bi(i, l, n)).length;
}
function tk(e, t) {
  const n = at(e, t);
  return Li({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => Bi(s, a, "", ek)).length;
}
const qo = 4;
function vx(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = qo; o <= a; o += qo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!tk(i, e) && un(i, e)) return i;
    }
  return null;
}
function dn(e, t, n) {
  const s = _t(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Ra(r, t, s) && un(r, t)).map((r) => ({ spot: r, covered: La(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Ni = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), nk = [0.5, 0.25, 0.75], sk = (e) => Ni(e.getBoundingClientRect(), nk), Di = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, ak = Ba, ok = (e, t, { size: n }, s = ak) => Pi(e, Di[t], s * n, "stand");
function Pi(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const rk = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, ji = 0.1, ik = (e, t, { size: n }) => Pi(e, rk[t], ji * n, "sit"), lk = (e) => ((e + 180) % 360 + 360) % 360 - 180, Ts = 60;
function yx(e, t) {
  const n = lk(t);
  return !e.aside || Math.abs(n) >= Ts ? t : n < 0 ? 360 - Ts : Ts;
}
const Qt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, ck = (e) => [.../* @__PURE__ */ new Set([e, ...Qt.turns.map((t) => (t + 360) % 360)])];
function kx(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = ck(t), r = Qt.every[0] + s() * (Qt.every[1] - Qt.every[0]);
  return { face: t, from: a ? uk(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function uk(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Qt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function wx(e, t) {
  const { element: n, edge: s } = rs(), a = ["left", "right"].map((i) => wn(ik(s, i, e), e)).filter((i) => n && Ra(i, e) && !La(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function bx(e, t, { size: n }) {
  const s = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - qi } : e;
}
const qi = 7;
function Fi() {
  const e = [...document.querySelectorAll(xy)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function dk(e, t) {
  const n = at(e, t), s = n.right - n.left;
  return { left: n.left + Ce.left * s, right: n.left + Ce.right * s, top: n.top + Ce.top * s, bottom: n.bottom };
}
function fk(e, t) {
  const n = Fi();
  return !n || !as(dk(e, t), n);
}
const hk = 4;
function rs() {
  const e = bn(), t = Fi(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > hk || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - qi - n, 0) } };
}
const xx = ({ size: e, below: t }) => (1 - t) * e;
function wn(e, t) {
  const n = _t(), { size: s, below: a } = t, o = kn[e.posture].drop * s;
  return { ...Qy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const ca = (e, t) => Object.keys(Di).map((n) => wn(ok(e, n, t), t)), Na = (e, t) => Ni(e, By).map((n) => wn(n, t)), Wi = (e, t, n) => dn(e, t, n) ?? e[0];
function $x(e, t) {
  const { element: n, edge: s } = rs();
  return { ...Wi(ca(s, e), e, t), view: null, on: n };
}
function Mx(e, t, n, s) {
  const { element: a, edge: o } = rs(), r = (s ? ca(o, t) : [...ca(o, t), ...Na(o, t)]).filter(
    (d) => !as(at(d, t), e)
  ), i = dn(
    r.filter((d) => d.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !La(i, t) ? i : dn(r, t, n);
  return l && { ...l, view: null, on: a };
}
function bn() {
  var s;
  const e = yn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Iy);
  if (!t) return { ...is(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const Fo = { within: 2 };
function Sx(e) {
  const { element: t, docked: n, edge: s } = bn();
  if (!n || e.on !== t) return !0;
  const a = is().edge;
  return s.left > a.left + Fo.within || s.left + s.width < a.left + a.width - Fo.within;
}
const mk = "[data-figure-closing]";
function _x() {
  var n;
  const { element: e, docked: t } = bn();
  return t && !!((n = e.firstElementChild) != null && n.matches(mk));
}
const Hi = "[data-figure-progress]";
function Ex(e) {
  const t = e.querySelector(Hi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function Ax(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const pk = { across: 300, above: 380, below: 60 };
function Cx(e) {
  const { across: t, above: n, below: s } = pk;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: gk(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const gk = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Ui = "[data-figure-bar]", ua = { back: 144, along: 0.4 };
function Ox(e) {
  const { element: t, docked: n, edge: s } = bn(), a = n ? t.querySelector(Ui) : null;
  if (!(a != null && a.querySelector(Hi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...wn({ x: o - ua.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function Tx(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < ua.along * s.size ? t.x + ua.along * s.size : e.x, y: e.y, behind: !0 };
}
function Ix(e) {
  const t = e.querySelector(Ui), n = t == null ? void 0 : t.firstElementChild;
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
function Rx(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = is(), l = n === null ? vk(i, e, o === null ? t : { x: o, y: i.top }, s, a) : wn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function vk(e, t, n, s, a) {
  const o = Na(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + lt.width < a && l.x + s - dt.reach - dt.room >= r);
  return dn(i.length ? i : o, t, n);
}
const yk = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function Bx(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: d = null, now: u = 0, room: f = 0, pogo: m = !1 } = {}) {
  (o || r) && (a = Math.max(a, Ri));
  const v = (Q) => {
    const A = at(Q, n, kn[Q.posture].travels);
    return { x: A.left, y: A.top };
  }, $ = t.ladder ?? e.ladder;
  if ($ && !(t.ladder && e.ladder)) return kk(v(e), v(t), v({ ...$.foot, posture: "stand" }), $.way, !!t.ladder, n, a);
  const [M, ..._] = [e, ...l, t].map(v), I = zn(M, _[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: d, now: u, room: f, pogo: m }), W = _.slice(1).map((Q, A) => {
    var x;
    return (x = zn(_[A], Q, n.size, { random: i, memory: d, now: u, room: f })) == null ? void 0 : x.legs.find((C) => C.hopping);
  });
  return I && { ...I, legs: [...I.legs, ...W.filter(Boolean)] };
}
function kk(e, t, n, s, a, o, r) {
  const i = (u, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - u.x, f.y - u.y) / yk.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? zn(e, n, o.size, { pace: r }) : zn(n, t, o.size, { pace: r }), d = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: r, running: r > 1 };
}
function Lx(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function Nx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && dn(sk(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = rs();
  return { ...Wi(Na(a, t), t, n), view: null, on: s };
}
const wk = "[data-figure-bubble]", bk = 250;
let en = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), zi = 0;
const Ut = () => en, Is = /* @__PURE__ */ new WeakMap();
let xk = 0;
function Da(e) {
  return Is.has(e) || Is.set(e, `floor-${++xk}`), Is.get(e);
}
const $k = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Mk = () => {
  var e, t;
  return ((t = (e = yn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Sk(e, t) {
  var s;
  const n = (s = e.querySelector(Ry)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function _k(e, t) {
  const n = e && Sk(e, t), s = e ? [...e.querySelectorAll(wk)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || $k(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: Da(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const Ek = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= bk ? (t.top - s.top) / a * 1e3 : 0;
};
function Vi(e = en, t = performance.now()) {
  const n = _t(), s = Mk(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = bn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const d = is();
  return d.element && l.push({ id: Da(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), l.push(..._k(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((u) => Object.freeze({ ...u, vy: Ek(e, u, t) }))) });
}
const da = /* @__PURE__ */ new Set();
function Ak(e) {
  return da.add(e), () => da.delete(e);
}
function Ck() {
  Gi();
  const e = () => {
    zi = requestAnimationFrame(e), !document.hidden && (en = Vi(en), da.forEach((t) => t(en)));
  };
  e();
}
function Gi() {
  cancelAnimationFrame(zi);
}
const Pa = 5, Ok = 56, Tk = { share: 0.6 }, Ik = (e) => -Math.sqrt(2 * Ca * Tk.share * e), Dt = (e, t) => e.find((n) => n.id === t) ?? null;
function Dx(e, t = Vi().floors) {
  const n = Dt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : Da(e.on) : null, o = a && Dt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function Ki({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = Ut().floors) {
  const d = Dt(l, e);
  if (!d) return null;
  const u = { x: d.left + t, y: d.top + n, posture: s, face: a };
  return (r || Rk(d, u, o)) && Bk(u, i, l) ? { x: u.x, y: u.y } : null;
}
const ja = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, Rk = (e, t, n) => !ja({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function Px(e, t = Ut().floors) {
  if (!ja(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Pa && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function Bk(e, t, n = Ut().floors) {
  const s = Dt(n, "home");
  return e.posture === "hang" && s && at(e, t).bottom >= s.top ? !1 : Ra(e, t);
}
function jx(e, t, n, s = Ut().floors) {
  const a = Ki(e, n, s);
  if (!e.home) return Lk(e, t, a, s);
  if (!a) return null;
  const o = Dt(s, "home"), r = a.y - t.y, i = r > Pa ? "dropping" : -r > Ok ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function Lk(e, t, n, s) {
  const a = n ? Dt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: Ik(e.risen) };
  if (!n) return null;
  if (ja(t) && n.y - t.y > Pa) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function qx(e, t, n) {
  const s = Ba * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function Fx(e, t, n, s = Ut().floors) {
  const a = t && Ki(t, n, s);
  return a ? { ...e, ...a } : e;
}
const Nk = ["data-kind"], Dk = { class: "figure-floor-name" }, Pk = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: me({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", Dk, k(e.floor.kind), 1)
    ], 12, Nk));
  }
}, jk = /* @__PURE__ */ Y(Pk, [["__scopeId", "data-v-8f6132da"]]), qk = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Fk = {
  __name: "FigureFloors",
  setup(e) {
    const t = Bt(Ut().floors);
    let n = () => {
    };
    return Ne(() => {
      n = Ak((s) => t.value = s.floors), Ck();
    }), Te(() => {
      n(), Gi();
    }), (s, a) => (c(), h("div", qk, [
      (c(!0), h(K, null, ee(t.value, (o) => (c(), G(jk, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Wx = /* @__PURE__ */ Y(Fk, [["__scopeId", "data-v-e519168b"]]), Rs = (e) => typeof e == "number" ? e : Date.parse(e);
function Hx(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Rs(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Rs(a.row.created_at) - Rs(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Wk = 3, Bs = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Hk(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Bs[n.grouping]) == null ? void 0 : s.call(Bs, e.row, n)) || "";
}
function Uk(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Ux(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Wk ? [Uk(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = Hk(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const zk = 1e3;
function Vk() {
  const e = O(Date.now()), t = setInterval(() => e.value = Date.now(), zk);
  return jt(() => clearInterval(t)), e;
}
const Gk = ["datetime", "title"], ls = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Vk(), s = N(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, k(U(wm)(e.at, U(n))), 9, Gk));
  }
};
function Kk(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const zx = (e) => (t) => t.filter((n) => n.id !== e), Vx = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), Gx = (e) => (t) => [...t, e], Kx = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function Yx(e) {
  const t = Wt(), n = O(null), s = O("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
function Jx(e) {
  const t = Wt(), n = O("");
  async function s(a) {
    const o = await t.run(a);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: s };
}
const Tn = /* @__PURE__ */ new Map();
function Yk(e, t) {
  if (Tn.has(e)) return Tn.get(e);
  const n = t().finally(() => Tn.delete(e));
  return Tn.set(e, n), n;
}
function Zx() {
  const e = Wt(), t = O(null), n = O("");
  async function s() {
    const a = await Yk(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Jk = { class: "cards-page" }, Zk = { class: "cards-bar" }, Xk = { class: "cards-count" }, Qk = { class: "cards" }, ew = {
  key: 1,
  class: "cards-note"
}, tw = {
  key: 2,
  class: "cards-note"
}, nw = ["data-row", "onClick"], sw = { class: "card-head" }, aw = { class: "card-title" }, ow = { class: "card-foot" }, rw = {
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
    return (s, a) => (c(), h("div", Jk, [
      g("div", Zk, [
        g("span", Xk, k(e.rows.length) + " " + k(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        R(he, nt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: P(() => [
            R(ge, {
              name: "plus",
              size: 12
            }),
            se(" New " + k(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Qk, [
        e.loaded ? e.failure ? (c(), h("p", ew, k(e.failure), 1)) : e.rows.length ? E("", !0) : (c(), h("p", tw, "No " + k(e.noun) + "s yet", 1)) : (c(), G(Ft, {
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
          g("span", sw, [
            R(ge, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            se(" " + k(e.head(o)), 1),
            R(ls, {
              class: "card-age",
              at: o.created_at
            }, null, 8, ["at"])
          ]),
          g("span", aw, k(e.title(o)), 1),
          g("span", ow, k(e.foot(o)), 1)
        ], 8, nw))), 128))
      ]),
      ue(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Xx = /* @__PURE__ */ Y(rw, [["__scopeId", "data-v-990e6b37"]]), Wo = "newest";
function Qx(e, { title: t, isOpen: n = null }) {
  var d;
  const s = (d = _e(Ae, null)) == null ? void 0 : d.search, a = O(""), o = O(Wo), r = O("all"), i = N(() => {
    const u = a.value.trim().toLowerCase(), f = e.value.filter((m) => Kk(m, u, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(m) === (r.value === "open")));
    return o.value === Wo ? f : [...f].sort((m, v) => t(m).localeCompare(t(v)));
  }), l = N(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const iw = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, lw = 40, cw = "top", uw = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = _e(Ae, null)) == null ? void 0 : f.autoScroll, a = N(() => s === cw), o = O(null), r = O(!1), i = (m) => a.value ? m.scrollTop : m.scrollHeight - m.scrollTop - m.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function u() {
      r.value = i(o.value) >= lw;
    }
    return ve(() => n.rowCount, async () => {
      await mt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (m, v) => (c(), h("div", iw, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: u
      }, [
        ue(m.$slots, "default", {}, void 0, !0)
      ], 34),
      R(Pt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: P(() => [
          ft(g("button", {
            type: "button",
            class: "auto-scroll-newest",
            "data-scroll-newest": "",
            title: "Back to the newest",
            onClick: d
          }, [
            R(ge, {
              name: a.value ? "up" : "down"
            }, null, 8, ["name"]),
            v[0] || (v[0] = se(" Newest ", -1))
          ], 512), [
            [ul, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, e$ = /* @__PURE__ */ Y(uw, [["__scopeId", "data-v-3accb764"]]), dw = ["aria-selected", "data-tab", "onClick"], fw = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, hw = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var f;
    const n = e, s = t, a = ((f = _e(Ae, null)) == null ? void 0 : f.tabs) ?? [], o = O(null), r = O({ left: 0, width: 0, slides: !1 }), i = (m) => n.answer[m.count_field] !== void 0;
    function l(m) {
      var $;
      const v = ($ = o.value) == null ? void 0 : $.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: m }, o.value.scrollWidth > o.value.clientWidth && (o.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const d = () => mt(() => l(!0));
    let u = null;
    return Ne(() => {
      var m;
      l(!1), u = new ResizeObserver(() => l(!1)), u.observe(o.value), (m = document.fonts) == null || m.ready.then(() => l(!1));
    }), Te(() => u == null ? void 0 : u.disconnect()), ve(() => {
      var m;
      return (m = n.active) == null ? void 0 : m.key;
    }, d), ve(() => n.answer, d, { deep: !0 }), (m, v) => (c(), h("div", {
      ref_key: "band",
      ref: o,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(K, null, ee(U(a), ($) => {
        var M, _;
        return c(), h("button", {
          key: $.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((M = e.active) == null ? void 0 : M.key) === $.key }]),
          "aria-selected": ((_ = e.active) == null ? void 0 : _.key) === $.key,
          "data-tab": $.key,
          onClick: (I) => s("choose", $)
        }, [
          se(k($.label) + " ", 1),
          i($) ? (c(), h("span", fw, k(e.answer[$.count_field]), 1)) : E("", !0)
        ], 10, dw);
      }), 128)),
      g("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: me({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, t$ = /* @__PURE__ */ Y(hw, [["__scopeId", "data-v-46fc6186"]]), mw = {}, pw = { class: "menu-label" };
function gw(e, t) {
  return c(), h("span", pw, [
    ue(e.$slots, "default", {}, void 0, !0)
  ]);
}
const fa = /* @__PURE__ */ Y(mw, [["render", gw], ["__scopeId", "data-v-aa955b3e"]]), vw = {
  class: "search-bar",
  "data-search-bar": ""
}, yw = { class: "search-bar-control" }, kw = ["value", "placeholder", "aria-label"], ww = ["aria-expanded"], bw = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var I;
    const s = e, a = n, o = dl(), r = ((I = _e(Ae, null)) == null ? void 0 : I.search) ?? {}, i = N(() => r.placeholder || s.placeholder), l = r.context ?? [], d = O(null), u = O(null), f = O([]), m = N(() => f.value.length ? f.value[f.value.length - 1].next : l), v = N(() => !!o.menu || l.length > 0), $ = (W) => {
      f.value = [], u.value = u.value ? null : W.currentTarget;
    };
    function M(W) {
      if (W.next.length) {
        f.value = [...f.value, W];
        return;
      }
      u.value = null, a("pick", W.click);
    }
    function _() {
      var W;
      a("update:modelValue", ""), (W = d.value) == null || W.focus();
    }
    return t({ focus: () => {
      var W;
      return (W = d.value) == null ? void 0 : W.focus();
    } }), (W, Q) => {
      var A;
      return c(), h("div", vw, [
        g("div", yw, [
          R(ge, {
            class: "search-bar-icon",
            name: "search",
            size: 14
          }),
          g("input", {
            ref_key: "field",
            ref: d,
            class: "search-bar-input",
            type: "text",
            "data-search-input": "",
            value: e.modelValue,
            placeholder: i.value,
            "aria-label": i.value,
            onInput: Q[0] || (Q[0] = (x) => a("update:modelValue", x.target.value)),
            onKeydown: tn(_, ["esc"])
          }, null, 40, kw),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: _
          }, [
            R(ge, {
              name: "close",
              size: 12
            })
          ])) : E("", !0),
          v.value ? (c(), h("button", {
            key: 1,
            type: "button",
            class: "search-bar-menu",
            "data-search-menu": "",
            "aria-label": "Options",
            title: "Options",
            "aria-expanded": !!u.value,
            onClick: $
          }, [
            R(ge, {
              name: "caret",
              size: 12
            })
          ], 8, ww)) : E("", !0)
        ]),
        (A = U(r).button) != null && A.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Q[1] || (Q[1] = (x) => a("pick", U(r).button.click))
        }, k(U(r).button.title), 1)) : E("", !0),
        ue(W.$slots, "default", {}, void 0, !0),
        u.value ? (c(), G(Yn, {
          key: 1,
          anchor: u.value,
          align: "end",
          "min-width": 220,
          "max-width": 320,
          onClick: Q[3] || (Q[3] = be(() => {
          }, ["stop"])),
          onClose: Q[4] || (Q[4] = (x) => u.value = null)
        }, {
          default: P(() => [
            f.value.length ? (c(), G(xt, {
              key: 0,
              "data-search-back": "",
              onClick: Q[2] || (Q[2] = (x) => f.value = f.value.slice(0, -1))
            }, {
              default: P(() => [
                se("‹ " + k(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : E("", !0),
            (c(!0), h(K, null, ee(m.value, (x) => (c(), G(xt, {
              key: x.title,
              description: x.subtext,
              "data-search-entry": x.title,
              onClick: (C) => M(x)
            }, {
              default: P(() => [
                se(k(x.title) + k(x.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? E("", !0) : ue(W.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : E("", !0)
      ]);
    };
  }
}, xw = /* @__PURE__ */ Y(bw, [["__scopeId", "data-v-43c4837e"]]), $w = {
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
    return (o, r) => (c(), G(xw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: P(() => [
        R(fa, null, {
          default: P(() => [...r[2] || (r[2] = [
            se("Order", -1)
          ])]),
          _: 1
        }),
        (c(), h(K, null, ee(s, (i) => R(xt, {
          key: i.key,
          checked: e.tools.order.value === i.key,
          "data-list-order": i.key,
          onClick: (l) => e.tools.order.value = i.key
        }, {
          default: P(() => [
            se(k(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          R(fa, null, {
            default: P(() => [...r[3] || (r[3] = [
              se("Show", -1)
            ])]),
            _: 1
          }),
          (c(), h(K, null, ee(a, (i) => R(xt, {
            key: i.key,
            checked: e.tools.state.value === i.key,
            "data-list-state": i.key,
            onClick: (l) => e.tools.state.value = i.key
          }, {
            default: P(() => [
              se(k(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : E("", !0)
      ]),
      default: P(() => [
        ue(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, n$ = /* @__PURE__ */ Y($w, [["__scopeId", "data-v-dab0064d"]]);
function s$() {
  const e = O(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const a$ = (e) => import(
  /* @vite-ignore */
  e
), Mw = 86400, ha = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function Sw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ha(t) - ha(e)) / Mw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function o$(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ha(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: Sw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Ls = 280, Ns = 240, Ds = 120, _w = 6, Ew = 14, fn = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function Aw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Yi(e, t) {
  const n = Math.max(0, Aw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function Cw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${Ew}px)` }), e.offsetHeight, e.style.transition = `height ${Ls}ms ${fn}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, d = !1;
  const u = () => {
    d || (d = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (d) return;
    n() && (t.scrollTop = Yi(t, e));
    const m = a() - i;
    if (!l && m >= Ls && (l = !0, e.style.transition = `opacity ${Ns}ms ease-out, transform ${Ns}ms ${fn}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), m < Ls + Ns) return s(f);
    u();
  };
  return s(f), u;
}
function r$(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${_w}px)` }), e.offsetHeight, e.style.transition = `opacity ${Ds}ms ease-out, transform ${Ds}ms ${fn}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Yi(t, e)), a() - r < Ds) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const Ow = 140, In = 220, Ho = 5;
function i$({ gap: e = Ow, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(u, f) {
    s.add(u), u.cancel = u.arrival(u.el, u.options, () => {
      s.delete(u), u.done(), f();
    });
  }
  function l() {
    const u = n.splice(0, Ho);
    if (a = u.length > 0, !a) return;
    let f = u.length;
    for (const m of u)
      m.el.style.display = m.display, i(m, () => {
        f -= 1, f || (o = t(l, e));
      });
  }
  const d = (u, f, m, v = Cw) => {
    if (r || !f.pane || !f.follows()) return m();
    const $ = { el: u, options: f, done: m, arrival: v, display: u.style.display || "" };
    if (!a)
      return a = !0, i($, () => o = t(l, e));
    u.style.display = "none", n.push($), n.length >= Ho && d.flush();
  };
  return d.flush = () => {
    var u;
    r = !0, queueMicrotask(() => r = !1);
    for (const f of [...s]) (u = f.cancel) == null || u.call(f);
    clearTimeout(o), a = !1;
    for (const f of n.splice(0))
      f.el.style.display = f.display, f.done();
  }, d;
}
function l$(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${In}ms ${fn}, opacity ${In}ms ease-in, margin ${In}ms ${fn}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, In);
}
const Ji = "chat.pins.minimised", Pn = O(sn(Ji, !1));
function Uo(e) {
  Pn.value = e, Qn(Ji, e);
}
function Tw(e) {
  const t = N(() => e()), n = N(() => Pn.value ? [] : e()), s = () => Uo(!Pn.value), a = Date.now() / 1e3;
  return ve(
    () => t.value.filter((o) => $t(o) > a).length,
    (o, r) => o > r && Uo(!1)
  ), { pins: t, visible: n, minimised: Pn, toggle: s };
}
const Iw = ["title"], Rw = {
  key: 0,
  class: "pins-count"
}, Bw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = Tw(() => t.pinRows);
    return (o, r) => U(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: U(s), inline: e.inline }]),
      title: U(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => U(a) && U(a)(...i), ["stop"]))
    }, [
      R(ge, {
        name: U(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      U(s) ? (c(), h("span", Rw, k(U(n).length), 1)) : E("", !0)
    ], 10, Iw)) : E("", !0);
  }
}, c$ = /* @__PURE__ */ Y(Bw, [["__scopeId", "data-v-d073c504"]]), Lw = ["title"], Nw = ["title"], Dw = { class: "diff-card-dir" }, Pw = { class: "diff-card-name" }, jw = ["title"], qw = ["title"], Fw = {
  key: 0,
  class: "diff-card-note"
}, Ww = ["href"], Hw = ["src", "alt"], Uw = { class: "diff-card-rows" }, zw = { class: "diff-row-num" }, Vw = { class: "diff-row-sign" }, Gw = { class: "diff-row-code" }, Kw = {
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
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = N(() => n.path.lastIndexOf("/") + 1), d = N(() => n.path.slice(0, l.value)), u = N(() => n.path.slice(l.value)), f = N(() => n.kind === "deleted"), m = N(() => r[n.kind]), v = N(() => new Set(n.rows.filter((S) => S.line_type === "add").map((S) => S.line))), $ = O("after"), M = N(() => $.value === "before" ? n.whole.old : n.whole.text), _ = N(() => n.whole && n.whole.text !== void 0 ? M.value.split(`
`).map((S, b) => ({ line_type: $.value === "after" && v.value.has(b + 1) ? "add" : "ctx", line: b + 1, text: S })) : n.rows.filter(
      (S) => !(n.editsOnly && ["ctx", "fold"].includes(S.line_type)) && !(n.hideRemovals && S.line_type === "del")
    )), I = O(!1), W = N(() => n.lines && !I.value && !n.whole), Q = N(() => W.value ? _.value.slice(0, n.lines) : _.value), A = N(() => _.value.length - Q.value.length), x = (S) => S.line === null || S.line_type === "del" ? "" : S.line, C = (S) => S.line_type === "fold" ? S.hidden ? `⋯ ${S.hidden} lines` : "⋯" : S.text, y = O(null), T = O(null);
    let w = null;
    return Ne(() => {
      if (!T.value) return;
      let S = !0;
      w = new ResizeObserver(() => {
        !y.value || !T.value || (y.value.style.transition = S ? "none" : "", y.value.style.height = `${T.value.offsetHeight}px`, S = !1);
      }), w.observe(T.value);
    }), Te(() => w && w.disconnect()), (S, b) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: b[2] || (b[2] = (p) => !f.value && s("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${U(a)}-click to open it`,
          onClick: o
        }, [
          g("span", Dw, k(d.value), 1),
          g("span", Pw, k(u.value), 1),
          m.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.kind])
          }, k(m.value), 3)) : E("", !0)
        ], 8, Nw),
        g("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + k(e.added), 3),
        g("span", {
          class: Z(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + k(e.removed), 3),
        R(ls, {
          class: "diff-card-ago",
          at: e.at
        }, null, 8, ["at"]),
        e.whole && e.whole.old !== void 0 ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: $.value === "after" ? "Show the file before" : "Show the file after",
          onClick: b[0] || (b[0] = be((p) => $.value = $.value === "after" ? "before" : "after", ["stop"]))
        }, k($.value === "after" ? "After" : "Before"), 9, jw)) : E("", !0),
        f.value ? E("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: b[1] || (b[1] = be((p) => s("whole"), ["stop"]))
        }, [
          R(ge, {
            name: "file",
            size: 12
          })
        ], 10, qw))
      ], 8, Lw),
      e.whole && e.whole.error ? (c(), h("p", Fw, k(e.whole.error), 1)) : E("", !0),
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
            alt: u.value,
            loading: "lazy"
          }, null, 8, Hw)
        ], 8, Ww)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: y,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: T,
            class: "diff-card-diff"
          }, [
            g("div", Uw, [
              (c(!0), h(K, null, ee(Q.value, (p, B) => (c(), h("div", {
                key: B,
                class: Z(["diff-row", p.line_type, { fresh: e.fresh && p.edit === e.fresh }])
              }, [
                g("span", zw, k(x(p)), 1),
                g("span", Vw, k(i[p.line_type]), 1),
                g("span", Gw, k(C(p)), 1)
              ], 2))), 128)),
              A.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: b[3] || (b[3] = be((p) => I.value = !0, ["stop"]))
              }, k(A.value) + " more " + k(A.value === 1 ? "line" : "lines"), 1)) : E("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : E("", !0)
    ], 2));
  }
}, u$ = /* @__PURE__ */ Y(Kw, [["__scopeId", "data-v-fed58c18"]]), Yw = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(he, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: P(() => [
        R(ge, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Jw = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, Zw = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Xw = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Qw = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], e2 = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], t2 = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], n2 = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], s2 = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? n2(t) : e === "agent" ? [...e2(t), ...Qw(t)] : e === "check" ? t2(t) : e === "question" ? Xw(t) : ((n = { plan: Jw, task: Zw }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, a2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, o2 = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, r2 = { class: "ask-text" }, i2 = ["placeholder", "aria-label"], l2 = ["placeholder", "aria-label"], c2 = {
  key: 3,
  class: "moves"
}, u2 = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = N(() => s2(s.kind, s.row)), r = O(""), i = O(null), l = O(""), d = O("");
    ve(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function u(v, $ = "") {
      const M = await s.read([v.noun ?? s.kind, v.word, String(s.id), ...v.flag ? [v.flag, $] : v.positional ? [$] : [], ...v.opener && d.value.trim() ? ["--on", d.value.trim()] : []]);
      r.value = M.ok ? "" : M.error, M.ok && (i.value = null, l.value = "", d.value = "", a("done"));
    }
    const f = (v) => v.confirm ? i.value = v : v.said ? u(v, v.said) : v.flag || v.positional ? (i.value = v, l.value = "") : u(v), m = () => l.value.trim() && u(i.value, l.value.trim());
    return t({ moves: o, press: f }), (v, $) => {
      var M;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", a2, k(r.value), 1)) : E("", !0),
        (M = i.value) != null && M.confirm ? (c(), h("div", o2, [
          g("span", r2, k(i.value.confirm), 1),
          R(he, {
            small: "",
            kind: i.value.danger ? "ghost" : "primary",
            bordered: i.value.danger,
            class: Z({ danger: i.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: $[0] || ($[0] = (_) => u(i.value))
          }, {
            default: P(() => [
              se(k(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["kind", "bordered", "class"]),
          R(he, {
            small: "",
            kind: "ghost",
            onClick: $[1] || ($[1] = (_) => i.value = null)
          }, {
            default: P(() => [...$[7] || ($[7] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(m, ["prevent"])
        }, [
          ft(g("input", {
            "onUpdate:modelValue": $[2] || ($[2] = (_) => l.value = _),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: $[3] || ($[3] = tn(be((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, i2), [
            [Fs, l.value]
          ]),
          i.value.opener ? ft((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": $[4] || ($[4] = (_) => d.value = _),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: $[5] || ($[5] = tn(be((_) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, l2)), [
            [Fs, d.value]
          ]) : E("", !0),
          R(he, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: P(() => [
              se(k(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          R(he, {
            small: "",
            kind: "ghost",
            onClick: $[6] || ($[6] = (_) => i.value = null)
          }, {
            default: P(() => [...$[8] || ($[8] = [
              se("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", c2, [
          (c(!0), h(K, null, ee(o.value, (_) => (c(), G(he, {
            key: _.word,
            small: !_.bordered,
            bordered: _.bordered,
            icon: _.icon,
            kind: _.main ? "primary" : "ghost",
            class: Z({ danger: _.danger }),
            "data-move": _.word,
            onClick: (I) => f(_)
          }, {
            default: P(() => [
              se(k(_.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : E("", !0);
    };
  }
}, d2 = /* @__PURE__ */ Y(u2, [["__scopeId", "data-v-74d3b5e8"]]), f2 = /* @__PURE__ */ new Set(["completed", "cancelled"]), h2 = (e) => f2.has(e), ma = (e) => h2(e) ? "done" : e, m2 = { class: "facts" }, p2 = { class: "fact wide" }, g2 = { class: "fact-value" }, v2 = {
  key: 0,
  class: "fact"
}, y2 = { class: "fact-value" }, k2 = { class: "fact" }, w2 = { class: "fact-label" }, b2 = ["title"], x2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, $2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, M2 = {
  key: 2,
  class: "fact"
}, S2 = { class: "fact-value" }, _2 = { class: "fact wide" }, E2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, A2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = Wn.map(({ key: o, label: r }) => ({ key: String(o), label: r })), s = t, a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var i, l;
      return c(), h("div", m2, [
        g("div", p2, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", g2, k((i = e.place) != null && i.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((l = e.place) == null ? void 0 : l.phase_total) > 1 ? (c(), h("div", v2, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", y2, k(e.place.phase_number) + " of " + k(e.place.phase_total) + ": " + k(e.place.phase_title), 1)
        ])) : E("", !0),
        e.task.helper_id ? (c(), h(K, { key: 1 }, [
          g("div", k2, [
            g("span", w2, k(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (d) => U(Fe)(`agents:${e.task.helper_id}`))
            }, k(e.task.helper_name), 9, b2)
          ]),
          U(a).has(e.task.state) ? (c(), h("p", x2, k(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", $2, k(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : E("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", M2, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", S2, "Agent " + k(e.task.holder_id), 1)
        ])) : E("", !0),
        g("div", _2, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          R(Jn, {
            options: U(n),
            value: String(U(si)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (d) => s("priority", d))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", E2, k(e.refusal), 1)) : E("", !0)
        ])
      ]);
    };
  }
}, C2 = /* @__PURE__ */ Y(A2, [["__scopeId", "data-v-2bcdca7a"]]), O2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, T2 = { ...O2, done: "Completed" }, I2 = { class: "task-status-icon" }, R2 = ["width", "height", "aria-label"], B2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", I2, [
      R(Pt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: P(() => [
          (c(), h("svg", {
            key: e.status,
            class: Z(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": U(T2)[e.status]
          }, [
            R(qt, { value: e.status }, {
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
          ], 10, R2))
        ]),
        _: 1
      })
    ]));
  }
}, Zi = /* @__PURE__ */ Y(B2, [["__scopeId", "data-v-2ab7e404"]]), L2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, N2 = ["onClick"], D2 = { class: "wait-id" }, P2 = { class: "wait-title" }, j2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, q2 = { class: "text" }, F2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, W2 = 180, H2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = O(!1);
    return (a, o) => (c(), h(K, null, [
      e.task.waits.length ? (c(), h("section", L2, [
        o[1] || (o[1] = g("h4", null, "Waits on", -1)),
        (c(!0), h(K, null, ee(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          R(Zi, {
            status: U(ma)(r.state),
            size: 12
          }, null, 8, ["status"]),
          g("span", D2, k(r.id), 1),
          g("span", P2, k(r.title), 1)
        ], 8, N2))), 128))
      ])) : E("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", j2, [
        o[2] || (o[2] = g("h4", null, "How it was done", -1)),
        g("p", q2, k(e.task.outcome), 1)
      ])) : E("", !0),
      e.task.brief ? (c(), h("section", F2, [
        o[3] || (o[3] = g("h4", null, "The brief", -1)),
        g("p", {
          class: Z(["text", { clamped: !s.value }])
        }, k(e.task.brief), 3),
        e.task.brief.length > W2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : E("", !0)
      ])) : E("", !0)
    ], 64));
  }
}, U2 = /* @__PURE__ */ Y(H2, [["__scopeId", "data-v-8e4d95ae"]]), z2 = {
  class: "task-details",
  "data-task-details": ""
}, V2 = { class: "since" }, G2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, K2 = { class: "text" }, Y2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, J2 = {
  key: 1,
  class: "note"
}, Z2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, X2 = { class: "text" }, Q2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", z2, [
        g("div", {
          class: Z(["state-line", U(ma)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            R(Zi, {
              status: U(ma)(e.task.state)
            }, null, 8, ["status"]),
            se(" " + k(s(e.task.state)), 1)
          ]),
          g("span", V2, [
            o[3] || (o[3] = se(" since ", -1)),
            R(ls, {
              at: U($a)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", G2, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", K2, k(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", Y2, "Opens by itself when " + k(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", J2, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", Z2, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", X2, k(e.task.reason), 1)
        ])) : E("", !0),
        R(C2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        R(U2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, eb = /* @__PURE__ */ Y(Q2, [["__scopeId", "data-v-2863d987"]]), tb = {
  class: "task-log",
  "aria-label": "Task log"
}, nb = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, sb = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, ab = { class: "entries" }, ob = ["datetime"], rb = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, ib = {
  __name: "TaskLog",
  props: {
    id: { type: Number, required: !0 },
    read: { type: Function, required: !0 },
    changes: { type: Number, default: 0 }
  },
  setup(e) {
    const t = e, n = O([]), s = O(1), a = O(!0), o = O(!0), r = O("");
    let i = 0;
    async function l(d = 1) {
      const u = ++i;
      s.value = d, o.value = !0, r.value = "";
      const f = await t.read([
        "task-log",
        "list",
        "--task-id",
        String(t.id),
        "--limit",
        String(He("task_logs")),
        "--page",
        String(d)
      ]);
      u === i && (o.value = !1, r.value = f.ok ? "" : f.error, f.ok && (n.value = f.value.rows, a.value = f.value.is_last_page));
    }
    return ve(
      () => [t.id, t.changes],
      () => {
        n.value = [], l();
      },
      { immediate: !0 }
    ), jt(() => {
      i += 1;
    }), (d, u) => (c(), h("section", tb, [
      o.value ? (c(), G(Ft, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        g("p", nb, k(r.value), 1),
        R(he, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: u[0] || (u[0] = (f) => l(s.value))
        }, {
          default: P(() => [...u[3] || (u[3] = [
            se("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(K, { key: 2 }, [
        n.value.length ? E("", !0) : (c(), h("p", sb, "No log entries yet.")),
        g("ol", ab, [
          (c(!0), h(K, null, ee(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, k(new Date(f.created_at).toLocaleString()), 9, ob),
            g("p", null, k(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", rb, [
          R(he, {
            small: "",
            bordered: "",
            disabled: s.value === 1,
            "data-task-log-newer": "",
            onClick: u[1] || (u[1] = (f) => l(s.value - 1))
          }, {
            default: P(() => [...u[4] || (u[4] = [
              se("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + k(s.value), 1),
          R(he, {
            small: "",
            bordered: "",
            disabled: a.value,
            "data-task-log-older": "",
            onClick: u[2] || (u[2] = (f) => l(s.value + 1))
          }, {
            default: P(() => [...u[5] || (u[5] = [
              se("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : E("", !0)
      ], 64))
    ]));
  }
}, lb = /* @__PURE__ */ Y(ib, [["__scopeId", "data-v-953605e5"]]), cb = { class: "comment-side-head" }, ub = {
  key: 0,
  class: "comment-none"
}, db = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", cb, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        R(Xn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? E("", !0) : (c(), h("p", ub, "No comments yet")),
      (c(!0), h(K, null, ee(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, k(e.words(s)), 1))), 128))
    ], 2));
  }
}, fb = /* @__PURE__ */ Y(db, [["__scopeId", "data-v-19fdbdd4"]]);
var Vo;
/Mac|iPhone|iPad/.test(((Vo = navigator.userAgentData) == null ? void 0 : Vo.platform) || navigator.platform);
function hb(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const mb = ["placeholder"], pb = { class: "actions" }, gb = { class: "error" }, vb = {
  key: 1,
  class: "card closed"
}, yb = { class: "mark" }, kb = { class: "prompt" }, wb = {
  key: 0,
  class: "draft"
}, bb = {
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
    const s = e, a = n, o = js(e, "draft"), r = js(e, "error"), i = O(!!r.value), l = O(!1), d = O(!1), u = O(null);
    async function f() {
      var $, M;
      i.value = !0, l.value = !1, await mt(), (M = (($ = u.value) == null ? void 0 : $.querySelector("input")) || u.value) == null || M.focus();
    }
    function m() {
      i.value = !1, r.value = "";
    }
    async function v() {
      const $ = o.value.trim();
      if (!(!$ || !s.ready || d.value)) {
        r.value = "", d.value = !0, o.value = "";
        try {
          await s.send($), i.value = !1, l.value = !0;
        } catch (M) {
          o.value = $, r.value = M.message;
        } finally {
          d.value = !1;
        }
      }
    }
    return t({ expand: f }), ($, M) => (c(), h("div", {
      class: Z(["comment-bar", { open: i.value }])
    }, [
      i.value ? (c(), h("form", {
        key: 0,
        class: "card compose",
        onSubmit: be(v, ["prevent"]),
        onKeydown: tn(m, ["esc"])
      }, [
        ue($.$slots, "who", {}, void 0, !0),
        ft(g("textarea", {
          ref_key: "box",
          ref: u,
          "onUpdate:modelValue": M[0] || (M[0] = (_) => o.value = _),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: M[1] || (M[1] = tn((_) => U(hb)(_, v), ["enter"]))
        }, null, 40, mb), [
          [Fs, o.value]
        ]),
        g("div", pb, [
          g("span", gb, k(r.value), 1),
          R(he, {
            small: "",
            onClick: m
          }, {
            default: P(() => [...M[3] || (M[3] = [
              se("Cancel", -1)
            ])]),
            _: 1
          }),
          R(he, {
            kind: "primary",
            small: "",
            busy: d.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: P(() => [...M[4] || (M[4] = [
              se("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", vb, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", yb, [
            R(ge, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", kb, k(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", wb, "Draft kept")) : E("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: M[2] || (M[2] = (_) => a("show"))
        }, [
          g("span", null, k(U(ql)(e.count, "comment")), 1),
          R(ge, {
            name: "down",
            size: 12
          })
        ])) : E("", !0)
      ]))
    ], 2));
  }
}, xb = /* @__PURE__ */ Y(bb, [["__scopeId", "data-v-81f478d2"]]);
function $b(e, t) {
  const n = O([]), s = O(!1);
  let a = 0, o = 0;
  const r = (d) => {
    const { kind: u, id: f, title: m } = e(), v = `On ${u} ${f}, ${m}: `;
    return d.text.startsWith(v) ? d.text.slice(v.length) : d.text;
  };
  async function i() {
    const { kind: d, id: u } = e();
    if (!u) return;
    const f = ++o, m = await t([d, "comments", String(u)]);
    f === o && (n.value = m.ok ? m.value.rows ?? [] : []);
  }
  async function l(d) {
    const { kind: u, id: f } = e(), m = { id: `sending-${++a}`, text: d };
    n.value = [...n.value, m], s.value = !0;
    const v = await t([u, "comment", String(f), d]);
    if (!v.ok)
      throw n.value = n.value.filter(($) => $ !== m && $.id !== m.id), new Error(v.error);
    await i();
  }
  return ve(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const Mb = { class: "top" }, Sb = {
  class: "crumb",
  "data-task-crumb": ""
}, _b = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, Eb = {
  key: 1,
  class: "body"
}, Ab = { class: "summary" }, Cb = { class: "stamp" }, Ob = {
  class: "title",
  "data-resource-title": ""
}, Tb = {
  class: "tabs",
  "data-task-tabs": ""
}, Ib = { class: "panels" }, Rb = {
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
    const s = e, a = n, o = O(null), r = O(null), i = O(""), l = O(""), d = O(null), u = O(null), f = O("details"), m = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = $b(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (A) => s.read(A)
    );
    let $ = 0;
    const M = N(() => {
      var A;
      return (A = r.value) != null && A.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function _() {
      const A = ++$, [x, C] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      A === $ && (i.value = x.ok ? "" : x.error, o.value = x.ok ? x.value : null, r.value = C.ok ? C.value : null);
    }
    ve(
      () => s.id,
      () => {
        o.value = null, r.value = null, d.value = null, f.value = "details", _();
      },
      { immediate: !0 }
    ), ve(() => s.changes, _), ve(v.open, (A) => {
      A && (f.value = "comments");
    });
    async function I(A) {
      const x = o.value.priority;
      o.value.priority = Number(A);
      const C = await s.read(["task", "edit", String(s.id), "--priority", A]);
      if (l.value = C.ok ? "" : C.error, C.ok) return _();
      o.value.priority = x;
    }
    function W(A) {
      d.value = null, u.value.press(A);
    }
    const Q = (A) => {
      var x;
      return ((x = u.value) == null ? void 0 : x.moves.length) && (d.value = A);
    };
    return t({ openStatus: Q }), (A, x) => (c(), h("aside", {
      class: Z(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      g("div", Mb, [
        e.backed ? (c(), G(Yw, {
          key: 0,
          onBack: x[0] || (x[0] = (C) => a("back"))
        })) : E("", !0),
        g("span", Sb, k(M.value), 1),
        x[9] || (x[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          R(he, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: x[1] || (x[1] = (C) => a("step", -1))
          }, {
            default: P(() => [
              R(ge, {
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
            onClick: x[2] || (x[2] = (C) => a("step", 1))
          }, {
            default: P(() => [
              R(ge, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : E("", !0),
        R(he, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: x[3] || (x[3] = (C) => a("close"))
        }, {
          default: P(() => [
            R(ge, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", _b, k(i.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        R(d2, {
          ref_key: "footer",
          ref: u,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: _
        }, null, 8, ["id", "row", "read"]),
        g("header", Ab, [
          g("div", Cb, [
            se(" Task " + k(o.value.id) + " · updated ", 1),
            R(ls, {
              at: U($a)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", Ob, k(o.value.title), 1)
        ]),
        g("div", Tb, [
          R(Jn, {
            options: m,
            value: f.value,
            onPick: x[4] || (x[4] = (C) => f.value = C)
          }, null, 8, ["value"])
        ]),
        g("div", Ib, [
          R(qt, { value: f.value }, {
            details: P(() => [
              R(eb, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: Q,
                onPriority: I,
                onSelect: x[5] || (x[5] = (C) => a("select", C))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: P(() => [
              R(fb, {
                below: "",
                comments: U(v).comments.value,
                words: U(v).words,
                onClose: x[6] || (x[6] = (C) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: P(() => [
              R(lb, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        R(xb, {
          send: U(v).send,
          count: U(v).comments.value.length,
          onShow: x[7] || (x[7] = (C) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", Eb, [
        R(Ft)
      ])),
      d.value ? (c(), G(Yn, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: x[8] || (x[8] = (C) => d.value = null)
      }, {
        default: P(() => [
          R(fa, null, {
            default: P(() => [
              se("Change the status of task " + k(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(K, null, ee(u.value.moves, (C) => (c(), G(xt, {
            key: C.word,
            onClick: (y) => W(C)
          }, {
            default: P(() => [
              se(k(C.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : E("", !0)
    ], 2));
  }
}, d$ = /* @__PURE__ */ Y(Rb, [["__scopeId", "data-v-43f3b122"]]);
function Bb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ps = { exports: {} }, zo;
function Lb() {
  return zo || (zo = 1, (function(e, t) {
    var n = (function() {
      var s = function(x, C) {
        var y = 236, T = 17, w = x, S = o[C], b = null, p = 0, B = null, j = [], D = {}, J = function(q, F) {
          p = w * 4 + 17, b = (function(L) {
            for (var H = new Array(L), z = 0; z < L; z += 1) {
              H[z] = new Array(L);
              for (var X = 0; X < L; X += 1)
                H[z][X] = null;
            }
            return H;
          })(p), V(0, 0), V(p - 7, 0), V(0, p - 7), ke(), le(), Ge(q, F), w >= 7 && Re(q), B == null && (B = Xi(w, S, j)), Ke(B, F);
        }, V = function(q, F) {
          for (var L = -1; L <= 7; L += 1)
            if (!(q + L <= -1 || p <= q + L))
              for (var H = -1; H <= 7; H += 1)
                F + H <= -1 || p <= F + H || (0 <= L && L <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (L == 0 || L == 6) || 2 <= L && L <= 4 && 2 <= H && H <= 4 ? b[q + L][F + H] = !0 : b[q + L][F + H] = !1);
        }, ce = function() {
          for (var q = 0, F = 0, L = 0; L < 8; L += 1) {
            J(!0, L);
            var H = i.getLostPoint(D);
            (L == 0 || q > H) && (q = H, F = L);
          }
          return F;
        }, le = function() {
          for (var q = 8; q < p - 8; q += 1)
            b[q][6] == null && (b[q][6] = q % 2 == 0);
          for (var F = 8; F < p - 8; F += 1)
            b[6][F] == null && (b[6][F] = F % 2 == 0);
        }, ke = function() {
          for (var q = i.getPatternPosition(w), F = 0; F < q.length; F += 1)
            for (var L = 0; L < q.length; L += 1) {
              var H = q[F], z = q[L];
              if (b[H][z] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var ae = -2; ae <= 2; ae += 1)
                    X == -2 || X == 2 || ae == -2 || ae == 2 || X == 0 && ae == 0 ? b[H + X][z + ae] = !0 : b[H + X][z + ae] = !1;
            }
        }, Re = function(q) {
          for (var F = i.getBCHTypeNumber(w), L = 0; L < 18; L += 1) {
            var H = !q && (F >> L & 1) == 1;
            b[Math.floor(L / 3)][L % 3 + p - 8 - 3] = H;
          }
          for (var L = 0; L < 18; L += 1) {
            var H = !q && (F >> L & 1) == 1;
            b[L % 3 + p - 8 - 3][Math.floor(L / 3)] = H;
          }
        }, Ge = function(q, F) {
          for (var L = S << 3 | F, H = i.getBCHTypeInfo(L), z = 0; z < 15; z += 1) {
            var X = !q && (H >> z & 1) == 1;
            z < 6 ? b[z][8] = X : z < 8 ? b[z + 1][8] = X : b[p - 15 + z][8] = X;
          }
          for (var z = 0; z < 15; z += 1) {
            var X = !q && (H >> z & 1) == 1;
            z < 8 ? b[8][p - z - 1] = X : z < 9 ? b[8][15 - z - 1 + 1] = X : b[8][15 - z - 1] = X;
          }
          b[p - 8][8] = !q;
        }, Ke = function(q, F) {
          for (var L = -1, H = p - 1, z = 7, X = 0, ae = i.getMaskFunction(F), ne = p - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (b[H][ne - we] == null) {
                  var $e = !1;
                  X < q.length && ($e = (q[X] >>> z & 1) == 1);
                  var re = ae(H, ne - we);
                  re && ($e = !$e), b[H][ne - we] = $e, z -= 1, z == -1 && (X += 1, z = 7);
                }
              if (H += L, H < 0 || p <= H) {
                H -= L, L = -L;
                break;
              }
            }
        }, Et = function(q, F) {
          for (var L = 0, H = 0, z = 0, X = new Array(F.length), ae = new Array(F.length), ne = 0; ne < F.length; ne += 1) {
            var we = F[ne].dataCount, $e = F[ne].totalCount - we;
            H = Math.max(H, we), z = Math.max(z, $e), X[ne] = new Array(we);
            for (var re = 0; re < X[ne].length; re += 1)
              X[ne][re] = 255 & q.getBuffer()[re + L];
            L += we;
            var De = i.getErrorCorrectPolynomial($e), Pe = d(X[ne], De.getLength() - 1), qa = Pe.mod(De);
            ae[ne] = new Array(De.getLength() - 1);
            for (var re = 0; re < ae[ne].length; re += 1) {
              var Fa = re + qa.getLength() - ae[ne].length;
              ae[ne][re] = Fa >= 0 ? qa.getAt(Fa) : 0;
            }
          }
          for (var Wa = 0, re = 0; re < F.length; re += 1)
            Wa += F[re].totalCount;
          for (var cs = new Array(Wa), xn = 0, re = 0; re < H; re += 1)
            for (var ne = 0; ne < F.length; ne += 1)
              re < X[ne].length && (cs[xn] = X[ne][re], xn += 1);
          for (var re = 0; re < z; re += 1)
            for (var ne = 0; ne < F.length; ne += 1)
              re < ae[ne].length && (cs[xn] = ae[ne][re], xn += 1);
          return cs;
        }, Xi = function(q, F, L) {
          for (var H = u.getRSBlocks(q, F), z = f(), X = 0; X < L.length; X += 1) {
            var ae = L[X];
            z.put(ae.getMode(), 4), z.put(ae.getLength(), i.getLengthInBits(ae.getMode(), q)), ae.write(z);
          }
          for (var ne = 0, X = 0; X < H.length; X += 1)
            ne += H[X].dataCount;
          if (z.getLengthInBits() > ne * 8)
            throw "code length overflow. (" + z.getLengthInBits() + ">" + ne * 8 + ")";
          for (z.getLengthInBits() + 4 <= ne * 8 && z.put(0, 4); z.getLengthInBits() % 8 != 0; )
            z.putBit(!1);
          for (; !(z.getLengthInBits() >= ne * 8 || (z.put(y, 8), z.getLengthInBits() >= ne * 8)); )
            z.put(T, 8);
          return Et(z, H);
        };
        D.addData = function(q, F) {
          F = F || "Byte";
          var L = null;
          switch (F) {
            case "Numeric":
              L = m(q);
              break;
            case "Alphanumeric":
              L = v(q);
              break;
            case "Byte":
              L = $(q);
              break;
            case "Kanji":
              L = M(q);
              break;
            default:
              throw "mode:" + F;
          }
          j.push(L), B = null;
        }, D.isDark = function(q, F) {
          if (q < 0 || p <= q || F < 0 || p <= F)
            throw q + "," + F;
          return b[q][F];
        }, D.getModuleCount = function() {
          return p;
        }, D.make = function() {
          if (w < 1) {
            for (var q = 1; q < 40; q++) {
              for (var F = u.getRSBlocks(q, S), L = f(), H = 0; H < j.length; H++) {
                var z = j[H];
                L.put(z.getMode(), 4), L.put(z.getLength(), i.getLengthInBits(z.getMode(), q)), z.write(L);
              }
              for (var X = 0, H = 0; H < F.length; H++)
                X += F[H].dataCount;
              if (L.getLengthInBits() <= X * 8)
                break;
            }
            w = q;
          }
          J(!1, ce());
        }, D.createTableTag = function(q, F) {
          q = q || 2, F = typeof F > "u" ? q * 4 : F;
          var L = "";
          L += '<table style="', L += " border-width: 0px; border-style: none;", L += " border-collapse: collapse;", L += " padding: 0px; margin: " + F + "px;", L += '">', L += "<tbody>";
          for (var H = 0; H < D.getModuleCount(); H += 1) {
            L += "<tr>";
            for (var z = 0; z < D.getModuleCount(); z += 1)
              L += '<td style="', L += " border-width: 0px; border-style: none;", L += " border-collapse: collapse;", L += " padding: 0px; margin: 0px;", L += " width: " + q + "px;", L += " height: " + q + "px;", L += " background-color: ", L += D.isDark(H, z) ? "#000000" : "#ffffff", L += ";", L += '"/>';
            L += "</tr>";
          }
          return L += "</tbody>", L += "</table>", L;
        }, D.createSvgTag = function(q, F, L, H) {
          var z = {};
          typeof arguments[0] == "object" && (z = arguments[0], q = z.cellSize, F = z.margin, L = z.alt, H = z.title), q = q || 2, F = typeof F > "u" ? q * 4 : F, L = typeof L == "string" ? { text: L } : L || {}, L.text = L.text || null, L.id = L.text ? L.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var X = D.getModuleCount() * q + F * 2, ae, ne, we, $e, re = "", De;
          for (De = "l" + q + ",0 0," + q + " -" + q + ",0 0,-" + q + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += z.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', re += ' viewBox="0 0 ' + X + " " + X + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += H.text || L.text ? ' role="img" aria-labelledby="' + At([H.id, L.id].join(" ").trim()) + '"' : "", re += ">", re += H.text ? '<title id="' + At(H.id) + '">' + At(H.text) + "</title>" : "", re += L.text ? '<description id="' + At(L.id) + '">' + At(L.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', we = 0; we < D.getModuleCount(); we += 1)
            for ($e = we * q + F, ae = 0; ae < D.getModuleCount(); ae += 1)
              D.isDark(we, ae) && (ne = ae * q + F, re += "M" + ne + "," + $e + De);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, D.createDataURL = function(q, F) {
          q = q || 2, F = typeof F > "u" ? q * 4 : F;
          var L = D.getModuleCount() * q + F * 2, H = F, z = L - F;
          return A(L, L, function(X, ae) {
            if (H <= X && X < z && H <= ae && ae < z) {
              var ne = Math.floor((X - H) / q), we = Math.floor((ae - H) / q);
              return D.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, D.createImgTag = function(q, F, L) {
          q = q || 2, F = typeof F > "u" ? q * 4 : F;
          var H = D.getModuleCount() * q + F * 2, z = "";
          return z += "<img", z += ' src="', z += D.createDataURL(q, F), z += '"', z += ' width="', z += H, z += '"', z += ' height="', z += H, z += '"', L && (z += ' alt="', z += At(L), z += '"'), z += "/>", z;
        };
        var At = function(q) {
          for (var F = "", L = 0; L < q.length; L += 1) {
            var H = q.charAt(L);
            switch (H) {
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
                F += H;
                break;
            }
          }
          return F;
        }, Qi = function(q) {
          var F = 1;
          q = typeof q > "u" ? F * 2 : q;
          var L = D.getModuleCount() * F + q * 2, H = q, z = L - q, X, ae, ne, we, $e, re = {
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
          for (X = 0; X < L; X += 2) {
            for (ne = Math.floor((X - H) / F), we = Math.floor((X + 1 - H) / F), ae = 0; ae < L; ae += 1)
              $e = "█", H <= ae && ae < z && H <= X && X < z && D.isDark(ne, Math.floor((ae - H) / F)) && ($e = " "), H <= ae && ae < z && H <= X + 1 && X + 1 < z && D.isDark(we, Math.floor((ae - H) / F)) ? $e += " " : $e += "█", Pe += q < 1 && X + 1 >= z ? De[$e] : re[$e];
            Pe += `
`;
          }
          return L % 2 && q > 0 ? Pe.substring(0, Pe.length - L - 1) + Array(L + 1).join("▀") : Pe.substring(0, Pe.length - 1);
        };
        return D.createASCII = function(q, F) {
          if (q = q || 1, q < 2)
            return Qi(F);
          q -= 1, F = typeof F > "u" ? q * 2 : F;
          var L = D.getModuleCount() * q + F * 2, H = F, z = L - F, X, ae, ne, we, $e = Array(q + 1).join("██"), re = Array(q + 1).join("  "), De = "", Pe = "";
          for (X = 0; X < L; X += 1) {
            for (ne = Math.floor((X - H) / q), Pe = "", ae = 0; ae < L; ae += 1)
              we = 1, H <= ae && ae < z && H <= X && X < z && D.isDark(ne, Math.floor((ae - H) / q)) && (we = 0), Pe += we ? $e : re;
            for (ne = 0; ne < q; ne += 1)
              De += Pe + `
`;
          }
          return De.substring(0, De.length - 1);
        }, D.renderTo2dContext = function(q, F) {
          F = F || 2;
          for (var L = D.getModuleCount(), H = 0; H < L; H++)
            for (var z = 0; z < L; z++)
              q.fillStyle = D.isDark(H, z) ? "black" : "white", q.fillRect(H * F, z * F, F, F);
        }, D;
      };
      s.stringToBytesFuncs = {
        default: function(x) {
          for (var C = [], y = 0; y < x.length; y += 1) {
            var T = x.charCodeAt(y);
            C.push(T & 255);
          }
          return C;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(x, C) {
        var y = (function() {
          for (var w = W(x), S = function() {
            var le = w.read();
            if (le == -1) throw "eof";
            return le;
          }, b = 0, p = {}; ; ) {
            var B = w.read();
            if (B == -1) break;
            var j = S(), D = S(), J = S(), V = String.fromCharCode(B << 8 | j), ce = D << 8 | J;
            p[V] = ce, b += 1;
          }
          if (b != C)
            throw b + " != " + C;
          return p;
        })(), T = 63;
        return function(w) {
          for (var S = [], b = 0; b < w.length; b += 1) {
            var p = w.charCodeAt(b);
            if (p < 128)
              S.push(p);
            else {
              var B = y[w.charAt(b)];
              typeof B == "number" ? (B & 255) == B ? S.push(B) : (S.push(B >>> 8), S.push(B & 255)) : S.push(T);
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
        ], C = 1335, y = 7973, T = 21522, w = {}, S = function(b) {
          for (var p = 0; b != 0; )
            p += 1, b >>>= 1;
          return p;
        };
        return w.getBCHTypeInfo = function(b) {
          for (var p = b << 10; S(p) - S(C) >= 0; )
            p ^= C << S(p) - S(C);
          return (b << 10 | p) ^ T;
        }, w.getBCHTypeNumber = function(b) {
          for (var p = b << 12; S(p) - S(y) >= 0; )
            p ^= y << S(p) - S(y);
          return b << 12 | p;
        }, w.getPatternPosition = function(b) {
          return x[b - 1];
        }, w.getMaskFunction = function(b) {
          switch (b) {
            case r.PATTERN000:
              return function(p, B) {
                return (p + B) % 2 == 0;
              };
            case r.PATTERN001:
              return function(p, B) {
                return p % 2 == 0;
              };
            case r.PATTERN010:
              return function(p, B) {
                return B % 3 == 0;
              };
            case r.PATTERN011:
              return function(p, B) {
                return (p + B) % 3 == 0;
              };
            case r.PATTERN100:
              return function(p, B) {
                return (Math.floor(p / 2) + Math.floor(B / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(p, B) {
                return p * B % 2 + p * B % 3 == 0;
              };
            case r.PATTERN110:
              return function(p, B) {
                return (p * B % 2 + p * B % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(p, B) {
                return (p * B % 3 + (p + B) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + b;
          }
        }, w.getErrorCorrectPolynomial = function(b) {
          for (var p = d([1], 0), B = 0; B < b; B += 1)
            p = p.multiply(d([1, l.gexp(B)], 0));
          return p;
        }, w.getLengthInBits = function(b, p) {
          if (1 <= p && p < 10)
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
          else if (p < 27)
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
          else if (p < 41)
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
            throw "type:" + p;
        }, w.getLostPoint = function(b) {
          for (var p = b.getModuleCount(), B = 0, j = 0; j < p; j += 1)
            for (var D = 0; D < p; D += 1) {
              for (var J = 0, V = b.isDark(j, D), ce = -1; ce <= 1; ce += 1)
                if (!(j + ce < 0 || p <= j + ce))
                  for (var le = -1; le <= 1; le += 1)
                    D + le < 0 || p <= D + le || ce == 0 && le == 0 || V == b.isDark(j + ce, D + le) && (J += 1);
              J > 5 && (B += 3 + J - 5);
            }
          for (var j = 0; j < p - 1; j += 1)
            for (var D = 0; D < p - 1; D += 1) {
              var ke = 0;
              b.isDark(j, D) && (ke += 1), b.isDark(j + 1, D) && (ke += 1), b.isDark(j, D + 1) && (ke += 1), b.isDark(j + 1, D + 1) && (ke += 1), (ke == 0 || ke == 4) && (B += 3);
            }
          for (var j = 0; j < p; j += 1)
            for (var D = 0; D < p - 6; D += 1)
              b.isDark(j, D) && !b.isDark(j, D + 1) && b.isDark(j, D + 2) && b.isDark(j, D + 3) && b.isDark(j, D + 4) && !b.isDark(j, D + 5) && b.isDark(j, D + 6) && (B += 40);
          for (var D = 0; D < p; D += 1)
            for (var j = 0; j < p - 6; j += 1)
              b.isDark(j, D) && !b.isDark(j + 1, D) && b.isDark(j + 2, D) && b.isDark(j + 3, D) && b.isDark(j + 4, D) && !b.isDark(j + 5, D) && b.isDark(j + 6, D) && (B += 40);
          for (var Re = 0, D = 0; D < p; D += 1)
            for (var j = 0; j < p; j += 1)
              b.isDark(j, D) && (Re += 1);
          var Ge = Math.abs(100 * Re / p / p - 50) / 5;
          return B += Ge * 10, B;
        }, w;
      })(), l = (function() {
        for (var x = new Array(256), C = new Array(256), y = 0; y < 8; y += 1)
          x[y] = 1 << y;
        for (var y = 8; y < 256; y += 1)
          x[y] = x[y - 4] ^ x[y - 5] ^ x[y - 6] ^ x[y - 8];
        for (var y = 0; y < 255; y += 1)
          C[x[y]] = y;
        var T = {};
        return T.glog = function(w) {
          if (w < 1)
            throw "glog(" + w + ")";
          return C[w];
        }, T.gexp = function(w) {
          for (; w < 0; )
            w += 255;
          for (; w >= 256; )
            w -= 255;
          return x[w];
        }, T;
      })();
      function d(x, C) {
        if (typeof x.length > "u")
          throw x.length + "/" + C;
        var y = (function() {
          for (var w = 0; w < x.length && x[w] == 0; )
            w += 1;
          for (var S = new Array(x.length - w + C), b = 0; b < x.length - w; b += 1)
            S[b] = x[b + w];
          return S;
        })(), T = {};
        return T.getAt = function(w) {
          return y[w];
        }, T.getLength = function() {
          return y.length;
        }, T.multiply = function(w) {
          for (var S = new Array(T.getLength() + w.getLength() - 1), b = 0; b < T.getLength(); b += 1)
            for (var p = 0; p < w.getLength(); p += 1)
              S[b + p] ^= l.gexp(l.glog(T.getAt(b)) + l.glog(w.getAt(p)));
          return d(S, 0);
        }, T.mod = function(w) {
          if (T.getLength() - w.getLength() < 0)
            return T;
          for (var S = l.glog(T.getAt(0)) - l.glog(w.getAt(0)), b = new Array(T.getLength()), p = 0; p < T.getLength(); p += 1)
            b[p] = T.getAt(p);
          for (var p = 0; p < w.getLength(); p += 1)
            b[p] ^= l.gexp(l.glog(w.getAt(p)) + S);
          return d(b, 0).mod(w);
        }, T;
      }
      var u = (function() {
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
        ], C = function(w, S) {
          var b = {};
          return b.totalCount = w, b.dataCount = S, b;
        }, y = {}, T = function(w, S) {
          switch (S) {
            case o.L:
              return x[(w - 1) * 4 + 0];
            case o.M:
              return x[(w - 1) * 4 + 1];
            case o.Q:
              return x[(w - 1) * 4 + 2];
            case o.H:
              return x[(w - 1) * 4 + 3];
            default:
              return;
          }
        };
        return y.getRSBlocks = function(w, S) {
          var b = T(w, S);
          if (typeof b > "u")
            throw "bad rs block @ typeNumber:" + w + "/errorCorrectionLevel:" + S;
          for (var p = b.length / 3, B = [], j = 0; j < p; j += 1)
            for (var D = b[j * 3 + 0], J = b[j * 3 + 1], V = b[j * 3 + 2], ce = 0; ce < D; ce += 1)
              B.push(C(J, V));
          return B;
        }, y;
      })(), f = function() {
        var x = [], C = 0, y = {};
        return y.getBuffer = function() {
          return x;
        }, y.getAt = function(T) {
          var w = Math.floor(T / 8);
          return (x[w] >>> 7 - T % 8 & 1) == 1;
        }, y.put = function(T, w) {
          for (var S = 0; S < w; S += 1)
            y.putBit((T >>> w - S - 1 & 1) == 1);
        }, y.getLengthInBits = function() {
          return C;
        }, y.putBit = function(T) {
          var w = Math.floor(C / 8);
          x.length <= w && x.push(0), T && (x[w] |= 128 >>> C % 8), C += 1;
        }, y;
      }, m = function(x) {
        var C = a.MODE_NUMBER, y = x, T = {};
        T.getMode = function() {
          return C;
        }, T.getLength = function(b) {
          return y.length;
        }, T.write = function(b) {
          for (var p = y, B = 0; B + 2 < p.length; )
            b.put(w(p.substring(B, B + 3)), 10), B += 3;
          B < p.length && (p.length - B == 1 ? b.put(w(p.substring(B, B + 1)), 4) : p.length - B == 2 && b.put(w(p.substring(B, B + 2)), 7));
        };
        var w = function(b) {
          for (var p = 0, B = 0; B < b.length; B += 1)
            p = p * 10 + S(b.charAt(B));
          return p;
        }, S = function(b) {
          if ("0" <= b && b <= "9")
            return b.charCodeAt(0) - 48;
          throw "illegal char :" + b;
        };
        return T;
      }, v = function(x) {
        var C = a.MODE_ALPHA_NUM, y = x, T = {};
        T.getMode = function() {
          return C;
        }, T.getLength = function(S) {
          return y.length;
        }, T.write = function(S) {
          for (var b = y, p = 0; p + 1 < b.length; )
            S.put(
              w(b.charAt(p)) * 45 + w(b.charAt(p + 1)),
              11
            ), p += 2;
          p < b.length && S.put(w(b.charAt(p)), 6);
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
        return T;
      }, $ = function(x) {
        var C = a.MODE_8BIT_BYTE, y = s.stringToBytes(x), T = {};
        return T.getMode = function() {
          return C;
        }, T.getLength = function(w) {
          return y.length;
        }, T.write = function(w) {
          for (var S = 0; S < y.length; S += 1)
            w.put(y[S], 8);
        }, T;
      }, M = function(x) {
        var C = a.MODE_KANJI, y = s.stringToBytesFuncs.SJIS;
        if (!y)
          throw "sjis not supported.";
        (function(S, b) {
          var p = y(S);
          if (p.length != 2 || (p[0] << 8 | p[1]) != b)
            throw "sjis not supported.";
        })("友", 38726);
        var T = y(x), w = {};
        return w.getMode = function() {
          return C;
        }, w.getLength = function(S) {
          return ~~(T.length / 2);
        }, w.write = function(S) {
          for (var b = T, p = 0; p + 1 < b.length; ) {
            var B = (255 & b[p]) << 8 | 255 & b[p + 1];
            if (33088 <= B && B <= 40956)
              B -= 33088;
            else if (57408 <= B && B <= 60351)
              B -= 49472;
            else
              throw "illegal char at " + (p + 1) + "/" + B;
            B = (B >>> 8 & 255) * 192 + (B & 255), S.put(B, 13), p += 2;
          }
          if (p < b.length)
            throw "illegal char at " + (p + 1);
        }, w;
      }, _ = function() {
        var x = [], C = {};
        return C.writeByte = function(y) {
          x.push(y & 255);
        }, C.writeShort = function(y) {
          C.writeByte(y), C.writeByte(y >>> 8);
        }, C.writeBytes = function(y, T, w) {
          T = T || 0, w = w || y.length;
          for (var S = 0; S < w; S += 1)
            C.writeByte(y[S + T]);
        }, C.writeString = function(y) {
          for (var T = 0; T < y.length; T += 1)
            C.writeByte(y.charCodeAt(T));
        }, C.toByteArray = function() {
          return x;
        }, C.toString = function() {
          var y = "";
          y += "[";
          for (var T = 0; T < x.length; T += 1)
            T > 0 && (y += ","), y += x[T];
          return y += "]", y;
        }, C;
      }, I = function() {
        var x = 0, C = 0, y = 0, T = "", w = {}, S = function(p) {
          T += String.fromCharCode(b(p & 63));
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
        return w.writeByte = function(p) {
          for (x = x << 8 | p & 255, C += 8, y += 1; C >= 6; )
            S(x >>> C - 6), C -= 6;
        }, w.flush = function() {
          if (C > 0 && (S(x << 6 - C), x = 0, C = 0), y % 3 != 0)
            for (var p = 3 - y % 3, B = 0; B < p; B += 1)
              T += "=";
        }, w.toString = function() {
          return T;
        }, w;
      }, W = function(x) {
        var C = x, y = 0, T = 0, w = 0, S = {};
        S.read = function() {
          for (; w < 8; ) {
            if (y >= C.length) {
              if (w == 0)
                return -1;
              throw "unexpected end of file./" + w;
            }
            var p = C.charAt(y);
            if (y += 1, p == "=")
              return w = 0, -1;
            if (p.match(/^\s$/))
              continue;
            T = T << 6 | b(p.charCodeAt(0)), w += 6;
          }
          var B = T >>> w - 8 & 255;
          return w -= 8, B;
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
        return S;
      }, Q = function(x, C) {
        var y = x, T = C, w = new Array(x * C), S = {};
        S.setPixel = function(j, D, J) {
          w[D * y + j] = J;
        }, S.write = function(j) {
          j.writeString("GIF87a"), j.writeShort(y), j.writeShort(T), j.writeByte(128), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(0), j.writeByte(255), j.writeByte(255), j.writeByte(255), j.writeString(","), j.writeShort(0), j.writeShort(0), j.writeShort(y), j.writeShort(T), j.writeByte(0);
          var D = 2, J = p(D);
          j.writeByte(D);
          for (var V = 0; J.length - V > 255; )
            j.writeByte(255), j.writeBytes(J, V, 255), V += 255;
          j.writeByte(J.length - V), j.writeBytes(J, V, J.length - V), j.writeByte(0), j.writeString(";");
        };
        var b = function(j) {
          var D = j, J = 0, V = 0, ce = {};
          return ce.write = function(le, ke) {
            if (le >>> ke)
              throw "length over";
            for (; J + ke >= 8; )
              D.writeByte(255 & (le << J | V)), ke -= 8 - J, le >>>= 8 - J, V = 0, J = 0;
            V = le << J | V, J = J + ke;
          }, ce.flush = function() {
            J > 0 && D.writeByte(V);
          }, ce;
        }, p = function(j) {
          for (var D = 1 << j, J = (1 << j) + 1, V = j + 1, ce = B(), le = 0; le < D; le += 1)
            ce.add(String.fromCharCode(le));
          ce.add(String.fromCharCode(D)), ce.add(String.fromCharCode(J));
          var ke = _(), Re = b(ke);
          Re.write(D, V);
          var Ge = 0, Ke = String.fromCharCode(w[Ge]);
          for (Ge += 1; Ge < w.length; ) {
            var Et = String.fromCharCode(w[Ge]);
            Ge += 1, ce.contains(Ke + Et) ? Ke = Ke + Et : (Re.write(ce.indexOf(Ke), V), ce.size() < 4095 && (ce.size() == 1 << V && (V += 1), ce.add(Ke + Et)), Ke = Et);
          }
          return Re.write(ce.indexOf(Ke), V), Re.write(J, V), Re.flush(), ke.toByteArray();
        }, B = function() {
          var j = {}, D = 0, J = {};
          return J.add = function(V) {
            if (J.contains(V))
              throw "dup key:" + V;
            j[V] = D, D += 1;
          }, J.size = function() {
            return D;
          }, J.indexOf = function(V) {
            return j[V];
          }, J.contains = function(V) {
            return typeof j[V] < "u";
          }, J;
        };
        return S;
      }, A = function(x, C, y) {
        for (var T = Q(x, C), w = 0; w < C; w += 1)
          for (var S = 0; S < x; S += 1)
            T.setPixel(S, w, y(S, w));
        var b = _();
        T.write(b);
        for (var p = I(), B = b.toByteArray(), j = 0; j < B.length; j += 1)
          p.writeByte(B[j]);
        return p.flush(), "data:image/gif;base64," + p;
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
var Nb = Lb();
const Db = /* @__PURE__ */ Bb(Nb), Pb = ["width", "height", "viewBox"], jb = ["width", "height"], qb = ["d"], Fb = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = N(() => {
      const s = Db(0, "M");
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
      }, null, 8, jb),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, qb)
    ], 8, Pb));
  }
}, f$ = /* @__PURE__ */ Y(Fb, [["__scopeId", "data-v-489f0852"]]), Wb = {
  __name: "WindowRoom",
  props: { padding: { type: String, default: "8px 12px" } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "window-room",
      "data-window-room": "",
      style: me({ padding: e.padding })
    }, [
      ue(t.$slots, "default", {}, void 0, !0)
    ], 4));
  }
}, h$ = /* @__PURE__ */ Y(Wb, [["__scopeId", "data-v-47e67f04"]]), m$ = fl(() => import("./VoiceFigure-DyA5b5WP.js").then((e) => e.V)), p$ = "1.1.0", g$ = "3.5";
export {
  Pu as $,
  Me as A,
  Ce as B,
  _x as C,
  as as D,
  at as E,
  Mx as F,
  ok as G,
  m4 as H,
  wx as I,
  fk as J,
  _t as K,
  jy as L,
  Ba as M,
  yk as N,
  dk as O,
  ss as P,
  q4 as Q,
  G5 as R,
  Dn as S,
  z4 as T,
  j5 as U,
  Se as V,
  Hn as W,
  P5 as X,
  D5 as Y,
  Du as Z,
  Y as _,
  C5 as a,
  lx as a$,
  gk as a0,
  K5 as a1,
  Y5 as a2,
  Ae as a3,
  r4 as a4,
  o4 as a5,
  $t as a6,
  J5 as a7,
  y4 as a8,
  y5 as a9,
  ex as aA,
  D4 as aB,
  Ay as aC,
  x4 as aD,
  $4 as aE,
  Sx as aF,
  Ri as aG,
  U4 as aH,
  yn as aI,
  M5 as aJ,
  b5 as aK,
  mx as aL,
  kn as aM,
  yx as aN,
  h4 as aO,
  P4 as aP,
  j4 as aQ,
  N4 as aR,
  cn as aS,
  bt as aT,
  k5 as aU,
  yv as aV,
  B4 as aW,
  z5 as aX,
  Ti as aY,
  Dt as aZ,
  Ut as a_,
  cx as aa,
  gx as ab,
  E5 as ac,
  q5 as ad,
  F5 as ae,
  s4 as af,
  a4 as ag,
  i4 as ah,
  R5 as ai,
  Po as aj,
  Z5 as ak,
  v4 as al,
  Cx as am,
  O4 as an,
  A4 as ao,
  E4 as ap,
  l4 as aq,
  t4 as ar,
  e4 as as,
  n4 as at,
  H4 as au,
  g4 as av,
  k4 as aw,
  Ix as ax,
  Xt as ay,
  w4 as az,
  Ck as b,
  Tx as b$,
  tk as b0,
  vx as b1,
  K4 as b2,
  G4 as b3,
  Wv as b4,
  yi as b5,
  ox as b6,
  p4 as b7,
  is as b8,
  lt as b9,
  J4 as bA,
  nx as bB,
  dt as bC,
  V4 as bD,
  sx as bE,
  b4 as bF,
  T4 as bG,
  M4 as bH,
  Oe as bI,
  f4 as bJ,
  ax as bK,
  qx as bL,
  Fx as bM,
  g5 as bN,
  bv as bO,
  u4 as bP,
  Z4 as bQ,
  O5 as bR,
  Ax as bS,
  Y4 as bT,
  X4 as bU,
  Q4 as bV,
  c4 as bW,
  Cy as bX,
  d4 as bY,
  _4 as bZ,
  Ex as b_,
  tx as ba,
  _s as bb,
  Ar as bc,
  Bx as bd,
  Dx as be,
  W4 as bf,
  hx as bg,
  v5 as bh,
  C4 as bi,
  Lx as bj,
  X5 as bk,
  Q5 as bl,
  L5 as bm,
  V5 as bn,
  $5 as bo,
  dx as bp,
  T5 as bq,
  I5 as br,
  N5 as bs,
  R4 as bt,
  hv as bu,
  kx as bv,
  uk as bw,
  B5 as bx,
  S5 as by,
  I4 as bz,
  Ve as c,
  Vl as c$,
  x5 as c0,
  w5 as c1,
  S4 as c2,
  Px as c3,
  ja as c4,
  jx as c5,
  Ki as c6,
  fx as c7,
  H5 as c8,
  W5 as c9,
  t$ as cA,
  p$ as cB,
  g$ as cC,
  a5 as cD,
  n$ as cE,
  sa as cF,
  d5 as cG,
  h0 as cH,
  xt as cI,
  fa as cJ,
  Yn as cK,
  e5 as cL,
  o5 as cM,
  Rl as cN,
  Ag as cO,
  c$ as cP,
  n5 as cQ,
  f$ as cR,
  Xx as cS,
  Ku as cT,
  Gb as cU,
  h5 as cV,
  xw as cW,
  Jn as cX,
  r5 as cY,
  Ft as cZ,
  op as c_,
  vv as ca,
  _5 as cb,
  lk as cc,
  L4 as cd,
  Ta as ce,
  $y as cf,
  F4 as cg,
  Qt as ch,
  Rt as ci,
  Jb as cj,
  e$ as ck,
  he as cl,
  bu as cm,
  Au as cn,
  Xn as co,
  Xb as cp,
  hr as cq,
  u$ as cr,
  p5 as cs,
  Tp as ct,
  jn as cu,
  Wx as cv,
  Ub as cw,
  Nt as cx,
  Zc as cy,
  ge as cz,
  Fv as d,
  c5 as d0,
  Kb as d1,
  qt as d2,
  d$ as d3,
  Zi as d4,
  Qc as d5,
  ct as d6,
  i5 as d7,
  ls as d8,
  m$ as d9,
  Kx as dA,
  Fe as dB,
  Qb as dC,
  t5 as dD,
  zx as dE,
  Vb as dF,
  zb as dG,
  et as dH,
  Yk as dI,
  l5 as dJ,
  Qx as dK,
  Vk as dL,
  s$ as dM,
  hg as dN,
  Zo as dO,
  Tw as dP,
  ui as dQ,
  Yx as dR,
  na as dS,
  Jx as dT,
  Zx as dU,
  Wt as dV,
  o$ as dW,
  h$ as da,
  ni as db,
  Gx as dc,
  km as dd,
  Ja as de,
  wm as df,
  Oc as dg,
  i$ as dh,
  r$ as di,
  or as dj,
  Cc as dk,
  Zb as dl,
  l$ as dm,
  m5 as dn,
  f5 as dp,
  u5 as dq,
  Ux as dr,
  dh as ds,
  Hx as dt,
  a$ as du,
  r0 as dv,
  Kk as dw,
  Yb as dx,
  s5 as dy,
  Vx as dz,
  We as e,
  fv as f,
  U5 as g,
  Rx as h,
  un as i,
  bx as j,
  Nx as k,
  ux as l,
  xx as m,
  Bk as n,
  px as o,
  A5 as p,
  La as q,
  Vi as r,
  Gi as s,
  Le as t,
  $x as u,
  Uv as v,
  Ox as w,
  rx as x,
  ix as y,
  bn as z
};
