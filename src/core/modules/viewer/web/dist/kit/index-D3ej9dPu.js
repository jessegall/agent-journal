/* @code-commandments-generated */
import { openBlock as c, createElementBlock as h, renderSlot as he, createElementVNode as g, normalizeClass as Z, Fragment as K, renderList as te, normalizeStyle as fe, defineComponent as Zi, Comment as Xi, h as da, cloneVNode as Qi, createBlock as G, withCtx as W, unref as z, createVNode as D, toDisplayString as $, createCommentVNode as O, inject as _e, useAttrs as Vn, computed as N, ref as I, resolveDynamicComponent as $t, mergeProps as tt, Transition as Nt, watch as pe, shallowRef as Gn, createTextVNode as oe, TransitionGroup as Vo, reactive as ha, onMounted as Le, onUnmounted as Te, nextTick as mt, useId as Go, Teleport as fa, withModifiers as be, isRef as Fa, onBeforeUnmount as Dt, resolveComponent as el, resolveDirective as tl, withDirectives as ht, useModel as Ns, getCurrentInstance as nl, mergeModels as Ds, getCurrentScope as Ko, onScopeDispose as Yo, provide as sl, onErrorCaptured as al, toHandlers as ol, createSlots as rl, vShow as il, useSlots as ll, withKeys as Zt, vModelText as Ps, defineAsyncComponent as cl } from "vue";
const Y = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, ul = { class: "skeleton-line" }, dl = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("span", ul, [
      he(t.$slots, "default", {}, void 0, !0),
      g("span", {
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
}, pt = /* @__PURE__ */ Y(dl, [["__scopeId", "data-v-0ebb6933"]]), cn = Zi({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Xi);
      return s.length !== 1 ? da(K, { key: n }, s) : s[0].key == null ? Qi(s[0], { key: n }) : s[0];
    };
  }
}), hl = ["aria-label"], fl = ["aria-label"], ml = ["aria-label"], pl = ["aria-label"], gl = ["aria-label"], vl = ["aria-label"], yl = ["aria-label"], kl = {
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
      messages: W(() => [
        g("div", {
          class: "skeleton-messages",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(), h(K, null, te(t, (d) => g("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6)), 64))
        ], 8, hl)
      ]),
      older: W(() => [
        g("div", {
          class: "skeleton-messages skeleton-older",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(t.slice(0, 3), (d) => (c(), h("div", {
            key: d.id,
            class: Z(["skeleton-message", { mine: d.mine }]),
            style: fe({ width: `${d.width}%`, height: `${d.height}px` })
          }, null, 6))), 128))
        ], 8, fl)
      ]),
      cards: W(() => [
        g("div", {
          class: "skeleton-cards",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-card"
          }, [
            (c(), h(K, null, te(n, (f) => D(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, ml)
      ]),
      file: W(() => [
        g("div", {
          class: "skeleton-files",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), h("div", {
            key: d,
            class: "skeleton-file"
          }, [
            D(pt, {
              class: "skeleton-file-head",
              bars: s
            }),
            (c(), h(K, null, te(a, (f) => D(pt, {
              key: f.id,
              bars: f.bars
            }, null, 8, ["bars"])), 64))
          ]))), 128))
        ], 8, pl)
      ]),
      page: W(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          D(pt, {
            class: "skeleton-heading",
            bars: i
          }),
          (c(!0), h(K, null, te(e.count, (d) => (c(), G(pt, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, gl)
      ]),
      text: W(() => [
        g("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), G(pt, {
            key: d,
            bars: z(r)
          }, null, 8, ["bars"]))), 128))
        ], 8, vl)
      ]),
      default: W(() => [
        g("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (c(!0), h(K, null, te(e.count, (d) => (c(), G(pt, {
            key: d,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, yl)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, Pt = /* @__PURE__ */ Y(kl, [["__scopeId", "data-v-1392eacb"]]), wl = {
  key: 1,
  class: "empty-state titled"
}, bl = { class: "empty-state-title" }, xl = { class: "empty-state-text" }, $l = {
  key: 2,
  class: "empty-state"
}, Ml = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (c(), G(Pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (c(), h("div", wl, [
      g("p", bl, $(e.title), 1),
      g("p", xl, [
        he(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (c(), h("p", $l, [
      he(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Dn = /* @__PURE__ */ Y(Ml, [["__scopeId", "data-v-b27e89b0"]]), Sl = { class: "fold-group" }, _l = ["aria-expanded"], El = { class: "fold-label" }, Al = {
  key: 0,
  class: "fold-count"
}, Cl = {
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
    return (s, a) => (c(), h("div", Sl, [
      g("button", {
        type: "button",
        class: Z(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        g("span", El, $(e.label), 1),
        e.count !== "" ? (c(), h("span", Al, $(e.count), 1)) : O("", !0),
        g("span", {
          class: Z(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, _l),
      e.open ? he(s.$slots, "default", {}, void 0, !0, 0) : O("", !0)
    ]));
  }
}, $b = /* @__PURE__ */ Y(Cl, [["__scopeId", "data-v-9ef1865c"]]), Ol = Symbol("open-view"), Ae = Symbol.for("journal.window-context");
function jt() {
  const e = _e(Ae, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Tl = ["stroke-width", "innerHTML"], ge = {
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
    }, null, 12, Tl));
  }
}, Il = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: "spinner",
      style: fe({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Rl = /* @__PURE__ */ Y(Il, [["__scopeId", "data-v-eb453d6f"]]), Bl = 120, Ll = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const t = e, n = Vn(), s = N(() => Object.fromEntries(Object.entries(n).filter(([u]) => u !== "onClick"))), a = I(!1), o = N(() => t.busy || a.value), r = _e(Ae, null), i = N(() => o.value || t.disabled || !!(r != null && r.readOnly));
    async function l(u) {
      const d = [n.onClick].flat().filter(Boolean).map((p) => p(u)).filter((p) => p instanceof Promise);
      if (!d.length) return;
      const f = setTimeout(() => a.value = !0, Bl);
      try {
        await Promise.all(d);
      } finally {
        clearTimeout(f), a.value = !1;
      }
    }
    return (u, d) => (c(), G($t(e.href ? "a" : "button"), tt(s.value, {
      type: e.href ? void 0 : "button",
      href: e.href || void 0,
      class: ["btn", e.kind, { small: e.small, large: e.large, busy: o.value, fill: e.fill, bordered: e.bordered }],
      "aria-busy": o.value,
      disabled: i.value,
      onClick: l
    }), {
      default: W(() => [
        g("span", {
          class: Z(["btn-label", { hidden: o.value }])
        }, [
          e.icon ? (c(), G(ge, {
            key: 0,
            name: e.icon,
            size: 12
          }, null, 8, ["name"])) : O("", !0),
          he(u.$slots, "default", {}, void 0, !0)
        ], 2),
        o.value ? (c(), G(Rl, {
          key: 0,
          class: "btn-spinner"
        })) : O("", !0)
      ]),
      _: 3
    }, 16, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}), ye = /* @__PURE__ */ Y(Ll, [["__scopeId", "data-v-033d70ca"]]), Nl = {
  class: "running",
  "data-running-command": ""
}, Dl = ["title"], Pl = {
  key: "idle",
  class: "running-idle"
}, jl = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (c(), h("span", Nl, [
      D(Nt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: W(() => [
          e.text ? (c(), h("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, $(e.text), 9, Dl)) : (c(), h("span", Pl, $(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Mb = /* @__PURE__ */ Y(jl, [["__scopeId", "data-v-d3240219"]]), ql = ["aria-checked", "aria-label", "title"], Fl = {
  key: 0,
  class: "switch-inner"
}, Wl = {
  key: 0,
  class: "switch-word"
}, Hl = {
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
        e.labelled ? (c(), h("span", Fl, $(e.word), 1)) : O("", !0),
        a[1] || (a[1] = g("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (c(), h("span", Wl, $(e.word), 1)) : O("", !0)
    ], 10, ql));
  }
}, Sb = /* @__PURE__ */ Y(Hl, [["__scopeId", "data-v-1bfb90f3"]]);
function Jo(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Xt(e, t) {
  return Jo(() => localStorage, e, t);
}
function Zo(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function Kn(e, t) {
  return Zo(() => localStorage, e, t);
}
function Xo(e, t) {
  pe(t, (n) => Kn(e, n), { deep: !0 });
}
function Ul(e, t) {
  return Jo(() => sessionStorage, e, t);
}
function zl(e, t) {
  return Zo(() => sessionStorage, e, t);
}
const Pn = "journal.environment", Qo = I(Ul(Pn, Xt(Pn, "")));
function Vl(e) {
  Qo.value = e, zl(Pn, e), Kn(Pn, e);
}
const jn = I(location.hash), Wa = Gn(null), Ha = { integrations: "mcp", library: "team" };
function Gl() {
  if (!Wa.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ha[n]) {
    location.replace(`#/${[Ha[n], ...s].join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash;
    return;
  }
  !n || Wa.value(n) || (Vl(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), jn.value = location.hash);
}
window.addEventListener("hashchange", () => {
  jn.value = location.hash, Gl();
});
const Xe = N(() => {
  const [e, t = ""] = jn.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((r) => {
    const [i, l = ""] = r.split("@"), [u = "", d = "", f = ""] = i.split(":");
    return { table: u, id: Number(d), comment: Number(f) || 0, env: l };
  });
  return {
    env: Qo.value,
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
function Kl(e = "", t = 0, n = "") {
  location.hash = Yn.page(e, t, n);
}
const Yl = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function er(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([r]) => r !== "open" && r !== "sub").map(([r, i]) => `${r}=${encodeURIComponent(i)}`), ...e.length ? [`open=${e.map(Yl).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const Tt = {};
function _b(e, t) {
  return Tt[e] = t, () => Tt[e] === t && delete Tt[e];
}
function tr(e, t, n = 0, s = "") {
  var r;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((r = Tt[e]) != null && r.call(Tt, t))) return;
  const a = Xe.value.stack, o = a.findIndex((i) => i.table === e && i.id === t);
  er([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Jl(e, t, n, s = 0, a = "") {
  if (e === Xe.value.env) return tr(t, n, s, a);
  const o = Xe.value.stack, r = o.findIndex((i) => i.table === t && i.id === n && i.env === e);
  er([...r < 0 ? o : o.slice(0, r), { table: t, id: n, comment: s, env: e }], a);
}
function Fe(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Jl(s, a, Number(o), 0, t) : tr(a, Number(o), 0, t);
}
function Zl(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function Ot(e) {
  const t = Zl(e);
  t && Fe(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const Jn = typeof document < "u" && document.documentElement.classList.contains("phone"), Xl = "Files are attached on the computer; the phone sends text.", is = [
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
}), un = {
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
}, Ql = ["secrets", "plugins"], nr = Object.keys(un).filter((e) => !(Jn && Ql.includes(e)));
N(() => nr.map((e) => ({ name: e, ...un[e] })));
const dn = (e) => un[e], sr = new Map(nr.flatMap((e) => [e, e.replace(/s$/, ""), un[e].title.toLowerCase()].map((t) => [t, e]))), ut = (e) => sr.get(String(e).toLowerCase()) || "", ar = [...sr.keys()].sort((e, t) => t.length - e.length).join("|"), Zn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (c(), G(ye, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: W(() => [
        D(ge, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, ec = {
  key: 1,
  class: "row-list-failure"
}, tc = ["data-row"], nc = {
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
    const t = e, n = N(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = I(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, r) => !e.loaded && !e.failure ? (c(), G(Pt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (c(), h("p", ec, $(e.failure), 1)) : !e.rows.length && e.loaded ? (c(), G(Dn, {
      key: 2,
      title: e.searching ? e.matches : e.empty,
      "data-row-list-empty": "",
      "data-searching": e.searching ? "" : void 0
    }, {
      default: W(() => [
        oe($(e.searching ? "Try other words, or clear the search." : e.hint), 1)
      ]),
      _: 1
    }, 8, ["title", "data-searching"])) : (c(), h(K, { key: 3 }, [
      (c(), G($t(e.arrival ? Vo : "ul"), tt(n.value, { class: "row-list" }), {
        default: W(() => [
          (c(!0), h(K, null, te(e.rows, (i) => (c(), h("li", {
            key: i.id,
            class: "row-list-row",
            "data-row": i.id
          }, [
            he(o.$slots, "default", { row: i }, void 0, !0)
          ], 8, tc))), 128))
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
}, sc = /* @__PURE__ */ Y(nc, [["__scopeId", "data-v-aa6ad7ff"]]), ac = {
  class: "agent-rows",
  "data-agent-rows": ""
}, oc = {
  key: 1,
  class: "agent-rows-note"
}, rc = {
  key: 2,
  class: "agent-rows-note"
}, ic = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, lc = ["data-agent-row", "onClick"], cc = { class: "agent-row-name" }, uc = { class: "agent-row-state" }, dc = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = N(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = N(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (c(), h("div", ac, [
      e.loaded ? e.failure ? (c(), h("p", oc, $(e.failure), 1)) : e.rows.length ? (c(), h(K, { key: 3 }, [
        g("p", ic, $(s.value) + " running", 1),
        (c(!0), h(K, null, te(n.value, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": r.id,
          onClick: (i) => z(Fe)(`agents:${r.id}`)
        }, [
          g("span", cc, "#" + $(r.id) + " " + $(r.session), 1),
          g("span", uc, $(r.ended_at ? "Closed" : "Running"), 1)
        ], 8, lc))), 128))
      ], 64)) : (c(), h("p", rc, $(e.none), 1)) : (c(), G(Pt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Eb = /* @__PURE__ */ Y(dc, [["__scopeId", "data-v-a01e5a17"]]), hc = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("span", {
      class: Z(["badge", e.tone])
    }, $(e.text), 3));
  }
}, or = /* @__PURE__ */ Y(hc, [["__scopeId", "data-v-9e7e1157"]]), fc = ["aria-valuenow", "aria-valuemax"], mc = {
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
        style: fe({ width: n.value })
      }, null, 4)
    ], 10, fc));
  }
}, pc = /* @__PURE__ */ Y(mc, [["__scopeId", "data-v-9eba6a85"]]), gc = { class: "bars" }, vc = { class: "bar-name" }, yc = { class: "bar-value" }, kc = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => Math.max(1, ...n.items.map((r) => Number(r.value) || 0))), o = N(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (r, i) => (c(), h("div", gc, [
      (c(!0), h(K, null, te(e.items, (l, u) => (c(), G($t(l.open ? "button" : "div"), {
        key: `${u}-${l.label}`,
        type: l.open ? "button" : void 0,
        class: Z(["bar-row", l.tone, { opens: l.open }]),
        onClick: (d) => l.open && s("open", l.open)
      }, {
        default: W(() => [
          g("span", vc, $(l.label), 1),
          D(pc, {
            value: Number(l.value) || 0,
            max: a.value,
            tone: l.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          g("span", yc, $(l.value) + $(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wc = /* @__PURE__ */ Y(kc, [["__scopeId", "data-v-663427f4"]]), bc = { class: "bars" }, xc = {
  key: 0,
  class: "bars-title"
}, $c = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", bc, [
      e.node.title ? (c(), h("span", xc, $(e.node.title), 1)) : O("", !0),
      D(wc, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, Mc = /* @__PURE__ */ Y($c, [["__scopeId", "data-v-7135bb11"]]), Sc = {
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
      (c(!0), h(K, null, te(e.node.children || [], (l, u) => (c(), G(Dr, {
        key: u,
        node: l,
        onOpen: i[0] || (i[0] = (d) => a("open", d)),
        onFile: i[1] || (i[1] = (d) => a("file", d))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Tn = /* @__PURE__ */ Y(Sc, [["__scopeId", "data-v-d142a3f4"]]), _c = {
  key: 0,
  class: "card-head"
}, Ec = { class: "card-title" }, Ac = {
  key: 0,
  class: "card-note"
}, Cc = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("section", {
      class: Z(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (c(), h("header", _c, [
        g("span", Ec, $(e.node.title), 1),
        e.node.note ? (c(), h("span", Ac, $(e.node.note), 1)) : O("", !0)
      ])) : O("", !0),
      D(Tn, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Oc = /* @__PURE__ */ Y(Cc, [["__scopeId", "data-v-67b72d40"]]), Ua = (e) => [...new Set(e.agents.map((t) => t.name))], Ab = (e) => Ua(e).length === 1 ? `Worker: ${Ua(e)[0]}` : "Delegated", Tc = (e) => "task_ids" in e, rr = 1024, Ic = rr * 1024 * 1024, Rc = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${rr} MB limit for one file.`;
function Bc() {
  return () => {
  };
}
function js(e = document) {
  const t = e.activeElement;
  return !!t && (t.isContentEditable || t.matches("input, textarea") && !!t.value);
}
function ir(e = window) {
  if (!js(e.document)) {
    e.location.reload();
    return;
  }
  const t = e.setInterval(() => {
    js(e.document) || (e.clearInterval(t), e.location.reload());
  }, 1e3);
}
const qs = "journal.stale-build-reload", Lc = 'script[type="module"][src*="/assets/index-"]', za = (e) => {
  var t;
  return ((t = e.querySelector(Lc)) == null ? void 0 : t.getAttribute("src")) ?? "";
};
async function Nc(e = document, t = fetch, n = () => ir(window)) {
  const s = za(e), a = s ? await t("/viewer/", { cache: "no-store" }).catch(() => null) : null;
  if (!(a != null && a.ok)) return !1;
  const o = za(new DOMParser().parseFromString(await a.text(), "text/html"));
  return !o || o === s ? !1 : (n(), !0);
}
let ls = "";
function Dc(e, t = () => ir(window)) {
  if (!e) return !1;
  const n = !!ls && ls !== e;
  return ls = e, n && t(), n;
}
const Pc = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function jc(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(qs) === e.message) return !1;
    t.setItem(qs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function qc(e = window.sessionStorage) {
  try {
    e.removeItem(qs);
  } catch {
    return;
  }
}
const Fc = 2e3, Wc = 3e4, ze = ha({ starting: !1, external: !1, late: !1, offline: !1 }), ma = () => ze.starting, Hc = 3;
let bn = 0, Fs = 0, lr = 0, cr = [];
async function Uc() {
  try {
    const e = await je.serverState();
    return { reachable: !0, ...e.ok ? await e.json() : { restarting: !1, updating: !1 } };
  } catch {
    return { reachable: !1, restarting: !0, updating: ze.external };
  }
}
function zc() {
  clearInterval(Fs), clearTimeout(lr), Fs = 0, Object.assign(ze, { starting: !1, external: !1, late: !1, offline: !1 }), cr.splice(0).forEach((e) => e()), Nc();
}
let cs = !1;
async function Vc() {
  if (ze.offline = !navigator.onLine, cs) return;
  cs = !0;
  const e = await Uc();
  if (cs = !1, ze.external = e.updating, bn = !e.restarting && !e.updating && e.reachable ? bn + 1 : 0, bn < Hc) return;
  bn = 0, (!Dc(e.started_at) || js()) && zc();
}
function Va() {
  ze.starting || (ze.starting = !0, ze.offline = !navigator.onLine, Fs = setInterval(Vc, Fc), lr = setTimeout(() => ze.late = !0, Wc));
}
const Gc = () => ze.starting ? new Promise((e) => cr.push(e)) : Promise.resolve(), Ga = 2e4, Kc = 3e5, Ye = 6e5, xn = 6, Yc = 500, Jc = "/journal/summary", Zc = "/api/server-state", Xc = 2e4, Ka = Jn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, Qc = (e) => e.split("?")[0].endsWith(Jc), ur = (e, t) => Object.assign(new Error(t), { status: e });
async function eu(e, t, n = ur) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const tu = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class nu {
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
        headers: { ...Ka, ...r, ...s === void 0 || i ? {} : { "Content-Type": "application/json" } },
        body: tu(s),
        signal: AbortSignal.timeout(a || (i ? Kc : Ga))
      });
    } catch (l) {
      if (l instanceof TypeError && Va(), t !== "GET" || !(l instanceof TypeError) || o <= 1) throw l;
      return await new Promise((u) => setTimeout(u, Yc)), this.reach(t, n, s, a, o - 1, r);
    }
  }
  async send(t, n, s, a = 0, o = xn, r = {}) {
    this.watcher("sent", t, n, s);
    const i = t === "GET" ? () => {
    } : Bc(), l = await this.reach(t, n, s, a, o, r).finally(() => {
      i(), this.watcher("answered", t, n, s);
    });
    return eu(l, `${l.status} ${l.statusText}`).catch((u) => {
      throw u.blocked && t !== "GET" && this.refused(u.message), u;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: Ka, signal: AbortSignal.timeout(Ga) });
    if (!n.ok) throw ur(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, r = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, xn, o).then((l) => (this.written(n), l));
    if (ma() && !Qc(n))
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
    return fetch(Zc, { cache: "no-store", signal: AbortSignal.timeout(Xc) });
  }
  // a request of the phone app or a shared page to an address beside the page, or a file the build carries, answered
  // as the browser's own response; one the server never answered puts the cover up
  async raw(t, n = {}) {
    try {
      return await fetch(t, n);
    } catch (s) {
      throw s instanceof TypeError && Va(), s;
    }
  }
}
const je = new nu(), Be = (e) => encodeURIComponent(e);
function ue(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const Ft = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: r = !1 }) => [r ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Wt = "the page does not know its environment yet", su = "X-Journal-Env", au = "X-Journal-Request-At", us = "/viewer/voices/figures/";
class pa {
  constructor({ env: t = () => Xe.value.env, base: n = "" } = {}) {
    this.env = t, this.base = n;
  }
  at(t, n = this.env) {
    return new pa({ base: t, env: typeof n == "function" ? n : () => n });
  }
  in(t) {
    return this.at(this.base, t);
  }
  url(t) {
    return `${this.base}/journal${t}`;
  }
  // every request names its environment, and the moment it was sent, from which the journal counts its time
  headers() {
    return { [au]: String(Date.now()), ...this.env() ? { [su]: this.env() } : {} };
  }
  // a read keyed by what it reads, within this environment: by default its endpoint, never its query
  get(t, n = t.split("?")[0]) {
    return t === Wt ? Promise.reject(new Error(Wt)) : je.request("GET", this.url(t), void 0, 0, this.headers(), `${this.env()} ${n}`);
  }
  post(t, n = {}, s = 0) {
    return t === Wt ? Promise.reject(new Error(Wt)) : je.request("POST", this.url(t), n, s, this.headers());
  }
  here(t) {
    return this.env() ? t : Wt;
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
    return je.stream(this.address("/entries/stream" + n));
  }
  // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
  list(t, { limit: n, before: s, after: a, since: o, ids: r = [], tasks: i = [], closed: l = !1, docked: u = !1 } = {}) {
    const d = this.here(`/${t}${ue({ limit: n, before: s, after: a, since: o, ids: r.join(","), tasks: i.join(","), closed: l ? "1" : "", docked: u ? "1" : "" })}`);
    return this.get(d, `${t}.${Ft({ before: s, after: a, since: o, ids: r, tasks: i, closed: l, docked: u })}`);
  }
  // the own chat of a worker or a subagent, by its session
  chat(t, { limit: n, before: s, since: a, docked: o = !1 } = {}) {
    const r = this.here(`/chats/${encodeURIComponent(t)}${ue({ limit: n, before: s, since: a, docked: o ? "1" : "" })}`);
    return this.get(r, `chats/${t}.${Ft({ before: s, since: a, docked: o })}`);
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
    if (Jn) return Promise.reject(Object.assign(new Error(Xl), { status: 403 }));
    if (s.size > Ic) return Promise.reject(new Error(Rc(s)));
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
    return this.get(this.here(`${a}${ue(s)}`), `${a}.${Ft(s)}`);
  }
  verifierTranscript(t, n = {}) {
    return this.get(this.here(`/verifiers/${t}/transcript${ue(n)}`), `/verifiers/${t}/transcript.${Ft(n)}`);
  }
  workerTranscript(t, n = {}) {
    return this.get(this.here(`/workers/${t}/transcript${ue(n)}`), `/workers/${t}/transcript.${Ft(n)}`);
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
    return je.request("GET", us + "figures.json");
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
const Ve = new pa({ base: Jn ? "/p" : "" }), ou = (e) => je.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(Ve.base.length).split("/")[2]);
}), Ya = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), ru = 6e4, iu = 4, lu = 300, cu = 5e3, dr = /* @__PURE__ */ new Map();
function Xn(e) {
  if (!(e in Ya)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ya[e];
}
function uu(e) {
  const t = Xn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return cu;
  }
}
const du = (e) => e / 2 + Math.random() * e / 2, hr = (e) => [...e.users.values()].pop(), ga = (e) => dr.get(e.place) === e, hu = () => Math.random() * lu, va = () => document.hidden;
function fu(e) {
  const t = uu(e);
  return e.failures ? du(Math.min(ru, t * 2 ** e.failures)) : Math.max(t, iu * e.took);
}
function fr(e, t) {
  clearTimeout(e.timer), !(!ga(e) || va()) && (e.timer = setTimeout(() => mu(e), t));
}
function mu(e) {
  return ga(e) ? e.running ? (e.again = !0, e.running) : (e.running = yu(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const pu = (e) => {
  var t, n;
  return !va() && (((n = (t = Xn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && hr(e).active() && !ma();
};
async function gu(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await je.attemptOnce(() => Xn(e.key).read(hr(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function vu(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = Xn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function yu(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      pu(e) && vu(e, await gu(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ga(e));
  fr(e, fu(e));
}
const ku = () => va() || dr.forEach((e) => fr(e, hu()));
document.addEventListener("visibilitychange", ku);
const Ee = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, mr = (e) => `${e.table}:${e.id}`, Ja = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", ds = 80;
function Za(e) {
  return e.length <= ds ? e : `${e.slice(0, ds + 1).replace(/\s+\S*$/, "") || e.slice(0, ds)}…`;
}
const Xa = {
  messages: (e) => Za(Ja(e.text)),
  comments: (e) => Za(Ja(e.text)),
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
}, wu = (e) => (Xa[e.table] ? Xa[e.table](e) : e.title || "") || "", bu = ["done", "cancelled"], Ws = {
  tasks: (e) => Ee(e.completed_at) || (e.state === "cancelled" ? Ee(e.updated_at) : 0),
  questions: (e) => e.answer ? Ee(e.updated_at) : 0,
  plans: (e) => bu.includes(e.state) ? Ee(e.updated_at) : 0,
  pins: (e) => Ee(e.closed_at),
  secrets: (e) => Ee(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Ee(e.updated_at) : 0,
  shares: (e) => Ee(e.stopped_at),
  dumps: (e) => Ee(e.completed_at),
  agents: (e) => e.state === "ended" ? Ee(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Ee(e.created_at) : 0
}, xu = (e) => Ws[e.table] ? Ws[e.table](e) : 0, pr = (e) => xu(e) > 0, $u = (e) => !!Ws[e], xt = (e) => Ee(e.created_at), ya = (e) => Ee(e.updated_at) || xt(e), Mu = 60, Su = (e, t) => Ee(e.created_at) >= Ee(t.created_at) - Mu, _u = (e, t) => e.id > 0 && e.table === t.table && Su(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), ka = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => _u(s, n))), Eu = { me: 1, people: [] }, ie = ha({
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
  people: Eu,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Xt("journal.activity", !0),
  wide: !1,
  sideMini: Xt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Xo("journal.activity", () => ie.activity);
Xo("journal.side.mini", () => ie.sideMini);
const Au = 50, gr = 100, Cu = { messages: 25 }, He = (e) => Cu[e] || Au;
function Ou(e, t) {
  if (e !== "messages") return Math.max(t.length - He(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === He(e)) return s;
  return 0;
}
const ft = /* @__PURE__ */ new Set(), wa = I(0), hn = /* @__PURE__ */ new Set(), fn = /* @__PURE__ */ new Set(), rt = /* @__PURE__ */ new Set(), Hs = /* @__PURE__ */ new Set(), Tu = /* @__PURE__ */ new Map(), Iu = /* @__PURE__ */ new Map();
let Ht = !1, Ut = null;
const Ru = (e, t) => e.id - t.id, Bu = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, Lu = { messages: Bu }, vr = (e) => Lu[e] || Ru;
function yr(e) {
  return wa.value, ft.has(e) || (ft.add(e), ie.booted && (!hn.has(e) || fn.has(e)) && queueMicrotask(() => ba([e], !1))), ie.rows[e] || [];
}
function Nu(e) {
  const t = ie.rows[e] || [], n = Ou(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ie.rows[e] = t.filter((a) => s.has(a) || $u(e) && !pr(a)), ie.paging.size[e] = He(e), ie.paging.more[e] = !0;
}
const Du = /* @__PURE__ */ new Set();
function Pu() {
  ft.forEach(Nu), ft.clear(), Tu.clear(), Iu.clear(), wa.value += 1;
}
pe(() => `${Xe.value.env}/${Xe.value.page}/${Xe.value.open ? Xe.value.open.table : ""}`, Pu);
pe(
  () => ie.booted,
  (e) => e && ba(
    [...ft].filter((t) => !hn.has(t)),
    !1
  )
);
const Us = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Tc(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function kr(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Us(s) && !Us(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function wr(e, t) {
  hn.add(e), wa.value += 1;
  const n = ie.rows[e] || [];
  ie.rows[e] = [...kr(n, t.rows), ...ka(n.filter((s) => s.id === 0), t.rows)], ie.paging.size[e] = ie.paging.size[e] || He(e), ie.paging.more[e] = !t.is_last_page;
}
async function ju(e) {
  const t = new Set((ie.rows[e] || []).map((o) => o.id)), n = await Ve.list(e, { limit: He(e) });
  Qn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = ka((ie.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return wr(e, { ...n, rows: [...n.rows, ...a].sort(vr(e)) }), ie.paging.size[e] = He(e), br.has(e) && await xr(e), ie.rows[e];
}
const Qn = (e, t) => ie.counts = { ...ie.counts, [e]: t };
async function qu(e) {
  const t = ie.rows[e] || [], n = Math.max(0, ...t.map(ya)), s = t.length ? Math.min(...t.map((i) => i.id)) - 1 : 0, a = await Ve.list(e, { limit: He(e), since: n, after: s });
  if (Qn(e, a.counts), !a.is_last_page) return ju(e);
  const o = new Map(a.rows.map((i) => [i.id, i])), r = ka(t.filter((i) => !o.has(i.id)), a.rows).concat(kr(t, a.rows));
  return ie.rows[e] = r.sort(vr(e)), ie.paging.size[e] = ie.rows[e].length, ie.rows[e];
}
const hs = /* @__PURE__ */ new Set();
async function Fu(e, t = !1) {
  e.forEach((n) => fn.delete(n)), e.forEach((n) => Hs.add(n));
  try {
    await Ku(e, t);
  } finally {
    e.forEach((n) => Hs.delete(n));
  }
}
async function Wu(e) {
  const t = await Ve.list(e, { limit: He(e) });
  Qn(e, t.counts), wr(e, t);
}
async function Hu(e) {
  Qn(e, (await Ve.list(e, { limit: 1, closed: !0 })).counts);
}
const br = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function xr(e) {
  const t = (ie.rows[e] || []).filter((a) => Us(a) && (e !== "plans" || !pr(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await Ve.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ie.rows[e] = (ie.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Uu = (e, t) => !hn.has(e) || t && (ie.paging.size[e] || He(e)) === He(e) && !Du.has(e);
async function zu(e, t) {
  if (!ft.has(e)) return Hu(e);
  const n = await (Uu(e, t) ? Wu(e) : qu(e));
  return br.has(e) && await xr(e), n;
}
async function $r() {
  const e = await Ve.settings();
  JSON.stringify(e) !== JSON.stringify(ie.settings) && (ie.settings = e);
}
async function Vu() {
  const [e] = await Promise.all([Ve.entries(0, gr), $r()]);
  Zu([...Xt(Sr(), []), ...e]);
}
const Gu = (e, t) => zu(e, t).then(
  () => null,
  () => e
);
async function Ku(e, t) {
  const n = (await Promise.all(e.map((s) => Gu(s, t)))).filter(Boolean);
  if (n.forEach((s) => (rt.add(s), fn.add(s))), t && await Vu(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Mr = 1e3, Yu = 15e3;
let $n = Mr;
async function Ju() {
  return Ut || (Ut = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...rt].some((e) => !hs.has(e)) || Ht; ) {
      const e = Ht, t = [...e ? Object.keys(ie.rows) : rt].filter((s) => un[s] && (ft.has(s) || s in ie.rows)).filter((s) => e || !ft.has(s) || fn.has(s) || !hn.has(s)).filter((s) => !hs.has(s)), n = [...rt].filter((s) => hs.has(s));
      rt.clear(), n.forEach((s) => rt.add(s)), Ht = !1;
      try {
        await Fu(t, e), $n = Mr;
      } catch {
        Ht = Ht || e, await new Promise((a) => setTimeout(a, $n)), $n = Math.min($n * 2, Yu);
      }
    }
  })().finally(() => Ut = null), Ut);
}
function ba(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Hs.has(n)).forEach((n) => {
    rt.add(n), t && fn.add(n);
  }), rt.delete("settings") && $r(), Ju();
}
const Sr = () => {
  var e;
  return `typed-entries:${((e = ie.identity) == null ? void 0 : e.root) || location.host}:${Ve.env()}`;
};
function Zu(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ie.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-gr), Kn(Sr(), ie.entries.slice(-50));
}
ou((e) => ie.streamOpen || ba([e]));
const zs = [], Xu = 2e3, ot = /* @__PURE__ */ new Map(), Qu = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, ed = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function Mt(e, { first: t = !1 } = {}) {
  t ? zs.unshift(e) : zs.push(e), ot.clear();
}
function _r(e, t, n) {
  var a;
  const s = yr(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const td = (e) => yr(e.table).find((t) => t.id === e.id) === e.row, nd = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", t.document ? "document" : "note", e].join("\0");
function et(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function sd(e, t) {
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
function Qt(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/~~([^~\n]+)~~/g, "<del>$1</del>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return ad(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function ad(e) {
  return e.split(ed).map((t, n) => n % 2 ? t : t.replace(Qu, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Qa(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function od(e) {
  const [t, , ...n] = e, s = Qa(t).map((o) => `<th>${Qt(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Qa(o).map((r) => `<td>${Qt(r)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
const Er = /^\s*(?:[-*+]|\d+[.)])\s+/, Vs = /^\s*(\d+)[.)]\s/, eo = (e) => e.match(/^\s*/)[0].length;
function Ar(e) {
  const t = e[0].match(Vs), n = eo(e[0]), s = [];
  for (const o of e) {
    const r = o.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/), i = s[s.length - 1];
    r && eo(o) <= n ? s.push({ text: r[2], nested: [] }) : i && o.trim() && (r || i.nested.length) ? i.nested.push(o) : i && o.trim() && (i.text += ` ${o.trim()}`);
  }
  return `${t ? `<ol${t[1] === "1" ? "" : ` start="${t[1]}"`}>` : "<ul>"}${s.map((o) => `<li>${Qt(o.text)}${o.nested.length ? Ar(o.nested) : ""}</li>`).join("")}</${t ? "ol" : "ul"}>`;
}
function rd(e, t) {
  const n = Vs.test(e[t]);
  let s = t + 1;
  for (let a = s; a < e.length; a += 1)
    if (Er.test(e[a]) && Vs.test(e[a]) === n || a === s && /^\s{2,}\S/.test(e[a])) s = a + 1;
    else if (e[a].trim()) break;
  return s;
}
const to = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Cr(e) {
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
      n.push(`<h${i}>${Qt(o[2])}</h${i}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (to(t, s)) {
      let i = s + 2;
      for (; i < t.length && t[i].includes("|"); ) i += 1;
      n.push(od(t.slice(s, i))), s = i;
      continue;
    }
    if (Er.test(a)) {
      const i = rd(t, s);
      n.push(Ar(t.slice(s, i))), s = i;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let i = s;
      for (; i < t.length && /^(?:>|&gt;)\s?/.test(t[i]); ) i += 1;
      n.push(
        `<blockquote>${Cr(
          t.slice(s, i).map((l) => l.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = i;
      continue;
    }
    let r = s;
    for (; r < t.length && t[r].trim() && !to(t, r) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[r]); )
      r += 1;
    n.push(`<p>${Qt(t.slice(s, r).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = r;
  }
  return n.join("");
}
const id = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, ld = (e) => e.kind !== "text" && !id.test(e.html);
function cd(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Cr(s).replace(/\u0001(\d+)\u0001/g, (o, r) => t[Number(r)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : ld(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function Gs(e, t = { env: "" }) {
  const n = nd(e, t), s = ot.get(n);
  if (ot.delete(n), s && s.reads.every(td))
    return ot.set(n, s), s.html;
  const a = [], o = cd(sd(e, { ...t, reads: a }));
  return ot.set(n, { html: o, reads: a }), ot.size > Xu && ot.delete(ot.keys().next().value), o;
}
const Or = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, mn = (e) => String(e || "").replace(Or, (t, n, s, a) => a), ud = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Mn = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, dd = /^Traceback \(most recent call last\):/m, hd = 8;
function Tr(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, hd).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function fd(e) {
  const t = [...e.matchAll(ud)].map((s) => s.index);
  if (Mn.lastIndex = 0, !t.length || !Mn.test(e)) return null;
  Mn.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), r = [...o.matchAll(Mn)];
    return { head: r.length ? o.slice(0, r[0].index).trim() : o, frames: r.map((i) => i[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Tr(n), tail: "" } : null;
}
function md(e) {
  const t = dd.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Tr([o]), tail: n.slice(a).join(`
`) };
}
Mt((e) => {
  const t = mn(e), n = md(t) || fd(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const pd = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, gd = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, vd = /[\w\]]\(/, yd = /^[\w$.[\]'"]+\s*=\s*[^=]/, kd = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, wd = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, bd = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, xd = /[[({,]$/, $d = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, Md = /^(\t|\s{2,})\S/, Sd = /^(\/\/|#(?!#|\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*(?!\*)\/?|<!--)/, _d = /`[^`]+`/, Ed = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, Ad = /[{}()[\];=<>$&|*\\@+^~%]/g, Ir = /^\s*(?:[-*+]|\d+[.)])\s/, Cd = /^\s*>/, Od = /^\s*\|/, Td = 0.6, Id = 0.4, Rd = 5, Bd = 0.03, Rr = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= Rd && t.every((n) => Ed.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(Ad) ?? []).length / e.length < Bd;
}, fs = (e) => {
  const t = e.trim();
  return _d.test(t) ? !1 : [pd, gd, vd, yd, kd, wd, bd, xd, $d].some((n) => n.test(t)) || /[;{}]$/.test(t) || Md.test(e) && !Ir.test(e) && !Rr(e);
};
function Ld(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || Ir.test(t[0]) || t.every((o) => Cd.test(o) || Od.test(o))) return "text";
  const n = t.filter((o) => !Sd.test(o.trim()));
  if (t.length === 1) return !n.length || fs(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(fs).length, a = n.filter((o) => !fs(o) && Rr(o)).length;
  return s >= n.length * Td && a <= n.length * Id ? "code" : "text";
}
const Ks = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", Nd = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", Dd = `${Ks} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, Pd = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", jd = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", no = {
  js: { keywords: Ks, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: Nd, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: Dd, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: Ks, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: Pd, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'], keyed: !0 },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: jd, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
}, qd = {
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
function so(e, t, n) {
  return n && e.startsWith(n, t);
}
function Fd(e, t) {
  const n = no[qd[t] ?? t] || no.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (so(e, o, n.line) || n.hash && i === "#") {
      const u = e.indexOf(`
`, o);
      r("comment", e.slice(o, u < 0 ? e.length : u)), o = u < 0 ? e.length : u;
      continue;
    }
    if (n.block && so(e, o, n.block[0])) {
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
function Wd(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Fd(e, t))
    a.split(`
`).forEach((r, i) => {
      i && n.push(""), r && (n[n.length - 1] += s === "plain" ? et(r) : `<span class="tok-${s}">${et(r)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Hd(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Ud = 1500, ao = /* @__PURE__ */ new WeakMap();
async function zd(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Hd(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(ao.get(t)), ao.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Ud)
  )));
}
typeof document < "u" && document.addEventListener("click", zd, !0);
const Vd = /\n\s*\n/, Gd = /^(\s*)(`{3,}|~{3,})\s*([\w+#.-]+)?[^`]*$/, Kd = /^\s*(`{3,}|~{3,})\s*$/, Yd = /^\s{4,}\S/, Jd = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, Ys = /^\s*(?:[-*+]|\d+[.)])\s/, Br = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Zd = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function xa(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Xd(e) {
  const t = xa(e.join(`
`));
  return (Zd.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Qd = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && Br.test(t) && !Ys.test(t);
}, eh = (e, t) => Ys.test(t) || Ys.test([...e].reverse().find((n) => n.trim()) || "");
function $a(e, t) {
  const n = t || Xd(e), s = Wd(xa(e.join(`
`)), n).map((a) => `<span class="code-line">${a}
</span>`).join("");
  return { kind: "html", html: `<div class="chat-code-block" data-language="${n}"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${s}</code></pre></div>` };
}
function th(e, t, n) {
  const s = e.findIndex((a, o) => o > t && a.trim().startsWith(n) && Kd.test(a));
  return s < 0 ? e.length : s;
}
function nh(e, t, n) {
  const s = e.map((a) => a.replace(new RegExp(`^\\s{0,${t.length}}`), ""));
  return $a(s.map(mn), n ? n.toLowerCase() : "");
}
function sh(e) {
  const t = e.split(Vd).map((r) => ({ paragraph: r, kind: Ld(xa(r).split(`
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
      a(), n.push($a(i.map(({ paragraph: l }) => l).join(`

`).split(`
`).map(mn), "")), o = r;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function ah(e, t) {
  const n = e.split(`
`), s = [];
  let a = [];
  const o = () => {
    a.length && s.push(...t ? [{ kind: "text", text: a.join(`
`) }] : sh(a.join(`
`))), a = [];
  };
  let r = 0;
  for (; r < n.length; ) {
    const i = n[r].match(Gd);
    if (i) {
      const u = th(n, r, i[2]);
      o(), s.push(nh(n.slice(r + 1, u), i[1], i[3])), r = u + 1;
      continue;
    }
    const l = Qd(a) ? Jd : Yd;
    if (!t && l.test(n[r]) && !eh(a, n[r])) {
      let u = r;
      for (; u < n.length && (l.test(n[u]) || !n[u].trim()); ) u += 1;
      for (; u > r && !n[u - 1].trim(); ) u -= 1;
      const d = [];
      for (; a.length && a[a.length - 1].trim() && Br.test(a[a.length - 1].trim()); ) d.unshift(a.pop());
      if (u - r + d.length >= 2) {
        o(), s.push($a([...d, ...n.slice(r, u)].map(mn), "")), r = u;
        continue;
      }
      a.push(...d);
    }
    a.push(n[r]), r += 1;
  }
  return o(), s.length > 1 || s[0] && s[0].kind === "html" ? s : null;
}
Mt((e, t) => ah(e, t.document));
const oh = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, rh = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function ih(e) {
  const t = oh.exec(e);
  if (t && ut(t[1])) return { at: t.index, length: t[0].length, table: ut(t[1]), id: Number(t[2]), label: t[3] };
  const n = rh.exec(e), s = n && ut(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function lh(e, t, n, s) {
  const a = _r(s, e, t), o = mn(a ? wu(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${et(dn(e).title)} ${t}</span><span class="row-card-title">${et(o)}</span></a>`;
}
Mt(
  (e, t) => {
    const n = ih(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: lh(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ch = /\.(png|jpe?g|gif|webp|svg)$/i, uh = (e) => ch.test(e), dh = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, hh = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function fh(e, t) {
  const n = dh.exec(e), [, s, a, o, r, i] = n || [], l = n && ut(s || o), u = l && _r(t, l, Number(a || r));
  if (!u || !(u.files || []).includes(i)) return null;
  const d = Ve.in(t.env).fileUrl(l, u.id, i), f = `${dn(l).title} ${u.id} · ${et(i)}`, p = uh(i) ? `<img class="file-card-image" src="${d}" alt="${et(i)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${d}" data-attached="${et(i)}">${p}<span class="file-card-name">${f}</span></a>` };
}
function mh(e) {
  const t = hh.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${et(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
Mt(
  (e, t) => {
    if (t.inline) return null;
    const n = fh(e, t) || mh(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const ph = /`([^`\n]+)`/g;
Mt((e) => e.replace(ph, (t, n) => `<code>${n}</code>`));
const oo = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${Yn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
Mt(
  (e, t) => e.replace(Or, (n, s, a, o) => oo[s] ? oo[s](a, o, t) : o)
);
const gh = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, Lr = new RegExp(`\\b(${ar}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), Nr = new RegExp(`\\b(${ar}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), vh = new RegExp(`<code>((?:${Lr.source}|${Nr.source}))</code>`, "gi"), yh = (e) => e.replace(vh, "$1"), kh = (e, t) => `<a class="row-pill" href="#" data-peek="${ut(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, wh = (e) => e.replace(Nr, (t, n, s) => s.replace(/\d+/g, (a) => kh(n.replace(/s$/i, ""), a))), bh = (e) => wh(e).replace(
  Lr,
  (t, n, s, a = "", o) => {
    const r = s || o;
    return `<a class="row-pill" href="#" data-peek="${ut(n)}:${r}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${r}${a ? `:${a}` : ""}</span></a>`;
  }
);
Mt(
  (e, t) => t.rowNames === !1 ? e : yh(e).split(gh).map((n, s) => s % 2 ? n : bh(n)).join("")
);
const xh = ["innerHTML"], $h = ["innerHTML"], Mh = {
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
      onClick: a[0] || (a[0] = (...o) => z(Ot) && z(Ot)(...o)),
      innerHTML: n.value
    }, null, 8, xh)) : (c(), h("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => z(Ot) && z(Ot)(...o)),
      innerHTML: n.value
    }, null, 8, $h));
  }
}, lt = /* @__PURE__ */ Y(Mh, [["__scopeId", "data-v-1a43d211"]]), Sh = { class: "fact" }, _h = { class: "fact-label" }, Eh = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", Sh, [
      g("span", _h, $(e.label), 1),
      D(lt, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, Ah = /* @__PURE__ */ Y(Eh, [["__scopeId", "data-v-3a88ecf8"]]), Ch = { class: "list" }, Oh = { class: "list-label" }, Th = {
  key: 1,
  class: "list-note"
}, Ih = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", Ch, [
      (c(!0), h(K, null, te(e.items, (o, r) => (c(), G($t(o.open ? "button" : "div"), {
        key: r,
        type: o.open ? "button" : void 0,
        class: Z(["list-item", { opens: o.open }]),
        onClick: (i) => o.open && n("open", o.open)
      }, {
        default: W(() => [
          g("span", Oh, $(o.label), 1),
          o.badge ? (c(), G(or, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : O("", !0),
          o.note ? (c(), h("span", Th, $(o.note), 1)) : O("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, Rh = /* @__PURE__ */ Y(Ih, [["__scopeId", "data-v-ebe2ae0a"]]), Bh = { class: "table" }, Lh = {
  key: 0,
  class: "table-row empty"
}, Nh = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, r) => (c(), h("div", Bh, [
      g("div", {
        class: "table-row head",
        style: fe(a.value)
      }, [
        (c(!0), h(K, null, te(e.columns, (i) => (c(), h("span", {
          key: i,
          class: "cell"
        }, $(i), 1))), 128))
      ], 4),
      (c(!0), h(K, null, te(e.rows, (i, l) => (c(), G($t(i.open ? "button" : "div"), {
        key: l,
        type: i.open ? "button" : void 0,
        class: Z(["table-row", i.tone, { opens: i.open }]),
        style: fe(a.value),
        onClick: (u) => i.open && s("open", i.open)
      }, {
        default: W(() => [
          (c(!0), h(K, null, te(i.cells, (u, d) => (c(), h("span", {
            key: d,
            class: "cell"
          }, $(u), 1))), 128))
        ]),
        _: 2
      }, 1032, ["type", "class", "style", "onClick"]))), 128)),
      !e.rows.length && e.empty ? (c(), h("div", Lh, $(e.empty), 1)) : O("", !0)
    ]));
  }
}, Dh = /* @__PURE__ */ Y(Nh, [["__scopeId", "data-v-9326a52e"]]), Ph = { class: "stat-value" }, jh = { class: "stat-label" }, qh = {
  key: 0,
  class: "stat-note"
}, Fh = {
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
    return (s, a) => (c(), G($t(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: Z(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: W(() => [
        g("span", Ph, $(e.value), 1),
        g("span", jh, $(e.label), 1),
        e.note ? (c(), h("span", qh, $(e.note), 1)) : O("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, Wh = /* @__PURE__ */ Y(Fh, [["__scopeId", "data-v-ad0db6d6"]]), Hh = { class: "code" }, Uh = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, r) => (c(), G(cn, {
      value: e.node.type
    }, {
      stack: W(() => [
        D(Tn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: W(() => [
        D(Tn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: W(() => [
        D(Tn, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: W(() => [
        D(Oc, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      heading: W(() => [
        g("h3", {
          class: Z(["heading", `level-${e.node.level || 2}`])
        }, $(e.node.text), 3)
      ]),
      divider: W(() => [...r[2] || (r[2] = [
        g("hr", { class: "divider" }, null, -1)
      ])]),
      stat: W(() => [
        D(Wh, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: r[0] || (r[0] = (i) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: W(() => [
        D(Mc, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: W(() => [
        D(Dh, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: W(() => [
        D(Rh, {
          items: e.node.items,
          onOpen: s
        }, null, 8, ["items"])
      ]),
      text: W(() => [
        D(lt, {
          class: "text",
          text: e.node.body
        }, null, 8, ["text"])
      ]),
      fact: W(() => [
        D(Ah, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: W(() => [
        D(or, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: W(() => [
        g("pre", Hh, [
          g("code", null, $(e.node.text), 1)
        ])
      ]),
      file: W(() => [
        g("button", {
          type: "button",
          class: "file",
          onClick: r[1] || (r[1] = (i) => a(e.node))
        }, $(e.node.label || (e.node.line ? `${e.node.path}:${e.node.line}` : e.node.path)), 1)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}), Dr = /* @__PURE__ */ Y(Uh, [["__scopeId", "data-v-cbdcf540"]]), zh = { class: "dashboard" }, Vh = { class: "trail" }, Gh = ["onClick"], Kh = {
  key: 0,
  class: "gone",
  role: "status"
}, Yh = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (p) => p in (n.document.pages || {}), o = I(!!n.page && !a(n.page)), r = I(n.page && !o.value ? [n.page] : []), i = N(() => r.value.at(-1) || n.document.start), l = N(() => (n.document.pages || {})[i.value] || null), u = (p) => ((n.document.pages || {})[p] || {}).title || p, d = (p) => {
      o.value = !1, r.value = [...r.value, p];
    }, f = (p) => {
      o.value = !1, r.value = r.value.slice(0, p);
    };
    return pe(
      () => n.document.start,
      () => r.value = []
    ), (p, v) => (c(), h("div", zh, [
      e.document.broken ? (c(), G(Dn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: W(() => [
          oe($(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (c(), G(Dn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: W(() => [
          oe($(e.document.missing), 1)
        ]),
        _: 1
      })) : l.value ? (c(), h(K, { key: 2 }, [
        g("nav", Vh, [
          g("button", {
            type: "button",
            class: Z(["step", { current: !r.value.length }]),
            onClick: v[0] || (v[0] = (M) => f(0))
          }, $(u(e.document.start)), 3),
          (c(!0), h(K, null, te(r.value, (M, x) => (c(), h(K, {
            key: `${x}-${M}`
          }, [
            v[2] || (v[2] = g("span", { class: "sep" }, "/", -1)),
            g("button", {
              type: "button",
              class: Z(["step", { current: x === r.value.length - 1 }]),
              onClick: (S) => f(x + 1)
            }, $(u(M)), 11, Gh)
          ], 64))), 128))
        ]),
        o.value ? (c(), h("p", Kh, "What you opened is no longer in this dashboard. Here is its start page.")) : O("", !0),
        D(Nt, {
          name: "page",
          mode: "out-in"
        }, {
          default: W(() => [
            (c(), h("div", {
              key: i.value,
              class: "page"
            }, [
              D(Dr, {
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
}, Cb = /* @__PURE__ */ Y(Yh, [["__scopeId", "data-v-fbe83734"]]);
function Jh(e, t, n, s = () => window) {
  Le(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Te(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Zh = (e, t = () => !0) => Jh("keydown", (n) => n.key === "Escape" && t() && e());
function Pr(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = I(!1), a = N(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Zh(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Xh = 80, At = ha([]);
function jr(e) {
  const t = Symbol("layer"), n = () => At.includes(t) && At.splice(At.indexOf(t), 1);
  return pe(
    e,
    (s) => {
      s && !At.includes(t) && At.push(t), s || n();
    },
    { immediate: !0 }
  ), Te(n), N(() => Xh + Math.max(0, At.indexOf(t)));
}
let qr = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return qr = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Qh = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function ef(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const r = [...e.value.querySelectorAll(Qh)];
    if (!r.length) return o.preventDefault();
    const [i, l] = [r[0], r.at(-1)];
    o.shiftKey && document.activeElement === i ? (o.preventDefault(), l.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === l && (o.preventDefault(), i.focus({ preventScroll: !0 }));
  }
  Le(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : qr, document.addEventListener("keydown", a), mt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Te(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const tf = ["aria-modal", "aria-label", "aria-labelledby"], nf = {
  key: 0,
  class: "dialog-head"
}, sf = ["id", "tabindex"], af = {
  key: 1,
  class: "dialog-foot"
}, of = 500, rf = 400, lf = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Pr(s, n), i = jr(a), l = I(null), u = I(null), d = I(null), f = Go(), p = I(!1), v = Date.now();
    n.modal && ef(u, () => s("escape"), d);
    function M() {
      if (!n.modal) return n.closable && o();
      p.value = !0, setTimeout(() => p.value = !1, rf);
    }
    function x(F) {
      !n.modal || Date.now() - v >= of || ![" ", "Enter"].includes(F.key) || (F.preventDefault(), F.stopPropagation());
    }
    const S = () => l.value && (l.value.scrollTop = l.value.scrollHeight), T = new MutationObserver(S);
    return pe(l, (F) => {
      T.disconnect(), F && n.follow && (T.observe(F, { childList: !0, subtree: !0, characterData: !0 }), S());
    }), Te(() => T.disconnect()), (F, Q) => (c(), G(fa, { to: "body" }, [
      D(Nt, {
        name: "dialog",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: W(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: Z(["dialog", { large: e.large, sheet: e.sheet }]),
            style: fe({ zIndex: z(i) }),
            onClick: be(M, ["self"])
          }, [
            g("section", {
              ref_key: "panel",
              ref: u,
              class: Z(["dialog-panel", { fixed: !e.fits, small: e.small, tall: e.tall, large: e.large, wide: e.wide, sheet: e.sheet, nudged: p.value }]),
              role: "dialog",
              "aria-modal": e.modal || void 0,
              "aria-label": e.modal ? void 0 : e.title,
              "aria-labelledby": e.modal ? z(f) : void 0,
              onKeydownCapture: x
            }, [
              e.bare ? O("", !0) : (c(), h("header", nf, [
                g("h3", {
                  id: z(f),
                  ref_key: "heading",
                  ref: d,
                  tabindex: e.modal ? -1 : void 0
                }, $(e.title), 9, sf),
                e.closable ? (c(), G(Zn, {
                  key: 0,
                  onClick: z(o)
                }, null, 8, ["onClick"])) : O("", !0)
              ])),
              g("div", {
                ref_key: "body",
                ref: l,
                class: Z(["dialog-body", { bare: e.bare }])
              }, [
                he(F.$slots, "default", {}, void 0, !0)
              ], 2),
              F.$slots.foot ? (c(), h("footer", af, [
                he(F.$slots, "foot", {}, void 0, !0)
              ])) : O("", !0)
            ], 42, tf)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, cf = /* @__PURE__ */ Y(lf, [["__scopeId", "data-v-6d1ecd98"]]), at = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, qe = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Pe = { across: 48, down: 110, margin: 32, labelSpace: 14 }, uf = 6;
function Ma(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const df = (e) => {
  const t = Ma(e, at.lineChars), n = Math.max(at.minWidth, Math.max(...t.map((s) => s.length)) * at.charWidth + at.padX * 2);
  return { name: e, lines: t, line: at.line, padY: at.padY, width: n, height: t.length * at.line + at.padY * 2 };
};
function hf(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (r) => {
    a.set(r, "open"), t.forEach((i, l) => {
      if (i[0] !== r) return;
      const u = a.get(i[1]);
      u === "open" ? s.add(l) : u || o(i[1]);
    }), a.set(r, "done");
  };
  return [...n, ...e].forEach((r) => a.has(r) || o(r)), s;
}
function ff(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, r]) => {
      n.get(r) < n.get(o) + 1 && (n.set(r, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function mf(e, t, n) {
  const s = [];
  e.forEach((r) => {
    var i;
    return (s[i = n.get(r)] || (s[i] = [])).push(r);
  });
  const a = () => new Map(s.flatMap((r) => r.map((i, l) => [i, l]))), o = (r, i) => {
    const l = a(), u = (d) => {
      const f = i(d).map((p) => l.get(p));
      return f.length ? f.reduce((p, v) => p + v, 0) / f.length : l.get(d);
    };
    return [...r].sort((d, f) => u(d) - u(f));
  };
  for (let r = 0; r < uf; r++) {
    const i = r % 2 === 0, l = s.map((u, d) => d);
    (i ? l.slice(1) : l.slice(0, -1).reverse()).forEach((u) => {
      const d = (f) => t.filter((p) => p[i ? 1 : 0] === f).map((p) => p[i ? 0 : 1]);
      s[u] = o(s[u], d);
    });
  }
  return s;
}
function pf(e, t) {
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
function gf(e) {
  const t = [...new Set(e.flatMap(([E, b]) => [E, b]))], n = new Set(e.map(([, E]) => E)), s = t.filter((E) => !n.has(E)), a = hf(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((E, b) => !a.has(b)), r = ff(t, o), i = mf(t, o, r), l = new Map(t.map((E) => [E, df(E)])), u = i.map((E) => E.reduce((b, A) => b + l.get(A).width, 0) + Pe.across * (E.length - 1)), d = Math.max(...u) + Pe.margin * 2, f = yf(e, r, i.length), p = /* @__PURE__ */ new Map();
  let v = Pe.margin;
  i.forEach((E, b) => {
    let A = (d - u[b]) / 2;
    const y = Math.max(...E.map((C) => l.get(C).height));
    E.forEach((C) => {
      const k = l.get(C);
      p.set(C, { ...k, x: A, y: v + (y - k.height) / 2 }), A += k.width + Pe.across;
    }), v += y + (f[b] ?? Pe.down);
  });
  const M = e.map(([E, b, A], y) => ({ from: E, to: b, label: A || "", back: a.has(y) || r.get(b) <= r.get(E) }));
  pf(M, p);
  const x = M.map((E) => kf(E, p.get(E.from), p.get(E.to))), S = [...p.values()], T = $f(x, S), F = Math.max(v - Pe.down, ...T.filter((E) => E.label).map((E) => E.label.y + E.label.height));
  return { width: Math.max(d - Pe.margin, ...T.filter((E) => E.label).map((E) => E.label.x + E.label.width)) + Pe.margin, height: F + Pe.margin, nodes: S, arrows: T };
}
const vf = (e) => e ? Ma(e, qe.lineChars).length * qe.line + qe.pad * 2 : 0;
function yf(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Pe.labelSpace);
  return e.forEach(([a, o, r]) => {
    const [i, l] = [t.get(a), t.get(o)].sort((u, d) => u - d);
    l > i && (s[i + Math.floor((l - i - 1) / 2)] += vf(r) + Pe.labelSpace);
  }), s.map((a) => Math.max(Pe.down, a));
}
function kf(e, t, n) {
  const s = e.label ? Ma(e.label, qe.lineChars) : [], a = s.length ? Math.max(...s.map((p) => p.length)) * qe.charWidth + qe.pad * 2 : 0, o = s.length * qe.line + (s.length ? qe.pad * 2 : 0), r = t.x + t.width * e.fromShare, i = e.back ? t.y : t.y + t.height, l = n.x + n.width * e.toShare, u = e.back ? n.y + n.height : n.y, d = (u - i) / 2, f = [{ x: r, y: i }, { x: r, y: i + d }, { x: l, y: u - d }, { x: l, y: u }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: f, path: `M${r} ${i} C${r} ${i + d} ${l} ${u - d} ${l} ${u}` };
}
const wf = ([e, t, n, s], a) => {
  const o = 1 - a, r = (i) => o * o * o * e[i] + 3 * o * o * a * t[i] + 3 * o * a * a * n[i] + a * a * a * s[i];
  return { x: r("x"), y: r("y") };
}, bf = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], xf = [0, -1, 1, -2, 2, -3, 3].map((e) => e * qe.line);
function $f(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: r }) => ({ x: s, y: a, width: o, height: r }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (l, u) => {
      const d = wf(s.curve, l);
      return { x: d.x - s.labelWidth / 2, y: d.y - s.labelHeight / 2 + u, width: s.labelWidth, height: s.labelHeight };
    }, i = xf.flatMap((l) => bf.map((u) => a(u, l))).find((l) => !n.some((u) => ro(l, u))) ?? a(0.5, 0);
    for (; n.some((l) => ro(i, l)); ) i.y += qe.line;
    return n.push(i), { ...s, label: { ...i, lines: s.lines, line: qe.line, pad: qe.pad } };
  });
}
const ro = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, Mf = { class: "flowchart-tools" }, Sf = ["width", "height", "viewBox", "aria-label"], _f = ["d"], Ef = ["x", "y", "width", "height"], Af = ["x", "y"], Cf = ["x", "dy"], Of = {
  key: 0,
  class: "flowchart-label"
}, Tf = ["x", "y", "width", "height"], If = ["x", "y"], Rf = ["x", "dy"], Bf = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => gf(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, r = I(null), i = I({ zoom: 1, x: 0, y: 0 });
    let l = null;
    function u() {
      var T;
      const x = (T = r.value) == null ? void 0 : T.getBoundingClientRect();
      if (!(x != null && x.width)) return;
      const S = Math.min(x.width / a.value.width, x.height / a.value.height, 1.5);
      i.value = { zoom: S, x: (x.width - a.value.width * S) / 2, y: (x.height - a.value.height * S) / 2 };
    }
    function d(x, S, T) {
      const { zoom: F, x: Q, y: E } = i.value, b = Math.min(o.most, Math.max(o.least, F * x));
      i.value = { zoom: b, x: S - (S - Q) * b / F, y: T - (T - E) * b / F };
    }
    function f(x) {
      const S = r.value.getBoundingClientRect();
      d(x, S.width / 2, S.height / 2);
    }
    function p(x) {
      const S = r.value.getBoundingClientRect();
      x.ctrlKey || x.metaKey ? d(x.deltaY < 0 ? o.step : 1 / o.step, x.clientX - S.left, x.clientY - S.top) : i.value = { ...i.value, x: i.value.x - x.deltaX, y: i.value.y - x.deltaY };
    }
    function v(x) {
      var S, T, F;
      x.preventDefault(), (S = window.getSelection()) == null || S.removeAllRanges(), l = { x: x.clientX - i.value.x, y: x.clientY - i.value.y }, (F = (T = r.value).setPointerCapture) == null || F.call(T, x.pointerId);
    }
    function M(x) {
      l && (i.value = { ...i.value, x: x.clientX - l.x, y: x.clientY - l.y });
    }
    return Le(u), (x, S) => (c(), G(cf, {
      title: e.title,
      large: "",
      onClose: S[4] || (S[4] = (T) => s("close"))
    }, {
      default: W(() => [
        g("div", Mf, [
          D(ye, {
            small: "",
            onClick: S[0] || (S[0] = (T) => f(o.step))
          }, {
            default: W(() => [...S[5] || (S[5] = [
              oe("Zoom in", -1)
            ])]),
            _: 1
          }),
          D(ye, {
            small: "",
            onClick: S[1] || (S[1] = (T) => f(1 / o.step))
          }, {
            default: W(() => [...S[6] || (S[6] = [
              oe("Zoom out", -1)
            ])]),
            _: 1
          }),
          D(ye, {
            small: "",
            onClick: u
          }, {
            default: W(() => [...S[7] || (S[7] = [
              oe("Fit the whole chart", -1)
            ])]),
            _: 1
          })
        ]),
        g("div", {
          ref_key: "frame",
          ref: r,
          class: "flowchart-frame",
          onWheel: be(p, ["prevent"]),
          onPointerdown: v,
          onPointermove: M,
          onPointerup: S[2] || (S[2] = (T) => Fa(l) ? l.value = null : l = null),
          onPointercancel: S[3] || (S[3] = (T) => Fa(l) ? l.value = null : l = null)
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
            (c(!0), h(K, null, te(a.value.arrows, (T, F) => (c(), h("path", {
              key: `arrow-${F}`,
              class: "flowchart-arrow",
              d: T.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, _f))), 128)),
            (c(!0), h(K, null, te(a.value.nodes, (T) => (c(), h("g", {
              key: T.name,
              class: "flowchart-node"
            }, [
              g("rect", {
                x: T.x,
                y: T.y,
                width: T.width,
                height: T.height,
                rx: "8"
              }, null, 8, Ef),
              g("text", {
                x: T.x + T.width / 2,
                y: T.y + T.padY + T.line / 2
              }, [
                (c(!0), h(K, null, te(T.lines, (F, Q) => (c(), h("tspan", {
                  key: Q,
                  x: T.x + T.width / 2,
                  dy: Q ? T.line : 0
                }, $(F), 9, Cf))), 128))
              ], 8, Af)
            ]))), 128)),
            (c(!0), h(K, null, te(a.value.arrows, (T, F) => (c(), h(K, {
              key: `label-${F}`
            }, [
              T.label ? (c(), h("g", Of, [
                g("rect", {
                  x: T.label.x,
                  y: T.label.y,
                  width: T.label.width,
                  height: T.label.height,
                  rx: "4"
                }, null, 8, Tf),
                g("text", {
                  x: T.label.x + T.label.width / 2,
                  y: T.label.y + T.label.pad + T.label.line / 2
                }, [
                  (c(!0), h(K, null, te(T.label.lines, (Q, E) => (c(), h("tspan", {
                    key: E,
                    x: T.label.x + T.label.width / 2,
                    dy: E ? T.label.line : 0
                  }, $(Q), 9, Rf))), 128))
                ], 8, If)
              ])) : O("", !0)
            ], 64))), 128))
          ], 12, Sf))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Lf = /* @__PURE__ */ Y(Bf, [["__scopeId", "data-v-51d24cfe"]]), io = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', lo = {
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
  agent: io,
  worker: io,
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
}, Nf = ["innerHTML"], Df = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = N(() => lo[t.name] || lo.dot);
    return (s, a) => (c(), h("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, Nf));
  }
}, nt = /* @__PURE__ */ Y(Df, [["__scopeId", "data-v-beb5935c"]]), Pf = {
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
}, Rt = /* @__PURE__ */ Y(Pf, [["__scopeId", "data-v-d03899bb"]]), jf = ["data-tip", "aria-label"], qf = {
  key: 0,
  class: "mact-word"
}, Ff = {
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
      e.open ? (c(), h("span", qf, $(e.label), 1)) : O("", !0),
      n[0] || (n[0] = g("span", { class: "hit" }, null, -1))
    ], 10, jf));
  }
}, Fr = /* @__PURE__ */ Y(Ff, [["__scopeId", "data-v-3b292e09"]]), Wr = 120, In = 280, Hr = 160, Wf = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Hf = ["leaving", "resizing", "entering"];
function Js(e) {
  const { width: t, height: n } = e.getBoundingClientRect();
  return { width: t, height: n };
}
function Uf(e) {
  const t = Hf.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = Js(e);
  return e.classList.add(...t), n;
}
function Ur(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = I(t()), a = I("");
  let o = 0;
  const r = (f, p) => Object.assign(f.style, { width: `${p.width}px`, height: `${p.height}px` }), i = (f) => Object.assign(f.style, { width: "", height: "", transition: "" });
  function l(f, p) {
    i(f);
    const v = Uf(f);
    r(f, p), f.offsetWidth, f.style.transition = `width ${In}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${In}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, r(f, v);
  }
  function u(f) {
    const p = f.querySelector(":scope > :not(.top)");
    if (!p || typeof ResizeObserver > "u") return null;
    let v = p.offsetHeight;
    const M = new ResizeObserver(() => {
      p.offsetHeight !== v && (v = p.offsetHeight, l(f, Js(f)));
    });
    return M.observe(p), M;
  }
  async function d(f) {
    const p = e.value, v = ++o;
    if (!p || !p.offsetWidth || Wf()) {
      s.value = f;
      return;
    }
    const M = Js(p);
    if (r(p, M), a.value = "leaving", await n(Wr), v !== o) return;
    s.value = f, a.value = "resizing", await mt(), l(p, M);
    const x = u(p);
    await n(In), x == null || x.disconnect(), v === o && (i(p), a.value = "entering", await n(Hr), v === o && (a.value = ""));
  }
  return pe(t, (f) => d(f)), Dt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const zf = { class: "growing-card-top" }, Vf = ["aria-expanded"], Gf = { class: "growing-card-avatar" }, Kf = { class: "growing-card-title" }, Yf = { class: "growing-card-more" }, Jf = { class: "growing-card-body" }, Zf = {
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
    const n = e, s = t, a = I(!1), o = I(null), { folded: r, phase: i } = Ur(o, () => !a.value), l = N(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), u = N(() => n.text.split(/\n\s*\n/).filter((d) => d.trim()));
    return (d, f) => (c(), h("div", {
      ref_key: "wrap",
      ref: o,
      class: Z(["growing-card-wrap", z(i), { open: !z(r), bad: e.bad, incoming: e.incoming }])
    }, [
      g("div", zf, [
        g("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: f[0] || (f[0] = (p) => a.value = !a.value)
        }, [
          g("span", Gf, [
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
          g("span", Kf, $(e.title), 1),
          D(Rt, { open: a.value }, null, 8, ["open"])
        ], 8, Vf),
        e.action ? (c(), G(Fr, {
          key: 0,
          label: e.action,
          open: a.value,
          onClick: f[1] || (f[1] = (p) => s("act"))
        }, null, 8, ["label", "open"])) : O("", !0),
        e.commentable ? (c(), h("button", {
          key: 1,
          type: "button",
          class: "growing-card-comment",
          "data-growing-comment": "",
          title: "Comment on this message",
          "aria-label": "Comment on this message",
          onClick: f[2] || (f[2] = (p) => s("comment"))
        }, [
          D(ge, {
            name: "bubble",
            size: 13
          })
        ])) : O("", !0)
      ]),
      g("div", Yf, [
        g("div", Jf, [
          (c(!0), h(K, null, te(u.value, (p, v) => (c(), h("p", {
            key: v,
            class: "growing-card-text"
          }, $(p), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Xf = /* @__PURE__ */ Y(Zf, [["__scopeId", "data-v-08411e3a"]]), zr = /* @__PURE__ */ new WeakMap(), Qf = (e, t) => zr.set(e, t);
function e1(e, t) {
  for (let n = t; n; n = zr.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function Vr(e, t) {
  const n = (s) => {
    var o, r;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((r = e.value) == null ? void 0 : r.$el) || e.value;
    a && !e1(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Te(() => window.removeEventListener("click", n));
}
const t1 = {
  class: "message-links-few",
  "data-message-links-rows": ""
}, n1 = {
  key: 0,
  class: "message-links-many"
}, s1 = ["aria-expanded"], a1 = {
  key: 1,
  class: "message-links-list",
  "data-message-links-list": "",
  "aria-label": "Items linked to this message"
}, o1 = ["onClick"], r1 = { class: "row-pill message-links-chip" }, i1 = { class: "message-links-title" }, ms = 3, co = "task", l1 = {
  __name: "MessageLinks",
  props: { links: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = _e(Ae, null), s = N(() => t.links.length), a = N(() => t.links.every((p) => p.model === co) ? "tasks" : "items"), o = N(() => `Linked: ${t.links.map((p) => `${p.model} ${p.id}`).join(" ")}`), r = I(!1), i = I({}), l = I(null);
    Vr(l, () => r.value = !1);
    async function u() {
      const p = t.links.filter((M) => M.model === co && !(M.id in i.value)), v = await Promise.all(p.map((M) => n.read(`task show ${M.id}`)));
      i.value = { ...i.value, ...Object.fromEntries(v.filter((M) => M.ok).map((M) => [M.value.id, M.value.title])) };
    }
    function d() {
      r.value = !r.value, r.value && u();
    }
    function f(p) {
      r.value = !1, Fe(`${ut(p.model)}:${p.id}`);
    }
    return (p, v) => (c(), h("div", {
      ref_key: "line",
      ref: l,
      class: Z(["message-links", { many: s.value > ms, three: s.value === ms, open: r.value }]),
      "data-message-links": ""
    }, [
      D(nt, {
        class: "message-links-icon",
        name: "linked"
      }),
      g("span", t1, [
        D(lt, {
          text: o.value,
          inline: ""
        }, null, 8, ["text"])
      ]),
      s.value >= ms ? (c(), h("span", n1, [
        g("button", {
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          "aria-expanded": r.value,
          onClick: d
        }, [
          oe($(s.value) + " linked " + $(a.value) + " ", 1),
          D(Rt, { open: r.value }, null, 8, ["open"])
        ], 8, s1)
      ])) : O("", !0),
      r.value ? (c(), h("div", a1, [
        (c(!0), h(K, null, te(e.links, (M) => (c(), h("button", {
          key: `${M.model}:${M.id}`,
          type: "button",
          class: "message-links-row",
          onClick: (x) => f(M)
        }, [
          g("span", r1, $(M.model) + " " + $(M.id), 1),
          g("span", i1, $(i.value[M.id]), 1)
        ], 8, o1))), 128))
      ])) : O("", !0)
    ], 2));
  }
}, c1 = /* @__PURE__ */ Y(l1, [["__scopeId", "data-v-24868afd"]]), u1 = ["title", "aria-label"], d1 = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, h1 = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, f1 = {
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
      (c(), h("svg", d1, [
        o[0] || (o[0] = g("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (c(), h("path", h1)) : O("", !0)
      ]))
    ], 10, u1));
  }
}, m1 = /* @__PURE__ */ Y(f1, [["__scopeId", "data-v-6dc92808"]]);
function p1(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function g1(e, t = Date.now()) {
  const n = p1(e, t);
  return n === "now" ? "just now" : n && `${n} ago`;
}
const v1 = 36e5;
function Ob(e, t, n, s = Date.now()) {
  const a = ((n ? Date.parse(n) : s) - Date.parse(t)) / v1;
  return a > 0 && e ? Math.round(e / a) : 0;
}
function Gr(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function uo(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const ps = (e) => String(e).padStart(2, "0");
function y1(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${ps(t % 60)}s` : `${Math.floor(t / 3600)}h ${ps(Math.floor(t % 3600 / 60))}m ${ps(t % 60)}s`;
}
const k1 = "img,pre,table";
function w1(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function b1(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function x1(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(k1)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = e.offsetHeight, a = w1(b1(e), n || 0);
  a && (a >= e.offsetWidth || (e.style.width = `${a}px`, e.offsetHeight !== s && (e.style.width = "")));
}
function $1(e, t) {
  let n = null;
  const s = () => e.value && x1(e.value);
  Le(() => {
    var o, r;
    if (s(), (o = document.fonts) == null || o.ready.then(s), typeof ResizeObserver > "u" || !((r = e.value) != null && r.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([i]) => {
      i.contentRect.width !== a && (a = i.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Te(() => n == null ? void 0 : n.disconnect()), pe(t, s, { flush: "post" });
}
const M1 = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function S1(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const _1 = ["data-incoming", "data-ref"], E1 = ["data-figure-mark", "data-figure-agent", "data-from", "data-ref"], A1 = { class: "message-body" }, C1 = ["title"], O1 = ["innerHTML"], T1 = ["title"], I1 = ["innerHTML"], R1 = {
  class: "message-faces",
  "data-message-faces": ""
}, B1 = ["title", "data-face", "onClick"], L1 = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, N1 = ["title", "data-reaction", "onClick"], D1 = {
  key: 0,
  class: "message-reaction-count"
}, P1 = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, j1 = ["href", "title"], q1 = ["src", "alt"], F1 = ["href"], W1 = {
  key: 2,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, H1 = ["data-sent-worker", "title", "onClick"], U1 = { class: "message-foot" }, z1 = { class: "message-time" }, V1 = {
  class: "message-id",
  "data-message-id": ""
}, G1 = 140, K1 = 2, Y1 = 1500, J1 = "An earlier message", Z1 = "about", X1 = "sent_to", Q1 = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var P;
    const n = e, s = t, a = I(!1), o = I(null), r = N(() => ["user", "comment"].includes(n.message.type)), i = N(() => {
      const [L, J] = (n.message.commented_row || ":").split(":"), V = ut(L);
      return V ? { ref: `${V}:${J}`, label: `${dn(V).title.toLowerCase()} ${J}` } : null;
    }), l = N(() => n.message.worker_id ?? null), u = I(!1), d = N(() => l.value !== null && ((n.message.text ?? "").length > G1 || (n.message.text ?? "").split(`
`).filter((L) => L.trim()).length > K1)), f = N(() => r.value && !n.message.read_at && !n.message.local);
    async function p() {
      var L;
      await ((L = navigator.clipboard) == null ? void 0 : L.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, Y1);
    }
    const v = N(() => Gs(n.message.text ?? "", { env: "" })), M = N(() => JSON.parse(n.message.flowchart_edges || "[]")), x = I(!1), S = N(() => Gs(n.quote || J1, { env: "" }));
    function T() {
      const L = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      L ? L.scrollIntoView({ block: "center", behavior: "smooth" }) : Fe(`messages:${n.message.parent_id}`);
    }
    $1(o, () => `${n.message.text} ${n.quote}`);
    const F = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, Q = (L) => `/api/files/message/${n.message.id}/${encodeURIComponent(L)}`, E = N(() => JSON.parse(n.message.captions || "{}")), b = N(() => (n.message.files ?? []).map((L) => ({ name: L, address: Q(L), isImage: F.test(L), title: E.value[L] || L }))), A = N(() => Gr(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), y = _e(Ae, null), C = I([]), k = I([]);
    async function _() {
      if (!r.value || !(y != null && y.read) || n.message.local) return;
      const L = await y.read(`link list --source message:${n.message.id}`);
      if (!L.ok) return;
      const J = L.value.rows ?? L.value ?? [];
      C.value = J.filter((V) => V.link_type === Z1).map((V) => ({ model: V.target_model, id: V.target_id })), k.value = J.filter((V) => V.link_type === X1).map((V) => V.target_id);
    }
    _(), (P = y == null ? void 0 : y.follow) == null || P.call(y, ["link.*"], _);
    const w = I(!1), m = N(() => S1(n.message.reactions));
    function R(L) {
      w.value = !1, s("react", n.message, L);
    }
    return (L, J) => e.message.peer || e.message.recipient ? (c(), h("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-incoming": e.message.recipient ? null : "",
      "data-ref": `message:${e.message.id}`
    }, [
      D(Xf, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: J[0] || (J[0] = (V) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, _1)) : (c(), h("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-figure-mark": `message:${e.message.id}`,
      "data-figure-agent": r.value ? null : "",
      "data-from": r.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      g("div", A1, [
        g("div", {
          ref_key: "bubble",
          ref: o,
          class: Z(["message-card", "md", { comment: i.value }]),
          onClick: J[6] || (J[6] = (...V) => z(Ot) && z(Ot)(...V))
        }, [
          i.value ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "message-comment-head",
            "data-message-comment": "",
            title: `Open ${i.value.label}`,
            onClick: J[1] || (J[1] = be((V) => z(Fe)(i.value.ref), ["stop"]))
          }, [
            D(ge, {
              name: "bubble",
              size: 12
            }),
            g("span", null, "Comment on " + $(i.value.label), 1)
          ], 8, C1)) : O("", !0),
          e.message.parent_id ? (c(), h("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(T, ["stop"]),
            innerHTML: S.value
          }, null, 8, O1)) : O("", !0),
          l.value !== null ? (c(), h("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${l.value}`,
            onClick: J[2] || (J[2] = be((V) => z(Fe)(`agents:${l.value}`), ["stop"]))
          }, "Worker " + $(l.value), 9, T1)) : O("", !0),
          g("div", {
            class: Z({ "message-folded": d.value && !u.value }),
            "data-message-text": "",
            innerHTML: v.value
          }, null, 10, I1),
          d.value ? (c(), h("button", {
            key: 3,
            type: "button",
            class: "message-more",
            "data-message-more": "",
            onClick: J[3] || (J[3] = be((V) => u.value = !u.value, ["stop"]))
          }, $(u.value ? "Show less" : "Show more"), 1)) : O("", !0),
          M.value.length ? (c(), h(K, { key: 4 }, [
            g("button", {
              type: "button",
              class: "message-flowchart",
              "data-flowchart-open": "",
              onClick: J[4] || (J[4] = (V) => x.value = !0)
            }, "Open the flowchart"),
            x.value ? (c(), G(Lf, {
              key: 0,
              title: e.message.text,
              edges: M.value,
              onClose: J[5] || (J[5] = (V) => x.value = !1)
            }, null, 8, ["title", "edges"])) : O("", !0)
          ], 64)) : O("", !0)
        ], 2),
        g("div", {
          class: Z(["message-tools", { picking: w.value }]),
          "data-message-tools": ""
        }, [
          w.value ? (c(), h(K, { key: 0 }, [
            g("div", R1, [
              (c(!0), h(K, null, te(z(M1), (V) => (c(), h("button", {
                key: V,
                type: "button",
                class: "message-face",
                title: `React ${V}`,
                "data-face": V,
                onClick: (ce) => R(V)
              }, $(V), 9, B1))), 128))
            ]),
            g("button", {
              type: "button",
              class: "message-tool",
              "data-message-action": "cancel-react",
              title: "Cancel",
              onClick: J[7] || (J[7] = (V) => w.value = !1)
            }, [
              D(ge, {
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
              onClick: J[8] || (J[8] = (V) => w.value = !0)
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
              onClick: p
            }, $(a.value ? "Copied" : "Copy"), 1),
            f.value ? (c(), h("button", {
              key: 0,
              type: "button",
              class: "message-tool",
              "data-message-action": "delete",
              title: "Only while it is unread",
              onClick: J[10] || (J[10] = (V) => s("delete", e.message))
            }, "Delete")) : O("", !0)
          ], 64))
        ], 2)
      ]),
      m.value.length ? (c(), h("div", L1, [
        (c(!0), h(K, null, te(m.value, (V) => (c(), h("button", {
          key: V.emoji,
          type: "button",
          class: Z(["message-reaction", { mine: V.mine }]),
          title: V.title,
          "data-reaction": V.emoji,
          onClick: (ce) => s("react", e.message, V.emoji)
        }, [
          oe($(V.emoji) + " ", 1),
          V.count > 1 ? (c(), h("span", D1, $(V.count), 1)) : O("", !0)
        ], 10, N1))), 128))
      ])) : O("", !0),
      b.value.length ? (c(), h("div", P1, [
        (c(!0), h(K, null, te(b.value, (V) => (c(), h(K, {
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
            }, null, 8, q1)
          ], 8, j1)) : (c(), h("a", {
            key: 1,
            href: V.address,
            target: "_blank",
            class: "message-file"
          }, $(V.name), 9, F1))
        ], 64))), 128))
      ])) : O("", !0),
      k.value.length ? (c(), h("div", W1, [
        D(ge, {
          name: "send",
          size: 12
        }),
        (c(!0), h(K, null, te(k.value, (V) => (c(), h("button", {
          key: V,
          type: "button",
          class: "message-sent-worker",
          "data-sent-worker": V,
          title: `Open worker ${V}`,
          onClick: be((ce) => z(Fe)(`agents:${V}`), ["stop"])
        }, "Also sent to worker " + $(V), 9, H1))), 128))
      ])) : O("", !0),
      g("div", U1, [
        g("time", z1, $(A.value), 1),
        Number.isInteger(e.message.id) ? (c(), h(K, { key: 0 }, [
          J[11] || (J[11] = g("span", {
            class: "message-dot",
            "aria-hidden": "true"
          }, "•", -1)),
          g("span", V1, "message " + $(e.message.id), 1)
        ], 64)) : O("", !0),
        r.value ? (c(), G(m1, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : O("", !0)
      ]),
      C.value.length ? (c(), G(c1, {
        key: 3,
        links: C.value
      }, null, 8, ["links"])) : O("", !0)
    ], 8, E1));
  }
}, Tb = /* @__PURE__ */ Y(Q1, [["__scopeId", "data-v-f1ee602a"]]), em = /* @__PURE__ */ Object.assign({ name: "SkeletonParts" }, {
  __name: "SkeletonParts",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    const t = { small: 9, medium: 11, large: 15 }, n = { small: 16, medium: 24, large: 40 }, s = (o) => ({ gap: `${o.spacing}px`, padding: o.padding || void 0 }), a = (o) => ({ ...s(o), gridTemplateColumns: `repeat(auto-fill, minmax(min(${o.width}, 100%), 1fr))` });
    return (o, r) => {
      const i = el("SkeletonParts", !0);
      return c(!0), h(K, null, te(e.parts, (l, u) => (c(), h(K, { key: u }, [
        (c(!0), h(K, null, te(l.count, (d) => (c(), G(cn, {
          key: d,
          value: l.shape
        }, {
          line: W(() => [
            g("span", {
              class: "shimmer shimmer-line",
              "data-skeleton-line": "",
              style: fe({ width: l.width, height: `${t[l.size]}px` })
            }, null, 4)
          ]),
          circle: W(() => [
            g("span", {
              class: "shimmer shimmer-circle",
              "data-skeleton-circle": "",
              style: fe({ width: `${n[l.size]}px`, height: `${n[l.size]}px` })
            }, null, 4)
          ]),
          block: W(() => [
            g("span", {
              class: "shimmer shimmer-block",
              "data-skeleton-block": "",
              style: fe({ width: l.width, height: `${l.height}px` })
            }, null, 4)
          ]),
          grow: W(() => [...r[0] || (r[0] = [
            g("span", { class: "skeleton-grow" }, null, -1)
          ])]),
          row: W(() => [
            g("div", {
              class: "skeleton-row",
              style: fe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          stack: W(() => [
            g("div", {
              class: "skeleton-stack",
              style: fe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          card: W(() => [
            g("div", {
              class: "skeleton-stack skeleton-card",
              "data-skeleton-card": "",
              style: fe(s(l))
            }, [
              D(i, {
                parts: l.parts
              }, null, 8, ["parts"])
            ], 4)
          ]),
          grid: W(() => [
            g("div", {
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
}), tm = /* @__PURE__ */ Y(em, [["__scopeId", "data-v-576c95e1"]]), nm = {
  class: "window-skeleton",
  "aria-busy": "true",
  "aria-label": "Loading",
  "data-window-skeleton": ""
}, sm = {
  __name: "WindowSkeleton",
  props: { parts: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (c(), h("div", nm, [
      D(tm, { parts: e.parts }, null, 8, ["parts"])
    ]));
  }
}, Kr = /* @__PURE__ */ Y(sm, [["__scopeId", "data-v-52f66b64"]]), qn = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], gs = 200, Yr = (e) => {
  var t;
  return ((t = qn.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? qn[0].key;
}, Ib = (e) => {
  var t;
  return ((t = qn.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, am = ["aria-label"], om = 300, ho = 400, rm = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: gs } },
  setup(e) {
    const t = e, n = N(() => Yr(t.value)), s = N(() => n.value < gs ? [1, 0.25, 0.25] : n.value === gs ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (c(), h("svg", {
      class: Z(["ico", "prio", { hot: n.value >= ho, high: n.value >= om && n.value < ho }]),
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
        style: fe({ opacity: s.value[0] })
      }, null, 4),
      g("path", {
        d: "M4.5 9.25L8 7l3.5 2.25",
        style: fe({ opacity: s.value[1] })
      }, null, 4),
      g("path", {
        d: "M4.5 5.5L8 3.25l3.5 2.25",
        style: fe({ opacity: s.value[2] })
      }, null, 4)
    ], 10, am));
  }
}, Rb = /* @__PURE__ */ Y(rm, [["__scopeId", "data-v-b10e610f"]]), im = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "waiting", silent: "waiting", stopped: "stopped" }, fo = (e) => im[e.card.state] || "idle", lm = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), mo = { working: 0, waiting: 1, idle: 2, stopped: 3 }, po = (e, t) => mo[fo(e)] - mo[fo(t)], go = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, Bb = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => po(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || lm(s, a)) : [...e].sort((s, a) => po(s, a) || (go[t] || go.state)(s, a)), cm = ["aria-checked", "aria-haspopup", "onClick"], um = {
  key: 0,
  class: "segmented-dot"
}, dm = {
  key: 1,
  class: "segmented-count"
}, hm = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = Go();
    return (a, o) => {
      const r = tl("tip");
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
          i.dot ? (c(), h("span", um)) : O("", !0),
          oe(" " + $(i.label) + " ", 1),
          i.count !== void 0 ? (c(), h("em", dm, $(i.count), 1)) : O("", !0)
        ], 10, cm)), [
          [r, i.tip || i.title, `${z(s)}-${i.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Jr = /* @__PURE__ */ Y(hm, [["__scopeId", "data-v-ca953072"]]), fm = { class: "form-field" }, mm = { class: "form-field-head" }, pm = ["for"], gm = {
  key: 0,
  class: "form-field-aside"
}, vm = {
  key: 0,
  class: "form-field-help"
}, ym = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", fm, [
      g("div", mm, [
        g("label", {
          class: "form-field-label",
          for: t.$props.for
        }, $(e.label), 9, pm),
        t.$slots.aside ? (c(), h("span", gm, [
          he(t.$slots, "aside", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      he(t.$slots, "default", {}, void 0, !0),
      e.help ? (c(), h("p", vm, $(e.help), 1)) : O("", !0)
    ]));
  }
}, Lb = /* @__PURE__ */ Y(ym, [["__scopeId", "data-v-dd7cdcff"]]), km = { class: "list-row" }, wm = {
  key: 0,
  class: "list-row-kind"
}, bm = { class: "list-row-main" }, xm = {
  key: 0,
  class: "list-row-title"
}, $m = { class: "list-row-body" }, Mm = {
  key: 1,
  class: "list-row-end"
}, Sm = {
  key: 1,
  class: "list-row-text"
}, _m = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (c(), h("div", km, [
      e.kind ? (c(), h("span", wm, $(e.kind), 1)) : O("", !0),
      g("div", bm, [
        e.title ? (c(), h("span", xm, $(e.title), 1)) : O("", !0),
        g("div", $m, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (c(), h("div", Mm, [
          he(t.$slots, "end", {}, void 0, !0)
        ])) : O("", !0)
      ]),
      e.text ? (c(), h("span", Sm, $(e.text), 1)) : O("", !0)
    ]));
  }
}, Nb = /* @__PURE__ */ Y(_m, [["__scopeId", "data-v-63155fba"]]), Em = {
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
}, Am = { claude: "Claude Code", codex: "Codex" }, Cm = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Om = {
  key: 1,
  class: "menu-item-text"
}, Tm = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (c(), h("button", {
      type: "button",
      class: Z(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (c(), h("span", Cm, $(e.checked ? "✓" : ""), 1)) : O("", !0),
      e.description ? (c(), h("span", Om, [
        g("span", null, [
          he(t.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, $(e.description), 1)
      ])) : he(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Bt = /* @__PURE__ */ Y(Tm, [["__scopeId", "data-v-fec99974"]]), Im = (e, t, n) => Math.max(t, Math.min(n, e)), Rm = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, Ct = 8, Bm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = I(null), o = (m) => m ? `${m}px` : void 0, r = N(() => ({
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
      const R = m.closest(".pane, .float-window");
      return R ? d(R.getBoundingClientRect()) : u();
    }, p = (m, R) => `${Math.max(0, m ? Math.min(m, R) : R)}px`;
    function v(m, R) {
      return {
        below: m.bottom - R.bottom - s.gap - Ct,
        above: R.top - m.top - s.gap - Ct,
        across: m.right - m.left - 2 * Ct
      };
    }
    function M(m) {
      const R = f(s.anchor), P = v(R, m);
      return i.value.w <= P.across && i.value.h <= Math.max(P.below, P.above) ? R : u();
    }
    const x = N(() => {
      if (!l.value) return r.value;
      const m = l.value, R = M(m), P = v(R, m), { w: L, h: J } = i.value, V = s.align === "auto" ? m.left + m.right > R.left + R.right : s.align === "right", ce = Im(V ? m.right - L : m.left, R.left + Ct, Math.max(R.left + Ct, R.right - L - Ct)), ke = J > P.below && P.above > P.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: p(s.maxHeight, P.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: p(s.maxHeight, P.below) };
      return { ...r.value, ...ke, left: `${ce}px`, maxWidth: p(s.maxWidth, P.across) };
    }), S = n, T = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function F(m) {
      const R = T(), P = R.indexOf(document.activeElement);
      R[(P + m + R.length) % R.length].focus();
    }
    const Q = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => S("close") }, E = (m) => Q[m.key] && (m.preventDefault(), Q[m.key]()), b = () => a.value && (i.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let A = 0;
    const y = new ResizeObserver(() => {
      cancelAnimationFrame(A), A = requestAnimationFrame(b);
    });
    Vr(a, (m) => s.anchor && !s.anchor.contains(m.target) && S("close"));
    const C = (m, R) => ["top", "left", "right", "bottom"].some((P) => Math.abs(m[P] - R[P]) > 1), k = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let _ = 0;
    function w() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || k(m)) return S("close");
        C(m, l.value) && (l.value = m);
      }
      _ = requestAnimationFrame(w);
    }
    return Le(() => {
      s.anchor && a.value && Qf(a.value, s.anchor), b(), a.value && y.observe(a.value), !s.plain && T()[0] && T()[0].focus(), w();
    }), Te(() => {
      y.disconnect(), cancelAnimationFrame(_), cancelAnimationFrame(A);
    }), t({ element: a }), (m, R) => (c(), G(fa, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", tt({
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
}), Sa = /* @__PURE__ */ Y(Bm, [["__scopeId", "data-v-3d203970"]]), Lm = ["aria-expanded"], Nm = { class: "drop-label" }, Dm = ["value"], Pm = {
  key: 1,
  class: "drop-lead"
}, jm = { class: "drop-item-text" }, qm = {
  key: 2,
  class: "drop-note"
}, Fm = {
  key: 1,
  class: "drop-none"
}, Wm = {
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
    const n = e, s = t, a = I(!1), o = I(null), r = I(""), i = N(() => {
      const u = r.value.trim().toLowerCase();
      return u ? n.items.filter((d) => `${d.label} ${d.note || ""}`.toLowerCase().includes(u)) : n.items;
    });
    function l(u) {
      a.value = !1, s("pick", u);
    }
    return (u, d) => (c(), h("div", {
      class: Z(["drop", { wide: e.wide, bare: e.bare }])
    }, [
      g("button", {
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
        g("span", Nm, $(e.label), 1),
        D(ge, {
          name: "down",
          size: 11
        })
      ], 10, Lm),
      a.value ? (c(), G(Sa, {
        key: 0,
        anchor: o.value,
        "min-width": e.menuWidth,
        "max-height": 320,
        onClose: d[2] || (d[2] = (f) => a.value = !1)
      }, {
        default: W(() => [
          e.searchable ? (c(), h("input", {
            key: 0,
            class: "drop-search",
            type: "search",
            value: r.value,
            placeholder: "Search",
            "aria-label": "Search the list",
            autofocus: "",
            onInput: d[1] || (d[1] = (f) => r.value = f.target.value)
          }, null, 40, Dm)) : O("", !0),
          (c(!0), h(K, null, te(i.value, (f) => (c(), G(Bt, {
            key: f.key,
            on: f.key === e.picked,
            "data-drop-item": f.key,
            onClick: (p) => l(f)
          }, {
            default: W(() => [
              f.running !== void 0 ? (c(), h("span", {
                key: 0,
                class: Z(["drop-dot", { live: f.running }])
              }, null, 2)) : O("", !0),
              f.lead ? (c(), h("span", Pm, $(f.lead), 1)) : O("", !0),
              g("span", jm, $(f.label), 1),
              f.note ? (c(), h("span", qm, $(f.note), 1)) : O("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          i.value.length ? O("", !0) : (c(), h("p", Fm, $(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : O("", !0)
    ], 2));
  }
}, Hm = /* @__PURE__ */ Y(Wm, [["__scopeId", "data-v-29dfcce5"]]), Db = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = N(() => [
      ...Em[n.provider],
      ...n.inherits ? [{ key: "", label: "chosen at start", note: "the agent picks a model each time it starts this one" }] : []
    ]), o = N(() => (a.value.find((r) => r.key === n.value) || { label: n.value || "chosen at start" }).label);
    return (r, i) => (c(), G(Hm, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${z(Am)[e.provider]} model`,
      onPick: i[0] || (i[0] = (l) => s("pick", l.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, Um = ["aria-label"], zm = { class: "head" }, Vm = { class: "names" }, Gm = { class: "body" }, Km = {
  key: 0,
  class: "foot"
}, Ym = {
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
    const n = e, s = t, { visible: a, close: o, closed: r } = Pr(s, n), i = jr(a);
    return (l, u) => (c(), G(fa, { to: "body" }, [
      D(Nt, {
        name: "side",
        appear: "",
        onAfterLeave: z(r)
      }, {
        default: W(() => [
          z(a) ? (c(), h("div", {
            key: 0,
            class: Z(["veil", { over: e.over, under: e.depth }]),
            style: fe({ "--depth": e.depth, zIndex: z(i) }),
            "data-side-panel": "",
            onClick: u[0] || (u[0] = be((...d) => z(o) && z(o)(...d), ["self"]))
          }, [
            g("aside", {
              class: Z(["panel", e.width]),
              role: "dialog",
              "aria-label": e.title
            }, [
              e.title ? (c(), h(K, { key: 0 }, [
                g("header", zm, [
                  g("div", Vm, [
                    g("h2", null, $(e.title), 1),
                    e.abstract ? (c(), G(lt, {
                      key: 0,
                      class: "abstract",
                      text: e.abstract
                    }, null, 8, ["text"])) : O("", !0)
                  ]),
                  he(l.$slots, "actions", {}, void 0, !0),
                  D(Zn, {
                    title: e.closeLabel,
                    onClick: z(o)
                  }, null, 8, ["title", "onClick"])
                ]),
                g("div", Gm, [
                  he(l.$slots, "default", {}, void 0, !0)
                ]),
                l.$slots.foot ? (c(), h("footer", Km, [
                  he(l.$slots, "foot", {}, void 0, !0)
                ])) : O("", !0)
              ], 64)) : he(l.$slots, "default", {}, void 0, !0, 1)
            ], 10, Um)
          ], 6)) : O("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Pb = /* @__PURE__ */ Y(Ym, [["__scopeId", "data-v-c9a3f43a"]]), Zs = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Jm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = Vn(), n = N(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => ht((c(), h("textarea", tt({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [z(Zs), z(t).value]
    ]);
  }
}), jb = /* @__PURE__ */ Y(Jm, [["__scopeId", "data-v-e130a5b9"]]), Zm = {
  key: 1,
  class: "text-field-label"
}, Xm = {
  key: 2,
  class: "text-field-end"
}, Qm = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Ds({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var d;
    const n = Ns(e, "modelValue"), s = Vn(), a = "onUpdate:modelValue" in (((d = nl()) == null ? void 0 : d.vnode.props) || {}), o = N(() => a ? n.value : s.value), r = (f) => a && (n.value = f.target.value), i = N(
      () => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "class" && f !== "style" && f !== "value"))
    ), l = N(() => Object.fromEntries(Object.entries(s).filter(([f]) => f !== "value"))), u = I(null);
    return t({ focus: () => u.value && u.value.focus() }), (f, p) => e.label || e.icon || f.$slots.end ? (c(), h("label", {
      key: 0,
      class: Z(["text-field", { large: e.large, ended: f.$slots.end }, z(s).class]),
      style: fe(z(s).style)
    }, [
      e.icon ? (c(), G(ge, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : O("", !0),
      e.label ? (c(), h("span", Zm, $(e.label), 1)) : O("", !0),
      ht(g("input", tt({
        ref_key: "input",
        ref: u,
        class: "text-field-input",
        spellcheck: "false"
      }, i.value, { onInput: r }), null, 16), [
        [z(Zs), o.value]
      ]),
      f.$slots.end ? (c(), h("span", Xm, [
        he(f.$slots, "end", {}, void 0, !0)
      ])) : O("", !0)
    ], 6)) : ht((c(), h("input", tt({
      key: 1,
      ref_key: "input",
      ref: u,
      class: "text-input",
      spellcheck: "false"
    }, l.value, { onInput: r }), null, 16)), [
      [z(Zs), o.value]
    ]);
  }
}), qb = /* @__PURE__ */ Y(Qm, [["__scopeId", "data-v-d9c38ca8"]]), ep = 150;
function Zr(e, t, n = ep, s = performance.now()) {
  const a = e + n - s;
  if (a <= 0) return void t();
  setTimeout(t, a);
}
const vo = (e) => e.page * e.size < e.total;
function Fb(e) {
  const t = jt().sources.find((n) => n.key === e);
  return t ? Xs(t.read, t.events) : Xs("", []);
}
function Xs(e, t, { incremental: n = !1 } = {}) {
  const s = jt(), a = I([]), o = I(null), r = I(""), i = I(!1), l = performance.now(), u = I(!1), d = I(""), f = I(null);
  async function p(E) {
    const b = x, A = await s.read(`${e} --before-id ${E + 1} --limit 1`);
    if (b !== x) return;
    if (!A.ok) return T();
    const y = A.value.rows.find((C) => C.id === E);
    a.value = y ? a.value.map((C) => C.id === E ? y : C) : a.value.filter((C) => C.id !== E);
  }
  async function v(E) {
    if (n && String((E == null ? void 0 : E.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((_) => _.id !== E.row_id));
    if (n && (E != null && E.row_id) && !String(E.event ?? "").endsWith(".create") && a.value.some((_) => _.id === E.row_id)) return p(E.row_id);
    if (!(n && a.value.length && String((E == null ? void 0 : E.event) ?? "").endsWith(".create"))) return T();
    const A = Math.max(...a.value.map((_) => _.id)), y = x, C = await s.read(`${e} --after-id ${A}`);
    if (y !== x) return;
    if (!C.ok) return T();
    const k = new Set(a.value.map((_) => _.id));
    a.value = [...C.value.rows.filter((_) => !k.has(_.id)), ...a.value];
  }
  async function M() {
    if (!a.value.length) return !1;
    const E = x, b = Math.min(...a.value.map((C) => C.id)), A = await s.read(`${e} --before-id ${b}`);
    if (E !== x) return !1;
    if (!A.ok || !A.value.rows.length) return u.value = !1;
    u.value = vo(A.value);
    const y = new Set(a.value.map((C) => C.id));
    return a.value = [...a.value, ...A.value.rows.filter((C) => !y.has(C.id))], !0;
  }
  let x = 0;
  async function S(E) {
    const b = ++x, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (b !== x) return;
    const y = A.ok ? s.shared ? [A.value] : A.value.rows : [];
    a.value = E(y), o.value = A.ok ? A.value : null;
    const C = y.length ? Math.min(...y.map((k) => k.id)) : 0;
    A.ok && !a.value.some((k) => k.id < C) && (u.value = !s.shared && vo(A.value)), r.value = A.ok ? "" : A.error, Zr(l, () => i.value = !0);
  }
  function T() {
    return S((E) => {
      if (!n || !E.length) return E;
      const b = Math.min(...E.map((y) => y.id)), A = Math.max(...E.map((y) => y.id));
      return [...a.value.filter((y) => y.id > A), ...E, ...a.value.filter((y) => y.id < b)];
    });
  }
  const F = () => S((E) => E);
  async function Q(E, b = null) {
    const A = a.value;
    b && (a.value = b(A));
    const y = await s.run(E);
    return b && !y.ok && (a.value = A), d.value = y.ok ? "" : y.error, f.value = y.ok ? y.value : null, await T(), y;
  }
  return e && (s.follow(t, v), T()), { rows: a, listing: o, failure: r, loaded: i, more: u, load: T, loadLatest: F, older: M, act: Q, actionFailure: d, answer: f, context: s };
}
const tp = { class: "title" }, np = { class: "state" }, sp = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = Xs(t.line, t.events);
    return (o, r) => (c(), G(sc, {
      rows: z(n),
      failure: z(s),
      loaded: z(a),
      empty: e.empty
    }, {
      default: W(({ row: i }) => [
        g("span", tp, $(i.title), 1),
        g("span", np, $(i.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Wb = /* @__PURE__ */ Y(sp, [["__scopeId", "data-v-a69084cd"]]);
function ap(e = 1e3, t = null) {
  const n = I(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? pe(t, a, { immediate: !0 }) : a(!0), Te(() => clearInterval(s)), n;
}
const vs = I(Date.now() / 1e3);
let yo = 0, Sn = 0;
function op() {
  return Sn || (vs.value = Date.now() / 1e3, yo = setInterval(() => vs.value = Date.now() / 1e3, 1e3)), Sn += 1, Ko() && Yo(() => {
    Sn -= 1, Sn || clearInterval(yo);
  }), vs;
}
const rp = 200, ip = Wr + In + Hr + rp;
function zt(e) {
  if (!e) return null;
  const { x: t, y: n, width: s, height: a } = e.getBoundingClientRect();
  return { x: t, y: n, width: s, height: a, opacity: getComputedStyle(e).opacity };
}
function lp(e, t, n) {
  var s, a;
  return {
    ms: performance.now() - t,
    phase: n,
    classes: e.className,
    style: e.getAttribute("style") ?? "",
    mark: zt(e),
    top: zt(e.querySelector(".top")),
    title: zt(e.querySelector(".title")),
    contents: zt(e.querySelector(":scope > :not(.top)")),
    scroll: ((s = e.closest(".history")) == null ? void 0 : s.scrollTop) ?? 0,
    running: document.getAnimations().map((o) => {
      var r, i, l, u;
      return `${((i = (r = o.effect) == null ? void 0 : r.target) == null ? void 0 : i.className) || ((u = (l = o.effect) == null ? void 0 : l.target) == null ? void 0 : u.tagName)} ${o.transitionProperty ?? o.animationName}`;
    }),
    computed: (({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: u, display: d }) => ({ width: o, minWidth: r, maxWidth: i, boxSizing: l, transform: u, display: d }))(getComputedStyle(e)),
    parent: zt(e.parentElement),
    parentClasses: ((a = e.parentElement) == null ? void 0 : a.className) ?? ""
  };
}
function cp(e, t, n, s) {
  pe(t, (a) => {
    var u;
    const o = e.value;
    if (!o || !(s != null && s.run) || !((u = s.markMotion) != null && u.value)) return;
    const r = performance.now(), i = [];
    function l() {
      if (s.markMotion.value) {
        if (i.push(lp(o, r, n.value)), performance.now() - r < ip) return void requestAnimationFrame(l);
        s.run(["developer", "record-mark-motion", JSON.stringify({ key: o.dataset.markKey ?? "", folds: a, at: (/* @__PURE__ */ new Date()).toISOString(), frames: i })]);
      }
    }
    l();
  }, { flush: "sync" });
}
const up = ["title", "data-figure-mark", "data-folded", "data-open"], dp = {
  key: 2,
  class: "worker"
}, hp = { class: "head" }, fp = { key: 0 }, mp = {
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
}, kp = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, wp = {
  key: 6,
  class: "settled"
}, bp = {
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
    const t = e, n = Vn(), s = ["onClick", "onAct"], a = N(() => Object.fromEntries(Object.entries(n).filter(([le]) => !s.includes(le)))), o = I(!1), r = N(() => !!(t.mark.detail || t.mark.command || t.mark.body)), i = N(() => t.open !== void 0), l = N(() => i.value || r.value), u = N(() => i.value ? t.open : o.value), d = N(() => i.value ? !t.open : r.value && !o.value), f = N(() => !!(t.mark.action && n.onAct)), p = N(() => l.value || f.value || !!n.onClick), v = I(null), M = I(null), { folded: x, phase: S } = Ur(v, () => d.value);
    cp(v, d, S, _e(Ae, null));
    function T(le) {
      var ke, Re;
      if (!(le.target !== v.value && !M.value.contains(le.target))) {
        if (i.value) return (ke = n.onClick) == null ? void 0 : ke.call(n, le);
        if (r.value) return void (o.value = !o.value);
        (Re = n.onAct || n.onClick) == null || Re(le);
      }
    }
    const F = (le) => n.onAct(le), Q = ["failed", "unfinished"], E = N(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? Q.includes(t.mark.state) ? "danger" : "good" : ""), b = N(() => t.mark.color ? t.mark.color : E.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : E.value ? `var(--tone-${E.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), A = N(() => b.value || "var(--tone-work)"), y = N(() => !t.mark.ending && !t.mark.ended && E.value !== "stopped"), C = op(), k = N(
      () => t.mark.began_at && y.value && !t.mark.figure && !t.mark.counting ? y1(C.value - t.mark.began_at) : ""
    ), _ = N(() => {
      const { started: le, ended: ke } = t.mark;
      return le ? ke ? `ran ${uo(ke - le, !0)}` : uo(C.value - le, !0) : k.value;
    }), w = ["bad", "danger", "warn"], m = N(() => w.includes(E.value) || t.mark.asks ? "attention" : y.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), R = ["bad", "danger"], P = N(() => R.includes(E.value)), L = N(() => m.value === "process" ? "running" : P.value ? "cross" : E.value === "stopped" ? "stopped" : E.value === "good" ? "tick" : ""), J = N(
      () => !!(t.mark.figure || _.value || t.mark.docked || t.mark.stopping || L.value || t.mark.settled || t.mark.news)
    ), V = N(() => [t.mark.title, t.mark.time ? Gr(t.mark.time) : ""].filter(Boolean).join(" · ")), ce = N(() => ({
      ...b.value ? { "--mark": b.value } : {},
      ...t.mark.depth ? { "--depth": t.mark.depth } : {}
    }));
    return (le, ke) => (c(), h("div", tt(a.value, {
      ref_key: "root",
      ref: v,
      class: [
        "mark",
        `w-${m.value}`,
        z(S),
        {
          open: u.value,
          folding: i.value && d.value,
          live: p.value,
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
      title: V.value,
      "data-figure-mark": e.mark.key,
      "data-folded": z(x) ? "" : null,
      "data-open": i.value && e.open ? "" : null,
      onClick: T
    }), [
      (c(), G($t(p.value ? "button" : "span"), {
        ref_key: "top",
        ref: M,
        class: "top",
        type: p.value ? "button" : void 0,
        "aria-expanded": l.value ? String(!!u.value) : void 0
      }, {
        default: W(() => [
          e.mark.markIcon ? (c(), G(nt, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (c(), G(ge, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (c(), h("span", dp, $(e.mark.worker), 1)) : O("", !0),
          g("span", hp, [
            D(lt, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (c(), h("strong", fp, $(e.mark.name), 1)) : O("", !0),
            l.value ? (c(), G(Rt, {
              key: 1,
              open: !!u.value
            }, null, 8, ["open"])) : O("", !0)
          ]),
          J.value ? (c(), h("span", mp, [
            e.mark.figure ? (c(), h("span", pp, $(e.mark.figure), 1)) : O("", !0),
            _.value ? (c(), h("span", gp, $(_.value), 1)) : O("", !0),
            e.mark.stopping ? (c(), h("span", vp, "Stopping")) : O("", !0),
            e.mark.news ? (c(), h("span", yp, $(e.mark.news), 1)) : O("", !0),
            L.value === "running" ? (c(), h("span", kp)) : L.value ? (c(), G(nt, {
              key: 5,
              class: Z(["sign", L.value]),
              name: L.value
            }, null, 8, ["class", "name"])) : O("", !0),
            e.mark.settled ? (c(), h("span", wp, $(e.mark.settled), 1)) : O("", !0)
          ])) : O("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      f.value ? (c(), G(Fr, {
        key: 0,
        label: e.mark.action,
        open: !!u.value,
        onClick: be(F, ["stop"])
      }, null, 8, ["label", "open"])) : O("", !0),
      (e.mark.figure || e.mark.counting) && y.value ? (c(), h("span", bp, [
        g("span", {
          class: "progress",
          style: fe({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: A.value })
        }, null, 4)
      ])) : O("", !0),
      e.mark.detail && !z(x) ? (c(), G(lt, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      e.mark.body && !z(x) ? (c(), h("div", xp, [
        e.mark.bodyLabel ? (c(), h("p", $p, $(e.mark.bodyLabel), 1)) : O("", !0),
        D(lt, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : O("", !0),
      e.mark.command && !z(x) ? (c(), h("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, $(e.mark.command), 9, Mp)) : O("", !0),
      e.mark.card ? (c(), G(lt, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : O("", !0),
      he(le.$slots, "default", {
        shown: !z(x)
      }, void 0, !0)
    ], 16, up));
  }
}), Xr = /* @__PURE__ */ Y(Sp, [["__scopeId", "data-v-b4038573"]]), _p = 60;
function Ep(e, t) {
  const n = I([]), s = I(0);
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
    if (r || s.value <= 0 || d.scrollTop > _p) return;
    r = !0;
    const f = d.scrollHeight, p = await e(["output", "page", String(t()), "--before", String(s.value)]);
    r = !1, p.ok && (n.value = [...p.value.lines, ...n.value], s.value = p.value.first_byte, await mt(), d.scrollTop += d.scrollHeight - f);
  }
  return { lines: n, newest: i, follow: l, loadEarlier: u };
}
const Ap = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function Qr(e) {
  var n;
  const t = Ap[e] || ((n = dn(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const Cp = (e) => Qr(String(e).split(":")[0]), ei = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), Op = { passed: "good", failed: "danger", warned: "warn", running: "" }, Tp = { good: "good", warn: "warn", danger: "danger" }, ko = {
  "open row": (e) => Fe(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Kl(e.target_model, e.target_id || 0)
}, Ip = { "open row": (e) => Cp(e.target_model), "open page": () => Qr("pages") };
function Rp(e, t) {
  const n = t || {}, s = ko[n.click] && e.target_model ? n.click : "";
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
    action: s ? Ip[s](e) : "",
    handlers: s ? { onAct: () => ko[s](e) } : {}
  };
}
const Bp = 24, Lp = 1e3, wo = 2e3, Np = 0.25, Dp = 5e3;
function Pp(e, t = Bp, n = () => !0) {
  const s = I(!1), a = I(0), o = I(!1);
  let r = 0, i = 0, l = 0;
  const u = () => e && "value" in e ? e.value : e, d = () => {
    const E = u();
    return E ? E.scrollHeight - E.scrollTop - E.clientHeight : 0;
  }, f = () => !u() || d() <= t;
  function p(E) {
    if (clearTimeout(r), !E) {
      o.value = !1, l = Date.now();
      return;
    }
    const b = Date.now() - l < wo ? wo : Lp;
    r = setTimeout(() => o.value = s.value, b);
  }
  function v() {
    clearTimeout(i), s.value = !1, a.value = 0, p(!1);
  }
  function M(E = !1) {
    const b = u();
    b && E && b.scrollTo ? b.scrollTo({ top: b.scrollHeight, behavior: "smooth" }) : b && (b.scrollTop = b.scrollHeight), v();
  }
  function x() {
    T(), !s.value && (s.value = !0, p(!0));
  }
  const S = () => !!u() && d() <= u().clientHeight * Np;
  function T() {
    clearTimeout(i), S() && (i = setTimeout(() => s.value && S() && n() && M(!0), Dp));
  }
  function F() {
    f() ? v() : x();
  }
  function Q(E = 1, b = !1) {
    s.value ? a.value += Math.max(0, E) : M(b);
  }
  return Ko() && Yo(() => [r, i].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: d, atBottom: f, follow: v, toBottom: M, left: x, scrolled: F, arrived: Q };
}
const jp = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, qp = (e) => String(e ?? "").replace(jp, ""), Fp = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "No output yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = I(null), { away: o, scrolled: r, arrived: i, toBottom: l } = Pp(a);
    pe(
      () => n.lines.length,
      () => mt(() => i()),
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
      oe($(z(qp)(e.lines.join(`
`)) || e.empty), 1),
      z(o) ? (c(), h("button", {
        key: 0,
        type: "button",
        class: "output-follow",
        title: "Follow the output: keep its newest line in view as lines arrive",
        onClick: f[0] || (f[0] = (p) => z(l)(!0))
      }, "Follow")) : O("", !0)
    ], 544));
  }
}, Wp = /* @__PURE__ */ Y(Fp, [["__scopeId", "data-v-c2fb1783"]]), Hp = 1e4;
class Up {
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
    return this.heardAt !== null && t - this.heardAt > Hp;
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
const zp = {
  key: 0,
  class: "frame-note"
}, Vp = {
  key: 0,
  class: "frame-note"
}, Gp = ["src", "title"], Kp = 1e3, Yp = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = jt(), s = I(null), a = I(!1), o = I(!1);
    let r = null, i = 0;
    return Le(() => {
      r = new Up(s.value, n), r.start(), i = setInterval(() => {
        a.value = r.silent();
      }, Kp);
    }), Te(() => {
      r == null || r.stop(), clearInterval(i);
    }), (l, u) => o.value ? (c(), h("p", zp, "This window was closed because it stopped answering.")) : (c(), h(K, { key: 1 }, [
      a.value ? (c(), h("div", Vp, [
        u[2] || (u[2] = g("p", null, "This window has not answered for ten seconds.", -1)),
        D(ye, {
          onClick: u[0] || (u[0] = (d) => o.value = !0)
        }, {
          default: W(() => [...u[1] || (u[1] = [
            oe("Close the window", -1)
          ])]),
          _: 1
        })
      ])) : O("", !0),
      g("iframe", {
        ref_key: "frame",
        ref: s,
        class: "frame-window",
        sandbox: "allow-scripts",
        src: t.src,
        title: z(n).window
      }, null, 8, Gp)
    ], 64));
  }
}, Jp = /* @__PURE__ */ Y(Yp, [["__scopeId", "data-v-32a49046"]]), Zp = 0, Xp = "/api/lines", Qp = "/api/line";
class eg {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), Zp));
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
        const n = await je.raw(Xp, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await je.raw(Qp, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const tg = new eg();
class ng {
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
      n.patterns.some((s) => ti(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function ti(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const sg = Symbol("pane-page"), ag = { 1: "refused", 2: "usage", 3: "fault" }, og = 100, rg = 50, ig = /"([^"]*)"|'([^']*)'|(\S+)/g;
function lg({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: r, open: i, options: l = I({}), declared: u = [], page: d = null, setOption: f = () => {
}, autoScroll: p = "", tabs: v = [], sources: M = [], links: x = {}, search: S = {}, readOnly: T = !1, shared: F = null }) {
  const Q = /* @__PURE__ */ new Map(), E = new AbortController(), b = I(!1), A = performance.now();
  let y = 0, C = 0;
  const k = () => {
    clearTimeout(C), C = setTimeout(() => {
      y === 0 && Zr(A, () => b.value = !0);
    }, rg);
  }, _ = (w) => {
    const m = Q.get(w);
    if (m && performance.now() - m.at < og) return m.answer;
    y += 1;
    const R = si(e, w, t, E.signal).finally(() => {
      y -= 1, k();
    });
    return Q.set(w, { answer: R, at: performance.now() }), R;
  };
  return {
    answered: b,
    settle: k,
    window: e,
    environment: t,
    agent: n,
    page: d,
    visible: N(() => s()),
    permissions: a,
    autoScroll: p,
    tabs: v,
    sources: M,
    links: x,
    search: S,
    readOnly: T,
    shared: F,
    read: _,
    run: (w) => tn(e, w, t, E.signal),
    upload: (w) => ug(w, E.signal),
    cancel: () => E.abort(),
    subscriptions: r,
    follow: (w, m) => r.follow(e, w.filter((R) => o.some((P) => ti(P, R))), m, s),
    open: i,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (w) => N(() => {
      var m;
      return l.value[w] ?? ((m = u.find((R) => R.key === w)) == null ? void 0 : m.default);
    }),
    setting: async (w, m) => {
      const R = await _(`window setting ${e} ${w}`);
      return R.ok ? R.value.value : m;
    },
    setOption: f,
    keep: (w, m) => tn(e, ["window", "save-setting", e, w, JSON.stringify(m)], t, E.signal)
  };
}
function cg(e) {
  try {
    const t = JSON.parse(e);
    return typeof t.refused == "string" ? [t.refused, t.suggestion].filter(Boolean).join(": ") : [t.error, t.message].find((n) => typeof n == "string") ?? e;
  } catch {
    return e;
  }
}
const en = { ok: !1, failure: "cancelled", error: "" }, ni = "The journal did not answer, so this may or may not have gone through. Check before you try again.";
async function tn(e, t, n, s = void 0) {
  try {
    const a = await tg.add({ window: e, line: Array.isArray(t) ? t : dg(t), environment: n }, s);
    return s != null && s.aborted ? en : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: ag[a.code] || "fault", error: cg(a.error) };
  } catch {
    return s != null && s.aborted ? en : { ok: !1, failure: "unreachable", error: ni };
  }
}
async function si(e, t, n, s) {
  const a = await tn(e, t, n, s);
  return a.failure !== "unreachable" || !ma() ? a : (await Gc(), s.aborted ? en : si(e, t, n, s));
}
async function ug(e, t = void 0) {
  try {
    const n = await je.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? en : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch {
    return t != null && t.aborted ? en : { ok: !1, failure: "unreachable", error: ni };
  }
}
function dg(e) {
  return [...e.matchAll(ig)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function hg({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const fg = {
  class: "allowance-prompt",
  role: "dialog"
}, mg = { class: "allowance-prompt-text" }, pg = { class: "allowance-prompt-buttons" }, gg = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), h("div", fg, [
      g("p", mg, $(z(hg)(e.request)), 1),
      g("div", pg, [
        D(ye, {
          kind: "primary",
          onClick: a[0] || (a[0] = (o) => n("answer", !0))
        }, {
          default: W(() => [...a[2] || (a[2] = [
            oe("Allow", -1)
          ])]),
          _: 1
        }),
        D(ye, {
          onClick: a[1] || (a[1] = (o) => n("answer", !1))
        }, {
          default: W(() => [...a[3] || (a[3] = [
            oe("Not now", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, vg = /* @__PURE__ */ Y(gg, [["__scopeId", "data-v-102dc765"]]), ys = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(Dn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: W(() => [
        oe($(e.reason) + " ", 1),
        e.retry ? (c(), G(ye, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: W(() => [...a[2] || (a[2] = [
            oe("Retry", -1)
          ])]),
          _: 1
        })) : O("", !0),
        e.removable ? (c(), G(ye, {
          key: 1,
          onClick: a[1] || (a[1] = (o) => n("remove"))
        }, {
          default: W(() => [...a[3] || (a[3] = [
            oe("Remove tab", -1)
          ])]),
          _: 1
        })) : O("", !0)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, yg = ["data-window", "data-agent"], kg = {
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
    const n = e, s = t, a = I(""), o = I(0);
    function r() {
      a.value = "", o.value++;
    }
    const i = _e(Ol, null), l = lg({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: N(() => n.options),
      declared: n.declared,
      page: _e(sg, null),
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
    sl(Ae, l), pe(() => n.visible, (f) => f && n.subscriptions.shown(n.name)), Le(l.settle), Te(() => {
      l.cancel(), n.subscriptions.stopAll(n.name);
    }), al((f) => (a.value = f instanceof Error ? f.message : String(f), n.subscriptions.stopAll(n.name), !1));
    const u = () => da(n.component), d = () => {
      var f, p;
      return ((p = (f = n.prompts) == null ? void 0 : f.current.value) == null ? void 0 : p.window) === n.name ? n.prompts.current.value : null;
    };
    return (f, p) => (c(), h("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      d() ? (c(), G(vg, {
        key: 0,
        request: d(),
        onAnswer: p[0] || (p[0] = (v) => e.prompts.answer(v))
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
        e.skeleton.length && !z(l).answered.value ? (c(), G(Kr, {
          key: 0,
          class: "window-cover",
          parts: e.skeleton
        }, null, 8, ["parts"])) : O("", !0)
      ], 64)) : (c(), G(ys, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: p[1] || (p[1] = (v) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, yg));
  }
}, ai = /* @__PURE__ */ Y(kg, [["__scopeId", "data-v-c4443e2b"]]), wg = {
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
    const n = e, s = t, a = { render: () => da(Jp, { src: n.entry.entry_url }) };
    return (o, r) => (c(), G(ai, {
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
}, bg = ["data-window"], xg = {
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
    const n = e, s = t, a = Gn(null), o = I("");
    return pe(
      () => n.entry.entry_url,
      async (r) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              r
            )).default, qc();
          } catch (i) {
            if (Pc(i) && jc(i)) return;
            o.value = `This window's file could not be loaded: ${i.message}`;
          }
      },
      { immediate: !0 }
    ), (r, i) => !a.value && !o.value && !e.entry.unavailable_reason ? (c(), h("section", {
      key: 0,
      class: "window window-loading",
      "data-window": e.entry.name
    }, [
      D(Kr, {
        parts: e.entry.skeleton
      }, null, 8, ["parts"])
    ], 8, bg)) : (c(), G(ai, {
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
}, bo = "*.*", $g = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null }, environment: { type: String, default: "" } },
  setup(e) {
    var u;
    const t = e, n = _e(Ae, null), s = new ng(), a = (u = n == null ? void 0 : n.subscriptions) == null ? void 0 : u.follow(`body of ${t.declaration.type}`, [bo], (d) => s.dispatch(d));
    Te(() => a == null ? void 0 : a());
    const o = (n == null ? void 0 : n.environment) ?? t.environment, r = { reads: [], runs: [], missing: [], ask: async () => !0 }, i = N(() => !!(t.declaration.shipped || t.declaration.trusted)), l = N(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      // a body the journal ships or the person trusts hears what it follows; any other hears what its declaration names
      events: i.value ? [bo] : t.declaration.events ?? [],
      options: []
    }));
    return (d, f) => i.value ? (c(), G(xg, {
      key: 0,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (c(), G(wg, {
      key: 1,
      entry: l.value,
      subscriptions: z(s),
      environment: z(o),
      permissions: r,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Mg = { class: "mark-more-inner" }, Sg = {
  class: "mark-lines",
  "data-mark-reason": ""
}, _g = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, Eg = {
  key: 3,
  class: "mark-lines"
}, Ag = "process", xo = "task", Cg = 2e3, Og = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ae), s = N(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = N(() => ei.has(t.mark.variant) && t.mark.detail || ""), o = N(() => t.mark.target_model === xo ? t.mark.target_id : 0), r = Ep((M) => n.run(M), () => t.mark.target_id), i = r.lines, l = I(!1), u = I(""), d = N(() => t.mark.target_model === Ag && !!t.mark.target_id);
    async function f(M = r.follow) {
      const x = await M();
      l.value = !0, u.value = x.ok ? "" : x.error;
    }
    let p = null;
    const v = () => clearInterval(p);
    return pe(() => t.shown && d.value, (M) => {
      v(), M && (f(), t.mark.ended_at || (p = setInterval(f, Cg)));
    }, { immediate: !0 }), pe(() => t.mark.ended_at, (M) => M && t.shown && d.value && (v(), f(r.newest))), Te(v), (M, x) => (c(), h("div", {
      class: Z(["mark-more", { open: e.shown }]),
      onClick: x[1] || (x[1] = be(() => {
      }, ["stop"]))
    }, [
      g("div", Mg, [
        e.declaration.body_url ? (c(), G($g, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (c(), h(K, { key: 1 }, [
          a.value ? (c(), h(K, { key: 0 }, [
            x[2] || (x[2] = g("p", { class: "mark-label" }, "Why it stopped", -1)),
            g("p", Sg, $(a.value), 1)
          ], 64)) : O("", !0),
          d.value && u.value ? (c(), h("p", _g, $(u.value), 1)) : d.value && l.value ? (c(), h(K, { key: 2 }, [
            x[3] || (x[3] = g("p", { class: "mark-label" }, "Output", -1)),
            D(Wp, {
              class: "mark-terminal",
              lines: z(i),
              onOlder: z(r).loadEarlier
            }, null, 8, ["lines", "onOlder"])
          ], 64)) : s.value.length ? (c(), h("p", Eg, $(s.value.join(`
`)), 1)) : O("", !0),
          o.value ? (c(), h("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: x[0] || (x[0] = be((S) => z(Fe)(`${xo}:${o.value}`), ["stop"]))
          }, "Open task " + $(o.value) + " and its proofs", 1)) : O("", !0)
        ], 64))
      ])
    ], 2));
  }
}, Qs = /* @__PURE__ */ Y(Og, [["__scopeId", "data-v-3be263ac"]]), Tg = (e) => `show-${e}`, Hb = (e, t, n) => e.filter((s) => {
  var a;
  return n(Tg((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), Ig = "messages.chat", Rg = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), _a = (e, t, n) => tn(Ig, Rg(e, t), n), Bg = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, Lg = ["title", "aria-label", "onClick"], Ng = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, Dg = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = N(() => Bg(t.buttons, t.allowedRuns).filter((r) => {
      var i;
      return !((i = r.variants) != null && i.length) || r.variants.includes(t.mark.variant);
    })), s = I(""), a = _e(Ae);
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
      ], 8, Lg))), 128)),
      s.value ? (c(), h("span", Ng, $(s.value), 1)) : O("", !0)
    ], 64));
  }
}, Pg = /* @__PURE__ */ Y(Dg, [["__scopeId", "data-v-0dfda102"]]);
function oi(e, t) {
  const n = Gn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((r) => [r.type, r])), a = async () => {
    try {
      return (await (await je.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const ri = oi("/api/marks", "marks"), Ub = ri.fetchAll, jg = ri.find, qg = 2e3;
function ii(e, t, n = qg) {
  let s = null;
  const a = () => {
    s = setTimeout(
      async () => {
        t() && await e(), a();
      },
      typeof n == "function" ? n() : n
    );
  };
  Le(async () => {
    await e(), a();
  }), Dt(() => clearTimeout(s));
}
const Fg = ["data-ref"], Wg = ["data-ref"], Hg = { class: "mark-row" }, Ug = "dock add", zg = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = N(() => jg(s.mark.type)), o = _e(Ae, null), r = N(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), i = I(null);
    ii(async () => {
      if (!r.value) return;
      const v = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      v.ok && v.value.rows.length && (i.value = v.value.rows[0].progress);
    }, () => r.value);
    const l = N(() => {
      const v = Rp(s.mark, a.value), M = !v.figure || v.figure.endsWith("%");
      return i.value && r.value && M ? { ...v, figure: `${i.value}%`, fraction: i.value / 100 } : v;
    }), u = N(() => {
      var v;
      return !!(s.mark.lines || s.mark.detail && ei.has(s.mark.variant) || t.has(s.mark.target_model) || (v = a.value) != null && v.body_url);
    }), d = I(!1);
    function f(v) {
      if (l.value.handlers.onAct && !v.target.closest(".fold")) return l.value.handlers.onAct();
      d.value = !d.value;
    }
    const p = N(() => {
      var v, M, x;
      return s.docked ? (M = (v = a.value) == null ? void 0 : v.buttons) == null ? void 0 : M.filter((S) => {
        var T;
        return !((T = S.runs) != null && T.startsWith(Ug));
      }) : (x = a.value) == null ? void 0 : x.buttons;
    });
    return (v, M) => {
      var x, S;
      return (x = a.value) != null && x.card ? (c(), h("div", {
        key: 0,
        class: Z(["thread-turn", "card", "whole-card", { "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        D(Qs, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, Fg)) : (c(), h("div", {
        key: 1,
        class: Z(["thread-turn", "card", { "full-width": (S = a.value) == null ? void 0 : S.full_width, docked: e.docked, "user-side": z(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        g("span", Hg, [
          D(Xr, tt({
            mark: l.value,
            open: u.value ? d.value : void 0
          }, ol(l.value.handlers), { onClick: f }), rl({ _: 2 }, [
            u.value ? {
              name: "default",
              fn: W(({ shown: T }) => [
                D(Qs, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: T
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          D(Pg, {
            buttons: p.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, Wg));
    };
  }
}, Vg = /* @__PURE__ */ Y(zg, [["__scopeId", "data-v-06041f79"]]), Gg = ["data-ref"], Kg = ["inert"], Yg = { class: "group-fold" }, Jg = { class: "thread-group" }, Zg = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = I(!1), s = I(!1), a = I(!1), o = I(null);
    pe(n, async (i) => {
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
      D(Xr, {
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
        g("div", Yg, [
          g("div", Jg, [
            (c(!0), h(K, null, te(e.group.marks, (u) => (c(), G(Vg, {
              key: u.id,
              mark: u
            }, null, 8, ["mark"]))), 128))
          ])
        ])
      ], 10, Kg)) : O("", !0)
    ], 8, Gg));
  }
}, zb = /* @__PURE__ */ Y(Zg, [["__scopeId", "data-v-45b58b9b"]]);
function Xg(e) {
  const t = I(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), Dt(() => n.disconnect()), t;
}
const Qg = { class: "chat-dock-fold" }, e0 = ["aria-label"], t0 = { class: "chat-dock-head" }, n0 = { class: "chat-dock-inner" }, li = 700, s0 = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = I(null), s = I(null), a = Xg(s), o = I(!1);
    let r = 0;
    return Le(() => r = setTimeout(() => o.value = !0, li)), Dt(() => clearTimeout(r)), t({ card: n }), (i, l) => (c(), h("div", {
      class: Z(["chat-dock", { lifted: e.lifted }])
    }, [
      g("div", Qg, [
        g("section", {
          ref_key: "card",
          ref: n,
          class: Z(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          he(i.$slots, "edge"),
          g("header", t0, [
            he(i.$slots, "head")
          ]),
          g("div", {
            class: Z(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            g("div", n0, [
              g("div", {
                class: Z(["chat-dock-grow", { settled: o.value }]),
                style: fe(z(a) === null ? null : { height: `${z(a)}px` })
              }, [
                g("div", {
                  ref_key: "content",
                  ref: s
                }, [
                  he(i.$slots, "default")
                ], 512)
              ], 6)
            ])
          ], 2)
        ], 10, e0)
      ])
    ], 2));
  }
}, ci = /* @__PURE__ */ Y(s0, [["__scopeId", "data-v-63e4dcfc"]]), a0 = {
  class: "dock-leave",
  "aria-hidden": "true"
}, ks = 5, o0 = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(ks, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${ks}s`, animationDelay: `${(n - ks).toFixed(2)}s` };
    return (a, o) => (c(), h("span", a0, [
      g("i", { style: s })
    ]));
  }
}, ui = /* @__PURE__ */ Y(o0, [["__scopeId", "data-v-d0c4b012"]]), di = oi("/api/docks", "docks"), Vb = di.fetchAll, ea = di.find, r0 = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), ta = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), i0 = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), l0 = (e) => e.kept ? ta("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : ta("keep", "pin", "Pin", `dock keep ${e.id}`), c0 = ["pin", "stop"], u0 = (e) => ({ ...e, iconOnly: c0.includes(e.icon) });
function d0(e, t) {
  var n;
  return [
    ...i0(e, t) ? [l0(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || dn(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    ta("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(u0);
}
const h0 = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: r0(e, t),
  buttons: d0(e, t)
}), f0 = { class: "dock-title" }, m0 = ["aria-expanded", "title"], p0 = { class: "chat-dock-acts dock-acts" }, g0 = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, v0 = {
  key: 1,
  class: "dock-text"
}, y0 = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean, refusal: { type: String, default: "" } },
  emits: ["fold", "undock"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = N(() => ea(s.item.type)), o = I(null), r = N(() => h0(s.item, a.value)), i = _e(Ae), l = I(/* @__PURE__ */ new Set()), u = I("");
    async function d(v) {
      if (v.action === "open") return Fe(`${s.item.target_model}:${s.item.target_id}`);
      v.action === "declared" && (l.value = /* @__PURE__ */ new Set([...l.value, v.label])), u.value = "";
      const x = await _a(v, s.item, i.environment);
      (x == null ? void 0 : x.ok) === !1 && (l.value = new Set([...l.value].filter((S) => S !== v.label)), u.value = x.error);
    }
    const f = N(() => r.value.buttons.filter((v) => v.action !== "undock" && !l.value.has(v.label))), p = N(() => r.value.buttons.find((v) => v.action === "undock"));
    return (v, M) => (c(), G(ci, {
      label: r.value.title,
      folded: e.folded,
      "data-figure-closing": e.leaving ? "" : null
    }, {
      edge: W(() => [
        e.leaving ? (c(), G(ui, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : O("", !0)
      ]),
      head: W(() => {
        var x, S, T;
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
            g("span", f0, $(r.value.title), 1)
          ], 64)),
          (S = a.value) != null && S.badge ? (c(), h("span", {
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
            onClick: M[0] || (M[0] = (F) => n("fold"))
          }, [
            D(Rt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, m0)),
          g("span", p0, [
            (c(!0), h(K, null, te(f.value, (F) => (c(), h(K, {
              key: F.action + F.runs
            }, [
              F.iconOnly ? (c(), G(ye, {
                key: 0,
                kind: "icon",
                "aria-label": F.label,
                title: F.label,
                "data-dock-action": F.action,
                onClick: (Q) => d(F)
              }, {
                default: W(() => [
                  D(ge, {
                    name: F.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (c(), G(ye, {
                key: 1,
                small: "",
                kind: F.primary ? "primary" : "ghost",
                bordered: !F.primary,
                "data-dock-action": F.action,
                onClick: (Q) => d(F)
              }, {
                default: W(() => [
                  oe($(F.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          D(Zn, {
            title: p.value.label,
            "data-dock-action": "undock",
            onClick: M[1] || (M[1] = (F) => n("undock", p.value))
          }, null, 8, ["title"])
        ];
      }),
      default: W(() => {
        var x, S;
        return [
          u.value || e.refusal ? (c(), h("p", g0, $(u.value || e.refusal), 1)) : O("", !0),
          e.item.text && !((x = a.value) != null && x.body_url) ? (c(), h("p", v0, $(e.item.text), 1)) : O("", !0),
          (S = a.value) != null && S.body_url ? (c(), G(Qs, {
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
}, $o = /* @__PURE__ */ Y(y0, [["__scopeId", "data-v-1ac9db13"]]), k0 = 6, w0 = 3, Mo = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, wt = (e) => !!(e.leaves_at && !e.kept), b0 = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!wt(e) || t < e.leaves_at || n.has(e.id)), x0 = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => b0(s, t, n)).sort((s, a) => s.id - a.id);
function $0(e, t, n = k0) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const M0 = (e, t, n = e) => n < 2 ? !1 : e >= w0 ? !0 : t, S0 = ["title", "aria-label"], _0 = { class: "run-chip-in" }, E0 = {
  key: 0,
  class: "run-chip-ring"
}, A0 = { class: "run-chip-name" }, C0 = { class: "run-chip-bar" }, O0 = "processes.output", T0 = 5e3, I0 = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var d;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((d = _e(Ae, null)) == null ? void 0 : d.environment) ?? "", o = I(null), r = N(() => !o.value || o.value.state === "running" || o.value.state === "background"), i = N(() => {
      var f, p;
      return ((f = o.value) == null ? void 0 : f.title) || ((p = o.value) == null ? void 0 : p.line) || s.item.title || `Run ${s.item.target_id}`;
    }), l = N(() => r.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function u() {
      const f = await tn(O0, ["process", "card", String(s.item.target_id)], a);
      f.ok && (o.value = f.value);
    }
    return ii(u, () => r.value, T0), (f, p) => {
      var v;
      return c(), h("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: i.value,
        "aria-label": `${i.value}; show its card`,
        style: fe({ "--tone": l.value })
      }, [
        z(wt)(e.item) ? (c(), G(ui, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : O("", !0),
        g("span", _0, [
          r.value ? (c(), h("span", E0)) : (c(), G(nt, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          g("span", A0, $(i.value), 1)
        ]),
        g("span", C0, [
          g("i", {
            style: fe({ width: r.value ? `${((v = o.value) == null ? void 0 : v.progress) ?? 0}%` : "100%", background: l.value })
          }, null, 4)
        ])
      ], 12, S0);
    };
  }
}, R0 = /* @__PURE__ */ Y(I0, [["__scopeId", "data-v-597b05d2"]]), B0 = 24, L0 = 8, Gb = 420;
function Kb({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= B0 && e > t ? !0 : e < t && a > L0 ? !1 : null;
}
const N0 = (e, t) => e === void 0 ? t : e, hi = "journal.viewer.";
function D0(e, t, n) {
  try {
    const s = n.getItem(hi + e);
    return s === null ? t : JSON.parse(s);
  } catch {
    return t;
  }
}
function P0(e, t, n) {
  try {
    n.setItem(hi + e, JSON.stringify(t));
  } catch {
    return;
  }
}
function j0(e, t, n = window.localStorage) {
  const s = I(D0(e, t, n));
  return pe(s, (a) => P0(e, a, n), { deep: !0 }), s;
}
const q0 = {
  key: "runs-head",
  class: "dock-runs-head"
}, F0 = { class: "dock-runs-chips" }, W0 = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    var A;
    const t = e, n = ap(500), s = I(/* @__PURE__ */ new Set()), a = I(!1), o = I(!1), r = _e(Ae), i = I(/* @__PURE__ */ new Set()), l = I({});
    async function u(y, C) {
      i.value = /* @__PURE__ */ new Set([...i.value, y.id]);
      const k = await _a(C, y, r.environment);
      (k == null ? void 0 : k.ok) === !1 && (i.value = new Set([...i.value].filter((_) => _ !== y.id)), l.value = { ...l.value, [y.id]: k.error });
    }
    const d = N(() => x0(t.items.filter((y) => !i.value.has(y.id)), n.value, s.value)), f = N(() => $0(d.value.filter((y) => Mo(y, ea)), n.value)), p = N(() => d.value.filter((y) => !f.value.includes(y) && !Mo(y, ea))), v = N(() => f.value.filter((y) => !wt(y))), M = N(() => (a.value = M0(f.value.length, a.value, v.value.length)) && !o.value), x = j0(`dock-folded:${((A = ie.identity) == null ? void 0 : A.root) || location.host}`, {}), S = (y) => N0(x.value[y.id], t.folded);
    function T(y) {
      x.value = { ...x.value, [y.id]: !S(y) };
    }
    function F(y) {
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
    return (y, C) => (c(), G(Vo, {
      tag: "div",
      name: "dock",
      duration: z(li),
      class: "dock-stack"
    }, {
      default: W(() => [
        (c(!0), h(K, null, te(p.value, (k) => (c(), G($o, {
          key: k.id,
          item: k,
          class: Z({ timed: z(wt)(k) }),
          leaving: z(wt)(k) && !s.value.has(k.id),
          folded: S(k),
          refusal: l.value[k.id],
          onFold: (_) => T(k),
          onUndock: (_) => u(k, _),
          onMouseenter: (_) => E(k),
          onMouseleave: (_) => b(k)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (c(), h("div", q0, [
          g("button", {
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
        (c(!0), h(K, null, te(M.value ? [] : f.value, (k) => (c(), G($o, {
          key: k.id,
          item: k,
          class: Z({ timed: z(wt)(k) }),
          leaving: z(wt)(k) && !s.value.has(k.id),
          folded: S(k),
          refusal: l.value[k.id],
          onFold: (_) => T(k),
          onUndock: (_) => u(k, _),
          onMouseenter: (_) => E(k),
          onMouseleave: (_) => b(k)
        }, null, 8, ["item", "class", "leaving", "folded", "refusal", "onFold", "onUndock", "onMouseenter", "onMouseleave"]))), 128)),
        M.value ? (c(), G(ci, {
          key: "runs-row",
          label: `${f.value.length} runs`,
          kind: "dock-runs-row"
        }, {
          head: W(() => [
            g("button", {
              type: "button",
              class: "dock-runs-toggle",
              "aria-expanded": "false",
              title: "Show each run on a card",
              "data-dock-runs-open": "",
              onClick: C[0] || (C[0] = (k) => o.value = !0)
            }, [
              D(nt, { name: "runs" }),
              oe(" " + $(f.value.length) + " runs ", 1),
              D(Rt)
            ]),
            g("span", F0, [
              (c(!0), h(K, null, te(f.value, (k) => (c(), G(R0, {
                key: k.id,
                item: k,
                onClick: (_) => F(k)
              }, null, 8, ["item", "onClick"]))), 128))
            ])
          ]),
          _: 1
        }, 8, ["label"])) : O("", !0)
      ]),
      _: 1
    }, 8, ["duration"]));
  }
}, Yb = /* @__PURE__ */ Y(W0, [["__scopeId", "data-v-c9a1014f"]]), bt = { notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12 }, Rn = (e) => Math.min(Math.max(e, 0), 1), H0 = (e) => {
  const t = Rn(e);
  return t * t * (3 - 2 * t);
}, gt = (e, t, n) => H0((e - t) / (n - t));
function Jb(e) {
  const t = Rn(e), n = Rn((t - 0.12) / 0.76) * bt.shuffles, s = Math.min(Math.floor(n), bt.shuffles - 1), a = n - s, o = gt(a, 0.26, 0.38) * (1 - gt(a, 0.76, 0.96)), r = gt(a, 0.38, 0.76), i = gt(t, 0, 0.12) * (1 - gt(t, 0.88, 1)), l = gt(a, 0.2, 0.34) * (1 - gt(a, 0.84, 1)), u = Math.sin(Math.PI * Rn((a - 0.45) / 0.55)) ** 2;
  return { moved: r, across: (s + r) / bt.shuffles, lift: bt.lift * o, ready: i, weight: l, follow: u, shuffle: s, phase: a };
}
function Zb(e, t, n, s, a) {
  return {
    place: { ...t, face: e.canonicalFace },
    footing: { ...n, face: e.footingFace },
    posed: { posture: t.posture, facing: s, turning: !1 },
    seatPose: { face: s, from: e.facing, to: s, since: a, next: a + 4 }
  };
}
const So = {
  butler: { ms: 420, squash: 0.04, bounce: 0 },
  coach: { ms: 340, squash: 0.1, bounce: 10 },
  colleague: { ms: 480, squash: 0.06, bounce: 3 },
  homie: { ms: 380, squash: 0.14, bounce: 14 },
  squire: { ms: 300, squash: 0.18, bounce: 2 }
}, Xb = (e) => So[e] ?? So.butler, Ea = 2400, U0 = 0.05;
function z0({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, U0), r = Math.min(t + Ea * o, a), i = e + r * o;
  return i < n ? { y: i, speed: r, landed: !1 } : { y: n, speed: 0, landed: !0 };
}
function Qb(e, t, n = null) {
  if (!e.loops) return Math.min(t, e.frames - 1);
  const s = e.intro || 0, a = e.outro || 0;
  return n !== null && t >= n ? Math.min(e.frames - a + t - n, e.frames - 1) : t < s ? t : s + (t - s) % (e.frames - s - a);
}
function V0(e, t) {
  if (!t || e < t.to) return e;
  const { from: n, to: s, extra: a } = t;
  return e < s + a ? n + (e - s) % (s - n) : e - a;
}
function e5(e, t) {
  const n = e.intro || 0, s = e.leaves || e.frames - n - (e.outro || 0);
  return n + Math.ceil(Math.max(t - n, 0) / s) * s;
}
const t5 = (e, t) => ({ ...e, stretch: t.stretch }), n5 = (e, t) => !!(e != null && e.once) && t >= e.clip.frames, fi = (e, t) => t >= (e.least ?? 0);
function s5(e, t, n) {
  if (!fi(e, t / e.fps)) return !1;
  if (e.interruptible) return !0;
  if (!e.loops) return t >= e.frames;
  const s = e.leaves || e.frames;
  return Math.floor(t / s) > Math.floor(n / s);
}
const a5 = (e, t, n) => !!(e.once && (t != null && t.once) && e.clip.name === t.clip.name && !n), G0 = "[data-figure-bubble], [data-figure-mark], [data-figure-home], [data-figure-docked-bars]", _o = (e, t) => ({ left: Math.max(e.left, t.left), right: Math.min(e.right, t.right), top: Math.max(e.top, t.top), bottom: Math.min(e.bottom, t.bottom) }), K0 = (e) => e.right > e.left && e.bottom > e.top;
function o5(e = ((t) => (t = document.querySelector("[data-figure-home]")) == null ? void 0 : t.closest("[data-figure-world]"))()) {
  var a;
  if (!e) return [];
  const n = e.getBoundingClientRect(), s = (a = e.querySelector("[data-figure-chat-foot]")) == null ? void 0 : a.getBoundingClientRect();
  return [...e.querySelectorAll(G0)].flatMap((o) => {
    if (o.checkVisibility && !o.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 })) return [];
    const r = o.getBoundingClientRect();
    let i = _o(r, n);
    const l = o.closest("[data-figure-scroll]");
    return l && !o.closest("[data-figure-chat-foot]") && (i = _o(i, l.getBoundingClientRect()), s && (i.bottom = Math.min(i.bottom, s.top))), K0(i) ? [{ id: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom, clip: i }] : [];
  });
}
function mi(e, t, n) {
  let s = null;
  for (const a of n) {
    const o = a.clip ?? a;
    let r = 0, i = 1;
    for (const [d, f, p] of [["x", "left", "right"], ["y", "top", "bottom"]]) {
      const v = t[d] - e[d];
      if (Math.abs(v) < 1e-9)
        (e[d] < o[f] || e[d] > o[p]) && (i = -1);
      else {
        const M = (o[f] - e[d]) / v, x = (o[p] - e[d]) / v;
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
}, nn = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Y0 = (e) => e * e * (3 - 2 * e), Se = (e, [t, n]) => Y0(nn(e, t, n)), J0 = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], ct = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, _n = ([e, t], n) => e + n() * (t - e);
function Z0(e) {
  return J0.map(() => {
    const t = _n(ct.speed, e), n = _n(ct.angle, e) * Math.PI / 180, s = _n(ct.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [_n(ct.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const X0 = Z0(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function Q0(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * ct.gravity * (t[2] - ct.floor))) / ct.gravity;
}
function r5(e, t, n = X0) {
  const s = Me.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], r = Q0(o, s.from), i = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= r + i) return null;
  const l = Math.min(a, r), u = s.from.map((d, f) => d + o.velocity[f] * l);
  return u[2] -= ct.gravity * l * l / 2, { at: u, turn: o.spin * l, landed: Math.max(0, a - r) / i };
}
const i5 = (e, t) => e && Me[e.name] ? { name: e.name, u: t / e.frames } : null;
function l5(e, t) {
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
const c5 = () => Array.from({ length: Me.pogo.count }, (e, t) => Me.pogo.bounce * (t + 1) / Me.pogo.count), It = { reach: 1.2, margin: 0.25, tall: 0.14, stride: 0.5, carried: 5 };
function u5(e, t, n) {
  const { away: s, side: a } = Me.bug_smash, o = a * s * n, [r, i] = [t.left + It.margin * n, t.right - It.margin * n], l = Math.min(Math.max(e + o + a * It.reach * n, r), i), u = l - o - e, d = l - (a * u > 0 ? u / 2 : 0);
  return { figure: [e - t.left, d - o - t.left], bug: [l - t.left, d - t.left] };
}
function d5(e, t, n) {
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
function h5(e, t, n, s) {
  if (!e.falling && t && (e.y === void 0 || t.y - e.y <= It.carried)) return { x: t.x, y: t.y, speed: 0, falling: !1 };
  const a = z0({ y: e.y, speed: e.speed }, n, s);
  return { x: e.x, y: a.y, speed: a.speed, falling: !0 };
}
const Ie = { least: 2, most: 5, walls: ["left", "right", "top"], inset: 8, speed: 14, margin: 0.1 };
function f5(e) {
  const t = Ie.least + Math.floor(e() * (Ie.most - Ie.least + 1));
  return Array.from({ length: t }, () => ({
    wall: Ie.walls[Math.floor(e() * Ie.walls.length)],
    along: Ie.margin + e() * (1 - 2 * Ie.margin),
    way: e() < 0.5 ? -1 : 1
  }));
}
function na(e, t, n) {
  const s = e.wall === "top" ? t.right - t.left : t.bottom - t.top, a = 1 - 2 * Ie.margin, r = ((e.along - Ie.margin + e.way * Ie.speed * n / s) / a % 2 + 2) % 2, i = Ie.margin + a * (r <= 1 ? r : 2 - r);
  return e.wall === "top" ? { x: t.left + i * s, y: t.top + Ie.inset, turn: 180 } : { x: e.wall === "left" ? t.left + Ie.inset : t.right - Ie.inset, y: t.top + i * s, turn: e.wall === "left" ? 90 : -90 };
}
function ev(e, t) {
  const n = Me.bug_shot, [s, a] = n.turn.map((d) => d * n.frames), o = { from: s, to: a, extra: (t - 1) * (a - s) }, r = V0(e, o), i = e < s ? 0 : Math.min(Math.floor((e - s) / (a - s)), t - 1), u = e >= s + t * (a - s) ? t : i + (r / n.frames >= n.splat ? 1 : 0);
  return { frame: r, stretch: o, bug: i, shot: u };
}
function m5(e, t, n, { surfaces: s = [], bursts: a = null } = {}) {
  const o = Me.bug_shot, { frame: r, bug: i, shot: l } = ev(n, e.length), u = e.map((T, F) => ({ ...na(T, t, Math.min(n / o.fps, Bn(F).shot)), shot: F < l })), d = Se(r / o.frames, o.aim), [f, p] = [u[Math.max(i - 1, 0)], u[i]], v = e.map((T, F) => ({ bug: T, index: F, seconds: n / o.fps - Bn(F).shot, spot: na(T, t, Bn(F).shot) })).filter((T) => T.seconds >= 0), M = v.flatMap((T) => {
    const F = (a == null ? void 0 : a.get(T.index)) ?? ov(T.bug, t, T.spot, a ? [] : s);
    return a == null || a.set(T.index, F), a && rv(F, T.seconds, s), iv(F, T.seconds, s);
  }), x = v.filter((T) => sv(T.bug)).map((T) => ({ seconds: T.seconds, from: T.spot })), S = +(e[Math.max(i - 1, 0)].wall === "top") * (1 - d) + +(e[i].wall === "top") * d;
  return { bugs: u, frame: r, target: { x: f.x + (p.x - f.x) * d, y: f.y + (p.y - f.y) * d, back: S }, slush: M, camera: x };
}
function Bn(e) {
  const t = Me.bug_shot, [n, s] = t.turn.map((o) => o * t.frames), a = n + e * (s - n);
  return { walk: e ? a - (s - n) + (t.splat * t.frames - n) : t.draw[1] * t.frames, aim: a + (t.aim[1] * t.frames - n), shot: (a + (t.splat * t.frames - n)) / t.fps };
}
function p5(e, t, n, s) {
  const { limit: a, margin: o } = Me.bug_shot.back, [r, i] = [n.left + o * s, n.right - o * s];
  let l = n.x;
  return e.map((u, d) => {
    const f = Bn(d), p = na(u, t, f.shot), v = Math.abs(p.y - n.y) / Math.tan(a * Math.PI / 180), M = p.x === l ? l - r >= i - l ? -1 : 1 : Math.sign(l - p.x), x = Math.abs(p.x - l) >= v ? l : p.x + M * v, S = M > 0 ? Math.max(l, Math.min(x, i)) : Math.min(l, Math.max(x, r)), T = { from: l, to: S, begin: f.walk, end: f.aim };
    return l = S, T;
  });
}
function g5(e, t, n) {
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
const xe = { count: 14, speed: [70, 210], spread: 75, gravity: 620, radius: [2, 4.5], hold: 1, fade: 1.5, camera: 0.35, step: 1 / 60 }, tv = { left: [1, 0], right: [-1, 0], top: [0, 1] };
function nv(e) {
  let t = Math.floor(Math.abs(e) * 1e6) % 2147483646 + 1;
  return () => (t = t * 48271 % 2147483647) / 2147483647;
}
const sv = (e) => e.along * 97 % 1 < xe.camera, sn = (e, t) => ({ x: e.from.x + e.vx * t, y: e.from.y + e.vy * t + 0.5 * xe.gravity * t * t });
function av(e, t, n) {
  const a = [{ t: (-e.vy + Math.sqrt(e.vy * e.vy + 2 * xe.gravity * (t.bottom - e.from.y))) / xe.gravity, on: "floor" }];
  e.vx < 0 && a.push({ t: (t.left - e.from.x) / e.vx, on: "left" }), e.vx > 0 && a.push({ t: (t.right - e.from.x) / e.vx, on: "right" });
  const o = e.vy * e.vy + 2 * xe.gravity * (t.top - e.from.y);
  e.vy < 0 && o >= 0 && a.push({ t: (-e.vy - Math.sqrt(o)) / xe.gravity, on: "top" });
  const r = a.filter((u) => u.t >= 0).sort((u, d) => u.t - d.t)[0];
  let i = e.from;
  for (let u = 0; u < r.t; u += xe.step) {
    const d = Math.min(u + xe.step, r.t), f = sn(e, d), p = mi(i, f, n);
    if (p) return { ...p, t: u + (d - u) * p.share };
    i = f;
  }
  const l = sn(e, r.t);
  return { ...r, x: Math.min(Math.max(l.x, t.left), t.right), y: Math.min(Math.max(l.y, t.top), t.bottom) };
}
function ov(e, t, n, s = []) {
  const a = nv(e.along + 1), [o, r] = tv[e.wall], i = Math.atan2(r, o);
  return Array.from({ length: xe.count }, () => {
    const l = i + (a() - 0.5) * 2 * (xe.spread * Math.PI / 180), u = xe.speed[0] + a() * (xe.speed[1] - xe.speed[0]), d = { from: { x: n.x, y: n.y }, vx: Math.cos(l) * u, vy: Math.sin(l) * u, r: xe.radius[0] + a() * (xe.radius[1] - xe.radius[0]) };
    return { ...d, ...av(d, t, s) };
  });
}
function rv(e, t, n) {
  for (const s of e) {
    if (s.settled) continue;
    const a = Math.min(t, s.t);
    for (let o = s.checked ?? 0; o < a; o += xe.step) {
      const r = Math.min(o + xe.step, a), i = mi(sn(s, o), sn(s, r), n);
      if (i) {
        Object.assign(s, i, { t: o + (r - o) * i.share });
        break;
      }
    }
    s.checked = t, s.settled = t >= s.t;
  }
}
function iv(e, t, n = []) {
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
function v5(e, t, n, s) {
  const { fly: a, drops: o, lens: r, frames: i, fps: l } = Me.bug_shot;
  if (e < 0) return [];
  const u = (a[1] - a[0]) * i / l, d = (o[1] - o[0]) * i / l, f = Se(e, [0, u]), p = Se(e, [u, u + d]);
  return r.map((v) => {
    const M = { x: s.x + v.at[0] * t, y: s.y + v.at[1] * t };
    return {
      x: n.x + (M.x - n.x) * f,
      y: n.y + (M.y - n.y) * f,
      r: v.size * t * (0.15 + 0.85 * f * f),
      run: p * p * t * 1.2,
      fade: 1 - p,
      landed: f >= 1
    };
  });
}
function y5(e, t, n, s, a) {
  const { sway: o, above: r } = Me.chute, i = { x: t.x, y: t.y - r * s }, l = o / 2 * Math.sin(2 * Math.PI * a), [u, d] = [Math.cos(l * Math.PI / 180), Math.sin(l * Math.PI / 180)], f = (x) => {
    const [S, T] = [x.x - e.at.x, x.y - e.at.y];
    return { x: i.x + S * u - T * d, y: i.y + S * d + T * u };
  }, [p, v] = [...n].sort((x, S) => x.x - S.x), M = e.ends.map(f);
  return { left: i.x - e.at.x, top: i.y - e.at.y, middle: i, turn: l, lines: M.map((x, S) => ({ from: x, to: S < M.length / 2 ? p : v })) };
}
const k5 = (e, t) => Se(t, e.grows) * (1 - Se(t, e.sinks));
function Fn(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: nn(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: nn(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function w5(e, t) {
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
const b5 = (e) => e === "pack_box";
function x5(e) {
  const { into: t, out: n } = Fn(Me.rope_swing, e);
  return 1 - Se(t, [0, 1]) * (1 - Se(n, [0, 1]));
}
function $5(e) {
  const t = Me.rope_swing, { into: n, out: s } = Fn(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return Se(n, [0, 1]) * (1 - Se(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const lv = { after: 3 }, Aa = 10, cv = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, uv = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, dv = { weight: 19 }, pi = {
  build: { name: "build", acts: ["work", "inspect", "push"], when: { box: !0 }, cooldown: 180, lifetime: 60 }
}, hv = { every: 120 }, gi = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, vi = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, fv = {
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
}, pn = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: Aa }), ee = (e, t, n = {}) => pn(e, "clip", t, n), ws = (e, t, n = {}) => pn(e, "look", t, n), Eo = (e, t, n = {}) => pn(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...pn(e, "pick", t, n), ...s }), ve = (e) => pn("nothing", "nothing", e, {}), mv = 120, pv = 300, bs = (e, t) => ({ ...ee(e, t), cooldown: pv }), ae = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), gv = () => [ee("joy", 2)], vt = (e, t, n, s, a = {}) => ({ ...ee(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), yt = (e) => ({ ...e, cooldown: cv[e.name] }), Vt = (e) => ({ ...e, shenanigan: !0, lasts: uv[e.name] }), es = [
  // a test run's end: celebrated on its card, or a start at a failure; a pass soon after a failure is the bug solved, most often shot
  // as it crawls into the chat instead of the visor's glow
  ...ae("tests_passed", { cooldown: 20, toward: "card", onto: !0 }, [ee("nod", 2), ve(1)]),
  // or the same bug smashed flat with a big wooden mallet swung over the head, each on its own cooldown, else a nod
  ...ae("tests_fixed", { cooldown: 20, toward: "card", onto: !0 }, [
    { ...yt(ee("bug_shot", 3)), toward: "", onto: !1 },
    { ...yt(ee("bug_smash", 2)), toward: "", onto: !1 },
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
  ...ae("reported", { cooldown: 90 }, [Eo("read", 3), ee("nod", 1), ve(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ae("read_message", { cooldown: 30 }, [Eo("read", 3), ve(1)]),
  ...ae("fact_filed", { cooldown: 120 }, [ee("file_card", 3), ee("nod", 1), ve(6)]),
  ...ae("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [ee("nod", 2), ve(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ae("bar_done", { holds: !0 }, gv()),
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
  ...ae("answered", { cooldown: 15 }, [ws("amused", 3), ve(2)]),
  ...ae("heard", { cooldown: 30 }, [
    ee("bow", 1, { voices: ["butler"] }),
    ee("salute", 1, { voices: ["squire"] }),
    ee("nod", 1, { voices: ["coach", "colleague", "homie"] }),
    ve(1)
  ]),
  ...ae("long_walk", { cooldown: 90 }, [ee("stumble", 3), ve(22)]),
  ...ae("card_arrived", { cooldown: 20, toward: "card" }, [ee("glance", 7), ve(13)]),
  ...ae("typing", { cooldown: 60 }, [ws("reading", 1), ve(4)]),
  // a face the user puts on a message changes the eyes, every time; one the agent puts on in its voice is played out, every time
  ...Object.entries(fv).flatMap(([e, t]) => ae(`reacted:${e}`, {}, [ws(t, 1)])),
  ...Object.entries(gi).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ae(`agent_reacted:${n}`, {}, [ee(s, 1, { voices: [e] })])[0])),
  ...Object.entries(vi).flatMap(([e, t]) => ae(`agent_reacted:${e}`, {}, [ee(t, 1)])),
  // the idle acts, while it has nothing to do, a wait on a run, a worker or the user as much as idle
  ...ae("pastime", {}, [
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
    { ...Vt(yt(ee("hop_up", 2))), flies: !0 },
    // on a rare occasion it disco dances under a disco ball, only standing on a bubble with another above it to hang the ball from
    // (perches.js discoBall)
    Vt(yt(ee("disco", 2, { ball: "bubble" }))),
    ve(560)
  ]),
  // how a held clip is played for one stretch of it: searching with the magnifying glass or binoculars; typing on or stopping to think at the laptop;
  // and while the context compacts, packed into a box that shrinks, vacuuming up words, or squaring a stack of papers
  // no search within two minutes of the last, and each, the magnifying glass and the binoculars, at most once in five
  // minutes, so the next is always another; none at all while all wait;
  // the binoculars only from the compose box, scanning up the chat; the glass held up to a bubble only with one within reach (perches.js
  // bubbleNear)
  ...ae("held:search", { cooldown: mv }, [bs("search", 3), { ...bs("binoculars", 2), when: { home: !0 } }, { ...bs("glass_bubble", 2), when: { bubble: !0 } }]),
  ...ae("held:type", {}, [ee("type", 3), ee("type_ponder", 1)]),
  ...ae("held:compacting", {}, [ee("pack_box", 3), ee("vacuum", 2), ee("compacting", 1)]),
  // the work's own acts, each only while that work goes on and then weighted heavily, a spell keeping it up a while so it is seen though
  // the tool lasts a moment: the laptop while the agent edits, the book while it reads, the searching while it searches
  ...ae("spell", {}, [de("writing", 12, { state: "writing" }), de("reading", 12, { state: "reading" }), de("searching", 12, { state: "searching" }), ve(4)]),
  // the mouse pointer tickling it (tickle.js): it swats at the pointer every time, as often as it is tickled, and never once the pointer
  // has long gone
  ...ae("tickled", {}, [{ ...yt(ee("tickle_swat", 1)), lifetime: 3 }]),
  // a slow docked bar near its end: the figure gets eager for it now and then
  ...ae("eager", {}, [ee("eager", 2, { slow: !0 }), ve(3)]),
  // a jump up more than the figure's own height now and then turns over backwards on the way
  ...ae("jump", {}, [Vt(yt(ee("backflip", 7, { high: !0 }))), ee("jump", 13)]),
  // a climb of at least half the chat window's height (climbs.js POGO) hops up the bubbles on the way; with none to hop on it is not climbed
  ...ae("climb", {}, [de("hops", 3, { footholds: !0 })]),
  // while a run goes, whether the figure builds a server unit now (UNIT), the build's sequence waiting its cooldown
  ...ae("unit", { cooldown: pi.build.cooldown }, [de("unit", dv.weight), ve(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ae("progress_jump", { cooldown: 6 }, [ee("look_up", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ae("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: hv.every }, de("stand", 5)]),
  // a digit a blow's dust lets out
  ...ae("digit", {}, [de("0", 1), de("1", 1)]),
  // where the figure goes when nothing calls it, and how long it stays, in seconds between the two: rests on a corner of the edge, sits on
  // the corner itself with its legs over the end, strolls the edge, perches on a bubble or stands on a tab
  ...ae("roam", {}, [
    de("rest", 35, {}, { stay: [25, 60] }),
    de("seat", 15, {}, { stay: [15, 40] }),
    de("edge", 25, {}, { stay: [8, 20] }),
    Vt(de("bubble", 15, {}, { stay: [30, 80] })),
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
    Vt(yt(de("rope_swing", 8, { free: !0, swings: !0 }, { stay: [25, 50] })))
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
], yi = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), ki = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), vv = (e) => Array.isArray(e) ? e[0] : e, yv = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0, kv = (e) => es.some((t) => t.when.moment === e);
function wv(e) {
  var u;
  const t = e.has ?? (() => !0), n = (d) => e.now - (e.memory.get(d) ?? -1 / 0), s = (d) => !e.memory || ki(d).every(([f, p]) => n(f) >= vv(p)), a = (d) => !d.shenanigan || d.lasts <= (e.room ?? 0), o = es.filter((d) => yi(d.when, e) && (d.kind !== "clip" || t(d.name)) && s(d) && a(d)), i = (((u = e.tally) == null ? void 0 : u.plain) ?? 0) >= lv.after && o.some((d) => d.shenanigan) ? o.filter((d) => d.shenanigan) : o, l = i.filter((d) => {
    var f;
    return d.kind === "nothing" || d.name !== ((f = e.tally) == null ? void 0 : f.last);
  });
  return l.some((d) => d.kind !== "nothing") ? l : i;
}
function We(e, t) {
  const n = wv(e);
  let s = t() * n.reduce((o, r) => o + r.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (wi(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function wi(e, t, n) {
  var s;
  for (const [a, o] of ki(t)) (s = e.memory) == null || s.set(a, e.now + yv(o, n));
}
function M5(e, t, n) {
  wi(e, es.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const S5 = (e) => Object.values(pi).find((t) => yi(t.when, e)) ?? null, bv = (e, t, n) => n - t <= (e.lifetime ?? Aa), _5 = (e, t, n = null) => !e || !e.once && !e.holds && !e.clip.holds && (!!(n != null && n.urgent) || fi(e.clip, t));
class bi {
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
const sa = {
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
}, E5 = /* @__PURE__ */ new Set(["asleep", "compacting", "paused", "stopped"]), xi = /* @__PURE__ */ new Set(["thinking", "quiet", "searching", "reading", "writing", "testing", "building", "running"]), A5 = {
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
}, C5 = 120, xv = 20, O5 = (e, t) => e.some((n) => n.type === "memories.compaction" && t - n.time < xv), $v = (e) => sa[e] || sa.idle, T5 = (e, t, n) => e.question + e.waiting + e.suggestion > 0 ? t || n : 0, $i = "airborne", Mv = "landing", Sv = "travelling", Mi = "grounded", I5 = ({ airborne: e, landing: t, trip: n }) => e ? $i : t ? Mv : n != null && n.started ? Sv : Mi;
function R5(e, t) {
  var a;
  const n = _v(e, t);
  return e.mode === Mi && e.place.posture === "lounge" && !((a = e.trip) != null && a.started) ? { ...n, facing: e.place.face } : n;
}
function _v(e, t) {
  const { mode: n, leaving: s, arriving: a, trip: o, landing: r, place: i, beat: l, state: u, doing: d, doingFacing: f = 0, readingFacing: p = null } = e;
  if (n === $i && i.posture === "stand") return { clip: e.chute ? "chute" : "fall", facing: e.grabbed ? i.face ?? 0 : 0 };
  if (e.flying) return { clip: "hop_up", facing: e.flying.way > 0 ? 90 : e.flying.way < 0 ? 270 : 0 };
  if (s) return { clip: "exit", facing: 0, once: !0, departure: !0 };
  if (a) return { clip: "enter", facing: 0, once: !0, arrival: !0 };
  if (r) return { clip: "land", facing: 0, once: !0, landed: !0 };
  if (o != null && o.started && o.moves && !o.hopping && (l == null ? void 0 : l.clip) === "stumble")
    return { clip: "stumble", facing: o.way > 0 ? 90 : 270, posture: "walk", once: !0 };
  if (o != null && o.started) return { ...Ev(o, d, t), ...o.moves ? {} : { startsLeg: !0 } };
  if (i.posture === "hang") return { clip: `hang_${i.grip}`, facing: i.face };
  if (e.eager) return { clip: "eager", facing: 0 };
  if (l && !(l.onto && o)) return { clip: l.clip, facing: l.facing, once: !0, ...l.holds && { holds: !0 }, ...l.stretch && { stretch: l.stretch } };
  if (i.view && u === "asking") return { clip: "point", facing: 0 };
  const v = p !== null && i.posture === "stand" && d !== "push";
  return ["asking", "waiting"].includes(u) && !["work", "push"].includes(d) ? { clip: "waiting", facing: v ? p : e.composeFacing ?? 0 } : { clip: t(d, i.posture) ? d : $v(u), facing: v ? p : i.posture === "sit" ? i.face : f };
}
function Ev(e, t, n) {
  if (e.hopping) return { clip: e.clip, facing: e.facing ?? 0 };
  const s = e.way > 0 ? 90 : 270, a = e.pace > 1 ? { pace: e.pace } : {};
  return e.running || e.pressing || e.sprinting || e.pace > 1 ? { clip: "run", facing: s, ...a } : t !== "idle" && n(t, "walk") ? { clip: t, facing: s, posture: "walk", ...a } : { clip: "walk", facing: s, ...a };
}
const aa = (e) => e.outcome, Av = "plugin:code-commandments:sins:", Ao = (e) => e.type === "plugins.card" && e.markKey.startsWith(Av), Cv = [
  // a sin the commandments plugin found in the agent's change, and one it found repented, as its marks in the chat say
  { beat: "sin_committed", matches: (e) => Ao(e) && e.variant !== "good" },
  { beat: "sin_fixed", matches: (e) => Ao(e) && e.variant === "good" },
  { beat: "committed", matches: (e) => e.type === "workers.worker" && e.variant === "merged" },
  { beat: "reported", matches: (e) => e.type === "workers.worker" && e.variant === "delivered" },
  { beat: "refused", matches: (e) => e.type === "workers.worker" && e.variant === "released" },
  { beat: "failed", matches: (e) => e.type === "workers.tests" && e.variant === "failed" },
  { beat: "check_passed", matches: (e) => e.type === "workers.tests" && e.variant === "passed" },
  { beat: "question_asked", matches: (e) => e.type === "questions.question" && e.variant === "open" },
  { beat: "answered", matches: (e) => e.type === "questions.answer" },
  { beat: "task_finished", matches: (e) => e.type === "tasks.task" && e.variant === "closed" },
  { beat: "fact_filed", matches: (e) => ["memories.memory", "memories.reminder"].includes(e.type) && e.variant === "made" }
], B5 = (e, t) => e.filter((n) => n.author === "user" && Ee(n.read_at) > t).map((n) => ({ beat: "read_message", time: Ee(n.read_at), card: mr(n) })).sort((n, s) => n.time - s.time), Co = { user: "reacted", agent: "agent_reacted" };
function L5(e, t) {
  return e.filter((n) => Co[n.author] && xt(n) > t).map((n) => ({ beat: `${Co[n.author]}:${n.emoji}`, time: xt(n), card: `message:${n.message_id}` })).sort((n, s) => n.time - s.time);
}
const Ov = [.../* @__PURE__ */ new Set([...Object.values(gi).flatMap((e) => Object.keys(e)), ...Object.keys(vi)])];
function N5(e, t) {
  return e.filter((n) => n.author === "agent" && xt(n) > t).map((n) => {
    var s;
    return { m: n, face: (s = Ov.map((a) => [a, n.text.indexOf(a)]).filter(([, a]) => a >= 0).sort((a, o) => a[1] - o[1])[0]) == null ? void 0 : s[0] };
  }).filter(({ face: n }) => n).map(({ m: n, face: s }) => ({ beat: `agent_reacted:${s}`, time: xt(n), card: mr(n) })).sort((n, s) => n.time - s.time);
}
const Tv = (e) => new bi(e).isTest(), Wn = (e) => {
  var t;
  return ((t = e.watch) == null ? void 0 : t.ending) || e.process && !e.active && { passed: "finished", failed: "failed" }[aa(e)] || "";
}, Iv = 1800, Rv = (e, t) => {
  if (Wn(e) !== "finished") return "tests_failed";
  const n = t.filter((a) => Number(a.time) < Number(e.time)).sort((a, o) => Number(o.time) - Number(a.time))[0];
  return n && Wn(n) !== "finished" && Number(e.time) - Number(n.time) <= Iv ? "tests_fixed" : "tests_passed";
};
function D5(e, t, n) {
  var r;
  const s = (((r = e == null ? void 0 : e.data) == null ? void 0 : r.cards) || []).filter(Tv), a = s.filter((i) => Wn(i)), o = a.filter((i) => t.get(i.key) === "" || !t.has(i.key) && Number(i.time) > n);
  return s.forEach((i) => t.set(i.key, Wn(i))), o.map((i) => ({ beat: Rv(i, a), time: Number(i.time), card: i.key }));
}
function P5(e, t) {
  var a;
  const n = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.process), s = n.filter((o) => t.get(o.key) === !0 && !o.active && ["passed", "failed"].includes(aa(o)));
  return n.forEach((o) => t.set(o.key, o.active)), s.map((o) => ({ tone: aa(o) === "passed" ? "good" : "bad", time: Number(o.time), card: o.key }));
}
const j5 = (e) => e.map((t) => {
  const n = t.text.toLowerCase();
  return {
    key: `chat_mark:${t.id}`,
    markKey: t.key,
    time: xt(t),
    type: t.type,
    variant: t.variant,
    outcome: t.outcome,
    process: t.type === "processes.command",
    active: !t.ended_at,
    guesses: { test: n.includes("test"), build: n.includes("build"), upload: n.includes("upload") }
  };
});
function q5(e, t, n) {
  return e.map((s) => {
    const a = t.get(s.key), o = a ? a.variant === s.variant ? a.time : n : s.time;
    return t.set(s.key, { variant: s.variant, time: o }), { ...s, time: o };
  });
}
function F5(e, t, n) {
  var a;
  const s = (((a = e == null ? void 0 : e.data) == null ? void 0 : a.cards) || []).filter((o) => o.key && !t.has(o.key));
  return s.forEach((o) => t.add(o.key)), s.filter((o) => Number(o.time) > n).map((o) => ({ beat: "card_arrived", time: Number(o.time), card: o.key }));
}
function W5(e, t) {
  var o, r;
  const s = (((o = e == null ? void 0 : e.data) == null ? void 0 : o.cards) || []).filter((i) => i.time > t).map((i) => {
    var l;
    return { beat: (l = Cv.find((u) => u.matches(i))) == null ? void 0 : l.beat, time: i.time, card: i.key };
  }).filter((i) => i.beat), a = Number(((r = e == null ? void 0 : e.data) == null ? void 0 : r.person_at) || 0);
  return [...s, ...a > t ? [{ beat: "heard", time: a }] : []].sort((i, l) => i.time - l.time);
}
function Ca(e, t, n, s) {
  const a = Math.hypot(e, t, n);
  return { yaw: Math.atan2(e, t), pitch: Math.asin(Math.min(Math.max(s / a, -1), 1)) - Math.atan2(n, Math.hypot(e, t)) };
}
const Oo = ({ yaw: e, pitch: t }) => [Math.sin(e) * Math.cos(t), Math.cos(e) * Math.cos(t), -Math.sin(t)];
function Bv(e, t, n, s) {
  let [a, o] = [-100 * Math.abs(t), 100 * Math.abs(t)];
  for (let r = 0; r < 60; r++) {
    const i = (a + o) / 2;
    Ca(e, t, i, s).pitch > n ? a = i : o = i;
  }
  return (a + o) / 2;
}
function H5(e, t, n, s = {}) {
  const a = We({ moment: `held:${e}`, has: n, ...s }, t);
  return a ? a.name : kv(`held:${e}`) ? "idle" : e;
}
const Oe = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25, followSeconds: 0.2, turnSpeed: 240, tipSpeed: 90 };
function U5(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Oe.ahead * n ? 180 : Math.sign(s) * Oe.turn;
}
const To = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function z5(e, t) {
  const n = Math.min(Oe.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Oe.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Oe.lines, Math.floor((e.bottom - e.top - 2 * s) / Oe.line) + 1)), o = Math.max(t, 0), r = Math.floor(o / Oe.sweep) % a, i = o % Oe.sweep, l = Oe.sweep - Oe.returnSeconds, u = To((i - l) / Oe.returnSeconds), d = i <= l ? To(i / l) : 1 - u, f = r + ((r + 1) % a - r) * u;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * d, y: e.top + s + f * Oe.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const Io = 3, Si = (e) => Math.abs(((e + 180) % 360 + 360) % 360 - 180) <= 90, Ro = 12, V5 = (e, t) => ({ mood: e, began: t, seen: 0 });
function G5(e, t, n) {
  if (!e) return { looking: null, eyes: null };
  if (!Si(t)) return { looking: { ...e, began: n - e.seen }, eyes: null };
  const s = n - e.began;
  return s >= Io ? { looking: null, eyes: null } : { looking: { ...e, seen: s }, eyes: { mood: e.mood, seconds: Math.floor(s * Ro) / Ro, lasts: Io } };
}
const K5 = (e) => e.posture === "hang" && !Si(e.face), Lv = /* @__PURE__ */ new Set(["idle", "waiting", "asking"]), Nv = /* @__PURE__ */ new Set(["testing", "building", "running"]);
function Y5(e, t, n) {
  return Lv.has(e) ? 1 / 0 : !Nv.has(e) || !(t != null && t.share) || t.ended ? 0 : Math.max(_i(n - t.began, t.share) - Qe.lead, 0);
}
const Dv = 5;
function J5(e, t, n) {
  if (!(e != null && e.moves) || e.hopping) return { began: 0, moment: null };
  const s = t || n;
  return { began: s, moment: n - s >= Dv ? { beat: "long_walk", time: n } : null };
}
const Pv = 30, En = { seconds: [10, 18], every: 30, kept: ["writing", "reading", "searching"] };
function Z5(e, t, n, s, a = null) {
  if (t && n < t.until || !En.kept.includes(e) || n < ((t == null ? void 0 : t.next) ?? 0)) return t;
  const o = We({ moment: "spell", state: e, tally: a }, s), [r, i] = En.seconds;
  return o ? { state: o.name, began: n, until: n + r + s() * (i - r), next: n + En.every } : { state: e, began: 0, until: 0, next: n + En.every };
}
const X5 = (e, t, n) => t && n < t.until && xi.has(e.state) ? { state: t.state, since: t.began } : e, Qe = { lead: 10, grace: 5, least: 1.5, after: 60, long: 120 }, _i = (e, t) => t > 0 ? e / t * (1 - t) : 1 / 0;
function Q5(e, t, n, s) {
  var i;
  const a = !!e && e.began === (t == null ? void 0 : t.run);
  if (t != null && t.on && (!a || e.ended)) {
    const l = a ? e.ended === "good" ? "bar_done" : "bar_failed" : "";
    return { eager: { run: t.run, on: !1 }, moment: l ? { beat: l } : null, cut: !0 };
  }
  if (!e || e.ended) return { eager: t && { ...t, on: !1 }, moment: null };
  const o = s - e.began, r = _i(o, e.share);
  return a ? { eager: jv(t, r), moment: null } : r > Qe.lead ? { eager: t, moment: null } : r < Qe.least ? { eager: { run: e.began, on: !1 }, moment: null } : o > Qe.long ? { eager: { run: e.began, on: !0, urgent: !0 }, moment: null } : o < Qe.after ? { eager: { run: e.began, on: !1 }, moment: null } : { eager: { run: e.began, on: ((i = We({ moment: "eager", slow: !0 }, n)) == null ? void 0 : i.name) === "eager" }, moment: null };
}
function jv(e, t) {
  return e.on && t > Qe.lead + Qe.grace ? { ...e, on: !1, calm: !0 } : e.calm && t <= Qe.lead && t >= Qe.least ? { ...e, on: !0, calm: !1 } : e;
}
const qv = 1, Fv = { look: "look", gaze: "gaze" };
function Wv(e, t, n, s, a = "", o = () => !0, r = null) {
  const i = We({ moment: e, voice: a, has: o, memory: t, now: n, tally: r }, s);
  return i ? { [Fv[i.kind] ?? "clip"]: i.name, toward: i.toward ?? "", onto: !!i.onto, holds: !!i.holds, lifetime: i.lifetime } : null;
}
const Hv = (e, t, n, s, a, o = "", r = () => !0, i = null, l = "") => We({ moment: "pastime", free: e > 0, room: e, lasted: t, voice: o, has: r, memory: n, now: s, tally: i, ball: l }, a), Uv = (e, t, n, s, a, o = 0) => We({ moment: "jump", high: e > qv * t, memory: s, now: a, room: o }, n).name === "backflip", zv = { work: ["building"], idle: ["standing"] };
function e4(e, t, n, s) {
  const a = sa[e], o = [...t ? [{ beat: "typing", time: s }] : [], ...(zv[a] ?? []).map((r) => ({ beat: r, time: s }))];
  return e === "thinking" && o.push({ beat: "pondering", time: s, during: "thinking" }), xi.has(e) ? { moments: o, began: n || s } : (n && s - n >= Pv && o.push({ beat: "work_done", time: s }), { moments: o, began: 0 });
}
function Vv(e, t, n) {
  return !We({ moment: "pondering", memory: e, now: t }, n) || !We({ moment: "thought_cloud", memory: e, now: t }, n) ? null : We({ moment: "light_bulb", memory: e, now: t }, n) ? "ponder" : "think_cloud";
}
const Bo = { pondering: Vv };
function t4(e, t, n, s, a, o) {
  if (Bo[e.beat]) {
    const i = Bo[e.beat](n.reacted, s, a);
    return i && o(i) ? { beat: { clip: i, card: "", ...e.during && { during: e.during } } } : null;
  }
  const r = Wv(e.beat, n.reacted, s, a, t, o, n.tally);
  return r != null && r.look ? { look: r.look } : r != null && r.gaze && e.card ? { gaze: { card: e.card } } : r != null && r.clip ? { beat: { clip: r.clip, card: r.toward === "card" && e.card || "", ...e.card ? { mark: e.card } : {}, ...r.onto && e.card ? { onto: !0 } : {}, ...r.holds && { holds: !0 }, ...r.lifetime !== Aa && { lifetime: r.lifetime } } } : null;
}
function n4(e, t, n, s, a, o, r = null) {
  if (!(e.place.posture !== "hang" && !e.place.swings && !e.beats && !e.held && !e.arriving && !e.leaving && !e.moving)) return null;
  const l = Hv(e.room ?? 0, t.lasted, n, s, a, e.voice, o, r, e.ball);
  return l && { clip: l.name, card: "", flies: !!l.flies };
}
const s4 = (e, t) => {
  var n;
  return !!t && ((n = e[0]) == null ? void 0 : n.clip) === t && !!e[0].holds;
};
function a4(e, t, n) {
  var a;
  return !!n && ((a = e[0]) == null ? void 0 : a.clip) === n ? [e[0], t, ...e.slice(1)] : [t, ...e];
}
function o4(e, t) {
  const n = e.findIndex((s) => s.clip === t);
  return n < 0 ? e : [...e.slice(0, n), ...e.slice(n + 1)];
}
const r4 = (e, t) => !!(e != null && e.watches) && !t.once, i4 = 10, l4 = (e, t, n) => e.filter((s, a) => a === 0 && s.clip === t || !s.queuedAt || bv(s, s.queuedAt, n)), c4 = (e, t) => t ? null : e[0] ?? null;
function u4(e, t, n) {
  var a;
  const s = e.filter((o) => !o.during || o.during === t);
  return { beats: s, cut: !!n && ((a = e[0]) == null ? void 0 : a.clip) === n && s[0] !== e[0] };
}
const d4 = (e, t) => !t.during || !e.some((n) => n.during === t.during), Gv = 2 * Math.PI, Kv = 500;
function h4(e, t, n, s, a = null, o = 1) {
  const r = s - (e.at || s), i = r / Kv, l = t && e.point && !!t.behind != !!e.point.behind, u = l && e.amount > 0, d = t && !u ? o : 0, f = e.amount < d ? Math.min(e.amount + i, d) : Math.max(e.amount - i, d), p = Gv * r / 1e3, v = e.toward ? { ...e.point, x: n.x + e.toward.x, y: n.y + e.toward.y } : e.point, x = (u ? v : t != null && t.behind && t.mood === "reading" ? { ...t } : t && v && !l ? a && !t.behind && !v.behind ? Jv(v, t, n, p, a) : Xv(v, t, n, p) : t) ?? v, S = x != null && x.behind && x.mood === "reading" ? Yv(e.point, x, n, r, a) : x;
  return { point: S ?? null, toward: S ? { x: S.x - n.x, y: S.y - n.y } : null, amount: f, at: s };
}
function Yv(e, t, n, s, a) {
  const o = (k) => k * 180 / Math.PI, r = (k) => o(Math.atan2(Math.sin(k * Math.PI / 180), Math.cos(k * Math.PI / 180))), i = (a == null ? void 0 : a.facing) ?? 0, l = (a == null ? void 0 : a.depth) ?? 24, u = r(o(Math.atan2(t.x - n.x, -l)) - i), d = r(o(Math.atan2((t.readingCenter ?? t.x) - n.x, -l)) - i), f = (e == null ? void 0 : e.mood) === "reading" && Number.isFinite(e.readingYaw), p = f ? r(e.readingFacing - i) : 0, v = f ? e.readingYaw + p : d, M = v + r(u - v), x = Math.min(Math.max(s / 1e3, 0), 0.1), S = Oe.turnSpeed * x, T = f ? v + Math.min(Math.max(M - v, -S), S) : M, F = f ? e.readingFollow + p : T, Q = F + (T - F) * (1 - Math.exp(-x / Oe.followSeconds)), E = (a == null ? void 0 : a.tip) ?? { up: 25, down: 35 }, b = o(Ca(t.x - n.x, -l, n.y - t.y, (a == null ? void 0 : a.above) ?? 0).pitch), A = Math.min(Math.max(b, -E.up), E.down), y = Oe.tipSpeed * x, C = f ? e.readingPitch + Math.min(Math.max(A - e.readingPitch, -y), y) : A;
  return { ...t, readingYaw: T, readingFollow: Q, readingPitch: C, readingFacing: i };
}
function Jv(e, t, n, s, { depth: a, above: o, tip: r }) {
  const i = (F) => {
    const { yaw: Q, pitch: E } = Ca(F.x - n.x, a, n.y - F.y, o);
    return { yaw: Q, pitch: Math.min(Math.max(E, -r.up * Math.PI / 180), r.down * Math.PI / 180) };
  }, [l, u] = [Oo(i(e)), Oo(i(t))], d = Math.acos(Math.min(Math.max(l[0] * u[0] + l[1] * u[1] + l[2] * u[2], -1), 1));
  if (d <= s) return { ...t };
  const f = s / d, [p, v] = [Math.sin((1 - f) * d) / Math.sin(d), Math.sin(f * d) / Math.sin(d)], [M, x, S] = l.map((F, Q) => p * F + v * u[Q]), T = a * M / x;
  return { ...t, x: n.x + T, y: n.y - Bv(T, a, -Math.asin(Math.min(Math.max(S, -1), 1)), o) };
}
const Zv = 0.15;
function f4(e, t, n) {
  const s = Math.atan2(t.y - n.y, t.x - n.x) - Math.atan2(e.y - n.y, e.x - n.x);
  return Math.abs(Math.atan2(Math.sin(s), Math.cos(s))) <= Zv;
}
function Xv(e, t, n, s) {
  const a = Math.atan2(e.y - n.y, e.x - n.x), o = Math.atan2(t.y - n.y, t.x - n.x), r = Math.atan2(Math.sin(o - a), Math.cos(o - a)), i = a + Math.max(-s, Math.min(s, r)), l = Math.hypot(t.x - n.x, t.y - n.y);
  return { ...t, x: n.x + l * Math.cos(i), y: n.y + l * Math.sin(i) };
}
const Qv = (e) => !(e != null && e.on);
function m4(e, t, n) {
  if (Qv(e)) return { answer: [...t, ...n], held: [] };
  const s = [...t, ...n].filter((a, o, r) => r.findIndex((i) => i.beat === a.beat && i.card === a.card) === o);
  return { answer: [], held: s };
}
const an = { waits: 1.5, looks: 1, colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45, halo: 0.75 }, Je = { seconds: 2.4, flicker: [0, 0.6], flickers: 4, flash: [0.6, 0.9], fade: [1.95, 2.4], dim: 0.12, signs: { bad: "cross", good: "tick" } }, xs = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), Lo = (e) => e * e * (3 - 2 * e);
function ey(e) {
  if (e < 0 || e >= Je.seconds) return null;
  const t = xs(e, ...Je.flicker), n = Math.floor(t * Je.flickers * 2) % 2 === 0, s = e < Je.flicker[1] ? n ? 0.35 + 0.5 * t : Je.dim : 1;
  return { strength: 1 - Lo(xs(e, ...Je.fade)), lit: s, white: e < Je.flash[0] ? 0 : 1 - Lo(xs(e, ...Je.flash)) };
}
const p4 = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
};
function g4(e, t, n) {
  if (!e || e.at === null || n) return null;
  const s = ey(t - e.at);
  return s && { colour: an.colours[e.tone], eyes: 1, across: 0, open: 0, flash: 0, glow: 0, sign: { name: Je.signs[e.tone], ...s } };
}
function v4(e, t, n) {
  return e.length ? { tone: e.at(-1).tone, at: null, since: n, card: e.at(-1).card } : t;
}
function y4(e, t, n) {
  if (!e || e.at !== null) return e;
  const s = t ? e.facedAt ?? n : null;
  return s !== null && n - s >= an.looks || s === null && n - e.since >= an.waits ? { ...e, at: n } : { ...e, facedAt: s };
}
function k4(e, t) {
  const s = Math.floor(e * t * 2) * 137 % 360 / 360, a = (i) => (i + s * 12) % 12, o = (i) => 0.5 - 0.5 * Math.max(-1, Math.min(a(i) - 3, 9 - a(i), 1)), r = Math.min(e / 0.06, (1 - e) / 0.06, 1);
  return { colour: [o(0), o(8), o(4)], eyes: 1 - r, across: r, open: r, flash: 0, glow: r };
}
const it = { width: 24, height: 27, top: 3, units: 2, inside: 14 }, w4 = { behind: 39, figure: 40, ahead: 41 }, ty = "[data-figure-pile]", ny = { amber: [1, 0.69, 0.125], good: an.colours.good, bad: an.colours.bad }, Ln = { phases: 4, ms: 230, dim: 0.25 }, b4 = (e, t, n) => e !== "amber" || (t + n) % Ln.phases < Ln.phases / 2 ? 1 : Ln.dim, x4 = (e) => e === "amber" ? Ln.phases : 1;
function $4(e, t) {
  if (e.lit !== "amber") return e.lit;
  const n = e.run ? t.find((s) => s.card === e.run) : t.at(-1);
  return n ? n.tone : e.lit;
}
const M4 = Object.keys(ny), Ue = { least: 14, most: 20, middle: -10, start: [3, 9], reach: [26, 64], moveMs: [600, 1500], fadeMs: [500, 1400], spread: 1.75 }, Gt = ([e, t], n) => e + n() * (t - e);
function S4(e) {
  const t = Ue.least + Math.floor(e() * (Ue.most - Ue.least + 1));
  return Array.from({ length: Math.min(t, Ue.most) }, () => {
    const n = -Math.PI / 2 + (e() * 2 - 1) * Ue.spread, [s, a] = [Math.cos(n), Math.min(Math.sin(n), -0.1)], o = Gt(Ue.start, e), r = Gt(Ue.reach, e);
    return {
      text: We({ moment: "digit" }, e).name,
      x: s * o,
      y: Ue.middle + a * o,
      dx: s * r,
      dy: a * r,
      moveMs: Math.round(Gt(Ue.moveMs, e)),
      fadeMs: Math.round(Gt(Ue.fadeMs, e))
    };
  });
}
const $s = { high: 3, gap: 1 };
function _4(e) {
  const t = Math.floor(e / $s.high);
  return { left: -(it.inside + it.width / 2 + t * (it.width + $s.gap)), up: e % $s.high * (it.height - it.top) };
}
const sy = (e, t, n) => We({ moment: "unit", memory: e, now: t }, n) !== null, ay = { after: 5 }, oy = (e) => e.filter((t) => t.active && (t.process || t.watch) && new bi(t).isBuild());
function E4(e, t, n) {
  const s = oy(e).sort((o, r) => Number(o.time) - Number(r.time))[0], a = s ? { card: s.key, since: Number(s.time) } : t;
  return a && n - a.since >= ay.after ? a : null;
}
function A4(e, t, n, s, a) {
  const o = !!(e && t && e.card === t.card);
  return e != null && e.granted && !o && n.set("unit", s), t ? o && e.granted ? e : { card: t.card, granted: sy(n, s, a) } : null;
}
const No = { ahead: 140, up: 70 };
function C4(e, t, n, s, a) {
  const o = e.find((r) => r.state !== "piled");
  return (o == null ? void 0 : o.state) === "built" ? { at: { x: n(o) + a * No.ahead, y: s - No.up } } : o ? { at: { x: n(o), y: s - o.up - it.height } } : t ? { at: null } : null;
}
const Ms = { least: 4e3, most: 1e4 }, ry = (e) => Ms.least + e() * (Ms.most - Ms.least), kt = { chance: 0.25, at: [0.25, 0.6], ms: 5e3, most: 2 };
function O4(e, t) {
  const n = [];
  let s = 0;
  for (; ; ) {
    const a = ry(t);
    if (n.length >= kt.most || t() >= kt.chance) return { began: e, until: e + s + a, inspects: n };
    const o = s + a * (kt.at[0] + t() * (kt.at[1] - kt.at[0]));
    n.push({ from: o, to: o + kt.ms }), s = o + kt.ms;
  }
}
const T4 = (e, t) => e.inspects.some((n) => t >= e.began + n.from && t < e.began + n.to), I4 = (e, t, n) => Math.max(Math.floor(e / t - n) + 1, 0), Ei = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]), R4 = new Set(es.filter((e) => Ei.has(e.when.moment) && e.kind === "clip").map((e) => e.name)), iy = (e) => e.some((t) => t.state === "built"), B4 = (e, t) => iy(t) ? e.filter((n) => !Ei.has(n.beat)) : e, dt = { reach: 40, room: 6 }, ly = (e, t) => t <= e - dt.reach + 2, L4 = (e, t, n) => ly(e, n) ? t - dt.reach : e - dt.reach - dt.room, N4 = (e, t, n, s) => s > 0 && t < e && t + dt.reach >= e - 2 ? Math.min(n, Math.max(e, t + dt.reach)) : e, Ss = { short: [0.4, 1.6], long: [2, 4], longShare: 0.25 }, D4 = (e) => Gt(e() < Ss.longShare ? Ss.long : Ss.short, e), cy = 2 * it.width;
function P4(e, t, n, s) {
  const a = Math.max(t - e, 1), o = e + s() * a;
  return n === null || Math.abs(o - n) >= cy ? o : e + (o - e + a / 2) % a;
}
const uy = 60, j4 = (e, t, n, s) => e.length > 0 && e.every((a) => a.state === "piled") && !t && n !== null && s - n >= uy, Do = "[data-figure-home]", gn = () => {
  var t;
  const e = document.querySelector(Do);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(Do)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, dy = "[data-figure-docked-bars]", hy = "[data-figure-chat-foot]", fy = [0.85, 0.6, 0.35, 0.15], my = ["question", "waiting", "suggestion"], q4 = (e, t) => my.find((n) => e[n] > 0 && t[n] === "behind") || null;
function F4() {
  const e = {};
  for (const t of document.querySelectorAll("[data-tab]")) {
    const n = t.getAttribute("aria-selected") === "true";
    e[t.dataset.tab] = n || e[t.dataset.tab] === "front" ? "front" : "behind";
  }
  return e;
}
const py = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", gy = "[data-figure-newest]";
function Ai() {
  var s, a;
  const e = (s = gn()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(gy), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
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
function on(e, t, n = Ai()) {
  if (!e || !n) return !0;
  const s = st(e, t), a = ns(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ce.top * t.size, bottom: s.top + Ce.bottom * t.size }, r = bt.gap;
  return !ts(o, { left: n.left - r, right: n.right + r, top: n.top - r, bottom: n.bottom + r });
}
function W4(e, t, n, s = Ai()) {
  if (!s || on(t, e, s)) return null;
  const a = ns(t), o = (0.5 - Math.min(a.left, 0.27)) * e.size, r = (Math.max(a.right, 0.73) - 0.5) * e.size, i = St(), l = t.posture === "stand" ? Ia * e.size : Ni * e.size, u = Math.max(n.left + l, i.left + o), d = Math.min(n.right - l, i.right - r);
  return [s.left - bt.gap - r, s.right + bt.gap + o].map((p) => ({ ...t, x: p })).filter((p) => p.x >= u && p.x <= d && on(p, e, s) && zy(p, e)).sort((p, v) => Math.abs(p.x - t.x) - Math.abs(v.x - t.x))[0] ?? null;
}
const _s = 0.26, Ci = 0.54, vy = 1.25 / 5.4, vn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: _s, travels: "stand" },
  lounge: { drop: _s, travels: "stand" },
  composed: { drop: _s, travels: "stand" },
  hang: { drop: Ci, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, H4 = (e, t, n) => ({
  x: 0.5 + (e === "l" ? 1 : -1) * vy * Math.cos(t * Math.PI / 180),
  y: 1 - n - Ci
}), Kt = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), yy = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), U4 = (e, t) => (e === "sit" ? yy.has(t) : Kt.has(e)) ? e : "stand";
function z4(e, t) {
  return e.facing === t.facing || !Kt.has(e.posture) && !Kt.has(t.posture) ? t : { posture: "stand", facing: Kt.has(e.posture) ? e.facing : t.facing };
}
const V4 = 0.25, G4 = (e, t) => Kt.has(e) && vn[t].drop === 0, Oi = 2, ky = 90, wy = 180, by = 140, xy = 280, $y = 420, My = 0.25, Sy = 290, _y = 600, Ey = "cubic-bezier(0.2, 0.7, 0.4, 1)", Ay = "cubic-bezier(0.55, 0, 0.9, 0.6)", Es = 5;
function Hn(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: r = !1, sprinting: i = !1, random: l = Math.random, memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < Es) return null;
  (r || i) && (o = Math.max(o, Oi));
  const v = o > 1, M = Math.abs(t.x - e.x), x = M < Es ? 0 : M / (ky * o) * 1e3, S = Math.min(x, v ? by : wy), T = Math.abs(t.y - e.y), F = t.y < e.y, Q = F && !p && Uv(T, n, l, u, d, f), E = F ? $y + Math.min(T, 400) * My : Math.sqrt(2 * T / Ea) * 1e3, b = {
    x: t.x,
    y: t.y,
    ms: T > Es ? Q ? _y : E : 0,
    lead: Q ? Sy : F ? xy : 0,
    easing: F ? Ey : Ay,
    hopping: !0,
    clip: Q ? "backflip" : F ? "jump" : "fall"
  }, A = { x: t.x, y: t.y, ms: x + S, lead: 0, easing: "linear", ramp: S, ...v ? { clip: "run" } : {} }, y = p ? Cy(t, n) : b, C = F && !s ? [{ ...A, y: e.y }, y] : [{ ...b, x: e.x }, A];
  return { way: Math.sign(t.x - e.x) || 1, legs: C, lands: !a, pace: o, running: v };
}
const Cy = (e, t) => ({ x: e.x, y: e.y, ms: Me.pogo.frames / Me.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), Oy = (e, t) => e.postures.includes(t) ? t : e.postures[0], K4 = (e, t, n) => e.posture === "walk" && n ? "walk" : Oy(e.clip, t), st = (e, { size: t, below: n }, s = e.posture) => {
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
const An = 0.5, Po = 20;
function Y4(e, t, n = St()) {
  const s = st(e, t);
  return s.left >= n.left + Po && s.right <= n.right - Po;
}
function Ta(e, t, n = St()) {
  const s = st(e, t), a = s.right - s.left, o = ns(e), [r, i] = [s.left + o.left * a, s.left + o.right * a], l = e.posture === "hang" ? s.bottom : e.y;
  return r >= n.left - An && i <= n.right + An && s.top >= n.top - An && l <= n.bottom + An;
}
const Un = [0.35, 0.5, 0.65], zn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ce = { left: Un[0], right: Un.at(-1), top: zn[0], bottom: zn.at(-1) }, Ty = 0.24;
function ns(e) {
  if (e.posture === "stand") return { left: Ce.left, right: Ce.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + Ty * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ce.left, t), right: Math.max(Ce.right, t) };
}
function Iy(e, { size: t }, n = St()) {
  const s = ns(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const Ia = (Ce.right - Ce.left) / 2 + 0.08;
function J4(e, t) {
  return e === "hang" ? Ce : { ...Ce, bottom: Math.min(Ce.bottom, 1 - t - vn[e].drop) };
}
const Ry = "[data-figure-agent]";
function Ti(e, t, n = "", s = "") {
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
const Ii = (e) => zn.flatMap(
  (t) => Un.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function Ra(e, t, n = "") {
  if (!on(e, t)) return Un.length * zn.length;
  const s = st(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(py)].map((i) => ({ control: i, rect: i.getBoundingClientRect() })).filter(({ control: i, rect: l }) => l.width && l.height && ts(a, l) && Oa(i)).map(({ rect: i }) => i), r = (i, l) => o.some((u) => i >= u.left && i <= u.right && l >= u.top && l <= u.bottom);
  return Ii(a).filter(([i, l]) => r(i, l) || Ti(i, l, n)).length;
}
function By(e, t) {
  const n = st(e, t);
  return Ii({ ...n, bottom: Math.min(n.bottom, e.y) }).filter(([s, a]) => Ti(s, a, "", Ry)).length;
}
const jo = 4;
function Z4(e, t, n) {
  const s = e.size / 2, a = Math.max(t.x - n.left, n.right - t.x);
  for (let o = jo; o <= a; o += jo)
    for (const r of [t.x - o, t.x + o]) {
      if (r - s < n.left || r + s > n.right) continue;
      const i = { ...t, x: r };
      if (!By(i, e) && on(i, e)) return i;
    }
  return null;
}
function rn(e, t, n) {
  const s = St(), a = (r) => n ? Math.hypot(r.x - n.x, r.y - n.y) : 0, o = e.filter((r) => Ta(r, t, s) && on(r, t)).map((r) => ({ spot: r, covered: Ra(r, t), away: a(r) }));
  return o.length ? o.reduce(
    (r, i) => i.covered < r.covered || i.covered === r.covered && i.away < r.away ? i : r
  ).spot : null;
}
const Ri = (e, t) => t.map((n) => ({ x: e.left + e.width * n, y: e.top, posture: "stand" })), Ly = [0.5, 0.25, 0.75], Ny = (e) => Ri(e.getBoundingClientRect(), Ly), Bi = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, Dy = Ia, Py = (e, t, { size: n }, s = Dy) => Li(e, Bi[t], s * n, "stand");
function Li(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const jy = {
  right: { along: 1, inboard: -1, face: 70 },
  left: { along: 0, inboard: 1, face: 290 }
}, Ni = 0.1, qy = (e, t, { size: n }) => Li(e, jy[t], Ni * n, "sit"), Fy = (e) => ((e + 180) % 360 + 360) % 360 - 180, As = 60;
function X4(e, t) {
  const n = Fy(t);
  return !e.aside || Math.abs(n) >= As ? t : n < 0 ? 360 - As : As;
}
const Yt = { every: [8, 20], seconds: 1.2, turns: [-20, -10, 0, 10, 20] }, Wy = (e) => [.../* @__PURE__ */ new Set([e, ...Yt.turns.map((t) => (t + 360) % 360)])];
function Q4(e, t, n, s) {
  const a = (e == null ? void 0 : e.face) === t;
  if (a && n < e.next) return e;
  const o = Wy(t), r = Yt.every[0] + s() * (Yt.every[1] - Yt.every[0]);
  return { face: t, from: a ? Hy(e, n) : t, to: o[Math.floor(s() * o.length)], since: n, next: n + r };
}
function Hy(e, t) {
  const n = Math.min(1, Math.max(0, (t - e.since) / Yt.seconds)), s = ((e.to - e.from + 180) % 360 + 360) % 360 - 180;
  return (e.from + s * n * n * (3 - 2 * n) + 360) % 360;
}
function ex(e, t) {
  const { element: n, edge: s } = ss(), a = ["left", "right"].map((i) => yn(qy(s, i, e), e)).filter((i) => n && Ta(i, e) && !Ra(i, e)), o = (i) => t ? Math.abs(i.x - t.x) : 0, r = a.sort((i, l) => o(i) - o(l))[0];
  return r ? { ...r, view: null, on: n } : null;
}
function tx(e, t, { size: n }) {
  const s = (Ce.right - Ce.left) / 2 * n;
  return t && e.posture === "stand" && Math.abs(e.y - t.top) < 1 && e.x + s > t.left && e.x - s < t.right ? { ...e, x: t.left - s - Di } : e;
}
const Di = 7;
function Pi() {
  const e = [...document.querySelectorAll(ty)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
function Uy(e, t) {
  const n = st(e, t), s = n.right - n.left;
  return { left: n.left + Ce.left * s, right: n.left + Ce.right * s, top: n.top + Ce.top * s, bottom: n.bottom };
}
function zy(e, t) {
  const n = Pi();
  return !n || !ts(Uy(e, t), n);
}
const Vy = 4;
function ss() {
  const e = kn(), t = Pi(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > Vy || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - Di - n, 0) } };
}
const nx = ({ size: e, below: t }) => (1 - t) * e;
function yn(e, t) {
  const n = St(), { size: s, below: a } = t, o = vn[e.posture].drop * s;
  return { ...Iy(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const oa = (e, t) => Object.keys(Bi).map((n) => yn(Py(e, n, t), t)), Ba = (e, t) => Ri(e, fy).map((n) => yn(n, t)), ji = (e, t, n) => rn(e, t, n) ?? e[0];
function sx(e, t) {
  const { element: n, edge: s } = ss();
  return { ...ji(oa(s, e), e, t), view: null, on: n };
}
function ax(e, t, n, s) {
  const { element: a, edge: o } = ss(), r = (s ? oa(o, t) : [...oa(o, t), ...Ba(o, t)]).filter(
    (u) => !ts(st(u, t), e)
  ), i = rn(
    r.filter((u) => u.x > (e.left + e.right) / 2),
    t,
    n
  ), l = i && !Ra(i, t) ? i : rn(r, t, n);
  return l && { ...l, view: null, on: a };
}
function kn() {
  var s;
  const e = gn(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(dy);
  if (!t) return { ...as(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
const qo = { within: 2 };
function ox(e) {
  const { element: t, docked: n, edge: s } = kn();
  if (!n || e.on !== t) return !0;
  const a = as().edge;
  return s.left > a.left + qo.within || s.left + s.width < a.left + a.width - qo.within;
}
const Gy = "[data-figure-closing]";
function rx() {
  var n;
  const { element: e, docked: t } = kn();
  return t && !!((n = e.firstElementChild) != null && n.matches(Gy));
}
const qi = "[data-figure-progress]";
function ix(e) {
  const t = e.querySelector(qi);
  if (!t) return null;
  const n = t.getBoundingClientRect();
  return { x: n.right, y: n.top + n.height / 2 };
}
function lx(e, t, n) {
  const s = [e && { x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }, t && { x: Math.min(Math.max(n.x, t.left), t.right), y: (t.top + t.bottom) / 2 }].filter(Boolean), a = (o) => Math.hypot(o.x - n.x, o.y - n.y);
  return s.length ? s.reduce((o, r) => a(r) < a(o) ? r : o) : null;
}
const Ky = { across: 300, above: 380, below: 60 };
function cx(e) {
  const { across: t, above: n, below: s } = Ky;
  return [...document.querySelectorAll("[data-figure-picture]")].map((a) => ({ element: a, at: Yy(a.getBoundingClientRect()) })).filter(({ at: a }) => Math.abs(a.x - e.x) <= t && a.y >= e.y - n && a.y <= e.y + s).sort((a, o) => Math.hypot(a.at.x - e.x, a.at.y - e.y) - Math.hypot(o.at.x - e.x, o.at.y - e.y)).map(({ element: a }) => a);
}
const Yy = (e) => ({ x: (e.left + e.right) / 2, y: (e.top + e.bottom) / 2 }), Fi = "[data-figure-bar]", ra = { back: 144, along: 0.4 };
function ux(e) {
  const { element: t, docked: n, edge: s } = kn(), a = n ? t.querySelector(Fi) : null;
  if (!(a != null && a.querySelector(qi))) return null;
  const o = a.getBoundingClientRect().right;
  return { ...yn({ x: o - ra.back, y: s.top, face: 0, posture: "stand" }, e), view: null, on: t };
}
function dx(e, t, n, s) {
  return { x: Math.abs(e.x - t.x) < ra.along * s.size ? t.x + ra.along * s.size : e.x, y: e.y, behind: !0 };
}
function hx(e) {
  const t = e.querySelector(Fi), n = t == null ? void 0 : t.firstElementChild;
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
function fx(e, t, { x: n = null, beside: s = 0, before: a = 1 / 0, aim: o = null } = {}) {
  const { element: r, edge: i } = as(), l = n === null ? Jy(i, e, o === null ? t : { x: o, y: i.top }, s, a) : yn({ x: n, y: i.top, posture: "stand" }, e);
  return l && { ...l, view: null, on: r, stays: !0 };
}
function Jy(e, t, n, s, a) {
  const o = Ba(e, t), r = Math.min(...o.map((l) => l.x)), i = o.filter((l) => l.x + s + it.width < a && l.x + s - dt.reach - dt.room >= r);
  return rn(i.length ? i : o, t, n);
}
const Zy = { lean: 22, steepest: 38, most: 1.6, over: 0.3, within: 6, climb: 90, rung: 11 };
function mx(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: r = !1, random: i = Math.random, via: l = [], memory: u = null, now: d = 0, room: f = 0, pogo: p = !1 } = {}) {
  (o || r) && (a = Math.max(a, Oi));
  const v = (Q) => {
    const E = st(Q, n, vn[Q.posture].travels);
    return { x: E.left, y: E.top };
  }, M = t.ladder ?? e.ladder;
  if (M && !(t.ladder && e.ladder)) return Xy(v(e), v(t), v({ ...M.foot, posture: "stand" }), M.way, !!t.ladder, n, a);
  const [x, ...S] = [e, ...l, t].map(v), T = Hn(x, S[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: r, random: i, memory: u, now: d, room: f, pogo: p }), F = S.slice(1).map((Q, E) => {
    var b;
    return (b = Hn(S[E], Q, n.size, { random: i, memory: u, now: d, room: f })) == null ? void 0 : b.legs.find((A) => A.hopping);
  });
  return T && { ...T, legs: [...T.legs, ...F.filter(Boolean)] };
}
function Xy(e, t, n, s, a, o, r) {
  const i = (d, f) => ({ x: f.x, y: f.y, ms: Math.hypot(f.x - d.x, f.y - d.y) / Zy.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), l = a ? Hn(e, n, o.size, { pace: r }) : Hn(n, t, o.size, { pace: r }), u = a ? [...(l == null ? void 0 : l.legs) ?? [], i(n, t)] : [i(e, n), ...(l == null ? void 0 : l.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: u, lands: !1, pace: r, running: r > 1 };
}
function px(e, t) {
  const n = e && document.querySelector(`[data-figure-mark="${CSS.escape(e)}"]`);
  if (!n) return 0;
  const s = n.getBoundingClientRect();
  return s.left + s.width / 2 > t ? 90 : 270;
}
function gx(e, t, n) {
  if (e) {
    const o = document.querySelector(`[data-tab="${CSS.escape(e)}"]`), r = o && rn(Ny(o), t, n);
    return r ? { ...r, view: e, on: o } : null;
  }
  const { element: s, edge: a } = ss();
  return { ...ji(Ba(a, t), t, n), view: null, on: s };
}
const Qy = "[data-figure-bubble]", ek = 250;
let Jt = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Wi = 0;
const qt = () => Jt, Cs = /* @__PURE__ */ new WeakMap();
let tk = 0;
function La(e) {
  return Cs.has(e) || Cs.set(e, `floor-${++tk}`), Cs.get(e);
}
const nk = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, sk = () => {
  var e, t;
  return ((t = (e = gn()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function ak(e, t) {
  var s;
  const n = (s = e.querySelector(hy)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function ok(e, t) {
  const n = e && ak(e, t), s = e ? [...e.querySelectorAll(Qy)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: r }) => ({ element: o, kind: r, box: o.getBoundingClientRect() })).filter(({ kind: o, box: r }) => r.width > 0 && r.height > 0 && (o !== "bubble" || nk(r, n))).map(({ element: o, kind: r, box: i }) => ({ id: La(o), kind: r, element: o, left: i.left, right: i.right, top: i.top, bottom: i.bottom }));
}
const rk = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= ek ? (t.top - s.top) / a * 1e3 : 0;
};
function Hi(e = Jt, t = performance.now()) {
  const n = St(), s = sk(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: r, edge: i } = kn(), l = [];
  o && l.push({ id: "home", kind: r ? "dock" : "compose", element: o, left: i.left, right: i.left + i.width, top: i.top });
  const u = as();
  return u.element && l.push({ id: La(u.element), kind: "build", element: u.element, left: u.edge.left, right: u.edge.left + u.edge.width, top: u.edge.top }), l.push(...ok(s, a)), l.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(l.map((d) => Object.freeze({ ...d, vy: rk(e, d, t) }))) });
}
const ia = /* @__PURE__ */ new Set();
function ik(e) {
  return ia.add(e), () => ia.delete(e);
}
function lk() {
  Ui();
  const e = () => {
    Wi = requestAnimationFrame(e), !document.hidden && (Jt = Hi(Jt), ia.forEach((t) => t(Jt)));
  };
  e();
}
function Ui() {
  cancelAnimationFrame(Wi);
}
const Na = 5, ck = 56, uk = { share: 0.6 }, dk = (e) => -Math.sqrt(2 * Ea * uk.share * e), Lt = (e, t) => e.find((n) => n.id === t) ?? null;
function vx(e, t = Hi().floors) {
  const n = Lt(t, "home"), s = (n == null ? void 0 : n.kind) === "dock", a = e.on ? e.on === (n == null ? void 0 : n.element) && s && !e.stays ? "home" : La(e.on) : null, o = a && Lt(t, a);
  return o ? { id: a, dx: e.x - o.left, dy: e.y - o.top, posture: e.posture, face: e.face, swings: !!e.swings, home: a === "home" } : null;
}
function zi({ id: e, dx: t, dy: n, posture: s, face: a, swings: o, home: r }, i, l = qt().floors) {
  const u = Lt(l, e);
  if (!u) return null;
  const d = { x: u.left + t, y: u.top + n, posture: s, face: a };
  return (r || hk(u, d, o)) && fk(d, i, l) ? { x: d.x, y: d.y } : null;
}
const Da = ({ posture: e, swings: t, ladder: n }) => (e === "stand" || e === "sit") && !t && !n, hk = (e, t, n) => !Da({ posture: t.posture, swings: n }) || t.x >= e.left && t.x <= e.right;
function yx(e, t = qt().floors) {
  if (!Da(e)) return null;
  const n = t.find((s) => Math.abs(s.top - e.y) <= Na && e.x >= s.left && e.x <= s.right);
  return n ? { id: n.id, dx: e.x - n.left, dy: 0, posture: e.posture, face: e.face, home: n.id === "home" } : null;
}
function fk(e, t, n = qt().floors) {
  const s = Lt(n, "home");
  return e.posture === "hang" && s && st(e, t).bottom >= s.top ? !1 : Ta(e, t);
}
function kx(e, t, n, s = qt().floors) {
  const a = zi(e, n, s);
  if (!e.home) return mk(e, t, a, s);
  if (!a) return null;
  const o = Lt(s, "home"), r = a.y - t.y, i = r > Na ? "dropping" : -r > ck ? "launched" : "carried";
  return { spot: { ...t, y: a.y }, footing: { ...e, dx: t.x - o.left }, motion: i };
}
function mk(e, t, n, s) {
  const a = n ? Lt(s, e.id).vy : 0, o = !!n && a <= -200 && !t.swings;
  if (!o && e.fast) return { spot: n ? { ...t, ...n } : t, footing: { ...e, risen: 0, fast: !1 }, motion: "flung", speed: dk(e.risen) };
  if (!n) return null;
  if (Da(t) && n.y - t.y > Na) return { spot: { ...t, ...n }, footing: e, motion: "dropping" };
  const r = o ? { risen: (e.risen ?? 0) + Math.max(t.y - n.y, 0), fast: !!e.fast || a <= -1500 } : { risen: 0, fast: !1 };
  return { spot: { ...t, ...n }, footing: { ...e, ...r }, motion: "carried" };
}
function wx(e, t, n) {
  const s = Ia * n.size, a = e.posture === "stand" && !e.ladder && e.on ? t.find((o) => o.element === e.on) : null;
  return !a || a.right - a.left < 2 * s ? e : { ...e, x: Math.min(Math.max(e.x, a.left + s), a.right - s) };
}
function bx(e, t, n, s = qt().floors) {
  const a = t && zi(t, n, s);
  return a ? { ...e, ...a } : e;
}
const pk = ["data-kind"], gk = { class: "figure-floor-name" }, vk = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (c(), h("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: fe({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      g("span", gk, $(e.floor.kind), 1)
    ], 12, pk));
  }
}, yk = /* @__PURE__ */ Y(vk, [["__scopeId", "data-v-8f6132da"]]), kk = {
  class: "figure-floors",
  "aria-hidden": "true"
}, wk = {
  __name: "FigureFloors",
  setup(e) {
    const t = Gn(qt().floors);
    let n = () => {
    };
    return Le(() => {
      n = ik((s) => t.value = s.floors), lk();
    }), Te(() => {
      n(), Ui();
    }), (s, a) => (c(), h("div", kk, [
      (c(!0), h(K, null, te(t.value, (o) => (c(), G(yk, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, xx = /* @__PURE__ */ Y(wk, [["__scopeId", "data-v-e519168b"]]), Os = (e) => typeof e == "number" ? e : Date.parse(e);
function $x(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: Os(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => Os(a.row.created_at) - Os(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const bk = 3, Ts = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function xk(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Ts[n.grouping]) == null ? void 0 : s.call(Ts, e.row, n)) || "";
}
function $k(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Mx(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= bk ? [$k(s, t)] : s), s = [];
  };
  for (const r of e) {
    const i = xk(r, t);
    i !== a && o(), a = i, i ? s.push(r) : n.push(r);
  }
  return o(), n;
}
const Mk = 1e3;
function Sk() {
  const e = I(Date.now()), t = setInterval(() => e.value = Date.now(), Mk);
  return Dt(() => clearInterval(t)), e;
}
const _k = ["datetime", "title"], os = {
  __name: "TimeAgo",
  props: { at: { type: [String, Number], default: "" } },
  setup(e) {
    const t = e, n = Sk(), s = N(() => new Date(typeof t.at == "number" ? t.at * 1e3 : t.at));
    return (a, o) => (c(), h("time", {
      datetime: typeof e.at == "number" ? s.value.toISOString() : e.at,
      title: e.at ? s.value.toLocaleString() : "",
      "data-time-ago": ""
    }, $(z(g1)(e.at, z(n))), 9, _k));
  }
};
function Ek(e, t, n = []) {
  return (n.length ? n.map((a) => e[a]).join(" ") : JSON.stringify(e)).toLowerCase().includes(t.trim().toLowerCase());
}
const Sx = (e) => (t) => t.filter((n) => n.id !== e), _x = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), Ex = (e) => (t) => [...t, e], Ax = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function Cx(e) {
  const t = jt(), n = I(null), s = I("");
  async function a(...o) {
    const r = await t.read(e(...o));
    s.value = r.ok ? "" : r.error, r.ok && (n.value = r.value);
  }
  return { value: n, failure: s, load: a };
}
function Ox(e) {
  const t = jt(), n = I("");
  async function s(a) {
    const o = await t.run(a);
    return n.value = o.ok ? "" : o.error, o.ok && await e(), o;
  }
  return { refusal: n, run: s };
}
const Cn = /* @__PURE__ */ new Map();
function Ak(e, t) {
  if (Cn.has(e)) return Cn.get(e);
  const n = t().finally(() => Cn.delete(e));
  return Cn.set(e, n), n;
}
function Tx() {
  const e = jt(), t = I(null), n = I("");
  async function s() {
    const a = await Ak(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Ck = { class: "cards-page" }, Ok = { class: "cards-bar" }, Tk = { class: "cards-count" }, Ik = { class: "cards" }, Rk = {
  key: 1,
  class: "cards-note"
}, Bk = {
  key: 2,
  class: "cards-note"
}, Lk = ["data-row", "onClick"], Nk = { class: "card-head" }, Dk = { class: "card-title" }, Pk = { class: "card-foot" }, jk = {
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
    return (s, a) => (c(), h("div", Ck, [
      g("div", Ok, [
        g("span", Tk, $(e.rows.length) + " " + $(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
        D(ye, tt({
          small: "",
          bordered: ""
        }, { [`data-${e.noun}-new`]: "" }, {
          onClick: a[0] || (a[0] = (o) => n("new"))
        }), {
          default: W(() => [
            D(ge, {
              name: "plus",
              size: 12
            }),
            oe(" New " + $(e.noun), 1)
          ]),
          _: 1
        }, 16)
      ]),
      g("div", Ik, [
        e.loaded ? e.failure ? (c(), h("p", Rk, $(e.failure), 1)) : e.rows.length ? O("", !0) : (c(), h("p", Bk, "No " + $(e.noun) + "s yet", 1)) : (c(), G(Pt, {
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
          g("span", Nk, [
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
          g("span", Dk, $(e.title(o)), 1),
          g("span", Pk, $(e.foot(o)), 1)
        ], 8, Lk))), 128))
      ]),
      he(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Ix = /* @__PURE__ */ Y(jk, [["__scopeId", "data-v-990e6b37"]]), Fo = "newest";
function Rx(e, { title: t, isOpen: n = null }) {
  var u;
  const s = (u = _e(Ae, null)) == null ? void 0 : u.search, a = I(""), o = I(Fo), r = I("all"), i = N(() => {
    const d = a.value.trim().toLowerCase(), f = e.value.filter((p) => Ek(p, d, s == null ? void 0 : s.fields) && (r.value === "all" || !n || n(p) === (r.value === "open")));
    return o.value === Fo ? f : [...f].sort((p, v) => t(p).localeCompare(t(v)));
  }), l = N(() => !!a.value.trim() || !!n && r.value !== "all");
  return { words: a, order: o, state: r, shown: i, filtering: l, hasStates: !!n };
}
const qk = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, Fk = 40, Wk = "top", Hk = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var f;
    const n = e, s = (f = _e(Ae, null)) == null ? void 0 : f.autoScroll, a = N(() => s === Wk), o = I(null), r = I(!1), i = (p) => a.value ? p.scrollTop : p.scrollHeight - p.scrollTop - p.clientHeight, l = () => a.value ? 0 : o.value.scrollHeight, u = () => o.value.scrollTo({ top: l(), behavior: "smooth" });
    function d() {
      r.value = i(o.value) >= Fk;
    }
    return pe(() => n.rowCount, async () => {
      await mt(), !r.value && o.value && (o.value.scrollTop = l());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (p, v) => (c(), h("div", qk, [
      g("div", {
        ref_key: "pane",
        ref: o,
        class: Z(["auto-scroll-pane", e.paneClass]),
        onScroll: d
      }, [
        he(p.$slots, "default", {}, void 0, !0)
      ], 34),
      D(Nt, {
        name: "auto-scroll-rise",
        persisted: ""
      }, {
        default: W(() => [
          ht(g("button", {
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
            [il, r.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Bx = /* @__PURE__ */ Y(Hk, [["__scopeId", "data-v-3accb764"]]), Uk = ["aria-selected", "data-tab", "onClick"], zk = {
  key: 0,
  class: "inner-tab-count",
  "data-tab-count": ""
}, Vk = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var f;
    const n = e, s = t, a = ((f = _e(Ae, null)) == null ? void 0 : f.tabs) ?? [], o = I(null), r = I({ left: 0, width: 0, slides: !1 }), i = (p) => n.answer[p.count_field] !== void 0;
    function l(p) {
      var M;
      const v = (M = o.value) == null ? void 0 : M.querySelector(".inner-tab.on");
      if (!v) return void (r.value = { left: 0, width: 0, slides: !1 });
      r.value = { left: v.offsetLeft, width: v.offsetWidth, slides: p }, o.value.scrollWidth > o.value.clientWidth && (o.value.scrollLeft = Math.max(0, v.offsetLeft - 12));
    }
    const u = () => mt(() => l(!0));
    let d = null;
    return Le(() => {
      var p;
      l(!1), d = new ResizeObserver(() => l(!1)), d.observe(o.value), (p = document.fonts) == null || p.ready.then(() => l(!1));
    }), Te(() => d == null ? void 0 : d.disconnect()), pe(() => {
      var p;
      return (p = n.active) == null ? void 0 : p.key;
    }, u), pe(() => n.answer, u, { deep: !0 }), (p, v) => (c(), h("div", {
      ref_key: "band",
      ref: o,
      class: "inner-tabs",
      role: "tablist",
      "data-inner-tabs": ""
    }, [
      (c(!0), h(K, null, te(z(a), (M) => {
        var x, S;
        return c(), h("button", {
          key: M.key,
          type: "button",
          role: "tab",
          class: Z(["inner-tab", { on: ((x = e.active) == null ? void 0 : x.key) === M.key }]),
          "aria-selected": ((S = e.active) == null ? void 0 : S.key) === M.key,
          "data-tab": M.key,
          onClick: (T) => s("choose", M)
        }, [
          oe($(M.label) + " ", 1),
          i(M) ? (c(), h("span", zk, $(e.answer[M.count_field]), 1)) : O("", !0)
        ], 10, Uk);
      }), 128)),
      g("i", {
        class: Z(["inner-tabs-line", { slides: r.value.slides }]),
        style: fe({ left: `${r.value.left}px`, width: `${r.value.width}px` }),
        "data-tabs-line": ""
      }, null, 6)
    ], 512));
  }
}, Lx = /* @__PURE__ */ Y(Vk, [["__scopeId", "data-v-46fc6186"]]), Gk = {}, Kk = { class: "menu-label" };
function Yk(e, t) {
  return c(), h("span", Kk, [
    he(e.$slots, "default", {}, void 0, !0)
  ]);
}
const la = /* @__PURE__ */ Y(Gk, [["render", Yk], ["__scopeId", "data-v-aa955b3e"]]), Jk = {
  class: "search-bar",
  "data-search-bar": ""
}, Zk = { class: "search-bar-control" }, Xk = ["value", "placeholder", "aria-label"], Qk = ["aria-expanded"], ew = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var T;
    const s = e, a = n, o = ll(), r = ((T = _e(Ae, null)) == null ? void 0 : T.search) ?? {}, i = N(() => r.placeholder || s.placeholder), l = r.context ?? [], u = I(null), d = I(null), f = I([]), p = N(() => f.value.length ? f.value[f.value.length - 1].next : l), v = N(() => !!o.menu || l.length > 0), M = (F) => {
      f.value = [], d.value = d.value ? null : F.currentTarget;
    };
    function x(F) {
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
    } }), (F, Q) => {
      var E;
      return c(), h("div", Jk, [
        g("div", Zk, [
          D(ge, {
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
            onInput: Q[0] || (Q[0] = (b) => a("update:modelValue", b.target.value)),
            onKeydown: Zt(S, ["esc"])
          }, null, 40, Xk),
          e.modelValue ? (c(), h("button", {
            key: 0,
            type: "button",
            class: "search-bar-clear",
            "data-search-clear": "",
            "aria-label": "Clear the search",
            onClick: S
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
          ], 8, Qk)) : O("", !0)
        ]),
        (E = z(r).button) != null && E.title ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "search-bar-button",
          "data-search-button": "",
          onClick: Q[1] || (Q[1] = (b) => a("pick", z(r).button.click))
        }, $(z(r).button.title), 1)) : O("", !0),
        he(F.$slots, "default", {}, void 0, !0),
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
          default: W(() => [
            f.value.length ? (c(), G(Bt, {
              key: 0,
              "data-search-back": "",
              onClick: Q[2] || (Q[2] = (b) => f.value = f.value.slice(0, -1))
            }, {
              default: W(() => [
                oe("‹ " + $(f.value[f.value.length - 1].title), 1)
              ]),
              _: 1
            })) : O("", !0),
            (c(!0), h(K, null, te(p.value, (b) => (c(), G(Bt, {
              key: b.title,
              description: b.subtext,
              "data-search-entry": b.title,
              onClick: (A) => x(b)
            }, {
              default: W(() => [
                oe($(b.title) + $(b.next.length ? " ›" : ""), 1)
              ]),
              _: 2
            }, 1032, ["description", "data-search-entry", "onClick"]))), 128)),
            f.value.length ? O("", !0) : he(F.$slots, "menu", {}, void 0, !0, 1)
          ]),
          _: 3
        }, 8, ["anchor"])) : O("", !0)
      ]);
    };
  }
}, tw = /* @__PURE__ */ Y(ew, [["__scopeId", "data-v-43c4837e"]]), nw = {
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
    return (o, r) => (c(), G(tw, {
      modelValue: e.tools.words.value,
      "onUpdate:modelValue": r[0] || (r[0] = (i) => e.tools.words.value = i),
      class: "list-tools",
      placeholder: e.placeholder,
      "data-list-tools": "",
      "data-list-search": "",
      onPick: r[1] || (r[1] = (i) => n("pick", i))
    }, {
      menu: W(() => [
        D(la, null, {
          default: W(() => [...r[2] || (r[2] = [
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
          default: W(() => [
            oe($(i.label), 1)
          ]),
          _: 2
        }, 1032, ["checked", "data-list-order", "onClick"])), 64)),
        e.tools.hasStates ? (c(), h(K, { key: 0 }, [
          D(la, null, {
            default: W(() => [...r[3] || (r[3] = [
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
            default: W(() => [
              oe($(i.label), 1)
            ]),
            _: 2
          }, 1032, ["checked", "data-list-state", "onClick"])), 64))
        ], 64)) : O("", !0)
      ]),
      default: W(() => [
        he(o.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["modelValue", "placeholder"]));
  }
}, Nx = /* @__PURE__ */ Y(nw, [["__scopeId", "data-v-dab0064d"]]);
function Dx() {
  const e = I(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const Px = (e) => import(
  /* @vite-ignore */
  e
), sw = 86400, ca = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function aw(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((ca(t) - ca(e)) / sw);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function jx(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = ca(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: aw(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Is = 280, Rs = 240, Bs = 120, ow = 6, rw = 14, ln = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function iw(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Vi(e, t) {
  const n = Math.max(0, iw(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function lw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const r = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${rw}px)` }), e.offsetHeight, e.style.transition = `height ${Is}ms ${ln}`, e.style.height = `${r}px`;
  const i = a();
  let l = !1, u = !1;
  const d = () => {
    u || (u = !0, Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o());
  }, f = () => {
    if (u) return;
    n() && (t.scrollTop = Vi(t, e));
    const p = a() - i;
    if (!l && p >= Is && (l = !0, e.style.transition = `opacity ${Rs}ms ease-out, transform ${Rs}ms ${ln}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), p < Is + Rs) return s(f);
    d();
  };
  return s(f), d;
}
function qx(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${ow}px)` }), e.offsetHeight, e.style.transition = `opacity ${Bs}ms ease-out, transform ${Bs}ms ${ln}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const r = a(), i = () => {
    if (n() && (t.scrollTop = Vi(t, e)), a() - r < Bs) return s(i);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(i);
}
const cw = 140, On = 220, Wo = 5;
function Fx({ gap: e = cw, later: t = setTimeout } = {}) {
  const n = [], s = /* @__PURE__ */ new Set();
  let a = !1, o = 0, r = !1;
  function i(d, f) {
    s.add(d), d.cancel = d.arrival(d.el, d.options, () => {
      s.delete(d), d.done(), f();
    });
  }
  function l() {
    const d = n.splice(0, Wo);
    if (a = d.length > 0, !a) return;
    let f = d.length;
    for (const p of d)
      p.el.style.display = p.display, i(p, () => {
        f -= 1, f || (o = t(l, e));
      });
  }
  const u = (d, f, p, v = lw) => {
    if (r || !f.pane || !f.follows()) return p();
    const M = { el: d, options: f, done: p, arrival: v, display: d.style.display || "" };
    if (!a)
      return a = !0, i(M, () => o = t(l, e));
    d.style.display = "none", n.push(M), n.length >= Wo && u.flush();
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
function Wx(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${On}ms ${ln}, opacity ${On}ms ease-in, margin ${On}ms ${ln}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, On);
}
const Gi = "chat.pins.minimised", Nn = I(Xt(Gi, !1));
function Ho(e) {
  Nn.value = e, Kn(Gi, e);
}
function uw(e) {
  const t = N(() => e()), n = N(() => Nn.value ? [] : e()), s = () => Ho(!Nn.value), a = Date.now() / 1e3;
  return pe(
    () => t.value.filter((o) => xt(o) > a).length,
    (o, r) => o > r && Ho(!1)
  ), { pins: t, visible: n, minimised: Nn, toggle: s };
}
const dw = ["title"], hw = {
  key: 0,
  class: "pins-count"
}, fw = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = uw(() => t.pinRows);
    return (o, r) => z(n).length ? (c(), h("button", {
      key: 0,
      type: "button",
      class: Z(["pins-toggle", { minimised: z(s), inline: e.inline }]),
      title: z(s) ? "Show the pinned links" : "Shrink the pinned links to this corner",
      onClick: r[0] || (r[0] = be((...i) => z(a) && z(a)(...i), ["stop"]))
    }, [
      D(ge, {
        name: z(s) ? "pin" : "up",
        size: 12
      }, null, 8, ["name"]),
      z(s) ? (c(), h("span", hw, $(z(n).length), 1)) : O("", !0)
    ], 10, dw)) : O("", !0);
  }
}, Hx = /* @__PURE__ */ Y(fw, [["__scopeId", "data-v-d073c504"]]), mw = ["title"], pw = ["title"], gw = { class: "diff-card-dir" }, vw = { class: "diff-card-name" }, yw = ["title"], kw = ["title"], ww = {
  key: 0,
  class: "diff-card-note"
}, bw = ["href"], xw = ["src", "alt"], $w = { class: "diff-card-rows" }, Mw = { class: "diff-row-num" }, Sw = { class: "diff-row-sign" }, _w = { class: "diff-row-code" }, Ew = {
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
    function o(_) {
      (_.metaKey || _.ctrlKey) && (_.stopPropagation(), s("open", n.path));
    }
    const r = { new: "created", deleted: "deleted" }, i = { add: "+", del: "−" }, l = N(() => n.path.lastIndexOf("/") + 1), u = N(() => n.path.slice(0, l.value)), d = N(() => n.path.slice(l.value)), f = N(() => n.kind === "deleted"), p = N(() => r[n.kind]), v = N(() => new Set(n.rows.filter((_) => _.line_type === "add").map((_) => _.line))), M = I("after"), x = N(() => M.value === "before" ? n.whole.old : n.whole.text), S = N(() => n.whole && n.whole.text !== void 0 ? x.value.split(`
`).map((_, w) => ({ line_type: M.value === "after" && v.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: _ })) : n.rows.filter(
      (_) => !(n.editsOnly && ["ctx", "fold"].includes(_.line_type)) && !(n.hideRemovals && _.line_type === "del")
    )), T = I(!1), F = N(() => n.lines && !T.value && !n.whole), Q = N(() => F.value ? S.value.slice(0, n.lines) : S.value), E = N(() => S.value.length - Q.value.length), b = (_) => _.line === null || _.line_type === "del" ? "" : _.line, A = (_) => _.line_type === "fold" ? _.hidden ? `⋯ ${_.hidden} lines` : "⋯" : _.text, y = I(null), C = I(null);
    let k = null;
    return Le(() => {
      if (!C.value) return;
      let _ = !0;
      k = new ResizeObserver(() => {
        !y.value || !C.value || (y.value.style.transition = _ ? "none" : "", y.value.style.height = `${C.value.offsetHeight}px`, _ = !1);
      }), k.observe(C.value);
    }), Te(() => k && k.disconnect()), (_, w) => (c(), h("section", {
      class: Z(["diff-card", { half: e.half, gone: f.value, entering: e.entering, flush: e.flush, folded: e.folded, capped: e.capped }])
    }, [
      g("header", {
        class: "diff-card-head",
        title: f.value ? null : e.folded ? "Show the changes" : "Collapse this card",
        onClick: w[2] || (w[2] = (m) => !f.value && s("fold"))
      }, [
        g("span", {
          class: "diff-card-path",
          title: `${e.path} · ${z(a)}-click to open it`,
          onClick: o
        }, [
          g("span", gw, $(u.value), 1),
          g("span", vw, $(d.value), 1),
          p.value ? (c(), h("span", {
            key: 0,
            class: Z(["diff-card-badge", e.kind])
          }, $(p.value), 3)) : O("", !0)
        ], 8, pw),
        g("span", {
          class: Z(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + $(e.added), 3),
        g("span", {
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
          onClick: w[0] || (w[0] = be((m) => M.value = M.value === "after" ? "before" : "after", ["stop"]))
        }, $(M.value === "after" ? "After" : "Before"), 9, yw)) : O("", !0),
        f.value ? O("", !0) : (c(), h("button", {
          key: 1,
          type: "button",
          class: Z(["diff-card-whole", { on: e.whole }]),
          title: e.whole ? "Show only the changes" : "Show the whole file",
          onClick: w[1] || (w[1] = be((m) => s("whole"), ["stop"]))
        }, [
          D(ge, {
            name: "file",
            size: 12
          })
        ], 10, kw))
      ], 8, mw),
      e.whole && e.whole.error ? (c(), h("p", ww, $(e.whole.error), 1)) : O("", !0),
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
          }, null, 8, xw)
        ], 8, bw)) : (c(), h("div", {
          key: 1,
          ref_key: "grow",
          ref: y,
          class: "diff-card-grow"
        }, [
          g("div", {
            ref_key: "body",
            ref: C,
            class: "diff-card-diff"
          }, [
            g("div", $w, [
              (c(!0), h(K, null, te(Q.value, (m, R) => (c(), h("div", {
                key: R,
                class: Z(["diff-row", m.line_type, { fresh: e.fresh && m.edit === e.fresh }])
              }, [
                g("span", Mw, $(b(m)), 1),
                g("span", Sw, $(i[m.line_type]), 1),
                g("span", _w, $(A(m)), 1)
              ], 2))), 128)),
              E.value > 0 ? (c(), h("button", {
                key: 0,
                type: "button",
                class: "diff-card-more",
                onClick: w[3] || (w[3] = be((m) => T.value = !0, ["stop"]))
              }, $(E.value) + " more " + $(E.value === 1 ? "line" : "lines"), 1)) : O("", !0)
            ])
          ], 512)
        ], 512))
      ], 64)) : O("", !0)
    ], 2));
  }
}, Ux = /* @__PURE__ */ Y(Ew, [["__scopeId", "data-v-fed58c18"]]), Aw = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (c(), G(ye, {
      small: "",
      "aria-label": "Back",
      "data-resource-back": "",
      onClick: a[0] || (a[0] = (o) => n("back"))
    }, {
      default: W(() => [
        D(ge, {
          name: "back",
          size: 12
        })
      ]),
      _: 1
    }));
  }
}, Ze = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Cw = {
  draft: [{ word: "ready", label: "Mark ready" }, Ze],
  ready: [{ word: "approve", label: "Approve", main: !0 }, Ze],
  approved: [{ word: "start", label: "Start", main: !0 }, Ze],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, Ze],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, Ze],
  completed: [],
  cancelled: []
}, Ow = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "Resume after: task:12, question:4 or plan:3 (optional)" }, Ze],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What was the outcome?", main: !0 }, { word: "retest", label: "Back to work" }, Ze],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, Ze],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Tw = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], Iw = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing.", danger: !0 }
], Rw = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", main: !0, confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], Bw = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], Lw = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Needs no action", icon: "check", bordered: !0, flag: "--why", ask: "Why does it need no action?" }], Nw = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? Lw(t) : e === "agent" ? [...Rw(t), ...Iw(t)] : e === "check" ? Bw(t) : e === "question" ? Tw(t) : ((n = { plan: Cw, task: Ow }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, Dw = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, Pw = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, jw = { class: "ask-text" }, qw = ["placeholder", "aria-label"], Fw = ["placeholder", "aria-label"], Ww = {
  key: 3,
  class: "moves"
}, Hw = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = N(() => Nw(s.kind, s.row)), r = I(""), i = I(null), l = I(""), u = I("");
    pe(() => s.id, () => {
      r.value = "", i.value = null;
    });
    async function d(v, M = "") {
      const x = await s.read([v.noun ?? s.kind, v.word, String(s.id), ...v.flag ? [v.flag, M] : v.positional ? [M] : [], ...v.opener && u.value.trim() ? ["--on", u.value.trim()] : []]);
      r.value = x.ok ? "" : x.error, x.ok && (i.value = null, l.value = "", u.value = "", a("done"));
    }
    const f = (v) => v.confirm ? i.value = v : v.said ? d(v, v.said) : v.flag || v.positional ? (i.value = v, l.value = "") : d(v), p = () => l.value.trim() && d(i.value, l.value.trim());
    return t({ moves: o, press: f }), (v, M) => {
      var x;
      return o.value.length ? (c(), h("footer", {
        key: 0,
        class: Z(["foot", { inline: e.inline }])
      }, [
        r.value ? (c(), h("p", Dw, $(r.value), 1)) : O("", !0),
        (x = i.value) != null && x.confirm ? (c(), h("div", Pw, [
          g("span", jw, $(i.value.confirm), 1),
          D(ye, {
            small: "",
            kind: i.value.danger ? "ghost" : "primary",
            bordered: i.value.danger,
            class: Z({ danger: i.value.danger }),
            "data-resource-confirm-yes": "",
            onClick: M[0] || (M[0] = (S) => d(i.value))
          }, {
            default: W(() => [
              oe($(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["kind", "bordered", "class"]),
          D(ye, {
            small: "",
            kind: "ghost",
            onClick: M[1] || (M[1] = (S) => i.value = null)
          }, {
            default: W(() => [...M[7] || (M[7] = [
              oe("Back", -1)
            ])]),
            _: 1
          })
        ])) : i.value ? (c(), h("form", {
          key: 2,
          class: "ask",
          "data-resource-ask": "",
          onSubmit: be(p, ["prevent"])
        }, [
          ht(g("input", {
            "onUpdate:modelValue": M[2] || (M[2] = (S) => l.value = S),
            class: "ask-input",
            placeholder: i.value.ask,
            "aria-label": i.value.ask,
            onKeydown: M[3] || (M[3] = Zt(be((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, qw), [
            [Ps, l.value]
          ]),
          i.value.opener ? ht((c(), h("input", {
            key: 0,
            "onUpdate:modelValue": M[4] || (M[4] = (S) => u.value = S),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: i.value.opener,
            "aria-label": i.value.opener,
            onKeydown: M[5] || (M[5] = Zt(be((S) => i.value = null, ["stop"]), ["esc"]))
          }, null, 40, Fw)), [
            [Ps, u.value]
          ]) : O("", !0),
          D(ye, {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.value.trim()
          }, {
            default: W(() => [
              oe($(i.value.label), 1)
            ]),
            _: 1
          }, 8, ["disabled"]),
          D(ye, {
            small: "",
            kind: "ghost",
            onClick: M[6] || (M[6] = (S) => i.value = null)
          }, {
            default: W(() => [...M[8] || (M[8] = [
              oe("Back", -1)
            ])]),
            _: 1
          })
        ], 32)) : (c(), h("div", Ww, [
          (c(!0), h(K, null, te(o.value, (S) => (c(), G(ye, {
            key: S.word,
            small: !S.bordered,
            bordered: S.bordered,
            icon: S.icon,
            kind: S.main ? "primary" : "ghost",
            class: Z({ danger: S.danger }),
            "data-move": S.word,
            onClick: (T) => f(S)
          }, {
            default: W(() => [
              oe($(S.label), 1)
            ]),
            _: 2
          }, 1032, ["small", "bordered", "icon", "kind", "class", "data-move", "onClick"]))), 128))
        ]))
      ], 2)) : O("", !0);
    };
  }
}, Uw = /* @__PURE__ */ Y(Hw, [["__scopeId", "data-v-74d3b5e8"]]), zw = /* @__PURE__ */ new Set(["completed", "cancelled"]), Vw = (e) => zw.has(e), ua = (e) => Vw(e) ? "done" : e, Gw = { class: "facts" }, Kw = { class: "fact wide" }, Yw = { class: "fact-value" }, Jw = {
  key: 0,
  class: "fact"
}, Zw = { class: "fact-value" }, Xw = { class: "fact" }, Qw = { class: "fact-label" }, e2 = ["title"], t2 = {
  key: 0,
  class: "held-note",
  "data-task-held-by": ""
}, n2 = {
  key: 1,
  class: "held-note",
  "data-task-held-by": ""
}, s2 = {
  key: 2,
  class: "fact"
}, a2 = { class: "fact-value" }, o2 = { class: "fact wide" }, r2 = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, i2 = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = qn.map(({ key: o, label: r }) => ({ key: String(o), label: r })), s = t, a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]);
    return (o, r) => {
      var i, l;
      return c(), h("div", Gw, [
        g("div", Kw, [
          r[2] || (r[2] = g("span", { class: "fact-label" }, "Plan", -1)),
          g("span", Yw, $((i = e.place) != null && i.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((l = e.place) == null ? void 0 : l.phase_total) > 1 ? (c(), h("div", Jw, [
          r[3] || (r[3] = g("span", { class: "fact-label" }, "Phase", -1)),
          g("span", Zw, $(e.place.phase_number) + " of " + $(e.place.phase_total) + ": " + $(e.place.phase_title), 1)
        ])) : O("", !0),
        e.task.helper_id ? (c(), h(K, { key: 1 }, [
          g("div", Xw, [
            g("span", Qw, $(e.task.state === "open" ? "Queued for" : "Delegated to"), 1),
            g("button", {
              type: "button",
              class: "fact-value agent-link",
              title: `Open ${e.task.helper_name}`,
              "data-task-agent": "",
              onClick: r[0] || (r[0] = (u) => z(Fe)(`agents:${e.task.helper_id}`))
            }, $(e.task.helper_name), 9, e2)
          ]),
          z(a).has(e.task.state) ? (c(), h("p", t2, $(e.task.helper_name) + " holds it: merging its work finishes it, and releasing the worker opens it again.", 1)) : e.task.state === "open" ? (c(), h("p", n2, $(e.task.helper_name) + " takes it after the task it is on. Releasing the worker opens it again.", 1)) : O("", !0)
        ], 64)) : e.task.state === "started" && e.task.holder_id ? (c(), h("div", s2, [
          r[4] || (r[4] = g("span", { class: "fact-label" }, "Assigned to", -1)),
          g("span", a2, "Agent " + $(e.task.holder_id), 1)
        ])) : O("", !0),
        g("div", o2, [
          r[5] || (r[5] = g("span", { class: "fact-label" }, "Priority", -1)),
          D(Jr, {
            options: z(n),
            value: String(z(Yr)(e.task.priority)),
            "data-task-priority": "",
            onPick: r[1] || (r[1] = (u) => s("priority", u))
          }, null, 8, ["options", "value"]),
          e.refusal ? (c(), h("p", r2, $(e.refusal), 1)) : O("", !0)
        ])
      ]);
    };
  }
}, l2 = /* @__PURE__ */ Y(i2, [["__scopeId", "data-v-2bcdca7a"]]), c2 = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Action: needed",
  open: "Open"
}, u2 = { ...c2, done: "Completed" }, d2 = { class: "task-status-icon" }, h2 = ["width", "height", "aria-label"], f2 = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (c(), h("span", d2, [
      D(Nt, {
        name: "turn",
        mode: "out-in"
      }, {
        default: W(() => [
          (c(), h("svg", {
            key: e.status,
            class: Z(["ring", e.status]),
            width: e.size,
            height: e.size,
            viewBox: "0 0 16 16",
            role: "img",
            "aria-label": z(u2)[e.status]
          }, [
            D(cn, { value: e.status }, {
              blocked: W(() => [...n[0] || (n[0] = [
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
              done: W(() => [...n[1] || (n[1] = [
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
              started: W(() => [...n[2] || (n[2] = [
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
              asked: W(() => [...n[3] || (n[3] = [
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
              paused: W(() => [...n[4] || (n[4] = [
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
              planned: W(() => [...n[5] || (n[5] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke dashed"
                }, null, -1)
              ])]),
              default: W(() => [...n[6] || (n[6] = [
                g("circle", {
                  cx: "8",
                  cy: "8",
                  r: "5.6",
                  class: "stroke"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["value"])
          ], 10, h2))
        ]),
        _: 1
      })
    ]));
  }
}, Ki = /* @__PURE__ */ Y(f2, [["__scopeId", "data-v-2ab7e404"]]), m2 = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, p2 = ["onClick"], g2 = { class: "wait-id" }, v2 = { class: "wait-title" }, y2 = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, k2 = { class: "text" }, w2 = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, b2 = 180, x2 = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = I(!1);
    return (a, o) => (c(), h(K, null, [
      e.task.waits.length ? (c(), h("section", m2, [
        o[1] || (o[1] = g("h4", null, "Waits on", -1)),
        (c(!0), h(K, null, te(e.task.waits, (r) => (c(), h("button", {
          key: r.id,
          type: "button",
          class: "wait",
          onClick: (i) => n("select", r.id)
        }, [
          D(Ki, {
            status: z(ua)(r.state),
            size: 12
          }, null, 8, ["status"]),
          g("span", g2, $(r.id), 1),
          g("span", v2, $(r.title), 1)
        ], 8, p2))), 128))
      ])) : O("", !0),
      e.task.state === "completed" && e.task.outcome ? (c(), h("section", y2, [
        o[2] || (o[2] = g("h4", null, "How it was done", -1)),
        g("p", k2, $(e.task.outcome), 1)
      ])) : O("", !0),
      e.task.brief ? (c(), h("section", w2, [
        o[3] || (o[3] = g("h4", null, "The brief", -1)),
        g("p", {
          class: Z(["text", { clamped: !s.value }])
        }, $(e.task.brief), 3),
        e.task.brief.length > b2 && !s.value ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (r) => s.value = !0)
        }, "Show the whole brief")) : O("", !0)
      ])) : O("", !0)
    ], 64));
  }
}, $2 = /* @__PURE__ */ Y(x2, [["__scopeId", "data-v-8e4d95ae"]]), M2 = {
  class: "task-details",
  "data-task-details": ""
}, S2 = { class: "since" }, _2 = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, E2 = { class: "text" }, A2 = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, C2 = {
  key: 1,
  class: "note"
}, O2 = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, T2 = { class: "text" }, I2 = {
  __name: "TaskDetails",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["status", "priority", "select"],
  setup(e, { emit: t }) {
    const n = t, s = (a) => a.slice(0, 1).toUpperCase() + a.slice(1);
    return (a, o) => {
      var r;
      return c(), h("div", M2, [
        g("div", {
          class: Z(["state-line", z(ua)(e.task.state)])
        }, [
          g("button", {
            type: "button",
            class: "state",
            "data-task-state": "",
            title: "Change the status (S)",
            onClick: o[0] || (o[0] = (i) => n("status", i.currentTarget))
          }, [
            D(Ki, {
              status: z(ua)(e.task.state)
            }, null, 8, ["status"]),
            oe(" " + $(s(e.task.state)), 1)
          ]),
          g("span", S2, [
            o[3] || (o[3] = oe(" since ", -1)),
            D(os, {
              at: z(ya)(e.task)
            }, null, 8, ["at"])
          ])
        ], 2),
        e.task.state === "blocked" ? (c(), h("section", _2, [
          o[4] || (o[4] = g("span", { class: "label" }, "Blocked, waiting on", -1)),
          g("p", E2, $(e.task.reason || "Other tasks"), 1),
          (r = e.task.openers) != null && r.length ? (c(), h("p", A2, "Opens by itself when " + $(e.task.openers.join(" or ")) + ".", 1)) : (c(), h("p", C2, "Unblock this task manually when it is ready to continue."))
        ])) : e.task.state === "cancelled" && e.task.reason ? (c(), h("section", O2, [
          o[5] || (o[5] = g("span", { class: "label" }, "Why it was cancelled", -1)),
          g("p", T2, $(e.task.reason), 1)
        ])) : O("", !0),
        D(l2, {
          task: e.task,
          place: e.place,
          refusal: e.refusal,
          onPriority: o[1] || (o[1] = (i) => n("priority", i))
        }, null, 8, ["task", "place", "refusal"]),
        D($2, {
          task: e.task,
          onSelect: o[2] || (o[2] = (i) => n("select", i))
        }, null, 8, ["task"])
      ]);
    };
  }
}, R2 = /* @__PURE__ */ Y(I2, [["__scopeId", "data-v-2863d987"]]), B2 = {
  class: "task-log",
  "aria-label": "Task log"
}, L2 = {
  role: "alert",
  class: "failure",
  "data-task-log-failure": ""
}, N2 = {
  key: 0,
  class: "empty",
  "data-task-log-empty": ""
}, D2 = { class: "entries" }, P2 = ["datetime"], j2 = {
  key: 1,
  class: "pages",
  "aria-label": "Log pages"
}, q2 = {
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
    return pe(
      () => [t.id, t.changes],
      () => {
        n.value = [], l();
      },
      { immediate: !0 }
    ), Dt(() => {
      i += 1;
    }), (u, d) => (c(), h("section", B2, [
      o.value ? (c(), G(Pt, { key: 0 })) : r.value ? (c(), h(K, { key: 1 }, [
        g("p", L2, $(r.value), 1),
        D(ye, {
          bordered: "",
          "data-task-log-retry": "",
          onClick: d[0] || (d[0] = (f) => l(s.value))
        }, {
          default: W(() => [...d[3] || (d[3] = [
            oe("Try again", -1)
          ])]),
          _: 1
        })
      ], 64)) : (c(), h(K, { key: 2 }, [
        n.value.length ? O("", !0) : (c(), h("p", N2, "No log entries yet.")),
        g("ol", D2, [
          (c(!0), h(K, null, te(n.value, (f) => (c(), h("li", {
            key: f.id,
            class: "entry",
            "data-task-log": ""
          }, [
            g("time", {
              datetime: f.created_at
            }, $(new Date(f.created_at).toLocaleString()), 9, P2),
            g("p", null, $(f.line), 1)
          ]))), 128))
        ]),
        s.value > 1 || !a.value ? (c(), h("nav", j2, [
          D(ye, {
            small: "",
            bordered: "",
            disabled: s.value === 1,
            "data-task-log-newer": "",
            onClick: d[1] || (d[1] = (f) => l(s.value - 1))
          }, {
            default: W(() => [...d[4] || (d[4] = [
              oe("Newer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g("span", null, "Page " + $(s.value), 1),
          D(ye, {
            small: "",
            bordered: "",
            disabled: a.value,
            "data-task-log-older": "",
            onClick: d[2] || (d[2] = (f) => l(s.value + 1))
          }, {
            default: W(() => [...d[5] || (d[5] = [
              oe("Older", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])) : O("", !0)
      ], 64))
    ]));
  }
}, F2 = /* @__PURE__ */ Y(q2, [["__scopeId", "data-v-953605e5"]]), W2 = { class: "comment-side-head" }, H2 = {
  key: 0,
  class: "comment-none"
}, U2 = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (c(), h("aside", {
      class: Z(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      g("header", W2, [
        n[1] || (n[1] = g("h3", null, "Comments", -1)),
        D(Zn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? O("", !0) : (c(), h("p", H2, "No comments yet")),
      (c(!0), h(K, null, te(e.comments, (s) => (c(), h("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, $(e.words(s)), 1))), 128))
    ], 2));
  }
}, z2 = /* @__PURE__ */ Y(U2, [["__scopeId", "data-v-19fdbdd4"]]);
var zo;
/Mac|iPhone|iPad/.test(((zo = navigator.userAgentData) == null ? void 0 : zo.platform) || navigator.platform);
function V2(e, t) {
  e.shiftKey || e.isComposing || (e.preventDefault(), t());
}
const G2 = ["placeholder"], K2 = { class: "actions" }, Y2 = { class: "error" }, J2 = {
  key: 1,
  class: "card closed"
}, Z2 = { class: "mark" }, X2 = { class: "prompt" }, Q2 = {
  key: 0,
  class: "draft"
}, eb = {
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
    const s = e, a = n, o = Ns(e, "draft"), r = Ns(e, "error"), i = I(!!r.value), l = I(!1), u = I(!1), d = I(null);
    async function f() {
      var M, x;
      i.value = !0, l.value = !1, await mt(), (x = ((M = d.value) == null ? void 0 : M.querySelector("input")) || d.value) == null || x.focus();
    }
    function p() {
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
        onKeydown: Zt(p, ["esc"])
      }, [
        he(M.$slots, "who", {}, void 0, !0),
        ht(g("textarea", {
          ref_key: "box",
          ref: d,
          "onUpdate:modelValue": x[0] || (x[0] = (S) => o.value = S),
          rows: "3",
          maxlength: "2000",
          placeholder: e.placeholder,
          onKeydown: x[1] || (x[1] = Zt((S) => z(V2)(S, v), ["enter"]))
        }, null, 40, G2), [
          [Ps, o.value]
        ]),
        g("div", K2, [
          g("span", Y2, $(r.value), 1),
          D(ye, {
            small: "",
            onClick: p
          }, {
            default: W(() => [...x[3] || (x[3] = [
              oe("Cancel", -1)
            ])]),
            _: 1
          }),
          D(ye, {
            kind: "primary",
            small: "",
            busy: u.value,
            disabled: !o.value.trim() || !e.ready,
            onClick: v
          }, {
            default: W(() => [...x[4] || (x[4] = [
              oe("Send", -1)
            ])]),
            _: 1
          }, 8, ["busy", "disabled"])
        ])
      ], 32)) : (c(), h("div", J2, [
        g("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: f
        }, [
          g("span", Z2, [
            D(ge, {
              name: l.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          g("span", X2, $(l.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (c(), h("span", Q2, "Draft kept")) : O("", !0)
        ]),
        e.count ? (c(), h("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: x[2] || (x[2] = (S) => a("show"))
        }, [
          g("span", null, $(z(Rm)(e.count, "comment")), 1),
          D(ge, {
            name: "down",
            size: 12
          })
        ])) : O("", !0)
      ]))
    ], 2));
  }
}, tb = /* @__PURE__ */ Y(eb, [["__scopeId", "data-v-81f478d2"]]);
function nb(e, t) {
  const n = I([]), s = I(!1);
  let a = 0, o = 0;
  const r = (u) => {
    const { kind: d, id: f, title: p } = e(), v = `On ${d} ${f}, ${p}: `;
    return u.text.startsWith(v) ? u.text.slice(v.length) : u.text;
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
    const v = await t([d, "comment", String(f), u]);
    if (!v.ok)
      throw n.value = n.value.filter((M) => M !== p && M.id !== p.id), new Error(v.error);
    await i();
  }
  return pe(() => e().id, () => {
    s.value = !1, n.value = [], i();
  }, { immediate: !0 }), { comments: n, open: s, words: r, send: l, load: i };
}
const sb = { class: "top" }, ab = {
  class: "crumb",
  "data-task-crumb": ""
}, ob = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, rb = {
  key: 1,
  class: "body"
}, ib = { class: "summary" }, lb = { class: "stamp" }, cb = {
  class: "title",
  "data-resource-title": ""
}, ub = {
  class: "tabs",
  "data-task-tabs": ""
}, db = { class: "panels" }, hb = {
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
    const s = e, a = n, o = I(null), r = I(null), i = I(""), l = I(""), u = I(null), d = I(null), f = I("details"), p = [
      { key: "details", label: "Details" },
      { key: "comments", label: "Comments" },
      { key: "log", label: "Log" }
    ], v = nb(
      () => o.value ? { kind: "task", id: s.id, title: o.value.title } : {},
      (E) => s.read(E)
    );
    let M = 0;
    const x = N(() => {
      var E;
      return (E = r.value) != null && E.plan_id ? r.value.phase_total > 1 ? `Plan ${r.value.plan_id} › Phase ${r.value.phase_number}: ${r.value.phase_title}` : `Plan ${r.value.plan_id}: ${r.value.plan_title}` : "Not in a plan";
    });
    async function S() {
      const E = ++M, [b, A] = await Promise.all([
        s.read(["task", "inspect", String(s.id)]),
        s.read(["plan", "place", String(s.id)])
      ]);
      E === M && (i.value = b.ok ? "" : b.error, o.value = b.ok ? b.value : null, r.value = A.ok ? A.value : null);
    }
    pe(
      () => s.id,
      () => {
        o.value = null, r.value = null, u.value = null, f.value = "details", S();
      },
      { immediate: !0 }
    ), pe(() => s.changes, S), pe(v.open, (E) => {
      E && (f.value = "comments");
    });
    async function T(E) {
      const b = o.value.priority;
      o.value.priority = Number(E);
      const A = await s.read(["task", "edit", String(s.id), "--priority", E]);
      if (l.value = A.ok ? "" : A.error, A.ok) return S();
      o.value.priority = b;
    }
    function F(E) {
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
      g("div", sb, [
        e.backed ? (c(), G(Aw, {
          key: 0,
          onBack: b[0] || (b[0] = (A) => a("back"))
        })) : O("", !0),
        g("span", ab, $(x.value), 1),
        b[9] || (b[9] = g("span", { class: "grow" }, null, -1)),
        e.stepped ? (c(), h(K, { key: 1 }, [
          D(ye, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: b[1] || (b[1] = (A) => a("step", -1))
          }, {
            default: W(() => [
              D(ge, {
                name: "up",
                size: 13
              })
            ]),
            _: 1
          }),
          D(ye, {
            small: "",
            title: "Next task (J)",
            "aria-label": "Next task",
            onClick: b[2] || (b[2] = (A) => a("step", 1))
          }, {
            default: W(() => [
              D(ge, {
                name: "down",
                size: 13
              })
            ]),
            _: 1
          })
        ], 64)) : O("", !0),
        D(ye, {
          small: "",
          "aria-label": "Close the task (Esc)",
          "data-resource-close": "",
          onClick: b[3] || (b[3] = (A) => a("close"))
        }, {
          default: W(() => [
            D(ge, {
              name: "close",
              size: 13
            })
          ]),
          _: 1
        })
      ]),
      i.value ? (c(), h("p", ob, $(i.value), 1)) : o.value ? (c(), h(K, { key: 2 }, [
        D(Uw, {
          ref_key: "footer",
          ref: d,
          kind: "task",
          id: e.id,
          row: o.value,
          read: e.read,
          onDone: S
        }, null, 8, ["id", "row", "read"]),
        g("header", ib, [
          g("div", lb, [
            oe(" Task " + $(o.value.id) + " · updated ", 1),
            D(os, {
              at: z(ya)(o.value)
            }, null, 8, ["at"])
          ]),
          g("h3", cb, $(o.value.title), 1)
        ]),
        g("div", ub, [
          D(Jr, {
            options: p,
            value: f.value,
            onPick: b[4] || (b[4] = (A) => f.value = A)
          }, null, 8, ["value"])
        ]),
        g("div", db, [
          D(cn, { value: f.value }, {
            details: W(() => [
              D(R2, {
                task: o.value,
                place: r.value,
                refusal: l.value,
                onStatus: Q,
                onPriority: T,
                onSelect: b[5] || (b[5] = (A) => a("select", A))
              }, null, 8, ["task", "place", "refusal"])
            ]),
            comments: W(() => [
              D(z2, {
                below: "",
                comments: z(v).comments.value,
                words: z(v).words,
                onClose: b[6] || (b[6] = (A) => f.value = "details")
              }, null, 8, ["comments", "words"])
            ]),
            log: W(() => [
              D(F2, {
                id: e.id,
                read: e.read,
                changes: e.changes
              }, null, 8, ["id", "read", "changes"])
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        D(tb, {
          send: z(v).send,
          count: z(v).comments.value.length,
          onShow: b[7] || (b[7] = (A) => f.value = "comments")
        }, null, 8, ["send", "count"])
      ], 64)) : (c(), h("div", rb, [
        D(Pt)
      ])),
      u.value ? (c(), G(Sa, {
        key: 3,
        anchor: u.value,
        "min-width": 220,
        "max-width": 300,
        onClose: b[8] || (b[8] = (A) => u.value = null)
      }, {
        default: W(() => [
          D(la, null, {
            default: W(() => [
              oe("Change the status of task " + $(e.id), 1)
            ]),
            _: 1
          }),
          (c(!0), h(K, null, te(d.value.moves, (A) => (c(), G(Bt, {
            key: A.word,
            onClick: (y) => F(A)
          }, {
            default: W(() => [
              oe($(A.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : O("", !0)
    ], 2));
  }
}, zx = /* @__PURE__ */ Y(hb, [["__scopeId", "data-v-43f3b122"]]);
function fb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ls = { exports: {} }, Uo;
function mb() {
  return Uo || (Uo = 1, (function(e, t) {
    var n = (function() {
      var s = function(b, A) {
        var y = 236, C = 17, k = b, _ = o[A], w = null, m = 0, R = null, P = [], L = {}, J = function(j, q) {
          m = k * 4 + 17, w = (function(B) {
            for (var H = new Array(B), U = 0; U < B; U += 1) {
              H[U] = new Array(B);
              for (var X = 0; X < B; X += 1)
                H[U][X] = null;
            }
            return H;
          })(m), V(0, 0), V(m - 7, 0), V(0, m - 7), ke(), le(), Ge(j, q), k >= 7 && Re(j), R == null && (R = Yi(k, _, P)), Ke(R, q);
        }, V = function(j, q) {
          for (var B = -1; B <= 7; B += 1)
            if (!(j + B <= -1 || m <= j + B))
              for (var H = -1; H <= 7; H += 1)
                q + H <= -1 || m <= q + H || (0 <= B && B <= 6 && (H == 0 || H == 6) || 0 <= H && H <= 6 && (B == 0 || B == 6) || 2 <= B && B <= 4 && 2 <= H && H <= 4 ? w[j + B][q + H] = !0 : w[j + B][q + H] = !1);
        }, ce = function() {
          for (var j = 0, q = 0, B = 0; B < 8; B += 1) {
            J(!0, B);
            var H = i.getLostPoint(L);
            (B == 0 || j > H) && (j = H, q = B);
          }
          return q;
        }, le = function() {
          for (var j = 8; j < m - 8; j += 1)
            w[j][6] == null && (w[j][6] = j % 2 == 0);
          for (var q = 8; q < m - 8; q += 1)
            w[6][q] == null && (w[6][q] = q % 2 == 0);
        }, ke = function() {
          for (var j = i.getPatternPosition(k), q = 0; q < j.length; q += 1)
            for (var B = 0; B < j.length; B += 1) {
              var H = j[q], U = j[B];
              if (w[H][U] == null)
                for (var X = -2; X <= 2; X += 1)
                  for (var se = -2; se <= 2; se += 1)
                    X == -2 || X == 2 || se == -2 || se == 2 || X == 0 && se == 0 ? w[H + X][U + se] = !0 : w[H + X][U + se] = !1;
            }
        }, Re = function(j) {
          for (var q = i.getBCHTypeNumber(k), B = 0; B < 18; B += 1) {
            var H = !j && (q >> B & 1) == 1;
            w[Math.floor(B / 3)][B % 3 + m - 8 - 3] = H;
          }
          for (var B = 0; B < 18; B += 1) {
            var H = !j && (q >> B & 1) == 1;
            w[B % 3 + m - 8 - 3][Math.floor(B / 3)] = H;
          }
        }, Ge = function(j, q) {
          for (var B = _ << 3 | q, H = i.getBCHTypeInfo(B), U = 0; U < 15; U += 1) {
            var X = !j && (H >> U & 1) == 1;
            U < 6 ? w[U][8] = X : U < 8 ? w[U + 1][8] = X : w[m - 15 + U][8] = X;
          }
          for (var U = 0; U < 15; U += 1) {
            var X = !j && (H >> U & 1) == 1;
            U < 8 ? w[8][m - U - 1] = X : U < 9 ? w[8][15 - U - 1 + 1] = X : w[8][15 - U - 1] = X;
          }
          w[m - 8][8] = !j;
        }, Ke = function(j, q) {
          for (var B = -1, H = m - 1, U = 7, X = 0, se = i.getMaskFunction(q), ne = m - 1; ne > 0; ne -= 2)
            for (ne == 6 && (ne -= 1); ; ) {
              for (var we = 0; we < 2; we += 1)
                if (w[H][ne - we] == null) {
                  var $e = !1;
                  X < j.length && ($e = (j[X] >>> U & 1) == 1);
                  var re = se(H, ne - we);
                  re && ($e = !$e), w[H][ne - we] = $e, U -= 1, U == -1 && (X += 1, U = 7);
                }
              if (H += B, H < 0 || m <= H) {
                H -= B, B = -B;
                break;
              }
            }
        }, _t = function(j, q) {
          for (var B = 0, H = 0, U = 0, X = new Array(q.length), se = new Array(q.length), ne = 0; ne < q.length; ne += 1) {
            var we = q[ne].dataCount, $e = q[ne].totalCount - we;
            H = Math.max(H, we), U = Math.max(U, $e), X[ne] = new Array(we);
            for (var re = 0; re < X[ne].length; re += 1)
              X[ne][re] = 255 & j.getBuffer()[re + B];
            B += we;
            var Ne = i.getErrorCorrectPolynomial($e), De = u(X[ne], Ne.getLength() - 1), Pa = De.mod(Ne);
            se[ne] = new Array(Ne.getLength() - 1);
            for (var re = 0; re < se[ne].length; re += 1) {
              var ja = re + Pa.getLength() - se[ne].length;
              se[ne][re] = ja >= 0 ? Pa.getAt(ja) : 0;
            }
          }
          for (var qa = 0, re = 0; re < q.length; re += 1)
            qa += q[re].totalCount;
          for (var rs = new Array(qa), wn = 0, re = 0; re < H; re += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              re < X[ne].length && (rs[wn] = X[ne][re], wn += 1);
          for (var re = 0; re < U; re += 1)
            for (var ne = 0; ne < q.length; ne += 1)
              re < se[ne].length && (rs[wn] = se[ne][re], wn += 1);
          return rs;
        }, Yi = function(j, q, B) {
          for (var H = d.getRSBlocks(j, q), U = f(), X = 0; X < B.length; X += 1) {
            var se = B[X];
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
          var B = null;
          switch (q) {
            case "Numeric":
              B = p(j);
              break;
            case "Alphanumeric":
              B = v(j);
              break;
            case "Byte":
              B = M(j);
              break;
            case "Kanji":
              B = x(j);
              break;
            default:
              throw "mode:" + q;
          }
          P.push(B), R = null;
        }, L.isDark = function(j, q) {
          if (j < 0 || m <= j || q < 0 || m <= q)
            throw j + "," + q;
          return w[j][q];
        }, L.getModuleCount = function() {
          return m;
        }, L.make = function() {
          if (k < 1) {
            for (var j = 1; j < 40; j++) {
              for (var q = d.getRSBlocks(j, _), B = f(), H = 0; H < P.length; H++) {
                var U = P[H];
                B.put(U.getMode(), 4), B.put(U.getLength(), i.getLengthInBits(U.getMode(), j)), U.write(B);
              }
              for (var X = 0, H = 0; H < q.length; H++)
                X += q[H].dataCount;
              if (B.getLengthInBits() <= X * 8)
                break;
            }
            k = j;
          }
          J(!1, ce());
        }, L.createTableTag = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var B = "";
          B += '<table style="', B += " border-width: 0px; border-style: none;", B += " border-collapse: collapse;", B += " padding: 0px; margin: " + q + "px;", B += '">', B += "<tbody>";
          for (var H = 0; H < L.getModuleCount(); H += 1) {
            B += "<tr>";
            for (var U = 0; U < L.getModuleCount(); U += 1)
              B += '<td style="', B += " border-width: 0px; border-style: none;", B += " border-collapse: collapse;", B += " padding: 0px; margin: 0px;", B += " width: " + j + "px;", B += " height: " + j + "px;", B += " background-color: ", B += L.isDark(H, U) ? "#000000" : "#ffffff", B += ";", B += '"/>';
            B += "</tr>";
          }
          return B += "</tbody>", B += "</table>", B;
        }, L.createSvgTag = function(j, q, B, H) {
          var U = {};
          typeof arguments[0] == "object" && (U = arguments[0], j = U.cellSize, q = U.margin, B = U.alt, H = U.title), j = j || 2, q = typeof q > "u" ? j * 4 : q, B = typeof B == "string" ? { text: B } : B || {}, B.text = B.text || null, B.id = B.text ? B.id || "qrcode-description" : null, H = typeof H == "string" ? { text: H } : H || {}, H.text = H.text || null, H.id = H.text ? H.id || "qrcode-title" : null;
          var X = L.getModuleCount() * j + q * 2, se, ne, we, $e, re = "", Ne;
          for (Ne = "l" + j + ",0 0," + j + " -" + j + ",0 0,-" + j + "z ", re += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"', re += U.scalable ? "" : ' width="' + X + 'px" height="' + X + 'px"', re += ' viewBox="0 0 ' + X + " " + X + '" ', re += ' preserveAspectRatio="xMinYMin meet"', re += H.text || B.text ? ' role="img" aria-labelledby="' + Et([H.id, B.id].join(" ").trim()) + '"' : "", re += ">", re += H.text ? '<title id="' + Et(H.id) + '">' + Et(H.text) + "</title>" : "", re += B.text ? '<description id="' + Et(B.id) + '">' + Et(B.text) + "</description>" : "", re += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>', re += '<path d="', we = 0; we < L.getModuleCount(); we += 1)
            for ($e = we * j + q, se = 0; se < L.getModuleCount(); se += 1)
              L.isDark(we, se) && (ne = se * j + q, re += "M" + ne + "," + $e + Ne);
          return re += '" stroke="transparent" fill="black"/>', re += "</svg>", re;
        }, L.createDataURL = function(j, q) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var B = L.getModuleCount() * j + q * 2, H = q, U = B - q;
          return E(B, B, function(X, se) {
            if (H <= X && X < U && H <= se && se < U) {
              var ne = Math.floor((X - H) / j), we = Math.floor((se - H) / j);
              return L.isDark(we, ne) ? 0 : 1;
            } else
              return 1;
          });
        }, L.createImgTag = function(j, q, B) {
          j = j || 2, q = typeof q > "u" ? j * 4 : q;
          var H = L.getModuleCount() * j + q * 2, U = "";
          return U += "<img", U += ' src="', U += L.createDataURL(j, q), U += '"', U += ' width="', U += H, U += '"', U += ' height="', U += H, U += '"', B && (U += ' alt="', U += Et(B), U += '"'), U += "/>", U;
        };
        var Et = function(j) {
          for (var q = "", B = 0; B < j.length; B += 1) {
            var H = j.charAt(B);
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
        }, Ji = function(j) {
          var q = 1;
          j = typeof j > "u" ? q * 2 : j;
          var B = L.getModuleCount() * q + j * 2, H = j, U = B - j, X, se, ne, we, $e, re = {
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
          for (X = 0; X < B; X += 2) {
            for (ne = Math.floor((X - H) / q), we = Math.floor((X + 1 - H) / q), se = 0; se < B; se += 1)
              $e = "█", H <= se && se < U && H <= X && X < U && L.isDark(ne, Math.floor((se - H) / q)) && ($e = " "), H <= se && se < U && H <= X + 1 && X + 1 < U && L.isDark(we, Math.floor((se - H) / q)) ? $e += " " : $e += "█", De += j < 1 && X + 1 >= U ? Ne[$e] : re[$e];
            De += `
`;
          }
          return B % 2 && j > 0 ? De.substring(0, De.length - B - 1) + Array(B + 1).join("▀") : De.substring(0, De.length - 1);
        };
        return L.createASCII = function(j, q) {
          if (j = j || 1, j < 2)
            return Ji(q);
          j -= 1, q = typeof q > "u" ? j * 2 : q;
          var B = L.getModuleCount() * j + q * 2, H = q, U = B - q, X, se, ne, we, $e = Array(j + 1).join("██"), re = Array(j + 1).join("  "), Ne = "", De = "";
          for (X = 0; X < B; X += 1) {
            for (ne = Math.floor((X - H) / j), De = "", se = 0; se < B; se += 1)
              we = 1, H <= se && se < U && H <= X && X < U && L.isDark(ne, Math.floor((se - H) / j)) && (we = 0), De += we ? $e : re;
            for (ne = 0; ne < j; ne += 1)
              Ne += De + `
`;
          }
          return Ne.substring(0, Ne.length - 1);
        }, L.renderTo2dContext = function(j, q) {
          q = q || 2;
          for (var B = L.getModuleCount(), H = 0; H < B; H++)
            for (var U = 0; U < B; U++)
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
          for (var k = F(b), _ = function() {
            var le = k.read();
            if (le == -1) throw "eof";
            return le;
          }, w = 0, m = {}; ; ) {
            var R = k.read();
            if (R == -1) break;
            var P = _(), L = _(), J = _(), V = String.fromCharCode(R << 8 | P), ce = L << 8 | J;
            m[V] = ce, w += 1;
          }
          if (w != A)
            throw w + " != " + A;
          return m;
        })(), C = 63;
        return function(k) {
          for (var _ = [], w = 0; w < k.length; w += 1) {
            var m = k.charCodeAt(w);
            if (m < 128)
              _.push(m);
            else {
              var R = y[k.charAt(w)];
              typeof R == "number" ? (R & 255) == R ? _.push(R) : (_.push(R >>> 8), _.push(R & 255)) : _.push(C);
            }
          }
          return _;
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
        ], A = 1335, y = 7973, C = 21522, k = {}, _ = function(w) {
          for (var m = 0; w != 0; )
            m += 1, w >>>= 1;
          return m;
        };
        return k.getBCHTypeInfo = function(w) {
          for (var m = w << 10; _(m) - _(A) >= 0; )
            m ^= A << _(m) - _(A);
          return (w << 10 | m) ^ C;
        }, k.getBCHTypeNumber = function(w) {
          for (var m = w << 12; _(m) - _(y) >= 0; )
            m ^= y << _(m) - _(y);
          return w << 12 | m;
        }, k.getPatternPosition = function(w) {
          return b[w - 1];
        }, k.getMaskFunction = function(w) {
          switch (w) {
            case r.PATTERN000:
              return function(m, R) {
                return (m + R) % 2 == 0;
              };
            case r.PATTERN001:
              return function(m, R) {
                return m % 2 == 0;
              };
            case r.PATTERN010:
              return function(m, R) {
                return R % 3 == 0;
              };
            case r.PATTERN011:
              return function(m, R) {
                return (m + R) % 3 == 0;
              };
            case r.PATTERN100:
              return function(m, R) {
                return (Math.floor(m / 2) + Math.floor(R / 3)) % 2 == 0;
              };
            case r.PATTERN101:
              return function(m, R) {
                return m * R % 2 + m * R % 3 == 0;
              };
            case r.PATTERN110:
              return function(m, R) {
                return (m * R % 2 + m * R % 3) % 2 == 0;
              };
            case r.PATTERN111:
              return function(m, R) {
                return (m * R % 3 + (m + R) % 2) % 2 == 0;
              };
            default:
              throw "bad maskPattern:" + w;
          }
        }, k.getErrorCorrectPolynomial = function(w) {
          for (var m = u([1], 0), R = 0; R < w; R += 1)
            m = m.multiply(u([1, l.gexp(R)], 0));
          return m;
        }, k.getLengthInBits = function(w, m) {
          if (1 <= m && m < 10)
            switch (w) {
              case a.MODE_NUMBER:
                return 10;
              case a.MODE_ALPHA_NUM:
                return 9;
              case a.MODE_8BIT_BYTE:
                return 8;
              case a.MODE_KANJI:
                return 8;
              default:
                throw "mode:" + w;
            }
          else if (m < 27)
            switch (w) {
              case a.MODE_NUMBER:
                return 12;
              case a.MODE_ALPHA_NUM:
                return 11;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 10;
              default:
                throw "mode:" + w;
            }
          else if (m < 41)
            switch (w) {
              case a.MODE_NUMBER:
                return 14;
              case a.MODE_ALPHA_NUM:
                return 13;
              case a.MODE_8BIT_BYTE:
                return 16;
              case a.MODE_KANJI:
                return 12;
              default:
                throw "mode:" + w;
            }
          else
            throw "type:" + m;
        }, k.getLostPoint = function(w) {
          for (var m = w.getModuleCount(), R = 0, P = 0; P < m; P += 1)
            for (var L = 0; L < m; L += 1) {
              for (var J = 0, V = w.isDark(P, L), ce = -1; ce <= 1; ce += 1)
                if (!(P + ce < 0 || m <= P + ce))
                  for (var le = -1; le <= 1; le += 1)
                    L + le < 0 || m <= L + le || ce == 0 && le == 0 || V == w.isDark(P + ce, L + le) && (J += 1);
              J > 5 && (R += 3 + J - 5);
            }
          for (var P = 0; P < m - 1; P += 1)
            for (var L = 0; L < m - 1; L += 1) {
              var ke = 0;
              w.isDark(P, L) && (ke += 1), w.isDark(P + 1, L) && (ke += 1), w.isDark(P, L + 1) && (ke += 1), w.isDark(P + 1, L + 1) && (ke += 1), (ke == 0 || ke == 4) && (R += 3);
            }
          for (var P = 0; P < m; P += 1)
            for (var L = 0; L < m - 6; L += 1)
              w.isDark(P, L) && !w.isDark(P, L + 1) && w.isDark(P, L + 2) && w.isDark(P, L + 3) && w.isDark(P, L + 4) && !w.isDark(P, L + 5) && w.isDark(P, L + 6) && (R += 40);
          for (var L = 0; L < m; L += 1)
            for (var P = 0; P < m - 6; P += 1)
              w.isDark(P, L) && !w.isDark(P + 1, L) && w.isDark(P + 2, L) && w.isDark(P + 3, L) && w.isDark(P + 4, L) && !w.isDark(P + 5, L) && w.isDark(P + 6, L) && (R += 40);
          for (var Re = 0, L = 0; L < m; L += 1)
            for (var P = 0; P < m; P += 1)
              w.isDark(P, L) && (Re += 1);
          var Ge = Math.abs(100 * Re / m / m - 50) / 5;
          return R += Ge * 10, R;
        }, k;
      })(), l = (function() {
        for (var b = new Array(256), A = new Array(256), y = 0; y < 8; y += 1)
          b[y] = 1 << y;
        for (var y = 8; y < 256; y += 1)
          b[y] = b[y - 4] ^ b[y - 5] ^ b[y - 6] ^ b[y - 8];
        for (var y = 0; y < 255; y += 1)
          A[b[y]] = y;
        var C = {};
        return C.glog = function(k) {
          if (k < 1)
            throw "glog(" + k + ")";
          return A[k];
        }, C.gexp = function(k) {
          for (; k < 0; )
            k += 255;
          for (; k >= 256; )
            k -= 255;
          return b[k];
        }, C;
      })();
      function u(b, A) {
        if (typeof b.length > "u")
          throw b.length + "/" + A;
        var y = (function() {
          for (var k = 0; k < b.length && b[k] == 0; )
            k += 1;
          for (var _ = new Array(b.length - k + A), w = 0; w < b.length - k; w += 1)
            _[w] = b[w + k];
          return _;
        })(), C = {};
        return C.getAt = function(k) {
          return y[k];
        }, C.getLength = function() {
          return y.length;
        }, C.multiply = function(k) {
          for (var _ = new Array(C.getLength() + k.getLength() - 1), w = 0; w < C.getLength(); w += 1)
            for (var m = 0; m < k.getLength(); m += 1)
              _[w + m] ^= l.gexp(l.glog(C.getAt(w)) + l.glog(k.getAt(m)));
          return u(_, 0);
        }, C.mod = function(k) {
          if (C.getLength() - k.getLength() < 0)
            return C;
          for (var _ = l.glog(C.getAt(0)) - l.glog(k.getAt(0)), w = new Array(C.getLength()), m = 0; m < C.getLength(); m += 1)
            w[m] = C.getAt(m);
          for (var m = 0; m < k.getLength(); m += 1)
            w[m] ^= l.gexp(l.glog(k.getAt(m)) + _);
          return u(w, 0).mod(k);
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
        ], A = function(k, _) {
          var w = {};
          return w.totalCount = k, w.dataCount = _, w;
        }, y = {}, C = function(k, _) {
          switch (_) {
            case o.L:
              return b[(k - 1) * 4 + 0];
            case o.M:
              return b[(k - 1) * 4 + 1];
            case o.Q:
              return b[(k - 1) * 4 + 2];
            case o.H:
              return b[(k - 1) * 4 + 3];
            default:
              return;
          }
        };
        return y.getRSBlocks = function(k, _) {
          var w = C(k, _);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + k + "/errorCorrectionLevel:" + _;
          for (var m = w.length / 3, R = [], P = 0; P < m; P += 1)
            for (var L = w[P * 3 + 0], J = w[P * 3 + 1], V = w[P * 3 + 2], ce = 0; ce < L; ce += 1)
              R.push(A(J, V));
          return R;
        }, y;
      })(), f = function() {
        var b = [], A = 0, y = {};
        return y.getBuffer = function() {
          return b;
        }, y.getAt = function(C) {
          var k = Math.floor(C / 8);
          return (b[k] >>> 7 - C % 8 & 1) == 1;
        }, y.put = function(C, k) {
          for (var _ = 0; _ < k; _ += 1)
            y.putBit((C >>> k - _ - 1 & 1) == 1);
        }, y.getLengthInBits = function() {
          return A;
        }, y.putBit = function(C) {
          var k = Math.floor(A / 8);
          b.length <= k && b.push(0), C && (b[k] |= 128 >>> A % 8), A += 1;
        }, y;
      }, p = function(b) {
        var A = a.MODE_NUMBER, y = b, C = {};
        C.getMode = function() {
          return A;
        }, C.getLength = function(w) {
          return y.length;
        }, C.write = function(w) {
          for (var m = y, R = 0; R + 2 < m.length; )
            w.put(k(m.substring(R, R + 3)), 10), R += 3;
          R < m.length && (m.length - R == 1 ? w.put(k(m.substring(R, R + 1)), 4) : m.length - R == 2 && w.put(k(m.substring(R, R + 2)), 7));
        };
        var k = function(w) {
          for (var m = 0, R = 0; R < w.length; R += 1)
            m = m * 10 + _(w.charAt(R));
          return m;
        }, _ = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return C;
      }, v = function(b) {
        var A = a.MODE_ALPHA_NUM, y = b, C = {};
        C.getMode = function() {
          return A;
        }, C.getLength = function(_) {
          return y.length;
        }, C.write = function(_) {
          for (var w = y, m = 0; m + 1 < w.length; )
            _.put(
              k(w.charAt(m)) * 45 + k(w.charAt(m + 1)),
              11
            ), m += 2;
          m < w.length && _.put(k(w.charAt(m)), 6);
        };
        var k = function(_) {
          if ("0" <= _ && _ <= "9")
            return _.charCodeAt(0) - 48;
          if ("A" <= _ && _ <= "Z")
            return _.charCodeAt(0) - 65 + 10;
          switch (_) {
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
              throw "illegal char :" + _;
          }
        };
        return C;
      }, M = function(b) {
        var A = a.MODE_8BIT_BYTE, y = s.stringToBytes(b), C = {};
        return C.getMode = function() {
          return A;
        }, C.getLength = function(k) {
          return y.length;
        }, C.write = function(k) {
          for (var _ = 0; _ < y.length; _ += 1)
            k.put(y[_], 8);
        }, C;
      }, x = function(b) {
        var A = a.MODE_KANJI, y = s.stringToBytesFuncs.SJIS;
        if (!y)
          throw "sjis not supported.";
        (function(_, w) {
          var m = y(_);
          if (m.length != 2 || (m[0] << 8 | m[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var C = y(b), k = {};
        return k.getMode = function() {
          return A;
        }, k.getLength = function(_) {
          return ~~(C.length / 2);
        }, k.write = function(_) {
          for (var w = C, m = 0; m + 1 < w.length; ) {
            var R = (255 & w[m]) << 8 | 255 & w[m + 1];
            if (33088 <= R && R <= 40956)
              R -= 33088;
            else if (57408 <= R && R <= 60351)
              R -= 49472;
            else
              throw "illegal char at " + (m + 1) + "/" + R;
            R = (R >>> 8 & 255) * 192 + (R & 255), _.put(R, 13), m += 2;
          }
          if (m < w.length)
            throw "illegal char at " + (m + 1);
        }, k;
      }, S = function() {
        var b = [], A = {};
        return A.writeByte = function(y) {
          b.push(y & 255);
        }, A.writeShort = function(y) {
          A.writeByte(y), A.writeByte(y >>> 8);
        }, A.writeBytes = function(y, C, k) {
          C = C || 0, k = k || y.length;
          for (var _ = 0; _ < k; _ += 1)
            A.writeByte(y[_ + C]);
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
        var b = 0, A = 0, y = 0, C = "", k = {}, _ = function(m) {
          C += String.fromCharCode(w(m & 63));
        }, w = function(m) {
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
        return k.writeByte = function(m) {
          for (b = b << 8 | m & 255, A += 8, y += 1; A >= 6; )
            _(b >>> A - 6), A -= 6;
        }, k.flush = function() {
          if (A > 0 && (_(b << 6 - A), b = 0, A = 0), y % 3 != 0)
            for (var m = 3 - y % 3, R = 0; R < m; R += 1)
              C += "=";
        }, k.toString = function() {
          return C;
        }, k;
      }, F = function(b) {
        var A = b, y = 0, C = 0, k = 0, _ = {};
        _.read = function() {
          for (; k < 8; ) {
            if (y >= A.length) {
              if (k == 0)
                return -1;
              throw "unexpected end of file./" + k;
            }
            var m = A.charAt(y);
            if (y += 1, m == "=")
              return k = 0, -1;
            if (m.match(/^\s$/))
              continue;
            C = C << 6 | w(m.charCodeAt(0)), k += 6;
          }
          var R = C >>> k - 8 & 255;
          return k -= 8, R;
        };
        var w = function(m) {
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
        return _;
      }, Q = function(b, A) {
        var y = b, C = A, k = new Array(b * A), _ = {};
        _.setPixel = function(P, L, J) {
          k[L * y + P] = J;
        }, _.write = function(P) {
          P.writeString("GIF87a"), P.writeShort(y), P.writeShort(C), P.writeByte(128), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(0), P.writeByte(255), P.writeByte(255), P.writeByte(255), P.writeString(","), P.writeShort(0), P.writeShort(0), P.writeShort(y), P.writeShort(C), P.writeByte(0);
          var L = 2, J = m(L);
          P.writeByte(L);
          for (var V = 0; J.length - V > 255; )
            P.writeByte(255), P.writeBytes(J, V, 255), V += 255;
          P.writeByte(J.length - V), P.writeBytes(J, V, J.length - V), P.writeByte(0), P.writeString(";");
        };
        var w = function(P) {
          var L = P, J = 0, V = 0, ce = {};
          return ce.write = function(le, ke) {
            if (le >>> ke)
              throw "length over";
            for (; J + ke >= 8; )
              L.writeByte(255 & (le << J | V)), ke -= 8 - J, le >>>= 8 - J, V = 0, J = 0;
            V = le << J | V, J = J + ke;
          }, ce.flush = function() {
            J > 0 && L.writeByte(V);
          }, ce;
        }, m = function(P) {
          for (var L = 1 << P, J = (1 << P) + 1, V = P + 1, ce = R(), le = 0; le < L; le += 1)
            ce.add(String.fromCharCode(le));
          ce.add(String.fromCharCode(L)), ce.add(String.fromCharCode(J));
          var ke = S(), Re = w(ke);
          Re.write(L, V);
          var Ge = 0, Ke = String.fromCharCode(k[Ge]);
          for (Ge += 1; Ge < k.length; ) {
            var _t = String.fromCharCode(k[Ge]);
            Ge += 1, ce.contains(Ke + _t) ? Ke = Ke + _t : (Re.write(ce.indexOf(Ke), V), ce.size() < 4095 && (ce.size() == 1 << V && (V += 1), ce.add(Ke + _t)), Ke = _t);
          }
          return Re.write(ce.indexOf(Ke), V), Re.write(J, V), Re.flush(), ke.toByteArray();
        }, R = function() {
          var P = {}, L = 0, J = {};
          return J.add = function(V) {
            if (J.contains(V))
              throw "dup key:" + V;
            P[V] = L, L += 1;
          }, J.size = function() {
            return L;
          }, J.indexOf = function(V) {
            return P[V];
          }, J.contains = function(V) {
            return typeof P[V] < "u";
          }, J;
        };
        return _;
      }, E = function(b, A, y) {
        for (var C = Q(b, A), k = 0; k < A; k += 1)
          for (var _ = 0; _ < b; _ += 1)
            C.setPixel(_, k, y(_, k));
        var w = S();
        C.write(w);
        for (var m = T(), R = w.toByteArray(), P = 0; P < R.length; P += 1)
          m.writeByte(R[P]);
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
var pb = mb();
const gb = /* @__PURE__ */ fb(pb), vb = ["width", "height", "viewBox"], yb = ["width", "height"], kb = ["d"], wb = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = N(() => {
      const s = gb(0, "M");
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
      }, null, 8, yb),
      g("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, kb)
    ], 8, vb));
  }
}, Vx = /* @__PURE__ */ Y(wb, [["__scopeId", "data-v-489f0852"]]), bb = {
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
}, Gx = /* @__PURE__ */ Y(bb, [["__scopeId", "data-v-47e67f04"]]), Kx = cl(() => import("./VoiceFigure-BgnVvdgs.js").then((e) => e.V)), Yx = "1.0.0", Jx = "3.5";
export {
  zl as $,
  Me as A,
  Ce as B,
  rx as C,
  ts as D,
  st as E,
  ax as F,
  Py as G,
  K5 as H,
  ex as I,
  zy as J,
  St as K,
  yy as L,
  Ia as M,
  Zy as N,
  Uy as O,
  es as P,
  w4 as Q,
  E5 as R,
  Ln as S,
  S4 as T,
  k5 as U,
  Se as V,
  Fn as W,
  y5 as X,
  v5 as Y,
  Ul as Z,
  Y as _,
  c5 as a,
  W4 as a$,
  Yy as a0,
  A5 as a1,
  C5 as a2,
  Ae as a3,
  q5 as a4,
  j5 as a5,
  xt as a6,
  O5 as a7,
  X5 as a8,
  Xb as a9,
  B4 as aA,
  v4 as aB,
  iy as aC,
  n4 as aD,
  s4 as aE,
  ox as aF,
  Oi as aG,
  M4 as aH,
  gn as aI,
  a5 as aJ,
  t5 as aK,
  K4 as aL,
  vn as aM,
  X4 as aN,
  G5 as aO,
  y4 as aP,
  k4 as aQ,
  g4 as aR,
  an as aS,
  bt as aT,
  Qb as aU,
  Z0 as aV,
  m4 as aW,
  S5 as aX,
  Ai as aY,
  Lt as aZ,
  qt as a_,
  H4 as aa,
  J4 as ab,
  i5 as ac,
  w5 as ad,
  b5 as ae,
  D5 as af,
  P5 as ag,
  F5 as ah,
  f5 as ai,
  Do as aj,
  T5 as ak,
  Z5 as al,
  cx as am,
  u4 as an,
  l4 as ao,
  i4 as ap,
  W5 as aq,
  L5 as ar,
  B5 as as,
  N5 as at,
  $4 as au,
  J5 as av,
  Q5 as aw,
  hx as ax,
  Kt as ay,
  e4 as az,
  lk as b,
  dx as b$,
  By as b0,
  Z4 as b1,
  A4 as b2,
  E4 as b3,
  bv as b4,
  pi as b5,
  j4 as b6,
  Y5 as b7,
  as as b8,
  it as b9,
  O4 as bA,
  N4 as bB,
  dt as bC,
  _4 as bD,
  D4 as bE,
  t4 as bF,
  d4 as bG,
  a4 as bH,
  Oe as bI,
  V5 as bJ,
  P4 as bK,
  wx as bL,
  bx as bM,
  Jb as bN,
  ev as bO,
  U5 as bP,
  T4 as bQ,
  u5 as bR,
  lx as bS,
  C4 as bT,
  I4 as bU,
  R4 as bV,
  H5 as bW,
  ly as bX,
  z5 as bY,
  r4 as bZ,
  ix as b_,
  L4 as ba,
  $s as bb,
  mr as bc,
  mx as bd,
  vx as be,
  x4 as bf,
  G4 as bg,
  Zb as bh,
  c4 as bi,
  px as bj,
  I5 as bk,
  R5 as bl,
  p5 as bm,
  _5 as bn,
  s5 as bo,
  z4 as bp,
  d5 as bq,
  h5 as br,
  g5 as bs,
  f4 as bt,
  V0 as bu,
  Q4 as bv,
  Hy as bw,
  m5 as bx,
  o5 as by,
  h4 as bz,
  Ve as c,
  cn as c$,
  n5 as c0,
  e5 as c1,
  o4 as c2,
  yx as c3,
  Da as c4,
  kx as c5,
  zi as c6,
  V4 as c7,
  $5 as c8,
  x5 as c9,
  Jx as cA,
  Nb as cB,
  Nx as cC,
  Qs as cD,
  zb as cE,
  Vg as cF,
  Bt as cG,
  la as cH,
  Sa as cI,
  Tb as cJ,
  Db as cK,
  Ol as cL,
  Wp as cM,
  Hx as cN,
  Rb as cO,
  Vx as cP,
  Ix as cQ,
  sc as cR,
  Mb as cS,
  Gb as cT,
  tw as cU,
  Jr as cV,
  Pb as cW,
  Pt as cX,
  tm as cY,
  Wb as cZ,
  Sb as c_,
  J0 as ca,
  r5 as cb,
  Fy as cc,
  p4 as cd,
  Ca as ce,
  ny as cf,
  b4 as cg,
  Yt as ch,
  It as ci,
  Eb as cj,
  Bx as ck,
  ye as cl,
  Zn as cm,
  Cb as cn,
  cf as co,
  Ux as cp,
  Yb as cq,
  Hm as cr,
  Dn as cs,
  xx as ct,
  $b as cu,
  Rt as cv,
  Lb as cw,
  ge as cx,
  Lx as cy,
  Yx as cz,
  wv as d,
  zx as d0,
  Ki as d1,
  jb as d2,
  lt as d3,
  qb as d4,
  os as d5,
  Kx as d6,
  Gx as d7,
  Kr as d8,
  Ex as d9,
  ut as dA,
  Ak as dB,
  Fb as dC,
  Rx as dD,
  Sk as dE,
  Dx as dF,
  Ep as dG,
  Vr as dH,
  uw as dI,
  ii as dJ,
  Cx as dK,
  Xs as dL,
  Ox as dM,
  Tx as dN,
  jt as dO,
  jx as dP,
  p1 as da,
  Ua as db,
  g1 as dc,
  Fx as dd,
  qx as de,
  Ab as df,
  Wx as dg,
  Kb as dh,
  Vb as di,
  Ub as dj,
  Mx as dk,
  Wd as dl,
  $x as dm,
  Px as dn,
  jg as dp,
  Ek as dq,
  _b as dr,
  Bb as ds,
  _x as dt,
  Ax as du,
  Fe as dv,
  Ob as dw,
  Ib as dx,
  Sx as dy,
  Hb as dz,
  We as e,
  z0 as f,
  M5 as g,
  fx as h,
  on as i,
  tx as j,
  gx as k,
  U4 as l,
  nx as m,
  fk as n,
  Y4 as o,
  l5 as p,
  Ra as q,
  Hi as r,
  Ui as s,
  je as t,
  sx as u,
  $v as v,
  ux as w,
  q4 as x,
  F4 as y,
  kn as z
};
